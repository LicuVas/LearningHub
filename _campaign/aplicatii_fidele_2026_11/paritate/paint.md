# Paint — inventar de paritate (21.11.2026)

- Funcții în lecții și grafica-v: **77**. Biblioteca: DA **0**, PARȚIAL **0**, NU **77**. Motivul: biblioteca nu are încă Paint (nu există `aplicatii/paint.js`; `aplicatii/aplicatii.js:77-83` nu are Paint în SURSE_APP; nu există `aplicatii/date/paint.json`, nici profil paint11; `aplicatii/windows.js:470` face din Paint doar o fereastră generică).
- Cerute de exerciții (cu loc în pagini): **55**; doar în simulator, neverificate de niciun test: **22**.
- Surse: lectii/_sim/paint.js, paint-selectie.js, paint-imagine.js, paint-culori.js, paint-text.js, paint-proba.js (mecanism de punctare), jocuri/grafica-v/index.html (Paint cu pixeli + casetă de text). Căile și rândurile, în `paint.json`.

## Ce trebuie să aibă Paint-ul bibliotecii (toate NU), întâi cele cerute de exerciții

- **paint-F001** [Pornire și fereastră] Pornește Paint din Start: deschide meniul Start, scrie «pai» și alege Paint (clic sau Enter) — _tip pornit din lectii/v/m3-l18/index.html:127 (verifică că Paint a pornit din Start și meniul Fișier a fost de_
- **paint-F002** [Pornire și fereastră] Închide Paint (butonul X sau Fișier › Ieși); fără modificări se închide fără întrebare — _inchis din lectii/v/m3-l18/index.html:229 și :259 (Paint închis cel puțin o dată și închis acum)_
- **paint-F003** [Pornire și fereastră] Fereastra «Salvați lucrul?» (Salvați / Nu salvați / Anulare) când închizi, faci Nou sau Deschidere cu modificări nesalvate — _intrebat + faraPierderi din lectii/v/m3-l18/index.html:212 și :229 (Paint închis fără să se piardă desenul)_
- **paint-F004** [Pornire și fereastră] Vezi titlul ferestrei: «Fără titlu - Paint» sau numele fișierului deschis/salvat — _titlu din lectii/v/m3-l18/index.html:149 și :166_
- **paint-F005** [Pornire și fereastră] Află numele unei părți a ferestrei (bara de titlu, meniul de sus, bara cu instrumente, grupul Culori, pânza, bara de stare) printr-un clic, fără să schimbi nimic (mod explorare) — _zona din lectii/v/m3-l18/index.html:132_
- **paint-F007** [Bara de stare] Vezi mărimea pânzei (lățime × înălțime, în pixeli) în bara de stare — _raspuns din lectii/v/m3-l18/index.html:135 (scrie mărimea citită din bara de stare); marime din lectii/v/m3-l2_
- **paint-F009** [Desen] Creion: trage o linie pe pânză cu mouse-ul, degetul sau creionul tactil (urma ține de Dimensiune și de Culoare 1) — _desen (linie) din lectii/v/m3-l18/index.html:149; creion folosit și în lectii/v/m3-l19/index.html:157,165,185 _
- **paint-F011** [Desen] Alege tipul de pensulă din butonul Pensule ⌄ (Pensulă, Pensulă caligrafică, Stilou caligrafie, Aerograf, Pensulă de ulei, Marker, Creion natural, Pensulă în acuarelă) — _pensula{tip:Marker, dimMin 20} din lectii/v/m3-l19/index.html:136_
- **paint-F012** [Desen] Pensule: desenează o linie cu pensula aleasă (grosimea o dă Dimensiune) — _pensula din lectii/v/m3-l19/index.html:136; linieCul din lectii/v/m3-l21/index.html:141_
- **paint-F013** [Desen] Radieră: șterge ce trasezi (lasă fundalul alb) — _radiera din lectii/v/m3-l19/index.html:136 (radieră peste linia de pensulă)_
- **paint-F014** [Desen] Dimensiune: schimbă grosimea (1–50 px) pentru Creion, Pensule, Radieră cu cursorul din stânga pânzei — _pensula{dimMin:20} din lectii/v/m3-l19/index.html:136_
- **paint-F015** [Desen] Anulează ultima acțiune (butonul ↶ sau Ctrl+Z); nu coboară sub starea de la deschidere — _ev{tip:'anulat'} din lectii/v/m3-l19/index.html:165 (desenează un Oval, apoi îl anulează); Ctrl+Z cerut ca ieș_
- **paint-F017** [Fișiere] Fișier › Nou (Ctrl+N): pornește o imagine goală «Fără titlu» — _nou din lectii/v/m3-l18/index.html:149_
- **paint-F018** [Fișiere] Fișier › Deschidere (Ctrl+O): deschide o imagine din folder prin fereastra Deschidere (listă, nume scris, dublu-clic) — _deschis din lectii/v/m3-l18/index.html:190,212,259; continuat din lectii/v/m3-l18/index.html:229_
- **paint-F019** [Fișiere] Salvați (Ctrl+S sau butonul 💾): imaginea fără nume deschide Salvare ca; cea cu nume se salvează direct — _salvat din lectii/v/m3-l18/index.html:166,174,190; nemodificat din lectii/v/m3-l18/index.html:190_
- **paint-F020** [Fișiere] Salvați ca: alege tipul de imagine (PNG, JPG, BMP, GIF) din meniu sau din lista «Salvare cu tipul» — _salvat ext JPG din lectii/v/m3-l18/index.html:242; ppFisier JPG din lectii/v/m4-l23/index.html:235,305; PNG di_
- **paint-F021** [Fișiere] În fereastra Salvare ca / Deschidere: schimbi folderul (panoul din stânga, dublu-clic pe folder, ↑ un folder mai sus) și scrii numele fișierului — _salvat{folder:'elev', nume} din lectii/v/m3-l18/index.html:166,174; fisierNume din lectii/v/m4-l22/index.html:_
- **paint-F022** [Fișiere] Când numele există deja, Confirmare Salvare ca: «Îl înlocuiți?» (Da / Nu); după Nu, numele rămâne selectat — _neatins din lectii/v/m3-l18/index.html:174 și lectii/v/m4-l23/index.html:305 (fișierul existent nu trebuie înl_
- **paint-F024** [Selecție] Selectare › Dreptunghi: trage un dreptunghi peste zona dorită — _selectie{tag} din lectii/v/m3-l19/index.html:179 (soarele selectat, fără casă); chenar de trunchiere din lecti_
- **paint-F026** [Selecție] Selectați tot (meniul Selectare sau Ctrl+A) — _selectat{tot:true} din lectii/v/m3-l19/index.html:185_
- **paint-F027** [Selecție] Mută selecția trăgând-o cu mouse-ul (lasă alb în locul vechi; Ctrl+Z desface mutarea întreagă) — _mutat{tag, zona} din lectii/v/m3-l19/index.html:219,240_
- **paint-F028** [Selecție] Copiere (Ctrl+C sau Editare › Copiere): originalul rămâne pe loc — _original/obiect din lectii/v/m3-l19/index.html:201,240,254 (copacul de la început rămâne, apar încă doi)_
- **paint-F029** [Selecție] Decupare (Ctrl+X sau Editare › Decupare): zona dispare și intră în memorie — _sters/mutat din lectii/v/m3-l19/index.html:219 (Decupare + Lipire acceptate ca mutare)_
- **paint-F030** [Selecție] Lipire (Ctrl+V sau Editare › Lipire): copia apare sus-stânga, selectată, și o tragi unde vrei — _obiect{min} din lectii/v/m3-l19/index.html:201,240,254_
- **paint-F031** [Selecție] Șterge selecția (Delete sau Selectare ⌄ › Ștergere): rămâne alb — _sters{tag} din lectii/v/m3-l19/index.html:219,240,264 (șterge norul, lasă steaua și floarea)_
- **paint-F034** [Forme] Forme: desenează o formă aleasă din galerie (Linie, Oval, Dreptunghi, Dreptunghi rotunjit, Triunghi, Triunghi dreptunghic, Romb, Pentagon, Hexagon, 4 săgeți, stele cu 4/5/6 colțuri, Inimă, Fulger) trăgând în diagonală — _forma{fel, min, in} / peste{sus,jos} din lectii/v/m3-l19/index.html:157 (Dreptunghi + Triunghi), :165 (Oval), _
- **paint-F035** [Forme] Forme: Shift ține forma pătrată/rotundă și linia la 0°/45°/90° — _grafica-v: «Țin apăsat Shift» pentru pătrat, jocuri/grafica-v/index.html:570 și :622_
- **paint-F036** [Forme] Desenează o formă cu contur (Culoare 1) și, la Umplere solidă, cu interior (Culoare 2) — _formaCul{fel:'oval', contur, umplere} din lectii/v/m3-l21/index.html:205 (soare cu contur și umplere)_
- **paint-F037** [Forme] Contur formă: Fără contur / Contur compact — _formaCul{contur} din lectii/v/m3-l21/index.html:205_
- **paint-F038** [Forme] Umplere formă: Fără umplere / Umplere solidă (cu Culoare 2) — _formaCul{umplere} din lectii/v/m3-l21/index.html:205; grafica-v jocuri/grafica-v/index.html:900_
- **paint-F040** [Culori] Alege Culoare 1 din paleta de 20 de culori (cercul Culoare 1 e ales de la început) — _culoare{nr:1, fam} din lectii/v/m3-l21/index.html:141; fam:'rosu' din lectii/v/m4-l22/index.html:177 (literele_
- **paint-F041** [Culori] Alege Culoare 2 (clic pe cercul Culoare 2, apoi o culoare din paletă) fără să schimbi Culoare 1 — _culoare{nr:2} din lectii/v/m3-l21/index.html:149; grafica-v jocuri/grafica-v/index.html:258_
- **paint-F043** [Culori] Editare culori: faci o culoare nouă (pătratul de nuanță, bara de luminozitate, codul #, Roșu/Verde/Albastru), OK o pune în cercul ales și în rândul culorilor tale — _personal{fam, inchis, folosit} din lectii/v/m3-l21/index.html:225 (verde închis care nu e în paletă)_
- **paint-F045** [Culori] Umplere (găleată): umple cu Culoare 1 zona de aceeași culoare pe care dai clic (se oprește la contur; avertizează dacă iese printr-o gaură) — _pixel{la, fam} din lectii/v/m3-l21/index.html:167,243,253 (acoperiș roșu, cer galben deschis, casă în culori r_
- **paint-F046** [Culori] Selector de culoare (pipeta): ia culoarea de pe pânză și o pune în Culoare 1 — _pixel{ca} din lectii/v/m3-l21/index.html:185 (peretele exact culoarea cerului); grafica-v jocuri/grafica-v/ind_
- **paint-F048** [Imagine] Imagine › Decupare: taie marginile, rămâne doar selecția (activ doar cu selecție) — _taiere{scoate:'deget', pastreaza} din lectii/v/m3-l20/index.html:178; pozitie/marime din lectii/v/m3-l20/index_
- **paint-F049** [Imagine] Imagine › Rotiți › Rotire la dreapta 90° — _transformat{op:'rotd'} / pozitie + marime din lectii/v/m3-l20/index.html:152,250,261; grafica-v jocuri/grafica_
- **paint-F050** [Imagine] Imagine › Rotiți › Rotire la stânga 90° — _pozitie/marime din lectii/v/m3-l20/index.html:152,261_
- **paint-F051** [Imagine] Imagine › Rotiți › Rotire cu 180° — _pozitie/marime din lectii/v/m3-l20/index.html:250 (poza cu susul în jos)_
- **paint-F052** [Imagine] Imagine › Răsturnare › orizontală (stânga ↔ dreapta) — _pozitie{copacul în dreapta} din lectii/v/m3-l20/index.html:159_
- **paint-F053** [Imagine] Imagine › Răsturnare › verticală (sus ↔ jos) — _pozitie din lectii/v/m3-l20/index.html:250_
- **paint-F054** [Imagine] Redimensionați și înclinați: schimbi mărimea imaginii în Procent — _redim/marime din lectii/v/m3-l20/index.html:199,235,250 (50 %, 25 %); grafica-v redimensionare procent jocuri/_
- **paint-F055** [Imagine] Redimensionați: alegi Pixeli în loc de Procent și scrii lățimea/înălțimea în pixeli — _marime{w:300} din lectii/v/m3-l20/index.html:235 (poza lată de 300 px); h 216 din :266_
- **paint-F056** [Imagine] Redimensionați: butonul-lanț (Mențineți raportul de aspect) leagă Orizontal de Vertical — _redim{pastrat:true} din lectii/v/m3-l20/index.html:235_
- **paint-F057** [Zoom] Zoom: Mărire și Micșorare din bara de stare (pași pe lista 12,5 … 800 %) — _zoom{min:400} / zoom{acum:100} din lectii/v/m3-l20/index.html:217; grafica-v: butoanele −/+ cu pași 50-400 %, _
- **paint-F058** [Zoom] Zoom: Potrivire la fereastră — _zoom{acum} din lectii/v/m3-l20/index.html:217 (întoarcere la 100 %)_
- **paint-F062** [Zoom] La zoom mare (≥ 300 %) se văd pixelii pătrați ai imaginii — _zoom{min:400} din lectii/v/m3-l20/index.html:217 (Mărește până vezi pixelii)_
- **paint-F064** [Text] Text: alege instrumentul Text (litera A) și un clic pe pânză (sau o tragere, care dă mărimea casetei) deschide caseta în care scrii — _text{are, sauCaseta} din lectii/v/m4-l22/index.html:156,177,241 și lectii/v/m4-l23/index.html:217,289_
- **paint-F065** [Text] Scrii textul în casetă (se rupe pe rânduri după lățimea casetei; caseta crește în jos) — _text{are:'concurs de desen'} din lectii/v/m4-l22/index.html:156_
- **paint-F066** [Text] Dimensiune font: alegi mărimea literelor din listă (8…72) — _text{marime:48} din lectii/v/m4-l22/index.html:177,241; ppText titlu ≥ 48 din lectii/v/m4-l23/index.html:289; _
- **paint-F068** [Text] Aldin (B) — _text{b:true} din lectii/v/m4-l22/index.html:177,241; ppText b din lectii/v/m4-l23/index.html:289_
- **paint-F073** [Text] Umplere fundal: dreptunghiul casetei se umple cu Culoare 2, ca textul să se vadă pe desen colorat — _text{fundal:true} din lectii/v/m4-l22/index.html:289; ppFundal din lectii/v/m4-l23/index.html:354; grafica-v: _
- **paint-F074** [Text] Culoarea literelor = Culoare 1 (și se poate schimba cât caseta e deschisă) — _text{fam:'rosu', contrast:3} din lectii/v/m4-l22/index.html:177,199,241; ppText contrast din lectii/v/m4-l23/i_
- **paint-F075** [Text] Lipește textul pe pânză (clic în afara casetei); apoi nu se mai poate edita, doar anula — _casetaInchisa din lectii/v/m4-l22/index.html:156,177,241 și lectii/v/m4-l23/index.html:217,289; grafica-v: «Cl_
- **paint-F076** [Text] Anulare (Ctrl+Z / ↶) cu caseta de text deschisă: lipește textul și îl scoate — _textNu{are} din lectii/v/m4-l22/index.html:199 (repară titlul greșit: Ctrl+Z, apoi scrie din nou)_

### Neverificate de niciun test (doar în simulator sau în lecție)

- **paint-F006** [Bara de stare] Vezi poziția cursorului pe pânză în bara de stare (Nicio verificare nu cere poziția)
- **paint-F008** [Bara de stare] Vezi mărimea selecției în bara de stare
- **paint-F010** [Desen] Un clic pe pânză, fără tragere, lasă un punct (Presupus în cod (comentariu «afirmat de judecător, neprobat»), nicio verificare)
- **paint-F016** [Desen] Refă ce ai anulat (butonul ↷ sau Ctrl+Y) (Nicio verificare nu cere Refacerea)
- **paint-F023** [Fișiere] Ctrl+S / Ctrl+O merg cât e Paint pe ecran chiar dacă focusul e în altă parte a paginii (nu salvează pagina web) (Comportament al simulatorului din pagină, nu al lui Paint)
- **paint-F025** [Selecție] Selectare › Formă liberă: înconjori zona cu o buclă (Niciun exercițiu nu cere Formă liberă)
- **paint-F032** [Selecție] Renunță la selecție (Esc sau clic în afara ei)
- **paint-F033** [Selecție] Meniul Editare cu Decupare, Copiere, Lipire și scurtăturile lor
- **paint-F039** [Forme] Forma abia desenată rămâne activă: Culoare 1/2 sau stilul alese imediat după o recolorează (Presupus în antet, fără verificare directă)
- **paint-F042** [Culori] Shift + clic pe o culoare din paletă o pune în Culoare 2 (Presupus (blogul Microsoft), nicio verificare)
- **paint-F044** [Culori] Culori de bază și Culori particularizate (butonul +) în fereastra Editare culori (12 locuri particularizate)
- **paint-F047** [Culori] Clic dreapta pe pânză: Umplere/Selector/Creion/Pensule/forme lucrează cu Culoare 2 (Presupus (Paint clasic), nicio verificare; meniul browserului e blocat pe pânză)
- **paint-F059** [Zoom] Zoom: alegi un procent din lista procentului sau îl scrii în caseta Zoom
- **paint-F060** [Zoom] Zoom: bara cu buton (cursor) din bara de stare
- **paint-F061** [Zoom] Zoom: Ctrl + rotița mouse-ului pe pânză (Presupus în antet, nicio verificare)
- **paint-F063** [Imagine] Mărirea unei imagini (Redimensionați peste 100 %) o face mai neclară (Efect vizual, nicio verificare)
- **paint-F067** [Text] Familie de fonturi: alegi fontul (Calibri, Arial, Comic Sans MS, Georgia, Times New Roman, Verdana) (Învățat în lecție (pas «bara casetei»), dar niciun test nu verifică fontul; în grafica-v e)
- **paint-F069** [Text] Cursiv (I) (Învățat în lecție, neverificat de test; în grafica-v există butonul, jocuri/grafica-v/inde)
- **paint-F070** [Text] Subliniere (U) (Învățat în lecție, neverificat de test)
- **paint-F071** [Text] Tăiere cu o linie (S) (Doar în simulatorul nou; nu e în grafica-v)
- **paint-F072** [Text] Aliniere text: la stânga / la centru / la dreapta (Neverificat de test)
- **paint-F077** [Fișiere] Pe telefon, butonul «Păstrează desenul (imagine)» descarcă pânza ca PNG (local) (Nu e funcție Paint, ci a paginii; contează pentru elevii fără Paint pe telefon)

## Doar afișate (nu sunt funcții)

- Meniul Fișier (doar mesaj): Importați pe pânză, Recente, Imprimați, Partajați, Stabilire ca fundal pentru desktop, Proprietăți imagine (Ctrl+E), Salvați ca proiect (Ctrl+Shift+S), Alt format (lectii/_sim/paint.js:556)
- Meniul de sus și ferestra (doar mesaj): Vizualizați (rigle, zoom), Minimizare, Maximizare (lectii/_sim/paint.js:558)
- Grupuri fără funcție: Copilot, Niveluri (lectii/_sim/paint.js:229)
- Selecție (doar mesaj): Inversare selecție, Selecție transparentă (lectii/_sim/paint-selectie.js:443)
- Forme care nu se desenează: Curbă, Poligon, Explicație dreptunghi rotunjit / oval / nor (lectii/_sim/paint-selectie.js:445)
- Stiluri neimplementate: Alte stiluri de contur și umplere (ca pensulele), Opacitate, butonul de grosime a formelor (lectii/_sim/paint-culori.js:406)
- Imagine (doar mesaj): Rotire personalizată, Oblic (înclinare), Eliminați fundalul, Lupa (lectii/_sim/paint-imagine.js:717)

## Nesigur și ce n-am apucat

- Paint-ul real (Magazin) nu a fost pornit de lecții: «Presupus» din antetele fișierelor rămâne neprobat (trecut în notele funcțiilor care sunt doar presupuse).
- TipPixeli (paint.js:683-699, caseta «lățime x înălțime» sub un desen mărit) e exportat, dar cele 6 lecții și grafica-v nu îl înscriu în `tipuri:{…}` (verificat prin grep): nu l-am numărat ca funcție.
- paint-proba.js e mecanism de punctare/evaluare (tipuri probapaint, probaimg, probaalege, afisproba; teste ppText, ppFisier, ppSub, ppSingur, ppColorat, ppFundal), nu funcții Paint pentru elev; l-am folosit doar ca să leg exercițiile din lecția 23 de funcții.
- Cele 77 de exerciții din pagini_pe_aplicatie.json: maparea funcție-exercițiu e făcută după testele `k:` din fiecare pagină; exercițiile fără simulator (alege, potrivește, ghicește) nu sunt mapate. Numerele de linie ale exercițiilor sunt din fișierele index.html (rânduri lungi).
- grafica-v e un Paint în miniatură cu pixeli pătrați (clic pe pixel, nu tragere) plus o casetă de text separată: funcțiile lui sunt variante ale celor din simulatorul nou și le-am trecut în `unde` și `vechi_dovada`; ce are doar el: selecție prin două clicuri pe colțuri, comanda «Mută selecția» cu un clic de plasare, Shift ca buton comutator, zoom pe pași 50-400 %.
- Nu am jucat nimic în poligon: biblioteca nu are încă Paint, deci nu există ce să joc (cerut de contract).

GATA_PARITATE paint total=77 da=0 partial=0 nu=77
