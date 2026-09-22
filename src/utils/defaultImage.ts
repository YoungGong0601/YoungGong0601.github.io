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
