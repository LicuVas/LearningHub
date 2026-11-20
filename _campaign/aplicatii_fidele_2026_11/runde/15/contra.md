# Runda 15 · pasul 4 · CONTRA — planul: Explorer generat din referință + comportamentul din cele 18 scenarii

**Planul:** `genereaza_explorer.py` citește `uia_explorer.json` (pe chei, doar citire) și scrie `date/explorer.json`
(etichete, tipuri, AutomationId, poziții relative, gri/activ, meniurile cu separatoarele deduse din goluri). `explorer.js`
desenează fereastra pe părțile din `CONVENTIE_ARBORE.md` §2 (`data-lh-suprafata` = cheile `SHELL_SUPRAFETE`), deschide
meniurile prin gest și prin plasa `deschideSuprafata`, și ține un sistem de fișiere virtual cu operațiile din scenarii.

**Cel mai puternic argument PENTRU:** O4 trece din motorul `vechi:explorer` pe bibliotecă imediat ce `explorer` apare în
`SURSE_APP` (`sim_runner.js:55-58`: biblioteca are întâietate). Dacă biblioteca nu trece toate cele 18, O4 CREȘTE față
de pornire (14/18 azi). Deci comportamentul nu e opțional: construcția trebuie să treacă 18/18, iar cele 4 diferențe
vechi (butonul „Mai puține detalii”, întrebarea „Redenumiți … ca …?”) se închid pentru că textele vin din referința reală.
În plus, O5 (32 gesturi) și O9 (8 cazuri) pot coborî doar dacă Explorer există în bibliotecă.

**Cel mai puternic argument ÎMPOTRIVĂ:** referința e a PC-ului profesorului, nu a laboratorului. Meniul clasic de clic
dreapta are 33 de rânduri din programe instalate de el (7-Zip, PDF24, Bytello, Notepad++…), panoul de navigare are
unități de disc care nu există în laborator, iar fereastra e 1534 px lată. Un Explorer „fidel referinței” arată elevului
lucruri pe care nu le va găsi pe PC-ul din laborator — exact opusul probei realității. Iar O3 nu va vedea nimic din
construcție în etapa B (lecțiile nu încarcă biblioteca): câștigul pe aspect se vede doar în diagnostic.

**Adevărul incomod (punctul cel mai puțin sigur):** gesturile (dublu clic, tragere, F2 pe loc, clic dreapta) nu sunt
probate pe Explorer real: toate cele 18 scenarii sunt `model_obiect`. Felul în care tragerea pornește (de pe nume / de
pe rândul ales / din spațiul gol) și ce face Ctrl+Z după o copiere sunt [NEVERIFICAT]. Le fac după comportamentul
obișnuit Windows, le marchez R15-… în `de_verificat.md` cu scenariul care le-ar lămuri și NU le număr ca „fidele”.

**Hotărârea (după ele):** construiesc fidel REFERINȚEI (nu „ce cred eu că are laboratorul”) — etichetele specifice PC-ului
profesorului rămân, iar diferența profesor/laborator merge în `de_verificat.md` ca întrebare pentru Vasile (o sesiune
pe un PC din laborator ar înlocui referința). Comportamentul: exact cât dau scenariile; ce nu dau, rând R15 + mesajul
central `data-lh-nesimulat` (R12), nu o invenție.
