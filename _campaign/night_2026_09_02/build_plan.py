# -*- coding: utf-8 -*-
"""Genereaza PLAN.json - inventarul complet al lectiilor de construit in tura de noapte 02->03.09.2026.
Sursa de adevar pentru CE se construieste. Rulabil oricand; nu tine starea, doar planul."""
import json, os, io

REPO = r"C:/00/Projects/LearningHub"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "PLAN.json")

def M(group, base, cls, module, title, icon, desc, lessons):
    return {"group": group, "base": base, "cls": cls, "module": module,
            "title": title, "icon": icon, "desc": desc, "lessons": lessons}

P = []

# ===== A. LICEU TEHNOLOGIC, clasa a X-a (OMECI 5099/2009: CG1 Excel + CG2 Access + CG3 PowerPoint) =====
P.append(M("lic10", "content/liceu/tehnologic", "cls10", "m3-calcul-tabelar-avansat",
  "Calcul Tabelar - Formule, Grafice, Tiparire", "\U0001F4C8",
  "CS 1.3-1.7: functii, referinte, tiparire, diagrame, import de obiecte",
  [
   ("lectia1-formule-functii.html", "CS 1.3. Formule si functii in foaia de calcul: SUM, AVERAGE, MIN, MAX, COUNT, COUNTA, IF. Sintaxa exacta a fiecarei functii, argumentele ei, si erorile frecvente (impartire la zero, valoare gresita, nume necunoscut) - cum se citesc si cum se repara."),
   ("lectia2-referinte.html", "CS 1.3. Referinte relative, absolute (cu dolar dublu) si mixte. Ce se schimba si ce nu cand copiezi o formula in jos sau lateral. Exemplu: tabel de preturi cu TVA calculat dintr-o singura celula fixa."),
   ("lectia3-grafice-diagrame.html", "CS 1.5-1.6. Grafice si diagrame: alegerea tipului potrivit (coloane, linie, structura radiala), serii de date, etichete, titluri, legenda. Cand un grafic spune adevarul si cand induce in eroare (axa taiata, scara nepotrivita)."),
   ("lectia4-tiparire-import.html", "CS 1.4, 1.7. Pregatirea pentru tiparire: zona de imprimat, cap de tabel repetat pe fiecare pagina, orientare, scalare, antet si subsol. Importul de obiecte in foaia de calcul. Aplicatie practica pe specificul calificarii tehnologice."),
  ]))
P.append(M("lic10", "content/liceu/tehnologic", "cls10", "m4-baze-de-date",
  "Baze de Date (Access)", "\U0001F5C4",
  "CS 2.1-2.6: tabele, chei, formulare, interogari, filtre, rapoarte",
  [
   ("lectia1-concepte-tabele.html", "CS 2.1-2.2. Ce este o baza de date relationala si de ce nu tii totul intr-o foaie de calcul. Tabel, inregistrare, camp. Tipurile de date din Access (Text scurt, Numar, Data/Ora, Da/Nu, Moneda) si crearea unui tabel in Vizualizare Proiect."),
   ("lectia2-chei-relatii.html", "CS 2.2. Cheia primara: ce este, de ce e obligatorie, cum se alege. Indexul si la ce ajuta. Cheia externa si relatia unu-la-mai-multi intre doua tabele, cu integritate referentiala."),
   ("lectia3-formulare.html", "CS 2.3. Formulare: de ce introduci datele prin formular si nu direct in tabel. Expertul de formulare, aranjarea controalelor, formular cu subformular pentru datele legate."),
   ("lectia4-interogari-filtre.html", "CS 2.4. Interogari de selectie simple si cu criterii multiple (SI / SAU), sortare si filtre. Criterii pe text, pe numere si pe date calendaristice. O interogare peste doua tabele legate."),
   ("lectia5-rapoarte-aplicatie.html", "CS 2.5-2.6. Rapoarte: expertul de rapoarte, grupare, totaluri, pregatire pentru tiparire. Aplicatie practica integratoare - o mica baza de date pe specificul calificarii, de la tabele pana la raportul tiparit."),
  ]))
P.append(M("lic10", "content/liceu/tehnologic", "cls10", "m5-prezentari-digitale",
  "Prezentari Digitale (PowerPoint)", "\U0001F5A5",
  "CS 3.1-3.11: creare, formatare, obiecte, animatie, tiparire, aplicatie",
  [
   ("lectia1-creare-formatare.html", "CS 3.1-3.4. Crearea unei prezentari: diapozitive, aspecte (layout), teme, coordonatorul de diapozitive, formatarea textului. Regula practica pentru cat text incape pe un diapozitiv."),
   ("lectia2-obiecte-diagrame.html", "CS 3.5-3.7. Obiecte grafice si diagrame in prezentare: forme, SmartArt, tabele, grafice, imagini. Aliniere, distribuire si ordinea straturilor."),
   ("lectia3-animatie-tranzitii.html", "CS 3.8-3.9. Animatii pe obiecte si tranzitii intre diapozitive: tipuri, declansare, durata. Cand animatia ajuta intelegerea si cand distruge prezentarea."),
   ("lectia4-tiparire-aplicatie.html", "CS 3.10-3.11. Tiparirea prezentarii (diapozitive, documente distribuite, pagini de note), modul prezentator, si aplicatia practica: o prezentare completa pe specificul calificarii, sustinuta in 5 minute."),
  ]))

