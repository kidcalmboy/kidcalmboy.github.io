import { test, expect } from "@playwright/test";
test("photo inspection, comparison and map connection survive reload", async ({
  page,
}) => {
  await page.goto("/last-seen.html");
  await page.getByRole("button", { name: "NEW GAME", exact: true }).click();
  await page.getByLabel("노트북 비밀번호").fill("0617");
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  const dock = page.getByRole("navigation", { name: "앱" });
  await dock.getByRole("button", { name: "Photos", exact: true }).click();
  const photos = page.getByRole("region", { name: "Photos", exact: true });
  await photos
    .getByRole("button", { name: "IMG_4820.jpg", exact: true })
    .click();
  await expect(
    photos.getByRole("button", { name: "+ 증거로 저장", exact: true }),
  ).toHaveCount(0);
  await photos.getByRole("button", { name: "표지판 자세히 보기" }).click();
  await photos
    .getByRole("button", { name: "+ 증거로 저장", exact: true })
    .click();
  await photos.getByRole("button", { name: /모든 사진/ }).click();
  await photos
    .getByRole("button", { name: "IMG_4822.jpg", exact: true })
    .click();
  await photos.getByRole("button", { name: "출입구 표식 자세히 보기" }).click();
  await photos
    .getByRole("button", { name: "+ 증거로 저장", exact: true })
    .click();
  await dock.getByRole("button", { name: "Evidence", exact: true }).click();
  const board = page.getByRole("region", { name: "Evidence", exact: true });
  await board
    .getByRole("button", { name: "두 사진의 색온도", exact: true })
    .click();
  await expect(board.getByRole("status")).toContainText(
    "뒷받침하는 기록은 없습니다",
  );
  await board
    .getByRole("button", {
      name: "청운물류 B동이라는 이름과 지하 출입구 표식",
      exact: true,
    })
    .click();
  await expect(board.locator(".deduction-conclusion")).toContainText("일치");
  await dock.getByRole("button", { name: "Maps", exact: true }).click();
  await expect(page.locator(".route-comparison")).toContainText(
    "B1 야간 출입구",
  );
  await page.reload();
  await page.getByRole("button", { name: /CONTINUE/ }).click();
  await dock.getByRole("button", { name: "Maps", exact: true }).click();
  await expect(page.locator(".route-comparison")).toBeVisible();
});
test("hidden record adds epilogue only to true ending", async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "lastSeenSave",
      JSON.stringify({
        version: 2,
        loggedIn: true,
        evidence: [
          "receipt_2247",
          "project_n",
          "jihoon_payment",
          "draft_email",
          "final_audio",
          "hidden_location",
        ],
        flags: [
          "receiptRestored",
          "projectUnlocked",
          "zipUnlocked",
          "audioRestored",
        ],
        restored: [],
        read: [],
        searches: [],
        events: ["project_warning", "project_warning_2"],
        ending: null,
        story: {conversationProgress:{final_audio:'done'},relationships:{harin:{trust:2}}},
        settings: {
          master: 0,
          music: 0,
          sfx: 0,
          textSpeed: 1,
          reduceMotion: true,
        },
      }),
    ),
  );
  await page.goto("/last-seen.html");
  await page.getByRole("button", { name: /CONTINUE/ }).click();
  const dock = page.getByRole("navigation", { name: "앱" });
  await dock.getByRole("button", { name: "Files", exact: true }).click();
  const files = page.getByRole("region", { name: "Files", exact: true });
  await files
    .locator(".file-grid")
    .getByRole("button", { name: "Documents", exact: true })
    .click();
  await files
    .locator(".file-grid")
    .getByRole("button", { name: "PROJECT_N", exact: true })
    .click();
  await files.getByRole("button", { name: "archive", exact: true }).click();
  await files.getByRole("button", { name: "next.txt", exact: true }).click();
  await files.getByRole("button", { name: /보관된 메타데이터/ }).click();
  await dock.getByRole("button", { name: "Evidence", exact: true }).click();
  const board = page.getByRole("region", { name: "Evidence", exact: true });
  await board.getByRole("button", { name: "박지훈", exact: true }).click();
  await board
    .getByRole("button", { name: "확인 · 자료 제출", exact: true })
    .click();
  await expect(page.locator(".hidden-record")).toContainText("N_02");
});
