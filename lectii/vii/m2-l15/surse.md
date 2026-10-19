# VII · M2 · lecția 15 — Generice: suprapunerea textului peste scene

Scrisă 12.10.2026 (ziua) de autorul lecției, fără profesor; deciziile, cu motivul, mai jos și în `_proba/stare_autor.md`.
Nu e publicată, nu e în depozit (fără commit).

## Pentru profesor (întrebări care țin lecția în laborator)

1. **Data.** În `Calendar_ore_7_MA.md` lecția 15 cade pe **25.12.2026** (vacanță); la VII A / VII B e ora 16 a anului,
   **12.01.2027** (M3). Lecția e scrisă la fel pentru toate.
2. **Contul și exportul.** Laboratorul are regula lecției 14 reparate: elevul se conectează doar cu contul LUI, se uită al cui e
   contul (pictograma de utilizator) și la final se **deconectează** (≡ › Înapoi la pagina de pornire › pictograma de utilizator
   › Deconectare). Cu un cont **personal**, filmul exportat ajunge „de obicei” în **Descărcări**; cu un cont de **școală**, în
   **OneDrive**, în folderul **Exports** al proiectului (T7). Lecția îi spune elevului să caute în Descărcări și, dacă nu e
   acolo, să scrie ce i-a arătat Clipchamp și să vă spună. Ce cont au elevii în laborator?
3. **Fișierul .mp4** rămâne în Descărcări, lângă fotografii și muzică (câțiva MB). Lecția 16 (mini-proiectul) îl poate
   folosi. Dacă vreți să-l șteargă la final, se adaugă un pas.
4. **Regula timpului de citire** („un text stă cât să fie citit de două ori; în gând citim cam 3 cuvinte pe secundă”) e a
   lecției: pornește de la BBC (160-180 de cuvinte pe minut, cel puțin ~0,3 s pe cuvânt) și pune de două ori, pentru copii și
   pentru că privitorul se uită și la imagine (T10). Dacă vreți altă regulă, se schimbă textul pasului 2 și 5 exerciții.
5. **Verificarea „de la distanță”** (activitatea dumneavoastră) e făcută fără videoproiector: elevul dă căștile jos, le lasă pe
   masă și se ridică lângă scaun (nu pleacă de lângă masă; „trei pași înapoi” cu căștile pe urechi a fost scos la reparația J1);
   în pagină, butonul „Privește ca de departe”. La oră, videoproiectorul o face mai bine.
6. **Genericul cu autorii** (reparația J1): la CC0 licența nu obligă, dar lecția cere autorul, ca la clasa a V-a („Și la domeniu
   public scrii autorul”). Genericul are 15 cuvinte → 10 s (0:18-0:28), iar muzica are 24 s: ultimele 4 secunde ale filmului
   sunt în liniște (spus elevului). Dacă vreți muzica până la capăt, se poate da o muzică mai lungă — dar proiectul din lecția 14
   are deja fișierul de 24 s.

## 1. Programa și planul profesorului

- **Titlul** (exact): `Info_Gimnaziu_2026/data/unitati.json`, VII-U2 „Aplicații audio și audio-video”, lecția 15, predare.
- **Conținutul din programă** (OMEN 3393/2017, `C:\00\AI_0\data\informatica_gimnaziu\curriculum.json`, copiat exact):
  „Generice – suprapunerea textului peste scene”. Competențele unității: CS.1.2, CS.3.2.
- **Activitatea profesorului** (`data/activitati_lectii_VII_VIII.json`, VII/15): „Realizarea genericului de început și de
  final: nume, rol, sursă a materialelor folosite. Se verifică lizibilitatea textului peste imagine, de la distanță.”
  Resurse: „laborator, videoproiector pentru verificare”. → genericul de început = P1-P3 (titlul), de final = P4 (rol + nume,
  sursele), lizibilitatea = P3 (contrast, mărime, loc, „privește de departe”: căștile pe masă, în picioare lângă scaun).
