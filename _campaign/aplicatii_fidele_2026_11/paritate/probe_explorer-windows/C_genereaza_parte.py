# Scrie parte_C.json (inventarul de paritate explorer-windows, partea C). Rulare: python C_genereaza_parte.py
import json, os

AICI = os.path.dirname(os.path.abspath(__file__))
DW = "lectii/_sim/desktop-windows.js"
SP = "lectii/_sim/siguranta-pc.js"
L08 = "lectii/v/m2-l08/index.html"
L11 = "lectii/vi/m2-l11/index.html"
L16 = "lectii/vi/m3-l16/index.html"
PW = "probe_explorer-windows/C_proba_windows.json"
PE = "probe_explorer-windows/C_proba_explorer.json"

F = []
def f(aplicatie, cheie, functie, grup, gest, vechi, unde, exercitii, bib, bib_dov, lipsa="", nota=""):
    F.append({"id": "C-%03d" % (len(F) + 1), "aplicatie": aplicatie, "cheie": cheie, "functie": functie, "grup": grup, "gest": gest,
              "vechi_dovada": vechi, "unde": unde, "ceruta_de_exercitiu": bool(exercitii), "exercitii": exercitii,
              "biblioteca": bib, "biblioteca_dovada": bib_dov, "lipsa": lipsa, "nota": nota})

# ------------------------------------------------------------------ Windows: Start
f("windows", "start_deschide", "Deschide și închide meniul Start.", "Start",
  "clic pe butonul Start (patru pătrate) din bara de activități; încă un clic sau Esc îl închide",
  [DW + ":221", DW + ":440", DW + ":438"], ["lectii/v/m2-l08"],
  [L08 + ":192 t:'desktop' — testul 'pornit' prin:'start' (Paint pornit din Start)",
   L08 + ":281 atelier — testul 'pornit' paint prin:'start'", L08 + ":297 inca — testul 'pornit' calc prin:'start'"],
  "DA", "aplicatii/windows.js:869 — clicul pe Start comută meniul (seteazaStart); :966 tasta Windows face la fel; :970 Esc îl închide",
  nota="Biblioteca are în plus tasta Windows (deschide la ridicarea tastei, :792).")
f("windows", "start_porneste_aplicatie", "Pornește o aplicație din meniul Start, cu clic pe ea (Calculator, Paint, Ceas, Setări).", "Start",
  "Start, apoi clic pe dala aplicației",
  [DW + ":444", DW + ":223"], ["lectii/v/m2-l08"],
  [L08 + ":192 t:'desktop' — testul 'pornit' app:'paint' prin:'start' (jurnalul ține drumul: via 'start')",
   L08 + ":281 atelier — 'pornit' paint prin:'start'", L08 + ":297 inca — 'pornit' calc prin:'start'"],
  "PARTIAL", "aplicatii/windows.js:891 — rezultatul căutării pornește aplicația (pornire, :466); :473 Paint / Calculator = fereastră generică cu titlu și buton în bară; :894 clicul pe o dală (Setări, Ceas, celelalte) = I.nesimulat (probat: " + PW + " › dala_setari)",
  lipsa="Paint și Calculator nu sunt dale în Start (doar prin căutare: scrii „pai”, apoi Enter sau clic pe rezultat); dalele Ceas și Setări dau doar mesajul central, fără fereastră; o a doua pornire a aceleiași aplicații nu deschide a doua fereastră (:472).",
  nota="La pornire biblioteca arată și mesajul „…nu e simulată” (:477), dar fereastra apare și actiune = 'pornire_aplicatie'. Starea (§5) nu ține drumul pornirii: testul vechi 'pornit' prin:'start' se poate face doar din evenimente (tinta 'start:Paint' la clic pe rezultat sau activat 'start:Paint' la Enter; probat " + PW + " › ev_enter).")
f("windows", "start_cautare", "Scrie numele aplicației în caseta din Start și vede doar aplicațiile potrivite; Enter pornește prima.", "Start",
  "Start, apoi tastezi în caseta „Căutare” (început de cuvânt: „pai” → Paint); Enter",
  [DW + ":445", DW + ":446", DW + ":309"], ["lectii/v/m2-l08"], [],
  "DA", "aplicatii/windows.js:580 — tastarea cu Start deschis scrie în casetă; :461 cautaRez potrivește începutul cuvintelor; :608 Enter pornește rezultatul ales (probat: " + PW + " › cautare_rezultate = [\"Paint\"])",
  nota="Niciun test nu cere căutarea anume (testul 'pornit' prin:'start' o acceptă). Biblioteca are în plus Sus / Jos în rezultate (:600).")
