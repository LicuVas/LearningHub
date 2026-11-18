      /* panoul din stânga al ferestrei Save As: elementele IMPLICITE Windows 11 din referință (uia_word.json ›
         lista.FileSaveAs_navigare; cele 19 personale au fost scoase). În captură erau în afara ecranului, deci locul
         rândurilor (unul sub altul, la 24 px) e al nostru — AC-6. Critic runda 3, GRAV A2 */
      const arb = dialog.baza === 'dialog.FileSaveAs' && s.querySelector('[data-lh-tip="Tree"][data-lh-eticheta="Panou de navigare"]');
      if (arb && SUP['lista.FileSaveAs_navigare']) {
        (SUP['lista.FileSaveAs_navigare'].c || []).filter(n => n.t === 'TreeItem' && n.e).forEach((n, k) => {
          const x = el('div', 'lh-ap-n lh-ap-t-TreeItem lh-ap-nav-rand', { 'data-lh-tip': 'TreeItem', 'data-lh-eticheta': n.e, role: 'treeitem',
            'data-lh-tinta': 'arbore:' + n.e });
          x.style.left = '4px'; x.style.top = (6 + 24 * k) + 'px'; x.style.width = '200px'; x.style.height = '22px';
          x.innerHTML = '<span class="lh-ap-text">' + esc(n.e) + '</span>';
          arb.appendChild(x);
        });
      }
