# Ești sesiunea de SALVARE a turei de noapte 20→21.11.2026 („Aplicațiile fidele”, LearningHub)

## Ce s-a întâmplat
- **Sesiunea-dirijor a murit.** Agenții ei din fundal au murit odată cu ea.
- **Vasile doarme.** A spus: „noaptea asta e a ta”.
- **Ritualul de noapte** e în `C:/00/AI_0/.claude/skills/noapte-buna.md`: nu întrebi nimic și nu pornești lucruri noi, cerute de altcineva.
- **Tu continui campania**, după regulile ei.

## Citește întâi
1. `D/STARE_ORCHESTRATOR.md`, ultimele 5 intrări. D = `C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11`.
2. `D/runde/_paralel/CICLU_PARALEL.md`: cele 4 benzi ale ciclului A sunt r15 Explorer, r16 Word, r17 Excel și r18 Windows.
3. Fișa de memorie `C:/Users/<cont>/.claude/projects/C--00-AI-0/memory/project_aplicatii_fidele_learninghub.md`. Calea o găsești cu `es.exe project_aplicatii_fidele_learninghub.md`.

## Ce faci
1. **Starea fiecărei benzi.** Pentru fiecare N din 15, 16, 17, 18, citești `D/runde/N/`:
   - `gata_pentru_critic.md` cu ultima linie `GATA_PENTRU_CRITIC` = constructorul a terminat;
   - `stare_autor.md` cu ultima linie `PREDARE` = pornești un constructor nou din `stare_autor.md`;
   - fără niciuna dintre ele = constructorul a murit la mijloc. Pornești unul nou, cu același prompt: citește `CICLU_PARALEL.md`, `runde/N/prompt.md`, suplimentul `runde/supliment_B_<app>_rundaN.md` și `stare_autor.md`, dacă există.
2. **Agenții îi pornești ÎN PRIM-PLAN.** Ești în `claude -p`, iar fundalul moare la finalul turei.
   - Mai mulți agenți deodată = mai multe apeluri Agent în același mesaj. Model opus, `general-purpose`.
3. **Criticul rece pe fiecare bandă terminată** (subagent opus, fără conversația ta):
   - unghiul din `runde/N/prompt.md` (pasul 8);
   - ieșirea în `runde/N/critic.md`, cu ultimele linii `GRAV_VECHI_DESCHISE: n` și `GRAV: n`.
   - Model de prompt: `runde/14/critic.md` (structura).
4. **Măsurarea comună.** Când toți constructorii au terminat și NIMIC altceva nu rulează:
   - `python D/oracole/masoara.py --runda 15 --paralel 3 --compara D/runde/15/masurare_pornire.json --timeout O6=3600`;
   - rezultatul îl copiezi în `runde/16`, `17` și `18`, ca `masurare.json`.
5. **Jurnalul.** Câte un rând pe bandă în `D/jurnal.jsonl`, după modelul rândurilor existente:
   - `oracole_inainte` / `oracole_dupa` din `masurare_pornire.json` / `masurare.json` › `pentru_jurnal`;
   - `critic_grav_deschise` = `GRAV` din `critic.md`;
   - `"val": "B-word#2"` la r16 și `"val": "B-excel#2"` la r17.
6. **Oprirea.** Pentru fiecare bandă rulezi `python D/opreste.py --fara-prompt --jurnal <copie filtrată doar cu rândurile valului ei>`.
7. **Commit-ul**, pe căi explicite (niciodată `-A`), fără date personale (grep pe diff-ul pus în stage):
   - `git -C C:/00/Projects/LearningHub_fidel add <căi>`;
   - `git commit` cu ultima linie „Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>”.
   - Push DOAR `fidelitate-aplicatii:proba`, DOAR cu criticul la GRAV 0 pe toate aplicațiile publicate. Altfel nimic publicat.
8. **Ciclul următor.** Scrii suplimentul fiecărei benzi care continuă: ținta = GRAV-urile criticului ei. Apoi:
   - `python D/pregateste_runda.py <N nou> --etapa B --aplicatia <app> --tinta "..."`;
   - numerele noi sunt 19, 20, …; unghiul = N mod 3.
9. **Starea pe drum.** Intrare în `D/STARE_ORCHESTRATOR.md` la fiecare pas și `python C:/00/AI_0/tools/job_etape.py semn --id aplicatii-fidele`.
10. **La final (~07:30)**, raportul de dimineață: `python C:/00/AI_0/tools/fleet.py raport-noapte`, în cuvinte simple.

## Granițe
- Nimic pe ecranul omului; probele în browser rulează headless, doar pe 127.0.0.1/localhost.
- Nicio aplicație Office reală: WINWORD-ul deschis e al omului.
- PowerPoint e blocat (PID 19528) până la o repornire: nu-l atingi.
- Paint și repornirea așteaptă DA-ul lui Vasile.
- Nimic pe master. Date personale 0. Nicio cale `C:/Users/<cont>` în fișierele scrise.
