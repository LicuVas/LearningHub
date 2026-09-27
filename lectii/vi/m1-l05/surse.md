# Surse — lecția VI · M1 · nr. 5: „Editarea prezentării: inserare, copiere, mutare, ștergere”

Autorul lecției, 27.09.2026. N-am atins `_motor\`, pagina lecției 4, nici `lectii/vi/index.html`; n-am făcut commit, n-am publicat.

## Programa și planul
- **Titlul** (exact): `Info_Gimnaziu_2026/planificari/Calendar_ore_VI.md`, rândul „06.10.2026 | 5 | M1 | Editarea prezentării: inserare, copiere, mutare, ștergere | predare”; la fel în `data/unitati.json` (VI-U1, lecția 5) și în `Proiectul_unitatii_VI-U1.md`.
- **Conținutul** (exact, `continuturi`): „Operații de editare a unei prezentări: inserare, copiere, mutare, ștergere a unui diapozitiv/obiect” — `C:\00\AI_0\data\informatica_gimnaziu\curriculum.json`, domeniul „Prezentări”, clasa a VI-a (OMEN 3393/2017). Competențele unității: CS.1.1, CS.3.1.
- **Ce acoperă lecția din conținut:** inserare (dublarea unui diapozitiv, lipirea unui diapozitiv sau obiect copiat; Diapozitiv nou e amintit din lecția 4), copiere (Dublare diapozitiv, Ctrl+C / Ctrl+V pentru obiecte și diapozitive), mutare (tragerea miniaturii; tragerea obiectului; Ctrl+X + Ctrl+V), ștergere (Delete / Ștergere diapozitiv pentru diapozitive, Delete pentru obiecte), plus anularea cu Ctrl+Z.
- **Ce NU am luat, deși lecția 4 (surse.md, „Ce preia lecția 5”) îl lăsa aici:** scrisul în celulele tabelului — nu e o operație de editare din lista programei (inserare, copiere, mutare, ștergere). **Decizia e a profesorului.** Mânerele (mărimea obiectelor) le-am lăsat pentru lecția 6 (formatarea obiectelor); pasul 5 doar avertizează să nu tragi de ele.

## Materialul refolosit
- **Lecția 4 (`lectii/vi/m1-l04/`)**: tema vizuală a seriei, povestea „Sistemul solar” (Ana Pop), simulatorul `SimPPT` (acum comun: `lectii/_sim/simppt.js`, vezi mai jos), profilul elevului.
- **Jocul `jocuri/prezentari-vi`, nivelul „Editez: inserez, copiez, mut, șterg” (`lectii:[5]`)**: ideea pașilor (meniul miniaturii, copiere/lipire cu selecție întâi, tragerea miniaturii în 4 pași) și captura reală `img/meniu-miniatura.webp`, decupată. N-am preluat mânerele și straturile (Bring to Front / Send to Back) și nici Hide Slide: nu sunt în conținutul lecției 5.
  - **Probat pe PowerPoint:** instrucțiunea jocului „clic pe miniatura diapozitivului următor; Ctrl+V” pentru un OBIECT copiat e corectă — cu panoul de miniaturi activ, Lipire pune obiectul pe diapozitivul ales, în același loc (`_proba/probe_fereastra.json#lipire_obiect_din_miniatura`).
- **Panglica reală:** `jocuri/_motor/panglica-powerpoint.js` (dump UI Automation, 27.09) — butoanele Paste, Cut, Copy din grupul Clipboard lucrează acum în simulator.
- **Lista oficială Microsoft a comenzilor** (`_cercetare/office_comenzi/M365_SAEC/powerpointcontrols.xlsx`): meniurile ContextMenuThumbnail, ContextMenuShape, ContextMenuPicture (ordinea elementelor din meniurile de clic dreapta ale simulatorului) și idMso-urile folosite în probe (DuplicateSelectedSlides, DeleteSlideContextual, Copy, Cut, Paste, PasteDuplicate, Undo).

