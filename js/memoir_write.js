const API_SERVER_DOMAIN = 'http://3.38.119.114:8080';
const accessToken = getCookie('accessToken');

// 쿠키 설정 함수
function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + value + expires + '; path=/';
}

// 쿠키 가져오기 함수
function getCookie(name) {
    const nameEQ = name + '=';
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

document.addEventListener('DOMContentLoaded', () => {
    const todayDateTitle = document.getElementById('today-date-title');
    const lockIcon = document.getElementById('lock-icon');
    const unlockIcon = document.getElementById('unlock-icon');
    const lockButton = document.getElementById('lock-button');
    const unlockButton = document.getElementById('unlock-button');
    const cancelButton = document.getElementById('memoir-write-cancel');
    const confirmButton = document.getElementById('memoir-write-confirm');
    const textarea = document.querySelector('.memoir-write-input');

    // Set today's date
    const todayDate = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    todayDateTitle.textContent = `${todayDate} 회고`;

    // Toggle icons and status
    let isLocked = true; // Default to locked state

    function updateIcons() {
        if (isLocked) {
            lockIcon.style.display = 'block';
            unlockIcon.style.display = 'none';
        } else {
            lockIcon.style.display = 'none';
            unlockIcon.style.display = 'block';
        }
    }

    lockButton.addEventListener('click', () => {
        isLocked = true;
        updateIcons();
    });

    unlockButton.addEventListener('click', () => {
        isLocked = false;
        updateIcons();
    });

    // Handle save button click
    confirmButton.addEventListener('click', async () => {
        const content = textarea.value;
        const status = isLocked ? '비공개' : '공개';

        const data = {
            userId: 0, // Replace with actual userId
            memory: content,
            status: status,
        };

        try {
            const response = await fetch(`${API_SERVER_DOMAIN}/joyMemoir`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`, // Include access token in the headers
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            alert('회고록이 저장되었습니다!');
            textarea.value = ''; // Clear the textarea
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    });

    // Handle cancel button click
    cancelButton.addEventListener('click', () => {
        textarea.value = ''; // Clear the textarea
    });

    // Initial icon setup
    updateIcons();
});
