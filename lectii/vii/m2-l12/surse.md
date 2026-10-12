# VII · M2 · lecția 12 — Gestionarea proiectului audio-video. Înregistrarea și redarea sunetelor

Scrisă în tura de noapte 10→11.10.2026 de autorul lecției (fără profesor; deciziile, cu motivul, mai jos și în
`_proba/stare_autor.md`). Reparată pe 12.10.2026 după judecata 1 de un autor proaspăt: §13 și `_verificare/registru_j1.md`.
Nu e publicată, nu e în depozit (fără commit).

## 1. Programa și planul profesorului

- **Titlul** (exact): `Info_Gimnaziu_2026/data/unitati.json`, VII-U2 „Aplicații audio și audio-video”, lecția 12, predare;
  `planificari/Calendar_ore_7_MA.md` (04.12.2026, ora 12), `Calendar_ore_VII_A.md` / `_VII_B.md` (08.12.2026, ora 13 a
  anului, aceeași temă).
- **Conținuturile din programă** (OMEN 3393/2017, `C:\00\AI_0\data\informatica_gimnaziu\curriculum.json`, copiate cu
  literele lor): „Operații pentru gestionarea unei aplicații audio, audio-video: creare, deschidere, vizualizare, salvare,
  închidere” și „Înregistrarea şi redarea sunetelor” (cu ş, ca în fișier). Competențele: CS.1.2, CS.3.2 (`Proiectul_unitatii_VII-U2.md`).
- **Activitatea profesorului** (`data/activitati_lectii_VII_VIII.json`, VII/12): „Fiecare elev înregistrează 20 de secunde de
  voce, ascultă rezultatul și reface înregistrarea după observațiile colegului (distanță față de microfon, zgomot de fond).”
  Resurse: „laborator, microfoane sau căști cu microfon”. → pașii 2-3 (înregistrare, ascultare, refacere: distanța, zgomotul),
  laboratorul (textul de citit ≈ 20 s, „cere-i părerea colegului de lângă tine”, căștile cu microfon). Lecția 13 (activitatea
  VII/13: „Curățarea propriei înregistrări”) pornește de la proiectul salvat azi, de aceea proiectul RĂMÂNE în Documente.
- **Granița** (promptul nopții): 11 = interfața și ascultarea (scrisă); 13 = selecția, ștergere / copiere / mutare, mixarea;
  14 = tranziții, coloana sonoră (Clipchamp); 15 = generice. Aici: proiectul (ce e, nou, salvare, deschidere, închidere),
  înregistrarea, redarea înregistrării. **Exportul NU intră** (vezi D1); **proiectul Clipchamp NU intră** (D2).

## 2. Ce presupun că știe elevul (bife = verificat în lecțiile scrise)

- [x] Fereastra Audacity, pista, unda, linia de timp, capul de redare, ▶ ‖ ■ |◀ ▶|, „Modificări nesalvate” — VII/11
  (`lectii/vii/m2-l11`, scrisă în aceeași noapte, în judecată; lecția 11 a fost reparată la 01:45: API-ul simulatorului
  neschimbat, comportamentul Pauzei schimbat — nu-l folosesc aici).
- [x] Fereastra de salvare a Windows (Documente / Documents, Nume fișier, Salvare), regula numelui
  `Nume_Prenume_clasa_tema` fără diacritice, „există deja” → nu înlocuiești, pui o cifră; Ctrl+S, Ctrl+W, Ctrl+O — VII/3
  (`lectii/vii/m1-l03`).
- [x] Ctrl+Z — VII/2 (`lectii/vii/m1-l02`).
- [x] Microfonul ca dispozitiv de intrare — clasa a V-a, V-U1 lecția 5 (planul).
Totul în `profil.json`, cu lecția de unde vine.

## 3. Aplicațiile și versiunile

- **Audacity 4.0.0** pe calculatorul de lucru (`C:\Program Files\Audacity 4\bin\Audacity4.exe`, interfața în română după
  Windows); `.aup4` e asociat cu el („Audacity.aup4.4.stable”, comanda `"…Audacity4.exe" "%1"`), deci dublul clic pe proiect
  îl deschide. **Audacity 3.7.8** e stricat (lecția 11) și nu s-a pornit: ce spun despre Audacity 3 vine din manual și din
  `locale/ro.po` 3.7.5 (`lectii/vii/m2-l11/_proba/audacity3_ro.po`), marcat în `afirmatii.json`.
