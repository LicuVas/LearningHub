# Contract — Fereastra mică pe LearningHub: pașii din aplicația adevărată, mereu deasupra  (12.10.2026)

## Cererea (verbatim)
> Merge foarte bine! Bravo! Poate o folosim mai des pe learninghub - mai ales pentru lectiile care cer interactiune cu aplicatiile adevarate.

Context: „o” = fereastra mică (Document Picture-in-Picture) făcută pe 12.10.2026 pentru panoul clasei
(`panou-clasa.netlify.app/fise/`): fișa stă deasupra Excelului, se mută, se mărește, se derulează. Profesorul a
probat-o pe calculatorul lui, cu Excel-ul adevărat deschis dedesubt (două capturi, 12.10.2026, 22:27).

## Proba realității
Elevul, la calculatorul din laborator (Chrome sau Edge), ajunge în lecție la pasul „Acum în <aplicația> adevărată”.
Apasă un buton, iar pașii lecției apar într-o fereastră mică, deasupra aplicației (Excel, Word, PowerPoint, Explorer…).
Lucrează în aplicație și bifează pașii în fereastra mică, pe rând, fără să mai caute fila lecției între pași. La final
apasă „Am terminat → La verificare”: fereastra mică se închide și lecția trece la întrebări.
Proba: același drum făcut de un om pe un PC cu aplicația reală deschisă (ca proba profesorului din 12.10).

## R — cerințe explicite  (cine verifică · „gata” =)
- R1. Pe pasul „Acum în aplicația adevărată” apare butonul „⧉ Ține pașii deasupra, cât lucrezi” în TOATE lecțiile
  care au acest pas (azi 60 din 60), când browserul are fereastra de document · verifică: script Playwright pe
  server local (cu `ctx.route` care oprește tot ce nu e 127.0.0.1, regula 24) · gata = 60/60.
- R2. Fereastra mică arată exact pașii din pagină (același text, aceeași ordine), titlul pasului și „Unde lucrezi” ·
  verifică: același script, text din fereastră comparat cu textul din pagină · gata = 0 diferențe în 60 de lecții.
- R3. Bifele: un pas bifat în fereastra mică apare bifat și în pagină, și invers; bifele rămân după ce fereastra se
  închide · verifică: script · gata = probă trecută în ambele sensuri.
- R4. „Am terminat → La verificare” din fereastra mică o închide și duce lecția la Î1; „Adu pașii înapoi” din pagină o
  închide fără să schimbe pasul · verifică: script · gata = ambele trec.
- R5. Fără fereastra de document (Firefox, Chrome sau Edge mai vechi de versiunea 116): butonul nu apare; în locul lui,
  sfatul „tasta Windows + ← (ecran împărțit)”; nimic din lecție nu se strică · verifică: script cu
  `documentPictureInPicture` scos din pagină · gata = sfatul vizibil, 0 erori în consolă.
- R6. Pe telefon nu apare nici butonul, nici sfatul (nu există aplicație alături) · verifică: script cu ecran de
  telefon (412 px) · gata = 0 elemente vizibile, fără depășire pe lățime.
- R7. Motorul nu se strică: `test_joc.py --toate` TRECUT, `proba_bara_pasi.py` → 0 (cu mutanții), `proba_inapoi.py` → 0,
  `oracol_jocuri.py` → 0 · verifică: scripturile existente · gata = toate 0 / TRECUT.
- R8. Mâna profesorului: o lecție cu Excel (VIII, Lecția 7) deschisă pe PC-ul lui, pașii deasupra Excelului, bifați
  și dus la verificare · verifică: OMUL · gata = „merge”, scris de el.
- R9. Publicat întâi pe situl de probă, apoi în producție (`learninghub-8z6.pages.dev`), cu marcajul găsit în
  `jocuri/_motor/motor.js` servit live · verifică: curl + Playwright pe adresa live · gata = marcajul prezent, R1–R4
  trec și pe live.
- R10. Probele nu lasă elevi falși în panoul profesorului · verifică: `python C:\00\AI_0\tools\activitate.py lista`
  filtrat după „nu e în catalog” înainte și după probe · gata = 0 rânduri noi.

## I — cerințe implicite
- I1. Schimbarea stă în MOTOR (`jocuri/_motor/motor.js`), nu în fiecare lecție — implicat de „mai des”: o singură
  schimbare ajunge în toate lecțiile, și în cele care vor fi publicate de acum înainte.
- I2. Conținutul lecțiilor nu se schimbă, deci verificarea lecțiilor (insigna „verificat”) rămâne valabilă —
  implicat de campania lecțiilor (componentă comună modificată = probe pe toate jocurile și lecțiile, R7).
