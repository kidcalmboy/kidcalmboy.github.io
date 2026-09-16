import { test, expect, type Page } from "@playwright/test";
const app = (page: Page, name: string) =>
  page.getByRole("region", { name, exact: true });
async function open(page: Page, name: string) {
  await page
    .getByRole("navigation", { name: "앱" })
    .getByRole("button", { name, exact: true })
    .click();
  return app(page, name);
}
async function begin(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: /프롤로그 건너뛰기/ }).click();
  await expect(page.locator(".lp-boot")).toHaveCount(0);
}
async function login(page: Page) {
  await begin(page);
  await page.getByLabel("MOMENT 비밀번호").fill("1103");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
}
test("LAST POST birthday puzzle, white desktop, four apps, saved notes and reload", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await begin(page);
  await page.getByLabel("MOMENT 비밀번호").fill("1104");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("일치하지");
  await page
    .getByRole("button", { name: "내 계정으로 공개 프로필 보기" })
    .click();
  await page
    .getByRole("button", { name: "게시물 열기 birthday", exact: true })
    .click();
  await page
    .getByRole("button", { name: "View original", exact: true })
    .click();
  await expect(page.getByText(/Taken November 3, 2027/).first()).toBeVisible();
  await page
    .getByRole("button", { name: "Save to Notes: 사진 원본 정보", exact: true })
    .click();
  await page.getByRole("button", { name: "모달 닫기" }).click();
  await page.locator(".lp-nav-bottom .lp-user").click();
  await page.getByLabel("MOMENT 비밀번호").fill("1103");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(
    page.getByRole("navigation", { name: "앱" }).getByRole("button"),
  ).toHaveCount(4);
  await page.screenshot({
    path: "test-results/lastpost-feed.png",
    animations: "disabled",
  });
  await app(page, "Moment")
    .getByRole("navigation", { name: "MOMENT" })
    .getByRole("button", { name: "Messages", exact: true })
    .click();
  await page
    .getByRole("button", { name: "응. 언니가 부탁했어.", exact: true })
    .click();
  await page.reload();
  await app(page, "Moment")
    .getByRole("navigation", { name: "MOMENT" })
    .getByRole("button", { name: "Messages", exact: true })
    .click();
  await expect(
    page.locator('.lp-message-list').getByText("나도 마지막에 좀 이상했거든.", { exact: true }),
  ).toBeVisible();
  const notes = await open(page, "Notes");
  await notes.locator('.lp-note-list').getByRole("button", { name: /사진 원본 정보/ }).click();
  await expect(notes.getByLabel("메모 본문")).toHaveValue(/November 3/);
  await notes.getByLabel("메모 본문").fill("촬영 날짜와 업로드 날짜가 다르다.");
  await notes.getByRole("button", { name: "Pin note", exact: true }).click();
  await page.screenshot({
    path: "test-results/lastpost-notes.png",
    animations: "disabled",
  });
  await open(page, "Browser");
  await page.getByLabel("NORTH 주소 또는 검색어").fill("MOTIONLAB");
  await page.getByLabel("NORTH 주소 또는 검색어").press("Enter");
  await expect(
    page.getByRole("button", { name: /인플루언서 마케팅 시장/ }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/lastpost-browser.png",
    animations: "disabled",
  });
  await open(page, "Mail");
  await expect(
    page.getByRole("heading", { name: "윤아 계정, 확인해 줄 수 있어?" }),
  ).toBeVisible();
  await page.reload();
  await open(page, "Notes");
  await page.locator('.lp-note-list').getByRole("button", { name: /사진 원본 정보/ }).click();
  await expect(page.getByLabel("메모 본문")).toHaveValue(
    "촬영 날짜와 업로드 날짜가 다르다.",
  );
  expect(errors).toEqual([]);
});
test("1280 window controls and mobile notice", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await login(page);
  await page.screenshot({
    path: "test-results/lastpost-1280.png",
    animations: "disabled",
  });
  await page.getByLabel("Moment 최소화").click();
  await expect(app(page, "Moment")).toBeHidden();
  await open(page, "Moment");
  await page.getByLabel("Moment 확대").click();
  await expect(app(page, "Moment")).toHaveClass(/maximized/);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(
    page.getByText("LAST POST is designed for desktop."),
  ).toBeVisible();
});
