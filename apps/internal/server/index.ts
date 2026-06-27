/**
 * Local sidecar for the internal highlight uploader.
 *
 * Responsibilities:
 *  1. Receive a local video from the browser (POST /process).
 *  2. Run the Python jiho-video-worker (local_runner.py) on it.
 *  3. Serve the produced clips back for in-browser preview (GET /clip/...).
 *  4. On request, upload the highlights to the real API (POST /upload):
 *       POST {API}/videos/ingest            -> creates job + highlight rows
 *       POST {API}/highlights/:id/clip      -> uploads each clip file
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

interface Session {
  originalFilename: string;
  durationSec: number | null;
  tempVideo: string;
  outputDir: string;
  events: RunnerEvent[];
}

const sessions = new Map<string, Session>();

const upload = multer({
  dest: path.join(os.tmpdir(), "jiho-internal-uploads"),
});
const app = express();
app.use(express.json());

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

app.post("/process", upload.single("video"), async (req, res) => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ message: "video file is required" });
    return;
  }

  const outputDir = await fsp.mkdtemp(
    path.join(os.tmpdir(), "jiho-highlights-"),
  );
  try {
    const result = await runWorker(file.path, outputDir);
    const durationSec = await readDurationSec(outputDir);
    const sessionId = randomUUID();

    sessions.set(sessionId, {
      originalFilename: file.originalname || result.original_filename,
      durationSec,
      tempVideo: file.path,
      outputDir,
      events: result.events,
    });

    res.json({
      sessionId,
      originalFilename: file.originalname || result.original_filename,
      durationSec,
      highlights: result.events.map((event, index) => ({
        index,
        eventSec: event.event_sec,
        startSec: event.start_sec,
        endSec: event.end_sec,
        confidence: event.confidence,
        clipUrl: `/clip/${sessionId}/${index}`,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: errorMessage(error) });
  }
});

app.get("/clip/:sessionId/:index", (req, res) => {
  const session = sessions.get(req.params.sessionId);
  const index = Number(req.params.index);
  const event = session?.events[index];
  if (!session || !event) {
    res.status(404).json({ message: "clip not found" });
    return;
  }
  res.type("video/mp4");
  fs.createReadStream(event.clip_file).pipe(res);
});

app.get("/download/:sessionId", (req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) {
    res.status(404).json({ message: "session not found" });
    return;
  }
  if (session.events.length === 0) {
    res.status(400).json({ message: "no highlights to download" });
    return;
  }

  const baseName =
    path
      .parse(session.originalFilename)
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

  session.events.forEach((event, index) => {
    archive.file(event.clip_file, {
      name: `highlight_${String(index + 1).padStart(2, "0")}.mp4`,
    });
  });
  void archive.finalize();
});

app.post("/upload", async (req, res) => {
  const { sessionId, uploadOriginal } = req.body as {
    sessionId?: string;
    uploadOriginal?: boolean;
  };
  const session = sessionId ? sessions.get(sessionId) : undefined;
  if (!session) {
    res.status(404).json({ message: "session not found" });
    return;
  }

  const cookie = req.get("cookie");
  if (!cookie) {
    res.status(401).json({ message: "로그인이 필요합니다." });
    return;
  }

  try {
    if (uploadOriginal) {
      const { size } = await fsp.stat(session.tempVideo);
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
          originalFilename: session.originalFilename,
          durationSec: session.durationSec,
          events: session.events.map((event) => ({
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
      const event = session.events[index];
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
        {
          method: "POST",
          headers: { cookie },
          body: form,
        },
      );
      await assertUpstreamResponse(clipRes, "clip upload");
      uploadedClips += 1;
    }

    // 3) Optionally upload the original (off by default to save bucket capacity).
    //    The job already groups the original with its highlights, mapping them.
    let uploadedOriginal = false;
    if (uploadOriginal) {
      const buffer = await fsp.readFile(session.tempVideo);
      const form = new FormData();
      form.append(
        "file",
        new Blob([buffer], { type: "video/mp4" }),
        session.originalFilename,
      );

      const srcRes = await fetch(
        `${API_BASE_URL}${API_PREFIX}/videos/${ingest.jobId}/source`,
        {
          method: "POST",
          headers: { cookie },
          body: form,
        },
      );
      await assertUpstreamResponse(srcRes, "original upload");
      uploadedOriginal = true;
    }

    res.json({ jobId: ingest.jobId, uploadedClips, uploadedOriginal });
  } catch (error) {
    const status = error instanceof UpstreamError ? error.status : 500;
    res.status(status).json({ message: errorMessage(error) });
  }
});

app.listen(PORT, () => {
  console.log(`[internal-sidecar] listening on http://localhost:${PORT}`);
  console.log(`[internal-sidecar] worker dir: ${WORKER_DIR}`);
  console.log(`[internal-sidecar] api: ${API_BASE_URL}${API_PREFIX}`);
});