- **Granița** (promptul autorului): 14 = proiectul „munte” (4 scene, o tranziție, muzica), fără text și fără export. Aici:
  genericul, textul peste scenă (fila Text, un stil, scrisul, locul pe ecran, durata pe pista Text, cu mutare și mânere),
  citețul (contrast, mărime, puține cuvinte, timpul de citire), genericul de final cu sursele (CC0 / CC BY) și **exportul**
  (D1). **NU**: efecte video, filtre, animații de text.
- Legătura cu clasele anterioare (verificată): clasa a V-a, lecția 15 „Salvarea informațiilor de pe Internet. Drepturile de
  autor” (unitati.json V-U3; `lectii/v/m2-l15`: drepturile de autor, licențele libere, BY, „Use this file on the web”);
  VII/13: muzica CC0 („o poate folosi oricine, fără să ceară voie”); VII/12: proiectul se deschide doar în aplicația lui.

## 2. Ce presupun că știe elevul

`profil.json` (cu lecția de unde vine fiecare lucru): proiectul din lecția 14 și gesturile ei (linia de timp, mânerele,
tragerea, ↶, previzualizarea, + Mărește), lecția 12 (proiectul), lecția 13 (CC0), lecția 3 (Descărcări, regula numelui),
clasa a V-a (extensia; drepturile de autor și licențele libere).

## 3. Aplicația: Clipchamp (Windows 11), DOAR din documentație și din capturile existente

**Clipchamp NU a fost pornit** (aplicație din Magazin: s-ar deschide pe ecranul vizibil al profesorului și cere cont; regula
zilei 12.10.2026). Niciun Chrome / Edge real. Faptele vin din:
- **Documentația oficială Microsoft și blogul Clipchamp**, descărcate cu curl (fără cont, User-Agent `LearningHub-lectii/1.0`)
  în `_proba/docs/` (`descarca.py` cu `urls.txt` … `urls4.txt`; paginile contului, ale exportului și ale ieșirii din editor
  copiate din `lectii/vii/m2-l14/_proba/docs/`); citatele în `_proba/docs/citate_text.md` (T1-T11), verificate cu
  `_proba/docs/verifica_citate.py` (53 de bucăți, 0 negăsite). Principalele:
  - https://support.microsoft.com/en-us/clipchamp/how-to-add-text-and-titles-to-a-video (EN + RO) — fila Text, adăugarea
    „above your video”, câmpul de text din panoul de proprietăți, font / dimensiune / aliniere / culoare / culoare de fundal,
    mânerele, Delete, înlocuirea;
  - https://support.microsoft.com/en-us/clipchamp/how-to-add-end-credits-to-a-video (EN + RO) — Enter = rând nou, genericul
    pe negru pe un loc gol al liniei de timp;
  - https://clipchamp.com/en/blog/add-text-animation-video/ — poziția (tras pe „stage”, presetări top / middle / bottom),
    mărimea (listă cu numere), culoarea; https://clipchamp.com/en/blog/add-motion-titles-videos-slideshows/ — „high contrast”;
  - https://support.microsoft.com/en-us/clipchamp/exporting-and-saving-a-video-in-clipchamp (EN + RO) — Export dreapta sus,
    MP4, 1080p „presentations”, 720p, Descărcări „de obicei”, contul de școală → OneDrive / Exports;
  - paginile contului (pictograma de utilizator, Deconectare) și ale ieșirii din editor (≡, Înapoi la pagina de pornire);
  - https://www.bbc.co.uk/accessibility/forproducts/guides/subtitles/ — viteza de citire (T10);
  - Creative Commons: CC0 1.0 (RO + EN), CC BY 4.0 (RO + EN), „Recommended practices for attribution” (TASL, CC0) (T11).
- **Capturile reale Clipchamp în română** din jocul `jocuri/audio-video-vii` (`img/SURSE.json` al jocului, 20.09.2026):
  `clipchamp-text.webp` («Text», «Text simplu», «Stiluri de text», «Casetă text», textul peste imagine, meniul cu «DM Sans»,
  «36») și `clipchamp-export.webp` («Exportați videoclipul», «Calitate», «4k» / «1080 p» «Calitate înaltă» / «720 p»
  «Fișier mai mic, export mai rapid», «Numele fișierului», «.mp4», «Store in the cloud», «Exportați»). Refolosite cu calea
  `../../../jocuri/audio-video-vii/img/…`.

