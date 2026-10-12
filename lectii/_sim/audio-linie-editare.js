/* Extensia „audio-linie-editare” pentru lecțiile LearningHub — fișier comun (lectii/_sim/audio-linie-editare.js).
   PROPRIETAR: autorul lecției VII · M2 · nr. 13 („Selecția secvențelor: ștergere, copiere, mutare. Mixarea semnalului
   audio”), creat 12.10.2026. Se sprijină pe lectii/_sim/audio-linie.js (VII/11) și lectii/_sim/audio-linie-inregistrare.js
   (VII/12), pe care NU le modifică: folosește API-ul lor public (AudioProiect.creeaza(el,{start}), x.al(), x.on(fn),
   x.simuleaza, x.stare().proiect.piste — pistele VII ale proiectului) și adaugă, din afară, editarea și mixarea.
   Încărcare: <script src="../../_sim/audio-linie.js"></script><script src="../../_sim/audio-linie-inregistrare.js"></script>
              <script src="../../_sim/audio-linie-editare.js"></script>
   Tipul pentru motor: tipuri:{audioeditare:TipAudioEditare} → {t:'audioeditare', q, start, teste, solutie, gresit, why, ajutor?}

   CE ADAUGĂ (Audacity 4): selecția pe O pistă (tragere pe undă) cu bara „Selecție … Durată …” de jos; meniul Editează
     (Anulează „…”, Refacere, Decupează, Copiază, Lipește, Șterge, Duplică, Șterge și elimină spațiul (per pistă), Clip ▸, …);
     tastele Ctrl+Z, Ctrl+Shift+Z, Ctrl+X, Ctrl+C, Ctrl+V, Del/Backspace, Shift+Del (NU Ctrl+Shift+I și Ctrl+W: le ia browserul,
     ca la VII/12 1.1 — importul și închiderea, din meniul Fișier); fereastra „Alege
     comportamentul la ștergerea unei porțiuni de clip” (prima ștergere/decupare pe un calculator unde n-a ales nimeni) și
     „Șterge preferința”; mutarea unui clip trăgând de bara lui de sus; Fișier › Importă… (fereastra „Deschide”) → pistă nouă,
     de la 0:00; glisorul Volum din panoul fiecărei piste; panoul „Tu, la căști” (în afara ferestrei: ce s-ar auzi la capul de
     redare); opțional sunetul adevărat al fișierelor (WebAudio, „🔊 Sunet: oprit/pornit”, fiecare pistă cu volumul ei).

   FIDELITATE (probat în Audacity 4.0.0 REAL, desktop ascuns, 12.10.2026 — lectii/vii/m2-l13/_proba/audacity_proba_l13_*.json):
     - tragerea pe undă alege o bucată (mai deschisă); jos „Selecție 00h00m01.23s 00h00m02.22s · Durată 00h00m00.99s”;
       un clic pe undă mută capul de redare și scoate selecția (p3, p5);
     - 1.1: un clic DUPĂ capătul sunetului lasă capul de redare chiar acolo (clic la 8,5 s pe un sunet de 6,2 s → jos
       „Selecție 00h00m08.52s”), iar Lipește pune clipul de acolo, cu liniște înainte (judecata 1 v3; reparare r2). AudioLinie
       (VII/11) oprește capul la capăt: extensia îi dă, cât ține clicul, un clip-fantomă de 0,01 s la locul clicului, ca să-l
       lase acolo (clipul-fantomă nu rămâne pe pistă);
     - 1.1: o tragere care PORNEȘTE în bucata deja aleasă nu alege alta (p3 g3, p4 h7): aici, selecția rămâne și un mesaj
       spune „întâi un clic, departe de bucată”;
     - meniul Editează are rândurile de mai sus, cu scurtăturile scrise ca în program (p1 e4_meniu); 1.1: rândul al doilea
       scrie „Refacere” (stins) când nu e nimic de refăcut și „Refă „<ce ai anulat>”” când e (reparare r1, capturile rep_r1*);
     - Șterge și elimină spațiul (per pistă): bucata dispare, restul pistei vine în stânga, fără nicio fereastră (p3 g1, p4);
     - prima Șterge / Decupează pe un calculator unde nu s-a ales: fereastra „Alege comportamentul…” (Lasă spațiu ales de la
       început / Elimină spațiul (cascadează); Aplică); Esc = nimic șters, nimic ales; după Aplică: „Șterge preferința” cu OK (p2, p6);
     - Lasă spațiu: Șterge rupe clipul și lasă un GOL cât bucata (↶ „Split delete”), Decupează la fel („Divide și decupează”);
       Elimină spațiul: restul vine în stânga (↶ „Șterge și elimină spațiul”, „Decupează”) (p6 l/e);
     - Lipește: bucata devine un CLIP NOU de la capul de redare; peste sunet îl ACOPERĂ (nu-l împinge); fără fereastră (p6);
       „acoperă” e reglajul de la început al Audacity 4 (Preferințe: „Lipirea împinge celelalte clipuri” îl schimbă — nu-l
       simulăm); 1.1: după Lipește, clipul lipit e ALES (banda de pe riglă și clipul mai deschis: capturile judecătorului v3c și
       img/lipit-dupa-capat.webp), iar capul de redare rămâne unde era;
     - Anulează (↶, Ctrl+Z) readuce și selecția; după un WAV deschis, primul lucru din istoric e „Importă”: anulat, pista
       dispare; Refacere o aduce înapoi (p3, p5);
     - tragerea de bara de sus a clipului îl mută („Mută clipul”; „Mută elementele” dacă clipul era ales, de ex. imediat după
       Lipește — judecata 1 v5b); glisorul pistei („Volum”) intră în istoric (p3 g8/g9, p7);
     - 1.1: un clip lăsat PESTE alt clip nu se oprește la vecin: îl ACOPERĂ (clipul de dedesubt rămâne doar în bucățile
       neacoperite), ca la Lipește (judecata 1 v5b);
     - Fișier › Importă… (Ctrl+Shift+I) → fereastra Windows „Deschide”; sunetul intră pe o PISTĂ NOUĂ, sub celelalte, de la 0:00,
       chiar dacă capul de redare e în altă parte; pista se numește ca fișierul (p7);
     - titlul primește „ * ” după orice modificare.
   NESIGUR (spus prudent în lecție): ce face EXACT o a doua tragere care pornește în bucata deja aleasă (știm doar că nu
     alege alta); Lipește cu o bucată aleasă (aici: la începutul ei, peste ea); ce rămâne din clipul acoperit dacă muți
     apoi clipul de deasupra în altă parte (aici: bucata acoperită nu revine; lecția spune doar „Editează › Anulează”);
     ▶ cu capul de redare după capăt (aici: redarea pornește de la început, ca în AudioLinie); sub-alegerile „La eliminarea
     spațiului…” (aici: toate clipurile pistei); clic pe bara clipului fără tragere (aici: alege tot clipul).
     PROBAT de judecata 1 (w): glisorul Volum merge de la −60,0 la +12,0 dB și arată valoarea într-o bulă doar cât îl ții
     apăsat (aici: scrisă lângă, mereu, ca ajutor — abatere mică, de folos în pagină).
   ABATERI spuse pe ecran: „Esc” are buton în fereastra de alegere (pe telefon nu e tastatură); meniurile Clip, Etichetă,
     Suprimă audio, Duplică, Editor metadate, Preferințe nu fac nimic aici; panoul „Tu, la căști” nu e în Audacity.

   API PUBLIC (VII/14-15 și probele):
     const e = AudioEditare.creeaza(element, {start, vedere?, sunete?:{<fis>: url}})
       start = ce primește AudioProiect (ecran, proiect:{nume?, folder?, piste:[{tip:'audio', nume, rol?:'voce'|'muzica',
               vol?:dB, clipuri:[{id, nume, start, durata, unda, seg?:[{fis, de, lung}]}]}]}, fs, recente…)
               + comportament: null|'lasa'|'elimina'  (alegerea „Șterge preferința” de pe calculator; null = încă nealeasă)
               + importabile: [{nume:'muzica-fundal.wav', folder:'Descărcări', unda, rol?:'muzica'}]
               + dinWav: true  (proiectul vine dintr-un WAV deschis: în istoric e „Importă”)
               + clipboard?: {unda, seg}
               + pasiInainte: [acțiuni] făcute la deschidere, înaintea elevului (nu intră în jurnal)
               + numeSunet: 'voce.wav'  (proiect fără nume pornit dintr-un WAV: titlul „voce * - Audacity 4.0”)
     e.ap() → instanța AudioProiect;  e.al() → AudioLinie de acum;  e.piste() → pistele vii;  e.stare() → {sel, comportament,
       istoric:[etichete], refaceri, murdar, clipboard:bool, dialog, volume:[dB]};  e.jurnal() → evenimentele MELE
       ('selectie','sterge','decupeaza','copiaza','lipeste','mutaClip','volum','importa','anuleaza','reface',
        'comportamentAles','comportamentInchis','fereastra') + ale AudioProiect / AudioLinie (cu prefix ap_ / al_);
     e.simuleaza([acțiuni]): {selecteaza:[a,b], pista?} {cap:t, pista?} {stergeElimina:1} {sterge:1, raspuns?:'esc'|'lasa'|'elimina'}
       {decupeaza:1, raspuns?} {copiaza:1} {lipeste:1} {mutaClip:{pista, la:t, start:s}} {importa:'nume.wav'}
       {volum:{pista, db}} {asculta:[t1,t2]} {ascultaTot:1} {anuleaza:n} {reface:n}; orice altă acțiune merge la AudioProiect;
     e.on(fn)/e.off(fn): fn(stare, ev);  e.reset();  e.mesaj(html);  e.distruge();  e.nivel(pista) → dB efectiv al pistei;
     AudioEditare.verificari[nume] = (e, parametru) => bool  (în plus față de AudioProiect.verificari, folosite și ele);
     AudioEditare.ce(fis, de, pana, pista?) / .prezent(...) — ajutoare pentru verificări pe CONȚINUT (segmentele sursei).
   SCHIMBĂRI 1.1 (12.10.2026, după judecata 1 — de știut pentru lecțiile 14-15): {cap:t} după capătul sunetului lasă capul
     acolo (nu la capăt); după Lipește, st.sel = clipul lipit (stare().sel nu mai e null); mutaClip acoperă vecinul (nu se mai
     oprește la el) și evenimentul 'mutaClip' are în plus {acoperit:bool, eticheta}; eticheta „Mută elementele” când clipul
     era ales; verificarea faraGol primește opțional {faraLipite:true} (nu socotește golul dinaintea clipurilor puse cu
     Lipește); rândul Refacere din meniu se numește „Refă „…”” când e ceva de refăcut.
   NU schimba în fișierul acesta comportamentul din lista FIDELITATE și nici numele verificărilor: le folosește lecția 13.
   Ce e nou se adaugă cu nume nou (alt fișier, de ex. audio-linie-montaj.js). */
