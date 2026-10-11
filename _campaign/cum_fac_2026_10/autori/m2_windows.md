# Autor m2_windows: raport (11.10.2026)

Fișierul: `cum-fac/_sursa/fise_m2_windows.json`, **29 de fișe**, toate `windows`. 18 au captură din pasul-sursă, 11 au `captura: null`.
Verificatorul: `node cum-fac/_build/valideaza_fise.mjs fise_m2_windows.json` dă `fișe: 29 · fișiere: 1` și **0**. Rulat pe toate fișierele: `fișe: 331 · fișiere: 7`, tot **0**.
Proba mea în plus (`_unelte/m2/autor_windows/proba.py`): nicio formulare cu diacritice, niciun id din catalog refolosit, titluri de cel mult 70 de caractere, nicio formulare repetată. Rezultat: 0.

## Fișele, pe lecții
- **V/10 (11)**: folder nou (Nou › Folder; clic dreapta › Nou › Folder; pe Windows 10: Pornire › Folder nou) · redenumire (F2 / Redenumire, Esc, extensia rămâne) · copiere (Copiere › Lipire, Ctrl+C / Ctrl+V, „- Copie”) · mutare (Decupare › Lipire, Ctrl+X / Ctrl+V) · comenzile din meniul de clic dreapta (+ Afișați mai multe opțiuni) · Ctrl+Z după o mutare greșită · „Se omite acest fișier” la același nume (+ redenumire și Copiere din nou) · ștergere cu Delete în Coș (+ ștergerea definitivă de pe stick) · Restaurare din Coșul de reciclare · căutare în caseta din Explorer · săgeata Înapoi în Explorer.
- **V/13 (0)**: în laborator lecția folosește doar gesturi care au deja fișă (vezi mai jos).
- **V/14 (12)**: trecerea la altă filă · închiderea unei file cu × · redeschiderea filei cu Ctrl+Shift+T (inclusiv după ce ai închis toată fereastra; pasul-sursă e p3, completat cu R1) · legătura (link) · ← Înapoi · → Înainte · ↻ Reîmprospătare (Ctrl+R) · căutarea cu cuvinte scrise în bara de adrese (Bing, Sponsorizat) · cuvintele-cheie (metoda în 4 pași, reformularea) · butoanele Imagini / Videoclipuri / Știri · expresia exactă între ghilimele drepte (cu tastarea lui ", Ț → Backspace + Shift+AltGr, spațiul după ghilimea) · alegerea unui rezultat (site + adresă, titlu, descriere).
- **VI/11 (5)**: închiderea unei ferestre false din fila ei (✕ de lângă numele filei, Ctrl+W, „Părăsiți site-ul?” › Anulați) · scutul Securitate Windows lângă ceas (săgeata ^) · starea antivirusului (Start › securitate › Protecție antivirus… › Amenințări curente) · Istoric protecție · scanarea unui stick sau a unui fișier (clic dreapta › Afișați mai multe opțiuni › Scanați cu Microsoft Defender...).
- **VI/12 (1)**: litera mare sau semnul (!, _) cu Shift (din p3 „Uite cum” și p1).

## Gesturi care există deja (nu le-am refăcut)
- `windows-browser-fila-noua`: V/14 îl predă la p3 (+ și Ctrl+T) și R2. VI/11 îl folosește la p4 și R9 (Ctrl+T).
- `windows-browser-adresa-enter`: V/14 îl predă la p4 (plus eroarea „Hmm... nu se poate accesa această pagină”, iar clicul în bară selectează toată adresa).
- `web-ghilimele`: tastarea lui " apare și în V/14 p8. Am pus-o ca pași în fișa de căutare cu ghilimele, din același pas.
- `windows-minimizare-fereastra`, `windows-nume-pictograma`, `windows-trecere-alta-fereastra`: V/13 R3 (ascunzi lecția și o readuci; ții săgeata pe pictogramă; alegi fereastra dintre cele mici). V/10 R11: micșorezi ferestrele ca să vezi desktopul.
- `windows-pornire-aplicatie-start`: V/13 R4 (deschizi Start și îl închizi cu încă un clic) și R5 (scrii edge, clic pe Microsoft Edge). V/14 R1 și VI/11 R3 îl folosesc.
- `windows-inchidere-fereastra`: V/13 R7 (închizi doar fereastra nouă cu X) și VI/11 R5 (închizi Securitate Windows cu ✕).
- `windows-ecran-negru`: V/13 R2.
- `windows-deschidere-explorer`, `windows-panou-navigare`, `windows-deschidere-folder`: V/10 R2 și R4 (Acest PC › Disc local (C:) › Windows › Media), VI/11 R6 (Descărcări).
- `windows-tip-fisier`: VI/11 p3 și R8 (Tip: Aplicație = program; Fișier TXT = text). Informația „Aplicație” am pus-o și în `atentie` la fișa de scanare.
- `windows-browser-descarcare-fisier`: VI/11 R6 și VI/12 R1.
- Gesturile de PowerPoint din VI/12 au toate fișă: `powerpoint-deschizi-prezentare-descarcata` (R1), `powerpoint-activare-editare` (R2), `powerpoint-alegi-diapozitiv` și `powerpoint-tabel`, care are și „clic în căsuță, apoi tastează” (R3), `powerpoint-scrii-in-substituent` (R4), `powerpoint-expunere-de-la-inceput`, `-inainte-inapoi`, `-iesire` (R5), `powerpoint-inchizi-powerpoint` cu Nu salvați (R6). Din cauza asta nu există nicio fișă `powerpoint-` nouă.
- Ștergerea fișierului cu Delete din VI/11 R8 e chiar fișa mea `windows-stergere-fisier` (V/10).

## Gesturi văzute, FĂRĂ fișă, și de ce
1. **V/13, toată partea de la pași** (rețea, Wi-Fi, servicii, adresa web sau de e-mail, alegerea serviciului): sunt idei fără gest. În laborator elevul doar recunoaște browserul după siglă și scrie în caiet. Asta înseamnă să se uite, nu să facă un gest în aplicație.
2. **V/10, copia în același folder** (R9, „sonerie - Copie”): e același gest ca la copiere. Numele „- Copie” e scris în `rezultat` la `windows-copiere-lipire`.
3. **VI/11, ce e un virus, un troian, un program-spion și pe unde intră** (p2, p3): sunt idei. Singurul gest legat de ele, coloana Tip, are deja fișă.
4. **VI/11, recunoașterea unui avertisment fals cu număr de telefon**: e o idee, intrată ca pas în fișa ferestrei false.
5. **VI/12, eticheta LearningHub › Ieși (deconectare) / Închide** (p4, R7): e un gest pe situl LearningHub, nu într-o aplicație. Am respectat regula 3 și am făcut ca autorul windows_web cu butoanele lecției.
6. **VI/12, blocarea și raportarea unui profil fals** (p6): lecția nu dă pași într-o aplicație anume. Ar trebui inventați, ceea ce încalcă regula 2.
7. **VI/12, fraza-parolă și numărarea caracterelor** (p3): e o metodă de gândire, exersată doar pe pagina lecției („n-o scrii nicăieri”). Gestul real de tastatură (Shift) are fișă.

## Nesiguranțe (de judecat)
- **`windows-clic-dreapta-comenzi-fisier`**: e un „drum alternativ” spre patru comenzi care au deja fișa lor. L-am făcut fișă separată, pentru că lecția îl predă ca gest (rândul de butoane mici și Afișați mai multe opțiuni). Dacă judecătorii îl socotesc dublură, se poate scoate.
- **Înapoi / Înainte / Reîmprospătare = 3 fișe**, după regula 1 (pasul p5 predă trei butoane). Înainte e strâns legat de Înapoi, deci se pot uni dacă dirijorul preferă.
- **`windows-browser-cuvinte-cheie`** e mai mult o metodă decât un buton. L-am făcut fișă pentru că lecția are pas propriu și exercițiu în browserul adevărat (p7). E la limita regulii 1.
- **Ctrl+W** stă în fișa ferestrei false (VI/11), nu în `windows-browser-inchidere-fila` (V/14): fiecare fișă are voie să ia bucăți doar din lecția ei.
- **`windows-tastatura-shift-litera-mare`**: VI/12 doar reamintește gestul, iar lecția care îl predă e VI/3 (Shift + minus = _). Acolo n-a făcut nimeni fișă. Locul de pe tastatură al lui Shift nu l-am scris, pentru că VI/12 nu-l dă (V/14 îl dă).
- **`windows-securitate-scut-ceas`**: lecția spune „doar uită-te la el”. Gestul real e săgeata ^ (pictogramele ascunse) și găsirea scutului, nu deschiderea lui.
- **Capturi**: `bara-comenzi.webp` apare la 3 fișe (copiere, mutare, ștergere), pentru că arată exact butoanele lor. `edge-sageti.webp` apare la 3 fișe și `edge-doua-file.webp` la 2. Fișa ferestrei false folosește `jocuri/documentare-v/img/bara-browser.webp`, care e chiar în capturile lui VI/11 p4 (o captură din Chrome).
