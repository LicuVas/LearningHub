# Enunțuri defecte — găsite de corectorii valului t6b (05.09.2026)

Cele 82 de agenți care au scris și verificat rezolvările model au dat peste două
probleme care **nu sunt în rezolvare, ci în cerința însăși**. Rezolvarea nu le poate
repara — reproducerea fidelă a unui enunț prost tot un enunț prost rămâne.

Le las aici pentru decizie separată: modificarea unui enunț schimbă ce se cere
elevului, deci e treabă de curriculum, nu reparație mecanică.

---

## 1. `tic/cls7/m3-algoritmi-schema/lectia7-for.html` — Exercițiul 5, „Triunghi de stele"

**Nivelul declarat:** performanță.
**Ce e greșit:** cerința dă codul complet, linie cu linie — `for (int i = 1; i <= n; i++)`,
`for (int j = 1; j <= i; j++) cout << "*";`, `cout << endl;`. Elevului bun nu-i mai rămâne
nimic de gândit; soluția e în enunț, nu doar în rezolvare.

**Convenția sitului** (respectată consecvent în restul lecțiilor): minim și standard
primesc cod complet, performanța primește schiță.

**Ce ar trebui:** enunțul descrie forma dorită a ieșirii și lasă structura de scris.
Codul rămâne în „Vezi rezolvarea", nu în cerință.

---

## 2. `tic/cls7/m3-algoritmi-schema/lectia8-fizica.html` — Exercițiul 2, „Cădere liberă"

**Ce e greșit:** cerința cere citirea înălțimii `h` de la care cade obiectul, dar niciuna
dintre formulele cerute nu folosește `h` — `d = 9.8*t*t/2` și `v = 9.8*t` lucrează doar cu
`t`, citit separat. Variabila `h` se citește degeaba, iar enunțul nu stă în picioare fizic.

**Cele două ieșiri curate, la alegere:**
- `h` determină timpul: se citește doar `h`, iar `t` se calculează din `t = sqrt(2h/9.8)`.
  Asta e chiar problema de fizică pe care titlul o promite. Cere `<cmath>`, nepredat încă
  în modul — de verificat înainte.
- sau `h` iese din enunț și rămâne doar `t`, cum lucrează formulele deja.

**Ce s-a făcut acum, ca soluție de moment:** rezolvarea model spune deschis elevului că `h`
se citește dar nu intră în formule, și că relația reală e `h = 9.8*t*t/2` — deci `h` calculat
și `h` citit ar trebui să coincidă, ceea ce se poate folosi ca verificare. Elevul învață
ceva din inconsistență în loc s-o copieze. Enunțul rămâne totuși de reparat.