- **Numele RO Audacity 4**: din probe (capturi + UI Automation) și din traducerea oficială din program
  (`lectii/vii/m2-l11/_proba/audacity4_ro_mesaje.tsv`): „Unde dorești să salvezi?”, „Salvează în Cloud (gratuit)”,
  „Pe calculatorul meu”, „Salvează pe calculator”, „Nu mai arăta din nou”, „Fișiere Audacity 4”, „Proiect nou”, „Noi și
  recente”, „Deschide altul...”, „Înregistrează”, „Înregistrează pe pista curentă / pe o pistă nouă”, „Setări audio”,
  „Dispozitiv înregistrare”, „Rescanează dispozitive audio”, „Modificări nesalvate”. Audacity 3 (ro.po): „Unde dorești să
  salvezi?”, „Salvează pe calculator”, „&Salvează proiectul”, „Setări audio”, „Dispozitiv de înregistrare”, „Atenționare
  suprascriere proiect”.
- **Scurtăturile Audacity 4** (`lectii/vii/m2-l11/_proba/audacity4_shortcuts.xml`, din program): R = record/start,
  Space = record/stop, Ctrl+Z = undo, Ctrl+N/O/S, Ctrl+W (le arată și meniul Fișier). Ctrl trimis ca mesaj nu ajunge pe
  desktopul ascuns (lecția 11) → tastele cu Ctrl sunt din meniu și din program, nu apăsate.
- **Documentația oficială folosită** (citatele în `afirmatii.json`):
  - https://support.audacityteam.org/au4/basics/recording-your-voice-and-microphone — „select the microphone using Audio
    setup -> Recording devices”, „click Rescan audio devices”, „simply press the red record button”, unda „square block”
    (prea tare) / „barely see the waveform move” (prea încet);
  - https://manual.audacityteam.org/man/transport_toolbar.html — Record „always begins recording at the end of the currently
    selected track(s)”, Shift+R pe pistă nouă, Stop „Stops playing or recording immediately”;
  - https://manual.audacityteam.org/man/edit_menu.html — „if you just recorded some audio, the menu item name will be Undo Record”;
  - https://manual.audacityteam.org/man/file_menu_save_project.html — „.aup3”, dialogul „save to computer / cloud” cu „Don't show again”.
  Paginile citite cu WebFetch (fără cont, fără nicio dată a profesorului).
- **Clipchamp**: nu e în lecția asta (D2); nu s-a pornit.

## 4. Probele în Audacity 4 REAL (desktopul ascuns „A6HiddenL12”, 11.10.2026, 00:59-02:10)

Unealta: `_proba/audacity_dirijor.py` (copiat din lecția 11 și extins) + `_proba/sonda_comun.py` (copie neschimbată a celui
din lecția 11) + `_proba/registru_explorer.py` (nou: paza registrului Explorer și a listelor de salt). Audacity pornit
SUSPENDAT, desktopul verificat în PEB înainte să ruleze, paza la 20 ms pe desktopul vizibil; oprit doar PID-ul meu; setările
(`%APPDATA%\audacity`, `%LOCALAPPDATA%\audacity`, 21 de fișiere) copiate o dată (01:01) și puse la loc după FIECARE probă,
verificat cu amprente: `restaurat_identic: True` de fiecare dată, și la final (02:12). **Butonul roșu nu s-a apăsat, tasta R
nu s-a trimis, nicio redare** (meniul Înregistrează doar deschis și închis; în fereastra „Tone” n-am apăsat „Previzualizează”).
Rezultate: `_proba/audacity_proba_l12_{1..6}.json` + `…_dirijor.json`, capturile în `_proba/_capturi/l12p*.png`.

