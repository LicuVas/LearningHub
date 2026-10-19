# VII · M2 · lecția 14 — Efecte de tranziție între scene. Coloană sonoră peste scene

Scrisă 12.10.2026 (ziua) de autorul lecției, fără profesor; deciziile, cu motivul, mai jos și în `_proba/stare_autor.md`.
Nu e publicată, nu e în depozit (fără commit).

## Pentru profesor (întrebări care țin lecția în laborator)

1. **Contul pentru Clipchamp în laborator.** Aplicația Clipchamp din Windows 11 cere conectarea cu un **cont Microsoft
   personal** sau cu un **cont de școală** (Microsoft 365) care are o licență cu Clipchamp și Clipchamp activat de
   administrator (A3/A5 „Microsoft 365”, nu A1 și nu „Office 365 A3/A5”). Cu Google sau cu e-mail **nu** se poate în
   aplicația Windows. Aplicația se poate conecta și singură, cu contul cu care e deschis Windows-ul. Pentru un elev de
   13-14 ani, un cont Microsoft personal cere în România acordul părintelui (vârsta-limită 16 ani). Citatele: §3 și
   `_proba/docs/citate_clipchamp.md` (F11). **Ce cont folosesc elevii pe calculatoarele din laborator?** Lecția spune acum
   (reparația J1, 12.10.2026; calculatorul e comun): „Lucrezi doar în contul TĂU”. Elevul se uită al cui e contul arătat
   (pe pagina de pornire, pictograma de utilizator, sus în dreapta); dacă e al altcuiva (coleg, profesor) sau nu știe al
   cui e, nu deschide nimic în el, închide Clipchamp, face atelierul din pagină și vă spune. Dacă îi cere să se conecteze,
   se conectează doar cu contul lui, primit de la dumneavoastră; altfel nu-și face cont. La final se deconectează
   (≡ › Înapoi la pagina de pornire › pictograma de utilizator › Deconectare — drumul din documentația Microsoft).
   Dacă Windows-ul din laborator e deschis cu un cont care conectează singur Clipchamp, elevii vor ajunge pe drumul de
   rezervă: spuneți-mi ce cont vor folosi, ca regula să rămână una singură.
   **Windows și contul după deconectare (N4, judecata 2):** când elevul se conectează în Clipchamp, Windows îi propune să
   țină minte contul pe calculator, pentru toate aplicațiile? Dacă acceptă, contul poate rămâne în Windows și după
   „Deconectare” din Clipchamp, iar Clipchamp îl poate conecta singur pe următorul elev (NESIGUR, nepornit). Ce alege
   elevul și ce face calculatorul din laborator? Până la răspuns, pasul 3 din laborator spune: nu accepta, conectează-te doar
   la aplicația asta; nu știi ce să alegi → nu te conecta (captură în `capturi_lipsa.json`). Aceeași regulă stă, de la
   judecata 3, și în caseta „La calculator, acum” a pasului 1, unde elevul se conectează prima dată (R3).
   Dacă un elev nu poate să se deconecteze, lecția îi cere să închidă Clipchamp și să vă spună încă din ora aceea.
2. **Internetul.** Clipchamp cere internet ca să pornească, să lucreze și să salveze (F12). Laboratoarele au internet la oră?
3. **Unde rămân proiectele.** Cu contul personal, fotografiile rămân pe calculator și proiectul trimite la ele; cu cel de
   școală, totul urcă în OneDrive (F10). Lecția cere ca fișierele să rămână în Descărcări, ca lecția 15 să continue filmul.
   Dacă laboratorul șterge Descărcările, spuneți-mi unde să le pună elevii.
4. Fotografiile de scenă: doar lacul (Bucura, Retezat) e din România; celelalte trei sunt din Spania, Austria, Grecia
   (CC0 cu peisaje fără oameni n-am găsit în Carpați, §5). Dacă vreți un set din România, se schimbă doar fișierele.

## 1. Programa și planul profesorului

- **Titlul** (exact): `Info_Gimnaziu_2026/data/unitati.json`, VII-U2 „Aplicații audio și audio-video”, lecția 14, predare;
  `planificari/Calendar_ore_7_MA.md` (18.12.2026, ora 14), `Calendar_ore_VII_A.md` / `_VII_B.md` (22.12.2026, ora 15 a
  anului, aceeași temă).
- **Conținuturile din programă** (OMEN 3393/2017, `C:\00\AI_0\data\informatica_gimnaziu\curriculum.json`, copiate exact):
  „Efecte de tranziție între scene”, „Suprapunere coloană sonoră peste scene”. Competențele unității: CS.1.2, CS.3.2.
- **Activitatea profesorului** (`data/activitati_lectii_VII_VIII.json`, VII/14): „Aceeași succesiune de scene, montată cu
  tăietură simplă și cu tranziții; elevii aleg varianta potrivită și argumentează. Adăugarea coloanei sonore peste tot
  montajul.” Resurse: „laborator, set de scene-suport”. → setul de scene-suport = cele 4 fotografii (descărcare); aceeași
  succesiune cu tăieturi / cu tranziții = pasul 5 (Încearcă: tranziții la toate tăieturile → rămâne una, cu rost), laboratorul
  nr. 10 („Fără”, privești, ↶, scrii în caiet care variantă e potrivită și de ce); coloana sonoră peste tot montajul = pasul 4.
- **Granița** (promptul autorului): 11 = interfața (zonele Clipchamp, doar recunoscute); 12-13 = Audacity (proiectul,
  înregistrarea; selecția, ștergerea, mixarea); **15 = textul peste scene** și exportul videoclipului. Aici: scena, videoclipul
  nou, importul, așezarea și durata, tranziția, coloana sonoră, previzualizarea. **NU**: text / titluri, efecte și filtre,
  exportul (nici al videoclipului, nici exportul audio din Audacity — D1).