- I3. Nimic de instalat pe calculatorul din laborator; doar browserul — implicat de laboratoarele școlii.
- I4. Texte de elev, în română, cu diacritice, fără termeni tehnici („Picture-in-Picture” nu apare nicăieri pe ecran) —
  implicat de standardul lecției, regula 1, și de decizii-implicite.md §Limba și forma.
- I5. Butonul are nume vizibil și cel puțin 32 px — implicat de standard, regula 20.
- I6. Fereastra mică urmează tema paginii (luminoasă sau întunecată) și se citește la mărimea ei inițială —
  implicat de proba din 12.10 (fișa se citea fără mărire).
- I7. Imaginile și fișierele de descărcat din pași merg și din fereastra mică — implicat de pașii care trimit la
  „descarcă fișierul” (regula 4 din „Ce au găsit judecătorii”).
- I8. Elevul e avertizat o dată: „Nu închide fila lecției (o poți micșora)” — implicat de cum funcționează fereastra
  (se închide odată cu fila).
- I9. Nicio dată personală în ce se publică (standard, regula 27).

## Cititorul-țintă
ȘTIE: să deschidă o lecție, să apese butoane, să bifeze, să deschidă aplicația din laborator.
NU ȘTIE: Alt+Tab, ecranul împărțit, ce e o fereastră „mereu deasupra”, numele tehnice ale browserului.
CUM SE POARTĂ: citește primul rând, apasă cel mai mare buton, închide ce îl încurcă (inclusiv fila lecției).
[presupus: elev V–XII, la calculatorul din laborator, cu Chrome sau Edge]

## Glosar de sensuri
- „fereastra mică” = fereastra de document a browserului (Document Picture-in-Picture), mereu deasupra celorlalte;
  NU o fereastră pop-up obișnuită, care rămâne în spatele aplicației.
- „lecțiile care cer interacțiune cu aplicațiile adevărate” = lecțiile cu pasul „Acum în aplicația adevărată”
  (`aplicatieReala` în configurația lecției): azi 60 din 60. [presupus]
- „mai des” = în motor, pentru toate lecțiile odată, nu lecție cu lecție. [presupus]
- „merge” = elevul face pașii în aplicație fără să caute fila lecției și ajunge la verificare din fereastra mică.

## Întrebări de client (cu implicitul luat dacă nu primesc răspuns)
1. Doar pasul de la final („Acum în aplicația adevărată”), sau și gesturile mici din fiecare pas (regula 10)?
   → implicit: ETAPA 1 = pasul de la final, în toate lecțiile; gesturile din pași = etapa 2, după ce vezi etapa 1 la clasă.
2. În fereastra mică: doar pașii cu bife, sau și captura de ecran a pasului?
   → implicit: pașii cu bife + „Am terminat → La verificare”; capturile rămân în pagină.
3. Pe Chrome vechi: doar sfatul „Windows + ←”, sau și rezerva cu filmulețul (ca pe panou)?
   → implicit: doar sfatul; o listă de bifat nu se poate bifa într-un filmuleț.
4. Publicarea: întâi pe situl de probă, tu o încerci pe PC-ul tău cu Excel, apoi producția?
   → implicit: da, în ordinea asta (R8 înainte de R9).

## Durata estimată
~1,5–2 ore de lucru, fără agenți în plus (motorul + o probă nouă `jocuri/_motor/proba_fereastra_mica.py` + probele
existente), plus verificarea finală prin `reprompt` (~10 minute). Nu începe în noaptea asta fără aprobare.

## Decizii luate (după aprobare)
Profesorul, 12.10.2026, 22:55: „Da, la toate, în afară de numărul 4, pune-l direct pe site-ul elevilor.” Lucrare de noapte,
neasistată; raportul în Notepad++.
- Î1 = DA: etapa 1 = pasul de la final, în toate lecțiile; gesturile din pași = etapa 2, după ce vede etapa 1 la clasă.
- Î2 = DA: în fereastră doar pașii cu bife + „Am terminat → La verificare”; capturile rămân în pagină.
- Î3 = DA: pe Chrome vechi doar sfatul „Windows + ←”, fără filmuleț.
- Î4 = NU: direct pe situl elevilor (fără situl de probă). R8 (mâna lui) rămâne, dar DUPĂ publicare, nu înainte;
  R9 se citește „publicat în producție cu marcajul live”.
- Găsite în lucru (23:00–23:15): (a) VI/1 și VIII/1 își completează pașii după desenare → fereastra copiază lista DIN
  PAGINĂ, nu `A.pasi`; (b) V/10-12 au bifele lor pe fiecare punct → acolo motorul nu mai pune bifă (fără bife duble);
  (c) VI/9 are în pași lista de autoverificare (16 bife, numărător, buton) → clicurile din fereastră se fac pe
  elementul-pereche din pagină, apoi copia se reface (oglinda).
