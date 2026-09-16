import {extraDialogues} from './dialogueExtras.ts';
export type Person = {
  id: string;
  handle: string;
  name: string;
  bio: string;
  followers: string;
  following: string[];
  created: string;
  former: string;
  private?: boolean;
  color: string;
};
export const people: Person[] = [
  {
    id: "youna",
    handle: "youna.zip",
    name: "한윤아",
    bio: "패션 / 학교 / 먹는 거\nDM 늦어요",
    followers: "10.4K",
    following: ["gaeun", "hyunwoo", "taejun", "motionlab"],
    created: "2019.11.03",
    former: "youna_daily → youna.zip",
    color: "#b78c81",
  },
  {
    id: "gaeun",
    handle: "gaeun.lee",
    name: "이가은",
    bio: "작은 순간들을 모아서 ☁\n윤아의 대학 친구",
    followers: "826",
    following: ["youna", "taejun", "sera"],
    created: "2020.03.02",
    former: "gaeeun → gaeun.lee",
    color: "#9aaf94",
  },
  {
    id: "hyunwoo",
    handle: "hyunwoo.p",
    name: "박현우",
    bio: "사진은 가끔.\n연락은 DM",
    followers: "480",
    following: ["youna", "taejun", "minsuk"],
    created: "2020.06.17",
    former: "hw_park → hyunwoo.p",
    color: "#8199aa",
  },
  {
    id: "taejun",
    handle: "taejun.frame",
    name: "김태준",
    bio: "Photographer · Seoul\nSTUDIO 17 / booking via DM",
    followers: "3,214",
    following: ["youna", "motionlab", "minsuk"],
    created: "2018.04.20",
    former: "frame_tj → taejun.frame",
    color: "#a28c74",
  },
  {
    id: "ocean",
    handle: "ocean021",
    name: "ocean021",
    bio: "",
    followers: "0",
    following: ["youna", "hyunwoo", "taejun", "minsuk"],
    created: "2028.05.19",
    former: "변경 기록 없음",
    private: true,
    color: "#778d99",
  },
  {
    id: "minsuk",
    handle: "minsuk.j",
    name: "정민석",
    bio: "Founder @motionlab\nBuilding the next creative culture.\nSeoul / everywhere",
    followers: "24.8K",
    following: ["motionlab", "taejun", "youna"],
    created: "2017.08.12",
    former: "jms_ceo → minsuk.j",
    color: "#6d7986",
  },
  {
    id: "motionlab",
    handle: "motionlab",
    name: "MOTIONLAB",
    bio: "New perspectives. New possibilities.\nCreative company / Seoul",
    followers: "18.2K",
    following: ["minsuk", "taejun", "youna"],
    created: "2024.02.01",
    former: "변경 기록 없음",
    color: "#383c47",
  },
  {
    id: "sera",
    handle: "sera.archive",
    name: "서라",
    bio: "지난 작업 기록.\n같은 일을 겪은 분들의 연락을 기다립니다.",
    followers: "1,032",
    following: ["motionlab", "youna"],
    created: "2021.06.12",
    former: "sera_work → sera.archive",
    color: "#b297ac",
  },
];
export const person = (id: string) =>
  people.find((p) => p.id === id) || people[0];
