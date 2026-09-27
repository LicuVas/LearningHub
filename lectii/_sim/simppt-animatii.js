/* ======================================================================================================
   lectii/_sim/simppt-animatii.js — PowerPoint simulat: TRANZIȚII și ANIMAȚII (tipul de exercițiu `ppta`).
   PROPRIETAR: autorul lecției VI · M1 · 7 („Efecte de animație și de tranziție. Când ajută și când încurcă”).
   SE ÎNCARCĂ DUPĂ jocuri/_motor/ui-panglica.js + panglica-powerpoint.js (panglica reală a PowerPoint-ului instalat) și
   după lectii/_sim/simppt.js (îi folosește geometria reală a machetelor: SimPPT._intern.LAY). simppt.js și
   simppt-formatare.js NU se modifică. Tip nou: tipuri:{ppta:SimPPTAnim}.

   CE FACE, CA ÎN POWERPOINT (probe: lectii/vi/m1-l07/_proba/, afirmatii.json):
   - Tranziția e a DIAPOZITIVULUI care vine: galeria de pe fila Transitions (Tranziții) o pune pe diapozitivul ales
     (sau pe toate miniaturile alese cu Ctrl/Shift+clic); celelalte rămân cum erau (COM: T2). None (Fără) o scoate (T4).
     Duration (Durată) = secunde (T3). Apply To All (Se aplică pentru toate) copiază efectul ȘI durata pe toate
     diapozitivele (desktop ascuns, ExecuteMso SlideTransitionApplyToAll: W2). Duratele puse de galerie: Fade 0,70,
     Push 1,00, Split 1,50 (citite din prezentări reale de pe disc: durate_din_pptx.json); celelalte NESIGURE.
   - Animația e a unui OBIECT: galeria de pe fila Animations (Animații) îi pune un efect (înlocuiește efectul pe care îl
     avea — NESIGUR, nu s-a putut apăsa galeria prin UIA); Add Animation (Adăugare animație) îi ADAUGĂ încă unul;
     None (Fără) îi scoate toate efectele (documentat Microsoft ro-ro). Fără obiect ales, galeria e gri.
   - Ordinea = ordinea din secvență (COM: A2); Move Earlier / Move Later (Mutare mai devreme / mai târziu) și săgețile din
     Animation Pane (Panou animație) o schimbă (A3). Start: On Click / With Previous / After Previous (La clic / Cu
     precedentul / După precedentul) (A4). Duratele implicite: Appear fără durată, Fade/Fly In/Split/Wipe 0,50, Spin 2,00 (A1).
   - Numerele de lângă obiecte (doar cât e deschisă fila Animations sau panoul): fiecare efect La clic primește numărul
     următor; Cu / După precedentul iau numărul efectului de deasupra (0 dacă sunt înaintea primului clic).
   - Expunerea (F5 / Slide Show › From Beginning, Shift+F5 / From Current Slide): fiecare clic pornește grupul următor de
     efecte (un efect La clic + cele Cu/După precedentul de sub el); cele de dinaintea primului clic pornesc singure; după
     ultimul clic vine diapozitivul următor, cu tranziția lui; după ultimul diapozitiv, ecranul negru „End of slide show,
     click to exit.”, iar încă un clic închide expunerea (desktop ascuns, SlideShowView: W4). Esc iese oricând.
   - Ștergi un obiect -> dispare și animația lui (A5). Ctrl+Z anulează, Ctrl+Y reface.
   ABATERI SPUSE PE ECRAN: efectele sunt desenate aproximativ („în PowerPoint arată puțin altfel”); Effect Options, Sound,
   avansarea automată (lecția 8), Trigger, Animation Painter și celelalte file nu sunt simulate (spun asta la clic); în
   lecția asta nu se scrie pe diapozitiv; steluța din panoul cu miniaturi redă efectul în diapozitivul mare, nu în miniatură.

   CONFIGURAȚIA unui exercițiu: {t:'ppta', q, start:{deck, cur, tab?, panou?}, teste:[{ce, c:[condiții], ajutor?}],
     rez:[pași], gresit:[pași], rezText, why}.  Prezentări: SimPPTAnim.prezentari({nume:()=>[SimPPTAnim.diap(...)]}).
   diap(id, aspect, {titlu, sub, c1}, [obiecte], {tr:{ef,dur}, an:[{t:'ph:titlu'|'ref:nume', ef, start:'clic'|'cu'|'dupa', dur?}]})
   obiect: {tip:'caseta'|'imagine'|'forma', ref, x, y, w, h, pt, txt, fis, forma, culoare}  (x, y, w, h în % din diapozitiv)
   Condiții: tr, faraTr, trToate, trDurMax, an, faraAn, nrAn, ordine, clicuri, laClic, nobj, ev — vezi CHK.
   Pași: 'mini-2' | {ctrl:3} | 'tab-transitions' | 'tr:Fade' | {trDur:0.5} | 'apply-all' | {alege:{ref|ph}} | 'an:Fade' |
     {add:'Fade'} | {start:'dupa'} | {anDur:0.5} | 'panou' | {ef:{ref|ph}} | 'mai-devreme' | 'mai-tarziu' | 'k:del' |
     'k:undo' | 'f5' | 'next' | 'prev' | 'esc'
   ====================================================================================================== */
