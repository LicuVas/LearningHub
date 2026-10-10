# „Cum fac…?” — specificația comună (10.10.2026)

Contractul aprobat (citește-l întâi): `C:\00\Projects\LearningHub\_campaign\cum_fac_2026_10\contract.md`.
Standardul lecțiilor, ale cărui reguli se aplică și fișelor: `C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\05_STANDARD_LECTIE.md`
(mai ales 1, 3, 6, 20, 22, 24, 27).

## Ce construim
Pagina `/cum-fac/` din LearningHub (sit static, Cloudflare Pages, fără server): elevul scrie cu vorbele lui ce vrea
să facă într-o aplicație (Excel, Word, PowerPoint, Windows, editorul de pagini web) și primește pe loc o listă de
FIȘE DE GEST ordonate după potrivire; fișa are pașii pentru aplicația ADEVĂRATĂ.

## Unde stă fiecare lucru
| Ce | Unde |
|---|---|
| Lecțiile extrase (pași, indicii, capturi), doar citire | `_campaign\cum_fac_2026_10\digest\<clasa>_<lectie>.json` (+ `_index.json`) |
| Fișele (sursa adevărului) | `cum-fac\_sursa\fise_<grup>.json` — o listă JSON de fișe, un fișier pe autor |
| Dicționarul de sensuri | `cum-fac\_sursa\sensuri.json` |
| Verificatorul fișelor | `node C:/00/Projects/LearningHub/cum-fac/_build/valideaza_fise.mjs [fise_x.json]` → ultima linie = nr. probleme |
| Exemplu de fișe corecte | `_campaign\cum_fac_2026_10\exemplu_fise.json` (trec verificatorul cu 0) |
| Construirea paginii | `cum-fac\_build\build.mjs` → `cum-fac\date.js` |
| Motorul de căutare | `cum-fac\cautare.js` (merge în browser ȘI în node) |
| Pagina | `cum-fac\index.html` |
| Probele | `cum-fac\_teste\` |
| Setul de test ASCUNS | `_campaign\cum_fac_2026_10\_ascuns\` — NU îl citește nimeni care reglează căutarea sau scrie fișe |

Calea Bash: întotdeauna absolută (`C:/00/Projects/LearningHub/...`), fără `cd` + cale relativă (o poartă blochează).
NU atingi: `jocuri/_motor/motor.js`, `assets/js/prezenta.js` (altă sesiune lucrează în ele acum), lecțiile din
`lectii/`, `hub/by-goal/`. Commit NU faci; dirijorul comite.

## Fișa de gest — câmpurile (verificatorul le cere pe toate)
```json
{
 "id": "excel-salvare-prima-data",        // <aplicatie>-<ce-face>, litere mici fără diacritice, cratime
 "aplicatie": "excel",                    // excel | word | powerpoint | windows | web
 "titlu": "Salvezi prima dată un registru nou",   // ≤ 70 caractere; gestul, la persoana a II-a, ca în lecții
 "intrebare": "Cum salvez un fișier Excel nou?",  // întrebarea-tip; se termină cu „?”
 "scurtatura": "Ctrl+S",                  // "" dacă gestul n-are scurtătură
 "pasi": ["…", "…"],                      // 1-7 pași; HTML permis doar <b> <kbd> <code> <i>
 "rezultat": "…",                         // ce VEDE elevul când a reușit
 "atentie": "",                           // opțional: greșeala tipică, o frază
 "termeni": [{"t":"registru","d":"fișierul Excel, cu toate foile lui"}],  // termenii de specialitate din pași
 "captura": {"src":"lectii/viii/m1-l03/img/x.webp","alt":"…","w":575,"h":399,"legenda":"…"},  // sau null
 "formulari": ["cum salvez excelu", "…"], // 8-15 feluri în care ar întreba un elev de 10-14 ani
 "cuvinte": ["salvare","save"],           // cuvinte-cheie în plus (sinonime, numele englezești din meniu)
 "sursa": {"cale":"lectii/viii/m1-l03/","pas":"p2","titlu_pas":"…","ancora":"<fragment copiat EXACT din pas, ≥ 25 caractere>"},
 "clasa": "a VIII-a", "lectia": 3,         // exact ca în digest (clasa, nr)
 "inrudite": ["excel-inchidere-registru"]   // id-uri existente (ale tale sau ale altor autori)
}
```
`sursa.pas` = id-ul pasului din digest (`p1`…`pN`, ca în bara motorului) sau `"real"` pentru pasul „în aplicația
adevărată” (`aplicatie_reala.pasi`). Ancora se caută în titlul + textul + „Uite cum” + „Altfel” + indiciile pasului,
cu tastele scrise ca în digest: `[Ctrl]+[S]` (sau `<kbd>Ctrl</kbd>+<kbd>S</kbd>`, verificatorul le echivalează).

## Regulile fișelor (le verifică judecătorii, nu tu)
1. **Un gest = o fișă.** Un pas care predă trei gesturi (foaie nouă, trecerea între foi, redenumirea) dă trei fișe.
   Gestul e ceva ce faci în aplicație în cel mult 2 minute. O idee fără gest („ce este o celulă”) nu e fișă,
   decât dacă lecția predă un gest legat de ea („cum aflu adresa celulei” → caseta Nume).
2. **Nimic în plus față de lecție.** Fiecare afirmație din fișă (unde e butonul, ce apare, ce scurtătură) e spusă de
   lecția-sursă (textul pasului, „Uite cum”, „Altfel”, indicii, pasul în aplicația adevărată). Ce lecția nu spune, nu
   scrii — afirmațiile lecțiilor au fost verificate în Excel/Word/PowerPoint reale; ale tale nu. Dacă un gest are
   bucăți în doi pași, sursa e pasul principal, iar restul trebuie să fie tot din aceeași lecție.
3. **Aplicația ADEVĂRATĂ, nu simulatorul.** Indiciile lecțiilor vorbesc uneori despre simulator („butonul Ctrl+N de sub
   titlu”, „apasă Verifică”, „pe telefon, degetul ținut apăsat” în simulator). În fișă scrii gestul din aplicația reală
   (tasta Ctrl+N, Fișier › Nou). Ce e doar al simulatorului nu intră.
4. **Executabil literal** (regula 3): UNDE, CE EXACT, CU CE confirmi. Fără notații „A1 = …”; propoziții.
5. **Office în română ȘI engleză** (regula 6): „Pornire (Home)”, „Salvare ca (Save As)”, cum le scrie lecția; numele
   funcțiilor Excel nu se traduc (`=SUM`). Diacritice corecte (ș, ț cu virgulă).
6. **Termenii** de specialitate din pași (registru, celulă, panglică, diapozitiv, folder…) apar în `termeni`, cu
   definiția de un rând luată din lecție. Un elev de a V-a care deschide o fișă de Excel trebuie s-o poată urma.
7. **Captura**: o captură reală din pasul-sursă (vezi `capturi` în digest: src, alt, w, h, legenda) care arată EXACT
   gestul fișei; altfel `null`. Niciodată o imagine-substitut.
8. **Formulările** (8-15) sunt cum ar scrie un copil în căsuța de căutare: fără diacritice, cu greșeli de tastare
   („salvz”, „exel”), cu cuvinte de acasă („căsuțe” pentru celule, „pagina” pentru foaie, „poza” pentru imagine),
   englezește („save as”), descriind efectul („cum fac literele mai mari”). Variate, nu aceeași frază de 10 ori.
9. **Laboratorul e comun** (regulile 23, 25, 26): avertismentele lecției despre fișierele colegilor (Anulare la
   „already exists”, numele cu clasa) se păstrează în `atentie` sau în pași.

## Motorul de căutare (pentru inginer; pentru autori, doar ca să știți la ce folosesc formulările)
`cum-fac/cautare.js`, fără biblioteci, UMD: în browser `window.CautareCumFac`, în node `module.exports`.
- `CautareCumFac.creeaza(fise, sensuri)` → indexul; `index.cauta(text, {aplicatie, max})` →
  `{gasit, aplicatieDedusa, rezultate:[{id, scor, de_ce:[cuvintele potrivite]}], propuneri:[id…]}`.
- Normalizare: litere mici, fără diacritice (inclusiv ş/ţ cu sedilă), semnele → spații.
- Cuvinte de umplutură scoase („cum”, „fac”, „pot”, „vreau”, „sa”, „un”, „o”, „in”, „la”, „de”, „pe”…), dar NU
  cele care schimbă sensul („mai multe”, „toate”, „nou”, „alt”).
- Forme ale cuvântului: rădăcină (salvez/salvare/salvat/salveaza → aceeași), plurale și articole (celula/celule/celulele).
- Sensuri: `sensuri.json` grupează cuvintele cu același sens (salvez/păstrez/save; închid/ies/close; selectez/marchez/
  aleg; căsuță→celulă); întrebarea și fișa se compară și pe sensuri, nu doar pe litere.
- Greșeli de tastare: cuvântul necunoscut se potrivește cu cel mai apropiat din vocabular (distanță 1 pentru 4-6 litere,
  2 pentru 7+), inclusiv două litere inversate.
- Aplicația din întrebare („excel”, „tabel”, „celulă” → Excel; „word”, „document”, „referat” → Word; „prezentare”,
  „slide”, „diapozitiv” → PowerPoint; „folder”, „desktop” → Windows; „html”, „pagina web” → web) împinge în față fișele
  ei; fără aplicație în întrebare, toate concurează (iar butoanele de aplicație pot filtra).
- Ordonarea: scor pe câmpuri cu ponderi (titlu, întrebare, formulări, cuvinte > termeni > pași) + potrivirea pe sensuri.
- „N-am găsit”: când nici primul rezultat nu acoperă destul din întrebare, `gasit=false`, iar `propuneri` dă 3 fișe
  apropiate. Pragul se reglează pe setul de dezvoltare, NU pe cel ascuns.
- Totul rulează în pagină: nicio cerere spre rețea la căutare (I3), sub 100 ms pe întrebare (R7).

## Setul de test
`[{"q":"cum salvez excelu","accept":["excel-salvare-prima-data","excel-salvare-ctrl-s"],"tip":"fara_diacritice"},
  {"q":"cum fac clatite","accept":[],"tip":"in_afara"}]` — `accept` = fișele care ar fi un răspuns bun (orice din ele
pe locul 1 = reușită pe locul 1; în primele 3 = reușită top 3); `accept: []` = întrebare din afara materiei (reușită =
`gasit=false`). Scriitorii setului văd doar catalogul titlurilor (`cum-fac/_teste/catalog_titluri.json`: id,
aplicatie, titlu, clasa), NU formulările și nici pașii fișelor.

## Pragurile (din contract)
R4: top 3 ≥ 90%, locul 1 ≥ 75% pe setul ascuns · R5: exemplele lui, 8/8 pe locul 1 · R6: ≥ 18/20 din afara materiei
cu „n-am găsit” · R7: < 100 ms, primul rezultat vizibil fără derulare la 1366×768 și 390×844 · I3: 0 cereri externe.
