#!/usr/bin/env node
/**
 * 앱별 릴리즈 노트 생성기.
 *
 * apps/<app>/package.json 의 version 이 올라간 것을 감지해서,
 * 해당 앱의 "이전 릴리즈 태그 ~ 현재 커밋" 사이의 squash 머지 커밋으로
 * Conventional Commits 기반 릴리즈 노트를 만든다.
 *
 * 태그 세 종류를 구분한다.
 *   릴리즈 태그   <name>@<version>                        예) web@1.13.4, api@0.2.0
 *                 version 이 올라갈 때만. detect 가 찾는다.
 *   스냅샷 태그   <name>@<version>-<YYYYMMDD>-<HHmm>      예) web@2.1.0-20260902-0346
 *                 코드가 바뀌면 항상. snapshot 이 찾는다. (KST, 커밋 시각 기준)
 *   배포 태그     @uos-judo-jiho/<app>-<YYMMDD>-<HHMMSS>-<hash>   (tag-release.yml)
 *
 * detect / snapshot 은 apps/* 와 packages/* 를 모두 볼 수 있다. 릴리즈 노트는
 * apps 전용이고, packages 는 태그만 만든다 (tag-workspace.yml). 태그 형식은
 * 양쪽이 같다 — apps/* 와 packages/* 는 커밋 스코프에서 이미 하나의 평평한
 * 이름 공간이라 이름이 겹치지 않는다.
 *
 * 사용법
 *   node scripts/release-note.mjs detect [--dir apps|packages] [--base <ref>]
 *                                        [--head <ref>] [--project <name>] [--all]
 *   node scripts/release-note.mjs snapshot [--dir apps|packages] [--base <ref>] [--head <ref>]
 *     (snapshot 만 pnpm 을 호출한다 — 변경 프로젝트 판정을 pnpm 필터에 맡긴다)
 *   node scripts/release-note.mjs notes --app web [--version 1.13.4] [--from <tag>] [--to <ref>]
 */
import { execFileSync } from "node:child_process";
import { appendFileSync } from "node:fs";
import { relative } from "node:path";

import {
  COMMIT_TYPES,
  HEADER_RE,
  KNOWN_TYPES,
  REPO_ROOT,
  listScopeTargets,
  splitPullRequest,
} from "./lib/commit-convention.mjs";

/* ------------------------------------------------------------------ util */

/** git 실행. allowFail 이면 실패 시 null 을 돌려준다. */
function git(args, { allowFail = false } = {}) {
  try {
    return execFileSync("git", args, {
      cwd: REPO_ROOT,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    }).trim();
  } catch (error) {
    if (allowFail) return null;
    throw error;
  }
}

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token.startsWith("--")) {
      const key = token.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) {
        out[key] = true;
      } else {
        out[key] = next;
        i += 1;
      }
    } else {
      out._.push(token);
    }
  }
  return out;
}

/** --foo 값이 실제 문자열일 때만 돌려준다. (--foo 만 준 경우는 true 라서 제외) */
const optional = (value) => (typeof value === "string" && value ? value : null);

/* ---------------------------------------------------------------- semver */

function parseSemver(value) {
  const matched = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/.exec(
    String(value ?? "").trim(),
  );
  if (!matched) return null;
  return {
    major: Number(matched[1]),
    minor: Number(matched[2]),
    patch: Number(matched[3]),
    pre: matched[4] ?? null,
    raw: String(value).trim(),
  };
}

function compareSemver(a, b) {
  for (const key of ["major", "minor", "patch"]) {
    if (a[key] !== b[key]) return a[key] - b[key];
  }
  if (a.pre === b.pre) return 0;
  // 정식 릴리즈 > 프리릴리즈
  if (a.pre === null) return 1;
  if (b.pre === null) return -1;
  return a.pre < b.pre ? -1 : 1;
}

/* -------------------------------------------------------------- projects */

/**
 * detect / snapshot 이 훑는 워크스페이스 그룹.
 * apps/* 는 릴리즈 노트까지 만들고, packages/* 는 태그만 만든다
 * (.github/workflows/tag-workspace.yml).
 */
const PROJECT_GROUPS = ["apps", "packages"];

