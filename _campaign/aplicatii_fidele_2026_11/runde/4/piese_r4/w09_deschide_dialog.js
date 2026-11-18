      if (baza === 'dialog.FileSaveAs' || baza === SALVARE_NOUA || baza === INTREBARE_INCHIDERE) {
        const prim = (M.P.find(p => p.t.trim()) || { t: '' }).t.trim();
        let propus = prim ? prim.replace(/[\\/:*?"<>|]/g, '').slice(0, 60) : faraExt(M.nume);
        /* „Save your changes…” pe un document deja salvat: numele lui (fără referință — AC-5) */
        if (baza === INTREBARE_INCHIDERE && M.salvat) propus = faraExt(M.nume);
        /* fereastra Save As propune numele CU extensia („Tema mea de azi.docx”), ferestrele Office FĂRĂ („Poezia mea”):
           scenarii_real/word-salvare-ca-f12.json, word-ctrl-s-document-nou.json */
        if (baza === 'dialog.FileSaveAs') propus += '.docx';
        dialog.propus = propus;
        dialog.tip = tipCaseta(baza);
        if (baza === INTREBARE_INCHIDERE) M.intrebare = { titlu: '', intrebare: date.dialoguri[baza].titlu, butoane: butoaneJos(baza), apasat: null };
        else M.dialogSalvare = { titlu: date.dialoguri[baza].titlu, nume_propus: propus, tip_propus: dialog.tip };
      }
