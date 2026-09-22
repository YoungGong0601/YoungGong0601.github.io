import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://YoungGong0601.github.io",
    title: "Hong Ryoung Gi",
    description: "기록 블로그",
    author: "홍령기",
    profile: "https://github.com/YoungGong0601",
    lang: "ko",
    timezone: "Asia/Seoul",
    dir: "ltr",
  },
  posts: {
    perPage: 12,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: { enabled: false },
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/YoungGong0601" },
    {
      name: "notion",
      url: "https://younggong0601.notion.site/_-3d895708e15a80648c7bf4d2957ce5f7",
    },
    { name: "mail", url: "mailto:loveleter1@gmail.com" },
  ],
  shareLinks: [],
});
