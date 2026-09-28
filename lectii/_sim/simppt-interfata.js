/* ======================================================================================================
   lectii/_sim/simppt-interfata.js — PowerPoint simulat: FEREASTRA APLICAȚIEI (tipul de exercițiu `ppti`) și
   găsirea zonelor pe o captură reală (tipul `zona`).
   PROPRIETAR: autorul lecției VI · M1 · 2 („Ce este o prezentare bună. Interfața aplicației de prezentări”).
   SE ÎNCARCĂ DUPĂ jocuri/_motor/ui-panglica.js + panglica-powerpoint.js (panglica reală a PowerPoint-ului instalat).
   Nu atinge simppt.js / simppt-formatare.js / simppt-animatii.js. Tipuri: tipuri:{ppti:SimPPTInt, zona:SimPPTInt.zona}.

   CE FACE, CA ÎN POWERPOINT (probe pe desktopul ascuns: lectii/vi/m1-l02/_proba/probe_ppt.py → probe_ppt.json):
   - cele cinci zone: panglica (filele reale, cu grupurile și butoanele lor), panoul cu miniaturi, zona de lucru,
     zona de note, bara de stare („Slide 2 of 7”);
   - clic pe o miniatură = diapozitivul apare mare în zona de lucru, iar bara de stare arată al câtelea e;
   - zona de note: clic în ea și scrii; butonul Notes din bara de stare (și View › Notes) o ascunde / o arată;
   - vizualizările: butoanele din bara de stare (Normal, Slide Sorter, Reading View, Slide Show) și fila View;
     Slide Sorter = toate diapozitivele, mici, fără note; clic pe unul îl alege, dublu clic îl deschide în Normal;
     Normal din BARA DE STARE apăsat când ești deja în Normal schimbă panoul din stânga în Schiță (Outline View: textul
     diapozitivelor) și înapoi; Normal de pe fila View aduce mereu miniaturile (probe_ppt.json P14-P15);
   - expunerea: F5 și Slide Show › From Beginning pornesc de la primul diapozitiv; butonul Slide Show din bara de
     stare și Slide Show › From Current Slide, de la diapozitivul ales; clic / → / Enter / Spațiu = înainte,
     ← = înapoi; după ultimul, ecranul negru „End of slide show, click to exit.”; încă un clic (sau →) iese;
     Esc iese oricând și te întoarce în vizualizarea de dinainte, pe diapozitivul la care ai ieșit (pe ecranul negru: pe
     ultimul); clicul de pe ecranul negru te întoarce pe diapozitivul ales înainte de expunere;
   - orice alt buton din panglică: spune pe ecran cum se numește, pe ce filă și în ce grup e (pe telefon nu există
     „ții mouse-ul pe el”), iar testele pot cere „găsește butonul X”.
   - F5 / Shift+F5 sunt prinse ORIUNDE în simulator, și cu cursorul în zona de note (textul scris rămâne, expunerea
     pornește), ca să nu ajungă la browser, care ar reîncărca pagina (GRAV, judecătorul VI/9, 28.09; probă cu taste
     Windows reale: lectii/vi/m1-l02/_proba/proba_f5_headful.py, înainte 2 FAIL / după 0).
   ABATERI SPUSE PE ECRAN: pe diapozitiv nu se scrie (lecția 4); Reading View și celelalte vizualizări de pe fila View nu
   sunt simulate (spun asta la clic); fila File e lecția 3; filele Draw, Record, Review, Help n-au butoane aici.
   Verificarea e pe STAREA ferestrei (teste numite), nu pe drumul clicurilor: orice drum bun trece.

   CONFIGURAȚIA: {t:'ppti', q, start:{deck, cur?, tab?, note?:false}, teste:[{ce, c:[condiții], ajutor?}], rez:[pași], gresit:[pași],
     rezText, why}.  Prezentări: SimPPTInt.prezentari({nume:{titlu:'albinele', diap:[{lay:'titlu'|'tc'|'to', titlu, sub,
     randuri:[…], caseta, img:'cheie', fundal:'#hex', cul:'#hex', pt?, note}]}}); imagini: SimPPTInt.imagini({cheie:{src,w,h,alt}}).
   Condiții: {k:'cur',n} · {k:'tab',v} · {k:'vedere',v:'normal'|'sorter'} · {k:'zona',z:'panglica'|'miniaturi'|'lucru'|'note'|'stare'}
     · {k:'buton',id:[idMso…]} · {k:'nota',d,min?} (note noi pe diapozitivul d) · {k:'noteDoar',d:[…]} (doar acolo s-au schimbat notele)
     · {k:'noteVizibile',v} · {k:'ev',e:'inceput'|'curent'|'final'|'esc'|'sorter'|'normalDupaSorter'|'inapoi'|'iesit'|'schita'|'notesToggle'} · {k:'curentDin',n}
   Pași: 'mini-3' · 'tab-view' · 'v:normal'|'v:sorter'|'v:show' · 'show:inceput'|'show:curent' · 'f5' · 'next'|'prev'|'esc'
     · 'notes' · 'zona-note' · {nota:[d,'text']} · 'b:<idMso>' (apasă un buton din panglică)

   Tipul `zona`: {t:'zona', q, img:{src,w,h,alt}, zone:[{z, x,y,w,h (%), nr}], ok:'z', why, gresitMsg?:{z:'…'}}
   ====================================================================================================== */
