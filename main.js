// const API_KEY = '59fb8bf8b6e54f2aa77e0eb21f46841b'
let newsList = [];
const menus = document.querySelectorAll(".menus_btn button");
// 메뉴 버튼 호출
const searchInput = document.getElementById("search-input");
// input 호출
const navClick = document.querySelectorAll(".menus > button");
// nav 버튼 호출
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);
// 각 버튼에 클릭이벤트
let url = new URL(
  `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`
);
// 매번 반복되어 사용되지만 각 함수마다 다른 형태로 쓰이기때문에 let으로 전역변수 설정 후 각 함수 안에서 재정의

let totalResults = 0;

// 정하는 값
let page = 1;
const pageSize = 10; // 고정값
const groupSize = 5; // 고정값

// 반복되는 코드 리펙토링
const getNews = async () => {
  try {
    // 에러 핸들링 try/catch
    url.searchParams.set("page", page); // url 뒤에 페이지를 붙여준다, &page=page와 동일
    url.searchParams.set("pageSize", pageSize);
    // url 호출(fetch) 이전에 설정

    const response = await fetch(url);
    // await : 비동기함수, 반드시 async함수에서만 사용가능

    const data = await response.json();
    // json : 파일 형식 중 하나, 객체를 텍스트화 시킨 파일
    console.log("data", data);
    if (response.status === 200) {
      // response/ status 정보가 200이면
      if (data.articles.length === 0) {
        // 검색 결과인 data.article의 길이(갯수)가 0이면
        throw new Error("검색어에 맞는 결과가 없습니다.");
      }
      newsList = data.articles;
      totalResults = data.totalResults; // 페이지네이션을 위한 totalResult 값
      render(); // 뉴스 정상 출력
      paginationRender(); // 페이지네이션 함수 실행
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
    // error상황에서 에러 메세지를 errorRender의 매개변수로 전달 (errorMessage)
  }
};

const getLatestNews = async () => {
  url = new URL( // 재정의 된 url
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`
  );
  await getNews();
};

// 메뉴 카테고리 버튼 클릭 이벤트 함수
const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`
  );
  await getNews();

  if (window.innerWidth <= 768) {
    closeNav();
  } // 모바일에서 카테고리 선택시 sideNav 닫기
};

// 검색 함수
const searchNews = async () => {
  const keyword = document.getElementById("search-input").value;
  if (!keyword.trim()) return;
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${keyword}`
  );

  await getNews();

  document.getElementById("search-input").value = "";
};

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchNews();
    // 엔터 키가 눌렸을 때 검색 수행
  }
});

searchInput.addEventListener("focus", () => {
  searchInput.value = "";
  // 포커스가 주어졌을 때 입력 값 비우기
});

// 키워드를 강조하는 함수
function highlightKeyword(keyword, txt) {
  if (!keyword) return txt;
  let index = txt.toLowerCase().indexOf(keyword.toLowerCase());
  while (index !== -1) {
    const start = '<span class="light_blue">';
    const end = "</span>";
    txt =
      txt.slice(0, index) +
      start +
      txt.slice(index, index + keyword.length) +
      end +
      txt.slice(index + keyword.length, txt.length);
    index = txt
      .toLowerCase()
      .indexOf(keyword.toLowerCase(), index + start.length + keyword.length);
  }
  return txt;
}

const render = () => {
  const keyword = document.getElementById("search-input").value.trim();
  const newsHTML = newsList
    .map(
      (news) => `<div class="row news">
                <!-- .row : 부트스트랩 grid system class -->
                <!-- 하위 div가 전부 일렬로 정렬됨 (row:세로)-->
                <div class="col-lg-4">
                  <!-- col : 가로, lg : large,size, 4 : 비율 -->
                  <img
                    class="news_img_size"
                    src="${
                      news.urlToImage ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
                    }"
                    onerror="this.onerror=null; this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU';"
                  />
                </div>
                <div class="col-lg-8">
                  <!-- col : 가로, lg : large,size, 8 : 비율 -->
                  <!-- 1줄에 칼럼 사이즈가 8:4 비율인 그리드 형태 -->
                  <!-- 제목과 설명에 highlightKeyword 함수 적용 -->
                  <h2>${highlightKeyword(keyword, news.title)}</h2>
                  <p>${
                    news.description == null || news.description == ""
                      ? "내용없음"
                      : news.description.length > 200
                      ? highlightKeyword(
                          keyword,
                          news.description.substring(0, 200)
                        ) + "..."
                      : highlightKeyword(keyword, news.description)
                  }</p>
                  <div>${news.source.name || "no source"}  ${moment(
        news.publishedAt
      ).fromNow()}</div>
            </div>
          </div>`
    )
    .join("");
  document.getElementById("news_board").innerHTML = newsHTML;
};

// 에러 메세지 출력함수
const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">
                      ${errorMessage}
                     </div>`;
  document.getElementById("news_board").innerHTML = errorHTML;
};

