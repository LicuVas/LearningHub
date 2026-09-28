/* ======================================================================================================
   lectii/_sim/simppt-fisier.js — PowerPoint simulat: OPERAȚIILE CU FIȘIERUL (tipul de exercițiu `pptf`).
   PROPRIETAR: autorul lecției VI · M1 · 3 („Operații de gestionare: creare, deschidere, salvare în diverse formate,
   închidere”). Fișier NOU, de sine stătător: simppt.js / simppt-formatare.js / simppt-animatii.js NU se modifică.
   Tip nou: tipuri:{pptf:SimPPTFisier}.

   CE FACE, CA ÎN POWERPOINT-UL DE PE CALCULATORUL DE LUCRU (PowerPoint 16.0, build 20326, Office în engleză, Windows
   în română; probe pe desktop ascuns, taste reale postate: lectii/vi/m1-l03/_proba/probe_fisier.json):
   - Pornit (din Start / pictogramă) → ecranul de început: Home, New, Open, Account, Options; Blank Presentation și teme
     (A_start). Blank Presentation → „Presentation1”, 1 diapozitiv Title Slide (B_blank). O temă → fereastra cu
     previzualizarea (Provided by Microsoft Corporation, Download size) și butonul Create (R4_tema); Create → prezentare
     cu numele temei („Madison - PowerPoint”).
   - Ctrl+N → încă o prezentare goală, în fereastră nouă (C_ctrl_n). Pe telefon și în browser: doar butonul de sub
     fereastră (în Chrome, Ctrl+N deschide o fereastră de browser, pagina nu-l poate opri — spus pe ecran).
   - Fila File: Back, Home, New, Open, Info, Save, Save As, History, Print, Share, Export, Close, Account, Options (C2).
     Save pe o prezentare nesalvată duce la pagina Save As (R4_save_din_file). Save As: Recent, This PC, Add a Place, Browse.
   - Ctrl+S pe o prezentare NICIODATĂ salvată → fereastra „Save this file”: numele propus = titlul de pe primul
     diapozitiv, Save as type, Choose a Location (Documents), Save / Cancel, „More options…” → pagina Save As (D).
   - Ctrl+S pe un fișier salvat → nicio fereastră; scrie în același fișier (F).
   - F12 → fereastra clasică Save As (Windows în română + Office în engleză): File name:, Save as type: (28 de tipuri,
     lista reală), Save, Cancel; cu PDF apar Open file after publishing (nebifat aici), Standard / Minimum size, Options...
     (E, G). Se deschide în folderul fișierului, dacă e salvat.
   - PDF → fișier nou .pdf; prezentarea deschisă rămâne .pptx (G). PowerPoint Show → fișier .ppsx, iar prezentarea
     deschisă DEVINE .ppsx (J). PNG/JPEG → întrebarea „Which slides do you want to export?” (All Slides / Just This One /
     Cancel): Just This One = o imagine (H); All Slides = un folder cu Slide1.PNG, Slide2.PNG… și mesajul „Each slide in
     your presentation has been saved as a separate file in the folder …” (R3_png_toate). Prezentarea rămâne .pptx.
   - Nume care există deja, la fereastra clasică Save As → „Confirm Save As”: „<nume> already exists. Do you want to replace
     it?” Yes / No (I); Esc NU o închide (judecătorul, R2_confirm_esc_dialog). La „Save this file” și la „Save your changes…”
     (prezentare nouă) → fereastra „Save As”: „The file <nume> already exists. Do you want to replace the existing file?”,
     OK / Anulare (butonul Windows-ului, în română); Anulare → înapoi în fereastra de salvare, cu același nume; OK → fișierul
     vechi e înlocuit, iar prezentarea devine el (R6_*). Dacă fișierul e deschis în altă fereastră: „… is currently in use.
     Please save with a different file name.” (R6_prima_salvare_ok). Esc / Cancel la „Which slides…” închide și Save As
     (judecătorul, R2_png_esc). O prezentare goală făcută cu Ctrl+N nu se înlocuiește la Open (judecătorul, R2_open_peste_goala).
   - Focusul: în Confirm Save As e pe No, iar Enter = No; în fereastra „already exists” de la prima salvare e pe Anulare, iar
     Enter = Anulare (judecătorul 2, R3_*). Un clic pe un folder din lista Save As / Open îl alege și butonul Save devine
     Open: apăsat, intră în folder fără să salveze (judecătorul 2, R4a); dublul clic intră direct.
   - Închiderea cu modificări nesalvate (File › Close sau X) → „Save your changes to this file?” cu Save / Don't Save /
     Cancel (K, L, R3_x). Cancel = rămâi; Don't Save = se închide fără modificări.
   - File › Close pe ULTIMA prezentare: PowerPoint rămâne deschis, fereastra goală „PowerPoint” (L, M). X pe una din
     două ferestre: se închide doar ea (R3_x). X pe ultima fereastră: PowerPoint se închide de tot (R3_x).
   - Ctrl+O → pagina Open (Recent, This PC, Add a Place, Browse, lista Recent) (N). Browse (pe Open și pe Save As)
     deschide fereastra clasică (R5_browse). Fereastra Open: File name:, Files of type: All PowerPoint Presentations
     (*.pptx;*.ppt;*.pptm;*.ppsx;…;*.odp) — PDF-ul nu apare, folderele da; Open, Cancel. Deschiderea peste o prezentare
     goală neatinsă o înlocuiește (R2_open_dialog, cu /B). File › Close (clic) pe un fișier nemodificat: fără întrebare,
     fereastra goală (R5_file_close). Save din „Save your changes…” salvează și închide (R5_prompt_save).
   - Un .ppsx deschis cu dublu clic pornește direct expunerea; la Esc, PowerPoint se închide (P_ppsx_dublu_clic,
     comanda din registru: POWERPNT.EXE /s "%1"). Din PowerPoint (Open) se deschide pentru editare (Microsoft ro-ro).
   ABATERI SPUSE PE ECRAN: tipurile din lista Save as type pe care lecția nu le folosește nu se salvează; This PC / Add a
   Place / Recent de pe paginile Open și Save As nu sunt simulate (folosești Browse); temele au doar o culoare; panglica
   e doar desenată (lecția 2); File Explorer e simplificat (numele, extensia, felul fișierului).

   CONFIGURAȚIA unui exercițiu: {t:'pptf', q, start:{scen, ...suprascrieri}, explorer?:true|'Documente', teste:[{ce, c:[..],
     ajutor?}], rez:[pași], gresit:[pași], rezText, why}.  Scenarii: SimPPTFisier.scenarii({nume:()=>({...})}).
   Condiții: fisier{dir,nume,ext,titlu?} · lipsa{dir,nume,ext} · neschimbat{dir,nume,ext} · dosarImg{dir,nume,n?} ·
     deschis{nume,ext} · nprez{n} · goale{n} · app{stare:'oprit'|'goala'|'prez'|'start'} · salvat · tema{val} · ev{e}
   Pași: 'ppt' · 'x' · 'file' · 'bs:<pag>' · 'blank' · {tema} · 'create' · {recent} · 'browse' · 'k:ctrl+s' ·
     'k:ctrl+n' · 'k:ctrl+o' · 'k:f12' · 'k:esc' · {titlu} · {nume} · {tip:'pdf'} · {nav:'Documente'} · {alege} ·
     'd:save' · 'd:open' · 'd:cancel' · 'd:dont' · 'd:more' · 'c:yes' · 'c:no' · 'e:all' · 'e:one' · 'm:ok' ·
     {ex:'nume.ext'} (dublu clic în File Explorer) · {win:i} · 'show:esc'
   ====================================================================================================== */
