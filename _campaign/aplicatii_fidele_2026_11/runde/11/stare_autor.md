# Runda 11 · starea constructorului (la zi după fiecare bucată)

## Gata
1. **Generatorul** `aplicatii/_unelte/genereaza_powerpoint.py` → `aplicatii/date/powerpoint.json` (40 de suprafețe, ~1921 noduri, 68 icoane, 14 note de lipsă; `--verifica` = 0). `genereaza_word.py --verifica` = 0, `genereaza_excel.py --verifica` = 0 (neschimbate).
2. **Fereastra** `aplicatii/powerpoint.js` (nou): bara de titlu + Acces rapid, rândul filelor, panglica fiecărei file (din date), bara de stare („Slide N of M”), miniaturile, diapozitivul cu casetele (aspectele Title Slide / Title and Content / Title Only), tastarea, cursorul, selecția, dublu clic = cuvânt, Esc = caseta ca obiect, marginea = mutare.
3. **Diapozitivele**: New Slide (partea de sus a butonului), lista ▾ a aspectelor (New Slide ▾, Layout), Ctrl+M, Ctrl+D, Delete / Backspace / Enter în miniaturi, tragerea miniaturii = mutare, clic dreapta pe miniatură (Duplicate / Delete / New Slide), Ctrl+Z / Ctrl+Y (stare.istoric).
4. **Design / Transitions / Animations**: galeriile din panglică (toate rândurile în DOM, derulabile), tema, tranziția, Apply To All, animația (înlocuiește), Animation Pane (panou.AnimationCustom), Format Background (panou), filele contextuale Shape Format / Table Design+Layout / Picture Format; comenzile gri din referință devin active cu o casetă aleasă.
5. parțial: File/Backstage (nav + pagini din date), Save As (dialog.FileSaveAs, Enter = Save, `nume_fisier`), F12, F5 / From Beginning = expunerea; tabelul RxC (grila ▾).
- `aplicatii/aplicatii.js`: doar `SURSE_APP` += powerpoint. `aplicatii/aplicatii.css`: secțiune nouă la capăt (`.lh-ap-powerpoint`, `.lh-ap-p-*`). `aplicatii/poligon.html`: `P.powerpoint` (3 diapozitive „Vulcanii”). `aplicatii/profiluri/powerpoint365.json` (nou).
- Notele pașilor 2-4: `cadru.md`, `tinta.md`, `contra.md`.

## Numere (probă locală, O4 doar pe scenariile powerpoint, %TEMP%)
- O4 PowerPoint: 18 → **4** (13/17 la fel ca realul). Rămase: `diapozitiv-nou-buton` (rulatorul apasă centrul SplitButton-ului = partea ▾, care deschide lista — fidel geometriei; realul a folosit UIA Invoke), `imagine` (`mso:PictureInsertFromFile` nu e pe panglică), `salvare-ca` (`mso:FileTab` / `mso:FileSaveAs` nu sunt pe ecran), `tragere-forma` (fără rezultat real).

## Măsurat la predare (22:3x, singur pe mașină)
- `--doar O3,O4,O5,O8,O9`: O3 21586 → 21586 · O4 50 → 33 · O5 113 → 82 · O8 102 → 102 · O9 34 → 27; regres: niciunul; lacăt ok.
- Probe locale PowerPoint: O4 18 → 4, O5 31 → 0, O9 8 → 1 (F = etapa C).
- `proba_powerpoint.py` = 0 picate (×3). Regresul Word 5/5 = 0, Excel 5/5 = 0, runde/7 = 2 și 3 (acceptate).
- Reparat pe drum: focusul pierdut la clic în zonă (prima literă tastată se pierdea) — `I.la.jos`: preventDefault + I.focus() imediat.

## Urmează (constructorul 2)
1. Formatarea pe BUCĂȚI de text (bold / mărime pe selecție, nu pe toată caseta) + `formatare_text` pe bucata citită.
2. Ferestrele Font / Paragraph / Insert Table: OK să aplice (azi doar se închid); Insert Picture (după R11-1/R11-10).
3. Backstage › Save / Close / New, „Save your changes” (nu e în referință → de_verificat).
4. Pasul 7 complet: `masoara.py --runda 11 --paralel 3 --compara runde/11/masurare_pornire.json` (O6 NECONCLUDENT → pașii din supliment).
Rândurile deschise pentru orchestrator: R11-9 (New Slide: centrul = partea ▾), R11-10 (imagine, salvare-ca neexecutabile).
