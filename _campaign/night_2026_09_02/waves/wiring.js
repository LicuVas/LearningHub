export const meta = {
  name: 'lh-night-wiring',
  description: 'Leaga materia noua de restul sitului: pagina de sectiune Maistri+Postliceal, paginile de an, actualizarea paginilor de clasa de la liceu tehnologic si intrarile din hub.',
  phases: [
    { title: 'Pagini', detail: 'Sectiunea profesionala si paginile de an' },
    { title: 'Liceu', detail: 'Paginile de clasa X/XI/XII primesc modulele noi' },
    { title: 'Hub', detail: 'Intrari in hub si in pagina pe clase' },
    { title: 'Control', detail: 'Verificare de legaturi rupte' },
  ],
}

const REPO = 'C:/00/Projects/LearningHub'
const TPL_PROFIL = `${REPO}/content/liceu/tehnologic/index.html`
const TPL_CLASA = `${REPO}/content/liceu/tehnologic/cls9/index.html`
const OK = { type:'object', required:['done'], properties:{ done:{type:'boolean'}, summary:{type:'string'},
  honestNotes:{type:'array', items:{type:'string'}} } }

const REGULI = `
REGULI COMUNE:
- Scrie FARA diacritice (a, i, s, t simple) - tot situl e asa.
- Pastreaza tema vizuala a sitului: foloseste aceleasi clase si aceeasi structura ca sablonul indicat. Fara <style> inline nou daca sablonul nu are.
- NU modifica niciun fisier din assets/.
- Verifica la final ca fiecare href pe care il scrii duce la un fisier care EXISTA pe disc (foloseste Bash: ls / test -f). Daca un fisier lipseste, spune-o in honestNotes, nu inventa legatura.
`

// ── Faza 1: sectiunea noua (maistri + postliceal) ─────────────────────
phase('Pagini')
const ANI = [
  { path:'content/profesional/maistri/an1/index.html', titlu:'Scoala de Maistri — Anul I',
    sub:'Maistru electromecanic auto · modulul „Utilizarea tehnicii de calcul" (54 ore, semestrul I)',
    icon:'\u{1F527}',
    module:[
      ['c1-aplicatii-software','C1. Aplicatii Software Uzuale','6 lectii','Foaia de calcul in atelier: structura, formatare, formule, diagrame, obiecte'],
      ['c2-baze-de-date','C2. Baze de Date cu Aplicatii Specifice','6 lectii','Evidenta pieselor si a interventiilor: de la structura la raportul lunar'],
      ['c3-internet','C3. Comunicarea pe Internet','4 lectii','Documentatie tehnica, surse de incredere, transmiterea informatiei'],
    ], back:'../../index.html' },
  { path:'content/profesional/sanitar/an1-medicina/index.html', titlu:'Postliceal Sanitar — Anul I',
    sub:'Asistent medical generalist · modulul „Utilizarea calculatorului si tehnologia comunicatiilor" (56 ore)',
    icon:'\u{1FA7A}',
    module:[
      ['c1-sistem-de-operare','C1. Sistemul de Operare','3 lectii','Interfata, organizarea fisierelor, securitatea datelor la locul de munca'],
      ['c2-word-excel','C2. Documente si Reprezentari Grafice','5 lectii','Documente medicale, evidente, formule si grafice'],
      ['c3-baze-de-date','C3. Administrarea unei Baze de Date','3 lectii','Evidenta pacientilor si a materialelor sanitare'],
      ['c4-internet-si-date','C4. Internet si Protectia Datelor','3 lectii','Surse medicale de incredere, comunicare, confidentialitatea pacientului'],
      ['c5-prezentare','C5. Structurarea si Prezentarea Informatiei','3 lectii','De la surse variate la o prezentare de caz in 5 minute'],
    ], back:'../../index.html' },
  { path:'content/profesional/sanitar/an2-farmacie/index.html', titlu:'Postliceal Sanitar — Anul II, Farmacie',
    sub:'Asistent medical de farmacie · Modulul VII — Tehnologia informatiei si comunicarii (36 ore)',
    icon:'\u{1F48A}',
    module:[
      ['c1-sistem-de-operare','C1. Sistemul de Operare','2 lectii','Statia de lucru din farmacie si organizarea fisierelor'],
      ['c2-word-excel','C2. Documente si Reprezentari Grafice','4 lectii','Documente de farmacie, gestiune, adaos comercial, grafice'],
      ['c3-baze-de-date','C3. Administrarea unei Baze de Date','3 lectii','Nomenclator, receptii, stocuri si termene de valabilitate'],
      ['c4-internet','C4. Comunicarea pe Internet','2 lectii','Surse oficiale, comenzi catre depozit, retrageri de lot'],
      ['c5-prezentare','C5. Structurarea si Prezentarea Informatiei','2 lectii','Sinteza din surse oficiale si produsul final'],
    ], back:'../../index.html' },
]

