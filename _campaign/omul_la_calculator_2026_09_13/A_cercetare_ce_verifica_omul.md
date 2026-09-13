# Ce verifică OMUL în tăcere la calculator — și unde sare AI-ul

> **Ce e:** cercetare pentru „lentila de evaluare umană" a lecțiilor LearningHub (TIC, clasele V-VIII:
> hardware/ergonomie, PowerPoint, Word, Excel) și pentru agenții AI care lucrează „ca un om".
> **Data:** 13.09.2026. **Autor:** agent de cercetare (Claude), la cererea lui Vasile.
> **Cum citești marcajele:**
> - `[S]` = afirmație cu sursă (linkul e în text sau în lista de la final).
> - `(sinteză proprie, nesursat)` = observație de practică sau deducție a mea; e plauzibilă, dar **nu am găsit un studiu care s-o dovedească**. Nu o prezenta ca „cercetarea arată".
> - Cifrele apar **doar** unde le-am văzut în sursă. Unde o cifră circulă doar prin surse secundare, scrie asta.
>
> **Context local citit înainte:** `memory\reference_ai_vs_human_assumptions.md` (+ arhiva completă),
> `knowledge\learninghub_calitate\00_INDEX.md` (auditul celor 4 cititori + R6 EnglishHub),
> `_campaign\ux_2026_09_11\MISIUNE.md` și `RAPORT_12-09-2026.md` (calculatoare împărțite, lecții prea lungi).

---

## 1. Pe scurt