| Ce | Rezultat | Dovada |
|---|---|---|
| pornit fără fișier | fila **Acasă**: Proiecte, Noi și recente, Proiecte în Cloud, dala **Proiect nou**, jos **Nou** și **Deschide altul...**; fila Proiect stinsă | p1 s1 |
| meniul Fișier fără proiect | doar Nou… (Ctrl+N), Deschide… (Ctrl+O), Închide (Ctrl+Q) aprinse | p1 m1 |
| Proiect nou (dala) | fila Proiect, „Piste” + „Adaugă pistă”, nicio pistă, titlul „Audacity 4.0” | p2 a1 |
| Fișier › Nou… din Acasă / cu proiect deschis | proiect nou în aceeași fereastră / **fereastră nouă** | p6 e1, e2 |
| Înregistrează (meniu, cu proiect) | Înregistrează pe pista curentă, pe o pistă nouă, Înregistrare lead-in Shift+D (privit, închis) | p2 a3 |
| Setări audio | Gazdă, Dispozitiv redare, Dispozitiv înregistrare, Canale înregistrare, Rescanează dispozitive audio, Setări audio | p2 a4 |
| Fișier › Salvează (proiect fără nume) | „Salvează proiect” — **Unde dorești să salvezi?** — Salvează în Cloud / **Salvează pe calculator**, bifa „Nu mai arăta din nou” | p2 a6, p3 b3 |
| Salvează pe calculator | fereastra Windows „Salvează proiect”, în Documente › Audacity4 › Projects; Nume fișier = numele sunetului + .aup4; „Fișiere Audacity 4 (*.aup4) (*.)”; Salvare / Anulare | p3 b3 |
| Salvare | titlul „Popescu_Ana_7A_voce  - Audacity 4.0”; pe disc `.aup4` (+ `-shm`, `-wal` cât e deschis, dispar la închidere) | p3 b3, p5 d1 |
| a doua Salvează | nicio fereastră | p3 b4 |
| Închide proiectul (salvat) | fila Acasă, fără întrebare; proiectul în Noi și recente, cu „AZI” | p3 b6 |
| clic pe dala lui | proiectul se redeschide | p3 b6 |
| Deschide altul... / Fișier › Deschide… | fereastra Windows „Deschide”, pornită în Descărcări; „Toate fișierele suportate (*.aup4,…”; Deschidere (buton cu săgeată) / Anulare → proiectul se deschide | p3 b7, p4 c1 |
| ✕ pe proiect salvat | Audacity se închide, fără întrebare | p5 d1, d3 |
| ✕ pe proiect nou, gol, nesalvat | „Modificări nesalvate” (Salvează / Nu salva / Renunță) | p2 a7, p6 |
| **prima salvare cu numele unui proiect existent (al „colegului”)** | **nicio întrebare; proiectul colegului e înlocuit** (amprenta 48dd34a6… → 7c10c552…) | p5 d2 |
| Salvează ca… peste o copie octet-cu-octet a proiectului deschis | „Eroare la salvarea proiectului — Audacity a eșuat să scrie într-un fișier…”, iar copia a dispărut | p4 c2 |
| Salvează ca… cu numele proiectului deschis | nicio fereastră (salvează peste el însuși) | p3 b5 |
| fereastra „Tone” (Generează) | nu primește clicurile trimise ca mesaje (Aplică) → proiectele de probă pornite dintr-un WAV dat ca argument | p3 (3 încercări) |
| la pornire | uneori „O nouă versiune…”, alteori „Bun venit” (închise cu butonul lor de închidere) | p1, p5, p6 |

**Sunetele de probă** (`_proba/_lucru/`): `sunet-de-proba.wav` = copia sunetului lecției 11 (domeniu public), `alt-sunet.wav`
= zgomot slab de 2 s făcut de `_proba/fa_alt_sunet.py`; niciunul n-a fost redat. Proiectele de probă (`_proba/_salvari_l12/`)
au fost șterse la final.

## 5. Registrul Explorer și listele de salt (regula 25; cererea dirijorului de la 01:35)

Fereastra Windows de salvare/deschidere scrie în `HKCU\…\Explorer\ComDlg32` (OpenSavePidlMRU\*, LastVisitedPidlMRU — intrarea
Audacity4.exe, CIDSizeMRU) și în `BagMRU`/`Bags` (noduri noi pentru `_proba\_salvari_l12`, `Bags\1492`, `NodeSlots`; ordinea
nodurilor Documente, Audacity4, Descărcări, „vii” adusă în față). `registru_explorer.py` face un instantaneu înainte de fiecare
probă (copia, cu nume de foldere ale profesorului, a stat doar în scratchpad și a fost ștearsă la 02:12) și pune la loc DOAR
urmele mele: valorile/cheile care conțin numele folderului și fișierelor mele, intrarea Audacity4.exe de dinainte, și
mutările „în față” ale celor 4 noduri de mai sus (fiecare pus înapoi după elementul care îl preceda; ce au mutat alții între
timp rămâne). De la 01:35 scrierea nu mai creează chei (doar valori în chei existente).

**Ce am găsit:**
- după fiecare probă: 0 diferențe ale mele față de instantaneu; rămase doar schimbările altora (marcate „neatinse” în
  `audacity_proba_l12_*_dirijor.json`): mutări ale nodului 3 din rădăcina BagMRU, `…\16\0\3` (alt dosar de lecție), Bags\1493,
  OpenSavePidlMRU\jpg, CIDSizeMRU 57, listele de salt `ccba5a59…`, `909c3b3e…`, `3969ce87…`, `baefaae9…`, `e0677d44…`
  (`.customDestinations-ms`) și `f01b4d95…` (Explorer) — niciuna cu numele mele, deci neatinse;
- între 01:22 și 01:28 urmele probei 3 au REAPĂRUT după ce le pusesem la loc (alt agent a scris peste aceleași chei); le-am
  scos din nou la 01:28 (`registru_explorer.py restaureaza … --dialog --aplica` → 0 diferențe);
- „130 de subchei ComDlg32 apărute între 01:21:54 și 01:22:20” (judecătorul altei lecții): nu sunt ale mele — proba mea 3 se
  terminase la ~01:21:30, iar instantaneul meu de la 01:33 avea 65 de chei ComDlg32;
- la final (02:12): ComDlg32 = **65 de chei** (ca la 01:19:48, după dirijor), **nicio valoare/cheie cu numele mele** în
  ComDlg32, RecentDocs, BagMRU/Bags, Recent și listele de salt; intrările Audacity4.exe sunt cele de dinainte (CIDSizeMRU 34,
  LastVisitedPidlMRU 24); nimic în plus, nimic lipsă din ce exista înaintea probelor mele.

## 6. Imaginile

Din capturile probelor (`_proba/fa_imagini.py`, marcaje roșii puse cu PIL pe copie, `img/SURSE.json`): `acasa.webp`,
`proiect-nou.webp`, `setari-audio.webp`, (meniul Fișier: în simulator; captura brută `_capturi/l12p2_a6_fisier_popup_0.png`),
`unde-salvezi.webp`, `salvare-windows.webp` (bara de adresă + câmpurile de jos, FĂRĂ panoul din stânga: are numele contului
și ale dispozitivelor profesorului), `titlu-salvat.webp`, `acasa-recent.webp`, `modificari-nesalvate.webp`. Fotografia
`podcast.webp`: „Enregistrement d'un podcast.jpg”, Guillaume Bonzoms, **CC0**,
https://commons.wikimedia.org/wiki/File:Enregistrement_d%27un_podcast.jpg (persoana văzută din spate; căutată cu
`_proba/cauta_poza.py`, User-Agent `LearningHub-lectii/1.0 (educational site)`). Toate sub 100 KB. Capturile brute ale
ferestrelor Windows din `_proba/_capturi` au panoul din stânga și lista de fișiere acoperite cu negru (`curata_personale.py`).
La reparația din 12.10.2026 (`_proba/fa_imagini_j1.py`): `modificari-nesalvate.webp` refăcută din aceeași captură, cu chenarul pe
**Salvează** (era pe „Nu salva”, ca în lecția 11); nouă `eroare-salvare.webp` — fereastra Audacity „Eroare la salvarea
proiectului”, din captura judecătorului 1 (`_verificare/_capturi_j1/a3_dupa_salvare_0.png`, fereastră Audacity, fără nimic al
profesorului), 7,7 KB.

