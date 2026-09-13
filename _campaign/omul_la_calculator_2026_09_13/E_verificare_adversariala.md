# Verificare adversarială — protocolul „Omul la calculator” (E_protocol, v1)

Data: 13.09.2026. Cine: un verificator care NU a scris protocolul; mandatul = să-l facă să pice.
Nu am modificat protocolul, poarta (`G_poarta.py`) sau unealta de văzut (`H_vede.py`).
Tot ce e „observat” mai jos a fost rulat de mine, în
`C:\Users\licuv\AppData\Local\Temp\claude\C--00-AI-0\d1ddcc30-0251-43d9-a426-7c5c0b2e2d92\scratchpad\verif\`
(scripturile: `mk_fake.py`, `mk_xlsx.py`, `read_xlsx.py`, `mk_docx.py`, `pdf2png.py`).

**Pe scurt:** 6 blocante · 18 importante · 10 minore.
Cea mai gravă: **poarta dă exit 0 pentru o evaluare în care nu s-a făcut nimic** în afară de rularea lui `H_vede.py`,
și chiar pentru una care folosește `C:\Windows\explorer.exe` drept dovadă. Iar ruta de recalculare Excel din protocol
dă rezultatul **invers** față de Excel-ul în română.

---

## 1. PĂCĂLIREA PORȚII (trece cu exit 0 fără munca reală)

### B1 — Evaluare falsă, zero muncă, trece poarta · **blocant**
- **Dovada.** Am copiat doar ieșirea lui `H_vede.py` într-un folder de lecție și am scris un `log.json` cu:
  U1 FACUT cu dovada `consola.json`; U2 FACUT cu `proiector_25.png`; U3, U15, U16 FACUT cu `innerText.txt`;
  toate celelalte NESIGUR cu aceeași notă de 72 de caractere („nu se poate verifica fara sala reala…”);
  `findings: []` + `no_findings_reason` de 70 de caractere.
  ```
  python G_poarta.py ...\fake\F_evaluari\cls8\lectia3-formule
  OK   ...\fake\F_evaluari\cls8\lectia3-formule
  1/1 lectii trec; 0 probleme      exit=0
  ```
- **De ce trece.** U1 cere doar „un fișier care nu e .md” — orice ieșire a lui H_vede (json, png, txt) îl satisface.
  U3/U15/U16 cer doar „un fișier existent, negol”. U4, U5, U8–U14, U17 pot fi NESIGUR cu orice notă ≥ 40 de caractere.
  Zero semnalări sunt permise.
- **Fix concret (în poartă):**
  1. Fișierele produse de H_vede NU contează ca dovadă pentru nimic în afară de U2/U15:
     `H_VEDE = {"ecran_prima_vedere.png","pagina_intreaga.png","proiector_25.png","innerText.txt","innerText_vizibil.txt","consola.json","masuri.json"}`;
     pentru U1, U3, U4, U16: `existing = [p for p in existing if Path(p).name not in H_VEDE]`.
  2. U1 pe clasă (tipul artefactului + îl deschide):
     cls6 → `.pptx` deschis cu `pptx.Presentation`, ≥ 2 diapozitive; cls7 → `.docx` deschis cu `docx.Document`, ≥ 3 paragrafe;
     cls8 → `.xlsx` cu ≥ N formule (N = numărul de `<code>=` din secțiunea `practice-section` a lecției) ȘI o copie recalculată
     în care `openpyxl.load_workbook(..., data_only=True)` dă valori ne-None pe acele celule;
     cls5 → `playwright_run.json` cu câte o intrare per întrebare de chestionar (numărul din `B_inventar.csv`, coloana `quiz_items`),
     fiecare cu `varianta_apasata` și `ce_s_a_intamplat`.
  3. Un PNG randat din artefactul U1 (`*_p1.png`) cu `mtime` mai nou decât artefactul.

### B2 — Dovezi din afara folderului lecției și text fals al lecției · **blocant**
- **Dovada.** Al doilea fals: `innerText.txt` = 250 de litere „x” (nici măcar textul lecției); toate cele 17 verificări FACUT
  cu dovada `C:\Windows\explorer.exe` (U2: o captură din ALT folder, cale absolută); o semnalare „blocant” cu citat inventat
  („apasa pe butonul Magic”) și `dovada_fisier: ../../../../cls8_l3/masuri.json`.
  ```
  OK   ...\fake\F_evaluari\cls8\lectia4-functii
  1/1 lectii trec; 0 probleme      exit=0
  ```
- **De ce trece.** `d / p` cu `p` absolut dă chiar `p` (regula lui pathlib), iar `..` nu e oprit. `innerText.txt` e verificat doar la ≥ 200 octeți.
- **Fix concret:**
  ```python
  def inside(d, p):
      q = (d / p).resolve()
      return q.is_relative_to(d.resolve()) and q.is_file() and q.stat().st_size > 0
  ```
  folosit și pentru `evidence`, și pentru `dovada_fisier`. Plus: `masuri.json["titlu"]` trebuie să fie egal cu `<title>` din
  fișierul `data["lesson"]` (care trebuie să existe), iar `innerText.txt` trebuie să conțină primele 60 de caractere din `<h1>` al lecției.

### B3 — Poarta dă exit 0 pe o cale greșită sau pe un folder gol · **blocant**
- **Dovada.**
  ```
  python G_poarta.py ...\fake\F_evaluari\cls8\lectie-inexistenta   ->  0/0 lectii trec; 0 probleme   exit=0
  python G_poarta.py ...\empty\F_evaluari                          ->  0/0 lectii trec; 0 probleme   exit=0
  ```
  Cauza: linia 118, `A or not any(...) and root.name.startswith("lectia")` — dacă numele nu începe cu „lectia”
  (o greșeală de tastare, un nume de folder cu altă formă), lista e goală și nu e nicio eroare.
  Un agent care greșește calea vede „exit 0” și raportează „poarta a trecut”.
- **Fix:** `if not root.is_dir(): print("cale inexistenta"); return 2` și `if not dirs: print("nicio evaluare gasita"); return 2`.
  Orchestratorul rulează mereu cu `--astept`.

### I1 — Lista „mereu posibil” e prea scurtă · **important**
- **Dovada.** În B1, U4 (mediul), U8 (citit înapoi), U10 (doi identificatori), U12 (cronometru), U13 (alternative), U14 (pre-mortem)
  au trecut ca NESIGUR cu o notă generică. Toate se pot face fără sală: U8/U10 sunt citire, U4 = declari ce presupune lecția,
  U12/U13/U14 sunt raționament cu verificări pe disc. Exact verificările noi, pentru care există protocolul, pot fi sărite.
- **Fix:** `MEREU_POSIBIL = {"U1","U2","U3","U4","U5","U8","U9","U10","U12","U13","U14","U15","U16"}`; NESIGUR permis doar la U6, U7, U11, U17.
  Pentru NESIGUR: notă ≥ 80 de caractere, conține „?” (întrebarea pentru Vasile, cum cere protocolul la „Ce NU faci”),
  și nicio notă identică la două verificări (`len(set(notes)) == len(notes)`).

### I2 — Citatele din semnalări nu sunt verificate · **important**
- **Dovada.** Citatul inventat „apasa pe butonul Magic” din B2 a trecut. Poarta cere doar ≥ 15 caractere în `dovada`.
- **Fix:** câmp nou `dovada_tip: "citat"|"observatie"`. La „citat”: textul dintre ghilimele, normalizat
  (`re.sub(r"\s+"," ",...)`), trebuie să apară în `innerText.txt` normalizat. La „observatie”: `dovada_fisier` obligatoriu, în folder.
  Semnalările `blocant` cer mereu `dovada_fisier` (U5 = reproducerea, nu vorba).

### I3 — Ce cere protocolul, poarta nu verifică · **important**
- **Dovada (citind codul):** poarta nu se uită la `01_citit_inapoi.md`, `03_jurnal_sarcina.md`, `04_a_doua_cale.md`, `05_evaluare.md`,
  la secțiunea `## <lecția>` din `JURNAL.md`, la `timp_estimat_minute`, la câmpul `citit`, la `rol`.
