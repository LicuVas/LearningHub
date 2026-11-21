# -*- coding: utf-8 -*-
"""Scrie paritate/powerpoint.json + powerpoint.md din lista de mai jos (inventarul de paritate PowerPoint, 21.11.2026).
Verdictele vin din citirea codului (vechi = proba_src, nou = aplicatii/powerpoint.js); nicio proba in poligon."""
import json, os
P = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S, SF, SI, SA, SFI = 'lectii/_sim/simppt.js', 'lectii/_sim/simppt-formatare.js', 'lectii/_sim/simppt-interfata.js', 'lectii/_sim/simppt-animatii.js', 'lectii/_sim/simppt-fisier.js'
L4, JP, JA = 'lectii/vi/m1-l04/index.html', 'jocuri/prezentari-vi/index.html', 'jocuri/prezentari-antrenament-vi/index.html'
B = 'aplicatii/powerpoint.js'
L02, L03, L04, L05, L06, L07, L08, L09, L10 = ['lectii/vi/m1-l0%d' % i for i in range(2, 8)] + ['lectii/vi/m2-l08', 'lectii/vi/m2-l09', 'lectii/vi/m2-l10']
JPd, JAd = 'jocuri/prezentari-vi', 'jocuri/prezentari-antrenament-vi'

F = []
def f(functie, grup, gest, vechi, unde, ex, bib, bdov, lipsa='', nota=''):
    F.append({'functie': functie, 'grup': grup, 'gest': gest, 'vechi_dovada': vechi, 'unde': unde,
              'ceruta_de_exercitiu': bool(ex), 'exercitii': ex, 'biblioteca': bib, 'biblioteca_dovada': bdov,
              'lipsa': lipsa, 'nota': nota})

# ---------------- Diapozitive
f('Adaugă un diapozitiv nou după cel ales (după Title Slide vine Title and Content, altfel același aspect)', 'Diapozitive',
  'Home › New Slide (partea de sus); Ctrl+M; clic dreapta pe miniatură › New Slide',
  [S + ':481', S + ':441', S + ':462', S + ':300', L4 + ':330', JP + ':349'], [L04, L05, L06, L09, L10, JPd],
  [L04 + '/index.html:673 (k:nr)', L04 + '/index.html:674 (k:nou, după diapozitivul 2)', JPd + '/index.html:725 (sarcina t:new-slide)', JPd + '/index.html:804 (t:ctx-new)'],
  'DA', B + ':1416 diapozitivNou (aceeași regulă de aspect, :1417); :1666 SlideNewGallery; :2161 ctrl_m; :1762 meniul New Slide')
f('Adaugă un diapozitiv nou cu aspectul ales din lista New Slide ▾', 'Diapozitive', 'Home › New Slide ▾ › un aspect',
  [S + ':482', S + ':484', L4 + ':331', L4 + ':333'], [L04, L05],
  [L04 + '/index.html:672-675 (k:nou + k:aspect Two Content)'], 'DA', B + ':1669 lista.SlideNewGallery; :1746 aspect → diapozitivNou(v)')
f('Schimbă aspectul (Layout) diapozitivului ales; textul din casetele care dispar rămâne pe diapozitiv', 'Diapozitive',
  'Home › Layout ▾ › aspect; clic dreapta pe miniatură sau pe fundal › Layout ›',
  [S + ':483', S + ':484', S + ':305', S + ':465', L4 + ':332', JP + ':354'], [L04, L05, L09, L10, JPd],
  [L04 + '/index.html:675 (k:aspect)', L09 + '/index.html:240 (k:aspect)', L10 + '/index.html:297 (k:aspect)', JPd + '/index.html:725 (t:lay-two)'],
  'PARTIAL', B + ':1670 lista.SlideLayoutGallery; :1745; :1429 schimbaAspect (textul rămas se păstrează, :1444)',
  'lipsesc aspectele Title and Vertical Text și Vertical Title and Text (ASPECTE are 9, :17-38); Layout › din meniul de clic dreapta (miniatură, fundal) nu face nimic (apasaMeniu :1761-1768 → I.nesimulat)')
f('Alege un diapozitiv cu clic pe miniatura lui (apare mare în zona de lucru, bara de stare arată al câtelea e)', 'Diapozitive',
  'clic pe miniatură', [S + ':485', SI + ':237', SA + ':425'], [L02, L04, L05, L06, L07, L08, L09, L10, JPd],
  [L02 + '/index.html:183 (k:cur)', L02 + '/index.html:231 (k:cur)', JPd + '/index.html:729 (t:mini-3)'],
  'DA', B + ':1865-1868 (miniatura → M.activ); :1961')
f('Trece de la o miniatură la alta cu săgețile', 'Diapozitive', 'săgeți sus/jos cu panoul de miniaturi activ', [S + ':442-443'], [L05], [],
  'DA', B + ':2232 (M.panou === miniaturi → M.activ ± 1)')
f('Mută un diapozitiv trăgându-i miniatura (o linie arată locul)', 'Diapozitive', 'tragere de miniatură (pe telefon: ții apăsat, apoi tragi)',
  [S + ':468', S + ':402'], [L05, L09, L10],
  [L05 + '/index.html:148 (k:ordine)', L05 + '/index.html:147 (k:loc)', L05 + '/index.html:165 (k:ultimul)', L05 + '/index.html:224 (k:dupa)', L09 + '/index.html:350 (k:ordine)', L10 + '/index.html:217 (k:ordine)'],
  'DA', B + ':1865-1868 (ancora mini); :1941-1949 mutare_diapozitiv', '', 'linia care arată locul: necăutată în bibliotecă')
f('Dublează diapozitivul ales; copia vine imediat după original și devine cea aleasă', 'Diapozitive',
  'Ctrl+D; Home › New Slide ▾ › Duplicate Selected Slides; Home › Copy ▾ › Duplicate; clic dreapta pe miniatură › Duplicate Slide',
  [S + ':383', S + ':440', S + ':480', S + ':478', S + ':463', JP + ':350'], [L05, JPd],
  [L05 + '/index.html:125 (k:copieDin)', L05 + '/index.html:224 (k:copieDin)', JPd + '/index.html:797 (t:ctx-dup)'],
  'PARTIAL', B + ':1421 dubleaza; :2162 ctrl_d; :1746 Duplicate Selected Slides; :1763 Duplicate Slide',
  'Copy ▾ › Duplicate din panglică nu e legat (nici Copy, apasaComanda :1639-1705 n-are caz → I.nesimulat)')
f('Șterge diapozitivul ales; rămâne ales cel care i-a luat locul', 'Diapozitive', 'Delete / Backspace cu miniatura aleasă; clic dreapta pe miniatură › Delete Slide',
  [S + ':390', S + ':396-399', S + ':464', SA + ':372', JP + ':351'], [L05, L07, JPd],
  [L05 + '/index.html:145 (k:faraTitlu)', L05 + '/index.html:124 (k:nr)', L05 + '/index.html:238 (k:faraTitlu)', JPd + '/index.html:804 (t:ctx-del)'],
  'DA', B + ':1422 stergeDiapozitiv; :1822 (Delete fără casetă aleasă, cu miniaturile active); :1764 Delete Slide',
  '', 'vechiul nu lasă prezentarea fără niciun diapozitiv; biblioteca îl lasă (ca PowerPoint)')
f('Copiază, decupează și lipește diapozitive; diapozitivul lipit vine după cel ales', 'Diapozitive',
  'Ctrl+C / Ctrl+X / Ctrl+V cu miniatura aleasă; Home › Clipboard (Cut, Copy, Paste); clic dreapta pe miniatură › Cut / Copy / Paste Options',
  [S + ':351-358', S + ':370-375', S + ':437-439', S + ':472-474', S + ':459-461'], [L05],
  [L05 + '/index.html:224 (k:copieDin + k:dupa: copie făcută prin dublare sau copiere)'],
  'PARTIAL', B + ':2185 (Ctrl+C/X pe miniaturi); :2203 (Ctrl+V → după cel activ)',
  'butoanele Cut / Copy / Paste din Home › Clipboard nu fac nimic (apasaComanda n-are caz Paste/Cut/Copy, cade în I.nesimulat :1705); Cut / Copy / Paste din meniul de clic dreapta al miniaturii nu fac nimic (apasaMeniu :1768)')
