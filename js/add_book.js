document.addEventListener("DOMContentLoaded", function () {
    let bookName = "";
    let refinedData = {};
    let refinedSelectedBookData = {};
    document
        .querySelector(".search-book")
        .addEventListener("input", function () {
            bookName = document.querySelector(".search-book").value;
        });

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

    //=====================================================

    const BASE_URL = "http://3.38.119.114:8080";

    const bookGet = async () => {
        const url = `http://3.38.119.114:8080/searchBook?keyword=${bookName}`;

        const headers = {
            "X-Naver-Client-Id": "bryNjD_LmXdpMZXtxUlg",
            "X-Naver-Client-Secret": "M7YMKHpThW",
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
            document.querySelector(".hidden-container").style.display = "flex";

            //============필요 데이터만 정제===============
            refinedData = data.map((item) => ({
                title: item.title,
                author: item.author,
                publisher: item.publisher,
                pubdate: item.pubdate,
                description: item.description,
                image: item.image,
            }));
            const hiddenContainer = document.querySelector(".hidden-container");

            refinedData.forEach((book) => {
                const bookDiv = document.createElement("div");
                bookDiv.className = "search-results";

                const pubdateFormatted = book.pubdate;

                bookDiv.innerHTML = `
        <div class='book'>
          <img class="book-img" src="${book.image}" />
          <div class="book-info">
            <p class="book-title">${book.title}</p>
            <p class="author">${book.author}</p>
            <p class="publisher">${book.publisher}</p>
            <p class="published-date">${pubdateFormatted}</p>
          </div>
         
            <button class="add-book-btn" data-id="${book.title}">추가</button>
          
        </div>
      `;

                hiddenContainer.appendChild(bookDiv);

                //======================================================
                document.querySelector(".book-name").innerText = bookName;
                document.querySelector(".result-count").innerText =
                    Object.keys(refinedData).length;
            });

            //========================================================
            document.querySelectorAll(".add-book-btn").forEach((button) => {
                button.addEventListener("click", function () {
                    const bookId = this.getAttribute("data-id");

                    const selectedBook = refinedData.find(
                        (book) => book.title === bookId
                    );

                    if (selectedBook) {
                        refinedSelectedBookData = {
                            title: selectedBook.title,
                            author: selectedBook.author,
                            publisher: selectedBook.publisher,
                            pubdate: selectedBook.pubdate,
                            description: selectedBook.description,
                            image: selectedBook.image,
                        };
                    }
                    addBookPost(refinedSelectedBookData);

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                    });
                });
            });

            //==========================================
        } catch (error) {
            console.error("Error fetching data:", error);
            //   document.querySelector(".hidden-container").style.display = "flex";
        }
    };

    document.querySelector(".search-btn").addEventListener("click", bookGet);

    //==============================================================================
    const addBookPost = async (refinedSelectedBookData) => {
        const url = `${BASE_URL}/addBook`;

        const headers = {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json;charset=UTF-8",
        };
        const body = JSON.stringify({
            title: refinedSelectedBookData.title,
            author: refinedSelectedBookData.author,
            publisher: refinedSelectedBookData.publisher,
            pubdate: refinedSelectedBookData.pubdate,
            description: refinedSelectedBookData.description,
            image: refinedSelectedBookData.image,
        });
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: body,
            });
            if (!response.ok) {
                document.getElementById("failed-login-modal").style.display =
                    "flex";
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            console.log(data);

            document.getElementById("dc-wd-change-modal").style.display =
                "flex";
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
});

//=============================================================
document.getElementById("failed-login-button").addEventListener("click", () => {
    document.getElementById("failed-login-modal").style.display = "none";
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});
//============================================================
document.getElementById("dc-wd-cancle-button").addEventListener("click", () => {
    document.getElementById("dc-wd-change-modal").style.display = "none";
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});
