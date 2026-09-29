# Contract — Nota = punctaj : 10, peste tot (29.09.2026)

## Cererea (verbatim)
> 1. Dau cel putin o nota pe modul . - Acum la clasele de postliceala nu stiu exact cate sa dau dar la cele la care sunt cele 5 module - vor fi in general 5 note care acopera minumul de 4 (ore pe saptamana + 3).
> 2. nota = punctaj : 10 - ca sa nu fie probleme si modifica peste tot. Avem standardele dar probabil o sa le echivalam din nota ca la competentele de la bac si nu invers.

Contextul (tura anterioară): scara 27 / 20 / 14 din `SISTEM_EVALUARE.md` §4.2-4.3 dădea 82 p → nota 4. Nu are bază legală. ME spune că nivelul „nu conduce direct la notă” (07.09.2026) și că „nu presupune o echivalență ... înțeleasă în mod mecanic” (28.07.2026).

## Proba realității
- Un elev de a VII-a citește lecția 1 pe telefon. La final calculează singur nota unei lucrări (A 25 + B 28 + C 19 + 10 din oficiu = 82 → **8**) și spune ce nivel înseamnă nota.
- Un părinte citește fișa de criterii din caiet și înțelege nota din punctaj, fără alt calcul.
- La inspecție, profesorul arată că evaluarea e pe standarde: cerințe pe niveluri (A/B/C) și nivelul trecut în fișa de niveluri.

## R — cerințe explicite  (cine verifică · „gata” =)
- R1. `Info_Gimnaziu_2026\SISTEM_EVALUARE.md`:
  - §4: nota = punctaj : 10, iar nivelul se trece din notă;
  - §3: cel puțin o notă pe modul, 5 pe an, minimul legal 4 (ROFUIP art. 107(4));
  - §0 și §1: citatele ME de pe 28.07 și 07.09.
  · verifică: script (grep după regula veche + calculul exemplelor) · gata = 0 apariții „A ≥ 27 / dă banda”, iar exemplul din §4.4 iese la notă = punctaj : 10.
