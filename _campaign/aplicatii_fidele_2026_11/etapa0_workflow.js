export const meta = {
  name: 'aplicatii-fidele-etapa0',
  description: 'LearningHub aplicatii fidele: Etapa 0 - reperele (inventar, referinte reale, oracole, banci de mutanti), apoi verificator independent',
  phases: [
    { title: 'Inventar si referinte', detail: 'inventarul paginilor + referinte UIA Office reale + pregatirea referintei Windows/Explorer' },
    { title: 'Oracole', detail: 'scenarii reale, oracolul sarcinilor, oracolele de structura si de comportament, infrastructura' },
    { title: 'Verificare', detail: 'verificator independent: banci de mutanti, linia de baza, ce nu masoara nimic' },
  ],
}

const WT = 'C:/00/Projects/LearningHub_fidel'
const D = WT + '/_campaign/aplicatii_fidele_2026_11'

const COMUN = `
CONTEXT COMUN (citește întâi ${D}/contract.md — R1-R13, I1-I11, Etapa 0; și ${D}/prompt_runda.md ca să știi cum vor fi folosite reperele tale).
Lucrarea: o bibliotecă centrală de aplicații simulate (Windows 11, File Explorer, Word, Excel, PowerPoint, apoi Paint), fidelă aplicațiilor reale (Windows 11 RO + Microsoft 365 / Office 16 cu interfață ENGLEZĂ, instalate pe acest PC), folosită identic de toate lecțiile LearningHub. ACUM e Etapa 0: construim DOAR reperele de măsurare (nu biblioteca, nu reparații). Simulatoarele VECHI sunt în ${WT}/lectii/_sim/*.js și ${WT}/jocuri/*/ + ${WT}/jocuri/_motor/ (ui-panglica.js, panglica-*.json, tip-excel.js, tip-foaie.js).
Worktree: ${WT} (ramura fidelitate-aplicatii). NU atingi C:/00/Projects/LearningHub (alt worktree) decât pentru citire. NU faci commit, NU faci push (le face dirijorul).
Reguli ferme:
- Scrii DOAR fișierele pe care le deții (lista din sarcina ta). Orice alt fișier = doar citire.
- Fiecare oracol pe care îl scrii: Python, rulabil cu „python <cale absolută>”, tipărește pe ULTIMA linie DOAR un întreg (numărul de probleme), fără linii goale în ultimele 3 rânduri; cod de ieșire 0 (nicio problemă) sau 1 (probleme); orice prăbușire = alt cod. Detaliile într-un JSON lângă (calea tipărită mai sus).
- Probele în browser (Playwright Python): server static local pe port liber ("127.0.0.1", 0) servind ${WT}; ctx.route care ABANDONEAZĂ orice cerere spre altceva decât 127.0.0.1/localhost (regula 24). NU rulezi probe care scriu pe serverul viu (proba_prezenta.py, proba_diploma.py, nimic cu teste-vasile / teste.api / lh-api / diplome.py).
- Nimic pe ecranul profesorului: Office doar invizibil (COM DispatchEx, Visible=False unde se poate, DisplayAlerts=0) sau pe desktop ascuns (python C:/00/AI_0/tools/hidden_desktop.py run --timeout N -- python <script>), instanță NOUĂ (/x la Word/Excel), timeout 60 s pe apel, închizi DOAR PID-urile pornite de tine. PowerPoint: dacă POWERPNT.EXE rulează deja (tasklist), NU-l porni — sari și notezi. Nu schimbi nicio setare a lui Office/Windows (registru, panglică, opțiuni).
- Căi absolute în fiecare comandă; fără „cd”. Shell-ul Bash e Git Bash pe Windows.
- Date personale: zero nume de elevi/persoane în ce scrii (sari MeControl/Account în dump-uri).
- Nu inventezi ce face aplicația reală: orice fapt despre ea vine din aplicația rulată, din dump sau dintr-o pagină Microsoft cu URL; altfel îl marchezi [NEVERIFICAT].
- La final întorci DOAR obiectul cerut de schemă; în „probleme_deschise” pui onest ce n-ai putut face și de ce.`

