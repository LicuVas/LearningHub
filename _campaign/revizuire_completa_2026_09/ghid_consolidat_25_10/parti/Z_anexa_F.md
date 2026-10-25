## Anexa F — Reluarea, publicarea de mână, uneltele, modelele de prompt (din `08_RELUARE.md`, păstrate întocmai)

### F.0 Primii 5 minute la reluare (actualizat 25.10.2026)
1. Citește Partea I a acestui ghid întreagă, apoi VI.3 (dirijorul), VII (operarea), IX (deciziile și deschisele) și X (hotărârile).
2. Starea lecțiilor, calculată acum (nu din memorie): `python C:/00/Projects/LearningHub/_campaign/revizuire_completa_2026_09/dirijor/stare.py` (sau `--modul M3`).
3. Jurnalul dirijorului, ultimele secțiuni: `04_ORCHESTRARE.md` (ce s-a făcut, cu commituri și dovezi).
4. `git -C C:/00/Projects/LearningHub status --short | head` și `git log -5 --oneline` — depozitul e folosit și de alte sesiuni; nu presupune că e curat.
5. Verifică publicarea înainte de orice lucru nesupravegheat: `python C:/00/AI_0/tools/push_ready.py --repo C:/00/Projects/LearningHub` (exit 0).

### F.4 Publicarea (din `08_RELUARE.md` §4, 28.09-06.10)

**Standardul din 28.09 seara = UN SINGUR SCRIPT cu porți** (comite și împinge DOAR dacă trece fiecare poartă; ultima linie = 0):
```
python C:/00/Projects/LearningHub/_campaign/revizuire_completa_2026_09/dirijor/publica_lectie.py <clasa>/<modul>-lNN [<alta>/…] [--fara-push]
```
Rulează-l în fundal, cu `timeout 5400` în jur (10-60 min: `build_lectii` re-testează în browser FIECARE lecție publicată, iar cu mulți agenți pe calculator trece de 15 min — scriptul îi dă 3600 s, iar un timeout contează ca poartă picată). Face în ordine pașii de mai jos, adaugă singur extensiile `_sim` din `<script src>`, reia o dată `test_joc` dacă pagina n-a pornit sub încărcare („întrebări jucate: None”), iar dacă pică o poartă NU comite și îți spune cum readuci `plan.json`. De ce există: pe 28.09 un `[PICAT]` s-a pierdut într-o comandă înlănțuită și lecția VII/1 a plecat live nevăzută (s-a dovedit un artefact de încărcare, dar regula rămâne: **niciodată verificări + commit în aceeași comandă înlănțuită**).

Pașii, dacă vreodată trebuie făcuți de mână:
```
python C:/00/Projects/LearningHub/_campaign/revizuire_completa_2026_09/dirijor/dirijor_publica.py <clasa>/<modul>-lNN     # stare=publicat + insigna
python C:/00/Projects/LearningHub/lectii/_build/build_lectii.py            # → 0
python C:/00/Projects/LearningHub/lectii/_build/verifica_linkuri.py        # → 0
python C:/00/Projects/LearningHub/lectii/_build/plan_din_calendar.py --verifica   # → 0
python C:/00/Projects/LearningHub/_campaign/revizuire_completa_2026_09/verificare_lectii/curata_metadate.py   # → 0 (fișierele Office de descărcat)
python C:/00/AI_0/tools/learninghub_date_personale.py                    # → 0 (regula 27; --curata dacă nu)
python C:/00/Projects/LearningHub/jocuri/_motor/test_joc.py --dir C:/00/Projects/LearningHub/lectii/<clasa> <modul>-lNN   # TRECUT
python C:/00/Projects/LearningHub/_campaign/revizuire_completa_2026_09/verificare_lectii/verifica_lectie.py <index.html> --fara-t1   # → 0
grep -o 'src="[^"]*_sim/[^"]*"' <index.html>    # extensiile noi din lectii/_sim/ trebuie comise ÎMPREUNĂ cu lecția
git -C C:/00/Projects/LearningHub add <dosarul lecției> <extensiile _sim noi> lectii/index.html lectii/plan.json lectii/<clasa>/index.html
git commit (mesaj: ce, câte treceri de judecător, porțile) ; GIT_TERMINAL_PROMPT=0 GCM_INTERACTIVE=never timeout 90 git push
MSYS_NO_PATHCONV=1 python …/dirijor/dirijor_verifica_live.py "/lectii/<clasa>/<modul>-lNN/|lectie_<clasa>_<modul>_lNN" "/lectii/_sim/<ext>.js|function"
MSYS_NO_PATHCONV=1 python …/verificare_lectii/fum_live.py /lectii/<clasa>/<modul>-lNN/     # 390+1280, 0 erori, 0 cereri spre teste-vasile
```
- **NICIODATĂ `git add -A`** — alte sesiuni lucrează în același depozit. Doar fișierele numite.
- **La o lecție REPUBLICATĂ, marcajul `lectie_<clasa>_…` nu dovedește nimic** — există și în versiunea veche (29.09.2026: „marcaje LIVE: 0” a trecut, iar V/1, VI/1, VII/1 încă se serveau vechi câteva minute). De aceea `publica_lectie.py` are acum poarta „conținut LIVE = fișierul publicat”: așteaptă (cel mult 10 min) până pagina de pe sit e identică cu `index.html` comis.
- Situl răspunde 200 la orice adresă: dovada e MARCAJUL din pagină, nu codul 200. Urllib cu User-Agent de Python e blocat de Cloudflare — scriptul folosește User-Agent de browser.
- Git Bash strică argumentele care încep cu `/` → `MSYS_NO_PATHCONV=1`.
- Build-ul + linkurile: 2-3 minute pe calculatorul liber, peste 15 minute cu 8 agenți la lucru (28.09): rulează-le în fundal (`run_in_background`). Publică mai multe lecții ÎMPREUNĂ când se poate — build-ul costă la fel pentru una sau pentru patru.

