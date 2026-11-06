/* fereastra.js — „Ține pașii deasupra, cât lucrezi” pe pagina de exersare (generat de tools/gif_demo/exersare_pagina.py;
   nu edita de mână). Copiat și adaptat din LearningHub, jocuri/_motor/motor.js, blocul FEREASTRA MICĂ (12.10.2026):
   pașii foii alese se mută într-o fereastră a browserului care stă mereu deasupra celorlalte (Document Picture-in-Picture,
   Chrome/Edge 116+, doar pe calculator). Elevul lucrează în Excel și bifează pașii acolo. Bifele sunt aceleași în pagină
   și în fereastră și țin cât e deschisă fila (sessionStorage: rămân la reîncărcare, nu trec la alt elev după închiderea
   filei, nu pleacă nicăieri). Fără fereastra de document: butonul rămâne ascuns și se vede sfatul cu Windows + ←. */
(function () {
  'use strict';
  var PIP = null, curenta = null, zoom = 1;
  var CHEIE = 'exersare_excel|bife|';
  function arePip() { return !!window.documentPictureInPicture; }
  function sectiuni() { return Array.prototype.slice.call(document.querySelectorAll('section[data-foaie]')); }
  function bife(foaie) {
    try { var b = JSON.parse(sessionStorage.getItem(CHEIE + foaie) || '[]'); return new Set(Array.isArray(b) ? b : []); }
    catch (e) { return new Set(); }
  }
  function puneBifa(foaie, k, da) {
    var b = bife(foaie); if (da) b.add(k); else b.delete(k);
    try { sessionStorage.setItem(CHEIE + foaie, JSON.stringify(Array.from(b).sort(function (x, y) { return x - y; }))); } catch (e) {}
    sinc();
  }
  function sinc() {   // aceleași bife în pagină și în fereastra mică, plus „2 din 4 pași bifați”
    [document, PIP && PIP.document].forEach(function (d) {
      if (!d) return;
      d.querySelectorAll('ol[data-lista]').forEach(function (ol) {
        var f = ol.getAttribute('data-lista'), b = bife(f), c = ol.querySelectorAll('input.bifa'), n = 0;
        c.forEach(function (x) { x.checked = b.has(+x.getAttribute('data-k')); if (x.checked) n++; });
        d.querySelectorAll('.bife-numar').forEach(function (p) {
          if (p.getAttribute('data-pentru') === f)
            p.textContent = c.length ? n + ' din ' + c.length + ' pași bifați' + (n === c.length ? ' — acum uită-te în Excel la căsuța de verificare.' : '') : '';
        });
      });
    });
  }
  function laSchimbare(ev) {
    var x = ev.target;
    if (!x || !x.matches || !x.matches('input.bifa')) return;
    var ol = x.closest('ol[data-lista]');
    if (ol) puneBifa(ol.getAttribute('data-lista'), +x.getAttribute('data-k'), x.checked);
  }
  function stare() {
    if (!arePip()) return;
    sectiuni().forEach(function (s) {
      var b = s.querySelector('.pip-deschide'), d = s.querySelector('.fereastra-deschisa'),
          deschisa = !!PIP && curenta === s;
      if (b) b.hidden = deschisa;
      if (d) d.hidden = !deschisa;
    });
  }
  function copie(d, el) {   // copia unui bloc din pagină, cu adrese întregi (documentul ferestrei n-are adresa paginii)
    if (!el) return null;
    var n = d.importNode(el, true);
    n.querySelectorAll('a[href]').forEach(function (a) {
      a.href = new URL(a.getAttribute('href'), location.href).href; a.target = '_blank'; a.rel = 'noopener';
    });
    return n;
  }
  function arataInFereastra(s) {
    if (!PIP) return;
    curenta = s;
    var d = PIP.document, toate = sectiuni(), i = toate.indexOf(s), titlu = s.querySelector('h2');
    d.title = titlu ? titlu.textContent : 'Pașii';
    d.body.innerHTML = '';
    var cap = d.createElement('div'); cap.className = 'pip-cap';
    var b = d.createElement('b'); b.textContent = titlu ? titlu.textContent : ''; cap.appendChild(b);
    var m = d.createElement('span'); m.className = 'pip-marime';
    [['-1', 'A−', 'Text mai mic'], ['1', 'A+', 'Text mai mare']].forEach(function (z) {
      var x = d.createElement('button'); x.type = 'button'; x.className = 'btn'; x.setAttribute('data-z', z[0]);
      x.setAttribute('aria-label', z[2]); x.textContent = z[1]; m.appendChild(x);
    });
    cap.appendChild(m); d.body.appendChild(cap);
    ['.eticheta-foaie', '.sarcina', 'ol[data-lista]', '.bife-numar', '.gata-cum'].forEach(function (q) {
      var n = copie(d, s.querySelector(q)); if (n) d.body.appendChild(n);
    });
    var nav = d.createElement('div'); nav.className = 'pip-nav';
    if (i > 0) nav.appendChild(butonNav(d, '← Foaia anterioară', 'btn', toate[i - 1]));
    if (i < toate.length - 1) nav.appendChild(butonNav(d, 'Foaia următoare →', 'btn btn-primar', toate[i + 1]));
    var inapoi = d.createElement('button'); inapoi.type = 'button'; inapoi.className = 'btn';
    inapoi.textContent = 'Adu pașii înapoi în pagină'; inapoi.onclick = function () { PIP.close(); };
    nav.appendChild(inapoi); d.body.appendChild(nav);
    d.querySelectorAll('[data-z]').forEach(function (x) {
      x.onclick = function () { zoom = Math.min(1.8, Math.max(0.8, zoom + 0.15 * x.getAttribute('data-z'))); d.body.style.zoom = zoom; };
    });
    d.body.style.zoom = zoom;
    stare(); sinc();
  }
  function butonNav(d, text, cls, tinta) {
    var x = d.createElement('button'); x.type = 'button'; x.className = cls; x.textContent = text;
    x.onclick = function () { arataInFereastra(tinta); try { tinta.scrollIntoView({ block: 'start' }); } catch (e) {} };
    return x;
  }
  async function deschide(s) {
    if (PIP) { arataInFereastra(s); PIP.focus(); return; }
    var w = await window.documentPictureInPicture.requestWindow({
      width: Math.round(Math.min(480, screen.availWidth * 0.36)), height: Math.round(Math.min(640, screen.availHeight * 0.75)) });
    PIP = w; var d = w.document;
    for (var k = 0; k < document.styleSheets.length; k++) {   // stilul paginii (site.css + <style>), ca în LearningHub
      var f = document.styleSheets[k];
      try { var st = d.createElement('style'); st.textContent = Array.prototype.map.call(f.cssRules, function (r) { return r.cssText; }).join('\n'); d.head.appendChild(st); }
      catch (e) { if (f.href) { var l = d.createElement('link'); l.rel = 'stylesheet'; l.href = f.href; d.head.appendChild(l); } }
    }
    d.documentElement.lang = document.documentElement.lang || 'ro';
    d.body.className = 'pip-pasi';
    d.addEventListener('change', laSchimbare, true);
    w.addEventListener('pagehide', function () { PIP = null; curenta = null; stare(); });
    arataInFereastra(s);
  }
  function porneste() {
    var are = arePip();
    sectiuni().forEach(function (s) {
      var b = s.querySelector('.pip-deschide'), ex = s.querySelector('.pip-explica'), sf = s.querySelector('.fereastra-sfat'),
          inapoi = s.querySelector('[data-inapoi]');
      if (b) b.hidden = !are;
      if (ex) ex.hidden = !are;
      if (sf) sf.hidden = are;
      if (b) b.onclick = function () {
        deschide(s).catch(function (e) { console.warn('[fereastra mică]', e); PIP = null; curenta = null; stare(); });
      };
      if (inapoi) inapoi.onclick = function () { if (PIP) PIP.close(); };
    });
    document.addEventListener('change', laSchimbare, true);
    stare(); sinc();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', porneste); else porneste();
})();
