/* Simulatorul „bilete” pentru lecțiile LearningHub — fișier comun (lectii/_sim/bilete-servicii.js).
   PROPRIETAR: autorul lecției V · M2 · nr. 13 („Servicii ale rețelei Internet. La ce folosește fiecare”), 10.10.2026.

   CE SIMULEAZĂ. Nu o aplicație, ci activitatea profesorului de la lecția V/13 (Info_Gimnaziu_2026\data\
   activitati_lectii_V_VI.json): „Elevii scriu pe bilețele ce au făcut pe internet în ultima săptămână; bilețelele se
   grupează pe tablă pe servicii (web, poștă, mesagerie, streaming, jocuri) și se denumesc împreună.”
   Pe ecran: TEANCUL cu bilețele colegilor, sus; TABLA cu grupe goale (Grupa 1, Grupa 2…), fiecare cu lista „Numele
   grupei”; TESTELE numite, jos, care se bifează la „Verifică tabla”.

   GESTURI (aceleași cu mouse-ul, cu degetul și cu tastatura; nicio tragere):
     - atingi un bilețel → îl iei (se ridică, cu chenar roșu); îl atingi din nou → îl lași unde era;
     - sub bilețelul luat apare rândul „Lipește-l la:”, cu câte un buton pentru fiecare grupă: atingi grupa → bilețelul
       se lipește acolo; merge și „Lipește aici” de sub grupă (sau locul gol al grupei);
     - atingi un bilețel deja lipit → îl iei din nou și îl muți; „Pune-l înapoi în teanc” îl întoarce în teanc;
     - din lista „Numele grupei” alegi numele grupei.
   Ținte de atingere ≥ 44 px (regula 20). Focusul rămâne pe tablă după fiecare gest și după „Verifică tabla” (regula 14).

   FOLOSIRE în pagină (după motor.js):
     <script src="../../_sim/bilete-servicii.js"></script>
     JocMotor.porneste({ …, tipuri:{bilete:SimBilete} })

   Q (exercițiul / atelierul):
     Q.bilete   [{id, text, s}]  bilețelele; s = id-ul serviciului (grupa) căruia îi aparține
     Q.nume     [{id, et}]       numele de ales pentru grupe, în ordinea din listă (pot fi și nume în plus)
     Q.grupe    numărul de grupe goale de pe tablă (implicit: câte servicii au bilețelele)
     Q.gresit   {bilet, la}      greșeala tipică de copil, pentru poartă: soluția bună, cu bilețelul `bilet` mutat în
                                 grupa bilețelului `la` (de ex. apelul video pus la streaming, „că tot e video”)
     Q.amesteca false = teancul în ordinea din Q.bilete (implicit amestecat cu api.shuffle)
     Q.cuNume   false = fără liste de nume (doar gruparea); testele 4 și 5 dispar
     Q.solutieText  textul de după „Arată-mi răspunsul”
   TESTELE (fixe, în ordinea asta): 1 toate bilețelele sunt pe tablă · 2 fiecare grupă are bilețele despre un singur
   serviciu · 3 bilețelele despre același serviciu stau într-o singură grupă · 4 fiecare grupă cu bilețele are un nume ·
   5 numele fiecărei grupe se potrivește cu bilețelele ei. Mesajele spun GRUPA cu problema, nu bilețelul și nici numele bun.

   PENTRU LECȚIA URMĂTOARE (orice autor care vrea o grupare pe tablă):
     - poți folosi SimBilete așa cum e, cu alte Q.bilete / Q.nume (de ex. „sursă bună / sursă îndoielnică”);
     - SimBilete._evalueaza(Q, stare) întoarce testele [{id, ok, m}], SimBilete._stare(body) starea curentă
       ({loc:{idBilet: indexGrupă}, nume:[idNume…], mana, n}); poți scrie o extensie care le citește;
     - NU schimbi forma lui Q de mai sus, numele testelor și ordinea lor (le folosește lecția V/13); o extensie nouă
       stă în alt fișier din lectii/_sim/, cu nume nou. */
