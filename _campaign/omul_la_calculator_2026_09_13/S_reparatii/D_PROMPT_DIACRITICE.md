# Valul de diacritice — o lecție

Pui diacriticele românești (ă, â, î, ș, ț — **ș și ț cu virgulă**, niciodată ş/ţ cu sedilă) în textul unei lecții scrise fără ele.
**Nu schimbi nimic altceva** — nici un cuvânt, nici o virgulă, nici un spațiu. O poartă verifică asta octet cu octet.

Fișierul: `C:\00\Projects\LearningHub\content\tic\<cls>\<modul>\<lectia>.html` · folderul tău: `C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\<cls>\<lectia>\diacritice\`

## Unde DA
Textul românesc citit de elev: paragrafe, titluri de pași (`<h2>`, `<h3>`), liste, tabele, butoane cu text, casete, și **șirurile din `data-quiz`** (question, options, hint), atributele `alt`/`title`/`aria-label` când conțin propoziții românești.

## Unde NU
- `<title>` (regula sitului: fără diacritice), `<script>`, `<style>`, comentariile HTML pot rămâne cum sunt;
- `<code>`, `<pre>`, `<kbd>` (formule, nume de fișiere, taste);
- atributele `id`, `class`, `href`, `src`, `data-atom-id`, numele de fișiere (`Clasa_Nume_Tabele.docx`);
- cuvinte englezești și nume de meniuri englezești (Home, Insert, Layout, Slide Show) și nume proprii fără diacritice.

## Cuvintele cu două forme — decizi din context, nu mecanic
`in` → **în** (prepoziție) dar `in` rămâne în englezește; `si` → **și**; `sa` → **să** (conjuncție) vs **sa** (posesiv: „casa sa”); `ca` → **că** (conjuncție) vs **ca** („mare ca un…”); `fata` → **fața**/**fată**; `tara` → **țară**; `pana` → **până**/**pană**; `mana` → **mână**; `peste` → **peste**/**pește**; `sarcina`/`sarcină`; `a` articol vs `ă` final („lecția”, „tabelă”). Verbul „a fi”: `esti` → **ești**, `sunteti` → **sunteți**. Scrierea cu **â** în interiorul cuvântului (român, când, mâine, pâine) și **î** la început/final (început, a urî).
Numele românești din glosar sunt deja scrise corect — le lași.

## Cum lucrezi (fișierul e mare — pe bucăți)
1. Copiază fișierul original în folderul tău ca `original.html` (referința).
2. Împarte-l cu un script Python în bucăți de ~120 de linii (`in_01.txt`, `in_02.txt`, …), fără să tai o linie.
3. Pentru fiecare bucată: o citești, scrii `out_NN.txt` identic, cu diacritice adăugate doar unde e cazul. Lucrează linie cu linie; nu reformula, nu „repara” altceva (nici greșeli de tipar — le notezi în `observatii.md`).
4. Lipește bucățile (`out_*` în ordine) într-un `nou.html` și rulează:
   `python C:/00/Projects/LearningHub/_campaign/omul_la_calculator_2026_09_13/S_reparatii/D_poarta_diacritice.py <nou.html> <original.html>`
   Dacă pică pe „difera si in ALTCEVA”: îți arată linia — repari bucata respectivă și rulezi din nou. Până la **exit 0**.
5. Abia după exit 0: copiezi `nou.html` peste fișierul lecției (cu Python `shutil.copyfile`, păstrând UTF-8) și rulezi poarta încă o dată cu `--git content/tic/<cls>/<modul>/<lectia>.html`.
6. Verifici în browser că lecția merge: `python C:/00/Projects/LearningHub/_campaign/omul_la_calculator_2026_09_13/H_vede.py <fișierul lecției> <folderul tău>\vede` → în `masuri.json`: `pasi_blocati` = 0; în `consola.json`: nicio `pageerror`.
7. Uită-te la o captură (`pas_02.png`) și citește 10 rânduri din `innerText_vizibil.txt`: diacriticele se afișează corect (nu pătrate, nu semne ciudate).

Căi absolute în Bash, fără `cd`; scripturi Python cu backslash-uri prin Write. Nu faci commit.
Returnezi ≤6 rânduri: ultimele 2 rânduri ale porții pe fișierul final, densitatea de diacritice, pașii blocați, erori JS, și cuvintele la care ai ezitat.
