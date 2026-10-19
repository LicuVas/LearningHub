/* Simulatorul „video-clipchamp-text” pentru lecțiile LearningHub — fișier comun (lectii/_sim/video-clipchamp-text.js).
   PROPRIETAR: autorul lecției VII · M2 · nr. 15 („Generice: suprapunerea textului peste scene”), creat 12.10.2026.
   EXTINDE lectii/_sim/video-clipchamp.js (proprietar VII/14) fără să-l schimbe: folosește doar API-ul lui public
   (VideoClipchamp.creeaza, v.adaugaFila, v.schimba, v.laPrevizualizare, v.laProprietati, v.alege, v.cadru, v.on, v.simuleaza,
   v.nouId, VideoClipchamp.verificari). Se încarcă DUPĂ el:
     <script src="../../_sim/video-clipchamp.js"></script><script src="../../_sim/video-clipchamp-text.js"></script>
     JocMotor.porneste({ …, tipuri:{videoclipchamptext:TipVideoClipchampText} })

   CE ADAUGĂ (editorul video Clipchamp din Windows 11, doar ce trebuie lecției 15):
     fila „Text” în bara din stânga, cu „Text simplu” și un stil, „Casetă text” (butonul verde + sau tragerea pe linia de timp);
     clipul text pe pista Text, deasupra scenelor (mutare, mânere, alegere, Delete, ↶ — le face deja simulatorul lecției 14);
     panoul de proprietăți al textului: câmpul de text (Enter = rând nou), Dimensiune, Culoare, Culoare de fundal, Poziție
     (Sus / Mijloc / Jos); textul desenat peste previzualizare, cu culoarea, mărimea și locul lui, tras cu mouse-ul sau cu
     degetul; rândul „Text pe ecran”; fereastra „Exportați videoclipul” (Calitate, Numele fișierului, .mp4, Exportați, bara
     de progres); sub fereastră (în afara lui Clipchamp) butonul „Privește ca de departe” (previzualizarea micșorată).

   FIDELITATE — D = DOCUMENTAT (documentația oficială Microsoft / blogul Clipchamp; citatele: lectii/vii/m2-l15/_proba/docs/
   citate_text.md), C = VĂZUT în capturile Clipchamp în română din jocul jocuri/audio-video-vii (clipchamp-text.webp,
   clipchamp-export.webp), P = PRESUPUS:
     - D  fila Text din bara de instrumente; textul se pune cu butonul de adăugare la cronologie sau trăgându-l pe linia de timp,
          DEASUPRA videoclipului; textul se schimbă în fila Text a panoului de proprietăți, în câmpul de text; acolo sunt și
          fontul, dimensiunea, alinierea, culoarea și culoarea de fundal („pentru unele opțiuni de text”);
     - D  durata textului: clic pe el (se evidențiază), apoi barele de ajustare spre interior = mai scurt, spre exterior = mai
          lung; ștergerea: clic pe text, apoi Delete (sau clic dreapta › ștergere); ↶ / ↷ anulează / refac;
     - D  poziția: tras liber pe previzualizare („stage”) sau presetări (sus, mijloc, jos; stânga, centru, dreapta);
     - D  mai multe rânduri: Enter în câmpul de text; un text pus pe un loc gol al liniei de timp apare pe fundal negru;
     - D  un alt stil tras PESTE un text de pe linia de timp îl înlocuiește;
     - D  exportul: butonul Export(ați) din dreapta sus, alegi calitatea, iese un fișier MP4; după export, de obicei în
          Descărcări (cont personal); cu contul de școală, în OneDrive (folderul Exports); proiectul rămâne;
     - C  panoul „Text”: „Text simplu” (miniatura neagră cu „Text”), „Stiluri de text”, „Casetă text”; textul alb, centrat,
          mărimea 36, fontul DM Sans; fereastra „Exportați videoclipul”: „Calitate” (4k „Videoclipul nu are conținut media
          4K”, 1080 p „Calitate înaltă” — aleasă, 720 p „Fișier mai mic, export mai rapid”), „Mai multe opțiuni”, „Numele
          fișierului” + „.mp4”, comutatorul „Store in the cloud” (oprit), butonul „Exportați”;
     - P  textul nou nu rămâne ales (clic pe el = panoul lui);
     - P  conținutul unui text nou („Text”), durata lui (5 s), locul lui la „+” (la capul de redare; dacă acolo e alt text,
          după el — în Clipchamp ar urca pe o pistă nouă), stilul păstrat la înlocuire, numele RO ale presetărilor de poziție
          (Sus / Mijloc / Jos — lângă ele numele EN), cele 6 culori (în Clipchamp e un selector cu orice culoare), fundalurile,
          lista Dimensiune; scara literelor (36 ≈ o zecime din înălțimea cadrului, după captură); numele implicit al fișierului
          la export (= numele proiectului; în captură „Video Project 1”), 4k neales, progresul (≈ 1,5 s), mesajul de la final.
   ABATERI SPUSE PE ECRAN (de la 1.1 chiar pe ecran, nu doar aici): Clipchamp are mult mai multe stiluri de text (aici două:
     nota din fila Text); butonul + al miniaturii poate apărea în Clipchamp doar cu mouse-ul deasupra (nota din fila Text);
     deasupra textului din previzualizare, Clipchamp are și un mic meniu (creion, culoare, font, mărime), iar culoarea se alege
     dintr-o paletă cu multe culori — aici totul e în panoul din dreapta, cu 6 culori (nota de sub „Culoare”); „Culoare de fundal”
     o au în Clipchamp doar unele texte (nota de sub ea); „Mai multe opțiuni” nu se deschide; exportul nu face niciun fișier în
     pagină; „Privește ca de departe” NU e în Clipchamp (nota de lângă buton).
   1.1 (12.10.2026, reparația J1 a lecției 15; COMPATIBIL ÎNAPOI: API, verificările vechi, acțiunile din simuleaza, forma lui
     start.text neschimbate): verificări NOI textRanduri, textDeDouaOri, muzicaIntreaga, textCuloareEste, textPozEste,
     textFaraSuprapunere (mai jos, la „Verificări noi”); notele de pe ecran de mai sus; butonul „Privește ca de la 3 pași” se
     cheamă „Privește ca de departe” (data-vct-departe neschimbat); pe un clip de TEXT îngust, ales, mânerele se suprapun: se ia
     mânerul cel mai apropiat de punctul atins (înainte câștiga mereu cel din dreapta); v.text.catalog(); clicul-fantomă de
     după o atingere care deschide panoul (linia de timp coboară sub deget) nu mai ajunge la elementul ajuns sub deget
     (lectii/vii/m2-l15/_proba/j1_atingere_text.py, cu --mutant). Probat pe video-clipchamp.js sha1 d73dbb25… (1.1).
   CITEȚ (verificarea „textCitet”, regula lecției, nu a lui Clipchamp): contrastul (WCAG 2.x, text mare: cel puțin 3:1) dintre
     culoarea textului și imaginea de SUB el, socotit pe imaginea reală — catalogul dă pentru fiecare scenă `lum`: 8 rânduri ×
     4 coloane de [luminanță medie, a 10-a, a 90-a percentilă] (lectii/vii/m2-l15/_proba/lum_scene.py); se ia celula de sub
     text cu luminanța medie cea mai nepotrivită (cea mai deschisă pentru un text deschis, cea mai închisă pentru unul închis),
     pe toate scenele peste care stă textul (negru pe locurile goale); cu fundal, contrastul text / fundal; plus mărimea cerută.

   API (pentru lecții și probe): const v = VideoClipchampText.creeaza(el, {catalog, start, sunet?, export?})
     = obiectul lui VideoClipchamp.creeaza (toate funcțiile lui) + v.text:
       v.text.stil(clip) → {stil, culoare, marime, fundal, x, y}   v.text.lista() → textele cu stilul lor
       v.text.contrast(clip) → cel mai mic raport de contrast sub text   v.text.cuvinte(s)
       v.text.exporturi() → [{calitate, nume, nor, jl, durata}]   v.text.deschideExport()   v.text.departe(bool)
       v.text.on(fn) (fn(stare, ev) la export / „de departe”; plus evenimentul DOM 'videoclipchamptext' pe v.radacina)
     start.text: [{text, start, durata, culoare?, marime?, poz?:'sus'|'mijloc'|'jos', x?, y?, fundal?, stil?}]
     v.simuleaza([…]) primește în plus: {textNou:['simplu'|'caseta', secunda?]} {textScrie:[i, 'text']} {textMuta:[i, sec]}
       {textCapat:[i, sec]} {textCuloare:[i, 'alb'|'#hex']} {textMarime:[i, n]} {textPoz:[i, 'sus'|'mijloc'|'jos']}
       {textXY:[i, x, y]} {textFundal:[i, 'negru'|'alb'|null]} {textAlege:i} {textSterge:i} {textPeste:[i, 'caseta']}
       {exporta:{calitate?, nume?, nor?}} {departe:true|false}   (i = al câtelea text din v.proiect().text, de la 0)
     Verificări noi (VideoClipchamp.verificari): textScris (textul exact, fără diacritice / litere mari), textContine
       ([bucăți]), textLa ({text|contine, de:[a,b]}: începutul), textPanaLa ({…, de:[a,b]}: capătul), textDurataMin
       ({…, min}), textCitet ({…, marimeMin}), textMarime ({…, min}), textDupaFilm ({…}: începe după ultima scenă), nrTexte (n),
       muzicaPanaLaFinal ('m.wav': muzica se termină odată cu filmul, textele incluse), exportat ({calitate?, nume?,
       numeSfarsit?, oriceMomentul?}: ultimul export, făcut DUPĂ ultima schimbare, dacă nu spui oriceMomentul:true).
     NOI în 1.1: textRanduri ({text|contine, min}: cel puțin min rânduri nevide, adică Enter între ele), textDeDouaOri
       ({text|contine}: stă cel puțin cuvinte × 2 : 3 secunde, regula lecției 15, cu 0,2 s îngăduință), muzicaIntreaga
       ('m.wav': clipul muzicii merge până la capătul FIȘIERULUI, ±0,3 s), textCuloareEste ({text|contine, culoare:'galben'|
       '#hex'}), textPozEste ({text|contine, poz:'sus'|'mijloc'|'jos'}: locul presetării, ±0,02), textFaraSuprapunere ({min?}:
       sunt cel puțin min texte și niciunul nu stă pe ecran în același timp cu altul, peste 0,05 s).
   PROBE: lectii/vii/m2-l15/_proba/sim_text_proba.py (API, 1280 + 390 px) și _proba/proba_gesturi.py (lecția întreagă,
     gesturi reale). Ultima linie a fiecăreia: 0. NU schimba numele verificărilor de mai sus: lecția 15 se sprijină pe ele. */
