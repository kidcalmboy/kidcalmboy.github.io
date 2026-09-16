import {icons} from './icons.js';

// Shell controls operate only on the fictional laptop, never on the host OS.
export function enhanceShell(root) {
  const desktop=root.querySelector('.desktop');
  if(!desktop)return;
  desktop.querySelector('.desktop-title')?.remove();
  desktop.querySelector('.city')?.remove();
  const bar=desktop.querySelector('.topbar');
  const left=bar.firstElementChild;
  left.querySelector('b').outerHTML='<button class="nova-menu" aria-label="NOVA 메뉴" aria-expanded="false">NOVA</button>';
  const app=left.querySelector('span');
  if(app.textContent==='Desktop')app.textContent='Finder';
  left.insertAdjacentHTML('beforeend','<button data-shell-menu="file">파일</button><button data-shell-menu="view">보기</button><button data-shell-menu="go">이동</button><button data-shell-menu="help">도움말</button>');
  bar.lastElementChild.insertAdjacentHTML('afterbegin','<button class="spotlight" aria-label="Spotlight 검색">⌕</button>');
  const shortcuts=desktop.querySelector('.desktop-shortcuts');
  shortcuts.innerHTML=`<button data-app="files"><span class="desktop-art drive"><svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="drive" x2="0" y2="1"><stop stop-color="#f1f1f4"/><stop offset="1" stop-color="#a1a6b0"/></linearGradient></defs><rect x="10" y="6" width="44" height="50" rx="5" fill="url(#drive)" stroke="#fff"/><path d="M11 45h42v8H11z" fill="#7e8590"/><circle cx="46" cy="49" r="2" fill="#a5f2b3"/></svg></span><b>NOVA HD</b></button><button data-app="files"><span class="desktop-art">${icons.files}</span><b>서준의 파일</b></button><button data-app="notes"><span class="desktop-art">${icons.notes}</span><b>todo.txt</b></button><button data-app="photos"><span class="desktop-art">${icons.photos}</span><b>최근 사진</b></button>`;
  // Finder-style selection on click, open on double-click or keyboard.
  shortcuts.querySelectorAll('button').forEach(button=>{
    const appId=button.dataset.app;
    delete button.dataset.app;
    button.onclick=()=>{shortcuts.querySelectorAll('button').forEach(b=>b.classList.remove('selected'));button.classList.add('selected');};
    const launch=()=>desktop.querySelector(`.dock [data-app="${appId}"]`).click();
    button.ondblclick=launch;
    button.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();launch();}};
  });
  const dock=desktop.querySelector('.dock');
  dock.prepend(dock.querySelector('[data-app="files"]'));
  dock.append(dock.querySelector('[data-app="trash"]'));
  const menu=desktop.querySelector('#menu');
  menu.hidden=true;
  const closeMenu=()=>{desktop.querySelector('.shell-dropdown')?.remove();desktop.querySelector('.nova-menu').setAttribute('aria-expanded','false');};
  const launch=id=>{closeMenu();dock.querySelector(`[data-app="${id}"]`).click();};
  const menus={
    nova:[['이 NOVA에 관하여',()=>menu.click()],['시스템 설정…',()=>menu.click()],['데스크탑 보기',()=>desktop.querySelector('#minimize')?.click()]],
    file:[['파일 열기',()=>launch('files')],['메모 열기',()=>launch('notes')]],
    view:[['데스크탑 보기',()=>desktop.querySelector('#minimize')?.click()],['증거 보드',()=>launch('evidence')]],
    go:[['홈',()=>launch('files')],['사진',()=>launch('photos')],['메시지',()=>launch('messenger')],['휴지통',()=>launch('trash')]],
    help:[['조사 안내',()=>{const d=document.createElement('dialog');d.innerHTML='<h2>NOVA 사용 안내</h2><p>바탕화면 아이콘은 두 번 클릭하거나 Enter로 엽니다.<br>Dock은 한 번 클릭해서 앱을 엽니다.</p><p>메신저와 사진을 조사하고 중요한 기록을 증거로 저장하세요.<br>증거 두 개를 찾으면 새로운 메시지가 도착합니다.</p><button>닫기</button>';desktop.append(d);d.showModal();d.querySelector('button').onclick=()=>d.remove();}]]
  };
  function showMenu(button,key){const wasOpen=desktop.querySelector('.shell-dropdown')?.dataset.key===key;closeMenu();if(wasOpen)return;const panel=document.createElement('div');panel.className='shell-dropdown';panel.dataset.key=key;panel.setAttribute('role','menu');panel.style.left=button.getBoundingClientRect().left+'px';menus[key].forEach(([label,action])=>{const item=document.createElement('button');item.textContent=label;item.setAttribute('role','menuitem');item.onclick=()=>{closeMenu();action();};panel.append(item);});desktop.append(panel);button.setAttribute('aria-expanded','true');panel.firstElementChild.focus();panel.onkeydown=e=>{if(e.key==='Escape'){closeMenu();button.focus();}};}
  desktop.querySelector('.nova-menu').onclick=e=>showMenu(e.currentTarget,'nova');
  desktop.querySelectorAll('[data-shell-menu]').forEach(b=>b.onclick=()=>showMenu(b,b.dataset.shellMenu));
  desktop.querySelector('.spotlight').onclick=()=>launch('browser');
  desktop.addEventListener('pointerdown',e=>{if(!e.target.closest('.topbar,.shell-dropdown'))closeMenu();});
}
