# Surse — lecția VI · M2 · nr. 11: „Măsuri de siguranță în utilizarea Internetului. Programele antivirus”

Autor: tura de noapte 10→11.10.2026 (profesorul dormea; deciziile sunt luate prudent, după documente, cu motivul scris aici și în `_proba/stare_autor.md`). Nimic publicat, nimic trimis în git.

## Forma
Pasul 0 („La ce folosește”, fotografia unui stick) + 5 pași (cuvinte în text, fără capturi și fără gestul real: 66 / 87 / 95 / 94 / 86 / 85; gestul „La calculator, acum” separat: — / — / 22 / 32 / 27 / 52; „Uite cum” ≤ 64 — `_proba/numara.json`), atelier pe calculatorul simulat (4 teste), „Acum la calculatorul din laborator” (10 pași, doar privit și verificat), 5 întrebări. Plafonul de 5 pași după pasul 0 e cel acceptat la VI/8 după judecata a doua.

**După judecata 1 (11.10.2026, autor proaspăt):** 21 de puncte (1 GRAV, 5 MAJOR, 15 MINOR), toate reparate — registrul cu ce s-a schimbat și unde: `_verificare/registru_j1.md`. Pe scurt: ordinea „scanezi ÎNAINTE să deschizi” e verificată acum și la Încearcă din pasul 5 și la Î5 (simulatorul ține minte când s-a scanat și când s-a deschis); căsuța „Răspunsul tău” (nu „caiet”) primește și „0 amenințări”, „zero”; regula Tip: Aplicație are excepția spusă (și alte Tipuri pornesc programe); Ctrl+W nu mai e cerut în pagină, nota stă deasupra browserului simulat, iar o plasă `beforeunload` întreabă înainte să plece de pe lecție; gesturi reale mici după pașii 2-5 (regula 10).

## Programa și planul
- Programa (OMEN 3393/2017), clasa a VI-a, CS.1.3; conținutul (textul exact din `curriculum.json`, domeniul Internet): „Măsuri de siguranță în utilizarea Internetului (de exemplu, utilizarea programelor de tip antivirus)”. Activitatea de învățare din programă: „ilustrarea principalelor caracteristici ale virușilor și malware, utilizarea programelor antivirus”.
- `unitati.json`: VI-U2 „Comunic prin Internet, în siguranță”, lecția 11 = acest titlu, tip predare (teorie, exerciții).
- `Calendar_ore_6A_6M.md`: 27.11.2026, lecția 11, M2. `Calendar_ore_VI.md` (Izvoare) are aceeași temă ca lecția 10, pe 17.11.2026 — numerotarea diferă între școli; cheia paginii urmează planul (`lectie_vi_m2_l11`).
- `Proiectul_unitatii_VI-U2.md`: descriptorii CS.1.3 (De bază: „aplicând măsuri de siguranță în mediul online, în pași ghidați”).

## Documentele profesorului (au prioritate)
- `activitati_lectii_V_VI.json`, VI/11: „Studii de caz reale, scurte: ce a greșit persoana din poveste și ce trebuia să facă. Verificarea setărilor de securitate pe calculatorul din laborator, împreună cu profesorul.”
  - Studiile de caz → „Uite cum” al fiecărui pas (Andrei și troianul, Ioana și „vezi_pozele”, Mihai și fereastra falsă, Elena și Istoric protecție, Darius și stickul): ce a făcut persoana și ce trebuia să facă. Sunt inventate (nume de elevi inventate, nicio întâmplare reală).
  - „Verificarea setărilor … împreună cu profesorul” → **decizie**: la Tupilați ora e simultană, deci pasul din laborator merge fără profesor și elevul doar PRIVEȘTE starea (Amenințări curente, Istoric protecție) și scanează un fișier text descărcat din lecție; nu schimbă nicio setare și nu pornește Scanare rapidă (vezi „Contradicții”).

