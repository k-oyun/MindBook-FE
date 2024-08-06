// 쿠키 삭제 함수 추가
function deleteCookie(name) {
    document.cookie =
        name + "=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;";
}
// 로그아웃 버튼 이벤트 핸들러 추가
document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.querySelector(".logout-button");

    logoutButton.addEventListener("click", () => {
        // 쿠키 삭제
        deleteCookie("userToken");

        // 로그아웃 확인 메시지 표시 (옵션)
        console.log("로그아웃 되었습니다.");

        // 로그인 페이지로 이동
        window.location.href = "/html/login.html";
    });
});
