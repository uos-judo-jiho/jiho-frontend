/**
 * Local sidecar for the internal highlight uploader.
 *
 * Responsibilities:
 *  1. Receive one or more local videos from the browser (POST /process) and
 *     queue them.
 *  2. Run the Python jiho-video-worker (local_runner.py) on them one at a time.
 *  3. Persist each finished result (clips + metadata + original) under
 *     {WORKER_DIR}/.tmp/yyyymmdd/<id>/ so an interrupted/restarted process can
 *     recover not-yet-uploaded work.
 *  4. Serve produced clips for in-browser preview (GET /clip/...).
 *  5. On request, upload one finished item to the real API (POST /upload):
 *       POST {API}/videos/ingest            -> creates job + highlight rows
 *       POST {API}/highlights/:id/clip      -> uploads each clip file
 *     On success the cache entry is deleted so it no longer reappears.
 *
 * This process runs only on the operator's workstation; it is never deployed.
 */
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import archiver from "archiver";
import express from "express";
import multer from "multer";

// Node 22 provides loadEnvFile(), but this app still uses Node 18 type definitions.
const loadEnvFile = (
  process as NodeJS.Process & { loadEnvFile(path?: string): void }
).loadEnvFile;
try {
  loadEnvFile(fileURLToPath(new URL("../.env", import.meta.url)));
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
}

const PORT = Number(process.env.PORT ?? 5174);
// Absolute path to the jiho-video-worker checkout.
const WORKER_DIR =
  process.env.WORKER_DIR ??
  path.resolve(process.cwd(), "../../../jiho-video-worker");
// Command that runs Python with the worker deps (uv-managed venv by default).
const WORKER_BIN = process.env.WORKER_BIN ?? "uv";
const WORKER_ARGS_PREFIX = (process.env.WORKER_ARGS ?? "run python").split(" ");
// Real API base + admin v2 prefix.
const API_BASE_URL = (
  process.env.API_BASE_URL ?? "http://localhost:4000"
).replace(/\/$/, "");
const API_PREFIX = process.env.API_PREFIX ?? "/api/v2/admin";

// Persistent cache for finished-but-not-uploaded work.
const CACHE_ROOT = path.join(WORKER_DIR, ".tmp");

const RESULT_PREFIX = "RESULT_JSON:";
const MAX_ORIGINAL_UPLOAD_BYTES = 60 * 1024 * 1024;

function errorMessage(error: unknown): string {
  if (!(error instanceof Error)) return String(error);
  return error.cause === undefined
    ? error.message
    : `${error.message}: ${errorMessage(error.cause)}`;
}

class UpstreamError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

async function assertUpstreamResponse(
  response: Response,
  operation: string,
): Promise<void> {
  if (!response.ok) {
    throw new UpstreamError(
      response.status,
      `${operation} failed (${response.status}): ${await response.text()}`,
    );
  }
}

interface RunnerEvent {
  event_sec: number;
  start_sec: number;
  end_sec: number;
  confidence: number;
  clip_file: string;
}

interface RunnerResult {
  video_id: string;
  original_filename: string;
  output_dir: string;
  events: RunnerEvent[];
}

type ItemStatus = "queued" | "processing" | "done" | "failed";

interface QueueItem {
  id: string;
  originalFilename: string;
  status: ItemStatus;
  createdAt: string;
  /** Original to process: multer temp path before processing, cached source after. */
  inputVideo?: string;
  /** {CACHE_ROOT}/yyyymmdd/<id> once processed. */
  cacheDir?: string;
  durationSec: number | null;
  events: RunnerEvent[];
  /** Whether a cached source video exists (enables optional original upload). */
  hasOriginal: boolean;
  error?: string;
}

const queue: QueueItem[] = [];

const upload = multer({
  dest: path.join(os.tmpdir(), "jiho-internal-uploads"),
});
const app = express();
app.use(express.json());

function yyyymmdd(date = new Date()): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");
}

