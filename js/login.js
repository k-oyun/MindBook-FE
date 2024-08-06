var API_SERVER_DOMAIN = "http://3.38.119.114:8080";

document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.querySelector(".login-btn");
    const userNameInput = document.querySelector(".login-id-input");
    const userPasswordInput = document.querySelector(".login-pw-input");
    const failedLoginModal = document.querySelector("#failed-login-modal");
    const failedLoginButton = document.querySelector("#failed-login-button");

    // 쿠키 설정 함수
    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    // 쿠키 가져오기 함수
    function getCookie(name) {
        var nameEQ = name + "=";
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            while (cookie.charAt(0) === " ") {
                cookie = cookie.substring(1, cookie.length);
            }
            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length, cookie.length);
            }
        }
        return null;
    }

    loginBtn.addEventListener("click", async function (event) {
        event.preventDefault(); // 폼 제출 방지

        const enteredEmail = userNameInput.value;
        const enteredPassword = userPasswordInput.value;

        // 서버로 로그인 요청 보내기
        const response = await fetch(`${API_SERVER_DOMAIN}/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: enteredEmail,
                password: enteredPassword,
            }),
        });

        if (response.ok) {
            // 로그인 성공 시 쿠키 설정
            const responseData = await response.json();
            setCookie("userToken", responseData.accessToken, 7);
            window.location.href = "main.html";
        } else {
            // 로그인 실패 시
            failedLoginModal.style.display = "block"; // 로그인 실패 시 팝업 표시
        }
    });

    failedLoginButton.addEventListener("click", function () {
        failedLoginModal.style.display = "none"; // 팝업 닫기
    });
});