## Granița cu vecinii
- Lecția 12 (alt autor, în paralel): parolele, datele personale, identitatea virtuală, mesajele care cer date. **Aici nu apar** cuvintele parolă, date personale, identitate, phishing (verificat și de T0: vocabularul lecțiilor viitoare).
- Lecțiile 13-15: poșta electronică și atașamentele. Jocul vechi `internet-vi` N1 avea „atașamente” și „linkuri dubioase” ca uși pentru malware → scoase. O analogie cu „poștași” a fost prinsă de T0 (lecția 13) și înlocuită cu „vecini”.
- Ce predau: programele rău-intenționate (virus, troian, program-spion; „altele blochează fișierele și cer bani”), căile (programe de pe site-uri necunoscute, stickuri, ferestre și reclame false), fereastra falsă, antivirusul (scanează, blochează, carantină, actualizări), Microsoft Defender / Securitate Windows, scanarea unui stick sau a unui fișier, regulile de purtare.

## Ce presupun că știe elevul (bifat din plan; detaliat în `profil.json`)
- [x] stickul USB — V/6
- [x] Start, bara de activități, ✕ pe ferestre — V/8
- [x] fișier, folder, extensie, File Explorer, coloana Tip — V/9 (jocul fisiere-v, simulatorul explorer-citire)
- [x] clic dreapta, dublu clic, Delete — V/10
- [x] browserul, filele (Ctrl+T, × / Ctrl+W), linkul — V/14 (jocul documentare-v)
- [x] descărcarea, folderul Descărcări — V/15
- [x] semnele de atenție pe Internet, reclamele — V/16
- [x] fișiere descărcate din lecții, Vizualizare protejată — VI/2-8
Tot ce folosesc în instrucțiuni e predat în lecție sau în lista de mai sus; termenii noi sunt marcați (`<mark>`) la prima folosire (T0: 0 probleme).

## Materialul refolosit (verificat)
- `jocuri/internet-vi`, N1 „Scutul calculatorului”: ideile „virusul se lipește de alte fișiere”, „un .exe e un program”, „antivirusul nu prinde tot” (refolosite); simulatorul `scut` (Start → Securitate Windows → Scanare rapidă) **nu** l-am refolosit: lecția nu cere Scanare rapidă, iar drumul de clic dreapta e cel pentru stick/fișier. Capturile `antivirus-scanare.webp` și `fisier-exe.webp` (acest calculator, 20.09.2026) — refolosite.
- `jocuri/internet-vi`, N6 „Mesajul-capcană”: e despre mesaje și parole (lecțiile 12-15); am păstrat doar „spui unui adult” și „la o fereastră ciudată nu apeși nimic”.
- `jocuri/documentare-v`: captura `bara-browser.webp` (fila cu ✕) și ce s-a predat la V/14-16.
- `lectii/v/m1-l06/img/stick.webp`: fotografia stickului (Donald Trung Quoc Don, CC BY-SA 4.0, Wikimedia Commons, licența verificată de autorul V/6 pe 27.09.2026), cu autorul și licența sub imagine.

## Imaginile
Nicio imagine nouă (dosarul `img/` nu e necesar). Toate sunt refolosite de pe sit, cu căi relative: `../../v/m1-l06/img/stick.webp`, `../../../jocuri/internet-vi/img/{fisier-exe,antivirus-scanare}.webp`, `../../../jocuri/documentare-v/img/bara-browser.webp`. Ce lipsește: `capturi_lipsa.json` (C1-C5).

