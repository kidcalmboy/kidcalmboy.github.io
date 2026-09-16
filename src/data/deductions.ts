export const deductions = [
  {
    id: "timeline",
    title: "22:30과 22:47",
    requires: ["minjae_chat", "receipt_2247", "transit_record"],
    question: "세 기록으로 확정할 수 있는 범위는?",
    choices: [
      "민재가 22:47에 카페에 있었다.",
      "민재의 귀가 주장과 영수증은 반드시 모순되지는 않는다.",
      "서준은 22:30에 집에 있었다.",
    ],
    answer: 1,
    conclusion:
      "영수증에 주문자 이름은 없다. 귀가 주장과 교통 내역은 양립한다. 누가 음료 두 잔을 주문했는지는 아직 별개의 문제다.",
  },
  {
    id: "route",
    title: "서로 다른 사진, 같은 출입구",
    requires: ["back_entrance", "stair_sign"],
    question: "GPS가 없는 23:06 사진의 장소를 연결하는 것은?",
    choices: [
      "두 사진의 색온도",
      "청운물류 B동이라는 이름과 지하 출입구 표식",
      "사진 파일 번호만",
    ],
    answer: 1,
    conclusion:
      "카페 옆 안내판과 B동 출입구 표식이 일치한다. 지도에서 카페 뒤편의 B동을 비교할 수 있다. 마지막 동기화 기록은 별도로 복원해야 한다.",
  },
];