const RAPORT = {
  type: 'object',
  properties: {
    fisiere_scrise: { type: 'array', items: { type: 'string' } },
    comenzi: { type: 'array', items: { type: 'object', properties: { cmd: { type: 'string' }, ultima_linie: { type: 'string' }, cod_iesire: { type: 'integer' } }, required: ['cmd', 'ultima_linie'] } },
    rezumat: { type: 'string' },
    probleme_deschise: { type: 'array', items: { type: 'string' } },
  },
  required: ['fisiere_scrise', 'comenzi', 'rezumat', 'probleme_deschise'],
}

const FORMAT_SCENARIU = `
FORMATUL COMUN AL SCENARIILOR (îl folosesc și rularea reală, și rularea în simulator — nu-l schimba):
${D}/scenarii/<aplicatie>/<id>.json = {"id": "...", "aplicatie": "word|excel|powerpoint|explorer|windows|paint", "mod": "gest_real|model_obiect",
 "descriere": "...", "start": {...starea de pornire: text, celule, diapozitive, arbore de fișiere...},
 "pasi": [{"gest": "tasteaza|taste|clic|dublu_clic|triplu_clic|clic_dreapta|selecteaza|comanda_panglica|meniu|trage", ...parametri}],
 "stare_citita": ["chei din starea finală care se compară, ex. text, formatare_pe_caractere, celule, nume_fisiere"],
 "lectii": ["v/m2-l12", ...], "sursa_gest": "fisier:rand din lecție unde se predă gestul"}
Rezultatul real: ${D}/referinte/scenarii_real/<id>.json = {"id", "mod_probat": true|false, "stare": {...cheile din stare_citita...}, "eroare": null|"...", "cum": "COM|UIA pe desktop ascuns|IFileOperation|..."}.
Rezultatul simulat (scris de oracolul O4): ${D}/runde/_sim/<id>.json, aceeași formă.`

