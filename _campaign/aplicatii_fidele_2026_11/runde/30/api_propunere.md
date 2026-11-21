# Runda 30 · textul propus pentru `api_biblioteca.md` (fișierul e ÎNGHEȚAT: îl aplică o rundă `acoperire`, care reîngheață)

Fiecare bucată: secțiunea, rândul de lângă care intră, textul exact. Nimic de aici nu e aplicat în `api_biblioteca.md`.

## §1 — după bulletul `opt.incadrat` (azi `api_biblioteca.md:38-41`), un bullet nou
```
- **Explorer-ul montat de shell** (runda 30, W4): în Windows, dosarul galben din bară (când nu e deschisă nicio fereastră Explorer),
  Windows + E și „Explorer” din Start (căutare, „Toate”) deschid Explorer-ul bibliotecii într-o fereastră a shell-ului:
  `deschide('explorer', {loc: <corpul ferestrei>, incadrat: true, continut: continut.explorer})`. `continut.explorer` (opțional) =
  conținutul Explorer-ului, în formatul `start` al scenariilor Explorer (§7.1). Fereastra are bara de titlu a shell-ului, cu titlul
  `stare().titlu` al Explorer-ului (urmează folderul), apare în `stare().ferestre` ca `{aplicatie: 'explorer', …}`, se minimizează
  (rădăcina Explorer-ului rămâne în pagină, ascunsă: instanța trăiește), se readuce și se închide (Închidere = `inchide('explorer')`)
  ca celelalte. Activarea ferestrei îi dă focusul; Start deschis îl ia. Biblioteca ține o singură instanță pe nume: a doua deschidere
  aduce fereastra existentă în față; un Explorer deschis separat de pagină nu e mutat (dosarul galben dă atunci mesajul central).
  Cât Explorer-ul e montat, tasta Windows și tastele apăsate cu ea ținută sunt ale shell-ului (evenimente `aplicatie: 'windows'`, ținta
  `fereastra_app:explorer`); celelalte taste, clicurile, rotița sunt ale Explorer-ului. Pe ecranul îngust (sub 600 px) fereastra se
  deschide maximizată.
```

## §1 — rândul `LH.aplicatii.deschideSuprafata(cheie)` (azi `api_biblioteca.md:54`), înlocuit cu
```
- `LH.aplicatii.deschideSuprafata(cheie, nume?)` — plasa din `CONVENTIE_ARBORE.md` §4.6 (doar unde gestul nu există încă); `nume` =
  aplicația cerută (de ex. Explorer-ul montat într-o gazdă, runda 30 / A23-1 P2); fără el, prima aplicație vie, ca până acum.
```

## §4 — rândul `win_<literă>` (azi `api_biblioteca.md:170`), înlocuit cu
```
  `win_<tastă>` / `win_shift_<tastă>` (runda 26; runda 30 pentru tastele care nu sunt litere) = tasta Windows + o tastă, fără Ctrl / Alt,
  doar în aplicația Windows (`I.tastaWindows`) și nu pe Mac; în rest tasta cu sigla + literă rămâne `ctrl_<literă>`. `<tastă>` = litera
  (`win_e`) sau numele locului tastei, din `e.code`: cifra (`win_1`), `spatiu`, `punct`, `virgula`, `minus`, `plus`, `punct_virgula`,
  `slash`, `backslash`, `apostrof`, `accent`, `paranteza_stanga|dreapta`, `inmultit`, `tab`, `enter`, `esc`, `backspace`, `delete`,
  `insert`, `home`, `end`, `pagina_sus|jos`, `sus|jos|stanga|dreapta` (săgețile), `f1`…`f12`, `printscreen`, `pauza`, `meniu`.
  Shift / Ctrl / Alt ținute nu sunt gesturi. Nesimulată, combinația dă mesajul central cu numele tastei („Windows + Spațiu”,
  „Windows + .”, „Windows + ↑”) și închide Start. `win_e` deschide Explorer-ul montat (§1).
  **`tasta_windows` în Windows** (runda 30, A26-2): gestul e la RIDICAREA tastei, nu la apăsare, și doar dacă între timp n-a venit altă
  tastă (Windows + E nu deschide Start nici pentru o clipă și nu emite `tasta_windows`). Tasta singură = un singur eveniment, cu
  `activat: 'bara_activitati:Start'` când deschide / închide Start. Pe Mac și în celelalte aplicații, tasta rămâne la apăsare.
```

## §6.3 (asistarea) — nimic nou de scris; de știut pentru rândul de mai sus
- Cu A26-2, Windows + E nu mai bifează pasul „Start” al asistentului (MINOR din `runde/26/critic.md` §6.3, legat de A26-2).

## Pentru implementatori (CONVENTIE, nu api) — ce trebuie să știe o altă gazdă
- `instanta.emite` din `L.deschide` primește acum și al cincilea argument `extra` (`{activat}`), ca `emite` intern (`aplicatii.js:199`).
- Pointerdown-ul gazdei ignoră țintele dintr-o altă aplicație a bibliotecii montată în ea (`closest('[data-lh-aplicatie]') !== rădăcina`).
