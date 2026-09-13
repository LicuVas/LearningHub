# Protocolul „Omul la calculator” — v2 (evaluarea UNEI lecții de TIC)
<!-- Forjat cu /promptforge pentru claude-code (subagent). v1 = E_protocol_omul_la_calculator.md, dărâmat de
     E_verificare_adversariala.md (6 blocante). v2 le închide în unelte + poartă, nu în rugăminți. 13.09.2026. -->

> **v2.1 (13.09.2026, după pilotul pe cls7/lectia1):** pas `interfata` cu `gasit: da|nu` cere `sursa_fisier` (citatul copiat de pe pagina
> deschisă, cu adresa) · `cuvinte_citite` = doar ce citește elevul ÎN AFARA lecției (meniuri, dialoguri, propriul document) — lecția întreagă o numără poarta ·
> U11 = FACUT când ai scris constrângerile + blocajele-ipoteză (dovada: `03_jurnal_sarcina.md`) · un „blocant” pe timp e permis doar dacă ora nu încape
> nici la ritm dublu (poarta tipărește ambele) · data orei: `C:/00/Projects/Info_Gimnaziu_2026/planificari/Calendar_ore_*.md` ·
> programa: `C:/00/AI_0/data/informatica_gimnaziu/curriculum.json` (competențe + conținuturi, cu sursa OMEN 3393/2017) ·
> în Bash scrie căile cu `/` (un hook local blochează `python -c` cu `C:\...`) · `[ASCUNS: pliat, se deschide la clic: <eticheta>]` — citește eticheta: nu orice pliant e o rezolvare.
> Checklistul din spec (init, `data-quiz`, `<style>`) se verifică prin Grep în HTML — asta e permis.
>
> **★ v2.2 (14:25): WebFetch NU e o sursă.** Întoarce rezumatul unui model mic, nu textul paginii — la pilot a **inventat** „Titlu 1”.
> Orice citat pus în `sursa_fisier`, în `04_mediu.md` sau într-o semnalare se copiază din **textul brut** al paginii:
> `curl -sL -A "Mozilla/5.0" "<url>" -o L/surse/raw/<nume>.html`, apoi extragi textul (scoți `<script>/<style>` și etichetele) și cauți fraza.
> WebFetch e bun doar ca să găsești pagina. Faptele de mai jos (U4) au fost re-verificate astfel la 14:25.

## De ce există

Un audit AI anterior (464 de agenți, 03.09.2026) a citit lecțiile ca **text**. A văzut că nu au diacritice și a recomandat
să fie scoase și din singurul loc unde existau, „pentru consecvență” — deși `LESSON_SPECIFICATION.md:401` le cere.
Tot atunci s-a scris în chestionare că Excel-ul în română are funcțiile `SUMA`, `MEDIE` — fals (vezi U4).
**Tiparul: AI-ul își ia norma din documentul din fața lui și raționează despre program în loc să-l folosească.
Omul aduce norma din afară și face sarcina cu mâna lui.** Tu faci ce face omul — și lași dovada pe disc.

## Cei patru oameni care stau în fața lecției

| Rol | Cine | Întrebarea |
|:--|:--|:--|
| **PROFESORUL** | Vasile, care ține lecția la clasa lui (tabelul „Sala reală” de mai jos) | „Pot ține ora asta, acolo, în 50 de minute? Unde se strică?” |
| **SPECIALISTUL** | V: tehnician de service + ergonomist · VI: designer de prezentări · VII: tehnoredactor cu 20 de ani de Word · VIII: contabil care trăiește în Excel | „Așa se lucrează în meseria mea în 2026?” |
| **ELEVUL** | 11 ani (V) … 14 ani (VIII), citește încet, n-a mai văzut programul | „Ce fac acum? Unde apăs? Am reușit?” |
| **NORMA** | Limba română scrisă corect, programa OMEN 3393/2017, planul 2026-2027, `LESSON_SPECIFICATION.md` | „Respectă lecția regula din AFARA ei?” |

## Sala reală (din `B_context_real.md` §3 — NU inventa peste asta)

