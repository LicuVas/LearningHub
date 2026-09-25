/*
 * prezenta.js — EVIDENȚA ACTIVITĂȚII elevilor pe LearningHub (24.09.2026).
 *
 * De ce: la testele online profesorul vede cine a intrat și cât a stat, iar elevii ȘTIU asta. Același lucru,
 * pe tot site-ul: lecții, liceu, jocuri. Scriptul e încărcat de site-credit.js (toate lecțiile) și de
 * jocuri/_motor/motor.js (toate jocurile), deci nu se adaugă de mână în pagini.
 *
 * Ce face:
 *  1. Elevul spune O DATĂ cine e (școala, clasa, numele). Numele pleacă CRIPTAT cu cheia publică a
 *     profesorului (aceeași ca la diplome, din jocuri/_motor/diplome-date.js); pe server nu stă în clar.
 *  2. Numără SECUNDELE LUCRATE pe fiecare pagină: doar cu pagina în față ȘI cu mișcare (click, tastă,
 *     derulare) în ultimele 2 minute. O filă uitată deschisă nu adună timp.
 *  3. La ~3 minute (și la închiderea paginii) trimite ce s-a adunat la teste-vasile.netlify.app/api/activitate.
 *  4. Elevul VEDE că e văzut: o etichetă mică jos („Profesorul vede activitatea ta · Ana P.”) și pagina
 *     /jurnal/ cu minutele lui. Nu există clasament — fiecare se vede doar pe sine.
 *  5. Calculatoare comune: „Nu ești tu? Schimbă elevul”; după 90 de minute fără activitate întreabă
 *     „Ești tot Ana?” și NU numără nimic până nu răspunde.
 * Vizitatorii („Nu, doar vizitez”) nu sunt urmăriți deloc; întrebarea revine abia peste 30 de zile.
 *
 * Pentru jocuri: window.Prezenta.eveniment({tip:'nivel'|'joc-gata', joc, titlu, nivel, din, stele, max}).
 * Serverul: Projects\teste-elevi\site\netlify\functions\activitate.mjs · panoul: /activitate.html acolo.
 */
