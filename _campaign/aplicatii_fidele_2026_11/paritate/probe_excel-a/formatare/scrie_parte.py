# Scrie P/probe_excel-a/parte_formatare.json (inventarul excel-a pentru lectii/_sim/excelx-formatare.js).
import json
from pathlib import Path

V = 'lectii/_sim/excelx-formatare.js:'
X = 'aplicatii/excel.js:'
PG = 'lectii/viii/m1-l06/index.html:'
U = ['lectii/viii/m1-l06']
def ex(linie, ce): return f"tipul t:'excelx' din {PG}{linie} ({ce})"
AT = ex('244-250', 'atelierul „lista excursiei”, testele de la :57-63')
CO = ex('255-257', 'exercițiul „concursul de robotică”, testele de la :64-69')
PR = 'probe_excel-a/formatare/rezultat_proba.json'

F = []
def f(functie, grup, gest, vechi, bib, bdov, exercitii=(), lipsa='', nota=''):
    F.append({'id': f'excel-a-FMT{len(F)+1:03d}', 'functie': functie, 'grup': grup, 'gest': gest,
              'vechi_dovada': [V + str(x) for x in vechi], 'unde': U, 'ceruta_de_exercitiu': bool(exercitii),
              'exercitii': list(exercitii), 'biblioteca': bib, 'biblioteca_dovada': bdov, 'lipsa': lipsa, 'nota': nota})

# ---------------- Font
f('Îngroașă (aldin) celulele selectate; al doilea clic scoate aldinul (comutat după celula activă, pe toată zona)', 'Formatare: font',
  'butonul B din Pornire › Font sau Ctrl+B', [268, 451, 694], 'DA', X + '2965 (Bold → comutaFormat), ' + X + '1681-1686, ' + X + '3835 (Ctrl+B); proba: Ctrl+B pune bold pe A1',
  [ex('204-206', 'b pe A1:C1'), ex('272-274', 'b pe A1:C1'), AT + ' — b pe A2:D2', CO + ' — b pe A2:C2'])
f('Pune textul cursiv (Italic) pe zona selectată; al doilea clic îl scoate', 'Formatare: font', 'butonul I sau Ctrl+I',
  [268, 451, 694], 'DA', X + '2966, ' + X + '3836')
f('Subliniază textul (Underline) pe zona selectată; al doilea clic scoate sublinierea', 'Formatare: font', 'butonul U (partea cu pictograma) sau Ctrl+U',
  [268, 452, 694], 'DA', X + '2967, ' + X + '3837', nota='săgeata ▾ (subliniere dublă) e doar afișată în vechi')
f('Alege mărimea fontului din lista Font Size (8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72); rândul crește singur după font', 'Formatare: font',
  'clic pe caseta Font Size › o mărime', [109, 273, 381, 382, 453, 236], 'NU',
  "căutat FontSize / 'Font Size' / fs în aplicatii/excel.js: niciun caz în apasa() (" + X + '2964-2999); proba: „Font Size … aici nu e simulată” (' + PR + ' › fontsize)')
f('Mărește / micșorează fontul cu un pas (A▲ Increase Font Size, A▼ Decrease Font Size)', 'Formatare: font', 'butoanele A▲ / A▼',
  [274, 275, 453], 'NU', 'căutat FontSizeIncrease / FontSizeDecrease: lipsesc din apasa(); proba: mesajul „nu e simulată” (' + PR + ' › fontsize_inc)')
f('Colorează textul cu butonul Font Color (roșu la început, apoi ultima culoare aleasă)', 'Formatare: font', 'clic pe pictograma Font Color',
  [117, 456], 'NU', 'căutat FontColorPicker / color / culoare_font: lipsesc din apasa() și din starea celulei (' + X + '617-625); proba: „Font Color RGB(255, 0, 0) … nu e simulată” (' + PR + ' › fontcolor_buton)')
