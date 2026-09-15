# Harta acoperirii — web-viii „Misiunea Webmaster” (evaluator independent, 15.09.2026)

Surse primare descărcate cu `curl -sL -A "Mozilla/5.0"` în `surse\` (html.spec.whatwg.org/multipage: syntax, semantics, sections, embedded-content, links, tables, rendering, grouping-content + MDN iframe/DOMParser). Citatele extrase: `surse\citate.txt`, `surse\citate2.txt`.
Execuție: `t_simulator.py` (A = 63 de coduri în verificator, B = 20 de tentative periculoase × 2 telefoane, C = joc jucat de copil + capturi), `t_csp.py` (unde ajung cererile externe), poarta `test_joc.py`.
Legendă „verificat”: citit · sursă (citat în surse\) · executat (Playwright) · comparat (lecțiile LearningHub / programa).

## Cadru

| element | ce afirmă / cere | verificat cum | problemă? |
|---|---|---|---|
| unitate, clasă, competențe | VIII-U2 „Pagini web”, CS.1.2 + CS.3.2 | comparat cu unitati.json | nu |
| `lectii:'14–21'` | lecțiile acoperite | comparat: unitatea are 14–22 (22 = evaluare sumativă) | da → S10 (minor) |
| intro | 7 niveluri, cod HTML citit „ca un browser” | numărat: 7 niveluri; executat | nu |
| banda / temă | bara de browser, `example.com` | capturi luminos + întunecat | nu |

## Nivelul 1 — Cum e făcută o pagină web

| element | ce afirmă / cere | verificat cum | problemă? |
|---|---|---|---|
| pagina de citit | fișier text .html; browserul desenează; HTML = limbaj de marcare; etichete în pereche, `/` închide; editor vizual | citit; corect la nivel de gimnaziu | parțial → S4 (editorul dedicat, doar o frază) |
| Î1 choice „Ce este HTML?” → „limbaj de marcare” | o singură variantă corectă | citit | nu |
| Î2 choice „închide un paragraf” → `</p>` | `<\p>` și `<p/>` nu închid | sursă: sintaxa etichetei de final; `<p/>` pe element nevid = etichetă de început | nu |
| Î3 match browser/HTML/.html/editor vizual | 4 perechi unice | citit | nu |
| Î4 tf „fișier text, se deschide în Notepad” → A | | citit | nu |
| Î5 classify deschide/închide (6 etichete) | cheie: `/` = închide | citit | nu |
| why-uri N1 | explică rolul, nu repetă | citit | nu |

## Nivelul 2 — Antet, titlu, corp

| element | ce afirmă / cere | verificat cum | problemă? |
|---|---|---|---|
| pagina: `<!doctype html>` „anunță că urmează o pagină HTML5” | | sursă syntax: „DOCTYPEs are required for legacy reasons. When omitted, browsers tend to use a different rendering mode” | da → S9 (minor, simplificare) |
| pagina: `<head>` = **antetul**, informații care nu apar în fereastră | | sursă semantics: „The head element represents a collection of metadata”; comparat cu LearningHub | da → S3 (important, decizie) |
| pagina: `<title>` = titlul de pe filă | | sursă semantics: „title that is shown in a browser's title bar or a page's tab” | nu |
| pagina: `<body>` corpul; `<h1>`…`<h6>` | | sursă sections: „These elements represent headings for their sections” | nu |
| pagina: imbricare `<head><title>…</title></head>` | | citit | nu |
| Î1 choice titlul apare „Pe fila browserului” | unică | sursă ca mai sus | nu |
| Î2 order schelet (7 linii) | ordine unică | citit: nicio pereche interschimbabilă | nu |
| Î3 classify antet/corp | title+meta = antet; h1, paragraf, imagine = corp | citit | nu |
| Î4 hunt 3 greșeli: `</heat>`, `<h7>`, `<body>` în loc de `</body>` | cheie corectă | citit; în cod lipsește și `<!doctype html>` (nemarcat) | da → S12 (minor) |
| Î5 tf `<h1>` = `<title>` → F | why corect | citit | nu |
| consecvența termenilor | „antet” = head, „titlu” = title (N2); `<h1>` = „titlu” pe pagină; „capul tabelului” = th | citit în tot jocul | vezi S3 |

## Nivelul 3 — Paragrafe și imagini

| element | ce afirmă / cere | verificat cum | problemă? |
|---|---|---|---|
| pagina: `<p>`, Enter-urile nu contează, `<br>` | | citit (comportament CSS `white-space: normal`); neverificat pe sursă primară | nu |
| pagina: `src`, `alt`, atribute în eticheta de deschidere | | sursă embedded-content (alt = text alternativ) | nu |
| pagina: `<img>` nu are etichetă de închidere | | sursă syntax: „Void elements only have a start tag; end tags must not be specified for void elements” | nu |
| Î1 choice două propoziții fără `<br>` → pe același rând | unică | citit | nu |
| Î2 choice `alt` | unică | citit | nu |
| Î3 tf `</img>` → F | | sursă syntax (void) | nu (dar simulatorul acceptă `</img>` → S7) |
| Î4 COD paragraf + imagine | 18 coduri încercate | executat (bateria A) | `./carpati.jpg` respins → S2 **reparat**; `</img>` și `Carpati.JPG` acceptate → S7 |
| why Î4 după „Arată-mi răspunsul” | „Jocul… a găsit… Cuvintele tale pot fi oricare” | executat: apare și când elevul a cedat | da → S8 (minor) |

## Nivelul 4 — Liste și tabele

| element | ce afirmă / cere | verificat cum | problemă? |
|---|---|---|---|
| pagina: `ul` buline, `ol` numerotată, `li` înăuntru | | sursă grouping-content (ul / ol / li) | nu |
| pagina: table/tr/td/th, th îngroșat | | sursă tables („tr … row”, „td … data cell”, „th … header cell”); rendering: `th { font-weight: bold; }` | nu |
| pagina: coloanele = celulele din rând; fără linii implicit | | sursă rendering: `table { … border-spacing: 2px; border-collapse: separate }`, fără border | nu |
| Î1 choice rețetă → `<ol>` | unică | citit | nu |
| Î2 choice 3 tr × 4 td → 3 rânduri, 4 coloane | 12 celule, distractori falși | recalculat | nu |
| Î3 match table/tr/td/th | | sursă tables | nu |
| Î4 COD listă ≥3 li | 9 coduri | executat: `</li>` omis acceptat (standard: „An li element's end tag may be omitted…”); li după `</ul>` respins | `</ul>` lipsă acceptat → S7 |
| Î5 tf li în ul/ol → A | | sursă grouping | nu |

## Nivelul 5 — Legături

| element | ce afirmă / cere | verificat cum | problemă? |
|---|---|---|---|
| pagina: `<a href>`, text vizibil, `target="_blank"` | | sursă links („The href attribute on a and area elements…”, `_blank`) | nu |
| pagina: același site = doar numele fișierului; extern = `https://…` | | citit | da → S11 (minor, simplificare) |
| pagina: text descriptiv, nu „apasă aici” | | citit | nu |
| Î1 choice href | `link` nu e atribut al lui `<a>` | sursă links | nu |
| Î2 classify același site / extern | cheie corectă | citit; domenii `example.*` (rezervate) | nu |
| Î3 hunt `<a src>` + `<a>` în loc de `</a>` | 2 greșeli, cheie corectă | citit | nu |
| Î4 COD legătură | 12 coduri | executat | `</a>` lipsă (închis de `</p>`) acceptat → S7 |
| Î5 tf „apasă aici” → F | | citit | nu |

