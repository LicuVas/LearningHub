# Surse — lecția VII · M3 · 19: „Instrumente de lucru: documente și prezentări în colaborare”

Autor: tura de noapte 23→24.10.2026 (campania „Lecțiile refăcute”). Nimic din memorie: ce spune lecția despre Google vine din
ajutorul oficial în română, citit fără cont (secțiunea 3); ce n-a putut fi confirmat e în secțiunea 8, în `afirmatii.json`
(stare NESIGUR) și în `capturi_lipsa.json` (C1-C9).

## 1. Ancora în documentele profesorului
- `Info_Gimnaziu_2026/planificari/Calendar_ore_7_MA.md` (Brauner): **05.02.2027, lecția 19**, „Instrumente de lucru: documente și
  prezentări în colaborare”, predare. La Izvoare (`Calendar_ore_VII_A.md`, `VII_B.md`) aceeași temă e **09.02.2027, nr. 20** în
  numărătoarea lor.
- `Proiectul_unitatii_VII-U3.md`: VII-U3 „Aplicații colaborative”, 5 ore, **CS.1.3**. Consolidat: „utilizează, independent, funcții și
  instrumente ale unor aplicații colaborative realizând operații uzuale (accesare/conectare, vizualizare, editare, formatare) **pentru
  a dezvolta în echipă materiale digitale**”. Ora 19: „teorie, exercitii”.
- `curriculum.json`, clasa a VII-a, „Aplicații colaborative” — conținuturile declarate (textul exact, cu „ţ” sedilă, ca în programă):
  „Facilități ale aplicațiilor de tip colaborativ”, „Interfaţa aplicaţiei colaborative” (VII/18 a lăsat-o lecției 19),
  „Instrumente de lucru: documente, prezentări”. Activitatea din programă: „realizarea de povești cu autor colectiv (pe grupe…)
  utilizând aplicații colaborative” → laboratorul (fiecare scrie partea lui în documentul echipei).
- Aplicația = **Google (Drive, Documente Google, Prezentări Google)**, cu contul Google de la școală: decizia dirijorului din
  23.10.2026 (`m3_noapte_23_10/prompturi/_noapte.md` §1), ca la VII/18.

## 2. Ce presupun că știe elevul și ce acopăr (bife = verificat în lecția numită; detaliat în `profil.json`)
Lecțiile de care depind, citite întregi (pagina, `surse.md`, `afirmatii.json`):
- [x] **VII/18** (PUBLICATĂ; pagina `lectii/vii/m3-l18/index.html` citită din nou la reparația J1, 24.10.2026, și granița
  `vii_l18.md` cu schimbările de la 02:00 și 03:10): fereastra privată (Ctrl+Shift+N; nu se deschide? filă nouă, cu drumul „filă
  obișnuită” la final), conectarea, „✕ dacă te întreabă de parolă”, Drive-ul meu, Nou → Documente Google („listă mică? documentul
  gol”), „Document fără titlu” → numele + Enter, „Salvat în Drive”, documentul `Nume_Prenume_clasa_colaborare`, Profil → Deconectează-te
  („…de la toate conturile”, dacă scrie așa) + verificarea („Conectează-te” sau o listă cu contul tău deconectat, nu fișierele tale).
  Ce am luat din pagina lui VII/18 (trecerea 3, 24.10.2026, AB; proba mecanică `_proba/t3_copiat.py` → `_proba/t3_copiat.txt`, 0):
  **Copiate întocmai** din fișierul paginii: rândurile `TEL` și `PAUZA` din fiecare bloc „Acum…”; în pasul 1 (Acum…), „<b>✕</b> dacă te
  întreabă de parolă.” și „N-ai cont? Sari peste.” (blocul „Acum…” de la pasul 2 al lui 18); în laboratorul 13, propozițiile „Trebuie să
  apară „Conectează-te”…” și „Ai lucrat într-o filă obișnuită?…” (pasul 13 al lui 18, fără bucata „pe calculator n-a rămas nimic de-al
  tău…”); blocul pliat de telefon („atingi Editează (creionul)” și paragraful „Telefonul e al altcuiva…”, Android și iPhone).
  **Prescurtate** după VII/18, cu aceleași nume de butoane, dar NU cu aceleași fraze: laboratorul 2 (din pașii 2-5 ai lui 18; „✕ dacă
  browserul te întreabă de parolă” e formularea mea), 3 (din pasul 7) și 12 (din pasul 12). Restul blocului „Acum…” de la pasul 1
  („Fereastra privată, drive.google.com, conectarea”; „Deschide documentul tău de la lecția 18.”) e scris de mine.
  „Distribuite cu mine” era doar numit la 18 („aici apar documentele colegilor; în lecția 19”) → aici e predat.
  Butonul „Permite accesul” era oprit la 18 („îl folosești în lecția 19”) → aici e pornit, cu același nume.