function dtoOf(item: QueueItem) {
  return {
    id: item.id,
    originalFilename: item.originalFilename,
    status: item.status,
    createdAt: item.createdAt,
    durationSec: item.durationSec,
    hasOriginal: item.hasOriginal,
    error: item.error ?? null,
    highlights: item.events.map((event, index) => ({
      index,
      eventSec: event.event_sec,
      startSec: event.start_sec,
      endSec: event.end_sec,
      confidence: event.confidence,
      clipUrl: `/clip/${item.id}/${index}`,
    })),
  };
}

/** Run local_runner.py and return its parsed RESULT_JSON. */
function runWorker(
  videoPath: string,
  outputDir: string,
): Promise<RunnerResult> {
  return new Promise((resolve, reject) => {
    const args = [
      ...WORKER_ARGS_PREFIX,
      "local_runner.py",
      videoPath,
      "--output",
      outputDir,
    ];
    const child = spawn(WORKER_BIN, args, { cwd: WORKER_DIR });

    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => (stdout += chunk.toString()));
    child.stderr.on("data", (chunk) => (stderr += chunk.toString()));

    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(`worker exited with code ${code}: ${stderr.slice(-500)}`),
        );
        return;
      }
      const line = stdout
        .split(/\r?\n/)
        .reverse()
        .find((l) => l.startsWith(RESULT_PREFIX));
      if (!line) {
        reject(new Error("worker did not emit RESULT_JSON"));
        return;
      }
      try {
        resolve(JSON.parse(line.slice(RESULT_PREFIX.length)) as RunnerResult);
      } catch (error) {
        reject(
          new Error(`failed to parse RESULT_JSON: ${(error as Error).message}`),
        );
      }
    });
  });
}

async function readDurationSec(outputDir: string): Promise<number | null> {
  try {
    const raw = await fsp.readFile(
      path.join(outputDir, "events.json"),
      "utf-8",
    );
    const parsed = JSON.parse(raw) as { duration_sec?: number };
    return parsed.duration_sec ?? null;
  } catch {
    return null;
  }
}

/** Process one queued item: run the worker into a persistent cache dir. */
async function processItem(item: QueueItem): Promise<void> {
  const cacheDir = path.join(CACHE_ROOT, yyyymmdd(), item.id);
  await fsp.mkdir(cacheDir, { recursive: true });
  item.cacheDir = cacheDir;

  const result = await runWorker(item.inputVideo!, cacheDir);

  // Copy the original into the cache so a later restart can still upload it.
  const ext = path.extname(item.originalFilename) || ".mp4";
  const cachedSource = path.join(cacheDir, `source${ext}`);
  try {
    await fsp.copyFile(item.inputVideo!, cachedSource);
    item.hasOriginal = true;
  } catch {
    item.hasOriginal = false;
  }

  // Drop the multer temp upload now that everything lives in the cache.
  if (item.inputVideo && item.inputVideo !== cachedSource) {
    await fsp.rm(item.inputVideo, { force: true });
  }
  item.inputVideo = item.hasOriginal ? cachedSource : undefined;

  item.durationSec = await readDurationSec(cacheDir);
  item.events = result.events;
  item.originalFilename = item.originalFilename || result.original_filename;
}

let pumping = false;
async function pump(): Promise<void> {
  if (pumping) return;
  pumping = true;
  try {
    for (;;) {
      const item = queue.find((i) => i.status === "queued");
      if (!item) break;
      item.status = "processing";
      try {
        await processItem(item);
        item.status = "done";
      } catch (error) {
        item.status = "failed";
        item.error = errorMessage(error);
        if (item.cacheDir) {
          await fsp.rm(item.cacheDir, { recursive: true, force: true });
          item.cacheDir = undefined;
        }
      }
    }
  } finally {
    pumping = false;
  }
}

