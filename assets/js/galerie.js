/*
 * galerie.js — imaginile LearningHub se deschid PE ACEEAȘI PAGINĂ, în mod galerie (30.09.2026).
 * Marcaj pentru verificarea live: LH_GALERIE_VERSIUNE="2026-09-30"
 *
 * Cererea profesorului: „imaginile de pe site ar trebui să se deschidă pe aceeași pagină în mod galerie - să faci
 * clic lângă să se închidă previzualizarea”. Contractul: _campaign/revizuire_completa_2026_09/galerie_imagini/contract.md
 *
 * CE PRINDE: un clic simplu pe un <a href> spre un fișier-imagine AL SITULUI (aceeași origine; .png .jpg .jpeg .gif
 * .webp .svg .avif .bmp). Ascultarea e delegată pe document, deci merge și pe capturile desenate TÂRZIU de JS
 * (șablonul fig din lecții și jocuri).
 * CE LASĂ CUM ERA: alt domeniu (ex. „Wikimedia Commons”), linkurile cu download, Ctrl/Shift/Meta/Alt+clic, clicul cu
 * rotița, clicurile deja tratate de pagină (defaultPrevented), tot ce stă sub [data-lh-galerie="nu"].
 * GALERIA: doar linkurile VIZIBILE acum, în ordinea din pagină (aceeași imagine legată de două ori apare o dată, pe
 * locul primei apariții); la capete săgeata se oprește. Textul: figcaption, altfel alt-ul imaginii, altfel textul
 * linkului. Pe telefon: glisare stânga/dreapta (un deget), mărire cu două degete (nu glisează).
 * ÎNCHIDERE: clic pe fundal, ✕, Esc, butonul Înapoi (history.pushState la deschidere, popstate închide; pe celelalte
 * drumuri intrarea noastră se scoate cu history.back(), pe aceeași pagină). Se închide pe `click`, nu pe
 * pointerup/touchend: altfel clicul care urmează ar cădea pe pagina de dedesubt. În plus, un scut transparent mai
 * stă 400 ms după închidere și înghite a doua atingere dintr-o atingere dublă.
 * DUPĂ: aceeași derulare (0 px), focusul înapoi pe link, DOM-ul paginii exact ca înainte (gazda se scoate).
 * STILUL stă într-un shadow root (clase lh-gal-*): CSS-ul paginii nu-l atinge, iar al nostru nu iese în pagină.
 * Nimic spre exterior, nicio bibliotecă. „Mărime reală” = singurul drum spre o filă nouă (target=_blank rel=noopener).
 */
