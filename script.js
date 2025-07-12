let currentPosition = 0;
let points = 0;

const validCodes = ["123456", "654321", "789123"]; 

function login() {
    const code = document.getElementById('codeInput').value;
    if (validCodes.includes(code)) {
        alert("로그인 성공!");
        document.getElementById('login').style.display = 'none';
        document.getElementById('game').style.display = 'block';
    } else {
        alert("유효하지 않은 코드입니다. 다시 시도하세요.");
    }
}

function rollDice() {
    const roll = Math.floor(Math.random() * 6) + 1;
    document.getElementById('diceImg').src = `https://upload.wikimedia.org/wikipedia/commons/${["1/14/Dice-1-b", "5/5f/Dice-2-b", "2/2c/Dice-3-b", "8/8d/Dice-4-b", "5/55/Dice-5-b", "f/f4/Dice-6-b"][roll-1]}.svg`;
    currentPosition += roll;
    points += 3;
    document.getElementById('position').textContent = `현재 위치: ${currentPosition}`;
    document.getElementById('points').textContent = `포인트: ${points}`;
}
