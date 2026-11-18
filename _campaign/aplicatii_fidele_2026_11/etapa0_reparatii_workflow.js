export const meta = {
  name: 'aplicatii-fidele-etapa0-reparatii',
  description: 'LearningHub aplicatii fidele: reparatiile cerute de verificatorul Etapei 0 (proprietari separati), bancul de mutanti rulat intreg, reverificare independenta',
  phases: [
    { title: 'Reparatii', detail: '3 agenti pe fisiere disjuncte: oracolele de structura, oracolele de comportament/asistare, infrastructura' },
    { title: 'Mutanti', detail: 'mutantii noi + bancul rulat INTREG + portile' },
    { title: 'Reverificare', detail: 'verificator proaspat, apoi o singura runda de reparatii daca e nevoie' },
  ],
}

const WT = 'C:/00/Projects/LearningHub_fidel'
const D = WT + '/_campaign/aplicatii_fidele_2026_11'

const COMUN = `
CONTEXT: lucrarea „Aplicațiile fidele” din LearningHub (bibliotecă centrală de aplicații simulate fidele Windows 11 / File Explorer / Word / Excel / PowerPoint / Paint reale). Suntem la Etapa 0: reperele de măsurare (oracole, referințe, scenarii, banca de mutanți) au fost construite, iar un verificator independent a cerut REPARAȚII înainte de înghețare. Raportul lui: ${D}/verificare_etapa0.md — citește-l ÎNTREG întâi (secțiunile 2, 3, 4, 5, 7 și „Reparațiile necesare înainte de înghețare”). Contractul: ${D}/contract.md (R1-R13, Etapa 0). Convenția de rădăcină: ${D}/oracole/CONVENTIE_RADACINA.md.
Worktree: ${WT} (ramura fidelitate-aplicatii). NU faci commit, NU faci push. NU atingi C:/00/Projects/LearningHub (doar citire).
Reguli ferme:
- Scrii DOAR fișierele pe care le deții (lista din sarcina ta); restul = doar citire. Dacă ai nevoie de o schimbare într-un fișier al altcuiva, o scrii în «cereri_pentru_altii» din răspuns, precis (fișier, ce, de ce).
- Contractul ieșirii oracolelor rămâne: ULTIMA linie = un singur întreg, ultimele 3 rânduri nevide, cod 0 (zero probleme) / 1 (probleme). Oracolele respectă LH_RADACINA / LH_IESIRE (CONVENTIE_RADACINA.md) și nu scriu nimic în LH_RADACINA.
- Probele în browser: server local pe port liber ("127.0.0.1", 0); ctx.route care ABANDONEAZĂ tot ce nu e 127.0.0.1/localhost; în plus (reparația 12) navigator.sendBeacon înlocuit cu o funcție care întoarce false (add_init_script) și cererea către assets/js/prezenta.js abandonată, ca în ${D}/oracole/sarcini_lib/joaca.py (rândurile cu sendBeacon și prezenta). NU rulezi probe care scriu pe serverul viu (proba_prezenta, proba_diploma, teste-vasile, teste.api, lh-api, diplome.py).
- Nu pornești Office, Explorer sau alte aplicații reale (nu e nevoie la reparațiile astea). Nimic pe ecranul profesorului.
- Date personale 0: nu scrii în fișiere numele contului Windows, căi absolute din %TEMP% / C:/Users/<cont> sau nume de persoane. Când verifici, ia numele contului din os.environ["USERNAME"] în cod, nu-l scrie de mână.
- Căi absolute în fiecare comandă; fără „cd”. Shell-ul e Git Bash pe Windows. Ieșirile lungi le duci în fișier în %TEMP% și citești doar coada.
- Nu slăbești un oracol ca să dea un număr mai mic: reparațiile de aici fac oracolele MAI greu de păcălit. Numerele pe simulatoarele vechi pot crește — e corect; linia de bază se ia după înghețare.
- La final întorci DOAR obiectul cerut de schemă; în «probleme_deschise» pui onest ce n-ai putut face și de ce.`