(function () {
  'use strict';
  if (window.Prezenta || window.top !== window) return;
  /* pagina, în forma SCURTĂ pe care o folosește Cloudflare (/x/index.html -> /x/, /x/lectia1.html -> /x/lectia1):
     altfel aceeași lecție ar apărea de două ori în panou, după cum a fost deschisă */
  var p0 = location.pathname.replace(/index\.html$/, '').replace(/\.html$/, '');
  if (/^\/(teacher|jocuri\/diploma)\//.test(p0)) return;

  var SELF = (document.currentScript && document.currentScript.src) || (location.origin + '/assets/js/prezenta.js');
  var K_ID = 'lh_prezenta', K_COADA = 'lh_prezenta_coada', K_JURNAL = 'lh_prezenta_jurnal', K_TINUT = 'lh_prezenta_tinut';
  var TICK = 5, FEREASTRA = 120000, TRIMITE_LA = 180000, UITAT_DUPA = 90 * 60000, REFUZ_ZILE = 30;

  function citeste(k, def) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? def : v; } catch (e) { return def; } }
  function scrie(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function sterge(k) { try { localStorage.removeItem(k); } catch (e) {} }
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function ziAzi() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function idNou() { var a = new Uint8Array(16); crypto.getRandomValues(a); return Array.prototype.map.call(a, function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); }
  function scurt(nume) { var w = String(nume || '').trim().split(/\s+/); return w.length > 1 ? w[w.length - 1] + ' ' + w[0].charAt(0) + '.' : w[0] || ''; }

  var DATE = null, server = null;
  function incarcaDate() {
    if (DATE) return Promise.resolve(DATE);
    return new Promise(function (ok, nu) {
      if (window.DIPLOME) { DATE = window.DIPLOME; return ok(DATE); }
      var s = document.createElement('script');
      s.src = new URL('../../jocuri/_motor/diplome-date.js', SELF).href;
      s.onload = function () { DATE = window.DIPLOME; DATE ? ok(DATE) : nu(); };
      s.onerror = nu;
      document.head.appendChild(s);
    }).then(function (d) { server = d.server.replace(/\/api\/diploma$/, '/api/activitate'); return d; });
  }

  async function cripteaza(nume) {
    var d = await incarcaDate();
    var k = await crypto.subtle.importKey('jwk', d.cheie, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt']);
    var enc = new Uint8Array(await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, k, new TextEncoder().encode(nume)));
    var bin = ''; enc.forEach(function (x) { bin += String.fromCharCode(x); });
    return btoa(bin);
  }

  /* ---------------- starea ---------------- */
  var eu = citeste(K_ID, null);            // {id, scoala, scoalaNume, clasa, nume, numeEnc, ultima} | {refuz}
  var confirmat = false;                   // pe pagina asta: e sigur tot el (nu un coleg după 90 de minute)
  function eElev() { return !!(eu && eu.id && eu.numeEnc); }
  /* 'intreaba' = „Ești tot X?”: după 90 de minute fără activitate SAU după „Sunt alt elev” (eu.intreaba).
     Cât stă întrebarea pe ecran, timpul, nivelurile și notele se adună DEOPARTE (K_TINUT): „Da” le trece pe
     numele lui, „Nu” le aruncă. 25.09.2026, el: „dacă nu sunt atenți se pierde activitatea lor” — datele
     arătau reînscrieri la 2-5 minute, pentru că butonul din lecție „Sunt alt elev — încep lecția de la zero”
     (apăsat ca să refacă lecția) îi scotea de tot din evidență. */
  function stare() {
    if (eElev()) return (eu.intreaba || (Date.now() - (eu.ultima || 0) > UITAT_DUPA && !confirmat)) ? 'intreaba' : 'activ';
    if (eu && eu.refuz && Date.now() - eu.refuz < REFUZ_ZILE * 864e5) return 'vizitator';
    return 'necunoscut';
  }

  /* ---------------- numărarea timpului ---------------- */
  var ultimaMiscare = Date.now(), laPagina = 0;
  ['pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll'].forEach(function (e) {
    addEventListener(e, function () { ultimaMiscare = Date.now(); }, { passive: true, capture: true });
  });
  var ultimaMutare = 0;
  addEventListener('mousemove', function () { var t = Date.now(); if (t - ultimaMutare > 2000) { ultimaMutare = t; ultimaMiscare = t; } }, { passive: true });

  function adaugaInCoada(sec, vizita, cheie) {
    cheie = cheie || K_COADA;
    var c = citeste(cheie, null) || { pag: {}, ev: [] };
    var v = c.pag[p0] || { t: '', s: 0, n: 0 };
    v.t = (document.title || '').slice(0, 120); v.s += sec; v.n += vizita ? 1 : 0;
    c.pag[p0] = v; if (!c.de) c.de = Date.now();
    scrie(cheie, c);
    if (sec && cheie === K_COADA) jurnalSec(p0, v.t, sec);
  }
  function jurnalSec(p, t, sec) {
    var j = citeste(K_JURNAL, null) || { id: eu.id, zile: {}, pagini: {}, jocuri: {} };
    if (j.id !== eu.id) j = { id: eu.id, zile: {}, pagini: {}, jocuri: {} };
    var z = ziAzi(); j.zile[z] = (j.zile[z] || 0) + sec;
    var jp = j.pagini[p] || { t: '', s: 0 }; jp.t = t; jp.s += sec; jp.u = Date.now(); j.pagini[p] = jp;
    scrie(K_JURNAL, j);
  }
  /* „Da, sunt eu”: ce s-a adunat deoparte trece în coada lui (și în jurnal) */
  function mutaTinut() {
    var t = citeste(K_TINUT, null); sterge(K_TINUT);
    if (!t) return;
    var c = citeste(K_COADA, null) || { pag: {}, ev: [] };
    Object.keys(t.pag || {}).forEach(function (p) {
      var a = c.pag[p] || { t: t.pag[p].t, s: 0, n: 0 }; a.s += t.pag[p].s; a.n += t.pag[p].n; c.pag[p] = a;
      if (t.pag[p].s) jurnalSec(p, t.pag[p].t, t.pag[p].s);
    });
    c.ev = c.ev.concat(t.ev || []).slice(-30); if (!c.de) c.de = Date.now();
    scrie(K_COADA, c);
  }
  // unde merge ce se întâmplă acum: în coada lui, deoparte (până răspunde la „Ești tot X?”), sau nicăieri
  function tinta() { var s = stare(); return s === 'activ' ? K_COADA : s === 'intreaba' ? K_TINUT : null; }

  setInterval(function () {
    var s = stare();
    if (s !== 'activ' && s !== 'intreaba') return;
    if (document.visibilityState !== 'visible' || !document.hasFocus()) return;
    if (Date.now() - ultimaMiscare > FEREASTRA) return;
    if (s === 'intreaba') { adaugaInCoada(TICK, false, K_TINUT); return; }   // deoparte, nu pierdut
    eu.ultima = Date.now(); scrie(K_ID, eu);
    laPagina += TICK;
    adaugaInCoada(TICK, false);
    if (laPagina === 30 || Date.now() - ((citeste(K_COADA, {}) || {}).de || Date.now()) > TRIMITE_LA) trimite(false);
  }, TICK * 1000);

  /* ---------------- trimiterea ---------------- */
  var inZbor = false;
  function trimite(laInchidere) {
    if (!eElev() || stare() !== 'activ' || inZbor) return;
    var c = citeste(K_COADA, null);
    if (!c || (!Object.keys(c.pag).length && !c.ev.length)) return;
    var go = function () {
      var corp = JSON.stringify({
        id: eu.id, scoala: eu.scoala, clasa: eu.clasa, numeEnc: eu.numeEnc, scoalaText: eu.scoalaText,
        pag: Object.keys(c.pag).map(function (p) { return { p: p, t: c.pag[p].t, s: c.pag[p].s, n: c.pag[p].n }; }),
        ev: c.ev, acum: document.visibilityState === 'visible' ? { p: p0, t: (document.title || '').slice(0, 120) } : null
      });
      sterge(K_COADA);
      if (laInchidere && navigator.sendBeacon) { navigator.sendBeacon(server, new Blob([corp], { type: 'text/plain' })); return; }
      inZbor = true;
      fetch(server, { method: 'POST', body: corp, keepalive: true }).then(function (r) { if (!r.ok && r.status >= 500) throw 0; })
        .catch(function () { inapoi(c); }).then(function () { inZbor = false; });
    };
    if (server) go(); else if (!laInchidere) incarcaDate().then(go, function () {});
  }
  function inapoi(c) {   // n-a mers: punem înapoi ce n-a ajuns, peste ce s-a mai adunat între timp
    var n = citeste(K_COADA, null) || { pag: {}, ev: [] };
    Object.keys(c.pag).forEach(function (p) { var a = n.pag[p] || { t: c.pag[p].t, s: 0, n: 0 }; a.s += c.pag[p].s; a.n += c.pag[p].n; n.pag[p] = a; });
    n.ev = c.ev.concat(n.ev).slice(-30); n.de = Math.min(n.de || Date.now(), c.de || Date.now());
    scrie(K_COADA, n);
  }
  addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') trimite(true); });
  addEventListener('pagehide', function () { trimite(true); });

  /* ---------------- ce vede elevul ---------------- */
  var CSS = '#lhp{position:fixed;left:12px;bottom:12px;z-index:2147483000;font:14px/1.35 system-ui,Segoe UI,Arial,sans-serif;color:#e8ecf4;max-width:calc(100vw - 24px)}' +
    '#lhp .pill{display:inline-flex;align-items:center;gap:6px;background:#1b2234;border:1px solid #33405e;border-radius:999px;padding:5px 11px;cursor:pointer;box-shadow:0 2px 8px #0006;font-size:12.5px}' +
    '#lhp .pill:hover{border-color:#5b8cff}#lhp .dot{width:8px;height:8px;border-radius:50%;background:#34d399;flex:none}' +
    '#lhp .bar{background:#1b2234;border:1px solid #5b8cff;border-radius:12px;padding:12px 14px;box-shadow:0 4px 16px #0008;max-width:420px}' +
    '#lhp .bar b{color:#fff}#lhp .row{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}' +
    '#lhp button{font:inherit;border-radius:8px;padding:7px 12px;border:1px solid #5b8cff;background:#5b8cff;color:#fff;cursor:pointer}' +
    '#lhp button.g{background:transparent;color:#c8d3ea;border-color:#44506c}#lhp a{color:#8fb0ff}' +
    '#lhp label{display:block;margin:10px 0 4px;font-size:13px;color:#c8d3ea}' +
    '#lhp select,#lhp input{width:100%;box-sizing:border-box;font:inherit;padding:8px;border-radius:8px;border:1px solid #44506c;background:#0f1422;color:#fff}' +
    '#lhp .mic{font-size:12px;color:#9aa7c2;margin-top:8px}#lhp .err{color:#fca5a5;font-size:13px;margin-top:6px}' +
    '@media print{#lhp{display:none}}';
  var box;
  function arata(html) {
    if (!box) {
      var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
      box = document.createElement('div'); box.id = 'lhp'; box.setAttribute('role', 'region'); box.setAttribute('aria-label', 'Evidența activității');
      document.body.appendChild(box);
    }
    box.innerHTML = html;
    rezerva();
  }
  /* Banda stă fixă jos: fără loc rezervat, ar acoperi ultimele butoane ale paginii (pe telefon, „Mai departe”
     din jocuri). Cât e pe ecran, pagina primește dedesubt spațiu cât ea, ca orice buton să poată urca deasupra. */
  var padBaza = null;
  function rezerva() {
    if (padBaza === null) padBaza = parseFloat(getComputedStyle(document.body).paddingBottom) || 0;
    var h = box && box.firstElementChild ? box.getBoundingClientRect().height + 20 : 0;
    document.body.style.paddingBottom = (padBaza + h) + 'px';
  }
  addEventListener('resize', function () { if (box) rezerva(); });
  var $ = function (id) { return document.getElementById(id); };
  var JURNAL_URL = new URL('../../jurnal/', SELF).href;

  function randeaza() {
    var s = stare();
    /* „Nu, doar vizitez” apăsat din greșeală (25.09.2026, el: „pe urmă nu mai poate intra în monitorizare”):
       rămâne un buton mic și discret, ca elevul să se poată înscrie oricând. */
    if (s === 'vizitator') {
      arata('<span class="pill" id="lhp-elev" style="opacity:.75" title="Ești elev? Înscrie-te ca profesorul să-ți vadă munca.">Sunt elev — mă înscriu</span>');
      $('lhp-elev').onclick = formular;
      return;
    }
    if (s === 'activ') {
      arata('<span class="pill" id="lhp-pill" title="Profesorul vede ce pagini deschizi, cât timp lucrezi și ce niveluri termini. Apasă pentru jurnalul tău."><span class="dot"></span>Profesorul vede activitatea ta · <b>' + esc(scurt(eu.nume)) + '</b></span>');
      $('lhp-pill').onclick = meniu;
    } else if (s === 'intreaba') {
      arata('<div class="bar">Ești tot <b>' + esc(eu.nume) + '</b> (' + esc(eu.clasa) + ')?<div class="mic">Ce lucrezi acum se păstrează: ajunge la profesor pe numele tău după ce apeși „Da”.</div>' +
        '<div class="row"><button id="lhp-da">Da, sunt eu</button><button class="g" id="lhp-nu">Nu, sunt alt elev</button></div></div>');
      $('lhp-da').onclick = function () {
        confirmat = true; eu.intreaba = false; eu.ultima = Date.now(); scrie(K_ID, eu); ultimaMiscare = Date.now();
        mutaTinut(); trimite(false); randeaza();
        try { dispatchEvent(new CustomEvent('prezenta', { detail: identitate() })); } catch (e) {}
      };
      $('lhp-nu').onclick = function () { sterge(K_TINUT); uita(); formular(); };
    } else {
      arata('<div class="bar">Lucrezi pentru ora de informatică? <b>Spune cine ești</b>: profesorul vede ce lecții deschizi, cât lucrezi și ce niveluri termini.' + NOTA +
        '<div class="row"><button id="lhp-cine">Spune cine ești</button><button class="g" id="lhp-viz">Nu, doar vizitez</button></div></div>');
      $('lhp-cine').onclick = formular;
      $('lhp-viz').onclick = function () { eu = { refuz: Date.now() }; scrie(K_ID, eu); randeaza(); };
    }
  }

  /* Ca să nu se sperie (25.09.2026, el: „să le spunem că monitorizăm doar activitatea de pe siturile mele,
     nu activitatea lui în general - să nu creăm panică”). Apare la întrebare, în formular și în meniu. */
  var NOTA = '<div class="mic">🔒 Se vede <b>doar</b> ce faci pe LearningHub (lecțiile și jocurile profesorului). ' +
    'Nu se vede nimic din alte site-uri, aplicații, mesaje, poze sau fișiere de pe calculator ori telefon.</div>';

  function meniu() {
    arata('<div class="bar">Ești înscris ca <b>' + esc(eu.nume) + '</b> · ' + esc(eu.clasa) + ' · ' + esc(eu.scoalaNume || eu.scoala) + '.' +
      '<div class="mic">Profesorul vede: paginile deschise, minutele lucrate (doar când lucrezi, nu cu fila uitată deschisă) și nivelurile terminate. Numele pleacă criptat.</div>' + NOTA +
      '<div class="row"><a href="' + JURNAL_URL + '"><button>Jurnalul meu</button></a><button class="g" id="lhp-alt">Nu ești tu? Schimbă elevul</button><button class="g" id="lhp-x">Închide</button></div></div>');
    $('lhp-alt').onclick = function () { uita(); formular(); };
    $('lhp-x').onclick = randeaza;
  }

  /* clasele în ordinea numărului (5 AM, 5 M, 6 A … 8 M, 9 A, 9 M, X A … XII M), cifre sau romane — 25.09.2026;
     aceeași regulă ca în panoul profesorului (activitate.html cheieClasa) */
  var ROM = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9, x: 10, xi: 11, xii: 12, xiii: 13 };
  function cheieClasa(et) {
    var w = String(et || '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
    for (var i = 0; i < w.length; i++) {
      var n = /^\d+$/.test(w[i]) ? +w[i] : ROM[w[i]];
      if (n) return [n, w.filter(function (_, j) { return j !== i; }).join(' ')];
    }
    return [99, w.join(' ')];
  }
  function cmpClasa(a, b) { var x = cheieClasa(a), y = cheieClasa(b); return x[0] - y[0] || x[1].localeCompare(y[1], 'ro'); }

  function formular() {
    arata('<div class="bar"><b>Cine ești?</b><div class="mic">Pe calculatoarele din laborator, la final apasă pe etichetă → „Schimbă elevul”.</div>' + NOTA +
      '<label for="lhp-s">Școala</label><select id="lhp-s"><option value="">— alege —</option></select>' +
      '<div id="lhp-alta" style="display:none"><label for="lhp-as">Numele școlii</label><input id="lhp-as" maxlength="60" autocomplete="off" placeholder="ex. Școala Gimnazială Nr. 3">' +
      '<label for="lhp-al">Localitatea și județul</label><input id="lhp-al" maxlength="50" autocomplete="off" placeholder="ex. Roman, Neamț">' +
      '<label for="lhp-ac">Clasa</label><input id="lhp-ac" maxlength="20" autocomplete="off" placeholder="ex. a VI-a B"></div>' +
      '<div id="lhp-cc"><label for="lhp-c">Clasa</label><select id="lhp-c" disabled><option value="">— alege întâi școala —</option></select></div>' +
      '<label for="lhp-n">Numele și prenumele, <b>întregi, ca în catalog</b></label><input id="lhp-n" maxlength="40" autocomplete="off" placeholder="ex. Popescu Ana-Maria">' +
      '<div class="err" id="lhp-e"></div><div class="row"><button id="lhp-ok">Gata</button><button class="g" id="lhp-x">Mai târziu</button></div></div>');
    // „Mai târziu” păstrează alegerea de dinainte (vizitatorul rămâne vizitator, cu butonul lui mic)
    $('lhp-x').onclick = function () { if (!(eu && eu.refuz)) eu = null; randeaza(); };
    incarcaDate().then(function (d) {
      // formularul poate fi deja închis („Mai târziu”) sau redeschis (lista deja pusă) până sosesc datele
      if (!$('lhp-s') || $('lhp-s').options.length > 1) return;
      $('lhp-s').insertAdjacentHTML('beforeend', d.scoli.map(function (x) { return '<option value="' + esc(x.key) + '">' + esc(x.nume) + '</option>'; }).join('') +
        '<option value="alta">Altă școală (din altă localitate sau alt județ)</option>');
      $('lhp-s').onchange = function () {
        var alta = $('lhp-s').value === 'alta';
        $('lhp-alta').style.display = alta ? '' : 'none'; $('lhp-cc').style.display = alta ? 'none' : '';
        var sc = d.scoli.filter(function (x) { return x.key === $('lhp-s').value; })[0], c = $('lhp-c');
        c.innerHTML = '<option value="">— alege —</option>' + (sc ? sc.clase.slice().sort(cmpClasa).map(function (x) { return '<option>' + esc(x) + '</option>'; }).join('') : '');
        c.disabled = !sc;
        rezerva();
      };
    }, function () { if ($('lhp-e')) $('lhp-e').textContent ='Nu s-a putut încărca lista școlilor. Verifică internetul și reîncarcă pagina.'; });
    $('lhp-ok').onclick = async function () {
      var sc = $('lhp-s').value, cl = $('lhp-c').value, nm = $('lhp-n').value.trim().replace(/\s+/g, ' '), st = '';
      if (sc === 'alta') {
        var as = $('lhp-as').value.trim(), al = $('lhp-al').value.trim(); cl = $('lhp-ac').value.trim();
        if (!as || !al || !cl) { $('lhp-e').textContent = 'Scrie numele școlii, localitatea cu județul și clasa.'; return; }
        st = (as + ', ' + al).slice(0, 120);
      }
      if (!sc || !cl) { $('lhp-e').textContent = 'Alege școala și clasa.'; return; }
      if (nm.split(' ').length < 2) { $('lhp-e').textContent = 'Scrie numele și prenumele (două cuvinte).'; return; }
      this.disabled = true;
      try {
        var sn = st || (DATE.scoli.filter(function (x) { return x.key === sc; })[0] || {}).nume || sc;
        eu = { id: idNou(), scoala: sc, scoalaNume: sn, clasa: cl, nume: nm, numeEnc: await cripteaza(nm), ultima: Date.now() };
        if (st) eu.scoalaText = st;
        scrie(K_ID, eu); sterge(K_COADA); sterge(K_JURNAL); confirmat = true; ultimaMiscare = Date.now();
        adaugaInCoada(0, true); trimite(false); randeaza();
        try { dispatchEvent(new CustomEvent('prezenta', { detail: identitate() })); } catch (e) {}
      } catch (e) { this.disabled = false; $('lhp-e').textContent = 'Nu a mers. Reîncarcă pagina și încearcă din nou.'; }
    };
    $('lhp-n').addEventListener('keydown', function (e) { if (e.key === 'Enter') $('lhp-ok').click(); });
  }

  function uita() {
    trimite(true);
    eu = null; confirmat = false;
    sterge(K_ID); sterge(K_COADA); sterge(K_JURNAL); sterge(K_TINUT);
    try { dispatchEvent(new CustomEvent('prezenta', { detail: null })); } catch (e) {}
  }
  function identitate() { return eElev() ? { nume: eu.nume, scoala: eu.scoala, clasa: eu.clasa } : null; }

  window.Prezenta = {
    identitate: identitate,
    formular: formular,
    uita: function () { uita(); randeaza(); },
    /* „Sunt alt elev” din lecții și jocuri: NU scoate elevul (copiii îl apasă ca să refacă lecția), ci întreabă
       „Ești tot X?” la următoarea pagină; până atunci totul se ține deoparte. Ce era deja adunat pleacă acum. */
    intreaba: function () { if (!eElev()) return; trimite(true); eu.intreaba = true; scrie(K_ID, eu); randeaza(); },
    eveniment: function (e) {
      var K = tinta(); if (!eElev() || !K || !e || !e.tip || !e.joc) return;
      var c = citeste(K, null) || { pag: {}, ev: [] };
      c.ev.push({ tip: e.tip, joc: e.joc, titlu: e.titlu || '', nivel: e.nivel, din: e.din, stele: e.stele, max: e.max, cand: new Date().toISOString() });
      c.ev = c.ev.slice(-30); if (!c.de) c.de = Date.now();
      scrie(K, c);
      var j = citeste(K_JURNAL, null) || { id: eu.id, zile: {}, pagini: {}, jocuri: {} };
      if (j.id === eu.id && K === K_COADA) {
        var g = j.jocuri[e.joc] || { titlu: e.titlu || e.joc, nivele: {} };
        if (e.tip === 'nivel' && e.nivel != null) g.nivele[e.nivel] = Math.max(g.nivele[e.nivel] || 0, e.stele || 0);
        if (e.din) g.din = e.din; if (e.tip === 'joc-gata') g.gata = Date.now();
        j.jocuri[e.joc] = g; scrie(K_JURNAL, j);
      }
      if (K === K_COADA) trimite(false);
    },
    /* NOTA dintr-o lecție (25.09.2026, el: „pe LearningHub copiii sunt notați, îi aud «eu am luat 7»”).
       Chemată de lesson-summary.js când învățarea atomică e gata; pleacă doar când nota se SCHIMBĂ
       (rezumatul se redesenează des). Ține minte ultima notă trimisă pe pagină, per elev. */
    nota: function (s) {
      var K = tinta(); if (!eElev() || !K || !s || !(s.grade >= 1 && s.grade <= 10)) return;
      var k = 'lh_prezenta_nota', tr = citeste(k, null) || {};
      if (tr.id !== eu.id) tr = { id: eu.id, p: {} };
      if (tr.p[p0] === s.grade) return;
      tr.p[p0] = s.grade; scrie(k, tr);
      var det = 'atomic ' + (s.atomicCorrect || 0) + '/' + (s.atomicTotal || 0) + (s.practiceStarted ? ' · exersare ' + (s.practiceCorrect || 0) + '/' + (s.practiceTotal || 0) : ' · fără exersare');
      var c = citeste(K, null) || { pag: {}, ev: [] };
      c.ev.push({ tip: 'nota', p: p0, titlu: (document.title || '').slice(0, 120), nota: s.grade, detalii: det, cand: new Date().toISOString() });
      c.ev = c.ev.slice(-30); if (!c.de) c.de = Date.now();
      scrie(K, c);
      var j = citeste(K_JURNAL, null);
      if (j && j.id === eu.id && K === K_COADA) { j.note = j.note || {}; j.note[p0] = { t: document.title, nota: s.grade, u: Date.now() }; scrie(K_JURNAL, j); }
      if (K === K_COADA) trimite(false);
    }
  };

  function porneste() {
    randeaza();
    if (stare() === 'activ') adaugaInCoada(0, true);
    // nota calculată de lesson-summary.js înainte să ne încărcăm noi
    if (window.__lhNotaAsteapta) { window.Prezenta.nota(window.__lhNotaAsteapta); window.__lhNotaAsteapta = null; }
  }
  if (document.body) porneste(); else document.addEventListener('DOMContentLoaded', porneste);
})();