f("windows", "start_alimentare_inchidere", "Oprește calculatorul: Start › Alimentare › Închidere (ecran negru), apoi îl pornește din nou.", "Start",
  "Start, clic pe Alimentare, clic pe Închidere; butonul „Pornește-l din nou”",
  [DW + ":448", DW + ":251", DW + ":450"], ["lectii/v/m2-l08"], [],
  "NU", "aplicatii/windows.js:894 — clicul pe Alimentare din Start = I.nesimulat (probat: " + PW + " › alimentare); aplicatii/date/windows.json:1774 — lipsuri: „meniul Alimentare (Oprire / Repornire), R18-3”",
  nota="Testul 'oprit' există în simulatorul vechi, dar nicio pagină de-a mea nu-l folosește.")
f("windows", "start_alimentare_repaus", "Pune calculatorul în repaus (Start › Alimentare › Repaus) și îl trezește.", "Start",
  "Start, Alimentare, Repaus; butonul „Trezește-l”",
  [DW + ":248", DW + ":252"], ["lectii/v/m2-l08"], [],
  "NU", "aplicatii/windows.js:894 — Alimentare = I.nesimulat; aplicatii/date/windows.json:1774 — lipsuri: meniul Alimentare")
f("windows", "start_alimentare_repornire", "Repornește calculatorul (Start › Alimentare › Repornire): toate ferestrele se închid.", "Start",
  "Start, Alimentare, Repornire",
  [DW + ":249", DW + ":250"], ["lectii/v/m2-l08"], [],
  "NU", "aplicatii/windows.js:894 — Alimentare = I.nesimulat; aplicatii/date/windows.json:1774 — lipsuri: „Oprire / Repornire”")

# ------------------------------------------------------------------ Windows: desktop
f("windows", "desktop_selectie_pictograma", "Alege o pictogramă de pe desktop (se evidențiază).", "Desktop",
  "un clic pe pictogramă; de la tastatură, Spațiu",
  [DW + ":459", DW + ":461"], ["lectii/v/m2-l08"], [],
  "DA", "aplicatii/windows.js:909 — clicul pe pictogramă o selectează (Ctrl+clic adaugă)")
f("windows", "desktop_porneste_pictograma", "Pornește aplicația cu dublu-clic pe pictograma ei de pe desktop (Calculator, Paint, Coș de reciclare).", "Desktop",
  "dublu-clic pe pictogramă (pe telefon două atingeri repezi); Enter pe pictograma aleasă",
  [DW + ":458", DW + ":460"], ["lectii/v/m2-l08"],
  [L08 + ":201 t:'desktop' — testul 'pornit' app:'calc' prin:'desktop'", L08 + ":282 atelier — 'pornit' calc prin:'desktop'"],
  "NU", "aplicatii/windows.js:918 — dublu-clic pe pictogramă = I.nesimulat; :985 Enter pe pictograma aleasă = I.nesimulat (probat: " + PW + " › dublu_pictograma, nicio fereastră nouă)",
  nota="Pictogramele se pot adăuga prin continut.pictograme (:137), dar nu pornesc nimic. Coșul de reciclare se deschide în Explorer doar în explorer.js (:820), nu din desktopul shell-ului.")
f("windows", "desktop_clic_gol", "Clic pe desktopul gol: pictograma aleasă se deselectează și nicio fereastră nu mai e „cea în care lucrezi”.", "Desktop",
  "clic pe o porțiune goală a desktopului",
  [DW + ":463", DW + ":464"], ["lectii/v/m2-l08"], [],
  "PARTIAL", "aplicatii/windows.js:913 — clicul pe desktop golește selecția pictogramelor",
  lipsa="Fereastra activă rămâne activă după clicul pe desktop (probat: " + PW + " › clic_desktop_gol: paint activa=true); în vechi niciuna nu mai e activă (faraActiv).",
  nota="Testul vechi 'activ' (" + L08 + ":249, :264, :298) pică dacă elevul a dat la urmă clic pe desktop; cu biblioteca, același gest lasă testul să treacă.")

# ------------------------------------------------------------------ Windows: ferestre
f("windows", "fereastra_minimizare", "Ascunde o fereastră cu butonul Minimizare (liniuța); rămâne pornită, cu butonul în bară.", "Ferestre",
  "clic pe Minimizare (—) din bara de titlu",
  [DW + ":225"], ["lectii/v/m2-l08"],
  [L08 + ":222 t:'desktop' — testul 'readus' (întâi Minimizare)", L08 + ":313 — testul 'minimizat' app:'calc'", L08 + ":285 atelier — 'readus' calc"],
  "DA", "aplicatii/windows.js:900 — Minimizare (minimizeaza, :297): stare 'min', activă devine următoarea")
