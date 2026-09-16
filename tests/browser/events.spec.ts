import { test, expect } from '@playwright/test';
test('delayed story messages persist once and reveal unlocked contacts', async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('lastSeenSave', JSON.stringify({
    version:2, loggedIn:true, evidence:['minjae_chat','receipt_2247'], flags:['receiptRestored','projectUnlocked'], restored:['receipt'], read:[], searches:[], events:[], ending:null,
    settings:{master:0,music:0,sfx:0,textSpeed:1,reduceMotion:true}
  })));
  await page.goto('/last-seen.html');
  await page.getByRole('button',{name:/CONTINUE/}).click();
  await page.getByRole('navigation',{name:'앱'}).getByRole('button',{name:'Messenger',exact:true}).click();
  const messenger=page.getByRole('region',{name:'Messenger',exact:true});
  await messenger.getByRole('button',{name:/JH 박지훈/}).click();
  await expect(messenger.getByText('그 폴더 열었어?',{exact:true})).toBeVisible({timeout:12000});
  await expect(messenger.getByText(/공유 폴더 접속 알림/)).toBeVisible({timeout:12000});
  await expect(messenger.getByText('그 폴더 열었어?',{exact:true})).toHaveCount(1);
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('lastSeenSave')!));
  expect(saved.events.filter((id:string)=>id==='project_warning')).toHaveLength(1);
  await expect(messenger.getByRole('button',{name:/UNKNOWN/})).toBeVisible();
});