- [x] **VII/16** (numele `Nume_Prenume_clasa_tema`): prezentarea se cheamă `Nume_Prenume_clasa_prezentare` (`Pop_Ana_7A_prezentare`).
- [x] **VII/3, VII/5-6** (Word): documentul, selecția (tragi peste text, dublu clic pe un cuvânt), paragraful (Enter) — folosite în pașii 3-4.
- [x] **VI/2-5** (PowerPoint, planul clasei a VI-a): diapozitivul, caseta de titlu și de text, „Diapozitiv nou (New Slide)” (VI/4) —
  pasul 5 („ca «Diapozitiv nou» din PowerPoint”).
- [x] **VII/21** (deja scrisă, în reparare; granița `vii_l21.md`): folosește „Adaugă un comentariu (Add comment) → Comentează (Comment)”
  și rolurile „Editor / Comentator / Cititor” — exact numele de aici; nu contrazic etica ei (comentariu în loc de ștergere: pasul 4,
  „autorul citește și hotărăște”).
- [x] **VII/20** (scrisă în paralel; granița `vii_l20.md`, ~02:05): Comentatorul „comentează și sugerează” acolo. Aici, pasul 2:
  „citește și comentează; textul nu-l schimbă (ce mai poate, afli la lecția 20)”; propunerile lui sunt doar pomenite, în banda
  simulatorului („lecția 20”). Cuvintele
  „sugestii / Sugerare” nu apar în pagină (vocabularul lecției 20).

## 3. Interfața Google: de unde vin numele (citite 24.10.2026, 01:11-01:13)
Toate prin `_proba/surse_google.py` (Chromium din Playwright, headless, context TEMPORAR ro-RO, fără cont, nimic tastat; textul în
`_proba/_surse/<nume>.txt`, cu secțiunile pliate ale ajutorului desfăcute și textul alternativ al pictogramelor între [ ]).
- **S1** `support.google.com/drive/answer/2494822?hl=ro` („Trimiteți fișierele din Google Drive”, `partajare_ro.txt`; EN `partajare_en.txt`):
  „Dați clic pe Trimiteți [Share]” și „există un punct lângă Permite accesul [Share]” (același buton, două nume) · „Introdu adresa de
  e-mail căreia vrei să-i permiți accesul. Dacă folosești un cont de la serviciu sau de la școală, poți să permiți accesul destinatarilor
  sugerați.” · „Selectează o opțiune: Cititor, Comentator, Editor.” · „Când permiți accesul la fișier, fiecare adresă de e-mail primește un
  e-mail.” · „Debifează caseta dacă nu vrei să notifici utilizatorii.” · „Dă clic pe Trimite sau Permite accesul.” · „dacă folosești un
  Cont Google de la serviciu sau de la școală, se poate să nu poți permite accesul la fișiere în afara organizației tale.” · rolurile:
  „Cititor: … nu poate să editeze, să comenteze, să sugereze sau să permită accesul”; „Comentator: … poate să comenteze și să facă sugestii
  …, dar nu poate să-l editeze sau să permită accesul”; „Editor: … poate să editeze, să comenteze, să accepte sau să respingă sugestii și
  să permită accesul” · tabelul: „Proprietar, Editor, Comentator, Cititor” · „Oricine are linkul: toți utilizatorii care au linkul pot
  folosi fișierul, fără a fi necesară conectarea”; „Restricționat: numai persoanele cu acces pot deschide fișierul.”
- **S2** `support.google.com/drive/answer/2494893?hl=ro` („Oprește, restricționează sau modifică permiterea accesului”, `acces_oprire_ro.txt`):
  „În dreptul numelui, dă clic pe săgeata în jos, apoi Elimină accesul.” · „În secțiunea Acces general, dă clic pe săgeata în jos.
  Selectează Restricționat. Dă clic pe Gata.” (EN: General access, Restricted, Done)
- **S3** `support.google.com/drive/answer/2375057?hl=ro` („Find files shared with you in Drive”) — pagina „română” e în ENGLEZĂ
  (`distribuite_ro.txt` = `distribuite_en.txt`): „On the left, click Shared with me.” → „Distribuite cu mine” e NESIGUR (ca la VII/18).
- **S4** `support.google.com/docs/answer/65129?hl=ro` („Folosește comentarii, sarcini și reacții emoji”, `comentarii_ro.txt`; EN
  `comentarii_en.txt`): „Evidențiază textul … Pentru a adăuga un comentariu, în bara de instrumente, dă clic pe Adaugă un comentariu
  [Add comment]. Introdu comentariul. Dă clic pe Comentează.” · „Dă clic pe comentariu. Dă clic pe Răspunde și introdu răspunsul. Pentru
  a salva, dă clic pe Răspunde.” · „În colțul de sus al comentariului, dă clic pe Rezolvă.” · „Pentru a vedea un comentariu pe care l-ai
  închis, dă clic pe Comentarii în colțul de sus al ferestrei.” · „Dacă ai permisiunea să editezi sau să comentezi la un document,
  poți să răspunzi la comentarii.”
- **S5** `support.google.com/docs/answer/179738?hl=ro` (comenzile rapide Documente, `taste_docs_ro.txt`): „Introdu un comentariu —
  Ctrl + Alt + m”.