## 4. Ce n-am putut verifica (NESIGUR)

1. Etichetele RO exacte din panoul textului: „Dimensiune”, „Culoare”, „Culoare de fundal” (din ajutorul tradus), „Poziție”
   și presetările sus / la mijloc / jos (doar EN, în blog); dacă Text simplu are culoare de fundal („pentru unele opțiuni de
   text”). `capturi_lipsa.json`. Pagina spune „Poziție (sus, la mijloc, jos)”, fără să dea etichete RO de buton drept sigure.
2. Textul implicit, durata implicită a unui Text simplu și locul lui la „+” (simulatorul: „Text”, 5 s, la capul de redare);
   forma butonului + pe miniatura textului. Lecția cere mereu „mută-l de mijloc și potrivește-l cu mânerul”.
3. Fereastra de export: captura are buton «Exportați»; ajutorul pentru conturi personale spune că exportul pornește imediat
   ce alegi calitatea. Laboratorul le acoperă pe amândouă. Ce arată Clipchamp după export și unde ajunge fișierul în contul
   din laborator (Descărcări / OneDrive): întrebarea 2 pentru profesor. Numele implicit al fișierului (captura: „Video
   Project 1”; simulatorul: numele proiectului).
4. Ce face exact „Store in the cloud” (dedus din ajutorul pentru conturile de școală); laboratorul spune doar „lasă-l oprit”.
5. Aplicația care deschide un .mp4 cu dublu clic pe calculatoarele din laborator.
6. Scara literelor în simulator (36 ≈ o zecime din înălțimea cadrului, ca în captură); pragul „Dimensiune cel puțin 48” e al
   exercițiilor din pagină; în laborator elevul mărește „până se citește de departe” (în picioare, lângă scaun), fără număr.

7. (reparația J1) Butonul + al miniaturii Text simplu: în captura reală nu se vede; probabil apare cu mouse-ul deasupra (spus așa).
8. (reparația J1) Exportul la un cont personal pornește la alegerea calității (documentat); numele fișierului atunci = al
   proiectului (PRESUPUS; lecția nu-l promite, cere doar ca proiectul să aibă întâi numele elevului). Al doilea export cu
   același nume: „de obicei” cu (1) la capăt (DEDUS, ca descărcările din VII/14).
9. (reparația J1) Întrebarea Windows „să-ți țin minte contul… pentru toate aplicațiile?” — ca la VII/14 (NESIGUR, nepornit).

## 5. Fișierele lecției

- **Scenele și muzica** — copiate din lecția 14 (sha1 identic), ca lecția 15 să nu depindă de publicarea lecției 14: `scena-1…4`
  (`.jpg` de descărcat, `img/*.webp` în pagină), toate **CC0** (autorii în `img/SURSE.json` și în surse.md al lecției 14 §5);
  `muzica-fundal.wav` (Erik Satie, „Gymnopédie nr. 1”, interpretare Teknopazzo, Wikimedia Commons, **CC0**; sha1 `2d39faaf…`).
  `unde.js` = vârfurile muzicii, din `lectii/vii/m2-l14/unde.js` (variabila redenumită `UNDE_L15`, `_proba/fa_date.py`).
- **`lum.js`** — luminanța fiecărei scene pe o grilă 8 × 4 (`_proba/lum_scene.py` → `lum_scene.json` → `fa_date.py`), pentru
  contrastul textului în simulator.
- **Pasul 0**, verificate pe pagina fișierului prin API-ul Commons (User-Agent `LearningHub-lectii/1.0 (educational site)`),
  sha1-ul descărcării = cel de pe Commons, micșorate la 960 px, `.webp` fără metadate (`_proba/img_generice.py`):
  - `img/generic-inceput.webp` — „Piti Yindee - Fossils (2021) - Title Card.jpg”, Piti Yindee, **CC0**,
    https://commons.wikimedia.org/wiki/File:Piti_Yindee_-_Fossils_(2021)_-_Title_Card.jpg
  - `img/generic-final.webp` — „Esimerkki lopputekstit.png” (exemplu de generic de final, în finlandeză), Zunter,
    **domeniu public**, https://commons.wikimedia.org/wiki/File:Esimerkki_lopputekstit.png (decupată partea de sus, 16:9).
