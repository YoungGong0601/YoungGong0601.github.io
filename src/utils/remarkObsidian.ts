import { visit } from "unist-util-visit";
import type { Html, Root } from "mdast";

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
const YOUTUBE =
  /^https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/;

/**
 * 옵시디언에서 쓴 글을 사이트용으로 다듬는다.
 *
 * 1. `![](유튜브 주소)` 를 실제 플레이어로 바꾼다.
 *    옵시디언은 이 문법을 미리보기에서 영상으로 보여주지만, 마크다운
 *    그대로는 <img src="유튜브 주소"> 가 되어 깨진 이미지가 된다.
 * 2. `->` 같은 기호를 화살표로 바꾼다. 본문 글자에만 적용된다.
 */
export function remarkObsidian() {
  return (tree: Root) => {
    visit(tree, "text", node => {
      for (const [pattern, glyph] of ARROWS) {
        node.value = node.value.replace(pattern, glyph);
      }
    });

    visit(tree, "image", (node, index, parent) => {
      if (!parent || index === undefined) return;

      const id = YOUTUBE.exec(node.url)?.[1];
      if (!id) return;

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
