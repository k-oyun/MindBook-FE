document.addEventListener('DOMContentLoaded', function () {
    const textBox = document.getElementById('textBox');
    const textCount = document.querySelector('.textCount');

    textBox.addEventListener('keyup', function () {
        let content = textBox.value;

        // 글자수 세기
        if (content.length === 0 || content === '') {
            textCount.textContent = '0자';
        } else {
            textCount.textContent = content.length + '자';
        }

        // 글자수 제한
        if (content.length > 200) {
            // 200자 부터는 타이핑 되지 않도록
            textBox.value = content.substring(0, 200);
            // 200자 넘으면 알림창 뜨도록
            alert('글자수는 200자까지 입력 가능합니다.');
        }
    });
});
