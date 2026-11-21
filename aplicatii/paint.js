/* paint.js — Paint (Windows 11, română) în biblioteca centrală (api_biblioteca.md §1-§8).
   Interfața (bara de titlu, meniul Fișier, filele Pornire / Vizualizare, bara de stare) e desenată aici, în stilul celorlalte
   aplicații. Paleta de culori vine din date/paint.json (aceeași paletă de 20 de culori ca în lecțiile Paint).
   Pânza e un canvas 2D real: creionul, pensula, radiera, umplerea, selectorul de culoare, lupa, selecția dreptunghiulară,
   formele (linie, dreptunghi, elipsă, săgeată) și textul desenează pe pixeli. Zoom, Anulare/Refacere (Ctrl+Z / Ctrl+Y),
   Nou / Deschidere / Salvați / Salvați ca (Ctrl+N, Ctrl+O, Ctrl+S, Ctrl+Shift+S).
   Magazia de fișiere e în memorie: L._module.paint.magazie = { nume: „data:image/png;base64,…” }. Fără descărcare, fără fisiere.js.
   Stare (I.stare, LH.aplicatii.stare('paint')): aplicatie, unealta, culoare1, culoare2, dimensiune, panza {latime, inaltime},
   zoom, pixeli_schimbati, nesalvat, nume_fisier, istoric {anulare, refacere}, cursor, selectie. */
