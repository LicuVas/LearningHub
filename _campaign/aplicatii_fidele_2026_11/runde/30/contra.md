# Runda 30 · contra (înainte de a hotărî planul)

## Planul
- N1: focusul pe rădăcină în `termina()` (windows.js), înainte de redesenarea desktopului.
- N2: în `gestTasta`, cu Windows ținut, orice tastă care nu e modificator = `win_<tastă>` (nume din `e.code`), doar în aplicația cu
  `I.tastaWindows`, nu pe Mac; windows.js pune numele tastei în mesaj și închide Start.
- W4: P1 + P2 din propunerea r23, apoi windows.js montează `deschide('explorer', {loc: corp, incadrat: true})` din dosarul galben,
  Windows + E și Start › Explorer; „parcare” pentru rădăcină la minimizare / rescrierea stratului; tastele cu Windows ținut din Explorer
  le ia shell-ul (ascultător pe window, în captură).
- A26-2: `I.emite(…, extra)`; tasta Windows singură = gest la ridicare (gestTasta nu o mai emite la apăsare când aplicația declară
  `I.tastaWindowsLaRidicare`).

## Cel mai puternic argument PENTRU
- Toate cele 3 GRAV sunt pe drumul lecțiilor (Windows + E în viii/m2-l14, l15, m3-l16; Windows + Spațiu în viii/m2-l15; F2 / Delete după
  redenumire în v/m2-l10). Fără W4, „clic pe dosarul galben” se oprește la un mesaj. Codul comun atins e mic și păzit pe aplicație
  (`I.tastaWindows`, `closest('[data-lh-aplicatie]') !== r`, al doilea argument opțional), deci Word / Excel / PowerPoint / Explorer
  deschise normal nu pot vedea diferența — se măsoară A/B.

## Cel mai puternic argument ÎMPOTRIVĂ
- A26-2 mută evenimentul tastei Windows de la apăsare la ridicare. Oracolele O5 / O9 și probele vechi care fac `keyboard.down('Meta')` și
  citesc evenimentele ÎNAINTE de `up` ar vedea 0 evenimente. Iar montarea pune ținte Explorer în arborele rădăcinii Windows
  (`L.tinte('windows')` le-ar număra dacă un oracol montează Explorer-ul) — azi niciun oracol nu montează.

## Adevărul incomod (punctul cel mai puțin sigur)
- **Ce face Windows-ul real** la Windows + Spațiu / punct / Tab / săgeți, la clicul dreapta în afara Start-ului și cu focusul după
  redenumire NU e în referințele înghețate (critic 26 §8, „Referințe de capturat”). Implementez „nu tace” (mesajul central + Start
  închis), nu comportamentul real; acela rămâne [NEVERIFICAT] în de_verificat.
- Ritmul tastei Windows (Start la ridicare) e o presupunere bună, dar fără captură: dacă o captură ar arăta altceva, A26-2 se întoarce.

## Hotărârea
- Fac planul, cu trei paze: (1) A26-2 doar sub steagul `I.tastaWindowsLaRidicare` pus de windows.js (dacă windows.js e dat înapoi,
  aplicatii.js se poartă ca la runda 26); (2) regresul A/B pe Ctrl / Meta + tastă și pe un clic / clic dreapta în cele 4 aplicații;
  (3) probele r26 / r22 / r18 rulate din nou, cu diferențele explicate una câte una.
