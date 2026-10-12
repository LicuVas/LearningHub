# VII · M2 · lecția 13 — Selecția secvențelor: ștergere, copiere, mutare. Mixarea semnalului audio

Scrisă 12.10.2026 (ziua) de autorul lecției, fără profesor; deciziile, cu motivul, mai jos și în `_proba/stare_autor.md`.
Nu e publicată, nu e în depozit (fără commit).

## 1. Programa și planul profesorului

- **Titlul** (exact): `Info_Gimnaziu_2026/data/unitati.json`, VII-U2 „Aplicații audio și audio-video”, lecția 13, predare;
  `planificari/Calendar_ore_7_MA.md` (11.12.2026, ora 13), `Calendar_ore_VII_A.md` / `_VII_B.md` (15.12.2026, ora 14 a
  anului, aceeași temă); `Proiectul_unitatii_VII-U2.md` (ora 13, „teorie, exercitii”).
- **Conținuturile din programă** (OMEN 3393/2017, `C:\00\AI_0\data\informatica_gimnaziu\curriculum.json`, copiate cu
  literele lor, cu ţ/ş ca în fișier): „Selecţia unor secvențe audio, audio-video pentru ștergere, copiere şi mutare” și
  „Mixarea semnalului audio din mai multe surse”. Competențele: CS.1.2, CS.3.2.
- **Activitatea profesorului** (`data/activitati_lectii_VII_VIII.json`, VII/13): „Curățarea propriei înregistrări: tăierea
  pauzelor și a greșelilor. Suprapunerea unei muzici de fundal și reglarea volumelor astfel încât vocea să rămână
  inteligibilă.” Resurse: „laborator, muzică cu licență liberă”. → laboratorul pornește de la proiectul din lecția 12 (sau de
  la sunetul de rezervă), scoate pauzele/greșelile, aduce muzica (CC0, dată ca descărcare) și coboară volumul ei până vocea se
  înțelege.
- **Granița** (promptul autorului): 11 = interfața și ascultarea (tragerea pe undă doar pomenită în mesajul simulatorului: „o
  înveți în lecția 13”, NEpredată în text — am verificat în `lectii/vii/m2-l11/index.html`); 12 = proiectul, înregistrarea,
  redarea; 14 = tranziții, coloana sonoră peste scene (Clipchamp); 15 = generice. Aici: selecția, ștergerea, copierea,
  mutarea, mixarea (a doua pistă, volumul, ascultarea împreună). **Exportul NU intră** (D5); **efectele NU** (activitatea nu
  le cere); **Clipchamp NU**.

## 2. Ce presupun că știe elevul

Lecția 11 (pista, unda, capul de redare, ▶ ■ |◀, lupele), 12 (proiectul, Acasă › Noi și recente, Fișier › Salvează,
Audacity 4 nu întreabă când numele există, proiectul salvat în Documente), 5 (Copiere, Decupare, Lipire în Word, Ctrl+C/X/V),
2 (Ctrl+Z), 3 (Descărcări, regula numelui). Totul în `profil.json`, cu lecția de unde vine.

## 3. Aplicațiile, versiunile, numele RO

- **Audacity 4.0.0** pe calculatorul de lucru (interfața în română). Audacity 3.7.8 e stricat (lecția 11) și nu s-a pornit:
  ce spun despre Audacity 3 vine din manual și din `locale/ro.po` 3.7.5 (`lectii/vii/m2-l11/_proba/audacity3_ro.po`), marcat
  în `afirmatii.json` (A24).
- **Numele RO Audacity 4**: din capturile probelor mele (meniul Editează, meniul de clic dreapta, ferestrele) și din traducerea
  oficială (`lectii/vii/m2-l11/_proba/audacity4_ro_mesaje.tsv`, căutată cu `_proba/cauta_ro.py`): Editează (Edit), Anulează
  „…” (Undo), Refacere (Redo), Decupează (Cut), Copiază (Copy), Lipește (Paste), Șterge (Delete), Duplică, **Șterge și elimină
  spațiul (per pistă)** (Delete and close gap (per track)), Divide (Split), Importă... (Import…), Volum (Volume), „Alege
  comportamentul la ștergerea unei porțiuni de clip”, „Lasă spațiu” (Leave gap), „Elimină spațiul (cascadează)” (Close gap
  (ripple)), „Comportamentul la ștergere a fost setat”, „Mută clipul” (Move clip), „Divide și decupează” (Split cut).
  Eticheta din istoric pentru Șterge cu „Lasă spațiu” e **în engleză** în program: „Split delete” — lecția o scrie așa.
  Audacity 3 (ro.po): &Editează, Ș&terge, Decupea&ză, &Copiază, Li&pește, Re&venire (Undo), &Refacere, &Importă › &Audio...,
  Câștig (Gain), &Elimină special (Remove Special).
