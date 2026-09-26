# Harta prerechizitelor

La fiecare lecție: ce trebuie să știi deja și unde găsești, dacă nu știi. Generat de `oracol_novice.py --harta`; nu edita de mână — schimbă `prereq`/`glosar` în config și regenerează.

## Seiful de parole: Clipperz la calculatorul școlii  (`index.html`)
- **Presupune:** nimic din sit

## De ce un seif de parole  (`01-seiful.html`)
- **Introduce:** manager de parole, seif de parole, criptare
- **Presupune:** nimic din sit

## Fereastra de Invitat  (`02-modul-invitat.html`)
- **Introduce:** modul Invitat, cookie
- **Presupune:** nimic din sit

## Îți faci contul, fără e-mail  (`03-contul.html`)
- **Introduce:** nume de utilizator, frază de acces
- **Presupune:**
  - parolă puternică — din afara sitului: jocul LearningHub «Comunic prin Internet, în siguranță» (clasa a VI-a), nivelul 2, pasul «Rețeta unei parole puternice» — ../../jocuri/internet-vi/index.html  _( cerut de «frază de acces» )_
- **Bloc propus** (de lipit la începutul lecției):

```html
<h2>Ce trebuie să știi</h2>
<ul>
  <li>parolă puternică — se învață din: jocul LearningHub «Comunic prin Internet, în siguranță» (clasa a VI-a), nivelul 2, pasul «Rețeta unei parole puternice» — ../../jocuri/internet-vi/index.html</li>
</ul>
```

## Prima parolă în seif  (`04-prima-fisa.html`)
- **Introduce:** fișă, memoria de copiere
- **Presupune:**
  - seif de parole — [De ce un seif de parole](01-seiful.html)  _( cerut de «fișă» )_
- **Bloc propus** (de lipit la începutul lecției):

```html
<h2>Ce trebuie să știi</h2>
<ul>
  <li>seif de parole — dacă nu-ți amintești, recitește <a href="01-seiful.html">De ce un seif de parole</a></li>
</ul>
```

## Rutina de la școală  (`05-la-scoala.html`)
- **Introduce:** keylogger, parolă de unică folosință
- **Presupune:**
  - modul Invitat — [Fereastra de Invitat](02-modul-invitat.html)  _( cerut de «keylogger» )_
  - frază de acces — [Îți faci contul, fără e-mail](03-contul.html)  _( cerut de «parolă de unică folosință» )_
- **Drumul înapoi** (ce presupun, la rândul lor, cele de mai sus):
  - parolă puternică (pentru frază de acces) — extern
- **Bloc propus** (de lipit la începutul lecției):

```html
<h2>Ce trebuie să știi</h2>
<ul>
  <li>modul Invitat — dacă nu-ți amintești, recitește <a href="02-modul-invitat.html">Fereastra de Invitat</a></li>
  <li>frază de acces — dacă nu-ți amintești, recitește <a href="03-contul.html">Îți faci contul, fără e-mail</a></li>
</ul>
```

## Verifică-te și provocarea  (`06-recapitulare.html`)
- **Presupune:** nimic din sit