## 2. Ce presupun că știe elevul

Lecția 11 (zonele Clipchamp, previzualizarea cu |◀ ↺5 ▶ ↻5, pistele, clipul, capul de redare, rigla, Mărește), 13 (muzica
`muzica-fundal`, volumul), 12 (proiectul), 2 (Ctrl+Z), 3 (Descărcări, fereastra de deschidere, regula numelui), clasa a V-a
(Ctrl + clic, lecția V/11), clasa a VI-a (tranzițiile dintre diapozitive, lecția VI/7 — doar în „altfel”). Totul în
`profil.json`, cu lecția de unde vine.

## 3. Aplicația: Clipchamp (Windows 11), DOAR din documentație și din capturile existente

**Clipchamp NU a fost pornit** (aplicație din Magazin: s-ar deschide pe ecranul vizibil al profesorului și cere cont;
regula zilei 12.10.2026). Faptele vin din:
- **Documentația oficială Microsoft**, descărcată cu curl (fără cont, User-Agent `LearningHub-lectii/1.0`), 94 de pagini
  (EN + RO), citatele copiate din textul descărcat și verificate cu `_proba/docs/verifica_citate.py` (297 de bucăți, 0
  negăsite): `_proba/docs/citate_clipchamp.md` (F1-F12). Principalele:
  - https://support.microsoft.com/en-us/clipchamp/how-to-start-editing-a-new-video — „create a new video”, „+”, proiect 16:9, fără titlu;
  - https://support.microsoft.com/en-us/clipchamp/how-to-edit-a-video-in-clipchamp — „green + button or dragging and dropping”;
  - https://support.microsoft.com/en-us/topic/how-to-change-the-duration-of-an-image-on-the-timeline-215b0fb9-f3ae-49b3-b60f-d612d9403dab — **4 secunde**, mânerele;
  - https://support.microsoft.com/en-us/clipchamp/how-to-remove-gaps-on-the-timeline — golurile, „delete this gap”;
  - https://support.microsoft.com/en-us/clipchamp/how-to-add-transitions-and-fades-to-videos — tranziția doar între clipuri
    alăturate fără gol, tragerea, butonul de adăugare (implicit „cross fade”), panoul de proprietăți: „none”, Durata;
  - https://support.microsoft.com/en-us/clipchamp/how-to-change-the-volume-of-a-video-or-audio-clip — fila Audio, 0-200 %, implicit 100 %;
  - https://support.microsoft.com/en-us/clipchamp/how-to-trim-videos-images-or-audio-assets — mânerele și la audio;
  - https://support.microsoft.com/en-us/topic/keyboard-shortcuts-for-clipchamp-7f745462-3970-4e9c-838e-278cd1444a97 — Space, Delete, Ctrl+Z, Alt+N (numele proiectului);
  - https://support.microsoft.com/en-us/topic/why-have-i-lost-changes-to-my-video-editing-project-f245141e-ca1c-47be-9538-9fc50eab9305 — salvarea automată, cu internet;
  - https://support.microsoft.com/en-us/clipchamp/make-sure-clipchamp-works-well-for-you — „be sure to keep these files”;
  - https://support.microsoft.com/en-us/topic/changes-to-accessing-clipchamp-through-its-windows-app-6dec3caa-8606-44a6-8be8-34bee34571d0
    și https://support.microsoft.com/en-us/clipchamp/how-to-access-microsoft-clipchamp-with-your-work-or-school-account — contul;
  - https://support.microsoft.com/en-us/clipchamp/video-file-formats-supported-by-clipchamp — JPG, WAV acceptate.
  - (reparația J1) https://support.microsoft.com/en-us/clipchamp/how-to-create-and-access-a-clipchamp-account (+ `ro-ro`) —
    „Select your user icon in Clipchamp and confirm the signed-in account.”, „On the Clipchamp home page, select your user
    icon in the upper-right corner, and then select Sign out.” (RO: „pictograma de utilizator din colțul din dreapta sus”,
    „Deconectare”), „Before you sign out, wait for your project to finish saving…”, „If it isn't installed, get it from the
    Microsoft Store.”, „Clipchamp might ask you to locate and relink those files.” (`_proba/docs/text/account_*.corp.txt`);
  - (reparația J1) https://support.microsoft.com/en-us/clipchamp/changes-to-accessing-clipchamp-through-its-windows-app —
    aplicația Windows: „If Clipchamp opens with the wrong account, … select your user icon, and select Sign out.”;
  - (reparația J1) https://support.microsoft.com/en-us/clipchamp/how-to-close-or-delete-a-video-project (+ `ro-ro`) — „three
    horizontal lines button” › „back to home button” (RO: „Înapoi la pagina de pornire”), conturile personale;
  - (reparația J1) https://support.microsoft.com/en-us/accessibility/clipchamp/basic-tasks-to-create-a-video-in-clipchamp-using-a-screen-reader
    — aplicația Windows: „link blank video” (RO: „link video necompletat”); Microsoft 365 web: „click Blank video”
    (how-to-edit-a-video-in-clipchamp; RO „Videoclip necompletat”) → lecția dă ambele nume ale butonului de pornire;
  - (reparația J1) scurtăturile: „Redo: CTRL + Y” (simulatorul îl are de la 1.1); „Hover your cursor over a gap on the
    timeline to see the gap removal feature.” (golurile) → „ține mouse-ul pe gol”.
  Toate paginile de mai sus erau deja descărcate (`_proba/docs/`, 12.10.2026); la reparație nu s-a deschis nicio pagină nouă.
