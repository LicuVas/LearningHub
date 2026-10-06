# Reluarea campaniei „Lecțiile refăcute” (LearningHub) — cum continui EXACT în stilul de acum

> Scris de dirijor pe 28.09.2026, la oprirea cerută de Vasile: „după ce termini lecțiile începute… te oprești și salvezi tot ce e necesar pentru a relua la diferite momente, când te anunț eu… să poți continua exact în acest stil”.
> **Starea la oprire (29.09.2026, ~00:30):** 36 de lecții LIVE, 0 în lucru — M1 complet la V, VI, VII, VIII (1-7) + M2 nr. 8-9 la toate cele patru clase. Ultimul commit al campaniei: `ec24d6a0` (VII/9). Listele „Recent” din Office: 0 urme ale probelor. Word: documentele noi în Print Layout, 100 %.
> **Cum pornești:** în Claude Code, din `C:\00\AI_0`, scrii **`/lectii`** (skill-ul `.claude\skills\lectii.md`) sau „continuă lecțiile LearningHub”. Skill-ul te trimite aici.

## 0. Primii 5 minute la reluare (în ordinea asta)
1. Citește fișierul ăsta întreg, apoi `05_STANDARD_LECTIE.md` (legea autorilor, regulile 1-27), `06_BRIEF_JUDECATOR.md`, `07_BRIEF_AUTOR.md`.
2. Starea lecțiilor, calculată acum (nu din memorie): `python C:/00/Projects/LearningHub/_campaign/revizuire_completa_2026_09/dirijor/stare.py` (sau `--modul M2`).
3. Jurnalul dirijorului, ultimele secțiuni: `04_ORCHESTRARE.md` (ce s-a făcut, cu commituri și dovezi).
4. `git -C C:/00/Projects/LearningHub status --short | head` și `git log -5 --oneline` — depozitul e folosit și de alte sesiuni; nu presupune că e curat.
5. Verifică publicarea înainte de orice lucru nesupravegheat: `python C:/00/AI_0/tools/push_ready.py --repo C:/00/Projects/LearningHub` (exit 0).

## 1. Ce vrea Vasile (cuvintele lui, 27.09.2026)
- „Reluăm siteul de la capăt. Facem primele lecții la gimnaziu — măcar pentru primul modul. Apoi continuăm cu al doilea și tot așa. **Tot ce terminăm trebuie pus pe siteul live. Nu așteptăm până la final.** Restul secțiunilor — modulul doi încolo — le marchezi ca fiind în lucru. Secțiunea cu jocuri e făcută mai bine, deci o lăsăm disponibilă.”
- „Totul trebuie să aibă **accent practic** și să fie **instrucțiuni clare și ilustrate**, plus **posibilitatea de practică chiar în pagina respectivă**. Conceptele se prezintă **simplu și pe rând**. **Tot ce cerem să fie făcut să fie mai întâi expus/predat.**”
- Noaptea: „toate resursele necesare și toate permisiunile de care ai nevoie.”
- Orchestrare: „declanșezi agenți pe modele și efort suficient cât să facă treaba foarte bine… dar totul să fie orchestrat și verificat de tine — punctual — poate faci verificările în mod specific prin alți agenți.”

