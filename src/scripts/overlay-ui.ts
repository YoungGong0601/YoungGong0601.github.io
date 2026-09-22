// 오버레이 스크롤바, 목록 스크롤 위치 기억, 유리 커서.
// ClientRouter 가 body 를 교체하므로 페이지 전환마다 요소를 다시 붙인다.
//
// 페이지 종류는 각 페이지가 <body data-page="list|post"> 로 선언한다.
// 여기서 경로를 알아보려 들면 라우팅 표가 두 벌이 되어 조용히 어긋난다.

// 지금 페이지와 직전 페이지의 종류
let pageKind = "";
let lastPageKind = "";

function ensure(id: string) {
  const found = document.getElementById(id);
  if (found) return found;
  const el = document.createElement("div");
  el.id = id;
  document.body.appendChild(el);
  return el;
}

// ── 오버레이 스크롤바 ──────────────
// ponytail: 페이지 세로 스크롤만 그린다. 내부 스크롤 영역이나 썸 드래그가
// 필요해지면 overlayscrollbars 로 교체.
const IDLE_HIDE = 5000;
let hideTimer: ReturnType<typeof setTimeout> | undefined;

function scrollOverlay() {
  const bar = ensure("scroll-overlay");

  return () => {
    const total = document.documentElement.scrollHeight;
    const view = window.innerHeight;
    if (total <= view + 1) {
      bar.style.opacity = "0";
      return;
    }
    const thumb = Math.max((view * view) / total, 40);
    bar.style.height = `${thumb}px`;
    bar.style.transform = `translateY(${
      ((view - thumb) * window.scrollY) / (total - view)
    }px)`;
    bar.style.opacity = "1";

    // 한동안 움직임이 없으면 접어둔다
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => (bar.style.opacity = "0"), IDLE_HIDE);
  };
}

// ── 안쪽 스크롤 칸의 막대 ──────────────
// 레일 안에서 따로 스크롤하는 칸에 페이지와 같은 모양의 막대를 붙인다.
// 막대는 스크롤되지 않도록 칸의 부모(position: relative)에 둔다.
let boxObservers: ResizeObserver[] = [];

function innerScrollbars() {
  // body 가 통째로 바뀌었으므로 앞 페이지의 옵저버는 버린다
  for (const observer of boxObservers) observer.disconnect();
  boxObservers = [];

  for (const box of document.querySelectorAll<HTMLElement>(".scroll-box")) {
    const holder = box.parentElement;
    if (!holder) continue;

    const bar = document.createElement("div");
    bar.className = "inner-scrollbar";
    holder.appendChild(bar);

    const hint = document.createElement("span");
    hint.className = "scroll-hint";
    hint.setAttribute("aria-hidden", "true");
    holder.appendChild(hint);

    // 칸의 크기는 리사이즈 때만 바뀐다. 스크롤 중에 다시 재지 않는다.
    let view = 0;
    let total = 0;
    let thumb = 0;
    let scrollable = false;

    // 막대는 움직이는 동안에만 보인다
    let hide: ReturnType<typeof setTimeout> | undefined;
    let frame = 0;

    const paint = (moving: boolean) => {
      if (!scrollable) {
        bar.style.opacity = "0";
        hint.style.opacity = "0";
        return;
      }

      bar.style.transform = `translateY(${
        ((view - thumb) * box.scrollTop) / (total - view)
      }px)`;

      // 바닥에 닿으면 더 볼 것이 없다
      const atEnd = box.scrollTop + view >= total - 2;
      hint.style.opacity = atEnd ? "0" : "1";

      if (moving) {
        bar.style.opacity = "1";
        clearTimeout(hide);
        hide = setTimeout(() => (bar.style.opacity = "0"), 600);
      }
    };

    const measure = () => {
      view = box.clientHeight;
      total = box.scrollHeight;
      scrollable = total > view + 1;
      if (scrollable) {
        thumb = Math.max((view * view) / total, 24);
        bar.style.top = `${box.offsetTop}px`;
        bar.style.height = `${thumb}px`;
      }
      paint(false);
    };

    box.addEventListener(
      "scroll",
      () => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          paint(true);
        });
      },
      { passive: true }
    );

    const observer = new ResizeObserver(measure);
    observer.observe(box);
    boxObservers.push(observer);
    measure();
  }
}