- **Fix:**
  - fișierele 01/03/04/05 există și au ≥ 300 de caractere;
  - `03_jurnal_sarcina.md` are cel puțin atâtea rânduri `pasul N` câte elemente `<li>` sunt în `ol.practice-questions` din lecție;
  - `citit`: intervalele „rândurile a-b” trebuie să acopere 1..numărul de rânduri din `innerText.txt`;
  - `timp_estimat_minute`: numere > 0, iar `verdict == "incape"` ⇔ `sarcina + pornire <= 50`;
  - U16: câmp numeric `diacritice_la_1000`; poarta îl recalculează din `innerText.txt` și cere o diferență ≤ 0,5;
  - `JURNAL.md` conține `## <numele lecției>`;
  - U3: în loc de .md liber, `a_doua_cale.json` = listă de `{ce, cale1, val1, cale2, val2}` cu `cale1 != cale2`, valori negoale, ≥ 2 rânduri.

### I4 — Agentul verificat își poate modifica poarta · **important**
- **Dovada.** Uneltele subagentului includ Write și Edit; `G_poarta.py` stă în folderul pe care îl scrie. Cercetarea A §5 citează chiar
  asta (METR: modele care modifică testele).
- **Fix:** orchestratorul ține SHA-256 al lui `G_poarta.py` și `H_vede.py` înainte de campanie și, la final, rulează o copie
  din afara folderului campaniei; o nepotrivire de hash = evaluarea e respinsă. Plus `git diff --quiet -- content/` pentru regula
  „nu modifica fișierele lecției” (azi neverificată de nimeni).

