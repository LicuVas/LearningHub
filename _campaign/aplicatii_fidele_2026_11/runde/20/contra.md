# Contra (runda 20, Word)

## Cel mai puternic argument PENTRU plan
- E o singură ramură în `word.js › I.la.tasta`, care cheamă un cârlig deja probat în PowerPoint (criticul 13 › T1 închis de
  criticii de după). Nu schimbă nimic din afara ferestrelor (ramura cere `dialog`), nu atinge fișiere comune, nu atinge
  Alt + litera proprie a lui Word (`word.js:2059`). Drumul PDF cu Tab devine același cu drumul cu Alt+T, deja corect (K1b).
- Fără Enter/Space pe butonul cu focusul, reparația lui Tab ar crea o stare finală greșită nouă: Tab până la Cancel + Enter
  ar salva. Cu ele, Word face ce face deja PowerPoint pe aceeași sursă Microsoft.

## Cel mai puternic argument ÎMPOTRIVĂ
- Nu pun `I.la.fereastra()`, cum face PowerPoint. Un critic poate spune că „Word nu adoptă cârligul ca PowerPoint”. Motivul:
  cu `I.la.fereastra()`, ascultătorul comun Alt + literă (`aplicatii.js:526-550`) ar rula ÎN PLUS față de cel al lui Word
  (`word.js:2059-2080`), amândouă pe rădăcină, în faza de captură: două evenimente pe fiecare Alt + literă (stopPropagation
  nu oprește un alt ascultător de pe același nod). Alt + litera Word e închisă de criticul 16 (B3) — n-o stric.
- Ordinea Tab nu e a lui Windows dovedită: e ordinea nodurilor din referință. Lista și panoul din stânga nu sunt opriri.
  Un elev care face Tab ×3 din File name ajunge altundeva decât în Word real (de ex. pe Autori / Etichete / Save Thumbnail,
  care în Word real sunt după Save as type în arbore — tot neverificat).

## Adevărul incomod (punctul cel mai puțin sigur)
- „Esc = Cancel” cu `apasat: 'Cancel'` în „Save your changes…” și `activat` pe Cancel la Esc nu au captură din Word real;
  vin din regula ferestrelor Windows (IDCANCEL), iar fereastra Office nu e `#32770`. Dacă Word real lasă `apasat` gol la Esc,
  am schimbat o stare ca s-o potrivesc cu clicul, fără dovadă. Intră ca `[presupus]` în `de_verificat.md` (R20-3), cu
  scenariul care ar lămuri-o.

## Hotărârea
- Fac planul (1 + 2 din `tinta.md`), fără `I.la.fereastra()`; trec în `de_verificat.md` ordinea Tab (R20-1), lista ca oprire
  (R20-2) și Esc = Cancel în „Save your changes…” (R20-3).
