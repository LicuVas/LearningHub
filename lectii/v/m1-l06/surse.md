# Lecția 6, clasa a V-a — surse și ce n-am putut verifica (27.09.2026)

## Programa și planul
- **Titlul exact:** `Info_Gimnaziu_2026\planificari\Calendar_ore_5AM_5M.md`, r. 14: „16.10.2026 | 6 | M1 | Dispozitive de stocare. Unități de măsură: bit, byte, KB, MB, GB, TB | predare + consolidare”. La fel în `data\unitati.json` (V-U1, lecția 6, tip „predare + consolidare”).
- **Conținuturile** (copiate întocmai în `continuturi`): `C:\00\AI_0\data\informatica_gimnaziu\curriculum.json`, clasa a V-a, domeniul „Tipuri de dispozitive…”: „Dispozitive de stocare a datelor:” · „- exemple de dispozitive de stocare a datelor” · „- unități de măsură pentru capacitatea de stocare (bit, byte, kilobyte, megabyte, gigabyte, terabyte, petabyte etc.)” · „- comparație între dispozitivele de stocare în funcție de capacitate”. Act: OMEN 3393/2017; standardele O. 4.615/2026.
- **Programa NU spune 1000 sau 1024.** Spune doar numele unităților.

## Faptul 1024 / 1000 (formularea aleasă și de ce)
- **Formularea din lecție, spusă peste tot la fel (după judecător, M2):** „De la byte în sus, fiecare treaptă e de 1024 de ori mai mare. Așa socotim la școală, și tot așa arată mărimile calculatoarele cu Windows, ca cele din laborator.” Iar la pasul „Capacitatea”, lângă stickul de 16GB: „Stickul din fotografie are 16 GB socotiți ca fabricantul, de 1000 de ori. Calculatoarele cu Windows, ca cele din laborator, socotesc de 1024 de ori, așa că îl arată ceva mai mic: sub 15 GB.” Nicăieri „calculatorul” în general: macOS, Android și Ubuntu socotesc în zecimal (Wikipedia, Gigabyte).
- **1024 la școală:** materialul profesorului, `Info_Gimnaziu_2026\materiale\continut\clasa_V_M1.json`, lecția 6 („1 kilobyte (KB) = 1024 B … 1 TB = 1024 GB”; exercițiul „1 MB = ___ KB” → 1024). Același lucru în `jocuri\calculator-v` (nivelul 6). NU am preluat fraza din material „nu de 1000” — e prea tare: standardul IEC numește KiB/MiB/GiB unitățile de 1024, iar fabricanții folosesc legal 1000. Lecția spune ambele, fără să declare una „greșită”.
- **Windows = 1024 (probat):** captura Windows în română `jocuri\calculator-v\img\dimensiune-fisier.webp` arată „3,50 GB (3.758.096.384 baiți)”; 3,5 × 1024³ = 3.758.096.384 exact (`_proba\masoara_marimi.py`).
- **Fabricanții = 1000:** https://en.wikipedia.org/wiki/Gigabyte — „Practically all manufacturers of hard disk drives and flash-memory disk devices continue to define one gigabyte as 1000000000 bytes, which is displayed on the packaging.” și „…Microsoft Windows … report file size using binary multipliers.” Exemplul lor: 400 GB apar „372 GB”.
- **„Sub 15 GB” pentru un stick de 16 GB:** 16 × 10⁹ / 1024³ = 14,90; formatarea mai ia puțin. Adevărat pentru orice stick de 16 GB.
- **DVD:** https://en.wikipedia.org/wiki/DVD — „A standard single-layer DVD can store up to 4.7 GB”, cu „1 Gigabyte = 1,000,000,000 bytes” (4,38 în unități de 1024). **CD:** https://en.wikipedia.org/wiki/CD-R — „80 minutes of audio or 737,280,000 bytes (703.125 MiB)” → „700 MB”.
- **Nicio întrebare nu stă pe muchia 1000/1024.** Toate comparațiile au marje mari (de ex. DVD 4,7 vs film 3 GB: încape și socotit cu 1024; DVD 4,7 vs 5 GB: nu încape nici socotit cu 1000).