- **Scurtăturile** (scrise în meniu, `_capturi/l13p1_e4_meniu.png`, și în `audacity4_shortcuts.xml` al lecției 11): Ctrl+Z,
  Ctrl+Shift+Z, Ctrl+X, Ctrl+C, Ctrl+V, Del/Backspace (Șterge), Shift+Del/Shift+Backspace (Șterge și elimină spațiul),
  Ctrl+Shift+I (Importă), Ctrl+Shift+E (Exportă audio). Tastele nu s-au putut apăsa în Audacity real (Ctrl/Shift trimise ca
  mesaje nu ajung pe desktopul ascuns, lecția 11); în pagină nu cer Ctrl+Shift+I și Ctrl+W (le ia browserul: unelte de
  dezvoltare / închide fila), importul și închiderea din meniu.
- **Documentația oficială** (citită cu WebFetch, fără cont):
  - https://support.audacityteam.org/basics/audacity-editing — „first select the section by clicking and dragging in the
    waveform”, „press Delete or Backspace to delete it”, „You can click + drag on the clip header bar to move a clip around”,
    „import an existing sound file … by dragging & dropping it into the project window … into the empty space below the
    tracks to create a new track”, „You can also import files via the File > Import menus”;
  - https://support.audacityteam.org/audio-editing/mixing-and-panning-tracks — „You can adjust volume and panning per track on
    the left-hand side of any track”;
  - https://manual.audacityteam.org/man/edit_menu.html (Audacity 3) — Delete/Cut: „Audio or labels after the selection move
    leftwards”; Paste: „inserting it into the selected track(s) at the cursor point, or replacing the current selection”;
    „Delete and leave gap” = „audio … to right of the selection stay in current position”;
  - https://manual.audacityteam.org/man/mixing.html — „mixing is automatic on playback and export”;
  - https://manual.audacityteam.org/man/importing_audio.html — „The imported file always appears in a new track”.

## 4. Probele în Audacity 4 REAL (desktopul ascuns „A6HiddenL13”, 12.10.2026, 08:39-09:10)

**Lacătul** `lacat_office.py ia audacity --cine VII13-autor` luat la 08:39, reînnoit înaintea fiecărei probe, eliberat la
09:10 după ce: niciun Audacity4.exe nu mai rula, setările erau identice cu copia (`restaurat_identic: True` după FIECARE probă
și încă o dată cu `restaureaza_setari.py`), iar copia setărilor + instantaneul registrului din scratchpad erau șterse.
Copia setărilor (`%APPDATA%\audacity`, `%LOCALAPPDATA%\audacity`) am făcut-o DUPĂ ce am luat lacătul (la prima probă).
**Uneltele**: `_proba/fa_unelte.py` a copiat din lecția 12 `sonda_comun.py` (neschimbat), `audacity_dirijor.py`,
`restaureaza_setari.py` și `registru_explorer.py` (marcajele mele: `_lucru_l13`, `muzica-l13`, `voce-l13`, `m2-l13`, …;
`MUTARI_MELE` gol; funcție nouă `plan_fereastra`, §6). Probe: `_proba/audacity_interior_l13_{1..7}.py` →
`audacity_proba_l13_*.json` + `…_dirijor.json`, capturi `_proba/_capturi/l13p*`. **Fără redare** (Space nu s-a trimis, ▶ nu s-a
apăsat), **fără înregistrare** (nici butonul roșu, nici meniul Înregistrează, nici R; o gardă refuza orice clic în zona
butoanelor de redare), sunetul de probă = `voce-l13.wav` (copia sunetului lecției 11, domeniu public) și `muzica-l13.wav`
(note sinusoidale făcute de mine), date ca argument / prin Importă.

**Oracolul** fiecărui pas = numele butonului ↶ din dreapta sus, citit cu UI Automation („Anulează „<ultima acțiune>””), nu doar
poza: meniurile Audacity 4 nu apar în UI Automation (rândurile se aleg după poziție: 25 + 40,6·k px, citite pe captură).

