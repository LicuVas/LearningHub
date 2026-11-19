# -*- coding: utf-8 -*-
r"""Reparațiile rundei 5 (cele 7 GRAV ale criticului 4: T6, N4+T4, T5, T1, T2, T3) în aplicatii/word.js — înlocuiri exacte.
    python .../runde/5/repara_r5.py <dosarul aplicatii>   (implicit: worktree-ul)
Fiecare bucată veche trebuie să apară EXACT o dată; altfel nu se scrie nimic (cod 1).
"""
import sys

DOSAR = sys.argv[1] if len(sys.argv) > 1 else "C:/00/Projects/LearningHub_fidel/aplicatii"
CALE = DOSAR + "/word.js"

R = []

# ---- T6: Enter pe rândul unei liste deschise = activat (api §4, §6.3)
R.append((r"""        if (!x) { inchideMeniu(); return 'inchidere_meniu'; }
        const r = x.__fa();""", r"""        if (!x) { inchideMeniu(); return 'inchidere_meniu'; }
        /* Enter apasă rândul marcat, deși focusul rămâne în casetă: evenimentul poartă `activat` = ținta rândului, ca
           asistentul să vadă același pas ca la clic (api_biblioteca.md §4 „activat”, §6.3) — critic runda 4, GRAV T6 */
        try { I.activat = L._canon(x) || null; } catch (z) { I.activat = null; }
        const r = x.__fa();"""))

# ---- T1: F12 pe un document salvat propune numele fișierului
R.append((r"""        let propus = prim ? prim.replace(/[\\/:*?"<>|]/g, '').slice(0, 60) : faraExt(M.nume);""",
          r"""        /* document deja salvat: numele fișierului (Word real, COM — runde/4/critic.md:104: după SaveAs2 dă „numele
           fișierului. După o modificare dă tot numele fișierului”); document nou: primul rând (word-salvare-ca-f12.json).
           Critic runda 4, GRAV T1 */
        let propus = M.salvat ? faraExt(M.nume) : prim ? prim.replace(/[\\/:*?"<>|]/g, '').slice(0, 60) : faraExt(M.nume);"""))

# ---- folderul ferestrei (Save As / Open) = bara de adrese din referință; dialog.desen = suprafața desenată
R.append((r"""      dialog = { baza, strat: strat2, fila: null };""",
          r"""      dialog = { baza, strat: strat2, fila: null, desen: baza, folder: folderAdresa(baza === 'dialog.open' ? 'dialog.open' : 'dialog.FileSaveAs') };"""))
R.append((r"""    function folderSalvare() {
      let f = null;
      (function cauta(n) { if (!n || f) return; const m = /^Adres[ăa]: (.+)$/.exec(n.e || ''); if (m) { f = m[1]; return; } (n.c || []).forEach(cauta); })(SUP['dialog.FileSaveAs']);
      return f || 'Documente';
    }""", r"""    function folderAdresa(cheie) {
      let f = null;
      (function cauta(n) { if (!n || f) return; const m = /^Adres[ăa]: (.+)$/.exec(n.e || ''); if (m) { f = m[1]; return; } (n.c || []).forEach(cauta); })(SUP[cheie]);
      return f || 'Documente';
    }
    function folderSalvare() { return folderAdresa('dialog.FileSaveAs'); }"""))

# ---- T3: suprafața desenată (PDF = dialog.FileSaveAs_pdf)
R.append((r"""      const k = (info.file.find(f => f.fila === fila) || info.file[0]).s;""",
          r"""      /* Save As cu „PDF (*.pdf)” ales = altă fereastră în referință (uia_word.json › dialog.FileSaveAs_pdf: Optimize for,
         Options..., Open file after publishing; fără Save Thumbnail) — critic runda 4, GRAV T3 */
      const k = dialog.desen && dialog.desen !== dialog.baza && SUP[dialog.desen] ? dialog.desen : (info.file.find(f => f.fila === fila) || info.file[0]).s;"""))
