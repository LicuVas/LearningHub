/* Tipul de întrebare „interogare”: grila de proiectare a unei interogări Access (Query Design), rulată pe un tabel mic.
   Folosire în configurație:  tipuri: { interogare: JocInterogare }
   Întrebare:
     {t:'interogare', q, tabel:{nume:'Elevi', campuri:['Nume','Clasa','Media','Oras'], randuri:[['Ana','12A',9.5,'Iasi'], ...]},
      ref:[{camp:'Nume',arata:true}, {camp:'Media',arata:true,sort:'desc',criteriu:'>=9'}, {camp:'Oras',arata:false,criteriu:'"Iasi" Or "Bacau"'}],
      coloane:4,                         // câte coloane are grila (implicit: numărul din ref + 1)
      variante:[[...rânduri în plus...]], // opțional: rânduri de graniță care prind criteriile „aproape bune” (>9 în loc de >=9)
      why}
   Verificare: interogarea elevului și `ref` se rulează pe tabel (și pe tabel + fiecare variantă); rezultatul trebuie să aibă
   aceleași coloane afișate, în aceeași ordine, și aceleași înregistrări (în aceeași ordine când ref sortează).
   Criterii înțelese (ca în Access, fără diferență de litere mari/mici): 9, "Iasi", =, <>, <, >, <=, >=, Between 5 And 8,
   Like "A*" (* și ?), Is Null, Is Not Null, Not "Iasi", combinate cu Or / And în aceeași celulă. */
