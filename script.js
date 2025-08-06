const API_URL = "https://corsproxy.io/?https://script.google.com/macros/s/AKfycbxVRjQOlvsl6bUk_HJlf8Z3vi3KmHnNnw_fN4rmR96Z0OE1KAwZ2fS07AcN_BRC98iIEw/exec";

let currentId = "";
let position = 1;
let steps = 0;
let laps = 0;

function login() {
  currentId = document.getElementById("idInput").value.trim();
  if (!currentId) return alert("ID를 입력하세요.");

  fetch(API_URL + "?id=" + currentId)
    .then(res => res.json())
    .then(data => {
      if (data.position) {
        position = parseInt(data.position);
        steps = parseInt(data.steps);
        laps = parseInt(data.laps);
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("gameSection").style.display = "block";
        updateBoard();
      } else {
        alert("로그인 실패 또는 ID 불일치");
      }
    })
    .catch(() => alert("불러오기 실패"));
}

function updateBoard() {
  document.getElementById("board").src = `판${position}.png`;
  document.getElementById("statusText").innerText = `현재 ${laps}바퀴째 진행 중
현재 이동한 칸 수: ${steps}칸`;
  loadRanking();
}

function rollDice() {
  const code = prompt("인증 코드를 입력하세요");
  if (currentId === "admin" && code !== "0723") return alert("인증 실패");
  if (currentId !== "admin" && code !== "1234") return alert("인증 실패");

  let roll = 1 + Math.floor(Math.random() * 3);
  steps += roll;
  let newPos = position + roll;
  if (newPos > 24) {
    laps += 1;
    newPos = newPos % 24;
    if (newPos === 0) newPos = 24;
  }
  position = newPos;

  document.getElementById("diceResult").innerText = `${roll}이(가) 나왔습니다!`;
  document.getElementById("missionText").innerText = getMission(position);
  updateBoard();
  saveToSheet();
}

function getMission(pos) {
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
  return missions[pos] || "자유 미션!";
}

function saveToSheet() {
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      contents: {
        id: currentId,
        position,
        steps,
        laps
      }
    }),
    headers: { "Content-Type": "application/json" }
  });
}

function loadRanking() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      let html = "<h3>🏆 랭킹</h3><ol>";
      data.sort((a, b) => b.steps - a.steps);
      data.forEach(item => {
        html += `<li>${item.id} (${item.steps}칸)</li>`;
      });
      html += "</ol>";
      document.getElementById("rankingBoard").innerHTML = html;
    });
}
