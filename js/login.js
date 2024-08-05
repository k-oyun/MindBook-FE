document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.querySelector(".login-btn");
    const userNameInput = document.querySelector(".login-id-input");
    const userPasswordInput = document.querySelector(".login-pw-input");
    const failedLoginModal = document.querySelector("#failed-login-modal");
    const failedLoginButton = document.querySelector("#failed-login-button");

    // 목데이터: 실제로는 서버에서 받아와야 하는 데이터
    const mockUserData = {
        email: "test@example.com",
        password: "password123",
    };

    loginBtn.addEventListener("click", function (event) {
        event.preventDefault(); // 폼 제출 방지

        const enteredEmail = userNameInput.value;
        const enteredPassword = userPasswordInput.value;

        // 입력된 이메일과 비밀번호가 목데이터와 일치하는지 확인
        const isLoginSuccessful =
            enteredEmail === mockUserData.email &&
            enteredPassword === mockUserData.password;

        if (!isLoginSuccessful) {
            failedLoginModal.style.display = "block"; // 로그인 실패 시 팝업 표시
        }
    });

    failedLoginButton.addEventListener("click", function () {
        failedLoginModal.style.display = "none"; // 팝업 닫기
    });
});