(function(){
'use strict';
function CErr(m){const e=new Error(m);e.criteriu=true;return e}
function lit(s){
  s=s.trim();
  if(/^["“„].*["”]$/.test(s))return s.slice(1,-1);
  if(/^#.*#$/.test(s))return s.slice(1,-1);
  const n=Number(s.replace(',','.'));if(s!==''&&!isNaN(n))return n;
  if(/^[\p{L}\p{N}][\p{L}\p{N}\s.-]*$/u.test(s))return s;      // Access pune singur ghilimelele la un text simplu (Iasi, 12A)
  throw CErr(`Nu înțeleg valoarea „${s}” din criteriu.`);
}
function cmp(v,op,x){
  if(typeof x==='number'){if(typeof v!=='number')return false;return {'=':v===x,'<>':v!==x,'<':v<x,'>':v>x,'<=':v<=x,'>=':v>=x}[op]}
  const a=String(v??'').toLowerCase(),b=String(x).toLowerCase();
  return {'=':a===b,'<>':a!==b,'<':a<b,'>':a>b,'<=':a<=b,'>=':a>=b}[op];
}
function like(v,pat){const re=new RegExp('^'+String(pat).replace(/[.+^${}()|[\]\\]/g,'\\$&').replace(/\*/g,'.*').replace(/\?/g,'.')+'$','i');return re.test(String(v??''))}
/* criteriu → funcție (valoare) => bool */
function parse(src){
  const s=String(src||'').trim();if(!s)return null;
  const sau=splitKw(s,'or');if(sau.length>1){const fs=sau.map(parse);return v=>fs.some(f=>f(v))}
  if(!/^between\b/i.test(s)){const si=splitKw(s,'and');if(si.length>1){const fs=si.map(parse);return v=>fs.every(f=>f(v))}}
  let m;
  if((m=s.match(/^between\s+(.+?)\s+and\s+(.+)$/i))){const a=lit(m[1]),b=lit(m[2]);return v=>cmp(v,'>=',a)&&cmp(v,'<=',b)}
  if(/^is\s+not\s+null$/i.test(s))return v=>v!==null&&v!==''&&v!==undefined;
  if(/^is\s+null$/i.test(s))return v=>v===null||v===''||v===undefined;
  if((m=s.match(/^not\s+like\s+(.+)$/i))){const p=lit(m[1]);return v=>!like(v,p)}
  if((m=s.match(/^like\s+(.+)$/i))){const p=lit(m[1]);return v=>like(v,p)}
  if((m=s.match(/^not\s+(.+)$/i))){const f=parse(m[1]);return v=>!f(v)}
  if((m=s.match(/^(<=|>=|<>|<|>|=)\s*(.+)$/))){const x=lit(m[2]);return v=>cmp(v,m[1],x)}
  if(/[*?]/.test(s)&&/^["“„].*["”]$/.test(s))throw CErr(`Semnele * și ? merg doar cu Like: Like ${s}.`);
  const x=lit(s);return v=>cmp(v,'=',x);
}
function splitKw(s,kw){   // împarte după Or/And, dar nu în interiorul ghilimelelor
  const out=[];let cur='',q=false;const re=new RegExp('^\\s+'+kw+'\\s+','i');
  for(let i=0;i<s.length;i++){const c=s[i];if('"“„”'.includes(c))q=!q;
    if(!q){const m=s.slice(i).match(re);if(m){out.push(cur);cur='';i+=m[0].length-1;continue}}
    cur+=c}
  out.push(cur);return out.map(x=>x.trim()).filter(Boolean);
}
function run(tabel,grila){
  const idx=c=>tabel.campuri.indexOf(c);
  const cols=grila.filter(g=>g.camp);
  const filt=cols.map(g=>({i:idx(g.camp),f:parse(g.criteriu)})).filter(x=>x.f);
  let rows=tabel.randuri.filter(r=>filt.every(x=>x.f(r[x.i])));
  const sorts=cols.filter(g=>g.sort==='asc'||g.sort==='desc');
  if(sorts.length)rows=rows.slice().sort((a,b)=>{for(const g of sorts){const i=idx(g.camp),x=a[i],y=b[i];
    const c=typeof x==='number'&&typeof y==='number'?x-y:String(x).localeCompare(String(y),'ro');if(c)return g.sort==='asc'?c:-c}return 0});
  const shown=cols.filter(g=>g.arata);
  return {head:shown.map(g=>g.camp),rows:rows.map(r=>shown.map(g=>r[idx(g.camp)])),sortat:sorts.length>0};
}
const same=(A,B,ordine)=>{
  if(A.head.join('|')!==B.head.join('|'))return false;
  const k=r=>JSON.stringify(r);const a=A.rows.map(k),b=B.rows.map(k);
  if(a.length!==b.length)return false;
  return ordine?a.every((x,i)=>x===b[i]):a.slice().sort().join()===b.slice().sort().join();
};
const CSS=`.qd .tbl{font-family:var(--fm);font-size:.72rem;color:var(--ink2);margin-bottom:6px}
.qd .gridwrap{overflow-x:auto;max-width:100%}
.qd table.qg{border-collapse:collapse;min-width:100%;background:var(--paper);font-size:.85rem}
.qd table.qg th,.qd table.qg td{border:1px solid var(--line);padding:4px}
.qd table.qg th{background:var(--paper2);font-family:var(--fm);font-size:.68rem;text-align:left;white-space:nowrap;color:var(--ink2)}
.qd table.qg select,.qd table.qg input[type=text]{width:100%;min-width:6.5em;border:1px solid var(--line);border-radius:4px;padding:5px;background:var(--paper);color:var(--ink);font:inherit;font-size:.85rem}
.qd .res{margin-top:10px}
.qd .res table{border-collapse:collapse;font-size:.8rem;background:var(--paper)}
.qd .res td,.qd .res th{border:1px solid var(--line);padding:3px 8px}
.qd .res th{background:var(--paper2)}
.qd .rowbtn{margin-top:8px;display:flex;flex-wrap:wrap;gap:6px}
.qd .rowbtn button{border:1px solid var(--line);background:var(--paper);color:var(--ink);border-radius:6px;padding:6px 10px;font:inherit;font-size:.85rem}`;
function nCols(Q){return Q.coloane||Q.ref.length+1}
function render(Q,body,api){
  if(!document.getElementById('tip-interogare-css')){const s=document.createElement('style');s.id='tip-interogare-css';s.textContent=CSS;document.head.appendChild(s)}
  const esc=api.esc,n=nCols(Q);
  const G=Array.from({length:n},()=>({camp:'',arata:true,sort:'',criteriu:''}));
  body._grila=G;
  function tableHtml(R){
    if(!R.head.length)return '<p class="hint">Nicio coloană afișată.</p>';
    return `<table><thead><tr>${R.head.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${R.rows.map(r=>`<tr>${r.map(v=>`<td>${esc(v??'')}</td>`).join('')}</tr>`).join('')||`<tr><td colspan="${R.head.length}"><em>nicio înregistrare</em></td></tr>`}</tbody></table>`;
  }
  function draw(res){
    const opt=v=>`<option value="">—</option>`+Q.tabel.campuri.map(c=>`<option ${c===v?'selected':''}>${esc(c)}</option>`).join('');
    const row=(lbl,cell)=>`<tr><th>${lbl}</th>${G.map((g,i)=>`<td>${cell(g,i)}</td>`).join('')}</tr>`;
    body.innerHTML=`<div class="qd"><div class="tbl">Tabelul: <strong>${esc(Q.tabel.nume)}</strong> (${Q.tabel.randuri.length} înregistrări) · câmpuri: ${Q.tabel.campuri.map(esc).join(', ')}</div>
      <div class="gridwrap"><table class="qg">
      ${row('Field (Câmp)',(g,i)=>`<select data-i="${i}" data-k="camp" aria-label="Câmpul coloanei ${i+1}">${opt(g.camp)}</select>`)}
      ${row('Table (Tabel)',g=>g.camp?esc(Q.tabel.nume):'')}
      ${row('Sort (Sortare)',(g,i)=>`<select data-i="${i}" data-k="sort" aria-label="Sortarea coloanei ${i+1}"><option value="">—</option><option value="asc" ${g.sort==='asc'?'selected':''}>Ascending (Ascendent)</option><option value="desc" ${g.sort==='desc'?'selected':''}>Descending (Descendent)</option></select>`)}
      ${row('Show (Afișare)',(g,i)=>`<input type="checkbox" data-i="${i}" data-k="arata" ${g.arata?'checked':''} aria-label="Afișează coloana ${i+1}">`)}
      ${row('Criteria (Criterii)',(g,i)=>`<input type="text" data-i="${i}" data-k="criteriu" value="${esc(g.criteriu)}" autocomplete="off" spellcheck="false" aria-label="Criteriul coloanei ${i+1}">`)}
      </table></div>
      <div class="rowbtn"><button type="button" id="qd-run">Run (Execută) ▶</button></div>
      <div class="res" id="qd-res">${res||''}</div></div>`;
    body.querySelectorAll('[data-k]').forEach(el=>{
      const upd=()=>{const g=G[+el.dataset.i];g[el.dataset.k]=el.type==='checkbox'?el.checked:el.value};
      el.addEventListener('change',upd);el.addEventListener('input',upd);
    });
    body.querySelector('#qd-run').onclick=()=>{try{draw(`<div class="tbl">Rezultatul interogării</div>`+tableHtml(run(Q.tabel,G)))}catch(e){draw(`<p class="toast">${esc(e.message)}</p>`)}};
  }
  body._draw=draw;
  function problems(){
    if(!G.some(g=>g.camp))return 'Grila e goală: alege câmpurile în rândul Field (Câmp).';
    let got;try{got=run(Q.tabel,G)}catch(e){return e.message}
    const exp=run(Q.tabel,Q.ref);
    if(got.head.join('|')!==exp.head.join('|'))return `Coloanele afișate sunt ${got.head.join(', ')||'niciuna'}, dar cerința vrea ${exp.head.join(', ')}. Verifică rândul Field și bifele Show.`;
    if(got.rows.length!==exp.rows.length)return `Interogarea ta dă ${got.rows.length} înregistrări, dar trebuie ${exp.rows.length}. Verifică criteriile.`;
    if(!same(got,exp,false))return 'Numărul de înregistrări e bun, dar nu sunt aceleași. Verifică criteriile.';
    if(exp.sortat&&!same(got,exp,true))return 'Înregistrările sunt bune, dar ordinea nu. Verifică rândul Sort (crescător sau descrescător, pe ce câmp).';
    for(const extra of (Q.variante||[])){
      const T={...Q.tabel,randuri:Q.tabel.randuri.concat(extra)};let g2;try{g2=run(T,G)}catch(e){return e.message}
      if(!same(g2,run(T,Q.ref),exp.sortat))return 'Pe tabelul acesta iese bine, dar criteriul nu e exact cel cerut: pe alte înregistrări (valori de la graniță) ar da alt rezultat. Recitește cerința: „cel puțin”, „mai mare”, „între”.';
    }
    return '';
  }
  draw();
  const nav=api.checkButton(()=>{
    const pr=problems();
    if(!pr){nav.innerHTML='';try{draw(`<div class="tbl">Rezultatul interogării</div>`+tableHtml(run(Q.tabel,G)))}catch(e){}api.resolve(true)}
    else{api.resolve(false,esc(pr));
      api.revealButton(()=>{Q.ref.forEach((r,i)=>Object.assign(G[i],{camp:r.camp,arata:r.arata!==false,sort:r.sort||'',criteriu:r.criteriu||''}));
        draw(`<div class="tbl">Rezultatul interogării</div>`+tableHtml(run(Q.tabel,G)));nav.innerHTML='';api.giveUp('grila corectă e acum completată. Citește fiecare coloană.')})}
  });
}
function fill(body,grila){
  grila.forEach((r,i)=>{
    const set=(k,v)=>{const el=body.querySelector(`[data-i="${i}"][data-k="${k}"]`);if(!el)return;if(el.type==='checkbox')el.checked=v;else el.value=v;el.dispatchEvent(new Event('change',{bubbles:true}))};
    set('camp',r.camp);set('sort',r.sort||'');set('arata',r.arata!==false);set('criteriu',r.criteriu||'');
  });
}
function rezolva(Q,body){fill(body,Q.ref);body.ownerDocument.getElementById('chk').click()}
/* greșeala tipică: toate câmpurile afișate și fără criterii (trebuie respinsă) */
function gresit(Q,body){fill(body,Q.ref.map(r=>({camp:r.camp,arata:true,sort:'',criteriu:''})));}
window.JocInterogare={render,rezolva,gresit,run,parse};
})();