f('Ascunde un diapozitiv (Hide Slide); la expunere e sărit', 'Diapozitive', 'clic pe miniatură › meniul ei › Hide Slide',
  [JP + ':352', JP + ':302'], [JPd], [JPd + '/index.html:797 (t:ctx-hide)'],
  'NU', 'căutat „Hide Slide”, „ascuns”, „hidden” în aplicatii/powerpoint.js: rândul există doar desenat în meniu_contextual.miniatura (date/powerpoint.json); apasaMeniu :1768 → I.nesimulat')

# ---------------- Text
f('Scrie text în casetele diapozitivului (titlu, subtitlu, conținut)', 'Text', 'clic în casetă, tastezi',
  [S + ':500', S + ':295', S + ':282', L4 + ':348'], [L04, L05, L09, L10, 'lectii/vi/m1-l03'],
  [L04 + '/index.html:650 (k:text)', L04 + '/index.html:651 (k:textmin)', L05 + '/index.html:126 (k:text)', L09 + '/index.html:217 (k:text)', L10 + '/index.html:283 (k:text)', L03 + '/index.html:164 (k:fisier cu titlul schimbat)'],
  'DA', B + ':1887-1896 (cursor în text la clic); :1804 scrie; :2236-2239 tastare')
f('Scrie mai multe rânduri: Enter = rând nou; în caseta de conținut fiecare rând e o buliță', 'Text', 'Enter în timp ce scrii',
  [S + ':545', S + ':888'], [L04, L09, L10],
  [L04 + '/index.html:747 (k:linii)', L09 + '/index.html:220 (k:linii)', L09 + '/index.html:356 (k:linieIncepe)', L10 + '/index.html:298 (k:linii)', L10 + '/index.html:301 (k:linieIncepe)'],
  'PARTIAL', B + ':2217 (Enter → scrie(\\n), paragraf nou); :442-466 htmlText (un bloc pe paragraf)',
  'rândurile din caseta de conținut nu au bulițe (htmlText desenează doar paragrafe)')
f('Alege toată caseta (chenar plin), ca formatarea / ștergerea să meargă pe toată caseta', 'Text',
  'Esc în timp ce scrii; clic pe chenarul casetei; clic dreapta în text › Exit Edit Text',
  [S + ':890-892', S + ':499', S + ':458'], [L05, L06, L08], [],
  'PARTIAL', B + ':2210 (Esc → alegere_forma); :1871-1885 (margine_forma → caseta aleasă ca obiect)',
  'Exit Edit Text din meniul de clic dreapta nu face nimic (apasaMeniu :1768)', 'exercițiile m1-l06 verifică formatul pe toată caseta, nu gestul')
f('Caseta de text în care n-ai scris nimic dispare când dai clic în altă parte', 'Text', 'clic în afara casetei goale',
  [S + ':289-290'], [L04, L05], [], 'NU',
  'căutat ștergerea casetei goale la deselectare („caseta”, „text.length”, „goal”) în aplicatii/powerpoint.js: casetele se creează (:1574) și se lipesc (:2195), nu se șterg singure')

# ---------------- Obiecte
f('Pune un tabel cu numărul ales de coloane și rânduri', 'Obiecte',
  'Insert › Table ▾ › grila (coloane × rânduri); Insert › Table ▾ › Insert Table... (fereastra, 1-75); iconița Insert Table din caseta de conținut goală',
  [S + ':487', S + ':489', S + ':525', S + ':502-503', S + ':322-327', L4 + ':336', JP + ':355'], [L04, L02, JPd],
  [L04 + '/index.html:708 (k:tabel 3×2)', L04 + '/index.html:751 (k:tabel)', JPd + '/index.html:726 (t:ins-table)'],
  'PARTIAL', B + ':1678 lista.TableInsertGallery; :1750-1751 „NxM Table” → insereazaTabel :1537; :1749 + :1047-1053 fereastra Insert Table; :1075 săgețile More/Less',
  'iconițele din caseta de conținut goală lipsesc (nicio iconiță desenată, :510-539); tabelul nu intră în caseta de conținut goală (e pus centrat, :1539-1540)')
f('Pune o imagine din calculator; intră în caseta goală și se vede pe diapozitiv', 'Obiecte',
  'Insert › Pictures ▾ › This Device... › alegi fișierul (soare / pamant / luna / marte.png) › Insert; iconița Pictures din caseta goală',
  [S + ':491-492', S + ':521', S + ':328-330', S + ':502-503', L4 + ':341', L4 + ':374'], [L04, L09, L10, JPd],
  [L04 + '/index.html:714 (k:imagine luna.png)', L04 + '/index.html:749 (k:imagine)', L09 + '/index.html:242 (k:imagine)', L10 + '/index.html:299 (k:imagine)', JPd + '/index.html:729 (t:ins-pictures)'],
  'PARTIAL', B + ':1671 + :1753 This Device... → fereastra; :1987 Open → insereazaImagine :1547 (intră în caseta de conținut goală, :1555-1561)',
  'numele se scrie de mână (orice nume nevid e primit, :1549-1550), nu se alege din fișierele lecției; imaginea nu se desenează (doar un dreptunghi gol, :500); iconița Pictures din caseta goală lipsește')
f('Pune o formă (dreptunghi, oval, triunghi, săgeți, stea): alegi forma, apoi clic pe diapozitiv', 'Obiecte',
  'Insert › Shapes ▾ › forma, apoi clic pe diapozitiv', [S + ':495', S + ':498', S + ':338-339', L4 + ':344'], [L04, L06, L10],
  [L04 + '/index.html:701 (k:forma arrowR)', L04 + '/index.html:770 (k:forma star5)', L10 + '/index.html:300 (k:forma)'],
  'DA', B + ':1672 lista.ShapesInsertGallery; :1755-1759 unealta; :1844-1848 clicul pune forma; :1570 insereazaForma; :468-491 desenul', '', 'biblioteca are toată galeria Shapes; vechiul avea 7 forme')
f('Pune o casetă de text și scrie în ea', 'Obiecte', 'Insert › Text Box, apoi clic pe diapozitiv, tastezi',
  [S + ':496', S + ':336-337', L4 + ':345', JP + ':355'], [L04, L05, JPd],
  [L04 + '/index.html:700 (k:caseta „Proiect la geografie”)', L04 + '/index.html:769 (k:caseta)', JPd + '/index.html:729 (t:ins-textbox)'],
  'PARTIAL', B + ':1574 (Text Box din galeria Shapes → caseta, cursorul în ea, :1577)',
  'butonul Insert › Text Box (TextBoxInsert) nu e legat: apasaComanda :1639-1705 n-are caz → I.nesimulat; merge doar din Shapes ▾ › Text Box')
f('Alege un obiect cu clic: doar el are chenar; sus se deschide fila lui (Picture Format / Shape Format / Table Design)', 'Obiecte',
  'clic pe imagine / formă / tabel', [S + ':506', S + ':318', L4 + ':354'], [L04, L05, L06], [L04 + '/index.html:634-635 (k:ales)'],
  'DA', B + ':1871-1885 (forma aleasă ca obiect); :670 actualizeazaContext (fila contextuală)')
f('Mută un obiect trăgându-l (caseta și substituentul: de chenar)', 'Obiecte', 'tragere cu mouse-ul / degetul',
  [S + ':469', S + ':408-416'], [L05, L09, L10],
  [L05 + '/index.html:204 (k:pozitie)', L05 + '/index.html:223 (k:pozitie)', L09 + '/index.html:242 (k:pozitie)', L10 + '/index.html:299 (k:pozitie)'],
  'DA', B + ':1904-1911 misca; :1934-1938 mutare_forma (intră în Ctrl+Z)')
f('Mută obiectul ales puțin câte puțin cu săgețile', 'Obiecte', 'săgeți cu obiectul ales', [S + ':442-443'], [L05], [],
  'NU', 'aplicatii/powerpoint.js:2222-2233: săgețile mută doar cursorul în text sau alegerea miniaturii; obiectul ales nu se mișcă')
