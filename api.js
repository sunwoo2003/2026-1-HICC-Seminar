/* ==========================================
   1. 데이터 관리 (State)
   ========================================== */
   let posts = [];
   // ⚠️ GNews(https://gnews.io/)에서 발급받은 API 키를 여기에 입력하세요.
   const GNEWS_API_KEY = '여기에_발급받은_GNEWS_API_키_입력'; 
   
   /* ==========================================
      1-2. GNews API 데이터 가져오기 (Fetch)
      ========================================== */
   async function fetchNews() {
       try {
           // GNews API URL 
           const url = `https://gnews.io/api/v4/search?q=tesla&lang=ko&max=10&apikey=${GNEWS_API_KEY}`;
   
           const response = await fetch(url);
           const data = await response.json();
   
           // GNews는 성공 시 'articles' 배열을 바로 반환합니다.
           if (data.articles) {
               // 가져온 데이터를 기존 게시판 형식에 맞게 매핑
               posts = data.articles.map((article, index) => ({
                   id: index + 1,
                   title: article.title || '제목 없음',
                   author: article.source.name || '출처 정보 없음',
                   // GNews는 description이 기사 요약본입니다.
                   content: article.description || '내용이 제공되지 않았습니다.',
                   url: article.url 
               }));
               
               showListPage();
           } else {
               // 키가 잘못되었거나 할당량 초과 시 에러 메시지
               console.error("API 응답 에러:", data.errors);
               alert("뉴스를 불러오는데 실패했습니다. API 키를 확인해주세요.");
           }
       } catch (error) {
           console.error("네트워크 에러:", error);
           alert("데이터를 가져오는 중 문제가 발생했습니다.");
       }
   }
   
   /* ==========================================
      2~4. (기존 유틸리티, 화면 전환, 핵심 기능 코드는 동일합니다)
      ========================================== */
   function hideAllPages() {
       document.getElementById('listPage').style.display = 'none';
       document.getElementById('detailPage').style.display = 'none';
       document.getElementById('writePage').style.display = 'none';
   }
   
   function showListPage() {
       hideAllPages();
       renderList();
       document.getElementById('listPage').style.display = 'block';
   }
   
   function showWritePage() {
       hideAllPages();
       document.getElementById('writePage').style.display = 'block';
   }
   
   function renderList() {
       const listBody = document.getElementById('postList');
       if (!listBody) return;
       
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
   
       posts.unshift({ id: posts.length + 1, title, author, content });
       
       document.getElementById('inputTitle').value = '';
       document.getElementById('inputAuthor').value = '';
       document.getElementById('inputContent').value = '';
   
       showListPage();
   }
   
   /* ==========================================
      5. 프로그램 시작 (App Start)
      ========================================== */
   fetchNews();