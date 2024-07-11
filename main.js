// const API_KEY = '59fb8bf8b6e54f2aa77e0eb21f46841b'
let newsList = [];
const getLatestNews = async () => {
  let url = `https://bobotimes.netlify.app/top-headlines`;
  const response = await fetch(url);
  // await : 비동기함수, 반드시 async함수에서만 사용가능
  const data = await response.json();
  // json : 파일 형식 중 하나, 객체를 텍스트화 시킨 파일
  newsList = data.articles;
  render();
  console.log("ddd", newsList);
};

const render = () => {
  const newsHTML = newsList.map(
    (news) => `<div class="row news">
                <!-- .row : 부트스트랩 grid system class -->
                <!-- 하위 div가 전부 일렬로 정렬됨 (row:세로)-->
                <div class="col-lg-4">
                  <!-- col : 가로, lg : large,size, 4 : 비율 -->
                  <img
                    class="news_img_size"
                    src="${news.urlToImage || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU'}"
                    onerror="this.onerror=null; this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU';"
                  />
                </div>
                <div class="col-lg-8">
                  <!-- col : 가로, lg : large,size, 8 : 비율 -->
                  <!-- 1줄에 칼럼 사이즈가 8:4 비율인 그리드 형태 -->
                  <h2>${news.title}</h2>
                  <p>${
                    news.description == null || news.description == ""
                      ? "내용없음"
                      : news.description.length > 200
                      ? news.description.substring(0, 200) + "..."
                      : news.description
                   }</p>
                  <div>${news.source.name || "no source"}  ${moment(
                news.publishedAt
     ).fromNow()}</div>
            </div>
          </div>`
  ).join('');
  console.log("HTML",newsHTML);
  document.getElementById("news_board").innerHTML = newsHTML;
};

getLatestNews();

const openSearchBox = () => {
    let inputArea = document.getElementById("input-area");
    if (inputArea.style.display === "inline") {
      inputArea.style.display = "none";
    } else {
      inputArea.style.display = "inline";
    }
  };

function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}
