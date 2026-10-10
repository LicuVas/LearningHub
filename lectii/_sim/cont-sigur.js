/* Simulatorul „cont sigur” pentru lecțiile LearningHub — fișier comun (lectii/_sim/cont-sigur.js).
   PROPRIETAR: autorul lecției VI · M2 · nr. 12 („Protecția datelor personale. Parole și identitate virtuală”), 10.10.2026.

   CE SIMULEAZĂ. Nu un serviciu anume (lecția NU predă setările unui serviciu), ci trei lucruri pe care le are orice cont:
   o parolă, un profil pe care îl văd și alții, mesaje de la alți utilizatori. Toate persoanele și parolele sunt INVENTATE.

   SIGURANȚA (cerința lecției, probată în lectii/vi/m2-l12/_proba/proba_siguranta.py):
     - nimic din ce tastează elevul nu se scrie în localStorage / sessionStorage / cookie și nu pleacă în rețea: valoarea
       câmpului stă doar în pagină (DOM) și se pierde la „Încă un exercițiu”, la reîncărcare sau la închidere;
     - câmpurile sunt <input type="text"> FĂRĂ <form>, fără `name`, cu autocomplete/autocorrect/autocapitalize/spellcheck
       oprite: cu type="password" browserul calculatorului COMUN ar putea întreba „Salvezi parola?”;
     - evaluatorul de tărie rulează DOAR aici (fără servicii externe de tipul „a fost parola ta furată?”).

   TIPURI pentru motor (JocMotor.porneste({…, tipuri:{parola:SimContSigur.parola, profil:SimContSigur.profil,
   cont:SimContSigur.cont}})):
     parola  câmp pentru o parolă INVENTATĂ, cu teste care se bifează cât scrii și bara „Tăria”.
             Q.teste  [cheie | {c:cheie, v, ce}] din SimContSigur.TESTE (lung15, mari, mici, cifre, simbol, cuvinte3,
                      faraDate {v:[cuvinte], ce:'…'}, necomuna, neghicita, nuExemplu {v:[parolele scrise în lecție, fără
                      soluția exercițiului]}); Q.start (text de pornire), Q.solutie (pentru „Arată-mi răspunsul” și poartă),
                      Q.gresit (greșeala tipică, pentru poartă), Q.eticheta (numele câmpului). Focusul revine în câmp după
                      „Verifică” doar dacă un test pică (pe telefon, focusul deschide tastatura).
     profil  un profil (și mesajele lui) pe rânduri; elevul atinge rândurile care sunt SEMNE că profilul e fals.
             Q.profil {nume, avatar (un caracter), randuri:[{t, semn:true|false, dece, mesaj:true?}]}; Q.gresit = câte semne
             marchează greșeala tipică (implicit: toate fără ultimul).
     cont    atelierul: un cont (parolă nouă + profilul public + mesajul de la profilul fals), cu 7 teste numite
             (lung, amestec, fraza, date, ascunse, ramase, mesaj).
             Q.cont {app, eu, cine, despre, date:[{id,et,val,ascunde:true|false}], interzise:[…], explica?:{interzis:'ce e'},
                     publicate?:[parolele scrise în lecție, fără soluție], solutie?, gresit?, mesaj:{de, text}}
                     (implicit: CONT_MATEI). Focusul nu sare în câmpul parolei după Blochează/Raportează/Trimite.
   FUNCȚII PUBLICE (pentru lecțiile care vin):
     SimContSigur.analiza(parola, {interzise, publicate}) → {n, lung, mari, mici, cifre, simbol, cuvinte, date:[ce a găsit],
                     comuna, an, rand, publicata, usor, pas:0-5, nota:'puternică'|'încă nu e puternică'|''}
                     „puternică” = 15 caractere + cele patru feluri de semne + nimic ușor de ghicit (usor = date despre
                     persoană, parolă foarte folosită, un an 1950-2029, același semn sau cifre la rând, parolă din lecție).
     SimContSigur.TESTE       catalogul testelor de parolă (cheie → {ce, f(analiza, v)})
     SimContSigur.evalueazaCont(Q, stare) → [{id, ce, ok, m}]   (atelierul, pe starea dată)
   PENTRU LECȚIA URMĂTOARE: poți folosi tipurile și funcțiile de mai sus așa cum sunt, cu alte date (alt profil, alt mesaj).
   NU schimbi aici: pragul de 15 caractere și cele patru feluri de semne (lecția VI/12 le predă așa, după DNSC), numele
   testelor, regula „nimic nu se salvează, nimic nu pleacă”. O extensie nouă stă în alt fișier din lectii/_sim/, cu nume nou. */
