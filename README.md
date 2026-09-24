# Hong Ryoung Gi

홍령기의 기록 블로그입니다.

🔗 https://younggong0601.github.io

## 기술 스택

- [Astro](https://astro.build) (AstroPaper 테마 기반)
- Tailwind CSS
- Pagefind (정적 검색)
- GitHub Pages + GitHub Actions 자동 배포

## 시작하기

Node.js 22.12.0 이상이 필요합니다.

```sh
npm install
npm run dev
```

## 명령어

| 명령어                 | 설명                                        |
| :--------------------- | :------------------------------------------ |
| `npm run dev`          | 로컬 개발 서버 실행 (`localhost:4321`)      |
| `npm run build`        | 타입 체크, 빌드, 검색 색인 생성 (`./dist/`) |
| `npm run preview`      | 빌드 결과 미리보기                          |
| `npm run lint`         | ESLint 검사                                 |
| `npm run format`       | Prettier 포맷 적용                          |
| `npm run format:check` | Prettier 포맷 검사                          |

## 글 작성

글은 `src/content/blog/` 에 마크다운(`.md`, `.mdx`)으로 작성합니다. 옵시디언에서 바로 쓸 수 있도록 맞춰 두었습니다.

```yaml
---
title: 글 제목
description: 글 요약
pubDatetime: 2026-01-01T00:00:00+09:00
tags: [devlog]
draft: false
---
```

- `_` 로 시작하는 파일이나 폴더(예: `_templates`)는 빌드에서 제외됩니다.
- 옵시디언 이미지 크기 문법 `![475](이미지)` 와 유튜브 임베드를 지원합니다.
- `->`, `<-`, `=>` 같은 화살표는 자동으로 기호로 바뀝니다.

## 프로젝트 구조

```text
├── public/               정적 파일
├── src/
│   ├── assets/           이미지, 아이콘
│   ├── components/       Astro 컴포넌트
│   ├── content/
│   │   ├── blog/         블로그 글
│   │   └── pages/        About 등 단일 페이지
│   ├── layouts/          레이아웃
│   ├── pages/            라우트
│   └── utils/            remark 플러그인 등 유틸
├── astro-paper.config.ts 사이트 정보, 기능, 소셜 링크 설정
└── astro.config.ts       Astro 설정
```

## 배포

`main` 브랜치에 푸시하면 GitHub Actions(`.github/workflows/deploy.yml`)가 빌드 후 GitHub Pages로 배포합니다.