/** Rebuild not-yet-uploaded items from the on-disk cache on startup. */
async function rehydrateCache(): Promise<void> {
  let dateDirs: string[];
  try {
    dateDirs = await fsp.readdir(CACHE_ROOT);
  } catch {
    return; // no cache yet
  }

  for (const dateDir of dateDirs) {
    const datePath = path.join(CACHE_ROOT, dateDir);
    let idDirs: string[];
    try {
      idDirs = await fsp.readdir(datePath);
    } catch {
      continue;
    }

    for (const id of idDirs) {
      const cacheDir = path.join(datePath, id);
      const resultPath = path.join(cacheDir, "result.json");
      try {
        const result = JSON.parse(
          await fsp.readFile(resultPath, "utf-8"),
        ) as RunnerResult;
        const entries = await fsp.readdir(cacheDir);
        const source = entries.find((name) => name.startsWith("source."));
        const stat = await fsp.stat(cacheDir);

        queue.push({
          id,
          originalFilename:
            result.original_filename || `${result.video_id ?? id}.mp4`,
          status: "done",
          createdAt: stat.mtime.toISOString(),
          inputVideo: source ? path.join(cacheDir, source) : undefined,
          cacheDir,
          durationSec: await readDurationSec(cacheDir),
          events: result.events ?? [],
          hasOriginal: !!source,
        });
      } catch {
        // No result.json (partial/crashed run) — skip.
      }
    }
  }

  queue.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  if (queue.length > 0) {
    console.log(
      `[internal-sidecar] recovered ${queue.length} cached item(s) from ${CACHE_ROOT}`,
    );
  }
}

app.post("/process", upload.array("videos"), async (req, res) => {
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  if (files.length === 0) {
    res.status(400).json({ message: "video file is required" });
    return;
  }

  for (const file of files) {
    queue.push({
      id: randomUUID(),
      originalFilename: file.originalname || "video.mp4",
      status: "queued",
      createdAt: new Date().toISOString(),
      inputVideo: file.path,
      durationSec: null,
      events: [],
      hasOriginal: false,
    });
  }

  void pump();
  res.status(202).json({ items: queue.map(dtoOf) });
});

app.get("/queue", (_req, res) => {
  res.json({ items: queue.map(dtoOf) });
});

app.get("/clip/:id/:index", (req, res) => {
  const item = queue.find((i) => i.id === req.params.id);
  const index = Number(req.params.index);
  const event = item?.events[index];
  if (!item || !event) {
    res.status(404).json({ message: "clip not found" });
    return;
  }
  res.type("video/mp4");
  fs.createReadStream(event.clip_file).pipe(res);
});

app.get("/download/:id", (req, res) => {
  const item = queue.find((i) => i.id === req.params.id);
  if (!item) {
    res.status(404).json({ message: "item not found" });
    return;
  }
  if (item.events.length === 0) {
    res.status(400).json({ message: "no highlights to download" });
    return;
  }

  const baseName =
    path
      .parse(item.originalFilename)
      .name.replace(/[^a-zA-Z0-9_-]+/g, "_")
      .replace(/^_+|_+$/g, "") || "video";
  const archive = archiver("zip", { zlib: { level: 9 } });

  res.attachment(`${baseName}_highlights.zip`);
  archive.on("error", (error) => {
    if (!res.headersSent)
      res.status(500).json({ message: errorMessage(error) });
    else res.destroy(error);
  });
  archive.pipe(res);

  item.events.forEach((event, index) => {
    archive.file(event.clip_file, {
      name: `highlight_${String(index + 1).padStart(2, "0")}.mp4`,
    });
  });
  void archive.finalize();
});

