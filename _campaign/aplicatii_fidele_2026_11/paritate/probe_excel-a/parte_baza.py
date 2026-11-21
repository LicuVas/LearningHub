"""Partea „bază” a inventarului excel-a (scrisă de agentul principal): excelx.js (tipurile de date + ExcelPlus),
excelx-interfata.js, tip-foaie.js (evaluate: funcțiile de foaie una câte una), ui-panglica.js / panglica-excel.*,
simulatoarele din pagină (JocFormatare din jocuri/excel-viii și excel-antrenament-viii; copia ExcelPlus din m1-l04).
Probele: proba_tipuri.py, proba_forma_stergere.py, proba_functii.py (rezultatele .json lângă ele).
Scrie parte_baza.json."""
import json, pathlib

AICI = pathlib.Path(__file__).resolve().parent
X = "lectii/_sim/excelx.js"
XI = "lectii/_sim/excelx-interfata.js"
TF = "jocuri/_motor/tip-foaie.js"
E = "aplicatii/excel.js"
UX = ["lectii/viii/m1-l02", "lectii/viii/m1-l05", "lectii/viii/m1-l06", "lectii/viii/m1-l07", "lectii/viii/m2-l08",
      "lectii/viii/m2-l09", "lectii/viii/m2-l10", "lectii/viii/m2-l11", "lectii/viii/m2-l12", "lectii/viii/m2-l13", "lectii/viii/m4-l23"]
UP = UX + ["lectii/viii/m1-l04 (copia ExcelPlus din pagină, index.html:54)"]
UF = ["toate paginile Excel (motorul formulelor al foii excelx / excel)", "jocuri/excel-antrenament-viii", "jocuri/excel-viii"]
M05, M04, M02 = "lectii/viii/m1-l05/index.html", "lectii/viii/m1-l04/index.html", "lectii/viii/m1-l02/index.html"

F = []


def f(functie, grup, gest, vechi, unde, ex, bib, dov, lipsa="", nota=""):
    F.append({"functie": functie, "grup": grup, "gest": gest, "vechi_dovada": vechi, "unde": unde,
              "ceruta_de_exercitiu": bool(ex), "exercitii": ex, "biblioteca": bib, "biblioteca_dovada": dov,
              "lipsa": lipsa, "nota": nota})


PT = "probe_excel-a/proba_tipuri.json"
PF = "probe_excel-a/proba_forma_stergere.json"
PN = "probe_excel-a/proba_functii.json"

# ---------------------------------------------------------------- tipurile de date (excelx.js, stratul Tipuri)
G = "Tipuri de date"
f("scrie un număr cu virgulă zecimală (7,5) și Excel îl ține ca număr, la dreapta", G, "clic pe celulă, scrie 7,5, Enter",
  [X + ":61"], UX, [M05 + ":149 (verifica.tip B2 numar 9.5 / 7.5)", M05 + ":231 (B3 numar 1.62)", M05 + ":218 (atelier)"],
  "DA", E + ":119 constanta(): ^[+-]?\\d+(,\\d+)?$ → număr; proba: 7,5 → valoare 7.5, text „7,5” (" + PT + ")")
f("scrie o zecimală cu punct (7.5) și Excel face din ea data 07.mai (zi.lună din anul curent)", G, "scrie 7.5, Enter",
  [X + ":71", X + ":72"], UX, [M05 + ":154 (întrebare: ce apare)", M05 + ":169 (fă greșeala și repar-o)"],
  "DA", E + ":121-122 constanta() dd.mm → format dd.mmm; proba: 7.5 → 46149, „07.mai” (" + PT + ")",
  nota="bara de formule după Enter (07.05.2026) e în parte_formatare (FMT043)")
f("scrie lună.an (6.75) și Excel face din el data iun.75", G, "scrie 6.75, Enter", [X + ":73"], UX, [],
  "NU", E + ":116-126 constanta() are doar zi.lună și zi.lună.an; proba: „6.75” rămâne text (" + PT + ")")
f("scrie un număr cu punct de mii (1.250) și Excel îl ia drept 1250, cu separator de mii", G, "scrie 1.250, Enter", [X + ":76", X + ":51"], UX, [],
  "NU", E + ":116-126 fără regulă de mii; proba: „1.250” rămâne text (" + PT + ")")
f("scrie o sumă cu „lei” (12 lei) și Excel o ține ca număr cu formatul lei (negativ cu roșu)", G, "scrie 12 lei, Enter",
  [X + ":78", X + ":79", X + ":121"], UX, [], "NU", E + ":116-126; proba: „12 lei” rămâne text (" + PT + ")",
  nota="FRM011 (parte_formule) e consecința în calcule: =A2*2 pe „150 lei” dă #VALUE!")
f("scrie un procent (10%) și Excel îl ține ca 0,1 cu formatul procent", G, "scrie 10%, Enter", [X + ":77"], UX, [],
  "NU", E + ":116-126 fără %; proba: „10%” rămâne text (" + PT + ")", nota="Percent Style din panglică există (FMT025)")
