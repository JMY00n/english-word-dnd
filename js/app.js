/* =========================================
   1. 상태 및 DOM 요소
   ========================================= */
const state = {
    questions: [],
    currentQuestion: null,
    score: 0,
    timeLeft: 60,
    timerId: null,
    isPlaying: false,
    currentUser: null, // 로그인한 유저 정보 {id, name, maxScore}
    draggedItem: null
};

const elements = {
    app: document.querySelector(".app"),
    // 메뉴
    menuBtn: document.querySelector("#menuBtn"),
    dropdown: document.querySelector("#dropdownMenu"),
    menuItems: {
        login: document.querySelector("#loginMenuItem"),
        signup: document.querySelector("#signupMenuItem"),
        logout: document.querySelector("#logoutMenuItem"),
        ranking: document.querySelector("#rankingMenuItem"),
        guide: document.querySelector("#guideMenuItem"),
    },
    // 메인 UI
    userNameDisplay: document.querySelector("#userNameDisplay"),
    bestScoreDisplay: document.querySelector("#bestScoreDisplay"),
    scoreDisplay: document.querySelector("#scoreDisplay"),
    korSentence: document.querySelector(".kor-sentence"),
    wordBox: document.querySelector(".word-box"),
    dropBox: document.querySelector(".drop-box"),
    // 컨트롤
    checkBtn: document.querySelector("#checkBtn"),
    nextBtn: document.querySelector("#nextBtn"),
    startBtn: document.querySelector("#startBtn"),
    timerText: document.querySelector("#timerText"),
    // 모달
    modalOverlay: document.querySelector("#modalOverlay"),
    modalTitle: document.querySelector("#modalTitle"),
    modalBody: document.querySelector("#modalBody"),
    closeModalBtn: document.querySelector("#closeModalBtn")
};

/* =========================================
   2. 초기화 및 이벤트 리스너
   ========================================= */
function init() {
    checkLoginStatus(); // 새로고침 시 로그인 유지 확인
    
    // JSON 데이터 로드
    fetch("data/questions.json")
        .then(res => res.json())
        .then(data => {
            state.questions = data;
        })
        .catch(err => console.error("Data Load Error:", err));

    bindEvents();
}

function bindEvents() {
    // 1. 드래그 앤 드롭
    elements.dropBox.addEventListener("dragover", handleDragOver);
    elements.dropBox.addEventListener("drop", (e) => handleDrop(e, elements.dropBox));
    elements.wordBox.addEventListener("dragover", (e) => e.preventDefault());
    elements.wordBox.addEventListener("drop", (e) => handleDrop(e, elements.wordBox));

    // 2. 게임 컨트롤
    elements.checkBtn.addEventListener("click", checkAnswer);
    elements.nextBtn.addEventListener("click", loadRandomQuestion);
    elements.startBtn.addEventListener("click", toggleGame);

    // 3. 메뉴 및 모달
    elements.menuBtn.addEventListener("click", () => {
        elements.dropdown.classList.toggle("hidden");
    });
    elements.closeModalBtn.addEventListener("click", closeModal);
    
    // 메뉴 아이템 클릭
    elements.menuItems.login.addEventListener("click", showLoginModal);
    elements.menuItems.signup.addEventListener("click", showSignupModal);
    elements.menuItems.logout.addEventListener("click", logout);
    elements.menuItems.ranking.addEventListener("click", showRankingModal);
    elements.menuItems.guide.addEventListener("click", showGuideModal);
}

/* =========================================
   3. 게임 로직 (타이머, 시작, 종료)
   ========================================= */
function toggleGame() {
    if (state.isPlaying) {
        endGame(true); // 강제 종료
    } else {
        startGame();
    }
}

