      /* caseta „Save as type:” (camp:tip_fisier) sau săgeata ei → lista din referință (uia_word.json › lista.FileSaveAs_tip:
         17 rânduri, sub casetă, cât ea de lată) — critic runda 3, GRAV A1 */
      if (dialog && dialog.baza === 'dialog.FileSaveAs' && (fel === 'fereastra' || fel === 'meniu_derulant' || fel === 'camp')) {
        const cb = elx.closest('[data-lh-tip="ComboBox"]');
        if (cb && /^Save as type/.test(cb.getAttribute('data-lh-eticheta') || '')) return listaTip(cb) || 'meniu_tip_fisier';
      }
