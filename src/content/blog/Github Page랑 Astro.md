---
title: "첫 글 : Github Page + Astro"
description: 블로그 작성에 앞서 Astro로 DEVLOG 공간을 마련했습니다.
pubDatetime: 2026-09-22T20:00:11+09:00
tags:
  - 기록
draft: false
featured: true
heroImage: img/스크린샷 2026-09-13 014605.png
series: 잡담글
---
자신의 학습 이력을 담기 위해, DEVLOG 공간을 마련했습니다!
https://younggong0601.github.io/
# 마련하게 된 계기
예전부터 로그를 남기는 작업을 잘 하지 않았었는데, 동아리에서 한번 마음 잡고 다같이 작성해보자! 하게 되어 시작하게 되었습니다. 언제까지 이어질지 궁금하네요.

## 사이트 소개
> 🔨 Claude Code -> 🏚 Astro -> 📤 GitHub Page

Github Page에서 Jekyll를 예전에 이용해 본 기억이 있지만, 디자인이 너무 투박하고 구현된 내용이 적어 금방 포기하게 되었습니다. 이번에 글 작성 기회가 다시 찾아온 김에 Claude와 대화를 나누던 도중 **Astro**라는 서비스를 발견하게 되었고, **Astro의 템플릿 AstroPaper를 Claude와 함께 활용하여 디자인을 수정해봤습니다.**

과거에는 옵시디언(Obsidian)의 각종 플러그인이 익숙하지 않기도 헀고 Jekyll에 글이 쌓이는 것도 별로 기분에 와닿지 않아 포기하게 되었습니다.

이제는 옵시디언에서 바로 문서를 파서 글을 작성하고, 미리 만들어진 템플릿을 이용해 불편함 없이 글을 작성하고 GitHub Page를 빌드할 수 있게 되었습니다.
> ✍️ Obsidian -> 📤 GitHub Page -> ⭐ Finish!
1. ✍️ Obsidian에서 문서를 파 글을 작성합니다.
2. 📤 git push
3. ⭐ 전송 완료!

## Astro란?
![](img/Pasted%20image%2020260922202737.png)
[Astro](https://astro.build/)는 다양한 사이트,블로그 `content-driven websites`를 위한 **Web framework**입니다.
Astro는 빌드할 때 HTML을 다 만들어 두고, 방문자에게 완성된 HTML을 주는 정적 사이트 빌더로,
글, 문서 등 내용을 보여주는 사이트를 겨냥한 프레임워크입니다.

Jekyll와 다르게 Node 기반이며, 마크다운 확장을 자유롭게 할 수 있습니다. 편의를 위한 작업을 할 수 있습니다.

`./blog` 디렉토리에 있는 내부 .md를 모두 읽어 전송하며, 정규식으로 원하는 .md문서만 읽게 하였으며, Pin 기능을 추가하여 커스터마이징하였습니다.