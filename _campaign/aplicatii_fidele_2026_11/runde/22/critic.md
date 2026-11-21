# Runda 22 (B-windows, a doua din val) · criticul rece · unghiul GEST_TASTATURA

## 1. Antet
- Cine: criticul rece al rundei 22. Am citit `runde/_paralel/REGULI_CRITIC.md`, `runde/22/critic_prompt.md`, `runde/22/gata_pentru_critic.md`,
  `runde/22/raport_constructor.md`, `runde/18/critic.md` (modelul și GRAV-urile vechi), codul (`aplicatii/windows.js`, `aplicatii.js` părțile cu
  gesturile și mesajul, `_unelte/genereaza_windows.py:197-280`), `api_biblioteca.md` §4-§6, `contract.md` (R6, R7, R12, I1) și textul lecțiilor care
  cer scurtături de tastatură (`critic_probe/lectii_scurtaturi.txt`, 60 de potriviri).
- Uneltele: `runde/22/critic_probe/`. Hamul `h.py` (copiat din `runde/18/critic_probe/`, plus ajutoare): server static pe 127.0.0.1, port liber,
  Chromium headless, `ctx.route('**/*')` care abandonează tot ce nu e 127.0.0.1/localhost. În toate rulările: `plecate = []`, `erori = []`.
  Gesturi adevărate: `page.keyboard`, `page.mouse`, `page.touchscreen.tap`, glisări CDP (`Input.dispatchTouchEvent`), tastatura care compune prin
  CDP (`Input.imeSetComposition` + `Input.insertText`). Probele:
  - `c1.py` / `c2.py` → `c1_out.txt`, `c2_out.txt`: referința `uia_windows.json` și `date/windows.json`, citite pe chei;
  - `a1.py` → `a1_out.json`, `a1_*.png`: W1-W5 (1536×864, 1366×768, 1093×526, telefon 360×740 și 390×844);
  - `b1.py` → `b1_out.json`, `b1_*.png`: unghiul tastaturii la 1366×768 (24 de gesturi + asistentul §6.3);
  - `b2.py` → `b2_out.json`, `b2_*.png`: tastatura telefonului, fereastra mică, eșantionul „Ce a trecut”, mesajul central, celelalte aplicații;
  - `diff_stat.txt`, `diff_comun.txt`: `git diff c29b583a b63df73e -- aplicatii` (codul de la pornirea ciclului B față de punctul de control).
- Windows și Explorer reale nu le-am atins; Word / Excel / PowerPoint reale nu le-am pornit. N-am rulat `porti.py` / `masoara.py`. Git doar citit.

## 2. A. GRAV-urile vechi (W1-W5 din `18/critic.md`)

### W1 — meniul nou de pe desktop: **ÎNCHIS**
- Gestul criticului 18: clic dreapta la (952,200) pe 1536×864 (`a1_out › W1_1536`): cutia [953,201,**304×385**], fondul [961,202,288,366];
  toate cele 10 rânduri, raportate la cutie, stau la ±2 px de `uia_windows.json › meniu_desktop › ferestre[0]` (`dif_fata_de_ref = []`, de la
  `Vizualizare [17,6,270,32]` la `Afișați mai multe opțiuni [17,330,270,32]`); fondul le cuprinde pe toate; fiecare se vede (`elementFromPoint`).
- Lângă marginea de jos (1024,690 pe 1366×768): cutia urcă la y = 336, toate cele 10 rânduri deasupra barei și vizibile. Laptopul I1 (1093×526),
  clic la y = 440 și la y = 120: cutia [601,94,304,385], tot 10/10 vizibile (`W1_1093jos`, `W1_1093sus`). Capturi: `a1_w1_*.png`.
- Gestul vecin: „Nou ›” → submeniul (`deschide_submeniu`), apoi „Folder” → `folder_nou` (`meniu:Folder`), la toate cele 4 mărimi; drumul
  „clic dreapta › Nou › Folder” (v/m3-l18…) merge. La 1093×526 submeniul (294×698) e tăiat la 478 px, cu derulare: 15 din 21 de rânduri vizibile,
  „Folder” printre ele (fără referință: R18-2, vezi §5).