(function(){
'use strict';
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const strip=s=>String(s).replace(/<[^>]+>/g,'');
const norm=s=>String(s==null?'':s).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[„”"“«»]/g,'').replace(/\s+/g,' ').trim().toLowerCase();
const clona=o=>JSON.parse(JSON.stringify(o));

/* geometria machetelor: cea din simppt.js (PowerPoint 16.0, tema Office, 16:9); rezerva = aceleași valori */
const LAY=(window.SimPPT&&window.SimPPT._intern&&window.SimPPT._intern.LAY)||{
  title:{n:'Title Slide',ph:[{k:'titlu',tip:'title',x:12.5,y:16.4,w:75,h:34.8,pt:60,p:'Click to add title',v:'b',al:'c'},{k:'sub',tip:'body',x:12.5,y:52.5,w:75,h:24.1,pt:24,p:'Click to add subtitle',v:'t',al:'c'}]},
  tc:{n:'Title and Content',ph:[{k:'titlu',tip:'title',x:6.9,y:5.3,w:86.2,h:19.3,pt:44,p:'Click to add title',v:'m'},{k:'c1',tip:'content',x:6.9,y:26.6,w:86.2,h:63.4,pt:28,p:'Click to add text',v:'t'}]},
  to:{n:'Title Only',ph:[{k:'titlu',tip:'title',x:6.9,y:5.3,w:86.2,h:19.3,pt:44,p:'Click to add title',v:'m'}]},
  blank:{n:'Blank',ph:[]}};
/* numele pe care PowerPoint le dă substituenților (COM, probe_com.json#A7) */
const NUME_PH={titlu:'Title 1',sub:'Subtitle 2',c1:'Content Placeholder 2'};
const NUME_OBJ={caseta:'TextBox',imagine:'Picture',forma:{arrowR:'Right Arrow',star5:'5-Point Star',oval:'Oval',rect:'Rectangle',cloud:'Cloud'}};

/* ---------------- efectele (numele din panglica reală: panglica-powerpoint.json + captura animatii-familii.webp) ---------------- */
const TR_RAND=['None','Morph','Fade','Push','Wipe','Split','Reveal','Cut','Random Bars','Shape','Uncover','Cover'];
const TR_DUR={None:2,Morph:2,Fade:0.7,Push:1,Wipe:1,Split:1.5,Reveal:1,Cut:0.1,'Random Bars':1,Shape:1,Uncover:1,Cover:1};
const AN_RAND=['None','Replay','Rewind','Appear','Fade','Fly In','Float In','Split','Wipe'];
const AN_IN=['Appear','Fade','Fly In','Float In','Split','Wipe','Shape','Wheel','Random Bars','Grow & Turn','Zoom','Swivel','Bounce'];
const AN_EMF=['Pulse','Color Pulse','Teeter','Spin','Grow/Shrink','Desaturate','Darken','Lighten','Transparency','Object Color','Complemen...','Line Color','Fill Color','Brush Color','Font Color','Underline','Bold Flash','Bold Reveal','Wave'];
const AN_DUR={Appear:0,Fade:0.5,'Fly In':0.5,Split:0.5,Wipe:0.5,Spin:2,Pulse:0.5,Teeter:0.5,'Float In':1,Shape:2,Wheel:2,'Random Bars':0.5,'Grow & Turn':0.5,Zoom:0.5,Swivel:2,Bounce:2};
const fam=ef=>AN_EMF.includes(ef)?'emf':'in';
const PORNIRE={clic:['On Click','La clic'],cu:['With Previous','Cu precedentul'],dupa:['After Previous','După precedentul']};
const slug=ef=>String(ef).toLowerCase().replace(/[^a-z]+/g,'-').replace(/^-|-$/g,'');
const durTxt=d=>{const s=(Math.round(d*100)/100).toFixed(2).replace('.',',');return s.length<5?'0'+s:s};   // 0.5 -> „00,50”, ca în panglică
function citesteDur(v){const s=String(v==null?'':v).trim().replace(',', '.').replace(/[^0-9.]/g,'');const n=parseFloat(s);return isFinite(n)?n:null}

/* ---------------- desenele (obiecte din prezentările de lucru; desene, nu fotografii) ---------------- */
const FIS={
  soare:'<svg viewBox="0 0 100 100" aria-hidden="true"><g stroke="#F7A600" stroke-width="6" stroke-linecap="round"><path d="M50 6v13M50 81v13M6 50h13M81 50h13M19 19l9 9M72 72l9 9M81 19l-9 9M28 72l-9 9"/></g><circle cx="50" cy="50" r="24" fill="#FFB000" stroke="#FF6A00" stroke-width="4"/></svg>',
  nor:'<svg viewBox="0 0 100 70" aria-hidden="true"><path d="M22 60a16 16 0 0 1 0-32 22 22 0 0 1 41-9 17 17 0 0 1 21 16 13 13 0 0 1-3 25z" fill="#9FB6CC" stroke="#5D7A96" stroke-width="3"/><g stroke="#2F7BD8" stroke-width="4" stroke-linecap="round"><path d="M34 64l-3 5M52 64l-3 5M70 64l-3 5"/></g></svg>',
  picatura:'<svg viewBox="0 0 60 80" aria-hidden="true"><path d="M30 4C22 22 8 36 8 52a22 22 0 0 0 44 0C52 36 38 22 30 4z" fill="#3D8FE0" stroke="#1E5FA8" stroke-width="3"/><path d="M20 52a10 10 0 0 0 8 10" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/></svg>',
  pieptene:'<svg viewBox="0 0 100 50" aria-hidden="true"><rect x="6" y="6" width="88" height="14" rx="4" fill="#8E5A2B"/><g fill="#8E5A2B">'+Array.from({length:11},(_,i)=>`<rect x="${9+i*8}" y="18" width="4" height="26" rx="1.5"/>`).join('')+'</g></svg>'
};
const SVGF={rect:'<rect x="2" y="2" width="96" height="96"/>',oval:'<ellipse cx="50" cy="50" rx="48" ry="48"/>',
  arrowR:'<polygon points="2,28 58,28 58,3 98,50 58,97 58,72 2,72"/>',star5:'<polygon points="50,3 61,37 97,37 68,59 79,95 50,73 21,95 32,59 3,37 39,37"/>'};
const CULORI={aur:['#FFC000','#BF9000'],albastru:['#4472C4','#2F528F']};
const forma=(k,cul)=>{const [f,s]=CULORI[cul]||CULORI.albastru;return `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><g fill="${f}" stroke="${s}" stroke-width="2" vector-effect="non-scaling-stroke">${SVGF[k]||SVGF.rect}</g></svg>`};
const STEA=(c)=>`<svg viewBox="0 0 20 20" aria-hidden="true"><polygon points="10,1 12.6,7.2 19,7.4 14,11.5 15.8,18 10,14.3 4.2,18 6,11.5 1,7.4 7.4,7.2" fill="${c}"/></svg>`;
const CUL_FAM={in:'#3AA655',emf:'#E8A317',out:'#D64541'};
const IC_MOUSE='<svg viewBox="0 0 12 16" aria-hidden="true"><rect x="1.5" y="1" width="9" height="14" rx="4.5" fill="none" stroke="#444" stroke-width="1.4"/><path d="M6 1v5" stroke="#444" stroke-width="1.4"/></svg>';
const IC_CEAS='<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5" fill="none" stroke="#444" stroke-width="1.4"/><path d="M8 4v4l3 2" stroke="#444" stroke-width="1.4" fill="none"/></svg>';

/* ---------------- aspectul (culori fixe: arată ca aplicația, în orice temă) ---------------- */
const CSS=`
.sa-root{max-width:900px;margin:0 auto}
.sa{--paper:#FFFFFF;--paper2:#F3F3F3;--ink:#222;--ink2:#5A5A5A;--line:#D4D4D4;--sel:#FBE3DB;--xlg:#B7472A;position:relative;
  border:1px solid #AEB8BB;border-radius:6px;overflow:hidden;background:#F3F3F3;color:#222;font:13px/1.3 "Segoe UI",system-ui,sans-serif;text-align:left}
.sa button{font:inherit;color:inherit;cursor:pointer;margin:0}
.sa-bar{background:#B7472A;color:#fff;padding:4px 8px;font-size:12px}
.sa .rb.pg{background:#fff}
.sa .pg .pg-ingust{display:block}   /* și pe calculator: coloana lecției e mai îngustă decât panglica reală */
.sa-camp{display:flex;align-items:center;gap:4px;width:100%;height:100%;font-size:.72rem;white-space:nowrap}
.sa-camp .et{flex:0 0 auto;min-width:3.9em}
.sa-camp input[type=text]{width:4.2em;min-width:0;height:22px;font:inherit;font-size:16px;line-height:1;padding:0 3px;border:1px solid #BDBDBD;border-radius:2px;background:#fff;color:#111}
.sa .pg .pg-camp .sa-camp select{width:auto;height:24px;max-width:9.5em;font:inherit;font-size:16px;border:1px solid #BDBDBD;border-radius:2px;background:#fff;color:#111}
@media (min-width:700px){.sa-camp input[type=text],.sa-camp select{font-size:.75rem}}
.sa-camp .spin{display:flex;flex-direction:column;height:22px}
.sa-camp .spin button{flex:1 1 50%;width:16px;padding:0;border:1px solid #BDBDBD;background:#F7F7F7;font-size:8px;line-height:1}
.sa-camp .gri{opacity:.5}
.sa-camp label{display:flex;align-items:center;gap:4px;cursor:pointer}
.sa-menu{background:#fff;border:1px solid #9E9E9E;margin:6px;box-shadow:0 2px 8px rgba(0,0,0,.18);padding:4px 6px 8px;max-height:340px;overflow-y:auto}
.sa-mt{display:flex;justify-content:space-between;align-items:center;gap:8px;font-weight:700;padding:3px 4px;background:#F0F0F0;margin-bottom:4px;position:sticky;top:-4px}
.sa-x{border:0;background:none;font-size:18px;line-height:1;padding:0 6px}
.sa-gr{font-weight:700;font-size:12px;padding:6px 2px 3px;color:#444}
.sa-gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(86px,1fr));gap:4px}
.sa-tile{border:1px solid transparent;background:#fff;border-radius:3px;padding:4px 2px;display:flex;flex-direction:column;align-items:center;gap:2px;font-size:11px;line-height:1.1;text-align:center}
.sa-tile svg{width:26px;height:26px}
.sa-tile:hover,.sa-tile:focus-visible{border-color:#B7472A;background:#FBE3DB}
.sa-mi{display:block;width:100%;text-align:left;border:0;background:none;padding:5px 8px;border-radius:3px;color:#777}
.sa-mi:hover{background:#F0F0F0}
.sa-main{display:grid;grid-template-columns:78px minmax(0,1fr);gap:6px;padding:6px;background:#E6E6E6}
.sa-main.cu-panou{grid-template-columns:78px minmax(0,1fr) 190px}
.sa-thumbs{display:flex;flex-direction:column;gap:6px;min-width:0}
.sa-th{display:flex;gap:3px;border:0;background:none;padding:0;align-items:flex-start;text-align:left;min-width:0;touch-action:manipulation;-webkit-user-select:none;user-select:none}
.sa-thn{display:flex;flex-direction:column;align-items:center;gap:3px;width:13px;flex:none;font-size:10px}
.sa-th.on .sa-thn>i{color:#B7472A;font-weight:700}
.sa-thn i{font-style:normal}
.sa-star{width:13px;height:13px;border:0;padding:0;background:none;display:block}
.sa-star svg{width:13px;height:13px;display:block}
.sa-mini{flex:1 1 auto;min-width:0;border:1px solid #B5B5B5;background:#fff;display:block;pointer-events:none}
.sa-th.on .sa-mini{outline:2px solid #B7472A}
.sa-th.multi .sa-mini{outline:3px solid #B7472A}
.sa-sw{container-type:inline-size;min-width:0;display:block;position:relative}
.sa-slide{position:relative;aspect-ratio:16/9;background:#fff;color:#000;overflow:hidden;font-family:Calibri,Carlito,"Segoe UI",Arial,sans-serif;line-height:1.12}
.sa-work .sa-slide{box-shadow:0 1px 3px rgba(0,0,0,.35)}
.sa-work .sa-slide.ed{overflow:visible}
.sa-work .sa-clip{position:absolute;inset:0;overflow:hidden}
.sa-ph,.sa-o{position:absolute;box-sizing:border-box;font-size:calc(var(--pt,18) * 100cqw / 960)}
.sa-ph{padding:0 .25em;display:flex;flex-direction:column}
.sa-vt{justify-content:flex-start}.sa-vm{justify-content:center}.sa-vb{justify-content:flex-end}
.sa-c{text-align:center}
.sa-title{font-family:"Calibri Light",Calibri,Carlito,"Segoe UI",Arial,sans-serif}
.sa-ph.gol{border:1px dashed #A6A6A6;color:#7F7F7F}
.sa-ph ul{margin:0;padding-left:1.05em}
.sa-o-caseta{white-space:pre;padding:.1em .2em}
.sa-o-imagine svg,.sa-o-forma svg{display:block;width:100%;height:100%}
.sa-work .sa-ph,.sa-work .sa-o{cursor:pointer}
.sa-work .sa-ph.sel,.sa-work .sa-o.sel{outline:1.5px solid #6E6E6E;outline-offset:1px}
.sa-tag{position:absolute;display:flex;flex-direction:column;gap:1px;z-index:6;transform:translateX(calc(-100% - 3px))}
.sa-tag button{min-width:15px;height:15px;padding:0 2px;border:1px solid #8A8A8A;background:#fff;color:#222;font:600 10px/13px "Segoe UI",sans-serif;border-radius:1px}
.sa-tag button.on{background:#FBE3DB;border-color:#B7472A}
.sa-panou{background:#fff;border:1px solid #C8C8C8;display:flex;flex-direction:column;min-width:0;font-size:12px}
.sa-pt{display:flex;justify-content:space-between;align-items:center;padding:4px 6px;font-weight:600;border-bottom:1px solid #E1E1E1}
.sa-pb{display:flex;gap:4px;align-items:center;padding:4px 6px;border-bottom:1px solid #E1E1E1}
.sa-pb button{border:1px solid #C8C8C8;background:#FAFAFA;border-radius:2px;padding:2px 6px;min-height:28px}
.sa-pl{list-style:none;margin:0;padding:2px 0;min-height:60px}
.sa-pl li>button[data-panou]{display:grid;grid-template-columns:16px 14px 14px minmax(0,1fr);gap:3px;align-items:center;width:100%;border:0;background:none;padding:4px 5px;text-align:left;min-height:30px}
.sa-pl li>button[data-panou].on{background:#FBE3DB;outline:1px solid #B7472A}
.sa-pl .nm{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sa-pl .n{font-weight:600;text-align:right}
.sa-pl svg{width:12px;height:13px;display:block}
.sa-pl .bar{grid-column:4;height:5px;border-radius:2px;background:#8FB3E0;margin-top:1px}
.sa-pl li.sa-rand{position:relative}
.sa-efdd{position:absolute;right:3px;top:3px;width:22px;height:22px;border:1px solid #B7472A;background:#fff;border-radius:2px;padding:0;font-size:12px;line-height:1}
.sa-efm{display:flex;flex-direction:column;margin:2px 6px 6px 22px;border:1px solid #9E9E9E;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.2)}
.sa-efm button{border:0;background:none;text-align:left;padding:5px 8px;font-size:12px}
.sa-efm button:hover{background:#F0F0F0}.sa-efm button.gri{color:#8A8A8A}
.sa-pgol{color:#777;padding:8px;font-style:italic}
.sa-status{display:flex;justify-content:space-between;gap:8px;background:#EDEDED;border-top:1px solid #C8C8C8;padding:3px 8px;font-size:11px}
.sa-pvnota{position:absolute;left:4px;bottom:4px;z-index:8;background:rgba(255,255,255,.92);border:1px solid #B7472A;border-radius:3px;padding:2px 6px;font-size:11px;color:#333}
.sa-msg{margin:10px 0 4px;padding:7px 10px;border-radius:6px;background:var(--paper2);border:1px solid var(--line);font-size:.93rem;min-height:1.4em}
.sa-teste{margin:4px 0 8px;padding-left:1.6em}
.sa-teste li{margin:3px 0;color:var(--ink2)}
.sa-teste li.ok{color:var(--ok);font-weight:600}
.sa-teste li.ok::marker{content:"✓  "}
.sa-taste{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0 6px}
.sa-taste .lbl2{font-size:.85rem;color:var(--ink2);flex:1 0 100%}
.sa-taste button{min-height:40px;min-width:48px;padding:4px 10px;border:1px solid var(--line);border-bottom-width:3px;border-radius:6px;background:var(--paper);color:var(--ink);font:600 .9rem/1.1 var(--fm,monospace);cursor:pointer}
.sa-taste button small{display:block;font:400 .7rem/1.1 var(--fb,sans-serif);color:var(--ink2)}
.sa-unelte{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
/* expunerea: pe tot ecranul, ca în PowerPoint */
.sa-show{position:fixed;inset:0;z-index:2147483647;background:#000;display:flex;flex-direction:column;touch-action:manipulation}
.sa-show-st{flex:1 1 auto;display:flex;align-items:center;justify-content:center;min-height:0;cursor:pointer}
.sa-show-sl{position:relative;width:min(100vw,calc((100vh - 64px) * 16 / 9));aspect-ratio:16/9;overflow:hidden;background:#000}
.sa-show-sl .sa-lay{position:absolute;inset:0}
.sa-show-sl .sa-slide{width:100%}
.sa-show-fin{color:#fff;font:15px/1.4 "Segoe UI",sans-serif;padding:10px 14px;align-self:flex-start;cursor:pointer;flex:1 1 auto;width:100%;box-sizing:border-box}
.sa-show-bar{flex:0 0 auto;display:flex;flex-wrap:wrap;gap:6px;align-items:center;justify-content:center;padding:6px;background:#1B1B1B;color:#DDD;font:12px/1.3 "Segoe UI",sans-serif}
.sa-show-bar button{min-height:40px;min-width:64px;border:1px solid #555;background:#2B2B2B;color:#fff;border-radius:6px;padding:4px 10px;font:600 13px/1.1 "Segoe UI",sans-serif}
.sa-show-bar span{flex:1 1 100%;text-align:center;color:#AAA}
@media (min-width:700px){.sa-show-bar span{flex:0 1 auto}}
/* efectele (aproximative) */
.sa-anim{animation-fill-mode:both;animation-timing-function:ease-out}
@keyframes sa-in-appear{from{opacity:0}to{opacity:1}}
@keyframes sa-in-fade{from{opacity:0}to{opacity:1}}
@keyframes sa-in-fly-in{from{transform:translateY(calc(var(--fy,170) * 1%))}to{transform:none}}
@keyframes sa-in-float-in{from{transform:translateY(30%);opacity:0}to{transform:none;opacity:1}}
@keyframes sa-in-split{from{clip-path:inset(0 50% 0 50%)}to{clip-path:inset(0)}}
@keyframes sa-in-wipe{from{clip-path:inset(100% 0 0 0)}to{clip-path:inset(0)}}
@keyframes sa-in-shape{from{clip-path:circle(0% at 50% 50%)}to{clip-path:circle(75% at 50% 50%)}}
@keyframes sa-in-wheel{from{transform:rotate(-120deg) scale(.5);opacity:0}to{transform:none;opacity:1}}
@keyframes sa-in-random-bars{from{opacity:0}to{opacity:1}}
@keyframes sa-in-grow-turn{from{transform:scale(.1) rotate(-90deg);opacity:0}to{transform:none;opacity:1}}
@keyframes sa-in-zoom{from{transform:scale(.2);opacity:0}to{transform:none;opacity:1}}
@keyframes sa-in-swivel{from{transform:perspective(500px) rotateY(90deg)}to{transform:none}}
@keyframes sa-in-bounce{0%{transform:translateY(-160%);opacity:0}45%{transform:none;opacity:1}62%{transform:translateY(-22%)}78%{transform:none}90%{transform:translateY(-7%)}100%{transform:none}}
@keyframes sa-emf-pulse{0%,100%{transform:none}50%{transform:scale(1.1)}}
@keyframes sa-emf-spin{from{transform:none}to{transform:rotate(360deg)}}
@keyframes sa-emf-teeter{0%,100%{transform:none}20%{transform:rotate(5deg)}40%{transform:rotate(-5deg)}60%{transform:rotate(4deg)}80%{transform:rotate(-3deg)}}
@keyframes sa-emf-gen{0%,100%{filter:none}50%{filter:brightness(1.35) saturate(1.6);transform:scale(1.04)}}
@keyframes sa-tr-fade{from{opacity:0}to{opacity:1}}
@keyframes sa-tr-push{from{transform:translateY(100%)}to{transform:none}}
@keyframes sa-tr-push-out{from{transform:none}to{transform:translateY(-100%)}}
@keyframes sa-tr-wipe{from{clip-path:inset(0 0 0 100%)}to{clip-path:inset(0)}}
@keyframes sa-tr-split{from{clip-path:inset(0 50% 0 50%)}to{clip-path:inset(0)}}
@keyframes sa-tr-reveal{0%,45%{opacity:0}100%{opacity:1}}
@keyframes sa-tr-reveal-out{0%{opacity:1}45%,100%{opacity:0}}
@keyframes sa-tr-random-bars{from{opacity:0}to{opacity:1}}
@keyframes sa-tr-shape{from{clip-path:circle(0% at 50% 50%)}to{clip-path:circle(75% at 50% 50%)}}
@keyframes sa-tr-uncover-out{from{transform:none}to{transform:translateX(-100%)}}
@keyframes sa-tr-cover{from{transform:translateX(100%)}to{transform:none}}
@keyframes sa-tr-morph{from{opacity:0}to{opacity:1}}
@media (pointer:coarse){
  .sa .pg .pg-banda{zoom:1.65}   /* panglica reală, mărită: Apply To All 33 px, caseta Duration 36 px, lista Start 40 px */
  .sa .rb.pg .tabs button,.sa .rb.pg .tabs .pg-fisier{min-height:36px}
  .sa .pg .pg-camp .sa-camp select{height:26px}
  .sa-camp .spin{display:none}   /* pe ecran tactil scrii durata (săgețile de 16 px nu se pot nimeri, iar mărite nu încap în casetă) */
  .sa-pb button,.sa-pt .sa-x,.sa-mt .sa-x{min-width:40px;min-height:40px}
  .sa-pl li>button[data-panou]{min-height:40px}
  .sa-efdd{width:36px;height:36px;top:2px;font-size:15px}
  .sa-efm button{min-height:40px}
  /* numărul rămâne desenat mic (se suprapunea peste etape și ieșea din fereastră: judecătorul, trecerea 2, N2);
     crește doar zona de atins, nevăzută: 15 + 2 x 9 = 33 px */
  .sa-tag button{position:relative}
  .sa-tag button::before{content:'';position:absolute;inset:-9px}
  .sa-thn{width:32px}.sa-star,.sa-star svg{width:32px;height:32px}.sa-star svg{padding:9px;box-sizing:border-box}
  .sa-tile{min-height:48px}
}
@media (max-width:560px){
  .sa-main,.sa-main.cu-panou{grid-template-columns:minmax(0,1fr)}
  .sa-thumbs{flex-direction:row;flex-wrap:wrap;gap:8px 6px}
  .sa-th{flex:0 0 calc(33.33% - 4px)}
}
@media (prefers-reduced-motion:reduce){.sa-anim{animation-duration:.01s!important;animation-delay:0s!important}}`;
function stil(){if(document.getElementById('simppt-animatii-css'))return;const s=document.createElement('style');s.id='simppt-animatii-css';s.textContent=CSS;document.head.appendChild(s)}

/* ---------------- prezentările ---------------- */
const DECKS={};
const diap=(id,lay,t,obj,fx)=>({id,lay,t:t||{},obj:obj||[],fx:fx||{}});
let uid=0;
function init(Q){
  const st=Q.start||{};
  const src=(DECKS[st.deck]||(()=>[diap('d1','title',{titlu:'Prezentare'})]))();
  const slides=src.map(s=>{
    const refs={};let n=LAY[s.lay].ph.length;
    const obj=(s.obj||[]).map(o=>{const c=Object.assign({},o,{id:'o'+(++uid)});n++;
      const baza=o.tip==='forma'?(NUME_OBJ.forma[o.forma]||'Shape'):NUME_OBJ[o.tip]||'Object';c.nume=o.nume||`${baza} ${n}`;if(o.ref)refs[o.ref]=c.id;return c});
    const tinta=t=>t.startsWith('ref:')?'o:'+refs[t.slice(4)]:t;
    const an=((s.fx&&s.fx.an)||[]).map(e=>({id:'e'+(++uid),t:tinta(e.t),ef:e.ef,fam:e.fam||fam(e.ef),start:e.start||'clic',dur:e.dur==null?(AN_DUR[e.ef]==null?0.5:AN_DUR[e.ef]):e.dur,del:e.del||0}));
    return {id:s.id,lay:s.lay,t:Object.assign({},s.t),obj,tr:s.fx&&s.fx.tr?{ef:s.fx.tr.ef,dur:s.fx.tr.dur==null?TR_DUR[s.fx.tr.ef]:s.fx.tr.dur}:null,an};
  });
  const cur=Math.min(st.cur||0,slides.length-1);
  return {slides,cur,multi:[cur],foc:'mini',sel:null,efSel:null,tab:st.tab||'home',menu:null,panou:!!st.panou,
    hist:[],redo:[],ev:{},msg:'',show:null,vazutTxt:false};
}
const slideCur=S=>S.slides[S.cur];
const obiect=(sl,id)=>sl.obj.find(o=>o.id===id);
function tintaInfo(sl,t){   // -> {nume, x, y, w, h, txt}
  if(!t)return null;
  if(t.startsWith('ph:')){const p=LAY[sl.lay].ph.find(q=>q.k===t.slice(3));if(!p)return null;return {nume:NUME_PH[p.k]||p.k,x:p.x,y:p.y,w:p.w,h:p.h,txt:sl.t[p.k]||''}}
  const o=obiect(sl,t.slice(2));if(!o)return null;
  return {nume:o.nume,x:o.x,y:o.y,w:o.w||30,h:o.h||10,txt:o.txt||''};
}
const eticheta=(sl,t)=>{const i=tintaInfo(sl,t);if(!i)return '?';const tx=String(i.txt||'').split('\n')[0].trim();return tx?`${i.nume}: ${tx}`:i.nume};
function snap(S){S.hist.push(JSON.stringify({slides:S.slides,cur:S.cur}));if(S.hist.length>80)S.hist.shift();S.redo=[]}
function refa(S,o){S.slides=o.slides;S.cur=Math.min(o.cur,S.slides.length-1);S.multi=[S.cur];S.sel=null;S.efSel=null;S.menu=null}
function undo(S){const h=S.hist.pop();if(!h){S.msg='Nu mai ai nimic de anulat.';return}
  S.redo.push(JSON.stringify({slides:S.slides,cur:S.cur}));refa(S,JSON.parse(h));S.ev.undo=1;
  S.msg='Ai anulat ultimul pas (Ctrl+Z). Mai apasă o dată ca să anulezi și pasul dinainte.'}
function redo(S){const h=S.redo.pop();if(!h){S.msg='Nu ai ce reface: Ctrl+Y reface doar ce ai anulat cu Ctrl+Z.';return}
  S.hist.push(JSON.stringify({slides:S.slides,cur:S.cur}));refa(S,JSON.parse(h));S.msg='Ai refăcut pasul anulat (Ctrl+Y).'}

/* numerele de lângă obiecte: fiecare efect La clic = numărul următor; Cu/După precedentul = numărul de deasupra */
function numere(sl){let n=0;const m={};sl.an.forEach(e=>{if(e.start==='clic')n++;m[e.id]=n});return m}
const clicuri=sl=>sl.an.filter(e=>e.start==='clic').length;
function grupe(sl){const g=[[]];sl.an.forEach(e=>{if(e.start==='clic')g.push([e]);else g[g.length-1].push(e)});return g}
/* cronologia unui șir de efecte: primul pornește la 0; Cu precedentul = odată cu cel de deasupra; La clic (doar în
   previzualizare) și După precedentul = după ce s-a terminat ce era înainte */
function cronologie(efs,t0){
  let pSt=t0||0,pEnd=t0||0,prim=true;const out=[];
  efs.forEach(e=>{const d=Math.max(0.02,e.dur||0);let st=prim?(t0||0):(e.start==='cu'?pSt:pEnd);st+=(e.del||0);prim=false;
    out.push({e,st,d});pSt=st;pEnd=Math.max(pEnd,st+d)});
  return {pasi:out,final:pEnd};
}
/* ce se vede după ce s-au redat grupele 0..c ale diapozitivului: un obiect al cărui prim efect e de intrare stă ascuns
   până îi vine rândul */
function vizibil(sl,t,c){
  const efs=sl.an.filter(e=>e.t===t);if(!efs.length)return true;
  let v=efs[0].fam!=='in';
  grupe(sl).forEach((g,k)=>{if(k>c)return;g.forEach(e=>{if(e.t!==t)return;if(e.fam==='in')v=true;else if(e.fam==='out')v=false})});
  return v;
}

/* ---------------- acțiunile ---------------- */
function tinteTranzitie(S){return S.foc==='mini'&&S.multi.length>1?S.multi.slice():[S.cur]}
function puneTranzitie(S,ef){
  const idx=tinteTranzitie(S);snap(S);
  idx.forEach(i=>{S.slides[i].tr=ef==='None'?null:{ef,dur:TR_DUR[ef]}});
  S.ev.tranzitie=1;
  const cui=idx.length>1?`diapozitivelor ${idx.map(i=>i+1).join(', ')}`:`diapozitivului ${idx[0]+1}`;
  S.msg=ef==='None'?`Ai scos tranziția ${cui} (None, Fără).`:
    `Ai pus tranziția ${ef} ${cui}: așa va APĂREA el în expunere, după diapozitivul de dinainte. PowerPoint ți-o arată o dată. Lângă miniatură a apărut steluța.`;
  return idx;
}
function aplicaTuturor(S){
  const t=slideCur(S).tr;snap(S);
  S.slides.forEach(s=>{s.tr=t?{ef:t.ef,dur:t.dur}:null});S.ev.aplicaToate=1;
  S.msg=t?`Toate cele ${S.slides.length} diapozitive au acum tranziția ${t.ef}, cu durata ${durTxt(t.dur)} (Apply To All, Se aplică pentru toate).`
    :'Diapozitivul ales nu are tranziție: Apply To All (Se aplică pentru toate) a scos tranzițiile de peste tot.';
}
function durTranzitie(S,v){
  const d=citesteDur(v);const idx=tinteTranzitie(S);
  if(d==null||d<0.01||d>59.99){S.msg='Durata e un număr de secunde, între 0,01 și 59,99 (de exemplu 0,5).';return}
  if(!idx.some(i=>S.slides[i].tr)){S.msg='Diapozitivul ales nu are tranziție: întâi alegi un efect din galerie, apoi durata.';return}
  snap(S);idx.forEach(i=>{if(S.slides[i].tr)S.slides[i].tr.dur=Math.round(d*100)/100});
  S.msg=`Tranziția ține acum ${durTxt(Math.round(d*100)/100)} secunde. Cu cât numărul e mai mare, cu atât efectul e mai lent.`;
}
function efecteAlese(S){
  const sl=slideCur(S);
  if(S.efSel){const e=sl.an.find(x=>x.id===S.efSel);if(e)return [e]}
  if(S.sel)return sl.an.filter(e=>e.t===S.sel);
  return [];
}
function puneAnimatie(S,ef,adauga){
  const sl=slideCur(S);
  if(!S.sel||S.foc==='mini'){S.msg=adauga?'Add Animation (Adăugare animație) e gri: întâi alege obiectul, cu un clic pe el în diapozitivul mare.'
    :'Efectele sunt gri: întâi alege obiectul (clic pe el, în diapozitivul mare). O animație se pune pe un obiect.';return null}
  const t=S.sel;
  if(ef==='None'){const n=sl.an.filter(e=>e.t===t).length;if(!n){S.msg='Obiectul ales nu are animații.';return null}
    snap(S);sl.an=sl.an.filter(e=>e.t!==t);S.efSel=null;S.msg=`Ai scos animațiile obiectului ales (None, Fără): ${n===1?'efectul lui a dispărut':'toate cele '+n+' efecte au dispărut'} din Panou animație, iar numărul de lângă el nu mai e.`;return null}
  if(ef==='Replay'||ef==='Rewind'){S.msg=`„${ef}” nu e folosit în lecția asta: în simulator nu face nimic.`;return null}
  snap(S);
  const nou={id:'e'+(++uid),t,ef,fam:fam(ef),start:'clic',dur:AN_DUR[ef]==null?0.5:AN_DUR[ef],del:0};
  const ale=sl.an.filter(e=>e.t===t);
  let e;
  if(!adauga&&ale.length){   // din galerie: înlocuiește efectul ales (sau primul efect al obiectului), păstrându-i locul și pornirea
    const tinta=(S.efSel&&ale.find(x=>x.id===S.efSel))||ale[0];
    Object.assign(tinta,{ef,fam:fam(ef),dur:nou.dur});e=tinta;
    S.msg=`Ai schimbat efectul obiectului în ${ef}. (Din galerie, efectul nou îl ÎNLOCUIEȘTE pe cel vechi; ca să pui încă unul, folosești Add Animation, Adăugare animație.)`;
  }else{
    sl.an.push(nou);e=nou;const nr=numere(sl)[nou.id];
    S.msg=adauga?`Ai adăugat încă un efect, ${ef}, la obiectul ales: e ultimul în Panou animație, cu numărul ${nr}.`
      :`Ai pus efectul ${ef} (${fam(ef)==='in'?'de intrare: obiectul APARE':'de evidențiere: obiectul, deja vizibil, atrage atenția'}). Lângă obiect a apărut numărul ${nr}: la al câtelea clic pornește în expunere. PowerPoint ți-l arată o dată.`;
  }
  S.efSel=e.id;S.ev.animatie=1;return e;
}
function schimbaPornire(S,v){
  const efs=efecteAlese(S);if(!efs.length){S.msg='Alege întâi efectul: clic pe obiectul animat sau pe rândul lui din Panou animație.';return}
  if(!PORNIRE[v])return;snap(S);efs.forEach(e=>e.start=v);S.ev.pornire=1;
  const sl=slideCur(S),nr=numere(sl)[efs[0].id];
  S.msg=`Pornire (Start): ${PORNIRE[v][0]} (${PORNIRE[v][1]}). `+(v==='clic'?`Efectul așteaptă un clic nou: are numărul ${nr}.`
    :v==='cu'?`Efectul pornește odată cu cel de deasupra lui, fără clic: ia numărul ${nr}.`:`Efectul pornește imediat după cel de deasupra, fără clic: ia numărul ${nr}.`);
}
function durAnimatie(S,v,camp){
  const efs=efecteAlese(S);if(!efs.length){S.msg='Alege întâi efectul: clic pe obiectul animat sau pe rândul lui din Panou animație.';return}
  const d=citesteDur(v);if(d==null||d<0||d>59.99){S.msg='Scrie un număr de secunde, de exemplu 0,5.';return}
  if(camp==='dur'&&efs.every(e=>e.ef==='Appear')){S.msg='Appear (apariție) e instantaneu: nu are durată (caseta arată Auto).';return}
  snap(S);efs.forEach(e=>{if(camp==='del')e.del=Math.round(d*100)/100;else if(e.ef!=='Appear')e.dur=Math.max(0.01,Math.round(d*100)/100)});
  S.msg=camp==='del'?`Efectul așteaptă ${durTxt(d)} secunde înainte să pornească (Delay, Întârziere).`:`Efectul ține acum ${durTxt(d)} secunde.`;
}
function muta(S,dir){
  const sl=slideCur(S);const e=efecteAlese(S)[0];
  if(!e){S.msg='Alege întâi efectul pe care îl muți: clic pe rândul lui din Panou animație sau pe obiectul animat.';return}
  const i=sl.an.indexOf(e),j=i+dir;
  if(j<0||j>=sl.an.length){S.msg=dir<0?'Efectul e deja primul.':'Efectul e deja ultimul.';return}
  snap(S);sl.an.splice(i,1);sl.an.splice(j,0,e);S.efSel=e.id;S.ev.reordonat=1;
  S.msg=`Ai mutat efectul ${dir<0?'mai devreme (Move Earlier, Mutare mai devreme)':'mai târziu (Move Later, Mutare mai târziu)'}: acum e al ${j+1}-lea în listă. Numerele de pe diapozitiv s-au schimbat singure.`;
}
function sterge(S){
  const sl=slideCur(S);
  if((S.foc==='panou'||S.foc==='ef')&&S.efSel){const e=sl.an.find(x=>x.id===S.efSel);if(e){snap(S);sl.an=sl.an.filter(x=>x!==e);S.efSel=null;
    S.msg=S.foc==='ef'?`Ai scos efectul ${e.ef} (Delete pe numărul lui). Obiectul a rămas pe diapozitiv.`:`Ai scos efectul ${e.ef} din Panou animație (Delete). Obiectul a rămas pe diapozitiv.`;return}}
  if(S.foc==='slide'&&S.sel){snap(S);const t=S.sel;
    if(t.startsWith('ph:'))sl.t[t.slice(3)]='';else sl.obj=sl.obj.filter(o=>o.id!==t.slice(2));
    const n=sl.an.filter(e=>e.t===t).length;sl.an=sl.an.filter(e=>e.t!==t);S.sel=null;S.efSel=null;S.ev.stersObj=1;
    S.msg=`Ai șters OBIECTUL ales (Delete)${n?', iar odată cu el și animația lui':''}. Voiai doar să scoți efectul? Ctrl+Z, apoi, cu obiectul ales, fila Animații → None (Fără).`;return}
  if(S.foc==='mini'){if(S.slides.length<2){S.msg='Prezentarea are un singur diapozitiv: în simulator nu rămâne fără niciunul.';return}
    snap(S);const t=slideCur(S).t.titlu;S.slides.splice(S.cur,1);S.cur=Math.min(S.cur,S.slides.length-1);S.multi=[S.cur];
    S.msg=`Ai șters diapozitivul${t?' „'+t+'”':''}. Nu voiai? Ctrl+Z.`;return}
  S.msg='Întâi alege ce ștergi: un obiect, un efect din Panou animație sau o miniatură.';
}
/* expunerea: {i: diapozitivul, c: clicurile făcute pe el, fin: ecranul de final, anim: ce se redă acum} */
function porneste(S,de){S.menu=null;S.show={i:de,c:0,fin:false,anim:{tr:true,g:0}};S.ev.expunere=1;S.ev['vazut:'+S.slides[de].id]=1;
  if(de===S.slides.length-1&&!clicuri(S.slides[de]))S.ev.expunereUltimul=1}
function inainte(S){
  const H=S.show;if(!H)return;
  /* PowerPoint: un clic dat cât încă rulează o tranziție sau un efect doar îl duce la capăt, nu trece mai departe
     (judecator_com.json#P0_original: 10 clicuri în loc de 7 pe prezentarea nereparată). H.pana = momentul în care se
     termină ce se vede acum; îl pune doar desenarea (pașii automați ai porții nu așteaptă). */
  if(H.pana&&Date.now()<H.pana){H.pana=0;H.anim=null;S.ev.clicTermina=1;return}
  if(H.fin){S.show=null;S.ev.expunereGata=1;S.msg='Ai ieșit din expunere (clic după ecranul negru de final).';return}
  const sl=S.slides[H.i];
  if(H.c<clicuri(sl)){H.c++;H.anim={tr:false,g:H.c};if(H.i===S.slides.length-1&&H.c===clicuri(sl))S.ev.expunereUltimul=1;return}
  if(H.i<S.slides.length-1){H.i++;H.c=0;H.anim={tr:true,g:0};const s2=S.slides[H.i];S.ev['vazut:'+s2.id]=1;
    if(H.i===S.slides.length-1&&!clicuri(s2))S.ev.expunereUltimul=1;return}
  H.fin=true;H.anim=null;S.ev.expunereFinal=1;
}
function inapoi(S){
  const H=S.show;if(!H)return;
  if(H.fin){H.fin=false;H.c=clicuri(S.slides[H.i]);H.anim=null;return}
  if(H.c>0){H.c--;H.anim=null;return}
  if(H.i>0){H.i--;H.c=clicuri(S.slides[H.i]);H.anim=null}
}

function act(S,id,arg){
  S.msg='';
  if(S.show){
    if(id==='next'||id==='k:next')return inainte(S);
    if(id==='prev'||id==='k:prev')return inapoi(S);
    if(id==='esc'||id==='k:esc'){S.show=null;S.ev.expunereEsc=1;S.msg='Ai ieșit din expunere cu Esc: ești înapoi în fereastra de lucru.';return}
    return;
  }
  if(id==='k:undo')return undo(S);
  if(id==='k:redo')return redo(S);
  if(id==='k:del')return sterge(S);
  if(id==='f5'){porneste(S,0);S.msg='';return}
  if(id==='shift-f5'){porneste(S,S.cur);return}
  if(id==='esc'||id==='k:esc'){S.menu=null;S.sel=null;S.efSel=null;return}
  if(id.startsWith('tab-')){S.menu=null;const k=id.slice(4);
    if(k==='file'){S.msg='Fila File (Fișier) ai folosit-o în lecția 3 (salvare, deschidere). Aici nu ne trebuie.';return}
    S.tab=k;if(k!=='transitions'&&k!=='animations'&&k!=='slideshow')S.msg=`Pe fila asta nu lucrăm azi: tranzițiile sunt pe Transitions (Tranziții), animațiile pe Animations (Animații).`;return}
  if(id.startsWith('mini-')){const i=Math.min(+id.slice(5)-1,S.slides.length-1);
    if(arg&&arg.ctrl){S.multi=S.multi.includes(i)?(S.multi.length>1?S.multi.filter(x=>x!==i):S.multi):S.multi.concat(i);S.cur=i;}
    else if(arg&&arg.shift){const a=Math.min(S.cur,i),b=Math.max(S.cur,i);S.multi=Array.from({length:b-a+1},(_,k)=>a+k);S.cur=i}
    else{S.cur=i;S.multi=[i]}
    S.foc='mini';S.sel=null;S.efSel=null;S.menu=null;
    if(S.multi.length>1)S.msg=`Ai ales ${S.multi.length} miniaturi (${S.multi.map(x=>x+1).join(', ')}): o tranziție din galerie se pune pe toate.`;return}
  if(id==='slide'){S.foc='slide';S.sel=null;S.efSel=null;S.menu=null;S.multi=[S.cur];return}
  if(id.startsWith('obj:')){const t=id.slice(4);S.foc='slide';S.sel=t;S.multi=[S.cur];S.menu=null;
    const e=slideCur(S).an.find(x=>x.t===t);S.efSel=e?e.id:null;
    S.msg=`Ai ales ${eticheta(slideCur(S),t)}.`+(S.tab==='animations'?'':' Animațiile lui sunt pe fila Animations (Animații).');return}
  if(id.startsWith('ef:')){const e=slideCur(S).an.find(x=>x.id===id.slice(3));if(!e)return;S.efSel=e.id;S.sel=e.t;S.foc=arg&&arg.dinPanou?'panou':(arg&&arg.dinTag?'ef':'slide');S.menu=null;return}
  if(id==='menu-close'){S.menu=null;return}
  if(id==='efmenu'){S.menu=S.menu==='efmenu'?null:'efmenu';return}
  if(id.startsWith('efm:')){const c=id.slice(4);S.menu=null;S.foc='panou';
    if(c==='remove'){const e=efecteAlese(S)[0];if(!e)return;snap(S);slideCur(S).an=slideCur(S).an.filter(x=>x!==e);S.efSel=null;S.msg=`Ai scos efectul ${e.ef} (Remove, Eliminare). Obiectul a rămas pe diapozitiv.`;return}
    if(PORNIRE[c])return schimbaPornire(S,c);
    S.msg='Comanda asta nu e folosită în lecția asta: în simulator nu face nimic.';return}
  /* fila Transitions */
  if(id.startsWith('tr:'))return puneTranzitie(S,id.slice(3));
  if(id==='apply-all')return aplicaTuturor(S);
  if(id==='trdur')return durTranzitie(S,arg&&arg.v);
  if(id==='trdur+'||id==='trdur-'){const t=slideCur(S).tr;if(!t){S.msg='Diapozitivul ales nu are tranziție: întâi alegi un efect din galerie.';return}
    return durTranzitie(S,Math.max(0.01,t.dur+(id==='trdur+'?0.25:-0.25)))}
  if(id==='tr-mai'){S.msg='Galeria are și alte tranziții (în PowerPoint o derulezi sau apeși săgeata ▾ din dreapta ei). În simulator folosești efectele de pe rând.';return}
  if(id==='efopt'){S.msg='Opțiuni efect (Effect Options) schimbă direcția efectului (de jos, de la stânga...). Nu le folosim în lecția asta: în simulator nu fac nimic.';return}
  if(id==='avansare'){S.msg='Avansarea diapozitivelor (La clic sau automat, după un timp) o înveți în lecția 8. Aici rămâne bifat On Mouse Click.';return}
  if(id==='sunet'){S.msg='Sunetul tranziției (Sound) rămâne [No Sound]: sunetele la fiecare trecere încurcă publicul. În simulator lista nu se deschide.';return}
  /* fila Animations */
  if(id.startsWith('an:'))return puneAnimatie(S,id.slice(3),false);
  if(id.startsWith('add:')){S.menu=null;return puneAnimatie(S,id.slice(4),true)}
  if(id==='an-mai'){if(!S.sel||S.foc==='mini'){S.msg='Efectele sunt gri: întâi alege obiectul, cu un clic pe el în diapozitivul mare.';return}S.menu=S.menu==='gal'?null:'gal';return}
  if(id==='add-menu'){if(!S.sel||S.foc==='mini'){S.msg='Add Animation (Adăugare animație) e gri: întâi alege obiectul, cu un clic pe el în diapozitivul mare.';return}S.menu=S.menu==='add'?null:'add';return}
  if(id==='panou'){S.panou=!S.panou;S.menu=null;S.msg=S.panou?'S-a deschis Panou animație (Animation Pane): lista efectelor diapozitivului, în ordinea în care pornesc.':'';return}
  if(id==='anstart')return schimbaPornire(S,arg&&arg.v);
  if(id==='andur')return durAnimatie(S,arg&&arg.v,'dur');
  if(id==='andel')return durAnimatie(S,arg&&arg.v,'del');
  if(id==='andur+'||id==='andur-'||id==='andel+'||id==='andel-'){const e=efecteAlese(S)[0];if(!e){S.msg='Alege întâi efectul.';return}
    const del=id.startsWith('andel');return durAnimatie(S,Math.max(0,(del?e.del:e.dur)+(id.endsWith('+')?0.25:-0.25)),del?'del':'dur')}
  if(id==='mai-devreme')return muta(S,-1);
  if(id==='mai-tarziu')return muta(S,1);
  if(id==='pv'){S.ev.previzualizare=1;return}
}

/* ---------------- desenarea ---------------- */
function tintaHTML(sl,t,inner,cls,stilPlus,mod,S){
  const i=tintaInfo(sl,t);
  const sel=mod==='edit'&&S&&S.sel===t&&S.foc!=='mini';
  return `<div class="${cls}${sel?' sel':''}" style="left:${i.x}%;top:${i.y}%;${stilPlus}"${mod==='edit'?` data-t="obj:${t}" role="button" tabindex="-1" aria-label="${esc(eticheta(sl,t))}"`:''} data-tinta="${t}">${inner}</div>`;
}
function slideCorp(sl,mod,S,ascuns){
  const ph=LAY[sl.lay].ph.map(p=>{const t='ph:'+p.k;if(ascuns&&ascuns(t))return '';
    const txt=String(sl.t[p.k]||''),gol=!txt.trim();if(gol&&mod!=='edit')return '';
    const multi=p.tip==='content';
    const inner=gol?`<span>${esc(p.p)}</span>`:(multi?`<ul>${txt.split('\n').filter(x=>x.trim()).map(l=>`<li>${esc(l)}</li>`).join('')}</ul>`:esc(txt).replace(/\n/g,'<br>'));
    return tintaHTML(sl,t,inner,`sa-ph sa-${p.tip} sa-v${p.v||'t'}${p.al==='c'?' sa-c':''}${gol?' gol':''}`,`width:${p.w}%;height:${p.h}%;--pt:${p.pt||24}`,mod,S)}).join('');
  const ob=sl.obj.map(o=>{const t='o:'+o.id;if(ascuns&&ascuns(t))return '';
    const inner=o.tip==='caseta'?esc(o.txt||'').replace(/\n/g,'<br>'):o.tip==='imagine'?(FIS[o.fis]||''):forma(o.forma,o.culoare);
    return tintaHTML(sl,t,inner,`sa-o sa-o-${o.tip}`,(o.tip==='caseta'?(o.w?`width:${o.w}%;`:''):`width:${o.w}%;height:${o.h}%;`)+`--pt:${o.pt||18}`,mod,S)}).join('');
  return ph+ob;
}
function tagsHTML(S,sl){
  const nr=numere(sl),pe={};
  sl.an.forEach(e=>{(pe[e.t]=pe[e.t]||[]).push(e)});
  return Object.entries(pe).map(([t,efs])=>{const i=tintaInfo(sl,t);if(!i)return '';
    return `<span class="sa-tag" style="left:${i.x}%;top:${i.y}%">${efs.map(e=>`<button type="button" class="${S.efSel===e.id?'on':''}" data-t="ef:${e.id}" aria-label="Efectul ${esc(e.ef)}, numărul ${nr[e.id]}">${nr[e.id]}</button>`).join('')}</span>`}).join('');
}
const slideHTML=(sl,mod,S,ascuns)=>`<div class="sa-slide${mod==='edit'?' ed':''}"${mod==='edit'?' data-t="slide"':''}>${mod==='edit'?`<div class="sa-clip">${slideCorp(sl,mod,S,ascuns)}</div>`:slideCorp(sl,mod,S,ascuns)}${mod==='edit'&&(S.tab==='animations'||S.panou)?tagsHTML(S,sl):''}</div>`;

/* panglica reală, cu grupul Timing completat (casetele Duration / Start / Delay nu apar în dump-ul UIA) */
let PD=null;
function panglicaDate(){
  if(PD)return PD;const P=window.PANGLICA_POWERPOINT;if(!P)return null;
  const D=clona(P);
  const g=(fila,grup)=>{const f=D.file.find(x=>x.id===fila);return f&&f.grupuri.find(x=>x.eticheta===grup)};
  const b=(id,et,rect)=>({id,eticheta:et,tip_uia:'Custom',marime:'mic',rect});
  const gt=g('TabTransitions','Timing');if(gt)gt.butoane.unshift(b('x:TrSound','Sound',[10,2,205,30]),b('x:TrDur','Duration',[10,34,205,30]),b('x:TrAdv','Advance Slide',[223,2,160,30]),b('x:TrAfterT','After',[297,66,88,30]));
  const ga=g('TabAnimations','Timing');if(ga)ga.butoane.unshift(b('x:AnStart','Start',[10,2,195,30]),b('x:AnDur','Duration',[10,34,195,30]),b('x:AnDel','Delay',[10,66,195,30]),b('x:AnReord','Reorder Animation',[212,2,135,30]));
  PD=D;return D;
}
const TABURI={TabHome:'home',TabInsert:'insert',TabDesign:'design',TabTransitions:'transitions',TabAnimations:'animations',TabSlideShow:'slideshow',TabView:'view'};
function panglica(S){
  const P=panglicaDate(),U=window.UiPanglica;
  if(!P||!U)return `<div style="padding:6px;background:#fff">${['transitions','animations','slideshow'].map(k=>`<button type="button" data-t="tab-${k}">${k}</button>`).join(' ')}</div>`;
  U.stil();
  const fila=Object.keys(TABURI).find(k=>TABURI[k]===S.tab)||'TabHome';
  const sl=slideCur(S),leg={},ic=P.icoane||{};
  const spin=(camp,val,gri)=>`<input type="text" inputmode="decimal" data-camp="${camp}" value="${esc(val)}" aria-label="${camp==='trdur'||camp==='andur'?'Durata, în secunde':'Întârzierea, în secunde'}"${gri?' disabled class="gri"':''}><span class="spin"><button type="button" data-t="${camp}+" aria-label="Mai mult">▲</button><button type="button" data-t="${camp}-" aria-label="Mai puțin">▼</button></span>`;
  if(S.tab==='transitions'){
    leg.TransitionPreview={attr:'data-t="pv"',title:'Previzualizare (Preview): vezi din nou tranziția'};
    TR_RAND.forEach(n=>{const on=n==='None'?!sl.tr:(sl.tr&&sl.tr.ef===n);leg['galerie:'+n]={attr:`data-t="tr:${n}"`,title:n==='None'?'None (Fără): fără tranziție':`${n}${n==='Fade'?' (estompare)':''}`,clasa:on?'pg-on':''}});
    leg.AnimationTransitionGallery={attr:'data-t="tr-mai"',title:'Galeria de tranziții'};
    leg.AnimationTransitionVariantGallery={attr:'data-t="efopt"',title:'Opțiuni efect (Effect Options)'};
    leg.SlideTransitionApplyToAll={attr:'data-t="apply-all"',title:'Se aplică pentru toate (Apply To All): aceeași tranziție pe toate diapozitivele'};
    leg.SlideTransitionOnMouseClick={html:`<span class="sa-camp"><label><input type="checkbox" checked data-t="avansare"> On Mouse Click</label></span>`,title:'La clic (lecția 8)'};
    leg.SlideTransitionAutomaticallyAfter={html:`<span class="sa-camp"><label><input type="checkbox" data-t="avansare"> After:</label></span>`,title:'Automat, după un timp (lecția 8)'};
    leg['x:TrSound']={html:`<span class="sa-camp"><span class="et">Sound:</span><button type="button" data-t="sunet" style="border:1px solid #BDBDBD;background:#fff;height:22px;flex:1;text-align:left;padding:0 4px">[No Sound] ▾</button></span>`,title:'Sunet (Sound)'};
    leg['x:TrDur']={html:`<span class="sa-camp"><span class="et">Duration:</span>${spin('trdur',sl.tr?durTxt(sl.tr.dur):'02,00',!sl.tr)}</span>`,title:'Durată (Duration), în secunde'};
    leg['x:TrAdv']={html:`<span class="sa-camp" style="color:#555">Advance Slide</span>`,title:'Avansare diapozitiv (lecția 8)'};
    leg['x:TrAfterT']={html:`<span class="sa-camp"><input type="text" value="00:00,00" disabled class="gri" aria-label="After, timpul (lecția 8)"></span>`,title:'Timpul pentru After (lecția 8)'};
  }else if(S.tab==='animations'){
    const are=!!S.sel&&S.foc!=='mini',efs=efecteAlese(S),e=efs[0];
    leg.AnimationPreview={attr:'data-t="pv"',title:'Previzualizare (Preview): vezi animațiile diapozitivului'};
    AN_RAND.forEach(n=>{const on=are&&e&&e.ef===n;leg['galerie:'+n]={attr:`data-t="an:${n}"`,title:n==='None'?'None (Fără): scoate animațiile obiectului ales':n,clasa:(on?'pg-on ':'')+(are?'':'pg-gri')}});
    leg.AnimationGallery={attr:'data-t="an-mai"',title:'Galeria de animații'};
    leg.EffectOptionsMenu={attr:'data-t="efopt"',title:'Opțiuni efect (Effect Options)'};
    leg.AnimationAddGallery={attr:'data-t="add-menu"',title:'Adăugare animație (Add Animation): încă un efect pentru obiectul ales',clasa:(S.menu==='add'?'pg-on ':'')+(are?'':'pg-gri')};
    leg.AnimationCustom={attr:'data-t="panou"',title:'Panou animație (Animation Pane)',clasa:S.panou?'pg-on':''};
    leg.AnimationMoveEarlier={attr:'data-t="mai-devreme"',title:'Mutare mai devreme (Move Earlier)'};
    leg.AnimationMoveLater={attr:'data-t="mai-tarziu"',title:'Mutare mai târziu (Move Later)'};
    const gri=!e;
    leg['x:AnStart']={html:`<span class="sa-camp"><span class="et">Start:</span><select data-camp="anstart" aria-label="Pornire (Start)"${gri?' disabled class="gri"':''}>${Object.entries(PORNIRE).map(([k,[en]])=>`<option value="${k}"${e&&e.start===k?' selected':''}>${en}</option>`).join('')}</select></span>`,title:'Pornire (Start): La clic, Cu precedentul, După precedentul'};
    leg['x:AnDur']={html:`<span class="sa-camp"><span class="et">Duration:</span>${e&&e.ef==='Appear'?'<input type="text" value="Auto" disabled class="gri" aria-label="Durata: Auto">':spin('andur',e?durTxt(e.dur):'',gri)}</span>`,title:'Durată (Duration), în secunde'};
    leg['x:AnDel']={html:`<span class="sa-camp"><span class="et">Delay:</span>${spin('andel',e?durTxt(e.del||0):'',gri)}</span>`,title:'Întârziere (Delay), în secunde'};
    leg['x:AnReord']={html:`<span class="sa-camp" style="color:#555">Reorder Animation</span>`,title:'Reordonare animație'};
  }else if(S.tab==='slideshow'){
    leg.SlideShowFromBeginning={attr:'data-t="f5"',title:'De la început (From Beginning) · F5'};
    leg.SlideShowFromCurrent={attr:'data-t="shift-f5"',title:'De la diapozitivul curent (From Current Slide) · Shift+F5'};
  }
  return U.html(P,{fila,taburi:TABURI,legaturi:leg,atribFila:k=>`data-t="tab-${k}"`,fisier:'<button type="button" class="pg-fisier" data-t="tab-file">File</button>'});
}
function meniuHTML(S){
  if(S.menu!=='gal'&&S.menu!=='add')return '';
  const add=S.menu==='add',pre=add?'add:':'an:';
  const tile=(n,c)=>`<button type="button" class="sa-tile" data-t="${pre}${n}" title="${esc(n)}">${STEA(c)}<span>${esc(n)}</span></button>`;
  return `<div class="sa-menu" role="menu"><div class="sa-mt"><span>${add?'Add Animation · Adăugare animație (se ADAUGĂ încă un efect)':'Animation · galeria (efectul nou îl ÎNLOCUIEȘTE pe cel vechi)'}</span><button type="button" class="sa-x" data-t="menu-close" aria-label="Închide lista">×</button></div>
    ${add?'':`<button type="button" class="sa-mi" data-t="an:None" style="color:#222">None · Fără (scoate animațiile obiectului)</button>`}
    <div class="sa-gr">Entrance <span style="font-weight:400;color:#666">· intrare: obiectul apare</span></div><div class="sa-gal">${AN_IN.map(n=>tile(n,CUL_FAM.in)).join('')}</div>
    <div class="sa-gr">Emphasis <span style="font-weight:400;color:#666">· evidențiere: obiectul, deja vizibil, atrage atenția</span></div><div class="sa-gal">${AN_EMF.map(n=>tile(n,CUL_FAM.emf)).join('')}</div>
    <div class="sa-gr">Exit <span style="font-weight:400;color:#666">· ieșire: obiectul dispare (nu îl folosim azi)</span></div>
    ${['More Entrance Effects...','More Emphasis Effects...','More Exit Effects...','More Motion Paths...'].map(t=>`<button type="button" class="sa-mi" data-nesim="1">${t}</button>`).join('')}</div>`;
}
function panouHTML(S){
  if(!S.panou)return '';
  const sl=slideCur(S),nr=numere(sl),max=Math.max(1,...sl.an.map(e=>(e.del||0)+(e.dur||0.3)));
  const ales=S.efSel&&sl.an.find(e=>e.id===S.efSel);
  const meniu=`<li class="sa-efm" role="menu">${[['clic','Start On Click'],['cu','Start With Previous'],['dupa','Start After Previous'],['x','Effect Options...'],['x','Timing...'],['x','Hide Advanced Timeline'],['remove','Remove']].map(([k,t])=>`<button type="button" data-t="efm:${k}" role="menuitem"${k==='x'?' class="gri"':''}>${t}${k==='remove'?' <span style="color:#777">· Eliminare</span>':PORNIRE[k]?` <span style="color:#777">· ${PORNIRE[k][1]}</span>`:''}</button>`).join('')}</li>`;
  const rows=sl.an.map(e=>`<li class="sa-rand"><button type="button" class="${S.efSel===e.id?'on':''}" data-t="ef:${e.id}" data-panou="1" aria-label="${esc(`${e.start==='clic'?nr[e.id]+', ':''}${PORNIRE[e.start][0]}, ${e.ef}, ${eticheta(sl,e.t)}`)}">
    <span class="n">${e.start==='clic'?nr[e.id]:''}</span><span>${e.start==='clic'?IC_MOUSE:e.start==='dupa'?IC_CEAS:''}</span><span>${STEA(CUL_FAM[e.fam]||CUL_FAM.in)}</span><span class="nm">${esc(eticheta(sl,e.t))}</span>
    <span></span><span></span><span></span><span class="bar" style="width:${Math.max(6,Math.round(((e.dur||0.05))/max*100))}%;margin-left:${Math.round((e.del||0)/max*100)}%"></span></button>${ales===e?`<button type="button" class="sa-efdd" data-t="efmenu" aria-label="Meniul efectului (săgeata în jos)" title="Meniul efectului">▾</button>`:''}</li>${ales===e&&S.menu==='efmenu'?meniu:''}`).join('');
  return `<div class="sa-panou" data-t="zona-panou"><div class="sa-pt"><span>Animation Pane</span><button type="button" class="sa-x" data-t="panou" aria-label="Închide Panou animație">×</button></div>
    <div class="sa-pb"><button type="button" data-t="pv">▶ Play All</button><span style="flex:1"></span><button type="button" data-t="mai-devreme" aria-label="Mutare mai devreme (Move Earlier)" title="Move Earlier">▲</button><button type="button" data-t="mai-tarziu" aria-label="Mutare mai târziu (Move Later)" title="Move Later">▼</button></div>
    ${sl.an.length?`<ol class="sa-pl">${rows}</ol>`:'<div class="sa-pgol">Diapozitivul nu are animații. Alege un obiect, apoi un efect din galerie.</div>'}</div>`;
}
function appHTML(S,PV){
  const sl=slideCur(S);
  const th=S.slides.map((s,k)=>{const are=!!s.tr||s.an.length>0;
    return `<div class="sa-th${k===S.cur?' on':''}${S.foc==='mini'&&S.multi.includes(k)&&S.multi.length>1?' multi':''}${S.foc==='mini'&&k===S.cur?' multi':''}" data-t="mini-${k+1}" data-mini="${k}" role="button" tabindex="-1" aria-label="Miniatura diapozitivului ${k+1}${s.t.titlu?' „'+esc(s.t.titlu)+'”':''}${are?', are efecte':''}">
      <span class="sa-thn"><i>${k+1}</i>${are?`<button type="button" class="sa-star" data-t="stea-${k+1}" aria-label="Redă efectele diapozitivului ${k+1}" title="Redă efectele (Play Animations)">${STEA('#6B6B6B')}</button>`:''}</span><span class="sa-mini"><span class="sa-sw">${slideHTML(s,'mini',S)}</span></span></div>`}).join('');
  const lucru=PV?PV.html:`<div class="sa-sw">${slideHTML(sl,'edit',S)}</div>`;
  return `<div class="sa"><div class="sa-bar">Presentation1 - PowerPoint</div><div data-t="zona-panglica">${panglica(S)}</div>${meniuHTML(S)}
    <div class="sa-main${S.panou?' cu-panou':''}"><div class="sa-thumbs" data-t="zona-miniaturi">${th}</div><div class="sa-work" style="position:relative">${lucru}</div>${panouHTML(S)}</div>
    <div class="sa-status"><span>Slide ${S.cur+1} of ${S.slides.length}</span><span>${LAY[sl.lay].n}</span></div></div>`;
}

/* ---------------- redarea efectelor (previzualizare și expunere) ---------------- */
function animStil(e,st,d){const k=(e.fam==='in'?'sa-in-':'sa-emf-')+(e.fam==='emf'&&!['pulse','spin','teeter'].includes(slug(e.ef))?'gen':slug(e.ef));
  return `animation-name:${k};animation-duration:${e.ef==='Appear'?0.01:d}s;animation-delay:${st}s;${e.ef==='Random Bars'?'animation-timing-function:steps(6,end);':''}`}
/* desenează diapozitivul cu efectele din `pasi` pornite la momentele lor; `vede(t)` = obiectele vizibile la început */
function slideAnimat(sl,pasi,vede){
  const pe={};pasi.forEach(p=>{(pe[p.e.t]=pe[p.e.t]||[]).push(p)});
  const div=document.createElement('div');div.innerHTML=`<div class="sa-sw">${slideHTML(sl,'show',null,t=>!vede(t)&&!pe[t])}</div>`;
  div.querySelectorAll('[data-tinta]').forEach(el=>{const ps=pe[el.dataset.tinta];if(!ps)return;const p=ps[0];
    el.classList.add('sa-anim');const inf=tintaInfo(sl,el.dataset.tinta);   // Fly In: pornește de sub marginea de jos a diapozitivului
    el.setAttribute('style',el.getAttribute('style')+';'+animStil(p.e,p.st,p.d)+(inf?`--fy:${Math.round((100-inf.y)/Math.max(1,inf.h)*100+8)};`:''));
    if(ps.length>1){let w=el;ps.slice(1).forEach(q=>{const s=document.createElement('div');s.className='sa-anim';s.setAttribute('style','position:absolute;inset:0;'+animStil(q.e,q.st,q.d));
      while(w.firstChild)s.appendChild(w.firstChild);w.appendChild(s);w=s})}});
  return div.innerHTML;
}
const TR_ANIM={Fade:['sa-tr-fade'],Push:['sa-tr-push','sa-tr-push-out'],Wipe:['sa-tr-wipe'],Split:['sa-tr-split'],Reveal:['sa-tr-reveal','sa-tr-reveal-out'],
  Cut:[null],'Random Bars':['sa-tr-random-bars'],Shape:['sa-tr-shape'],Uncover:[null,'sa-tr-uncover-out'],Cover:['sa-tr-cover'],Morph:['sa-tr-morph']};
function straturi(prevHTML,curHTML,tr){
  const [a,b]=TR_ANIM[tr.ef]||['sa-tr-fade'];const d=tr.ef==='Cut'?0.01:tr.dur;
  const f=(k)=>k?`animation-name:${k};animation-duration:${d}s;animation-fill-mode:both;animation-timing-function:${tr.ef==='Random Bars'?'steps(6,end)':'ease-in-out'}`:'';
  const unc=tr.ef==='Uncover';
  return `${prevHTML!=null?`<div class="sa-lay" style="z-index:${unc?2:1};${f(b)}">${prevHTML}</div>`:''}<div class="sa-lay" style="z-index:${unc?1:2};${prevHTML==null&&!a?'':f(a)}">${curHTML}</div>`;
}

/* ---------------- testele (pe starea prezentării) ---------------- */
const Dd=(S,d)=>typeof d==='string'?S.slides.find(s=>norm(s.t.titlu)===norm(d)):S.slides[d-1];
function tintaDin(sl,m){   // m = {ph:'titlu'} | {ref:'raspuns'} | {txt:'...'} | {tip, forma}
  if(!sl||!m)return null;
  if(m.ph)return LAY[sl.lay].ph.some(p=>p.k===m.ph)?'ph:'+m.ph:null;
  const o=sl.obj.find(o=>(m.ref==null||o.ref===m.ref)&&(m.txt==null||norm(o.txt)===norm(m.txt))&&(!m.tip||o.tip===m.tip)&&(!m.forma||o.forma===m.forma)&&(!m.fis||o.fis===m.fis));
  return o?'o:'+o.id:null;
}
const efDe=(sl,m)=>{const t=tintaDin(sl,m);return t?sl.an.filter(e=>e.t===t):[]};
const potrivEf=(e,c)=>(!c.ef||e.ef===c.ef)&&(!c.fam||e.fam===c.fam)&&(!c.start||e.start===c.start);
const CHK={
  tr:(S,c)=>{const s=Dd(S,c.d);return !!s&&!!s.tr&&(!c.ef||s.tr.ef===c.ef)},
  faraTr:(S,c)=>{const s=Dd(S,c.d);return !!s&&!s.tr},
  trToate:(S,c)=>{const t0=S.slides[0].tr;return !!t0&&S.slides.every(s=>s.tr&&s.tr.ef===t0.ef)&&(!c.ef||t0.ef===c.ef)},
  trDur:(S,c)=>S.slides.filter((s,i)=>c.d==null||Dd(S,c.d)===s).every(s=>s.tr&&Math.abs(s.tr.dur-c.v)<0.011),
  trDurMax:(S,c)=>S.slides.every(s=>!s.tr||s.tr.dur<=c.max+1e-9),
  an:(S,c)=>efDe(Dd(S,c.d),c.o).some(e=>potrivEf(e,c)),
  faraAn:(S,c)=>{const s=Dd(S,c.d);return !!s&&!!tintaDin(s,c.o)&&!efDe(s,c.o).some(e=>!c.fam||e.fam===c.fam)},
  nrAn:(S,c)=>{const s=Dd(S,c.d);return !!s&&s.an.length===c.n},
  ordine:(S,c)=>{const s=Dd(S,c.d);if(!s)return false;let i=-1;
    for(const m of c.val){const t=tintaDin(s,m);const j=s.an.findIndex(e=>e.t===t&&e.fam==='in');if(j<=i)return false;i=j}return true},
  clicuri:(S,c)=>{const s=Dd(S,c.d);return !!s&&clicuri(s)===c.n},
  laClic:(S,c)=>{const s=Dd(S,c.d);if(!s)return false;const t=tintaDin(s,c.o);if(!t)return false;const g=grupe(s);
    const k=g.findIndex(gr=>gr.some(e=>e.t===t&&e.fam==='in'));return k===c.n},
  vizibil:(S,c)=>{const s=Dd(S,c.d);const t=tintaDin(s,c.o);return !!t&&vizibil(s,t,0)&&!s.an.some(e=>e.t===t&&e.fam==='in')},
  nobj:(S,c)=>{const s=Dd(S,c.d);return !!s&&s.obj.length===c.n},
  nr:(S,c)=>S.slides.length===c.n,
  titlu:(S,c)=>{const s=Dd(S,c.d);return !!s&&norm(s.t.titlu)===norm(c.val)},
  ev:(S,c)=>!!S.ev[c.e]
};
const trece=(S,t)=>t.c.every(c=>CHK[c.k](S,c));

/* pașii automați (rezolvarea pentru poartă și pentru „Arată-mi răspunsul”) */
function ruleaza(S,pasi){
  for(const a of pasi||[]){
    if(typeof a==='string'){act(S,a);continue}
    if(a.ctrl){act(S,'mini-'+a.ctrl,{ctrl:true});continue}
    if(a.alege){const t=tintaDin(slideCur(S),a.alege);if(t)act(S,'obj:'+t);continue}
    if(a.ef){const t=tintaDin(slideCur(S),a.ef);const e=t&&slideCur(S).an.find(x=>x.t===t);if(e)act(S,'ef:'+e.id,{dinPanou:true});continue}
    if('trDur' in a){act(S,'trdur',{v:a.trDur});continue}
    if(a.add){act(S,'add:'+a.add);continue}
    if(a.start){act(S,'anstart',{v:a.start});continue}
    if('anDur' in a){act(S,'andur',{v:a.anDur});continue}
  }
}

/* ---------------- gesturile: mouse, atingere, tastatură ---------------- */
function render(Q,body,api){
  stil();
  let S=init(Q);let PV=null,pvTimer=null,shTimer=null;
  body.innerHTML=`<div class="sa-root"><div class="sa-app"></div><div class="sa-msg" aria-live="polite"></div>
    <div class="sa-taste" role="group" aria-label="Tastele"><span class="lbl2">Tastele (pe telefon nu le ai: apasă-le aici; merg și cu mouse-ul):</span>
      <button type="button" data-k="k:del">Delete<small>șterge</small></button><button type="button" data-k="k:undo">Ctrl+Z<small>anulează</small></button>${Q.f5?'<button type="button" data-k="f5">F5<small>expunere</small></button>':''}</div>
    <div class="lbl">Testele tale (se bifează singure)</div><ol class="sa-teste"></ol>
    <div class="sa-unelte"><button type="button" class="btn ghost sm sa-reset">Ia-o de la capăt</button></div></div>`;
  const root=body.querySelector('.sa-root'),app=body.querySelector('.sa-app'),msg=body.querySelector('.sa-msg'),ol=body.querySelector('.sa-teste');
  function side(){
    ol.innerHTML=Q.teste.map(t=>`<li class="${trece(S,t)?'ok':''}">${t.ce}</li>`).join('');
    msg.innerHTML=S.msg?esc(S.msg):(Q.teste.every(t=>trece(S,t))?'Toate testele sunt bifate. Apasă „Verifică”.':'Lucrează în fereastră; testele se bifează singure când sunt gata.');
  }
  function opresteRedarea(){if(pvTimer){clearTimeout(pvTimer);pvTimer=null}PV=null}
  let filaDesenata=null;
  function draw(){
    const bd=app.querySelector('.pg-banda'),x=bd?bd.scrollLeft:0;   // panglica își păstrează derularea laterală pe aceeași filă
    app.innerHTML=appHTML(S,PV);side();desenExpunere();
    const bd2=app.querySelector('.pg-banda');if(bd2&&filaDesenata===S.tab)bd2.scrollLeft=x;filaDesenata=S.tab;
  }
  /* previzualizarea în diapozitivul mare: tranziția (fila Transitions), animațiile (fila Animations, panoul), un efect nou */
  function reda(mod,efId){
    opresteRedarea();const sl=slideCur(S);let html,total=0;
    const nota='<span class="sa-pvnota">Previzualizare · desenată aproximativ: în PowerPoint efectul arată puțin altfel.</span>';
    if(mod==='tr'||mod==='tot'){
      const tr=sl.tr;
      if(tr){const prev=S.cur>0?`<div class="sa-sw">${slideHTML(S.slides[S.cur-1],'show')}</div>`:null;
        let cur=`<div class="sa-sw">${slideHTML(sl,'show',null,t=>!vizibil(sl,t,-1))}</div>`;total=tr.ef==='Cut'?0.1:tr.dur;
        if(mod==='tot'&&sl.an.length){const cr=cronologie(sl.an,total);cur=slideAnimat(sl,cr.pasi,t=>vizibil(sl,t,-1));total=cr.final}
        html=`<div class="sa-sw" style="position:relative"><div class="sa-slide" style="background:#000">${straturi(prev,cur,tr)}</div>${nota}</div>`}
      else if(mod==='tot'&&sl.an.length){const cr=cronologie(sl.an,0);html=`<div class="sa-sw" style="position:relative">${slideAnimat(sl,cr.pasi,t=>vizibil(sl,t,-1))}${nota}</div>`;total=cr.final}
      else{S.msg=mod==='tr'?'Diapozitivul ales nu are tranziție: nu ai ce previzualiza.':'Diapozitivul nu are efecte.';return draw()}
    }else if(mod==='an'){
      if(!sl.an.length){S.msg='Diapozitivul nu are animații: nu ai ce previzualiza.';return draw()}
      const cr=cronologie(sl.an,0);html=`<div class="sa-sw" style="position:relative">${slideAnimat(sl,cr.pasi,t=>vizibil(sl,t,-1))}${nota}</div>`;total=cr.final;
    }else if(mod==='ef'){
      const e=sl.an.find(x=>x.id===efId);if(!e)return draw();
      const cr=cronologie([Object.assign({},e,{del:0})],0);html=`<div class="sa-sw" style="position:relative">${slideAnimat(sl,cr.pasi,()=>true)}${nota}</div>`;total=cr.final;
    }
    PV={html};draw();pvTimer=setTimeout(()=>{PV=null;pvTimer=null;draw()},Math.round(total*1000)+450);
  }
  /* expunerea, pe tot ecranul */
  let showEl=null;
  function desenExpunere(){
    if(!S.show){if(showEl){showEl.remove();showEl=null;document.documentElement.style.overflow=''}return}
    if(!showEl){showEl=document.createElement('div');showEl.className='sa-show';showEl.setAttribute('role','dialog');showEl.setAttribute('aria-label','Expunerea (Slide Show)');
      document.body.appendChild(showEl);document.documentElement.style.overflow='hidden';   // la capătul paginii: deasupra butoanelor plutitoare ale sitului
      showEl.addEventListener('click',e=>{const b=e.target.closest('[data-sh]');if(b){e.stopPropagation();return gest(b.dataset.sh)}
        if(e.target.closest('.sa-show-st,.sa-show-fin'))gest('next')})}
    const H=S.show;let scena;
    if(H.fin)scena=`<div class="sa-show-fin">End of slide show, click to exit.<br><small style="color:#999">(Sfârșitul expunerii: un clic, și ieși.)</small></div>`;
    else{const sl=S.slides[H.i];let inner;
      if(H.anim){const g=grupe(sl);const tr=H.anim.tr&&sl.tr;const t0=tr?(sl.tr.ef==='Cut'?0.1:sl.tr.dur):0;
        const cr=cronologie(g[H.anim.g]||[],t0);
        const cur=slideAnimat(sl,cr.pasi,t=>vizibil(sl,t,H.anim.g-1));
        const prevSl=H.anim.tr&&H.i>0?S.slides[H.i-1]:null;
        inner=tr?straturi(prevSl?`<div class="sa-sw">${slideHTML(prevSl,'show',null,t=>!vizibil(prevSl,t,clicuri(prevSl)))}</div>`:null,cur,sl.tr):`<div class="sa-lay">${cur}</div>`;
        const ms=Math.round(cr.final*1000);H.pana=ms>0?Date.now()+ms:0;
        clearTimeout(shTimer);shTimer=setTimeout(()=>{if(S.show){S.show.anim=null;S.show.pana=0}},ms+300)}
      else inner=`<div class="sa-lay"><div class="sa-sw">${slideHTML(sl,'show',null,t=>!vizibil(sl,t,H.c))}</div></div>`;
      scena=`<div class="sa-show-st"><div class="sa-show-sl">${inner}</div></div>`}
    showEl.innerHTML=scena+`<div class="sa-show-bar"><button type="button" data-sh="prev" aria-label="Înapoi">◀ Înapoi</button><button type="button" data-sh="next" aria-label="Înainte (clic)">Clic ▶</button><button type="button" data-sh="esc" aria-label="Ieși din expunere (Esc)">Esc: ieși</button>
      <span>Expunere simulată: clic oriunde (sau → , Enter, Spațiu) = înainte · ← = înapoi · Esc = ieși. Efectele sunt desenate aproximativ: în PowerPoint arată puțin altfel.</span></div>`;
  }
  function gest(id,arg){
    opresteRedarea();
    const eraShow=!!S.show;
    act(S,id,arg);
    if(eraShow&&!S.show)activ=true;
    draw();
    /* după ce alegi un efect, PowerPoint ți-l arată o dată (previzualizarea automată) */
    if(id.startsWith('tr:')&&id!=='tr:None'&&slideCur(S).tr)reda('tr');
    else if((id.startsWith('an:')||id.startsWith('add:'))&&S.efSel&&S.ev.animatie&&!/None|Replay|Rewind/.test(id))reda('ef',S.efSel);
    else if(id==='pv'){if(S.tab==='transitions')reda('tr');else reda('an')}
    if(eraShow&&!S.show){try{root.querySelector('.sa').scrollIntoView({block:'nearest'})}catch(e){}}
  }
  /* clicurile */
  app.addEventListener('click',e=>{
    if(api.done())return;
    if(e.target.closest('input[type=text],select'))return;
    let el=e.target.closest('[data-t],[data-nesim]');
    /* un clic în diapozitivul mare în timpul previzualizării o oprește și lucrează pe ce e sub mouse (ca în PowerPoint) */
    if(PV&&e.target.closest('.sa-work')){opresteRedarea();draw();
      const sub=document.elementFromPoint(e.clientX,e.clientY);el=sub&&sub.closest('[data-t],[data-nesim]');}
    if(!el||!app.contains(el))return;
    if(!el.dataset.t){opresteRedarea();S.msg=`„${el.getAttribute('aria-label')||el.textContent.trim()||'Butonul'}” nu e folosit în lecția asta: în simulator nu face nimic.`;return draw()}
    let id=el.dataset.t;
    if(id.startsWith('stea-')){e.stopPropagation();const k=+id.slice(5)-1;S.cur=k;S.multi=[k];S.foc='mini';S.sel=null;S.efSel=null;S.ev.stea=1;
      S.msg='Ai apăsat steluța: PowerPoint redă efectele diapozitivului (acolo, chiar în miniatură; aici, în diapozitivul mare).';return reda('tot')}
    if(id==='avansare'){e.preventDefault();return gest('avansare')}
    if(id.startsWith('mini-'))return gest(id,{ctrl:e.ctrlKey||e.metaKey,shift:e.shiftKey});
    if(id.startsWith('ef:'))return gest(id,{dinPanou:!!el.dataset.panou,dinTag:!!el.closest('.sa-tag')});
    if(id==='zona-panou'||id==='zona-panglica'||id==='zona-miniaturi')return;
    gest(id);
  });
  app.addEventListener('dblclick',e=>{if(api.done())return;const el=e.target.closest('[data-tinta]');if(!el)return;S.msg='În lecția asta nu schimbi textul: lucrezi doar cu efectele. (În PowerPoint, dublu clic te-ar pune să scrii în obiect.)';side()});
  app.addEventListener('change',e=>{
    const c=e.target.dataset&&e.target.dataset.camp;if(!c||api.done())return;
    if(c==='anstart')return gest('anstart',{v:e.target.value});
    /* caseta de durată iese din scris când apeși alt buton (Apply To All): schimb starea și caseta, dar NU redesenez
       panglica acum — redesenarea dintre apăsare și ridicare ar pierde clicul (judecătorul, MAJOR 2) */
    opresteRedarea();act(S,c,{v:e.target.value});
    const t=slideCur(S).tr,ef=efecteAlese(S)[0];
    if(c==='trdur')e.target.value=t?durTxt(t.dur):'02,00';else if(ef)e.target.value=durTxt(c==='andel'?(ef.del||0):ef.dur);
    side();
  });
  app.addEventListener('keydown',e=>{const c=e.target.dataset&&e.target.dataset.camp;if(c&&e.key==='Enter'){e.preventDefault();e.target.blur()}});
  app.addEventListener('contextmenu',e=>{if(api.done())return;e.preventDefault();S.msg='Meniul de clic dreapta nu îl folosim în lecția asta: tranzițiile și animațiile sunt pe filele Transitions (Tranziții) și Animations (Animații).';side()});
  /* tastele: pe document, doar după un clic/o atingere în simulator (sau cât ține expunerea) */
  let activ=false;
  const laApasare=e=>{if(!root.isConnected){opreste();return}activ=root.contains(e.target)};
  const laTasta=e=>{
    if(!root.isConnected){opreste();return}
    const k=e.key,c=e.ctrlKey||e.metaKey,lk=(k||'').toLowerCase();
    /* F5 NU are voie să reîncarce pagina (judecătorul, trecerea 2, N1: elevul pierdea exercițiul). La exercițiile cu
       expunere (Q.f5) și în atelier e prinsă oricând simulatorul e în pagină, oriunde ar fi fost ultimul clic; în rest,
       doar după un clic în simulator (ca celelalte taste). În expunere nu face nimic. */
    if(k==='F5'&&!c&&!e.altKey&&(Q.f5||activ||S.show)){e.preventDefault();
      if(api.done()||S.show)return;activ=true;return gest(e.shiftKey?'shift-f5':'f5')}
    if(api.done())return;
    if(S.show){
      let id=null;
      if(['ArrowRight','ArrowDown','Enter',' ','PageDown','n','N'].includes(k))id='next';
      else if(['ArrowLeft','ArrowUp','PageUp','Backspace','p','P'].includes(k))id='prev';
      else if(k==='Escape')id='esc';
      if(id){e.preventDefault();gest(id)}return}
    if(!activ)return;
    const t=e.target;
    if(t&&t.closest&&t.closest('input,textarea,select')&&!(k==='F5'))return;
    let id=null;
    if(k==='F5'){e.preventDefault();return gest(e.shiftKey?'shift-f5':'f5')}
    if(k==='Escape')id='esc';
    else if(k==='Delete'||k==='Backspace')id='k:del';
    else if(c&&lk==='z')id='k:undo';else if(c&&lk==='y')id='k:redo';
    else if(!c&&!e.altKey&&k&&k.length===1&&S.sel&&S.foc==='slide'){S.msg='În lecția asta nu schimbi textul: lucrezi doar cu efectele.';side();return}
    if(!id)return;e.preventDefault();gest(id);
  };
  function opreste(){document.removeEventListener('pointerdown',laApasare,true);document.removeEventListener('keydown',laTasta);clearTimeout(pvTimer);clearTimeout(shTimer);if(showEl){showEl.remove();document.documentElement.style.overflow=''}}
  if(window.__simPptaOpreste)window.__simPptaOpreste();
  window.__simPptaOpreste=opreste;
  document.addEventListener('pointerdown',laApasare,true);document.addEventListener('keydown',laTasta);
  root.querySelector('.sa-taste').addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(!b||api.done())return;activ=true;gest(b.dataset.k)});
  body.querySelector('.sa-reset').onclick=()=>{if(api.done())return;opresteRedarea();S=init(Q);draw()};
  draw();
  body._sa={rez:()=>{opresteRedarea();S=init(Q);ruleaza(S,Q.rez);S.show=null;draw()},gresit:()=>{opresteRedarea();S=init(Q);ruleaza(S,Q.gresit);S.show=null;draw()},stare:()=>S,
    gest:(id,arg)=>gest(id,arg)};
  const nav=api.checkButton(()=>{
    opresteRedarea();activ=true;
    const lipsa=Q.teste.find(t=>!trece(S,t));
    if(!lipsa){nav.innerHTML='';api.resolve(true);return}
    api.resolve(false,`Mai ai de făcut: ${strip(lipsa.ce)}.${lipsa.ajutor?' '+lipsa.ajutor:''}`);
    api.revealButton(()=>{opresteRedarea();S=init(Q);ruleaza(S,Q.rez);S.show=null;draw();nav.innerHTML='';api.giveUp(`am făcut acum pașii în simulator: ${Q.rezText}.`)});
  });
}
function rezolva(Q,body){if(body._sa)body._sa.rez()}
function gresit(Q,body){if(body._sa)body._sa.gresit()}
window.SimPPTAnim={render,rezolva,gresit,diap,
  prezentari:o=>Object.assign(DECKS,o),
  _intern:{init,act,ruleaza,CHK,trece,numere,clicuri,grupe,vizibil,cronologie,DECKS,TR_DUR,AN_DUR,durTxt}};
})();
