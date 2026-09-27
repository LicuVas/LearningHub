# Surse — lecția V · M1 · nr. 4

**Titlul (exact din `Calendar_ore_5AM_5M.md`):** Structura generală a unui sistem de calcul. Rolul componentelor hardware
**Scris:** 27.09.2026, de agentul-autor, după `_campaign\revizuire_completa_2026_09\05_STANDARD_LECTIE.md`. Nepublicat, necomis.

**Actualizat:** 27.09.2026, după judecătorul independent (0 GRAV, 3 MAJOR, 11 MINOR): ce s-a schimbat și de ce, în `_verificare\reparatii.md`. Motorul rulează acum în `mod:'lectie'`: „Acum la calculatorul din laborator” (`aplicatieReala`) vine după atelier și înainte de cele 5 întrebări.

## Programa
- `C:\00\Projects\Info_Gimnaziu_2026\data\unitati.json` → V-U1 „Sisteme de calcul. Lucrez corect și în siguranță”, CS.1.1, lecția 4 (predare; teorie, exerciții).
- `C:\00\AI_0\data\informatica_gimnaziu\curriculum.json` (OMEN 3393/2017), clasa a V-a, domeniul „Elemente de arhitectură a unui sistem de calcul”:
  - „Structura generală a unui sistem de calcul”
  - „Rolul componentelor hardware ale unui sistem de calcul”
- Activitatea de învățare folosită (CS.1.1): „identificarea componentelor hardware (de exemplu utilizând: componente ale unor calculatoare dezasamblate, simulatoare virtuale, filme didactice, planşe etc.) cu evidenţierea rolului componentelor hardware și a interacțiunilor dintre acestea” → atelierul și întrebarea 4 (fotografii de calculatoare desfăcute), pasul 6 (interacțiunile: drumul literei A).
- Descriptorul „De bază”: „…folosind dispozitive periferice de bază (tastatură, mouse, monitor), aplicând cunoștințe de bază despre componentele hardware utilizate…” → pasul 2 și provocarea din laborator.
- `Proiectul_unitatii_V-U1.md`: are doar titlul lecției și tipul (predare; teorie, exerciții).

## Granițele cu lecțiile vecine (verificate în Calendar_ore)
- Lecția 5 „Dispozitive de intrare, de ieșire și de intrare-ieșire”: aici NU clasific dispozitive. „Intră / iese” apar doar ca opriri din drumul datelor; tastatura, mouse-ul și monitorul apar ca părți ale sistemului, fără termenii „dispozitiv de intrare/ieșire”.
- Lecția 6 „Dispozitive de stocare. Unități de măsură”: aici discul apare doar cu rolul lui (păstrează după oprire); fără tipuri (hard disk / SSD scoase după judecător, m4), fără capacități, fără GB.
- Vocabularul lecției 5: variantele de răspuns folosesc verbele schemei („Datele nu intră”, „Rezultatul iese”), nu substantivele „Intrarea” / „Ieșirea” (m1).
- „Software” / sistemul de operare (M2): nu folosesc termenul „software”; contrastul e „piesă” vs „program” (programul e cunoscut din lecția 3).

## Ce am refolosit
- `jocuri\calculator-v\index.html`, nivelul 4 „Hardware și software” (raportul fazei 0: 0 grave, 15 minore): rolurile componentelor, analogia bucătar/masă de lucru, drumul literei A, întrebarea „se ia curentul înainte să salvezi”. **Minorele evitate:** criteriul „pot să-l ating?” (→ „e un obiect, o piesă?”); termeni folosiți înainte de explicație; „a rula”; „HDD” neexplicat; Managerul de activități (Ctrl+Shift+Esc, GHz, 15,5/39,7 GB) scos cu totul; atelierul nu mai e recunoaștere cu răspunsul dat în exemplu (e o fotografie nevăzută); „Play” doar în engleză (nu mai apare); unitatea centrală/carcasa și discul sunt acum în schemă.
- Nivelurile 1-3 din același joc = ce ȘTIE elevul (profil.json).
- Tema vizuală (culori, fonturi, banda cu porturi) = a lecției-joc „Misiunea Tehnician” (aceeași unitate).
- `jocuri\calculator-v\img\componente.webp` → decupat în `img\piese-procesor-memorie-disc.webp`.
- `calculator-antrenament-v` și `content\tic\cls5\m1-sisteme\lectia2-hardware.html`: citite din raportul fazei 0; nu am luat nimic din ele (lecția veche: jargon socket/PCIe/SATA, 0 imagini).