(function(){
'use strict';
if(!window.AudioLinie||!window.AudioProiect){console.error('audio-linie-editare.js: încarcă întâi audio-linie.js și audio-linie-inregistrare.js');return}
const VERS='1.1 (12.10.2026, după judecata 1)';
const CSS=`
.ae .al-sel{display:none!important}
.ae .ap-mic{display:none}
.ae.cu-microfon .ap-mic{display:block}
.ae .al-panou{flex-basis:124px}
.ae .al-panou .pn{position:relative}
.ae-vol{display:flex;align-items:center;gap:4px;margin-top:4px;font-size:.7rem;color:#5a6275}
.ae-vol input{flex:1 1 auto;min-width:0;width:64px;height:32px;margin:0;accent-color:#7b6cf6}
.ae-vol output{flex:none;min-width:3.4em;text-align:right;font:600 .7rem/1 Consolas,monospace;color:#1d2330}
.ae-selp{position:absolute;pointer-events:none;background:rgba(150,240,255,.45);border-left:1px solid rgba(20,120,140,.7);border-right:1px solid rgba(20,120,140,.7);z-index:2}
.ae .al-pista{height:118px}
.ae .al-panou .pn{height:118px}
.ae-ant{position:absolute;top:1px;height:32px;min-width:32px;z-index:2;cursor:grab;touch-action:none;display:flex;align-items:center;justify-content:space-between;gap:4px;padding:0 4px;box-sizing:border-box;font:11px/1 "Segoe UI",system-ui,sans-serif;color:#3b1a1a;background:rgba(236,127,127,.92);border-radius:3px 3px 0 0;overflow:hidden;white-space:nowrap}
.ae-ant.muzica{background:rgba(92,190,160,.95);color:#0d2f26}
.ae-ant.ales{outline:2px solid #1d2330;outline-offset:-2px}
.ae-ant b{font-weight:600;overflow:hidden;text-overflow:ellipsis}
.ae-jos{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:6px;padding:6px 8px;background:#fff;border-top:1px solid #e3e5ec;font-size:.8rem}
.ae-jos .ae-t{font:600 13px/1 Consolas,"Fira Mono",monospace;letter-spacing:.04em;background:#1f2430;color:#f5f7ff;padding:6px 7px;border-radius:4px}
.ae-strat{position:absolute;inset:0;display:none;background:rgba(20,24,34,.28);z-index:30;overflow:auto}
.ae-strat.vizibil{display:block}
.ae-meniu{left:60px}
[data-a="anuleaza"][aria-disabled="true"]{opacity:.45;cursor:default}
.ae-alege{width:min(590px,calc(100% - 16px))}
.ae-alege .ae-cards{display:flex;flex-wrap:wrap;gap:12px;margin-top:8px}
.ae-alege .ae-card{flex:1 1 200px}
.ae-alege .ae-desen{height:64px;border-radius:6px;background:#2b2e39;position:relative;overflow:hidden}
.ae-alege .ae-desen i{position:absolute;top:14px;height:38px;background:#a7a2f7;border-radius:3px}
.ae-alege .ae-desen s{position:absolute;top:6px;bottom:6px;background:rgba(190,240,255,.35)}
.ae-alege label{display:flex;align-items:center;gap:8px;min-height:36px;font-size:.92rem;cursor:pointer}
.ae-alege input[type=radio]{width:20px;height:20px}
.ae-alege .ae-sub{margin-top:10px;background:#eceef3;border-radius:6px;padding:8px 10px}
.ae-esc{position:absolute;right:6px;top:6px;min-width:44px;min-height:32px;border:1px solid #c9ccd6;border-radius:5px;background:#fff;font:inherit;font-size:.8rem;cursor:pointer}
.ae-cască{margin-top:8px;border:1px solid #d8dae2;border-radius:8px;padding:8px 10px;background:#fbfbfd;font-size:.88rem}
.ae-cască .ae-rand{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.ae-cască .ae-aud{margin-top:4px;min-height:1.4em}
.ae-cască .ae-aud.ok{color:#1b7a4a}.ae-cască .ae-aud.rau{color:#b42318}
.ae-cască button{min-height:34px;padding:4px 10px;border-radius:16px;border:1px solid #b9bdc9;background:#fff;font:inherit;font-size:.84rem;cursor:pointer;color:#1d2330}
.ae-teste{margin-top:10px;border:1px solid var(--line,#ccc);border-radius:8px;padding:10px 12px;background:var(--paper2,#f5f5f5)}
.ae-teste ol{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:4px}
.ae-teste li{display:flex;gap:8px;align-items:flex-start;font-size:.93rem;line-height:1.35}
.ae-teste li .s{flex:none;width:1.4em;text-align:center;font-weight:800}
.ae-teste li.ok .s{color:var(--ok,#1b7a4a)}.ae-teste li.rau .s{color:var(--bad,#b42318)}
.ae-teste li .m{display:block;font-size:.85rem;color:var(--bad,#b42318)}
@media (max-width:560px){.ae .al-panou{flex-basis:100px}}
`;
function stil(){if(document.getElementById('sim-audio-editare-css'))return;const s=document.createElement('style');s.id='sim-audio-editare-css';s.textContent=CSS;document.head.appendChild(s)}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const copie=x=>JSON.parse(JSON.stringify(x));
const FPS=50;                 /* vârfurile undei: 50 pe secundă (ca în audio-linie.js) */
const k50=t=>Math.round(t*FPS);
const fmt=t=>AudioLinie.formatAudacity(t);
const fara=n=>String(n).replace(/\.(aup4|wav|mp3|ogg|flac)$/i,'');
const VOL_MIN=-60,VOL_MAX=12;
const ETICHETE={elimina:'Șterge și elimină spațiul',lasa:'Split delete',decupeazaLasa:'Divide și decupează',decupeazaElimina:'Decupează',
  lipeste:'Lipește',muta:'Mută clipul',mutaElemente:'Mută elementele',volum:'Volum',importa:'Importă'};
const capat=c=>c.start+c.durata;
/* nivelul unui clip (dB, din vârfurile undei, doar unde e sunet) */
function nivelUnda(U){let s=0,n=0;(U||[]).forEach(v=>{if(v>0.02){s+=v*v;n++}});return n?20*Math.log10(Math.sqrt(s/n)):-90}

/* ---------- clipurile: segmentele de sursă (ce bucată din ce fișier e unde) ---------- */
function segDe(c){return c.seg&&c.seg.length?c.seg:[{fis:c.fis||c.id,de:0,lung:c.durata}]}
function taieSeg(S,a,b){   /* bucata [a,b) (secunde de la începutul clipului) din lista de segmente */
  const out=[];let t=0;S.forEach(s=>{const x0=t,x1=t+s.lung;t=x1;const p=Math.max(a,x0),q=Math.min(b,x1);if(q-p>1e-6)out.push({fis:s.fis,de:s.de+(p-x0),lung:q-p})});return out}
function bucata(c,a,b,id){ /* partea din clip între a și b (timp pe linia de timp) */
  const ra=Math.max(0,a-c.start),rb=Math.min(c.durata,b-c.start);if(rb-ra<0.019)return null;
  return {id,nume:c.nume,start:c.start+ra,durata:rb-ra,unda:(c.unda||[]).slice(k50(ra),k50(rb)),seg:taieSeg(segDe(c),ra,rb),calitate:c.calitate,culoare:c.culoare}}
function lipesteClipuri(a,b,id){  /* două bucăți vecine din același clip → un clip (Audacity 4 arată un singur clip după „elimină spațiul”) */
  return {id,nume:a.nume,start:a.start,durata:a.durata+b.durata,unda:(a.unda||[]).concat(b.unda||[]),seg:segDe(a).concat(segDe(b)),calitate:a.calitate,culoare:a.culoare}}

function creeaza(el,opt){
  stil();
  const O=Object.assign({},opt||{});
  const S0=O.start||{};
  const radacina=document.createElement('div');radacina.className='ae'+(O.microfon?' cu-microfon':'');el.innerHTML='';el.appendChild(radacina);
  const locAp=document.createElement('div');radacina.appendChild(locAp);
  const casca=document.createElement('div');casca.className='ae-cască';
  casca.innerHTML=`<div class="ae-rand"><b>Tu, la căști</b> <span style="color:#5a6275">(nu e în Audacity: aici scrie ce s-ar auzi în căști la capul de redare)</span></div>
    <div class="ae-aud" aria-live="polite"></div>${O.sunete?'<div class="ae-rand" style="margin-top:4px"><button type="button" data-ae="sunet" aria-pressed="false">🔇 Sunet: oprit</button><span style="color:#5a6275;font-size:.8rem">pornit = auzi fișierele adevărate, fiecare pistă cu volumul ei (în laborator: căștile)</span></div>':''}`;
  radacina.appendChild(casca);
  let x=null,al=null,J=[],asc=new Set(),st={},trage=null;
  const stare0=()=>({sel:null,pistaActiva:0,comportament:S0.comportament||null,stiva:[],lucrat:false,refaceri:[],murdar:false,clipboard:S0.clipboard?copie(S0.clipboard):null,dialog:null,idc:0,auzitDupaVolum:0,volumSchimbat:false});
  function initStare(){st=stare0();J=[{tip:'start',ora:Date.now()}];
    if(S0.dinWav){st.stiva.push({eticheta:'Importă',inainte:{piste:[],sel:null},dupa:null,baza:true})}}
  const proiect=()=>x&&x.stare().proiect;
  const piste=()=>{const p=proiect();return p?p.piste:[]};
  /* capul de redare DUPĂ capătul sunetului (Audacity 4: stă unde dai clic; AudioLinie l-ar opri la capăt): cât ține clicul,
     pista 1 primește un clip-fantomă de 0,01 s la locul clicului, scos imediat ce AudioLinie a mutat capul (primul eveniment) */
  const durataPiste=()=>Math.max(0,...piste().flatMap(p=>p.clipuri.filter(c=>c.id!=='__cap').map(capat)));
  let capFals=null;
  function puneCapFals(t){const P=piste();if(!P.length||capFals)return;capFals={p:P[0],c:{id:'__cap',nume:'',start:t,durata:0.01,unda:[],seg:[{fis:null,de:0,lung:0.01}]}};capFals.p.clipuri.push(capFals.c)}
  function scoateCapFals(){if(!capFals)return;const L=capFals.p.clipuri,i=L.indexOf(capFals.c);if(i>=0)L.splice(i,1);capFals=null}
  function emite(tip,date){const ev=Object.assign({tip,ora:Date.now()},date||{});J.push(ev);const S=stare();asc.forEach(f=>{try{f(S,ev)}catch(e){}});radacina.dispatchEvent(new CustomEvent('audioeditare',{detail:{stare:S,ev}}))}
  function stare(){return{sel:st.sel?Object.assign({},st.sel):null,comportament:st.comportament,istoric:st.stiva.map(o=>o.eticheta),refaceri:st.refaceri.length,
    murdar:st.murdar,clipboard:!!st.clipboard,dialog:st.dialog?st.dialog.tip:null,volume:piste().map(p=>p.vol||0),pistaActiva:st.pistaActiva}}
  function mesaj(h){if(x)x.mesaj(h)}
  /* ---------- AudioProiect: piste cu ce le trebuie (rol, vol, seg) ---------- */
  function pregatestePiste(L){(L||[]).forEach((p,i)=>{if(p.vol==null)p.vol=0;if(!p.rol)p.rol=i===0?'voce':'muzica'})}
  const startAp=copie(S0);delete startAp.comportament;delete startAp.importabile;delete startAp.dinWav;delete startAp.clipboard;delete startAp.numeSunet;delete startAp.pasiInainte;
  if(startAp.proiect&&startAp.proiect.piste)pregatestePiste(startAp.proiect.piste);
  Object.values(startAp.fs||{}).forEach(L=>L.forEach(f=>{if(f.piste)pregatestePiste(f.piste)}));
  initStare();
  x=AudioProiect.creeaza(locAp,{start:startAp,vedere:O.vedere||40});
  const FER=radacina.querySelector('.ap-fer'),TT=radacina.querySelector('.ap-tt'),PROI=radacina.querySelector('.ap-proiect');
  const strat=document.createElement('div');strat.className='ae-strat';FER.appendChild(strat);
  const jos=document.createElement('div');jos.className='ae-jos';PROI.appendChild(jos);
  const AUD=casca.querySelector('.ae-aud');

  /* ---------- legătura cu AudioLinie (refăcută ori de câte ori AudioProiect face alta: deschidere, proiect nou…) ---------- */
  function leagaAl(){
    const a=x.al();if(a===al)return;al=a;st.sel=null;
    if(!al){deseneazaJos();return}
    al.on((S,ev)=>{scoateCapFals();if(!ev)return;
      /* Audacity 4: o tragere care PORNEȘTE în bucata deja aleasă nu alege alta (p3 g3, p4 h7): selecția rămâne */
      if(ev.tip==='selectie'&&st.tragInSel){const v=st.tragInSel,a0=al;st.tragInSel=null;st.sel=v;
        queueMicrotask(()=>{if(a0===al)al.mesaj('În Audacity, o tragere care pornește <b>în bucata deja aleasă</b> nu alege alta: bucata aleasă a rămas aceeași. Ca s-o schimbi, dă întâi <b>un clic</b> pe undă, departe de ea, apoi trage din nou.')});
        deseneazaSel();deseneazaJos();auz();return}
      st.tragInSel=null;
      if(ev.tip==='selectie'){st.sel={pista:st.pistaJos!=null?st.pistaJos:st.pistaActiva,a:Math.min(ev.a,ev.b),b:Math.max(ev.a,ev.b)};st.pistaActiva=st.sel.pista;emite('selectie',Object.assign({},st.sel));
        /* mesajul lecției 11 („o înveți în lecția 13”) vine imediat după eveniment: îl înlocuiesc după el */
        const a0=al,s0=Object.assign({},st.sel);queueMicrotask(()=>{if(a0===al)al.mesaj(`Ai ales o bucată, de la ${etT(s0.a)} la ${etT(s0.b)}: e mai deschisă, iar jos, la <b>Selecție</b>, scrie unde începe și unde se termină. Un clic pe undă o scoate.`)})}
      else if(ev.tip==='clic'||ev.tip==='rigla'||ev.tip==='inceput'||ev.tip==='sfarsit'){st.sel=null;
        if((ev.tip==='clic'||ev.tip==='rigla')&&ev.t>durataPiste()+0.005)mesaj('Capul de redare stă <b>unde ai dat clic</b>, după capătul sunetului: aici e liniște. Dacă lipești aici, între capăt și bucata lipită rămâne liniște; apoi o poți trage mai aproape, de bara ei.')}
      if(['redare','continua','pauza','stop','capat','inceput','sfarsit','clic','rigla','selectie'].includes(ev.tip))emite('al_'+ev.tip,{t:ev.t});
      sunetLa(ev);deseneazaSel();deseneazaJos();auz()});
    const DEF=al.radacina.querySelector('.al-defilare');if(DEF)DEF.addEventListener('input',()=>{deseneazaSel();deseneazaAnteturi()});
    try{new ResizeObserver(()=>{deseneazaSel();deseneazaAnteturi()}).observe(al.radacina.querySelector('.al-zona'))}catch(e){}
    potrivesteDOM();al.redesenare();deseneazaSel();deseneazaJos();
  }
  /* pistele noi (import) primesc rândul lor în fereastra AudioLinie; panoul fiecărei piste primește glisorul Volum */
  function potrivesteDOM(){
    if(!al)return;const R=al.radacina,P=piste(),Z=R.querySelector('.al-zona'),PAN=R.querySelector('.al-panou'),SEL=R.querySelector('.al-sel');
    let L=[...R.querySelectorAll('.al-pista')],N=[...PAN.querySelectorAll('.pn')];
    while(L.length<P.length){const d=document.createElement('div');d.className='al-pista';d.dataset.pi=L.length;d.innerHTML='<canvas></canvas>';Z.insertBefore(d,SEL);L.push(d)}
    while(L.length>P.length){L.pop().remove()}
    while(N.length<P.length){const d=document.createElement('div');d.className='pn';d.innerHTML='<b></b><div class="ms"><span>M</span><span>S</span></div>';PAN.appendChild(d);N.push(d)}
    while(N.length>P.length){N.pop().remove()}
    N.forEach((n,i)=>{const p=P[i];const b=n.querySelector('b');if(b){b.textContent=p.nume||'';b.title=p.nume||''}
      let v=n.querySelector('.ae-vol');
      if(!v){v=document.createElement('label');v.className='ae-vol';v.innerHTML=`<span>Volum</span><input type="range" min="${VOL_MIN}" max="${VOL_MAX}" step="1" aria-label="Volum"><output></output>`;n.appendChild(v);
        const inp=v.querySelector('input');
        inp.addEventListener('pointerdown',()=>{inp._inainte=instantaneu()});
        inp.addEventListener('focus',()=>{if(!inp._inainte)inp._inainte=instantaneu()});
        inp.addEventListener('input',()=>{const k=+n.dataset.i;const pp=piste()[k];if(!pp)return;pp.vol=+inp.value;v.querySelector('output').textContent=dB(pp.vol);auz();sunetGain()});
        inp.addEventListener('change',()=>{const k=+n.dataset.i;const pp=piste()[k];if(!pp)return;operatie(ETICHETE.volum,inp._inainte||instantaneu(),()=>{pp.vol=+inp.value});inp._inainte=null;
          emite('volum',{pista:k,db:pp.vol});st.volumSchimbat=true;st.auzitDupaVolum=al?al.auzit().length:0})}
      n.dataset.i=i;const inp=v.querySelector('input');if(+inp.value!==(p.vol||0))inp.value=p.vol||0;v.querySelector('output').textContent=dB(p.vol||0)});
    deseneazaAnteturi();
  }
  const dB=v=>(v>0?'+':v<0?'−':'')+Math.abs(v)+' dB';
  /* bara de sus a fiecărui clip (se trage de ea ca să muți clipul); peste bara desenată de AudioLinie */
  function deseneazaAnteturi(){
    if(!al)return;const S=al.stare(),R=al.radacina,Z=R.querySelector('.al-zona'),W=Z.clientWidth||600,P=piste();
    const tx=t=>(t-S.v0)/S.span*W;
    /* elementele barelor se REFOLOSESC (nu se refac): bara trasă rămâne în pagină cât ține degetul/mouse-ul pe ea */
    [...R.querySelectorAll('.al-pista')].forEach((d,i)=>{const p=P[i];const vechi=[...d.querySelectorAll('.ae-ant')];let k=0;
      if(p)p.clipuri.forEach((c,j)=>{const x1=tx(c.start),x2=tx(capat(c));if(x2<0||x1>W)return;let e=vechi[k++];
        if(!e){e=document.createElement('div');e.innerHTML='<b></b><span aria-hidden="true">⋯</span>';d.appendChild(e)}
        e.className='ae-ant'+(p.rol==='muzica'?' muzica':'')+(st.sel&&st.sel.pista===i&&Math.abs(st.sel.a-c.start)<0.01&&Math.abs(st.sel.b-capat(c))<0.01?' ales':'');
        e.dataset.pi=i;e.dataset.ci=j;e.style.left=Math.max(0,x1)+'px';e.style.width=Math.max(32,Math.min(W,x2)-Math.max(0,x1))+'px';
        e.title='Bara clipului: trage de ea ca să muți clipul';const b=e.querySelector('b'),n=c.nume||p.nume||'';if(b.textContent!==n)b.textContent=n});
      vechi.slice(k).forEach(e=>{if(!(trage&&e.contains(document.activeElement)))e.remove()})});
  }
  function deseneazaSel(){
    if(!al)return;const R=al.radacina,Z=R.querySelector('.al-zona');let e=Z.querySelector('.ae-selp');
    if(!st.sel){if(e)e.remove();deseneazaAnteturi();return}
    if(!e){e=document.createElement('div');e.className='ae-selp';Z.appendChild(e)}
    const S=al.stare(),W=Z.clientWidth||600,tx=t=>(t-S.v0)/S.span*W,L=R.querySelectorAll('.al-pista'),d=L[st.sel.pista];
    if(!d){e.remove();return}
    const x1=tx(st.sel.a),x2=tx(st.sel.b);e.style.left=x1+'px';e.style.width=Math.max(1,x2-x1)+'px';e.style.top=d.offsetTop+'px';e.style.height=d.offsetHeight+'px';
    deseneazaAnteturi();
  }
  function deseneazaJos(){
    const p=al?al.stare().p:0,a=st.sel?st.sel.a:p,b=st.sel?st.sel.b:p;
    jos.innerHTML=`<span>Selecție</span><span class="ae-t" aria-label="Începutul selecției">${fmt(a)}</span><span class="ae-t" aria-label="Sfârșitul selecției">${fmt(b)}</span><span>Durată</span><span class="ae-t" aria-label="Durata selecției">${fmt(b-a)}</span>`;
  }
  /* ---------- istoricul (Anulează / Refacere): instantanee ale pistelor ---------- */
  function instantaneu(){return {piste:copie(piste()),sel:st.sel?Object.assign({},st.sel):null}}
  function aplicaInstantaneu(s){st.tragInSel=null;const P=piste();P.length=0;copie(s.piste).forEach(p=>P.push(p));st.sel=s.sel?Object.assign({},s.sel):null;
    if(al){potrivesteDOM();al.redesenare();if(st.sel)al.simuleaza([{tragere:[st.sel.a,st.sel.b]}])}deseneazaSel();deseneazaJos();auz();sunetReporneste()}
  function operatie(eticheta,inainte,fn){fn();st.lucrat=true;st.stiva.push({eticheta,inainte,dupa:instantaneu()});st.refaceri=[];murdar();if(al){potrivesteDOM();al.redesenare()}deseneazaSel();deseneazaJos();auz();sunetReporneste()}
  function murdar(){st.murdar=true;titlu()}
  function anuleaza(){
    if(st.dialog)return true;
    const o=st.stiva[st.stiva.length-1];if(!o)return false;
    st.stiva.pop();
    if(o.baza){o.dupa=instantaneu()}
    aplicaInstantaneu(o.inainte);st.refaceri.push(o);murdar();emite('anuleaza',{eticheta:o.eticheta});
    mesaj(`↶ Ai anulat „${esc(o.eticheta)}”.${o.baza?' Pista a dispărut, pentru că ai anulat chiar deschiderea sunetului. O aduci înapoi cu <b>Editează › Refă „'+esc(o.eticheta)+'”</b> (Ctrl+Shift+Z).':''}`);return true}
  function reface(){const o=st.refaceri.pop();if(!o){mesaj('Nu e nimic de refăcut.');return}aplicaInstantaneu(o.dupa);st.stiva.push(o);murdar();emite('reface',{eticheta:o.eticheta});mesaj(`↷ Ai refăcut „${esc(o.eticheta)}”.`)}
  /* ---------- titlul: „ * ” după o modificare (AudioProiect nu știe de editările mele) ---------- */
  let inTitlu=false;
  /* istoric gol: ↶ și Ctrl+Z nu fac nimic (ca în Audacity, „Revenire” stins) și nu ajung la simulatorul de înregistrare din VII/12; ↶ se stinge */
  /* la pornire, „Importă” (sunetul deschis) e punctul de plecare: se anulează doar după ce s-a lucrat ceva (sau a importat elevul) */
  function poateAnula(){return st.stiva.length>1||(st.stiva.length===1&&(!st.stiva[0].baza||st.lucrat))}
  function nimicDeAnulat(){const rf=st.refaceri[st.refaceri.length-1];mesaj('Nu e nimic de anulat.'+(rf?` Ca să aduci înapoi ce ai anulat: <b>Editează › Refă „${esc(rf.eticheta)}”</b> (Ctrl+Shift+Z).`:''))}
  function stingeUndo(){const u=radacina.querySelector('[data-a="anuleaza"]');if(u)u.setAttribute('aria-disabled',poateAnula()?'false':'true')}
  function titlu(){stingeUndo();const p=proiect();if(!p||inTitlu)return;let t=null;
    if(!p.nume&&S0.numeSunet)t=fara(S0.numeSunet)+' * - Audacity 4.0';   /* un WAV deschis: proiect fără nume, cu „ * ” de la început (probat) */
    else if(p.nume&&!p.modificat&&st.murdar)t=fara(p.nume)+' * - Audacity 4.0';
    if(t&&TT.textContent!==t){inTitlu=true;TT.textContent=t;inTitlu=false}}
  try{new MutationObserver(()=>titlu()).observe(TT,{childList:true,characterData:true,subtree:true})}catch(e){}
  /* ---------- operațiile ---------- */
  const tolT=0.019;
  function clipuriPe(p,a,b){return p.clipuri.filter(c=>capat(c)>a+tolT&&c.start<b-tolT)}
  function scoate(p,a,b,ripple){   /* scoate [a,b] de pe pista p; ripple = restul pistei vine în stânga */
    const noi=[];p.clipuri.forEach(c=>{if(capat(c)<=a+1e-6||c.start>=b-1e-6){noi.push(c);return}
      const s=bucata(c,c.start,a,c.id+'s'),d=bucata(c,b,capat(c),c.id+'d');
      if(s&&d&&ripple){d.start-=0;noi.push({_lipeste:[s,d]});return}
      if(s)noi.push(s);if(d)noi.push(d)});
    const L=b-a,out=[];
    noi.forEach(c=>{if(c._lipeste){const[s,d]=c._lipeste;out.push(lipesteClipuri(s,d,s.id.replace(/s$/,'')+'e'+(++st.idc)));return}
      if(ripple&&c.start>=b-1e-6)c.start=Math.max(0,c.start-L);out.push(c)});
    out.sort((u,v)=>u.start-v.start);p.clipuri.length=0;out.forEach(c=>p.clipuri.push(c))}
  function bucataAleasa(){const P=piste();if(!st.sel)return null;const p=P[st.sel.pista];if(!p)return null;
    const parti=clipuriPe(p,st.sel.a,st.sel.b).map(c=>bucata(c,st.sel.a,st.sel.b,'x'));
    if(!parti.filter(Boolean).length)return null;
    let unda=[],seg=[],t=st.sel.a;parti.filter(Boolean).forEach(c=>{if(c.start>t+tolT){const g=c.start-t;unda=unda.concat(new Array(k50(g)).fill(0));seg.push({fis:null,de:0,lung:g})}
      unda=unda.concat(c.unda||[]);seg=seg.concat(c.seg);t=capat(c)});
    return {unda,seg,lung:seg.reduce((s,x)=>s+x.lung,0),nume:parti.filter(Boolean)[0].nume,rol:p.rol}}
  function faraSelectie(){deschideDialog({tip:'eroare',titlu:'Niciun audio selectat',text:'Selectează audio pentru ștergere și încearcă din nou.'})}
  function stergeElimina(){if(!st.sel||!bucataAleasa()){faraSelectie();return}
    const s=Object.assign({},st.sel);operatie(ETICHETE.elimina,instantaneu(),()=>{scoate(piste()[s.pista],s.a,s.b,true);st.sel=null});
    emite('sterge',{mod:'elimina',pista:s.pista,a:s.a,b:s.b});mesaj('Bucata a dispărut, iar restul pistei a venit în stânga: înregistrarea e mai scurtă. Ascult-o: clic puțin înainte de tăietură, apoi ▶.')}
  function cuComportament(fn){if(st.comportament){fn(st.comportament);return}deschideDialog({tip:'alege',apoi:fn,ales:'lasa'})}
  function sterge(){if(!st.sel||!bucataAleasa()){faraSelectie();return}
    cuComportament(mod=>{const s=Object.assign({},st.sel);if(!s)return;
      operatie(mod==='elimina'?ETICHETE.elimina:ETICHETE.lasa,instantaneu(),()=>{scoate(piste()[s.pista],s.a,s.b,mod==='elimina');st.sel=null});
      emite('sterge',{mod,pista:s.pista,a:s.a,b:s.b});
      mesaj(mod==='elimina'?'Bucata a dispărut și restul a venit în stânga.':'Bucata a dispărut, dar în locul ei a rămas un <b>gol</b> (aici, calculatorul are aleasă varianta „Lasă spațiu”). Pauza tot acolo e, ca liniște. Ca să scapi și de gol: ↶ Anulează, apoi <b>Șterge și elimină spațiul</b>.')})}
  function copiaza(){const b=bucataAleasa();if(!b){mesaj('Întâi alege bucata: tragi pe undă de la începutul ei la sfârșit.');return}st.clipboard=b;emite('copiaza',{lung:b.lung});mesaj('Copiat. Acum dă un clic acolo unde vrei bucata (de preferat într-un loc gol, după capătul înregistrării) și alege <b>Lipește</b>.')}
  function decupeaza(){const b=bucataAleasa();if(!b){faraSelectie();return}
    cuComportament(mod=>{const s=Object.assign({},st.sel);st.clipboard=b;
      operatie(mod==='elimina'?ETICHETE.decupeazaElimina:ETICHETE.decupeazaLasa,instantaneu(),()=>{scoate(piste()[s.pista],s.a,s.b,mod==='elimina');st.sel=null});
      emite('decupeaza',{mod,pista:s.pista,a:s.a,b:s.b});mesaj(mod==='elimina'?'Decupat: bucata e în memorie, restul a venit în stânga.':'Decupat: bucata e în memorie, iar în locul ei a rămas un gol.')})}
  /* 1.1: după Lipește clipul lipit e ALES (banda de pe riglă, capturile v3c / lipit-dupa-capat), capul rămâne unde era */
  function lipeste(){const b=st.clipboard;if(!b){mesaj('Nu ai copiat nimic încă.');return}
    const P=piste();const pi=st.sel?st.sel.pista:st.pistaActiva;const p=P[pi]||P[0];if(!p){mesaj('Nu e nicio pistă.');return}
    const la=st.sel?st.sel.a:(al?al.stare().p:0);const id='p'+(++st.idc);const k=P.indexOf(p);
    const pesteSunet=p.clipuri.some(c=>capat(c)>la+tolT&&c.start<la+b.lung-tolT);
    const ante=p.clipuri.filter(c=>capat(c)<=la+tolT).map(capat);const gol=!pesteSunet&&ante.length?la-Math.max(...ante):0;
    operatie(ETICHETE.lipeste,instantaneu(),()=>{scoate(p,la,la+b.lung,false);p.clipuri.push({id,nume:b.nume,start:la,durata:b.lung,unda:b.unda.slice(),seg:copie(b.seg)});p.clipuri.sort((u,v)=>u.start-v.start);st.sel={pista:k,a:la,b:la+b.lung}});
    emite('lipeste',{pista:k,la,lung:b.lung,pesteSunet});
    mesaj('Lipit: bucata e acum un clip nou, care începe la capul de redare, și e aleasă.'+(pesteSunet?' Acolo era sunet: l-a <b>acoperit</b> (nu l-a împins). Dacă n-ai vrut asta: <b>Editează › Anulează</b>.':gol>0.1?` Între capătul sunetului și clipul lipit e liniște (${String(Math.round(gol*10)/10).replace('.',',')} s): îl poți trage mai aproape, de bara lui.`:''))}
  /* 1.1: clipul lăsat peste alt clip îl ACOPERĂ (judecata 1 v5b), nu se oprește la vecin; „Mută elementele” dacă era ales */
  function mutaClip(pi,ci,startNou,inainte,ales){const p=piste()[pi];if(!p)return null;const c=p.clipuri[ci];if(!c)return null;
    const s=Math.max(0,startNou),vechi=c.start;if(Math.abs(s-vechi)<0.005&&!inainte)return null;
    if(ales==null)ales=!!st.sel&&st.sel.pista===pi&&Math.abs(st.sel.a-c.start)<0.01&&Math.abs(st.sel.b-capat(c))<0.01;
    const et=ales?ETICHETE.mutaElemente:ETICHETE.muta;let acoperit=false,doarLiniste=false;
    operatie(et,inainte||instantaneu(),()=>{c.start=s;const alte=p.clipuri.filter(z=>z!==c);
      acoperit=alte.some(z=>capat(z)>s+tolT&&z.start<s+c.durata-tolT);
      /* judecata 2 n3: sub clip a fost doar liniște (nicio valoare a undei peste prag în bucata acoperită) */
      doarLiniste=acoperit&&!alte.some(z=>(z.unda||[]).slice(Math.max(0,k50(s-z.start)),Math.max(0,k50(s+c.durata-z.start))).some(v=>v>0.1));
      p.clipuri.length=0;alte.forEach(z=>p.clipuri.push(z));if(acoperit)scoate(p,s,s+c.durata,false);
      p.clipuri.push(c);p.clipuri.sort((u,v)=>u.start-v.start);st.sel={pista:pi,a:s,b:s+c.durata}});
    emite('mutaClip',{pista:pi,de:vechi,la:s,fis:segDe(c)[0].fis,src:segDe(c)[0].de,acoperit,eticheta:et});return {acoperit,doarLiniste,eticheta:et}}
  function importa(nume){const f=(S0.importabile||[]).find(z=>z.nume.toLowerCase()===String(nume).toLowerCase());if(!f)return false;
    const P=piste();const d=(f.unda||[]).length/FPS;
    operatie(ETICHETE.importa,instantaneu(),()=>{P.push({tip:'audio',nume:fara(f.nume),rol:f.rol||'muzica',vol:0,clipuri:[{id:'i'+(++st.idc),nume:fara(f.nume),start:0,durata:d,unda:(f.unda||[]).slice(),culoare:f.culoare||'#a8dccb',seg:[{fis:f.fis||fara(f.nume),de:0,lung:d}]}]})});
    emite('importa',{nume:f.nume,pista:P.length-1});mesaj(`Sunetul „${esc(fara(f.nume))}” e pe o pistă nouă, sub celelalte, de la 0:00. Fiecare pistă are glisorul ei <b>Volum</b>, în panoul din stânga.`);return true}

  /* ---------- ferestrele mele (meniul Editează, alegerea comportamentului, importul, erori, „Modificări nesalvate”) ---------- */
  function deschideDialog(d){st.dialog=d;desenStrat();emite('fereastra',{fereastra:d.tip})}
  function inchideDialog(){st.dialog=null;desenStrat();FER.focus({preventScroll:true})}
  function desenStrat(){
    const d=st.dialog;strat.classList.toggle('vizibil',!!d);
    if(!d){strat.innerHTML='';return}
    if(d.tip==='meniu'){const o=poateAnula()?st.stiva[st.stiva.length-1]:null,rf=st.refaceri[st.refaceri.length-1],it=(a,t,k,ok)=>`<button type="button" data-ae="m" data-v="${a}" aria-disabled="${ok?'false':'true'}"><span>${t}</span><kbd>${k||''}</kbd></button>`;
      /* Audacity 4 (reparare r1): „Refacere” stins când nu e nimic de refăcut; „Refă „…”” când e */
      strat.innerHTML=`<div class="ap-meniu ae-meniu" role="menu" aria-label="Meniul Editează">${it('anuleaza',o?`Anulează „${esc(o.eticheta)}”`:'Revenire','Ctrl+Z',!!o)}${it('reface',rf?`Refă „${esc(rf.eticheta)}”`:'Refacere','Ctrl+Shift+Z',!!rf)}<hr>
        ${it('decupeaza','Decupează','Ctrl+X',1)}${it('copiaza','Copiază','Ctrl+C',1)}${it('lipeste','Lipește','Ctrl+V',1)}${it('sterge','Șterge','Del; Backspace',1)}<hr>
        ${it('duplica','Duplică','Ctrl+D',1)}${it('elimina','Șterge și elimină spațiul (per pistă)','Shift+Del; Shift+Backspace',1)}<hr>
        ${it('alt','Clip ▸','',1)}${it('alt','Etichetă ▸','',1)}${it('alt','Suprimă audio','Ctrl+L',1)}<hr>${it('alt','Editor metadate','',1)}<hr>${it('alt','Preferințe','',1)}</div>`;return}
    if(d.tip==='alege'){const el=d.ales==='elimina';
      strat.innerHTML=`<div class="ap-dlg ae-alege" role="dialog" aria-label="Alege comportamentul la ștergerea unei porțiuni de clip"><button type="button" class="ae-esc" data-ae="esc" title="Tasta Esc: închizi fereastra fără să alegi (pe telefon: butonul acesta)">Esc</button>
        <div class="ap-dc"><b style="display:block;margin-right:54px">Alege comportamentul la ștergerea unei porțiuni de clip</b>
        <div class="ae-cards"><div class="ae-card"><div class="ae-desen" aria-hidden="true"><i style="left:8%;width:30%"></i><s style="left:38%;width:24%"></s><i style="left:62%;width:30%"></i></div><label><input type="radio" name="ae-c" data-ae="c" value="lasa"${el?'':' checked'}> Lasă spațiu</label></div>
        <div class="ae-card"><div class="ae-desen" aria-hidden="true"><i style="left:8%;width:60%"></i><s style="left:38%;width:24%"></s></div><label><input type="radio" name="ae-c" data-ae="c" value="elimina"${el?' checked':''}> Elimină spațiul (cascadează)</label></div></div>
        ${el?`<div class="ae-sub"><b>La eliminarea spațiului, ia următoarea acțiune</b><label><input type="radio" name="ae-s" checked> Clipul selectat se mută înapoi pentru a umple spațiul</label><label><input type="radio" name="ae-s"> Toate clipurile de pe aceeași pistă se mută înapoi pentru a umple spațiul</label><label><input type="radio" name="ae-s"> Toate clipurile de pe toate pistele se mută înapoi pentru a umple spațiul</label></div>`:''}</div>
        <div class="ap-db"><button type="button" class="prim" data-ae="aplica">Aplică</button></div></div>`;return}
    if(d.tip==='setat'){strat.innerHTML=`<div class="ap-dlg" role="dialog" aria-label="Șterge preferința"><div class="ap-dt"><span>Șterge preferința</span><button type="button" class="ap-x" data-ae="ok" aria-label="Închide fereastra">✕</button></div>
      <div class="ap-dc"><b>Comportamentul la ștergere a fost setat</b><p style="margin:6px 0 0">Poți schimba asta oricând din Preferințe.</p><p style="margin:6px 0 0">Există de asemenea o varietate de noi scurtături care te lasă să accesezi rapid diferite comportamente la ștergere. Mergi la Scurtături pentru a afla mai multe.</p></div>
      <div class="ap-db"><button type="button" class="prim" data-ae="ok">OK</button></div></div>`;return}
    if(d.tip==='eroare'){strat.innerHTML=`<div class="ap-dlg" role="dialog" aria-label="${esc(d.titlu)}"><div class="ap-dt"><span>Audacity</span><button type="button" class="ap-x" data-ae="ok" aria-label="Închide fereastra">✕</button></div>
      <div class="ap-dc"><b>${esc(d.titlu)}</b><p style="margin:6px 0 0">${esc(d.text)}</p></div><div class="ap-db"><button type="button" class="prim" data-ae="ok">OK</button></div></div>`;return}
    if(d.tip==='nesalvate'){strat.innerHTML=`<div class="ap-dlg" role="dialog" aria-label="Modificări nesalvate"><div class="ap-dt"><span>Modificări nesalvate</span><button type="button" class="ap-x" data-ae="ns-renunta" aria-label="Închide fereastra">✕</button></div>
      <div class="ap-dc"><b>Dorești să salvezi modificările acestui proiect înainte de a-l închide?</b><p style="margin:6px 0 0">Modificările tale vor fi pierdute dacă nu le salvezi.</p></div>
      <div class="ap-db"><button type="button" class="prim" data-ae="ns-salveaza">Salvează</button><button type="button" data-ae="ns-nu">Nu salva</button><button type="button" data-ae="ns-renunta">Renunță</button></div></div>`;return}
    if(d.tip==='import'){const fis=(S0.importabile||[]).filter(f=>(f.folder||'Descărcări')===d.folder);
      strat.innerHTML=`<div class="ap-dlg ap-win" role="dialog" aria-label="Deschide"><div class="ap-dt"><span>Deschide</span><button type="button" class="ap-x" data-ae="i-anulare" aria-label="Închide fereastra">✕</button></div>
      <div class="ap-dc"><div class="ap-adr" aria-label="Bara de adresă">📁 ${esc(d.folder)}</div>
      <div class="ap-wcorp"><div class="ap-nav" aria-label="Locuri">${['Desktop','Descărcări','Documente'].map(n=>`<button type="button" data-ae="i-nav" data-v="${n}" class="${d.folder===n?'activ':''}">${n==='Desktop'?'🖥':n==='Descărcări'?'⬇':'📄'} ${n}</button>`).join('')}</div>
      <div class="ap-lista" aria-label="Fișierele din folder"><div class="ap-cap">Nume</div>${fis.map(f=>`<button type="button" data-ae="i-fis" data-v="${esc(f.nume)}" class="${d.sel===f.nume?'sel':''}">♪ ${esc(f.nume)}</button>`).join('')}${fis.length?'':'<div class="ap-gol">Niciun element nu corespunde căutării.</div>'}</div></div>
      <div class="ap-camp"><label for="ae-if">Nume fișier:</label><input id="ae-if" type="text" data-ae="i-nume" value="${esc(d.nume||'')}" autocomplete="off" spellcheck="false"><span>Tip:</span><select disabled aria-label="Tipul fișierelor"><option>Toate fișierele suportate</option></select></div>
      ${d.eroare?`<p class="ap-eroare">${esc(d.eroare)}</p>`:''}</div>
      <div class="ap-db"><button type="button" class="prim" data-ae="i-ok">Deschidere</button><button type="button" data-ae="i-anulare">Anulare</button></div></div>`;return}
  }
  function alegeInchis(){const d=st.dialog;st.dialog=null;desenStrat();emite('comportamentInchis');mesaj('Ai închis fereastra fără să alegi: nu s-a șters nimic, iar calculatorul a rămas cum era. Ca să scoți o pauză, folosește <b>Editează › Șterge și elimină spațiul (per pistă)</b>.');FER.focus({preventScroll:true})}
  function apasaMeniu(v){inchideDialog();
    if(v==='anuleaza'){if(!anuleaza())x.simuleaza([{anuleaza:1}])}
    else if(v==='reface')reface();else if(v==='decupeaza')decupeaza();else if(v==='copiaza')copiaza();else if(v==='lipeste')lipeste();
    else if(v==='sterge')sterge();else if(v==='elimina')stergeElimina();
    else if(v==='duplica')mesaj('<b>Duplică</b> nu-l folosim în lecția asta.');else mesaj('Comanda asta nu o folosim în lecția asta.')}
  function deschideImport(){if(!proiect()){mesaj('Întâi deschide un proiect.');return}deschideDialog({tip:'import',folder:'Descărcări',nume:'',sel:null,eroare:''});
    setTimeout(()=>{const i=strat.querySelector('[data-ae="i-nume"]');if(i)try{i.focus({preventScroll:true})}catch(e){}},0)}
  function okImport(){const d=st.dialog;const inp=strat.querySelector('[data-ae="i-nume"]');let n=String(inp?inp.value:d.nume).trim()||d.sel||'';if(!n)return;
    const f=(S0.importabile||[]).find(z=>(z.folder||'Descărcări')===d.folder&&(z.nume.toLowerCase()===n.toLowerCase()||fara(z.nume).toLowerCase()===n.toLowerCase()));
    if(!f){d.nume=n;d.eroare=`Nu se găsește „${n}” în ${d.folder}.`;desenStrat();return}
    inchideDialog();importa(f.nume)}
  /* „Modificări nesalvate” pentru editările mele (AudioProiect nu le vede): doar când el crede că proiectul e salvat */
  function trebuieIntrebat(){const p=proiect();return st.murdar&&!!p&&!!p.nume&&!p.modificat}
  function inchidere(apoi){deschideDialog({tip:'nesalvate',apoi})}
  function termina(apoi){st.murdar=false;st.stiva=[];st.refaceri=[];if(apoi==='aplicatie')x.simuleaza([{inchideAplicatia:1}]);else x.simuleaza([{inchideProiect:1}])}

  /* ---------- gesturile (faza de captură: ajung la mine înaintea AudioProiect și AudioLinie) ---------- */
  radacina.addEventListener('click',e=>{
    const t=e.target;
    const m=t.closest('.ap-mb [data-m]');
    if(m&&radacina.contains(m)&&m.dataset.m==='Editează'){e.stopPropagation();e.preventDefault();
      if(x.stare().dialog==='meniu')radacina.querySelector('.ap-mb [data-m="Fișier"]').click();
      if(!proiect()){x.mesaj('Meniul <b>Editează</b> lucrează pe un proiect deschis.');return}
      if(st.dialog&&st.dialog.tip==='meniu')inchideDialog();else deschideDialog({tip:'meniu'});return}
    if(st.dialog&&st.dialog.tip==='meniu'&&!t.closest('[data-ae]')&&!t.closest('.ae-strat')){inchideDialog()}
    const mf=t.closest('[data-a="mf"]');
    if(mf&&mf.dataset.v==='importa'&&mf.getAttribute('aria-disabled')!=='true'){setTimeout(()=>deschideImport(),0);return}
    if(mf&&(mf.dataset.v==='inchide-proiect'||mf.dataset.v==='inchide')&&trebuieIntrebat()){e.stopPropagation();e.preventDefault();
      radacina.querySelector('.ap-mb [data-m="Fișier"]').click();inchidere(mf.dataset.v==='inchide'?'aplicatie':'proiect');return}
    const a=t.closest('[data-a]');
    if(a&&a.dataset.a==='x'&&trebuieIntrebat()){e.stopPropagation();e.preventDefault();inchidere('aplicatie');return}
    if(a&&a.dataset.a==='anuleaza'){e.stopPropagation();e.preventDefault();if(poateAnula())anuleaza();else nimicDeAnulat();return}
    if(a&&a.dataset.a==='reset'){e.stopPropagation();e.preventDefault();reset();return}   /* „Ia-o de la capăt”: și starea mea (istoric, jurnal, alegerea), nu doar AudioProiect */
  },true);
  strat.addEventListener('click',e=>{
    if(e.target===strat){if(st.dialog&&st.dialog.tip==='meniu')inchideDialog();return}
    const b=e.target.closest('[data-ae]');if(!b)return;const d=st.dialog;const v=b.dataset.ae;
    if(v==='m'){if(b.getAttribute('aria-disabled')==='true')return;apasaMeniu(b.dataset.v);return}
    if(v==='c'){d.ales=b.value;desenStrat();return}
    if(v==='esc'){alegeInchis();return}
    if(v==='aplica'){const fn=d.apoi;st.comportament=d.ales||'lasa';emite('comportamentAles',{v:st.comportament});st.dialog={tip:'setat',apoi:fn};desenStrat();return}
    if(v==='ok'){const fn=d&&d.apoi;inchideDialog();if(fn)fn(st.comportament);return}
    if(v==='ns-salveaza'){const p=proiect();const ap=d.apoi;inchideDialog();x.simuleaza([{salveaza:{nume:fara(p.nume),folder:p.folder}}]);st.murdar=false;termina(ap);return}
    if(v==='ns-nu'){const ap=d.apoi;inchideDialog();termina(ap);return}
    if(v==='ns-renunta'){inchideDialog();return}
    if(v==='i-nav'){d.folder=b.dataset.v;d.sel=null;d.eroare='';desenStrat();return}
    if(v==='i-fis'){d.sel=b.dataset.v;d.nume=b.dataset.v;desenStrat();return}
    if(v==='i-ok'){okImport();return}
    if(v==='i-anulare'){inchideDialog();return}
  });
  strat.addEventListener('dblclick',e=>{const b=e.target.closest('[data-ae="i-fis"]');if(b&&st.dialog&&st.dialog.tip==='import'){st.dialog.sel=b.dataset.v;st.dialog.nume=b.dataset.v;okImport()}});
  strat.addEventListener('input',e=>{if(e.target.dataset.ae==='i-nume'&&st.dialog){st.dialog.nume=e.target.value;st.dialog.sel=null}});
  radacina.addEventListener('keydown',e=>{
    const d=st.dialog,inInput=e.target.tagName==='INPUT'&&e.target.type!=='range';
    if(d){if(e.key==='Escape'){e.preventDefault();e.stopPropagation();if(d.tip==='alege')alegeInchis();else inchideDialog();return}
      if(e.key==='Enter'&&d.tip==='import'){e.preventDefault();e.stopPropagation();okImport();return}
      if(e.key==='Enter'&&(d.tip==='setat'||d.tip==='eroare')){e.preventDefault();e.stopPropagation();const fn=d.apoi;inchideDialog();if(fn)fn(st.comportament);return}
      if(d.tip!=='import'){e.stopPropagation();if(e.ctrlKey||['Delete','Backspace'].includes(e.key))e.preventDefault()}return}
    if(inInput||x.stare().dialog||x.stare().ecran!=='proiect')return;
    if(e.target.type==='range'&&!e.ctrlKey)return;
    const k=(e.key||'').toLowerCase();
    if(e.ctrlKey&&!e.altKey){
      if(k==='z'&&e.shiftKey){e.preventDefault();e.stopPropagation();reface();return}
      if(k==='z'){e.preventDefault();e.stopPropagation();if(poateAnula())anuleaza();else nimicDeAnulat();return}
      if(k==='x'){e.preventDefault();e.stopPropagation();decupeaza();return}
      if(k==='c'){e.preventDefault();e.stopPropagation();copiaza();return}
      if(k==='v'){e.preventDefault();e.stopPropagation();lipeste();return}
      /* Ctrl+Shift+I (unelte de dezvoltare) și Ctrl+W (închide fila) le ia browserul: importul și închiderea, din meniul Fișier */
      return}
    if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();e.stopPropagation();if(e.shiftKey)stergeElimina();else sterge();return}
  },true);
  /* pe ce pistă a apăsat elevul (tragerea / clicul de pe undă) + tragerea clipului de bara lui */
  radacina.addEventListener('pointerdown',e=>{
    if(!al||e.button>0)return;const Z=al.radacina.querySelector('.al-zona');if(!Z||!Z.contains(e.target))return;
    const L=[...al.radacina.querySelectorAll('.al-pista')];const i=L.findIndex(d=>{const r=d.getBoundingClientRect();return e.clientY>=r.top&&e.clientY<r.bottom});
    if(i>=0){st.pistaJos=i;st.pistaActiva=i}
    st.jos0=null;st.tragInSel=null;
    const ant=e.target.closest('.ae-ant');
    if(ant){e.stopPropagation();e.preventDefault();const pi=+ant.dataset.pi,ci=+ant.dataset.ci,c=piste()[pi]&&piste()[pi].clipuri[ci];if(!c)return;
      const ales=!!st.sel&&st.sel.pista===pi&&Math.abs(st.sel.a-c.start)<0.01&&Math.abs(st.sel.b-capat(c))<0.01;
      trage={pi,ci,x0:e.clientX,s0:c.start,inainte:instantaneu(),mutat:false,id:e.pointerId,ales};try{ant.setPointerCapture(e.pointerId)}catch(_){}return}
    /* unde a apăsat (pentru clicul după capăt și pentru tragerea pornită în bucata aleasă) */
    const S=al.stare(),r=Z.getBoundingClientRect(),t=S.v0+(e.clientX-r.left)/(Z.clientWidth||600)*S.span,rigla=!!e.target.closest('.al-rigla');
    st.jos0={x:e.clientX,id:e.pointerId,t,rigla};
    if(!rigla&&st.sel&&i===st.sel.pista&&t>st.sel.a+0.02&&t<st.sel.b-0.02)st.tragInSel=Object.assign({},st.sel);
  },true);
  /* clic (nu tragere) DUPĂ capătul sunetului: clipul-fantomă, înainte ca AudioLinie să mute capul (faza de captură) */
  radacina.addEventListener('pointerup',e=>{const J0=st.jos0;st.jos0=null;
    if(!J0||!al||trage||e.pointerId!==J0.id||Math.abs(e.clientX-J0.x)>6)return;
    const Z=al.radacina.querySelector('.al-zona');if(!Z)return;const S=al.stare(),r=Z.getBoundingClientRect();
    const t=S.v0+(e.clientX-r.left)/(Z.clientWidth||600)*S.span;
    if(t>durataPiste()+0.01){puneCapFals(t);setTimeout(scoateCapFals,0)}},true);
  radacina.addEventListener('pointercancel',()=>{st.jos0=null;st.tragInSel=null},true);
  window.addEventListener('pointermove',e=>{if(!trage||e.pointerId!==trage.id||!al)return;const S=al.stare(),W=al.radacina.querySelector('.al-zona').clientWidth||600;
    const dx=(e.clientX-trage.x0)/W*S.span;if(!trage.mutat&&Math.abs(e.clientX-trage.x0)<4)return;trage.mutat=true;const c=piste()[trage.pi].clipuri[trage.ci];if(!c)return;
    c.start=Math.max(0,trage.s0+dx);al.redesenare();deseneazaAnteturi()});
  const susT=e=>{if(!trage||e.pointerId!==trage.id)return;const T=trage;trage=null;const c=piste()[T.pi]&&piste()[T.pi].clipuri[T.ci];if(!c)return;
    if(!T.mutat){st.sel={pista:T.pi,a:c.start,b:capat(c)};st.pistaActiva=T.pi;emite('selectie',Object.assign({clip:true},st.sel));deseneazaSel();deseneazaJos();
      mesaj('Ai ales tot clipul (bara lui e încadrată). Ca să-l muți, ține apăsat pe bară și trage spre stânga sau spre dreapta.');return}
    const tinta=c.start;c.start=T.s0;const rz=mutaClip(T.pi,T.ci,tinta,T.inainte,T.ales);FER.focus({preventScroll:true});
    mesaj(rz&&rz.acoperit&&rz.doarLiniste?'Ai lăsat clipul peste capătul altui clip: a acoperit doar liniștea de la capăt, din vorbire nu s-a pierdut nimic.'
      :rz&&rz.acoperit?'Ai lăsat clipul <b>peste alt clip</b>: l-a acoperit, iar bucata de dedesubt nu se mai aude (așa face și Audacity 4). Dacă n-ai vrut asta: <b>Editează › Anulează</b> (Ctrl+Z).'
      :`Ai mutat clipul pe linia de timp (în Audacity, la Editează: „Anulează „${rz?rz.eticheta:ETICHETE.muta}””).`)};
  window.addEventListener('pointerup',susT);window.addEventListener('pointercancel',e=>{if(trage&&e.pointerId===trage.id){const c=piste()[trage.pi].clipuri[trage.ci];if(c)c.start=trage.s0;trage=null;if(al)al.redesenare();deseneazaAnteturi()}});

  /* ---------- „Tu, la căști”: ce s-ar auzi la capul de redare ---------- */
  function nivelPista(i){const p=piste()[i];if(!p)return -90;const n=nivelUnda([].concat(...p.clipuri.map(c=>c.unda||[])));return n+(p.vol||0)}
  function laTimp(p,t){const c=p.clipuri.find(c=>t>=c.start&&t<capat(c));if(!c)return null;const v=(c.unda||[])[Math.floor((t-c.start)*FPS)]||0;return v}
  function verdictMix(){const P=piste();const iv=P.findIndex(p=>p.rol==='voce'),im=P.findIndex(p=>p.rol==='muzica');if(iv<0||im<0)return null;
    return nivelPista(iv)-nivelPista(im)}
  function auz(){
    if(!al){AUD.textContent='Audacity nu are niciun proiect deschis.';AUD.className='ae-aud';return}
    const S=al.stare(),t=S.p,P=piste();const rul=S.reda&&!S.pauza;
    const voce=P.find(p=>p.rol==='voce'),muz=P.find(p=>p.rol==='muzica');
    const vv=voce?laTimp(voce,t):null,mv=muz?laTimp(muz,t):null;const dif=verdictMix();
    let txt='',cls='';
    if(vv==null&&mv==null)txt='liniște: la capul de redare nu e nicio bucată';
    else{const parti=[];
      if(vv!=null)parti.push(vv<0.03?'vocea face o pauză (liniște)':'vocea');
      if(mv!=null){if(dif==null||vv==null)parti.push('muzica');else if(dif>=10&&dif<=30){parti.push('muzica, încet, în fundal')}else if(dif>30)parti.push('muzica abia se mai aude');else parti.push('muzica');}
      txt=parti.join(' + ');
      if(vv!=null&&mv!=null&&vv>=0.03&&dif!=null){if(dif<0){txt+=': muzica ACOPERĂ vocea, nu se înțeleg cuvintele';cls='rau'}else if(dif<10){txt+=': muzica e prea tare, abia se înțeleg cuvintele';cls='rau'}else if(dif<=30){txt+=': cuvintele se înțeleg clar';cls='ok'}}}
    AUD.className='ae-aud '+cls;AUD.textContent=(rul?'Acum se aude: ':`La ${etT(t)} (apasă ▶ ca să asculți): `)+txt+'.';
  }
  const etT=t=>{const m=Math.floor(t/60),s=t-m*60;return `${m}:${String(Math.floor(s)).padStart(2,'0')},${Math.floor((s%1)*10)}`};
  let rafA=0;(function bucla(){if(!radacina.isConnected)return;if(al&&al.stare().reda&&!al.stare().pauza)auz();rafA=requestAnimationFrame(bucla)})();

  /* ---------- sunetul adevărat (opțional): WebAudio, câte un câștig pe pistă ---------- */
  let AC=null,surse=[],castiguri=[],tampoane={},sunetPornit=false,incarcat=false;
  async function incarcaSunete(){if(incarcat||!O.sunete)return;incarcat=true;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();
    for(const[f,u]of Object.entries(O.sunete)){try{const r=await fetch(u);const b=await r.arrayBuffer();tampoane[f]=await AC.decodeAudioData(b)}catch(e){}}}catch(e){}}
  function opresteSurse(){surse.forEach(s=>{try{s.stop()}catch(e){}});surse=[];castiguri=[]}
  function sunetGain(){castiguri.forEach(g=>{const p=piste()[g.pi];if(p)try{g.n.gain.value=Math.pow(10,(p.vol||0)/20)}catch(e){}})}
  function pornesteSurse(t){opresteSurse();if(!sunetPornit||!AC)return;const acum=AC.currentTime+0.05;
    piste().forEach((p,pi)=>{const g=AC.createGain();g.gain.value=Math.pow(10,(p.vol||0)/20);g.connect(AC.destination);castiguri.push({pi,n:g});
      p.clipuri.forEach(c=>{let pos=c.start;segDe(c).forEach(s=>{const a=pos,b=pos+s.lung;pos=b;if(b<=t||!s.fis||!tampoane[s.fis])return;
        const off=Math.max(0,t-a);const src=AC.createBufferSource();src.buffer=tampoane[s.fis];src.connect(g);
        try{src.start(acum+Math.max(0,a-t),s.de+off,s.lung-off);surse.push(src)}catch(e){}})})})}
  function sunetLa(ev){if(!O.sunete)return;const S=al.stare();
    if(['redare','continua'].includes(ev.tip)||(ev.tip==='clic'&&S.reda&&!S.pauza))pornesteSurse(S.p);
    else if(['pauza','stop','capat','inceput','sfarsit'].includes(ev.tip))opresteSurse()}
  function sunetReporneste(){if(!O.sunete||!al)return;const S=al.stare();if(S.reda&&!S.pauza)pornesteSurse(S.p);else opresteSurse()}
  casca.addEventListener('click',async e=>{const b=e.target.closest('[data-ae="sunet"]');if(!b)return;sunetPornit=!sunetPornit;b.setAttribute('aria-pressed',String(sunetPornit));
    b.textContent=sunetPornit?'🔊 Sunet: pornit':'🔇 Sunet: oprit';if(sunetPornit){await incarcaSunete();try{AC&&AC.resume()}catch(_){}sunetReporneste()}else opresteSurse()});

  /* ---------- AudioProiect: evenimentele lui ---------- */
  x.on((S,ev)=>{leagaAl();
    if(ev&&ev.tip==='salvat'){st.murdar=false}
    if(ev&&['inchisProiect','aplicatieInchisa','deschis','proiectNou','reset'].includes(ev.tip)){st.murdar=false;st.stiva=S0.dinWav&&ev.tip==='reset'?st.stiva:[];st.refaceri=[];st.sel=null;if(st.dialog&&st.dialog.tip!=='import')inchideDialog();opresteSurse()}
    if(ev&&!/^al_/.test(ev.tip)&&ev.tip!=='start'){J.push(Object.assign({},ev,{tip:'ap_'+ev.tip}));asc.forEach(f=>{try{f(stare(),ev)}catch(_){}})}
    titlu();deseneazaJos();auz()});
  leagaAl();titlu();deseneazaJos();auz();

  /* ---------- simulare (poartă, probe, „Arată-mi răspunsul”) ---------- */
  function raspundeFereastra(r){const d=st.dialog;if(!d)return;
    if(d.tip==='alege'){if(r==='esc'||!r){alegeInchis();return}d.ales=r;const fn=d.apoi;st.comportament=r;emite('comportamentAles',{v:r});st.dialog=null;desenStrat();if(fn)fn(r);return}
    if(d.tip==='eroare'||d.tip==='setat')inchideDialog()}
  function simuleaza(L){st.tragInSel=null;(L||[]).forEach(a=>{
    if(a.selecteaza){const pi=a.pista||0;st.pistaJos=pi;st.pistaActiva=pi;if(al)al.simuleaza([{tragere:a.selecteaza.slice()}]);st.sel={pista:pi,a:Math.min(...a.selecteaza),b:Math.max(...a.selecteaza)};deseneazaSel();deseneazaJos()}
    else if('cap' in a){st.pistaJos=a.pista||0;st.pistaActiva=a.pista||0;if(al){if(a.cap>durataPiste()+0.01)puneCapFals(a.cap);al.simuleaza([{clic:a.cap}]);scoateCapFals()}st.sel=null;deseneazaSel();deseneazaJos()}
    else if(a.stergeElimina)stergeElimina();
    else if(a.sterge){sterge();raspundeFereastra(a.raspuns);if(st.dialog)raspundeFereastra()}
    else if(a.decupeaza){decupeaza();raspundeFereastra(a.raspuns);if(st.dialog)raspundeFereastra()}
    else if(a.copiaza)copiaza();
    else if(a.lipeste)lipeste();
    else if(a.mutaClip){const m=a.mutaClip,p=piste()[m.pista||0];if(p){const ci=p.clipuri.findIndex(c=>m.la>=c.start&&m.la<capat(c));if(ci>=0)mutaClip(m.pista||0,ci,m.start)}}
    else if(a.importa)importa(a.importa);
    else if(a.volum){const p=piste()[a.volum.pista];if(p){operatie(ETICHETE.volum,instantaneu(),()=>{p.vol=Math.max(VOL_MIN,Math.min(VOL_MAX,a.volum.db))});emite('volum',{pista:a.volum.pista,db:p.vol});st.volumSchimbat=true;st.auzitDupaVolum=al?al.auzit().length:0;potrivesteDOM()}}
    else if(a.asculta){if(al)al.simuleaza([{clic:a.asculta[0]},{reda:1},{asteapta:a.asculta[1]-a.asculta[0]},{pauza:1}])}
    else if(a.ascultaTot){if(al){const d=al.stare().durata;al.simuleaza([{inceput:1},{reda:1},{asteapta:d+0.5}])}}
    else if(a.anuleaza){for(let k=0;k<a.anuleaza;k++)if(!anuleaza())x.simuleaza([{anuleaza:1}])}
    else if(a.reface){for(let k=0;k<a.reface;k++)reface()}
    else if(a.inchideProiect&&trebuieIntrebat()){if(a.raspuns==='salveaza'){const p=proiect();x.simuleaza([{salveaza:{nume:fara(p.nume),folder:p.folder}}])}termina('proiect')}
    else if(a.inchideAplicatia&&trebuieIntrebat()){if(a.raspuns==='salveaza'){const p=proiect();x.simuleaza([{salveaza:{nume:fara(p.nume),folder:p.folder}}])}termina('aplicatie')}
    else x.simuleaza([a]);
    leagaAl()});deseneazaSel();deseneazaJos();auz()}
  /* start.pasiInainte: acțiuni făcute „înainte să vină elevul” (nu intră în jurnal, nici în istoricul de ascultare) */
  function inainte(){if(S0.pasiInainte&&S0.pasiInainte.length){simuleaza(S0.pasiInainte);J=[{tip:'start',ora:Date.now()}];st.volumSchimbat=false;st.auzitDupaVolum=0;st.murdar=!!st.murdar}}
  function reset(){opresteSurse();st.dialog=null;desenStrat();initStare();x.reset();leagaAl();al&&potrivesteDOM();inainte();titlu();deseneazaJos();auz();emite('reset')}
  inainte();
  const e={radacina,versiune:VERS,ap:()=>x,al:()=>x.al(),piste,stare,jurnal:()=>J.map(z=>Object.assign({},z)),simuleaza,reset,mesaj,
    on:f=>asc.add(f),off:f=>asc.delete(f),focus:()=>FER.focus({preventScroll:true}),nivel:nivelPista,diferentaMix:verdictMix,
    auzitDupaVolum:()=>{if(!al)return [];const A=al.auzit();return st.volumSchimbat?A.slice(st.auzitDupaVolum):A},
    distruge(){cancelAnimationFrame(rafA);opresteSurse();x.distruge();radacina.remove()}};
  return e;
}

