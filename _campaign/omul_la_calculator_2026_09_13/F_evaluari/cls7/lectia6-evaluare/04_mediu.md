# 04 — Mediul pe care îl presupune lecția (U4)

## Ce presupune lecția (din `innerText.txt`)
- **Microsoft Word pentru Windows, interfață în engleză**, versiune recentă (Microsoft 365 / 2021+): „Insert > Illustrations > Pictures”, „This Device”, „Picture Format”, „Table Design”, „Layout”, „Wrap Text: Square sau Tight”, „Quick Access Toolbar”. În textul lecției: „Insert” de 21 de ori, „Home” de 8 ori, „Layout” de 8 ori; **nicio** denumire în română de meniu (Grep pe `innerText.txt`).
- Scurtături Windows (Ctrl+…), tastatură cu Tab/Shift.
- **Un fișier-imagine pe calculatorul elevului** („This Device”) sau internet („Online Pictures”). Lecția nu spune de unde vine imaginea.
- Un loc de salvare („Salveaza documentul cu Ctrl+S”, „Salveaza ca Referat_M1_Performanta.docx”) — fără folder.
- Fontul implicit declarat: „Calibri, dimensiunea 11”.

## Comparat cu ce se știe (text brut, 13.09.2026)
| Afirmația lecției | Sursa | Rezultat |
|:--|:--|:--|
| Insert > Pictures > This Device | `surse/s01_inserare_imagine.txt` (insert-pictures, en-us r.151; ro-ro r.135 „Selectați Inserați > imagini > în acest dispozitiv”, r.179 „În fila Inserare , selectați Imagine > pe acest dispozitiv”) | există; în română pagina însăși scrie și „Inserați”, și „Inserare” — ce vede elevul se află doar în laborator |
| Wrap Text > Square / In Line with Text | `surse/s02_incadrare_text.txt` (en r.169, ro r.150 „Format imagine … Încadrare text > pătrat”; r.139 „În linie cu textul plasează imaginea într-un paragraf”) | confirmat; nume ro: Format imagine, Încadrare text, pătrat, strâns, în linie cu textul |
| Crop | `surse/s03_trunchiere.txt` (ro: „Trunchierea unei imagini în Office”, „opțiunea Trunchiere”) | confirmat; în română = **Trunchiere**, nu „decupare” |
| Quick Access Toolbar în stânga sus cu Save/Undo/Redo | `surse/s04_bara_acces_rapid.txt` (en „Upper-left corner above the ribbon (default location)”; ro „Colțul din stânga sus, deasupra panglicii (locația implicită)”; dar și „Ascundere bară de instrumente Acces rapid”) | cheia grilei 1 e corectă; bara **se poate ascunde** — pe un PC de laborator poate lipsi (necunoscut) |
| Ctrl+A „in tabel selecteaza tot tabelul” (atomul 5) | `surse/s05_scurtaturi.txt` (ro r.150 „Selectați tot conținutul documentului.” Ctrl+A) | **greșit**; lecția însăși scrie corect la atomul 7 |
| Ctrl+Spatiu șterge formatarea manuală | s05 (ro r.494 „Eliminarea formatării manuale a caracterelor.”) | corect (doar formatarea de caracter) |
| Ctrl+5 = 1,5 rânduri; Ctrl+J; Ctrl+Y | s05 („spațierea la un rând și jumătate”; „Refaceți acțiunea anterioară”) | corecte |
| Format Painter, dublu clic = repetat | `surse/s07_descriptor_formate.txt` („Descriptorul de formate”, „faceți întâi dublu clic”) | corect; nume ro = Descriptor de formate |
| Font implicit Calibri 11 | `surse/s08_aptos_implicit.txt` (ro „Aptos este fontul implicit în tot programul Office.”) | depășit pentru Microsoft 365; adevărat pe Office 2016-2021 — depinde de laborator |

## Ce NU se știe (depinde_de_necunoscut)
- Versiunea Office și limba interfeței din laborator (Brauner „1 (TIC)”); la Izvoare, probabil fără calculatoare.
- Dacă PC-urile au imagini locale / internet / restaurare la repornire.
- Separatorul zecimal nu contează aici (Word).
- Evaluarea cade pe **17.11.2026** (VII A/B) și **20.11.2026** (7 MA) — timp suficient ca Vasile să verifice laboratorul înainte.