f('Alege culoarea textului din paleta Font Color ▾ (Automatic, culorile temei cu nuanțele lor, Standard Colors)', 'Formatare: font',
  'săgeata ▾ de lângă Font Color › o culoare', [73, 84, 362, 371, 456], 'NU', 'proba: săgeata dă „Font Color … nu e simulată” (' + PR + ' › fontcolor_sageata)')
f('Pune culoare de umplere cu butonul Fill Color (galben la început, apoi ultima culoare aleasă din paletă)', 'Formatare: celulă',
  'clic pe găleata Fill Color', [117, 455, 371], 'PARTIAL', X + '2982 (CellFillColorPicker → umpleCuloare(\'FFFF00\')), ' + X + '1696-1701; proba: A2:C2 primesc umplere FFFF00',
  [ex('204-206', 'fill pe A1:C1'), AT + ' — fill pe A2:D2', CO + ' — fill pe A2:C2'],
  lipsa='butonul pune mereu galben: nu ține minte ultima culoare aleasă (paleta nu există în bibliotecă)')
f('Alege culoarea de umplere din paleta Fill Color ▾ (culorile temei cu 5 nuanțe, Standard Colors) sau scoate umplerea (No Fill)', 'Formatare: celulă',
  'săgeata ▾ de lângă Fill Color › o culoare / No Fill', [73, 84, 362, 371, 455], 'NU',
  'proba: săgeata dă „Fill Color … nu e simulată” (' + PR + ' › fill_sageata); lista.CellFillColorPicker din date/excel.json e folosită doar pentru Tab Color (' + X + '2343-2362)',
  nota='No Fill (scoaterea umplerii) nu are alt drum în bibliotecă')

# ---------------- Borduri
f('Butonul Borders pune ultima bordură folosită (la început Bottom Border) pe zona selectată', 'Borduri', 'clic pe pictograma Borders',
  [117, 285, 454], 'PARTIAL', X + '2994 (BorderBottomNoToggle ∈ BORD_EFECT → borduri), ' + X + '1737-1758; proba: A2:C3 primește bordura de jos',
  lipsa='pune mereu Bottom Border; nu ține minte ultima bordură aleasă din listă')
f('Pune borduri pe toate laturile tuturor celulelor (Borders ▾ › All Borders)', 'Borduri', 'săgeata ▾ de lângă Borders › All Borders',
  [289, 294, 372, 374], 'DA', X + '2983 (lista.Borders), ' + X + '3609 (rândul listei → borduri), ' + X + '1751 (BordersAll); proba: A2:C3 cu toate laturile (' + PR + ' › borders_all)',
  [ex('199-201', 'borduri toate pe A1:C4'), ex('272-274', 'borduri toate pe A1:C4'), AT + ' — A2:D6', CO + ' — A2:C5'])
f('Pune contur în jurul zonei: Outside Borders (subțire) sau Thick Outside Borders (gros)', 'Borduri', 'Borders ▾ › Outside Borders / Thick Outside Borders',
  [295, 372], 'DA', X + '1751-1752 (BorderOutside, BorderThickOutside)', nota='verificarea „exterior / exteriorGros” există în vechi (' + V + '739-743), dar niciun exercițiu de pe proba nu o cere')
f('Pune o singură latură: Bottom / Top / Left / Right Border', 'Borduri', 'Borders ▾ › Bottom/Top/Left/Right Border',
  [292, 372], 'DA', X + '1750-1751')
f('Pune linii speciale jos: Bottom Double Border, Thick Bottom Border, Top and Bottom, Top and Thick Bottom, Top and Double Bottom', 'Borduri',
  'Borders ▾ › una dintre cele 5', [296, 372], 'DA', X + '1752-1754')
f('Scoate toate bordurile zonei (No Border)', 'Borduri', 'Borders ▾ › No Border', [293, 372], 'DA', X + '1751 (BorderNone → tot(null))')

