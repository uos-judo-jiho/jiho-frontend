# API 요청/응답 인터페이스 개선 제안

프론트엔드(`uos-judo-jiho/jiho-frontend`)에서 어드민 훈련일지 폼과 참여 인원
드롭다운을 작업하며 부딪힌 것들을 정리했습니다. 근거는 모두
`uos-judo-jiho/api` 의 `docs/swagger/v2-api.json` · `v2-admin.json`
(main, `56ec0b3`) 을 직접 확인한 것입니다.

프론트는 orval 로 두 스펙에서 axios + TanStack Query 클라이언트를 생성합니다
(`packages/api`). 그래서 "스펙이 어떻게 생겼는가"가 곧 프론트 코드의 모양이
됩니다.

---

## 우선순위 요약

| #  | 내용                                       | 성격        | 영향                             |
| :- | :----------------------------------------- | :---------- | :------------------------------- |
| 1  | `operationId` 부재 (66개 엔드포인트 전부)  | 스펙만 수정 | 생성 코드 이름 전반              |
| 2  | 공통 스키마 미분리 (`components.schemas`)  | 스펙만 수정 | 같은 개념이 타입 3개로 갈라짐    |
| 3  | 쓰기 응답이 만든 리소스를 안 돌려줌        | 파괴적      | 작성 후 상세 이동 불가           |
| 4  | 목록 응답 봉투가 엔드포인트마다 다름       | 파괴적      | 훅마다 `select` 를 따로 씀       |
| 5  | 읽기/쓰기 필드 비대칭 (`images`/`imgSrcs`) | 파괴적      | 폼에서 매번 모양 변환            |
| 6  | 훈련일지 참여 인원이 자유 문자열           | 추가 가능   | 동명이인·개명·역참조 불가        |
| 7  | `boardType`·`dateTime` 제약 없음           | 추가 가능   | 잘못된 값이 그대로 저장됨        |
| 8  | 에러에 기계가 읽을 코드가 없음             | 추가 가능   | 안내 문구를 뭉뚱그리게 됨        |

1·2번은 **동작을 바꾸지 않고 스펙 주석만 손대면 되는데 효과가 가장 큽니다.**
여기부터 하시길 권합니다.

---

## 1. `operationId` 가 하나도 없습니다

두 스펙의 66개 오퍼레이션 전부에 `operationId` 가 없습니다.

```
v2-api   : operationId 0 / 18
v2-admin : operationId 0 / 48
```

orval 은 `operationId` 가 없으면 **메서드 + 경로**로 이름을 짓습니다. 그래서
프론트 코드에 이런 이름이 남습니다.

```ts
v2Api.useGetApiV2UsersBulk(...)                  // GET /api/v2/users/bulk
v2Api.useGetApiV2BoardsBoardIdReactions(...)     // GET /api/v2/boards/{boardId}/reactions
v2Admin.usePostApiV2AdminPicturesYear(...)       // POST /api/v2/admin/pictures/{year}
v2Admin.usePutApiV2AdminBoardBoardId(...)        // PUT /api/v2/admin/board/{boardId}
```

읽기 어려운 것도 문제지만, **경로가 바뀌면 호출부 이름이 전부 바뀌는 게 더
큽니다.** 엔드포인트를 옮길 때마다 프론트 전 파일을 훑어야 합니다.

### 제안

각 라우트 스키마에 `operationId` 를 답니다. Fastify + `fastify-type-provider-zod`
에서는 스키마 객체에 한 줄이면 됩니다.

```ts
typedApp.get("/users", {
  schema: {
    operationId: "listPublicUsers",
    ...
  },
});
```

| 현재 생성 이름                     | `operationId` 지정 시           |
| :--------------------------------- | :------------------------------ |
| `useGetApiV2Users`                 | `useListPublicUsers`            |
| `useGetApiV2UsersBulk`             | `useGetPublicUsersByIds`        |
| `useGetApiV2UsersUserId`           | `useGetPublicUser`              |
| `usePutApiV2AdminBoardBoardId`     | `useUpdateBoard`                |
| `usePostApiV2AdminPicturesYear`    | `useUploadGalleryPictures`      |

명명 규칙은 `list*` / `get*` / `create*` / `update*` / `delete*` 정도로만
맞춰주시면 충분합니다. **한 번에 다 하지 않아도 되고**, 새로 추가하는
엔드포인트부터 붙여도 됩니다(기존 이름이 바뀌는 것도 breaking 이라, 오히려
버전을 끊어 한 번에 가는 편이 나을 수 있습니다).

---

## 2. 공통 스키마가 `components.schemas` 로 안 빠져 있습니다

현재 `components.schemas` 에는 `Position`, `PositionInput` 둘뿐이고 나머지는
전부 응답 안에 인라인돼 있습니다. 그래서 **같은 개념이 타입 세 개로 갈라집니다.**

