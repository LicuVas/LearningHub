# Runda 18 · pasul 2 · CADRUL (înainte de orice reparație) — Windows 11 în bibliotecă, unghiul `aspect`

Suprafața: desktopul Windows 11 din `aplicatii/` (bara de activități cu zona de notificare, meniul Start, meniul de clic
dreapta pe desktop, nou și clasic). Azi biblioteca NU are Windows deloc: `aplicatii/aplicatii.js:77` (`SURSE_APP`) are doar
word / excel / powerpoint, deci `deschide('windows')` respinge („nu e încă în bibliotecă”). Referința:
`referinte/uia_windows.json` (sesiunea din 20.11.2026, Windows 11 25H2 RO, ecran 1536×864 logic la 125%).

## Presupuneri (fiecare cu cum o verific)
1. **Pozițiile din referință sunt ale unui ecran mai lat decât cadrul O3.** Bara are 1536 px (`bara_activitati › ferestre[1]
   › rect_ecran_100 = [0, 816, 1536, 48]`), Start-ul e o fereastră de 1536×816. La 1366×768 grupul din mijloc al barei, tava
   și panoul Start se mută față de colțul suprafeței → `pozitie` pe aproape fiecare comandă, oricât de bine e desenat.
   Verific: proba mea măsoară O3 la DOUĂ ferestre: 1366×768 (ce vede O3) și 1536×864 (ecranul referinței); la a doua,
   o așezare fidelă (mijloc centrat, tava lipită la dreapta, Start lipit de bară) trebuie să dea `pozitie` ≈ 0.
2. **Numele UI Automation nu e mereu textul de pe ecran.** Dala „Browser, Folder cu elemente 6” arată pe ecran doar
   „Browser”; butonul vremii are numele „Widgeturi 13°C Mostly cloudy”, dar pe ecran „13°C / Mostly cloudy”; ceasul are
   numele „Ceas 19:48 20.11.2026”. O3 compară textul VIZIBIL (CONVENTIE §5). Verific: pe randarea mea, cu mostrele
   `eticheta` / `eticheta_declarata` / `lipsa`+`in_plus` din proba O3, rând cu rând.
3. **Referința e calculatorul profesorului, nu al laboratorului** (decizia (a) din `runde/15/acoperire_instrumente.md:255`).
   Aplicațiile fixate (To Do, Notepad++, Chrome), dalele lui din Start (Agent Ransack, Epson Scan…), rândurile puse de
   programele lui în meniuri (Dropbox, PDF24, Open Git Bash here…) sunt „fidele” față de referință, dar elevul nu le va găsi
   în laborator. Cele 4 butoane „deschise” (Terminal - 7 ferestre…, KeePassXC…, AutoHotkey…) sunt STAREA momentului, nu
   configurație. Verific: le număr separat în probă (ce iese `lipsa` doar din cauza lor).
4. **Submeniul „Nou” al desktopului nu e capturat** (`meniu_desktop` are doar rândul „Nou”, `extins: False`). Singura listă
   „Nou” reală e cea din Explorer (`uia_explorer.json › explorer_meniu_nou`: Folder, Comandă rapidă, 19 tipuri de fișiere).
   Presupun că desktopul arată aceeași listă (același handler „ShellNew”) — [NEVERIFICAT], rând în `de_verificat.md`.
5. **Ceasul real arată ora curentă**, nu „19:48”; vremea, bateria, volumul sunt valori de moment. Verific: nimic de
   verificat pe disc — e o alegere, intră în `de_aprobat.md`.

## Citiri ale lui „fidel” pentru suprafața asta
- **(A) aspect = arborele de referință copiat întocmai, inclusiv valorile momentului** (ora 19:48, cele 4 aplicații deschise,
  „Anulare Copiere”): O3 ar coborî cel mai mult, dar elevul ar vedea pe bară „Terminal - 7 ferestre deschise” fără nicio
  fereastră, iar `ferestre` din stare ar minți față de ecran (regula „ecranul = starea”, api §3).
- **(B) aspect = aceleași elemente, în aceeași ordine, în același LOC RELATIV (centrat / lipit de margine), cu aceleași
  etichete, iar ce e STARE (ferestre deschise, ora) vine din starea simulatorului**: configurația (fixatele, dalele, tava,
  meniurile) din referință; butoanele „deschise” doar din `ferestre`; ceasul viu, în formatul referinței.
- **(C) aspect = doar ce e al Windows-ului curat** (fără nimic din ce a instalat profesorul): cel mai apropiat de laborator,
  dar contrazice decizia (a) a orchestratorului și cere etichete pe care referința nu le are („nicio etichetă scrisă de mână”).

**Aleg (B).** (A) pierde pentru că face ecranul să mintă față de stare și ar învăța elevul că pe bară stau ferestre care nu
există; (C) pierde pentru că nu am referință pentru un Windows „curat” și aș scrie etichete de mână. (B) păstrează tot ce e
configurație din referință (deci O3 rămâne măsurabil și cinstit) și scoate doar valorile de moment, fiecare numărată și
scrisă (diferente.md, de_aprobat.md).
