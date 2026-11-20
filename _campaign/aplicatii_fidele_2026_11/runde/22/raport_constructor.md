# Runda 22 (B-windows, unghiul `gest_tastatura`) — raportul constructorului, 21.11.2026

Am făcut pașii 2-6 din prompt. Pasul 1 = `masurare_pornire.json`; pașii 7-10 îi face orchestratorul.
- **Ce n-am făcut:** nimic comis, nicio comandă git care scrie.
- **Cum am probat:** headless, doar 127.0.0.1, server pe port liber, cu gesturi reale (mouse, tastatură, `touchscreen.tap`, glisări CDP).

## Numerele întâi
| ce | pornire (codul de azi, c29b583a) | final | dovada |
|---|---|---|---|
| `proba_grav.py`, toate cele 5 GRAV | **35 din 48 de verificări picate** (W1 7/12, W4 2/3, W3 8/9, W2 8/8, W5 10/14) | **0 din 50 picate** (W5 a primit 2 verificări în plus) | `probe_iesiri/proba_grav_pornire.json` → `proba_grav_final.json` |
| regresul: proba rundei 18 (37 de verificări: Start, meniurile, Nou › Folder, ferestrele, evenimentele, asistarea, telefonul) | 37/37 în runda 18 | **37/37** | `probe_iesiri/regres_r18/proba_windows.json` |
| O5 pe Windows (`LH_PAGINI=lectii/v/m2-l08/index.html`, `LH_IESIRE` al rundei) | 3 din 18 | **3 din 18** (aceleași) | `probe_iesiri/O5/oracol_evenimente.json` |
| O9 pe Windows (idem) | 1 din 8 | **1 din 8** (F: nicio lecție nu încarcă Windows, etapa C) | `probe_iesiri/O9/oracol_asistare.json` |
| `genereaza_windows.py --verifica` | 0 | **0** (la zi) | |
| O3 de diagnostic pe poligon (codul înghețat al oracolelor, prin proba r18, partea 2), suprafața `start` | 7 la 1536×864 · 33 la 1366×768 | **11** · **37** (vezi „NESIGUR”) | `probe_iesiri/regres_r18/proba_windows.json › o3` |
| O3 de diagnostic, `meniu_desktop` / `meniu_desktop_clasic` / `bara_activitati` la 1536 | 0 / 0 / 44 | **0 / 0 / 44** | idem |

**Despre O3-ul oficial:** nu se mișcă pe Windows, pentru că nicio lecție din inventar nu încarcă biblioteca Windows (etapa C).

## W1-W5
- **W1 — ÎNCHIS de mine** (cu proba de azi; închiderea o confirmă criticul următor). Meniul nou de pe desktop are acum un singur panou cu cele 10 rânduri.
  - Probat la 1536×864 (clic dreapta la 952,200), la 1366×768 lângă marginea de jos (1024,690) și pe laptopul I1 1093×526 (y 440 și y 120). În toate cele 4 cazuri: fondul cuprinde toate rândurile, iar toate stau deasupra barei și se văd (`elementFromPoint`). La pornire picau 7 din 12 verificări.
  - Cauza reparată: `genereaza_windows.py:197-213`. Funcția `fereastra_care_cuprinde` alege fereastra care își cuprinde comenzile, adică `ferestre[0]` 304×385, nu `[1]`. `date/windows.json › meniu_desktop.rect` = [0,0,304,385].
  - Fondul se calculează din marginile rândurilor (`windows.js:585-590`). Încadrarea pe verticală folosește acum 385 px.
  - Celelalte capturi cu mai multe ferestre sunt verificate (`diferente.md` D3): doar `bara_activitati` mai are două ferestre, iar acolo alegerea pe clasă (`Shell_TrayWnd`) e corectă.
- **W4 — NEÎNCHIS (parțial).** Am făcut:
  - dosarul galben pe butonul Explorer (`windows.js:126-129`);
  - numele „Explorer” apare după 0,5 s cât ții mouse-ul pe buton, pentru toate butoanele din mijlocul barei (`windows.js:162-188`);
  - clicul fără fereastră deschisă dă evenimentul §4 + mesajul central. Proba trece 3/3.

  Ce lipsește: clicul nu deschide Explorer-ul bibliotecii. `explorer.js` (banda r19) nu expune un mod de montare într-o fereastră Windows. Cererea e **A22-1** în `de_aprobat.md`, cu cele 4 motive tehnice.
- **W3 — ÎNCHIS de mine.** Comportamentul e citat din pagina Microsoft „Use a screen reader to explore and navigate the Start menu in Windows” (`diferente.md` D9-D10).
  - Tasta Windows urmată de „pai” scrie „pai” în caseta din Start, iar rezultatul „Paint” apare.
  - Clic pe rezultat → Paint pornește (fereastra activă, butonul ei cu linia în bară), iar Start se închide.
  - „calc” + Enter → Calculator. Sus / Jos aleg rezultatul. Backspace șterge.
  - Un text fără potrivire → mesajul central, încă pe ecran după 1,2 s.
  - Evenimentele au ținta `start:Căutați aplicații, setări și documente` și acțiunea `cautare`.
  - Codul: `windows.js:372-410` și `:479-560`; ramura din `tasta` e la `:707`.
  - Panoul de rezultate și ferestrele pornite sunt „simple și oneste”: R22-1, R22-2, A22-3.