## 7. Simulatorul (extensie nouă)

`lectii/_sim/audio-linie-inregistrare.js` (proprietar: VII/12), peste `lectii/_sim/audio-linie.js` (VII/11, **neschimbat**,
verificat pe versiunea 1.1 de la 01:45). Tipul motorului: `TipAudioProiect` (`{t:'audioproiect', start, teste, solutie, gresit}`).
Simulează Audacity 4 ca aplicație cu proiecte: fila Acasă, meniul Fișier, butonul roșu (preia butonul `data-b="rosu"` al
simulatorului lecției 11, în faza de captură, fără să-i schimbe codul), ↶ Anulează, Setări audio › Dispozitiv înregistrare,
„Unde dorești să salvezi?”, ferestrele Windows „Salvează proiect” / „Deschide” (Desktop, Descărcări, Documente, cu
proiectele colegilor), „Modificări nesalvate”, ✕ și „Pornește Audacity”. Panoul „Tu, la microfon” (în afara ferestrei) alege
distanța și zgomotul; unda e generată (în pagină nu se folosește microfonul). Lista FIDELITATE / NESIGUR / ABATERI e în capul
fișierului. Fidel la ce s-a probat, inclusiv înlocuirea fără întrebare a proiectului cu același nume (prima salvare) și, din
1.1 (12.10.2026), eroarea + ștergerea proiectului celuilalt la „Salvează ca…”, „Fără titlu.aup4”, ultimul folder de salvare;
Ctrl+N/O/W nu se mai prind (ale browserului). Schimbările, exact: §11, „Schimbat la reparația din 12.10.2026”.

## 8. Decizii (de ce așa)

- **D1** Exportul NU intră: lecția are deja 5 pași cu câte o idee (proiect, înregistrare, ascultare+refacere, salvare,
  închidere+redeschidere); exportul ar fi al 6-lea. → „Pentru lecția următoare”.
- **D2** Proiectul Clipchamp NU intră (nu încape; Clipchamp cere cont și n-a putut fi probat) → lecția 14, scris mai jos.
- **D3** Refacerea = Ctrl+Z (Anulează, predat la VII/2; în manual: „Undo Record”) și ● din nou. Ștergerea unei bucăți e lecția 13.
- **D4** Salvarea în Documente (Documents) sau în folderul de pe tablă, ca la VII/3, NU în `Documente\Audacity4\Projects`
  unde pornește fereastra: elevul găsește proiectul în lecția 13 cu Fișier › Deschide… › Documente.