f("windows", "fereastra_maximizare", "Face fereastra cât tot ecranul cu butonul Maximizare (pătratul).", "Ferestre",
  "clic pe Maximizare (□)",
  [DW + ":226", DW + ":217"], ["lectii/v/m2-l08"],
  [L08 + ":230 t:'desktop' — testul 'restaurat' (întâi maximizat)"],
  "DA", "aplicatii/windows.js:901 — Maximizare comută stare 'max' și activează fereastra (probat: " + PW + " › max_restabilire)")
f("windows", "fereastra_restabilire", "Readuce fereastra maximizată la mărimea și locul de dinainte cu butonul din mijloc, „Restabilire jos” (două pătrate).", "Ferestre",
  "clic pe butonul din mijloc al ferestrei maximizate",
  [DW + ":226", DW + ":218", DW + ":384"], ["lectii/v/m2-l08"],
  [L08 + ":230 t:'desktop' — testul 'restaurat' app:'calc'", L08 + ":295 inca — 'restaurat' app:'paint' (pornește maximizat)"],
  "PARTIAL", "aplicatii/windows.js:901 — al doilea clic pe butonul din mijloc readuce stare 'normal' cu aceleași x, y, w, h (probat: " + PW + " › max_restabilire); :273 butonul păstrează numele „Maximizare” și când fereastra e maximizată",
  lipsa="Butonul nu devine „Restabilire jos” (nume, sfat, pictograma cu două pătrate); evenimentul are actiune 'maximizare' și la readucere (:904).",
  nota="Un test ca 'restaurat' se face din evenimente cu inainte.stare='max' și dupa.stare='normal'. Pagina îi spune elevului „butonul Restabilire jos (cele două pătrate)”, pe care biblioteca nu-l desenează.")
f("windows", "fereastra_restabilire_dublu_clic", "Dublu-clic pe bara de titlu: maximizează fereastra; încă un dublu-clic o readuce la mărimea de dinainte.", "Ferestre",
  "dublu-clic pe bara de titlu",
  [DW + ":517", DW + ":238"], ["lectii/v/m2-l08"], [],
  "NU", "aplicatii/windows.js:919 — dublu-clicul pe bara de titlu întoarce null, nu schimbă nimic (probat: " + PW + " › dublu_titlu: stare rămâne 'normal')",
  nota="Testul 'restaurat' (" + L08 + ":230) o acceptă ca drum, dar nu o cere.")
f("windows", "fereastra_restabilire_tragere", "Trage o fereastră maximizată (sau lipită pe o jumătate) de bara de titlu: revine la mărimea de dinainte, sub deget.", "Ferestre",
  "apeși pe bara de titlu a ferestrei maximizate și tragi",
  [DW + ":498", DW + ":520"], ["lectii/v/m2-l08"], [],
  "NU", "aplicatii/windows.js:1011 — tragerea ferestrei pornește doar cu stare 'normal' (probat: " + PW + " › tragere_maximizata: rămâne 'max')",
  nota="Testul 'restaurat' de la " + L08 + ":295 o acceptă ca drum (mesajul vechi: „Dacă e cât tot ecranul, apasă întâi Restabilire jos”).")
f("windows", "fereastra_lipire_jumatate", "Trage fereastra până la marginea din stânga sau din dreapta: se lipește pe jumătate de ecran.", "Ferestre",
  "tragi de bara de titlu până atingi marginea stângă / dreaptă",
  [DW + ":524", DW + ":525"], ["lectii/v/m2-l08"], [],
  "NU", "aplicatii/windows.js:1039 — la ridicare fereastra doar se mută cu deplasarea (probat: " + PW + " › tragere_margine_stanga: x=-43, w=600 neschimbat)",
  nota="Testul 'mutat' zona:'stanga' (" + L08 + ":296) trece și cu lipirea, dar nu o cere.")
f("windows", "fereastra_maximizare_tragere_sus", "Trage fereastra de bara de titlu până la marginea de sus: se maximizează.", "Ferestre",
  "tragi de bara de titlu până sus",
  [DW + ":523"], ["lectii/v/m2-l08"], [],
  "NU", "aplicatii/windows.js:1039 — la ridicare doar x / y (y ≥ 0) se schimbă (probat: " + PW + " › tragere_sus: y=0, stare 'normal')")
f("windows", "fereastra_mutare", "Mută fereastra trăgând de bara ei de titlu.", "Ferestre",
  "apeși pe bara de titlu și tragi; vechi: și săgețile, cu focusul pe bara de titlu",
  [DW + ":474", DW + ":503", DW + ":477"], ["lectii/v/m2-l08"],
  [L08 + ":249 t:'desktop' — testul 'mutat' zona:'dreapta' (centrul ferestrei în dreapta)", L08 + ":283 atelier — 'mutat' calc dreapta",
   L08 + ":296 inca — 'mutat' paint zona:'stanga'"],
  "PARTIAL", "aplicatii/windows.js:1011 — apăsarea pe bara de titlu pornește tragerea; :1039 la ridicare x / y se mută și fereastra se activează (probat: " + PW + " › tragere_titlu: x 200 → 350)",
  lipsa="Mutarea de la tastatură (săgețile pe bara de titlu, în vechi; abatere declarată de vechi: în Windows se face cu Alt+Spațiu, Mutare).",
  nota="Zona ('dreapta' / 'stanga') se socotește din stare: x + w/2 față de lățimea rădăcinii (în px).")
