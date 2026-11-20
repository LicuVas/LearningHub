# Criticul rece, runda 16 (valul B-word redeschis), unghiul GEST_TASTATURA — scris de orchestrator, 20.11.2026

N = 16. Regulile sunt în `D/runde/_paralel/REGULI_CRITIC.md`: citește-le întâi, întregi. Ieșirea e `D/runde/16/critic.md`.

## Ce e lucrarea
- **Biblioteca** `C:/00/Projects/LearningHub_fidel/aplicatii/` simulează Word (`word.js`, `date/word.json`, profilurile `word365` / `word2007`), fidel cu Word 365 real și cu ferestrele Windows de salvare / deschidere.
  - Poligonul e `aplicatii/poligon.html?aplicatie=word`; parametrii sunt în `D/runde/16/gata_pentru_critic.md`.
- **Lecția principală** a drumurilor cu fișiere e `lectii/vii/m1-l03/index.html` (Save As, Open, atelierul). Lecțiile folosesc încă simulatoarele vechi, deci drumurile le joci pe poligon, cu conținutul lecției.
- **Valul Word s-a oprit în runda 5** cu 8 GRAV deschise (`D/runde/5/critic.md`):
  - T5 (`:84`), T6 (`:109`);
  - S1 (`:140`), S2 (`:159`), S3 (`:178`), S4 (`:193`), S5 (`:207`), S6 (`:224`).
  - Dovezile Word reale stau în `D/runde/5/critic_probe/` (de ex. `com_r5.json`) și în `referinte/`.
- **Runda 16 le-a reparat.** Raportul constructorului e `D/runde/16/raport_constructor.md`, iar ținta e în `D/runde/supliment_B_word_runda16.md`.

## Ce spune constructorul (de judecat, nu de crezut)
- **Toate cele 8 se reproduceau pe codul de azi** (în `proba_grav.py` picau 18 din 20) și acum sunt toate ÎNCHISE (0 picate):
  - S1: bara de adrese urmează folderul;
  - S2: F12 deschide în folderul documentului;
  - S5: lista din Save As arată fișierele;
  - S4: fișierul deschis de două ori nu se dublează;
  - S6: Document2 / Document3;
  - S3: numele cu semne interzise e refuzat (mesajul central cu textul lecției, fără fereastră inventată);
  - T6: Alt+↓ poartă `activat`;
  - T5: panglica e gri fără document.
- **A atins doar `aplicatii/word.js`** (+120 / −16). Regresul Word: probele vechi dau 0, iar O4 `word-*` = 13, cu verdictele identice cu pornirea. `5/proba_grav.py` pică voit la `t5_fara_document_nu_tace`.
- **Fără citat în referință** (de_verificat R16-1…R16-5):
  - textul ferestrei reale la numele interzis;
  - filtrarea listei din Save As după tip;
  - redeschiderea unui fișier modificat;
  - dacă TOATĂ panglica e gri fără document;
  - lista din Switch Windows.
  - S2 și S6 se sprijină doar pe dovada COM a criticului 5.

## Sarcina
1. **A. Cele 8 GRAV vechi.** Pe fiecare joci gestul criticului 5, apoi un gest vecin, și scrii ÎNCHIS sau DESCHIS cu proba ta. La T5 compari cu `com_r5.json`: ce era activ / gri fără document în Word real.
2. **B. Unghiul GEST_TASTATURA pe Word**, pe drumurile cu fișiere și liste din m1-l03:
   - F12, Ctrl+S, Ctrl+O, Ctrl+F12, Ctrl+N, Ctrl+W;
   - în fereastra Save As / Open: Tab și Shift+Tab (ordinea), Alt + litera subliniată, Enter în File name, Esc, săgețile în listă, Backspace = folderul părinte, F4 / Alt+↓ pe bara de adrese;
   - în listele derulante ale panglicii: Alt+↓, săgeți, Enter, Esc;
   - KeyTips: Alt, H, … — tastele de acces din referință.
   Pe fiecare: evenimentul §4 (cu `activat` unde se alege un rând), starea, ecranul, asistentul §6.3.
3. **C. Regresul:**
   - închisele din rundele 1-5 (`D/runde/5/critic.md`, secțiunea închiselor), pe eșantion;
   - Word pe fereastra mică (1366×657 la 125%) și pe telefon, pe 2-3 drumuri.
   - Banda Word n-a atins cod comun, deci Excel / PowerPoint doar pornesc (1 drum fiecare).
4. **D.** Ca în reguli.