| Ce | Rezultat | Dovada |
|---|---|---|
| tragere pe undă 1,2 → 2,2 s | bucată aleasă (mai deschisă); jos „Selecție 00h00m01.23s 00h00m02.22s · Durată 00h00m00.99s” | p1 e2, p3 g1 |
| meniul Editează | Anulează „Importă” Ctrl+Z, Refacere, Decupează, Copiază, Lipește, Șterge Del; Backspace, Duplică, Șterge și elimină spațiul (per pistă) Shift+Del; Shift+Backspace, Clip ▸, Etichetă ▸, Suprimă audio, Editor metadate, Preferințe | p1 e4_meniu |
| clic dreapta pe bucată | Decupează, Copiază, Lipește, Duplică, Șterge, Decupează și…, Lipește și…, Șterge și…, Divide, Divide clipurile în zonele de liniște, Unește | p6 m1_context0 |
| Editează › Șterge și elimină spațiul | bucata dispare, restul vine în stânga, un singur clip; nicio fereastră; ↶ „Anulează „Șterge și elimină spațiul”” | p3 g1, p4 h1-h6 |
| fără bucată aleasă | „Niciun audio selectat — Selectează audio pentru ștergere și încearcă din nou.” (OK) | p1 e6 |
| prima Decupează / Șterge (calculator neales) | „Alege comportamentul la ștergerea unei porțiuni de clip”: Lasă spațiu (ales) / Elimină spațiul (cascadează), Aplică; cu „Elimină” apare „La eliminarea spațiului, ia următoarea acțiune” (clipul selectat / toate de pe pistă / toate de pe toate pistele) | p2 f4, f6; p6 m2 |
| Esc pe ea | nimic șters, nimic ales (data viitoare apare iar) | p2 f5-f6 |
| Aplică | „Șterge preferința — Comportamentul la ștergere a fost setat. Poți schimba asta oricând din Preferințe…” OK | p3 g7a, p6 m2 |
| Șterge cu „Lasă spațiu” | clipul rupt în două, gol cât bucata, durata la fel; ↶ „Split delete” | p6l m2 |
| Șterge cu „Elimină spațiul” | restul vine în stânga; ↶ „Șterge și elimină spațiul” | p6e m2 |
| Decupează | „Lasă spațiu”: gol („Divide și decupează”); „Elimină”: restul în stânga („Decupează”) | p6l/e m5a |
| Copiază, clic la 8,5 s (după capăt), Lipește | clip nou de la 8,5 s, cu gol înaintea lui; ↶ „Lipește”; nicio fereastră | p6 m4 (și din bara de unelte, m6) |
| Lipește în mijlocul clipului (5,6 s; 5,0 s) | bucata lipită ACOPERĂ ce era acolo pe lungimea ei (clipul vechi rupt la 5,0 și 5,7 s) | p6 m3, m5b |
| ↶ (Anulează) | readuce bucata ȘI selecția | p3 g2 |
| ↶ pe „Importă” (WAV deschis) | pista dispare de tot; Refacere o aduce înapoi | p3 g4, p5 k7 |
| o tragere care pornește în bucata aleasă | nu face o selecție nouă (după ↶, selecția restaurată) | p3 g3, p4 h7 |
| clic pe undă | capul acolo, selecția dispare | p3 g5_cursor |
| tragere de bara de sus a clipului | clipul se mută; ↶ „Mută clipul”; clipul ales, cu mânere | p3 g8, p7 n4 |
| glisorul din panoul pistei, tras spre stânga | ↶ „Volum”; unda nu se schimbă | p3 g9, p7 n3 |
| Fișier › Importă… | fereastra Windows „Deschide” (960×600); sunetul pe o pistă NOUĂ, sub voce, de la 0:00 (capul era la 5,6 s); pista = numele fișierului | p7 (a treia rulare: `audacity_proba_l13_7c.json`) |
| titlul | „voce-l13 * - Audacity 4.0” de la deschiderea WAV-ului | toate |

Ce NU merge prin mesaje pe desktopul ascuns (de știut pentru probe): tasta Delete (`L12 b4`, `p2 f2/f3`); Editează › Șterge
din meniu fără un clic dreapta pe undă înainte (`p1 e4`, `p5 k1`: nimic; după clic dreapta, da: `p6 m2`) — probabil focusul;
clicul pe ↶ din bara de sus urmat de trageri noi (p3: selecții fără efect); prin Editează › Anulează, da (p4).

## 5. Sunetele lecției și imaginile

- **`voce-de-curatat.wav`** (20,1 s, mono, 22 050 Hz, 16 biți, 886 KB): din „Grigore Alexandrescu - Câinele și Cățelul.ogg”,
  citit de **Livia F.** pentru LibriVox (Multilingual Short Works Collection 022), **domeniu public** („LibriVox public domain”),
  https://commons.wikimedia.org/wiki/File:Grigore_Alexandrescu_-_C%C3%A2inele_%C8%99i_C%C4%83%C8%9Belul.ogg (sha1 6023ce55…);
  textul, de Grigore Alexandrescu (1810-1885), e în domeniul public. **Am schimbat**: am luat titlul și primele versuri
  (11,10-25,70 s din original, fără anunțul LibriVox), **am pus două pauze lungi** (3 s după titlu, 2,5 s în mijlocul
  versului, după „urșii”), un fade de 0,15 s la început și 0,3 s la capăt, și am adus vârful la 0,9 (×3,43). Pauzele: 1,74-5,72 s
  și 10,94-13,90 s; titlul 0,24-1,74 s; versurile 5,72-10,94 s și 13,90-19,74 s (cuvintele aflate cu faster-whisper, modelul
  `small`, local, `_proba/fa_unde.py` pentru vârfuri). Pe pagină: „sunetul de rezervă”, cu ce are în el.