function startGame() {
    if (state.questions.length === 0) return alert("데이터 로딩 중입니다.");

    state.isPlaying = true;
    state.score = 0;
    state.timeLeft = 60;
    updateScoreUI();
    
    // UI 업데이트
    elements.startBtn.innerText = "STOP GAME";
    elements.startBtn.classList.add("playing");
    elements.checkBtn.disabled = false;
    elements.nextBtn.disabled = false;
    elements.dropBox.innerHTML = "<p class='hint'>문장을 완성하세요</p>";

    loadRandomQuestion();

    // 타이머 시작
    clearInterval(state.timerId);
    state.timerId = setInterval(() => {
        state.timeLeft--;
        elements.timerText.innerText = state.timeLeft;

        if (state.timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame(force = false) {
    state.isPlaying = false;
    clearInterval(state.timerId);

    elements.startBtn.innerText = "GAME START";
    elements.startBtn.classList.remove("playing");
    elements.checkBtn.disabled = true;
    elements.nextBtn.disabled = true;
    
    // 게임판 초기화
    elements.korSentence.innerText = force ? "게임이 중단되었습니다." : "Time Over! 게임 종료";
    elements.wordBox.innerHTML = "";
    elements.dropBox.innerHTML = "<p class='hint'>Game Start를 눌러주세요</p>";

    if (!force) {
        saveScore();
        alert(`게임 종료! 최종 점수: ${state.score}점`);
    }
}

function loadRandomQuestion() {
    if (!state.isPlaying) return;

    const index = Math.floor(Math.random() * state.questions.length);
    state.currentQuestion = state.questions[index];
    renderQuestion();
}

function renderQuestion() {
    elements.korSentence.innerText = state.currentQuestion.kor;
    elements.wordBox.innerHTML = "";
    elements.dropBox.innerHTML = "<p class='hint'>문장을 완성하세요</p>";
    elements.app.className = "app"; // 효과 초기화

    const shuffled = [...state.currentQuestion.words].sort(() => Math.random() - 0.5);

    shuffled.forEach(wordText => {
        const wordEl = createWordElement(wordText);
        elements.wordBox.appendChild(wordEl);
    });
}

function checkAnswer() {
    if (!state.isPlaying) return;

    const words = [...elements.dropBox.querySelectorAll(".word")];
    const userSentence = words.map(w => w.innerText).join(" ");

    if (userSentence === state.currentQuestion.eng) {
        state.score += 10;
        showFeedback("correct");
    } else {
        state.score = Math.max(0, state.score - 5);
        showFeedback("wrong");
    }
    updateScoreUI();
}

function updateScoreUI() {
    elements.scoreDisplay.innerText = `Score: ${state.score}`;
}

function showFeedback(type) {
    elements.app.classList.remove("correct", "wrong");
    void elements.app.offsetWidth;
    elements.app.classList.add(type);

    if (type === "correct") {
        setTimeout(loadRandomQuestion, 600);
    } else {
        setTimeout(() => elements.app.classList.remove("wrong"), 600);
    }
}

// 드래그 앤 드롭 헬퍼 (이전 리팩토링 코드 활용)
function createWordElement(text) {
    const div = document.createElement("div");
    div.className = "word";
    div.innerText = text;
    div.draggable = true;
    div.addEventListener("dragstart", () => { state.draggedItem = div; div.classList.add("dragging"); });
    div.addEventListener("dragend", () => { state.draggedItem = null; div.classList.remove("dragging"); checkHint(); });
    div.addEventListener("click", () => {
        (div.parentElement === elements.dropBox ? elements.wordBox : elements.dropBox).appendChild(div);
        checkHint();
    });
    return div;
}

function handleDragOver(e) {
    e.preventDefault();
    if (!state.draggedItem) return;
    const container = e.currentTarget;
    const afterElement = getDragAfterElement(container, e.clientX);
    if (container === elements.dropBox) checkHint(true); // 드래그 중 힌트 숨김
    if (!afterElement) container.appendChild(state.draggedItem);
    else container.insertBefore(state.draggedItem, afterElement);
}

function handleDrop(e) {
    e.preventDefault();
    checkHint();
}

function getDragAfterElement(container, x) {
    const draggables = [...container.querySelectorAll('.word:not(.dragging)')];
    return draggables.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - (box.left + box.width / 2);
        if (offset < 0 && offset > closest.offset) return { offset: offset, element: child };
        else return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function checkHint(forceHide = false) {
    const hint = elements.dropBox.querySelector(".hint");
    const hasWords = elements.dropBox.querySelectorAll(".word").length > 0;
    
    if (!hint && !hasWords) {
        elements.dropBox.innerHTML = "<p class='hint'>문장을 완성하세요</p>";
    } else if (hint) {
        hint.style.display = (hasWords || forceHide) ? "none" : "block";
    }
}


/* =========================================
   4. 사용자 관리 (로그인, 회원가입, 랭킹) - LocalStorage
   ========================================= */

// 로컬스토리지 키: 'english_game_users', 'english_game_current_user'

function getUsers() {
    return JSON.parse(localStorage.getItem('english_game_users') || "[]");
}

function saveUsers(users) {
    localStorage.setItem('english_game_users', JSON.stringify(users));
}

function checkLoginStatus() {
    const current = JSON.parse(localStorage.getItem('english_game_current_user'));
    if (current) {
        state.currentUser = current;
        elements.userNameDisplay.innerText = `User: ${current.name}`;
        // 로그인 한 유저가 최고 점수가 있으면 표시
        const bestScore = current.maxScore || 0;// 없으면 0
        elements.bestScoreDisplay.innerText = `(Best: ${bestScore})`;
        elements.bestScoreDisplay.style.display = "inline";

        elements.menuItems.login.classList.add("hidden");
        elements.menuItems.signup.classList.add("hidden");
        elements.menuItems.logout.classList.remove("hidden");
    } else {
        // 비 로그인 상태
        elements.userNameDisplay.innerText = `User: Guest`;
        // Guest일 땐 최고 점수 숨김
        elements.bestScoreDisplay.style.display = "none";

        elements.menuItems.login.classList.remove("hidden");
        elements.menuItems.signup.classList.remove("hidden");
        elements.menuItems.logout.classList.add("hidden");
    }
}

function logout() {
    // 유저 정보 삭제
    localStorage.removeItem('english_game_current_user');
    state.currentUser = null;

    // 점수 및 게임 상태 초기화
    state.score = 0;
    updateScoreUI(); // 화면 점수 0으로 갱신

    if (state.isPlaying) {
        endGame(true);
    }

    checkLoginStatus();
    elements.dropdown.classList.add("hidden");
    alert("로그아웃 되었습니다.");
}

function saveScore() {
    if (!state.currentUser) return; // 게스트는 저장 안 함

    const users = getUsers();
    const target = users.find(u => u.id === state.currentUser.id);
    
    if (target) {
        // 기존 최고 점수보다 높으면 갱신
        if (state.score > (target.maxScore || 0)) {
            target.maxScore = state.score;
            saveUsers(users);
            // 현재 유저 정보도 갱신
            state.currentUser.maxScore = state.score;
            localStorage.setItem('english_game_current_user', JSON.stringify(state.currentUser));
            
            elements.bestScoreDisplay.innerText = `(Best: ${state.score})`;
            alert("축하합니다! 최고 기록 갱신!");
        }
    }
}

// --- 모달 관련 기능 ---
function closeModal() {
    elements.modalOverlay.classList.add("hidden");
}

function showLoginModal() {
    elements.dropdown.classList.add("hidden");
    elements.modalTitle.innerText = "로그인";
    elements.modalBody.innerHTML = `
        <input type="text" id="loginId" class="modal-input" placeholder="아이디">
        <input type="password" id="loginPw" class="modal-input" placeholder="비밀번호">
        <button onclick="processLogin()" class="modal-btn">로그인</button>
    `;
    elements.modalOverlay.classList.remove("hidden");
}

window.processLogin = function() {
    const id = document.querySelector("#loginId").value;
    const pw = document.querySelector("#loginPw").value;
    const users = getUsers();
    const user = users.find(u => u.id === id && u.pw === pw);

    if (user) {
        localStorage.setItem('english_game_current_user', JSON.stringify(user));

        // 로그인 성공 시 점수 초기화
        state.score = 0;
        updateScoreUI();

        checkLoginStatus();
        closeModal();
        alert(`${user.name}님 환영합니다!`);
    } else {
        alert("아이디 또는 비밀번호가 잘못되었습니다.");
    }
};

function showSignupModal() {
    elements.dropdown.classList.add("hidden");
    elements.modalTitle.innerText = "회원가입";
    elements.modalBody.innerHTML = `
        <input type="text" id="joinId" class="modal-input" placeholder="아이디">
        <input type="password" id="joinPw" class="modal-input" placeholder="비밀번호">
        <input type="text" id="joinName" class="modal-input" placeholder="닉네임">
        <button onclick="processSignup()" class="modal-btn">가입하기</button>
    `;
    elements.modalOverlay.classList.remove("hidden");
}

window.processSignup = function() {
    const id = document.querySelector("#joinId").value;
    const pw = document.querySelector("#joinPw").value;
    const name = document.querySelector("#joinName").value;

    if (!id || !pw || !name) return alert("모든 정보를 입력하세요.");

    const users = getUsers();
    if (users.find(u => u.id === id)) return alert("이미 존재하는 아이디입니다.");

    users.push({ id, pw, name, maxScore: 0 });
    saveUsers(users);
    alert("가입 완료! 로그인 해주세요.");
    closeModal();
};

function showRankingModal() {
    elements.dropdown.classList.add("hidden");
    elements.modalTitle.innerText = "랭킹 (Top 5)";
    
    const users = getUsers();
    // 점수 내림차순 정렬
    const sorted = users.sort((a, b) => (b.maxScore || 0) - (a.maxScore || 0)).slice(0, 5);
    
    let html = `
        <table class="rank-table">
            <tr><th>순위</th><th>이름</th><th>점수</th></tr>
    `;
    
    sorted.forEach((u, i) => {
        html += `<tr><td>${i+1}</td><td>${u.name}</td><td>${u.maxScore || 0}</td></tr>`;
    });
    
    if(sorted.length === 0) html += `<tr><td colspan="3">데이터가 없습니다.</td></tr>`;
    
    html += `</table>`;
    
    elements.modalBody.innerHTML = html;
    elements.modalOverlay.classList.remove("hidden");
}

function showGuideModal() {
    elements.dropdown.classList.add("hidden");
    elements.modalTitle.innerText = "이용 안내";
    elements.modalBody.innerHTML = `
        <p style="font-size:14px; color:#555; line-height:1.6;">
            1. <strong>로그인</strong> 후 게임을 진행하면 점수가 저장됩니다.<br>
            2. <strong>GAME START</strong>를 누르면 60초가 카운트됩니다.<br>
            3. 단어를 올바른 순서로 배열하고 <strong>Check</strong>를 누르세요.<br>
            4. 정답 시 +10점, 오답 시 -5점입니다.
        </p>
    `;
    elements.modalOverlay.classList.remove("hidden");
}

// 실행
init();