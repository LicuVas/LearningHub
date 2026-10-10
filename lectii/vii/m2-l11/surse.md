# VII · M2 · lecția 11 — Interfața unei aplicații de prelucrare audio / audio-video

Scrisă în tura de noapte 10→11.10.2026 de autorul lecției (fără profesor; deciziile, cu motivul, mai jos și în
`_proba/stare_autor.md`). Nu e publicată, nu e în depozit (fără commit).

## 1. Programa și planul profesorului

- **Titlul** (exact): `Info_Gimnaziu_2026/data/unitati.json`, VII-U2 „Aplicații audio și audio-video”, lecția 11, predare;
  `planificari/Calendar_ore_VII_A.md` și `_VII_B.md` (24.11.2026), `Calendar_ore_7_MA.md` (27.11.2026).
- **Conținutul din programă** (OMEN 3393/2017, `C:\00\AI_0\data\informatica_gimnaziu\curriculum.json`, copiat cu ţ-urile
  lui): „Interfaţa unei aplicaţii de prelucrare a fișierelor audio respectiv audio-video”. Competențele unității: CS.1.2, CS.3.2
  (`Proiectul_unitatii_VII-U2.md`).
- **Activitatea profesorului** (`data/activitati_lectii_VII_VIII.json`, VII/11): „Explorarea liniei de timp pe un proiect
  deja început: elevii identifică pistele, cursorul, zona de previzualizare. Se compară cu interfața unui editor de text,
  ca să iasă în evidență ideea de «timp».” Resurse: „laborator, editor audio-video, proiect de pornire”.
  → Pistele, capul de redare („cursorul”) și previzualizarea sunt pașii 1, 3 și 5; comparația cu Word e în pașii 2 și 3
  (textul curge de sus în jos / sunetul curge în timp; cursorul arată unde scrii / capul de redare arată de unde asculți).
  „Proiectul de pornire” = sunetul de lucru `batai-in-usa.wav` (decizia D2, mai jos).
- **Granița cu lecțiile 12-15** (promptul nopții): aici NU se predau proiectul și salvarea lui, înregistrarea (12),
  selecția, ștergerea/copierea/mutarea, mixarea (13), tranzițiile, coloana sonoră (14), genericele (15). Butonul roșu și
  tragerea pe undă primesc în simulator doar un mesaj („o înveți în lecția 12 / 13”).

## 2. Ce presupun că știe elevul (bife = verificat în lecțiile publicate)