f("scrie o dată întreagă (27.09.2026, 27/09/2026, 27-09-2026, 2026-09-27) și Excel o recunoaște drept dată", G, "scrie data, Enter",
  [X + ":65", X + ":67", X + ":69"], UX, [M05 + ":129 (B4 data 05.10.2026)", M05 + ":218 (atelier: 12.10.2026, 13.10.2026)", M05 + ":233 (C2 data 12.10.2026)"],
  "PARTIAL", E + ":123-124 constanta() dd.mm.yyyy → format dd.mm.yyyy; proba: 27.09.2026 → 46292 (" + PT + ")",
  lipsa="(1) doar forma cu puncte: 27/09/2026, 27-09-2026, 2026-09-27 și data cu oră rămân text; (2) data cu puncte apare ######## în coloana de 64 px (coloana nu se lățește la dată; vezi FMT042) — vechiul arăta 05.10.2026",
  nota="lățirea automată la dată: de verificat pe Excel real")
f("scrie o dată cu luna în cuvinte (12 octombrie 2026, oct 2026) și Excel o recunoaște drept dată", G, "scrie 12 octombrie 2026, Enter",
  [X + ":85", X + ":86"], UX, [M05 + ":233 (C2 data 12.10.2026: întrebarea dă data în cuvinte)"],
  "NU", E + ":116-126; proba: „12 octombrie 2026” rămâne text (" + PT + ")")
f("scrie o oră (12:30, 12:30:15) și Excel o ține ca oră", G, "scrie 12:30, Enter", [X + ":83"], UX, [],
  "NU", E + ":116-126 fără ore; proba: „12:30” rămâne text (" + PT + ")")
f("scrie un cod cu zerouri în față cu apostrof ('007) și rămâne text „007”, cu triunghiul verde (Number Stored as Text)", G,
  "scrie '007, Enter", [X + ":57", X + ":147", X + ":149"], UX,
  [M05 + ":193 (B2 text 007)", M05 + ":198 (B2 text 0042)", M05 + ":235 (B2 text 07)"],
  "PARTIAL", E + ":117 constanta() ' → {v, ap:true}; :595 bara de formule arată '007; proba: „007” text (" + PT + ")",
  lipsa="triunghiul verde din colț și sfatul „Number Stored as Text” lipsesc (căutat: triunghi, 1E8C45, Stored as Text, .ap în desen)")
f("scrie 007 fără apostrof și Excel face din el numărul 7 (pierde zerourile)", G, "scrie 007, Enter", [X + ":49", X + ":61"], UX,
  [M05 + ":200 (întrebare: ce apare)"], "DA", E + ":119; proba: 007 → 7 (" + PT + ")")
f("scrie TRUE / FALSE și Excel le ține ca valori logice, centrate", G, "scrie TRUE, Enter", [X + ":63", X + ":119"], UX, [],
  "DA", E + ":125 constanta() TRUE/FALSE; proba: TRUE → true, „TRUE” (" + PT + ")")
f("alte forme de număr recunoscute de Excel: 1,5E3 (științific), 1 1/2 (fracție), (5) = −5, € 5", G, "scrie forma, Enter",
  [X + ":82", X + ":84", X + ":62", X + ":81"], UX, [], "NU", E + ":116-126; proba: toate rămân text (" + PT + ")")
f("scrie text care începe cu cifre (7B, 12 elevi) și Excel îl ține ca text, la stânga", G, "scrie 7B, Enter", [X + ":87"], UX,
  [M05 + ":134 (întrebare: unde s-a așezat)"], "DA", E + ":126; proba: 7B, 12 elevi → text (" + PT + ")")
f("forma de dată pusă automat rămâne în celulă: 7,5 scris peste 07.mai arată 07.ian", G, "scrie 7.5, Enter, apoi 7,5 în aceeași celulă",
  [X + ":129", X + ":131", X + ":133"], UX, [M05 + ":176 (B2 numar 9.5, inainte: 9.5 apoi 9,5 → 09.ian)", M05 + ":169"],
  "PARTIAL", E + ":1568 forma (format_numar) rămâne; proba: 7,5 peste 07.mai → „06.ian” (" + PF + ")",
  lipsa="ziua greșită cu 1 sub 01.03.1900: biblioteca numără zilele de la 30.12.1899 fără 29.02.1900 (excel.js:40-41), deci 7,5 → 06.ian în loc de 07.ian, 8,5 → 07.ian în loc de 08.ian")
f("Delete golește doar conținutul: forma de dată rămâne (8.5, Delete, 8,5 → 08.ian)", G, "Delete pe celulă, apoi scrie din nou",
  [X + ":127", X + ":133"], UX, [M05 + ":237 (B2 numar 8.5, capcana Delete)"],
  "PARTIAL", E + ":1777-1782 golesteContinut() șterge doar f.cel; proba: forma dd.mmm rămâne (" + PF + ")",
  lipsa="aceeași zi greșită cu 1 (arată 07.ian în loc de 08.ian)")
f("Ctrl+Z (↶) desface scrierea și scoate și forma de dată pusă de ea", G, "Ctrl+Z de două ori", [X + ":131", X + ":133"], UX,
  [M05 + ":169 (B2 numar 7.5: repară cu Ctrl+Z)"], "DA",
  E + ":2192-2197 anuleaza() readuce foaia întreagă (cel + fmt); proba: după 2×Ctrl+Z, 7,5 → „7,5” (" + PT + ")")