# ---------------- Aliniere
f('Aliniază conținutul la stânga / centru / dreapta; al doilea clic pe același buton readuce alinierea automată', 'Aliniere',
  'butoanele Align Left / Center / Align Right', [270, 458], 'DA', X + '2968-2970, ' + X + '1687-1692 (comutator: deja → delete aliniere)',
  [ex('147-149', 'al center pe B2:B4'), ex('152-154', 'al right pe B1:C1')])
f('Aliniază conținutul pe verticală: sus / la mijloc / jos (implicit jos)', 'Aliniere', 'butoanele Top Align / Middle Align / Bottom Align',
  [271, 272, 457], 'NU', 'căutat AlignTopExcel / AlignMiddleExcel / AlignBottomExcel / vertical: lipsesc; proba: „Middle Align … nu e simulată” (' + PR + ' › align_middle)',
  [ex('156-158', 'va middle pe A1; rândul 1 pornește cu înălțimea 40, inaltimi:{1:40}')],
  nota='exercițiul pornește și cu un rând înalt (inaltimi), pe care biblioteca nu-l are (vezi înălțimea rândului)')
f('Încadrează textul pe mai multe rânduri în celulă (Wrap Text, comutator); rândul crește singur', 'Aliniere', 'butonul Wrap Text',
  [459, 238, 235], 'DA', X + '2992, ' + X + '1710-1715, rândul crește: ' + X + '1071-1086 (inaltimiAuto)', [ex('177-179', 'wrap pe B2')])
f('Îmbină și centrează zona (Merge & Center): cu mai multe valori apare avertismentul real „Merging cells only keeps the upper-left value…” (OK / Cancel); păstrează primul conținut în stânga-sus; al doilea clic desface; pe o singură celulă doar centrează',
  'Aliniere', 'butonul Merge & Center', [299, 300, 303, 306, 310, 355, 356, 460], 'PARTIAL',
  X + '2971, ' + X + '1784-1806 (îmbină, al doilea clic desface); proba: A1:C1 cu „x” în C1 se îmbină fără nicio fereastră și x dispare (' + PR + ' › merge_doua_valori)',
  [ex('172-174', 'imbinat A1:D1 centrat'), ex('181', 'întrebare pe foaie: „Excel te avertizează, iar după OK x dispare”'), ex('268-270', 'imbinat A1:C1 centrat'),
   AT + ' — A1:D1', CO + ' — A1:C1'],
  lipsa='fără avertismentul cu OK / Cancel (exercițiul de la :181 întreabă exact de el); dacă stânga-sus e goală, conținutul altei celule nu se mută acolo (se șterge); pe o singură celulă nu centrează (fara_efect, ' + X + '1793)')
f('Îmbină pe fiecare rând separat (Merge Across)', 'Aliniere', 'Merge & Center ▾ › Merge Across', [304, 375, 376, 460], 'NU',
  'căutat MergeAcross / Merge Across: lipsește; proba: clicul pe marginea dreaptă a butonului îmbină tot (' + PR + ' › merge_sageata)')
f('Îmbină celulele fără să centreze (Merge Cells)', 'Aliniere', 'Merge & Center ▾ › Merge Cells', [306, 309, 375], 'NU', 'căutat MergeCells / Merge Cells: lipsește')
f('Desface îmbinarea (Unmerge Cells)', 'Aliniere', 'Merge & Center ▾ › Unmerge Cells (sau al doilea clic pe Merge & Center)', [301, 311, 375], 'PARTIAL',
  X + '1787-1792 (al doilea clic pe Merge & Center desface)', lipsa='lipsește lista ▾ cu Unmerge Cells; desfacerea merge doar prin al doilea clic pe Merge & Center')

