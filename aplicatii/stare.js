/* stare.js — piese comune pentru starea aplicațiilor simulate (api_biblioteca.md §5): istoricul Anulare/Refacere cu unități
   de anulare grupate după profil (word365: o tastare continuă = o unitate; word2007: fiecare literă = o unitate — contract
   I4) și copierea adâncă a stării. Aplicația îi dă instantanee; istoricul nu știe ce e înăuntru. */
(function () {
  'use strict';
  const L = window.LH && window.LH.aplicatii;
  if (!L) return;
  const clona = o => JSON.parse(JSON.stringify(o === undefined ? null : o));

  /* grupeaza(tipAnterior, tipNou) -> true = gestul nou intră în aceeași unitate de anulare cu cel dinainte */
  function istoric(grupeaza) {
    const U = [], R = [];
    let ultimTip = null, deschis = false;
    return {
      /* chemat ÎNAINTE de o schimbare, cu instantaneul stării de dinainte */
      inainte(tip, inst) {
        if (!(deschis && grupeaza && grupeaza(ultimTip, tip))) U.push({ tip, inst: clona(inst) });
        R.length = 0;
        ultimTip = tip;
        deschis = true;
      },
      /* un gest care nu schimbă documentul (mutarea cursorului, un clic) închide unitatea de tastare */
      rupe() { deschis = false; },
      anuleaza(curent) {
        if (!U.length) return null;
        const u = U.pop();
        R.push({ tip: u.tip, inst: clona(curent) });
        deschis = false;
        return u.inst;
      },
      reface(curent) {
        if (!R.length) return null;
        const r = R.pop();
        U.push({ tip: r.tip, inst: clona(curent) });
        deschis = false;
        return r.inst;
      },
      poateAnula: () => U.length > 0,
      poateReface: () => R.length > 0,
      ultimTip: () => ultimTip
    };
  }

  L._modul('stare', { istoric, clona });
})();
