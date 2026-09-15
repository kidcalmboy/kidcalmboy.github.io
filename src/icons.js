// Original vector glyphs: no platform artwork or external icon dependencies.
const svg=body=>`<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;
export const icons={
  messenger:svg('<path d="M32 18.5c0 7-7 12-14 11l-7 4 1-7C3 19 8 8 20 8c7 0 12 4 12 10.5Z" fill="white"/>'),
  mail:svg('<rect x="6" y="10" width="28" height="21" rx="3" stroke="white" stroke-width="2"/><path d="m7 12 13 10 13-10M7 30l9-10m17 10-9-10" stroke="white" stroke-width="1.5"/>'),
  browser:svg('<circle cx="20" cy="20" r="14" fill="#eefaff"/><circle cx="20" cy="20" r="11.5" fill="#2eaeec" stroke="#127dce"/><path d="m25 12-2 11-8 5 2-11Z" fill="#f15e61"/><path d="m17 17 6 6-8 5Z" fill="white"/>'),
  photos:svg(Array.from({length:8},(_,i)=>`<ellipse cx="20" cy="13" rx="5" ry="8" fill="${['#f86877','#ffac4e','#f0d55e','#78c86e','#4ec5ba','#63a0f0','#a98bdc','#e68ec1'][i]}" fill-opacity=".85" transform="rotate(${i*45} 20 20)"/>`).join('')+'<circle cx="20" cy="20" r="4" fill="white" fill-opacity=".8"/>'),
  files:svg('<path d="M5 12a3 3 0 0 1 3-3h9l4 4h11a3 3 0 0 1 3 3v15H5Z" fill="#a6e5ff"/><rect x="5" y="16" width="30" height="17" rx="3" fill="#55bbf0"/><path d="M7 17h26" stroke="#d8f4ff"/>'),
  notes:svg('<rect x="7" y="5" width="26" height="31" rx="3" fill="#fffef6"/><path d="M7 8a3 3 0 0 1 3-3h20a3 3 0 0 1 3 3v6H7Z" fill="#ffd55e"/><path d="M12 20h16m-16 5h16m-16 5h11" stroke="#bcbdbb" stroke-width="1.2"/>'),
  maps:svg('<rect x="5" y="5" width="30" height="30" rx="5" fill="#cae2b6"/><path d="m5 28 30-13M15 5l8 30" stroke="white" stroke-width="5"/><path d="m15 5 8 30" stroke="#e7b767" stroke-width="2"/><circle cx="25" cy="15" r="7" fill="#2688ed" stroke="white" stroke-width="2"/><circle cx="25" cy="15" r="2" fill="white"/>'),
  trash:svg('<path d="m10 12 2 23h16l2-23" fill="#e1e6ec" fill-opacity=".65" stroke="#f1f4f8"/><path d="M8 10h24M16 7h8m-8 9 1 15m7-15-1 15" stroke="#fff" stroke-width="2" stroke-linecap="round"/>'),
  evidence:svg('<rect x="7" y="7" width="26" height="26" rx="4" fill="#fff" fill-opacity=".17"/><path d="m13 14 14 11m-13 2 12-15" stroke="#ffd5bb" stroke-width="1.5"/><circle cx="13" cy="14" r="3" fill="white"/><circle cx="27" cy="25" r="3" fill="white"/><circle cx="14" cy="27" r="3" fill="white"/><circle cx="26" cy="12" r="3" fill="white"/>')
};