# ---------------- Număr
f('Alege formatul numărului din lista Number Format (General, Number 0,00, Currency lei, Accounting, Short Date, Long Date cu ziua săptămânii, Time, Percentage 0,00%, Fraction, Scientific, Text); lista arată cum ar arăta celula; caseta arată numele formatului',
  'Număr', 'clic pe caseta Number Format › un format', [107, 108, 143, 160, 169, 171, 377, 380, 461, 594], 'NU',
  "căutat NumberFormatGallery / format_numar: apasa() nu-l are; afisat() știe doar General, 0, 0.00…, 0%, dd.mm.yyyy, dd.mmm (" + X + '56-68); proba: „Number Format … nu e simulată” (' + PR + ' › numberformat)',
  [ex('236-238', 'format data lungă pe B1 + fără ####'), ex('264-266', "pornește cu forme:{'B2:B4':{nfx:'#.##0,00'}} și cere 2 zecimale")],
  nota="nici formatele puse de exercițiu la pornire (#.##0,00 cu separator de mii) nu se pot arăta în bibliotecă")
f('Pune formatul contabil (Accounting Number Format: lei, minusul la stânga, liniuță la zero)', 'Număr', 'butonul Accounting', [106, 146, 148, 462], 'NU',
  'căutat InternationalCurrency / Accounting: lipsesc; proba: „Accounting Number Format … nu e simulată” (' + PR + ' › accounting)')
f('Arată numerele ca procent fără zecimale (Percent Style, 0%): 0,125 → 13%, valoarea rămâne', 'Număr', 'butonul % sau Ctrl+Shift+%', [463, 696], 'DA',
  X + '2991, ' + X + '1703-1708, ' + X + '3978-3987 (Ctrl+Shift+%); proba: C2 0,125 → 13%, C3 → 50% (' + PR + ' › percent, ctrl_shift_5)',
  [ex('232-234', 'procent pe C2:C4'), ex('276-278', 'procent pe B2:B4'), CO + ' — procent pe C3:C5'])
f('Pune stilul virgulă (Comma Style: separator de mii, două zecimale)', 'Număr', 'butonul „,” (Comma Style)', [106, 463], 'NU',
  'căutat CommaStyle: lipsește; proba: „Comma Style … nu e simulată” (' + PR + ' › comma)')
f('Adaugă o zecimală afișată (Increase Decimal), după zecimalele pe care le arată celula activă: 7,5 → 7,50', 'Număr', 'butonul Increase Decimal (←0 .00)',
  [173, 178, 278, 279, 464], 'NU', 'căutat DecimalsIncrease / zecimale: lipsesc; proba: „Increase Decimal … nu e simulată” (' + PR + ' › dec_inc)',
  [ex('227-229', 'zecimale 2 pe B2:B4'), AT + ' — 2 zecimale pe B3:B6'])
f('Scoate o zecimală afișată (Decrease Decimal): 7,5 → 8, valoarea din spate rămâne 7,5', 'Număr', 'butonul Decrease Decimal (.00 →.0)',
  [173, 178, 278, 279, 464], 'NU', 'căutat DecimalsDecrease: lipsește; proba: „Decrease Decimal … nu e simulată” (' + PR + ' › dec_dec)',
  nota='întrebarea cu variante de la ' + PG + '240 (t:choice) vorbește despre el, fără foaie')

# ---------------- Stiluri, golire
f('Pune un stil de celulă din galeria Cell Styles (Good, Bad, Neutral, Calculation, Check Cell, Input, Output, Note…, Heading 1-4, Title, Total, 20%/40%/60%/Accent 1-6, Comma, Currency, Percent); Normal scoate stilul',
  'Stiluri', 'Pornire › Stiluri › Cell Styles › un stil', [87, 103, 314, 322, 383, 389, 465], 'NU',
  'căutat CellStylesGallery / stil: lipsesc; proba: „Cell Styles … nu e simulată” (' + PR + ' › cellstyles)', [ex('208-210', 'stilul Title pe A1')])
