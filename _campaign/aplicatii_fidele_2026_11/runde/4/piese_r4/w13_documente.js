    /* ============================================================ închiderea și deschiderea documentelor (critic runda 3, N4) */
    const instantaneuDoc = () => ({ P: M.P, tab: M.tab, img: M.img, pag: M.pag, sel: M.sel, cel: M.cel, nume: M.nume, salvat: M.salvat,
      folder: M.folder, modificat: M.modificat, H });
    function incarcaDoc(d) {
      M.P = d.P; M.tab = d.tab || []; M.img = d.img || []; M.pag = d.pag || paginaNoua(); M.sel = d.sel || { a: 0, f: 0 }; M.cel = d.cel || null;
      M.nume = d.nume; M.salvat = !!d.salvat; M.folder = d.folder || null; M.modificat = !!d.modificat;
      M.fmtIns = null; M.ultima = null;
      H = d.H || st.istoric(grupeaza);
      M.deschis = true;
      root.classList.remove('lh-ap-fara-document');
      actualizeaza();
    }
    /* Ctrl+W / ✕: documentul NEmodificat se închide fără întrebare (support.microsoft.com/en-US/Support/known-issues/
       users-are-prompted-to-save-locally-saved-documents-after-being-idle-with-no-edits-made: întrebarea fără modificări e
       un defect; AC-4); cel modificat întreabă „Save your changes to this file?” (uia_word.json ›
       dialog.save_your_changes_to_this_file; scenarii_real/word-ctrl-w-nesalvat.json; ✕ = aceeași fereastră:
       word-x-nesalvat-cancel.json). Profilul word2007 n-are referință pentru asta → mesajul central. */
    function cerereInchidere(cum) {
      if (M.inchisApp) return 'fara_efect';
      if (p2007) return I.nesimulat(cum === 'x' ? 'Close' : 'Ctrl+W');
      if (!M.deschis) { if (cum === 'x') { inchideAplicatia(); return 'inchidere_aplicatie'; } return 'fara_efect'; }
      if (backstage) inchideBackstage();
      if (!M.modificat) return inchideDocument(cum, 'inchidere_document');
      M.dupaInchidere = cum;
      return deschideDialog(INTREBARE_INCHIDERE) ? 'intrebare_salvare' : I.nesimulat(cum === 'x' ? 'Close' : 'Ctrl+W');
    }
    /* documentul se închide; Word rămâne deschis, gol, cu titlul „Word” (scenarii_real/word-ctrl-w-nu-salva.json:
       documente_deschise 0, titlu_fereastra „Word”). Alt document deschis (din Recent) vine în față. ✕ pe ultimul document
       închide tot Word-ul (lecția m1-l03:207; fără referință — AC-5). */
    function inchideDocument(cum, actiune) {
      if (M.altele.length) { incarcaDoc(M.altele.pop()); return actiune; }
      if (cum === 'x') { inchideAplicatia(); return actiune; }
      M.deschis = false;
      M.P = [parIn('')]; M.tab = []; M.img = []; M.pag = paginaNoua(); M.sel = { a: 0, f: 0 }; M.cel = null;
      M.nume = 'Document1'; M.salvat = false; M.folder = null; M.modificat = false; M.fmtIns = null; M.ultima = null;
      H = st.istoric(grupeaza);
      root.classList.add('lh-ap-fara-document');
      actualizeaza();
      return actiune;
    }
    function inchideAplicatia() {
      M.deschis = false;
      M.inchisApp = true;
      M.altele = [];
      inchideMeniu();
      if (backstage) inchideBackstage();
      root.classList.add('lh-ap-fara-document', 'lh-ap-inchisa');
      actualizeaza();
    }
    /* un rând din Recent deschide fișierul (din `fisiere` sau salvat de elev); un document în lucru rămâne deschis în
       fereastra lui (documente_deschise crește) — NEVERIFICAT: AC-7 */
    function deschideFisier(ref) {
      const f = gasesteFisier(ref.nume, ref.folder);
      if (!f) return I.nesimulat(faraExt(ref.nume));
      if (M.deschis && (M.salvat || M.modificat)) M.altele.push(instantaneuDoc());
      inchideBackstage();
      incarcaDoc({ P: f.text.map(t => parIn(t)), nume: f.nume, folder: f.folder, salvat: true, modificat: false });
      return 'deschidere';
    }
    /* File › Open › Recent: rândurile = lista Recent din conținut (+ documentele salvate); forma rândului din
       uia_word.json › backstage.Open_rand_recent (ListItem 753×61, Alt, F, O, Y 3…). Fără `recente`, rândurile rămân ale
       referinței (goale: textele lor sunt personale). Pe rând: numele fără extensie, ca în bara de titlu (AC-7). */
    function umpleRecente(p) {
      if (!M.recente.length) return;
      const randuri = [...p.querySelectorAll('[data-lh-id-mso="GroupRecentDocuments"] [data-lh-tip="List"] [data-lh-tip="ListItem"]')];
      randuri.forEach((x, k) => {
        const f = M.recente[k];
        if (!f) { x.style.display = 'none'; x.__fisier = null; return; }
        const et = faraExt(f.nume);
        x.style.display = '';
        x.setAttribute('data-lh-eticheta', et);
        x.setAttribute('data-lh-tinta', 'backstage:' + et);
        x.innerHTML = '<span class="lh-ap-text">' + esc(et) + '</span>';
        x.__fisier = f;
      });
    }