- [x] Fereastra Word, cursorul (linia care clipește), comparația „textul curge de sus în jos” — VII/2 (`lectii/vii/m1-l02`).
- [x] Zoom-ul, care nu schimbă documentul — VII/3, pasul 5 (`lectii/vii/m1-l03/profil.json`).
- [x] Ctrl+O, fereastra Deschidere (Open), Descărcări (Downloads), semnul › = „apoi” — VII/3, pașii 1, 4, 5.
- [x] Descărcarea unui fișier din pagina lecției (ajunge în Descărcări) — VII/3, pasul 5.
- [x] ✕ și întrebarea de salvare cu un buton care NU salvează (Word: Nu salvați / Don't Save) — VII/3, pasul 4.
- [x] Ștergerea unui fișier selectat cu Delete — clasa a V-a (`lectii/v/m2-l10`: „Fișierul selectat îl ștergi cu tasta Delete”).
- [x] Butonul Start (scrii numele aplicației) — clasa a V-a + VII/2-3 (pornirea Word).
- [x] Boxe, căști, microfon (dispozitive de ieșire / intrare) — clasa a V-a, V-U1 lecția 5 (planul).
- [ ] „Ce e o secundă pe o riglă (0:05)” — din viața de zi cu zi; neverificat într-o lecție (nu e nevoie de altă lecție).
Totul în `profil.json`, cu lecția de unde vine.

## 3. Aplicațiile: de ce Audacity și Clipchamp, ce versiuni

- Documentele profesorului spun doar „aplicații dedicate”. Jocul publicat `jocuri/audio-video-vii` („Misiunea Reporter”)
  folosește Audacity (sunet) și Clipchamp (video); lecțiile 11-15 merg pe aceleași două (promptul nopții), ca elevul să
  nu schimbe aplicația între joc și lecții.
- **Audacity 4.0.0** e pe calculatorul de lucru (`C:\Program Files\Audacity 4\bin\Audacity4.exe`, interfața în română,
  după Windows). Vechiul **Audacity 3.7.8** e în `C:\Program Files\Audacity_vechi_stricat_20260920` (fără traduceri;
  nepornit). În laborator poate fi 3.x: unde interfața diferă, lecția dă ambele variante:
  - Pauza: Audacity 4 = același buton cu ▶ (devine ‖ cât merge sunetul; în pauză arată iar ▶ și îl apeși ca să continui;
    probat); Audacity 3 = buton separat, la stânga lui ▶ (manualul: https://manual.audacityteam.org/man/transport_toolbar.html
    — ordinea Pause, Play, Stop, Skip to Start, Skip to End, Record). **Continuarea după pauză diferă** (judecata 1, G1,
    reparat 11.10 01:40): în Audacity 3 „Click Pause a second time to resume”, iar ▶ apăsat în pauză „restart[s] playback
    immediately from the editing cursor or selection” (același manual) → lecția spune la pasul 4, la gest, la laboratorul
    nr. 7, la „Încă 1” și la Î3: Audacity 4 = ▶, Audacity 3 = încă o dată ‖.
  - Mărirea la deschidere: Audacity 4 deschide sunetul la o mărire fixă (~35 px/s, bucată mică); Audacity 3.7.8 face „încape
    tot” după import (Audacity.exe importă `Viewport::ZoomFitHorizontallyAndShowTrack`, judecătorul 1, `_verificare/j1_caut_a3.py`;
    neprobat pe ecran) → laboratorul nr. 4 cere „Mărește până vezi bătăile despărțite, cu al doilea grup tot în fereastră”
    (A4 ~3 apăsări, A3 una; dacă grupul a ieșit, o dată Micșorează), nu „de 3 ori” (judecata 1, M3).
  - Afișajul timpului: în Audacity 3 poate avea alt format (de ex. „00 h 00 m 02 s”, fără sutimi; judecătorul sonnet) →
    lecția spune „poate arăta altfel” (NESIGUR, A27).
  - Clicul pe linia de timp: Audacity 4 doar mută capul de redare (probat); Audacity 3 pornește redarea („Left-Click:
    Timeline Quick-Play, play from the time position of the mouse pointer when clicked”,
    https://manual.audacityteam.org/man/timeline.html). De aceea lecția cere mereu clicul **pe undă**.
  - Stop: în ambele, capul se întoarce de unde a pornit redarea (Audacity 4 probat; Audacity 3: „After stopping, playback
    resumes from its last starting point”, https://manual.audacityteam.org/man/playback.html).
  - Închiderea: Audacity 4 „Modificări nesalvate” → **Nu salva** (probat); Audacity 3 „Salvezi proiectul înainte de a
    închide?” (`locale/ro.po` al Audacity 3.7.5, descărcat de pe GitHub în `_proba/audacity3_ro.po`) → butonul „Nu” (No):
    numele RO al butoanelor vin din wxWidgets, **NESIGUR**.
- **Numele românești** ale Audacity 4: din traducerea oficială din program (`C:\Program Files\Audacity 4\locale\audacity_ro.qm`,
  citită cu `_proba/citeste_qm.py` → `_proba/audacity4_ro_mesaje.tsv`): Mărește (Zoom in), Micșorează (Zoom out),
  Pauză (Pause), Stop (Stop), Redare/Pauză (Play/Pause), Redare/Oprire (Play/Stop), Derulează la început / la sfârșit
  (Rewind to start / end), Nu salva (Don’t save), Renunță (Cancel), Piste (Tracks), Fișier, Deschide… Audacity 3.7.5:
  Pauză, Redă, Stop, Sari la început, Sari la sfârșit, Mărește, Micșorează, Cronologie (Timeline), &Fișier, &Deschide...
  Lecția numește butoanele după semn și rol (▶ Redare, ‖ Pauză, ■ Stop, |◀ început, ▶| capăt), ca să meargă în ambele.
- **Scurtăturile Audacity 4** (din executabil, resursa `:/configs/data/shortcuts.xml`, `_proba/extrage_shortcuts.py` →
  `_proba/audacity4_shortcuts.xml`): Space = Redare/Oprire, P = Redare/Pauză, Home/End, Ctrl+= / Ctrl+- (mărire),
  Ctrl+F (tot proiectul), Ctrl+O, Ctrl+W. În Audacity 3 mărirea e Ctrl+1 / Ctrl+3 → lecția predă mărirea DOAR prin lupe
  (decizia D3); singura tastă predată e bara de spațiu (aceeași în ambele).
- **Clipchamp**: aplicație din Magazin, cu contul profesorului → NU a fost pornită. Faptele: capturile jocului
  (`jocuri/audio-video-vii/img/clipchamp-zone.webp`, `clipchamp-cursor.webp`, `SURSE.json` al jocului) și documentația Microsoft:
  - https://support.microsoft.com/en-us/Clipchamp/how-to-work-with-the-timeline-in-clipchamp — „Click on any timestamp on
    the timeline and click on the play button”, „drag the seeker to a new timestamp”, butoanele de mărire „in the bottom
    right-hand corner of the timeline” (+, −, potrivire);
  - https://support.microsoft.com/en-us/Clipchamp/keyboard-shortcuts-for-clipchamp — „Play or pause: SPACE”, Ctrl+= / Ctrl+- / Ctrl+0;
  - https://support.microsoft.com/en-US/accessibility/clipchamp/use-a-screen-reader-to-explore-and-navigate-in-clipchamp-editor —
    „your media section”, „My media tab item”; linia de timp „allows you to arrange videos together, trim out unwanted parts, and overlay text”;
  - https://support.microsoft.com/en-us/clipchamp/what-is-clipchamp și …/create-films-with-a-video-editor — editorul video
    din Windows 11 (vine instalat); contul: https://support.microsoft.com/en-us/topic/how-to-create-and-access-a-clipchamp-account-9d2dd551-bbd2-4975-bb3b-060d35008736
    (varianta „work/school” o pornește administratorul școlii).
  Numele RO „Conținutul meu media” e din captura jocului. Clipchamp în laborator cere cont → partea lui rămâne de recunoscut
  (pasul 5, simulator, întrebarea 4); fără gest real.

## 4. Probele în Audacity 4 REAL (desktopul ascuns, 11.10.2026, 00:00-00:16)

Unealta: `_proba/audacity_dirijor.py <interior>` (o copie a setărilor `%APPDATA%\audacity` și `%LOCALAPPDATA%\audacity`
făcută O DATĂ, înaintea primei probe, în scratchpad — conține căi cu numele contului, deci nu stă în lecție; restaurare din ea
după FIECARE probă, cu amprente sha256; fișierele noi scoase; Recent și registrul `HKCU\Software\*Audacity*` comparate) +
`_proba/sonda_comun.py` (Audacity pornit SUSPENDAT pe desktopul „A6HiddenL11”, desktopul citit din PEB înainte să ruleze,
paza la 20 ms pe desktopul Default, oprire doar a PID-ului meu, taste/clicuri ca mesaje spre fereastra lui, poze cu
PrintWindow). Rezultate: `_proba/audacity_proba{1,1b,2,3,4,4b,4c}.json` + `…_dirijor.json`, capturile în `_proba/_capturi/`
(foile `foaie_A/B/D/G/p3/p4/p4b/p4c.png` le-am privit).

| Ce | Rezultat | Dovada |
|---|---|---|
| deschiderea unui WAV | proiect cu o pistă „batai-in-usa”, titlul „batai-in-usa * - Audacity 4.0” | p1b, p3_c1 |
| fereastra la pornire | „O nouă versiune de Audacity este disponibilă!” (4.0.1); se închide cu ✕ | p1b_dialog_pornire_0.png |
| meniurile | Fișier, Editează, Selectează, Vizualizează, Înregistrează, Piste, Generează, Efect, Analiză, Unelte, Ajutor | p1_start.png |
| meniul Fișier | Nou…, Deschide… Ctrl+O, Deschide recent, Importă…, Salvează, Salvează ca…, Exportă audio…, Închide proiectul Ctrl+W, Închide Ctrl+Q | p3_c2_meniu_popup_0.png |
| Space | pornește; încă un Space oprește și duce capul înapoi de unde a pornit | p2_A0…A3b |
| ▶ în timpul redării | devine ‖; apăsat = pauză pe loc; ▶ continuă de acolo; ■ = înapoi la start | p2_B1…B4 |
| tasta P | la fel ca ▶/‖ | p2_C* |
| |◀ ▶| | la 0:00 / la capăt; stinse cât redă (ca și butonul roșu) | p2_D3, D4, A1 |
| clic pe undă | mută capul acolo (00h00m03.04s); Space redă de acolo; Stop → înapoi acolo | p2_E1…E3 |
| clic pe linia de timp | mută capul, NU redă (00h00m10.04s, la fel după 1 s) | p2_F1, F1b |
| lupa + / lupa − | dublează / înjumătățește mărirea, în jurul capului de redare | p2_G1…G3, p3_c3…c6 |
| Ctrl+= / Ctrl+- / Ctrl+F trimise ca mesaje | n-au avut efect (Ctrl prin mesaje nu ajunge — ca la Excel, README §9 28.09) → nepredate | p2_G4…G6 |
| End / Home trimise ca mesaje | n-au avut efect → lecția folosește butoanele | p2_D1 |
| tragere pe undă | bucată aleasă (mai deschisă), capul NU se mută; Redare pornește de la cap și trece peste bucată | p4b_S1…S4 |
| clic în timpul redării | sare acolo, redarea continuă; Stop → înapoi la locul clicului | p4_S4, p4_E2 |
| redare până la capăt | se oprește singură, capul rămâne la capăt (20.00 s); Redare de acolo pornește de la 0 | p4b_E3/E4, p4c_Z1…Z4 |
| ✕ (clic real pe colțul ferestrei) | „Modificări nesalvate”: „Dorești să salvezi modificările acestui proiect înainte de a-l închide?” / „Modificările tale vor fi pierdute dacă nu le salvezi.” — Salvează (colorat, implicit), Nu salva, Renunță | p1b_intrebare_0.png, p3 (c7) |
| Nu salva | Audacity se închide în ~1 s; nu rămâne niciun proiect nesalvat (doar jurnalul, scos la restaurare) | proba2/3/4_dirijor.json |
| numele la trecerea mouse-ului | nu s-au deschis pe desktopul ascuns | proba4 (T) |
| Space apăsat în PAUZĂ | redarea CONTINUĂ (1,55 → 2,35 → 3,60 s) | judecătorul 1: `_verificare/j1_proba_a.json` Q1, `j1a_Q1a…Q1d`; reconfirmat proba 5 P3 (1,21 → 2,39 s) |
| butoanele în pauză | |◀, ▶| și roșu APRINSE (stinse doar cât merge sunetul); ▶ verde în locul lui ‖ | `j1a_Q1a`, `j1a_Q2a`, `p5_P1a`, `p5_P2a` |
| |◀ după mărire | capul la 0:00 și vederea derulată la 0:00 | `j1a_Q6c` |
| |◀ apăsat în pauză (1,40 s) | capul la 0:00, nu mai merge; ▶ redă de la 0:00; ■ → 0:00 | proba 5 (11.10, 01:40): `audacity_proba5.json`, `_capturi/p5_P1*`, `foaie_p5.png` |
| ▶| apăsat în pauză (11,15 s) | capul la capăt (20,00 s), nu mai merge; ▶ redă de la 0:00 (1,02 s după 1 s); ■ → 0:00 | proba 5: `_capturi/p5_P2*` → deci |◀ / ▶| în pauză = OPRIRE + mutare (simulatorul o urmează) |

**Fără sunet în cameră:** toate redările s-au făcut pe `_proba/_lucru/liniste-20s.wav` (20 s, toate eșantioanele 0).
Sunetul cu bătăi a fost doar deschis, mărit și „atins” cu clicuri (proba 3), niciodată redat. Microfonul nu a fost folosit
(tasta R nu se trimite nicăieri; butonul roșu n-a fost apăsat).

**Setările profesorului:** după fiecare probă `restaurat_identic: True` (21 de fișiere de setări; `la_start_identic_cu_originalul: True` la fiecare pornire). La prima rulare a probei 1, PID-ul meu încă se închidea când l-a verificat dirijorul: a primit `taskkill /PID` și un minut mai târziu nu mai exista niciun Audacity4.exe. Probele au atins
`Audacity4.ini` ([ActiveProjects], update), `session.json`, `update_request_history.json`, `workspaces\Classic.mws`,
`audiocom_sync.db`, un jurnal nou și (la probele oprite cu TerminateProcess) `SessionData\*.aup4unsaved*`: toate puse la loc /
scoase. Registrul: neschimbat. Recent: niciun element al meu (s-au schimbat doar listele Edge ale altui agent, profilul
`lectii/v/m2-l14/_proba/edge_profil_ro`).
Ce era deja acolo și n-am atins: `%LOCALAPPDATA%\audacity\SessionData\New Project 2026-09-20 01-12-10 N-1.aup3unsaved*`
(de la Audacity 3, 20.09) și cele 7 intrări vechi din `[ActiveProjects]` ale `Audacity4.ini`.

**Incident (23:44), al meu:** am pornit din greșeală `Audacity4.exe --version &` din Git Bash, pe desktopul obișnuit. La 23:45
nu rula niciun Audacity4.exe, iar setările aveau datele de modificare de dinainte (28.09): nicio urmă. De atunci, doar
prin dirijor, pe desktopul ascuns.

Nu s-a probat: fereastra Deschidere a Audacity (ar scrie în BagMRU/ComDlg32 ale profesorului, iar în noaptea asta alți
agenți lucrează în Explorer: n-aș putea pune la loc doar ce e al meu) — lecția trimite la fereastra din lecția 3.
(Space în pauză și clicul în pauză le-a probat judecătorul 1; |◀ / ▶| în pauză, proba 5 — tabelul de mai sus.)

**Proba 5 (autorul proaspăt, 11.10.2026, 01:40):** `_proba/audacity_dirijor5.py audacity_interior5.py` (dirijorul de mai
sus, cu copia mea de setări `l11b_…`, desktopul „A6HiddenL11b”, pornire refuzată dacă rulează orice Audacity sau dacă
setările nu sunt identice cu amprentele originale ale probei lecției 12 — o probă a lecției 12 rula înainte). Doar
`liniste-20s.wav`, fără microfon (butonul roșu neatins). Rezultat (`dirijor5_iesire.txt`, `audacity_proba5_dirijor.json`):
PID-ul meu închis prin „Nu salva”, `restaurat_identic: True`, Recent: nimic, registrul: neschimbat; după restaurare 0 diferențe
față de amprentele originale (ale mele și ale lecției 12); copia mea de setări din scratchpad: ștearsă.

## 5. Sunetul de lucru și imaginile

- **`batai-in-usa.wav`** (275 KB, 6,24 s, mono, 22 050 Hz, 16 biți): din „Knocking on wood or door.ogg”, autor **stephan**,
  **domeniu public**, https://commons.wikimedia.org/wiki/File:Knocking_on_wood_or_door.ogg (sha1 7fae9ee6…). Am făcut doar
  trecerea în WAV mono (ffmpeg, fără metadate): Audacity 3 și 4 deschid WAV fără codecuri, iar .ogg-ul de pe Commons are
  un al doilea flux pe care unele programe nu-l citesc. Trei grupuri de câte trei bătăi: ~0,2-0,9 s (prima bătaie slabă),
  ~2,4-3,0 s, ~4,4-5,0 s; între ele, liniște. Vârfurile (la 1/50 s) sunt în pagină (`UNDA`) și în `_proba/unda_batai.json`.
  Ales dintre 8 candidați (`_proba/cauta_commons.py`, `descarca_candidati.py`; respinși: prea încet / tare tot timpul /
  zgomot de stradă). Descărcările de lucru stau în scratchpad, nu în lecție. User-Agent: `LearningHub-lectii/1.0 (educational site)`.
- **Imaginile noi** (`img/`, provenienta în `img/SURSE.json`, făcute cu `_proba/fa_imagini.py` din capturile probelor,
  marcaje roșii puse cu PIL pe copie): `audacity-fereastra.webp`, `audacity-cap-redare.webp`, `audacity-butoane.webp`
  (rândul „în timpul redării” e din proba cu liniște, doar bara de butoane), `audacity-marire.webp`,
  `audacity-meniu-fisier.webp`, `audacity-nu-salva.webp`; fotografia `studio-radio.webp` (L’embellie, Wikimedia Commons,
  **CC0**, https://commons.wikimedia.org/wiki/File:Studio_technique_radio_JVA.jpg; fără persoane). Toate sub 75 KB.
- **Refolosite din joc:** `../../../jocuri/audio-video-vii/img/clipchamp-zone.webp`, `clipchamp-cursor.webp`.

## 6. Decizii (de ce așa)

- **D1** sunetul de lucru: bătăi în ușă (contrast limpede între „înalt = sunet” și „linie = liniște”; domeniu public).
- **D2** fără fișier de proiect .aup3/.aup4 de pornire: Audacity 4 salvează .aup4, pe care Audacity 3 nu-l deschide, iar
  proiectul e materia lecției 12. Un WAV se deschide în orice versiune și face singur un proiect cu o pistă.
- **D3** mărirea doar prin lupe (scurtăturile diferă între versiuni).
- **D4** ordinea: fereastra/unda → linia de timp și lupele → capul de redare → Redare/Pauză/Stop → Clipchamp. Lupele
  înaintea capului de redare, ca exercițiile cu capul să poată folosi mărirea (pe telefon nimerești greu fără ea). Pasul 2
  are două lucruri legate (linia de timp și cum o vezi mai mare/mai mică); despărțit, ar fi fost 6 pași (standardul: 3-5).
- **D5** simulatorul urmează Audacity 4 (probat); diferențele Audacity 3 sunt spuse în text.
- **D6** gesturile reale (regula 10): caseta „La calculator, acum” (`<p class="gest">`, ca la VII/10 în aceeași noapte) la
  pașii 1-4, cu gesturi de un minut; pasul din laborator le pune cap la cap și reia închiderea cu „Nu salva”. Pasul 5
  (Clipchamp) spune deschis că nu are gest real (cont).
- **D7** sunetul din simulator: redarea e simulată (capul merge în timp real), iar cu „Sunet: pornit” se aude și fișierul
  local `batai-in-usa.wav` (nimic nu pleacă din pagină). Laboratorul cere căști sau volum mic.
- **D8** cuvântul „proiect” (lecția 12) nu apare în lecție decât în citatele exacte ale ferestrelor de închidere.

## 7. Ce n-am putut verifica (NESIGUR)

1. Audacity 3: numele RO ale butoanelor întrebării de închidere (Da / Nu / Anulare — din wxWidgets); lecția spune „Nu (No)”.
2. Audacity 3 în laborator: aspectul exact (capturile sunt din Audacity 4).
3. Fereastra Deschidere a Audacity 4: titlul și aspectul (presupusă fereastra Windows obișnuită, ca în lecția 3).
4. Clipchamp: că un clic pe un clip doar îl alege (în simulator nu mută capul de redare); că pista audio stă sub cea video;
   numele RO ale butoanelor de mărire (în simulator: „Mărește”, „Micșorează”, „Potrivește”, descriptive); etichetele
   pistelor („Text”, „Video”, „Audio”) sunt ale simulatorului.
5. Clipchamp: comportamentul la capătul filmului (simulatorul se oprește la capăt).
6. ~~Audacity 4: Space apăsat în pauză și clicul în pauză~~ → PROBAT de judecătorul 1 (Space continuă; clicul mută capul,
   rămâne în pauză); simulatorul reparat (11.10, 01:45).
7. Audacity 3: „încape tot” la deschidere (din executabil, neprobat pe ecran) și formatul afișajului timpului (A27, A28).
8. Audacity 3: ce face bara de spațiu în pauză (lecția nu o cere: în Audacity 3 spune doar „încă o dată ‖”).

## 8. Porțile autorului (rulate de mine)

- `test_joc.py --dir lectii/vii m2-l11` → **TRECUT**, 27 de întrebări/exerciții jucate, diacritice 68,4/1000; doar
  avertismentul așteptat „1 niveluri” (`_proba/test_joc_*.txt`).
- `verifica_lectie.py index.html --fara-t1` → ultima linie **0** (S0, S1, S2 6/6 aplicare/execuție, T0 trecute).
- `_proba/proba_gesturi.py` (Playwright, HTTP pe 127.0.0.1, rețeaua externă blocată, `ctx.close()`): 1280 px cu mouse și
  tastatură + 390 px cu atingere: fiecare exercițiu întâi greșit, apoi bun, cu clicuri/atingeri pe undă și pe linia de timp;
  redarea în timp real (Pauză, Stop, capăt), Space; Clipchamp (rigla, previzualizarea); atelierul; laboratorul (legătura de
  descărcare dă RIFF/WAVE; imaginea „Nu salva” se încarcă); întrebările; finalul. Rezultat în `_proba/proba_gesturi_*.txt`
  și `proba_gesturi.json`: **0 probleme**, 0 erori JS, nimic mai lat decât ecranul, butoanele simulatorului ≥ 32 px.
  Capturile de telefon (`_proba/tel_*.png`) le-am privit.
- **După judecata 1 (autorul proaspăt, 11.10.2026, 01:46)** — registrul `_verificare/registru_j1.md`: `test_joc` TRECUT
  (`_proba/test_joc_4.txt`); `verifica_lectie --fara-t1` → 0 (`verifica_4.txt`); `proba_gesturi.py` 1280 + 390 px →
  0 probleme din 117 (`proba_gesturi_3.txt`, până la final); `proba_j1.py` (reparațiile țintite: Stop târziu apoi bun,
  Space/▶ după Pauză, butoanele în pauză, |◀ în pauză, |◀ și vederea, Space pe un buton cu Tab, rigla ≥ 32 px) → 0 din 29
  (`proba_j1.txt`); `learninghub_date_personale.py` → 0.

## 9. Pentru lecția următoare (VII/12-15: autorii care îmi extind simulatorul)

Simulatorul: `lectii/_sim/audio-linie.js` (proprietar: lecția VII/11). Capul fișierului descrie tot API-ul.
- **Folosiți:** `AudioLinie.creeaza(el, opt)` (mod `'audio'` = Audacity, `'video'` = Clipchamp; `piste:[{tip, nume,
  clipuri:[{id, nume, start, durata, unda}]}]` sau `unda` pentru o singură pistă), `a.stare()`, `a.jurnal()`, `a.auzit()`,
  `a.simuleaza([...])` (acțiuni pe ceas virtual), `a.avans(s)`, `a.reset()`, `a.piste()` + `a.redesenare()` (pentru
  piste/clipuri noi: înregistrare, tăieturi, mutări), `a.adaugaButon({id, eticheta, simbol, grup, apasa, activ})`
  (de ex. butonul roșu adevărat în lecția 12), `a.on(fn)` / evenimentul DOM `audiolinie`, `a.mesaj(html)`,
  `AudioLinie.verificari[nume] = (a, param) => bool` (teste noi). Tipul motorului: `TipAudioLinie` (`{t:'audiolinie', teste,
  solutie, gresit}`); testele se bifează singure.
- **Scrieți extensii în fișiere noi** (de ex. `lectii/_sim/audio-linie-inregistrare.js`, `audio-linie-editare.js`), care
  primesc instanța și adaugă butoane / verificări / tratări; nu copiați fișierul.
- **Nu schimbați** comportamentul probat din lista FIDELITATE (Space, ▶/‖, Stop înapoi la start, capăt, clic pe undă și pe
  linia de timp, tragerea care nu mută capul, butoanele stinse în timpul redării, lupele ×2 în jurul capului) și nici
  numele verificărilor existente: le folosește lecția 11. Ce e nou se adaugă cu nume nou.
- **De știut:** butonul roșu (`data-b="rosu"`) dă acum doar mesajul „lecția 12”; tragerea pe undă face deja `st.sel`
  (`a.stare().sel`, evenimentul `selectie`) — lecția 13 îi poate da înțeles (ștergere/copiere). În Audacity 4 o bucată
  aleasă NU limitează redarea (probat: p4b_S2/S3), deci simulatorul redă de la cap și cu bucată aleasă.
- **SCHIMBĂRI în audio-linie.js, 11.10.2026, 01:45 (după judecata 1; API-ul NU s-a schimbat, versiunea 1.1):**
  (1) Space în pauză CONTINUĂ redarea (era: Stop + capul la start) — Audacity 4 real; (2) |◀, ▶| și butonul roșu sunt
  APRINSE în pauză (erau stinse); (3) |◀ / ▶| (și Home / End) apăsate în pauză OPRESC redarea și mută capul (jurnalul
  primește doar 'inceput' / 'sfarsit', nu 'stop'; ▶ apoi pornește de la acolo, de la capăt pornește de la 0) — proba 5;
  (4) |◀ derulează și vederea la 0:00 în modul audio; (5) Space pe un buton din simulator ajuns acolo cu Tab apasă butonul
  (nu mai pornește redarea); (6) rigla 34 px (era 30), cu capul pistelor și bucata aleasă aliniate; (7) verificarea
  `stopInainte` judecă doar oprirea de după ULTIMA pornire a redării (înainte: toate opririle din jurnal → un Stop târziu
  bloca exercițiul). Dacă extensia voastră se baza pe vechiul comportament la oricare dintre ele, spuneți-o în surse.md-ul vostru.
- Probele vechi de refolosit: `_proba/audacity_dirijor.py` (sau `audacity_dirijor5.py`, care refuză să pornească dacă
  setările nu sunt identice cu amprentele originale ale altei probe în curs) + `sonda_comun.py` (Audacity 4 real, desktop ascuns, setări puse
  la loc) — pentru înregistrare NU folosiți microfonul real (regula nopții); pentru redare, doar fișiere cu liniște.

## 10. Lecțiile și jocurile folosite

- Modele: `lectii/vii/m1-l02` (interfața Word: structura, tonul), `m1-l03` (deschiderea, Descărcări, ✕ și „Nu salvați”),
  `m2-l09`; judecătorii lor (`_verificare/judecator*.md`); VII/10 (caseta `.gest`, în lucru în aceeași noapte).
- Joc: `jocuri/audio-video-vii` nivelul 1 („Pe linia de timp”, lecția 11): capturile Clipchamp și analogia
  „linia de timp de la stânga la dreapta”.
