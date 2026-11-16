# Contract — Aplicațiile simulate din LearningHub: o bibliotecă centrală, fidelă aplicațiilor reale  (16.11.2026)

Versiunea 2 (21:25): v1 trecut prin verificatorul rece (subagent fără context) → verdict „nefolosibil așa”, 7 defecte;
toate reparate mai jos (Etapa 0, referințe înghețate, oracolul sarcinilor, profiluri, reguli git, oprirea).
Răspunsurile lui Vasile (20:5x): Windows 11 + M365 · engleză + comutator RO · valuri pe nopți.

## Cererea (verbatim)
> foloseste /bucla si /promptExpert  ca sa te promptezi pe repeat pana cand reusesti ca aplicatiile simulate in learninghub, de la sistemul de operare, pana la windows explorer si aplicatiile office sa fie cat mai fidele in interfata si comportament cu aplicatiile reale. Scopul este ca utilizatorul sa fie astfel familiarizat cu interfata si comportamentul real al acelor aplicatii - dar fiind simulate in interiorul browserului putem sa monitorizam ce face si sa il asistam pentru a il ajuta sa indeplineasca sarcinile si sa verificam daca le-a facut corect.
>
> (20:44) dar actualizeaza pentru moment situl aflat la https://proba.learninghub-8z6.pages.dev/ in locul celui fara `proba.`
>
> (20:45) Iar interfata acelor aplicatii sa nu fie simplificata la unele lectii ci aceeasi indiferent de lectie. Si cumva sa o putem controla dintr-un punct central - sa nu fie recreata de la zero pe fiecare pagina care are nevoie de ea.

## Starea de la care pornim (citită pe disc, 16.11 20:40-21:20)
- Simulatoarele sunt câte unul pe lecție, în `lectii/_sim/`. În perimetru: desktop-windows, siguranta-pc, explorer-×4, wordobj-×7 + wordfisier + wordteh-stiluri, excelx-×10 + registru-foi, simppt-×8, paint-×6. Le încarcă ~48 de lecții, plus 8 jocuri (word-vii, word-obiecte-vii, word-antrenament-vii, excel-viii, excel-antrenament-viii, excel-pas-cu-pas-viii, prezentari-vi, prezentari-antrenament-vi). Majoritatea își desenează singure fereastra; o parte încarcă deja panglica comună `jocuri/_motor/ui-panglica.js` (ex. vi/m1-l02, vii/m1-l02), care afișează și butoane fără efect (`data-nesim`).
- Piese comune existente: `ui-panglica.js` + `panglica-{word,excel,powerpoint}.json` (din UI Automation pe Office 16 real, 27.09 — **incomplete**: Word fără Draw/Mailings, PowerPoint fără Draw/Record/Review, Excel cu Developer; coordonate la ~150% DPI; doar panglica), `tip-excel.js`, `tip-foaie.js` (oracol de formule contra Excel real prin COM), icoane Fluent (MIT).
- Probele lecțiilor (`lectii/**/_verificare/`, `_proba/`) NU sunt în git (`.gitignore:39-40`) și sunt judecători de unică folosință, nu o suită. `test_joc.py` acoperă doar `jocuri/` și iese cu cod, fără număr pe ultima linie.
- Ramura de lucru: worktree `C:\00\Projects\LearningHub_fidel`, ramura `fidelitate-aplicatii` = `origin/proba` (41 de commit-uri: tutorialele Excel + „VIII/2 prezentarea pe zone”, cu 18 fișiere schimbate în `jocuri/_motor`) + `origin/master` (23 de commit-uri, între care Word 2007 la VII·2 și reparația controalelor tăiate), unite fără conflicte la 21:20.

## Proba realității
Elevul (V-VIII, mulți începători, unii pe telefon) face sarcina lecției în aplicația simulată, cu mâna lui: clic pe filă, pe buton, tastează, Ctrl+Z, clic dreapta, trage. Apoi merge la PC-ul din laborator și **găsește aceleași lucruri în același loc, iar ele fac același lucru**. Profesorul vede ce a făcut elevul; lecția îi arată unde să se uite când se blochează; la final îi spune dacă a făcut corect.

