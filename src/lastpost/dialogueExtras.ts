import type { Dialogue } from "./data";
export const extraDialogues: Dialogue[] = [
  {
    id: "first-lead",
    user: "gaeun",
    question: "어디부터 확인하면 좋을까?",
    requires: ["reply:intro"],
    options: [
      {
        id: "together",
        text: "네가 마지막으로 본 것부터 같이 보자.",
        reply: [
          "마지막 게시물부터 봐. 현우가 바로 댓글을 남겼어.",
          "바다 사진도 이상해. 윤아는 부산에서도 카페로 바로 들어갔거든. 예전 게시물 같이 보낼게.",
        ],
      },
    ],
  },
  {
    id: "sea-memory",
    user: "hyunwoo",
    question: "바다를 싫어했다는 걸 확인할 수 있어?",
    requires: ["hyunwoo-dm"],
    options: [
      {
        id: "photo",
        text: "그때 게시물을 보내줄래?",
        reply: [
          "2월 부산 여행 때 올린 글이야. 내 댓글도 있어.",
          "게시물 내용이랑 마지막 글을 직접 비교해 봐.",
        ],
      },
    ],
  },
  {
    id: "archive-lead",
    user: "gaeun",
    question: "그날 저녁에는 무슨 일이 있었어?",
    requires: ["sea-dislike", "reply:intro"],
    options: [
      {
        id: "archive",
        text: "기억나는 시간 순서대로 이야기해 줘.",
        reply: [
          "7시쯤 나랑 편의점에 있었어. 8시 46분에는 택시 사진을 올렸고.",
          "9시 17분 스토리에 내가 답장했어. 아카이브에 그 기록이 남아 있을 거야.",
        ],
      },
    ],
  },
  {
    id: "photo-dispute",
    user: "taejun",
    question: "가은에게 사진 문제를 들었어. 무슨 일이야?",
    requires: ["taejun-meeting"],
    options: [
      {
        id: "record",
        text: "윤아가 남긴 말을 확인하고 싶어.",
        reply: [
          "MOTIONLAB 광고에 사진이 쓰였어. 윤아가 “사용 허락한 적 없습니다”라고 댓글을 달았는데 지워졌고.",
          "윤아 본인 계정의 Activity에는 원문이 남아 있을 거야.",
        ],
        facts: ["contract-conflict"],
      },
    ],
  },
  {
    id: "live-link",
    user: "taejun",
    question: "그날 촬영 기록을 보내줄 수 있어?",
    requires: ["usb-testimony"],
    options: [
      {
        id: "send",
        text: "시간이 보이는 원본 기록으로 보내줘.",
        reply: [
          "21:34부터 촬영한 라이브야. 댓글에 시간도 남아 있어.",
          "비슷한 계약 문제로 서라라는 분도 연락했어. 관련 기사 댓글을 찾아봐.",
        ],
      },
    ],
  },
  {
    id: "company-links",
    user: "sera",
    question: "회사와 연락한 기록을 더 확인하고 싶어요.",
    requires: ["sera-testimony"],
    options: [
      {
        id: "compare",
        text: "공개된 기록을 보내주실 수 있을까요?",
        reply: [
            "정민석 대표의 부산 게시물을 보세요. 삭제 전에 기록해 둔 답글에는 ‘예약 포스팅입니다 :)’라고 적혀 있었어요.",
            "6월 18일 서울 행사 기사에도 현장 사진이 있어요. 저는 시간과 사진을 같이 확인했어요.",
          ],
          facts: ['scheduled'],
      },
    ],
  },
  {
    id: "deleted-lead",
    user: "gaeun",
    question: "태준이 22:06 스토리를 내리라고 했던데?",
    requires: ["usb-testimony", "reply:gaeun-story"],
    options: [
      {
        id: "open",
        text: "그 시간의 답장 기록을 같이 보자.",
        reply: [
          "맞아. 지금은 Story unavailable이라고 뜰 거야.",
          "답장은 남아 있어. 확인하고 나한테 다시 물어봐. 내가 보관한 사본도 찾아볼게.",
        ],
      },
    ],
  },
  {
    id: "photo-check",
    user: "taejun",
    question: "마지막 바다 사진, 윤아가 찍은 게 맞을까?",
    requires: ["meeting"],
    options: [
      {
        id: "check",
        text: "사진 출처를 확인하는 방법을 알려줘.",
        reply: [
          "그 사진은 촬영 원본 느낌이 아니야. 게시물 메뉴의 이미지 검색으로 확인해 봐.",
          "같은 사진이 예전 사이트에 있다면 게시 날짜와 저작자를 같이 보관해.",
        ],
      },
    ],
  },
  {
    id: "security-lead",
    user: "sera",
    question: "인터넷에 같은 바다 사진이 있었어요.",
    requires: ["image-source", "sera-testimony"],
    options: [
      {
        id: "log",
        text: "계정에서는 어떤 기록을 확인해야 할까요?",
        reply: [
          "Activity의 Link history에 가져오기 시간이 남을 수 있어요.",
          "계약 원본은 Mail에서도 확인하세요. 사진이 같다는 것과 누가 올렸다는 것은 다른 문제니까요.",
        ],
      },
    ],
  },
  {
    id: "health-lead",
    user: "gaeun",
    question: "윤아가 지금 어디 있는지 더 찾아보자.",
    requires: ["meeting", "image-source"],
    options: [
      {
        id: "news",
        text: "19일 새벽에 발견된 사람 기록도 확인해 볼까?",
        reply: [
          "언니도 밤새 병원에 연락했대. 신원을 모르는 환자 기록이 바로 연결되지 않을 수도 있다고 했어.",
          "6월 19일 신원미상 여성 구조 기사를 찾았어. 윤아인지는 확인되지 않았지만 언니에게 전달할 가치가 있어.",
        ],
      },
    ],
  },
  {
    id: "verify-minsuk",
    user: "minsuk",
    question: "게시물과 현장 기록이 서로 맞지 않습니다.",
    requires: ["image-source", "seoul", "meeting"],
    options: [
      {
        id: "verify",
        text: "부산 게시물과 휴대전화 사용 기록을 설명해 주세요.",
        reply: [
          "부산 사진은 예약해 둔 겁니다. 그날 서울에 있었어요.",
          "윤아 씨 휴대전화로 글을 올린 건 저입니다. ocean021 댓글도 제가 썼습니다.",
          "USB 자료를 두고 다퉜어요. 일이 이렇게 될 줄은 몰랐습니다.",
        ],
        facts: ["admission"],
        risk: 1,
      },
      {
        id: "threat",
        text: "당장 모든 걸 공개하겠습니다.",
        reply: ["더 말씀드리지 않겠습니다."],
        risk: 4,
      },
    ],
  },
  {
    id: "preserve-lead",
    user: "taejun",
    question: "자료를 모았어. 이제 어떻게 전달하지?",
    requires: ["image-source", "seoul"],
    options: [
      {
        id: "copies",
        text: "원본과 대화 사본을 함께 남기자.",
        reply: [
          "이미지 원본 사이트와 서울 행사 사진을 Notes에 저장해. 계정 연결 사진이나 작성 사실을 인정한 DM도 함께.",
          "계약 메일과 USB 이야기도 확인하고, 언니 메일에 자료 세 개를 첨부해서 답장해.",
        ],
      },
    ],
  },
];
export type Attachment = { title: string; detail: string; target: string };
export const attachments: Record<string, Attachment[]> = {
  "first-lead": [
    {
      title: "윤아의 마지막 게시물",
      detail: "June 18 · 23:48",
      target: "post:last",
    },
    {
      title: "부산 여행 기록",
      detail: "카페에서 올린 예전 게시물",
      target: "post:busan-old",
    },
    {
      title: "박현우에게 연락하기",
      detail: "마지막 게시물에 남은 댓글",
      target: "dm:hyunwoo",
    },
  ],
  "sea-memory": [
    {
      title: "부산 여행 기록",
      detail: "February 11",
      target: "post:busan-old",
    },
  ],
  "archive-lead": [
    {
      title: "21:17 스토리와 답장",
      detail: "윤아의 스토리 아카이브",
      target: "story:warning",
    },
  ],
  "photo-dispute": [
    {
      title: "삭제된 댓글 기록",
      detail: "Your activity · Comments",
      target: "activity",
    },
    {
      title: "MOTIONLAB 캠페인",
      detail: "SUMMER OBJECTS",
      target: "post:campaign",
    },
  ],
  "live-link": [
    { title: "STUDIO 17 LIVE", detail: "June 18 · 21:34", target: "post:live" },
    {
      title: "계약 분쟁 기사",
      detail: "독자 댓글 포함",
      target: "article:rights",
    },
  ],
  "company-links": [
    {
      title: "정민석의 부산 게시물",
      detail: "예약 게시물의 댓글 기록",
      target: "post:busan",
    },
    {
      title: "서울 행사 기사",
      detail: "원본 사진을 확대해서 확인",
      target: "article:event",
    },
  ],
  "deleted-lead": [
    {
      title: "22:06 스토리의 흔적",
      detail: "삭제된 콘텐츠 · 답장 보관됨",
      target: "story:deleted",
    },
  ],
  "photo-check": [
    {
      title: "마지막 사진 이미지 검색",
      detail: "NORTH · Visual matches",
      target: "image:sea",
    },
  ],
  "security-lead": [
    { title: "계정 활동 기록", detail: "Link history", target: "activity" },
    {
      title: "계약 사본 메일",
      detail: "Content Usage Agreement",
      target: "mail:contract",
    },
  ],
  "health-lead": [
    {
      title: "신원 미상 여성 구조 기사",
      detail: "June 19 · LOCAL TODAY",
      target: "article:rescue",
    },
  ],
  "preserve-lead": [
    {
      title: "한유진의 메일",
      detail: "조사 자료를 첨부해 답장",
      target: "mail:sister",
    },
  ],
  cache: [
    {
      title: "MOTIONLAB OLD OFFICE",
      detail: "June 18 · 23:00 약속 장소",
      target: "search:MOTIONLAB OLD OFFICE",
    },
  ],
};