/** 특정 ref 시점의 <group>/<project>/package.json. 없으면 null. */
function readPackageAt(ref, group, project) {
  const raw = git(["show", `${ref}:${group}/${project}/package.json`], {
    allowFail: true,
  });
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const releaseTagFor = (project, version) => `${project}@${version}`;

/**
 * 스냅샷 태그 — 버전이 안 올라간 코드 변경에도 "이 커밋이 이 프로젝트의 이
 * 시점"을 남긴다. `<project>@<version>-<YYYYMMDD>-<HHmm>` (KST).
 *
 * semver 로도 말이 되는 형식이다: prerelease 취급이라 같은 버전의 정식 릴리즈
 * 태그(`web@2.1.0`)보다 항상 앞선다.
 */
const snapshotTagFor = (project, version, stamp) =>
  `${project}@${version}-${stamp}`;

/** 스냅샷 태그를 릴리즈 태그와 구분하는 접미사. (`-20260902-0346`) */
const SNAPSHOT_SUFFIX_RE = /-\d{8}-\d{4}$/;

/**
 * 커밋 시각(committer date)을 KST `YYYYMMDD-HHmm` 으로.
 *
 * 실행 시각이 아니라 커밋 시각을 쓰는 이유: 같은 커밋을 재실행해도 태그 이름이
 * 같아야 멱등성이 성립한다.
 */
function commitStamp(ref) {
  const iso = git(["show", "-s", "--format=%cI", ref]);
  // KST 는 UTC+9 고정(서머타임 없음)이라 오프셋을 더한 뒤 UTC 로 읽으면 된다.
  const kst = new Date(new Date(iso).getTime() + 9 * 60 * 60 * 1000);
  const pad = (value) => String(value).padStart(2, "0");
  return [
    `${kst.getUTCFullYear()}${pad(kst.getUTCMonth() + 1)}${pad(kst.getUTCDate())}`,
    `${pad(kst.getUTCHours())}${pad(kst.getUTCMinutes())}`,
  ].join("-");
}

/**
 * 앱별 레거시 릴리즈 태그 prefix.
 * web 은 모노레포 이전에 `v1.13.3` 형식으로 릴리즈해 왔으므로,
 * `web@*` 태그가 아직 없을 때의 기준점으로 삼는다.
 */
const LEGACY_TAG_PREFIX = { web: "v" };

/** 태그 목록에서 toVersion 보다 낮은 것 중 가장 높은 버전을 고른다. */
function pickPreviousTag(tags, toVersion, strip) {
  const candidates = tags
    .map((tag) => ({ tag, semver: parseSemver(strip(tag)) }))
    .filter((item) => item.semver !== null)
    .filter((item) => !toVersion || compareSemver(item.semver, toVersion) < 0)
    .sort((a, b) => compareSemver(a.semver, b.semver));
  return candidates.length ? candidates[candidates.length - 1].tag : null;
}

/** 해당 앱의 직전 릴리즈 태그. 없으면 null. */
function previousReleaseTag(app, version) {
  const toVersion = version ? parseSemver(version) : null;

  // 스냅샷 태그(`web@2.1.0-20260902-0346`)도 이 glob 에 걸리지만 릴리즈가
  // 아니므로 제외한다. 릴리즈 노트는 직전 "릴리즈" 부터의 차이여야 한다.
  const tags = (git(["tag", "--list", `${app}@*`]) || "")
    .split("\n")
    .filter(Boolean)
    .filter((tag) => !SNAPSHOT_SUFFIX_RE.test(tag));
  const own = pickPreviousTag(tags, toVersion, (tag) =>
    tag.slice(app.length + 1),
  );
  if (own) return own;

  const legacyPrefix = LEGACY_TAG_PREFIX[app];
  if (!legacyPrefix) return null;

  const legacyTags = (git(["tag", "--list", `${legacyPrefix}*`]) || "")
    .split("\n")
    .filter(Boolean);
  return pickPreviousTag(legacyTags, toVersion, (tag) =>
    tag.slice(legacyPrefix.length),
  );
}

/* --------------------------------------------------------------- commits */

const RECORD_SEP = "\x1e";
const FIELD_SEP = "\x1f";

/**
 * range 안의 first-parent 커밋(= squash 머지 단위) 목록.
 *
 * 이 저장소는 PR 을 squash 머지하므로 머지 커밋 하나 = PR 하나가 아니다.
 * `--no-merges` 로 (혹시 섞인) 진짜 머지 커밋의 "Merge pull request ..." 제목을
 * 걸러내고, squash 커밋만 릴리즈 노트 항목으로 쓴다.
 */
function collectCommits(range, limit) {
  const args = [
    "log",
    "--first-parent",
    "--no-merges",
    `--format=%H${FIELD_SEP}%an${FIELD_SEP}%aI${FIELD_SEP}%s${FIELD_SEP}%b${RECORD_SEP}`,
  ];
  if (limit) args.push("-n", String(limit));
  args.push(range);

  const raw = git(args, { allowFail: true });
  if (!raw) return [];

  return raw
    .split(RECORD_SEP)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const [sha, author, date, subject, body = ""] = chunk.split(FIELD_SEP);
      return { sha, author, date, subject, body };
    });
}

