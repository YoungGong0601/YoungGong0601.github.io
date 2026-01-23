document.addEventListener("DOMContentLoaded", function () {
    (function () {
        if (!("requestAnimationFrame" in window)) return;
        if (/Mobile|Android/.test(navigator.userAgent)) return;

        var backgrounds = [];
        var parallaxElements = document.querySelectorAll(".parallax");

        // 1. 초기 설정
        parallaxElements.forEach(function (el) {
            var bg = el.querySelector(".parallax-background");
            if (!bg) return;

            // 배경 스타일 설정 (중앙 정렬을 위한 수정)
            Object.assign(bg.style, {
                position: "absolute",
                minWidth: "100%",
                minHeight: "100vh",
                width: "auto",
                height: "auto",

                // ⭐ 핵심 변경 1: 기준점을 화면 중앙으로 이동
                top: "0",
                left: "50%",

                zIndex: "-100",
                display: "block",

                // ⭐ 핵심 변경 2: 비디오 내용물 자체도 중앙에 오도록 설정 (CSS 기능)
                objectFit: "cover",
                objectPosition: "center center",
            });

            backgrounds.push({
                container: el,
                bg: bg,
            });

            Object.assign(el.style, {
                position: "relative",
                background: "transparent",
                overflow: "hidden",
            });
        });

        if (!backgrounds.length) return;

        var visible = [];
        var scheduled = null;

        window.addEventListener("scroll", scroll);
        window.addEventListener("resize", scroll);

        scroll();

        function scroll() {
            visible = [];

            for (var i = 0; i < backgrounds.length; i++) {
                var rect = backgrounds[i].container.getBoundingClientRect();

                if (rect.bottom > 0 && rect.top < window.innerHeight) {
                    visible.push({
                        rect: rect,
                        bg: backgrounds[i].bg,
                        container: backgrounds[i].container,
                    });
                }
            }

            if (scheduled) {
                cancelAnimationFrame(scheduled);
            }

            if (visible.length) {
                scheduled = requestAnimationFrame(update);
            }
        }

        function update() {
            for (var i = 0; i < visible.length; i++) {
                var item = visible[i];
                var rect = item.rect;
                var node = item.bg;

                var shift = "";

                if (item.container.hasAttribute("parallax-center")) {
                    var nodeHeight = node.offsetHeight;
                    shift = -((nodeHeight - rect.height) / 2 + rect.top) + "px";
                } else {
                    shift = -rect.top + "px";
                }

                // ⭐ 핵심 변경 3: X축을 -50%로 당겨서 완벽한 중앙 정렬 완성
                // (left: 50% 보정을 위해 X축 -50% 추가)
                node.style.transform = "translate3d(-50%, " + shift + ", 0)";
            }
            scheduled = null;
        }
    })();
});