f("Golire totală (Clear All) golește conținutul și scoate forma celulei", G, "Pornire › Editare › Clear ▾ › Clear All",
  [X + ":474", X + ":307"], UX, [M05 + ":176 (repar-o cu Golire totală; soluția o cere)"],
  "NU", E + ":2964-2999 apasa(): ClearMenu nu e în switch → I.nesimulat; proba: „Clear … nu e simulată” (" + PF + ")")
f("copierea și lipirea duc și forma celulei (data rămâne dată în locul nou)", G, "Ctrl+C, Ctrl+V", [X + ":232", X + ":242"], UP, [],
  "DA", E + ":2092 copiaza() ia f.fmt; :2112 lipeste() pune fmt")
f("scrie apostroful cu tastatura cu „taste moarte” (US-International: ' + 0 → '0)", G, "tasta ' apoi cifra", [X + ":223", X + ":229"], UX, [],
  "DA", "aplicatii/aplicatii.js:462-470 textul compus (fără keydown) intră prin caseta ascunsă I.intrare → I.la.text (excel.js:3863)",
  nota="neprobat cu tastatură reală (headless nu are taste moarte)")
f("pe telefon: butonul „' apostrof drept” pune apostroful drept la începutul barei de formule", G, "atingi butonul de sub foaie",
  [X + ":283", X + ":289"], UX, [], "NU", "căutat în excel.js / aplicatii.js: apostrof, xt-apos, buton sub foaie — nimic",
  nota="ajutor al paginii vechi pentru tastaturile care pun ’")
f("Ctrl+Z / Ctrl+Y ajung la foaie oriunde ar fi focusul (după un clic pe butoanele lecției)", "Anulare", "Ctrl+Z cu focusul în pagină",
  [X + ":265", X + ":268"], UX, [], "NU", "aplicatii.js:400-470 ascultă tastele doar în rădăcina aplicației; căutat: document.addEventListener('keydown')",
  nota="ține și de pagina lecției")

# ---------------------------------------------------------------- ExcelPlus (excelx.js + copia din m1-l04)
G = "Editare (copiere, mutare, ștergere)"
f("clic dreapta pe celulă (sau pe zonă) deschide meniul: Cut, Copy, Paste, Insert…, Delete…, Clear Contents, Format Cells…", G,
  "clic dreapta pe celulă", [X + ":567", X + ":570", X + ":459"], UP, [M04 + ":531 (doarMouse: copiere din meniu)", M04 + ":594 (Delete… din meniu)"],
  "DA", E + ":3674-3682 I.la.dreapta → meniuContextual('meniu_contextual.celula'); zona rămâne aleasă dacă clicul e în ea",
  nota="acțiunile din meniu sunt funcțiile de mai jos")
f("clic dreapta pe numărul rândului / litera coloanei deschide meniul lor (Cut, Copy, Paste, Insert, Delete, Clear Contents)", G,
  "clic dreapta pe antet", [X + ":571", X + ":574", X + ":463"], UP, [M04 + ":587 (rândul lui Bogdan)", M04 + ":591 (coloana Absențe)"],
  "DA", E + ":3685-3694 meniuContextual('meniu_contextual.antet_rand' / 'antet_coloana'); antetul ales dacă nu era")
f("copiază din meniul de clic dreapta sau cu butonul Copy din Pornire", G, "clic dreapta › Copy / Pornire › Copy",
  [X + ":460", X + ":594"], UP, [M04 + ":531 (doarMouse)"], "DA", E + ":3611 meniu Copy → copiaza(false); :2976 apasa Copy")
f("decupează din meniul de clic dreapta sau cu butonul Cut", G, "clic dreapta › Cut / Pornire › Cut", [X + ":460", X + ":594"], UP,
  [M04 + ":546 (mută A1:B2 în C3)", M04 + ":550", M04 + ":636"], "DA", E + ":3610 meniu Cut → copiaza(true); :2977 apasa Cut")
f("lipește din meniu (Paste) sau din Pornire: planșeta lipește, „Paste ▾” deschide lista; Paste e gri cât nu e nimic copiat", G,
  "clic dreapta › Paste / Pornire › Paste", [X + ":458", X + ":593", X + ":534"], UP, [M04 + ":531 (doarMouse)"],
  "PARTIAL", E + ":3612 meniu Paste → lipeste(); :2978 apasa Paste",
  lipsa="Paste ▾ (PasteMenu_Dropdown) și Copy ▾ dau „nu e simulată” (proba " + PF + "); Paste nu se face gri când nu e nimic copiat (excel.js:1382-1387 nu-l atinge)")
f("golește celulele din meniul de clic dreapta (Clear Contents)", G, "clic dreapta › Clear Contents", [X + ":462", X + ":423"], UP,
  [M04 + ":568 (golește C3)", M04 + ":639"], "DA", E + ":3613 → golesteContinut() :1777")
f("clic pe numărul rândului / litera coloanei = tot rândul / toată coloana", "Selecție", "clic pe antet",
  [X + ":497", X + ":499", X + ":557", "jocuri/excel-viii/index.html:86"], UP + ["jocuri/excel-viii (JocFormatare, index.html:86-87)", "jocuri/excel-antrenament-viii (JocFormatare, index.html:89-90)"],
  [M04 + ":587"], "DA", E + ":3438-3447 josGrila: antet_coloana / antet_rand → zona întreagă")
