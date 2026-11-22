# Acoperirea lecțiilor PowerPoint de aplicatii/powerpoint.js

Data: 21.11.2026. Lecțiile = cele 8 din `_campaign/aplicatii_fidele_2026_11/mapare_v2.md` care încarcă un sim `simppt*.js`.
Inventarul funcțiilor: `_campaign/aplicatii_fidele_2026_11/paritate/powerpoint.md` (102 funcții).

Verificare: sonde Playwright (scriptul e în scratchpad, nu în depozit) pe `poligon.html?aplicatie=powerpoint`, pe funcția
exact cum o cer pașii lecției. Ce NU e sondat e marcat „neprobat”. Lecțiile NU au fost modificate.

| lectii/… | sim | acoperită | funcție lipsă (sau neprobată) |
|---|---|---|---|
| `lectii/vi/m1-l02/index.html` | simppt-interfata.js + simppt.js | nu | F072 Outline (vederea Schița; Normal din View aduce miniaturile); F076 mesajul butonului nu spune fila și grupul |
| `lectii/vi/m1-l03/index.html` | simppt-fisier.js | nu | F081 temă la prezentare nouă (Atlas); F083 Ctrl+S la prezentare nesalvată (fereastra „Save this file”); F084 Save As în alt folder; F085 PDF; F086 .ppsx; F089 „înlocuiești?”; F092 închidere ultima prezentare; F093 Open cu foldere; F097 Protected View; F098 deschidere din Explorer |
| `lectii/vi/m1-l05/index.html` | simppt.js | nu | F022 casetă de aspect cu text (întâi textul, apoi locul); F023 lipire pe același diapozitiv, decalată (F007 și F009 acoperite, vezi tabelul de mai jos) |
| `lectii/vi/m1-l06/index.html` | simppt-formatare.js + simppt.js | nu | F030 lista Font Size ▾ (scrierea 32/54/40 + Enter: neconcludent la sondă); F045 teme Ion și Retrospect (fonturi, culori, poziții nu se schimbă) |
| `lectii/vi/m1-l07/index.html` | simppt-animatii.js + simppt.js | nu | F022 (ca m1-l05). F053, F059, F055 acoperite (vezi tabelul de mai jos) |
| `lectii/vi/m2-l08/index.html` | simppt-estetica.js + simppt-formatare.js + simppt-interfata.js + simppt.js | nu | F033 fontul temei (Headings / Body) nu e legat de temă |
| `lectii/vi/m2-l09/index.html` | simppt-formatare.js + simppt-interfata.js + simppt-proiect.js + simppt.js | nu | F012 bulițe vizuale în caseta de conținut (modelul are rândurile); F016 imagine aleasă din fișierele lecției (se scrie numele, imaginea nu se desenează) |
| `lectii/vi/m2-l10/index.html` | simppt-proba.js (învelișul) + simppt-animatii.js + simppt-formatare.js + simppt-proiect.js + simppt.js | da | nimic din lista cerută de pași; F049 săgețile Duration nu sunt legate (scrisul 0,5 + Enter merge) |

**Acoperite: 1 din 8** (m2-l10). Funcțiile care cer doar scris și Enter sunt acoperite; cele care cer o listă sau o fereastră din care alegi nu sunt.

## Funcții verificate în runda 22.11 (`powerpoint_checks2.mjs`, 11 verificări, ultima linie 0)

Clicuri reale ale mouse-ului și taste în Playwright; `run.mjs` rămâne cu ultima linie 0 (PASS 10, FAIL 0).

