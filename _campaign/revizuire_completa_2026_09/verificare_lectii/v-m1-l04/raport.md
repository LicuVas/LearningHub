# Verificarea lecției v-m1-l04

- lecția: `C:\00\Projects\LearningHub\lectii\v\m1-l04\index.html`
- clasa a V-a, lecția 4 din plan: „Structura generală a unui sistem de calcul. Rolul componentelor hardware” (M1, V-U1)
- nivelul din pagină: „Structura generală a unui sistem de calcul. Rolul componentelor hardware” · lectii declarate: [4]
- rulat: 2026-09-27 19:22 · durata: 0.2 min · cost `claude -p`: 1.137 USD (generator 0.185 + cititori 0.952)

## Rezumat

| Treapta | Ce verifică | Rezultat | Blochează |
|---|---|---|---|
| S0 | poarta motorului (test_joc.py) | TRECUT | 0 |
| S1 | identitate exercițiu–verificare | TRECUT | 0 |
| S2 | practică: aplicare/execuție vs. recunoaștere | TRECUT | 0 |
| T0 | oracol_novice (determinist) | TRECUT | 0 |
| T1 | plimbarea (cititori cu carte închisă; rulare refolosită) | PICAT | 2 |

## S0 — poarta motorului (test_joc.py)

**Blochează publicarea:** nimic

- (așteptat) 1 niveluri (obișnuit 5-8)

Ieșirea completă: `s0_test_joc.txt`.

## S1 — identitate exercițiu–verificare

**Blochează publicarea:** nimic

test_joc compară JSON-ul brut (prinde doar copia exactă); S1 compară după normalizare.

## S2 — practică: aplicare/execuție vs. recunoaștere

**Blochează publicarea:** nimic

Aplicare/execuție pe „Încearcă” + atelier (regula 5, blochează sub 50%): **5 din 6 (83%)** · cu „Încă un exercițiu” (doar raportat): 7 din 13 · pe tipuri: classify 4, tf 2, order 2, choice 3, match 1, fotografie 1

| Loc | Tip | Fel | Numărat la regula 5 | Notă |
|---|---|---|---|---|
| P2 Încearcă | classify | aplicare | da | răspunsul e scris dinainte în proporție de 77% |
| P2 Încă un exercițiu 1 | tf | aplicare | nu | răspunsul e scris dinainte în proporție de 40% |
| P3 Încearcă | order | aplicare | da | răspunsul e scris dinainte în proporție de 38% |
| P3 Încă un exercițiu 1 | classify | aplicare | nu | răspunsul e scris dinainte în proporție de 65% |
| P4 Încearcă | choice | aplicare | da | răspunsul e scris dinainte în proporție de 50% |
| P4 Încă un exercițiu 1 | classify | recunoaștere | nu | răspunsul e scris dinainte în proporție de 89% |
| P4 Încă un exercițiu 2 | tf | recunoaștere | nu | răspunsul e scris dinainte în proporție de 50% |
| P5 Încearcă | choice | recunoaștere | da | răspunsul e scris dinainte în proporție de 100% |
| P5 Încă un exercițiu 1 | match | recunoaștere | nu | răspunsul e scris dinainte în proporție de 100% |
| P6 Încearcă | order | aplicare | da | răspunsul e scris dinainte în proporție de 62% |
| P6 Încă un exercițiu 1 | choice | recunoaștere | nu | răspunsul e scris dinainte în proporție de 100% |
| Atelier | fotografie | execuție | da |  |
| Atelier încă unul 1 | classify | recunoaștere | nu | răspunsul e scris dinainte în proporție de 100% |


felul pe conținut (regula 5): execuție = simulator; recunoaștere = răspunsul corect e deja scris într-o propoziție din pașii de până atunci sau din explicațiile de dinainte; aplicare = altfel. Numărul care blochează e pe „Încearcă” + atelier; „Încă un exercițiu” e doar raportat.