## Imaginile (`img/`, proveniența în `img/SURSE.json`)
- `biletele-perete.webp` (pasul 0): fotografie „Off the wall ideas sticky notes SEI 2018”, embljusocmedia (Flickr), **domeniu public** pe Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Off_the_wall_ideas_sticky_notes_SEI_2018_(41779807090).jpg (redimensionată).
- `meniu-miniatura-editare.webp` (pasul 1): decupaj din captura reală `jocuri/prezentari-vi/img/meniu-miniatura.webp` (PowerPoint, 19.09.2026), fără Hide Slide.
- `soare-inainte-dupa.webp` (pasul 5): diapozitivul „Soarele” din prezentarea de lucru, desenat de PowerPoint (`Slide.Export`), înainte și după mutarea imaginii (`_proba/fa_inainte_dupa.py`). Refăcut după J08 FĂRĂ stea (copia deschisă doar în citire), ca să nu contrazică „o stea a ajuns pe Cuprins” din același exemplu.
- Capturile care lipsesc: `capturi_lipsa.json` (8; în pagină le ține locul simulatorul).

## Prezentarea de lucru descărcabilă
`sistemul-solar-de-editat.pptx` (43 KB), făcută prin COM (`_proba/fa_pptx.py`) și recitită (`_proba/fa_pptx.json`): 1 Sistemul solar · 2 Ce reținem · 3 Cuprins (cu o săgeată în plus) · 4 Soarele (imaginea peste text, steaua aurie în colț) · 5 Pisica mea · 6 Planetele. E aceeași cu atelierul simulat. Pașii provocării au fost făcuți prin COM pe o copie a fișierului și dau exact starea promisă (`_proba/probe_com.json#drumul_provocarii`). Imaginea soarelui e un desen făcut cu PIL, nu o fotografie.

## Probele în PowerPoint-ul real (afirmatii.json: 34 de afirmații; 23 CONFIRMAT, 5 PARȚIAL, 5 NETESTABIL_COM, 1 DOCUMENTAT)
- **După judecător (J01):** linia de la tragerea miniaturii NU e probată (tragerea OLE nu se poate face cu mesaje trimise, nici pe desktopul ascuns). Textul spune acum ce e adevărat în ambele cazuri: „între miniaturi apare un spațiu sau o linie”; provocarea: „până sub ultima miniatură („Luna”), și dă-i drumul acolo”. Captura C1 hotărăște.
- **Meniul de clic dreapta al fundalului (J02):** l-am încercat pe desktopul ascuns cu clic dreapta trimis ca mesaj (`_proba/probe_meniu_fundal.py`): PowerPoint nu deschide meniul la mesaje trimise. Elementele din simulator sunt din memoria interfeței: NESIGUR, captura C7.
- **COM fără fereastră** (`_proba/probe_com.py` → `probe_com.json`, 13 probe): dublare, ștergere cu renumerotare, MoveTo, copiere/decupare/ștergere de obiecte, lipire pe același diapozitiv (deplasare 12 pt), lipire de două ori, copiere/decupare de diapozitive, drumul întreg al provocării.
- **Cu fereastră, pe un DESKTOP ASCUNS** (`C:\00\AI_0\tools\hidden_desktop.py`; ecranul profesorului nu a fost atins): `_proba/probe_fereastra.py`, `probe_selectie.py`, `depanare_miniatura.py`. Comenzile sunt date ca butoanele aplicației (ExecuteMso): Delete Slide din meniul miniaturii, Undo (o dată și de două ori), Duplicate Slide, Copy/Cut/Paste cu panoul de miniaturi activ sau cu diapozitivul activ, Duplicate (Ctrl+D), plus ce diapozitiv rămâne ales după ștergere, lipire, decupare.
- **Regulile de siguranță respectate:** fiecare probă verifică întâi că nu rulează niciun POWERPNT.EXE (dacă rula, proba nu pornea); PowerPoint pornit de probă e închis la final; `tasklist` înainte și după: niciun PowerPoint rămas.
- **Atenție pentru cine reia probele:** clipboardul Windows e COMUN tuturor proceselor din sesiune, inclusiv desktopului ascuns. Prima rulare a probei „lipire din miniatură” a lipit un text străin („sandviș.”), copiat între timp de alt proces (alt agent care proba Word). Reluarea verifică formatele clipboardului înainte de Paste (`PowerPoint 12.0 Internal Shapes`) și aruncă încercările stricate. Probele mele au scris și ele în clipboard (forme PowerPoint), deci pot fi încurcat, la rândul lor, o probă paralelă cu Copy/Paste.

