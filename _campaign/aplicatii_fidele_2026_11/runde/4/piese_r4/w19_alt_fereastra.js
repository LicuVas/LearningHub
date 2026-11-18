    /* ---- tastele de acces ale ferestrelor (Alt + litera): din referință (tasta_acces) — „Save your changes…”: Save „ALT+S”,
       Don't Save „ALT+n”; „Save this file”: Save „ALT+S”; Save As: File name „ALT+n”, Save as type „ALT+t”, Save „Alt+s”.
       Butonul se apasă (ca la clic), caseta primește focusul. Un eveniment tasta_acces (§4) cu ținta comenzii. Unghiul
       gest_tastatura, runda 4. */
    root.addEventListener('keydown', e => {
      if (!dialog || !dialog.el || !e.altKey || e.ctrlKey || e.metaKey || !/^Key[A-Z]$/.test(e.code || '')) return;
      const re = new RegExp('^alt\\+' + e.code.slice(3) + '$', 'i');
      const cand = [...dialog.el.querySelectorAll('*')].filter(x => x.__nod && re.test(x.__nod.ta || '') && L._vizibil(x));
      const x = cand.find(c => c.__nod.t === 'Button') || cand.find(c => c.__nod.t === 'ComboBox' || c.__nod.t === 'Edit');
      if (!x) return;
      e.preventDefault();
      e.stopPropagation();
      const ina = I.stare();
      let act, t;
      if (x.__nod.t === 'Button') {
        t = L._canon(x);
        act = I.la.clic(t, { target: x, clientX: 0, clientY: 0, shiftKey: false, ctrlKey: false, metaKey: false, altKey: false, button: 0, preventDefault() {} }, 1);
        actualizeaza();
      } else {
        const i = x.querySelector('input');
        const tx = (i || x).closest('[data-lh-tinta]');
        t = tx ? L._canon(tx) : 'fereastra_app:word';
        if (i) { try { i.focus({ preventScroll: true }); i.select(); } catch (z) { /* */ } }
        act = 'focus_camp';
      }
      I.emite('tasta_acces', act || 'tasta_acces', t, ina);
    }, true);