- **`muzica-fundal.wav`** (24 s, mono, 22 050 Hz, 1,06 MB): primele 24 s din „Gymnopedie No. 1..ogg” (Erik Satie, 1888),
  interpretare **Teknopazzo**, „own work”, **CC0**, https://commons.wikimedia.org/wiki/File:Gymnopedie_No._1..ogg (sha1
  1465775d…); trecut în mono, adus la −16 LUFS (loudnorm, ca să fie la fel de tare ca vocea și să trebuiască coborât), fade
  out 2,5 s. Ales pentru că e lent și liniștit (muzică de fundal). Căutarea: `_proba/cauta_muzica.py` (API-ul Commons,
  User-Agent `LearningHub-lectii/1.0 (educational site)`); ieșirile `cauta_muzica_iesire.json`, `cauta_voce_iesire.json`.
- Fișierele descărcate de pe Commons au stat în scratchpad (dosar separat), nu în lecție; WAV-urile, fără metadate
  (`-map_metadata -1`, `bitexact`). `unde.js` = vârfurile lor (50 pe secundă), pentru simulator.
- **Imaginile** (`img/`, provenienta în `img/SURSE.json`, făcute cu `_proba/fa_imagini.py` din capturile probelor mele, marcaje
  roșii puse cu PIL pe copie): `selectie.webp`, `inainte-dupa.webp`, `meniu-editeaza.webp`, `alege-comportamentul.webp`,
  `gol-lasa-spatiu.webp` (pasul 2, Încă un exercițiu 1), `lipit-dupa-capat.webp`, `clip-mutat.webp`, `doua-piste.webp`,
  `meniu-fisier-importa.webp`. Toate sub 16 KB; nicio dată personală (titlul arată doar „voce-l13 * - Audacity 4.0”).
  Fotografia refolosită: `../m2-l11/img/studio-radio.webp` (L’embellie, CC0, lecția 11).

## 6. Registrul Explorer (regula 25; doar proba 7 a deschis o fereastră Windows)

`registru_explorer.plan_fereastra`: instantaneu **chiar înainte** de clicul pe Fișier › Importă… și **chiar după** ce fereastra
s-a închis (câteva secunde), plus încă unul la 6 s după (scrierile întârziate); tot ce s-a schimbat între ele e socotit al meu
și se pune la loc pe loc, în afară de cheile ALTOR tipuri de fișiere (OpenSavePidlMRU\png etc.).
**Găsit**: la DESCHIDERE, fereastra de import a Audacity creează **~99 de chei GOALE** `ComDlg32\OpenSavePidlMRU\<ext>` (câte
una pentru fiecare extensie din filtrul ei: ul, sw, mm, au, flac, mkv…, doar `MRUListEx` gol). Asta explică „cele 130 de
subchei ComDlg32 apărute între 01:21:54 și 01:22:20” din lecția 12 (§5 acolo). La prima rulare le-am lăsat (regula „alte
tipuri”), le-am găsit cu `_proba/inspecteaza_chei_noi.py` (toate goale, niciuna înainte) și le-am șters (99/99); de la a doua
rulare, `plan_fereastra` le socotește ale mele. Nodurile BagMRU ale drumului meu (`m2-l13\_proba\_lucru_l13`, sub nodul
„vii”) și `Bags\1504-1506`: șterse în fereastra îngustă.
**Rămase NEATINSE** (nu dovedit ale mele): `BagMRU NodeSlots` cu 1-2 octeți în plus (sloturi fără nod: 1505, 1506), două mutări
în față în `BagMRU` / `BagMRU\1` (W:\), apărute DUPĂ ce pusesem la loc, și `CIDSizeMRU\57` = „python.exe” (alt agent).
Copia „înainte” (cu nume de foldere ale profesorului) a stat doar în scratchpad și a fost ștearsă la 09:10. Ce rămâne în
lecție: doar rezumatul fără date (căi relative de chei, nume de valori).

## 7. Simulatorul (extensie nouă)