- Fișiere .docx/.pptx/.xlsx: niciunul → `curata_metadate` nu se aplică. Lecția nu vorbește de note.

## 6. Simulatorul (extensie NOUĂ)

`lectii/_sim/video-clipchamp-text.js` (proprietar VII/15), peste `lectii/_sim/video-clipchamp.js` (lecția 14, acum 1.1),
**fără să-l schimbe**: doar API-ul lui public. Tipul motorului: `TipVideoClipchampText` (`{t:'videoclipchamptext', catalog,
start, teste, solutie, gresit, export?}`). Ce adaugă, lista FIDELITATE (D / C / P), abaterile spuse pe ecran, verificările
noi și API-ul: capul fișierului. Pe scurt: fila Text (Text simplu, Casetă text; + sau tragere pe pista Text, cu „lipire” la
margini; un stil tras peste un text îl înlocuiește), panoul textului (căsuța Text cu Enter = rând nou, Dimensiune, Culoare,
Culoare de fundal, Poziție sus / mijloc / jos), textul peste previzualizare (culoarea, mărimea, locul; tras cu mouse-ul sau
cu degetul), rândul „Text pe ecran”, genericul pe negru după ultima scenă, fereastra „Exportați videoclipul” (Calitate,
Numele fișierului, .mp4, Store in the cloud, bara de progres), „Privește ca de departe” (în afara ferestrei Clipchamp; până la 1.0 „ca de la 3 pași”).
Contrastul „citeț” = calculat pe fotografia reală de sub text (prag 3:1, WCAG, text mare). Focusul: după un clic / o
atingere pe butoanele extensiei revine pe simulator (Ctrl+Z, Space, Delete merg imediat); după tastatură rămâne pe buton;
câmpul de text își păstrează tastele (Space / Delete nu scapă spre simulator).
Probe: `_proba/sim_text_proba.py` (API: 39 de cazuri × 1280 / 390 px + tastele reale în câmpul de text) și
`_proba/proba_gesturi.py` (lecția întreagă, gesturi reale, fără `focus()` de probă). Toate probele, și ale lecției 14:
`python _proba/reface_probele.py` (ultima linie 0).

## 7. Decizii (de ce așa)

- **D1 Exportul INTRĂ** (P5): P0 + 5 pași sunt câte o idee (titlul peste scenă · când apare și cât stă · se citește ·
  genericul de final cu sursele · exportul), toți între 66 și 86 de cuvinte. E firesc la sfârșitul filmului, iar lecția 16
  (mini-proiectul) are nevoie de el. Faptele: captura reală + documentația (D/C în afirmatii.json A16-A19).
- **D2 Regula timpului**: de două ori o citire; o citire ≈ 3 cuvinte pe secundă (BBC) → secunde ≥ cuvinte × 2 : 3 (4 cuvinte
  ≈ 3 s, 6 → 4 s, 9 → 6 s, 12 → 8 s). Respinsă: „o secundă pe cuvânt” (genericul de final de 9 cuvinte ar fi cerut 9 s).
- **D3 Genericul de final pe negru**, după ultima scenă (documentat). **Reparația J1 (G2):** cu autorii, pe patru rânduri —
  „Montaj: <nume>” / „Foto: Anderson, Gilmore, Gugalcrom123, deSousa” / „Muzica: Erik Satie, Teknopazzo” / „CC0, Wikimedia
  Commons” (15 cuvinte → 10 s → 0:18-0:28); muzica lungită până la capătul ei, 0:24; ultimele 4 s în liniște, spus în pagină.
  Respinse: genericul peste seară (cere Culoare de fundal, NESIGURĂ la Text simplu, sau cel mult 2 rânduri ca să fie citeț pe
  munți), o muzică nouă mai lungă (proiectul din lecția 14 are fișierul de 24 s), genericul fără autori (contrazice V/15).