- **Capturile reale Clipchamp în română** din jocul `jocuri/audio-video-vii` (`img/SURSE.json` al jocului, 20.09.2026):
  `clipchamp-zone.webp` („Conținutul meu media”, „Importați conținutul media”, „Glisați și fixați conținutul media…”,
  ↶ ↷, „Distribuiți”, „Exportați”, |◀ ↺5 ▶ ↻5), `clipchamp-tranzitii.webp` („Tranziții”, „Adăugați tranziții”, „Glisați o
  tranziție între două clipuri în cronologie”, „Estompări și încețoșări”, „Estompare încrucișată”, „Ardere”, „Dale”),
  `clipchamp-scurtare.webp` (mânerele). Refolosite în pagină cu calea `../../../jocuri/audio-video-vii/img/…`.
- **Numele românești**: din capturi (sigure) și din ajutorul RO (tradus automat, deci prudente): „cronologie” (= linia de
  timp; e și în captură), „creați un videoclip nou”, „Adaugă la cronologie”, „ștergeți acest spațiu liber”, „fila audio”,
  „Durată”, „fără”. În text, butoanele cu nume nesigur au și numele englezesc: Creați un videoclip nou (Create a new video),
  Estompare încrucișată (Cross fade), Fără (None).

## 4. Ce n-am putut verifica (NESIGUR)

1. Etichetele RO exacte pe ecran: „Creați un videoclip nou”, „Adaugă la cronologie”, „Ștergeți acest spațiu liber”, „Fără”,
   „Durată”, fila „Audio” / „Volum”, numele unui proiect nou („Videoclip fără titlu” e presupus). `capturi_lipsa.json`.
2. Durata implicită a unei tranziții, intervalul glisorului Durată (F6: negăsit) și dacă tranziția scurtează filmul (F7:
   negăsit). Lecția nu dă niciun număr pentru ele (doar „mai lentă”; de la reparația J1 nici testele: „mai lentă decât o
   pune butonul”, adică Durata mai mare decât cea de la început); simulatorul: 1,0 s, 0,1-3,0 s, fără scurtare.
3. Unde pune „+” un material (A09: presupus la capătul pistei; muzica la 0:00) și ce se întâmplă cu scenele de după una
   lungită. Lecția cere acum verificarea ordinii (P2, laborator pasul 7).
4. Ecranul negru cu muzică după ultima scenă (A23) și muzica neatinsă când muți o scenă (A20). De la reparația J1: A20 nu
   mai e afirmat; A23 e spus doar ca purtare a paginii („În pagină… vezi ecran negru cu muzică. În Clipchamp te uiți chiar
   tu”), iar nicio întrebare notată nu mai are cheia pe el.
5. Clicul pe numele proiectului + Enter (A06): documentat doar câmpul („project name field”, Alt+N). Laboratorul spune ce
   faci dacă numele vechi nu dispare și cere verificarea.
8. (reparația J1) Cum arată pictograma de utilizator și ce scrie lângă cont (nume, inițiale, adresă) — documentat doar
   „confirm the signed-in account” (A31); eticheta RO „Deconectare” (A32, ajutor RO tradus); locul butonului ≡ și drumul
   „Înapoi la pagina de pornire” la contul de școală (A33, documentat pentru conturile personale); numele dat de browser
   copiei unui fișier descărcat a doua oară, „(1)” (A35; Chrome / Edge reali nu s-au pornit). `capturi_lipsa.json` (11).
9. (reparația J1) Butonul „+” dintre scene: dacă apare doar când ții mouse-ul acolo (golul: documentat; „+”: nu) → lecția:
   „nu-l vezi? ține mouse-ul acolo”.
6. Ce cere Clipchamp la pornire în laborator (cont, internet) — întrebarea 1-2 pentru profesor.
7. Previzualizarea celorlalte tranziții (simulatorul le aproximează); numele întregi „Încețoșare încrucișată” și „Estompare
   până la negru” (tăiate în captură). Lecția numește doar „Estompare încrucișată” (întreg în SURSE.json al jocului) și „Ardere”.

## 5. Fișierele lecției

- **Scenele** (setul de scene-suport), toate **CC0**, verificate pe pagina fișierului prin API-ul Commons (User-Agent
  `LearningHub-lectii/1.0 (educational site)`), sha1-ul descărcării = cel de pe Commons; decupate 16:9, micșorate, fără
  metadate (`_proba/img_*.py`, `img/SURSE.json`):
  - `scena-1-dimineata` — „Ganekogorta Mountains at Dawn (Unsplash).jpg”, mike anderson, https://commons.wikimedia.org/wiki/File:Ganekogorta_Mountains_at_Dawn_(Unsplash).jpg
  - `scena-2-padure` — „Evergreen (Unsplash).jpg”, Paul Gilmore, https://commons.wikimedia.org/wiki/File:Evergreen_(Unsplash).jpg
  - `scena-3-lac` — „Lake Bucura 03.jpg” (lacul Bucura, Retezat), Gugalcrom123, https://commons.wikimedia.org/wiki/File:Lake_Bucura_03.jpg
  - `scena-4-seara` — „Peloponnese sunset over mountains and water (Unsplash).jpg”, Joe deSousa, https://commons.wikimedia.org/wiki/File:Peloponnese_sunset_over_mountains_and_water_(Unsplash).jpg
  Fiecare de două ori: `img/<nume>.webp` (960×540, în pagină și în simulator) și `<nume>.jpg` (1280×720, de descărcat,
  41-235 KB). Pădurea și lacul: ușor înmuiate (0,6 px) ca să încapă sub mărimea cerută. Fără oameni, fără texte.
- **`img/montaj-video.webp`** (pasul 0) — „Shotcut printscreen cs.png”, Pavouk, **CC0**,
  https://commons.wikimedia.org/wiki/File:Shotcut_printscreen_cs.png; **am estompat** previzualizarea și miniaturile din lista din stânga
  (o persoană recognoscibilă). Miniaturile de pe linia de timp NU sunt estompate: oamenii de acolo au câțiva pixeli (~10 px),
  nerecunoscibili (judecata 1, 12.10.2026, `_verificare/j1_shotcut_linie.png`). Interfața programului e în cehă (spus în legendă).