phase('Inventar si referinte')
const [inventar, refOffice, refShell] = await parallel([
  () => agent(`${COMUN}
SARCINA TA: INVENTARUL. Deții: ${D}/inventar.json, ${D}/suprafete.json, ${D}/inventar_build.py.
1. Scrie ${D}/inventar_build.py care găsește (static, din HTML/JS) TOATE paginile din ${WT}/lectii/*/*/index.html și ${WT}/jocuri/*/index.html care simulează o aplicație din perimetru: Windows (desktop-windows, siguranta-pc), File Explorer (explorer-*), Word (wordobj*, wordfisier, wordteh-*, jocurile word-*), Excel (excelx*, registru-foi, tip-excel, tip-foaie, jocurile excel-*), PowerPoint (simppt*, jocurile prezentari-*), Paint (paint*). În afara perimetrului: browser, poștă, Clipchamp, audio, Scratch, Code::Blocks/cpp, editor web, algoritmi.
2. inventar.json = listă de pagini: {pagina, aplicatii[], fisiere_sim[], incarca_ui_panglica: bool, suprafete_atinse[] (file ale panglicii, Backstage/File, bara de stare, meniu clic dreapta, dialoguri, panoul de navigare etc.), gesturi[] (fiecare: gest + fișier:rând unde e predat/cerut), exercitii[] (fiecare: id, cum se verifică — funcția/fișier:rând), complexitate (număr de gesturi distincte; ordinea de mutare = cele mai simple întâi)}. Citește codul simulatoarelor, nu ghici.
3. suprafete.json = pe fiecare aplicație, lista suprafețelor de interfață (id stabil, nume, ce conține, în câte pagini apare) și lista gesturilor (id stabil, descriere, pagini). Include și suprafețele aplicației reale pe care lecțiile nu le folosesc încă, dar pe care elevul le vede la deschidere (ex. toate filele panglicii, bara de titlu, Acces rapid, bara de stare, meniul File) — R2 cere interfața ÎNTREAGĂ.
Tipărește la final numărul de pagini în perimetru. Raportează câte pagini, câte pe aplicație, câte exerciții.`, { label: 'inventar', phase: 'Inventar si referinte', schema: RAPORT }),

  () => agent(`${COMUN}
SARCINA TA: REFERINȚELE REALE OFFICE (Word, Excel, PowerPoint). Deții: ${D}/referinte/dump_uia_office.py, ${D}/referinte/uia_word.json, uia_excel.json, uia_powerpoint.json, ${D}/referinte/README_referinte.md, ${D}/referinte/surse_microsoft.md.
Precedent care MERGE: ${WT}/_cercetare/office_comenzi/dump_panglica_uia.py (rulează pe desktop ascuns cu hidden_desktop.py, instanță nouă, pywinauto UIA). Defectele lui, de reparat: (a) a salvat doar 7 file la Word (lipsesc Draw, Mailings) și la PowerPoint lipsesc Draw/Record/Review — vrem TOATE filele afișate implicit; (b) Excel a prins fila Developer = setare personală → o marchezi „personal”, exclusă din referință (NU schimbi setarea); (c) coordonatele sunt la ~150% DPI și fereastră mare → normalizezi: fereastra la 1366×768 (MoveWindow pe instanța ta, pe desktopul ascuns) și împarți la factorul DPI, ca rect-urile să fie în pixeli CSS la 100%; păstrezi și valorile brute; (d) doar panglica → adaugi: bara de titlu, Acces rapid (Quick Access Toolbar), bara de stare, File/Backstage (paginile Home/New/Open/Save As/Print la nivel de listă și titluri), meniul de clic dreapta în document/celulă/diapozitiv, și dialogurile folosite în lecții (Font, Paragraph, Page Setup, Format Cells, Insert Table etc. — lista o iei cu grep din ${WT}/lectii/_sim și ${WT}/jocuri). Dacă o suprafață nu se poate deschide invizibil, o scrii în README cu motivul.
Dacă Office are un mod fără personalizări (ex. /safe) care NU schimbă setările omului, îl poți folosi; scrie ce ai folosit.
Fiecare JSON: {aplicatie, versiune (din exe), generat, mod_pornire, dpi_factor, fereastra:[w,h], suprafete:{<id>: arbore {tip, eticheta, id_mso?, rect_css, copii[]}}, excluse_personal:[...]}.
Verifică-ți munca: numără filele și grupurile pe aplicație și compară cu lista oficială M365 SAEC din ${WT}/_cercetare/office_comenzi/M365_SAEC (dacă e acolo) — scrie diferențele.`, { label: 'referinte-office', phase: 'Inventar si referinte', schema: RAPORT }),

  () => agent(`${COMUN}
SARCINA TA: REFERINȚA PENTRU WINDOWS 11 ȘI FILE EXPLORER — fără să atingi ecranul omului. Deții: ${D}/referinte/dump_shell_uia.py, ${D}/referinte/sesiune_windows_10min.md, ${D}/referinte/explorer_motor/ (scripturi + rezultate), ${D}/referinte/uia_explorer.json (doar dacă reușești în siguranță).
Fapte de știut: Windows 11 în română pe acest PC. Shell-ul (bara de activități, Start) rulează pe desktopul lui; un explorer.exe pornit de pe un desktop ascuns își poate preda fereastra procesului explorer de pe ecranul lui (fereastra ar apărea la el) — NEPROBAT. Deci:
1. NU porni explorer.exe și NU deschide ferestre pe ecranul lui. Nu citi UIA de pe desktopul lui (Default) — e ecranul lui.
2. Scrie dump_shell_uia.py: un script DOAR-CITIRE (UI Automation, fără mouse/tastatură) care, rulat în sesiunea de 10 minute CU omul (el deschide pe rând: meniul Start, bara de activități, meniul de clic dreapta pe desktop, o fereastră File Explorer cu panoul de navigare, meniul New, meniul de clic dreapta pe un fișier, fereastra Proprietăți), salvează arborele fiecărei suprafețe (etichetă, tip, rect normalizat la 100% DPI) în uia_explorer.json / uia_windows.json; sare peste numele de utilizator/cont. Scrie sesiune_windows_10min.md = foaia de pași pentru om (scurtă, câte un rând pe pas, ce deschide el și ce comandă rulez eu).
3. Comportamentul Explorer care se poate măsura FĂRĂ fereastră, cu motorul real al shell-ului: IFileOperation / Shell.Application într-un folder temporar al tău (ex. %TEMP%/lh_explorer_ref): numele „New folder”/„Folder nou”, „New folder (2)”, copierea în același folder („ - Copy”/„ - Copie”), redenumirea cu extensie, ștergerea în Coșul de reciclare vs. definitiv, sortarea implicită după nume (ordinea naturală „fișier2” < „fișier10”: StrCmpLogicalW). Pentru fiecare: scrii scenariul în formatul comun și rezultatul real; mod: model_obiect; „cum” = API-ul folosit. Fiecare fapt cu proba lui (ieșirea reală).
${FORMAT_SCENARIU}
Întoarce ce ai măsurat și ce rămâne pentru sesiunea cu omul.`, { label: 'referinte-windows-explorer', phase: 'Inventar si referinte', schema: RAPORT }),
])
log('Inventar: ' + (inventar ? inventar.rezumat.slice(0, 200) : 'ESUAT'))