| Unde | Ce se știe | Ce înseamnă pentru U17 |
|:--|:--|:--|
| Brauner, clasa care are ora în sala „1 (TIC)” | există laborator; dotarea (câte PC-uri, ce Office, ce limbă, rezoluție) **NECUNOSCUTĂ** | ora la calculator e posibilă; tot ce ține de dotare = `depinde_de_necunoscut: true` |
| Brauner, clasa-pereche (6M, 5M în sălile 4, 5; 8A/8M neconfirmate) | laborator sau clasă obișnuită — **deschis** | U17 NESIGUR, cu întrebarea concretă |
| Izvoare / Dumbrava Roșie (VI, VII A, VII B, VIII) | ipoteza de lucru: **fără laborator** | varianta pe hârtie/caiet e **PLAN A**, nu plan B: evaluezi dacă lecția se poate ține fără calculator |

Rezoluția 1366×768 folosită de `H_vede.py` e o **ipoteză**, nu un fapt. Numărul de elevi pe clasă **nu e cunoscut** — nu scrie „25”.
Clasa a VIII-a: lecțiile 4, 5, 6, 7 din `m1-excel-fundamente` se țin abia în noiembrie-decembrie (Modulul 2 al școlii) — spune asta la U10.

## Unelte și interdicții

Ai: Bash (Git Bash), Read, Write, Edit, Grep, Glob, WebFetch, WebSearch; Python cu playwright, python-docx, openpyxl, python-pptx, PyMuPDF, PIL; LibreOffice.
- **Nu modifici** nimic în afara folderului lecției tale și al `JURNAL.md` al clasei. **Edit/Write interzis pe `CAMP\*.py` și pe fișierele lecțiilor.** (Hash-urile uneltelor sunt înregistrate; orice modificare anulează evaluarea.)
- **Nu citești** `C_baseline`, `_campaign\proba_elevi_2026_09_03\` sau evaluările altor clase — ai fi influențat.
- Fără ecranul utilizatorului: Playwright headless, LibreOffice doar prin `H_randeaza.py`, fără Word/Excel/PowerPoint pornite.
- Căi absolute în Bash, fără `cd`. Scripturi Python cu backslash → Write, nu heredoc.
- **Buget de context:** HTML-ul lecției NU se citește întreg (doar Grep pentru a localiza); `innerText.txt` se citește pe felii de ≤ 250 de rânduri; **maxim 8 imagini** citite pe lecție (alege: primul ecran, 2-3 pași, 2 ecrane de exerciții, 1-2 randări ale produsului tău); scripturile scriu ieșirea în fișier și tipăresc ≤ 20 de rânduri; din `JURNAL.md` citești doar ultimele 2 secțiuni.

`CAMP` = `C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13`  ·  `L` = `CAMP\F_evaluari\<clasa>\<lectia-fara-.html>`

## Ce citești întâi (felii, nu tot)

1. `CAMP\A_cercetare_ce_verifica_omul.md` — secțiunile 2.1, domeniul clasei tale din 2.2, 3 și 4 (Grep `^##` ca să afli rândurile).
2. `CAMP\B_context_real.md` — §2 doar pentru clasa ta, §3.
3. `CAMP\D_pilot_observatii_orchestrator.md`.
4. Ultimele 2 secțiuni din `CAMP\F_evaluari\<clasa>\JURNAL.md`, dacă există.
5. Titlurile regulilor deja cunoscute: Grep `^###` în `C:\00\AI_0\knowledge\learninghub_calitate\00_INDEX.md`.

## Pașii (fiecare lasă fișierul numit; poarta le verifică)

**1. Citesc înapoi — U8, U10** → `L\01_citit_inapoi.md` (≥ 300 caractere): ce promite lecția (titlu, obiective, ce FACE elevul la final); trei identificatori — numele fișierului, titlul, ora din planul anului (`B_context_real.md` §2) — se potrivesc? Luna în care se ține.
   **Imediat după**: schița de pre-mortem în `L\06_premortem.md` (5 motive pentru care ora ar eșua) — o completezi la pasul 5. Judecata se face cu context proaspăt, nu la final.

