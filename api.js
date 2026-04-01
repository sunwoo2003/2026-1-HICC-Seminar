/* ==========================================
   1. 데이터 관리 (State & Config)
   : API 설정 및 뉴스 데이터를 담을 공간
   ========================================== */
   let posts = []; // API에서 받아온 뉴스를 저장할 배열

   // Gnews API 설정 (본인의 API KEY를 입력하세요)
   const API_KEY = 'YOUR_GNEWS_API_KEY'; 
   const API_URL = `https://gnews.io/api/v4/top-headlines?category=technology&lang=ko&country=kr&max=12&apikey=${API_KEY}`;
   
   /* ==========================================
      2. 유틸리티 함수 (Utilities)
      : 화면 전환 및 공통 작업 처리
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
      : API 통신 및 데이터 렌더링
      ========================================== */
   
   /**
    * [신규] Gnews API를 통해 뉴스 데이터를 가져오는 함수
    */
   async function fetchNews() {
       const listBody = document.getElementById('postList');
       listBody.innerHTML = '<tr><td colspan="3" style="padding:20px;">뉴스를 불러오는 중입니다...</td></tr>';
   
       try {
           const response = await fetch(API_URL);
           const data = await response.json();
           
           if (data.articles) {
               // API 데이터를 기존 프로젝트의 데이터 구조에 맞게 가공
               posts = data.articles.map((article, index) => ({
                   id: index + 1,
                   title: article.title,
                   author: article.source.name, // 출처(언론사)를 작성자로 활용
                   content: article.description + "\n\n" + (article.content || ""),
                   date: new Date(article.publishedAt).toLocaleDateString() // 날짜 포맷팅
               }));
               renderList();
           }
       } catch (error) {
           console.error("데이터 로드 실패:", error);
           listBody.innerHTML = '<tr><td colspan="3">데이터를 불러오는 데 실패했습니다. API 키를 확인해 주세요.</td></tr>';
       }
   }
   
   /**
    * [목록] 가공된 posts 데이터를 HTML 표로 출력
    */
   function renderList() {
       const listBody = document.getElementById('postList');
       
       if (posts.length === 0) return;
   
       listBody.innerHTML = posts.map(p => `
           <tr onclick="viewPost(${p.id})" style="cursor:pointer;">
               <td>${p.id}</td>
               <td class="col-title">${p.title}</td>
               <td>${p.author}</td>
           </tr>
       `).join('');
   }
   
   /**
    * [상세] 선택한 뉴스 기사의 상세 내용을 화면에 표시
    */
   function viewPost(id) {
       const post = posts.find(p => p.id === id);
       if (!post) return;
   
       hideAllPages();
       document.getElementById('viewTitle').innerText = post.title;
       document.getElementById('viewAuthor').innerText = post.author;
       document.getElementById('viewContent').innerText = post.content;
       document.getElementById('detailPage').style.display = 'block';
   }
   
   /**
    * [저장] 직접 글을 작성하여 목록 맨 앞에 추가 (로컬 전용)
    */
   function savePost() {
       const title = document.getElementById('inputTitle').value;
       const author = document.getElementById('inputAuthor').value;
       const content = document.getElementById('inputContent').value;
   
       if (!title || !author || !content) return alert("내용을 모두 입력해 주세요!");
   
       // 새 데이터를 배열 맨 앞에 추가 (API 데이터와 섞임)
       posts.unshift({ 
           id: posts.length + 1, 
           title, 
           author, 
           content,
           date: "방금 전" 
       });
       
       // 입력창 초기화
       document.getElementById('inputTitle').value = '';
       document.getElementById('inputAuthor').value = '';
       document.getElementById('inputContent').value = '';
   
       showListPage();
   }
   
   /* ==========================================
      5. 프로그램 시작 (App Start)
      ========================================== */
   // 페이지 로드 시 목록 표시 및 뉴스 데이터 호출
   window.onload = () => {
       showListPage();
       fetchNews();
   };