f('Șterge obiectul ales; la o casetă a aspectului: întâi textul, apoi locul gol', 'Obiecte', 'Delete / Backspace cu obiectul ales',
  [S + ':390-395', S + ':436', SA + ':376-379'], [L05, L07],
  [L05 + '/index.html:146 (k:nobj, săgeata rătăcită)', L07 + '/index.html:249 (k:nobj)'],
  'PARTIAL', B + ':1823-1826 stergere_forma (scoate și animația formei)',
  'o casetă a aspectului cu text dispare dintr-o dată (vechiul: primul Delete golește textul, al doilea scoate locul)')
f('Copiază, decupează și lipește obiecte: pe alt diapozitiv în același loc, pe același diapozitiv puțin mai jos și la dreapta', 'Obiecte',
  'Ctrl+C / Ctrl+X / Ctrl+V; Home › Clipboard; clic dreapta pe obiect › Cut / Copy / Paste Options',
  [S + ':359-369', S + ':376-381', S + ':437-439', S + ':448', S + ':472-474'], [L05],
  [L05 + '/index.html:184-185 (k:acelasiLoc)', L05 + '/index.html:186 (k:nobj)', L05 + '/index.html:225 (k:acelasiLoc)'],
  'PARTIAL', B + ':2173-2179 (Ctrl+C/X pe caseta aleasă ca obiect); :2192-2200 (Ctrl+V, același loc; substituentul devine casetă de text)',
  'pe același diapozitiv copia nu se deplasează (stă exact peste original); butoanele Clipboard din panglică și Cut/Copy/Paste din meniul de clic dreapta nu fac nimic')
f('Dublează obiectul ales (copia apare puțin mai jos și la dreapta)', 'Obiecte', 'Ctrl+D cu obiectul ales; Home › Copy ▾ › Duplicate',
  [S + ':386-388', S + ':478'], [L05], [], 'NU', 'aplicatii/powerpoint.js:2162: Ctrl+D cu o casetă aleasă → I.nesimulat(„Duplicate (Ctrl+D)”)')
f('Aduce obiectul în față / îl trimite în spate (Bring to Front / Send to Back)', 'Obiecte', 'clic pe obiectul ales › meniul lui › Bring to Front / Send to Back',
  [JP + ':353'], [JPd], [JPd + '/index.html:801 (t:ctx-back)'], 'NU',
  'căutat „Bring”, „Send to Back”, „ordine” în aplicatii/powerpoint.js: Bring Forward / Send Backward există doar desenate (panglica_context.Ctx_ShapeFormat), fără cod')
f('Pune o legătură (Link) sau un sunet (Audio) pe diapozitiv', 'Obiecte', 'Insert › Link / Audio', [JP + ':355-356'], [JPd], [],
  'NU', 'aplicatii/powerpoint.js: HyperlinkInsert / Audio n-au caz în apasaComanda :1639-1705 → I.nesimulat', '', 'în simppt.js (lecțiile 4-5) aceleași butoane doar afișează un mesaj (:497)')

# ---------------- Formatare text
f('Îngroașă textul (Bold)', 'Formatare text', 'butonul B (Home › Font); Ctrl+B', [SF + ':512', SF + ':586', JP + ':344'], [L06, L08, L09, L10, JPd],
  [L06 + '/index.html:130 (k:fmtText b)', L06 + '/index.html:236 (k:fmtText b)'], 'DA', B + ':1673; :2163; :1492-1503 formatare')
f('Scrie înclinat (Italic)', 'Formatare text', 'butonul I; Ctrl+I', [SF + ':512', SF + ':586'], [L06, L08], [L06 + '/index.html:253 (k:fmtText i)'],
  'DA', B + ':1674; :2164')
f('Subliniază textul (Underline)', 'Formatare text', 'butonul U; Ctrl+U', [SF + ':512', SF + ':586'], [L06, L08], [], 'DA', B + ':1675; :2165')
f('Pune mărimea literelor', 'Formatare text', 'Home › Font Size ▾ › o mărime din listă; sau scrii numărul în caseta Font Size și apeși Enter',
  [SF + ':515', SF + ':516', SF + ':538', JP + ':345'], [L06, L08, L09, JPd],
  [L06 + '/index.html:129 (k:fmtText pt 32)', L06 + '/index.html:136 (k:fmtText pt 54)', L06 + '/index.html:253 (pt 40)', L06 + '/index.html:235 (ptMin)', L08 + '/index.html:204 (ptMin)', L09 + '/index.html:351 (ptMin)'],
  'PARTIAL', B + ':1682-1685 (clic în caseta Font Size, scrii numărul); :1506 puneMarime',
  'lista mărimilor de sub Font Size ▾ nu se deschide (:1686 → I.nesimulat, „NEcapturată”)')
f('Mărește / micșorează literele cu un pas', 'Formatare text', 'Home › Increase Font Size / Decrease Font Size', [SF + ':513', SF + ':167-168'], [L06, L08], [],
  'DA', B + ':1676-1677; :1488-1491 pasMarime', '', 'pașii peste 96: vechiul ×1,2, biblioteca +10 ([NEVERIFICAT] în ambele)')
f('Șterge formatarea textului (Clear Formatting)', 'Formatare text', 'Home › Clear All Formatting', [SF + ':514', SF + ':183'], [L06, L08], [],
  'NU', 'căutat „ClearFormatting”, „Clear Formatting” în aplicatii/powerpoint.js: nimic; butonul cade în I.nesimulat (:1705)')
f('Schimbă fontul literelor (fonturile temei: Headings / Body, sau unul din All Fonts)', 'Formatare text', 'Home › Font ▾ › un font',
  [SF + ':517', 'lectii/_sim/simppt-estetica.js:36-45'], [L06, L08],
  [L08 + '/index.html:164 (k:fmtFont titluri)', L08 + '/index.html:165 (k:fmtFontToate)', L08 + '/index.html:279 (k:fmtFontToate)', L08 + '/index.html:293 (k:fmtFont text)'],
  'PARTIAL', B + ':1640-1650 + :818 listaFont; :854 puneFont (pune numele fontului)',
  'fontul temei nu e o legătură: „Calibri Light (Headings)” se pune ca simplu nume (:858), iar tema nu schimbă fonturile; m2-l08 cere tocmai fontul TEMEI pe titluri')
f('Colorează literele (Font Color: butonul pune culoarea, ▾ = Theme Colors + Standard Colors)', 'Formatare text', 'Home › Font Color; Font Color ▾ › culoare',
  [SF + ':518', SF + ':520', JP + ':346'], [L06, L08, L09, JPd],
  [L06 + '/index.html:199 (k:fmtText cul #FFFFFF)', L06 + '/index.html:240', L08 + '/index.html:277', L06 + '/index.html:105 (contrastMin)', L08 + '/index.html:123 (contrastMin)', L09 + '/index.html:105 (contrastMin)'],
  'DA', B + ':1680-1681; :1741-1743; :961 aplicaCuloare', '', 'butonul principal: vechiul pune roșu, biblioteca culoarea sesiunii')

# ---------------- Formatare forme
f('Umple forma cu o culoare (Shape Fill)', 'Formatare forme', 'Home › Shape Fill (butonul = ultima culoare); Shape Fill ▾ › culoare; aceleași pe Shape Format',
  [SF + ':518', SF + ':520', SF + ':187-192', JP + ':347'], [L06, JPd],
  [L06 + '/index.html:172 (k:fmtUmplere stea)', L06 + '/index.html:174', L06 + '/index.html:181', L06 + '/index.html:238', JPd + '/index.html:876 (t:sf-rosu)'],
  'PARTIAL', B + ':1651-1652; :1727; :869 aplicaUmplere',
  'umplerea se desenează doar la formele din Shapes (continutForma :502); pe o casetă de text sau pe o casetă a aspectului nu se vede', 'exercițiile cer umplere doar pe forme (stea, săgeată, dreptunghi, oval)')
