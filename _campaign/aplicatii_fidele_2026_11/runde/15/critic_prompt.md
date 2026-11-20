# Criticul rece, runda 15 (prima rundă de construcție a valului B-explorer), unghiul ASPECT — scris de orchestrator, 20.11.2026

N = 15. Regulile sunt în `D/runde/_paralel/REGULI_CRITIC.md`: citește-le întâi, întregi. Ieșirea e `D/runde/15/critic.md`.
ATENȚIE: în `D/runde/15/` există deja `acoperire_instrumente*` (runda de instrumente de dinainte). Nu le atingi.

## Ce e lucrarea
- **Biblioteca** `C:/00/Projects/LearningHub_fidel/aplicatii/` are de azi File Explorer:
  - fișierele: `explorer.js`, `date/explorer.json` (generat de `aplicatii/_unelte/genereaza_explorer.py` din referință), profilul `profiluri/explorer_windows11.json`;
  - poligonul: `aplicatii/poligon.html?aplicatie=explorer`; parametrii sunt în `D/runde/15/gata_pentru_critic.md`.
- **Referința reală** e `referinte/uia_explorer.json`, din UI Automation pe Windows-ul profesorului, sesiunea din 20.11.2026 (`referinte/sesiune_windows_10min.md`).
  - Cheile: `explorer_fereastra` (+ `observat_vizual`), `explorer_meniu_nou`, `explorer_meniu_sortare`, `explorer_meniu_vizualizare`, `explorer_meniu_fisier`, `explorer_meniu_fisier_clasic`, `explorer_meniu_fundal`, `explorer_proprietati`, `proprietati_fisier`.
  - Format shell; ecranul referinței e 1536×864 (125%); interfața e în ROMÂNĂ. Datele personale sunt ascunse („[element personal ascuns]” …): nu trebuie să apară nimic personal pe ecran.
  - O3 o citește prin convertorul shell (`runde/15/acoperire_instrumente.md`).
- **Comportamentul real** e în 18 scenarii: `referinte/scenarii_real/explorer_*.json` + `scenarii/explorer/*.json`. Starea e în api §5 explorer (`D/api_biblioteca.md`).
- **Lecțiile** care folosesc azi simulatoarele vechi `lectii/_sim/explorer-*.js`:
  - clasa a V-a: `lectii/v/m2-l09`, `m2-l10`, `m2-l11`, `m2-l12`, `m2-l15`, `m5-l31`, `m5-l36`;
  - clasa a VI-a: `lectii/vi/m3-l18`.
  Le citești ca să știi ce drumuri cer: foldere, copiere, mutare, redenumire, ștergere, Coș, sortare. Drumurile le joci pe poligon.

## Ce spune constructorul (de judecat, nu de crezut)
- **Scenariile:** 18 din 18 trec (pe simulatorul vechi treceau 14).
  - O5: 32 → 0 gesturi fără eveniment; O9: 8 → 1 (rămâne unul care cere o lecție cu biblioteca, adică etapa C).
  - O3 pe pagina de probă, cu codul înghețat: 254 de puncte (lecțiile vechi: 1261), iar patru meniuri dau deja 0.
- **Plasa** deschide `meniu_nou`, `meniu_sortare`, `meniu_vizualizare` (cu „Afișați”), `meniu_fisier`, `meniu_fisier_clasic`, `meniu_fundal`, `panou_navigare`, `panou_detalii`.
- **Fișiere comune atinse:** `aplicatii.js` (2 rânduri), `setari.json` (profilul), `poligon.html` (`P.explorer`).
  - Regresul Word / Excel / PowerPoint, pe 5 scenarii fiecare: 13 din 15 trec; cele 2 diferențe Excel ar exista identic la pornire.
- **Nefăcute:**
  - Proprietăți: datele sunt generate, dar comanda dă „aici nu e simulată”;
  - R15-1…R15-16 fără referință: tragerea, Ctrl+Z, singularul din bara de stare, meniul Coșului ș.a.;
  - A15-1: fâșia de desktop cu Coșul de reciclare;
  - etichetele vin de pe PC-ul profesorului, nu de pe cele din laborator.

## Sarcina
1. **A. GRAV vechi:** niciunul (prima rundă de construcție). Scrii „—”.
2. **B. Unghiul ASPECT.** Compari, la același cadru, poligonul cu referința, suprafață cu suprafață: fereastra (bara de titlu cu filele, butoanele de navigare, bara de adrese, căutarea, bara de comenzi, panoul de navigare, zona de conținut cu antetele coloanelor, bara de stare) și fiecare meniu. Verifici:
   - nodurile, numele în ROMÂNĂ, ordinea, tipurile, ce e gri și ce e activ;
   - dreptunghiurile (la 125% → css), fonturile, iconițele (doar Fluent; nicio captură Microsoft, I7);
   - telefonul (360-390 px): bara de comenzi nu se taie, zonele de atins ≥ 32 px.
   Joci apoi 3-4 drumuri din lecții (Folder nou → redenumire; copiere / lipire cu conflict; ștergere → Coș → restaurare; sortare). La fiecare verifici că ecranul = starea și că dialogurile au titlul, întrebarea și butoanele din scenariile reale.
   Judeci „Proprietăți = nesimulat”: dacă vreo lecție o cere, e GRAV.
3. **C. Regresul:** Word, Excel și PowerPoint pe poligon pornesc și se poartă ca înainte. `aplicatii.js`, `setari.json` și `poligon.html` au fost atinse, iar banda Windows (r18) a atins aceleași fișiere: verifici că `?aplicatie=windows` și `?aplicatie=explorer` nu se încurcă.
4. **D.** Ca în reguli.
