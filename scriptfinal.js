/* ==========================================
   1. Supabase 초기화 및 보안 유틸리티
   ========================================== */
   const SUPABASE_URL = 'https://frayeeahgjanjkjqvuog.supabase.co'; 
   const SUPABASE_ANON_KEY = 'sb_publishable_fh9hmfuMlhDn0dzFJZTzsQ_1qYOUFPO'; 
   const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
   
   let currentUser = null; 
   let currentViewPostId = null; 
   
   // [보안 추가] HTML 특수 문자를 치환하여 스크립트 실행 방지
   function escapeHTML(text) {
       if (!text) return "";
       return text
           .replace(/&/g, "&amp;")
           .replace(/</g, "&lt;")
           .replace(/>/g, "&gt;")
           .replace(/"/g, "&quot;")
           .replace(/'/g, "&#039;");
   }
   
   function getQueryParam(key) {
       const params = new URLSearchParams(window.location.search);
       return params.get(key);
   }
   
   /* ==========================================
      2. 인증 관리
      ========================================== */
   supabaseClient.auth.onAuthStateChange(async (event, session) => {
       try {
           currentUser = session ? session.user : null;
           const authBtn = document.getElementById('authBtn');
           const userInfo = document.getElementById('userInfo');
   
           if (currentUser) {
               authBtn.innerText = '로그아웃';
               userInfo.innerText = `${currentUser.user_metadata.full_name}님`;
           } else {
               authBtn.innerText = '구글 로그인';
               userInfo.innerText = '';
           }
           if (currentViewPostId) updateActionButtons();
       } catch (e) { console.error(e); }
   });
   
   async function toggleAuth() {
       if (currentUser) {
           await supabaseClient.auth.signOut();
           localStorage.clear(); 
           alert("로그아웃 되었습니다.");
           location.href = window.location.pathname; 
       } else {
           await supabaseClient.auth.signInWithOAuth({ 
               provider: 'google',
               options: { 
                   queryParams: { prompt: 'select_account' },
                   redirectTo: window.location.origin + window.location.pathname 
               }
           });
       }
   }
   
   /* ==========================================
      3. 화면 전환 및 유틸리티
      ========================================== */
   function hideAllPages() {
       document.getElementById('listPage').style.display = 'none';
       document.getElementById('detailPage').style.display = 'none';
       document.getElementById('writePage').style.display = 'none';
   }
   
   function showListPage() {
       if (getQueryParam('id')) window.history.pushState({}, '', window.location.pathname);
       currentViewPostId = null;
       hideAllPages();
       fetchPosts(); 
       document.getElementById('listPage').style.display = 'block';
   }
   
   function showWritePage(isEdit = false) {
       if (!currentUser) return alert("로그인이 필요합니다!");
       hideAllPages();
       
       const writeTitle = document.getElementById('writePageTitle');
       const submitBtn = document.getElementById('submitBtn');
   
       if (isEdit) {
           if (writeTitle) writeTitle.innerText = "게시글 수정";
           if (submitBtn) submitBtn.innerText = "수정 완료";
           document.getElementById('inputTitle').value = document.getElementById('viewTitle').innerText;
           document.getElementById('inputContent').value = document.getElementById('viewContent').innerText;
       } else {
           if (writeTitle) writeTitle.innerText = "새 게시글 작성";
           if (submitBtn) submitBtn.innerText = "등록하기";
           currentViewPostId = null; 
           document.getElementById('inputTitle').value = '';
           document.getElementById('inputContent').value = '';
       }
   
       document.getElementById('inputAuthor').value = currentUser.user_metadata.full_name;
       document.getElementById('inputAuthor').disabled = true;
       document.getElementById('writePage').style.display = 'block';
   }
   
   /* ==========================================
      4. 게시글 핵심 기능 (CRUD)
      ========================================= */
   async function fetchPosts() {
       const { data: posts, error } = await supabaseClient.from('posts').select('*').order('id', { ascending: false });
       if (error) return;
   
       const listBody = document.getElementById('postList');
       if (!listBody) return;
   
       listBody.innerHTML = posts.map((p, index) => {
           const displayNum = posts.length - index; 
           return `
               <tr onclick="viewPost(${p.id})" style="cursor:pointer;">
                   <td>${displayNum}</td>
                   <!-- [보안] 제목과 이름을 이스케이프 처리[cite: 6] -->
                   <td class="col-title">${escapeHTML(p.title)}</td>
                   <td>${escapeHTML(p.author_name)}</td>
               </tr>
           `;
       }).join('');
   }
   
   async function viewPost(id) {
       if (!id) return;
       currentViewPostId = Number(id);
       const newUrl = `${window.location.pathname}?id=${currentViewPostId}`;
       if (window.location.search !== `?id=${currentViewPostId}`) window.history.pushState({ path: newUrl }, '', newUrl);
   
       const { data: post, error } = await supabaseClient.from('posts').select('*').eq('id', currentViewPostId).single();
       if (error || !post) return alert("글을 불러오지 못했습니다.");
   
       hideAllPages();
       // [보안] innerText를 사용하여 HTML 태그가 실행되지 않도록 설정[cite: 6]
       document.getElementById('viewTitle').innerText = post.title;
       document.getElementById('viewAuthor').innerText = post.author_name;
       document.getElementById('viewContent').innerText = post.content;
       
       updateActionButtons(post.author_id);
       document.getElementById('detailPage').style.display = 'block';
       fetchComments(currentViewPostId);
   }
   
   async function updateActionButtons(authorId) {
       const actionBtns = document.getElementById('postActionBtns');
       if (!actionBtns) return;
       let targetId = authorId;
       if (!targetId && currentViewPostId) {
           const { data } = await supabaseClient.from('posts').select('author_id').eq('id', currentViewPostId).single();
           targetId = data?.author_id;
       }
       actionBtns.style.display = (currentUser && currentUser.id === targetId) ? 'flex' : 'none';
   }
   
   async function savePost() {
       if (!currentUser) return alert("로그인이 필요합니다!");
       const title = document.getElementById('inputTitle').value;
       const content = document.getElementById('inputContent').value;
       if (!title || !content) return alert("내용을 입력해주세요.");
   
       let result;
       if (currentViewPostId) {
           result = await supabaseClient.from('posts').update({ title, content }).eq('id', currentViewPostId);
       } else {
           result = await supabaseClient.from('posts').insert([{ title, content, author_id: currentUser.id, author_name: currentUser.user_metadata.full_name }]);
       }
   
       if (result.error) return alert("저장 실패");
       alert("저장되었습니다.");
       currentViewPostId ? viewPost(currentViewPostId) : showListPage();
   }
   
   function editPost() { showWritePage(true); }
   
   async function deletePost() {
       if (!confirm("정말 삭제하시겠습니까?")) return;
       const { error } = await supabaseClient.from('posts').delete().eq('id', currentViewPostId);
       if (error) return alert("삭제 실패");
       showListPage();
   }
   
   /* ==========================================
      5. 댓글 기능
      ========================================== */
   async function fetchComments(postId) {
       const { data: comments, error } = await supabaseClient.from('comments').select('*').eq('post_id', postId).order('id', { ascending: true });
       if (error) return;
       const commentList = document.getElementById('commentList');
       commentList.innerHTML = comments.map(c => {
           const deleteBtn = (currentUser && currentUser.id === c.author_id) ? `<button class="comment-delete" onclick="deleteComment(${c.id})">삭제</button>` : '';
           return `
               <li>
                   <div class="comment-info">
                       <!-- [보안] 댓글 작성자 이름 이스케이프[cite: 6] -->
                       <span class="author">${escapeHTML(c.author_name)}</span>
                       ${deleteBtn}
                   </div>
                   <!-- [보안] 댓글 내용 이스케이프[cite: 6] -->
                   <div class="comment-text">${escapeHTML(c.content)}</div>
               </li>`;
       }).join('');
   }
   
   async function saveComment() {
       if (!currentUser) return alert("로그인이 필요합니다.");
       const input = document.getElementById('inputComment');
       const content = input.value.trim();
       if (!content) return alert("내용을 입력하세요.");
       await supabaseClient.from('comments').insert([{ post_id: currentViewPostId, content, author_id: currentUser.id, author_name: currentUser.user_metadata.full_name }]);
       input.value = '';
       fetchComments(currentViewPostId);
   }
   
   async function deleteComment(commentId) {
       if (!confirm("삭제하시겠습니까?")) return;
       await supabaseClient.from('comments').delete().eq('id', commentId);
       fetchComments(currentViewPostId);
   }
   
   /* ==========================================
      6. 프로그램 시작
      ========================================== */
   function init() {
       const postId = getQueryParam('id');
       postId ? viewPost(postId) : showListPage();
   }
   window.addEventListener('popstate', init);
   document.addEventListener('DOMContentLoaded', init);