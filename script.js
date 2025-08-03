
const API_URL = "https://script.google.com/macros/s/AKfycbxVRjQOlvsl6bUk_HJlf8Z3vi3KmHnNnw_fN4rmR96Z0OE1KAwZ2fS07AcN_BRC98iIEw/exec";
let currentId = "";
let currentStep = 0;
let currentLap = 0;
let currentPos = 1;
const diceCodes = {"admin": "0723"};
const usedCodes = {};
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
  const id = document.getElementById("idInput").value.trim();
  if (!id) return alert("ID를 입력해주세요.");
  fetch(API_URL + "?id=" + id)
    .then(res => res.json())
    .then(data => {
      currentId = id;
      currentPos = Number(data.position) || 1;
      currentStep = Number(data.steps) || 0;
      currentLap = Number(data.laps) || 0;
      document.getElementById("loginSection").style.display = "none";
      document.getElementById("preRollSection").style.display = "block";
      updateBoard();
      loadRanking();
    })
    .catch(() => alert("로그인 실패 또는 ID 불일치"));
}

function updateBoard() {
  const board = document.getElementById("boardArea");
  board.innerHTML = "<img src='판" + currentPos + ".png'>";
  document.getElementById("lapInfo").innerText = "현재 " + currentLap + "바퀴째 진행 중";
  document.getElementById("stepInfo").innerText = "현재 이동한 칸 수: " + currentStep + "칸";
}

function showCodeInput() {
  document.getElementById("codeSection").style.display = "block";
}

function verifyCode() {
  const code = document.getElementById("codeInput").value;
  if ((currentId === "admin" && code === "0723") || (!usedCodes[currentId] && code === "1234")) {
    usedCodes[currentId] = true;
    document.getElementById("codeSection").style.display = "none";
    rollDice();
  } else {
    alert("인증 코드 오류 또는 이미 사용됨");
  }
}

function rollDice() {
  document.getElementById("preRollSection").style.display = "none";
  document.getElementById("gameSection").style.display = "block";
  const dice = document.getElementById("diceDisplay");
  let seq = [1,2,3,2,1,3,2,1];
  let i = 0;
  const interval = setInterval(() => {
    dice.innerHTML = "<img src='주사위" + seq[i] + ".jpg' style='width:80px;'>";
    i++;
    if (i === seq.length) {
      const final = Math.ceil(Math.random() * 3);
      dice.innerHTML = "<img src='주사위" + final + ".jpg' style='width:100px;'>";
      clearInterval(interval);
      move(final);
    }
  }, 150);
}

function move(num) {
  let path = [];
  for (let i = 1; i <= num; i++) {
    const next = ((currentPos + i - 1) % 24) + 1;
    path.push(next);
  }
  let idx = 0;
  const board = document.getElementById("boardArea");
  const timer = setInterval(() => {
    board.innerHTML = "<img src='판" + path[idx] + ".png'>";
    idx++;
    if (idx === path.length) {
      clearInterval(timer);
      currentPos = path[idx - 1];
      currentStep += num;
      if (currentPos < (currentPos - num)) currentLap++;
      updateBoard();
      showMission();
      saveToSheet();
    }
  }, 300);
}

function showMission() {
  const mission = document.getElementById("mission");
  mission.innerText = missions[currentPos] || "";
}

function saveToSheet() {
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({contents: JSON.stringify({
      id: currentId,
      position: currentPos,
      steps: currentStep,
      laps: currentLap
    })})
  });
}

function loadRanking() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      let rank = data.sort((a,b) => b.steps - a.steps);
      let html = "<h3>🏆 조별 랭킹</h3><ol>";
      rank.forEach(r => {
        html += "<li>" + r.id + ": " + r.steps + "칸</li>";
      });
      html += "</ol>";
      document.getElementById("rankingBoard").innerHTML = html;
    });
}