- **D4 Ce scrii** (reparația J1, G2): CC0 → fără voie, licența nu obligă; la școală scrii totuși autorul, licența și de unde e,
  ca la domeniul public din clasa a V-a (V/15; Legea 8/1996 art. 10 lit. b), art. 11 alin. (1); exemplul Creative Commons pentru
  CC0 pune și el autorul); CC BY → autorul și licența, obligatoriu, plus de unde (și titlul, dacă are; dacă ai schimbat-o, spui) — TASL. Exemplele cu nume (Ion Pop, Ana Pop, Pop Mihai) sunt
  inventate.
- **D5 Contrastul** se predă în cuvinte („text deschis pe o parte întunecată / închis pe o parte luminoasă”); simulatorul îl
  socotește pe fotografia reală, ca exercițiile să se poată rezolva pe orice drum valid (mutat, altă culoare, fundal).
- **D6 „De la distanță”** (reparată la J1): în laborator, căștile jos pe masă, în picioare lângă scaun; în pagină, butonul
  „Privește ca de departe” (spus pe ecran că nu e în Clipchamp).
- **D7 Contul**: regula lecției 14 reparate, la fel (laboratorul: pașii 2-4, 13, 15). Lecția 15 începe cu elevul deconectat.
- **D8 Regula 10** (reparată la J1, G1): caseta „La calculator, acum” la fiecare pas face gestul NOU, în filmul copilului
  (titlul; mutat + mâner + privit; locul / culoarea / mărimea + privit de departe; genericul cu autorii + Enter + mânerele;
  exportul + Descărcări). Laboratorul (18 pași) NU le reface: verifică ce s-a făcut, completează ce lipsește („l-ai pus la
  pași? nu mai pune altul”), exportă o singură dată (doar dacă n-ai exportat sau ai schimbat ceva după), apoi contul.
- **D9 Telefonul**: + Mărește pentru mânere, Potrivește pentru mutări lungi, „loc gol al pistei” când un clip ales e îngust
  (spus în „Cum lucrezi”); un text nou nu rămâne ales, ca să se poată trage de oriunde.
- **D10 Extensie, nu simulator nou** (cererea): tot ce știa lecția 14 rămâne neatins.

## 8. Porțile autorului (rulate de mine, ultima dată după ultima schimbare)

- `test_joc.py --dir lectii/vii m2-l15` → **TRECUT** (26 de întrebări/exerciții jucate; doar „1 niveluri”) — `_proba/test_joc_*.txt`.
- `verifica_lectie.py index.html --fara-t1` → ultima linie **0** (S0, S1 0/0, S2 6/6, T0 0) — `_proba/verifica_*.txt`.
- `_proba/sim_text_proba.py` → **0**; `_proba/proba_gesturi.py` (pc + tel) → **0**; capturile de telefon `_proba/tel_*.png` privite.
- Probele lecției 14 (`sim_proba.py`, `proba_gesturi.py`) pe simulatorul 1.1 rulate și ele de `_proba/reface_probele.py`:
  extensia nu e încărcată în pagina lecției 14 și nu-i schimbă nimic.
- `C:/00/AI_0/tools/learninghub_date_personale.py` → **0** (`_proba/date_personale.txt`).
- Nimic pornit pe calculatorul profesorului: niciun Clipchamp, niciun Chrome / Edge real, niciun Audacity.

**Rulare finală, 12.10.2026, după reparația probelor** (`_proba/reface_total.txt`, ultima linie **0**; toate cu simulatorul 1.1):
- `reface_probele.py` → **0**: VII/14 sim_proba 0 · VII/14 proba_gesturi 0 · VII/15 sim_text_proba 0 · VII/15 proba_gesturi (pc + tel) 0 ·
  test_joc TRECUT · verifica_lectie 0 · verifica_citate 0 · numara_cuvinte (pași 66-86, „Uite cum” ≤ 53) · date personale 0.
