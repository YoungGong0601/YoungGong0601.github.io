import type { APIRoute } from "astro";
import { renderOgImage } from "@/utils/ogImage";

/** 글이 아닌 화면이 쓰는 기본 공유 카드 */
export const GET: APIRoute = () =>
  renderOgImage({
    // 루트는 포트폴리오와 블로그로 가는 입구다. 이름은 카드 위쪽 프로필에 이미 있다
    title: "Portfolio, Blog",
    subtitle: "만든 게임과 프로젝트, 개발하며 남긴 기록",
  });
