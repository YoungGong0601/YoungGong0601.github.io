---
title: AI Chat 텍스트 강조와 시각적 커스텀 (KaTeX 활용)
description: ""
pubDatetime: 2026-10-16T18:33:58+09:00
tags:
  - 기록
draft: false
---

![](img/Pasted%20image%2020261016183523.png)

> 이 모든게 케이텍(KaTeX) 문법으로 표기할 수 있다.

AI 챗 서비스를 이용 할 때 이러한 강조 표기 등이 가능하기 때문에 이를 적극 활용해보는 것도 좋다.

> **이름 정리**
> 
> - **LaTeX** (레이텍, 라텍): 문서 전체를 컴파일해 PDF를 만드는 조판 프로그램.
> - **KaTeX** (케이텍): 웹 화면에서 LaTeX의 **수식 문법만** 즉시 그려 주는 라이브러리. AI 채팅창이 이것을 쓴다.
> - **MathJax** (매스잭스): KaTeX와 같은 역할의 다른 라이브러리. Obsidian은 이쪽을 쓴다.
> - 채팅에서 쓰는 도구는 "KaTeX", 문법을 가리킬 때는 "LaTeX 수식"이라고 하면 정확하다.

#### AI 채팅에서 이런 것도 렌더링됩니다

**인챗 위젯**

- SVG로 도식을 그리고, HTML 안에 SVG를 넣어 JS로 움직이면 슬라이더나 버튼이 달린 인터랙티브 시각화가 대화창 안에서 돌아갑니다.
- `<canvas>`와 `requestAnimationFrame`을 쓰면 벽돌깨기 같은 실시간 게임도 채팅 안에서 플레이할 수 있습니다.
- 채팅 본문에선 안 되는 접기도 위젯 안의 `<details>`로 가능해서, 출처 목록을 “Sources:”만 보이게 접어 둘 수 있습니다.

**KaTeX 꾸미기**

- 글자색 `\color`, `\textcolor`, 형광펜 `\colorbox`
- 배지, 상태 태그, 도장 `\fcolorbox{테두리}{배경}{\color{글자}\text{...}}`
- 상자 `\boxed`, 키보드 키 `\fbox{\texttt{Ctrl}}`
- 크기 `\small`, `\large`, `\Huge` 등으로 큰 숫자 지표나 강조
- 글꼴 `\textbf`, `\texttt`, `\textsf`, 장식 영문 `\mathfrak`, `\mathcal`, `\mathbb`
- 기호 신호등 점 `\bullet`, 별점 `\bigstar`, 글자 달린 화살표 `\xrightarrow{}`
- 첨삭 `\cancel`, `\xcancel`로 지우기, `\overset`으로 위에 고친 말, `\underbrace`로 아래 코멘트, `\overbrace`로 위 묶음 설명
- 본문 속 막대 그래프 `\rule{길이}{두께}`, `\rlap{\text{이름}}\hspace{고정폭}`으로 시작점 정렬

**KaTeX 요령**

- 한글은 `\text{}` 안에
- `\color`는 뒤쪽 전체를 칠하므로 `{}`로 범위를 묶기
- 색 배경엔 다크 모드 대비 글자색도 지정
- 여러 줄 수식은 `$...$` 안에서 줄바꿈하지 말고 `$$...$$`로
- 문서용 명령(`\section`, `tabular`, `\includegraphics`, `tikz`, `\usepackage`)은 KaTeX에서 렌더링되지 않음. 필요하면 LaTeX로 컴파일한 PDF나 PNG로 받기

**마크다운**

- 빈 줄은 여러 개 넣어도 하나로 합쳐지므로, 간격을 더 벌리려면 `&nbsp;` 줄을 끼웁니다.

**쓰는 감각**

- 신기하다고 다 쓰면 산만해지니 필요한 곳에 한두 개씩 섞어 쓰는 정도가 가장 보기 좋습니다.

## 사용 예

![](img/Pasted%20image%2020261016184429.png)
![](img/Pasted%20image%2020261016183734.png)

> - LaTeX 수식 문법(KaTeX)을 이용해 수식을 표현하고 열을 나눠 풀이를 읽기 쉽게 한다.
> - SVG 위젯으로 시각화하여 보여준다.
> - 후속 질문 버튼 (sendPrompt) 을 상시 표기하도록 한다. (버튼을 누르면 프롬프트 채팅 없이 전송된다.)

## 내가 주로 쓰는 방식을 나열해 봄 (KaTeX, 채팅)

### 1. 증명 3열 배치

