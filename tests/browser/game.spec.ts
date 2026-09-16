import { test, expect, type Page } from "@playwright/test";
async function login(page: Page) {
  await page.goto("/last-seen.html");
  await page.getByRole("button", { name: "NEW GAME", exact: true }).click();
  await page.getByLabel("노트북 비밀번호").fill("0000");
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  await expect(page.getByRole("alert")).toHaveText("Password incorrect");
  await page.getByLabel("노트북 비밀번호").fill("0617");
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  await expect(page.locator(".nova-desktop")).toBeVisible();
}
async function open(page: Page, name: string) {
  await page
    .getByRole("navigation", { name: "앱" })
    .getByRole("button", { name, exact: true })
    .click();
  return page
    .locator(".nova-window")
    .filter({
      has: page.locator(".window-bar>span", {
        hasText: new RegExp(`^${name}$`),
      }),
    });
}
test("desktop windows, puzzles, restore, reload and three endings", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await login(page);
  const messenger = await open(page, "Messenger");
  await messenger
    .getByRole("button", { name: "+ 증거로 저장", exact: true })
    .click();
  const photos = await open(page, "Photos");
  await expect(page.locator(".nova-window")).toHaveCount(2);
  const before = await photos.boundingBox();
  const bar = photos.locator(".window-bar");
  const pos = await bar.boundingBox();
  await page.mouse.move(pos!.x + 320, pos!.y + 22);
  await page.mouse.down();
  await page.mouse.move(pos!.x + 365, pos!.y + 45);
  await page.mouse.up();
  expect((await photos.boundingBox())!.x).not.toEqual(before!.x);
  await photos.getByLabel("Photos 최소화").click();
  await expect(photos).toBeHidden();
  await open(page, "Photos");
  await expect(photos).toBeVisible();
  await photos.getByLabel("Photos 닫기").click();
  const trash = await open(page, "Trash");
  await trash
    .locator(".recovery-row")
    .filter({ hasText: "receipt_old.jpg" })
    .getByRole("button", { name: "복원", exact: true })
    .click();
  await trash
    .getByRole("button", { name: "+ 증거로 저장", exact: true })
    .click();
  const files = await open(page, "Files");
  await files
    .locator(".file-grid")
    .getByRole("button", { name: "Documents", exact: true })
    .click();
  await files
    .locator(".file-grid")
    .getByRole("button", { name: /PROJECT_N/ })
    .click();
  await files.getByLabel("PROJECT_N 암호").fill("wrong");
  await files.getByRole("button", { name: "잠금 해제", exact: true }).click();
  await expect(files.getByRole("alert")).toContainText("일치하지");
  await files.getByLabel("PROJECT_N 암호").fill("orbit");
  await files.getByRole("button", { name: "잠금 해제", exact: true }).click();
  await files
    .getByRole("button", { name: "accounts.csv", exact: true })
    .click();
  await expect(files.getByRole("table")).toContainText("nobody_404");
  await files
    .getByRole("button", { name: "+ 증거로 저장", exact: true })
    .click();
  const mail = await open(page, "Mail");
  await mail.getByRole("button", { name: "Drafts", exact: true }).click();
  await mail.getByRole("button", { name: /제보하고 싶은 게/ }).click();
  await mail
    .getByRole("button", { name: "+ 증거로 저장", exact: true })
    .click();
  await mail.getByLabel("ZIP 암호").fill("nobody_404");
  await mail.getByRole("button", { name: "압축 열기", exact: true }).click();
  await mail
    .getByRole("button", { name: "+ 증거로 저장", exact: true })
    .click();
  await open(page, "Trash");
  await trash
    .locator(".recovery-row")
    .filter({ hasText: "voice_temp.m4a" })
    .getByRole("button", { name: "복원", exact: true })
    .click();
  await trash
    .getByRole("button", { name: "+ 증거로 저장", exact: true })
    .click();
  const live = await open(page, "Messenger");
  await live.getByRole('button',{name:/JH 박지훈/}).click();
  await live.getByRole('button',{name:'알겠어.',exact:true}).click({timeout:15000});
  await live.getByRole('button',{name:'Message · 질문하기',exact:true}).click();
  await live.getByRole('button',{name:'마지막 녹음에 대해 연락하기',exact:true}).click();
  await live.getByRole('button',{name:'아무 메시지도 보내지 않는다.',exact:true}).click();
  await expect(live.getByRole('button',{name:'Message · 질문하기',exact:true})).toBeVisible();
  let board = await open(page, "Evidence");
  await board.getByRole("button", { name: "김민재", exact: true }).click();
  await board
    .getByRole("button", { name: "확인 · 자료 제출", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "WRONG PERSON" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "조사로 돌아가기" }).click();
  board = await open(page, "Evidence");
  await board.getByRole("button", { name: "박지훈", exact: true }).click();
  await board
    .getByRole("button", { name: "확인 · 자료 제출", exact: true })
    .click();
  await expect(page.getByRole("heading", { name: "THE TRUTH" })).toBeVisible();
  await page.getByRole("button", { name: "조사로 돌아가기" }).click();
  await open(page,'Messenger');
  await live.getByRole('button',{name:/HR 윤하린/}).click();
  await live.getByRole('button',{name:'Message · 질문하기',exact:true}).click();
  await live.getByRole('button',{name:'서준이 마지막으로 무슨 얘기 했어?',exact:true}).click();
  await live.getByRole('button',{name:'말하기 힘들면 천천히 해도 돼.',exact:true}).click();
  const restoredTrash = await open(page, "Trash");
  await restoredTrash
    .locator(".recovery-row")
    .filter({ hasText: "location_sync.json" })
    .getByRole("button", { name: "복원", exact: true })
    .click();
  const maps = await open(page, "Maps");
  await maps.getByRole("button", { name: /청운물류 B동/ }).click();
  await maps
    .getByRole("button", { name: "+ 증거로 저장", exact: true })
    .click();
  await page.reload();
  await page.getByRole("button", { name: /CONTINUE/ }).click();
  await expect(page.locator(".nova-desktop")).toBeVisible();
  board = await open(page, "Evidence");
  await expect(board.locator(".cards article")).toHaveCount(9);
  await board.getByRole("button", { name: "박지훈", exact: true }).click();
  await board
    .getByRole("button", { name: "확인 · 자료 제출", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "LAST SEEN", exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("1280 desktop screenshot and settings", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await login(page);
  await page.waitForTimeout(4100);
  await page.screenshot({ path: "test-results/nova-desktop.png" });
  await open(page, "Messenger");
  await page.screenshot({ path: "test-results/nova-messenger.png" });
  await page.keyboard.press("Escape");
  await expect(page.locator(".nova-window")).toHaveCount(0);
  await page.getByRole("button", { name: "NOVA", exact: true }).click();
  await page.getByRole("menuitem", { name: "시스템 설정…" }).click();
  await page.getByLabel("동작 줄이기").check();
  await expect(page.locator("html")).toHaveAttribute(
    "data-reduce-motion",
    "true",
  );
});
