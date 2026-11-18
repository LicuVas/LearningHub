        /* Alt+↓ deschide lista casetei (support.microsoft.com/en-us/office/keyboard-shortcuts-in-word-95ef89dd-7142-4b50-
           afb2-f762f663ceb2: „Open the menu for the selected button. | Alt+Down arrow key”); rândurile ei: uia_word.json ›
           lista.FontSize. În Save As, caseta Save as type are același gest (referința: Button „Deschidere”, tasta_acces
           „Alt+Săgeată în jos”) — critic runda 3, GRAV 3 / A1 */
        if (e.key === 'ArrowDown' && e.altKey && e.target.closest && e.target.closest('[data-lh-id-mso="FontSize"]')) { e.preventDefault(); return listaMarimi(e.target.closest('[data-lh-id-mso="FontSize"]')) || 'lista_marimi'; }
        if (e.key === 'ArrowDown' && e.altKey && dialog && dialog.baza === 'dialog.FileSaveAs' && e.target.closest && e.target.closest('[data-lh-tinta="camp:tip_fisier"]')) { e.preventDefault(); return listaTip(e.target.closest('[data-lh-tinta="camp:tip_fisier"]')) || 'meniu_tip_fisier'; }
