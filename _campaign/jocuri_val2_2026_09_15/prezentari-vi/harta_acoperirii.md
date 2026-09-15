# Harta acoperirii — prezentari-vi („Misiunea Diapozitiv”), VI-U1, lecțiile 2–10

Evaluator independent, 15.09.2026. Surse: unitati.json (VI-U1), Proiectul_unitatii_VI-U1.md, clasa_VI_M1.json, curriculum.json (CS.1.1, CS.3.1), README jocuri §6–§7.
Surse primare descărcate cu curl (text brut salvat în folder): `sursa_ms_scurtaturi_ro.txt` (Microsoft, scurtături PowerPoint ro-ro), `sursa_google_slides_scurtaturi.txt` (Google, scurtături Slides ro), `sursa_ms_animatii_ro.txt` (Microsoft, animații ro-ro).
Execuții: `sim_test.py` → `sim_rezultate.json` (25 de cazuri pe simulator, 0 nepotriviri, 0 erori JS), `pptx_titlu.py` (python-pptx), poarta `test_joc.py` (TRECUT, 68 de întrebări).

Legendă: ✔ = corect / o singură variantă corectă / cheia bate / why explică / termen predat / limbaj potrivit.

## Cadru

| Element | Ce afirmă / cere | Verificat cum | Problemă? |
|---|---|---|---|
| Ancora | VI-U1 „Prezentări digitale”, CS.1.1 + CS.3.1, lecțiile 2–10 | comparat cu unitati.json | nu |
| Intro | 7 niveluri, de 2 ori repari un diapozitiv, diplomă | numărat în LEVELS (7 niveluri, 2 întrebări `diapozitiv`) | nu |
| Nivel ↔ oră | N1=ora 2, N2=3, N3=4, N4=5, N5=6, N6=7, N7=8+9 (ora 10 = evaluare, fără nivel) | comparat cu Proiectul unității | nu |

## N1 — Prezentarea bună și fereastra aplicației (ora 2)

| Element | Ce afirmă / cere | Verificat cum | Problemă? |
|---|---|---|---|
| Pagina | prezentare = șir de diapozitive; regula de aur; părțile ferestrei; aplicațiile au aceleași operații | comparat cu clasa_VI_M1.json (tabelul interfeței: aceleași 5 zone) | nu |
| Î1 choice | pe diapozitiv: „Ideea principală, pe scurt” | citit; ceilalți distractori clar greșiți; why explică | nu |
| Î2 match | miniaturi–ordine, zona de lucru–editare, panglica–comenzi pe file, note–ce ai de spus | comparat cu exercițiul identic din clasa_VI_M1.json; „schimbi ordinea” nu e scris explicit în pagină („lista diapozitivelor”), dar e dedus ușor | nu (minor, acoperit de S06) |
| Î3 tf | publicul vede notele → Fals | citit; pagina spune explicit | nu |
| Î4 classify | 6 semne bună/slabă | citit; „litere mari”, „imagine care explică”, „fundal care înghite textul” nu sunt în pagina N1 (apar abia în N5) | da → S06 |
| Î5 choice | Google Slides vs PowerPoint: operații la fel | citit; pagina o spune | nu |

## N2 — Creez, salvez, închid (ora 3)

| Element | Ce afirmă / cere | Verificat cum | Problemă? |
|---|---|---|---|
| Pagina (original) | „aceleași în orice aplicație: creare (Ctrl+N), deschidere (Ctrl+O), salvare (Ctrl+S)…”; „ce nu ai salvat se pierde” | sursă Microsoft ro: Ctrl+N „Creați o nouă prezentare”, Ctrl+O „Deschideți o prezentare”, Ctrl+S „Salvați prezentarea” ✔ pentru PowerPoint; sursă Google ro: Slides NU are Ctrl+N, iar la Ctrl+S scrie „Fiecare modificare este salvată automat în Drive” | da → S01 (REPARAT) |
| Pagina — formate | .pptx/.odp pt modificat, .pdf pt aspect identic | comparat cu clasa_VI_M1.json (același tabel) | nu |
| Pagina — nume fișier | Reciclare_6A_Popescu.pptx vs final_bun_2.pptx | citit; nume inventate | nu |
| Î1 choice | lucrezi 20 min → Ctrl+S | sursă Microsoft ro ✔; why explică de ce N și O nu salvează | nu |
| Î2 match | N/O/S → nou/deschidere/salvare | sursă Microsoft ro ✔; why dă mnemonicul din engleză | nu |
| Î3 choice | profesorul doar citește → .pdf | comparat cu clasa_VI_M1.json (aceeași cheie „b) .pdf”); o singură variantă corectă | nu |
| Î4 tf | „Salvare ca…” = alt nume/format → Adevărat | sursă Microsoft ro: „Salvați o prezentare cu un alt nume, locație sau format de fișier” ✔ | nu |
| Î5 classify | nume bune/slabe | citit; „Prezentare1.pptx” slab e consecvent cu pagina | nu |