- **S6** `support.google.com/docs/answer/1694830?hl=ro` („Adaugă, șterge și organizează slide-uri”, `diapozitive_ro.txt`): „Pentru a adăuga
  un slide cu același aspect ca slide-ul actual: … În stânga sus, dă clic pe Slide nou [Plus].” · „În stânga, dă clic pe slide-ul …”.
  **Ajutorul RO al Prezentărilor spune „slide”, nu „diapozitiv”** → pasul 5: „Aici diapozitivul se cheamă slide.”
- **S7** `support.google.com/docs/answer/1696717?hl=ro` (comenzile rapide Prezentări, `taste_slides_ro.txt`): „Slide nou — Ctrl + m”.
- **S8** `support.google.com/docs/answer/2763168?hl=ro` („Cum să folosești Prezentări Google”, `slides_folosire_ro.txt`): „Prezentări
  Google este o aplicație online cu ajutorul căreia poți să creezi și să formatezi prezentări și să colaborezi cu alți utilizatori.” ·
  „Pasul 3: trimite altor persoane și colaborează. Poți să trimiți fișiere și dosare altor persoane și să alegi dacă pot să le
  acceseze, să le editeze sau să le comenteze.”
- **S9** `support.google.com/a/users/answer/10665800` (doar engleză, `ws_slides_prima_en.txt`): „click a text box to enter text”;
  „In the top left, click New slide.”
- **S10** `support.google.com/docs/answer/6239410?hl=ro` (`cititor_ecran_colab_ro.txt`): „Colaborați cu alte persoane în timp real …
  colaborarea în timp real este disponibilă pentru documente, foi de calcul, prezentări și desene”; lista „Colaboratori” (doar cei activi).
- **S11** `support.google.com/docs/answer/13853477?hl=ro` (`pointeri_slides_ro.txt`): „Dacă participi la o prezentare în același timp cu
  alții, poți vedea cursoarele colaboratorilor pe măsură ce se deplasează pe un slide.” (doar Prezentări; pentru Documente, cursorul
  colorat cu numele colegului NU l-am găsit scris → NESIGUR, C5).
- **S12** `support.google.com/chrome/answer/157179?hl=ro` (citit de VII/18, `m3-l18/_proba/_surse/chrome_taste_ro.txt`): „Reîncarcă
  pagina curentă — F5 sau Ctrl + r” (laboratorul, pasul 6).
- **S13** `support.google.com/docs/answer/49114?hl=ro&co=GENIE.Platform%3DAndroid` (`docs_creare_android_ro.txt`): în aplicația de telefon,
  „Accesibile pentru mine: fișiere la care ți-au permis accesul alți utilizatori” (blocul „Lucrezi pe telefonul tău?”).
- **S14** `support.google.com/android/answer/7664951?hl=ro` (`android_cont_scoate_ro.txt`): scoaterea contului de pe un telefon Android
  (Setări → Parole și conturi / Utilizatori și conturi / Gestionează conturile → contul → Elimină contul → confirmarea „Elimină contul”, apoi „Șterge”).
- Lecția VI/4 (`lectii/vi/m1-l04`): „Un diapozitiv nou îl adaugi de pe fila Pornire (Home), cu butonul Diapozitiv nou (New Slide)” →
  „ca «Diapozitiv nou» din PowerPoint”.

## 4. Ce am refolosit și ce nu
- **Jocul `jocuri/colaborare-vii`**, nivelul 3 („Documente și prezentări în echipă”, ateliere `partajare` / `sugestii`) — citit,
  nemodificat. Am păstrat: rolurile Editor / Comentator / Cititor și ce poate fiecare, „cursorul colorat cu numele colegului arată unde
  scrie ACUM”, regula „nu «Oricine are linkul»”, comentariul în loc de schimbarea textului altuia, prezentarea la care lucrează mai
  mulți de acasă. NU am preluat: capturile (sunt din **CryptPad**, nu din Google: în pași ar fi fost imagine-substitut; regula 4),
  „Vizualizează / Editează” (numele CryptPad), modul sugestii și istoricul (lecția 20), linkul ca drum principal.
- **Simulatorul VII/18** `lectii/_sim/colab-google.js` — folosit, NESCHIMBAT (Drive, filele, Nou, conectarea, deconectarea, numele
  fișierului, Distribuite cu mine). Tot ce e nou stă în extensia mea (secțiunea 9).
- **Imaginea pasului 0**: `img/echipa-laptopuri.webp`, din Wikimedia Commons, „Art Students League Archive Edit-a-thon 9483.jpg”, autor
  Avery Jensen, **CC BY-SA 4.0**, licența citită din API-ul Commons pe 24.10.2026 (`img/SURSE.json`; `_proba/commons_cauta.py`, UA-ul
  sitului); decupată jos (masa cu trei laptopuri, fără fețe), 800×315, 24 KB (`_proba/fa_imagini.py`). Tot un edit-a-thon (Wikipedia =
  aplicație colaborativă), ca imaginea lui VII/18, dar altă fotografie.
- **Ghidurile de telefon** (`jocuri/ghiduri/#cont-drive`, `#docs`, `#slides`, `#instalare`) — legate din „Lucrezi pe telefonul tău?”.