R.append((r"""      s.setAttribute('data-lh-suprafata', dialog.cheiePlasa || dialog.baza);""",
          r"""      s.setAttribute('data-lh-suprafata', dialog.cheiePlasa || (k === 'dialog.FileSaveAs_pdf' ? k : dialog.baza));"""))

# ---- N4: panoul din stânga (Save As și Open) + folderele din conținut; lista ferestrei Open
R.append((r"""      const arb = dialog.baza === 'dialog.FileSaveAs' && s.querySelector('[data-lh-tip="Tree"][data-lh-eticheta="Panou de navigare"]');
      if (arb && SUP['lista.FileSaveAs_navigare']) {
        (SUP['lista.FileSaveAs_navigare'].c || []).filter(n => n.t === 'TreeItem' && n.e).forEach((n, k) => {
          const x = el('div', 'lh-ap-n lh-ap-t-TreeItem lh-ap-nav-rand', { 'data-lh-tip': 'TreeItem', 'data-lh-eticheta': n.e, role: 'treeitem',
            'data-lh-tinta': 'arbore:' + n.e });
          x.style.left = '4px'; x.style.top = (6 + 24 * k) + 'px'; x.style.width = '200px'; x.style.height = '22px';
          x.innerHTML = '<span class="lh-ap-text">' + esc(n.e) + '</span>';
          arb.appendChild(x);
        });
      }""", r"""      const arb = (dialog.baza === 'dialog.FileSaveAs' || dialog.baza === 'dialog.open') && s.querySelector('[data-lh-tip="Tree"][data-lh-eticheta="Panou de navigare"]');
      if (arb && SUP['lista.FileSaveAs_navigare']) {
        /* + câte un rând pentru fiecare folder din CONȚINUT (fișierele lecției și folderul ferestrei), în ordinea numelor
           implicite Windows 11 din referinte/acoperire_word_r3.py:57 (NAV_IMPLICIT: Acasă, Galerie, Desktop, Descărcări,
           Documente, …, Acest PC, Rețea); locul rândurilor nu e în referință — de_verificat.md R5-1. Fereastra Open are
           același panou Windows (dialog.open › Tree „Panou de navigare”). Critic runda 4, GRAV N4 */
        const impl = (SUP['lista.FileSaveAs_navigare'].c || []).filter(n => n.t === 'TreeItem' && n.e).map(n => n.e);
        const ORD = ['Acasă', 'Galerie', 'Desktop', 'Descărcări', 'Documente', 'Imagini', 'Muzică', 'Videoclipuri', 'Acest PC', 'Rețea'];
        const poz = x => { const i = ORD.indexOf(x); return i < 0 ? 7.5 : i; };
        const fold = [...new Set(M.fs.map(f => f.folder).concat([dialog.folder]).filter(x => x && impl.indexOf(x) < 0))];
        const tot = impl.concat(fold).sort((a, b) => poz(a) - poz(b) || a.localeCompare(b));
        const lat = Math.max(60, Math.min(200, arb.getBoundingClientRect().width - 24));
        tot.forEach((nume, i) => {
          const x = el('div', 'lh-ap-n lh-ap-t-TreeItem lh-ap-nav-rand', { 'data-lh-tip': 'TreeItem', 'data-lh-eticheta': nume, role: 'treeitem',
            'data-lh-tinta': 'arbore:' + nume });
          if (fold.indexOf(nume) >= 0) x.__folder = nume;
          x.style.left = '4px'; x.style.top = (6 + 24 * i) + 'px'; x.style.width = lat + 'px'; x.style.height = '22px';
          x.innerHTML = '<span class="lh-ap-text">' + esc(nume) + '</span>';
          arb.appendChild(x);
        });
      }
      umpleFolder(s);"""))
