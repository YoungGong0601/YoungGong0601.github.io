document.addEventListener("DOMContentLoaded", function () {
    var navbar = document.getElementById("mainNav");

    window.addEventListener("scroll", function () {
        // 스크롤이 N px 이상 내려갔는지 확인
        if (window.scrollY > 500) {
            navbar.classList.add("navbar-scrolled"); // 클래스 추가 (색 변함)
        } else {
            navbar.classList.remove("navbar-scrolled"); // 클래스 제거 (투명 복귀)
        }
    });
});
