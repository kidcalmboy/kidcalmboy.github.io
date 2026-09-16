import { test, expect } from "@playwright/test";
test("Chrome-style tabs, address history, bookmarks and Messages styling", async ({
  page,
}) => {
  await page.goto("/last-seen.html");
  await page.getByRole("button", { name: "NEW GAME", exact: true }).click();
  await page.getByLabel("노트북 비밀번호").fill("0617");
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  await page.getByRole("button", { name: "CASE FEED 접기" }).click();
  await page
    .getByRole("navigation", { name: "앱" })
    .getByRole("button", { name: "Browser", exact: true })
    .click();
  const browser = page.getByRole("region", { name: "Browser", exact: true });
  await expect(browser.getByRole("tab", { name: /새 탭/ })).toBeVisible();
  await browser.getByLabel("주소 또는 검색어").fill("강도윤");
  await browser.getByLabel("주소 또는 검색어").press("Enter");
  await expect(
    browser.getByRole("heading", { name: "강도윤 · 사회부 기자" }),
  ).toBeVisible();
  await browser.getByLabel("주소 또는 검색어").fill("도서관");
  await browser.getByLabel("주소 또는 검색어").press("Enter");
  await browser.getByRole("button", { name: "뒤로", exact: true }).click();
  await expect(
    browser.getByRole("heading", { name: "강도윤 · 사회부 기자" }),
  ).toBeVisible();
  await browser.getByRole("button", { name: "앞으로", exact: true }).click();
  await expect(
    browser.getByRole("heading", { name: "중앙도서관", exact: true }),
  ).toBeVisible();
  await browser.getByRole("button", { name: "새 탭 열기" }).click();
  await expect(browser.getByRole("tab")).toHaveCount(2);
  await browser.getByLabel("새 탭 검색").fill("BLUE ROOM");
  await browser.getByLabel("새 탭 검색").press("Enter");
  await expect(
    browser.getByRole("heading", { name: "BLUE ROOM", exact: true }),
  ).toHaveCount(2);
  await browser.getByRole("button", { name: "BLUE ROOM 탭 닫기" }).click();
  await expect(
    browser.getByRole("heading", { name: "중앙도서관", exact: true }),
  ).toBeVisible();
  await expect(browser.locator('.chrome-toolbar')).toHaveCSS('display', 'flex');
  await page.screenshot({ path: "test-results/nova-chrome.png", animations: "disabled" });
  await browser.getByLabel("Browser 닫기").click();
  await page
    .getByRole("navigation", { name: "앱" })
    .getByRole("button", { name: "Messenger", exact: true })
    .click();
  await expect(page.getByRole("region", { name: "답장 선택" })).toBeVisible();
  await page.screenshot({ path: "test-results/nova-replies.png", animations: "disabled" });
});
