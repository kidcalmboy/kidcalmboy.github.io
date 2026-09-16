export interface Photo {
  id: string;
  title: string;
  kind: string;
  date: string;
  location?: string;
  caption: string;
  evidenceId?: string;
  flag?: string;
  inspection?: { label: string; text: string };
}
const daily = [
  "늦은 점심",
  "캠퍼스 산책",
  "도서관 창가",
  "길고양이",
  "자취방 식물",
  "새 키보드",
  "비 온 뒤",
  "아침 커피",
  "하늘",
  "학생회관",
  "과제 끝",
  "막차",
  "동네 서점",
  "강의실",
  "주말 산책",
  "책상 정리",
  "라면",
  "이어폰",
  "야식",
  "골목",
  "노을",
  "버스 정류장",
  "공원",
  "시험 전날",
];
export const photos: Photo[] = [
  {
    id: "harin_chat",
    title: "하린이 보낸 대화",
    kind: "chat",
    date: "2028.10.18",
    caption: "하린이 공유한 서준의 경고 메시지",
    flag: "harinScreenshot",
    evidenceId: "harin_warning",
  },
  {
    id: "orbit",
    title: "첫 해커톤",
    kind: "orbit",
    date: "2026.06.17 · 17:09",
    location: "대학 학생회관",
    caption: "ORBIT — our first little universe. 서준 · 민재 · 하린",
    evidenceId: "first_project",
  },
  {
    id: "entrance",
    title: "IMG_4820.jpg",
    kind: "cafe",
    date: "2028.10.15 · 22:46",
    location: "BLUE ROOM",
    caption: "BLUE ROOM. 뒷문 옆 작은 표지판: 청운물류 B동",
    evidenceId: "back_entrance",
    inspection: {
      label: "표지판 자세히 보기",
      text: "청운물류 B동 → / 야간 출입: 뒤편 계단. 카페 정문과는 다른 방향이다.",
    },
  },
  {
    id: "transit",
    title: "IMG_4794.jpg",
    kind: "transit",
    date: "2028.10.15 · 22:19",
    location: "위치 기록 비활성화",
    caption: "민재가 보낸 교통 이용 내역 캡처. 청운역에서 솔빛역까지.",
    evidenceId: "transit_record",
    inspection: {
      label: "이용 내역 자세히 보기",
      text: "김민재 / 청운역 승차 22:09 → 솔빛역 하차 22:19. 솔빛역은 민재 집 근처다. 캡처만으로 실제 탑승자까지 확정할 수는 없다.",
    },
  },
  {
    id: "stairs",
    title: "IMG_4822.jpg",
    kind: "stairs",
    date: "2028.10.15 · 23:06",
    caption: "청운물류 B동 야간 출입구. 위치 정보는 저장되지 않았다.",
    evidenceId: "stair_sign",
    inspection: {
      label: "출입구 표식 자세히 보기",
      text: "B / B1 / 청운물류. 계단 옆 안내에는 야간 출입구라고 적혀 있다. BLUE ROOM 옆 표지판과 같은 건물명이다.",
    },
  },
  ...daily.map((title, i) => ({
    id: `daily-${i}`,
    title,
    kind: ["city", "coffee", "desk", "plant"][i % 4],
    date: `2028.10.${String(1 + (i % 14)).padStart(2, "0")} · ${12 + (i % 8)}:24`,
    location: i % 3 === 0 ? "성북구" : undefined,
    caption: title,
  })),
  {
    id: "receipt",
    title: "IMG_4821.jpg",
    kind: "receipt",
    date: "2028.10.15 · 22:48",
    location: "BLUE ROOM",
    caption: "22:47에 결제된 영수증. 두 잔의 음료.",
    evidenceId: "receipt_2247",
  },
];
