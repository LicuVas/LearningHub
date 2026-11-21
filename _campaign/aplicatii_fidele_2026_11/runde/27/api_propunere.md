# Runda 27 · propunere pentru `api_biblioteca.md` (zona înghețată; o aplică o rundă `acoperire`)

## §1, rândul `opt.incadrat` (azi `api_biblioteca.md:38-41`)
- **Rândul vechi (`:40-41`):** „Gazda care își rescrie stratul pune înapoi `instanta.radacina` în corpul nou în aceeași funcție (mutarea păstrează starea) și cheamă `instanta.focus()` dacă fereastra era activă.”
- **Rândul nou:** „Gazda care își rescrie stratul pune înapoi `instanta.radacina` în corpul nou în aceeași funcție (mutarea păstrează starea, inclusiv caseta de nume deschisă, cu textul ei: nimic nu se redenumește până la Enter) și cheamă `instanta.focus()` dacă fereastra era activă (cu redenumirea deschisă, cursorul se întoarce în casetă). Dacă gazda nu cheamă `focus()`, caseta rămâne deschisă, iar primul clic în altă parte a Explorer-ului o confirmă.”

## §1 sau §2 (Explorer), un rând nou despre căutare
- **Rândul nou:** „Explorer › căutarea: lista se filtrează la fiecare schimbare a textului (tastă, lipire, Ctrl+Z / Ctrl+Y, `insertText`), fără să se rescrie caseta; istoricul de anulare al casetei rămâne (runda 27).”