### W2 — Start › „Toate”: **ÎNCHIS**
- Gestul: clic pe Start la 1536×864, rotița ×12 pe listă (`a1_out › W2`). Lista are `scrollHeight 1141 / clientHeight 596` și ajunge la
  `scrollTop 545` (capătul `start.toate.jos` = 1283), cu evenimentul `rotita / derulare`.
- La capăt, cele **7 categorii** și cele **21 de butoane** ale lor (tăiate la marginile listei, ca în UIA) stau la ±2 px de
  `uia_windows.json › start_toate` (+1 px marginea rădăcinii, ca la critic 18): `dif_fata_de_ref = []`. Numele categoriilor se văd sub cutie
  (R22-3, dedus). Derularea de 545 px a generatorului e corectă: în `start_toate` prima categorie e tăiată SUS de listă ([510,142,156,162] = 113-304
  tăiat la 142), deci 658 − 113 = 545, nu 516.
- Gesturile vecine: săgețile duc focusul din dalele fixate în „Toate” și lista urmează focusul (b1 `05_tab_sageti`: `scrollTop` 0 → 34 → … → 510,
  ultimul buton „Narator”, focusul întreg în listă la toți cei 17 pași); pe telefon degetul derulează lista până la capăt (b2 `tel_360 › scroll_dupa_glisari [1149, 1597, 448]` = maximul).

### W3 — tastarea cu Start deschis (pe PC): **ÎNCHIS**; pe telefon gestul vecin pică → K3 (nou)
- Gestul criticului 18 (`a1_out › W3`, 1366×768): tasta Windows → `tasta_windows / deschide_start`; „pai” → 3 × `tastare / cautare`, ținta
  `start:Căutați aplicații, setări și documente`, caseta arată „pai”, rezultatul „Paint” ales; Enter → `pornire_aplicatie`, starea are fereastra
  Paint activă, Start închis, mesajul central („Paint” … nu e simulată). „calc” + Enter → fereastra Calculator activă.
- Vecinii: „e” → 7 rezultate, Jos/Jos/Sus mută alegerea (`alegere_rezultat`); Backspace golește caseta și readuce dalele (18); „xyzq” →
  `nesimulat`, iar mesajul („căutarea în documente și pe web”) e încă pe ecran la 1,2 s. Pe PC nu mai tace.
- Același gest pe telefon (atingere pe casetă, apoi tastatura ecranului) tace: K3, mai jos. Pe PC trece, de aceea W3 îl închid.

### W4 — Explorer pe bara de activități: **DESCHIS (parțial, doar partea blocată de A22-1)**
- Aspectul și indiciul sunt făcute (`a1_out › W4`): butonul are dosarul galben (`fill #f2c55c`); numele „Explorer” apare între 0,3 și 0,7 s de
  ținut mouse-ul ([786,685,61,26], deasupra butonului) și dispare la ieșire.
- Clicul fără fereastră deschisă → `clic / nesimulat`, ținta `bara_activitati:Explorer fixat`, plus mesajul central (nu tace). Cu fereastră deschisă:
  clicul o minimizează, al doilea o readuce (`minimizare`, `restaurare`).
- Rămâne: clicul nu deschide Explorer-ul bibliotecii, deci drumul „clic pe dosarul galben → Explorer” din cele zece lecții nu se duce la capăt.
  Cauza e cererea **A22-1** (`explorer.js` nu expune montarea), nu runda 22. Starea e cea declarată de constructor; o număr o singură dată, ca veche.

### W5 — telefonul: **ÎNCHIS**
- 360×740 și 390×844 (`a1_out › W5_360`, `W5_390`): Minimizare / Maximizare / Închidere la x 222-360, respectiv 252-390, toate în ecran; glisarea
  barei de titlu → `tragere / mutare_fereastra` (x 160 → 130, y → 134); atingerea pe Minimizare → `min`; butonul Explorer din bandă ([84,692,44,48],
  vizibil) îl readuce (`restaurare`). Start fix în stânga ([1,692,45,48]; A22-2). Pagina nu se lățește (360 / 390).