export type Comment = {
  id: string;
  user: string;
  text: string;
  time: string;
  cached?: boolean;
};
export type Post = {
  id: string;
  user: string;
  image: string;
  caption: string;
  date: string;
  location: string;
  likes: number;
  tags: string[];
  comments: Comment[];
  edited?: boolean;
  original?: string;
  fact?: string;
};
const c = (
  id: string,
  user: string,
  text: string,
  time: string,
  cached = false,
): Comment => ({ id, user, text, time, cached });
export const posts: Post[] = [
  {
    id: "last",
    user: "youna",
    image: "sea",
    caption: "잠깐 멀리 좀 다녀올게 🌊\n\n연락 안 돼도 걱정하지 마",
    date: "2028.06.18 · 23:48",
    location: "Location unavailable",
    likes: 1281,
    tags: [],
    edited: true,
    fact: "last",
    comments: [
      c("ocean-comment", "ocean", "결국 갔네", "2028.06.18 23:50"),
      c("hw-call", "hyunwoo", "전화 좀 받아", "2028.06.18 23:50"),
      c("tj-q", "taejun", "?", "2028.06.18 23:52"),
      c("daily1", "gaeun", "어디야? 연락 좀 봐", "2028.06.19 08:14"),
    ],
  },
  {
    id: "usb",
    user: "youna",
    image: "cafe",
    caption: "오후의 작은 보험 ☕",
    date: "2028.05.28 · 15:21",
    location: "Seongsu",
    likes: 642,
    tags: [],
    fact: "usb",
    comments: [
      c("usb-g", "gaeun", "그거 아직도 들고 다니냐 ㅋㅋ", "2028.05.28 15:25"),
      c("usb-y", "youna", "보험임", "2028.05.28 15:27"),
    ],
  },
  {
    id: "birthday",
    user: "youna",
    image: "birthday",
    caption: "벌써 23 🥲\n올해도 살아남았다",
    date: "2027.11.04 · 09:12",
    location: "Home",
    likes: 904,
    tags: ["gaeun"],
    original: "IMG_8291.JPG · Taken November 3, 2027 · 11:52 PM",
    comments: [
      c(
        "bd-g",
        "gaeun",
        "생일 8분 남기고 겨우 도착 ㅋㅋㅋ",
        "2027.11.04 09:16",
      ),
      c("bd-y", "youna", "넌 진짜 내년에 오지마", "2027.11.04 09:18"),
      c("bd-late", "youna", "어제 사진 고르다가 잠듦", "2027.11.04 09:20"),
    ],
  },
  {
    id: "busan-old",
    user: "youna",
    image: "cafe",
    caption:
      "난 바다보다 카페파.\n바람 때문에 10분 컷. 부산에서는 커피만 마실래.",
    date: "2028.02.11 · 16:04",
    location: "Busan",
    likes: 718,
    tags: ["gaeun", "hyunwoo"],
    fact: "sea-dislike",
    comments: [
      c("sea-g", "gaeun", "진짜 사진만 찍고 들어감", "2028.02.11 16:07"),
      c("sea-h", "hyunwoo", "다시는 바다 안 간다며", "2028.02.11 16:15"),
    ],
  },
  {
    id: "campaign",
    user: "motionlab",
    image: "studio",
    caption:
      "SUMMER OBJECTS\nCampaign 2028 · @youna.zip\nPhotography @taejun.frame",
    date: "2028.06.13 · 12:00",
    location: "Seoul",
    likes: 2061,
    tags: ["youna", "taejun"],
    comments: [c("campaign1", "taejun", "작업 기록", "2028.06.13 12:15")],
  },
  {
    id: "fight",
    user: "hyunwoo",
    image: "cafe",
    caption: "그냥 예전 같았으면.",
    date: "2028.04.12 · 22:03",
    location: "Yeonnam",
    likes: 81,
    tags: [],
    comments: [
      c("fight-y", "youna", "제발 좀 그만해", "2028.04.12 22:09"),
      c("fight-h", "hyunwoo", "여기서 이러지 말고 연락 봐", "2028.04.12 22:11"),
    ],
  },
  {
    id: "live",
    user: "taejun",
    image: "studio",
    caption: "STUDIO 17 LIVE\n21:34 — 00:12 · 촬영 아카이브",
    date: "2028.06.18 · 21:34",
    location: "STUDIO 17",
    likes: 214,
    tags: [],
    fact: "live",
    comments: [
      c("live1", "gaeun", "아직 촬영 중?", "2028.06.18 22:54"),
      c("live2", "motionlab", "고생 많아요", "2028.06.18 23:42"),
    ],
  },
  {
    id: "busan",
    user: "minsuk",
    image: "hotel",
    caption: "부산 출장.\n긴 하루.",
    date: "2028.06.18 · 22:58",
    location: "Busan",
    likes: 382,
    tags: [],
    fact: "scheduled",
    comments: [
      c(
        "cache1",
        "taejun",
        "대표님 오늘 서울 행사 아니셨어요?ㅋㅋ",
        "2028.06.18 23:01",
        true,
      ),
      c("cache2", "minsuk", "예약 포스팅입니다 :)", "2028.06.18 23:04", true),
    ],
  },
  {
    id: "desk",
    user: "minsuk",
    image: "desk",
    caption: "A quiet start.\nOffice days.",
    date: "2028.05.22 · 08:21",
    location: "MOTIONLAB",
    likes: 205,
    tags: ["motionlab"],
    comments: [],
  },
  {
    id: "daily",
    user: "gaeun",
    image: "cafe",
    caption: "오늘도 같은 자리.\n밀린 과제와 아이스라테",
    date: "2028.06.17 · 14:10",
    location: "University",
    likes: 121,
    tags: ["youna"],
    comments: [c("daily-y", "youna", "내 자리 맡아줘", "2028.06.17 14:12")],
  },
];
export type Story = {
  id: string;
  user: string;
  time: string;
  image?: string;
  text: string;
  unavailable?: boolean;
  fact?: string;
  replies: { user: string; text: string }[];
};
export const stories: Story[] = [
  {
    id: "cafe-story",
    user: "youna",
    time: "2028.06.18 17:32",
    image: "cafe",
    text: "과제 진짜 끝내버리고 싶다",
    replies: [],
  },
  {
    id: "store",
    user: "youna",
    time: "2028.06.18 19:11",
    image: "cafe",
    text: "가은이랑 잠깐.",
    replies: [],
  },
  {
    id: "taxi",
    user: "youna",
    time: "2028.06.18 20:46",
    text: "하...\n택시 안에서",
    replies: [],
  },
  {
    id: "warning",
    user: "youna",
    time: "2028.06.18 21:17",
    text: "진짜 마지막으로 말한다",
    fact: "story-reply",
    replies: [
      { user: "gaeun", text: "걔 만나러 가는 거야?" },
      { user: "taejun", text: "전화 좀 받아" },
      { user: "hyunwoo", text: "뭐임?" },
    ],
  },
  {
    id: "deleted",
    user: "youna",
    time: "2028.06.18 22:06",
    text: "Story unavailable",
    unavailable: true,
    replies: [
      { user: "taejun", text: "야 이거 내려" },
      { user: "gaeun", text: "너 미쳤어?" },
      { user: "hyunwoo", text: "뭐 하는 거야" },
    ],
  },
  {
    id: "highlight",
    user: "minsuk",
    time: "2028.05.22 08:21",
    image: "desk",
    text: "Office days",
    replies: [],
  },
  {
    id: "gaeun-today",
    user: "gaeun",
    time: "2028.06.20 08:12",
    image: "cafe",
    text: "전화만 기다리는 아침",
    replies: [],
  },
];
export type Article = {
  id: string;
  title: string;
  site: string;
  date: string;
  keys: string[];
  body: string;
  image?: string;
  fact?: string;
  comment?: string;
};
export const articles: Article[] = [
  {
    id: "company",
    title: "MOTIONLAB, 인플루언서 마케팅 시장 빠르게 확대",
    site: "CREATIVE JOURNAL",
    date: "2028.06.02 10:00",
    keys: ["motionlab", "정민석", "브랜드"],
    body: "콘텐츠 기업 MOTIONLAB이 신규 캠페인을 공개했다. 정민석 대표는 창작자와 브랜드의 장기적인 협업을 강조했다. 회사는 촬영과 이미지 라이선스 사업을 운영하고 있다.",
  },
  {
    id: "rights",
    title: "크리에이터 이미지 무단 사용 논란… 계약 범위 둘러싼 분쟁",
    site: "CULTURE REPORT",
    date: "2028.06.14 14:20",
    keys: ["motionlab", "계약", "사진", "무단"],
    body: "촬영 1회에 동의한 이미지가 여러 광고에 반복 사용됐다는 주장이 나왔다. MOTIONLAB 측은 계약 해석의 차이라고 답했다. 일부 크리에이터는 항의 이후 익명 계정으로 연락을 받았다고 말했다.",
    comment: "sera",
  },
  {
    id: "event",
    title: "콘텐츠 기업 관계자, 강남 브랜드 네트워킹 행사 참석",
    site: "SEOUL DAILY",
    date: "2028.06.18 22:33",
    keys: ["정민석", "6월18일", "서울", "행사", "강남"],
    body: "18일 밤 서울 강남에서 콘텐츠 업계 네트워킹 행사가 열렸다. 참석자들은 새로운 캠페인과 창작자 계약에 대해 의견을 나눴다. 사진 제공: 현장 취재팀. 원본 촬영 시각 2028.06.18 21:51.",
    image: "event",
    fact: "seoul",
  },
  {
    id: "sea-source",
    title: "겨울 동해 여행 사진 모음",
    site: "SLOW COAST / 여행 기록",
    date: "2024.08.16 18:30",
    keys: ["동해", "바다", "밤바다", "image:sea"],
    body: "지난겨울 동해에서 찍어 둔 사진들을 여름이 돼서야 정리한다. 밤바다의 작은 불빛이 오래 기억에 남았다. 사진 원본은 2024년 2월 촬영. 이미지 저작자: slowcoast.",
    image: "sea",
    fact: "image-source",
  },
  {
    id: "rescue",
    title: "서울 외곽서 신원 미상 20대 여성 구조",
    site: "LOCAL TODAY",
    date: "2028.06.19 09:10",
    keys: ["신원미상", "신원 미상", "여성 구조", "6월19일", "구조"],
    body: "19일 오전 2시 48분, 서울 외곽 도로 인근에서 신원 미상의 여성이 운전자에게 발견됐다. 휴대전화와 지갑이 없었으며 현재 병원에서 치료 중이다. 경찰은 가족의 연락을 기다리고 있다.",
    fact: "rescue",
  },
  {
    id: "office",
    title: "MOTIONLAB OLD OFFICE · 이전한 장소",
    site: "NORTH PLACES",
    date: "2028.03.02",
    keys: ["old office", "구 사무실", "motionlab old"],
    body: "서울 성북구 청운로 17. 이전 완료 · 방문 전 확인 필요. 건물 후면 계단을 통해 지하 사무실로 연결됩니다. 현재 공식 영업시간이 없습니다.",
    fact: "office-location",
  },
];
export const emails = [
  {
    id: "sister",
    from: "한유진",
    subject: "윤아 계정, 확인해 줄 수 있어?",
    date: "6월 20일 08:42",
    private: false,
    body: "어제 실종 신고했어. 경찰에서 최근 메시지 같은 걸 확인할 수 있으면 좋겠대. 너라면 윤아가 자주 쓰는 걸 알까 싶어서. 네 계정에서는 공개 게시물을 볼 수 있을 거야.\n\n개인적으로 용의자를 만나지는 말아 줘. 자료가 모이면 이 메일에 답장해 줘.",
  },
  {
    id: "memory",
    from: "You · 보관된 대화",
    subject: "오래된 대화",
    date: "2027년 12월",
    private: false,
    body: "윤아: 난 비밀번호 기억하기 귀찮아서 그냥 안 까먹는 걸로 해놓음 ㅋㅋ\nYou: 뭔데\n윤아: 맞춰봐",
  },
  {
    id: "login",
    from: "MOMENT Security",
    subject: "New login detected",
    date: "6월 20일 08:43",
    private: true,
    body: "NOVA Browser에서 새 로그인이 감지되었습니다. 계정 @youna.zip. 이전 모바일 세션: 6월 18일 23:43 — 윤아의 휴대전화. 이 기록은 실제 단말을 조작한 사람의 신원을 보증하지 않습니다.",
    fact: "login-log",
  },
  {
    id: "contract",
    from: "MOTIONLAB",
    subject: "Content Usage Agreement",
    date: "6월 11일 10:30",
    private: true,
    body: "촬영 자료 사용 범위에 관한 계약 사본입니다.\n촬영 1회 동의 → 광고 매체 및 사용 기간: 별지 참조.\n\n윤아의 회신: 제가 서명한 사본에는 이 별지가 없습니다. 원본은 USB에 보관 중입니다.",
    fact: "contract",
  },
  {
    id: "export",
    from: "MOMENT Data",
    subject: "Your account archive is ready",
    date: "6월 19일 07:00",
    private: true,
    body: "요청하신 데이터가 준비되었습니다. 삭제된 댓글의 본문, 연결 기록, 게시물 가져오기 이력은 Activity에서 확인할 수 있습니다. 다른 계정이 삭제한 공개 콘텐츠는 보존하지 않습니다.",
  },
];
export const activity = [
  {
    id: "deleted-comment",
    type: "Comments",
    title: "이 사진 내려주세요. 사용 허락한 적 없습니다.",
    time: "2028.06.13 12:04",
    detail: "@motionlab · SUMMER OBJECTS · 현재 댓글 삭제됨",
    fact: "contract-conflict",
    target: "post:campaign",
  },
  {
    id: "import",
    type: "Link history",
    title: "Image imported from browser",
    time: "2028.06.18 23:43",
    detail:
      "파일명 coast_winter_2024.jpg · 이어서 23:47 New post created / 23:48 Post published",
    fact: "import",
    target: "post:last",
  },
  {
    id: "like1",
    type: "Likes",
    title: "@ocean021 liked your photo",
    time: "2028.05.28 15:23",
    detail: "게시 시간 15:21 · @youna.zip",
    target: "profile:ocean",
  },
  {
    id: "like2",
    type: "Likes",
    title: "@ocean021 liked your photo",
    time: "2028.06.18 23:49",
    detail: "게시 시간 23:48 · @youna.zip",
    target: "profile:ocean",
  },
  {
    id: "loginact",
    type: "Login activity",
    title: "윤아의 휴대전화",
    time: "2028.06.18 23:43",
    detail: "모바일 세션 사용 · 기기 이름으로 사용자를 확인할 수 없음",
    target: "mail:login",
  },
  {
    id: "account",
    type: "Account history",
    title: "youna_daily → youna.zip",
    time: "2025.01.09 12:00",
    detail: "계정 생성 2019.11.03",
    target: "profile:youna",
  },
];
export type Choice = {
  id: string;
  text: string;
  reply: string[];
  facts?: string[];
  trust?: number;
  risk?: number;
};
export type Dialogue = {
  id: string;
  user: string;
  question: string;
  requires: string[];
  options: Choice[];
};
const o = (
  id: string,
  text: string,
  reply: string[],
  facts: string[] = [],
  trust = 0,
  risk = 0,
): Choice => ({ id, text, reply, facts, trust, risk });
export const dialogues: Dialogue[] = [
  {
    id: "intro",
    user: "gaeun",
    question: "너 지금 윤아 계정 들어갔어?",
    requires: [],
    options: [
      o(
        "honest",
        "응. 언니가 부탁했어.",
        ["혹시 최근 DM 보면 나한테도 알려줘.", "나도 마지막에 좀 이상했거든."],
        [],
        1,
      ),
      o("ask", "어떻게 알았어?", [
        "로그인 알림 떴다고 윤아 언니가 말해줬어.",
        "최근 DM 보면 나한테도 알려줘.",
      ]),
      o("lie", "아니.", ["그래? 언니는 너한테 부탁했다던데."], ["lied"], -1),
    ],
  },
  {
    id: "hyunwoo",
    user: "hyunwoo",
    question: "윤아 마지막으로 언제 봤어?",
    requires: ["last"],
    options: [
      o(
        "comment",
        "댓글 보니까 연락했잖아.",
        [
          "연락이랑 만나는 건 다르지. 나는 2주 넘게 못 봤어.",
          "걔가 9:26에 먼저 보냈어. “혹시 내가 연락 안 되면”… 그러다 아니 됐대.",
          "그래서 전화한 거임. 그리고 걔 바다 진짜 싫어해.",
        ],
        ["hyunwoo-dm"],
      ),
      o(
        "where",
        "마지막 게시물 장소 알아?",
        [
          "몰라. 근데 윤아 저런 데 안 감. 바다 진짜 싫어해.",
          "9:26에 “혹시 내가 연락 안 되면”이라고 DM이 와서 전화했어.",
        ],
        ["hyunwoo-dm"],
      ),
      o(
        "why",
        "왜 그렇게 연락했어?",
        [
          "걔가 먼저 이상한 DM 보내서. 9:26에 “혹시 내가 연락 안 되면”이라고.",
          "계속 안 받았고. 그리고 걔 바다 진짜 싫어해.",
        ],
        ["hyunwoo-dm"],
      ),
    ],
  },
  {
    id: "gaeun-story",
    user: "gaeun",
    question: "걔 만나러 가는 거냐고 물었잖아. 누구야?",
    requires: ["story-reply", "reply:intro"],
    options: [
      o(
        "soft",
        "윤아 찾으려는 거야.",
        ["태준 만나러 간다고 했어. 사진 때문에 싸운 게 있었거든."],
        ["taejun-meeting"],
        2,
      ),
      o(
        "direct",
        "솔직히 말해.",
        ["태준. 사진 문제로 싸웠어. 그 이상은 지금 말하기 힘들어."],
        ["taejun-meeting"],
      ),
      o(
        "threat",
        "경찰한테 보여줄까?",
        ["나도 걱정하고 있어. 지금은 이야기하고 싶지 않아."],
        [],
        -3,
      ),
    ],
  },
  {
    id: "repair",
    user: "gaeun",
    question: "아까는 미안해. 천천히 이야기하자.",
    requires: ["reply:gaeun-story"],
    options: [
      o(
        "sorry",
        "윤아를 찾는 데 네 이야기가 필요해.",
        [
          "나도 겁났어. 태준 만나러 간 건 맞아.",
          "내가 말리지 못했다는 게 무서워서 숨겼어.",
        ],
        ["taejun-meeting"],
        3,
      ),
      o(
        "wait",
        "준비되면 말해줘.",
        ["고마워. 태준한테도 사진에 대해 물어봐."],
        ["taejun-meeting"],
        1,
      ),
    ],
  },
  {
    id: "taejun",
    user: "taejun",
    question: "윤아 사진 광고에 쓴 거 알아?",
    requires: ["contract-conflict"],
    options: [
      o(
        "ask",
        "윤아가 싫다고 했잖아.",
        [
          "나도 내려달라고 했음. 회사에서 쓴 거야.",
          "그날 8시 50분쯤 STUDIO 17에서 만났고 9시 10분에 헤어졌어.",
          "9:34부터 다른 모델 촬영 라이브 기록 있어.",
          "윤아가 USB를 들고 있었어. 회사 계약 자료랑 원본 넣어놨대.",
        ],
        ["taejun-meeting", "usb-testimony"],
      ),
      o(
        "press",
        "네가 넘긴 사진 아니야?",
        [
          "사진을 전달한 건 나야. 계약서 수정은 내가 안 했어.",
          "8시 50분부터 9시 10분까지 STUDIO 17에서 윤아 만났어. 이후 라이브 켰고.",
          "USB에 계약 자료를 백업해뒀다더라.",
        ],
        ["taejun-meeting", "usb-testimony"],
      ),
    ],
  },
  {
    id: "sera",
    user: "sera",
    question: "MOTIONLAB 기사 댓글 보고 연락했어요.",
    requires: ["article:rights"],
    options: [
      o(
        "listen",
        "어떤 일을 겪으셨나요?",
        [
          "촬영 1회 동의했는데 광고에 계속 쓰더라고요.",
          "대표한테 항의하면 부계정으로 연락했어요.",
          "ocean 뭐였던 것 같은데. 계정 이름을 다시 확인해 보세요.",
        ],
        ["sera-testimony"],
      ),
      o(
        "account",
        "연락한 계정 기억나요?",
        ["ocean으로 시작했어요. 사진 계약 때문에 항의한 뒤였어요."],
        ["sera-testimony"],
      ),
    ],
  },
  {
    id: "cache",
    user: "gaeun",
    question: "22:06에 삭제된 스토리, 기억해?",
    requires: ["story:deleted", "reply:gaeun-story"],
    options: [
      o(
        "care",
        "무슨 일이었는지만 알고 싶어.",
        [
          "캡처해서 윤아한테 다시 보낸 게 있어.",
          "“사람 사진 마음대로 쓰고 계약서까지 장난쳐놓고. 끝까지 아니라고 하네. 오늘 끝낸다.”",
          "직접 만나겠다고 해서 가지 말랬어. 11시에 MOTIONLAB OLD OFFICE라고 보냈어.",
        ],
        ["deleted-story", "meeting"],
        1,
      ),
      o(
        "demand",
        "캡처 보관했으면 보내줘.",
        [
          "대화에 남은 사본 보낼게.",
          "“사람 사진 마음대로 쓰고 계약서까지 장난쳐놓고. 오늘 끝낸다.”",
          "11시에 MOTIONLAB OLD OFFICE에서 대표를 만난댔어.",
        ],
        ["deleted-story", "meeting"],
      ),
    ],
  },
  {
    id: "minsuk",
    user: "minsuk",
    question: "윤아에 관해 여쭤볼 게 있습니다.",
    requires: ["profile:minsuk"],
    options: [
      o("met", "윤아 그날 만났죠?", ["무슨 말씀인지 모르겠습니다."], [], 0, 2),
      o(
        "office",
        "old office 알아요?",
        ["예전에 사용하던 사무실입니다."],
        [],
        0,
        2,
      ),
      o(
        "ocean",
        "ocean021 본인 계정 맞죠?",
        ["처음 보는 계정입니다. 더 이상의 추측은 삼가 주세요."],
        [],
        0,
        4,
      ),
      o("silent", "아직 연락하지 않는다.", [""], [], 0, 0),
    ],
  },
  {
    id: "hyunwoo-truth",
    user: "hyunwoo",
    question: "MOTIONLAB 대표에 대해 알고 있었어?",
    requires: ["meeting", "reply:hyunwoo"],
    options: [
      o(
        "ask",
        "왜 처음엔 말하지 않았어?",
        [
          "그 대표가 자꾸 개인번호로 연락한다고 했었어.",
          "내 연락 기록 보면 나부터 의심할 것 같아서. 그날은 집에서 친구 셋이랑 게임 중이었어.",
        ],
        ["hyunwoo-alibi"],
      ),
      o(
        "safe",
        "알고 있는 것만 말해줘.",
        [
          "그 대표가 개인번호로 계속 연락한댔어.",
          "나는 그날 친구 셋이랑 게임했어. 음성 채팅 기록도 보낼 수 있어.",
        ],
        ["hyunwoo-alibi"],
      ),
    ],
  },
];
export const chapterTitles = [
  "LAST POST",
  "EVERYBODY KNOWS SOMETHING",
  "THE OTHER ACCOUNT",
  "10:06 PM",
  "THE LAST PHOTO",
  "WHAT HAPPENED TO YOUNA",
];
export const narration = [
  [
    "마지막 게시물은 그녀가 스스로 떠난 것처럼 보였다.",
    "하지만 윤아는 바다를 좋아하지 않았다.",
    "그렇다면, 이 게시물은 누구를 위한 것이었을까?",
  ],
  [
    "모두가 무언가를 숨겼다.",
    "하지만 거짓말을 했다는 것이 범인이라는 뜻은 아니다.",
  ],
  [
    "그 계정은 윤아의 게시물을 지켜보고 있었다.",
    "정민석은 부산에 있다고 했다.",
    "하지만 그날 밤 그는 서울에 있었다.",
  ],
  [
    "윤아는 도망갈 준비를 한 것이 아니었다.",
    "문제를 끝내기 위해 누군가를 만나러 갔다.",
  ],
  [
    "마지막 사진은 윤아가 찍은 것이 아니었다.",
    "누군가는 윤아가 떠난 것처럼 보이게 했다.",
    "그리고 그 연출을 직접 확인하고 있었다.",
  ],
];
export const evidenceLabels: Record<string, string> = {
  admission: '작성 사실을 인정한 DM',
  "image-source": "바다 사진 원본 사이트",
  seoul: "서울 행사 원본 사진",
  identity: "ocean021 노트북 화면",
  scheduled: "부산 예약 게시물",
  "deleted-story": "22:06 스토리 사본",
  live: "태준 라이브 기록",
  "hyunwoo-dm": "현우 DM",
  usb: "USB가 놓인 사진",
};
dialogues.push(...extraDialogues);