### I5 — Referința „auditul pe text” stă la îndemâna agentului, iar metrica e auto-declarată · **important**
- **Dovada.** `CAMP\C_baseline\cls8_lectia3-formule.md` (149 de rânduri, recenzia pe text) e în folderul campaniei; protocolul nu
  interzice citirea lui. Protocolul cere în raport „câte `prindea_auditul_pe_text: nu`” — agentul își dă singur nota.
- **Fix:** mută `C_baseline` în afara lui CAMP până la final. Poarta (sau orchestratorul) compară fiecare semnalare cu
  `C_baseline\<lectie>.md` și cu `_campaign\proba_elevi_2026_09_03\confirmate.json` (cuvinte comune ≥ 60% sau același citat)
  și schimbă forțat în `"da"`; câmpul `de_ce` ≥ 40 de caractere.

---

## 2. CE NU POATE FACE MEDIUL (sau face greșit) — testat

### B4 — Excel: ruta din protocol dă rezultatul INVERS față de Excel-ul în română · **blocant**
- **Ce cere protocolul (pasul 3, cls VIII):** „pune exact formulele scrise în lecție (copiază-le din text, cu separatorul lor);
  recalculează cu LibreOffice și citește valorile”.
- **Dovada (rulat):** 4 fișiere cu A1=1, A2=2, A3 = formula; `soffice --headless --convert-to xlsx:"Calc MS Excel 2007 XML"`; citit cu `data_only=True`:
  ```
  sum_en.xlsx        =SUM(A1:A2)   -> 3
  sum_comma.xlsx     =SUM(A1,A2)   -> 3
  sum_semicolon.xlsx =SUM(A1;A2)   -> '#VALUE!'
  suma_ro.xlsx       =SUMA(A1;A2)  -> '#VALUE!'   (LibreOffice a salvat-o ca '=suma(A1;A2)')
  ```
- **De ce e grav.** În fișierul `.xlsx` formulele se păstrează MEREU în forma englezească, cu virgulă — indiferent de limba
  în care le tastează omul. Setările regionale contează doar la TASTARE, în program. Deci agentul va raporta:
  formula cu `;` din lecție „dă eroare” (fals — pe un Windows în română e exact forma bună) și formula cu `,` „merge” (fals —
  pe un Windows în română virgula e zecimală). `B_context_real.md` §4b a găsit tocmai amestecul `;`/`,` în lectia4 și lectia6:
  protocolul ar produce acolo semnalări greșite, cu „dovadă” reală.
- **Fix:** scoate „cu separatorul lor” din U1. În loc: (a) U1 scrie formulele în forma de fișier (engleză, virgulă) și verifică
  VALORILE față de ce promite lecția („Suma Anei trebuie să fie 30”); (b) separatorul și numele funcțiilor sunt o verificare U4
  separată, pe text: „lecția scrie `;` / `,` — pe ce setare regională merge fiecare”, cu gravitatea legată de faptul necunoscut
  (vezi I15). Poarta: la cls8, orice semnalare cu `#VALUE!`/`Err:` în dovadă + `;` în formulă → respinsă cu mesajul „artefact de format de fișier”.

### B5 — LibreOffice pornit de mai mulți agenți deodată pierde fișierele în tăcere · **blocant**
- **Dovada (rulat):** 6 conversii identice pornite simultan, cu profilul implicit:
  ```
  run 1: sum_en.xlsx | exit=0
  run 2:             | exit=0
  run 3:             | exit=0
  run 4:             | exit=1
  run 5:             | exit=0
  run 6:             | exit=0
  ```
  5 din 6 n-au produs nimic; 4 din acelea au ieșit cu 0. O campanie cu mai mulți subagenți în paralel (25 de lecții) lovește exact asta:
  agentul crede că a randat/recalculat, apoi citește un fișier vechi sau nu găsește nimic și improvizează.
  (Cu o instanță headless deja pornită, conversia a mers, dar fără linia „convert …” în ieșire. Cu un LibreOffice deschis vizibil de utilizator nu am testat — ar fi fost intruziv.)
- **Fix:** în protocol, comanda exactă cu profil separat per lecție:
  `"C:\Program Files\LibreOffice\program\soffice.exe" "-env:UserInstallation=file:///<L cu slash-uri>/lo_profile" --headless --convert-to pdf --outdir "<L>" "<fisier>"`
  (testat: merge și cât timp altă instanță rulează). După fiecare conversie: verifică că fișierul-țintă există și are `mtime` mai nou decât
  sursa; altfel e eșec, nu „OK”. Mai simplu: o funcție `randare(fisier, L)` în `H_vede.py`/un `H_randeaza.py` care face asta și aruncă eroare.