## Numele românești (Office în română)
- **Confirmate în calibrare** (`calibrare/meniuri_ro_en.json`): Pornire (Home), Inserare (Insert), Diapozitiv nou (New Slide), Aspect (Layout); Copiere (Copy), Decupare (Cut), Lipire (Paste), Anulare (Undo) — ultimele patru confirmate pentru Word/Excel, controlul e comun Office.
- **NESIGURE** (o singură pagină Microsoft, nu două documente):
  - „Dublare diapozitiv” (Duplicate Slide) și „Ștergere diapozitiv” (Delete Slide): support.microsoft.com/ro-ro, „Adăugarea, rearanjarea și ștergerea diapozitivelor în PowerPoint” — citat: „faceți clic dreapta pe miniatura diapozitivului pe care doriți să-l dublați, apoi faceți clic pe Dublare diapozitiv . Dublarea este inserată imediat după original.” și „…faceți clic dreapta pe diapozitiv în panoul de miniaturi din stânga, apoi selectați Ștergere diapozitiv.” (`calibrare/_cache/503a9ab3b199fb0a.txt`).
  - „Vizualizare protejată” (Protected View) și „Activare editare” (Enable Editing): support.microsoft.com/ro-ro, „Ce este Vizualizarea protejată?” — citat: „Pe Bara de mesaje , selectați Activare editare .” (copie: `_proba/ms_vizualizare_protejata.html`).
  - „Dublare diapozitive selectate” (Duplicate Selected Slides, în lista New Slide ▾ a simulatorului): traducerea mea, nevăzută într-o sursă.
  - „Fișier (File) → Salvare ca (Save As)”: folosite și în lecțiile 3-4; „Salvare ca” nu e în calibrare.
- În simulator, meniurile sunt în engleză (ca pe calculatorul de lucru); lângă comenzile care lucrează scrie, cu gri, numele românesc.

## Simulatorul comun `lectii/_sim/simppt.js` (proprietar: autorul acestei lecții)
- **Proveniența:** copiat din `SimPPT`-ul paginii lecției 4 **după** apariția `m1-l04/_verificare/reparatii.md`. Pagina lecției 4 s-a mai schimbat în timp ce lucram; baza finală e versiunea cu **sha256 `3e3ad337512e4c710e755a9a9d4253788cc319a348a687819fc180fce55b6698`** (instantaneu: `_proba/l04_reparat.html`). Prima mea copie (înainte de reparații) pornise de la sha256 `9d06c564611de314aeda8882069a66f6b0887a638ac36ac945d859d2b013daee` (`_proba/l04_baza.html`); diferențele de simulator dintre cele două (`_proba/diff_sim_l04.py` → `diff_sim_l04.txt`, 127 de rânduri) sunt toate preluate: J01 tastele pe document, J02 câmpuri pe mai multe rânduri, J03 filele contextuale, J07, J08, J09 (inclusiv nota grilei pe atingere), J18 (6 iconițe), tabelul „Soarele / În cifre”.
- **Ne-regresie:** pagina lecției 4, cu simulatorul ei înlocuit de `simppt.js`, trece poarta: `[TRECUT] l04sim · întrebări jucate: 24` (`_proba/l04_cu_sim_comun.py`; copia se șterge după probă). Lecția 4 rămâne cu copia ei, cum cere standardul.
- **Ce am adăugat** (fiecare comportament probat în PowerPoint, vezi afirmatii.json A30-A31 și probele): meniul de clic dreapta al miniaturii și al obiectului, tragerea miniaturii cu linia de inserare, tragerea obiectelor (caseta și substituentul: de chenar), săgețile, Duplicate Slide / Ctrl+D / Duplicate Selected Slides / Copy ▾ Duplicate, Delete pe miniatură, Copy/Cut/Paste pentru diapozitive și obiecte (Ctrl+C/X/V, panglică, meniuri), lipirea deplasată pe același diapozitiv, alegerea după ștergere/decupare, Ctrl+Y, Esc în scris = caseta întreagă, butoanele tastelor pentru telefon, 3 miniaturi pe rând pe ecran îngust.
- **Pe telefon:** meniul de clic dreapta = degetul ținut apăsat, apoi ridicat; tragerea miniaturii = degetul ținut o clipă (chenarul se colorează), apoi tras; un obiect se atinge întâi (să aibă chenar), apoi se trage; tastele sunt butoane sub fereastră. Toate spuse pe ecran (pași + introducerea atelierului).
- **Reparat după judecătorul lecției 5 (J02, J03, J04, J09, J10):**
  - clic dreapta (pe telefon: deget ținut) pe o parte goală a diapozitivului = meniul diapozitivului (Paste Options lipește; Cut/Copy gri); pe textul unui substituent sau al unei casete = intri în scris + meniul textului (Exit Edit Text, Font..., Paragraph...; Cut/Copy gri fără litere alese); pe chenar = meniul obiectului;
  - lista de anulare primește scrisul doar dacă textul s-a schimbat (un clic în titlu nu mai lasă un pas gol); cu cursorul în text și nimic scris, Ctrl+Z anulează pasul dinainte din prezentare;
  - caseta de text, tabelul și substituentul se trag DOAR de chenar (din text alegi litere); chenarul unui obiect neales stă sub obiectele puse după el, ca un clic pe steaua de peste titlu să nimerească steaua;
  - pe telefon, un obiect neales tras cu degetul derulează pagina, iar simulatorul spune „îl atingi o dată, apoi îl tragi”;
  - testul nou `copieDin`: „făcut prin dublarea lui” se verifică după proveniență, nu după conținut (o stea în plus pe copie pică testul stelelor, nu pe cel al dublării).
