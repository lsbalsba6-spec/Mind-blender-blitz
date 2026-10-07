import type{Challenge,Mechanic}from'./types';
const pick=<T,>(a:T[])=>a[Math.floor(Math.random()*a.length)];
const shuffle=<T,>(a:T[])=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
const one=(prompt:string,labels:string[],answer:string,mechanic:Mechanic):Challenge=>{const choices=shuffle(labels).map((label,i)=>({id:String(i),label}));return{prompt,choices,correctIds:choices.filter(c=>c.label===answer).map(c=>c.id),mechanic}};
const symbols=['△','◇','○','□','✦','⬡'];
export function generateChallenge(mechanic:Mechanic,difficulty=1):Challenge{
 const nums=Array.from({length:9},()=>Math.floor(Math.random()*(10+difficulty*4))+1);
 switch(mechanic){
  case'evenOdd':{const even=Math.random()>.5,want=even?'EVEN':'ODD',answer=(Math.floor(Math.random()*12)+1)*2+(even?0:1),wrong=Array.from({length:5},()=>((Math.floor(Math.random()*12)+1)*2+(even?1:0)));return one(`SELECT THE ${want} NUMBER`,[String(answer),...wrong.map(String)],String(answer),mechanic)}
  case'greaterLess':{const values=shuffle([...new Set(nums)]).slice(0,4);while(values.length<4)values.push(Math.max(...values,0)+1);const greater=Math.random()>.5,answer=String(greater?Math.max(...values):Math.min(...values));return one(greater?'SELECT THE GREATEST':'SELECT THE SMALLEST',values.map(String),answer,mechanic)}
  case'quickCalc':{const a=pick(nums),b=pick(nums),sum=a+b;return one(`${a} + ${b} = ?`,[sum,sum+1,sum-1,sum+2].map(String),String(sum),mechanic)}
  case'sequence':case'pattern':{const start=Math.floor(Math.random()*5)+1,step=Math.floor(Math.random()*4)+2,answer=start+step*4;return one(`${start} · ${start+step} · ${start+step*2} · ${start+step*3} · ?`,[answer,answer+step,answer-step,answer+1].map(String),String(answer),mechanic)}
  case'inhibition':case'avoidRules':{const labels=['CYAN','VIOLET','AMBER','WHITE'];const choices=shuffle(labels).map((label,i)=>({id:String(i),label}));return{prompt:'DO NOT SELECT CYAN',choices,correctIds:choices.filter(c=>c.label!=='CYAN').map(c=>c.id),mechanic}}
  case'oddOneOut':{const pairs=[['◆','◇'],['▲','△'],['●','○'],['■','□']],p=pick(pairs),at=Math.floor(Math.random()*6);return{prompt:'WHICH SYMBOL IS DIFFERENT?',choices:Array.from({length:6},(_,i)=>({id:String(i),label:i===at?p[0]:p[1]})),correctIds:[String(at)],mechanic}}
  case'colorRules':{const answer=pick(['CYAN','VIOLET','AMBER','WHITE']);return one('MATCH THE SIGNAL COLOR',[answer,...shuffle(['CYAN','VIOLET','AMBER','WHITE'].filter(x=>x!==answer))],answer,mechanic)}
  case'spatial':{return one('WHICH ARROW POINTS RIGHT?',['↑','←','→','↓'],'→',mechanic)}
  case'ruleSwitch':{const high=Math.random()>.5,values=shuffle([2,4,7,9]);const answer=String(high?Math.max(...values):Math.min(...values));return one(high?'RULE SHIFT // HIGHEST':'RULE SHIFT // LOWEST',values.map(String),answer,mechanic)}
  case'memory':{const cue=pick(symbols);return one(`RECALL THE SIGNAL // ${cue}`,shuffle(symbols).slice(0,5).concat(cue),cue,mechanic)}
  case'previousRule':{return one('PREVIOUS RULE // SELECT THE OPPOSITE OF LEFT',['←','→','↑','↓'],'→',mechanic)}
  case'movingObjects':case'visualSearch':case'distractor':case'symbolMatch':case'mixed':default:{const target=pick(symbols),choices=shuffle(symbols).map((label,i)=>({id:String(i),label}));return{prompt:`FIND ${target}`,choices,correctIds:choices.filter(c=>c.label===target).map(c=>c.id),mechanic}}
 }
}
export const isCorrect=(challenge:Challenge,id:string)=>challenge.correctIds.includes(id);