### B6 — U1 la Office nu testează ce face elevul; la animații nici nu se poate, dar poarta cere FACUT · **blocant**
- **Dovada.** Pașii elevului sunt de interfață: `lectia3-formule.html:544-547` — „scrie formula… Apasă Enter”, „trage drag handle-ul în jos
  până la F6”. `python-docx`/`openpyxl`/`python-pptx` scriu direct rezultatul; niciun clic, nicio filă, niciun meniu nu e atins.
  Deci U1 dovedește „produsul final se poate construi de un programator”, nu „un copil poate urma pașii”. Exact blocajele omului
  (numele filei, unde e butonul, drag handle) rămân nevăzute — dar poarta le trece ca FACUT.
  La animații/tranziții (cls6 lectia4, lectia5): `python-pptx 1.0.2` nu are API pentru ele (în pachet apar doar ca nume de tag XML
  `p:transition`, `p:timing` în `oxml/slide.py:162-305`), iar exportul PDF din LibreOffice nu arată animații. Protocolul zice
  „nu sări: notează pasul”, poarta zice „U1 nu poate fi NESIGUR” → agentul e împins să facă un .pptx trivial și să scrie FACUT.
- **Fix:** în `03_jurnal_sarcina.md` (și un `03_pasi.json` citit de poartă) fiecare pas are `tip`:
  `"rezultat"` (executat cu biblioteca, cu valoare observată) sau `"interfata"` (neexecutabil fără program; obligatoriu:
  numele comenzii din lecție + ce am găsit în sursa Microsoft en-us ȘI ro-ro, cu URL). Poarta: fiecare pas `interfata` are URL și
  `gasit: da|nu`; U1 FACUT cere ≥ 1 pas `rezultat` executat. Pentru lecțiile de animații/tranziții: U1 FACUT = XML-ul `p:timing`/`p:transition`
  scris și recitit din fișier (se poate, prin lxml), iar partea „ce vede elevul” rămâne explicit pas `interfata`.

### I6 — Deschiderea prin `file://` inventează o resursă lipsă · **important**
- **Dovada.** `consola.json` pe cls7 lectia5 și cls8 lectia3: `"resursa_lipsa": "file:///C:/assets/js/site-credit.js"`.
  Lecția are `<script src="/assets/js/site-credit.js" defer>` (`lectia3-formule.html:652`), cale de la rădăcina site-ului;
  fișierul EXISTĂ: `C:\00\Projects\LearningHub\assets\js\site-credit.js`. Pe `file://` rădăcina e `C:\`. Pilotul (`D_…md`, punctul 5)
  a raportat-o deja ca observație — e un fals pozitiv.
- **Fix:** `H_vede.py` pornește `python -m http.server` pe `C:\00\Projects\LearningHub` (port liber) și deschide
  `http://127.0.0.1:<port>/content/tic/...`; sau filtrează în `consola.json` resursele `file:///C:/assets/`.

### I7 — Capturile „toată pagina” arată doar începutul lecției · **important**
- **Dovada.** cls7 lectia5 (8.055 de cuvinte): `pagina_intreaga.png` = 1366×2062, `ecrane: 2.7`, `elemente_text_ascunse: 212`;
  cls8 lectia3: 1366×2953, 117 elemente ascunse. Atomii sunt deblocați pe rând de JS, deci exercițiile și chestionarele de mai jos
  nu apar în nicio captură. U2 („mă uit la ce vede elevul”) acoperă doar primul ecran; protocolul nu dă nicio unealtă ca să ajungi la exerciții.
- **Fix:** `H_vede.py --parcurge`: apasă butonul de continuare până nu mai există, face o captură 1366×768 la fiecare atom
  (`atom_NN.png`) și la secțiunea `#practice`; poarta cere la U2 cel puțin o captură a secțiunii de exerciții.

### I8 — `innerText.txt` e de fapt `textContent`: amestecă ce vede elevul cu rezolvările ascunse · **important**
- **Dovada.** În `innerText.txt` (cls8 lectia3) apare `Rezultate: Ana - Suma 30` — textul din `<details class="practice-solution">` pliat.
  Din cele 7 întrebări de chestionar, 6 nu sunt în `innerText_vizibil.txt`, dar toate sunt în `innerText.txt`, fără nicio marcă.
  17% din fișier e spațiu (3.792 din 22.445 de caractere); pe cls7 lectia5 fișierul are 64.783 de octeți și 1.726 de rânduri.