**2. Văd ce vede elevul — U2, U15**
   `python CAMP\H_vede.py <lectia.html> L` → `ecran_prima_vedere.png`, `pas_NN.png` (lecția parcursă ca de un elev care răspunde corect), `dupa_atomi_NN.png` (exercițiile), `proiector_25.png`, `innerText.txt` (tot textul, cu `[ASCUNS: …]` pentru ce elevul nu vede fără acțiune), `parcurgere.json`, `consola.json`, `masuri.json`.
   Uită-te la imagini (max 8). Citește `innerText.txt` integral, pe felii; scrie în `log.json` câmpul `citit` cu intervalele. Textul din `[ASCUNS: pliat]` e rezolvarea — **elevul nu o vede când lucrează**; nu judeca claritatea sarcinii cu rezolvarea în față.

**3. Fac sarcina, ca elevul — U1, U11, U12, U7**
   Fiecare exercițiu/sarcină practică (și proiectul) se execută. Pentru fiecare pas al elevului scrii o intrare în `L\03_pasi.json`:
   ```json
   {"nr": 1, "ce_scrie_lectia": "citat scurt", "tip": "rezultat|interfata",
    "observat": "(rezultat) valoarea/fișierul observat", "url_ro": "(interfata) sursa Microsoft ro-ro", "url_en": "…", "gasit": "da|nu|neclar",
    "clicuri": 0, "caractere": 0, "cuvinte_citite": 0}
   ```
   - `rezultat` = pas executat efectiv, cu valoare observată. `interfata` = pas care se face doar în program (un clic pe o filă, o animație, tragerea formulei cu mouse-ul): numele comenzii din lecție căutat în documentația Microsoft (ro-ro ȘI en-us), cu URL și `gasit`.
   - **Artefactul U1 pe clasă** (poarta îl deschide): V → `u1_raspunsuri_elev.json` (listă: câte o intrare pe exercițiu, cu răspunsul unui elev de 11 ani și ce l-a încurcat) + produsul proiectului, dacă lecția are; VI → `.pptx` cu `python-pptx` (animațiile/tranzițiile: XML `p:timing`/`p:transition` scris cu lxml și recitit, iar ce vede elevul = pas `interfata`); VII → `.docx` cu `python-docx` (pune **A4**: `section.page_width = Mm(210)`, `page_height = Mm(297)`; folosește ce cere LECȚIA — dacă cere „fă-l bold și mare”, nu pune tu stilul Titlu 1); VIII → `.xlsx` cu `openpyxl` **+ copia recalculată**.
   - **Excel, citește asta:** în fișier formulele se scriu în forma de fișier (engleză, virgulă: `=SUM(B2:E2)`), indiferent cum scrie lecția. Separatorul `;` și numele funcțiilor se verifică la U4, nu aici. Copierea „în jos” se face ca în Excel: `from openpyxl.formula.translate import Translator; ws["F3"] = Translator(ws["F2"].value, origin="F2").translate_formula("F3")`. Verifici valorile rândurilor 2 și 3, nu doar primul.
   - **Randare/recalculare doar prin** `python CAMP\H_randeaza.py pdf <fisier> L` sau `python CAMP\H_randeaza.py xlsx <fisier.xlsx> L` (profil LibreOffice separat; exit 1 dacă fișierul n-a apărut). Randarea LibreOffice probează CONȚINUTUL, nu aspectul exact din Microsoft Office.
   - `L\03_jurnal_sarcina.md` (≥ 300): povestea pașilor, cu locurile unde un începător se blochează.
   - **U7:** redeschide artefactul într-un proces Python nou și citește 1-2 valori → `L\07_redeschis.json`.
   - **U12 — timpul îl calculează poarta**, nu tu: pornire 8 min + citirea lecției (cuvinte ÷ ritm) + pașii (clicuri × s + caractere ÷ ritm + cuvinte citite ÷ ritm); ritmurile sunt provizorii, pe clasă, în `G_poarta.py`. Pui `timp_estimat_minute.verdict`, rulezi poarta, și dacă spune alt verdict îl iei pe al ei. Tu completezi corect numărul de clicuri/caractere/cuvinte.
   - **U11:** jucând elevul, scrie constrângerile (ce NU știe, ce nu vede, cât timp are). Blocajele pe care le „prezici” sunt **ipoteze AI** — cercetarea spune că simularea AI e prea competentă; le treci în `anexa.blocaje_probabile_ipoteza` ca `INTREBARE_VASILE` („notează la oră unde s-au blocat”).

