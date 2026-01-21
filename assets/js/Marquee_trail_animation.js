document.addEventListener("DOMContentLoaded", (event) => {
    const track = document.querySelector(".marquee-track");
    const container = document.querySelector(".marquee-container");

    // ==========================================
    // [설정 1] 이미지 파일명 리스트
    // ==========================================
    const folderPath = "assets/img/활동사진/"; // 경로 확인
    const imageFiles = [
        "1000049507.jpg",
        "1000049583.jpg",
        "1000049591.jpg",
        "1000049596.jpg",
        "1000049608.jpg",
        "1000049877.jpg",
        "1000049878.jpg",
        "1000050126.jpg",
        "1000052199.jpg",
        "1000052200.jpg",
        "1000052476.jpg",
        "1000052504.jpg",
    ];

    // 1. HTML 자동 생성
    imageFiles.forEach((filename) => {
        const img = document.createElement("img");
        img.src = folderPath + filename;
        img.className = "game-img";
        img.alt = filename;
        track.appendChild(img);
    });

    // // (1) 팝업창 생성
    // const overlay = document.createElement("div");
    // overlay.id = "image-zoom-overlay";
    // overlay.innerHTML = '<img src="" alt="Zoomed Image">';
    // document.body.appendChild(overlay);
    // const zoomImgTag = overlay.querySelector("img");

    // overlay.addEventListener("click", () => (overlay.style.display = "none"));

    // (2) 이미지 복제
    const generatedImages = track.querySelectorAll(".game-img");
    generatedImages.forEach((item) => {
        let clone = item.cloneNode(true);
        track.appendChild(clone);
    });

    // // (3) 클릭 시 확대 기능
    // track.addEventListener("click", (e) => {
    //     if (e.target.tagName === "IMG") {
    //         zoomImgTag.src = e.target.src;
    //         overlay.style.display = "flex";
    //     }
    // });

    // (4) GSAP 애니메이션
    let marqueeAni = gsap.to(".marquee-track", {
        xPercent: -50,
        repeat: -1,
        duration: 70,
        ease: "none",
        paused: true,
    });

    // === 물리 엔진 & 상태 변수 ===
    let scrollVelocity = 0;
    const friction = 0.92;
    const baseSpeed = 0.03;
    const sensitivity = 0.002;

    // ⭐ 핵심 변수: 오직 클릭했을 때만 True가 됨
    let isActive = false;

    gsap.ticker.add(() => {
        scrollVelocity *= friction;
        if (Math.abs(scrollVelocity) < 0.0001) scrollVelocity = 0;

        // ⭐ 로직 변경:
        // isActive(클릭됨) 상태이거나 팝업이 떴을 때만 -> 자동재생 멈춤 (속도 0)
        // 그냥 호버링만 했을 때는 -> 멈추지 않음 (baseSpeed 유지)
        let currentSpeed =
            isActive /* || overlay.style.display === "flex" */ ? 0 : baseSpeed;

        let moveAmount = currentSpeed + scrollVelocity;
        marqueeAni.totalTime(marqueeAni.totalTime() + moveAmount);
    });

    // 1. 휠 이벤트 (isActive 일 때만 작동)
    container.addEventListener(
        "wheel",
        (e) => {
            if (!isActive) return; // 클릭 안 했으면 휠 무시
            e.preventDefault();
            scrollVelocity += e.deltaY * sensitivity;
        },
        { passive: false },
    );

    // 2. 클릭(MouseDown) 시 활성화 (멈춤 + 휠 가능)
    container.addEventListener("mousedown", () => {
        isActive = !isActive;
    });

    // 3. 마우스가 밖으로 나가면 비활성화 (다시 재생 + 휠 잠금)
    container.addEventListener("mouseleave", () => {
        isActive = false;
    });
});