const RAPORT = {
  type: 'object',
  properties: {
    fisiere_scrise: { type: 'array', items: { type: 'string' } },
    comenzi: { type: 'array', items: { type: 'object', properties: { cmd: { type: 'string' }, ultima_linie: { type: 'string' }, cod_iesire: { type: 'integer' } }, required: ['cmd', 'ultima_linie'] } },
    reparatii: { type: 'array', items: { type: 'object', properties: { nr: { type: 'string' }, facut: { type: 'boolean' }, dovada: { type: 'string' } }, required: ['nr', 'facut', 'dovada'] } },
    cereri_pentru_altii: { type: 'array', items: { type: 'string' } },
    rezumat: { type: 'string' },
    probleme_deschise: { type: 'array', items: { type: 'string' } },
  },
  required: ['fisiere_scrise', 'comenzi', 'reparatii', 'cereri_pentru_altii', 'rezumat', 'probleme_deschise'],
}

const VERDICT = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['GATA_DE_INGHETAT', 'REPARATII_NECESARE'] },
    puncte: { type: 'array', items: { type: 'object', properties: { nr: { type: 'string' }, da: { type: 'boolean' }, dovada: { type: 'string' } }, required: ['nr', 'da', 'dovada'] } },
    banca: { type: 'string' },
    numere_oracole: { type: 'string' },
    reparatii_ramase: { type: 'array', items: { type: 'string' } },
    rezumat: { type: 'string' },
  },
  required: ['verdict', 'puncte', 'banca', 'numere_oracole', 'reparatii_ramase', 'rezumat'],
}

phase('Reparatii')

const pA = `${COMUN}

SARCINA TA: ORACOLELE DE STRUCTURĂ (O1, O2, O3, O7, O8) și randarea comună.
Deții: ${D}/oracole/structura_lib.py, ${D}/oracole/arbore_randat.js, ${D}/oracole/oracol_central.py, ${D}/oracole/oracol_identic.py, ${D}/oracole/oracol_ui.py, ${D}/oracole/oracol_comenzi_moarte.py, ${D}/oracole/oracol_text_ui.py, ${D}/oracole/CONVENTIE_ARBORE.md, ${D}/oracole/CONVENTIE_RADACINA.md, ${D}/oracole/_jucarie/** (biblioteca-jucărie), ${D}/api_biblioteca.md.
Reparațiile tale (numerotarea din verificare_etapa0.md):
3 (partea de cod). structura_lib.dir_cache() respectă LH_IESIRI; când LH_RADACINA e alt folder decât worktree-ul și LH_IESIRI lipsește, cache-ul stă în %TEMP%, niciodată în dosarul lucrării. Ce se scrie în cache/ieșiri: căi RELATIVE la rădăcina sitului, nu absolute. Gata = rulezi O1 cu LH_RADACINA pe o copie din %TEMP% (copie doar a ce trebuie), apoi un grep în ${D} (fără __pycache__) după numele contului (luat din USERNAME în cod) dă 0 fișiere NOI.
   Plus: o variabilă LH_FARA_CACHE=1 care forțează randarea de la zero (o folosește mutanti.py la a doua linie de bază — reparația 11; îi spui agentului de infrastructură numele exact în rezumat, eu i-am spus deja că se numește LH_FARA_CACHE).
7. O8: (a) o comandă gri/dezactivată în simulator, dar activă în referință (în referinte/uia_<app>.json nu e marcată indisponibilă), se numără MOARTĂ, nu „gri, nejudecată”; (b) o comandă CITATĂ de lecție (inventar.json / suprafete.json: predat / predat_in) care, apăsată, produce doar un mesaj de tip „aici nu e simulată” se numără MOARTĂ (R12, prima frază). Pentru (b): convenția nouă în api_biblioteca.md — biblioteca marchează orice astfel de mesaj cu atributul data-lh-nesimulat; oracolul numără atributul ȘI tiparele de text găsite în simulatoarele vechi (caută în ${WT}/lectii/_sim/*.js și jocuri/_motor/*.js mesajele de felul ăsta și pune lista în cod, cu fișier:rând în comentariu).
8. O1: rădăcina [data-lh-aplicatie] se acceptă DOAR dacă e înregistrată de bibliotecă: API nou în api_biblioteca.md (ex. LH.aplicatii.radacini() întoarce elementele create de bibliotecă), implementat în biblioteca-jucărie; un element marcat de lecție, neînregistrat, = interfață desenată în pagină (problemă).
9. O2/O3: când elementul are text vizibil, se compară textul VIZIBIL; dacă data-lh-eticheta există și diferă de textul vizibil, asta e o diferență în sine (exact riscul comutatorului RO: atribut „Insert”, ecran „Inserare”). Butoanele doar cu iconiță: aria-label / data-lh-eticheta, ca acum. Actualizezi CONVENTIE_ARBORE.md.
12 (partea ta). Proba de browser din structura_lib.py: sendBeacon oprit + prezenta.js abandonat.
f (recomandat, dacă rămâne timp): O3 — o comandă deja greșită care devine „lipsă” să nu se anuleze (−1 +1); de pildă cheia diferenței include felul ei, iar „lipsă” cântărește cel puțin cât orice altă diferență pe aceeași comandă.
NU atingi mutanti/banca.json (mutanții noi pentru 7, 8, 9 îi scrie agentul următor) — dar descrie-i în «rezumat» câte un mutant concret pentru fiecare dintre 7a, 7b, 8, 9: ce fișier se modifică (din biblioteca-jucărie ${D}/oracole/_jucarie/ sau un simulator vechi din ${WT}/lectii/_sim/), ce text se înlocuiește cu ce, și ce număr trebuie să crească.
La final rulezi O1, O2, O3, O7, O8 pe worktree (simulatoarele vechi) cu LH_FARA_CACHE=1 și dai numerele înainte (din verificare_etapa0.md: O1 61, O2 13330, O3 3699, O7 355, O8 2) → după, cu motivul fiecărei schimbări.`

