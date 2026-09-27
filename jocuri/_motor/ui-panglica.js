/* ui-panglica.js — panglica Office desenată din DATE (26.09.2026). Nu conține nicio comandă scrisă de mână.

   Date: panglica-<app>.json, generat de _cercetare/office_comenzi/panglica_build.py din aplicația INSTALATĂ (dump UI
   Automation: file, grupuri, butoane, etichete, poziții reale) + lista oficială Microsoft (tipul controlului), cu icoane
   Fluent UI (MIT) puse de icoane_build.py. Etichetele rămân în engleză, ca în Office-ul din laborator; traducerea stă în
   `title` (sfatul de la mouse), ca în restul jocurilor („Aldin (Bold) · Ctrl+B”).

   UiPanglica.html(date, opt) -> HTML-ul panglicii, cu opt:
     fila      : id-ul filei active („TabHome”…)
     taburi    : {TabHome:'home', …} valoarea din data-tab (simulatorul le știe după nume scurte)
     legaturi  : {idMso: {attr:'data-rb="b"', title:'Aldin (Bold) · Ctrl+B', html?:'<select …>'}} — butoanele care
                 fac ceva în simulator. Restul se văd, cu aspectul real, și primesc data-nesim (simulatorul spune
                 pe ecran că acolo nu face nimic, în loc să pară stricat).
     meniu     : {id: html} — conținutul meniului deschis sub un buton (ex. culorile de umplere)
     inainte   : HTML pus înaintea filelor (bara Acces rapid)
   Proporțiile: pozițiile din dump (pixeli fizici, ~150%) înmulțite cu SCARA; pe ecran îngust panglica se derulează
   în lateral (Excel ar strânge grupurile în butoane — abatere spusă pe ecran de simulator). */