# ===== B. LICEU TEHNOLOGIC, clasa a XI-a (OM 5099/2009, competentele individuale 1 si 2) =====
P.append(M("lic11", "content/liceu/tehnologic", "cls11", "m3-date-si-informatii",
  "Date, Informatii si Fluxul Informational", "\U0001F9ED",
  "Competenta 1: date vs informatii, proces si flux informational, sistem informatic vs informational",
  [
   ("lectia1-date-informatii.html", "Data, informatia, cunostinta. Cum devine o data informatie (context, prelucrare, destinatar). Procesul informational, cu exemple din firma si din scoala."),
   ("lectia2-flux-informational.html", "Fluxul informational: emitator, canal, receptor, suport. Circuitul unui document intr-o firma (comanda - aviz - factura). Blocaje, redundante si pierderi de informatie in flux."),
   ("lectia3-sistem-informatic.html", "Sistem informational fata de sistem informatic: ce contine fiecare si unde se suprapun. Componentele unui sistem informatic (hardware, software, date, proceduri, oameni). Studiu de caz pe calificarea clasei."),
  ]))
P.append(M("lic11", "content/liceu/tehnologic", "cls11", "m4-surse-si-cautare",
  "Surse de Informatie si Cautarea pe Internet", "\U0001F50E",
  "Competenta 1: banci de date, baze de date, Internet, Intranet, tehnici si criterii de cautare",
  [
   ("lectia1-surse-informatie.html", "Tipuri de surse: banci de date, baze de date, Internet, Intranet, biblioteci digitale, publicatii oficiale. Criterii de alegere si de eficienta - cost, acuratete, actualitate, acoperire."),
   ("lectia2-tehnici-cautare.html", "Tehnici de cautare si regasire: cuvinte-cheie, expresie exacta intre ghilimele, operatori de includere si excludere, cautare limitata la un site sau la un tip de fisier, filtre de limba si de localizare. Exercitii de rafinare a interogarii."),
   ("lectia3-evaluarea-surselor.html", "Evaluarea credibilitatii unei surse: autor, institutie, data, referinte, domeniu. Sursa primara fata de preluare, verificarea incrucisata. Ce faci cu raspunsul unui instrument de inteligenta artificiala - punct de plecare, nu sursa."),
  ]))
P.append(M("lic11", "content/liceu/tehnologic", "cls11", "m5-organizarea-datelor",
  "Organizarea Datelor - Tipuri si Structuri", "\U0001F5C2",
  "Competenta 2: tipuri de date si structuri de organizare",
  [
   ("lectia1-tipuri-de-date.html", "Tipuri de date: numerice (intreg, real), text, logice, data si ora, imagine. Cum recunoaste programul tipul si de ce un cod numeric scris cu zerouri in fata nu e un numar. Conversii si capcane in foaia de calcul."),
   ("lectia2-structuri-de-date.html", "Structuri de organizare: variabila, fisier text si fisier binar, foaie de lucru, tabel, baza de date, lista. Ce structura alegi pentru ce fel de problema."),
   ("lectia3-aplicatie-organizare.html", "Aplicatie: acelasi set de date real de la calificarea clasei, organizat in trei feluri - lista simpla, tabel structurat, baza de date - si ce castigi sau pierzi la fiecare varianta."),
  ]))
P.append(M("lic11", "content/liceu/tehnologic", "cls11", "m6-prelucrarea-datelor",
  "Prelucrarea Datelor - Operatori", "\U00002795",
  "Competenta 2: operatori aritmetici, relationali si logici",
  [
   ("lectia1-operatori-aritmetici.html", "Operatori aritmetici, ordinea operatiilor si rolul parantezelor. Rotunjirea si erorile de rotunjire in foaia de calcul, cu un exemplu unde totalul nu da."),
   ("lectia2-operatori-relationali-logici.html", "Operatori relationali (egal, diferit, mai mic, mai mare) si logici (SI, SAU, NU), cu tabele de adevar. Cum se scriu conditiile in foaia de calcul."),
   ("lectia3-expresii-compuse.html", "Expresii compuse: conditii cu mai multe criterii, functie conditionala imbricata fata de conditie cu SI/SAU, evaluarea pas cu pas a unei expresii. Exercitii de depanare a unei formule gresite."),
  ]))