|문법|용도|
|---|---|
|`$$ ... $$`|블록 수식 하나에 증명 전체|
|`\begin{array}{lll} ... \end{array}`|1열 영어 연결어, 2열 식, 3열 근거. 모두 왼쪽 정렬|
|`&`|열 구분|
|`\\[10pt]`|줄 간격|
|`\\[16pt]`|단락 사이 간격 (목표 다음, 결론 앞)|
|`\qquad\qquad`|식과 3열 근거 사이 띄우기|
|`\text{Assume}`, `(\text{F의 정의})`|영어 연결어, 한글 근거를 수식 안에|
|`\phantom{H'(t)} = \cdots`|이어지는 등식의 등호 위치 맞추기|
|`\blacksquare`|증명 끝|

### 2. 크기와 간격

|문법|용도|
|---|---|
|`\displaystyle`|array 안에서 적분, 합 기호를 크게|
|`\textstyle`|근거 열처럼 작게 둘 곳|
|`\;`, `\;\;`|쉼표로 이어지는 조건 사이|
|`\quad`|연결어 뒤, 정의식과 정의역 사이 (`u \in I`)|

### 3. 용어와 기호

|문법|용도|
|---|---|
|`\underset{\text{한글}}{\text{English}}`|용어 처음 나올 때만 한영 병기|
|`S(f;\dot{\mathcal P})`|기호를 줄이지 않고 의존 대상까지 쓰기|
|`\mathcal{R}[a,b]`, `C^1[\alpha,\beta]`, `\mathbb{R}`|함수 집합, 실수|
|`:=`, `\circ`|정의, 합성|
|`\forall`, `\exists`, `\Rightarrow`, `\Leftrightarrow`|양화사 기호형식|
|`\in`, `\subseteq`|집합 관계|
|`\langle\ ,\ \rangle`, `\cdot`|내적, 곱 (가운뎃점 문자 대신)|

### 4. 선형대수

|문법|용도|
|---|---|
|`\begin{bmatrix} ... \end{bmatrix}`|행렬|
|`R_2 \leftarrow R_2-2R_1`|행 연산, 한 줄에 하나|
|`\mathbf x`|벡터|

### 5. 쓰지 않는 것

|문법|이유|
|---|---|
|array 열 지정의 `@{}`|KaTeX 오류|
|`A \Rightarrow B \Rightarrow C`|여러 단계를 화살표로 잇지 않고 단계마다 줄 바꿈|
|`<sub>`|병기는 `\underset`으로|

## 참고: 문서용 LaTeX (PDF 컴파일 전용, 채팅에서는 렌더링 안 됨)

시험지, 풀이본 PDF를 만들 때 쓰는 쪽이다. 채팅에서 보려면 컴파일한 PDF나 PNG로 받아야 한다.

|분야|명령, 패키지|용도|
|---|---|---|
|뼈대|`\documentclass[11pt]{article}`, `\usepackage{}`, `\begin{document}`|문서 종류(`article`, `report`, `book`, `beamer`, `letter`), 기능 추가, 본문|
|제목|`\title{}`, `\author{}`, `\maketitle`, `\tableofcontents`|제목 블록, 목차 자동|
|구조|`\section{}`, `\subsection{}`, `\section*{}`, `\chapter{}`, `\appendix`|절, 번호 자동|
|분할|`\input{}`, `\include{}`|긴 문서를 파일로 나눠 합치기|
|글자|`\textbf{}`, `\emph{}`, `\textsc{}`, `\tiny` ~ `\Huge`, `xcolor`|굵게, 강조, 작은 대문자, 크기, 색|
|목록|`itemize`, `enumerate`(`enumitem`), `description`|글머리표, 번호, 용어 목록|
|표|`tabular`, `\hline`, `\multicolumn`, `\multirow`, `booktabs`, `table` + `\caption`|표, 셀 병합, 논문식 표|
|그림|`\includegraphics`(`graphicx`), `figure` + `\caption`, `tikz`, `pgfplots`|이미지, 직접 그리기, 그래프|
|참조|`\label{}`, `\ref{}`, `\footnote{}`, `\href{}{}`(`hyperref`)|번호 참조, 각주, 링크|
|참고문헌|`\cite{}`, `.bib` + `biblatex` 또는 `bibtex`|인용, 양식(APA, IEEE) 전환|
|쪽 배치|`geometry`, `fancyhdr`, `\newpage`, `\vspace{}`, `multicol`, `setspace`|여백, 머리말, 쪽 넘김, 간격, 다단, 줄 간격|
|특수|`listings`, `minted`, `tcolorbox`, `algorithm2e`, `siunitx`, `mhchem`, `circuitikz`|코드, 색 상자, 의사코드, 단위, 화학식, 회로|
|언어|`kotex`, `fontspec`, `babel`|한글, 시스템 글꼴, 다국어|
|자동화|`\newcommand`, `\renewcommand`, `\newenvironment`, `\newtheorem`(`amsthm`)|단축어, 나만의 환경, 정리 번호 자동|
|문서 종류|`beamer`, `moderncv`, `tikzposter`, `exam`, `memoir`|슬라이드, 이력서, 포스터, 시험지, 책|