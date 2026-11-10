/* Extensia „urmărirea indicelui” pentru lecțiile LearningHub — fișier comun (lectii/_sim/urmarire-indice.js).
   PROPRIETAR: autorul lecției VIII · M4 · nr. 24 („Operații cu șiruri: citire, afișare, parcurgere”), 10.11.2026.

   CE SIMULEAZĂ. Nu o aplicație, ci fișa de urmărire din activitatea profesorului (Info_Gimnaziu_2026\data\
   activitati_lectii_VII_VIII.json, lecția 24): „Urmărirea pe hârtie a valorii indicelui la fiecare pas, înainte de
   rulare.” (resursa: „fișă de urmărire a indicelui”). Pe ecran: o repetiție for din C++ (doar de citit), datele ei și
   un tabel cu un rând pe fiecare pas: elevul scrie valoarea lui i și ce se afișează la pasul acela; dedesubt, valoarea
   lui i la care repetiția se oprește. Indicele începe de la 0, ca în C++: v[0] e primul element citit.
   Calculul pașilor e făcut aici, din descrierea repetiției (start, condiție, limită, pas), NU scris de mână în lecție.
   Gesturile: atingere / clic / tastatură. Nicio tragere. Casetele au ≥ 44 px înălțime și font de 16 px (fără mărirea
   paginii pe iPhone), inputmode="text" (minusul pe orice telefon). Enter într-o casetă NU verifică.
   „Verifică” bifează TESTELE numite (rezultat, nu drum: se judecă doar ce e scris acum în tabel). După „Verifică”,
   focusul trece pe prima casetă greșită (regula 14). Nimic nu se salvează și nimic nu pleacă (fără <form>, fără name,
   fără stocare, fără cereri).

   Q (exercițiul), pe lângă q, ajutor, why, solutieText ale motorului:
     Q.cod      textul repetiției (și al rândurilor din jur), arătat într-un <pre>, doar de citit
     Q.v        [valori] elementele citite, în ordinea citirii (v[0], v[1], …); lipsește dacă repetiția afișează i
     Q.n        n (implicit Q.v.length); apare în rândul cu datele
     Q.start    valoarea de pornire a lui i (număr)
     Q.cond     '<' | '<=' | '>' | '>=' (condiția: i <cond> limita)
     Q.limita   numărul cu care se compară i (de exemplu n sau 0)
     Q.condText textul condiției, ca în cod (de exemplu „i < n”), pentru mesaje
     Q.pas      +1 (i++) sau -1 (i--)
     Q.afis     'v' (cout << v[i]) sau 'i' (cout << i)
     Q.coloana  titlul coloanei a doua (implicit „Se afișează”)
     Q.gresit   'de_la_1' (implicit): starea greșită tipică, pentru poartă — elementele luate cu poziția de la 1

   TESTELE (numele lor spun CE se verifică, nu răspunsul), în ordinea în care primul care pică numește greșeala:
     'i'    Valoarea lui i la fiecare pas
     'o'    Ce se afișează la fiecare pas
     'stop' Valoarea lui i la care repetiția se oprește

   API PUBLIC (NU se schimbă fără o notă datată aici și în surse.md-ul lecției VIII/24):
     UrmarireIndice.render / rezolva / gresit (Q, body, api) — tipul motorului: tipuri:{'urmarire-indice':UrmarireIndice}
     UrmarireIndice.pasi(Q) -> {randuri:[{i, o}], stop}  — calculul pașilor (folosit de probe)
     UrmarireIndice.tablou(valori, {nume:'v'}) -> HTML static: căsuțele șirului cu v[0], v[1]… deasupra, pentru „Uite cum”
     UrmarireIndice._evalueaza(Q, stare) -> [{id, ce, ok, m}] ; UrmarireIndice._stare(body)
   Ce NU se schimbă: numele testelor, forma lui Q, clasele CSS „uix-…”, id-ul de stil „sim-urmarire-indice-css”,
   regula „nimic nu se salvează, nimic nu pleacă”.
   Probe: lectii/viii/m4-l24/_proba/.
   SCHIMBAT 10.11.2026 (R1 VIII/24, după judecata 1, constatările E și E2; API-ul și numele testelor NESCHIMBATE):
     - o casetă cu „v[3]” singur (numele, nu valoarea) primește mesajul ei, nu mai e citită ca 3; „n-1” / „n - 1” / „n+1”
       se calculează cu n din date (Q.n sau Q.v.length); orice altă literă = „scrie un singur număr”;
     - la pasul 1, când pornirea din for conține n („int i = n - 1”), mesajul o arată și cere calculul cu n din date;
     - „Ia-o de la capăt” golește tabelul numai la a doua apăsare (prima spune ce face); butonul stă cu 16 px mai jos.
     - _unNumar(t, n): al doilea argument (n) e nou și opțional.
*/
(function(){
'use strict';
const CSS=`
.uix-rad{margin:4px 0}
.uix-acum{margin:0 0 6px;font-size:.92rem;line-height:1.4;color:var(--ink);min-height:1.4em}
.uix-cod{margin:4px 0 8px;padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:var(--paper2);color:var(--ink);
  font-family:var(--fm,monospace);font-size:.9rem;line-height:1.45;white-space:pre;overflow-x:auto;tab-size:4}
.uix-date{margin:0 0 8px;font-size:.95rem;line-height:1.4}
.uix-tab{border-collapse:collapse;margin:2px 0 8px;font-size:.95rem}
.uix-tab th,.uix-tab td{border:1px solid var(--line);padding:4px 6px;text-align:center;vertical-align:middle}
.uix-tab th{background:var(--paper2);font-weight:700;font-size:.88rem;line-height:1.2}
.uix-tab td.uix-nr{color:var(--ink2);font-size:.85rem;min-width:44px}
.uix-in{width:84px;min-height:44px;box-sizing:border-box;padding:4px;border:2px solid var(--line);border-radius:6px;
  background:var(--paper);color:var(--ink);font:inherit;font-size:16px;font-weight:700;text-align:center}
.uix-in:focus-visible,.uix-btn:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
.uix-in.rau{border-color:var(--bad)}
.uix-stop{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:4px 0 8px;font-size:.95rem;line-height:1.35}
.uix-unelte{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0 8px}
.uix-btn{min-height:44px;padding:6px 12px;border:1px solid var(--line);border-radius:8px;background:var(--paper2);color:var(--ink);font:inherit;font-size:.9rem;cursor:pointer}
.uix-teste{margin-top:10px;border:1px solid var(--line);border-radius:8px;padding:10px 12px;background:var(--paper2)}
.uix-teste ol{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:4px}
.uix-teste li{display:flex;gap:8px;align-items:flex-start;font-size:.93rem;line-height:1.35}
.uix-teste li .s{flex:none;width:1.4em;text-align:center;font-weight:800}
.uix-teste li.ok .s{color:var(--ok)}.uix-teste li.rau .s{color:var(--bad)}
.uix-teste li .m{display:block;font-size:.85rem;color:var(--bad)}
.uix-teste .hint{font-size:.85rem;color:var(--ink2)}
.uix-sir{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 8px}
.uix-el{display:flex;flex-direction:column;align-items:center;gap:2px;min-width:46px}
.uix-ix{font-size:.8rem;color:var(--ink2);font-family:var(--fm,monospace)}
.uix-cas{min-width:46px;min-height:40px;padding:4px 6px;display:flex;align-items:center;justify-content:center;border:2px solid var(--line);
  border-radius:6px;background:var(--paper);color:var(--ink);font-weight:700;box-sizing:border-box}
`;
function stil(){
  if(typeof document==='undefined'||document.getElementById('sim-urmarire-indice-css'))return;
  const s=document.createElement('style');s.id='sim-urmarire-indice-css';s.textContent=CSS;(document.head||document.documentElement).appendChild(s);
}
stil();
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const arataNr=v=>{const s=String(v);return /^-\d/.test(s)?'−'+s.slice(1):s};

/* ---------- pașii repetiției, calculați din descriere ---------- */
function adevarat(i,cond,lim){return cond==='<'?i<lim:cond==='<='?i<=lim:cond==='>'?i>lim:cond==='>='?i>=lim:false}
function pasi(Q){
  const randuri=[];let i=Number(Q.start),g=0;const v=Q.v||[];
  while(adevarat(i,Q.cond,Number(Q.limita))&&g<60){randuri.push({i,o:Q.afis==='i'?i:v[i]});i+=Number(Q.pas)||1;g++}
  return {randuri,stop:i};
}

/* ---------- un număr dintr-o casetă (forma copilului: −1, – 1, minus 1, „i = 4”, „v[3] = 25”, „n - 1”, „4-1”) ----------
   R1 (10.11.2026, după judecata 1, constatarea E): „v[3]” singur nu mai e citit ca 3 (e NUMELE elementului, nu valoarea
   afișată: {element}); „n-1” / „n - 1” nu mai e citit ca −1 (n se înlocuiește cu valoarea din date, apoi se face scăderea);
   celelalte cuvinte („stop la 5”, „3 (i)”) se ignoră, ca înainte. Fiecare parte din jurul lui „=” se citește separat:
   „v[3] = 25”, „25 = v[3]”, „i = n - 1”, „n-1 = 3” dau numărul. Scăderea/adunarea a două numere („4-1”, „4 - 1”) se face
   numai cu spații la fel de ambele părți ale semnului; „3 -1” rămâne „două numere” (scrie unul singur). */
const LIT=/[a-zăâîșțşţ0-9_]/;
function oParte(s,n){
  s=s.trim();if(!s)return {gol:true};
  const faraEl=s.replace(/[a-z_]\w*\s*\[[^\]]*\]/g,' ').trim();
  if(faraEl!==s&&!/\d/.test(faraEl))return {element:true};
  s=faraEl;
  /* „n” singur (nu litera unui cuvânt: „în”, „nu”) se înlocuiește cu n din date; fără lookbehind (Safari vechi) */
  let cuN=false;
  if(n!=null)s=s.replace(/n/g,(m,k,t)=>{if(LIT.test(t[k-1]||' ')||LIT.test(t[k+1]||' '))return m;cuN=true;return String(n)});
  s=s.replace(/[a-zăâîșțşţ_()]+/g,' ').trim();
  if(!s)return {nu:true};
  const ex=cuN?s.match(/^(-?\d+)\s*([+-])\s*(\d+)$/):s.match(/^(-?\d+)(\s*)([+-])\2(\d+)$/);
  if(ex){const a=Number(ex[1]),b=Number(cuN?ex[3]:ex[4]),op=cuN?ex[2]:ex[3];return {n:op==='+'?a+b:a-b}}
  const nr=(s.match(/-?\s*\d+/g)||[]).map(x=>Number(x.replace(/\s+/g,'')));
  if(!nr.length)return {nu:true};
  if(nr.some(x=>x!==nr[0]))return {multe:true};
  return {n:nr[0]};
}
function unNumar(t,n){
  const s=String(t==null?'':t).toLowerCase().replace(/[−‒–—‑]/g,'-').replace(/minus\s*/g,'-').trim();
  if(!s)return {gol:true};
  if(!s.includes('='))return oParte(s,n);
  const P=s.split('=').map(x=>oParte(x,n)),nr=P.filter(p=>'n' in p).map(p=>p.n);
  if(nr.length)return nr.some(x=>x!==nr[0])?{multe:true}:{n:nr[0]};
  return P.find(p=>p.element)||P.find(p=>p.litere)||P.find(p=>p.multe)||{nu:true};
}
/* valoarea de pornire, cum e scrisă în for („int i = n - 1;” -> „n - 1”), pentru mesajul de la pasul 1 */
function pornireScrisa(Q){const m=/int\s+i\s*=\s*([^;]+);/.exec(String(Q.cod||''));return m?m[1].trim():''}

/* ---------- starea ---------- */
function stareNoua(Q){const k=pasi(Q).randuri.length;return {i:Array(k).fill(''),o:Array(k).fill(''),stop:'',verificat:false}}
function stareCorecta(Q){const P=pasi(Q);return {i:P.randuri.map(r=>String(r.i)),o:P.randuri.map(r=>String(r.o)),stop:String(P.stop),verificat:false}}
function stareGresita(Q){
  /* greșeala tipică: elementul luat cu poziția numărată de la 1 (v[i] scris ca al i-lea element) */
  const P=pasi(Q),v=Q.v||[];
  return {i:P.randuri.map(r=>String(r.i)),o:P.randuri.map(r=>Q.afis==='i'?String(r.i+1):String(v[r.i-1]!==undefined?v[r.i-1]:'')),stop:String(P.stop),verificat:false};
}

function evalueaza(Q,st){
  const P=pasi(Q),v=Q.v||[],R=P.randuri;
  const T=[{id:'i',ce:'Valoarea lui i la fiecare pas',ok:true,m:''},{id:'o',ce:(Q.coloana||'Ce se afișează')+' la fiecare pas',ok:true,m:''},
           {id:'stop',ce:'Valoarea lui i la care repetiția se oprește',ok:true,m:''}];
  const ti=T[0],to=T[1],ts=T[2];
  const nDate=Q.n!=null?Number(Q.n):(Q.v?Q.v.length:null),porn=pornireScrisa(Q);
  for(let k=0;k<R.length;k++){
    const a=unNumar(st.i[k],nDate);
    if(a.gol){ti.ok=false;ti.m=`Scrie valoarea lui i pe fiecare rând (rândul ${k+1} e gol).`;ti.rand=k;break}
    if(a.nu||a.multe||a.element||a.litere){ti.ok=false;ti.rand=k;
      ti.m=`Pe rândul ${k+1}, la i, scrie un singur număr: valoarea lui i la pasul acela${nDate!=null?` (cu datele: n = ${nDate})`:''}.`;break}
    if(a.n!==R[k].i){ti.ok=false;ti.rand=k;
      ti.m=k===0?(porn&&/\bn\b/.test(porn)&&nDate!=null
          ?`La pasul 1, i are valoarea de pornire, cea scrisă în for după „int i =”: ${esc(porn)}. În date, n = ${nDate}: calculează ${esc(porn)} și scrie numărul.`
          :'La pasul 1, i are valoarea de pornire: cea scrisă în for după „int i =”.')
        :`De la un pas la altul, i se schimbă cum spune a treia parte a lui for (${Number(Q.pas)>0?'i++: crește cu 1':'i--: scade cu 1'}). Verifică pasul ${k+1}.`;break}
  }
  for(let k=0;k<R.length;k++){
    const a=unNumar(st.o[k],nDate);
    if(a.gol){to.ok=false;to.m=`Scrie pe fiecare rând ce se afișează (rândul ${k+1} e gol).`;to.rand=k;break}
    if(a.element&&Q.afis!=='i'){to.ok=false;to.rand=k;const ii=R[k].i;
      to.m=`La pasul ${k+1}, i = ${ii}: scrie numărul pe care îl afișează programul, adică valoarea lui v[${ii}] din date, nu numele lui.`;break}
    if(a.nu||a.multe||a.element||a.litere){to.ok=false;to.m=`Pe rândul ${k+1}, scrie un singur număr: cel afișat la pasul acela.`;to.rand=k;break}
    if(a.n!==R[k].o){to.ok=false;to.rand=k;const ii=R[k].i;
      if(Q.afis==='i')to.m=`La pasul ${k+1} se afișează chiar valoarea lui i de pe rândul acela.`;
      else if(v[ii-1]!==undefined&&a.n===v[ii-1]&&v[ii-1]!==v[ii])to.m=`La pasul ${k+1}, i = ${ii}, iar tu ai scris elementul de pe poziția ${ii}, numărând de la 1. În C++ indicele începe de la 0: v[0] e primul element citit, deci v[${ii}] e al ${ii+1}-lea.`;
      else to.m=`La pasul ${k+1}, i = ${ii}, deci se afișează v[${ii}]. Numără elementele din date de la 0: primul e v[0].`;
      break}
  }
  const s=unNumar(st.stop,nDate);
  if(s.gol){ts.ok=false;ts.m='Scrie valoarea lui i la care repetiția se oprește.'}
  else if(s.nu||s.multe||s.element||s.litere){ts.ok=false;ts.m='Scrie un singur număr: valoarea lui i la care repetiția se oprește.'}
  else if(s.n!==P.stop){ts.ok=false;
    const ult=R.length?R[R.length-1].i:Number(Q.start);
    ts.m=R.length&&s.n===ult?`Cu i = ${ult}, condiția ${esc(Q.condText||'')} e încă adevărată: pasul acesta se face (e ultimul rând din tabel). Repetiția se oprește la valoarea pe care o primește i după el.`
      :`Repetiția se oprește la prima valoare a lui i pentru care condiția ${esc(Q.condText||'')} e falsă: valoarea pe care o primește i după ultimul rând din tabel.`}
  return T;
}

/* ---------- desenul ---------- */
function htmlTablou(valori,o){
  o=o||{};const nume=o.nume||'v';
  return `<div class="uix-sir" role="group" aria-label="${esc(o.eticheta||'Elementele tabloului '+nume+', cu indicii lor')}">${(valori||[]).map((x,k)=>
    `<div class="uix-el"><span class="uix-ix">${esc(nume)}[${k}]</span><span class="uix-cas">${esc(arataNr(x))}</span></div>`).join('')}</div>`;
}
function deseneaza(Q,body,st){
  const P=pasi(Q),zona=body.querySelector('.uix-joc');
  const v=Q.v,n=Q.n!=null?Q.n:(v?v.length:null);
  const date=v?`<p class="uix-date"><b>Datele:</b> n = ${esc(n)}, apoi elementele, în ordinea citirii: ${v.map(arataNr).map(esc).join(', ')}.</p>`
    :(n!=null?`<p class="uix-date"><b>Datele:</b> n = ${esc(n)}.</p>`:'');
  const col=esc(Q.coloana||'Se afișează');
  const rows=P.randuri.map((r,k)=>`<tr><td class="uix-nr">${k+1}</td>
    <td><input class="uix-in" data-c="i" data-k="${k}" inputmode="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="Pasul ${k+1}: valoarea lui i" value="${esc(st.i[k])}"></td>
    <td><input class="uix-in" data-c="o" data-k="${k}" inputmode="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="Pasul ${k+1}: ${col}" value="${esc(st.o[k])}"></td></tr>`).join('');
  zona.innerHTML=`<pre class="uix-cod">${esc(Q.cod||'')}</pre>${date}
   <table class="uix-tab"><thead><tr><th>Pasul</th><th>i</th><th>${col}</th></tr></thead><tbody>${rows}</tbody></table>
   <label class="uix-stop">Repetiția se oprește când i ajunge la: <input class="uix-in" data-c="stop" inputmode="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" value="${esc(st.stop)}"></label>`;
}
function scrieTeste(Q,body,st){
  const T=evalueaza(Q,st),arata=st.verificat;
  body.querySelector('.uix-teste ol').innerHTML=T.map((t,k)=>`<li data-t="${t.id}" class="${arata?(t.ok?'ok':'rau'):''}"><span class="s">${arata?(t.ok?'✓':'✗'):'○'}</span><span>${k+1}. ${t.ce}${arata&&!t.ok&&t.m?`<span class="m">${t.m}</span>`:''}</span></li>`).join('');
  body.querySelectorAll('.uix-in').forEach(el=>el.classList.remove('rau'));
  if(arata){const t=T.find(x=>!x.ok);if(t){const el=t.id==='stop'?body.querySelector('.uix-in[data-c="stop"]'):body.querySelector(`.uix-in[data-c="${t.id}"][data-k="${t.rand||0}"]`);if(el)el.classList.add('rau')}}
  return T;
}
const MESAJ='Completează tabelul pe hârtie sau direct aici: pe fiecare rând, valoarea lui i și ce se afișează. Apoi apasă „Verifică”.';
function porneste(Q,body,api,st){
  stil();
  body._ux={st,Q};
  body.innerHTML=`<div class="uix-rad"><p class="uix-acum" aria-live="polite"></p><div class="uix-joc"></div>
    <div class="uix-unelte"><button type="button" class="uix-btn" data-k="capat">Ia-o de la capăt</button></div>
    <div class="uix-teste"><b>Testele</b> <span class="hint">· se bifează când apeși „Verifică”</span><ol></ol></div></div>`;
  const rad=body.querySelector('.uix-rad'),acum=body.querySelector('.uix-acum'),S=()=>body._ux.st;
  const redesen=focus=>{deseneaza(Q,body,S());scrieTeste(Q,body,S());if(focus){const el=body.querySelector(focus);if(el)el.focus({preventScroll:true})}};
  acum.textContent=MESAJ;redesen();
  /* R1 (E2): „Ia-o de la capăt” golește tabelul numai la a doua apăsare; prima spune ce face. Orice scris în tabel anulează. */
  const capat=body.querySelector('.uix-btn[data-k="capat"]'),ETIC='Ia-o de la capăt';
  const dezarmeaza=()=>{if(capat.dataset.armat){delete capat.dataset.armat;capat.textContent=ETIC}};
  rad.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('button');if(!b||!rad.contains(b))return;
    if(b.dataset.k==='capat'){
      if(!b.dataset.armat){b.dataset.armat='1';b.textContent='Sigur? Apasă din nou: se golește tot tabelul';acum.textContent='Apasă încă o dată „Sigur?” ca să golești tabelul. Ca să-l păstrezi, atinge orice casetă din el.';return}
      dezarmeaza();body._ux.st=stareNoua(Q);acum.textContent=MESAJ;redesen('.uix-in')}});
  const joc=body.querySelector('.uix-joc');
  joc.addEventListener('focusin',dezarmeaza);
  joc.addEventListener('input',e=>{const t=e.target,s=S();if(!t.matches('.uix-in'))return;
    if(t.dataset.c==='stop')s.stop=t.value;else s[t.dataset.c][+t.dataset.k]=t.value;
    if(s.verificat)scrieTeste(Q,body,s)});
  joc.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('input')){e.preventDefault();acum.textContent='Apasă „Verifică” când ești gata.'}});
  const nav=api.checkButton(()=>{
    const s=S();s.verificat=true;const T=scrieTeste(Q,body,s),k=T.findIndex(t=>!t.ok);
    if(k<0){nav.innerHTML='';acum.textContent='Toate testele trec.';api.resolve(true);
      setTimeout(()=>{const b=['inca','pas-next','go','next'].map(i=>document.getElementById(i)).find(x=>x&&x.offsetParent!==null&&!x.disabled);if(b)b.focus({preventScroll:true})},0);return}
    api.resolve(false,`${T.filter(t=>t.ok).length} din ${T.length} teste trec. ${T[k].m}`);
    api.revealButton(()=>{body._ux.st=stareCorecta(Q);body._ux.st.verificat=true;redesen();nav.innerHTML='';
      api.giveUp(Q.solutieText||'acum tabelul e completat corect, cu toate testele bifate.')});
    const t=T[k],f=t.id==='stop'?body.querySelector('.uix-in[data-c="stop"]'):body.querySelector(`.uix-in[data-c="${t.id}"][data-k="${t.rand||0}"]`);
    if(f)f.focus({preventScroll:true});
  });
  return S();
}
const API={
  render(Q,body,api){porneste(Q,body,api,stareNoua(Q))},
  rezolva(Q,body,api){porneste(Q,body,api,stareCorecta(Q))},
  gresit(Q,body,api){porneste(Q,body,api,stareGresita(Q))},
  pasi,tablou:htmlTablou,
  _evalueaza:evalueaza,_unNumar:unNumar,_stareCorecta:stareCorecta,_stareGresita:stareGresita,
  _stare:body=>body&&body._ux?body._ux.st:null
};
if(typeof window!=='undefined')window.UrmarireIndice=API;
if(typeof module!=='undefined'&&module.exports)module.exports=API;
})();
