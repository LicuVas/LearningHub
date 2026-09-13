# 04 — Norma din afara lecției (U16, R2.1)

## Diacriticele
- `LESSON_SPECIFICATION.md` r.401: „**Diacritics IN content:** Use proper ă, â, î, ș, ț in body text”; checklist r.751: „Romanian text with proper diacritics (ă, â, î, ș, ț)”.
- Măsurat pe `innerText.txt` (aceeași formulă ca poarta): **0,0 diacritice la 1000 de litere, 0 diacritice în total** (text românesc normal ≈ 40-60). Nici ș/ț cu virgulă, nici ş/ţ cu sedilă — lipsesc cu totul.
- Într-o **evaluare de tehnoredactare** asta contează dublu: lecția cere „Documentul final trebuie sa arate ca o lucrare scolara reala”, dar textul-model al testului („Testeaza-ti cunostintele…”) nu respectă scrierea corectă. Elevul care scrie „Școala mea” (cum am scris eu în `produs_elev/`) face mai bine decât testul.

## Programa (OMEN 3393/2017, `C:/00/AI_0/data/informatica_gimnaziu/curriculum.json`, clasa VII, domeniul „Editor de texte”)
- „Obiecte într-un document: text, imagini, tabele”; „Operaţii de formatare a unui document: text, imagine, tabel, pagină”; „Reguli generale de tehnoredactare şi estetică a paginii tipărite”; „Reguli de lucru în realizarea unui document conform unor specificații (dimensiune pagină, dimensiune font, dimensiune imagine, format tabel)”.
- Deci **imaginea e în programă** (lecția are dreptate aici) — dar **nu e predată în lecțiile 1-5 de pe site** (`u1_predat_vs_cerut.txt`: Wrap Text 0, Crop 0, Picture Styles 0 în toate cinci; „Pictures” doar numit în lista butoanelor Insert din lecția 1). Norma R2.1 („Nu cere ce nu ai predat”) e încălcată: atomul „6b” e **prima** predare a imaginii, într-o evaluare.
- Invers: pagina (margini, orientare — „Margins” 6, „Orientation” 4 în lecția 5; câte ceva în lecția 1) **s-a predat, dar nu se evaluează** — în test „Page Setup” apare doar ca distractor la grila imaginii (`u1_predat_vs_cerut.txt`, ultimele rânduri). La fel Save As/export PDF (lecția 1: „Save As” de 14 ori; testul: 0).

## Planul anului (`Proiectul_unitatii_VII-U1.md` r.39)
- Ora 10 „Evaluare sumativă: tehnoredactare”, materiale: **„test_unitate, barem”**. Pagina nu are barem, punctaj sau timp (Grep: `u9_grep_spec.txt`).
- Evaluarea se raportează la descriptorii De bază / Consolidat / Avansat (L.198/2023 art. 95, O. 4.615/2026 anexa 15). Ex.2 cere „acorda-ti o nota de la 1 la 5” — autoevaluare pe altă scară, nu măsoară nimic din descriptori.

## Specialistul (tehnoredactor)
- Atomul 9 recomandă corect „aplica Styles (Heading 1, Heading 2) pentru consistenta in tot documentul”, dar Ex.1 și Ex.3 cer titlul făcut de mână („centrat, bold, font 24pt”) și Format Painter pentru consistență. Stilul „Titlu 1” există cu acest nume în Word ro (confirmat în lecția 3 pe text brut: „Aplicați stilul Titlu 1 .”).
- Legendă sub o imagine cu încadrare Pătrat: în meserie se folosește „În linie cu textul” sau „Sus și jos” (sau Inserare legendă); cu Pătrat, paragraful legendei curge pe lângă imagine (`04_a_doua_cale.json`).
