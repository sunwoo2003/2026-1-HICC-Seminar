/* ==========================================
   1. 데이터 관리 (State)
   ========================================== */
// 기존 더미 데이터를 지우고 빈 배열로 시작합니다.
let posts = [];
// NewsAPI에서 발급받은 API 키를 여기에 입력하세요.
const API_KEY = '여기에_발급받은_API_키를_입력하세요'; 

/* ==========================================
   1-2. News API 데이터 가져오기 (Fetch)
   ========================================== */
async function fetchNews() {
    try {
        // 뉴스를 가져옵니다.
        // https://newsapi.org/v2/everything?q=IT&language=ko&sortBy=publishedAt&apiKey=
        // https://newsapi.org/v2/everything?q=개발자&language=ko&apiKey=
        const response = await fetch(`https://newsapi.org/v2/everything?q=tesla&from=2026-02-28&sortBy=publishedAt&apiKey=${API_KEY}`);
        const data = await response.json();

        if (data.status === "ok") {
            // 가져온 뉴스 데이터를 기존 게시판 형식에 맞게 가공합니다.
            posts = data.articles.map((article, index) => ({
                id: index + 1,
                title: article.title || '제목 없음',
                author: article.author || article.source.name || '기자 정보 없음',
                content: article.content || article.description || '내용이 제공되지 않았습니다. 원문 링크를 확인해주세요.',
                url: article.url // 원문 기사 링크 추가
            }));
            
            // 데이터 로드가 끝나면 목록 화면을 그립니다.
            showListPage();
        } else {
            alert("뉴스를 불러오는데 실패했습니다: " + data.message);
        }
    } catch (error) {
        console.error("API 연동 에러:", error);
        alert("데이터를 가져오는 중 문제가 발생했습니다.");
    }
}

/* ==========================================
   2. 유틸리티 함수 (Utilities)
   ========================================== */
function hideAllPages() {
    document.getElementById('listPage').style.display = 'none';
    document.getElementById('detailPage').style.display = 'none';
    document.getElementById('writePage').style.display = 'none';
}

/* ==========================================
   3. 화면 전환 로직 (Page Switching)
   ========================================== */
function showListPage() {
    hideAllPages();
    renderList();
    document.getElementById('listPage').style.display = 'block';
}

function showWritePage() {
    hideAllPages();
    document.getElementById('writePage').style.display = 'block';
}

/* ==========================================
   4. 핵심 기능 구현 (Core Features)
   ========================================== */
function renderList() {
    const listBody = document.getElementById('postList');
    
    listBody.innerHTML = posts.map(p => `
        <tr onclick="viewPost(${p.id})" style="cursor:pointer;">
            <td>${p.id}</td>
            <td class="col-title">${p.title}</td>
            <td>${p.author}</td>
        </tr>
    `).join('');
}

function viewPost(id) {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    hideAllPages();
    document.getElementById('viewTitle').innerText = post.title;
    document.getElementById('viewAuthor').innerText = post.author;
    document.getElementById('viewContent').innerText = post.content;
    document.getElementById('detailPage').style.display = 'block';
}

function savePost() {
    const title = document.getElementById('inputTitle').value;
    const author = document.getElementById('inputAuthor').value;
    const content = document.getElementById('inputContent').value;

    if (!title || !author || !content) return alert("내용을 모두 입력해 주세요!");

    posts.unshift({ 
        id: posts.length + 1, 
        title, 
        author, 
        content 
    });
    
    document.getElementById('inputTitle').value = '';
    document.getElementById('inputAuthor').value = '';
    document.getElementById('inputContent').value = '';

    showListPage();
}

/* ==========================================
   5. 프로그램 시작 (App Start)
   ========================================== */
// 기존 showListPage() 대신 API를 먼저 호출하도록 변경합니다.
fetchNews();