## 3. B. Unghiul GEST_TASTATURA — constatările noi
Pe scurt (`b1_out.json`, 1366×768, fereastra Explorer deschisă):

| gestul | evenimentul §4 | starea / ecranul | mesaj (R12) |
|---|---|---|---|
| tasta Windows | `tasta_windows / deschide_start`, ținta `fereastra_app:windows` | Start deschis; a doua apăsare îl închide | — |
| Ctrl+Esc | `tasta_esc / fara_efect` | nimic | nu |
| Windows, „word”, Enter | `tastare / cautare` ×4, `tasta_enter / nesimulat` | Start rămâne deschis | da, „Word” |
| Windows, „notepad”, Enter | idem, rezultatul e „Notepad++” | Start rămâne deschis | da, „Notepad++” |
| Windows, „securitate”, Enter | după „sec”, fiecare literă `nesimulat` | fără rezultate | da, „căutarea în documente și pe web” |
| Tab, săgeți în Start și în „Toate” | `tasta_tab / focus`, `sageti / focus` | focusul are contur de 2 px, lista urmează focusul | — |
| Enter pe un buton din „Toate” | `tasta_enter / nesimulat`, ținta = butonul | — | da |
| Shift+Tab; litere din grilă; Esc | `focus`; `cautare`; `inchide_start` | corecte | — |
| Windows + E | `tasta_windows / deschide_start` + **`ctrl_e / ctrl_e`** | Start deschis, Explorer nu | **nu** (K1) |
| Windows + D | `tasta_windows / deschide_start` + `ctrl_d / ctrl_d` | Start deschis, fereastra nu se minimizează | nu |
| Shift+F10 pe desktop | `tasta_f10 / tasta_f10` | niciun meniu | nu |
| tasta Meniu pe desktop | `clic_dreapta / fara_efect`, ținta rădăcina | niciun meniu | nu |
| săgeți / → / Enter în meniul desktopului | `sageti`, `tasta_enter` fără acțiune | nimic evidențiat, meniul rămâne | nu |
| Alt+Tab (2 ferestre) | `tasta_tab / tasta_tab` | nimic | nu |
| Alt+F4 pe fereastra activă | `tasta_f4 / tasta_f4` | fereastra rămâne | nu |

### K1 — Windows + E (drumul lecțiilor spre Explorer) tace și deschide Start — **GRAV** (R12)
- Gestul: `keyboard.down('Meta')`, `press('e')`, `up('Meta')` (`b1_out › 12_win_e`, `b1_win_e.png`).
- Ce face simulatorul: deschide Start la apăsarea tastei Windows, apoi emite `ctrl_e / ctrl_e` (ca și cum ar fi Ctrl+E). Explorer nu se deschide,
  nu apare niciun mesaj, Start rămâne deschis peste desktop.
- Lecțiile: 11 lecții dau scurtătura ca drum spre Explorer: v/m2-l09 („Alt drum spre Explorer: ții apăsată tasta cu sigla Windows … și apeși E”),
  v/m4-l29, viii/m2-l14, m2-l15, m3-l16 … m3-l21, m4-l22 („Deschide Explorer (File Explorer): tasta Windows + E”).
- De ce e GRAV: R12 („Orice comandă folosită de o lecție sau citată în ea funcționează; o comandă … nesimulată dă mesajul central standard …, nu
  tace”). Clicul pe dosarul galben dă măcar mesajul (W4), scurtătura nu dă nimic. Deschiderea Explorer-ului poate aștepta A22-1; tăcerea nu.
  Comportamentul real al combinației nu e în referințele înghețate. Nu-l trec ca GRAV de aspect, ci ca GRAV de contract.