f('Golește doar formatele zonei (Clear › Clear Formats): valorile rămân, bordurile și îmbinările dispar; Clear All desface și îmbinările', 'Editare',
  'Pornire › Editare › Clear (radiera) › Clear Formats / Clear All', [312, 313, 701, 702], 'NU',
  'căutat ClearFormats / ClearMenu / Clear All: lipsesc; proba: „Clear … nu e simulată” (' + PR + ' › clear_menu); meniul de clic dreapta are doar Clear Contents (' + X + '3613)',
  nota='lista Clear o desenează excelx.js; excelx-formatare.js face reale Clear Formats și desfacerea îmbinărilor la Clear All')

# ---------------- Lățimi și înălțimi
f('Lățește / îngustează o coloană trăgând de linia din dreapta literei (pe telefon: atingi litera, apoi tragi de cercul ⇔); dacă sunt selectate mai multe coloane întregi, se schimbă toate; bula arată „Width: 12,5 (92 pixels)”',
  'Lățime și înălțime', 'tragere de marginea antetului coloanei (mouse sau deget)', [627, 637, 643, 644, 651, 579, 582], 'PARTIAL',
  X + '3431-3437 (antet_coloana_margine → tragere), ' + X + '3460-3464, ' + X + '3508-3517',
  [ex('118-121', 'fără #### pe C2:C4, valorile neschimbate'), ex('264-266', 'fără #### pe B2:B4, coloana B pornește îngustă'), AT + ' — fără #### pe C3:C6 (coloana C pornește la 6)'],
  lipsa='se schimbă doar coloana trasă, nu toate coloanele selectate (' + X + '3434: o singură coloană); fără cercul ⇔ pentru deget; bula cu lățimea: neverificată')
f('Potrivește singură lățimea coloanei după cel mai lung conținut, cu dublu-clic pe linia din dreapta literei (pe telefon: două atingeri pe cerc); cu mai multe coloane selectate, se potrivesc toate',
  'Lățime și înălțime', 'dublu-clic pe marginea antetului coloanei', [325, 327, 635, 654, 659], 'PARTIAL',
  X + '3663-3664 (dublu pe antet_coloana_margine → potriveste), ' + X + '3641-3659; proba 2: dublu-clic pe A o potrivește (' + 'probe_excel-a/formatare/rezultat_proba2.json)',
  [ex('125-128', 'numele din A2:A4 se văd întregi'), AT + ' — A3:A6 întregi, C3:C6 fără ####', CO + ' — A3:A5 întregi'],
  lipsa='se potrivește doar coloana pe care dai dublu-clic, nu toate coloanele selectate; coloana goală nu revine la lățimea standard (fara_efect)')
f('Face un rând mai înalt / mai scund trăgând de linia de sub numărul rândului (pe telefon: cercul ⇕); cu mai multe rânduri selectate, se schimbă toate', 'Lățime și înălțime',
  'tragere de marginea antetului rândului', [627, 645, 652, 583], 'NU',
  'căutat antet_rand_margine / inaltime: biblioteca nu are margine de tras la rânduri (proba: 0 ținte antet_rand_margine, 26 antet_coloana_margine) și nici înălțime de rând pusă de mână (INALT vine doar din Wrap Text, ' + X + '1083-1086)',
  [ex('130-132', 'rândul 1 cel puțin 25 de puncte')])
f('Potrivește singură înălțimea rândului cu dublu-clic pe linia de sub numărul lui', 'Lățime și înălțime', 'dublu-clic pe marginea antetului rândului',
  [329, 635, 656], 'NU', 'I.la.dublu tratează doar antet_coloana_margine (' + X + '3660-3673)')
f('Scrie lățimea coloanei într-o fereastră (Column Width…), din Pornire › Celule › Format sau din clic dreapta pe litera coloanei', 'Lățime și înălțime',
  'Format › Column Width… / clic dreapta pe literă › Column Width… → număr → OK', [358, 361, 397, 709], 'PARTIAL',
  X + '3621 (clic dreapta › Column Width...), ' + X + '2757-2766 (OK pune lățimea pe coloanele selectate)',
  lipsa='drumul prin Pornire › Celule › Format nu există (proba: „Format … nu e simulată”, ' + PR + ' › format_menu); merge doar din clic dreapta')