- **Abateri spuse pe ecran:** în celulele tabelului nu se scrie; mânerele nu schimbă mărimea (mesaj: lecția 6); un substituent copiat se lipește ca o casetă de text; prezentarea nu poate rămâne fără niciun diapozitiv; filele contextuale n-au butoane; comenzile din meniuri care nu țin de lecție spun „nu e folosită în lecția asta”.
- **NESIGUR în simulator:** iconițele rândului Paste Options (Use Destination Theme, Keep Source Formatting, Picture) și etichetele exacte din meniurile de clic dreapta ale formelor/imaginilor, fundalului și textului (capturile C5-C8); semnul de la tragerea miniaturii (C1: simulatorul desenează o linie).

## Probele lecției
- Poarta: `python C:/00/Projects/LearningHub/jocuri/_motor/test_joc.py --dir C:/00/Projects/LearningHub/lectii/vi m1-l05` → `[TRECUT] m1-l05 · întrebări jucate: 21 · diacritice/1000: 57.8` (singurul avertisment: „1 niveluri”, așteptat).
- Reparațiile judecătorului, cu gesturi reale (`_proba/proba_reparatii.py`, 1280 px + 390 px atingere): 16/16 OK, 0 erori în consolă.
- Gesturi reale (`_proba/proba_gesturi.py`): 1280 px cu mouse + tastatură și 390 px cu atingere (evenimente touch adevărate prin CDP): toate cele 5 exerciții „Încearcă”, atelierul și verificări de fidelitate, fiecare terminat cu „Verifică” apăsat → **37/37 OK, 0 erori în consolă, nimic mai lat decât ecranul**. Captura: `_proba/_proba_telefon.png` (atelierul la 390 px, meniul miniaturii deschis cu degetul).
- Cuvintele pe pas (`_proba/numara_cuvinte.py`): text 61-106, „Uite cum” 29-57, toate în limite.

## În afara lecției (de știut)
- Panoul de prezență al sitului („Spune cine ești” / pastila „Sunt elev — mă înscriu”, fix jos) acoperă la 390 px butoanele tastelor de sub simulator până derulezi; e același defect semnalat de judecătorul lecției 4.
- Motorul numără pasul 0 „La ce folosește” ca „Pasul 1 din 6” (semnalat și de lecția 4).
- `_proba/` (scripturi, capturi, instantanee ale lecției 4) **nu trebuie publicat** pe sit.