phase('Oracole')
const rezultateOracole = await parallel([
  () => agent(`${COMUN}
SARCINA TA: SCENARIILE DE COMPORTAMENT ÎN OFFICE-UL REAL. Deții: ${D}/scenarii/word/, ${D}/scenarii/excel/, ${D}/scenarii/powerpoint/, ${D}/referinte/scenarii_real/ (word-*, excel-*, powerpoint-*), ${D}/referinte/ruleaza_real.py, ${D}/referinte/probe_mod.md.
Inventarul gesturilor e în ${D}/inventar.json și ${D}/suprafete.json (deja scrise). Scrie câte un scenariu pentru fiecare gest predat în lecții la Word/Excel/PowerPoint (tastare, selecție cu mouse/Shift/Ctrl, dublu/triplu clic, Ctrl+B/I/U/Z/Y/C/V/X, Enter/Tab/săgeți/F2/F4/Delete în Excel, umplere, formule, mărire/micșorare font, alinieri, liste, stiluri, margini, orientare, tabel, imagine, diapozitiv nou, aspect, temă, tranziție, animație, salvare cu nume).
${FORMAT_SCENARIU}
ruleaza_real.py rulează scenariile în aplicațiile reale, invizibil, și scrie scenarii_real/. REGULI PENTRU „mod”:
- model_obiect = pașii se fac prin modelul de obiecte (COM) și se citește starea — dovedește STAREA FINALĂ a unei comenzi, NU cum răspunde aplicația la tastă/mouse.
- gest_real = gestul ajunge la aplicație ca gest (ex. UI Automation Invoke pe butonul panglicii, pe desktop ascuns) și se citește starea. Pe desktop ascuns SendInput NU ajunge și tastele trimise prin PostMessage nu țin Ctrl apăsat — deci NU pretinde gest_real pentru scurtături de tastatură dacă n-ai dovedit.
- În probe_mod.md dovedești FIECARE mod folosit pe un rezultat cunoscut (ex. Invoke pe Bold → caracterele devin bold; o probă care ar trebui să pice chiar pică).
- Gesturile pe care nu le poți rula invizibil (tastarea literă cu literă + Ctrl+Z, triplu clic, tragere, clic dreapta) NU primesc rezultat inventat: le treci în ${D}/de_verificat.md (pe care îl deții tu, secțiunea Office) cu pașii pentru profesor, 1 rând fiecare.
- Word 2007 din laboratorul VII: comportamentul lui la Ctrl+Z (literă cu literă) e un fapt de la profesor (13.11.2026); scenariile acelea primesc și câmpul "profil": "word2007" cu starea așteptată din ${WT}/lectii/vii/m1-l02 (citește lecția), fără rulare reală.
Rulează tot; raportează câte scenarii, câte rulate real, câte mod_probat=true, câte trimise la profesor.`, { label: 'scenarii-office-real', phase: 'Oracole', schema: RAPORT }),

  () => agent(`${COMUN}
SARCINA TA: ORACOLUL SARCINILOR (O6, cerința R8). Deții: ${D}/oracole/oracol_sarcini.py, ${D}/referinte/verdicte_vechi.json, ${D}/oracole/sarcini_lib/ (dacă ai nevoie de module).
Scop: când lecțiile se vor muta pe biblioteca nouă, verificarea fiecărui exercițiu trebuie să dea EXACT aceleași verdicte. Deci acum, pe simulatoarele VECHI, pentru fiecare pagină din ${D}/inventar.json și fiecare exercițiu interactiv al ei: îl joci în Playwright (rețea blocată, port liber) o dată cu soluția corectă și de 2 ori greșit (două greșeli diferite, tipice pentru elev), și salvezi verdictul pe care îl dă pagina (corect/greșit + mesajul/scorul afișat) în verdicte_vechi.json: {pagina: {exercitiu: {solutie: verdict, gresit1: {pasi, verdict}, gresit2: {pasi, verdict}}}}.
Cum găsești soluțiile: citește configurația vie a paginii (ex. obiectele de configurare ale motorului în fereastră, câmpurile solutie/verifica din _sim/*.js); jocurile din ${WT}/jocuri au deja ${WT}/jocuri/_motor/test_joc.py care le joacă — refolosește-i logica, nu o rescrie. Un exercițiu pe care nu-l poți juca automat îl marchezi „nejucabil” cu motivul (se numără separat, nu ascunzi).
oracol_sarcini.py: rejoacă aceiași pași pe starea curentă a sitului și numără verdictele DIFERITE de verdicte_vechi.json + exercițiile dispărute; ultima linie = acel număr. Pe situl de acum TREBUIE să dea 0 (dovedește-o) și TREBUIE să dea >0 dacă strici verificarea unui exercițiu (dovedește pe o copie temporară, nu pe fișierele reale).
Lucrarea e mare (~48 de lecții + 8 jocuri): ai voie să pornești subagenți pentru felii de pagini, cu ieșiri pe fișiere separate pe care apoi le unești tu. Raportează: pagini, exerciții, jucate, nejucabile (cu motive grupate).`, { label: 'oracol-sarcini', phase: 'Oracole', schema: RAPORT }),

  () => agent(`${COMUN}
SARCINA TA: ORACOLELE DE STRUCTURĂ. Deții: ${D}/oracole/oracol_central.py (O1, R1), oracol_identic.py (O2, R2), oracol_ui.py (O3, R4a), oracol_text_ui.py (O7, R11), oracol_comenzi_moarte.py (O8, R12), ${D}/oracole/structura_lib.py, ${D}/oracole/arbore_randat.js (dacă ai nevoie de un extractor injectat în pagină).
Intrări: ${D}/inventar.json, ${D}/suprafete.json, referințele ${D}/referinte/uia_*.json (scrise de alt agent; dacă una lipsește, suprafețele ei se numără ca „fără referință” = diferență, NU 0).
- O1: pagini din inventar care desenează interfață de aplicație în afara bibliotecii centrale ${WT}/aplicatii/ (încă nu există → azi toate paginile din perimetru se numără). Definește precis: static (încarcă un _sim din perimetru / ui-panglica.js / își construiește fereastra) + DOM (elemente de interfață de aplicație care nu sunt sub rădăcina bibliotecii, marcată data-lh-aplicatie).
- O2: pentru fiecare pagină, arborele de interfață randat (file, grupuri, comenzi, bara de stare, meniuri — extras din DOM printr-o convenție pe care o scrii în ${D}/oracole/CONVENTIE_ARBORE.md, pe care biblioteca va trebui s-o respecte) comparat cu arborele de REFERINȚĂ ÎNGHEȚAT derivat din uia_*.json (NU cu randarea bibliotecii — altfel e adevărat prin construcție). Numără diferențele pe pagini.
- O3: diferențe de interfață față de referința reală: etichete, ordine, grupare, tip control, prezența comenzilor, poziția relativă (toleranță scrisă), la 1366×768; o suprafață din suprafete.json fără referință = 1 diferență.
- O7: orice nume de comandă/filă/poziție citat în textul lecțiilor din inventar și în fișele „Cum fac…?” (${WT}/cum-fac/_sursa/fise_*.json) care NU există în arborele de referință (azi) / al bibliotecii (mai târziu) în locul spus. Numele românești din paranteze („Pornire (Home)”) se acceptă ca alias doar dacă perechea EN există.
- O8: comenzi folosite sau citate pe drumul lecțiilor care, apăsate în pagină, nu produc niciun efect (nici stare, nici mesaj) — azi pe simulatoarele vechi (ex. data-nesim din ui-panglica.js). Tipărește și procentul de comenzi simulate din total, pe un rând separat ÎNAINTE de ultima linie.
Fiecare oracol: rulează-l pe situl de acum și scrie linia de bază; apoi dovedește pe o COPIE TEMPORARĂ (nu pe fișierele reale) că prinde o greșeală plantată de tipul lui. Rețea blocată, port liber.`, { label: 'oracole-structura', phase: 'Oracole', schema: RAPORT }),

  () => agent(`${COMUN}
SARCINA TA: ORACOLELE DE COMPORTAMENT, EVENIMENTE, ASISTARE + CONTRACTUL API AL BIBLIOTECII. Deții: ${D}/api_biblioteca.md, ${D}/oracole/oracol_comportament.py (O4, R5), oracol_evenimente.py (O5, R6), oracol_asistare.py (O9, R7), ${D}/oracole/sim_runner.js (sau .py).
1. api_biblioteca.md = contractul pe care biblioteca ${WT}/aplicatii/ îl va respecta (scurt, precis): cum o încarcă o pagină (un singur <script> + un apel, ex. LH.aplicatii.deschide('word', {continut, profil, sarcina})); setari.json (versiune, profil word365|word2007, limba en|ro, tema); evenimentele standard (nume, câmpuri: aplicatie, actiune, tinta, inainte, dupa, ts) + cum le ascultă lecția; API-ul de stare (stare('word') → text + formatare pe caractere, stare('excel') → celule/formule/format, stare('powerpoint') → diapozitive/obiecte, stare('explorer') → arbore de foldere/fișiere, stare('windows') → ferestre); API-ul de asistare (evidentiaza(tinta), indiciu(tinta, text), reguli: după 2 greșeli sau 30 s fără progres); executarea unui pas de scenariu în simulator (pentru O4). Fă-l compatibil cu fereastra mică (${WT}/jocuri/_motor/proba_fereastra_mica.py) și cu bara pașilor din motor — citește-le.
2. O4: rulează în simulator (Playwright, rețea blocată) fiecare scenariu din ${D}/scenarii/**.json (formatul de mai jos; alt agent scrie acum scenariile și rezultatele reale — dacă încă nu sunt, construiești pe format și probezi pe 2-3 scenarii scrise de tine ca exemplu în ${D}/oracole/_exemple_scenarii/) și compară starea cu ${D}/referinte/scenarii_real/<id>.json pe cheile din stare_citita. Numără: diferențe + scenarii fără rezultat real cu mod_probat=true (acelea NU trec, se numără separat pe un rând înaintea ultimei linii) + scenarii pe care simulatorul nu le poate executa. Azi (fără bibliotecă) rulează pe simulatoarele vechi unde se poate (pagina din „lectii” a scenariului) — linia de bază va fi mare; e corect.
${FORMAT_SCENARIU}
3. O5: pentru fiecare gest din ${D}/suprafete.json, făcut în pagină, există evenimentul standard din api_biblioteca.md? Numără gesturile fără eveniment (azi: toate).
4. O9: pe o pagină-probă per aplicație: biblioteca evidențiază elementul cerut și arată indiciul la condiția cerută. Azi biblioteca nu există → numără cazurile picate (toate).
Fiecare oracol: linia de bază pe situl de acum + dovada pe o copie temporară că prinde o greșeală plantată (pentru O5/O9 poți planta într-o pagină-jucărie care implementează API-ul fals).`, { label: 'oracole-comportament-api', phase: 'Oracole', schema: RAPORT }),

  () => agent(`${COMUN}
SARCINA TA: INFRASTRUCTURA DE MĂSURARE. Deții: ${D}/oracole/masoara.py, ${D}/oracole/porti.py, ${D}/opreste.py, ${D}/ingheata.py, ${D}/mutanti/mutanti.py, ${D}/mutanti/banca.json, ${D}/pregateste_runda.py.
Ceilalți agenți scriu ACUM oracolele O1-O9 în ${D}/oracole/ (oracol_central, oracol_identic, oracol_ui, oracol_comportament, oracol_evenimente, oracol_sarcini, oracol_text_ui, oracol_comenzi_moarte, oracol_asistare). Nu le atingi.
1. porti.py: rulează porțile de regres și tipărește pe ultima linie numărul de porți picate: ${WT}/jocuri/_motor/test_joc.py --toate (iese cu cod, n-are număr — îl înveli: cod≠0 = picat; NU modifici test_joc.py), ${WT}/lectii/_build/oracol_controale_taiate.py (citește-i ieșirea), node ${WT}/cum-fac/_build/build.mjs --verifica, ${WT}/jocuri/_motor/proba_fereastra_mica.py (verifică întâi că nu scrie pe serverul viu), python C:/00/AI_0/tools/learninghub_date_personale.py (află cum îl îndrepți spre worktree-ul ${WT}; dacă nu se poate, notezi), și proba Word 2007 C:/00/Projects/LearningHub/lectii/vii/m1-l02/_verificare/j2_parcurs.py (_verificare nu e în git — găsește cum o rulezi pe ${WT}, ex. o copiezi în ${D}/oracole/porti_extra/ cu calea parametrizată). Rulează-le, scrie linia de bază și timpii.
2. masoara.py --runda N: verifică întâi ${D}/repere.lock (dacă există) contra sha256 al fișierelor înghețate; rulează O1-O9 + porti.py (fiecare cu timeout; ultima linie trebuie să fie întreg, altfel „NECONCLUDENT”); scrie ${D}/runde/N/masurare.json; ultima linie = suma problemelor sau -1 dacă un oracol e neconcludent sau lock-ul e rupt.
3. ingheata.py: scrie repere.lock (sha256 pentru ${D}/oracole/**, ${D}/referinte/**, ${D}/suprafete.json, ${D}/api_biblioteca.md, ${D}/scenarii/**) și --verifica.
4. mutanti/mutanti.py + banca.json: bancul de mutanți — fiecare mutant = (fișier din simulatoarele VECHI sau dintr-o pagină-jucărie, înlocuire exactă, oracolul care TREBUIE să-l prindă). Minimum 5 pe fiecare oracol O1-O9. Rulează fiecare mutant pe o COPIE TEMPORARĂ a worktree-ului (robocopy/shutil în %TEMP%, fără node_modules), rulează oracolul vizat cu o variabilă de mediu LH_RADACINA=<copia> (convenție pe care o scrii în ${D}/oracole/CONVENTIE_RADACINA.md — ceilalți agenți o vor respecta; dacă un oracol n-o respectă încă, mutantul iese NEPRINS cu motivul). Un mutant e PRINS dacă numărul oracolului crește față de copia nemutată. Ultima linie = mutanți neprinși.
5. opreste.py: citește ${D}/jurnal.jsonl și decide CONTINUA / OPRESTE (convergență: toate oracolele și porțile 0 + 3 runde la rând fără GRAV de critic pe 3 unghiuri diferite; platou: aceleași numere O1-O9 în 3 runde; limită: 6 runde pe val; lock rupt; consum ROȘU — python C:/00/AI_0/tools/consum.py, ultima linie: -1 = ?, citește-i ieșirea). Tipărește decizia și motivul.
6. pregateste_runda.py N: completează ${D}/prompt_runda.md ({N}, {ETAPA}, {APLICATIA}, {UNGHI} = aspect|gest_tastatura|stare_finala_erori după N mod 3, {TINTA_PROPUSA} din runda N-1) în ${D}/runde/N/prompt.md.
Scrie simulatoare mici pentru opreste.py (jurnale false: convergență, platou, GRAV deschis) și dovedește că decide corect.`, { label: 'infrastructura', phase: 'Oracole', schema: RAPORT }),
])

