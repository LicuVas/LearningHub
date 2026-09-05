export const meta = {
  name: 'learninghub-reparatii-aprofundare',
  description: 'Repara cele 38 de casete "Vrei mai mult?" gasite gresite de corectorii valului t7b',
  phases: [
    { title: 'Repara', detail: '20 defecte distincte, cate un agent pe defect' },
    { title: 'Reverifica', detail: 'a disparut defectul, in TOATE profilurile-frate' },
  ],
}

// Un agent pe DEFECT, nu pe fisier: lectiile de pe profiluri diferite sunt copii,
// deci acelasi defect sta in 1-5 fisiere si corectura e aceeasi munca de gandit,
// facuta o data. Lista vine din valuri/extinde_t7.py, care cauta fiecare defect
// dupa o expresie distinctiva din CASETA (nu din lectie).
const DIO = 'C:/00/Projects/LearningHub/tools/depth_io.py'
const DIGEST = 'C:/00/Projects/LearningHub/tools/lesson_digest.py'

const DEFECTE = [
  {
    "idx": 0,
    "ce": "Caseta 'Vrei mai mult?' (paragraful 'Deschidere') afirma ca 'YouTube sau Netflix recomprima aproape tot ce urca utilizatorii in format H.265 sau AV1'. Pentru Netflix e adevarat (foloseste HEVC/H.265 pe unele dispozitive + AV1 pe altele), dar pentru YouTube e o afirmatie tehnica probabil gresita: YouTube evita deliberat H.265/HEVC la livrare tocmai din cauza taxelor de licentiere pe brevete si foloseste VP9 si AV1 (codecuri royalty-free proprii Google), nu H.265. Gruparea celor doua platforme sub aceeasi afirmatie da o cifra/fapt tehnic care nu se verifica pentru YouTube, prezentat ca atare fara nuantare.",
    "fisiere": [
      "content/liceu/artistic/cls11/m2-prezentari-multimedia/lectia2-audio-video.html",
      "content/liceu/militar/cls11/m1-prezentari-multimedia/lectia2-audio-video.html",
      "content/liceu/tehnologic/cls11/m1-prezentari-multimedia/lectia2-audio-video.html",
      "content/tic/cls7/extra-multimedia/lectia1-video-intro.html"
    ]
  },
  {
    "idx": 1,
    "ce": "In caseta 'Vrei mai mult?', sectiunea Deschidere afirma ca alinierea Justify pentru corp + Centru pentru titluri 'e standardul din Monitorul Oficial' — o pretentie institutionala specifica, data ca fapt, fara sursa verificabila. Restul casetei e corect (cele '7 reguli' citate exista real si sunt exact 7 in lista de verificare a lectiei; conceptul 'rivers of white' e corect descris). Recomandare: fie se citeaza o sursa reala pentru afirmatia despre Monitorul Oficial, fie se inmoaie formularea (ex. 'e conventia din documentele oficiale si tipar', fara sa numeasca explicit institutia).",
    "fisiere": [
      "content/liceu/militar/cls10/m1-procesare-text/lectia1-documente-formatare.html"
    ]
  },
  {
    "idx": 2,
    "ce": "Caseta \"Vrei mai mult?\" nu aduce continut nou fata de lectie, ci reformuleaza ce era deja explicat exhaustiv la Atomul 2. Provocarea cere sa schimbi pragul dintr-o formula IF cu referinta absoluta ($E$2) si sa observi ca toate randurile se recalculeaza — exact fenomenul deja descris literal in lectie la \"Regula practica: Daca o celula contine o valoare de referinta folosita de mai multe formule ... blocati-o cu $\". Sectiunea \"De ce?\" intreaba de ce Excel muta referintele relative dar nu si pe cele absolute — intrebare deja raspunsa integral in Atomul 2 (cu acelasi tip de exemplu: pret pe cartus in E1/E2, copiere in jos). \"Deschidere\" nu explica mecanismul (de ce/cum functioneaza intern referinta), ci doar afirma ca acelasi principiu se foloseste si in bugete de firma/state de plata — o generalizare de context, nu o adancire tehnica reala. Comparativ, celelalte 5 casete din modul (L1: intern NTFS/recuperare forensica, L2: Directiva UE 2016/2102, L4: originea metodei SIFT, L5: diferenta poza reala vs. upscale artificial, L6: problema fisierelor legate care se rup la mutare) chiar adauga un fapt/mecanism nou fata de lectie; L3 este singura care se limiteaza la a repeta acelasi exemplu si aceeasi regula deja predata.",
    "fisiere": [
      "content/liceu/militar/cls12/m1-competente-digitale/lectia3-calcul-tabelar.html",
      "content/liceu/pedagogic/cls12/m1-competente-digitale/lectia3-calcul-tabelar.html",
      "content/liceu/stiinte/cls12/m1-competente-digitale/lectia3-calcul-tabelar.html",
      "content/liceu/tehnologic/cls12/m1-competente-digitale/lectia3-calcul-tabelar.html",
      "content/liceu/umanist/cls12/m1-competente-digitale/lectia3-calcul-tabelar.html"
    ]
  },
  {
    "idx": 3,
    "ce": "Caseta 'Vrei mai mult?' (sectiunea 'Deschidere') afirma ca decuparea (crop) 'ramane distructiv chiar si in aceste programe', nominalizand explicit Adobe Photoshop si GIMP. E fals: ambele programe au optiune de crop NEdistructiv — Photoshop are checkbox-ul 'Delete Cropped Pixels' (debifat = pixelii din afara cadrului raman salvati in layer), iar GIMP 2.10 are aceeasi optiune 'Delete cropped pixels' in Tool Options. Afirmatia neaga o functie reala si documentata a exact acelor programe pe care le numeste.",
    "fisiere": [
      "content/liceu/artistic/cls10/m3-editare-imagine/lectia1-editor-straturi.html",
      "content/liceu/stiinte/cls10/m3-imagini-digitale/lectia2-editare-imagini.html"
    ]
  },
  {
    "idx": 6,
    "ce": "Caseta \"Vrei mai mult?\" nu e mai mult decat lectia, ci reface aproape identic exemplul deja predat la Atomul 5. Acolo lectia arata deja, cu un tabel de vanzari lunare (11,12,13,14) doua grafice - unul cu axa Y de la 0 si unul cu axa taiata de la un prag mai mare - si explica exact aceeasi concluzie (axa taiata exagereaza vizual diferentele mici). Caseta cere elevului sa reconstruiasca EXACT acelasi experiment, doar cu setul de date din Atomul 3 (12,13,11,14,18) si minim=10 in loc de minim mai mare - nu introduce nicio functie, optiune sau idee noua fata de ce a explicat deja lectia. Comparativ, casetele celorlalte 3 lectii chiar aduc ceva nou: lectia 1 introduce functia COUNTIF (nepredata in lectie), lectia 4 pune o intrebare noua (o poza pozitionata in afara Print Area se tipareste sau nu), lectia 2 pune o intrebare de sinteza (de ce NU e nevoie de $ aici, spre deosebire de exemplul TVA). Caseta lectiei 3 e singura care e doar o repetare a ce s-a predat deja, cu alte cifre.",
    "fisiere": [
      "content/liceu/tehnologic/cls10/m3-calcul-tabelar-avansat/lectia3-grafice-diagrame.html"
    ]
  },
  {
    "idx": 7,
    "ce": "Caseta \"Vrei mai mult?\", paragraful \"Mai departe\" nu aduce continut nou: reformuleaza fapte deja predate identic in Atomul 3 (\"Sisteme informatice specifice calificarii\"), unde lectia scrie deja explicit \"Tehnician in automatizari: sisteme SCADA, PLC-uri...\" si \"Tehnician in activitati economice: sisteme ERP (Enterprise Resource Planning)...\". Caseta doar re-imbraca aceleasi doua exemple (SCADA, ERP) intr-o poveste (scanner->stoc->contabilitate) fara sa introduca un fapt/exemplu care nu era deja in corpul lectiei. Paragrafele \"Provocare\" si \"De ce?\" din aceeasi caseta sunt insa genuin noi (exercitiu aplicat + intrebare de reflectie), deci defectul e limitat la treimea finala a casetei.",
    "fisiere": [
      "content/liceu/militar/cls11/m2-imagini-web/lectia1-imagine-digitala.html",
      "content/liceu/pedagogic/cls11/m2-imagini-web/lectia1-imagine-digitala.html",
      "content/liceu/stiinte/cls11/m2-imagini-web/lectia1-imagine-digitala.html",
      "content/liceu/tehnologic/cls11/m2-imagini-web/lectia1-imagine-digitala.html",
      "content/liceu/umanist/cls11/m2-imagini-web/lectia1-imagine-digitala.html"
    ]
  },
  {
    "idx": 8,
    "ce": "Paragraful \"Deschidere\" din caseta \"Vrei mai mult?\" (\"Multi dezvoltatori web incep un site de la un document Word primit de la un client...\") e o simpla reformulare a Atomului 4 din aceeasi lectie (exportul Word, cod umflat cu clase MsoNormal) - nu adauga nicio informatie noua. Spre comparatie, paragrafele \"Deschidere\" din celelalte 4 lectii adauga ceva real (unelte noi ca PageSpeed/Lighthouse, platforme de hosting Netlify/GitHub Pages, un anti-pattern nou - tabel folosit pt. layout, sau o consecinta practica la schimbarea domeniului). Restul casetei (Provocare + De ce?) e ok si adauga valoare.",
    "fisiere": [
      "content/liceu/tehnologic/cls12/m2-web-creare-site/lectia1-instrumente-web.html"
    ]
  },
  {
    "idx": 9,
    "ce": "Caseta \"Vrei mai mult?\" e complet in afara subiectului lectiei. Lectia preda identitate digitala, parole, phishing, malware si igiena digitala; caseta vorbeste in schimb despre spatiul neseparabil (Ctrl+Shift+Space) si alinierea Justified in procesare de text - un subiect de tehnoredactare/Office. Nu exista nicio legatura cu ce s-a predat. Arata ca a fost copiata dintr-o alta lectie/modul (Office/operare text) si lipita fara adaptare. Acesta e defectul principal (criteriul 1): nu e nici macar o reformulare a lectiei, e alt subiect.",
    "fisiere": [
      "content/liceu/tehnologic/cls9/m2-societate-digitala/lectia1-identitate-siguranta.html",
      "content/liceu/umanist/cls10/m1-procesare-text/lectia1-documente-formatare.html"
    ]
  },
  {
    "idx": 10,
    "ce": "Caseta leaga gresit doua fapte corecte izolat intr-o cauzalitate falsa: spune ca diferenta dintre durata drepturilor de autor (viata autorului + 70 ani) si durata unui brevet (20 ani) \"explica de ce\" Mickey Mouse (Steamboat Willie, 1928) a intrat in domeniul public abia in 2024. De fapt regula viata+70 se aplica operelor individuale; Steamboat Willie e o opera corporativa/\"pe angajare\", supusa in dreptul american unei reguli total diferite (95 de ani de la publicare, extinsa succesiv prin legi precum Sonny Bono Act 1998, nu prin regula viata+70 comparata cu brevetul). Cifrele (70 ani, 20 ani, 2024) sunt corecte separat, dar explicatia cauzala data elevului e inexacta/inselatoare.",
    "fisiere": [
      "content/liceu/militar/cls9/m2-societate-digitala/lectia2-drepturi-gdpr.html",
      "content/liceu/pedagogic/cls9/m2-societate-digitala/lectia2-drepturi-gdpr.html",
      "content/liceu/stiinte/cls9/m2-societate-digitala/lectia2-drepturi-gdpr.html",
      "content/liceu/tehnologic/cls9/m2-societate-digitala/lectia2-drepturi-gdpr.html",
      "content/liceu/umanist/cls9/m2-societate-digitala/lectia2-drepturi-gdpr.html"
    ]
  },
  {
    "idx": 11,
    "ce": "Caseta 'Vrei mai mult?', paragraful 'Deschidere' ('Bibliotecile digitale scaneaza manuscrise vechi la 600 DPI si le pastreaza ca TIFF... dar publica pe site copii JPG mult mai mici, comprimate...') NU e informatie noua — e a treia reluare a EXACT aceluiasi scenariu deja predat de doua ori in lectie: Atom 6 ('Un document de arhiva scanat la 600 DPI genereaza un TIFF de aprox. 80 MB. Pentru a-l publica pe site-ul scolii, il exporti ca JPG') si Exercitiul 3 ('Un coleg a scanat 10 pagini dintr-un manuscris medieval la 600 DPI si le-a salvat ca TIFF, aprox. 120 MB, vrea sa le publice pe un site'). Caseta de aprofundare ar trebui sa deschida o perspectiva noua, nu sa repovesteasca acelasi exemplu (scanare manuscris/arhiva 600 DPI -> TIFF -> JPG pe web) cu alti actori (biblioteci in loc de coleg/scoala). Restul casetei (Provocare = calcul DPI aplicat pe poza proprie; De gandit = de ce PNG lossless iese mai mare ca JPG pt fotografii) e in regula — foloseste fapte din lectie dar cere aplicare/explicatie noua, nu simpla repetare.",
    "fisiere": [
      "content/liceu/mat-info/cls10/m1-structuri-date/lectia5-matrice-operatii.html",
      "content/liceu/umanist/cls11/m2-imagini-web/lectia1-imagine-digitala.html"
    ]
  },
  {
    "idx": 12,
    "ce": "Caseta 'Vrei mai mult?' da ca exemplu formula =COUNTIF(Evidenta.C:C,\"Popescu Ion\") — referinta intre foi cu PUNCT (Evidenta.C:C) e sintaxa LibreOffice Calc, NU Excel. In Excel (si in Google Sheets) trimiterea catre alta foaie se scrie cu SEMNUL EXCLAMARII: Evidenta!C:C. Restul modulului (toate cele 6 lectii) foloseste consecvent denumiri si conventii Excel (Acasa, Ctrl+1, Insert, separator ; la formule etc.), iar aceasta e singura referinta intre foi din tot modulul — asa ca un elev care lucreaza in Excel (cazul cel mai probabil) va primi eroare #NAME?/#REF! daca aplica exact formula data.",
    "fisiere": [
      "content/profesional/maistri/an1/c1-aplicatii-software/lectia6-evaluare-c1.html"
    ]
  },
  {
    "idx": 14,
    "ce": "Caseta \"Vrei mai mult?\" (Provocare) nu e mai mult decat lectia, ci o repetare a exemplului deja rezolvat complet in Atom 5. Atomul 5 (\"Capcana axei taiate\") da deja, cu cifre, tot ce cere Provocarea: aceleasi date (ianuarie 92 / februarie 98 pansamente), aceeasi manevra (axa pornita de la 90) SI rezultatul exact (\"bara din februarie pare de 4 ori mai mare, desi diferenta reala e sub 7%\" — reluat identic si ca raspuns corect la Q5 din chestionar). Provocarea cere elevului sa reconstruiasca in Excel exact acest exemplu si sa \"masoare cu ochiul\" ceva ce lectia i-a spus deja cu precizie (raport 8:2, adica ~4x). Nu aduce cifre noi, context nou sau o dificultate suplimentara fata de ce a citit deja — e exercitiu de confirmare, nu de aprofundare.",
    "fisiere": [
      "content/profesional/sanitar/an1-medicina/c2-word-excel/lectia4-reprezentari-grafice.html"
    ]
  },
  {
    "idx": 15,
    "ce": "Aceeasi problema, si mai pronuntata: caseta \"Vrei mai mult?\" (Provocare) cere elevului sa reconstruiasca in Word EXACT exemplul deja descris integral in Atom 3 — aceleasi cifre (manusi 12, comprese 8, seringi 15→20, termometre 6) SI acelasi rezultat deja afirmat ca fapt in text (\"campul Total ramane la 41 pana apesi F9... in Excel, aceeasi modificare arata automat 46\"). Provocarea nu introduce date noi si nu cere nimic ce elevul nu stie deja din lectura atomului — singurul element cu adevarat nou e \"numara cate clickuri iti ia sa actualizezi\", o adaugire minora care nu schimba faptul ca exercitiul e, in esenta, o repunere in scena a exemplului deja rezolvat, nu o extindere reala peste ce preda lectia.",
    "fisiere": [
      "content/profesional/sanitar/an1-medicina/c2-word-excel/lectia5-word-vs-excel.html"
    ]
  },
  {
    "idx": 16,
    "ce": "Caseta 'Vrei mai mult?' NU e mai mult decat lectia - e o reformulare a Atomului 7 din aceeasi lectie. Atom 7 spune deja, aproape cuvant cu cuvant: 'daca vrei ca numerotarea sa inceapa de la 1 pe a doua pagina (nu de la 2), mergi la Insert > Page Number > Format Page Numbers si seteaza Start at: 0. Astfel, prima pagina are numarul 0 (dar nu il afisezi), iar a doua pagina incepe cu 1.' Caseta cere exact acelasi experiment (Different First Page + Start at: 0 + verificare ca pagina 2 arata '1'), fara sa adauge un fapt nou fata de ce a citit deja elevul cu 2 paragrafe mai sus. Singurul element cu adevarat nou e intrebarea 'De ce a ales Word o zona separata (First Page Header)' - dar chiar si aceasta reia o afirmatie deja facuta in Atom 7 ('Antetul primei pagini va spune First Page Header').",
    "fisiere": [
      "content/tic/cls5/extra-word-cls7/lectia5-antet-subsol.html"
    ]
  },
  {
    "idx": 17,
    "ce": "Caseta 'Vrei mai mult?' reformuleaza doua fapte deja predate explicit in aceeasi lectie, fara sa adauge ceva dincolo de ele: (1) distinctia rosu=ortografie / albastru=gramatica la F7 e deja in Atom 7 ('Cuvintele scrise gresit sunt subliniate cu linie rosie ondulata. Greselile gramaticale sunt subliniate cu linie albastra ondulata'); (2) afirmatia din caseta ca PDF 'ingheata' fonturile si aspectul, in timp ce .docx poate arata diferit fara acelasi font instalat, e deja in Atom 8 ('Arata identic pe orice calculator (fonturile, imaginile, formatarea sunt inghetate)'), inclusiv acelasi cuvant 'inghetate/ingheata'. Sectiunea 'Deschidere' (CV-uri, Google Classroom, formulare oficiale) e singurul element cu adevarat nou; restul casetei e recapitulare, nu adancire.",
    "fisiere": [
      "content/tic/cls5/extra-word-cls7/lectia6-proiect.html"
    ]
  },
  {
    "idx": 18,
    "ce": "Caseta 'Vrei mai mult?' (sectiunea 'Unde se foloseste') afirma ca AI-ul de tip 'patrulare + reactie la coliziune' descris in lectie 'e exact AI-ul fantomelor din Pac-Man'. E o afirmatie falsa/exagerata prezentata ca fapt: fantomele din Pac-Man NU functioneaza prin patrulare-si-reactie-la-atingere - fiecare are un algoritm propriu de calcul al 'target tile' (Blinky urmareste direct, Pinky anticipeaza 4 casute inaintea jucatorului, Inky foloseste un calcul vectorial cu pozitia lui Blinky, Clyde alterneaza urmarire/fuga dupa distanta) si alterneaza modurile scatter/chase pe un cronometru, nu 'patruleaza pana detecteaza jucatorul'. Cuvantul 'exact' transforma o analogie aproximativa intr-o afirmatie factuala incorecta despre un exemplu concret verificabil.",
    "fisiere": [
      "content/tic/cls6/m5-proiecte-recap/lectia4-mecanica.html"
    ]
  },
  {
    "idx": 19,
    "ce": "Caseta afirma ca tehnica costumelor multiple 'e folosita identic in motoare profesionale precum Unity sau Godot' si ca 'un personaj dintr-un joc comercial poate avea 20-30 de costume doar pentru animatia de mers' - o cifra specifica data ca fapt, fara nicio sursa, care nu corespunde exact conceptului de 'sprite sheet' (o singura imagine-atlas cu cadre, diferit tehnic de costume Scratch separate) descris ca 'identic'. E o cifra inventata/nesustinuta, nu o gresala grava, dar merita corectata inainte de a fi prezentata elevilor ca atare.",
    "fisiere": [
      "content/tic/cls6/m5-proiecte-recap/lectia2-personaje.html"
    ]
  },
  {
    "idx": 20,
    "ce": "DEFECT PRINCIPAL (gravitate 1): cele 10 casete 'Vrei mai mult?' (una per intrebare, cate un paragraf 'Subiect: X') NU aduc cunostinte noi fata de lectiile 1-6 din modul - sunt reformulari condensate ale acelorasi explicatii, in aceeasi ordine, cu aceiasi termeni si exemple. Comparatie directa:\n- Caseta Q4 'Section Breaks' repeta aproape cuvant-cu-cuvant lectia3 ATOM2 (Next Page / Continuous / Even Page / Odd Page, aceleasi definitii si exemple).\n- Caseta Q6 'Antet si subsol' repeta lectia4 ATOM1/4/5 (Different First Page, Different Odd & Even Pages) fara element nou.\n- Caseta Q7 'Numerotarea paginilor' repeta lectia4 ATOM3/7 (Insert->Page Number, Format Page Numbers, formate arab/roman/litere).\n- Caseta Q8 'Text Wrapping pentru imagini' repeta aproape identic lectia5 ATOM2 (In Line with Text, Square, Tight, Through, Behind/In Front of Text - aceeasi lista, acelasi exemplu).\n- Caseta Q9 'SmartArt' repeta lectia5 ATOM5 (List/Process/Cycle/Hierarchy/Relationship/Matrix/Pyramid - aceeasi lista, aceleasi exemple ca 'ciclul apei').\n- Caseta Q10 'Salvarea si exportul' repeta lectia6 (docx vs pdf, File->Export->Create PDF/XPS, calitate Standard/Minimum size).\n- Caseta Q1 'Liste' repeta lectia1 (Tab creste nivel, Shift+Tab scade).\nDoar 2 din 10 casete (Q2 'Stiluri' - mentioneaza scurtatura Ctrl+Shift+N pt stilul Normal; Q3 'Teme' - numeste temele Office/Facet/Ion/Retrospect) adauga un detaliu marginal absent din lectia originala, dar e minor si nu justifica eticheta 'Vrei mai mult?' pentru restul.\nVerificare factuala (gravitate 2): nu am gasit afirmatii FALSE - toate detaliile tehnice verificate (Ctrl+Shift+N = Normal style; Layout tab -> grupul 'Page Setup' contine butonul Columns; temele numite sunt teme reale din Word; optiunile SmartArt si Text Wrapping enumerate corect) corespund functionalitatii reale Word.\nVerificare repetitie interna (gravitate 3): cele 10 casete SUNT diferite intre ele ca subiect (fiecare acopera alta tema: liste, stiluri, teme, sectiuni, coloane, antet/subsol, numerotare, imagini, smartart, export) - nu se repeta unele cu altele in interiorul lectiei. Problema e ca fiecare caseta repeta, individual, lectia-sursa corespunzatoare din modul (1-6), nu ca s-ar repeta intre ele.",
    "fisiere": [
      "content/tic/cls7/m2-word-avansat/lectia7-evaluare.html"
    ]
  },
  {
    "idx": 21,
    "ce": "Caseta \"Vrei mai mult?\" (Provocare) cere sa inlantui Padlet -> Google Docs -> Canva pe un subiect ales (\"reciclarea in scoala\") -- dar tocmai asta a facut elevul cu doua exercitii mai devreme in ACEEASI lectie, la Exercitiul 3 (\"Campanie digitala completa\"): Padlet tip Shelf (brainstorming) -> Google Docs (plan+text) -> Canva (poster). E aceeasi structura in 3 pasi, doar cu alt format Padlet (Wall in loc de Shelf) si alt subiect exemplu. Nu e \"mai mult\", e o reformulare/reluare a exercitiului deja rezolvat in lectie.",
    "fisiere": [
      "content/tic/cls7/m4-colaborare/extra-ghid-practic-colaborare.html"
    ]
  },
  {
    "idx": 22,
    "ce": "Provocarea cere sa gasesti optiunea \"Name this version\" din Version History si sa o folosesti pentru a numi o versiune importanta -- dar exact acest pas (Name this version + explicatie de ce e util) e deja in Exercitiul 2 (\"Cum poti numi o versiune (Name this version)?\") SI in Exercitiul 3 (\"Foloseste File -> Version history -> Name this version... apoi restaureaza versiunea numita\"). Caseta adauga doar o intrebare de reflectie (de ce numesti CATEVA versiuni, nu toate), dar activitatea propriu-zisa e o repetare a ce s-a facut deja in lectie, nu ceva nou. Semnalez ca reformulare partiala, nu ca defect major -- lectia 3 si 4 trec testul \"mai mult\" fara probleme.",
    "fisiere": [
      "content/tic/cls7/m4-colaborare/lectia2-google-docs.html"
    ]
  }
]