- **D5** Regula 26 la Audacity 4: nu întreabă și înlocuiește → elevul se UITĂ în lista ferestrei înainte de Salvare și pune o
  cifră dacă numele există; exersat în pasul 4, în atelier (Documente are deja un `Popescu_Ana_7A_voce`, numele din exemplu)
  și în întrebarea 4. Audacity 3 întreabă („Dorești să suprascrii proiectul…?”) → „Nu” și o cifră.
- **D6** Proiectul rămâne în Documente la final (activitatea profesorului VII/13 îl curăță); pasul din laborator NU cere
  ștergerea lui (spre deosebire de sunetul descărcat la VII/11).
- **D7** Textul de citit (≈ 50 de cuvinte, ≈ 20 de secunde): „radioul școlii”, fără date personale — numele elevului apare
  doar în numele fișierului, ca la VII/3.
- **D8** „Nu mai arăta din nou” nu se bifează (calculator comun: colegul următor n-ar mai vedea alegerea).
- **D9** Gesturi reale (regula 10): caseta „La calculator, acum” la pașii 1-5 (pornești + proiect nou; probă de microfon;
  asculți + Ctrl+Z + din nou; salvezi; Ctrl+W + redeschizi); laboratorul le pune cap la cap cu 20 de secunde de voce.
- **D10** Înregistrarea a doua (în simulator) merge după prima, pe aceeași pistă (manualul Audacity 3), cu mesaj că în
  Audacity 4 poate merge pe o pistă nouă; lecția nu se sprijină pe ea (refacerea = Ctrl+Z).

## 9. Ce n-am putut verifica (NESIGUR)

1. Tot ce ține de înregistrarea propriu-zisă în Audacity 4 (butonul roșu nu s-a apăsat): unda care crește, numele pistei noi
   (în simulator „Audio 1”; traducerea Audacity 4 are „Audio” pentru pista de sunet și „Audio înregistrat”), unde stă capul
   după oprire, unde merge a doua înregistrare, Ctrl+Z pe o înregistrare (manualul 3.x: „Undo Record”).
2. Semnul de bifă din Setări audio › Dispozitiv înregistrare (submeniul nu l-am deschis).
3. „Modificări nesalvate” › Salvează pe un proiect cu nume: salvează și închide (doar „Nu salva” e probat; pagina spune doar
   „apasă Salvează”, A28).
4. ~~Numele propus la prima salvare a unui proiect NOU~~ — **probat de judecata 1 (b1): „Fără titlu.aup4”** (A33); simulatorul îl
   are din 1.1. Imaginea `salvare-windows.webp` arată numele unui sunet (proiectul de probă pornise dintr-un WAV): legenda o spune.
5. Audacity 3: fără fila Acasă, Fișier › Salvează proiectul, „Atenționare suprascriere proiect” cu Da/Nu (din ro.po) — scris
   prudent în pagină („de obicei”, „dacă apare”).
6. ● apăsat în timpul unei redări în pauză (butonul e aprins în pauză, după lecția 11 1.1): simulatorul spune „oprește întâi redarea”.
7. ~~„Salvează ca” peste un proiect ADEVĂRAT diferit~~ — **probat de judecata 1 (a3)**: „Eroare la salvarea proiectului”, iar
   proiectul celălalt DISPARE de pe disc; al tău rămâne cu numele vechi (A32; simulatorul 1.1). Eroarea vine DOAR când proiectul
   deschis are deja un nume (c4); pe un proiect FĂRĂ nume („Fără titlu”) „Salvează ca…” peste un nume existent nu arată nicio fereastră
   și înlocuiește proiectul de acolo, ca la prima salvare — **probat de judecata 2, 12.10.2026 (c3)**; simulatorul face la fel.
8. (12.10) Fereastra de eroare la ● fără microfon („Error opening recording device.”, din textele programului, netradus; A36),
   fereastra de conectare audio.com când un coleg a ales Cloud și a bifat „Nu mai arăta din nou” (A37, dedus: o probă ar fi
   putut deschide pagina audio.com în browserul profesorului), steluța * pe un proiect CU NUME modificat (A34; probată doar
   pe proiecte nesalvate), dacă după Ctrl+Z pe o înregistrare rămâne o pistă goală (A14; pagina: „nu e nimic”).
9. (12.10) Ctrl+W în Edge/Chrome reale, cu pagina care îl oprește: proba mea n-a fost concludentă (după Ctrl+N fereastra lecției
   nu mai avea focusul); din documentația Chromium (scurtături rezervate) și din `lectii/_sim/browser-web.js`. Lecția nu-l cere în
   pagină, deci nu se sprijină pe el (A38).

## 10. Porțile autorului (rulate de mine)

