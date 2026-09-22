---
title: 마크다운 렌더링 확인
description: 제목, 목록, 표, 코드 블록, 콜아웃, 이미지, 영상이 어떻게 보이는지 한 페이지에서 확인합니다.
pubDatetime: 2026-09-21T14:30:00+09:00
tags:
  - 테스트
  - 마크다운
featured: false
---

이 글은 테마가 마크다운을 어떻게 그리는지 한눈에 보려고 만든 페이지입니다. 아래부터 요소를 하나씩 늘어놓습니다.

## Table of contents

## 제목 단계
안녕하세요?

## 가나다

안녕

### 세 번째 단계

#### 네 번째 단계

##### 다섯 번째 단계

본문 문단입니다. **굵게**, *기울임*, ~~취소선~~, `인라인 코드`, 그리고 [링크](https://docs.astro.build)를 섞어 씁니다. 한글과 English를 함께 써서 줄바꿈과 자간이 어색하지 않은지 봅니다.

## 목록

- 첫 항목
- 둘째 항목
  - 들여쓴 항목
  - 또 하나
- 셋째 항목

1. 순서 있는 첫째
2. 순서 있는 둘째
3. 순서 있는 셋째

- [x] 끝낸 일
- [ ] 남은 일

## 인용과 구분선

> 인용문은 이렇게 보입니다.
> 두 줄짜리도 확인합니다.

---

## 콜아웃

> [!note]
> 참고용 블록입니다.

> [!warning]
> 주의를 끌 때 쓰는 블록입니다.

> [!tip]
> 도움말 블록입니다.

## 표

| 항목    |    값 |    비고     |
| ------- | ----: | :---------: |
| 첫 행   | 1,200 | 오른쪽 정렬 |
| 둘째 행 |    34 | 가운데 정렬 |
| 셋째 행 |     5 |             |

## 코드 블록

```ts
type Post = {
  title: string;
  tags: string[];
};

function tagCount(posts: Post[]) {
  const seen = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      seen.set(tag, (seen.get(tag) ?? 0) + 1); // [!code highlight]
    }
  }
  return seen;
}
```

추가와 삭제 표시도 확인합니다.

```js
const config = {
  search: "pagefind", // [!code ++]
  search: false, // [!code --]
};
```

## 화살표

`->` 처럼 친 기호는 글자에서만 화살표로 바뀝니다. 왼쪽 -> 오른쪽, 되돌리기 <- 이렇게, 양쪽 <-> 이렇게, 그리고 => 와 <=> 도 됩니다.

코드 안에서는 그대로 둡니다. 인라인으로 `a -> b` 라고 쓰거나

```ts
const next = (n: number) => n + 1; // 화살표 함수는 그대로
```

이렇게 블록으로 쓰면 건드리지 않습니다.

## 이미지

보관함 안의 그림은 상대 경로로 넣습니다. Astro 가 크기를 줄이고 webp 로 바꿔 줍니다.

![기본 썸네일 가운데 하나](../../assets/images/defaults/default-13.jpg)

캡션을 비워두면 설명 없이 그림만 놓입니다.

![](../../assets/images/defaults/default-10.jpg)

바깥 주소도 그대로 씁니다. 이때는 최적화가 걸리지 않습니다.

![바깥에서 가져온 그림](https://placecats.com/neo/900/600)

## 영상

옵시디언에서 유튜브 주소를 이미지 문법으로 붙여 넣으면 그대로 플레이어가 됩니다.

![Zenless Zone Zero](https://www.youtube.com/watch?v=547izVR9nyg)

`youtu.be`, `/shorts/` 주소도 같습니다. 폭에 맞춰 16:9 로 늘어나고, 화면에 들어올 때 불러옵니다.

## 어디서 바뀌나

글을 쓸 때 친 것과 화면에 나오는 것이 다른 경우들입니다. 무엇이 어디서 바뀌는지 적어 둡니다.

| 바뀌는 것 | 언제 | 어디 |
| --- | --- | --- |
| `->` 가 화살표로 | 빌드 | `src/utils/remarkObsidian.ts` |
| `![](유튜브)` 가 플레이어로 | 빌드 | `src/utils/remarkObsidian.ts` |
| `## Table of contents` 아래 목차 생성 | 빌드 | `remark-toc` (`astro.config.ts`) |
| 그 목차를 접기 | 빌드 | `remark-collapse` (`astro.config.ts`) |
| `> [!note]` 가 콜아웃으로 | 빌드 | `rehype-callouts` (`astro.config.ts`) |
| 코드 색칠 | 빌드 | Shiki (`astro.config.ts`) |
| 코드 블록 파일명 띠 | 빌드 | `src/utils/transformers/fileName.js` |
| 코드의 `[!code ++]`, `[!code highlight]` | 빌드 | `@shikijs/transformers` |
| 이미지 크기 줄이기, webp 변환 | 빌드 | Astro `<Image>` |
| 썸네일 없는 글의 기본 그림 | 빌드 | `src/utils/defaultImage.ts` |
| 글자 수 세기 | 빌드 | `src/utils/readingTime.ts` |
| 콜아웃과 표, 본문 모양 | 스타일 | `src/styles/typography.css`, `global.css` |
| 이미지 눌러서 크게 보기 | 브라우저 | `src/pages/posts/[...slug]/index.astro` |
| 코드 복사 버튼 | 브라우저 | 같은 파일 |
| 목차 따라다니기, 좌측 글 목록 | 브라우저 | 같은 파일 |

빌드에서 바뀌는 것은 옵시디언이나 velog 에서는 그대로 보입니다. 옮겨 쓸 글이라면
화살표처럼 기호가 바뀌는 것을 염두에 둡니다.

## 마지막

여기까지 문제 없이 보이면 본문 스타일은 손볼 게 없습니다.
