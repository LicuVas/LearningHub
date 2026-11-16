# Contract — comenzile pe care elevul nu le poate folosi (10.11.2026)

**Cererea, verbatim:** „/bucla - foloseste /promptExpert pentru a cauta si alte defecte de interfata similare pe site.”
(după „Pe learninghub Lectia 18 - atelier - nu apare save si nici save as” — reparat în `8be131ce`.)

**Proba realității:** elevul, la calculatorul din laborator (fereastra browserului ~1366x657, uneori zoom 125%) sau pe
telefon, face exercițiul din simulator: apasă un meniu, o listă, un buton și vede și poate apăsa tot ce îi cere lecția.

**„Similar” înseamnă:** o comandă de care elevul are nevoie există în simulator, dar nu se poate vedea sau folosi —
tăiată de o fereastră/cutie (overflow), acoperită de alt element, ieșită din ecran, imposibil de atins pe telefon.
NU: texte, întrebări, pedagogie, culori/spații care nu ascund nimic.

| R# | cerința | cine verifică | gata înseamnă |
|---|---|---|---|
| R1 | căutarea acoperă TOATE lecțiile cu simulator (116: lectii/v, vi, vii, viii), pe laptop și telefon | oracolul `lectii/_build/oracol_controale_taiate.py` | „Lecții măsurate: 116”, 0 erori de măsurare |
| R2 | oracolul prinde defectul original | proba pe codul vechi (`OC_INLOCUIESTE`) | VIII/18 vechi: >0 (măsurat: 52); reparat: 0 |
| R3 | defectele găsite de oracol sunt reparate | oracolul | ultima linie = 0 |
| R4 | criticii caută ce oracolul nu vede (dialoguri, meniu contextual, modul test, zoom 125%, atingere, bara fixă a lecției), cu unghiuri scrise prin /promptExpert | bucla `critic-loop` | `stoppedBy` = runde goale (convergență), nu limita |
| R5 | reparațiile nu strică lecțiile | `jocuri/_motor/test_joc.py` pe fiecare lecție care folosește un simulator atins | toate [TRECUT] |
| R6 | aspectul rămâne cel din Windows 11 RO; un meniu deschis poate ieși din fereastră (modelul Notepad) | eu, pe capturi | captură înainte/după pe 1 lecție per simulator atins |
| R7 | ce se repară ajunge la elevi | `git push` + fișierele servite de learninghub-8z6.pages.dev = cele de pe disc | comparație fără diferențe |
| R8 | raportul spune ce NU acoperă căutarea | eu | secțiune „neacoperit” în raport |

**Nu intră:** BibliotecaExcel, serverul de teste / panoul profesorului, aplicațiile reale, fișierele din `_proba`, `_verificare`, `inainte*`.

## Rezultat (11.11.2026, ~02:30)
- R1: selecția oracolului lărgită după T1 (P2): 119 lecții cu motor + 2 lecții-joc cu panglică = **121 de pagini**, toate 0
  (oracol_final_115lectii.txt + oracol_completare_6pagini.txt). „116” din contract era o numărătoare de fișiere, nu de lecții.
- R2: VIII/18 vechi 52 → reparat 0; Explorer vechi (clic dreapta) prins, reparat 0 (T1, P1).
- R3: 188 → 0 (bucla); 410 la prima măsurătoare = 222 fals-pozitive (details închise) eliminate din oracol.
- R4: **NEÎNDEPLINIT strict**: bucla s-a oprit la limita de 5 runde (rundele 2, 3, 5 goale; runda 4 a găsit meniul Explorer).
- R5: test_joc 44/44 (42 de lecții + 2 lecții-joc) — test_joc_44.txt.
- R6: capturi înainte/după pentru cele 9 fișiere atinse, laptop + telefon — capturi_inainte_dupa/ (capturi_inainte_dupa.py).
- R7, R8: în raportul final.