(function(){
'use strict';
const CSS=`
.bs-acum{margin:0 0 8px;font-size:.93rem;line-height:1.4;color:var(--ink);min-height:2.6em}
.bs-teanc{border:1px dashed var(--line);border-radius:10px;padding:8px;background:var(--paper2)}
.bs-teanc>b,.bs-cap b{display:block;font-size:.85rem;margin:0 0 6px}
.bs-teanc .bs-gol{font-size:.88rem;color:var(--ink2);margin:2px 0}
.bs-bilete{display:flex;flex-wrap:wrap;gap:8px}
.bs-bilet{min-height:44px;min-width:44px;max-width:100%;padding:8px 10px;border:1px solid #d9c66a;border-radius:3px 3px 10px 3px;
  background:#FFF1A6;color:#2a2418;font:inherit;font-size:.9rem;line-height:1.3;text-align:left;cursor:pointer;
  box-shadow:0 2px 0 rgba(0,0,0,.18);transition:transform .08s}
.bs-bilet:nth-child(3n+2){transform:rotate(-.6deg)}.bs-bilet:nth-child(3n){transform:rotate(.5deg)}
.bs-bilet[aria-pressed="true"]{outline:3px solid #E4002B;outline-offset:1px;transform:translateY(-3px);box-shadow:0 6px 10px rgba(0,0,0,.28)}
.bs-bilet:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
.bs-rapid{flex-basis:100%;display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:-2px 0 4px;padding:8px;border:2px solid #E4002B;border-radius:8px;background:var(--paper);color:var(--ink)}
.bs-rapid>span{flex-basis:100%;font-size:.85rem;font-weight:700}
.bs-r{min-height:44px;min-width:44px;padding:6px 10px;border:1px solid var(--line);border-radius:6px;background:var(--paper2);color:var(--ink);font:inherit;font-size:.86rem;text-align:left;cursor:pointer}
.bs-r:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
.bs-r.bs-inapoi{border-style:dashed}
.bs-tabla{margin-top:10px;padding:10px;border-radius:10px;background:#2E4A3B;border:6px solid #8a6a43;
  display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}
.bs-grupa{display:flex;flex-direction:column;gap:6px;min-height:150px;padding:8px;border:2px dashed #cfe3d6;border-radius:8px;background:rgba(255,255,255,.06);color:#F3F7F4;cursor:pointer}
.bs-grupa.ok{border-style:solid;border-color:#8fe3a9}.bs-grupa.rau{border-style:solid;border-color:#ff9a8f}
.bs-cap b{color:#F3F7F4;margin:0}
.bs-cap label{display:block;font-size:.8rem;color:#DDE8E0}
.bs-cap select{display:block;width:100%;min-height:44px;margin-top:3px;border-radius:6px;border:1px solid #9fb8a8;background:#fff;color:#1b1b1b;font:inherit;font-size:.9rem;padding:4px 6px}
.bs-loc{display:flex;flex-direction:column;gap:6px;flex:1}
.bs-loc .bs-bilet{width:100%}
.bs-pune{min-height:44px;border:1px solid #cfe3d6;border-radius:6px;background:rgba(255,255,255,.12);color:#fff;font:inherit;font-weight:700;font-size:.88rem;cursor:pointer}
.bs-pune:focus-visible{outline:3px solid #ffd76a;outline-offset:2px}
.bs-teste{margin-top:10px;border:1px solid var(--line);border-radius:8px;padding:10px 12px;background:var(--paper2)}
.bs-teste ol{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:4px}
.bs-teste li{display:flex;gap:8px;align-items:flex-start;font-size:.93rem;line-height:1.35}
.bs-teste li .s{flex:none;width:1.4em;text-align:center;font-weight:800}
.bs-teste li.ok .s{color:var(--ok)}.bs-teste li.rau .s{color:var(--bad)}
.bs-teste li .m{display:block;font-size:.85rem;color:var(--bad)}
.bs-teste .hint{font-size:.85rem;color:var(--ink2)}
`;
function stil(){
  if(document.getElementById('sim-bilete-css'))return;
  const s=document.createElement('style');s.id='sim-bilete-css';s.textContent=CSS;document.head.appendChild(s);
}
/* serviciile bilețelelor, în ordinea listei de nume (apoi restul) */
function servicii(Q){
  const din=[...new Set((Q.bilete||[]).map(b=>b.s))];
  const ord=(Q.nume||[]).map(x=>x.id).filter(id=>din.includes(id));
  return ord.concat(din.filter(id=>!ord.includes(id)));
}
const nrGrupe=Q=>Q.grupe||servicii(Q).length;
const cuNume=Q=>Q.cuNume!==false;
function stareNoua(Q){return {loc:{},nume:Array(nrGrupe(Q)).fill(''),mana:null,n:nrGrupe(Q)}}
function stareCorecta(Q){
  const S=servicii(Q),st=stareNoua(Q);
  Q.bilete.forEach(b=>{st.loc[b.id]=S.indexOf(b.s)});
  if(cuNume(Q))S.forEach((id,i)=>{if(i<st.n)st.nume[i]=id});
  return st;
}
function stareGresita(Q){
  const st=stareCorecta(Q),g=Q.gresit;
  if(g&&st.loc[g.la]!=null)st.loc[g.bilet]=st.loc[g.la];
  else if(Q.bilete.length>1)st.loc[Q.bilete[0].id]=(st.loc[Q.bilete[0].id]+1)%st.n;   // fără Q.gresit: primul bilețel în grupa vecină
  return st;
}
const etNume=(Q,id)=>{const x=(Q.nume||[]).find(n=>n.id===id);return x?x.et:id};

/* testele: [{id, ce, ok, m}] — mesajul spune grupa, nu bilețelul și nici numele bun */
function evalueaza(Q,st){
  const B=Q.bilete,n=st.n,T=[];
  const pe=B.filter(b=>st.loc[b.id]!=null);
  const grupe=[...Array(n)].map((_,i)=>B.filter(b=>st.loc[b.id]===i));
  const amestec=grupe.map((g,i)=>new Set(g.map(b=>b.s)).size>1?i:-1).filter(i=>i>=0);
  const rupt=servicii(Q).map(s=>[...new Set(B.filter(b=>b.s===s&&st.loc[b.id]!=null).map(b=>st.loc[b.id]))].sort((a,b)=>a-b)).find(v=>v.length>1);
  const t1=pe.length===B.length;
  T.push({id:'tabla',ce:`Toate cele ${B.length} bilețele sunt lipite pe tablă`,ok:t1,
    m:t1?'':`Mai ${B.length-pe.length===1?'este un bilețel':`sunt ${B.length-pe.length} bilețele`} în teanc.`});
  const t2=pe.length>0&&!amestec.length;
  T.push({id:'acelasi',ce:'În fiecare grupă, toate bilețelele sunt despre același serviciu',ok:t2,
    m:t2?'':pe.length?`Grupa ${amestec[0]+1} are bilețele despre servicii diferite.`:'Pe tablă nu e încă niciun bilețel.'});
  const t3=t1&&!rupt;
  T.push({id:'impreuna',ce:'Bilețelele despre același serviciu stau toate într-o singură grupă',ok:t3,
    m:t3?'':!t1?'Întâi lipește pe tablă toate bilețelele.':`Grupele ${rupt.map(i=>i+1).join(' și ')} au bilețele despre același serviciu: pune-le într-o singură grupă.`});
  if(cuNume(Q)){
    const faraNume=grupe.map((g,i)=>g.length&&!st.nume[i]?i:-1).filter(i=>i>=0);
    const t4=pe.length>0&&!faraNume.length;
    T.push({id:'nume',ce:'Fiecare grupă cu bilețele are un nume ales din listă',ok:t4,
      m:t4?'':pe.length?`Grupa ${faraNume[0]+1} nu are încă un nume.`:'Pe tablă nu e încă niciun bilețel.'});
    const nepotrivit=grupe.map((g,i)=>g.length&&st.nume[i]&&g.some(b=>b.s!==st.nume[i])?i:-1).filter(i=>i>=0);
    const t5=t1&&t2&&t3&&t4&&!nepotrivit.length;
    T.push({id:'potrivit',ce:'Numele fiecărei grupe se potrivește cu bilețelele din ea',ok:t5,
      m:t5?'':nepotrivit.length?`Numele grupei ${nepotrivit[0]+1} nu se potrivește cu bilețelele din ea.`:'Întâi fă să treacă testele de mai sus.'});
  }
  return T;
}

/* eticheta unei grupe pe butoanele rapide: numele ales, altfel începutul primului bilețel, altfel „goală” */
function etGrupa(Q,st,i){
  if(st.nume[i])return `Grupa ${i+1} · ${etNume(Q,st.nume[i])}`;
  const b=Q.bilete.find(x=>st.loc[x.id]===i&&x.id!==st.mana);
  if(!b)return `Grupa ${i+1} · goală`;
  const w=b.text.split(/\s+/);return `Grupa ${i+1} · „${w.slice(0,3).join(' ')}${w.length>3?'…':''}”`;
}
function deseneaza(Q,body,api,st){
  const esc=api.esc,B=Q.bilete,ord=body._bs.ordine;
  /* sub bilețelul luat apare rândul „Lipește-l la:” cu toate grupele: pe telefon tabla e lungă, iar așa nu mai derulezi
     între teanc și grupe la fiecare bilețel (butoanele „Lipește aici” de sub grupe merg în continuare) */
  const rapid=b=>`<div class="bs-rapid" role="group" aria-label="Unde lipești bilețelul luat"><span>Lipește-l la:</span>${[...Array(st.n)].map((_,i)=>
    st.loc[b.id]===i?'':`<button type="button" class="bs-r" data-rapid="${i}">${esc(etGrupa(Q,st,i))}</button>`).join('')}${st.loc[b.id]!=null?'<button type="button" class="bs-r bs-inapoi" data-k="inapoi">Înapoi în teanc</button>':''}</div>`;
  const bilet=b=>`<button type="button" class="bs-bilet" data-b="${b.id}" aria-pressed="${st.mana===b.id}">${esc(b.text)}</button>${st.mana===b.id?rapid(b):''}`;
  const inTeanc=ord.map(id=>B.find(b=>b.id===id)).filter(b=>st.loc[b.id]==null);
  const optiuni=i=>`<option value="">— alege —</option>`+(Q.nume||[]).map(x=>`<option value="${x.id}"${st.nume[i]===x.id?' selected':''}>${esc(x.et)}</option>`).join('');
  body.querySelector('.bs-joc').innerHTML=`
  <div class="bs-teanc" role="group" aria-label="Teancul cu bilețele"><b>Teancul cu bilețele (${inTeanc.length} din ${B.length})</b>
    ${inTeanc.length?`<div class="bs-bilete">${inTeanc.map(bilet).join('')}</div>`:'<p class="bs-gol">Teancul e gol: toate bilețelele sunt pe tablă.</p>'}</div>
  <div class="bs-tabla" role="group" aria-label="Tabla clasei, cu grupele">
    ${[...Array(st.n)].map((_,i)=>`<section class="bs-grupa" data-g="${i}" aria-label="Grupa ${i+1}">
      <div class="bs-cap"><b>Grupa ${i+1}</b>${cuNume(Q)?`<label>Numele grupei<select data-g="${i}" aria-label="Numele grupei ${i+1}">${optiuni(i)}</select></label>`:''}</div>
      <div class="bs-loc">${ord.map(id=>B.find(b=>b.id===id)).filter(b=>st.loc[b.id]===i).map(bilet).join('')}</div>
      <button type="button" class="bs-pune" data-g="${i}">Lipește aici</button></section>`).join('')}
  </div>`;
}
function scrieTeste(Q,body,st,arata){
  const T=evalueaza(Q,st);
  body.querySelector('.bs-teste ol').innerHTML=T.map((t,k)=>`<li data-t="${t.id}" class="${arata?(t.ok?'ok':'rau'):''}"><span class="s">${arata?(t.ok?'✓':'✗'):'○'}</span><span>${k+1}. ${t.ce}${arata&&!t.ok&&t.m?`<span class="m">${t.m}</span>`:''}</span></li>`).join('');
  return T;
}
function mesajAcum(Q,st,api){
  if(st.mana){const b=Q.bilete.find(x=>x.id===st.mana);
    return `Ai luat bilețelul „${api.esc(b.text)}”. Acum alege, chiar sub el, grupa în care îl pui.`}
  const rest=Q.bilete.filter(b=>st.loc[b.id]==null).length;
  if(rest)return `Atinge un bilețel din teanc ca să-l iei. Sub el apar grupele: atinge-o pe cea în care îl pui. Bilețelele despre același serviciu le pui în aceeași grupă.`;
  return cuNume(Q)?'Toate bilețelele sunt pe tablă. Alege numele fiecărei grupe din lista ei, apoi apasă „Verifică tabla”.':'Toate bilețelele sunt pe tablă. Apasă „Verifică tabla”.';
}
function porneste(Q,body,api,st){
  stil();
  const ordine=Q.bilete.map(b=>b.id);
  body._bs={st,Q,ordine:Q.amesteca===false?ordine:api.shuffle(ordine.slice())};
  body.innerHTML=`<p class="bs-acum" aria-live="polite"></p><div class="bs-joc"></div>
    <div class="bs-teste"><b>Testele</b> <span class="hint">· se bifează când apeși „Verifică tabla”</span><ol></ol></div>`;
  const acum=body.querySelector('.bs-acum');
  const redesen=(focus)=>{
    deseneaza(Q,body,api,body._bs.st);acum.innerHTML=mesajAcum(Q,body._bs.st,api);
    if(focus){const el=body.querySelector(focus);if(el)el.focus({preventScroll:true})}
  };
  body._bs.re=redesen;
  redesen();scrieTeste(Q,body,st,false);
  body.querySelector('.bs-joc').addEventListener('click',e=>{
    if(api.done())return;
    const s=body._bs.st,t=e.target;
    const bb=t.closest('.bs-bilet'),rap=t.closest('[data-rapid]'),pune=t.closest('.bs-pune'),gr=t.closest('.bs-grupa'),inapoi=t.closest('[data-k="inapoi"]');
    if(t.closest('select')||t.closest('label'))return;
    if(inapoi){s.loc[s.mana]=undefined;delete s.loc[s.mana];const id=s.mana;s.mana=null;redesen(`.bs-bilet[data-b="${id}"]`);return}
    if(bb){const id=bb.dataset.b;s.mana=s.mana===id?null:id;redesen(s.mana?`[data-rapid]`:`.bs-bilet[data-b="${id}"]`);return}
    if(t.closest('.bs-rapid')&&!rap)return;   /* clic pe textul „Lipește-l la:”, nu pe un buton */
    if(rap||pune||gr){const g=+(rap?rap.dataset.rapid:(pune||gr).dataset.g);
      if(!s.mana){acum.innerHTML='Întâi atinge un bilețel din teanc. Apoi alege grupa în care îl pui.';return}
      const id=s.mana;s.loc[id]=g;s.mana=null;
      const urm=body._bs.ordine.find(x=>s.loc[x]==null);
      redesen(urm?`.bs-teanc .bs-bilet[data-b="${urm}"]`:`select[data-g="${g}"]`)||0;
      if(!urm&&!cuNume(Q)){const c=document.getElementById('chk');if(c)c.focus({preventScroll:true})}
    }
  });
  body.querySelector('.bs-joc').addEventListener('change',e=>{
    const sel=e.target.closest('select[data-g]');if(!sel||api.done())return;
    body._bs.st.nume[+sel.dataset.g]=sel.value;acum.innerHTML=mesajAcum(Q,body._bs.st,api);
  });
  const nav=api.checkButton(()=>{
    const s=body._bs.st,T=scrieTeste(Q,body,s,true),k=T.findIndex(t=>!t.ok);
    body.querySelectorAll('.bs-grupa').forEach(g=>{const i=+g.dataset.g,bil=Q.bilete.filter(b=>s.loc[b.id]===i);
      g.classList.toggle('ok',k<0);g.classList.toggle('rau',k>=0&&bil.length>0&&(new Set(bil.map(b=>b.s)).size>1||(cuNume(Q)&&s.nume[i]&&bil.some(b=>b.s!==s.nume[i]))))});
    if(k<0){nav.innerHTML='';acum.innerHTML='Toate testele trec: bilețelele stau pe grupe, iar fiecare grupă are numele ei.';api.resolve(true);
      /* regula 14 (judecata 1 V/13, m6): butonul „Verifică tabla” a dispărut; focusul trece pe butonul următor vizibil
         („Încă un exercițiu” sau „mai departe”), nu cade pe pagină */
      setTimeout(()=>{const b=['inca','pas-next','go','next'].map(i=>document.getElementById(i)).find(e=>e&&e.offsetParent!==null&&!e.disabled);
        if(b)b.focus({preventScroll:true})},0);
      return}
    api.resolve(false,`${T.filter(t=>t.ok).length} din ${T.length} teste trec. ${T[k].m}`);
    api.revealButton(()=>{body._bs.st=stareCorecta(Q);redesen();scrieTeste(Q,body,body._bs.st,true);
      body.querySelectorAll('.bs-grupa').forEach(g=>g.classList.add('ok'));nav.innerHTML='';
      api.giveUp(Q.solutieText||'bilețelele stau acum pe grupe, iar fiecare grupă are numele serviciului ei.')});
    /* regula 14: focusul se întoarce pe tablă (primul bilețel din teanc sau prima listă de nume) */
    const f=body.querySelector('.bs-teanc .bs-bilet')||body.querySelector('select[data-g]')||body.querySelector('.bs-pune');
    if(f)f.focus({preventScroll:true});
  },'Verifică tabla');
  return body._bs.st;
}
window.SimBilete={
  render(Q,body,api){porneste(Q,body,api,stareNoua(Q))},
  rezolva(Q,body,api){porneste(Q,body,api,stareCorecta(Q))},
  gresit(Q,body,api){porneste(Q,body,api,stareGresita(Q))},
  _stare:body=>body&&body._bs?body._bs.st:null,
  _evalueaza:evalueaza,
  _corecta:stareCorecta
};
})();
