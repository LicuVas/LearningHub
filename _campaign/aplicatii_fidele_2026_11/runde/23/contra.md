# Runda 23 · contra (înainte de reparație)

## Cel mai puternic argument PENTRU plan
- **N2:** o singură condiție comună, cu o listă ÎNCHISĂ de taste de editare (cele pe care câmpul le folosește: Ctrl+A/C/V/X/Z/Y,
  Ctrl+Shift+Z/V, săgețile / Home / End / Backspace / Delete, și cu Ctrl sau Shift). Tot restul (F-uri, Alt+…, ceilalți Ctrl+…)
  se oprește. Tastele fără modificator (scrisul, Enter, Esc, Tab, săgețile simple) nu ajung deloc la condiție, deci scrisul,
  diacriticele (compunerea, AltGr = Ctrl+Alt → `gestTasta` dă `null`, ies înainte) și telefonul (evenimentul `input`) rămân
  exact ca înainte. Aplicațiile care tratează singure o tastă în câmp (Word: Alt+↓, Enter, Esc; Excel: Enter, Esc în Name Box)
  își fac deja `preventDefault` singure; schimbarea doar adaugă `preventDefault`, nu scoate niciunul.
- **N1:** `max-height:100vh` e chiar regula comună (`aplicatii.css:8`); Explorer o anula cu `none`. La 1366×768 nu schimbă nimic.
- **A22-1:** tot în `explorer.js`, păzit de `opt.incadrat`: fără opțiune, codul și desenul sunt identice (O3 / O4 neatinse).
- **G23-1:** starea coruptă („a/b” → fișierul dispare) e o eroare de model, nu o alegere de fidelitate; refuzul + mesajul central
  păstrează starea adevărată.

## Cel mai puternic argument ÎMPOTRIVĂ
- **N2 e comun și atinge toate câmpurile tuturor aplicațiilor.** Un câmp care se bizuia pe o scurtătură a browserului (de ex.
  Ctrl+Shift+V „lipește ca text”, Ctrl+Insert, Alt+↓ pe o listă nativă `<select>`) s-ar strica. Am căutat: niciun `<select>` și
  niciun `contenteditable` în word / excel / powerpoint / windows / explorer.js; Ctrl+Insert / Shift+Insert dau `gestTasta = null`
  (ies înainte de condiție). Tab în câmpuri NU îl schimb (lista din supliment nu-l cere, iar în ferestre fiecare aplicație îl ia
  singură) — risc de regres mai mic, dar api §4 îl pomenește → rând R23.
- **A22-1 nu se poate închide întreg din `explorer.js`:** ascultătorii gazdei de `pointerdown` (captură pe rădăcina ei) și
  `pointerup` (captură pe `window`) văd clicurile din Explorer ÎNAINTE ca Explorer să le poată opri; `deschideSuprafata(cheie)` e în
  `aplicatii.js:187`. Ambele sunt cod comun în afara zonei mele (supliment: „r23: DOAR … condiția preventDefault”).

## Adevărul incomod (punctul cel mai puțin sigur)
- **Chromium headless n-are scurtăturile browserului**, deci dovada pentru N2 e `defaultPrevented: true`, nu „F5 nu reîncarcă”.
  Iar Ctrl+W / Ctrl+N / Ctrl+T sunt rezervate în Chrome: pagina nu le poate opri deloc, cu sau fără reparație.
- **Montarea cu gazda Windows** rămâne cu dubluri la clic până când orchestratorul aplică paza comună. O propun ca patch exact,
  probat pe o copie în %TEMP%, nu o scriu în `aplicatii.js`.

## Hotărârea
Repar N2, N1, G23-1 și partea din A22-1 care stă în `explorer.js`; documentez §1 (+ §4); paza comună pentru montare (pointer +
`deschideSuprafata`) o predau orchestratorului ca patch probat (`runde/23/propunere_comun_A22-1.md`).
