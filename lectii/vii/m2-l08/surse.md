# Surse — VII · M2 · lecția 8 „Reguli de tehnoredactare și estetică a paginii tipărite”

## Programa și ordinea lecțiilor
- `C:\00\Projects\Info_Gimnaziu_2026\data\unitati.json` — VII-U1 „Tehnoredactare: editorul de texte” (CS.1.1, CS.3.1), lecția 8, tip „predare”, materiale „teorie, exercitii”. Lecțiile 9 (mini-proiect) și 10 (evaluare sumativă) NU sunt cerute aici.
- `C:\00\Projects\Info_Gimnaziu_2026\planificari\Calendar_ore_VII_A.md` / `_VII_B.md` — lecția 8: 03.11.2026, prima din modulul 2.
- `C:\00\Projects\Info_Gimnaziu_2026\planificari\Proiectul_unitatii_VII-U1.md` — descriptorul Avansat de la CS.1.1: „…respectând reguli date de tehnoredactare şi estetică a paginii tipărite”. Proiectul nu dă exemple pentru lecția 8; n-am inventat criterii de notare.
- `C:\00\AI_0\data\informatica_gimnaziu\curriculum.json` (OMEN 3393/2017) — conținutul declarat, copiat exact (cu „ş” cum e în programă): „Reguli generale de tehnoredactare şi estetică a paginii tipărite”.
- **Calea:** sarcina a cerut `lectii\vii\m2-l08\` și cheia `lectie_vii_m2_l08` (standardul scrie `m1-lNN`, dar lecția 8 e în modulul 2). Motorul citește numărul lecției și cheia de activitate din cale (`/m(\d+)-l(\d+)/`), deci firimiturile și jurnalul merg.

## Regulile de limbă (surse numite)
- **DOOM3**, Studiu introductiv, 1. Semnele grafice — https://doom.lingv.ro/studiu_introductiv/semne_grafice (copie: `_proba/surse_web/doom3_semne_grafice.txt`, descărcată 28.09.2026 cu User-Agent-ul sitului):
  - 1.2.3 Blancul: „bara oblică, cratima și punctul interior nu sunt precedate, nici urmate de blanc […]; linia de pauză este încadrată de blancuri; semnul exclamării și virgula nu sunt precedate, dar sunt urmate de blanc”;
  - 1.2.5 Linia de pauză: „Este mai lungă decât cratima și nu trebuie înlocuită cu aceasta și nici folosită în locul ei. Este în general precedată și urmată de blanc”;
  - 1.1.3.2 Semnele diacritice: virgulița de sub ș și ț „este diferit[ă] de sedilă”.
- **dexonline, „Punctuația”** — https://dexonline.ro/article/Punctua%C8%9Bia (după IOOP5, GLR 2008, DOOM2; copie: `_proba/surse_web/dexonline_punctuatia.txt`): semnele terminale „niciodată nu sunt despărțite cu spațiu (blanc) de cuvântul precedent”; la paranteze și ghilimele „textul interior este scris fără spațiere față de aceste semne”; linia de pauză „întotdeauna precedată și urmată de un spațiu”; ghilimelele „” (99-99) recomandate de Academia Română.
- Excepția de la „un spațiu după semn” (judecătorul, G1): dexonline „Punctuația”: punctul nu e urmat de spațiu „când e separator pentru dată sau pentru numere mari”; DOOM3 1.2.3: „punctul interior nu [e] precedat, nici urmat de blanc”. Lecția o spune la pasul 1, strâns (judecătorul 2, N1): excepția e doar ÎN INTERIORUL unui număr, al unei date, al unei ore, al unei abrevieri, al unei adrese (7,5, 13.11.2026, 10.30, ș.a.m.d., www.scoala.ro); între numere diferite, după virgulă se pune spațiu (12, 13 și 14). Are un exercițiu cu dată și oră, unul cu înșiruirea „5, 6 și 7” și o întrebare cu dată și oră.
- Lecția predă doar „…”; « » (admise de Îndreptar pentru citat în citat) nu apar nicăieri, ca să nu fie o regulă cu excepții nespuse.

## Materialul refolosit și ce e nou
- `jocuri\word-vii\index.html`, nivelul „Vânătoarea de greșeli” (`lectii:[8]`): ordinea regulilor de spațiu, ideea „butonul ¶ ca unealtă de verificare”. Întrebările și exercițiile de aici sunt NOI (nu le-am copiat: S1 din linia de verificare = 0 identice).
- `jocuri\word-obiecte-vii\index.html`, nivelul „Antet, subsol și verificarea finală” (`lectii:[3,8]`): previzualizarea cu Ctrl+P. N-am preluat antetul/subsolul, Ctrl+Enter și PDF-ul (nu sunt în titlul lecției). N-am refolosit `previzualizare.webp` de acolo: am făcut o captură nouă, pe documentul lecției, cu „1 of 2”.
- Lecțiile publicate ale clasei: lecția 2 (¶, Enter, ⌫), 3 (F12, regula numelui, „already exists” -> Anulare), 5 (selectarea, Activare editare), 6 (fontul, alinierea), 7 (marginile). Le folosesc ca unelte, trimit la ele în „Ai nevoie de”; nu le repet.
- **Simulatorul:** extensie NOUĂ `lectii\_sim\wordobj-tehnoredactare.js` (tipul `wordteh`; proprietar: autorul acestei lecții). Folosește NESCHIMBATE `wordobj.js` și `wordobj-formatare.js` (editorul: tastare, ⌫, Delete, Enter, selectare, fonturi, aliniere, ¶). Adaugă: testele regulilor, fila File (Home, Print) cu previzualizarea desenată fără ¶ și cu numărul de pagini, Ctrl+P (tastă și buton pe telefon), Esc / ←.
- Capturile și paginile desenate de Word: `img\SURSE.json` (proveniența fiecăreia). Poza din pasul 0: Wikimedia Commons, CC BY-SA 2.0, Geographer, verificată prin API pe pagina fișierului.
- Documentul de descărcat `expozitia-de-desene.docx`: făcut în Word-ul real (limba română pe tot textul, autor golit), salvat în `_proba\_fis`, copiat aici, `curata_metadate.py --curata` -> 0 fișiere cu nume; apoi `_proba/scoate_rpi.py` scoate setarea „Remove personal information” (altfel Word arată o bară galbenă la deschidere). `_proba/verifica_continut.py`: textul lui = `_proba/continut.py` (0 nepotriviri).

## Proba în Word-ul real (rezumat; detaliile în `afirmatii.json`)
- Word 16.0.20326 (EN), Windows RO; instanță nouă /x pe desktopul ascuns, taste reale (WM_KEYDOWN / WM_CHAR), doar PID-ul meu oprit, documente închise fără salvare, `AddToRecentFiles=False`; `curata_mru_office.py` nu arată nimic din `vii\m2-l08`.
- Descoperiri care au schimbat lecția:
  - Word NU repară singur spațiile greșite (A1) — de aici regula „verifici tu, cu ¶”.
  - Ghilimelele drepte devin „…” și „ - ” devine „ – ” la tastare (A3, A4) — spus în „Uite cum”, cu „verifică totuși cu ochii” (pe o tastatură engleză n-am putut proba ghilimelele).
  - ⌫ la începutul rândului rupt LIPEȘTE cuvintele („lamunte”, „claseia”) (A9) — fiecare instrucțiune de unire cere apoi bara de spațiu.
  - Tragerea peste spațiile din fața titlului atinge ușor prima literă și selectează tot cuvântul (auto-selectarea cuvântului, lecția 5); cu Delete dispărea titlul (proba din simulator). Instrucțiunea a devenit „clic înaintea primului cuvânt, ⌫ până dispar punctele” (A10, probat cu taste reale). Un ⌫ în plus unește semnătura cu rândul de deasupra: de aceea „până dispar punctele”.
  - Ctrl+P deschide direct pagina Print, iar semnele ¶ nu apar în previzualizare și nici în PDF (A11, A12); Esc te întoarce (A13).
  - Invitația de la pasul 5: pragul e 16 rânduri goale în Word și tot 16 în simulator (A14); lecția pune 20.
- Butonul ¶ al Word-ului: una dintre probele mele l-a lăsat pornit; l-am oprit și am verificat într-o pornire nouă (`_proba/pune_la_loc_showall.json`).

## Reparațiile după judecător (28.09.2026; `_verificare/judecator.md`: 1 GRAV, 5 MAJOR, 8 MINOR)
- **G1** excepția de la cifre și adrese: pasul 1 (text), „Încă un exercițiu” nou (data și ora rămân), întrebarea 2 nouă (spații + dată, în locul vânătorii de spații); în simulator: regula `lipitDupa` sare peste cifră-semn-cifră și adrese, regula nouă `intreCifre` prinde „18. 12. 2026”.
- **M1** tastaturile, probate pe aranjamentele reale (`_proba/tastatura_ro2.json`; numele cum le arată Windows-ul în română: „Română (standard)”, „Română (tradițională)”): „ = tasta din stânga lui 1, ” = Shift + ea; tasta de lângă Enter (desenată cu ") scrie ț; pe Română (tradițională), ș iese ş (sedilă) — „nu e vina ta”.
- **M2** laborator, pașii 6-7: „paragraful cu tema (e pe două rânduri)… trage de la «Tema» până după «clasa).»” (probat: 2 rânduri, `rezultate_word_d.json`).
- **M3** Ctrl+P prins în toată pagina cât e exercițiul pe ecran (probat cu focusul pe BODY, după „Pasul următor →”).
- **M4** tasta ¶ de 40 px sub fereastră, în toate exercițiile `wordteh` (apasă butonul ¶ din panglică).
- **M5** vânătorile: cea cu spații de la pasul 1 și întrebarea 2 au devenit exerciții în Word-ul simulat; la vânătorile rămase (pasul 2, întrebarea 3), fiecare țintă mai îngustă de 32 px primește o zonă de atins de 32 x 32 px centrată pe ea (pseudo-element, un mic script în pagină marchează țintele), fără să miște textul. Prima încercare (lărgirea cuvintelor) schimba spațiile de pe ecran, adică tocmai ce se vânează; iar „și s -a” punea trei ținte mici una lângă alta, deci propoziția de la pasul 2 a devenit „și apoi ne -am culcat”. Măsurat cu elementFromPoint: toate țintele ≥ 32 x 44 px, 0 cuvinte mutate (proba_ui_l08.json, proba_q3_tinte.json), vânătorile rezolvate cu degetul.
- **m1** „cinci greșeli”; **m2** textul alternativ al capturii; **m3** `<w:removePersonalInformation/>` scos din settings.xml (`_proba/scoate_rpi.py`), bara galbenă nu mai apare (probat, cu control); **m4** „Pornire (Home)”, „Paragraf (Paragraph)”, „Fișier (File) › Imprimare (Print)”; **m5** fraza despre lecția 5; **m6** „Word-ul adevărat”; **m7** comentariul extensiei (pragul 16); **m8** „cursorul rămâne între cuvintele lipite: apasă imediat bara de spațiu”.
- Aceeași bară galbenă e și la documentele lecțiilor 3, 5 și 6 (judecătorul, m3): nu le-am atins (nu sunt ale mele).

## Reparațiile după judecătorul 2 (28.09.2026; `_verificare/judecator2.md`: 0 GRAV, 1 MAJOR, 3 MINOR)
- **N1** excepția era prea largă („între cifre”): un copil putea scrie „12,13 și 14”. Pasul 1 spune acum „în interiorul unui număr, al unei date, al unei ore, al unei abrevieri sau al unei adrese… Între numere diferite, după virgulă pui spațiu: 12, 13 și 14”. Exercițiu nou (pasul 1, „Încă un exercițiu” 3): „clasele 5,6 și 7” -> „5, 6 și 7”, respins lăsat lipit, acceptat reparat. În simulator, `intreCifre` prinde doar punctul / două puncte cu spațiu între cifre („13. 11”, „10: 30”), nu și „12, 13”. Ambele sensuri: `_proba/proba_reguli.js` -> 0.
- **N2** abrevierile (ș.a.m.d., S.U.A.) sunt în excepție și nu mai sunt marcate greșite în simulator.
- **N3** pasul 2: „Tastatura nu scrie deloc diacritice (lecția 3)? Azi nu ai de tastat niciuna; spune-i profesorului la oră.”
- **N4** pe telefon (atingere sau ecran îngust), mesajul testului „Semnele ¶ sunt pornite” trimite la tasta ¶ de sub fereastră; pe calculator, la fila Pornire (Home), grupul Paragraf (Paragraph), plus tasta.
- Word-ul real NU l-am pornit la trecerea 2 (reparațiile sunt în text și în simulator).

## Numele românești
- Din calibrare (`calibrare\meniuri_ro_en.json`) și lecțiile clasei: Pornire (Home), Paragraf (Paragraph), Fișier (File), Salvare ca (Save As), Vizualizare protejată (Protected View), Activare editare (Enable Editing), Descărcări (Downloads), Documente (Documents), Anulare (Cancel).
- Din surse Microsoft ro-ro (cache-ul lecției 3, `lectii\vii\m1-l03\_proba\surse_web\`): Imprimare (Print) — „Pe fila Fișier, faceți clic pe Imprimare”; Ctrl+P — „Imprimați documentul”; „examinarea înaintea imprimării” (Print Preview).
- NESIGURE (folosite doar cu numele englezesc întâi sau doar în sfatul de la mouse din simulator): Center / Align Right (nume românești necalibrate, ca în lecția 6); Font Size; Theme Fonts; în lista File a simulatorului, în sfaturi: Istoric (History), Partajare (Share), Export, Cont (Account), Opțiuni (Options) — netraduse din surse; Back = „Înapoi” (ca în `wordfisier.js`). Etichetele din pagina Print (Copies, Printer, Settings, Print All Pages, Collated, Portrait Orientation, Normal Margins, 1 Page Per Sheet, Page Setup, „1 of 2”) sunt doar în engleză, ca în Word-ul din laborator.

## Ce n-am putut verifica
- Ghilimelele tastate pe un calculator cu tastatura / limba ENGLEZĂ (Word ia limba de la tastatura Windows-ului; pe calculatorul de probă e română) — A3.
- Clicul pe săgeata ← și alegerea unui font din listă în Word-ul real (clicurile de mouse nu merg pe desktopul ascuns) — A13, A16; tastele echivalente (Esc) și valoarea casetei Font sunt probate.
- Pagina Print și numele din ea într-un Word în română (capturi_lipsa.json C1).
- Butonul Print: n-am tipărit nimic (A18).

## Porțile
- `test_joc.py --dir …\lectii\vii m2-l08` -> TRECUT (doar avertismentul „1 niveluri (obișnuit 5-8)”, așteptat).
- `verifica_lectie.py … --fara-t1` -> ultima linie 0 (S0 TRECUT, S1 0 identice, S2 6/6 aplicare+execuție, T0 0). Raport: `_campaign\revizuire_completa_2026_09\verificare_lectii\vii-m2-l08\`.
- `_proba/proba_ui_l08.py` (Playwright, rețeaua blocată în afară de file://; 390 px cu atingere + 1280 px cu mouse și taste; pașii 1, 3, 5, atelierul întreg pe ambele, laboratorul, pragul de pagini) -> 0 probleme, 0 erori în consolă. După judecător, tot 0: plus ¶ de sub fereastră, exercițiul cu data, vânătoarea cu degetul, Ctrl+P cu focusul pe pagină; `_proba/proba_q3_tinte.py` -> 0.

## Pentru proprietari (semnalat, NEREPARAT în fișierele lor)
- **`lectii\_sim\wordobj-formatare.js` (lecția 6):** literele tastate stau în așteptare (`pend`) până la următoarea comandă; la un clic, `commit()` le trimite în document, dar `posAt()` citește pozițiile de pe desenul VECHI (fără redesenare între ele). În același paragraf, după literele tastate, cursorul ajunge cu atâtea litere mai la stânga: în proba mea, „la··Târgul” + clic între spații + ⌫ a șters „a”. Reparația propusă: în `docEl` pointerdown, `commit(); drawDoc();` înainte de `posAt`. Extensia mea ocolește defectul (trimite tastarea cu un Ctrl+Y sintetic înainte de clic, care în editor doar trimite tastarea), fără să schimbe fișierul lecției 6.
- **Tot `wordobj-formatare.js`:** cu ¶ pornit, spațiul tocmai tastat (încă „în așteptare”) se desenează fără punct ·, deși Word îl arată imediat ca ·. Extensia mea pune punctul peste literele în așteptare (doar la desen; textul nu se schimbă).
- **`jocuri\word-vii` (nivelul 6):** predă aceleași reguli de spațiu; nu am găsit contradicții cu lecția.
