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

import express from "express";
import multer from "multer";

const PORT = Number(process.env.PORT ?? 5174);
// Absolute path to the jiho-video-worker checkout.
const WORKER_DIR = process.env.WORKER_DIR ?? path.resolve(process.cwd(), "../../../jiho-video-worker");
// Command that runs Python with the worker deps (uv-managed venv by default).
const WORKER_BIN = process.env.WORKER_BIN ?? "uv";
const WORKER_ARGS_PREFIX = (process.env.WORKER_ARGS ?? "run python").split(" ");
// Real API base + admin v2 prefix.
const API_BASE_URL = (process.env.API_BASE_URL ?? "http://localhost:4000").replace(/\/$/, "");
const API_PREFIX = process.env.API_PREFIX ?? "/api/v2/admin";

const RESULT_PREFIX = "RESULT_JSON:";

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

const upload = multer({ dest: path.join(os.tmpdir(), "jiho-internal-uploads") });
const app = express();
app.use(express.json());

/** Run local_runner.py and return its parsed RESULT_JSON. */
function runWorker(videoPath: string, outputDir: string): Promise<RunnerResult> {
  return new Promise((resolve, reject) => {
    const args = [...WORKER_ARGS_PREFIX, "local_runner.py", videoPath, "--output", outputDir];
    const child = spawn(WORKER_BIN, args, { cwd: WORKER_DIR });

    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => (stdout += chunk.toString()));
    child.stderr.on("data", (chunk) => (stderr += chunk.toString()));

    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`worker exited with code ${code}: ${stderr.slice(-500)}`));
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
        reject(new Error(`failed to parse RESULT_JSON: ${(error as Error).message}`));
      }
    });
  });
}

async function readDurationSec(outputDir: string): Promise<number | null> {
  try {
    const raw = await fsp.readFile(path.join(outputDir, "events.json"), "utf-8");
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

  const outputDir = await fsp.mkdtemp(path.join(os.tmpdir(), "jiho-highlights-"));
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
    res.status(500).json({ message: (error as Error).message });
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

app.post("/upload", async (req, res) => {
  const sessionId = (req.body as { sessionId?: string }).sessionId;
  const session = sessionId ? sessions.get(sessionId) : undefined;
  if (!session) {
    res.status(404).json({ message: "session not found" });
    return;
  }

  try {
    // 1) Create the job + highlight rows.
    const ingestRes = await fetch(`${API_BASE_URL}${API_PREFIX}/videos/ingest`, {
      method: "POST",
      headers: { "content-type": "application/json" },
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
    });
    if (!ingestRes.ok) {
      throw new Error(`ingest failed (${ingestRes.status}): ${await ingestRes.text()}`);
    }
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
      form.append("file", new Blob([buffer], { type: "video/mp4" }), `highlight_${index + 1}.mp4`);

      const clipRes = await fetch(`${API_BASE_URL}${API_PREFIX}/highlights/${highlightId}/clip`, {
        method: "POST",
        body: form,
      });
      if (!clipRes.ok) {
        throw new Error(`clip upload failed (${clipRes.status}): ${await clipRes.text()}`);
      }
      uploadedClips += 1;
    }

    res.json({ jobId: ingest.jobId, uploadedClips });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(`[internal-sidecar] listening on http://localhost:${PORT}`);
  console.log(`[internal-sidecar] worker dir: ${WORKER_DIR}`);
  console.log(`[internal-sidecar] api: ${API_BASE_URL}${API_PREFIX}`);
});
