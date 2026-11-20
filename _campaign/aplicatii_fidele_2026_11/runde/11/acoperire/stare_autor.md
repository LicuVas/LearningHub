# Runda `acoperire` pe PowerPoint după runda 11 — STAREA (al doilea agent, 20.11.2026 ~07:05)

Sarcina: `runde/11/acoperire_prompt.md`. D = `C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11`.
Nimic comis. `aplicatii/`, lecțiile, jocurile, `jocuri/_motor/` NEatinse. Niciun oracol atins (O3 citește singur
`referinte/uia_*.json`, O4 singur `scenarii/**` + `scenarii_real/`) → bancul de mutanți nu se declanșează.

## Lotul 1 (capturi) — făcut de primul agent
Vezi `capturi_rulare1..3.log`, `capturi_powerpoint_brut.json`; 11 chei noi în `referinte/uia_powerpoint.json` + `acoperire_r11`.

## Lotul 2 (scenarii) — făcut de mine
- `referinte/acoperire_powerpoint_r11.py`: `SCENARII` (10 noi), `VECHI_R11` (3 rescrise), `scrie_scenarii`, clasa
  `PowerPointR11` (subclasă `RR.PowerPoint`), `proba_mouse` (canalul mouse pe PowerPoint: clic pe titlu = text ales, clic în
  colț gol = nimic), `scenarii_intern` (ctrl-n PRIMUL pe Presentation1, apoi probele, apoi restul; închidere `inchide_sigur`).
  Copii de dinainte: `runde/11/acoperire/scenarii_inainte/`, `real_inainte_*.json.bak` (nu sunt livrabile).
- Rularea 1 (06:41-06:49, 511 s): 10 scenarii noi, toate fără eroare, probe 5/5 trecute; 3 rescrise sărite (timp).
  Rezultate: ctrl-n „Presentation2”/2; ctrl-w dialog {"" , „Save your changes to this file?”, [More options…, Save,
  Don't Save, Cancel], Cancel} + 1 prezentare; font color #FF0000; Two Content (New Slide ▾ → diapozitiv nou, 3 forme;
  Layout → aspect schimbat, 3 forme); Ctrl+C/V pe casetă → pe diapozitivul 2 o CASETĂ DE TEXT (Type 17) „O stea”, în același
  loc [120,284,720,130]; Arrow: Right inserată (2 forme); Move Up cu rândul 2 ales (ales prin caseta aleasă) → ordinea [2,1];
  fundal Light Blue + Apply to All → #00B0F0 pe ambele.
- Duration: clicul postat n-a dat focusul casetei → scenariul REDUS la Fade + Apply To All (durata 0,7 pe toate);
  „0,5”+Enter = [NEVERIFICAT], `de_verificat.md` R11-14.
- Rularea 2 (diapozitiv-nou-buton, salvare-ca, imagine, durata) — vezi `scenarii_powerpoint_jurnal.json` (ultima rulare).
- `api_biblioteca.md`: §3 `margine_forma`, §5 powerpoint cheile noi. `suprafete.json`: 11 intrări `powerpoint.<cheie>` + `acoperire_r11`.
- `de_verificat.md`: [x] R11-1, R11-13; R11-12(f) notat; R11-14 nou. De bifat după rularea 2: R11-9, R11-10.

## Făcut după rulările 2-3 (07:00-07:10)
- Rularea 2: diapozitiv-nou-buton (2 diapozitive, probat), durata (0,7 ×3, probat); salvare-ca / imagine căzute pe KEYUP-ul
  lui Enter (1400) → reparat ca la Excel; rularea 3: salvare-ca „Vulcanii.pptx”, imagine 3 forme, ambele probate.
  13/13 scenarii rulat_de = acest generator cu mod_probat true. Recent: ComDlg32 curățat (doar ale mele); PowerPoint MRU /
  Common: 0 intrări `lh_ppt_r11_` (reg query); %TEMP%: niciun dosar al meu rămas; nicio instanță POWERPNT.
- `acoperire_powerpoint_r11.py verifica` = 0; `dump_uia_office.py verifica` = 0; date personale = 0;
  `ruleaza_real.py verifica` = 11 (9 vechi Excel + 2 „gest_real cu pași prin COM”, ca excel-column-width-enter);
  `probe_mod.md`: proba „mouse” pe PowerPoint adăugată în blocul powerpoint.
- `de_verificat.md`: [x] R11-9, R11-10.
- Reînghețat 07:12 (`--verifica` = 0, 372 fișiere); măsurarea pornită 07:13 → `runde/11/acoperire/masurare_rulare.log`.

## GATA (07:50): măsurarea (O3 25076, O4 48, restul neschimbate, O6 0 concludent, lacăt ok), `--verifica` = 0 după,
raportul `runde/11/acoperire_powerpoint.md` → ACOPERIRE_PARTIALA (Duration 0,5, tragere-forma, Alt+H+1 rămase).

## Rămas (istoric, făcut)
1. (făcut)
2. `ingheata.py --acoperire "…"` (textul din prompt) ÎNAINTE de măsurare (masoara.py refuză lacătul rupt), apoi
   `masoara.py --runda 11 --paralel 3 --compara D/runde/11/masurare_final_r11.json` SINGUR (regula O6 din prompt), apoi
   reînghețarea dacă măsurarea a scris în zona înghețată, `--verifica` = 0, raportul `runde/11/acoperire_powerpoint.md`.
