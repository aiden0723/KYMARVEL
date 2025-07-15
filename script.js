let currentUser = "";
let currentPosition = 1;
let laps = 0;
let steps = 0;
const usedCodes = new Set();

const adminAliases = ["admin", "administrator"];
const adminCode = "0723";
const oneTimeCodes = ["1234", "5678", "9999"];

let lapRecords = {};  // 조별 랩 기록
let stepRecords = {}; // 조별 칸 수 기록

function login() {
    const id = document.getElementById("userId").value.trim().toLowerCase();
    if (!id) {
        alert("아이디를 입력하세요.");
        return;
    }
    currentUser = id;

    // 데이터 불러오기
    const saved = JSON.parse(localStorage.getItem("marble_" + currentUser));
    if (saved) {
        currentPosition = saved.position;
        laps = saved.laps;
        steps = saved.steps;
    } else {
        currentPosition = 1;
        laps = 0;
        steps = 0;
    }

    lapRecords[currentUser] = laps;
    stepRecords[currentUser] = steps;

    updateBoard();
    updateRanking();

    document.getElementById("loginSection").style.display = "none";
    document.getElementById("preRollSection").style.display = "block";
}

function updateBoard() {
    document.getElementById("boardImg").src = `판${currentPosition}.png`;
    document.getElementById("lapCounter").textContent = `현재 ${laps}바퀴째 진행 중`;
    document.getElementById("stepCounter").textContent = `현재 이동한 칸 수: ${steps}칸`;
}

function showAuthCode() {
    document.getElementById("preRollSection").style.display = "none";
    document.getElementById("codeSection").style.display = "block";
}

function checkCode() {
    const code = document.getElementById("authCode").value.trim();
    if (!code) {
        alert("코드를 입력하세요.");
        return;
    }

    if (code === adminCode) {
        if (adminAliases.includes(currentUser)) {
            allowRolling();
        } else {
            alert("이 코드는 관리자만 사용할 수 있습니다.");
        }
        return;
    }

    if (oneTimeCodes.includes(code)) {
        if (usedCodes.has(code)) {
            alert("이 코드는 이미 사용되었습니다.");
        } else {
            usedCodes.add(code);
            allowRolling();
        }
    } else {
        alert("유효하지 않은 코드입니다.");
    }
}

function allowRolling() {
    alert("인증 성공! 주사위를 굴릴 수 있습니다.");
    document.getElementById("codeSection").style.display = "none";
    document.getElementById("gameSection").style.display = "block";
    document.getElementById("rollBtn").disabled = false;
}

function rollDice() {
    const roll = Math.floor(Math.random() * 3) + 1;
    document.getElementById("diceImg").src = `주사위${roll}.jpg`;

    steps += roll;

    let newPosition = currentPosition + roll;
    if (newPosition > 24) {
        newPosition = newPosition % 24;
        if (newPosition === 0) newPosition = 24;
        laps += 1;
    }
    currentPosition = newPosition;

    lapRecords[currentUser] = laps;
    stepRecords[currentUser] = steps;
    saveState();

    updateBoard();
    updateRanking();
    document.getElementById("rollBtn").disabled = true;
}

function updateRanking() {
    const list = document.getElementById("rankingList");
    const sorted = Object.entries(lapRecords).sort((a, b) => b[1] - a[1]);
    list.innerHTML = "";
    sorted.forEach(([user, lap], index) => {
        const steps = stepRecords[user] || 0;
        const item = document.createElement("li");
        item.textContent = `${index + 1}위: ${user} - ${lap}바퀴, ${steps}칸`;
        list.appendChild(item);
    });
}

function saveState() {
    const data = {
        position: currentPosition,
        laps: laps,
        steps: steps
    };
    localStorage.setItem("marble_" + currentUser, JSON.stringify(data));
}