(function () {
  'use strict';
  if (window.LHGalerie) return;   // încărcat de două ori (motor.js + site-credit.js + <script> direct): o singură dată
  var VERSIUNE = '2026-09-30';
  window.LH_GALERIE_VERSIUNE = VERSIUNE;

  var EXT = /\.(png|jpe?g|gif|webp|svg|avif|bmp)$/i;
  var PAZA_DESCHIDERE = 400;   // ms: a doua atingere dintr-o atingere dublă nu apasă nimic în previzualizarea abia deschisă
  var PAZA_INCHIDERE = 400;    // ms: scutul de după închidere
  var PAZA_GEST = 350;         // ms: clicul de după o glisare / ciupire nu închide
  var PRAG_GLISARE = 50;       // px pe orizontală
  var ZOOM_MAX = 5;

  var gazda = null, rad = null, E = {};
  var deschisa = false, L = [], idx = 0, sursa = null, x0 = 0, y0 = 0, deschisaLa = 0, ultimGest = 0;
  var tScut = 0, generatie = 0, tastaInchidere = null, jos = null;
  var ist = { alNostru: false, token: 0, asteptInapoi: false, reimpinge: false, tAsteapta: 0 };
  var z = { s: 1, tx: 0, ty: 0 }, degete = new Map(), gest = null;

  function acum() { return Date.now(); }
  function curat(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); }
  function limita(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ---------------- ce e „imagine a sitului” ---------------- */
  function urlDe(a) {
    var h = a.getAttribute('href');
    if (!h) return null;
    try { return new URL(h, document.baseURI); } catch (e) { return null; }
  }
  function eImagineSit(a) {
    if (!a || a.hasAttribute('download')) return false;
    if (a.closest('[data-lh-galerie="nu"]')) return false;
    var u = urlDe(a);
    if (!u || u.protocol !== location.protocol) return false;
    if (u.protocol !== 'file:' && u.host !== location.host) return false;
    var p = u.pathname;
    try { p = decodeURIComponent(p); } catch (e) {}
    return EXT.test(p);
  }
  function vizibil(a) {
    if (typeof a.checkVisibility === 'function' && !a.checkVisibility({ visibilityProperty: true, checkVisibilityCSS: true })) return false;
    return a.getClientRects().length > 0;
  }
  function areFigura(a) { return !!(a.querySelector('img') || a.closest('figure')); }
  function textDe(a) {
    var t = '', f = a.closest('figure'), img = a.querySelector('img');
    if (f) { var c = f.querySelector('figcaption'); if (c) t = curat(c.textContent); }
    if (!t && img) t = curat(img.getAttribute('alt'));
    if (!t) t = curat(a.textContent);
    if (!t) t = curat(a.getAttribute('title') || a.getAttribute('aria-label'));
    return t;
  }
  function altDe(a) {
    var img = a.querySelector('img'), t = img ? curat(img.getAttribute('alt')) : '';
    return t || textDe(a) || 'Imagine';
  }
  function cheie(u) { return u.href.split('#')[0]; }
  function element(a) { var u = urlDe(a); return { url: u.href, text: textDe(a), alt: altDe(a), fig: areFigura(a) }; }
  /* lista galeriei: linkurile-imagine vizibile ACUM, în ordinea din pagină, fiecare imagine o singură dată */
  function colecteaza(apasat) {
    var toate = document.querySelectorAll('a[href]'), loc = {}, R = [];
    for (var j = 0; j < toate.length; j++) {
      var a = toate[j];
      if (!eImagineSit(a) || (a !== apasat && !vizibil(a))) continue;
      var c = cheie(urlDe(a));
      if (loc[c] != null) {   // aceeași imagine încă o dată: păstrăm locul primei apariții, cu textul capturii dacă are
        var ex = R[loc[c]];
        if (!ex.fig && areFigura(a)) { var nou = element(a); ex.text = nou.text; ex.alt = nou.alt; ex.fig = true; }
        continue;
      }
      loc[c] = R.length;
      R.push(element(a));
    }
    var k = apasat ? loc[cheie(urlDe(apasat))] : 0;
    if (k == null) { R = [element(apasat)]; k = 0; }
    return { L: R, i: k };
  }

  /* ---------------- previzualizarea (shadow root) ---------------- */
  var CSS = [
    ':host{all:initial!important;position:fixed!important;top:0!important;right:0!important;bottom:0!important;left:0!important;',
    'z-index:2147483000!important;display:block!important;margin:0!important;padding:0!important;border:0!important;',
    'width:auto!important;height:auto!important;transform:none!important;opacity:1!important;visibility:visible!important;',
    'pointer-events:auto!important;color-scheme:dark}',
    '*,*::before,*::after{box-sizing:border-box}',
    '[hidden]{display:none!important}',
    '.lh-gal{position:fixed;top:0;right:0;bottom:0;left:0;z-index:2147483000;display:flex;flex-direction:column;margin:0;',
    'background:rgba(8,10,14,.93);color:#f4f6fa;font:16px/1.4 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;',
    'touch-action:none;overscroll-behavior:contain;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;',
    'user-select:none;outline:none;text-align:left}',
    '.lh-gal.lh-gal-scut{background:transparent}',
    '.lh-gal.lh-gal-scut>*{visibility:hidden}',
    '.lh-gal-sus{flex:0 0 auto;display:flex;align-items:center;gap:8px;min-height:60px;padding:8px 10px}',
    '.lh-gal-contor{margin-right:auto;padding:0 6px;font-size:16px;font-weight:700;font-variant-numeric:tabular-nums;',
    'letter-spacing:.02em;color:#f4f6fa;white-space:nowrap}',
    '.lh-gal-btn{-webkit-appearance:none;appearance:none;display:inline-flex;align-items:center;justify-content:center;',
    'min-width:44px;min-height:44px;margin:0;padding:0 14px;border:2px solid rgba(255,255,255,.9);border-radius:999px;',
    'background:rgba(22,25,32,.82);color:#fff;font:600 15px/1 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;',
    'text-decoration:none;cursor:pointer;box-shadow:0 1px 6px rgba(0,0,0,.45)}',
    '.lh-gal-btn:hover{background:rgba(52,58,72,.95)}',
    '.lh-gal-btn:focus{outline:none}',
    '.lh-gal-btn:focus-visible{outline:3px solid #ffd54a;outline-offset:2px}',
    '.lh-gal-btn[disabled]{opacity:.3;cursor:default;box-shadow:none}',
    '.lh-gal-btn[disabled]:hover{background:rgba(22,25,32,.82)}',
    '.lh-gal-real{min-height:40px;font-size:14px}',
    '.lh-gal-x{width:44px;padding:0;font-size:22px}',
    '.lh-gal-scena{position:relative;flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;',
    'padding:4px 64px;overflow:hidden}',
    '.lh-gal-img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;margin:0;padding:0;border:0;',
    'border-radius:4px;background:#fff;box-shadow:0 6px 34px rgba(0,0,0,.55);transform-origin:50% 50%;touch-action:none;',
    '-webkit-user-drag:none;user-select:none;cursor:default}',
    '.lh-gal[data-stare="incarca"] .lh-gal-img{visibility:hidden}',
    '.lh-gal[data-stare="eroare"] .lh-gal-img{display:none}',
    '.lh-gal-stare{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);max-width:min(460px,86%);margin:0;',
    'padding:14px 18px;border:1px solid rgba(255,255,255,.35);border-radius:10px;background:rgba(22,25,32,.92);',
    'color:#fff;font-size:16px;line-height:1.45;text-align:center;-webkit-user-select:text;user-select:text}',
    '.lh-gal-stare:empty{display:none}',
    '.lh-gal[data-stare="gata"] .lh-gal-stare{display:none}',
    '.lh-gal-nav{position:absolute;top:50%;width:48px;height:48px;min-height:48px;margin-top:-24px;padding:0 0 3px;',
    'font-size:30px;font-weight:400}',
    '.lh-gal-prev{left:8px}',
    '.lh-gal-next{right:8px}',
    '.lh-gal-text{flex:0 0 auto;max-height:28vh;overflow:auto;margin:0;padding:8px 18px 16px;text-align:center;',
    'font-size:15px;line-height:1.45;color:#e9edf3;touch-action:pan-y;overscroll-behavior:contain;',
    '-webkit-user-select:text;user-select:text}',
    // textul stă într-o casetă cât literele: un clic pe rândul de jos, în afara ei, e tot „lângă imagine” și închide
    '.lh-gal-text-in{display:inline-block;max-width:100%;vertical-align:top}',
    '@media (max-width:600px){.lh-gal-sus{min-height:56px;padding:6px 8px}.lh-gal-scena{padding:4px 6px}',
    '.lh-gal-nav{width:44px;height:44px;min-height:44px;margin-top:-22px;background:rgba(22,25,32,.66)}',
    '.lh-gal-prev{left:4px}.lh-gal-next{right:4px}.lh-gal-text{padding:6px 12px 12px;font-size:14px}}',
    '@media (forced-colors:active){.lh-gal-btn{border-color:ButtonText}.lh-gal{background:Canvas}}'
  ].join('');

  var HTML =
    '<div class="lh-gal" role="dialog" aria-modal="true" aria-label="Imaginea mărită" aria-describedby="lh-gal-text" tabindex="-1" data-stare="incarca">' +
      '<div class="lh-gal-sus">' +
        '<span class="lh-gal-contor"></span>' +
        '<a class="lh-gal-btn lh-gal-real" href="#" target="_blank" rel="noopener" title="Deschide imaginea singură, într-o filă nouă, ca să vezi detaliile mărunte">Mărime reală</a>' +
        '<button class="lh-gal-btn lh-gal-x" type="button" aria-label="Închide imaginea" title="Închide (Esc)">✕</button>' +
      '</div>' +
      '<div class="lh-gal-scena">' +
        '<img class="lh-gal-img" alt="" draggable="false">' +
        '<p class="lh-gal-stare" role="status"></p>' +
        '<button class="lh-gal-btn lh-gal-nav lh-gal-prev" type="button" aria-label="Imaginea anterioară" title="Imaginea anterioară (←)">‹</button>' +
        '<button class="lh-gal-btn lh-gal-nav lh-gal-next" type="button" aria-label="Imaginea următoare" title="Imaginea următoare (→)">›</button>' +
      '</div>' +
      '<p class="lh-gal-text" id="lh-gal-text"><span class="lh-gal-text-in"></span></p>' +
    '</div>';

  function construieste() {
    if (gazda) return;
    gazda = document.createElement('div');
    gazda.id = 'lh-galerie-gazda';
    gazda.setAttribute('data-lh-galerie-versiune', VERSIUNE);
    rad = gazda.attachShadow ? gazda.attachShadow({ mode: 'open' }) : gazda;
    rad.innerHTML = '<style>' + CSS + '</style>' + HTML;
    var q = function (s) { return rad.querySelector(s); };
    E = { rad: q('.lh-gal'), contor: q('.lh-gal-contor'), real: q('.lh-gal-real'), x: q('.lh-gal-x'), scena: q('.lh-gal-scena'),
          img: q('.lh-gal-img'), stare: q('.lh-gal-stare'), prev: q('.lh-gal-prev'), next: q('.lh-gal-next'), text: q('.lh-gal-text'),
          textIn: q('.lh-gal-text-in') };
    // paza atingerii duble: în primele 400 ms după deschidere, un clic de indicator (nu de tastatură) nu apasă nimic
    E.rad.addEventListener('click', function (e) {
      if (e.detail > 0 && acum() - deschisaLa < PAZA_DESCHIDERE) { e.preventDefault(); e.stopPropagation(); }
    }, true);
    E.rad.addEventListener('click', function (e) {
      if (!deschisa) { e.preventDefault(); return; }   // scutul: nimic nu trece dedesubt
      var t = e.target;
      if (t.closest('.lh-gal-btn, .lh-gal-img, .lh-gal-text-in, .lh-gal-stare')) return;
      // o selecție de text trasă până pe fundal (sau pornită de pe fundal) nu închide: doar clicul pe loc
      if (e.detail > 0 && jos && (jos.text || Math.abs(e.clientX - jos.x) > 6 || Math.abs(e.clientY - jos.y) > 6)) return;
      if (acum() - ultimGest < PAZA_GEST) return;
      inchide('fundal');
    });
    E.x.addEventListener('click', function () { inchide('x'); });
    sageata(E.prev, -1);
    sageata(E.next, 1);
    E.real.addEventListener('click', function (e) { if (!deschisa) e.preventDefault(); });
    // rotița nu derulează pagina din spate (textul lung al capturii se poate derula)
    E.rad.addEventListener('wheel', function (e) { if (!e.target.closest('.lh-gal-text')) e.preventDefault(); }, { passive: false });
    // fără autoderulare (rotița); pe scut, apăsarea nu mută focusul de pe imaginea din pagină (unde l-am întors)
    E.rad.addEventListener('mousedown', function (e) { if (e.button === 1 || !deschisa) e.preventDefault(); });
    E.rad.addEventListener('pointerdown', function (e) {
      if (!deschisa) { e.preventDefault(); return; }
      jos = { x: e.clientX, y: e.clientY, text: !!(e.target.closest && e.target.closest('.lh-gal-text-in')) };
    });
    E.scena.addEventListener('pointerdown', laJos);
    E.scena.addEventListener('pointermove', laMiscare);
    E.scena.addEventListener('pointerup', laSus);
    E.scena.addEventListener('pointercancel', laSus);
  }

  /* săgețile: la ATINGERE răspund când se ridică degetul de pe buton (după o glisare rapidă, browserul poate înghiți
     clicul următor, iar elevul ar apăsa degeaba); clicul care urmează atingerii e ignorat. Mouse și tastatură: clic. */
  function sageata(b, pas) {
    var t = 0;
    b.addEventListener('pointerup', function (e) {
      if (!deschisa || e.pointerType === 'mouse' || acum() - deschisaLa < PAZA_DESCHIDERE) return;
      var r = b.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
      t = acum();
      mergi(idx + pas);
    });
    b.addEventListener('click', function () { if (acum() - t > 700) mergi(idx + pas); });
  }

  /* ---------------- mărire cu două degete + glisare (atingere/stilou; mouse-ul doar dă clic) ---------------- */
  function puncte() { var p = []; degete.forEach(function (v) { if (p.length < 2) p.push(v); }); return p; }
  function dist(p) { return Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y); }
  function mijloc(p) { return { x: (p[0].x + p[1].x) / 2, y: (p[0].y + p[1].y) / 2 }; }
  function centru() { var r = E.scena.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
  function aplica() {
    E.img.style.transform = (z.s === 1 && !z.tx && !z.ty) ? '' : 'translate(' + z.tx + 'px,' + z.ty + 'px) scale(' + z.s + ')';
  }
  function reseteaza() { z.s = 1; z.tx = 0; z.ty = 0; if (E.img) aplica(); }
  function tine() {   // imaginea mărită nu fuge din ecran
    var w = E.img.offsetWidth, h = E.img.offsetHeight, mx = Math.max(0, (w * z.s - w) / 2), my = Math.max(0, (h * z.s - h) / 2);
    z.tx = limita(z.tx, -mx, mx); z.ty = limita(z.ty, -my, my);
  }
  function laJos(e) {
    if (!deschisa || e.pointerType === 'mouse') return;
    if (e.target.closest && e.target.closest('.lh-gal-btn')) return;
    degete.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (degete.size === 1) gest = { tip: 'unu', x0: e.clientX, y0: e.clientY, t0: acum(), tx0: z.tx, ty0: z.ty, mutat: false };
    else if (degete.size === 2) { var p = puncte(); gest = { tip: 'doua', d0: dist(p) || 1, s0: z.s, tx0: z.tx, ty0: z.ty, m0: mijloc(p) }; }
  }
  function laMiscare(e) {
    if (!degete.has(e.pointerId)) return;
    degete.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (!gest) return;
    if (gest.tip === 'doua' && degete.size >= 2) {
      var p = puncte(), m = mijloc(p), c = centru(), s = limita(gest.s0 * dist(p) / gest.d0, 1, ZOOM_MAX);
      // punctul imaginii de sub degete rămâne sub degete
      z.tx = (m.x - c.x) - (gest.m0.x - c.x - gest.tx0) * (s / gest.s0);
      z.ty = (m.y - c.y) - (gest.m0.y - c.y - gest.ty0) * (s / gest.s0);
      z.s = s; tine(); aplica();
    } else if (gest.tip === 'unu' || gest.tip === 'rest') {
      var dx = e.clientX - gest.x0, dy = e.clientY - gest.y0;
      if (Math.abs(dx) > 10 || Math.abs(dy) > 10) gest.mutat = true;
      if (z.s > 1) { z.tx = gest.tx0 + dx; z.ty = gest.ty0 + dy; tine(); aplica(); }
    }
  }
  function laSus(e) {
    if (!degete.has(e.pointerId)) return;
    degete.delete(e.pointerId);
    if (!gest) return;
    if (gest.tip === 'unu') {
      // gestul se citește întreg ÎNAINTE de mergi(): arata() îl golește (altfel eroare JS la fiecare glisare)
      var g1 = gest, dx = e.clientX - g1.x0, dy = e.clientY - g1.y0;
      gest = null;
      if (g1.mutat) ultimGest = acum();
      if (e.type === 'pointerup' && z.s === 1 && Math.abs(dx) >= PRAG_GLISARE && Math.abs(dx) > 1.5 * Math.abs(dy) && acum() - g1.t0 < 1500) {
        mergi(dx < 0 ? idx + 1 : idx - 1);
      }
    } else {   // după o ciupire: nicio glisare, niciun clic de închidere
      ultimGest = acum();
      if (degete.size === 1) { var r = puncte()[0]; gest = { tip: 'rest', x0: r.x, y0: r.y, tx0: z.tx, ty0: z.ty, mutat: true }; }
      else if (!degete.size) { if (z.s < 1.05) reseteaza(); gest = null; }
    }
  }

  /* ---------------- arată imaginea k ---------------- */
  function arata(k) {
    idx = limita(k, 0, L.length - 1);
    var it = L[idx], g = ++generatie;
    reseteaza(); degete.clear(); gest = null;
    E.rad.setAttribute('data-stare', 'incarca');
    E.stare.textContent = 'Se încarcă imaginea…';
    E.img.onload = function () { if (g === generatie) { E.rad.setAttribute('data-stare', 'gata'); E.stare.textContent = ''; } };
    E.img.onerror = function () {
      if (g !== generatie) return;
      E.rad.setAttribute('data-stare', 'eroare');
      E.stare.textContent = 'Imaginea nu s-a putut încărca. Apasă „Mărime reală” (sus), ca s-o deschizi singură, într-o filă nouă.';
    };
    E.img.alt = it.alt;
    E.img.src = it.url;
    if (E.img.complete && E.img.naturalWidth) E.img.onload();
    E.real.href = it.url;
    E.contor.textContent = (idx + 1) + ' / ' + L.length;
    E.contor.setAttribute('aria-label', 'Imaginea ' + (idx + 1) + ' din ' + L.length);
    E.textIn.textContent = it.text;
    E.text.hidden = !it.text;
    // focusul nu rămâne pe o săgeată care tocmai s-a oprit: se citește ÎNAINTE de disabled (un buton dezactivat își
    // pierde focusul pe loc, iar focusul ar cădea în spatele dialogului); trece pe săgeata cealaltă, altfel pe ✕
    var af = rad.activeElement;
    E.prev.hidden = E.next.hidden = L.length < 2;
    E.prev.disabled = idx === 0;
    E.next.disabled = idx === L.length - 1;
    if (af && af.disabled) { var alta = af === E.next ? E.prev : E.next; ((alta.disabled || alta.hidden) ? E.x : alta).focus({ preventScroll: true }); }
  }
  function mergi(k) { if (deschisa && k >= 0 && k < L.length && k !== idx) arata(k); }

  /* ---------------- deschidere / închidere ---------------- */
  function deschide(a) {
    construieste();
    var c = colecteaza(a);
    L = c.L; sursa = a;
    x0 = window.pageXOffset; y0 = window.pageYOffset;
    clearTimeout(tScut); tastaInchidere = null; jos = null;
    E.rad.classList.remove('lh-gal-scut');
    if (!gazda.isConnected) document.documentElement.appendChild(gazda);   // în afara lui <body>: regulile body>* nu se mută
    deschisa = true; deschisaLa = acum(); ultimGest = 0;
    arata(c.i);
    addEventListener('keydown', laTasta, true);
    addEventListener('keyup', opresteTasta, true);
    addEventListener('keypress', opresteTasta, true);
    document.addEventListener('focusin', laFocus, true);
    impinge();
    E.rad.focus({ preventScroll: true });
    pastreazaDerularea();
  }
  function pastreazaDerularea() {
    if (window.pageXOffset !== x0 || window.pageYOffset !== y0) {
      try { window.scrollTo({ left: x0, top: y0, behavior: 'instant' }); } catch (e) { window.scrollTo(x0, y0); }
    }
  }
  function inchide(cale) {
    if (!deschisa) return;
    deschisa = false; generatie++;
    removeEventListener('keydown', laTasta, true);
    document.removeEventListener('focusin', laFocus, true);
    degete.clear(); gest = null; reseteaza();
    E.img.onload = E.img.onerror = null;
    E.img.removeAttribute('src');
    // scutul: transparent, dar încă deasupra paginii; înghite a doua atingere, apoi gazda iese din pagină
    E.rad.classList.add('lh-gal-scut');
    tScut = setTimeout(function () {
      removeEventListener('keyup', opresteTasta, true);
      removeEventListener('keypress', opresteTasta, true);
      tastaInchidere = null;
      if (!deschisa && gazda.isConnected) gazda.remove();
    }, PAZA_INCHIDERE);
    pastreazaDerularea();
    if (sursa && sursa.isConnected && typeof sursa.focus === 'function') sursa.focus({ preventScroll: true });
    if (cale !== 'inapoi' && ist.alNostru) {   // scoatem intrarea noastră din istoric, fără a pleca de pe pagină
      ist.alNostru = false;
      if (history.state && history.state.lhGalerie === ist.token) {
        ist.asteptInapoi = true;
        clearTimeout(ist.tAsteapta);
        ist.tAsteapta = setTimeout(function () {   // popstate n-a venit: nu mai așteptăm
          ist.asteptInapoi = false;
          if (ist.reimpinge) { ist.reimpinge = false; if (deschisa) impinge(); }
        }, 1500);
        history.back();
      }
    }
  }
  function impinge() {
    if (ist.asteptInapoi) { ist.reimpinge = true; return; }   // redeschisă înainte să se termine history.back()
    try {
      history.pushState({ lhGalerie: ++ist.token }, '', location.href);
      ist.alNostru = true;
    } catch (e) { ist.alNostru = false; }   // ex. file:// în unele browsere: galeria merge și fără butonul Înapoi
  }
  addEventListener('popstate', function () {
    if (ist.asteptInapoi) {   // e chiar history.back()-ul nostru
      ist.asteptInapoi = false; clearTimeout(ist.tAsteapta);
      if (ist.reimpinge) { ist.reimpinge = false; if (deschisa) impinge(); }
      return;
    }
    if (deschisa && ist.alNostru) { ist.alNostru = false; inchide('inapoi'); pastreazaDerularea(); }
  });

  /* ---------------- tastatura: Esc, săgeți, Tab prins în previzualizare ---------------- */
  function focusabile() { return [E.real, E.x, E.prev, E.next].filter(function (b) { return !b.hidden && !b.disabled; }); }
  function laTasta(e) {
    if (!deschisa) return;
    var k = e.key, af = rad.activeElement, peButon = !!(af && af.closest && af.closest('.lh-gal-btn'));
    if (k === 'Escape' || k === 'Esc') { e.preventDefault(); tastaInchidere = k; inchide('esc'); }
    else if (k === 'ArrowLeft' || k === 'Left') { e.preventDefault(); mergi(idx - 1); }
    else if (k === 'ArrowRight' || k === 'Right') { e.preventDefault(); mergi(idx + 1); }
    else if (k === 'Home') { e.preventDefault(); mergi(0); }
    else if (k === 'End') { e.preventDefault(); mergi(L.length - 1); }
    else if (k === 'Tab') {
      e.preventDefault();
      var f = focusabile(), j = f.indexOf(af);
      if (!f.length) E.rad.focus({ preventScroll: true });
      else f[j < 0 ? (e.shiftKey ? f.length - 1 : 0) : (j + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus({ preventScroll: true });
    }
    else if (k === 'Enter' || k === ' ' || k === 'Spacebar') { if (!peButon) e.preventDefault(); }
    else if (/^(ArrowUp|ArrowDown|Up|Down|PageUp|PageDown)$/.test(k)) e.preventDefault();   // pagina din spate nu se derulează
    e.stopPropagation();   // tastele nu ajung la pagina din spate (ascultătorii puși înaintea noastră le-au văzut deja)
  }
  function opresteTasta(e) { if (deschisa || (tastaInchidere && e.key === tastaInchidere)) e.stopPropagation(); }
  function laFocus(e) {   // focusul nu iese din previzualizare
    if (!deschisa || e.target === gazda) return;
    E.rad.focus({ preventScroll: true });
  }

  /* ---------------- clicul pe pagină (delegat, merge și pe ce se desenează târziu) ---------------- */
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.shiftKey || e.metaKey || e.altKey) return;
    if (gazda && e.composedPath && e.composedPath().indexOf(gazda) >= 0) return;
    var t = e.target;
    if (t && t.nodeType !== 1) t = t.parentElement;
    if (!t || !t.closest) return;
    var a = t.closest('a[href]');
    if (!a || !eImagineSit(a)) return;
    e.preventDefault();
    deschide(a);
  });

  window.LHGalerie = {
    versiune: VERSIUNE,
    deschisa: function () { return deschisa; },
    stare: function () {
      return deschisa ? { i: idx, n: L.length, contor: E.contor.textContent, text: E.text.textContent, url: L[idx].url,
                          incarcare: E.rad.getAttribute('data-stare'), zoom: z.s } : null;
    },
    lista: function () { return colecteaza(null).L.map(function (x) { return { url: x.url, text: x.text }; }); },
    inchide: function () { inchide('api'); }
  };
})();
