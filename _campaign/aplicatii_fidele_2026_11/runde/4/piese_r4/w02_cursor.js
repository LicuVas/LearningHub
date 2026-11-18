    /* fără cursor / selecție în conținut: cursorul la capătul documentului, ca rulatorul real (referinte/ruleaza_real.py:
       „d.Range(d.Content.End - 1, d.Content.End - 1).Select()”; scenarii_real/word-x-nesalvat-cancel.json: „ azi” ajunge
       la capăt → „Ana are mere azi”) */
    if (!M.cel && !(c.selectie && typeof c.selectie.de_la === 'number') && typeof c.cursor !== 'number') {
      const capat = maxCaret();
      M.sel = { a: capat, f: capat };
    }