`PublicUserDto` 하나가 세 곳에 인라인돼 있어 orval 이 이렇게 만들었습니다.

```
GetApiV2Users200ItemsItem        // GET /users        의 items[]
GetApiV2UsersBulk200ItemsItem    // GET /users/bulk   의 items[]
GetApiV2UsersUserIdResponse      // GET /users/{id}
```

구조는 완전히 같은데 이름이 셋이라 서로 대입은 되지만, 어느 걸 "그" 유저
타입으로 부를지가 없습니다. 결국 프론트에서 같은 모양을 한 번 더 선언했습니다.

```ts
// apps/admin/src/features/user/api.ts
export type PublicUser = {
  id: number;
  name: string | null;
  generation: number | null;
  major: string | null;
  graduated: boolean;
};
```

서버 스키마가 바뀌어도 이 선언은 그대로라, **타입 검사로 안 잡힙니다.**

### 제안

재사용되는 zod 스키마를 named ref 로 등록해 `$ref` 가 나가게 합니다.
`fastify-zod-openapi` / `fastify-type-provider-zod` 의 `.openapi({ ref })`
(또는 `registry.register`) 를 쓰면 스펙에 `components.schemas.PublicUser` 로
올라가고, orval 은 `PublicUser` 하나만 만듭니다.

우선 후보:

- `PublicUser` — `/users`, `/users/bulk`, `/users/{userId}` 3곳
- `BoardImage` (`{ originSrc, smallSrc }`) — 지호지·훈련일지·공지 응답 전부
- `ErrorResponse` (`{ message }`) — 거의 모든 4xx
- `ReactionSummary` — `/boards/reactions`, `/boards/{boardId}/reactions`
- `Pagination` (`{ total, limit, offset }`)

---

## 3. 쓰기 응답이 만든 리소스를 안 돌려줍니다

```
POST   /api/v2/admin/board            → { "upload": string }
PUT    /api/v2/admin/board/{boardId}  → { "update": string }
POST   /api/v2/admin/pictures/{year}  → { "picture upload": string }
```

두 가지가 걸립니다.

**(a) 생성된 게시글의 id 가 없습니다.** 글을 쓰고 나면 그 글로 보내주는 게
자연스러운데 id 를 모르니 목록으로 되돌릴 수밖에 없습니다. 현재 프론트가
그렇게 동작합니다.

```ts
// 지금: 만든 글이 아니라 목록으로 간다
onSuccess: () => navigate({ href: `/${type}` }),
```

**(b) 키 이름이 제각각이고, 하나는 공백이 들어 있습니다.**
`"picture upload"` 는 점 표기로 접근이 안 돼
`response.data["picture upload"]` 로 써야 합니다. 생성 코드에서도 따옴표 키가
됩니다. `upload` / `update` / `delete` 처럼 **동사를 키로 쓰는 것도** 값이
무엇인지 알려주지 않습니다(값은 안내 문구 문자열입니다).

### 제안

생성·수정은 **바뀐 리소스 자체**를 돌려주는 게 가장 쓸모 있습니다.

```jsonc
// POST /api/v2/admin/board  201
{ "id": 123, "boardType": "training", "title": "...", "dateTime": "2026-01-05", ... }

// PUT /api/v2/admin/board/{boardId}  200  — 같은 모양
// DELETE /api/v2/admin/board/{boardId}  204 No Content
```

리소스 전체가 부담이면 최소한 `{ "id": 123 }` 만이라도 주시면 상세 이동이
됩니다. 공백 키(`"picture upload"`)는 그 자체로 버그에 가까우니 우선 고쳐주시면
좋겠습니다.

---

## 4. 목록 응답 봉투가 엔드포인트마다 다릅니다

목록을 감싸는 키가 **12가지**입니다.

| 엔드포인트                        | 200 응답                              |
| :-------------------------------- | :------------------------------------ |
| `GET /users`                      | `{ total, limit, offset, items }`     |
| `GET /users/bulk`                 | `{ items }`                           |
| `GET /notices`                    | `{ notices }`                         |
| `GET /trainings`                  | `{ trainingLogs }`                    |
| `GET /news/latest`                | `{ articles }`                        |
| `GET /news/{year}`                | `{ year, images, articles }`          |
| `GET /news/images/all`            | (봉투 없는 배열)                      |
| `GET /awards`                     | `{ awards }`                          |
| `GET /boards/reactions`           | `{ summaries }`                       |
| `GET /admin/users`                | `{ users }`                           |
| `GET /admin/pending`              | `{ admins }`                          |
| `GET /admin/highlights/unlabeled` | `{ items, nextCursor, hasMore }`      |

페이지네이션 방식도 세 가지가 섞여 있습니다 — offset(`users`, `labels`),
cursor(`highlights`), 없음(나머지 전부).