## Etapa 0 — reperele, ÎNAINTE de orice reparație (aprobarea lui Vasile la raportul de dimineață)
Tot ce măsoară se construiește întâi și se ÎNGHEAȚĂ (sha256 în `repere.lock`): oracolele, referințele reale, `suprafete.json`, verdictele de referință ale sarcinilor. O rundă de reparație care schimbă un fișier înghețat e nulă (scriptul verifică hash-urile la început și la sfârșit). Fiecare oracol trebuie să prindă un banc de **≥ 5 mutanți** plantați într-o copie a simulatoarelor VECHI (filă lipsă, etichetă schimbată, ordine inversată, Ctrl+Z pe cuvânt, verificare care acceptă orice). Lărgirea acoperirii (suprafețe sau scenarii noi) se face doar într-o rundă marcată `acoperire`, care are voie să crească numerele, și reînghețată după.

## R — cerințe explicite  (cine verifică · „gata” =)
- **R1. Un singur loc.** Fiecare aplicație (Windows: desktop + bara de activități + Start + ferestre; File Explorer; Word; Excel; PowerPoint; apoi Paint) are O SINGURĂ implementare, în `aplicatii/`. Lecțiile o încarcă, nu o desenează. · verifică: `oracol_central.py` (pagini care desenează interfață de aplicație în afara bibliotecii; static + DOM) · gata = **0** la finalul etapei C.
- **R2. Aceeași interfață, întreagă, în toate lecțiile** [rescris] (original: „sa nu fie simplificata la unele lectii ci aceeasi indiferent de lectie”). Lecția alege DOAR conținutul (document, fișiere, sarcină) și, unde e nevoie, un **profil central** (`word365` implicit; `word2007` pentru comportamentele din laboratorul VII). Filele, grupurile, comenzile, bara de stare, meniurile sunt aceleași în toate paginile cu același profil. · verifică: `oracol_identic.py` = arborele randat în FIECARE pagină comparat cu arborele de referință ÎNGHEȚAT (nu cu randarea bibliotecii) · gata = **0 diferențe**.
- **R3. Controlat dintr-un punct central.** O schimbare făcută o dată în bibliotecă sau în `aplicatii/setari.json` (o etichetă, o comandă, tema, limba) apare în toate paginile, fără să atingi lecțiile. · verifică: probă-mutant (schimb o etichetă → o caut în toate paginile → pun înapoi) · gata = **N/N pagini**.
- **R4. Interfața fidelă** [rescris] (original: „cat mai fidele in interfata”). · verifică: (a) `oracol_ui.py` = diferențe între arborele randat și referința reală înghețată (dump UI Automation, la 1366×768 normalizat la 100% DPI, profil curat fără Developer/add-in-uri, TOATE filele + File/Backstage + bara de stare + meniurile de clic dreapta + dialogurile folosite în lecții); **o suprafață fără referință contează ca diferență, nu ca 0** · gata = **0**; (b) judecător independent pe capturi alăturate real/simulat · gata = **0 GRAV**.
- **R5. Comportamentul fidel** [rescris] (original: „si comportament”). Fiecare scenariu declară `mod: gest_real` (gestul trimis aplicației reale și starea citită — singurul fel care contează pentru gesturi) sau `model_obiect` (doar starea documentului, prin COM). Fiecare mod e probat în Etapa 0 pe un rezultat cunoscut. Gesturile care nu se pot rula invizibil merg în `de_verificat.md`, pentru Vasile, NU în oracol ca „trecute”. · verifică: `oracol_comportament.py` · gata = **0 diferențe nedocumentate**; o diferență voită intră în `abateri.md` doar după aprobarea lui Vasile (până atunci stă în `de_aprobat.md` și se numără).
- **R6. Monitorizare.** Fiecare gest al elevului în orice aplicație simulată emite un eveniment standard (aplicație, acțiune, țintă, starea înainte/după). · verifică: `oracol_evenimente.py` (gesturile din `suprafete.json` fără eveniment) · gata = **0**.
- **R7. Asistare.** Lecția evidențiază un element al interfeței și arată un indiciu lângă el prin API-ul bibliotecii, fără să deseneze nimic. Cel puțin o lecție pe aplicație ascultă evenimentele și arată indiciul după 2 greșeli sau 30 s fără progres. · verifică: probă Playwright pe acele lecții · gata = **indiciul apare pe elementul cerut, la condiția cerută, în N/N**.
- **R8. Verificarea sarcinilor nu se schimbă la mutare.** · verifică: `oracol_sarcini.py`, construit în Etapa 0 pe simulatoarele VECHI: fiecare exercițiu din fiecare lecție/joc mutat e jucat o dată cu soluția și de 2 ori greșit; verdictele se salvează în `referinte/verdicte_vechi.json` (în git) · gata = **verdicte identice** după mutare, exercițiu cu exercițiu.
- **R9. Publicare doar pe proba.** · verifică: `git log origin/master` + `curl -A "Mozilla/5.0"` pe proba · gata = **0 commit-uri ale lucrării în origin/master**; nonce-ul rundei din `aplicatii/versiune.json` apare live pe https://proba.learninghub-8z6.pages.dev/.
- **R10. Bucla, nu o singură trecere.** Runde după `prompt_runda.md` (unghiurile /promptExpert: cadru, contra, artefact, ancorare externă, critic rece) până la oprirea mecanică; T1 (reprompt) la final. · verifică: `jurnal.jsonl` + `opreste.py` (scriptul decide oprirea) + raportul T1 · gata = oprire pe convergență, sau motivul numit.
- **R11. Textul lecțiilor rămâne adevărat.** Orice comandă, filă sau poziție citată în lecțiile mutate și în fișele „Cum fac…?” există în arborele bibliotecii, în locul spus. · verifică: `oracol_text_ui.py` · gata = **0**.
- **R12. Fără butoane moarte pe drumul lecțiilor.** Orice comandă folosită de o lecție sau citată în ea funcționează; o comandă afișată și nesimulată dă mesajul central standard („În aplicația reală, X …; aici nu e simulată”), nu tace. · verifică: `oracol_comenzi_moarte.py` (comenzi pe drumul lecțiilor fără efect) · gata = **0**; se raportează și procentul de comenzi simulate din total (fără țintă).
- **R13. Proba omului** (singura care testează „găsește în laborator”). La fiecare val, Vasile face 5 sarcini în simulator, apoi aceleași pe un PC real, și bifează „găsit / nu găsit” pe o fișă de 1 minut. · verifică: omul · gata = **≥ 4/5 găsit**; fiecare „nu găsit” devine ținta rundei următoare.