R.append((r"""        if (dialog.propus != null) nf.value = dialog.propus;
        setTimeout(() => { try { nf.focus({ preventScroll: true }); nf.select(); } catch (e) { /* */ } }, 0);""",
          r"""        if (dialog.numeAcum != null) nf.value = dialog.numeAcum;
        else if (dialog.propus != null) nf.value = dialog.propus;
        const ti = dialog.focusTip && s.querySelector('[data-lh-tinta="camp:tip_fisier"] input');
        /* redesenată după alegerea tipului (T3): focusul rămâne în caseta Save as type, ca Enter să fie tot Save */
        if (ti) { try { ti.focus({ preventScroll: true }); } catch (e) { /* */ } }
        else setTimeout(() => { try { nf.focus({ preventScroll: true }); nf.select(); } catch (e) { /* */ } }, 0);"""))

# ---- Enter / butonul implicit al ferestrei Open
R.append((r"""      if (dialog.baza === 'dialog.FileSaveAs' || dialog.baza === SALVARE_NOUA) return salveaza();
      /* Enter în „Save your changes…”""", r"""      if (dialog.baza === 'dialog.FileSaveAs' || dialog.baza === SALVARE_NOUA) return salveaza();
      if (dialog.baza === 'dialog.open') return deschideDinOpen(valoareCamp('camp:nume_fisier'));
      /* Enter în „Save your changes…”"""))
R.append((r"""        dialog.baza === INTREBARE_INCHIDERE ? 'fereastra:Save' : null;""",
          r"""        dialog.baza === INTREBARE_INCHIDERE ? 'fereastra:Save' : dialog.baza === 'dialog.open' ? 'fereastra:Open' : null;"""))

# ---- T2: nume existent → mesajul central, fișierul neatins; folderul = cel ales în fereastră
R.append((r"""      const folder = dialog && dialog.baza === INTREBARE_INCHIDERE && M.salvat && M.folder ? M.folder : folderSalvare();""",
          r"""      const folder = dialog && dialog.baza === INTREBARE_INCHIDERE && M.salvat && M.folder ? M.folder : (dialog && dialog.folder) || folderSalvare();"""))
R.append((r"""      if (/\(\*\.pdf\)/.test(tip)) {
        /* Save as type „PDF (*.pdf)”: o copie PDF; documentul deschis rămâne cel de lucru, nesalvat
           (scenarii_real/word-salvare-pdf.json: fisiere_salvate ["Orar.pdf"], nume_fisier null) */
        scrieFisier(v.replace(/\.(docx?|pdf)$/i, '') + '.pdf', folder, tip);
        r = 'salvare_pdf';
      } else if (tip === TIPURI_SALVARE[0] || !TIPURI_SALVARE.length) {
        if (!/\.[a-z0-9]{2,5}$/i.test(v)) v += '.docx';
        M.nume = v;""", r"""      /* un fișier cu același nume există deja în folder: Word întreabă („The file … already exists”, lecția m1-l03:157-159);
         fereastra întrebării NU e în referință → mesajul central, fișierul NU se atinge, fereastra de salvare rămâne
         deschisă (de_verificat.md R5-3). Excepție: „Save your changes…” pe documentul salvat = același fișier (AC-5).
         Critic runda 4, GRAV T2 */
      const exista = n => !!gasesteFisier(n, folder) && !(dialog && dialog.baza === INTREBARE_INCHIDERE && M.salvat &&
        n.toLowerCase() === String(M.nume).toLowerCase() && folder === M.folder);
      if (/\(\*\.pdf\)/.test(tip)) {
        /* Save as type „PDF (*.pdf)”: o copie PDF; documentul deschis rămâne cel de lucru, nesalvat
           (scenarii_real/word-salvare-pdf.json: fisiere_salvate ["Orar.pdf"], nume_fisier null) */
        const np = v.replace(/\.(docx?|pdf)$/i, '') + '.pdf';
        if (exista(np)) return I.nesimulat(np + ' already exists');
        scrieFisier(np, folder, tip);
        r = 'salvare_pdf';
      } else if (tip === TIPURI_SALVARE[0] || !TIPURI_SALVARE.length) {
        if (!/\.[a-z0-9]{2,5}$/i.test(v)) v += '.docx';
        if (exista(v)) return I.nesimulat(v + ' already exists');
        M.nume = v;"""))