- `test_joc.py --dir lectii/vii m2-l12` → **TRECUT** (27 de întrebări/exerciții jucate; doar „1 niveluri”) — `_proba/test_joc_*.txt`.
- `verifica_lectie.py index.html --fara-t1` → ultima linie **0** (S0, S1, S2 6/6, T0) — `_proba/verifica_*.txt`.
- `_proba/proba_gesturi.py` (Playwright, HTTP pe 127.0.0.1, rețeaua externă blocată, `ctx.close()`): 1280 px cu mouse și
  tastatură (R, Space, Ctrl+Z, Ctrl+S, Ctrl+W) + 390 px cu atingere: fiecare exercițiu întâi greșit, apoi bun, înregistrări în
  timp real, salvări prin ferestre, înlocuirea respinsă, închidere/redeschidere, atelierul, laboratorul, întrebările, finalul →
  **0 probleme**, 0 erori JS, nimic mai lat decât ecranul, butoanele ≥ 32 px — `_proba/proba_gesturi_*.txt`, `.json`;
  capturile de telefon `_proba/tel_*.png` privite.
- `C:/00/AI_0/tools/learninghub_date_personale.py` → 0 (vezi `_proba/date_personale.txt`).
- Notarea: lecția nu vorbește de note → oracolele de notare nu se aplică. Fișiere .docx/.pptx/.xlsx: niciunul → `curata_metadate` nu se aplică.
- **După reparația din 12.10.2026** (rulate de autorul reparației): `test_joc.py` → TRECUT (`_proba/test_joc_r2.txt`);
  `verifica_lectie.py --fara-t1` → 0 (`_proba/verifica_r2.txt`); `proba_reparatii.py` → 0 (`_proba/proba_reparatii_2.txt`);
  `proba_gesturi.py` (actualizat: închiderea din meniu, întrebarea nouă de la pasul 4) → 0 până la final (`_proba/proba_gesturi_5.txt`);
  `learninghub_date_personale.py` (`_proba/date_personale_r2.txt`); `_verificare/j1_cuvinte.py` → 0 (pașii ≤ 110 cuvinte).

## 11. Pentru lecția următoare (VII/13: selecția, ștergerea, copierea, mutarea, mixarea; VII/14-15)

- **Proiectul elevului**: salvat azi în **Documente** (sau folderul de pe tablă), numele `Nume_Prenume_clasa_voce` (poate cu
  o cifră), `.aup4` (Audacity 4) / `.aup3` (Audacity 3). Se redeschide din Acasă › Noi și recente sau Fișier › Deschide… ›
  Documente. Lecția 13 îl deschide și îl „curăță” (activitatea profesorului). Audacity 4 NU întreabă când numele există deja:
  la PRIMA salvare înlocuiește proiectul de acolo, iar la **„Salvează ca…” de pe un proiect cu nume, peste ALT proiect
  existent, dă „Eroare la salvarea proiectului” și ȘTERGE proiectul de acolo** (judecata 1, a3). Orice salvare nouă (de ex.
  după curățare) se uită în listă și nu folosește „Salvează ca…” peste un nume care există. Pe lângă proiectul `…_voce`, elevul
  are de la gesturile reale și o probă de microfon `Nume_Prenume_clasa_proba` (în Documente).
- **Exportul** (Fișier › Exportă audio…, MP3/WAV) NU s-a predat: e liber pentru 13 sau mai târziu (în simulator, „Exportă
  audio…” dă doar mesajul „îl înveți într-o lecție următoare”). Jocul `jocuri/audio-video-vii` (nivelul 3) are deja captura
  `audacity-formate.webp`.
- **Clipchamp, proiectul video** (videoclip nou, numele lui, adăugarea fișierelor) NU s-a predat → lecția 14.
- **Simulatorul**: `lectii/_sim/audio-linie-inregistrare.js` (proprietar VII/12). Folosiți `AudioProiect.creeaza(el, {start})`
  cu `start.proiect:{nume, folder, voce:{sec, distanta, seed}}` ca să deschideți un proiect cu o înregistrare, apoi `x.al()`
  = instanța AudioLinie (redare, mărire, tragerea pe undă = selecția de la lecția 11) pentru editare. Teste noi:
  `AudioProiect.verificari[nume] = (x, p) => bool`; evenimente: `x.on(fn)` / `audioproiect` pe `x.radacina`. Extensii noi în
  fișiere noi (de ex. `audio-linie-editare.js`); NU schimbați lista FIDELITATE și nici numele verificărilor de aici.