f("windows", "fereastra_redimensionare", "Mărește sau micșorează fereastra trăgând de o margine sau de un colț.", "Ferestre",
  "tragi de marginea stângă / dreaptă / de jos / de sus, de colțurile ei sau de colțul cu dungi (dreapta jos); vechi: și săgețile pe colț",
  [DW + ":475", DW + ":511", DW + ":480"], ["lectii/v/m2-l08"],
  [L08 + ":257 t:'desktop' — testul 'micsorat' app:'paint' (aria cel puțin 20% mai mică)", L08 + ":284 atelier — 'marit' paint (cel puțin 20% mai mare, nu maximizat)"],
  "NU", "căutat în aplicatii/windows.js „redim|resize|margine|colț|rz|w =”: tragerea (jos, :1002-1014) știe doar pictograma, bara de titlu și desktopul; probat: " + PW + " › redimensionare (w / h rămân 600 / 400 după tragere de margine și de colț)")
f("windows", "fereastra_inchidere", "Închide o fereastră cu butonul Închidere (X).", "Ferestre",
  "clic pe Închidere (✕); în laboratorul siguranta-pc: ✕ pe File Explorer și pe Securitate Windows",
  [DW + ":227", SP + ":435", SP + ":436"], ["lectii/v/m2-l08", "lectii/vi/m2-l11"],
  [L08 + ":313 t:'desktop' — testul 'inchis' app:'paint'", L08 + ":280 atelier — 'inchis' app:'setari'"],
  "DA", "aplicatii/windows.js:902 — Închidere scoate fereastra (și Explorer-ul montat, inchideMontata :771) și activează următoarea (probat: " + PW + " › inchidere)")
f("windows", "fereastra_activare", "Aduce deasupra o fereastră acoperită, cu un clic pe ea (devine fereastra în care lucrezi).", "Ferestre",
  "clic oriunde pe fereastra acoperită (bara de titlu sau conținut)",
  [DW + ":467", DW + ":240"], ["lectii/v/m2-l08"],
  [L08 + ":249 t:'desktop' — testul 'activ' app:'calc'", L08 + ":264 — 'activ' calc", L08 + ":298 inca — 'activ' calc"],
  "DA", "aplicatii/windows.js:906 — clicul pe o fereastră neactivă o activează și o aduce deasupra (probat: " + PW + " › clic_pe_fereastra)")

# ------------------------------------------------------------------ Windows: bara de activități, ceas
f("windows", "bara_buton_aplicatie", "Clic pe butonul aplicației din bara de activități: fereastra ascunsă revine, cea activă se ascunde, cea acoperită vine deasupra.", "Bara de activități",
  "clic pe butonul aplicației din bară; în laboratorul siguranta-pc, butoanele Browser / File Explorer / Securitate Windows comută fereastra arătată",
  [DW + ":230", DW + ":234", DW + ":235", DW + ":236", SP + ":440"], ["lectii/v/m2-l08", "lectii/vi/m2-l11"],
  [L08 + ":222 t:'desktop' — testul 'readus' (readusă din bară)", L08 + ":264 — 'activ' calc, rezolvarea ['bara','calc']", L08 + ":285 atelier — 'readus' calc",
   L11 + ":196 atelier t:'laborator' — testele T_LAB (" + L11 + ":76 scanatInainte) cer trecerea în File Explorer din bară"],
  "DA", "aplicatii/windows.js:882 — fereastra min → restaurare, activă → minimizare, acoperită → activare (probat: " + PW + " › bara)",
  nota="Biblioteca are în plus „Afișați desktopul” (:886).")
f("windows", "bara_grup_ferestre", "Când o aplicație are mai multe ferestre, clicul pe butonul ei din bară arată lista lor; alegi una.", "Bara de activități",
  "clic pe butonul aplicației (cu cifra ferestrelor), apoi pe fereastra din listă",
  [DW + ":231", DW + ":454"], ["lectii/v/m2-l08"], [],
  "NU", "aplicatii/windows.js:880 — ia doar fereastra cea mai de sus a aplicației, fără listă (probat: " + PW + " › grup_bara: 2 ferestre Paint, nicio listă, una minimizată); :472 o a doua pornire nu deschide a doua fereastră")