`lectii/_sim/audio-linie-editare.js` (proprietar VII/13), peste `audio-linie-inregistrare.js` (VII/12, folosit pe versiunea
**1.1 (12.10.2026)**, după reparația de azi) și `audio-linie.js` (VII/11, 1.1), **neschimbate**. Tipul motorului:
`TipAudioEditare` (`{t:'audioeditare', start, teste, solutie, gresit, sunete?}`). Ce face, ce e fidel, ce e NESIGUR și ce
abateri spune pe ecran: capul fișierului. Pe scurt:
- selecția pe o pistă, cu bara „Selecție … Durată …”; meniul Editează (cu rândurile și scurtăturile din program); fereastra de
  alegere (cu un buton „Esc” pentru telefon), golul „Split delete”, Șterge și elimină spațiul, Copiază / Lipește (acoperă),
  Decupează; mutarea clipului de bara lui (bara are 32 px, peste cea desenată de AudioLinie); Fișier › Importă… (fereastra
  „Deschide”, pistă nouă de la 0:00); glisorul Volum pe fiecare pistă (valoarea în dB scrisă lângă, ca ajutor);
  Anulează / Refacere (cu „Importă” la bază pentru un WAV deschis), titlul cu *, „Modificări nesalvate” pentru editări;
- panoul **„Tu, la căști”** (în afara ferestrei, ca „Tu, la microfon” din VII/12): spune ce s-ar auzi la capul de redare
  (vocea, pauza, muzica „încet, în fundal” sau „acoperă vocea”). Regula lui: vocea (nivelul undei + volumul pistei) cu cel
  puțin 10 dB peste muzică = „cuvintele se înțeleg clar”; peste 30 dB = „muzica abia se mai aude”. E o regulă de lucru a
  simulatorului (la radio, muzica de sub voce stă de obicei cu 10-20 dB mai jos), nu un fapt al Audacity; în laborator elevul
  judecă cu urechea;
- **sunetul adevărat** (opțional, „🔇 Sunet: oprit / 🔊 pornit”, oprit la început): WebAudio, fiecare clip cântă bucata lui din
  fișierul-sursă, fiecare pistă cu câștigul ei; nimic nu pleacă din pagină;
- **depinde de clase DOM** ale AudioProiect/AudioLinie (capul fișierului și `_proba/sim_proba.py`, lista `DEPENDENTE`).
- ~~Abatere moștenită (AudioLinie, VII/11): un clic după capăt pune capul la capăt.~~ **Reparată în 1.1** (judecata 1, M1):
  extensia lasă capul unde ai dat clic, și după capăt (un clip-fantomă de 0,01 s, cât ține clicul; AudioLinie neatins), iar
  Lipește pune clipul de acolo, cu liniște înainte, și îl lasă ales.
- **1.1 (12.10.2026, după judecata 1)**: mutarea peste alt clip îl ACOPERĂ (nu se mai oprește la vecin); „Mută elementele” când
  clipul era ales; tragerea pornită în bucata aleasă nu alege alta (mesaj: „întâi un clic”); rândul Refacere se numește
  „Refă „…”” când e ceva de refăcut; verificarea `faraGol` primește `{faraLipite:true}` (atelierul). Vezi §13.

## 8. Decizii (de ce așa)

- **D1** Ștergerea pauzei = **Editează › Șterge și elimină spațiul (per pistă)**: merge la fel pe orice calculator, fără
  fereastră (probat). „Șterge” simplu e pomenit (poate lăsa gol, după alegerea făcută pe calculator).
- **D2** La fereastra „Alege comportamentul…” elevul apasă **Esc**: calculatorul e comun, alegerea ar rămâne pentru toate clasele
  (regula 25); Esc nu șterge și nu alege nimic (probat). Testul „N-ai schimbat alegerea calculatorului” în exerciții.
- **D3** Mutarea = **tragerea clipului de bara lui** (fără fereastră; nume în program: „Mută clipul”, sau „Mută elementele”
  dacă clipul era ales); Decupează + Lipește doar pomenit, ca în Word (pornește fereastra și poate lăsa gol). Lăsat peste alt
  clip, îl acoperă (judecata 1): lecția spune „tragi într-un loc gol; dacă l-ai lăsat peste, Editează › Anulează”.
- **D4** Copierea = Copiază, clic **într-un loc gol** (puțin după capăt), Lipește: în Audacity 4 lipirea acoperă (probat), iar
  capul de redare stă unde ai dat clic, deci rămâne liniște între capăt și copie (la pasul 4 o tragi mai aproape).
- **D5** **Exportul NU intră**: P0 + 5 pași sunt deja plini (selecția; ștergerea; copierea; mutarea; mixarea), câte o idee pe
  pas. O propoziție în pasul 5 („Uite cum”): la export pistele se vor uni într-una. → „Pentru lecția următoare”.
- **D6** Sunetul de rezervă = o lectură în română, în domeniul public, cu două pauze lungi puse de noi (ca să fie ce curăța);
  muzica = CC0. Drumul de deschidere al WAV-ului: Fișier › Deschide… › Descărcări, ca la VII/11.
