export const characters = [
  { id: "minjae", name: "김민재", initials: "MJ" },
  { id: "harin", name: "윤하린", initials: "HR" },
  { id: "jihoon", name: "박지훈", initials: "JH" },
  { id: "mom", name: "엄마", initials: "엄마" },
  { id: "project", name: "PROJECT N", initials: "PN" },
  { id: "unknown", name: "UNKNOWN", initials: "?" },
];
export const evidence: Record<
  string,
  { title: string; category: string; body: string; related: string[] }
> = {
  minjae_witness:{title:'다른 약속을 기다리던 서준',category:'Messages',body:'민재는 서준이 다른 누군가를 기다리는 것 같았다고 말했다. 목격 진술이며 상대의 신원은 아직 확인되지 않았다.',related:['receipt_2247','minjae_chat']},
  harin_warning:{title:'하린이 보관한 대화',category:'Messages',body:'서준: 나 뭐 잘못 건드린 거 같다. 혹시 갑자기 연락 안 되면… / 하린이 캡처를 전달했다.',related:['project_n','delivery']},
  automation_admission:{title:'지훈의 자동화 언급',category:'Messages',body:'지훈은 계정 자동화 쪽은 자신이 만들었다고 말했다. 어떤 목적의 프로그램인지는 추가 확인이 필요하다.',related:['project_n','jihoon_payment']},
  journalist_analysis:{title:'기자의 계정 비교',category:'Documents',body:'같은 계정 군집이 여러 업체의 공격성 리뷰에 반복 등장했다. 원본의 동시 게시 시각과 대조된다.',related:['project_n','journalist']},
  jihoon_confession:{title:'지훈의 자백',category:'Messages',body:'지훈이 서준에게 발생한 사고를 인정하고 청운물류 B동 지하 계단을 언급했다.',related:['final_audio','hidden_location','jihoon_payment']},
  first_project: {
    title: "첫 프로젝트의 이름",
    category: "Documents",
    body: "2026년 해커톤 사진의 발표 제목은 ORBIT. 잠긴 폴더의 힌트인 ‘처음 만들었던 것’과 연결된다.",
    related: ["project_n"],
  },
  back_entrance: {
    title: "카페 옆 표지판",
    category: "Locations",
    body: "22:46 사진. BLUE ROOM 옆 표지판은 청운물류 B동의 야간 출입 계단을 가리킨다.",
    related: ["stair_sign", "hidden_location"],
  },
  transit_record: {
    title: "22:19 교통 이용 내역",
    category: "Timeline",
    body: "민재가 공유한 이용 내역: 청운역 22:09 승차, 솔빛역 22:19 하차. 22:30 귀가와 양립하지만 캡처의 명의만으로 탑승자를 확정할 수는 없다.",
    related: ["minjae_chat", "receipt_2247"],
  },
  stair_sign: {
    title: "23:06 출입구 사진",
    category: "Locations",
    body: "23:06 촬영된 B동 지하 출입구. GPS는 없다. 건물명과 B1 표식이 남아 있다.",
    related: ["back_entrance", "final_audio", "hidden_location"],
  },
  minjae_chat: {
    title: "22:30의 귀가 메시지",
    category: "Messages",
    body: "민재는 BLUE ROOM에서 만나자고 했지만, 22:30에는 집이라고 했다. 서준의 답장은 없다.",
    related: ["receipt_2247", "transit_record"],
  },
  receipt_2247: {
    title: "22:47 영수증",
    category: "Documents",
    body: "BLUE ROOM. 아메리카노와 카페라떼. 10월 15일 22:47 결제. 주문자 이름은 없다.",
    related: ["minjae_chat", "hidden_location"],
  },
  project_n: {
    title: "동일 계정 그룹",
    category: "Documents",
    body: "같은 계정들이 경쟁 가게에 동시에 별점 1점을 부여했다. 가장 먼저 수집된 계정은 nobody_404.",
    related: ["jihoon_payment"],
  },
  journalist: {
    title: "강도윤의 정체",
    category: "People",
    body: "강도윤은 온라인 데이터 범죄를 취재하는 사회부 기자다.",
    related: ["draft_email"],
  },
  draft_email: {
    title: "발송되지 않은 제보",
    category: "Messages",
    body: "서준은 강도윤 기자에게 조작 네트워크 자료를 제보하려 했다. 첨부파일은 evidence.zip.",
    related: ["project_n", "journalist"],
  },
  jihoon_payment: {
    title: "자동화 개발비 송금",
    category: "Documents",
    body: "N Reputation → 박지훈. 개발비 2,400,000원. 협박 사실을 안 뒤에도 운영한 기록이 함께 있다.",
    related: ["project_n", "final_audio"],
  },
  final_audio: {
    title: "마지막 녹음",
    category: "Timeline",
    body: "10월 15일 23:14. 공개를 막으려는 지훈, 백업을 남겼다는 서준. 충돌 이후 녹음이 끝난다.",
    related: ["jihoon_payment", "hidden_location"],
  },
  hidden_location: {
    title: "마지막 위치 기록",
    category: "Locations",
    body: "10월 15일 23:16. BLUE ROOM 뒤편 청운물류 B동 지하 계단. 서준의 노트북으로 자동 동기화된 좌표.",
    related: ["final_audio", "receipt_2247"],
  },
  delivery: {
    title: "예약된 노트북 배송",
    category: "Documents",
    body: "서준이 10월 15일 예약한 배송. 18일까지 취소하지 않으면 친구에게 전달하도록 요청했다.",
    related: ["draft_email"],
  },
};
export const coreEvidence = [
  "receipt_2247",
  "project_n",
  "jihoon_payment",
  "draft_email",
  "final_audio",
  "hidden_location",
];
export const messages: Record<
  string,
  Array<{ who: string; text: string; time: string; date?: string }>