/* ---------- conținutul pistelor: unde e fiecare bucată din fișierele-sursă ---------- */
function plasari(e,fis,pista){   /* [{t0 (pe linia de timp), de, lung, pista}] pentru fișierul dat */
  const out=[];e.piste().forEach((p,pi)=>{if(pista!=null&&pi!==pista)return;p.clipuri.forEach(c=>{let pos=c.start;segDe(c).forEach(s=>{if(s.fis===fis)out.push({t0:pos,de:s.de,lung:s.lung,pista:pi});pos+=s.lung})})});return out}
function cat(e,fis,de,pana,pista){ /* cât (0…1) din bucata [de,pana] a fișierului e pe linia de timp (măcar o dată) */
  const P=plasari(e,fis,pista);const I=P.map(s=>[Math.max(de,s.de),Math.min(pana,s.de+s.lung)]).filter(x=>x[1]>x[0]).sort((a,b)=>a[0]-b[0]);
  let tot=0,cur=de;I.forEach(([a,b])=>{if(b>cur){tot+=b-Math.max(a,cur);cur=b}});return pana>de?tot/(pana-de):0}
function deCateOri(e,fis,de,pana,pista){ /* de câte ori apare ÎNTREAGĂ bucata [de,pana] (cu o toleranță de 0,15 s la capete) */
  return plasari(e,fis,pista).filter(s=>s.de<=de+0.15&&s.de+s.lung>=pana-0.15).length}