// ── 유리 커서 ──────────────
// 기본 포인터를 숨기고 유리 원으로 대신한다. 푸터 토글로 켜고 끈다.
const CURSOR_KEY = "glassCursor";
const CURSOR_TARGETS = "a[href], button, summary, input, [role='button']";

let dot: HTMLElement | null = null;

function cursorOn() {
  try {
    return localStorage.getItem(CURSOR_KEY) === "1";
  } catch {
    return false;
  }
}

function applyCursor() {
  const on = cursorOn();
  document.documentElement.dataset.cursor = on ? "glass" : "";

  if (!on) {
    dot?.remove();
    dot = null;
  } else if (!dot?.isConnected) {
    dot = ensure("cursor-glass");
    dot.setAttribute("aria-hidden", "true");
  }

  document
    .getElementById("cursor-toggle")
    ?.setAttribute("aria-pressed", String(on));
}

// ponytail: 터치 기기 숨김은 CSS 의 (pointer: coarse) 가 맡는다
let cursorBound = false;

function setupGlassCursor() {
  if (cursorBound) return;
  cursorBound = true;

  // 포인터는 한 프레임에 여러 번 올 수 있다. 그릴 때는 마지막 값만 쓴다.
  let x = 0;
  let y = 0;
  let target: Element | null = null;
  let frame = 0;

  const draw = () => {
    frame = 0;
    if (!dot) return;
    dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;

    // 조상 탐색은 그리는 프레임에서 한 번만 한다
    const over = target?.closest?.(CURSOR_TARGETS) ? "target" : "";
    if (dot.dataset.over !== over) dot.dataset.over = over;
    if (dot.dataset.visible !== "true") dot.dataset.visible = "true";
  };

  // body 가 교체돼도 document 는 남으므로 리스너는 한 번만 붙인다
  document.addEventListener(
    "pointermove",
    event => {
      x = event.clientX;
      y = event.clientY;
      target = event.target as Element | null;
      if (!frame) frame = requestAnimationFrame(draw);
    },
    { passive: true }
  );

  document.addEventListener("pointerleave", () => {
    if (dot) dot.dataset.visible = "false";
  });

  const press = (state: string) => () => {
    if (dot) dot.dataset.pressed = state;
  };

  document.addEventListener("pointerdown", press("true"), { passive: true });
  document.addEventListener("pointerup", press("false"), { passive: true });
  document.addEventListener("pointercancel", press("false"), { passive: true });

  document.addEventListener("click", event => {
    if (!(event.target as Element | null)?.closest?.("#cursor-toggle")) return;
    try {
      localStorage.setItem(CURSOR_KEY, cursorOn() ? "0" : "1");
    } catch {}
    applyCursor();
  });
}

// ── 글에서는 내려갈 때 헤더를 접는다 ──────────────
// 읽는 동안 화면을 넓게 쓰고, 올리면 바로 다시 나온다.
let header: HTMLElement | null = null;
let lastScrollY = 0;

function autoHideHeader() {
  if (!header || pageKind !== "post") return;

  const y = window.scrollY;
  const hidden = String(y > lastScrollY && y > 160);
  lastScrollY = y;
  // 같은 값을 다시 쓰면 전환이 괜히 깨어난다
  if (header.dataset.hidden !== hidden) header.dataset.hidden = hidden;
}

// ── 스크롤 위치 기억 ──────────────
// 목록 성격의 페이지는 떠날 때 위치를 저장하고 돌아오면 그 자리로 복원한다.
// 글 페이지는 항상 맨 위에서 시작한다.
const SCROLL_KEY = "scrollByPath";

// 리스너는 한 번만 붙인다 (이 파일은 모듈이라 한 번만 평가된다)
let scrollMemoryBound = false;

// ClientRouter 는 swap 전에 URL 을 이미 바꾼다. 진입 시점 경로를 따로 들고 있는다.
let currentPath = normalize(location.pathname);

// ClientRouter 는 이동 이벤트보다 먼저 스크롤을 0 으로 되돌린다.
// 그래서 이동 시점의 window.scrollY 는 쓸 수 없고, 마지막 정상 위치를 따로 둔다.
let stableY = 0;