f("clic pe colțul dintre litere și numere selectează toată foaia", "Selecție", "clic pe colț", [X + ":498"], UP, [],
  "DA", E + ":3439-3444 'selecteaza_tot'")
f("Shift+clic pe alt număr de rând / altă literă extinde selecția la mai multe rânduri / coloane", "Selecție", "clic pe 2, Shift+clic pe 4",
  [X + ":499", X + ":500"], UP, [], "NU", E + ":3441-3442 s.zone = [q] fără e.shiftKey; proba parte_formatare: A apoi Shift+C dă C:C",
  nota="tragerea pe antete extinde (ancora antet)")
f("șterge rânduri întregi (clic dreapta pe numărul rândului › Delete; rândurile de dedesubt urcă)", G,
  "clic dreapta pe 3 › Delete", [X + ":466", X + ":424"], UP,
  [M04 + ":587 (Bogdan scos din tabel)", M04 + ":617 (atelier: rigla)", M04 + ":639 (Cristi)"],
  "NU", E + ":3590-3620 'Delete' din meniul antetului cade pe I.nesimulat; proba: „Delete … nu e simulată”, A3 rămâne Bogdan (" + PF + ")")
f("șterge coloane întregi (clic dreapta pe litera coloanei › Delete; coloanele din dreapta vin la stânga)", G,
  "clic dreapta pe C › Delete", [X + ":466", X + ":427"], UP, [M04 + ":591 (coloana Absențe)"],
  "NU", E + ":3590-3620 același drum, I.nesimulat")
f("fereastra Ștergere (Delete…): Deplasare celule în sus (Shift cells up)", G, "clic dreapta › Delete… › Shift cells up › OK",
  [X + ":478", X + ":490", X + ":430"], UP, [M04 + ":594 (capcana: C3 cu Shift cells up)"],
  "NU", E + ":3620 deschide dialog.CellsDelete, dar OK → implicitDialog() :2907-2908 I.nesimulat; proba: B2/B3 neschimbate (" + PF + ")")
f("fereastra Ștergere (Delete…): Deplasare celule la stânga, Rând întreg, Coloană întreagă", G, "Delete… › alegi › OK",
  [X + ":481", X + ":490", X + ":432"], UP, [], "NU", E + ":2907-2908 OK → I.nesimulat")
f("butonul Delete din Pornire (pictograma) scoate imediat celulele: rânduri / coloane întregi sau deplasare în sus / la stânga", G,
  "Pornire › Cells › Delete", [X + ":437", X + ":595"], UP, [], "NU",
  E + ":2999 CellsDeleteSmart nu e în apasa() → I.nesimulat; proba: „Delete Cells... nu e simulată” (" + PF + ")")
f("lista Delete ▾ din Pornire: Delete Cells…, Delete Sheet Rows, Delete Sheet Columns", G, "Pornire › Delete ▾",
  [X + ":468", X + ":470", X + ":471"], UP, [], "PARTIAL", E + ":2401-2420 listaStergere(); :3600 rândurile",
  lipsa="Delete Sheet Rows / Delete Sheet Columns → I.nesimulat; Delete Cells… deschide fereastra, dar OK nu face nimic",
  nota="Delete Sheet din listă e la foi (parte_foi)")
f("Golire (Clear ▾) din Pornire › Golire conținut (Clear Contents)", G, "Pornire › Editing › Clear ▾ › Clear Contents",
  [X + ":475", X + ":596"], UP, [], "NU", E + ":2999 ClearMenu → I.nesimulat (" + PF + ")")
f("lipirea pe o zonă care e un multiplu al celei copiate repetă copia (A1:A2 copiat pe K1:K4 → de două ori)", G, "copiezi, selectezi zona mai mare, Ctrl+V",
  [X + ":419"], UP, [], "NU", E + ":2099-2119 lipeste() lipește o dată, de la celula activă; proba: N6:N9 → doar N6:N7 (" + PT + ")")
f("lipirea pe o zonă de altă mărime: Excel nu lipește și spune că zonele nu au aceeași mărime și formă", G, "copiezi 2 celule, selectezi 3, Ctrl+V",
  [X + ":420"], ["lectii/viii/m1-l05", "lectii/viii/m1-l06", "lectii/viii/m2-l08"], [], "NU",
  E + ":2099-2119 lipește oricum de la celula activă, fără mesaj; proba (" + PT + ")",
  nota="copia din m1-l04 face aici o singură lipire din colțul stânga-sus")
f("Enter după copiere lipește în celula activă și oprește copierea", G, "Ctrl+C, clic pe alt loc, Enter", [X + ":580"], UP, [],
  "NU", E + ":3810 Enter doar mută celula; proba: L6 goală (" + PT + ")")
f("Esc sau golirea (Delete) opresc copierea (dispare marginea punctată)", G, "Esc / Delete după Ctrl+C", [X + ":407", X + ":581"], UP, [],
  "PARTIAL", E + ":3812 Esc → M.clip = null", lipsa="Delete (golesteContinut, :1777) nu oprește copierea")
f("Backspace pe o zonă golește doar celula activă și intră în scriere", G, "selectezi K6:K7, Backspace", [X + ":582"], UP, [],
  "DA", E + ":3808 porneste(activa, '', 'Enter'); proba: K6 golită, K7 rămâne (" + PT + ")")