/** 커밋이 건드린 파일 목록. (squash 커밋 / 머지 커밋 모두 대응) */
function filesOf(sha) {
  const raw = git(
    [
      "diff-tree",
      "--no-commit-id",
      "--name-only",
      "-r",
      "-m",
      "--first-parent",
      sha,
    ],
    { allowFail: true },
  );
  return raw ? raw.split("\n").filter(Boolean) : [];
}

/**
 * 루트 공용 설정 — 모든 워크스페이스 프로젝트(앱·패키지)에 영향을 준다.
 *
 * 정규식 대신 목록으로 두는 이유: 파일명은 정확히 일치해야 한다.
 * (`package.json` 은 루트의 그것이지 `apps/web/package.json` 이 아니다)
 */
const ROOT_DIRS = ["scripts/", ".github/"];
const ROOT_FILES = [
  "package.json",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "tsconfig.base.json",
  "mise.toml",
  ".oxlintrc.json",
  "Dockerfile",
  ".dockerignore",
];

const isRootPath = (file) =>
  ROOT_DIRS.some((dir) => file.startsWith(dir)) || ROOT_FILES.includes(file);

/**
 * 앱 빌드에 함께 들어가는 공통 경로 = 루트 설정 + 워크스페이스 패키지 전부.
 * apps/<app>/** 를 건드리지 않았더라도 여기가 바뀌었으면 릴리즈 노트에 포함한다.
 *
 * 릴리즈 노트는 "이 릴리즈에 뭐가 들어갔나"를 사람이 읽는 목록이라 넓게 잡는다.
 * 스냅샷 태그는 pnpm 의 워크스페이스 의존 그래프를 쓴다 — affectedProjects 참고.
 */
const isSharedForApp = (file) =>
  file.startsWith("packages/") || isRootPath(file);

/** 커밋을 해당 앱 기준으로 분류한다. "app" | "shared" | null(제외) */
function classify(files, app) {
  const appPathRe = new RegExp(`^apps/${app}/`);
  if (files.some((file) => appPathRe.test(file))) return "app";
  if (files.some((file) => isSharedForApp(file))) return "shared";
  return null;
}

/* ---------------------------------------------------- conventional parse */

/**
 * 본문 푸터의 `BREAKING CHANGE: ...`
 * 다음 푸터 키워드 / 빈 줄 / 본문 끝까지를 하나의 노트로 잡는다.
 * (`m` 플래그의 `$` 는 줄 끝이라 본문 끝은 `(?![\s\S])` 로 확인한다)
 */
const BREAKING_NOTE_RE =
  /^BREAKING[ -]CHANGES?:\s*([\s\S]*?)(?=\n[A-Z][\w-]*(?:[ -][\w-]+)*:\s|\n{2,}|(?![\s\S]))/gm;

/** 릴리즈 노트 섹션 = 컨벤션 타입 + 컨벤션을 안 지킨 커밋용 폴백. */
const TYPE_SECTIONS = [...COMMIT_TYPES, ["__uncategorized", "📌 그 외 변경"]];

function parseCommit(commit) {
  const header = HEADER_RE.exec(commit.subject.trim());
  const type = header?.[1]?.toLowerCase();
  const notes = [...commit.body.matchAll(BREAKING_NOTE_RE)]
    .map((match) => match[1].trim())
    .filter(Boolean);

  return {
    ...commit,
    type: type && KNOWN_TYPES.has(type) ? type : "__uncategorized",
    scope: header?.[2] ?? null,
    subject: header?.[4] ?? commit.subject,
    breaking: header?.[3] === "!" || notes.length > 0,
    breakingNotes: notes,
  };
}

/* ------------------------------------------------------------- rendering */

function resolveRepo(explicit) {
  if (optional(explicit)) return explicit;
  if (process.env.GITHUB_REPOSITORY) return process.env.GITHUB_REPOSITORY;
  const remote = git(["remote", "get-url", "origin"], { allowFail: true });
  const matched = remote && /github\.com[:/](.+?)(?:\.git)?$/.exec(remote);
  return matched ? matched[1] : null;
}

