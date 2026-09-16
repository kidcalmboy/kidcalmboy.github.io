import { test, expect } from '@playwright/test';
import { fresh, login, choose, tick, discover } from '../../src/lastpost/engine.ts';
test('consecutive sent messages and all replies remain separate after reload', async ({ page }) => {
  let s = login({...fresh(), started:true}, '1103');
  s = tick(choose(s,'intro','honest',0),2000);
  // Use actual dialogue choices; no fabricated message IDs.
  const { dialogues } = await import('../../src/lastpost/data.ts');
  const d = dialogues.find(d=>d.id==='first-lead')!;
  s = tick(choose(s,d.id,d.options[0].id,3000),5000);
  await page.addInitScript(state => {localStorage.setItem('lastPostSave.v1',JSON.stringify(state));localStorage.setItem('lastPostPrologue.v1','seen');},s);
  await page.setViewportSize({width:1280,height:720});
  await page.goto('/');
  await page.getByRole('navigation',{name:'MOMENT'}).getByRole('button',{name:'Messages',exact:true}).click();
  const groups = page.locator('.lp-message-group');
  await expect(groups).toHaveCount(s.messages.length);
  const boxes = await groups.evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {top:r.top,bottom:r.bottom,height:r.height,content:n.scrollHeight};}));
  for(let i=0;i<boxes.length-1;i++) expect(boxes[i+1].top).toBeGreaterThanOrEqual(boxes[i].bottom);
  for(const box of boxes) expect(box.height).toBeGreaterThanOrEqual(box.content-1);
  await expect(page.locator('.lp-message-group .mine')).toHaveCount(3);
  await page.reload();
  await page.getByRole('navigation',{name:'MOMENT'}).getByRole('button',{name:'Messages',exact:true}).click();
  await expect(page.locator('.lp-message-group .mine')).toHaveCount(3);
});
test('chapter caption disappears and never remains in the investigation guide', async ({page}) => {
  const s=discover(login({...fresh(),started:true},'1103'),'last','sea-dislike','hyunwoo-dm');
  await page.addInitScript(state=>{localStorage.setItem('lastPostSave.v1',JSON.stringify(state));localStorage.setItem('lastPostPrologue.v1','seen');},s);
  await page.goto('/');
  await expect(page.locator('.lp-narration')).toBeVisible();
  await expect(page.locator('.lp-desktop-ui')).not.toHaveAttribute('inert');
  await expect(page.getByRole('region',{name:'다음 조사 안내'})).not.toContainText('CHAPTER');
  await expect(page.locator('.lp-narration')).toHaveCount(0,{timeout:20000});
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('lastPostSave.v1')!));
  expect(saved.seenChapters).toBe(1);
});
