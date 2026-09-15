/* Tipul de întrebare „foaie”: foaie de calcul simulată, cu formule adevărate.
   Folosire în configurație:  tipuri: { foaie: JocFoaie }
   Întrebare: {t:'foaie', q, cells:{A1:'Produs',B2:3,...}, cols, rows, targets:{D2:'=B2*C2',...}, variants:[{B2:4}], why}
   Verificare: rezultatul formulei elevului = rezultatul formulei de referință, pe datele date ȘI pe date schimbate
   (o variantă automată + variants), ca să prindă numerele scrise de mână și comparațiile greșite. */
(function(){
'use strict';
const RO_NAMES={SUMA:'SUM',MEDIE:'AVERAGE',MEDIA:'AVERAGE',DACA:'IF','DACĂ':'IF',MAXIM:'MAX',MINIM:'MIN'};
function FErr(msg,show){const e=new Error(msg);e.show=show||'#EROARE';return e}
function tokenize(src){
  const t=[];let i=0;
  while(i<src.length){
    const c=src[i],rest=src.slice(i);let m;
    if(/\s/.test(c)){i++;continue}
    if(c==='"'||c==='„'||c==='”'){const close=src.slice(i+1).search(/["”“]/);if(close<0)throw FErr('Lipsește ghilimeaua de închidere.');t.push({k:'str',v:src.slice(i+1,i+1+close)});i+=close+2;continue}
    if((m=rest.match(/^\d+(\.\d+)?/))){t.push({k:'num',v:parseFloat(m[0])});i+=m[0].length;continue}
    if((m=rest.match(/^([A-Za-zĂÂÎȘȚăâîșț]+)(\d+)?/))){if(m[2])t.push({k:'ref',v:(m[1]+m[2]).toUpperCase()});else t.push({k:'name',v:m[1].toUpperCase()});i+=m[0].length;continue}
    if((m=rest.match(/^(<=|>=|<>|[-+*\/=<>(),;:])/))){t.push({k:'op',v:m[0]});i+=m[0].length;continue}
    throw FErr(`Excel nu înțelege semnul „${c}”.`);
  }
  return t;
}
function expand(a,b){if(!/^[A-Z]\d+$/.test(a)||!/^[A-Z]\d+$/.test(b))throw FErr('Zona e prea mare pentru joc.');return JocMotor.expandRange(a,b)}
function evaluate(formula,get){
  if(typeof formula!=='string'||!formula.startsWith('='))throw FErr('Formula trebuie să înceapă cu =.');
  const T=tokenize(formula.slice(1));let p=0;
  if(!T.length)throw FErr('După = nu ai scris nimic.');
  const isOp=v=>T[p]&&T[p].k==='op'&&T[p].v===v;
  const num=v=>{if(typeof v==='number')return v;if(v===''||v==null)return 0;if(typeof v==='boolean')return v?1:0;throw FErr('Formula calculează cu un text ca și cum ar fi număr.','#VALOARE')};
  function cmp(){const a=add(),t=T[p];
    if(t&&t.k==='op'&&['=','<>','<','>','<=','>='].includes(t.v)){p++;const b=add();let x=a,y=b;
      if(typeof x==='string'||typeof y==='string'){x=String(x??'').toLowerCase();y=String(y??'').toLowerCase()}else{x=num(x);y=num(y)}
      return {'=':x===y,'<>':x!==y,'<':x<y,'>':x>y,'<=':x<=y,'>=':x>=y}[t.v]}
    return a}
  function add(){let a=mul();while(isOp('+')||isOp('-')){const o=T[p++].v,b=mul();a=o==='+'?num(a)+num(b):num(a)-num(b)}return a}
  function mul(){let a=un();while(isOp('*')||isOp('/')){const o=T[p++].v,b=un();if(o==='/'){if(num(b)===0)throw FErr('Împărțire la zero.','#DIV/0!');a=num(a)/num(b)}else a=num(a)*num(b)}return a}
  function un(){if(isOp('-')){p++;return -num(un())}if(isOp('+')){p++;return num(un())}return prim()}
  function prim(){const t=T[p];
    if(!t)throw FErr('Formula se termină prea devreme.');
    if(t.k==='num'||t.k==='str'){p++;return t.v}
    if(t.k==='ref'){p++;if(isOp(':')){p++;const b=T[p];if(!b||b.k!=='ref')throw FErr('După „:” trebuie adresa celuilalt colț.');p++;return{range:expand(t.v,b.v)}}return get(t.v)}
    if(t.k==='name'){p++;if(!isOp('('))throw FErr(`„${t.v}” nu e o adresă de celulă și nici o funcție urmată de paranteză.`);p++;const args=[];
      if(!isOp(')')){for(;;){args.push(cmp());if(isOp(';')||isOp(',')){p++;continue}break}}
      if(!isOp(')'))throw FErr('Lipsește paranteza de închidere.');p++;return call(t.v,args)}
    if(isOp('(')){p++;const v=cmp();if(!isOp(')'))throw FErr('Lipsește paranteza de închidere.');p++;return v}
    throw FErr(`Nu mă așteptam la „${t.v}” aici.`)}
  function nums(args){const out=[];args.forEach(a=>{if(a&&a.range)a.range.forEach(r=>{const v=get(r);if(typeof v==='number')out.push(v)});else out.push(num(a))});return out}
  function call(name,args){
    if(name==='IF'&&args.some(a=>a&&a.range))throw FErr('IF nu primește o zonă, ci o comparație.');
    switch(name){
      case 'SUM':return nums(args).reduce((s,x)=>s+x,0);
      case 'AVERAGE':{const n=nums(args);if(!n.length)throw FErr('Media unei zone fără numere nu se poate calcula.','#DIV/0!');return n.reduce((s,x)=>s+x,0)/n.length}
      case 'MAX':{const n=nums(args);return n.length?Math.max(...n):0}
      case 'MIN':{const n=nums(args);return n.length?Math.min(...n):0}
      case 'IF':{if(args.length<2)throw FErr('IF are nevoie de condiție și de cel puțin un rezultat.');const c=args[0];const yes=typeof c==='string'?c!=='':!!num(c);return yes?args[1]:(args.length>2?args[2]:false)}
    }
    const ro=RO_NAMES[name];
    throw FErr(`Excel nu cunoaște funcția ${name}.${ro?` Numele funcțiilor sunt în engleză: ${ro}.`:''}`,'#NUME?');
  }
  const v=cmp();
  if(p<T.length){if(T[p].k==='op'&&(T[p].v===';'||T[p].v===','))throw FErr('Semnul „;” sau „,” se folosește doar în interiorul unei funcții.');throw FErr(`Nu mă așteptam la „${T[p].v}” aici.`)}
  if(v&&v.range)throw FErr('O zonă singură nu e un rezultat. Pune-o într-o funcție, de exemplu SUM(…).');
  return v;
}
const fmt=v=>typeof v==='number'?(Number.isInteger(v)?String(v):v.toLocaleString('ro-RO',{maximumFractionDigits:2})):typeof v==='boolean'?(v?'adevărat':'fals'):String(v??'');
const same=(a,b)=>typeof a==='number'&&typeof b==='number'?Math.abs(a-b)<1e-6:String(a).trim().toLowerCase()===String(b).trim().toLowerCase();
const CSS=`.fxrow{display:flex;align-items:stretch;border:1px solid var(--line);border-radius:6px;overflow:hidden;background:var(--paper);font-family:var(--fm);margin-bottom:8px}
.fxrow .nb{padding:8px 10px;background:var(--paper2);border-right:1px solid var(--line);min-width:3.4em;text-align:center;font-weight:600}
.fxrow .fx{padding:8px;color:var(--ink2);font-style:italic;border-right:1px solid var(--line)}
.fxrow input{flex:1;min-width:0;border:0;background:transparent;padding:8px 10px;font-family:var(--fm);font-size:1rem}
.fxrow button{border:0;border-left:1px solid var(--line);background:var(--accent);color:var(--accentInk);padding:0 14px;font-weight:700}
.g td .num{text-align:right;font-variant-numeric:tabular-nums;display:block}
.g td .hdr{font-weight:600}
.g td.tgt>button{box-shadow:inset 0 0 0 1.5px var(--accent);background:repeating-linear-gradient(135deg,transparent 0 6px,color-mix(in srgb,var(--accent) 9%,transparent) 6px 12px)}
.g td.tgt.filled>button{background:var(--paper)}
.g td.tgt.act>button{box-shadow:inset 0 0 0 3px var(--accent);background:var(--sel)}
.g td.err>button{color:var(--bad)}`;

let F={},act=null,Qc=null;
function getter(formulas,data){
  const memo={},stack=new Set();
  const get=addr=>{
    if(addr in memo)return memo[addr];
    if(addr in formulas){const f=formulas[addr];if(f==='')return '';
      if(stack.has(addr))throw FErr('Formula trimite la ea însăși.','#CIRC');
      stack.add(addr);try{const v=f.startsWith('=')?evaluate(f,get):f;memo[addr]=v;return v}finally{stack.delete(addr)}}
    return addr in data?data[addr]:'';
  };
  return get;
}
function render(Q,body,api){
  if(!document.getElementById('tip-foaie-css')){const s=document.createElement('style');s.id='tip-foaie-css';s.textContent=CSS;document.head.appendChild(s)}
  Qc=Q;F={};Object.keys(Q.targets).forEach(k=>F[k]='');act=Object.keys(Q.targets)[0];
  const L=i=>String.fromCharCode(65+i),esc=api.esc;
  function shown(addr){
    if(!(addr in F))return{txt:fmt(Q.cells[addr]??''),num:typeof Q.cells[addr]==='number'};
    const f=F[addr];if(f==='')return{txt:'',num:false};if(!f.startsWith('='))return{txt:f,num:false};
    try{const v=getter(F,Q.cells)(addr);return{txt:fmt(v),num:typeof v==='number'}}catch(e){return{txt:e.show,num:false,err:true}}
  }
  function draw(){
    let h=`<div class="fxrow"><span class="nb">${act}</span><span class="fx">fx</span>
      <input id="fxin" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-label="Bara de formule" value="${esc(F[act]??'')}" placeholder="scrie formula, de ex. =B2*C2">
      <button type="button" id="put" aria-label="Pune formula în celulă">↵</button></div>
      <div class="gridwrap"><table class="g"><thead><tr><th></th>`;
    for(let c=0;c<Q.cols;c++)h+=`<th>${L(c)}</th>`;
    h+='</tr></thead><tbody>';
    for(let r=1;r<=Q.rows;r++){h+=`<tr><th>${r}</th>`;
      for(let c=0;c<Q.cols;c++){const ad=L(c)+r,tg=ad in F,s=shown(ad);
        const cls=[tg?'tgt':'',tg&&F[ad]!==''?'filled':'',ad===act?'act':'',s.err?'err':''].join(' ');
        const inner=`<span class="${s.num?'num':''} ${r===1?'hdr':''}">${esc(s.txt)}</span>`;
        h+=tg?`<td class="${cls}"><button type="button" data-a="${ad}" aria-label="Celula ${ad} de completat">${inner}</button></td>`:`<td><div data-a="${ad}">${inner}</div></td>`}
      h+='</tr>'}
    body.innerHTML=h+`</tbody></table></div><div class="toast" id="toast" aria-live="polite"></div>
      <p class="hint" style="margin:0">Celulele cu chenar sunt ale tale. Funcțiile se scriu în engleză. Între părțile lui IF merge și <code>;</code>, și <code>,</code>.</p>`;
    body.querySelectorAll('.g td>button').forEach(x=>x.onclick=()=>{if(api.done())return;commit(false);act=x.dataset.a;draw();body.querySelector('#fxin').focus()});
    body.querySelectorAll('.g td>div').forEach(x=>x.onclick=()=>{body.querySelector('#toast').textContent=`${x.dataset.a} are datele tabelului. Tu scrii doar în celulele cu chenar.`});
    body.querySelector('#fxin').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();commit(true)}});
    body.querySelector('#put').onclick=()=>commit(true);
  }
  function commit(advance){
    const inp=body.querySelector('#fxin');if(!inp||api.done())return;
    F[act]=inp.value.trim();
    if(!advance)return;
    const keys=Object.keys(F),i=keys.indexOf(act),nxt=keys.slice(i+1).concat(keys.slice(0,i)).find(k=>F[k]==='');
    const s=shown(act);draw();const t=body.querySelector('#toast');
    if(F[act]!==''&&!F[act].startsWith('='))t.textContent=`În ${act} ai scris text, nu formulă: formula începe cu =.`;
    else if(s.err){try{getter(F,Q.cells)(act)}catch(e){t.textContent=`${act}: ${e.message}`}}
    else if(nxt){act=nxt;draw();body.querySelector('#fxin').focus()}
  }
  function problems(){
    const out=[],variants=(Q.variants||[]).slice(),auto={};
    Object.entries(Q.cells).forEach(([k,v],i)=>{if(typeof v==='number')auto[k]=v+(i%3+1)*3});variants.push(auto);
    for(const ad of Object.keys(F)){
      const f=F[ad];
      if(f===''){out.push(`${ad} e goală.`);continue}
      if(!f.startsWith('=')){out.push(`În ${ad} ai scris text, nu formulă: formula începe cu =.`);continue}
      let toks;try{toks=tokenize(f.slice(1))}catch(e){out.push(`${ad}: ${e.message}`);continue}
      if(!toks.some(t=>t.k==='ref')){out.push(`${ad} are doar numere scrise de mână. Folosește adresele celulelor, ca rezultatul să se recalculeze.`);continue}
      let got;try{got=getter(F,Q.cells)(ad)}catch(e){out.push(`${ad}: ${e.message}`);continue}
      const exp=getter(Q.targets,Q.cells)(ad);
      if(!same(got,exp)){out.push(`${ad} dă ${fmt(got)||'nimic'}, dar ar trebui să dea ${fmt(exp)}.`);continue}
      for(const v of variants){const data={...Q.cells,...v};let g2;try{g2=getter(F,data)(ad)}catch(e){g2='#'}
        if(!same(g2,getter(Q.targets,data)(ad))){out.push(`${ad} dă rezultatul bun acum, dar greșește când se schimbă datele din tabel. Verifică adresele și comparația.`);break}}
    }
    return out;
  }
  draw();
  const nav=api.checkButton(()=>{
    commit(false);const pr=problems();draw();
    if(!pr.length){nav.innerHTML='';api.resolve(true)}
    else{api.resolve(false,pr.slice(0,2).join(' ')+(pr.length>2?` (încă ${pr.length-2})`:''));
      api.revealButton(()=>{Object.assign(F,Q.targets);draw();nav.innerHTML='';api.giveUp('formulele corecte sunt acum în celule. Apasă pe ele și citește-le în bara fx.')})}
  });
}
function rezolva(Q,body){
  for(const [ad,f] of Object.entries(Q.targets)){body.querySelector(`.g td>button[data-a="${ad}"]`).click();const inp=body.querySelector('#fxin');inp.value=f;inp.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}))}
}
window.JocFoaie={render,rezolva,evaluate};
})();
