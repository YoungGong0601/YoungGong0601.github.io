import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { visit } from "unist-util-visit";
import type { Html, Root } from "mdast";
import type { VFile } from "vfile";

/**
 * 손으로 치기 번거로운 기호. 긴 것부터 찾아야 <-> 가 <- 로 먼저 잡히지 않는다.
 * 코드 블록과 인라인 코드는 text 노드가 아니라서 애초에 걸리지 않는다.
 */
const ARROWS: [RegExp, string][] = [
  [/<->/g, "↔"],
  [/<=>/g, "⇔"],
  [/->/g, "→"],
  [/<-/g, "←"],
  [/=>/g, "⇒"],
];
/** 옵시디언은 `![475](...)` 처럼 alt 자리에 폭(또는 폭x높이)을 적는다 */
const SIZE = /^\s*(\d+)(?:\s*[x×]\s*(\d+))?\s*$/;
const YOUTUBE =
  /^https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/;
const VIDEO = /\.(mp4|webm|mov)$/i;

/**
 * 옵시디언에서 쓴 글을 사이트용으로 다듬는다.
 *
 * 1. `![](유튜브 주소)` 를 실제 플레이어로 바꾼다.
 *    옵시디언은 이 문법을 미리보기에서 영상으로 보여주지만, 마크다운
 *    그대로는 <img src="유튜브 주소"> 가 되어 깨진 이미지가 된다.
 * 2. `->` 같은 기호를 화살표로 바꾼다. 본문 글자에만 적용된다.
 * 3. 이미지 경로의 %20 을 되돌린다. 옵시디언이 "Pasted image ....png" 처럼
 *    공백이 든 이름을 붙여 넣으면 마크다운에는 %20 으로 들어가는데,
 *    Astro 의 이미지 해석은 이 인코딩을 풀지 않아 파일을 못 찾는다.
 * 4. alt 이 숫자뿐이면 폭으로 본다. 옵시디언에서 이미지를 끌어 크기를 줄이면
 *    `![475](...)` 가 되는데, 그대로 두면 475 가 대체 텍스트로 나간다.
 * 5. `![](img/a.mp4)` 를 <video> 로 바꾼다. Astro 는 이미지만 옮겨주므로
 *    영상 파일은 public/media 로 복사해서 정적 파일로 내보낸다.
 */
export function remarkObsidian() {
  return (tree: Root, file: VFile) => {
    visit(tree, "text", node => {
      for (const [pattern, glyph] of ARROWS) {
        node.value = node.value.replace(pattern, glyph);
      }
    });

    visit(tree, "image", (node, index, parent) => {
      if (!parent || index === undefined) return;

      const id = YOUTUBE.exec(node.url)?.[1];
      if (!id) {
        // 바깥 주소는 건드리지 않는다. 같은 폴더의 파일만 풀어준다.
        if (!/^[a-z]+:|^\/\//i.test(node.url)) {
          node.url = decodeURI(node.url);
        }

        if (VIDEO.test(node.url) && file.path) {
          // ponytail: 파일명만 쓰므로 다른 글에 같은 이름의 영상이 있으면 덮어쓴다
          const src = resolve(dirname(file.path), node.url);
          const name = basename(src);
          mkdirSync("public/media", { recursive: true });
          if (existsSync(src)) copyFileSync(src, `public/media/${name}`);
          parent.children[index] = {
            type: "html",
            value: `<video src="/media/${encodeURIComponent(name)}" controls playsinline preload="metadata"></video>`,
          };
          return;
        }

        const size = SIZE.exec(node.alt ?? "");
        if (size) {
          node.alt = "";
          node.data = {
            ...node.data,
            hProperties: {
              width: Number(size[1]),
              ...(size[2] ? { height: Number(size[2]) } : {}),
            },
          };
        }
        return;
      }

      const title = node.alt?.trim() || "YouTube 영상";

      const embed: Html = {
        type: "html",
        value:
          `<div class="embed-video">` +
          `<iframe src="https://www.youtube-nocookie.com/embed/${id}" ` +
          `title="${title.replace(/"/g, "&quot;")}" loading="lazy" ` +
          `allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture" ` +
          `allowfullscreen></iframe></div>`,
      };

      parent.children[index] = embed;
    });
  };
}