- **D7** Exercițiile din pagină pornesc din sunetul de rezervă deschis (titlul „voce-de-curatat * - Audacity 4.0”, „Importă” la
  baza istoricului, ca în probă); atelierul = proiectul Anei, deschis din Acasă (gestul din VII/12), salvat cu Fișier ›
  Salvează (are nume: nicio fereastră; nimic de tastat, deci nicio denumire de copiat — cererea dirijorului).
- **D8** Pe telefon: „Mărește” înainte de bucăți mici (la 40 s pe ecran, 1,6 s înseamnă ~7 px); spus în pasul 1.
- **D9** Gesturi reale (regula 10): caseta „La calculator, acum” la pașii 1-5 (deschizi + alegi; scoți + Anulează + Refacere;
  copiezi + lipești; muți + Anulează de două ori; imporți + volum + asculți); laboratorul le pune cap la cap (11 rânduri).
- **D10** Salvarea în laborator (doar pe drumul sunetului de rezervă): numele LUI după regula din lecția 3, cu `mixaj` la capăt,
  fără exemplu de copiat; numele propus se șterge; uită-te în listă (Audacity 4 nu întreabă); niciodată „Salvează ca…” peste un
  nume care există (VII/12, judecata 1).
- **D11** Fișierele descărcate rămân în Descărcări: n-am putut dovedi că proiectul nu mai are nevoie de ele (manualul 3.x spune
  că Audacity poate trimite la materialul original până la prima editare) — NESIGUR, deci nu cer ștergerea lor.

## 9. Ce n-am putut verifica (NESIGUR)

1. Ce se aude: fără redare în probe. „▶ redă toate pistele împreună” și „la export se unesc” = manualul 3.x (A20).
2. Lipirea pe un calculator unde cineva a ales „Lipirea împinge celelalte clipuri” (preferință din traducere; nicio fereastră
   de alegere n-a apărut la lipire).
3. ~~Mutarea unui clip peste alt clip~~ — PROBAT de judecata 1 (v5b): îl acoperă; simulatorul 1.1 la fel. Și ce se întâmplă cu bucata
   acoperită dacă muți apoi clipul de deasupra în altă parte: PROBAT de judecata 2 (12.10.2026, j2_rezultat_3.json g2 -> g3): se taie de tot, nu revine.
4. Istoricul unui proiect .aup4 redeschis (probabil gol: atunci Anulează nu poate scoate pista).
5. ~~Intervalul și valoarea glisorului Volum~~ — PROBAT de judecata 1: −60,0 … +12,0 dB, valoarea într-o bulă doar cât îl ții
   apăsat (`_verificare/_capturi_j1/_foaie_w.png`); simulatorul scrie valoarea lângă, mereu (abatere mică).
6. Clic pe bara clipului fără tragere (simulatorul: alege tot clipul; după tragere, probat, clipul e ales).
7. A doua tragere care pornește în bucata deja aleasă: în probă, nicio selecție nouă; simulatorul 1.1 la fel (plus un mesaj).
   Ce face EXACT Audacity în rest (în probă a apărut o dată o fereastră 499x213, h7): NESIGUR.
11. ~~„Refă „Importă””~~ — PROBAT de judecata 2 (12.10.2026, j2_c6c_dupa_anuleaza_importa_meniu.png); cu istoricul gol primul rând e „Revenire”, stins.
12. Bara Selecție după Lipește (simulatorul: clipul lipit e ales, ca în capturile v3c / lipit-dupa-capat.webp).
8. Audacity 3 (tot ce e spus despre el): din manual și ro.po (A24).
9. Dacă fișierele importate trebuie păstrate (D11).
10. Fereastra Windows de import: titlul („Deschide”) și mărimea sunt probate; restul (panoul, lista) nu se arată (date personale).

## 10. Porțile autorului (rulate de mine)

- `test_joc.py --dir lectii/vii m2-l13` → **TRECUT** (26 de întrebări/exerciții jucate, diacritice 87/1000; doar „1 niveluri”) —
  `_proba/test_joc_*.txt`.
- `verifica_lectie.py index.html --fara-t1` → ultima linie **0** (S0, S1 0 identice/0 aproape identice, S2 6/6, T0 0) —
  `_proba/verifica_2.txt` (prima rulare: T0 „clip folosit înainte de definiție” în numele ferestrei de la pasul 2 → scurtat la
  „Alege comportamentul…”; S1 Î2 prea aproape de P2 → Î2 pornește cu prima pauză scoasă și cere găsirea celei de-a doua).
