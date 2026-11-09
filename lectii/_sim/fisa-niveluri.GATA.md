# fisa-niveluri.js — predarea (proprietar: lecția V/36, `lectii/v/m5-l36`; 1.0 la 09.11.2026, 1.1 după judecata 1, aceeași zi)

Fișa de niveluri a elevului, pentru lecțiile „Recapitulare finală și feedback de progres” (V/36, apoi VI/36, VII/36, VIII/35). Condusă de date: în cod nu scrie nimic despre o clasă anume. Nu ține minte nimic și nu trimite nimic (regulile 23 și 27).

**sha1 (git hash-object nu; sha1 pe octeții fișierului):** `62e7c48c638f3097a7ab99ee8663d769a240a1c3`

## Încărcarea

```html
<script src="../../../jocuri/_motor/motor.js"></script>
<!-- simulatoarele exercițiilor din atelier, nemodificate -->
<script src="../../_sim/fisa-niveluri.js"></script>
```
```js
FisaNiveluri.stil();
JocMotor.porneste({… tipuri: FisaNiveluri.curat({'fisa-niveluri': FisaNiveluri.tipuri['fisa-niveluri'], /* + tipurile exercițiilor */}) …});
```

## API (window.FisaNiveluri)

| Ce | Face |
|---|---|
| `versiune` | `'1.1'` |
| `stil()` | stilul, o dată (`#fn-css`, clase `fn-*`) |
| `harta(randuri, eticheta?)` | harta „predat unde”; `eticheta: ''` = fără „Lecțiile:” pe fiecare rând (1.1) |
| `lectii(lista, eticheta?)` | rândul de legături (ținte ≥ 36 px); `''` = fără etichetă (1.1) |
| `coduri(randuri, titlu?)` | (1.1) `<details class="verif fn-cd">`: fiecare cod, numele lui și ce poți arăta — pentru laborator |
| `sari(n?)` | (1.1) „Sari la exercițiul: 1 … N” pentru `atelier.intro`; fără `n`, N se ia din „Exercițiul k din N” al motorului. Merge prin `JocMotor.test.exercitiu(k)`, singura cale a motorului spre un exercițiu anume (ca `excelx-test.js`, `simppt-proba.js`); fără cârlig, întoarce `''` |
| `curat(tipuri)` | (1.1) aceleași tipuri, dar fiecare exercițiu din atelier primește un `#body` NOU, gol, fără mânere. Obligatoriu pe TOATE tipurile atelierului când unul dintre ele e `tabel-urmarire` (vezi „Capcane”) |
| `tipuri['fisa-niveluri']` | `render`, `rezolva`, `gresit` |

**Forma:** `Q = {t:'fisa-niveluri', q, randuri, litere?, sens:{D1,D2}, neatins?:{buton,text}, nota, caiet, gata?, ajutor, why}`; `rand = {cod, nume, oficial, scurt, lectii:[{nr,href}], c, b, a, dovezi:[…], ex?}`.

## Comportamentul

- Testul judecă doar FORMA: ceva ales pe fiecare rând. La fișa completă nu scrie „Corect!”, ci `Q.gata` (implicit „Ai ales ceva pe fiecare rând.”); focusul trece pe „Încă un exercițiu” (regula 14).
- Literele dispar la: alt exercițiu, plecarea de pe pagină (`pagehide`), alt elev (`prezenta` cu altă identitate), „Golește fișa”. Mânerele `pagehide`/`prezenta` se scot la fiecare desen și singure, când fișa nu mai e în pagină (1.0 arunca o eroare atunci).
- Fără `<input>`, `<textarea>`, `<form>`, stocare, cereri.

## Capcane (găsite la judecata 1, V/36)

1. **Mânerul lui `urmarire-decizie.js` pe `#body`:** motorul refolosește `#body` între exercițiile atelierului; după tabelul rezolvat, prima atingere în exercițiul următor redesena tabelul peste el (Scratch dispărea). Remediul: `FisaNiveluri.curat(tipuri)`. Componenta comună e neatinsă; cererea către proprietarul ei: `lectii/v/m5-l36/surse.md`, „Pentru componenta comună”.
2. **Saltul:** motorul nu are „Mergi la exercițiul k”; „← Înapoi la atelier” duce unde ai rămas. De aceea `sari()`; textul paginii trimite la „Sari la exercițiul”.
3. **„Corect!” pe fișă** pare o notă: scos în 1.1.

## Probe (lecția V/36)

`_proba/proba_fisa.py` (stocare, cereri, colegul de după, copia stricată prinsă; numărul rândurilor se ia din date), `_proba/proba_reparatii.py` (drumul elevului cu butoanele paginii, 390 cu atingere și 1280; pică pe 1.0).
