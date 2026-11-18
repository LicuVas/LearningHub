    /* în ferestre (dialog / Backstage), un SplitButton cu loc de text (≥ 50 px rămași după copii) își scrie numele: firimitura
       „Documente” din bara de adrese, antetele coloanelor „Nume”, „Data modificării”… (uia_word.json › dialog.FileSaveAs);
       copiii lui (filtrul, săgeata) sunt doar săgeată. „Detalii” (54 − 16 px) și „Toate locațiile” (34 px) rămân pictograme.
       Critic runda 3, GRAV A2 */
    const splitCuText = t === 'SplitButton' && (ctx.fel === 'dialog' || ctx.fel === 'backstage' || ctx.fel === 'alta') && !!n.e &&
      !/^\[/.test(n.e) && r[2] - (n.c || []).reduce((s, c) => s + ((c.r || [0, 0, 0])[2] || 0), 0) >= 50;
    if (splitCuText) html = '<span class="lh-ap-text">' + esc(n.e) + '</span>';
