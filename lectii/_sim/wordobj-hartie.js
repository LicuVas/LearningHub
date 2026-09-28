/* lectii/_sim/wordobj-hartie.js — Word-ul simulat: MĂRIMEA FOII, orientarea și marginile (LearningHub, 28.09.2026).

   PROPRIETAR: autorul lecției VII · M2 · 9 („Document după specificații date”). Fișier NOU (extensie): wordobj.js,
   wordobj-formatare.js și wordobj-pagina.js NU se modifică. Se încarcă DUPĂ ele și după jocuri/_motor/ui-panglica.js +
   panglica-word.js. Îi folosește stilurile .wo-* / .wp-* (ferestre, meniuri, pagina, testele).

   1. Tipul `wordhartie` -> tipuri:{wordhartie:TipWordHartie}: fila Layout (Aspect) cu Margins, Orientation și Size
      (butoanele mari, CU NUMELE SCRISE, ca în Word), lista Size, More Paper Sizes... și fereastra Page Setup (filele
      Margins și Paper). Faptele, probate în Word-ul REAL (lectii/vii/m2-l09/_proba: ui_ascuns.json, ui_hartie_rezultat.json,
      word_literal.json; și judecătorul: _verificare/j9_word*.json):
      - lista Size: numele și mărimile din Word-ul instalat (vin de la imprimantă); A5 = 14,8 × 21 cm; aleasă pe foaia
        culcată dă 21 × 14,8 (orientarea rămâne); marginile nu se schimbă;
      - More Paper Sizes... deschide Page Setup direct la fila Paper (Paper size, Width, Height);
      - un clic în casetă NU selectează ce scrie acolo: „scrie 9” fără ștergere dă „21 cm9” = „This is not a valid
        measurement.” la trecerea pe altă filă sau la OK (judecătorul, j9_word3.json); după Width 9 și Height 5, Paper size
        trece pe Custom size; fila Margins arată Landscape când foaia e mai lată decât înaltă;
      - OK cu marginile de 2,5 cm pe o foaie de 5 cm înălțime: „The top/bottom margins are too large for the page height
        in some sections.”; pe una de 4 cm lățime: „Settings you chose for the left and right margins, column spacing, or
        paragraph indents are too large for the page width in some sections.”; după OK pe mesaj, fereastra rămâne deschisă;
      - pe setări românești, „0,5” e primit, „0.5” nu („This is not a valid measurement.”, judecătorul, P_punct);
      - Orientation întoarce foaia și rotește marginile (probat în lecția 7: sus 2, jos 1,5, stânga 3, dreapta 1 ->
        pe vedere sus 3, jos 1, stânga 1,5, dreapta 2).
      ABATERI SPUSE PE ECRAN: fila Layout a ferestrei, Mirrored, Columns, Breaks… nu sunt în simulator; lista Size are
      primele 10 mărimi (în Word continuă, iar pe alt calculator poate fi alta); pragul la care Word refuză marginile
      prea mari: Word primește 0,1 cm de text rămas (sus 2,45 + jos 2,45 pe foaia de 5 cm, judecătorul 2, j9d_word.json) și
      refuză 0 (2,5 + 2,5); simulatorul refuză sub 0,05 cm (între ele, neprobat);
      - după OK pe „This is not a valid measurement.”, Word selectează tot textul casetei greșite: o cifră scrisă îl
        înlocuiește (judecătorul 2, j9b_word.json).
      CONFIGURAȚIA: {t:'wordhartie', q, start:{lat, inalt, m:[sus,jos,st,dr], bl:[{t, sz, b, i, al, font, col}]},
        verif:[{ce, pagina:{lat?, inalt?, or?:'vedere'|'portret', m?:{sus|jos|st|dr: nr}, hartie?:'A5'}, cum?}],
        sol?:{lat, inalt, m}, tipic:{…}}.
   2. În `wordpag` (lecția 7): butoanele Margins / Orientation / Size primesc numele scris sub pictogramă (pe telefon nu
      există „ține mouse-ul”), iar Size deschide lista adevărată cu mesajul exercițiului (acolo foaia rămâne A4),
      în loc de „în lecția asta nu-l folosim” (lecția 9 chiar îl predă).
   3. În `wordfmt` (lecția 6), pe telefon: sub panglică, două butoane mari „Fontul ▾” și „Mărimea ▾” care deschid
      meniurile casetelor Font și Font Size (în panglica desenată la scară, casetele au 14 px înălțime).
   Doar pagina lecției 9 încarcă fișierul: nimic din el nu atinge alte lecții. */