# ---- T3: alegerea tipului redesenează fereastra (PDF ↔ docx)
R.append((r"""    function alegeTip(cb, tip) {
      if (!dialog) return 'fara_efect';
      dialog.tip = tip;""", r"""    function alegeTip(cb, tip) {
      if (!dialog) return 'fara_efect';
      dialog.tip = tip;
      /* PDF ↔ celelalte tipuri: fereastra se redesenează din referința ei (dialog.FileSaveAs_pdf / dialog.FileSaveAs), cu
         numele scris și folderul păstrate — critic runda 4, GRAV T3 */
      const vrut = dialog.baza === 'dialog.FileSaveAs' && /\(\*\.pdf\)/.test(tip) && SUP['dialog.FileSaveAs_pdf'] ? 'dialog.FileSaveAs_pdf' : dialog.baza;
      if (dialog.baza === 'dialog.FileSaveAs' && vrut !== dialog.desen) {
        dialog.numeAcum = valoareCamp('camp:nume_fisier');
        dialog.desen = vrut;
        dialog.focusTip = true;
        arataFilaDialog(dialog.fila);
        dialog.focusTip = false;
        cb = dialog.el.querySelector('[data-lh-tinta="camp:tip_fisier"]') || cb;
      }"""))

# ---- țintele / câmpurile editabile ale ferestrelor noi desenate (Open, Save As PDF)
R.append((r"""        if (ctx.cheie === 'dialog.FileSaveAs' || ctx.cheie === 'dialog.PictureInsertFromFile' || ctx.cheie === SALVARE_NOUA || ctx.cheie === INTREBARE_INCHIDERE) {
          if (n.t === 'Edit' && /^File name:?$/.test(n.e)) return 'camp:nume_fisier';""",
          r"""        if (ctx.cheie === 'dialog.FileSaveAs' || ctx.cheie === 'dialog.FileSaveAs_pdf' || ctx.cheie === 'dialog.open' || ctx.cheie === 'dialog.PictureInsertFromFile' || ctx.cheie === SALVARE_NOUA || ctx.cheie === INTREBARE_INCHIDERE) {
          if (n.t === 'Edit' && /^File name:?$/.test(n.e)) return 'camp:nume_fisier';"""))
R.append((r"""          if ((ctx.cheie === 'dialog.FileSaveAs' || ctx.cheie === SALVARE_NOUA) && n.t === 'Button'""",
          r"""          if ((ctx.cheie === 'dialog.FileSaveAs' || ctx.cheie === 'dialog.FileSaveAs_pdf' || ctx.cheie === SALVARE_NOUA) && n.t === 'Button'"""))
R.append((r"""        if ((ctx.cheie === 'dialog.FileSaveAs' || ctx.cheie === 'dialog.PictureInsertFromFile' || ctx.cheie === SALVARE_NOUA || ctx.cheie === INTREBARE_INCHIDERE) && n.t === 'Edit' && /^File name/.test(n.e)) return true;""",
          r"""        if ((ctx.cheie === 'dialog.FileSaveAs' || ctx.cheie === 'dialog.FileSaveAs_pdf' || ctx.cheie === 'dialog.open' || ctx.cheie === 'dialog.PictureInsertFromFile' || ctx.cheie === SALVARE_NOUA || ctx.cheie === INTREBARE_INCHIDERE) && n.t === 'Edit' && /^File name/.test(n.e)) return true;"""))