app.post("/upload", async (req, res) => {
  const { id, uploadOriginal } = req.body as {
    id?: string;
    uploadOriginal?: boolean;
  };
  const item = id ? queue.find((i) => i.id === id) : undefined;
  if (!item) {
    res.status(404).json({ message: "item not found" });
    return;
  }
  if (item.status !== "done") {
    res.status(409).json({ message: "아직 처리되지 않은 항목입니다." });
    return;
  }

  const cookie = req.get("cookie");
  if (!cookie) {
    res.status(401).json({ message: "로그인이 필요합니다." });
    return;
  }

  const wantOriginal = !!uploadOriginal && item.hasOriginal && !!item.inputVideo;

  try {
    if (wantOriginal) {
      const { size } = await fsp.stat(item.inputVideo!);
      if (size > MAX_ORIGINAL_UPLOAD_BYTES) {
        res.status(413).json({
          message: "원본 영상은 최대 60MB까지 업로드할 수 있습니다.",
        });
        return;
      }
    }

    // 1) Create the job + highlight rows.
    const ingestRes = await fetch(
      `${API_BASE_URL}${API_PREFIX}/videos/ingest`,
      {
        method: "POST",
        headers: { "content-type": "application/json", cookie },
        body: JSON.stringify({
          originalFilename: item.originalFilename,
          durationSec: item.durationSec,
          events: item.events.map((event) => ({
            eventSec: event.event_sec,
            startSec: event.start_sec,
            endSec: event.end_sec,
            confidence: event.confidence,
          })),
        }),
      },
    );
    await assertUpstreamResponse(ingestRes, "ingest");
    const ingest = (await ingestRes.json()) as {
      jobId: number;
      highlights: { highlightId: number; index: number }[];
    };

    // 2) Upload each clip file to its highlight.
    let uploadedClips = 0;
    for (const { highlightId, index } of ingest.highlights) {
      const event = item.events[index];
      if (!event) continue;
      const buffer = await fsp.readFile(event.clip_file);
      const form = new FormData();
      form.append(
        "file",
        new Blob([buffer], { type: "video/mp4" }),
        `highlight_${index + 1}.mp4`,
      );

      const clipRes = await fetch(
        `${API_BASE_URL}${API_PREFIX}/highlights/${highlightId}/clip`,
        { method: "POST", headers: { cookie }, body: form },
      );
      await assertUpstreamResponse(clipRes, "clip upload");
      uploadedClips += 1;
    }

    // 3) Optionally upload the original (off by default to save bucket capacity).
    let uploadedOriginal = false;
    if (wantOriginal) {
      const buffer = await fsp.readFile(item.inputVideo!);
      const form = new FormData();
      form.append(
        "file",
        new Blob([buffer], { type: "video/mp4" }),
        item.originalFilename,
      );

      const srcRes = await fetch(
        `${API_BASE_URL}${API_PREFIX}/videos/${ingest.jobId}/source`,
        { method: "POST", headers: { cookie }, body: form },
      );
      await assertUpstreamResponse(srcRes, "original upload");
      uploadedOriginal = true;
    }

    // Success — drop the cache entry so it won't be offered again.
    await discardItem(item);

    res.json({ jobId: ingest.jobId, uploadedClips, uploadedOriginal });
  } catch (error) {
    const status = error instanceof UpstreamError ? error.status : 500;
    res.status(status).json({ message: errorMessage(error) });
  }
});

app.delete("/queue/:id", async (req, res) => {
  const item = queue.find((i) => i.id === req.params.id);
  if (!item) {
    res.status(404).json({ message: "item not found" });
    return;
  }
  if (item.status === "processing") {
    res.status(409).json({ message: "처리 중인 항목은 삭제할 수 없습니다." });
    return;
  }
  await discardItem(item);
  res.status(204).end();
});

/** Remove an item from the queue and delete its on-disk cache/temp files. */
async function discardItem(item: QueueItem): Promise<void> {
  const index = queue.indexOf(item);
  if (index !== -1) queue.splice(index, 1);
  if (item.cacheDir) {
    await fsp.rm(item.cacheDir, { recursive: true, force: true });
  } else if (item.inputVideo) {
    await fsp.rm(item.inputVideo, { force: true });
  }
}

async function main(): Promise<void> {
  await rehydrateCache();
  app.listen(PORT, () => {
    console.log(`[internal-sidecar] listening on http://localhost:${PORT}`);
    console.log(`[internal-sidecar] worker dir: ${WORKER_DIR}`);
    console.log(`[internal-sidecar] cache dir: ${CACHE_ROOT}`);
    console.log(`[internal-sidecar] api: ${API_BASE_URL}${API_PREFIX}`);
  });
}

void main();
