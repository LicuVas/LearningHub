# Runda 11 · starea constructorului (la zi după fiecare bucată)

## Gata — constructorul 1 (commit de control 1b68edcc)
1. **Generatorul** `aplicatii/_unelte/genereaza_powerpoint.py` → `aplicatii/date/powerpoint.json` (40 de suprafețe; `--verifica` = 0).
2. **Fereastra** `aplicatii/powerpoint.js`: titlu + Acces rapid, file, panglici, bara de stare, miniaturi, diapozitivul, casetele, tastarea.
3. **Diapozitivele**: New Slide, Layout ▾, Ctrl+M/D/Z/Y, Delete, mutarea, clic dreapta pe miniatură.
4. **Design / Transitions / Animations** + Animation Pane, Format Background, filele contextuale.
5. parțial: Backstage, Save As (F12, Enter = Save), F5, tabelul RxC din grilă.

## Gata — constructorul 2 (doar `aplicatii/powerpoint.js` + notele din runde/11 + de_verificat.md)
6. **Formatarea pe BUCĂȚI de text**: fiecare caracter are formatul lui (`fm`), fiecare paragraf proprietățile lui (`par`).
   Bold / Italic / Underline / Increase / Decrease Font Size / Ctrl+B/I/U: caseta ca obiect = tot textul; text ales = doar bucata;
   cursor strâns în cuvânt = cuvântul; altfel formatul de scriere. Tastarea moștenește formatul vecinului. Ctrl+C/V păstrează formatul.
   Ecranul: un bloc pe paragraf, un `<span>` pe bucată. Panglica: Bold/Italic/Underline apăsate, caseta Font Size = mărimea.
   Starea: `formatare_text` (ca COM), plus `formatare_pe_caractere`, `paragrafe_text`, `modificat`.
7. **Caseta Font Size** din Home: clic = text ales, număr + Enter = mărimea, Esc = renunță, focusul înapoi în diapozitiv.
8. **Ferestrele**: Font (Size, Font style, Underline style arată starea; OK aplică mărimea schimbată; Esc/Cancel nimic),
   Paragraph (Alignment, Before text, Before, After, At arată starea; OK/Enter aplică pe paragrafele alese), Insert Table
   (Table ▾ › „Insert Table...”, 5×2 din referință, More/Less ±1, OK = tabelul). Enter într-un câmp = OK (`activat: fereastra:OK`).
9. **Salvarea**: `modificat` în stare; F12 → focusul în File name imediat (tastele de după F12 nu se mai pierd).
   „Save your changes” NU e în referință → R11-13 (File › Close rămâne cu mesajul central).
- `de_verificat.md`: R11-11, R11-12, R11-13 (noi).

## Numere
- `proba_powerpoint.py`: 35 de verificări, 0 picate (×3).
- Parțial după ultima scriere sub `aplicatii/` (~23:00, 636,7 s, singur): O3 21586 · O4 33 · O5 82 · O8 102 · O9 27 (= predarea
  constructorului 1; O4 PowerPoint tot 13/17); regres: niciunul; copia `masurare_partial_c2.json`.
- Regresul: Word 5/5 = 0, Excel 5/5 = 0, runde/7 proba_grav = 2, proba_grav_cont2 = 3 (acceptate D14, D18); json-urile mutate în %TEMP%.

## Pasul 7 — FĂCUT (23:11:47 → 23:44:50, singur pe mașină)
- O1 61 · O2 13392 · O3 21586 · O4 50 → 33 · O5 113 → 82 · O6 0 (concludent, 1022 s) · O7 343 · O8 102 · O9 34 → 27 · porți 41
  (toate pe cum_fac); lacăt ok; regres: niciunul; `ingheata.py --verifica` = 0. Runda e gata pentru critic (pașii 8-9 = orchestratorul).