## Matematica clasei a V-a
- Programa de matematică a clasei a V-a **nu e pe disc** (căutat: `es.exe`, `biblioteca.py cauta`, `truth.py where`; am găsit doar programa claselor III-IV și programe de titularizare). Deci, cum cere sarcina, lecția rămâne la **numărat și comparat**: „întâi unitatea, apoi numărul”, cu pragul 1 GB = 1024 MB (compari 700 cu 1024, 1500 cu 1024). **Nicio înmulțire cu 1024 și nicio împărțire** nu e cerută (materialul profesorului și `calculator-v` au „16 × 1024 : 4”; nu le-am preluat).
- Singurele „4,7” sunt citite ca „ceva mai mult de 4 GB” (spus în pagină).

## Mărimile „cam” (măsurate, nu din memorie)
`_proba\masoara_marimi.py` → `_proba\masoara_marimi.json` (doar mărimi, fără nume de fișiere):
- **Poză de telefon:** 11.191 poze cu numele camerei Samsung (AAAALLZZ_HHMMSS.jpg) de pe discurile profesorului: mediana **1,89 MB** (2025: 2,39 MB; 2026: 1,98 MB; sfertul de mijloc 1,5–2,7 MB) → „cam 2 MB”. (Sarcina propunea „~3-5 MB”; măsurătoarea dă mai puțin, deci am scris 2 MB.)
- **Cântec MP3:** 3.551 fișiere MP3 peste 1 MB: mediana **3,76 MB** → „cam 4 MB”. Control: 128 kbit/s × 3,5 min = 3,2 MB.
- **Film întreg:** pe disc e un singur film peste 500 MB (5,3 GB), prea puțin. Sursa: Netflix, https://help.netflix.com/en/node/87 — „High definition: up to 3 GB” (pe oră), „Standard definition: up to 1 GB” → „câțiva GB”.
- **Pagină de text:** 1800 de semne (pagina standard) dintr-un text românesc cu diacritice = 1930 B = 1,88 KB (Python) → „cam 2 KB”.
- **Literă = 1 byte:** `len('MARE'.encode('utf-8')) = 4`; `'ș'` = 2 byți în UTF-8; `A` = 01000001. Byte = 8 biți: https://en.wikipedia.org/wiki/Byte. Plural „byți” (pron. „baiți”): DOOM3; Windows în română scrie chiar „baiți”.
- **Discul unui calculator:** captura Acest PC (475 GB; hard disk extern 1,81 TB) → „sute de GB sau câțiva TB”.

## Lecțiile și jocurile folosite
- `lectii\v\m1-l04` (discul păstrează ce salvezi; RAM = masa de lucru, discul = cămara — analogia e reluată la „Altfel”), `lectii\v\m1-l05` (dispozitiv/periferic; stick-ul pomenit cu „afli în lecția 6”; regula din laborator).
- `jocuri\calculator-v` nivelul 6 „Stocare: cât încape?” (lista dispozitivelor, 1024, capacități; capturile `acest-pc-capacitati.webp`, `componente.webp` — refolosite); nivelul 7 (filmul clasei, 3,5 GB — lecția folosește 3 GB, alt context).
- Simulatorul `lectii\_sim\fotografie.js`: modul ETICHETE (pasul „Capacitatea”, două carduri) și modul CATEGORII (atelierul, 5 dispozitive, „Încape / Nu încape”). Nu a fost nevoie de `fotografie-extra.js`: ordonările folosesc `order` din motor. **De pe 27.09 seara simulatorul e al meu** (predat de dirijor): am adăugat zonele rotunde `c`, mărirea `Q.marire` și am reparat litera mică la „CD-ul”/„DVD-ul”; proba pe lecțiile 5 și 7 e în `_verificare\reparatii.md`.