(function(){
'use strict';
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const strip=s=>String(s).replace(/<[^>]+>/g,'');
const norm=s=>String(s==null?'':s).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,' ').trim().toLowerCase();
const clona=o=>JSON.parse(JSON.stringify(o));
const ro=t=>`<span class="pf-ro">${t}</span>`;

/* ---------------- lista reală „Save as type” (E_f12_pptx.tip.lista, 28 de tipuri) ---------------- */
const TIPURI=[
 ['PowerPoint Presentation (*.pptx)','pptx','prez'],['PowerPoint Macro-Enabled Presentation (*.pptm)','pptm',''],
 ['PowerPoint 97-2003 Presentation (*.ppt)','ppt',''],['PDF (*.pdf)','pdf','pdf'],['XPS Document (*.xps)','xps',''],
 ['PowerPoint Template (*.potx)','potx',''],['PowerPoint Macro-Enabled Template (*.potm)','potm',''],
 ['PowerPoint 97-2003 Template (*.pot)','pot',''],['Office Theme (*.thmx)','thmx',''],['PowerPoint Show (*.ppsx)','ppsx','show'],
 ['PowerPoint Macro-Enabled Show (*.ppsm)','ppsm',''],['PowerPoint 97-2003 Show (*.pps)','pps',''],['PowerPoint Add-in (*.ppam)','ppam',''],
 ['PowerPoint XML Presentation (*.xml)','xml',''],['MPEG-4 Video (*.mp4)','mp4',''],['Windows Media Video (*.wmv)','wmv',''],
 ['Animated GIF Format (*.gif)','gif',''],['JPEG File Interchange Format (*.jpg)','jpg','img'],
 ['PNG Portable Network Graphics Format (*.png)','png','img'],['TIFF Tag Image File Format (*.tif)','tif',''],
 ['Device Independent Bitmap (*.bmp)','bmp',''],['Windows Metafile (*.wmf)','wmf',''],['Enhanced Windows Metafile (*.emf)','emf',''],
 ['Scalable Vector Graphics Format (*.svg)','svg',''],['Outline/RTF (*.rtf)','rtf',''],['PowerPoint Picture Presentation (*.pptx)','pptx',''],
 ['Strict Open XML Presentation (*.pptx)','pptx',''],['OpenDocument Presentation (*.odp)','odp','']];
const RO_TIP={pptx:'',pdf:'',ppsx:'Expunere PowerPoint',png:'imagine',jpg:'imagine'};
const tipDupaExt=e=>TIPURI.findIndex(t=>t[1]===e&&t[2]);
const FEL={pptx:'prezentare',ppsx:'expunere PowerPoint',pdf:'document PDF',png:'imagine',jpg:'imagine',PNG:'imagine',ppt:'prezentare'};
const PREZ_EXT=['pptx','ppsx','ppt','pptm','ppsm','pps','potx','odp'];
const DIRS0=['Desktop','Documente','Descărcări','Imagini'];
const TEME=['Madison','Atlas','Galerie','Colet'];
const CUL_TEMA={Madison:'#2F5D50',Atlas:'#6B3FA0',Galerie:'#8A2C2C',Colet:'#1F4E79'};
const MARIME_TEMA={Madison:'2386 KB',Atlas:'—',Galerie:'—',Colet:'—'};   // doar Madison probată (R4_tema)

/* ---------------- aspectul (culori fixe: arată ca aplicația, în orice temă a paginii) ---------------- */
const CSS=`
.pf-root{max-width:760px;margin:0 auto}
.pf{position:relative;border:1px solid #AEB8BB;border-radius:6px;overflow:hidden;background:#E6E6E6;color:#222;font:13px/1.3 "Segoe UI",system-ui,sans-serif;text-align:left;min-height:380px;display:flex;flex-direction:column}
.pf button{font:inherit;color:inherit;cursor:pointer;margin:0}
.pf-ro{color:#6A6A6A;font-weight:400;font-size:.86em;margin-left:4px}
.pf-tb{display:flex;align-items:center;gap:6px;background:#F3F3F3;border-bottom:1px solid #D4D4D4;min-height:34px;padding:0 0 0 6px}
.pf-tb .pf-tit{flex:1;text-align:center;font-size:12.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
.pf-tb button{border:0;background:none;min-width:36px;min-height:34px;padding:0 8px;font-size:14px}
.pf-tb button:hover,.pf-tb button:focus-visible{background:#DDD}
.pf-tb button.pf-x:hover,.pf-tb button.pf-x:focus-visible{background:#C42B1C;color:#fff}
.pf-tb .pf-qs{font-size:15px}
.pf-tabs{display:flex;flex-wrap:wrap;gap:2px;background:#F3F3F3;padding:2px 4px;border-bottom:1px solid #D4D4D4}
.pf-tabs button{border:0;background:none;padding:6px 8px;min-height:32px;border-radius:3px}
.pf-tabs button.pf-file{background:#B7472A;color:#fff;font-weight:600}
.pf-rib{background:#FAFAFA;border-bottom:1px solid #D4D4D4;padding:6px 10px;font-size:12px;color:#6A6A6A;min-height:30px}
.pf-ed{display:flex;gap:8px;padding:10px;flex:1;background:#E6E6E6;min-height:220px}
.pf-th{flex:0 0 74px;display:flex;flex-direction:column;gap:6px}
.pf-th div{background:#fff;border:1px solid #BFBFBF;aspect-ratio:16/9;font-size:7px;padding:3px;overflow:hidden}
.pf-th div.on{outline:2px solid #B7472A}
.pf-sl{flex:1;align-self:flex-start;background:#fff;border:1px solid #BFBFBF;aspect-ratio:16/9;position:relative;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:8%;padding:6%;box-sizing:border-box;max-width:100%}
.pf-sl.tema{color:#fff}
.pf-ph{border:1px dashed #9A9A9A;width:88%;text-align:center;padding:4% 2%;min-height:2.2em;background:none;border-radius:2px}
.pf-ph.t{font-size:clamp(15px,3.4vw,24px)}
.pf-ph.s{font-size:clamp(11px,2vw,14px);color:#6A6A6A;width:70%}
.pf-sl.tema .pf-ph{border-color:rgba(255,255,255,.7);color:#fff}
.pf-in{width:88%;font:inherit;font-size:clamp(15px,3.4vw,22px);text-align:center;padding:6px;border:2px solid #B7472A;border-radius:2px;box-sizing:border-box}
.pf-temanume{position:absolute;right:6px;bottom:4px;font-size:11px;opacity:.85}
.pf-gol{flex:1;display:flex;align-items:center;justify-content:center;color:#6A6A6A;padding:30px 12px;text-align:center;background:#D9D9D9}
.pf-pv{background:#FFF4CE;border-bottom:1px solid #E0C97A;padding:6px 10px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-size:12.5px}
.pf-pv b{letter-spacing:.02em}
.pf-pv button{border:1px solid #8A8A8A;background:#fff;border-radius:3px;padding:4px 10px;min-height:32px}
/* backstage (fila File) */
.pf-bs{display:flex;flex:1;min-height:300px;background:#fff}
.pf-bsn{flex:0 0 150px;background:#B7472A;color:#fff;display:flex;flex-direction:column;padding:6px 0}
.pf-bsn button{border:0;background:none;color:#fff;text-align:left;padding:7px 12px;min-height:32px;line-height:1.15}
.pf-bsn button:hover,.pf-bsn button:focus-visible,.pf-bsn button.on{background:rgba(0,0,0,.22)}
.pf-bsn button.gri{color:rgba(255,255,255,.55)}
.pf-bsn .pf-ro{color:rgba(255,255,255,.8)}
.pf-bsn hr{border:0;border-top:1px solid rgba(255,255,255,.35);margin:6px 10px}
.pf-bsp{flex:1;padding:12px 14px;min-width:0;overflow:auto}
.pf-bsp h4{margin:0 0 10px;font:600 20px/1.2 "Segoe UI",system-ui,sans-serif}
.pf-tiles{display:flex;flex-wrap:wrap;gap:10px}
.pf-tile{border:1px solid #CFCFCF;background:#fff;width:112px;padding:0;text-align:left}
.pf-tile .pf-mini{height:60px;display:flex;align-items:center;justify-content:center;font-size:11px;border-bottom:1px solid #E1E1E1}
.pf-tile span.n{display:block;padding:5px 6px;font-size:12px;min-height:30px}
.pf-tile:hover,.pf-tile:focus-visible{outline:2px solid #B7472A}
.pf-lista{list-style:none;margin:6px 0;padding:0}
.pf-lista button{display:flex;gap:8px;align-items:center;width:100%;border:0;background:none;text-align:left;padding:6px 6px;min-height:34px;border-radius:3px}
.pf-lista button:hover,.pf-lista button:focus-visible{background:#FBE3DB}
.pf-lista small{color:#6A6A6A}
.pf-loc{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}
.pf-loc button{border:1px solid #CFCFCF;background:#F7F7F7;border-radius:3px;padding:6px 10px;min-height:34px}
.pf-loc button.br{border-color:#B7472A;background:#FBE3DB;font-weight:600}
.pf-hint{color:#6A6A6A;font-size:12px}
/* ferestrele de dialog */
.pf-strat{position:absolute;inset:0;background:rgba(0,0,0,.28);display:flex;align-items:flex-start;justify-content:center;padding:14px 8px;overflow:auto;z-index:5}
.pf-dlg{background:#fff;border:1px solid #8A8A8A;box-shadow:0 8px 24px rgba(0,0,0,.25);border-radius:6px;width:100%;max-width:560px}
.pf-dlg.mic{max-width:400px}
.pf-dh{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-bottom:1px solid #E1E1E1;font-weight:600}
.pf-dh button{border:0;background:none;min-width:34px;min-height:32px}
.pf-db{padding:10px 12px}
.pf-db label{display:block;font-size:12px;margin:8px 0 3px}
.pf-db input[type=text],.pf-db select{width:100%;box-sizing:border-box;font:inherit;padding:6px;border:1px solid #8A8A8A;border-radius:2px;min-height:34px;background:#fff;color:#222}
.pf-df{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;padding:8px 12px 12px}
.pf-df button,.pf-db .pf-bt{border:1px solid #8A8A8A;background:#F3F3F3;border-radius:3px;padding:6px 14px;min-height:34px;min-width:80px}
.pf-df button.pr{background:#B7472A;border-color:#B7472A;color:#fff}
.pf-df button.pr .pf-ro{color:#FFE3DA}
.pf-df .st{margin-right:auto}
.pf-link{border:0!important;background:none!important;color:#1F5FA8!important;text-decoration:underline;min-width:0!important;padding:6px 2px!important;min-height:36px;display:inline-flex;align-items:center}
.pf-cl{display:flex;gap:8px;min-height:180px}
.pf-nav{flex:0 0 118px;border-right:1px solid #E1E1E1;display:flex;flex-direction:column;gap:2px;padding-right:6px}
.pf-nav button{border:0;background:none;text-align:left;padding:6px;min-height:32px;border-radius:3px}
.pf-nav button.on{background:#CCE4F7}
.pf-files{flex:1;min-width:0;border:1px solid #E1E1E1;max-height:190px;overflow:auto}
.pf-files .cap{display:flex;justify-content:space-between;font-size:11px;color:#6A6A6A;padding:3px 6px;border-bottom:1px solid #E1E1E1;position:sticky;top:0;background:#fff}
.pf-files button{display:flex;gap:6px;align-items:center;width:100%;border:0;background:none;text-align:left;padding:5px 6px;min-height:32px}
.pf-files button.on{background:#CCE4F7}
.pf-files button:hover{background:#E5F1FB}
.pf-files .gol{padding:10px;color:#6A6A6A;font-size:12px}
.pf-cale{font-size:12px;color:#444;background:#F3F3F3;border:1px solid #E1E1E1;padding:4px 6px;margin-bottom:6px;overflow-wrap:anywhere}
.pf-ic{display:inline-block;width:18px;text-align:center;font-weight:700;font-size:10px;border-radius:2px;color:#fff;line-height:18px;flex:0 0 18px}
.pf-ic.pptx,.pf-ic.ppt{background:#C43E1C}.pf-ic.ppsx{background:#8E2A10}.pf-ic.pdf{background:#B30B00}.pf-ic.png,.pf-ic.jpg,.pf-ic.PNG{background:#2B7A4B}.pf-ic.dir{background:#E3B341;color:#5a4000}
.pf-pdfopt{border-top:1px solid #E1E1E1;margin-top:8px;padding-top:6px;font-size:12px}
.pf-pdfopt label{display:flex;gap:6px;align-items:center;margin:4px 0;font-size:12px;min-height:36px}
.pf-msgbox{white-space:pre-line}
/* bara de activități (ferestrele deschise) și desktopul */
.pf-bar{display:flex;flex-wrap:wrap;gap:4px;align-items:center;background:#1F2A36;color:#fff;padding:4px 6px;min-height:38px}
.pf-bar .pf-lbl{font-size:11px;opacity:.85;margin-right:4px}
.pf-bar button{border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);color:#fff;border-radius:3px;padding:4px 8px;min-height:32px;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pf-bar button.on{background:rgba(255,255,255,.28);border-bottom:2px solid #F0A58F}
.pf-desk{flex:1;background:linear-gradient(135deg,#2B5C8A,#4F7FAF);color:#fff;display:flex;flex-direction:column;align-items:flex-start;gap:10px;padding:18px}
.pf-desk button{border:1px solid rgba(255,255,255,.5);background:rgba(255,255,255,.15);color:#fff;border-radius:6px;padding:8px 12px;min-height:44px;display:flex;gap:8px;align-items:center}
.pf-desk .pf-ic{width:26px;flex-basis:26px;line-height:26px;font-size:12px}
.pf-show{position:absolute;inset:0;background:#000;color:#fff;z-index:8;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:20px;text-align:center}
.pf-show .t{font-size:clamp(20px,5vw,34px)}
.pf-show button{border:1px solid #fff;background:none;color:#fff;border-radius:4px;padding:6px 14px;min-height:36px}
/* sub fereastră */
.pf-ex{margin-top:8px;border:1px solid var(--line,#ccc);border-radius:6px;background:var(--paper,#fff);padding:6px 8px}
.pf-ex .hd{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:.85rem;color:var(--ink2,#555)}
.pf-ex .hd b{color:var(--ink,#222)}
.pf-ex .dirs{display:flex;flex-wrap:wrap;gap:4px;margin:4px 0}
.pf-ex .dirs button{border:1px solid var(--line,#ccc);background:var(--paper2,#f5f5f5);color:var(--ink,#222);border-radius:4px;padding:4px 8px;min-height:32px;font:inherit;font-size:.85rem;cursor:pointer}
.pf-ex .dirs button.on{border-color:var(--accent,#B7472A);font-weight:600}
.pf-ex ul{list-style:none;margin:0;padding:0}
.pf-ex li{display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:3px 0;border-top:1px solid var(--line,#eee);font-size:.9rem}
.pf-ex li .nm{flex:1 1 170px;min-width:0;overflow-wrap:anywhere}
.pf-ex li small{color:var(--ink2,#666)}
.pf-ex li button{border:1px solid var(--line,#ccc);background:var(--paper2,#f5f5f5);color:var(--ink,#222);border-radius:4px;padding:3px 8px;min-height:32px;font:inherit;font-size:.8rem;cursor:pointer}
.pf-msg{margin:10px 0 4px;padding:7px 10px;border-radius:6px;background:var(--paper2);border:1px solid var(--line);font-size:.93rem;min-height:1.4em}
.pf-teste{margin:4px 0 8px;padding-left:1.6em}
.pf-teste li{margin:3px 0;color:var(--ink2)}
.pf-teste li.ok{color:var(--ok);font-weight:600}
.pf-teste li.ok::marker{content:"✓  "}
.pf-taste{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0 6px}
.pf-taste .lbl2{font-size:.85rem;color:var(--ink2);flex:1 0 100%}
.pf-taste button{min-height:40px;min-width:48px;padding:4px 10px;border:1px solid var(--line);border-bottom-width:3px;border-radius:6px;background:var(--paper);color:var(--ink);font:600 .9rem/1.1 var(--fm,monospace);cursor:pointer}
.pf-taste button small{display:block;font:400 .7rem/1.1 var(--fb,sans-serif);color:var(--ink2)}
.pf-unelte{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
@media (max-width:560px){
 .pf-bsn{flex-basis:104px}.pf-bsn button{padding:6px 8px;font-size:12px}
 .pf-bsp{padding:10px 8px}.pf-bsp h4{font-size:17px}
 .pf-tile{width:96px}
 .pf-th{flex-basis:46px}
 .pf-ed{min-height:0}.pf{min-height:340px}
 .pf-cl{flex-direction:column}.pf-nav{flex-direction:row;flex-wrap:wrap;border-right:0;border-bottom:1px solid #E1E1E1;padding:0 0 4px}
 .pf-tabs button:not(.pf-file){padding:6px 5px;font-size:12px}
 .pf-strat{padding:6px 4px}
 /* pe ecran îngust fereastra de dialog nu mai plutește peste aplicație: ia locul ei, sub bara de titlu, ca să încapă toată */
 .pf.dlg .pf-strat{position:static;flex:1;background:#CFCFCF;overflow:visible}
 .pf.dlg>.pf-bs,.pf.dlg>.pf-ed,.pf.dlg>.pf-tabs,.pf.dlg>.pf-rib,.pf.dlg>.pf-pv,.pf.dlg>.pf-gol,.pf.dlg>.pf-desk{display:none}
}`;
function stil(){if(document.getElementById('pf-css'))return;const s=document.createElement('style');s.id='pf-css';s.textContent=CSS;document.head.appendChild(s)}

/* ---------------- modelul: fișiere, prezentări, ferestre ---------------- */
let uid=0;
function P(o){o=o||{};return {id:'p'+(++uid),nume:o.nume||'Presentation1',titlu:o.titlu||'',sub:o.sub||'',diap:o.diap||1,tema:o.tema||null,
  fis:o.fis||null,salvat:o.salvat!==false,pristin:!!o.pristin,protejat:!!o.protejat}}
const F=(dir,nume,ext,cont,extra)=>Object.assign({dir,nume,ext,cont:Object.assign({titlu:'',diap:1,tema:null},cont||{}),rev:0},extra||{});
const SCEN={
  desktop:()=>({app:'oprit'}),
  start:()=>({app:'start'}),
  nou:()=>({app:'deschis',wins:[{pres:P({nume:'Presentation1'})}]})
};
function init(Q){
  const st=Q.start||{},base=(SCEN[st.scen]||SCEN.nou)();
  const S=Object.assign({app:'deschis',wins:[],cur:0,bs:null,dlgs:[],files:[],dirs:DIRS0.slice(),recent:[],ev:{},msg:'',cnt:1,edit:null,show:null,
    ex:{dir:typeof Q.explorer==='string'?Q.explorer:'Documente',sel:null}},clona(base));
  (S.files||[]).forEach(f=>{f.rev=f.rev||0;f.rev0=f.rev});
  S.wins=(S.wins||[]).map(w=>({pres:w.pres?Object.assign(P(),w.pres):null}));
  if(base.cnt==null)S.cnt=S.wins.filter(w=>w.pres&&/^Presentation\d+$/.test(w.pres.nume)).length;   // următoarea: Presentation<cnt+1>
  S.dirs=Array.from(new Set(DIRS0.concat(S.dirs||[])));
  return S;
}
const curW=S=>S.wins[S.cur]||null;
const curP=S=>{const w=curW(S);return w?w.pres:null};
const eqN=(a,b)=>String(a).toLowerCase()===String(b).toLowerCase();
const gasesteF=(S,dir,nume,ext)=>S.files.find(f=>eqN(f.dir,dir)&&eqN(f.nume,nume)&&eqN(f.ext,ext));
const numeF=f=>`${f.nume}.${f.ext}`;
const titluFer=S=>{const p=curP(S);if(S.app==='start'||!p)return 'PowerPoint';return (p.fis?numeF(p.fis):p.nume)+' - PowerPoint'};
const continut=p=>({titlu:p.titlu,diap:p.diap,tema:p.tema});
function adaugaRecent(S,dir,nume,ext){S.recent=S.recent.filter(r=>!(eqN(r.dir,dir)&&eqN(r.nume,nume)&&eqN(r.ext,ext)));S.recent.unshift({dir,nume,ext});S.recent=S.recent.slice(0,8)}
function scrieFisier(S,dir,nume,ext,cont){
  let f=gasesteF(S,dir,nume,ext);
  if(f){f.cont=clona(cont);f.rev++;f.nume=nume}else{f=F(dir,nume,ext,clona(cont));f.rev0=-1;S.files.push(f)}
  return f;
}

/* ---------------- acțiunile ---------------- */
function msgNesim(S,nume){S.msg=`„${nume}” nu e folosit în lecția asta: în simulator nu face nimic.`}
function prezNoua(S,tema){
  S.cnt++;const nume=tema||('Presentation'+S.cnt);
  const p=P({nume,tema:tema||null,pristin:!tema});
  S.bs=null;S.app='deschis';
  const w=curW(S);
  if(w&&!w.pres){w.pres=p}else{S.wins.push({pres:p});S.cur=S.wins.length-1}
  S.ev[tema?'tema':'nou']=1;
  S.msg=tema?`Ai făcut o prezentare nouă cu tema ${tema}. Numele din bara de sus e „${nume}” până o salvezi.`:`Ai făcut o prezentare nouă, goală: „${nume}”. Are un diapozitiv, cu loc de titlu și de subtitlu.`;
}
function deschideFisier(S,f,cuDubluClic){
  if(!f)return;
  if(f.ext==='pdf'){S.msg=`„${numeF(f)}” e un PDF: se deschide în programul pentru PDF al calculatorului (de exemplu, în browser). Acolo îl citești, dar nu îl modifici ca pe o prezentare.`;S.ev.pdfDeschis=1;return}
  if(f.ext==='png'||f.ext==='jpg'||f.ext==='PNG'){S.msg=`„${numeF(f)}” e o imagine: se deschide în programul de imagini al calculatorului, nu în PowerPoint.`;return}
  if(f.ext==='ppsx'&&cuDubluClic){S.show={f:numeF(f),titlu:f.cont.titlu||'(diapozitiv fără titlu)',rev:S.app,revCur:S.cur};S.ev.expunere=1;
    S.msg=`Dublu clic pe un fișier .ppsx: PowerPoint pornește direct EXPUNEREA, pe tot ecranul, fără fereastra de lucru.`;return}
  const deja=S.wins.findIndex(w=>w.pres&&w.pres.fis&&eqN(w.pres.fis.dir,f.dir)&&eqN(w.pres.fis.nume,f.nume)&&eqN(w.pres.fis.ext,f.ext));
  if(deja>=0&&S.app==='deschis'){S.cur=deja;S.bs=null;S.msg=`„${numeF(f)}” era deja deschis: PowerPoint îți arată fereastra lui.`;return}
  const p=P({nume:numeF(f),titlu:f.cont.titlu,diap:f.cont.diap,tema:f.cont.tema,fis:{dir:f.dir,nume:f.nume,ext:f.ext},protejat:!!f.internet});
  if(S.app!=='deschis'){S.app='deschis';S.wins=[{pres:p}];S.cur=0}
  else{const w=curW(S);if(w&&!w.pres){w.pres=p}else{S.wins.push({pres:p});S.cur=S.wins.length-1}}   // doar fereastra GOALĂ se refolosește
  S.bs=null;S.ev.deschis=1;adaugaRecent(S,f.dir,f.nume,f.ext);
  S.msg=`Ai deschis „${numeF(f)}” din ${f.dir}.`+(p.protejat?' Fișierul vine de pe internet: sus a apărut bara galbenă PROTECTED VIEW. Până apeși Enable Editing, doar citești.':'');
}
function dupaSalvare(S,p,dir,nume,ext){
  p.fis={dir,nume,ext};p.nume=`${nume}.${ext}`;p.salvat=true;p.pristin=false;adaugaRecent(S,dir,nume,ext);
}
/* salvarea propriu-zisă, după nume și tip; poate cere confirmarea înlocuirii */
function salveaza(S,dir,numeBrut,tipIdx,dinDlg,confirmat){
  const p=curP(S);if(!p)return;
  const T=TIPURI[tipIdx]||TIPURI[0],ext=T[1];
  let nume=String(numeBrut||'').trim().replace(/\.+$/,'');
  if(nume.toLowerCase().endsWith('.'+ext))nume=nume.slice(0,-(ext.length+1));
  if(!nume){S.msg='Scrie întâi un nume la File name (Nume fișier).';return false}
  if(/[\\/:*?"<>|]/.test(nume)){S.msg='Windows nu acceptă în numele unui fișier semnele \\ / : * ? " < > |. Folosește litere, cifre și liniuța de jos _.';return false}
  if(!T[2]){S.msg=`Tipul „${T[0]}” există în PowerPoint, dar nu îl folosim în lecția asta, așa că simulatorul nu îl salvează. Alege PowerPoint Presentation (.pptx), PDF, PowerPoint Show (.ppsx), PNG sau JPEG.`;return false}
  if(T[2]==='img'){
    if(!confirmat&&gasesteF(S,dir,nume,ext)){intreabaInlocuire(S,dir,nume,ext,tipIdx,dinDlg);return false}
    S.dlgs.push({tip:'export',dir,nume,ext});return false}
  if(!confirmat&&gasesteF(S,dir,nume,ext)){intreabaInlocuire(S,dir,nume,ext,tipIdx,dinDlg);return false}
  /* fișierul pe care îl înlocuiești e deschis în altă fereastră → „… is currently in use. Please save with a different file name.” (R6_prima_salvare_ok) */
  if(confirmat&&S.wins.some(w=>w.pres&&w.pres!==p&&w.pres.fis&&eqN(w.pres.fis.dir,dir)&&eqN(w.pres.fis.nume,nume)&&eqN(w.pres.fis.ext,ext))){
    S.dlgs.push({tip:'mesaj',fel:'inuz',text:` ${dir}\\${nume}.${ext} is currently in use. Please save with a different file name.`});return false}
  const f=scrieFisier(S,dir,nume,ext,continut(p));
  if(T[2]==='pdf'){S.ev.pdf=1;S.msg=`Ai salvat și un PDF: ${dir} › ${numeF(f)}. Prezentarea deschisă rămâne cea de dinainte (${p.fis?numeF(p.fis):p.nume}): PDF-ul e o copie, de citit.`}
  else{const era=p.fis?numeF(p.fis):null;dupaSalvare(S,p,dir,nume,ext);S.ev[ext==='ppsx'?'ppsx':'salvatCa']=1;
    S.msg=`Ai salvat: ${dir} › ${nume}.${ext}.`+(era&&!eqN(era,`${nume}.${ext}`)?` De acum lucrezi în „${nume}.${ext}”; „${era}” a rămas pe disc cum era la ultima salvare.`:'')+(ext==='ppsx'?' E o Expunere PowerPoint: cu dublu clic, pornește direct expunerea.':'')}
  if(confirmat)S.ev.inlocuit=1;
  return true;
}
/* nume care există: la fereastra clasică Save As → „Confirm Save As” (Yes / No; I_suprascriere); la „Save this file” și la
   „Save your changes…” → fereastra „Save As”: „The file … already exists. Do you want to replace the existing file?”, cu OK /
   Anulare (R6_prima_salvare_anulare, R6_la_inchidere_anulare; butonul Anulare e al Windows-ului, în română) */
function intreabaInlocuire(S,dir,nume,ext,tipIdx,dinDlg){
  const sub=topD(S),mic=!!sub&&(sub.tip==='savethis'||sub.tip==='prompt');
  if(mic){S.dlgs.push({tip:'inlocuire',text:`The file ${nume}.${ext} already exists.\nDo you want to replace the existing file?`,dupa:{dir,nume,tipIdx,dinDlg}});
    S.msg='Numele există deja. Anulare lasă fișierul care e acolo neatins și te întoarce la salvare; OK îl înlocuiește (se pierde).'}
  else{S.dlgs.push({tip:'confirm',text:`${nume}.${ext} already exists.\nDo you want to replace it?`,dupa:{dir,nume,tipIdx,dinDlg}});
    S.msg='Numele există deja: Confirm Save As. No (Nu) lasă fișierul neatins; Yes (Da) îl înlocuiește (se pierde).'}
}
function daInlocuiesc(S,d){
  S.dlgs.pop();const a=d.dupa;S.ev.confirmDa=1;
  const T=TIPURI[a.tipIdx];
  if(T[2]==='img'){S.dlgs.push({tip:'export',dir:a.dir,nume:a.nume,ext:T[1],inlocuit:true});return}
  if(salveaza(S,a.dir,a.nume,a.tipIdx,a.dinDlg,true)){inchideDlgSalvare(S);
    const sub=topD(S);if(sub&&sub.tip==='prompt'){S.dlgs.pop();const m=S.msg;inchideGata(S,sub.mod);S.msg=m+' '+S.msg}}   // salvat din întrebarea de la închidere → se închide
}
function ctrlS(S){
  const p=curP(S);
  if(S.app!=='deschis'||!p){S.msg='Nu e nicio prezentare deschisă: nu ai ce salva.';return}
  if(p.protejat){S.msg='Fișierul e în PROTECTED VIEW: întâi apasă Enable Editing pe bara galbenă.';return}
  if(p.fis){scrieFisier(S,p.fis.dir,p.fis.nume,p.fis.ext,continut(p));p.salvat=true;p.pristin=false;S.ev.ctrlS=1;
    S.msg=`Ctrl+S: ai salvat în același fișier, ${p.fis.dir} › ${numeF(p.fis)}. Nu a apărut nicio fereastră: numele și locul erau deja alese.`;return}
  S.dlgs.push({tip:'savethis',nume:p.titlu||p.nume,tipIdx:0});S.bs=null;
  S.msg='Prezentarea nu a fost salvată niciodată, deci Ctrl+S îți deschide fereastra Save this file: scrii numele, verifici locul, apeși Save.';
}
function f12(S){
  const p=curP(S);
  if(S.app!=='deschis'||!p){S.msg='Nu e nicio prezentare deschisă.';return}
  if(p.protejat){S.msg='Fișierul e în PROTECTED VIEW: întâi apasă Enable Editing pe bara galbenă.';return}
  S.bs=null;S.dlgs.push({tip:'saveas',dir:p.fis?p.fis.dir:'Documente',nume:p.fis?p.fis.nume:(p.titlu||p.nume),tipIdx:p.fis?Math.max(0,tipDupaExt(p.fis.ext)):0,sel:null,pdfDeschide:false});
  S.msg='S-a deschis fereastra Save As (Salvare ca): alegi folderul în stânga, scrii numele la File name, alegi tipul la Save as type, apoi Save.';
}
function deschideDlgOpen(S){S.dlgs.push({tip:'open',dir:'Documente',sel:null,nume:''});S.msg='S-a deschis fereastra Open (Deschidere): alegi folderul, apoi fișierul, apoi Open.'}
function inchide(S,mod){
  const p=curP(S);
  if(p&&!p.salvat&&!p.protejat){S.dlgs.push({tip:'prompt',mod,nume:p.fis?p.fis.nume:(p.titlu||p.nume),dir:p.fis?p.fis.dir:'Documente',tipIdx:p.fis?Math.max(0,tipDupaExt(p.fis.ext)):0,nou:!p.fis});
    S.msg='Ai modificări nesalvate, așa că PowerPoint te întreabă ce faci cu ele: Save, Don\'t Save sau Cancel.';return}
  inchideGata(S,mod);
}
function inchideGata(S,mod){
  S.bs=null;S.edit=null;
  if(S.app==='start'){S.app='oprit';S.wins=[];S.msg='Ai închis PowerPoint.';S.ev.appInchisa=1;return}
  const w=curW(S);if(!w)return;
  const nume=w.pres?(w.pres.fis?numeF(w.pres.fis):w.pres.nume):null;
  if(mod==='file'&&S.wins.length===1){w.pres=null;S.ev.fisierInchis=1;S.msg=`Ai închis prezentarea${nume?' „'+nume+'”':''}. PowerPoint a rămas deschis, cu fereastra goală: poți deschide sau începe alta.`;return}
  S.wins.splice(S.cur,1);S.cur=Math.max(0,Math.min(S.cur,S.wins.length-1));
  if(mod==='file')S.ev.fisierInchis=1;
  if(!S.wins.length){S.app='oprit';S.cnt=0;S.ev.appInchisa=1;S.msg='Ai închis ultima fereastră: PowerPoint s-a închis de tot. Îl pornești din nou cu pictograma lui.';return}
  S.msg=`S-a închis fereastra${nume?' cu „'+nume+'”':''}. Celelalte ferestre PowerPoint au rămas deschise (le vezi pe bara de jos).`;
}
function commitEdit(S){
  if(!S.edit)return;const p=curP(S);
  if(p&&S.edit.val!==p.titlu){p.titlu=S.edit.val;p.salvat=false;p.pristin=false;S.ev.modificat=1;if(!p.fis)p.nume=p.nume}
  S.edit=null;
}
function topD(S){return S.dlgs[S.dlgs.length-1]||null}
function act(S,id,arg){
  S.msg='';
  if(S.show){if(id==='show:esc'||id==='k:esc'||id==='show:next'){const sh=S.show;S.show=null;
      if(sh.rev!=='deschis'){S.app='oprit';S.wins=[];S.cnt=0;S.msg='Expunerea s-a terminat și PowerPoint s-a închis singur: fișierul fusese deschis doar pentru expunere.'}
      else S.msg='Expunerea s-a terminat.';}
    return}
  if(id.startsWith('k:')&&S.app==='oprit'&&id!=='k:esc'){S.msg='PowerPoint e închis: tastele lui nu fac nimic. Pornește-l cu pictograma PowerPoint.';return}
  if(id!=='titlu'&&id!=='titlu-ok')commitEdit(S);
  const d=topD(S);
  /* ----- ferestrele de dialog ----- */
  if(d){
    if(id==='k:esc'){if(d.tip==='confirm'){S.msg='Aici alegi Yes (Da) sau No (Nu); Esc nu închide întrebarea.';return}
      id=d.tip==='inlocuire'?'i:anulare':d.tip==='export'?'e:cancel':'d:cancel'}
    if(id==='k:enter'){id=d.tip==='open'?'d:open':(d.tip==='saveas'||d.tip==='savethis'||d.tip==='prompt')?'d:save':d.tip==='mesaj'?'m:ok':d.tip==='tema'?'create':d.tip==='inlocuire'?'i:anulare':d.tip==='confirm'?'c:no':''}
    if(d.tip==='inlocuire'){
      if(id==='i:anulare'){S.dlgs.pop();S.ev.inlocuireAnulare=1;S.msg='Ai ales Anulare: fișierul care era acolo a rămas neatins, iar tu ești din nou în fereastra de salvare, cu același nume. Schimbă numele (de exemplu, adaugă prenumele) și apasă Save.';return}
      if(id==='i:ok'){daInlocuiesc(S,d);S.ev.inlocuireOk=1;return}
      S.msg='Răspunde întâi: Anulare lasă fișierul care e acolo neatins, OK îl înlocuiește.';return}
    if(d.tip==='confirm'){
      if(id==='c:no'){S.dlgs.pop();S.ev.confirmNu=1;S.msg='Ai ales No (Nu): fișierul care exista a rămas neatins. Schimbă numele și salvează din nou.';return}
      if(id==='c:yes'){daInlocuiesc(S,d);return}
      S.msg='Răspunde întâi la întrebare: Yes (Da) înlocuiește fișierul care există, No (Nu) îl lasă neatins.';return}
    if(d.tip==='export'){
      if(id==='e:cancel'){S.dlgs.pop();inchideDlgSalvare(S);S.msg='Ai renunțat: nu s-a salvat nicio imagine (s-a închis și fereastra Save As).';return}
      const p=curP(S);
      if(id==='e:one'){S.dlgs.pop();const f=scrieFisier(S,d.dir,d.nume,d.ext,{titlu:p.titlu,diap:1,tema:p.tema});S.ev.imagine=1;inchideDlgSalvare(S);
        S.msg=`Ai salvat diapozitivul de acum ca imagine: ${d.dir} › ${numeF(f)}. Prezentarea deschisă rămâne ${p.fis?numeF(p.fis):p.nume}.`;return}
      if(id==='e:all'){S.dlgs.pop();const sub=d.dir+'/'+d.nume;if(!S.dirs.includes(sub))S.dirs.push(sub);
        for(let i=1;i<=p.diap;i++)scrieFisier(S,sub,'Slide'+i,'PNG',{titlu:i===1?p.titlu:'',diap:1,tema:p.tema});S.ev.imagini=1;inchideDlgSalvare(S);
        S.dlgs.push({tip:'mesaj',text:`Each slide in your presentation has been saved as a separate file in the folder ${d.dir}\\${d.nume}.`});return}
      S.msg='Alege: All Slides (toate diapozitivele), Just This One (doar acesta) sau Cancel.';return}
    if(d.tip==='mesaj'){if(id==='m:ok'||id==='d:cancel'){S.dlgs.pop();S.msg=d.fel==='inuz'?'Fișierul acela e deschis acum într-o fereastră PowerPoint, deci nu poate fi înlocuit: alege alt nume.':'Imaginile sunt în folderul nou, câte una pe diapozitiv: Slide1, Slide2…'}else S.msg='Apasă OK.';return}
    if(d.tip==='tema'){
      if(id==='create'){S.dlgs.pop();prezNoua(S,d.tema);return}
      if(id==='d:cancel'){S.dlgs.pop();S.msg='Ai închis previzualizarea temei.';return}
      S.msg='Apasă Create ca să faci prezentarea cu tema asta, sau ✕ ca să renunți.';return}
    if(id==='d:cancel'){S.dlgs.pop();S.ev.cancel=1;
      S.msg=d.tip==='prompt'?'Ai ales Cancel: nu se închide nimic, lucrezi mai departe. Modificările sunt tot nesalvate.':'Ai închis fereastra fără să faci nimic (Cancel).';if(d.tip==='prompt')S.ev.cancelInchidere=1;return}
    if(d.tip==='prompt'){
      if(id==='d:dont'){S.dlgs.pop();S.ev.dontSave=1;const mod=d.mod;inchideGata(S,mod);S.msg='Don\'t Save: modificările de după ultima salvare s-au pierdut. '+S.msg;return}
      if(id==='d:more'){S.dlgs.pop();S.bs={pag:'saveas'};S.msg='More options te-a dus la pagina Save As din fila File.';return}
      if(id==='d:save'){const p=curP(S);
        if(p.fis&&eqN(d.nume,p.fis.nume)&&eqN(d.dir,p.fis.dir)){scrieFisier(S,p.fis.dir,p.fis.nume,p.fis.ext,continut(p));p.salvat=true;S.dlgs.pop();S.ev.salvatLaInchidere=1;const mod=d.mod;inchideGata(S,mod);S.msg='Ai salvat modificările, apoi s-a închis. '+S.msg;return}
        if(salveaza(S,d.dir,d.nume,d.tipIdx,true)){S.dlgs.pop();S.ev.salvatLaInchidere=1;const mod=d.mod;inchideGata(S,mod);S.msg='Ai salvat, apoi s-a închis. '+S.msg}return}
      S.msg='Alege: Save (salvează și închide), Don\'t Save (închide fără să salveze) sau Cancel (nu închide).';return}
    if(d.tip==='savethis'){
      if(id==='d:more'){S.dlgs.pop();S.bs={pag:'saveas'};S.msg='More options te-a dus la pagina Save As din fila File. Acolo, Browse deschide fereastra în care alegi orice folder.';return}
      if(id==='d:save'){if(salveaza(S,'Documente',d.nume,d.tipIdx,true))S.dlgs.pop();return}
      return}
    if(d.tip==='saveas'||d.tip==='open'){
      if(id.startsWith('nav:')){d.dir=id.slice(4);d.sel=null;return}
      if(id.startsWith('intra:')){d.dir=id.slice(6);d.sel=null;d.selDir=null;return}
      if(id.startsWith('dir:')){const t=id.slice(4),acum=Date.now();
        if(d.selDir===t&&acum-(d.selT||0)<700){d.dir=t;d.sel=null;d.selDir=null;return}
        d.selDir=t;d.selT=acum;d.sel=null;S.msg=`Ai ales folderul ${t.split('/').pop()}. Ca să intri în el: dublu clic (pe telefon: atinge-l de două ori, repede).`;return}
      if(id==='sus'){const i=d.dir.lastIndexOf('/');if(i>0)d.dir=d.dir.slice(0,i);return}
      if(id.startsWith('alege:')){const n=id.slice(6);d.sel=n;d.selDir=null;const k=n.lastIndexOf('.');d.nume=d.tip==='saveas'?n.slice(0,k):n;return}
      if((id==='d:save'||id==='d:open')&&d.selDir){const t=d.selDir;d.dir=t;d.sel=null;d.selDir=null;
        S.msg=`Butonul era Open, pentru că aveai ales un folder: ai intrat în ${t.split('/').pop()}. Acum apasă ${d.tip==='saveas'?'Save':'Open'}.`;return}   // R4a al judecătorului 2
      if(id==='d:save'&&d.tip==='saveas'){if(salveaza(S,d.dir,d.nume,d.tipIdx,true))inchideDlgSalvare(S);return}
      if(id==='d:open'&&d.tip==='open'){
        const n=String(d.nume||'').trim();const k=n.lastIndexOf('.');
        const f=k>0?gasesteF(S,d.dir,n.slice(0,k),n.slice(k+1)):S.files.find(x=>eqN(x.dir,d.dir)&&eqN(x.nume,n)&&PREZ_EXT.includes(x.ext));
        if(!f){S.msg=n?`În ${d.dir} nu e fișierul „${n}”. Alege-l din listă.`:'Alege întâi un fișier din listă.';return}
        S.dlgs.pop();deschideFisier(S,f,false);return}
      if(id==='d:options'){S.msg='Options... (Opțiuni) nu e folosit în lecția asta.';return}
      return}
    return;
  }
  /* ----- fără dialog ----- */
  if(id==='ppt'){if(S.app==='oprit'){S.app='start';S.wins=[];S.cur=0;S.bs=null;S.msg='Ai pornit PowerPoint: vezi ecranul de început. Alegi o prezentare nouă sau una din lista Recent.'}return}
  if(id==='x'){if(S.app==='oprit')return;inchide(S,'x');return}
  if(id.startsWith('win:')){const i=+id.slice(4);if(S.wins[i]){S.cur=i;S.bs=null}return}
  if(id==='k:ctrl+n'){if(S.app==='oprit')return;prezNoua(S,null);return}
  if(id==='k:ctrl+o'){if(S.app==='oprit')return;S.bs={pag:'open'};S.msg='Ctrl+O te-a dus la pagina Open (Deschidere) din fila File.';return}
  if(id==='k:ctrl+f12'){if(S.app==='oprit')return;deschideDlgOpen(S);return}
  if(id==='k:ctrl+s'||id==='qat-save'){ctrlS(S);return}
  if(id==='k:f12'){f12(S);return}
  if(id==='k:esc'){if(S.bs&&S.app==='deschis'){S.bs=null}else if(S.edit){S.edit=null}return}
  if(id==='k:enter')return;
  if(id==='enable'){const p=curP(S);if(p){p.protejat=false;S.ev.enable=1;S.msg='Enable Editing (Activare editare): acum poți modifica și salva prezentarea.'}return}
  if(id==='titlu'){const p=curP(S);if(!p)return;if(p.protejat){S.msg='Prezentarea e în PROTECTED VIEW: o poți doar citi. Apasă întâi Enable Editing pe bara galbenă.';return}
    S.edit={val:p.titlu};return}
  if(id==='titlu-ok'){commitEdit(S);return}
  if(id==='file'){if(S.app==='deschis'){S.bs={pag:'home'};S.edit=null}return}
  if(id.startsWith('tab-')){S.msg=`Fila „${id.slice(4)}” e din panglică (lecția 2). În lecția asta lucrezi doar cu fila File (Fișier).`;return}
  if(id.startsWith('bs:')){
    const pag=id.slice(3),p=curP(S);
    if(pag==='back'){if(S.app==='deschis')S.bs=null;return}
    if(['home','new','open','saveas'].includes(pag)){
      if(pag==='saveas'&&!p){S.msg='E gri: nu e nicio prezentare deschisă.';return}
      if(pag==='saveas'&&p.protejat){S.msg='Fișierul e în PROTECTED VIEW: întâi Enable Editing.';return}
      S.bs={pag};return}
    if(pag==='save'){if(!p){S.msg='E gri: nu e nicio prezentare deschisă.';return}
      if(p.fis){S.bs=null;ctrlS(S);return}
      S.bs={pag:'saveas'};S.msg='Prezentarea nu are încă nume: Save te-a dus la pagina Save As.';return}
    if(pag==='close'){if(!p){S.msg='E gri: nu e nicio prezentare deschisă.';return}inchide(S,'file');return}
    msgNesim(S,{info:'Info',history:'History',print:'Print',share:'Share',export:'Export',account:'Account',options:'Options'}[pag]||pag);return}
  if(id==='blank'){prezNoua(S,null);return}
  if(id.startsWith('tema:')){S.dlgs.push({tip:'tema',tema:id.slice(5)});return}
  if(id.startsWith('recent:')){const r=S.recent[+id.slice(7)];if(!r)return;const f=gasesteF(S,r.dir,r.nume,r.ext);
    if(!f){S.msg=`„${r.nume}.${r.ext}” nu mai e la locul lui (a fost mutat sau șters).`;return}deschideFisier(S,f,false);return}
  if(id==='browse-open'){deschideDlgOpen(S);return}
  if(id==='browse-save'){f12(S);return}
  if(id==='thispc'||id==='addplace'||id==='recentloc'){S.msg='În PowerPoint, aici apare o listă de locuri. În simulator nu e făcută: apasă Browse (Răsfoire), care deschide fereastra cu folderele.';return}
  if(id.startsWith('exdir:')){S.ex.dir=id.slice(6);S.ex.sel=null;return}
  if(id.startsWith('exsel:')){S.ex.sel=id.slice(6);return}
  if(id.startsWith('exopen:')){const n=id.slice(7),k=n.lastIndexOf('.');
    if(k<0){S.ex.dir=S.ex.dir+'/'+n;return}
    const f=gasesteF(S,S.ex.dir,n.slice(0,k),n.slice(k+1));if(f)deschideFisier(S,f,true);return}
}
function inchideDlgSalvare(S){S.dlgs=S.dlgs.filter(x=>x.tip!=='saveas'&&x.tip!=='savethis')}

/* ---------------- verificarea (testele) ---------------- */
const CHK={
  fisier:(S,c)=>{const f=gasesteF(S,c.dir,c.nume,c.ext);return !!f&&(c.titlu==null||norm(f.cont.titlu)===norm(c.titlu))},
  lipsa:(S,c)=>!gasesteF(S,c.dir,c.nume,c.ext),
  neschimbat:(S,c)=>{const f=gasesteF(S,c.dir,c.nume,c.ext);return !!f&&f.rev===f.rev0},
  dosarImg:(S,c)=>{const sub=c.dir+'/'+c.nume;return S.files.filter(f=>eqN(f.dir,sub)).length>=(c.n||1)},
  deschis:(S,c)=>{const p=curP(S);return S.app==='deschis'&&!S.bs&&!!p&&!!p.fis&&eqN(p.fis.nume,c.nume)&&eqN(p.fis.ext,c.ext)&&(c.dir==null||eqN(p.fis.dir,c.dir))},
  nprez:(S,c)=>S.wins.filter(w=>w.pres).length===c.n,
  goale:(S,c)=>S.wins.filter(w=>w.pres&&!w.pres.tema&&!w.pres.fis&&!w.pres.titlu).length>=c.n,
  app:(S,c)=>c.stare==='goala'?(S.app==='deschis'&&S.wins.length>=1&&!S.wins.some(w=>w.pres)):c.stare==='prez'?(S.app==='deschis'&&!!curP(S)):S.app===c.stare,
  salvat:S=>{const p=curP(S);return !!p&&p.salvat},
  tema:(S,c)=>S.wins.some(w=>w.pres&&w.pres.tema===c.val),
  ev:(S,c)=>!!S.ev[c.e],
  nicioFereastra:S=>!S.dlgs.length
};
const trece=(S,t)=>t.c.every(c=>CHK[c.k](S,c));

/* ---------------- pașii automați (poarta + „Arată-mi răspunsul”) ---------------- */
function ruleaza(S,pasi){
  for(const a of pasi||[]){
    if(typeof a==='string'){act(S,a);continue}
    const d=topD(S);
    if('titlu' in a){act(S,'titlu');if(S.edit)S.edit.val=a.titlu;act(S,'titlu-ok');continue}
    if('nume' in a){if(d)d.nume=a.nume;continue}
    if('tip' in a){if(d)d.tipIdx=Math.max(0,tipDupaExt(a.tip));continue}
    if('nav' in a){act(S,'nav:'+a.nav);continue}
    if('alege' in a){act(S,'alege:'+a.alege);continue}
    if('tema' in a){act(S,'tema:'+a.tema);continue}
    if('recent' in a){const i=S.recent.findIndex(r=>eqN(`${r.nume}.${r.ext}`,a.recent));act(S,'recent:'+i);continue}
    if('ex' in a){act(S,'exopen:'+a.ex);continue}
    if('exdir' in a){act(S,'exdir:'+a.exdir);continue}
    if('win' in a){act(S,'win:'+a.win);continue}
  }
}

/* ---------------- desenul ---------------- */
const ICN=e=>`<span class="pf-ic ${esc(e)}" aria-hidden="true">${e==='dir'?'▰':esc(String(e).slice(0,1).toUpperCase())}</span>`;
function fisiereIn(S,dir,filtru){
  const sub=S.dirs.filter(x=>x.startsWith(dir+'/')&&!x.slice(dir.length+1).includes('/')).map(x=>({dir:true,nume:x.slice(dir.length+1)}));
  const fs=S.files.filter(f=>eqN(f.dir,dir)&&(!filtru||filtru(f))).map(f=>({dir:false,f}));
  return sub.concat(fs);
}
function htmlDlg(S,d){
  const x=`<button type="button" data-t="d:cancel" aria-label="Închide fereastra (Cancel)">✕</button>`;
  if(d.tip==='tema')return `<div class="pf-dlg mic" role="dialog" aria-label="Tema ${esc(d.tema)}"><div class="pf-dh"><span>${esc(d.tema)}</span>${x}</div>
    <div class="pf-db"><div style="height:90px;background:${CUL_TEMA[d.tema]||'#555'};color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px">${esc(d.tema)}</div>
    <p style="margin:8px 0 2px">Provided by: Microsoft Corporation</p><p style="margin:0" class="pf-hint">Download size: ${esc(MARIME_TEMA[d.tema]||'—')} (tema se descarcă de pe internet)</p></div>
    <div class="pf-df"><button type="button" class="pr" data-t="create">Create${ro('Creare')}</button></div></div>`;
  if(d.tip==='confirm')return `<div class="pf-dlg mic" role="dialog" aria-label="Confirm Save As"><div class="pf-dh"><span>Confirm Save As</span></div>
    <div class="pf-db pf-msgbox">⚠ ${esc(d.text)}</div><div class="pf-df"><button type="button" data-t="c:yes">Yes${ro('Da')}</button><button type="button" class="pr" data-t="c:no">No${ro('Nu')}</button></div></div>`;
  if(d.tip==='inlocuire')return `<div class="pf-dlg mic" role="dialog" aria-label="Save As: fișierul există"><div class="pf-dh"><span>Save As</span><button type="button" data-t="i:anulare" aria-label="Închide (ca Anulare)">✕</button></div>
    <div class="pf-db pf-msgbox">⚠ ${esc(d.text)}</div><div class="pf-df"><button type="button" class="pr" data-t="i:ok">OK</button><button type="button" data-t="i:anulare">Anulare${ro('(Cancel)')}</button></div></div>`;
  if(d.tip==='export')return `<div class="pf-dlg mic" role="dialog" aria-label="Microsoft PowerPoint"><div class="pf-dh"><span>Microsoft PowerPoint</span>${x.replace('d:cancel','e:cancel')}</div>
    <div class="pf-db">ⓘ Which slides do you want to export?</div><div class="pf-df"><button type="button" data-t="e:all">All Slides</button><button type="button" class="pr" data-t="e:one">Just This One</button><button type="button" data-t="e:cancel">Cancel${ro('Anulare')}</button></div></div>`;
  if(d.tip==='mesaj')return `<div class="pf-dlg mic" role="dialog" aria-label="Microsoft PowerPoint"><div class="pf-dh"><span>Microsoft PowerPoint</span></div>
    <div class="pf-db pf-msgbox">ⓘ ${esc(d.text)}</div><div class="pf-df"><button type="button" class="pr" data-t="m:ok">OK</button></div></div>`;
  const tipSel=`<select data-f="tip" aria-label="Save as type (Salvare cu tipul)">${TIPURI.map((t,i)=>`<option value="${i}"${i===d.tipIdx?' selected':''}>${esc(t[0])}</option>`).join('')}</select>`;
  if(d.tip==='savethis'||d.tip==='prompt'){
    const tit=d.tip==='savethis'?'Save this file':'Save your changes to this file?',titRo=d.tip==='savethis'?ro('(Salvați acest fișier)'):'';
    const loc=d.tip==='prompt'&&!d.nou?d.dir:'Documents';
    return `<div class="pf-dlg" role="dialog" aria-label="${esc(tit)}"><div class="pf-dh"><span>${esc(tit)}${titRo}</span>${x}</div><div class="pf-db">
      ${d.tip==='prompt'&&!d.nou?'<p class="pf-hint" style="margin:0 0 6px">Avoid losing changes to this file in the future by saving it to a folder backed up to the cloud instead.</p>':''}
      <label for="pf-n">File name ${ro('(Nume fișier)')}</label><input type="text" id="pf-n" data-f="nume" value="${esc(d.nume)}" autocomplete="off" spellcheck="false">
      <label>Save as type ${ro('(Salvare cu tipul)')}</label>${tipSel}
      <label>Choose a Location</label><div class="pf-cale">📁 ${esc(loc)}${loc==='Documents'?ro('(folderul Documente)'):''}</div>
      ${d.nou||d.tip==='savethis'?`<button type="button" class="pf-link" data-t="d:more">More options…${ro('(Mai multe opțiuni)')}</button>`:''}</div>
      <div class="pf-df"><button type="button" class="pr" data-t="d:save">Save${ro('Salvare')}</button>${d.tip==='prompt'?`<button type="button" data-t="d:dont">Don't Save${ro('Nu salvați')}</button>`:''}<button type="button" data-t="d:cancel">Cancel${ro('Anulare')}</button></div></div>`;
  }
  /* fereastra clasică Save As / Open (Windows în română, Office în engleză) */
  const esteSave=d.tip==='saveas';
  const filtru=esteSave?(f=>f.ext===TIPURI[d.tipIdx][1]||(TIPURI[d.tipIdx][2]==='img'&&false)):(f=>PREZ_EXT.includes(f.ext));
  const el=fisiereIn(S,d.dir,filtru);
  const nav=['Desktop','Documente','Descărcări','Imagini'].map(n=>`<button type="button" data-t="nav:${esc(n)}" class="${d.dir===n?'on':''}">${esc(n)}</button>`).join('');
  const lista=el.length?el.map(e=>e.dir?`<button type="button" data-t="dir:${esc(d.dir+'/'+e.nume)}" class="${d.selDir===d.dir+'/'+e.nume?'on':''}">${ICN('dir')} ${esc(e.nume)}</button>`
    :`<button type="button" data-t="alege:${esc(numeF(e.f))}" class="${d.sel===numeF(e.f)?'on':''}">${ICN(e.f.ext)} ${esc(numeF(e.f))}</button>`).join('')
    :`<div class="gol">${esteSave?'Niciun element nu corespunde căutării.':'Folderul e gol.'}</div>`;
  const pdf=esteSave&&TIPURI[d.tipIdx][1]==='pdf'?`<div class="pf-pdfopt"><label><input type="checkbox" data-f="pdfDeschide"${d.pdfDeschide?' checked':''}> Open file after publishing ${ro('(Se deschide fișierul după publicare)')}</label>
      Optimize for: <label><input type="radio" name="pf-opt" checked> Standard (publishing online and printing)</label><label><input type="radio" name="pf-opt"> Minimum size (publishing online)</label>
      <button type="button" class="pf-bt" data-t="d:options">Options...</button></div>`:'';
  return `<div class="pf-dlg" role="dialog" aria-label="${esteSave?'Save As':'Open'}"><div class="pf-dh"><span>${esteSave?'Save As':'Open'}</span>${x}</div><div class="pf-db">
    <div class="pf-cale">Acest PC › ${esc(d.dir.split('/').join(' › '))} ${d.dir.includes('/')?'<button type="button" class="pf-link" data-t="sus">↑ folderul de mai sus</button>':''}</div>
    <div class="pf-cl"><div class="pf-nav" role="group" aria-label="Panou de navigare">${nav}</div><div class="pf-files"><div class="cap"><span>Nume</span><span>${esteSave?'':'(prezentările)'}</span></div>${lista}</div></div>
    <label for="pf-n">File name: ${ro('(Nume fișier)')}</label><input type="text" id="pf-n" data-f="nume" value="${esc(d.nume)}" autocomplete="off" spellcheck="false">
    ${esteSave?`<label>Save as type: ${ro('(Salvare cu tipul)')}</label>${tipSel}`:`<label>Files of type:</label><div class="pf-cale">All PowerPoint Presentations (*.pptx;*.ppt;*.pptm;*.ppsx;*.pps;*.ppsm;*.potx;*.pot;*.potm;*.odp)</div>`}${pdf}</div>
    <div class="pf-df">${esteSave?`<button type="button" class="st" data-nesim="Hide Folders">Hide Folders</button>`:''}<button type="button" class="pr" data-t="${esteSave?'d:save':'d:open'}">${esteSave&&!d.selDir?'Save'+ro('Salvare'):'Open'+ro('Deschidere')}</button><button type="button" data-t="d:cancel">Cancel${ro('Anulare')}</button></div></div>`;
}
function htmlBs(S){
  const p=curP(S),start=S.app==='start',pag=S.bs?S.bs.pag:'home';
  const it=(k,t,r,gri)=>`<button type="button" data-t="bs:${k}" class="${pag===k?'on':''}${gri?' gri':''}">${t}${r?ro(r):''}</button>`;
  const nav=start?[it('home','Home'),it('new','New','Nou'),it('open','Open','Deschidere'),'<hr>',it('account','Account'),it('options','Options')]
    :[`<button type="button" data-t="bs:back" aria-label="Înapoi la prezentare (Back)">⭠ Back</button>`,it('home','Home'),it('new','New','Nou'),it('open','Open','Deschidere'),it('info','Info','',!p),it('save','Save','Salvare',!p),
      it('saveas','Save As','Salvare ca',!p),p?it('history','History'):'',it('print','Print','',!p),it('share','Share','',!p),it('export','Export','',!p),it('close','Close','Închidere',!p),'<hr>',it('account','Account'),it('options','Options')];
  const tile=(t,n,cul,r)=>`<button type="button" class="pf-tile" data-t="${t}"><span class="pf-mini" style="${cul?`background:${cul};color:#fff`:''}">${cul?esc(n):'&nbsp;'}</span><span class="n">${esc(n)}${r?ro(r):''}</span></button>`;
  const tiles=`<div class="pf-tiles">${tile('blank','Blank Presentation','', 'Prezentare necompletată')}${TEME.map(t=>tile('tema:'+t,t,CUL_TEMA[t])).join('')}</div>`;
  const rec=S.recent.length?`<ul class="pf-lista">${S.recent.map((r,i)=>`<li><button type="button" data-t="recent:${i}">${ICN(r.ext)} <span>${esc(r.nume+'.'+r.ext)}<br><small>Acest PC › ${esc(r.dir.split('/').join(' › '))}</small></span></button></li>`).join('')}</ul>`:'<p class="pf-hint">Lista Recent e goală.</p>';
  let corp='';
  if(pag==='home')corp=`<h4>${start?'Good day':'Home'}</h4>${tiles}<p style="margin:12px 0 2px;font-weight:600">Recent</p>${rec}`;
  else if(pag==='new')corp=`<h4>New ${ro('Nou')}</h4>${tiles}<p class="pf-hint">Tema dă culori, fonturi și fundal gata alese. Căutarea de teme și șabloane pe internet nu e în simulator.</p>`;
  else if(pag==='open')corp=`<h4>Open ${ro('Deschidere')}</h4><div class="pf-loc"><button type="button" data-t="recentloc">Recent</button><button type="button" data-t="thispc">This PC${ro('Acest PC')}</button><button type="button" data-t="addplace">Add a Place</button><button type="button" class="br" data-t="browse-open">📂 Browse${ro('Răsfoire')}</button></div>${rec}`;
  else if(pag==='saveas')corp=`<h4>Save As ${ro('Salvare ca')}</h4><div class="pf-loc"><button type="button" data-t="recentloc">Recent</button><button type="button" data-t="thispc">This PC${ro('Acest PC')}</button><button type="button" data-t="addplace">Add a Place</button><button type="button" class="br" data-t="browse-save">📂 Browse${ro('Răsfoire')}</button></div><p class="pf-hint">Browse (Răsfoire) deschide fereastra Save As, în care alegi folderul, numele și tipul.</p>`;
  return `<div class="pf-bs"><nav class="pf-bsn" aria-label="Fila File">${nav.join('')}</nav><div class="pf-bsp">${corp}</div></div>`;
}
function htmlEd(S,Q){
  const p=curP(S);
  const tabs=`<div class="pf-tabs" role="tablist"><button type="button" class="pf-file" data-t="file">File${ro('Fișier').replace('pf-ro','pf-ro" style="color:#fff')}</button>${['Home','Insert','Design','Transitions','Animations','Slide Show','Review','View'].map(t=>`<button type="button" data-t="tab-${t}">${t}</button>`).join('')}</div>`;
  if(!p)return tabs+`<div class="pf-rib">Panglica e gri: nu e nicio prezentare deschisă.</div><div class="pf-gol">PowerPoint e deschis, dar fără nicio prezentare.<br>Fila File: New (Nou) sau Open (Deschidere).</div>`;
  const pv=p.protejat?`<div class="pf-pv"><b>PROTECTED VIEW</b><span class="pf-ro" style="margin:0">(în simulator: aici PowerPoint scrie că fișierul vine de pe internet)</span><button type="button" data-t="enable">Enable Editing${ro('Activare editare')}</button></div>`:'';
  const titlu=S.edit?`<input class="pf-in" data-f="titlu" aria-label="Titlul diapozitivului" value="${esc(S.edit.val)}" autocomplete="off">`
    :`<button type="button" class="pf-ph t" data-t="titlu" aria-label="Titlul diapozitivului: clic ca să scrii">${p.titlu?esc(p.titlu):'Click to add title'}</button>`;
  const th=Array.from({length:p.diap},(_,i)=>`<div class="${i===0?'on':''}" aria-hidden="true">${i===0?esc(p.titlu):''}</div>`).join('');
  return tabs+pv+`<div class="pf-rib">Panglica (fila Home) — din lecția 2. Aici folosești doar fila File și tastele.</div>
    <div class="pf-ed"><div class="pf-th">${th}</div><div class="pf-sl${p.tema?' tema':''}" style="${p.tema?`background:${CUL_TEMA[p.tema]}`:''}">${titlu}<div class="pf-ph s">${p.sub?esc(p.sub):'Click to add subtitle'}</div>${p.tema?`<span class="pf-temanume">tema ${esc(p.tema)}</span>`:''}</div></div>`;
}
function appHTML(S,Q){
  let corp;
  if(S.app==='oprit')corp=`<div class="pf-tb"><span class="pf-tit">Desktop</span></div><div class="pf-desk"><span>PowerPoint e închis. Îl pornești din Start sau cu pictograma lui:</span>
    <button type="button" data-t="ppt">${ICN('pptx')} PowerPoint</button></div>`;
  else{
    const saveBtn=S.app==='deschis'&&curP(S)?`<button type="button" class="pf-qs" data-t="qat-save" aria-label="Save (Salvare), ca Ctrl+S">💾</button>`:'';
    corp=`<div class="pf-tb">${saveBtn}<span class="pf-tit">${esc(titluFer(S))}</span><button type="button" data-nesim="Minimize">—</button><button type="button" data-nesim="Maximize">☐</button><button type="button" class="pf-x" data-t="x" aria-label="Close (Închidere): închide fereastra">✕</button></div>`
      +(S.app==='start'||S.bs?htmlBs(S):htmlEd(S,Q));
  }
  const bar=S.app==='oprit'?'':`<div class="pf-bar"><span class="pf-lbl">Ferestre deschise:</span>${S.app==='start'?'<button type="button" class="on">PowerPoint</button>':S.wins.map((w,i)=>`<button type="button" data-t="win:${i}" class="${i===S.cur?'on':''}">${esc(w.pres?(w.pres.fis?numeF(w.pres.fis):w.pres.nume):'PowerPoint')}</button>`).join('')}</div>`;
  const d=topD(S);
  const dlg=d?`<div class="pf-strat">${htmlDlg(S,d)}</div>`:'';
  const show=S.show?`<div class="pf-show" role="dialog" aria-label="PowerPoint Slide Show"><div class="pf-hint" style="color:#bbb">PowerPoint Slide Show - [${esc(S.show.f)}]</div><div class="t">${esc(S.show.titlu)}</div><button type="button" data-t="show:esc">Esc — ieși din expunere</button></div>`:'';
  return `<div class="pf${d?' dlg':''}" data-app="${S.app}">${corp}${dlg}${bar}${show}</div>`;
}
function exHTML(S){
  const d=S.ex.dir,el=fisiereIn(S,d,null);
  return `<div class="pf-ex" aria-label="File Explorer simplificat"><div class="hd"><b>File Explorer</b> (simplificat) · Acest PC › ${esc(d.split('/').join(' › '))}</div>
   <div class="dirs">${['Desktop','Documente','Descărcări','Imagini'].map(n=>`<button type="button" data-t="exdir:${esc(n)}" class="${d===n?'on':''}">${esc(n)}</button>`).join('')}${d.includes('/')?`<button type="button" data-t="exdir:${esc(d.slice(0,d.lastIndexOf('/')))}">↑ sus</button>`:''}</div>
   <ul>${el.length?el.map(e=>{const n=e.dir?e.nume:numeF(e.f),fel=e.dir?'folder':(FEL[e.f.ext]||e.f.ext);
     return `<li>${ICN(e.dir?'dir':e.f.ext)}<span class="nm">${esc(n)} <small>· ${esc(fel)}</small></span><button type="button" data-t="exopen:${esc(n)}">Deschide (ca dublu clic)</button></li>`}).join(''):'<li><small>Folderul e gol.</small></li>'}</ul></div>`;
}

/* ---------------- gesturile ---------------- */
function render(Q,body,api){
  stil();
  let S=init(Q);
  body.innerHTML=`<div class="pf-root"><div class="pf-app"></div><div class="pf-exw"></div><div class="pf-msg" aria-live="polite"></div>
    <div class="pf-taste" role="group" aria-label="Tastele"><span class="lbl2">Tastele (pe telefon nu le ai: apasă-le aici; pe calculator merg și de pe tastatură, în afară de Ctrl+N, pe care browserul îl folosește pentru o fereastră nouă):</span>
      <button type="button" data-k="k:ctrl+n">Ctrl+N<small>nouă</small></button><button type="button" data-k="k:ctrl+o">Ctrl+O<small>deschide</small></button><button type="button" data-k="k:ctrl+s">Ctrl+S<small>salvează</small></button><button type="button" data-k="k:f12">F12<small>salvare ca</small></button><button type="button" data-k="k:esc">Esc<small>renunță</small></button></div>
    <div class="lbl">Testele tale (se bifează singure)</div><ol class="pf-teste"></ol>
    <div class="pf-unelte"><button type="button" class="btn ghost sm pf-reset">Ia-o de la capăt</button></div></div>`;
  const root=body.querySelector('.pf-root'),app=body.querySelector('.pf-app'),exw=body.querySelector('.pf-exw'),msg=body.querySelector('.pf-msg'),ol=body.querySelector('.pf-teste');
  function side(){
    ol.innerHTML=Q.teste.map(t=>`<li class="${trece(S,t)?'ok':''}">${t.ce}</li>`).join('');
    msg.innerHTML=S.msg?esc(S.msg):(Q.teste.every(t=>trece(S,t))?'Toate testele sunt bifate. Apasă „Verifică”.':'Lucrează în fereastră; testele se bifează singure când sunt gata.');
  }
  let ultimulDlg=null;
  function draw(){
    /* focusul rămâne pe același buton / câmp al ferestrei de dialog și după redesen (altfel Enter nu mai ajunge la No / Anulare) */
    const fo=document.activeElement,inStrat=!!(fo&&app.contains(fo)&&fo.closest('.pf-strat'));
    const foSel=inStrat?(fo.dataset.t?`.pf-strat [data-t="${fo.dataset.t}"]`:fo.dataset.f?`.pf-strat [data-f="${fo.dataset.f}"]`:null):null;
    app.innerHTML=appHTML(S,Q);exw.innerHTML=Q.explorer?exHTML(S):'';side();
    if(foSel&&!api.done()){const n=app.querySelector(foSel);if(n){try{n.focus({preventScroll:true})}catch(e){}}}
    const dl=app.querySelector('.pf-dlg');
    const cheieDlg=dl?dl.getAttribute('aria-label')+'|'+S.dlgs.length:null;
    if(dl&&cheieDlg!==ultimulDlg&&!api.done()){try{const r=dl.getBoundingClientRect();if(r.top<0||r.top>innerHeight-80)dl.scrollIntoView({block:'start'})}catch(e){}}
    if(dl&&cheieDlg!==ultimulDlg&&!api.done()&&!(window.matchMedia&&matchMedia('(pointer:coarse)').matches)){const n=dl.querySelector('input[data-f="nume"]');
      const bf=dl.querySelector('[data-t="i:anulare"].pf-bt-fo,[data-t="c:no"]')||dl.querySelector('.pf-df [data-t="i:anulare"]');
      if(n){try{n.focus({preventScroll:true});n.select()}catch(e){}}else if(bf){try{bf.focus({preventScroll:true})}catch(e){}}}
    ultimulDlg=cheieDlg;
    const inp=app.querySelector('.pf-in');
    if(inp&&!api.done()){try{inp.focus({preventScroll:true});const n=inp.value.length;inp.setSelectionRange(n,n)}catch(e){}}
  }
  function gest(id,arg){if(api.done())return;act(S,id,arg);draw()}
  const clic=e=>{
    if(api.done())return;
    const ns=e.target.closest('[data-nesim]');
    if(ns&&root.contains(ns)){commitEdit(S);msgNesim(S,ns.dataset.nesim);draw();return}
    const el=e.target.closest('[data-t]');
    if(!el||!root.contains(el))return;
    if(el.dataset.t.startsWith('alege:')){act(S,el.dataset.t);app.querySelectorAll('.pf-files button').forEach(b=>b.classList.toggle('on',b===el));
      const inp=app.querySelector('input[data-f="nume"]');const d=topD(S);if(inp&&d)inp.value=d.nume;side();return}
    gest(el.dataset.t);
  };
  app.addEventListener('click',clic);exw.addEventListener('click',clic);
  app.addEventListener('dblclick',e=>{const f=e.target.closest('[data-t^="alege:"]');if(!f||api.done())return;
    const d=topD(S);if(!d)return;act(S,f.dataset.t);gest(d.tip==='open'?'d:open':'d:save')});
  app.addEventListener('input',e=>{const f=e.target.dataset.f,d=topD(S);
    if(f==='titlu'&&S.edit){S.edit.val=e.target.value;return}
    if(!d)return;
    if(f==='nume'){d.nume=e.target.value;if(d.selDir){d.selDir=null;const pb=app.querySelector('.pf-strat .pf-df [data-t="d:save"]');if(pb)pb.innerHTML='Save'+ro('Salvare');
      app.querySelectorAll('.pf-files button.on').forEach(x=>x.classList.remove('on'))}}
    if(f==='tip'){d.tipIdx=+e.target.value;draw()}
    if(f==='pdfDeschide')d.pdfDeschide=e.target.checked;
  });
  app.addEventListener('change',e=>{const f=e.target.dataset.f,d=topD(S);if(f==='tip'&&d&&d.tipIdx!==+e.target.value){d.tipIdx=+e.target.value;draw()}
    if(f==='titlu'&&S.edit){S.edit.val=e.target.value}});
  app.addEventListener('focusout',e=>{if(e.target.dataset&&e.target.dataset.f==='titlu'&&S.edit&&!api.done()){setTimeout(()=>{if(S.edit){act(S,'titlu-ok');draw()}},120)}});
  /* tastele: pe DOCUMENT, dacă ultimul clic/atingere a fost în exercițiu (simulator sau butonul Verifică) */
  let activ=true;   // exercițiul abia deschis ascultă din prima: altfel Ctrl+S / Ctrl+O ar ajunge la browser („Salvează pagina”)
  const laApasare=e=>{const nv=api.nav&&api.nav(),carte=body.parentNode||body;activ=root.isConnected&&(carte.contains(e.target)||(!!nv&&nv.contains(e.target)))};
  const laTasta=e=>{
    if(!root.isConnected){opreste();return}
    const t=e.target,k=e.key,c=e.ctrlKey||e.metaKey,lk=(k||'').toLowerCase();
    const aplic=(c&&lk==='s')?'k:ctrl+s':(c&&k==='F12')?'k:ctrl+f12':(c&&lk==='o')?'k:ctrl+o':(k==='F12'&&!e.shiftKey&&!e.altKey)?'k:f12':null;
    if(aplic){e.preventDefault();   // nu ajung la browser (Salvează pagina, Deschide fișierul, DevTools) — J2 al judecătorului
      if(api.done())return;
      if(!root.contains(t)&&t&&t.closest&&t.closest('input,textarea,select,[contenteditable="true"]'))return;
      gest(aplic);return}
    if(!activ||api.done())return;
    if(k==='Enter'&&!(t&&t.closest&&t.closest('button,input,select,textarea'))){const dd=topD(S);if(dd&&(dd.tip==='inlocuire'||dd.tip==='confirm')){e.preventDefault();gest('k:enter');return}}
    const inCamp=!!(t&&t.closest&&t.closest('.pf input,.pf select'));
    if(!root.contains(t)&&t&&t.closest&&t.closest('input,textarea,select,[contenteditable="true"]'))return;
    let id=null;
    if(c&&lk==='s')id='k:ctrl+s';else if(c&&k==='F12')id='k:ctrl+f12';else if(c&&lk==='o')id='k:ctrl+o';else if(k==='F12')id='k:f12';
    else if(k==='Escape')id='k:esc';
    else if(k==='Enter'&&inCamp){if(t.dataset.f==='titlu'){e.preventDefault();gest('titlu-ok');return}if(t.dataset.f==='nume'){e.preventDefault();gest('k:enter');return}}
    if(!id)return;
    e.preventDefault();gest(id);
  };
  function opreste(){document.removeEventListener('pointerdown',laApasare,true);document.removeEventListener('keydown',laTasta)}
  if(window.__simPptfOpreste)window.__simPptfOpreste();
  window.__simPptfOpreste=opreste;
  document.addEventListener('pointerdown',laApasare,true);document.addEventListener('keydown',laTasta);
  root.querySelector('.pf-taste').addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(!b||api.done())return;gest(b.dataset.k)});
  body.querySelector('.pf-reset').onclick=()=>{if(api.done())return;S=init(Q);draw()};
  draw();
  body._pf={rez:()=>{S=init(Q);ruleaza(S,Q.rez);draw()},gresit:()=>{S=init(Q);ruleaza(S,Q.gresit);draw()},stare:()=>S};
  const nav=api.checkButton(()=>{
    commitEdit(S);draw();
    const lipsa=Q.teste.find(t=>!trece(S,t));
    if(!lipsa){nav.innerHTML='';api.resolve(true);return}
    api.resolve(false,`Mai ai de făcut: ${strip(lipsa.ce)}.${lipsa.ajutor?' '+lipsa.ajutor:''}`);
    api.revealButton(()=>{S=init(Q);ruleaza(S,Q.rez);draw();nav.innerHTML='';api.giveUp(`am făcut acum pașii în simulator: ${Q.rezText}.`)});
  });
}
function rezolva(Q,body){if(body._pf)body._pf.rez()}
function gresit(Q,body){if(body._pf)body._pf.gresit()}
window.SimPPTFisier={render,rezolva,gresit,P,F,
  scenarii:o=>Object.assign(SCEN,o),
  _intern:{init,act,ruleaza,CHK,trece,TIPURI}};
})();
