# Runda 11 · deciziile orchestratorului la predarea constructorului 1 (19.11.2026 ~22:45)

Constructorul 1 a predat după bucățile 1-4 și o parte din 5 (commit de control 1b68edcc). A lăsat trei întrebări.

1. **`diapozitiv-nou-buton`** (O4 îl numără greșit, R11-9):
   - Rulatorul apasă centrul butonului New Slide. După geometria din referință, centrul cade pe partea cu săgeată, care deschide lista de aspecte; realul a fost rulat prin UIA Invoke.
   - **Decizia:** NU schimbi comportamentul simulatorului ca să treacă scenariul. Simulatorul urmează referința: butonul împărțit, cu partea de jos = lista.
   - Scenariul e înghețat. Schimbarea lui sau proba clicului pe real se face doar într-o rundă `acoperire`.
   - Diferența rămâne numărată de O4 și scrisă în `diferente.md` + R11-9.
2. **`imagine` și `salvare-ca`** (ținte care nu există pe ecran în referință, R11-10):
   - **Decizia:** la fel ca mai sus. Rămân pentru o rundă `acoperire`. Nu inventezi ținte ca să treacă.
   - **`tragere-forma`** (fără rezultat real) rămâne numărat.
3. **Ținta nouă `margine_forma:D/S`** (nu e în lista din api §3):
   - **Decizia:** o păstrezi dacă e singurul fel în care mutarea casetei poate fi probată și urmează forma canonică a țintelor existente (`<fel>:<id>`, cum sunt `celula:B2` sau `grafic:1/titlu`).
   - `api_biblioteca.md` nu-l schimbi (nu ai voie). O scrii în `diferente.md`, iar criticul o judecă.

## Ce urmează (constructorul 2), în ordinea asta
1. **Formatarea pe bucăți de text:** Bold, Italic, Underline, Font Size și Font Color se aplică doar textului ales, cu `stare()` = ecranul și Ctrl+Z. Unghiul criticului 11 e **stare_finala_erori**, deci contează ce rămâne în document după fiecare gest.
2. **Ferestrele de pe drumul lecțiilor:**
   - Font și Paragraph: OK aplică, Cancel / Esc nu schimbă nimic;
   - Insert Table: OK pune tabelul pe diapozitiv, cu starea lui.
   - Doar ce dă referința (`uia_powerpoint.json`, `dialog.*`). Restul primește mesajul central.
3. **Salvarea și închiderea:**
   - „Save your changes” la Ctrl+W / File › Close pe o prezentare modificată (Save / Don't Save / Cancel / Esc), dacă referința o are;
   - numele fișierului după Save As;
   - starea „modificat” după fiecare pas.
4. **Pasul 7 complet**, singur pe mașină, după ultima scriere (cu reluarea lui O6 dacă iese NECONCLUDENT pe timp, cum spune suplimentul).