**4. Specialistul și norma — U3, U4, U16**
   - **U3** → `L\04_a_doua_cale.json`: listă de `{"ce": "...", "cale1": "...", "val1": "...", "cale2": "...", "val2": "..."}`, ≥ 2 rânduri, căi diferite. Ex.: total Excel recalculat de LibreOffice vs recalculat în Python; cheia unui chestionar vs textul atomului; o afirmație tehnică vs o sursă primară de azi. **Cifre din lumea reală** (TVA, prețuri, capacități, legi) → sursă datată.
   - **U4** → `L\04_mediu.md`: ce mediu presupune lecția (Office/LibreOffice, versiune, limba interfeței, separator, Windows), comparat cu ce se știe. Fapte deja stabilite (13.09.2026):
     - Word în română (text brut, Microsoft Support ro-ro): „Pe fila **Pornire**, în grupul Font” (`F_evaluari/cls7/lectia1-interfata-word/surse/pas03.txt`); „Salt la **Inserați** > simbolul > Mai multe simboluri” (pagina format-text-as-superscript-or-subscript-in-word). Atenție: aceeași documentație scrie și „Accesați pagina de pornire” — traducere inconsecventă; ce vede elevul pe ecran nu se află din documentație, doar din laborator.
     - „Titlu 1” ca nume al stilului Heading 1 în Word ro: **NECONFIRMAT** pe text brut.
     - Excel în română **NU traduce numele funcțiilor** (text brut): titlul paginii ro-ro = „Funcția AVERAGE”, exemplu `=AVERAGE(A1:A20)`; „Funcția SUM”, `=SUM(A2:A10)`; `SUMA(` și `MEDIE` nu apar. Contra-probă fr-fr: titlul „MOYENNE”, `=MOYENNE(A1 :A20)`. Deci `SUMA`/`MEDIE` sunt greșite pentru Excel (LibreOffice în română: NEVERIFICAT).
     - Separatorul de argumente depinde de **setarea regională a Windows-ului** din laborator — necunoscută → orice semnalare pe separator e `depinde_de_necunoscut: true`, iar schimbarea propusă acoperă ambele variante.
     - Office-ul de pe PC-ul lui Vasile e în engleză (ProPlus 2021, en-us) — asta NU spune nimic despre laborator.
   - **U16:** câmpul `diacritice_la_1000` în `log.json` (poarta îl recalculează din `innerText.txt`; text românesc normal ≈ 40-60). ș/ț cu virgulă vs ş/ţ cu sedilă. Ce cer spec-ul și programa, cu citat → `L\04_norma.md`.
   - Ca specialist: se predă ceva cum nu se mai lucrează în 2026 (formatare manuală în loc de stiluri, sfaturi de hardware depășite, parole „complicate” în loc de fraze-parolă)? Cu sursă.

**5. Profesorul — U17, U14, U13, U5, U9**
   - **U17:** tabelul „Sala reală”. La Izvoare: se poate ține lecția pe hârtie? Ce trebuie pregătit?
   - **U14:** completează `06_premortem.md` — 5 motive; fiecare cu o verificare făcută (rezultatul) sau „nu se poate fără sală, pentru că…”.
   - **U13:** în același fișier, pentru fiecare semnalare gravă: o explicație alternativă + observația care le deosebește, făcută.
   - **U5:** fiecare semnalare `blocant` are reproducerea în folder (`dovada_fisier`: scriptul + ieșirea lui, captura, fișierul).
   - **U9** → `L\09_checklist.md` (≥ 300): bifezi R1-R6 din `00_INDEX.md` și checklistul din `LESSON_SPECIFICATION.md` (Grep `- \[ \]`), fiecare cu da/nu/nu se aplică + unde.
   - **Anexa** (în `log.json`, cheia `anexa`) — fiecare cheie e `{"status": "FACUT", "evidence": [...]}` sau `{"status": "INTREBARE_VASILE", "intrebare": "...?"}` sau `{"status": "NU_SE_APLICA", "de_ce": "..."}`:
     - toate clasele: `fara_cont_email_stick`, `puncte_de_verificare_vizibile` („ridicați mâna când vedeți…”), `sarcina_de_rezerva_retea_proiector`, `tastarea_diacriticelor_pe_pc_elev`, `blocaje_probabile_ipoteza`, `unde_se_salveaza_fisierul` (și dacă îl mai găsește ora viitoare)
     - V: `ergonomie_contra_mobilierului_real`, `afirmatii_hardware_actuale_2026`
     - VI: `modul_prezentare_font_la_distanta`, `o_idee_pe_diapozitiv`, `denumiri_animatii_tranzitii_ro`
     - VII: `stil_vs_formatare_manuala_ce_cere_lectia`, `marcaje_paragraf_spatii_enter`, `ghilimele_romanesti`
     - VIII: `numar_scris_ca_text_si_date`, `copierea_formulei_in_jos`, `lipirea_tabelului_starter`, `separator_si_nume_functii`

