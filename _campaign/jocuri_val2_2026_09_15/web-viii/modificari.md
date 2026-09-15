# Modificări — jocuri\web-viii\index.html (evaluator independent, 15.09.2026)

Doar două reparații, amândouă în simulatorul „cod” (obiectul `JocCod`). Conținutul (pagini, întrebări, chei) nu a fost atins.

## M1 (S1) — parola ascunsă în comentariu sau în atribut trecea de verificare

**Înainte**
```js
if(c.absent){if(new RegExp(c.absent,'i').test(doc.documentElement.textContent))out.push(c.msg);continue}
…msg:'Pe pagină a rămas o parolă sau un dat personal (telefon, e-mail). Șterge-l din cod.'
```
**După**
```js
/* absent se caută în TOT codul publicat (text, atribute, comentarii), nu doar în textul vizibil: și codul sursă se vede pe web */
if(c.absent){if(new RegExp(c.absent,'i').test(doc.documentElement.textContent+'\n'+src))out.push(c.msg);continue}
…msg:'În cod a rămas o parolă sau un dat personal (telefon, e-mail), chiar dacă nu se vede pe pagină. Șterge-l de tot din cod.'
```
**De ce:** enunțul cere „în cod e un rând care nu are voie să fie publicat. Șterge-l.” Un comentariu HTML sau un `alt` se publică odată cu fișierul și se văd în sursa paginii (Ctrl+U), deci parola ajunge oricum pe web. Simulatorul accepta HTML greșit față de cerință.
**Dovada:** `t_simulator.py A`. Înainte: „parola doar comentată” acceptat=True, „parola mutată în alt” acceptat=True. După: ambele respinse, iar soluția și varianta cu `ol`, fără doctype și fără ghilimele sunt în continuare acceptate.

## M2 (S2) — `src="./carpati.jpg"` era respins

**Înainte**
```js
if(v!=='*'&&a.trim().toLowerCase()!==String(v).toLowerCase())return false}
```
**După**
```js
if(v!=='*'&&a.trim().replace(/^\.\//,'').toLowerCase()!==String(v).toLowerCase())return false}
```
**De ce:** `./carpati.jpg` și `carpati.jpg` sunt aceeași adresă relativă, deci era HTML corect respins.
**Dovada:** `t_simulator.py A`: „cale ./carpati.jpg” acceptat=False înainte, True după.

## Verificare după reparații
- Bateria A: 57/57 de cazuri cu așteptare clară sunt corecte. Cele 6 cazuri „info” sunt raportate ca decizii (S5, S6, S7).
- Bateria B (siguranță): 40/40 de rulări cu `__pwned` = null, 0 dialoguri, 0 erori JS. `t_csp.py`: 0 cereri externe ajunse la rețea.
- `python C:\00\Projects\LearningHub\jocuri\_motor\test_joc.py web-viii` → `[TRECUT] web-viii · întrebări jucate: 68 · diacritice/1000: 58.7`