- **`muzica-fundal.wav`** — **copiată** din lecția 13 (sha1 identic `2d39faaf…`, `_proba/fa_muzica.py`): primele 24 s din
  „Gymnopedie No. 1” (Erik Satie), interpretare Teknopazzo, **CC0** (surse.md al lecției 13, §5). Copiată, nu legată, ca
  lecția 14 să nu depindă de fișierele lecției 13 (publicare în altă ordine). `unde.js` = vârfurile ei (50/s), din `unde.js`
  al lecției 13.

## 6. Simulatorul (NOU)

`lectii/_sim/video-clipchamp.js` (proprietar VII/14), de sine stătător (nu depinde de `audio-linie.js`: acolo Clipchamp e doar
de recunoscut, fără tragere de clipuri și fără tranziții). Tipul motorului: `TipVideoClipchamp` (`{t:'videoclipchamp',
catalog, start, teste, solutie, gresit}`); sub fereastră, butonul „↺ Ia-o de la capăt”. Ce simulează, lista FIDELITATE (D =
documentat, C = văzut în captură, P = presupus), abaterile spuse pe ecran și API-ul public: capul fișierului. Pe scurt:
pagina de pornire, importul cu fereastra Deschidere (Ctrl + clic / Shift + clic; pe telefon fiecare atingere adaugă — spus pe
ecran), biblioteca cu „+”, tragerea pe linia de timp (mouse și deget), 4 s pe imagine, mânerele, golul hașurat cu coș de
gunoi, fila Tranziții (tragere pe tăietură) și „+” dintre scene, panoul tranziției (felul, Fără, Durată: glisor + casetă),
pista audio cu unda muzicii, panoul Audio › Volum (0-200 %), previzualizarea cu trecerea desenată (estompare, negru,
încețoșare), rândul „Acum, la …” (ce se vede și ce se aude), redarea în timp real, Space / Delete / Ctrl+Z, ↶ ↷, numele
proiectului, „Sunet: pornit” (muzica adevărată, doar local). Probe: `_proba/sim_proba.py` (32 de cazuri × 2 lățimi) și
`_proba/proba_gesturi.py`.

## 7. Decizii (de ce așa)

- **D1 Exportul audio din Audacity NU intră.** P0 + 5 pași sunt plini (scenele și importul; așezarea și durata; tranziția;
  coloana sonoră; previzualizarea și alegerea), câte o idee pe pas; al 6-lea pas ar fi depășit standardul (3-5). Și probele
  în Audacity cereau lacătul în aceeași zi cu judecătorul lecției 13. Coloana sonoră = muzica CC0 din lecția 13, nu mixajul
  elevului. → „Pentru lecția următoare”.
- **D2** Muzica copiată (nu legată) din lecția 13 (§5).
- **D3** Setul de scene = „O zi la munte”, dimineața → seara: timpul trece vizibil, deci alegerea tranziției are un criteriu
  pe care îl vede orice copil (lumina). Tranziția „cu rost” = lac (amiaza) → seara.
- **D4** Regula predată (pasul 5): tranziția are rost unde **trece timpul** sau **se schimbă locul**; în același moment,
  tăietura simplă; una-două, nu zece. Exemplul din text e altul (școala → acasă), ca exercițiul cu munții să fie aplicare.
- **D5** Durata se predă pe ultima scenă (seara, 6 s): fără vecin în dreapta, deci fără comportamentul nedocumentat al
  scenelor de după (A09); golul (documentat) e în „Uite cum” și în Încă un exercițiu 1.
- **D6** Numerele lecției sunt doar cele documentate (4 s; 0-200 %) sau ale fișierelor (24 s); despre tranziție, doar „mai
  lentă” (durata ei implicită e negăsită).
- **D7** Telefon: „+” pe material (tragerea din bibliotecă până pe linia de timp cere ca amândouă să încapă pe ecran), Mărește
  înainte de mânere; spus în „Cum lucrezi”.
- **D8** Regula 10: caseta „La calculator, acum” la pașii 1-5 (descarci + deschizi + videoclip nou + imporți; așezi + lungești;
  tranziția + durata + privești; muzica + scurtezi + volumul; privești tot + „Fără” + ↶); laboratorul le pune cap la cap (12
  rânduri), cu drumul de rezervă (atelierul din pagină) dacă Clipchamp nu pornește, n-are internet sau cere un cont.
- **D9** Calculatorul rămâne cum era (regulile 23, 25): proiectul rămâne în cont (îl continuă lecția 15), numit după regula din
  lecția 3, cu `munte` la capăt (fără exemplu de copiat); fișierele rămân în Descărcări (A26); căștile, fără cabluri.
- **D10** Simulator nou, de sine stătător, cu API pentru lecția 15 (§10), nu extensie peste `audio-linie.js`.

## 8. Porțile autorului (rulate de mine)

- `test_joc.py --dir lectii/vii m2-l14` → **TRECUT** (26 de întrebări/exerciții jucate; doar „1 niveluri”) — `_proba/test_joc_*.txt`.
- `verifica_lectie.py index.html --fara-t1` → ultima linie **0** (S0, S1 0/0, S2 6/6, T0 0) — `_proba/verifica_*.txt`.
- `_proba/sim_proba.py` → **0** (32 de cazuri, la 1280 și 390 px: comportamentele D + punctele de extindere pentru lecția 15).
- `_proba/proba_gesturi.py` (Playwright, HTTP pe 127.0.0.1, rețeaua externă blocată, `ctx.close()`): 1280 px cu mouse și
  tastatură (Ctrl + clic, Space, Ctrl+Z) + 390 px cu atingere: fiecare exercițiu întâi greșit, apoi bun; tragerea din
  bibliotecă și din fila Tranziții, mânerele, golul, panoul tranziției (Fără, glisorul Durată), muzica, glisorul Volum,
  redarea în timp real până la capăt, atelierul, laboratorul (descărcările dau JPEG / RIFF-WAVE), întrebările, finalul →
  **0 probleme** (`_proba/proba_gesturi_*.txt`, `proba_gesturi.json`); capturile de telefon `_proba/tel_*.png` privite.