- R2. Fișele de criterii V, VI, VII, VIII (`instrumente\Fisa_criterii_elev_clasa_*.md`) au aceeași regulă și același număr de note · verifică: script · gata = 0 apariții ale regulii vechi în 4 din 4 fișe.
- R3. `instrumente\Grila_produs.md` are puncte pe criterii și nota = punctaj : 10. Regula „nivelul produsului = cel mai mic” iese · verifică: script (toate „De bază” → 6, toate „Consolidat” → 8, toate „Avansat” → 10) · gata = 3 din 3.
- R4. Generatoarele (`generator\instrumente.py`, `build_saptamana1.py`, `print_engine.py`) produc regula nouă, iar foile din `materiale\print\` sunt regenerate din ele · verifică: script · gata = 0 apariții ale regulii vechi în foile regenerate.
- R5. Lecțiile live:
  - `lectii/{v,vi,vii,viii}/m1-l01` predau nota din punctaj și nivelul din notă. Toate exercițiile au răspunsurile refăcute după regula nouă (Vlad, Paul, Ioan…).
  - `lectii/{vi,vii}/m2-l09` folosesc grila cu puncte.

  · verifică: (a) `test_joc.py` + `verifica_lectie.py` → 0; (b) un script independent refăcând fiecare socoteală din pagină; (c) un judecător independent (opus, context proaspăt) · gata = 0 GRAV / 0 MAJOR la fiecare dintre cele 6 lecții.
- R6. Nicio lecție nu mai spune alt număr de note („9 / 8 / 7 note”) și nici regula veche în `profil.json` / `afirmatii.json` / `surse.md` · verifică: grep pe `lectii/` · gata = 0.
- R7. Publicat și verificat live: doar fișierele numite (`git add <căi>`). Pe cele 6 adrese apare regula nouă și lipsește „27 din 40” · verifică: curl + marcaje, `fum_live.py` · gata = 6 din 6.
- R8. Vaultul `Scoala`, nota `00_START — Informatica si TIC, gimnaziu 2026-2027.md`: regula nouă (prin /obsidian) · verifică: grep · gata = 0 apariții ale regulii vechi.
- R9. `_campaign\revizuire_completa_2026_09\08_RELUARE.md`: regula nouă pentru lecțiile viitoare, iar punctul deschis de la rândul 116 e închis · verifică: citire · gata = regula scrisă, contradicția marcată rezolvată.

## I — cerințe implicite
- I1. Evaluarea rămâne „pe standarde” (obligație legală): părțile A/B/C cu cerințe pe niveluri rămân, la fel nivelul în fișa de niveluri și planul individualizat sub nota 5 — implicat de: „Avem standardele”.
- I2. Testul de început de an rămâne nenotat — implicat de: ce nu s-a schimbat.
- I3. Aceleași numere peste tot: lecția, fișa, sistemul și foaia nu se contrazic — implicat de: „ca să nu fie probleme”.
- I4. Regulile 22-27 din `05_STANDARD_LECTIE.md`: probe cu rețeaua blocată, `ctx.close()`, nicio dată personală publicată — implicat de: lecțiile sunt live cu elevi reali.
- I5. Elevii au deja în caiet fișa veche, lipită la prima oră — implicat de: SISTEM_EVALUARE §6.1. Vezi întrebarea 4.

## Cititorul-țintă
ȘTIE: adunarea, împărțirea la 10, că lucrarea are părțile A/B/C. / NU ȘTIE: „standard”, „descriptor”, „prag”. / CUM SE POARTĂ: citește pe telefon, sare textul lung, verifică doar exemplul. [presupus, ca în restul campaniei]

## Glosar de sensuri
- „nota = punctaj : 10” = totalul (A + B + C + 10 din oficiu) împărțit la 10, rotunjit la întreg. Pentru ,5 regula foii rămâne cum e: nu inventez alta [presupus].
- „peste tot” = sursele VII: documentele din `Info_Gimnaziu_2026`, generatoarele și foile regenerate, lecțiile publicate din `/lectii/`, nota din vaultul `Scoala`, `08_RELUARE.md`. NU intră: arhivele din `_campaign/**/_verificare`, `.bak`, jurnalele (sunt istorie).
- „nivelul din notă” = corespondența de la întrebarea 1.

## Întrebări de client (cu implicitul luat dacă nu primesc răspuns)
1. Nivelul din notă: 1-2 În dificultate · 3-4 În formare · 5-6 De bază · 7-8 Consolidat · 9-10 Avansat? → implicit: DA (e și corespondența spusă de ministru „în general”).
2. Grila de proiect n-are puncte. Propunerea:
   - 5 criterii × 0-18 p + 10 din oficiu = 100;
   - repere: De bază 10 p, Consolidat 14 p, Avansat 18 p pe criteriu (toate De bază → 6, toate Consolidat → 8, toate Avansat → 10);
   - se poate da și între repere.

   → implicit: DA.
3. În lecții scrie doar: „Primești cel puțin o notă în fiecare modul, deci cel puțin 5 pe an. Testul de la început nu se notează.” Împărțirea pe lucrări / proiecte / portofoliu iese → implicit: DA.
4. Fișa veche din caiet: regenerez fișa de criterii (o pagină), iar tu o dai la oră ca înlocuire. Nu fac altă foaie → implicit: DA.
5. Postliceala: în afara lucrării (nu are standarde, numărul de note nu e stabilit) → implicit: NU intră.

## Estimare
Cam 3-4 ore. Documentele și generatoarele le fac eu. Cele 6 lecții: câte un agent care repară și câte un judecător independent pe lecție (~12 agenți), plus reparările după judecători. Publicarea la final, cu verificare live.

## Decizii luate (după aprobare, 29.09.2026 09:42)
- Aprobat: „restul par ok”. Întrebările 1, 3 și 5 rămân pe implicit (DA).
- Întrebarea 2 (grila cu puncte, 5 × 0-18 + 10, cu reperele 10 / 14 / 18): „probabil e bine”, deci DA.
- Întrebarea 4: „nu au încă nicio fișă în caiet”. Fișa de criterii regenerată e PRIMA pe care o primesc, deci nu e o înlocuire și nu scrie nicăieri „fișa veche”. Lecțiile nu trebuie să pomenească o schimbare de regulă.
