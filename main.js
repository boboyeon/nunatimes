// const API_KEY = '59fb8bf8b6e54f2aa77e0eb21f46841b'
let newsList = [];
const menus = document.querySelectorAll(".menus_btn button"); 
// 메뉴 버튼 호출
menus.forEach(menu=>menu.addEventListener("click",(event)=>getNewsByCategory(event)));
// 각 버튼에 클릭이벤트

async function getLatestNews() {
    let url = new URL(
        `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`
      );
    const response = await fetch(url);
    // await : 비동기함수, 반드시 async함수에서만 사용가능
    const data = await response.json();
    // json : 파일 형식 중 하나, 객체를 텍스트화 시킨 파일
    newsList = data.articles;
    render();
    console.log("ddd", newsList);
}

// 메뉴 카테고리 버튼 클릭 이벤트 함수
const getNewsByCategory= async (event)=>{
    const category = event.target.textContent.toLowerCase();
    console.log("category",category);
    const url = new URL(
        `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`
      );
    const response = await fetch(url);
    const data = await response.json();
    console.log("ddd",data);
    newsList = data.articles;
    render();
}

// 검색 함수
const searchNews= async ()=>{
    const keyword = document.getElementById("search-input").value
    console.log("keyword", keyword);
    if (!keyword.trim()) return;
    const url = new URL(
        `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${keyword}`
      );
      
    const response = await fetch(url);
    const data = await response.json();
    console.log("keyword data",data);
    newsList = data.articles;
    render();
    document.getElementById("search-input").value = '';
}

document.getElementById("search-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchNews(); // 엔터 키가 눌렸을 때 검색 수행
    }
});

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

// 1. 버튼들에 클릭이벤트 주기
// 2. 카테고리별 뉴스 가져오기
// 3. 그 뉴스들 보여주기

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
