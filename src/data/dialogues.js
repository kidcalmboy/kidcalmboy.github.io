// Declarative dialogue. Conditions and effects are interpreted by the engine.
const rel = (character, stat, amount) => ({
  type: "relationship",
  character,
  stat,
  amount,
});
const memory = (key) => ({ type: "memory", key });
const flag = (key) => ({ type: "flag", key });
const ev = (key) => ({ type: "evidence", key });
const feed = (key) => ({ type: "caseFeed", key });
export const dialogues = [
  {
    id: "intro",
    character: "minjae",
    automatic: true,
    conditions: [{ type: "loggedIn" }],
    prompt: "야. 너 서준이 노트북 받았어?",
    options: [
      {
        id: "how",
        text: "어떻게 알았어?",
        reply: [
          "서준이 전에 말했어.",
          "자기한테 무슨 일 생기면 너한테 맡긴다고.",
        ],
        effects: [feed("first_reply")],
      },
      {
        id: "admit",
        text: "응. 왜?",
        reply: ["아니 그냥.", "혹시 이상한 거 있으면 나한테 먼저 말해."],
        effects: [rel("minjae", "trust", 1), feed("first_reply")],
      },
      {
        id: "lie",
        text: "아니.",
        reply: ["그래?", "…"],
        effects: [
          rel("minjae", "trust", -1),
          memory("liedToMinjaeAboutLaptop"),
          feed("first_reply"),
        ],
      },
    ],
  },
  {
    id: "last_contact",
    character: "minjae",
    question: "서준이랑 마지막으로 어디서 만났어?",
    conditions: [
      { type: "evidence", key: "minjae_chat" },
      { type: "answered", key: "intro" },
    ],
    prompt: "갑자기 그건 왜?",
    options: [
      {
        id: "honest",
        text: "대화 기록 봤어.",
        reply: ["BLUE ROOM.", "근데 난 먼저 나왔어."],
        variants: [
          {
            conditions: [
              { type: "stat", character: "minjae", stat: "trust", min: 2 },
            ],
            reply: [
              "블루룸에서 잠깐 봤어.",
              "서준이는 다른 사람 기다리는 것 같았어. 나랑은 얘기 안 했고.",
            ],
            effects: [flag("minjaeConfession"), ev("minjae_witness")],
          },
        ],
        effects: [rel("minjae", "trust", 1), flag("blueRoomDiscussed")],
      },
      {
        id: "police_lie",
        text: "경찰이 물어봐서.",
        reply: ["블루룸.", "근데 나 경찰한테 말한 적 없는데 누구한테 들었어?"],
        effects: [
          rel("minjae", "trust", -1),
          memory("liedAboutPolice"),
          flag("blueRoomDiscussed"),
        ],
      },
      {
        id: "vague",
        text: "그냥 궁금해서.",
        reply: ["너 지금 뭐 찾고 있는 거야?"],
        effects: [rel("minjae", "pressure", 1), flag("minjaeFollowup")],
      },
    ],
  },
  {
    id: "minjae_followup",
    character: "minjae",
    automatic: true,
    conditions: [
      { type: "flag", key: "minjaeFollowup" },
      { type: "answered", key: "last_contact" },
    ],
    prompt: "나 의심하는 거야?",
    options: [
      {
        id: "careful",
        text: "아직 아무것도 확실하지 않아.",
        reply: ["그래. 블루룸에서 잠깐 봤고 난 먼저 나왔어."],
        effects: [rel("minjae", "trust", 1), flag("blueRoomDiscussed")],
      },
      {
        id: "direct",
        text: "마지막 약속이 너잖아.",
        reply: ["블루룸. 그거면 됐지?"],
        effects: [rel("minjae", "trust", -1), flag("blueRoomDiscussed")],
      },
    ],
  },
  {
    id: "blue_room",
    character: "minjae",
    question: "22:47 영수증을 찾았어. 그때 어디 있었어?",
    conditions: [
      { type: "evidence", key: "receipt_2247" },
      { type: "answered", key: "intro" },
    ],
    prompt: "난 10시 반에 집이었다니까.",
    options: [
      {
        id: "compare",
        text: "시간을 비교하려고. 귀가 기록 있어?",
        reply: ["교통 내역 보낼게.", "솔빛역에서 내려서 걸어갔어."],
        effects: [
          rel("minjae", "trust", 1),
          flag("transitShared"),
          ev("transit_record"),
          feed("minjae_cooperation"),
        ],
      },
      {
        id: "accuse",
        text: "솔직히 말해. 거기 있었잖아.",
        reply: ["나 경찰한테 다 말했어.", "더 할 말 없어."],
        effects: [
          rel("minjae", "trust", -2),
          rel("minjae", "pressure", 2),
          feed("minjae_guarded"),
        ],
      },
      {
        id: "wait",
        text: "알겠어. 다른 기록도 확인해 볼게.",
        reply: ["ㅇㅇ"],
        effects: [flag("carefulInvestigation")],
      },
    ],
  },
  {
    id: "minjae_memory",
    character: "minjae",
    automatic: true,
    conditions: [
      { type: "flag", key: "projectUnlocked" },
      { type: "memory", key: "liedToMinjaeAboutLaptop" },
      { type: "answered", key: "intro" },
    ],
    prompt: "근데 너 그때 노트북 없다고 하지 않았냐?",
    options: [
      {
        id: "apologize",
        text: "미안. 누구 말을 믿어야 할지 몰랐어.",
        reply: ["다음엔 그냥 말해.", "나도 서준이 찾고 싶어."],
        effects: [rel("minjae", "trust", 1), memory("apologizedToMinjae")],
      },
      {
        id: "double_down",
        text: "그 뒤에 받았어.",
        reply: ["배송은 오전에 끝났다던데.", "그만하자."],
        effects: [
          rel("minjae", "trust", -2),
          memory("repeatedLie"),
          feed("minjae_guarded"),
        ],
      },
    ],
  },
  {
    id: "harin_secret",
    character: "harin",
    question: "서준이 마지막으로 무슨 얘기 했어?",
    conditions: [{ type: "evidence", key: "receipt_2247" }],
    prompt: "서준이 얘기 때문에 연락한 거지?",
    options: [
      {
        id: "empathy",
        text: "말하기 힘들면 천천히 해도 돼.",
        reply: [
          "이거 말해야 할지 모르겠는데.",
          "나 뭐 잘못 건드린 거 같다고 했어.",
          "그때 대화 캡처 보내줄게.",
        ],
        effects: [
          rel("harin", "trust", 2),
          rel("harin", "openness", 1),
          flag("harinSecretRevealed"),
          flag("harinScreenshot"),
          ev("harin_warning"),
          feed("harin_shared"),
        ],
      },
      {
        id: "facts",
        text: "마지막으로 뭐라고 했는지만 알려줘.",
        reply: ["프로젝트 얘기만 했어.", "잠도 잘 못 잔다고."],
        effects: [rel("harin", "trust", 1)],
      },
      {
        id: "jealous",
        text: "둘이 아직 연락했어?",
        reply: ["그거 굳이 지금 물어봐야 돼?", "미안. 나도 잘 몰라."],
        effects: [rel("harin", "trust", -1), memory("ignoredHarin")],
      },
      {
        id: "silence",
        text: "답하지 않는다.",
        silent: true,
        reply: ["생각 정리되면 연락해."],
        effects: [memory("ignoredHarin")],
      },
    ],
  },
  {
    id: "jihoon_project",
    character: "jihoon",
    automatic: true,
    conditions: [
      { type: "flag", key: "projectUnlocked" },
      { type: "event", key: "project_warning" },
    ],
    prompt:
      "서준 프로젝트 파일 괜히 건드리지 않는 게 좋을 거야. 데이터 좀 복잡해.",
    options: [
      {
        id: "how",
        text: "내가 열었다는 건 어떻게 알았어?",
        reply: ["클라우드 공유돼 있어서 알림 떠.", "그게 왜?"],
        effects: [
          rel("jihoon", "suspicion", 2),
          rel("jihoon", "trust", -1),
          memory("questionedCloud"),
        ],
      },
      {
        id: "comply",
        text: "알겠어.",
        reply: [
          "필요한 거 있으면 내가 확인해줄게.",
          "계정 자동화 쪽은 내가 만든 거라.",
        ],
        effects: [
          rel("jihoon", "trust", 2),
          rel("jihoon", "suspicion", -1),
          ev("automation_admission"),
        ],
      },
      {
        id: "lie",
        text: "안 열었는데?",
        reply: ["아.", "내가 잘못 봤나 보네."],
        effects: [rel("jihoon", "suspicion", 3), memory("liedToJihoon")],
      },
      {
        id: "accuse",
        text: "너 뭐 숨기는 거 있어?",
        reply: ["너 어디까지 알아낸 거야?", "갑자기 무슨 소리야."],
        deleteFirstAfter:1200,
        effects: [
          rel("jihoon", "suspicion", 4),
          memory("accusedJihoonEarly"),
          feed("jihoon_guarded"),
        ],
      },
    ],
  },
  {
    id: "unknown_identity",
    character: "unknown",
    automatic: true,
    conditions: [{ type: "flag", key: "projectUnlocked" }],
    prompt: "그 노트북 가지고 있죠?",
    options: [
      {
        id: "identify",
        text: "누구세요?",
        reply: [
          "강도윤입니다. 서준 씨가 제보를 준비하고 있었어요.",
          "제 기사부터 검색해 보셔도 됩니다.",
        ],
        effects: [rel("doyoon", "trust", 1), flag("doyoonIdentified")],
      },
      {
        id: "number",
        text: "어떻게 번호 알았어요?",
        reply: [
          "서준 씨가 비상 연락처로 남겼어요.",
          "확인 전에는 자료를 보내지 않으셔도 됩니다.",
        ],
        effects: [rel("doyoon", "trust", 1), flag("doyoonIdentified")],
      },
      {
        id: "ignore",
        text: "답하지 않는다.",
        silent: true,
        reply: ["명함은 초안 메일에 있을 겁니다."],
        effects: [rel("doyoon", "trust", -1)],
      },
      {
        id: "report",
        text: "경찰에 연락하겠습니다.",
        reply: ["알겠습니다. 더 연락하지 않겠습니다."],
        effects: [
          flag("policeRoute"),
          memory("reportedUnknown"),
          feed("police_route"),
        ],
      },
    ],
  },
  {
    id: "journalist_help",
    character: "unknown",
    question: "기사를 확인했습니다. 함께 확인해 주실 수 있나요?",
    conditions: [
      { type: "evidence", key: "journalist" },
      { type: "answered", key: "unknown_identity" },
      { type: "notMemory", key: "reportedUnknown" },
    ],
    prompt:
      "확인되지 않은 자료를 외부에 전달하면 안 됩니다. 어떻게 진행할까요?",
    options: [
      {
        id: "verify",
        text: "원본부터 같이 검증하고 싶어요.",
        reply: [
          "좋습니다. 비공개 검증으로 진행하죠.",
          "리뷰 계정 군집 비교 자료를 보내겠습니다.",
        ],
        effects: [
          rel("doyoon", "trust", 2),
          rel("doyoon", "cooperation", 2),
          flag("journalistHelping"),
          flag("journalistDocument"),
          ev("journalist_analysis"),
          feed("journalist_help"),
        ],
      },
      {
        id: "publish",
        text: "일단 기사로 공개해 주세요.",
        reply: [
          "공개 여부는 최종 원본을 확인한 뒤 정하겠습니다.",
          "검증 자료부터 보내드릴게요.",
        ],
        effects: [
          rel("doyoon", "trust", -1),
          flag("journalistHelping"),
          flag("journalistDocument"),
          memory("wantedPublication"),
        ],
      },
      {
        id: "hold",
        text: "지금은 아무 자료도 보내지 않을게요.",
        reply: ["네. 원본은 꼭 따로 보관하세요."],
        effects: [flag("withheldEvidence")],
      },
    ],
  },
  {
    id: "share_zip",
    character: "jihoon",
    question: "evidence.zip에 네 이름이 있어.",
    conditions: [
      { type: "flag", key: "zipUnlocked" },
      { type: "answered", key: "jihoon_project" },
    ],
    prompt: "무슨 파일인데? 보내 봐.",
    options: [
      {
        id: "send",
        text: "이 파일 뭐야? 네가 확인해 줘.",
        reply: ["내가 확인해볼게.", "잘못 정리된 자료일 거야."],
        effects: [
          flag("evidenceSharedWithJihoon"),
          memory("trustedJihoonWithEvidence"),
          rel("jihoon", "trust", 2),
          rel("jihoon", "suspicion", 3),
          flag("paymentQuarantined"),
          feed("file_missing"),
        ],
      },
      {
        id: "refuse",
        text: "파일은 안 보낼게. 송금 내역부터 설명해.",
        reply: ["그거 그냥 알바비야.", "네가 생각하는 그런 거 아님."],
        effects: [rel("jihoon", "suspicion", 2)],
      },
      {
        id: "quiet",
        text: "다른 파일이었어.",
        reply: ["그래."],
        effects: [rel("jihoon", "suspicion", 1), memory("concealedPayment")],
      },
    ],
  },
  {
    id: "final_audio",
    character: "jihoon",
    question: "마지막 녹음에 대해 연락하기",
    conditions: [{ type: "flag", key: "audioRestored" }],
    prompt: "서준이 일, 뭐 좀 찾았어?",
    options: [
      {
        id: "reveal",
        text: "녹음 찾았어.",
        reply: ["…", "무슨 녹음?", "지금 어디야?"],
        effects: [
          {
            type: "setStat",
            character: "jihoon",
            stat: "suspicion",
            amount: 10,
          },
          flag("jihoonWarned"),
          flag("whereQuestion"),
          feed("danger"),
        ],
      },
      {
        id: "ask",
        text: "서준이 마지막으로 만난 사람이 너야?",
        reply: ["아니. 그날 못 만났어."],
        effects: [rel("jihoon", "suspicion", 2), memory("jihoonDeniedMeeting")],
      },
      {
        id: "silence",
        text: "아무 메시지도 보내지 않는다.",
        silent: true,
        reply: [],
        effects: [flag("keptRecordingPrivate"), feed("final_lead")],
      },
    ],
  },
  {
    id: "where_now",
    character: "jihoon",
    automatic: true,
    timeout: 10000,
    defaultOption: "silence",
    conditions: [
      { type: "flag", key: "whereQuestion" },
      { type: "answered", key: "final_audio" },
    ],
    prompt: "지금 어디야?",
    options: [
      {
        id: "home",
        text: "집이야.",
        reply: ["혼자 있어?"],
        effects: [memory("revealedWhereabouts"), rel("jihoon", "suspicion", 1)],
      },
      {
        id: "why",
        text: "왜?",
        reply: ["만나서 얘기하자."],
        effects: [flag("riversideUnlocked")],
      },
      {
        id: "silence",
        text: "답하지 않는다.",
        silent: true,
        reply: ["…"],
        effects: [flag("withheldLocation")],
      },
    ],
  },
  {
    id: "confront",
    character: "jihoon",
    question: "23시 14분 녹음, 송금 기록, Project N. 다 찾았어.",
    conditions: [
      { type: "evidence", key: "final_audio" },
      { type: "evidence", key: "jihoon_payment" },
      { type: "evidence", key: "project_n" },
      { type: "answered", key: "final_audio" },
    ],
    prompt: "… 너 지금 어디야?",
    options: [
      {
        id: "police",
        text: "경찰한테 넘겼어.",
        reply: ["경찰에 확인해 볼게."],
        variants: [
          {
            conditions: [{ type: "flag", key: "policeContacted" }],
            reply: [
              "미안하다.",
              "진짜 그렇게 될 줄은 몰랐어.",
              "청운물류 B동 지하야.",
            ],
            effects: [
              flag("confession"),
              flag("confessionLocation"),
              ev("jihoon_confession"),
            ],
          },
          {
            conditions: [{ type: "notFlag", key: "policeContacted" }],
            reply: ["거짓말하지 마.", "나 지금 간다."],
            effects: [rel("jihoon", "suspicion", 3), memory("bluffedPolice")],
          },
        ],
        effects: [],
      },
      {
        id: "alone",
        text: "아직 아무한테도 안 보냈어.",
        reply: ["그럼 우리 만나서 얘기하자.", "강변 주차장으로 와."],
        effects: [flag("riversideUnlocked"), feed("riverside")],
      },
      {
        id: "where",
        text: "서준 어디 있어?",
        reply: [
          "…",
          "걔 죽이려고 한 거 아니야.",
          "청운물류 B동 지하. 계단에서 그랬어.",
        ],
        effects: [
          flag("confession"),
          flag("confessionLocation"),
          ev("jihoon_confession"),
          feed("confession"),
        ],
      },
      {
        id: "silence",
        text: "답하지 않는다.",
        silent: true,
        reply: ["답 좀 해."],
        effects: [flag("withheldLocation")],
      },
    ],
  },
  {
    id: "riverside_reply",
    character: "jihoon",
    automatic: true,
    timeout: 10000,
    defaultOption: "silence",
    conditions: [
      { type: "flag", key: "riversideUnlocked" },
      { type: "answered", key: "confront" },
    ],
    prompt: "강변 주차장. 혼자 오는 거지?",
    options: [
      {
        id: "agree",
        text: "일단 얘기만 하자.",
        reply: ["자료도 가져와."],
        effects: [rel("jihoon", "trust", 1), memory("agreedToMeet")],
      },
      {
        id: "refuse",
        text: "직접 만나지는 않을 거야.",
        reply: ["…"],
        effects: [flag("refusedMeeting")],
      },
      {
        id: "silence",
        text: "답하지 않는다.",
        silent: true,
        reply: [],
        effects: [flag("refusedMeeting")],
      },
    ],
  },
];
export const caseFeeds = {
  prologue: {
    type: "story",
    title: "OCTOBER 18, 2028",
    text: "한서준, 24세. 사흘째 연락두절. 오늘 그의 노트북이 도착했다. 메신저에는 아직 연락할 수 있는 사람들이 남아 있다.",
    contact: "minjae",
  },
  first_reply: {
    type: "lead",
    title: "Last Contact",
    text: "이제 당신의 답장도 이 노트북의 기록이 된다. 실종 전 약속과 오늘의 대답을 비교해 보자.",
    contact: "minjae",
  },
  receipt: {
    type: "discovery",
    title: "22:47",
    text: "민재의 귀가 메시지는 22:30, 결제는 22:47. 이 차이만으로 거짓말을 단정할 수는 없다. 민재와 하린에게 물어볼 수 있다.",
    contact: "minjae",
  },
  project: {
    type: "thought",
    title: "누가 접속을 보고 있을까",
    text: "잠긴 프로젝트가 열렸다. 접속을 아는 사람이 있다면, 공유 설정도 확인할 필요가 있다.",
    contact: "jihoon",
  },
  minjae_cooperation: {
    type: "discovery",
    title: "귀가 기록",
    text: "민재가 교통 내역을 보내왔다. 진술과 독립된 기록인지도 따져봐야 한다.",
    contact: "minjae",
  },
  minjae_guarded: {
    type: "warning",
    title: "짧아진 답장",
    text: "민재가 말을 아끼기 시작했다. 사진과 다른 사람의 기록에서도 같은 장소를 조사할 수 있다.",
    contact: "harin",
  },
  harin_shared: {
    type: "discovery",
    title: "보내지 못한 말",
    text: "하린이 남겨 둔 대화 캡처가 Photos와 Files에 동기화됐다.",
    contact: "harin",
  },
  jihoon_guarded: {
    type: "warning",
    title: "조심스러워진 말",
    text: "지훈이 질문에 바로 답하지 않는다. 무엇을 알고 있는지 더 드러내기 전에 원본을 보관하자.",
    contact: "jihoon",
  },
  file_missing: {
    type: "warning",
    title: "동기화 변경",
    text: "송금 자료의 공유 사본이 사라졌다. 이미 수집한 증거는 남아 있다. 휴지통에서 로컬 복구본을 확인할 수 있다.",
    contact: "jihoon",
  },
  police_route: {
    type: "lead",
    title: "다른 창구",
    text: "기자는 연락을 멈췄다. Evidence에서 자료를 정리해 경찰 경로를 이용할 수 있다. 충분한 근거 없이 사건을 종결 제출하면 조사 기회를 잃을 수 있다.",
  },
  journalist_help: {
    type: "discovery",
    title: "검증 자료 도착",
    text: "기자의 비공개 계정 비교 자료가 Files에 도착했다. 공개 여부는 최종 조사에서 결정한다.",
    contact: "unknown",
  },
  danger: {
    type: "warning",
    title: "그가 묻는 것",
    text: "지훈은 녹음 내용보다 당신의 위치를 묻는다. 답하지 않는 것도 기록에 남는 선택이다.",
    contact: "jihoon",
  },
  final_lead: {
    type: "chapter",
    title: "The Choice",
    text: "원본을 보관하고 누구에게 자료를 전달할지 결정해야 한다. Evidence에서 현재 증거와 대화 기록을 함께 검토하자.",
  },
  confession: {
    type: "discovery",
    title: "CONFESSION",
    text: "지훈이 서준에게 일어난 일과 장소를 인정했다. 자백 기록을 기존 자료와 함께 검증할 수 있다.",
  },
  riverside: {
    type: "warning",
    title: "RIVERSIDE PARKING",
    text: "지훈이 강변 주차장에서 만나자고 한다. Maps에 장소가 추가됐다. 직접 접근할지, 자료를 먼저 전달할지 결정해야 한다.",
    contact: "jihoon",
  },
  flee: {
    type: "warning",
    title: "연결할 수 없는 계정",
    text: "지훈의 계정이 오프라인으로 바뀌었다. 남아 있는 기록을 보존하고 최종 전달 전략을 정하자.",
  },
};
