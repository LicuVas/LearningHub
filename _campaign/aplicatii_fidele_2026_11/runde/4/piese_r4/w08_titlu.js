      /* butonul titlului: „<document>  -  Word”; fără document „Word” (scenarii_real/word-ctrl-w-nu-salva.json ›
         titlu_fereastra) — eticheta declarată = textul de pe ecran (§3) */
      if (BTN_TITLU) {
        const nume = titluFereastra() || '';
        BTN_TITLU.setAttribute('data-lh-eticheta', nume);
        const sp = BTN_TITLU.querySelector('.lh-ap-text');
        if (sp) sp.textContent = nume;
      }