- `test_joc.py --dir lectii/vii m2-l15` → **[TRECUT]** (26 jucate; avertismente: „1 niveluri”; „N1P2: pasul are 153 cuvinte” — doar avertisment, neatins) — `_proba/test_joc_final.txt`.
- `verifica_lectie.py index.html --fara-t1` → ultima linie **0** (BLOCHEAZĂ PUBLICAREA: 0) — `_proba/verifica_final.txt`.
- `learninghub_date_personale.py` → **0** (fișiere cu date personale: 0) — `_proba/date_personale_final.txt`.
- `activitate.py lista | grep -c "nu e in catalog"` → **0**.
- Aliniate în probe (nu în lecție): (1) `proba_gesturi.py`: „nu-ți face cont” se caută fără litere mari (`.lower()`); (2) „Verifică” se socotește doar dacă clicul a ajuns la buton
  (ascultare pasivă, regula VII/14 §9; fără focus() sau clic sintetic de probă; proba de telefon a lecției 15 folosește evenimente pointer sintetice, nu atingere CDP cu ridicare în viteză, deci
  slăbiciunea cu «fling» nu se aplică, oprirea de ~120 ms n-a fost nevoie); (3) `tot_filmul()`: așteaptă oprirea redării (cel mult 3×durata) în loc de durata+0,8 s fix — o rulare
  cu mașina încărcată a dat fals 22,8 s în loc de 24; (4) `reface_probele.py`: ultima linie se ia din stdout, fără traseul serverului http local al probei VII/14 care vine după rezultat.


## 9. Pentru lecția următoare (VII/16: mini-proiectul; cine mai lucrează în Clipchamp)

- **Ce are elevul după lecția 15**: proiectul „…munte” cu titlu (0:00-0:04), genericul de final pe negru (0:18-0:28, patru rânduri: „Montaj:”
  + numele, autorii fotografiilor, autorii muzicii, „CC0, Wikimedia Commons”), muzica până la capătul ei, 0:24 (reparația J1), exportat în 1080 p ca `Nume_Prenume_clasa_munte.mp4` (de obicei în
  Descărcări); deconectat din Clipchamp la final. Pe drumul de rezervă: atelierul din pagină și genericul scris în caiet.
- **Predat aici, de reluat**: fila Text, Text simplu, căsuța Text (Enter), mutarea și mânerele textului, contrastul /
  mărimea / locul, verificarea de departe (căștile pe masă, lângă scaun), regula „de două ori, ~3 cuvinte pe secundă”, genericul de final (rol + nume,
  sursele; CC0 / CC BY), exportul (Exportați, 1080 p, Numele fișierului, .mp4, Descărcări), deconectarea.
- **NEpredat**: exportul audio din Audacity (Fișier › Exportă audio…), fade in / out în Clipchamp, efectele, filtrele,
  animațiile de text, tăierea în două (✂), fila Audio pentru vocea filmată, filmarea cu telefonul și acordul celor filmați.
- **Extensia** `lectii/_sim/video-clipchamp-text.js` (proprietar VII/15): pentru un atelier de mini-proiect se folosește ca
  atare (`{t:'videoclipchamptext', export:true, …}`); API-ul în capul fișierului. **NU schimba** numele verificărilor
  (`textScris`, `textContine`, `textLa`, `textPanaLa`, `textDurataMin`, `textCitet`, `textMarime`, `textDupaFilm`, `nrTexte`,
  `muzicaPanaLaFinal`, `exportat`), acțiunile din `simuleaza` (`textNou`, `textScrie`, `textMuta`, `textCapat`, `textCuloare`,
  `textMarime`, `textPoz`, `textXY`, `textFundal`, `textAlege`, `textSterge`, `textPeste`, `exporta`, `departe`) și forma lui
  `start.text` (`{text, start, durata, culoare?, marime?, poz?, x?, y?, fundal?, stil?}`); dacă îți trebuie altceva, scrie o
  extensie nouă. După orice schimbare (aici sau în `video-clipchamp.js`): `python lectii/vii/m2-l15/_proba/reface_probele.py`
  → ultima linie 0.
