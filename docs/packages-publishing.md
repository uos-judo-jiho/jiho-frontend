# packages/\* 배포 (미구현 — 설계 메모)

`packages/*` 를 **모노레포 밖에서 소비**할 수 있게 배포하려면 어떻게 해야 하는지
조사한 결과를 정리한 문서다. **아직 구현하지 않았다.** 지금 구현된 것은 버전
bump 를 감지해 태그를 만드는 것까지다 (`.github/workflows/tag-workspace.yml`).

이 문서는 "필요해지면 그때 이 문서를 보고 붙인다"를 전제로 쓴다.

---

## 지금 상태

| 항목 | 상태 |
|---|---|
| 패키지 빌드 | `tsdown` → `dist/` (ESM + `.d.ts`). `pnpm build:packages` |
| 모노레포 내부 소비 | `workspace:*` — 이대로 유지한다 |
| 버전 태그 | `<pkg>@<version>` (예: `api@0.2.0`) 자동 생성 ✅ |
| 스냅샷 태그 | `<pkg>@<version>-<YYYYMMDD>-<HHmm>` 코드 변경 시마다 자동 생성 ✅ |
| 레지스트리 배포 | **없음** |

태그는 배포와 무관하게 "이 커밋이 그 버전"이라는 기록으로서 이미 쓸모가 있다.
배포를 붙일 때 그대로 기준점이 된다.

## 왜 git 태그 직접 의존은 안 되는가

`"@packages/api": "github:uos-judo-jiho/jiho-frontend#api@0.2.0&path:/packages/api"`
형태를 먼저 검토했고, **실제로 설치를 시도해 확인한 결과 쓸 수 없다.**

문법 자체는 지원된다 — pnpm 은 `#<committish>&path:/<subdir>` 로 모노레포
서브디렉터리를 집을 수 있다. 막히는 건 그 다음이다.

1. **`workspace:*` 가 그대로 새어나간다.**
   git 설치는 `package.json` 을 날것으로 읽는다. `@packages/auth` 의
   `"@packages/api": "workspace:*"` 에서 바로 실패한다:
   `ERR_PNPM_WORKSPACE_PKG_NOT_FOUND`.

2. **`catalog:` 도 그대로 새어나간다.** `missing peer react@catalog:`.
   catalog 는 워크스페이스 안에서만 해석된다.

3. **빌드 산출물이 없다.** `files: ["dist"]` 인데 `dist` 는 gitignore 다.
   설치하면 `package.json` 과 `README.md` 만 들어오고 import 하면
   `ERR_MODULE_NOT_FOUND`.
   `prepare` 스크립트로 해결하려 해도, pnpm 은 git 의존성을 준비할 때
   **`npm install` 을 대신 실행한다** — pnpm 스토어도 락파일도 타지 않는 별도
   설치다. pnpm 10+ 는 `onlyBuiltDependencies` 허용목록 등록까지 요구한다.

4. **`@packages/api` 는 구조적으로 불가능하다.** `src/_generated` 가 gitignore 라
   태그 안에 코드 자체가 없다. `prepare` 에서 `pnpm orval` 을 돌려야 하는데,
   그러면 **모든 소비자의 install 시점에** 백엔드 스펙 접근이 필요해진다.

5. 패키지 하나 받으려고 `apps/*` 포함 저장소 전체를 클론한다.

→ **결론: 레지스트리 배포가 답이다.** 그리고 `pnpm publish` 는 `workspace:*` 와
`catalog:` 를 실제 버전으로 **자동 치환**하므로 1·2번이 그냥 사라진다.

## 어디에 배포할 것인가

### 안 A. GitHub Packages (`npm.pkg.github.com`)

**비용: 무료.** 이 저장소는 public 이고, public 패키지는 스토리지·전송이 무료다.
Actions 도 public 저장소 + standard runner 라 무료다. 지금 워크플로우가 전부
`ubuntu-latest` 를 쓰므로 조건이 이미 맞는다.

> 확인할 것: 첫 publish 후 패키지가 **Public** 으로 표시되는지. npm 패키지는
> repository-scoped 라 저장소 visibility 를 상속하지만, 혹시 private 으로 잡히면
> 그때부터 org 플랜의 스토리지/전송 쿼터를 먹는다 (Actions artifacts·cache 와
> 공유되는 쿼터다).

**대신 치명적인 제약이 하나 있다 — public 패키지인데도 설치에 토큰이 필요하다.**
GitHub Packages 의 npm 레지스트리는 익명 설치를 허용하지 않는다 (Container
registry 와 다르다). 소비자별로:

- 같은 저장소 워크플로우 → `GITHUB_TOKEN` 으로 해결
- 다른 저장소 워크플로우 → 패키지 설정에서 그 저장소에 Actions access 부여, 또는 PAT
- 로컬 개발자 → 각자 `~/.npmrc` 에 PAT

### 안 B. npm 공개 레지스트리 (npmjs.com)

인증 없이 설치된다. public 패키지는 무료. 이름을 org scope 로 잡아야 한다
(`@uos-judo-jiho/api` 등 — 현재 `@packages/*` 는 공개 레지스트리에 쓸 수 없는
이름이다).

**"다른 저장소에서 별 마찰 없이 쓰고 싶다"가 목적이면 B 가 낫다.** A 의 토큰
요구는 새 기여자가 `pnpm install` 하려면 PAT 를 발급받아야 한다는 뜻이다.

## 워크플로우 설계에서 반드시 피해야 할 함정

**`GITHUB_TOKEN` 으로 푸시한 태그·커밋은 다른 워크플로우를 트리거하지 않는다.**
GitHub 의 재귀 방지 정책이고, 예외는 `workflow_dispatch` / `repository_dispatch`
둘뿐이다.

`tag-workspace.yml` 이 만드는 태그(릴리즈·스냅샷 모두)가 바로 그 경우다. 따라서
이런 설계는 **동작하지 않는다**:

```
tag-workspace.yml : 버전 감지 → 태그 푸시
                                 ↓  트리거 안 됨
publish.yml      : on push tags → 빌드 → publish   ← 안 돎
```

대안 (권장순):

1. **한 워크플로우로 합치기** — `tag-workspace.yml` 안에서 태그 생성에 이어 publish
   까지 한다. 토큰 문제 자체가 사라진다. `release-note.yml` 이 이미 detect →
   release 를 한 워크플로우 두 job 으로 처리하는 것과 같은 모양이다.
2. **사람이 태그 푸시** — 사람 자격증명이라 정상적으로 트리거된다.
3. **`workflow_run` 체인** — `tag-release.yml` 이 쓰는 방식. 워크플로우 완료
   이벤트는 이 제약을 받지 않는다.
4. **PAT / GitHub App 토큰** — 마지막 수단. 만료 관리 부담이 생긴다.

## 구현할 때 체크리스트

`tag-workspace.yml` 에 publish job 을 잇는다고 할 때:

- [ ] `permissions: { contents: write, packages: write }`
      (`packages: write` 만 추가하면 된다. `secrets.GITHUB_TOKEN` 은 **등록하는
      값이 아니라 자동으로 존재하는** 값이다 — 추가할 secret 이 없다)
- [ ] `pnpm orval` 선행 — `@packages/api` 는 `_generated` 없이는 빌드가 안 된다.
      `ci.yml` 이 GitHub 러너에서 이미 성공적으로 돌리고 있으므로 그대로 쓰면 된다
- [ ] `pnpm build:packages` 로 `dist` 생성
- [ ] `.npmrc` 에 `//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}`,
      `NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}`
- [ ] 각 패키지 `package.json` 에서 `private: true` 제거 + `publishConfig.registry` 설정
      (private 인 채로는 publish 되지 않는다)
- [ ] 이미 배포된 버전이면 건너뛰기 (재실행 멱등성). 태그 생성 쪽과 동일한 방식
- [ ] `pnpm publish --no-git-checks` — CI 체크아웃은 detached HEAD 라 기본 검사가 걸린다

## 남은 결정 사항

- **레지스트리**: GitHub Packages(A) vs npmjs(B). 소비자가 누구인지에 달렸다.
- **패키지 이름**: B 를 고르면 `@packages/*` → `@uos-judo-jiho/*` 개명이 필요하고,
  모노레포 내부 import 경로도 전부 바뀐다.
- **`@packages/api` 를 배포할 것인가**: 백엔드 스펙에서 생성되는 코드라 백엔드
  버전과 강하게 묶인다. 외부 소비자에게 의미가 있는지 먼저 판단해야 한다.
- **버전 정책**: 지금은 손으로 `package.json` 을 올린다. changesets 같은 도구를
  도입할지 여부.

## 참고

- [GitHub Packages 과금](https://docs.github.com/en/billing/concepts/product-billing/github-packages)
- [GitHub Actions 과금](https://docs.github.com/billing/managing-billing-for-github-actions/about-billing-for-github-actions)
- [워크플로우 트리거 — `GITHUB_TOKEN` 재귀 방지](https://docs.github.com/actions/using-workflows/triggering-a-workflow)
- [GitHub Packages 권한](https://docs.github.com/en/packages/learn-github-packages/about-permissions-for-github-packages)
- [public npm 패키지도 토큰이 필요한 건에 대한 논의](https://github.com/orgs/community/discussions/33875)