### Schimbat la reparația din 12.10.2026 (simulatorul 1.1 — `AudioProiect.versiune` = „1.1 (12.10.2026)”)
Compatibil înapoi: nicio funcție, niciun eveniment și nicio verificare n-au fost redenumite sau scoase; comportamentul s-a
schimbat DOAR unde judecătorul a cerut fidelitate (lista FIDELITATE din capul fișierului, rândurile marcate „(1.1)”).
1. **`confirmaSalvare` pe drumul „Salvează ca…” (`d.ca`)**: dacă proiectul deschis ARE nume și ținta există și NU e chiar el →
   dialogul nou `eroare` („Audacity” — „Eroare la salvarea proiectului” / „Audacity a eșuat să scrie într-un fișier. Poate C: nu
   are drepturi de scriere sau discul este plin.”, buton OK, `data-a="er-ok"`); ținta e scoasă din `x.fs()[folder]`; numele,
   folderul și `modificat` ale proiectului deschis rămân; NU se emite `salvat`. Prima salvare (proiect fără nume), „Salvează”
   simplu și „Salvează ca…” peste propriul fișier merg ca înainte (înlocuiesc / salvează pe loc).
2. **Eveniment nou `eroareSalvare`** `{nume, folder, sters:true, autorSters}` (în `x.jurnal()` și la `x.on(fn)` / `audioproiect`).
3. **`x.stare().dialog`** poate fi acum și `'eroare'`; **`x.simuleaza([{ok:1}])`** apasă OK pe ea (după `{salveaza:{…, ca:true}}`
   fereastra rămâne deschisă, ca să o puteți verifica).
4. **`dialogWin('salvare')`**: numele propus pentru un proiect NOU e „Fără titlu.aup4” (era „Proiect fără titlu.aup4”); folderul
   de pornire = ultimul folder în care s-a salvat în instanța asta (la început `'Documente/Audacity4/Projects'`). Opțiune nouă
   **`start.ultimFolderSalvare`** (ex. `'Descărcări'`: „colegul de dinainte a salvat acolo”); câmp nou
   **`x.stare().ultimFolderSalvare`**. Un proiect cu nume propune, ca înainte, numele lui.
5. **`AudioProiect.RE_NUME`** lărgit: mai multe prenume (`Popescu_Ana_Maria_7A_voce`, `Popescu_Ana-Maria_7A_voce`), literele
   mari/mici nu contează (`…_Voce`). Funcție nouă **`AudioProiect.numeTau(n)`** = `RE_NUME` și NU modelul copiat ca atare
   (`Nume_Prenume_…`); `numeRegula` și `salvatRegula` o folosesc acum.
6. **Verificări**: nouă **`nimicSters`** (nicio `eroareSalvare` cu `sters`); **`nimicInlocuit`** cere acum și asta (un proiect șters
   nu e „neatins”). Celelalte, neschimbate.
7. **Tastele**: Ctrl+N, Ctrl+O, Ctrl+W NU se mai prind (în Edge/Chrome le ia browserul: fereastră nouă / închide fila); în pagină
   se aleg din meniul Fișier, care are acum o notă despre asta (`.ap-meniu .ap-nota`). Ctrl+S și Ctrl+Z rămân — probate în Edge
   și Chrome REALE (`_proba/proba_taste_browser.json`). Nu scrieți în lecțiile voastre „apasă Ctrl+W/Ctrl+N/Ctrl+O” în pagină.
8. **Focusul**: după Enter în „Nume fișier”, focusul revine pe fereastra Audacity (`.ap-fer`); pe fereastra de eroare, pe OK.
9. **Space** în afara înregistrării, pe fila Proiect, cu focusul pe fereastra Audacity (nu pe un buton, nu în AudioLinie) =
   redare / oprire (`x.al().simuleaza([{tasta:'Space'}])`), ca în lecția 11.
10. **Butonul de anulare** (`data-a="anuleaza"`, neschimbat) arată doar „↶”, cu titlul „Revenire…” (numele din traducerea Audacity 4);
   dacă textele voastre spun „↶ Anulează”, scrieți „săgeata ↶”.
Proba schimbărilor: `lectii/vii/m2-l12/_proba/proba_reparatii.py` (verificările `[C]`, `[E]`, `[F]`, `[G]`, `[H]`).
- **Probele**: `_proba/audacity_dirijor.py` + `registru_explorer.py` (paza ferestrelor Windows de salvare/deschidere: marcaje
  proprii + `MUTARI_MELE`; puneți-vă propriile marcaje/noduri). Fereastra „Tone” nu primește clicuri prin mesaje: porniți
  proiectele de probă dintr-un WAV dat ca argument. Fără microfon, fără redare de sunet cu volum în probe de noapte.

## 12. Lecțiile și jocurile folosite

- Modele: `lectii/vii/m2-l11` (scrisă în aceeași noapte: structura, tonul, simulatorul, uneltele de probă), `m1-l03`
  (salvarea, regula numelui, „există deja”, Ctrl+W), `m1-l02` (Ctrl+Z).