function renderCommitLine(commit, { repo, app, showScope }) {
  const { text, pr } = splitPullRequest(commit.subject);
  const links = [];
  if (repo && pr) links.push(`[#${pr}](https://github.com/${repo}/pull/${pr})`);
  const short = commit.sha.slice(0, 7);
  links.push(
    repo
      ? `[\`${short}\`](https://github.com/${repo}/commit/${commit.sha})`
      : `\`${short}\``,
  );

  // scope 가 앱 이름 자체면 중복이라 생략한다. (예: web 릴리즈의 `fix(web):`)
  const normalizedScope = commit.scope?.replace(/^apps\//, "");
  const scopeLabel =
    showScope && normalizedScope && normalizedScope !== app
      ? `**${normalizedScope}**: `
      : "";

  return `- ${scopeLabel}${text} (${links.join(", ")})`;
}

function renderSection(title, commits, options) {
  if (!commits.length) return [];
  const lines = [`### ${title}`, ""];
  const byType = new Map();
  for (const commit of commits) {
    if (!byType.has(commit.type)) byType.set(commit.type, []);
    byType.get(commit.type).push(commit);
  }
  for (const [type, label] of TYPE_SECTIONS) {
    const group = byType.get(type);
    if (!group?.length) continue;
    lines.push(`#### ${label}`, "");
    for (const commit of group) lines.push(renderCommitLine(commit, options));
    lines.push("");
  }
  return lines;
}

/** 이번 릴리즈 범위의 커밋을 가리키는 해당 앱의 배포 태그. */
function deployTagsFor(app, shas) {
  const tags = (git(["tag", "--list", `@uos-judo-jiho/${app}-*`]) || "")
    .split("\n")
    .filter(Boolean);
  if (!tags.length) return [];

  return tags
    .map((tag) => ({
      tag,
      sha: git(["rev-list", "-n", "1", tag], { allowFail: true }),
    }))
    .filter((item) => item.sha && shas.has(item.sha))
    .sort((a, b) => (a.tag < b.tag ? -1 : 1));
}

function renderDeployTags(deployTags, repo) {
  if (!deployTags.length) return [];
  const lines = [
    "<details>",
    `<summary>이 릴리즈에 포함된 배포 태그 ${deployTags.length}개</summary>`,
    "",
  ];
  for (const item of deployTags) {
    const short = item.sha.slice(0, 7);
    const commitLink = repo
      ? `[\`${short}\`](https://github.com/${repo}/commit/${item.sha})`
      : `\`${short}\``;
    lines.push(`- \`${item.tag}\` — ${commitLink}`);
  }
  lines.push("", "</details>", "");
  return lines;
}

/* --------------------------------------------------------------- commands */

/**
 * push 이벤트의 before 를 비교 기준으로 쓴다.
 * 브랜치 최초 push 등에서 0000... 이 올 수 있으므로 그때는 head^ 로 떨어진다.
 * (head 가 루트 커밋이면 null — 호출부가 "전부 변경" 으로 다룬다)
 */
function resolveBase(rawBase, head) {
  const base = optional(rawBase);
  const usable =
    base &&
    !/^0+$/.test(base) &&
    git(["rev-parse", "--verify", `${base}^{commit}`], { allowFail: true });
  if (usable) return base;
  return git(["rev-parse", "--verify", `${head}^`], { allowFail: true });
}

/**
 * base 이후 바뀐 워크스페이스 프로젝트 + 그것에 의존하는 프로젝트.
 *
 * 판정을 직접 하지 않고 pnpm 에 맡긴다. ci.yml 이 "변경된 프로젝트만 빌드"할 때
 * 쓰는 것과 같은 필터(`...[<since>]`)라 기준이 한 곳으로 모이고, 워크스페이스
 * 의존 그래프를 전이까지 정확히 따라간다. 루트 파일(pnpm-lock.yaml, .github/,
 * scripts/, tsconfig.base.json …)만 바뀌면 아무 프로젝트도 잡히지 않는다.
 *
 * node_modules 가 없어도 동작한다 (워크스페이스 매니페스트만 읽는다).
 */
function affectedProjects(base) {
  const raw = execFileSync(
    "pnpm",
    [
      "--filter",
      `...[${base}]`,
      "ls",
      "--recursive",
      "--depth",
      "-1",
      "--json",
    ],
    {
      cwd: REPO_ROOT,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
      stdio: ["ignore", "pipe", "ignore"],
    },
  );

  let listed;
  try {
    listed = JSON.parse(raw);
  } catch {
    return [];
  }

  return (
    listed
      .map((item) => relative(REPO_ROOT, item.path).split("/"))
      // 워크스페이스 루트 프로젝트(경로가 빈 문자열)와 그룹 밖은 버린다.
      .filter(([group, project]) => PROJECT_GROUPS.includes(group) && project)
      .map(([group, project]) => ({ group, project }))
      .sort(
        (a, b) =>
          a.group.localeCompare(b.group) || a.project.localeCompare(b.project),
      )
  );
}

/** base 를 못 잡았을 때(루트 커밋 등)는 전부 대상으로 본다. */
function allProjects() {
  const targets = listScopeTargets();
  return PROJECT_GROUPS.flatMap((group) =>
    targets[group].map((project) => ({ group, project })),
  );
}

/**
 * pnpm 의 변경 감지는 작업 트리를 기준으로 하므로(두 커밋 사이가 아니다),
 * --head 가 실제로 체크아웃돼 있지 않으면 조용히 틀린 답이 나온다. 미리 막는다.
 */
function assertCheckedOut(head) {
  const current = git(["rev-parse", "HEAD"]);
  const wanted = git(["rev-parse", `${head}^{commit}`], { allowFail: true });
  if (wanted && wanted !== current) {
    throw new Error(
      [
        "snapshot 은 --head 커밋이 체크아웃된 상태여야 합니다.",
        "(pnpm 의 변경 감지가 작업 트리를 기준으로 하기 때문)",
        `  현재 HEAD : ${current.slice(0, 7)}`,
        `  --head    : ${wanted.slice(0, 7)}`,
      ].join("\n"),
    );
  }
}

function parseGroups(args) {
  const only = optional(args.dir);
  if (!only) return PROJECT_GROUPS;
  if (!PROJECT_GROUPS.includes(only)) {
    throw new Error(
      `--dir 은 ${PROJECT_GROUPS.join(" | ")} 중 하나여야 합니다: ${only}`,
    );
  }
  return [only];
}

/** GITHUB_OUTPUT 에 releases / has_releases 를 기록하고 stdout 으로도 흘린다. */
function emitReleases(releases) {
  const payload = JSON.stringify(releases);
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(
      process.env.GITHUB_OUTPUT,
      `releases=${payload}\nhas_releases=${releases.length > 0}\n`,
    );
  }
  process.stdout.write(`${payload}\n`);
}