- **Riscul.** „ELEVUL” citește cu rezolvarea în față și conclude „e clar ce am de făcut”.
- **Fix:** în JS, marchează la extragere blocurile ascunse (`[ASCUNS: rezolvare]…[/ASCUNS]` pentru `details:not([open])`,
  `[ASCUNS: atom N]` pentru `!offsetParent`), și comprimă spațiile (`re.sub(r"[ \t]+"," ")`, rânduri goale multiple → unul).

### I9 — Copierea formulei „în jos” nu e simulată · **important**
- **Dovada (rulat).** `drag_naive.xlsx`: F2 = `=SUM(B2:E2)`, apoi F3 = aceeași valoare (cum ar „copia” un script). După recalculare:
  `F3 value= 30 formula= '=SUM(B2:E2)'` — pentru Ion (suma reală 37). Excel ar fi scris `=SUM(B3:E3)`. Agentul fie scrie el formula
  bună pe fiecare rând (și sare exact pasul pe care îl învață lecția: referințe relative/absolute, `$B$1`), fie scrie greșit și acuză lecția.
- **Fix:** în protocol, o frază + comanda: copierea se face cu `from openpyxl.formula.translate import Translator;
  ws["F3"] = Translator(ws["F2"].value, origin="F2").translate_formula("F3")`, iar U3 verifică valorile din a doua și a treia celulă, nu din prima (A §2.2).

### I10 — „Sursa primară” Microsoft ro-ro nu decide separatorul, și contrazice premisa „SUMA” · **important**
- **Dovada (WebFetch, 13.09.2026)** pe `https://support.microsoft.com/ro-ro/office/funcția-sum-043e1c7d-7726-4e80-8f32-07b23e057f89`:
  sintaxa `SUM(număr1,[număr2],...)`, exemple `=SUM(A1,A2,A3,B1,B2,B3)` — și pe aceeași pagină `=14598,93+65437,90+78496,23` (virgulă zecimală).
  Deci pagina românească folosește `SUM` (nu `SUMA`) și virgula ca separator, deși în exemplul numeric virgula e zecimală — se contrazice singură.
  Pilotul (`D_…md`: „`SUMA(` de 0 ori”) și `B_context_real.md` §4b tratează `SUMA` ca forma românească fără sursă.
  NESIGUR din partea mea: nu am verificat într-un Excel instalat în română care e numele funcției; dar un agent care aplică protocolul
  („sursă Microsoft ro-ro”) va „confirma” virgula.
- **Fix:** în protocol: pentru separator și numele funcțiilor, sursa Microsoft ro-ro NU e suficientă; se scrie NESIGUR + întrebarea
  pentru Vasile („deschide Excel pe un PC din sala 1 TIC și tastează `=SUM(1;2)` și `=SUMA(1;2)`”). Scoate `SUMA` din orice exemplu până atunci.

### M1 — Calea cu backslash fără ghilimele strică LibreOffice · **minor**
- **Dovada.** `soffice.exe --headless --convert-to pdf --outdir C:\Users\...\verif\doc "…/test.docx"` în Git Bash →
  `Error: no export filter for  found, aborting.` exit=1. Cu ghilimele merge. Protocolul scrie `--outdir L` fără ghilimele.
- **Fix:** în protocol, șablonul cu ghilimele peste tot și slash-uri `/`.

### M2 — Două fișiere cu același nume se suprascriu la randare · **minor**
- **Dovada.** `test.docx` + `test.pptx` în același `--outdir` → `Overwriting: …\test.pdf`; a rămas doar PDF-ul prezentării.
  La cls5 lectia6 (poster: pptx SAU docx) o dovadă U1 dispare fără eroare.
- **Fix:** o conversie = un subfolder, sau nume unice (`u1_poster_docx.pdf`).

### M3 — `python-docx` pornește pe Letter american, nu pe A4 · **minor**
- **Dovada.** PDF-ul randat din documentul gol python-docx → PNG 816×1056 la 96 dpi = 8,5×11 inci (Letter).
  Word în România pornește pe A4. La verificări de pagină (margini, tabel tăiat, „încape pe o pagină”) rezultatul e fals.
- **Fix:** în protocol: `sec = doc.sections[0]; sec.page_width = Mm(210); sec.page_height = Mm(297)` înainte de orice.

### M4 — `proiector_25.png` nu simulează proiectorul · **minor**
- **Dovada.** E doar primul ecran micșorat la 341×192. Contrastul măsurat e 7,65 (cls7) și 6,62 (cls8) — trece pragul 4,5,
  deci agentul va scrie „lizibil”, deși pilotul bănuia tocmai că textul gri pe negru se spală pe proiector. Micșorarea nu spală culorile.