f("windows", "bara_porneste_aplicatie_fixata", "Redeschide din bara de activități o fereastră închisă (în laborator: Browser, File Explorer).", "Bara de activități",
  "clic pe butonul ferestrei închise, marcat „(închis)”",
  [SP + ":438", SP + ":439"], ["lectii/vi/m2-l11"], [],
  "PARTIAL", "aplicatii/windows.js:878 — butonul Explorer fixat deschide Explorer-ul montat (probat: " + PE + " › explorer_montat); :879 celelalte fixate fără fereastră = I.nesimulat (probat: Google Chrome fixat → " + PE + " › chrome_din_bara)",
  lipsa="Browserul nu există în bibliotecă, deci nu se poate redeschide.")
f("windows", "ceas_citire", "Citește ora și data de pe ceasul din dreapta jos (ceasul merge singur).", "Bara de activități",
  "privești zona de notificare; în vechi scrii ora într-o casetă de sub ecran",
  [DW + ":416", DW + ":537", DW + ":280"], ["lectii/v/m2-l08"],
  [L08 + ":168 t:'desktop' — testul 'ceas' (ora scrisă = ora de pe ceas, ±1 min)"],
  "DA", "aplicatii/windows.js:383 — ceasul arată ora și data reale (ceasText, :311; probat: " + PW + " › ceas_clic.text); :1064 se redesenează la 30 s",
  nota="Caseta de răspuns e a simulatorului vechi (" + DW + ":421), nu a Windows-ului: cu biblioteca o pune lecția. În modul scenariu ceasul nu se mai actualizează (:1064).")
f("windows", "ceas_calendar", "Clic pe ceas deschide calendarul lunii, cu ziua de azi marcată.", "Bara de activități",
  "clic pe ceas; încă un clic sau Esc îl închide",
  [DW + ":452", DW + ":371"], ["lectii/v/m2-l08"], [],
  "NU", "aplicatii/windows.js:887 — clicul pe ceas = I.nesimulat (probat: " + PW + " › ceas_clic); aplicatii/date/windows.json:1776 — lipsuri: „calendarul de la ceas (windows.calendar), R18-3”")
f("windows", "calculator_calcul", "Socotește în fereastra Calculator: cifre, + − × ÷, = și C, cu rezultatul pe ecran.", "Aplicații",
  "clic pe tastele Calculatorului",
  [DW + ":472", DW + ":348"], ["lectii/v/m2-l08"], [],
  "NU", "aplicatii/windows.js:477 — Calculatorul e fereastră generică, cu corpul gol și mesajul central (probat: " + PW + " › calc_continut = \"\"); aplicatii/date/windows.json:373 — fereastra_generica")

# ------------------------------------------------------------------ Windows: browserul (siguranta-pc)
NU_BROWSER = "căutat în aplicatii/*.js și date/*.json „browser|Edge|Chrome|filă|fila|tab”: nu există aplicația browser (L._modul doar word, excel, powerpoint, explorer, windows); aplicatii/windows.js:879 — butonul Google Chrome fixat = I.nesimulat (probat: " + PE + " › chrome_din_bara)"
f("windows", "browser_comuta_fila", "Trece de la o filă a browserului la alta (se schimbă pagina și adresa).", "Browser",
  "clic pe filă; Enter sau Spațiu pe fila cu focus",
  [SP + ":414", SP + ":453"], ["lectii/vi/m2-l11", "lectii/vi/m3-l16"], [],
  "NU", NU_BROWSER)
f("windows", "browser_inchide_fila", "Închide fila cu pagina falsă cu ✕ de pe filă (ultima filă închisă închide și browserul).", "Browser",
  "clic pe ✕ de lângă numele filei",
  [SP + ":413", SP + ":297", SP + ":298"], ["lectii/vi/m2-l11", "lectii/vi/m3-l16"],
  [L11 + ":140 t:'fereastra' falsa:'premiu' — se rezolvă la închiderea filei false", L11 + ":147 t:'fereastra' falsa:'descarca'", L11 + ":218 t:'fereastra' falsa:'virus'",
   L16 + ":210 t:'fereastra' falsa:'virus'", L11 + ":75 T_LAB (atelier t:'laborator') — testul falsaInchisa"],
  "NU", NU_BROWSER,
  nota="Ordinea contează: fila falsă închisă FĂRĂ niciun clic în pagină (CHK.falsaInchisa, " + SP + ":206).")
f("windows", "browser_inchide_tot", "Închide tot browserul, cu toate filele, cu ✕ din colțul ferestrei.", "Browser",
  "clic pe ✕ din dreapta rândului de file",
  [SP + ":415", SP + ":316"], ["lectii/vi/m2-l11", "lectii/vi/m3-l16"],
  [L11 + ":140 t:'fereastra' — acceptată ca rezolvare (" + SP + ":320)", L16 + ":210 t:'fereastra' — la fel", L11 + ":75 T_LAB — falsaInchisa trece și așa"],
  "NU", NU_BROWSER)
