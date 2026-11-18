/* panglica.js — MOTORUL COMUN care desenează o suprafață a unei aplicații Office (panglica unei file, rândul filelor, bara
   de titlu, bara de stare, File/Backstage, meniurile de clic dreapta, dialogurile) din datele generate din referința reală
   (date/<aplicatie>.json › suprafete). Nicio etichetă scrisă aici: tipul, numele, idMso-ul, ordinea și poziția fiecărui
   element vin din dump-ul UI Automation al aplicației reale (1366×768, 100% DPI); pozițiile se păstrează relativ la
   părinte (CONVENTIE_ARBORE.md §5: toleranța 8 px). Același motor va servi Excel și PowerPoint.
   Marcajul (CONVENTIE_ARBORE.md §2-§3): data-lh-suprafata pe rădăcina suprafeței; data-lh-tip / data-lh-eticheta /
   data-lh-id-mso pe fiecare nod; textul de pe ecran = numele real (sau valoarea, la casete); pictogramele = SVG Fluent (MIT). */
(function () {
  'use strict';
  const L = window.LH && window.LH.aplicatii;
  if (!L) return;

  const UNITATE = new Set(['Button', 'SplitButton', 'MenuItem', 'ComboBox', 'CheckBox', 'RadioButton', 'Edit', 'Spinner', 'ListItem',
    'Slider', 'TabItem', 'Hyperlink', 'Text', 'TreeItem', 'DataItem']);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* glife proprii, desenate simplu (nu sunt capturi Microsoft): săgeata listei, lansatorul grupului, butoanele ferestrei */
  const GLIFE = {
    sageata: '<path d="M5.2 7.7a.6.6 0 0 1 .85 0L10 11.6l3.95-3.9a.6.6 0 1 1 .85.85l-4.38 4.33a.6.6 0 0 1-.84 0L5.2 8.55a.6.6 0 0 1 0-.85z"/>',
    lansator: '<path d="M6 5h8.4a.6.6 0 0 1 .6.6V14h-1.2V7.05L5.83 15.03l-.85-.85L12.95 6.2H6z"/>',
    inchide: '<path d="M5.4 4.55 10 9.15l4.6-4.6.85.85-4.6 4.6 4.6 4.6-.85.85-4.6-4.6-4.6 4.6-.85-.85 4.6-4.6-4.6-4.6z"/>',
    minim: '<path d="M4 10h12v1H4z"/>',
    maxim: '<path d="M5 5h10v10H5zm1 1v8h8V6z"/>',
    cauta: '<path d="M8.5 3a5.5 5.5 0 0 1 4.38 8.82l3.65 3.65-.85.85-3.65-3.65A5.5 5.5 0 1 1 8.5 3m0 1.2a4.3 4.3 0 1 0 0 8.6 4.3 4.3 0 0 0 0-8.6"/>',
    minus: '<path d="M4 9.4h12v1.2H4z"/>',
    plus: '<path d="M9.4 4h1.2v5.4H16v1.2h-5.4V16H9.4v-5.4H4V9.4h5.4z"/>',
    ajutor: '<path d="M10 2.5a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15m0 1.2a6.3 6.3 0 1 0 0 12.6 6.3 6.3 0 0 0 0-12.6m0 9a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6m0-7a2.5 2.5 0 0 1 1.2 4.7c-.5.3-.6.5-.6.9v.4H9.4v-.4c0-.9.4-1.4 1.1-1.9a1.3 1.3 0 1 0-1.8-1.2H7.5A2.5 2.5 0 0 1 10 5.7"/>',
    sus: '<path d="M5.2 12.3a.6.6 0 0 0 .85 0L10 8.4l3.95 3.9a.6.6 0 1 0 .85-.85L10.42 7.12a.6.6 0 0 0-.84 0L5.2 11.45a.6.6 0 0 0 0 .85z"/>',
    pagina: '<path d="M6 2.5h5.5L15 6v11.5H6zm1.2 1.2v12.6h6.6V6.7h-3.1V3.7zm4.7.5v1.3h1.3z"/>',
    citire: '<path d="M2.5 4.5h6a2 2 0 0 1 1.5.7 2 2 0 0 1 1.5-.7h6v11h-6a1 1 0 0 0-1 .9h-1a1 1 0 0 0-1-.9h-6zm1.2 1.2v8.6h4.8c.3 0 .6.05.9.15V6.2a.5.5 0 0 0-.5-.5zm12.6 0h-5.2a.5.5 0 0 0-.5.5v8.65c.3-.1.6-.15.9-.15h4.8z"/>',
    web: '<path d="M10 2.5a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15m-1.7 1.4a6.3 6.3 0 0 0-4.5 5.5h2.9c.1-2.1.6-4 1.6-5.5m3.4 0c1 1.5 1.5 3.4 1.6 5.5h2.9a6.3 6.3 0 0 0-4.5-5.5M10 3.9c-1.1 1.2-1.8 3.2-1.9 5.5h3.8c-.1-2.3-.8-4.3-1.9-5.5"/>',
    bifa: '<path d="M15.6 5.6 8.2 13 4.4 9.2l-.85.85 4.65 4.65 8.25-8.25z"/>',
    punct: '<circle cx="10" cy="10" r="2.2"/>'
  };
  function svg(paths, marime, cls) {
    const m = marime || 16;
    return '<svg class="lh-ap-ico' + (cls ? ' ' + cls : '') + '" aria-hidden="true" width="' + m + '" height="' + m +
      '" viewBox="0 0 20 20" fill="currentColor" focusable="false">' + paths + '</svg>';
  }
  function glif(nume, marime) { return svg(GLIFE[nume] || GLIFE.punct, marime); }
  function icoana(I, id, marime) {
    const p = id && I.date && I.date.icoane && I.date.icoane[id];
    if (!p) return '';
    return svg(p.map(d => '<path d="' + esc(d) + '"/>').join(''), marime);
  }
  /* pictograma după NUME, când nodul n-are idMso (mini-bara, meniul de clic dreapta): idMso-ul comenzii cu același nume
     din panglica referinței (Bold -> Bold, Grow Font -> FontSizeIncreaseWord) */
  function idDupaNume(I, nume) {
    if (!I._numeId) {
      I._numeId = {};
      const umbla = n => { if (n.id && n.e && !(n.e in I._numeId) && I.date.icoane[n.id]) I._numeId[n.e] = n.id; (n.c || []).forEach(umbla); };
      Object.keys(I.date.suprafete).filter(k => /^panglica/.test(k)).forEach(k => umbla(I.date.suprafete[k]));
    }
    return I._numeId[nume] || I._numeId[String(nume || '').replace(/(\.\.\.|…)$/, '')] || null;
  }
  /* un buton fără pictogramă Fluent: săgeată după nume (derulare, navigare) sau un pătrățel neutru — niciodată text */
  function faraIcoana(n, marime) {
    const e = String(n.e || '');
    const g = /mai sus|Line up|Up\b|sus\b/i.test(e) ? 'sus' : /mai jos|Line down|Down\b|jos\b/i.test(e) ? 'sageata' :
      /Închidere|Close/i.test(e) ? 'inchide' : /Ajutor|Help/i.test(e) ? 'ajutor' : /Căut|Search/i.test(e) ? 'cauta' : 'gol';
    return g === 'gol' ? '<span class="lh-ap-gol" aria-hidden="true" style="width:' + Math.round((marime || 16) * 0.7) + 'px;height:' +
      Math.round((marime || 16) * 0.7) + 'px"></span>' : glif(g, Math.min(marime || 16, 14));
  }
  const literaFaraIcoana = faraIcoana;

  function felSuprafata(cheie) {
    if (/^panglica/.test(cheie)) return 'panglica';
    if (cheie === 'bara_stare') return 'stare';
    if (cheie === 'bara_titlu' || cheie === 'backstage.cadru') return 'titlu';
    if (cheie === 'file_panglicii') return 'file';
    if (/^meniu_contextual/.test(cheie)) return 'meniu';
    if (/^backstage/.test(cheie)) return 'backstage';
    if (/^(dialog|panou)\./.test(cheie)) return 'dialog';
    return 'alta';
  }
  const faraPuncte = s => String(s || '').replace(/(\.\.\.|…)$/, '');
  /* bara de stare: numele accesibil = numele câmpului + valoarea; pe ecran se vede valoarea (Word: „Page 1 of 1”, „0 words”) */
  const STARE_VALOARE = /^(Page Number|Word Count|Language|Accessibility Checker|Zoom)\s+(?!(?:Out|In)\b)(.+)$/;
  function textStare(n) {
    if (n.t !== 'Button' && n.t !== 'Text') return null;
    const m = STARE_VALOARE.exec(n.e || '');
    if (m) return m[2];
    if (/\s$/.test(n.e || '') && (n.r || [0, 0, 0])[2] >= 60) return n.e.trim();   // „Display Settings ”, „Focus ”
    return null;
  }

  /* ce se vede pe un nod: {text, icoana, sageata, mare} — regulile după forma elementului real (lățime/înălțime) */
  function afisare(n, ctx) {
    const t = n.t, w = (n.r || [0, 0, 0, 0])[2], h = (n.r || [0, 0, 0, 0])[3], fel = ctx.fel;
    const eLansator = t === 'Button' && w <= 18 && h <= 18 && /\.\.\.$/.test(n.e || '');
    if (/^\[/.test(n.e || '')) return {};   // elementele de listă nesalvate în referință („[element de listă, nesalvat]”)
    if (fel === 'stare') {
      if (ctx.parinteUnit && ctx.parinteUnit.t === 'Slider') return {};
      const v = textStare(n);
      return v != null ? { text: v } : { icoana: true };
    }
    if (t === 'Text' || t === 'Hyperlink') return { text: n.e };
    if (t === 'TabItem') return { text: n.e };
    if (t === 'CheckBox' || t === 'RadioButton') return { text: w >= 30 ? n.e : null, caseta: true };
    if (fel === 'titlu') {
      if (t === 'Button' && /\s-\s/.test(n.e || '')) return { text: n.e };
      return { icoana: true };
    }
    if (fel === 'stare') {
      const v = textStare(n);
      return v != null ? { text: v } : { icoana: true };
    }
    if (fel === 'file') {
      if (n.id === 'FileTabButton') return { text: 'File' };
      if (t === 'MenuItem' && w >= 50) return { text: n.e, icoana: true };
      return { sageata: t === 'MenuItem' };
    }
    if (ctx.parinteUnit && ctx.parinteUnit.t === 'ComboBox' && t === 'Button') return { sageata: true };
    if (ctx.inTitluDialog) return { icoana: true };
    if (eLansator) return { lansator: true };
    const mare = h >= 56;
    if (fel === 'panglica' || fel === 'meniu') {
      if (ctx.inGalerie && t === 'ListItem') return ctx.galerieStiluri ? { text: n.e, previzualizare: true } : { icoana: true };
      if (ctx.inGalerie && t === 'Button') return { sageata: true };
      if (mare) return { icoana: true, text: faraPuncte(n.e), mare: true, sageata: t === 'MenuItem' };
      if (fel === 'meniu' && w >= 100) return { icoana: true, text: n.e, rand: true };
      if (t === 'ListItem') return { icoana: true };
      if (w >= 50) return { icoana: true, text: faraPuncte(n.e), sageata: t === 'MenuItem' };
      return { icoana: true, sageata: t === 'MenuItem' && w >= 32 };
    }
    if (fel === 'backstage' || fel === 'dialog' || fel === 'alta') {
      if (t === 'ListItem' || t === 'TreeItem' || t === 'DataItem') return { text: n.e, icoana: !!n.id };
      /* butonul care își are numele într-un copil Text („More options…” în ferestrele Office) nu-l scrie de două ori */
      const textInCopil = (n.c || []).some(c => c.t === 'Text' && c.e === n.e);
      if (w >= 40 && h >= 14) return { text: textInCopil ? null : n.e, icoana: false, sageata: t === 'MenuItem' || t === 'SplitButton' };
      return { icoana: true };
    }
    return { icoana: true };
  }

  function rol(n) {
    return ({ Button: 'button', SplitButton: 'button', MenuItem: 'menuitem', CheckBox: 'checkbox', RadioButton: 'radio',
      TabItem: 'tab', ListItem: 'option', TreeItem: 'treeitem', Hyperlink: 'link', Slider: 'slider', ComboBox: 'combobox' })[n.t] || null;
  }

  /* ținta canonică implicită (api_biblioteca.md §3) după suprafață; aplicația o poate înlocui (opt.tinta) */
  function tintaImplicita(n, ctx) {
    const e = (n.e || '').trim();
    const fel = ctx.fel;
    if (!UNITATE.has(n.t) && n.t !== 'SplitButton') return null;
    if (n.t === 'Text') return null;
    if (fel === 'file') {
      if (n.id === 'FileTabButton') return 'fila:File';
      if (n.t === 'TabItem') return 'fila:' + e;
      if (/Ribbon Display Options/.test(e)) return 'meniu_derulant:' + e;
      return 'buton:' + e;
    }
    if (fel === 'panglica') {
      const baza = [ctx.fila, ctx.grup].filter(Boolean).join('/');
      const unit = ctx.parinteUnit || n;
      const nume = (unit.e || e).trim();
      if (ctx.parinteUnit && ctx.parinteUnit.t === 'SplitButton') {
        return (n.t === 'MenuItem' || /More Options/.test(e)) ? 'meniu_derulant:' + baza + '/' + nume : 'panglica:' + baza + '/' + nume;
      }
      if (ctx.parinteUnit && ctx.parinteUnit.t === 'ComboBox') return n.t === 'Button' ? 'meniu_derulant:' + baza + '/' + nume : null;
      if (ctx.inGalerie && n.t === 'ListItem') return 'meniu:' + e.replace(/^¶\s*/, '');
      if (n.t === 'SplitButton') return null;   // părțile lui (butonul și săgeata) poartă țintele
      if (n.t === 'Button' && (n.r || [0, 0, 99])[2] <= 18 && /\.\.\.$/.test(e)) return 'lansator:' + baza;
      if (n.t === 'MenuItem' && !e) return null;
      if (n.t === 'MenuItem') return 'meniu_derulant:' + baza + '/' + e;
      return 'panglica:' + baza + '/' + e;
    }
    if (fel === 'titlu') return /search/i.test(e) ? 'cautare' : 'bara_titlu:' + e;
    if (fel === 'stare') {
      if (n.t === 'Slider') return 'zoom';
      if (ctx.parinteUnit && ctx.parinteUnit.t === 'Slider') return null;
      if (/^Zoom/.test(e)) return 'zoom:' + e.replace(/\s+\d+\s*%$/, '');
      return 'bara_stare:' + e.replace(STARE_VALOARE, '$1').trim();
    }
    if (fel === 'meniu') return e ? 'meniu:' + e : null;
    if (fel === 'backstage') return e ? 'backstage:' + e : null;
    if (fel === 'dialog') {
      if (n.t === 'TabItem') return 'fila_dialog:' + e;
      if (n.t === 'Edit' || n.t === 'ComboBox' || n.t === 'Spinner') return 'camp:' + e.replace(/:$/, '');
      return e ? 'fereastra:' + e : null;
    }
    return null;
  }

  function nodEl(I, n, parinteR, ctx, opt) {
    const t = n.t;
    let r = n.r || [0, 0, 0, 0];
    const el = document.createElement('div');
    el.__nod = n;
    el.setAttribute('data-lh-tip', t);
    if (n.e != null) el.setAttribute('data-lh-eticheta', n.e);
    if (n.id) el.setAttribute('data-lh-id-mso', n.id);
    el.className = 'lh-ap-n lh-ap-t-' + t;
    /* nodurile de mărime 0 pe care referința le are totuși (elemente virtualizate, în afara ecranului) rămân în arbore ca
       în aplicația reală: 1×1, transparente, fără clic */
    const virtual = !n.ascuns && (r[2] <= 0 || r[3] <= 0);
    if (n.ascuns) el.style.display = 'none';
    if (virtual) { el.classList.add('lh-ap-virtual'); r[2] > 0 || (r = r.slice(), r[2] = 1); r[3] > 0 || (r[3] = 1); }
    if (parinteR) {
      el.style.left = (r[0] - parinteR[0]) + 'px';
      el.style.top = (r[1] - parinteR[1]) + 'px';
    }
    el.style.width = r[2] + 'px';
    el.style.height = r[3] + 'px';
    const eUnit = UNITATE.has(t);
    const ro = rol(n);
    if (ro) el.setAttribute('role', ro);
    if (n.a === 0) { el.setAttribute('aria-disabled', 'true'); el.classList.add('lh-ap-gri'); }
    if (n.b === 1) el.classList.add('lh-ap-bifat');
    const ct = Object.assign({}, ctx);
    /* ținta canonică */
    let tinta = opt.tinta ? opt.tinta(n, ct) : undefined;
    if (tinta === undefined) tinta = tintaImplicita(n, ct);
    if (tinta) el.setAttribute('data-lh-tinta', tinta);
    const a = afisare(n, ct);
    let html = '';
    const glifSageata = '<span class="lh-ap-sag" aria-hidden="true">' + glif('sageata', 12) + '</span>';
    const comboFaraEdit = t === 'ComboBox' && !(n.c || []).some(c => c.t === 'Edit');
    if (t === 'Edit' || t === 'Spinner' || comboFaraEdit) {
      const ph = /search|caut/i.test(n.e || '') || /^(Search|Search the menus)$/.test(n.v || '');
      html = '<input class="lh-ap-camp" tabindex="-1" ' + (opt.editabil && opt.editabil(n, ct) ? '' : 'readonly ') +
        (ph ? 'placeholder="' + esc(n.v || '') + '" value=""' : 'value="' + esc(n.v || '') + '"') +
        ' aria-label="' + esc(n.e || '') + '">' + (t === 'Spinner' ? '<span class="lh-ap-spin" aria-hidden="true"></span>' : '');
      if (t === 'ComboBox' && !(n.c && n.c.length)) html += glifSageata;
    } else if (t === 'ComboBox') {
      html = '';
    } else if (t === 'Slider') {
      html = '<span class="lh-ap-pista" aria-hidden="true"></span>';
    } else if (t === 'Thumb') {
      html = '<span class="lh-ap-cursor" aria-hidden="true"></span>';
    } else if (eUnit && !(t === 'SplitButton')) {
      const m = a.mare ? 32 : 16;
      let ic = '';
      if (a.lansator) ic = glif('lansator', 12);
      else if (a.caseta) ic = '<span class="lh-ap-caseta' + (t === 'RadioButton' ? ' lh-ap-radio' : '') + '" aria-hidden="true">' +
        (n.b === 1 ? glif(t === 'RadioButton' ? 'punct' : 'bifa', 12) : '') + '</span>';
      else if (a.icoana) {
        const id = n.id || (ct.parinteUnit && ct.parinteUnit.id) || idDupaNume(I, n.e) || (ct.parinteUnit && idDupaNume(I, ct.parinteUnit.e));
        ic = icoana(I, id, m);
        if (!ic && ct.fel === 'titlu') ic = glif(/Minimize/.test(n.e) ? 'minim' : /Maximize|Restore/.test(n.e) ? 'maxim' : /Close/.test(n.e) ? 'inchide' : /Help/.test(n.e) ? 'ajutor' : 'cauta', 16);
        if (!ic && ct.inTitluDialog) ic = glif(/Închidere|Close/.test(n.e) ? 'inchide' : 'ajutor', 14);
        if (!ic && ct.fel === 'stare') ic = glif(/Zoom Out/.test(n.e) ? 'minus' : /Zoom In/.test(n.e) ? 'plus' : /Read Mode/.test(n.e) ? 'citire' : /Web Layout/.test(n.e) ? 'web' : /Print Layout/.test(n.e) ? 'pagina' : 'punct', 14);
        if (!ic && ct.parinteUnit && /More Options/.test(n.e || '')) ic = '';
        if (!ic && !(ct.parinteUnit && /More Options/.test(n.e || '')) && !a.text) ic = literaFaraIcoana(n, m);
        if (ic && !/^<svg|^<span/.test(ic)) ic = '';
      }
      const txt = a.text ? '<span class="lh-ap-text' + (a.previzualizare ? ' lh-ap-text-nume' : '') + '">' + esc(a.text) + '</span>' : '';
      const prev = a.previzualizare ? '<span class="lh-ap-prev" aria-hidden="true">AaBbCcDd</span>' : '';
      const sag = a.sageata ? glifSageata : '';
      if (a.mare) el.classList.add('lh-ap-mare');
      if (a.rand) el.classList.add('lh-ap-rand');
      if (a.previzualizare) el.classList.add('lh-ap-dala');
      html = prev + ic + txt + sag;
      if (!a.text && n.e) el.setAttribute('aria-label', n.e);
      if (!a.text && n.e) el.title = n.e + (n.k ? ' (' + n.k + ')' : '');
      else if (n.h) el.title = n.h;
    }
    /* în ferestre (dialog / Backstage), un SplitButton cu loc de text (≥ 50 px rămași după copii) își scrie numele: firimitura
       „Documente” din bara de adrese, antetele coloanelor „Nume”, „Data modificării”… (uia_word.json › dialog.FileSaveAs);
       copiii lui (filtrul, săgeata) sunt doar săgeată. „Detalii” (54 − 16 px) și „Toate locațiile” (34 px) rămân pictograme.
       Critic runda 3, GRAV A2 */
    const splitCuText = t === 'SplitButton' && (ctx.fel === 'dialog' || ctx.fel === 'backstage' || ctx.fel === 'alta') && !!n.e &&
      !/^\[/.test(n.e) && r[2] - (n.c || []).reduce((s, c) => s + ((c.r || [0, 0, 0])[2] || 0), 0) >= 50;
    if (splitCuText) html = '<span class="lh-ap-text">' + esc(n.e) + '</span>';
    /* SplitButton: părțile lui desenează conținutul; partea „săgeată” a unui buton MARE poartă numele sub pictogramă */
    if (t === 'SplitButton' && n.c && n.c.length) {
      el.classList.add('lh-ap-split');
      if (h(n) >= 56) el.classList.add('lh-ap-mare');
    }
    el.innerHTML = html;
    /* legenda grupului panglicii (numele vizibil sub grup) */
    if (ct.fel === 'panglica' && t === 'Group' && ct.adancime === 2) {
      el.classList.add('lh-ap-grup');
      const lg = document.createElement('span');
      lg.className = 'lh-ap-legenda';
      lg.textContent = n.e;
      el.appendChild(lg);
    }
    if (ct.fel === 'meniu' && t === 'Group' && /\S/.test(n.e || '') && n.e !== 'MiniBar') {
      const hd = document.createElement('span');
      hd.className = 'lh-ap-antet-grup';
      hd.textContent = n.e + ':';
      el.appendChild(hd);
    }
    if (t === 'TitleBar' && ct.fel === 'dialog') {
      const tt = document.createElement('span');
      tt.className = 'lh-ap-titlu-dialog';
      tt.textContent = ct.titluDialog || '';
      el.appendChild(tt);
    }
    if (opt.la) opt.la(n, el, ct);
    /* copiii */
    if (n.c && n.c.length) {
      const c2 = Object.assign({}, ct, { adancime: ct.adancime + 1 });
      if (ct.fel === 'panglica' && t === 'Group' && ct.adancime === 2) c2.grup = n.e;
      if (eUnit) c2.parinteUnit = n;
      if (t === 'DataGrid' || (t === 'MenuItem' && !n.e)) c2.inGalerie = true;
      if (n.id === 'QuickStylesGallery') c2.galerieStiluri = true;
      if (t === 'TitleBar') c2.inTitluDialog = ct.fel === 'dialog';
      if (t === 'SplitButton' && h(n) >= 56) c2.splitMare = true;
      for (const c of n.c) {
        const ce = nodEl(I, c, r, c2, opt);
        if (splitCuText && c.t === 'Button') {
          ce.innerHTML = glifSageata;
          ce.removeAttribute('title');
        } else if (c2.splitMare && /More Options/.test(c.e || '')) {
          ce.classList.add('lh-ap-mare-jos');
          ce.innerHTML = '<span class="lh-ap-text">' + esc(faraPuncte(n.e)) + '</span>' + glifSageata;
        } else if (c2.splitMare && c.t === 'Button') {
          ce.innerHTML = icoana(I, c.id || n.id || idDupaNume(I, n.e), 32) || literaFaraIcoana(c, 32);
        } else if (t === 'SplitButton' && !c2.splitMare && /More Options/.test(c.e || '')) {
          ce.innerHTML = glifSageata;
        } else if (t === 'SplitButton' && !c2.splitMare && c.t === 'Button') {
          const ic = icoana(I, c.id || n.id || idDupaNume(I, n.e), 16) || literaFaraIcoana(c, 16);
          ce.innerHTML = ic + ((c.r || [0, 0, 0])[2] >= 50 ? '<span class="lh-ap-text">' + esc(faraPuncte(n.e)) + '</span>' : '');
          ce.removeAttribute('title');
        }
        el.appendChild(ce);
      }
    }
    return el;
  }
  function h(n) { return (n.r || [0, 0, 0, 0])[3]; }

  /* desenează suprafața `cheie` din I.date.suprafete; întoarce rădăcina ei (poziționată de aplicație) */
  function deseneaza(I, cheie, opt) {
    opt = opt || {};
    const n = I.date.suprafete[cheie];
    if (!n) return null;
    const fel = felSuprafata(cheie);
    const ctx = { cheie, fel, adancime: 0, fila: opt.fila || ((n._fila || {}).e) || null, grup: null,
      titluDialog: fel === 'dialog' ? n.e : null };
    const el = nodEl(I, n, null, ctx, opt);
    el.setAttribute('data-lh-suprafata', cheie);
    el.classList.add('lh-ap-sup', 'lh-ap-sup-' + fel);
    el.style.left = '';
    el.style.top = '';
    return el;
  }

  L._modul('panglica', { deseneaza, icoana, glif, svg, felSuprafata, tintaImplicita, afisare, esc });
})();