// 이동이 시작되면 ClientRouter 가 맨 위로 올리는데, 그 0 을 저장하면 안 된다
let navigating = false;

// /posts 와 /posts/ 를 같은 키로 본다
function normalize(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/";
}

function readStore(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem(SCROLL_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveScroll(y: number) {
  if (pageKind !== "list") return;
  try {
    const store = readStore();
    store[currentPath] = y;
    sessionStorage.setItem(SCROLL_KEY, JSON.stringify(store));
  } catch {}
}

function setupScrollMemory() {
  if (scrollMemoryBound) return;
  scrollMemoryBound = true;

  // 이동이 시작되는 순간이 사용자가 보던 위치가 남아있는 마지막 시점이다.
  // 두 이벤트 모두에 걸어 어느 쪽이 먼저 와도 값을 놓치지 않는다.
  const beginNavigation = () => {
    if (!navigating) saveScroll(stableY);
    navigating = true;
  };

  addEventListener("pagehide", () => saveScroll(stableY));
  document.addEventListener("astro:before-preparation", beginNavigation);
  document.addEventListener("astro:before-swap", beginNavigation);

  document.addEventListener("astro:page-load", () => {
    lastPageKind = pageKind;
    pageKind = document.body.dataset.page ?? "";
    currentPath = normalize(location.pathname);

    // 글에서 "뒤로"를 눌렀을 때 돌아갈 곳.
    // 목록 성격의 화면에서만 갱신하고, 좁혀둔 필터까지 같이 기억한다.
    if (pageKind === "list") {
      try {
        sessionStorage.setItem("backUrl", location.pathname + location.search);
      } catch {}
    }

    // 글을 읽고 목록으로 돌아온 경우에만 보던 자리로 되돌린다.
    // 헤더를 눌러 새로 들어왔다면 맨 위에서 시작하는 편이 맞다.
    const saved =
      lastPageKind === "post" && pageKind === "list"
        ? (readStore()[currentPath] ?? 0)
        : 0;
    window.scrollTo({ left: 0, top: saved, behavior: "instant" });
    stableY = saved;
    navigating = false;
    lastScrollY = saved;
  });
}

// view-transition-name 이 한 페이지에 중복되면 브라우저가 전환을 통째로 취소한다.
// 조용히 깨지는 종류라 개발 중에만 콘솔로 알린다.
function warnDuplicateTransitionNames() {
  if (!import.meta.env.DEV) return;

  const seen = new Map<string, number>();
  for (const el of document.querySelectorAll<HTMLElement>("*")) {
    const name = getComputedStyle(el).viewTransitionName;
    if (!name || name === "none") continue;
    seen.set(name, (seen.get(name) ?? 0) + 1);
  }

  const duplicated = [...seen].filter(([, count]) => count > 1);
  if (duplicated.length > 0) {
    // eslint-disable-next-line no-console -- 개발 중에만 실행된다
    console.warn(
      "[view-transition] 이름이 중복되어 화면 전환이 취소됩니다:",
      Object.fromEntries(duplicated)
    );
  }
}

function start() {
  pageKind = document.body.dataset.page ?? pageKind;
  header = document.querySelector<HTMLElement>("header");
  setupScrollMemory();
  innerScrollbars();
  setupGlassCursor();
  applyCursor();
  warnDuplicateTransitionNames();
  return scrollOverlay();
}

let onScroll = start();

// 한 스크롤 이벤트에서 읽기와 쓰기를 번갈아 하면 그때마다 레이아웃이 다시
// 계산된다. 그리는 일은 한 프레임에 한 번으로 모은다.
let scrollFrame = 0;

addEventListener(
  "scroll",
  () => {
    // 위치만 들고 있는다. 저장은 페이지를 떠날 때 한 번만 한다.
    if (!navigating) stableY = window.scrollY;

    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      onScroll();
      autoHideHeader();
    });
  },
  { passive: true }
);

addEventListener("resize", () => onScroll());
document.addEventListener("astro:page-load", () => {
  onScroll = start();
});
new ResizeObserver(() => onScroll()).observe(document.documentElement);
