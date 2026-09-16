import { test, expect } from "@playwright/test";
test("every app opens without rendering errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") {
      errors.push(m.text());
      console.log(m.text(), m.location());
    }
  });
  page.on("pageerror", (e) => {
    errors.push(e.message);
    console.log(e.message);
  });
  page.on("response", (r) => {
    if (r.status() >= 400) console.log("HTTP", r.status(), r.url());
  });
  await page.goto("/last-seen.html");
  await page.getByRole("button", { name: "NEW GAME", exact: true }).click();
  await page.getByLabel("노트북 비밀번호").fill("0617");
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  for (const name of [
    "Files",
    "Messenger",
    "Photos",
    "Mail",
    "Browser",
    "Notes",
    "Maps",
    "Trash",
    "Evidence",
  ]) {
    await page
      .getByRole("navigation", { name: "앱" })
      .getByRole("button", { name, exact: true })
      .click();
    await expect(page.locator(".nova-desktop")).toBeVisible();
  }
  expect(errors).toEqual([]);
});