## Probele (doar citire; nicio fereastră pe ecranul profesorului)
- `_proba/proba_defender.py` → `proba_defender.json`: Get-MpComputerStatus (Defender pornit, protecție în timp real, descărcările scanate, actualizat azi), Windows ro-RO, MpCmdRun -Scan -ScanType 3 pe `_proba/scan_test` („found no threats”, 0,2 s). Nicio setare schimbată; numele contului înlocuit cu `<utilizator>`.
- `_proba/nume_meniu_defender.py` → `.json`: extensia de meniu EPP (fișiere, foldere, unități) și șirul RO „Scanați cu $(BrandName)...” din `shellext.dll.mui`.
- `_proba/siruri_securitate_windows.py`, `siruri2.py` → `.json`: textele RO ale aplicației Securitate Windows citite din `resources.pri` (aplicația nu a fost pornită).
- `_proba/siruri_systray.py` → `.json`: „Se afișează pictogramele ascunse” (Taskbar.dll).
- Registrul Explorer (regula 25, `08_RELUARE.md` §9): amprenta BagMRU/Bags s-a schimbat o dată în timpul primei probe (verbe Shell.Application). `bagmru_ale_mele.py`: **niciun** nod nu conține dosarele mele (m2-l11, scan_test) → nimic de pus la loc; `bagmru_control.py`: 6/6 rulări fără schimbare, cu și fără Verbs() → schimbarea a venit din altă parte (alte sesiuni). Nu am scris nimic în registru.
- `_proba/proba_tip_assoc.py` → `.json` (AssocQueryString, ro-RO, doar citire): Tip-urile din File Explorer — .exe „Aplicație”, .msi „Pachet pentru Windows Installer”, .bat „Fișier batch Windows”, .cmd „Script de comenzi Windows”, .scr „Economizor ecran”, .lnk „Comandă rapidă”, .txt „Fișier TXT”. `_proba/proba_txtfile.py`: aici .txt = `txtfilelegacy`, fără nume propriu, deci pe alt Windows numele tipului text poate fi altul (pagina: „un fel de text (pe multe calculatoare Fișier TXT)”).
- `_proba/proba_beforeunload.py` → `.json` (Chromium headless, pagină de probă cu DOAR simulatorul, fără prezenta.js, rețeaua oprită, `ctx.close()`): cu fila falsă deschisă, plecarea de pe pagină cere dialogul „beforeunload” și „Anulați” ține pagina; cu fila falsă închisă, nu mai cere nimic; scripturile fără ascultător de dialog nu se agață (`page.goto` merge). 0 probleme.
- `_proba/proba_j1_reparatii.py` → `.json` (Playwright, server propriu pe 127.0.0.1, tot restul oprit, `ctx.close()`): drumurile judecății, la 1280 px (mouse + tastatură) și 390 px (atingere), inclusiv cele GREȘITE (deschis/pornit înainte de scanare, program pornit după scanare, „3” în căsuță, tema deschisă înainte de scanare în atelier, Î5 cu fișa deschisă întâi sau programul pornit), formele răspunsului, focusul, nota de deasupra browserului, laboratorul și drumul până la diplomă. Capturile de telefon `rep_*.png` privite. (Notă de probă: în Chromium, captura unui ELEMENT pe telefonul emulat pierde `(pointer:coarse)` și ascunde butonul ⋯; capturile se fac la sfârșitul drumului — `depanare_reset_telefon.py`.)
- `_proba/proba_gesturi.py` (Playwright, rețeaua blocată, `ctx.close()`): gesturi reale la 1280 px cu mouse și la 390 px cu atingere (atingere, atingere dublă, ținut apăsat prin CDP, butonul ⋯): P3, P5, atelierul corect și greșit, cele 5 întrebări — 0 probleme, de trei ori la rând (`proba_gesturi_1..3.txt`); 0 erori în consolă, nimic mai lat decât ecranul, nicio țintă sub 32 px în simulator. Capturile de telefon (`cap_*.png`) privite.

## Surse oficiale citate
- Microsoft ro-ro, „Rămâneți protejat cu aplicația Securitate Windows” (support.microsoft.com/ro-ro/windows/…-2ae0363d-0ada-c064-8b56-6a39afb6a963): „Aplicația Securitate Windows este o soluție de securitate cuprinzătoare, integrată în Windows”; „puteți să faceți clic dreapta pe fișier sau folder în Explorer, apoi să selectați Scanați cu Microsoft Defender”.
- Microsoft ro-ro, „Protecție împotriva virușilor și amenințărilor în aplicația Securitate Windows” (…-1362f4cd-d71a-b52a-0b66-c2820032b65e): carantina („puse în carantină înainte să vă poată afecta”), Istoric protecție, informațiile de securitate descărcate automat prin Windows Update, protecția în timp real, „Dacă instalați un program antivirus non-Microsoft compatibil, antivirusul Microsoft Defender se va dezactiva automat”.
- Microsoft ro-ro, „Protejați-vă de înșelătoriile de tip asistență tehnică” (…-2ebf91bd-f94c-2a8a-e541-f5c800d18435): „Mesajele de eroare și de avertizare de la Microsoft nu includ niciodată numere de telefon.”; „nu apelați acel număr”.
- Microsoft ro-ro, „Protejarea PC-ului de viruși” (…-b2025ed1-02d5-1e87-ba5f-71999008e026): „Fiți precaut atunci când rulați aplicații nerecunoscute descărcate de pe internet.”; blocarea ferestrelor pop-up.
- Microsoft ro-ro, „Comenzi rapide de la tastatură în Microsoft Edge”: Ctrl+W „Închiderea filei curente”, Ctrl+T „Deschideți o filă nouă…”. Google Chrome Ajutor (ro, answer/157179): „Închide fila curentă — Ctrl + w”.
- Microsoft Learn, „Understanding malware & other threats” și „Trojan malware” (en): definițiile (troianul nu se răspândește singur, folosește nume de aplicații reale, înregistrează tastele și site-urile; malware care blochează și cere bani).
- CISA, „Using Caution with USB Drives”: „Attackers can use USB drives to infect other computers with malware”; „Do not plug an unknown USB drive into your computer.”

