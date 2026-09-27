/* ======================================================================================================
   lectii/_sim/simppt.js — PowerPoint simulat, COMUN lecțiilor de la clasa a VI-a (modulul 1).
   Proprietar: autorul lecției VI-M1-L5 („Editarea prezentării”). Standardul: _campaign/revizuire_completa_2026_09/
   05_STANDARD_LECTIE.md, „Simulatoarele din lecțiile nr. 4”.

   BAZA: SimPPT din lectii/vi/m1-l04/index.html DUPĂ reparații (_verificare/reparatii.md, 27.09.2026 seara; pagina
   cu sha256 3e3ad337…b6698, vezi lectii/vi/m1-l05/surse.md): tastele pe document (J01), câmpurile de scris pe mai
   multe rânduri, Enter = rând nou (J02), filele contextuale Picture/Shape Format, Table Design (J03), dublul clic
   pe fișier (J07), obiectul intră în primul substituent gol (J08), grila tabelului pe atingere (J09), 6 iconițe (J18).
   Lecția 4 rămâne deocamdată cu copia ei.

   ADĂUGAT pentru lecția 5 (editarea), fidel PowerPoint-ului (probe COM + desktop ascuns: lectii/vi/m1-l05/_proba/):
   - panoul cu miniaturi: clic = alegi; clic dreapta (pe telefon: ții degetul apăsat, apoi îl ridici) = meniul real al
     miniaturii (Cut, Copy, Paste Options, New Slide, Duplicate Slide, Delete Slide, Add Section, Layout, Reset Slide,
     Format Background..., Photo Album..., Hide Slide, New Comment); tragerea miniaturii mută diapozitivul, cu linia
     care arată locul (pe telefon: ții apăsat o clipă, apoi tragi);
   - Duplicate Slide / Ctrl+D / New Slide ▾ → Duplicate Selected Slides / Copy ▾ → Duplicate: copia apare imediat
     după original și devine cea aleasă;
   - Delete (Backspace) cu miniatura aleasă șterge diapozitivul; rămâne ales cel care i-a luat locul (ultimul, dacă
     ai șters ultimul) — la fel după Cut;
   - Copy/Cut/Paste (Ctrl+C/X/V, panglica Home › Clipboard, meniurile de clic dreapta) pentru diapozitive ȘI obiecte:
     diapozitivul lipit apare după cel ales (cu miniaturile active sau cu diapozitivul activ); obiectul lipit ajunge pe
     diapozitivul ales, în același loc ca originalul; pe același diapozitiv, deplasat cu 12 puncte;
   - obiectele se mută trăgându-le (caseta de text și substituentul: și de chenar), cu săgețile puțin câte puțin;
     Delete șterge obiectul ales; Esc în timp ce scrii alege caseta întreagă; Ctrl+Z anulează pe rând, Ctrl+Y reface;
   - sub fereastră: butoanele tastelor (Delete, Ctrl+C, Ctrl+X, Ctrl+V, Ctrl+Z), pentru telefon.
   După judecătorul lecției 5 (lectii/vi/m1-l05/_verificare/reparatii.md): clic dreapta pe fundal = meniul diapozitivului,
   pe text = meniul textului (J02); scrisul intră în lista de anulare doar dacă a schimbat ceva, iar Ctrl+Z din câmpul
   neatins anulează pasul dinainte (J03); caseta, tabelul și substituentul se trag doar de chenar (J04); testul copieDin (J10).
   Abateri spuse pe ecran: în celulele tabelului nu se scrie; mânerele (cerculețele) nu schimbă mărimea (lecția 6);
   un substituent copiat se lipește ca o casetă de text; prezentarea nu rămâne fără niciun diapozitiv; filele
   contextuale nu au butoane.
   Verificarea e pe STAREA prezentării (teste numite), nu pe drumul clicurilor: orice drum bun trece.
   Întrebare: {t:'ppt', q, start:{deck,cur}, fisiere?, teste:[{ce, c:[condiții], ajutor?}], rez:[pași], gresit:[pași], rezText, why}
   Prezentări noi: SimPPT.prezentari({nume:()=>[SimPPT.diap(id,aspect,{titlu,…},[obiecte])…]})
   ====================================================================================================== */