P.append(M("lic11", "content/liceu/tehnologic", "cls11", "m7-functii",
  "Functii Predefinite si Functii Utilizator", "\U0001F9EE",
  "Competenta 2: functii aritmetice, logice, de cautare, financiare, pe siruri, informative si functii definite de utilizator",
  [
   ("lectia1-functii-aritmetice-statistice.html", "Functii aritmetice si statistice: SUM, AVERAGE, MIN, MAX, COUNT, COUNTA, COUNTIF, SUMIF, ROUND, ABS, MOD. Sintaxa exacta si o eroare tipica pentru fiecare."),
   ("lectia2-functii-logice.html", "Functii logice: IF, AND, OR, NOT, IFERROR, IFS. Construirea unei grile de decizie care incadreaza o valoare pe intervale."),
   ("lectia3-functii-cautare-referinta.html", "Functii de cautare si referinta: VLOOKUP cu potrivire exacta si aproximativa, HLOOKUP, INDEX si MATCH. De ce INDEX cu MATCH rezista cand cineva insereaza o coloana, iar VLOOKUP nu."),
   ("lectia4-siruri-financiare-utilizator.html", "Functii pe siruri de caractere (LEFT, RIGHT, MID, LEN, TRIM, CONCAT, TEXT), functii informative (ISBLANK, ISNUMBER, ISERROR), notiuni de functii financiare (PMT, FV) si definirea unei functii utilizator simple, cu apelarea ei din foaie."),
  ]))
P.append(M("lic11", "content/liceu/tehnologic", "cls11", "m8-instrumente-si-studii-de-caz",
  "Instrumente de Lucru si Studii de Caz", "\U0001F9F0",
  "Competenta 2: schite, grafice, sabloane, rapoarte simple si complexe, documente reale",
  [
   ("lectia1-schite-grafice-sabloane.html", "Instrumente de lucru: schite si diagrame (organigrama, diagrama de flux), grafice care comunica un rezultat, sabloane de document si de foaie de calcul. Cand refolosesti un sablon si cand il faci tu."),
   ("lectia2-rapoarte.html", "Rapoarte simple si complexe: structura (titlu, sinteza, date, concluzie), tabel pivot pentru sinteza, subtotaluri si grupare. Un raport care se intelege in 30 de secunde."),
   ("lectia3-documente-reale.html", "Documente reale de firma: cerere, oferta, caiet de sarcini, raport de activitate, scrisoare oficiala. Structura obligatorie a fiecaruia si greselile care le fac neserioase. Studiu de caz complet pe specificul calificarii clasei."),
  ]))

# ===== C. LICEU TEHNOLOGIC, clasa a XII-a (competentele individuale 3 si 4) =====
P.append(M("lic12", "content/liceu/tehnologic", "cls12", "m2-web-creare-site",
  "Crearea Documentelor Web", "\U0001F310",
  "Competenta 3: instrumente, structura sitului, elemente de continut, criterii de calitate, publicare",
  [
   ("lectia1-instrumente-web.html", "Instrumente de creare a paginilor web: editor de text simplu, editoare HTML dedicate, salvarea ca pagina web din procesorul de text si din foaia de calcul, editoare de imagini. Ce genereaza fiecare si de ce codul scris de mana e mai curat."),
   ("lectia2-structura-paginii.html", "Structura unei pagini HTML: declaratia de tip, elementul radacina, zona de antet (titlu, codificare) si corpul paginii; titluri pe niveluri, paragrafe, atribute. Site static fata de site dinamic - ce inseamna concret. Cod HTML real, complet si valid."),
   ("lectia3-elemente-continut.html", "Elemente de continut: liste, tabele, imagini cu text alternativ, harti de imagini, sunet si video, butoane si campuri de formular, cadre si de ce nu se mai folosesc. Fiecare cu marcajul HTML corect."),
   ("lectia4-navigare-linkuri.html", "Ierarhia paginilor si sistemul de legaturi: pagina de start, cai relative fata de cai absolute, meniu de navigare, legaturi interne cu ancore. Harta unui site de 5 pagini si scheletul de fisiere si foldere."),
   ("lectia5-criterii-publicare.html", "Criterii de calitate: viteza de incarcare (greutatea imaginilor), raportul text-imagine, lizibilitate (contrast, marime de font), design consecvent, conformitatea cu proiectul. Publicarea sitului si cum ajunge in motoarele de cautare - titlu, descriere, structura titlurilor."),
  ]))
P.append(M("lic12", "content/liceu/tehnologic", "cls12", "m3-management-proiect",
  "Managementul Informatizat al Proiectelor", "\U0001F4CB",
  "Competenta 4: notiunea de proiect, echipa, plan, structura pe activitati, traiectorie critica, etape",
  [
   ("lectia1-notiunea-de-proiect.html", "Ce este un proiect (temporar, unic, cu obiectiv si resurse limitate) si ce nu este. Obiective clare si masurabile. Fazele: initiere, planificare, executie cu monitorizare, evaluare si inchidere."),
   ("lectia2-manager-echipa.html", "Managerul de proiect si echipa: roluri si responsabilitati, sponsor, beneficiar, parti interesate. Matricea de responsabilitati - cine executa, cine raspunde, cine e consultat, cine e informat."),
   ("lectia3-plan-wbs.html", "Planul proiectului si structura pe activitati: descompunerea in pachete de lucru, estimarea duratei si a efortului, dependintele dintre activitati."),
   ("lectia4-grafic-traiectorie-critica.html", "Graficul de activitati de tip Gantt si traiectoria critica: calculul drumului critic pe un exemplu numeric mic, ce inseamna rezerva de timp si de ce intarzierea unei activitati critice intarzie tot proiectul."),
   ("lectia5-monitorizare-evaluare.html", "Initierea (justificare economica, oportunitate) si planificarea (organigrama, alocarea resurselor, cost, dependinte). Monitorizarea: cereri de schimbare, controlul riscului, rapoarte de progres si rapoarte de exceptii. Evaluarea: calitate si raport de final."),
  ]))