- **Fix:** o a doua imagine cu contrast redus și negru ridicat (ex. `ImageEnhance.Contrast(im).enhance(0.6)` + `Image.blend` cu gri 15%),
  numită „aproximare, NEVERIFICAT pe proiector real”; semnalările de contrast rămân `important` maxim fără proiector real.

### M5 — `--astept` fără număr → traceback · **minor**
- **Dovada.** `IndexError: list index out of range` (exit 1, dar mesajul nu spune ce lipsește). **Fix:** `argparse`.

### M6 — Randarea LibreOffice nu e ce vede elevul în Microsoft Office · **minor**
- **Dovada.** Dovada U2 pentru documente vine din LibreOffice (alte fonturi, alt aranjament la Calibri/Segoe). Protocolul nu spune asta.
- **Fix:** o frază: capturile din LibreOffice probează CONȚINUTUL, nu aspectul exact din Word/PowerPoint; semnalările de aspect fin → NESIGUR.

### M7 — LibreOffice deja pornit: conversia merge, dar fără confirmare în ieșire · **minor**
- **Dovada.** Cu o instanță headless pornită de mine: fișierul a apărut, exit 0, dar lipsea linia „convert … ->”. Un agent care caută acea
  linie crede că a eșuat și reîncearcă. **Fix:** același ca la B5 (profil propriu + verificarea fișierului, nu a textului din ieșire).

---

## 3. BUGETUL DE CONTEXT

### I17 — Nimic nu e interzis sau tăiat; o lecție mare umple contextul înainte de pasul 5 · **important**
- **Dovada (măsurat):** `innerText.txt` cls7 lectia5 = 64.783 octeți (~17-20 mii de jetoane), plus A §2.1/2.2/3/4 (~190 de rânduri de tabele),
  B §2-3 (~110 rânduri), D, JURNAL (crește cu fiecare lecție), 2 imagini H_vede, câte o imagine pe diapozitiv/pagină randată,
  ieșiri Playwright, WebFetch-uri. Fiecare apel ulterior re-citește tot (regula internă: ~86 de jetoane citite pe unul scris).
  Pasul 5 (pre-mortem, alternative) — partea de judecată — vine ultimul, adică cu contextul cel mai plin.
- **Fix:**
  - `H_vede.py` comprimă spațiile (I8); interzis `Read` pe HTML-ul lecției fără `offset/limit` (doar Grep pentru localizare);
  - interzis `Read` pe `pagina_intreaga.png` (e lungă; se micșorează ilizibil) — doar capturi 1366×768 pe atom;
  - maxim 8 imagini citite pe lecție; PDF-uri randate doar prima pagină + pagina cu problema;
  - scripturile Playwright/LibreOffice scriu ieșirea în fișier și tipăresc ≤ 20 de rânduri;
  - JURNAL: se citesc doar ultimele 2 secțiuni ale clasei (`## `), nu tot;
  - ordinea: pasul 5 (pre-mortem) se scrie în schiță IMEDIAT după pasul 1, apoi se completează — nu la final.

---

## 4. AMBIGUITĂȚI: unde se bifează cuvintele și se ratează intenția

### I11 — Cronometrul e circular · **important**
- **Dovada.** Pasul 3: „estimează minutele = numărul de acțiuni × timp de începător; spune explicit factorul folosit”. Agentul alege și
  numărul de acțiuni, și factorul, și pornirea (5-10). Poate ajunge la orice verdict. Poarta nu verifică nici măcar că numerele există.
- **Fix:** tabel fix în protocol (provizoriu, de calibrat cu Vasile): ex. 20 s/clic de meniu V-VI, 15 s VII-VIII, tastare 8 cuvinte/min V
  … 15 VIII, pornire fixă 8 min; `03_pasi.json` numără pașii, poarta recalculează `sarcina` și verdictul.

### I12 — „Cele 3 momente în care se ridică 25 de mâini” le ghicește AI-ul, deși cercetarea spune că nu poate · **important**
- **Dovada.** `A_cercetare…md:216`: „sursa: think-aloud cu 3-5 elevi reali (NN/g), **nu** simulare AI (simularea e prea competentă)”.
  Protocolul, pasul 5, cere exact simularea. Și „25” e inventat: `B_context_real.md:139` — „numărul de elevi per clasă NU e în sistem”.
- **Fix:** câmpul devine „blocaje PROBABILE (ipoteză AI, de confirmat la clasă)” cu gravitate maxim `important`, plus o întrebare
  concretă pentru Vasile: „notează la oră unde s-au ridicat mâinile”. Scoate „25”.

### I13 — U6, U7, U9 lipsesc din pași, dar poarta le cere · **important**
- **Dovada.** Pașii 1-7 pomenesc U1, U2, U3, U4, U5, U8, U10-U17; nu U6, U7, U9. Poarta cere toate 17. Rezultatul previzibil: trei rânduri
  scrise ca să treacă, fără lucru în spate (exact bifarea de formă). U7 („starea finală reală”) are un sens bun aici: redeschide fișierul
  produs de U1 și citește valoarea — dar nimeni nu i-o spune agentului.
