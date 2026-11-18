      tinta(n, ctx) {
        if (ctx.cheie === 'dialog.FileSaveAs' || ctx.cheie === 'dialog.PictureInsertFromFile' || ctx.cheie === SALVARE_NOUA || ctx.cheie === INTREBARE_INCHIDERE) {
          if (n.t === 'Edit' && /^File name:?$/.test(n.e)) return 'camp:nume_fisier';
          if (n.t === 'ComboBox' && /^File name:?$/.test(n.e)) return null;
          /* caseta Save as type = camp:tip_fisier (api_biblioteca.md §3; scenariul word-salvare-pdf, pasul 2) */
          if (n.t === 'ComboBox' && /^Save as type:?$/.test(n.e)) return 'camp:tip_fisier';
          if ((ctx.cheie === 'dialog.FileSaveAs' || ctx.cheie === SALVARE_NOUA) && n.t === 'Button' && /^(Save|Cancel)$/.test(n.e)) return 'dialog_salvare:' + n.e;
        }
        /* rândurile unei liste deschise (uia_word.json › lista.*) = meniu:<rând> (§3) */
        if (/^lista\./.test(ctx.cheie || '')) return n.t === 'ListItem' && n.e ? 'meniu:' + n.e : null;
        return undefined;
      },
      /* ferestrele Office (NUIDialog): bara de titlu fără text (scenariile: dialog.titlu = ""); textul mare = numele
         ferestrei interioare (în UI Automation nu e nod Text, deci locul lui e al nostru — diferente.md D25) */
      la(n, e, ctx) {
        if (OFFICE_NUI.indexOf(ctx.cheie) < 0) return;
        if (n.t === 'TitleBar') e.querySelectorAll('.lh-ap-titlu-dialog').forEach(x => x.remove());
        if (n.t === 'Window' && ctx.adancime === 2 && n.e) {
          const q = document.createElement('div');
          q.className = 'lh-ap-office-titlu';
          q.setAttribute('data-lh-dialog-intrebare', '');
          q.textContent = n.e;
          e.appendChild(q);
        }
      },
