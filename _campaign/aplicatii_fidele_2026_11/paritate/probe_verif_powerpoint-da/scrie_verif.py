# Scrie paritate/verif_powerpoint-da.json din verdictele verificatorului (dovezile: rez1..rez5.json, joc*.out, capturile din acest dosar)
import json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
P = 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/paritate'
PR = 'probe_verif_powerpoint-da/'

V = [
 ('powerpoint-F001', True, 'DA', 'aplicatii/powerpoint.js:1416 (diapozitivNou); jucat ' + PR + 'joc1.py F001: după Title Slide → Title and Content, după Title Only → Title Only, Ctrl+M pe miniatura 2 → Title and Content pe locul 3, clic dreapta › New Slide → locul 2; noul e cel ales', 'jucat', ''),
 ('powerpoint-F002', True, 'DA', 'aplicatii/powerpoint.js:1746; jucat joc2.py F002: Home › New Slide ▾ are cele 9 aspecte (+Duplicate Selected Slides); Two Content și Section Header apar după cel ales, aleși', 'jucat', ''),
 ('powerpoint-F004', True, 'DA', 'aplicatii/powerpoint.js:1865-1868; jucat joc1.py F004: clic pe miniatura 2 → diapozitiv_activ 2, zona de lucru arată „Ce sunt vulcanii…”, bara de stare „Slide 2 of 3”', 'jucat', ''),
 ('powerpoint-F005', True, 'DA', 'aplicatii/powerpoint.js:2232; jucat joc1.py F005: ↓ ↓ ↑ → 2,3,2 (și ← → merg), bara de stare se schimbă', 'jucat', ''),
 ('powerpoint-F006', True, 'PARTIAL', 'aplicatii/powerpoint.js:1941 (mutare la ridicare), :1902-1916 (la mișcare nimic pentru miniaturi); jucat joc1.py F006 + captura ' + PR + 'F006_in_timpul_tragerii.png', 'jucat',
  'Mutarea merge (1→3: ordinea devine 2,3,1, mutatul rămâne ales), dar în timpul tragerii NU apare linia care arată locul (nici altceva: panoul nu se schimbă). Tragerea pe telefon (ții apăsat, apoi tragi) n-am probat-o.'),
 ('powerpoint-F008', True, 'DA', 'aplicatii/powerpoint.js:1422-1425; jucat joc1.py F008: Delete pe 2 → rămâne ales noul 2 („Întrebări?”), Backspace pe ultimul → ales cel dinainte, clic dreapta › Delete Slide merge', 'jucat',
  'Diferență fără pagubă: biblioteca lasă ștergerea ultimului diapozitiv rămas (ca PowerPoint), vechiul o oprea cu mesaj.'),
 ('powerpoint-F011', True, 'DA', 'aplicatii/powerpoint.js:1804 (scrie); jucat joc1.py F011: titlu, subtitlu, conținut cu Enter = rând nou, completare în textul existent', 'jucat', ''),
 ('powerpoint-F017', True, 'DA', 'aplicatii/powerpoint.js:1570 (insereazaForma); jucat joc1.py F017: Insert › Shapes ▾ (172 forme) › Rectangle, Rounded Corners, Oval, Isosceles Triangle, Arrow: Right/Left, Star: 5 Points, apoi clic pe diapozitiv → forma apare acolo, se deschide Shape Format', 'jucat', ''),
 ('powerpoint-F019', True, 'DA', 'aplicatii/powerpoint.js:1868-1885; jucat joc1.py/joc2.py F019: clic pe formă → doar ea data-lh-selectat + fila Shape Format; tabel → Table Design + Table Layout; imagine → Picture Format; clic în gol → fila dispare', 'jucat', ''),
 ('powerpoint-F020', True, 'DA', 'aplicatii/powerpoint.js:1902-1938; jucat joc1.py F020: forma trasă din mijloc se mută (și nealeasă), titlul tras din mijloc NU se mută, tras de chenar (margine_forma) se mută; caseta de text trasă de chenar se mută', 'jucat', ''),
 ('powerpoint-F027', True, 'DA', 'aplicatii/powerpoint.js:1673; jucat joc2.py BIU: caseta aleasă + B → tot textul aldin, Ctrl+B îl scoate, Ctrl+A+Ctrl+B în subtitlu, cuvânt ales + B doar pe cuvânt', 'jucat', ''),
 ('powerpoint-F028', True, 'DA', 'aplicatii/powerpoint.js:1673-1675; jucat joc2.py BIU: butonul Italic și Ctrl+I, pe casetă și pe cuvânt', 'jucat', ''),
 ('powerpoint-F029', True, 'DA', 'aplicatii/powerpoint.js:1673-1675; jucat joc2.py BIU: butonul Underline și Ctrl+U, pe casetă și pe cuvânt', 'jucat', ''),
 ('powerpoint-F031', True, 'DA', 'aplicatii/powerpoint.js:1676; jucat joc3.py F031: titlul 60 → 66 → 72 → 66 → 60 → 54; caseta 18 → 20 → 24 → 28 → 32 (pașii PowerPoint, ca vechiul)', 'jucat', 'Ctrl+] / Ctrl+Shift+> nu fac nimic în bibliotecă, dar gestul cerut e doar butonul.'),
 ('powerpoint-F034', True, 'PARTIAL', 'aplicatii/powerpoint.js:934 + :1681 (butonul pune mereu CULOARE_SESIUNE #FF0000); jucat joc2.py F034', 'jucat',
  'Butonul pune roșu și ▾ are Theme Colors + Standard Colors (72 de rânduri, Blue → #0070C0, Orange Accent 2 → #ED7D31), dar butonul NU ține minte culoarea aleasă din ▾: după Blue, butonul pune tot roșu (vechiul pune ultima culoare aleasă, U.ultim, ca PowerPoint).'),
 ('powerpoint-F036', True, 'DA', 'aplicatii/powerpoint.js:869-876; jucat joc2.py F036: Home › Shape Fill ▾ › No Fill și Shape Format › Shape Fill ▾ › No Fill → umplere {tip: fara}, desenul fill=none', 'jucat', ''),
 ('powerpoint-F037', True, 'DA', 'aplicatii/powerpoint.js:878-891, :1654; jucat joc2.py F037: butonul Shape Outline pune Blue Accent 1, ▾ › Red → conturul roșu, apoi butonul pune roșu (ține minte)', 'jucat', ''),
 ('powerpoint-F040', True, 'DA', 'aplicatii/powerpoint.js:1730, :1765; jucat joc2.py/joc3.py: Design › Background Styles ▾ › Format Background... și clic dreapta pe miniatură › Format Background... deschid panoul', 'jucat', ''),
 ('powerpoint-F041', True, 'DA', 'aplicatii/powerpoint.js:1736; jucat joc3.py F040_F041_F042: Solid fill › Color › Light Green → doar diapozitivul 2 #92D050; Gold Accent 4 → #FFC000', 'jucat', ''),
 ('powerpoint-F042', True, 'DA', 'aplicatii/powerpoint.js:1410; jucat joc3.py: Apply to All → toate trei #FFC000', 'jucat', ''),
 ('powerpoint-F046', True, 'PARTIAL', 'aplicatii/powerpoint.js:1528, :608 + aplicatii.css:353 (.lh-ap-p-mini-stea = cerc gri 8px), aplicatii.css:388 (.lh-ap-p-gal = dală goală); jucat joc3.py F046 + ' + PR + 'F046_stea.png, zoom_stea.png', 'jucat',
  'Tranziția se pune pe diapozitivul ales (Fade doar pe 2), dar: lângă miniatură apare un PUNCT gri, nu steluța; dalele galeriei sunt goale (fără nume/pictogramă, numele doar în tooltip) — vechiul scrie numele pe dale.'),
 ('powerpoint-F050', True, 'DA', 'aplicatii/powerpoint.js:1688-1691; jucat joc3.py F046_F050: Fade (0,70 s) pe 2 › Apply To All → Fade pe toate, durata 0.7 pe toate', 'jucat', 'Pe drum: butoanele More/Less ale duratei spun „aici nu e simulată” (altă funcție).'),
 ('powerpoint-F052', True, 'PARTIAL', 'aplicatii/powerpoint.js:1532 (filter + push la capăt); jucat joc3.py F052_F054 + joc5.py F052_inlocuire_loc + ' + PR + 'F058_panou.png', 'jucat',
  'Efectul se pune și îl înlocuiește pe cel vechi, dar: (1) înlocuirea îl MUTĂ la capătul listei și îi pierde pornirea (titlu Fade After Previous, conținut Fly In: [1,2] → după Wipe pe titlu [2,1], On Click) — vechiul păstrează locul și pornirea; (2) lângă obiect nu apare numărul animației; (3) dalele galeriei sunt goale (fără nume).'),
 ('powerpoint-F054', True, 'PARTIAL', 'aplicatii/powerpoint.js:1532; aplicatii.css:388; jucat joc3.py F052_F054', 'jucat',
  'None scoate animațiile obiectului ales (și pe amândouă când are două), dar dala None din galerie e goală, fără nume (vechiul o scrie); fără nicio animație nu spune nimic (vechiul: „Obiectul ales nu are animații”).'),
 ('powerpoint-F058', True, 'DA', 'aplicatii/powerpoint.js:1695, :1401; jucat joc3.py F058 + F058_panou.png: Animation Pane se deschide cu rândurile „1 Fade : Title 1…”, „2 Fly In…”; clic pe rând → efectul și obiectul lui aleși', 'jucat', ''),
 ('powerpoint-F062', True, 'DA', 'aplicatii/powerpoint.js:1664, :1591; jucat joc4.py: F5 de pe diapozitivul 3 → expunerea pornește de la 1; Slide Show › From Beginning → 1', 'jucat', ''),
 ('powerpoint-F063', True, 'DA', 'aplicatii/powerpoint.js:1665; jucat joc4.py: Shift+F5, From Current Slide și bara de stare › Slide Show pornesc de la 2', 'jucat', 'Butonul Slide Show din bara de stare se vede ca un punct (pictograma lipsește; numele doar în tooltip) — zoom_bara_stare.png.'),
 ('powerpoint-F064', True, 'DA', 'aplicatii/powerpoint.js:2067; jucat joc4.py: clic, →, Enter, Spațiu înainte, ← înapoi; după ultimul: ecran de final, apoi clic iese', 'jucat', ''),
 ('powerpoint-F070', True, 'DA', 'aplicatii/powerpoint.js:580, :1657; jucat joc4.py F070: bara de stare › Slide Sorter și View › Slide Sorter → vedere sortare, zona de note ascunsă', 'jucat', 'Pe drum (altă funcție): dublu clic pe o miniatură în Slide Sorter nu întoarce în Normal.'),
 ('powerpoint-F073', True, 'DA', 'aplicatii/powerpoint.js:1862; jucat joc4.py: clic în zona de note + tastare → note_diapozitive pe diapozitivul ales; nota se vede la revenire', 'jucat', ''),
 ('powerpoint-F074', True, 'DA', 'aplicatii/powerpoint.js:591, :1656; jucat joc4.py: bara de stare › Notes și View › Notes ascund / arată zona de note', 'jucat', ''),
 ('powerpoint-F075', True, 'PARTIAL', 'aplicatii/powerpoint.js:1969, :2032; jucat joc4.py F075', 'jucat',
  'Filele se deschid toate cu comenzile lor; zonele există, dar clicul pe ele nu spune ce sunt (vechiul numește zona: „Bara de stare: acum scrie Slide 1 of 3…”); clicul pe bara de stare dă „aici nu e simulată”, iar clicul în golul panoului de miniaturi nu e recunoscut ca zonă (eveniment fereastra_app).'),
 ('powerpoint-F077', True, 'PARTIAL', 'aplicatii/powerpoint.js:1588, :1661; jucat joc4.py F077', 'jucat',
  'Ctrl+Z și Undo din bara de acces rapid anulează pe rând (diapozitiv nou → aldin → textul); lipsesc butonul Ctrl+Z de sub fereastră (pentru telefon) și pictograma Undo din bara de acces rapid (pătrățel gol, span.lh-ap-gol).'),
 ('powerpoint-F080', True, 'DA', 'aplicatii/powerpoint.js:1157, :1975; jucat joc4.py F080_F082: Ctrl+N → Presentation2 cu un Title Slide gol; File › Blank Presentation → Presentation3', 'jucat', ''),
 ('powerpoint-F082', False, 'DA', 'aplicatii/powerpoint.js:1249, :1977-1982, :1237; jucat joc4.py F080_F082: Back, Home, New, Open, Info, Save (fără nume → Save As), Save As, Close merg; Esc închide', 'jucat',
  'Descrierea: în vechi Info NU se deschide (simppt-fisier.js:464 → msgNesim „nu e folosit în lecția asta”); restul e corect. Biblioteca are și Info.'),
 ('powerpoint-F099', True, 'PARTIAL', 'nu există atelierul în aplicatii/ (nicio țintă „Textul”); jucat joc4.py F099_F102: Font Color ▾ › Yellow pe titlu și pe conținut → ambele #FFFF00', 'jucat',
  'Lista „Textul” cu 5 culori (un clic colorează tot textul diapozitivului) nu există; aceeași culoare se obține doar pe drumul PowerPoint, casetă cu casetă (Font Color).'),
 ('powerpoint-F102', True, 'PARTIAL', 'nu există atelierul în aplicatii/ (nicio țintă „păstrez/scot”); jucat joc4.py F099_F102: rândul ales și șters dispare, Ctrl+Z îl aduce înapoi', 'jucat',
  'Clicul pe rând care îl taie / îl readuce nu există; rândul se scoate doar editând textul (alegi, ștergi) și revine cu Ctrl+Z.'),
]

esantion = json.load(open(P + '/esantion_powerpoint-da.json', encoding='utf-8'))
ids = [e['id'] for e in esantion]
assert [v[0] for v in V] == ids, (set(ids) ^ set(v[0] for v in V))
out = [{'id': i, 'descriere_corecta': d, 'biblioteca': b, 'dovada': dv, 'cum': c, 'nota': n} for i, d, b, dv, c, n in V]
json.dump(out, open(P + '/verif_powerpoint-da.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(out), Counter(o['biblioteca'] for o in out), Counter(o['cum'] for o in out), 'descriere false:', [o['id'] for o in out if not o['descriere_corecta']])