# ---- funcțiile noi: fereastra Open, navigarea, documentul nou, bifele zonei PDF
R.append((r"""    /* File › Open › Recent: rândurile = lista Recent din conținut (+ documentele salvate); forma rândului din""",
          r"""    /* fereastra Open: numele ales sau scris, din folderul ferestrei; fișierul se deschide ca din Recent. Un PDF (Files of
       type le arată și pe ele) și un nume negăsit n-au efect dovedit în referință → mesajul central. Critic runda 4, N4 */
    function deschideDinOpen(v) {
      v = String(v || '').trim().replace(/^"|"$/g, '');
      if (!v || !dialog) return 'fara_efect';
      const c = M.fs.filter(x => x.folder === dialog.folder && (x.nume.toLowerCase() === v.toLowerCase() || faraExt(x.nume).toLowerCase() === v.toLowerCase()));
      const f = c.find(x => !/\.pdf$/i.test(x.nume)) || c[0];
      if (!f || /\.pdf$/i.test(f.nume)) return I.nesimulat(f ? f.nume : v);
      inchideDialog();
      return deschideFisier({ nume: f.nume, folder: f.folder });
    }
    function alegeRandOpen(x) {
      dialog.el.querySelectorAll('[data-lh-tinta^="lista:"]').forEach(r => r.toggleAttribute('data-lh-selectat', r === x));
      const nf = dialog.el.querySelector('[data-lh-tinta="camp:nume_fisier"] input');
      if (nf) nf.value = faraExt(x.__fisier.nume);
    }
    function navigheaza(folder) {
      dialog.folder = folder;
      umpleFolder(dialog.el);
      return 'navigare';
    }
    /* bara de adrese și lista ferestrei = folderul curent (dialog.folder); în Open, rândurile listei = fișierele lui din
       CONȚINUT (uia_word.json › dialog.open › List „Vizualizare elemente”: 8 ListItem, texte redactate); pe ecran numele
       fără extensie, ca la Recent (AC-7); ținta lista:<nume.ext> (api §3). Critic runda 4, GRAV N4 */
    function umpleFolder(s) {
      if (!dialog || !(dialog.baza === 'dialog.FileSaveAs' || dialog.baza === 'dialog.open')) return;
      const f0 = folderAdresa(dialog.baza === 'dialog.open' ? 'dialog.open' : 'dialog.FileSaveAs');
      const adr = [...s.querySelectorAll('[data-lh-tip="SplitButton"]')].find(x => x.getAttribute('data-lh-eticheta') === f0 && x.closest('[data-lh-eticheta^="Adres"]'));
      if (adr && dialog.folder !== f0) {
        adr.closest('[data-lh-eticheta^="Adres"]').setAttribute('data-lh-eticheta', 'Adresă: ' + dialog.folder);
        adr.setAttribute('data-lh-eticheta', dialog.folder);
        if (adr.hasAttribute('data-lh-tinta')) adr.setAttribute('data-lh-tinta', 'fereastra:' + dialog.folder);
        const t = adr.querySelector('.lh-ap-text');
        if (t) t.textContent = dialog.folder;
      }
      s.querySelectorAll('.lh-ap-nav-rand').forEach(x => x.toggleAttribute('data-lh-selectat', x.getAttribute('data-lh-eticheta') === dialog.folder));
      if (dialog.baza !== 'dialog.open') return;
      const fis = M.fs.filter(f => f.folder === dialog.folder).sort((a, b) => a.nume.localeCompare(b.nume));
      const randuri = s.__randuriOpen || (s.__randuriOpen = [...s.querySelectorAll('[data-lh-tip="List"][data-lh-eticheta="Vizualizare elemente"] [data-lh-tip="ListItem"]')]);
      randuri.forEach((x, k) => {
        const f = fis[k];
        x.__fisier = f || null;
        x.removeAttribute('data-lh-selectat');
        if (!f) { x.style.display = 'none'; return; }
        x.style.display = '';
        x.setAttribute('data-lh-eticheta', faraExt(f.nume));
        x.setAttribute('data-lh-tinta', 'lista:' + f.nume);
        x.innerHTML = '<span class="lh-ap-text">' + esc(faraExt(f.nume)) + '</span>';
      });
    }
    /* Ctrl+N / File › Blank document: un document nou, gol; cel deschis rămâne în fereastra lui (documente_deschise crește).
       support.microsoft.com/en-us/office/keyboard-shortcuts-in-word-95ef89dd-7142-4b50-afb2-f762f663ceb2: „Create a new
       document. | Ctrl+N”; lecția m1-l03:116. Numele „Document1”: numerotarea nu e în referință (de_verificat R5-2).
       Critic runda 4, GRAV T5 */
    function documentNou() {
      if (M.inchisApp) return 'fara_efect';
      if (M.deschis) M.altele.push(instantaneuDoc());
      incarcaDoc({ P: [parIn('')], nume: 'Document1', salvat: false, modificat: false });
      return 'document_nou';
    }
    /* zona PDF (uia_word.json › dialog.FileSaveAs_pdf): bifa „Open file after publishing” (fapte.e_dupa_pdf.bife = 0) și
       butoanele radio „Optimize for:” își schimbă starea ca orice CheckBox / RadioButton — critic runda 4, GRAV T3 */
    function comutaCaseta(x, tn) {
      const pune = (y, on) => {
        y.setAttribute('aria-checked', on ? 'true' : 'false');
        const c = y.querySelector('.lh-ap-caseta');
        if (c) c.innerHTML = on ? pang.glif(tn === 'RadioButton' ? 'punct' : 'bifa', 12) : '';
      };
      if (tn === 'CheckBox') { const on = x.getAttribute('aria-checked') !== 'true'; pune(x, on); return on ? 'bifare' : 'debifare'; }
      (x.closest('[data-lh-tip="Group"]') || dialog.el).querySelectorAll('[data-lh-tip="RadioButton"]').forEach(y => pune(y, y === x));
      return 'alegere_optiune';
    }
    const numeTasta = e => (e.ctrlKey ? 'Ctrl+' : '') + (e.altKey ? 'Alt+' : '') + (e.shiftKey ? 'Shift+' : '') + (String(e.key || '').length === 1 ? String(e.key).toUpperCase() : e.key);
    /* File › Open › Recent: rândurile = lista Recent din conținut (+ documentele salvate); forma rândului din"""))

