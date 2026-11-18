    /* ---- fișierele din foldere (conținutul lecției + ce salvează elevul), cu textul lor */
    function gasesteFisier(nume, folder) {
      return M.fs.find(f => f.nume.toLowerCase() === String(nume).toLowerCase() && f.folder === folder) || null;
    }
    function scrieFisier(nume, folder, tip) {
      const f = { nume, folder, tip, text: M.P.map(p => p.t) };
      const v = gasesteFisier(nume, folder);
      if (v) Object.assign(v, f); else M.fs.push(f);
      if (M.salvari.indexOf(nume) < 0) M.salvari.push(nume);
      /* documentul salvat urcă primul în lista Recent (NEVERIFICAT: AC-7) */
      if (!/\.pdf$/i.test(nume)) {
        M.recente = M.recente.filter(r => !(r.nume.toLowerCase() === nume.toLowerCase() && r.folder === folder));
        M.recente.unshift({ nume, folder });
      }
    }
    function salveaza() {
      let v = valoareCamp('camp:nume_fisier').trim();
      if (!v) return 'fara_efect';
      /* „Save your changes…” pe un document deja salvat: în folderul lui (AC-5); altfel folderul ferestrei (referința) */
      const folder = dialog && dialog.baza === INTREBARE_INCHIDERE && M.salvat && M.folder ? M.folder : folderSalvare();
      const tip = (dialog && dialog.tip) || TIPURI_SALVARE[0] || 'Word Document (*.docx)';
      let r = 'salvare';
      if (/\(\*\.pdf\)/.test(tip)) {
        /* Save as type „PDF (*.pdf)”: o copie PDF; documentul deschis rămâne cel de lucru, nesalvat
           (scenarii_real/word-salvare-pdf.json: fisiere_salvate ["Orar.pdf"], nume_fisier null) */
        scrieFisier(v.replace(/\.(docx?|pdf)$/i, '') + '.pdf', folder, tip);
        r = 'salvare_pdf';
      } else if (tip === TIPURI_SALVARE[0] || !TIPURI_SALVARE.length) {
        if (!/\.[a-z0-9]{2,5}$/i.test(v)) v += '.docx';
        M.nume = v;
        M.salvat = true;
        M.folder = folder;
        M.modificat = false;
        scrieFisier(v, folder, tip);
      } else {
        /* celelalte 15 tipuri ale listei: efectul lor nu e dovedit în referință (doar .docx și PDF) → mesajul central (R12) */
        return I.nesimulat(tip);
      }
      inchideDialog();
      if (backstage) inchideBackstage();
      /* bara de titlu arată numele imediat, pe orice drum (Enter / Save; F12 / Ctrl+S) — critic runda 2, GRAV N1 */
      actualizeazaPanglica();
      return r;
    }
    /* Ctrl+S pe un document deja salvat: același fișier, fără ferestre (support.microsoft.com/en-us/office/keyboard-
       shortcuts-in-word-95ef89dd-7142-4b50-afb2-f762f663ceb2: „Save the document. | Ctrl+S”); textul nou ajunge în fișier */
    function salveazaPeLoc() {
      scrieFisier(M.nume, M.folder || folderSalvare(), tipDupaNume(M.nume) || TIPURI_SALVARE[0] || null);
      M.modificat = false;
      return 'salvare';
    }
    /* Save As › „Save as type:” — rândul ales se vede în casetă (acoperire_r3.fapte.e_dupa_pdf.save_as_type_arata:
       „PDF (*.pdf)”; critic runda 3, GRAV A1) */
    function alegeTip(cb, tip) {
      if (!dialog) return 'fara_efect';
      dialog.tip = tip;
      const inp = cb.querySelector('input');
      if (inp) inp.value = tip;
      cb.querySelectorAll('[data-lh-tip="Text"]').forEach(x => { const sp = x.querySelector('.lh-ap-text') || x; sp.textContent = tip; });
      return 'tip_fisier';
    }
    /* valoarea casetei Save as type a unei ferestre, din referință (dialog.FileSaveAs / dialog.save_this_file: „Word
       Document (*.docx)”) */
    function tipCaseta(baza) {
      let v = null;
      (function u(n) { if (!n || v) return; if (n.t === 'ComboBox' && /^Save as type/.test(n.e || '')) { v = n.v || null; return; } (n.c || []).forEach(u); })(SUP[baza]);
      return v;
    }
    /* butoanele de pe rândul de JOS al ferestrei, de la stânga la dreapta (descrierea scenariilor word-ctrl-w-*) */
    function butoaneJos(baza) {
      const b = [];
      (function u(n, inTitlu) { if (!n) return; if (n.t === 'Button' && !inTitlu && n.r) b.push(n); (n.c || []).forEach(c => u(c, inTitlu || n.t === 'TitleBar')); })(SUP[baza], false);
      if (!b.length) return [];
      const jos = Math.max(...b.map(n => n.r[1] + n.r[3]));
      return b.filter(n => n.r[1] + n.r[3] >= jos - 10).sort((x, y) => x.r[0] - y.r[0]).map(n => n.e);
    }
    /* ce ARATĂ acum caseta Save as type (fereastra deschisă) sau ce arăta când s-a închis */
    function tipAfisatAcum() {
      const x = dialog && dialog.el && dialog.el.querySelector('[data-lh-tinta="camp:tip_fisier"] input');
      return x ? x.value : M.tipAfisat;
    }
    function titluFereastra() {
      if (M.inchisApp) return null;
      if (!M.deschis) return 'Word';
      return (M.salvat ? M.nume.replace(/\.docx$/i, '') : M.nume) + '  -  Word';
    }

    /* ---- lista deschisă a unei casete, desenată din referință (uia_word.json › lista.<…>): rândurile, ordinea și mărimea
       lor. Colțul din stânga sus = sub casetă: lista.FontSize [232,115] sub caseta Font Size [232,91,43,24]; lista
       Save as type [134,430] sub caseta [134,407,815,22] a aceleiași capturi (dialog.FileSaveAs_pdf), deci +1 px. Rândul ales
       cu tastatura poartă clasa lh-ap-ales. Al doilea clic pe aceeași casetă închide lista. */
    let inchisLa = null;
    function listaRef(cheie, caseta, alege, dy, curent) {
      if (inchisLa && inchisLa.anc === caseta && Date.now() - inchisLa.t < 400) { inchisLa = null; return 'inchidere_meniu'; }
      inchisLa = null;
      inchideMeniu();
      const s = desen(cheie);
      if (!s) return I.nesimulat((caseta.getAttribute('data-lh-eticheta') || '') + ' ▾');
      const R = root.getBoundingClientRect(), r = caseta.getBoundingClientRect();
      s.classList.add('lh-ap-lista-ref');
      /* rolul după tipul real al ferestrei-listă: Menu (Font Size) / List (Save as type) */
      if (!s.getAttribute('role')) s.setAttribute('role', SUP[cheie].t === 'Menu' ? 'menu' : 'listbox');
      s.style.position = 'absolute';
      s.style.left = Math.max(0, r.left - R.left) + 'px';
      s.style.top = (r.bottom - R.top + (dy || 0)) + 'px';
      const randuri = [...s.querySelectorAll('[data-lh-tip="ListItem"]')];
      randuri.forEach(x => { x.__fa = () => alege(x.getAttribute('data-lh-eticheta')); });
      s.__randuri = randuri;
      s.__anc = caseta;
      root.appendChild(s);
      meniu = s;
      marcheaza(randuri.findIndex(x => x.getAttribute('data-lh-eticheta') === String(curent)));
      return null;
    }
    function marcheaza(k) {
      if (!meniu || !meniu.__randuri) return;
      meniu.__randuri.forEach((x, i) => x.classList.toggle('lh-ap-ales', i === k));
      meniu.__ales = k;
    }
    /* tastele pe o listă deschisă (support.microsoft.com/en-us/office/keyboard-shortcuts-in-word-95ef89dd-7142-4b50-afb2-
       f762f663ceb2: „When a menu or submenu is open, move to the next command. | Down arrow key”; „Activate the selected
       button. | Spacebar or Enter”; „Cancel a command. | Esc”) — critic runda 3, GRAV 3, unghiul gest_tastatura */
    function tastaLista(e) {
      if (!meniu || !meniu.__randuri) return null;
      const n = meniu.__randuri.length, k = meniu.__ales == null ? -1 : meniu.__ales;
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !e.altKey) {
        e.preventDefault();
        marcheaza(e.key === 'ArrowDown' ? Math.min(n - 1, k + 1) : Math.max(0, k - 1));
        return 'mutare_in_lista';
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const x = meniu.__randuri[k];
        if (!x) { inchideMeniu(); return 'inchidere_meniu'; }
        const r = x.__fa();
        inchideMeniu();
        return r;
      }
      if (e.key === 'Escape') { e.preventDefault(); inchideMeniu(); return 'inchidere_meniu'; }
      return null;
    }
    function listaTip(cb) {
      const i = cb.querySelector('input');
      return listaRef('lista.FileSaveAs_tip', cb, tip => alegeTip(cb, tip), 1, i ? i.value : (dialog && dialog.tip));
    }
    /* lista Font Size: rândul ales = mărimea pe selecție (scenarii_real/word-font-size-lista.json: „20” → „are” 20) */
    function listaMarimi(cb) {
      const i = cb.querySelector('input');
      return listaRef('lista.FontSize', cb, v => marimeLa(Number(v)), 0, i ? i.value : null);
    }