f("pe telefon: tragerea cu degetul peste celule selectează o zonă", "Selecție", "tragi cu degetul", [X + ":559", X + ":562"], UP, [],
  "NU", E + ":3395-3406 atingerea pe grilă e amânată (ancora = null), deci mișcarea nu extinde; :3527 atingerea scurtă alege celula",
  nota="neprobat pe telefon real")
f("pe telefon: atingerea lungă deschide meniul de clic dreapta", G, "ții degetul pe celulă", [X + ":567", X + ":610"], UP, [],
  "DA", "aplicatii/aplicatii.js:405-410 contextmenu → I.la.dreapta (excel.js:3675)", nota="Android trimite contextmenu la atingerea lungă; iOS nu (neprobat)")
f("Ctrl+- șterge: rânduri / coloane întregi direct, altfel fereastra Delete", G, "Ctrl+-", [X + ":584", X + ":585"], UP, [],
  "NU", E + ":3716-3870 I.la.tasta fără Ctrl+-; proba: nici fereastră, nici schimbare (" + PT + ")")
f("Shift+Spațiu selectează tot rândul celulei active", "Selecție", "Shift+Spațiu", [X + ":586", X + ":587"], UP, [], "NU",
  E + ":3716-3870 fără Shift+Spațiu; proba: selecția rămâne B8 (" + PT + ")")
f("Ctrl+Spațiu selectează toată coloana celulei active", "Selecție", "Ctrl+Spațiu", [X + ":586", X + ":587"], UP, [], "NU",
  E + ":3716-3870 fără Ctrl+Spațiu; proba: selecția rămâne B8 (" + PT + ")")
f("tasta Meniu sau Shift+F10 deschide meniul de clic dreapta al celulei", G, "Shift+F10", [X + ":583"], UP, [], "NU",
  E + ":3716-3870; proba: niciun meniu (" + PT + ")", nota="meniul filei cu Shift+F10: FOI030")
f("caseta de nume: scrii o adresă (B2, H15) sau o zonă (B2:C4) și Enter te duce acolo / o selectează", "Navigare",
  "clic în caseta de nume, scrii H15, Enter", [X + ":503", X + ":510", X + ":525"], UP, [M02 + ":195 (activa H15)"],
  "DA", E + ":3721 zonaDin(inNume.value) → selecția + vedeCelula; proba: H15 și B2:C4 (" + PT + ")")

# ---------------------------------------------------------------- interfața (excelx-interfata.js, m1-l02)
G = "Interfață"
U2 = ["lectii/viii/m1-l02"]
f("clic pe fila altei foi în timp ce scrii confirmă ce ai scris și trece pe foaie", "Foi", "scrii în E3, clic pe fila Orar",
  [XI + ":115", XI + ":118"], U2, [], "DA", E + ":2215 alegeFoaia(): if (M.edit && !confirma())")
f("Anularea / Refacerea țin tot registrul: anularea unei scrieri de pe altă foaie te duce întâi pe foaia aceea", "Anulare",
  "Ctrl+Z / ↶ după ce ai schimbat foaia", [XI + ":124", XI + ":126", XI + ":225"], U2, [], "DA",
  E + ":2192-2203 anuleaza()/reface() readuc M.foi și M.fi (foaia activă)")
f("mărește / micșorează foaia cu butoanele + și − ale zoom-ului (câte 10 %)", G, "clic pe + de două ori", [XI + ":132", XI + ":212"], U2,
  [M02 + ":118 (verifica.zoom 120)"], "DA", E + ":3699-3701 zoomClic Zoom In/Out ±10; proba: 100 → 120 (" + PF + ")",
  nota="vechiul urca la următorul multiplu de 10 (112 → 120); biblioteca +10 (112 → 122) — contează doar după glisor; stare() nu are zoom-ul")
f("fiecare foaie își ține zoom-ul ei (Excursie 120 %, Note 100 %)", G, "+ pe o foaie, apoi altă foaie", [XI + ":119", XI + ":122"], U2, [],
  "NU", E + ":3700 M.zoom e unul pe registru; proba: foaia nouă are tot 120 % (" + PF + ")")
f("Enter după un șir de Tab-uri te duce pe rândul următor, în coloana de pornire", "Navigare", "A5 Elev ⇥ Nota ⇥ Clasa ↵ → A6",
  [XI + ":227", XI + ":231", XI + ":234"], U2 + ["lectii/viii/m4-l23"],
  [M02 + ":170 (valori A1:B2)", M02 + ":218 (Orar)", M02 + ":239 (Radu, activa)", "lectii/viii/m4-l23/index.html:172 (B1…F1 cu Tab)"],
  "DA", E + ":3744-3760 M.tabCol; :3810-3811; proba: H10 x ⇥ y ⇥ z ↵ → H11 (" + PT + ")")
f("clicul pe celula ACTIVĂ nu rupe șirul Tab–Enter (drumul de pe telefon); clicul pe altă celulă îl rupe", "Navigare",
  "x ⇥, clic pe celula activă, y ↵", [XI + ":205", XI + ":207"], U2, [], "PARTIAL", E + ":3419-3425 josGrila",
  lipsa="în modul Gata (Ready) orice clic pe celulă, și pe cea activă, pune M.tabCol = null (:3425): pe telefon (atingi celula, apoi bara) Enter nu mai întoarce la coloana de pornire")