/**
 * 버전 bump 와 무관하게, base..head 에서 바뀐 프로젝트마다 스냅샷 태그를 뽑는다.
 * 릴리즈(= 버전이 올라갈 때만)와 달리 코드가 바뀌면 항상 나온다.
 */
function commandSnapshot(args) {
  const head = optional(args.head) ?? "HEAD";
  assertCheckedOut(head);

  const base = resolveBase(args.base, head);
  const stamp = commitStamp(head);
  const groups = parseGroups(args);
  const affected = base ? affectedProjects(base) : allProjects();

  const snapshots = [];
  for (const { group, project } of affected) {
    if (!groups.includes(group)) continue;

    const manifest = readPackageAt(head, group, project);
    const version = parseSemver(manifest?.version);
    if (!version) continue;

    snapshots.push({
      project,
      dir: group,
      name: manifest.name,
      version: version.raw,
      tag: snapshotTagFor(project, version.raw, stamp),
    });
  }

  emitReleases(snapshots);
}

function commandDetect(args) {
  // detect 는 그룹 하나만 본다. (기본 apps — 릴리즈 노트 대상)
  const [group] = parseGroups({ dir: optional(args.dir) ?? "apps" });

  const head = optional(args.head) ?? "HEAD";
  const base = resolveBase(args.base, head);

  // --all 은 버전 비교 없이 현재 버전 그대로 뽑는다. (수동 백필용)
  const all = args.all === true;
  const only = optional(args.project);

  const targets = listScopeTargets()[group].filter(
    (project) => !only || project === only,
  );
  if (only && targets.length === 0) {
    throw new Error(`${group}/${only} 를 찾을 수 없습니다.`);
  }

  const releases = [];
  for (const project of targets) {
    const nextPackage = readPackageAt(head, group, project);
    const nextVersion = parseSemver(nextPackage?.version);
    if (!nextVersion) continue;

    const previousPackage = base ? readPackageAt(base, group, project) : null;
    const previousVersion = parseSemver(previousPackage?.version);

    // 신규 프로젝트거나 버전이 실제로 올라간 경우에만 릴리즈한다. (되돌림은 무시)
    if (
      !all &&
      previousVersion &&
      compareSemver(nextVersion, previousVersion) <= 0
    ) {
      continue;
    }

    releases.push({
      project,
      dir: group,
      name: nextPackage.name,
      version: nextVersion.raw,
      previousVersion: previousVersion?.raw ?? null,
      tag: releaseTagFor(project, nextVersion.raw),
    });
  }

  emitReleases(releases);
}