## 5. SIGURANȚA — ce salvează și ce trimite pagina
**Citit în cod:** `colab-google-echipa.js` nu scrie în `localStorage` / `sessionStorage` / cookie și nu face cereri; câmpurile ei
(adresa, mesajul, comentariul, răspunsul) sunt `<input type="text">` / `<textarea>` fără `<form>`, fără `name`, cu
`autocomplete/autocorrect/autocapitalize="off"`, `spellcheck="false"`; documentul și casetele slide-ului sunt blocuri `contenteditable`
cu aceleași atribute; lipirea intră doar ca text. Persoanele și adresele sunt inventate (`scoala-exemplu.test`, domeniu rezervat).
**Probat** (`_proba/proba_lectie.py` → `proba_lectie.json`, ieșirea `proba_lectie_final.txt`): servire locală 127.0.0.1, orice altă
cerere oprită și notată cu corpul ei, închidere doar cu `ctx.close()`. Un elev INVENTAT („Elev Echipa”, cod 7319) se înscrie prin
caseta reală și trece toată lecția cu atingeri / clicuri și taste reale, pe 390 px cu atingere și pe 1280 px, cu drumuri greșite de copil
și cu marcaje unice tastate (în fereastra de partajare, în document, în comentariu, în răspuns, pe slide). Rezultat, pe ambele aparate:
marcajele apar de **0** ori în stocarea paginii și în cererile oprite; **0** cereri ajunse afară; niciun `type=password`, niciun `<form>`;
**0** erori JS; după închidere, marcajele **0** pe discul profilului, Login Data.logins = 0, Web Data.autofill = 0.

## 6. Porțile (24.10.2026)
- `test_joc.py --dir lectii/vii m3-l19` → **TRECUT** (27 de întrebări jucate; singurul avertisment „1 niveluri”, așteptat) — `_proba/test_joc_final.txt`.
- `verifica_lectie.py index.html --fara-t1` → **ultima linie 0** (S0 TRECUT · S1 0 identice · S2 aplicare/execuție 6/6 · T0 0) — `_proba/verifica_lectie_final.txt`.
  Pe drum: T0 a prins „slide” folosit în pasul 0 înainte de definiție (pasul 5) → în antet și în pasul 0 scrie „diapozitiv”.
- Playwright cu gesturi reale, 390 px cu atingere + 1280 px → **0 probleme, 0 erori JS** (`_proba/proba_lectie_final.txt`); capturile de
  telefon `_proba/_ecran_*_390.png`, privite. Ce au găsit și am reparat: (1) după „Verifică”, colegii simulați care scriau mai departe
  ștergeau ✗-urile și mesajele → marcajele rămân după primul „Verifică”; (2) mesajul „Ai dat acces…” era șters de cronometrul mesajului
  de dinainte; (3) pe telefon, „Adaugă un comentariu” ieșea din bara de instrumente și împingea panoul în lateral → rândul se rupe;
  (4) textul slide-ului ieșea din casetă pe telefon → slide-ul crește după conținut; (5) caseta de adrese avea dublu chenar.
- `_proba/numara.js` → 0 (cuvinte pe pas, cu „Acum în browserul tău adevărat”: 70 / 108 / 72 / 101 / 108 / 101; „Uite cum” ≤ 56; nicio
  propoziție peste 25 de cuvinte; testele există; laboratorul: 13 pași, ≤ 52 de cuvinte fiecare).
- Fără fișiere de descărcat (.docx/.pptx/.xlsx): `curata_metadate.py` n-are ce curăța aici.

## 7. Contradicții și decizii (pentru profesor; n-am ales tacit)
- **Butonul de partajare**: ajutorul RO îi spune și „Trimiteți”, și „Permite accesul” (S1). Lecția: „Permite accesul” (Share), ca VII/18.
- **„slide” sau „diapozitiv”**: PowerPoint în română spune „diapozitiv” (clasa a VI-a), Prezentări Google în română spune „slide” (S6).
  Lecția le leagă o dată („Aici diapozitivul se cheamă slide”) și apoi folosește numele din Google.
- **Comentatorul**: ajutorul (S1) spune că poate și să facă sugestii; sugestiile sunt ale lecției 20. Aici, la pasul 2: „citește și
  comentează; textul nu-l schimbă (ce mai poate, afli la lecția 20)” (reparația J1, T: excepția spusă, fără cuvântul lecției 20), iar banda
  simulatorului spune că ce ar scrie el devine o propunere (lecția 20). În desen nu poate scrie deloc: abatere de fidelitate spusă pe ecran
  (jocuri/README §1). Colegii simulați cu rolul Comentator nici ei nu scriu în text (reparația J1, C).
- **Regula lecției** „acces doar echipei și profesorului; Acces general: Restricționat”. La conturile de școală, „Acces general” poate avea
  de la început numele școlii (nescris în ajutor, C3): laboratorul cere „Restricționat” oricum („Scrie altceva? săgeata, Restricționat”).