- `C:/00/AI_0/tools/learninghub_date_personale.py` → vezi `_proba/date_personale.txt`.
- Notarea: lecția nu vorbește de note. Fișiere .docx/.pptx/.xlsx: niciunul → `curata_metadate` nu se aplică.
- Nimic pornit pe calculatorul profesorului: niciun Clipchamp, niciun Chrome / Edge real, niciun Audacity (lacătul `audacity`
  nu l-am luat). Paginile Microsoft și Commons: doar curl / API, fără cont, fără browser.

## 9. Pentru lecția următoare (VII/15: textul peste scene; cine mai lucrează în Clipchamp)

- **Ce are elevul după lecția 14**: în Clipchamp, în contul LUI (de la reparația J1: lucrează doar în contul lui și la final
  se deconectează, deci lecția 15 îl găsește deconectat), proiectul numit după regula din lecția 3, cu
  `munte` la capăt: 4 scene (`scena-1…4`), seara ~6 s, o Estompare încrucișată între lac și seară, `muzica-fundal` de la 0:00
  până la capătul filmului, volumul coborât. Fișierele sursă în Descărcări. Pe drumul de rezervă, n-are proiect în Clipchamp.
- **NEpredat (liber pentru 15 / 16)**: exportul videoclipului (Exportați, MP4), **exportul audio din Audacity** (Fișier ›
  Exportă audio…, MP3/WAV — nici lecția 13 nu l-a predat; dacă 15 nu-l ia, rămâne pentru mini-proiectul 16, unde sunetul
  mixat în Audacity ar intra în Clipchamp), fade in / fade out (fila de estompare a panoului), textul, efectele, filtrele,
  tăierea în două (✂ / S), conectarea la cont.
- **Simulatorul** `lectii/_sim/video-clipchamp.js` (proprietar VII/14), API-ul în capul fișierului. Pentru text:
  `v.adaugaFila({id:'text', eticheta:'Text', simbol, deschide(panou, v)})` (fila „Text” din captura `clipchamp-text.webp`),
  `v.schimba(P => P.text.push({id:v.nouId('t'), text, start, durata}))` (pista Text apare singură deasupra pistei video),
  `v.laPrevizualizare((strat, t, v) => …)` (desenezi peste imagine; textul simplu e deja desenat centrat),
  `v.laProprietati('text', (panou, clip, v) => …)` (panoul clipului text ales), `v.cadru(t).text`, `v.on(fn)`,
  `VideoClipchamp.verificari[nume] = (v, p) => bool` (teste noi). Pe pista Text simulatorul știe deja: tragerea clipului
  (mutare), mânerele (durata), alegerea, Delete, ↶. **Scrie extensia într-un fișier nou** (de ex. `video-clipchamp-text.js`).
  **NU schimba**: lista FIDELITATE, numele verificărilor (`proiectNou`, `importate`, `doarImportate`, `peLinie`, `ordine`,
  `faraGoluri`, `durata`, `sfarsitVideo`, `tranzitie`, `nrTranzitii`, `faraTranzitie`, `muzica`, `muzicaDeLa0`,
  `muzicaPanaLaCapat`, `volum`, `vazut`, `vazutTot`, `vazutTrecerea`, `numeSchimbat`, `numeEste`, `folosit`), acțiunile din
  `simuleaza` și forma lui `start` — le folosește lecția 14. După orice schimbare: `python lectii/vii/m2-l14/_proba/sim_proba.py`
  și `proba_gesturi.py` → ultima linie 0.
- **De știut**: scara liniei de timp e fixă cât ții apăsat (altfel mânerul „fugea”, reparat); `vazutTot` cere privirea întregului
  film DUPĂ ultima schimbare; `start.video` poate fi `[['a.jpg', durata], …]` (lipite de la 0:00) sau `[{m, start, durata}]`.
- **De știut pentru probele pe telefon** (12.10.2026, după pauza reparației): o tragere cu atingere CDP
  (`Input.dispatchTouchEvent`) ridicată în plină viteză face ca PRIMA atingere de după ea să-și piardă clicul, la întâmplare —
  e din Chromium, nu din simulator (probat pe o pagină fără simulator: `_proba/depanare_tap_pierdut.py`). În proba ta: degetul
  stă pe țintă ~120 ms înainte de `touchEnd` (câteva `touchMove` pe același punct) și numără clicurile care ajung la
  „Verifică” (altfel un clic pierdut trece drept „respinge”). Modelul: `gest()` și `verifica()` din `_proba/proba_gesturi.py`.
