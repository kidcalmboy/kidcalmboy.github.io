# Interactive portfolio

첫 화면에서 시작 버튼 없이 WASD/방향키로 즉시 이동합니다. 컴퓨터를 향해 책상 앞으로 걸어가면 자동으로 앉고 모니터로 확대된 뒤 전체 화면 CLI로 연결됩니다. 드래그 또는 화면 클릭 후 마우스로 시점을 조작하며, 모바일에서는 방향 버튼을 사용합니다. ESC/exit는 책상 앞으로 복귀합니다. 3D를 사용할 수 없는 경우에만 터미널 진입 버튼이 표시됩니다.

## 실행

```sh
npm ci
npm run dev
```

## 콘텐츠 수정

`src/portfolio/profile.ts`에서 이름, 소개, 기술, GitHub 주소와 프로젝트를 변경하세요. 확인되지 않은 경력이나 프로젝트를 넣지 않았으므로 프로젝트 배열은 비어 있습니다.

```ts
projects: [
  {
    name: "프로젝트 이름",
    description: "역할과 주요 결과",
    url: "https://github.com/...",
  },
];
```

지원 명령어: `help`, `about`, `projects`, `skills`, `contact`, `github`, `whoami`, `clear`, `exit`. Tab 자동완성, 위/아래 방향키 입력 기록, Escape 방 복귀를 지원합니다. 실제 셸을 실행하지 않습니다.

## 확인 및 배포

```sh
npm test
npm run build
# 개발 서버 실행 상태에서:
npx playwright test tests/browser/portfolio.spec.ts
```

기존 GitHub Pages 워크플로가 main push 시 dist를 배포합니다. 기존 LAST POST 게임은 `/last-post.html`, LAST SEEN은 `/last-seen.html`에 보존했습니다. 기존 LAST POST 브라우저 테스트를 실행할 때는 시작 주소를 `/last-post.html`로 변경해야 합니다.

외부 3D 모델 없이 코드로 생성한 방입니다. Three.js는 번들에 포함됩니다. 외부 폰트 요청 없이 시스템 산세리프와 고정폭 폰트를 사용합니다.
