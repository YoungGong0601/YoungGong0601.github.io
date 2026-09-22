import fs from "node:fs/promises";
import satori from "satori";
import sharp from "sharp";
import config from "@/config";

/**
 * 공유 카드(OG 이미지)를 홈 히어로와 같은 모양으로 그린다.
 *
 * 폰트를 사이트와 같은 Pretendard 로 두는 것이 핵심이다. 이전에는 IBM Plex Mono
 * 하나만 넘겨서 한글 글자가 전부 두부(□)로 나왔다. satori 는 woff2 를 읽지
 * 못하므로 woff 를 쓴다.
 *
 * 경로는 실행 위치(프로젝트 루트) 기준이다. `astro dev` 와 `astro build` 모두
 * 루트에서 돈다.
 */
const FONT_DIR = "./src/assets/fonts";
const AVATAR_PATH = "./src/assets/images/character.png";

// 색은 theme.css 의 라이트 테마와 같은 값이다. 공유 카드는 늘 밝은 쪽으로 그린다.
const BACKGROUND = "#fafafa";
const FOREGROUND = "#141414";
const MUTED = "#5f6663";
const BORDER = "#e2e2e2";
const ACCENT = "#23a8d1";

/** 홈 히어로와 푸터에 있는 문구. 설정에 자리가 없어 여기에 둔다. */
const ROLE = "Unity Client Developer & System Developer";
const TAGLINE = "Minimal Design, Maximal Fun.";

// 글마다 한 번씩 그리므로 파일은 한 번만 읽는다.
let assets: Promise<{
  regular: Buffer;
  bold: Buffer;
  avatar: string;
}> | null = null;

function loadAssets() {
  assets ??= (async () => {
    const [regular, bold, avatar] = await Promise.all([
      fs.readFile(`${FONT_DIR}/Pretendard-Regular.woff`),
      fs.readFile(`${FONT_DIR}/Pretendard-Bold.woff`),
      fs.readFile(AVATAR_PATH),
    ]);
    return {
      regular,
      bold,
      avatar: `data:image/png;base64,${avatar.toString("base64")}`,
    };
  })();
  return assets;
}

type OgImageProps = {
  /** 크게 들어가는 제목. 글 제목이거나 사이트 이름. */
  title: string;
  /** 제목 밑의 한 줄. 글 설명이거나 사이트 설명. */
  subtitle?: string;
};

export async function renderOgImage({
  title,
  subtitle,
}: OgImageProps): Promise<Response> {
  const { regular, bold, avatar } = await loadAssets();

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: BACKGROUND,
          color: FOREGROUND,
          fontFamily: "Pretendard",
        },
        children: [
          // 홈 히어로의 프로필 줄
          {
            type: "div",
            props: {
              style: { display: "flex", alignItems: "center", gap: "20px" },
              children: [
                {
                  type: "img",
                  props: {
                    src: avatar,
                    width: 88,
                    height: 88,
                    style: {
                      borderRadius: "44px",
                      border: `1px solid ${BORDER}`,
                      background: "#ffffff",
                    },
                  },
                },
                {
                  type: "div",
                  props: {
                    style: { display: "flex", flexDirection: "column" },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: { fontSize: 32, fontWeight: 700 },
                          children: config.site.author,
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: { fontSize: 20, color: MUTED },
                          children: ROLE,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },

          // 제목. 왼쪽 강조선은 About 페이지의 인용 줄과 같은 모양이다.
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexGrow: 1,
                alignItems: "center",
                gap: "24px",
                padding: "40px 0",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      width: "6px",
                      alignSelf: "stretch",
                      borderRadius: "3px",
                      background: ACCENT,
                    },
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                      overflow: "hidden",
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: 60,
                            fontWeight: 700,
                            lineHeight: 1.25,
                            letterSpacing: "-0.02em",
                            maxHeight: "230px",
                            overflow: "hidden",
                          },
                          children: title,
                        },
                      },
                      ...(subtitle
                        ? [
                            {
                              type: "div",
                              props: {
                                style: {
                                  marginTop: "16px",
                                  fontSize: 26,
                                  lineHeight: 1.4,
                                  color: MUTED,
                                  maxHeight: "74px",
                                  overflow: "hidden",
                                },
                                children: subtitle,
                              },
                            },
                          ]
                        : []),
                    ],
                  },
                },
              ],
            },
          },

          // 홈 히어로 아래의 경계선과 같은 리듬
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: "24px",
                borderTop: `1px solid ${BORDER}`,
                fontSize: 22,
              },
              children: [
                {
                  type: "div",
                  props: { style: { color: MUTED }, children: TAGLINE },
                },
                {
                  type: "div",
                  props: {
                    style: { color: ACCENT, fontWeight: 700 },
                    children: new URL(config.site.url).hostname,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Pretendard", data: regular, weight: 400, style: "normal" },
        { name: "Pretendard", data: bold, weight: 700, style: "normal" },
      ],
    }
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
}