(function(G){
'use strict';
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nr=v=>{const r=Math.round(v*100)/100;return String(r).replace('.',',')};
const cmTxt=v=>nr(v)+' cm';
const PT=28.3465;
/* lista Size din Word-ul instalat (ui_ascuns.json, size_iteme; captura size_meniu_0.png): primele 10, în ordine */
const HARTII=[['Letter',21.59,27.94],['Legal',21.59,35.56],['A4',21,29.7],['A5',14.8,21],['B5 (JIS)',18.2,25.7],['Plic nr. 10',10.48,24.13],
  ['Plic DL',11,22],['Carte poștală japoneză',10,14.8],['A6',10.5,14.8],['English Photo L',8.89,12.7]];
const MARGINI=[['Normal',[2.5,2.5,2.5,2.5]],['Narrow',[1.27,1.27,1.27,1.27]],['Moderate',[2.54,2.54,1.91,1.91]],['Wide',[2.54,2.54,5.08,5.08]]];
const LAT=['Top','Bottom','Left','Right'],LAT_RO=['sus','jos','stânga','dreapta'],CHEI=['sus','jos','st','dr'];
const M_MASURA='This is not a valid measurement.';
const M_SUS_JOS='The top/bottom margins are too large for the page height in some sections.';
const PRAG_TEXT=0.05;   // cm de text rămas între margini: Word primește 0,1 și refuză 0 (măsurat)
const M_ST_DR='Settings you chose for the left and right margins, column spacing, or paragraph indents are too large for the page width in some sections.';
const FONT_CSS={'Georgia':'Georgia,serif','Times New Roman':"'Times New Roman','Liberation Serif',Times,serif",'Comic Sans MS':"'Comic Sans MS','Comic Neue',cursive",
  'Arial':"Arial,'Liberation Sans',sans-serif",'Calibri':"Calibri,Carlito,'Segoe UI',Arial,sans-serif"};

/* o măsură scrisă de elev, ca Word-ul cu setări românești: „9”, „9 cm”, „9cm”, „14,8”, „90 mm”; „9.5” și „21 cm9” nu */
function masura(s){const t=String(s==null?'':s).trim().toLowerCase();const m=t.match(/^(\d+(?:,\d+)?)\s*(cm|mm|pt|")?$/);if(!m)return NaN;
  const v=parseFloat(m[1].replace(',','.')),u=m[2]||'cm';return u==='mm'?v/10:u==='pt'?v/PT:u==='"'?v*2.54:v}
const orDin=d=>d.lat>d.inalt+1e-9?'vedere':'portret';
function roteste(d,or){if(orDin(d)===or)return;const [s,j,st,dr]=d.m;
  if(or==='vedere')d.m=[st,dr,j,s];else d.m=[dr,st,s,j];   // lecția 7: sus 2, jos 1,5, stânga 3, dreapta 1 -> vedere 3 / 1 / 1,5 / 2
  const w=d.lat;d.lat=d.inalt;d.inalt=w}
function numeHartie(lat,inalt){if(!(lat>0&&inalt>0))return '';const a=Math.min(lat,inalt),b=Math.max(lat,inalt);
  const h=HARTII.find(x=>Math.abs(x[1]-a)<0.01&&Math.abs(x[2]-b)<0.01);return h?h[0]:'Custom size'}
const clone=o=>JSON.parse(JSON.stringify(o));
function mk(start){const s=start||{};return {lat:s.lat||21,inalt:s.inalt||29.7,m:(s.m||[2.5,2.5,2.5,2.5]).slice(),bl:clone(s.bl||[])}}
function aplica(d,o){if(!o)return;if(o.or)roteste(d,o.or);if(o.lat!=null)d.lat=o.lat;if(o.inalt!=null)d.inalt=o.inalt;if(o.m)d.m=o.m.slice()}
function solutie(Q){const d=mk(Q.start);if(Q.sol){aplica(d,Q.sol);return d}
  (Q.verif||[]).forEach(v=>{const p=v.pagina||{};if(p.or)roteste(d,p.or);
    if(p.hartie){const h=HARTII.find(x=>x[0]===p.hartie);if(h){const cul=orDin(d)==='vedere';d.lat=cul?h[2]:h[1];d.inalt=cul?h[1]:h[2]}}
    if(p.lat!=null)d.lat=p.lat;if(p.inalt!=null)d.inalt=p.inalt;if(p.m)CHEI.forEach((k,i)=>{if(p.m[k]!=null)d.m[i]=p.m[k]})});
  return d}
function gresitDoc(Q){const d=mk(Q.start);aplica(d,Q.tipic);return d}
const aproape=(a,b)=>Math.abs(a-b)<0.006;
function testeaza(Q,d){
  return (Q.verif||[]).map(v=>{const p=v.pagina||{};let ok=true,cum=v.cum||'';
    if(p.lat!=null&&!aproape(d.lat,p.lat)){ok=false;cum=cum||`Foaia are ${cmTxt(d.lat)} lățime; trebuie ${cmTxt(p.lat)}.`}
    if(p.inalt!=null&&!aproape(d.inalt,p.inalt)){ok=false;cum=cum||`Foaia are ${cmTxt(d.inalt)} înălțime; trebuie ${cmTxt(p.inalt)}.`}
    if(p.or&&orDin(d)!==p.or){ok=false;cum=cum||`Foaia trebuie să fie ${p.or==='vedere'?'culcată (Landscape)':'în picioare (Portrait)'}.`}
    if(p.hartie&&numeHartie(d.lat,d.inalt)!==p.hartie){ok=false;cum=cum||`Foaia trebuie să fie ${p.hartie}.`}
    if(p.m)CHEI.forEach((k,i)=>{if(p.m[k]!=null&&!aproape(d.m[i],p.m[k])){ok=false;cum=cum||`Marginea de ${LAT_RO[i]} (${LAT[i]}) are ${cmTxt(d.m[i])}; trebuie ${cmTxt(p.m[k])}.`}});
    return {ce:v.ce,ok,cum}})}

const CSS=`
.wh .wh-mare{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:1px;padding:3px 1px 0;border:1px solid transparent;
  background:none;color:var(--ink);border-radius:3px;font:inherit;font-size:.66rem;line-height:1.05;cursor:pointer;white-space:nowrap}
.wh .wh-mare svg{width:24px;height:24px;fill:currentColor;flex:0 0 auto}
.wh .wh-mare:hover,.wh .wh-mare:focus-visible,.wh .wh-mare[aria-expanded="true"]{border-color:#2B579A;background:var(--sel)}
.wh .wh-mare .wh-sag{font-size:.56rem;opacity:.75}
.wh .wh-pgm{flex:0 0 auto;width:20px;height:26px;border:1px solid #8A94A3;background:#fff}
.wh .wh-win{position:relative}
.wh .wh-tabs{display:flex;gap:2px;padding:6px 10px 0;border-bottom:1px solid var(--line)}
.wh .wh-tabs button{min-height:34px;padding:0 12px;border:1px solid var(--line);border-bottom:0;border-radius:6px 6px 0 0;background:var(--paper2);color:var(--ink);font:inherit;font-size:.86rem;cursor:pointer}
.wh .wh-tabs button[aria-selected="true"]{background:var(--paper);font-weight:700;box-shadow:inset 0 2px 0 #2B579A}
.wh .wh-fila{padding:8px 10px;display:grid;gap:8px}
.wh .wh-fila fieldset{border:1px solid var(--line);border-radius:6px;padding:6px 8px 8px;margin:0;display:grid;gap:6px;grid-template-columns:repeat(auto-fit,minmax(130px,1fr))}
.wh .wh-fila legend{font-weight:700;font-size:.84rem;padding:0 4px}
.wh .wh-fila label{display:flex;flex-direction:column;gap:2px;font-size:.84rem}
.wh .wh-fila input,.wh .wh-fila select{font-size:16px;min-height:36px;padding:4px 6px;border:1px solid var(--line);border-radius:4px;background:var(--paper);color:var(--ink);min-width:0}
.wh .wh-fila input:disabled{opacity:.6}
.wh .wh-prev{display:flex;align-items:center;justify-content:center;min-height:90px}
.wh .wh-prev i{display:block;background:#fff;border:1px solid #333;box-shadow:1px 1px 0 #999}
.wh .wh-msg{position:absolute;inset:0;background:rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;padding:10px;z-index:3}
.wh .wh-msg>div{max-width:360px;background:#fff;color:#111;border:1px solid #8A94A3;border-radius:6px;box-shadow:0 10px 30px rgba(0,0,0,.3);padding:12px 14px}
.wh .wh-msg b{display:block;color:#1F5BB5;font-size:1rem;margin-bottom:6px}
.wh .wh-msg p{margin:0 0 10px;font-size:.9rem;display:flex;gap:8px}
.wh .wh-msg .wo-bt{float:right}
.wh .wh-msg .ro{display:block;clear:both;font-size:.78rem;color:#555;padding-top:6px}
.wh .wh-foaie{position:relative;margin:0 auto;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.28);overflow:hidden;color:#111}
.wh .wh-ghid{position:absolute;border:1px dashed #9DB7E0;pointer-events:none}
.wh .wh-corp{position:absolute;overflow:hidden}
.wh .wh-corp p{margin:0;white-space:normal;overflow-wrap:anywhere}
.wh .wp-mn .wh-mv{display:block;font-size:.72rem;color:var(--ink2);line-height:1.25}
.wh .wh-pg{flex:0 0 auto;border:1px solid #8A94A3;background:#fff}
/* 2. numele vizibile pe Margins / Orientation / Size în panglica lui wordpag (fără să-i schimbăm pozițiile) */
.wp .wo-rb .pg-b.wh-cu-et{flex-direction:column;justify-content:flex-start;padding-top:2px;overflow:visible}
.wp .wo-rb .wh-et2{font-size:8px;line-height:1;white-space:nowrap;display:block;margin-top:1px}
.wp .wo-rb .pg-b.wh-cu-et .pg-et{display:none}   /* Orientation avea deja eticheta, strivită la 3 px: rămâne doar a noastră */
.wp .wh-sizep{border:1px solid var(--line);border-top:0;background:var(--paper);padding:6px 8px}
.wp .wh-sizep .wh-sizemsg{margin:6px 0 0;padding:6px 8px;border-radius:6px;background:var(--sel);font-size:.86rem}
/* 3. telefon, wordfmt: butoanele mari pentru casetele Font și Font Size */
.wf .wh-prox{display:flex;gap:8px;flex-wrap:wrap;padding:6px 6px 2px}
.wf .wh-prox button{flex:1 1 140px;min-height:44px;border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink);font:inherit;font-size:.9rem;cursor:pointer;text-align:left;padding:4px 10px}
.wf .wh-prox button b{font-weight:700}
@media (pointer:coarse){.wf .wo-rb .wf-lst button{min-height:36px;min-width:40px}}
`;
function stil(){if(typeof document==='undefined'||document.getElementById('wordhartie-css'))return;const s=document.createElement('style');s.id='wordhartie-css';s.textContent=CSS;document.head.appendChild(s)}
function ico(nume,m){const PW=G.PANGLICA_WORD,ic=PW&&PW.icoane&&PW.icoane[nume];return ic?`<svg viewBox="0 0 20 20" width="${m}" height="${m}" aria-hidden="true" focusable="false">${ic.map(d=>`<path d="${d}"/>`).join('')}</svg>`:''}

/* ---------------- 1. TipWordHartie ---------------- */
function render(Q,body,api){
  stil();
  const PW=G.PANGLICA_WORD,UP=G.UiPanglica,real=!!(PW&&UP);
  let doc=mk(Q.start),hist=[],refa=[],fila=Q.fila||'TabHome',meniu=null,dlg=null;
  body.innerHTML=`<div class="wo wp wh">
    <div class="wo-rb" role="toolbar" aria-label="Panglica din Word"></div>
    <p class="hint wo-leg">Panglica din Word, în engleză: <b>Home</b> = Pornire, <b>Insert</b> = Inserare, <b>Layout</b> = Aspect. Pe telefon, filele și panglica se derulează în lateral.</p>
    <div class="wo-dlg"></div>
    <div class="wp-pag"><div class="wh-foaie" tabindex="0" role="document" aria-label="Pagina documentului Word simulat"><div class="wh-ghid" aria-hidden="true"></div><div class="wh-corp"></div></div></div>
    <div class="wp-stare"><span class="wp-info" aria-live="polite"></span></div>
    <div class="wo-kbd"><span class="wo-kl">Tastele</span>
      <button type="button" class="wo-k" data-k="z" aria-label="Ctrl+Z, anulează ultima operație">Ctrl+Z</button>
      <button type="button" class="wo-k" data-k="y" aria-label="Ctrl+Y, reface operația anulată">Ctrl+Y</button>
      <span class="hint wo-kh">Pe calculator merg și tastele adevărate. Linia punctată arată marginile (în Word nu se vede).</span></div>
    <p class="wo-nota" aria-live="polite"></p>
    <ul class="wo-teste" aria-label="Testele sarcinii"></ul>
    <div class="wo-jos"><span class="hint">Aici schimbi doar foaia: mărimea, orientarea și marginile. Textul nu se scrie.</span>
      <button type="button" class="btn ghost sm" data-k="reset">Ia-o de la capăt</button></div>
  </div>`;
  const $=s=>body.querySelector(s),rbEl=$('.wo-rb'),dlgEl=$('.wo-dlg'),pagEl=$('.wp-pag'),foaie=$('.wh-foaie'),corp=$('.wh-corp'),ghid=$('.wh-ghid'),
    infoEl=$('.wp-info'),notaEl=$('.wo-nota'),testEl=$('.wo-teste');
  const spune=h=>{notaEl.innerHTML=h||''};
  const snap=()=>{hist.push(JSON.stringify(doc));if(hist.length>100)hist.shift();refa=[]};
  function anuleaza(){if(!hist.length){spune('Nu mai e nimic de anulat.');return}refa.push(JSON.stringify(doc));doc=JSON.parse(hist.pop())}
  function reface(){if(!refa.length){spune('Nu e nimic de refăcut.');return}hist.push(JSON.stringify(doc));doc=JSON.parse(refa.pop())}

  /* ---- pagina ---- */
  function drawDoc(){
    const av=Math.max(200,(pagEl.clientWidth||340)-24),Z=Math.min(av/doc.lat,420/doc.inalt,26);
    const [s,j,st,dr]=doc.m,px=cm=>(cm*Z).toFixed(1)+'px';
    foaie.style.width=px(doc.lat);foaie.style.height=px(doc.inalt);
    const tw=Math.max(0,doc.lat-st-dr),th=Math.max(0,doc.inalt-s-j);
    for(const el of [ghid,corp]){el.style.left=px(st);el.style.top=px(s);el.style.width=px(tw);el.style.height=px(th)}
    corp.innerHTML=doc.bl.map(b=>{const f=FONT_CSS[b.font]||FONT_CSS.Calibri,sz=(b.sz||11)/PT*Z;
      return `<p style="font-family:${f};font-size:${sz.toFixed(2)}px;line-height:1.2;margin-bottom:${(8/PT*Z).toFixed(1)}px;text-align:${b.al||'left'};${b.b?'font-weight:700;':''}${b.i?'font-style:italic;':''}${b.col?'color:#'+b.col+';':''}">${esc(b.t)}</p>`}).join('');
    const n=numeHartie(doc.lat,doc.inalt);
    infoEl.innerHTML=`<span class="hint">Simulatorul îți arată:</span> foaia <b>${nr(doc.lat)} × ${cmTxt(doc.inalt)}</b> (${esc(n)}, ${orDin(doc)==='vedere'?'Landscape':'Portrait'}) · margini sus / jos / stânga / dreapta <b>${[s,j,st,dr].map(nr).join(' / ')} cm</b> · între margini ${nr(tw)} × ${cmTxt(th)}`;
  }
  function drawTeste(){testEl.innerHTML=testeaza(Q,doc).map(t=>`<li class="${t.ok?'ok':''}"><span class="ic" aria-hidden="true">${t.ok?'✔':'○'}</span><span>${esc(t.ce)}${t.ok?'<span class="sr-only"> — gata</span>':''}</span></li>`).join('')}

  /* ---- panglica ---- */
  const mare=(w,idm,en,ro)=>`<button type="button" class="wh-mare" data-wh="${w}" title="${ro} (${en})" aria-label="${en} (${ro})" aria-expanded="${meniu===w}">${ico(idm,24)}<span class="wh-et">${en}</span><span class="wh-sag" aria-hidden="true">▾</span></button>`;
  function fileLatite(){   // grupul Page Setup, cu butoanele mari mai late, ca numele să încapă (pozițiile relative din Word)
    return PW.file.map(f=>f.id!=='TabPageLayoutWord'?f:Object.assign({},f,{grupuri:f.grupuri.map(g=>{
      if(g.eticheta!=='Page Setup')return g;
      const lat={PageMarginsGallery:[8,62],PageOrientationGallery:[72,84],PageSizeGallery:[158,52],TableColumnsGallery:[212,62]},dx=64;
      return Object.assign({},g,{latime:g.latime+dx,butoane:g.butoane.map(b=>{const r=b.rect.slice();
        if(lat[b.id]){r[0]=lat[b.id][0];r[2]=lat[b.id][1]}else r[0]+=dx;return Object.assign({},b,{rect:r})})})})}))}
  function meniuMargini(){
    const btn=([n,v])=>`<button type="button" data-wh-marg="${n}" class="${v.every((x,i)=>aproape(x,doc.m[i]))?'on':''}"><span class="wp-mg" aria-hidden="true"><i style="left:${v[2]*2}%;right:${v[3]*2}%;top:${v[0]*1.6}%;bottom:${v[1]*1.6}%"></i></span><span><b>${n}</b><span class="wp-mv">Top: ${cmTxt(v[0])} Bottom: ${cmTxt(v[1])}<br>Left: ${cmTxt(v[2])} Right: ${cmTxt(v[3])}</span></span></button>`;
    return `<div class="wp-mn" role="menu">${MARGINI.map(btn).join('')}<p class="hint" style="margin:2px 0">În Word lista are și Mirrored (nu e în simulator).</p><hr><button type="button" data-wh="dlg-marg"><span>Custom Margins...<span class="wo-ro">Margini particularizate</span></span></button></div>`}
  function meniuOrientare(){return `<div class="wp-mn" role="menu">${[['portret','Portrait','Portret'],['vedere','Landscape','Vedere']].map(([k,en,ro])=>`<button type="button" data-wh-or="${k}" class="${orDin(doc)===k?'on':''}"><svg class="wp-ic" viewBox="0 0 26 22" aria-hidden="true">${k==='portret'?'<rect x="8" y="1" width="11" height="15" fill="#fff" stroke="#5E6670"/>':'<rect x="5" y="4" width="16" height="11" fill="#fff" stroke="#5E6670"/>'}</svg><span>${en}<span class="wo-ro">${ro}</span></span></button>`).join('')}</div>`}
  function meniuMarime(){const n=numeHartie(doc.lat,doc.inalt);
    return `<div class="wp-mn" role="menu">${HARTII.map(([h,w,hh],i)=>`<button type="button" data-wh-size="${i}" class="${n===h?'on':''}"><span class="wh-pg" aria-hidden="true" style="width:${(w*0.9).toFixed(1)}px;height:${(hh*0.9).toFixed(1)}px"></span><span><b>${esc(h)}</b><span class="wh-mv">${nr(w)} cm x ${nr(hh)} cm</span></span></button>`).join('')}
      <p class="hint" style="margin:2px 0">Lista vine de la imprimantă: pe alt calculator poate avea alte nume, iar în Word continuă mai jos.</p><hr>
      <button type="button" data-wh="dlg-paper"><span>More Paper Sizes...<span class="wo-ro">mai multe mărimi de hârtie</span></span></button></div>`}
  function drawRb(){
    if(!real){rbEl.innerHTML='<p class="hint" style="margin:6px">Panglica nu s-a încărcat. Reîncarcă pagina.</p>';return}
    UP.stil();
    const L={
      PageMarginsGallery:{title:'Margini (Margins)',html:mare('m-marg','PageMarginsGallery','Margins','Margini')},
      PageOrientationGallery:{title:'Orientare (Orientation)',html:mare('m-or','PageOrientationGallery','Orientation','Orientare')},
      PageSizeGallery:{title:'Dimensiune (Size): mărimea foii',html:mare('m-size','PageSizeGallery','Size','Dimensiune')},
      PageSetupDialog:{attr:'data-wh="dlg-lans"',title:'Page Setup... (Inițializare pagină)'}};
    const men={},m={'m-marg':['PageMarginsGallery',meniuMargini],'m-or':['PageOrientationGallery',meniuOrientare],'m-size':['PageSizeGallery',meniuMarime]}[meniu];
    if(m)men[m[0]]=m[1]();
    rbEl.innerHTML=UP.html({aplicatie:'word',file:fileLatite(),icoane:PW.icoane},{fila,legaturi:L,meniu:men});
  }

  /* ---- fereastra Page Setup ---- */
  function deschideDlg(fl){meniu=null;dlg={fila:fl,lat:cmTxt(doc.lat),inalt:cmTxt(doc.inalt),m:doc.m.map(cmTxt),hartie:numeHartie(doc.lat,doc.inalt),mesaj:null,focus:null};draw()}
  const dlgNum=()=>({lat:masura(dlg.lat),inalt:masura(dlg.inalt),m:dlg.m.map(masura)});
  function dlgOr(){const v=dlgNum();return v.lat>0&&v.inalt>0?(v.lat>v.inalt?'vedere':'portret'):orDin(doc)}
  function drawDlg(){
    if(!dlg){dlgEl.innerHTML='';return}
    const or=dlgOr(),v=dlgNum();
    let fl='';
    if(dlg.fila==='marg')fl=`<fieldset><legend>Margins</legend>${LAT.map((k,i)=>`<label>${k}: <input type="text" data-whm="${i}" value="${esc(dlg.m[i])}" inputmode="decimal" autocomplete="off" spellcheck="false" aria-label="${k} (marginea de ${LAT_RO[i]})"></label>`).join('')}
        <label>Gutter: <input value="0 cm" disabled></label></fieldset>
      <fieldset><legend>Orientation</legend><div class="wp-or">${[['portret','Portrait'],['vedere','Landscape']].map(([k,en])=>`<button type="button" data-wh-dor="${k}" class="${or===k?'on':''}" aria-pressed="${or===k}"><svg class="wp-ic" viewBox="0 0 26 22" aria-hidden="true">${k==='portret'?'<rect x="8" y="1" width="11" height="15" fill="#fff" stroke="#5E6670"/>':'<rect x="5" y="4" width="16" height="11" fill="#fff" stroke="#5E6670"/>'}</svg>${en}</button>`).join('')}</div></fieldset>`;
    else if(dlg.fila==='paper'){const pv=v.lat>0&&v.inalt>0?[v.lat,v.inalt]:[doc.lat,doc.inalt],k=70/Math.max(pv[0],pv[1]);
      fl=`<fieldset><legend>Paper size</legend><label>Paper size: <select data-wh-ps aria-label="Paper size (mărimea hârtiei)">${(dlg.hartie===''?'<option value="" selected></option>':'')}${HARTII.map(h=>`<option${dlg.hartie===h[0]?' selected':''}>${esc(h[0])}</option>`).join('')}<option${dlg.hartie==='Custom size'?' selected':''}>Custom size</option></select></label>
        <label>Width: <input type="text" data-whd="lat" value="${esc(dlg.lat)}" inputmode="decimal" autocomplete="off" spellcheck="false" aria-label="Width (lățimea foii)"></label>
        <label>Height: <input type="text" data-whd="inalt" value="${esc(dlg.inalt)}" inputmode="decimal" autocomplete="off" spellcheck="false" aria-label="Height (înălțimea foii)"></label></fieldset>
        <div class="wh-prev" aria-hidden="true"><i style="width:${(pv[0]*k).toFixed(1)}px;height:${(pv[1]*k).toFixed(1)}px"></i></div>
        <p class="hint" style="margin:0">Paper source și Print Options... din Word nu sunt în simulator.</p>`}
    else fl='<p class="hint" style="margin:0">Fila Layout a ferestrei (secțiuni, antet și subsol) nu e în simulator.</p>';
    dlgEl.innerHTML=`<div class="wo-win wh-win" role="dialog" aria-label="Fereastra Page Setup (Inițializare pagină)">
      <div class="wo-wt"><span>Page Setup</span><button type="button" data-whx="1" aria-label="Închide fereastra (Cancel)">✕</button></div>
      <div class="wh-tabs" role="tablist">${[['marg','Margins'],['paper','Paper'],['layout','Layout']].map(([k,n])=>`<button type="button" role="tab" data-wh-tab="${k}" aria-selected="${dlg.fila===k}">${n}</button>`).join('')}</div>
      <div class="wh-fila">${fl}</div>
      <div class="wo-wb"><button type="button" class="wo-bt pr" data-whok="1">OK</button><button type="button" class="wo-bt" data-whx="1">Cancel</button></div>
      ${dlg.mesaj?`<div class="wh-msg" role="alertdialog" aria-label="Microsoft Word"><div><b>Microsoft Word</b><p><span aria-hidden="true">⚠</span><span>${esc(dlg.mesaj)}</span></p><button type="button" class="wo-bt pr" data-wh-msgok="1">OK</button><span class="ro">${esc(dlg.mesajRo||'')}</span></div></div>`:''}
    </div>`;
    if(dlg.mesaj){const b=dlgEl.querySelector('[data-wh-msgok]');if(b)b.focus({preventScroll:true})}
    else if(dlg.focus){const i=dlgEl.querySelector(dlg.focus),tot=dlg.selTot;dlg.focus=null;dlg.selTot=false;
      if(i){i.focus({preventScroll:true});try{if(tot)i.select();else i.setSelectionRange(i.value.length,i.value.length)}catch(_){}}}   // ca Word: după mesajul de măsură greșită, tot textul casetei e selectat
  }
  function mesaj(txt,ro,focus){dlg.mesaj=txt;dlg.mesajRo=ro;dlg.dupaMesaj=focus||null;dlg.dupaSel=txt===M_MASURA;drawDlg()}
  function inchideMesaj(){const f=dlg.dupaMesaj;dlg.mesaj=null;dlg.focus=f;dlg.selTot=!!dlg.dupaSel;drawDlg()}
  function campuriFila(fl){return fl==='marg'?dlg.m.map((t,i)=>({t,sel:`[data-whm="${i}"]`})):fl==='paper'?[{t:dlg.lat,sel:'[data-whd="lat"]'},{t:dlg.inalt,sel:'[data-whd="inalt"]'}]:[]}
  function primulRau(fl){return campuriFila(fl).find(c=>{const v=masura(c.t);return fl==='marg'?!(v>=0):!(v>0)})}   // marginea poate fi 0; foaia nu
  const RO_MASURA='(în română: „Asta nu e o măsură bună.” După OK, tot ce scrie în casetă e selectat: scrie direct doar numărul, de exemplu 9 sau 0,5.)';
  function okDlg(){
    for(const fl of ['marg','paper']){const r=primulRau(fl);if(r){dlg.fila=fl;mesaj(M_MASURA,RO_MASURA,r.sel);return false}}
    const v=dlgNum();
    if(v.lat>55.87||v.inalt>55.87){mesaj('Mărimea foii e prea mare.','(simulatorul: în Word foaia are cel mult 55,87 cm)','[data-whd="lat"]');return false}
    if(v.inalt-v.m[0]-v.m[1]<PRAG_TEXT){mesaj(M_SUS_JOS,'(în română: marginile de sus și de jos sunt prea mari pentru înălțimea foii. Apasă OK, apoi fila Margins.)',null);return false}
    if(v.lat-v.m[2]-v.m[3]<PRAG_TEXT){mesaj(M_ST_DR,'(în română: marginile din stânga și din dreapta sunt prea mari pentru lățimea foii. Apasă OK, apoi fila Margins.)',null);return false}
    const nou={lat:Math.round(v.lat*1000)/1000,inalt:Math.round(v.inalt*1000)/1000,m:v.m.map(x=>Math.round(x*1000)/1000)};
    if(!(aproape(nou.lat,doc.lat)&&aproape(nou.inalt,doc.inalt)&&nou.m.every((x,i)=>aproape(x,doc.m[i])))){snap();doc.lat=nou.lat;doc.inalt=nou.inalt;doc.m=nou.m}
    dlg=null;return true}
  /* Width / Height după Tab sau clic în altă parte: Paper size arată mărimea potrivită, Custom size, sau nimic (măsură greșită) */
  function dupaCampHartie(){const v=dlgNum();dlg.hartie=v.lat>0&&v.inalt>0?numeHartie(v.lat,v.inalt):''}

  function draw(){drawRb();drawDlg();drawDoc();drawTeste()}

  /* ---- clicuri ---- */
  body.addEventListener('click',e=>{
    if(api.done())return;
    const k=e.target.closest('[data-k]');
    if(k&&body.contains(k)){spune('');const w=k.dataset.k;
      if(w==='z')anuleaza();else if(w==='y')reface();else if(w==='reset'){doc=mk(Q.start);hist=[];refa=[];meniu=null;dlg=null;fila=Q.fila||'TabHome';spune('Documentul e din nou ca la început.')}
      draw();return}
    const b=e.target.closest('button');if(!b||!body.contains(b))return;
    if(dlg&&dlg.mesaj&&!b.dataset.whMsgok)return;   // fereastra de mesaj a lui Word e „modală”
    if(b.dataset.whMsgok){inchideMesaj();return}
    if(b.dataset.tab){fila=b.dataset.tab;meniu=null;drawRb();if(fila!=='TabPageLayoutWord')spune('În exercițiul acesta lucrezi pe fila <b>Layout</b> (Aspect): Margins, Orientation și Size.');else spune('');return}
    if(b.dataset.nesim){spune(`„${esc(b.getAttribute('aria-label')||b.dataset.nesim)}” e în Word, dar în exercițiul acesta nu-l folosim: aici lucrezi cu <b>Margins</b>, <b>Orientation</b> și <b>Size</b>, pe fila Layout (Aspect).`);return}
    const w=b.dataset.wh;
    if(w&&w.startsWith('m-')){meniu=meniu===w?null:w;spune('');drawRb();return}
    if(w==='dlg-marg'||w==='dlg-lans'){deschideDlg('marg');return}
    if(w==='dlg-paper'){deschideDlg('paper');return}
    if(b.dataset.whMarg){const v=MARGINI.find(x=>x[0]===b.dataset.whMarg)[1];meniu=null;
      if(!v.every((x,i)=>aproape(x,doc.m[i]))){if(doc.inalt-v[0]-v[1]<PRAG_TEXT||doc.lat-v[2]-v[3]<PRAG_TEXT)spune('Marginile acestea sunt prea mari pentru foaia asta.');else{snap();doc.m=v.slice()}}draw();return}
    if(b.dataset.whOr){meniu=null;if(b.dataset.whOr!==orDin(doc)){snap();roteste(doc,b.dataset.whOr)}draw();return}
    if(b.dataset.whSize!=null){const h=HARTII[+b.dataset.whSize];meniu=null;const cul=orDin(doc)==='vedere',lat=cul?h[2]:h[1],inalt=cul?h[1]:h[2];
      if(!(aproape(lat,doc.lat)&&aproape(inalt,doc.inalt))){snap();doc.lat=lat;doc.inalt=inalt}draw();return}
    if(!dlg)return;
    if(b.dataset.whx){dlg=null;draw();return}
    if(b.dataset.whTab){const t=b.dataset.whTab;if(t===dlg.fila)return;
      const r=primulRau(dlg.fila);if(r){mesaj(M_MASURA,RO_MASURA,r.sel);return}
      if(dlg.fila==='paper')dupaCampHartie();dlg.fila=t;drawDlg();return}
    if(b.dataset.whDor){const cur=dlgOr();if(b.dataset.whDor===cur)return;
      const v=dlgNum();if(!(v.lat>0&&v.inalt>0)||v.m.some(x=>!(x>0||x===0))){const r=primulRau('marg')||primulRau('paper');mesaj(M_MASURA,RO_MASURA,r&&r.sel);return}
      const t={lat:v.lat,inalt:v.inalt,m:v.m};roteste(t,b.dataset.whDor);dlg.lat=cmTxt(t.lat);dlg.inalt=cmTxt(t.inalt);dlg.m=t.m.map(cmTxt);dlg.hartie=numeHartie(t.lat,t.inalt);drawDlg();return}
    if(b.dataset.whok){if(okDlg()){draw()}return}
  });
  body.addEventListener('input',e=>{if(!dlg)return;const i=e.target;
    if(i.dataset.whm!=null)dlg.m[+i.dataset.whm]=i.value;else if(i.dataset.whd)dlg[i.dataset.whd]=i.value});
  body.addEventListener('change',e=>{if(!dlg)return;const i=e.target;
    if(i.dataset.whd){dlg[i.dataset.whd]=i.value;dupaCampHartie();const s=dlgEl.querySelector('[data-wh-ps]');
      if(s){if(dlg.hartie===''){if(!s.querySelector('option[value=""]'))s.insertAdjacentHTML('afterbegin','<option value=""></option>');s.value=''}else s.value=dlg.hartie}
      const p=dlgEl.querySelector('.wh-prev i'),v=dlgNum();if(p&&v.lat>0&&v.inalt>0){const k=70/Math.max(v.lat,v.inalt);p.style.width=(v.lat*k).toFixed(1)+'px';p.style.height=(v.inalt*k).toFixed(1)+'px'}return}
    if(i.dataset.whPs!=null){const h=HARTII.find(x=>x[0]===i.value);if(!h){dlg.hartie=i.value;return}
      const cul=dlgOr()==='vedere';dlg.lat=cmTxt(cul?h[2]:h[1]);dlg.inalt=cmTxt(cul?h[1]:h[2]);dlg.hartie=h[0];dlg.focus='[data-wh-ps]';drawDlg()}});
  body.addEventListener('keydown',e=>{
    if(api.done())return;
    if(dlg){if(e.key==='Escape'){e.preventDefault();if(dlg.mesaj){inchideMesaj()}else{dlg=null;draw()}return}
      if(e.key==='Enter'&&e.target.closest('.wh-win')&&!e.target.closest('button')){e.preventDefault();
        if(dlg.mesaj){inchideMesaj();return}
        const i=e.target;if(i.dataset&&i.dataset.whd){dlg[i.dataset.whd]=i.value;dupaCampHartie()}
        if(okDlg())draw();return}
      return}
    const ctrl=(e.ctrlKey||e.metaKey)&&!e.altKey,kl=e.key.length===1?e.key.toLowerCase():e.key;
    if(e.target.closest('input,select'))return;
    if(ctrl&&kl==='z'){e.preventDefault();anuleaza();draw()}else if(ctrl&&kl==='y'){e.preventDefault();reface();draw()}
    else if(e.key==='Escape'&&meniu){meniu=null;drawRb()}});
  if(typeof ResizeObserver!=='undefined'){let rw=0;new ResizeObserver(()=>{const w=pagEl.clientWidth;if(w&&Math.abs(w-rw)>1){rw=w;drawDoc()}}).observe(pagEl)}

  const nav=api.checkButton(()=>{
    meniu=null;if(dlg&&!dlg.mesaj){dlg=null}draw();
    const T=testeaza(Q,doc),bad=T.filter(t=>!t.ok);
    if(!bad.length){nav.innerHTML='';api.resolve(true);return}
    api.resolve(false,`${T.length-bad.length} din ${T.length} teste trecute. ${bad[0].cum}`);
    foaie.focus({preventScroll:true});
    api.revealButton(()=>{doc=solutie(Q);hist=[];refa=[];dlg=null;meniu=null;draw();nav.innerHTML='';
      api.giveUp('foaia arată acum ca în sarcină. Uită-te ce s-a schimbat față de a ta.')});
  });
  body._wh={set:d=>{doc=d;hist=[];refa=[];meniu=null;dlg=null;draw()},stare:()=>({doc:clone(doc),fila,meniu,dlg:dlg?clone(dlg):null})};
  draw();
}
const TipWordHartie={
  render,
  rezolva(Q,body){body._wh.set(solutie(Q))},
  gresit(Q,body){body._wh.set(gresitDoc(Q))},
  teste:testeaza,solutie,gresitDoc,masura,numeHartie,roteste,HARTII,M_MASURA,M_SUS_JOS,M_ST_DR
};
G.TipWordHartie=TipWordHartie;

/* ---------------- 2 + 3. panglicile celorlalte simulatoare, doar pe pagina care încarcă fișierul ---------------- */
if(typeof document!=='undefined'){
  stil();
  const NUME_WP={'m-marg':'Margins','m-or':'Orientation'};
  const gros=()=>matchMedia('(pointer:coarse)').matches;
  function etichete(){
    document.querySelectorAll('.wp:not(.wh) .wo-rb [data-wp="m-marg"],.wp:not(.wh) .wo-rb [data-wp="m-or"],.wp:not(.wh) .wo-rb [data-nesim="PageSizeGallery"]').forEach(b=>{
      if(b.querySelector('.wh-et2'))return;
      b.classList.add('wh-cu-et');b.insertAdjacentHTML('beforeend',`<span class="wh-et2">${b.dataset.wp?NUME_WP[b.dataset.wp]:'Size'}</span>`)})}
  function prox(){
    if(!gros())return;
    document.querySelectorAll('.wf').forEach(root=>{const rb=root.querySelector('.wo-rb');if(!rb)return;
      const f=rb.querySelector('[data-wf="m-font"]'),m=rb.querySelector('[data-wf="m-marime"]');
      let p=root.querySelector(':scope > .wh-prox');
      if(!f||!m){if(p)p.hidden=true;return}
      if(!p){rb.insertAdjacentHTML('afterend','<div class="wh-prox" role="group" aria-label="Casetele Font și Font Size din panglică, mai mari (pe telefon)"><button type="button" data-wh-prox="m-font"></button><button type="button" data-wh-prox="m-marime"></button></div>');p=root.querySelector(':scope > .wh-prox')}
      p.hidden=false;
      const vf=(f.getAttribute('aria-label')||'').replace(/^Font:\s*/,''),vm=(m.getAttribute('aria-label')||'').replace(/^Font Size:\s*/,'');
      const tf=`Caseta <b>Font</b>: ${esc(vf==='mai multe'?'(goală)':vf)} ▾`,tm=`Caseta de mărime (<b>Font Size</b>): ${esc(vm==='mai multe'?'(goală)':vm)} ▾`;
      const bf=p.querySelector('[data-wh-prox="m-font"]'),bm=p.querySelector('[data-wh-prox="m-marime"]');
      if(bf.innerHTML!==tf)bf.innerHTML=tf;if(bm.innerHTML!==tm)bm.innerHTML=tm})}
  let asteapta=false;
  new MutationObserver(()=>{if(asteapta)return;asteapta=true;requestAnimationFrame(()=>{asteapta=false;etichete();prox()})}).observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('click',e=>{
    const px=e.target.closest&&e.target.closest('.wh-prox [data-wh-prox]');
    if(px){const root=px.closest('.wf'),b=root&&root.querySelector(`.wo-rb [data-wf="${px.dataset.whProx}"]`);
      if(b){b.click();requestAnimationFrame(()=>{const j=root.querySelector('.wo-rb .pg-jos');if(j)j.scrollIntoView({block:'nearest'})})}return}
    const sz=e.target.closest&&e.target.closest('.wp:not(.wh) .wo-rb [data-nesim="PageSizeGallery"]');
    const ales=e.target.closest&&e.target.closest('.wh-sizep [data-wh-psz]');
    const inch=e.target.closest&&e.target.closest('.wh-sizep [data-wh-pinch]');
    if(!sz&&!ales&&!inch)return;
    e.stopPropagation();e.preventDefault();
    const root=(sz||ales||inch).closest('.wp');
    let p=root.querySelector(':scope > .wh-sizep');
    const MSG='În exercițiul acesta foaia rămâne <b>A4</b>: aici exersezi doar ce cere sarcina. Mărimea foii o schimbi în exercițiile din pasul 3 (acolo Size merge) și în Word-ul adevărat.';
    if(inch||(sz&&p)){if(p)p.remove();return}
    if(ales){const m=p.querySelector('.wh-sizemsg');const n=ales.dataset.whPsz;m.innerHTML=(n==='A4'?'Foaia e deja <b>A4</b>. ':'')+MSG;return}
    const rb=root.querySelector('.wo-rb');
    rb.insertAdjacentHTML('afterend',`<div class="wh-sizep" role="menu" aria-label="Size (Dimensiune): mărimea foii"><div class="wp-mn">${HARTII.map(([h,w,hh])=>`<button type="button" data-wh-psz="${esc(h)}" class="${h==='A4'?'on':''}"><span><b>${esc(h)}</b><span class="wp-mv">${nr(w)} cm x ${nr(hh)} cm</span></span></button>`).join('')}
      <hr><button type="button" data-wh-psz="more"><span>More Paper Sizes...<span class="wo-ro">mai multe mărimi de hârtie</span></span></button><button type="button" data-wh-pinch="1">Închide lista</button></div><p class="wh-sizemsg">${MSG}</p></div>`);
  },true);
}
if(typeof module!=='undefined'&&module.exports)module.exports=TipWordHartie;
})(typeof window!=='undefined'?window:globalThis);