- **Schimbat la reparația din 12.10.2026** (simulatorul 1.1; compatibil înapoi: API-ul public, numele verificărilor,
  acțiunile din `simuleaza`, forma lui `start` și evenimentele NU s-au schimbat; capul fișierului, „SCHIMBAT LA REPARAȚIA…”):
  1. **Focusul** revine pe rădăcina simulatorului (`root.focus({preventScroll:true})`): (a) după orice redesenare care a
     scos elementul cu focus din simulator (`deseneaza()` e acum un înveliș peste `deseneaza0()`); (b) după orice clic cu
     mouse-ul / degetul (`e.detail > 0`) pe simulator, în afară de casete, glisoare, etichete și butonul numelui; (c) după
     `pointerup` în simulator, dacă focusul e în afara lui; (d) după alegerea unei opțiuni din panoul tranziției.
     Pentru lecția 15: un panou al tău (`laProprietati` / `adaugaFila`) cu `<input type=text>` sau `<textarea>` își
     păstrează focusul (nu e luat de (b)); după ce termini de scris, cheamă `v.focus()`, ca tastele editorului să meargă.
  2. **Tastele**: Space = redare / pauză și cu focusul pe un buton al simulatorului (nu-l mai apasă din nou; `keydown` +
     `keyup` cu `preventDefault`; ținută apăsată nu se repetă) și pe glisoare / opțiuni; Ctrl+Z și Ctrl+Y (NOU) / Ctrl+Shift+Z
     și pe glisoare / opțiuni; Delete / Backspace șterge ce e ales și de pe glisoare. Casetele text / număr își păstrează
     tastele. În fereastra Deschidere, Escape o închide și emite acum `importAnulat` (ca butonul Anulare).
  3. **CSS**: `.vc-sc{touch-action:pan-x pan-y}` (pe telefon, degetul pe linia de timp, în afara clipurilor / mânerelor /
     riglei, derulează și pagina); `.vc:not(.lat) .vc-prop::before` scrie „În Clipchamp, panoul acesta stă în dreapta,
     lângă previzualizare.” deasupra ORICĂRUI panou de proprietăți (și al tău), pentru că în pagina unei lecții simulatorul
     are 670 px (sub pragul `lat` de 900 px) și panoul stă sub previzualizare.
  4. `VideoClipchamp.versiune` = „1.1 (12.10.2026, reparația J1)”. Probe după schimbare: `sim_proba.py` → 0,
     `proba_gesturi.py` → 0, `proba_reparatii.py` → 0 și `proba_reparatii.py --mutanti` → 0 (focusul oprit, focusul oprit
     în Deschidere, touch-action vechi: toți prinși).
- **Schimbat la reparația din 12.10.2026, judecata 3** (simulatorul **1.2**; compatibil înapoi: API-ul public, numele
  verificărilor, acțiunile din `simuleaza`, forma lui `start` și evenimentele NU s-au schimbat; capul fișierului, „SCHIMBAT LA
  REPARAȚIA DIN 12.10.2026, JUDECATA 3”). Ce s-a schimbat, exact:
  1. **Locul panoului de proprietăți (R1).** Până la 1.1, `.vc-prop` era în grila `.vc-mij`, pe tot rândul, DEASUPRA liniei
     de timp; la alegerea unei scene pe telefon împingea linia în jos ~146 px, iar clicul atingerii cădea pe 🗑 Ștergeți (scena
     dispărea) sau pe + Mărește. Acum: simulator mai îngust de 900 px (în pagina oricărei lecții: mereu) → `.vc-prop` e copil
     direct al rădăcinii, imediat DUPĂ `.vc-linie` (SUB linia de timp); la 900 px și peste (`.lat`) → a patra coloană a grilei
     e mereu rezervată (`.vc-prop.gol`, cu o notă, când nu e nimic ales). Nimic de deasupra liniei de timp și nimic de pe ea nu
     se mai mută când alegi sau renunți. Pentru lecția 15: caută panoul cu `v.radacina.querySelector('.vc-prop')`, NU cu
     `.vc-mij .vc-prop`; `laProprietati(tip, fn)` primește elementul ca înainte. Dacă pagina ta spune unde stă panoul în
     simulator, scrie „în pagină, sub linia de timp” (nota de pe ecran, „În Clipchamp, panoul acesta stă în dreapta, lângă
     previzualizare.”, a rămas).
  2. **Paza atingerii (R1).** Clicul unei atingeri (`pointerType` touch / pen, `e.detail > 0`) contează doar dacă ajunge pe
     ACELAȘI lucru pe care a coborât degetul (același `data-clip` / `data-a` / `data-trx` / `data-adtr` / `data-gol` /
     `data-plus` / `data-fila` / `data-f` / `data-dlg` / `data-med` / `data-tr` / `data-rigla`, aceeași opțiune din panou,
     același buton — și după redesenare). Altfel se ignoră (capture pe rădăcină, `stopImmediatePropagation`) și intră în
     jurnal `{tip:'clicIgnorat', de, pe}` — tip NOU, adăugat. Mouse-ul și tastatura nu trec pe aici. Pentru lecția 15: elementele
     tale (fără atributele din listă) sunt comparate prin primul strămoș cu `data-*` (toate atributele `data-*`, sortate) sau,
     dacă nu are, prin etichetă (`aria-label`) + text; clasa NU contează (`ales` / `on` se pot schimba la redesenare). Paza ta
     din `video-clipchamp-text.js` (clicul oprit când linia de timp s-a mișcat sub deget) rămâne valabilă; cu panoul sub linie,
     linia nu se mai mișcă.
  3. **Focusul după Enter pe un buton care devine inactiv (R1b).** ↶ / ↷ / 🗑 apăsate cu Enter (după Tab) devin inactive la
     redesenare; focusul nu mai rămâne pe ele (cădea pe pagină: Ctrl+Z / Ctrl+Y nu mai mergeau, Space derula pagina), ci trece
     pe rădăcina simulatorului. ▶ cu Enter, Enter rămâne cum l-a reparat N5 (focusul pe ▶).
  4. `latime()` se cheamă și la ÎNCEPUTUL desenului (ca să știe dacă e `lat` încă de la primul desen); `VideoClipchamp.versiune`
     = „1.2 (12.10.2026, reparația J3)”. Probe după schimbare: `proba_reparatii_j3.py` → 0 (cu oracolele: simulatorul 1.1
     șterge scena, paza singură o salvează), `sim_proba.py` → 0, `proba_reparatii.py` → 0, `proba_gesturi.py` → 0.
- **Jocul `jocuri/audio-video-vii`** (nivelul 6, „Scene, tranziții, generice”) spune „tranziția se trage între două clipuri” —
  la fel ca aici; nu spune de butonul „+” dintre clipuri și nici de condiția „fără gol”. De semnalat proprietarului jocului (nu l-am atins).

