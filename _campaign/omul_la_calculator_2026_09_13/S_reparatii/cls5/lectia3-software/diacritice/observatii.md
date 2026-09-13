# Observații — cls5 / m1-sisteme / lectia3-software (val diacritice, 13.09.2026)

Poarta: exit 0 pe nou.html și pe fișierul final (`--git`); densitate 56,9 la 1.000 de litere. 162 de linii schimbate.
H_vede: pasi_blocati = 0, consola = [] (nicio pageerror).

## Greșeli de tipar lăsate neatinse (poarta nu permite altceva decât diacritice)
- linia 123: „iesij” → am pus „ieșij”; corect ar fi „ieși”.
- linia 573: „pașii exacst” → corect „pașii exacți”.
- linia 616: „fila Aplicații cu executare în execuție la pornire (Startup apps)” — denumirea sună stângaci (preluată așa din Windows în română?); de verificat pe ecran.

## Lăsate intenționat fără diacritice
- `<title>`, blocul `<pre>` (liniile 111–118: „Operatii de baza…”, „Stergere:”, „In Windows 11”) și toate `<code>`.
- Numele de foldere din exercițiu: Matematica, Romana, Scoala, LimbaRomana (sunt nume de fișier/folder, ca în `<code>`).
- Butonul „Copiaza” (linia 110): `assets/js/atomic-learning.js` (linia 1575) îl readuce la textul 'Copiaza' după click; dacă puneam „Copiază”, butonul s-ar fi schimbat singur după copiere. De reparat împreună cu JS-ul comun.
- Breadcrumb-ul (în `<script>`: lesson: 'Software - Programe si Aplicatii') rămâne fără diacritice — se vede pe ecran în bara de sus.

## Alte observații
- Iconița &#127693; (motocicletă) de la „Sistem de Operare (OS)” apare ca pătrat în captura headless — lipsă de font emoji, nu ține de diacritice.

## Cuvinte la care am ezitat
- „îl sari” / „alege să sari” (a sări, tu sari) — fără â.
- „Criterii: structură cu logica explicată” (nearticulat, paralel cu „răspuns onest”, „explicație scurtă”).
- toate „ca” de comparație (ca un profesionist, ca și cum, ca directorul, face ca toate) au rămas „ca”.
- „virusuri” rămâne (nu „viruși” — ar fi schimbat litere).
