import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,restore,collect,ready} from '../src/state.js';
test('corrupt saves recover safely',()=>{assert.deepEqual(restore('{bad'),initial());assert.deepEqual(restore(null),initial());});
test('evidence is unique and validated',()=>{let s=collect(initial(),'chat');s=collect(s,'chat');s=collect(s,'invented');assert.deepEqual(s.evidence,['chat']);assert.equal(ready(s),false);assert.equal(ready(collect(s,'receipt')),true);});
test('progress survives reload',()=>{const s={...collect(collect(initial(),'chat'),'receipt'),loggedIn:true,event:true};assert.deepEqual(restore(JSON.stringify(s)),s);});
test('untrusted saves normalize their types',()=>{const s=restore(JSON.stringify({version:1,read:'x',evidence:['chat','chat','bad'],loggedIn:'yes'}));assert.deepEqual(s.evidence,['chat']);assert.deepEqual(s.read,[]);assert.equal(s.loggedIn,false);});
