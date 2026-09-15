# Raport — evaluator independent, web-viii „Misiunea Webmaster” (15.09.2026)

**Pe scurt:** faptele HTML sunt corecte pe standard, cheile se potrivesc, fiecare întrebare are o singură variantă corectă. Simulatorul e sigur: codul elevului nu rulează niciodată, nici măcar în previzualizare. Am găsit 12 semnalări: 0 blocante, 3 importante, 9 minore. Am reparat 2, cu dovadă. Poarta: **[TRECUT]** (68 de întrebări jucate).

## Ce schimbă ora de mâine
1. **S1 (reparat)** — misiunea finală accepta pagina cu parola doar „comentată” (`<!-- … vara2026 -->`) sau mutată în `alt`. Exact lecția „ce nu public” era păcălită. Acum parola e căutată în tot codul.
2. **S3 (decizie)** — „antet” are sensuri contrare în LearningHub: jocul și lectia4 spun `<head>`, lectia5 spune „`<head>` NU e antetul… antetul e `<header>`”. Pe standard, head = metadate, header = zona de introducere vizibilă.
3. **S4 (decizie)** — programa (CS.1.2, lecția 14) cere un editor dedicat de pagini web. Jocul e doar cod scris de mână, iar editorul folosit la clasă nu e numit.

## Importante
- S1, S3, S4 (mai sus).

## Minore, grupate
- **Toleranța simulatorului** (verifică pagina rezultată, ca browserul): S5 activitatea „parole sigure” e respinsă · S6 CSS scris în `<style>` e respins · S7 `</img>`, `</ul>` sau `</a>` lipsă și `Carpati.JPG` sunt acceptate, deși alte întrebări le numesc greșeli · S2 `./carpati.jpg` era respins (**reparat**).
- **Text:** S8 why-ul de succes apare și după „Arată-mi răspunsul” · S9 doctype „HTML5” e o simplificare · S11 „același site = doar numele fișierului” e adevărat doar în același folder · S12 vânătoarea din N2 nu are doctype, deși pagina tocmai l-a prezentat.
- **Cadru:** S10 jocul declară lecțiile 14–21 (22 e evaluarea).

## Omul la calculator — ce am făcut
- **Bateria de coduri (63):** HTML corect scris altfel e acceptat: ghilimele simple, fără ghilimele, atribute inversate, litere mari, `</p>`/`</li>` omise (standardul le permite), `/>`, spații în jurul lui `=`. Greșelile unui copil sunt respinse cu mesaj clar: `scr`, `alt` gol sau pus în afara etichetei, `li` după `</ul>`, `text-align=center`, `align`, `centre`, `https://orar.html`, `href` fără `=`.
- **Siguranță (20 de tentative × 2 telefoane):** `<script>`, `onerror`, `onload`, `ontoggle`, `javascript:`, iframe, form, meta refresh, base, `@import`, `url()`, srcset, object/embed, ieșire din textarea, mXSS. Rezultat: nimic executat în joc, fără dialoguri, fără ferestre noi, URL neschimbat. Iframe-ul are `sandbox=""` și CSP `default-src 'none'`. Playwright raportează încercările de încărcare, dar consola arată „blocked by CSP”. Cu un martor (iframe fără CSP, a cărui cerere ajunge la rețea), am confirmat că la joc 0 cereri ajung la rețea.
- **Joc de copil** pe iPhone SE (tema luminoasă) și Pixel 7 (tema întunecată): alt uitat, apoi `alt` scris după `>`, apoi „Arată-mi răspunsul”, apoi misiunea finală, apoi jocul complet până la diplomă. Fără erori JS, nimic mai lat decât ecranul (320 și 412 px). Capturile sunt în `capturi\` și sunt lizibile în ambele teme.

## Fapte verificate pe sursa primară (curl, `surse\citate*.txt`)
- `<img>` e element fără conținut (void, fără etichetă de închidere).
- `th` e îngroșat implicit; tabelul nu are chenar implicit.
- ul/ol/li, tr/td/th, h1–h6, title (pe filă), head (metadate), header (zonă de introducere).
- Etichetele de final opționale pentru p/li; doctype cerut din motive istorice.

## Ce n-am putut verifica și de ce
- Numele și interfața editorului de pagini web de la clasă: nu apar în surse, iar dotarea laboratorului e necunoscută.
- „Enter-urile din cod nu contează” și „alt e citit de cititoarele de ecran”: sunt corecte după cunoștințele standard, dar nu am extras un citat primar pentru ele.
- Rularea pe Safari sau iOS real: emularea Playwright folosește Chromium.
- Bara de sus a motorului se restrânge la derulare (`#go-home` devine invizibil). E comportamentul documentat al motorului, nu o problemă a jocului.

## Fișiere
`harta_acoperirii.md` · `semnalari.json` · `modificari.md` · `t_simulator.py` · `t_csp.py` · `cit_surse*.py` · `rezultate_*.json` · `capturi\` · `surse\`