f("↶ apăsat cât scrii renunță la ce scrii (ca Esc); celula scrisă înainte rămâne", "Anulare", "scrii abc, clic pe ↶", [XI + ":217", XI + ":218"], U2, [],
  "DA", E + ":2961 apasa() confirmă întâi, apoi :2980 Undo → anuleaza() desface tocmai scrierea", nota="același rezultat pe foaie, pe alt drum")
f("deschide o filă a panglicii (Home, Insert, Formulas, Data, View…)", G, "clic pe numele filei",
  ["jocuri/_motor/ui-panglica.js:47", XI + ":100"], U2 + UX[1:], [M02 + ":132 (fila Data)", M02 + ":135 (Insert, apoi Home)", M02 + ":235 (View)"],
  "DA", E + ":1014-1020 activeazaFila()", nota="stare() nu are fila activă: o lecție o citește din ecran sau din evenimente")
f("atinge un loc al ferestrei (caseta de nume, bara de formule, o filă, un grup al panglicii, fila unei foi, bara de stare, zoom-ul, o literă, un număr, o celulă) și exercițiul îl recunoaște", G,
  "clic pe locul cerut", [XI + ":153", XI + ":169", XI + ":206"], U2,
  [M02 + ":113 (unde caseta)", M02 + ":116 și :233 (unde bara)", M02 + ":135 (unde grup:Number)"], "DA",
  "aplicatii/aplicatii.js:199-212 emite() trimite ținta fiecărui gest (data-lh-tinta: camp:Name Box, bara_formule, fila:…, panglica:Home/Number/…, fila_foii:…, zoom, antet_…, celula:…); L.asculta")
f("pe telefon: tastele Tab, Enter, săgețile și Esc sunt butoane sub foaie (merg și în caseta de nume)", G, "atingi butonul Tab ⇥",
  [XI + ":239", XI + ":247"], U2, [], "NU", "căutat în excel.js / aplicatii.js: taste pe ecran, Tab ⇥ — nimic (doar tastatura telefonului, fără Tab)")

# ---------------------------------------------------------------- formulele: tip-foaie.js (evaluate), toate paginile
G = "Formule"
JA = "jocuri/excel-antrenament-viii/index.html"
JV = "jocuri/excel-viii/index.html"
f("scrie o formulă (începe cu =) în bara de formule sau în celulă, o confirmă cu Enter (↵) și celula arată rezultatul", G,
  "clic pe celulă, scrii =B2*C2, Enter", [TF + ":204", TF + ":222", TF + ":225"], UF,
  ["t:'foaie' din " + JA + ":194, :231, :238, :248, :283, :288, :298, :317 (rezultat = formula de referință, și pe date schimbate)",
   "t:'foaie' din " + JV + ":552, :571, :646, :656, :661, :791, :801"],
  "DA", E + ":1553-1583 confirma(): laForma + f.cel = {f}; :342 valoare()", nota="butonul ↵ de lângă bară: Enter")
f("operațiile + − * / în formule, cu ordinea lor și paranteze", G, "=B2*C2-B3/2", [TF + ":76", TF + ":77", TF + ":89"], UF,
  ["t:'foaie' din " + JA + " și " + JV], "DA", E + ":183-189 arbore(); :380-389 aritm(); proba =B2*C2-B3/2 → 86,5 (" + PN + ")")
f("puterea cu ^ (2^3 = 8; −2^2 = 4, ca în Excel)", G, "=2^3", [TF + ":79"], UF, [], "DA", E + ":187-188; proba 8 și 4 (" + PN + ")")
f("procentul în formulă (=10% → 0,1)", G, "=10%", [TF + ":80"], UF, [], "DA", E + ":189 proc(); proba 0,1 (" + PN + ")")
f("alipirea textelor cu & (=A2&\" \"&B2 → Ana 9; =(1&2)+3 → 15)", G, "=A2&\" \"&B2", [TF + ":75", TF + ":61"], UF, [], "DA",
  E + ":184, :503; proba „Ana 9” și 15 (" + PN + ")")
f("comparațiile = <> < > <= >= dau TRUE / FALSE (text < număr < logic, ca Excel)", G, "=B2>B3", [TF + ":67", TF + ":73"], UF, [], "DA",
  E + ":183 comp(); :473 compara(); proba TRUE (" + PN + ")")
f("referințele cu $ rămân pe loc când formula e trasă / copiată, cele fără $ se mută (peste margine: #REF!)", G, "=B2*$B$7 tras în jos",
  [TF + ":11", TF + ":17", TF + ":196"], UF, [], "DA", E + ":245-258 mutaFormula(): $ păstrat, #REF! peste margine; :2136 copieCelula",
  nota="F4 și umplerea: parte_formule")