(function(){
'use strict';
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const strip=s=>String(s).replace(/<[^>]+>/g,'');
const norm=s=>String(s==null?'':s).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[„”"“«»]/g,'').replace(/\s+/g,' ').trim().toLowerCase();
const clona=o=>JSON.parse(JSON.stringify(o));

/* ---------------- aspectul simulatorului (culori fixe: arată ca aplicația, în orice temă) ---------------- */
const CSS=`
.sp-root{max-width:760px;margin:0 auto}
.sp{--paper:#FFFFFF;--paper2:#F3F3F3;--ink:#222222;--ink2:#5A5A5A;--line:#D4D4D4;--sel:#FBE3DB;--xlg:#B7472A;position:relative;
  border:1px solid #AEB8BB;border-radius:6px;overflow:hidden;background:#F3F3F3;color:#222;font:13px/1.3 "Segoe UI",system-ui,sans-serif;text-align:left}
.sp button{font:inherit;color:inherit;cursor:pointer;margin:0}
.sp-bar{background:#B7472A;color:#fff;padding:4px 8px;font-size:12px;overflow-wrap:anywhere}
.sp .rb.pg{background:#fff}
.sp-split{display:flex;flex-direction:column;width:100%;height:62px;max-height:100%;align-self:flex-start}
.sp-split button{border:1px solid transparent;background:none;border-radius:3px;padding:0;display:flex;align-items:center;justify-content:center;min-height:0}
.sp-split button:hover,.sp-split button:focus-visible{border-color:#B7472A;background:#FBE3DB}
.sp-split-a{flex:0 0 52%}
.sp-split-a svg{width:24px;height:24px;fill:currentColor}
.sp-split-b{flex:1 1 auto;font-size:.68rem;line-height:1.05;text-align:center}
.sp-mic{display:flex;width:100%;height:100%}
.sp-mic button{border:1px solid transparent;background:none;border-radius:3px;padding:0;display:flex;align-items:center;justify-content:center}
.sp-mic button:hover,.sp-mic button:focus-visible{border-color:#B7472A;background:#FBE3DB}
.sp-mic .a{flex:1 1 auto}.sp-mic .b{flex:0 0 11px;font-size:9px}
.sp-mic svg{width:16px;height:16px;fill:currentColor}
.sp-simple{display:flex;flex-wrap:wrap;gap:4px;padding:6px;background:#fff;border-bottom:1px solid #D0D0D0}
.sp-simple .tabs{display:flex;gap:2px;width:100%}
.sp-sb{border:1px solid #D2D2D2;background:#FAFAFA;border-radius:3px;padding:5px 8px}
.sp-menu{background:#fff;border:1px solid #9E9E9E;margin:6px;box-shadow:0 2px 8px rgba(0,0,0,.18);padding:4px 6px 8px}
.sp-mt{display:flex;justify-content:space-between;align-items:center;gap:8px;font-weight:700;padding:3px 4px;background:#F0F0F0;margin-bottom:6px}
.sp-x{border:0;background:none;font-size:18px;line-height:1;padding:0 6px}
.sp-gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(94px,1fr));gap:6px}
.sp-tile{border:1px solid #D0D0D0;background:#fff;border-radius:3px;padding:4px;display:flex;flex-direction:column;gap:3px;text-align:center;font-size:11px;line-height:1.15}
.sp-tile:hover,.sp-tile:focus-visible{border-color:#B7472A;background:#FBE3DB}
.sp-lt{position:relative;display:block;aspect-ratio:16/9;border:1px solid #BDBDBD;background:#fff}
.sp-lt i{position:absolute;border:1px dashed #9A9A9A;box-sizing:border-box}
.sp-mi{display:block;width:100%;text-align:left;border:0;background:none;padding:6px 8px;border-radius:3px}
.sp-mi:hover,.sp-mi:focus-visible{background:#FBE3DB}
.sp-mi.gri{color:#8A8A8A}
.sp-grid{display:grid;grid-template-columns:repeat(10,20px);gap:2px;margin:4px 0 8px}
.sp-cel{width:20px;height:17px;border:1px solid #BDBDBD;background:#fff;padding:0;border-radius:1px}
.sp-cel.on{background:#F4B9A6;border-color:#B7472A}
.sp-gr{font-weight:700;font-size:12px;padding:4px 2px 2px;color:#444}
.sp-shp{display:flex;flex-wrap:wrap;gap:6px}
.sp-shp button{border:1px solid #E0E0E0;background:#fff;border-radius:3px;padding:4px;width:84px;display:flex;flex-direction:column;align-items:center;gap:2px;font-size:10.5px;line-height:1.1}
.sp-shp button:hover,.sp-shp button:focus-visible{border-color:#B7472A;background:#FBE3DB}
.sp-shp svg{width:30px;height:22px}
.sp-dlg{background:#fff;border:1px solid #7A7A7A;margin:6px;box-shadow:0 3px 12px rgba(0,0,0,.25)}
.sp-dt{border-bottom:1px solid #DDD;padding:6px 8px;font-weight:600;display:flex;justify-content:space-between;align-items:center}
.sp-path{font-size:12px;color:#444;padding:6px 8px;background:#F7F7F7;border-bottom:1px solid #E5E5E5}
.sp-files{display:flex;flex-wrap:wrap;gap:8px;padding:8px}
.sp-file{width:84px;border:1px solid transparent;background:none;border-radius:3px;padding:4px;display:flex;flex-direction:column;align-items:center;gap:3px;font-size:11.5px}
.sp-file svg{width:54px;height:54px}
.sp-file:hover{background:#E5F3FF}
.sp-file.on{background:#CCE8FF;border-color:#99D1FF}
.sp-dfoot{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:flex-end;padding:8px;border-top:1px solid #E5E5E5}
.sp-dfoot .fn{flex:1 1 150px;font-size:12px;overflow-wrap:anywhere}
.sp-b{border:1px solid #ADADAD;background:#FDFDFD;border-radius:3px;padding:5px 14px}
.sp-b.prim{background:#B7472A;color:#fff;border-color:#B7472A}
.sp-num{display:flex;flex-wrap:wrap;gap:6px 14px;padding:8px 10px}
.sp-num label{display:flex;align-items:center;gap:6px;font-size:12px}
.sp-num input{width:60px;padding:4px;border:1px solid #888;font:inherit;font-size:16px;color:#111;background:#fff}
.sp-main{display:grid;grid-template-columns:70px minmax(0,1fr);gap:6px;padding:6px;background:#E6E6E6}
.sp-thumbs{display:flex;flex-direction:column;gap:6px;min-width:0;position:relative;padding:2px 0}
.sp-th{display:flex;gap:3px;border:0;background:none;padding:0;align-items:flex-start;text-align:left;min-width:0;
  touch-action:manipulation;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
.sp-th i{font-style:normal;font-size:10px;width:10px;flex:none}
.sp-th.on i{color:#B7472A;font-weight:700}
.sp-mini{flex:1 1 auto;min-width:0;border:1px solid #B5B5B5;background:#fff;display:block;pointer-events:none}
.sp-th.on .sp-mini{outline:2px solid #B7472A}
.sp-th.peMini .sp-mini{outline:3px solid #B7472A}
.sp-th.sp-trage{opacity:.35}
.sp-th.sp-ridicat .sp-mini{outline:3px solid #1F6FD0;box-shadow:0 3px 8px rgba(0,0,0,.35)}
.sp-ins{position:absolute;background:#B7472A;border-radius:2px;pointer-events:none;z-index:5}
.sp-sw{container-type:inline-size;min-width:0;display:block}
.sp-slide{position:relative;aspect-ratio:16/9;background:#fff;color:#000;overflow:hidden;font-family:Calibri,Carlito,"Segoe UI",Arial,sans-serif;line-height:1.12}
.sp-work .sp-slide{box-shadow:0 1px 3px rgba(0,0,0,.35)}
.sp-slide.armat{cursor:crosshair;outline:2px dashed #B7472A;outline-offset:-2px}
.sp-ph,.sp-o{position:absolute;box-sizing:border-box;font-size:calc(var(--pt,18) * 100cqw / 960)}
.sp-ph{padding:0 .25em;display:flex;flex-direction:column;cursor:text}
.sp-vt{justify-content:flex-start}.sp-vm{justify-content:center}.sp-vb{justify-content:flex-end}
.sp-c{text-align:center}
.sp-title,.sp-vtitle{font-family:"Calibri Light",Calibri,Carlito,"Segoe UI",Arial,sans-serif}
.sp-ph.gol{border:1px dashed #A6A6A6}
.sp-prompt{color:#7F7F7F}
.sp-ph ul{margin:0;padding-left:1.05em}
.sp-ph li{margin:.12em 0}
.sp-vbody,.sp-vtitle{writing-mode:vertical-rl}
.sp-icons{position:absolute;left:50%;top:58%;transform:translate(-50%,-50%);display:grid;grid-template-columns:repeat(3,auto);gap:.3em}
.sp .sp-ic{width:max(1.4em,15px);height:max(1.4em,15px);border:0;background:none;padding:0;color:#8A8A8A;display:flex;border-radius:2px}
.sp-ic svg{width:100%;height:100%;fill:currentColor}
.sp .sp-ic:hover,.sp .sp-ic:focus-visible{color:#B7472A;background:#FBE3DB}
.sp-ph.sel,.sp-o.sel{outline:1px solid #6E6E6E}
.sp-ph.ed,.sp-o.ed{outline:1px dashed #6E6E6E}
.sp-h{position:absolute;width:9px;height:9px;border:1px solid #6E6E6E;background:#fff;border-radius:50%;z-index:5}
.sp-o{cursor:move}
.sp-o.sel,.sp-ph.sel{touch-action:none}
.sp-o.sp-mut,.sp-ph.sp-mut{opacity:.8;z-index:7}
.sp-ram{position:absolute;touch-action:none;cursor:move}   /* fără z-index: chenarul unui obiect stă sub obiectele puse după el (ca în PowerPoint, clicul nimerește obiectul de deasupra) */
.sel>.sp-ram,.ed>.sp-ram{z-index:4}
.sp-o-caseta{white-space:pre;padding:.1em .2em;min-width:1.2em;min-height:1.2em;cursor:text}
.sp-o-imagine svg,.sp-o-forma svg{display:block;width:100%;height:100%;pointer-events:none}
.sp-o-tabel table{width:100%;border-collapse:collapse;table-layout:fixed}
.sp-o-tabel td{border:1px solid #fff;padding:.2em .35em;background:#CFD5EA;height:1.6em;overflow:hidden;white-space:nowrap}
.sp-o-tabel tr:first-child td{background:#4472C4;color:#fff;font-weight:700}
.sp-o-tabel tr:nth-child(odd):not(:first-child) td{background:#E9EBF5}
.sp-in{position:relative;z-index:4;display:block;width:100%;min-width:3em;box-sizing:border-box;font:inherit;font-size:max(16px,1em);line-height:1.2;color:#000;background:#fff;border:1px solid #B7472A;padding:1px 3px;margin:0;resize:none;overflow:hidden}
.sp-content .sp-in,.sp-vbody .sp-in{min-height:4.6em}
.sp-o-caseta .sp-in{width:auto;field-sizing:content}
.sp-ctxnota{flex:1 1 auto;min-width:0;white-space:normal;padding:6px 10px;font-size:12px;line-height:1.35;color:#333;text-align:left}
.sp-ctxnota small{display:block;color:#777}
.sp-tblnota:empty{display:none}
.sp-tblnota{margin:0 0 6px;padding:5px 8px;background:#FFF4CE;border:1px solid #E8C44A;border-radius:3px;font-size:12px;line-height:1.35;max-width:300px}
.sp-notes{background:#fff;border-top:1px solid #C8C8C8;padding:5px 8px;font-size:12px;color:#8A8A8A;cursor:default}
.sp-status{display:flex;justify-content:space-between;gap:8px;background:#EDEDED;border-top:1px solid #C8C8C8;padding:3px 8px;font-size:11px}
.sp-cm{position:absolute;z-index:30;overflow-y:auto;overscroll-behavior:contain;background:#fff;border:1px solid #BDBDBD;box-shadow:0 3px 12px rgba(0,0,0,.28);width:236px;max-width:calc(100% - 8px);padding:4px 0;font-size:13px}
.sp-cm .it{display:flex;align-items:center;gap:8px;width:100%;border:0;background:none;padding:5px 10px;text-align:left;line-height:1.2}
.sp-cm .it:hover,.sp-cm .it:focus-visible{background:#EDEDED}
.sp-cm .it.gri{color:#9A9A9A}
.sp-cm .it .ic{width:18px;flex:none;text-align:center;color:#555;display:flex;justify-content:center}
.sp-cm .it .ic svg{width:16px;height:16px;fill:#555}
.sp-cm .ro{color:#8A8A8A;font-size:11px;margin-left:auto;padding-left:6px;text-align:right}
.sp-cm .sep{height:1px;background:#E1E1E1;margin:3px 0}
.sp-cm .srch{display:block;margin:2px 8px 6px;border:1px solid #BDBDBD;color:#767676;padding:4px 6px;font-size:12px;background:#fff;width:calc(100% - 16px);text-align:left}
.sp-cm .po{padding:3px 10px 2px 36px;font-weight:600}
.sp-po{display:flex;gap:4px;padding:0 10px 4px 36px}
.sp-po button{width:34px;height:34px;border:1px solid transparent;background:none;border-radius:2px;display:flex;align-items:center;justify-content:center}
.sp-po button:hover,.sp-po button:focus-visible{border-color:#B7472A;background:#FBE3DB}
.sp-po button.gri{opacity:.45}
.sp-po svg{width:20px;height:20px;fill:#555}
.sp-msg{margin:10px 0 4px;padding:7px 10px;border-radius:6px;background:var(--paper2);border:1px solid var(--line);font-size:.93rem;min-height:1.4em}
.sp-teste{margin:4px 0 8px;padding-left:1.6em}
.sp-teste li{margin:3px 0;color:var(--ink2)}
.sp-teste li.ok{color:var(--ok);font-weight:600}
.sp-teste li.ok::marker{content:"✓  "}
.sp-unelte{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.sp-taste{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0 6px}
.sp-taste .lbl2{font-size:.85rem;color:var(--ink2);flex:1 0 100%}
.sp-taste button{min-height:40px;min-width:48px;padding:4px 10px;border:1px solid var(--line);border-bottom-width:3px;border-radius:6px;background:var(--paper);color:var(--ink);font:600 .9rem/1.1 var(--fm,monospace);cursor:pointer}
.sp-taste button small{display:block;font:400 .7rem/1.1 var(--fb,sans-serif);color:var(--ink2)}
@media (pointer:coarse){.sp-cm .it{padding:8px 10px}.sp-grid{grid-template-columns:repeat(10,26px)}.sp-cel{width:26px;height:24px}}
@media (max-width:560px){
  .sp-main{grid-template-columns:minmax(0,1fr)}
  .sp-thumbs{flex-direction:row;flex-wrap:wrap;gap:8px 6px}
  .sp-th{flex:0 0 calc(33.33% - 4px)}   /* 3 pe rând: miniaturi destul de mari pentru deget, toate la vedere (fără derulare laterală în timpul tragerii) */
}`;
function stil(){if(document.getElementById('simppt-css'))return;const s=document.createElement('style');s.id='simppt-css';s.textContent=CSS;document.head.appendChild(s)}

/* geometria reală a machetelor (PowerPoint 16.0, tema Office, 16:9), în % din diapozitiv; pt = mărimea literelor */
const T={k:'titlu',tip:'title',x:6.9,y:5.3,w:86.2,h:19.3,pt:44,p:'Click to add title',v:'m'};
const CT=(k,x,y,w,h,pt)=>({k,tip:'content',x,y,w,h,pt:pt||28,p:'Click to add text',v:'t'});
const BD=(k,x,y,w,h,pt,p)=>({k,tip:'body',x,y,w,h,pt:pt||24,p:p||'Click to add text',v:'t'});
const TC=(pt)=>({k:'titlu',tip:'title',x:6.9,y:6.7,w:32.3,h:23.3,pt:pt||32,p:'Click to add title',v:'b'});
const LAY={
  title:{n:'Title Slide',ph:[{k:'titlu',tip:'title',x:12.5,y:16.4,w:75,h:34.8,pt:60,p:'Click to add title',v:'b',al:'c'},BD('sub',12.5,52.5,75,24.1,24,'Click to add subtitle')].map((p,i)=>i===1?Object.assign(p,{al:'c'}):p)},
  tc:{n:'Title and Content',ph:[T,CT('c1',6.9,26.6,86.2,63.4)]},
  sec:{n:'Section Header',ph:[{k:'titlu',tip:'title',x:6.8,y:24.9,w:86.2,h:41.6,pt:60,p:'Click to add title',v:'b'},BD('b1',6.8,66.9,86.2,21.9)]},
  two:{n:'Two Content',ph:[T,CT('c1',6.9,26.6,42.5,63.4),CT('c2',50.6,26.6,42.5,63.4)]},
  comp:{n:'Comparison',ph:[T,BD('b1',6.9,24.5,42.3,12),CT('c1',6.9,36.5,42.3,53.7),BD('b2',50.6,24.5,42.5,12),CT('c2',50.6,36.5,42.5,53.7)]},
  to:{n:'Title Only',ph:[T]},
  blank:{n:'Blank',ph:[]},
  cap:{n:'Content with Caption',ph:[TC(),CT('c1',42.5,14.4,50.6,71.1,32),BD('b1',6.9,30,32.3,55.6,16)]},
  pcap:{n:'Picture with Caption',ph:[TC(),{k:'c1',tip:'pic',x:42.5,y:14.4,w:50.6,h:71.1,pt:32,p:'Click icon to add picture',v:'t'},BD('b1',6.9,30,32.3,55.6,16)]},
  vt:{n:'Title and Vertical Text',ph:[T,{k:'c1',tip:'vbody',x:6.9,y:26.6,w:86.2,h:63.4,pt:28,p:'Click to add text',v:'t'}]},
  vtt:{n:'Vertical Title and Text',ph:[{k:'titlu',tip:'vtitle',x:71.6,y:5.3,w:21.6,h:84.7,pt:44,p:'Click to add title',v:'t'},{k:'c1',tip:'vbody',x:6.9,y:5.3,w:63.4,h:84.7,pt:28,p:'Click to add text',v:'t'}]}
};
const ORD=['title','tc','sec','two','comp','to','blank','cap','pcap','vt','vtt'];

/* „fișierele” din folderul Imagini al calculatorului simulat (desene, nu fotografii) */
const FIS={
  'soare.png':'<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" fill="#10131F"/><g stroke="#F7A600" stroke-width="5" stroke-linecap="round"><path d="M50 8v12M50 80v12M8 50h12M80 50h12M20 20l9 9M71 71l9 9M80 20l-9 9M29 71l-9 9"/></g><circle cx="50" cy="50" r="23" fill="#FFB000"/><circle cx="50" cy="50" r="23" fill="none" stroke="#FF6A00" stroke-width="4"/></svg>',
  'pamant.png':'<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" fill="#0B1026"/><circle cx="50" cy="50" r="34" fill="#2F7BD8"/><path d="M30 36q10-10 20-2t8 14-12 10-14-6zM58 62q8-6 14 0t-2 10-12-2z" fill="#3DAA55"/><circle cx="50" cy="50" r="34" fill="none" stroke="#9CC9FF" stroke-width="2"/></svg>',
  'luna.png':'<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" fill="#0B0D14"/><circle cx="50" cy="50" r="33" fill="#C9C9C9"/><circle cx="40" cy="40" r="7" fill="#A9A9A9"/><circle cx="60" cy="58" r="9" fill="#ABABAB"/><circle cx="58" cy="34" r="4" fill="#B1B1B1"/></svg>',
  'marte.png':'<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" fill="#0B0D14"/><circle cx="50" cy="50" r="31" fill="#C1440E"/><path d="M30 44q12-6 22 0t18 2" stroke="#8E2F08" stroke-width="5" fill="none"/><circle cx="60" cy="62" r="5" fill="#9A3509"/></svg>'
};
const FORME=[
  ['Rectangles',[['rect','Rectangle'],['rrect','Rectangle: Rounded Corners']]],
  ['Basic Shapes',[['oval','Oval'],['tri','Isosceles Triangle']]],
  ['Block Arrows',[['arrowR','Arrow: Right'],['arrowL','Arrow: Left']]],
  ['Stars and Banners',[['star5','Star: 5 Points']]]
];
const NUME_FORMA={};FORME.forEach(g=>g[1].forEach(([k,n])=>NUME_FORMA[k]=n));
const SVGF={rect:'<rect x="2" y="2" width="96" height="96"/>',rrect:'<rect x="2" y="2" width="96" height="96" rx="16"/>',
  oval:'<ellipse cx="50" cy="50" rx="48" ry="48"/>',tri:'<polygon points="50,2 98,98 2,98"/>',
  arrowR:'<polygon points="2,28 58,28 58,3 98,50 58,97 58,72 2,72"/>',arrowL:'<polygon points="98,28 42,28 42,3 2,50 42,97 42,72 98,72"/>',
  star5:'<polygon points="50,3 61,37 97,37 68,59 79,95 50,73 21,95 32,59 3,37 39,37"/>'};
/* culoarea implicită a formelor: albastrul temei Office; o formă din prezentările de lucru poate avea alta (culoare:'aur') */
const CULORI={aur:['#FFC000','#BF9000']};
const forma=(k,cls,cul)=>{const [f,s]=CULORI[cul]||['#4472C4','#2F528F'];return `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"${cls?` class="${cls}"`:''}><g fill="${f}" stroke="${s}" stroke-width="2" vector-effect="non-scaling-stroke">${SVGF[k]}</g></svg>`};
/* iconițele din substituentul de conținut: 6, ca în captura reală (J18; setul exact NESIGUR). Doar Insert Table și Pictures fac ceva. */
const IC={
  tabel:['Insert Table','<svg viewBox="0 0 20 20"><path d="M2 3h16v14H2zm1.5 1.5v3h4v-3zm5.5 0v3h7.5v-3zM3.5 9v2.5h4V9zm5.5 0v2.5h7.5V9zm-5.5 4v2.5h4V13zm5.5 0v2.5h7.5V13z"/></svg>'],
  grafic:['Insert Chart','<svg viewBox="0 0 20 20"><path d="M3 16h14v1.5H3zM4 9h3v6H4zm4.5-4h3v10h-3zM13 7h3v8h-3z"/></svg>'],
  smart:['Insert a SmartArt Graphic','<svg viewBox="0 0 20 20"><path d="M2 4h6v4H2zm10 0h6v4h-6zM7 12h6v4H7zM5 8h1.5v2h7V8H15v3.5H5z"/></svg>'],
  imagine:['Pictures','<svg viewBox="0 0 20 20"><path d="M2 4h16v12H2zm1.5 1.5v7.4l3.8-3.8 3 3 2.2-2.2 4 4V5.5zM13.5 6.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/></svg>'],
  video:['Insert Video','<svg viewBox="0 0 20 20"><path d="M2 5h11v10H2zm12 3l4-2.5v9L14 12z"/></svg>'],
  icon:['Insert an Icon','<svg viewBox="0 0 20 20"><path d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm-3 6a1.2 1.2 0 1 0 0 2.4A1.2 1.2 0 0 0 7 8zm6 0a1.2 1.2 0 1 0 0 2.4A1.2 1.2 0 0 0 13 8zm-6.5 4.5q3.5 3 7 0l1 .9q-4.5 4-9 0z"/></svg>']
};
/* iconițe mici pentru meniurile de clic dreapta (desene simple, ca reper; eticheta e cea din aplicație) */
const MI={
  cut:'<svg viewBox="0 0 20 20"><path d="M6 13a2.5 2.5 0 1 1-.01 0zm8 0a2.5 2.5 0 1 1-.01 0zM7 12.5 13.5 3l1.2.8-5.6 8.4zm6 0L6.5 3l-1.2.8 5.6 8.4z"/></svg>',
  copy:'<svg viewBox="0 0 20 20"><path d="M6 2h8l3 3v10H6zm1.5 1.5v10h8V5.8L13.7 3.5zM3 6h1.5v10.5H12V18H3z"/></svg>',
  paste:'<svg viewBox="0 0 20 20"><path d="M7 2h6v2h3v14H4V4h3zm1.5 1.5v1.5h3V3.5zM5.5 5.5v11h9v-11H13V7H7V5.5z"/></svg>',
  pic:'<svg viewBox="0 0 20 20"><path d="M2 4h16v12H2zm1.5 1.5v7.4l3.8-3.8 3 3 2.2-2.2 4 4V5.5z"/></svg>',
  txt:'<svg viewBox="0 0 20 20"><path d="M4 4h12v2.5h-1.5V5.5h-3.8V15H12v1.5H8V15h1.3V5.5H5.5v1H4z"/></svg>',
  nou:'<svg viewBox="0 0 20 20"><path d="M2 4h13v10H2zm1.5 1.5v7h10v-7zM16 12h1.5v2.5H20V16h-2.5v2.5H16V16h-2.5v-1.5H16z"/></svg>',
  dub:'<svg viewBox="0 0 20 20"><path d="M5 2h13v10H5zm1.5 1.5v7h10v-7zM2 6h1.5v8.5H14V16H2z"/></svg>',
  del:'<svg viewBox="0 0 20 20"><path d="M2 4h13v10H2zm1.5 1.5v7h10v-7zM13 13.5l1-1 2 2 2-2 1 1-2 2 2 2-1 1-2-2-2 2-1-1 2-2z"/></svg>'
};
const HANDLES=[[0,0],[50,0],[100,0],[0,50],[100,50],[0,100],[50,100],[100,100]].map(([x,y])=>`<span class="sp-h" data-t="maner" style="left:calc(${x}% - 5px);top:calc(${y}% - 5px)"></span>`).join('');
const RAMA=(t)=>['top:-8px;left:-8px;right:-8px;height:9px','bottom:-8px;left:-8px;right:-8px;height:9px','top:-8px;bottom:-8px;left:-8px;width:9px','top:-8px;bottom:-8px;right:-8px;width:9px']
  .map(p=>`<span class="sp-ram" data-t="${t}" style="${p}" aria-hidden="true"></span>`).join('');

let uid=0;
const diap=(id,lay,t,obj)=>({id,lay,t:t||{},obj:obj||[]});
const DECKS={
  nou:()=>[diap('d1','title')],
  solar:()=>[diap('d1','title',{titlu:'Sistemul solar',sub:'Ana Pop, clasa a VI-a'}),diap('d2','tc',{titlu:'Cuprins',c1:'Soarele\nPlanetele\nCe reținem'}),
    diap('d3','to',{titlu:'Soarele'},[{tip:'caseta',x:4.2,y:27.8,pt:24,txt:'Steaua din centrul\nSistemului solar'},
      {tip:'tabel',x:4.2,y:51.9,w:41.7,h:22.2,c:2,r:3,pt:18,cel:[['Soarele','În cifre'],['Vârsta','cam 4,6 miliarde de ani'],['Până la Pământ','150 milioane km']]},
      {tip:'forma',forma:'arrowR',x:49,y:46.3,w:15.6,h:14.8},{tip:'imagine',fis:'soare.png',x:67.7,y:27.8,w:27.1,h:45.9}])],
  planete:()=>[diap('d1','title',{titlu:'Sistemul solar',sub:'Ana Pop, clasa a VI-a'}),diap('d2','tc',{titlu:'Planetele'}),diap('d3','tc',{titlu:'Luna'})],
  marte:()=>[diap('d1','title',{titlu:'Planetele',sub:'Dan Pop, clasa a VI-a'}),diap('d2','to',{titlu:'Marte'})]
};
function init(Q){
  const st=Q.start||{};
  const slides=(DECKS[st.deck]||DECKS.nou)();
  slides.forEach(s=>{s.t=s.t||{};s.obj=(s.obj||[]).map(o=>Object.assign({},o,{id:'o'+(++uid)}))});
  return {slides,cur:Math.min(st.cur||0,slides.length-1),tab:st.tab||'home',menu:null,dlg:null,armed:null,sel:null,edit:null,msg:'',
    hist:[],redo:[],vazut:{},ev:{},tblHover:null,cm:null,clip:null,peMini:!!st.peMini};
}
const slideCur=S=>S.slides[S.cur];
const obiect=(S,id)=>{for(const s of S.slides){const o=s.obj.find(x=>x.id===id);if(o)return o}return null};
const phDe=(sl,k)=>LAY[sl.lay].ph.find(p=>p.k===k);
const phPoz=(sl,p)=>Object.assign({},p,(sl.phPos||{})[p.k]||{});
const phAscuns=(sl,k)=>!!(sl.phOff&&sl.phOff[k]);
function phGol(sl,k){const p=phDe(sl,k);return p&&!phAscuns(sl,k)&&(p.tip==='content'||p.tip==='pic')&&!String(sl.t[k]||'').trim()&&!sl.obj.some(o=>o.ph===k)?p:null}
function snap(S){S.hist.push(JSON.stringify({slides:S.slides,cur:S.cur}));if(S.hist.length>80)S.hist.shift();S.redo=[]}
function undo(S){const h=S.hist.pop();if(!h){S.msg='Nu mai ai nimic de anulat.';return}
  S.redo.push(JSON.stringify({slides:S.slides,cur:S.cur}));const o=JSON.parse(h);S.slides=o.slides;S.cur=Math.min(o.cur,S.slides.length-1);
  S.sel=null;S.edit=null;S.menu=null;S.dlg=null;S.armed=null;S.cm=null;S.ev.undo=1;S.msg='Ai anulat ultimul pas (Ctrl+Z). Mai apasă o dată ca să anulezi și pasul dinainte.'}
function redo(S){const h=S.redo.pop();if(!h){S.msg='Nu ai ce reface: Ctrl+Y reface doar ce ai anulat cu Ctrl+Z.';return}
  S.hist.push(JSON.stringify({slides:S.slides,cur:S.cur}));const o=JSON.parse(h);S.slides=o.slides;S.cur=Math.min(o.cur,S.slides.length-1);
  S.sel=null;S.edit=null;S.cm=null;S.msg='Ai refăcut pasul anulat (Ctrl+Y).'}
function setText(S,v){const E=S.edit;if(!E)return;if(E.kind==='ph')slideCur(S).t[E.key]=v;else{const o=obiect(S,E.id);if(o)o.txt=v}}
function commitEdit(S){
  const E=S.edit;if(!E)return;S.edit=null;
  const acum=E.kind==='obj'?(obiect(S,E.id)||{}).txt:(slideCur(S)||{t:{}}).t[E.key];
  if(E.snap&&String(acum==null?'':acum)!==String(E.init==null?'':E.init)){S.hist.push(E.snap);if(S.hist.length>80)S.hist.shift();S.redo=[]}   // J03: un clic fără scris nu lasă un pas gol
  if(E.kind==='obj'){
    const sl=S.slides.find(s=>s.obj.some(o=>o.id===E.id));if(!sl)return;const o=sl.obj.find(x=>x.id===E.id);
    if(o.tip==='caseta'&&!String(o.txt||'').trim()){sl.obj=sl.obj.filter(x=>x!==o);if(S.sel&&S.sel.id===o.id)S.sel=null;
      S.msg='Caseta de text goală a dispărut: în PowerPoint, o casetă în care n-ai scris nimic dispare când dai clic în altă parte.'}
    else if(o.tip==='caseta')o.txt=String(o.txt).replace(/\s+$/,'');
  }else{const sl=slideCur(S);if(sl&&sl.t[E.key]!=null)sl.t[E.key]=String(sl.t[E.key]).replace(/\s+$/,'')}
}
/* începe scrisul într-un substituent sau într-o casetă; starea de dinainte intră în lista de anulare doar dacă textul se schimbă */
function incepeScris(S,E){
  const sl=slideCur(S);E.init=E.kind==='ph'?String(sl.t[E.key]==null?'':sl.t[E.key]):String((obiect(S,E.id)||{}).txt||'');
  E.snap=JSON.stringify({slides:S.slides,cur:S.cur});S.edit=E;S.peMini=false;
  S.sel=E.kind==='ph'?{k:'ph',key:E.key}:{k:'obj',id:E.id};if(E.kind==='ph')S.vazut[E.key==='titlu'?'titlu':'text']=1;
}
function adaugaDiap(S,lay){
  const c=slideCur(S),L=lay||(c?(c.lay==='title'?'tc':c.lay):'tc');
  S.slides.splice(S.cur+1,0,{id:'n'+(++uid),nou:true,lay:L,t:{},obj:[]});S.cur++;S.sel=null;
  S.msg=`Diapozitiv nou pe locul ${S.cur+1}, cu aspectul ${LAY[L].n}. Miniatura lui e acum cea aleasă.`;
}
function schimbaAspect(S,k){
  const sl=slideCur(S),noi=LAY[k].ph.map(p=>p.k);
  LAY[sl.lay].ph.forEach(p=>{if(noi.includes(p.k))return;
    const txt=String(sl.t[p.k]||'').trim();
    if(txt)sl.obj.push({id:'o'+(++uid),tip:'caseta',txt:sl.t[p.k],x:p.x,y:p.y,pt:Math.min(p.pt||18,28)});   // textul rămâne pe diapozitiv
    delete sl.t[p.k];sl.obj.forEach(o=>{if(o.ph===p.k)delete o.ph});
  });
  sl.lay=k;sl.phPos={};sl.phOff={};S.sel=null;S.msg=`Diapozitivul ${S.cur+1} are acum aspectul ${LAY[k].n}.`;
}
/* FILELE CONTEXTUALE (lecția 4, J03): după ce pui o imagine, o formă sau un tabel, sus se deschide singură fila lor
   (Picture Format / Shape Format / Table Design), care NU are Diapozitiv nou. Fila există cât e ales obiectul. */
const CTX={picture:[['TabCtxA','Picture Format','Format imagine']],table:[['TabCtxA','Table Design','Proiectare tabel'],['TabCtxB','Layout','Aspect tabel']],shape:[['TabCtxA','Shape Format','Format formă']]};
function ctxDe(S){const o=S.sel&&S.sel.k==='obj'&&!S.peMini?obiect(S,S.sel.id):null;return o?({imagine:'picture',tabel:'table',forma:'shape',caseta:'shape'}[o.tip]):null}
function deschideCtx(S){const c=ctxDe(S);if(!c)return '';S.tab='ctx';
  return ` Sus s-a deschis singură fila ${CTX[c][0][1]} (${CTX[c][0][2]}), ca în PowerPoint. Pentru Diapozitiv nou revii la fila Home (Pornire).`}
/* un obiect pus de pe panglică intră în primul substituent de conținut gol (NESIGUR: de confirmat cu captura C3) */
function primulGol(sl,tip){return LAY[sl.lay].ph.find(p=>(p.tip==='content'||(p.tip==='pic'&&tip==='imagine'))&&phGol(sl,p.k))||null}
function puneObiect(S,o,phKey){
  const sl=slideCur(S);
  const p=phKey?phGol(sl,phKey):((S.sel&&S.sel.k==='ph'?phGol(sl,S.sel.key):null)||primulGol(sl,o.tip));
  o.id='o'+(++uid);
  if(o.tip==='tabel'){const w=p?p.w:Math.min(86,o.c*14),h=Math.min(p?p.h:84,o.r*7.4);
    Object.assign(o,p?{x:p.x,y:p.y,w,h,ph:p.k}:{x:(100-w)/2,y:Math.max(8,(100-h)/2),w,h,pt:18});o.pt=18}
  else if(o.tip==='imagine'){
    if(p){const lat=Math.min(p.w*9.6,p.h*5.4)*0.9,w=lat/9.6,h=lat/5.4;Object.assign(o,{x:p.x+(p.w-w)/2,y:p.y+(p.h-h)/2,w,h,ph:p.k})}
    else Object.assign(o,{w:28,h:49.8,x:36,y:25})}
  sl.obj.push(o);S.sel={k:'obj',id:o.id};S.peMini=false;
}
function plaseaza(S,a){
  const sl=slideCur(S),ar=S.armed;S.armed=null;S.menu=null;snap(S);
  const x=Math.max(0,Math.min(a?a.x:40,100)),y=Math.max(0,Math.min(a?a.y:40,100));
  if(ar.tip==='caseta'){const o={id:'o'+(++uid),tip:'caseta',txt:'',x:Math.min(x,88),y:Math.min(y,90),pt:18};sl.obj.push(o);
    S.sel={k:'obj',id:o.id};S.edit={kind:'obj',id:o.id};S.msg='Caseta de text e pusă. Tastează textul, apoi dă clic în afara ei.'}
  else{const w=7.5,h=13.33,o={id:'o'+(++uid),tip:'forma',forma:ar.forma,x:Math.min(x,100-w),y:Math.min(y,100-h),w,h};sl.obj.push(o);
    S.sel={k:'obj',id:o.id};S.msg=`Forma ${NUME_FORMA[ar.forma]} e pe diapozitiv.`+deschideCtx(S)}
}

/* ---------------- editarea: diapozitive și obiecte (lecția 5) ---------------- */
const NUME_OBJ=o=>({caseta:'caseta de text',imagine:'imaginea '+(o.fis||''),forma:'forma '+(NUME_FORMA[o.forma]||''),tabel:`tabelul cu ${o.c} coloane și ${o.r} rânduri`}[o.tip]||'obiectul');
const DX=1.25,DY=2.22;   // 12 puncte pe un diapozitiv de 960 x 540 (proba COM: copia lipită pe același diapozitiv stă cu 12 puncte mai jos și la dreapta)
function copieDiap(s){const c=clona(s);c.id='c'+(++uid);c.copieDin=s.id;delete c.nou;c.obj.forEach(o=>o.id='o'+(++uid));return c}
function obiectAles(S){if(!S.sel||S.peMini)return null;const sl=slideCur(S);
  if(S.sel.k==='obj')return sl.obj.find(o=>o.id===S.sel.id)||null;
  if(S.sel.k==='ph'){const p=phDe(sl,S.sel.key);if(!p)return null;const q=phPoz(sl,p);   // substituentul copiat pleacă drept casetă de text
    return {tip:'caseta',txt:String(sl.t[p.k]||''),x:q.x,y:q.y,pt:Math.min(p.pt||24,32),_ph:p.k}}
  return null}
function copiaza(S,taie){
  if(S.peMini){const sl=slideCur(S);
    if(taie&&S.slides.length<2){S.msg='Prezentarea are un singur diapozitiv: în simulator nu rămâne fără niciunul (în PowerPoint s-ar putea).';return}
    S.clip={tip:'diap',data:[clona(sl)]};
    if(taie){snap(S);S.slides.splice(S.cur,1);S.cur=Math.min(S.cur,S.slides.length-1);S.ev.decupat=1;
      S.msg='Ai decupat diapozitivul (Ctrl+X): a dispărut din panou și așteaptă în clipboard. Alege după care diapozitiv îl vrei și lipește (Ctrl+V).'}
    else{S.ev.copiat=1;S.msg=`Ai copiat diapozitivul ${S.cur+1} (Ctrl+C). Nu se vede nimic nou până nu lipești (Ctrl+V).`}
    return}
  const o=obiectAles(S);
  if(!o){S.msg='Întâi alege ce copiezi: un clic pe obiect sau pe miniatura diapozitivului.';return}
  const c=clona(o);delete c.ph;delete c.id;delete c._ph;
  if(o._ph&&!String(o.txt).trim()){S.msg='Substituentul e gol: nu ai ce copia.';return}
  S.clip={tip:'obj',data:c,din:slideCur(S).id};
  if(o._ph){if(taie){snap(S);slideCur(S).t[o._ph]='';S.sel=null}
    S.msg=(taie?'Ai decupat':'Ai copiat')+' textul substituentului. (În simulator, el se lipește ca o casetă de text.)';return}
  if(taie){snap(S);const sl=slideCur(S);sl.obj=sl.obj.filter(x=>x.id!==o.id);S.sel=null;S.ev.decupat=1;
    S.msg=`Ai decupat ${NUME_OBJ(o)} (Ctrl+X): a dispărut de aici și așteaptă în clipboard. Alege diapozitivul și lipește (Ctrl+V).`}
  else{S.ev.copiat=1;S.msg=`Ai copiat ${NUME_OBJ(o)} (Ctrl+C). Alege unde îl vrei și lipește (Ctrl+V).`}
}
function lipeste(S){
  const C=S.clip;
  if(!C){S.msg='Nu ai copiat nimic încă: întâi Copiere (Ctrl+C) sau Decupare (Ctrl+X).';return}
  snap(S);S.cm=null;S.menu=null;
  if(C.tip==='diap'){const noi=C.data.map(copieDiap);S.slides.splice(S.cur+1,0,...noi);S.cur+=noi.length;S.peMini=true;S.sel=null;S.ev.lipitDiap=1;
    S.msg=`Diapozitivul lipit e pe locul ${S.cur+1}, după cel care era ales.`;return}
  const sl=slideCur(S),o=clona(C.data);o.id='o'+(++uid);
  const ocupat=a=>sl.obj.some(b=>b.tip===a.tip&&Math.abs(b.x-a.x)<0.3&&Math.abs(b.y-a.y)<0.3);
  let n=0;while(ocupat(o)&&n<20){o.x+=DX;o.y+=DY;n++}
  sl.obj.push(o);S.sel={k:'obj',id:o.id};S.peMini=false;S.ev.lipitObj=1;
  S.msg=n?`Ai lipit ${NUME_OBJ(o)} pe același diapozitiv: copia stă puțin mai jos și mai la dreapta decât originalul.`
    :`Ai lipit ${NUME_OBJ(o)} pe diapozitivul ${S.cur+1}, în același loc în care stătea originalul.`;
}
function dubleaza(S,forteazaDiap){
  if(S.peMini||forteazaDiap){snap(S);const c=copieDiap(slideCur(S));S.slides.splice(S.cur+1,0,c);S.cur++;S.peMini=true;S.sel=null;S.ev.dublat=1;
    S.msg=`Copia diapozitivului e pe locul ${S.cur+1}, imediat după original, și e acum cea aleasă.`;return}
  const o=obiectAles(S);if(!o||o._ph){S.msg='Întâi alege ce dublezi: miniatura unui diapozitiv sau un obiect.';return}
  snap(S);const c=clona(o);c.id='o'+(++uid);delete c.ph;c.x+=DX;c.y+=DY;slideCur(S).obj.push(c);S.sel={k:'obj',id:c.id};
  S.msg=`Ai dublat ${NUME_OBJ(o)} (Ctrl+D): copia stă puțin mai jos și mai la dreapta.`;
}
function sterge(S){
  const sl=slideCur(S);
  if(!S.peMini&&S.sel&&S.sel.k==='obj'){snap(S);sl.obj=sl.obj.filter(o=>o.id!==S.sel.id);S.sel=null;S.ev.stersObj=1;S.msg='Ai șters obiectul ales (tasta Delete).';return}
  if(!S.peMini&&S.sel&&S.sel.k==='ph'){const k=S.sel.key;snap(S);
    if(String(sl.t[k]||'').trim()){sl.t[k]='';S.msg='Ai șters textul din substituent: a rămas locul gol, cu textul gri. Încă un Delete șterge și locul.'}
    else{sl.phOff=sl.phOff||{};sl.phOff[k]=1;S.sel=null;S.msg='Ai șters substituentul gol.'}return}
  if(S.peMini){
    if(S.slides.length<2){S.msg='Prezentarea are un singur diapozitiv: în simulator nu rămâne fără niciunul (în PowerPoint s-ar putea).';return}
    snap(S);const t=sl.t.titlu;S.slides.splice(S.cur,1);S.cur=Math.min(S.cur,S.slides.length-1);S.ev.stersDiap=1;
    S.msg=`Ai șters diapozitivul${t?' „'+t+'”':''}. Cele de după au urcat un loc; acum e ales diapozitivul ${S.cur+1}.`;return}
  S.msg='Întâi alege ce ștergi: un clic pe obiect sau pe miniatura diapozitivului.';
}
function mutaDiap(S,from,gap){
  if(from==null||gap==null)return;const nou=gap>from?gap-1:gap;S.cm=null;
  if(nou===from){S.cur=from;S.peMini=true;S.msg='Ai lăsat diapozitivul pe același loc.';return}
  snap(S);const [s]=S.slides.splice(from,1);S.slides.splice(nou,0,s);S.cur=nou;S.peMini=true;S.sel=null;S.ev.mutatDiap=1;
  S.msg=`Ai mutat diapozitivul${s.t.titlu?' „'+s.t.titlu+'”':''} de pe locul ${from+1} pe locul ${nou+1}. Numerele miniaturilor s-au schimbat singure.`;
}
function mutaObj(S,a){
  const sl=slideCur(S);S.peMini=false;
  if(a.ph){const p=phDe(sl,a.ph);if(!p)return;snap(S);const q=phPoz(sl,p);sl.phPos=sl.phPos||{};
    sl.phPos[a.ph]={x:Math.max(-q.w+5,Math.min(95,q.x+a.dx)),y:Math.max(-q.h+5,Math.min(95,q.y+a.dy))};S.sel={k:'ph',key:a.ph};S.msg='Ai mutat substituentul.';return}
  const o=sl.obj.find(x=>x.id===a.id);if(!o)return;snap(S);
  const w=o.w||10,h=o.h||8;o.x=Math.max(-w+5,Math.min(95,o.x+a.dx));o.y=Math.max(-h+5,Math.min(95,o.y+a.dy));S.sel={k:'obj',id:o.id};S.ev.mutatObj=1;
  const afara=o.x<0||o.y<0||o.x+w>100||o.y+h>100;
  S.msg=afara?`Ai mutat ${NUME_OBJ(o)}, dar a ieșit parțial de pe diapozitiv: ce e în afară nu se vede când prezinți.`:`Ai mutat ${NUME_OBJ(o)}.`;
}
function cmDeschide(S,tip,id,x,y){S.menu=null;S.armed=null;S.cm={tip,id,x:x==null?8:x,y:y==null?40:y}}

/* un gest; după el, fila contextuală dispare dacă nu mai e ales obiectul ei (lecția 4, J03) */
function act(S,id,arg){
  const r=act0(S,id,arg);
  if((S.tab==='ctx'||S.tab==='ctxb')&&!ctxDe(S))S.tab='home';
  return r;
}
/* arg = {x,y} în % din diapozitiv (clic pe diapozitiv), {from,gap} (mutare de miniatură), {id|ph,dx,dy} (mutare de obiect) */
function act0(S,id,arg){
  S.msg='';
  if(id==='undo'||id==='k:undo'){commitEdit(S);S.msg='';S.cm=null;return undo(S)}
  if(id==='k:redo'){commitEdit(S);return redo(S)}
  const aceeasiEditare=S.edit&&((S.edit.kind==='ph'&&id==='ph:'+S.edit.key)||(S.edit.kind==='obj'&&id==='obj:'+S.edit.id));
  if(S.edit&&!aceeasiEditare)commitEdit(S);
  if(S.dlg)return actDlg(S,id);
  if(!id.startsWith('cm'))S.cm=null;
  if(id==='esc'){S.menu=null;S.armed=null;S.sel=null;return}
  if(id.startsWith('k:')){S.menu=null;S.armed=null;
    if(id==='k:del')return sterge(S);
    if(id==='k:copy')return copiaza(S,false);
    if(id==='k:cut')return copiaza(S,true);
    if(id==='k:paste')return lipeste(S);
    if(id==='k:dup')return dubleaza(S);
    if(id==='k:new'){snap(S);return adaugaDiap(S,null)}
    const d={'k:sus':[0,-1],'k:jos':[0,1],'k:stanga':[-1,0],'k:dreapta':[1,0]}[id];
    if(d){if(S.peMini){S.cur=Math.max(0,Math.min(S.slides.length-1,S.cur+d[0]+d[1]));return}
      const o=obiectAles(S);if(o&&!o._ph)return mutaObj(S,{id:o.id,dx:d[0]*0.7,dy:d[1]*1.2});}
    return}
  if(id==='cm-close'){S.cm=null;return}
  if(id.startsWith('cm-mini-')){const n=+id.slice(8)-1;S.cur=Math.min(n,S.slides.length-1);S.sel=null;S.peMini=true;return cmDeschide(S,'mini',null,arg&&arg.x,arg&&arg.y)}
  if(id.startsWith('cm-obj:')){const oid=id.slice(7);const o=slideCur(S).obj.find(x=>x.id===oid);if(!o)return;S.sel={k:'obj',id:oid};S.peMini=false;return cmDeschide(S,'obj',oid,arg&&arg.x,arg&&arg.y)}
  if(id==='cm-nesim'){S.cm=null;S.msg=`„${arg&&arg.nume||'Comanda'}” nu e folosită în lecția asta: în simulator nu face nimic.`;return}
  if(id==='cm-gol'){const tip=S.cm&&S.cm.tip,n=arg&&arg.nume||'Cut';S.cm=null;
    S.msg=tip==='text'?`„${n}” e gri: lucrează pe literele alese, iar acum nu e aleasă nicio literă. Ca să ${n==='Cut'?'decupezi':'copiezi'} toată caseta, dă clic pe chenarul ei, apoi ${n==='Cut'?'Ctrl+X':'Ctrl+C'}.`
      :`„${n}” e gri: pe fundalul diapozitivului nu e ales nimic de ${n==='Cut'?'decupat':'copiat'}.`;return}
  if(id==='cm-slide'){S.sel=null;S.peMini=false;return cmDeschide(S,'slide',null,arg&&arg.x,arg&&arg.y)}
  if(id.startsWith('cm-ph:')){const key=id.slice(6);if(!aceeasiEditare)incepeScris(S,{kind:'ph',key});return cmDeschide(S,'text',null,arg&&arg.x,arg&&arg.y)}
  if(id.startsWith('cm-txt:')){const oid=id.slice(7);if(!obiect(S,oid))return;if(!aceeasiEditare)incepeScris(S,{kind:'obj',id:oid});return cmDeschide(S,'text',null,arg&&arg.x,arg&&arg.y)}
  if(id.startsWith('cm:')){const c=id.slice(3);const tip=S.cm&&S.cm.tip;S.cm=null;
    if(tip==='mini')S.peMini=true;else S.peMini=false;
    if(c==='exit'){S.msg=S.sel?'Ai ieșit din scris (Exit Edit Text): acum e aleasă toată caseta.':'';return}
    if(c==='cut')return copiaza(S,true);
    if(c==='copy')return copiaza(S,false);
    if(c==='paste')return lipeste(S);
    if(c==='new'){snap(S);return adaugaDiap(S,null)}
    if(c==='dup')return dubleaza(S,true);
    if(c==='del')return sterge(S);
    if(c==='layout'){S.menu='layout';return}
    return}
  if(id==='maner'){S.msg='Cerculețele albe (mânerele) schimbă mărimea obiectului: asta e în lecția 6. Ca să muți obiectul, trage-l de mijloc (caseta de text: de chenar).';return}
  if(id==='muta-diap')return mutaDiap(S,arg&&arg.from,arg&&arg.gap);
  if(id==='muta-obj')return mutaObj(S,arg||{});
  if(id.startsWith('tab-')){S.menu=null;S.armed=null;if(id==='tab-file'){S.msg='Fila File (Fișier) ai folosit-o în lecția 3 (salvare, deschidere). Aici nu ne trebuie.';return}S.tab=id.slice(4);return}
  if(id==='menu-close'){S.menu=null;return}
  if(id==='rb-paste'){S.menu=null;return lipeste(S)}
  if(id==='rb-cut'){S.menu=null;return copiaza(S,true)}
  if(id==='rb-copy'){S.menu=null;return copiaza(S,false)}
  if(id==='rb-paste-menu'){S.armed=null;S.menu=S.menu==='paste'?null:'paste';return}
  if(id==='rb-copy-menu'){S.armed=null;S.menu=S.menu==='copy'?null:'copy';return}
  if(id==='copy-menu:copy'){S.menu=null;return copiaza(S,false)}
  if(id==='copy-menu:dup'){S.menu=null;return dubleaza(S)}
  if(id==='paste-menu:dest'){S.menu=null;return lipeste(S)}
  if(id==='dup-sel'){S.menu=null;return dubleaza(S,true)}
  if(id==='new-slide'){snap(S);S.menu=null;S.armed=null;return adaugaDiap(S,null)}
  if(id==='new-slide-menu'){S.armed=null;S.menu=S.menu==='newslide'?null:'newslide';return}
  if(id==='layout'){S.armed=null;S.menu=S.menu==='layout'?null:'layout';return}
  if(id.startsWith('lay:')){const k=id.slice(4);snap(S);if(S.menu==='newslide')adaugaDiap(S,k);else schimbaAspect(S,k);S.menu=null;return}
  if(id.startsWith('mini-')){S.cur=Math.min(+id.slice(5)-1,S.slides.length-1);S.sel=null;S.menu=null;S.armed=null;S.peMini=true;return}
  if(id==='ins-table'){S.armed=null;S.menu=S.menu==='table'?null:'table';S.tblHover=null;return}
  if(id.startsWith('tbl:')){const [c,r]=id.slice(4).split('x').map(Number);snap(S);puneObiect(S,{tip:'tabel',c,r,cel:[]});S.menu=null;
    S.msg=`Ai pus un tabel cu ${c} ${c===1?'coloană':'coloane'} și ${r} ${r===1?'rând':'rânduri'}.`+deschideCtx(S);return}
  if(id==='tbl-dlg'){S.menu=null;S.dlg={tip:'tabel',c:5,r:2,ph:null};return}
  if(id==='tbl-draw'||id==='tbl-excel'){S.msg='Acest buton nu e folosit în lecția asta: în simulator nu face nimic.';return}
  if(id==='ins-pictures'){S.armed=null;S.menu=S.menu==='pictures'?null:'pictures';return}
  if(id==='pic-device'){S.menu=null;S.dlg={tip:'fisier',sel:null,ph:null};return}
  if(id==='pic-stock'||id==='pic-online'){S.menu=null;S.msg='Imaginile stoc și cele online vin de pe internet. În simulator folosești imaginile din calculator: This Device... (Acest dispozitiv).';return}
  if(id==='ins-shapes'){S.armed=null;S.menu=S.menu==='shapes'?null:'shapes';return}
  if(id.startsWith('shape:')){S.menu=null;S.armed={tip:'forma',forma:id.slice(6)};S.msg=`Ai ales forma ${NUME_FORMA[id.slice(6)]}. Acum dă un clic pe diapozitiv, acolo unde o vrei.`;return}
  if(id==='ins-textbox'){S.menu=null;S.armed=S.armed&&S.armed.tip==='caseta'?null:{tip:'caseta'};S.msg=S.armed?'Acum dă un clic pe diapozitiv, acolo unde vrei caseta de text.':'';return}
  if(id==='ins-link'||id==='ins-audio'){S.menu=null;S.msg=(id==='ins-link'?'Link (legătura)':'Audio (sunetul)')+' stă tot pe fila Inserare (Insert). Îl vei folosi mai târziu: în simulator nu face nimic.';return}
  if(id==='slide'){S.peMini=false;if(S.armed)return plaseaza(S,arg);S.sel=null;S.menu=null;return}
  if(id.startsWith('ram:')){const [,k,key]=id.split(':');S.menu=null;S.peMini=false;S.sel=k==='ph'?{k:'ph',key}:{k:'obj',id:key};return}
  if(id.startsWith('ph:')){const key=id.slice(3);S.menu=null;S.peMini=false;
    if(!aceeasiEditare)incepeScris(S,{kind:'ph',key});return}
  if(id.startsWith('phic:')){const [,key,ic]=id.split(':');S.menu=null;S.peMini=false;
    if(ic==='tabel'){S.dlg={tip:'tabel',c:5,r:2,ph:key};return}
    if(ic==='imagine'){S.dlg={tip:'fisier',sel:null,ph:key};return}
    S.msg='Acest buton nu e folosit în lecția asta: în simulator nu face nimic.';return}
  if(id.startsWith('obj:')){const o=obiect(S,id.slice(4));S.menu=null;S.peMini=false;if(!o)return;
    S.sel={k:'obj',id:o.id};S.vazut[o.tip]=1;
    if(o.tip==='caseta'&&!aceeasiEditare)incepeScris(S,{kind:'obj',id:o.id});
    if(o.tip==='tabel')S.msg='Ai ales tabelul: are chenarul lui. (În PowerPoint, ca să scrii într-o celulă, dai clic în ea și tastezi; în simulator nu scriem în tabel.)';
    else if(o.tip==='imagine')S.msg='Ai ales imaginea: doar ea are acum chenar.';
    else if(o.tip==='forma')S.msg='Ai ales forma: doar ea are acum chenar.';
    return}
  if(id==='sterge')return sterge(S);
  if(id==='zona-note'){S.msg='Zona de note (lecția 2) nu ne trebuie aici.';return}
  if(id==='zona-miniaturi'||id==='zona-panglica')return;
}
function actDlg(S,id){
  const D=S.dlg;
  if(D.tip==='fisier'){
    if(id.startsWith('file:')){D.sel=id.slice(5);return}
    if(id==='file-insert'){if(!D.sel){S.msg='Alege întâi un fișier: dă clic pe el.';return}
      snap(S);const ph=D.ph;S.dlg=null;puneObiect(S,{tip:'imagine',fis:D.sel},ph);S.msg=`Imaginea ${D.sel} e acum pe diapozitivul ${S.cur+1}.`+deschideCtx(S);return}
    if(id==='file-cancel'){S.dlg=null;return}
  }else{
    if(id==='tbl-ok'){const c=Math.round(+D.c),r=Math.round(+D.r);
      if(!(c>=1&&c<=75&&r>=1&&r<=75)){S.msg='Numărul de coloane și de rânduri trebuie să fie între 1 și 75.';return}
      snap(S);const ph=D.ph;S.dlg=null;puneObiect(S,{tip:'tabel',c,r,cel:[]},ph);S.msg=`Ai pus un tabel cu ${c} ${c===1?'coloană':'coloane'} și ${r} ${r===1?'rând':'rânduri'}.`+deschideCtx(S);return}
    if(id==='tbl-cancel'){S.dlg=null;return}
  }
  if(id==='esc'){S.dlg=null;return}
  S.msg='Fereastra e deschisă: termin-o întâi, cu butoanele de jos.';
}

/* ---------------- desenarea ---------------- */
function phHTML(S,sl,p0,mod){
  if(sl.obj.some(o=>o.ph===p0.k)||phAscuns(sl,p0.k))return '';
  const p=phPoz(sl,p0);
  const txt=String(sl.t[p.k]||''),gol=!txt.trim();
  const ed=mod==='edit'&&S.edit&&S.edit.kind==='ph'&&S.edit.key===p.k;
  if(mod!=='edit'&&gol)return '';   // miniaturile și expunerea nu arată locurile goale
  const sel=mod==='edit'&&!S.peMini&&(ed||(S.sel&&S.sel.k==='ph'&&S.sel.key===p.k));
  const multi=p.tip==='content'||p.tip==='vbody';
  let inner;
  if(ed)inner=`<textarea class="sp-in" data-edit="1" rows="${multi?4:Math.max(1,txt.split('\n').length)}" spellcheck="false" aria-label="Textul din substituent (Enter = rând nou)">${esc(txt)}</textarea>`;
  else if(!gol)inner=multi?`<ul>${txt.split('\n').filter(x=>x.trim()).map(l=>`<li>${esc(l)}</li>`).join('')}</ul>`:esc(txt).replace(/\n/g,'<br>');
  else inner=`<span class="sp-prompt">${multi?'• ':''}${esc(p.p)}</span>`+
    (p.tip==='content'&&mod==='edit'?`<span class="sp-icons">${Object.entries(IC).map(([k,[n,s]])=>`<button type="button" class="sp-ic" data-t="phic:${p.k}:${k}" title="${n}" aria-label="${n}">${s}</button>`).join('')}</span>`:'')+
    (p.tip==='pic'&&mod==='edit'?`<span class="sp-icons" style="grid-template-columns:auto"><button type="button" class="sp-ic" data-t="phic:${p.k}:imagine" title="Pictures" aria-label="Pictures">${IC.imagine[1]}</button></span>`:'');
  return `<div class="sp-ph sp-${p.tip} sp-v${p.v||'t'}${p.al==='c'?' sp-c':''}${gol&&!ed?' gol':''}${sel?(ed?' ed':' sel'):''}" style="left:${p.x}%;top:${p.y}%;width:${p.w}%;height:${p.h}%;--pt:${p.pt||24}"${mod==='edit'?` data-t="ph:${p.k}" data-ph="${p.k}"`:''}>${inner}${sel?HANDLES:''}${mod==='edit'?RAMA('ram:ph:'+p.k):''}</div>`;
}
function objHTML(S,o,mod){
  const ed=mod==='edit'&&S.edit&&S.edit.kind==='obj'&&S.edit.id===o.id;
  if(o.tip==='caseta'&&mod!=='edit'&&!String(o.txt||'').trim())return '';
  const sel=mod==='edit'&&!S.peMini&&S.sel&&S.sel.k==='obj'&&S.sel.id===o.id;
  const pos=`left:${o.x}%;top:${o.y}%;`+(o.tip==='caseta'?'':`width:${o.w}%;height:${o.h}%;`)+`--pt:${o.pt||18}`;
  let inner='';
  if(o.tip==='caseta')inner=ed?`<textarea class="sp-in" data-edit="1" rows="${Math.max(1,String(o.txt||'').split('\n').length)}" cols="${Math.max(3,...String(o.txt||'').split('\n').map(l=>l.length+1))}" spellcheck="false" aria-label="Textul din caseta de text (Enter = rând nou)">${esc(o.txt||'')}</textarea>`:esc(o.txt||'').replace(/\n/g,'<br>');
  else if(o.tip==='imagine')inner=FIS[o.fis]||'';
  else if(o.tip==='forma')inner=forma(o.forma,'',o.culoare);
  else if(o.tip==='tabel'){const cel=o.cel||[];inner=`<table>${Array.from({length:o.r},(_,a)=>`<tr>${Array.from({length:o.c},(_,b)=>`<td>${esc((cel[a]||[])[b]||'')}</td>`).join('')}</tr>`).join('')}</table>`}
  return `<div class="sp-o sp-o-${o.tip}${sel?(ed?' ed':' sel'):''}" style="${pos}"${mod==='edit'?` data-t="obj:${o.id}" data-obj="${o.id}" role="button" tabindex="-1" aria-label="${esc(NUME_OBJ(o))}"`:''}>${inner}${sel?HANDLES:''}${mod==='edit'&&(o.tip==='caseta'||o.tip==='tabel')?RAMA('ram:obj:'+o.id):''}</div>`;
}
function slideHTML(S,sl,mod){
  return `<div class="sp-slide${mod==='edit'&&S.armed?' armat':''}"${mod==='edit'?' data-t="slide"':''}>${LAY[sl.lay].ph.map(p=>phHTML(S,sl,p,mod)).join('')}${sl.obj.map(o=>objHTML(S,o,mod)).join('')}</div>`;
}
const tileLay=k=>`<button type="button" class="sp-tile" data-t="lay:${k}"><span class="sp-lt">${LAY[k].ph.map(p=>`<i style="left:${p.x}%;top:${p.y}%;width:${p.w}%;height:${p.h}%"></i>`).join('')}</span>${LAY[k].n}</button>`;
function menuHTML(S){
  const cap=(t)=>`<div class="sp-mt"><span>${t}</span><button type="button" class="sp-x" data-t="menu-close" aria-label="Închide lista">×</button></div>`;
  if(S.menu==='layout')return `<div class="sp-menu" role="menu">${cap('Layout · Office Theme')}<div class="sp-gal">${ORD.map(tileLay).join('')}</div></div>`;
  if(S.menu==='newslide')return `<div class="sp-menu" role="menu">${cap('New Slide · Office Theme')}<div class="sp-gal">${ORD.map(tileLay).join('')}</div>
    <button type="button" class="sp-mi" data-t="dup-sel">Duplicate Selected Slides <span style="color:#777">· Dublare diapozitive selectate</span></button><button type="button" class="sp-mi gri" data-t="nesim-outline">Slides from Outline...</button><button type="button" class="sp-mi gri" data-t="nesim-reuse">Reuse Slides...</button></div>`;
  if(S.menu==='paste')return `<div class="sp-menu" role="menu">${cap('Paste Options')}<div class="sp-po" style="padding-left:4px">
    <button type="button" data-t="paste-menu:dest" title="Use Destination Theme (H)" aria-label="Use Destination Theme, Lipire">${MI.paste}</button><button type="button" class="gri" data-t="nesim-keep" title="Keep Source Formatting (K)" aria-label="Keep Source Formatting">${MI.paste}</button><button type="button" class="gri" data-t="nesim-picture" title="Picture (U)" aria-label="Picture">${MI.pic}</button></div>
    <button type="button" class="sp-mi gri" data-t="nesim-special">Paste Special...</button><p style="margin:4px 2px 0;font-size:11px;color:#666">Prima iconiță lipește, ca Ctrl+V. Numele apare când ții mouse-ul pe iconiță.</p></div>`;
  if(S.menu==='copy')return `<div class="sp-menu" role="menu">${cap('Copy')}<button type="button" class="sp-mi" data-t="copy-menu:copy">Copy <span style="color:#777">· Copiere (Ctrl+C)</span></button><button type="button" class="sp-mi" data-t="copy-menu:dup">Duplicate <span style="color:#777">· Dublare (Ctrl+D)</span></button></div>`;
  if(S.menu==='table'){const h=S.tblHover;return `<div class="sp-menu" role="menu">${cap(`<span class="sp-tblh">${h?h+' Table':'Insert Table'}</span>`)}
    <div class="sp-grid">${Array.from({length:8},(_,r)=>Array.from({length:10},(_,c)=>`<button type="button" class="sp-cel" data-t="tbl:${c+1}x${r+1}" aria-label="${c+1} coloane, ${r+1} rânduri"></button>`).join('')).join('')}</div>
    <div class="sp-tblnota" aria-live="polite"></div><button type="button" class="sp-mi" data-t="tbl-dlg">Insert Table...</button><button type="button" class="sp-mi gri" data-t="tbl-draw">Draw Table</button><button type="button" class="sp-mi gri" data-t="tbl-excel">Excel Spreadsheet</button></div>`}
  if(S.menu==='pictures')return `<div class="sp-menu" role="menu">${cap('Insert Picture From')}<button type="button" class="sp-mi" data-t="pic-device">This Device...</button><button type="button" class="sp-mi" data-t="pic-stock">Stock Images...</button><button type="button" class="sp-mi" data-t="pic-online">Online Pictures...</button></div>`;
  if(S.menu==='shapes')return `<div class="sp-menu" role="menu">${cap('Shapes')}${FORME.map(([g,it])=>`<div class="sp-gr">${g}</div><div class="sp-shp">${it.map(([k,n])=>`<button type="button" data-t="shape:${k}" title="${n}">${forma(k)}<span>${n}</span></button>`).join('')}</div>`).join('')}
    <p style="margin:6px 2px 0;font-size:11px;color:#666">În PowerPoint vezi doar desenele; numele apare când ții mouse-ul pe formă.</p></div>`;
  return '';
}
/* meniul de clic dreapta: elementele și ordinea lor sunt cele din PowerPoint (captura meniu-miniatura.webp + lista oficială
   Microsoft a meniurilor ContextMenuThumbnail / ContextMenuShape / ContextMenuPicture). Doar cele de editare fac ceva. */
function cmHTML(S){
  const C=S.cm;if(!C)return '';
  const it=(t,et,ro,ic,gri)=>`<button type="button" class="it${gri?' gri':''}" data-t="${t}"${gri?` data-nume="${esc(et)}"`:''} role="menuitem"><span class="ic">${ic||''}</span><span>${esc(et)}</span>${ro?`<span class="ro">${esc(ro)}</span>`:''}</button>`;
  const ns=(et,ic)=>it('cm-nesim',et,'',ic,true);
  const po=`<div class="po">Paste Options:</div><div class="sp-po">${S.clip?`<button type="button" data-t="cm:paste" title="Use Destination Theme (H)" aria-label="Paste Options: Use Destination Theme, Lipire">${MI.paste}</button><button type="button" class="gri" data-t="cm-nesim" data-nume="Keep Source Formatting" title="Keep Source Formatting (K)" aria-label="Keep Source Formatting">${MI.paste}</button><button type="button" class="gri" data-t="cm-nesim" data-nume="Picture" title="Picture (U)" aria-label="Picture">${MI.pic}</button>`
    :`<button type="button" class="gri" data-t="cm:paste" title="Nu ai copiat nimic" aria-label="Paste Options (gol)">${MI.paste}</button>`}</div>`;
  let h='<button type="button" class="srch" data-t="cm-nesim" data-nume="Search the menus">Search the menus</button>'+it('cm:cut','Cut','Decupare',MI.cut)+it('cm:copy','Copy','Copiere',MI.copy)+po;
  if(C.tip==='slide'||C.tip==='text'){   // NESIGUR (capturile C7, C8): meniul fundalului și al textului, din memoria interfeței + lista ContextMenuTextEdit
    const gol=(et,ic)=>`<button type="button" class="it gri" data-t="cm-gol" data-nume="${et}" role="menuitem"><span class="ic">${ic}</span><span>${et}</span></button>`;
    h='<button type="button" class="srch" data-t="cm-nesim" data-nume="Search the menus">Search the menus</button>'+gol('Cut',MI.cut)+gol('Copy',MI.copy)+po;
    if(C.tip==='slide')h+='<div class="sep"></div>'+it('cm:layout','Layout  ›','Aspect','')+ns('Reset Slide')+'<div class="sep"></div>'+ns('Grid and Guides  ›')+ns('Ruler')+ns('Format Background...')+'<div class="sep"></div>'+ns('New Comment');
    else h+=it('cm:exit','Exit Edit Text','Ieșire din editarea textului','')+ns('Font...')+ns('Paragraph...')+ns('Bullets  ›')+ns('Numbering  ›')+ns('Convert to SmartArt  ›')+ns('Link')+ns('Format Shape...')+'<div class="sep"></div>'+ns('New Comment');
    return `<div class="sp-cm" role="menu" style="left:${C.x}px;top:${C.y}px" aria-label="Meniul de clic dreapta">${h}</div>`}
  if(C.tip==='mini')h+='<div class="sep"></div>'+it('cm:new','New Slide','Diapozitiv nou',MI.nou)+it('cm:dup','Duplicate Slide','Dublare diapozitiv',MI.dub)+it('cm:del','Delete Slide','Ștergere diapozitiv',MI.del)
    +'<div class="sep"></div>'+ns('Add Section')+'<div class="sep"></div>'+it('cm:layout','Layout  ›','Aspect','')+ns('Reset Slide')+ns('Format Background...')+ns('Photo Album...')
    +'<div class="sep"></div>'+ns('Hide Slide')+'<div class="sep"></div>'+ns('New Comment');
  else{const o=obiect(S,C.id)||{};
    h+=(o.tip==='caseta'||o.tip==='forma'?ns('Edit Text',MI.txt):'')+ns('Group  ›')+ns('Bring to Front  ›')+ns('Send to Back  ›')+ns('Link')
      +ns('Save as Picture...')+ns('Edit Alt Text...')+ns('Size and Position...')+ns(o.tip==='imagine'?'Format Picture...':'Format Shape...')+'<div class="sep"></div>'+ns('New Comment')}
  return `<div class="sp-cm" role="menu" style="left:${C.x}px;top:${C.y}px" aria-label="Meniul de clic dreapta">${h}</div>`;
}
function dlgHTML(S,Q){
  const D=S.dlg;if(!D)return '';
  if(D.tip==='fisier'){const L=Q.fisiere||Object.keys(FIS);
    return `<div class="sp-dlg" role="dialog" aria-label="Insert Picture"><div class="sp-dt"><span>Insert Picture</span><button type="button" class="sp-x" data-t="file-cancel" aria-label="Închide fereastra">×</button></div>
    <div class="sp-path">This PC › Pictures (Imagini)</div><div class="sp-files">${L.map(f=>`<button type="button" class="sp-file${D.sel===f?' on':''}" data-t="file:${f}">${FIS[f]}<span>${f}</span></button>`).join('')}</div>
    <div class="sp-dfoot"><span class="fn">File name: <b>${esc(D.sel||'')}</b></span><button type="button" class="sp-b prim" data-t="file-insert">Insert</button><button type="button" class="sp-b" data-t="file-cancel">Cancel</button></div></div>`}
  return `<div class="sp-dlg" role="dialog" aria-label="Insert Table"><div class="sp-dt"><span>Insert Table</span><button type="button" class="sp-x" data-t="tbl-cancel" aria-label="Închide fereastra">×</button></div>
    <div class="sp-num"><label>Number of columns: <input type="number" min="1" max="75" data-dlg="c" value="${esc(D.c)}"></label><label>Number of rows: <input type="number" min="1" max="75" data-dlg="r" value="${esc(D.r)}"></label></div>
    <div class="sp-dfoot"><button type="button" class="sp-b prim" data-t="tbl-ok">OK</button><button type="button" class="sp-b" data-t="tbl-cancel">Cancel</button></div></div>`;
}
/* panglica reală (date din PowerPoint-ul instalat); fără date, o panglică simplă */
const LEG={SlideLayoutGallery:['layout','Aspect (Layout)'],TableInsertGallery:['ins-table','Tabel (Table)'],FlyoutAnchorInsertPictures:['ins-pictures','Imagini (Pictures)'],
  ShapesInsertGallery:['ins-shapes','Forme (Shapes)'],TextBoxInsert:['ins-textbox','Casetă text (Text Box)'],'galerie:Text Box':['ins-textbox','Casetă text (Text Box)'],
  'galerie:Rectangle':['shape:rect','Rectangle'],'galerie:Oval':['shape:oval','Oval'],'galerie:Isosceles Triangle':['shape:tri','Isosceles Triangle'],
  'galerie:Rectangle: Rounded Corners':['shape:rrect','Rectangle: Rounded Corners'],HyperlinkInsert:['ins-link','Link'],SoundInsertMenu02:['ins-audio','Audio'],
  Cut:['rb-cut','Decupare (Cut) · Ctrl+X']};
const DESCHIS={layout:'layout','ins-table':'table','ins-pictures':'pictures','ins-shapes':'shapes'};
function svgIc(cai){return cai?`<svg viewBox="0 0 20 20" aria-hidden="true">${cai.map(d=>`<path d="${d}"/>`).join('')}</svg>`:''}
function panglica(S){
  const P=window.PANGLICA_POWERPOINT,U=window.UiPanglica;
  const split=(ic)=>`<span class="sp-split"><button type="button" class="sp-split-a" data-t="new-slide" title="Diapozitiv nou (New Slide): adaugă un diapozitiv după cel ales" aria-label="New Slide, Diapozitiv nou">${svgIc(ic)||'＋'}</button><button type="button" class="sp-split-b" data-t="new-slide-menu" title="Diapozitiv nou (New Slide): alegi aspectul" aria-label="New Slide, lista de aspecte">New Slide ▾</button></span>`;
  const splitPaste=(ic)=>`<span class="sp-split"><button type="button" class="sp-split-a" data-t="rb-paste" title="Lipire (Paste) · Ctrl+V" aria-label="Paste, Lipire">${svgIc(ic)||MI.paste}</button><button type="button" class="sp-split-b" data-t="rb-paste-menu" title="Lipire (Paste): opțiunile" aria-label="Paste, opțiunile de lipire">Paste ▾</button></span>`;
  const splitCopy=(ic)=>`<span class="sp-mic"><button type="button" class="a" data-t="rb-copy" title="Copiere (Copy) · Ctrl+C" aria-label="Copy, Copiere">${svgIc(ic)||MI.copy}</button><button type="button" class="b" data-t="rb-copy-menu" title="Copiere (Copy): Copy sau Duplicate" aria-label="Copy, lista">▾</button></span>`;
  if(!P||!U){
    const tab=S.tab==='insert'?'insert':'home';
    return `<div class="sp-simple"><div class="tabs"><button type="button" class="sp-sb" data-t="tab-home">Home (Pornire)</button><button type="button" class="sp-sb" data-t="tab-insert">Insert (Inserare)</button></div>
      ${tab==='home'?`<span style="width:52px;height:64px;display:inline-block">${splitPaste(null)}</span><button type="button" class="sp-sb" data-t="rb-cut">Cut</button><span style="width:40px;height:30px;display:inline-block">${splitCopy(null)}</span><span style="width:52px;height:64px;display:inline-block">${split(null)}</span><button type="button" class="sp-sb" data-t="layout">Layout ▾</button>`
      :'<button type="button" class="sp-sb" data-t="ins-table">Table</button><button type="button" class="sp-sb" data-t="ins-pictures">Pictures</button><button type="button" class="sp-sb" data-t="ins-shapes">Shapes</button><button type="button" class="sp-sb" data-t="ins-textbox">Text Box</button>'}</div>`;
  }
  U.stil();
  /* fila contextuală (J03): se adaugă la capătul rândului de file cât e ales obiectul ei; banda ei spune de ce e goală */
  const cx=ctxDe(S),extra=cx?CTX[cx].map(([id,en])=>({id,eticheta:en,grupuri:[]})):[];
  const P2=extra.length?Object.assign({},P,{file:P.file.concat(extra)}):P;
  const TAB={};P2.file.forEach(f=>TAB[f.id]=f.id==='TabCtxA'?'ctx':f.id==='TabCtxB'?'ctxb':f.id.replace(/^Tab/,'').toLowerCase());
  const fila=(P2.file.find(f=>TAB[f.id]===S.tab)||P2.file[0]).id,ic=P.icoane||{},leg={};
  let nota='';
  if(cx&&(S.tab==='ctx'||S.tab==='ctxb')){const [,en,ro]=CTX[cx][S.tab==='ctxb'?1:0];
    nota=`<div class="sp-ctxnota">Fila <b>${en}</b> (${ro}) apare cât e ales ${{picture:'o imagine',table:'un tabel',shape:'o formă sau o casetă'}[cx]}; după ce pui obiectul, se deschide singură. Aici nu e butonul Diapozitiv nou: ca să adaugi un diapozitiv, dă clic pe fila <b>Home</b> (Pornire).<small>În simulator fila asta nu are butoane: în lecția asta nu o folosim.</small></div>`}
  ['SlideNewGallery','SlideNewGalleryInsert'].forEach(k=>leg[k]={html:split(ic[k]||ic.SlideNewGallery),title:'Diapozitiv nou (New Slide)'});
  leg.Paste={html:splitPaste(ic.Paste),title:'Lipire (Paste) · Ctrl+V'};
  leg.Copy={html:splitCopy(ic.Copy),title:'Copiere (Copy) · Ctrl+C'};
  Object.entries(LEG).forEach(([k,[t,titlu]])=>{
    const on=(DESCHIS[t]&&S.menu===DESCHIS[t])||(t==='ins-textbox'&&S.armed&&S.armed.tip==='caseta')||(t.startsWith('shape:')&&S.armed&&S.armed.forma===t.slice(6));
    leg[k]={attr:`data-t="${t}"`,title:titlu,clasa:on?'pg-on':''}});
  return U.html(P2,{fila,taburi:TAB,legaturi:leg,atribFila:k=>`data-t="tab-${k}"`+(k==='ctx'||k==='ctxb'?' style="color:#B7472A;font-weight:600"':''),
    fisier:'<button type="button" class="pg-fisier" data-t="tab-file">File</button>',bandaInlocuita:nota||undefined});
}
function appHTML(S,Q){
  const sl=slideCur(S);
  const th=S.slides.map((s,k)=>`<button type="button" class="sp-th${k===S.cur?' on':''}${k===S.cur&&S.peMini?' peMini':''}" data-t="mini-${k+1}" data-mini="${k}" aria-label="Miniatura diapozitivului ${k+1}${s.t.titlu?' „'+esc(s.t.titlu)+'”':''}${k===S.cur?', aleasă':''}"><i>${k+1}</i><span class="sp-mini"><span class="sp-sw">${slideHTML(S,s,'mini')}</span></span></button>`).join('');
  return `<div class="sp"><div class="sp-bar">Presentation1 - PowerPoint</div><div data-t="zona-panglica">${panglica(S)}</div>${menuHTML(S)}${dlgHTML(S,Q)}
    <div class="sp-main"><div class="sp-thumbs" data-t="zona-miniaturi">${th}</div><div class="sp-work"><div class="sp-sw">${slideHTML(S,sl,'edit')}</div></div></div>
    <div class="sp-notes" data-t="zona-note">Click to add notes</div>
    <div class="sp-status"><span>Slide ${S.cur+1} of ${S.slides.length}</span><span>${S.armed?(S.armed.tip==='caseta'?'Text Box: clic pe diapozitiv':'Shape: clic pe diapozitiv'):LAY[sl.lay].n}</span></div>${cmHTML(S)}</div>`;
}

/* ---------------- testele (pe starea prezentării) ---------------- */
/* d = numărul diapozitivului (1, 2, …) SAU titlul lui („Luna”) */
const D=(S,d)=>typeof d==='string'?S.slides.find(s=>norm(s.t.titlu)===norm(d)):S.slides[d-1];
const potriveste=(o,f)=>(!f.tip||o.tip===f.tip)&&(!f.forma||o.forma===f.forma)&&(!f.fis||o.fis===f.fis)&&(f.val==null||norm(o.txt)===norm(f.val));
const obiecteDe=(S,c)=>{const s=D(S,c.d);return s?s.obj.filter(o=>potriveste(o,c)):[]};
const sig=s=>JSON.stringify({lay:s.lay,t:Object.fromEntries(Object.entries(s.t).filter(([k,v])=>k!=='titlu'&&String(v).trim()).map(([k,v])=>[k,norm(v)])),
  obj:s.obj.map(o=>[o.tip,o.fis||o.forma||norm(o.txt)||'',Math.round(o.x),Math.round(o.y)]).sort()});
const CHK={
  nr:(S,c)=>S.slides.length===c.n,
  aspect:(S,c)=>!!D(S,c.d)&&D(S,c.d).lay===c.lay,
  text:(S,c)=>!!D(S,c.d)&&norm(D(S,c.d).t[c.ph])===norm(c.val),
  textmin:(S,c)=>!!D(S,c.d)&&norm(D(S,c.d).t[c.ph]).replace(/[^a-z]/g,'').length>=(c.min||3),
  linii:(S,c)=>{const s=D(S,c.d);if(!s)return false;const L=String(s.t[c.ph]||'').split('\n').map(norm).filter(Boolean);let i=0;
    for(const v of c.val){const j=L.indexOf(norm(v),i);if(j<0)return false;i=j+1}return true},
  tabel:(S,c)=>!!D(S,c.d)&&D(S,c.d).obj.some(o=>o.tip==='tabel'&&o.c===c.c&&o.r===c.r),
  imagine:(S,c)=>!!D(S,c.d)&&D(S,c.d).obj.some(o=>o.tip==='imagine'&&o.fis===c.fis),
  forma:(S,c)=>!!D(S,c.d)&&D(S,c.d).obj.some(o=>o.tip==='forma'&&o.forma===c.forma),
  caseta:(S,c)=>!!D(S,c.d)&&D(S,c.d).obj.some(o=>o.tip==='caseta'&&norm(o.txt)===norm(c.val)),
  nou:(S,c)=>{const s=D(S,c.d);return !!s&&!!s.nou&&(!c.dupa||(!!D(S,c.d-1)&&D(S,c.d-1).id===c.dupa))},
  ales:(S,c)=>!!S.vazut[c.o],
  /* lecția 5 */
  ordine:(S,c)=>S.slides.length===c.val.length&&c.val.every((v,i)=>norm(S.slides[i].t.titlu)===norm(v)),
  existaTitlu:(S,c)=>S.slides.filter(s=>norm(s.t.titlu)===norm(c.val)).length===(c.n||1),
  faraTitlu:(S,c)=>!S.slides.some(s=>norm(s.t.titlu)===norm(c.val)),
  dupa:(S,c)=>{const i=S.slides.findIndex(s=>norm(s.t.titlu)===norm(c.d));return i>0&&norm(S.slides[i-1].t.titlu)===norm(c.dupa)},
  ultimul:(S,c)=>norm(S.slides[S.slides.length-1].t.titlu)===norm(c.val),
  loc:(S,c)=>S.slides.findIndex(s=>norm(s.t.titlu)===norm(c.val))===c.n-1,
  copie:(S,c)=>{const a=D(S,c.d),b=D(S,c.ca);return !!a&&!!b&&a!==b&&sig(a)===sig(b)},
  copieDin:(S,c)=>{const a=D(S,c.d),b=D(S,c.din);return !!a&&!!b&&a!==b&&a.copieDin===b.id},   // J10: făcut prin dublarea / copierea lui, orice ai schimbat apoi
  nobj:(S,c)=>obiecteDe(S,c).length===c.n,
  pozitie:(S,c)=>obiecteDe(S,c).some(o=>(c.xmin==null||o.x>=c.xmin)&&(c.xmax==null||o.x<=c.xmax)&&(c.ymin==null||o.y>=c.ymin)&&(c.ymax==null||o.y<=c.ymax)),
  acelasiLoc:(S,c)=>{const b=obiecteDe(S,{d:c.ca,tip:c.tip,forma:c.forma,fis:c.fis});return obiecteDe(S,c).some(o=>b.some(x=>Math.abs(x.x-o.x)<0.6&&Math.abs(x.y-o.y)<0.6))},
  ev:(S,c)=>!!S.ev[c.e]
};
const trece=(S,t)=>t.c.every(c=>CHK[c.k](S,c));

/* pașii automați (rezolvarea pentru poartă și pentru „Arată-mi răspunsul”) */
function ruleaza(S,pasi){
  const gaseste=f=>typeof f==='string'?slideCur(S).obj.find(x=>x.tip===f):slideCur(S).obj.find(x=>potriveste(x,f));
  for(const a of pasi||[]){
    if(typeof a==='string'){act(S,a);continue}
    if(a.ph){act(S,'ph:'+a.ph);setText(S,a.scrie);commitEdit(S);continue}
    if(a.clic){act(S,'slide',{x:a.clic[0],y:a.clic[1]});continue}
    if('scrie' in a){setText(S,a.scrie);commitEdit(S);continue}
    if(a.alege){const o=gaseste(a.alege);if(o)act(S,'obj:'+o.id);commitEdit(S);continue}
    if(a.ctx){act(S,'cm-mini-'+a.ctx);continue}                       // clic dreapta pe miniatura N
    if(a.ctxObj){const o=gaseste(a.ctxObj);if(o)act(S,'cm-obj:'+o.id);continue}
    if(a.muta){const [f,t]=a.muta.map(n=>n-1);act(S,'muta-diap',{from:f,gap:t>f?t+1:t});continue}   // miniatura de pe locul f ajunge pe locul t
    if(a.trage){const o=gaseste(a.trage);if(o)act(S,'muta-obj',{id:o.id,dx:a.dx||0,dy:a.dy||0});continue}
  }
}

/* ---------------- gesturile: mouse, atingere, tastatură ---------------- */
function render(Q,body,api){
  stil();
  let S=init(Q);
  body.innerHTML=`<div class="sp-root"><div class="sp-app"></div><div class="sp-msg" aria-live="polite"></div>
    <div class="sp-taste" role="group" aria-label="Tastele"><span class="lbl2">Tastele (pe telefon nu le ai: apasă-le aici; merg și cu mouse-ul):</span>
      <button type="button" data-k="k:del">Delete<small>șterge</small></button><button type="button" data-k="k:copy">Ctrl+C<small>copiază</small></button><button type="button" data-k="k:cut">Ctrl+X<small>decupează</small></button><button type="button" data-k="k:paste">Ctrl+V<small>lipește</small></button><button type="button" data-k="k:undo">Ctrl+Z<small>anulează</small></button></div>
    <div class="lbl">Testele tale (se bifează singure)</div><ol class="sp-teste"></ol>
    <div class="sp-unelte"><button type="button" class="btn ghost sm sp-reset">Ia-o de la capăt</button></div></div>`;
  const root=body.querySelector('.sp-root'),app=body.querySelector('.sp-app'),msg=body.querySelector('.sp-msg'),ol=body.querySelector('.sp-teste');
  function side(){
    ol.innerHTML=Q.teste.map(t=>`<li class="${trece(S,t)?'ok':''}">${t.ce}</li>`).join('');
    msg.innerHTML=S.msg?esc(S.msg):(Q.teste.every(t=>trece(S,t))?'Toate testele sunt bifate. Apasă „Verifică”.':'Lucrează în fereastră; testele se bifează singure când sunt gata.');
  }
  const creste=t=>{t.style.height='auto';t.style.height=t.scrollHeight+'px'};   // câmpul de scris crește cu rândurile
  function draw(){
    app.innerHTML=appHTML(S,Q);side();
    const cm=app.querySelector('.sp-cm');
    if(cm){const sp=app.querySelector('.sp'),W=sp.clientWidth,H=sp.clientHeight;   // meniul rămâne în fereastră (dacă e mai înalt, se derulează)
      cm.style.maxHeight=(H-8)+'px';
      cm.style.left=Math.max(4,Math.min(S.cm.x,W-cm.offsetWidth-4))+'px';cm.style.top=Math.max(4,Math.min(S.cm.y,H-cm.offsetHeight-4))+'px'}
    const inp=app.querySelector('.sp-in[data-edit]');
    if(inp&&!api.done()){creste(inp);try{inp.focus({preventScroll:true});const n=inp.value.length;inp.setSelectionRange(n,n)}catch(e){}}
  }
  function gest(id,arg){act(S,id,arg);draw()}
  const inSp=(x,y)=>{const r=app.querySelector('.sp').getBoundingClientRect();return {x:x-r.left,y:y-r.top}};
  const atingere=()=>!!(window.matchMedia&&matchMedia('(pointer:coarse)').matches);
  function aratGrila(cc,rr){S.tblHover=`${cc}x${rr}`;
    app.querySelectorAll('.sp-cel').forEach(b=>{const [a,d]=b.dataset.t.slice(4).split('x').map(Number);b.classList.toggle('on',a<=cc&&d<=rr)});
    const h=app.querySelector('.sp-tblh');if(h)h.textContent=`${cc}x${rr} Table`}
  /* clicurile */
  let fara=false;   // clicul care vine după o tragere nu mai contează
  app.addEventListener('click',e=>{if(fara){fara=false;e.stopPropagation();e.preventDefault()}},true);
  app.addEventListener('click',e=>{
    if(api.done()||e.target.closest('.sp-in')||e.target.closest('[data-dlg]'))return;
    const sl=e.target.closest('.sp-work .sp-slide');
    if(S.armed&&sl){const r=sl.getBoundingClientRect();return gest('slide',{x:(e.clientX-r.left)/r.width*100,y:(e.clientY-r.top)/r.height*100})}
    const el=e.target.closest('[data-t],[data-nesim]');
    if(!el||!app.contains(el)){if(S.cm&&!e.target.closest('.sp-cm')){S.cm=null;draw()}return}
    if(el.dataset.t==='cm-nesim'||el.dataset.t==='cm-gol')return gest(el.dataset.t,{nume:el.dataset.nume||el.textContent.trim()});
    if(!el.dataset.t||el.dataset.t.startsWith('nesim-')){commitEdit(S);S.cm=null;S.msg=`„${el.getAttribute('aria-label')||el.textContent.trim()||'Butonul'}” nu e folosit în lecția asta: în simulator nu face nimic.`;return draw()}
    const id=el.dataset.t;
    /* J07: alegerea fișierului NU redesenează fereastra (altfel dublul clic nu mai găsește fișierul) */
    if(S.dlg&&id.startsWith('file:')){act(S,id);app.querySelectorAll('.sp-file').forEach(b=>b.classList.toggle('on',b.dataset.t===id));
      const fn=app.querySelector('.sp-dfoot .fn b');if(fn)fn.textContent=S.dlg.sel;side();return}
    /* J09: pe ecran tactil nu există „mergi cu mouse-ul”: prima atingere arată „3x2 Table”, a doua pune tabelul (spus pe ecran) */
    if(id.startsWith('tbl:')&&atingere()&&S.tblHover!==id.slice(4)){const [cc,rr]=id.slice(4).split('x').map(Number);aratGrila(cc,rr);
      S.msg=`Sus scrie acum „${cc}x${rr} Table”: ${cc} ${cc===1?'coloană':'coloane'}, ${rr} ${rr===1?'rând':'rânduri'}. Atinge încă o dată același pătrățel ca să pui tabelul. (Pe calculator, cu mouse-ul, un singur clic.)`;
      const tn=app.querySelector('.sp-tblnota');if(tn)tn.textContent=S.msg;side();return}
    let arg=null;
    if(id==='slide'){const r=el.getBoundingClientRect();arg={x:(e.clientX-r.left)/r.width*100,y:(e.clientY-r.top)/r.height*100}}
    gest(id,arg);
  });
  app.addEventListener('dblclick',e=>{const f=e.target.closest('[data-t^="file:"]');if(!f||api.done()||!S.dlg)return;act(S,f.dataset.t);act(S,'file-insert');draw()});
  app.addEventListener('pointerover',e=>{if(e.pointerType!=='mouse')return;   // pe atingere, „mouseover” vine chiar înaintea atingerii: nu contează ca previzualizare
    const c=e.target.closest('[data-t^="tbl:"]');if(!c||S.menu!=='table')return;
    const [cc,rr]=c.dataset.t.slice(4).split('x').map(Number);aratGrila(cc,rr)});
  app.addEventListener('input',e=>{
    if(e.target.dataset.edit){setText(S,e.target.value);creste(e.target);S.msg='';side();return}
    if(e.target.dataset.dlg&&S.dlg){S.dlg[e.target.dataset.dlg]=e.target.value}
  });
  /* clic dreapta = meniul (miniatură sau obiect); pe telefon îl deschide ținerea degetului (mai jos) */
  let ultimaAtingere=0;
  app.addEventListener('contextmenu',e=>{
    if(api.done())return;e.preventDefault();
    if(Date.now()-ultimaAtingere<900)return;
    const m=e.target.closest('[data-mini]'),p=inSp(e.clientX,e.clientY);
    if(m)return gest('cm-mini-'+(+m.dataset.mini+1),p);
    const w=cmPe(e.target);if(w)gest(w,p);
  });
  /* ce meniu deschide clicul dreapta pe diapozitivul mare: chenarul = meniul obiectului; textul = meniul textului;
     imaginea / forma = meniul obiectului; o parte goală = meniul diapozitivului (J02) */
  function cmPe(t){
    if(!t.closest('.sp-work .sp-slide'))return null;
    const r=t.closest('.sp-ram');
    if(r){const [,k,key]=r.dataset.t.split(':');return k==='obj'?'cm-obj:'+key:'cm-ph:'+key}
    const o=t.closest('.sp-work [data-obj]');
    if(o){const ob=obiect(S,o.dataset.obj);if(!ob)return null;return ob.tip==='caseta'?'cm-txt:'+ob.id:'cm-obj:'+ob.id}
    const ph=t.closest('.sp-work [data-ph]');if(ph)return 'cm-ph:'+ph.dataset.ph;
    return 'cm-slide';
  }
  /* tragerea: miniaturi (mută diapozitivul) și obiecte (le mută pe diapozitiv) */
  let G=null;
  function tinta(t,peAtingere){
    if(t.closest('.sp-in')||t.closest('.sp-h')||t.closest('.sp-cm')||t.closest('.sp-menu')||t.closest('.sp-dlg'))return null;
    const m=t.closest('[data-mini]');if(m)return {kind:'mini',el:m,i:+m.dataset.mini};
    const r=t.closest('.sp-ram');if(r){const [,k,key]=r.dataset.t.split(':');const el=r.parentElement;return k==='ph'?{kind:'ph',el,ph:key}:{kind:'obj',el,id:key}}
    const o=t.closest('.sp-work [data-obj]');
    if(o){const ob=obiect(S,o.dataset.obj);if(!ob)return null;
      if(ob.tip==='caseta'||ob.tip==='tabel')return null;               // J04: din text/celule alegi litere, nu muți; se mută de chenar
      if(peAtingere&&!o.classList.contains('sel'))return null;           // pe telefon: întâi atingi obiectul (îl alegi), apoi îl tragi
      return {kind:'obj',el:o,id:o.dataset.obj}}
    return null;   // substituentul: tot doar de chenar
  }
  function gapDin(x,y){
    const th=[...app.querySelectorAll('.sp-th')],box=app.querySelector('.sp-thumbs');if(!th.length)return null;
    const col=getComputedStyle(box).flexDirection.startsWith('column'),B=box.getBoundingClientRect();
    if(x<B.left-40||x>B.right+40||y<B.top-40||y>B.bottom+40)return null;   // lăsată în afara panoului: nu se mută nimic
    let best=null;
    th.forEach((el,i)=>{const r=el.getBoundingClientRect();
      const c=col?[[i,r.left,r.top-3,r.width,0],[i+1,r.left,r.bottom+3,r.width,0]]:[[i,r.left-4,r.top,0,r.height],[i+1,r.right+1,r.top,0,r.height]];
      c.forEach(([g,cx,cy,w,h])=>{const px=cx+w/2,py=cy+h/2,d=Math.hypot(x-px,(y-py)*(col?1:2.2));if(!best||d<best.d)best={g,d,cx,cy,w,h}})});
    return Object.assign(best,{B,col});
  }
  function arataIns(g){
    let ins=app.querySelector('.sp-ins');const box=app.querySelector('.sp-thumbs');
    if(!g){if(ins)ins.remove();return}
    if(!ins){ins=document.createElement('span');ins.className='sp-ins';box.appendChild(ins)}
    if(g.col)Object.assign(ins.style,{left:(g.cx-g.B.left)+'px',top:(g.cy-g.B.top-1.5)+'px',width:g.w+'px',height:'3px'});
    else Object.assign(ins.style,{left:(g.cx-g.B.left-1.5)+'px',top:(g.cy-g.B.top)+'px',width:'3px',height:g.h+'px'});
  }
  function start(){activ=true;commitEdit(S);S.cm=null;const c=app.querySelector('.sp-cm');if(c)c.remove();
    G.el.classList.add(G.kind==='mini'?'sp-trage':'sp-mut')}
  function misca(x,y){
    if(G.kind==='mini'){G.gap=gapDin(x,y);arataIns(G.gap);return}
    G.el.style.transform=`translate(${x-G.sx}px,${y-G.sy}px)`;
  }
  function lasa(x,y){
    const g=G;G=null;fara=true;setTimeout(()=>{fara=false},0);   // doar clicul care vine imediat după eliberare
    if(g.kind==='mini'){const gg=gapDin(x,y);arataIns(null);g.el.classList.remove('sp-trage');
      if(!gg){S.msg='Ai lăsat miniatura în afara panoului cu miniaturi: nu s-a mutat nimic.';return draw()}
      return gest('muta-diap',{from:g.i,gap:gg.g})}
    const sl=app.querySelector('.sp-work .sp-slide').getBoundingClientRect();
    const dx=(x-g.sx)/sl.width*100,dy=(y-g.sy)/sl.height*100;
    gest('muta-obj',g.kind==='ph'?{ph:g.ph,dx,dy}:{id:g.id,dx,dy});
  }
  app.addEventListener('mousedown',e=>{
    if(e.button!==0||api.done()||G)return;const t=tinta(e.target,false);if(!t)return;
    G=Object.assign(t,{sx:e.clientX,sy:e.clientY,moved:false,touch:false});
    if(t.kind!=='mini')e.preventDefault();   // fără selecție de text în timpul tragerii
  });
  const mm=e=>{if(!G||G.touch)return;if(!root.isConnected){opreste();return}
    if(!G.moved&&Math.hypot(e.clientX-G.sx,e.clientY-G.sy)>5){G.moved=true;start()}
    if(G.moved){e.preventDefault();misca(e.clientX,e.clientY)}};
  const mu=e=>{if(!G||G.touch)return;if(G.moved)lasa(e.clientX,e.clientY);else G=null};
  app.addEventListener('touchstart',e=>{
    ultimaAtingere=Date.now();
    if(api.done()||e.touches.length!==1)return;
    if(e.target.closest('.sp-in'))return;
    const p=e.touches[0],t=tinta(e.target,true),o=e.target.closest('.sp-work [data-obj]'),f=e.target.closest('.sp-work .sp-slide');
    if(!t&&!o&&!f)return;
    G=Object.assign(t||(o?{kind:'nimic',el:o,id:o.dataset.obj}:{kind:'fundal',el:f}),{sx:p.clientX,sy:p.clientY,moved:false,touch:true,armat:false,lung:false,cm:cmPe(e.target)});
    if(G.kind==='mini')G.timer=setTimeout(()=>{if(G&&!G.moved){G.armat=true;G.el.classList.add('sp-ridicat')}},380);
    else{if(G.kind==='obj'||G.kind==='ph')G.armat=true;G.timer=setTimeout(()=>{if(G&&!G.moved)G.lung=true},550)}   // fundalul și textul: doar ținut apăsat (meniul); tras = derulare
  },{passive:true});
  app.addEventListener('touchmove',e=>{
    if(!G||!G.touch)return;ultimaAtingere=Date.now();const p=e.touches[0],d=Math.hypot(p.clientX-G.sx,p.clientY-G.sy);
    if(!G.armat){if(d>8){clearTimeout(G.timer);
        const ob=G.kind==='nimic'?obiect(S,G.id):null;
        if(ob&&ob.tip!=='caseta'&&ob.tip!=='tabel'){S.msg='Pe telefon, un obiect se mută așa: îl atingi o dată (să aibă chenar), apoi îl tragi. Acum doar s-a derulat pagina.';msg.innerHTML=esc(S.msg)}   // J09
        G=null}return}
    if(e.cancelable)e.preventDefault();
    if(!G.moved&&d>6){G.moved=true;clearTimeout(G.timer);G.el.classList.remove('sp-ridicat');start()}
    if(G.moved)misca(p.clientX,p.clientY);
  },{passive:false});
  app.addEventListener('touchend',e=>{
    if(!G||!G.touch)return;ultimaAtingere=Date.now();clearTimeout(G.timer);const p=e.changedTouches[0];
    if(G.moved){if(e.cancelable)e.preventDefault();return lasa(p.clientX,p.clientY)}
    const g=G;G=null;g.el.classList.remove('sp-ridicat');
    const q=inSp(p.clientX,p.clientY);
    if(g.kind==='mini'&&g.armat){if(e.cancelable)e.preventDefault();activ=true;return gest('cm-mini-'+(g.i+1),q)}   // ținut apăsat, fără tragere = meniul miniaturii
    if(g.lung&&g.cm){if(e.cancelable)e.preventDefault();activ=true;return gest(g.cm,q)}                          // ținut apăsat pe obiect / text / fundal = meniul lui
  },{passive:false});
  app.addEventListener('touchcancel',()=>{if(G){clearTimeout(G.timer);if(G.el)G.el.classList.remove('sp-ridicat','sp-trage','sp-mut');G=null;arataIns(null)}});
  /* tastele: pe DOCUMENT (lecția 4, J01), doar dacă ultimul clic/atingere a fost în acest simulator; câmpurile din
     afara lui (de ex. numele elevului) și textul selectat în pagină (Ctrl+C) rămân ale paginii */
  let activ=false;
  const laApasare=e=>{activ=root.isConnected&&root.contains(e.target)};
  const laTasta=e=>{
    if(!root.isConnected){opreste();return}
    if(!activ||api.done())return;
    const t=e.target,k=e.key,c=e.ctrlKey||e.metaKey,lk=(k||'').toLowerCase();
    const inSim=root.contains(t),inCamp=!!(t&&t.closest&&t.closest('.sp-in'));
    if(inCamp){   // se scrie: tastele sunt ale câmpului (Enter = rând nou, ca în PowerPoint); Esc iese din scris și alege caseta întreagă
      if(c&&lk==='z'&&S.edit&&t.value===String(S.edit.init==null?'':S.edit.init)){e.preventDefault();return gest('k:undo')}   // J03
      if(k==='Escape'){e.preventDefault();const E=S.edit;commitEdit(S);S.cm=null;
        if(E)S.sel=E.kind==='ph'?{k:'ph',key:E.key}:(obiect(S,E.id)?{k:'obj',id:E.id}:null);
        S.msg=S.sel?'Ai ieșit din scris: acum e aleasă toată caseta (chenar plin). Delete ar șterge-o.':'';return draw()}
      return}
    if(!inSim&&t&&t.closest&&t.closest('input,textarea,select,[contenteditable="true"]'))return;
    if(t&&t.closest&&t.closest('[data-dlg]'))return;
    let id=null;
    if(k==='Escape'){e.preventDefault();return gest('esc')}
    if(k==='Delete'||k==='Backspace')id='k:del';
    else if(c&&lk==='c')id='k:copy';else if(c&&lk==='x')id='k:cut';else if(c&&lk==='v')id='k:paste';
    else if(c&&lk==='d')id='k:dup';else if(c&&lk==='z')id='k:undo';else if(c&&lk==='y')id='k:redo';else if(c&&lk==='m')id='k:new';
    else if(k==='ArrowUp')id='k:sus';else if(k==='ArrowDown')id='k:jos';else if(k==='ArrowLeft')id='k:stanga';else if(k==='ArrowRight')id='k:dreapta';
    else if((k==='Enter'||k===' ')&&t&&t.matches&&t.matches('[role="button"][data-t]')&&inSim){e.preventDefault();return gest(t.dataset.t)}
    if(!id)return;
    if(/^k:(sus|jos|stanga|dreapta)$/.test(id)&&!S.peMini&&!S.sel)return;   // săgețile fără nimic ales: pagina se derulează normal
    e.preventDefault();gest(id);
  };
  function opreste(){document.removeEventListener('pointerdown',laApasare,true);document.removeEventListener('keydown',laTasta);
    document.removeEventListener('mousemove',mm);document.removeEventListener('mouseup',mu)}
  if(window.__simPptOpreste)window.__simPptOpreste();   // un singur simulator ascultă: cel desenat ultimul
  window.__simPptOpreste=opreste;
  document.addEventListener('pointerdown',laApasare,true);document.addEventListener('keydown',laTasta);
  document.addEventListener('mousemove',mm);document.addEventListener('mouseup',mu);
  /* butoanele tastelor (telefon) */
  root.querySelector('.sp-taste').addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(!b||api.done())return;gest(b.dataset.k)});
  body.querySelector('.sp-reset').onclick=()=>{if(api.done())return;S=init(Q);draw()};
  draw();
  body._sp={rez:()=>{S=init(Q);ruleaza(S,Q.rez);draw()},gresit:()=>{S=init(Q);ruleaza(S,Q.gresit);draw()},stare:()=>S};
  const nav=api.checkButton(()=>{
    commitEdit(S);draw();
    const lipsa=Q.teste.find(t=>!trece(S,t));
    if(!lipsa){nav.innerHTML='';api.resolve(true);return}
    api.resolve(false,`Mai ai de făcut: ${strip(lipsa.ce)}.${lipsa.ajutor?' '+lipsa.ajutor:''}`);
    api.revealButton(()=>{S=init(Q);ruleaza(S,Q.rez);draw();nav.innerHTML='';api.giveUp(`am făcut acum pașii în simulator: ${Q.rezText}.`)});
  });
}
function rezolva(Q,body){if(body._sp)body._sp.rez()}
function gresit(Q,body){if(body._sp)body._sp.gresit()}
window.SimPPT={render,rezolva,gresit,diap,
  prezentari:o=>Object.assign(DECKS,o),
  _intern:{init,act,ruleaza,CHK,trece,LAY,DECKS}};
})();