- `_proba/sim_proba.py` (simulatorul singur, 1280 + 390 px, acțiuni + gesturi reale, clasele DOM de care depinde) → **0** din 74.
- `_proba/proba_gesturi.py` (Playwright, HTTP pe 127.0.0.1, rețeaua externă blocată, `ctx.close()`): 1280 px cu mouse și
  tastatură (Shift+Del, Esc) + 390 px cu atingere: fiecare exercițiu întâi greșit, apoi bun, redare în timp real, fereastra de
  alegere închisă cu Esc, importul, glisorul, mutarea de bară, atelierul cu salvare, laboratorul (legăturile de descărcare dau
  RIFF/WAVE), întrebările, finalul → **0 probleme** pe fiecare (`proba_gesturi_*.txt`, `.json`); capturile `_proba/tel_*.png`
  privite (am găsit și reparat mesajul vechi al lecției 11 „o înveți în lecția 13”, care apărea după o tragere).
- `_proba/refacere_probe.py` = toate cele de mai sus, de rulat după orice schimbare a simulatoarelor VII/11-12.
- `C:/00/AI_0/tools/learninghub_date_personale.py` → vezi `_proba/date_personale.txt`.
- Notarea: lecția nu vorbește de note. Fișiere .docx/.pptx/.xlsx: niciunul → `curata_metadate` nu se aplică.

## 11. Pentru lecția următoare (VII/14-15 și cine mai lucrează în Audacity)

- **Proiectul elevului**: după lecția 13 e în Documente, cu numele lui (de la lecția 12), curățat, cu a doua pistă (muzica
  `muzica-fundal`, CC0) și volumele potrivite; pe drumul de rezervă, un proiect nou `…_mixaj`. **Exportul (Fișier › Exportă
  audio…, MP3/WAV) NU s-a predat**: e liber pentru lecția 14 (dacă intră) sau 16; în simulator, „Exportă audio…” dă mesajul lui
  VII/12 („lecție următoare”). Lecția 13 a spus doar că la export pistele se unesc într-una.
- **Simulatorul**: `lectii/_sim/audio-linie-editare.js` (proprietar VII/13), API-ul în capul fișierului: `AudioEditare.creeaza(el,
  {start, sunete})`, `e.ap()`, `e.al()`, `e.piste()` (clipurile au `seg:[{fis, de, lung}]` = ce bucată din ce fișier e
  unde), `e.simuleaza([...])`, `e.on(fn)`, `AudioEditare.verificari[nume]` (selectie, scos, pastrat, faraGol, copiat,
  copieDupa, laMoment, mutat, importat, mixBun, volumSub, ascultatImpreuna, nimicAles, anulat, refacut, salvatDupaEditari…),
  `start.comportament` (null/'lasa'/'elimina'), `start.importabile`, `start.dinWav`, `start.pasiInainte`, `start.numeSunet`.
  Extensii noi în fișiere noi; NU schimbați lista FIDELITATE și nici numele verificărilor.
- **API schimbat în 1.1 (12.10.2026, după judecata 1)** — de știut dacă vă sprijiniți pe el: `{cap:t}` după capătul sunetului
  lasă capul la t (înainte: la capăt); după Lipește `e.stare().sel` = clipul lipit (înainte: null); `mutaClip` (gest și
  `{mutaClip:{…}}`) ACOPERĂ vecinul în loc să se oprească la el, iar evenimentul `mutaClip` are în plus `{acoperit, eticheta}`;
  eticheta din istoric e „Mută elementele” când clipul era ales; `faraGol:{faraLipite:true}` ignoră golul dinaintea clipurilor
  puse cu Lipește (id `p…`); meniul: „Refă „…”” în loc de „Refacere” când e ceva de refăcut. Numele verificărilor și restul
  API-ului: neschimbate.
- **Probele**: uneltele mele din `_proba/` (dirijorul, `registru_explorer.plan_fereastra` pentru orice fereastră Windows — și
  ștergerea celor ~99 de chei goale OpenSavePidlMRU\<ext> pe care le face fereastra de import a Audacity). Pe desktopul ascuns,
  Editează › Șterge merge doar după un clic dreapta pe undă (focusul); ↶ din bara de sus strică tragerile următoare — folosiți
  Editează › Anulează.
- **Jocul `jocuri/audio-video-vii`** (nivelul 4, „Tai, șterg, mut”) spune „Șterge: bucata dispare” — în Audacity 4, cu „Lasă
  spațiu”, rămâne un gol (A09). De semnalat proprietarului jocului (nu l-am atins).

## 12. Lecțiile și jocurile folosite

- Modele: `lectii/vii/m2-l12` (structura, tonul, simulatorul, uneltele de probă), `m2-l11` (fotografia, uneltele, drumul
  Fișier › Deschide… pentru un WAV), `m1-l05` (copierea și mutarea în Word: „ca în Word”), `m1-l03` (regula numelui).
