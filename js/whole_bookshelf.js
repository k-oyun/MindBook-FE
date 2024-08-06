document.addEventListener("DOMContentLoaded", function () {
    const BASE_URL = "http://3.38.119.114:8080";

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

    var refinedData = {};
    const myBookGet = async () => {
        const url = `${BASE_URL}/myBook`;

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

            const refinedData = data.map((item) => ({
                title: item.title,
                author: item.author,
                image: item.image,
                id: item.id,
            }));

            //================================================================
            const groupSize = 4;
            const WholeBooks = document.querySelector(".whole-books");

            for (let i = 0; i < refinedData.length; i += groupSize) {
                const group = refinedData.slice(i, i + groupSize);
                const bookInfoContainer = document.createElement("div");
                bookInfoContainer.className = "book-info-container";

                group.forEach((book) => {
                    const bookInfoHTML = `
              <div class="book-infos" data-id="${book.id}">
                <a href="add_book_report.html" class="add_book_report_btn">
                  <img class="book-img" src="${book.image}" alt="Book Image"/>
                </a>
                  <span class="book-names">${book.title}</span>
                  <span class="book-author">| ${book.author}</span>
                
              </div>
          
          `;

                    bookInfoContainer.innerHTML += bookInfoHTML;
                });

                if (i + groupSize >= refinedData.length) {
                    const addButtonHTML = `
          
              <div class="book-infos">
                  <button class="book-add-btn"></button>
                      <a href='add_book_report.html' class= "move-to-add-book">
                          <div class="book-add-btn-container">
                          <img src="../img/plus_btn.png" class="book-add-btn-img" />
                          </div>
                      </a>
                  </button>

              </div>
          
              `;
                    bookInfoContainer.innerHTML += addButtonHTML;
                }
                WholeBooks.appendChild(bookInfoContainer);

                bookInfoContainer
                    .querySelectorAll(".book-infos")
                    .forEach((element) => {
                        element.addEventListener("click", function () {
                            const bookId = element.getAttribute("data-id");
                            const link = element.querySelector(
                                "a.add_book_report_btn"
                            );
                            if (link) {
                                link.href = `add_book_report.html?bookId=${bookId}`;
                            }
                        });
                    });
            }

            //======================================================
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    myBookGet();

    //======================================================================
    let bookName = "";
    document
        .querySelector(".search-book")
        .addEventListener("input", function () {
            bookName = document.querySelector(".search-book").value;
            console.log(bookName);
        });

    const BookSearchGet = async () => {
        const url = `${BASE_URL}/myBook/search?title=${bookName}`;

        const headers = {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json;charset=UTF-8",
        };

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: headers,
            });
            document.querySelector(".book-name").innerText = bookName;
            const searchResult = document.querySelector(".search-result");
            if (!response.ok) {
                document.querySelector(
                    ".whole-bookshelf-container"
                ).style.display = "none";
                document.querySelector(
                    ".bookshelf-title-container"
                ).style.display = "none";
                document.querySelector(
                    ".Exist-result-container"
                ).style.display = "none";
                document.querySelector(
                    ".NotExist-result-container"
                ).style.display = "flex";
                searchResult.innerHTML = "";
                searchResult.appendChild(bookInfoContainer);
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            console.log(data);
            document.querySelector(".whole-bookshelf-container").style.display =
                "none";
            document.querySelector(".bookshelf-title-container").style.display =
                "none";
            document.querySelector(".NotExist-result-container").style.display =
                "none";
            document.querySelector(".Exist-result-container").style.display =
                "flex";

            const refinedData = data.map((item) => ({
                title: item.title,
                author: item.author,
                image: item.image,
                id: item.id,
            }));

            //================================================================
            const groupSize = 4;
            searchResult.innerHTML = "";
            for (let i = 0; i < refinedData.length; i += groupSize) {
                const group = refinedData.slice(i, i + groupSize);
                const bookInfoContainer = document.createElement("div");
                bookInfoContainer.className = "book-info-container";

                group.forEach((book) => {
                    const bookInfoHTML = `
              <div class="book-infos">
                <img class="book-img" src="${book.image}" alt="Book Image"/>
                <span class="book-names">${book.title}</span>
                <span class="book-author">| ${book.author}</span>
              </div>
          `;
                    bookInfoContainer.innerHTML += bookInfoHTML;
                });
                searchResult.appendChild(bookInfoContainer);
            }

            //================================================================
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    document.querySelector(".search-btn").addEventListener("click", () => {
        BookSearchGet();
    });
});