## Imagini (detaliul în `img\SURSE.json`, verificat pe API-ul Commons de `_proba\licente.py` → 0 nepotriviri)
Refolosite de pe sit (3): `ssd.webp` (decupată din `calculator-v\img\componente.webp`; fotografia Djsumdog, CC BY-SA 3.0), `acest-pc-capacitati.webp` și `acest-pc-disc-c.webp` (captură Windows din `calculator-v`).
Noi, Commons (9 fotografii; din „Forty years of Removable Storage” am decupat în plus 5 bucăți mărite cu etichetele de capacitate, `eticheta-*.webp`, pentru atelier): Digitale medier (Eivind N. Tangen, CC BY-SA 4.0), Open hard-drive (Zzubnik, domeniu public), PNY USB flash drive 16GB (Donald Trung Quoc Don, CC BY-SA 4.0), SanDisk Ultra microSDHC 32GB (Paowee, CC BY-SA 4.0), Samsung S2 Portable 320GB (Ryse93, CC BY-SA 4.0), Verbatim CD-R 700MB (Dillan Payne, CC BY-SA 4.0), Antec P182 Front Panel (William Hook, CC BY-SA 2.0), SanDisk SD Cards 128MB and 32GB (Dillan Payne, CC BY-SA 4.0), Forty years of Removable Storage (avaragado, CC BY 2.0). Toate sub 150 KB; doar decupate/micșorate, fără marcaje.
- Etichetele de pe dispozitivele din atelier (2 GB, 2.0 GB, 16GB, 4.7GB, 700MB) le-am citit pe fotografia la rezoluția completă (5124 px): `_proba\cand\z_stick.png`, `z_discuri.png`. Descrierea de pe Commons confirmă cele 11 dispozitive (dischete 8"/5,25"/3,5", casetă, bandă 8 mm, CD, DVD, ZX Microdrive, SDHC, CompactFlash, stick USB).
- Mesajele pentru dispozitivele vechi: https://en.wikipedia.org/wiki/Floppy_disk (până la 1,2 MB la 8"/5,25"; 1,44 MB la 3,5") și https://en.wikipedia.org/wiki/ZX_Microdrive („launched in July 1983”, „endless loop of magnetic tape”).

## Ce n-am putut verifica / alegeri de semnalat profesorului
1. **Calculatoarele din laborator au Windows** — presupus. Textul spune acum „calculatoarele cu Windows, ca cele din laborator”; de confirmat de profesor (pe Linux, macOS sau Android mărimile apar în trepte de 1000).
2. **Unde stau unitățile centrale în laboratoarele de la Tupilați și Brauner** și dacă au mufe USB în față — neverificat; pasul real are ieșirea „dacă e sub masă, nu te apleca: scrie «nu se vede de pe scaun»”.
3. **Pasul real e unul de observat + aplicare în caiet**, nu „deschide Acest PC”: deschiderea Explorer-ului e materia M2 și nu am captura drumului (capturi_lipsa.json, L1).
4. **Stick-ul: intrare-ieșire sau stocare?** Lecția 5 l-a lăsat deoparte. Aici: „Când salvezi, datele merg spre stick; când îl deschizi, vin de pe el. Treaba lui e să le păstreze: de aceea e un dispozitiv de stocare.” — compatibil cu ambele manuale (contradicția e deja notată în `jocuri\README.md` §9, 15.09).
5. **„Cloud” nu apare** (materialul profesorului îl are): cere internetul, care nu e predat la a V-a; dacă profesorul îl vrea, merge o propoziție în „Uite cum” la pasul „Dispozitivele de stocare”.
6. „O literă cu diacritice ocupă **de obicei** 2 byți” — adevărat în UTF-8 (codarea cea mai folosită azi; nu am verificat ce codare folosesc programele din laborator); în codarea veche Windows-1250 ar fi 1 byte. De aceea exercițiile folosesc doar cuvinte fără diacritice.

## Reparații după judecător și linia automată (27.09.2026 seara)
Lista completă, cu dovezile: `_verificare\reparatii.md`.