f('Scoate umplerea formei (No Fill)', 'Formatare forme', 'Shape Fill ▾ › No Fill', [SF + ':524', JP + ':347'], [L06, JPd], [], 'DA', B + ':872-874 (No Fill → {tip: fara})')
f('Colorează conturul formei (Shape Outline)', 'Formatare forme', 'Home › Shape Outline; Shape Outline ▾ › culoare', [SF + ':518', SF + ':520', JP + ':348'], [L06, JPd],
  [L06 + '/index.html:173 (k:fmtContur)', L06 + '/index.html:182', L06 + '/index.html:238'], 'DA', B + ':1653-1654; :1728; :878 aplicaContur')
f('Scoate conturul formei (No Outline)', 'Formatare forme', 'Shape Outline ▾ › No Outline', [SF + ':525', JP + ':348'], [L06, JPd],
  [L06 + '/index.html:258 (k:fmtContur pe oval, „fără contur”)'], 'DA', B + ':887-889 (No Outline → fara: true)')
f('Pune grosimea conturului (Weight)', 'Formatare forme', 'Shape Outline ▾ › Weight › ¼ … 6 pt', [SF + ':526'], [L06], [], 'DA', B + ':1718; :881-885')

# ---------------- Fundal și teme
f('Deschide panoul Format Background', 'Fundal și teme', 'Design › Background Styles ▾ › Format Background...; clic dreapta pe miniatură › Format Background...',
  [SF + ':528', SF + ':569', JP + ':358'], [L06, L08, JPd], [JPd + '/index.html:879 (t:format-bg)'],
  'DA', B + ':1655 + :1729-1730; :1765 (clic dreapta); :1260 panouLateral')
f('Pune o culoare de fundal pe diapozitivul ales (Solid fill + Color)', 'Fundal și teme', 'panoul Format Background › Solid fill › Color ▾ › culoare',
  [SF + ':532', SF + ':520', SF + ':196', JP + ':359-360'], [L06, L08, JPd],
  [L06 + '/index.html:197 (k:fmtFundal)', L06 + '/index.html:198 (k:fmtFaraFundal)', L06 + '/index.html:239', L08 + '/index.html:279', JPd + '/index.html:879 (t:solid-fill, t:bgc-bleumarin)'],
  'DA', B + ':1408 Solid fill; :1409 Color; :1734-1739 culoarea pe diapozitivul activ')
f('Pune fundalul ales pe toate diapozitivele (Apply to All)', 'Fundal și teme', 'panoul Format Background › Apply to All', [SF + ':530', SF + ':198'], [L06],
  [L06 + '/index.html:205 (k:fmtFundalToate)', L06 + '/index.html:263 (k:fmtFundalToate)'], 'DA', B + ':1410 fundal_toate')
f('Readu fundalul temei (Reset Background / Reset Slide Background)', 'Fundal și teme', 'panoul Format Background › Reset Background', [SF + ':531', SF + ':201'], [L06], [],
  'NU', 'aplicatii/powerpoint.js:1398-1413 clicPanou tratează doar Solid fill, Color, Apply to All; Reset Background cade în I.nesimulat')
f('Ascunde grafica de fundal a temei (Hide background graphics)', 'Fundal și teme', 'panoul Format Background › Hide background graphics', [SF + ':535'], [L06], [],
  'NU', 'căutat „Hide background” în aplicatii/powerpoint.js: nimic')
f('Pune o temă pe toată prezentarea (fundal, fonturi, culori, locul și mărimea titlurilor; ce ai pus de mână rămâne)', 'Fundal și teme', 'Design › Themes › o temă (sau ▾ More)',
  [SF + ':527', SF + ':203-211', JP + ':357'], [L06, L08, JPd],
  [L06 + '/index.html:218 (k:fmtTema Ion)', L06 + '/index.html:220', L06 + '/index.html:234 (k:fmtTema Retrospect)'],
  'PARTIAL', B + ':1624-1625 + :1525 (M.tema = numele); aplicatii.css:380-383 (aspect doar pentru Ion și Dark Gradient)',
  'tema schimbă doar numele și, la 2 teme, culoarea fundalului; fonturile, culorile textului, locul și mărimile casetelor rămân; Retrospect (cerută la m1-l06:234) nu e în galeria bibliotecii (19 rânduri, fără Retrospect)')

# ---------------- Tranziții
f('Pune o tranziție pe diapozitivul ales (lângă miniatură apare steluța)', 'Tranziții', 'Transitions › galeria › efect', [SA + ':443', SA + ':299', JP + ':362'], [L07, L10, JPd],
  [L07 + '/index.html:143 (k:tr)', L07 + '/index.html:299 (k:tr)', JPd + '/index.html:934 (t:tr-fade)'], 'DA', B + ':1624-1625 + :1528; :609 steluța')
f('Pune aceeași tranziție pe mai multe miniaturi alese deodată', 'Tranziții', 'Ctrl+clic / Shift+clic pe miniaturi, apoi galeria', [SA + ':426-427', SA + ':298'], [L07], [],
  'NU', 'aplicatii/powerpoint.js:1865-1866: clicul pe miniatură alege una singură (nu citește Ctrl / Shift); tranziția se pune pe D() (:1528)')
f('Scoate tranziția (None)', 'Tranziții', 'Transitions › None', [SA + ':301', JP + ':362'], [L07, JPd],
  [L07 + '/index.html:144 (k:faraTr)', JPd + '/index.html:941 (t:tr-none)'], 'DA', B + ':1528 (None → tranzitie null)')
f('Schimbă durata tranziției (Duration, în secunde)', 'Tranziții', 'scrii în caseta Duration + Enter; săgețile casetei (±0,25)', [SA + ':445', SA + ':446', SA + ':314'], [L07, L10],
  [L07 + '/index.html:164 (k:trDur)', L07 + '/index.html:267 (k:trDurMax)', L10 + '/index.html:315 (k:trDur)'],
  'PARTIAL', B + ':1697-1700 (clic în caseta Duration); :2098 durata_tranzitie la Enter (0,01-59,99)',
  'săgețile casetei Duration nu au cod (spinDialog :1075 lucrează doar în fereastra Insert Table) — NESIGUR, neprobat în poligon')
f('Pune tranziția și durata diapozitivului ales pe toate (Apply To All)', 'Tranziții', 'Transitions › Apply To All', [SA + ':444', SA + ':308'], [L07, L10],
  [L07 + '/index.html:163 (k:trToate)', L07 + '/index.html:287', L10 + '/index.html:314 (k:trToate)'], 'DA', B + ':1688-1693 tranzitie_toate')
f('Avansare automată după un timp (After) / la clic (On Mouse Click)', 'Tranziții', 'Transitions › bifele On Mouse Click / After: 00:05', [JP + ':363', SA + ':450'], [JPd],
  [JPd + '/index.html:1000 (t:after-on)'], 'NU', 'căutat „After”, „avans”, „Advance” în aplicatii/powerpoint.js: nimic; bifele cad în I.nesimulat',
  '', 'în simppt-animatii.js (lecția 7) avansarea doar afișează un mesaj')

# ---------------- Animații
f('Pune o animație pe obiectul ales (din galerie; înlocuiește efectul pe care îl avea)', 'Animații', 'clic pe obiect, Animations › galeria › efect', [SA + ':453', SA + ':327-348', JP + ':364'], [L07, L10, JPd],
  [L07 + '/index.html:184 (k:an)', L07 + '/index.html:225 (k:an)', L10 + '/index.html:238 (k:an)', L10 + '/index.html:316'], 'DA', B + ':1529-1533 (fără obiect ales: fara_efect)')
f('Adaugă încă un efect la același obiect (Add Animation)', 'Animații', 'Animations › Add Animation ▾ › efect (Entrance / Emphasis / Exit / Motion Paths)', [SA + ':454', SA + ':342-345', JP + ':364'], [L07, JPd],
  [L07 + '/index.html:205 (k:nrAn)', L07 + '/index.html:248 (k:nrAn)', JPd + '/index.html:933 (t:add-anim, t:an-flyin)', JPd + '/index.html:938 (t:an-pulse)'],
  'NU', 'căutat „AnimationAdd”, „Add Animation” în aplicatii/powerpoint.js: doar un comentariu (:1531); biblioteca ține un singur efect pe casetă')
