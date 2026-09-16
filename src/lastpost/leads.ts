import { has, savedEvidence, type Game } from "./engine.ts";
export type Lead = {
  title: string;
  why: string;
  action: string;
  target: string;
};
export function nextLead(s: Game): Lead {
  if (!s.loggedIn)
    return {
      title: "윤아의 계정에 접근하기",
      why: "게시물의 업로드 날짜와 사진 원본 촬영 날짜는 다를 수 있어요.",
      action: "공개 프로필 확인",
      target: "profile:youna",
    };
  if (!has(s, "reply:intro"))
    return {
      title: "가은의 메시지에 답장하기",
      why: "윤아를 함께 찾을 사람의 이야기를 먼저 들어보세요.",
      action: "가은과 대화",
      target: "dm:gaeun",
    };
  if (!has(s, "last"))
    return {
      title: "마지막 게시물 확인",
      why: "캡션, 댓글, 업로드 시간을 읽어보세요.",
      action: "게시물 열기",
      target: "post:last",
    };
  if (!has(s, "hyunwoo-dm"))
    return {
      title: "현우가 연락한 이유",
      why: "마지막 게시물에 전화를 받으라는 댓글이 남아 있어요.",
      action: "현우에게 질문",
      target: "dm:hyunwoo",
    };
  if (!has(s, "sea-dislike"))
    return {
      title: "평소의 윤아와 비교하기",
      why: "현우에게 바다를 싫어했다는 말을 확인할 기록을 요청할 수 있어요.",
      action: "현우와 대화",
      target: "dm:hyunwoo",
    };
  if (!has(s, "story-reply"))
    return {
      title: "그날 저녁의 스토리",
      why: "가은에게 시간 순서대로 이야기해 달라고 물어보세요.",
      action: "가은과 대화",
      target: "dm:gaeun",
    };
  if (!has(s, "taejun-meeting"))
    return {
      title: "가은이 말한 “걔”",
      why: "스토리 답장을 근거로 물어보세요. 대화가 끊겼다면 사과하고 다시 이야기할 수 있어요.",
      action: "가은에게 질문",
      target: "dm:gaeun",
    };
  if (!has(s, "usb-testimony"))
    return {
      title: "사진 계약과 태준의 이야기",
      why: "태준에게 사진 갈등을 묻고, 그날 만남에 대해 들어보세요.",
      action: "태준과 대화",
      target: "dm:taejun",
    };
  if (!has(s, "live"))
    return {
      title: "촬영 기록으로 시간 확인",
      why: "태준에게 라이브 원본을 요청할 수 있어요.",
      action: "태준에게 기록 요청",
      target: "dm:taejun",
    };
  if (!has(s, "article:rights"))
    return {
      title: "다른 계약 당사자의 이야기",
      why: "태준이 공유한 계약 분쟁 기사에서 독자의 댓글을 확인해 보세요.",
      action: "관련 기사 열기",
      target: "article:rights",
    };
  if (!has(s, "sera-testimony"))
    return {
      title: "서라에게 당시 상황 묻기",
      why: "계약 문제를 겪었다는 댓글을 남긴 사람입니다.",
      action: "서라와 대화",
      target: "dm:sera",
    };
  if (!has(s, "profile:ocean"))
    return {
      title: "익명 계정의 연결 목록",
      why: "마지막 게시물의 댓글 작성자와 팔로잉을 확인하세요.",
      action: "ocean021 프로필",
      target: "profile:ocean",
    };
  if (!has(s, "seoul", "scheduled"))
    return {
      title: "날짜와 장소를 교차 확인",
      why: "서라에게 공개 기록을 요청하고, 게시물 댓글과 기사 원본 사진을 비교해 보세요.",
      action: "서라에게 자료 요청",
      target: "dm:sera",
    };
  if (!has(s, "story:deleted"))
    return {
      title: "삭제된 스토리의 답장",
      why: "가은에게 22:06 스토리의 흔적을 물어보세요.",
      action: "가은과 대화",
      target: "dm:gaeun",
    };
  if (!has(s, "meeting"))
    return {
      title: "사라진 내용의 사본",
      why: "삭제된 스토리를 확인했다면 가은에게 보관한 캡처를 요청하세요.",
      action: "가은에게 캡처 요청",
      target: "dm:gaeun",
    };
  if (!has(s, "hyunwoo-alibi"))
    return {
      title: "현우가 숨긴 이유",
      why: "만남 상대를 알게 됐으니 처음 하지 못한 이야기를 물어보세요.",
      action: "현우에게 다시 질문",
      target: "dm:hyunwoo",
    };
  if (!has(s, "image-source"))
    return {
      title: "마지막 사진의 출처",
      why: "사진작가인 태준에게 이미지 확인 방법을 물어볼 수 있어요.",
      action: "태준과 대화",
      target: "dm:taejun",
    };
  if (!has(s, "import", "contract"))
    return {
      title: "사진 가져오기 이력과 계약",
      why: "Activity의 Link history를 열고 Mail의 계약 사본도 확인하세요.",
      action: !has(s, "import") ? "계정 기록 열기" : "계약 메일 열기",
      target: !has(s, "import") ? "activity" : "mail:contract",
    };
  if (!has(s, "identity") && !has(s, "admission"))
    if(s.choices['verify-minsuk']==='threat') return {title:'추가 진술을 얻지 못했어요',why:'대화가 끊기고 공개 기록이 지워졌습니다. 남아 있는 사본으로 조사 의견을 전달하거나 다른 자료를 더 살펴보세요.',action:'가족에게 남은 자료 전달',target:'mail:sister'};
  if (!has(s, "identity") && !has(s, "admission"))
    return {
      title: "작성자를 연결할 기록",
      why: "계정의 예전 사진을 조사하거나, 확보한 시간·이미지 기록으로 정민석에게 설명을 요청할 수 있어요.",
      action: "정민석에게 기록 제시",
      target: "dm:minsuk",
    };
  if (!has(s, "rescue"))
    return {
      title: "윤아의 현재 행방",
      why: "가은과 발견·구조 기록을 더 찾아볼 수 있어요. 제출 전에 확인할지는 당신의 선택입니다.",
      action: "가은과 대화",
      target: "dm:gaeun",
    };
  const saved = savedEvidence(s);
  if (
    !saved.includes("image-source") ||
    !saved.includes("seoul") ||
    !saved.some((f) => ["identity", "admission"].includes(f))
  )
    return {
      title: "전달할 사본 보관하기",
      why: "원본 사이트, 현장 기사 사진, 계정 연결 사진 또는 인정한 DM을 각각 Save to Notes로 저장하세요.",
      action: "보관한 자료 확인",
      target: "notes",
    };
  return {
    title: "조사 내용을 가족에게 전달",
    why: "한유진의 메일에 사람 한 명과 보관한 자료 세 개를 선택해 답장하세요.",
    action: "메일 열기",
    target: "mail:sister",
  };
}
