import { test, expect } from "@playwright/test";

test("walk immediately, approach computer, fullscreen CLI and exit", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator("#scene canvas")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "컴퓨터 앞에 앉기" }),
  ).toHaveCount(0);
  await expect(page.locator("#terminal")).toBeHidden();
  await page.keyboard.press("e");
  await expect(page.locator("#terminal")).toBeHidden();
  await page.screenshot({ path: "../../work/room-desktop-v2.png" });
  // No initial click: physical W works immediately, including Korean keyboard layouts.
  await page.keyboard.down("w");
  await expect(page.locator("#terminal")).toBeVisible({ timeout: 15000 });
  await page.keyboard.up("w");
  await expect(page.locator("#log")).toContainText("AVAILABLE COMMANDS");
  expect(await page.locator("#terminal").boundingBox()).toEqual({
    x: 0,
    y: 0,
    width: 1440,
    height: 900,
  });
  await page.screenshot({ path: "../../work/terminal-desktop-v2.png" });
  const input = page.getByRole("textbox", { name: "터미널 명령어" });
  await input.fill("pro");
  await input.press("Tab");
  await expect(input).toHaveValue("projects");
  await input.press("Enter");
  await expect(page.locator("#log")).toContainText("프로젝트 목록을 준비 중");
  await input.press("ArrowUp");
  await expect(input).toHaveValue("projects");
  await input.fill("<img src=x onerror=alert(1)>");
  await input.press("Enter");
  await expect(page.locator("#log img")).toHaveCount(0);
  await input.fill("clear");
  await input.press("Enter");
  await expect(page.locator("#log")).toBeEmpty();
  await input.fill("exit");
  await input.press("Enter");
  await expect(page.locator("#terminal")).toBeHidden();
  await expect(page.locator("#scene")).toBeFocused();
  // Exit leaves the visitor by the desk without immediately re-entering.
  await page.keyboard.down("s");
  await page.waitForTimeout(350);
  await page.keyboard.up("s");
  await expect(page.locator("#terminal")).toBeHidden();
  await page.keyboard.down("w");
  await expect(page.locator("#terminal")).toBeVisible({ timeout: 10000 });
  await page.keyboard.up("w");
  expect(errors).toEqual([]);
});

test("mobile movement controls, reduced motion, commands", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.screenshot({ path: "../../work/room-mobile-v2.png" });
  const forward = page.getByRole("button", { name: "앞으로 이동" });
  const bounds = (await forward.boundingBox())!;
  await page.mouse.move(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );
  await page.mouse.down();
  await expect(page.locator("#terminal")).toBeVisible({ timeout: 15000 });
  await page.mouse.up();
  await page.getByRole("button", { name: "contact", exact: true }).click();
  await expect(page.locator("#log a")).toHaveAttribute(
    "href",
    "https://github.com/kidcalmboy",
  );
  expect(await page.locator("#terminal").boundingBox()).toEqual({
    x: 0,
    y: 0,
    width: 390,
    height: 844,
  });
  await page.screenshot({ path: "../../work/terminal-mobile-v2.png" });
  await page.getByRole("button", { name: "방으로 돌아가기" }).click();
  await expect(page.locator("#terminal")).toBeHidden();
});