- Cauza:
  - `windows.js:708`: Start se deschide la `keydown` pe Meta, înainte să se știe dacă urmează o literă;
  - `windows.js:701-728`: nicio ramură pentru Windows + literă → `null` → tăcere;
  - `aplicatii.js:267` (cod comun, nu al rundei 22): `c = e.ctrlKey || (e.metaKey && k !== 'Meta')` face din Windows + E gestul `ctrl_e`.
    O lecție care ascultă `ctrl_e` nu poate deosebi cele două combinații.
- Observație pentru orchestrator: pe un PC cu Windows real, combinația o prinde sistemul înaintea browserului (se deschide Explorer-ul real); pagina
  vede doar Meta. Pe ChromeOS / Linux / Mac și în probe ajunge la pagină. Vezi și §7.

### K2 — asistentul (§6.3) nu recunoaște drumul cu tastatura al lecțiilor (tasta Windows → scrie → Enter) — **GRAV** (api §4 `activat`, §6.3)
- Gestul (`b1_out › 21_asistent_tastatura`): asistentul cu pașii `bara_activitati:Start` → `start:Paint` (`dupaGreseli: 2`), apoi tasta Windows,
  „p”, „a”, „i”, Enter.
- Ce face simulatorul:
  - tasta Windows deschide Start, dar evenimentul are ținta `fereastra_app:windows` și **niciun `activat`**, deci pasul 1 rămâne nefăcut și tasta
    contează ca greșeală;
  - după „p” (a doua „greșeală”) indiciul „Deschide Start” și evidențierea apar pe butonul Start, deși Start e deja deschis;
  - Enter pornește Paint (`pornire_aplicatie`), cu ținta caseta și fără `activat`;
  - la final asistentul e tot la pasul 0 (`pas() = 0` după toate cele 5 gesturi), iar indiciul stă pe Start.
  - Pe același drum făcut cu mouse-ul (`22_asistent_mouse`), pașii trec 0 → 1 → 2.
- Lecțiile: drumul cu tastatura e cel predat: vi/m2-l11 („Apasă Start (tasta cu sigla Windows), scrie securitate și apasă Enter”), cele 9 lecții
  viii („tasta Windows, scrie Notepad, apoi Enter”), v/m2-l08 („Scrie „pai” și dă clic pe Paint”).
- De ce e GRAV: încalcă api §4 („`activat` = ținta canonică a butonului pe care TASTA l-a apăsat fără ca butonul să fie ținta focusului: Enter într-o
  fereastră apasă butonul ei implicit”). Enter în caseta Start pornește rezultatul ales, adică exact acest caz. Tasta Windows face ce face butonul
  Start, iar lecția le numește la fel: „Apasă Start (tasta cu sigla Windows)”. §6.3 recunoaște pasul „din `tinta` SAU din `activat`”. Fără el,
  asistentul îl mustră pe elevul care urmează lecția și îi arată butonul greșit.
- Cauza: `windows.js:708` (`seteazaStart` fără `I.activat = 'bara_activitati:Start'`) și `:532` (`pornire(rz[M.rezSel].nume)` fără
  `I.activat = 'start:' + numele rezultatului`). Mecanismul există deja: `aplicatii.js:403` citește `I.activat`.

### K3 — telefonul: atingerea pe caseta din Start arată cursorul, dar tastatura ecranului nu apare, iar textul ei se pierde fără urmă — **GRAV** (I1, R12, R6)
- Gestul (`b2_out › tel_360`, `tel_390`; `b2_tel360_caseta.png`): atingere pe Start, apoi pe caseta „Căutați aplicații, setări și documente”, apoi
  textul cum îl trimite o tastatură de telefon (CDP `Input.imeSetComposition` „pa”, apoi `Input.insertText` „pai”).
- Ce face simulatorul:
  - atingerea → `clic / focus_cautare` și un cursor desenat în casetă, fără mesaj;
  - focusul rămâne pe rădăcina `div` (`edit: false`) și în Start nu există niciun câmp editabil (`element_editabil_in_start = 0`), deci pe un telefon
    real tastatura ecranului nu se deschide;
  - textul compus / inserat: **0 evenimente**, caseta neschimbată, 0 rezultate.
  - Doar o tastatură fizică (`keyboard.type`) găsește „Paint”.
  - Fără tastare Paint nu e nicăieri în Start: nici fixat, nici printre cele 3 butoane vizibile ale categoriilor (`paint_vizibil_fara_tastare = []`).
  - La fel pe PC, pentru textul venit fără `keydown` (IME, dictare): `23_insertText_pc` → 0 evenimente.
