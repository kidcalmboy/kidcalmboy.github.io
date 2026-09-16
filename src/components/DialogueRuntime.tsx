import {useEffect,useRef} from 'react';
import {advanceDialogue,getState,setState,useGame} from '../game/store';
export function DialogueRuntime({notify}:{notify:(contact:string,text:string)=>void}){
 const s=useGame(),known=useRef(new Set(s.story.history.map(m=>m.id)));
 useEffect(()=>{setState(getState());const t=setInterval(advanceDialogue,250);return()=>clearInterval(t);},[]);
 useEffect(()=>{const fresh=s.story.history.filter(m=>!known.current.has(m.id)&&m.sender!=='you'&&m.sender!=='silence');s.story.history.forEach(m=>known.current.add(m.id));const last=fresh.at(-1);if(last&&!last.id.endsWith('-prompt'))notify(last.contact,last.text);},[s.story.history,notify]);
 return null;
}