f("windows", "browser_pagina_buton", "Apasă un buton din pagina falsă (OK, Curăță acum, DESCARCĂ GRATIS, ✕ desenat în pagină): simulatorul o ține minte ca greșeală și spune pe loc ce s-ar fi putut întâmpla.", "Browser",
  "clic pe un buton din pagină",
  [SP + ":412", SP + ":334"], ["lectii/vi/m2-l11", "lectii/vi/m3-l16"],
  [L11 + ":140 t:'fereastra' — clicul în pagină = răspuns greșit (" + SP + ":337)", L11 + ":218 t:'fereastra' falsa:'virus'", L16 + ":210 t:'fereastra'",
   L11 + ":75 T_LAB — falsaInchisa cere ca apasatFals să fie fals"],
  "NU", NU_BROWSER,
  nota="Paginile false (premiu, virus, descarca) sunt conținut inventat cu adrese .example (" + SP + ":166-176).")

# ------------------------------------------------------------------ Windows: Securitate Windows
f("windows", "securitate_rezultat", "Citește rezultatul scanării în fereastra Securitate Windows („Amenințări curente”, „0 amenințări găsite.”, „N fișiere scanate.”, ora ultimei scanări).", "Securitate Windows",
  "după „Scanați cu Microsoft Defender...”, fereastra Securitate Windows arată întâi bara care merge, apoi rezultatul; se poate închide și redeschide din bară",
  [SP + ":256", SP + ":378", SP + ":270"], ["lectii/vi/m2-l11"],
  [L11 + ":184 t:'scanare' — testul 'nr' (numărul de amenințări citit și scris)", L11 + ":228 t:'scanare' — 'nr'", L11 + ":77 T_LAB — 'nr'"],
  "NU", "aplicatii/date/windows.json:1777 — lipsuri: „fereastra generică și Securitate Windows (windows.fereastra, windows.securitate_windows), R18-4”; căutat „Securitate|Defender|amenințări” în aplicatii/*.js: nimic",
  nota="Caseta „Răspunsul tău” e a simulatorului vechi (" + SP + ":273), nu a Windows-ului; cu biblioteca o pune lecția.")

# ------------------------------------------------------------------ Explorer (scanarea din siguranta-pc)
f("explorer", "nav_panou_navigare", "Trece în panoul din stânga la „Acest PC” (unitățile) sau la „Descărcări”.", "Navigare",
  "clic pe „Acest PC” / „Descărcări” în panoul de navigare",
  [SP + ":434"], ["lectii/vi/m2-l11"], [],
  "PARTIAL", "aplicatii/explorer.js:788 — nodurile cu cale navighează (folderele de lucru: probat cu parinte 'Descărcări' → " + PE + " › arbore_noduri); „Acest PC” și unitățile = I.nesimulat (probat: " + PE + " › clic_acest_pc)",
  lipsa="„Acest PC” cu „Dispozitive și unități” (Disc local (C:), STICK (E:)); „Descărcări” doar dacă lecția îl dă ca folder-părinte, iar fișierele stau atunci într-un subfolder al lui (explorer.js:177).")
f("explorer", "nav_deschide_folder", "Intră pe stickul STICK (E:) din „Acest PC”.", "Navigare",
  "dublu-clic pe STICK (E:) (Enter; pe telefon două atingeri); Disc local (C:) dă doar un mesaj",
  [SP + ":347", SP + ":446", SP + ":452", SP + ":421"], ["lectii/vi/m2-l11"],
  [L11 + ":78 T_LAB (atelier t:'laborator') — deschisFaraProgram: tema de pe stick se deschide din STICK (E:)"],
  "PARTIAL", "aplicatii/explorer.js:608 — dublu-clic pe un folder navighează în el (deschide → navigheaza :493); o lecție poate numi un folder „STICK (E:)” (probat: " + PE + " › cale_curenta „Descărcări/STICK (E:)/”)",
  lipsa="Nu există unitatea STICK (E:) în „Acest PC” (doar un folder cu numele ei); vederea „Acest PC” e I.nesimulat (explorer.js:788).")
f("explorer", "nav_inapoi", "Se întoarce cu „Înapoi” (←) de pe stick la „Acest PC”.", "Navigare",
  "clic pe ←",
  [SP + ":433"], ["lectii/vi/m2-l11"], [],
  "DA", "aplicatii/explorer.js:792 — Înapoi = folderul de dinainte, din istoric (și Backspace :918, Alt+← :920)")
