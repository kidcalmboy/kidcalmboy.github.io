export const KEY='last-seen-save-v1';
export const initial=()=>({version:1,loggedIn:false,read:[],evidence:[],receipt:false,event:false});
export function restore(raw){try{const s=JSON.parse(raw);if(s?.version!==1)return initial();return {...initial(),loggedIn:s.loggedIn===true,read:Array.isArray(s.read)?s.read.filter(x=>['minjae','harin','jihoon','mom'].includes(x)):[],evidence:Array.isArray(s.evidence)?[...new Set(s.evidence.filter(x=>['chat','receipt'].includes(x)))]:[],receipt:s.receipt===true,event:s.event===true};}catch{return initial();}}
export function collect(state,id){if(!['chat','receipt'].includes(id))return state;return {...state,evidence:[...new Set([...state.evidence,id])]};}
export const ready=s=>s.evidence.includes('chat')&&s.evidence.includes('receipt');