## N3 — Diapozitive și obiecte (ora 4)

| Element | Ce afirmă / cere | Verificat cum | Problemă? |
|---|---|---|---|
| Pagina | obiecte (casete, imagini, forme, tabele, sunete, legături); titlul e tot casetă; structura titlu→cuprins→conținut→concluzie→surse; aspect = machetă | python-pptx: titlul e `SlidePlaceholder` cu cadru de text (substituent); machetele implicite includ „Two Content” și „Comparison” | minor → S10 |
| Î1 tf | titlul stă într-o casetă → Adevărat | executat (python-pptx) — e un substituent, adică un tip de casetă; simplificare acceptabilă | minor → S10 |
| Î2 order | titlu, cuprins, conținut, concluzie, surse | comparat cu pagina; ordinea e unică | nu |
| Î3 choice | „înainte/după” → Două conținuturi alăturate | citit; singura variantă cu două zone; pagina o numește | nu |
| Î4 classify | obiect vs parte a ferestrei | citit; ✔ | nu |
| Î5 tf | imagine de pe internet fără sursă → Fals | citit; pagina cere sursele „și imaginile” | nu |

## N4 — Editez (ora 5)

| Element | Ce afirmă / cere | Verificat cum | Problemă? |
|---|---|---|---|
| Pagina | diapozitiv nou după cel selectat; Ctrl+M în PowerPoint; clic dreapta → dublare/ascundere; tragi miniatura; Delete; Ctrl+Z; mânere colț/latură; straturi | sursă Microsoft ro: Ctrl+M „Adăugați un diapozitiv nou”, Ctrl+Z „Anulează ultima acțiune”; Google ro: Slides tot Ctrl+M; clasa_VI_M1.json: aceleași operații | nu |
| Î1 choice | tragi de mijlocul laturii din dreapta → se turtește | citit; cheia ✔; why spunea „mânerul din mijlocul laturii schimbă doar lățimea” — fals pentru laturile de sus/jos | da → S03 (REPARAT) |
| Î2 order | 7 devine al 2-lea: găsești, ții apăsat, tragi, dai drumul | citit; ordine unică | nu |
| Î3 match | Ctrl+Z, Delete, Ctrl+M, Ctrl+C | sursă Microsoft ro (Ctrl+C, în secțiunea „Copierea obiectelor și a textului”); Ctrl+C nu apare în pagina N4 | minor → S07 |
| Î4 tf | diapozitiv ascuns dispare din fișier → Fals | citit; pagina o spune | nu |
| Î5 choice | imagine peste titlu → trimiți imaginea în spate | citit; pagina spune doar „straturi”, comanda „în spate” nu e predată | minor → S07 |

## N5 — Formatez (ora 6)

| Element | Ce afirmă / cere | Verificat cum | Problemă? |
|---|---|---|---|
| Pagina | font simplu; titlu 32–40, text 24–28, sub 20 greu; contrast; aldin puțin; tema pe fila Proiectare | comparat cu clasa_VI_M1.json („titlu 32–40, text 24–28. Sub 20 nu se citește din sală”); sursă Microsoft ro: „Deschideți fila Proiectare și aplicați teme” ✔ | nu |
| Î1 choice | negru pe alb | executat: contrast calculat 16,48; galben/alb 1,67; roșu/portocaliu 2,04 | nu |
| Î2 tf | tot pe aldin → Fals | citit | nu |
| Î3 diapozitiv (Mihai) | contrast ≥4,5 + titlu ≥32 + text ≥24 și < titlu | executat 16 cazuri + butonul de soluție (sim_rezultate.json): acceptă toate perechile valide (negru/alb, galben/bleumarin, alb/bleumarin, gri deschis/bleumarin, negru/portocaliu, negru/gri, roșu/alb), respinge alb/gri, alb/portocaliu, galben/alb, roșu/portocaliu, negru/bleumarin, text 44 ≥ titlu, titlu 28, text 16; mesajul numește exact problema | minor → S08 (mesaj generic la alb/gri) |
| Î4 choice | 12 diapozitive aceleași culori → temă | citit; pagina o spune | nu |

