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
    const API_SERVER_DOMAIN = 'http://3.38.119.114:8080';
    const postsPerPage = 6;
    let currentPage = 1;
    let allPosts = [];

    const renderPosts = () => {
        const listContainer = document.querySelector('.memoir-my-list-div');
        listContainer.innerHTML = '';

        const start = (currentPage - 1) * postsPerPage;
        const end = Math.min(start + postsPerPage, allPosts.length);

        for (let i = start; i < end; i++) {
            const post = allPosts[i];
            const postDiv = document.createElement('div');
            postDiv.classList.add('memoir-my-list');

            postDiv.innerHTML = `
                <div class="memoir-my-img-div">
                    <div class="memoir-my-img-back"></div>
                    <img id="memoir-my-img" src="/img/angry.png" />
                </div>
                <p class="my-nickname">${post.nickName}</p>
                <button id="my-memoir-detail-write" type="button">
                    <p id="my-memoir-name">${post.createdAt}</p>
                </button>
                <img id="memoir-my-situation" src="/img/write_lock.png" style="${
                    post.status === '공개' ? 'display: none;' : ''
                }" />
                <div id="memoir-my-open-comment" style="${post.status === '비공개' ? 'display: none;' : ''}">
                    <img src="/img/댓글.png" />
                    <span id="my-memoir-comment">39</span>
                </div>
            `;

            listContainer.appendChild(postDiv);
        }
        updatePagination();
    };

    const updatePagination = () => {
        const paginationButtons = document.querySelector('.my-comment-button');
        paginationButtons.innerHTML = '';

        const totalPages = Math.ceil(allPosts.length / postsPerPage);
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.classList.add('my-comment-button-number');
            button.textContent = i;
            button.type = 'button';
            button.addEventListener('click', () => {
                currentPage = i;
                renderPosts();
            });
            paginationButtons.appendChild(button);
        }

        // Set current page button active
        const pageButtons = document.querySelectorAll('.my-comment-button-number');
        pageButtons.forEach((btn) => {
            btn.classList.toggle('active', parseInt(btn.textContent) === currentPage);
        });
    };

    document.querySelector('#my-comment-button-left').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPosts();
        }
    });

    document.querySelector('#my-comment-button-right').addEventListener('click', () => {
        if (currentPage < Math.ceil(allPosts.length / postsPerPage)) {
            currentPage++;
            renderPosts();
        }
    });

    const fetchPosts = async () => {
        try {
            const response = await fetch(`${API_SERVER_DOMAIN}/joyMemoir/all`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            // 역순 정렬
            allPosts = data.sort((a, b) => b.joyMemoirId - a.joyMemoirId);

            // 페이지 초기화
            currentPage = 1;
            renderPosts();
        } catch (error) {
            console.error('Error fetching posts:', error);
            alert('게시물 데이터를 불러오는 데 오류가 발생했습니다.');
        }
    };

    fetchPosts(); // Initial fetch
});
