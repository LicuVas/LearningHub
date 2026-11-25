/* paint.js — Paint (Windows 11, română) în biblioteca centrală (api_biblioteca.md §1-§8).
   Interfața (bara de titlu, meniul Fișier, filele Pornire / Vizualizare, bara de stare) e desenată aici, în stilul celorlalte
   aplicații. Paleta de culori vine din date/paint.json (aceeași paletă de 20 de culori ca în lecțiile Paint).
   Pânza e un canvas 2D real: creionul, pensula, radiera, umplerea, selectorul de culoare, lupa, selecția dreptunghiulară,
   formele (linie, dreptunghi, elipsă, săgeată) și textul desenează pe pixeli. Zoom, Anulare/Refacere (Ctrl+Z / Ctrl+Y),
   Nou / Deschidere / Salvați / Salvați ca (Ctrl+N, Ctrl+O, Ctrl+S, Ctrl+Shift+S).
   Selecția se mută trăgând; Tăiere / Copiere / Lipire (Ctrl+X/C/V, grupul Clipboard); Ctrl+A, Delete.
   Grupul Imagine: Decupare (după selecție), Redimensionați și înclinați (pixeli sau procente; înclinare în grade),
   rotire 90° stânga / dreapta, 180°, răsturnare orizontală / verticală (pe toată pânza).
   Salvare ca PNG, JPEG, BMP sau GIF (tipul vine din extensia numelui); „Salvați modificările?” la Nou, Deschidere și Ieșire.
   Text: font, dimensiune, ingrosat, cursiv (grupul Font, vizibil cu unealta Text). Editare culori: caseta cu cod și R/G/B.
   Magazia de fișiere e în memorie: L._module.paint.magazie = { nume: „data:image/…;base64,…” }. Fără descărcare, fără fisiere.js.
   Stare (I.stare, LH.aplicatii.stare('paint')): aplicatie, unealta, culoare1, culoare2, dimensiune, panza {latime, inaltime},
   zoom, pixeli_schimbati, nesalvat, nume_fisier, istoric {anulare, refacere}, cursor, selectie, portapapier, texte. */
