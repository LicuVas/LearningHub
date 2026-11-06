/* player.js - playerul pe pasi peste <video> (generat de tools/gif_demo/pagini.py; nu edita de mana).
   Mod pas cu pas (implicit): filmul se opreste singur la capatul fiecarui pas.
   Rulează singur: curge tot, fara opriri. Oprirea se verifica in requestAnimationFrame (precizie de un cadru),
   cu rezerva pe timeupdate cand fila e in fundal. */
(function () {
  'use strict';
  var nod = document.getElementById('date-film');
  var v = document.getElementById('film');
  if (!nod || !v) return;
  var date = JSON.parse(nod.textContent);
  var seg = date.segmente;               // [{pas:-1 titlul, 0..n-1 pasii, n finalul}, ...]
  var ULTIM = seg.length - 1;
  var NPASI = seg.length - 2;            // pasii fara titlu si fara final
  var EPS = 0.05;                        // jumatate de cadru la 10 cadre/s
  var bPlay = document.getElementById('btn-play');
  var bInapoi = document.getElementById('btn-inapoi');
  var bInainte = document.getElementById('btn-inainte');
  var bDinNou = document.getElementById('btn-din-nou');
  var cbSingur = document.getElementById('singur');
  var stareSingur = document.getElementById('singur-stare');
  var eticheta = document.getElementById('pas-eticheta');
  var textMare = document.getElementById('pas-text');
  var lista = document.getElementById('lista-pasi');
  var itemi = lista ? lista.querySelectorAll('li') : [];

  var stopLa = null;     // timpul la care se opreste singur (null = nu se opreste)
  var opritLa = -1;      // indexul segmentului la al carui capat s-a oprit singur (-1 = nu)
  var pornit = false;    // a fost pornit macar o data
  var ultimaStare = '';

  // Cloudflare Pages raspunde 200 (nu 206) la cererile partiale (Range) — masurat 06.11.2026. Fara ele, saltul la un
  // pas poate esua, iar Safari pe iPhone poate refuza filmul. Filmele au 80-250 KB: le aducem INTREGI o data si le
  // redam din memorie (blob:), unde saltul merge oricum. Daca nu se poate (file://, retea), ramane adresa lui.
  (function aduIntreg() {
    var s = v.querySelector('source');
    var url = s ? s.getAttribute('src') : v.getAttribute('src');
    if (!url || !window.fetch || !window.URL || !URL.createObjectURL || location.protocol === 'file:') return;
    fetch(url).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.blob();
    }).then(function (b) {
      var t = v.currentTime, mergea = !v.paused && !v.ended;
      var blob = b.type ? b : new Blob([b], { type: 'video/mp4' });
      v.addEventListener('loadedmetadata', function o() {
        v.removeEventListener('loadedmetadata', o);
        if (t > 0) v.currentTime = t;
        if (mergea) ruleaza();
        v.setAttribute('data-intreg', '1');
      });
      if (s) s.parentNode.removeChild(s);
      v.src = URL.createObjectURL(blob);
      v.load();
    }).catch(function (e) { console.warn('filmul ramane pe adresa lui:', e && e.message); });
  })();

  function singur() { return cbSingur && cbSingur.checked; }

  function idxLa(t) {
    if (v.ended) return ULTIM;
    for (var i = ULTIM; i > 0; i--) { if (t >= seg[i].de_la - 0.001) return i; }
    return 0;
  }

  // unde se opreste filmul pornit in segmentul i (mod pas cu pas)
  function capat(i) {
    if (i === 0) i = 1;                  // titlul de inceput curge in primul pas
    if (i >= ULTIM) return null;         // finalul merge pana la capatul filmului
    return seg[i].pana_la;
  }

  function ruleaza() {
    pornit = true;
    var p = v.play();
    if (p && p.catch) p.catch(function (e) { if (e && e.name !== 'AbortError') console.warn('play:', e); });
  }

  function mergiLa(i) {
    i = Math.max(0, Math.min(ULTIM, i));
    opritLa = -1;
    v.currentTime = seg[i].de_la;
    stopLa = singur() ? null : capat(i);
    ruleaza();
    actualizeaza(true);
  }

  function porneste() {
    var t = v.currentTime;
    if (v.ended || (idxLa(t) === ULTIM && t >= (v.duration || date.durata) - 0.06)) { mergiLa(0); return; }
    var i = idxLa(t);
    if (opritLa === i && i < ULTIM) { mergiLa(i + 1); return; }   // oprit la capatul pasului: treci in urmatorul
    opritLa = -1;
    stopLa = singur() ? null : capat(i);
    ruleaza();
    actualizeaza(true);
  }

  function pauza() {
    v.pause();
    stopLa = null;
    opritLa = -1;
    actualizeaza(true);
  }

  function comuta() { if (v.paused || v.ended) porneste(); else pauza(); }

  function urmator() { var i = idxLa(v.currentTime); if (i < ULTIM) mergiLa(i + 1); }

  function anterior() { var i = idxLa(v.currentTime); if (i > 0) mergiLa(i - 1); }

  function opresteLaCapat() {
    var t = stopLa - EPS;
    v.pause();
    v.currentTime = t;
    stopLa = null;
    opritLa = idxLa(t);
    actualizeaza(true);
  }

  function verificaOprire() {
    if (stopLa !== null && !v.paused && v.currentTime >= stopLa - EPS) opresteLaCapat();
  }

  function bucla() {
    verificaOprire();
    actualizeaza(false);
    window.requestAnimationFrame(bucla);
  }

  function actualizeaza(fortat) {
    var t = v.currentTime;
    var i = idxLa(t);
    var laFinal = v.ended || (i === ULTIM && v.paused && t >= (v.duration || date.durata) - 0.06);
    var cheie = [i, v.paused, laFinal, opritLa, singur(), pornit].join('|');
    if (!fortat && cheie === ultimaStare) return;
    ultimaStare = cheie;
    var s = seg[i];
    if (s.pas < 0) eticheta.textContent = 'Început';
    else if (i === ULTIM) eticheta.textContent = 'La final';
    else eticheta.textContent = 'Pasul ' + (s.pas + 1) + ' din ' + NPASI;
    if (textMare.textContent !== s.text) textMare.textContent = s.text;
    for (var k = 0; k < itemi.length; k++) {
      var ac = (k === s.pas);
      itemi[k].classList.toggle('curent', ac);
      if (ac) itemi[k].setAttribute('aria-current', 'step'); else itemi[k].removeAttribute('aria-current');
    }
    if (laFinal) bPlay.textContent = '↺ Din nou';
    else if (!v.paused) bPlay.textContent = '⏸ Pauză';
    else bPlay.textContent = pornit ? '▶ Continuă' : '▶ Pornește';
    bDinNou.hidden = !laFinal;
    bInapoi.disabled = (i === 0);
    bInainte.disabled = (i === ULTIM);
    bInainte.classList.toggle('atentie', opritLa === i && i < ULTIM && v.paused);
    if (stareSingur) stareSingur.textContent = singur()
      ? 'Pornit: filmul merge până la capăt, fără opriri.'
      : 'Oprit: filmul se oprește după fiecare pas.';
  }

  bPlay.addEventListener('click', comuta);
  bInapoi.addEventListener('click', anterior);
  bInainte.addEventListener('click', urmator);
  bDinNou.addEventListener('click', function () { mergiLa(0); });
  v.addEventListener('click', comuta);
  // Pe telefon lista pasilor sta sub film: apasat acolo, pasul ar rula deasupra ecranului, nevazut. Daca filmul nu se
  // vede INTREG, il aducem intai sus in ecran; pe ecran mare, cu filmul vizibil, pagina nu se misca.
  function filmInEcran() {
    var r = v.getBoundingClientRect();
    var h = window.innerHeight || document.documentElement.clientHeight;
    return r.top >= 0 && r.bottom <= h;
  }
  function aduFilmul() {
    if (filmInEcran()) return;
    try { v.scrollIntoView({ block: 'start' }); } catch (e) { v.scrollIntoView(true); }
  }
  for (var k = 0; k < itemi.length; k++) {
    (function (pas) {
      var b = itemi[pas].querySelector('button');
      if (b) b.addEventListener('click', function () { aduFilmul(); mergiLa(pas + 1); });
    })(k);
  }
  if (cbSingur) cbSingur.addEventListener('change', function () {
    if (singur()) stopLa = null;
    else if (!v.paused) stopLa = capat(idxLa(v.currentTime));
    actualizeaza(true);
  });
  v.addEventListener('timeupdate', verificaOprire);   // rezerva cand rAF e oprit (fila in fundal)
  ['play', 'pause', 'ended', 'seeked', 'loadedmetadata'].forEach(function (ev) {
    v.addEventListener(ev, function () { actualizeaza(true); });
  });

  function deScris(e) {
    var tg = e.target, tag = tg && tg.tagName;
    if (tg && tg.isContentEditable) return true;
    if (tag === 'TEXTAREA' || tag === 'SELECT') return true;
    return tag === 'INPUT' && tg.type !== 'checkbox';
  }
  document.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey || deScris(e)) return;
    var tag = e.target && e.target.tagName;
    if (e.key === ' ' || e.key === 'Spacebar') {
      if (tag === 'SUMMARY' || tag === 'A') return;     // pe link / caz, Spatiul isi face treaba lui
      e.preventDefault();
      if (!e.repeat) comuta();
    } else if (e.key === 'ArrowRight') { e.preventDefault(); urmator(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); anterior(); }
  });
  document.addEventListener('keyup', function (e) {
    var tag = e.target && e.target.tagName;
    if ((e.key === ' ' || e.key === 'Spacebar') && (tag === 'BUTTON' || tag === 'INPUT')) e.preventDefault();
  });

  actualizeaza(true);
  window.requestAnimationFrame(bucla);
})();