- Lecția: v/m2-l08 („Pornește aplicația Paint din meniul Start. Nu-l vezi? Scrie „pai” și dă clic pe Paint”; „Nu-l vezi? Scrie „calc””).
  Drumul nu se poate duce la capăt pe telefon.
- De ce e GRAV:
  - I1 („biblioteca merge la 360-390 px”);
  - R12: elevul vede cursorul, iar biblioteca tace. Înainte de runda 22, atingerea pe casetă dădea măcar mesajul central
    (`inainte/windows.js:455`), deci pe telefon e un regres;
  - R6 / §4: un gest fizic, tastarea, nu emite niciun eveniment.
- Cauza:
  - `windows.js:655`: clicul pe casetă pune `M.caut = ''`, fără element editabil;
  - `:505-514`: textul intră doar din `keydown` cu `e.key` de o literă;
  - Windows nu are `I.intrare`, calea de text a bibliotecii pentru telefon și IME (`aplicatii.js:412-426`, folosită de Word / Excel / PowerPoint).

### Abaterile „voite” și NESIGUR-ul constructorului
- **A22-1** (clicul pe Explorer nu montează Explorer-ul): corect declarată. Partea rămasă din W4 depinde de ea (§2).
- **A22-2** (pe telefon Start stă fix în afara benzii): corectă. Start e mereu la îndemână ([1,692,45,48]), iar banda derulează restul.
- **A22-3** (Paint / Calculator ca ferestre generice + mesajul central): corectă. Fereastra apare, are butonul ei, iar mesajul spune că
  conținutul nu e simulat. La 1093×526 fereastra Paint încape ([80,40,640,420], butoanele până la x 720, y 73).
- **O3 de diagnostic pe `start`, +4:** trei din cele patru (Altele, Divertisment, Accesibilitate) sunt în DOM, derulate în afara listei, exact cum le
  dă referința `start` (`in_afara_ecranului: true`). E un artefact al extractorului O3, care nu taie după containerul derulabil, nu o abatere a
  simulatorului. A patra („[utilizator]”) n-am verificat-o: NESIGUR, de lămurit în runda `acoperire`.

## 4. C. Regresul
- **Cod comun:** `git diff c29b583a b63df73e -- aplicatii` (`diff_stat.txt`): banda Windows a schimbat doar `windows.js`, `genereaza_windows.py`,
  `date/windows.json`. `aplicatii.js` (+21 de rânduri) e reparația E1 a rundei 19, fără nimic despre Windows (`diff_comun.txt`: 0 potriviri
  `windows|lh-w-`). `runde/22/inainte/windows.js` = `windows.js` de la `c29b583a`.
- **„Ce a trecut” din 18, eșantion** (`b2_out › ce_a_trecut_1536`):
  - Start la [521,816,45,48] și panoul [369,67,800,750], ca la 18;
  - meniul clasic (Shift + clic dreapta): 298×391, 15 rânduri, „Lipire” gri;
  - Esc închide pe rând submeniul („inchide_submeniu”), apoi meniul („inchide_meniu”);
  - Start se închide cu Esc din casetă și din grilă (b1 `09`, `11`).
- **Mesajul central la 2 gesturi nesimulate** (01:10:03 și 01:10:05, 21.11): Widgeturi și Ceas → `clic / nesimulat`, mesajul e pe ecran la 0,2 s și
  la 1,7 s ([524,772] și [579,772], deasupra barei). Nu am văzut nimic ciudat. Regresul comun al mesajului e al criticului 19.
- **Telefonul, 2 drumuri:**
  - Start › lista glisată până la capăt (b2, 360 și 390: `scrollTop` = maximul, pagina nu se lățește);
  - fereastra: glisare, Minimizare, butonul din bandă (W5).
  - Drumul „scrie pai” pe telefon pică: K3.
