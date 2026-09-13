# Planul reparației — cls5 / m1-sisteme / lectia2-hardware (13.09.2026)

Surse: `F_evaluari/cls5/lectia2-hardware/05_evaluare.md`, `04_mediu.md` (log.json NU există în folder), `O_orb/lectia2-hardware/judecata.json` (P1–P23 + „ce au ratat amândouă”), `P_hibrid/lectia2-hardware/semnalari.json` (S01–S20), `M_rezultat.csv` (întrebarea PSU de la pasul 1 are scor maxim la pasul 5), `K_rezultat.csv` (toate 3 = ok). `Q_verdict_blocante.json` nu are rânduri pentru lecție. Lecția nu folosește Office. (Corectat în runda 2: glosarul UI CONȚINE „Task Manager | Manager de activități” și „Performance | Performanță”, r.195/199 — aplicate cu diacriticele din glosar.)

| id | semnalare | decizie | motiv / cum |
|:--|:--|:--|:--|
| P10 / S07 | „3 GHz = 3 miliarde de operații pe secundă” (text + tabel) | **aplic** | fond; GHz = bătăile ceasului; sursa `surse/ghz_sursa.txt` (Megahertz myth) |
| R-A1 (ratat amândouă) | „4 nuclee = 4 procese in paralel” | **aplic** | fond; reformulat „pana la 4 sarcini lucrate in acelasi timp” |
| R-A2 (ratat amândouă) | GPU „calculeaza si afiseaza tot ce vezi pe ecran” / tabel „Proceseaza si afiseaza grafica” | **aplic** | fond; afișarea e a monitorului (ieșire), GPU pregătește imaginea |
| P6 / S06 | toate 7 indiciile încep cu „Corect!” deși apar doar la răspuns greșit | **aplic** | întrebări: „Corect!” → „Raspunsul corect: …”; la touchscreen distractorul „Stocare” lungit ca varianta corectă să nu iasă din R1.1 |
| P5 / S02 / M | întrebarea PSU pusă la pasul 1, predată la pasul 5; titlul pasului 1 promite PSU | **aplic** | regula 6: întrebarea mutată în `data-quiz` al atomului 5; titlul atomului 1 devine „1. Procesorul (CPU)” |
| P1 (parțial) | „Uita-te la imaginile de mai jos” — nu există imagini | **aplic (doar fraza falsă)** | trimiterea la imagini inexistente înlocuită cu „o imagine cu interiorul unui calculator (aratata de profesor sau …)”; adăugarea imaginilor/planșelor = **sar** (structură) |
| P3 / P4 / S12 | 5 categorii la start vs 4; șablon și pasul 8 cu INPUT/OUTPUT | **aplic** | provocarea, pasul 8, șablonul și Indiciul 2 folosesc cele 4 categorii în română (engleza în paranteză) |
| S20 | bonus: intrare-ieșire „in acelasi timp” | **aplic** | multifuncționala nu tipărește și scanează simultan; scos „in acelasi timp” |
| P16 / S13 | modemul contrazice regula „tu / calculatorul” | **aplic** | frază: datele circulă între calculatorul tău și alte calculatoare |
| P12 / S14 (parțial) | CPU = profesor, dar la pasul 5 CPU = „clasa”; socket = „fotoliul directorului” | **aplic** | aliniat la CPU = profesorul; dulap/caiet pentru stocare = **sar** (ambele spun „păstrează”, nu induc greșeală) |
| S15 | „fisierele din RAM” (cerință + rezolvare Ex.1) | **aplic** | „datele din RAM (de exemplu, un text nesalvat)” |
| P9 / S09 | rezolvarea Ex.2 fără capacitate | **aplic** | rândul „Rol” înlocuit cu „Capacitate” din tabelul atomului 2 (4–32 GB / 256 GB – 2 TB) |
| S10 | Ex.3: „capacitatea in GB … NU au fost predate” contrazice tabelul | **aplic** | nota rescrisă: GB/TB se învață mai târziu, compară „mica/mare”; prețul nu e predat |
| P8 / S17 | fluxul din cheia Ex.3 „intrare, CPU, RAM, GPU sau stocare” | **aplic** | intrare → RAM ⇄ CPU → placa video → monitor; salvarea → SSD/HDD |
| S16 | Ex.3 desen „in Paint” (Paint la ora 18) | **aplic** | „pe hartie sau in caiet” |
| P18 | șablonul fără loc de scris | **aplic** | pasul 7: notează pe caiet, după șablonul de mai jos |
| P19 / S18 (parțial) | „Task Manager”, „tab-ul Performance” în engleză | **aplic** | nume Windows în română din sursa Microsoft ro-RO (`surse/tm_ro.txt`: „Manager de activități”, „Performanță”), scrise fără diacritice ca restul fișierului; întrebarea „RAM plin” fără răspuns = **sar** (e întrebare de gândire, extensie opțională) |
| P2 / S03 | activitatea de start depinde de Google + termeni englezi | **sar** | a înlocui căutarea cu planșă/piese reale = variantă nouă de activitate, decizia profesorului |
| P7 / S04 | lipsește structura generală / fluxul datelor (ora 4) | **sar** | pas nou = structură (profesorul decide); cheia Ex.3 a primit totuși fluxul corect |
| P21 | atomul 4 repetă lecția 1 și ia tema orei 5–6 | **sar** | ce fișier ține ora 5 = decizie de plan |
| P20 / S01 | nu încape în 50 min | **sar** | spargerea lecției = structură |
| P11 | termeni tehnici (Cache, PCIe, SATA, VRAM, 500W–750W) | **sar** | tăierea de conținut = decizie de dozare a profesorului; nu sunt greșeli de fond |
| P13 | pictograme identice (imprimantă/scanner, dischetă) | **sar** | design; nu există emoji potrivit pentru scanner/HDD, nu schimbăm iconografia pe bucăți |
| P14 / S08 | fără diacritice | **sar** | val separat (convenția 5) |
| P15 | chestionarele nu verifică stocarea | **sar** | întrebare nouă = test nou (profesor) |
| P17 | HTML duplicat `.try-challenge` / două h2 | **sar** | structura HTML/CSS nu se atinge în valul acesta |
| P22 | strat pentru profesor, niveluri minim/standard/performanta | **sar** | barem/strat nou = structură |
| S05 | răspunsul colegului rămâne în browser | **sar** | rezolvat deja în motor (butonul „Sunt alt elev”, 13.09) |
| S11 | „Raspunde corect la intrebarile anterioare” | **sar** | textul e în motorul JS (`atomic-learning.js`), nu în lecție |
| S19 | legătura spre „Lectia 3 — Software” vs ordinea din plan | **sar** | ordinea lecțiilor în site = decizie de plan/index |
| P23 | stiluri inline | **nu se aplică** | verdict „fals” |