P.append(M("lic12", "content/liceu/tehnologic", "cls12", "m4-instrumente-proiect",
  "Instrumente Software si Proiect Integrator", "\U0001F6E0",
  "Competenta 4: componentele proiectului, instrumente software, produs final",
  [
   ("lectia1-instrumente-software.html", "Instrumente software pentru proiecte: aplicatii de tip Gantt (inclusiv variante gratuite si foaia de calcul folosita ca instrument), tablouri de tip Kanban, sabloane de documente de proiect, diagrame si schite. Ce alegi pentru un proiect mic."),
   ("lectia2-proiect-integrator.html", "Proiect integrator evaluat: realizezi un mini-site pentru o initiativa reala si il conduci ca proiect - obiectiv, structura pe activitati, grafic, roluri, raport final. Grila de evaluare explicita, cu punctaje."),
  ]))

# ===== D. SCOALA DE MAISTRI - Maistru electromecanic auto, an I (Utilizarea tehnicii de calcul) =====
P.append(M("maistri", "content/profesional/maistri", "an1", "c1-aplicatii-software",
  "C1. Aplicatii Software Uzuale", "\U0001F9FE",
  "Competenta 1: structura tabelului, formatare, prelucrarea informatiilor, diagrame, inserare de obiecte",
  [
   ("lectia1-structura-tabelului.html", "Foaia de calcul: registru, foaie, celula, rand, coloana, domeniu. Tipuri de date si introducerea corecta a numerelor, a datelor calendaristice si a textului. Prima evidenta de atelier: consumul de piese pe luna."),
   ("lectia2-formatare.html", "Formatarea tabelului: format de numar (moneda, procent, zecimale), imbinarea celulelor, borduri, latimi, inghetarea capului de tabel, formatare conditionata pentru stocuri sub minim."),
   ("lectia3-prelucrarea-informatiilor.html", "Prelucrarea informatiilor: formule si functii (SUM, AVERAGE, MIN, MAX, COUNT, IF), referinte relative si absolute. Deviz de reparatie calculat automat - manopera, piese, TVA, total."),
   ("lectia4-diagrame.html", "Diagrame: tipul potrivit pentru datele din atelier (evolutia consumului, structura costurilor), serii, etichete, titlu, legenda. Cum se citeste corect un grafic de defecte pe cauze."),
   ("lectia5-inserare-obiecte.html", "Inserarea de obiecte: imagini (schema electrica, poza piesei), forme si sageti de adnotare, legaturi catre fisiere, obiecte din alte aplicatii. Fisa de constatare cu poze."),
   ("lectia6-evaluare-c1.html", "Aplicatie evaluata pentru competenta 1: registrul de atelier complet - evidenta interventiilor, deviz automat, diagrama de costuri, fisa cu poze - cu fisa de evaluare cu DA si NU din curriculum."),
  ]))
P.append(M("maistri", "content/profesional/maistri", "an1", "c2-baze-de-date",
  "C2. Baze de Date cu Aplicatii Specifice", "\U0001F5C4",
  "Competenta 2: tipuri de date, structura bazei, operatii pe tabel, incarcare, exploatare",
  [
   ("lectia1-tipuri-de-date.html", "De ce o baza de date si nu inca o foaie de calcul. Tipurile de date dintr-o baza (text, numeric, data, logic, moneda) si alegerea corecta pentru fiecare camp al unei evidente de piese auto."),
   ("lectia2-structura-bazei.html", "Structura bazei: tabel, inregistrare, camp, cheie primara, index. Doua tabele legate - Autovehicule si Interventii - si relatia dintre ele."),
   ("lectia3-operatii-pe-tabel.html", "Operatii pe tabel: adaugare, modificare, stergere, sortare, filtrare. Formular de introducere a datelor si validari care impiedica erorile de tastare."),
   ("lectia4-incarcarea-bazei.html", "Incarcarea bazei: introducerea manuala prin formular, importul dintr-o foaie de calcul existenta, curatarea duplicatelor si a formatelor gresite."),
   ("lectia5-exploatarea-bazei.html", "Exploatarea bazei: interogari cu criterii (piese sub stoc minim, interventiile unui autovehicul, costuri pe perioada), interogare peste doua tabele si raport tiparibil."),
   ("lectia6-evaluare-c2.html", "Aplicatie evaluata pentru competenta 2: baza de date a atelierului, de la structura pana la raportul lunar de interventii, cu fisa de evaluare cu DA si NU."),
  ]))