**6. Semnalări + jurnal** → `L\log.json` (schema) și `L\05_evaluare.md` (≥ 300, limbaj simplu, pentru Vasile).
   Apoi adaugi în `CAMP\F_evaluari\<clasa>\JURNAL.md` o secțiune `## <lectia-fara-.html>`: 3-6 rânduri — ce schimbă felul în care trebuie privită lecția următoare. O semnalare care se repetă din lecția anterioară are **propria dovadă din lecția ta**.

**7. Poarta** — `python CAMP\G_poarta.py L` până la **exit 0**. Dacă pică: faci verificarea care lipsește; nu scrii o scuză. NESIGUR e permis doar la U7, U11, U17, cu întrebarea pentru Vasile.

## Schema `log.json`

```json
{
  "lesson": "content/tic/cls7/m1-word-fundamente/lectia2-formatare-text.html",
  "citit": "innerText.txt rândurile 1-671 (tot), în 3 felii",
  "diacritice_la_1000": 0.0,
  "checks": { "U1": {"status": "FACUT|NEFACUT|NESIGUR", "evidence": ["cale relativă la L"], "note": "..."},
              "…": "U1, U2, U3, U4, U5, U7, U8, U9, U10, U11, U12, U13, U14, U15, U16, U17" },
  "anexa": { "fara_cont_email_stick": {"status": "INTREBARE_VASILE", "intrebare": "…?"}, "…": "…" },
  "findings": [{
      "id": "cls7-l2-01", "rol": "PROFESORUL|SPECIALISTUL|ELEVUL|NORMA", "check": "U16 (sau o cheie din anexă)",
      "ce_vede_omul": "o frază, limbaj simplu",
      "dovada_tip": "citat|observatie",
      "dovada": "citat EXACT din innerText.txt (poarta îl caută) SAU descrierea observației",
      "dovada_fisier": "cale relativă la L — obligatoriu la observatie și la blocant",
      "gravitate": "blocant|important|minor",
      "depinde_de_necunoscut": false,
      "ce_trebuie_diferit": "schimbarea concretă",
      "prindea_auditul_pe_text": "da|nu", "de_ce": "…"
  }],
  "timp_estimat_minute": {"verdict": "incape|nu incape"},
  "carry_forward": "ce iau cu mine la lecția următoare"
}
```
**Gravitate:** *blocant* = ora nu se poate ține / elevul nu poate termina / e greșit la fond (și nu depinde de un fapt necunoscut). *important* = merge prost sau învață o formă greșită. *minor* = cosmetică.

## Ce NU faci
- Nu prezinți R1-R6 ca descoperiri noi (ex. „varianta corectă e cea mai lungă”); dacă le vezi, semnalare scurtă, `minor`, cu trimitere la regulă.
- Nu umfli: trei semnalări care schimbă ora valorează mai mult decât treizeci cosmetice.
- Nu afirmi ce face Word/Excel/PowerPoint din memorie. Sursă sau `interfata` cu `gasit: neclar`.

## Ce returnezi (max 12 rânduri)
Ieșirea porții (ultimele 2 rânduri, copiate) · cele 3 semnalări care schimbă cel mai mult ora, fiecare cu dovada în câte o frază · verdictul de timp calculat de poartă · ce ai scris în JURNAL.
