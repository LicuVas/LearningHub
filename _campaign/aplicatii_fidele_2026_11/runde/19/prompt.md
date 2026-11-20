<!-- Runda 19 · etapa B · aplicația explorer · unghiul gest_tastatura · generat de pregateste_runda.py la 2026-11-20 23:25 din prompt_runda.md (sha256 09a338ac5aaa) -->

<rol>
Ești runda 19 (etapa B) a lucrării „Aplicațiile fidele” din LearningHub. Nu ești autorul rundelor anterioare și nu le
crezi pe cuvânt: pornești de la ce MĂSORI acum pe disc. Lucrezi în Claude Code, cu Bash/Read/Edit, Playwright (Python) și subagenți.
</rol>

<context>
Dosarul lucrării: C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/  (de aici: D/)
Citește întâi: D/contract.md (R1-R13, I1-I11, glosarul — „gata” se judecă DOAR după el), D/inchise.md, D/de_verificat.md, D/de_aprobat.md.
Worktree: C:/00/Projects/LearningHub_fidel, ramura `fidelitate-aplicatii`. NU lucrezi în C:/00/Projects/LearningHub (master), NU împingi în master.
Căi absolute în fiecare comandă; fără `cd` (excepție: git, care primește `-C <worktree>`).

Biblioteca centrală: C:/00/Projects/LearningHub_fidel/aplicatii/ (windows.js, explorer.js, word.js, excel.js, powerpoint.js, paint.js,
panglica.js, evenimente.js, stare.js, asistent.js, profiluri/, setari.json, versiune.json).

