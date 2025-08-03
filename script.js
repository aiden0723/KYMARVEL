
const API_URL = "https://script.google.com/macros/s/AKfycbxVRjQOlvsl6bUk_HJlf8Z3vi3KmHnNnw_fN4rmR96Z0OE1KAwZ2fS07AcN_BRC98iIEw/exec";
let currentId = "";
let currentStep = 0;
let currentLap = 0;
let currentPos = 1;
const diceCodes = {{"admin": "0723"}};
const usedCodes = {{}};
const missions = {{
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
}};

// 이하 동일 코드