P.append(M("maistri", "content/profesional/maistri", "an1", "c3-internet",
  "C3. Comunicarea pe Internet", "\U0001F310",
  "Competenta 3: cautarea, transmiterea si schimbul de informatii",
  [
   ("lectia1-cautare-documentatie.html", "Cautarea documentatiei tehnice: cataloage de piese, scheme electrice, fise tehnice, coduri de eroare de diagnoza. Operatori de cautare si cum ajungi la sursa producatorului, nu la o copie de pe forum."),
   ("lectia2-surse-de-incredere.html", "Surse de incredere in domeniul auto: documentatia producatorului, reglementarile tehnice si cerintele de inspectie, bazele de date de piese. Cum recunosti o informatie tehnica gresita si ce costa la o reparatie."),
   ("lectia3-transmitere-schimb.html", "Transmiterea si schimbul de informatii: email profesional cu atasamente, comprimarea fisierelor mari, spatiu de stocare in cloud pentru documentatia atelierului, semnatura si formule de adresare."),
   ("lectia4-evaluare-c3.html", "Aplicatie evaluata pentru competenta 3: gasesti documentatia pentru o defectiune data, o organizezi si o transmiti corect unui coleg si unui client; fisa de evaluare cu DA si NU."),
  ]))

# ===== E. POSTLICEAL SANITAR, an I, medicina generala =====
P.append(M("sanitar1", "content/profesional/sanitar", "an1-medicina", "c1-sistem-de-operare",
  "C1. Sistemul de Operare", "\U0001F4BB",
  "Competenta 1: interfata, organizarea informatiilor, securitate",
  [
   ("lectia1-interfata-windows.html", "Interfata sistemului de operare: desktop, bara de activitati, ferestre, meniuri, setari. Operatii de baza intr-un cabinet - instalarea unei imprimante, conectarea la retea, gestionarea unui cont de utilizator."),
   ("lectia2-organizarea-informatiilor.html", "Organizarea informatiilor: unitati, foldere, fisiere, extensii, cai. O structura de foldere care nu se pierde, copiere - mutare - redenumire, cautare si cos de reciclare."),
   ("lectia3-securitate-copii.html", "Securitatea datelor la locul de munca: parola si blocarea statiei, conturi separate, actualizari, antivirus, copie de siguranta. De ce o memorie USB pierduta cu date de pacienti este un incident, nu un ghinion."),
  ]))
P.append(M("sanitar1", "content/profesional/sanitar", "an1-medicina", "c2-word-excel",
  "C2. Documente si Reprezentari Grafice", "\U0001F4CA",
  "Competenta 2: compara reprezentari in procesorul de texte si in foaia de calcul",
  [
   ("lectia1-procesor-texte.html", "Procesorul de texte pentru documente medicale: referat, scrisoare medicala, proces-verbal, formular de consimtamant informat. Formatare, antet si subsol, tabel simplu, export in PDF pentru trimitere."),
   ("lectia2-calcul-tabelar-structura.html", "Foaia de calcul: structura, tipuri de date, introducerea corecta a valorilor si a datelor calendaristice. Prima evidenta - parametrii vitali ai unui pacient pe o saptamana."),
   ("lectia3-prelucrarea-informatiilor.html", "Prelucrarea informatiilor: formule si functii (SUM, AVERAGE, MIN, MAX, COUNT, COUNTIF, IF), referinte absolute. Calculul indicelui de masa corporala si al mediilor pe sectie, cu semnalarea valorilor in afara intervalului normal."),
   ("lectia4-reprezentari-grafice.html", "Reprezentari grafice: evolutia temperaturii sau a tensiunii, structura consumului de materiale. Alegerea tipului de diagrama si citirea corecta. Cum poate un grafic sa induca in eroare - axa taiata, scara nepotrivita."),
   ("lectia5-word-vs-excel.html", "Cand folosesti tabelul din procesorul de texte si cand foaia de calcul: comparatie pe aceleasi date, avantaje si limite, si cum treci datele dintr-o aplicatie in alta fara sa le strici."),
  ]))
P.append(M("sanitar1", "content/profesional/sanitar", "an1-medicina", "c3-baze-de-date",
  "C3. Administrarea unei Baze de Date", "\U0001F5C4",
  "Competenta 3: tipuri si structura, operatii si incarcare, exploatare",
  [
   ("lectia1-tipuri-structura.html", "Baza de date fata de foaia de calcul: cand devine necesara. Tabel, inregistrare, camp, cheie primara, tipuri de date. Structura unei evidente de pacienti sau de materiale sanitare."),
   ("lectia2-operatii-incarcare.html", "Operatii pe tabel si incarcarea bazei: formular de introducere, validari, import dintr-o foaie de calcul, corectarea duplicatelor. Doua tabele legate - Pacienti si Consultatii."),
   ("lectia3-exploatare.html", "Exploatarea bazei: interogari cu criterii (pacientii dintr-un interval de varsta, materialele cu termen apropiat), sortare si filtrare, raport tiparibil pentru seful de sectie."),
  ]))
