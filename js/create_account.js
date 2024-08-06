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
    const emailInput = document.querySelector('.create-account-id-input');
    const emailSubmitBtn = document.querySelector('.email-submit-btn');
    const errorCreateId = document.querySelector('.error-create-id');
    const emailAuthorizeInput = document.querySelector('.create-account-authorize-input');
    const emailAuthorizeBtn = document.querySelector('.email-authorize-btn');
    const authorizeMsgBtn = document.querySelector('.authorize-msg');

    const nicknameInput = document.querySelector('.create-account-nickname-input');
    const passwordInput = document.querySelector('.create-account-pw-input');
    const passwordConfirmInput = document.querySelector('.double-check-pw-input');
    const errorCreatePw = document.querySelector('.error-create-pw');

    const createAccountBtn = document.querySelector('.open-create-account-modal');
    const createAccountModal = document.getElementById('create-account-modal');
    const createAccountButton = document.getElementById('create-account-button');

    // 이메일 중복 확인 버튼 클릭 시
    emailSubmitBtn.addEventListener('click', function () {
        const email = emailInput.value.trim(); // 이메일 값 트림

        // 이메일 형식 검증
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            console.log('올바른 이메일 형식을 입력하세요.'); // 콘솔에 로그 남기기
            errorCreateId.textContent = '올바른 이메일 형식을 입력하세요.';
            errorCreateId.style.display = 'block';
            errorCreateId.style.marginTop = '10px';
            errorCreateId.style.marginBottom = '10px';
            createAccountBtn.disabled = true; // 회원가입 버튼 비활성화
            return;
        }

        // 이메일 중복 확인 요청
        fetch(`${API_SERVER_DOMAIN}/user/emailCheck?email=${encodeURIComponent(email)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (response.ok) {
                    // 응답 본문이 있는지 확인
                    return response.text().then((text) => {
                        // 본문이 비어 있지 않으면 JSON으로 파싱
                        return text ? JSON.parse(text) : {};
                    });
                } else {
                    throw new Error(`Unexpected response status: ${response.status}`);
                }
            })
            .then((data) => {
                // 이메일 중복 확인 성공
                emailAuthorizeInput.style.display = 'block';
                emailAuthorizeBtn.style.display = 'block';
                authorizeMsgBtn.style.display = 'block';
                errorCreateId.style.display = 'none';
                createAccountBtn.disabled = true;

                // 인증번호 유효 시간 관리
                clearTimeout(authorizationTimeout);
                authorizationTimeout = setTimeout(() => {
                    errorCreateId.textContent = '인증번호의 유효 시간이 만료되었습니다.';
                    errorCreateId.style.display = 'block';
                    errorCreateId.style.marginTop = '10px';
                    errorCreateId.style.marginBottom = '10px';
                    createAccountBtn.disabled = true;
                }, 5 * 60 * 1000); // 5분
            })
            .catch((error) => {
                console.log('Error:', error.message); // 서버 오류를 콘솔에 로그로 남김
                errorCreateId.textContent = '이메일 확인 중 오류가 발생했습니다.';
                errorCreateId.style.display = 'block';
                errorCreateId.style.marginTop = '10px';
                errorCreateId.style.marginBottom = '10px';
                createAccountBtn.disabled = true; // 회원가입 버튼 비활성화
            });
    });

    // 인증번호 확인 버튼 클릭 시
    emailAuthorizeBtn.addEventListener('click', function () {
        const email = emailInput.value.trim();
        const verificationCodeInput = emailAuthorizeInput.value.trim();

        // 인증번호 확인 요청
        fetch(`${API_SERVER_DOMAIN}/user/verification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                verification: verificationCodeInput,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    console.log('인증번호 확인 성공');
                    clearTimeout(authorizationTimeout); // 타이머 종료
                    errorCreateId.style.display = 'none';
                    createAccountBtn.disabled = false; // 회원가입 버튼 활성화
                } else if (response.status === 202) {
                    console.log('인증번호 확인 실패');
                    errorCreateId.textContent = '인증번호가 일치하지 않거나 이미 등록된 아이디입니다.';
                    errorCreateId.style.display = 'block';
                    errorCreateId.style.marginTop = '10px';
                    errorCreateId.style.marginBottom = '10px';
                    createAccountBtn.disabled = true; // 회원가입 버튼 비활성화
                } else {
                    throw new Error(`Unexpected response status: ${response.status}`);
                }
            })
            .catch((error) => {
                console.log('Error:', error.message); // 서버 오류를 콘솔에 로그로 남김
                errorCreateId.textContent = '인증번호 확인 중 오류가 발생했습니다.';
                errorCreateId.style.display = 'block';
                errorCreateId.style.marginTop = '10px';
                errorCreateId.style.marginBottom = '10px';
                createAccountBtn.disabled = true; // 회원가입 버튼 비활성화
            });
    });

    // 인증번호 재발송 버튼 클릭 시
    authorizeMsgBtn.addEventListener('click', function () {
        const email = emailInput.value.trim();

        // 인증번호 재발송 요청
        fetch(`${API_SERVER_DOMAIN}/user/emailCheck?email=${encodeURIComponent(email)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (response.ok) {
                    console.log('인증번호 재발송 성공');
                    errorCreateId.style.display = 'none';
                    // 인증번호 유효 시간 초기화
                    clearTimeout(authorizationTimeout);
                    authorizationTimeout = setTimeout(() => {
                        errorCreateId.textContent = '인증번호의 유효 시간이 만료되었습니다.';
                        errorCreateId.style.display = 'block';
                        errorCreateId.style.marginTop = '10px';
                        errorCreateId.style.marginBottom = '10px';
                        createAccountBtn.disabled = true; // 회원가입 버튼 비활성화
                    }, 5 * 60 * 1000); // 5분
                } else {
                    throw new Error(`Unexpected response status: ${response.status}`);
                }
            })
            .catch((error) => {
                console.log('Error:', error.message); // 서버 오류를 콘솔에 로그로 남김
                errorCreateId.textContent = '인증번호 재발송 중 오류가 발생했습니다.';
                errorCreateId.style.display = 'block';
                errorCreateId.style.marginTop = '10px';
                errorCreateId.style.marginBottom = '10px';
                createAccountBtn.disabled = true; // 회원가입 버튼 비활성화
            });
    });
    // 비밀번호 검증
    function validatePasswords() {
        const password = passwordInput.value;
        const passwordConfirm = passwordConfirmInput.value;

        // 비밀번호 검증
        const passwordPattern = /^(?!.*[\u3131-\uD79D])(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordPattern.test(password)) {
            errorCreatePw.textContent = '비밀번호는 한글 제외 8자 이상이어야 합니다.';
            errorCreatePw.style.display = 'block';
            return false;
        }

        // 비밀번호 확인
        if (password !== passwordConfirm) {
            errorCreatePw.textContent = '비밀번호가 일치하지 않습니다.';
            errorCreatePw.style.display = 'block';
            return false;
        }

        errorCreatePw.style.display = 'none';
        return true;
    }

    // 비밀번호 입력값 변경 시 자동 검증
    passwordInput.addEventListener('input', validatePasswords);
    passwordConfirmInput.addEventListener('input', validatePasswords);

    // 회원가입 버튼 클릭 시 모달 표시
    createAccountBtn.addEventListener('click', function () {
        if (validatePasswords()) {
            createAccountModal.style.display = 'block';
        }
    });

    // 회원가입 완료 버튼 클릭 시 서버 요청
    createAccountButton.addEventListener('click', function () {
        const email = emailInput.value;
        const nickname = nicknameInput.value;
        const password = passwordInput.value;

        // 비밀번호 검증
        if (!validatePasswords()) {
            return;
        }

        fetch(`${API_SERVER_DOMAIN}/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                nickName: nickname,
                password: password,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    // 회원가입 성공 시 로그인 페이지로 이동
                    createAccountModal.style.display = 'none';
                    alert('회원가입이 완료되었습니다!');
                    window.location.href = 'login.html';
                } else {
                    alert('회원가입 요청 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('회원가입 요청 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
            });
    });
});
