# Contra — planul rundei 26, cântărit înainte de hotărâre

## Planul
- K1: `gestTasta` dă `win_<literă>` doar când aplicația declară `I.tastaWindows` și nu e Mac; windows.js închide Start-ul deschis de aceeași
  apăsare și dă mesajul central „Windows + E”.
- K2: `I.activat` la tasta Windows (`bara_activitati:Start`) și la Enter din căutare (`start:<rezultat>`).
- K3: câmp `<input>` adevărat (`I.intrare`, clasa comună `lh-ap-intrare`), în afara lui startEl, focalizat la clic / atingere pe casetă și
  la deschiderea cu tasta Windows; `I.la.text` / `I.la.sterge` duc textul în căutare.

## Cel mai puternic argument PENTRU
- Folosește doar mecanisme care există și sunt deja probate la alte aplicații (`I.activat` citit de `aplicatii.js` la taste; calea
  `I.intrare` cu compunere / `input` / `beforeinput` folosită de Word, Excel, PowerPoint). Codul comun primește 8 rânduri, toate în zona
  dată, păzite de `I.tastaWindows`: pentru Word / Excel / PowerPoint / Explorer funcția dă exact ce dădea (regresul A/B o arată).

## Cel mai puternic argument ÎMPOTRIVĂ
- K1 nu e „ca în Windows” pe drum: Windows deschide Start la ridicarea tastei, dacă n-a venit altă tastă. Aici Start se deschide la apăsare
  (evenimentul `tasta_windows / deschide_start`, cu `activat`), iar litera îl închide la loc. Un critic pe unghiul gest_tastatura poate spune
  că „Windows + E deschide încă Start, o clipă” și că fluxul de evenimente are un `deschide_start` în plus. Pentru un asistent cu pasul
  „Explorer”, tasta Windows de dinaintea lui E e o greșeală (a doua greșeală ar fi `win_e`, până se leagă Explorer-ul și primește `activat`).

## Adevărul incomod (punctul cel mai puțin sigur)
- Varianta „la ridicare” cere ca evenimentul de deschidere să fie emis la `keyup`, adică prin `I.emite`, care nu poartă `activat`
  (`aplicatii.js:121`), iar `I.emite` nu e în zona mea. Deci am ales între K1 perfect pe drum și K2. Am ales K2 + starea finală corectă la K1.
  **Deblocatorul**: orchestratorul lărgește `I.emite` cu al cincilea parametru (`extra`, ca `emite`), un rând, fără efect pe celelalte
  aplicații; atunci Start se poate deschide la `keyup` (cerere în raport, „de_aprobat” nu e locul: nu e o diferență de fidelitate păstrată).
- Pe telefon nu pot vedea tastatura ecranului reală (headless). Proba arată ce se poate arăta: focusul într-un câmp editabil după o atingere
  adevărată (`touchscreen.tap`), font 16 px (fără zoom pe iOS), textul trimis ca de o tastatură de telefon (CDP `imeSetComposition` +
  `insertText`) care ajunge în căutare. Pe iOS, focusul dat la „click” e [presupus] suficient; Chrome îl acceptă și la pointerup.

## Hotărârea
- Merg pe plan. K1 îl raportez ÎNCHIS pe starea finală și pe gest (`win_e`, mesaj, Start închis), cu nota despre clipire și cererea pentru
  `I.emite`. Paint „fără tastare” pe telefon nu are referință (Paint nu e în `uia_windows.json`, categoriile din „Toate” nu se deschid în
  referință) → nu-l inventez: R26-3 în de_verificat + A26-1 în de_aprobat.
