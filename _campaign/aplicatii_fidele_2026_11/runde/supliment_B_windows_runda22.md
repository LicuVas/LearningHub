# Supliment la promptul rundei 22 (valul B-windows, a doua rundă; ciclul paralel B) — scris de orchestrator, 20.11.2026

Se citește DUPĂ `runde/22/prompt.md`. Regulile ciclului paralel (`runde/_paralel/CICLU_PARALEL.md`) rămân în vigoare: fișiere proprii/comune, fără git care scrie, fără `masoara.py` întreg, `LH_IESIRE`. În ciclul B, benzile sunt r19 Explorer, r20 Word, r21 Excel, r22 Windows.

## Unde suntem
- **Runda 18** a construit Windows 11 în bibliotecă (`runde/18/raport_constructor.md`; commit-urile 59af7e74 și 1d4c5a3f).
- **Criticul rece 18** (`runde/18/critic.md`, unghiul aspect) a găsit **5 GRAV**, cu proba și cauza. Codul comun nu e stricat: adăugirile din `aplicatii.js` și `poligon.html` sunt curate.
- **Pornirea** e `runde/22/masurare_pornire.json`, adică măsurarea comună de la finalul ciclului A. Unghiul rundei: `gest_tastatura`.

## Ținta rundei 22 = cele 5 GRAV din `runde/18/critic.md`, în ordinea asta
1. **W1** — meniul nou de clic dreapta pe desktop. Fundalul acoperă doar 2 din 10 rânduri, iar „Nou” și „Afișați mai multe opțiuni” ies din ecran.
   - Cauza numită de critic: `genereaza_windows.py:304` ia `ferestre[1]` în loc de `ferestre[0]`.
   - Regenerezi `date/windows.json` și verifici toate suprafețele generate din ferestre multiple.
2. **W4** — File Explorer pe bara de activități: dosarul galben (Fluent) cu numele la trecerea mouse-ului. Clicul deschide Explorer-ul din bibliotecă (`aplicatii/explorer.js`, banda r19), prin modul de montare pe care îl expune.
   - Dacă Explorer nu expune un mod de montare: îl ceri prin `de_aprobat.md` (A22-…) și pui doar butonul cu evenimentul §4. Nu editezi `explorer.js`, e al benzii r19.
   - Criticul spune că drumul apare în 10 lecții.
3. **W3** — tastarea cu Start deschis („pai”, „calc”, cerute de `lectii/v/m2-l08`) caută ca în Windows: caseta de căutare din Start primește literele, iar rezultatul e aplicația potrivită (Paint, Calculator).
   - Ce nu are referință (panoul de rezultate) e simplu și onest. Rând `R22-…` + mesajul central acolo unde nu e simulat (R12: nu tace).
   - ATENȚIE: criticul Explorer (`runde/15/critic.md`, E1) a găsit că mesajul central dispare la redesenare (`aplicatii.js:229`). Reparația COMUNĂ o face banda Explorer (r19). Tu NU atingi `aplicatii.js:229`. Dacă la Windows mesajul dispare din cauza unei redesenări din `windows.js`, o repari doar în `windows.js`.
4. **W2** — Start › Toate se derulează la rotiță, la tastatură și cu degetul, și are toate cele 7 categorii din `start_toate`.
5. **W5** — I1 pe telefon (360-390 px): butoanele ferestrei (Minimizare / Maximizare / Închidere) rămân pe ecran, iar butonul Explorer din bară se vede, fie direct, fie prin derulare.
- **Apoi**, cât îți ajunge contextul, MINOR-urile din `runde/18/critic.md`.

## Gata înseamnă
- `runde/22/proba_grav.py`: verificările picate la pornire și câte pică la final, pe gesturi reale.
- `raport_constructor.md`: W1-W5 fiecare ÎNCHIS cu dovada de azi sau NEÎNCHIS cu motivul; secțiunea „Fișiere comune atinse”.
- Ultima linie din `gata_pentru_critic.md`: `GATA_PENTRU_CRITIC`. Sau, la ~200k de context, `PREDARE` în `stare_autor.md`.