- Joc: `jocuri/audio-video-vii` nivelurile 4-5 („Tai, șterg, mut”, „Mixajul”, lecția 13): ideile „orice operație începe cu
  selecția” (după judecata 1 reformulată: „ca să ștergi sau să copiezi… întâi o alegi” — Lipește, Importă și volumul nu cer
  selecție), „vocea clar, muzica mult mai încet”, licențele muzicii (CC0) — verificate și reformulate; capturile lui
  (`audacity-editare.webp`, `audacity-mixaj.webp`) au confirmat meniul Editează și glisoarele, dar am folosit capturile mele
  (din probe de azi, cu bara Selecție și fereastra de alegere).

## 13. Reparațiile după judecata 1 (12.10.2026)

Autor proaspăt (autorul lecției nu mai era disponibil), după `_campaign/.../luni_12_10/prompturi/_reparare_j1.md` și deciziile
dirijorului. **Registrul complet** (23 de puncte: 22 ale celor doi judecători + 1 găsit la reparare, toate REPARATE, niciunul
respins): `_verificare/registru_j1.md`. Proba fiecăreia: `_proba/proba_reparatii.py` (litera între paranteze drepte; 1280 px cu
mouse și taste reale, 390 px cu atingere reală prin CDP) → `_proba/proba_reparatii_N.txt`, ultima linie 0.

**Proba nouă în Audacity 4 REAL** (12:49-12:52, lacătul `audacity` „VII13-reparare”, desktopul ascuns „A6HiddenL13”, fără
redare, fără înregistrare, fără fereastră Windows de fișiere; setări `restaurat_identic: True` la ambele rulări, Explorer: 0
diferențe; copia setărilor din scratchpad ștearsă): `_proba/audacity_interior_rep_1.py`, `_rep_2.py` →
`audacity_proba_rep_*.json`, capturi `_proba/_capturi/rep_*`.
- **r1**: rândul de sub Anulează din meniul Editează scrie „Refacere”, stins, cât nu e nimic de refăcut
  (`rep_r1a_meniu.png`) și „Refă „Șterge și elimină spațiul”” (activ, Ctrl+Shift+Z) după o anulare (`rep_r1c_meniu.png`). În
  lecție scria „Editează › Refacere” peste tot → acum „Editează › Refă „…”” (litera W).
- **r2b**: clic la 9,0 s, după capătul unui sunet de 6,2 s → jos „Selecție 00h00m09.03s” (capul stă la clic; ca la judecător, 8,52 s).
- r2c/r3: Lipește n-a pus nimic (de două ori; la judecător a mers — probabil clipboardul, comun tuturor proceselor), deci n-am
  putut proba ce rămâne din clipul acoperit după o mutare înapoi (§9 pct. 3). r3b a arătat „Anulează „Mută clipul”” pentru un
  clip neales, tras de bară.

**Ce s-a schimbat pentru elev** (pe scurt; detaliile în registru): capul de redare stă unde dai clic și după capăt, iar copia
lipită are liniște înainte (pasul 3, laboratorul 7); un clip lăsat peste altul îl acoperă → Editează › Anulează; analogia nouă
(pozele prinse cu cârlige pe sfoară); drumul de rezervă din pasul 1 (și pentru cine n-are pauze lungi, laboratorul 3); „Ca să
ștergi sau să copiezi… întâi o alegi”; Î3 și Î5 noi (aplicare / altă situație); numele englezești; licențele lângă descărcări;
„Unde dorești să salvezi?” poate lipsi; „în căști” la fiecare gest; Mărește pe telefon; „e bun oricare” pentru copiile (1), (2);
imperativele corecte; glisorul de lângă rotiță; Micșorează când nu e loc după capăt.

**Ce s-a schimbat pentru lecția următoare**: simulatorul 1.1 — vezi §11, „API schimbat în 1.1”. `audio-linie.js` (VII/11) și
`audio-linie-inregistrare.js` (VII/12) NU s-au atins. Porțile de după reparare: `_proba/proba_reparatii_*.txt`,
`_proba/refacere_*` (sim_proba, test_joc, verifica_lectie, proba_gesturi), `_proba/date_personale.txt`.

**Observație de probă (pentru judecata 2):** pe 390 px, după o tragere cu degetul EMULATĂ (CDP) precedată de atingeri pe
Mărește, prima atingere pe „Editează” uneori nu produce niciun `click` în Chromium (`_proba/diag_meniu_tel*.txt`: 1-6 din 10;
fără Mărește înainte, 10/10 bine; nicio altă țintă nu primește clicul). Pare starea detectorului de gesturi din emulare, nu
pagina (niciun ascultător `touch*` nepasiv, nicio defilare); `proba_reparatii.py` atinge a doua oară și notează. De văzut pe un
telefon adevărat, dacă se poate.