(function(){
'use strict';
if(!window.VideoClipchamp){console.error('video-clipchamp-text.js: încarcă întâi video-clipchamp.js');return}
const VC=window.VideoClipchamp;
const VERS='1.1 (12.10.2026, reparația J1)';
const DUR_TEXT=5;                    // P
const MARIME0=36;                    // C (captura: 36)
const MARIMI=[12,16,20,24,28,32,36,40,48,56,64,72,80,96];
const CULORI=[{nume:'alb',hex:'#FFFFFF'},{nume:'negru',hex:'#000000'},{nume:'galben',hex:'#FFD400'},{nume:'gri',hex:'#9AA0A6'},{nume:'albastru',hex:'#1E5BD8'},{nume:'roșu',hex:'#E02020'}];
const FUNDALURI=[{nume:'Fără',en:'None',hex:null},{nume:'negru',hex:'#000000'},{nume:'alb',hex:'#FFFFFF'}];
const POZ={sus:{y:.15,eti:'Sus',en:'Top'},mijloc:{y:.5,eti:'Mijloc',en:'Middle'},jos:{y:.85,eti:'Jos',en:'Bottom'}};
const STILURI=[{id:'simplu',nume:'Text simplu',fundal:null},{id:'caseta',nume:'Casetă text',fundal:'#000000'}];
const TEXT_NOU='Text';               // P (miniatura „Text simplu”)
const PRAG=3;                        // contrastul minim (WCAG, text mare)
const SCARA=380;                     // P: litera = înălțimea cadrului × mărime / 380 (36 ≈ 9,5 %, ca în captură)
const SCHIMBARI=['nou','adauga','muta','durata','gol','tranzitie','tranzitieDurata','tranzitieScoasa','sterge','volum','scurtat','anuleaza','reface','schimbare','durataText'];   // aceleași ca în video-clipchamp.js

const CSS=`
.vct-lista{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
.vc.ingust .vct-lista{grid-template-columns:repeat(3,minmax(0,1fr))}
.vct-tile{position:relative;border:2px solid transparent;border-radius:8px;background:#f2f2f6;padding:3px;cursor:grab;touch-action:none;min-height:40px}
.vct-tile:focus-visible{outline:3px solid #7aa7ff}
.vct-tile .mini{display:flex;align-items:center;justify-content:center;aspect-ratio:16/9;border-radius:5px;background:#000;color:#fff;font:700 15px/1 "DM Sans","Segoe UI",system-ui,sans-serif;pointer-events:none}
.vct-tile .mini.caseta{background:repeating-conic-gradient(#d9d9de 0 25%,#fff 0 50%) 0 0/12px 12px}
.vct-tile .mini.caseta b{background:#000;color:#fff;padding:2px 6px;font-size:12px}
.vct-tile .et{display:block;font-size:.66rem;line-height:1.15;margin-top:2px;color:var(--vc-ink2)}
.vct-nota{font-size:.7rem;color:var(--vc-ink2);margin:8px 0 0}
.vct-camp{display:block;width:100%;box-sizing:border-box;font:inherit;min-height:64px;border:1px solid var(--vc-line);border-radius:6px;padding:4px 6px;resize:vertical;user-select:text;-webkit-user-select:text}
.vct-mic{font-size:.72rem;color:var(--vc-ink2);margin-top:2px}
.vc-prop select.vct-sel{min-height:34px;min-width:72px;font:inherit;border:1px solid var(--vc-line);border-radius:6px;padding:2px 4px;background:#fff}
.vct-ops{display:flex;flex-wrap:wrap;gap:4px}
.vct-op{display:inline-flex;align-items:center;gap:5px;min-height:32px;min-width:32px;border:1px solid var(--vc-line);background:#fff;border-radius:6px;padding:2px 8px;cursor:pointer;font-size:.76rem}
.vct-op.on{border-color:var(--vc-acc);box-shadow:0 0 0 2px var(--vc-acc2);font-weight:700}
.vct-op i{display:inline-block;width:14px;height:14px;border-radius:50%;border:1px solid #777;flex:none}
.vc-ecran .strat .vct-txt{position:absolute;transform:translate(-50%,-50%);max-width:92%;box-sizing:border-box;text-align:center;font-weight:700;line-height:1.15;white-space:pre-wrap;padding:.06em .3em;border-radius:3px;pointer-events:auto;cursor:move;touch-action:none;font-family:"DM Sans","Segoe UI",system-ui,sans-serif;overflow-wrap:anywhere}
.vc-ecran .strat .vct-txt.ales{outline:2px solid #7b3fe4;outline-offset:2px}
.vct-acum{font-size:.8rem;background:#fff;border:1px solid var(--vc-line);border-radius:6px;padding:4px 8px}
.vc.vct-departe .vc-ecran{width:30%;margin:0 auto}
.vct-fantoma{position:fixed;z-index:9999;pointer-events:none;opacity:.88;border-radius:8px;background:#fff;border:2px solid #7b3fe4;padding:4px 8px;font-size:.8rem;box-shadow:0 4px 12px rgba(0,0,0,.25);transform:translate(-50%,-120%)}
.vc-pista.t.tinta{background:#efe7ff}
.vc.vct .vc-pista.t{height:56px}
.vc.vct .vc-pista.a{height:54px}
.vc.vct .vc-pista.t .vc-clip{white-space:nowrap;overflow:hidden;line-height:1.25}
.vct-exp{position:absolute;inset:0;background:rgba(20,20,30,.38);display:flex;align-items:flex-start;justify-content:center;z-index:25;padding:10px 8px;overflow:auto}
.vct-exp .w{background:#fff;border-radius:10px;width:min(620px,100%);box-shadow:0 10px 30px rgba(0,0,0,.35)}
.vct-exp .tt{display:flex;justify-content:space-between;align-items:center;padding:10px 12px 8px;font-size:1.05rem}
.vct-exp .cp{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
.vct-exp .st{background:#f7f6fb;padding:10px 12px;border-radius:0 0 0 10px}
.vct-exp .dr{padding:10px 12px;display:flex;flex-direction:column;gap:10px}
.vct-exp .h{font-weight:600;margin:0 0 4px}
.vct-exp .o{display:flex;gap:8px;align-items:flex-start;padding:6px;border-radius:6px;min-height:32px;cursor:pointer}
.vct-exp .o input{width:18px;height:18px;margin:2px 0 0;accent-color:var(--vc-acc)}
.vct-exp .o small{display:block;color:var(--vc-ink2);font-size:.75rem}
.vct-exp .o.dez{opacity:.55;cursor:default}
.vct-exp .pr{color:#b7791f;font-size:.8rem}
.vct-exp .nf{display:flex;align-items:center;border:1px solid var(--vc-line);border-radius:6px;padding:0 8px;background:#fff}
.vct-exp .nf input{flex:1;border:0;font:inherit;min-height:36px;min-width:0;outline:none;background:transparent;user-select:text;-webkit-user-select:text}
.vct-exp .nf span{color:var(--vc-ink2)}
.vct-exp .sw{display:flex;align-items:center;gap:8px;min-height:32px;font-size:.85rem;cursor:pointer}
.vct-exp .sw input{width:18px;height:18px;accent-color:var(--vc-acc)}
.vct-exp .lk{background:none;border:0;color:var(--vc-acc);font-weight:600;cursor:pointer;min-height:32px;padding:0;margin-top:4px}
.vct-exp .jos{padding:10px 12px;border-top:1px solid var(--vc-line)}
.vct-exp .bar{height:10px;background:#ececf2;border-radius:5px;overflow:hidden;margin:6px 0}
.vct-exp .bar i{display:block;height:100%;background:var(--vc-acc)}
.vct-exp .msg{font-size:.85rem;background:#fff7d6;border:1px solid #f1d27a;border-radius:6px;padding:6px 8px;margin-top:6px}
.vc.ingust .vct-exp .cp{grid-template-columns:minmax(0,1fr)}
.vc.ingust .vct-exp .st{border-radius:0}
.vct-sub{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:6px}
.vct-sub .hint{font-size:.85rem}
`;
const CSS_T=`.vc-teste{margin-top:10px;border:1px solid var(--line,#ccc);border-radius:8px;padding:10px 12px;background:var(--paper2,#f5f5f5)}
.vc-teste ol{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:4px}
.vc-teste li{display:flex;gap:8px;align-items:flex-start;font-size:.93rem;line-height:1.35}
.vc-teste li .s{flex:none;width:1.4em;text-align:center;font-weight:800}
.vc-teste li.ok .s{color:var(--ok,#1b7a4a)}.vc-teste li.rau .s{color:var(--bad,#b42318)}
.vc-teste li .m{display:block;font-size:.85rem;color:var(--bad,#b42318)}`;   // aceeași ca în video-clipchamp.js (lista testelor)
function stil(){if(!document.getElementById('sim-video-clipchamp-text-css')){const s=document.createElement('style');s.id='sim-video-clipchamp-text-css';s.textContent=CSS;document.head.appendChild(s)}
  if(!document.getElementById('sim-video-clipchamp-teste-css')){const s=document.createElement('style');s.id='sim-video-clipchamp-teste-css';s.textContent=CSS_T;document.head.appendChild(s)}}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const cl=(x,a,b)=>Math.max(a,Math.min(b,x));
const r3=x=>Math.round(x*1000)/1000;
const norm=s=>String(s==null?'':s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[„”“"«»]/g,'').replace(/\s+/g,' ').trim().replace(/[.!]+$/,'');
function lumHex(h){h=String(h||'#000').replace('#','');const c=[0,2,4].map(i=>parseInt(h.substr(i,2),16)/255).map(x=>x<=0.04045?x/12.92:Math.pow((x+0.055)/1.055,2.4));return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]}
const raport=(a,b)=>(Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
const cuvinte=s=>String(s||'').split(/\s+/).filter(w=>/[0-9A-Za-zÀ-ɏ]/.test(w)).length;
const culoareHex=x=>{if(x==null)return null;const c=CULORI.concat(FUNDALURI).find(o=>o.nume===x);return c?c.hex:x};
const numeCuloare=h=>{const c=CULORI.find(o=>o.hex.toLowerCase()===String(h).toLowerCase());return c?c.nume:h};
function curataStil(o){const s={};if(o.stil)s.stil=o.stil;if(o.culoare)s.culoare=culoareHex(o.culoare);if(o.marime)s.marime=o.marime;
  if('fundal' in o)s.fundal=culoareHex(o.fundal);if(o.poz&&POZ[o.poz]){s.y=POZ[o.poz].y;s.x=.5}if(o.x!=null)s.x=o.x;if(o.y!=null)s.y=o.y;return s}

/* ---------------- creeaza ---------------- */
function creeaza(el,O){
  O=O||{};stil();
  const st=O.start||{};const CAT=O.catalog||{};
  const v=VC.creeaza(el,O);
  const R=v.radacina;R.classList.add('vct');
  const nV=(st.video||[]).length,nA=(st.audio||[]).length;
  const STIL0={};(st.text||[]).forEach((o,i)=>{STIL0['t'+(nV+nA+i+1)]=curataStil(o)});   // id-urile date de init() (video, audio, apoi text)
  let EXP=null,EXPORTURI=[],previz=null,departe=false,asc=[],tragT=null;
  const stilDe=c=>Object.assign({stil:'simplu',culoare:'#FFFFFF',marime:MARIME0,fundal:null,x:.5,y:.5},STIL0[c.id]||{},c.st||{});
  function emit2(ev){asc.forEach(f=>{try{f(v.stare(),ev)}catch(e){console.error(e)}});R.dispatchEvent(new CustomEvent('videoclipchamptext',{detail:ev}))}
  const textId=id=>v.proiect().text.find(c=>c.id===id);
  function puneStil(id,ch){v.schimba(P=>{const c=P.text.find(x=>x.id===id);if(c)c.st=Object.assign(stilDe(c),ch)})}
  function adaugaText(stilId,t){
    const S=STILURI.find(s=>s.id===stilId)||STILURI[0];let id=null,mutat=false;
    v.schimba(P=>{
      let s=Math.max(0,Math.round((t==null?v.stare().p:t)*10)/10);
      P.text.slice().sort((a,b)=>a.start-b.start).forEach(c=>{if(s<c.start+c.durata-0.02&&s+DUR_TEXT>c.start+0.02){s=r3(c.start+c.durata);mutat=true}});
      id=v.nouId('t');P.text.push({id,text:TEXT_NOU,start:s,durata:DUR_TEXT,st:{stil:S.id,culoare:'#FFFFFF',marime:MARIME0,fundal:S.fundal,x:.5,y:.5}});
    });
    v.alege(null);   // P: textul nou nu rămâne ales (fără mânere), deci se poate trage de oriunde; clic pe el = panoul lui
    if(mutat)v.mesaj('Acolo era deja un text: noul text s-a pus pe pista Text, după el. (În Clipchamp ar urca pe o pistă nouă, deasupra.)');
    return id;
  }
  function inlocuieste(id,stilId){const S=STILURI.find(s=>s.id===stilId)||STILURI[0];puneStil(id,{stil:S.id,fundal:S.fundal});v.alege({tip:'text',id})}
  function scrie(id,txt){v.schimba(P=>{const c=P.text.find(x=>x.id===id);if(c)c.text=txt})}
  function contrast(c){
    const s=stilDe(c);if(s.fundal)return raport(lumHex(s.culoare),lumHex(s.fundal));
    const Lt=lumHex(s.culoare);const rand=String(c.text||'').split('\n');
    const hF=Math.min(.95,rand.length*s.marime/SCARA*1.15),wF=Math.min(.92,Math.max(...rand.map(r=>r.length),1)*0.55*s.marime/SCARA*9/16);
    const r0=cl(Math.floor((s.y-hF/2)*8),0,7),r1=cl(Math.ceil((s.y+hF/2)*8)-1,0,7),c0=cl(Math.floor((s.x-wF/2)*4),0,3),c1=cl(Math.ceil((s.x+wF/2)*4)-1,0,3);
    const fonduri=new Set();for(let t=c.start;t<c.start+c.durata-1e-6;t+=0.25){const F=v.cadru(t+1e-3);if(F.negru)fonduri.add('');else{if(F.a)fonduri.add(F.a);if(F.b)fonduri.add(F.b)}}
    let min=Infinity;
    fonduri.forEach(n=>{
      if(!n){min=Math.min(min,raport(Lt,0));return}
      const G=(CAT[n]||{}).lum;if(!G)return;const cel=[];for(let r=r0;r<=r1;r++)for(let k=c0;k<=c1;k++)cel.push(G[r][k]);
      const med=cel.reduce((a,x)=>a+x[0],0)/cel.length;
      const bg=Lt>=med?Math.max(...cel.map(x=>x[0])):Math.min(...cel.map(x=>x[0]));min=Math.min(min,raport(Lt,bg))});   // celula cea mai nepotrivită (luminanța ei medie)
    return min===Infinity?null:Math.round(min*100)/100;
  }
  /* ---- fila Text ---- */
  const tile=S=>`<div class="vct-tile" data-vct-stil="${S.id}" role="button" tabindex="0" title="${esc(S.nume)}: trage-l pe linia de timp sau apasă +"><span class="mini ${S.id}">${S.id==='caseta'?'<b>Text</b>':'Text'}</span><span class="et">${esc(S.nume)}</span><button type="button" class="vc-plus" data-vct-plus="${S.id}" aria-label="Adaugă la cronologie: ${esc(S.nume)}" title="Adaugă la cronologie">+</button></div>`;
  v.adaugaFila({id:'text',eticheta:'Text',simbol:'T',deschide(pn){
    pn.innerHTML=`<h4>Text</h4><div class="vc-gr">Text simplu</div><div class="vct-lista">${tile(STILURI[0])}</div><div class="vc-gr">Stiluri de text</div><div class="vct-lista">${tile(STILURI[1])}</div><p class="vct-nota">În Clipchamp sunt mult mai multe stiluri de text; aici sunt două. Acolo, butonul + poate apărea doar când ții mouse-ul pe miniatură.</p>`;
    pn.querySelectorAll('[data-vct-plus]').forEach(b=>b.onclick=e=>{e.stopPropagation();adaugaText(b.dataset.vctPlus);v.focus()});   // focusul înapoi pe simulator: Ctrl+Z, Space, Delete merg imediat
    pn.querySelectorAll('.vct-tile').forEach(t=>{
      t.onkeydown=e=>{if(e.target!==t)return;if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();adaugaText(t.dataset.vctStil)}};
      t.addEventListener('pointerdown',e=>{if(e.target.closest('[data-vct-plus]'))return;tragT={stil:t.dataset.vctStil,x0:e.clientX,y0:e.clientY,pornit:false};e.preventDefault()});
    });
  }});
  /* P: textul lăsat pe linia de timp se lipește (ca în simulatorul lecției 14) de marginile clipurilor, de 0:00 și de capul
     de redare, la mai puțin de 14 px pe ecran */
  function magnet(t){const P=v.proiect();const pct=[0,v.stare().p];[P.video,P.audio,P.text].forEach(L=>L.forEach(c=>pct.push(c.start,c.start+c.durata)));
    let best=t,bd=Math.max(0.12,14/(R._k||20));pct.forEach(x=>{const d=Math.abs(x-t);if(d<bd){bd=d;best=x}});return r3(best)}
  function pistaSub(x,y){for(const e of document.elementsFromPoint(x,y)){if(!R.contains(e))continue;const c=e.closest('.vc-pista.t .vc-clip');if(c)return {clip:c.dataset.clip};if(e.closest('.vc-pista,.vc-rigla'))return {linie:true}}return null}
  function laTimp(x){const inn=R.querySelector('.vc-in');const r=inn.getBoundingClientRect();return (x-r.left-R._X0)/R._k}
  function fantoma(txt,x,y){let f=document.querySelector('.vct-fantoma');if(!f){f=document.createElement('div');f.className='vct-fantoma';document.body.appendChild(f)}f.textContent=txt;f.style.left=x+'px';f.style.top=y+'px'}
  function farFantoma(){const f=document.querySelector('.vct-fantoma');if(f)f.remove();R.querySelectorAll('.vc-pista.t.tinta').forEach(p=>p.classList.remove('tinta'))}
  /* ---- mânerele unui clip de TEXT îngust (1.1, m13 al judecății 1): cele două mânere (32 px fiecare) se suprapun, iar cel
     din dreapta, desenat ultimul, primea mereu atingerea. Acum se ia mânerul cel mai apropiat de punctul atins: schimbăm doar
     atributul data-man citit de simulatorul de bază la apăsare (se redesenează oricum după tragere). Clipurile video / audio
     rămân ale lui video-clipchamp.js. ---- */
  R.addEventListener('pointerdown',e=>{const m=e.target.closest&&e.target.closest('.vc-man');if(!m||window.__faraManerApropiat)return;   // __faraManerApropiat: doar pentru mutantul probei
    const k=m.closest('.vc-clip[data-p="text"]');if(!k||!R.contains(k))return;const r=k.getBoundingClientRect();if(r.width>=64)return;
    const vrea=e.clientX<r.left+r.width/2?'st':'dr';if(m.dataset.man!==vrea)m.dataset.man=vrea},true);
  /* ---- clicul-fantomă de după o atingere (1.1; cererea dirijorului după judecata 3 a lecției 14): pe telefon, atingerea
     care ALEGE un clip deschide panoul de proprietăți DEASUPRA liniei de timp; linia coboară, iar clicul pe care browserul îl
     trimite după atingere cade pe ce a ajuns sub deget (proba j1_atingere_text.py: un buton de culoare al panoului Text, deci
     titlul se făcea albastru / gri). Clicul se oprește DOAR dacă linia de timp s-a mișcat sub deget (peste 3 px) și sub deget
     e acum alt element decât la apăsare; alegerea (făcută la ridicarea degetului) rămâne. În Clipchamp panoul stă în dreapta,
     deci linia nu se mișcă: așa e și mai fidel. ---- */
  let apasat=null;
  const susLinie=()=>{const l=R.querySelector('.vc-linie')||R.querySelector('.vc-sc');return l?l.getBoundingClientRect().top:0};
  const semn=el=>{if(!el||!el.closest)return '';const c=el.closest('.vc-clip'),m=el.closest('.vc-man'),a=el.closest('[data-a]'),o=el.closest('[data-vct]'),x=el.closest('[data-vctx]'),t=el.closest('.vct-txt'),tl=el.closest('.vct-tile');
    return [c&&c.dataset.clip,m&&(m.classList.contains('dr')?'dr':'st'),a&&a.dataset.a,o&&(o.dataset.vct+':'+(o.dataset.val||'')),x&&x.dataset.vctx,t&&t.dataset.vct,tl&&tl.dataset.vctStil,(c||m||a||o||x||t||tl)?'':(el.tagName+'.'+el.className)].join('|')};
  document.addEventListener('pointerdown',()=>{apasat=null},true);
  R.addEventListener('pointerdown',e=>{apasat={x:e.clientX,y:e.clientY,t:performance.now(),s:semn(e.target),sus:susLinie()}},true);
  document.addEventListener('click',e=>{const a=apasat;apasat=null;if(!a||window.__faraAparare||!R.isConnected)return;
    if(performance.now()-a.t>1500||Math.hypot(e.clientX-a.x,e.clientY-a.y)>12)return;
    if(semn(e.target)===a.s||Math.abs(susLinie()-a.sus)<=3)return;
    e.preventDefault();e.stopImmediatePropagation();if(!R.contains(document.activeElement))v.focus()},true);
  /* ---- tragerea textului pe previzualizare ---- */
  let tragS=null;
  R.addEventListener('pointerdown',e=>{const d=e.target.closest&&e.target.closest('.vct-txt');if(!d||!R.contains(d))return;
    const c=textId(d.dataset.vct);if(!c)return;const ec=R.querySelector('.vc-ecran').getBoundingClientRect();const s=stilDe(c);
    tragS={id:c.id,x0:e.clientX,y0:e.clientY,dx:(e.clientX-ec.left)/ec.width-s.x,dy:(e.clientY-ec.top)/ec.height-s.y,pornit:false};
    const a=v.stare().ales;if(!a||a.tip!=='text'||a.id!==c.id)v.alege({tip:'text',id:c.id});e.preventDefault();v.focus()},true);
  window.addEventListener('pointermove',e=>{
    if(tragT){if(!tragT.pornit&&Math.hypot(e.clientX-tragT.x0,e.clientY-tragT.y0)<7)return;tragT.pornit=true;e.preventDefault();
      fantoma((STILURI.find(s=>s.id===tragT.stil)||{}).nume||'Text',e.clientX,e.clientY);const ps=pistaSub(e.clientX,e.clientY);const pt=R.querySelector('.vc-pista.t');if(pt)pt.classList.toggle('tinta',!!ps);return}
    if(tragS){if(!tragS.pornit&&Math.hypot(e.clientX-tragS.x0,e.clientY-tragS.y0)<5)return;tragS.pornit=true;e.preventDefault();
      const ec=R.querySelector('.vc-ecran');if(!ec)return;const r=ec.getBoundingClientRect();
      previz={id:tragS.id,x:cl((e.clientX-r.left)/r.width-tragS.dx,.05,.95),y:cl((e.clientY-r.top)/r.height-tragS.dy,.05,.95)};v.avans(0)}
  },{passive:false});
  function sfarsit(e,anulat){
    if(tragT){const d=tragT;tragT=null;farFantoma();if(!d.pornit||anulat)return;
      const ps=pistaSub(e.clientX,e.clientY);if(!ps){v.mesaj('Lasă textul pe linia de timp, jos, pe pista Text (deasupra scenelor).');return}
      if(ps.clip){inlocuieste(ps.clip,d.stil);v.focus();return}
      let t=laTimp(e.clientX);if(t<Math.max(0.6,24/(R._k||20)))t=0;adaugaText(d.stil,magnet(Math.max(0,t)));v.focus();return}
    if(tragS){const d=tragS;tragS=null;if(d.pornit&&previz&&!anulat){const p=previz;previz=null;puneStil(p.id,{x:r3(p.x),y:r3(p.y)})}else{previz=null;v.avans(0)}v.focus()}
  }
  window.addEventListener('pointerup',e=>sfarsit(e,false));
  window.addEventListener('pointercancel',e=>sfarsit(e,true));
  /* ---- panoul de proprietăți al textului ---- */
  v.laProprietati('text',(pr,c)=>{
    if(!c){pr.innerHTML='';return}const s=stilDe(c);const u=R._uid||'x';
    const op=(k,val,eti,on,extra)=>`<button type="button" class="vct-op${on?' on':''}" data-vct="${k}" data-val="${esc(val)}" aria-pressed="${on}">${extra||''}${eti}</button>`;
    pr.innerHTML=`<h4>Text</h4><label for="vct-c-${u}">Text</label><textarea class="vct-camp" id="vct-c-${u}" data-vct="camp" rows="3">${esc(c.text)}</textarea><div class="vct-mic">Enter = rând nou</div>
      <label for="vct-m-${u}">Dimensiune</label><select class="vct-sel" id="vct-m-${u}" data-vct="marime">${MARIMI.concat(MARIMI.includes(s.marime)?[]:[s.marime]).sort((a,b)=>a-b).map(n=>`<option value="${n}"${n===s.marime?' selected':''}>${n}</option>`).join('')}</select>
      <label>Culoare</label><div class="vct-ops" role="group" aria-label="Culoare">${CULORI.map(o=>op('culoare',o.hex,o.nume,o.hex.toLowerCase()===s.culoare.toLowerCase(),`<i style="background:${o.hex}"></i>`)).join('')}</div>
      <div class="vct-mic">În Clipchamp, culoarea se alege dintr-o paletă cu multe culori (aici sunt șase). Deasupra textului din previzualizare apare acolo și un mic meniu (creion, culoare, font, mărime).</div>
      <label>Culoare de fundal</label><div class="vct-ops" role="group" aria-label="Culoare de fundal">${FUNDALURI.map(o=>op('fundal',o.hex||'',o.hex?o.nume:'Fără (None)',(o.hex||null)===(s.fundal?s.fundal.toUpperCase():null),o.hex?`<i style="background:${o.hex}"></i>`:'')).join('')}</div>
      <div class="vct-mic">În Clipchamp, Culoarea de fundal o au doar unele texte. Nu e la tine? Mută textul sau schimbă-i culoarea.</div>
      <label>Poziție</label><div class="vct-ops" role="group" aria-label="Poziție">${Object.keys(POZ).map(k=>op('poz',k,`${POZ[k].eti} (${POZ[k].en})`,Math.abs(s.y-POZ[k].y)<0.02&&Math.abs(s.x-.5)<0.02)).join('')}</div>
      <div class="vct-mic">Pe previzualizare poți și trage textul, cu mouse-ul sau cu degetul.</div>`;
    const camp=pr.querySelector('[data-vct="camp"]');let orig=c.text;
    camp.onfocus=()=>{orig=c.text};
    camp.oninput=()=>{c.text=camp.value;const k=R.querySelector(`.vc-pista.t .vc-clip[data-clip="${c.id}"]`);if(k&&k.firstChild&&k.firstChild.nodeType===3)k.firstChild.nodeValue=camp.value;v.avans(0)};
    camp.onblur=()=>{const nou=camp.value;if(nou!==orig){c.text=orig;scrie(c.id,nou)}};
    camp.onkeydown=e=>e.stopPropagation();
    /* după un clic / o atingere, focusul se întoarce pe simulator (Ctrl+Z, Space, Delete merg imediat, ca în aplicație);
       după tastatură (Tab + Enter, săgețile în listă) rămâne pe același buton, ca elevul să poată continua cu tastele */
    const re=(k,val,tastatura)=>{if(!tastatura){v.focus();return}const b=R.querySelector(`.vc-prop [data-vct="${k}"]${val!=null?`[data-val="${val}"]`:''}`);if(b)b.focus({preventScroll:true})};
    const sel=pr.querySelector('[data-vct="marime"]');let tasta=false;
    sel.onkeydown=e=>{tasta=true;e.stopPropagation()};sel.onpointerdown=()=>{tasta=false};
    sel.onchange=()=>{puneStil(c.id,{marime:+sel.value});re('marime',null,tasta)};
    pr.querySelectorAll('.vct-op').forEach(b=>b.onclick=e=>{const k=b.dataset.vct,val=b.dataset.val;
      if(k==='culoare')puneStil(c.id,{culoare:val});else if(k==='fundal')puneStil(c.id,{fundal:val||null});else if(k==='poz')puneStil(c.id,{y:POZ[val].y,x:.5});re(k,val,e.detail===0)});
  });
  /* ---- desenul peste previzualizare + rândul „Text pe ecran” + fereastra de export ---- */
  v.laPrevizualizare((strat,t)=>{
    const ec=strat.parentElement;const H=ec.clientHeight||1;const a=v.stare().ales;strat.innerHTML='';const pe=[];
    v.proiect().text.filter(c=>t>=c.start&&t<c.start+c.durata).forEach(c=>{const s=stilDe(c);const p=previz&&previz.id===c.id?previz:s;
      const d=document.createElement('div');d.className='vct-txt'+(a&&a.tip==='text'&&a.id===c.id?' ales':'');d.dataset.vct=c.id;
      d.style.left=(p.x*100)+'%';d.style.top=(p.y*100)+'%';d.style.color=s.culoare;d.style.fontSize=(H*s.marime/SCARA).toFixed(1)+'px';if(s.fundal)d.style.background=s.fundal;
      d.textContent=c.text;strat.appendChild(d);
      const loc=Object.keys(POZ).find(k=>Math.abs(p.y-POZ[k].y)<0.02&&Math.abs(p.x-.5)<0.02);
      pe.push(`„${esc(String(c.text).replace(/\n/g,' / '))}” (${esc(numeCuloare(s.culoare))}, mărimea ${s.marime}${s.fundal?', pe fundal '+esc(numeCuloare(s.fundal)==='#000000'?'negru':numeCuloare(s.fundal)==='#FFFFFF'?'alb':numeCuloare(s.fundal)):''}${loc?', '+POZ[loc].eti.toLowerCase():''})`)});
    const sc=R.querySelector('.vc-scena');const ac=R.querySelector('.vc-acum');
    if(sc&&ac){let x=sc.querySelector('.vct-acum');if(!x){x=document.createElement('div');x.className='vct-acum';ac.after(x)}const h='Text pe ecran: '+(pe.length?pe.join('; '):'niciunul')+'.';if(x.innerHTML!==h)x.innerHTML=h}
    if(EXP&&!R.querySelector('.vct-exp'))deseneazaExport();
  });
  /* ---- exportul ---- */
  R.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-a="export"]');if(!b||!O.export)return;e.stopPropagation();e.preventDefault();deschideExport()},true);
  function deschideExport(){
    if(v.stare().durata<=0){v.mesaj('Linia de timp e goală: nu ai ce exporta.');return}
    EXP={calitate:'1080p',nume:v.stare().nume,nor:false,faza:'alege',p:0,msg:''};deseneazaExport();
    const i=R.querySelector('.vct-exp input[data-vctx="nume"]');if(i)i.focus({preventScroll:true});
  }
  function inchideExport(){EXP=null;const x=R.querySelector('.vct-exp');if(x)x.remove();v.focus()}
  function gataExport(){const nume=EXP.nume.trim().replace(/\.mp4$/i,'')+'.mp4';EXPORTURI.push({calitate:EXP.calitate,nume,nor:EXP.nor,jl:v.jurnal().length,durata:v.stare().durata});EXP.faza='gata';EXP.p=100;
    deseneazaExport();emit2({tip:'export',calitate:EXP.calitate,nume})}
  let cron=0;
  function porneste(){
    if(!EXP.nume.trim()){EXP.msg='Scrie un nume pentru fișier.';deseneazaExport();return}
    EXP.faza='lucreaza';EXP.p=0;deseneazaExport();
    if(SIMUL){gataExport();return}
    clearInterval(cron);cron=setInterval(()=>{if(!EXP){clearInterval(cron);return}EXP.p=Math.min(100,EXP.p+8);if(EXP.p>=100){clearInterval(cron);gataExport()}else{const b=R.querySelector('.vct-exp .bar i');const n=R.querySelector('.vct-exp .pc');if(b)b.style.width=EXP.p+'%';if(n)n.textContent=EXP.p+' %'}},120);
  }
  function deseneazaExport(){
    let x=R.querySelector('.vct-exp');if(!EXP){if(x)x.remove();return}
    if(!x){x=document.createElement('div');x.className='vct-exp';x.setAttribute('role','dialog');x.setAttribute('aria-label','Exportați videoclipul');R.appendChild(x);
      x.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Escape'&&EXP&&EXP.faza!=='lucreaza'){e.preventDefault();inchideExport()}});
      x.addEventListener('click',e=>{const b=e.target.closest('[data-vctx]');if(!b||!EXP)return;const k=b.dataset.vctx;
        if(k==='x'){if(EXP.faza!=='lucreaza')inchideExport()}else if(k==='ok')porneste();else if(k==='mai'){EXP.msg='„Mai multe opțiuni” nu le folosim aici: ajung calitatea și numele fișierului.';deseneazaExport()}});
      x.addEventListener('change',e=>{if(!EXP)return;const t=e.target;if(t.name==='vct-q'){EXP.calitate=t.value}else if(t.dataset.vctx==='nor'){EXP.nor=t.checked;EXP.msg=t.checked?'În lecție îl lași oprit: fișierul rămâne pe calculator.':'';deseneazaExport()}});
      x.addEventListener('input',e=>{if(EXP&&e.target.dataset.vctx==='nume'){EXP.nume=e.target.value}})}
    const E=EXP;const u=R._uid||'x';
    const lucru=E.faza==='lucreaza',gata=E.faza==='gata';
    x.innerHTML=`<div class="w"><div class="tt"><b>Exportați videoclipul</b><button type="button" class="vc-cb" data-vctx="x" aria-label="Închide" ${lucru?'disabled':''}>✕</button></div>
      ${gata?`<div class="jos"><div class="bar"><i style="width:100%"></i></div><p style="margin:6px 0">Gata: <b>${esc(EXPORTURI[EXPORTURI.length-1].nume)}</b> (${E.calitate==='720p'?'720 p':'1080 p'}). În Clipchamp-ul adevărat, fișierul ajunge de obicei în <b>Descărcări</b>. Aici, în pagină, nu se face niciun fișier.</p><button type="button" class="vc-b mov" data-vctx="x">Închide</button></div>`
      :`<div class="cp"><div class="st"><div class="h">Calitate</div>
        <label class="o dez"><input type="radio" name="vct-q" value="4k" disabled><span><b>4k</b> <span class="pr" title="opțiune plătită">◆</span><small>Videoclipul nu are conținut media 4K</small></span></label>
        <label class="o"><input type="radio" name="vct-q" value="1080p" ${E.calitate==='1080p'?'checked':''} ${lucru?'disabled':''}><span><b>1080 p</b><small>Calitate înaltă</small></span></label>
        <label class="o"><input type="radio" name="vct-q" value="720p" ${E.calitate==='720p'?'checked':''} ${lucru?'disabled':''}><span><b>720 p</b><small>Fișier mai mic, export mai rapid</small></span></label>
        <button type="button" class="lk" data-vctx="mai">Mai multe opțiuni</button></div>
       <div class="dr"><div><div class="h"><label for="vct-n-${u}">Numele fișierului</label></div><div class="nf"><input id="vct-n-${u}" data-vctx="nume" value="${esc(E.nume)}" ${lucru?'disabled':''} autocomplete="off" spellcheck="false"><span>.mp4</span></div></div>
        <label class="sw"><input type="checkbox" data-vctx="nor" ${E.nor?'checked':''} ${lucru?'disabled':''}> Store in the cloud</label>
        <button type="button" class="vc-b mov" data-vctx="ok" ${lucru?'disabled':''}>Exportați</button></div></div>
       ${lucru?`<div class="jos">Se exportă… <span class="pc">${E.p} %</span><div class="bar"><i style="width:${E.p}%"></i></div></div>`:''}`}
      ${E.msg?`<div class="jos"><div class="msg">${E.msg}</div></div>`:''}</div>`;
  }
  /* ---- „Privește ca de departe” (până la 1.0: „ca de la 3 pași”) ---- */
  function deDeparte(b){departe=b==null?!departe:!!b;R.classList.toggle('vct-departe',departe);v.avans(0);emit2({tip:'departe',departe});return departe}
  /* ---- simularea (probe, „Arată-mi răspunsul”) ---- */
  let SIMUL=false;
  const ix=i=>{const L=v.proiect().text;return L[i]?L[i].id:null};
  const ACT={
    textNou:([s,t])=>adaugaText(s||'simplu',t),
    textScrie:([i,s])=>{const id=ix(i);if(id)scrie(id,s)},
    textMuta:([i,t])=>{const id=ix(i);if(id)v.schimba(P=>{const c=P.text.find(x=>x.id===id);c.start=r3(Math.max(0,t))})},
    textCapat:([i,t])=>{const id=ix(i);if(id)v.schimba(P=>{const c=P.text.find(x=>x.id===id);c.durata=r3(Math.max(0.5,t-c.start))})},
    textCuloare:([i,x])=>{const id=ix(i);if(id)puneStil(id,{culoare:culoareHex(x)})},
    textMarime:([i,n])=>{const id=ix(i);if(id)puneStil(id,{marime:n})},
    textPoz:([i,k])=>{const id=ix(i);if(id&&POZ[k])puneStil(id,{y:POZ[k].y,x:.5})},
    textXY:([i,x,y])=>{const id=ix(i);if(id)puneStil(id,{x:cl(x,.05,.95),y:cl(y,.05,.95)})},
    textFundal:([i,x])=>{const id=ix(i);if(id)puneStil(id,{fundal:culoareHex(x)})},
    textAlege:i=>{const id=ix(i);if(id)v.alege({tip:'text',id})},
    textSterge:i=>{const id=ix(i);if(id){v.alege({tip:'text',id});simBaza([{tasta:'Delete'}])}},
    textPeste:([i,s])=>{const id=ix(i);if(id)inlocuieste(id,s)},
    exporta:o=>{o=o||{};SIMUL=true;try{deschideExport();if(!EXP)return;if(o.calitate)EXP.calitate=o.calitate;if(o.nume!=null)EXP.nume=o.nume;if(o.nor)EXP.nor=true;porneste();inchideExport()}finally{SIMUL=false}},
    departe:b=>deDeparte(b)
  };
  const simBaza=v.simuleaza;
  v.simuleaza=L=>{for(const x of (L||[])){const k=Object.keys(x)[0];if(ACT[k])ACT[k](x[k]);else simBaza([x])}};
  const resetBaza=v.reset;
  v.reset=()=>{clearInterval(cron);EXP=null;EXPORTURI=[];previz=null;tragS=null;tragT=null;departe=false;R.classList.remove('vct-departe');resetBaza()};
  v.text={versiune:VERS,stil:c=>stilDe(c),lista:()=>v.proiect().text.map(c=>Object.assign({},c,{st:stilDe(c)})),contrast,cuvinte,catalog:()=>CAT,
    exporturi:()=>EXPORTURI.map(x=>Object.assign({},x)),deschideExport,departe:deDeparte,on:f=>asc.push(f),off:f=>{asc=asc.filter(x=>x!==f)}};
  v.redesenare();
  return v;
}

/* ---------------- verificările noi ---------------- */
function gaseste(v,o){if(typeof o==='string')o={text:o};const L=v.proiect().text;
  return L.filter(c=>{const n=norm(c.text);if(o.text!=null&&n!==norm(o.text))return false;if(o.contine&&!o.contine.every(w=>n.includes(norm(w))))return false;return true})}
const NOI={
  textScris:(v,s)=>gaseste(v,{text:s}).length>0,
  textContine:(v,L)=>gaseste(v,{contine:L}).length>0,
  textLa:(v,o)=>gaseste(v,o).some(c=>c.start>=o.de[0]-1e-6&&c.start<=o.de[1]+1e-6),
  textPanaLa:(v,o)=>gaseste(v,o).some(c=>{const f=c.start+c.durata;return f>=o.de[0]-1e-6&&f<=o.de[1]+1e-6}),
  textDurataMin:(v,o)=>gaseste(v,o).some(c=>c.durata>=o.min-0.2),   // 0,2 s îngăduință: un mâner tras cu degetul
  textCitet:(v,o)=>!!v.text&&gaseste(v,o).some(c=>{const k=v.text.contrast(c);return k!=null&&k>=PRAG&&v.text.stil(c).marime>=(o.marimeMin||0)}),
  textMarime:(v,o)=>!!v.text&&gaseste(v,o).some(c=>v.text.stil(c).marime>=o.min),
  textDupaFilm:(v,o)=>{const s=v.stare().sfarsitVideo;return s>0&&gaseste(v,o).some(c=>c.start>=s-0.15)},
  nrTexte:(v,n)=>v.proiect().text.length===n,
  muzicaPanaLaFinal:(v,m)=>{const D=v.stare().durata;return D>0&&v.proiect().audio.some(c=>c.m===m&&Math.abs(c.start+c.durata-D)<=0.5)},   // jumătate de secundă: nu se simte (iar muzica nu trece de capătul fișierului)
  exportat:(v,o)=>{if(!v.text)return false;const E=v.text.exporturi();const x=E[E.length-1];if(!x)return false;o=o||{};
    if(o.calitate&&x.calitate!==o.calitate)return false;const fara=s=>norm(String(s).trim().replace(/(\.mp4)+$/i,''));const n=fara(x.nume);
    if(o.nume!=null&&n!==fara(o.nume))return false;if(o.numeSfarsit&&!n.endsWith(norm(o.numeSfarsit)))return false;
    if(!o.oriceMomentul&&v.jurnal().slice(x.jl).some(e=>SCHIMBARI.includes(e.tip)))return false;return true},
  /* 1.1 (reparația J1 a lecției 15) */
  textRanduri:(v,o)=>gaseste(v,o).some(c=>String(c.text||'').split('\n').filter(r=>r.trim()).length>=o.min),
  textDeDouaOri:(v,o)=>gaseste(v,o).some(c=>c.durata>=cuvinte(c.text)*2/3-0.2),
  muzicaIntreaga:(v,m)=>{const L=v.text&&(v.text.catalog()[m]||{}).durata;return !!L&&v.proiect().audio.some(c=>c.m===m&&Math.abs((c.de||0)+c.durata-L)<=0.3)},
  textCuloareEste:(v,o)=>!!v.text&&gaseste(v,o).some(c=>String(v.text.stil(c).culoare).toLowerCase()===String(culoareHex(o.culoare)).toLowerCase()),
  textPozEste:(v,o)=>!!v.text&&!!POZ[o.poz]&&gaseste(v,o).some(c=>{const s=v.text.stil(c);return Math.abs(s.y-POZ[o.poz].y)<0.02&&Math.abs(s.x-.5)<0.02}),
  textFaraSuprapunere:(v,o)=>{const L=v.proiect().text.slice().sort((a,b)=>a.start-b.start);if(L.length<((o&&o.min)||0))return false;for(let i=1;i<L.length;i++)if(L[i].start<L[i-1].start+L[i-1].durata-0.05)return false;return true}
};
Object.keys(NOI).forEach(k=>{if(VC.verificari[k]&&VC.verificari[k]!==NOI[k])console.warn('video-clipchamp-text: verificarea există deja:',k);VC.verificari[k]=NOI[k]});

/* ---------------- tipul pentru motor: {t:'videoclipchamptext', …, export?:true} ---------------- */
const TipVideoClipchampText={
  render(Q,body,api){
    stil();
    body.innerHTML=`<div class="vc-loc"></div><div class="vct-sub"><button type="button" class="btn sm ghost" data-vc-reset>↺ Ia-o de la capăt</button>${Q.departe===false?'':'<button type="button" class="btn sm ghost" data-vct-departe aria-pressed="false">Privește ca de departe</button><span class="hint">(Clipchamp n-are butonul ăsta: la calculator, lași căștile pe masă, te ridici lângă scaun și te uiți de acolo.)</span>'}</div>${(Q.teste||[]).length?`<div class="vc-teste"><b>Testele</b> <span class="hint">· se bifează singure, pe măsură ce lucrezi</span><ol>${Q.teste.map((t,i)=>`<li data-i="${i}"><span class="s">○</span><span>${t.ce}<span class="m"></span></span></li>`).join('')}</ol></div>`:''}`;
    const v=creeaza(body.querySelector('.vc-loc'),{catalog:Q.catalog,start:Q.start,sunet:Q.sunet,export:!!Q.export});body._vc=v;
    const T=Q.teste||[];
    function marcheaza(arata){let ok=0;T.forEach((t,i)=>{const li=body.querySelector(`.vc-teste li[data-i="${i}"]`),b=VC.verifica(v,t);if(b)ok++;
      if(!li)return;li.classList.toggle('ok',b);li.classList.toggle('rau',!b&&arata);li.querySelector('.s').textContent=b?'✓':arata?'✗':'○';li.querySelector('.m').innerHTML=!b&&arata&&t.cum?t.cum:''});return ok}
    v.on(()=>marcheaza(false));v.text.on(()=>marcheaza(false));
    body.querySelector('[data-vc-reset]').onclick=()=>{if(api.done())return;v.reset();marcheaza(false);v.focus()};
    const dep=body.querySelector('[data-vct-departe]');if(dep)dep.onclick=e=>{const d=v.text.departe();dep.setAttribute('aria-pressed',d);dep.textContent=d?'Privește de aproape':'Privește ca de departe';if(e.detail>0)v.focus()};
    const nav=api.checkButton(()=>{
      const ok=marcheaza(true);v.focus();
      if(ok===T.length){nav.innerHTML='';api.resolve(true)}
      else{const p=T.find(t=>!VC.verifica(v,t));api.resolve(false,`${ok} din ${T.length} teste trecute. ${p&&p.cum?p.cum:''}`);
        api.revealButton(()=>{v.reset();v.simuleaza(Q.solutie||[]);marcheaza(true);nav.innerHTML='';api.giveUp(Q.raspuns||'testele sunt acum bifate: uită-te pe linia de timp și în previzualizare ce s-a schimbat.')})}
    },Q.verifica||'Verifică');
    marcheaza(false);
  },
  rezolva(Q,body){const v=body._vc;v.reset();v.simuleaza(Q.solutie||[]);return true},
  gresit(Q,body){const v=body._vc;v.reset();v.simuleaza(Q.gresit||[]);return true}
};
window.VideoClipchampText={versiune:VERS,creeaza,stiluri:STILURI.map(s=>s.nume),culori:CULORI.map(c=>c.nume),pozitii:Object.keys(POZ),prag:PRAG,cuvinte,contrastCulori:(a,b)=>raport(lumHex(culoareHex(a)),lumHex(culoareHex(b)))};
window.TipVideoClipchampText=TipVideoClipchampText;
})();
