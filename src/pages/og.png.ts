import type { APIRoute } from "astro";
import { renderOgImage } from "@/utils/ogImage";
import config from "@/config";

/** 글이 아닌 화면이 쓰는 기본 공유 카드 */
export const GET: APIRoute = () =>
  renderOgImage({
    title: config.site.title,
    subtitle: config.site.description,
  });
