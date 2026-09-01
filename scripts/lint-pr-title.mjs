#!/usr/bin/env node
/**
 * PR 제목 검사기.
 *
 * 이 저장소는 PR 을 squash 머지하므로 **PR 제목이 곧 main 의 커밋 제목**이고,
 * 릴리즈 노트(scripts/release-note.mjs)는 그 제목의 타입 · 스코프로
 * "어느 앱의 노트에 넣을지"를 정한다. 그래서 제목 컨벤션을 CI 에서 강제한다.
 *
 *   type(scope[,scope...])[!]: subject
 *
 * 허용 타입/스코프는 scripts/lib/commit-convention.mjs 가 저장소 구조에서 만든다.
 *
 * 사용법
 *   node scripts/lint-pr-title.mjs --title "feat(web): 제목"
 *   PR_TITLE="feat(web): 제목" node scripts/lint-pr-title.mjs
 */
import { appendFileSync } from "node:fs";

import {
  ALL_SCOPE,
  COMMIT_TYPES,
  KNOWN_TYPES,
  describeScopes,
  listScopeTargets,
  parseHeader,
  resolveScope,
} from "./lib/commit-convention.mjs";

/** 제목 길이 상한. GitHub 릴리즈 노트/커밋 로그에서 잘리지 않는 선. */
const MAX_LENGTH = 100;

function readTitle(argv) {
  const index = argv.indexOf("--title");
  if (index !== -1 && argv[index + 1]) return argv[index + 1];
  return process.env.PR_TITLE ?? "";
}

function lint(title) {
  const targets = listScopeTargets();
  const errors = [];
  const trimmed = title.trim();

  if (!trimmed) return ["PR 제목이 비어 있습니다."];

  const parsed = parseHeader(trimmed);

  if (!parsed.header) {
    return [
      "`type(scope): subject` 형식이 아닙니다.",
      ...(/^(\w+)(\([^)]*\))?\s*:/.test(trimmed)
        ? []
        : ["콜론(`:`) 뒤에 공백과 제목이 있어야 합니다."]),
    ];
  }

  if (!KNOWN_TYPES.has(parsed.type)) {
    errors.push(
      `\`${parsed.type}\` 은 허용되지 않는 타입입니다. (허용: ${[...KNOWN_TYPES].join(", ")})`,
    );
  }

  if (parsed.rawScope === null) {
    errors.push(
      `스코프가 없습니다. 어느 앱/패키지의 변경인지 항상 명시해야 합니다. 저장소 전체 공통이면 \`${parsed.type}(${ALL_SCOPE}):\` 로 적습니다.`,
    );
  } else if (!parsed.scopes.length) {
    errors.push("스코프 괄호가 비어 있습니다.");
  } else {
    const unknown = parsed.scopes.filter((scope) => !resolveScope(scope, targets));
    if (unknown.length) {
      errors.push(
        `알 수 없는 스코프: ${unknown.map((s) => `\`${s}\``).join(", ")}`,
      );
    }
    if (parsed.scopes.length > 1 && parsed.scopes.includes(ALL_SCOPE)) {
      errors.push(
        `\`${ALL_SCOPE}\` 는 다른 스코프와 함께 쓸 수 없습니다. (이미 전체를 뜻함)`,
      );
    }
    const seen = new Set();
    for (const scope of parsed.scopes) {
      const key = resolveScope(scope, targets)?.name ?? scope.toLowerCase();
      if (seen.has(key)) errors.push(`스코프가 중복됩니다: \`${scope}\``);
      seen.add(key);
    }
  }

  if (!parsed.subject.trim()) {
    errors.push("콜론 뒤 제목이 비어 있습니다.");
  } else if (/[.]$/.test(parsed.subject.trim())) {
    errors.push("제목 끝에 마침표를 붙이지 않습니다.");
  }

  if (trimmed.length > MAX_LENGTH) {
    errors.push(`제목이 너무 깁니다. (${trimmed.length}자 / 최대 ${MAX_LENGTH}자)`);
  }

  return errors;
}

function help() {
  const scopes = describeScopes();
  return [
    "### 형식",
    "",
    "```",
    "type(scope[,scope...])[!]: subject",
    "```",
    "",
    "### 타입",
    "",
    ...COMMIT_TYPES.map(([type, label]) => `- \`${type}\` — ${label}`),
    "",
    "### 스코프 (필수)",
    "",
    ...scopes.map((scope) => `- \`${scope}\``),
    "",
    "여러 대상을 건드렸으면 쉼표로 나열합니다: `feat(web,admin): ...`",
    "",
    "### 예시",
    "",
    "```",
    "feat(admin): 훈련일지 참여 인원 드롭다운",
    "fix(web): SSR 해시 불일치로 인한 자산 404 수정",
    "feat(web,admin): 게시글 좋아요 UI",
    "refactor(api): orval 클라이언트 재생성",
    "ci(*): 릴리즈 노트 워크플로우 추가",
    "feat(web)!: 레거시 라우트 제거",
    "```",
    "",
    "> 스코프는 릴리즈 노트가 커밋을 앱별로 나누는 기준입니다.",
    "> 스코프를 잘못 적으면 다른 앱의 릴리즈 노트에 섞여 들어갑니다.",
  ];
}

const title = readTitle(process.argv.slice(2));
const errors = lint(title);

const summary = [
  "## PR 제목 검사",
  "",
  `\`${title.trim() || "(비어 있음)"}\``,
  "",
];

if (!errors.length) {
  summary.push("✅ 커밋 컨벤션을 만족합니다.");
  process.stdout.write(`${summary.join("\n")}\n`);
} else {
  summary.push(
    "❌ 아래 문제를 고쳐 주세요. (PR 제목을 수정하면 자동으로 다시 검사합니다)",
    "",
    ...errors.map((message) => `- ${message}`),
    "",
    ...help(),
  );
  process.stdout.write(`${summary.join("\n")}\n`);
  for (const message of errors) {
    process.stderr.write(`::error title=PR 제목 컨벤션::${message}\n`);
  }
}

if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary.join("\n")}\n`);
}

process.exit(errors.length ? 1 : 0);
