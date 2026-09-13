# Observatii — cls5 / lectia5-reguli (diacritice)

Poarta: OK, exit 0 (pe nou.html si cu --git). Densitate 69.4 la 1.000 litere. 271 linii schimbate.
H_vede: pasi_blocati 0, consola 0, nicio pageerror. pas_02.png: diacriticele se vad corect.

## Greseli de tipar lasate NEATINSE (de reparat separat, nu tin de diacritice)
- linia ~86: "Daca varsi apa" -> corect "verși"; am lasat "varsi" (a->e nu e diacritica).
- linia ~147: "Daca tranti usa" -> probabil "trântești"; am pus doar "trânti".
- linia ~459: "In timp ce astepta reparatia" -> sensul cere "aștepți"; am pus "aștepta".
- linia ~733: "poze ruinoase" -> probabil "rușinoase" (lipseste o litera).
- linia ~111: "Tine apasat tasta Ctrl" -> acord ("Ține apăsată tasta").
- linia ~660: "este secreta ta personala" -> "secretul tău personal" (formulare).

## Decizii / ezitari
- Nume de foldere din diagrama (Scoala, Romana, Matematica, Vacanta_2025) = nume de fisiere/foldere -> lasate fara diacritice.
- "Fara titlu.docx" / "Fara titlu - Copy - Copy (2).docx" = nume de fisiere -> lasate.
- In proza, "unul pentru Romana" / "de romana" -> "Română" / "română" (materia, nu folder).
- `<title>` si sirul `lesson:` din `<script>` (breadcrumb) raman fara diacritice (regula), deci breadcrumb-ul afiseaza "Reguli in Laboratorul de Informatica".
- data-level="performanta" (atribut) neatins.

## Incident de proces
- Primul split.py copiat din pilot a rulat inca pe calea cls8\lectia3-formule (sed nu a inlocuit calea) si a regenerat in_*.txt acolo din original.html-ul lor — rezultat identic (split determinist), niciun out/spec/nou atins.
- build.py al pilotului compara `new.translate(HARTA) == old`, ceea ce respinge liniile care aveau deja diacritice ("Închidere", "siguranță"); l-am corectat sa compare caracter cu caracter.
