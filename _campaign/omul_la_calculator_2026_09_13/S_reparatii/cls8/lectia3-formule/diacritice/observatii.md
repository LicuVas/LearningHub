# Observații — cls8 / lectia3-formule (val diacritice, PILOT)

## Lăsate neschimbate (nu erau de reparat în acest val)
- Rândul „inventa unele noi!” (Exercițiul 3): imperativul corect e „inventează” (necesită litere în plus). Rămas „inventa”.
- `<th>Formula</th>` și celula „Formula TVA” din grilă: lăsate articulat („Formula”), nu „Formulă”.
- Textele venite din JS comun (nu din fișier): „Verifica daca ai inteles” (atomic-learning.js), breadcrumb-ul „Formule de Baza in Excel” (vine din `<script>`, pe care regula îl exclude). Fără diacritice: de rezolvat în JS, separat.

## Decizii din context
- „verifica ca celula nu e formatata ca Text” → „verifică că celula nu e formatată ca Text” (primul „ca” = conjuncție, al doilea = comparație).
- „vrei ca referinta sa se schimbe” → „ca” rămâne (construcția „ca… să”).
- „C3 ar da 15” → rămâne „da” (condițional); „da doua analogii” → „dă două” (imperativ).
- „SI” majuscul în tabel → „ȘI”; „TAU” → „TĂU”; „Nota:” → „Notă:”; „Rigla” → „Riglă” (listă de produse nearticulate).
- Blocurile `div.code-block` (tabel de copiat, NU `<code>`): „Cheltuială / Preț/elev / Mâncare” cu diacritice, ca să se potrivească cu rezolvarea („textul Preț/elev”).

## Poarta
- Fals-pozitiv reparat: comentariul `<!-- NO inline <style> blocks. ZERO. -->` (198 de lecții) deschidea un „bloc style” până la primul `</script>`, deci orice diacritică din corpul lecției pica pe „diacritice adaugate intr-un <script> sau <style>”. Fix: comentariile HTML scoase înainte de acest control + tag de închidere pereche (`</\1>`). Test negativ: diacritică pusă în scriptul real tot pică (exit 1).