- **Rolul profesorului** (reparația J1, S): UN singur rol în toată lecția, **Comentator**, cu motivul spus („ca să vă lase observații”):
  pasul 2 (text, Uite cum, Încearcă), laboratorul pasul 5 (doar dacă și-a scris adresa pe tablă). Situațiile de **Cititor** sunt ale unui
  coleg din echipă care doar citește (Mara, Ioana, Radu cu mâna ruptă la Î1). La VII/20, lucrarea gata se dă profesorului cu Cititor
  doar dacă nu are deja acces: cu acces de Comentator de la 19, n-o mai partajează a doua oară.
- **Cine e proprietarul în echipă**: „cel al cărui nume e primul în catalog” (o regulă simplă, fără profesor); prezentarea o face al
  doilea, ca fiecare să fie o dată proprietar.
- **Izvoare (Dumbrava) = telefoanele elevilor**: laboratorul e scris pentru calculatorul din laborator; pe telefon, blocul pliat „Lucrezi
  pe telefonul tău?” (aplicațiile Documente și Prezentări Google + ghidurile de pe sit), fără probă pe un telefon real (A30).
- **Telefonul altcuiva** (reparația J1, G): paragraful e EXACT cel din VII/18 publicată — pe Android „…Elimină contul, apoi confirmi
  (Elimină contul sau Șterge)” (S14), pe iPhone „contul nu e în Setări, ci în aplicație: … Gestionează conturile de pe acest dispozitiv
  și Elimină de pe acest dispozitiv” (VII/18, ajutorul RO mail/answer/8154). Proba: `_proba/proba_reparatii.py` [G] compară cele două fișiere.
- **Numerotarea**: la Brauner lecția 19, la Izvoare nr. 20; pagina urmează `unitati.json` (19).

## 8. Nesigur / de confirmat (în `afirmatii.json` cu stare NESIGUR; de fotografiat: `capturi_lipsa.json`, C1-C9)
- Eticheta butonului de partajare (A1); cum arată fereastra: titlul, lista persoanelor din școală, rolul ales de la început, numele casetei
  de notificare, rândul „Proprietar (tu)” (A2, A6, A8 — C2); ce e ales la „Acces general” la un cont de școală (A7 — C3).
- „Distribuite cu mine” în română (A11 — C4).
- Cercul colegului lângă butonul de partajare și cursorul colorat cu numele lui în **Documente** (A12, A13 — C5).
- Enter la sfârșitul paragrafului în Documente Google (A14, risc mic); forma comentariului pe margine și a butonului Rezolvă (C6).
- Cum arată documentul pentru Comentator și Cititor (A19, A31 — C7); dacă Editorul poate redenumi un fișier primit (A32).
- Nou → Prezentări Google și „Prezentare fără titlu” (A20 — C8); casetele slide-ului nou și locul lui în listă (A23, A26 — C9).
- Telefonul: partajarea, comentariile și slide-ul nou în aplicații (A30).
- Desenul simulatorului (fără logo; fereastra „Permite accesul” e „desen după ajutorul Google”; cercurile, cursorul și casetele slide-ului
  au textele simulatorului, nu ale Google).
- Adăugate la reparația J1: Enter cu două persoane în listă (A37 — C2); Backspace / săgețile între paragrafe în Documente (A36 — C10);
  „listă mică” → prezentarea goală (A40 — C8); slide-ul gol al unei prezentări noi (A41 — C9); verificarea deconectării (A43, ca la VII/18).
- Adăugate la trecerea 3 (24.10.2026): A36 e acum DOAR unirea paragrafelor (Backspace / Delete), iar săgețile și Ctrl+Home / Ctrl+End,
  care doar mută cursorul, sunt A44 (C10); ce vede colegul căruia i se ia accesul cât are documentul deschis (A45 — C11 nou; simulatorul
  îl scoate pe loc din fișier).

## 9. Pentru lecția următoare (20: publicare, istoric, contribuții; 22: evaluarea) — extensia `lectii/_sim/colab-google-echipa.js`
**Poți folosi** (API-ul e scris în capul fișierului și în `m3_noapte_23_10/granite/vii_l19.md`, actualizarea ~02:15):
- Încarci `colab-google.js`, apoi `colab-google-echipa.js`; tipul pentru motor `echipa` (`tipuri:{echipa:SimColabEchipa.echipa}`) pune
  singur `extensii:['echipa']`. `Q {sim:{…opțiunile lui colab-google + echipa:{persoane?, viteza?, scenariuNou?:{doc,prez}}}, teste:[{c,v,d,ce,m}], gresit, arata}`.
- Câmpuri pe fișiere: `paragrafe [{autor,text}]`, `comentarii [{autor,text,la:{autor,text},raspunsuri?,rezolvat?}]`, `slides [{autor,titlu,text}]`,
  `acces [{cine,rol}]`, `general`, `rolMeu`, `scenariu [{cine,cand:'deschis'|'partajat'|'comentat',fa:'intra'|'scrie'|'comenteaza'|'raspunde'|'slide'|'iese',text?,titlu?,la?,pauza?,nou?}]`.