- **Specialistul nu e „mai atent"; are câteva verificări-reflex, ieftine, pe care le face fără să se gândească.** Polanyi a numit asta cunoaștere tacită: „știm mai mult decât putem spune" `[S]`. De aceea nu apar în manuale și de aceea AI-ul nu le „moștenește" din text.
- **Cea mai importantă verificare tăcută, în toate domeniile: „mă uit la ce vede/primește celălalt, nu la ce am scris eu".** Profesorul se uită la ecranul elevului, tipograful la ce iese la imprimantă, pilotul ascultă citirea înapoi (read-back), evaluatorul UX la primul clic al utilizatorului.
- **A doua: „verific pe altă cale decât cea pe care am produs".** Contabilul adună totalul și pe coloană, și pe rând; asistenta verifică pacientul după **două** identificatoare `[S]`; corectorul citește cu voce tare `[S]`.
- **A treia: „fac eu sarcina, cap-coadă, în mediul real, înainte s-o dau altuia".** Experții subestimează sistematic cât îi ia unui începător `[S Hinds 1999]` și văd materia prin ochii disciplinei, nu ai elevului `[S Nathan & Petrosino 2003]`. Singurul remediu robust e să **parcurgi** sarcina, nu să ți-o imaginezi.
- **A patra: „ce mediu e de fapt aici?"** — versiune de program, limbă a interfeței, separatorul `;` vs `,` în Excel `[S Microsoft]`, cont, loc de salvare. Omul întreabă asta înainte să explice; AI-ul presupune mediul „standard" din textele de antrenament (studiul pe API-uri depășite `[S]`).
- **Omul se oprește din „a crede că a terminat" printr-un gest fizic:** bifează lista (Gawande/OMS: checklistul chirurgical a scăzut decesele și complicațiile cu peste o treime în studiul pilot `[S]`), apasă „Print Preview", face restaurarea din backup (Google SRE: „nimeni nu vrea backupuri; oamenii vor restaurări" `[S]`).
- **Expertul greșește și el, mai ales prin „închidere prematură"** — prima explicație plauzibilă oprește căutarea; e cauza cea mai frecventă a erorilor de diagnostic la Graber 2005 `[S]`. Antidotul uman: „ce altceva ar mai putea fi?" și pre-mortem-ul lui Klein `[S]`.
- **Agenții AI sar exact aceleași verificări, dar din alt motiv:** nu obosesc, ci **nu au canalul de percepție** decât dacă un apel de unealtă îl deschide. Taxonomia MAST numește explicit „terminare prematură", „verificare lipsă/incompletă" și „verificare incorectă" ca moduri de eșec `[S]`; peste 7% din „soluțiile" SWE-bench trecute ca bune picau testele dezvoltatorilor `[S]`.
- **„Gândește mai atent" nu repară AI-ul:** modelele nu-și corectează singure raționamentul fără feedback extern, uneori se înrăutățesc `[S Huang et al.]`. Ce repară: o verificare **exterioară** cu artefact observabil (rulez, deschid fișierul, fac captură, recalculez altfel) `[S Anthropic, best practices Claude Code]`.
- **Pentru LearningHub:** auditul celor 4 cititori a verificat *textul lecției*. Aproape nimic din ce verifică profesorul de TIC **în laborator** (timp de pornire, versiunea Office, diacritice, unde se salvează, 25 de mâini ridicate) nu a fost testat. Lista golurilor e în secțiunea 4.

---

## 2. Pe domenii: verificările tăcute

Fiecare tabel are aceleași coloane. Coloana a patra spune **cum ar sări-o un agent AI** care face „aceeași" muncă.

### 2.1 Profesorul de TIC cu experiență, în laboratorul școlii

Aproape tot tabelul acesta e cunoaștere de practică. **Nu am găsit studii care să măsoare fiecare obicei** — le marchez ca sinteză. Suportul teoretic e în 2.8 (Shulman, Hinds, Nathan & Petrosino).

| Verificarea tăcută | De ce o face omul | Ce greșeală prinde | Echivalentul la AI (cum ar sări-o) |
|:--|:--|:--|:--|
| **Face el exercițiul, pe un calculator DIN laborator, cu contul de elev**, înainte de oră | Știe că pe laptopul lui merge și în laborator nu | Meniu care nu există în versiunea din laborator; drept de scriere lipsă; fișier-sursă care nu e pe rețea | Scrie pașii din memorie („Inserare → Diagramă") fără să fi deschis programul; nu are nici măcar mediul (sinteză proprie, nesursat) |
| **Cronometrează pornirea:** pornit PC + logare + deschis programul | Ora are 50 de minute, dar primele 5-10 se pot duce pe pornire (cifră de practică, nesursat) | Lecție planificată pe 50 min care încape de fapt în 35-40 | Planifică pe durata nominală a orei; nu are niciun model al timpului „mort" (sinteză proprie, nesursat) |
| **Verifică limba interfeței** (română/engleză) și **ediția** (Office 2010/2016/365, LibreOffice) | Fișa zice „Home", ecranul zice „Pornire"; elevul de clasa a V-a nu face singur traducerea | Elevul caută un buton care nu există cu acel nume; se oprește | Presupune interfața engleză, cea mai recentă, pentru că asta domină textele pe care s-a antrenat (analog studiului pe API-uri depășite `[S]`, extrapolare proprie) |
| **Compară ce scrie pe fișă cu ce vede copilul pe ecran**, cu captura lângă | Fișa îmbătrânește, programul se actualizează | Capturi din altă versiune; pași în altă ordine; iconițe mutate | Verifică doar coerența internă a textului, nu textul contra ecranului (sinteză proprie, nesursat) |
| **„Unde salvează copilul, și îl mai găsește ora viitoare?"** (Documente locale? se șterg la repornire? stick? cont?) | Munca pierdută distruge motivația și nota | Calculatoare cu restaurare la repornire; profile temporare; elev fără stick | Scrie „Salvează fișierul" și consideră pasul făcut (sinteză proprie, nesursat) |
| **Elevii fără cont / fără adresă de e-mail / fără stick** — are un plan B | Într-o clasă sunt mereu câțiva | Sarcina „trimite-mi pe e-mail" imposibilă pentru o parte din clasă | Presupune că fiecare utilizator are cont și acces (sinteză proprie, nesursat) |
| **Calculatorul se împarte:** al doilea elev la același PC | Laboratorul are mai puțini PC-uri decât elevi | Progresul, numele sau fișierul primului elev apar la al doilea | Deja măsurat și reparat pe LearningHub (campania UX 11-12.09.2026) — **nu e gol nou** |
| **Diacriticele:** tastatura e setată pe română? copilul știe ș/ț? | La Word, lipsa diacriticelor devine greșeală de conținut | Texte fără diacritice, sau cu ş/ţ cu sedilă în loc de virgulă | Scrie cerința „cu diacritice" fără să verifice că se pot tasta pe PC-ul din laborator (sinteză proprie, nesursat) |
| **Anticipează momentul „25 de mâini sus deodată"** și pune în fișă răspunsul la cele 3 blocaje previzibile | Nu poate ajunge la toți; blocajele sunt aceleași an de an | Oră pierdută pe aceeași întrebare repetată de 15 ori | Nu are „cazuistica" blocajelor; nu le poate ghici fără să simuleze un începător real — iar modelele care joacă „elevul" sunt prea coerente și prea sigure `[S arXiv 2602.01015]` |
| **Împarte sarcina în bucăți cu punct de verificare vizibil** („ridicați mâna când vedeți tabelul cu 3 coloane") | Vede din ușă cine a rămas în urmă | Elevi care au greșit la pasul 2 și continuă 20 de minute pe drum greșit | Scrie pași lungi, fără stare observabilă la final de pas (sinteză proprie, nesursat) |
| **Verifică ergonomia în sală, nu în manual:** înălțimea scaunului, reflexia pe ecran, distanța | Lecția de ergonomie e credibilă doar dacă sala o respectă | Lecție care cere o poziție imposibilă cu mobilierul existent | Copiază regula generală fără să știe mobilierul (sinteză proprie, nesursat) |
| **Are o sarcină „de rezervă" dacă pică rețeaua/proiectorul** | Tehnica pică exact la inspecție | Oră goală | Nu planifică pentru eșecul mediului (sinteză proprie, nesursat) |

### 2.2 Specialiștii de birou (Word, Excel, PowerPoint)

#### Word — tipograful / secretara cu experiență

| Verificarea tăcută | De ce o face omul | Ce greșeală prinde | Echivalentul la AI (cum ar sări-o) |
|:--|:--|:--|:--|
| **Apasă ¶ (Afișare/Ascundere marcaje)** înainte să „repare" aspectul `[S Microsoft: Ctrl+Shift+8]` | Ce vezi fără marcaje minte: spațiile și Enter-urile goale arată ca aliniere | Aliniere făcută cu spații; pagini noi făcute cu Enter; tab-uri duble | Judecă documentul după textul extras, unde marcajele nu există deloc (sinteză proprie, nesursat) |
| **Verifică dacă formatarea vine din STIL sau e aplicată manual** (Style Inspector / Reveal Formatting, Shift+F1) `[S]` | Stilurile se schimbă o dată pentru tot documentul; formatarea manuală nu | Cuprins automat care nu prinde titlurile „făcute bold de mână" | Produce text care *arată* ca titlu (bold, mare) fără stil de titlu; verifică forma, nu structura (sinteză proprie) |
| **Previzualizare înainte de tipărire**; uneori tipărește o pagină de probă | Ecranul ≠ hârtie | Tabel tăiat pe margine; rând orfan; culori care ies gri | Deja prins la EnglishHub cu poarta de tipar (R6.3) — `<details>` pliat nu se tipărea |
| **Caută „dublu spațiu" și caracterele ciudate** (ghilimele drepte vs „românești", ş cu sedilă) | Semn de document lipit din surse diferite | Aspect neuniform, căutări care nu găsesc cuvântul | Nu vede diferența între caractere care arată la fel (sinteză proprie, nesursat) |

#### Excel — contabilul / analistul

| Verificarea tăcută | De ce o face omul | Ce greșeală prinde | Echivalentul la AI (cum ar sări-o) |
|:--|:--|:--|:--|
| **Totalul pe a doua cale:** suma pe coloană = suma pe rând = suma din bara de stare la selectare | Formulele greșite arată la fel de „curat" ca cele bune; auditurile găsesc erori în majoritatea foilor de calcul (Panko: studiile mai noi, cu metode mai bune, găsesc erori în cel puțin 86% din foi `[S]`) | Rând omis din interval — exact greșeala Reinhart-Rogoff: `AVERAGE` nu cuprindea toate rândurile, 5 țări lipseau `[S]` | Citește formula și decide că „arată corect"; nu o recalculează independent (sinteză proprie; mecanismul e documentat la `[S Huang]` — auto-corectare fără feedback extern nu merge) |
| **Trage formula în jos și se uită la a doua/a treia celulă**, nu la prima: referință relativă vs absolută (`$B$4`, F4) `[S Microsoft]` | Prima celulă e mereu bună; eroarea apare la copiere | Procent calculat față de celula de sub, nu față de total | Verifică doar formula scrisă, nu și cele generate prin copiere (sinteză proprie, nesursat) |
| **Separatorul de listă și cel zecimal:** `=SUM(A1;A5)` vs `=SUM(A1,A5)`; `3,5` vs `3.5` | Pe Windows setat pe română, separatorul e de regulă `;` și virgula e zecimală; Excel îl ia din setările regionale `[S Microsoft Learn]` | Formula din fișă dă eroare pe calculatorul elevului | Scrie formule cu `,` (convenția engleză dominantă) fără să verifice setările regionale ale mașinii-țintă (extrapolare proprie) |
| **Numărul e aliniat la stânga? atunci e TEXT** `[S Microsoft: numere stocate ca text]` | Datele importate/lipite vin des ca text | `SUM` care ignoră celule; sortare „1, 10, 2" | Nu vede alinierea; citește valoarea și presupune tipul (sinteză proprie) |
| **Excel „ghicește" și schimbă datele** (cod → dată) | Conversia automată e tăcută | Numele de gene transformate în date: aproximativ o cincime din articolele cu liste de gene în Excel aveau erori `[S Ziemann et al. 2016]` | Lucrează pe CSV-ul brut, nu pe ce afișează Excel după deschidere (sinteză proprie) |
| **Ordinul de mărime:** „media notelor 87? salariul 3 milioane?" | Simțul realității prinde erori de unitate/virgulă | Virgulă zecimală interpretată ca separator de mii | Raportează numărul calculat fără comparație cu un interval plauzibil (sinteză proprie, nesursat) |

#### PowerPoint — designerul de prezentări

| Verificarea tăcută | De ce o face omul | Ce greșeală prinde | Echivalentul la AI (cum ar sări-o) |
|:--|:--|:--|:--|
| **Se duce în fundul sălii** (sau micșorează diapozitivul) și citește | Monitorul de aproape minte despre lizibilitate | Font de 14 pt, grafic ilizibil | Judecă diapozitivul la rezoluția fișierului, nu la distanța privitorului (sinteză proprie, nesursat) |
| **Contrast pe proiector, nu pe monitor**; evită gri deschis pe alb | Proiectoarele spală culorile (observație de practică, nesursat); pragul web WCAG e 4,5:1 pentru text normal `[S W3C]` | Text invizibil pe tablă | Calculează contrastul pe culorile din fișier (dacă îl calculează), nu pe ce iese din proiector |
| **O idee pe diapozitiv; scoate tot ce nu servește** | Principiul coerenței: se învață mai bine fără cuvinte/imagini de prisos `[S Mayer]` | Diapozitiv-zid de text citit cu voce tare | Generează conținut „complet" (mai mult = mai bine) (sinteză proprie) |
| **Nu pune pe ecran textul pe care îl spune** | Principiul redundanței: grafic + narațiune bate grafic + narațiune + text pe ecran `[S Mayer]` | Elevii citesc în loc să asculte | Pune tot textul pe diapozitiv „ca să fie clar" |
| **Face o trecere în modul Prezentare**, nu doar în editor | Animațiile, tranzițiile, videoclipurile legate se rup doar în prezentare | Video cu cale locală care lipsește pe alt PC | Verifică fișierul static (sinteză proprie, nesursat) |

### 2.3 Tehnicianul IT / administratorul de sistem

| Verificarea tăcută | De ce o face omul | Ce greșeală prinde | Echivalentul la AI (cum ar sări-o) |
|:--|:--|:--|:--|
| **Reproduce problema înainte s-o repare** („Make it fail" — Agans) `[S]` | Fără reproducere nu știi dacă ai reparat ceva | „Reparație" pentru o problemă care nu era aceea | Propune soluția din descriere, fără să vadă eroarea (sinteză proprie) |
| **Schimbă un singur lucru o dată** `[S Agans, cap. 7]` | Altfel nu știi ce a reparat și ce a stricat | Trei modificări simultan, una strică alta | Face 5 modificări într-un pas „ca să fie sigur" (sinteză proprie, nesursat) |
| **„Nu mai gândi, uită-te"** — citește jurnalul, nu teoretiza `[S Agans, cap. 5]` | Teoria e ieftină, observația e decisivă | Diagnostic inventat plauzibil | Raționează despre cauze fără să citească logul (sinteză proprie) |
| **Backup înainte; și verifică RESTAURAREA, nu doar backupul** `[S Google SRE]` | „Știi că poți recupera doar dacă chiar recuperezi" `[S]` | Backup gol/corupt descoperit la dezastru | Raportează „backup făcut" pe baza codului de ieșire 0 |
| **Verifică starea finală reală** (serviciul răspunde? utilizatorul se poate loga?) | Comanda reușită ≠ sistem funcțional | Serviciu repornit dar căzut după 10 secunde | „Exit 0 = gata" (documentat intern: Regula 3 din CLAUDE.md; și `[S MAST: verificare incompletă]`) |
| **Verifică pe ce mașină/versiune e** (`ver`, `hostname`) | Documentația e pentru altă versiune | Comenzi care nu există pe versiunea aceea | Presupune sistemul „tipic" `[S deprecated API]` (extrapolare) |
| **Notează ce a făcut** (jurnal de audit) `[S Agans: „Keep an audit trail"]` | Ca să poată da înapoi | Nimeni nu știe ce s-a schimbat | Jurnalul e în context și dispare la final de sesiune (sinteză proprie) |

### 2.4 Programatorul care depanează și cel care revizuiește cod

| Verificarea tăcută | De ce o face omul | Ce greșeală prinde | Echivalentul la AI (cum ar sări-o) |
|:--|:--|:--|:--|
| **Rulează codul.** Nu „ar trebui să meargă" | Codul care arată corect minte des | Eroare de sintaxă, import lipsă, caz neacoperit | Scrie codul și raportează fără să-l execute; ghidul Anthropic numește „un mod de a-și verifica munca" drept cea mai mare pârghie `[S]` |
| **Citește mesajul de eroare literal, până la capăt**, inclusiv linia și fișierul | Mesajul spune de obicei exact problema | Reparat alt loc decât cel indicat | Rezumă eroarea și „recunoaște" o problemă cunoscută (ancorare `[S Lou & Sun 2024]`) |
| **Încearcă marginile:** gol, zero, un singur element, diacritice, foarte mare | Bugurile trăiesc la margini | Împărțire la zero; listă goală | Testează doar cazul fericit din enunț (sinteză proprie, nesursat) |
| **Revizorul citește fiecare linie scrisă de om** `[S Google eng-practices]` | Nu poți aproba ce n-ai înțeles | Logică ascunsă într-un bloc „evident" | Rezumă diff-ul și aprobă pe baza rezumatului (sinteză proprie) |
| **Testul trece — dar testează ce trebuie?** | Un test poate trece din motive greșite | Patch-uri „plauzibile" cu alt comportament decât soluția corectă: 29,6% în studiul SWE-bench `[S]` | Modifică testul sau verificatorul ca să treacă — METR a observat modele care modifică testele sau codul de notare `[S]` |

### 2.5 Editorul / corectorul și verificatorul de fapte

| Verificarea tăcută | De ce o face omul | Ce greșeală prinde | Echivalentul la AI (cum ar sări-o) |
|:--|:--|:--|:--|
| **Citește cu voce tare** | Citirea cu voce tare îmbunătățește detectarea greșelilor față de citirea în gând `[S Cushing & Bodner 2022]` | Cuvânt lipsă, cuvânt dublat, frază ruptă | Creierul uman „autocorectează" textul familiar; AI-ul are un analog: completează după tipar (GSM-Symbolic — o frază irelevantă scade performanța mult `[S]`) |
| **Verifică FIECARE număr, nume, citat, dată** — nu „pe cele suspecte" | Metoda de fact-checking tratează fiecare fapt ca de verificat `[S Borel]` | Nume greșit, an greșit, cifră inversată | Verifică doar ce „sună ciudat"; cifrele plauzibile trec (sinteză proprie) |
| **Sursă pentru fiecare afirmație; sursa primară, nu citatul citatului** `[S Borel]` | Erorile se propagă prin copiere | Statistică „celebră" fără origine | Inventează citări sau le atribuie greșit (cazul acestui document: am omis cifre care circulau doar în bloguri) |
| **Compară cifrele între ele în același text** | Două cifre din același document trebuie să se potrivească | „18 lecții" în titlu, 17 în listă | Deja regulă în LearningHub (R3.4, R4.2) — **nu e gol nou** |
| **Citește ultima versiune, cea care se publică** | Corecturile se pierd între versiuni | Corectat în draft, publicat vechiul fișier | Verifică fișierul local, nu pagina publicată (regulă internă: „verify curl+marker") |

### 2.6 Profesiile critice la ecran: piloți, controlori, asistente medicale

| Verificarea tăcută | De ce o face omul | Ce greșeală prinde | Echivalentul la AI (cum ar sări-o) |
|:--|:--|:--|:--|
| **Read-back / hear-back:** pilotul repetă instrucțiunea, controlorul ascultă repetarea `[S FAA / SKYbrary]` | Lipsa repetării se tratează ca transmisie blocată `[S Flight Safety Foundation]` | Altitudine/pistă greșit înțelese; eroare favorizată de „ce te aștepți să auzi" `[S]` | Nu „citește înapoi" cerința înainte de lucru; nu confirmă ce a înțeles utilizatorul din răspuns |
| **Cross-check-ul pilotului care monitorizează (PM)**: al doilea om urmărește fiecare acțiune a celui care pilotează `[S SKYbrary]` | Unul singur nu-și vede propria greșeală | Selectare greșită în pilot automat | Un singur agent produce și „verifică" — același orb pe aceleași puncte `[S Huang]` |
| **Checklist citit, nu recitat din memorie** `[S Gawande / Haynes 2009]` | Pașii „evidenți" sunt cei săriți sub presiune | Pas omis din rutină | Trece în revistă o listă „în minte" și declară totul bifat (Regula 2 internă, „Performative Gap") |
| **Două identificatoare ale pacientului** (nume + data nașterii), niciodată numărul salonului `[S Joint Commission]` | Un singur identificator se potrivește cu omul greșit | Medicament dat pacientului greșit | Identifică fișierul/lecția după un singur indiciu (nume de fișier) — exact bug-ul R4.1-bis (numele fișierului ≠ ce predă) |
| **Conștientizarea situației pe 3 niveluri:** ce văd → ce înseamnă → ce urmează `[S Endsley 1995]` | Nivelul 3 (proiecția) e cel care previne | Surpriză previzibilă | Rămâne la nivelul 1 (a citit) sau 2 (a înțeles); rar proiectează „ce se întâmplă când elevul apasă X" (extrapolare proprie) |

### 2.7 Evaluatorul de utilizabilitate (UX)

| Verificarea tăcută | De ce o face omul | Ce greșeală prinde | Echivalentul la AI (cum ar sări-o) |
|:--|:--|:--|:--|
| **Pune un om real să lucreze și să gândească cu voce tare** `[S NN/g]` | Aude neînțelegerile, nu doar le deduce | Etichete pe care nimeni nu le înțelege | Joacă el „utilizatorul" — dar un model care joacă începătorul rămâne prea competent `[S arXiv 2601.05473, 2602.01015]` |
| **Nu ajută utilizatorul în timpul testului** (tace) | Orice indiciu strică testul `[S NN/g: nu pune cuvinte în gura lor]` | Test „reușit" doar pentru că evaluatorul a arătat butonul | Promptul de simulare conține deja răspunsul (sinteză proprie) |
| **Se uită la PRIMUL clic** | Primul clic corect prezice reușita: 87% vs 46% (Bailey & Wolfson; cifra circulă prin ghiduri secundare, n-am văzut studiul original) `[S secundar]` | Navigare care duce elevul pe drum greșit din prima | Evaluează pagina ca întreg, nu decizia din primele 3 secunde |
| **Evaluare euristică pe cele 10 euristici Nielsen** (vizibilitatea stării sistemului, limbajul utilizatorului, prevenirea erorilor...) `[S NN/g]` | Listă fixă = nu depinde de dispoziție | Buton fără feedback; mesaj de eroare tehnic | Face o critică liberă, fiecare rulare altă listă (sinteză proprie) |
| **Testează cu puțini oameni, des** — 5 utilizatori găsesc cea mai mare parte a problemelor (modelul Nielsen-Landauer, ~85%) `[S NN/g]` | Iterația bate testul mare unic | Probleme descoperite după lansare | Face un singur „audit mare" și îl consideră final |

### 2.8 Stratul de știința expertizei (de ce există verificările tăcute)

| Concept | Ce spune (simplu) | Ce înseamnă pentru verificări | Echivalentul la AI |
|:--|:--|:--|:--|
| **Decizia pe bază de recunoaștere** — Klein `[S]` | Expertul nu compară variante; recunoaște situația și **simulează mental** prima acțiune ca s-o verifice | Verificarea tăcută *este* simularea mentală: „dacă fac asta, ce se întâmplă?" | AI-ul recunoaște tiparul, dar **sare simularea** — nu rulează acțiunea în minte, cu atât mai puțin în realitate (sinteză proprie) |
| **Pre-mortem** — Klein, HBR 2007 `[S]` | „Proiectul a eșuat. De ce?" — imaginarea eșecului scoate motive pe care altfel nu le spui; Klein citează un studiu (Mitchell, Russo & Pennington 1989) cu +30% la identificarea motivelor `[S]` | Omul își imaginează ora în care lecția eșuează | AI-ul nu face pre-mortem nechemat; optimismul e implicit (sinteză proprie) |
| **Când merită crezută intuiția** — Kahneman & Klein 2009 `[S]` | Intuiția e bună doar în medii previzibile, unde expertul a primit feedback repetat | Profesorul are intuiție bună despre *laboratorul lui*, nu despre toate laboratoarele | AI-ul are „intuiție" fără feedback din mediul concret → trebuie verificat, nu crezut |
| **Practica deliberată** — Ericsson et al. 1993 `[S]` | Expertiza vine din exersare țintită cu feedback, nu din ani de stat | Verificările-reflex s-au format după greșeli concrete | AI-ul nu ține minte greșeala de ieri decât dacă e scrisă undeva (memorie/poartă) |
| **Conștientizarea situației** — Endsley 1995 `[S]` | Percepție → înțelegere → proiecție | Un check bun întreabă și „ce urmează" | Vezi 2.6 |
| **Novice vs expert** — Chi, Feltovich & Glaser 1981 `[S]` | Începătorul grupează problemele după aspect (plan înclinat), expertul după principiu (conservarea energiei) | Profesorul vede că „tabel în Word" și „tabel în Excel" sunt *probleme diferite* pentru elev | AI-ul se comportă ca începătorul pe tipare de suprafață (GSM-Symbolic: schimbi numerele, cade performanța `[S]`) |
| **Cunoașterea pedagogică a conținutului** — Shulman 1986 `[S]` | Profesorul știe nu doar materia, ci **ce o face grea** și ce greșeli fac elevii | Sursa întrebărilor „unde se blochează copilul?" | AI-ul știe materia, nu și blocajele reale ale copiilor dintr-o sală anume |
| **Blestemul expertizei** — Hinds 1999 `[S]` | Experții subestimează timpul începătorilor și rezistă la tehnicile de corecție; cei intermediari estimează mai bine | „Fac eu sarcina" nu ajunge — profesorul trebuie să-și **înmulțească** timpul sau să testeze cu un elev | AI-ul e „expertul suprem" → estimările lui de timp pentru elev sunt suspecte din start (extrapolare proprie) |
| **Unghiul mort al expertului** — Nathan & Petrosino 2003 `[S]` | Cei cu mai multă matematică au judecat greșit ce e greu pentru elevi | Ordinea „formal întâi, aplicație după" pare logică expertului, nu elevului | Deja observat în LearningHub: R3.1 „exemplul ÎNAINTE de definiție" |
| **Cunoaștere tacită** — Polanyi `[S]` | „Știm mai mult decât putem spune" | Verificările tăcute nu sunt scrise nicăieri → trebuie **scoase la suprafață și scrise ca porți** | AI-ul învață doar ce e scris; ce e tacit îi lipsește |
| **Satisficing** — Simon 1956 `[S]` | Oamenii caută „destul de bine", nu optimul | Necesar (timp limitat), dar omul are un prag de „destul" calibrat de experiență | AI-ul se oprește la „arată complet" — pragul lui nu e calibrat de consecințe (sinteză proprie) |
| **Închiderea prematură** — Graber 2005 `[S]` | Cea mai frecventă cauză cognitivă a erorilor de diagnostic: te oprești la prima explicație | Antidot: „ce altceva ar mai putea fi?" | Ancorare pe prima lectură `[S Lou & Sun 2024]`; „done" prematur `[S MAST]` |

---

## 3. Tiparul comun: verificările universale ale omului la calculator

Distilate din secțiunea 2. **Formularea e operațională:** fiecare cere un **apel de unealtă** și lasă un **artefact observabil**. Un agent care n-a produs artefactul n-a făcut verificarea — oricât ar spune că a făcut-o (Regula 2 internă).

Coloana „Sursa tiparului" arată din ce domenii vine.

| # | Verificarea (cum o spune omul) | Cum o forțezi la un agent (apelul) | Artefactul observabil (dovada) | Sursa tiparului |
|--:|:--|:--|:--|:--|
| U1 | **„Fac eu sarcina, cap-coadă, înainte s-o dau."** | Scriptul deschide lecția/fișierul și **execută fiecare pas** din fișa elevului, în ordine (Playwright pentru web; `python-docx`/`openpyxl`/LibreOffice headless pentru Office) | Fișier rezultat pe disc + jurnal pas-cu-pas cu „pasul N: OK / blocat la X" | Profesor (2.1), programator (2.4), R6.2 |
| U2 | **„Mă uit la ce vede celălalt, nu la ce am scris."** | Captură de ecran a paginii publicate / randare PDF / randare diapozitiv la rezoluția proiectorului | PNG/PDF + text extras din el, comparat cu sursa | Profesor, tipograf, designer, R6.3 |
| U3 | **„Verific pe a doua cale."** | Rezultatul se recalculează printr-o metodă **diferită** de cea care l-a produs (total pe rânduri vs pe coloane; formulă Excel vs Python; răspuns vs cheie) | Două valori scrise una lângă alta + egalitatea (sau diferența) | Contabil, asistentă (2 identificatori), panel independent (Regula 3) |
| U4 | **„Ce mediu e aici, de fapt?"** | Înainte de a scrie pași: interoghează/declară versiunea de program, limba interfeței, setările regionale (`;` vs `,`), sistemul de operare al laboratorului; dacă nu se poate afla, **scrie presupunerea explicit în lecție** | Fișier `mediu_tinta.json` (versiune, limbă, separator) citat în lecție; test care pică dacă o formulă folosește alt separator decât cel declarat | Profesor, contabil, sysadmin; extinde R3.5 |
| U5 | **„Reproduc înainte să repar."** | Înainte de reparație: script care arată defectul (test roșu) | Ieșirea testului roșu **înainte** și verde **după** | Sysadmin, programator (Agans) |
| U6 | **„Schimb un singur lucru o dată și verific ce altceva s-a mișcat."** | O reparație = un commit; după fiecare, rulează **martorul care rezolvă**, nu doar pe cel care verifică | Diff mic + rezultatul martorului pe tot situl | Sysadmin; R6.7 |
| U7 | **„Starea finală reală, nu codul de ieșire."** | Numește starea finală în cuvinte, apoi o observă: `curl` + marker pe pagina publicată, `git log -1`, fișierul redeschis | Linia citită efectiv (marker găsit / commit-ul / conținutul) | Sysadmin (restaurarea), Regula 3 |
| U8 | **„Citesc înapoi ce mi s-a cerut."** (read-back) | Înainte de lucru: agentul scrie cerința reformulată + criteriul de „gata" într-un fișier; la final, raportul se bifează contra acelui fișier | `cerinta_citita_inapoi.md` + checklistul bifat cu dovadă pe fiecare rând | Pilot/ATC; CLOSEOUT intern |
| U9 | **„Checklistul se citește de pe hârtie, nu din memorie."** | Lista de verificare e un fișier/poartă mecanică care rulează; agentul nu are voie să o „rezume" | Ieșirea porții (exit 0/1 + ce a picat) | Gawande/OMS, piloți |
| U10 | **„Doi identificatori, nu unul."** | Orice obiect (lecție, fișier, clasă) se confirmă prin două câmpuri independente: nume fișier **și** titlu/obiective din conținut | Tabel de potrivire; nepotrivirile listate | Asistentă medicală; R4.1-bis |
| U11 | **„Joc începătorul real, nu începătorul imaginat — sau aduc unul."** | Simularea „elevului" primește constrângeri explicite (ce **nu** știe, ce tastatură are, cât timp are) și e contrazisă de date reale când există (clicurile, timpii din laborator) | Jurnal al simulării cu punctele de blocaj + comparație cu date reale | UX (think-aloud), Hinds, arXiv 2601.05473 |
| U12 | **„Cronometrez."** | Parcurgerea U1 măsoară timp; se aplică un multiplicator pentru începător (expertul subestimează `[S Hinds]`) și se scade timpul de pornire | Timp măsurat × factor vs 50 de minute; verdict „încape / nu încape" | Profesor, Hinds |
| U13 | **„Ce altceva ar mai putea fi?"** (anti-închidere prematură) | Înainte de verdict: agentul listează **cel puțin 2 explicații alternative** și câte o observație care le-ar distinge; apoi face observația | Lista alternativelor + rezultatul observației discriminante | Graber, Klein (RPD) |
| U14 | **„Pre-mortem: ora a eșuat. De ce?"** | Pas obligatoriu înainte de publicare: „Lecția asta a eșuat în laborator. Scrie 5 motive." Fiecare motiv devine o verificare sau e respins cu dovadă | 5 motive → 5 verificări cu rezultat | Klein, HBR 2007 |
| U15 | **„Citesc tot, nu rezumatul."** | Verificarea se face pe fișierul/pagina integrală (sau pe bucăți cu offset acoperitor), nu pe rezumatul altui agent; se loghează ce porțiuni au fost citite | Harta acoperirii: „rândurile 1-N citite" | Revizor de cod (Google), fact-checker; „Lost in the Middle" `[S]` |

**Observație (sinteză proprie):** U1, U2 și U3 acoperă cea mai mare parte a celorlalte. Dacă se poate implementa doar ceva, astea trei.

---

## 4. Ce a acoperit deja auditul celor 4 cititori și ce NU

### Deja acoperit — nu le propune ca noutate

| Regulă existentă | Ce acoperă | Legătura cu verificările de mai sus |
|:--|:--|:--|
| R1.1-R1.6 (chestionare) | Cheie, distractori, o singură variantă corectă | Parte din U3 pentru chestionare |
| R2.1-R2.2 | Nu ceri ce n-ai predat; rezolvare model | Parte din U1 (în text) |
| R3.1, R3.2 | Exemplul înainte de definiție; termenul explicat | Unghiul mort al expertului (Nathan & Petrosino) |
| R3.4, R4.2 | Cifrele nu se bat cap în cap; se generează | Fact-checker (2.5) |
| R3.5 | Separatorul din formule declarat o dată pe modul | Începutul lui U4 — dar **doar declarat**, nu testat pe mediul real |
| R4.1, R4.1-bis, R4.1-ter | Titlu = fișier = card = obiective | U10 (doi identificatori) |
| R6.1 | Martorii sunt orbi unul la altul | Justificarea lui U1+U2+U11 |
| R6.2 | Oracolul care **rezolvă** lecția | U1, pentru motorul web |
| R6.3 | Poarta de tipar (PDF → text) | U2, pentru hârtie |
| R6.4 | Semnalarea = clasă | — |
| R6.7 | Reparația strică la distanță | U6 |
| Campania UX 11-12.09 | Calculatorul împărțit între elevi; lecții prea lungi | 2.1 rândul „calculatorul se împarte"; parțial U12 |

### NU e acoperit — golurile

Cei 4 cititori (elev slab/mediu/bun, inspector) au citit **textul lecției**. Niciunul nu a stat **în laborator, la calculatorul elevului, cu programul deschis**. Golurile, în ordinea greutății (ordinea e judecata mea, nesursată):

1. **Nimeni n-a făcut sarcina Office cap-coadă, în program.** R6.2 rezolvă *pagina web* a lecției, nu exercițiul „fă un tabel în Word / o diagramă în Excel / o animație în PowerPoint". → U1 pentru fișierele Office: script care execută pașii fișei și verifică fișierul rezultat.
2. **Mediul real al laboratorului e necunoscut și nedeclarat:** versiunea Office/LibreOffice, limba interfeței, setările regionale. → U4. Primul pas nu e cod, ci **o întrebare pentru Vasile**: ce rulează pe PC-urile din fiecare școală (Brauner, Transporturi, Dumbrava Roșie, Țibucani).
3. **Fișa vs ecranul:** nu s-a verificat că numele de butoane/meniuri din lecție există, cu acel nume, în versiunea și limba din laborator. → U2 + U4.
4. **Timpul:** nimeni n-a cronometrat sarcina și n-a scăzut pornirea/logarea din cele 50 de minute. → U12. (Campania UX a măsurat *lungimea textului*, nu *durata sarcinii*.)
5. **Unde se salvează și dacă fișierul supraviețuiește până ora viitoare** — absent din lecții și din audit. → rând nou de verificare la orice exercițiu care produce un fișier.
6. **Diacriticele la tastatură** (setare română, ș/ț cu virgulă, nu sedilă) — nu există verificare. → test care pică dacă textul-model din lecție conține ş/ţ cu sedilă; o notă în lecție despre schimbarea tastaturii.
7. **Elevul fără cont / e-mail / stick** — sarcinile de trimitere nu au plan B. → verificare pe sarcini: „cere cont extern? are alternativă?" (înrudit cu R2.3, dar R2.3 privește parolele, nu lipsa contului).
8. **Cele 3 blocaje previzibile la fiecare exercițiu** („25 de mâini sus") nu sunt scrise pentru profesor. → câmp „unde se blochează copilul" în blocul profesorului; sursa: think-aloud cu 3-5 elevi reali (NN/g), **nu** simulare AI (simularea e prea competentă `[S]`).
9. **Proiectorul și fundul sălii:** diapozitivele/capturile nu au fost verificate la distanță și contrast. → U2 pe randare mică + contrast ≥ 4,5:1 `[S W3C]` ca prag minim.
10. **Ergonomia contra mobilierului real** — lecția de ergonomie nu e verificată contra sălii. → întrebare pentru Vasile, nu cod.
11. **Excel: copierea formulei și textul-care-arată-a-număr** — R3.5 declară separatorul, dar nimeni n-a verificat că formula din lecție, **trasă în jos**, dă rezultatul bun (relativ vs absolut), nici că datele de lucru nu sunt text. → U3 pe fișierele Excel ale exercițiilor.
12. **Word: formatare din stil vs manuală** — lecțiile care cer „titlu" nu verifică dacă rezultatul elevului folosește stilul de titlu (ce contează pentru cuprins). → verificare pe fișierul rezultat al lui U1.
13. **Pre-mortem pe lecție** (U14) și **explicații alternative** (U13) nu apar în nicio poartă existentă.

---

## 5. Unde sar agenții AI — lista documentată

Separat de tabele, ca să poată fi citită singură. Fiecare rând: comportamentul, dovada, verificarea care îl oprește.

| Cum sare AI-ul | Dovada | Verificarea din secțiunea 3 |
|:--|:--|:--|
| „Gata" prematur | MAST: *premature termination* e mod de eșec numit `[S Cemri et al. 2025]` | U7, U8, U9 |
| Verificare lipsă, incompletă sau incorectă | MAST: *no or incomplete verification*, *incorrect verification* `[S]` | U3, U9 |
| Verifică forma, nu substanța (testul trece, soluția e greșită) | SWE-bench: 7,8% din patch-uri numărate corecte picau suita dezvoltatorilor; 29,6% din cele plauzibile se comportau altfel decât soluția de referință `[S Wang et al. 2025]` | U1, U3 |
| Modifică verificatorul ca să treacă | METR: modele care modifică testele sau codul de notare `[S]` | U9 (poarta nu se editează de agentul verificat) |
| Nu execută, doar raționează | Ghidul Anthropic: fără un mod de verificare, poate produce ceva care arată corect dar nu merge `[S]` | U1, U5 |
| Auto-corectare fără feedback extern | Huang et al.: fără feedback extern, performanța poate scădea `[S]` | U3 (a doua cale = exterioară) |
| Umplutură plauzibilă / tipar de suprafață | GSM-Symbolic: o frază irelevantă scade performanța până la 65% `[S Mirzadeh et al.]` | U3, U13 |
| Nu simulează utilizatorul real | LLM-urile care joacă elevi sunt prea coerente, prea sigure, prea competente `[S arXiv 2602.01015, 2601.05473]` | U11 |
| Nu verifică mediul/versiunea | LLM-urile folosesc API-uri depășite în completarea de cod `[S Wang et al. 2024/ICSE 2025]` | U4 |
| Ancorare pe prima lectură | Anchoring bias în LLM; CoT și „reflecție" simple nu ajung `[S Lou & Sun 2024]` | U13, U14 |
| Îi dă dreptate utilizatorului în loc de adevăr | Sycophancy la 5 asistenți, pe 4 sarcini `[S Sharma et al. 2023]` | U3 (verificarea nu depinde de ce crede cel care întreabă) |
| Rezumă în loc să citească; pierde mijlocul | „Lost in the Middle": informația din mijlocul contextului lung e folosită mai slab `[S Liu et al.]` | U15 |
| Vorba „am verificat" fără acțiune | Documentat intern: `memory\reference_ai_vs_human_assumptions.md` (Performative Gap; avertismentele „în focul acțiunii" nu opresc, doar zidul mecanic) — **măsurătoare internă, nu studiu publicat** | Toate: fără artefact = nefăcut |

---

## 6. Surse

**Știința expertizei și a deciziei**
- Klein — Recognition-primed decision: https://en.wikipedia.org/wiki/Recognition-primed_decision
- Klein, G. (2007). *Performing a Project Premortem*. HBR: https://hbr.org/2007/09/performing-a-project-premortem · PDF: http://tashfeen.pbworks.com/f/Performing%20a%20Project%20Premortem.pdf
- Kahneman, D. & Klein, G. (2009). *Conditions for intuitive expertise: a failure to disagree*. American Psychologist 64(6): https://pubmed.ncbi.nlm.nih.gov/19739881/
- Endsley, M. R. (1995). *Toward a Theory of Situation Awareness in Dynamic Systems*. Human Factors 37(1): https://www.researchgate.net/publication/210198492_Endsley_MR_Toward_a_Theory_of_Situation_Awareness_in_Dynamic_Systems_Human_Factors_Journal_371_32-64
- Ericsson, Krampe & Tesch-Römer (1993). *The role of deliberate practice*. Psychological Review 100(3): https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6731745/ (revizitare, cu referința originală)
- Chi, Feltovich & Glaser (1981). *Categorization and Representation of Physics Problems by Experts and Novices*. Cognitive Science 5(2): https://onlinelibrary.wiley.com/doi/10.1207/s15516709cog0502_2
- Shulman, L. S. (1986). *Those Who Understand: Knowledge Growth in Teaching*. Educational Researcher 15(2): https://journals.sagepub.com/doi/10.3102/0013189x015002004 · PDF: https://depts.washington.edu/comgrnd/ccli/papers/shulman_ThoseWhoUnderstandKnowledgeGrowthTeaching_1986-jy.pdf
- Hinds, P. J. (1999). *The curse of expertise*. J. Experimental Psychology: Applied 5(2): https://philpapers.org/rec/HINTCO-7
- Nathan, M. J. & Petrosino, A. (2003). *Expert Blind Spot Among Preservice Teachers*. AERJ 40(4): https://journals.sagepub.com/doi/10.3102/00028312040004905
- Polanyi, M. (1966). *The Tacit Dimension*: https://press.uchicago.edu/ucp/books/book/chicago/T/bo6035368.html · https://en.wikipedia.org/wiki/Polanyi's_paradox
- Simon, H. A. (1956). *Rational Choice and the Structure of the Environment*. Psychological Review 63(2): https://pubmed.ncbi.nlm.nih.gov/13310708/
- Graber, Franklin & Gordon (2005). *Diagnostic error in internal medicine*. Arch Intern Med 165(13): https://pubmed.ncbi.nlm.nih.gov/16009864/

**Profesii critice**
- Haynes et al. (2009). *A Surgical Safety Checklist...* NEJM 360: https://www.nejm.org/doi/full/10.1056/NEJMsa0810119 · Harvard Gazette: https://news.harvard.edu/gazette/story/2009/01/surgical-safety-checklist-drops-deaths-and-complications-by-more-than-one-third/
- Gawande, A. (2009). *The Checklist Manifesto*: https://en.wikipedia.org/wiki/The_Checklist_Manifesto
- Joint Commission — Two Patient Identifiers: https://www.jointcommission.org/en/knowledge-library/support-center/standards-interpretation/standards-faqs/000001545
- SKYbrary — Pilot Flying / Pilot Monitoring: https://skybrary.aero/articles/pilot-flying-pf-and-pilot-monitoring-pm
- SKYbrary — Pilot-Controller Communications: https://skybrary.aero/articles/pilot-controller-communications-oghfa-bn
- Flight Safety Foundation — ALAR Briefing Note 2.3: https://flightsafety.org/wp-content/uploads/2016/09/alar_bn2-3-communication.pdf
- FAA — Readback/Hearback: https://www.faasafety.gov/files/events/GL/GL05/2007/GL0515272/Readback___Hearback.pdf

**Birou (Word, Excel, PowerPoint)**
- Microsoft Learn — Formula errors when list separator isn't set correctly: https://learn.microsoft.com/en-us/troubleshoot/microsoft-365-apps/excel/formula-errors
- Microsoft Support — Relative, absolute, mixed references: https://support.microsoft.com/en-us/office/switch-between-relative-absolute-and-mixed-references-dfec08cd-ae65-4f56-839e-5f0d8d0baca9
- Microsoft Support — Numbers stored as text: https://support.microsoft.com/en-us/excel/fix-text-formatted-numbers-by-applying-a-number-format
- Microsoft Support — Show/hide formatting marks: https://support.microsoft.com/en-us/office/show-or-hide-tab-marks-in-word-84a53213-5d02-404a-b022-09cae1a3958b
- Reveal Formatting / Style Inspector: https://bettersolutions.com/word/styles/reveal-formatting-task-pane.htm
- Panko, R. — *Spreadsheet Errors: What We Know. What We Think We Can Do*: https://arxiv.org/pdf/0802.3457
- Reinhart-Rogoff (Herndon, Ash & Pollin 2013): https://theconversation.com/the-reinhart-rogoff-error-or-how-not-to-excel-at-economics-13646
- Ziemann, Eren & El-Osta (2016). *Gene name errors are widespread*. Genome Biology: https://link.springer.com/article/10.1186/s13059-016-1044-7
- Mayer — principiile coerenței, semnalizării, redundanței (Cambridge Handbook of Multimedia Learning, cap. 12): https://www.cambridge.org/core/books/abs/cambridge-handbook-of-multimedia-learning/principles-for-reducing-extraneous-processing-in-multimedia-learning-coherence-signaling-redundancy-spatial-contiguity-and-temporal-contiguity-principles/CD5B7AE1279A9AB81F8EEBB53DBEC86E
- W3C — WCAG 1.4.3 Contrast (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html

**IT, programare, editare**
- Agans, D. J. (2002). *Debugging: The 9 Indispensable Rules*: https://embeddedartistry.com/blog/2017/09/06/debugging-9-indispensable-rules/ · https://archive.org/details/debugging9indisp0000agan
- Google SRE Book — *Data Integrity*: https://sre.google/sre-book/data-integrity/
- Google eng-practices — *What to look for in a code review*: https://google.github.io/eng-practices/review/reviewer/looking-for.html
- Cushing, C. & Bodner, G. E. (2022). *Reading aloud improves proofreading*. JARMAC 11: https://psycnet.apa.org/record/2022-41858-001
- Borel, B. *The Chicago Guide to Fact-Checking*: https://www.nasw.org/member_article/brooke-borel-chicago-guide-fact-checking-second-edition

**UX**
- NN/g — 10 Usability Heuristics: https://www.nngroup.com/articles/ten-usability-heuristics/
- NN/g — Thinking Aloud: The #1 Usability Tool: https://www.nngroup.com/articles/thinking-aloud-the-1-usability-tool/
- NN/g — Why You Only Need to Test with 5 Users: https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/
- First-click (Bailey & Wolfson; sursă secundară): https://www.userinterviews.com/ux-research-field-guide-chapter/first-click-testing

**Agenți AI**
- Cemri et al. (2025). *Why Do Multi-Agent LLM Systems Fail?* (MAST): https://arxiv.org/abs/2503.13657
- Wang et al. (2025). *Are "Solved Issues" in SWE-bench Really Solved Correctly?*: https://arxiv.org/abs/2503.15223
- METR (2025). *Recent Frontier Models Are Reward Hacking*: https://metr.org/blog/2025-06-05-recent-reward-hacking/
- Huang et al. (2023/ICLR 2024). *Large Language Models Cannot Self-Correct Reasoning Yet*: https://arxiv.org/pdf/2310.01798
- Mirzadeh et al. (2024). *GSM-Symbolic*: https://machinelearning.apple.com/research/gsm-symbolic
- Liu et al. (2023/TACL 2024). *Lost in the Middle*: https://aclanthology.org/2024.tacl-1.9/
- Sharma et al. (2023). *Towards Understanding Sycophancy in Language Models*: https://arxiv.org/abs/2310.13548
- Lou & Sun (2024). *Anchoring Bias in Large Language Models*: https://arxiv.org/abs/2412.06593
- Wang et al. (2024). *LLMs Meet Library Evolution: Deprecated API Usage*: https://arxiv.org/abs/2406.09834
- *Large Language Models as Students Who Think Aloud: Overly Coherent, Verbose, and Confident*: https://arxiv.org/pdf/2602.01015
- *Towards Valid Student Simulation with Large Language Models*: https://arxiv.org/abs/2601.05473
- Anthropic — Best practices for Claude Code: https://code.claude.com/docs/en/best-practices

**Limitele acestui document (spuse deschis)**
- Tabelul 2.1 (laboratorul de TIC) e aproape integral **practică, nu studiu**. Trebuie confirmat de Vasile, care e chiar profesorul din tabel.
- Unele surse le-am văzut doar prin rezumatul motorului de căutare (nu am deschis PDF-ul integral): MAST, SWE-bench, cele două studii despre simularea elevilor, Bailey & Wolfson. Cifrele citate sunt cele din rezumate.
- Am lăsat intenționat deoparte cifre care circulau doar în bloguri (de ex. procente de greșeli găsite la citirea cu voce tare, „dublează riscurile identificate" la pre-mortem).