## Nivelul 6 — Formatare

| element | ce afirmă / cere | verificat cum | problemă? |
|---|---|---|---|
| pagina: `style`, color/font-size/font-family, text-align, background-color pe body | | citit (CSS de bază) | nu |
| Î1 choice `text-align: center` | unică | citit | nu |
| Î2 classify text/paragraf/fundal | cheie consecventă cu pagina | citit | nu |
| Î3 match | | citit | nu |
| Î4 COD centrare + fundal | 14 coduri | executat: `text-align=center`, `align`, `centre`, `align="center"` respinse; variații corecte acceptate | CSS în `<style>` respins → S6 |
| Î5 tf galben pe alb → F | | citit | nu |

## Nivelul 7 — Pagina clasei, în siguranță (final)

| element | ce afirmă / cere | verificat cum | problemă? |
|---|---|---|---|
| pagina: ce nu publici, inginerie socială, semne | | comparat cu programa (activitatea „protecția… împotriva fraudelor… prin inginerie socială”) | nu |
| Î1 choice mesaj „tabletă” | unică | citit; domeniu `.test` rezervat | nu |
| Î2 classify pe pagina clasei da/nu | | citit | nu |
| Î3 hunt 4 semne de fraudă | cheie corectă; why corect despre https | citit | nu |
| Î4 COD pagina clasei | 10 coduri | executat | parola comentată / mutată în `alt` ACCEPTATĂ → S1 **reparat**; „parole sigure” respins → S5 |
| Î5 choice poza cu colegi | unică | citit | nu |

## Simulatorul „cod” — siguranță (bateria B)

| element | verificat cum | rezultat |
|---|---|---|
| 20 de tentative (`<script>`, `onerror`, `onload`, `ontoggle`, `javascript:`, iframe extern și srcdoc, form, meta refresh, base, `@import`/`url()`, link, object/embed, video/audio/srcset, img extern, ieșire din textarea, 2 mXSS) × iPhone SE + Pixel 7 | executat, cu clic în previzualizare | 0 execuții în joc (`window.__pwned` = null), 0 dialoguri, 0 ferestre noi, URL neschimbat, 0 erori JS |
| cereri externe | `t_csp.py` cu `ctx.route` (martor: fără CSP, cererea AJUNGE la rețea) | 0 cereri ajunse la rețea; consola: „violates the following Content Security Policy directive… blocked” |
| iframe | citit + executat | `sandbox=""` (fără scripturi, formulare, ferestre), CSP `default-src 'none'` |
| mesajele de eroare | citit | trec prin `api.esc`, codul elevului nu intră niciodată în pagina jocului |

## Diploma

| element | ce afirmă / cere | verificat cum | problemă? |
|---|---|---|---|
| titlu, rezumat | | captură Pixel 7 întunecat | nu |
| provocarea (5 pași) | pagină la alegere, title, h1, 2 paragrafe, imagine cu alt, listă, legătură, centrare, fundal, verificare date | comparat cu programa (exemplele: anotimpuri, sportul preferat, pagina clasei) | „editorul folosit la clasă” necunoscut → S4 |
