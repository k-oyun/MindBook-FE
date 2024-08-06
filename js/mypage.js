const BASE_URL = "http://3.38.119.114:8080";

document.addEventListener("DOMContentLoaded", function () {
    const accessToken = getCookie("userToken");

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

    const createdAtGet = async () => {
        const url = `${BASE_URL}/user/createdAt`;

        const headers = {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json;charset=UTF-8",
        };

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: headers,
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            console.log(data);

            document.getElementById("account-msg").innerText = data.message;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    createdAtGet();

    // 비밀번호 변경 로직
    const confirmBtn = document.getElementById("confirm-btn");
    const nowPwInput = document.querySelector(".now-pw-input");
    const newPwInput = document.querySelector(".change-pw-input");
    const doubleCheckPwInput = document.querySelector(".double-check-ch-pw");
    const changePwModal = document.getElementById("change-pw-modal");
    const changePwErr = document.querySelector(".change-pw-err");
    const nowPwErr = document.querySelector(".now-pw-err");

    confirmBtn.addEventListener("click", async function () {
        const currentPassword = nowPwInput.value;
        const newPassword = newPwInput.value;
        const doubleCheckPassword = doubleCheckPwInput.value;

        if (newPassword !== doubleCheckPassword) {
            changePwErr.style.display = "block";
            return;
        }

        const url = `${BASE_URL}/user/update`;
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json;charset=UTF-8",
        };

        const body = JSON.stringify({
            password: currentPassword,
            newPassword: newPassword,
        });

        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: headers,
                body: body,
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.error === "현재 비밀번호가 일치하지 않습니다.") {
                    nowPwErr.style.display = "block";
                } else {
                    changePwErr.style.display = "block";
                }
                return;
            }

            changePwModal.style.display = "block"; // 성공 시 팝업 표시
        } catch (error) {
            console.error("Error updating password:", error);
            changePwErr.style.display = "block"; // 네트워크 오류 시 에러 표시
        }
    });

    document
        .getElementById("change-pw-button")
        .addEventListener("click", function () {
            changePwModal.style.display = "none"; // 팝업 닫기
        });
});