## 10. Lecțiile și jocurile folosite

- Modele: `lectii/vii/m2-l13` (structura, tonul, caseta „La calculator, acum”, probele, `numara_cuvinte.js`), `m2-l11`
  (pasul 5 despre Clipchamp, capturile), `m2-l12`; judecătorii lor.
- Joc: `jocuri/audio-video-vii` nivelul 6 („Scene, tranziții, generice”, lecțiile 14-15): ideile „scena = același loc sau
  aceeași idee”, „tăietura simplă”, „tranzițiile cu măsură”, „coloana sonoră pe pista ei” — verificate în documentație și
  reformulate; capturile lui Clipchamp (zone, tranziții, scurtare).

## 11. Reparațiile după judecata 1 (12.10.2026)

Autor proaspăt (autorul lecției nu mai era disponibil); fiecare punct al celor doi judecători (opus `_verificare/judecator1.md`,
sonnet `_verificare/ab_sonnet/judecator1.md`), cu reparația, locul și proba: **`_verificare/registru_j1.md`** (literele A-S;
1 GRAV, 6 MAJOR, 12 MINOR; toate reparate, un sub-punct respins cu motiv — D). Nimic pornit: niciun Clipchamp, niciun Chrome /
Edge real; faptele noi (contul, deconectarea, ≡ › Înapoi la pagina de pornire, „blank video”, Microsoft Store, Ctrl+Y, golul la
„hover”) vin din documentația Microsoft deja descărcată (§3), fără nicio pagină nouă.

Ce s-a schimbat în lecție, pe scurt:
- **Contul (GRAV)**: în laborator elevul se uită al cui e contul (pictograma de utilizator), lucrează doar în contul lui și la
  final se deconectează; laboratorul are acum 15 pași (pasul 12 = compararea cu „Fără”, 13 = deconectarea, 15 = drumul de
  rezervă, oricând). „Pentru profesor” 1 spune regula nouă.
- **P0** predă și „scena”; **P1** nu mai predă numele proiectului și salvarea (trec în intro-ul atelierului); **P4** nu mai
  spune ca fapt A20 / A23; **P5** are orele scenelor și regula „unde se schimbă cel mai mult”; **Î4** e altă situație.
- Fără cifre pentru durata tranziției (testele: „mai lentă decât o pune butonul”).
- Simulatorul 1.1 (focusul, tastele, derularea pe telefon, nota panoului): §9, „Schimbat la reparația din 12.10.2026”.

**Pentru lecția următoare (VII/15) s-a schimbat**: doar ce scrie în §9 la „Schimbat la reparația din 12.10.2026” (compatibil
înapoi). În plus, laboratorul acestei lecții se încheie cu **deconectarea** din Clipchamp: lecția 15 începe cu elevul
neconectat, deci reia „te conectezi doar cu contul TĂU / te uiți al cui e contul”, iar la final deconectarea.

**La pauza din 12.10, ~15:00 (corectat de dirijor):** `proba_gesturi` NU era 0 — 2 probleme pe telefon (`proba_gesturi_8.txt`),
iar `proba_reparatii` nu fusese rerulată după ultimele fișiere. Le-a terminat, după pauză, un al doilea autor proaspăt:

**Cele 2 probleme de telefon erau ale PROBEI, nu ale simulatorului.** Jurnalul evenimentelor (o copie a probei cu ascultare pe
document: `_proba/depanare_gesturi_tel_1.txt`, `_2.txt`) arată că la atingerea de pe „Verifică” (și pe + dintre lac și seară, în
atelier) ajungeau `pointerdown`, `touchstart`, `pointerup`, `touchend`, dar NU și `click`: era prima atingere de după o tragere
cu atingere CDP ridicată în plină viteză. Tragerile reușeau (starea simulatorului era cea bună: „muzica trasă de mijloc la
0:00” trecea); se pierdea clicul atingerii de după, la întâmplare (altă rulare a picat la P2: `proba_gesturi_9_tel_inainte.txt`).
Pe o pagină MINIMĂ, fără simulator și fără motor (`_proba/depanare_tap_pierdut.py` → `depanare_tap_pierdut_1.txt`): clicul
ajunge 5/12 (fără redesenare) și 8/12 (cu redesenare la fiecare mișcare) când degetul se ridică în viteză, 12/12 și 12/12 când
degetul se oprește ~120 ms pe țintă. Deci e felul în care Chromium tratează gestul probei (o „aruncare” pe care atingerea
următoare doar o oprește), nu o greșeală din `video-clipchamp.js`. Nota de la pauză („drumul se oprește la pasul 5”) era
inexactă: pasul 5 trecea, drumul se oprea în atelier.
Reparația, în ambele probe (`proba_gesturi.py`, `proba_reparatii.py`; fără `focus()` și fără clic sintetic de probă):
(1) pe telefon, degetul se oprește pe țintă ~120 ms înainte de ridicare, cum lasă un om un mâner la un loc anume;
(2) „Verifică” se socotește doar dacă clicul a AJUNS la buton (ascultare pasivă pe document) — înainte, un clic pierdut lăsa
mesajul gol și trecea drept „respinge”; (3) `proba_reparatii.py` [Q]: proiectul se citea DUPĂ cele două trageri de derulare
(comparat cu el însuși) — acum se citește înainte. Simulatorul nu s-a schimbat după pauză (rămâne 1.1).

