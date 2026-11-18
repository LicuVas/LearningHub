# Runda 4 · etapa B · Word · CADRUL (pasul 2, înainte de orice reparație)

Suprafața aleasă: drumul „salvez / închid / deschid / aleg mărimea” al lui Word — fereastra Save As (caseta Save as type,
bara de adrese, antetele), ferestrele Office „Save this file” și „Save your changes to this file?”, Backstage › Open
(lista Recent) și lista derulantă Font Size. Unghiul rundei: **gest_tastatura** (Ctrl+S / Ctrl+W / Ctrl+O, Alt+↓, săgețile
și Enter într-o listă deschisă, Enter / Esc în ferestre).

## Presupuneri (fiecare poate fi greșită; cum aș afla)
1. Cele două ferestre Office (NUIDialog) se pot desena cu motorul comun `panglica.js` din cheile noi ale referinței
   (`dialog.save_this_file`, `dialog.save_your_changes_to_this_file`), fără cod de interfață scris de mână — doar textul
   mare (numele ferestrei interioare) trebuie pus de bibliotecă, fiindcă în UI Automation nu e un nod Text. Aflu:
   desenez și compar dreptunghiurile cu referința (±2 px).
2. Lista Font Size și lista Save as type se pot desena tot din referință (`lista.FontSize`, `lista.FileSaveAs_tip`), lipite
   sub casetă: în referință lista FontSize începe la y 115 = caseta [232,91,43,24] + 24; lista Save as type la y 430 =
   caseta [134,407,815,22] + 22 + 1 (aceeași captură, `dialog.FileSaveAs_pdf`). Aflu: dreptunghiurile pe poligon.
3. „Document modificat” în simulator = conținut pus la pornire fără `salvat:true` SAU orice schimbare după (în Word real
   conținutul pus prin COM lasă `Saved = false`: `acoperire_r3.fapte.b_ctrl_w_modificat.document_saved_inainte: false`).
   Un document NEmodificat se închide fără întrebare (pagina Microsoft de problemă cunoscută: întrebarea fără modificări
   e un defect). Aflu: AC-4 în `de_verificat.md` (un minut pe PC).
4. `stare()` trebuie să dea forma rezultatului real, nu forma mea: `fisiere_salvate` = LISTĂ DE NUME (`["Orar.pdf"]`),
   `nume_fisier` = `null` pentru un document nesalvat niciodată (nu „Document1”), `dialog.titlu` = `""` (bara ferestrei
   Office n-are text). Aflu: O4 pe cele 7 scenarii.
5. Cu tastatura, elevul ajunge la aceleași liste: Alt+↓ în caseta Font Size deschide lista, săgețile mută alegerea,
   Enter o aplică (pagina Microsoft a scurtăturilor Word). Aflu: proba mea cu `page.keyboard`.

## Citirile lui „fidel” pentru suprafața asta
- **(a) aspect** — aceleași elemente, cu textul lor, în același loc (caseta arată „PDF (*.pdf)” după alegere; bara de
  adrese arată „Documente”; antetele arată „Nume”, „Data modificării”…).
- **(b) gest** — același gest deschide același lucru (▾ → lista de 16 mărimi; Ctrl+W → „Save your changes…”; Ctrl+S pe
  document nou → „Save this file”; Alt+↓ → lista).
- **(c) stare finală** — după gest, `stare()` = rezultatul real (dialog, documente_deschise, titlu_fereastra,
  tip_salvare_afisat, fisiere_salvate, pagina_backstage, formatare_pe_caractere).

**Aleg (b) + (c), cu (a) acolo unde critic 3 a dat GRAV de aspect (A1, A2).** De ce: elevul „găsește în laborator
aceleași lucruri, iar ele fac același lucru” (proba realității din contract) — un gest care se oprește într-un mesaj sau
o stare greșită îl învață ceva fals; aspectul contează doar unde ascunde starea (A1: ecranul spune .docx, starea spune
PDF; A2: locul salvării nu se vede). Pierde (a) singur: o fereastră frumoasă care nu salvează e mai rea decât una
aproximativă care salvează corect; pierde (c) singur: O4 compară starea raportată, nu ecranul (limita scrisă în
`acoperire_word.md`), deci A1 ar trece la O4 cu ecranul încă greșit.