- **Fereastra mică 1093×526, 2 drumuri** (`b2_out › mica_1093`):
  - tasta Windows, „pai”, Enter → fereastra Paint activă și încăpută, cu mesajul;
  - clic dreapta › Nou › Folder ([430,8,264,28]) → redenumire, „Teme”, Enter → `redenumire`, iar pictograma „Teme” apare pe desktop.
- **W4 nu montează Explorer**, deci drumul „Explorer pornit din bară” nu există încă.
- **Celelalte aplicații** pornesc pe poligon (Word, Excel, PowerPoint, Explorer), fără erori de pagină și fără cereri în afara 127.0.0.1 (`b2_out ›
  alte_aplicatii`). Banda 22 n-a atins cod comun, deci nu poate fi vinovata vreunei schimbări de acolo.

## 5. [FARA_REFERINTA]
- **„notepad” → „Notepad++”.** Cele 9 lecții viii cer „tasta Windows, scrie Notepad, Enter” („Notepad, care e pe orice calculator cu Windows”).
  - Simulatorul arată un singur rezultat, „Notepad++” (aplicația fixată în bara PC-ului de referință), iar mesajul spune că „Notepad++” merge în
    aplicația reală.
  - În Windows 11 rezultatul ar fi aplicația Notepad. Lista de candidați (`windows.js:380-390`) sare „Notepad, Folder cu elemente 3” din `start` și
    n-are aplicațiile de sistem.
  - Panoul de căutare nu e capturat (R22-1).
- **„securitate” → mesajul „căutarea în documente și pe web”**. vi/m2-l11 spune că „sus apare Securitate Windows”. Mesajul îl poate face pe elev să
  creadă că a scris greșit. Suprafața „Securitate Windows” e tot necapturată (critic 18 §8).
- **Ctrl+Esc** (`tasta_esc / fara_efect`) și **Windows + D** (deschide Start, ferestrele rămân): în Windows real prima deschide Start, a doua arată
  desktopul. Nicio lecție nu le cere și nu sunt în `surse_microsoft.md`.
- **Shift+F10 și tasta Meniu pe desktop**: niciun meniu. Tasta Meniu dă `clic_dreapta / fara_efect` cu ținta rădăcina, pentru că `dreapta`
  (`windows.js:684-699`) cere ca ținta să fie în desktop. Nicio lecție de shell nu le cere; viii/m1-l04 le cere în Excel.
- **Tastatura în meniul desktopului**: săgețile nu evidențiază nimic, iar → și Enter nu fac nimic. Enter e `tasta_enter` fără acțiune și fără mesaj.
  Lecțiile folosesc meniul doar cu mouse-ul.
- **Alt+Tab** (gestul iese `tasta_tab`) și **Alt+F4** (`tasta_f4`) nu fac nimic. v/m2-l08 › `surse.md`: „Clic dreapta și Alt+Tab nu se predau”.
  Alt+F4 apare doar în `afirmatii.json`, nu în textul pentru elev.
- **Ordinea lui Tab** după dale (Recomandate, contul, Alimentare): R22-5. **Submeniul Nou** mai înalt decât ecranul la 1093×526: R18-2.
- **„Toate”:** al 4-lea loc din categorie e un desen fără țintă, iar clicul pe o categorie nu o deschide. În Windows ea se deschide; nu e capturat.

## 6. MINOR
- Enter pe un rezultat nesimulat (Word, Notepad++) lasă Start deschis, sub mesaj. În real, Start se închide la pornirea aplicației.
- Rezultatele căutării includ programe instalate pe PC-ul de referință care n-au legătură cu lecțiile (la „e”: 7 rezultate, între ele utilitare ale
  unor aparate de acasă). E aceeași familie cu `deschise_ref` de la 18 §6 și n-are ce căuta în fața elevilor.