Porțile, rulate după ultima schimbare (12.10.2026, seara): test_joc **TRECUT** (doar „1 niveluri”; `_proba/test_joc_r3.txt`) ·
verifica_lectie --fara-t1 **0** (`verifica_r2.txt`) · learninghub_date_personale **0** (`date_personale_r2.txt`) · sim_proba
**0** (`sim_proba_r3.txt`) · proba_reparatii **0** (148 OK la 1280 + 390, `proba_reparatii_3.txt`) · proba_reparatii
--mutanti **0** neprinși (5/5, `proba_reparatii_mutanti_3.txt`) · proba_gesturi **0** (157 OK la 1280 + 390, de două ori la rând:
`proba_gesturi_10.txt`, `proba_gesturi_11.txt`; doar telefonul: `proba_gesturi_9_tel.txt`) · `activitate.py lista` după probe:
0 rânduri „nu e în catalog” (`activitate_lista_dupa.txt`, doar numărătoarea). Capturile de telefon `_proba/tel_*.png` privite
(P4: muzica 0:00-0:18 la 70 %; atelierul cu toate testele bifate; laboratorul; finalul cu stelele).
`lectii/vii/m2-l15/_proba/reface_probele.py` (VII/15 extinde simulatorul): probele VII/14 prin el **0** (sim_proba, proba_gesturi),
`sim_text_proba` **0**; la VII/15 pică doar 2 verificări ale paginii LOR (laboratorul n-are „nu-ți face cont”), nu ale
simulatorului (`_proba/reface_probele_l15_1.txt`).

## 12. Reparațiile după judecata 3 (12.10.2026, seara)

Autor proaspăt; fiecare punct al judecății 3 (opus, `_verificare/judecator3.md` / `.json`: 0 GRAV, 1 MAJOR, 3 MINOR + o notă),
cu reparația, locul și proba: **`_verificare/registru_j1.md`, secțiunea „Judecata 3”** (literele T-X; toate reparate, niciuna
respinsă). Proba pe literă: `_proba/proba_reparatii_j3.py`. Nimic pornit: niciun Clipchamp, niciun Chrome / Edge real; nicio
pagină nouă de documentație (R2 vine din citatul deja pe disc, A32).

Ce s-a schimbat, pe scurt:
- **Simulatorul 1.2 (T, U)**: panoul de proprietăți stă SUB linia de timp (la 900 px și peste: coloană rezervată), deci pe
  telefon atingerea care alege o scenă nu mai mută linia de timp și nu mai șterge scena (12 din 12 atingeri pe dimineața /
  pădurea o ștergeau la 360-412 px); paza atingerii ignoră clicul care ar cădea pe alt lucru decât cel atins; Enter pe ↶ / ↷ / 🗑
  care devin inactive lasă focusul în simulator. Detaliile pentru lecția 15: §9, „Schimbat la reparația din 12.10.2026,
  judecata 3”.
- **Pagina**: „Cum lucrezi” și P3 „Uite cum” spun acum „în pagină, sub linia de timp” (era „sub previzualizare”); laboratorul,
  pasul 13: „așteaptă să se termine salvarea și încărcarea fotografiilor și a muzicii” (V); caseta P1: conectarea doar cu
  contul tău, fără cont nou, și fereastra Windows „ține minte contul pentru toate aplicațiile” → nu accepta / doar aplicația
  asta / nu știi → nu te conecta (W), aceeași regulă ca la pasul 3 al laboratorului.
- **`test_joc`: avertisment nou, „N1P2: pasul are 178 cuvinte”** — `test_joc` numără tot `text`-ul pasului, cu caseta „La
  calculator, acum” (89, cu cele cinci legături și semnele de punctuație) și legenda capturii. Textul pasului după regula 2
  (fără casetă și legende, `_proba/numara_cuvinte.js`) are tot 69 de cuvinte; doar caseta a crescut, cu paza de siguranță cerută
  de R3. Am încercat s-o scurtez sub pragul lui (150): ar fi trebuit scoase fie „alege doar aplicația asta” / „nu știi? nu te
  conecta” (ieșirea sigură), fie lista pașilor importului — n-am scos nimic din ele. Măsurătoarea: `_proba/numara_test_joc.js`.
- `_proba/proba_n5_tab.py` (al autorului) închide acum cu `ctx.close()` (X).

**Pentru lecția următoare (VII/15) s-a schimbat**: exact ce scrie în §9, „Schimbat la reparația din 12.10.2026, judecata 3”
(compatibil înapoi; locul `.vc-prop` și tipul nou de jurnal `clicIgnorat`). Fișierele lecției 15 nu le-am atins.

Efect al locului nou al panoului, prins de probe: pe telefon, biblioteca și pista audio încap acum deodată pe ecran, deci
`proba_gesturi.py` trage muzica de-adevăratelea în atelier (înainte folosea butonul +), iar ținta ei (0:00) cădea în afara
ferestrei liniei de timp derulate în lateral — defect al PROBEI, reparat în `din_biblioteca` (secunda țintă adusă în fereastră
prin derulare; ținta verificată pe pistă). Registrul, secțiunea „Judecata 3”, are detaliile. De văzut de profesor: pe telefon,
butonul plutitor „Spune cine ești” (al sitului, jos în dreapta) acoperă uneori capătul glisorului Volum din panoul de sub linia
de timp (captura `_proba/tel_P4.png`); se vede după o mică derulare.

Porțile, rulate după ultima schimbare (12.10.2026, 20:44-21:06, `_proba/porti_j3.sh` → `_proba/porti_j3_jurnal.txt`): test_joc
**TRECUT** („1 niveluri” + „N1P2: 178 cuvinte”, explicat mai sus) · verifica_lectie --fara-t1 **0** · sim_proba **0** (64 OK) ·
proba_reparatii **0** (160 OK) · proba_gesturi **0** (156 OK, 1280 + 390, până la diplomă) · proba_reparatii_j3 **0** (696 OK) ·
learninghub_date_personale **0** · `activitate.py lista`: 0 „nu e în catalog” înainte și după · `m2-l15/_proba/reface_probele.py`
**0** (probele VII/14 prin el, `sim_text_proba` și toate probele paginii VII/15: OK).