(function(){
'use strict';
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const strip=s=>String(s).replace(/<[^>]+>/g,'');
const norm=s=>String(s==null?'':s).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,' ').trim().toLowerCase();
const clona=o=>JSON.parse(JSON.stringify(o));

/* ---------------- aspectul (culori fixe: arată ca aplicația, în orice temă) ---------------- */
const CSS=`
.spi-root{max-width:820px;margin:0 auto}
.spi{--paper:#FFFFFF;--paper2:#F3F3F3;--ink:#222;--ink2:#5A5A5A;--line:#D4D4D4;--sel:#FBE3DB;--xlg:#B7472A;position:relative;
  border:1px solid #AEB8BB;border-radius:6px;overflow:hidden;background:#F3F3F3;color:#222;font:13px/1.3 "Segoe UI",system-ui,sans-serif;text-align:left}
.spi button{font:inherit;color:inherit;cursor:pointer;margin:0}
.spi-bar{background:#B7472A;color:#fff;padding:4px 8px;font-size:12px;overflow-wrap:anywhere}
.spi .rb.pg{background:#fff}
.spi-banda-alt{padding:10px 8px;font-size:12px;background:#fff;color:#444;min-height:40px}
.spi-main{display:flex;gap:0;background:#E6E6E6;min-height:0}
.spi-th{flex:0 0 22%;max-width:150px;min-width:64px;overflow-y:auto;max-height:340px;padding:6px 4px;background:#F3F3F3;border-right:1px solid #CFCFCF}
.spi-thb{display:flex;gap:3px;align-items:flex-start;width:100%;border:0;background:none;padding:3px 2px;margin:0 0 4px;min-height:32px}
.spi-thb i{font-style:normal;font-size:11px;color:#555;width:12px;text-align:right;flex:0 0 12px}
.spi-thb .spi-mw{flex:1;min-width:0;border:2px solid #D0D0D0;border-radius:3px;background:#fff}
.spi-thb.on .spi-mw{border-color:#C43E1C;box-shadow:0 0 0 1px #C43E1C}
.spi-thb.on i{color:#C43E1C;font-weight:700}
.spi-col{flex:1;min-width:0;display:flex;flex-direction:column}
.spi-work{flex:1;padding:10px 12px;display:flex;align-items:center;justify-content:center;min-height:0;cursor:default}
.spi-work .spi-sw{width:100%;max-width:560px}
.spi-notes{border-top:1px solid #C8C8C8;background:#fff;min-height:44px;padding:5px 8px;font-size:12px;color:#222;cursor:text;white-space:pre-wrap;overflow-wrap:anywhere}
.spi-notes .ph{color:#8A8A8A}
.spi-notes textarea{width:100%;min-height:40px;border:1px solid #C43E1C;border-radius:2px;font:12px/1.3 "Segoe UI",system-ui,sans-serif;padding:3px;resize:vertical;box-sizing:border-box;color:#222;background:#fff}
.spi-status{display:flex;flex-wrap:wrap;align-items:center;gap:2px 6px;background:#EDEDED;border-top:1px solid #C8C8C8;padding:2px 6px;font-size:11px;color:#333}
.spi-status .st-l{flex:1 1 auto;min-width:90px}
.spi-status .st-r{display:flex;align-items:center;gap:2px;flex-wrap:wrap;justify-content:flex-end}
.spi-status button{border:1px solid transparent;background:none;border-radius:3px;min-height:26px;min-width:28px;padding:0 5px;display:inline-flex;align-items:center;gap:3px;font-size:11px}
.spi-status button svg{width:16px;height:16px;fill:none;stroke:#333;stroke-width:1.4}
.spi-status button.on{background:#D6D6D6;border-color:#B8B8B8}
.spi-status button:hover,.spi-status button:focus-visible{border-color:#B7472A;background:#FBE3DB}
.spi-status .zoom{color:#555;padding:0 4px}
@media (pointer:coarse),(max-width:760px){.spi-status button{min-height:34px;min-width:34px}.spi-thb{min-height:36px}}
@media (max-width:560px){.spi-status .st-lung,.spi-status .zoom{display:none}}
.spi-th.sc{flex-basis:34%;max-width:230px;background:#F3F3F3}
.spi-sc{display:block;width:100%;border:0;background:none;text-align:left;padding:2px 2px 4px;margin:0 0 2px;min-height:32px;font-size:11px;color:#333}
.spi-sc .sc-t{display:flex;align-items:center;gap:3px}
.spi-sc i{font-style:normal;color:#555;width:12px;text-align:right}
.spi-sc .sc-ic{display:inline-block;width:14px;height:10px;border:1.5px solid #BBB;border-radius:2px;background:#fff}
.spi-sc.on .sc-ic{border-color:#E8703A;background:#FBE3DB}
.spi-sc .sc-r{padding-left:32px;overflow-wrap:break-word;hyphens:auto}
@media (max-width:560px){.spi-th.sc{flex-basis:46%;max-width:none}.spi-sc .sc-r{padding-left:16px}}
@media (pointer:coarse){.spi .rb.pg .tabs button,.spi .rb.pg .pg-fisier{min-height:34px}.spi-root .spi-reset{min-height:34px}}
/* diapozitivul (geometria machetelor Office, 16:9; mărimile în puncte, ca în PowerPoint) */
.spi-sw{container-type:inline-size;min-width:0;display:block}
.spi-sl{position:relative;aspect-ratio:16/9;background:#fff;color:#000;overflow:hidden;font-family:Calibri,Carlito,"Segoe UI",Arial,sans-serif;line-height:1.1;text-align:left;font-weight:400}
.spi-work .spi-sl{box-shadow:0 1px 3px rgba(0,0,0,.35)}
.spi-sl .ph{position:absolute;box-sizing:border-box;font-size:calc(var(--pt,28) * 100cqw / 960);display:flex;flex-direction:column;overflow:hidden}
.spi-sl .ph.b{justify-content:flex-end}.spi-sl .ph.m{justify-content:center}.spi-sl .ph.t{justify-content:flex-start}
.spi-sl .ph.c{text-align:center}
.spi-sl ul{margin:0;padding:0 0 0 1.1em;list-style:none}
.spi-sl li{position:relative;margin:0 0 .12em}
.spi-sl li::before{content:"•";position:absolute;left:-.9em}
.spi-sl .img{position:absolute;object-fit:fill}
/* Sortare diapozitive */
.spi-sort{flex:1;display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:12px 10px;padding:12px;background:#E6E6E6;max-height:360px;overflow-y:auto}
.spi-sort button{border:0;background:none;padding:0;text-align:center;min-height:32px}
.spi-sort .spi-mw{display:block;border:2px solid #D0D0D0;border-radius:3px;background:#fff}
.spi-sort button.on .spi-mw{border-color:#C43E1C;box-shadow:0 0 0 1px #C43E1C}
.spi-sort small{display:block;font-size:11px;color:#555;margin-top:2px}
/* expunerea (în simulator: acoperă fereastra; în PowerPoint: tot ecranul) */
.spi-show{position:absolute;inset:0;background:#000;z-index:5;display:flex;align-items:center;justify-content:center;cursor:pointer;touch-action:manipulation}
.spi-show .spi-sw{width:100%;max-height:100%}
.spi-show .fin{color:#fff;font:15px "Segoe UI",system-ui,sans-serif;text-align:center;align-self:flex-start;margin-top:10px;padding:0 8px}
.spi-show .fin small{display:block;color:#bbb;font-size:12px;margin-top:4px}
.spi-msg{margin:6px 2px;font-size:.9rem;min-height:1.3em}
.spi-taste{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:6px 0}
.spi-taste .lbl2{flex-basis:100%;font-size:.8rem;color:var(--ink2)}
.spi-taste button{min-height:36px;min-width:44px;padding:4px 10px;border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink);font:600 .85rem/1.1 "Segoe UI",system-ui,sans-serif}
.spi-taste button small{display:block;font-weight:400;font-size:.7rem;color:var(--ink2)}
.spi-teste{margin:4px 0 8px;padding-left:1.6em}
.spi-teste li{margin:3px 0;color:var(--ink2)}
.spi-teste li.ok{color:var(--ok);font-weight:600}
.spi-teste li.ok::marker{content:"✓  "}
/* tipul „zona”: numere mari peste zonele încadrate ale unei capturi reale */
.spz{max-width:760px;margin:0 auto}
.spz-img{position:relative;width:100%;border:1px solid var(--line);border-radius:4px;overflow:visible}
.spz-img img{display:block;width:100%;height:auto;border-radius:4px}
.spz-nr{position:absolute;transform:translate(-50%,-50%);min-width:36px;min-height:36px;border-radius:50%;border:2px solid #fff;background:#1F4E79;color:#fff;
  font:700 16px/1 "Segoe UI",system-ui,sans-serif;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,.45);cursor:pointer;padding:0}
.spz-nr.bad{background:#B3261E}.spz-nr.ok{background:#1E7A4A}
.spz-nr:focus-visible{outline:3px solid #FFB000}
`;
function stil(){if(document.getElementById('spi-css'))return;const s=document.createElement('style');s.id='spi-css';s.textContent=CSS;document.head.appendChild(s)}

/* ---------------- prezentările și imaginile ---------------- */
const DECKS={},IMG={};
/* geometria machetelor (PowerPoint 16.0, tema Office, 16:9 — aceleași valori ca în simppt.js) */
const LAY={
  titlu:{n:'Title Slide',ph:[{k:'titlu',x:12.5,y:16.4,w:75,h:34.8,pt:60,v:'b',c:1},{k:'sub',x:12.5,y:52.5,w:75,h:24.1,pt:24,v:'t',c:1}]},
  tc:{n:'Title and Content',ph:[{k:'titlu',x:6.9,y:5.3,w:86.2,h:19.3,pt:44,v:'m'},{k:'randuri',x:6.9,y:26.6,w:86.2,h:63.4,pt:28,v:'t'}]},
  to:{n:'Title Only',ph:[{k:'titlu',x:6.9,y:5.3,w:86.2,h:19.3,pt:44,v:'m'}]}
};
/* poziția imaginilor și a casetei, ca în prezentarea făcută prin COM (_proba/ppt_l2.py): puncte din 960 x 540 */
const POZ_IMG={albina:{x:500,y:140,w:400,h:316},baloane:{x:600,y:130,w:270,h:360}};

function slideHTML(sl){
  const L=LAY[sl.lay]||LAY.tc,cul=sl.cul?`color:${sl.cul};`:'';
  let h=`<div class="spi-sl" style="${sl.fundal?`background:${sl.fundal};`:''}${cul}">`;
  L.ph.forEach(p=>{
    const st=`left:${p.x}%;top:${p.y}%;width:${p.w}%;height:${p.h}%;--pt:${(p.k==='randuri'&&sl.pt)||p.pt}`;
    const cls=`ph ${p.v}${p.c?' c':''}`;
    if(p.k==='titlu'&&sl.titlu)h+=`<div class="${cls}" style="${st}">${esc(sl.titlu)}</div>`;
    else if(p.k==='sub'&&sl.sub)h+=`<div class="${cls}" style="${st}">${esc(sl.sub)}</div>`;
    else if(p.k==='randuri'&&sl.randuri&&sl.randuri.length)h+=`<div class="${cls}" style="${st}"><ul>${sl.randuri.map(r=>`<li>${esc(r)}</li>`).join('')}</ul></div>`;
  });
  if(sl.caseta)h+=`<div class="ph t" style="left:6.9%;top:29.6%;width:41.7%;height:22.2%;--pt:28">${esc(sl.caseta)}</div>`;
  if(sl.img&&IMG[sl.img]){const I=IMG[sl.img],P=POZ_IMG[sl.img]||{x:500,y:140,w:400,h:300};
    h+=`<img class="img" src="${esc(I.src)}" alt="" style="left:${P.x/9.6}%;top:${P.y/5.4}%;width:${P.w/9.6}%;height:${P.h/5.4}%">`}
  return h+'</div>';
}

/* ---------------- panglica reală ---------------- */
/* ordinea filelor din PowerPoint-ul instalat (captura jocuri/prezentari-vi/img/fereastra-zone.webp + probe_ppt.json P1);
   Draw, Record, Review, Help lipsesc din dump-ul panglicii: le arătăm, fără butoane, ca rândul de file să fie cel real */
const ORDINE=['TabHome','TabInsert','TabDraw','TabDesign','TabTransitions','TabAnimations','TabSlideShow','TabRecord','TabReview','TabView','TabHelp'];
const FARA={TabDraw:'Draw',TabRecord:'Record',TabReview:'Review',TabHelp:'Help'};
const RO_FILA={home:'Pornire',insert:'Inserare',draw:'Desenare',design:'Proiectare',transitions:'Tranziții',animations:'Animații',slideshow:'Expunere diapozitive',
  record:'Înregistrare',review:'Revizuire',view:'Vizualizare',help:'Ajutor'};
const EN_FILA={home:'Home',insert:'Insert',draw:'Draw',design:'Design',transitions:'Transitions',animations:'Animations',slideshow:'Slide Show',
  record:'Record',review:'Review',view:'View',help:'Help'};
const RO_BUTON={FlyoutAnchorInsertPictures:'Imagini',TableInsertGallery:'Tabel',ShapesInsertGallery:'Forme',SlideNewGallery:'Diapozitiv nou',SlideNewGalleryInsert:'Diapozitiv nou',
  SlideLayoutGallery:'Aspect',ShowNotes:'Note',SlideShowFromBeginning:'De la început',SlideShowFromCurrent:'De la diapozitivul curent',
  ViewThumbnailViewPowerPoint:'Normal',ViewSlideSorterView:'Sortare diapozitive',ViewSlideShowReadingView:'Vizualizare citire',TextBoxInsert:'Casetă text'};
const slugFila=id=>id.replace(/^Tab/,'').toLowerCase();
let IDX=null;
function index(){if(IDX)return IDX;IDX={};const P=window.PANGLICA_POWERPOINT;if(!P)return IDX;
  P.file.forEach(f=>f.grupuri.forEach(g=>g.butoane.forEach(b=>{(IDX[b.id]=IDX[b.id]||[]).push({fila:f.eticheta,grup:g.eticheta,et:b.eticheta||''})})));return IDX}
function panglica(S){
  const P=window.PANGLICA_POWERPOINT,U=window.UiPanglica;
  if(!P||!U)return `<div class="spi-banda-alt">Panglica nu s-a putut încărca.</div>`;
  U.stil();
  const file=ORDINE.map(id=>P.file.find(f=>f.id===id)||(FARA[id]?{id,eticheta:FARA[id],grupuri:[]}:null)).filter(Boolean);
  const P2=Object.assign({},P,{file});
  const TAB={};file.forEach(f=>TAB[f.id]=slugFila(f.id));
  const fila=(file.find(f=>TAB[f.id]===S.tab)||file[0]).id;
  const leg={};
  const pune=(id,t,titlu,on)=>{leg[id]={attr:`data-t="${t}"`,title:titlu,clasa:on?'pg-on':''}};
  pune('ViewThumbnailViewPowerPoint','v:normal-rb','Normal (Normal): fereastra cu cele cinci zone, cu miniaturile în stânga',S.vedere==='normal');
  pune('ViewSlideSorterView','v:sorter','Sortare diapozitive (Slide Sorter): toate diapozitivele, mici',S.vedere==='sorter');
  pune('ViewSlideShowReadingView','v:citire','Vizualizare citire (Reading View)',false);
  pune('ShowNotes','notes-rb','Note (Notes): arată sau ascunde zona de note',S.note);
  pune('SlideShowFromBeginning','show:inceput','De la început (From Beginning) · F5',false);
  pune('SlideShowFromCurrent','show:curent','De la diapozitivul curent (From Current Slide)',false);
  /* butoanele „de găsit”: rămân fără efect, dar au numele românesc în sfatul de la mouse */
  Object.entries(RO_BUTON).forEach(([id,ro])=>{if(!leg[id]){const b=(index()[id]||[])[0];leg[id]={attr:`data-nesim="${id}"`,title:`${ro} (${b&&b.et||id})`}}});
  const gol=FARA[fila]?`<div class="spi-banda-alt">Fila <b>${FARA[fila]}</b> (${RO_FILA[TAB[fila]]}): în lecțiile noastre nu o folosim, așa că aici e goală.</div>`:undefined;
  return U.html(P2,{fila,taburi:TAB,legaturi:leg,atribFila:k=>`data-t="tab-${k}"`,
    fisier:'<button type="button" class="pg-fisier" data-t="tab-file">File</button>',bandaInlocuita:gol});
}

/* ---------------- starea ---------------- */
function init(Q){
  const st=Q.start||{},D=DECKS[st.deck]||{titlu:'Presentation1',diap:[]};
  const slides=clona(D.diap).map(s=>Object.assign({note:''},s));
  return {titlu:D.titlu,slides,note0:slides.map(s=>s.note),cur:Math.min(st.cur||0,Math.max(0,slides.length-1)),tab:st.tab||'home',
    vedere:'normal',stanga:'miniaturi',note:st.note!==false,show:null,edit:false,ev:{},vazut:{},apasat:{},msg:'',curentDin:null};
}
const slideCur=S=>S.slides[S.cur];
function pornesteShow(S,de){
  if(!S.slides.length)return;
  S.edit=false;
  const i=de==='inceput'?0:S.cur;
  S.show={i,final:false,vedereDinainte:S.vedere,alesDinainte:S.cur};
  if(de==='inceput'){S.ev.inceput=1;S.msg='Expunerea a pornit de la primul diapozitiv. Clic (sau →) = înainte, ← = înapoi, Esc = ieși.'}
  else{S.ev.curent=1;S.curentDin=i+1;S.msg=`Expunerea a pornit de la diapozitivul ales (${i+1}). Clic (sau →) = înainte, ← = înapoi, Esc = ieși.`}
}
function inchideShow(S,cum){
  const Sh=S.show;if(!Sh)return;
  /* ca în PowerPoint (probe_ppt.json P7-P9, P13, P17; judecătorul j_probe2.json R3): Esc te lasă pe diapozitivul la care ai
     ieșit, iar Esc pe ecranul negru de final, pe ULTIMUL; CLICUL pe ecranul negru te întoarce la cel ales înainte de expunere */
  S.cur=Sh.final?(cum==='esc'?S.slides.length-1:Sh.alesDinainte):Sh.i;
  S.ev.iesit=1;
  S.vedere=Sh.vedereDinainte==='sorter'?'sorter':'normal';
  S.show=null;
  if(cum==='esc'){S.ev.esc=1;S.msg=`Ai ieșit din expunere cu Esc. Ești din nou în fereastra de lucru, pe diapozitivul ${S.cur+1}.`}
  else S.msg='Expunerea s-a încheiat. Ești din nou în fereastra de lucru.';
}
function act(S,id,arg){
  S.msg='';
  if(S.show){
    if(id==='next'||id==='show-clic'){if(S.show.final){inchideShow(S,'final');return}
      if(S.show.i<S.slides.length-1){S.show.i++;S.msg=`Diapozitivul ${S.show.i+1} din ${S.slides.length}.`}
      else{S.show.final=true;S.ev.final=1;S.msg='Ecranul negru de final. Încă un clic (sau Esc) te scoate.'}return}
    if(id==='prev'){if(S.show.final){S.show.final=false}else if(S.show.i>0)S.show.i--;S.ev.inapoi=1;S.msg=`Înapoi: diapozitivul ${S.show.i+1} din ${S.slides.length}.`;return}
    if(id==='esc'){inchideShow(S,'esc');return}
    return;
  }
  if(id.startsWith('dublu-')){const n=+id.slice(6)-1;if(S.vedere!=='sorter'||n<0||n>=S.slides.length)return;
    S.cur=n;S.vedere='normal';S.ev.normalDupaSorter=1;S.msg=`Dublu clic: diapozitivul ${n+1} se deschide în Normal.`;return}
  if(id.startsWith('mini-')){const n=+id.slice(5)-1;if(n>=0&&n<S.slides.length){S.cur=n;S.edit=false;S.vazut['zona-miniaturi']=1}
    if(S.vedere==='sorter')S.msg=`Ai ales diapozitivul ${n+1}. Ca să lucrezi pe el, treci în Normal (sau dublu clic pe el).`;return}
  if(id.startsWith('tab-')){S.edit=false;S.vazut['zona-panglica']=1;
    if(id==='tab-file'){S.msg='Fila File (Fișier) are operațiile cu fișierul: prezentare nouă, deschidere, salvare. Le înveți în lecția 3; aici nu se deschide.';return}
    S.tab=id.slice(4);const ro=RO_FILA[S.tab],en=EN_FILA[S.tab]||S.tab;S.msg=`Fila ${ro?`${ro} (${en})`:en}: sub ea apar butoanele ei.`;return}
  /* J01, probat (probe_ppt.json P14-P15, j_probe2.json R7): butonul Normal din BARA DE STARE, apăsat când ești deja în Normal,
     schimbă panoul din stânga între miniaturi și Schiță (Outline View); butonul Normal de pe fila View aduce mereu miniaturile */
  if(id==='v:normal'||id==='v:normal-rb'){const era=S.vedere;S.vedere='normal';S.edit=false;
    if(era==='sorter'){S.ev.normalDupaSorter=1;S.msg=`Vizualizarea Normal: din nou cele cinci zone, pe diapozitivul ${S.cur+1}.`;return}
    if(id==='v:normal-rb'){const a=S.stanga;S.stanga='miniaturi';S.msg=a==='schita'?'Normal de pe fila View (Vizualizare): miniaturile au revenit în stânga.':'Ești deja în Normal, cu miniaturile în stânga.';return}
    S.stanga=S.stanga==='schita'?'miniaturi':'schita';S.ev.schita=S.ev.schita||S.stanga==='schita';
    S.msg=S.stanga==='schita'?'Ai apăsat Normal când erai deja în Normal: în stânga apare Schița (Outline View), textul diapozitivelor, în locul miniaturilor. Apasă încă o dată Normal ca să revii la miniaturi.':'Miniaturile au revenit în stânga.';return}
  /* N01 (judecata 2, probat de judecător): Schiță → Sortare → Normal te întoarce tot în Schiță: panoul din stânga rămâne cum era */
  if(id==='v:sorter'){S.vedere='sorter';S.edit=false;S.ev.sorter=1;S.msg='Sortare diapozitive (Slide Sorter): toate diapozitivele, mici, unul lângă altul. Zona de note nu se vede aici.';return}
  if(id==='v:citire'){S.msg='Vizualizare citire (Reading View) arată diapozitivul mare, în fereastră. În lecțiile noastre nu o folosim, așa că în simulator nu se deschide. Pentru public folosești Expunerea (Slide Show).';return}
  if(id==='v:show'){pornesteShow(S,'curent');return}
  if(id==='show:inceput'||id==='f5'){pornesteShow(S,'inceput');return}
  if(id==='show:curent'){pornesteShow(S,'curent');return}
  if(id==='notes-rb'){S.apasat.ShowNotes=1;id='notes'}
  if(id==='notes'){S.note=!S.note;S.edit=false;S.ev.notesToggle=1;S.msg=S.note?'Zona de note se vede din nou, sub diapozitiv.':'Ai ascuns zona de note. O aduci înapoi tot cu Notes (Note), din bara de stare.';return}
  if(id==='esc'){S.edit=false;S.msg='Tasta Esc te scoate dintr-o expunere. Acum nu ești în expunere.';return}
  if(id==='next'||id==='prev'){return}
  if(id.startsWith('zona-')){S.vazut[id]=1;const t={'zona-lucru':'Zona de lucru: diapozitivul ales, mare. Pe el scrii și pui obiecte din lecția 4; aici doar îl privești.',
      'zona-stare':`Bara de stare: acum scrie „Slide ${S.cur+1} of ${S.slides.length}”, adică diapozitivul ${S.cur+1} din ${S.slides.length}.`,
      'zona-miniaturi':'Panoul cu miniaturi: toate diapozitivele, mici, în ordine. Clic pe una ca s-o vezi mare.',
      'zona-panglica':'Panglica: filele, cu butoanele lor.','zona-note':'Zona de note.'};
    if(id==='zona-note'&&S.vedere==='normal'&&S.note){S.edit=true;S.msg='Scrie ce vrei să spui la acest diapozitiv. Publicul nu vede notele. Când ai terminat, dă clic în afara zonei.';return}
    S.msg=t[id]||'';return}
  if(id==='nesim'){const b=arg||{};S.apasat[b.id]=1;
    const ro=RO_BUTON[b.id],fila=RO_FILA[S.tab];
    S.msg=`Ai găsit butonul „${b.et||b.id}”${ro?` (${ro})`:''}: fila ${fila?fila+' (':''}${b.fila||''}${fila?')':''}, grupul ${b.grup||'?'}. În lecția asta doar îl găsești; îl folosești în lecțiile următoare.`;return}
  if(id==='slide'){S.vazut['zona-lucru']=1;S.msg='Zona de lucru: diapozitivul ales, mare. Pe el scrii și pui obiecte din lecția 4; aici doar îl privești.';return}
  if(id==='nota'&&arg){const [d,t]=arg;if(S.slides[d-1]){S.slides[d-1].note=t;S.cur=d-1}return}
}
function ruleaza(S,pasi){(pasi||[]).forEach(p=>{
  if(typeof p==='string'){if(p.startsWith('b:')){const id=p.slice(2),i=(index()[id]||[]).find(x=>RO_FILA[S.tab]&&slugFila('Tab'+x.fila.replace(/\s/g,''))===S.tab)||(index()[id]||[])[0]||{};
      const map={ViewThumbnailViewPowerPoint:'v:normal-rb',ViewSlideSorterView:'v:sorter',ShowNotes:'notes-rb',SlideShowFromBeginning:'show:inceput',SlideShowFromCurrent:'show:curent',ViewSlideShowReadingView:'v:citire'};
      if(map[id])act(S,map[id]);else act(S,'nesim',{id,et:i.et,fila:i.fila,grup:i.grup});return}
    return act(S,p)}
  if(p.nota)return act(S,'nota',p.nota);
})}

/* ---------------- testele (pe starea ferestrei) ---------------- */
const litere=s=>norm(s).replace(/[^a-z]/g,'').length;
const CHK={
  cur:(S,c)=>!S.show&&S.cur===c.n-1,
  tab:(S,c)=>S.tab===c.v,
  vedere:(S,c)=>!S.show&&S.vedere===c.v,
  zona:(S,c)=>!!S.vazut['zona-'+c.z],
  buton:(S,c)=>[].concat(c.id).some(id=>S.apasat[id]),
  nota:(S,c)=>{const s=S.slides[c.d-1];return !!s&&norm(s.note)!==norm(S.note0[c.d-1])&&litere(s.note)-litere(S.note0[c.d-1])>=(c.min||3)},
  noteDoar:(S,c)=>S.slides.every((s,k)=>c.d.includes(k+1)||norm(s.note)===norm(S.note0[k])),
  noteVizibile:(S,c)=>S.note===c.v,
  ev:(S,c)=>!!S.ev[c.e],
  curentDin:(S,c)=>S.curentDin===c.n,
  stanga:(S,c)=>!S.show&&S.vedere==='normal'&&S.stanga===c.v
};
const trece=(S,t)=>t.c.every(c=>CHK[c.k]&&CHK[c.k](S,c));

/* ---------------- desenul ---------------- */
const IC={
  normal:'<svg viewBox="0 0 16 16"><rect x="1.5" y="2.5" width="13" height="11"/><path d="M5 2.5v11"/></svg>',
  sorter:'<svg viewBox="0 0 16 16"><rect x="1.5" y="2.5" width="5" height="4"/><rect x="9.5" y="2.5" width="5" height="4"/><rect x="1.5" y="9.5" width="5" height="4"/><rect x="9.5" y="9.5" width="5" height="4"/></svg>',
  citire:'<svg viewBox="0 0 16 16"><path d="M1.5 3.5h5.5v10H1.5zM9 3.5h5.5v10H9z"/></svg>',
  show:'<svg viewBox="0 0 16 16"><rect x="1.5" y="2.5" width="13" height="8"/><path d="M8 10.5v3M5 13.5h6"/></svg>',
  notes:'<svg viewBox="0 0 16 16"><path d="M3 2.5h10v11H3zM5.5 6h5M5.5 8.5h5M5.5 11h3"/></svg>',
  comm:'<svg viewBox="0 0 16 16"><path d="M2 3h12v8H7l-3 3v-3H2z"/></svg>',
  disp:'<svg viewBox="0 0 16 16"><rect x="1.5" y="2.5" width="11" height="8"/><path d="M5 13.5h5M7.5 10.5v3"/><circle cx="12.5" cy="11.5" r="2"/></svg>'
};
function thumbs(S){
  return S.slides.map((s,k)=>`<button type="button" class="spi-thb${k===S.cur?' on':''}" data-t="mini-${k+1}" aria-label="Miniatura diapozitivului ${k+1}${s.titlu?' „'+esc(s.titlu)+'”':''}${k===S.cur?', aleasă':''}"><i>${k+1}</i><span class="spi-mw"><span class="spi-sw">${slideHTML(s)}</span></span></button>`).join('');
}
/* Schița (Outline View): textul substituenților, pe diapozitive numerotate (captura _cap/win_dupa_normal_2.png: casetele de
   text puse separat și imaginile nu apar) */
function schita(S){
  return S.slides.map((s,k)=>{const r=[];if(s.sub)r.push(`<div class="sc-r sc-sub">${esc(s.sub)}</div>`);
    (s.randuri||[]).forEach(x=>r.push(`<div class="sc-r">• ${esc(x)}</div>`));
    return `<button type="button" class="spi-sc${k===S.cur?' on':''}" data-t="mini-${k+1}" aria-label="Diapozitivul ${k+1} în schiță${s.titlu?' „'+esc(s.titlu)+'”':''}${k===S.cur?', ales':''}"><span class="sc-t"><i>${k+1}</i><span class="sc-ic"></span><b>${esc(s.titlu||'')}</b></span>${r.join('')}</button>`}).join('');
}
function stare(S){
  const vb=(v,t,ro,en)=>`<button type="button" data-t="${t}" class="${S.vedere===v&&!S.show?'on':''}" title="${ro} (${en})" aria-label="${ro} (${en})">${IC[v]}</button>`;
  /* în Normal: Notes, Display Settings, Comments; în Slide Sorter doar Display Settings (probe_ppt.json P5, captura win_sortare) */
  const normal=S.vedere!=='sorter';
  return `<div class="spi-status" data-z="stare"><span class="st-l">Slide ${S.cur+1} of ${S.slides.length}</span><span class="st-r">
    ${normal?`<button type="button" data-t="notes" class="${S.note?'on':''}" title="Note (Notes): arată sau ascunde zona de note" aria-label="Notes (Note)">${IC.notes}Notes</button>`:''}
    <button type="button" data-nesim="Display Settings" title="Setări de afișare (Display Settings)" aria-label="Display Settings (Setări de afișare)">${IC.disp}<span class="st-lung">Display Settings</span></button>
    ${normal?`<button type="button" data-nesim="Comments" title="Comentarii (Comments)" aria-label="Comments (Comentarii)">${IC.comm}<span class="st-lung">Comments</span></button>`:''}
    ${vb('normal','v:normal','Normal','Normal')}${vb('sorter','v:sorter','Sortare diapozitive','Slide Sorter')}${vb('citire','v:citire','Vizualizare citire','Reading View')}${vb('show','v:show','Expunere diapozitive, de la diapozitivul ales','Slide Show')}
    <span class="zoom" aria-hidden="true">– ——+ 60%</span></span></div>`;
}
function appHTML(S){
  const sl=slideCur(S)||{lay:'to',titlu:''};
  let main;
  if(S.vedere==='sorter')main=`<div class="spi-sort" data-z="lucru">${S.slides.map((s,k)=>`<button type="button" class="${k===S.cur?'on':''}" data-t="mini-${k+1}" data-dublu="${k+1}" aria-label="Diapozitivul ${k+1}${k===S.cur?', ales':''}"><span class="spi-mw"><span class="spi-sw">${slideHTML(s)}</span></span><small>${k+1}</small></button>`).join('')}</div>`;
  else{
    const nota=S.edit?`<textarea class="spi-in" aria-label="Notele diapozitivului ${S.cur+1}">${esc(sl.note)}</textarea>`:(sl.note?esc(sl.note):'<span class="ph">Click to add notes</span>');
    main=`<div class="spi-th${S.stanga==='schita'?' sc':''}" data-t="zona-miniaturi" data-z="miniaturi">${S.stanga==='schita'?schita(S):thumbs(S)}</div><div class="spi-col"><div class="spi-work" data-t="slide" data-z="lucru"><div class="spi-sw">${slideHTML(sl)}</div></div>
      ${S.note?`<div class="spi-notes" data-t="zona-note" data-z="note">${nota}</div>`:''}</div>`;
  }
  let show='';
  if(S.show){const s=S.slides[S.show.i];
    show=`<div class="spi-show" data-t="show-clic" role="button" aria-label="Expunerea: atinge ca să mergi mai departe">${S.show.final?'<div class="fin">End of slide show, click to exit.<small>(Sfârșitul expunerii: clic ca să ieși.)</small></div>':`<div class="spi-sw">${slideHTML(s)}</div>`}</div>`}
  return `<div class="spi"><div class="spi-bar">${esc(S.titlu)} - PowerPoint</div><div data-t="zona-panglica" data-z="panglica">${panglica(S)}</div>
    <div class="spi-main">${main}</div>${stare(S)}${show}</div>`;
}

/* ---------------- tipul ppti ---------------- */
function render(Q,body,api){
  stil();
  let S=init(Q);
  body.innerHTML=`<div class="spi-root"><div class="spi-app"></div><div class="spi-msg" aria-live="polite"></div>
    ${Q.taste===false?'<div class="spi-taste" hidden></div>':`<div class="spi-taste" role="group" aria-label="Tastele"><span class="lbl2">Tastele (pe telefon nu le ai: apasă-le aici; merg și cu mouse-ul):</span>
      <button type="button" data-k="f5">F5<small>expunere de la început</small></button><button type="button" data-k="prev">←<small>înapoi</small></button><button type="button" data-k="next">→<small>înainte</small></button><button type="button" data-k="esc">Esc<small>ieși din expunere</small></button></div>`}
    <div class="lbl">Testele tale (se bifează singure)</div><ol class="spi-teste"></ol>
    <div class="sp-unelte"><button type="button" class="btn ghost sm spi-reset">Ia-o de la capăt</button></div></div>`;
  const root=body.querySelector('.spi-root'),app=body.querySelector('.spi-app'),msg=body.querySelector('.spi-msg'),ol=body.querySelector('.spi-teste');
  function side(){
    ol.innerHTML=Q.teste.map(t=>`<li class="${trece(S,t)?'ok':''}">${t.ce}</li>`).join('');
    msg.innerHTML=S.msg?esc(S.msg):(Q.teste.every(t=>trece(S,t))?'Toate testele sunt bifate. Apasă „Verifică”.':'Lucrează în fereastră; testele se bifează singure când sunt gata.');
  }
  function draw(){
    app.innerHTML=appHTML(S);side();
    const ta=app.querySelector('textarea.spi-in');
    if(ta&&!api.done()){try{ta.focus({preventScroll:true});const n=ta.value.length;ta.setSelectionRange(n,n)}catch(e){}
      ta.addEventListener('input',()=>{slideCur(S).note=ta.value;S.msg='';ol.innerHTML=Q.teste.map(t=>`<li class="${trece(S,t)?'ok':''}">${t.ce}</li>`).join('')});
      ta.addEventListener('blur',()=>{if(!S.edit)return;slideCur(S).note=ta.value;S.edit=false;setTimeout(draw,0)})}
  }
  function gest(id,arg){act(S,id,arg);draw()}
  let dublu=null;
  app.addEventListener('click',e=>{
    if(api.done())return;
    if(e.target.closest('textarea.spi-in'))return;
    const nes=e.target.closest('[data-nesim]');
    if(nes&&app.contains(nes)){
      const id=nes.dataset.nesim;
      if(id==='Comments'){S.msg='Comments (Comentarii): în lecțiile noastre nu folosim comentariile.';S.vazut['zona-stare']=1;return draw()}
      if(id==='Display Settings'){S.msg='Display Settings (Setări de afișare): pentru un al doilea ecran, la expunere. În lecțiile noastre nu îl folosim.';S.vazut['zona-stare']=1;return draw()}
      const g=nes.closest('.pg-grup'),grup=g?g.getAttribute('aria-label'):'';
      const P=window.PANGLICA_POWERPOINT,f=P&&P.file.find(x=>slugFila(x.id)===S.tab);
      const b=(index()[id]||[]).find(x=>x.grup===grup)||(index()[id]||[])[0]||{};
      S.vazut['zona-panglica']=1;
      return gest('nesim',{id,et:b.et||nes.getAttribute('aria-label')||id,fila:f?f.eticheta:(b.fila||''),grup:grup||b.grup})}
    const el=e.target.closest('[data-t]');
    if(!el||!app.contains(el))return;
    let id=el.dataset.t;
    if(el.closest('.spi-status'))S.vazut['zona-stare']=1;
    /* dublu clic în Sortare: primul clic redesenează grila, deci evenimentul dblclick nu mai ajunge la același element;
       două clicuri pe același diapozitiv în mai puțin de 500 ms = dublu clic (și pe telefon: două atingeri) */
    if(el.dataset.dublu){const t=Date.now();
      if(dublu&&dublu.n===el.dataset.dublu&&t-dublu.t<500){dublu=null;return gest('dublu-'+el.dataset.dublu)}
      dublu={n:el.dataset.dublu,t}}
    if(id==='zona-panglica'){S.vazut['zona-panglica']=1;S.msg='Panglica: filele, cu butoanele lor. Clic pe numele unei file ca să-i vezi butoanele.';return draw()}
    gest(id);
  });
  /* J06: dublu clic pe un diapozitiv în Sortare diapozitive îl deschide în Normal (ca în PowerPoint) */
  app.addEventListener('dblclick',e=>{const b=e.target.closest('[data-dublu]');if(!b||!app.contains(b)||api.done())return;gest('dublu-'+b.dataset.dublu)});
  /* tastele: F5 și Esc merg și după „Verifică” (focusul e pe buton, în afara ferestrei); în expunere, toate tastele de mers */
  let activ=false;
  const laApasare=e=>{activ=root.isConnected&&root.contains(e.target)};
  const laTasta=e=>{
    if(!root.isConnected){opreste();return}
    const t=e.target,k=e.key;
    /* F5 / Shift+F5 ÎNAINTE de orice altă regulă: prinse oriunde în simulator, INCLUSIV cu cursorul în zona de note
       (GRAV găsit de judecătorul VI/9: tasta ajungea la browser, care reîncărca pagina). Ca în PowerPoint, textul scris în
       note rămâne, iar expunerea pornește. Câmpurile paginii din afara simulatorului (de ex. numele elevului) rămân ale paginii. */
    if(k==='F5'){
      if(t&&t.closest&&!root.contains(t)&&t.closest('input,textarea,select,[contenteditable="true"]'))return;
      e.preventDefault();if(api.done())return;
      const ta=app.querySelector('textarea.spi-in');
      if(S.edit&&ta){slideCur(S).note=ta.value;S.edit=false}
      return gest(e.shiftKey?'show:curent':'f5')}
    if(t&&t.closest&&t.closest('textarea.spi-in')){if(k==='Escape'){e.preventDefault();t.blur()}return}
    if(t&&t.closest&&!root.contains(t)&&t.closest('input,textarea,select,[contenteditable="true"]'))return;
    if(api.done())return;
    if(S.show){
      if(k==='Escape'){e.preventDefault();return gest('esc')}
      if(['ArrowRight','ArrowDown','Enter',' ','PageDown','n','N'].includes(k)){e.preventDefault();return gest('next')}
      if(['ArrowLeft','ArrowUp','Backspace','PageUp','p','P'].includes(k)){e.preventDefault();return gest('prev')}
      return}
    if(k==='Escape'&&activ){e.preventDefault();return gest('esc')}
  };
  function opreste(){document.removeEventListener('pointerdown',laApasare,true);document.removeEventListener('keydown',laTasta)}
  if(window.__simPptIntOpreste)window.__simPptIntOpreste();
  window.__simPptIntOpreste=opreste;
  document.addEventListener('pointerdown',laApasare,true);document.addEventListener('keydown',laTasta);
  root.querySelector('.spi-taste').addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(!b||api.done())return;gest(b.dataset.k)});
  body.querySelector('.spi-reset').onclick=()=>{if(api.done())return;S=init(Q);draw()};
  draw();
  body._spi={rez:()=>{S=init(Q);ruleaza(S,Q.rez);draw()},gresit:()=>{S=init(Q);ruleaza(S,Q.gresit);draw()},stare:()=>S};
  const nav=api.checkButton(()=>{
    if(S.edit){const ta=app.querySelector('textarea.spi-in');if(ta)slideCur(S).note=ta.value;S.edit=false;draw()}
    const lipsa=Q.teste.find(t=>!trece(S,t));
    if(!lipsa){nav.innerHTML='';api.resolve(true);return}
    api.resolve(false,`Mai ai de făcut: ${strip(lipsa.ce)}.${lipsa.ajutor?' '+lipsa.ajutor:''}`);
    api.revealButton(()=>{S=init(Q);ruleaza(S,Q.rez);draw();nav.innerHTML='';api.giveUp(`am făcut acum pașii în simulator: ${Q.rezText}.`)});
  });
}
function rezolva(Q,body){if(body._spi)body._spi.rez()}
function gresit(Q,body){if(body._spi)body._spi.gresit()}

