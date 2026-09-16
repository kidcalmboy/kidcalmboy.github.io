import {test,expect} from '@playwright/test';
test('reply is recorded once, typing resumes after reload and CASE retains history',async({page})=>{
 await page.goto('/last-seen.html');await page.getByRole('button',{name:'NEW GAME',exact:true}).click();await page.getByLabel('노트북 비밀번호').fill('0617');await page.getByRole('button',{name:'로그인',exact:true}).click();
 await expect(page.getByRole('region',{name:'CASE FEED'})).toBeVisible();
 await page.getByRole('navigation',{name:'앱'}).getByRole('button',{name:'Messenger',exact:true}).click();const chat=page.getByRole('region',{name:'Messenger',exact:true});
 await chat.getByRole('button',{name:'아니.',exact:true}).click();await expect(chat.locator('.player-reply')).toHaveText('아니.You');
 await page.reload();await page.getByRole('button',{name:/CONTINUE/}).click();await page.getByRole('navigation',{name:'앱'}).getByRole('button',{name:'Messenger',exact:true}).click();await expect(chat.locator('.player-reply')).toHaveCount(1);await expect(chat.getByRole('button',{name:'아니.',exact:true})).toHaveCount(0);await expect(chat.getByText('그래?',{exact:true})).toBeVisible();
 const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('lastSeenSave')!));expect(state.story.selectedChoices.intro).toBe('lie');expect(state.story.relationships.minjae.trust).toBe(-1);expect(state.story.memoryFlags.liedToMinjaeAboutLaptop).toBe(true);
});
