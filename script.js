
let currentUser = "";
let currentPosition = 1;
let laps = 0;
let steps = 0;

function login() {
  const input = document.getElementById("userId").value.trim().toLowerCase();
  if (!input) {
    alert("ID를 입력하세요.");
    return;
  }
  currentUser = input;
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
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("preRollSection").style.display = "block";
  updateBoard();
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
    allowRolling();
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
  currentPosition += roll;
  if (currentPosition > 24) currentPosition -= 24;
  steps += roll;
  if (currentPosition === 1 && steps > 0) laps++;
  localStorage.setItem("marble_" + currentUser, JSON.stringify({
    position: currentPosition,
    laps: laps,
    steps: steps
  }));
  setTimeout(() => {
    document.getElementById("gameSection").style.display = "none";
    document.getElementById("preRollSection").style.display = "block";
    updateBoard();
  }, 1000);
}