(function(){
'use strict';
const SCARA=0.667;
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const px=n=>Math.round(n*SCARA)+'px';
// butoanele fără icoană Fluent potrivită: simbolul de pe butonul din Excel, altfel inițiala etichetei
const GLIFE={PercentStyle:'%',TextDirectionLeftToRight:'¶→'};
function svg(cai,m){return cai?`<svg viewBox="0 0 20 20" width="${m}" height="${m}" aria-hidden="true" focusable="false">${cai.map(d=>`<path d="${d}"/>`).join('')}</svg>`:''}
function buton(b,date,opt){
  const L=(opt.legaturi||{})[b.id],ic=(date.icoane||{})[b.id],[x,y,w,h]=b.rect;
  const pos=`left:${px(x)};top:${px(y)};width:${px(w)};height:${px(h)}`;
  const tit=esc(L&&L.title?L.title:b.eticheta);
  if(L&&L.html)return `<span class="pg-b pg-camp" style="${pos}" title="${tit}">${L.html}</span>`;
  const attr=L?L.attr:`data-nesim="${esc(b.id)}"`;
  const arata=b.marime==='mare'||(w>=60&&b.tip_uia!=='ComboBox');   // Excel scrie eticheta doar pe butoanele late
  let corp;
  if(b.lansator)corp=`<span class="pg-lans" aria-hidden="true"></span>`;
  else if(b.tip_uia==='ComboBox')corp=`<span class="pg-cb">${b.id==='FontSize'?'11':''}</span><span class="pg-sag">▾</span>`;
  else if(b.marime==='mare')corp=`${svg(ic,26)||''}<span class="pg-et">${esc(b.eticheta)}${b.split||b.meniu?' ▾':''}</span>`;
  else corp=`${svg(ic,16)||(arata?'':`<span class="pg-txt">${esc(GLIFE[b.id]||b.eticheta.charAt(0))}</span>`)}${arata?`<span class="pg-et">${esc(b.eticheta)}</span>`:''}${b.split||b.meniu?'<span class="pg-sag">▾</span>':''}`;
  const m=(opt.meniu||{})[b.id];
  // b.galerie = o dală dintr-o galerie (o tranziție, un stil, o temă); L.clasa = starea dată de simulator (ex. „on”)
  return `<span class="pg-slot${b.lansator?' pg-slot-lans':''}" style="${pos}"><button type="button" class="pg-b ${b.marime==='mare'?'pg-mare':''} ${b.galerie?'pg-dala':''} ${L?'':'pg-nesim'} ${m?'pg-deschis':''} ${L&&L.clasa?esc(L.clasa):''}" ${attr} title="${tit}" aria-label="${esc(b.eticheta)}"${m?' aria-expanded="true"':''}>${corp}</button></span>`;
}
function html(date,opt){
  opt=opt||{};
  const f=date.file.find(x=>x.id===opt.fila)||date.file[0],tb=opt.taburi||{};
  // opt.atribFila(cheie) = atributul filei pentru simulatoarele care nu folosesc data-tab (PowerPoint: data-t="tab-…")
  const atF=k=>opt.atribFila?opt.atribFila(k):`data-tab="${esc(k)}"`;
  const file=date.file.map(x=>`<button type="button" ${atF(tb[x.id]||x.id)} class="${x===f?'on':''}" role="tab" aria-selected="${x===f}">${esc(x.eticheta)}</button>`).join('');
  const gr=f.grupuri.map(g=>`<div class="pg-grup" role="group" aria-label="${esc(g.eticheta)}" style="width:${px(g.latime)};height:${px(g.inaltime)}">
    ${g.butoane.map(b=>buton(b,date,opt)).join('')}<div class="pg-nume">${esc(g.eticheta)}</div></div>`).join('');
  return `<div class="rb pg" data-aplicatie="${esc(date.aplicatie)}"><div class="tabs" role="tablist">${opt.inainte||''}${opt.fisier||'<span class="pg-fisier">File</span>'}${file}</div><div class="pg-banda">${opt.bandaInlocuita||gr}</div>`+
    // meniul deschis stă SUB bandă: banda se derulează lateral, deci ar tăia orice iese din ea
    Object.entries(opt.meniu||{}).map(([id,m])=>{const b=f.grupuri.flatMap(g=>g.butoane).find(x=>x.id===id);
      return b?`<div class="pg-jos"><div class="pg-jos-t">${esc(b.eticheta)} ▾</div><div class="m">${m}</div></div>`:''}).join('')+
    `<div class="pg-ingust">Pe ecran îngust, panglica se derulează în lateral. În aplicația de pe calculator o vezi întreagă.</div>${opt.nota?`<div class="pg-nota" role="status">${opt.nota}</div>`:''}</div>`;
}
const CSS=`
.pg,.pg button,.pg select{font-family:'Segoe UI',system-ui,-apple-system,'Helvetica Neue',Arial,sans-serif}
.rb.pg .tabs button,.rb.pg .tabs .pg-fisier,.xl .rb.pg .tabs button{font-family:'Segoe UI',system-ui,-apple-system,'Helvetica Neue',Arial,sans-serif;text-decoration:none;letter-spacing:0}
.pg .pg-fisier{padding:4px 10px;color:var(--ink2);font-size:.82rem;align-self:center}
/* filele: stilul propriu (până acum îl dădea doar pagina Excel) — pe rând, fără suprapunere, derulare laterală */
.rb.pg .tabs{display:flex;align-items:flex-end;gap:2px;padding:3px 4px 0;overflow-x:auto;scrollbar-width:thin}
.rb.pg .tabs button{flex:0 0 auto;border:0;background:none;color:var(--ink2);padding:4px 9px;border-radius:4px 4px 0 0;cursor:pointer;font-size:.8rem;white-space:nowrap;min-width:0;height:auto}
.rb.pg .tabs button.on{background:var(--paper);color:var(--xlg,#217346);font-weight:600;box-shadow:inset 0 -2px 0 currentColor}
.pg .pg-banda{display:flex;align-items:stretch;overflow-x:auto;overflow-y:visible;background:var(--paper);border-top:1px solid var(--line);padding:2px 0;scrollbar-width:thin}
.pg .pg-grup{position:relative;flex:0 0 auto;border-right:1px solid var(--line)}
.pg .pg-nume{position:absolute;left:0;right:0;bottom:1px;text-align:center;font-size:.68rem;color:var(--ink2);white-space:nowrap;overflow:hidden}
.pg .pg-slot{position:absolute}
.pg .pg-slot>.pg-b,.pg .pg-camp{position:absolute;inset:0}
.pg .pg-b{display:flex;align-items:center;justify-content:center;gap:3px;border:1px solid transparent;background:none;color:var(--ink);border-radius:3px;padding:0 2px;font:inherit;font-size:.72rem;cursor:pointer;min-height:0;line-height:1.05;overflow:hidden}
.pg .pg-b:hover,.pg .pg-b:focus-visible{border-color:var(--xlg,#217346);background:var(--sel)}
.pg .pg-b svg{fill:currentColor;flex:0 0 auto}
.pg .pg-mare{flex-direction:column;justify-content:flex-start;padding-top:3px;text-align:center}
.pg .pg-mare .pg-et{white-space:normal}
.pg .pg-et{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.pg .pg-txt{font-size:.62rem;opacity:.8}
.pg .pg-sag{font-size:.6rem;opacity:.75}
.pg .pg-cb{flex:1;min-width:0;height:100%;border:1px solid var(--line);border-radius:2px;background:var(--paper);display:flex;align-items:center;padding-left:3px}
.pg .pg-camp select{width:100%;height:100%;font:inherit;font-size:.72rem;border:1px solid var(--line);border-radius:2px;background:var(--paper);color:var(--ink);padding:0 2px}
.pg .pg-lans{width:7px;height:7px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;opacity:.7}
/* săgeata mică ↘ (dialog launcher) din colțul grupului (27.09.2026, lecția VII/6): numele grupului, pus peste ea,
   îi lua clicul. Numele nu mai prinde clicuri, săgeata stă deasupra, iar pe telefon zona ei de atingere are 32 x 32 px:
   crește spre stânga (peste nume) și în jos, într-o fâșie de 12 px adăugată sub grupuri, ca să nu acopere butoanele
   de deasupra (ex. „Convert to SmartArt” din PowerPoint); săgeata rămâne desenată în colț. */
.pg .pg-nume{pointer-events:none}
.pg .pg-slot-lans{z-index:2}
@media (max-width:760px),(pointer:coarse){
  .pg .pg-banda{padding-bottom:14px}
  .pg .pg-slot-lans>.pg-b{inset:auto;right:0;bottom:-12px;width:32px;height:32px;align-items:flex-end;justify-content:flex-end;padding:0 3px 15px 0}
}
.pg .pg-nesim{opacity:.92}
.pg .pg-dala{border-color:var(--line);background:var(--paper);flex-direction:column;justify-content:flex-end;padding-bottom:2px;font-size:.66rem;white-space:normal}
.pg .pg-dala .pg-et{white-space:normal;text-align:center}
.pg .pg-on{border-color:var(--xlg,#217346);background:var(--sel);font-weight:600}
.pg .pg-gri{opacity:.45}
.pg button.pg-fisier{border:0;background:none;cursor:pointer}
.pg button.pg-fisier.on{font-weight:600;box-shadow:inset 0 -2px 0 currentColor}
.pg .pg-deschis{border-color:var(--xlg,#217346);background:var(--sel)}
.pg .pg-jos{padding:4px 6px;border-top:1px solid var(--line);background:var(--paper)}
.pg .pg-jos-t{font-size:.72rem;color:var(--ink2);margin-bottom:2px}
.pg .pg-jos .m{position:static;display:flex;flex-wrap:wrap;gap:3px;box-shadow:none}
.pg .pg-ingust{display:none;font-size:.72rem;color:var(--ink2);padding:2px 6px;border-top:1px dashed var(--line)}
@media (max-width:760px){.pg .pg-ingust{display:block}}
.pg .pg-nota{font-size:.8rem;padding:4px 8px;background:var(--sel);border-top:1px solid var(--line)}
`;
function stil(){if(document.getElementById('ui-panglica-css'))return;const s=document.createElement('style');s.id='ui-panglica-css';s.textContent=CSS;document.head.appendChild(s)}
window.UiPanglica={html,stil,SCARA};
})();
