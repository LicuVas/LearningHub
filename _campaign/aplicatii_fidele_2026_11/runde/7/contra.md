# Runda 7 · CONTRA (pasul 4)

## Cel mai puternic argument PENTRU plan
Toate cele 10 GRAV sunt pe drumul unor lecții VIII reale (citate în `runde/6/critic.md`) și au cauza numită la rând de cod
(`excel.js:43-52`, `:106/:115`, `:971-972`, CSS `:234`). Reparațiile cele mai mari (telefonul, Σ, `#NAME?`, afișarea
numerelor) stau într-un singur fișier al bibliotecii și nu ating Word; fiecare are o probă cu gest real (Playwright,
CDP pentru tastatura care compune) și o ancoră reală (`com_r6*.json`, `scenarii_real/excel-*`).

## Cel mai puternic argument ÎMPOTRIVĂ
Lățimea coloanelor (X1 + X7) schimbă geometria grilei pe care stau O4/O5 (36/41 scenarii identice cu realul). O
afișare care ține cont de lățime poate schimba `text` în stare pentru numere lungi — iar un scenariu real cu un număr
tastat (excel-zero-in-fata: „741234567”, 9 cifre) arată că Excel LĂȚEȘTE coloana la tastare. Dacă greșesc regula
(cine lățește, cine nu), O4 crește și runda se dă înapoi.

## Adevărul incomod (punctul cel mai puțin sigur)
Regula exactă a lui Excel pentru „ce încape” (lățimea cifrelor Calibri, marginile celulei) e dedusă din 13 puncte
COM (`com_r6.json`, două lățimi de coloană). În afara lor (coloane lățite de elev, procente, zecimale fixe) e
interpolare. Și lățirea automată la tastare e probată pe UN singur caz (9 cifre); limita ei (11 cifre?) nu e probată.

## Hotărârea (după cele de mai sus)
- X9, X6, X5 întâi: mici, fără geometrie nouă, cu probă clară.
- X1: modelul de lățime în unități de cifră, calibrat pe `com_r6.json`; constanta tastată lățește coloana (doar până la
  forma General de 11 caractere), rezultatul formulei și conținutul de pornire nu. O4 pe copie ÎNAINTE de a aduce
  codul în worktree; orice creștere → reparația se dă înapoi.
- Lista ▾ a lui Σ și fereastra de eroare a formulei NU au referință → `de_verificat.md`, mesajul central.