const R_SCHEMA = {
  type: 'object',
  required: ['inlocuite', 'ce_am_schimbat'],
  properties: {
    inlocuite: { type: 'integer' },
    ce_am_schimbat: { type: 'string' },
  },
}

const V_SCHEMA = {
  type: 'object',
  required: ['defect_reparat', 'nimic_altceva_stricat', 'explicatie'],
  properties: {
    defect_reparat: { type: 'boolean' },
    nimic_altceva_stricat: { type: 'boolean' },
    explicatie: { type: 'string' },
  },
}

phase('Repara')
log('Repar ' + DEFECTE.reduce((a, d) => a + d.fisiere.length, 0) + ' casete, in ' + DEFECTE.length + ' defecte distincte.')

const rez = await pipeline(
  DEFECTE,
  (D) => agent(
    'Esti profesor de Informatica/T.I.C. Caseta "Vrei mai mult?" de la finalul unei lectii este GRESITA. Un corector a descris exact defectul. O rescrii.\n\n' +
    'DEFECTUL SEMNALAT:\n' + D.ce + '\n\n' +
    'FISIERELE cu acelasi defect (' + D.fisiere.length + ' - sunt copii pe profiluri diferite):\n' +
    D.fisiere.map(f => '  ' + f).join('\n') + '\n\n' +
    'PASUL 1 - citeste caseta de acum si ce s-a predat, INTR-UN SINGUR apel Bash:\n' +
    'python "' + DIO + '" dump "' + D.fisiere[0] + '" && python "' + DIGEST + '" "' + D.fisiere[0].split('/').slice(0, -1).join('/') + '"\n' +
    'NU citi HTML-ul brut. Ca sa vezi TEXTUL casetei de acum (dump nu ti-l da), citeste doar bucata din jurul lui class="depth-box" din primul fisier.\n\n' +
    'PASUL 2 - judeca defectul inainte sa scrii. Corectorul poate gresi. Daca, dupa ce ai citit lectia, defectul NU exista cu adevarat, NU schimba nimic: raporteaza inlocuite=0 si scrie de ce nu era un defect. E un raspuns valid si util.\n\n' +
    'PASUL 3 - daca e real, scrie caseta NOUA. Structura ramane aceeasi:\n' +
    '  a) O PROVOCARE practica - ceva de facut, nu de citit. Concreta, verificabila, care porneste de unde s-a oprit lectia.\n' +
    '  b) O INTREBARE DE GANDIT - de tipul "de ce", care duce la mecanism, nu la o definitie. Fara raspuns.\n' +
    '  c) O DESCHIDERE - unde se foloseste in lumea reala, sau ce urmeaza in materie. Concret, cu un exemplu real.\n' +
    'Reguli:\n' +
    '1. Repara EXACT defectul semnalat. Daca doar un paragraf era gresit, pastreaza fondul celorlalte doua - le poti reformula, dar nu le arunca daca erau bune.\n' +
    '2. Daca defectul era "nu e mai mult decat lectia": caseta noua trebuie sa aduca un fapt, o unealta sau un mecanism care NU apare in corpul lectiei. Verifica in digest ca nu e deja acolo.\n' +
    '3. Daca defectul era o afirmatie FALSA: nu o inlocui cu alta afirmatie tare pe care n-o poti sustine. Mai bine ceva mai modest si adevarat.\n' +
    '4. Romana FARA diacritice. HTML simplu: <p>, <ul>, <li>, <strong>, <code>. LEGATURI: cel mai bine NICIUNA - unealta refuza orice legatura nedovedita.\n' +
    '5. Lungime: intre 200 si 1600 de caractere.\n\n' +
    'PASUL 4 - scrie UN SINGUR JSON {"corp": "<p>...</p>"} (acelasi text pentru toate fisierele, sunt copii) si aplica-l pe fiecare cu comanda de INLOCUIRE, grupat intr-un singur apel Bash:\n' +
    D.fisiere.map(f => 'python "' + DIO + '" replace "' + f + '" <calea-json>').join(' && ') + '\n' +
    'Foloseste un nume de fisier JSON unic (pot rula si alte sesiuni in paralel). Unealta scoate caseta veche DOAR daca textul nou trece toate garzile - daca refuza, citeste motivul si corecteaza, nu forta.\n\n' +
    'PASUL 5 - confirma cu dump pe toate fisierele ca are_caseta e true, si verifica intr-unul din ele ca textul nou e chiar acolo.\n\n' +
    'Raporteaza cate ai inlocuit si ce ai schimbat fata de varianta gresita.',
    { label: 'repar-apr:#' + D.idx, phase: 'Repara', model: 'opus', schema: R_SCHEMA }
  ),
  (r, D) => {
    if (!r || !r.inlocuite) return { D, r, verificare: null }
    return agent(
      'Esti corector. Cineva tocmai a rescris o caseta "Vrei mai mult?" care era gresita, in ' + D.fisiere.length + ' fisiere (copii pe profiluri diferite). Verifica DOUA lucruri.\n\n' +
      'DEFECTUL care trebuia reparat:\n' + D.ce + '\n\n' +
      'FISIERELE:\n' + D.fisiere.map(f => '  ' + f).join('\n') + '\n\n' +
      'Citeste, intr-un singur apel Bash:\n' +
      'python "' + DIO + '" dump "' + D.fisiere[0] + '" && python "' + DIGEST + '" "' + D.fisiere[0].split('/').slice(0, -1).join('/') + '"\n' +
      'plus bucata din jurul lui class="depth-box" din fiecare fisier, ca sa vezi textul de acum. NU citi HTML-ul brut intreg.\n\n' +
      '1. A DISPARUT defectul descris? Si caseta noua chiar aduce ceva peste lectie, fara afirmatii false? (defect_reparat)\n' +
      '2. S-a stricat altceva? Fiecare fisier are exact o caseta? Toate fisierele au primit acelasi text nou (nu doar primul)? (nimic_altceva_stricat)\n\n' +
      'Nu semnala chestiuni de stil sau de lungime. Explica scurt si concret.',
      { label: 'reverif-apr:#' + D.idx, phase: 'Reverifica', model: 'sonnet', schema: V_SCHEMA }
    ).then(v => ({ D, r, verificare: v }))
  }
)

const bune = rez.filter(Boolean)
const inl = bune.reduce((a, x) => a + ((x.r && x.r.inlocuite) || 0), 0)
const nereparate = bune.filter(x => x.verificare && (!x.verificare.defect_reparat || !x.verificare.nimic_altceva_stricat))
const nemodificate = bune.filter(x => x.r && !x.r.inlocuite)

log('Casete inlocuite: ' + inl + '. Nemodificate (corectorul gresise): ' + nemodificate.length + '. Ramase cu probleme: ' + nereparate.length + '.')

return {
  defecte: DEFECTE.length,
  casete_inlocuite: inl,
  nemodificate: nemodificate.map(x => ({ idx: x.D.idx, de_ce: x.r.ce_am_schimbat })),
  ramase_cu_probleme: nereparate.map(x => ({ idx: x.D.idx, ce_zice_corectorul: x.verificare.explicatie })),
  schimbari: bune.filter(x => x.r && x.r.inlocuite).map(x => ({ idx: x.D.idx, fisiere: x.D.fisiere.length, ce: x.r.ce_am_schimbat })),
}
