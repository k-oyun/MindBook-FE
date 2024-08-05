document.addEventListener("DOMContentLoaded", function () {
    const emailSubmitBtn = document.querySelector(".email-submit-btn");
    const emailInput = document.querySelector(".find-password-input");
    const sendEmailPopup = document.querySelector(".send-email");
    const errorMessagePopup = document.querySelector(
        ".find-password-error-message"
    );
    const errorMessageButton = document.querySelector(
        "#failed-find-email-button"
    );

    emailSubmitBtn.addEventListener("click", function () {
        const email = emailInput.value;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 형식 검증 패턴

        if (emailPattern.test(email)) {
            // 이메일 형식이 맞다면 서버로 요청을 보내야 하지만, 여기서는 간단히 예제만 구현
            const emailExists = true; // 서버에서 이메일 존재 여부를 확인해야 함

            if (emailExists) {
                sendEmailPopup.style.display = "flex"; // 이메일 전송 성공 팝업 표시
                errorMessagePopup.style.display = "none"; // 오류 메시지 팝업 숨김
            } else {
                sendEmailPopup.style.display = "none"; // 이메일 전송 성공 팝업 숨김
                errorMessagePopup.style.display = "flex"; // 오류 메시지 팝업 표시
            }
        } else {
            sendEmailPopup.style.display = "none"; // 이메일 전송 성공 팝업 숨김
            errorMessagePopup.style.display = "flex"; // 오류 메시지 팝업 표시
        }
    });

    errorMessageButton.addEventListener("click", function () {
        errorMessagePopup.style.display = "none"; // 오류 메시지 팝업 숨김
    });
});
