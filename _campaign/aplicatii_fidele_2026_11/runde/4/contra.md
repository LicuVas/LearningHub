# Runda 4 · etapa B · Word · CONTRA (pasul 4)

## Cel mai puternic argument PENTRU plan
Pentru prima dată toate cele 4 GRAV au referință reală înghețată (runda `acoperire`, Word real pe desktopul ascuns):
rândurile listelor, ferestrele „Save this file” / „Save your changes…” cu butoanele lor, starea după Cancel / Don't Save,
pagina Open. Rundele 1-3 au stat pe platou tocmai pentru că lipseau aceste referințe; acum fiecare reparație se poate
desena din date (`genereaza_word.py` + `panglica.js`) în loc să fie scrisă de mână, iar O4 are 7 scenarii reale care
le judecă. Abaterea A2-1 (fereastra „Save this file” inventată) dispare de tot.

## Cel mai puternic argument ÎMPOTRIVĂ
N4 cere un model nou — documentul se poate ÎNCHIDE (Word fără document), se poate REDESCHIDE din Recent, are fișiere cu
conținut — într-un `word.js` de 1600 de rânduri în care totul presupune un document mereu deschis. Fiecare comandă
(tastare, panglică, clic în zonă) poate rupe ceva când `M.deschis` e fals, iar O5 / O9 / porțile rulează pe poligon și
pot crește. În plus, o parte din N4 nu are referință: documentul DEJA salvat și modificat la Ctrl+W (referința e doar pe
document nou), ce arată Word fără document (doar titlul „Word” e capturat), ✕ + Don't Save (Word se închide de tot).

## Adevărul incomod (punctul cel mai puțin sigur)
Lecția m1-l03 tot nu se va putea juca întreagă pe bibliotecă după runda asta: folderul nu se poate alege (panoul din stânga
al referinței are doar Acasă / Galerie / Acest PC / Rețea — „Documente” și „Descărcări” au fost scoase ca personale),
întrebarea „already exists” nu are referință, iar fereastra Open (Browse) nu e construită. Deci N4 poate rămâne
„reparat parțial” la criticul 5, chiar dacă tot ce are referință e construit.

## Hotărârea (după cele trei)
Fac A1, A2, GRAV 3 (mici, cu referință completă) și din N4 tot ce are referință + parametrii de conținut ceruți, cu o
singură regulă pentru ce n-are referință: aleg comportamentul cel mai apropiat de referința existentă și îl trec în
`de_verificat.md` (AC-4 … ), nu îl ascund. Starea „fără document” e o singură variabilă (`M.deschis`) verificată la
intrarea fiecărei căi care scrie în document. Măsor `--doar O4,O5,O9` după fiecare GRAV, ca o creștere să se vadă pe
GRAV-ul care a produs-o.