# ---- clicurile: Browse pe pagina Open, Blank document
R.append((r"""        if (v === 'Browse' && backstage && backstage.pagina === 'Save As') return deschideDialog('dialog.FileSaveAs') ? 'salvare_ca' : I.nesimulat(v);""",
          r"""        if (v === 'Browse' && backstage && backstage.pagina === 'Save As') return deschideDialog('dialog.FileSaveAs') ? 'salvare_ca' : I.nesimulat(v);
        /* File › Open › Browse → fereastra Windows Open (uia_word.json › dialog.open › deschis_prin: „Backstage › Open ›
           Browse deschide aceeași fereastră”) — critic runda 4, GRAV N4 */
        if (v === 'Browse' && backstage && backstage.pagina === 'Open' && !p2007) return deschideDialog('dialog.open') ? 'deschidere_fereastra_open' : I.nesimulat(v);
        /* File › Home / New › Blank document = document nou (lecția m1-l03:116; fapte.g_file_document_nou) — GRAV T5 */
        if (v === 'Blank document') { inchideBackstage(); return documentNou(); }"""))
# ---- clicurile în fereastra Open
R.append((r"""      if (fel === 'fila_dialog' && dialog) {""",
          r"""      /* fereastra Open (uia_word.json › dialog.open; Ctrl+F12 / File › Open › Browse) — critic runda 4, GRAV N4 + T4 */
      if (dialog && dialog.baza === 'dialog.open') {
        if (fel === 'lista' && elx.__fisier) { alegeRandOpen(elx); return 'selectare'; }
        if (fel === 'arbore') return elx.__folder ? navigheaza(elx.__folder) : I.nesimulat(v);
        if (fel === 'fereastra' && v === 'Open') return deschideDinOpen(valoareCamp('camp:nume_fisier'));
        if (fel === 'fereastra' && /^(Cancel|Închidere)$/.test(v)) { inchideDialog(); return 'anulare'; }
        if (fel === 'camp' && v === 'nume_fisier') return 'camp';
        if (fel === 'camp') return I.nesimulat(v + ' ▾');
        return I.nesimulat(v || tinta);
      }
      if (fel === 'fila_dialog' && dialog) {"""))
