# Runda 14 · starea constructorului (se actualizează după fiecare bucată)

Pornirea: commit e3300ec9; măsurarea de pornire = `runde/14/masurare_pornire.json` (O1 61, O2 13392, O3 26855, O4 32, O5 82, O6 0,
O7 341, O8 102, O9 27, porți 41). Pașii 2-4 scriși: `cadru.md`, `tinta.md`, `contra.md`.
Unelte: `h.py` (hamul, copiat din runde/13), `k.py` (ajutoarele criticului 13, copiate), `proba_grav.py` (inainte = git archive
e3300ec9 în %TEMP%, dupa = worktree; `python proba_grav.py ambele [filtru]`), `sonda.py` / `sonda2.py` (sonde de lucru).

## Bucata 1 — T1 ferestrele: GATA
- `aplicatii/aplicatii.js`: cârlig opt-in `I.la.fereastra` în `leagaGesturi` (Alt + litera din `__nod.ta`, `I.tabFereastra`,
  `I.focusInitialFereastra`); Word / Excel nu-l pun.
- `aplicatii/powerpoint.js`: `I.la.fereastra`, focus la deschiderea Font / Paragraph / Insert Table, `implicitDialog()`, Tab ținut în
  fereastră (și din câmp), Enter / Space pe butonul cu focus.
- Proba `t1_*`: înainte 27 picate → după 0; Word Save As și Excel Save As: evenimente identice înainte / după.

## Bucata 2 — T3 fontul temei: GATA
- `aplicatii/aplicatii.css`: `.lh-ap-p-text` = Calibri, Carlito, sans-serif; `.lh-ap-p-titlu` = 'Calibri Light', Carlito, sans-serif.
- `aplicatii/powerpoint.js`: `stivaFont` în `stilFmt` (Calibri / Calibri Light aleși = aceeași stivă ca tema).
- Proba `t3_*`: înainte 5 picate → după 0 (titlul „Fără font” 190,7 px înainte și după Calibri Light (Headings); miniaturile la fel).

## Bucata 3 — T2 Shape Format din taste: GATA
- `aplicatii/powerpoint.js`: `actualizeazaContext` pune `__nod.ta` pe filele contextuale (din grupul cu numele filei din referință:
  „Alt, J D”, „Alt, J P”, „Alt, J T”, „Alt, J L”); `ktLitera`: litera filei deja active = `prefix_tasta_acces` (punctul 5, asistentul);
  o listă deschisă din taste fără litere în referință ține modul tastelor (literele nu mai scapă); `la.tasta` / `la.text` /
  `la.sterge`: cu o listă / un meniu deschis, literele și ștergerile = `fara_efect` (punctul 5, lista deschisă cu ▾).
- Proba `t2_*`: înainte 9 picate → după 0 (J D, S F / S O / S O W, „Alt, H, S, O, W, a” nu mai scrie în stea, 3 pt din taste).
- Observație: grosimea conturului NU e în `stare()` (nicio cheie în api §5) — evenimentul `contur_forma` cu `activat meniu:3 pt` are
  `inainte` = `dupa`. Notat în `diferente.md`.

## Bucata 4 — T4 Esc = tasta_esc: GATA
- `aplicatii/aplicatii.js`: `tastaAcum` (window, captură: keydown → e.key, keyup → null); `I.tastaFaraClic` emite `tasta_esc` când
  acțiunea e `iesire_taste_acces` și tasta e Esc (Alt a doua oară rămâne `tasta_acces`); asistentul nu numără Esc-ul din tastele de
  acces greșeală. word.js / excel.js NEATINSE (ies tot prin `tastaFaraClic`).
- Proba `t4_*`: înainte 3 picate (PowerPoint, Word, Excel) → după 0; `t4_asistent_esc` trece.

## Bucata 5 — punctul 5: GATA
- lista deschisă cu ▾ / meniul: literele, Backspace, Delete = `fara_efect` (`la.tasta`, `la.text`, `la.sterge`) [presupus] R14-4;
- caseta Font: clicul în text alege tot (în `apasaComanda` › `case 'Font'`, plus `setTimeout` după clic); „Arial” + Enter → Arial;
- `stare().caseta_activa` = {tinta, text} → `tastare` în casete are `dupa` ≠ `inainte` (A14-2 în de_aprobat);
- `I.zonaTinta` = getter: `zona_note` cât cursorul e în note (telefonul: ținta `zona_note`);
- asistentul: H pe Home deja activă = `prefix_tasta_acces` (`ktLitera`);
- „Click to add notes” scos (R14-5); fereastra Open: „Toate locațiile” › „Documente” pe banda de adresă + etichetele „Până la
  "Desktop"”, „Reîmprospătare "Documente" (F5)” din `b_ctrl_o_browse` (R14-6).
- Proba `p5_*`: înainte 11 picate → după 0.
- `de_verificat.md` R14-1…R14-7, `de_aprobat.md` A14-1…A14-3 scrise.

## Bucata 6 — MINOR: NEFĂCUT (lăsat cu bună știință)
Listele la +3 px (decalajul vine din panglică, nu din liste), „Pov” tăiat, x = −26 pe 360 px, zonele < 32 px, fila „Fill” ca text:
nu s-au atins — ultima rundă a valului, prioritatea a fost T1-T4 + punctul 5 și pasul 7 complet.

## Regresul și măsurarea parțială: GATA
- `regres.sh` → `regres_rezumat.txt`: proba 14 înainte 55 picate → după 0; 13 (copie) 48/48; 12 (copie) 1 = căderea deja explicată
  (telefon 360, „ce se vede e la fel ca la 552ac0c5”); 11 reluat pe loc (copia își lua rădăcina din %TEMP%) = 0; Word 5 / 4 / 4-telefon
  / 3 / 2 = 0; Excel 10 / 9 / 8 / 7-cont / 6 = 0; 7 = 2 și 7-cont2 = 3, aceleași nume ca în runda 13 (D14, D18). Json-urile noi din
  runde/7-10 mutate în %TEMP%; 0 fișiere urmărite schimbate în runde/2-13.
- `masoara.py --doar O3,O4,O5,O8,O9` → `masurare_partiala.json`: O3 26855, O4 32, O5 82, O8 102, O9 27 — identice cu pornirea, regres 0.
- `ingheata.py --verifica` = 0 (INTACT).

## Pasul 7: GATA (17:23-17:56, singur pe mașină) → `masurare.json`
O1 61, O2 13392, O3 26855, O4 32, O5 82, O6 0 (concludent, 1028 s), O7 341, O8 102, O9 27, porți 41 (cum_fac 41); lacăt ok; regres
față de pornire: niciunul. `raport_constructor.md`, `gata_pentru_critic.md`, `diferente.md` (inclusiv C, evenimentele) scrise.
Runda e gata pentru criticul 14 (pașii 8-10 îi face orchestratorul).