phase('Verificare')
const verdict = await agent(`${COMUN}
EȘTI VERIFICATORUL INDEPENDENT AL ETAPEI 0. Nu ai scris nimic din ce verifici; nu repari nimic (doar citești și rulezi; poți scrie DOAR ${D}/verificare_etapa0.md și fișiere temporare în %TEMP%).
Ce trebuie dovedit înainte ca reperele să fie înghețate:
1. Fiecare oracol O1-O9 și porti.py rulează și respectă contractul (ultima linie = întreg, ultimele 3 rânduri nevide, cod 0/1). Rulează-le pe rând, cu timp.
2. Rulează ${D}/mutanti/mutanti.py: câți mutanți pe oracol, câți prinși. Cerința: ≥5 prinși pe fiecare oracol. Citește 2 mutanți pe oracol și judecă dacă sunt greșeli REALISTE (ce ar face un reparator grăbit), nu de paie.
3. Caută oracole adevărate prin construcție: compară ceva cu el însuși (ex. O2 contra randării bibliotecii, O4 contra unui „real” scris de mână fără mod_probat, O6 contra unor verdicte generate de oracolul însuși fără să joace pagina). Citește codul.
4. Referințele: uia_word/excel/powerpoint.json au toate filele implicite (compară cu M365 SAEC din ${WT}/_cercetare/office_comenzi/), File/Backstage, bara de stare, meniuri contextuale? Ce suprafețe din suprafete.json n-au referință (și se numără ca diferență?).
5. Scenariile: câte au mod_probat=true; probe_mod.md dovedește fiecare mod pe un rezultat cunoscut? Vreun „gest_real” care e de fapt COM?
6. verdicte_vechi.json: câte exerciții jucate / nejucabile; ia 3 la întâmplare (după index, nu aleator) și verifică în pagină că verdictul salvat e cel real.
7. Rețeaua blocată în toate probele de browser (caută ctx.route / route.abort); nicio probă nu atinge serverul viu.
Scrie ${D}/verificare_etapa0.md: pe fiecare punct DA/NU + dovada (comandă + ultima linie, fișier:rând), lista reparațiilor necesare înainte de înghețare, și verdictul: GATA_DE_INGHETAT / REPARATII_NECESARE.`, {
  label: 'verificator-etapa0', phase: 'Verificare',
  schema: {
    type: 'object',
    properties: {
      verdict: { type: 'string', enum: ['GATA_DE_INGHETAT', 'REPARATII_NECESARE'] },
      linia_de_baza: { type: 'object', additionalProperties: { type: 'string' } },
      mutanti_prinsi_pe_oracol: { type: 'object', additionalProperties: { type: 'string' } },
      reparatii_necesare: { type: 'array', items: { type: 'string' } },
      adevarate_prin_constructie: { type: 'array', items: { type: 'string' } },
      rezumat: { type: 'string' },
    },
    required: ['verdict', 'linia_de_baza', 'mutanti_prinsi_pe_oracol', 'reparatii_necesare', 'adevarate_prin_constructie', 'rezumat'],
  },
})

return { inventar, refOffice, refShell, oracole: rezultateOracole, verdict }