## Numele românești (Windows în română)
„Securitate Windows” (Windows Security), „Protecție antivirus și împotriva amenințărilor” (Virus & threat protection), „Amenințări curente”, „Scanare rapidă” (Quick scan), „Istoric protecție” (Protection history), „Carantină”, „Amenințare blocată”, „Amenințare în carantină”, „(scanare particularizată)” (custom scan), „Scanați cu Microsoft Defender...” (Scan with Microsoft Defender...), „Afișați mai multe opțiuni” (Show more options), „Se afișează pictogramele ascunse”, „Acest PC”, „Dispozitive și unități”, „Descărcări”. Toate din resursele Windows sau din capturi (vezi probele). Pe un Windows în engleză, pagina dă și numele englezești la pașii din laborator.

## Contradicții și decizii (pentru profesor; n-am ales tacit)
1. **„Verificarea setărilor … împreună cu profesorul”** (activitatea VI/11) vs. **ora simultană la Tupilați** (lecția trebuie să meargă fără profesor) → elevul doar privește starea și scanează un fișier text; nicio setare. Dacă vreți verificarea comună, o puteți face la clasă, pe calculatorul profesorului.
2. **Jocul vechi cerea Scanare rapidă** în laborator → respins: pe acest calculator a durat 11 min 16 s (captura), iar 20 de calculatoare deodată ar fi ocupate minute întregi. Lecția scanează un singur fișier (secunde).
3. **„Un .exe e un program”** (jocul vechi) vs. **Windows ascunde implicit extensiile** (V/9) → lecția predă coloana Tip: Aplicație; extensia apare doar ca explicație.
4. **Pagina de exersat cu o fereastră falsă adevărată** (o filă nouă pe sit, închisă cu Ctrl+W) → respinsă: o pagină care imită un avertisment de virus poate fi semnalată de filtrele browserelor ca înșelătoare și poate afecta tot situl. În laborator, Ctrl+W se exersează pe o filă nouă (Ctrl+T), iar fereastra falsă rămâne în simulator.
5. **Ctrl+W în simulator** → nu se cere: browserul nu lasă pagina să oprească scurtătura, iar elevul ar închide lecția. După judecata 1: Ctrl+W nu mai apare în regula din pagină (P3); cererile de tip fereastra spun „cu mouse-ul… nu cu Ctrl+W”; nota stă DEASUPRA browserului simulat; Ctrl+W se exersează doar în gestul real, pe o filă NOUĂ (Ctrl+T → Ctrl+W), și în laborator. Plasa: cât o filă falsă e deschisă în simulator, pagina cere browserului întrebarea „părăsești site-ul?” (`beforeunload`). Pe ecran nu promitem nimic despre această întrebare (cum arată în Chrome/Edge reale: neprobat, A25).
6. **Ordinea „scanezi, apoi deschizi”** (judecata 1, GRAV): Încearcă din pasul 5 și Î5 lăudau elevul care deschidea întâi și scana abia apoi. Acum toate trei (P5, atelier, Î5) verifică ordinea; deschiderea unui fișier nescanat dă pe loc mesajul, iar „Ia-o de la capăt” golește tot. Deschiderea STICKULUI (doar lista lui) înainte de scanare nu e greșeală: nu deschide niciun fișier (la fel ca în atelier, de la autorul inițial).

