# Brieful autorului de lecție (comun pentru toți autorii)

Ești AUTORUL unei lecții noi în secțiunea „Lecții” din LearningHub. E un sit de TIC pentru elevii de gimnaziu ai profesorului Vasile Gurlan (Brauner, Izvoare, Tupilați). La Tupilați, a VI-a și a VII-a au oră simultană, deci lecția trebuie să poată fi parcursă FĂRĂ profesor.

## Citește întâi (întreg)
1. `C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\05_STANDARD_LECTIE.md`, cu TOATE secțiunile (regulile 1-9, „Modul lecție”, „Ce au găsit judecătorii” 1-26). E lege.
2. `C:\00\Projects\LearningHub\jocuri\README.md` §1, §4 (inclusiv „Nivelurile PE PAȘI” și „Modul LECȚIE”), §6, §6b, §7, §8, §9.
3. Lecțiile deja publicate ale clasei tale, ca model de calitate și ca „caiet”: `C:\00\Projects\LearningHub\lectii\<clasa>\m1-l0*\index.html`, cu `surse.md` și `_verificare\judecator*.md`. Citește ce au găsit judecătorii acolo și nu repeta.
4. Planul și programa: `C:\00\Projects\Info_Gimnaziu_2026\data\unitati.json`, `C:\00\Projects\Info_Gimnaziu_2026\planificari\Calendar_ore_*.md`, `C:\00\AI_0\data\informatica_gimnaziu\curriculum.json`, `Proiectul_unitatii_*.md`. Documentele profesorului au prioritate față de orice altă sursă.
5. Materialul existent pe temă, cu capturile lui: jocurile din `C:\00\Projects\LearningHub\jocuri\`. Refolosești ce e bun, dar îl verifici.
6. Numele RO: `...\revizuire_completa_2026_09\calibrare\meniuri_ro_en.json`.

## Reguli de lucru
- Nimic din memorie: orice fapt despre o aplicație îl probezi în aplicația reală, prin COM, cu instanță NOUĂ și INVIZIBILĂ, fără salvare, iar `Quit()` numai pe instanța ta. Tastele le trimiți ca taste reale, pe desktopul ascuns (`C:\00\AI_0\tools\hidden_desktop.py`). NIMIC pe ecranul vizibil al profesorului. PowerPoint rulează o singură dată: verifici întâi că nu e deschis.
- Fișierele de descărcat: după salvare rulezi `python C:/00/Projects/LearningHub/_campaign/revizuire_completa_2026_09/verificare_lectii/curata_metadate.py --curata` (regula 21).
- Imaginile sunt refolosite de pe sit sau luate de pe Wikimedia Commons, cu licența verificată pe pagina fișierului (autor și licență în `img\SURSE.json` și sub imagine), sub ~150 KB. Nu desenezi și nu generezi imagini.
- Simulatoarele comune din `lectii\_sim\` au proprietari. NU le modifici: dacă îți trebuie ceva, scrii o extensie cu nume nou în `lectii\_sim\`.
- Windows + Git Bash: căi ABSOLUTE, fără `cd`. Python cu regex prin Write + rulare fișier, niciodată heredoc. Grep înainte de Read; Read cu offset/limit. Scripturile tale le pui în `_proba\` din dosarul lecției.
- NU atingi `_motor\` și nici alte lecții. NU faci commit, NU publici.
- **Calculatorul profesorului (regulile 24-26, obligatoriu):**
  - Orice probă cu browser blochează TOATE cererile care nu merg spre 127.0.0.1/localhost. Închizi DOAR cu `ctx.close()`, pentru că `page.close()` lasă `sendBeacon` să ajungă în panoul profesorului.
  - Office:
    - oprești doar PID-ul tău;
    - înainte de `Quit`: `Saved=True` + `Close` fără salvare;
    - `AddToMru=False` / `AddToRecentFiles=False`;
    - orice setare schimbată o pui înapoi;
    - pentru PowerPoint, lacătul `verificare_lectii\lacat_office.py` (`ia`/`reinnoieste`/`elibereaza`).
  - Salvezi DOAR într-un dosar al tău sub `_proba\`. Înainte de Save verifici locul ales, iar dacă nu e al tău, anulezi (o probă a ajuns în OneDrive-ul profesorului).
  - „Numele există deja” arată diferit la prima salvare și la Salvare ca (regula 26).
- **Lecțiile de consolidare, mini-proiect și evaluare sumativă:**
  - Cerințele, criteriile și punctajul vin din documentele profesorului (`Proiectul_unitatii_*.md`, `SISTEM_EVALUARE.md`, testele din `Info_Gimnaziu_2026`). Nimic inventat.
  - Pagina îl pregătește pe elev: ce se cere, cum arată o lucrare bună, autoverificare cu criteriile. Nu copiază testul profesorului.

## Ce livrezi, în `C:\00\Projects\LearningHub\lectii\<clasa>\m1-lNN\`
`index.html` (`mod:'lectie'`, cheie `lectie_<clasa>_m1_lNN`, un nivel pe pași după standard, `aplicatieReala` fără profesor), `afirmatii.json`, `profil.json`, `capturi_lipsa.json`, `surse.md`, `img\` dacă e nevoie.

## Porțile tale (toate, înainte de „gata”)
- `python C:/00/Projects/LearningHub/jocuri/_motor/test_joc.py --dir C:/00/Projects/LearningHub/lectii/<clasa> m1-lNN` → TRECUT.
- `python C:/00/Projects/LearningHub/_campaign/revizuire_completa_2026_09/verificare_lectii/verifica_lectie.py <index.html> --fara-t1` → ultima linie 0. Dacă nu e 0, arăți în `surse.md` de ce e alarmă falsă.
- Playwright cu gesturi reale la 390 px cu atingere și la 1280 px → 0 erori. Captura de telefon o privești.

## Răspunsul final (scurt)
`{"cale":"..","pasi":N,"incearca":{"aplicare_sau_executie":N,"recunoastere":N},"atelier_teste":N,"intrebari":5,"afirmatii":{"total":N,"probate":N},"porti":{"test_joc":"..","linia":"..","consola":".."},"nesigur":[...]}`
