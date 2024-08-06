document.addEventListener("DOMContentLoaded", function () {
  const BASE_URL = "http://3.38.119.114:8080";
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
        id: item.id,
      }));

      const bookImgContainer = document.querySelector(".book-container");

      refinedData.slice(0, 6).forEach((book) => {
        const imgElement = document.createElement("img");
        imgElement.className = "book-img-container";
        imgElement.src = book.image;
        bookImgContainer.appendChild(imgElement);
      });

      //======================================================
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  myBookGet();

  document.querySelector(".add-book-btn").addEventListener("img", () => {
    window.location.href = "add_book.html";
  });
});