> = {
  minjae: [
    {
      who: "minjae",
      text: "너 그거까지 말한 거야?",
      time: "23:08",
      date: "10월 14일",
    },
    { who: "seojun", text: "아직 이름은 안 말했어", time: "23:09" },
    {
      who: "minjae",
      text: "문자로 할 얘기 아니다. 내일 밤 10시. 예전에 갔던 곳.",
      time: "23:10",
    },
    { who: "seojun", text: "블루룸?", time: "23:10" },
    { who: "minjae", text: "응. 다른 사람한테 말하지 마", time: "23:11" },
    {
      who: "minjae",
      text: "나 먼저 간다. 너 어디야?",
      time: "22:06",
      date: "10월 15일",
    },
    {
      who: "minjae",
      text: "집 왔어. 10시 반인데 아직도 연락이 없냐",
      time: "22:30",
    },
    {
      who: "minjae",
      text: "너 서준이 노트북 가지고 있어?",
      time: "21:32",
      date: "10월 18일",
    },
  ],
  harin: [
    {
      who: "harin",
      text: "책 경비실에 맡겨 놨어",
      time: "18:02",
      date: "10월 13일",
    },
    { who: "seojun", text: "고마워 이번 주에 가져갈게", time: "18:14" },
    { who: "harin", text: "근데 요즘 왜 자꾸 뒤 돌아봐?", time: "18:15" },
    { who: "seojun", text: "프로젝트 때문에 좀 예민해서 그래", time: "18:17" },
    {
      who: "harin",
      text: "우리 처음 만든 거 기억나? ORBIT. 그때는 밤새도 재밌었는데",
      time: "18:20",
    },
  ],
  jihoon: [
    {
      who: "jihoon",
      text: "데이터 정리 끝났어?",
      time: "16:10",
      date: "10월 15일",
    },
    { who: "seojun", text: "확인할 게 남았어", time: "16:12" },
    { who: "jihoon", text: "도착했어?", time: "22:43" },
    { who: "deleted", text: "삭제된 메시지입니다.", time: "22:44" },
    { who: "seojun", text: "10분", time: "22:48" },
    {
      who: "jihoon",
      text: "서준이 찾는 거 도와줄게. 필요한 거 있으면 말해",
      time: "20:10",
      date: "10월 18일",
    },
  ],
  mom: [
    { who: "mom", text: "저녁 집에서 먹어?", time: "18:10", date: "10월 15일" },
    { who: "seojun", text: "친구 만나고 올게. 늦을 수도 있어", time: "18:13" },
    { who: "mom", text: "밥은 챙겨 먹고 다녀", time: "18:14" },
  ],
  project: [
    {
      who: "minjae",
      text: "발표 자료 누가 합침?",
      time: "14:20",
      date: "10월 11일",
    },
    {
      who: "jihoon",
      text: "내가 할게. 데이터는 서준이가 올려줘",
      time: "14:21",
    },
    {
      who: "seojun",
      text: "같은 애들이 6개 가게에 똑같은 리뷰 달았는데",
      time: "14:26",
    },
    { who: "jihoon", text: "광고 계정이겠지. 일단 빼고 돌려", time: "14:27" },
  ],
  unknown: [
    {
      who: "unknown",
      text: "강도윤입니다. 보내신 문의 확인했습니다. 신원 확인이 필요하시면 제 기사 검색해 보셔도 됩니다.",
      time: "12:04",
      date: "10월 15일",
    },
    { who: "seojun", text: "자료 정리해서 메일 드릴게요", time: "12:15" },
  ],
};
export const events = [
  {
    id: "receipt_reply",
    flag: "receiptRestored",
    delay: 5000,
    contact: "minjae",
    text: "그 영수증 사진 어디서 났어? 난 10시 좀 넘어서 나왔어. 서준이는 못 만났고.",
  },
  {
    id: "project_warning",
    flag: "projectUnlocked",
    delay: 7000,
    contact: "jihoon",
    text: "그 폴더 열었어?",
  },
  {
    id: "project_warning_2",
    flag: "projectUnlocked",
    delay: 12000,
    contact: "jihoon",
    text: "공유 폴더 접속 알림이 왔길래. 서준 일 때문이면 괜히 이상한 거 건드리지 마.",
  },
];
export const notes = [
  {
    id: "photo-order",
    title: "사진 시계",
    text: "사진 날짜는 촬영 시각. 영수증에 적힌 건 결제 시각.\n사진 찍는 데 1분 늦었다고 데이터가 틀린 건 아님.\n민재가 보낸 캡처는 원본 촬영자가 내가 아닌 것도 표시해 둘 것.",
  },
  {
    id: "route",
    title: "뒷문",
    text: "카페 정문 닫히면 옆으로 돌아가기.\n사진 두 장을 나란히 보면 이름이 같은 표지판이 있다.\nGPS 없는 사진은 간판이 좌표 대신이다.",
  },
  {
    id: "todo",
    title: "이번 주",
    text: "우유 / 세탁 / 운동\n도서관 책 반납\nUSB 사기\n교수님께 팀플 일정 메일",
  },
  {
    id: "idea",
    title: "처음 만들었던 것",
    text: "폴더 암호를 또 까먹었다.\n처음 만들었던 것. 하린이가 찍어둔 해커톤 사진에 있을 거다.",
  },
  {
    id: "project",
    title: "PROJECT",
    text: "첫 수집 계정을 기준으로 원본 정렬.\n첨부파일 암호 = 우리가 처음 발견한 계정.",
  },
  {
    id: "safety",
    title: "만약 문제가 생기면",
    flag: "zipUnlocked",
    text: "나한테 무슨 일이 생겼다면 Project N을 먼저 확인해.\n삭제된 위치 기록은 휴지통에 남겼어. 지도에 마지막 동기화 지점을 겹쳐 봐.\n노트북은 사흘 뒤 도착하게 해뒀어.",
  },
];
export const searchPages = [
  {
    terms: ["강도윤", "기자"],
    title: "강도윤 · 사회부 기자",
    body: "동림일보 사회부. 데이터 범죄, 온라인 조작 사건을 취재합니다.",
    evidence: "journalist",
  },
  {
    terms: ["review manipulation", "리뷰", "조작"],
    title: "리뷰 조작과 평판 공격",
    body: "조직적인 계정 그룹을 이용한 경쟁 업체 공격. 동일 문장과 동시 게시 시간이 중요한 흔적이다.",
  },
  {
    terms: ["blue room", "블루룸"],
    title: "BLUE ROOM",
    body: "청운로 17, 1층. 12:00–23:00. 뒤편 청운물류 진입로와 연결되어 있습니다.",
  },
  {
    terms: ["도서관"],
    title: "중앙도서관",
    body: "평일 09:00–22:00. 학생증 지참.",
  },
];
export const transcript = [
  ["박지훈", "그냥 지워."],
  ["한서준", "이미 백업했어."],
  ["박지훈", "너 이거 공개하면 나도 끝이야."],
  ["한서준", "그래서 멈추라고 했잖아."],
  ["기록", "[발소리, 충돌음. 녹음 종료]"],
];
export const endings = {
  too_early:{title:'TOO EARLY',body:'자료가 사건을 입증하기 전에 최종 제출을 마쳤다. 추가 원본을 찾는 동안 공유 기록은 삭제됐다. CASE STATUS: OPEN.',message:'No new leads.'},
  he_knows:{title:'HE KNOWS',body:'지훈의 계정이 사라졌다. 이후 출국 기록이 확인되었다. 질문은 남았지만 답할 사람은 연락이 되지 않는다.',message:'This account is unavailable.'},
  the_story:{title:'THE STORY',body:'원본을 바탕으로 조작 업체의 실체가 공개되었다. 서준의 행방을 알리는 후속 보도가 나왔지만 지훈은 이미 도주했다.',message:'진실은 공개됐다. 체포 소식은 없었다.'},
  confession:{title:'CONFESSION',body:'자백 대화와 원본 기록이 함께 전달됐다. 경찰은 청운물류 B동 지하를 수색했고, 사고 현장을 은폐한 지훈을 체포했다.',message:'그가 말한 장소는 기록과 일치했다.'},
  trusted:{title:'YOU TRUSTED HIM',body:'지훈에게 확인을 맡긴 공유 자료가 사라졌다. 복구본을 보존할 기회 대신 그에게 다시 접근했다.',message:'박지훈 · 이제 그만 찾아. 너도 힘들잖아.'},
  bad: {
    title: "WRONG PERSON",
    body: "실종 대학생 사건 수사 장기화. 제출된 기록은 지목된 인물의 책임을 입증하지 못했다.",
    message: "박지훈 · 많이 힘들었겠다.",
  },
  normal: {
    title: "THE TRUTH",
    body: "박지훈이 체포되었다. 조작 업체와의 관계는 드러났지만, 서준의 마지막 행방은 아직 확인되지 않았다.",
    message: "일부 기록은 여전히 노트북 안에 남아 있다.",
  },
  true: {
    title: "LAST SEEN",
    body: "마지막 위치 기록을 따라 수색팀이 청운물류 B동 지하에 도착했다. 계단의 사고 흔적과 은폐된 현장이 발견되었다. 지훈의 진술이 기록과 맞아떨어졌다.",
    message: "한서준 · 여기까지 왔으면 다 찾았겠네. 고맙다.",
  },
};
