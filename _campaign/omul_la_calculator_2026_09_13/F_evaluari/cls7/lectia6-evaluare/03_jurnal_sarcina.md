# 03 — Jurnalul sarcinii (U1, U11)

## Constrângerile elevului pe care îl joc (U11)
- Clasa a VII-a, 13 ani, în noiembrie 2026. A făcut lecțiile 1-5 (poate nu toate — lecțiile 3-5 nu încap în câte o oră, vezi JURNAL).
- **Nu știe**: să insereze o imagine, ce e „Wrap Text”, „Crop”, „Picture Styles” — nu apar în lecțiile 1-5 (`u1_predat_vs_cerut.txt`). Nu știe unde e pe calculator o imagine de pus. Nu știe în ce folder să salveze.
- **Nu vede** cât valorează fiecare cerință: pagina nu are punctaj. Nu vede când se termină timpul.
- **Are** 50 de minute minus pornirea (8 la poartă), un PC posibil cu Word în română (necunoscut), fără garanția internetului.

## Ce am făcut, în ordine
1. **Grilele (11).** Fiecare întrebare are răspunsul în paragraful de imediat deasupra (ex. „Tab in ultima celula adauga automat un rand nou”, apoi întrebarea „Ce se intampla daca apesi Tab in ultima celula…”). Am verificat cheile după amestecare: toate 11 corespund textului (`u9_chestionare_lungimi.json`); nicio variantă corectă nu e cea mai lungă (R1.1 respectat). **Problema nu e cheia, ci ce măsoară:** un elev care citește paragraful nimerește; la răspuns greșit motorul **arată răspunsul corect** (`surse/s06_motor_grile.txt`, r.389) și nota rămâne în browserul acelui PC (localStorage, r.686). Profesorul nu vede nimic. Cheia grilei 11 („Inserarea si formatarea unei imagini” — „ai invatat-o in Modulul 1”) e falsă față de lecțiile 1-5.
2. **Ex.1 (minim).** Am construit `produs_elev/Ex1_Document_complet.docx` (A4): titlu centrat 20 pt bold albastru, paragraf Justify + alineat 1,25 cm + 1,5, listă cu sub-nivel, listă numerotată, tabel 3x4 cu antet colorat și o îmbinare, imagine proporțională cu încadrare Pătrat. Redeschis: toate valorile corecte (`07_redeschis.json`). **Blocaj real înainte de orice clic:** „Insert > Pictures (This Device)” cere un fișier-imagine — de unde? Lecția nu spune; eu l-am desenat (PIL). Fără un folder pregătit de profesor, jumătate de clasă caută pe internet sau se oprește.
3. **Ex.2 (standard).** Cerința: „tabel cu 3 coloane … si 5 randuri” pentru 5 lecții + antet. Făcut exact: antetul + **doar 4 lecții** încap (`Ex2_cerinta_3x5`). Rezolvarea pliată spune „3 coloane x 6 randuri (antet plus 5 lectii)”. Elevul care urmează cerința greșește după rezolvare. Și: „acorda-ti o nota de la 1 la 5” — nota o dă elevul, nu testul.
4. **Ex.3 (performanță).** `Referat_M1_Performanta.docx`: titlu 24 pt, 2 paragrafe, două liste cu sub-niveluri, tabel 4x5 cu stilul „Light Grid Accent 1” și îmbinare, imagine Pătrat + legendă centrată italic. **Randat în PDF, legenda nu stă dedesubt, ci LÂNGĂ imagine** (y0 legendă 492 între y0 467 și y1 595 ai imaginii) — încadrarea Pătrat face exact asta: textul curge pe lângă. Cerința „Wrap Text setata la Square, cu o legenda scrisa dedesubt” se bate cap în cap cu ea însăși. Randarea LibreOffice probează conținutul; în Word poziția exactă poate diferi, dar principiul („textul înconjoară imaginea”, `surse/s02`) e al Word-ului.
5. **„Vrei mai mult?”** „Ctrl+A apoi Ctrl+J” pe un document care are deja titlul centrat: Ctrl+A = tot documentul (`surse/s05`), deci titlul își pierde centrarea (`u1_iesire.json`). Pe un document gol cu un singur paragraf merge. Și „Bold pe primul cuvant … fara sa atingi mouse-ul” cere selecția cu Ctrl+Shift+săgeată — predată doar o dată, în lecția 1 (Grep).

## Unde se blochează un începător (ipoteze AI — de verificat la oră)
- La imagine: nu are fișier; nu știe ce e „Wrap Text”; trage de latură și deformează.
- La alineatul primului rând: dialogul Paragraf, lista „Special” (predată în lecția 3, dar lecția 3 nu încape într-o oră).
- La Merge Cells: nu selectează două celule înainte.
- La salvare: dialogul „Salvare ca” — unde? Ora viitoare fișierul poate să nu mai existe.
- La grile: citește paragraful și copiază — trece, fără să știe.