const jobs1 = ANI.map(A => () => agent(
`Creeaza pagina de an: ${REPO}/${A.path}
SABLON (oglindeste structura, clasele, scripturile si adancimea cailor catre assets, ajustata la nivelul acestei pagini): ${TPL_CLASA}
Titlu: "${A.icon} ${A.titlu}". Subtitlu: "${A.sub}".
Publicul e format din ADULTI (scoala de maistri / scoala postliceala) - tonul paginii sa fie de curs profesional, nu de manual de liceu.
Grila de module, in aceasta ordine, fiecare cu href catre index-ul modulului:
${A.module.map(([d,t,n,desc],i)=>`  M${i+1} href="${d}/index.html" — "${t}" (${n}) — ${desc}`).join('\n')}
Actualizeaza si zona de progres/statistici: ${A.module.length} module, ${A.module.reduce((s,m)=>s+parseInt(m[2]),0)} lectii.
Butonul inapoi -> href="${A.back}".
${REGULI}
Write. Raporteaza done.`,
  { label:`an:${A.path.split('/').slice(-2)[0]}`, phase:'Pagini', model:'sonnet', schema:OK }))

jobs1.push(() => agent(
`Creeaza pagina de sectiune: ${REPO}/content/profesional/index.html
SABLON (oglindeste structura si stilul, adancimea catre assets ajustata): ${TPL_PROFIL}
Titlu: "\u{1F393} Maistri si Postliceal". Subtitlu: "Module de tehnica de calcul si T.I.C. pentru scoala de maistri si scoala postliceala — pentru adulti care invata ca sa foloseasca imediat."
Explica scurt (2-3 fraze, limbaj simplu) ca aici nu se preda „T.I.C." ca la liceu, ci un MODUL din Standardul de Pregatire Profesionala: se invata pe competente, iar evaluarea se face pe criteriile din standard.
Carduri catre:
  1. href="maistri/an1/index.html" — "Scoala de Maistri, Anul I" — Maistru electromecanic auto · Utilizarea tehnicii de calcul · 3 competente, 16 lectii
  2. href="sanitar/an1-medicina/index.html" — "Postliceal Sanitar, Anul I" — Asistent medical generalist · Utilizarea calculatorului si tehnologia comunicatiilor · 5 competente, 17 lectii
  3. href="sanitar/an2-farmacie/index.html" — "Postliceal Sanitar, Anul II" — Asistent medical de farmacie · Modulul VII T.I.C. · 5 competente, 13 lectii
Butonul inapoi -> href="../../hub/index.html".
${REGULI}
Write. Raporteaza done.`,
  { label:'sectiune:profesional', phase:'Pagini', model:'sonnet', schema:OK }))

await parallel(jobs1)

// ── Faza 2: paginile de clasa de la liceu tehnologic ──────────────────
phase('Liceu')
const CLASE = [
  { cls:'cls10', noi:[
      ['m3-calcul-tabelar-avansat','Calcul Tabelar — Formule, Grafice, Tiparire','4 lectii','CS 1.3-1.7: functii, referinte, tiparire, diagrame, import de obiecte'],
      ['m4-baze-de-date','Baze de Date (Access)','5 lectii','CS 2.1-2.6: tabele, chei, formulare, interogari, rapoarte'],
      ['m5-prezentari-digitale','Prezentari Digitale (PowerPoint)','4 lectii','CS 3.1-3.11: creare, obiecte, animatie, tiparire, aplicatie'],
    ], nota:'Programa de clasa a X-a (OMECI 5099/2009) are trei competente generale: calcul tabelar, baze de date si prezentari digitale. Modulele M3-M5 le acopera integral.' },
  { cls:'cls11', noi:[
      ['m3-date-si-informatii','Date, Informatii si Fluxul Informational','3 lectii','Competenta 1: date vs informatii, flux informational, sistem informatic'],
      ['m4-surse-si-cautare','Surse de Informatie si Cautarea pe Internet','3 lectii','Competenta 1: surse, tehnici de cautare, evaluarea credibilitatii'],
      ['m5-organizarea-datelor','Organizarea Datelor — Tipuri si Structuri','3 lectii','Competenta 2: tipuri de date si structuri de organizare'],
      ['m6-prelucrarea-datelor','Prelucrarea Datelor — Operatori','3 lectii','Competenta 2: operatori aritmetici, relationali si logici'],
      ['m7-functii','Functii Predefinite si Functii Utilizator','4 lectii','Competenta 2: aritmetice, logice, de cautare, pe siruri, definite de utilizator'],
      ['m8-instrumente-si-studii-de-caz','Instrumente de Lucru si Studii de Caz','3 lectii','Competenta 2: schite, sabloane, rapoarte, documente reale de firma'],
    ], nota:'La clasele a XI-a si a XII-a programa e una singura, pe doi ani (OM 5099/2009). In clasa a XI-a se parcurg competentele individuale 1 si 2; modulele M3-M8 le acopera.' },
  { cls:'cls12', noi:[
      ['m2-web-creare-site','Crearea Documentelor Web','5 lectii','Competenta 3: instrumente, structura sitului, continut, navigare, publicare'],
      ['m3-management-proiect','Managementul Informatizat al Proiectelor','5 lectii','Competenta 4: proiect, echipa, plan, traiectorie critica, monitorizare'],
      ['m4-instrumente-proiect','Instrumente Software si Proiect Integrator','2 lectii','Competenta 4: instrumente de tip Gantt si produsul final evaluat'],
    ], nota:'In clasa a XII-a se parcurg competentele individuale 3 si 4 din aceeasi programa pe doi ani: crearea documentelor web si managementul informatizat al proiectelor. Modulul M1 ramane pentru pregatirea probei de competente digitale de la bacalaureat.' },
]
await parallel(CLASE.map(C => () => agent(
`Actualizeaza pagina de clasa: ${REPO}/content/liceu/tehnologic/${C.cls}/index.html
PASTREAZA tot ce e deja acolo (modulele existente raman, in ordinea lor) si ADAUGA in grila de module, dupa ele, aceste module noi:
${C.noi.map(([d,t,n,desc])=>`  href="${d}/index.html" — "${t}" (${n}) — ${desc}`).join('\n')}
Adauga si o nota scurta, in limbaj simplu, in partea de sus a paginii (in stilul blocurilor de informatie deja folosite pe sit):
"${C.nota}"
Actualizeaza numerele din zona de progres/statistici ca sa includa modulele si lectiile noi.
${REGULI}
Edit sau Write. Raporteaza done.`,
  { label:`clasa:${C.cls}`, phase:'Liceu', model:'sonnet', schema:OK })))