## I — cerințe implicite
- I1. Telefon + laptop: biblioteca merge la 360-390 px și la 1366×657 cu zoom 125% (ecranele din `lectii/_build/oracol_controale_taiate.py`, care rămâne 0).
- I2. Nicio regresie: `test_joc.py --toate` (învelit să tipărească numărul de jocuri picate), `cum-fac/_build/build.mjs --verifica` → 0 (sau fișele resincronizate), `jocuri/_motor/proba_fereastra_mica.py` → 0, `oracol_controale_taiate.py` → 0, `C:\00\AI_0\tools\learninghub_date_personale.py` → 0.
- I3. Textul lecțiilor rămâne pe „ambele nume” (Pornire (Home)); comutatorul RO vine într-un val ulterior, cu termeni din surse Microsoft ro-ro.
- I4. Word 2007 (VII, un laborator): profilul `word2007` păstrează ce e adaptat azi (Ctrl+Z pe literă, VII·2, `wordobj-interfata.js`); nu se strică `lectii/vii/m1-l02/_verificare/j2_parcurs.py`.
- I5. Regula 24 (probele în browser blochează tot ce nu e 127.0.0.1), port liber, regula 27 (date personale 0). NU rulez probele care scriu pe serverul viu (`proba_prezenta`, `proba_diploma`, orice cu teste-vasile / teste.api / lh-api).
- I6. Nimic pe ecranul lui: Office real doar invizibil (COM DispatchEx, `DisplayAlerts=0`, timeout 60 s pe apel, închid doar PID-urile mele). **PowerPoint**: dacă `POWERPNT.EXE` rulează deja, scenariul se sare (o singură instanță — `Quit()` i-ar închide prezentările). Explorer/Windows pe desktopul ascuns doar după o probă că fereastra nu sare pe ecranul lui. Referința pentru Start + bara de activități cere ecranul lui → o sesiune de 10 minute cu el (întrebarea 1); până atunci acele suprafețe se numără ca „fără referință”.
- I7. Fără resurse proprietare copiate: icoane Fluent (MIT), fonturi de sistem, nicio captură Microsoft folosită ca interfață.
- I8. Commit-urile altor sesiuni pe proba nu se pierd: fetch + merge `origin/proba` înainte de fiecare publicare; conflict în `aplicatii/` sau `jocuri/_motor/` → `merge --abort` și valul se oprește; RE-MĂSOR pe rezultatul unirii; push respins → reiau fetch/merge/măsurare de cel mult 2 ori; niciodată `--force`.
- I9. Se încarcă repede pe PC-urile vechi: pagina interactivă în ≤ 3 s cu procesorul încetinit de 4× (Playwright) [presupus].
- I10. Evenimentele rămân în pagină (plus ce trimite deja motorul); niciun câmp nou despre elevi pe server [presupus].
- I11. Ce se lucrează rămâne pe disc, nu în Temp: tot dosarul lucrării e în `_campaign/aplicatii_fidele_2026_11/`, în git pe ramura de lucru.