f('Scoate animațiile obiectului (None)', 'Animații', 'obiectul ales › Animations › None', [SA + ':330-331'], [L07, L10],
  [L07 + '/index.html:268 (k:faraAn)', L10 + '/index.html:239 (k:faraAn)', L07 + '/index.html:185 (k:vizibil)'], 'DA', B + ':1532 (None scoate efectele casetei)')
f('Alege cum pornește efectul: On Click / With Previous / After Previous', 'Animații', 'Animations › Start ▾; sau ▾ pe rândul din Animation Pane', [SA + ':458', SA + ':350', SA + ':440'], [L07],
  [L07 + '/index.html:184 (k:laClic)', L07 + '/index.html:205 (k:clicuri)', L07 + '/index.html:269 (k:laClic)'],
  'PARTIAL', B + ':1630-1638 (Start ▾); :1721-1726 pornire_animatii', 'meniul ▾ de pe rândul din Animation Pane lipsește (merge doar caseta Start de pe panglică)')
f('Schimbă durata și întârzierea animației (Duration, Delay)', 'Animații', 'Animations › Duration / Delay (scris sau săgeți)', [SA + ':459-462', SA + ':357'], [L07], [],
  'NU', 'căutat „AnimationDuration”, „Delay” în aplicatii/powerpoint.js: nimic')
f('Schimbă ordinea animațiilor', 'Animații', 'Animations › Move Earlier / Move Later; săgețile din Animation Pane', [SA + ':463-464', SA + ':364'], [L07],
  [L07 + '/index.html:204 (k:ordine)', L07 + '/index.html:224', L07 + '/index.html:293'],
  'PARTIAL', B + ':1403-1404 Move Up / Move Down în Animation Pane; :1369 mutaAnimatie', 'Move Earlier / Move Later de pe panglică nu au cod (cad în I.nesimulat)')
f('Deschide Animation Pane și alege un efect din listă', 'Animații', 'Animations › Animation Pane; clic pe rândul efectului', [SA + ':457', SA + ':435'], [L07], [],
  'DA', B + ':1695 panou.AnimationCustom; :1402 rândul ales → caseta lui aleasă')
f('Scoate un singur efect, obiectul rămâne pe diapozitiv', 'Animații', 'Delete pe rândul din Animation Pane; ▾ › Remove; Delete pe numărul de lângă obiect', [SA + ':374-375', SA + ':439'], [L07],
  [L07 + '/index.html:248-249 (k:nrAn + k:nobj: efectul scos, obiectul rămas)'],
  'NU', 'aplicatii/powerpoint.js:1402 rândul ales din panou alege CASETA (edit false), iar Delete (:1823-1825) șterge caseta cu tot cu animație; Remove nu există')
f('Vezi numerele efectelor lângă obiecte (fila Animations / panoul); clic pe număr alege efectul', 'Animații', 'fila Animations deschisă; clic pe numărul de lângă obiect', [SA + ':485', SA + ':277'], [L07], [],
  'NU', 'aplicatii/powerpoint.js:510-539 deseneazaDiapozitiv nu desenează numere de animație; căutat „anim” + „nr”/„numar”: nimic')
f('Previzualizează efectul (Preview)', 'Animații', 'Transitions / Animations › Preview', [SA + ':465'], [L07], [],
  'PARTIAL', B + ':1694 (TransitionPreview / AnimationPreview → „previzualizare”)', 'nu redă nimic pe diapozitiv')

# ---------------- Expunere și vizualizări
f('Pornește expunerea de la primul diapozitiv', 'Expunere', 'F5; Slide Show › From Beginning', [SI + ':253', SA + ':419', JP + ':365'], [L02, L07, L09, L10, JPd],
  [L02 + '/index.html:258 (k:ev inceput)', L09 + '/index.html:325 (k:startPrimul)', JPd + '/index.html:1000 (t:from-begin)'], 'DA', B + ':2155 (F5); :1664; :1591 expunere')
f('Pornește expunerea de la diapozitivul ales', 'Expunere', 'Shift+F5; Slide Show › From Current Slide; butonul Slide Show din bara de stare', [SI + ':254', SI + ':252', SA + ':420', JP + ':366'], [L02, L07, JPd],
  [L02 + '/index.html:304 (k:curentDin)', JPd + '/index.html:995 (t:from-current)'], 'DA', B + ':2155 (Shift+F5); :1665; :2029 bara de stare')
f('Mergi înainte / înapoi în expunere', 'Expunere', 'clic, →, Enter, Spațiu = înainte; ← = înapoi', [SI + ':228-231', SA + ':411-412', JP + ':313-314'], [L02, L07, L10, JPd],
  [L10 + '/index.html:333 (k:ev vazut:d1)', JPd + '/index.html:996 (t:k-next)'], 'DA', B + ':1957 (clic); :2066-2067 (taste); :1607 pasExpunere')
f('Ecranul negru de final „End of slide show, click to exit.”; încă un clic iese', 'Expunere', 'clic / → după ultimul diapozitiv', [SI + ':228-230', SA + ':398-399'], [L02, L07, L09, L10],
  [L02 + '/index.html:259 (k:ev final)', L07 + '/index.html:272 (k:ev expunereFinal)', L09 + '/index.html:326 (k:ev final)', L10 + '/index.html:334'],
  'PARTIAL', B + ':1601 (după ultimul: strat negru gol); :1611 (încă un pas iese)', 'ecranul negru nu are textul „End of slide show, click to exit.”')
f('Ieși din expunere cu Esc; revii pe diapozitivul la care ai ieșit', 'Expunere', 'Esc', [SI + ':232', SA + ':413', JP + ':311'], [L02, L07, JPd],
  [L02 + '/index.html:260 (k:ev iesit)', L02 + '/index.html:280 (k:ev esc)', JPd + '/index.html:996 (t:k-esc)'],
  'PARTIAL', B + ':2065 Escape → :1616 iesiExpunere', 'după ieșire, diapozitivul ales rămâne cel de dinainte de expunere (M.activ nu se mută pe cel la care ai ieșit)')
f('În expunere animațiile pornesc clic cu clic și tranzițiile se văd', 'Expunere', 'clic / → în expunere', [SA + ':388-399', SA + ':583'], [L07, L10],
  [L07 + '/index.html:250 (k:ev expunere)', L07 + '/index.html:272 (k:ev expunereFinal: toate clicurile parcurse)'],
  'NU', 'aplicatii/powerpoint.js:1598-1606 arataExpunere desenează toate formele odată; pasExpunere (:1607) trece direct la diapozitivul următor')
f('Ecran negru în timpul expunerii (tasta B)', 'Expunere', 'tasta B', [JP + ':312'], [JPd], [JPd + '/index.html:996 (t:negru-on)'],
  'NU', 'aplicatii/powerpoint.js:2065-2067 în expunere: doar Escape și tastele de înainte / înapoi')
f('Folosește Presenter View (bifa)', 'Expunere', 'Slide Show › Use Presenter View', [JP + ':363'], [JPd], [JPd + '/index.html:1003 (t:presenter-on)'],
  'NU', 'căutat „Presenter” în aplicatii/powerpoint.js: nimic')
f('Vizualizarea Slide Sorter (toate diapozitivele, mici)', 'Vizualizări', 'butonul Slide Sorter din bara de stare; View › Slide Sorter', [SI + ':250'], [L02],
  [L02 + '/index.html:230 (k:vedere după Slide Sorter)'], 'DA', B + ':2027; :1657; :548 deseneazaSortare')
f('Întoarce-te în Normal din Slide Sorter (butonul Normal sau dublu clic pe un diapozitiv)', 'Vizualizări', 'Normal din bara de stare / View; dublu clic pe diapozitiv în Slide Sorter',
  [SI + ':244-245', SI + ':235-236'], [L02], [L02 + '/index.html:230 (k:ev normalDupaSorter)', L02 + '/index.html:278'],
  'PARTIAL', B + ':2026 / :1658 → seteazaVedere(normala) :580', 'dublul clic pe un diapozitiv din Slide Sorter nu face nimic (I.la.dublu :2036-2045 tratează doar textul și lista Open)')