f('Scrie înălțimea rândului într-o fereastră (Row Height…), din Format sau din clic dreapta pe numărul rândului', 'Lățime și înălțime',
  'Format › Row Height… / clic dreapta pe număr › Row Height… → număr → OK', [358, 361, 396, 709], 'NU',
  'fereastra se deschide din clic dreapta (' + X + '3622), dar OK dă „Row Height … nu e simulată” și înălțimea nu se schimbă (' + PR + ' › row_height_dupa_ok; ' + X + '2905-2908)')
f('Potrivește lățimea coloanelor după celulele SELECTATE (Format › AutoFit Column Width)', 'Lățime și înălțime', 'Pornire › Celule › Format › AutoFit Column Width',
  [325, 400], 'NU', 'butonul Format (FormatCellsMenu) dă „nu e simulată” (' + PR + ' › format_menu); nu există listă pentru el în date/excel.json')
f('Readuce înălțimea automată a rândurilor selectate (Format › AutoFit Row Height)', 'Lățime și înălțime', 'Pornire › Celule › Format › AutoFit Row Height',
  [329, 399], 'NU', 'ca mai sus: meniul Format lipsește')
f('Schimbă lățimea standard a tuturor coloanelor nelățite de mână (Format › Default Width…)', 'Lățime și înălțime', 'Pornire › Celule › Format › Default Width… → număr → OK',
  [398], 'NU', 'căutat Default Width / StandardWidth: lipsește; meniul Format lipsește')

# ---------------- Afișarea în celulă
f('Vede #### când un număr cu format sau o dată nu încape în coloană; un număr General se scurtează întâi (mai puține zecimale, apoi 1E+06) și abia apoi #### (valoarea rămâne)',
  'Afișarea în celulă', 'îngustează coloana / scrie un număr lung', [131, 139, 214, 226], 'DA',
  X + '94-117 (inLatime: General se scurtează, altfel diezi); proba: data 27.09.2026 în coloana E de 64 px arată ######## (' + PR + ' › data_tastata_E5)',
  [ex('118-121', 'faraDiez C2:C4'), ex('264-266', 'faraDiez B2:B4'), AT + ' — faraDiez C3:C6'])
f('Textul lung trece peste celula vecină goală și se taie când vecina e plină', 'Afișarea în celulă', 'scrie un text mai lung decât coloana',
  [568, 574], 'DA', X + '1196-1202 (lh-ap-x-curge până la prima celulă plină)', [ex('125-128', 'vizibil A2:A4'), AT + ' — vizibil A3:A6', CO + ' — vizibil A3:A5'])
f('Excel lățește singur o coloană nelățită de mână când scrii o dată sau un număr care nu încape, ori când alegi un format mai lung (Accounting, Long Date)', 'Afișarea în celulă',
  'scrie în celulă / alege un format', [281, 283, 616, 619], 'PARTIAL',
  X + '1574-1578 (doar numere General tastate); proba: 123456789012 lățește E la 86 px, dar 27.09.2026 rămâne ######## fără lățire (' + PR + ' › numar_mare_E5, data_tastata_E5)',
  [ex('236-238', 'Long Date pe B1 și fără #### pe B1: coloana trebuie să se lățească singură')],
  lipsa='datele tastate și formatele alese nu lățesc coloana')
f('Bara de formule arată valoarea din spatele formatului: 7,125 sub 7,13, 12,5% sub 13%, data ca 27.09.2026', 'Afișarea în celulă', 'clic pe celula formatată, privește bara de formule',
  [162, 167, 586], 'PARTIAL', X + '589-596 (textEditare: datele ca dd.mm.yyyy, numerele cu general(v))',
  lipsa='sub un procent arată 0,125 în loc de 12,5% (textEditare nu știe de procent)', nota='întrebarea ' + PG + '240 (t:choice) se sprijină pe asta, fără foaie')

