import { test, expect, type Page } from "@playwright/test";
async function close(page: Page) {
  const button = page.getByRole("button", { name: "모달 닫기", exact: true });
  if (await button.isVisible()) await button.click();
}
async function moment(page: Page, label: string) {
  await page
    .getByRole("navigation", { name: "앱" })
    .getByRole("button", { name: "Moment", exact: true })
    .click();
  await close(page);
  await page
    .getByRole("navigation", { name: "MOMENT" })
    .getByRole("button", { name: label, exact: true })
    .click();
}
async function post(page: Page, id: string) {
  await moment(page, "Explore");
  await page.getByLabel("MOMENT 검색").fill("");
  await page
    .getByRole("button", { name: `게시물 열기 ${id}`, exact: true })
    .click();
}
async function dm(page: Page, name: string, question: string, choice: string) {
  await moment(page, "Messages");
  await page.locator(".lp-dm-contact").filter({ hasText: name }).click();
  await page.getByRole("button", { name: question, exact: true }).click();
  await page.getByRole("button", { name: choice, exact: true }).click();
  await expect(page.locator(".lp-conversation footer")).not.toContainText(
    "답장을 기다리는 중",
  );
}
async function article(page: Page, query: string, title: string) {
  await page
    .getByRole("navigation", { name: "앱" })
    .getByRole("button", { name: "Browser", exact: true })
    .click();
  await close(page);
  await page.getByLabel("NORTH 주소 또는 검색어").fill(query);
  await page.getByLabel("NORTH 주소 또는 검색어").press("Enter");
  await page
    .locator(".lp-results")
    .getByRole("button", { name: title, exact: true })
    .click();
}
test("LAST POST complete investigation reaches all chapters and true ending without injected progress", async ({
  page,
}) => {
  test.setTimeout(240000);
  page.setDefaultTimeout(15000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.getByRole("button", { name: /프롤로그 건너뛰기/ }).click();
  await expect(page.locator('.lp-boot')).toHaveCount(0);
  await page.getByLabel("MOMENT 비밀번호").fill("1103");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await moment(page, "Messages");
  await page
    .getByRole("button", { name: "응. 언니가 부탁했어.", exact: true })
    .click();
  await expect(page.locator(".lp-conversation footer")).not.toContainText(
    "답장을 기다리는 중",
  );
  await post(page, "last");
  await close(page);
  await dm(page, "박현우", "윤아 마지막으로 언제 봤어?", "왜 그렇게 연락했어?");
  await post(page, "busan-old");
  await close(page);
  await moment(page, "Archive");
  await page.getByRole("button", { name: /진짜 마지막으로 말한다/ }).click();
  await close(page);
  await dm(
    page,
    "이가은",
    "걔 만나러 가는 거냐고 물었잖아. 누구야?",
    "윤아 찾으려는 거야.",
  );
  await moment(page, "Activity");
  await page
    .locator(".lp-record")
    .filter({ hasText: "사용 허락한 적 없습니다." })
    .getByRole("button", { name: "View record ↗", exact: true })
    .click();
  await close(page);
  await dm(
    page,
    "김태준",
    "윤아 사진 광고에 쓴 거 알아?",
    "윤아가 싫다고 했잖아.",
  );
  await post(page, "live");
  await close(page);
  await post(page, "last");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "o ocean021", exact: true })
    .click()
    .catch(async () => {
      await page
        .locator(".lp-comments .lp-user")
        .filter({ hasText: "ocean021" })
        .click();
    });
  await expect(page.getByText("This account is private")).toBeVisible();
  await page.getByRole("button", { name: "4 following", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /minsuk.j/ })
    .click();
  await article(
    page,
    "MOTIONLAB",
    "크리에이터 이미지 무단 사용 논란… 계약 범위 둘러싼 분쟁",
  );
  await page
    .locator(".lp-news-comment")
    .getByRole("button", { name: "@sera.archive", exact: true })
    .click();
  await dm(
    page,
    "서라",
    "MOTIONLAB 기사 댓글 보고 연락했어요.",
    "어떤 일을 겪으셨나요?",
  );
  await post(page, "busan");
  await page
    .getByRole("button", { name: "View cached comments", exact: true })
    .click();
  await close(page);
  await article(
    page,
    "정민석 6월18일",
    "콘텐츠 기업 관계자, 강남 브랜드 네트워킹 행사 참석",
  );
  await page.getByRole("button", { name: "기사 사진 확대" }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", {
      name: "Save to Notes: 콘텐츠 기업 관계자, 강남 브랜드 네트워킹 행사 참석",
      exact: true,
    })
    .click();
  await close(page);
  await moment(page, "Archive");
  await page.getByRole("button", { name: /Story unavailable/ }).click();
  await close(page);
  await dm(
    page,
    "이가은",
    "22:06에 삭제된 스토리, 기억해?",
    "무슨 일이었는지만 알고 싶어.",
  );
  await dm(
    page,
    "박현우",
    "MOTIONLAB 대표에 대해 알고 있었어?",
    "알고 있는 것만 말해줘.",
  );
  await post(page, "last");
  await page
    .getByRole("button", { name: "Search image on web ↗", exact: true })
    .click();
  await page
    .locator(".lp-results")
    .getByRole("button", { name: "겨울 동해 여행 사진 모음", exact: true })
    .click();
  await page
    .getByRole("button", {
      name: "Save to Notes: 겨울 동해 여행 사진 모음",
      exact: true,
    })
    .click();
  await moment(page, "Activity");
  await page
    .locator(".lp-record")
    .filter({ hasText: "Image imported from browser" })
    .getByRole("button", { name: "View record ↗", exact: true })
    .click();
  await close(page);
  await post(page, "desk");
  await page.getByRole("button", { name: "사진 확대", exact: true }).click();
  await page
    .getByRole("button", {
      name: "Save to Notes: Office days · 확대된 화면",
      exact: true,
    })
    .click();
  await close(page);
  await article(
    page,
    "6월19일 신원미상 여성",
    "서울 외곽서 신원 미상 20대 여성 구조",
  );
  await page
    .getByRole("navigation", { name: "앱" })
    .getByRole("button", { name: "Mail", exact: true })
    .click();
  await page
    .locator(".lp-mail-list")
    .getByRole("button", { name: /Content Usage Agreement/ })
    .click();
  await page
    .locator(".lp-mail-list")
    .getByRole("button", { name: /윤아 계정, 확인해 줄 수 있어/ })
    .click();
  await page.getByRole("button", { name: "조사 자료를 첨부해 답장" }).click();
  await page.getByLabel("정민석", { exact: true }).check();
  for (const text of [
    "바다 사진 원본 사이트",
    "서울 행사 원본 사진",
    "ocean021 노트북 화면",
  ])
    await page.getByLabel(text, { exact: true }).check();
  await page.getByRole("button", { name: "자료 전달", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "그녀를 찾았다." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "며칠 후 · 새 메시지" }).click();
  await page.getByRole("button", { name: "거의 다.", exact: true }).click();
  await expect(page.getByText(/진짜 못 본 걸로 해라/)).toBeVisible();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("lastPostSave.v1")!),
  );
  expect(saved.ending).toBe("true");
  expect(saved.seenChapters).toBe(5);
  expect(errors).toEqual([]);
  await page.screenshot({
    path: "test-results/lastpost-ending.png",
    animations: "disabled",
  });
});
