# Ținta rundei 20 (Word, B-word#2)

## Numerele care au ales-o
- Pornirea (`masurare_pornire.json`, comună, toate aplicațiile): O3 28919 · O4 28 · O8 102 (O1 61, O2 13392, O5 35, O6 0,
  O7 341, O9 13; porți 41, toate în `cum_fac`).
- Word singur, la pornire: O4 pe `scenarii/word` = **13** (`probe_iesiri/O4w_inainte/iesire.log`: 54/64 la fel ca Word real;
  2 diferențe într-un scenariu, 2 neexecutabile, 8 fără rezultat real probat — aceleași ca la finalul rundei 16).
- Ținta NU vine din (O3+O4+O8) × lecții: suplimentul (`runde/supliment_B_word_runda20.md`) și regula „GRAV-urile criticului din
  runda trecută au întâietate” pun pe primul loc **GRAV K1** (`runde/16/critic.md:65-94`). Suprafețele lui K1 apar în
  `m1-l03` (`:189-195`, `:262-290`) și în toate lecțiile care salvează / deschid cu Word.
- Proba la pornire (`proba_grav_inainte.log`): **18 picate din 28**:
  - K1: 12 (drumul PDF cu Tab, lecția `:189-192` cu Tab, ocolul Tab în 5 ferestre, literele după Tab, Enter/Space pe
    butonul cu focusul ×4);
  - stare_finala_erori: 6 (2 = asistentul trece pasul Save la numele refuzat — comun; 2 = drumurile cu Tab din E2/E3, din
    K1; 1 = Esc în „Save your changes…” lasă `dialog.apasat` null, nu „Cancel”; 1 = `E5_esc_open`, greșeala probei: am
    cerut „fără fișiere” deși conținutul pornește cu fișiere).

## Ce repar, în ordine
1. K1: Word cheamă cârligul comun `I.tabFereastra(dialog.el, shift)` din `I.la.tasta`, ca `powerpoint.js:2072-2076`.
2. Enter / Space pe butonul cu focusul (ca `powerpoint.js:2140-2147`); Esc = Cancel, cu `activat` și `apasat`.
3. Dacă ajunge contextul: MINOR-urile ieftine din critic 16 (Alt+↑ / F5 / Alt+← / Alt+→ / Alt+L în ferestre).

## Fișierele rundei (doar acestea se modifică)
- `aplicatii/word.js` (copia: `runde/20/inainte/word.js`, sha256 29e550e2…);
- `runde/20/*` (probele, rapoartele);
- `de_verificat.md` / `de_aprobat.md`: doar blocul `<!-- RUNDA20-WORD:START/END -->`.
- Fișiere comune: **niciunul** (cârligul din `aplicatii.js` se folosește, nu se schimbă).