# ---- clicurile în Save As: folderele din stânga, bifele zonei PDF
R.append((r"""      /* caseta „Save as type:” (camp:tip_fisier) sau săgeata ei → lista din referință (uia_word.json › lista.FileSaveAs_tip:""",
          r"""      if (dialog && dialog.baza === 'dialog.FileSaveAs' && fel === 'arbore' && elx.__folder) return navigheaza(elx.__folder);
      if (dialog && dialog.desen === 'dialog.FileSaveAs_pdf' && fel === 'fereastra') {
        const tn = (elx.__nod || {}).t;
        if (tn === 'CheckBox' || tn === 'RadioButton') return comutaCaseta(elx, tn);
      }
      /* caseta „Save as type:” (camp:tip_fisier) sau săgeata ei → lista din referință (uia_word.json › lista.FileSaveAs_tip:"""))
# ---- T5: panglica fără document
R.append((r"""      if (fel === 'panglica' || fel === 'meniu_derulant' || fel === 'lansator' || fel === 'meniu') return M.deschis ? apasa(elx, tinta) : 'fara_efect';""",
          r"""      /* fără document, comenzile panglicii n-au pe ce lucra: mesajul central, nu tăcere (R12; critic runda 4, GRAV T5) */
      if (fel === 'panglica' || fel === 'meniu_derulant' || fel === 'lansator' || fel === 'meniu') return M.deschis ? apasa(elx, tinta) : I.nesimulat(String((elx.__nod || {}).e || v).replace(/^.*\//, '') || tinta);"""))
# ---- dublu clic pe un fișier din Open
R.append((r"""    I.la.dublu = tinta => (/^text:|^document/.test(tinta || '') ? 'selectare_cuvant' : null);""",
          r"""    I.la.dublu = tinta => {
      /* dublu clic pe un fișier din fereastra Open = Open (rândul ales + butonul implicit) */
      if (dialog && dialog.baza === 'dialog.open' && /^lista:/.test(tinta || '')) return deschideDinOpen(tinta.slice(6));
      return /^text:|^document/.test(tinta || '') ? 'selectare_cuvant' : null;
    };"""))
# ---- tastele: Ctrl+N, Ctrl+F12, Shift+F12, fără document
R.append((r"""    const NESIM_TASTE = { ctrl_f: 'Ctrl+F', ctrl_h: 'Ctrl+H', ctrl_m: 'Ctrl+M', ctrl_n: 'Ctrl+N', ctrl_o: 'Ctrl+O',""",
          r"""    const NESIM_TASTE = { ctrl_f: 'Ctrl+F', ctrl_h: 'Ctrl+H', ctrl_m: 'Ctrl+M', ctrl_o: 'Ctrl+O',"""))
R.append((r"""      if (!M.deschis && g !== 'ctrl_o') { actualizeaza(); return 'fara_efect'; }""",
          r"""      /* fără document (Ctrl+W → Don't Save): tastarea și navigarea n-au unde ajunge; Ctrl+O, Ctrl+N, Ctrl+F12 merg ca de
         obicei; celelalte comenzi dau mesajul central, nu tac (R12; critic runda 4, GRAV T5) */
      if (!M.deschis && g !== 'ctrl_o' && g !== 'ctrl_n' && !(g === 'tasta_f12' && e.ctrlKey)) {
        actualizeaza();
        if (M.inchisApp || /^(tastare|sageti|alt_sageti|tasta_(enter|backspace|delete|tab|home_end|pagina|esc|windows))$/.test(g)) return 'fara_efect';
        return I.nesimulat(numeTasta(e));
      }"""))
R.append((r"""        case 'tasta_f12': e.preventDefault(); r = deschideDialog('dialog.FileSaveAs') ? 'salvare_ca' : null; break;""",
          r"""        /* support.microsoft.com/en-us/office/keyboard-shortcuts-in-word-95ef89dd-7142-4b50-afb2-f762f663ceb2 (citit 19.11.2026):
           „Ctrl+F12: displays the Open dialog box.” (= uia_word.json › acoperire_r3.fapte.d_ctrl_f12, titlul „Open”);
           „Shift+F12: saves the document.”; „F12 alone: displays the Save As dialog box.” — critic runda 4, GRAV T4 */
        case 'tasta_f12':
          e.preventDefault();
          if (e.ctrlKey) r = M.inchisApp ? 'fara_efect' : p2007 ? I.nesimulat('Ctrl+F12') : deschideDialog('dialog.open') ? 'deschidere_fereastra_open' : I.nesimulat('Ctrl+F12');
          else if (e.shiftKey) r = M.salvat ? salveazaPeLoc() : (deschideDialog(p2007 ? 'dialog.FileSaveAs' : SALVARE_NOUA) ? 'dialog_salvare' : I.nesimulat('Shift+F12'));
          else r = deschideDialog('dialog.FileSaveAs') ? 'salvare_ca' : null;
          break;"""))
