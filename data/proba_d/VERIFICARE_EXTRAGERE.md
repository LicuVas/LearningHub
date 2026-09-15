# Verificare independentă a extragerii — proba D (W/X/P/A)

> Verificator adversarial, 15.09.2026. Eșantion: 2013-varianta7, 2016-varianta14, 2018-model, 2022-varianta5, 2025-varianta2.
> Surse: rezolvările HTML din `subcompetente-digitale/content/rezolvari/` + PDF-uri oficiale citite cu PyMuPDF:
> barem 2016 v14, barem 2022 v5, Fișa B 2013 v7 (punctele tipărite în subiect; pentru 2013 nu există barem).
> Fișierele `raw/batch*.json` NU au fost modificate. Simularea efectului corecturilor: script în scratchpad (nu în proiect).

## 1. Rata de eroare pe eșantion (69 de cerințe W/X/P/A)

| Categorie | Erori | Observație |
|---|---|---|
| Cerințe lipsă | 0 / 69 | toate itemii W/X/P/A din subiecte sunt prezenți |
| Cerințe inventate | 0 / 69 | exercițiile „mini-drill" din rezolvările 2023-model / 2024-model-fișa-b-excel (`=B2*C2`, `=IF`, `=AVERAGE`) NU apar în JSON — corect, nu fac parte din subiect |
| Puncte greșite | 0 / 69 | 2016 v14 și 2022 v5: 36/36 identice cu baremul; 2013 v7: 18/18 identice cu Fișa B |
| Etichete de operație greșite / prea generale | 5 / 69 (≈7%) | vezi §2 — două dintre ele sunt **erori sistemice** în tot setul |
| „detalii" care citează greșit | 2 / 69 (≈3%) | minore, vezi §3 |

Notă: rezolvarea HTML 2013-varianta7 are titlul „Subiectul IV.1 — Word (13 puncte)", dar itemii însumează 15p și Fișa B oficială dă 1+3+5+3+3 = 15p. Greșeala e în HTML, nu în extragere (JSON-ul are 15p, corect).

## 2. Etichete de operație greșite

| Variantă | Problemă | Citat din sursă | Corectură |
|---|---|---|---|
| 2018-model X 3a | Seria Fill > Series etichetată `X_introducere_date` | „Home > Editing > Fill > Series... Step value: 1, Stop value: 2108" (barem: 2p seria) | etichetă nouă `X_serie_umplere` în loc de `X_introducere_date` |
| **SISTEMIC** (13 cerințe) | Aceeași operație (umplere cu serie) are 2 etichete diferite: 8× `X_referinta_relativa_copiere` (2013 v13, 2014 model/v4/v5, 2015 v5, 2019 v5, 2024 v3, 2025 model) și 5× `X_introducere_date` (2017 v5/v7, 2018 model/v5, 2019 model) | ex. 2025-model: „Fill Series Step=25 Stop=2500" | toate → `X_serie_umplere`; adaugă ID-ul în `vocabular_operatii.md` (sau ALIAS). `X_referinta_relativa_copiere` rămâne doar pentru 2013-varianta10 3.b (copiere reală de formulă) |
| 2025-varianta2 W 1a | Bold + italic etichetat `W_efecte_text` (vocabularul: exponent/indice/majuscule mici/barat); B-I-U ține de `W_font` | barem: „2p culoarea + 3p stilurile (aldin și cursiv)" | `operatii`: `["W_font"]` (scoate `W_efecte_text`) |
| 2018-model A 5b | Lipsește crearea interogării + numele comp_q (3p din 5) | barem: „1p crearea unei interogări + … 2p numele comp_q" | `operatii`: adaugă `A_interogare_selectie` |
| **SISTEMIC** (15 cerințe de 1p) | Cerințele „citește și scrie pe foaie" primesc și a doua etichetă (ex. 2013 v7 1.a `W_antet_subsol`, 2016 v14 1a `W_font`) → umflă numărul de variante al operației reale | 2013 v7: „Scrieți pe foaia de examen textul aflat în subsolul documentului (1p)" | păstrează doar `*_citire_proprietate`/`*_inspectie_*`; afectează 10× `W_antet_subsol`, 1× `W_nota_subsol`, 1× `W_font`, 1× `P_tabel_diagrama` |

