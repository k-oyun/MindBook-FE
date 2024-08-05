document.addEventListener("DOMContentLoaded", function () {
  const BASE_URL = "http://3.38.119.114:8080";
  var refinedData = {};
  const myBookGet = async () => {
    const url = `${BASE_URL}/myBook`;

    const headers = {
      Authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkaGRiczEyMDhAbmF2ZXIuY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3MjI4NDE2OTMsImV4cCI6MTcyMzAxNDQ5M30.kDHRLWcdkovXSdj-J2R7DA40mi1MJ4zpXnlf5NH4kg0",
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
      }));
      console.log("refined DATA ", refinedData);

      //================================================================
      const groupSize = 4;
      const WholeBooks = document.querySelector(".whole-books");

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

        if (i + groupSize >= refinedData.length) {
          const addButtonHTML = `
              <div class="book-infos">

                  <button class="book-add-btn"></button>
                      <a href='add_book.html' class= "move-to-add-book">
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
      }

      //======================================================
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  myBookGet();

  //======================================================================
  let bookName = "";
  document.querySelector(".search-book").addEventListener("input", function () {
    bookName = document.querySelector(".search-book").value;
    console.log(bookName);
  });

  const BookSearchGet = async () => {
    const url = `${BASE_URL}/myBook/search?title=${bookName}`;

    const headers = {
      Authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkaGRiczEyMDhAbmF2ZXIuY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3MjI4NDE2OTMsImV4cCI6MTcyMzAxNDQ5M30.kDHRLWcdkovXSdj-J2R7DA40mi1MJ4zpXnlf5NH4kg0",
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
        document.querySelector(".whole-bookshelf-container").style.display =
          "none";
        document.querySelector(".bookshelf-title-container").style.display =
          "none";
        document.querySelector(".Exist-result-container").style.display =
          "none";
        document.querySelector(".NotExist-result-container").style.display =
          "flex";
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
      document.querySelector(".Exist-result-container").style.display = "flex";

      const refinedData = data.map((item) => ({
        title: item.title,
        author: item.author,
        image: item.image,
      }));
      console.log("refined DATA ", refinedData);

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
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  document.querySelector(".search-btn").addEventListener("click", () => {
    BookSearchGet();
  });
});
