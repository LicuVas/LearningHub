    /* rândurile listelor din referință (uia_word.json › lista.*), în ordinea lor */
    const randuriLista = cheie => { const o = []; (function u(n) { if (!n) return; if (n.t === 'ListItem' && n.e) o.push(n.e); (n.c || []).forEach(u); })(SUP[cheie]); return o; };
    const TIPURI_SALVARE = randuriLista('lista.FileSaveAs_tip');
    const tipDupaNume = nume => { const m = /\.([a-z0-9]+)$/i.exec(nume || ''); return m ? (TIPURI_SALVARE.find(t => new RegExp('\\*\\.' + m[1] + '[;)]', 'i').test(t)) || null) : null; };
    const numeCuExt = n => (/\.[a-z0-9]{2,5}$/i.test(n) ? n : n + '.docx');
    const faraExt = n => String(n || '').replace(/\.[a-z0-9]{2,5}$/i, '');
    const FOLDER0 = folderSalvare();
    const fisierNou = f => { const nume = numeCuExt(String(f.nume)); return { nume, folder: f.folder || FOLDER0, tip: tipDupaNume(nume),
      text: (Array.isArray(f.text) ? f.text : [String(f.text == null ? '' : f.text)]).map(String) }; };
    /* parametrii de CONȚINUT (lecția alege documentul și fișierele, nu interfața — prompt, pasul 6): documentul poate porni
       deja salvat (`nume`, `folder`, `salvat`, `modificat`); `fisiere: [{nume, folder?, text}]` = fișierele din foldere
       (pentru Recent și pentru verificare); `recente: [{nume, folder?}]` = lista Recent din File › Open. Folderul implicit =
       cel al ferestrei Save As din referință („Documente”). Critic runda 3, GRAV N4. */
    M.fs = (Array.isArray(c.fisiere) ? c.fisiere : []).filter(f => f && f.nume).map(fisierNou);
    M.recente = (Array.isArray(c.recente) ? c.recente : []).filter(f => f && f.nume).map(f => ({ nume: numeCuExt(String(f.nume)), folder: f.folder || FOLDER0 }));
    if (c.nume) {
      M.nume = numeCuExt(String(c.nume));
      M.folder = c.folder || FOLDER0;
      M.salvat = c.salvat !== false;
      if (M.salvat && !gasesteFisier(M.nume, M.folder)) M.fs.push(fisierNou({ nume: M.nume, folder: M.folder, text: M.P.map(p => p.t) }));
    }
    /* „modificat”: conținutul pus la pornire într-un document nesalvat contează ca modificare (Word real, conținut pus prin
       COM: acoperire_r3.fapte.b_ctrl_w_modificat.document_saved_inainte = false); lecția îl poate spune explicit */
    M.modificat = typeof c.modificat === 'boolean' ? c.modificat : (!M.salvat && (M.P.some(p => p.t !== '') || M.tab.length > 0));