// ── Faza 3: intrarile din hub ─────────────────────────────────────────
phase('Hub')
await parallel([
  () => agent(
`Adauga in ${REPO}/hub/index.html o intrare noua catre sectiunea profesionala, in acelasi stil vizual cu cardurile existente.
Card: href="../content/profesional/index.html", titlu "Maistri si Postliceal", descriere "Tehnica de calcul si T.I.C. pentru scoala de maistri si scoala postliceala - module pe competente, pentru adulti."
Aseaza-l langa cardul catre liceu ("../content/liceu/index.html"), ca sa se vada ca sunt trei trepte: gimnaziu, liceu, profesional.
NU strica nimic din ce exista. ${REGULI}
Edit. Raporteaza done.`,
    { label:'hub:index', phase:'Hub', model:'sonnet', schema:OK }),
  () => agent(
`Actualizeaza ${REPO}/hub/by-grade/index.html: pe langa clasele 5-8 si liceu, adauga intrari catre
  href="../../content/profesional/maistri/an1/index.html" — "Scoala de Maistri, Anul I"
  href="../../content/profesional/sanitar/an1-medicina/index.html" — "Postliceal Sanitar, Anul I"
  href="../../content/profesional/sanitar/an2-farmacie/index.html" — "Postliceal Sanitar, Anul II (Farmacie)"
in acelasi stil cu intrarile existente. NU strica nimic din ce exista. ${REGULI}
Edit. Raporteaza done.`,
    { label:'hub:by-grade', phase:'Hub', model:'sonnet', schema:OK }),
])

// ── Faza 4: control de legaturi ───────────────────────────────────────
phase('Control')
const control = await agent(
`Control final de legaturi pe materia noua. Foloseste Bash, nu ghici.
1. Ruleaza: cd ${REPO}/_campaign/night_2026_09_02 && python status.py
2. Pentru fiecare fisier HTML din ${REPO}/content/profesional/ si din
   ${REPO}/content/liceu/tehnologic/cls10, cls11, cls12 (doar modulele m3+ la cls10/cls11 si m2+ la cls12),
   extrage href-urile relative si verifica pe disc ca fisierul tinta EXISTA.
3. Verifica la fel href-urile noi adaugate in ${REPO}/hub/index.html si ${REPO}/hub/by-grade/index.html.
Raporteaza EXACT ce legaturi sunt rupte (fisier sursa -> href inexistent). Nu repara nimic, doar raporteaza.
Daca nu e nimic rupt, spune "0 legaturi rupte".`,
  { label:'control:legaturi', phase:'Control', model:'opus',
    schema:{ type:'object', required:['brokenLinks','statusOutput'], properties:{
      brokenLinks:{type:'array', items:{type:'object', required:['from','href'], properties:{from:{type:'string'},href:{type:'string'}}}},
      statusOutput:{type:'string'} } } })

return { legaturiRupte: control && control.brokenLinks, stare: control && control.statusOutput }