## Ce n-am putut verifica (NESIGUR) — de confirmat în laborator
- Pe Windows 11, „Scanați cu Microsoft Defender...” apare doar după „Afișați mai multe opțiuni” (dedus din felul extensiei; pagina spune prudent ambele variante) — A02, C1.
- Pagina exactă pe care o deschide comanda de scanare și numărul de „fișiere scanate” (simulatorul arată doar blocul Amenințări curente, cu textele probate) — A03, C3.
- Pictograma scut din zona de notificare și dacă e ascunsă implicit — A09, C4.
- Căutarea din Start („securitate” + Enter) — A06; cum arată Istoric protecție goală — A07; sufixul (1) la descărcări — A17; ștergerea cu Delete în Descărcări — A18; cum arată Securitate Windows când școala are alt antivirus — A16.
- „Microsoft PowerPoint Presentation” ca Tip (analog cu „Microsoft Word Document”, probat de V/9) — A19.
- Esc închide meniul Start și meniul de clic dreapta (gestul din pasul 5, laborator pasul 3) — A23.
- Întrebarea „părăsești site-ul?” la Ctrl+W în Chrome/Edge reale, cu fila falsă deschisă în simulator — A25 (probată doar în Chromium headless).
- Fereastra cu amenințări găsite: nedesenată (fără fișier de test antivirus nu se poate proba; EICAR interzis). Lecția o descrie în cuvinte: „A găsit amenințări? Nu deschizi nimic și chemi un adult.”

## Simulatorul `lectii/_sim/siguranta-pc.js` (proprietar: autorul acestei lecții)
Extensie nouă; nu atinge niciun simulator existent, nu trimite nimic spre exterior (adresele false sunt `.example`). Tipuri: `fereastra` (browser cu filă falsă; corect = ✕ de pe filă sau al ferestrei, fără niciun clic în pagină; se rezolvă la închidere), `scanare` (File Explorer + meniul de clic dreapta Windows 11 + Securitate Windows + caiet), `laborator` (toate, cu bara de activități). Abaterile sunt spuse pe ecran (capul fișierului le listează). Pe telefon: ținut apăsat sau ⋯ = clic dreapta; atingere dublă (600 ms) = deschide.

### Pentru lecția următoare
- Poate folosi: `SigurantaPC.fereastra` cu `falsa:'premiu'|'virus'|'descarca'` (sau o pagină nouă adăugată în `SigurantaPC._intern.FALSE`), `SigurantaPC.scanare` / `laborator` cu `fisiere:{'E:':[{n,t,ic}],'Desc':[…]}` și testele `falsaInchisa`, `scanatInainte` (v = 'E:' sau un fișier: ORDINEA scanare → deschidere), `niciunProgram`, `nr` (primul număr din text sau „zero”), `deschisFaraProgram`. `scanat` (fără ordine) a rămas doar pentru compatibilitate: NU-l folosi pentru o sarcină „verifici înainte să deschizi” (judecata 1, GRAV-1).
- Nu are voie să schimbe: textele probate (numele RO ale meniurilor și ale Securitate Windows), rezultatul „0 amenințări” (singurul probat), regula „niciun clic în pagina falsă”. Teste noi → în `CHK`, cu `rezolva`/`gresit` (poarta le cere).
- Lecția 12 (parole) nu are nevoie de el; lecțiile 13-15 (e-mail) au simulatorul lor (`posta` din `jocuri/internet-vi`).

## Porțile
(rerulate după reparațiile judecății 1, 11.10.2026)
- `test_joc.py --dir lectii/vi m2-l11`: **TRECUT** (25 de întrebări jucate; avertismentul așteptat „1 niveluri”; niciun avertisment de lungime — gesturile reale au fost scurtate ca pașii să rămână sub 150 de cuvinte cu tot cu legende) — `_proba/test_joc.txt`.
- `_proba/proba_j1_reparatii.py`: drumurile judecății, corecte și GREȘITE, 1280 + 390 px, până la diplomă — vezi `_proba/proba_j1_reparatii.txt` (ultima linie = probleme).
- `verifica_lectie.py … --fara-t1`: S0 TRECUT · S1 0 identice · S2 6/6 aplicare/execuție · T0 0 → **ultima linie 0** (`_campaign/.../verificare_lectii/vi-m2-l11/raport.md`).
- Playwright cu gesturi reale, 390 px cu atingere + 1280 px: **0 probleme**, 0 erori în consolă (`_proba/proba_gesturi.json`).
- Date personale: fără căi cu numele contului, fără e-mail sau telefon (verificat cu `learninghub_date_personale.py`).
