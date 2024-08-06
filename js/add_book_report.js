// urlParams.js 파일에 작성

function getUrlParameter(name) {
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(window.location.href);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
document.addEventListener("DOMContentLoaded", function () {
  const BASE_URL = "http://3.38.119.114:8080";
  const bookId = getUrlParameter("bookId");
  console.log(bookId);

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
        publisher: item.publisher,
        id: item.id,
        pubdate: item.pubdate,
        description: item.description,
      }));

      var matchingBooks = refinedData.filter(
        (book) => book.id === Number(bookId)
      );

      matchingBooks.forEach((info) => {
        document.querySelector(".img-container").src = info.image;
        document.querySelector(".book-intro-info-name").innerText = info.title;
        document.querySelector(".book-intro-info-author").innerText =
          info.author;
        document.querySelector(".book-intro-info-publisher").innerText =
          info.publisher;
        document.querySelector(".book-intro-info-pub-date").innerText =
          info.pubdate;
        document.querySelector(".book-intro-info-brief").innerText =
          info.description;
        console.log(info.description);
      });

      //================================================================

      //======================================================
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  myBookGet();

  //======================================================
  const checkReport = async () => {
    const url = `${BASE_URL}/bookReport?bookId=${Number(bookId)}`;

    const headers = {
      Authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkaGRiczEyMDhAbmF2ZXIuY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3MjI5MzY4MzgsImV4cCI6MTcyMzEwOTYzOH0.tWj7EAlene-cMYlAbcHksglpeDDaPXQureU-ckDlHKw",
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
      console.log(data.success);
      if (data.success == true) {
        document.querySelector(".book-report-right-side-bar").style.display =
          "flex";
        document.querySelector(".right-side-bar").style.display = "none";
        document.querySelector(".user-name").innerText = data.data.userNickname;

        document.querySelector(".creation-date").innerText =
          data.data.createdAt;
        document.querySelector(".user-report").innerText = data.data.contents;
      }
    } catch (error) {
      document.querySelector(".book-report-right-side-bar").style.display =
        "none";
      document.querySelector(".right-side-bar").style.display = "flex";
      console.log(document.querySelector(".right-side-bar").style.display);
      console.error("Error fetching data:", error);
    }
  };

  checkReport();
  //========================================================
  var report = "";

  //========================================================
  const addBookReportPost = async (report) => {
    const url = `${BASE_URL}/bookReport`;

    const headers = {
      Authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkaGRiczEyMDhAbmF2ZXIuY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3MjI5MzY4MzgsImV4cCI6MTcyMzEwOTYzOH0.tWj7EAlene-cMYlAbcHksglpeDDaPXQureU-ckDlHKw",
      "Content-Type": "application/json;charset=UTF-8",
    };
    const body = JSON.stringify({
      bookId: Number(bookId),
      contents: report,
    });
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: body,
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //========================================================
  const deleteBookReport = async () => {
    const url = `${BASE_URL}/bookReport?bookId=${Number(bookId)}`;

    const headers = {
      Authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkaGRiczEyMDhAbmF2ZXIuY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3MjI4NDE2OTMsImV4cCI6MTcyMzAxNDQ5M30.kDHRLWcdkovXSdj-J2R7DA40mi1MJ4zpXnlf5NH4kg0",
      "Content-Type": "application/json;charset=UTF-8",
    };

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: headers,
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);

      //======================================================
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  document.querySelector(".delete-btn").addEventListener("click", async () => {
    await deleteBookReport();
    window.location.href = "whole_bookshelf.html";
  });

  document
    .querySelector(".report-add-btn")
    .addEventListener("click", async () => {
      report = document.querySelector(".book-report").value;
      console.log(report);
      await addBookReportPost(report);
      window.location.href = "whole_bookshelf.html";
      window.location.href = "whole_bookshelf.html";
    });
});