- Etichetele din mesaj păstrează sufixele UIA: „Explorer fixat”, „Widgeturi 13°C Mostly cloudy” (vremea de la captură), „Ceas 01:10”.
- Gesturile combinațiilor au nume înșelătoare: Windows + litera → `ctrl_<literă>`, Alt+Tab → `tasta_tab` (`aplicatii.js:266-276`, cod comun).
- Rămase de la 18 §6 (constructorul le-a amânat, confirmat): clic dreapta pe desktopul gol are ținta `fereastra_app:windows` (`a1_out › W1_*`),
  opacitatea Start, „Afișați desktopul” de 12 px pe telefon, `deschise_ref`.

## 7. Ce a trecut
- W1, W2, W5 închise pe măsurătoare: ±2 px față de referință, 10/10 rânduri, 7/7 categorii, 21/21 butoane, telefonul 360 și 390.
  W3 închis pe PC. W4: aspectul și indiciul.
- Tastatura în Start, pe PC:
  - tasta Windows deschide și închide Start;
  - tastarea imediată caută, iar Sus / Jos aleg;
  - Enter pornește Paint / Calculator sau dă mesajul;
  - Backspace, Esc (cu text și din grilă);
  - Tab intră în dale, Shift+Tab iese, iar literele din grilă trec în casetă;
  - săgețile merg din „Fixate” prin „Recomandate” până în „Toate”, cu focusul vizibil (contur 2 px) și cu lista care îl urmează;
  - Enter pe un buton din „Toate” dă mesajul cu ținta lui.
- Ținta tastelor din căutare e caseta (`start:Căutați aplicații, setări și documente`), ca în §4.
- Regresul: celelalte aplicații pornesc; mesajul central ține; nicio cerere în afară; nicio eroare de pagină; nimic personal în probe.

## 8. Predarea pentru runda următoare
- De reparat întâi, în ordine:
  1. **K3**: un câmp editabil adevărat pentru caseta din Start, deschis la atingere (ca `I.intrare` la Word / Excel / PowerPoint, cu `input` și
     `compositionend`). Așa tastatura ecranului apare, iar textul ei intră în `M.caut` cu evenimentul `tastare`. Până atunci, pe ecranele tactile,
     atingerea casetei să dea iar mesajul central. În proba rundei: CDP `insertText` / `imeSetComposition` la 360 și 390 px.
  2. **K2**: `I.activat = 'bara_activitati:Start'` la tasta Windows și `I.activat = 'start:<rezultatul ales>'` la Enter din căutare. În proba rundei:
     asistentul `Start → Paint` jucat cu tastatura (Windows, „pai”, Enter) trebuie să ajungă la `pas() = 2`, fără indiciu.
  3. **K1**: Start să se deschidă la ridicarea tastei Windows, dacă între timp n-a venit altă tastă (așa face Windows). Windows + literă = gestul ei
     (nu `ctrl_<literă>`) plus mesajul central „Windows + E”, până când A22-1 permite deschiderea Explorer-ului. Partea din `aplicatii.js:267` e cod
     comun: decizia e a orchestratorului.
  4. **W4 (restul)**: A22-1.
- De decis de orchestrator: pe PC-urile cu Windows ale elevilor, tasta Windows, Windows + E / D, Ctrl+Esc, Alt+Tab și Alt+F4 sunt prinse întâi de
  sistemul real. Tasta Windows deschide și Start-ul real peste browser, iar Alt+F4 închide browserul. Lecțiile care se joacă în simulator pe aceste
  PC-uri au nevoie de un drum fără ele (un buton „tasta Windows” pe ecran sau doar textul).
- Referințe de capturat:
  - panoul de căutare din Start după „notepad”, „securitate”, „word”, „pai” (UIA + captură decupată);
  - pagina Microsoft „Keyboard shortcuts in Windows” (Windows + E / D, Ctrl+Esc, Shift+F10) și pagina „Use a screen reader to explore and navigate the
    Start menu” (D8-D10), înghețate în `surse_microsoft.md`;
  - meniul desktopului deschis cu Shift+F10, cu un rând evidențiat de săgeți;
  - o categorie din „Toate” deschisă.

GRAV_VECHI_DESCHISE: 1
GRAV: 4
