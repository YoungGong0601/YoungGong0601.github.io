import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";

export type Taxon = {
  /** 화면에 그대로 쓰고, 주소의 ?tag= / ?series= 에도 그대로 실린다 */
  name: string;
  /** 이 이름이 붙은 글 수 */
  count: number;
};

/** 글이 많은 것부터, 같으면 이름순. 레일과 목록이 모두 이 순서를 쓴다. */
function tally(names: string[]): Taxon[] {
  const counts = new Map<string, number>();
  for (const name of names) {
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getTags(posts: CollectionEntry<"posts">[]) {
  return tally(posts.filter(postFilter).flatMap(post => post.data.tags));
}

export function getSeries(posts: CollectionEntry<"posts">[]) {
  return tally(
    posts
      .filter(postFilter)
      .map(post => post.data.series?.trim())
      .filter((name): name is string => Boolean(name))
  );
}