const pB = `${COMUN}

SARCINA TA: ORACOLELE DE COMPORTAMENT, EVENIMENTE ȘI ASISTARE (O4, O5, O9).
Deții: ${D}/oracole/oracol_comportament.py, ${D}/oracole/sim_runner.js, ${D}/oracole/oracol_evenimente.py, ${D}/oracole/oracol_asistare.py, ${D}/referinte/scenarii_real/excel-separator-virgula.json, ${D}/referinte/scenarii_real/excel-autocompletare-tab.json.
NU deții biblioteca-jucărie (${D}/oracole/_jucarie/) și nici api_biblioteca.md: dacă reparația ta cere o convenție nouă în bibliotecă (un atribut, o funcție), o scrii în «cereri_pentru_altii», precis, și scrii oracolul presupunând-o (agentul următor o adaugă în jucărie și în api_biblioteca.md, apoi rulează mutanții).
Reparațiile tale (numerotarea din verificare_etapa0.md):
2. O9 trebuie să prindă O9-03 (indiciul rămâne pe primul pas) și O9-05 (derularea se numără ca greșeală): adaugi un caz cu asistent de 2 pași (după pasul 1 făcut, indiciul vine pe ținta pasului 2) și un caz cu gesturi care NU sunt greșeli (rotița mouse-ului / derulare, săgeți ×3 → fără indiciu). Cazul F (oracol_asistare.py, în jur de rândurile 294-303) nu mai e o căutare de text: pentru fiecare pagină care încarcă aplicatii/aplicatii.js, o joci în Playwright (2 greșeli → indiciul pe elementul cerut, conform R7); pagina care nu încarcă biblioteca se numără ca acum (azi niciuna nu e mutată). Gata = «python ${D}/mutanti/mutanti.py --id O9-03 --fara-zgomot» și la fel pentru O9-05 dau PRINS (rulezi câte unul; bancul întreg are un defect pe care îl repară altcineva acum, nu-l rula întreg).
5. Cele două rezultate de scenariu excel-separator-virgula.json și excel-autocompletare-tab.json primesc mod_probat: false, cu o notă „îndoielnic: Excel a rămas în editare pe desktopul ascuns; așteaptă proba lui Vasile (de_verificat.md)”. Gata = O4 le numără la „fără rezultat real probat” (12, nu 10).
10. O4: pentru cheile text / celule, starea raportată de L.stare() (sim_runner.js, în jur de rândul 181) se compară ȘI cu ce e pe ecran (textul zonei documentului / textul celulelor randate); diferența stare≠ecran = problemă. Pe simulatoarele vechi, citirea ecranului se face din DOM-ul lor (sim_runner are deja adaptoare); pentru bibliotecă, o convenție de atribut (ex. data-lh-zona="document", data-lh-celula="A1") — cerută în «cereri_pentru_altii».
12 (partea ta). Probele de browser din O4, O5, O9: sendBeacon oprit + prezenta.js abandonat.
La final rulezi O4, O5, O9 pe worktree și dai numerele înainte (O4 150, O5 201, O9 36) → după, cu motivul fiecărei schimbări; plus mutanții O9-01…O9-06 rulați unul câte unul (PRINS/NEPRINS).`

