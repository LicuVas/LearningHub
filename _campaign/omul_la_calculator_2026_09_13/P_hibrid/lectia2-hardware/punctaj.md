# Punctaj — lectia2-hardware (hibrid v3 vs v2 Y vs control X)

Adevăr: 25 probleme (22 din judecată cu verdict „adevarat” + 3 ratate de amândouă); 10 importante/blocante; 8 schimbă ora.

| Adevăr | Gravitate | Schimbă ora | X | Y | Hibrid | Semnalare |
|---|---|---|---|---|---|---|
| P1 — Lecția nu are nicio imagine, deși provocarea de start spune „Uita-te la imaginile de mai j | important | da | da | da | da | S03 |
| P2 — Activitatea de start depinde de o căutare liberă pe Google cu termeni în engleză (și Wikip | important | da | da | da | da | S03 |
| P3 — Trei clasificări diferite în aceeași lecție: 5 categorii la start (inclusiv „componenta de | important | da | da | nu | da | S12 |
| P4 — Șablonul de notițe și pasul 8 folosesc INPUT/OUTPUT/INPUT-OUTPUT în loc de termenii progra | minor | nu | da | da | da | S12 |
| P5 — Atomul 1 are în titlu PSU și întreabă despre sursa de alimentare, dar conținutul atomului  | minor | nu | da | da | da | S02 |
| P6 — Indiciile (afișate DOAR la răspuns greșit) încep cu „Corect!”, imediat sub „Incorect.”. | important | nu | da | da | da | S06 |
| P7 — Obiectivul „cum colaborează componentele” (și „structura generală a unui sistem de calcul” | important | da | da | nu | da | S04 |
| P8 — Rezolvarea Ex. 3 dă fluxul liniar „intrare, apoi CPU, apoi RAM, apoi GPU sau stocare”. | minor | nu | da | nu | da | S17 |
| P9 — Rezolvarea Ex. 2 nu conține „capacitatea” cerută de enunț (pune „Rol” în loc). | minor | nu | da | nu | da | S09 |
| P10 — Lecția predă că 3 GHz = 3 miliarde de operații pe secundă (GHz = frecvența ceasului, nu op | important | da | da | da | da | S07 |
| P11 — Prea mulți termeni tehnici nepotriviți pentru clasa a V-a (Cache 8 MB, PCIe, SATA, socket, | important | da | da | nu | nu | — |
| P12 — Analogiile se contrazic: CPU = profesor / director / clasă; stocarea = dulap / caiet. | minor | nu | da | nu | da | S14 |
| P13 — Pictograme greșite: scanner/imprimantă/MFP cu aceeași pictogramă de imprimantă, monitorul  | minor | nu | da | nu | nu | — |
| P14 — Textul românesc e integral fără diacritice, deși specificația le cere în conținut. | important | nu | da | da | da | S08 |
| P15 — Chestionarele nu verifică stocarea (HDD vs SSD, stick USB); „prea puține” întrebări. | minor | nu | da | nu | nu | — |
| P16 — „Modem / Placa de retea” ca intrare-ieșire contrazice regula predată („TU trimiți / calcul | minor | nu | da | nu | da | S13 |
| P17 — HTML duplicat: .try-challenge în .try-challenge și două h2 consecutive. | minor | nu | da | nu | nu | — |
| P18 — Butonul „Copiaza” al șablonului nu spune unde se lipește textul. | minor | nu | da | nu | nu | — |
| P19 — „Vrei mai mult?”: „tab-ul Performance” se numește „Performanță” pe Windows în română; (X)  | minor | nu | da | da | da | S18 |
| P20 — Lecția (5 atomi densi + 3 exerciții, ~3.300 cuvinte) nu încape într-o oră de 50 de minute  | important | da | da | da | da | S01 |
| P21 — Atomul 4 (intrare/ieșire/stocare) repetă dispozitivele din lecția 1 și ia tema orei 5 (09. | important | da | nu | da | da | S04 |
| P22 — Lipsește stratul pentru profesor (durată, variantă fără internet, barem); nivelurile exerc | minor | nu | da | nu | nu | — |
| R1 — Rezolvarea Ex. 3 (l.604) spune „capacitatea in GB sau pretul componentelor NU au fost pred | minor | nu | nu | nu | da | S10 |
| R2 — L.501: GPU-ul „calculeaza si afiseaza tot ce vezi pe ecran” — afișarea e a monitorului (di | minor | nu | nu | nu | nu | — |
| R3 — L.182: „4 nuclee = 4 procese in paralel” — simplificare inexactă (un nucleu poate rula mai | minor | nu | nu | nu | nu | — |

| Recall | Total | Important+blocant | Schimbă ora |
|---|---|---|---|
| Hibrid v3 | 0.68 | 0.90 | 0.88 |
| v2 (Y) | 0.40 | 0.70 | 0.63 |
| Control (X) | 0.84 | 0.90 | 0.88 |

## Semnalări extra ale hibridului (verificate independent)

| Id | Verdict | Gravitate |
|---|---|---|
| S05 | adevarat_nou | important |
| S11 | adevarat_nou | minor |
| S15 | adevarat_nou | minor |
| S16 | adevarat_nou | minor |
| S19 | adevarat_nou | minor |
| S20 | adevarat_nou | minor |

Hibrid: 0 false, 6 adevărate noi.

## Concluzie

- Hibridul prinde 68% din total și 88% din problemele care schimbă ora — mult peste v2 (40% / 63%), la egalitate cu controlul X pe cele importante și pe cele care schimbă ora.
- Pe total rămâne sub X (0.68 vs 0.84): ratează mai ales mărunțișuri (pictograme, HTML duplicat, buton Copiaza, strat profesor, 2 din 3 ratate de amândouă) și o problemă importantă: densitatea de termeni tehnici (P11).
- Zero semnalări false și 6 adevărate noi, dintre care una importantă (S05: pe calculatorul comun, elevul următor vede răspunsurile colegului, fără buton de reluare) — singurul câștig pe care nici X, nici Y, nici judecătorul nu-l aveau.