P.append(M("sanitar1", "content/profesional/sanitar", "an1-medicina", "c4-internet-si-date",
  "C4. Comunicarea pe Internet si Protectia Datelor", "\U0001F510",
  "Competenta 4: cautare, transmitere, confidentialitate",
  [
   ("lectia1-cautare-surse-medicale.html", "Cautarea informatiei medicale: surse de incredere (institutiile publice de sanatate, agentia medicamentului, ghiduri de practica, baze de date stiintifice) fata de continut comercial si retele sociale. Cum verifici in doi pasi o afirmatie despre un medicament."),
   ("lectia2-transmitere-comunicare.html", "Transmiterea informatiei: email profesional in mediul medical, atasamente si comprimare, mesagerie de serviciu, consultatie la distanta - reguli de conduita si de forma."),
   ("lectia3-protectia-datelor.html", "Protectia datelor pacientilor: datele de sanatate ca date sensibile in regulamentul general privind protectia datelor, secretul profesional, ce se poate si ce nu se poate trimite pe aplicatii de mesagerie, anonimizarea unui caz pentru prezentare si ce faci daca s-a produs o scurgere de date."),
  ]))
P.append(M("sanitar1", "content/profesional/sanitar", "an1-medicina", "c5-prezentare",
  "C5. Structurarea si Prezentarea Informatiei", "\U0001F5A5",
  "Competenta 5: informatii din surse variate, prezentare, produs final",
  [
   ("lectia1-structurarea-informatiei.html", "Structurarea informatiei din surse variate: plan de lucru, selectie, sinteza, citarea sursei. De la zece pagini citite la zece randuri utile, fara sa pierzi sensul."),
   ("lectia2-prezentare-eficienta.html", "Realizarea prezentarii: structura (problema, date, concluzie), reguli de lizibilitate, un singur mesaj pe diapozitiv, grafice care sustin afirmatia, notele prezentatorului. Prezentarea de caz in 5 minute."),
   ("lectia3-produs-final.html", "Produs final evaluat: dosar digital complet pe o tema medicala - document, evidenta in foaie de calcul cu grafic, mica baza de date, surse verificate si prezentare - cu grila de evaluare pe cele cinci competente."),
  ]))

# ===== F. POSTLICEAL SANITAR, an II, farmacie (Modulul VII - TIC) =====
P.append(M("sanitar2", "content/profesional/sanitar", "an2-farmacie", "c1-sistem-de-operare",
  "C1. Sistemul de Operare", "\U0001F4BB",
  "Competenta 1: interfata si organizarea informatiilor in farmacie",
  [
   ("lectia1-interfata-organizare.html", "Sistemul de operare in farmacie: interfata, ferestre, imprimanta si cititorul de coduri de bare, conturi de utilizator. Organizarea fisierelor - foldere pe furnizor, pe luna, pe tip de document."),
   ("lectia2-securitate-copii.html", "Securitatea si copiile de siguranta: parole, blocarea statiei, actualizari, antivirus, salvarea gestiunii. De ce o farmacie fara copie de siguranta pierde evidenta, nu doar fisiere."),
  ]))
P.append(M("sanitar2", "content/profesional/sanitar", "an2-farmacie", "c2-word-excel",
  "C2. Documente si Reprezentari Grafice", "\U0001F4CA",
  "Competenta 2: procesor de texte si foaie de calcul in activitatea de farmacie",
  [
   ("lectia1-documente-farmacie.html", "Documente de farmacie in procesorul de texte: nota de comanda, proces-verbal de receptie, adresa catre furnizor, anunt pentru public. Formatare, antet, tabel, export in PDF."),
   ("lectia2-calcul-tabelar-stocuri.html", "Foaia de calcul pentru gestiune: structura evidentei de stocuri (denumire, substanta activa, lot, termen de valabilitate, cantitate, pret). Tipuri de date si introducerea corecta a datelor calendaristice."),
   ("lectia3-formule-adaos.html", "Formule si functii pentru farmacie: SUM, AVERAGE, COUNTIF, SUMIF, IF. Calculul adaosului comercial si al pretului cu amanuntul, TVA, si semnalarea automata a produselor cu termen de valabilitate sub 90 de zile."),
   ("lectia4-grafice.html", "Reprezentari grafice: vanzari pe luni, structura stocului pe categorii, produse cu rulaj mic. Alegerea diagramei si citirea ei corecta pentru o decizie de comanda."),
  ]))
