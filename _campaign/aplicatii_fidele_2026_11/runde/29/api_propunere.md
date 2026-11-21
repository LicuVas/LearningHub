# Runda 29 — text propus pentru `api_biblioteca.md` (zona înghețată; îl aplică o rundă `acoperire`)

## 1. §5 Starea › **excel** — după fraza „…în `celule`, la o celulă cu eroare, `valoare` = numele erorii, ca în celulă („#SPILL!”);”
Rândul exact de adăugat:
> din runda 29 (21.11.2026, foile din viii/m1-l03): `culori_file` `{foaie: '#RRGGBB'}` (culoarea filei, Tab Color; doar filele colorate, `{}` = niciuna); `foi` și `foaie_activa` se schimbă și la ștergerea, mutarea și copierea foii (copia = „Nume (2)”, activă); fereastra „Microsoft Excel” care întreabă la ștergerea unei foi cu date / refuză ștergerea singurei foi / spune „That name is already taken…” la redenumire apare în `dialog` `{titlu: 'Microsoft Excel', intrebare: <textul ferestrei>, butoane, apasat: null}` și în `fereastra_mesaj` `{titlu, texte, butoane}`;

## 2. §1 Parametrii de CONȚINUT ai lui `deschide('excel', …)` — la `foi: [{nume, celule, format, latimi}]`
> `foi[].culoare` (opțional, runda 29) = culoarea filei la pornire, `'#RRGGBB'` (ex. un exercițiu care pornește cu Octombrie verde).

## 3. §4 Evenimentele — acțiunile noi ale lui Excel (pentru lecțiile care ascultă și pentru asistent, §6.3)
> Excel, foile (runda 29): `stergere_foaie` (Delete din meniul filei pe o foaie goală, Delete în întrebare, Home › Delete ▾ › Delete Sheet), `intrebare_stergere` (s-a deschis întrebarea), `refuz_stergere` (singura foaie), `mutare_foaie` / `copiere_foaie` (OK în Move or Copy, tragerea filei — `gest: 'tragere'`, `tinta: 'fila_foii:<nume>'` — și Ctrl + tragere), `culoare_fila` (un pătrățel din Tab Color: `tinta: 'meniu:Green'`), `foaie_urmatoare` / `foaie_anterioara` (Ctrl+PageDown / Ctrl+PageUp; la capăt `fara_efect`), `nume_existent` (Enter la redenumire cu numele altei foi). Alt singur într-o fereastră sau în Backstage: `arata_taste_acces`, ca în afara lor.

## 4. §3 Suprafețele desenate fără referință (pentru `CONVENTIE_ARBORE.md` / `suprafete.json`, la runda `acoperire` care le capturează)
> `dialog.sterge_foaia`, `dialog.foaie_unica`, `dialog.nume_foaie_existent` (ferestre „Microsoft Excel”), `lista.TabColor` (submeniul Tab Color, desenat din `lista.CellFillColorPicker`), `lista.TableDeleteRowsAndColumnsMenu` (Home › Delete ▾). Toate au rândurile R29-1 … R29-7 în `de_verificat.md`; până la captură NU sunt în `suprafete.json`, deci O3 nu le numără.
