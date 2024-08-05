var API_SERVER_DOMAIN = 'http://3.38.119.114:8080';

// document.addEventListener('DOMContentLoaded', function () {
//     const loginBtn = document.querySelector('.login-btn');
//     const userNameInput = document.querySelector('.login-id-input');
//     const userPasswordInput = document.querySelector('.login-pw-input');
//     const failedLoginModal = document.querySelector('#failed-login-modal');
//     const failedLoginButton = document.querySelector('#failed-login-button');

//     // 목데이터: 실제로는 서버에서 받아와야 하는 데이터
//     const mockUserData = {
//         email: 'test@example.com',
//         password: 'password123',
//     };

//     loginBtn.addEventListener('click', function (event) {
//         event.preventDefault(); // 폼 제출 방지

//         const enteredEmail = userNameInput.value;
//         const enteredPassword = userPasswordInput.value;

//         // 입력된 이메일과 비밀번호가 목데이터와 일치하는지 확인
//         const isLoginSuccessful = enteredEmail === mockUserData.email && enteredPassword === mockUserData.password;

//         if (!isLoginSuccessful) {
//             failedLoginModal.style.display = 'block'; // 로그인 실패 시 팝업 표시
//         }
//     });

//     failedLoginButton.addEventListener('click', function () {
//         failedLoginModal.style.display = 'none'; // 팝업 닫기
//     });
// });
async function login() {
    const userName = document.querySelector('input[name="userName"]').value;
    const userPassword = document.querySelector('input[name="userPassword"]').value;

    const response = await fetch(`${API_SERVER_DOMAIN}/user/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: userName,
            password: userPassword,
        }),
    });

    if (response.ok) {
        // 로그인 성공 시
        window.location.href = 'main.html';
    } else {
        // 로그인 실패 시
        document.getElementById('failed-login-modal').style.display = 'block';
    }
}

document.getElementById('failed-login-button').addEventListener('click', function () {
    document.getElementById('failed-login-modal').style.display = 'none';
});

function setCookie(name, value, days) {
    var expires = '';
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + value + expires + '; path=/';
}

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