P.append(M("sanitar2", "content/profesional/sanitar", "an2-farmacie", "c3-baze-de-date",
  "C3. Administrarea unei Baze de Date", "\U0001F5C4",
  "Competenta 3: nomenclator si gestiune",
  [
   ("lectia1-tipuri-structura.html", "Structura unei baze de date de farmacie: tabelul de produse, tabelul de furnizori, tabelul de intrari. Campuri, tipuri de date, cheie primara."),
   ("lectia2-operatii-incarcare.html", "Operatii si incarcare: formular de receptie, validari (termen de valabilitate obligatoriu, cantitate pozitiva), import din fisierul furnizorului, curatarea duplicatelor."),
   ("lectia3-exploatare.html", "Exploatarea bazei: interogari utile - produse expirate sau aproape expirate, stoc sub minim, valoarea stocului pe categorie - si raport de gestiune tiparibil."),
  ]))
P.append(M("sanitar2", "content/profesional/sanitar", "an2-farmacie", "c4-internet",
  "C4. Comunicarea pe Internet", "\U0001F310",
  "Competenta 4: surse oficiale si transmiterea informatiei",
  [
   ("lectia1-surse-oficiale.html", "Surse oficiale pentru farmacie: nomenclatorul si prospectele publicate de agentia medicamentului, listele de medicamente compensate, comunicatele de retragere de lot. Cum verifici un prospect si de ce nu iei informatia de pe forum."),
   ("lectia2-transmitere.html", "Transmiterea informatiei: comanda catre depozit pe email, atasamente si formate, comunicarea unei retrageri de lot in interiorul farmaciei, si regulile de confidentialitate pentru datele pacientilor din retete."),
  ]))
P.append(M("sanitar2", "content/profesional/sanitar", "an2-farmacie", "c5-prezentare",
  "C5. Structurarea si Prezentarea Informatiei", "\U0001F5A5",
  "Competenta 5: sinteza din surse variate si produs final",
  [
   ("lectia1-structurare-prezentare.html", "Structurarea informatiei din surse variate si realizarea prezentarii: plan, selectie, sinteza, citarea sursei, reguli de lizibilitate. Prezentarea unui produs sau a unei atentionari catre echipa, in 5 minute."),
   ("lectia2-produs-final.html", "Produs final evaluat: dosarul digital al unei gestiuni de farmacie - documente, evidenta cu formule si grafice, mica baza de date, surse oficiale citate si prezentare - cu grila de evaluare pe cele cinci competente."),
  ]))

# ===== G. LICEU ARTISTIC, clasa a XII-a - paginile ramase "In pregatire" pe situl public =====
# Aici fiecare tema e o pagina index.html intr-un folder propriu (asa e construita sectiunea),
# deci modulul nu are pagina de index separata: noIndex=True.
ART = "content/liceu/artistic"
ART_ITEMS = [
    ("proba-d/d1-calculator-fisiere", "D1: Calculatorul si Fisierele", "\U0001F4BB",
     "Proba D, competenta 1", "../../index.html", "../d2-procesare-text/index.html",
     "Sistemul de operare si gestionarea fisierelor asa cum se cere la proba de competente digitale: foldere, cai, copiere/mutare/redenumire, cautare, extensii, arhivare si dezarhivare, capacitate si unitati de masura. Aplicatia fir rosu: organizarea unei biblioteci digitale de partituri si inregistrari (foldere pe compozitor/perioada, denumiri consecvente, arhiva de trimis)."),
    ("proba-d/d2-procesare-text", "D2: Procesare Text", "\U0001F4C4",
     "Proba D, competenta 2", "../d1-calculator-fisiere/index.html", "../d3-calcul-tabelar/index.html",
     "Procesorul de text la nivelul cerut de proba D: formatare de caracter si paragraf, liste, tabele, imagini cu incadrarea textului, antet si subsol, numerotarea paginilor, export PDF. Aplicatia: programul unui concert (piese, compozitori, durate) si o biografie de artist de o pagina."),
    ("proba-d/d3-calcul-tabelar", "D3: Calcul Tabelar", "\U0001F4C8",
     "Proba D, competenta 3", "../d2-procesare-text/index.html", "../d4-prezentari/index.html",
     "Foaia de calcul la nivelul probei D: tipuri de date, formule, functiile SUM, AVERAGE, MIN, MAX, COUNT si IF, referinte absolute, sortare si filtrare, diagrame. Aplicatia: bugetul unui eveniment muzical - venituri din bilete, cheltuieli cu sala, sonorizarea si afisele, pragul de rentabilitate."),
    ("proba-d/d4-prezentari", "D4: Prezentari Multimedia", "\U0001F39E",
     "Proba D, competenta 4", "../d3-calcul-tabelar/index.html", "../d5-internet-comunicare/index.html",
     "Prezentarea electronica la nivelul probei D: diapozitive si aspecte, teme, text lizibil, imagini, sunet si video incorporat, tranzitii si animatii cu masura, notele prezentatorului, tiparire. Aplicatia: o prezentare de 5 minute despre instrumentul tau - istorie, constructie, repertoriu, un fragment audio."),
    ("proba-d/d5-internet-comunicare", "D5: Internet si Comunicare", "\U0001F310",
     "Proba D, competenta 5", "../d4-prezentari/index.html", "../d6-editare-imagini/index.html",
     "Navigare si cautare eficienta, email profesional cu atasamente, siguranta contului si recunoasterea inselatoriilor, si drepturile de autor pe intelesul unui muzician: ce inseamna o licenta, ce e domeniul public, ce sunt licentele Creative Commons si de ce o inregistrare are doua drepturi separate (compozitia si inregistrarea). Aplicatia: prezenta online corecta pe platformele de muzica."),
    ("proba-d/d6-editare-imagini", "D6: Editare Imagini", "\U0001F3A8",
     "Proba D, competenta 6", "../d5-internet-comunicare/index.html", "../d7-simulare/index.html",
     "Editarea de imagine la nivelul probei D, cu GIMP (gratuit): decupare si redimensionare, rezolutie si DPI, straturi, text, ajustari de luminozitate si contrast, transparenta, export in formatul potrivit (JPG, PNG). Aplicatia: un afis de concert si o coperta de album, pregatite si pentru ecran, si pentru tipar."),
    ("proba-d/d7-simulare", "D7: Simulare Proba D", "⏱",
     "Proba D, simulare completa", "../d6-editare-imagini/index.html", "../../index.html",
     "Simulare completa de proba practica, in formatul examenului: structura probei, cum e organizat timpul, ce se evalueaza si ce se puncteaza. Un set complet de sarcini care trece prin toate cele sase competente, cu barem explicit si cu greselile care costa cele mai multe puncte."),
    ("proiecte/p2-expo-virtuala", "P2: Expozitia / Concertul Virtual", "\U0001F3AD",
     "Proiect de clasa", "../p1-portfolio/index.html", "../p3-album-absolventi/index.html",
     "Proiect de clasa: un singur site pe care fiecare elev are propria pagina-scena, cu lucrari, audio, video si biografie artistica. Se lucreaza pe roluri (structura, design, continut, publicare), cu o conventie de fisiere respectata de toti. Include HTML si CSS real, scurt si corect, si pasii de publicare gratuita."),
    ("proiecte/p3-album-absolventi", "P3: Albumul Digital de Absolventi", "\U0001F4F7",
     "Proiect de clasa", "../p2-expo-virtuala/index.html", "../../index.html",
     "Proiect de clasa: albumul de absolvire in format digital - fotografii pregatite corect, mesaje, o linie a timpului cu momentele clasei. Include organizarea materialului, pregatirea imaginilor pentru web, structura paginii si publicarea. Include si partea delicata: acordul colegilor pentru publicarea fotografiilor si ce se face cu cei care nu vor sa apara."),
]
for slug, titlu, icon, desc, prev, nxt, topic in ART_ITEMS:
    P.append({"group": "artistic12", "base": ART, "cls": "cls12", "module": slug,
              "title": titlu, "icon": icon, "desc": desc, "noIndex": True,
              "lessons": [{"file": "index.html", "topic": topic, "prev": prev, "next": nxt}]})

