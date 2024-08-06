var API_SERVER_DOMAIN = 'http://3.38.119.114:8080';
const accessToken = getCookie('accessToken');

// 기존에 제공된 쿠키 설정 함수
function setCookie(name, value, days) {
    var expires = '';
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + value + expires + '; path=/';
}

// 기존에 제공된 쿠키 가져오는 함수
function getCookie(name) {
    var nameEQ = name + '=';
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

document.addEventListener('DOMContentLoaded', function () {
    const emailSubmitBtn = document.querySelector('.email-submit-btn');
    const emailInput = document.querySelector('.find-password-input');
    const sendEmailPopup = document.querySelector('.send-email');
    const errorMessagePopup = document.querySelector('.find-password-error-message');
    const errorMessageButton = document.querySelector('#failed-find-email-button');

    emailSubmitBtn.addEventListener('click', function () {
        const email = emailInput.value;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 형식 검증 패턴

        if (emailPattern.test(email)) {
            fetch(`${API_SERVER_DOMAIN}/user/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`, // 인증 토큰 추가
                },
                body: JSON.stringify({ email: email }), // 이메일을 JSON 형식으로 서버에 전송
            })
                .then((response) => {
                    if (!response.ok) {
                        // 서버가 성공적인 응답을 반환하지 않을 경우 예외를 발생시킵니다.
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json(); // 응답을 JSON으로 파싱합니다.
                })
                .then((data) => {
                    if (data.exists) {
                        // 서버에서 이메일 존재 여부를 확인한 경우
                        sendEmailPopup.style.display = 'flex'; // 이메일 전송 성공 팝업 표시
                        errorMessagePopup.style.display = 'none'; // 오류 메시지 팝업 숨김
                    } else {
                        sendEmailPopup.style.display = 'none'; // 이메일 전송 성공 팝업 숨김
                        errorMessagePopup.style.display = 'flex'; // 오류 메시지 팝업 표시
                    }
                })
                .catch((error) => {
                    console.error('Error:', error); // 오류를 콘솔에 기록합니다.
                    sendEmailPopup.style.display = 'none'; // 이메일 전송 성공 팝업 숨김
                    errorMessagePopup.style.display = 'flex'; // 오류 메시지 팝업 표시
                });
        } else {
            sendEmailPopup.style.display = 'none'; // 이메일 전송 성공 팝업 숨김
            errorMessagePopup.style.display = 'flex'; // 오류 메시지 팝업 표시
        }
    });

    errorMessageButton.addEventListener('click', function () {
        errorMessagePopup.style.display = 'none'; // 오류 메시지 팝업 숨김
    });
});
