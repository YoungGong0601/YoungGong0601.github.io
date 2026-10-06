import type { ImageMetadata } from "astro";

import default1 from "@/assets/images/defaults/default-1.jpg";
import default2 from "@/assets/images/defaults/default-2.jpg";
import default3 from "@/assets/images/defaults/default-3.jpg";
import default4 from "@/assets/images/defaults/default-4.jpg";
import default5 from "@/assets/images/defaults/default-5.jpg";
import default6 from "@/assets/images/defaults/default-6.jpg";
import default7 from "@/assets/images/defaults/default-7.jpg";
import default8 from "@/assets/images/defaults/default-8.jpg";
import default9 from "@/assets/images/defaults/default-9.jpg";
import default10 from "@/assets/images/defaults/default-10.jpg";
import default11 from "@/assets/images/defaults/default-11.jpg";
import default12 from "@/assets/images/defaults/default-12.jpg";
import default13 from "@/assets/images/defaults/default-13.jpg";
import default14 from "@/assets/images/defaults/default-14.jpg";
import default15 from "@/assets/images/defaults/default-15.jpg";
import default16 from "@/assets/images/defaults/default-16.jpg";

const DEFAULTS: ImageMetadata[] = [
  default1,
  default2,
  default3,
  default4,
  default5,
  default6,
  default7,
  default8,
  default9,
  default10,
  default11,
  default12,
  default13,
  default14,
  default15,
  default16,
];

/**
 * 썸네일이 없는 글에 쓸 기본 이미지를 고른다.
 * 글 id 로 해시를 만들어 같은 글은 항상 같은 이미지를 받는다.
 */
export function defaultImage(key: string): ImageMetadata {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return DEFAULTS[hash % DEFAULTS.length];
}

/** 블로그 폴더 안의 이미지. 본문 경로를 실제 이미지로 바꿀 때 쓴다 */
const BODY_IMAGES = import.meta.glob<ImageMetadata>(
  "/src/content/blog/**/*.{jpg,jpeg,png,webp,gif,avif}",
  { eager: true, import: "default" }
);

/**
 * 글 목록에 쓸 썸네일. heroImage → 본문에 처음 나오는 이미지 → 기본 이미지 순.
 * 영상이나 바깥 주소는 BODY_IMAGES 에 없으니 저절로 건너뛰고 다음 이미지를 본다.
 */
export function postThumbnail(post: {
  id: string;
  body?: string;
  filePath?: string;
  data: { heroImage?: ImageMetadata };
}): ImageMetadata {
  if (post.data.heroImage) return post.data.heroImage;

  if (post.body && post.filePath) {
    const dir = post.filePath.replace(/\\/g, "/").replace(/[^/]*$/, "");
    for (const [, url] of post.body.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)) {
      let path: string;
      try {
        path = decodeURIComponent(new URL(url, `file:///${dir}`).pathname);
      } catch {
        continue;
      }
      const image = BODY_IMAGES[path];
      if (image) return image;
    }
  }

  return defaultImage(post.id);
}