/* ---------------- tipul zona: numere mari peste zonele unei capturi reale ---------------- */
const zona={
  render(Q,body,api){
    stil();
    const I=Q.img;
    body.innerHTML=`<div class="spz"><div class="spz-img"><img src="${esc(I.src)}" alt="${esc(I.alt)}" width="${I.w}" height="${I.h}">${Q.zone.map(z=>`<button type="button" class="spz-nr" data-z="${esc(z.z)}" style="left:${z.nx!=null?z.nx:z.x+z.w/2}%;top:${z.ny!=null?z.ny:z.y+z.h/2}%" aria-label="Zona ${z.nr}">${z.nr}</button>`).join('')}</div></div>`;
    const bs=[...body.querySelectorAll('.spz-nr')];
    bs.forEach(b=>b.onclick=()=>{
      if(api.done())return;const z=b.dataset.z;
      if(z===Q.ok){b.classList.add('ok');api.resolve(true)}
      else{b.classList.add('bad');api.resolve(false,(Q.gresitMsg&&Q.gresitMsg[z])||'Nu e zona asta. Uită-te din nou la captură.');
        api.revealButton(()=>{bs.forEach(x=>x.classList.toggle('ok',x.dataset.z===Q.ok));api.giveUp(`zona ${Q.zone.find(z=>z.z===Q.ok).nr}.`)})}
    });
    body._spz={bs};
  },
  rezolva(Q,body){const b=body.querySelector(`.spz-nr[data-z="${Q.ok}"]`);if(b)b.click()},
  gresit(Q,body){const b=[...body.querySelectorAll('.spz-nr')].find(x=>x.dataset.z!==Q.ok);if(b)b.click()}
};

window.SimPPTInt={render,rezolva,gresit,zona,
  prezentari:o=>Object.assign(DECKS,o),imagini:o=>Object.assign(IMG,o),
  _intern:{init,act,ruleaza,CHK,trece,LAY,DECKS,slideHTML}};
})();