# ---------------- Selecție, anulare
f('Clic pe litera unei coloane care atinge o îmbinare selectează toată lățimea îmbinării (A1:D1 îmbinat → clic pe C selectează A:D), ca în Excel', 'Selecție',
  'clic pe litera coloanei / numărul rândului', [665, 671, 678, 682], 'NU', X + '3440-3446: clicul pe antet alege doar coloana / rândul lui, fără să țină cont de îmbinări')
f('Anulează orice formatare cu Ctrl+Z sau ↶ (inclusiv lățimi, îmbinări, borduri); fiecare comandă = un pas de Anulare', 'Anulare',
  'Ctrl+Z / ↶ după o comandă', [262, 265], 'DA', X + "1683 (schimba('format', …) pune pasul în istoric), " + X + '3841 (Ctrl+Z); proba 2: Ctrl+B apoi Ctrl+Z scoate aldinul',
  nota='înălțimile de rând nu există în bibliotecă, deci nici anularea lor')

out = {
 'fisiere_citite': [{'cale': 'lectii/_sim/excelx-formatare.js', 'linii': 845}, {'cale': 'lectii/viii/m1-l06/index.html', 'linii': 292}],
 'functii': F,
 'doar_afisate': [
  {'grup': 'Font / Aliniere (panglica)', 'exemple': ['Font (numele fontului)', 'Format Cells: Font / Alignment / Number (săgețile din colțul grupurilor)', 'Orientation', 'Text Direction', 'Decrease / Increase Indent'], 'dovada': V + '447'},
  {'grup': 'Liste ▾ cu rânduri fără efect', 'exemple': ['Underline ▾ (Double Underline)', 'More Colors…', 'Draw Border', 'More Borders…', 'More Number Formats…', 'New Cell Style…', 'Accounting ▾ (alte monede)'], 'dovada': V + '452'},
  {'grup': 'Meniul Pornire › Celule › Format', 'exemple': ['Hide & Unhide', 'Rename Sheet', 'Move or Copy Sheet…', 'Tab Color', 'Protect Sheet…', 'Lock Cell', 'Format Cells…'], 'dovada': V + '401'},
  {'grup': 'Tastatura', 'exemple': ['Ctrl+1 (Format Cells) → mesaj „nu are fereastra”'], 'dovada': V + '695'},
  {'grup': 'Clic dreapta pe antet (rânduri adăugate)', 'exemple': ['Formatare celule… (Format Cells…)', 'Ascundere (Hide)', 'Reafișare (Unhide)'], 'dovada': V + '708'},
  {'grup': 'Starea butoanelor din panglică', 'exemple': ['Bold / Italic / Underline / Wrap / Merge / alinieri apăsate', 'caseta Font Size și Number Format arată valoarea celulei active', 'pe telefon: panglica mărită, cu numele sub butoane'], 'dovada': V + '590'}],
 'nesigure': [
  'Bula „Width: … (… pixels)” la tragerea coloanei: în bibliotecă n-am verificat dacă apare (M.trageInfo, ' + X + '3463).',
  'Butonul Merge & Center din bibliotecă: clicul pe marginea lui dreaptă îmbină (n-am găsit o parte ▾ separată); poate partea ▾ lipsește din panglica desenată.',
  'Pentru coordonatorul excel-a (excelx.js): în bibliotecă Shift+clic pe litera altei coloane NU extinde selecția (proba 2: A apoi Shift+C → selecția C:C).',
  'Funcțiile „Format › …” le-am trecut NU pe drumul din meniul Format; rezultatul (lățimea) se poate obține uneori pe alt drum (clic dreapta, dublu-clic) — exercițiile verifică doar rezultatul.']
}
P = Path(r'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/paritate/probe_excel-a/parte_formatare.json')
P.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding='utf-8')
from collections import Counter
print(len(F), Counter(x['biblioteca'] for x in F), sum(x['ceruta_de_exercitiu'] for x in F))