- Testele: `partajat {v:{cine,rol,fisier?}}`, `doarEchipa {v:[…]}`, `restrictionat`, `deschis {v:id}`, `paragraf {v:cuvinte}`, `neatins`,
  `comentat {v:autorulTextului}`, `raspuns {v:autorulFirului}`, `rezolvat {v:autorulFirului}`, `prezentare`, `slide {v:n}` + orice cheie din
  `SimColabGoogle.TESTE`. Rezolvarea automată face testele în ordinea din `teste`; `gresit`: `{sari}` | `{adresa}` | `{rol}` | `{general:'link'}` | `{atinge}` | `{strain}`.
- `inst.echipa`: `stare, model, on, jurnal, persoana, deschideDialog, inchideDialog, partajeaza, seteazaRol, general, scrieParagraf, atinge,
  comenteaza, raspunde, rezolva, slideNou, scrieSlide, laDrive, deschide, grabeste`.
- Persoanele (`SimColabEchipa.PERSOANE`): ana, radu, ioana (conturile lui 18), profesor (`profesor.tic@scoala-exemplu.test`, „Profesorul de TIC”),
  radu2 (Radu Enescu), ioana2 (a doua Ioana Rusu), mara (Mara Dinu); culori fixe pe persoană (cursorul, cercul).
- Ce rămâne la elev după 19: documentul echipei (al primului din catalog), partajat ca Editor cu colegii (și, dacă profesorul a dat
  adresa, cu el, ca Comentator), cu câte un paragraf de la fiecare și comentarii rezolvate; prezentarea `Nume_Prenume_clasa_prezentare`
  a fiecăruia (pasul 5, cu un slide); prezentarea echipei, cu câte un slide de la fiecare, DOAR dacă au avut timp (laboratorul 10-11).
- **Schimbat la reparația J1 (24.10.2026) — doar ADAOSURI, nimic scos sau redenumit:** `Q.variante:[{text, ok, dece}]` (comentariul pe
  alegere; testul `comentat` trece doar cu o variantă `ok:true` și fără una nepotrivită deschisă; fără `variante` se scrie liber, ca
  înainte, iar testul nu judecă ce spune); `gresit:{varianta:i}`; pe pașii scenariului `raspunde`, câmpul `textNepotrivit` (răspunsul
  colegului la o variantă nepotrivită; lipsă = tace); colegii simulați fac doar ce le permite rolul de ACUM (Comentator: `intra`,
  `comenteaza`, `raspunde`, `iese`; Cititor / fără acces: nimic) și își reiau pașii rămași când rolul se schimbă (din listă sau cu
  `seteazaRol`); `inst.echipa.focusLaLucru()` (focusul înapoi unde a lucrat elevul; folosit după un „Verifică” respins); testul
  `paragraf` numără DOAR paragrafele noi (Enter la sfârșit), nu un rând vechi continuat. Tastele documentului: Ctrl+A (tot documentul),
  Ctrl+Home / Ctrl+End, săgețile între paragrafe, Backspace / Delete care unesc paragrafele.
- **Trecerea 3 (24.10.2026) — tot fără schimbare de API:** persoanele au în plus câmpul OPȚIONAL `dat` (genitiv-dativul: „lui Radu Ene”,
  „Ioanei Rusu”, „profesorului de TIC”); tot ce scrie simulatorul despre o persoană (etichetele `partajat`, `comentat`, `raspuns`,
  `rezolvat`, mesajele lor, nota fișierului primit, `aria-label`) îl folosește, iar pentru o persoană fără `dat` se aplică regula
  prenumelui (-a → -ei, -ea → -ei, -ca/-ga → -căi/-găi; Luca, Mihnea… și restul → „lui …”). Atenție la probe: `aria-label` e acum
  „Paragraful Anei Pop” / „Paragraful Ioanei Rusu” (nu „Paragraful lui Ana Pop”). „Elimină accesul” și `seteazaRol(id, adresa, null)`
  scot colegul din fișier (cercul și cursorul), ca pasul `iese`, cu evenimentul `coleg` `{fa:'iese'}`; un coleg căruia i s-a șters
  paragraful cât scria (Ctrl+A + Delete) scrie mai departe într-un paragraf nou. Eticheta testului `restrictionat`: „Acces general: a
  rămas Restricționat (nu Oricine are linkul)”.
**NU schimbați** în extensie: numele testelor și forma lui `Q`, câmpurile fișierelor, regula „nimic nu se salvează, nimic nu pleacă”.
Un lucru nou = extensie nouă (VII/20 are deja `colab-google-istoric.js`, de sine stătătoare). **Atenție**: extensia desenează în
`doc-pagina` (înlocuiește foaia lui colab-google pentru TOATE fișierele) — două extensii care desenează amândouă în `doc-pagina` nu se
încarcă împreună.

## 10. Pentru componenta comună (`lectii/_sim/colab-google.js`, proprietar VII/18 — NU l-am schimbat)
- Fișierele primite (`proprietar` ≠ contul) au o notă fixă: „Ce poți face într-un document primit de la un coleg afli în lecția 19”, iar
  numele lor e doar de citit. Extensia mea înlocuiește nota (după rol) și lasă Editorul să redenumească, la evenimentul `desenat`.
  Ecranul Prezentări (`hSlides`) și lista goală „Distribuite cu mine” spun tot „în lecția 19”: textele merită schimbate de proprietar
  după ce 19 se publică (de exemplu „vezi lecția 19”).
