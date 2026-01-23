document.addEventListener("DOMContentLoaded", () => {
    // 1. 모든 이미지 스왑 박스를 찾음
    const boxes = document.querySelectorAll(".change-img-box");

    boxes.forEach((box) => {
        // 2. 그 안에 있는 '바뀔 이미지(img-hover)'를 찾음
        const hoverImg = box.querySelector(".img-hover");

        // 3. 만약 img-hover가 있고, 파일명이 .gif로 끝난다면?
        if (hoverImg && hoverImg.src.toLowerCase().includes(".gif")) {
            // 원래 주소를 백업해둠 (중복 ?t=... 방지)
            const originalSrc = hoverImg.src.split("?")[0];

            // 4. 마우스가 박스에 들어오면 (Hover Start)
            box.addEventListener("mouseenter", () => {
                // 주소 뒤에 현재 시간을 붙여서 브라우저가 "새 이미지다!"라고 착각하게 만듦
                hoverImg.src = originalSrc + "?t=" + Date.now();
            });
        }
    });
});