f('Schița (Outline View): Normal din bara de stare, apăsat când ești deja în Normal, schimbă panoul din stânga; Normal din View aduce miniaturile', 'Vizualizări',
  'butonul Normal din bara de stare (de două ori); View › Normal', [SI + ':246-247'], [L02], [L02 + '/index.html:241 (k:ev schita)', L02 + '/index.html:242 (k:stanga miniaturi)'],
  'NU', 'aplicatii/powerpoint.js:584 seteazaVedere: dacă vederea e deja normala → fara_efect; căutat „Outline”, „schita”: nimic')
f('Scrie note la diapozitiv în zona de note', 'Vizualizări', 'clic în zona de note, tastezi', [SI + ':263', SI + ':269'], [L02, L09],
  [L02 + '/index.html:184 (k:nota)', L02 + '/index.html:274-277 (k:nota, k:noteDoar)', L09 + '/index.html:324 (k:nota)'], 'DA', B + ':1861-1862 (zona_note); :1805 scriere_note')
f('Ascunde / arată zona de note', 'Vizualizări', 'butonul Notes din bara de stare; View › Notes', [SI + ':255-256'], [L02],
  [L02 + '/index.html:185 (k:ev notesToggle, k:noteVizibile)', L02 + '/index.html:214 (k:buton ShowNotes)'], 'DA', B + ':2025; :1656; :591 comutaNote')
f('Deschide o filă a panglicii și găsește zonele ferestrei (panglica, miniaturi, zona de lucru, note, bara de stare)', 'Interfață',
  'clic pe numele filei; clic pe fiecare zonă', [SI + ':239', SI + ':259', JP + ':334', JP + ':339'], [L02, JPd],
  [JPd + '/index.html:600-604 (t:zona-miniaturi, t:zona-note, t:bara-stare, t:tab-insert, t:tab-design…)'],
  'DA', B + ':1966-1969 fila → :733 activeazaFila; țintele zonelor din api_biblioteca.md §3 (miniatura, diapozitiv, zona_note, bara_stare)')
f('Găsește un buton din panglică: la clic, simulatorul spune cum se numește, pe ce filă și în ce grup e', 'Interfață', 'clic pe orice buton din panglică',
  [SI + ':265'], [L02], [L02 + '/index.html:207 (k:buton TableInsertGallery)', L02 + '/index.html:214 (k:buton ShowNotes)', L02 + '/index.html:298 (k:buton SlideNewGallery)'],
  'PARTIAL', 'aplicatii/aplicatii.js:225-230 nesimulat (mesajul standard cu eticheta); powerpoint.js:1705', 'mesajul nu spune fila și grupul butonului')

# ---------------- Anulare
f('Anulează ultimul pas, pe rând (Ctrl+Z, butonul Undo)', 'Anulare', 'Ctrl+Z; Undo din bara de acces rapid; butonul Ctrl+Z de sub fereastră', [S + ':428', S + ':276', SA + ':416'], [L04, L05, L06, L07],
  [L05 + '/index.html:147 (k:ev undo)'], 'DA', B + ':2159; :1661; :1588 anuleaza')
f('Reface pasul anulat (Ctrl+Y)', 'Anulare', 'Ctrl+Y; Redo', [S + ':429', S + ':279', SA + ':417'], [L05, L07], [], 'DA', B + ':2160; :1663; :1589 reface')

# ---------------- Fișier
f('Pornește PowerPoint din pictogramă: ecranul de început (Home, New, Open, Blank Presentation, teme)', 'Fișier', 'pictograma PowerPoint', [SFI + ':437'], [L03], [],
  'NU', 'aplicatii/powerpoint.js pornește direct cu o prezentare sau cu fereastra goală; căutat „ecranul de început”, „start”: nimic (windows.js n-a fost căutat pentru pornirea PowerPoint-ului)')
f('Fă o prezentare nouă, goală', 'Fișier', 'Blank Presentation (ecranul de început / File › New); Ctrl+N', [SFI + ':465', SFI + ':440', SFI + ':261'], [L03],
  [L03 + '/index.html:105 (k:goale)', L03 + '/index.html:106 (k:goale, k:nprez)'], 'DA', B + ':1975 Blank Presentation; :2151 ctrl_n; :1157 prezentareNoua')
f('Fă o prezentare nouă cu o temă (previzualizarea temei, apoi Create)', 'Fișier', 'ecranul de început / File › New › o temă › Create', [SFI + ':466', SFI + ':400'], [L03],
  [L03 + '/index.html:112 (k:tema Atlas)'], 'NU', 'aplicatii/powerpoint.js:1971-1985 în Backstage doar Blank Presentation face ceva; temele cad în I.nesimulat')
f('Umblă prin fila File (Back, Home, New, Open, Info, Save, Save As, Close); Esc o închide', 'Fișier', 'clic pe File; clic pe paginile din stânga; Esc', [SFI + ':451', SFI + ':453-464', SFI + ':445'], [L03], [],
  'DA', B + ':1967 (File → Backstage); :1973 Back; :1982 arataPaginaBackstage; :2150 Esc')
f('Salvează: un fișier deja salvat se salvează fără fereastră; unul nesalvat cere numele (fereastra „Save this file”, numele propus = titlul)', 'Fișier',
  'Ctrl+S; Save din bara de acces rapid; File › Save', [SFI + ':327-335', SFI + ':443', SFI + ':459-461', JP + ':368'], [L03, JPd],
  [L03 + '/index.html:164 (k:fisier cu titlul nou, în același fișier)', JPd + '/index.html:678 (t:salvat-pptx)'],
  'PARTIAL', B + ':1581-1582 (salvat → fără fereastră); :2166; :1660; :1980',
  'la o prezentare nesalvată, Ctrl+S duce la pagina Save As (:1583), nu la fereastra „Save this file” cu numele propus; nu se scrie niciun fișier în dosar')
f('Salvează cu alt nume / în alt folder (Save As, F12): scrii numele, alegi folderul (Documente, Documente › TIC_6A), Save', 'Fișier',
  'F12; File › Save As › Browse; în fereastră: folderele din stânga / dublu clic pe folder, File name, Save', [SFI + ':336-342', SFI + ':417-426', SFI + ':288', JP + ':367', JP + ':320-323'], [L03, JPd],
  [L03 + '/index.html:130 (k:fisier Documente)', L03 + '/index.html:138 (k:fisier Documente/TIC_6A)', L03 + '/index.html:146', L03 + '/index.html:165 (copie _v2)', L03 + '/index.html:286'],
  'PARTIAL', B + ':2156 F12 → dialog.FileSaveAs; :1977 Browse; :1083-1095 salveazaDinDialog (numele → M.nume)',
  'nu alegi folderul (nu există dosare de salvare) și nu se creează fișier: după Save As nu rămân două fișiere (originalul + copia) pe care un exercițiu să le vadă')
f('Salvează ca PDF', 'Fișier', 'Save as type › PDF, apoi Save', [SFI + ':288-311', JP + ':318'], [L03, JPd],
  [L03 + '/index.html:198 (k:fisier pdf)', L03 + '/index.html:262', JPd + '/index.html:671 (t:tip-pdf, t:salvat-pdf)'],
  'NU', 'aplicatii/powerpoint.js:1086-1087 salveazaDinDialog pune mereu .pptx; Save as type e doar o casetă (camp:tip_fisier, :283)')
f('Salvează ca PowerPoint Show (.ppsx); prezentarea deschisă devine .ppsx', 'Fișier', 'Save as type › PowerPoint Show', [SFI + ':288-311'], [L03],
  [L03 + '/index.html:199 (k:fisier ppsx)'], 'NU', 'aplicatii/powerpoint.js:1087: doar .pptx; căutat „ppsx”: nimic')
f('Salvează ca OpenDocument (.odp)', 'Fișier', 'Save As › tipul OpenDocument Presentation', [JP + ':318', JP + ':201'], [JPd],
  [JPd + '/index.html:675 (t:tip-odp, t:salvat-odp)'], 'NU', 'aplicatii/powerpoint.js:1087: doar .pptx; căutat „odp”: nimic')
