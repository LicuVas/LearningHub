# Contract — V/28 și V/29 (seara/noaptea 02→03.11.2026)

**Cererea, verbatim (02.11):** 19:10 „mai lucrezi ?” → oferta mea (V/28 și V/29, fără nicio decizie de la el) → 19:21 „daca le faci in aceasta sesiune - nu consuma mult - datorita contextului de peste 10 ore?” → 19:36 „la nota de predare si continuarea intr-o sesiune noua .. o faci automat, sper. Mai ales la runde de noapte cand altfel ai ramane blocat.”

**Proba realității:** Vasile deschide V/28 (16.04.2027) și V/29 (23.04.2027) la clasa a V-a; elevii le parcurg singuri, pe telefon sau la calculator, fără profesor lângă ei. Profesorul le găsește la locul lor în /lectii/v/, legate în plan.

| R | Ce | Cine verifică | Gata = |
|---|---|---|---|
| R1 | V/28 și V/29 LIVE, publicate doar prin `dirijor\publica_lectie.py` | curl pe marcaje + `stare.py --modul M4` | 2/2 live · M4 publicat 17 |
| R2 | 0 GRAV / 0 MAJOR la ultima judecată opus; orice schimbare de după ea e scrisă în `_verificare\judecatorN.md` sau are judecată nouă (lecția T1 din 02.11) | `judecatorN.json` + data față de commit | 2/2 |
| R3 | Dirijorul nu cară peste ~250k de context: predă singur ștafeta (`tools\predare.py`) | `predare.py stare` + `data\paza_noapte\predari.jsonl` | nicio sesiune-dirijor peste ~300k |
| R4 | Gărzile: nimic pe ecranul vizibil; Paint / Calculator / Magazin / Chrome / Edge reali nu se pornesc; panoul „nu e în catalog” nu crește (la start, 19:46: 2 elevi reali de azi, nu din probe); date personale 0 | `activitate.py lista \| grep -c` · `learninghub_date_personale.py` | 2 → 2 și 0 |
| R5 | Bugetul: săptămâna a început la 1 %; lucrarea asta ≤ 15 % | `consum.py` la fiecare predare și la final | ≤ 16 % pe 7 zile |
| R6 | Raport `DIMINEATA_03_11.md` (FĂCUT / NEFĂCUT / NESIGUR) + jurnalul + fișa de memorie + T1 (reprompt) peste raport | T1 | verdict ÎNCHIS sau ce rămâne spus cinstit |

**Decizii luate de dirijor (le vede dimineață):** V/28 și V/29 = limbaj natural, fără aplicație de programare (Scratch vine mai târziu, la a V-a); cei doi autori pornesc DEODATĂ, cu fișiere de graniță (ca V/24 + V/25 în 01.11), ca lanțul să se termine până dimineață; laboratorul = gesturi reale în aplicații deja predate; ce nu se poate proba noaptea → `nesigur`.

**Ținta de timp:** ambele LIVE până pe la 06:00 (03.11).