프론트에서는 훅마다 `select` 를 다르게 써야 해서 이런 코드가 흩어집니다.

```ts
select: (r) => r.data.notices        // 공지
select: (r) => r.data.training       // 훈련일지 상세
select: (r) => r.data.items          // 유저
select: (r) => r.data.awards ?? []   // 수상이력
```

### 제안

- **목록**: `{ items, total, limit, offset }` 로 통일. `/users` 가 이미 이
  모양이니 그걸 표준으로 삼으면 됩니다.
- **단건**: 봉투 없이 리소스를 그대로. `/users/{userId}` 가 이미 그렇습니다
  (반면 `/training/{id}` 는 `{ training }`, `/awards/{awardId}` 는 `{ award }`).
- 커서 페이지네이션이 필요한 곳은 `{ items, nextCursor, hasMore }` 로 두되,
  목록 키는 `items` 로 같게.

이건 파괴적 변경이라 한 번에 어렵습니다. **새 엔드포인트는 이 규칙으로 내고,
기존 것은 다음 버전에서 정리**하는 정도가 현실적일 것 같습니다.

---

## 5. 읽기와 쓰기의 필드 이름·모양이 다릅니다

같은 "게시글 사진"인데 읽기와 쓰기가 다릅니다.

| | 필드명 | 타입 |
| :- | :- | :- |
| 읽기 (`GET /training/{id}` 등) | `images` | `{ originSrc: string, smallSrc: string \| null }[]` |
| 쓰기 (`POST /admin/board`) | `imgSrcs` | `string[]` |

그래서 폼 한 번 채우는 데 변환이 두 번 들어갑니다.

```ts
// 서버 → 폼
{ ...data, imgSrcs: data.images ?? [] }

// 폼 → 서버
imgSrcs: values.imgSrcs.map(({ originSrc }) => originSrc)
```

`smallSrc` 는 서버가 만들어 주는 값이니 쓰기에 없는 건 맞습니다. 다만
**이름은 같아야** 합니다.

### 제안

쓰기도 `images` 로 이름을 맞춥니다. 타입은 둘 중 하나:

- (간단) `images: string[]` — 원본 URL 목록. 이름만 맞추는 최소 변경.
- (대칭) `images: { originSrc: string }[]` — 읽기와 모양이 같아 변환이 사라짐.

프론트 입장에서는 뒤쪽이 더 편하지만, 앞쪽만으로도 헷갈림은 대부분 없어집니다.

---

## 6. 훈련일지 참여 인원이 자유 문자열입니다

이번에 `GET /api/v2/users` 로 부원 명부에서 참여 인원을 고르게 만들었습니다.
그런데 게시글 저장은 여전히 `tags: string[]` 이라, **골라 넣어도 결국 이름
문자열만 남습니다.** 유저를 정확히 지목해 놓고 그 정보를 버리는 셈입니다.

지금 구조로는 이런 게 안 됩니다.

- **동명이인 구분** — 같은 이름의 30기·34기를 구분할 수 없습니다.
- **개명·오타 반영** — 유저가 이름을 바꿔도 과거 훈련일지는 옛 이름 그대로입니다.
- **역참조** — "내가 참여한 훈련일지" 같은 조회가 불가능합니다. 마이페이지나
  출석 집계로 확장할 여지가 막혀 있습니다.

### 제안 (기존 데이터를 깨지 않는 방향)

`tags` 는 그대로 두고 **선택적 필드를 하나 더** 받습니다.

```jsonc
// POST/PUT /api/v2/admin/board
{
  "tags": ["김영민", "이지호"],          // 지금 그대로 (표시용, 미가입자 포함)
  "participants": [                      // 신규, optional
    { "userId": 12, "name": "김영민" },
    { "userId": null, "name": "이지호" } // 아직 가입 안 한 사람
  ]
}
```

- 읽기 응답에도 `participants` 를 같이 내려주면, 프론트는 그게 있으면 그걸,
  없으면 `tags` 를 씁니다 → **과거 글도 그대로 보입니다.**
- `userId` 가 nullable 인 게 핵심입니다. 신입생·외부 참가자처럼 계정이 없는
  사람도 훈련에는 참여하니, 가입 여부와 무관하게 기록될 수 있어야 합니다.
- 나중에 `GET /api/v2/trainings?participantId=12` 를 열면 역참조도 됩니다.

당장 필요한 건 아니지만, **참여 인원을 명부에서 고르게 만든 지금이 넣기 가장
좋은 시점**입니다. 지금 안 넣으면 이름만 남은 데이터가 계속 쌓입니다.

---

## 7. `boardType` 과 `dateTime` 에 제약이 없습니다