f('Salvează diapozitivele ca imagini PNG / JPEG (All Slides = folder cu Slide1, Slide2…; Just This One = o imagine)', 'Fișier', 'Save as type › PNG / JPEG › Save › All Slides / Just This One',
  [SFI + ':296-298', SFI + ':390-397'], [L03], [], 'NU', 'căutat „png”, „jpeg”, „Just This One” în aplicatii/powerpoint.js: nimic')
f('Numele există deja: întrebarea „… already exists. Do you want to replace it?” (Yes / No, OK / Anulare); fișierul deschis în altă fereastră nu se poate înlocui', 'Fișier',
  'Save As cu un nume care există; Yes / No / OK / Anulare', [SFI + ':313-326', SFI + ':382-387', SFI + ':301-302'], [L03],
  [L03 + '/index.html:144 (k:ev inlocuireAnulare)', L03 + '/index.html:175 (k:ev confirmNu)', L03 + '/index.html:131 (k:neschimbat)', L03 + '/index.html:145', L03 + '/index.html:200'],
  'NU', 'aplicatii/powerpoint.js:1083-1095 salvează orice nume fără să caute fișierul în dosar; căutat „already exists”, „replace”: nimic')
f('Numele fișierului e verificat (fără \\ / : * ? " < > |; în atelier: Subiect_Clasa_Nume)', 'Fișier', 'scrii numele, apeși Save', [SFI + ':293-294', JP + ':321'], [L03, JPd],
  [JPd + '/index.html:671 (t:nume)', JPd + '/index.html:675', JPd + '/index.html:1063'],
  'NU', 'aplicatii/powerpoint.js:1085-1087 primește orice nume nevid')
f('Închide prezentarea; cu modificări nesalvate te întreabă: Save / Don\'t Save / Cancel', 'Fișier', 'File › Close; Ctrl+W; X',
  [SFI + ':344-349', SFI + ':403-414', JP + ':371', JP + ':329-331'], [L03, JPd],
  [L03 + '/index.html:220 (k:app goala)', JPd + '/index.html:678 (t:f-close, t:q-save)'],
  'DA', B + ':1981 File › Close; :2153 ctrl_w; :2022 X; :1119 cerereInchidere; :1129 raspunsInchidere')
f('Închiderea ultimei prezentări: File › Close lasă fereastra goală „PowerPoint”, iar X pe ultima fereastră închide PowerPoint de tot', 'Fișier', 'File › Close / X pe ultima prezentare',
  [SFI + ':350-360', SFI + ':438'], [L03], [L03 + '/index.html:220 (k:app goala)', L03 + '/index.html:264 (k:ev appInchisa)'],
  'PARTIAL', B + ':1146-1156 inchidePrezentare (fereastra goală)', 'X pe ultima prezentare tot fereastra goală o lasă; aplicația nu se închide (:1120-1122)')
f('Deschide o prezentare: Ctrl+O › Browse › fereastra Open (alegi folderul și fișierul) › Open sau dublu clic', 'Fișier', 'Ctrl+O; File › Open › Browse; Ctrl+F12; dublu clic pe fișier',
  [SFI + ':441-442', SFI + ':469', SFI + ':427-431', SFI + ':270'], [L03],
  [L03 + '/index.html:132 (k:deschis)', L03 + '/index.html:241 (k:deschis Documente)', L03 + '/index.html:265'],
  'PARTIAL', B + ':2152 ctrl_o; :1976 Browse → :1171 deschideOpen; :1990 Open; :2037 dublu clic; :1218 deschideFisier',
  'fereastra Open arată doar lista fișierelor date la pornire, fără foldere de deschis; Ctrl+F12 nu e legat')
f('Deschide o prezentare din lista Recent', 'Fișier', 'File › Open › Recent › fișierul', [SFI + ':467-468'], [L03], [],
  'NU', 'căutat „Recent” în aplicatii/powerpoint.js: nimic; rândurile cad în I.nesimulat')
f('Deschiderea peste o prezentare goală neatinsă o înlocuiește', 'Fișier', 'Open când e deschisă doar Presentation1, neatinsă', [SFI + ':270-283'], [L03], [],
  'NU', 'aplicatii/powerpoint.js:1225-1231 deschideFisier păstrează prezentarea goală și o adaugă pe cea nouă')
f('Treci de la o fereastră PowerPoint la alta (mai multe prezentări deschise)', 'Fișier', 'clic pe fereastra prezentării', [SFI + ':439'], [L03], [],
  'NU', 'aplicatii/powerpoint.js ține mai multe prezentări (PREZ, :158-161), dar n-am găsit un gest care să schimbe prezentarea activă', 'NESIGUR: poate prin bara de activități din windows.js')
f('Activează editarea unui fișier deschis în Protected View (Enable Editing)', 'Fișier', 'bara galbenă › Enable Editing', [SFI + ':447'], [L03],
  [L03 + '/index.html:248 (k:ev enable)'], 'NU', 'căutat „Protected”, „Enable Editing” în aplicatii/powerpoint.js: nimic')
f('Deschide din File Explorer cu dublu clic: .pptx se deschide (din Descărcări în Protected View), .ppsx pornește expunerea', 'Fișier', 'dublu clic pe fișier în File Explorer',
  [SFI + ':474-476', SFI + ':270'], [L03], [L03 + '/index.html:246-248 (ciclul-apei-de-reparat din Descărcări)'],
  'NU', 'aplicatii/powerpoint.js n-are intrare pentru „deschis din Explorer” sau .ppsx', 'NESIGUR: legătura Explorer → PowerPoint poate fi în explorer.js; n-am căutat acolo')

# ---------------- Atelierul „repară diapozitivul” (tipul diapozitiv din jocuri)
for nume, gest, vechi, bdov in [
    ('Alege culoarea textului diapozitivului (contrast cu fundalul)', 'clic pe o culoare din lista „Textul” (5 culori)', [JA + ':145', JP + ':108'], B + ':961 aplicaCuloare (Font Color) — același rezultat, pe drumul PowerPoint-ului'),
    ('Alege culoarea fundalului diapozitivului', 'clic pe o culoare din lista „Fundalul” (4 culori)', [JA + ':146', JP + ':109'], B + ':1734-1739 (Format Background › Solid fill › Color)'),
    ('Alege mărimea titlului și a textului', 'clic pe o mărime (titlu 20/28/36, text 12/16/26/44)', [JA + ':147-148', JP + ':110-111'], B + ':1506 puneMarime (Font Size)'),
    ('Păstrează sau scoate un rând de pe diapozitiv', 'clic pe rând (se taie / revine)', [JA + ':149', JP + ':112'], B + ':1819-1832 sterge (alegi rândul și Delete); :1588 Ctrl+Z îl aduce înapoi')]:
    f(nume, 'Atelier „repară diapozitivul”', gest, vechi, [JAd, JPd],
      [JAd + '/index.html:317 (t:diapozitiv)', JAd + '/index.html:322', JAd + '/index.html:326', JPd + '/index.html:868 (t:diapozitiv)', JPd + '/index.html:1053'],
      'DA', bdov, '', 'atelierul nu e o fereastră PowerPoint, ci un panou cu butoane; biblioteca face același lucru pe drumul aplicației')

for i, x in enumerate(F, 1):
    x['id'] = 'powerpoint-F%03d' % i
F = [dict([('id', x['id'])] + [(k, v) for k, v in x.items() if k != 'id']) for x in F]