- **Fix:** U6 scos din lista porții pentru evaluare (nu e o reparație); U7 = „redeschid artefactul U1 dintr-un proces nou și citesc 1-2 valori” (dovadă: fișier);
  U9 = „ieșirea porții + bifa R1-R6 din `00_INDEX.md`”, cu fișier `09_checklist.md`.

### I14 — Contradicții cu `B_context_real.md` · **important**
- **Brauner.** Protocolul (rândul PROFESORUL): „la Brauner există laboratorul «1 (TIC)»”. B §3: doar UNA din clasele-pereche e în sala 1 (TIC)
  (6M, 5M sunt în sălile 4, 5); 8A/8M nu apar în confirmare; „laborator sau clasă obișnuită, în fiecare din cele două zile” — deschis.
  Deci pentru jumătate din clasele de la Brauner, precondiția (U17) e tot NESIGURĂ.
- **Izvoare.** Protocolul tratează lipsa calculatoarelor ca „plan B”. B §3: „la Izvoare, unde nu am laborator” e deja **premisă de lucru**, iar
  varianta pe hârtie e „plan A, nu plan B”. Pentru VI, VII, VIII la Izvoare, întrebarea principală e „merge lecția pe hârtie/caiet?”, nu „ce facem dacă nu merge la calculator”.
- **Elevul pe „calculator de laborator 1366×768”.** B §3: numărul și dotarea calculatoarelor — „NU AM GĂSIT”. Rezoluția e inventată
  (și intră în `H_vede.py`), deși protocolul zice „Nu inventezi fapte despre laborator”.
- **„Ține lecția mâine.”** B §2: cls8 lectia4, 5, 6, 7 se țin abia în noiembrie-decembrie (Modulul 2 al școlii).
- **Fix:** o tabelă de 3 rânduri în protocol (Brauner-clasa în sala TIC / Brauner-clasa pereche / Izvoare) cu precondiția corectă;
  rezoluția 1366×768 marcată „ipoteză”; la Izvoare, U17 cere evaluarea variantei pe hârtie ca plan A.

### I15 — Gravitatea se umflă pe fapte necunoscute · **important**
- **Dovada.** Limba interfeței din laborator e necunoscută (B §3), Office-ul de pe PC-ul lui Vasile e în engleză (B §4c: `en-us`), dar protocolul
  dă ca exemplu „confirmat: Home = Pornire” și cere comparația cu ro-ro. Nimic nu oprește o semnalare „blocant: meniurile sunt în engleză”.
  Același lucru la separator (B4, I10).
- **Fix:** câmp `depinde_de_necunoscut: true|false`; poarta: dacă `true`, gravitatea maximă e `important` și `ce_trebuie_diferit` trebuie să fie
  o formulare pe ambele variante („fila Pornire (Home)”), nu înlocuirea uneia cu alta.

### I16 — Verificări din cercetare (A §2.1-2.2, §4 golurile) care au căzut din protocol · **important**
Lipsesc complet sau apar doar ca exemplu fără verificare:
1. **Elevul fără cont / e-mail / stick** (A §4 golul 7, §2.1) — nicăieri.
2. **Puncte de verificare vizibile pe pas** („ridicați mâna când vedeți tabelul cu 3 coloane”, A §2.1) — nicăieri.
3. **Sarcina de rezervă când pică rețeaua/proiectorul** (A §2.1) — protocolul are plan B doar pentru „fără calculatoare”.
4. **Ergonomia contra mobilierului real** (golul 10, → întrebare pentru Vasile) — lipsește la cls5 lectia4.
5. **Tastarea diacriticelor pe PC-ul elevului** (golul 6) — U16 măsoară diacriticele din LECȚIE, nu dacă elevul le poate tasta.
6. **Word: marcaje ¶ (aliniere cu spații / Enter), stil vs formatare manuală PE FIȘIERUL REZULTAT** (golul 12) — apare doar ca exemplu
   de „specialist”; pe un .docx construit chiar de agent verificarea nu înseamnă nimic (agentul alege stilul). Trebuie verificat ce CERE lecția
   (spune „aplică Titlu 1” sau „fă-l bold și mare”?).
7. **Excel: număr-scris-ca-text, conversia automată în dată, ordinul de mărime, tabelul „Copiaza tabelul starter” lipit** (golul 11, A §2.2) —
   lecția are butoane de copiere cu date separate prin tab (`lectia3-formule.html:534-540`); cum ajung ele în Excel pe o setare română
   (ex. „7.50” în „Verifica: media 7.50”, rândul 549) nu e verificat. Butonul de copiere în Chromium fără ecran cere permisiunea de clipboard — netestat de mine.