## N6 — Animații și tranziții (ora 7)

| Element | Ce afirmă / cere | Verificat cum | Problemă? |
|---|---|---|---|
| Pagina | tranziție (fila Tranziții) vs animație (fila Animații); 4 feluri: intrare, accentuare, ieșire, traiectorie; efect cu motiv; F5 | sursă Microsoft ro: „fila Tranziții”, „fila Animații”, F5 „Pornirea expunerii de diapozitive” ✔; pagina Microsoft despre animații descrie categoriile ca „Apariția pe diapozitiv / Primire evidențiere / Ieșirea din diapozitiv / Urmați o cale definită” — „accentuare” și „traiectorie” nu sunt cuvintele Microsoft | minor → S05 |
| Î1 choice | puncte care apar pe rând → animație | citit | nu |
| Î2 classify | 5 exemple tranziție/animație | citit; fiecare exemplu are un singur răspuns după criteriul din why | nu |
| Î3 match | intrare/accentuare/ieșire/traiectorie | comparat cu clasa_VI_M1.json (aceleași 4) | minor → S05 |
| Î4 tf | altă tranziție la fiecare → Fals | citit | nu |
| Î5 choice | verifici ordinea animațiilor → F5 | sursă Microsoft ro ✔; why corect (PDF nu are animații) | nu |

## N7 — Mini-proiect (orele 8–9, final)

| Element | Ce afirmă / cere | Verificat cum | Problemă? |
|---|---|---|---|
| Pagina | 3–5 minute despre „jocul tău preferat: șahul”; estetică 6×6; ergonomie; susținere: public, introducere/conținut/încheiere, note; repetiție | comparat cu Proiectul unității (ora 8: estetică, ergonomie, susținere; ora 9: temă LA ALEGERE) | minor → S09 |
| Î1 choice | privești publicul | citit | nu |
| Î2 hunt (Andrei) | 4 greșeli: fără titlu, 3 paragrafe, altă tranziție+sunet, fără surse | citit motor.js (r. 245: marcajul pe text corect e numărat greșit) + comparat cu N3 (structura are cuprins și concluzie) — planul original nu avea nici cuprins, nici concluzie, deci un copil care aplică N3 era penalizat | da → S02 (REPARAT) |
| Î3 diapozitiv (șah) | contrast + mărimi + rânduri ≤6 cuvinte, min 3 | executat 8 cazuri: acceptă 4 rânduri scurte și 3 rânduri scurte, alte culori valide; respinge 2 rânduri, rândul cu 16 piese, tot, alb/portocaliu, starea inițială; mesajul spune câte rânduri și dă începutul rândului lung; fapte: 64 de pătrate, 16 piese (1+1+2+2+2+8=16) recalculat | nu |
| Î4 order | ziua prezentării: F5, salut, idei, rezumat, mulțumesc | citit; ordine unică | nu |
| Î5 tf | citești de pe ecran cu spatele → Fals | citit | nu |
| Diploma — rezumat | ce a parcurs | citit | nu |
| Diploma — provocare | 5–7 diapozitive despre jocul preferat, 6 rânduri, temă, o tranziție, note, F5, `Nume_Prenume_joc.pptx`, „PowerPoint-ul adevărat” | citit; sala: laboratorul (versiune/aplicație) necunoscut; la Izvoare/Dumbrava Roșie ipoteza e fără laborator | important → S04 |

## Capturi (folderul `capturi\`)

iPhone SE și Pixel 7, temă luminoasă și întunecată: cuprins, pagina N5, simulatorul N5 după greșeală, vânătoarea N7, simulatorul N7. Văzute: iPhoneSE_light_2 (mesajul „Nu încă” lizibil, butoanele încap), iPhoneSE_dark_4 (rândurile barate/păstrate lizibile), Pixel7_dark_3 (vânătoarea). Nicio problemă de contrast sau lățime. Suprapunerea barei de sus peste diapozitiv din captura iPhoneSE_light_2 vine din captura „full page” cu bara lipicioasă, nu din joc.
