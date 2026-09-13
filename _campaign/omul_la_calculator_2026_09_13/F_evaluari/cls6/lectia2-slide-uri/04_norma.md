# 04 — Norma din afara lecției (U16 + programa + specialist)

## Diacriticele
- Măsurat de mine și de funcția porții pe `innerText.txt`: **0,1 diacritice la 1000 de litere** (text românesc normal ≈ 40-60).
- În toată lecția există exact două cuvinte cu diacritice: „Mulți” (atomul 2) și „bifează” (atomul 7) — `u3_iesire.json` → `cuvinte_cu_diacritice`. Deci nici măcar consecvența internă nu e respectată; restul: „Continut”, „Invatare Atomica”, „Multumesc pentru atentie!”.
- Ș/ț cu virgulă vs ş/ţ cu sedilă: „Mulți” folosește ț cu virgulă (U+021B) — corect; nu există sedile.
- **Norma:** `LESSON_SPECIFICATION.md:401` — „**Diacritics IN content:** Use proper ă, â, î, ș, ț in body text”; checklistul `:751` — „Romanian text with proper diacritics (ă, â, î, ș, ț)”.
- Titlurile-model pe care elevul le tastează („Pasiunile Mele”, „Multumesc pentru atentie!”, „Descopera [Orasul]”) îl învață să scrie fără diacritice pe diapozitiv.

## Programa (OMEN 3393/2017, `C:/00/AI_0/data/informatica_gimnaziu/curriculum.json`)
- Conținuturi clasa a VI-a: „Structura unei prezentări: diapozitive, obiecte utilizate în prezentări (casete de text, imagini importate, forme, sunete, tabele, legături)”; „Operații de editare a unei prezentări: inserare, copiere, mutare, ștergere a unui diapozitiv/obiect”; „Formatarea textului, obiectelor, diapozitivelor”.
- CS.1.1, activitate: „analiza unei prezentări model din perspectiva structurii și efectelor utilizate și modificarea acesteia la nivel de conținut și de aspect”.
- Standardul (O. ME 4.615/2026), descriptorul „Consolidat”: „...prin editare, **formatări de bază**, expunere, în contexte familiare”; „Avansat”: „...formatări și efecte predefinite ... respectând reguli date de structură și design, în contexte noi”.
- **Consecințe:** (1) lecția nu predă obiectele (casete de text, imagini, forme) cerute de programă la ora 4; (2) nota lecției citează programa ca „Diapozitive, text, obiecte; animatii si tranzitii” — formularea **nu** apare textual în `curriculum.json` (citat aproximativ); (3) Slide Master nu e „formatare de bază” → e corect scos din standard în notă, dar exercițiul de nivel standard îl cere — contradicție cu propria notă și cu descriptorul „Consolidat”.

## Ca specialist (designer de prezentări, 2026)
- **Bine:** lecția împinge spre aspecte (layouts) în loc de diapozitive „Blank” poziționate manual — exact cum se lucrează corect (echivalentul stilurilor din Word); explică și de ce (reașezare automată). Legătura Slide Master ↔ Stiluri Word din „Vrei mai mult?” e bună.
- **Slab:** atomul 7 predă gradient, textură și model ca „tipuri de fundal” de bifat („Minimum 3 tipuri de fundaluri” la Ex.4) — o prezentare cu trei fundaluri diferite contrazice chiar sfatul lecției despre consecvența temei (atomul 6). Pentru lizibilitate (principiul coerenței, Mayer — `A_cercetare...md` §2.2) fundalul simplu e regula, nu exercițiul de varietate.
- „Regula 60-30-10 pentru fundaluri cu imagine: 60% fundal, 30% spațiu alb, 10% text” — în designul de interior/grafic 60-30-10 e o regulă de **proporție a culorilor**; aplicarea ei la suprafața de text pe o imagine nu are sursă. Nu am găsit sursă primară în timpul evaluării → nu o ridic la semnalare, o las ca întrebare de verificat.
- „Reduce Transparency (semi-transparent 40-60%)” — comanda nu se cheamă așa; în panou e un glisor de transparență (en „Transparency”). Nesursat pe text brut → neridicat.
- Gradientul-model #60a5fa → #3b82f6: contrast 1,45:1 între capete (calcul W3C, `u3_iesire.json`) — trecerea abia se vede în randare.

## Modul prezentare / distanță / o idee pe diapozitiv
- Lecția nu cere niciun test în Expunere diapozitive (F5) și nu spune nimic despre mărimea fontului sau citirea din fundul clasei.
- „O idee pe diapozitiv”: nu e formulată ca regulă nicăieri în atomi; apare doar „text lizibil” în rezumat și „regula 6x6”, pomenită în rezolvarea pliată a Ex.3 fără să fi fost predată (R2.1).
