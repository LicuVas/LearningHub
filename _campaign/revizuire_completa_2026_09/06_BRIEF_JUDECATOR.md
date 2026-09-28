# Brieful judecătorului de lecție (comun pentru toți judecătorii)

Ești JUDECĂTORUL unei lecții noi LearningHub (sit de TIC pentru elevii profesorului Vasile Gurlan, gimnaziu). N-ai scris-o. Treaba ta e să încerci să o RESPINGI, cu dovezi. Lecția va fi folosită de copii, uneori SINGURI (la Tupilați, a VI-a și a VII-a au oră simultană, iar profesorul e cu cealaltă clasă).

## Legea
- `C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\05_STANDARD_LECTIE.md`: TOATE secțiunile (regulile 1-9, „Modul lecție”, „Ce au găsit judecătorii” 1-18).
- Profesorul, cu vorbele lui: „accent practic, instrucțiuni clare și ilustrate, practică chiar în pagină; conceptele simplu și pe rând; tot ce cerem să fie făcut să fie mai întâi expus/predat.”
- „Caietul” elevului = lecțiile noi anterioare ale clasei, din `lectii\<clasa>\m1-lNN\`. Ce e predat acolo poate fi folosit.
- Planul: `C:\00\Projects\Info_Gimnaziu_2026\data\unitati.json`. Programa: `C:\00\AI_0\data\informatica_gimnaziu\curriculum.json`. Ce ține de lecțiile următoare NU are voie să fie cerut.
- Numele RO: `...\calibrare\meniuri_ro_en.json`. Funcțiile Excel nu se traduc, panglica da. Un nume NESIGUR nu e greșeală dacă e dat și cel EN.
- Nu te baza pe ce spune autorul (`surse.md`, `afirmatii.json`): verifică.

## Ce faci, mereu
1. Citești configurația întreagă: pași, exemple, „altfel”, fiecare „Încearcă”/„Încă un exercițiu” cu `ajutor`/`why`, atelierul și testele lui, întrebările, pasul „Acum în aplicația adevărată”. Privești FIECARE imagine (Read) și o compari cu textul din acel loc; la imaginile noi verifici licența pe sursă.
2. **Fidelitatea simulatorului**, în Chromium headless (`python -m playwright`, 390 px cu atingere și 1280 px cu mouse și tastatură, cu TASTE REALE): drumurile pe care le-ar încerca un elev, inclusiv cele greșite. Simulatorul nu acceptă ce aplicația respinge și nu respinge ce aplicația acceptă. Unde nu ești sigur ce face aplicația, verifici în aplicația reală prin COM, cu instanță NOUĂ și INVIZIBILĂ (`DispatchEx`, `Visible=False`; PowerPoint: `Presentations.Add(WithWindow=False)`), fără salvare. `Quit()` numai pe instanța ta, iar la final `tasklist` nu mai arată nimic pornit de tine. Tastele se trimit ca taste reale, nu prin `FindKey().Execute()`, care ocolește comportamentul lor. Nimic pe ecranul vizibil al profesorului.
3. **Fișierul de descărcat pentru provocare**, dacă există: îl deschizi prin COM (invizibil), pe o copie, urmezi LITERAL pașii din „Acum în aplicația adevărată” și compari rezultatul cu ce promite lecția.
4. **Regulile 1-9 și lecțiile învățate:**
   - termen, tastă sau buton folosit înainte de explicație (inclusiv în indicii și în variante);
   - instrucțiuni ambigue sau care, făcute literal, nu dau ce promit;
   - verificări identice cu exercițiile;
   - practica sub 50% aplicare sau execuție;
   - analogii care răstoarnă sensul;
   - un copil singur care nu poate termina;
   - telefonul (zone sub 32-44 px, gesturi care nu există acolo);
   - focusul după „Verifică”;
   - reguli cu excepții nespuse.
5. Rulezi și tu `python C:/00/Projects/LearningHub/_campaign/revizuire_completa_2026_09/verificare_lectii/verifica_lectie.py <index.html> --fara-t1` și treci ultima linie în raport.

## Fiecare problemă
`gravitate` (GRAV = elevul se blochează, învață ceva fals sau nu poate face ce i se cere; MAJOR = îl încurcă serios; MINOR) · `regula` · `loc` · `citat` exact (≥12 caractere, verificat mecanic că apare în fișier) · `de_ce` · `reparatie_propusa` (concretă, în cuvintele lecției).

## Ieșiri
`lectii\<clasa>\m1-lNN\_verificare\judecator.json` + `judecator.md` (română simplă). Ultimele trei linii ale .md sunt pline; ultima = DOAR numărul de probleme GRAV. Scripturile le pui în `_verificare\`, nu în scratchpad. NU modifici lecția. NU faci commit. Windows + Git Bash: căi ABSOLUTE, fără `cd`; Python cu regex prin Write + rulare fișier, niciodată heredoc.

## Răspunsul final (scurt)
`{"grav":N,"major":N,"minor":N,"simulator":{"drumuri":N,"infidelitati":N},"provocare":"..","linia_fara_t1":"..","top3":["..."],"verdict":"publicabil|publicabil dupa reparatii|respinsa"}`