f("eroarea #DIV/0! la împărțirea la zero", G, "=B2/0", [TF + ":77"], UF, [], "DA", E + ":384, :509; proba (" + PN + ")")
f("eroarea #VALUE! când calculezi cu un text (=A2+1)", G, "=A2+1", [TF + ":62"], UF, [], "DA", E + ":463 num(); proba (" + PN + ")")
f("eroarea #NAME? la o funcție necunoscută sau scrisă în română (=SUMA(…), =MEDIE(…))", G, "=SUMA(B2:B4)", [TF + ":153", TF + ":8"], UF, [],
  "DA", E + ":520 if (!n.cunoscut) throw #NAME?; proba =SUMA, =FOO → #NAME? (" + PN + ")",
  nota="vechiul mai spunea numele englezesc (SUM) în mesajul exercițiului")
f("ghilimelele „ ” într-o formulă: Excel nu le recunoaște (#NAME?), doar pe cele drepte \"…\"", G, "=LEN(„Ana”)", [TF + ":38"], UF, [],
  "PARTIAL", E + ":135-167 jetoane() aruncă „caracter” → formula nu e primită (rămâne în editare); proba (" + PN + ")",
  lipsa="vechiul dă #NAME? în celulă, cu sfatul despre ghilimelele drepte; biblioteca nu primește formula, fără mesaj despre ghilimele",
  nota="ce face Excel real cu „ ”: de verificat")
FUNC = [
    ("SUM", "adună numerele (=SUM(B2:C4), =SUM(B2;C2;5)); textele dintr-o zonă nu contează", TF + ":146", E + ":527", "48, 24, 0", True),
    ("AVERAGE", "media aritmetică (=AVERAGE(B2:C4)); zonă fără numere → #DIV/0!", TF + ":147", E + ":531", "8 și #DIV/0!", True),
    ("MIN", "cel mai mic număr (=MIN(B2:C4)); zonă fără numere → 0", TF + ":149", E + ":532", "6 și 0", True),
    ("MAX", "cel mai mare număr (=MAX(B2:C4)); zonă fără numere → 0", TF + ":148", E + ":533", "10 și 0", True),
    ("COUNT", "numără celulele cu numere (=COUNT(A1:C4))", TF + ":134", E + ":535", "6", False),
    ("COUNTA", "numără celulele care nu sunt goale (=COUNTA(A1:C4))", TF + ":135", E + ":536", "12", False),
    ("COUNTBLANK", "numără celulele goale (=COUNTBLANK(D2:D4))", TF + ":118", E + ":537", "3", False),
    ("COUNTIF", "numără celulele care îndeplinesc un criteriu (\">=8\", \"ana\", cu * și ? pentru litere oarecare)", TF + ":136", E + ":538, :481 criteriu()", "4, 1 („B*”), 1 („ana”)", False),
    ("SUMIF", "adună după un criteriu, cu zona de adunat opțională (=SUMIF(B2:B4;\">7\";C2:C4))", TF + ":137", E + ":539-546", "16 și 17", False),
    ("AVERAGEIF", "media după un criteriu; niciuna potrivită → #DIV/0!", TF + ":143", E + ":539-546", "8,5 și #DIV/0!", False),
    ("ROUND", "rotunjește la k zecimale (=ROUND(10/3;2) → 3,33; −2,5 → −3)", TF + ":145", E + ":555-558", "3,33 și −3", False),
    ("ROUNDUP", "rotunjește în sus (=ROUNDUP(2,341;1) → 2,4)", TF + ":119", E + ":555-558", "2,4", False),
    ("ROUNDDOWN", "rotunjește în jos (=ROUNDDOWN(2,349;1) → 2,3)", TF + ":119", E + ":555-558", "2,3", False),
    ("INT", "partea întreagă (=INT(−2,5) → −3)", TF + ":121", E + ":551", "−3", False),
    ("ABS", "valoarea absolută (=ABS(−1) → 1)", TF + ":122", E + ":550", "1", False),
    ("SQRT", "rădăcina pătrată; număr negativ → #NUM!", TF + ":123", E + ":552", "4 și #NUM!", False),
    ("POWER", "puterea (=POWER(2;3) → 8)", TF + ":124", E + ":553", "8", False),
    ("MOD", "restul împărțirii (=MOD(7;3) → 1; =MOD(−7;3) → 2); la 0 → #DIV/0!", TF + ":125", E + ":554", "1, 2, #DIV/0!", False),
    ("LEN", "lungimea textului (=LEN(A3) → 6)", TF + ":126", E + ":560", "6", False),
    ("UPPER", "textul cu litere mari", TF + ":127", E + ":561", "ANA", False),
    ("LOWER", "textul cu litere mici", TF + ":128", E + ":562", "bogdan", False),
    ("TRIM", "scoate spațiile în plus", TF + ":129", E + ":564", "„a b”", False),
    ("LEFT", "primele n litere (fără n: una)", TF + ":130", E + ":565", "Bog și B", False),
    ("RIGHT", "ultimele n litere", TF + ":131", E + ":566", "an", False),
    ("MID", "n litere de la poziția p", TF + ":132", E + ":567", "ogd", False),
    ("CONCATENATE", "lipește texte (=CONCATENATE(A2;\" \";B2) → Ana 9)", TF + ":133", E + ":568", "Ana 9", False),
    ("CONCAT", "lipește texte (=CONCAT(A2;B2) → Ana9)", TF + ":133", E + ":568", "Ana9", False),
    ("AND", "TRUE dacă toate condițiile sunt adevărate", TF + ":115", E + ":548", "TRUE", False),
    ("OR", "TRUE dacă măcar o condiție e adevărată", TF + ":116", E + ":548", "TRUE", False),
    ("NOT", "întoarce condiția; pe un text → #VALUE!", TF + ":117", E + ":549", "FALSE și #VALUE!", False),
    ("IF", "alege între două rezultate după o condiție (=IF(B2>=5;\"admis\";\"respins\")); fără al treilea → FALSE; condiție text → #VALUE!", TF + ":150", E + ":521", "admis, FALSE, #VALUE!", True),
]
for nume, ce, v, b, rez, cer in FUNC:
    ex = []
    if cer:
        ex = ["t:'foaie' din " + JA + " / " + JV + " (formula de referință folosește " + nume + ")",
              "lecțiile m2-l08 / m2-l09 / m2-l12 / m2-l13 (prin foaia excelx; detaliile exercițiilor: parte_formule și excel-b)"]
    f(f"funcția {nume}: {ce}", "Funcții", f"=" + nume + "(…) scris în celulă", [v], UF, ex, "DA",
      b + f" — proba pe aceleași date, vechi (evaluate) = nou: {rez} (" + PN + ")")

