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
  /* pictograma după numele nodului fără idMso (date › icoane_nume, din _unelte/icoane_<aplicatie>.json): numele întreg sau
     partea dinainte de „:” („Eraser: Use the eraser…” -> Eraser) */
  function icoanaNume(I, nume, marime) {
    const T = I.date && I.date.icoane_nume;
    if (!T || !nume) return '';
    const e = String(nume).trim(), p = T[e] || T[e.replace(/(\.\.\.|…)$/, '')] || T[e.split(':')[0].trim()];
    return p ? svg(p.map(d => '<path d="' + esc(d) + '"/>').join(''), marime) : '';
  }
  /* o unealtă dintr-o galerie de unelte (List cu SplitButton fără părți: Draw › Drawing Tools). Numele real e
     „<fel>: <culoare>, <grosime>…” (Pen: Red, 0.35 mm); felul și culoarea se citesc din nume, forma și codul culorii din
     date › unelte. Desen propriu, simplu (nu captură Microsoft): unealta stă în picioare, cu vârful colorat în sus. */
  const CORP = 'fill="#f3f2f1" stroke="#605e5c" stroke-width=".7"';
  const FORME_UNEALTA = {
    pix: c => '<path d="M12 3 15.5 13h-7z" fill="' + c + '" stroke="#605e5c" stroke-width=".7"/><path d="M8.5 13h7v27h-7z" ' + CORP + '/><path d="M8.5 17h7v3h-7z" fill="' + c + '"/>',
    creion: c => '<path d="M12 3 16 14H8z" fill="#f1d6a8" stroke="#605e5c" stroke-width=".7"/><path d="M12 3 13.6 7.4h-3.2z" fill="' + c + '"/><path d="M8 14h8v26H8z" fill="' + c + '" stroke="#605e5c" stroke-width=".7"/><path d="M10.7 14v26M13.3 14v26" stroke="#fff" stroke-opacity=".45" stroke-width=".7"/>',
    marker: c => '<path d="M8.5 4h7v6l2 4h-11l2-4z" fill="' + c + '" stroke="#605e5c" stroke-width=".7"/><path d="M5.5 14h13v26h-13z" ' + CORP + '/><path d="M5.5 18h13v4h-13z" fill="' + c + '"/>',
    stilou: c => '<path d="M12 2 16 10l-1.5 5h-5L8 10z" fill="' + c + '" stroke="#605e5c" stroke-width=".7"/><path d="M12 5v6" stroke="#fff" stroke-width=".8"/><path d="M9 15h6v25H9z" ' + CORP + '/><path d="M9 19h6v3H9z" fill="' + c + '"/>',
    pensula: c => '<path d="M12 2c3 4 4.5 7 4.5 10 0 1.5-1 3-2 3h-5c-1 0-2-1.5-2-3C7.5 9 9 6 12 2z" fill="' + c + '" stroke="#605e5c" stroke-width=".7"/><path d="M9.5 15h5v25h-5z" ' + CORP + '/><path d="M9.5 19h5v3h-5z" fill="' + c + '"/>'
  };
  function unealta(I, n) {
    const U = (I.date && I.date.unelte) || {}, e = String(n.e || '');
    const fel = e.split(':')[0].trim(), rest = e.indexOf(':') >= 0 ? e.slice(e.indexOf(':') + 1) : '';
    const forma = (U.forme || {})[fel];
    if (!forma || !FORME_UNEALTA[forma]) return icoanaNume(I, e, 24) || icoana(I, idDupaNume(I, fel), 24);
    const culoare = (U.culori || {})[rest.split(',')[0].trim()] || '#605e5c';
    return '<svg class="lh-ap-ico lh-ap-ico-unealta" aria-hidden="true" width="24" height="42" viewBox="0 0 24 42" focusable="false">' +
      FORME_UNEALTA[forma](esc(culoare)) + '</svg>';
  }
  /* ---------------- miniaturile galeriilor din panglică (ListItem fără idMso într-o casetă de galerie: Shapes, Shape Styles,
     WordArt Styles, Picture Styles, Table Styles, Style Set, Themes, Transition Effects, Animation Styles). Referința dă doar
     NUMELE elementului; desenul se face din nume. Desene proprii, simple (nu capturi Microsoft): forma numită, culoarea numită
     („Blue, Accent 1”), felul numit („Colored Outline”). Paletele temelor și desenele tranzițiilor sunt aproximative [DEDUS]. */
  const ACCENT = { 1: '#4472C4', 2: '#ED7D31', 3: '#A5A5A5', 4: '#FFC000', 5: '#5B9BD5', 6: '#70AD47' };   // tema Office
  function culoareNume(s, implicit) {
    s = String(s || '');
    const m = /Accent(?: color)? (\d)/.exec(s);
    if (m && ACCENT[m[1]]) return ACCENT[m[1]];
    return /Black|Dark 1|Text color 1/.test(s) ? '#000000' : /Light Gray/.test(s) ? '#E7E6E6' : /Blue-Gray/.test(s) ? '#44546A' :
      /White|Background color 1/.test(s) ? '#FFFFFF' : /Gray/.test(s) ? '#A5A5A5' : /Gold/.test(s) ? '#FFC000' :
      /Orange/.test(s) ? '#ED7D31' : /Green/.test(s) ? '#70AD47' : /Blue/.test(s) ? '#4472C4' : (implicit || '#7F7F7F');
  }
  function miniSvg(w, h, continut, vb) {
    return '<svg class="lh-ap-ico lh-ap-mini" aria-hidden="true" width="' + w + '" height="' + h + '" viewBox="' + (vb || ('0 0 ' + w + ' ' + h)) +
      '" focusable="false">' + continut + '</svg>';
  }
  const numeMini = e => '<span class="lh-ap-text lh-ap-mini-nume">' + esc(e) + '</span>';
  /* formele (viewBox 0 0 20 20) */
  const Pf = d => '<path d="' + d + '"/>', Lf = d => '<path d="' + d + '" fill="none"/>';
  const CERC = '<circle cx="10" cy="10" r="7.5"/>', DREPT = Pf('M2.5 5h15v10h-15z');
  function poligon(n, r2) {
    const pas = r2 ? 2 * n : n, pt = [];
    for (let i = 0; i < pas; i++) {
      const u = -Math.PI / 2 + i * 2 * Math.PI / pas, r = r2 && i % 2 ? r2 : 8;
      pt.push((10 + r * Math.cos(u)).toFixed(1) + ' ' + (10 + r * Math.sin(u)).toFixed(1));
    }
    return Pf('M' + pt.join('L') + 'z');
  }
  const SAG_DR = 'M2.5 7.5h8V4l7 6-7 6v-3.5h-8z', SAG_2 = 'M2.5 10 7 5v3h6V5l4.5 5-4.5 5v-3H7v3z';
  const rotit = (d, g) => '<path d="' + d + '" transform="rotate(' + g + ' 10 10)"/>';
  const capete = e => (/Arrow/.test(e) ? 'M14.5 13.5 17 16l-2.5 2.5' : '') + (/Double/.test(e) ? 'M5.5 1.5 3 4l2.5 2.5' : '');
  const FORME = [
    [/^Text Box/, () => Pf('M2.5 4.5h15v11h-15z') + Lf('M5 7.5h6M5 10h9M5 12.5h7')],
    [/^Line Arrow: Double/, () => Lf('M3 17 17 3M3 12v5h5M12 3h5v5')],
    [/^Line Arrow/, () => Lf('M3 17 17 3M11 3h6v6')],
    [/^Line$/, () => Lf('M3 17 17 3')],
    [/^Connector: Elbow/, e => Lf('M3 4h7v12h7' + capete(e))],
    [/^Connector: Curved/, e => Lf('M3 4c9 0 5 12 14 12' + capete(e))],
    [/^Curve/, () => Lf('M3 15c3-12 6 6 8-2s4-8 6-4')],
    [/^Freeform: Shape/, () => Pf('M4 15 3 8l6-5 3 5 5-2-2 9z')],
    [/Scribble/, () => Lf('M3 14c2-9 4-9 5-3s2 6 4-2 3-5 5 1')],
    [/^Rectangle: Rounded|^Flowchart: Alternate/, () => '<rect x="2.5" y="5" width="15" height="10" rx="2.5"/>'],
    [/^Rectangle: Single Corner Snipped/, () => Pf('M2.5 5h11l4 4v6h-15z')],
    [/^Flowchart: Card/, () => Pf('M6.5 5h11v10h-15V9z')],
    [/^Rectangle: Top Corners Snipped/, () => Pf('M5.5 5h9l3 3v7h-15V8z')],
    [/^Rectangle: Diagonal Corners Snipped/, () => Pf('M2.5 5h12l3 3v7h-12l-3-3z')],
    [/^Rectangle: Top Corners One Rounded/, () => Pf('M5.5 5h9l3 3v7h-15V8a3 3 0 0 1 3-3z')],
    [/^Rectangle: Single Corner Rounded/, () => Pf('M2.5 5h12a3 3 0 0 1 3 3v7h-15z')],
    [/^Rectangle: Top Corners Rounded/, () => Pf('M5.5 5h9a3 3 0 0 1 3 3v7h-15V8a3 3 0 0 1 3-3z')],
    [/^Rectangle: Diagonal Corners Rounded/, () => Pf('M5.5 5h12v7a3 3 0 0 1-3 3h-12V8a3 3 0 0 1 3-3z')],
    [/^Rectangle: Beveled/, () => Pf('M2.5 4.5h15v11h-15z') + Lf('M5 7h10v6H5zM2.5 4.5 5 7M17.5 4.5 15 7M2.5 15.5 5 13M17.5 15.5 15 13')],
    [/^Rectangle: Folded Corner/, () => Pf('M2.5 4.5h15v7l-4 4h-11z') + Lf('M17.5 11.5h-4v4')],
    [/^Flowchart: Predefined/, () => DREPT + Lf('M5 5v10M15 5v10')],
    [/Internal Storage/, () => DREPT + Lf('M5 5v10M2.5 7.5h15')],
    [/^Rectangle|^Flowchart: Process/, () => DREPT],
    [/^Flowchart: Connector/, () => '<circle cx="10" cy="10" r="6"/>'],
    [/^Oval/, () => '<ellipse cx="10" cy="10" rx="7.5" ry="6"/>'],
    [/^Isosceles Triangle|Flowchart: Extract/, () => Pf('M10 3.5 17.5 16h-15z')],
    [/^Flowchart: Merge/, () => Pf('M2.5 4h15L10 16.5z')],
    [/^Right Triangle/, () => Pf('M3 3.5V16h14z')],
    [/^Parallelogram|Flowchart: Data/, () => Pf('M6 5h11.5L14 15H2.5z')],
    [/^Trapezoid/, () => Pf('M6 5h8l3.5 10h-15z')],
    [/Manual Operation/, () => Pf('M2.5 5h15L14 15H6z')],
    [/Manual Input/, () => Pf('M2.5 8 17.5 5v10h-15z')],
    [/^Flowchart: Sort/, () => Pf('M10 3 17.5 10 10 17 2.5 10z') + Lf('M2.5 10h15')],
    [/^Diamond|Flowchart: Decision/, () => Pf('M10 3 17.5 10 10 17 2.5 10z')],
    [/^Pentagon/, () => poligon(5)], [/^Hexagon|Preparation/, () => Pf('M6 3.5h8l3.5 6.5-3.5 6.5H6L2.5 10z')], [/^Heptagon/, () => poligon(7)],
    [/^Octagon/, () => poligon(8)], [/^Decagon/, () => poligon(10)], [/^Dodecagon/, () => poligon(12)],
    [/^Partial Circle/, () => Pf('M10 10V2.5A7.5 7.5 0 1 1 2.5 10z')],
    [/^Chord/, () => Pf('M4.7 4.7a7.5 7.5 0 1 1 10.6 10.6z')],
    [/^Teardrop/, () => Pf('M10 2.5h7.5V10A7.5 7.5 0 1 1 10 2.5z')],
    [/^Half Frame/, () => Pf('M3 3h14l-3 3H6v8l-3 3z')],
    [/^Frame/, () => Pf('M2.5 4h15v12h-15zM5.5 7v6h9V7z')],
    [/^L-Shape/, () => Pf('M3 3h5v9h9v5H3z')],
    [/^Diagonal Stripe/, () => Pf('M3 17v-6l8-8h6z')],
    [/^Cross$/, () => Pf('M7 3h6v4h4v6h-4v4H7v-4H3V7h4z')],
    [/^Plus Sign/, () => Pf('M8.5 3h3v5.5H17v3h-5.5V17h-3v-5.5H3v-3h5.5z')],
    [/^Minus Sign/, () => Pf('M3 8.5h14v3H3z')],
    [/^Multiplication/, () => Pf('M5 3l5 5 5-5 2 2-5 5 5 5-2 2-5-5-5 5-2-2 5-5-5-5z')],
    [/^Division/, () => Pf('M3 8.5h14v3H3z') + '<circle cx="10" cy="5" r="1.6"/><circle cx="10" cy="15" r="1.6"/>'],
    [/^Not Equal/, () => Pf('M3 6h14v3H3zM3 11h14v3H3z') + Lf('M13 3 7 17')],
    [/^Equals/, () => Pf('M3 6h14v3H3zM3 11h14v3H3z')],
    [/^Plaque/, () => Pf('M5 4.5h10a2.5 2.5 0 0 0 2.5 2.5v6a2.5 2.5 0 0 0-2.5 2.5H5A2.5 2.5 0 0 0 2.5 13V7A2.5 2.5 0 0 0 5 4.5z')],
    [/^Cylinder|Magnetic Disk/, () => Pf('M4 5.5v9c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-9') + '<ellipse cx="10" cy="5.5" rx="6" ry="2.5"/>'],
    [/^Cube/, () => Pf('M3 7l4-4h10v10l-4 4H3z') + Lf('M3 7h10v10M13 7l4-4')],
    [/^Circle: Hollow/, () => Pf('M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15zM10 6.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z')],
    [/Not Allowed/, () => CERC + Lf('M4.7 4.7 15.3 15.3')],
    [/Summing Junction/, () => CERC + Lf('M4.7 4.7 15.3 15.3M15.3 4.7 4.7 15.3')],
    [/^Flowchart: Or/, () => CERC + Lf('M10 2.5v15M2.5 10h15')],
    [/^Block Arc/, () => Pf('M2.5 14a7.5 7.5 0 0 1 15 0h-4a3.5 3.5 0 0 0-7 0z')],
    [/^Smiley/, () => CERC + Lf('M6.5 12c2 2.5 5 2.5 7 0M7.5 7.5v1M12.5 7.5v1')],
    [/^Heart/, () => Pf('M10 16.5C4 12 2.5 9.5 2.5 7.2A3.7 3.7 0 0 1 10 5.6a3.7 3.7 0 0 1 7.5 1.6c0 2.3-1.5 4.8-7.5 9.3z')],
    [/^Lightning/, () => Pf('M8 2.5 13 7l-2 1 4 3.5-2 .8 4 5.2-8-5 2-1-4.5-3 2.2-1z')],
    [/^Sun/, () => '<circle cx="10" cy="10" r="3.5"/>' + Lf('M10 2v2.5M10 15.5V18M2 10h2.5M15.5 10H18M4.3 4.3l1.8 1.8M13.9 13.9l1.8 1.8M4.3 15.7l1.8-1.8M13.9 6.1l1.8-1.8')],
    [/^Moon/, () => Pf('M12 2.5a7.5 7.5 0 1 0 0 15 9 9 0 0 1 0-15z')],
    [/^Cloud|Thought Bubble/, () => Pf('M6 15.5a3.5 3.5 0 0 1-.6-6.95A4.5 4.5 0 0 1 14 7.6a4 4 0 0 1 .5 7.9z')],
    [/^Arc/, () => Lf('M10 2.5A7.5 7.5 0 0 1 17.5 10')],
    [/^Double Bracket/, () => Lf('M6 3.5H4.5A1.5 1.5 0 0 0 3 5v10a1.5 1.5 0 0 0 1.5 1.5H6M14 3.5h1.5A1.5 1.5 0 0 1 17 5v10a1.5 1.5 0 0 1-1.5 1.5H14')],
    [/^Double Brace/, () => Lf('M7 3.5c-2 0-2 1-2 3s0 3.5-2 3.5c2 0 2 1.5 2 3.5s0 3 2 3M13 3.5c2 0 2 1 2 3s0 3.5 2 3.5c-2 0-2 1.5-2 3.5s0 3-2 3')],
    [/^Left Bracket/, () => Lf('M12 3H9.5A1.5 1.5 0 0 0 8 4.5v11A1.5 1.5 0 0 0 9.5 17H12')],
    [/^Right Bracket/, () => Lf('M8 3h2.5A1.5 1.5 0 0 1 12 4.5v11a1.5 1.5 0 0 1-1.5 1.5H8')],
    [/^Left Brace/, () => Lf('M12 3c-2 0-2 1-2 3.5S10 10 8 10c2 0 2 1 2 3.5s0 3.5 2 3.5')],
    [/^Right Brace/, () => Lf('M8 3c2 0 2 1 2 3.5S10 10 12 10c-2 0-2 1-2 3.5S10 17 8 17')],
    [/^Arrow: Left-Right$/, () => Pf(SAG_2)], [/^Arrow: Up-Down$/, () => rotit(SAG_2, 90)],
    [/^Arrow: (Quad|Left-Right-Up)/, () => Pf('M10 2l3 3h-2v4h4V7l3 3-3 3v-2h-4v4h2l-3 3-3-3h2v-4H5v2l-3-3 3-3v2h4V5H7z')],
    [/^Arrow: (Bent|U-Turn|Left-Up|Curved|Circular)/, () => Pf('M3 16.5V10a4 4 0 0 1 4-4h5V3l5.5 4.5L12 12V9H7.5a1 1 0 0 0-1 1v6.5z')],
    [/^Arrow: Pentagon/, () => Pf('M2.5 5h10l5 5-5 5h-10z')],
    [/^Arrow: Chevron/, () => Pf('M2.5 5h10l5 5-5 5h-10l5-5z')],
    [/^Arrow: Left$/, () => rotit(SAG_DR, 180)], [/^Arrow: Up$/, () => rotit(SAG_DR, 270)], [/^Arrow: Down$/, () => rotit(SAG_DR, 90)],
    [/^Arrow:/, () => Pf(SAG_DR)],
    [/^Callout: .*Arrow/, () => Pf('M2.5 3.5h15v8h-5v2h2.5L10 17.5l-5-4h2.5v-2h-5z')],
    [/^Flowchart: (Document|Multidocument)/, () => Pf('M2.5 4.5h15V14c-3.5-2-5 2-7.5 1.5S6 14 2.5 15.5z')],
    [/Terminator/, () => '<rect x="2.5" y="6" width="15" height="8" rx="4"/>'],
    [/Off-page/, () => Pf('M3.5 3.5h13v8L10 17l-6.5-5.5z')],
    [/Punched Tape|Wave/, () => Pf('M2.5 6c3-2.5 4.5 2 7.5 0s4.5-2 7.5 0v8c-3-2-4.5 2-7.5 0s-4.5-2-7.5 0z')],
    [/Collate/, () => Pf('M4 3.5h12L4 16.5h12z')],
    [/Stored Data|Sequential|Direct Access|Delay|Display/, () => Pf('M5.5 5h12a5 5 0 0 0 0 10h-12a5 5 0 0 1 0-10z')],
    [/^Explosion/, () => poligon(11, 5)],
    [/^Star: (\d+)/, e => { const n = +/(\d+)/.exec(e)[1]; return poligon(n, n <= 5 ? 3.3 : n <= 8 ? 4.5 : 6); }],
    [/^Ribbon/, () => Pf('M2.5 6h4V4h7v2h4l-2 3.5 2 3.5h-5v2h-5v-2h-5l2-3.5z')],
    [/^Scroll/, () => Pf('M5 3.5h12.5V6H15v10.5H2.5V14H5z') + Lf('M5 6v8')],
    [/^Speech Bubble: Oval/, () => Pf('M10 3.5c4.1 0 7.5 2.5 7.5 5.5s-3.4 5.5-7.5 5.5c-.7 0-1.4-.1-2-.2L4 17l.8-3.7C3.4 12.3 2.5 10.7 2.5 9c0-3 3.4-5.5 7.5-5.5z')],
    [/^Speech Bubble/, () => Pf('M2.5 3.5h15v10h-8L5 17v-3.5H2.5z')],
    [/^Callout:/, () => Pf('M7 3.5h10.5v8H7z') + Lf('M7 9 3 16.5')],
    [/^Action Button/, () => '<rect x="2.5" y="2.5" width="15" height="15" rx="1.5"/>' + Pf('M8 7l5 3-5 3z')]
  ];
  function miniForma(e) {
    const f = FORME.find(x => x[0].test(e));
    return miniSvg(18, 18, '<g fill="#fff" stroke="#444" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">' +
      (f ? f[1](e) : '<rect x="2.5" y="5" width="15" height="10" rx="1.5"/>') + '</g>', '0 0 20 20');
  }
  /* Shape Styles: „<fel> - <culoare>”; caseta cu „Abc” */
  function miniStilForma(e) {
    const fel = e.split(' - ')[0], c = culoareNume(e.split(' - ').slice(1).join(' ')), inchis = c === '#000000';
    let fill = c, stroke = c, text = '#fff', extra = '', op = '';
    if (/^Colored Outline|^Transparent, Colored Outline/.test(fel)) { fill = /Transparent/.test(fel) ? 'none' : '#fff'; text = '#000'; }
    else if (/^Transparent/.test(fel)) { fill = 'none'; stroke = 'none'; text = inchis ? '#000' : c; }
    else if (/^Semitransparent/.test(fel)) { op = ' fill-opacity=".5"'; text = '#000'; }
    else if (/^Subtle Effect/.test(fel)) { op = ' fill-opacity=".3"'; text = '#000'; }
    else if (/^Light 1 Outline/.test(fel)) { stroke = '#fff'; extra = '<rect x="2" y="3" width="40" height="24" rx="3" fill="none" stroke="#c8c6c4" stroke-width=".7"/>'; }
    else if (/^(Moderate|Intense) Effect|^Gradient Fill/.test(fel)) extra = '<rect x="4" y="5" width="36" height="9" rx="2" fill="#fff" fill-opacity=".28"/>' +
      (/Intense/.test(fel) ? '<rect x="5" y="27" width="34" height="1.6" fill="#000" fill-opacity=".25"/>' : '');
    if (/No Outline/.test(e)) stroke = 'none';
    return miniSvg(44, 30, '<rect x="3.5" y="4.5" width="37" height="21" rx="2.5" fill="' + fill + '"' + op + ' stroke="' + stroke + '" stroke-width="1.5"/>' + extra +
      '<text x="22" y="19" text-anchor="middle" font-family="Calibri,Carlito,Segoe UI,sans-serif" font-size="11" fill="' + text + '">Abc</text>');
  }
  /* WordArt Styles: „Fill: <culoare>; Outline: <culoare>; Shadow…”; litera A */
  function miniWordArt(e) {
    const parti = e.split(';').map(x => x.trim()), po = parti.find(x => /^Outline:/.test(x)), pu = parti.find(x => /Shadow/.test(x));
    const fill = culoareNume(parti[0], '#A5A5A5');
    const contur = po ? culoareNume(po) : (fill === '#FFFFFF' || fill === '#E7E6E6' ? '#7F7F7F' : 'none');
    const A = (dx, dy, f, st) => '<text x="' + (22 + dx) + '" y="' + (25 + dy) + '" text-anchor="middle" font-family="Calibri,Carlito,Segoe UI,sans-serif" font-size="26" ' +
      'font-weight="700" fill="' + f + '" stroke="' + st + '" stroke-width="' + (st === 'none' ? 0 : 1) + '">A</text>';
    return miniSvg(44, 30, (pu ? A(1.6, 1.6, /Hard Shadow:/.test(pu) ? culoareNume(pu.split(':')[1]) : '#9d9d9d', 'none') : '') + A(0, 0, fill, contur));
  }
  /* Picture Styles: aceeași poză mică, în rama numită */
  function miniStilPoza(e) {
    const oval = /Oval/.test(e), rot = /Rounded/.test(e) ? 5 : 0, gros = /Thick|Double|Compound|Moderate|Metal|Matte|Bevel/.test(e) ? 3 : 1.4;
    const rama = /Soft Edge/.test(e) ? 'none' : /Metal/.test(e) ? '#9a9a9a' : /Black/.test(e) ? '#000' : /White|Bevel/.test(e) ? '#fff' : '#8a8886';
    const umbra = /Shadow|Reflected|Perspective/.test(e), tr = /Rotated/.test(e) ? ' transform="rotate(-7 22 16)"' : /Perspective/.test(e) ? ' transform="skewY(-4) translate(0 2)"' : '';
    const cadru = (extra) => oval ? '<ellipse cx="22" cy="15" rx="15" ry="10" ' + extra + '/>' : '<rect x="7" y="5" width="30" height="20" rx="' + rot + '" ' + extra + '/>';
    return miniSvg(44, 30, '<g' + tr + '>' + (umbra ? '<g transform="translate(1.8 1.8)">' + cadru('fill="#000" fill-opacity=".25"') + '</g>' : '') +
      (rama === '#fff' ? cadru('fill="none" stroke="#c8c6c4" stroke-width="' + (gros + 1.2) + '"') : '') + cadru('fill="#cfe3f5" stroke="' + rama + '" stroke-width="' + gros + '"') +
      '<path d="M11 22l6-7 4 4 3-3 7 6z" fill="#6f9b53"/><circle cx="29" cy="11" r="2.2" fill="#f2c94c"/></g>');
  }
  /* Table Styles (Word: Table Grid, Plain / Grid / List Table n; PowerPoint: Themed / Light / Medium / Dark Style n): tabel mic 5 × 5 */
  function miniStilTabel(e) {
    const acc = /Accent \d/.test(e), c = acc ? culoareNume(e) : '#7F7F7F', W = 60, H = 40, rh = 8, cw = 12;
    if (/^No Style, No Grid/.test(e)) {
      let t = '';
      for (let r = 0; r < 5; r++) for (let k = 0; k < 5; k++) t += '<path d="M' + (k * cw + 3) + ' ' + (r * rh + 4.5) + 'h6" stroke="#7F7F7F" stroke-width="1"/>';
      return miniSvg(W, H, t);
    }
    const grila = /Table Grid|^Grid Table|Themed Style 2|Light Style 3|Medium Style [24]/.test(e), intunecat = /Dark/.test(e);
    const antet = /Grid Table [4-7]|List Table [3-7]|Medium|Dark|Themed Style|Light Style 2|Plain Table 3/.test(e);
    const benzi = /Light|Grid Table [2-7]|List Table|Plain Table|Medium|Themed/.test(e) && !/Table Grid/.test(e);
    let t = '<rect x=".5" y=".5" width="' + (W - 1) + '" height="' + (H - 1) + '" fill="' + (intunecat ? (acc ? c : '#3b3b3b') : '#fff') + '" stroke="none"/>';
    if (benzi) for (let r = 1; r < 5; r += 2) t += '<rect x=".5" y="' + (r * rh) + '" width="' + (W - 1) + '" height="' + rh + '" fill="' + (intunecat ? '#fff' : c) + '" fill-opacity=".22"/>';
    if (antet) t += '<rect x=".5" y=".5" width="' + (W - 1) + '" height="' + (rh - .5) + '" fill="' + (intunecat ? '#000' : c) + '"/>';
    let linii = '';
    for (let r = 0; r <= 5; r++) if (grila || r === 0 || r === 1 || r === 5) linii += 'M.5 ' + Math.min(H - .5, r * rh + (r ? 0 : .5)) + 'h' + (W - 1);
    if (grila) for (let k = 0; k <= 5; k++) linii += 'M' + Math.min(W - .5, k * cw + (k ? 0 : .5)) + ' .5v' + (H - 1);
    t += '<path d="' + linii + '" fill="none" stroke="' + (intunecat ? '#fff' : acc ? c : '#7F7F7F') + '" stroke-width="' + (grila ? .8 : 1) + '"' + (grila ? '' : ' stroke-opacity=".8"') + '/>';
    return miniSvg(W, H, t);
  }
  /* Design › Style Set (Word): o pagină mică — titlu, un titlu de capitol, rânduri */
  function miniSetStiluri(e) {
    const an = /Black & White|Word 2003|Minimalist/.test(e), c = an ? '#000' : /Casual/.test(e) ? '#C55A11' : /Shaded|Lines/.test(e) ? '#1F3864' : '#2F5496';
    const mij = /Centered|Elegant/.test(e), x = mij ? 31 : 5, anc = mij ? 'middle' : 'start', it = /Casual|Elegant|Stylish/.test(e) ? ' font-style="italic"' : '';
    const F = ' font-family="Calibri,Carlito,Segoe UI,sans-serif"';
    return miniSvg(62, 46, '<rect x=".5" y=".5" width="61" height="45" fill="#fff" stroke="#c8c6c4"/>' +
      '<text x="' + x + '" y="13" text-anchor="' + anc + '" font-size="10"' + F + it + ' fill="#000">' + (/Capitalized/.test(e) ? 'TITLE' : 'Title') + '</text>' +
      (/Lines/.test(e) ? '<path d="M5 16.5h52" stroke="' + c + '" stroke-width="1"/>' : '') +
      (/Shaded/.test(e) ? '<rect x="4" y="19" width="54" height="8" fill="' + c + '"/>' : '') +
      '<text x="' + x + '" y="25.5" text-anchor="' + anc + '" font-size="6.5"' + F + ' fill="' + (/Shaded/.test(e) ? '#fff' : c) + '">' + (/Numbered/.test(e) ? '1  Heading 1' : 'Heading 1') + '</text>' +
      '<path d="M5 31.5h52M5 35.5h52M5 39.5h34" stroke="#8a8886" stroke-width="1"/>');
  }
  /* Design › Themes (PowerPoint): fundalul, „Aa” și patru culori ale temei. Doar Office Theme are culorile cunoscute; restul [DEDUS] */
  const TEME = {
    'Office Theme': ['#FFFFFF', '#000000', '#4472C4', '#ED7D31', '#A5A5A5', '#FFC000'], Archway: ['#F5F1E9', '#3B3B3B', '#B5562B', '#D9A441', '#6E8B74', '#3F6C8A'],
    Axis: ['#FFFFFF', '#1F2A44', '#C8102E', '#1F2A44', '#8C8C8C', '#E6B800'], Bjorn: ['#EDE6DA', '#2B2B2B', '#3E6B5A', '#C96F4A', '#D8B45A', '#5B6F8C'],
    'Dark Gradient': ['#1B1B2F', '#FFFFFF', '#7B5CD6', '#3FA7D6', '#E84A8A', '#F2B134'], Dune: ['#F3E9DC', '#4A3728', '#C48A4A', '#8C5A3C', '#D9B38C', '#6B7F6A'],
    Editorial: ['#FFFFFF', '#111111', '#D7263D', '#111111', '#8A8A8A', '#F2C14E'], 'Film Burn': ['#1A1A1A', '#FFFFFF', '#E4572E', '#F3A712', '#A8C686', '#669BBC'],
    Helena: ['#F7F3EE', '#333333', '#7A9E9F', '#B8D8D8', '#FE5F55', '#EEC170'], Ion: ['#1E4E5F', '#FFFFFF', '#4E67C8', '#5ECCF3', '#A7EA52', '#5DCEAF'],
    Lines: ['#FFFFFF', '#222222', '#2E75B6', '#222222', '#9DC3E6', '#F4B183'], Modulo: ['#FFFFFF', '#222222', '#00A6A6', '#F25F5C', '#FFE066', '#247BA0'],
    'Orange Experience': ['#FFFFFF', '#333333', '#F28C28', '#333333', '#FFC27A', '#8C8C8C'], 'School Days': ['#FFF9E8', '#2B2B2B', '#2D7DD2', '#EEB902', '#F45D01', '#97CC04'],
    Shoji: ['#F5F5F0', '#222222', '#B22222', '#222222', '#8C8C8C', '#D9CBA3'], Dividend: ['#3B2E2A', '#FFFFFF', '#4D1434', '#903163', '#B2324B', '#969FA7'],
    Frame: ['#3D3D2F', '#FFFFFF', '#40BAD2', '#FAB900', '#90BB23', '#EE7008'], Mesh: ['#262626', '#FFFFFF', '#6F6F6F', '#BFBFA5', '#DCD084', '#E7BF5F']
  };
  function miniTema(e) {
    const t = TEME[e] || TEME['Office Theme'];
    let b = '';
    for (let i = 0; i < 4; i++) b += '<rect x="' + (8 + i * 14) + '" y="31" width="12" height="5" fill="' + t[2 + i] + '"/>';
    return miniSvg(74, 44, '<rect x=".5" y=".5" width="73" height="43" fill="' + t[0] + '" stroke="#c8c6c4"/>' +
      '<text x="8" y="24" font-family="Calibri,Carlito,Segoe UI,sans-serif" font-size="19" fill="' + t[1] + '">Aa</text>' + b);
  }
  /* Transitions › Transition Effects: un diapozitiv mic cu semnul felului de trecere + numele dedesubt (ca în PowerPoint). Desenul e
     pe familii de efecte, nu câte unul pentru fiecare efect [DEDUS] */
  function miniTranzitie(e) {
    const S = '<rect x="5.5" y="3.5" width="25" height="17" fill="#fff" stroke="#8a8886"/>', A = d => '<path d="' + d + '" fill="none" stroke="#c43e1c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>';
    let d;
    if (e === 'None') d = S;
    else if (/^(Split|Doors|Curtains|Window|Prestige)$/.test(e)) d = S + '<path d="M18 3.5v17" stroke="#8a8886"/>' + A('M15 12H9m2.5-2.5L9 12l2.5 2.5M21 12h6m-2.5-2.5L27 12l-2.5 2.5');
    else if (/^(Shape|Zoom|Box)$/.test(e)) d = S + (e === 'Shape' ? '<ellipse cx="18" cy="12" rx="7" ry="5" fill="none" stroke="#c43e1c" stroke-width="1.5"/>' : '<rect x="11" y="7.5" width="14" height="9" fill="none" stroke="#c43e1c" stroke-width="1.5"/>');
    else if (e === 'Clock') d = S + '<circle cx="18" cy="12" r="6" fill="none" stroke="#c43e1c" stroke-width="1.5"/>' + A('M18 12V7.5M18 12l3 2');
    else if (/^(Random Bars|Blinds|Comb|Checkerboard)$/.test(e)) d = S + '<path d="M6 7h24M6 11h24M6 15h24M6 19h24" stroke="#c43e1c" stroke-width="1.5" stroke-dasharray="' + (e === 'Blinds' ? 'none' : '5 3') + '"/>';
    else if (e === 'Cut') d = S + '<path d="M18 3.5v17" stroke="#c43e1c" stroke-width="1.5" stroke-dasharray="2 2"/>';
    else if (/^(Fade|Dissolve|Morph|Reveal|Flash|Glitter|Ripple|Honeycomb|Vortex|Fracture|Crush|Shred|Random)$/.test(e)) d = '<rect x="3.5" y="2.5" width="22" height="15" fill="#fff" stroke="#8a8886"/><rect x="10.5" y="6.5" width="22" height="15" fill="#c43e1c" fill-opacity=".35" stroke="#c43e1c"/>';
    else d = S + A('M11 12h13m-4-4 4 4-4 4');
    return miniSvg(36, 24, d) + numeMini(e);
  }
  /* Animations › Animation Styles: steaua în culoarea felului (verde intrare, galben accent, roșu ieșire), linie pentru căile de
     mișcare; felul se ia din ordinea galeriei (None, [Replay, Rewind], Appear… = intrare, Pulse… = accent, Disappear… = ieșire,
     Lines… = căi), fiindcă Fade / Split / Wipe apar și la intrare, și la ieșire */
  function miniAnimatie(n, frati) {
    let fel = 'nimic';
    for (const s of frati || []) {
      if (s.e === 'Appear') fel = 'intrare'; else if (s.e === 'Pulse') fel = 'accent'; else if (s.e === 'Disappear') fel = 'iesire'; else if (s.e === 'Lines') fel = 'cale';
      if (s === n) break;
    }
    if (fel === 'nimic' && n.e !== 'None') fel = 'media';
    const STEA = 'M12 2.5l2.800 6 6.5.800-4.800 4.5 1.300 6.5L12 17l-5.800 3.300 1.300-6.5L2.700 9.300l6.5-.800z';
    const c = { intrare: '#3DAE49', accent: '#F2B200', iesire: '#E0443C' }[fel];
    const d = fel === 'cale' ? '<path d="M3 19C8 4 14 20 21 5" fill="none" stroke="#605e5c" stroke-width="1.5"/><circle cx="3" cy="19" r="2" fill="#3DAE49"/><circle cx="21" cy="5" r="2" fill="#E0443C"/>' :
      fel === 'media' ? '<path d="' + (n.e === 'Rewind' ? 'M17 5v14L6 12z' : 'M7 5v14l11-7z') + '" fill="#605e5c"/>' :
        '<path d="' + STEA + '" fill="' + (c || 'none') + '" stroke="' + (c ? '#00000033' : '#8a8886') + '" stroke-width="1"/>';
    return miniSvg(24, 24, d) + numeMini(n.e);
  }
  function miniatura(I, n, ct) {
    const e = String(n.e || '');
    if (!e || /^\[/.test(e)) return '';
    switch (ct.galerieId) {
      case 'ShapesInsertGallery': return miniForma(e);
      case 'ShapeStylesGallery': return miniStilForma(e);
      case 'TextStylesGallery': return miniWordArt(e);
      case 'PictureStylesGallery': return miniStilPoza(e);
      case 'TableStylesGalleryWord': case 'TableStylesGallery': return miniStilTabel(e);
      case 'QuickStylesSets': return miniSetStiluri(e);
      case 'SlideThemesGallery': return miniTema(e);
      case 'AnimationTransitionGallery': return miniTranzitie(e);
      case 'AnimationGallery': return miniAnimatie(n, ct.frati);
    }
    return '';
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
    /* lansatorul unui grup: butonul mic din colțul grupului; pe panglică îl recunoaștem după mărime (12–18 px), fiindcă numele
       lui nu se termină mereu în „...” (Excel: „Page Setup”, „Sheet Options”, „Recommended Charts”) */
    const eLansator = t === 'Button' && w <= 18 && h <= 18 && (/\.\.\.$/.test(n.e || '') || (fel === 'panglica' && w >= 12 && h >= 12));
    /* caseta unei galerii din panglică (MenuItem fără nume, cu elementele ei drept copii): nu are desen propriu — altfel un
       pătrățel și o săgeată apăreau în mijlocul galeriei, peste elemente */
    if (fel === 'panglica' && t === 'MenuItem' && !n.e && n.c && n.c.length) return {};
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
    /* săgețile unei casete cu număr (Spinner › Button „More” / „Less”): ▲ ▼, nu pătrățel */
    if (ctx.parinteUnit && ctx.parinteUnit.t === 'Spinner' && t === 'Button') return { spin: /More|Up|Increase|sus/i.test(n.e || '') ? 'sus' : 'sageata' };
    if (eLansator) return { lansator: true };
    const mare = h >= 56;
    if (fel === 'panglica' || fel === 'meniu') {
      if (ctx.inUnelte && t === 'SplitButton') return { unealta: true };
      if (ctx.inGalerie && t === 'ListItem') return ctx.galerieStiluri ? { text: n.e, previzualizare: true } : { icoana: true, miniatura: fel === 'panglica' };
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
      if (n.t === 'SplitButton') return (n.c && n.c.length) || !e ? null : 'panglica:' + baza + '/' + e;   // părțile lui (butonul și săgeata) poartă țintele; fără părți = el însuși
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
    let html = '', mini = '';
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
    } else if (eUnit && (t !== 'SplitButton' || !(n.c && n.c.length))) {
      const m = a.mare ? 32 : 16;
      let ic = '';
      if (a.unealta) ic = unealta(I, n) || literaFaraIcoana(n, 24);
      else if (a.lansator) ic = glif('lansator', 12);
      else if (a.spin) ic = glif(a.spin, 9);
      else if (a.caseta) ic = '<span class="lh-ap-caseta' + (t === 'RadioButton' ? ' lh-ap-radio' : '') + '" aria-hidden="true">' +
        (n.b === 1 ? glif(t === 'RadioButton' ? 'punct' : 'bifa', 12) : '') + '</span>';
      else if (a.icoana) {
        const id = n.id || (ct.parinteUnit && ct.parinteUnit.id) || idDupaNume(I, n.e) || (ct.parinteUnit && idDupaNume(I, ct.parinteUnit.e));
        ic = (!n.id && ct.fel === 'panglica' && icoanaNume(I, n.e, m)) || icoana(I, id, m);
        if (!ic && ct.fel === 'titlu') ic = glif(/Minimize/.test(n.e) ? 'minim' : /Maximize|Restore/.test(n.e) ? 'maxim' : /Close/.test(n.e) ? 'inchide' : /Help/.test(n.e) ? 'ajutor' : 'cauta', 16);
        if (!ic && ct.inTitluDialog) ic = glif(/Închidere|Close/.test(n.e) ? 'inchide' : 'ajutor', 14);
        if (!ic && ct.fel === 'stare') ic = glif(/Zoom Out/.test(n.e) ? 'minus' : /Zoom In/.test(n.e) ? 'plus' : /Read Mode/.test(n.e) ? 'citire' : /Web Layout/.test(n.e) ? 'web' : /Print Layout/.test(n.e) ? 'pagina' : 'punct', 14);
        if (!ic && ct.parinteUnit && /More Options/.test(n.e || '')) ic = '';
        if (!ic && !(ct.parinteUnit && /More Options/.test(n.e || '')) && !a.text) ic = literaFaraIcoana(n, m);
        if (ic && !/^<svg|^<span/.test(ic)) ic = '';
        /* elementul unei galerii din panglică: miniatura desenată din numele lui (vezi miniatura) */
        if (a.miniatura) { mini = miniatura(I, n, ct); if (mini) { ic = mini; if (/lh-ap-mini-nume/.test(mini)) el.classList.add('lh-ap-dala-mini'); } }
      }
      const txt = a.text ? '<span class="lh-ap-text' + (a.previzualizare ? ' lh-ap-text-nume' : '') + '">' + esc(a.text) + '</span>' : '';
      const prev = a.previzualizare ? '<span class="lh-ap-prev" aria-hidden="true">AaBbCcDd</span>' : '';
      const sag = a.sageata ? glifSageata : '';
      if (a.mare) el.classList.add('lh-ap-mare');
      if (a.rand) el.classList.add('lh-ap-rand');
      if (a.unealta) {
        /* unealta aleasă: una singură în galerie; alegerea se ține minte pe instanță (panglica se redesenează la schimbarea filei) */
        const cheieU = ct.cheie + '/' + ((ct.listaUnelte || {}).e || '');
        I._unealta = I._unealta || {};
        el.classList.add('lh-ap-unealta');
        const pune = on => { el.classList.toggle('lh-ap-ales', on); el.setAttribute('aria-pressed', on ? 'true' : 'false'); };
        pune(I._unealta[cheieU] === n.e);
        el.addEventListener('click', () => {
          if (n.a === 0) return;
          I._unealta[cheieU] = n.e;
          if (el.parentNode) el.parentNode.querySelectorAll('.lh-ap-unealta').forEach(x => { x.classList.remove('lh-ap-ales'); x.setAttribute('aria-pressed', 'false'); });
          pune(true);
        });
      }
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
    /* aplicația și-a pus propriul conținut în element (opt.la) fără niciun desen: miniatura bibliotecii rămâne */
    if (mini && !el.querySelector('svg')) el.innerHTML = mini;
    /* copiii */
    if (n.c && n.c.length) {
      const c2 = Object.assign({}, ct, { adancime: ct.adancime + 1 });
      if (ct.fel === 'panglica' && t === 'Group' && ct.adancime === 2) c2.grup = n.e;
      if (eUnit) c2.parinteUnit = n;
      if (t === 'DataGrid' || (t === 'MenuItem' && !n.e)) c2.inGalerie = true;
      if (t === 'MenuItem' && !n.e && n.id) c2.galerieId = n.id;
      if (t === 'DataGrid') c2.frati = n.c;
      /* galeria de unelte: orice List ai cărei copii sunt SplitButton fără idMso și fără părți (Draw › Drawing Tools) */
      if (t === 'List' && n.c.some(c => c.t === 'SplitButton' && !c.id && !(c.c && c.c.length))) { c2.inUnelte = true; c2.listaUnelte = n; }
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

  /* rotița pe panglică (27.11): bara de derulare de sub panglică nu se mai vede (aplicatii.css — în Office nu există), deci
     rotița mouse-ului ținută pe panglică o derulează lateral cât timp banda nu încape (laboratorul, 1366 px; ecranele mai
     înguste: grupurile din dreapta). Degetul, Shift+rotița și glisarea laterală pe touchpad rămân ale browserului. La capătul
     benzii (sau dacă rotița e pe o listă care se derulează singură) rotița rămâne a paginii / a listei. */
  if (!L._rotitaPanglica) {
    L._rotitaPanglica = true;
    document.addEventListener('wheel', e => {
      if (e.defaultPrevented || e.ctrlKey || e.shiftKey || Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return;
      const t = e.target, s = t && t.closest ? t.closest('.lh-ap-sus') : null;
      if (!s) return;
      const max = s.scrollWidth - s.clientWidth;
      if (max <= 0) return;
      for (let n = t; n && n !== s; n = n.parentElement) {
        if (n.scrollHeight > n.clientHeight + 1 && /(auto|scroll)/.test(getComputedStyle(n).overflowY)) return;
      }
      const pas = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? s.clientWidth : 1);
      const nou = Math.max(0, Math.min(max, s.scrollLeft + pas));
      if (Math.abs(nou - s.scrollLeft) < 0.5) return;
      s.scrollLeft = nou;
      e.preventDefault();
    }, { passive: false });
  }

  L._modul('panglica', { deseneaza, icoana, icoanaNume, unealta, glif, svg, felSuprafata, tintaImplicita, afisare, esc });
})();
