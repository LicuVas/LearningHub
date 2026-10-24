# Contract — reparațiile la componentele comune (24.10.2026, seara)

## Cererea (verbatim, 24.10.2026, 20:38)
> da, pornește reparațiile la componentele comune

(Răspuns la propunerea mea de la 20:32: „cel mai util ar fi să repar cele 7 probleme rămase în piesele folosite de mai multe lecții… Durează cam 4-6 ore, cu 3-5 agenți.” Lista = `DIMINEATA_24_10.md`, „Pentru componentele comune”. Pornesc fără să aștept aprobarea contractului: el a spus „pornește”; implicitele sunt marcate [presupus] și i le arăt primele în raport.)

## Proba realității
Elevul deschide lecția pe telefon (la Dumbrava: DOAR telefoane) sau pe calculatorul din laborator și face exercițiile cu degetul / mouse-ul: bifează pașii din aplicația adevărată, deschide meniul Forme în Paint, salvează în browserul simulat, scrie pagina în editorul web, lucrează în Scratch. O componentă comună stricată strică deodată toate lecțiile care o încarcă și sertarele (progresul salvat) ale elevilor care au lucrat deja.

## Ce intră (cele 7 din raport)
| # | Unde | Defectul | Cine repară |
|---|---|---|---|
| 1 | `lectii/_sim/browser-salvare.js` + `browser-siguranta.js` | același id de stil `bs-css` → pe V/17 (le încarcă pe amândouă) stilul celui de-al doilea nu se pune | agentul C |
| 2 | `lectii/_sim/editorweb-schelet.js` | acceptă conținut după `</body>` | agentul C |
| 3 | `lectii/_sim/paint*.js` (V/19) | meniul Forme iese 19 px din fereastră la 390 px | agentul C |
| 4 | `jocuri/_motor/motor.js` + `motor.css` | bifele `.bifa-real` 20×20 px (sub 32); după „Corect”, „Ia-o de la capăt” + o greșeală lasă „Corect!” lângă bifa roșie | agentul A |
| 5 | `lectii/v/m2-l12` | trimite la lecția 1 cu `?vezi=p6/p7` (acum P8/P9) | dirijorul |
| 6 | `lectii/vii/m3-l18` | legătura „atelierul lecției” are 22 px pe telefon | dirijorul |
| 7 | `lectii/_sim/scratch.js` | Duplică pe telefon; eroare în consolă la 1280 (câmp fără Enter + tragere din paletă); câmpul direcției primește taste după UN clic (Scratch-ul real cere dublu clic) | agentul B |

**Adăugat de mine [presupus], aceeași regulă (20) și aceeași poartă:** firul de navigare / antetul motorului cu legături de 23 px pe telefon (notat din 28.09 în `08_RELUARE.md` și în jurnal) — intră la agentul A doar dacă e încă sub 32 px; altfel se notează „deja reparat”.

## R — cerințe explicite (cine verifică · „gata” =)
| R# | Cerința | Cine verifică | Gata = |
|---|---|---|---|
| R1 | Fiecare defect din tabel e reparat sau, dacă nu se poate sigur, scris NESIGUR cu motivul | poarta de lansare (agent opus independent, nu autorul) | verdict LANSEAZA cu fiecare punct „închis” citat |
| R2 | Nicio regresie pe paginile care încarcă componenta | poarta de lansare: toate paginile care o încarcă, la 390 cu atingere și la 1280 cu mouse | 0 pagini cu comportament nou greșit față de HEAD; `test_joc` TRECUT pe fiecare |
| R3 | Motorul: sertarele vechi ale elevilor se încarcă la fel (progres, stele, puncte) | poarta motorului (`proba_sertar_vechi.py` sau echivalent) | 0 diferențe față de HEAD |
| R4 | Țintele reparate ≥ 32 × 32 px pe atingere, fără să schimbe desenul la 1280 | sondă pe grilă (`elementFromPoint`), nu doar `getBoundingClientRect` | 0 ținte sub 32 în perimetru; 0 diferențe de desen la 1280 |
| R5 | Publicarea: fiecare componentă comisă SEPARAT (cale numită), apoi lecțiile V/12 și VII/18 prin `publica_lectie.py` | scriptul + dirijorul pe sit | conținutul de pe sit = blobul comis (sha1); `publica_lectie` ultima linie 0; marcaj LIVE |
| R6 | Regulile 22-27 (rețeaua blocată, `ctx.close()`, calculatorul neschimbat, date personale) | poarta + `learninghub_date_personale.py` + `activitate.py lista` | 0 / 2 rânduri „nu e în catalog” (ca acum) |
| R7 | Jurnal + raport + memorie | dirijorul | `04_ORCHESTRARE.md` la zi; `componente_24_10/RAPORT.md`; strat în fișa campaniei |

## I — cerințe implicite
- I1. Componentele sunt deja LIVE în lecții publicate → fiecare schimbare trece prin poarta de lansare (`08_RELUARE.md` §3) — implicat de „componente comune”.
- I2. Autorul nu e cel care verifică; verdictul final pe opus — regula campaniei.
- I3. Fișiere disjuncte între agenți (A: motorul; B: `scratch.js`; C: browser-*, editorweb-schelet, paint*) — altfel se calcă pe picioare.
- I4. Bugetul: GALBEN (7 zile 71%) → fără Fable, fără bucle de lustru; agent proaspăt după ~200k.
- I5. O altă sesiune a schimbat `motor.js` ieri (23.10, f0963601) → agentul A verifică la început și înainte de predare că `motor.js` de pe disc = HEAD-ul de la care a pornit.

## Ce NU intră
Lecții noi (M4), jocurile ca jocuri (doar regresia lor pe motor), `prezenta.js`, `rezultat-elev.js`, celelalte probleme vechi ale motorului din `08_RELUARE.md` (atingerile pierdute după tragere, „Pașii amestecați”) — rămân notate.

## Decizii [presupus]
- Câmpul direcției din Scratch: simulatorul se poartă ca Scratch-ul real (lecția VI/21 predă dublu clic), dar pe telefon gestul trebuie să meargă cu degetul; dacă nu se poate face sigur pe telefon, rămâne îngăduitor și se scrie de ce.
- Ordinea lansărilor: întâi componentele mici (C) și Scratch (B), motorul ultimul (cea mai mare rază).
