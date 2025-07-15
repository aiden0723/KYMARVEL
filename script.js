let currentUser = "";
let currentPosition = 1;
let laps = 0;
let steps = 0;
const API_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"; // <-- 교체 필요
const adminIDs = ["admin", "administrator"];

function login() {
  const input = document.getElementById("userId").value.trim().toLowerCase();
  if (!input) {
    alert("ID를 입력하세요.");
    return;
  }
  currentUser = input;

  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const found = data.find(d => d.id === currentUser);
      if (found) {
        currentPosition = parseInt(found.position);
        laps = parseInt(found.laps);
        steps = parseInt(found.steps);
      } else {
        currentPosition = 1;
        laps = 0;
        steps = 0;
      }

      document.getElementById("loginSection").style.display = "none";
      document.getElementById("preRollSection").style.display = "block";
      updateBoard();
    });
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
  if (code === "0723") {
    if (adminIDs.includes(currentUser)) {
      allowRolling();
    } else {
      alert("이 코드는 관리자만 사용할 수 있습니다.");
    }
  } else {
    alert("잘못된 코드입니다.");
  }
}

function allowRolling() {
  document.getElementById("codeSection").style.display = "none";
  document.getElementById("gameSection").style.display = "block";
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

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      id: currentUser,
      position: currentPosition,
      laps: laps,
      steps: steps
    }),
    headers: { "Content-Type": "application/json" }
  });

  // 결과 반영 후 다시 판으로
  setTimeout(() => {
    document.getElementById("gameSection").style.display = "none";
    document.getElementById("preRollSection").style.display = "block";
    updateBoard();
  }, 1000);
}