- Joc: `jocuri/audio-video-vii` nivelurile 2-3 („Proiectul și microfonul”, „Formate și comprimare”, lecția 12): ideile
  „proiectul ține minte munca”, distanța față de microfon (unda plată / vârfuri tăiate), zgomotul de fond — verificate și
  reformulate; captura `audacity-transport.webp` confirmă „Setări audio” lângă butoane.

## 13. Reparațiile după judecata 1 (12.10.2026)

Registrul: `_verificare/registru_j1.md` — reuniunea celor două judecăți (opus: 0 GRAV / 6 MAJOR / 12 MINOR; sonnet: 0 / 1 / 6),
19 puncte (A–S), toate REPARATE, niciunul respins. Proba fiecăruia: `_proba/proba_reparatii.py` (litera în paranteze drepte).
Deciziile dirijorului aplicate:
1. **Proiectul colegului**: nicio denumire de copil de copiat în laborator (modelul `Nume_Prenume_clasa_voce`, cu „în loc de…”);
   „șterge «Fără titlu»”; „caută în listă EXACT ce ai scris”; fereastra pornește în ultimul folder folosit (poate al colegului);
   niciodată „Salvează ca…” peste un nume care există. Simulatorul arată și înlocuirea (prima salvare), și eroarea cu proiectul
   care dispare („Salvează ca…”).
2. **API-ul simulatorului**: schimbat compatibil înapoi — exact în §11, „Schimbat la reparația din 12.10.2026”.
3. **Tastele browserului**: în pagină nu se cer Ctrl+W/N/O; închiderea și deschiderea din meniu. Ctrl+S (și Ctrl+Z) rămân în
   pagină, pentru că sunt **probate** în Edge și Chrome reale: pagina le prinde, fără fereastra browserului (proba de mai jos).
   Focusul revine pe Audacity după Enter în „Nume fișier”.
4. **Laboratorul**: imaginea „Modificări nesalvate” cu Salvează încadrat; ce faci dacă nu apare „Unde dorești să salvezi?”;
   ce faci la o fereastră de eroare la ● (fără setările Windows); ce faci la o fereastră de conectare audio.com; testul numelui
   primește două prenume și „_Voce”.
5. **Prudență**: Ctrl+Z pe înregistrare, unda în timp ce vorbești, bifa microfonului, Audacity 3 — „de obicei”, „dacă apare”,
   cu sursa în `afirmatii.json` (39 de afirmații: 25 probate, 6 din documentație/manual, 8 nesigure).

**Proba tastelor în Edge și Chrome REALE** (`_proba/proba_taste_browser.py` + `_interior.py`, 12.10.2026, 09:35-09:37): desktopul
ascuns „A6HiddenL12R”, browserul pornit suspendat și verificat în PEB, profil TEMPORAR `_proba/browser_profil_*` (șters),
`--host-resolver-rules` = doar 127.0.0.1, pagina `_proba/taste_harness.html` (simulatorul cu un proiect fără nume; starea în
titlu); tastele ca la V/13–V/14 (Ctrl în starea tastaturii firului ferestrei, litera ca tastă). Rezultat, în ambele browsere:
Ctrl+S → simulatorul a deschis „Unde dorești să salvezi?”, nicio fereastră „Salvare ca” a browserului; Ctrl+Z → anulat;
Ctrl+N → fereastră nouă a browserului, deși pagina chema `preventDefault` (pagina nici n-a primit tasta) — controlul că tastele
trimise ajung la scurtăturile browserului; Ctrl+W → neconcludent (după Ctrl+N fereastra lecției nu mai avea focusul).
**Urme**: profilul temporar a rescris amprentele preferințelor `PreferenceMACs\Default` ale Chrome și Edge din registrul
utilizatorului (Chromium le ține sub numele dosarului de profil, „Default”, comun cu profilul real) și lista de salt a Edge;
copia „înainte” a stat doar în memorie. Am șters ce era nou (`_proba/curata_urme_browser.py`: valoarea nouă din
`Edge\PrefsEnclave`, trei liste de salt). Valorile `PreferenceMACs\Default` nu se pot pune exact la loc (detaliile și ce înseamnă:
registrul, ultimul paragraf). Edge-ul temporar și-a schimbat singur numele profilului din „Profil 1” în „Personal” în câteva secunde — după toate aparențele, autentificarea implicită cu contul Windows (rețeaua lui era închisă, profilul șters după). Proba NU se mai rulează fără o copie pe disc a acestor chei și fără autentificarea implicită oprită (lecția e în KB).

**Pentru lecția următoare (VII/13)**: API-ul nou e în §11; proiectul elevului poate avea o cifră la capăt și există și proba
`…_proba`; nu cereți în pagină Ctrl+W/N/O; dacă textele voastre spun „↶ Anulează”, e acum „săgeata ↶”.
