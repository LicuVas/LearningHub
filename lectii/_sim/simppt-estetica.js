/* ======================================================================================================
   lectii/_sim/simppt-estetica.js — EXTENSIE mică a PowerPoint-ului simulat cu formatare (SimPPT + SimPPTFormatare),
   pentru lecția VI · M2 · 8 „Reguli de estetică și ergonomie. Reguli de susținere a unei prezentări”.
   PROPRIETAR: autorul lecției VI · M2 · 8. Se încarcă DUPĂ lectii/_sim/simppt.js și lectii/_sim/simppt-formatare.js.
   NU modifică simppt.js și nici simppt-formatare.js: le folosește doar prin ce expun (SimPPT._intern.CHK,
   SimPPTFormatare._intern.efText / TEME / temaDe) și prin DOM-ul pe care îl desenează. Tipul rămâne cel din lecția 6:
   tipuri:{ppt:SimPPTFormatare}.

   Teste noi, pe starea prezentării:
   - fmtFont      {k:'fmtFont', d, ph|o, font:'titluri'|'text'|'<nume>'}
                  'titluri' / 'text' = FONTUL TEMEI (Theme Fonts: cel cu (Headings) / cel cu (Body)), adică textul nu are un
                  font pus de mână. Același nume ales din All Fonts NU e fontul temei (judecătorul, m8, probat în PowerPoint
                  real: caseta arată doar „Calibri Light”, fără (Headings), iar titlul nu mai urmează tema). '<nume>' = acel font.
   - fmtFontToate {k:'fmtFontToate', ph, font}  la fel, pe TOATE diapozitivele care au text în substituentul ph;
   - fmtMaiMare   {k:'fmtMaiMare', d, mare:'titlu', mic:'c1'}  titlul rămâne mai mare decât rândurile (mărimea „de fapt”).
   Afișarea, ca în PowerPoint:
   - caseta Font arată „Calibri Light (Headings)” / „Calibri (Body)” când textul ales are fontul temei (probat:
     lectii/vi/m2-l08/_proba/probe_font_d2.json); un font ales din All Fonts apare doar cu numele (simppt-formatare.js
     scria doar numele);
   - Comic Sans MS nu există pe telefoane (Android, iPhone): simppt-formatare.js cădea pe același sans-serif ca fontul temei,
     deci titlul greșit arăta la fel (judecătorul, m9). Aici îl desenăm cu rezerve vizibil diferite (Comic Neue, Chalkboard
     SE, apoi un font de mână din telefon), pe diapozitiv, în miniaturi și în lista Font;
   - pe telefon (atingere), rândurile listei Font au cel puțin 36 px înălțime (regula 20; judecătorul, m10).
   Faptele din PowerPoint-ul real (probate pe desktopul ascuns: lectii/vi/m2-l08/_proba/probe_font.py, fa_pptx.py):
   o temă are două fonturi (MajorFont = pentru titluri, MinorFont = pentru text; în tema Office de pe calculatorul de
   probă: Calibri Light și Calibri); lista casetei Font arată sus „Theme Fonts”, cu „Calibri Light (Headings)” și
   „Calibri (Body)”, apoi „All Fonts”; un titlu scris în alt font arată numele lui în caseta Font (Comic Sans MS).
   ====================================================================================================== */
