# Runda 23 · propunere pentru orchestrator: paza comună a montării (A22-1) — NU e aplicată în worktree

## De ce nu am scris-o eu
- Supliment, „Cine atinge ce din `aplicatii.js`”: r23 are DOAR condiția `preventDefault` din ascultătorul de `keydown`.
- Cele două locuri de mai jos sunt în afara ei (nu sunt ale nici unei benzi din ciclul C: r24 = `L.asistent`, r26 = `gestTasta` / `litera`).
- Fără ele, A22-1 e închisă doar pe jumătate (vezi „Ce rămâne”).

## Ce face Explorer-ul singur (în `explorer.js`, aplicat)
- Cu `opt.incadrat`, oprește în rădăcina lui (bubbling) click, dblclick, contextmenu, wheel, keydown / keyup, pointerdown / move / up,
  mouse / touch, input, drag.
- Ascultătorii bibliotecii de pe rădăcina Explorer-ului rulează întâi (același element), apoi evenimentul nu mai urcă la gazdă.
- Cu gazda `div` din probă: 0 evenimente la ascultătorii gazdei în bubbling.

## Ce rămâne și de ce nu se poate din `explorer.js`
- Gazda Windows primește tot clicurile: ascultătorul ei de `pointerdown` e în CAPTURĂ pe rădăcina ei (`aplicatii.js:328`), deci rulează
  ÎNAINTE de Explorer, iar `pointerup` e pe `window` (tot captură).
- Proba (`proba_grav_dupa1.log › MONT windows`): un clic pe un rând din Explorer dă și `{aplicatie: windows, gest: clic, tinta: lista:harta.png}`;
  dublul clic dă și `dublu_clic` al gazdei.
- `LH.aplicatii.deschideSuprafata(cheie)` (`aplicatii.js:187-188`) ia prima aplicație vie, adică Windows: `deschideSuprafata('meniu_nou')` = `false`.

## Patch-ul propus (2 schimbări mici; aplicate automat de `probe/aplica_propunere.py` pe o COPIE)
**P1 — `leagaGesturi`, ascultătorul de `pointerdown` (azi `aplicatii.js:328-329`):**
```js
    r.addEventListener('pointerdown', e => {
      /* runda 23 (A22-1): ținta e într-o altă aplicație a bibliotecii, montată în aceasta (opt.incadrat) → clicul e al ei */
      const ra = e.target && e.target.closest && e.target.closest('[data-lh-aplicatie]');
      if (ra && ra !== r) { jos = null; return; }
      if (e.button !== 0) { jos = null; return; }
```
- Fără montare, `closest('[data-lh-aplicatie]')` e chiar `r` → ramura nu rulează: nicio schimbare pentru aplicațiile de azi.
- Cu `jos = null`, `laSus` (pointerup pe window) al gazdei iese imediat (`if (!j …) return`), deci nici clicul, nici dublul clic.

**P2 — `L.deschideSuprafata` (azi `aplicatii.js:187-188`):**
```js
  L.deschideSuprafata = function (cheie, ceruta) {
    const nume = ceruta && viu(ceruta) ? ceruta : Object.keys(INST).find(n => viu(n));   // runda 23 (A22-1): aplicația cerută
```
- Fără al doilea argument: exact ca azi (oracolele cheamă `deschideSuprafata(cheie)`).
- §1 ar primi: „`deschideSuprafata(cheie, nume?)` — `nume` = aplicația cerută (montată într-o gazdă); altfel prima vie”.

## Proba patch-ului (pe copie, în %TEMP%\r23_propunere; worktree neatins)
- `python runde/23/proba_grav.py MONT --radacina %TEMP%\r23_propunere --eticheta propunere_MONT` → **0 picate din 15**.
  Log: `probe_iesiri/proba_grav_propunere_MONT.log`.
- Pe worktree (fără patch): 2 picate din 15 (gazda Windows: dublurile clicului; `deschideSuprafata`). Log: `probe_iesiri/proba_grav_dupa1.log`.

## Ce trebuie să facă gazda (banda Windows, la legare)
- `deschide('explorer', {loc: <corpul ferestrei>, incadrat: true, continut})`.
- Titlul ferestrei = `instanta.stare().titlu` (ascultă evenimentele §4 ale Explorer-ului ca să-l reîmprospăteze).
- La `deseneazaFerestre` (care rescrie stratul): păstrează `instanta.radacina`, o pune în corpul nou în ACEEAȘI funcție, apoi
  `instanta.focus()` dacă fereastra era activă (mutarea în DOM pierde focusul).
  - De ce în aceeași funcție: `viu()` (`aplicatii.js:137-140`) închide instanța a cărei rădăcină nu e în pagină la prima chemare.
- Tastele cu sens pentru gazdă (Win, Win+E) nu mai urcă din Explorer.
  - Gazda le ia din evenimentele §4 ale Explorer-ului (`gest: tasta_windows`) sau cu un ascultător pe `window`, în captură.
- Clicul în Explorer nu mai ajunge la gazdă.
  - Ce trebuie închis la un clic în altă fereastră (meniul Start, un meniu al barei) gazda închide din evenimentele §4 ale Explorer-ului.
