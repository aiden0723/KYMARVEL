
let currentUser = "";
let currentPosition = 1;
let laps = 0;
let steps = 0;
const adminIDs = ["admin", "administrator"];
const API_URL = "https://script.google.com/macros/s/AKfycbwgB-jINaqh8e_52YYXWBS_Mc9-dI3oV-qAchFAaXjlifTM27NfV7ZlKz_U5EtgELN6/exec";

function login() {
  const input = document.getElementById("userId").value.trim().toLowerCase();
  if (!input) {
    alert("ID를 입력하세요.");
    return;
  }
  currentUser = input;

  fetch(API_URL + "?id=" + currentUser)
    .then(res => res.json())
    .then(data => {
      if (data === "NOT_FOUND") {
        alert("시트에서 조를 찾을 수 없습니다. 다시 확인해 주세요.");
        return;
      }
      currentPosition = Number(data.position) || 1;
      steps = Number(data.steps) || 0;
      laps = Number(data.laps) || 0;

      document.getElementById("loginSection").style.display = "none";
      document.getElementById("preRollSection").style.display = "block";
      updateBoard();
      fetchRanking();
    })
    .catch(err => {
      console.error("불러오기 실패:", err);
      alert("조 정보 불러오기에 실패했습니다.");
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
  const diceImg = document.getElementById("diceImg");
  const rollBtn = document.getElementById("rollBtn");
  rollBtn.disabled = true;

  const sequence = [1, 2, 3];
  let i = 0;
  let delay = 60;

  function animateDice() {
    diceImg.src = `주사위${sequence[i % sequence.length]}.jpg`;
    i++;
    delay += 20;
    if (i < 15) {
      setTimeout(animateDice, delay);
    } else {
      const finalRoll = Math.floor(Math.random() * 3) + 1;
      diceImg.src = `주사위${finalRoll}.jpg`;
      diceImg.style.transform = "scale(1.3)";
      setTimeout(() => {
        diceImg.style.transform = "scale(1)";
        moveToken(finalRoll);
      }, 500);
    }
  }

  animateDice();
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
      afterMove(currentPosition, roll);
    }
  }, 300);
}

function afterMove(pos, roll) {
  steps += roll;

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

  updateBoard();
  saveToSheet();
  fetchRanking();
  document.getElementById("gameSection").style.display = "none";
  document.getElementById("preRollSection").style.display = "block";
}

function saveToSheet() {
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      id: currentUser,
      position: currentPosition,
      steps: steps,
      laps: laps
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(res => res.text())
  .then(msg => console.log("✅ 구글 시트 저장:", msg))
  .catch(err => console.error("❌ 저장 오류:", err));
}

function fetchRanking() {
  fetch(API_URL)
    .then(res => res.text())
    .then(raw => {
      try {
        const data = JSON.parse(raw);
        const container = document.getElementById("rankingBoard");
        container.innerHTML = "<h3>🏁 랭킹</h3>";
        const sorted = data.filter(d => d.id).sort((a, b) => {
          if (b.laps !== a.laps) return b.laps - a.laps;
          return b.steps - a.steps;
        });
        sorted.forEach((team, idx) => {
          const row = document.createElement("div");
          row.textContent = `${idx + 1}위: ${team.id} (${team.laps}바퀴, ${team.steps}칸)`;
          container.appendChild(row);
        });
      } catch (err) {
        console.error("랭킹 불러오기 실패 (형식 오류):", raw);
      }
    })
    .catch(err => console.error("랭킹 fetch 실패:", err));
}
