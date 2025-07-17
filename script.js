let currentUser = "";
let currentPosition = 1;
let laps = 0;
let steps = 0;
const adminIDs = ["admin", "administrator"];

const missions = {
  2: "자기소개서 만들고 공유",
  3: "깜짝 랜덤 퀴즈 -고대편-",
  4: "뒤로 1칸",
  5: "서로 인스타 팔로우하기",
  6: "맛집 방문 -신촌-",
  7: "깜짝 랜덤 미션 -연대편-",
  8: "영화 관람",
  9: "볼링 치기",
  10: "앞으로 3칸",
  11: "전시회 방문",
  12: "원데이 클래스 수강하기",
  13: "깜짝 랜덤 미션 -빠르게 암산-",
  14: "전시회 방문",
  15: "캠퍼스 투어 -신촌-",
  16: "느좋 카페 방문",
  17: "맛집 방문 -안암-",
  18: "스포츠 직관",
  19: "캠퍼스 투어 -안암-",
  20: "피크닉 가기",
  21: "앞으로 1칸",
  22: "술 한잔 하기",
  23: "뒤로 1칸",
  24: "노래방 가기"
};

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
  document.getElementById("rollBtn").disabled = false;
}

function rollDice() {
  const diceImg = document.getElementById("diceImg");
  const rollBtn = document.getElementById("rollBtn");
  rollBtn.disabled = true;
  const sequence = [1, 2, 3, 2, 1, 3, 2, 1];
  let i = 0;
  const interval = setInterval(() => {
    diceImg.src = `주사위${sequence[i % sequence.length]}.jpg`;
    i++;
    if (i >= 12) {
      clearInterval(interval);
      const roll = Math.floor(Math.random() * 3) + 1;
      diceImg.src = `주사위${roll}.jpg`;
      diceImg.style.border = "5px solid yellow";
      setTimeout(() => {
        diceImg.style.border = "none";
        moveToken(roll);
      }, 500);
    }
  }, 80);
}

function moveToken(roll) {
  let path = [];
  let temp = currentPosition;
  for (let j = 1; j <= roll; j++) {
    let step = temp + 1;
    if (step > 24) step = 1;
    path.push(step);
    temp = step;
  }

  let k = 0;
  const stepInterval = setInterval(() => {
    currentPosition = path[k];
    document.getElementById("boardImg").src = `판${currentPosition}.png`;
    k++;
    if (k >= path.length) {
      clearInterval(stepInterval);
      afterMove(currentPosition);
    }
  }, 300);
}

function afterMove(pos) {
  steps += 1;
  if (pos === 4 || pos === 23) {
    currentPosition -= 1;
    if (currentPosition <= 0) currentPosition = 24;
  }
  if (pos === 10) {
    currentPosition += 3;
    if (currentPosition > 24) currentPosition -= 24;
  }
  if (pos === 21) {
    currentPosition += 1;
    if (currentPosition > 24) currentPosition -= 24;
  }

  if (currentPosition === 1 && steps > 0) {
    laps += 1;
  }

  localStorage.setItem("marble_" + currentUser, JSON.stringify({
    position: currentPosition,
    laps: laps,
    steps: steps
  }));

  updateBoard();
  document.getElementById("gameSection").style.display = "none";
  document.getElementById("preRollSection").style.display = "block";

  if (missions[currentPosition]) {
    setTimeout(() => {
      alert(`📍미션 도착!
${missions[currentPosition]}`);
    }, 300);
  }
}
