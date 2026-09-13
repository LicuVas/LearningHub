# 04 — Norma din afara documentului (U16)

## Diacritice
- Măsurat pe `innerText.txt` (fără textul marcat ASCUNS ca etichetă): **0,2 la 1000 de litere** — 4 litere cu diacritice în toată lecția: „cauți”, „Identifică” (întrebarea 2), „apeși” (de două ori). Text românesc normal ≈ 40-60.
- Deci lecția nu e nici măcar consecvent fără diacritice: amestecă „cauți” cu „cauta”. Cele 4 diacritice sunt cu virgulă (ș, ț), nu cu sedilă.
- **Spec-ul proiectului**, `C:\00\Projects\LearningHub\LESSON_SPECIFICATION.md`:
  - rândul 401: „**Diacritics IN content:** Use proper ă, â, î, ș, ț in body text”
  - rândul 751 (checklist): „Romanian text with proper diacritics (ă, â, î, ș, ț)”
  - rândul 400: titlurile `<title>` și numele de fișiere FĂRĂ diacritice — respectat.
- Lecția e în afara regulii 401 pe tot corpul textului.

## Programa (OMEN 3393/2017, via `C:\00\AI_0\data\informatica_gimnaziu\curriculum.json`, clasa a V-a, CS.1.1)
- Activitatea de învățare: „**descrierea momentelor principale în evoluția sistemelor de calcul și de comunicații** (prin imagini/desene/grafice/filme didactice etc.) **cu identificarea caracteristicilor dispozitivelor actuale**”.
  - Lecția: evoluția sistemelor de **calcul** e acoperită (4 generații, ENIAC, Intel 4004, smartphone). Evoluția sistemelor de **comunicații** (telefon, radio, internet, rețea mobilă) **lipsește** — apare doar exemplul WhatsApp la IPO. Planul orei 3 are exact „sisteme de calcul și de comunicații”.
  - „Prin imagini/desene/filme”: lecția are 0 etichete `<img>` (Grep în HTML) — doar emoji și tabel.
- Standardul de învățare (O. 4.615/2026, același fișier): „Sisteme de calcul și de comunicații întâlnite în viața cotidiană … unități de măsură pentru capacitatea de stocare (bit, byte, kilobyte, megabyte, gigabyte, terabyte, petabyte etc.) - comparație între dispozitivele de stocare în funcție de capacitate”.
  - Unitățile sunt acoperite (inclusiv PB); comparația între dispozitive de stocare după capacitate: doar „Hard disk tipic 1–2 TB”, nu stick/card/SSD/cloud — dar asta e ora 6, nu ora 3.

## Norma de specialitate (tehnician)
- Prefixele: NIST/IEC 60027-2 (1999) — kilo = 1000, kibi (Ki) = 1024 (`surse/citate_verificate.txt`). Lecția prezintă 1024 ca singura valoare („exact 1024”), fără să spună că producătorii de discuri folosesc 1000 — de aceea un disc „de 1 TB” apare mai mic în calculator. Manualele școlare românești folosesc de obicei 1024; semnalarea e „important”, nu „greșit la fond”.
- „Primul calculator electronic programabil” = ENIAC: contestat de sursa primară TNMOC (Colossus, 1944). Formularea corectă: „primul calculator electronic programabil **de uz general**”.
