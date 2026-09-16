import { test, expect } from '@playwright/test';
test('cinematic introduction, controls, login handoff and saved replay state', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('main', {name:'프롤로그'})).toBeVisible();
  await expect(page.getByRole('heading')).toHaveText('윤아의 계정에 사진 한 장이 올라왔다.');
  await page.getByRole('button',{name:'잠시 멈추기'}).click();
  await page.getByRole('button',{name:'다음 장면'}).click();
  await expect(page.getByRole('heading')).toHaveText('그 후, 윤아는 연락을 받지 않았다.');
  await page.getByRole('button',{name:'이전',exact:true}).click();
  for(let i=0;i<5;i++) await page.getByRole('button',{name:'다음 장면'}).click();
  await expect(page.getByRole('heading')).toHaveText('윤아의 SNS, MOMENT에 접속하자.');
  await page.screenshot({path:'test-results/prologue.png', animations:'disabled'});
  await page.getByRole('button',{name:'윤아의 MOMENT 열기'}).click();
  await expect(page.locator('.lp-boot')).toHaveCount(0);
  await expect(page.getByLabel('MOMENT 비밀번호')).toBeVisible();
  await page.reload();
  await expect(page.getByRole('main',{name:'프롤로그'})).toHaveCount(0);
});
