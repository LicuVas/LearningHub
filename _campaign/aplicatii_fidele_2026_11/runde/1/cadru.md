# Runda 1 · etapa B · Word — CADRUL (pasul 2)

Scris în timpul măsurării de pornire (pasul 1, în fundal), înainte ca ceva să fie pus sub `aplicatii/`. Biblioteca s-a
construit întâi într-un dosar de lucru separat (scratchpad), probată pe copii, și s-a copiat în `aplicatii/` abia după ce
măsurarea de pornire s-a terminat (suplimentul: „NU scrii nimic sub aplicatii/ până nu s-a terminat”).

## Suprafața aleasă
Runda 1 nu alege o suprafață dintre altele: biblioteca nu există, deci ținta e „biblioteca + Word” (suplimentul). În
interiorul ei, suprafețele Word sunt toate cele 45 din `referinte/uia_word.json`.

## Presupuneri (cel puțin 3) despre suprafață
1. **Referința UIA e completă pentru ce se vede la 1366×768, nu și pentru ce se deschide.** Listele derulante și galeriile
   deschise (Margins ▾, Orientation ▾, Table ▾, Pictures ▾, Bullets ▾…) NU sunt capturate (README_referinte.md, „Necapturate”).
   Deci orice etichetă din ele e fie citată din alt reper (ieșirea unui scenariu real: „Narrow Margins”, „Landscape”,
   „Heading 1”; contractul API: „3x2 Table”), fie lipsește.
2. **Poziția relativă (8 px) e măsurată la fereastra de 1366 px.** Dacă o lecție dă bibliotecii un container mai îngust,
   elementele ancorate la dreapta (Close, Share, zoom-ul din bara de stare) s-ar muta față de colțul suprafeței. Presupun
   că geometria trebuie păstrată exact și ce nu încape se derulează lateral (ca la I1 pe telefon), nu se re-așază.
3. **„Ecranul = starea” și scenariile reale sunt singurele dovezi de COMPORTAMENT.** O comandă afișată fără scenariu real
   (Strikethrough, Format Painter, Find, Ctrl+D…) nu are un efect dovedit; o simulez doar dacă un scenariu o acoperă,
   altfel dă mesajul central standard (R12) și intră în `de_verificat.md`.
4. **Profilul `word2007` schimbă doar gruparea anulării** (I4): interfața rămâne cea din referința Word de azi (R2).
5. **O3/O8/O7/O2/O1 măsoară lecțiile, nu poligonul.** Cât timp nicio lecție nu încarcă biblioteca (etapa C), munca pe
   interfață NU mișcă O3; doar O4, O5, O9 (care lucrează pe `aplicatii/poligon.html`) se pot mișca în runda asta.
   Ca interfața să fie totuși măsurată, am scris `aplicatii/_unelte/masoara_poligon.py`, care rulează EXACT codul
   înghețat al lui O3 (arbore_randat.js + structura_lib.compara + oracol_ui.puncte) pe poligon. E un diagnostic, nu un oracol.

## Citirile lui „fidel” pentru Word
- **(a) aspect / loc**: aceleași elemente, cu aceleași nume, în aceeași ordine, la aceeași poziție relativă (R4, O3).
- **(b) gest → stare finală**: același gest al elevului (tastă, clic, tragere) duce la aceeași stare a documentului ca
  în Word real (R5, O4 contra `scenarii_real/word-*.json`).
- **(c) mesaj / reacție**: ce afișează Word după gest (dialogul Save As cu numele propus, bara de stare, butoanele
  apăsate).

**Citirea aleasă: (a) + (b) împreună, cu (b) pe primul loc pentru comportament și (a) generat din referință.** De ce
pierd celelalte: (c) singură ar permite o fereastră „care arată ca Word” fără ca Ctrl+Z, Tab în tabel sau AutoCorect să se
poarte ca în Word — elevul ar învăța alt comportament; (a) singură ar da un tablou fără mecanică. Proba realității din
contract cere ambele: „găsește aceleași lucruri în același loc, iar ele fac același lucru”. (c) intră doar acolo unde
referința o dovedește (dialogul Save As: titlul, numele propus, tipul — `scenarii_real/word-salvare-ca-f12.json`).
