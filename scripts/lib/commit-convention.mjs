/**
 * 커밋 · PR 제목 컨벤션 (Conventional Commits + 필수 스코프).
 *
 *   type(scope[,scope...])[!]: subject
 *
 * 스코프 값은 저장소 구조에서 그대로 끌어온다.
 *   - apps/*     디렉토리명  →  web, admin, internal, shorts   (풀 경로 apps/web 도 허용)
 *   - packages/* 디렉토리명  →  api, auth, jds                 (풀 경로 packages/api 도 허용)
 *   - `*`                    →  저장소 전체 공통 (CI, 루트 설정, 의존성 등)
 *
 * 새 앱/패키지를 추가해도 이 파일을 고칠 필요가 없다.
 *
 * scripts/lint-pr-title.mjs (검사) 와 scripts/release-note.mjs (분류) 가
 * 같은 파서를 쓰도록 여기 한 곳에만 둔다.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const REPO_ROOT = execFileSync("git", ["rev-parse", "--show-toplevel"], {
  encoding: "utf8",
}).trim();

/** 릴리즈 노트 섹션 순서 = 허용 타입 순서. */
export const COMMIT_TYPES = [
  ["feat", "🚀 새로운 기능"],
  ["fix", "🐛 버그 수정"],
  ["perf", "⚡ 성능 개선"],
  ["refactor", "♻️ 리팩토링"],
  ["style", "💄 스타일"],
  ["docs", "📝 문서"],
  ["test", "✅ 테스트"],
  ["build", "📦 빌드 · 의존성"],
  ["ci", "🔧 CI/CD"],
  ["chore", "🧹 기타 작업"],
];

export const KNOWN_TYPES = new Set(COMMIT_TYPES.map(([type]) => type));

/** `type(scope)!: subject` */
export const HEADER_RE = /^(\w+)(?:\(([^)]*)\))?(!)?:\s*(.+)$/;

/** 전체 스코프를 뜻하는 값. */
export const ALL_SCOPE = "*";

/* ---------------------------------------------------------- 스코프 목록 */

const workspaceDirs = (group) => {
  const dir = join(REPO_ROOT, group);
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => existsSync(join(dir, name, "package.json")))
    .sort();
};

/** { apps: [...], packages: [...] } */
export function listScopeTargets() {
  return { apps: workspaceDirs("apps"), packages: workspaceDirs("packages") };
}

/**
 * 스코프 문자열 하나를 해석한다.
 * @returns {{ kind: "all" | "app" | "package", name: string } | null}
 */
export function resolveScope(raw, targets = listScopeTargets()) {
  const value = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (!value) return null;
  if (value === ALL_SCOPE) return { kind: "all", name: ALL_SCOPE };

  const [prefix, ...rest] = value.split("/");
  const name = rest.length ? rest.join("/") : value;

  if (rest.length) {
    if (prefix === "apps" && targets.apps.includes(name)) {
      return { kind: "app", name };
    }
    if (prefix === "packages" && targets.packages.includes(name)) {
      return { kind: "package", name };
    }
    return null;
  }

  if (targets.apps.includes(name)) return { kind: "app", name };
  if (targets.packages.includes(name)) return { kind: "package", name };
  return null;
}

/** 사람이 읽는 허용 스코프 목록. */
export function describeScopes(targets = listScopeTargets()) {
  return [
    ...targets.apps.map((name) => `${name} (= apps/${name})`),
    ...targets.packages.map((name) => `${name} (= packages/${name})`),
    `${ALL_SCOPE} (저장소 전체 공통)`,
  ];
}

/* -------------------------------------------------------------- 파싱 */

/** 제목 끝의 `(#123)` 를 떼어내 PR 번호로 분리한다. */
export function splitPullRequest(subject) {
  const matched = /^(.*?)\s*\(#(\d+)\)\s*$/.exec(subject);
  if (!matched) return { text: subject.trim(), pr: null };
  return { text: matched[1].trim(), pr: matched[2] };
}

/**
 * 커밋/PR 제목을 파싱한다. 형식이 아예 안 맞으면 header 가 null.
 *
 * @returns {{
 *   header: boolean, type: string | null, rawScope: string | null,
 *   scopes: string[], breaking: boolean, subject: string
 * }}
 */
export function parseHeader(title) {
  const text = splitPullRequest(String(title ?? "").trim()).text;
  const matched = HEADER_RE.exec(text);
  if (!matched) {
    return {
      header: false,
      type: null,
      rawScope: null,
      scopes: [],
      breaking: false,
      subject: text,
    };
  }

  const rawScope = matched[2] ?? null;
  return {
    header: true,
    type: matched[1].toLowerCase(),
    rawScope,
    scopes:
      rawScope === null
        ? []
        : rawScope
            .split(",")
            .map((part) => part.trim())
            .filter(Boolean),
    breaking: matched[3] === "!",
    subject: matched[4],
  };
}

/* ------------------------------------------------------- 의존 그래프 */

/**
 * 앱이 의존하는 workspace 패키지 이름 목록.
 * (`@packages/api` → `api`)
 */
export function packagesUsedBy(app) {
  const path = join(REPO_ROOT, "apps", app, "package.json");
  if (!existsSync(path)) return [];
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return [];
  }
  const deps = { ...manifest.dependencies, ...manifest.devDependencies };
  return Object.entries(deps)
    .filter(([, range]) => String(range).startsWith("workspace:"))
    .map(([name]) => name.split("/").pop())
    .filter(Boolean)
    .sort();
}
