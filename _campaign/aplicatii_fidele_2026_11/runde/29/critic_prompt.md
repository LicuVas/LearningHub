# Criticul rece, runda 29 (valul B-excel redeschis `B-excel#3`; ciclul paralel D), unghiul STARE_FINALA_ERORI — scris de orchestrator, 21.11.2026

N = 29. Regulile sunt în `D/runde/_paralel/REGULI_CRITIC.md`: citește-le întâi, întregi. Ieșirea e `D/runde/29/critic.md`.

## Ce e lucrarea
- **Biblioteca** `C:/00/Projects/LearningHub_fidel/aplicatii/` simulează Excel 365:
  - codul: `excel.js`, `date/excel.json`, profilul `excel365`;
  - poligonul: `aplicatii/poligon.html?aplicatie=excel`, cu parametrii din `D/runde/29/gata_pentru_critic.md`.
- **Criticul 25** (`D/runde/25/critic.md`, unghiul gest_tastatura) a găsit G25-1: operațiile pe foi din lecția viii/m1-l03 (Delete, Move or Copy, Tab Color, tragerea filei) dădeau doar mesajul central sau tăceau.
- **Runda 29 a reparat** G25-1, Ctrl+PageDown / PageUp la capete și MINOR 1 (Alt într-o fereastră), apoi a lucrat pe unghiul stare_finala_erori. Raportul constructorului e `D/runde/29/raport_constructor.md`; ținta e `D/runde/supliment_B_excel_runda29.md`.
- **Runda `acoperire` Office** (`D/runde/26/acoperire_office.md`) a refăcut înainte de ciclu referințele și scenariile `excel-*` găsite greșite (sortarea pe două niveluri, Esc + Esc).
- **În paralel** au schimbat cod comun:
  - r28: asistentul (`L.asistent`, trei reguli noi);
  - r30: `gestTasta`, `leagaGesturi` › `pointerdown`, `L.deschideSuprafata`, `I.emite`.
  Ce vezi la Excel din cauza lor notezi cu ora, fără să atribui rundei 29.

## Ce spune constructorul (de judecat, nu de crezut)
- **`29/proba_grav.py`:** 18 verificări cu gesturi reale; pe codul de la pornire (`LH_VECHI=1`) pică 17, acum 0. A lucrat doar în `excel.js`; fișiere comune: niciunul; `date/excel.json` neschimbat.
- **G25-1 ÎNCHIS:**
  - ștergerea foii: cu date întreabă (Delete / Cancel), goală dispare direct, singura e refuzată;
  - Home › Delete ▾ › Delete Sheet; Move or Copy cu lista foilor și Create a copy („Septembrie (2)”); tragerea filei (cu Ctrl o copiază); Tab Color › Green (`culori_file`);
  - Ctrl+Z după ștergere nu aduce foaia înapoi;
  - ferestrele de confirmare / refuz și paleta sunt desenate după captura lecției sau deduse (R29-1…R29-4). Judecă dacă se potrivesc cu `confirma-stergerea.webp` / `mutare-sau-copiere.webp`.
- **Ctrl+PageDown / PageUp:** foaia vecină, pe loc la capete. **Alt într-o fereastră:** `arata_taste_acces`.
- **Unghiul:** redenumirea cu numele altei foi (m1-l03:226) revenea tăcut; acum „That name is already taken. Try a different one.”, iar după OK fila revine în redenumire. Pe telefon, întrebarea de ștergere ieșea din ecran (456 px pe 375); acum 371 px.
- **Rămase:** „=SUM(A1:A3” / „=A1+” + Enter dau mesajul central (fără referință, R29-8); numele gol / cu caracter nepermis revine tăcut (R29-7); atingerea pe filă și tragerea cu degetul nedovedite (hamul nu nimerește fila nici pe codul vechi).
- **Regresul:** probele 25, 21, 17, 10, 9, 6 dau 0; O4 `excel-*` 64/66, 0 diferențe (cele 2 = tragerile fără real). **Proba 8 dă 1** (K2: asistentul nu trece la pasul 2 după Enter pe OK) și pică la fel cu `excel.js` de la pornire (`29/proba/k2_izolat.py`), deci constructorul o pune pe seama `aplicatii.js` schimbat de alte benzi (r28 `L.asistent`, r30). Verifică și spune din ce bandă vine.

## Sarcina
1. **A. G25-1.** Joci gesturile criticului 25 (`25/critic.md:70-77`, registrul din `incearca` m1-l03:247-248) și exercițiile lecției (`:220`, `:247`, `:255`, `:266`, atelierul `:288`), apoi un gest vecin. Scrii ÎNCHIS sau DESCHIS, cu proba ta.
   - Judecă fereastra de confirmare a ștergerii și refuzul la singura foaie față de capturile lecției (`confirma-stergerea.webp`) și față de ce scrie constructorul ca `R29-…`.
   - Verifici pe eșantion că G17-1, G17-2 și R21-2 rămân închise.
2. **B. Unghiul STARE_FINALA_ERORI pe Excel**, pe drumurile lecțiilor. Greșelile tipice:
   - o foaie ștearsă din greșeală, apoi Ctrl+Z;
   - o formulă cu greșeală de tastare, apoi Esc / Enter;
   - Delete pe un rând întreg, apoi Ctrl+Z;
   - lipirea peste date, apoi Ctrl+Z;
   - redenumirea foii cu un nume existent sau gol;
   - sortarea doar a unei coloane, dacă e în lecții.
   După fiecare: `stare()` = ecranul = referința (scenariile `excel-*`), evenimentul §4, asistentul §6.3. Unde ai voie, compari cu Excel real (DispatchEx invizibil, PID-ul tău; Excel-ul deschis înainte de tine e al omului). Ce nu are referință = [FARA_REFERINTA].
3. **C. Regresul:**
   - X10, A1, T1 și „Ce a trecut” din `25/critic.md`, pe eșantion;
   - O4 `excel-*`;
   - aspectul la 1366×768 pe 3-4 suprafețe (grila, Home, bara de formule, filele foilor);
   - telefonul și tabla SMART.
4. **D.** Ca în reguli.