8. **PowerPoint: trecerea prin modul Prezentare, mărimea fontului la distanță, o idee pe diapozitiv** (A §2.2) — nu apar.
9. **Ghilimele „românești” vs drepte, spații duble** (A §2.2 Word) — nu apar.
10. **Comparație cu date reale la U11** (A §3) — nu apare.
- **Fix:** o listă-anexă pe clasă în protocol, fiecare rând cu tipul dovezii; poarta cere ca fiecare rând să aibă în `log.json`
  un răspuns (`FACUT` cu fișier / `INTREBARE_VASILE` cu textul întrebării).

### I18 — JURNAL-ul clasei: ori cursă la scriere, ori evaluări dependente · **important**
- **Dovada.** Pasul 6: „adaugă (nu rescrie)” în `F_evaluari\<clasa>\JURNAL.md`; pasul 0.4: „ia-l în serios”. Dacă lecțiile rulează în paralel,
  doi agenți scriu același fișier (unul pierde) și nimeni nu vede lecția anterioară. Dacă rulează în ordine, lecția 6 e judecată prin ochii
  primei evaluări — o semnalare greșită la lecția 1 (ex. B4) se propagă ca „se repetă (vezi lecția 1)”.
- **Fix:** în paralel pe clase, în ordine în interiorul clasei; scrierea în JURNAL printr-un script cu blocare (`msvcrt.locking`) sau doar de
  orchestrator la final; o semnalare cu `se_repeta_din` trebuie să aibă propria dovadă din lecția curentă (poarta: `dovada` nu poate fi identică cu cea din lecția citată).

### M8 — Antetul protocolului listează alte unelte · **minor**
- **Dovada.** Rândul 2: „unelte: Bash, Read, Write, Grep, WebFetch”; subagentul are și Edit, Glob, WebSearch. Nu strică nimic direct,
  dar Edit e tocmai unealta cu care se poate modifica poarta (I4). **Fix:** listă corectă + „Edit interzis pe CAMP\*.py”.

### M9 — Nicio verificare de „fapte care expiră” în exemplele numerice · **minor**
- **Dovada.** `innerText.txt` cls8 lectia3, o întrebare de chestionar: „Ai in celula B1 cota de TVA (19%)”. După știința mea cota standard
  în România e 21% din 01.08.2025 — **NEVERIFICAT în această sesiune** (de confirmat prin /contabil). Protocolul cere sursă primară doar pentru
  „afirmații tehnice” (RAM, SSD), nu pentru cifre din viața reală folosite ca exemplu.
- **Fix:** la U3 adaugă „cifre din lumea reală (TVA, prețuri, salarii, legi) → sursă datată”.

### M10 — Metrica din raport încurajează cantitatea „nouă” · **minor**
- **Dovada.** „Ce returnezi”: numărul pe gravitate + „câte `prindea_auditul_pe_text: nu`”. Protocolul spune „nu număra semnalări ca succes”,
  dar raportul cere exact numărătoarea. **Fix:** raportul cere cele 3 semnalări care schimbă ora + dovada lor; numerele doar în `log.json`.

---

## 5. Ce am verificat și a mers (ca să nu fie citit ca „nimic nu merge”)
- `H_vede.py` rulează în ~4 s pe lecție, fără ecran; dă toate cele 7 fișiere (cls7 lectia5, cls8 lectia3).
- Recalcularea xlsx prin LibreOffice cu `--convert-to xlsx:"Calc MS Excel 2007 XML"` într-un subfolder, apoi `data_only=True`: **merge**
  pentru formule englezești cu `:` sau `,` (valoarea 3 citită).
- docx → pdf → png: merge (PDF 1 pagină, PNG 816×1056, textul extras păstrează ș cu virgulă ȘI ş cu sedilă distinct — U16 pe fișiere se poate face mecanic).
- pptx → pdf → png: merge (960×720, „Tranziții și animații” extras corect).

## 6. Ordinea în care aș repara (cel mai mic efort, cel mai mare efect)
1. Poarta: B3 (2 rânduri), B2 (`inside()`), B1 + I1 (listă H_VEDE, MEREU_POSIBIL lărgit). ~40 de rânduri de cod.
2. Protocolul: B4 (scoate „cu separatorul lor”), B5 (profil LibreOffice per lecție + verificarea fișierului), B6 (pași `rezultat`/`interfata`).
3. `H_vede.py`: I6 (http.server), I7 (parcurgerea atomilor), I8 (marcaj ASCUNS + spații).
4. Restul importantelor, apoi un nou pilot pe cls8 lectia4-functii (are amestecul `;`/`,`) ca test că B4 nu mai produce semnalări false.