f("explorer", "selectie_element", "Alege un fișier sau o unitate cu un clic (se evidențiază).", "Navigare",
  "un clic pe element",
  [SP + ":423"], ["lectii/vi/m2-l11"], [],
  "DA", "aplicatii/explorer.js:783 — clicul pe un rând din listă îl selectează (alege, :611; Ctrl / Shift pentru mai multe)")
f("explorer", "meniu_context", "Deschide meniul de clic dreapta (Windows 11, cel scurt) pe stick sau pe un fișier; Esc îl închide.", "Meniuri",
  "clic dreapta; pe telefon ții degetul apăsat sau atingi ⋯",
  [SP + ":404", SP + ":395", SP + ":417", SP + ":450"], ["lectii/vi/m2-l11"],
  [L11 + ":182 t:'scanare' — testul scanatInainte v:'E:' (drumul: clic dreapta pe STICK (E:))", L11 + ":226 t:'scanare' — scanatInainte v:'fisa-de-lucru'", L11 + ":76 T_LAB — scanatInainte"],
  "PARTIAL", "aplicatii/explorer.js:836 — clic dreapta pe fișier deschide meniul Windows 11 (meniu_fisier, rândurile din referință; probat: " + PE + " › meniu_fisier); :893 Esc îl închide",
  lipsa="Meniul pe unitatea STICK (E:) (nu există unități); pe telefon: ținutul apăsat și butonul ⋯ (aplicatii.js:405 ascultă doar evenimentul contextmenu al browserului).")
f("explorer", "meniu_context_clasic", "Din meniul scurt, „Afișați mai multe opțiuni” deschide meniul clasic (cu „Scanați cu Microsoft Defender...”).", "Meniuri",
  "clic pe „Afișați mai multe opțiuni”",
  [SP + ":428"], ["lectii/vi/m2-l11"],
  [L11 + ":182 t:'scanare' — scanatInainte (drumul spre Scanați...)", L11 + ":226 t:'scanare'", L11 + ":76 T_LAB"],
  "DA", "aplicatii/explorer.js:682 — „Afișați mai multe opțiuni” deschide meniu_fisier_clasic; aplicatii/date/explorer.json:1947 — rândul „Scanați cu Microsoft Defender...” (probat: " + PE + " › meniu_clasic)",
  nota="Doar pe fișiere (unitățile lipsesc, vezi nav_deschide_folder).")
f("explorer", "scanare_defender", "Scanează stickul sau un fișier: „Scanați cu Microsoft Defender...” pornește scanarea; simulatorul ține minte ce s-a scanat și când (înainte sau după deschidere).", "Securitate",
  "clic dreapta → Afișați mai multe opțiuni → Scanați cu Microsoft Defender...",
  [SP + ":430", SP + ":375", SP + ":378"], ["lectii/vi/m2-l11"],
  [L11 + ":182 t:'scanare' — scanatInainte v:'E:' (scanat înainte de primul fișier deschis de pe stick)", L11 + ":226 t:'scanare' — scanatInainte v:'fisa-de-lucru'",
   L11 + ":76 T_LAB — scanatInainte", L11 + ":184 / :228 / :77 — 'nr' cere o scanare făcută"],
  "NU", "aplicatii/explorer.js:685 — orice altă comandă din meniu, inclusiv „Scanați cu Microsoft Defender...”, = I.nesimulat (probat: " + PE + " › scanare)",
  nota="Ordinea scanare → deschidere s-ar putea citi din evenimente (au ts), dar scanarea nu are efect și nici fereastra Securitate Windows nu există.")
f("explorer", "deschide_fisier", "Deschide un fișier (temă, fișă): se spune în ce aplicație s-a deschis, iar simulatorul ține minte ce s-a deschis și dacă era verificat înainte.", "Fișiere",
  "dublu-clic pe fișier (Enter; pe telefon două atingeri) sau Deschidere din meniul de clic dreapta",
  [SP + ":446", SP + ":429", SP + ":353", SP + ":364"], ["lectii/vi/m2-l11"],
  [L11 + ":78 T_LAB — deschisFaraProgram v:['Tema_6A_Pop','joc_gratis'] (tema deschisă)", L11 + ":182 t:'scanare' — scanatInainte compară cu primul fișier deschis de pe stick"],
  "NU", "aplicatii/explorer.js:609 — deschiderea unui fișier = I.nesimulat('Deschideți') (probat: " + PE + " › dublu_docx)",
  nota="Evenimentul rămâne (dublu_clic, tinta 'lista:<nume>', actiune 'nesimulat'), dar nu e o deschidere: starea (§5) nu ține fișierele deschise.")
