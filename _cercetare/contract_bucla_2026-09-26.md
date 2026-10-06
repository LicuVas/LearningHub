# Contract — /bucla 26.09.2026 seara: jocurile de pe probă × plimbarea novicelui × fidelitatea Office

> Pasul 0 din /bucla (`/contract`). Nu se construiește nimic până nu e aprobat. `[presupus]` = implicit luat de mine.

## Cererea (verbatim)

> avem o treaba complexa. Trebuie sa lucrezi cu informatiile din trei locuri.
> Ce ai inteles pana acum din aceasta consola, apoi despre progresul pe platforma de test si implementarea fidelitatii cu pachetul office.
> -- progresul pe platforma de test -- (…) Tot lucrul e pe site-ul de probă, nu în producție. Misiunea Webmaster: https://proba.learninghub-8z6.pages.dev/jocuri/web-viii/ (…) Pasul următor ține de tine: încerci pe probă și hotărăști dacă trecem în producție. (…) După aceea: lecțiile LearningHub din content/, refăcute cu aceeași metodă pe pași, și simulatoarele noi din lista din README-ul jocurilor.
> -- implementarea fidelitatii cu pachetul office. -- "%USERPROFILE%\Downloads\simulatoare_fidele_office_google.md"

## Cele trei surse, pe scurt (ce am citit, nu ce îmi amintesc)

1. **Consola asta:** plimbarea novicelui (`C:\00\AI_0\tools\plimbare\`): oracol T0 gratuit (termeni înainte de definiție, fundături, exemple care nu rulează, densitate) + **harta prerechizitelor** (la fiecare lecție: ce trebuie să știi, în ce lecție găsești, blocul „Ce trebuie să știi”) + cititori cu carte închisă (T1) cu canar/momeală + `/contract`.
2. **Probă (`C:\00\Projects\LearningHub_proba`, ramura `proba`, 15 commituri peste master, NEpublicat):** 19 jocuri de învățare rescrise pe pași (doctrina README jocuri §4 „Nivelurile PE PAȘI”), model `web-viii`; poarta prinde „nepredat în verificare” DOAR pentru `<code>/<kbd>` din întrebările de verificare, cumulat în același joc. §10: simulatoare cerute de recenzenți, etichete RO neverificate.
3. **Fidelitate (`simulatoare_fidele_office_google.md`):** 3 straturi (fac eu / capturi apăsabile / cutia de nisip); planul pe etape 0–8 (≈ 25–35 zile-om); etapa 0 cere un PC din laborator pentru dump-ul UIA; ordinea depinde de calendarul unităților (decizia profesorului, §8).

## R# — cerințe explicite

- **R1** Lucrul folosește toate cele trei surse (nu doar una).
- **R2** Rămâne pe probă; producția = decizia profesorului, NU o iau eu.
- **R3** Metoda „pe pași, de la novice la expert” e referința pentru tot ce se atinge.
- **R4** Fidelitatea cu Office urmează nota de cercetare (rețeta Excel pas cu pas, aspect din date oficiale, fără nimic inventat, verificare pe model, poartă `rezolva/gresit`).
- **R5** Se lucrează în buclă (/bucla): critici independenți, oracol care numără, oprire decisă de cod.

## I# — cerințe implicite (cu motivul)

- **I1 Prerechizitele trec și ÎNTRE jocuri, nu doar în joc** (din sursa 1: „ce trebuie să știi, unde cauți — în ce lecții”): azi poarta verifică doar `<code>/<kbd>` din verificare, în același joc. Un pas care folosește o noțiune din alt joc/altă clasă nu spune unde se învață.
- **I2 Pașii înșiși nu folosesc termeni nepredați** (nu doar întrebările) — plângerea lui era „noțiuni nepredate”; oracolul T0 al plimbării face exact asta pe text.
- **I3 Cititorul-țintă = elevul clasei jocului** (V–VIII), primul nivel presupune zero cunoștințe (regula 5 din README §4).
- **I4 Oracolul buclei = `_tests\oracol_jocuri.py` + T0 novice adaptat la jocuri**, ambele cu ultima linie număr.
- **I5 Nimic AGPL în jocuri** (§8.3 din notă) [presupus = recomandarea notei].
- **I6 Etichetele RO/EN nu se ghicesc**: ce nu se poate verifica fără laborator rămâne marcat NEVERIFICAT (blocaj extern: un PC din laborator).
- **I7 Deploy doar pe probă**, verificat live (curl + marker), ca după orice modificare.

## Glosarul de sensuri

- **„fidelitate”** = elevul găsește același lucru, în același loc, cu același nume și același comportament ca în aplicația din laborator; se dovedește cu oracol (COM/UIA/date oficiale), nu „arată ca”.
- **„pe pași”** = structura `pasi/atelier/qs` din README §4, cu regulile 1–7.
- **„prerechizit”** = noțiune pe care pasul/întrebarea o presupune; are ADRESĂ = jocul + nivelul (sau lecția din `content/`) care o predă.
- **„gata”** = oracolele la 0 + poarta 27/27 + probe live pe probă; NU producție.

## Planul propus (cu durata, înainte de pornire)

| Faza | Ce | Oracol / gata când | Durată estimată |
|---|---|---|---|
| **A1** | Adaptor „jocuri → plimbare”: pașii fiecărui nivel devin pagini pentru T0; harta prerechizitelor **pe nivel și între jocuri** (adresa = joc + nivel); poarta primește „termen folosit în pas înainte de a fi predat” | T0-jocuri tipărește un număr; cazuri de test ca `test_prereq.py` | ~1 h |
| **A2** | Blocul „Ce trebuie să știi” în motor, la începutul nivelului, generat din hartă, cu link spre jocul/nivelul care predă | poarta + oracol = 0; vizibil live pe probă | ~1 h |
| **A3** | Bucla (`critic-loop`, treapta normal) pe cele 19 jocuri de învățare, oracol = oracol_jocuri + T0-jocuri; apoi T1 cititori (Sonnet) pe 3 jocuri (web-viii, excel-pas-cu-pas-viii, word-vii) | convergență 3 runde goale; T1 validă | ~1 h 15 + ~15 min, 2–5 $ |
| **B1** | Fidelitate etapa 0 **fără laborator**: `panglica_build.py` din listele OfficeDev (MIT) → `panglica-excel/word/powerpoint.json` + harta idMso → icoană Fluent (MIT) | 3 JSON, 0 comenzi inventate (fiecare rând trasabil în lista oficială) | ~1–2 h |
| **B2** | Fidelitate etapa 1: `ui-panglica.js` + Excel pas cu pas pe panglica reală | poarta + `proba_excel_gesturi.py` = 0 | ~2–3 h |
| **C** | Etapele următoare (Word/PowerPoint/Sheets) în ordinea calendarului tău | — | zile, pe valuri |

**Blocaje externe numite:** dump-ul UIA de pe un PC din laborator (etichetele exacte + fontul implicit); decizia de producție.

## Întrebări pentru profesor (cu implicitul meu)

1. Pornesc acum A (plimbarea pe jocuri) + B1–B2 (panglica Excel)? — *implicit: da, în ordinea A → B.*
2. Ordinea fidelității după A–B: ce unitate predai acum/în curând (VII-U1 Word, VI-U1 prezentări)? — *implicit: Word înaintea lui Sheets (nota §7).*
3. Blocul „Ce trebuie să știi” vizibil pentru elev la fiecare nivel? — *implicit: da, restrâns, un rând pe prerechizit.*
