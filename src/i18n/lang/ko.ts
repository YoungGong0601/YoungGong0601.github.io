import type { UIStrings } from "../types";

export default {
  nav: {
    home: "Home",
    posts: "DEVLOG",
    tags: "Tags",
    series: "Series",
    about: "About",
    archives: "Archives",
    search: "Search",
  },
  post: {
    publishedAt: "작성",
    updatedAt: "수정",
    sharePostIntro: "이 글 공유하기",
    sharePostOn: "{{platform}}에 공유",
    sharePostViaEmail: "메일로 공유",
    tagLabel: "Tags",
    backToTop: "맨 위로",
    goBack: "Back",
    editPage: "이 글 고치기",
    previousPost: "이전 글",
    nextPost: "다음 글",
  },
  pagination: {
    prev: "이전",
    next: "다음",
    page: "Page",
  },
  home: {
    socialLinks: "링크",
    featured: "Pinned",
    recentPosts: "최근 글",
    allPosts: "글 전체",
  },
  footer: {
    copyright: "Copyright",
    allRightsReserved: "All rights reserved.",
  },
  pages: {
    tagTitle: "Tags",
    tagDesc: "이 태그가 달린 글",

    tagsTitle: "Tags",
    tagsDesc: "",

    postsTitle: "DEVLOG",
    postsDesc: "",

    archivesTitle: "아카이브",
    archivesDesc: "연도와 월별로 모아본 글.",

    searchTitle: "검색",
    searchDesc: "글 내용으로 찾기",
  },
  a11y: {
    skipToContent: "본문으로 건너뛰기",
    openMenu: "메뉴 열기",
    closeMenu: "메뉴 닫기",
    toggleTheme: "테마 바꾸기",
    searchPlaceholder: "글 검색...",
    noResults: "결과가 없습니다",
    goToPreviousPage: "이전 페이지로",
    goToNextPage: "다음 페이지로",
  },
  notFound: {
    title: "404",
    message: "찾는 페이지가 없습니다",
    goHome: "홈으로",
  },
} satisfies UIStrings;