doar = [
    {'grup': 'Meniurile de clic dreapta (lecțiile 4-5)', 'exemple': ['Search the menus', 'Add Section', 'Reset Slide', 'Photo Album...', 'Hide Slide', 'New Comment', 'Grid and Guides', 'Ruler', 'Font...', 'Paragraph...', 'Bullets', 'Numbering', 'Convert to SmartArt', 'Link', 'Format Shape...', 'Edit Text', 'Group', 'Bring to Front', 'Send to Back', 'Save as Picture...', 'Edit Alt Text...', 'Size and Position...', 'Format Picture...', 'Keep Source Formatting / Picture (Paste Options)'], 'dovada': S + ':449'},
    {'grup': 'Insert: butoane doar cu mesaj', 'exemple': ['Draw Table', 'Excel Spreadsheet', 'Stock Images', 'Online Pictures', 'Link', 'Audio', 'iconițele Insert Chart, SmartArt, Video, Icon din caseta goală'], 'dovada': S + ':490'},
    {'grup': 'Mânerele de mărime (cerculețele) — doar mesaj „lecția 6”', 'exemple': ['tragerea unui mâner'], 'dovada': S + ':467'},
    {'grup': 'Fila File în lecțiile 4-7 și filele contextuale fără butoane', 'exemple': ['File', 'Picture Format', 'Shape Format', 'Table Design', 'Layout (tabel)'], 'dovada': S + ':470'},
    {'grup': 'Panglica reală desenată: butoanele nelegate primesc data-nesim', 'exemple': ['toate butoanele fără legătură din panglica-powerpoint.json'], 'dovada': 'jocuri/_motor/ui-panglica.js:31'},
    {'grup': 'Formatare: liste și comenzi nesimulate', 'exemple': ['More Colors...', 'Eyedropper', 'Gradient', 'Background Styles (cele 12 stiluri)', 'Variants', 'Colors', 'Fonts', 'Effects', 'Gradient / Picture / Pattern fill'], 'dovada': SF + ':345'},
    {'grup': 'Tranziții / animații: doar mesaj', 'exemple': ['More (galeria completă de tranziții)', 'Effect Options', 'Advance Slide', 'Sound', 'Replay', 'Rewind', 'Trigger', 'Animation Painter'], 'dovada': SA + ':448'},
    {'grup': 'Interfață: vizualizări și butoane doar cu mesaj', 'exemple': ['Reading View', 'Comments', 'Display Settings', 'fila File (lecția 2)'], 'dovada': SI + ':251'},
    {'grup': 'Fișier: locuri și pagini nesimulate', 'exemple': ['This PC', 'Add a Place', 'Recent (locuri)', 'Info', 'History', 'Print', 'Share', 'Export', 'Account', 'Options', 'Options... (PDF)', 'tipurile din Save as type nefolosite'], 'dovada': SFI + ':471'},
    {'grup': 'Atelierul PowerPoint (jocuri/prezentari-vi): File › New și File › Open doar cu mesaj', 'exemple': ['New', 'Open'], 'dovada': JP + ':372'},
]

nesigure = [
    'Verdictele sunt din citirea codului; nicio funcție n-a fost jucată în poligon (Playwright). Cele mai sigure NU: comenzile care cad în I.nesimulat (powerpoint.js:1705, :1768).',
    'Butonul Insert › Text Box: idMso TextBoxInsert apare în date/powerpoint.json, dar n-are caz în apasaComanda — NU din cod, neprobat.',
    'Săgețile casetei Duration (Transitions): fără cod găsit — neprobat.',
    'Pornirea PowerPoint-ului, schimbarea ferestrei active și dublul clic din File Explorer: n-am căutat în windows.js / explorer.js.',
    'jocuri/_motor/motor.js n-a fost citit: verificarea exercițiilor am luat-o din CHK-urile simulatoarelor (simppt*.js) și din condițiile din pagini.',
    'Tipul `zona` (m1-l02:190,193,293; m2-l08:256,261,308) e clic pe o captură-imagine, nu pe aplicație: nu l-am trecut ca funcție.',
    'simppt-proba.js (m2-l10) doar învelește simulatoarele (proba de antrenament, fără bife până la prima verificare): nu adaugă funcții ale aplicației.',
]

fis = [('lectii/_sim/simppt.js', 932), ('lectii/_sim/simppt-animatii.js', 808), ('lectii/_sim/simppt-estetica.js', 93), ('lectii/_sim/simppt-fisier.js', 715),
       ('lectii/_sim/simppt-formatare.js', 622), ('lectii/_sim/simppt-interfata.js', 459), ('lectii/_sim/simppt-proba.js', 241), ('lectii/_sim/simppt-proiect.js', 47),
       ('jocuri/_motor/panglica-powerpoint.js', 2), ('jocuri/_motor/ui-panglica.js', 107), ('lectii/vi/m1-l04/index.html', 829),
       ('jocuri/prezentari-antrenament-vi/index.html', 402), ('jocuri/prezentari-vi/index.html', 1113)]
fisiere = [{'cale': c, 'linii': n} for c, n in fis] + [{'cale': L + '/index.html', 'linii': None, 'cum': 'doar condițiile exercițiilor (grep)'} for L in [L02, L03, L05, L06, L07, L08, L09, L10]] + \
    [{'cale': 'aplicatii/powerpoint.js', 'linii': 2386, 'cum': 'biblioteca: comenzile, gesturile, tastele (pe bucăți)'}, {'cale': 'aplicatii/aplicatii.js', 'linii': 781, 'cum': 'biblioteca: doar nesimulat (grep)'},
     {'cale': 'aplicatii/date/powerpoint.json', 'linii': 1, 'cum': 'biblioteca: listele, meniurile, galeriile (citite cu Python)'}]

out = {'aplicatie': 'powerpoint', 'eticheta': 'powerpoint', 'fisiere_citite': fisiere, 'functii': F, 'doar_afisate': doar, 'nesigure': nesigure}
json.dump(out, open(os.path.join(P, 'powerpoint.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

n = {k: sum(1 for x in F if x['biblioteca'] == k) for k in ('DA', 'PARTIAL', 'NU')}
def rand(x):
    s = '- **%s** %s — %s' % (x['id'].split('-')[1], x['functie'], x['biblioteca'])
    if x['lipsa']: s += '. Lipsește: ' + x['lipsa']
    if x['biblioteca'] == 'NU': s += '. (' + x['biblioteca_dovada'] + ')'
    if x['ceruta_de_exercitiu']: s += '. Cerută: ' + '; '.join(x['exercitii'][:3])
    return s
md = ['# Paritate PowerPoint — simulatoarele vechi (proba) față de biblioteca nouă', '',
      'Data: 21.11.2026. Vechi = proba_src (commit 0dcd4ffb): simppt*.js, m1-l04 (simulator în pagină), atelierele jocuri/prezentari-vi și prezentari-antrenament-vi. Nou = aplicatii/powerpoint.js.', '',
      '## Numerele', '', '- funcții: **%d** — DA **%d**, PARȚIAL **%d**, NU **%d**' % (len(F), n['DA'], n['PARTIAL'], n['NU']),
      '- cerute de exerciții: %d (dintre ele NU: %d, PARȚIAL: %d)' % (sum(x['ceruta_de_exercitiu'] for x in F), sum(x['ceruta_de_exercitiu'] and x['biblioteca'] == 'NU' for x in F), sum(x['ceruta_de_exercitiu'] and x['biblioteca'] == 'PARTIAL' for x in F)),
      '- butoane care doar arată un mesaj: %d grupuri (în json, `doar_afisate`)' % len(doar), '']
for titlu, cond in [('## NU — cerute de exerciții', lambda x: x['biblioteca'] == 'NU' and x['ceruta_de_exercitiu']),
                    ('## PARȚIAL — cerute de exerciții', lambda x: x['biblioteca'] == 'PARTIAL' and x['ceruta_de_exercitiu']),
                    ('## NU — necerute de exerciții', lambda x: x['biblioteca'] == 'NU' and not x['ceruta_de_exercitiu']),
                    ('## PARȚIAL — necerute de exerciții', lambda x: x['biblioteca'] == 'PARTIAL' and not x['ceruta_de_exercitiu'])]:
    md += [titlu, ''] + [rand(x) for x in F if cond(x)] + ['']
md += ['## Ce n-am apucat / ce e nesigur', ''] + ['- ' + s for s in nesigure] + ['',
       'GATA_PARITATE powerpoint total=%d da=%d partial=%d nu=%d' % (len(F), n['DA'], n['PARTIAL'], n['NU'])]
open(os.path.join(P, 'powerpoint.md'), 'w', encoding='utf-8').write('\n'.join(md) + '\n')
print(len(F), n)
