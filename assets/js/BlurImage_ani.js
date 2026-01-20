// 문서가 로드되면 실행
document.addEventListener("DOMContentLoaded", (event) => {
    // GSAP에게 ScrollTrigger 플러그인을 사용하겠다고 알림
    gsap.registerPlugin(ScrollTrigger);

    // 애니메이션 정의
    gsap.to(".scroll-blur-img", {
        // 대상 클래스
        filter: "blur(0px)", // 최종 상태: 블러를 0으로 만듦
        ease: "none", // 선형적인 움직임 (필수)
        scrollTrigger: {
            trigger: ".scroll-blur-img", // 무엇을 기준으로 트리거를 발동시킬지
            start: "top bottom", // 시작점: 이미지의 맨 위(top)가 화면의 맨 아래(bottom)에 닿을 때
            end: "bottom bottom", // 종료점: 이미지의 중앙(center)이 화면의 중앙(center)에 올 때. "top 80%"이라는 코드도 존재함.
            scrub: true, // 핵심 ⭐: 스크롤바 움직임에 애니메이션을 동기화시킴 (되감기 가능)
            // markers: true // (테스트용) 시작/끝 점을 화면에 표시하고 싶으면 주석 해제
        },
    });
});