(function () {
  'use strict';
  const L = window.LH && window.LH.aplicatii;
  if (!L) return;

  const MAGAZIE = {};                                                   // fișierele salvate în memorie: nume -> PNG (dataURL)
  const ZOOM = [12.5, 25, 50, 100, 200, 400, 800];                      // pașii din bara de stare (procente)
  const DIMENSIUNI = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 30, 40, 50];
  const UNELTE = { creion: 'Creion', pensula: 'Pensulă', umplere: 'Umplere cu culoare', text: 'Text', radiera: 'Radieră',
    pipeta: 'Selector de culoare', lupa: 'Lupă', selectie: 'Selectare dreptunghi',
    linie: 'Linie', dreptunghi: 'Dreptunghi', elipsa: 'Elipsă', sageata: 'Săgeată' };
  const FORME = ['linie', 'dreptunghi', 'elipsa', 'sageata'];
  const LIMITA_ISTORIC = 40;

  const CSS = `
.lh-ap-pt{display:flex;flex-direction:column;height:min(640px,92vh);min-height:460px;font:12px "Segoe UI",system-ui,sans-serif;background:#f3f3f3;color:#1a1a1a;border:1px solid #bdbdbd;box-sizing:border-box;position:relative;user-select:none}
.lh-ap-pt *{box-sizing:border-box}
.lh-ap-pt-titlu{display:flex;align-items:center;height:32px;background:#fff;border-bottom:1px solid #e0e0e0;padding:0 8px;gap:8px}
.lh-ap-pt-titlu .lh-ap-pt-t{flex:1;text-align:center;color:#333}
.lh-ap-pt-fisier{border:0;background:#1f6fbf;color:#fff;padding:4px 12px;height:32px;cursor:pointer;font:inherit}
.lh-ap-pt-fisier[aria-expanded="true"]{background:#185a9d}
.lh-ap-pt-meniu{position:absolute;left:8px;top:33px;z-index:5;background:#fff;border:1px solid #bdbdbd;box-shadow:0 4px 12px rgba(0,0,0,.2);min-width:230px;display:flex;flex-direction:column;padding:4px 0}
.lh-ap-pt-meniu[hidden]{display:none}
.lh-ap-pt-meniu button{border:0;background:none;text-align:left;padding:6px 16px;cursor:pointer;font:inherit;display:flex;justify-content:space-between;gap:24px}
.lh-ap-pt-meniu button:hover{background:#e5f1fb}
.lh-ap-pt-meniu button span{color:#666}
.lh-ap-pt-file{display:flex;border-bottom:1px solid #d6d6d6;background:#fff}
.lh-ap-pt-file button{border:0;background:none;padding:6px 14px;cursor:pointer;font:inherit}
.lh-ap-pt-file button[aria-selected="true"]{border-bottom:2px solid #1f6fbf;color:#1f6fbf;font-weight:600}
.lh-ap-pt-panglica{display:flex;flex-wrap:wrap;gap:10px;align-items:stretch;padding:6px 8px;background:#fff;border-bottom:1px solid #d6d6d6;min-height:86px}
.lh-ap-pt-panglica[hidden]{display:none}
.lh-ap-pt-grup{display:flex;flex-direction:column;gap:4px;border-right:1px solid #e3e3e3;padding-right:10px}
.lh-ap-pt-grup-t{color:#666;font-size:11px;text-align:center;margin-top:auto}
.lh-ap-pt-rand{display:flex;flex-wrap:wrap;gap:3px;max-width:340px}
.lh-ap-pt-btn{border:1px solid transparent;background:#fff;min-width:50px;height:40px;padding:2px 4px;cursor:pointer;font:inherit;font-size:11px;border-radius:3px;color:#1a1a1a}
.lh-ap-pt-btn:hover{border-color:#cfd6dd;background:#f0f6fb}
.lh-ap-pt-btn[aria-pressed="true"]{border-color:#1f6fbf;background:#cfe6f9}
.lh-ap-pt-btn:disabled{color:#aaa;cursor:default;background:#fff;border-color:transparent}
.lh-ap-pt-sel{height:28px;font:inherit;min-width:64px}
.lh-ap-pt-pal{display:grid;grid-template-columns:repeat(10,16px);gap:3px}
.lh-ap-pt-sw{width:16px;height:16px;border:1px solid #888;padding:0;cursor:pointer;border-radius:2px}
.lh-ap-pt-sw[aria-pressed="true"]{outline:2px solid #1f6fbf;outline-offset:1px}
.lh-ap-pt-fg{display:flex;gap:6px;align-items:flex-end}
.lh-ap-pt-cerc{width:26px;height:26px;border-radius:50%;border:1px solid #666;cursor:pointer;padding:0}
.lh-ap-pt-cerc[aria-pressed="true"]{outline:2px solid #1f6fbf;outline-offset:2px}
.lh-ap-pt-zona{flex:1;overflow:auto;position:relative;background:#c9c9c9;padding:12px;min-height:200px}
.lh-ap-pt-cadru{position:relative;margin:0 auto;background:#fff;box-shadow:0 0 0 1px #888}
.lh-ap-pt-pan{display:block;image-rendering:pixelated;cursor:crosshair;touch-action:none;background:#fff}
.lh-ap-pt-pan:focus{outline:none}
.lh-ap-pt-text{position:absolute;border:1px dashed #1f6fbf;background:transparent;font:16px Calibri,Carlito,Arial,sans-serif;padding:0;margin:0;outline:none;min-width:40px}
.lh-ap-pt-dlg{position:absolute;left:50%;top:40px;transform:translateX(-50%);z-index:6;background:#fff;border:1px solid #888;box-shadow:0 6px 18px rgba(0,0,0,.3);padding:12px;min-width:320px;max-height:70%;overflow:auto}
.lh-ap-pt-dlg[hidden]{display:none}
.lh-ap-pt-dlg-t{font-weight:600;margin-bottom:8px}
.lh-ap-pt-dlg-r{display:flex;gap:8px;justify-content:flex-end;margin-top:10px}
.lh-ap-pt-dlg button,.lh-ap-pt-dlg-fis{border:1px solid #adadad;background:#fff;padding:4px 12px;cursor:pointer;font:inherit;display:block;width:100%;text-align:left;margin-top:4px}
.lh-ap-pt-dlg-r button{width:auto;margin-top:0}
.lh-ap-pt-dlg-r .lh-ap-pt-pr{background:#1f6fbf;color:#fff;border-color:#1f6fbf}
.lh-ap-pt-dlg input{width:100%;font:inherit;padding:4px}
.lh-ap-pt-bara{display:flex;justify-content:space-between;align-items:center;gap:12px;height:26px;padding:0 10px;background:#f3f3f3;border-top:1px solid #d6d6d6;color:#333}
.lh-ap-pt-bara button{border:0;background:none;cursor:pointer;font:inherit;padding:0 6px;height:22px}
.lh-ap-pt-bara-zoom{display:flex;align-items:center;gap:4px}
`;

  function css() {
    if (document.getElementById('lh-ap-paint-css')) return;
    const s = document.createElement('style');
    s.id = 'lh-ap-paint-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function el(tag, cls, attrs, kids) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (attrs) for (const k of Object.keys(attrs)) e.setAttribute(k, attrs[k]);
    (kids || []).forEach(k => { if (k != null) e.appendChild(typeof k === 'string' ? document.createTextNode(k) : k); });
    return e;
  }

  function hexRgba(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 255]; }
  function rgbHex(r, g, b) { return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join(''); }

  function creeaza(I, c, L) {
    css();
    const root = I.root, date = I.date || {};
    const paleta = date.paleta || [['#000000', 'Negru'], ['#ffffff', 'Alb']];
    const numeCuloare = h => { const p = paleta.find(x => x[0] === h); return p ? p[1] : h; };
    const panza0 = Object.assign({ latime: 640, inaltime: 480 }, (date.panza || {}), (c && c.panza) || {});
    const S = { unealta: 'creion', c1: paleta[0][0], c2: '#ffffff', dim: 3, zoom: 100, nume: null, nesalvat: false,
      cursor: null, selectie: null };
    let W = panza0.latime, H = panza0.inaltime;
    const ANULARE = [], REFACERE = [];
    let op = null;                                                      // gestul în curs (creion, forme, selecție)

    /* ---------- pânza ---------- */
    const pan = el('canvas', 'lh-ap-pt-pan', { 'data-lh-zona': 'panza', tabindex: '0', 'aria-label': 'Pânză de desen' });
    const ctx = pan.getContext('2d', { willReadFrequently: true });
    const cadru = el('div', 'lh-ap-pt-cadru');
    cadru.appendChild(pan);
    const zona = el('div', 'lh-ap-pt-zona', { 'data-lh-zona': 'zona_panza' }, [cadru]);

    function fundal() { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H); }
    function dimensiuniPanza(w, h) {
      W = w; H = h; pan.width = w; pan.height = h;
      fundal(); aplicaZoom(S.zoom);
    }
    const snap = () => ctx.getImageData(0, 0, W, H);
    const pune = img => ctx.putImageData(img, 0, 0);
    function consemneaza(baza) {
      ANULARE.push(baza);
      if (ANULARE.length > LIMITA_ISTORIC) ANULARE.shift();
      REFACERE.length = 0;
      S.nesalvat = true;
      actualizeaza();
    }

    /* ---------- zoom ---------- */
    function aplicaZoom(z) {
      S.zoom = z;
      pan.style.width = (W * z / 100) + 'px';
      pan.style.height = (H * z / 100) + 'px';
      cadru.style.width = pan.style.width;
      cadru.style.height = pan.style.height;
      actualizeaza();
    }
    function pasZoom(dir) {
      let i = ZOOM.indexOf(S.zoom);
      if (i < 0) i = ZOOM.findIndex(z => z >= S.zoom);
      if (i < 0) i = ZOOM.length - 1;
      i = Math.max(0, Math.min(ZOOM.length - 1, i + dir));
      aplicaZoom(ZOOM[i]);
    }
    function potrivesteZoom() {
      const lat = (zona.clientWidth - 40) / W * 100, inal = (zona.clientHeight - 40) / H * 100;
      aplicaZoom(Math.max(12.5, Math.min(100, Math.floor(Math.min(lat, inal) * 10) / 10)));
    }

    /* ---------- coordonate ---------- */
    function punct(e) {
      const r = pan.getBoundingClientRect();
      const x = Math.floor((e.clientX - r.left) * W / r.width), y = Math.floor((e.clientY - r.top) * H / r.height);
      return { x: Math.max(0, Math.min(W - 1, x)), y: Math.max(0, Math.min(H - 1, y)) };
    }

    /* ---------- unelte și culori ---------- */
    function setStil(col) {
      ctx.strokeStyle = col; ctx.fillStyle = col;
      ctx.lineWidth = S.dim; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    }
    function umple(x, y, col) {
      const img = ctx.getImageData(0, 0, W, H), d = img.data;
      const i0 = (y * W + x) * 4;
      const t = [d[i0], d[i0 + 1], d[i0 + 2], d[i0 + 3]], f = hexRgba(col);
      if (t[0] === f[0] && t[1] === f[1] && t[2] === f[2]) return false;
      const st = [x, y]; let n = 0;
      while (st.length) {
        const py = st.pop(), px = st.pop(), i = (py * W + px) * 4;
        if (d[i] !== t[0] || d[i + 1] !== t[1] || d[i + 2] !== t[2] || d[i + 3] !== t[3]) continue;
        d[i] = f[0]; d[i + 1] = f[1]; d[i + 2] = f[2]; d[i + 3] = 255; n++;
        if (px > 0) st.push(px - 1, py);
        if (px < W - 1) st.push(px + 1, py);
        if (py > 0) st.push(px, py - 1);
        if (py < H - 1) st.push(px, py + 1);
      }
      ctx.putImageData(img, 0, 0);
      return n > 0;
    }
    function formaPeCanvas(o, p, e) {
      let x1 = p.x + 0.5, y1 = p.y + 0.5;
      const x0 = o.x0 + 0.5, y0 = o.y0 + 0.5;
      const dx = p.x - o.x0, dy = p.y - o.y0;
      if (e && e.shiftKey) {
        if (o.tip === 'dreptunghi' || o.tip === 'elipsa') {
          const m = Math.max(Math.abs(dx), Math.abs(dy));
          x1 = o.x0 + Math.sign(dx || 1) * m + 0.5; y1 = o.y0 + Math.sign(dy || 1) * m + 0.5;
        } else {
          const a = Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) * (Math.PI / 4), r = Math.hypot(dx, dy);
          x1 = o.x0 + Math.round(Math.cos(a) * r) + 0.5; y1 = o.y0 + Math.round(Math.sin(a) * r) + 0.5;
        }
      }
      setStil(o.col);
      ctx.beginPath();
      if (o.tip === 'linie' || o.tip === 'sageata') {
        ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
        if (o.tip === 'sageata') {
          const ang = Math.atan2(y1 - y0, x1 - x0), L2 = 6 + S.dim * 2;
          ctx.beginPath(); ctx.moveTo(x1, y1);
          ctx.lineTo(x1 - L2 * Math.cos(ang - 0.45), y1 - L2 * Math.sin(ang - 0.45));
          ctx.moveTo(x1, y1);
          ctx.lineTo(x1 - L2 * Math.cos(ang + 0.45), y1 - L2 * Math.sin(ang + 0.45));
          ctx.stroke();
        }
      } else if (o.tip === 'dreptunghi') {
        ctx.strokeRect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0));
      } else if (o.tip === 'elipsa') {
        ctx.ellipse((x0 + x1) / 2, (y0 + y1) / 2, Math.abs(x1 - x0) / 2, Math.abs(y1 - y0) / 2, 0, 0, 2 * Math.PI);
        ctx.stroke();
      }
      o.x1 = Math.round(x1 - 0.5); o.y1 = Math.round(y1 - 0.5);
    }
    function selectieCanvas(o) {
      ctx.save();
      ctx.strokeStyle = '#000'; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
      ctx.strokeRect(Math.min(o.x0, o.x1) + 0.5, Math.min(o.y0, o.y1) + 0.5, Math.abs(o.x1 - o.x0), Math.abs(o.y1 - o.y0));
      ctx.restore();
    }

    function deseneazaText(p, txt) {
      const baza = snap();
      ctx.font = '16px Calibri, Carlito, Arial, sans-serif';
      ctx.fillStyle = S.c1; ctx.textBaseline = 'top';
      ctx.fillText(txt, p.x, p.y);
      consemneaza(baza);
    }
    let casetaText = null;
    function deschideText(p) {
      inchideText(false);
      const inp = el('input', 'lh-ap-pt-text', { type: 'text', 'aria-label': 'Text' });
      inp.style.left = (p.x * S.zoom / 100) + 'px';
      inp.style.top = (p.y * S.zoom / 100) + 'px';
      cadru.appendChild(inp);
      casetaText = { inp, p, gata: false };
      const fin = () => inchideText(true);
      inp.addEventListener('keydown', ev => {
        if (ev.key === 'Enter') { ev.preventDefault(); fin(); }
        if (ev.key === 'Escape') { ev.preventDefault(); inchideText(false); }
        ev.stopPropagation();
      });
      inp.addEventListener('blur', fin);
      setTimeout(() => { try { inp.focus(); } catch (e) { /* */ } }, 0);
    }
    function inchideText(scrie) {
      if (!casetaText || casetaText.gata) return;
      casetaText.gata = true;
      const { inp, p } = casetaText;
      const txt = inp.value;
      casetaText = null;
      if (inp.parentNode) inp.parentNode.removeChild(inp);
      if (scrie && txt.trim()) deseneazaText(p, txt);
      try { pan.focus({ preventScroll: true }); } catch (e) { /* */ }
    }

    /* ---------- pointer pe pânză ---------- */
    pan.addEventListener('pointerdown', e => {
      try { pan.focus({ preventScroll: true }); } catch (er) { /* */ }
      const p = punct(e);
      S.cursor = p; actualizeaza();
      const u = S.unealta, dreapta = e.button === 2;
      if (u === 'lupa') { pasZoom(dreapta ? -1 : 1); return; }
      if (u === 'pipeta') {
        const d = ctx.getImageData(p.x, p.y, 1, 1).data;
        const h = rgbHex(d[0], d[1], d[2]);
        if (dreapta) S.c2 = h; else S.c1 = h;
        actualizeaza(); return;
      }
      if (u === 'umplere') {
        const baza = snap();
        if (umple(p.x, p.y, dreapta ? S.c2 : S.c1)) consemneaza(baza);
        return;
      }
      if (u === 'text') { deschideText(p); return; }
      try { pan.setPointerCapture(e.pointerId); } catch (er) { /* */ }
      const col = dreapta ? S.c2 : S.c1;
      op = { tip: u, col, baza: snap(), x0: p.x, y0: p.y, x1: p.x, y1: p.y };
      if (u === 'creion' || u === 'pensula' || u === 'radiera') {
        setStil(u === 'radiera' ? S.c2 : col);
        if (u === 'creion') { ctx.lineWidth = 1; ctx.lineCap = 'square'; }
        if (u === 'radiera') ctx.lineCap = 'square';
        ctx.beginPath(); ctx.moveTo(p.x + 0.5, p.y + 0.5); ctx.lineTo(p.x + 0.5, p.y + 0.5); ctx.stroke();
      }
      if (u === 'selectie') { S.selectie = null; }
    });
    pan.addEventListener('pointermove', e => {
      const p = punct(e);
      S.cursor = p;
      if (!op) { refreshBara(); return; }
      const u = op.tip;
      if (u === 'creion' || u === 'pensula' || u === 'radiera') {
        ctx.lineTo(p.x + 0.5, p.y + 0.5); ctx.stroke();
        op.x1 = p.x; op.y1 = p.y;
      } else if (u === 'selectie') {
        pune(op.baza); op.x1 = p.x; op.y1 = p.y; selectieCanvas(op);
      } else {
        pune(op.baza); formaPeCanvas(op, p, e);
      }
      refreshBara();
    });
    function termina(e) {
      if (!op) return;
      const o = op; op = null;
      try { pan.releasePointerCapture(e.pointerId); } catch (er) { /* */ }
      if (o.tip === 'selectie') {
        pune(o.baza);
        S.selectie = { x0: Math.min(o.x0, o.x1), y0: Math.min(o.y0, o.y1), x1: Math.max(o.x0, o.x1), y1: Math.max(o.y0, o.y1) };
        actualizeaza(); return;
      }
      if (o.tip === 'creion' || o.tip === 'pensula' || o.tip === 'radiera') { ctx.closePath(); consemneaza(o.baza); return; }
      pune(o.baza);
      const p = { x: o.x1, y: o.y1 };
      formaPeCanvas(o, p, e);
      if (o.x1 !== o.x0 || o.y1 !== o.y0) consemneaza(o.baza);
      else actualizeaza();
    }
    pan.addEventListener('pointerup', termina);
    pan.addEventListener('pointercancel', termina);
    pan.addEventListener('pointerleave', () => { S.cursor = null; refreshBara(); });
    pan.addEventListener('contextmenu', e => e.preventDefault());

    /* ---------- anulare / refacere ---------- */
    function anuleaza() {
      if (!ANULARE.length) return;
      REFACERE.push(snap()); pune(ANULARE.pop()); S.nesalvat = true; actualizeaza();
    }
    function refa() {
      if (!REFACERE.length) return;
      ANULARE.push(snap()); pune(REFACERE.pop()); S.nesalvat = true; actualizeaza();
    }
    function stergeSelectia() {
      if (!S.selectie) return;
      const s = S.selectie, baza = snap();
      ctx.fillStyle = S.c2;
      ctx.fillRect(s.x0, s.y0, s.x1 - s.x0 + 1, s.y1 - s.y0 + 1);
      consemneaza(baza);
    }
    function selecteazaTot() { S.selectie = { x0: 0, y0: 0, x1: W - 1, y1: H - 1 }; actualizeaza(); }

    /* ---------- fișiere (magazia în memorie) ---------- */
    function nou() {
      inchideDialog(); inchideMeniu();
      ANULARE.length = 0; REFACERE.length = 0; S.selectie = null;
      S.nume = null; S.nesalvat = false;
      dimensiuniPanza(panza0.latime, panza0.inaltime);
      actualizeaza();
    }
    function deschideFisier(nume) {
      const src = MAGAZIE[nume];
      if (!src) return false;
      const img = new Image();
      img.onload = () => {
        ANULARE.length = 0; REFACERE.length = 0; S.selectie = null;
        dimensiuniPanza(img.naturalWidth, img.naturalHeight);
        ctx.drawImage(img, 0, 0);
        S.nume = nume; S.nesalvat = false;
        actualizeaza();
      };
      img.src = src;
      return true;
    }
    function salveazaCa(nume) {
      let n = String(nume || '').trim() || 'Fără titlu.png';
      if (!/\.png$/i.test(n)) n += '.png';
      MAGAZIE[n] = pan.toDataURL('image/png');
      S.nume = n; S.nesalvat = false;
      inchideDialog();
      actualizeaza();
      return n;
    }
    function salveaza() {
      if (!S.nume) return salveazaCaDialog();
      MAGAZIE[S.nume] = pan.toDataURL('image/png'); S.nesalvat = false; actualizeaza();
      return S.nume;
    }

    /* ---------- dialoguri și meniu ---------- */
    const dlg = el('div', 'lh-ap-pt-dlg', { hidden: '', role: 'dialog' });
    function arataDialog(titlu, corp) {
      dlg.textContent = '';
      dlg.appendChild(el('div', 'lh-ap-pt-dlg-t', null, [titlu]));
      dlg.appendChild(corp);
      dlg.hidden = false;
      actualizeaza();
    }
    function inchideDialog() { dlg.hidden = true; dlg.textContent = ''; actualizeaza(); }
    function deschideDialog() {
      const lista = el('div', null, null);
      const nume = Object.keys(MAGAZIE);
      if (!nume.length) lista.appendChild(el('div', null, null, ['Nu există imagini salvate în această sesiune.']));
      nume.forEach(n => lista.appendChild(el('button', 'lh-ap-pt-dlg-fis', { type: 'button', 'data-fisier': n }, [n])));
      lista.addEventListener('click', ev => {
        const b = ev.target.closest && ev.target.closest('[data-fisier]');
        if (b) { deschideFisier(b.getAttribute('data-fisier')); inchideDialog(); }
      });
      const r = el('div', 'lh-ap-pt-dlg-r', null, [el('button', null, { type: 'button' }, ['Anulare'])]);
      r.firstChild.addEventListener('click', inchideDialog);
      lista.appendChild(r);
      arataDialog('Deschidere', lista);
    }
    function salveazaCaDialog() {
      const inp = el('input', null, { type: 'text', 'aria-label': 'Nume fișier', value: S.nume || 'Fără titlu.png' });
      const avert = el('div', null, { 'data-lh-zona': 'avertisment' });
      const btnSalv = el('button', 'lh-ap-pt-pr', { type: 'button' }, ['Salvare']);
      const btnAnul = el('button', null, { type: 'button' }, ['Anulare']);
      const r = el('div', 'lh-ap-pt-dlg-r', null, [btnAnul, btnSalv]);
      const corp = el('div', null, null, [el('div', null, null, ['Nume fișier']), inp, avert, r]);
      const cere = () => {
        let n = inp.value.trim() || 'Fără titlu.png';
        if (!/\.png$/i.test(n)) n += '.png';
        if (MAGAZIE[n] && n !== S.nume) {
          avert.textContent = '';
          avert.appendChild(el('div', null, null, ['Fișierul „' + n + '” există. Îl înlocuiți?']));
          const da = el('button', 'lh-ap-pt-pr', { type: 'button' }, ['Da']);
          const nu = el('button', null, { type: 'button' }, ['Nu']);
          da.addEventListener('click', () => salveazaCa(n));
          nu.addEventListener('click', () => { avert.textContent = ''; inp.focus(); });
          avert.appendChild(el('div', 'lh-ap-pt-dlg-r', null, [nu, da]));
          return;
        }
        salveazaCa(n);
      };
      btnSalv.addEventListener('click', cere);
      inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); cere(); } if (ev.key === 'Escape') inchideDialog(); });
      btnAnul.addEventListener('click', inchideDialog);
      arataDialog('Salvare ca', corp);
      setTimeout(() => { try { inp.focus(); inp.select(); } catch (e) { /* */ } }, 0);
    }

    const meniu = el('div', 'lh-ap-pt-meniu', { hidden: '', role: 'menu' });
    const btnFis = el('button', 'lh-ap-pt-fisier', { type: 'button', 'aria-expanded': 'false', 'data-lh-tinta': 'buton:Fisier' }, ['Fișier']);
    function inchideMeniu() { meniu.hidden = true; btnFis.setAttribute('aria-expanded', 'false'); }
    const elemMeniu = [
      ['Nou', 'Ctrl+N', nou], ['Deschidere…', 'Ctrl+O', deschideDialog], ['Salvați', 'Ctrl+S', salveaza],
      ['Salvați ca…', 'Ctrl+Shift+S', salveazaCaDialog]
    ];
    elemMeniu.forEach(([t, k, f]) => {
      const b = el('button', null, { type: 'button', role: 'menuitem', 'data-lh-tinta': 'meniu:' + t }, [t, el('span', null, null, [k])]);
      b.addEventListener('click', () => { inchideMeniu(); f(); });
      meniu.appendChild(b);
    });
    meniu.hidden = true;
    btnFis.addEventListener('click', () => {
      const deschis = meniu.hidden;
      meniu.hidden = !deschis; btnFis.setAttribute('aria-expanded', String(deschis));
    });

    /* ---------- panglica ---------- */
    const filele = {};
    const btnUnealta = {};
    function butonUnealta(id, eticheta) {
      const b = el('button', 'lh-ap-pt-btn', { type: 'button', 'aria-pressed': 'false', 'data-lh-tinta': 'unealta:' + id, title: UNELTE[id] }, [eticheta]);
      b.addEventListener('click', () => { S.unealta = id; S.selectie = null; actualizeaza(); });
      btnUnealta[id] = b;
      return b;
    }
    const sel = el('select', 'lh-ap-pt-sel', { 'aria-label': 'Dimensiune', 'data-lh-tinta': 'lista:Dimensiune' });
    DIMENSIUNI.forEach(d => sel.appendChild(el('option', null, { value: String(d) }, [d + ' px'])));
    sel.value = String(S.dim);
    sel.addEventListener('change', () => { S.dim = +sel.value; actualizeaza(); });

    const pal = el('div', 'lh-ap-pt-pal', { role: 'group', 'aria-label': 'Culori' });
    const swatch = [];
    paleta.forEach(([h, n]) => {
      const b = el('button', 'lh-ap-pt-sw', { type: 'button', 'data-culoare': h, title: n + ' (clic: Culoare 1, clic dreapta: Culoare 2)', 'aria-label': n, 'aria-pressed': 'false', 'data-lh-tinta': 'culoare:' + n });
      b.style.background = h;
      b.addEventListener('click', () => { S.c1 = h; actualizeaza(); });
      b.addEventListener('contextmenu', e => { e.preventDefault(); S.c2 = h; actualizeaza(); });
      swatch.push([h, b]);
      pal.appendChild(b);
    });
    const cerc1 = el('button', 'lh-ap-pt-cerc', { type: 'button', 'aria-label': 'Culoare 1', 'data-lh-tinta': 'culoare:Culoare 1', 'aria-pressed': 'true' });
    const cerc2 = el('button', 'lh-ap-pt-cerc', { type: 'button', 'aria-label': 'Culoare 2', 'data-lh-tinta': 'culoare:Culoare 2', 'aria-pressed': 'false' });
    cerc1.style.background = S.c1; cerc2.style.background = S.c2;
    const fg = el('div', 'lh-ap-pt-fg', null, [cerc1, cerc2]);

    const btnAnul = el('button', 'lh-ap-pt-btn', { type: 'button', 'data-lh-tinta': 'buton:Anulare', title: 'Ctrl+Z' }, ['↶ Anulare']);
    const btnRef = el('button', 'lh-ap-pt-btn', { type: 'button', 'data-lh-tinta': 'buton:Refacere', title: 'Ctrl+Y' }, ['↷ Refacere']);
    btnAnul.addEventListener('click', anuleaza);
    btnRef.addEventListener('click', refa);
    const btnSterge = el('button', 'lh-ap-pt-btn', { type: 'button', 'data-lh-tinta': 'buton:Stergere', title: 'Delete' }, ['Ștergere']);
    btnSterge.addEventListener('click', stergeSelectia);
    const btnTot = el('button', 'lh-ap-pt-btn', { type: 'button', 'data-lh-tinta': 'buton:Selectati tot', title: 'Ctrl+A' }, ['Selectați tot']);
    btnTot.addEventListener('click', selecteazaTot);

    const pornire = el('div', 'lh-ap-pt-panglica', { 'data-lh-zona': 'panglica_pornire', role: 'toolbar' }, [
      el('div', 'lh-ap-pt-grup', null, [
        el('div', 'lh-ap-pt-rand', null, [butonUnealta('creion', '✎ Creion'), butonUnealta('pensula', '🖌 Pensulă'),
          butonUnealta('umplere', '⛁ Umplere'), butonUnealta('text', 'A Text'), butonUnealta('radiera', '▭ Radieră'),
          butonUnealta('pipeta', '⌖ Selector'), butonUnealta('lupa', '⌕ Lupă'), butonUnealta('selectie', '⬚ Selectare')]),
        el('div', 'lh-ap-pt-grup-t', null, ['Instrumente'])]),
      el('div', 'lh-ap-pt-grup', null, [
        el('div', 'lh-ap-pt-rand', null, [butonUnealta('linie', '╱ Linie'), butonUnealta('dreptunghi', '▭ Dreptunghi'),
          butonUnealta('elipsa', '◯ Elipsă'), butonUnealta('sageata', '➝ Săgeată')]),
        el('div', 'lh-ap-pt-grup-t', null, ['Forme'])]),
      el('div', 'lh-ap-pt-grup', null, [sel, el('div', 'lh-ap-pt-grup-t', null, ['Dimensiune'])]),
      el('div', 'lh-ap-pt-grup', null, [el('div', 'lh-ap-pt-rand', null, [btnAnul, btnRef, btnTot, btnSterge]),
        el('div', 'lh-ap-pt-grup-t', null, ['Editare'])]),
      el('div', 'lh-ap-pt-grup', null, [el('div', 'lh-ap-pt-fg', null, [fg, pal]), el('div', 'lh-ap-pt-grup-t', null, ['Culori'])])
    ]);
    const btnMarire = el('button', 'lh-ap-pt-btn', { type: 'button', 'data-lh-tinta': 'buton:Marire' }, ['Mărire']);
    const btnMicsorare = el('button', 'lh-ap-pt-btn', { type: 'button', 'data-lh-tinta': 'buton:Micsorare' }, ['Micșorare']);
    const btn100 = el('button', 'lh-ap-pt-btn', { type: 'button', 'data-lh-tinta': 'buton:100' }, ['100 %']);
    const btnFit = el('button', 'lh-ap-pt-btn', { type: 'button', 'data-lh-tinta': 'buton:Potrivire' }, ['Potrivire la fereastră']);
    btnMarire.addEventListener('click', () => pasZoom(1));
    btnMicsorare.addEventListener('click', () => pasZoom(-1));
    btn100.addEventListener('click', () => aplicaZoom(100));
    btnFit.addEventListener('click', potrivesteZoom);
    const vizualizare = el('div', 'lh-ap-pt-panglica', { 'data-lh-zona': 'panglica_vizualizare', hidden: '' }, [
      el('div', 'lh-ap-pt-grup', null, [el('div', 'lh-ap-pt-rand', null, [btnMarire, btnMicsorare, btn100, btnFit]),
        el('div', 'lh-ap-pt-grup-t', null, ['Zoom'])])]);
    vizualizare.hidden = true;
    const tabPornire = el('button', null, { type: 'button', role: 'tab', 'aria-selected': 'true', 'data-lh-tinta': 'fila:Pornire' }, ['Pornire']);
    const tabViz = el('button', null, { type: 'button', role: 'tab', 'aria-selected': 'false', 'data-lh-tinta': 'fila:Vizualizare' }, ['Vizualizare']);
    function arataFila(f) {
      pornire.hidden = f !== 'pornire'; vizualizare.hidden = f !== 'viz';
      tabPornire.setAttribute('aria-selected', String(f === 'pornire'));
      tabViz.setAttribute('aria-selected', String(f === 'viz'));
    }
    tabPornire.addEventListener('click', () => arataFila('pornire'));
    tabViz.addEventListener('click', () => arataFila('viz'));
    filele.pornire = pornire;

    /* ---------- bara de titlu și bara de stare ---------- */
    const titlu = el('div', 'lh-ap-pt-titlu', { 'data-lh-zona': 'bara_titlu' }, [btnFis, el('div', 'lh-ap-pt-t', null, [''])]);
    const titluT = titlu.querySelector('.lh-ap-pt-t');
    const bara = el('div', 'lh-ap-pt-bara', { 'data-lh-zona': 'bara_stare' });
    const stCursor = el('span', null, { 'data-lh-zona': 'cursor' }, ['']);
    const stMarime = el('span', null, { 'data-lh-zona': 'marime_panza' }, ['']);
    const btnZm = el('button', null, { type: 'button', 'aria-label': 'Micșorare', 'data-lh-tinta': 'buton:Micsorare bara' }, ['−']);
    const btnZM = el('button', null, { type: 'button', 'aria-label': 'Mărire', 'data-lh-tinta': 'buton:Marire bara' }, ['+']);
    const stZoom = el('span', null, { 'data-lh-zona': 'zoom' }, ['']);
    btnZm.addEventListener('click', () => pasZoom(-1));
    btnZM.addEventListener('click', () => pasZoom(1));
    bara.appendChild(el('div', null, null, [stCursor]));
    bara.appendChild(el('div', null, null, [stMarime]));
    bara.appendChild(el('div', 'lh-ap-pt-bara-zoom', null, [btnZm, stZoom, btnZM]));

    const corp = el('div', 'lh-ap-pt', { 'data-lh-zona': 'fereastra' }, [
      titlu,
      el('div', 'lh-ap-pt-file', { role: 'tablist' }, [tabPornire, tabViz]),
      pornire, vizualizare, zona, bara, meniu, dlg
    ]);
    corp.style.position = 'relative';
    root.appendChild(corp);
    root.addEventListener('keydown', onTasta);
    root.addEventListener('mousedown', ev => { if (!meniu.contains(ev.target) && ev.target !== btnFis) inchideMeniu(); });

    /* ---------- tastatură ---------- */
    function onTasta(e) {
      if (e.target && e.target.tagName === 'INPUT') return;
      const k = e.key.toLowerCase(), ctrl = e.ctrlKey || e.metaKey;
      let fap = null;
      if (ctrl && !e.shiftKey && k === 'z') fap = anuleaza;
      else if (ctrl && (k === 'y' || (e.shiftKey && k === 'z'))) fap = refa;
      else if (ctrl && k === 'n') fap = nou;
      else if (ctrl && k === 'o') fap = deschideDialog;
      else if (ctrl && e.shiftKey && k === 's') fap = salveazaCaDialog;
      else if (ctrl && k === 's') fap = salveaza;
      else if (ctrl && k === 'a') fap = selecteazaTot;
      else if (k === 'delete') fap = stergeSelectia;
      else if (k === 'escape') { inchideMeniu(); if (!dlg.hidden) inchideDialog(); return; }
      if (fap) { e.preventDefault(); fap(); }
    }

    /* ---------- actualizare vizuală ---------- */
    function refreshBara() {
      stCursor.textContent = S.cursor ? (S.cursor.x + ', ' + S.cursor.y + ' px') : '';
      stMarime.textContent = W + ' × ' + H + ' px';
      stZoom.textContent = S.zoom + ' %';
    }
    function actualizeaza() {
      Object.keys(btnUnealta).forEach(id => btnUnealta[id].setAttribute('aria-pressed', String(S.unealta === id)));
      swatch.forEach(([h, b]) => { b.setAttribute('aria-pressed', String(h === S.c1)); });
      cerc1.style.background = S.c1; cerc2.style.background = S.c2;
      cerc1.setAttribute('aria-pressed', 'true');
      btnAnul.disabled = !ANULARE.length; btnRef.disabled = !REFACERE.length;
      titluT.textContent = (S.nume || 'Fără titlu') + (S.nesalvat ? '*' : '') + ' - Paint';
      pan.style.cursor = S.unealta === 'text' ? 'text' : (S.unealta === 'lupa' ? 'zoom-in' : (S.unealta === 'pipeta' ? 'copy' : 'crosshair'));
      if (S.zoom && pan.style.width) { /* zoom deja aplicat */ }
      refreshBara();
    }

    /* ---------- deschidere cu conținut (poligon: continut.fisier) ---------- */
    dimensiuniPanza(W, H);
    if (c && c.fisier && MAGAZIE[c.fisier]) deschideFisier(c.fisier);
    else S.nume = null;
    aplicaZoom(100);
    actualizeaza();

    /* ---------- contractul de verificare ---------- */
    I.stare = () => ({
      aplicatie: 'paint',
      unealta: S.unealta,
      unealta_nume: UNELTE[S.unealta],
      culoare1: S.c1,
      culoare1_nume: numeCuloare(S.c1),
      culoare2: S.c2,
      dimensiune: S.dim,
      panza: { latime: W, inaltime: H },
      zoom: S.zoom,
      pixeli_schimbati: ANULARE.length > 0,
      nesalvat: S.nesalvat,
      nume_fisier: S.nume,
      istoric: { anulare: ANULARE.length, refacere: REFACERE.length },
      cursor: S.cursor ? { x: S.cursor.x, y: S.cursor.y } : null,
      selectie: S.selectie ? Object.assign({}, S.selectie) : null,
      dialog: dlg.hidden ? null : dlg.querySelector('.lh-ap-pt-dlg-t').textContent
    });
    I.focus = () => { try { pan.focus({ preventScroll: true }); } catch (e) { /* */ } };
    I.arataFila = arataFila;
    /* numele fișierului și pixelii din magazie, pentru lecții: fără descărcare */
    I.magazie = MAGAZIE;
  }

  L._modul('paint', {
    creeaza,
    magazie: MAGAZIE,
    zoom: ZOOM,
    dimensiuni: DIMENSIUNI,
    unelte: UNELTE,
    forme: FORME
  });
})();
