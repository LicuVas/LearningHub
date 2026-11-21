# Acoperirea lecțiilor PowerPoint de aplicatii/powerpoint.js

Data: 21.11.2026. Lecțiile = cele 8 din `_campaign/aplicatii_fidele_2026_11/mapare_v2.md` care încarcă un sim `simppt*.js`.
Inventarul funcțiilor: `_campaign/aplicatii_fidele_2026_11/paritate/powerpoint.md` (102 funcții).

Verificare: sonde Playwright (scriptul e în scratchpad, nu în depozit) pe `poligon.html?aplicatie=powerpoint`, pe funcția
exact cum o cer pașii lecției. Ce NU e sondat e marcat „neprobat”. Lecțiile NU au fost modificate.

| lectii/… | sim | acoperită | funcție lipsă (sau neprobată) |
|---|---|---|---|
| `lectii/vi/m1-l02/index.html` | simppt-interfata.js + simppt.js | nu | F072 Outline (vederea Schița; Normal din View aduce miniaturile); F076 mesajul butonului nu spune fila și grupul |
| `lectii/vi/m1-l03/index.html` | simppt-fisier.js | nu | F081 temă la prezentare nouă (Atlas); F083 Ctrl+S la prezentare nesalvată (fereastra „Save this file”); F084 Save As în alt folder; F085 PDF; F086 .ppsx; F089 „înlocuiești?”; F092 închidere ultima prezentare; F093 Open cu foldere; F097 Protected View; F098 deschidere din Explorer |
| `lectii/vi/m1-l05/index.html` | simppt.js | nu | F007 Copy ▾ › Duplicate; F009 Cut/Copy/Paste pe diapozitive; F022 casetă de aspect cu text (întâi textul, apoi locul); F023 lipire pe același diapozitiv, decalată |
| `lectii/vi/m1-l06/index.html` | simppt-formatare.js + simppt.js | nu | F030 lista Font Size ▾ (scrierea 32/54/40 + Enter: neconcludent la sondă); F045 teme Ion și Retrospect (fonturi, culori, poziții nu se schimbă) |
| `lectii/vi/m1-l07/index.html` | simppt-animatii.js + simppt.js | nu | F053 al doilea efect pe același obiect (un singur efect pe casetă în model); F059 scoate un efect, obiectul rămâne; F055 ▾ On Click / With / After din Animation Pane; F022 (ca m1-l05) |
| `lectii/vi/m2-l08/index.html` | simppt-estetica.js + simppt-formatare.js + simppt-interfata.js + simppt.js | nu | F033 fontul temei (Headings / Body) nu e legat de temă |
| `lectii/vi/m2-l09/index.html` | simppt-formatare.js + simppt-interfata.js + simppt-proiect.js + simppt.js | nu | F012 bulițe vizuale în caseta de conținut (modelul are rândurile); F016 imagine aleasă din fișierele lecției (se scrie numele, imaginea nu se desenează) |
| `lectii/vi/m2-l10/index.html` | simppt-proba.js (învelișul) + simppt-animatii.js + simppt-formatare.js + simppt-proiect.js + simppt.js | da | nimic din lista cerută de pași; F049 săgețile Duration nu sunt legate (scrisul 0,5 + Enter merge) |

**Acoperite: 1 din 8** (m2-l10). Funcțiile care cer doar scris și Enter sunt acoperite; cele care cer o listă sau o fereastră din care alegi nu sunt.

## Funcții adăugate în această sesiune (și sonda care le-a verificat)

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

## Ce rămâne (în ordinea cât de multe lecții atinge)

1. Copy/Cut/Paste pe diapozitive și obiecte, Copy ▾ › Duplicate (m1-l05, m1-l03, m1-l07 pentru F022): 2 lecții.
2. Salvare și deschidere reale: Save As cu folder, confirmarea „înlocuiești?”, PDF/PPSX, Open cu foldere, Protected View (m1-l03): 1 lecție, dar multe funcții.
3. Teme care schimbă fonturile, culorile și pozițiile (F033, F045, F081): m2-l08, m1-l06, m1-l03.
4. Animații multiple pe același obiect și ștergerea unui singur efect (F053, F059), ▾ de pornire în Animation Pane (F055): m1-l07.
5. Mărimea din lista Font Size ▾ (F030) — de sondat cu o formă aleasă, nu cu titlul din lista de diapozitive.
6. Bulițe vizuale (F012) și imagine din fișierele lecției (F016): m2-l09.
7. Vederea Schiță (F072): m1-l02.