- **W2 — ÎNCHIS de mine.** Start › „Toate” are cele 7 categorii din `start_toate`.
  - Generatorul le aduce în lista nederulată, cu derularea de 545 px dintre capturi (`genereaza_windows.py:230-280`).
  - Butoanele sunt 68×68, în grilă 2×2, câte 3, cu ținta lor (clic = mesajul central). Al 4-lea loc e desenul „celelalte”.
  - Lista se derulează până la capătul ei din referință (`start.toate.jos` = 1283):
    - cu rotița: „Accesibilitate” intră în vedere;
    - cu tastatura: Tab duce la Fixate, săgețile mută focusul, iar lista urmează focusul (sursa Microsoft, `diferente.md` D8);
    - cu degetul, la 360 și 390 px.
  - La pornire picau 8 din 8 verificări.
- **W5 — ÎNCHIS de mine.** Probat pe telefon, la 360×740 și 390×844:
  - Minimizare / Maximizare / Închidere stau în ecran;
  - glisarea barei de titlu mută fereastra (`touch-action:none`);
  - atingerea pe Minimizare ascunde fereastra, iar butonul Explorer din bandă se vede și o readuce;
  - nu mai e niciun gol între butoanele benzii (golul de 178 px a dispărut);
  - pagina nu se lățește.

  Codul: `windows.js:241-244` (încadrarea), `:323-333` (pașii după lățimea desenată), `:352-368` (banda = până la tava desenată, aplicația activă în vedere).
  - Regres prins pe drum de proba r18 (partea 3): banda derulată scotea Start-ul din vedere. L-am reparat așa: pe telefon Start stă fix în afara benzii (A22-2). Proba are acum o verificare pentru asta.

## Fișiere comune atinse
- **Niciunul** (`aplicatii.js`, `panglica.js`, `stare.js`, `aplicatii.css`, `poligon.html`, `setari.json`, `versiune.json`, `api_biblioteca.md` sunt neatinse de mine).
  - Schimbările din `aplicatii.js`, `explorer.js`, `word.js`, `excel.js` din `git status` sunt ale benzilor r19-r21.
  - Probele mele au trecut cu `aplicatii.js` așa cum era pe disc la 00:50, cu reparația E1 a lui r19 în lucru.
- **Doar adăugat la coadă:**
  - `de_verificat.md` (blocul RUNDA22-WINDOWS: R22-1…R22-5);
  - `de_aprobat.md` (blocul RUNDA22-WINDOWS: A22-1…A22-3).
  - Copiile de dinainte sunt în `runde/22/inainte/`.
- Fiindcă nu e atins niciun fișier comun, regresul pe Word / Excel / PowerPoint nu e cerut (`CICLU_PARALEL.md:51`).

## Fișierele benzii
- **Schimbate:**
  - `aplicatii/windows.js` (603 → 805 rânduri);
  - `aplicatii/_unelte/genereaza_windows.py`;
  - `aplicatii/date/windows.json` (regenerat).
  - Copiile de dinainte: `runde/22/inainte/`.
- **Dosarul rundei:**
  - `cadru.md`, `tinta.md`, `contra.md`, `diferente.md`;
  - `proba_grav.py`, `proba_regres_r18.py` (copia probei r18, cu ieșirea în runda 22), `capturi.py`;
  - `probe_iesiri/` (cu `capturi/*.png`).
- **Date personale:** nicio cale cu numele contului în fișierele schimbate (grep: 0).

## FĂCUT / NEFĂCUT / NESIGUR
**FĂCUT:**
- W1, W2, W3, W5 cu proba de azi (0 picate din 50);
- W4: aspectul și indiciul;
- regresul r18 37/37, O5 și O9 neschimbate.

**NEFĂCUT:**
- W4, deschiderea Explorer-ului bibliotecii. Deblocatorul: A22-1, opțiunea de montare din banda r19.
- MINOR-urile din critic 18 §6: n-am mai avut loc în rundă. Rămân pentru runda următoare:
  - opacitatea Start;
  - lățimea de 12 px a lui „Afișați desktopul”;
  - ținta `desktop` pentru clic dreapta pe desktopul gol;
  - `deschise_ref` cu KeePassXC / Terminal în `windows.json`.

**NESIGUR:**
- **O3 de diagnostic pe `start` a urcat cu 4** (7 → 11 la 1536, 33 → 37 la 1366), din două cauze:
  - 3 diferențe `in_plus`: categoriile Altele, Divertisment și Accesibilitate. În captura `start` (nederulată) ele sunt `in_afara_ecranului`. La noi sunt în DOM, dar derulate în afara listei, iar extractorul O3 nu taie după containerul derulabil.
  - 1 diferență `in_plus` „[utilizator]”: potrivirea comenzii ascunse s-a mutat.

  O3-ul oficial nu vede Windows până la etapa C. Decizia (să le păstrez, să ascund ce e în afara listei ca virtualizarea XAML, sau să schimb regula O3 într-o rundă `acoperire`) e a orchestratorului.
- **Fără referință** (rândurile din `de_verificat.md`):
  - panoul de rezultate (R22-1);
  - Paint / Calculator (R22-2);
  - numele categoriei sub cutie (R22-3, dedus din geometrie);
  - dosarul galben și indiciul (R22-4);
  - ordinea completă a lui Tab (R22-5).
- **Sursa Microsoft a tastaturii din Start** (pagina de cititor de ecran, citată în `diferente.md`) nu e în `surse_microsoft.md`, care e înghețat. O rundă `acoperire` ar trebui s-o îngheațe.
- **Butonul Maximizare** al ferestrei generice își păstrează numele și când fereastra e maximizată. Lecția v/m2-l08 spune „Restabilire jos”. E de dinainte (R18-4, fără referință) și n-am atins.