const pC1 = `${COMUN}

SARCINA TA: INFRASTRUCTURA DE MĂSURARE ȘI REFERINȚA EXCEL.
Deții: ${D}/mutanti/mutanti.py, ${D}/mutanti/validare.json, ${D}/oracole/porti.py, ${D}/oracole/porti_extra/**, ${D}/oracole/masoara.py, ${D}/opreste.py, ${D}/opreste_sim.py, ${D}/pregateste_runda.py, ${D}/referinte/uia_excel.json, ${D}/referinte/dump_uia_office.py, ${D}/referinte/README_referinte.md, ${WT}/.gitignore (doar ADAUGI rânduri, la final, cu un comentariu), și fișierele din ${D}/oracole/_iesiri/ (le poți șterge).
NU deții banca.json (mutanții noi îi scrie agentul următor) și nici oracolele O1-O9.
Reparațiile tale (numerotarea din verificare_etapa0.md):
1. mutanti.py, pregătirea „jucarie” (în jur de rândurile 136-161): pregătirea unui grup se pune o singură dată și se ia înapoi o singură dată, la finalul grupului; fiecare mutant pornește de la biblioteca-jucărie INTACTĂ. Gata = rulezi grupul O5 întreg prin mutanti.py (doar oracolul O5, nu tot bancul — vezi opțiunile scriptului; adaugă o opțiune --oracol O5 dacă nu există) și niciun mutant nu mai iese „fișierul aplicatii/aplicatii.js nu există în copie”. Atenție: oracolele O5/O9 sunt reparate în paralel de alt agent; ce contează la tine e că mutanții se APLICĂ pe o jucărie intactă, nu dacă sunt prinși.
11. A doua linie de bază (proba de zgomot, în jur de rândurile 213-217) se face cu randare forțată: pune LH_FARA_CACHE=1 în mediul ei (agentul oracolelor de structură implementează variabila în structura_lib.py, chiar acum).
3 (partea ta). .gitignore: ignoră ${D}/oracole/_iesiri/, ${D}/runde/*/iesiri/ și orice __pycache__ din _campaign (dacă nu sunt deja ignorate — verifici cu git check-ignore). Ștergi din ${D}/oracole/_iesiri/ fișierele care conțin numele contului Windows (căutat din USERNAME în cod). Gata = git -C ${WT} status --short nu mai arată nimic din _iesiri, iar căutarea numelui contului în ${D} (fără __pycache__) dă 0 fișiere.
4. uia_excel.json: fila Developer scoasă din rândul filelor (file_panglicii și orice listă de TabItem, în jur de rândul 747), cu o notă în excluse_personal („scoasă: profilul curat al contractului R4 nu are Developer”); dump_uia_office.py verifica (în jur de rândul 1568) caută și TabItem-ul din rândul filelor, nu doar suprafața panglica.TabDeveloper. NU repornești Office și nu refaci dump-ul. Gata = «python ${D}/referinte/dump_uia_office.py verifica» dă 0 și nicio apariție „Developer” în rândul filelor din uia_excel.json.
6. Porțile se numără pe PROBLEME, nu pe porți picate: porti.py păstrează pentru fiecare poartă numărul ei (n), scrie {poarta: n} în porti.json, iar ultima linie rămâne un întreg (suma, sau numărul porților picate — alege și scrie de ce, dar opreste.py și masoara.py trebuie să compare n cu n pe fiecare poartă); opreste.py (în jur de rândurile 75-80) declară regres când oricare n crește; opreste_sim.py actualizat și trecut. Gata = un caz de simulare în opreste_sim.py cu cum_fac 41 → 80 dă regres.
12 (partea ta). porti_extra/j_comun.py (și orice altă probă de browser din porti_extra): sendBeacon oprit + prezenta.js abandonat.
NU rulezi bancul întreg de mutanți și nici porti.py întreg (le rulează agentul următor, după ce se termină toate reparațiile); rulezi doar ce dovedește reparația ta.`