- **De știut**: catalogul unei scene trebuie să aibă `lum` (grila de luminanță, `_proba/lum_scene.py`), altfel `textCitet`
  nu are pe ce socoti; extensia mărește în paginile ei pista Text și pista Audio (mânerele ≥ 32 px pe telefon).
- **Pentru proprietarul lui `video-clipchamp.js` (VII/14)**: pe pista Audio, mânerele clipului ales au 29 px înălțime
  (sub 32 px, regula 20) — în pagina lecției 14; în paginile extensiei le-am mărit eu, din CSS-ul extensiei.

## 10. Lecțiile și jocurile folosite

- Modele: `lectii/vii/m2-l14` (structura, tonul, caseta „La calculator, acum”, probele, laboratorul reparat, simulatorul),
  `m2-l13`, `m2-l12`, `m2-l11`; judecătorii lor (rezumat: focusul după butoane, tastele în toate stările, numele la prima
  apariție RO + EN, laboratorul fără profesor și fără cont străin, întrebările = situații noi).
- Joc: `jocuri/audio-video-vii` nivelul 6 („Scene, tranziții, generice”, lecțiile 14-15): ideile „genericul de început /
  de final”, „contrast”, „fiecare material are sursa precisă”, „stă destul cât să fie citit de două ori” — verificate pe
  surse și reformulate; capturile Clipchamp (text, export).
- Clasa a V-a, lecția 15 (`lectii/v/m2-l15`): drepturile de autor și licențele libere — doar amintite.

## 11. Reparațiile după judecata 1 (12.10.2026)

Registrul, literă cu literă (25 de puncte: A-X din cele două judecăți, Y cererea dirijorului): `_verificare/registru_j1.md`.
Proba fiecărei reparații: `_proba/proba_reparatii.py` (1280 px mouse + taste, 390 px atingere; `--mutanti`) → `_proba/proba_reparatii_N.txt`.

**Ce s-a schimbat în lecție.** Laboratorul (18 pași) verifică ce au făcut casetele, nu reface (G1); contul = lecția 14 reparată,
întocmai (pașii 3, 4, 16, 18 — `_proba/j1_aliniaza_cont.py` îi copiază din fișierul ei; se rulează din nou dacă VII/14 se mai
schimbă); drumul de rezervă scris pas cu pas (6-7); CC0 + autorul, genericul cu autorii, 0:18-0:28, muzica până la 0:24 (G2);
fundalul, numele EN, exportul (întâi numele) scrise prudent; „trei pași înapoi” scos; caseta P1 scurtată; Î3, P2, P3 reformulate.

**Simulatorul — API-ul s-a schimbat (compatibil înapoi).** `lectii/_sim/video-clipchamp-text.js` **1.1**: tot ce era rămâne
(verificările, acțiunile din `simuleaza`, forma lui `start.text`, `data-vct-departe`). NOU:
- verificări: `textRanduri:{text|contine, min}`, `textDeDouaOri:{text|contine}` (cuvinte × 2 : 3 s), `muzicaIntreaga:'m.wav'`
  (muzica până la capătul fișierului), `textCuloareEste:{text|contine, culoare}`, `textPozEste:{text|contine, poz}`,
  `textFaraSuprapunere:{min?}`; `v.text.catalog()`;
- pe ecran: notele despre +, paleta de culori și micul meniu, Culoarea de fundal „doar la unele texte”; butonul se cheamă
  „Privește ca de departe”;
- pe un clip de TEXT ales, îngust (< 64 px), se ia mânerul cel mai apropiat de deget (opus m13);
- clicul-fantomă de după o atingere care a mișcat linia de timp nu mai apasă ce a ajuns sub deget (cererea dirijorului după
  judecata 3 a lecției 14; `_proba/j1_atingere_text.py`, cu `--sus` / `--mutant`).
- două comutatoare DOAR pentru mutanții probelor: `window.__faraAparare`, `window.__faraManerApropiat` (nicio pagină nu le pune).