function undeEste(e,fis,de,pista){ /* momentele (pe linia de timp) la care se aude secunda „de” a fișierului */
  return plasari(e,fis,pista).filter(s=>de>=s.de-0.05&&de<=s.de+s.lung+0.05).map(s=>s.t0+(de-s.de))}
const acopera=(I,a,b)=>{if(b<=a)return 0;const L=I.map(x=>[Math.max(a,x[0]),Math.min(b,x[1])]).filter(x=>x[1]>x[0]).sort((x,y)=>x[0]-y[0]);let tot=0,cur=a;L.forEach(([x,y])=>{if(y>cur){tot+=y-Math.max(x,cur);cur=y}});return tot/(b-a)};
const evm=(e,t)=>e.jurnal().filter(z=>z.tip===t);
/* ---------- verificările testelor: (e, parametru) => true/false ---------- */
const VERIFICARI={
  /* selecția: {pista?, de:[min,max], pana:[min,max]} */
  selectie:(e,p)=>{const s=e.stare().sel;return !!s&&s.pista===(p.pista||0)&&s.a>=p.de[0]&&s.a<=p.de[1]&&s.b>=p.pana[0]&&s.b<=p.pana[1]},
  /* ai ascultat cel puțin 80% din intervalul [t1,t2] al liniei de timp (oricând) */
  ascultatZona:(e,[a,b])=>{const al=e.al();return !!al&&acopera(al.auzit(),a,b)>=0.8},
  /* bucata [de,pana] a fișierului NU mai e pe pistă (cel mult 10% din ea) */
  scos:(e,p)=>cat(e,p.fis,p.de,p.pana,p.pista==null?0:p.pista)<=0.1,
  /* bucățile date ale fișierului sunt TOATE pe pistă (vorbirea n-a fost tăiată): {fis, intervale:[[a,b],…], pista?} */
  pastrat:(e,p)=>p.intervale.every(([a,b])=>cat(e,p.fis,a,b,p.pista==null?0:p.pista)>=(p.prag||0.95)),
  /* pista nu are goluri între clipuri (de la primul la ultimul): {pista?} */
  faraGol:(e,p)=>{const L=(e.piste()[(p&&p.pista)||0]||{clipuri:[]}).clipuri.filter(c=>!(p&&p.faraLipite&&/^p\d/.test(c.id))).sort((a,b)=>a.start-b.start);if(!L.length)return false;
    for(let i=1;i<L.length;i++)if(L[i].start-capat(L[i-1])>0.05)return false;return true},
  /* bucata [de,pana] a fișierului apare de cel puțin `ori` ori: {fis,de,pana,ori?,pista?} */
  copiat:(e,p)=>deCateOri(e,p.fis,p.de,p.pana,p.pista)>=(p.ori||2),
  /* o copie a bucății începe după momentul `dupa` (de pe linia de timp): {fis,de,pana,dupa} */
  copieDupa:(e,p)=>plasari(e,p.fis,p.pista).some(s=>s.de<=p.de+0.15&&s.de+s.lung>=p.pana-0.15&&s.t0+(p.de-s.de)>=p.dupa-0.1),
  /* secunda `de` a fișierului se aude la un moment din [min,max]: {fis,de,la:[min,max],pista?} */
  laMoment:(e,p)=>undeEste(e,p.fis,p.de,p.pista).some(t=>t>=p.la[0]&&t<=p.la[1]),
  /* durata totală a pistei e între min și max: {pista?, min, max} */
  durataPistei:(e,p)=>{const L=(e.piste()[p.pista||0]||{clipuri:[]}).clipuri;const d=L.length?Math.max(...L.map(capat)):0;return d>=p.min&&d<=p.max},
  /* o pistă cu numele fișierului importat */
  importat:(e,n)=>e.piste().some(p=>p.nume.toLowerCase()===String(n).replace(/\.(wav|mp3|ogg)$/i,'').toLowerCase())&&evm(e,'importa').length>0,
  /* mixul: vocea cu cel puțin min dB peste muzică, dar muzica tot se aude (cel mult max dB sub): {min,max} */
  mixBun:(e,p)=>{const d=e.diferentaMix();return d!=null&&d>=(p.min==null?10:p.min)&&d<=(p.max==null?30:p.max)},
  /* volumul unei piste a fost coborât: {pista, sub} (dB) */
  volumSub:(e,p)=>{const v=e.stare().volume[p.pista];return v!=null&&v<=p.sub},
  /* ai ascultat împreună (voce + muzică) cel puțin `sec` secunde, DUPĂ ultima schimbare de volum */
  ascultatImpreuna:(e,sec)=>{const P=e.piste();if(P.length<2)return false;const I=e.auzitDupaVolum();
    const ambele=(t)=>P.filter(p=>p.clipuri.some(c=>t>=c.start&&t<capat(c))).length>=2;let tot=0;I.forEach(([a,b])=>{for(let t=a;t<b;t+=0.1)if(ambele(t))tot+=0.1});return tot>=sec-0.05},
  /* ai mutat un clip: {pista?, fis, de, start:[min,max]} = secunda `de` a fișierului e acum la un moment din start */
  mutat:(e,p)=>evm(e,'mutaClip').length>0&&undeEste(e,p.fis,p.de,p.pista).some(t=>t>=p.start[0]&&t<=p.start[1]),
  /* nu ai ales nimic în fereastra „Alege comportamentul…” (calculatorul rămâne cum era) */
  nimicAles:e=>evm(e,'comportamentAles').length===0,
  anulat:(e,et)=>evm(e,'anuleaza').some(z=>!et||z.eticheta===et),
  refacut:(e,et)=>evm(e,'reface').some(z=>!et||z.eticheta===et),
  piste:(e,n)=>e.piste().length===n,
  /* ai salvat proiectul DUPĂ ultima editare (Fișier › Salvează / Ctrl+S) */
  salvatDupaEditari:e=>{const J=e.jurnal(),ed=['sterge','decupeaza','lipeste','mutaClip','volum','importa','anuleaza','reface'];
    const u=J.map(z=>z.tip).reduce((m,t,i)=>ed.includes(t)?i:m,-1);return u>=0&&J.some((z,i)=>i>u&&z.tip==='ap_salvat')},
  folositEd:(e,t)=>evm(e,t).length>0
};
function verifica(e,T){for(const k of Object.keys(T)){if(k==='ce'||k==='cum')continue;
  if(VERIFICARI[k])return !!VERIFICARI[k](e,T[k]);
  if(AudioProiect.verificari[k])return !!AudioProiect.verificari[k](e.ap(),T[k]);
  const al=e.al();if(al&&AudioLinie.verificari[k])return !!AudioLinie.verificari[k](al,T[k]);}return false}

