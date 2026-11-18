      if (dialog && (dialog.baza === SALVARE_NOUA || dialog.baza === INTREBARE_INCHIDERE)) {
        if (dialog.baza === INTREBARE_INCHIDERE && fel === 'fereastra' && M.intrebare) M.intrebare.apasat = v;
        /* „More options…” → pagina File › Save As (acoperire_r3.fapte.a_ctrl_s_document_nou.more_save_options.backstage) */
        if (v === 'More options…' && dialog.baza === SALVARE_NOUA) { inchideDialog(); deschideBackstage('Save As'); return 'pagina_backstage'; }
        /* „Choose a Location” ▾ și caseta mică Save as type: rândurile listelor lor nu sunt în referință → mesajul central */
        if (fel === 'fereastra' && v === 'Open') return I.nesimulat('Choose a Location ▾');
        if (fel === 'camp' && v === 'tip_fisier') return I.nesimulat('Save as type ▾');
        if (dialog.baza === INTREBARE_INCHIDERE && fel === 'fereastra') {
          /* scenarii_real/word-x-nesalvat-cancel.json: Cancel → documentul rămâne; word-ctrl-w-nu-salva.json: Don't Save →
             documentul se închide nesalvat; Save → salvat, apoi închis (numele din File name) */
          if (v === 'Cancel' || v === 'Închidere') { inchideDialog(); return 'anulare'; }
          if (v === "Don't Save") { const cum = M.dupaInchidere; inchideDialog(); return inchideDocument(cum, 'inchidere_fara_salvare'); }
          if (v === 'Save') { const cum = M.dupaInchidere, r = salveaza(); return r === 'salvare' ? inchideDocument(cum, 'salvare_si_inchidere') : r; }
          return I.nesimulat(v);   // More options… aici: efectul nu e în referință (AC-5)
        }
      }