**Pentru lecția următoare (VII/16).** Elevul are acum genericul cu autorii, pe patru rânduri, 0:18-0:28, muzica până la 0:24,
filmul exportat o dată. Regula: la orice material, autorul, licența și de unde (și la CC0). §9 rămâne valabil; în plus, pentru un
atelier de mini-proiect, `textDeDouaOri` și `muzicaIntreaga` merg pe orice generic / muzică.

**Pentru proprietarul lui `video-clipchamp.js` (VII/14).** (1) Ca la m13 aici: pe un clip video / audio îngust, ales, mânerele
se suprapun și câștigă cel din dreapta; la text am luat mânerul cel mai apropiat de deget (fără să-ți ating fișierul). (2) Am
probat extensia pe 1.1 (sha1 d73dbb25…) și pe 1.2 (R1 al judecății 3, sha1 c30f1b30…): compatibile; paza ta de atingere și a
mea nu se încurcă (a ta ține handler-ele tale, a mea butoanele panoului Text).

**Porțile după reparație** (rezultatele finale, cu sha1-urile simulatoarelor probate): în `_proba/stare_autor.md` §8 și la
sfârșitul acestei secțiuni, după `reface_probele.py`.

**Rezultatele, 12.10.2026, ~21:20 (după reparație; simulatoarele probate: `video-clipchamp.js` sha1 428e84e8… = 1.2 + ajustările autorului J3 al VII/14, `video-clipchamp-text.js` 1.1 sha1 8605754f…; aceleași înainte și după rulare):**
- `_proba/reface_probele.py` → **0** (`_proba/reface_total_j1_2.txt`): VII/14 sim_proba 0 · VII/14 proba_gesturi 0 · VII/15 sim_text_proba 0 ·
  VII/15 proba_gesturi (pc + tel) 0 · test_joc TRECUT (doar „1 niveluri”) · verifica_lectie 0 · verifica_citate 0 · numara_cuvinte
  (pași 66-105, „Uite cum” ≤ 77) · date personale 0. O rulare anterioară (`reface_total_j1.txt`, 2) prinsese proba VII/14 în
  timp ce autorul J3 o schimba (20:41) și, la VII/15, tragerea textului pe previzualizare pe telefon sub butonul plutitor
  „Spune cine ești” (baza 1.2 mută panoul sub linia de timp, deci derularea minimă a probei lăsa textul la marginea de jos);
  proba a fost aliniată ca un elev (previzualizarea la mijlocul ecranului + verificarea că sub deget e textul), nu lecția.
- `_proba/proba_reparatii.py` → **0** (212 verificări, `_proba/proba_reparatii_3.txt`); `--mutanti` → **0 neprinși**
  (`_proba/proba_reparatii_mutanti_4.txt`: fără apărarea de clicul-fantomă → prins de `j1_atingere_text.py --mutant`, 6;
  fără mânerul cel mai apropiat → prins [T]).
- `_proba/j1_atingere_text.py` → 0 pe baza de azi, 0 cu panoul mutat deasupra (ca în 1.1), 6 fără apărare.
- `C:/00/AI_0/tools/learninghub_date_personale.py` → 0; `activitate.py lista | grep -c "nu e in catalog"` → 0.
- Afirmații: 34 (A28-A34 noi); niciuna probată în aplicația reală (Clipchamp NU se pornește azi): DOCUMENTAT / CAPTURĂ / DEDUS /
  NESIGUR, fiecare cu sursa.

**Trecere de text după judecata 2 (12.10.2026).** M1: caseta P1 are acum fraza deconectării (≡ › Înapoi la pagina de pornire (Back to home) › pictograma de utilizator › Deconectare (Sign out); altfel ✕ și profesorul). m1: „proiectul din lecția 14 (cel cu „munte” la capăt)”. m2: explicația Î3 e generală (contrast + loc liber: parte întunecată sau Culoare de fundal). m3: „mută-le trăgând de mijloc, unul după altul (mânerele schimbă doar cât stau pe ecran)” (laborator 12 și atelier). Doar texte; `video-clipchamp*.js` neatinse. `_proba/proba_reparatii.py`: caseta P1 ≤100 cuvinte (era 50) și avertismentul de lungime tolerat doar la N1P2 (P1).