| funcție (inventar) | ce s-a făcut în powerpoint.js | verificare | rezultat |
|---|---|---|---|
| F007 Copy ▾ › Duplicate | meniul Copy ▾ (CopySplitButton_Dropdown) cu „Duplicate Slide”; Copy/Cut/Copy ▾ se aprind și cu o miniatură aleasă | 3 | copia vine după original și devine aleasă |
| F009 Cut/Copy/Paste pe diapozitive | Home › Copy/Cut/Paste și clicul dreapta pe miniatură folosesc aceleași funcții ca Ctrl+C/X/V (`copiazaOp`, `lipesteOp`) | 1, 2, 4 | 3 → 4 diapozitive (copie după 3); Cut 4 → 3, Paste după 1 |
| Delete pe miniatură | Delete cu miniatura aleasă șterge diapozitivul | 5 | 3 → 2 |
| F053 al doilea efect pe același obiect | Animations › Add Animation: alegerea următoare ADAUGĂ un efect; galeria rămâne înlocuitoare | 9 | 1 → 2 efecte pe casetă |
| F059 scoate un efect | Delete în Animation Pane scoate rândul ales, obiectul rămâne | 11 | 2 → 1 efect, forme 2 → 2 |
| F055 ▾ pornire în Animation Pane | Start ▾ schimbă rândul ales (nu primul efect); rândurile arată pornirea lor | 10 | [On Click, With Previous] |
| Layout (existau; verificate) | Section Header, Comparison, Blank: titlul rămâne | 6, 6b | Section Header păstrează „Ce sunt vulcanii” |
| Font din lista Font (existau; verificate) | Calibri (Body) pe titlu | 7 | Calibri Light → Calibri |
| Font Color ▾ culoare de temă (existau; verificate) | Blue, Accent 1 | 8 | #4472C4 |

Nu s-a atins: F033 (fontul Headings/Body legat de temă), F045 (teme Ion/Retrospect), F030 (mărimea din lista Font ▾), F012, F016, F072.

## Ce rămâne (după runda 22.11)

1. F022 casetă de aspect cu text (întâi textul, apoi locul) și F023 lipire decalată pe același diapozitiv: m1-l05, m1-l07, m1-l03.
2. Salvare și deschidere reale: Save As cu folder, confirmarea „înlocuiești?”, PDF/PPSX, Open cu foldere, Protected View (m1-l03).
3. Teme care schimbă fonturile, culorile și pozițiile (F033, F045, F081): m2-l08, m1-l06, m1-l03.
4. Mărimea din lista Font Size ▾ (F030): m1-l06.
5. Bulițe vizuale (F012) și imagine din fișierele lecției (F016): m2-l09.
6. Vederea Schiță (F072): m1-l02.


## Istoric (sesiunea anterioară, 21.11)


| funcție (inventar) | ce s-a făcut în powerpoint.js | sondă | rezultat |
|---|---|---|---|
| F071 dublu clic pe miniatură în Slide Sorter → Normal | `I.la.dublu`: `miniatura:N` în sortare → vederea Normal, diapozitivul ales | dublu clic pe miniatura 1 | vedere sortare → normala |
| F065 ecran final „End of slide show, click to exit.” | `arataExpunere`: după ultimul diapozitiv apare textul; un clic iese | după ultimul diapozitiv | textul apare; un clic iese |
| F066 ieșirea revine pe diapozitivul la care ai ajuns | `iesiExpunere` setează `M.activ` la diapozitivul curent | 2 clicuri + Esc | miniatura 3 aleasă (corect) |
| F018 Insert › Text Box | `TextBoxInsert` → așteaptă clicul pe diapozitiv (ca Shapes › Text Box) | clic în diapozitiv + scris | +1 casetă |
| F057 Animations › Move Earlier / Move Later | `AnimationMoveEarlier/Later` → `mutaAnimatie(∓1)` | două forme cu Fly In, Move Earlier | [3,4] → [4,3] |
| F067 animații clic cu clic în expunere | `grupuriExp`/`ascunseExp`/`pasExpunere`: formele apar pe rând, la fiecare clic; „With/After Previous” vin cu grupul | 2 forme cu Fly In | 2 → 3 → 4 forme, apoi diapozitivul următor |
| F035 Shape Fill pe casetă de text | `continutForma`: umplerea solidă a casetei se desenează | Text Box + Yellow | background #FFFF00 |
| F003 Layout › Two Content (cerut de m2-l09, m2-l10, m1-l04) | nu s-a schimbat (exista) | diapozitiv nou → Two Content | 3 forme |
| F049 Duration scris 0,5 + Enter | nu s-a schimbat (exista) | Transitions › Duration | 0,5 |

Aspectele „Title and Vertical Text” / „Vertical Title and Text” nu există în ASPECTE, dar nicio lecție din cele 8 nu le cere.
