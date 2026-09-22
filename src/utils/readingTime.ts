/**
 * 글 분량(글자 수)을 빌드 때 미리 계산한다.
 * 코드 블록과 마크다운 기호는 빼고 실제로 읽는 글자만 센다.
 */
export function readingStats(body = "") {
  const text = body
    .replace(/^---[\s\S]*?---/, " ") // frontmatter
    .replace(/```[\s\S]*?```/g, " ") // 코드 블록
    .replace(/`[^`]*`/g, " ") // 인라인 코드
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // 이미지
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // 링크는 글자만 남김
    .replace(/^\s*import .*$/gm, " ") // mdx import
    .replace(/<[^>]+>/g, " ") // 태그
    .replace(/[#>*_~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return { chars: [...text].length };
}