R.append((r"""        case 'ctrl_w': r = cerereInchidere('ctrlw'); break;""",
          r"""        case 'ctrl_n': r = documentNou(); break;
        case 'ctrl_w': r = cerereInchidere('ctrlw'); break;"""))
# ---- tastele de acces ale ferestrelor: și SplitButton (Open), CheckBox, RadioButton (zona PDF)
R.append((r"""      const x = cand.find(c => c.__nod.t === 'Button') || cand.find(c => c.__nod.t === 'ComboBox' || c.__nod.t === 'Edit');""",
          r"""      const APASA = ['Button', 'SplitButton', 'CheckBox', 'RadioButton'];   // T3: Alt+E/A/M/O în zona PDF; N4: Alt+O = Open
      const x = cand.find(c => APASA.indexOf(c.__nod.t) >= 0) || cand.find(c => c.__nod.t === 'ComboBox' || c.__nod.t === 'Edit');"""))
R.append((r"""      if (x.__nod.t === 'Button') {
        t = L._canon(x);""", r"""      if (APASA.indexOf(x.__nod.t) >= 0) {
        t = L._canon(x);"""))


R.append((r"""      la(n, e, ctx) {
        if (OFFICE_NUI.indexOf(ctx.cheie) < 0) return;""", r"""      la(n, e, ctx) {
        /* zona PDF: eticheta grupului „Optimize for:” stă în stânga butoanelor radio (uia_word.json › dialog.FileSaveAs_pdf ›
           Group „Optimize for:” [43,476,250,67], radiourile de la x = 159); grupurile „Rând metadate” n-au text pe ecran — GRAV T3 */
        if (ctx.cheie === 'dialog.FileSaveAs_pdf' && n.t === 'Group' && /:$/.test(n.e || '')) {
          const q = document.createElement('span');
          q.className = 'lh-ap-grup-eticheta';
          q.textContent = n.e;
          e.appendChild(q);
        }
        if (OFFICE_NUI.indexOf(ctx.cheie) < 0) return;"""))

CSS_MARCAJ = "/* runda 5 (critic 4: N4, T3) */"
CSS = CSS_MARCAJ + """
[data-lh-suprafata="dialog.open"] .lh-ap-t-SplitButton[data-lh-tinta="fereastra:Open"]{border:1px solid #adadad;background:#e1e1e1;border-radius:2px;justify-content:center}
.lh-ap-nav-rand[data-lh-selectat]{background:#cce8ff}
.lh-ap-grup-eticheta{position:absolute;left:0;top:4px;font-size:12px;white-space:nowrap;pointer-events:none}
"""


def main():
    s = open(CALE, encoding="utf-8", newline="").read()
    rau = [(i, s.count(a)) for i, (a, b) in enumerate(R) if s.count(a) != 1]
    if rau:
        print("bucăți care nu apar exact o dată (index, de câte ori):", rau)
        print(len(rau))
        return 1
    for a, b in R:
        s = s.replace(a, b)
    open(CALE, "w", encoding="utf-8", newline="").write(s)
    css = DOSAR + "/aplicatii.css"
    c = open(css, encoding="utf-8", newline="").read()
    if CSS_MARCAJ not in c:
        open(css, "w", encoding="utf-8", newline="").write(c.rstrip("\n") + "\n" + CSS)
    print("aplicate:", len(R))
    print(0)
    return 0


if __name__ == "__main__":
    sys.exit(main())