- Sloturile `doc-pagina` care întorc un Element sunt re-atașate la fiecare redesenare: focusul elevului se pierde la orice `deseneaza()`.
  Extensia mea nu redesenează niciodată cât scrie elevul (colegii simulați scriu direct în nodul de text), probat.
- Pe ecranele înguste, `.cg-unelte` și `.cg-drpt` nu se rup pe rânduri: extensia adaugă, doar în stilul ei, `flex-wrap:wrap` sub 560 px.

## Reparațiile după judecata 1 (24.10.2026)
Autor proaspăt, dimineața (`luni_12_10/prompturi/_reparare_j1.md`, `m3_noapte_23_10/prompturi/r1_vii19.md`). Registrul, cu fiecare punct
al AMBELOR judecăți (opus J1-1…15, sonnet M1-4, m1-12), literele A-Z, citatul, reparația, locul și proba: **`_verificare/registru_j1.md`**
(26 de puncte: 7 MAJOR, 19 MINOR; toate reparate, niciunul respins). Copia dinainte: `_proba/inainte_r1/`.

**Ce s-a schimbat în pagină:** focusul după un „Verifică” respins rămâne în documentul elevului (A); colegii simulați fac doar ce le dă
voie rolul lor de ACUM, iar un rol schimbat din listă le reia lucrul (B, C); comentariile din simulator se ALEG dintre variante scrise,
cu motivul, iar colega mulțumește doar unui comentariu potrivit (D — regula campaniei, ca la VI/16 și VII/21; scrisul liber rămâne în
laborator, în Google adevărat); durata: „Cum lucrezi” scurt, atelierul fără prezentare (10 teste), explicația atelierului o frază,
gesturile repetate o singură dată (scrisul și comentariul doar în laborator; prezentarea + Slide nou la P5 Acum; prezentarea echipei din
laborator = „Dacă mai ai timp”), pașii laboratorului mai scurți (E: **48,1 min** pe metoda judecătorului opus, `_proba/durata_r1.py`; judecata 2, cu metoda ei, a găsit
51,3 min → AE, scurtat la trecerea 3, mai jos);
rândurile `TEL` și `PAUZA` ale lui VII/18 în blocurile „Acum…” și „Sună de pauză? Mergi la pasul 12.” în laborator (F; la trecerea 3
rândul a devenit „Sună de pauză, oricând? Întâi Profil → Deconectează-te (pașii 12-13).” și e primul în pasul 2 — AA); blocul de telefon
cu cuvintele lui VII/18 (G); profesorul = Comentator peste tot, cu motivul (S); Î1 = o situație de Cititor (Z); perechile EN (M); restul
MINOR în registru.

**Pentru lecția următoare (20, 22) — API-ul extensiei `colab-google-echipa.js`:** NIMIC scos sau redenumit (testele, forma lui `Q`,
câmpurile fișierelor, `inst.echipa` vechi rămân). Adăugat: `Q.variante` + `gresit:{varianta}`, `textNepotrivit` pe `raspunde`,
`inst.echipa.focusLaLucru()`, colegii după rol (`permis`), tastele documentului; schimbat la vedere: testul `paragraf` numără doar
paragrafele NOI, mesajul `neatins` vorbește de slide la prezentări, mesajul de la Enter cu mai multe persoane. Detalii: §9 și capul fișierului.

**Porțile, rulate din nou (24.10.2026, după reparații):**
- `test_joc.py --dir lectii/vii m3-l19` → **TRECUT** (27 de întrebări jucate; doar „1 niveluri”, așteptat) — `_proba/test_joc_r1.txt`.
- `verifica_lectie.py index.html --fara-t1` → **0** (S0, S1, S2 6/6, T0 trecute; T1 nerulat) — `_proba/verifica_lectie_r1.txt`.
- `learninghub_date_personale.py` → **0** — `_proba/date_personale_r1.txt`.
- Proba autorului `_proba/proba_lectie.py`, adusă la lecția reparată (`_proba/r1_patch_proba.py`; P2 Comentator, comentariile pe alegere,
  atelierul cu 10 teste, laboratorul): **165 de verificări OK, 0 probleme**, 390 cu atingere + 1280 — `_proba/proba_lectie_r1.txt`.
- Proba reparațiilor `_proba/proba_reparatii.py` (o verificare pe literă, drumurile judecătorilor + 10 noi) — `_proba/proba_reparatii_N.txt`, ultima linie 0.
- `_proba/numara.js` → 0 (cuvinte cu blocul „Acum…”: P1 108, P2 109, P3 106, P4 93, P5 109; laboratorul ≤ 60 de cuvinte pe pas).
- VII/18 publicată neschimbată: `git diff` gol pe `lectii/vii/m3-l18/` și `lectii/_sim/colab-google.js`.
- Fără fișiere de descărcat: `curata_metadate.py` n-are ce curăța.

