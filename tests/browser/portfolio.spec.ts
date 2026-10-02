import { test, expect } from "@playwright/test";

test("room, seating, terminal commands and return", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator("#scene canvas")).toBeVisible();
  await page.screenshot({ path: "../../work/room-desktop.png" });
  await page.getByRole("button", { name: "컴퓨터 앞에 앉기" }).click();
  await expect(page.locator("#terminal")).toBeVisible();
  await expect(page.locator("#log")).toContainText("AVAILABLE COMMANDS");
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
  await page.getByRole("button", { name: "about", exact: true }).click();
  await expect(page.locator("#log")).toContainText("Computer Science Student");
  await page.screenshot({ path: "../../work/terminal-desktop.png" });
  await input.fill("clear");
  await input.press("Enter");
  await expect(page.locator("#log")).toBeEmpty();
  await input.fill("exit");
  await input.press("Enter");
  await expect(page.locator("#terminal")).toBeHidden();
  await expect(page.locator("#intro")).toBeVisible();
  expect(errors).toEqual([]);
});

test("mobile direct terminal and reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.screenshot({ path: "../../work/room-mobile.png" });
  await page.getByRole("button", { name: "터미널 바로가기" }).click();
  await page.getByRole("button", { name: "contact", exact: true }).click();
  await expect(page.locator("#log a")).toHaveAttribute(
    "href",
    "https://github.com/kidcalmboy",
  );
  await page.screenshot({ path: "../../work/terminal-mobile.png" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "방으로 돌아가기" }).click();
  await page.getByRole("button", { name: "컴퓨터 앞에 앉기" }).click();
  await expect(page.locator("#terminal")).toBeVisible();
});