## T0 — oracol_novice (determinist)

**Blochează publicarea:** nimic

- 5 texte alternative de poze scoase din verificare (nu sunt instrucțiuni; le găsești în `t0/imagini_alt.txt`)

Glosarul generat (termen → de unde vine): componentelor ← programa lecției: Rolul componentelor hardware ale unui sistem de calcul; hardware ← marcat în pași (<mark>); unitatea centrală ← marcat în pași (<mark>); structura generală ← marcat în pași (<mark>); procesorul ← marcat în pași (<mark>); memoria RAM ← marcat în pași (<mark>); discul ← marcat în pași (<mark>); placa de bază ← marcat în pași (<mark>); sursa de alimentare ← marcat în pași (<mark>); placa video ← marcat în pași (<mark>); dispozitive de intrare ← lecția viitoare 5 („Dispozitive de intrare, de ieșire și de intrare-ieșire”); dispozitive ← lecția viitoare 5 („Dispozitive de intrare, de ieșire și de intrare-ieșire”); dispozitive de ieșire ← lecția viitoare 5 („Dispozitive de intrare, de ieșire și de intrare-ieșire”); dispozitive de intrare-ieșire ← lecția viitoare 5 („Dispozitive de intrare, de ieșire și de intrare-ieșire”); bit ← lecția viitoare 6 („Dispozitive de stocare. Unități de măsură: bit, byte, KB, MB, GB, TB”); byte ← lecția viitoare 6 („Dispozitive de stocare. Unități de măsură: bit, byte, KB, MB, GB, TB”); kilobyte ← lecția viitoare 6 („Dispozitive de stocare. Unități de măsură: bit, byte, KB, MB, GB, TB”); megabyte ← lecția viitoare 6 („Dispozitive de stocare. Unități de măsură: bit, byte, KB, MB, GB, TB”); gigabyte ← lecția viitoare 6 („Dispozitive de stocare. Unități de măsură: bit, byte, KB, MB, GB, TB”); terabyte ← lecția viitoare 6 („Dispozitive de stocare. Unități de măsură: bit, byte, KB, MB, GB, TB”); servicii ale rețelei Internet ← lecția viitoare 13 („Servicii ale rețelei Internet. La ce folosește fiecare”); drepturi de autor ← lecția viitoare 15 („Salvarea informațiilor de pe Internet. Drepturile de autor”); siguranța pe Internet ← lecția viitoare 16 („Siguranța pe Internet: pericole, reguli, credibilitatea surselor”); editor ← lecția viitoare 18 („Rolul unui editor grafic. Interfața. Creare, deschidere, salvare”); selectare ← lecția viitoare 19 („Selectare, copiere, mutare, ștergere. Instrumente de desenare”); copiere ← lecția viitoare 19 („Selectare, copiere, mutare, ștergere. Instrumente de desenare”); mutare ← lecția viitoare 19 („Selectare, copiere, mutare, ștergere. Instrumente de desenare”); ștergere ← lecția viitoare 19 („Selectare, copiere, mutare, ștergere. Instrumente de desenare”); redimensionarea ← lecția viitoare 20 („Redimensionare, trunchiere, rotație, panoramare”); stiluri de umplere ← lecția viitoare 21 („Culori și stiluri de umplere. Culori personalizate”); inserarea și formatarea textului ← lecția viitoare 22 („Inserarea și formatarea textului. Realizez o felicitare / un afiș”); inserarea ← lecția viitoare 22 („Inserarea și formatarea textului. Realizez o felicitare / un afiș”); noțiunea de algoritm ← lecția viitoare 24 („Ce este un algoritm. Algoritmi din viața de zi cu zi”); algoritmilor ← lecția viitoare 24 („Ce este un algoritm. Algoritmi din viața de zi cu zi”); constante și variabile ← lecția viitoare 26 („Datele: de intrare, de ieșire, de manevră. Constante și variabile”); constante ← lecția viitoare 26 („Datele: de intrare, de ieșire, de manevră. Constante și variabile”); operatori aritmetici ← lecția viitoare 27 („Expresii: operatori aritmetici, relaționali, logici. Evaluarea expresiilor”); relaționali ← lecția viitoare 27 („Expresii: operatori aritmetici, relaționali, logici. Evaluarea expresiilor”); logici ← lecția viitoare 27 („Expresii: operatori aritmetici, relaționali, logici. Evaluarea expresiilor”); evaluarea expresiilor ← lecția viitoare 27 („Expresii: operatori aritmetici, relaționali, logici. Evaluarea expresiilor”); expresii ← lecția viitoare 27 („Expresii: operatori aritmetici, relaționali, logici. Evaluarea expresiilor”); liniară ← lecția viitoare 28 („Structura secvențială (liniară). Descriere în limbaj natural”); secvențială ← lecția viitoare 28 („Structura secvențială (liniară). Descriere în limbaj natural”); decizională ← lecția viitoare 29 („Structura alternativă (decizia). Urmăresc algoritmul pas cu pas”); alternativă ← lecția viitoare 29 („Structura alternativă (decizia). Urmăresc algoritmul pas cu pas”); octet ← lecția viitoare 6 („Dispozitive de stocare. Unități de măsură: bit, byte, KB, MB, GB, TB”; definiție în materialele cursului)

