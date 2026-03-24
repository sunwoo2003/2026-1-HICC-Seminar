/* ==========================================
   1. 데이터 관리 (State)
   : 프로그램의 재료가 되는 샘플 데이터
   ========================================== */
const posts = [
    { id: 20, title: "오늘 세미나 간식 뭐 나오나요??", author: "배고픈자", content: "샌드위치 나온다는 소문이 있던데 진짜임?", date: "14:05" },
    { id: 19, title: "강연자님 목소리 너무 좋으시네요", author: "ㅇㅇ", content: "집중이 팍팍 됩니다. 아나운서신줄..", date: "13:58" },
    { id: 18, title: "Q&A 세션 언제부터 시작인가요?", author: "질문봇", content: "강연 끝나고 바로 하나요 아니면 쉬는시간 있나요?", date: "13:45" },
    { id: 17, title: "와 실습 코드 에러나는데 도와주실 분", author: "코린이", content: "npm install 단계부터 막혔습니다 ㅠㅠ", date: "13:30" },
    { id: 16, title: "세미나 장소 에어컨 좀 꺼주세요 춥습니다", author: "오들오들", content: "뒷자리인데 바람이 너무 직빵이에요..", date: "13:15" },
    { id: 15, title: "[공지] 발표 자료 다운로드 링크 안내", author: "운영자", content: "공식 홈페이지 자료실에서 확인 가능합니다.", date: "13:00" },
    { id: 14, title: "오늘 발표 주제 너무 어렵지 않나요?", author: "ㅇㅇ", content: "저만 이해 못하고 있는 건 아니죠? ㅋㅋㅋ", date: "12:50" },
    { id: 13, title: "점심 추천 받습니다 (주변 맛집)", author: "미식가", content: "나가서 먹고 오려고 하는데 어디가 괜찮나요?", date: "12:40" },
    { id: 12, title: "세미나 기념품 수건인가요?", author: "수건수집가", content: "기념품 궁금해서 잠이 안 옵니다.", date: "12:30" },
    { id: 11, title: "뒷자리 와이파이 잘 안 잡히는 듯", author: "데이터무제한", content: "접속자가 많아서 그런가 봐요.", date: "12:15" },
    { id: 10, title: "강연 중에 질문해도 되나요?", author: "궁금증", content: "아니면 무조건 끝날 때까지 기다려야 함?", date: "11:55" },
    { id: 9, title: "화장실 위치 어디인가요?", author: "급해요", content: "복도 끝 왼쪽에 있나요?", date: "11:40" },
    { id: 8, title: "오늘 참석 인원 꽤 많네요 ㄷㄷ", author: "구경꾼", content: "복도까지 꽉 찬 듯", date: "11:30" },
    { id: 7, title: "비전공자도 이해할 수 있는 내용인가요?", author: "입문자", content: "아직까지는 용어가 좀 어렵네요.", date: "11:15" },
    { id: 6, title: "주차권 배부하나요?", author: "차주", content: "나갈 때 데스크에서 받으면 되나요?", date: "11:00" },
    { id: 5, title: "오전 세션 요약해주실 분 구함", author: "늦잠", content: "차가 막혀서 좀 늦게 왔습니다 ㅠㅠ", date: "10:50" },
    { id: 4, title: "이거 수료증도 나오나요?", author: "스펙왕", content: "메일로 보내주는 건지 궁금합니다.", date: "10:30" },
    { id: 3, title: "노트북 대여 가능한가요?", author: "깜빡이", content: "충전기를 안 가져왔네요..", date: "10:15" },
    { id: 2, title: "강의실 너무 깨끗하고 좋네요", author: "만족", content: "공부하기 딱 좋은 환경임", date: "10:05" },
    { id: 1, title: "[공지] 세미나 입실 완료 안내", author: "운영자", content: "곧 행사가 시작될 예정입니다. 착석 부탁드립니다.", date: "10:00" }
];

/* ==========================================
   2. 유틸리티 함수 (Utilities)
   : 반복되는 작업(화면 숨기기 등)을 처리
   ========================================== */
// 모든 섹션을 숨기는 공통 함수
function hideAllPages() {
    document.getElementById('listPage').style.display = 'none';
    document.getElementById('detailPage').style.display = 'none';
    document.getElementById('writePage').style.display = 'none';
}


/* ==========================================
   3. 화면 전환 로직 (Page Switching)
   : 버튼 클릭 시 특정 섹션만 보여주는 기능
   ========================================== */
// 목록 화면으로 이동
function showListPage() {
    hideAllPages();
    renderList(); // 데이터 갱신 후 노출
    document.getElementById('listPage').style.display = 'block';
}

// 글쓰기 화면으로 이동
function showWritePage() {
    hideAllPages();
    document.getElementById('writePage').style.display = 'block';
}


/* ==========================================
   4. 핵심 기능 구현 (Core Features)
   : 데이터를 가공하고 화면에 그리는 기능
   ========================================== */
// [목록] 데이터를 가져와서 HTML 표(Table)로 만들기
function renderList() {
    const listBody = document.getElementById('postList');
    
    // 배열 데이터를 HTML 문자열로 변환하여 삽입
    listBody.innerHTML = posts.map(p => `
        <tr onclick="viewPost(${p.id})" style="cursor:pointer;">
            <td>${p.id}</td>
            <td class="col-title">${p.title}</td>
            <td>${p.author}</td>
        </tr>
    `).join('');
}

// [상세] 특정 글의 ID를 찾아 내용을 보여줌
function viewPost(id) {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    hideAllPages();
    document.getElementById('viewTitle').innerText = post.title;
    document.getElementById('viewAuthor').innerText = post.author;
    document.getElementById('viewContent').innerText = post.content;
    document.getElementById('detailPage').style.display = 'block';
}

// [저장] 입력한 정보를 데이터 배열에 추가
function savePost() {
    const title = document.getElementById('inputTitle').value;
    const author = document.getElementById('inputAuthor').value;
    const content = document.getElementById('inputContent').value;

    if (!title || !author || !content) return alert("내용을 모두 입력해 주세요!");

    // 새 데이터를 배열 맨 앞에 추가
    posts.unshift({ id: posts.length + 1, title, author, content });
    
    // 입력창 초기화
    document.getElementById('inputTitle').value = '';
    document.getElementById('inputAuthor').value = '';
    document.getElementById('inputContent').value = '';

    showListPage(); // 목록으로 복귀
}


/* ==========================================
   5. 프로그램 시작 (App Start)
   ========================================== */
showListPage(); // 접속 시 첫 화면 실행