(function () {
  'use strict';
  const L = window.LH && window.LH.aplicatii;
  if (!L) return;

  const MAGAZIE = {};                                                   // fișierele salvate în memorie: nume -> dataURL
  const ZOOM = [12.5, 25, 50, 100, 200, 400, 800];                      // pașii din bara de stare (procente)
  const DIMENSIUNI = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 30, 40, 50];
  const UNELTE = { creion: 'Creion', pensula: 'Pensulă', umplere: 'Umplere cu culoare', text: 'Text', radiera: 'Radieră',
    pipeta: 'Selector de culoare', lupa: 'Lupă', selectie: 'Selectare dreptunghi',
    linie: 'Linie', dreptunghi: 'Dreptunghi', elipsa: 'Elipsă', sageata: 'Săgeată' };
  const FORME = ['linie', 'dreptunghi', 'elipsa', 'sageata'];
  const LIMITA_ISTORIC = 40;
  const FONTURI = ['Calibri', 'Arial', 'Times New Roman', 'Georgia', 'Courier New', 'Verdana'];
  const MARIMI_TEXT = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];   // puncte; 12 pt = 16 px
  const TIPURI = [['png', 'PNG (*.png)'], ['jpg', 'JPEG (*.jpg)'], ['bmp', 'Bitmap (*.bmp)'], ['gif', 'GIF (*.gif)']];
  const LIMITA_PX = 2000;
  let PORTAPAPIER = null;                                               // ImageData copiat (Copiere / Tăiere), comun Paint-urilor deschise

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
.lh-ap-pt-grup[hidden]{display:none}
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
.lh-ap-pt-dlg input[type="radio"],.lh-ap-pt-dlg input[type="checkbox"]{width:auto}
.lh-ap-pt-dlg select{font:inherit;width:100%}
.lh-ap-pt-dlg label{display:block;margin-top:4px}
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
  function fontCss(t, scara) {
    return (t.i ? 'italic ' : '') + (t.b ? 'bold ' : '') + (Math.round(t.pt * 4 / 3 * scara * 100) / 100) + 'px "' + t.fam + '", Carlito, Arial, sans-serif';
  }
  function formatDin(nume) {
    const m = /\.(png|jpe?g|bmp|gif)$/i.exec(String(nume || ''));
    return m ? m[1].toLowerCase().replace('jpeg', 'jpg') : 'png';
  }
  function normalizeaza(nume, tip) {                                    // extensia tastată bate lista de tipuri
    let n = String(nume || '').trim() || 'Fără titlu';
    if (!/\.(png|jpe?g|bmp|gif)$/i.test(n)) n += '.' + tip;
    return n;
  }
  function schimbaExt(nume, tip) {
    const b = String(nume || '').trim().replace(/\.(png|jpe?g|bmp|gif)$/i, '') || 'Fără titlu';
    return b + '.' + tip;
  }

  /* ---------- codificatoare: BMP și GIF (LZW) scrise aici, JPEG/PNG de browser ---------- */
  function base64(bytes) {
    let s = '';
    for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s);
  }
  function bmpBytes(img) {
    const W = img.width, H = img.height, d = img.data;
    const stride = Math.ceil(W * 3 / 4) * 4, tam = 54 + stride * H;
    const b = new Uint8Array(tam), v = new DataView(b.buffer);
    b[0] = 0x42; b[1] = 0x4D; v.setUint32(2, tam, true); v.setUint32(10, 54, true);
    v.setUint32(14, 40, true); v.setInt32(18, W, true); v.setInt32(22, H, true);
    v.setUint16(26, 1, true); v.setUint16(28, 24, true); v.setUint32(34, stride * H, true);
    for (let y = 0; y < H; y++) {
      const rand = 54 + (H - 1 - y) * stride;
      for (let x = 0; x < W; x++) {
        const s = (y * W + x) * 4, o = rand + x * 3;
        b[o] = d[s + 2]; b[o + 1] = d[s + 1]; b[o + 2] = d[s];
      }
    }
    return b;
  }
  function lzw(idx, minCode) {
    const out = []; let acc = 0, nb = 0;
    const put = (cod, marime) => { acc |= cod << nb; nb += marime; while (nb >= 8) { out.push(acc & 255); acc >>>= 8; nb -= 8; } };
    const clear = 1 << minCode, eoi = clear + 1;
    let marime = minCode + 1, urmator = eoi + 1, dict = new Map();
    put(clear, marime);
    let pre = idx[0];
    for (let i = 1; i < idx.length; i++) {
      const k = idx[i], cheie = pre * 256 + k, f = dict.get(cheie);
      if (f !== undefined) { pre = f; continue; }
      put(pre, marime);
      if (urmator < 4096) {
        dict.set(cheie, urmator);
        if (urmator === (1 << marime) && marime < 12) marime++;   // GIF: lățimea crește după codul 2^n (verificat cu PIL)
        urmator++;
      } else {
        put(clear, marime); dict = new Map(); marime = minCode + 1; urmator = eoi + 1;
      }
      pre = k;
    }
    put(pre, marime); put(eoi, marime);
    if (nb > 0) out.push(acc & 255);
    return out;
  }
  function gifBytes(img) {
    const W = img.width, H = img.height, d = img.data, n = W * H;
    const harta = new Map(), pal = [], idx = new Uint8Array(n);
    let exact = true;
    for (let i = 0; i < n && exact; i++) {
      const cheie = (d[i * 4] << 16) | (d[i * 4 + 1] << 8) | d[i * 4 + 2];
      let j = harta.get(cheie);
      if (j === undefined) {
        if (pal.length < 256) { j = pal.length; harta.set(cheie, j); pal.push(cheie); } else { exact = false; break; }
      }
      idx[i] = j;
    }
    if (!exact) {                                                       // peste 256 de culori: 3-3-2 biți
      pal.length = 0;
      for (let r = 0; r < 8; r++) for (let g = 0; g < 8; g++) for (let b = 0; b < 4; b++)   // centrul fiecărui interval
        pal.push(((r << 5) | 16) << 16 | ((g << 5) | 16) << 8 | ((b << 6) | 32));
      for (let i = 0; i < n; i++) idx[i] = ((d[i * 4] >> 5) << 5) | ((d[i * 4 + 1] >> 5) << 2) | (d[i * 4 + 2] >> 6);
    }
    const biti = Math.max(1, Math.ceil(Math.log2(pal.length)));
    const tabel = 1 << biti, minCode = Math.max(2, biti);
    const out = [0x47, 0x49, 0x46, 0x38, 0x39, 0x61];                    // GIF89a
    out.push(W & 255, W >> 8, H & 255, H >> 8, 0x80 | ((biti - 1) << 4) | (biti - 1), 0, 0);
    for (let p = 0; p < tabel; p++) {
      const c = p < pal.length ? pal[p] : 0;
      out.push((c >> 16) & 255, (c >> 8) & 255, c & 255);
    }
    out.push(0x2C, 0, 0, 0, 0, W & 255, W >> 8, H & 255, H >> 8, 0);
    out.push(minCode);
    const date = lzw(idx, minCode);
    for (let i = 0; i < date.length; i += 255) {
      const bloc = date.slice(i, i + 255);
      out.push(bloc.length, ...bloc);
    }
    out.push(0, 0x3B);
    return Uint8Array.from(out);
  }

  function creeaza(I, c, L) {
    css();
    const root = I.root, date = I.date || {};
    const paleta = date.paleta || [['#000000', 'Negru'], ['#ffffff', 'Alb']];
    const numeCuloare = h => { const p = paleta.find(x => x[0] === h); return p ? p[1] : h; };
    const panza0 = Object.assign({ latime: 640, inaltime: 480 }, (date.panza || {}), (c && c.panza) || {});
    const S = { unealta: 'creion', c1: paleta[0][0], c2: '#ffffff', dim: 3, zoom: 100, nume: null, nesalvat: false,
      cursor: null, selectie: null, slot: 1, txt: { fam: 'Calibri', pt: 12, b: false, i: false } };
    let W = panza0.latime, H = panza0.inaltime;
    const ANULARE = [], REFACERE = [];
    let op = null;                                                      // gestul în curs (creion, forme, selecție, mutare)
    let dupaSalvare = null;                                             // acțiunea de făcut după ce „Salvați ca” reușește

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
    const pune = img => {                                               // revenirea la o stare cu alte dimensiuni schimbă și pânza
      if (img.width !== W || img.height !== H) dimensiuniPanza(img.width, img.height);
      ctx.putImageData(img, 0, 0);
    };
    function consemneaza(baza) {
      ANULARE.push(baza);
      if (ANULARE.length > LIMITA_ISTORIC) ANULARE.shift();
      REFACERE.length = 0;
      S.nesalvat = true;
      actualizeaza();
    }
    /* reconstruiește pânza la w2×h2: pentru fiecare pixel nou, mapa dă coordonata din sursă (sau null = alb) */
    function remapeaza(w2, h2, mapa) {
      const w0 = W, h0 = H, src = ctx.getImageData(0, 0, w0, h0).data;
      const dst = new ImageData(w2, h2), d = dst.data;
      for (let y = 0; y < h2; y++) for (let x = 0; x < w2; x++) {
        const m = mapa(x, y), o = (y * w2 + x) * 4;
        if (m && m[0] >= 0 && m[0] < w0 && m[1] >= 0 && m[1] < h0) {
          const i = (m[1] * w0 + m[0]) * 4; d[o] = src[i]; d[o + 1] = src[i + 1]; d[o + 2] = src[i + 2];
        } else { d[o] = 255; d[o + 1] = 255; d[o + 2] = 255; }
        d[o + 3] = 255;
      }
      dimensiuniPanza(w2, h2);
      ctx.putImageData(dst, 0, 0);
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
    const dentro = (s, p) => p.x >= s.x0 && p.x <= s.x1 && p.y >= s.y0 && p.y <= s.y1;

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

    /* ---------- text ---------- */
    function deseneazaText(p, txt) {
      const baza = snap();
      ctx.font = fontCss(S.txt, 1);
      ctx.fillStyle = S.c1; ctx.textBaseline = 'top';
      ctx.fillText(txt, p.x, p.y);
      consemneaza(baza);
    }
    let casetaText = null;
    let fontAtins = false;                                              // apăsare pe grupul Font, în timpul căsuței de text
    function deschideText(p) {
      inchideText(false);
      const inp = el('input', 'lh-ap-pt-text', { type: 'text', 'aria-label': 'Text' });
      inp.style.left = (p.x * S.zoom / 100) + 'px';
      inp.style.top = (p.y * S.zoom / 100) + 'px';
      inp.style.font = fontCss(S.txt, S.zoom / 100);
      inp.style.color = S.c1;
      cadru.appendChild(inp);
      casetaText = { inp, p, gata: false };
      const fin = () => inchideText(true);
      inp.addEventListener('keydown', ev => {
        if (ev.key === 'Enter') { ev.preventDefault(); fin(); }
        if (ev.key === 'Escape') { ev.preventDefault(); inchideText(false); }
        ev.stopPropagation();
      });
      inp.addEventListener('blur', ev => {                              // clic pe grupul Font: caseta rămâne deschisă
        if (fontAtins || (ev.relatedTarget && grupFont.contains(ev.relatedTarget))) return;
        fin();
      });
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
    function aplicaFontCasetei() {                                      // mărimea și stilul schimbă tot textul din casetă
      if (casetaText) {
        casetaText.inp.style.font = fontCss(S.txt, S.zoom / 100);
        try { casetaText.inp.focus(); } catch (e) { /* */ }
      }
    }

    /* ---------- selecție: mutare, tăiere, copiere, lipire, ștergere ---------- */
    function stergeSelectia() {
      if (!S.selectie) return;
      const s = S.selectie, baza = snap();
      ctx.fillStyle = S.c2;
      ctx.fillRect(s.x0, s.y0, s.x1 - s.x0 + 1, s.y1 - s.y0 + 1);
      consemneaza(baza);
    }
    function copiaza() {
      const s = S.selectie;
      if (!s) return false;
      PORTAPAPIER = ctx.getImageData(s.x0, s.y0, s.x1 - s.x0 + 1, s.y1 - s.y0 + 1);
      actualizeaza();
      return true;
    }
    function taie() { if (copiaza()) stergeSelectia(); }
    function lipeste() {
      if (!PORTAPAPIER) return;
      const baza = snap(), w = PORTAPAPIER.width, h = PORTAPAPIER.height;
      ctx.putImageData(PORTAPAPIER, 0, 0);                              // lipirea se face în colțul de sus-stânga
      S.selectie = { x0: 0, y0: 0, x1: Math.min(w, W) - 1, y1: Math.min(h, H) - 1 };
      S.unealta = 'selectie';
      consemneaza(baza);
    }
    function selecteazaTot() { S.selectie = { x0: 0, y0: 0, x1: W - 1, y1: H - 1 }; actualizeaza(); }

    /* ---------- imagine: decupare, rotire, răsturnare, redimensionare și înclinare ---------- */
    function decupare() {
      const s = S.selectie;
      if (!s) return;
      const w2 = s.x1 - s.x0 + 1, h2 = s.y1 - s.y0 + 1;
      if (w2 === W && h2 === H) { S.selectie = null; actualizeaza(); return; }
      const baza = snap(), x0 = s.x0, y0 = s.y0;
      remapeaza(w2, h2, (x, y) => [x + x0, y + y0]);
      S.selectie = null;
      consemneaza(baza);
    }
    function rotire(gr) {                                               // 90 = dreapta, -90 = stânga, 180
      const baza = snap(), w0 = W, h0 = H;
      if (gr === 180) remapeaza(w0, h0, (x, y) => [w0 - 1 - x, h0 - 1 - y]);
      else if (gr === 90) remapeaza(h0, w0, (x, y) => [y, h0 - 1 - x]);
      else remapeaza(h0, w0, (x, y) => [w0 - 1 - y, x]);
      S.selectie = null;
      consemneaza(baza);
    }
    function oglindire(tip) {
      const baza = snap(), w0 = W, h0 = H;
      if (tip === 'h') remapeaza(w0, h0, (x, y) => [w0 - 1 - x, y]);
      else remapeaza(w0, h0, (x, y) => [x, h0 - 1 - y]);
      S.selectie = null;
      consemneaza(baza);
    }
    function redimensioneaza() {
      inchideMeniu();
      const w0 = W, h0 = H, grupa = 'lh-ap-pt-mod';
      const rProc = el('input', null, { type: 'radio', name: grupa, 'aria-label': 'Procente' });
      const rPix = el('input', null, { type: 'radio', name: grupa, 'aria-label': 'Pixeli' });
      rProc.checked = true;
      const hz = el('input', null, { type: 'number', 'aria-label': 'Orizontal', value: '100', min: '1' });
      const vt = el('input', null, { type: 'number', 'aria-label': 'Vertical', value: '100', min: '1' });
      const lock = el('input', null, { type: 'checkbox', 'aria-label': 'Păstrare raport de aspect' });
      lock.checked = true;
      const sh = el('input', null, { type: 'number', 'aria-label': 'Înclinare orizontală', value: '0' });
      const sv = el('input', null, { type: 'number', 'aria-label': 'Înclinare verticală', value: '0' });
      const avert = el('div', null, { 'data-lh-zona': 'avertisment' });
      const seteaza = pix => { hz.value = String(pix ? w0 : 100); vt.value = String(pix ? h0 : 100); };
      rProc.addEventListener('change', () => seteaza(false));
      rPix.addEventListener('change', () => seteaza(true));
      hz.addEventListener('input', () => {
        if (!lock.checked || !(+hz.value > 0)) return;
        vt.value = String(rPix.checked ? Math.round(+hz.value * h0 / w0) : +hz.value);
      });
      vt.addEventListener('input', () => {
        if (!lock.checked || !(+vt.value > 0)) return;
        hz.value = String(rPix.checked ? Math.round(+vt.value * w0 / h0) : +vt.value);
      });
      const bOK = el('button', 'lh-ap-pt-pr', { type: 'button', 'data-lh-tinta': 'buton:OK' }, ['OK']);
      const bAnul = el('button', null, { type: 'button', 'data-lh-tinta': 'dialog:Anulare' }, ['Anulare']);
      const corp = el('div', null, null, [
        el('div', null, null, ['Redimensionare']),
        el('label', null, null, [rProc, ' Procente']), el('label', null, null, [rPix, ' Pixeli']),
        el('label', null, null, ['Orizontal', hz]), el('label', null, null, ['Vertical', vt]),
        el('label', null, null, [lock, ' Păstrare raport de aspect']),
        el('div', null, null, ['Înclinare (grade)']),
        el('label', null, null, ['Orizontal', sh]), el('label', null, null, ['Vertical', sv]),
        avert,
        el('div', 'lh-ap-pt-dlg-r', null, [bAnul, bOK])
      ]);
      bOK.addEventListener('click', () => {
        const a = +hz.value, b = +vt.value, ha = +sh.value, hb = +sv.value;
        const w2 = rProc.checked ? Math.round(w0 * a / 100) : Math.round(a);
        const h2 = rProc.checked ? Math.round(h0 * b / 100) : Math.round(b);
        if (!(w2 >= 1 && h2 >= 1 && w2 <= LIMITA_PX && h2 <= LIMITA_PX) || !(Math.abs(ha) <= 60 && Math.abs(hb) <= 60)) {
          avert.textContent = 'Valori permise: 1–' + LIMITA_PX + ' px și înclinare între −60° și 60°.';
          return;
        }
        const baza = snap();
        let schimbat = false;
        if (w2 !== W || h2 !== H) {
          const a0 = W, b0 = H;
          remapeaza(w2, h2, (x, y) => [Math.min(a0 - 1, Math.floor(x * a0 / w2)), Math.min(b0 - 1, Math.floor(y * b0 / h2))]);
          schimbat = true;
        }
        if (ha) {
          const t = Math.tan(ha * Math.PI / 180), hh = H, o = t < 0 ? -t * (hh - 1) : 0;
          remapeaza(W + Math.round(Math.abs(t) * (hh - 1)), hh, (x, y) => [Math.round(x - o - t * y), y]);
          schimbat = true;
        }
        if (hb) {
          const u = Math.tan(hb * Math.PI / 180), ww = W, p = u < 0 ? -u * (ww - 1) : 0;
          remapeaza(ww, H + Math.round(Math.abs(u) * (ww - 1)), (x, y) => [x, Math.round(y - p - u * x)]);
          schimbat = true;
        }
        S.selectie = null;
        if (schimbat) consemneaza(baza);
        inchideDialog();
      });
      bAnul.addEventListener('click', inchideDialog);
      arataDialog('Redimensionați și înclinați', corp);
    }

    /* ---------- editare culori (dialogul din „Editare culori”) ---------- */
    function editeazaCulori() {
      inchideMeniu();
      const cheie = S.slot === 2 ? 'c2' : 'c1', rgb = hexRgba(S[cheie]);
      const hexI = el('input', null, { type: 'text', 'aria-label': 'Cod culoare', value: S[cheie] });
      const mk = (eticheta, v) => el('input', null, { type: 'number', min: '0', max: '255', 'aria-label': eticheta, value: String(v) });
      const rI = mk('Roșu', rgb[0]), gI = mk('Verde', rgb[1]), bI = mk('Albastru', rgb[2]);
      const prev = el('div', null, { 'data-lh-zona': 'previzualizare' });
      prev.style.cssText = 'width:100%;height:28px;border:1px solid #888;background:' + S[cheie];
      const avert = el('div', null, { 'data-lh-zona': 'avertisment' });
      const dinHex = () => {
        const v = hexI.value.trim();
        return /^#?[0-9a-f]{6}$/i.test(v) ? (v[0] === '#' ? v : '#' + v).toLowerCase() : null;
      };
      const dinRgb = () => {
        const v = [rI, gI, bI].map(x => Number(x.value));
        if (v.some(x => !(x >= 0 && x <= 255) || x % 1 !== 0)) return null;
        return rgbHex(v[0], v[1], v[2]);
      };
      hexI.addEventListener('input', () => {
        const h = dinHex();
        if (!h) return;
        const r = hexRgba(h); rI.value = String(r[0]); gI.value = String(r[1]); bI.value = String(r[2]);
        prev.style.background = h;
      });
      [rI, gI, bI].forEach(x => x.addEventListener('input', () => {
        const h = dinRgb();
        if (h) { hexI.value = h; prev.style.background = h; }
      }));
      const bOK = el('button', 'lh-ap-pt-pr', { type: 'button', 'data-lh-tinta': 'buton:OK' }, ['OK']);
      const bAnul = el('button', null, { type: 'button', 'data-lh-tinta': 'dialog:Anulare' }, ['Anulare']);
      bOK.addEventListener('click', () => {
        const h = dinHex();
        if (!h) { avert.textContent = 'Cod invalid: scrieți #rrggbb (6 cifre hexazecimale).'; return; }
        S[cheie] = h;
        inchideDialog();
        actualizeaza();
      });
      bAnul.addEventListener('click', inchideDialog);
      arataDialog('Editare culori', el('div', null, null, [
        el('label', null, null, ['Cod culoare', hexI]),
        el('label', null, null, ['Roșu', rI]), el('label', null, null, ['Verde', gI]), el('label', null, null, ['Albastru', bI]),
        prev, avert, el('div', 'lh-ap-pt-dlg-r', null, [bAnul, bOK])
      ]));
    }

    /* ---------- tastatura pe pânză: pointer ---------- */
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
      if (u === 'selectie' && S.selectie && dentro(S.selectie, p)) {   // trăgând dintr-o selecție o muți
        const s = S.selectie, w = s.x1 - s.x0 + 1, h = s.y1 - s.y0 + 1;
        op = { tip: 'mutare', baza: snap(), s: Object.assign({}, s), w, h, dx: p.x - s.x0, dy: p.y - s.y0,
          img: ctx.getImageData(s.x0, s.y0, w, h), nx: s.x0, ny: s.y0 };
        return;
      }
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
      } else if (u === 'mutare') {
        op.nx = Math.max(0, Math.min(W - op.w, p.x - op.dx));
        op.ny = Math.max(0, Math.min(H - op.h, p.y - op.dy));
        pune(op.baza);
        ctx.fillStyle = S.c2; ctx.fillRect(op.s.x0, op.s.y0, op.w, op.h);
        ctx.putImageData(op.img, op.nx, op.ny);
        S.selectie = { x0: op.nx, y0: op.ny, x1: op.nx + op.w - 1, y1: op.ny + op.h - 1 };
        selectieCanvas(S.selectie);
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
      if (o.tip === 'mutare') {
        const mutat = o.nx !== o.s.x0 || o.ny !== o.s.y0;
        if (mutat) { consemneaza(o.baza); S.selectie = { x0: o.nx, y0: o.ny, x1: o.nx + o.w - 1, y1: o.ny + o.h - 1 }; }
        else { pune(o.baza); S.selectie = o.s; }
        actualizeaza(); return;
      }
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

    /* ---------- fișiere (magazia în memorie) ---------- */
    function codifica(nume) {
      const f = formatDin(nume);
      if (f === 'jpg') return pan.toDataURL('image/jpeg', 0.92);
      if (f === 'bmp') return 'data:image/bmp;base64,' + base64(bmpBytes(ctx.getImageData(0, 0, W, H)));
      if (f === 'gif') return 'data:image/gif;base64,' + base64(gifBytes(ctx.getImageData(0, 0, W, H)));
      return pan.toDataURL('image/png');
    }
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
      const f = dupaSalvare; dupaSalvare = null;
      const n = normalizeaza(nume, 'png');
      MAGAZIE[n] = codifica(n);
      S.nume = n; S.nesalvat = false;
      inchideDialog();
      actualizeaza();
      if (f) f();
      return n;
    }
    function salveaza() {
      if (!S.nume) return salveazaCaDialog();
      MAGAZIE[S.nume] = codifica(S.nume); S.nesalvat = false; actualizeaza();
      return S.nume;
    }
    /* „Salvați modificările?”: la Nou, Deschidere și Ieșire, dacă imaginea s-a schimbat */
    function cere(actiune) {
      if (!S.nesalvat) { actiune(); return; }
      inchideMeniu();
      const bDa = el('button', 'lh-ap-pt-pr', { type: 'button', 'data-lh-tinta': 'buton:Salvare' }, ['Salvare']);
      const bNu = el('button', null, { type: 'button', 'data-lh-tinta': 'buton:Nu se salvează' }, ['Nu se salvează']);
      const bAnul = el('button', null, { type: 'button', 'data-lh-tinta': 'dialog:Anulare' }, ['Anulare']);
      bDa.addEventListener('click', () => {
        if (S.nume) { inchideDialog(); salveaza(); actiune(); }
        else { inchideDialog(); dupaSalvare = actiune; salveazaCaDialog(); }
      });
      bNu.addEventListener('click', () => { inchideDialog(); actiune(); });
      bAnul.addEventListener('click', inchideDialog);
      arataDialog('Paint', el('div', null, null, [
        el('div', null, null, ['Doriți să salvați modificările la „' + (S.nume || 'Fără titlu') + '”?']),
        el('div', 'lh-ap-pt-dlg-r', null, [bAnul, bNu, bDa])
      ]));
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
    function inchideDialog() {
      dlg.hidden = true; dlg.textContent = ''; dupaSalvare = null; actualizeaza();
      try { pan.focus({ preventScroll: true }); } catch (e) { /* */ }   // tastatura revine pe pânză (Ctrl+S etc.)
    }
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
      const tip = el('select', 'lh-ap-pt-sel', { 'aria-label': 'Salvare ca tip', 'data-lh-tinta': 'lista:Salvare ca tip' });
      TIPURI.forEach(([v, t]) => tip.appendChild(el('option', null, { value: v }, [t])));
      tip.value = formatDin(S.nume);
      tip.addEventListener('change', () => { inp.value = schimbaExt(inp.value, tip.value); });
      const avert = el('div', null, { 'data-lh-zona': 'avertisment' });
      const btnSalv = el('button', 'lh-ap-pt-pr', { type: 'button' }, ['Salvare']);
      const btnAnul = el('button', null, { type: 'button' }, ['Anulare']);
      const r = el('div', 'lh-ap-pt-dlg-r', null, [btnAnul, btnSalv]);
      const corp = el('div', null, null, [el('div', null, null, ['Nume fișier']), inp, el('div', null, null, ['Salvare ca tip']), tip, avert, r]);
      const cerePrinSalvare = () => {
        const n = normalizeaza(inp.value, tip.value);
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
      btnSalv.addEventListener('click', cerePrinSalvare);
      inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); cerePrinSalvare(); } if (ev.key === 'Escape') inchideDialog(); });
      btnAnul.addEventListener('click', inchideDialog);
      arataDialog('Salvare ca', corp);
      setTimeout(() => { try { inp.focus(); inp.select(); } catch (e) { /* */ } }, 0);
    }

    const meniu = el('div', 'lh-ap-pt-meniu', { hidden: '', role: 'menu' });
    const btnFis = el('button', 'lh-ap-pt-fisier', { type: 'button', 'aria-expanded': 'false', 'data-lh-tinta': 'buton:Fisier' }, ['Fișier']);
    function inchideMeniu() { meniu.hidden = true; btnFis.setAttribute('aria-expanded', 'false'); }
    const elemMeniu = [
      ['Nou', 'Ctrl+N', () => cere(nou)], ['Deschidere…', 'Ctrl+O', () => cere(deschideDialog)], ['Salvați', 'Ctrl+S', salveaza],
      ['Salvați ca…', 'Ctrl+Shift+S', salveazaCaDialog], ['Ieșire', '', () => cere(() => L.inchide('paint'))]
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
      b.addEventListener('click', () => { S[S.slot === 2 ? 'c2' : 'c1'] = h; actualizeaza(); });
      b.addEventListener('contextmenu', e => { e.preventDefault(); S.c2 = h; actualizeaza(); });
      swatch.push([h, b]);
      pal.appendChild(b);
    });
    const cerc1 = el('button', 'lh-ap-pt-cerc', { type: 'button', 'aria-label': 'Culoare 1', 'data-lh-tinta': 'culoare:Culoare 1', 'aria-pressed': 'true' });
    const cerc2 = el('button', 'lh-ap-pt-cerc', { type: 'button', 'aria-label': 'Culoare 2', 'data-lh-tinta': 'culoare:Culoare 2', 'aria-pressed': 'false' });
    cerc1.style.background = S.c1; cerc2.style.background = S.c2;
    cerc1.addEventListener('click', () => { S.slot = 1; actualizeaza(); });
    cerc2.addEventListener('click', () => { S.slot = 2; actualizeaza(); });
    const fg = el('div', 'lh-ap-pt-fg', null, [cerc1, cerc2]);
    const btnEditCul = el('button', 'lh-ap-pt-btn', { type: 'button', 'data-lh-tinta': 'buton:Editare culori', title: 'Editare culori' }, ['Editare culori']);
    btnEditCul.addEventListener('click', editeazaCulori);

    const btnAnul = el('button', 'lh-ap-pt-btn', { type: 'button', 'data-lh-tinta': 'buton:Anulare', title: 'Ctrl+Z' }, ['↶ Anulare']);
    const btnRef = el('button', 'lh-ap-pt-btn', { type: 'button', 'data-lh-tinta': 'buton:Refacere', title: 'Ctrl+Y' }, ['↷ Refacere']);
    btnAnul.addEventListener('click', anuleaza);
    btnRef.addEventListener('click', refa);
    const btnSterge = el('button', 'lh-ap-pt-btn', { type: 'button', 'data-lh-tinta': 'buton:Stergere', title: 'Delete' }, ['Ștergere']);
    btnSterge.addEventListener('click', stergeSelectia);
    const btnTot = el('button', 'lh-ap-pt-btn', { type: 'button', 'data-lh-tinta': 'buton:Selectati tot', title: 'Ctrl+A' }, ['Selectați tot']);
    btnTot.addEventListener('click', selecteazaTot);
    const btnLipeste = el('button', 'lh-ap-pt-btn', { type: 'button', 'data-lh-tinta': 'buton:Lipire', title: 'Ctrl+V' }, ['Lipire']);
    const btnTaie = el('button', 'lh-ap-pt-btn', { type: 'button', 'data-lh-tinta': 'buton:Taiere', title: 'Ctrl+X' }, ['Tăiere']);
    const btnCopiaza = el('button', 'lh-ap-pt-btn', { type: 'button', 'data-lh-tinta': 'buton:Copiere', title: 'Ctrl+C' }, ['Copiere']);
    btnLipeste.addEventListener('click', lipeste);
    btnTaie.addEventListener('click', taie);
    btnCopiaza.addEventListener('click', copiaza);
    const btnDecupa = el('button', 'lh-ap-pt-btn', { type: 'button', 'data-lh-tinta': 'buton:Decupare', title: 'Decupare: tai marginile, rămâne doar selecția' }, ['Decupare']);
    const btnRedim = el('button', 'lh-ap-pt-btn', { type: 'button', 'data-lh-tinta': 'buton:Redimensionati si inclinati' }, ['Redimensionați și înclinați']);
    const btnRotD = el('button', 'lh-ap-pt-btn', { type: 'button', 'data-lh-tinta': 'buton:Rotire la dreapta 90°' }, ['Rotire la dreapta 90°']);
    const btnRotS = el('button', 'lh-ap-pt-btn', { type: 'button', 'data-lh-tinta': 'buton:Rotire la stânga 90°' }, ['Rotire la stânga 90°']);
    const btnRot180 = el('button', 'lh-ap-pt-btn', { type: 'button', 'data-lh-tinta': 'buton:Rotire cu 180°' }, ['Rotire cu 180°']);
    const btnOriz = el('button', 'lh-ap-pt-btn', { type: 'button', 'data-lh-tinta': 'buton:Răsturnare orizontală' }, ['Răsturnare orizontală']);
    const btnVert = el('button', 'lh-ap-pt-btn', { type: 'button', 'data-lh-tinta': 'buton:Răsturnare verticală' }, ['Răsturnare verticală']);
    const btnRotPers = el('button', 'lh-ap-pt-btn', { type: 'button', 'data-lh-tinta': 'buton:Rotire personalizată' }, ['Rotire personalizată']);
    btnDecupa.addEventListener('click', decupare);
    btnRedim.addEventListener('click', redimensioneaza);
    btnRotD.addEventListener('click', () => rotire(90));
    btnRotS.addEventListener('click', () => rotire(-90));
    btnRot180.addEventListener('click', () => rotire(180));
    btnOriz.addEventListener('click', () => oglindire('h'));
    btnVert.addEventListener('click', () => oglindire('v'));
    btnRotPers.addEventListener('click', () => I.nesimulat('Rotire personalizată'));   // nesimulată: mesajul central

    const selFam = el('select', 'lh-ap-pt-sel', { 'aria-label': 'Font', 'data-lh-tinta': 'lista:Font' });
    selFam.style.minWidth = '130px';
    FONTURI.forEach(f => selFam.appendChild(el('option', null, { value: f }, [f])));
    selFam.value = S.txt.fam;
    const selMar = el('select', 'lh-ap-pt-sel', { 'aria-label': 'Dimensiune text', 'data-lh-tinta': 'lista:Dimensiune text' });
    MARIMI_TEXT.forEach(m => selMar.appendChild(el('option', null, { value: String(m) }, [String(m)])));
    selMar.value = String(S.txt.pt);
    const btnB = el('button', 'lh-ap-pt-btn', { type: 'button', 'aria-pressed': 'false', 'data-lh-tinta': 'buton:Ingrosat', title: 'Ingroșat' }, [el('b', null, null, ['B'])]);
    const btnI = el('button', 'lh-ap-pt-btn', { type: 'button', 'aria-pressed': 'false', 'data-lh-tinta': 'buton:Cursiv', title: 'Cursiv' }, [el('i', null, null, ['I'])]);
    selFam.addEventListener('change', () => { S.txt.fam = selFam.value; actualizeaza(); aplicaFontCasetei(); });
    selMar.addEventListener('change', () => { S.txt.pt = +selMar.value; actualizeaza(); aplicaFontCasetei(); });
    btnB.addEventListener('click', () => { S.txt.b = !S.txt.b; actualizeaza(); aplicaFontCasetei(); });
    btnI.addEventListener('click', () => { S.txt.i = !S.txt.i; actualizeaza(); aplicaFontCasetei(); });

    const grupFont = el('div', 'lh-ap-pt-grup', { 'data-lh-zona': 'grup_font' }, [
      el('div', 'lh-ap-pt-rand', null, [selFam, selMar, btnB, btnI]), el('div', 'lh-ap-pt-grup-t', null, ['Font'])]);
    grupFont.hidden = true;
    grupFont.addEventListener('pointerdown', () => {                    // marcăm apăsarea: blur-ul ei nu închide caseta
      fontAtins = true; setTimeout(() => { fontAtins = false; }, 0);
    }, true);
    grupFont.addEventListener('click', () => {                          // după clic, tastatura revine în casetă
      setTimeout(() => { if (casetaText) { try { casetaText.inp.focus(); } catch (e) { /* */ } } }, 0);
    });

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
      el('div', 'lh-ap-pt-grup', null, [el('div', 'lh-ap-pt-rand', null, [btnLipeste, btnTaie, btnCopiaza]),
        el('div', 'lh-ap-pt-grup-t', null, ['Clipboard'])]),
      el('div', 'lh-ap-pt-grup', null, [el('div', 'lh-ap-pt-rand', null, [btnDecupa, btnRedim, btnRotS, btnRotD, btnRot180,
        btnOriz, btnVert, btnRotPers]), el('div', 'lh-ap-pt-grup-t', null, ['Imagine'])]),
      el('div', 'lh-ap-pt-grup', null, [el('div', 'lh-ap-pt-rand', null, [btnAnul, btnRef, btnTot, btnSterge]),
        el('div', 'lh-ap-pt-grup-t', null, ['Editare'])]),
      grupFont,
      el('div', 'lh-ap-pt-grup', null, [el('div', 'lh-ap-pt-fg', null, [fg, pal]), el('div', 'lh-ap-pt-rand', null, [btnEditCul]),
        el('div', 'lh-ap-pt-grup-t', null, ['Culori'])])
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
      else if (ctrl && k === 'n') fap = () => cere(nou);
      else if (ctrl && k === 'o') fap = () => cere(deschideDialog);
      else if (ctrl && e.shiftKey && k === 's') fap = salveazaCaDialog;
      else if (ctrl && k === 's') fap = salveaza;
      else if (ctrl && k === 'a') fap = selecteazaTot;
      else if (ctrl && k === 'x') fap = taie;
      else if (ctrl && k === 'c') fap = copiaza;
      else if (ctrl && k === 'v') fap = lipeste;
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
      swatch.forEach(([h, b]) => { b.setAttribute('aria-pressed', String(h === S[S.slot === 2 ? 'c2' : 'c1'])); });
      cerc1.style.background = S.c1; cerc2.style.background = S.c2;
      cerc1.setAttribute('aria-pressed', String(S.slot !== 2));
      cerc2.setAttribute('aria-pressed', String(S.slot === 2));
      btnAnul.disabled = !ANULARE.length; btnRef.disabled = !REFACERE.length;
      const sel1 = !!S.selectie;
      [btnTaie, btnCopiaza, btnDecupa, btnSterge].forEach(b => { b.disabled = !sel1; });
      btnLipeste.disabled = !PORTAPAPIER;
      selFam.value = S.txt.fam; selMar.value = String(S.txt.pt);
      btnB.setAttribute('aria-pressed', String(S.txt.b)); btnI.setAttribute('aria-pressed', String(S.txt.i));
      grupFont.hidden = S.unealta !== 'text';
      titluT.textContent = (S.nume || 'Fără titlu') + (S.nesalvat ? '*' : '') + ' - Paint';
      pan.style.cursor = S.unealta === 'text' ? 'text' : (S.unealta === 'lupa' ? 'zoom-in' : (S.unealta === 'pipeta' ? 'copy' : 'crosshair'));
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
      portapapier: PORTAPAPIER ? { latime: PORTAPAPIER.width, inaltime: PORTAPAPIER.height } : null,
      texte: { familie: S.txt.fam, dimensiune_pt: S.txt.pt, ingrosat: S.txt.b, cursiv: S.txt.i },
      culoare_activa: S.slot,
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
    forme: FORME,
    fonturi: FONTURI,
    marimiText: MARIMI_TEXT,
    tipuri: TIPURI
  });
})();