## 2. Ce e o lecție (forma fixă)
- O lecție = o pagină `lectii/<clasa>/<modul>-l<NN>/index.html` pe motorul jocurilor (`jocuri/_motor/motor.js`, `mod:'lectie'`, cheia `lectie_<clasa>_<modul>_l<NN>`), UN nivel pe pași: pasul 0 „La ce folosește” + 3-5 pași (câte o idee), fiecare cu „Uite cum” + „Încearcă” de APLICARE, un atelier în pagină (simulator), „Acum la calculatorul din laborator” (fără profesor — la Tupilați a VI-a și a VII-a au oră simultană), 5 întrebări, diplomă.
- Lângă pagină: `afirmatii.json` (fiecare fapt + cum a fost probat), `profil.json`, `capturi_lipsa.json`, `surse.md`, `img\SURSE.json`. Scripturile în `_proba\` (autor) și `_verificare\` (judecător) — ambele excluse din publicare prin `.gitignore`.
- Simulatoarele comune în `lectii/_sim/` au PROPRIETAR (scris în standard). Nimeni nu modifică simulatorul altuia: scrie o extensie cu nume nou. Excepție: reparații de defecte, făcute de proprietar sau de un agent dedicat, cu regresie pe lecțiile publicate care îl folosesc.
- Planul: `lectii/plan.json` (143 de lecții din Calendar_ore Brauner, pe module M1-M5). Construit din `lectii/_build/plan_din_calendar.py`.

## 3. Lanțul pe fiecare lecție (asta a produs calitatea — nu scurta)
1. **Autor** (Agent `general-purpose`, `model: opus`, în fundal). Prompt = „Citește întâi și urmează întocmai `07_BRIEF_AUTOR.md`” + lecția, dosarul, cheia + **granița cu vecinii** (ce predă lecția dinainte/de după, ce NU predai) + legătura cu lecțiile publicate ale clasei („fă lista cu tot ce presupun ele cunoscut și acoperă, cu bife în surse.md”) + ce fapte trebuie probate în aplicația reală (Office pe setări RO) + practica cerută. Modele de prompt: secțiunea 7.
2. **Judecător** independent (Agent `general-purpose`, `model: opus`). Prompt = „Citește întâi și urmează întocmai `06_BRIEF_JUDECATOR.md`” + regulile 22/24/25/26 + „Atenție specială:” (lista punctelor riscante ale lecției — din răspunsul autorului: `nesigur`, fapte neprobate, abateri de la plafon, contradicții găsite). Judecătorul probează el însuși în Office real (arbitrul) și cu gesturi reale la 390 px (atingere) și 1280 px. Scrie `_verificare/judecatorN.md` (ultima linie = numărul de GRAV) și `.json`.
3. **Reparare** la același autor (SendMessage către agentul lui — păstrează contextul; dacă agentul nu mai există, un autor nou cu `reparatii` + `judecatorN.md`). Mesajul: lista GRAV/MAJOR cu reparația concretă + „MINOR: toate din judecatorN.md” + porțile.
4. **Judecata N+1** la același judecător (SendMessage) — „scurtă și țintită” când au rămas puține lucruri. Repetă până la **0 GRAV / 0 MAJOR**. Minorele care țin de siguranță, fapte sau text contradictoriu se repară ÎNAINTE de publicare (o trecere scurtă la autor, fără judecător nou dacă sunt doar texte; dirijorul citește el textul reparat).
5. **Publicare** (secțiunea 4), apoi **verificare LIVE** după marcaje + proba de fum.
- Componentele comune (motorul, `assets/js/prezenta.js`, `lectii/_sim/rezultat-elev.js`) se schimbă DOAR cu **poarta de lansare** (un agent verificator independent, verdict LANSEAZA / NU_LANSA, probe pe toate paginile publicate, sertarele vechi ale elevilor, sha1 înainte/după) — vezi `dirijor/poarta_lansare/` și jurnalul din 28.09.
- Cât se schimbă o componentă comună, **judecătorii care o folosesc stau pe pauză** și reiau pe versiunea finală, cu sha1 verificat pe disc.
- **STRAT 05.10.2026 — consumul (măsurat: turele cu context peste 200k = 63% din consum; agenții-autori ținuți prin 2-5 reparări ajungeau la 400-800 de ture și 500-900k de context):** la pașii 3-4, dacă notificarea de final a autorului sau a judecătorului arată `subagent_tokens` peste ~200.000, NU mai continui cu SendMessage. Ceri întâi nota de predare (`_proba\stare_autor.md`: decizii, variante respinse, ce urmează), apoi pornești un agent PROASPĂT cu nota + `judecatorN.md` + fișierele de pe disc. Judecata N+1 proaspătă primește **registrul punctelor** (GRAV/MAJOR cu starea lor) și verifică întâi punctele deschise, apoi o baleiere scurtă. Poarta rămâne aceeași: 0 GRAV / 0 MAJOR de la un judecător independent. Politica completă: `C:\00\AI_0\SECRETARY_V3\docs\precizie_vs_consum.md`.

## 4. Publicarea (dirijorul, pe rând, fără scurtături)
**Standardul din 28.09 seara = UN SINGUR SCRIPT cu porți** (comite și împinge DOAR dacă trece fiecare poartă; ultima linie = 0):
```
python C:/00/Projects/LearningHub/_campaign/revizuire_completa_2026_09/dirijor/publica_lectie.py <clasa>/<modul>-lNN [<alta>/…] [--fara-push]
```
Rulează-l în fundal, cu `timeout 5400` în jur (10-60 min: `build_lectii` re-testează în browser FIECARE lecție publicată, iar cu mulți agenți pe calculator trece de 15 min — scriptul îi dă 3600 s, iar un timeout contează ca poartă picată). Face în ordine pașii de mai jos, adaugă singur extensiile `_sim` din `<script src>`, reia o dată `test_joc` dacă pagina n-a pornit sub încărcare („întrebări jucate: None”), iar dacă pică o poartă NU comite și îți spune cum readuci `plan.json`. De ce există: pe 28.09 un `[PICAT]` s-a pierdut într-o comandă înlănțuită și lecția VII/1 a plecat live nevăzută (s-a dovedit un artefact de încărcare, dar regula rămâne: **niciodată verificări + commit în aceeași comandă înlănțuită**).

Pașii, dacă vreodată trebuie făcuți de mână:
```
python C:/00/Projects/LearningHub/_campaign/revizuire_completa_2026_09/dirijor/dirijor_publica.py <clasa>/<modul>-lNN     # stare=publicat + insigna
python C:/00/Projects/LearningHub/lectii/_build/build_lectii.py            # → 0
python C:/00/Projects/LearningHub/lectii/_build/verifica_linkuri.py        # → 0
python C:/00/Projects/LearningHub/lectii/_build/plan_din_calendar.py --verifica   # → 0
python C:/00/Projects/LearningHub/_campaign/revizuire_completa_2026_09/verificare_lectii/curata_metadate.py   # → 0 (fișierele Office de descărcat)
python C:/00/AI_0/tools/learninghub_date_personale.py                    # → 0 (regula 27; --curata dacă nu)
python C:/00/Projects/LearningHub/jocuri/_motor/test_joc.py --dir C:/00/Projects/LearningHub/lectii/<clasa> <modul>-lNN   # TRECUT
python C:/00/Projects/LearningHub/_campaign/revizuire_completa_2026_09/verificare_lectii/verifica_lectie.py <index.html> --fara-t1   # → 0
grep -o 'src="[^"]*_sim/[^"]*"' <index.html>    # extensiile noi din lectii/_sim/ trebuie comise ÎMPREUNĂ cu lecția
git -C C:/00/Projects/LearningHub add <dosarul lecției> <extensiile _sim noi> lectii/index.html lectii/plan.json lectii/<clasa>/index.html
git commit (mesaj: ce, câte treceri de judecător, porțile) ; GIT_TERMINAL_PROMPT=0 GCM_INTERACTIVE=never timeout 90 git push
MSYS_NO_PATHCONV=1 python …/dirijor/dirijor_verifica_live.py "/lectii/<clasa>/<modul>-lNN/|lectie_<clasa>_<modul>_lNN" "/lectii/_sim/<ext>.js|function"
MSYS_NO_PATHCONV=1 python …/verificare_lectii/fum_live.py /lectii/<clasa>/<modul>-lNN/     # 390+1280, 0 erori, 0 cereri spre teste-vasile
```
- **NICIODATĂ `git add -A`** — alte sesiuni lucrează în același depozit. Doar fișierele numite.
- **La o lecție REPUBLICATĂ, marcajul `lectie_<clasa>_…` nu dovedește nimic** — există și în versiunea veche (29.09.2026: „marcaje LIVE: 0” a trecut, iar V/1, VI/1, VII/1 încă se serveau vechi câteva minute). De aceea `publica_lectie.py` are acum poarta „conținut LIVE = fișierul publicat”: așteaptă (cel mult 10 min) până pagina de pe sit e identică cu `index.html` comis.
- Situl răspunde 200 la orice adresă: dovada e MARCAJUL din pagină, nu codul 200. Urllib cu User-Agent de Python e blocat de Cloudflare — scriptul folosește User-Agent de browser.
- Git Bash strică argumentele care încep cu `/` → `MSYS_NO_PATHCONV=1`.
- Build-ul + linkurile: 2-3 minute pe calculatorul liber, peste 15 minute cu 8 agenți la lucru (28.09): rulează-le în fundal (`run_in_background`). Publică mai multe lecții ÎMPREUNĂ când se poate — build-ul costă la fel pentru una sau pentru patru.

## 5. Uneltele (toate pe disc, nu în scratchpad)
| Unealtă | Unde | La ce |
|---|---|---|
| `stare.py` | `dirijor\` | starea lecțiilor + ultimul verdict de judecător |
| `publica_lectie.py` | `dirijor\` | PUBLICAREA standard: toate porțile → commit pe fișiere numite → push → marcaje + fum live (ultima linie 0) |
| `dirijor_publica.py` | `dirijor\` | marchează lecția publicată în plan.json |
| `dirijor_verifica_live.py` | `dirijor\` | marcaje pe situl live |
| `fum_live.py` | `verificare_lectii\` | proba de fum live, 390/1280, rețea blocată |
| `lacat_office.py` | `verificare_lectii\` | lacătul PowerPoint (`ia` / `reinnoieste` / `elibereaza`, 60 min) |
| `curata_metadate.py` | `verificare_lectii\` | numele contului Office din .docx/.pptx/.xlsx (`--curata`) |
| `scoate_bara_docx.py` | `verificare_lectii\` | scoate bara galbenă „removePersonalInformation” dintr-un .docx, fără Word |
| `curata_mru_office.py` | `verificare_lectii\` | urmele probelor din lista „Recent” Office (`--sterge`, cu Office închis) |
| `proba_profil_motor.py` | `verificare_lectii\` | motorul pornește cu elev înscris fără progres (control inclus) |
| `verifica_lectie.py` | `verificare_lectii\` | linia de verificare S0-T1 (`--fara-t1`) |
| `learninghub_date_personale.py` | `C:\00\AI_0\tools\` (PRIVAT) | regula 27 — date personale în ce se publică |
| `rezultat_elev_proba.py` + `_mutanti.py` | `lectii\_sim\_teste\` | matricea componentei comune (21 cazuri, 18 mutanți) |
| `proba_stari.py`, `proba_intreaba.py`, `proba_tinte32.py` | `motor_lectie\` | probele motorului / prezenței |
| `activitate.py lista` | `C:\00\AI_0\tools\` | panoul de activitate al profesorului (verifică să nu apară elevi de probă) |

## 6. Regulile dirijorului (învățate pe pielea noastră 27-28.09)
- **Judecătorii găsesc ce autorii nu văd** (Ctrl+Z la date, alinierea care comută, F5 care reîncarcă pagina, „numele există deja” = alt buton la prima salvare decât la Salvare ca, fișa altui elev pe calculatorul comun). Nu publica nimic fără 0 GRAV / 0 MAJOR de la un judecător independent.
- **Faptele despre Office se probează în Office REAL, pe setările regionale RO** (instanță nouă, invizibilă, pe desktopul ascuns, taste reale). Ce nu se poate proba se scrie prudent și se trece în `nesigur`.
- **Calculatorul profesorului rămâne cum era** (regula 25): doar PID-ul propriu, `Saved=True`+`Close` înainte de `Quit`, fără urme în „Recent”, fără fișiere de recuperare, setările puse la loc. La final dirijorul rulează `curata_mru_office.py --sterge` (cu Office închis) și verifică `%APPDATA%\Microsoft\{Excel,Word}\` (urmele probelor se MUTĂ în `verificare_lectii\_carantina_recuperare_*`, nu se șterg).
- **Nimic spre panoul profesorului** (regula 24): probele blochează tot ce nu e 127.0.0.1 și închid DOAR cu `ctx.close()` (`page.close()` lasă `sendBeacon` să iasă).
- **Nicio dată personală în ce se publică** (regula 27): situl ȘI depozitul GitHub `LicuVas/LearningHub` sunt publice.
- **O componentă comună = un singur proprietar + o matrice de probe cu mutanți.** Când apar defecte de același fel în mai multe lecții (ex. identitatea elevului), nu repara în fiecare lecție: fă o componentă comună (`rezultat-elev.js`).
- **Agenții blocați** („stream watchdog… 600 s”) se reiau cu SendMessage („continuă de unde te-ai oprit; verifică întâi ce e pe disc”).
- **Contradicții între ce spune autorul și ce spune judecătorul** se arbitrează în aplicația reală (ex. Anulare în Excel reapare fereastra — autorul a avut dreptate).
- **Spune-i lui Vasile cât durează** înainte: o lecție = ~1-2 ore de autor + 20-40 min de judecată pe trecere; 2-4 treceri.

### Regula de notare (decizia lui Vasile, 29.09.2026 — obligatorie pentru orice lecție nouă)
- **Nota = punctaj : 10** (A 40 + B 30 + C 20 + 10 din oficiu; rotunjire la cel mai apropiat întreg, ,5 în favoarea elevului). **Nivelul se citește din notă**: 9-10 Avansat, 7-8 Consolidat, 5-6 De bază, 3-4 În formare, 1-2 În dificultate. Părțile A/B/C NU schimbă nota, arată unde s-au pierdut puncte.
- **Cel puțin o notă pe modul → cel puțin 5 pe an.** Nu scrie alt număr de note.
- Proiectele: grila `Info_Gimnaziu_2026\instrumente\Grila_produs.md` — 5 criterii × 0-18 p (10 / 14 / 18) + 10; nota = punctaj : 10. NU „nivelul = cel mai mic dintre criterii”.
- Sursa unică pentru agenți: `_campaign\notare_punctaj_2026_09_29\REGULA_NOUA.md`. Oracolul urmelor regulii vechi (praguri 27/20/14, banda de notă, 9/8/7 note): `python C:/00/Projects/LearningHub/_campaign/notare_punctaj_2026_09_29/verifica_regula.py` → ultima linie 0. Evaluările sumative (lecțiile de evaluare din M2 încolo) se construiesc pe regula asta.

## 7. Modele de prompt (copiate din campanie)
**Autor (predare):**
> Citește întâi și urmează întocmai `C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\07_BRIEF_AUTOR.md`.
> **Lecția ta:** <CLASA>, <MODUL>, nr. <N> — „<titlu din plan.json>” (<tip>). Dosarul: `lectii\<clasa>\<modul>-l<NN>\`, cheia `lectie_<clasa>_<modul>_l<NN>`. Lecțiile <…> ale clasei sunt PUBLICATE (`lectii\<clasa>\…`); nu le repeți și nu le contrazici.
> **Granița cu lecția <N±1>** (alt autor, în paralel): lecția <…> = <…>. Tu NU predai <…>. Tu predai: <lista concretă>.
> **<Aplicația> reală:** <faptele care trebuie probate; capcanele cunoscute din standard — ex. Excel RO nu traduce funcțiile, separatorul `;` vine din Windows>.
> **Practica:** „Încearcă” de aplicare (<exemple>), atelier în pagină (<simulator; extensie nouă dacă trebuie>), „Acum la calculatorul din laborator” fără profesor (<ce face; ce NU schimbă pe calculatorul comun; salvarea după regulile 23 și 26>).
**Autor (mini-proiect / evaluare):** la fel + „Nu predai nimic nou; ghidezi… cu trimiteri exacte `../m1-l0N/`. Cerințele, criteriile și punctajul DOAR din documentele profesorului (`Info_Gimnaziu_2026`, `Proiectul_unitatii_*.md`, `SISTEM_EVALUARE.md`); dacă lipsesc, spui în `surse.md` și NU inventezi.”
**Judecător:**
> Citește întâi și urmează întocmai `…\06_BRIEF_JUDECATOR.md`. Din `05_STANDARD_LECTIE.md` aplici strict regulile 22, 24, 25, 26 (<detaliate scurt>).
> **Lecția ta:** `…\index.html` — <titlu>, cu fișierele de lângă ea (<listă, cu nr. de afirmații probate>) și extensia nouă `<…>`.
> **Atenție specială:** <arbitrul Office obligatoriu + faptele de probat>; <numele RO nesigure>; <granița cu vecinii / acordul cu lecțiile publicate>; <fișierul de descărcat: metadate 0, conținut>; <laboratorul comun>; <plafonul de pași>; telefon 390 px cu atingere + 1280 px până la diplomă.
**Reparare:** „Reparare <lecția> după judecător: X GRAV, Y MAJOR, Z MINOR. Citește întreg `…\_verificare\judecatorN.md` (și `.json`). <GRAV/MAJOR, fiecare cu reparația>. MINOR: toate din judecatorN.md. Porțile din brief. Nu faci commit. Răspunsul final: JSON-ul din brief + reparațiile cu locul lor.”

## 8. Ce urmează (ordinea)
0. **ÎNTÂI — defect LIVE în simulatorul comun Excel** (`lectii\_sim\excelx.js`, funcția `ajusteaza()`): la selecția prin tragere pagina sare — 18 px la 1280 în VIII/5, mai mult în VIII/2 (acolo e și o a doua cauză). Autorul VIII/8 are în extensia lui (`lectii\_sim\excelx-functii.js`) o ocolire CSS, iar în `lectii\viii\m2-l08\surse.md` reparația propriu-zisă: nota de sub panglică se scrie O DATĂ, nu după fiecare redesenare, plus `overflow-anchor:none` pe foaie. Proprietar unic + matrice de probe pe VIII/2, VIII/5, VIII/8, VIII/9 înainte de publicare. În același pas: bara de stare scrie „Număr (Count)” — Microsoft RO spune „Contor” (de confirmat în laborator).
1. ~~Terminarea lecțiilor începute pe 28.09~~ — FĂCUT 29.09 ~00:30: toate cele 8 (M2 nr. 8-9) publicate și verificate live (`3237fece`, `5e2fecdf`, `90f811af`, `ec24d6a0`); `stare.py` → în lucru 0. Dacă `stare.py` arată totuși ceva „ÎN LUCRU”: ultimul `judecatorN.md` → reparare / judecată / publicare.
2. **Modulul 2, restul** (lecțiile 10-15 la fiecare clasă — titlurile în `stare.py --modul M2`): evaluări sumative (V/12, VI/10, VII/10, VIII/13), mini-proiecte (VIII/12), Internet și e-mail (V/13-15, VI/11-15), audio-video (VII/11-15), pagini web (VIII/14-15). Câte 2 lecții pe clasă pe val (8 autori), apoi judecătorii pe măsură ce termină.
3. Apoi M3, M4, M5, la fel. Paginile vechi rămân cu banda „în lucru” până le înlocuiește lecția nouă.

## 9. Deschis — de decis de Vasile / de reparat (păstrat și în jurnal)
- Istoricul depozitului GitHub public conține încă datele personale scoase din fișiere pe 28.09 (rescrierea istoriei = ireversibilă, cere acordul lui).
- Panoul de activitate: 3 elevi de probă („Ana Pop”, „Dan Ene”, „Rusu Ilie”, 0 min) — de șters țintit (ștergerea țintită nu există încă în `activitate.py`).
- ~~Generatorul de teste scrie „Nota = punctaj : 10” — contrazice `SISTEM_EVALUARE.md`~~ — REZOLVAT 29.09.2026: Vasile a decis **nota = punctaj : 10** peste tot (vezi mai jos, „Regula de notare”). Foile erau deja corecte; s-au schimbat SISTEM_EVALUARE, fișele de criterii, grila de proiect și lecțiile V-VIII/1, VI/9, VII/9.
- Jocul `prezentari-vi` (6×6) contrazice lecția VI/2 („cel mult patru rânduri scurte”) și lecțiile VI/8-9; tot acolo „titlu 32–40” și „Use Presenter View”; de ales o regulă (jocurile nu se schimbă fără acordul lui).
- Jocul `fisiere-v`: „Restaurare jos” → numele Windows RO e „Restabilire jos” (fără acord, nu se atinge).
- Simulatorul comun `simppt.js`: pe telefon filele panglicii au 25 px, „This Device”/Insert 29 px (sub 32×44) — găsit la VI/9, de reparat în componenta comună cu matrice de probe.
- Registrul Explorer (regula 25): au rămas urme invizibile ale probelor din 28.09 — setări de vedere pentru foldere ale lecțiilor (`BagMRU`/`Bags`, sloturile 1409, 1411, 1412) și o intrare python.exe în `ComDlg32\CIDSizeMRU`. Curățenie țintită a dirijorului pe toată campania, numai după ce niciun agent nu mai rulează; copia autorului V/9: `%TEMP%\claude_v_m2_l09_bagmru_copie.json` (conține nume de foldere ale profesorului — se șterge după).
- Legătură ascunsă între simulatoare: `lectii\_sim\wordobj-hartie.js` (doar VII/9) modifică `wordpag` din `wordobj-pagina.js` (al lui VII/7) prin selectorii lui interni. Cine schimbă `wordobj-pagina.js` probează și VII/9 (lista Size + etichetele Margins/Orientation/Size), altfel se strică fără niciun semnal.
- Motorul comun: butoanele lui („Pasul următor” etc.) pierd atingeri după o tragere rapidă într-un simulator (3/12 și 7/12 fără derulare; găsit la V/8, judecata 2). Simulatoarele V/8 au reparația lor (răspuns la ridicarea degetului + clicul următor ignorat) — de dus în motor, prin poarta de lansare.
- Antetul motorului pe telefon: legături de 23 px (găsit la VIII/9) — componentă comună, poartă de lansare independentă.
- Documentele de descărcat din VII/3, VII/5, VII/6: bara galbenă „removePersonalInformation” a fost scoasă pe 28.09 (scriptul `verificare_lectii\scoate_bara_docx.py`, regula 21); orice .docx nou se verifică la fel.
- Aplicațiile din Magazin (Paint, Calculator): setările stau în `SystemAppData\Helium\User.dat`; Calculator nu se pornește niciodată în probe (se deschide pe ecranul vizibil) — regula 25.
- Pachetul de limbă RO pentru Office (capturi RO reale); lista numelor de confirmat în laborator (`calibrare\de_confirmat_in_laborator.md`); capturile lipsă (`capturi_lipsa.json` din fiecare lecție).
- Tupilați: fără planificare 2026-2027 (termen 02.10).
- Componenta `rezultat-elev.js`: minorul „două schimbări de elev în mai puțin de 8 minute” (propus: „Ești X?” la prima salvare a fiecărei verificări noi dacă ultima confirmare e mai veche de ~2 min).
- Mașina de verificare automată (`_masina\`): măsurată 8/55 pe bancul sigilat — nu e gata; lecțiile rămân cu insigna „verificat parțial”.