### F.5 Uneltele (din `08_RELUARE.md` §5)

| Unealtă | Unde | La ce |
|---|---|---|
| `stare.py` | `dirijor\` | starea lecțiilor + ultimul verdict de judecător |
| `publica_lectie.py` | `dirijor\` | PUBLICAREA standard: toate porțile → commit pe fișiere numite → push → marcaje + fum live (ultima linie 0) |
| `dirijor_publica.py` | `dirijor\` | marchează lecția publicată în plan.json |
| `dirijor_verifica_live.py` | `dirijor\` | marcaje pe situl live |
| `fum_live.py` | `verificare_lectii\` | proba de fum live, 390/1280, rețea blocată |
| `lacat_office.py` | `verificare_lectii\` | lacătul PowerPoint (`ia` / `reinnoieste` / `elibereaza`, 60 min) |
| `curata_metadate.py` | `verificare_lectii\` | numele contului Office din .docx/.pptx/.xlsx (`--curata`) |
| `scoate_bara_docx.py` | `verificare_lectii\` | scoate bara galbenă „removePersonalInformation” dintr-un .docx, fără Word |
| `curata_mru_office.py` | `verificare_lectii\` | urmele probelor din lista „Recent” Office (`--sterge`, cu Office închis) |
| `proba_profil_motor.py` | `verificare_lectii\` | motorul pornește cu elev înscris fără progres (control inclus) |
| `verifica_lectie.py` | `verificare_lectii\` | linia de verificare S0-T1 (`--fara-t1`) |
| `learninghub_date_personale.py` | `C:\00\AI_0\tools\` (PRIVAT) | regula 27 — date personale în ce se publică |
| `rezultat_elev_proba.py` + `_mutanti.py` | `lectii\_sim\_teste\` | matricea componentei comune (21 cazuri, 18 mutanți) |
| `proba_stari.py`, `proba_intreaba.py`, `proba_tinte32.py` | `motor_lectie\` | probele motorului / prezenței |
| `activitate.py lista` | `C:\00\AI_0\tools\` | panoul de activitate al profesorului (verifică să nu apară elevi de probă) |

### F.7 Modele de prompt (din `08_RELUARE.md` §7; „Citește întâi … 07_BRIEF_AUTOR.md / 06_BRIEF_JUDECATOR.md” rămâne valabil — briefurile trimit la acest ghid)

**Autor (predare):**
> Citește întâi și urmează întocmai `C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\07_BRIEF_AUTOR.md`.
> **Lecția ta:** <CLASA>, <MODUL>, nr. <N> — „<titlu din plan.json>” (<tip>). Dosarul: `lectii\<clasa>\<modul>-l<NN>\`, cheia `lectie_<clasa>_<modul>_l<NN>`. Lecțiile <…> ale clasei sunt PUBLICATE (`lectii\<clasa>\…`); nu le repeți și nu le contrazici.
> **Granița cu lecția <N±1>** (alt autor, în paralel): lecția <…> = <…>. Tu NU predai <…>. Tu predai: <lista concretă>.
> **<Aplicația> reală:** <faptele care trebuie probate; capcanele cunoscute din standard — ex. Excel RO nu traduce funcțiile, separatorul `;` vine din Windows>.
> **Practica:** „Încearcă” de aplicare (<exemple>), atelier în pagină (<simulator; extensie nouă dacă trebuie>), „Acum la calculatorul din laborator” fără profesor (<ce face; ce NU schimbă pe calculatorul comun; salvarea după regulile 23 și 26>).
**Autor (mini-proiect / evaluare):** la fel + „Nu predai nimic nou; ghidezi… cu trimiteri exacte `../m1-l0N/`. Cerințele, criteriile și punctajul DOAR din documentele profesorului (`Info_Gimnaziu_2026`, `Proiectul_unitatii_*.md`, `SISTEM_EVALUARE.md`); dacă lipsesc, spui în `surse.md` și NU inventezi.”
**Judecător:**
> Citește întâi și urmează întocmai `…\06_BRIEF_JUDECATOR.md`. Din `05_STANDARD_LECTIE.md` aplici strict regulile 22, 24, 25, 26 (<detaliate scurt>).
> **Lecția ta:** `…\index.html` — <titlu>, cu fișierele de lângă ea (<listă, cu nr. de afirmații probate>) și extensia nouă `<…>`.
> **Atenție specială:** <arbitrul Office obligatoriu + faptele de probat>; <numele RO nesigure>; <granița cu vecinii / acordul cu lecțiile publicate>; <fișierul de descărcat: metadate 0, conținut>; <laboratorul comun>; <plafonul de pași>; telefon 390 px cu atingere + 1280 px până la diplomă.
**Reparare:** „Reparare <lecția> după judecător: X GRAV, Y MAJOR, Z MINOR. Citește întreg `…\_verificare\judecatorN.md` (și `.json`). <GRAV/MAJOR, fiecare cu reparația>. MINOR: toate din judecatorN.md. Porțile din brief. Nu faci commit. Răspunsul final: JSON-ul din brief + reparațiile cu locul lor.”