```jsonc
// POST /api/v2/admin/board 요청 스키마
"boardType": { "type": "string", "minLength": 1 },
"dateTime":  { "type": "string", "minLength": 1 }
```

`boardType` 은 실제로는 `news` / `training` / `notice` 셋뿐인데 아무 문자열이나
받습니다. 오타(`"trainig"`)가 그대로 저장되고, 그 글은 어느 목록에도 안 뜹니다.
프론트도 생성 타입이 `string` 이라 **오타를 컴파일 타임에 못 잡습니다.**

`dateTime` 도 형식이 없습니다. 프론트는 게시글에 `"2026-01-05"` 를,
갤러리 쪽에서는 연도 문자열을 섞어 쓰고 있어 서버가 뭘 기대하는지 스펙만
봐서는 알 수 없습니다.

### 제안

```ts
boardType: z.enum(["news", "training", "notice"]),
dateTime: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD 형식이어야 합니다."),
```

`enum` 은 스펙에 그대로 실려서 orval 이 유니온 타입을 만들어 줍니다
(`"news" | "training" | "notice"`). **한 줄로 프론트의 오타가 사라집니다.**

`dateTime` 은 시간이 안 들어가는 값이니 이름을 `date` 로 바꾸는 것도
고려해볼 만합니다(파괴적이라 순위는 낮습니다).

곁들여 — `boardType` 이 body 에 있는 것보다 경로로 나가는 게
(`POST /api/v2/admin/boards/{boardType}`) REST 로는 더 자연스럽습니다. 다만
지금 구조로도 큰 문제는 없어서 참고만 하시면 됩니다.

---

## 8. 에러에 기계가 읽을 코드가 없습니다

에러 응답은 `{ message: string }` 하나로 잘 통일돼 있습니다. 다만 사람이 읽는
문구뿐이라 **프론트가 상황별로 다르게 대응할 수가 없습니다.** 지금은 전부
같은 토스트로 처리하고 있습니다.

```ts
onError: (error) => {
  console.error("board create failed:", error);
  toast.error("업로드에 실패하였습니다.");  // 뭐가 문제였는지 사용자는 모른다
},
```

권한이 없어서인지, 이미 지워진 글인지, 값이 잘못됐는지 구분하려면 상태 코드
말고 식별자가 필요합니다.

### 제안

```jsonc
{ "code": "BOARD_NOT_FOUND", "message": "게시글을 찾을 수 없습니다." }
```

`code` 는 optional 로 추가하면 기존 클라이언트를 안 깹니다. 값 검증 실패는
어느 필드가 문제인지까지 주시면 폼에 바로 표시할 수 있습니다.

```jsonc
{
  "code": "VALIDATION_FAILED",
  "message": "입력값을 확인해주세요.",
  "fields": { "title": "제목을 입력해주세요." }
}
```

---

## 9. `me` 와 `/users` 의 유저 모양이 다릅니다

같은 사람을 두 엔드포인트가 다른 모양으로 내려줍니다.

```jsonc
// GET /api/v2/admin/me  — 중첩
{ "user": { "id": 1, "email": "...", "role": "...",
            "additionalInfo": { "name": "김영민", "generation": 34, "major": "컴퓨터과학부", ... } } }

// GET /api/v2/users/{userId}  — 평면
{ "id": 1, "name": "김영민", "generation": 34, "major": "컴퓨터과학부", "graduated": false }
```

프론트에서 "34기 김영민" 같은 표시 문자열을 만드는 코드가 두 벌이 됐습니다.

```ts
// me 기준
`${user.additionalInfo.generation}기 ${user.additionalInfo.name}`
// 공개 유저 기준
`${user.generation}기 ${user.name}`
```

### 제안

`me` 응답에도 `PublicUser` 부분을 같은 평면 구조로 포함시키거나(2번의 공통
스키마와 함께 하면 자연스럽습니다), 최소한 필드 이름·중첩 위치를 맞춰주시면
표시 로직을 하나로 합칠 수 있습니다.

---

## 참고: 이번에 실제로 잘 맞았던 것

되짚어보면 최근 추가된 `/api/v2/users` 는 대체로 쓰기 좋았습니다. 다음 설계의
기준으로 삼을 만합니다.

- `{ total, limit, offset, items }` 봉투 — 페이지네이션에 필요한 게 다 있습니다.
- `limit` 상한(100)과 기본값(20)이 스펙에 있어 클라이언트가 방어 코드를 덜 씁니다.
- `null` 가능한 필드(`name`, `generation`, `major`)를 `anyOf: [T, null]` 로
  정확히 표기해서, 생성 타입이 `string | null` 로 나왔습니다. 덕분에 이름 없는
  계정을 프론트에서 걸러야 한다는 걸 타입이 알려줬습니다.
- N+1 방지용 `bulk` 조회를 처음부터 같이 낸 것.