Minore (nu schimbă clasamentul, nu le-am numărat ca erori): 2022 v5 X 3b nu are eticheta pentru copierea lățimii coloanei (`X_latime_inaltime`, 2p din barem); 2025 v2 A 5a nu are `A_tip_camp` (1p „tip" în barem).

## 3. „detalii" care citează greșit

| Variantă | Problemă | Citat din sursă | Corectură |
|---|---|---|---|
| 2025-varianta2 X 3b | `celula1==TODAY(), celula2==TODAY()+1` — semn „=" dublat (formulă invalidă dacă e copiată în joc) | „scrie data de astăzi (… merge și formula =TODAY())" | `detalii`: `celula1: data de azi sau =TODAY(); celula2: =TODAY()+1` |
| 2025-varianta2 X 3a | `=AVERAGE(C2:C10)` prezentat ca răspuns fix; sursa spune că plaja e doar un exemplu | „Înlocuiește C2:C10 cu zona reală a valorilor din coloana C" | adaugă „(plaja reală din fișier)" după fiecare formulă |

## 4. Verificarea HARTA.md

| Afirmație din HARTA | Verdict | De ce |
|---|---|---|
| Formulele sunt rare (nu există X_SUM / X_MAX_MIN) | **SE ȚINE** | căutare în toate cele 45 de rezolvări: zero `=SUM(`/`=MAX(`/`=MIN(`; toate formulele din surse au etichetă de formulă (singurele excepții sunt drill-urile neoficiale). Nu sunt formule ascunse sub `X_introducere_date`. |
| `X_referinta_relativa_copiere` (9 variante) și `X_introducere_date` (6) | **FALS** | 13 din cele 15 sunt aceeași operație — umplerea cu serie. Unificată, `X_serie_umplere` = 13 variante / 32,5p → locul 5 la Excel (acum e împrăștiată pe locurile 9 și 16) |
| `X_format_numar` locul 3 (20 variante) | parțial umflat | 13 din cele 20 apariții sunt „formatul celulelor" din cerințele cu serie; e aceeași sarcină, nu una separată |
| `W_antet_subsol` în 17 variante (38%) | **FALS ca frecvență** | 10 dintre ele sunt doar „citește textul din subsol" (1p). Fără ele: 8 variante, 26p. Punctele se schimbă puțin, procentul de variante mult |
| Top 5 Word / PowerPoint / Access pe puncte | **SE ȚINE** | simularea corecturilor nu mută nimic din top 5 W și P; la A doar `A_interogare_selectie` crește la 45p (rămâne locul 3) |
| `X_format_celule` (123p) și `P_text_format` / `P_imagine_forma` (128,5p / 111,5p) pe locul 1 | adevărat, dar sunt etichete-sac | adună font, borduri, umplere, aliniere, orientare, încadrare, exponent (X) și casete text, forme, copiere imagine, poziție (P). Pentru nivelurile jocului, împarte-le pe subtipuri, altfel nivelul 1 devine „tot" |

Top 5 după corecturi (simulat): **W** tabel_rand_coloana · cautare_inlocuire · tabel_format · bordura_umbrire · smartart_forme — **X** format_celule · setare_pagina_imprimare · format_numar · foaie_redenumire_copiere · **serie_umplere** (nou; înlocuiește grafic_inserare) — **P** text_format · imagine_forma · animatie · hyperlink_buton_actiune · tranzitie — **A** raport · formular · interogare_selectie · proprietati_camp · interogare_criteriu_simplu.

Limită: eșantionul are 5 variante din 45. Cele două erori sistemice au fost verificate pe tot setul, prin căutare de tipare. Restul ratelor sunt estimări pe eșantion.
