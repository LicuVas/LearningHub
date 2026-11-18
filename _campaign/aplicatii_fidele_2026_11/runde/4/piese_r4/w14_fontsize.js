      FontSize: elx => {
        const c = elx.querySelector('input');
        /* săgeata ▾ (Button „Open” al casetei în referință) → lista mărimilor din referință (uia_word.json › lista.FontSize:
           8 … 72, 16 rânduri; scenarii_real/word-font-size-lista.json) — critic runda 3, GRAV 3 */
        if (!c) return listaMarimi(elx.closest('[data-lh-id-mso="FontSize"]') || elx) || 'lista_marimi';
        if (document.activeElement !== c) try { c.focus({ preventScroll: true }); } catch (x) { /* */ }
        return 'camp';
      },