F = [dict({"id": f"excel-a-BAZ{i:03d}"}, **x) for i, x in enumerate(F, start=1)]
OUT = {
    "fisiere_citite": [
        {"cale": X, "linii": 627}, {"cale": XI, "linii": 322}, {"cale": TF, "linii": 272},
        {"cale": "jocuri/_motor/ui-panglica.js", "linii": 107}, {"cale": "jocuri/_motor/panglica-excel.js", "linii": 2},
        {"cale": "jocuri/_motor/panglica-excel.json", "linii": 3795},
        {"cale": "lectii/viii/m1-l04/index.html", "linii": 652}, {"cale": "jocuri/excel-antrenament-viii/index.html", "linii": 374},
        {"cale": "jocuri/excel-viii/index.html", "linii": 847},
        {"cale": "lectii/viii/m1-l02/index.html", "linii": 0}, {"cale": "lectii/viii/m1-l05/index.html", "linii": 0},
        {"cale": "lectii/viii/m4-l23/index.html", "linii": 0}],
    "functii": F,
    "doar_afisate": [
        {"grup": "Editare", "exemple": ["Inserare… (Insert…) din meniul celulei și al antetului", "Formatare celule… (Format Cells…)", "Golire formate (Clear Formats)", "Golire comentarii și note", "Lipire specială… (Paste Special…)", "Copiere ca imagine… (Copy as Picture…)", "Ștergere foaie (din lista Delete)"],
         "dovada": X + ":461"},
        {"grup": "Selecție", "exemple": ["Ctrl+clic pe celulă: doar o notă (foaia ține o singură zonă)"], "dovada": X + ":558"},
        {"grup": "Navigare", "exemple": ["un cuvânt sau o adresă greșită în caseta de nume: doar o notă (în Excel cuvântul devine nume)"], "dovada": X + ":512"},
        {"grup": "Foi / Interfață", "exemple": ["butonul + (foaie nouă)", "dublu-clic pe filă", "clic dreapta pe filă", "fila File", "clic pe procentul zoom-ului", "glisorul zoom-ului"],
         "dovada": XI + ":210"},
        {"grup": "Panglica", "exemple": ["toate butoanele fără legătură primesc data-nesim și spun că nu sunt simulate: 7 file, 200 de butoane (Home 47, Insert 34, Page Layout 27, Formulas 24, Data 31, Review 16, View 21)"],
         "dovada": "jocuri/_motor/ui-panglica.js:27"},
        {"grup": "Afișare", "exemple": ["eticheta „Setări românești” și butoanele RO/EN ascunse", "textul care nu încape e tăiat fără „…”", "notele de telefon de deasupra foii", "eticheta Delete/Insert corectată pe panglică"],
         "dovada": X + ":141"},
        {"grup": "Exercițiu (nu e o funcție a aplicației)", "exemple": ["testele numite ale atelierului (valori / gol / fără / tip) bifate pe loc", "verificarea pe TIP (număr / text / dată) cu mesajul greșelii", "doarMouse: copierea și lipirea cerute din meniu sau panglică", "inainte: pași făcuți în foaie înainte de exercițiu", "start: celula activă de la început"],
         "dovada": X + ":602"},
    ],
    "nesigure": [
        "Tasta moartă (US-International) pentru apostrof: biblioteca o primește probabil prin caseta ascunsă, dar n-am probat cu o tastatură reală.",
        "Data cu puncte (27.09.2026) apare ######## în coloana de 64 px: n-am verificat dacă Excel real lățește coloana la dată (vechiul arăta data întreagă).",
        "Tragerea și atingerea lungă pe telefon le-am judecat doar din cod (atingerea pe grilă e amânată), fără un telefon real.",
        "Ghilimelele „ ” în formulă: vechiul dă #NAME?, iar biblioteca nu primește formula; nu știu ce face Excel real.",
        "Testele numite ale atelierului (m1-l04:600/617, m4-l23:172) sunt ale lecției, nu ale aplicației: lecția nouă le poate face din stare(); le-am trecut la doar_afisate.",
    ],
}
json.dump(OUT, open(AICI / "parte_baza.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("parte_baza.json:", len(F), "funcții")