Programa legată de lecție: Structura generală a unui sistem de calcul | Rolul componentelor hardware ale unui sistem de calcul

Situl .md și configul: `t0/` · ieșirea completă: `t0_oracol.txt`.

## T1 — plimbarea (cititori cu carte închisă; rulare refolosită)

**Blochează publicarea:** 2
- S-4 [Pasul 3] NEFACUT: Lecția nu explică suficient pentru a aplica drumul datelor la redarea de muzică: (1) Nu spune cum se citesc datele melodiei de pe disc — discul e descris doar ca memorie de salvare, nu ca sursă de date pentru prelucrare; (2) Nu menționează dispozitiv de ieșire pentru sunet (difuzor, căști) — spune doar "iese: de exemplu, apare pe ecran". — citat: «intră: de exemplu, apeși o tastă; sunt prelucrate: calculatorul lucrează cu ele, după program; sunt memorate: calculatorul le ține minte cât lucrează cu ele. Ce salvezi rămâne ținut minte și după opr…»
- S-7 [Pasul 6] NEFACUT: Textul descrie exact ce face procesorul cu litera A („procesorul pune litera A în text"), dar nu spune ce face procesorul atunci când apeși Enter. De asemenea, nu clarifica ce se memorează în RAM pentru Enter (doar textul, sau și noua poziție a cursorului și linia goală adăugată?). — citat: «procesorul pune litera A în text. Textul stă în memoria RAM»

- avertisment: parcurgere căzută DOAR pe simulator/laborator (cititorul știe ce să încerce și înțelege efectul; notă pentru J/R, nu blochează): Atelier: Găsește piesele într-un calculator desfăcut - pune etichete …; Acum în aplicația adevărată - șapte pași: arată piesele, ascultă vent…; Verificare Întrebarea 4: fotografie cu calculator desfăcut, pune 3 et…
- avertisment: teach-back LIPSA la un singur cititor din 1 (neconfirmat, nu blochează): «Elevul poate deosebi hardware de software, ca parte a folosirii eficiente și în siguranță a dispozitivelor de calcul.»
- avertisment: teach-back LIPSA la un singur cititor din 1 (neconfirmat, nu blochează): «Elevul poate identifica, pe un calculator real sau desfăcut, componentele hardware studiate, respectând regulile de siguranță din laborator…»
- avertisment: teach-back LIPSA la un singur cititor din 1 (neconfirmat, nu blochează): «Elevul poate explica, pentru o acțiune simplă (de exemplu apăsarea unei taste), care piese hardware intervin și în ce ordine, legând struct…»
- numărul kitului e 8; numărul liniei e 2 (diferența e explicată în avertismente și în „blocaje în antet”); blocaje citate doar din antet/„La ce folosește”: «componentelor» — «Rolul componentelor hardware»; «structura generală» — «Structura generală a unui sistem de calcul. Rolul componentelor hardware»

Rulări: seed 7 → 5 (0.9521 USD)
Canar: «La un laptop, aceste piese stau sub tastatură.» → «La un laptop, aceste piese stau deasupra tastaturii.» · momeală: «tabel pivot dinamic»

| Sarcină | Țintă | Verdict | Răspuns / motiv |
|---|---|---|---|
| CANAR-1 | (canar/momeală) | FACUT | deasupra tastaturii |
| MOMEALA-1 | (canar/momeală) | NU_GASESC | Expresia "tabel pivot dinamic" nu apare în textul lecției. |
| S-1 | toată lecția | NEFACUT | Parcurgând lecția pas cu pas ca elev, am găsit trei blocaje majore care mă opresc să complet toți pașii: Atelier și Întrebarea 4 din Verificare necesită interf… |
| S-2 | toată lecția | FACUT | Un calculator este compus din piese numite hardware. Calculatorul are patru componente principale: monitorul, tastatura, mouse-ul și unitatea centrală. Datele … |
| S-3 | Pasul 2 | FACUT | Monitorul: Hardware (e o piesă). Jocul de puzzle: Program (nu e o piesă). Cablul tastaturii: Hardware (e o piesă). Aplicația Calculator: Program (nu e o piesă). |
| S-4 | Pasul 3 | NEFACUT | Lecția nu explică suficient pentru a aplica drumul datelor la redarea de muzică: (1) Nu spune cum se citesc datele melodiei de pe disc — discul e descris doar … |
| S-5 | Pasul 4 | FACUT | Videoclipul editat se pierde. Timp de 30 de minute, videoclipul editat stă în memoria RAM. Când calculatorul se oprește, memoria RAM se golește și videoclipul … |
| S-6 | Pasul 5 | FACUT | Pe ecran nu mai apare imaginea. Fiindcă placa video pregătește imaginea pe care o vezi pe monitor și o trimite la monitor, și dacă se strică, aceste operații n… |
| S-7 | Pasul 6 | NEFACUT | Textul descrie exact ce face procesorul cu litera A („procesorul pune litera A în text"), dar nu spune ce face procesorul atunci când apeși Enter. De asemenea,… |
| S-8 | Atelier | FACUT | 1. Apeși eticheta „Memoria RAM" de deasupra fotografiei. 2. Atingi pe fotografie piesele lungi și subțiri. 3. Apeși „Verifică etichetele" și testul pentru Memo… |
| S-9 | Acum în aplicația adevărată | FACUT | În ordine, pentru litera M din secțiunea 'Acum în aplicația adevărată': (1) Stai pe scaun, nu desfaci nimic. (2) Arată cu degetul monitorul, tastatura, mouse-u… |

Sarcinile, obiectivele (din programă), concepțiile greșite și profilul: `t1/sit/plimbare/`; verdictele: `t1/verdicte_seed*/`.

## Ce NU verifică linia asta

- R (aplicația reală): `afirmatii.json` → `python arbitru_office.py <afirmatii.json> --aplicatie excel|word|powerpoint`, rulat de dirijor.
- J (judecătorul Opus pe regulile 1-9) și capturile (`capturi_lipsa.json`, regula 4) — separat.

TREPTE: S0 TRECUT · S1 TRECUT · S2 TRECUT · T0 TRECUT · T1 PICAT 2
BLOCHEAZĂ PUBLICAREA: 2 (raport: C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\verificare_lectii\v-m1-l04\raport.md)
2