const [rA, rB, rC1] = await parallel([
  () => agent(pA, { label: 'reparatii:structura (O1,O2,O3,O7,O8)', phase: 'Reparatii', schema: RAPORT }),
  () => agent(pB, { label: 'reparatii:comportament (O4,O5,O9)', phase: 'Reparatii', schema: RAPORT }),
  () => agent(pC1, { label: 'reparatii:infrastructura', phase: 'Reparatii', schema: RAPORT }),
])

phase('Mutanti')

const pC2 = `${COMUN}

SARCINA TA: MUTANȚII NOI, BANCUL RULAT ÎNTREG, PORȚILE. Trei agenți tocmai au reparat oracolele și infrastructura; rapoartele lor sunt mai jos.
Deții ACUM: ${D}/mutanti/banca.json, ${D}/mutanti/rezultat.json, ${D}/oracole/_jucarie/**, ${D}/api_biblioteca.md. Poți face o reparație MICĂ într-un oracol sau în mutanti.py DOAR dacă bancul/oracolul se prăbușește (cod ≠ 0/1, ultima linie nu e întreg) — o scrii în «reparatii» cu fișier:rând. Nu slăbești niciun oracol.
Pași:
1. Aplici în api_biblioteca.md și în biblioteca-jucărie cererile din «cereri_pentru_altii» ale celorlalți (mai ales convențiile de ecran pentru O4: zona documentului / celulele randate; și ce mai cer), ca oracolele să aibă pe ce măsura.
2. Reparația 14: înlocuiești mutanții O2-05 (scoate aria-label, invizibil pentru elev) și O4-07 (ramură moartă pentru gesturi) cu greșeli VIZIBILE pentru elev, realiste.
3. Mutanți noi (plantați în simulatoarele vechi din ${WT}/lectii/_sim/ sau, unde cele vechi n-au ce trebuie, în biblioteca-jucărie, ca la O5/O9): O8 ×2 (7a comandă gri deși activă în referință; 7b comandă citată de lecție care dă doar „aici nu e simulată”), O1 ×1 (rădăcină data-lh-aplicatie pusă de lecție, neînregistrată), O2 sau O3 ×1 (atribut „Insert”, ecran „Inserare”), O4 ×1 (starea raportată corectă, ecranul neredesenat). Folosește descrierile din raportul agentului de structură. Rulezi «python ${D}/mutanti/mutanti.py --valideaza».
4. Bancul ÎNTREG, o singură rulare: «python ${D}/mutanti/mutanti.py --paralel 3» (durează ~25-40 min; ieșirea în fișier în %TEMP%, apoi coada). Păstrezi ${D}/mutanti/rezultat.json. Gata = fiecare O1…O9 are ≥ 5 mutanți PRINȘI în ACEASTĂ rulare, iar toți mutanții noi sunt prinși. Dacă un mutant nou scapă: înțelegi de ce (oracol orb → spui exact; mutant prost → îl refaci) și rulezi din nou doar grupul lui, apoi tot bancul încă o dată la final.
5. «python ${D}/oracole/porti.py» (durează ~25-30 min) → numărul pe fiecare poartă; date_personale trebuie să fie 0 după rularea bancului. cum_fac era 41 înainte de lucrarea asta (nu e din lucrarea noastră; doar îl raportezi).
6. Rulezi fiecare oracol O1…O9 o dată pe worktree și dai numerele (ultima linie + cod).
RAPOARTELE CELORLALȚI:
--- structura ---
${JSON.stringify(rA)}
--- comportament ---
${JSON.stringify(rB)}
--- infrastructura ---
${JSON.stringify(rC1)}`

const rC2 = await agent(pC2, { label: 'mutanti:banca intreaga + porti', phase: 'Mutanti', schema: RAPORT })

phase('Reverificare')

