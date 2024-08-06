var API_SERVER_DOMAIN = 'http://3.38.119.114:8080';

document.addEventListener('DOMContentLoaded', function () {
    const passwordInput = document.querySelector('.withdrawal-pw-input');
    const passwordConfirmInput = document.querySelector('.double-check-wd-pw');
    const confirmBtn = document.getElementById('wd-confirm-btn');
    const cancelBtn = document.getElementById('wd-cancle-btn');
    const errorMsg = document.querySelector('.withdrawal-err');
    const modal = document.getElementById('dc-wd-change-modal');
    const cancelModalBtn = document.getElementById('dc-wd-cancle-button');
    const dcConfirmBtn = document.getElementById('dc-wd-confirm-button');

    function validatePasswords() {
        const password = passwordInput.value;
        const passwordConfirm = passwordConfirmInput.value;

        // 비밀번호가 일치하지 않으면 빨간색 테두리
        if (password !== passwordConfirm) {
            passwordInput.style.borderColor = 'red';
            passwordConfirmInput.style.borderColor = 'red';
            confirmBtn.disabled = true;
            errorMsg.style.display = 'block';
            return false;
        } else {
            // 비밀번호가 일치하면 원상태로 복구
            passwordInput.style.borderColor = '';
            passwordConfirmInput.style.borderColor = '';
            confirmBtn.disabled = false;
            errorMsg.style.display = 'none';
            return true;
        }
    }

    // 비밀번호 입력값 변경 시 자동으로 검증
    passwordInput.addEventListener('input', validatePasswords);
    passwordConfirmInput.addEventListener('input', validatePasswords);

    // 확인 버튼 클릭 시 모달 표시
    confirmBtn.addEventListener('click', function () {
        if (validatePasswords()) {
            modal.style.display = 'block';
        }
    });

    // 취소 버튼 클릭 시 입력값 초기화 및 상태 리셋
    cancelBtn.addEventListener('click', function () {
        passwordInput.value = '';
        passwordConfirmInput.value = '';
        passwordInput.style.borderColor = '';
        passwordConfirmInput.style.borderColor = '';
        confirmBtn.disabled = false;
        errorMsg.style.display = 'none';
    });

    // 탈퇴 취소 버튼 클릭 시 모달 숨기기
    cancelModalBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // 탈퇴 확인 버튼 클릭 시 서버 요청
    dcConfirmBtn.addEventListener('click', function () {
        fetch(`${API_SERVER_DOMAIN}/user/withdraw`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`, // 인증 토큰 추가
            },
            body: JSON.stringify({ password: passwordInput.value }), // 비밀번호를 JSON 형식으로 서버에 전송
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    window.location.href = 'login.html'; // 탈퇴 성공 시 로그인 페이지로 이동
                } else {
                    alert('탈퇴 요청 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
                }
            })
            .catch((error) => {
                console.error('Error:', error); // 오류를 콘솔에 기록합니다.
                alert('탈퇴 요청 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
            });
    });
});
