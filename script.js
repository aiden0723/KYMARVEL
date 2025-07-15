let currentUser = "";
let currentPosition = 1;
let laps = 0;
const usedCodes = new Set();

const adminID = "administrator";
const adminAliases = ["admin", "administrator"];  // 허용된 로그인 ID
const adminCode = "0723";  // 관리자만 사용 가능
const oneTimeCodes = ["1234", "5678", "9999"];  // 각 조에게 1회 발급된 코드들

function login() {
    const id = document.getElementById("userId").value.trim().toLowerCase();
    if (id === "") {
        alert("아이디를 입력하세요.");
        return;
    }
    currentUser = id;
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("codeSection").style.display = "block";
    console.log("로그인:", id);
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
    const diceUrls = [
        "1/14/Dice-1-b", "5/5f/Dice-2-b", "2/2c/Dice-3-b"
    ];
    document.getElementById("diceImg").src = `https://upload.wikimedia.org/wikipedia/commons/${diceUrls[roll - 1]}.svg`;

    let newPosition = currentPosition + roll;
    if (newPosition > 24) {
        newPosition = newPosition % 24;
        if (newPosition === 0) newPosition = 24;
        laps += 1;
    }
    currentPosition = newPosition;

    document.getElementById("boardImg").src = `images/판${currentPosition}.png`;
    document.getElementById("lapCounter").textContent = `현재 ${laps}바퀴째 진행 중`;
}
