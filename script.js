let currentUser = "";
let currentPosition = 1;
let laps = 0;
const usedCodes = new Set();

const adminAliases = ["admin", "administrator"];
const adminCode = "0723";
const oneTimeCodes = ["1234", "5678", "9999"];

let lapRecords = {};

function login() {
    const id = document.getElementById("userId").value.trim().toLowerCase();
    if (id === "") {
        alert("아이디를 입력하세요.");
        return;
    }
    currentUser = id;
    if (!(currentUser in lapRecords)) {
        lapRecords[currentUser] = 0;
    }
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("codeSection").style.display = "block";
}

function checkCode() {
    const code = document.getElementById("authCode").value.trim();
    if (code === "") {
        alert("코드를 입력하세요.");
        return;
    }

    if (code === adminCode) {
        if (adminAliases.includes(currentUser)) {
            unlockDice();
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
            unlockDice();
        }
    } else {
        alert("유효하지 않은 코드입니다.");
    }
}

function unlockDice() {
    alert("인증 성공! 주사위를 굴릴 수 있습니다.");
    document.getElementById("codeSection").style.display = "none";
    document.getElementById("gameSection").style.display = "block";
    document.getElementById("rollBtn").disabled = false;
}

function rollDice() {
    const roll = Math.floor(Math.random() * 3) + 1;
    document.getElementById("diceImg").src = `주사위${roll}.jpg`;

    let newPosition = currentPosition + roll;
    if (newPosition > 24) {
        newPosition = newPosition % 24;
        if (newPosition === 0) newPosition = 24;
        laps += 1;
        lapRecords[currentUser] = laps;
        updateRanking();
    }
    currentPosition = newPosition;

    document.getElementById("boardImg").src = `판${currentPosition}.png`;
    document.getElementById("lapCounter").textContent = `현재 ${laps}바퀴째 진행 중`;

    // 주사위는 1회만
    document.getElementById("rollBtn").disabled = true;
}

function updateRanking() {
    const list = document.getElementById("rankingList");
    const sorted = Object.entries(lapRecords).sort((a, b) => b[1] - a[1]);
    list.innerHTML = "";
    sorted.forEach(([user, count], index) => {
        const item = document.createElement("li");
        item.textContent = `${index + 1}위: ${user} - ${count}바퀴`;
        list.appendChild(item);
    });
}
