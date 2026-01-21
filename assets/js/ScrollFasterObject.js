document.addEventListener("DOMContentLoaded", (event) => {
    // 1. 플러그인 등록 (필수)
    gsap.registerPlugin(ScrollTrigger);

    // 2. 모든 데코 요소 찾기
    gsap.utils.toArray(".floating-deco").forEach((layer) => {
        // 3. 속도값 가져오기 (기본값 0.2)
        // 숫자가 클수록 많이 움직임 (음수면 반대로 움직임)
        const speed = parseFloat(layer.dataset.speed) || 0.2;

        // 4. 움직일 거리 계산 (예: 200px * 속도)
        // 너무 많이 움직이지 않게 제한을 둡니다.
        const movement = 200 * speed;

        // 5. 애니메이션 설정
        gsap.to(layer, {
            y: movement, // 위아래로 이동
            ease: "none",
            scrollTrigger: {
                trigger: layer, // ⭐ 중요: 전체 페이지가 아니라 '자기 자신'이 기준
                start: "top bottom", // 화면 아래에서 등장할 때 시작
                end: "bottom top", // 화면 위로 사라질 때 끝
                scrub: 0, // 부드러운 동기화
            },
        });
    });
});
