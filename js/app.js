// 1. 상태 및 DOM 요소 관리
const state = {
    questions: [],
    currentQuestion: null,
    score: 0,
    draggedItem: null // 현재 드래그 중인 요소
};

const elements = {
    dropBox: document.querySelector(".drop-box"),
    wordBox: document.querySelector(".word-box"),
    korSentence: document.querySelector(".kor-sentence"),
    scoreDisplay: document.querySelector(".user-box span:last-child"),
    checkBtn: document.querySelector("#checkBtn"),
    nextBtn: document.querySelector("#nextBtn"),
    app: document.querySelector(".app") // 피드백 효과용
};

// 2. 초기화 및 데이터 로드
function init() {
    fetch("data/questions.json")
        .then(res => res.json())
        .then(data => {
            state.questions = data;
            loadRandomQuestion();
        })
        .catch(err => console.error("데이터 로드 실패:", err));

    bindEvents();
}

// 3. 이벤트 바인딩 (드래그 앤 드롭 포함)
function bindEvents() {
    // Drop Box 이벤트
    elements.dropBox.addEventListener("dragover", handleDragOver);
    elements.dropBox.addEventListener("drop", (e) => handleDrop(e, elements.dropBox));

    // Word Box 이벤트 (다시 되돌려놓기)
    elements.wordBox.addEventListener("dragover", (e) => e.preventDefault());
    elements.wordBox.addEventListener("drop", (e) => handleDrop(e, elements.wordBox));

    // 버튼 이벤트
    elements.nextBtn.addEventListener("click", loadRandomQuestion);
    elements.checkBtn.addEventListener("click", checkAnswer);
}

// 4. 게임 로직
function loadRandomQuestion() {
    if (state.questions.length === 0) return;

    const index = Math.floor(Math.random() * state.questions.length);
    state.currentQuestion = state.questions[index];

    renderQuestion();
}

function renderQuestion() {
    // 한글 문장 표시
    elements.korSentence.innerText = state.currentQuestion.kor;

    // 영역 초기화
    elements.wordBox.innerHTML = "";
    elements.dropBox.innerHTML = "<p class='hint'>여기에 문장을 완성하세요</p>";
    elements.app.className = "app"; // 피드백 클래스 초기화

    // 단어 섞기 및 생성
    const shuffled = [...state.currentQuestion.words].sort(() => Math.random() - 0.5);

    shuffled.forEach(wordText => {
        const wordEl = createWordElement(wordText);
        elements.wordBox.appendChild(wordEl);
    });
}

// 단어 요소 생성 헬퍼 함수
function createWordElement(text) {
    const div = document.createElement("div");
    div.className = "word";
    div.innerText = text;
    div.draggable = true;
    div.style.cursor = "grab";

    // 드래그 시작
    div.addEventListener("dragstart", () => {
        state.draggedItem = div;
        div.classList.add("dragging");
    });

    // 드래그 종료
    div.addEventListener("dragend", () => {
        state.draggedItem = null;
        div.classList.remove("dragging");
        checkHintDisplay(); // 힌트 표시 여부 체크
    });

    // 클릭 시 이동 (UX 편의성)
    div.addEventListener("click", () => {
        if (div.parentElement === elements.dropBox) {
            elements.wordBox.appendChild(div);
        } else {
            elements.dropBox.appendChild(div);
        }
        checkHintDisplay();
    });

    return div;
}

// 5. 드래그 앤 드롭 핵심 로직
function handleDragOver(e) {
    e.preventDefault();
    if (!state.draggedItem) return;

    const container = e.currentTarget;

    // DropBox 내부에서의 정렬 로직 (마우스 위치에 따라 순서 변경)
    if (container === elements.dropBox) {
        const hint = container.querySelector(".hint");
        if (hint) hint.style.display = 'none';
    }

    const afterElement = getDragAfterElement(container, e.clientX);

    if (afterElement == null) {
        // 다음 요소가 없으면 맨 뒤에 붙이기
        container.appendChild(state.draggedItem);
    } else {
        // 다음 요소가 있으면 그 앞에 끼워 넣기
        container.insertBefore(state.draggedItem, afterElement);
    }
}

function handleDrop(e, targetContainer) {
    e.preventDefault();
    
    checkHintDisplay();
}

// 마우스 X 좌표를 기준으로 어떤 요소 앞에 넣을지 계산하는 함수
function getDragAfterElement(container, x) {
    // 드래그 중이 아닌 모든 단어 요소 선택
    const draggableElements = [...container.querySelectorAll('.word:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        // 마우스 X 위치와 요소의 중심 사이의 거리 계산
        const offset = x - (box.left + box.width / 2);
        
        // 마우스가 요소의 왼쪽(음수)에 있으면서 가장 가까운 요소 찾기
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// 힌트 문구 표시/숨김 처리
function checkHintDisplay() {
    const hasWords = elements.dropBox.querySelectorAll(".word").length > 0;
    let hint = elements.dropBox.querySelector(".hint");

    // 힌트 요소가 삭제되었다면 다시 생성 (필요시)
    if (!hint && !hasWords) {
        hint = document.createElement("p");
        hint.className = "hint";
        hint.innerText = "여기에 문장을 완성하세요";
        elements.dropBox.appendChild(hint);
    }

    if (hint) {
        hint.style.display = hasWords ? "none" : "block";
    }
}

// 6. 정답 확인 및 점수 관리
function checkAnswer() {
    // 현재 dropBox에 있는 단어들 수집
    const words = [...elements.dropBox.querySelectorAll(".word")];
    const userSentence = words.map(w => w.innerText).join(" ");

    if (userSentence === state.currentQuestion.eng) {
        state.score += 10; // 점수 체계 변경 (예: 10점)
        showFeedback("correct");
    } else {
        state.score = Math.max(0, state.score - 5); // 0점 미만 방지
        showFeedback("wrong");
    }
    updateScoreUI();
}

function updateScoreUI() {
    elements.scoreDisplay.innerText = `Score : ${state.score}`;
}

function showFeedback(type) {
    elements.app.classList.remove("correct", "wrong");
    void elements.app.offsetWidth; // 리플로우 강제 (애니메이션 재시작용)
    elements.app.classList.add(type);

    if (type === "correct") {
        setTimeout(loadRandomQuestion, 500); // 정답일 때만 다음 문제로
    } else {
        setTimeout(() => {
            elements.app.classList.remove("wrong");
        }, 500);
    }
}

// 실행
init();