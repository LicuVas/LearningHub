# Verificarea 2 a ghidului lecțiilor (25.10.2026, a doua trecere, „pe diferențe”)

Ce am verificat: `00_GHID_LECTII.md` (3.052 de rânduri), față de registrul primei verificări (`verificare\raport.md`). N-am modificat ghidul și nici alt fișier în afara dosarului `t2\`. Scripturile mele: `t2\compara.py` (→ `compara.txt`) și `t2\trimiteri2.py` (→ `trimiteri2.txt`); copiile din HEAD: `t2\head_05.md`, `t2\head_08.md`.

## Pe scurt

**Verdict: BUN DUPĂ REPARAȚII (doar reparații mici, de text).** Cele 2 probleme MAJORE sunt închise. Toate cele 16 contradicții sunt acum în Partea X. Legăturile spre ghid există, iar `_istoric\` există. Rămân însă: 7 minore din registru reparate doar pe jumătate sau deloc, plus 10 nepotriviri noi, mici. Nicio dată personală.

| Ce | Rezultat |
|---|---|
| MAJOR | 2 închise, 0 deschise |
| Cele 16 contradicții | 16 din 16 în X (X.1: 2; X.3: 14); o hotărâre nouă (III-8) nu se potrivește cu IX.1 (N5) |
| MINOR din registru | 13 reparate, 7 deschise sau pe jumătate |
| Legăturile (R1, R6) | 05, 08, 06, 07, `/lectii` trimit la ghid; `_istoric\05` e identic cu HEAD; `_istoric\08` = HEAD + 1 rând (vezi 4); Anexa F §4, §5 și §7 sunt identice |
| Trimiterile din I și X | 177 găsite, 0 spre secțiuni care lipsesc; 2 duc la litera greșită (S46 → „II.1 D”, de fapt II.1 E) |
| Date personale | `grep -c "<cont>\|<e-mail>\|<telefon>"` = 0 |

---

## 1. Cele 2 MAJOR

**(a) ÎNCHIS.** Rândul 2459: „**Regula dirijorului (24.10), din cererea lui Vasile din 20.10 („și la Dumbrava lucrăm tot pe telefoanele elevilor”) — nu sunt cuvintele lui:** o lecție care se folosește pe telefoane nu se publică fără componenta reparată pentru telefon: „Elevii unei școli lucrează doar pe telefoane — de aceea nu public VI/18-20 fără 1.3.” (24.10)”. Apare și în X.2 punctul 14 (rândul 2755: „regula „telefon ⇒ componenta reparată înainte de publicare””), printre deciziile luate fără el. Rândul a rămas sub titlul „Cum arată o lecție (cerințele lui de calitate)”, dar marcajul e explicit.

**(b) ÎNCHIS.**
- V.1, rândul 1041: „**Depășit (25.10):** din 10-23.10 Notepad-ul nou (aplicație din Magazin) nu se mai pornește în probe (regula 25, Partea I.4).”
- VII.1, rândul 1881: „**Depășit pentru probele de acum (25.10):** … nu se mai pornesc deloc în probe (regula 25, Partea I.4); rețeta rămâne doar ca istoric (VIII/19-20).”
- X.1 V-2 (rândul 2719) spune la fel. Regula 25 (rândul 80) nu mai e contrazisă.

Resturi mici (MINOR, trecute la N6 și N7): Anexa C n-are un rând pentru aceste rețete, iar V.1, rândul 1000, încă spune „(la Notepad, copilul are ca părinte PID-ul tău)”.

## 2. Cele 16 contradicții care lipseau din X

| # | Contradicția | Unde e acum | Se potrivește cu partea ei? |
|---|---|---|---|
| 1 | II.3 K3, „sub 20 min” | X.1 II-K3 (r.2699): „Variantele vechi („sub 20 min, întrebările întâi”, „Se apropie sfârșitul orei”) sunt înlocuite” | da; dar trimiterea „regula S46 (II.1 D)” e greșită: S46 stă la r.218, în II.1 E (N1) |
| 2 | III.4 nr. 4, atingerea pierdută | X.3 III-4 (r.2768) | da |
| 3 | III.4 nr. 7, `tip-foaie` / `tip-excel` | X.3 III-7 (r.2769) | da |
| 4 | III.4 nr. 8, salvarea evaluării | X.1 III-8 (r.2715) | față de III.4 da; față de IX.1 r.2510 („evaluările V/12, VI/10, VII/10 = antrenament”) nu (N5) |
| 5-6 | V.4 nr. 6-7 | X.3 V-6 · V-7 (r.2770) | da |
| 7 | V.4 nr. 8, V/12 | X.3 V-8 (r.2771) | da |
| 8-15 | VIII.2 nr. 2-9 | X.3 VIII-2 … VIII-9 (r.2762-2767) | da (VIII-5 „lecțiile scriu prudent” = VIII.2 nr. 5; VIII-6 = nr. 6). Mărunt: VIII-3 scrie „V/19-21”, VIII.2 nr. 3 scrie „V/18-21” (N10) |
| 16 | IX.4, „Ieși (deconectare)” | X.3 IX-4 (r.2772) | da |

Și VIII.2 nr. 1 a trecut din X.2 în X.3 VIII-1 (r.2761). Nicio trimitere „X.2 punctul 15” n-a rămas în ghid (grep: 0). În VIII.2, nr. 10 și 11 sunt „lămurite” în chiar textul lor.

## 3. MINOR-urile din registru

| Punct din raport | Stare | Dovada |
|---|---|---|
| Pragul 48-50 (I.5 r.30 / X.1 II-K2) | REPARAT | r.90 „(48-50 de minute)” · r.2698 „Între 48 și 50” |
| I.6 pasul 5 = VI.1 | REPARAT | r.106 „apoi TOATE minorele se repară înainte de publicare” · r.1575 „apoi TOATE MINOR-urile” · Anexa C r.2903 |
| I.2 „imediat” față de V.2 (OK pe Telegram) | REPARAT | r.1105 „**[Depășit pentru /lectii/ …]**” + X.1 V-9 (r.2722) |
| Formula regulii 37 = IV.2 | REPARAT | r.97 „rotunjit((0,8 × punctajul lucrării + punctele de pe LearningHub, din 20) : 10)” = r.843 |
| Regula 38: trimiterea și titlul | REPARAT | r.98 „**Pași mici ȘI rezultatul** … (II.1 G, II.2)”; S77 stă la r.255, în II.1 G |
| X.1 II-K3 (35 de minute, formula) | REPARAT (cu o trimitere greșită, N1) | r.2699 „un atelier opțional (ca la VIII/18) … e o decizie a lecției, nu o regulă generală” |
| X.1 II-K8 | REPARAT | r.2703 „decizia lui Vasile din 11.10 e formula „parola o știi doar tu și părinții tăi”; … (adaosul e al autorilor)” |
| X.1 II-K11 → IX.2 | REPARAT | r.2706 + r.2575 „VI/14: „doamna dirigintă” → „doamnă dirigintă”” |
| „Formulări comune” fără autor | REPARAT | r.2517 „_(Ale autorilor sau ale dirijorului…; a lui Vasile e doar parola…)_” |
| Citatul din 08.10 în I.1 | REPARAT | r.27 = `_istoric\05…` r.11, cuvânt cu cuvânt |
| Tabelul pe roluri, VIII A-D | REPARAT | r.16-17 „din VIII secțiunile comune A-D” (dar I.8, r.136, spune altfel: N3) |
| Glosarul I.9 (cele 5 locuri) | REPARAT în mare | r.145 metoda, r.146 C/B/A, r.147 lecțiile nr. 4, r.148 fumul, r.149-150 COM / `ctx.close()` / BagMRU. Rămân neexplicate `AddToMru`, PID, Playwright; r.147 spune greșit „J1-J19” (N2) |
| X.2 punctul 7 (VII/10) | REPARAT în X.2 | r.2748 „VI/10: C/B/A sau grila de produs? (VII/10 ai hotărât-o pe 11.10: C/B/A.)” |
| **IX.4: VII/10 îl întreabă din nou pe Vasile** | **DESCHIS** | r.2678 „**Evaluarea VI/10 (și VII/10):** … la VII/10 grila numită „resursă” lângă barem). Vasile.” |
| **IX.4 / `REGULA_NOUA` §1** | **PE JUMĂTATE** | r.2687: s-a adăugat paranteza „lămurit 25.10: §1 are deja C 40…”, dar fraza merge mai departe cu „fișierul citit de agenți e încă vechi — de actualizat de dirijor”, deci se contrazice singură. IX.2, r.2582, spune încă „`REGULA_NOUA.md` §1 are încă schema veche A40/B30/C20”, iar pe disc §1 are „**C = 40 p** … **B = 30 p** … **A = 20 p**”. `verifica_regula.py` a dat 0 la rularea mea. |
| **X.1 V-5 (07:30 față de 06:00)** | **PE JUMĂTATE** | V.2 trimite acum la X (r.1102 „**Hotărârea consolidării (Partea X.1, V-5)**”). Hotărârea rămâne însă „între 07:30 și 15:00” (r.2721), mai îngăduitoare decât sursa („după 06:00”). Nu se spune de ce, deși preambulul (r.2692) cere varianta mai strictă la egalitate. |
| **IV.2 §11 (formulele vechi)** | **PE JUMĂTATE** | r.915 dă tot, ca plase din pagină, „„Se apropie sfârșitul orei? Sari la ultimul punct”” și „„Mai sunt mai puțin de 20 de minute? Fă întâi întrebările””. Ambele sunt înlocuite după X.1 II-K3. S-a adăugat doar „(formula de azi: … regula S46 din II.1 D)”, cu trimitere greșită. |
| **IX.1, citatul „ca dintr-o privire”** | **DESCHIS** | r.2476: „„ca dintr-o privire să știe unde a rămas data trecută””, între ghilimele, ca vorbele lui. Textul lui (`_istoric\05`, r.11) e „Astfel la o privire în meniul de jos elevul să știe clar unde a rămas data trecută”. |
| **IX.1, „Documentele profesorului… au PRIORITATE”** | **DESCHIS** | r.2496: tot fără vorbele lui și fără dată, sub „Deciziile lui Vasile” |
| **IX.1, răspunsurile la planul de pornire** | **DESCHIS** | r.2450: „Răspunsurile lui stau în `08_RELUARE.md` / `ZIUA_12_10.md`, necitite în această fișă (nesigur).” `08_RELUARE.md` e acum doar o trimitere. |

## 4. Legăturile (R1, R6)

- **05:** `05_STANDARD_LECTIE.md` are 11 rânduri și trimite la ghid: „De azi, legea lecțiilor e `00_GHID_LECTII.md` … păstrat întocmai în `_istoric\05_STANDARD_LECTIE_pana_la_25_10.md`”, cu harta numerelor. **Trimite la ghid.**
- **08:** `08_RELUARE.md` are 7 rânduri și trimite la ghid (Partea I, VI.3, VII, IX, X, Anexa F) și la `_istoric\08_RELUARE_pana_la_25_10.md`. **Trimite la ghid.**
- **`_istoric`, comparat cu HEAD** (`compara.txt`): `05` e **identic** (29.007 caractere; diferă doar terminațiile de rând: CRLF față de LF). `08` **nu e identic cu HEAD**: are în plus un singur rând, la sfârșit (r.140): „- **DECIZII 11.10.2026 (Vasile, după tura 10→11.10; detalii în `PLAN_LUNI_12_10.md`):** …”. HEAD pentru 08 e commitul `f4eb0dc9` din 06.10, iar copia din `_istoric` are data de modificare 11.10, 09:10. Deci rândul era scris pe disc din 11.10 și nu fusese comis. Copia păstrează textul de pe disc dinainte de 25.10, deci nu s-a pierdut nimic; față de HEAD însă diferă, deci condiția „identic cu HEAD” nu se îndeplinește. Ce s-a hotărât pe 11.10 (Gmail, Audacity + Clipchamp, VII/10 pe C/B/A) e oricum în IX.1.
- **06:** r.6 „**De la 25.10.2026: `…\00_GHID_LECTII.md`** — Partea I întreagă (regulile 1-38…) … TOATE regulile sunt lege (nu doar „1-18”).” **Trimite la ghid.** Totuși r.10 spune încă „Funcțiile Excel nu se traduc, panglica da.” ca fapt sigur, iar ghidul îl ține ca deschis: regula 6 și X.3 VIII-1 (N8).
- **07:** r.6 „**Legea (de la 25.10.2026): `…\00_GHID_LECTII.md`** …”. **Trimite la ghid.** Totuși r.16 spune „Nu desenezi și nu generezi imagini.”, iar X.1 IV-2 permite desenul PIL al autorului într-un fișier de lucru (N8).
- **Skill-ul `/lectii`:** r.12 „**Ghidul consolidat (de la 25.10.2026), documentul pe care îl folosim de fiecare dată:** `…\00_GHID_LECTII.md`”. **Trimite la ghid.**
- **Anexa F:** F.4 = vechiul 08 §4, F.5 = §5, F.7 = §7, **identice** (26, 17 și 12 rânduri cu text; identice și față de copia din `_istoric`, și față de HEAD). F.0 e „actualizat 25.10”, deci nu are de ce să fie identic.
- Și `C:\00\AI_0\CLAUDE.md` (r.26): directiva KB#m853 are acum `grep -c "nu e în catalog" (CU î …)`. X.4 spune adevărul.

## 5. Baleierea

- `trimiteri2.py`: **177 de trimiteri** din antet, Partea I și Partea X, de forma „II.1 D”, „IX.2”, „X.1 K2”, „I.9”, „Anexa F”. **0 duc spre o secțiune care nu există.** Le-am citit și pe conținut: două duc la litera greșită (N1).
- Date personale: `grep -c "<cont>\|<e-mail>\|<telefon>"` = **0** (și `grep -c "742"` = 0). Ce găsește căutarea după „@” sunt doar domenii inventate (`@exemplu.test`, `@scoala-exemplu.test`) și `@netlify/blobs`.

## 6. Nepotriviri noi (toate MINOR)

- **N1.** X.1 II-K3 (r.2699) și IV.2 §11 (r.915) trimit regula S46 la „II.1 D”. S46 stă la r.218, sub „### E. Sfârșitul orei” (r.216); D e „Durata”.
- **N2.** Glosarul, r.147: „Lecțiile nr. 4 = … unde judecătorii au găsit lista J1-J19.” I.3 (r.71) și Anexa A (r.2789-2790) spun J1-J10, iar punctele 11-19 sunt regulile 11-19. Nu există J11-J19.
- **N3.** I.8, r.136 (rândul VIII): „autorul și judecătorul: DOAR secțiunea aplicației din lecție”. Antetul (r.16-17), 06 și 07 spun „secțiunile comune A-D + secțiunea aplicației”.
- **N4.** IX.2, r.2582: „`REGULA_NOUA.md` §1 are încă schema veche A40/B30/C20 … Le schimbă dirijorul”. Contrazice X.4 (r.2779), Anexa C (r.2862), paranteza din IX.4 și fișierul de pe disc.
- **N5.** X.1 III-8 (r.2715): „o probă de antrenament (fără notă) nu salvează nimic; o probă al cărei rezultat trebuie să rămână … îl ține prin `RezultatElev` …, ca VII/10 și VIII/13”. IX.1, r.2510, spune „evaluările V/12, VI/10, VII/10 = antrenament”, iar X.3 V-8 lasă V/12 deschisă. Hotărârea face fără să spună din VII/10 fie o excepție, fie o probă notată. Așa, ori III-8, ori IX.1 e greșit. (NESIGUR: poate VII/10 a devenit probă notată pe 11.10, iar r.2469 și r.873 vorbesc doar despre C/B/A.)
- **N6.** Anexa C, Partea V, n-are un rând pentru „Std r.25 (28.09): Paint/Notepad cu copia `Helium\User.dat`” și nici pentru rețetele Notepad din V.1 și VII.1. Antetul cere asta (r.9: „ce nu mai e valabil trece în Anexa C, cu data”).
- **N7.** V.1, r.1000 (regula 25, reguli generale): „Urmărești și procesele-copil ale lansatorului (la Notepad, copilul are ca părinte PID-ul tău).” E un rest al rețetei Notepad, nemarcat.
- **N8.** Brieful judecătorului, r.10 („Funcțiile Excel nu se traduc”), și brieful autorului, r.16 („Nu desenezi și nu generezi imagini”, „sub ~150 KB”), au rămas pe forma veche, deși X.1 IV-1 / IV-2 și X.3 VIII-1 au hotărât sau au lăsat deschis altfel. Briefurile spun că legea e ghidul, deci e mic, dar un agent citește briefurile primele.
- **N9.** Trimiteri rămase spre fișierele care sunt acum doar trimiteri: IX.2, r.2530 („de pus în `05_STANDARD_LECTIE.md`”), și Anexa C, r.2921 („vezi `08_RELUARE.md`”).
- **N10.** X.3 VIII-3 (r.2763) scrie „presupus (V/19-21)”, iar VIII.2 nr. 3 scrie „Lecțiile V/18-21”.
- (Nu e în ghid) Stratul din 25.10 din `REGULA_NOUA.md` (r.24) folosește forma scurtă „nota din catalog = (80 % lucrare + 20 % LearningHub) : 10”. Prima verificare a semnalat exact forma asta ca ușor de citit greșit; în ghid, regula 37 a fost corectată.

## 7. Ce ar mai fi de reparat (text, ~15 minute)

1. IX.4, r.2678: scos „(și VII/10)” sau scris „VII/10 hotărâtă 11.10”. Tot acolo, r.2687: fraza despre `REGULA_NOUA` trecută la „Lămurite” (fără „încă vechi”). IX.2, r.2582: scoasă bucata despre §1.
2. IV.2, r.915: formulele vechi date ca înlocuite, iar „II.1 D” → „II.1 E” (și în X.1 II-K3).
3. X.1 V-5: fie 06:00, fie motivul pentru 07:30.
4. IX.1: r.2476 fără ghilimele (sau citatul exact); r.2496 cu sursa (brieful autorului / fișa nopții); r.2450 cu trimitere la `_istoric\08…`.
5. Glosarul: „J1-J10”. I.8: „VIII A-D + secțiunea aplicației”.
6. III-8 împăcat cu IX.1, r.2510 (VII/10 e antrenament sau probă notată?).
7. Anexa C: un rând pentru Std r.25 / rețetele Notepad; V.1, r.1000: „(la Notepad…)” marcat ca istoric.
8. 06, r.10, și 07, r.16: aliniate cu X.1 IV-2 și X.3 VIII-1.