/* ---------- tipul pentru motor: {t:'audioeditare', …} ---------- */
const TipAudioEditare={
  render(Q,body,api){
    stil();
    body.innerHTML=`<div class="ae-loc"></div>${(Q.teste||[]).length?`<div class="ae-teste"><b>Testele</b> <span class="hint">· se bifează singure, pe măsură ce lucrezi</span><ol>${Q.teste.map((t,i)=>`<li data-i="${i}"><span class="s">○</span><span>${t.ce}<span class="m"></span></span></li>`).join('')}</ol></div>`:''}`;
    const e=creeaza(body.querySelector('.ae-loc'),Q);body._ae=e;
    const T=Q.teste||[];
    function marcheaza(arata){let ok=0;T.forEach((t,i)=>{const li=body.querySelector(`.ae-teste li[data-i="${i}"]`),b=verifica(e,t);if(b)ok++;
      if(!li)return;li.classList.toggle('ok',b);li.classList.toggle('rau',!b&&arata);li.querySelector('.s').textContent=b?'✓':arata?'✗':'○';li.querySelector('.m').innerHTML=!b&&arata&&t.cum?t.cum:''});return ok}
    e.on(()=>marcheaza(false));
    let al0=null;const lega=()=>{const a=e.al();if(a&&a!==al0){al0=a;a.on(()=>marcheaza(false))}};e.on(lega);e.ap().on(lega);lega();
    const nav=api.checkButton(()=>{
      const ok=marcheaza(true);e.focus();
      if(ok===T.length){nav.innerHTML='';api.resolve(true)}
      else{const p=T.find(t=>!verifica(e,t));api.resolve(false,`${ok} din ${T.length} teste trecute. ${p&&p.cum?p.cum:''}`);
        api.revealButton(()=>{e.reset();e.simuleaza(Q.solutie||[]);marcheaza(true);nav.innerHTML='';api.giveUp(Q.raspuns||'testele sunt acum bifate: uită-te pe piste ce s-a făcut.')})}
    },Q.verifica||'Verifică');
    marcheaza(false);
  },
  rezolva(Q,body){const e=body._ae;e.reset();e.simuleaza(Q.solutie||[]);return true},
  gresit(Q,body){const e=body._ae;e.reset();e.simuleaza(Q.gresit||[]);return true}
};
window.AudioEditare={versiune:VERS,creeaza,verificari:VERIFICARI,verifica,plasari,cat,deCateOri,undeEste,nivelUnda,ETICHETE};
window.TipAudioEditare=TipAudioEditare;
})();