## Imaginile (toate de pe Wikimedia Commons; licența citită prin API-ul Commons, câmpul LicenseShortName, 27.09.2026)
| Fișier în `img\` | Sursa | Autor | Licență | Ce am schimbat |
|---|---|---|---|---|
| calculator-clasa.webp, calculator-parti.webp | [Dell Desktop Computer in school classroom.jpg](https://commons.wikimedia.org/wiki/File:Dell_Desktop_Computer_in_school_classroom.jpg) | Ente75 | domeniu public | micșorată; la „părți”, chenare + etichete |
| in-unitate-procesor-memorie-disc.webp | [Computer 2008 inside.jpg](https://commons.wikimedia.org/wiki/File:Computer_2008_inside.jpg) | DmitroCzegovets | CC BY 4.0 | decupată; cerc, chenare, etichete („Discul”, fără „hard disk”) |
| in-unitate-placa-sursa-video.webp | [Be Quiet PC Case Interior with GTX 3060 and P40.jpg](https://commons.wikimedia.org/wiki/File:Be_Quiet_PC_Case_Interior_with_GTX_3060_and_P40.jpg) | Tim Sheerman-Chase | CC BY 4.0 | decupată; chenare, etichete; chenarul plăcii de bază începe după ventilatorul carcasei, care are cercul lui |
| piese-procesor-memorie-disc.webp | montajul `calculator-v/img/componente.webp` (CC BY-SA 4.0), din: [procesor](https://commons.wikimedia.org/wiki/File:Intel_CPU_Celeron_G3930_Kaby_Lake_perspective.jpg) Eric Gaba, CC BY-SA 4.0; [RAM](https://commons.wikimedia.org/wiki/File:2*8Go_DDR4_Corsair_-_2018-05-08.jpg) Bretwa, CC BY-SA 4.0; [SSD](https://commons.wikimedia.org/wiki/File:Crucial_CT256M4SSD2_rear_20120123.jpg) Djsumdog, CC BY-SA 3.0 | — | CC BY-SA 4.0 | trei fotografii decupate (fără textele montajului) și puse alături; spus și în legendă |
| calculator-desfacut.webp (atelier) | [Computer from inside 018.jpg](https://commons.wikimedia.org/wiki/File:Computer_from_inside_018.jpg) | kallerna | domeniu public | decupată pe margini; FĂRĂ marcaje |
| placa-memorie-ventilatoare.webp (întrebarea 4) | [Mainboard in Computer.JPG](https://commons.wikimedia.org/wiki/File:Mainboard_in_Computer.JPG) | www.elbpresse.de | CC BY-SA 4.0 | micșorată; FĂRĂ marcaje |

Autorul și licența stau și sub fiecare imagine, în pagină. Proveniența, în format de mașină: `img\SURSE.json`. Toate fișierele au sub 105 KB.
Marcajele (chenar roșu `#E4002B`, etichete) sunt puse cu PIL pe copii, ca în `jocuri\README.md` §6b; conținutul fotografiilor nu e schimbat. N-am desenat și n-am generat nicio imagine. Schema „Intră → Prelucrare ⇄ Memorare → Iese” e HTML + CSS în pagină, nu imagine.

## Simulatorul „fotografie” (în `tipuri` al paginii, nu în `_motor\`)
Elevul alege o etichetă, atinge locul piesei pe fotografie (apare un cerc roșu cu numărul etichetei), apoi „Verifică etichetele”: fiecare test („„Procesorul” stă pe procesor”…) se bifează ✓ sau ✗, cu motivul („Acum stă pe placa video.”). Zonele sunt dreptunghiuri în procente, verificate în ordinea priorității (piesele mici înaintea plăcii de bază pe care stau). Dacă merge la clasă, e candidat pentru `_motor\tip-fotografie.js` (identificare pe capturi/fotografii, util și la alte jocuri).

Simulatorul, după judecător (27.09): testul plăcii de bază spune „pe o bucată liberă a plăcii”, iar eticheta plăcii pusă pe o piesă prinsă de placă primește un mesaj care explică regula (`pePlaca`); butonul „Mărește fotografia” lărgește fotografia (190%, derulare în lateral) pentru telefon.

## Ce NU am putut verifica
- **Zonele de pe fotografii**: judecătorul le-a verificat pe pixeli (toate 9 corecte, A24, A25, A27). Rămâne nesigură doar culoarea modulelor de memorie din fotografia atelierului (verdele/portocaliul sunt probabil suporturile); textul nu mai numește culorile.
- **Calculatoarele din laborator**: calculator de birou, laptop sau „totul-în-unul”; dacă tastaturile au fir. Formulările acoperă toate trei variantele, iar tot pasul se face de pe scaun.
- **Lecțiile 1-3 noi** din `/lectii/` nu există încă; profilul se sprijină pe nivelurile 1-3 din `calculator-v`.
- **„hard-uer”**: pronunția e aproximativă, scrisă pentru copii.
- **Simplificări conștiente** (de verificat de judecător că nu devin false): apăsarea tastei „ajunge la procesor prin placa de bază”; „placa video pregătește imaginea” (la integrate: o parte din procesor sau din placa de bază — spus în pas); „memoria RAM se golește la oprire”.
