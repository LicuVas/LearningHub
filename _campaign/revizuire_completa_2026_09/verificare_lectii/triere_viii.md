# Trierea semnalărilor — VIII nr. 4, reparată (27.09.2026)

Linia `verifica_lectie.py` a blocat lecția „Adresa de celulă. Selectare, copiere, mutare, ștergere” cu 5 semnalări (T0: 1, T1: 4). Am deschis fiecare semnalare în pagina de acum și în codul liniei.
**REAL** = un copil ar păți asta; **alarmă falsă** = limita liniei, nu defect al lecției. Citatele au fost verificate automat în sursa lor.

## Pe scurt

| Semnalări | Reale | Alarme false |
|---|---|---|
| 5 (T0: 1, T1: 4) | 0 | 5 |

Versiunea: pagina a fost scrisă la 16:49, iar linia a rulat la 17:09, deci raportul e pe versiunea de acum (spre deosebire de V). S2 trece (21 din 25); n-am renumărat-o, pentru că nu blochează.

Niciuna nu cere o reparație în lecție. Un singur retuș opțional: „Ai nevoie de” scris ca listă.

### VIII-T0-densitate · T0 · **alarmă falsă**

- Semnalarea: [text prea dens pentru începători] 50% propoziții peste 25 cuvinte (prag 30%)
- De ce: Oracolul a măsurat doar antetul (50_antet.md): 6 „propoziții”, dintre care 3 peste 25 de cuvinte (30, 37 și 27). Cea de 37 e un ciot: oracolul a tăiat „Ai nevoie de” la punctul din interiorul titlului lecției 2, între ghilimele. Lecția propriu-zisă (51_lectia.md) trece: 334 de propoziții, media 14,4 cuvinte, 11% peste 25 (am refăcut calculul cu aceeași formulă). Regula 2 privește textul pașilor.
- Dovada:
  - `t0_oracol.txt (VIII)`: «text prea dens pentru începători @ 50_antet.md — 50% propoziții peste 25 cuvinte (prag 30%)»
  - `index.html (VIII, acum)`: «Interfața aplicației de calcul tabelar. Structura unui registru»
  - `oracol_novice.py`: «propozitii = [s for s in re.split(r"(?<=[.!?])\s+|\n{2,}", text)»
- Reparația în lecție: opțional (nu blochează): „Ai nevoie de” scris ca listă scurtă, câte un rând pe lecție, fără paranteza lungă din dreptul lecției 2.
- Reparația în linie: verifica_lectie.py construieste_t0 (l.281-283) + oracol_novice.py verif_densitate (l.807): densitatea se măsoară pe antet + lecție împreună sau cere un minim de propoziții pe fișier (de ex. ≥ 10); iar la tăierea în propoziții, punctul dintre ghilimelele „…” nu încheie propoziția.

### VIII-T1-selectarea · T1 · **alarmă falsă**

- Semnalarea: blocaj «selectarea» (×1): termen folosit înainte de explicație — «Cu **selectarea**, **copierea**, **mutarea** și **ștergerea** termină în câteva secunde. Azi le înveți pe toate, pe rând.»
- De ce: Propoziția e din pasul 1, „La ce folosește”, care după standard nu cere nicio acțiune. Ea doar anunță ce urmează („Azi le înveți pe toate, pe rând.”), iar fiecare operație are pasul ei, cu explicație. Cuvintele sunt și predate în anii trecuți (clasa a V-a, lecția 19; a VI-a, lecția 5; a VII-a, lecția 5), deci elevul de a VIII-a le știe. Cititorul le-a luat drept necunoscute pentru că profilul primit de la linie nu-i spunea asta. Și-a terminat sarcina (S-9 FACUT). Linia a numărat patru blocaje dintr-o singură propoziție a unui singur cititor.
- Dovada:
  - `index.html (VIII, acum)`: «termină în câteva secunde»
  - `index.html (VIII, acum)`: «Azi le înveți pe toate, pe rând.»
  - `index.html (VIII, acum)`: «Selectezi o celulă sau o zonă»
  - `t0/01_clasa_V.md (VIII)`: «## Lecția 19: Selectare, copiere, mutare, ștergere. Instrumente de desenare»
  - `05_STANDARD_LECTIE.md`: «(fără acțiuni, o imagine din viața reală)»
  - `raport.md (VIII)`: «| S-9 | toată lecția, de la Pasul 1 la Verificare | FACUT |»
  - `t1/sit/plimbare/profil-cititor.md (VIII)`: «din clasa a VII-a: Tehnoredactare: editorul de texte»
  - `verifica_lectie.py`: «unit = [u["titlu"] for u in un.get(c, {}).get("unitati", [])»
- Reparația în lecție: nimic.
- Reparația în linie: (1) verifica_lectie.py profil_cititor (l.382-384 și l.389): clasele anterioare apar doar cu numele unităților („din clasa a VII-a: Tehnoredactare: editorul de texte”), iar termenii lor nu intră la „știe”; cititorul a primit deci „copierea”, „mutarea” etc. ca pe cuvinte străine, deși standardul spune că elevul ȘTIE „conținutul planului din clasele anterioare”. Reparația: pentru clasele anterioare, listează titlurile lecțiilor și conținuturile programei, iar termenii lor se adaugă la `stiute`. (2) verifica_lectie.py _t1_detalii (l.650-661): excepția „citat doar din antet” să cuprindă și pasul „La ce folosește”, care după standard e fără acțiuni. (3) Tot acolo: blocajele citate din aceeași propoziție, de la același cititor, se numără o dată, iar cele dintr-o sarcină FACUT devin avertisment.

### VIII-T1-copierea · T1 · **alarmă falsă**

- Semnalarea: blocaj «copierea» (×1): termen folosit înainte de explicație — «Cu **selectarea**, **copierea**, **mutarea** și **ștergerea** termină în câteva secunde. Azi le înveți pe toate, pe rând.»
- De ce: Propoziția e din pasul 1, „La ce folosește”, care după standard nu cere nicio acțiune. Ea doar anunță ce urmează („Azi le înveți pe toate, pe rând.”), iar fiecare operație are pasul ei, cu explicație. Cuvintele sunt și predate în anii trecuți (clasa a V-a, lecția 19; a VI-a, lecția 5; a VII-a, lecția 5), deci elevul de a VIII-a le știe. Cititorul le-a luat drept necunoscute pentru că profilul primit de la linie nu-i spunea asta. Și-a terminat sarcina (S-9 FACUT). Linia a numărat patru blocaje dintr-o singură propoziție a unui singur cititor.
- Dovada:
  - `index.html (VIII, acum)`: «termină în câteva secunde»
  - `index.html (VIII, acum)`: «Azi le înveți pe toate, pe rând.»
  - `index.html (VIII, acum)`: «Copierea: Copiere (Copy), apoi Lipire (Paste)»
  - `t0/03_clasa_VII.md (VIII)`: «## Lecția 5: Operații de editare: copiere, mutare, ștergere»
  - `05_STANDARD_LECTIE.md`: «(fără acțiuni, o imagine din viața reală)»
  - `raport.md (VIII)`: «| S-9 | toată lecția, de la Pasul 1 la Verificare | FACUT |»
  - `t1/sit/plimbare/profil-cititor.md (VIII)`: «din clasa a VII-a: Tehnoredactare: editorul de texte»
  - `verifica_lectie.py`: «unit = [u["titlu"] for u in un.get(c, {}).get("unitati", [])»
- Reparația în lecție: nimic.
- Reparația în linie: (1) verifica_lectie.py profil_cititor (l.382-384 și l.389): clasele anterioare apar doar cu numele unităților („din clasa a VII-a: Tehnoredactare: editorul de texte”), iar termenii lor nu intră la „știe”; cititorul a primit deci „copierea”, „mutarea” etc. ca pe cuvinte străine, deși standardul spune că elevul ȘTIE „conținutul planului din clasele anterioare”. Reparația: pentru clasele anterioare, listează titlurile lecțiilor și conținuturile programei, iar termenii lor se adaugă la `stiute`. (2) verifica_lectie.py _t1_detalii (l.650-661): excepția „citat doar din antet” să cuprindă și pasul „La ce folosește”, care după standard e fără acțiuni. (3) Tot acolo: blocajele citate din aceeași propoziție, de la același cititor, se numără o dată, iar cele dintr-o sarcină FACUT devin avertisment.

### VIII-T1-mutarea · T1 · **alarmă falsă**

- Semnalarea: blocaj «mutarea» (×1): termen folosit înainte de explicație — «Cu **selectarea**, **copierea**, **mutarea** și **ștergerea** termină în câteva secunde. Azi le înveți pe toate, pe rând.»
- De ce: Propoziția e din pasul 1, „La ce folosește”, care după standard nu cere nicio acțiune. Ea doar anunță ce urmează („Azi le înveți pe toate, pe rând.”), iar fiecare operație are pasul ei, cu explicație. Cuvintele sunt și predate în anii trecuți (clasa a V-a, lecția 19; a VI-a, lecția 5; a VII-a, lecția 5), deci elevul de a VIII-a le știe. Cititorul le-a luat drept necunoscute pentru că profilul primit de la linie nu-i spunea asta. Și-a terminat sarcina (S-9 FACUT). Linia a numărat patru blocaje dintr-o singură propoziție a unui singur cititor.
- Dovada:
  - `index.html (VIII, acum)`: «termină în câteva secunde»
  - `index.html (VIII, acum)`: «Azi le înveți pe toate, pe rând.»
  - `index.html (VIII, acum)`: «Mutarea: Decupare (Cut), apoi Lipire (Paste)»
  - `t0/03_clasa_VII.md (VIII)`: «## Lecția 5: Operații de editare: copiere, mutare, ștergere»
  - `05_STANDARD_LECTIE.md`: «(fără acțiuni, o imagine din viața reală)»
  - `raport.md (VIII)`: «| S-9 | toată lecția, de la Pasul 1 la Verificare | FACUT |»
  - `t1/sit/plimbare/profil-cititor.md (VIII)`: «din clasa a VII-a: Tehnoredactare: editorul de texte»
  - `verifica_lectie.py`: «unit = [u["titlu"] for u in un.get(c, {}).get("unitati", [])»
- Reparația în lecție: nimic.
- Reparația în linie: (1) verifica_lectie.py profil_cititor (l.382-384 și l.389): clasele anterioare apar doar cu numele unităților („din clasa a VII-a: Tehnoredactare: editorul de texte”), iar termenii lor nu intră la „știe”; cititorul a primit deci „copierea”, „mutarea” etc. ca pe cuvinte străine, deși standardul spune că elevul ȘTIE „conținutul planului din clasele anterioare”. Reparația: pentru clasele anterioare, listează titlurile lecțiilor și conținuturile programei, iar termenii lor se adaugă la `stiute`. (2) verifica_lectie.py _t1_detalii (l.650-661): excepția „citat doar din antet” să cuprindă și pasul „La ce folosește”, care după standard e fără acțiuni. (3) Tot acolo: blocajele citate din aceeași propoziție, de la același cititor, se numără o dată, iar cele dintr-o sarcină FACUT devin avertisment.

### VIII-T1-ștergerea · T1 · **alarmă falsă**

- Semnalarea: blocaj «ștergerea» (×1): termen folosit înainte de explicație — «Cu **selectarea**, **copierea**, **mutarea** și **ștergerea** termină în câteva secunde. Azi le înveți pe toate, pe rând.»
- De ce: Propoziția e din pasul 1, „La ce folosește”, care după standard nu cere nicio acțiune. Ea doar anunță ce urmează („Azi le înveți pe toate, pe rând.”), iar fiecare operație are pasul ei, cu explicație. Cuvintele sunt și predate în anii trecuți (clasa a V-a, lecția 19; a VI-a, lecția 5; a VII-a, lecția 5), deci elevul de a VIII-a le știe. Cititorul le-a luat drept necunoscute pentru că profilul primit de la linie nu-i spunea asta. Și-a terminat sarcina (S-9 FACUT). Linia a numărat patru blocaje dintr-o singură propoziție a unui singur cititor.
- Dovada:
  - `index.html (VIII, acum)`: «termină în câteva secunde»
  - `index.html (VIII, acum)`: «Azi le înveți pe toate, pe rând.»
  - `index.html (VIII, acum)`: «Golești celule și anulezi o greșeală»
  - `index.html (VIII, acum)`: «Scoți un rând sau o coloană din tabel»
  - `t0/02_clasa_VI.md (VIII)`: «## Lecția 5: Editarea prezentării: inserare, copiere, mutare, ștergere»
  - `05_STANDARD_LECTIE.md`: «(fără acțiuni, o imagine din viața reală)»
  - `raport.md (VIII)`: «| S-9 | toată lecția, de la Pasul 1 la Verificare | FACUT |»
  - `t1/sit/plimbare/profil-cititor.md (VIII)`: «din clasa a VII-a: Tehnoredactare: editorul de texte»
  - `verifica_lectie.py`: «unit = [u["titlu"] for u in un.get(c, {}).get("unitati", [])»
- Reparația în lecție: nimic.
- Reparația în linie: (1) verifica_lectie.py profil_cititor (l.382-384 și l.389): clasele anterioare apar doar cu numele unităților („din clasa a VII-a: Tehnoredactare: editorul de texte”), iar termenii lor nu intră la „știe”; cititorul a primit deci „copierea”, „mutarea” etc. ca pe cuvinte străine, deși standardul spune că elevul ȘTIE „conținutul planului din clasele anterioare”. Reparația: pentru clasele anterioare, listează titlurile lecțiilor și conținuturile programei, iar termenii lor se adaugă la `stiute`. (2) verifica_lectie.py _t1_detalii (l.650-661): excepția „citat doar din antet” să cuprindă și pasul „La ce folosește”, care după standard e fără acțiuni. (3) Tot acolo: blocajele citate din aceeași propoziție, de la același cititor, se numără o dată, iar cele dintr-o sarcină FACUT devin avertisment.

## Reparațiile liniei, pe fișiere

- `verifica_lectie.py` profil_cititor: clasele anterioare cu lecții și conținuturi, iar termenii lor trec la „știe” (aici e cauza celor 4 blocaje).
- `verifica_lectie.py` _t1_detalii: pasul „La ce folosește” intră la excepția antetului; blocajele din aceeași propoziție se numără o dată; cele dintr-o sarcină FACUT devin avertisment.
- `oracol_novice.py` verif_densitate + `verifica_lectie.py` construieste_t0: fără verdict pe 6 propoziții; punctul dintre ghilimele nu taie propoziția.

Semnalări triate la VIII: 5 (T0: 1, T1: 4); alarme false 5.
Semnalări REALE (defecte ale lecției VIII):
0
