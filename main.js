// const API_KEY = '59fb8bf8b6e54f2aa77e0eb21f46841b'
let news=[]
const getLatestNews = async () => {
    const url = new URL(`https://bobotimes.netlify.app/top-headlines?country=kr`);
    const response = await fetch(url);
    // await : 비동기함수, 반드시 async함수에서만 사용가능
    const data = await response.json();
    // json : 파일 형식 중 하나, 객체를 텍스트화 시킨 파일
    news = data.articles;
    console.log("ddd",news);
};
getLatestNews();