# ---- serializare ----
mods = []
for m in P:
    if m.get("noIndex"):
        L = m["lessons"][0]
        L = dict(L)
        L["idx"], L["of"] = 1, 1
        L["path"] = "%s/%s/%s/%s" % (m["base"], m["cls"], m["module"], L["file"])
        mm = dict(m)
        mm["lessons"] = [L]
        mm["indexPath"] = L["path"]
        mods.append(mm)
        continue
    lessons = []
    n = len(m["lessons"])
    for i, (fname, topic) in enumerate(m["lessons"]):
        prev = "index.html" if i == 0 else m["lessons"][i-1][0]
        nxt = "index.html" if i == n - 1 else m["lessons"][i+1][0]
        lessons.append({"file": fname, "topic": topic, "prev": prev, "next": nxt,
                        "idx": i + 1, "of": n,
                        "path": "%s/%s/%s/%s" % (m["base"], m["cls"], m["module"], fname)})
    mm = dict(m)
    mm["lessons"] = lessons
    mm["indexPath"] = "%s/%s/%s/index.html" % (m["base"], m["cls"], m["module"])
    mods.append(mm)

plan = {
    "name": "night_2026_09_02",
    "created": "2026-09-02",
    "scope": ("Liceu tehnologic X/XI/XII (OM 5099/2009) + Scoala de maistri an I + Postliceal sanitar an I si an II "
              "- clasele reale ale prof. Gurlan Vasile in 2026-2027, Colegiul Tehnic de Transporturi Piatra-Neamt"),
    "repo": REPO,
    "modules": mods,
    "totals": {"modules": len(mods), "lessons": sum(len(m["lessons"]) for m in mods)},
}
with io.open(OUT, "w", encoding="utf-8") as f:
    json.dump(plan, f, ensure_ascii=False, indent=1)

print("PLAN.json scris:", OUT)
print("Module:", plan["totals"]["modules"], "| Lectii:", plan["totals"]["lessons"])
for g in ["lic10", "lic11", "lic12", "maistri", "sanitar1", "sanitar2"]:
    ms = [m for m in mods if m["group"] == g]
    print("  %-9s %2d module, %2d lectii" % (g, len(ms), sum(len(m["lessons"]) for m in ms)))