## Cititorul-țintă
ȘTIE: mouse, tastatură, telefon, să urmeze un pas scris. / NU ȘTIE: panglica, numele comenzilor, scurtăturile, ce e un folder, ce înseamnă „salvat”. / CUM SE POARTĂ: dă clic unde i se pare, apasă repede de mai multe ori, nu citește mesajele lungi, încearcă exact ce a văzut în lecție pe PC-ul din laborator. [presupus: începător]

## Glosar de sensuri
- „aplicația reală” = Windows 11 (română) + Microsoft 365 / Office 16 (interfață engleză), cum sunt pe PC-ul lui. (Ales de el, 16.11.)
- „fidel” = aceleași elemente vizibile, în aceeași ordine și în același loc, cu aceleași etichete; același gest duce la aceeași stare finală ca în aplicația reală. Măsurat cu R4 + R5 față de referința ÎNGHEȚATĂ, nu față de ce a scris agentul.
- „aceeași indiferent de lecție” = arborele de interfață identic în toate paginile cu același profil; lecția schimbă doar conținutul și sarcina.
- „punct central” = folderul `aplicatii/` + `aplicatii/setari.json` (versiune, profil, limbă, temă); paginile lecțiilor nu conțin cod de interfață.
- „monitorizăm” = evenimente pe gest, în pagină, standardizate.
- „asistăm” = evidențiere + indiciu pe elementul interfeței; biblioteca NU face gestul în locul elevului.
- „verificăm” = interogarea stării aplicației, nu doar a ultimului clic.
- „reușești” = toate oracolele și porțile la 0 (R1-R12, I1-I2) + critic rece fără GRAV pe 3 unghiuri la rând + R13 ≥ 4/5.
- „pe repeat” = runde până la oprirea mecanică (convergență sau platou), decisă de `opreste.py`, nu de mine.
- „pentru moment” (proba) = până zice el „pune-l în producție”.

## Întrebări de client (cu implicitul luat dacă nu primesc răspuns)
1. Sesiunea de 10 minute pentru Windows (deschizi tu Start, meniul de clic dreapta pe desktop, bara de activități; eu doar citesc structura cu UI Automation) → implicit: o cer la raportul de dimineață; până atunci Windows rămâne „fără referință”.
2. Accesoriile Windows (Paint, Notepad, Calculator) → implicit: **Paint da** (7 lecții), după cele 5 principale; Notepad/Calculator doar dacă apar în lecții.
3. Producția → implicit: **neatinsă** până zici tu.
4. Aprobarea reperelor (Etapa 0) → implicit: valul B pornește după ce le vezi la raportul de dimineață; dacă nu răspunzi până la 12:00, pornesc cu ele așa cum sunt și o scriu în raport.

## Etapele și durata (estimare, spusă înainte)
- **0. Reperele** (oracole + referințe noi + verdictele vechi + bănci de mutanți, înghețate): ~4-6 ore — **noaptea 16→17.11**.
- **B. Biblioteca centrală** pe pagina-poligon `aplicatii/` (Word, Excel, PowerPoint, Explorer, Windows; apoi Paint), fără mutări: ~10-15 ore.
- **C. Mutarea lecțiilor**, o aplicație pe val, cu `oracol_sarcini` ca poartă: ~10-15 ore.
- **D. Bucla până la oprire + T1**: în timpul B/C și la final.
- **Total ~30-45 de ore de lucru al agenților = 4-6 nopți.** Bugetul săptămânii: VERDE, 0% (`consum.py`, 20:49).

## Decizii luate (după aprobare)
- 16.11 20:5x, Vasile: ținta = Windows 11 + M365; limba = engleză acum + comutator RO mai târziu; ritmul = valuri pe nopți, publicare pe proba după fiecare val verificat.
- 16.11 20:44, Vasile: publicarea pe https://proba.learninghub-8z6.pages.dev/, nu pe producție.
- 16.11 20:45, Vasile: interfața întreagă și aceeași în toate lecțiile, controlată dintr-un singur loc.
