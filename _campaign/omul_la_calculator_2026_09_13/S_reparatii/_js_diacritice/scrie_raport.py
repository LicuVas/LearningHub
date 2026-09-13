# -*- coding: utf-8 -*-
"""Construieste schimbari.md din schimbari_aplicate.tsv + lista a ce s-a lasat intentionat."""
import io, os
HERE = os.path.dirname(os.path.abspath(__file__))
rows = [l.split('\t') for l in io.open(os.path.join(HERE, 'schimbari_aplicate.tsv'), encoding='utf-8').read().splitlines() if l.strip()]
files = sorted({r[0].split(':')[0] for r in rows})

LASAT = """
## Ce am lăsat intenționat (și de ce)

| Unde | Text | De ce |
|:--|:--|:--|
| `now-data.js` (tot) | titluri de module „Aplicatii Birotice”, „Introducere in sisteme de calcul”… | fișier GENERAT de `tools/gen_now_data.py` („NU EDITA DE MANA”) din titlurile lecțiilor HTML; o editare manuală se pierde la regenerare. Se repară la sursă (HTML) + regenerare. |
| `school-year.js` (tot) | „Vacanta de toamna”, „Hotarata de C.A. al I.S.J. Neamt…” | fișier GENERAT de `tools/gen_school_year_js.py` din `curriculum/school_year_2026_2027.json`. Numele vacanțelor apar în bannerul `active-module.js` — de reparat în JSON + regenerare. |
| `breadcrumb.js:214` | `text.includes('Inapoi') \\|\\| text.includes('Înapoi')` | COD care CITEȘTE textul butoanelor vechi din HTML (acceptă deja ambele forme). Nu e text afișat. |
| `active-module.js:128` | regex `/in curs/i` pe textul din HTML | COD care caută textul din pagina hub. **Risc de notat:** dacă cineva pune „În curs” în HTML, regexul nu mai prinde (ar trebui `/[iî]n curs/i` — schimbare de cod, nu de diacritice, deci n-am făcut-o). |
| `atomic-learning.js:407` | regex `corect\\|exact\\|bravo` | cod de potrivire, cuvintele nu au diacritice. |
| `atomic-learning.js:79`, `quiz-bridge.js:170`, `evidence-system.js:36` | mesaje `console.*` | nu le vede elevul. |
| `lesson-summary.js:890` | `(practica)` în `formula` din JSON-ul exportat | nu e afișat elevului (câmp din fișierul de progres trimis profesorului). |
| `lesson-summary.js:954` | `lectie-${id}-progres.json` | nume de fișier. |
| `progress.js:328`, `quiz.js:185` | `lectia${n}`, `a[href*="lectia"]` | id-uri / selectori. |
| `media-popup.js:115` | „Imagine indisponib…” în `data:image/svg+xml` din `onerror` | text în URI codat, într-un atribut; diacriticele ar cere codare URL — lăsat. |
| `rpg-system.js:144,152` | „Practica Face Perfect”, „Ai completat practica” | „practica” articulat = corect fără diacritice. |
| `lesson-renderer.js:424`, `lesson-summary.js:489,496` | „Sarcina N”, „Nota: …”, „Nota finală” | articulat = corect. |
| `user-system.js` `id`-uri (`maistri1`, `mat-info`, `stiinte`), `proficiency-system.js` `id: 'performanta'` | chei | chei de stocare/logică; s-au schimbat DOAR `label`/`short`/`group`. `group` e comparat doar cu el însuși (`getGradeGroups`), toate 3 aparițiile schimbate consecvent. |
| scratch-blocks.js | blocurile `ro:` | aveau deja diacritice; `en:` rămân englezești. |
| comentariile din toate fișierele | — | regula: pot rămâne. |

## Verificarea „cine compară textul” (regula 2)
- Grep pe `textContent/innerText/label/name ===|includes|indexOf|startsWith|match` în assets/js: singurele potriviri pe text românesc sunt `breadcrumb.js:214` și `active-module.js:74,128` (citesc HTML-ul, nu textele schimbate aici).
- Nimic din `assets/js` nu compară „Copiaza”, „Verifica”, „Urmatorul pas”, „Raspuns salvat!”, „Verificat”, „Trimis”, „Rezolvat!”.
- `H_vede.py` folosește selectori (`.ux-step-next`, `.ux-step-hidden`), nu text. Scripturile vechi de evaluare din `F_evaluari/*/u3_potrivire.py` conțin textele vechi — sunt analize punctuale deja rulate, nu cod al sitului.
- `gradeLabel` (lesson-summary) ajunge și în JSON-ul exportat; `tools/evaluate_submissions.py` doar îl afișează (checksum-ul se calculează la export, pe ce e în fișier).

## Poarta
`poarta.py`: pentru fiecare .js schimbat, `git cat-file --filters HEAD:<f>` (= `git show` + conversia CRLF a `core.autocrlf=true`) și fișierul nou, după maparea ăâîșțĂÂÎȘȚ→aaistAAIST, IDENTICE octet cu octet; zero ş/ţ cu sedilă; `node --check` exit 0. Rezultat: 15/15 OK.
"""

out = [f"# Diacritice în JS-ul comun (assets/js) — {len(rows)} înlocuiri în {len(files)} fișiere\n",
       "Fișiere: " + ", ".join(f"`{f}`" for f in files) + "\n",
       "## Schimbări (fișier:linie — vechi → nou)\n",
       "| fișier:linie | vechi | nou |", "|:--|:--|:--|"]
for r in rows:
    esc = lambda s: s.replace('|', '\\|')
    out.append(f"| `{r[0]}` | {esc(r[1])} | {esc(r[2])} |")
io.open(os.path.join(HERE, 'schimbari.md'), 'w', encoding='utf-8').write("\n".join(out) + "\n" + LASAT)
print('scris', len(rows))
