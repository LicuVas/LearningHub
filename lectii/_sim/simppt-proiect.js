/* ======================================================================================================
   lectii/_sim/simppt-proiect.js — VERIFICĂRI ÎN PLUS pentru PowerPoint-ul simulat, pentru lecția VI · M2 · 9
   („Mini-proiect: prezentare pe o temă la alegere (realizare + susținere)”).
   PROPRIETAR: autorul lecției VI-M2-L9. Se încarcă ULTIMUL, după lectii/_sim/simppt.js (și simppt-formatare.js) și
   după lectii/_sim/simppt-interfata.js, dacă pagina le folosește. NU modifică niciunul dintre ele: adaugă doar condiții
   noi în obiectele lor de verificări (SimPPT._intern.CHK, SimPPTInt._intern.CHK), exact cum face simppt-formatare.js
   (Object.assign pe același obiect).

   1) SimPPT (tipul ppt):  {k:'linieIncepe', d, ph, cu, min?, ultima?}
      Pe diapozitivul d (numărul lui, de la 1, sau titlul lui), în substituentul ph ('c1', 'sub'…), un rând ÎNCEPE cu
      textul `cu` și, după el, mai are cel puțin `min` litere (implicit 3). Cu ultima:true, rândul acela trebuie să fie
      ULTIMUL rând scris (rândurile goale de la sfârșit nu contează) — judecătorul VI/9, J06: pe telefon, „Surse: NASA.”
      intra între două rânduri și testul trecea, deși cheia cerea „la sfârșit”.
      Comparația e ca la toate testele SimPPT: fără diacritice, cu litere mici, fără ghilimele, cu spațiile strânse.
      Punctuația de după „cu” nu contează: „Surse: NASA.” trece; „Surse:” (gol) nu; „Am luat de pe NASA” nu.
      De ce: testul `linii` cere rândul EXACT, iar „Surse: NASA.” (cu punct) ar fi fost respins (regula fidelității).

   2) SimPPTInt (tipul ppti):  {k:'startPrimul'}
      Expunerea a pornit de la PRIMUL diapozitiv, pe orice drum: F5 / Slide Show › From Beginning (ev.inceput) SAU
      butonul Slide Show din bara de stare cu miniatura 1 aleasă (curentDin === 1). Ca în PowerPoint: ambele drumuri
      pornesc de la diapozitivul 1 (judecătorul VI/9, J04: elevul care alegea miniatura 1 și apăsa butonul din bara de
      stare era respins, deși făcuse exact ce cerea exercițiul).
   ====================================================================================================== */
(function(){
'use strict';
const norm=s=>String(s==null?'':s).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[„”"“«»]/g,'').replace(/\s+/g,' ').trim().toLowerCase();
const SP=window.SimPPT;
if(SP&&SP._intern&&SP._intern.CHK){
  const D=(S,d)=>typeof d==='string'?S.slides.find(s=>norm(s.t.titlu)===norm(d)):S.slides[d-1];
  Object.assign(SP._intern.CHK,{
    linieIncepe:(S,c)=>{
      const s=D(S,c.d);if(!s)return false;
      const cu=norm(c.cu),min=c.min==null?3:c.min;
      const bun=L=>L.startsWith(cu)&&L.slice(cu.length).replace(/[^a-z]/g,'').length>=min;
      const R=String((s.t&&s.t[c.ph])||'').split('\n').map(norm).filter(L=>L!=='');
      return c.ultima?(R.length>0&&bun(R[R.length-1])):R.some(bun);
    }
  });
}
const SI=window.SimPPTInt;
if(SI&&SI._intern&&SI._intern.CHK){
  Object.assign(SI._intern.CHK,{
    startPrimul:S=>!!(S.ev&&S.ev.inceput)||S.curentDin===1
  });
}
if(!(SP&&SP._intern)&&!(SI&&SI._intern))console.error('simppt-proiect.js: lipsesc simppt.js și simppt-interfata.js (se încarcă înainte)');
})();