function commandNotes(args) {
  const app = optional(args.app);
  if (!app) throw new Error("--app <name> 이 필요합니다.");

  const to = optional(args.to) ?? "HEAD";
  const version =
    optional(args.version) ?? readPackageAt(to, "apps", app)?.version;
  if (!parseSemver(version)) {
    throw new Error(`apps/${app} 의 버전을 확인할 수 없습니다: ${version}`);
  }

  const repo = resolveRepo(args.repo);
  const tag = releaseTagFor(app, version);
  const from = optional(args.from) ?? previousReleaseTag(app, version);
  const limit = from ? null : Number(optional(args.limit) ?? 50);
  const range = from ? `${from}..${to}` : to;

  const commits = collectCommits(range, limit).map(parseCommit);
  const appCommits = [];
  const sharedCommits = [];
  for (const commit of commits) {
    const bucket = classify(filesOf(commit.sha), app);
    if (bucket === "app") appCommits.push(commit);
    else if (bucket === "shared") sharedCommits.push(commit);
  }

  const breaking = [...appCommits, ...sharedCommits].filter((c) => c.breaking);
  // 배포 태그는 분류 전 커밋 전체를 기준으로 찾는다.
  // (공통 경로 변경만으로도 배포가 돌아 태그가 생기기 때문)
  const deployTags = deployTagsFor(app, new Set(commits.map((c) => c.sha)));

  const lines = [`# ${app} v${version}`, ""];

  if (from) {
    const compare = repo
      ? `[\`${from}\` → \`${tag}\`](https://github.com/${repo}/compare/${from}...${tag})`
      : `\`${from}\` → \`${tag}\``;
    lines.push(`> 이전 릴리즈 이후의 변경 사항입니다. ${compare}`, "");
  } else {
    lines.push(
      `> \`${app}\` 의 이전 릴리즈 태그가 없어 최근 커밋 ${limit}개만 확인했습니다.`,
      "",
    );
  }

  if (!appCommits.length && !sharedCommits.length) {
    lines.push("이번 릴리즈에 포함된 코드 변경이 없습니다.", "");
  }

  if (breaking.length) {
    lines.push("### 💥 Breaking Changes", "");
    for (const commit of breaking) {
      lines.push(renderCommitLine(commit, { repo, app, showScope: true }));
      for (const note of commit.breakingNotes) {
        lines.push(`  - ${note.replace(/\s*\n+\s*/g, " ")}`);
      }
    }
    lines.push("");
  }

  lines.push(
    ...renderSection(`\`${app}\` 변경 사항`, appCommits, {
      repo,
      app,
      showScope: false,
    }),
  );
  lines.push(
    ...renderSection("공통 · 인프라 변경", sharedCommits, {
      repo,
      app,
      showScope: true,
    }),
  );
  lines.push(...renderDeployTags(deployTags, repo));

  if (repo && from) {
    lines.push(
      `**Full Changelog**: https://github.com/${repo}/compare/${from}...${tag}`,
      "",
    );
  }

  process.stdout.write(`${lines.join("\n").replace(/\n{3,}/g, "\n\n")}\n`);
}

/* ------------------------------------------------------------------ main */

const args = parseArgs(process.argv.slice(2));
const command = args._[0];

try {
  if (command === "detect") commandDetect(args);
  else if (command === "snapshot") commandSnapshot(args);
  else if (command === "notes") commandNotes(args);
  else {
    process.stderr.write(
      [
        "사용법:",
        "  node scripts/release-note.mjs detect [--dir apps|packages] [--base <ref>] [--head <ref>] [--project <name>] [--all]",
        "  node scripts/release-note.mjs snapshot [--dir apps|packages] [--base <ref>] [--head <ref>]",
        "  node scripts/release-note.mjs notes --app <app> [--version <v>] [--from <tag>] [--to <ref>] [--limit <n>]",
        "",
      ].join("\n"),
    );
    process.exit(1);
  }
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