const pV = (runda, extra) => `EȘTI VERIFICATORUL INDEPENDENT AL REPARAȚIILOR ETAPEI 0 (runda de verificare ${runda}). Nu ai scris nimic din ce verifici; nu repari nimic. Poți scrie DOAR ${D}/reverificare_etapa0${runda > 1 ? '_' + runda : ''}.md și fișiere temporare în %TEMP% (nu în ${D}: LH_IESIRE / LH_IESIRI în %TEMP%).
${COMUN}

Verificatorul anterior a cerut reparațiile 1-14 din ${D}/verificare_etapa0.md (13 și 15 sunt amânate explicit la o rundă «acoperire» — nu le ceri). Pentru FIECARE dintre 1-12 și 14: DA/NU + dovada pe care o produci TU acum (comandă rulată + ultima linie, sau fișier:rând citit), nu ce spun agenții.
Obligatoriu, rulate de tine:
- bancul de mutanți ÎNTREG, o singură rulare, cu ieșirile tale în %TEMP% («python ${D}/mutanti/mutanti.py --paralel 3», cu LH_IESIRE/LH_IESIRI în %TEMP% dacă scriptul le respectă): fiecare O1…O9 ≥ 5 prinși, mutanții noi (O8 7a/7b, O1 rădăcină neînregistrată, O2/O3 „Insert”/„Inserare”, O4 ecran neredesenat, O9-03, O9-05) prinși; mutanți de paie = semnalezi;
- după bancul tău: căutarea numelui contului Windows (din USERNAME, în cod) în ${D} fără __pycache__ și fără fișierele ignorate de git = 0 fișiere; «git -C ${WT} status --short» nu arată nimic din _iesiri;
- fiecare oracol O1…O9 o dată (contractul ieșirii: ultima linie întreg, cod 0/1) și «python ${D}/referinte/dump_uia_office.py verifica»; «python ${D}/opreste_sim.py»;
- porti.py: poți refolosi rezultatul agentului numai dacă îl recitești din porti.json și verifici în cod că date_personale se calculează pe dosarul real; altfel îl rulezi.
Caută și găuri NOI introduse de reparații (un oracol care acum crede pagina pe cuvânt, o reparație care a slăbit ceva). Scrii raportul (numerele întâi, verdictul la final): GATA_DE_INGHETAT doar dacă 1-12 și 14 sunt DA și bancul are ≥ 5 pe fiecare oracol într-o singură rulare.
${extra}`

let v = await agent(pV(1, `RAPORTUL AGENTULUI CARE A RULAT BANCUL (îl verifici, nu-l crezi):\n${JSON.stringify(rC2)}`), { label: 'reverificare:1', phase: 'Reverificare', schema: VERDICT })

let rFix = null, v2 = null
if (v && v.verdict === 'REPARATII_NECESARE') {
  log('Reverificarea 1: REPARATII_NECESARE — o singura runda de reparatii, apoi reverificarea 2')
  const pFix = `${COMUN}

SARCINA TA: ULTIMA RUNDĂ DE REPARAȚII A ETAPEI 0. Deții TOT dosarul ${D} (oracole, mutanți, jucărie, api_biblioteca.md, referințe, infrastructură), în afară de rapoartele de verificare (verificare_etapa0.md, reverificare_etapa0.md — doar citire). Ești singurul care scrie acum.
Verificatorul a găsit asta (raportul lui complet: ${D}/reverificare_etapa0.md):
${JSON.stringify(v)}
Repari FIECARE punct rămas, cu dovada ta (comandă + ultima linie). Dacă un punct cere ceva ce nu se poate face fără profesor sau fără aplicația reală, îl scrii în «probleme_deschise» cu motivul — nu-l ocolești slăbind oracolul. La final: bancul întreg o dată («python ${D}/mutanti/mutanti.py --paralel 3», rezultat.json păstrat) și căutarea numelui contului (din USERNAME) în ${D} = 0 fișiere neignorate.`
  rFix = await agent(pFix, { label: 'reparatii:runda 2', phase: 'Reverificare', schema: RAPORT })
  v2 = await agent(pV(2, `Verificarea 1 a cerut reparații (le găsești în ${D}/reverificare_etapa0.md). Un agent le-a făcut; raportul lui (îl verifici, nu-l crezi):\n${JSON.stringify(rFix)}`), { label: 'reverificare:2', phase: 'Reverificare', schema: VERDICT })
}

return { rA, rB, rC1, rC2, v, rFix, v2 }