f("explorer", "porneste_program", "Pornește un program (Tip: Aplicație) de pe stick sau din Descărcări; simulatorul îl ține minte și spune pe loc că e o greșeală.", "Fișiere",
  "dublu-clic pe fișierul cu Tip: Aplicație",
  [SP + ":359", SP + ":360"], ["lectii/vi/m2-l11"],
  [L11 + ":183 t:'scanare' — testul niciunProgram", L11 + ":227 — niciunProgram", L11 + ":78 T_LAB — deschisFaraProgram (joc_gratis nepornit)"],
  "NU", "aplicatii/explorer.js:609 — și un .exe = I.nesimulat('Deschideți') (probat: " + PE + " › dublu_exe)",
  nota="Testele cer ca programul să NU fie pornit; o lecție ar putea verifica lipsa evenimentului dublu_clic pe 'lista:joc_gratis.exe', dar fără mesajul de greșeală al vechiului.")
f("explorer", "citire_tip", "Citește în coloana Tip ce fel de fișier e: „Aplicație”, „Microsoft Word Document”, „Microsoft PowerPoint Presentation”.", "Fișiere",
  "privești coloana Tip (numele fără extensie)",
  [SP + ":245", SP + ":181"], ["lectii/vi/m2-l11"], [],
  "PARTIAL", "aplicatii/explorer.js:221 — tipText din date/explorer.json:892 (doar Folder, TXT, PNG, DOCX); restul „Fișier <EXT>” (probat: " + PE + " › randuri_tip: .exe → „Fișier EXE”, .pptx → „Fișier PPTX”)",
  lipsa="„Aplicație” pentru .exe și „Microsoft PowerPoint Presentation” pentru .pptx (tipurile probate de vechi cu AssocQueryString).",
  nota="Testul niciunProgram se bizuie pe recunoașterea „Tip: Aplicație” din enunț (" + L11 + ":183).")

doar = [
  {"grup": "Conținutul ferestrelor din desktop-windows", "exemple": ["Paint: „Aici desenezi. În simulator, nu desenăm.” (meniurile Fișier / Editare / Vizualizați doar scrise)", "Ceas, Setări, Coș de reciclare: ferestre goale"], "dovada": DW + ":345"},
  {"grup": "Zona de notificare (desktop-windows)", "exemple": ["pictograma sunetului: doar desenată, fără clic"], "dovada": DW + ":416"},
  {"grup": "Comenzi din meniul de clic dreapta care doar spun un mesaj (siguranta-pc)", "exemple": ["Copiere → „Copierea nu o folosim în exercițiul ăsta.”", "Proprietăți → „Proprietățile nu le folosim…”"], "dovada": SP + ":431"},
  {"grup": "Disc local (C:) în siguranta-pc", "exemple": ["dublu-clic → „În exercițiul ăsta nu intrăm pe Disc local (C:).”", "scanare C: → „scanezi doar stickul sau un fișier”"], "dovada": SP + ":346"},
  {"grup": "Bara de adresă a browserului (siguranta-pc)", "exemple": ["adresa paginii false / a lecției: doar citită"], "dovada": SP + ":226"},
]
nesigure = [
  "„Ia-o de la capăt” (" + DW + ":451, " + SP + ":441) e butonul simulatorului vechi, nu al Windows-ului: nu l-am pus între funcții; în bibliotecă îl face lecția, redeschizând instanța.",
  "Casetele de răspuns (ora la testul 'ceas', „Răspunsul tău” la testul 'nr') stau în simulatorul vechi; le-am socotit ale lecției, nu ale aplicației (notă la ceas_citire și securitate_rezultat).",
  "fereastra_restabilire = PARTIAL doar din cauza numelui / pictogramei butonului („Maximizare” în loc de „Restabilire jos”); dacă numele se socotește aspect, devine DA.",
  "start_porneste_aplicatie = PARTIAL: am socotit pornire fereastra generică deschisă din rezultatul căutării, deși biblioteca arată și mesajul „…nu e simulată” lângă ea.",
  "meniu_context pe telefon: Android trimite contextmenu la ținutul apăsat, iOS nu; neprobat pe dispozitiv, doar citit (aplicatii.js:405).",
  "Probele s-au făcut pe Chromium headless la 1366×768; comportamentul la lățime sub 600 px (bara îngustă, Explorer maximizat) nu l-am jucat.",
]
out = {"parte": "C",
       "fisiere_citite": [{"cale": DW, "linii": 569}, {"cale": SP, "linii": 537}, {"cale": L08, "linii": 340}, {"cale": L11, "linii": 286}, {"cale": L16, "linii": 493}],
       "functii": F, "doar_afisate": doar, "nesigure": nesigure, "neacoperit": ""}
p = os.path.join(AICI, "parte_C.json")
json.dump(out, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
from collections import Counter
print(p, len(F), Counter(x["biblioteca"] for x in F), sum(x["ceruta_de_exercitiu"] for x in F))
