---
title: "마크다운 렌더링 확인"
description: "제목, 목록, 표, 코드 블록, 콜아웃이 어떻게 보이는지 한 페이지에서 확인합니다."
series: "블로그 만들기"
pubDatetime: 2026-09-21T14:30:00+09:00
tags:
  - 테스트
  - 마크다운
featured: true
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

## 마지막

여기까지 문제 없이 보이면 본문 스타일은 손볼 게 없습니다.
