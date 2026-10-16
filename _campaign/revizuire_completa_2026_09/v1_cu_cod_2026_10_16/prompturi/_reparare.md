# Repararea după judecată — lecțiile 1 cu codul (16.10.2026)

Ești autorul care REPARĂ o lecție după judecător. Lecția e aproape gata: nu o rescrii, repari exact punctele primite.

## Citește întâi
1. `C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\v1_cu_cod_2026_10_16\prompturi\_comun.md` — regulile autorilor (contract, standard, interdicții, componente comune, porți). Din `05_STANDARD_LECTIE.md` citești doar regulile pe care le atinge o reparație.
2. Contractul `…\v1_cu_cod_2026_10_16\contract.md` → „Decizii luate” (doi pași, locul lor, I3 corectat).
3. Raportul judecătorului lecției tale: `lectii\<clasa>\m1-l01\_verificare\judecator_cod<N>.md` + `.json`, ÎNTREG.
4. `_proba\stare_autor.md` al lecției (ce a decis autorul și de ce) și `surse.md` (secțiunea despre cod).
5. Dacă ți se dă: punctele cititorilor-începători (`…\cititori_v1\REZULTATE.md`) și ce au găsit judecătorii celorlalte lecții 1 (aceeași formă) — le aplici unde se potrivesc lecției tale.

## Cum repari
- GRAV și MAJOR: fiecare, cu reparația concretă din raport (sau una mai bună, cu motivul scris în `surse.md`). Dacă nu ești de acord cu judecătorul, arbitrul e caseta ADEVĂRATĂ (`prezenta.js` servit local, cu serverul fals local care mută și `api` pe 127.0.0.1): probezi și scrii dovada; nu ignori punctul.
- MINOR: toate cele de fapte, siguranță sau text contradictoriu; restul, dacă sunt ieftine.
- Textul rămâne în plafon (110 cuvinte text / 85 „Uite cum” pe pas, după oracol). O explicație nouă de cuvânt („deconectare = …”) înlocuiește, nu se adaugă peste.
- Numele de butoane rămân literă cu literă cele de pe ecran; explici ce fac, în cuvinte de copil.
- NU modifici `intrare-cod.js`, unealta de capturi, proba textelor (proprietar: V/1), `prezenta.js`, `motor.js`. Ce trebuie schimbat acolo scrii în răspuns la `"pentru_componenta_comuna"` / `"cereri_api"`.
- `afirmatii.json`, `surse.md` (tabel: punct → reparație → loc), `_proba\stare_autor.md` la zi.

## Porțile (toate, la final)
`test_joc.py` TRECUT · `verifica_lectie.py --fara-t1` → 0 · oracolele R6 → 0 · `intrare_cod_texte.py` → 0 · proba izolării → 0/0 · gesturi reale până la diplomă la 390 atingere + 1280 → 0 · `learninghub_date_personale.py` → 0. Ieșirile lungi în `_proba\*.txt`, citești coada.

NU faci commit, NU publici. Căi absolute, fără `cd`. Nimic spre servicii externe (vezi `_comun.md`).

## Răspunsul final (scurt)
`{"lectia":"…","reparate":[{"id":"…","grav":"GRAV|MAJOR|MINOR","loc":"…","ce":"…"}],"nereparate":[{"id":"…","de_ce":"…"}],"porti":{…},"pentru_componenta_comuna":[…],"cereri_api":[…]}`