(function(){
'use strict';
const CSS=`
.cs-avert{margin:0 0 8px;padding:8px 10px;border-left:4px solid var(--bad);background:var(--badbg);border-radius:0 6px 6px 0;font-size:.93rem;line-height:1.4}
.cs-camp{display:flex;flex-direction:column;gap:4px;margin:6px 0}
.cs-camp>span{font-size:.88rem;font-weight:700;color:var(--ink2)}
.cs-camp input{min-height:44px;padding:6px 10px;border:2px solid var(--line);border-radius:8px;background:var(--paper);color:var(--ink);
  font-family:var(--fm);font-size:1.05rem;letter-spacing:.02em;width:100%;box-sizing:border-box}
.cs-camp input:focus{outline:none;border-color:var(--accent)}
.cs-tarie{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:.92rem;margin:2px 0 6px}
.cs-bara{flex:1 1 140px;height:10px;border-radius:5px;background:var(--paper2);border:1px solid var(--line);overflow:hidden;min-width:120px}
.cs-bara i{display:block;height:100%;width:0;transition:width .15s}
.cs-teste{margin-top:8px;border:1px solid var(--line);border-radius:8px;padding:8px 12px;background:var(--paper2)}
.cs-teste .cs-lbl{font-size:.85rem;font-weight:700}
.cs-teste ol{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:4px}
.cs-teste li{display:flex;gap:8px;align-items:flex-start;font-size:.93rem;line-height:1.35}
.cs-teste li .s{flex:none;width:1.4em;text-align:center;font-weight:800}
.cs-teste li.ok .s{color:var(--ok)}.cs-teste li.rau .s{color:var(--bad)}
.cs-teste li .m{display:block;font-size:.86rem;color:var(--bad)}
.cs-prof{border:1px solid var(--line);border-radius:12px;background:var(--paper);overflow:hidden}
.cs-prof-cap{display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--paper2);border-bottom:1px solid var(--line)}
.cs-av{flex:none;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;font-size:1.4rem;background:var(--sel);border:1px solid var(--line)}
.cs-prof-cap b{font-size:1.02rem}
.cs-prof-cap small{display:block;color:var(--ink2);font-size:.82rem}
.cs-rows{display:flex;flex-direction:column;gap:6px;padding:10px}
.cs-rows .cs-sep{font-size:.82rem;font-weight:700;color:var(--ink2);margin:6px 2px 0}
.cs-r{min-height:44px;text-align:left;padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:var(--paper);color:var(--ink);
  font:inherit;font-size:.95rem;line-height:1.35;cursor:pointer}
.cs-r.mesaj{background:var(--paper2);border-radius:14px 14px 14px 4px}
.cs-r[aria-pressed="true"]{outline:3px solid #E4002B;outline-offset:-1px}
.cs-r[aria-pressed="true"]::after{content:"  ← semn";font-weight:700;color:#B3261E}
:root[data-theme="dark"] .cs-r[aria-pressed="true"]::after{color:#FF8A80}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .cs-r[aria-pressed="true"]::after{color:#FF8A80}}
.cs-r.found{outline:3px solid var(--ok);outline-offset:-1px}
.cs-r.found::after{content:"  ✓ semn";font-weight:700;color:var(--ok)}
.cs-r:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
.cs-app{border:1px solid var(--line);border-radius:12px;overflow:hidden;background:var(--paper)}
.cs-app-cap{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;padding:8px 12px;background:var(--accent);color:var(--accentInk);font-weight:700}
.cs-app-cap small{font-weight:500;opacity:.9}
.cs-card{padding:10px 12px;border-top:1px solid var(--line)}
.cs-card:first-of-type{border-top:0}
.cs-card h4{margin:0 0 6px;font-size:1rem}
.cs-card .cs-sub{margin:0 0 8px;font-size:.88rem;color:var(--ink2)}
.cs-date{display:flex;flex-direction:column;gap:6px}
.cs-d{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;padding:6px 8px;border:1px solid var(--line);border-radius:8px;background:var(--paper2)}
.cs-d .et{font-size:.82rem;color:var(--ink2);display:block}
.cs-d .val{font-weight:600}
.cs-d.ascuns .val{text-decoration:line-through;opacity:.55}
.cs-d .stare{font-size:.8rem;color:var(--ink2);display:block}
.cs-b{min-height:40px;min-width:44px;padding:6px 12px;border:1px solid var(--accent);border-radius:8px;background:var(--paper);color:var(--accent);font:inherit;font-weight:700;font-size:.9rem;cursor:pointer}
.cs-b:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
.cs-b[disabled]{opacity:.45;cursor:default}
.cs-msg{border:1px solid var(--line);border-radius:14px 14px 14px 4px;padding:8px 10px;background:var(--paper2);font-size:.95rem;line-height:1.4}
.cs-msg .de{font-size:.82rem;color:var(--ink2);display:block;margin-bottom:2px}
.cs-msg-b{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
.cs-stare{margin:8px 0 0;font-size:.9rem;font-weight:600}
.cs-rasp{margin-top:8px;display:flex;flex-direction:column;gap:6px}
.cs-rasp textarea{min-height:64px;padding:6px 8px;border:2px solid var(--line);border-radius:8px;background:var(--paper);color:var(--ink);font:inherit;font-size:.95rem}
.cs-reset{margin-top:10px}
.cs-motiv{margin:-2px 0 4px;font-size:.88rem;color:var(--bad);min-height:1.2em}
.cs-app:focus{outline:none}
#cs-h-msg:focus{outline:none}#cs-h-msg:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
`;
function stil(){if(document.getElementById('cs-stil'))return;const s=document.createElement('style');s.id='cs-stil';s.textContent=CSS;document.head.appendChild(s)}

/* ---------------- analiza parolei (rulează doar aici) ---------------- */
const eLitera=c=>c.toLowerCase()!==c.toUpperCase();
const eMare=c=>eLitera(c)&&c===c.toUpperCase()&&c!==c.toLowerCase();
const eMica=c=>eLitera(c)&&c===c.toLowerCase()&&c!==c.toUpperCase();
const eCifra=c=>c>='0'&&c<='9';
const eSpatiu=c=>/\s/.test(c);
const faraSemne=s=>String(s||'').normalize('NFKD').replace(/[̀-ͯ]/g,'').toLowerCase();
/* parolele foarte folosite (le încearcă primele cine ghicește parole), fără diacritice. Cele din LITERE se caută la începutul
   sau la sfârșitul unui CUVÂNT din parolă („Parolamea”, „MyQwerty”), nu oriunde: „Badminton” are „admin” la mijloc și e un
   sport, nu o parolă folosită (judecata 1, 11.10.2026). Cele cu cifre se caută oriunde („Fotbal12345678”). */
const COMUNE=['parola','password','qwerty','123456','12345678','111111','000000','abc123','iloveyou','admin','asdfgh'];
/* cuvintele: șirurile de litere, despărțite de cifre, simboluri, spații sau de trecerea literă mică → literă mare */
function cuvinte(p){
  const out=[];let cur='';const ch=[...p];
  ch.forEach((c,i)=>{
    if(!eLitera(c)){if(cur)out.push(cur);cur='';return}
    if(cur&&eMare(c)&&eMica(ch[i-1]))out.push(cur),cur='';
    cur+=c});
  if(cur)out.push(cur);
  return out.filter(w=>[...w].length>=3)}
function eComuna(p,f){const ws=cuvinte(p).map(faraSemne);
  return COMUNE.some(x=>/^[a-z]+$/.test(x)?ws.some(w=>w.startsWith(x)||w.endsWith(x)):f.includes(x))}
/* un an între 1950 și 2029 (anul nașterii se ghicește primul): oriunde în parolă, oricâte cuvinte ar avea ea
   („Andrei2013!Maria#Pop” nu e puternică — judecata 1) */
const AN=/(19[5-9]\d|20[0-2]\d)/;
/* „la rând”: același semn de cel puțin 4 ori (aaaa, !!!!) sau cel puțin 4 cifre care urcă ori coboară din 1 în 1 (1234, 9876);
   „Aaaaaaaaaaaaaa1!” nu e puternică, deși are 16 caractere și amestec (judecata 1, sonnet) */
function laRand(f){
  if(/(.)\1{3,}/u.test(f))return 'semn';
  if((f.match(/[a-z]{4,}/g)||[]).some(s=>{for(let i=0;i+3<s.length;i++){const d=[0,1,2].map(k=>s.charCodeAt(i+k+1)-s.charCodeAt(i+k));
    if(d.every(x=>x===1)||d.every(x=>x===-1))return true}return false}))return 'litere';
  return (f.match(/\d{4,}/g)||[]).some(s=>{for(let i=0;i+3<s.length;i++){const d=[0,1,2].map(k=>+s[i+k+1]-+s[i+k]);
    if(d.every(x=>x===1)||d.every(x=>x===-1))return true}return false})?'cifre':''}
/* aceleași cuvinte ca un exemplu din lecție, cu altă cifră sau alt semn („Pian5!Nor#Lebada” față de „Pian4!Nor#Lebada”) */
function aceleasiCuvinte(p,publicate){
  const W=new Set(cuvinte(p).map(faraSemne));if(!W.size)return false;
  return (publicate||[]).some(x=>{const E=new Set(cuvinte(String(x||'')).map(faraSemne));return E.size&&[...W].every(w=>E.has(w))})}
/* două cuvinte sunt „la fel” dacă unul îl conține pe celălalt (amândouă de cel puțin 4 litere) sau încep cu aceleași 5 litere
   („fotbal” și „fotbalul”): judecata 3 */
const laFel=(x,y)=>x===y||(Math.min(x.length,y.length)>=4&&(x.includes(y)||y.includes(x)))||(x.length>=5&&y.length>=5&&x.slice(0,5)===y.slice(0,5));
function diferiteP(p){const g=[];let pe=null;for(const w of cuvinte(p).map(faraSemne)){const x=g.find(x=>laFel(x,w));if(x===undefined)g.push(w);else if(!pe)pe=[x,w]}return {n:g.length,pereche:pe}}
function diferiteN(p){return diferiteP(p).n}
/* aceeași parolă din lecție, scrisă întocmai (nu doar cu aceleași cuvinte) */
const publExacta=(f,publicate)=>(publicate||[]).some(x=>x&&f.includes(faraSemne(x)));
function analiza(p,o){
  p=String(p||'');o=o||{};
  const ch=[...p],n=ch.length,f=faraSemne(p);
  const a={n,lung:n>=15,mari:ch.some(eMare),mici:ch.some(eMica),cifre:ch.some(eCifra),
    simbol:ch.some(c=>!eLitera(c)&&!eCifra(c)&&!eSpatiu(c)),cuvinte:cuvinte(p).length,
    diferite:diferiteN(p),pereche:diferiteP(p).pereche,
    date:(o.interzise||[]).filter(x=>x&&f.includes(faraSemne(x))),comuna:eComuna(p,f),
    an:AN.test(p),rand:!!laRand(f),tipRand:laRand(f)||'',exacta:publExacta(f,o.publicate),
    publicata:publExacta(f,o.publicate)||aceleasiCuvinte(p,o.publicate)};
  /* două trepte, ca în lecție (DNSC): „puternică” = cel puțin 15 caractere + cele patru feluri de semne și nimic din ce se
     ghicește ușor (date despre persoană, o parolă foarte folosită, un an, același semn sau cifre la rând, o parolă scrisă în
     lecție); altfel „încă nu e puternică”. `pas` (0-5) = câte din cele cinci cerințe trec, doar pentru bară; ce se ghicește
     ușor ține bara jos. */
  a.pas=[a.lung,a.mari,a.mici,a.cifre,a.simbol].filter(Boolean).length;
  a.numeAn=a.an&&a.cuvinte<=1;   /* „un nume și un an” (maria2014): păstrat pentru cine îl citea */
  a.usor=!!(a.date.length||a.comuna||a.an||a.rand||a.publicata);
  a.nota=!n?'':(a.pas===5&&!a.usor)?'puternică':'încă nu e puternică';
  return a}
const TESTE={
  lung15:{ce:'Are cel puțin 15 caractere',f:a=>a.lung},
  mari:{ce:'Are litere mari',f:a=>a.mari},
  mici:{ce:'Are litere mici',f:a=>a.mici},
  cifre:{ce:'Are cel puțin o cifră',f:a=>a.cifre},
  simbol:{ce:'Are cel puțin un simbol (de exemplu ! ? # %)',f:a=>a.simbol},
  amestec:{ce:'Amestecă litere mari, litere mici, cifre și simboluri',f:a=>a.mari&&a.mici&&a.cifre&&a.simbol},
  cuvinte3:{ce:'E făcută din cel puțin 3 cuvinte diferite',f:a=>a.diferite>=3,m:a=>mCuv(a)},
  faraDate:{ce:'Nu conține nimic despre persoana din exercițiu',f:a=>!a.date.length,m:a=>`Conține: ${a.date.join(', ')}.`},
  necomuna:{ce:'Nu conține o parolă foarte folosită (parola, 123456, qwerty…)',f:a=>!a.comuna},
  /* noi (11.10.2026, după judecata 1): */
  neghicita:{ce:'Nu are nimic ușor de ghicit: o parolă foarte folosită, un an, același semn sau cifre la rând',f:a=>!a.comuna&&!a.an&&!a.rand,
    m:a=>a.comuna?'Conține o parolă foarte folosită.':a.an?'Conține un an.':a.tipRand==='litere'?'Are litere la rând.':'Are același semn sau cifre la rând.'},
  nuExemplu:{ce:'Nu e o parolă scrisă în lecție (pe acelea le știe toată lumea)',f:a=>!a.publicata,m:()=>'Are aceleași cuvinte ca o parolă din lecție: alege alte cuvinte.'}
};
const nrCuv=k=>(k===0?'nu are niciun cuvânt de cel puțin 3 litere':k===1?'are un singur cuvânt de cel puțin 3 litere':'are '+k+' cuvinte de cel puțin 3 litere')+' (cuvintele de 1-2 litere nu se numără)';
/* mesajul testului cuvintelor: același cuvânt repetat sau prea puține cuvinte */
const mPereche=a=>!a.pereche?'Cuvintele seamănă prea mult: alege 3 cuvinte care nu seamănă între ele.':a.pereche[0]===a.pereche[1]?'Ai scris de mai multe ori „'+a.pereche[0]+'”: alege 3 cuvinte diferite.':'„'+a.pereche[0]+'” și „'+a.pereche[1]+'” seamănă prea mult (unul îl conține pe celălalt sau încep la fel): alege 3 cuvinte care nu seamănă între ele.';
const mCuv=a=>a.cuvinte>=3?mPereche(a):'Parola '+nrCuv(a.cuvinte)+'.';
/* bara „puternică”, dar fără metoda celor 3 cuvinte: același motiv la Încearcă și în atelier */
const mMetoda=a=>'E puternică, dar nu e făcută după metodă. '+mCuv(a)+(a.cuvinte>=3?'':' Fraza-parolă are cel puțin 3 cuvinte diferite.');
function testeDin(Q){return (Q.teste||['lung15','mari','mici','cifre','simbol']).map(t=>{
  const x=typeof t==='string'?{c:t}:t,b=TESTE[x.c];
  return {c:x.c,v:x.v,ce:x.ce||b.ce,f:b.f,m:b.m}})}
function interziseDin(teste){const t=teste.find(x=>x.c==='faraDate');return t?t.v||[]:[]}
function publicateDin(teste){const t=teste.find(x=>x.c==='nuExemplu');return t?t.v||[]:[]}
const CAMP=(id,et,val,ph)=>`<label class="cs-camp"><span>${et}</span><input type="text" id="${id}" value="${val}" placeholder="${ph}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" inputmode="text" data-lpignore="true" data-1p-ignore data-form-type="other"></label>`;
function tarieHtml(){return `<div class="cs-tarie"><span>Tăria: <b class="cs-nota">—</b></span><div class="cs-bara" aria-hidden="true"><i></i></div><span><span class="cs-n">0</span> caractere</span></div><p class="cs-motiv" aria-live="polite"></p>`}
function deseneazaTarie(root,a){
  const b=root.querySelector('.cs-bara i'),nota=root.querySelector('.cs-nota');
  root.querySelector('.cs-n').textContent=a.n;nota.textContent=a.nota||'—';
  b.style.width=!a.n?'0':a.nota==='puternică'?'100%':a.usor?'15%':Math.max(15,a.pas*18)+'%';
  b.style.background=a.nota==='puternică'?'var(--ok)':'var(--bad)';
  const m=root.querySelector('.cs-motiv');
  if(m)m.textContent=!a.n?'':a.date.length?`Conține ceva despre persoană (${a.date.join(', ')}): se ghicește ușor.`
    :a.publicata?(a.exacta?'E o parolă scrisă în lecție: acum o știe toată lumea. Inventează alta.':'Are aceleași cuvinte ca o parolă din lecție: alege alte cuvinte.')
    :a.comuna?'Conține o parolă foarte folosită: se ghicește ușor.'
    :a.an?'Conține un an (ca anul nașterii): se ghicește ușor.'
    :a.rand?(a.tipRand==='litere'?'Are litere la rând (abcd): se ghicește ușor.':'Are același semn sau cifre la rând (aaaa, 1234): se ghicește ușor.'):''}
function testeHtml(lista,titlu){return `<div class="cs-teste"><div class="cs-lbl">${titlu} · <span class="nr">0 din ${lista.length} trec</span></div><ol>${lista.map((t,i)=>`<li data-i="${i}"><span class="s">○</span><span>${t.ce}<span class="m"></span></span></li>`).join('')}</ol></div>`}
function bifeaza(root,rez,arata){
  rez.forEach((r,i)=>{const li=root.querySelector(`.cs-teste li[data-i="${i}"]`);if(!li)return;
    li.className=r.ok?'ok':(arata?'rau':'');li.querySelector('.s').textContent=r.ok?'✓':(arata?'✗':'○');
    li.querySelector('.m').textContent=!r.ok&&arata&&r.m?r.m:''});
  root.querySelector('.cs-teste .nr').textContent=`${rez.filter(r=>r.ok).length} din ${rez.length} trec`}
const AVERT='Aici scrii doar parole <b>inventate</b>. <b>Nu scrie aici parola ta adevărată</b> (nici pe cea din exemple). Pagina nu salvează și nu trimite nimic din ce scrii.';

/* ---------------- tipul „parola” ---------------- */
const parola={
  render(Q,body,api){
    stil();const lista=testeDin(Q),interzise=interziseDin(lista),publicate=publicateDin(lista),esc=api.esc;
    body.innerHTML=`<div class="cs-parola"><p class="cs-avert">${AVERT}</p>${CAMP('cs-in',esc(Q.eticheta||'Parola inventată'),esc(Q.start||''),'scrie aici o parolă inventată')}${tarieHtml()}${testeHtml(lista,'Testele parolei')}</div>`;
    const inp=body.querySelector('#cs-in');
    const rez=()=>{const a=analiza(inp.value,{interzise,publicate});return {a,r:lista.map(t=>{const ok=!!t.f(a,t.v);return {ok,m:!ok&&t.m?t.m(a,t.v):''}})}};
    const upd=arata=>{const x=rez();deseneazaTarie(body,x.a);bifeaza(body,x.r,arata);
      /* bara spune „puternică” (regula DNSC), dar exercițiul cere și metoda (3 cuvinte): spunem asta, nu lăsăm mesajul pe jumătate */
      const m=body.querySelector('.cs-motiv'),cuv=lista.some(t=>t.c==='cuvinte3');
      if(m&&x.a.nota==='puternică'&&x.r.some(r=>!r.ok))m.textContent=cuv&&x.a.diferite<3
        ?mMetoda(x.a)
        :'E puternică, dar exercițiul cere și ce scrie la testele încă nebifate de mai jos.';
      return x};
    body._pune=v=>{inp.value=v;upd(false)};
    inp.addEventListener('input',()=>upd(false));upd(false);
    const nav=api.checkButton(()=>{const x=upd(true),rau=x.r.filter(r=>!r.ok).length;
      if(!rau){nav.innerHTML='';api.resolve(true)}
      else{api.resolve(false,`${rau===1?'Un test nu trece':rau+' teste nu trec'} (marcate cu ✗). Schimbă parola și apasă din nou.`,!inp.value);
        api.revealButton(()=>{body._pune(Q.solutie);upd(true);nav.innerHTML='';api.giveUp(`o parolă care trece toate testele: <code>${esc(Q.solutie)}</code>. Pe a ta o faci la fel, dar alta, și n-o scrii nicăieri.`)})}
      /* focusul înapoi în câmp doar dacă parola trebuie schimbată (pe telefon, focusul deschide tastatura) */
      if(rau)inp.focus({preventScroll:true})},'Verifică parola');
  },
  rezolva(Q,body){body._pune(Q.solutie)},
  gresit(Q,body){body._pune(Q.gresit||'maria2014')}
};

/* ---------------- tipul „profil” ---------------- */
const profil={
  render(Q,body,api){
    stil();const P=Q.profil,esc=api.esc,semne=P.randuri.filter(r=>r.semn).length;
    let rows='',sep=false;
    P.randuri.forEach((r,i)=>{if(r.mesaj&&!sep){rows+=`<div class="cs-sep">Mesajul primit de la ${esc(P.nume)}:</div>`;sep=true}
      rows+=`<button type="button" class="cs-r${r.mesaj?' mesaj':''}" data-i="${i}" aria-pressed="false">${esc(r.t)}</button>`});
    body.innerHTML=`<div class="cs-prof"><div class="cs-prof-cap"><span class="cs-av" aria-hidden="true">${esc(P.avatar||'?')}</span><span><b>${esc(P.nume)}</b><small>${esc(P.sub||'profil dintr-un joc online (inventat pentru lecție)')}</small></span></div>
      <div class="cs-rows">${rows}</div></div>
      <p class="hint" style="margin:6px 0 0">Atinge fiecare rând care e un semn. Ai marcat <span class="cs-cnt">0</span>. Atinge din nou ca să scoți marcajul.</p>`;
    const marcat=new Set(),bs=[...body.querySelectorAll('.cs-r')];
    const cnt=()=>{body.querySelector('.cs-cnt').textContent=marcat.size};
    bs.forEach(b=>b.onclick=()=>{if(api.done())return;const i=+b.dataset.i;marcat.has(i)?marcat.delete(i):marcat.add(i);b.setAttribute('aria-pressed',String(marcat.has(i)));cnt()});
    const lista=()=>`<ul style="margin:.4em 0 0;padding-left:1.2em">${P.randuri.map(r=>r.semn?`<li>„${esc(r.t)}” — ${esc(r.dece)}</li>`:'').join('')}</ul>`;
    const arata=()=>{bs.forEach(b=>{b.setAttribute('aria-pressed','false');if(P.randuri[+b.dataset.i].semn)b.classList.add('found')})};
    body._marcheaza=idx=>{marcat.clear();bs.forEach(b=>b.setAttribute('aria-pressed','false'));idx.forEach(i=>{marcat.add(i);bs[i].setAttribute('aria-pressed','true')});cnt()};
    const nav=api.checkButton(()=>{
      const bune=[...marcat].filter(i=>P.randuri[i].semn).length,rele=marcat.size-bune;
      if(bune===semne&&!rele){arata();nav.innerHTML='';api.resolve(true);const f=document.querySelector('#fb .fb');if(f)f.insertAdjacentHTML('beforeend',lista())}
      else{api.resolve(false,`Ai găsit ${bune} din ${semne} semne${rele?`, iar ${rele} ${rele===1?'rând marcat nu e semn':'rânduri marcate nu sunt semne'}: acolo nu e nimic ciudat`:''}.`,marcat.size===0);
        api.revealButton(()=>{arata();nav.innerHTML='';api.giveUp(`semnele sunt marcate cu verde:${lista()}`)})}
      const b=bs[0];if(b)b.focus({preventScroll:true})});
  },
  rezolva(Q,body){body._marcheaza(Q.profil.randuri.map((r,i)=>r.semn?i:-1).filter(i=>i>=0))},
  gresit(Q,body){const s=Q.profil.randuri.map((r,i)=>r.semn?i:-1).filter(i=>i>=0);body._marcheaza(s.slice(0,Q.gresit!=null?Q.gresit:s.length-1))}
};

/* ---------------- tipul „cont” (atelierul) ---------------- */
const CONT_MATEI={
  app:'Turnul cu enigme',eu:'Cititorul_7',cine:'Matei',despre:'numele lui, anul în care s-a născut, numele câinelui',
  date:[
    {id:'porecla',et:'Porecla (numele din joc)',val:'Cititorul_7',ascunde:false},
    {id:'desen',et:'Poza de profil',val:'un desen cu un dragon verde',ascunde:false},
    {id:'joc',et:'Jocul preferat',val:'șah',ascunde:false},
    {id:'nume',et:'Numele complet',val:'Matei Ionescu',ascunde:true},
    {id:'scoala',et:'Școala și clasa',val:'Școala Gimnazială nr. 3, clasa a VI-a B',ascunde:true},
    {id:'adresa',et:'Adresa',val:'Strada Teilor nr. 7',ascunde:true},
    {id:'telefon',et:'Telefonul',val:'07xx xxx xxx (numărul lui de mobil)',ascunde:true}],
  interzise:['matei','ionescu','2014','bubu'],
  explica:{matei:'numele lui',ionescu:'numele lui de familie','2014':'anul în care s-a născut',bubu:'numele câinelui'},
  mesaj:{de:'Robert_Gamer12',text:'Salut, Matei! Sunt de la echipa jocului. Îți dau 1000 de diamante gratis! Scrie-mi parola ta, ca să ți le pun în cont. Nu le spune părinților, e o surpriză!'}
};
const lista=arr=>{const n=arr.map(d=>d.et.toLowerCase());return n.length<2?n.join(''):n.slice(0,-1).join(', ')+' și '+n[n.length-1]};
function evalueazaCont(Q,st){
  const K=Q.cont||CONT_MATEI,a=analiza(st.parola,{interzise:K.interzise,publicate:K.publicate});
  const deAscuns=K.date.filter(d=>d.ascunde),deLasat=K.date.filter(d=>!d.ascunde);
  const vazute=deAscuns.filter(d=>!st.ascuns[d.id]),ascunseRau=deLasat.filter(d=>st.ascuns[d.id]);
  /* ce anume din date a găsit: „marin” (numele ei de familie) — ca elevul să vadă de ce „Marinar” nu merge (judecata 1, sonnet) */
  const ceE=x=>K.explica&&K.explica[x]?`„${x}” (${K.explica[x]})`:`„${x}”`;
  return [
    {id:'lung',ce:'Parola nouă are cel puțin 15 caractere',ok:a.lung,m:a.n?`Are ${a.n}.`:'Încă n-ai scris o parolă nouă.'},
    {id:'amestec',ce:'Parola nouă amestecă litere mari, litere mici, cifre și simboluri',ok:a.mari&&a.mici&&a.cifre&&a.simbol,
      m:'Lipsesc: '+[!a.mari&&'litere mari',!a.mici&&'litere mici',!a.cifre&&'cifre',!a.simbol&&'simboluri'].filter(Boolean).join(', ')+'.'},
    /* testul frazei-parolă (11.10.2026, judecata 1): fără el, „Aaaaaaaaaaaaaa1!” sau o parolă copiată din lecție treceau */
    {id:'fraza',ce:'Parola nouă e o frază-parolă inventată: cel puțin 3 cuvinte diferite și nimic ușor de ghicit',
      ok:!!a.n&&a.diferite>=3&&!a.comuna&&!a.an&&!a.rand&&!a.publicata,
      m:!a.n?'Încă n-ai scris o parolă nouă.':a.publicata?(a.exacta?'E o parolă scrisă în lecție: o știe toată lumea. Inventează alta.':'Are aceleași cuvinte ca o parolă din lecție: alege alte cuvinte.')
        :a.diferite<3?mCuv(a):a.comuna?'Conține o parolă foarte folosită: se ghicește ușor.'
        :a.an?'Conține un an: se ghicește ușor.':a.tipRand==='litere'?'Are litere la rând: se ghicește ușor.':'Are același semn sau cifre la rând: se ghicește ușor.'},
    {id:'date',ce:`Parola nouă nu conține nimic despre ${K.cine} (${K.despre})`,ok:!!a.n&&!a.date.length,
      m:a.date.length?`Conține ${a.date.map(ceE).join(', ')}. Cine știe ceva despre ${K.cine} încearcă întâi astea.`:'Încă n-ai scris o parolă nouă.'},
    {id:'ascunse',ce:`Profilul nu mai arată: ${lista(deAscuns)}`,ok:!vazute.length,
      m:vazute.length?`Încă se văd: ${lista(vazute)}.`:''},
    {id:'ramase',ce:`Se văd în continuare: ${lista(deLasat)}. Astea nu spun cine e ${K.cine} și nici unde e`,ok:!ascunseRau.length,
      m:ascunseRau.length?`Ai ascuns și: ${lista(ascunseRau)}. Nu era nevoie: nu te dau de gol.`:''},
    {id:'mesaj',ce:`Mesajul de la ${K.mesaj.de}: niciun răspuns, utilizatorul e blocat și raportat`,ok:!st.raspuns&&st.blocat&&st.raportat,
      m:st.raspuns?'I-ai răspuns. Ce ai trimis nu mai poți lua înapoi: apasă „Ia-o de la capăt”.':[!st.blocat&&'încă nu e blocat',!st.raportat&&'încă nu e raportat'].filter(Boolean).join(' și ')+'.'}]}
const cont={
  render(Q,body,api){
    stil();const K=Q.cont||CONT_MATEI,esc=api.esc;
    const nou=()=>({parola:'',ascuns:{},raspuns:false,blocat:false,raportat:false,scrie:false,gol:false});
    let st=nou();const RZ=evalueazaCont(Q,st);
    function desen(){
      const dateH=K.date.map(d=>{const a=!!st.ascuns[d.id];return `<div class="cs-d${a?' ascuns':''}"><span><span class="et">${esc(d.et)}</span><span class="val">${esc(d.val)}</span><span class="stare">${a?'ascuns: nu îl vede nimeni':'se vede: îl vede oricine'}</span></span><button type="button" class="cs-b" data-asc="${d.id}">${a?'Arată':'Ascunde'}</button></div>`}).join('');
      const msgStare=st.raspuns?'Ai trimis un răspuns. Nu mai poți lua înapoi ce ai trimis.':'';
      /* „Trimite” cu căsuța goală: spunem ce s-a întâmplat (nimic) și ce poate face (judecata 1, sonnet) */
      const gol=st.gol&&st.scrie?'Căsuța e goală, deci n-ai trimis nimic. Dacă te-ai răzgândit, apasă „Renunță”.':'';
      const blk=st.blocat?`Ai blocat utilizatorul ${esc(K.mesaj.de)}: nu-ți mai poate scrie.`:'';
      const rap=st.raportat?`L-ai raportat celor care se ocupă de joc.`:'';
      body.innerHTML=`<div class="cs-cont"><p class="cs-avert">${AVERT}</p>
      <div class="cs-app" tabindex="-1"><div class="cs-app-cap"><span>${esc(K.app)} · Contul meu</span><small>conectat: ${esc(K.eu)}</small></div>
       <div class="cs-card"><h4>1. Profilul public</h4><p class="cs-sub">Ce scrie aici vede oricine joacă. „Ascunde” scoate un rând din profil.</p><div class="cs-date">${dateH}</div></div>
       <div class="cs-card"><h4>2. Schimbă parola</h4><p class="cs-sub">Aici e mai simplu decât într-un joc adevărat: scrii parola nouă o singură dată.</p>
        ${CAMP('cs-pn','Parola nouă (inventată)',esc(st.parola),'scrie aici o parolă inventată')}${tarieHtml()}</div>
       <div class="cs-card"><h4 id="cs-h-msg" tabindex="-1">3. Mesaje</h4><div class="cs-msg"><span class="de">de la ${esc(K.mesaj.de)}</span>${esc(K.mesaj.text)}</div>
        <div class="cs-msg-b"><button type="button" class="cs-b" data-m="raspunde"${st.blocat||st.raspuns?' disabled':''}>Răspunde</button><button type="button" class="cs-b" data-m="blocheaza"${st.blocat?' disabled':''}>Blochează</button><button type="button" class="cs-b" data-m="raporteaza"${st.raportat?' disabled':''}>Raportează</button></div>
        ${st.scrie&&!st.blocat&&!st.raspuns?`<div class="cs-rasp"><label class="cs-camp"><span>Răspunsul tău</span><textarea id="cs-rt" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea></label><span><button type="button" class="cs-b" data-m="trimite">Trimite</button> <button type="button" class="cs-b" data-m="renunta">Renunță</button></span></div>`:''}
        <p class="cs-stare" aria-live="polite">${[msgStare,gol,blk,rap].filter(Boolean).join(' ')}</p></div>
      </div>
      ${testeHtml(RZ,'Testele sarcinii')}
      <button type="button" class="cs-b cs-reset" data-m="reset">Ia-o de la capăt</button></div>`;
      body.querySelectorAll('[data-asc]').forEach(b=>b.onclick=()=>{const id=b.dataset.asc;st.ascuns[id]=!st.ascuns[id];st.gol=false;redesen('[data-asc="'+id+'"]')});
      body.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{const m=b.dataset.m;st.gol=false;
        if(m==='raspunde')st.scrie=true;else if(m==='renunta')st.scrie=false;
        else if(m==='trimite'){const t=body.querySelector('#cs-rt');if(t&&t.value.trim()){st.raspuns=true;st.scrie=false}else{st.gol=true;redesen('#cs-rt');return}}
        else if(m==='blocheaza'){st.blocat=true;st.scrie=false}else if(m==='raporteaza')st.raportat=true;
        else if(m==='reset')st=nou();
        redesen(m==='raspunde'?'#cs-rt':m==='renunta'?'[data-m="raspunde"]':'[data-m="'+m+'"]')});
      const pn=body.querySelector('#cs-pn');
      pn.addEventListener('input',()=>{st.parola=pn.value;upd(false)});
      upd(false)}
    /* următorul loc din „3. Mesaje” (un buton încă activ, altul decât Răspunde) sau titlul cardului */
    const laMesaje=()=>[...body.querySelectorAll('.cs-msg-b [data-m]')].find(x=>!x.disabled&&x.dataset.m!=='raspunde')||body.querySelector('#cs-h-msg');
    /* focusul NU sare în câmpul parolei după Blochează / Raportează / Trimite (pe telefon, tastatura s-ar deschide peste
       mesaj și peste teste — judecata 1): butonul apăsat, dacă mai e activ, altfel locul următor din „Mesaje” */
    function redesen(sel){desen();const e=sel&&body.querySelector(sel);const t=e&&!e.disabled?e:laMesaje();if(t)t.focus({preventScroll:true})}
    function upd(arata){const r=evalueazaCont(Q,st),a=analiza(st.parola,{interzise:K.interzise,publicate:K.publicate});deseneazaTarie(body,a);
      const m=body.querySelector('.cs-motiv');if(m&&a.nota==='puternică'&&a.diferite<3)m.textContent=mMetoda(a);
      bifeaza(body,r,arata);return r}
    /* după „Verifică”: focusul pe primul loc de reparat (regula 14), nu mereu în câmpul parolei */
    function focusDupa(r){const rau=id=>r.some(x=>x.id===id&&!x.ok);
      if(st.raspuns)return body.querySelector('[data-m="reset"]');
      if(['lung','amestec','fraza','date'].some(rau))return body.querySelector('#cs-pn');
      const d=rau('ascunse')?K.date.find(x=>x.ascunde&&!st.ascuns[x.id]):rau('ramase')?K.date.find(x=>!x.ascunde&&st.ascuns[x.id]):null;
      if(d)return body.querySelector(`[data-asc="${d.id}"]`);
      if(rau('mesaj'))return laMesaje();
      return body.querySelector('.cs-app')}
    body._pune=v=>{st=Object.assign(nou(),v,{ascuns:Object.assign({},v.ascuns||{})});desen()};
    body._stare=()=>JSON.parse(JSON.stringify(Object.assign({},st,{parola:st.parola?'(ascunsă)':''})));
    desen();
    const nav=api.checkButton(()=>{const r=upd(true),rau=r.filter(x=>!x.ok).length;
      if(!rau){nav.innerHTML='';api.resolve(true)}
      else{api.resolve(false,`${rau===1?'Un test nu trece':rau+' teste nu trec'} (marcate cu ✗; sub fiecare scrie de ce). Continuă de unde ai rămas și apasă din nou.`);
        api.revealButton(()=>{const s=SOL(K);body._pune(s);upd(true);nav.innerHTML='';api.giveUp(`parola <code>${esc(s.parola)}</code> (o faci pe a ta la fel, dar alta); ascunse: ${esc(lista(K.date.filter(d=>d.ascunde)))}; mesajul: fără răspuns, blocat și raportat.`)})}
      const p=focusDupa(r);if(p)p.focus({preventScroll:true})},'Verifică');
  },
  rezolva(Q,body){body._pune(SOL(Q.cont||CONT_MATEI))},
  /* greșeala tipică: parolă lungă și amestecată, dar făcută din datele persoanei (Matei2014!Bubu#Ok, Ilinca2015!Pufi#Ok); restul bine */
  gresit(Q,body){const K=Q.cont||CONT_MATEI,s=SOL(K);body._pune(Object.assign(s,{parola:GRESIT(K)}))}
};
/* soluția și greșeala, pe contul dat: K.solutie (implicit Lampa7?Nor#Vioara), K.gresit (implicit din K.interzise) */
function SOL(K){const asc={};K.date.forEach(d=>{if(d.ascunde)asc[d.id]=true});return {parola:K.solutie||'Lampa7?Nor#Vioara',ascuns:asc,blocat:true,raportat:true,raspuns:false}}
function GRESIT(K){if(K.gresit)return K.gresit;
  const I=K.interzise||[],lit=I.filter(x=>/^\D+$/.test(x)),cif=I.find(x=>/^\d+$/.test(x))||'2014',cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
  return cap(lit[0]||'nume')+cif+'!'+cap(lit[lit.length-1]||'animal')+'#Ok'}

window.SimContSigur={analiza,TESTE,evalueazaCont,CONT_MATEI,parola,profil,cont};
})();