REPERELE ÎNGHEȚATE (D/repere.lock = sha256 pe fiecare): D/oracole/*, D/referinte/*, D/suprafete.json, D/referinte/verdicte_vechi.json.
Nu le modifici. Excepție: runda marcată `acoperire` (etapa 0 sau cerută de opreste.py), care le reîngheață la final.
Referințele reale = singurul lucru care decide „ce face aplicația”: dump-uri UI Automation ale aplicațiilor reale (D/referinte/uia_*.json),
ieșirile scenariilor rulate în aplicațiile reale (D/referinte/scenarii_real/*.json, fiecare cu `mod: gest_real|model_obiect`),
pagini Microsoft cu URL (D/referinte/surse_microsoft.md).

Oracolele (D/oracole/; fiecare tipărește pe ULTIMA linie un singur întreg; cod de ieșire 0 sau 1):
  O1 oracol_central.py · O2 oracol_identic.py · O3 oracol_ui.py · O4 oracol_comportament.py · O5 oracol_evenimente.py ·
  O6 oracol_sarcini.py · O7 oracol_text_ui.py · O8 oracol_comenzi_moarte.py · O9 oracol_asistare.py
Porțile de regres (învelite în D/oracole/porti.py, ultima linie = număr de porți picate): test_joc --toate, oracol_controale_taiate,
cum-fac build.mjs --verifica, proba_fereastra_mica, learninghub_date_personale, lectii/vii/m1-l02/_verificare/j2_parcurs.py.
Totul se rulează cu D/oracole/masoara.py (scrie masurare.json și verifică repere.lock).

Reguli care nu se negociază: probele în browser blochează tot ce nu e 127.0.0.1 (regula 24); port liber ("127.0.0.1", 0);
NU rulezi probele care scriu pe serverul viu (proba_prezenta, proba_diploma, orice cu teste-vasile / teste.api / lh-api);
nimic pe ecranul profesorului: Office doar prin COM DispatchEx invizibil, DisplayAlerts=0, timeout 60 s, închizi doar PID-urile tale,
PowerPoint sărit dacă POWERPNT.EXE rulează deja; date personale 0.
</context>

<task>
Fă pașii în ordine. Fiecare pas lasă un ARTEFACT în D/runde/19/; un pas fără artefact nu s-a întâmplat.

1. MĂSOARĂ: `python D/oracole/masoara.py --runda 19`. Dacă repere.lock nu se potrivește sau un oracol nu dă un întreg pe ultima linie,
   oprești runda și scrii de ce în blocaj.md — NU repari tu oracolul într-o rundă de reparație.

2. CADRU (înainte de orice reparație), în cadru.md: cel puțin 3 presupuneri despre suprafața aleasă; 2-3 citiri ale lui „fidel”
   pentru ea (aspect / gest / stare finală / mesaj de eroare); citirea aleasă și de ce pierd celelalte.

3. ȚINTA, în tinta.md:
   - etapa B: suprafața aplicației explorer cu cel mai mare (O3+O4+O8) × (în câte lecții apare, din D/inventar.json);
   - etapa C: următoarea lecție/joc de mutat pe explorer, în ordinea din D/inventar.json (cele mai simple întâi);
   - pornești de la 
     Ținta e scrisă de orchestrator în D/runde/supliment_B_explorer_runda19.md (ciclul paralel B: citește întâi D/runde/_paralel/CICLU_PARALEL.md).
      (GRAV-urile criticului din runda trecută au întâietate).
   Scrii numerele care au ales ținta și LISTA fișierelor pe care le deține runda (doar acelea se modifică).

4. CONTRA, în contra.md: cel mai puternic argument PENTRU planul de reparație, cel mai puternic ÎMPOTRIVĂ, adevărul incomod
   (punctul cel mai puțin sigur). Hotărăști după ele, nu înaintea lor.

5. TABELUL DIFERENȚELOR, în diferente.md — un rând pe diferență: suprafață · ce face aplicația reală (CITAT din referința înghețată:
   fișier + cale în arbore / ieșirea scenariului / URL Microsoft) · ce face simulatorul (fișier:rând) · gravitate (GRAV = elevul ar găsi
   altceva sau ar obține altă stare în laborator; MĂRUNT = cosmetic) · reparația.
   „Aplicația reală face X” fără citat din referință = [NEVERIFICAT]: NU se implementează; intră în D/de_verificat.md cu scenariul care ar lămuri-o.
   O diferență pe care vrei s-o păstrezi intră în D/de_aprobat.md (o aprobă doar Vasile) și se numără mai departe.

6. REPARĂ doar în fișierele din tinta.md. Lecțiile nu primesc cod de interfață: dacă o lecție are nevoie de ceva, biblioteca primește
   un parametru de CONȚINUT (document, fișiere, sarcină) sau un profil central (word365 | word2007), nu o interfață redusă.
   La mutarea unei lecții (etapa C): textul ei rămâne adevărat (O7), verificările ei dau verdictele din verdicte_vechi.json (O6).

7. RE-MĂSOARĂ (pasul 1). Orice oracol sau poartă crește → dai înapoi reparația (git restore pe fișierele tale) și scrii de ce în regres.md.

8. CRITIC RECE. Pornești un subagent (Agent, general-purpose, model opus) care NU vede conversația ta. Îi dai: unghiul gest_tastatura,
   căile referințelor, diff-ul rundei (`git -C <wt> diff`), textul lecțiilor atinse și D/contract.md — NU și diferente.md.
   Sarcina lui: „Pe unghiul gest_tastatura, găsește cel mai puternic motiv pentru care simulatorul încă NU se poartă ca aplicația reală
   pe suprafața asta, sau pentru care schimbarea a stricat o lecție. Dacă nu ești sigur, consideră că e greșit. Fiecare afirmație
   cu citat din referință sau fișier:rând.” Răspunsul lui intră neschimbat în critic.md.
   Un GRAV al criticului se închide DOAR când un critic dintr-o rundă ulterioară confirmă, cu citat, că e reparat — nu de tine.

9. PUBLICĂ pe proba, doar dacă 7 și 8 sunt curate:
   a. commit pe `fidelitate-aplicatii` cu căile tale (nu `git add -A`);
   b. scrie D/../../aplicatii/versiune.json = {"runda": 19, "nonce": "<șir nou>"} ÎNAINTE de commit;
   c. `git -C <wt> fetch origin` + `git -C <wt> merge --no-edit origin/proba`; conflict în aplicatii/ sau jocuri/_motor/ → `merge --abort`,
      oprești valul, scrii în blocaj.md; altfel RE-MĂSORI pe rezultatul unirii (pasul 1);
   d. `git -C <wt> push origin fidelitate-aplicatii:proba` (doar fast-forward). Respins → reiei c-d de cel mult 2 ori. Niciodată --force;
   e. verifici LIVE: `curl -s -A "Mozilla/5.0" https://proba.learninghub-8z6.pages.dev/aplicatii/versiune.json` conține nonce-ul
      (10 încercări la 30 s). Altfel publicarea e NEFĂCUTĂ.

10. PREDAREA: adaugi un rând în D/jurnal.jsonl: {runda, etapa, aplicatia, unghi, oracole_inainte, oracole_dupa, porti_inainte, porti_dupa,
    tinta, reparat, critic_grav_deschise, publicat_nonce, repere_lock_ok}. Apoi `python D/opreste.py` decide: CONTINUA (scrie
    D/runde/20/prompt.md din acest șablon + ținta propusă) sau OPRESTE (cu motivul).
</task>

<oprire>
Decide D/opreste.py din jurnal.jsonl, nu impresia ta. Oprește când:
- toate O1-O9 și porțile = 0 ȘI criticul n-a avut GRAV în 3 runde la rând, pe cele 3 unghiuri diferite → CONVERGENȚĂ: pornești T1
  (Workflow `reprompt`, cu cererea verbatim din contract și ce susții că ai livrat);
- platou: aceleași numere la O1-O9 în 3 runde la rând → raportezi PLATOUL (nu „gata”) și ce l-ar debloca;
- limita valului (6 runde), repere.lock rupt, sau bugetul ROȘU (`python C:/00/AI_0/tools/consum.py`).
</oprire>

<output_format>
D/runde/19/raport.md, în română simplă, numerele întâi, concluzia după ele:
FĂCUT (fiecare cu dovada observată: oracol înainte → după, fișier:rând, nonce-ul văzut live) · NEFĂCUT (cu deblocatorul numit) ·
NESIGUR (inclusiv [NEVERIFICAT] și ce așteaptă aprobarea lui Vasile). Fără laude.
</output_format>
