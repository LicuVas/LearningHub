# Runda 1 · etapa B · Word — raportul constructorului (pașii 1-7; criticul și publicarea sunt ale orchestratorului)

## Numerele întâi
| | pornire (`masurare_pornire.json`, `masurare_pornire_O6.json`) | după (pasul 7: `masurare_dupa.log`) | partea Word |
|---|---:|---:|---|
| O1 central | 61 | 61 | lecțiile nemutate (etapa C) |
| O2 identic | 13392 | 13392 | idem |
| O3 interfața | 18546 | 18546 | lecțiile; diagnosticul pe poligon (cod O3): Word 8248 → **392** |
| O4 comportament | 162 | **128** | Word ≈ 74 → **10** (45/54 scenarii ca Word real) |
| O5 evenimente | 201 | **154** | Word 48 → **1** |
| O6 sarcini | 0 (la pornire NECONCLUDENT la 1800 s în paralel; reluat singur: 0, 900 s) | 0 | — |
| O7 text UI | 355 | **794** (REGRES semnalat de masoara) | **+439 `lipsa_in_biblioteca`** (regres.md §1) |
| O8 comenzi moarte | 102 | 102 | lecțiile |
| O9 asistare | 48 | **41** | Word 8 → **1** (cazul F cere o lecție) |
| porți | 42 (cum_fac 41, test_joc 1: `recapitulare-v`, clic depășit 6 s sub sarcina paralelă) | 41 (cum_fac 41; test_joc 0, controale_taiate 0, fereastra_mica 0, date_personale 0, word2007_j2 0) | |
| repere.lock | INTACT (306) | ok; `ingheata.py --verifica` → 0 | |

## FĂCUT (cu dovada observată)
- **Biblioteca centrală** în `C:/00/Projects/LearningHub_fidel/aplicatii/` (fișiere NOI, necomise): `aplicatii.js`,
  `aplicatii.css`, `panglica.js`, `stare.js`, `word.js`, `date/word.json`, `date/LICENSE-fluent-icons.txt`,
  `profiluri/word365.json`, `profiluri/word2007.json`, `setari.json`, `versiune.json` (`{"runda":1,"nonce":"nepublicat"}`,
  îl rescrie orchestratorul la publicare), `poligon.html`, `_unelte/genereaza_word.py`, `_unelte/masoara_poligon.py`.
- **Interfața Word generată din referință**: `genereaza_word.py --verifica` → 0 (word.json = exact ce dă `uia_word.json`;
  45 de suprafețe, ~2300 de noduri, 73 de icoane Fluent MIT). Diagnosticul cu codul înghețat al lui O3 pe poligon:
  8248 (nimic desenat) → 392; 43 de suprafețe la 0 (toate filele, file contextuale, Backstage, meniurile de clic dreapta,
  dialogurile cu filele lor). Rămân 387 = filele Page Border/Shading ale dialogului Borders and Shading (nicio comandă
  vizibilă din referință nu-l deschide) + 4 poziții în zona documentului + 1 bara Acces rapid (ascunsă ca în referință).
- **Comportamentul Word** pe scenariile reale: O4 Word 10, din care 7 sunt scenarii fără rezultat real probat (nu pot
  trece niciodată), 1 neexecutabil (`word-imagine-inserare`: pasul apasă `mso:PictureInsertFromFile`, care în Word e în
  lista Pictures ▾), 1 diferență sub-pixel (clic în mijlocul literei, 10 în loc de 9). Rezultatele mele pe cele 7 fără
  real: `word2007-*` dau exact valorile declarate (`ab`, `abc`, `Titlu/Te`, `Mergem la fi`).
- **Evenimentele §4** pe toate cele 48 de gesturi Word, mai puțin `acces_rapid` (O5 Word 1). Clicul se recunoaște la
  ridicarea butonului, deci și dublul clic care redesenează paragraful.
- **Asistarea §6**: cazurile A, B, C, D, E, G, H trec pe Word (O9); F cere o lecție (etapa C).
- **`tipMotor` §8.1** (render cu „Verifică” pe stare, rezolva/gresit pentru test_joc/O6) — neprobat încă pe o lecție.
- **Profilurile** `word365` / `word2007` (aceeași interfață, altă grupare a anulării) — `?profil=word2007` pe poligon.
- **Tastele de acces (Alt…)** din referință (971 de noduri cu KeyTip); scurtăturile Ctrl+D, Ctrl+Shift+V, Ctrl+S (salvat)
  și File › Save As › Browse, Orientation (Portrait/Landscape), Margins (Narrow/Custom), Pictures ▾ (This Device…) —
  citate din paginile Microsoft (URL-urile în `diferente.md` A20-A22).
- **I1 telefon**: la 375 px benzile se derulează lateral, butoanele de 24 px devin 32 px, pagina pornește la „lățimea
  paginii”. **I9**: deschis în 0,42 s cu procesorul încetinit de 4×. Poarta `date_personale` cu biblioteca pe disc: 0.
- Artefactele rundei: `cadru.md`, `tinta.md`, `contra.md`, `diferente.md`, `regres.md`, `gata_pentru_critic.md`, acest
  raport; `iesiri_pornire/`, `iesiri_partiala/`, `iesiri/` (după); secțiunea „Runda 1” în `de_verificat.md`.

## NEFĂCUT (cu deblocatorul numit)
- Pașii 8-9 (criticul, commit, merge, push, nonce) — ai orchestratorului, după supliment.
- O7 +439 și Explorer în O4 — **hotărârea orchestratorului** (regres.md): biblioteca rămâne pe disc, necomisă.
- Comenzile Word fără scenariu real dau mesajul central (diferente.md B6-B7) — deblocator: scenariile din
  `de_verificat.md` R1-4/R1-5 (o rundă `acoperire`).
- Listele deschise (Bullets ▾, Numbering ▾, Borders ▾, restul Margins ▾, Table ▾ sub grilă) — deblocator: captura lor
  (de_verificat R1-2). Fără ea, dialogul Borders and Shading rămâne accesibil doar prin plasa oracolelor.
- Excel, PowerPoint, Explorer, Windows, Paint — valurile următoare (motorul `panglica.js` e gata pentru Office).

## NESIGUR
- Geometria la containere mai înguste de 1366 px (lecțiile, etapa C): benzile se derulează, nu se reașază (diferente B13).
- Copierea/decuparea + lipirea și tragerea pentru selecție: fără rezultat real (de_verificat, deja listat).
- Ordinea rândurilor din Pictures ▾ și pagina pe care o deschide File (de_verificat R1-1, R1-7) — [NEVERIFICAT].
- „Language Romanian”, Left-to-Right/Right-to-Left și bara Acces rapid ascunsă sunt copiate din referință, unde sunt ele
  însele [NEVERIFICAT] (README_referinte).

## Concluzia
Biblioteca + Word există și se poartă ca Word real pe 45 din 47 de scenarii cu rezultat probat; interfața generată din
referință iese aproape fără diferențe pe poligon. Oracolele oficiale de interfață (O3/O8) nu o pot vedea până la etapa C,
iar O7 crește din construcția lui, nu dintr-un defect al bibliotecii — de hotărât înainte de publicare. **GATA_PENTRU_CRITIC**
(cu regresul O7/Explorer semnalat).
