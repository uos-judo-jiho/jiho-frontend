#!/usr/bin/env node
/**
 * 앱별 릴리즈 노트 생성기.
 *
 * apps/<app>/package.json 의 version 이 올라간 것을 감지해서,
 * 해당 앱의 "이전 릴리즈 태그 ~ 현재 커밋" 사이의 squash 머지 커밋으로
 * Conventional Commits 기반 릴리즈 노트를 만든다.
 *
 * 릴리즈 태그 형식: <app>@<version>   (예: web@1.13.4, admin@0.1.2)
 * 배포 태그 형식:   @uos-judo-jiho/<app>-<YYMMDD>-<HHMMSS>-<hash>  (tag-release.yml)
 *
 * detect 는 packages/* 도 볼 수 있다 (`--dir packages`). 이때는 태그 이름만
 * 뽑아 쓰고 릴리즈 노트는 만들지 않는다 — tag-packages.yml 이 그 용도다.
 * 패키지 태그도 같은 형식을 쓴다 (예: api@0.2.0). apps/* 와 packages/* 는
 * 커밋 스코프에서 이미 하나의 평평한 이름 공간이라 이름이 겹치지 않는다.
 *
 * 사용법
 *   node scripts/release-note.mjs detect [--dir apps|packages] [--base <ref>]
 *                                        [--head <ref>] [--project <name>] [--all]
 *   node scripts/release-note.mjs notes --app web [--version 1.13.4] [--from <tag>] [--to <ref>]
 */
import { execFileSync } from "node:child_process";
import { appendFileSync } from "node:fs";

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
 * detect 가 훑는 워크스페이스 그룹.
 * apps/* 는 릴리즈 노트까지 만들고, packages/* 는 태그만 만든다
 * (.github/workflows/tag-packages.yml).
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

  const tags = (git(["tag", "--list", `${app}@*`]) || "")
    .split("\n")
    .filter(Boolean);
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
 * 앱 빌드에 함께 들어가는 공통 경로.
 * apps/<app>/** 를 건드리지 않았더라도 여기가 바뀌었으면 릴리즈에 포함한다.
 */
const SHARED_PATH_RE =
  /^(packages\/|scripts\/|\.github\/|package\.json$|pnpm-lock\.yaml$|pnpm-workspace\.yaml$|tsconfig\.base\.json$|mise\.toml$|\.oxlintrc\.json$|Dockerfile$|\.dockerignore$)/;

/** 커밋을 해당 앱 기준으로 분류한다. "app" | "shared" | null(제외) */
function classify(files, app) {
  const appPathRe = new RegExp(`^apps/${app}/`);
  if (files.some((file) => appPathRe.test(file))) return "app";
  if (files.some((file) => SHARED_PATH_RE.test(file))) return "shared";
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

function commandDetect(args) {
  const group = optional(args.dir) ?? "apps";
  if (!PROJECT_GROUPS.includes(group)) {
    throw new Error(
      `--dir 은 ${PROJECT_GROUPS.join(" | ")} 중 하나여야 합니다: ${group}`,
    );
  }

  const head = optional(args.head) ?? "HEAD";
  let base = optional(args.base);

  // push 이벤트의 before 는 브랜치 최초 push 등에서 0000... 이 올 수 있다.
  const baseExists =
    base &&
    !/^0+$/.test(base) &&
    git(["rev-parse", "--verify", `${base}^{commit}`], { allowFail: true });
  if (!baseExists) {
    base = git(["rev-parse", "--verify", `${head}^`], { allowFail: true });
  }

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

  const payload = JSON.stringify(releases);
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(
      process.env.GITHUB_OUTPUT,
      `releases=${payload}\nhas_releases=${releases.length > 0}\n`,
    );
  }
  process.stdout.write(`${payload}\n`);
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
  else if (command === "notes") commandNotes(args);
  else {
    process.stderr.write(
      [
        "사용법:",
        "  node scripts/release-note.mjs detect [--dir apps|packages] [--base <ref>] [--head <ref>] [--project <name>] [--all]",
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