(function(){
'use strict';
if(!window.SimPPT||!window.SimPPTFormatare){console.warn('simppt-estetica.js: încarcă întâi simppt.js și simppt-formatare.js');return}
const I=window.SimPPT._intern,F=window.SimPPTFormatare._intern;
const norm=s=>String(s==null?'':s).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,' ').trim().toLowerCase();
const Dd=(S,d)=>typeof d==='string'?S.slides.find(s=>norm(s.t.titlu)===norm(d)):S.slides[d-1];
const potr=(o,f)=>(!f.tip||o.tip===f.tip)&&(!f.forma||o.forma===f.forma)&&(f.txt==null||norm(o.txt)===norm(f.txt));
function tema(S){return F.TEME[F.temaDe(S)]||F.TEME['Office Theme']}
function asteptat(S,f){const T=tema(S);return f==='titluri'?T.f[0]:f==='text'?T.f[1]:f}
/* {font, pusDeMana}: fontul „de fapt” și dacă e un NUME ales din All Fonts (nu fontul temei) */
function fontDe(S,sl,c){
  let e=null;
  if(c.ph){if(!String(sl.t[c.ph]||'').trim())return null;e=F.efText(S,sl,{ph:c.ph})}
  else{const o=sl.obj.find(x=>potr(x,c.o||{}));if(!o)return null;e=F.efText(S,sl,{o})}
  const ex=e.explicit&&e.explicit.font;
  return {font:e.font,pusDeMana:!!(ex&&ex.n)};
}
function potrivit(S,x,f){
  if(!x)return false;
  if(f==='titluri'||f==='text')return !x.pusDeMana&&norm(x.font)===norm(asteptat(S,f));
  return norm(x.font)===norm(f);
}
Object.assign(I.CHK,{
  fmtFont:(S,c)=>{const sl=Dd(S,c.d);if(!sl)return false;return potrivit(S,fontDe(S,sl,c),c.font)},
  fmtFontToate:(S,c)=>{const L=S.slides.filter(s=>String(s.t[c.ph]||'').trim());
    return L.length>0&&L.every(sl=>potrivit(S,fontDe(S,sl,{ph:c.ph}),c.font))},
  /* titlul rămâne mai mare decât rândurile (mărimea „de fapt”, ca în Font Size) */
  fmtMaiMare:(S,c)=>{const sl=Dd(S,c.d);if(!sl)return false;const a=c.mare||'titlu',b=c.mic||'c1';
    if(!String(sl.t[a]||'').trim()||!String(sl.t[b]||'').trim())return false;
    return F.efText(S,sl,{ph:a}).pt>F.efText(S,sl,{ph:b}).pt}
});

/* ---------------- afișarea ---------------- */
const CSS=`@media (pointer:coarse){#body .fx-menu .fx-fonts button{min-height:36px}}`;
if(!document.getElementById('simppt-estetica-css')){const s=document.createElement('style');s.id='simppt-estetica-css';s.textContent=CSS;document.head.appendChild(s)}
const COMIC='"Comic Sans MS","Comic Neue","Chalkboard SE","Comic Sans","Segoe Print",cursive';
function eticheta(){
  const b=document.getElementById('body');const S=b&&b._sp&&typeof b._sp.stare==='function'?b._sp.stare():null;
  if(!S||!S.sel||!S.slides)return;
  document.querySelectorAll('#body .pg [data-fx="menu:font"] .pg-cb').forEach(c=>{
    const t=c.textContent.trim();if(!t||/\)$/.test(t))return;
    const sl=S.slides[S.cur];if(!sl)return;
    let tinta=null;
    if(S.sel.k==='ph')tinta={ph:S.sel.key};
    else if(S.sel.k==='obj'){const o=(sl.obj||[]).find(x=>x.id===S.sel.id);if(o)tinta={o}}
    if(!tinta)return;
    let e;try{e=F.efText(S,sl,tinta)}catch(x){return}
    const ex=e.explicit&&e.explicit.font;
    if(ex&&ex.n)return;
    if(norm(t)!==norm(e.font))return;
    const cap=ex&&ex.tema?(ex.tema==='t'?'Headings':'Body'):(tinta.ph==='titlu'?'Headings':'Body');
    c.textContent=t+' ('+cap+')';
  });
}
function comic(){
  document.querySelectorAll('#body [style*="Comic Sans MS"]').forEach(el=>{
    const ff=el.style.fontFamily||'';
    if(/^"?Comic Sans MS/.test(ff)&&ff.indexOf('cursive')<0)el.style.fontFamily=COMIC;
  });
}
let pe=false;
function laSchimbare(){if(pe)return;pe=true;try{eticheta();comic()}finally{pe=false}}
try{new MutationObserver(laSchimbare).observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['style']})}catch(x){}
window.SimPPTEstetica={versiune:2,teste:['fmtFont','fmtFontToate','fmtMaiMare']};
})();
