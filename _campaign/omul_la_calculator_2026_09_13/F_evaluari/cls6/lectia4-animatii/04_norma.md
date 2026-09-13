# 04 — Norma din afara lecției (U16) · cls6/lectia4-animatii

## Diacritice
- Măsurat de poartă pe `innerText.txt`: **1,3 la 1000 de litere** (text românesc normal ≈ 40-60). Lecția e scrisă fără diacritice, cu câteva scăpări („dezvălui”, „trasă”, „Pulsează”, „tranziții”, „Creează”, „apeși”, „evidențiere”, „declanșa animația”).
- Toate cele 9 ș/ț din HTML sunt cu **virgulă** (corect), 0 cu sedilă (`u9_iesire.json`: `comma_s_t: 9`, `cedilla_s_t: 0`).
- `LESSON_SPECIFICATION.md:401`: „**Diacritics IN content:** Use proper ă, â, î, ș, ț in body text”; checklistul `:751`: „Romanian text with proper diacritics (ă, â, î, ș, ț)”. Titlul `<title>` fără diacritice e permis (`:400`, „ASCII-safe titles”).

## Programa (OMEN 3393/2017, din `C:/00/AI_0/data/informatica_gimnaziu/curriculum.json`; extras în `u16_programa.txt`)
- Conținuturi clasa a VI-a, „Prezentări”: „**Efecte de animație**”, „**Efecte de tranziție**” (două rânduri separate, dar planul școlii le pune într-o singură oră: ora 7).
- Activitate de învățare: „realizarea unei prezentări noi, pe o temă atractivă, aplicând efecte de animație obiectelor și de tranziție diapozitivelor și expunerea prezentării”.
- Standardele (O. 4.615/2026, în același fișier): nivelul „cu sprijin” = „elemente simple de structură și conținut (casete text, forme predefinite), prin editare, formatări, expunere, în pași ghidați”; abia nivelul cel mai înalt are „**efecte predefinite**”. „Temporizare” apare în standarde doar la **animațiile grafice** (M4-M5 din planul VI: 30.03-08.06.2027), nu la prezentări.
- Consecință: traseele desenate, declanșatoarele și temporizarea fină (Ex.3, parțial Ex.2) sunt peste nivelul standard al prezentărilor; lecția marchează doar Motion Paths ca „aprofundare”, apoi îl cere la Ex.1 minim.

## Ce spune specialistul (designer de prezentări, 2026)
- Mesajul „animații cu măsură” e corect și sursat de Microsoft: „Experții în prezentări recomandă să folosești mai rar animațiile... prea multă animație poate distrage atenția” (`surse/raw/baza_ro.txt`). Planul școlii adaugă „când ajută și când încurcă” — lecția îl tratează doar ca regulă („max 2-3”), nu ca judecată pe exemple.
- Lecția nu pomenește Morph (Metamorfoză), pe care Microsoft îl recomandă pentru mișcare (`surse/raw/traseu_ro.txt`: „Abonații Microsoft 365 au o opțiune de economisire a timpului... Metamorfoză”). Nu e greșeală pentru clasa a VI-a (e doar în Microsoft 365).
- „Regula de aur: maximum 2-3” e o regulă de practică, fără sursă; ca normă de clasă e rezonabilă.
