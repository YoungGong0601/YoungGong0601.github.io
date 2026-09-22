// 오버레이 스크롤바, 목록 스크롤 위치 기억, 좁은 창 안내.
// ClientRouter 가 body 를 교체하므로 페이지 전환마다 요소를 다시 붙인다.

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
function scrollOverlay() {
  const bar = ensure("scroll-overlay");

  const update = () => {
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
  };

  update();
  return update;
}

// ── 좁은 창 안내 ──────────────
// 마우스를 쓰는 환경인데 창이 좁으면 양옆 레일이 숨겨진다.
// 창을 넓히면 더 보인다는 것을 한 번만 알려준다.
const HINT_KEY = "wideHintShown";
let hintDone = false;

function wideWindowHint() {
  if (hintDone) return;

  // 터치 기기(스마트폰, 태블릿)는 창 크기를 바꿀 수 없으니 제외한다
  if (!window.matchMedia("(pointer: fine)").matches) return;
  // 이미 레일이 보이는 폭이면 알릴 것이 없다
  if (window.innerWidth >= 1280) return;

  try {
    if (localStorage.getItem(HINT_KEY)) {
      hintDone = true;
      return;
    }
  } catch {
    return;
  }

  hintDone = true;
  try {
    localStorage.setItem(HINT_KEY, "1");
  } catch {}

  const toast = ensure("wide-hint");
  toast.setAttribute("role", "status");
  toast.innerHTML =
    '<span>창을 넓히면 양옆에 시리즈와 태그가 함께 보입니다.</span>' +
    '<button type="button" aria-label="닫기">닫기</button>';

  const hide = () => {
    toast.dataset.visible = "false";
    setTimeout(() => toast.remove(), 300);
  };

  toast.querySelector("button")?.addEventListener("click", hide);
  requestAnimationFrame(() => (toast.dataset.visible = "true"));
  setTimeout(hide, 9000);
}

// ── 유리 커서 ──────────────
// 기본 포인터를 숨기고 유리 원으로 대신한다. 푸터 토글로 켜고 끈다.
const CURSOR_KEY = "glassCursor";

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

  const dot = document.getElementById("cursor-glass");
  if (!on) {
    dot?.remove();
  } else if (!dot) {
    ensure("cursor-glass").setAttribute("aria-hidden", "true");
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

  // body 가 교체돼도 document 는 남으므로 리스너는 한 번만 붙인다
  document.addEventListener("pointermove", event => {
    const dot = document.getElementById("cursor-glass");
    if (!dot) return;
    dot.style.setProperty("--x", `${event.clientX}px`);
    dot.style.setProperty("--y", `${event.clientY}px`);
    dot.dataset.visible = "true";
    dot.dataset.over = (event.target as Element | null)?.closest?.(
      "a[href], button, summary, input, [role='button']"
    )
      ? "target"
      : "";
  });

  document.addEventListener("pointerleave", () => {
    const dot = document.getElementById("cursor-glass");
    if (dot) dot.dataset.visible = "false";
  });

  document.addEventListener("click", event => {
    if (!(event.target as Element | null)?.closest?.("#cursor-toggle")) return;
    try {
      localStorage.setItem(CURSOR_KEY, cursorOn() ? "0" : "1");
    } catch {}
    applyCursor();
  });
}

// ── 스크롤 위치 기억 ──────────────
// 목록 성격의 페이지는 떠날 때 위치를 저장하고 돌아오면 그 자리로 복원한다.
// 글 페이지는 항상 맨 위에서 시작한다.
const SCROLL_KEY = "scrollByPath";

// 리스너는 한 번만 붙인다 (이 파일은 모듈이라 한 번만 평가된다)
let scrollMemoryBound = false;

// ClientRouter 는 swap 전에 URL 을 이미 바꾼다. 진입 시점 경로를 따로 들고 있는다.
let currentPath = normalize(location.pathname);

// 스크롤이 멈춘 뒤 한 번 더 저장하기 위한 타이머
let saveTimer: ReturnType<typeof setTimeout> | undefined;

// ClientRouter 는 이동 이벤트보다 먼저 스크롤을 0 으로 되돌린다.
// 그래서 이동 시점의 window.scrollY 는 쓸 수 없고, 마지막 정상 위치를 따로 둔다.
let stableY = 0;

// 링크를 누른 뒤에는 stableY 를 갱신하지 않는다. 그 사이 들어오는 0 을 막는다.
let stableLocked = false;
let unlockTimer: ReturnType<typeof setTimeout> | undefined;

// 이동이 시작되면 ClientRouter 가 맨 위로 올리는데, 그 0 을 저장하면 안 된다
let navigating = false;

// /posts 와 /posts/ 를 같은 키로 본다
function normalize(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/";
}

function isListPage(pathname: string) {
  const path = normalize(pathname) === "/" ? "" : normalize(pathname);
  return (
    path === "" ||
    path === "/posts" ||
    /^\/posts\/\d+$/.test(path) ||
    path.startsWith("/tags") ||
    path === "/archives"
  );
}

function readStore(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem(SCROLL_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveScroll(y = window.scrollY) {
  if (!isListPage(currentPath)) return;
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
    clearTimeout(saveTimer);
  };

  // 링크를 누른 시점은 스크롤이 아직 그대로다. 이때 위치를 확보하고 잠근다.
  document.addEventListener(
    "click",
    event => {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!link) return;

      stableY = window.scrollY;
      stableLocked = true;
      clearTimeout(saveTimer);

      // 이동이 실제로 일어나지 않으면 잠금을 풀어 저장을 다시 허용한다
      clearTimeout(unlockTimer);
      unlockTimer = setTimeout(() => (stableLocked = false), 600);
    },
    true
  );

  document.addEventListener("astro:before-preparation", beginNavigation);
  document.addEventListener("astro:before-swap", beginNavigation);

  document.addEventListener("astro:page-load", () => {
    currentPath = normalize(location.pathname);
    const saved = isListPage(currentPath) ? readStore()[currentPath] : 0;
    window.scrollTo({ left: 0, top: saved ?? 0, behavior: "instant" });
    stableY = saved ?? 0;
    stableLocked = false;
    navigating = false;
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
    console.warn(
      "[view-transition] 이름이 중복되어 화면 전환이 취소됩니다:",
      Object.fromEntries(duplicated)
    );
  }
}

function start() {
  setupScrollMemory();
  setupGlassCursor();
  applyCursor();
  warnDuplicateTransitionNames();
  wideWindowHint();
  const overlay = scrollOverlay();
  return overlay;
}

let onScroll = start();

addEventListener(
  "scroll",
  () => {
    onScroll();
    if (navigating || stableLocked) return;
    stableY = window.scrollY;
    // 스크롤이 멈춘 뒤에 저장한다. 스로틀만 쓰면 마지막 위치가 빠진다.
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveScroll(stableY), 120);
  },
  { passive: true }
);
addEventListener("resize", () => {
  onScroll();
  wideWindowHint();
});
document.addEventListener("astro:page-load", () => {
  onScroll = start();
});
new ResizeObserver(() => onScroll()).observe(document.documentElement);