// 페이지네이션 함수
const paginationRender = () => {
  // 알아야 하는 값 : totalResult, page(1), pageSize(10), groupSize(5)
  // pageGroup
  const pageGroup = Math.ceil(page / groupSize); // page 나누기 groupSize 한 값을 올림함수에

  // totalPages
  const totalPages = Math.ceil(totalResults / pageSize);

  // lastPage
  const lastPage = pageGroup * groupSize;
  // 마지막 페이지 그룹이 그룹사이즈보다 작다면 lastPage = totalPages
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }

  // firstPage
  const firstPage =
    lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);
  // 첫번째 페이지 계산식이 -가 나올 경우 최하값을 1로 설정 : 아니라면 기존 식을 실행

  let paginationHTML = '';


  if (page > 1) {
    paginationHTML += `
      <li class="page-item" onclick="moveToPage(1)">
        <a class="page-link"> &laquo; </a>
      </li>
     
      <li class="page-item" onclick="moveToPage(${page - 1})">
        <a class="page-link"> &lt; </a>
      </li>
    `;
  }
  // <<버튼과 <버튼

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${i === page ? "active" : ""}" onclick="moveToPage(${i})">
      <a class="page-link">${i}</a>
    </li>`;
  }


  if (page < totalPages) {
    paginationHTML += `
      <li class="page-item" onclick="moveToPage(${page + 1})">
        <a class="page-link"> &gt; </a>
      </li>
      
      <li class="page-item" onclick="moveToPage(${totalPages})">
        <a class="page-link"> &raquo; </a>
      </li>
    `;
    // >버튼과 >>버튼
  }

  document.querySelector(".pagination").innerHTML = paginationHTML;

  //   <nav aria-label="Page navigation example">
  //   <ul class="pagination">
  //     <li class="page-item"><a class="page-link" href="#">Previous</a></li>
  //     <li class="page-item"><a class="page-link" href="#">1</a></li>
  //     <li class="page-item"><a class="page-link" href="#">2</a></li>
  //     <li class="page-item"><a class="page-link" href="#">3</a></li>
  //     <li class="page-item"><a class="page-link" href="#">Next</a></li>
  //   </ul>
  // </nav>
};

// 페이지네이션의 각 페이지 이동 함수
const moveToPage = (pageNum) => {
  console.log("moveToPage", pageNum);
  // 총 페이지 수를 다시 계산
  const totalPages = Math.ceil(totalResults / pageSize);
  // 페이지 번호가 1보다 작으면 1로 설정
  if (pageNum < 1) pageNum = 1;
  // 페이지 번호가 마지막 페이지보다 크면 마지막 페이지로 설정
  if (pageNum > Math.ceil(totalResults / pageSize)) pageNum = Math.ceil(totalResults / pageSize);
  page = pageNum; // 1로 지정되어 있던 변수를 페이지 넘버로 재정의
  getNews();
};

getLatestNews();

// 검색창 여닫기
const openSearchBox = () => {
  let inputArea = document.getElementById("input_area");
  if (inputArea.style.display === "inline") {
    inputArea.style.display = "none";
  } else {
    inputArea.style.display = "inline";
  }
};

// nav 메뉴 클릭 시 배경색
navClick.forEach((button) => {
  button.addEventListener("click", () => {
    // 모든 버튼에서 nav_tabs 클래스를 제거
    navClick.forEach((btn) => btn.classList.remove("nav_tabs"));
    // 클릭된 버튼에 nav_tabs 클래스를 추가
    button.classList.add("nav_tabs");
  });
});

function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}
