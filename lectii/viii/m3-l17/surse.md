# Lecția 17, clasa a VIII-a — surse, probe și ce n-am putut verifica (19.10.2026)

Numerotarea pașilor e cea din bara motorului: **P1 = „La ce folosește”**, P2-P6 = pașii 1-5 din standard. (În scripturile din `_proba\` pașii se cheamă P0-P5, ca `JocMotor.test.pas(n)`.)

## Programa și planul
- **Titlul exact:** `Info_Gimnaziu_2026\planificari\Calendar_ore_8A_8M.md` (22.01.2027, lecția 17, M3, predare; în `Calendar_ore_VIII.md`, 19.01.2027), `data\unitati.json` (VIII-U2 „Pagini web”, CS.1.2 + CS.3.2), `Proiectul_unitatii_VIII-U2.md` (ora 17, „teorie, exercitii”).
- **Conținutul** (copiat întocmai din `curriculum.json`, „Pagini web”): „Operații de editare a elementelor de conținut (paragraf, imagini, tabele, liste, legături): inserare, ștergere, mutare, copiere”. Lecția ia din el listele și tabelele: inserare (un `<li>`, un rând), ștergere (celula în plus, experimentul din laborator), mutare (P3, Încă 2: Ctrl+X / Ctrl+V), copiere (ajutorul de la P4, laboratorul 5).
- **Activitatea profesorului** (`data\activitati_lectii_VII_VIII.json`, lecția 17): „Aceeași informație prezentată ca listă și ca tabel; elevii decid care se potrivește și argumentează. Realizarea unui orar al clasei ca tabel.” → P4 (când alegi tabelul), Î4 (listă sau tabel), atelierul și laboratorul (orarul).
- **Ce NU cer documentele profesorului** (căutat în `Info_Gimnaziu_2026`, fără `materiale\print\`): `border`, chenar la tabele HTML, liste în liste, `colspan`/`rowspan`. Nu le predau. Lecția spune cum vede elevul tabelul fără chenar: fără linii, textul așezat în coloane (probat). Cerințe, criterii și punctaje: lecția e de predare, nu are notare.

## Ce presupun cunoscut (lecțiile publicate) și ce acopăr
| Presupun | De unde | Folosit în lecție |
|---|---|---|
| ✔ fișier .html în Notepad, filă nouă, ●, salvare (Toate fișierele, UTF-8, „există deja” → Nu), Explorer + dublu-clic, Ctrl+S / F5, Ctrl+U, Fișier › Închideți fila | VIII/14 (`afirmatii.json` A01-A33) | atelier, atelier 2, laborator 1-8 (pașii de salvare / închidere copiați din VIII/15, ca să nu se contrazică) |
| ✔ scheletul (DOCTYPE, html lang, head cu meta + title, body), închiderea în ordine inversă, Tab / două spații pe telefon | VIII/15 | toate codurile (scheletul indentat al lecției 15), testul „Scheletul a rămas întreg” (`EditorWebSchelet.ordine`, fără etichetele de listă/tabel), atelierul (`EditorWebSchelet.indentat`) |
| ✔ `<h1>` titlul mare | VIII/14-15 | titlul paginilor din exerciții |
| ✔ `<p>`; Enter din Notepad nu trece pe alt rând | VIII/16 (în paralel; granița lui: `m3_19_10\granite\viii_l16.md` — „poți folosi `<p>`, `<h1>`, `<h2>`; fără h3-h6”) | P6 Încă 1 și 3, laboratorul 2, Î2 |
| ✔ Ctrl+C / Ctrl+X / Ctrl+V | VIII/4 (Excel) + VIII/16 (paragraful în Notepad) | P3 Încă 2, ajutorul P4, laborator 5 |
| ✔ rând, coloană, celulă | VIII/2 (Excel) | P4 text („ca foaia din Excel de la lecția 2”) |
Lecția 15 n-are secțiune „Pentru lecția următoare”; am folosit interfața ei din `surse.md` („Simulatorul și extensia…”) și din capul `editorweb-schelet.js`. Nimic din 14-15 contrazis (pașii de laborator sunt aceleași texte).

## Faptele — probate în Chromium 148 headless (Playwright), pe fișiere locale scrise ca de Notepad
Azi Notepad din Windows 11 și Edge real nu se pornesc (`luni_12_10\prompturi\_zi.md`). Faptele despre Notepad vin din probele lecțiilor 14-15; cele despre browser din Chromium 148 (motorul lui Edge și Chrome), cu rețeaua blocată (doar `file:`), profil temporar, `ctx.close()`. Detaliul și dovada fiecărei afirmații: `afirmatii.json` (A01-A23).
| Fapt | Dovada |
|---|---|
| `<ul>` → buline (disc); `<ol>` → 1., 2., 3., renumerotate singure; numere scrise de mână → „1. 1.” | `_proba\proba_browser_l17.json`, `_proba\_capturi\l17_ol_*.png` |
| Tab-urile, rândurile noi dintre etichete, o celulă pe rând sau tot rândul pe un rând → aceeași pagină (captură identică) | sha1 `8e13aec25fda` (liste), `7e77207a9dc8` (tabel) |
| `</li>`, `</td>`, `</tr>` lipsă → aceeași pagină | idem |
| Tabel: fără linii (border none), spațiu de 2 px între celule; `<th>` 700 + centrat, `<td>` normal, la stânga | `proba_browser_l17.json` (tab_bun) |
| Celulă lipsă → celulele din dreapta trec în coloana din stânga (Istorie sub Luni); celulă în plus → iese în dreapta | tab_celula_lipsa / tab_celula_plus + `proba_gesturi_l17.py` (coordonatele din pagina desenată) |
| Fără `</table>`: ce urmează (p, text, h1 + ul) apare DEASUPRA tabelului; text direct în `<tr>` la fel | tab_neinchis_* / tab_text_in_tr |
| Fără `</ul>` (sau închisă cu `</ol>`): ce urmează intră în listă, mutat la dreapta (x 48 în loc de 8) | ul_neinchis* / ul_inchis_cu_ol |
| `<li>` fără listă: nu se vede bulina; rând după `</table>`: textele unul după altul, pe un singur rând, sub tabel, fără coloane (cu spații când celulele sunt pe rânduri separate în Notepad; corectat la judecata 1, J1-m1); etichete cu litere mari = la fel | li_fara_lista, `proba_coduri_l17.json` (q3_gresit), `_proba\proba_reparatii.py` [C], OL_MARI / TABLE_MARI |
| Toate cele 52 de coduri din pagină (`window.COD_L17`) deschise ca fișiere: ce spune lecția; extensia (DOMParser) vede la fel ca pagina încărcată | `_proba\proba_coduri_l17.json` (0 nepotriviri) |

## Numele RO / EN
- Notepad (Windows 11 în română), din lecțiile 14-15: Fișier, Salvare ca (Save As), Nume fișier (File name), Salvare cu tipul (Save as type), Toate fișierele (*.*) (All files), Codificare (Encoding), Salvare (Save), Închideți fila, Nu salvați. Editare: Decupaţi (Ctrl+X), Copiați (Ctrl+C), Lipiți (Ctrl+V) — `lectii\viii\m2-l14\_proba\notepad_explorare.json`; lecția folosește doar tastele.
- Etichetele HTML nu se traduc; lecția spune de unde vin numele: „unordered list”, „list item”, „ordered list”, „table header”. `meniuri_ro_en.json` n-are intrări pentru Notepad sau browser.

## Imagini (nicio imagine nouă; dosarul `img\` nu există)
- P1: `lectii\viii\m2-l10\img\mersul-trenurilor.webp` — „File:Plecari Sosiri (40494416311).jpg”, Dave Collier, **CC BY-SA 2.0**, decupată; licența citită din API-ul Commons de autorul lecției VIII/10 (`m2-l10\img\SURSE.json`). Am încercat s-o recitesc azi (Chromium headless, context temporar, User-Agent „LearningHub-lectii/1.0 (educational site)”): Commons a răspuns 429 (prea multe cereri) la toate încercările; n-am descărcat nimic. Legenda are autorul, licența și legătura.
- P3: `jocuri\web-viii\img\pag-liste.webp` — captură reală din Google Chrome (profil nou), din jocul web-viii (`jocuri\web-viii\img\SURSE.json`, 20.09.2026). Respinsă: `pag-tabel.webp` (liniile tabelului vin dintr-un `<style>`, pe care lecția nu-l predă).
- „Uite cum” are, în locul capturilor, **desenul browserului elevului** (iframe `sandbox=""`, fără scripturi și fără cereri, prin `EditorWebUtil.previewDoc`): nu e imagine desenată, e pagina desenată chiar atunci. Capturile Edge / Notepad care lipsesc: `capturi_lipsa.json`.

## Simulatorul: extensia nouă `lectii\_sim\editorweb-tabele.js` (proprietar: lecția VIII/17)
`editorweb.js` (VIII/14) și `editorweb-schelet.js` (VIII/15) NU sunt modificate. Se încarcă după ele. Nu ascultă taste și nu schimbă desenul.
**Pentru lecția următoare (VIII/18-19, mini-proiectul 21)** — ce poți folosi, din `window.EditorWebTabele`:
- `liste(src)` → `[{tip:'ul'|'ol', elemente:[text], altceva:[taguri care nu sunt li]}]`; `tabele(src)` → `[{randuri:[[{tag:'td'|'th', text}]]}]`; `celulePeRand(src)` — citite cu DOMParser, deci exact ca browserul (probat pe 52 de coduri).
- `perechi(src, tag)` → `{deschise, inchise}` pe TEXTUL scris; `inchise(src, tags?)` — fiecare etichetă de listă/tabel cu perechea ei (browserul iartă `</li>`, `</td>`, `</tr>`; lecția nu).
- `lista(src, {tip, min, texte, ordine, plin})`, `tabel(src, {randuri, coloane, cap:true|false, plin, rand:{i:[texte]}})`, `dupaTabel(src, text)`, `inLista(src, text)`, `numereScrise(src)`.
- `mesajText(src)` — greșeala de listă/tabel, cu ce se vede în browser; `cuDiagnostic(teste, {spec, coleg})` — ca `EditorWebSchelet.cuDiagnostic` (aceleași reguli pentru `neatins`, `faraDiagnostic`, `curat`, `faraOraData`, `msgTactil`), cu ordinea: starea (fila colegului, nesalvat, F5 în Notepad — ale schelet-ului) → lista/tabelul → greșelile schelet-ului.
- `randare(cod, inaltime)` — HTML-ul desenului pentru „Uite cum”.
- **Nu schimba** semnătura funcțiilor de mai sus și nici ordinea mesajelor (testele lecției 17 se sprijină pe ele). Ce-ți trebuie în plus → extensie cu nume nou. Compatibil cu `editorweb-continut.js` (VIII/16), după granița scrisă de autorul ei.
- **Înălțimea browserului simulat:** în `mod:'live'`, `editorweb.js` îi dă `min-height:9em` (≈126 px): un titlu + un tabel de 4 rânduri nu încăpeau (proba măsoară). Lecția 17 o mărește din CSS-ul paginii ei: `#body .ew .lv .br-corp{min-height:15em}` (selector mai tare decât stilul injectat). Propunere pentru proprietarul `editorweb.js`: o opțiune `inaltime` pe exercițiu.

## Regula 25 — calculatorul profesorului
- Nu am pornit Notepad, Edge, Chrome, Explorer, Office sau vreo aplicație din Magazin. Doar Chromium-ul din Playwright, headless, profil temporar, rețeaua blocată (doar `file:` / 127.0.0.1; la căutarea Commons doar `*.wikimedia.org`), închis cu `ctx.close()`. Serverul local al probei de gesturi: 127.0.0.1:8857, oprit odată cu scriptul. Niciun registru, nicio setare atinsă, nimic salvat în afara `_proba\`.
- **Regula 22:** singurele cereri spre exterior: API-ul Commons (răspuns 429), cu User-Agent „LearningHub-lectii/1.0 (educational site)”. **Regula 24:** proba de gesturi a blocat 4 cereri (fonturile Google) și nimic n-a plecat spre panoul profesorului. **Regula 27:** nicio cale cu numele contului în fișierele lecției (verificat cu grep).

## Porțile și probele (rulate ULTIMELE, după ultima schimbare)
- `test_joc.py --dir lectii\viii m3-l17` → TRECUT (avertismentul „1 niveluri” e cel așteptat). Ieșirea: `_proba\iesire_test_joc.txt`.
- `verifica_lectie.py … --fara-t1` → ultima linie 0 (S0, S1 0 identice, S2 6/6 aplicare/execuție, T0 0). Ieșirea: `_proba\iesire_verifica.txt`. Avertisment fără verdict: densitatea antetului („Ai nevoie de”, 4 propoziții lungi, listă de lecții).
- `_proba\proba_gesturi_l17.py` — 1280 px cu mouse + tastatură și 390 px cu atingere: fiecare „Încearcă” și „Încă un exercițiu” (întâi greșit, cu mesajul greșelii, apoi corect; rândurile de la P2 și P4 TASTATE cu Enter și Tab / spații; mutarea de la P3 cu Ctrl+X / Ctrl+V adevărate la 1280), desenul din „Uite cum”, ce arată pagina desenată la fiecare greșeală, atelierul (nesalvat → mesajul cere Ctrl+S; rând greșit → mesajul celulei lipsă; apoi drumul întreg: Ctrl+S, Explorer, dublu-clic / două atingeri, F5), atelierul 2 (F5, Fișier › Închideți fila), laboratorul (și la 460 px, lățimea ferestrei mici), cele 5 întrebări, diploma. Ieșirea: `_proba\iesire_gesturi.txt` (ultima linie = picate + erori). Capturile `_proba\_tel_*.png` privite.
- `_proba\proba_coduri_l17.py` → 0; `_proba\numara_cuvinte.py` → 0 (textul pașilor 64-90 de cuvinte, „Uite cum” ≤ 33).

## Ce n-am putut verifica / alegeri de semnalat
1. **Edge real** n-a fost pornit: tot ce spune lecția despre pagină e probat în Chromium 148 (A23, nesigur).
2. **Notepad real** n-a fost pornit: gesturile din laborator (selecția rândului cu mouse-ul + Delete; copierea rândului cu Ctrl+C / Ctrl+V și Tab-urile lipite) sunt neprobate azi (A20, A21). Rezultatul lor în pagină e probat.
3. **Fiecare celulă pe rândul ei** (nu tot rândul tabelului pe un rând în Notepad): am ales-o după ce proba a arătat că rândurile lungi nu încap în fereastra îngustă a pașilor (460 px) și la 390 px. Lecția spune că browserul desenează la fel (probat).
4. **Chenarul (`border`)**: nepredat, pentru că documentele profesorului nu-l folosesc. Dacă profesorul îl vrea, e un atribut simplu, probat aici: `border="1"` → linii de 1 px la tabel și la celule (`proba_browser_l17.json`, tab_border1).
5. **Orarul din laborator**: codul dat e inventat (Română, Engleză, Matematică, Istorie); elevul poate pune materiile lui. Nicio dată de elev.
6. **Timpul:** 5 pași + atelier + laborator cu experiment e mult pentru 50 de minute; „Cum lucrezi” spune ce e obligatoriu. (Judecata 1, J1-M2: laboratorul a fost redus — vezi secțiunea de la sfârșit.)
7. **Mesajul simulatorului pentru `<li>` fără listă** spune „nu apare bulina”: marcajul există, dar stă în afara paginii (la marginea de 8 px nu se vede) — formulat după ce se vede.

## De dus în componenta comună (nu sunt ale lecției; nu le-am atins)
- **Motorul:** firul de navigare de sus are ținte sub 32 px (98×23, 31×23, 76×23, 52×23 — măsurat în `iesire_gesturi.txt`), ca la VIII/14-15.
- **`editorweb.js`:** browserul simulat din `mod:'live'` are `min-height:9em`; pentru tabele trebuie mai mult (v. mai sus). Corectorul `corecteaza` socotește greșeală un `</li>` / `</td>` lipsă, pe care browserul îl iartă: e regula lecțiilor („scrii perechea”), iar pagina desenată arată ca browserul, deci fidelitatea e păstrată; o spune și P6.

## Reparațiile după judecata 1 (19.10.2026)
Judecățile: opus `_verificare\judecator1.md` (0 GRAV / 2 MAJOR / 7 MINOR) și sonnet `_verificare\ab_sonnet\judecator1.md` (0 / 0 / 5). Reuniunea, fără dubluri, e în **`_verificare\registru_j1.md`**: 11 puncte (A-K), toate reparate. Proba fiecărei reparații: `_proba\proba_reparatii.py` (litera în paranteze drepte; 1280 px cu mouse și taste, 390 px cu atingere, faptele în Chromium 148 pe fișiere scrise ca de Notepad) → `_proba\proba_reparatii_N.txt`, ultima linie 0.

**Ce s-a schimbat în lecție**
- **Laboratorul (J1-M2), redus.** Obligatoriu: scheletul de la lecția 15, titlul și un tabel MIC (capul + rândul cu 8:00, `COD.lab1`); al doilea rând se face prin **copiere** (Ctrl+C / Ctrl+V, apoi trei texte schimbate: `COD.lab_rand2`, rezultatul `COD.lab_copiat`); experimentul celulei lipsă (`COD.lab_exp`) și punerea ei la loc; Ctrl+U; închiderea filelor. Lista (`COD.lab_lista`, rezultatul `COD.lab_final`) e pasul 8, „Dacă mai ai timp”. `COD.lab_tabel` nu mai există. „Cum lucrezi” și intro-ul laboratorului spun: spre sfârșitul orei salvezi, închizi filele și treci la cele 5 întrebări.
- **Întrebările înaintea laboratorului: NU se poate fără să schimbi motorul.** Ordinea barei e fixă în `jocuri\_motor\motor.js` (`pasiNivel`: P1…Pn → Atelier → Aplicația → Î1…Îk; `realPage`: „La verificare →”); lecțiile publicate VIII/14 și VIII/15 au aceeași ordine. Pagina laboratorului are deja „Nu ai acum calculatorul în față? Treci la verificare”.
- **Renumărătoarea laboratorului** (independentă de judecător, `_proba\numaratoare_laborator.json`; ce se tastează, inclusiv rândul pus la loc la experiment):

| | rânduri | caractere (fără Tab) | `<` `>` | Tab | minute de tastat (estimare) |
|---|---|---|---|---|---|
| lecția 15 (publicată) | 11 | 152 | 26 | 12 | 2,6 |
| lecția 17 înainte (listă + tabel) | 34 | 421 | 100 | 87 | 8,1 |
| lecția 17 acum, obligatoriu | 24 | 282 | 64 | 54 | 5,5 |
| lecția 17 acum + „Dacă mai ai timp” | 30 | 364 | 84 | 69 | 7,0 |

  Fără rândul pus la loc, „înainte” dă exact numerele judecătorului (33 / 406 / 96 / 83). Modelul de durată (estimare, nu măsurare la clasă): 0,6 s pe caracter simplu, 1,6 s pe `<` `>` și ghilimele (AltGr), 1,0 s pe majusculă, 1,2 s pe diacritic, 0,4 s pe Tab și pe Enter, 2 s pe rând pentru privit codul. Cu operațiile fixe (pornire, Salvare ca, Explorer, patru Ctrl+S / F5, copierea, experimentul, Ctrl+U, închiderea: ~7 minute), laboratorul obligatoriu are ~12-13 minute (înainte ~15), plus ~1,5 minute pasul „Dacă mai ai timp”. Toată partea obligatorie, cu aceeași estimare: pașii citiți ~8 min, 5 „Încearcă” ~10 min, atelierul ~7 min, laboratorul ~12,5 min, întrebările ~5 min ≈ 42-43 de minute din 50 (înainte ≈ 45-46, fără rezervă). Nesigur: viteza reală a clasei.
- **P4, „Altfel” (J1-M1):** blocul (etajele cresc în sus) → panoul din gară de la P1 (fotografia privită: în fiecare bloc al panoului, primul tren e sus, ora în stânga). Proba: rândul scris ultimul apare jos (Chromium și pagina desenată).
- **P3, „Uite cum”:** cadrul 130 → 150 px (pagina are 150 px). Toate cele 5 desene „Uite cum” încap acum în cadru (măsurat la 1280 și la 390).
- **P3, Încă 2 (mutarea):** cum iei tot rândul (de la începutul lui până la începutul rândului următor) și calea de pe telefon în enunț; „de ce” spune că două `<li>` ajunse pe același rând dau aceeași pagină (probat: A24). Numele din meniul telefonului („Decupează” / „Lipește”) diferă de la un telefon la altul: lecția o spune; nesigur (A26).
- **P6:** motivul perechii: „așa vezi ușor unde se termină fiecare element, iar pagina ta nu depinde de cât iartă browserul”.
- **Atelierul:** testele 4 (perechea + scheletul) și 5 (indentarea) cer întâi să existe lista și tabelul; la pornire, 0 din 7 bifate. **Atelierul 2:** „Repar-o” → „Repară pagina în Notepad”.
- **Laboratorul, pasul 2:** în loc de „litera Ș” (nu era în cod): `<` `>` și ghilimelele ca la lecțiile 14-15; „Literele ă, â și ț sunt pe tastatura românească (ț e tasta de lângă Enter). Dacă nu-ți ies, scrie fără ele: tabelul se desenează la fel” (probat, A25; â din „Română” l-a găsit proba, nu judecătorii). **Pașii 5-6:** „rândul tabelului cu 8:00: cele cinci rânduri din Notepad” și „rândul din Notepad de sub `<td>8:00</td>`”.
- **P1, legenda:** „(decupată, aceeași licență)”, ca la VIII/10 (CC BY-SA 2.0 cere licența și pentru lucrarea derivată).
- `afirmatii.json`: A15 corectată (judecata 1, J1-m1); locurile laboratorului renumerotate (A01, A06-A08, A19, A21); noi A24-A27 (A26 nesigur).

**Pentru lecția următoare / componenta comună — `lectii\_sim\editorweb-tabele.js`:** API-ul NU s-a schimbat (aceleași funcții, aceleași semnături, aceeași ordine a mesajelor). S-a schimbat doar TEXTUL unui mesaj din `mesajText`, ramura „rând scris după `</table>`”: acum „browserul îi scrie textele unul după altul, pe un singur rând, sub tabel, fără coloane” (înainte „îi lipește textele”, contrazis de Chromium: cu celulele pe rânduri separate, textele apar despărțite de spații). Cine compară textul mesajului trebuie să folosească forma nouă.

**Ce rămâne nesigur după reparații:** gesturile din Notepad-ul real ale laboratorului (A19-A21: copierea celor cinci rânduri cu Tab-urile lor, selecția + Delete) — Notepad nu se pornește azi; Edge real (A23); numele din meniul de text al telefonului (A26). Observație fără reparație: în atelierul 2, testul „Pagina din browser e cea salvată acum” e bifat la pornire (browserul chiar arată fișierul salvat); el se debifează la prima salvare nouă și se bifează iar după F5 — e un test de stare, nu de faptă (nicio judecată nu l-a semnalat).
