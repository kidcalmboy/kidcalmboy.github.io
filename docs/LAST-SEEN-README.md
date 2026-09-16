# LAST SEEN · NOVA OS

React + Vite + TypeScript 기반 한국어 스크린라이프 미스터리.

## 현재 상태

부팅/로그인, 다중 창, 9개 앱, 두 암호 퍼즐, 삭제 파일 복원, 증거 수집, 이벤트 메시지, 위치 추적과 세 엔딩까지 연결한 **플레이 가능한 개발 버전**입니다. 원래 기획의 50–80분 분량을 확보한 최종 완성본은 아닙니다.

- 29개 이미지 항목(단서 5개)은 벡터 재구성 아트입니다. 실제 인물/일상 사진 에셋 제작은 남아 있습니다. 단서는 사진 상세 조사와 증거 보드의 기록 비교로 연결됩니다.
- 마지막 녹음은 자막과 브라우저 음성 합성 재연입니다. 배우 음원이나 충돌 효과음 파일이 아닙니다. 한국어 음성이 없는 시스템에서는 자막으로 확인합니다.
- GitHub Pages workflow는 준비했지만 아직 push/공개 배포 검증은 하지 않았습니다.
- 이전 Vanilla 소스는 보존했습니다. legacy.html은 개발 서버에서 이전 버전을 열기 위한 진입점이며 배포 빌드에는 포함되지 않습니다.

## 실행 / 검증

Node.js 24 권장.

```sh
npm ci
npm run dev
npm test
npm run build
npx playwright test
```

개발 주소: http://127.0.0.1:5180. Playwright는 설치된 Edge를 headless 모드로 사용합니다. 개발 서버를 먼저 실행하세요. 배포 파일은 dist/입니다. GitHub Pages Source를 GitHub Actions로 두면 main push 시 빌드/배포합니다.

## 구조

- src/app/App.tsx: 메뉴/부팅/로그인/데스크톱/엔딩 조립
- src/components/WindowManager.tsx: 위치, 포커스, z-index, 최소화, 최대화
- src/components/Notifications.tsx: 알림 큐
- src/game/store.ts: 외부 스토어, 자동 저장, 설정
- src/game/rules.js: 순수 진행/암호/엔딩 규칙 (Node 테스트와 공유)
- src/game/EventEngine.tsx: 데이터 기반 지연 이벤트
- src/game/audio.ts: 브라우저 오디오 효과
- src/data/: 대화, 증거, 사진 메타데이터, 엔딩
- src/apps/: 앱별 UI
- src/styles/: 토큰과 새 UI 스타일
- tests/: 상태/회귀 테스트, 실제 UI 통합 테스트

기존 CSS는 화면 회귀를 줄이기 위해 함께 사용합니다. 이후 새 스타일로 점진적으로 통합합니다.

## 화면과 대화 시스템

NOVA 이름은 유지하며 데스크톱은 macOS형 메뉴바·Dock·창 제어, 메신저는 macOS 메시지형 사이드바·파란 말풍선, 브라우저는 Chrome형 탭·주소창·북마크 바로 구성합니다. 브라우저 검색은 게임 내부 자료만 검색하며 실제 웹사이트로 이동하지 않습니다.

`src/data/dialogues.js`가 답장·조건·효과를 정의하고 `src/game/dialogueEngine.js`가 선택 기록, 관계 수치, 지연 답장, 시간제한, 엔딩 분기를 처리합니다. CASE FEED는 단서 안내와 지난 기록을 제공합니다. 선택과 남은 대기 시각은 자동 저장됩니다.

## 저장 / 조작

lastSeenSave에 자동 저장합니다. 기존 last-seen-save-v1은 보존하며 새 저장이 없을 때 단서를 이관합니다. 새 게임은 확인 후 현재 저장만 초기화합니다.

Dock: 클릭. 바탕화면: 클릭 선택, 더블클릭/Enter 실행. 창 제목: 드래그/더블클릭 크기 전환. ESC: 활성 창 또는 대화상자 닫기. 설정: 전체/배경/효과 음량, 자막 속도, 동작 줄이기.

## 스토리 일관성

실종 10월 15일, 조사 시작 18일. 영수증 22:47 이후 충돌이 발생하도록 마지막 녹음을 23:14로 통일했습니다. 영수증만으로 민재가 현장에 있었다고 단정하지 않습니다.

프로덕션에는 DEV 패널이 나타나지 않습니다. 클라이언트 게임이므로 소스나 LocalStorage 직접 변경에 의한 치팅을 방지하지 않습니다.