## Trecerea 3 (24.10.2026)
Autor proaspăt, după judecata 2 (opus: PUBLICABIL, 0 GRAV / 0 MAJOR / 7 MINOR; `_verificare/judecator2.md`), prompt
`m3_noapte_23_10/prompturi/t3_vii19.md`, plus un punct al dirijorului venit în timpul trecerii (AH). Registrul: **`_verificare/registru_j1.md`,
secțiunea „Trecerea 3 (24.10.2026)”** (AA-AH: 8 MINOR, toate reparate, niciunul respins). Copia dinainte: `_proba/inainte_t3/`.

**Ce s-a schimbat în pagină:** laboratorul 2 începe cu rândul de pauză, „Sună de pauză, oricând? Întâi Profil → Deconectează-te (pașii
12-13).”, ca să-l citească și cine e deja conectat (AA); P1 Acum, prima conectare reală, are „✕ dacă te întreabă de parolă. N-ai cont?
Sari peste.”, cuvintele din fișierul lui VII/18 (AB; §2 spune acum exact ce e copiat și ce e prescurtat); trimiterea din laboratorul 10
spune „pasul 5 al lecției (Prezentarea echipei)”, iar P5 Acum „poate o folosești la laborator” (AD); text mai scurt, fără niciun gest scos:
„Uite cum”, explicațiile de după „Corect”, intro, „Cum lucrezi” într-o frază, introducerile atelierului și laboratorului, câteva enunțuri;
„Verificați: câte un paragraf…” e la capătul pasului 9 (AE); legătura „atelierul lecției” din laborator are 38 px pe telefon (AH, ca la VII/20).
**Durata:** **49,5 min** la 110 cuv./min pe metoda judecătorului 2 (`_verificare/j2_durata.py` → `_proba/t3_durata.txt`: 2.155 de cuvinte,
de la 2.347, + 29,95 min de gesturi; 47,9 la 120; 51,5 la 100), 46,4 min pe `_proba/durata_r1.py`. Propunerea judecătorului de a scoate
numele prezentării din P5 Acum n-am urmat-o: e un gest real, iar fără el în Drive-ul elevului ar rămâne o „Prezentare fără titlu”.
**În simulator (extensia `colab-google-echipa.js`):** genitiv-dativul corect în tot ce scrie singur — „Ai dat acces profesorului de TIC”,
„Ioanei Rusu”, „care nu e a Ioanei Rusu”, „lângă numele ei”, „Documentul e al lui Radu Ene”, „Prezentarea e a Ioanei Rusu”, `aria-label`
„Paragraful Anei Pop” (AC: o regulă, nu cazuri); după „Elimină accesul”, colegul iese din fișier: cercul și cursorul dispar, nu mai scrie,
iar la un acces nou revine; dacă elevul îi șterge paragraful cu Ctrl+A + Delete cât scrie, colegul scrie mai departe într-un paragraf nou (AG).
**În fișiere:** §2 citează pasul 2 de acum (AF); `afirmatii.json`: A36 = doar unirea paragrafelor, A44 nouă = săgețile / Ctrl+Home / Ctrl+End
(AF), A45 nouă = scoaterea accesului (NESIGUR, AG), A29 spune ce e copiat din 18 (AB); `capturi_lipsa.json`: C10 → și A44, C11 nou (AG).
**Pentru lecția următoare:** API-ul extensiei NU s-a schimbat (vezi §9, punctul „Trecerea 3”): câmpul opțional `dat` pe persoane, `aria-label`
cu forma nouă („Paragraful Anei Pop”), „Elimină accesul” = colegul iese. Granița `m3_noapte_23_10/granite/vii_l19.md` are aceeași notă.

**Porțile, rulate din nou (24.10.2026, după trecerea 3):**
- `test_joc.py --dir lectii/vii m3-l19` → **TRECUT** (27 de întrebări jucate; doar „1 niveluri”) — `_proba/t3_test_joc.txt`.
- `verifica_lectie.py index.html --fara-t1` → **0** (S0, S1, S2, T0 trecute; T1 nerulat) — `_proba/t3_verifica_lectie.txt`.
- `learninghub_date_personale.py` → **0** — `_proba/t3_date_personale.txt`.
- `_verificare/j2_durata.py` → **49,5** — `_proba/t3_durata.txt`; `_proba/numara.js` → 0 — `_proba/t3_numara.txt`; `_proba/t3_copiat.py` → 0.
- Proba autorului `_proba/proba_lectie.py` (adusă la etichetele noi: „Anei Pop”, „Ioanei”): **165 OK, 0 probleme** — `_proba/t3_proba_lectie.txt`.
- Proba reparațiilor `_proba/proba_reparatii.py` (literele vechi A-Z + AA-AH, 1280 cu mouse și taste, 390 cu atingere): **154 OK, 0 probleme**
  — `_proba/t3_proba_reparatii_3.txt` (rulările 1-2 au prins doar greșeli ale scriptului de probă: exercițiul rămas la „Încă 1”).
- `activitate.py lista`: 2 rânduri „nu e în catalog” (cât a găsit și judecata 2 la 06:22), 0 cu numele de probă; lista nu e salvată — `_proba/t3_activitate.txt`.
- VII/18 publicată neschimbată: `git diff` gol pe `lectii/vii/m3-l18/` și `lectii/_sim/colab-google.js` — `_proba/t3_git_diff_18.txt`.
