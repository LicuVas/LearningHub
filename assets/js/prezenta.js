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
  /* NIVELURILE JOCURILOR ținute deoparte (26.09.2026, T1). Cât stă „Ești tot X?” pe ecran, motor.js scrie nivelurile
     noi în <cheia jocului>@_tinut, nu în sertarul lui X. Ce lucrează cineva neînscris stă în <cheie>@_neinscris.
     mutaJoc(din, p) le unește în sertarul p (maximul pe fiecare nivel) și șterge sursa: „Da” -> sertarul lui X;
     „Nu”/„Alege-te din listă” -> @_neinscris; înscrierea sau alegerea din listă -> sertarul celui ales. */
  function mutaJoc(din, p) {
    if (!p || p === din) return false;
    var chei = [], suf = '@' + din, mutat = false;
    try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && k.length > suf.length && k.slice(-suf.length) === suf && /^[\w-]+$/.test(k.slice(0, -suf.length))) chei.push(k); } } catch (e) { return false; }
    chei.forEach(function (k) {
      var src = citeste(k, null), kd = k.slice(0, -suf.length) + '@' + p, dst = citeste(kd, null);
      if (!src || typeof src !== 'object' || !src.lv) { sterge(k); return; }
      if (!dst || typeof dst !== 'object') dst = { nume: '', lv: {} };
      if (!dst.lv) dst.lv = {};
      Object.keys(src.lv).forEach(function (n) {
        var a = src.lv[n] || {}, b = dst.lv[n];
        dst.lv[n] = b ? Object.assign({}, b, { stars: Math.max(b.stars || 0, a.stars || 0), xp: Math.max(b.xp || 0, a.xp || 0) }) : a;
      });
      if (!dst.nume && src.nume && din === '_neinscris') dst.nume = src.nume;
      scrie(kd, dst); sterge(k); mutat = true;
    });
    return mutat;
  }
  // la înscriere / alegerea din listă: ce a lucrat neînscris (și ce era ținut deoparte) intră în sertarul lui
  function primesteNeinscris() {
    var p = citesteProfil(); if (!p || p.charAt(0) === '_') return false;
    var a = mutaJoc('_neinscris', p), b = mutaJoc('_tinut', p);
    return a || b;
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
    '#lhp .bar{background:#1b2234;border:1px solid #5b8cff;border-radius:12px;padding:12px 14px;box-shadow:0 4px 16px #0008;max-width:420px;box-sizing:border-box;max-height:calc(100vh - 24px);max-height:calc(100dvh - 24px);overflow:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}' +
    '#lhp .bar b{color:#fff}#lhp .row{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}' +
    '#lhp button{font:inherit;border-radius:8px;padding:7px 12px;border:1px solid #5b8cff;background:#5b8cff;color:#fff;cursor:pointer}' +
    '#lhp button.g{background:transparent;color:#c8d3ea;border-color:#44506c}#lhp a{color:#8fb0ff}' +
    '#lhp label{display:block;margin:10px 0 4px;font-size:13px;color:#c8d3ea}' +
    '#lhp select,#lhp input{width:100%;box-sizing:border-box;font:inherit;padding:8px;border-radius:8px;border:1px solid #44506c;background:#0f1422;color:#fff}' +
    '#lhp .mic{font-size:12px;color:#9aa7c2;margin-top:8px}#lhp .err{color:#fca5a5;font-size:13px;margin-top:6px}' +
    '#lhp .lista{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px;margin-top:10px;max-height:46vh;overflow:auto}' +
    '#lhp .lista .el{display:flex;flex-direction:column;align-items:flex-start;text-align:left;background:#0f1422;border-color:#44506c;padding:8px 10px}' +
    '#lhp .lista .el:hover{border-color:#5b8cff;background:#18213a}#lhp .lista .el span{font-size:12px;color:#9aa7c2}' +
    '#lhp .bar:has(.lista){max-width:560px}' +
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
        mutaTinut(); mutaJoc('_tinut', citesteProfil()); trimite(false); Nor.impinge(false); randeaza();
        try { dispatchEvent(new CustomEvent('prezenta', { detail: identitate() })); } catch (e) {}
      };
      $('lhp-nu').onclick = function () { sterge(K_TINUT); uita(); alege(); };
    } else if (lista().length) {
      alege();
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
      (eu.h ? '<div class="mic">☁ Progresul tău se păstrează online: pe alt calculator sau pe telefon te înscrii cu același nume și același cod și continui de unde ai rămas.</div>'
        : '<div class="mic"><b>Progresul tău stă doar pe calculatorul ăsta.</b> Alege un cod ca să-l poți continua și pe alt calculator sau acasă.</div>') +
      '<div class="row"><a href="' + JURNAL_URL + '"><button>Jurnalul meu</button></a>' + (eu.h ? '' : '<button id="lhp-cod">Păstrează-l online</button>') +
      '<button class="g" id="lhp-alt">Nu ești tu? Schimbă elevul</button><button class="g" id="lhp-x">Închide</button></div>' +
      '<div class="row"><button class="g" id="lhp-scoate" title="Progresul tău nu se șterge; doar numele tău nu mai apare în lista calculatorului.">Scoate-mă din lista calculatorului</button></div></div>');
    $('lhp-alt').onclick = function () { uita(); alege(); };
    $('lhp-x').onclick = randeaza;
    if ($('lhp-cod')) $('lhp-cod').onclick = cereCod;
    $('lhp-scoate').onclick = function () {
      var k = cheieElev(eu); scrie(K_LISTA, lista().filter(function (x) { return x.k !== k; }));
      uita(); randeaza();
    };
  }

  /* ---------------- CINE LUCREAZĂ ACUM? (26.09.2026) ----------------
     El: „pe calculatoarele din clasă, să facem o listă cu cei care le-au folosit — s-au înregistrat — și să
     permitem reluarea progresului”. Fiecare elev înscris pe calculatorul ăsta rămâne în listă (lh_elevi_pc);
     apasă pe numele lui și continuă exact de unde a rămas (sertarul lui). Nimic nu se mai șterge la schimbare. */
  var K_LISTA = 'lh_elevi_pc';
  function lista() { var l = citeste(K_LISTA, []); return Array.isArray(l) ? l.filter(function (x) { return x && x.k && x.nume; }) : []; }
  function inregistreaza() {
    if (!eElev()) return;
    var k = cheieElev(eu), l = lista().filter(function (x) { return x.k !== k; });
    l.unshift({ k: k, id: eu.id, scoala: eu.scoala, scoalaNume: eu.scoalaNume, scoalaText: eu.scoalaText, clasa: eu.clasa,
      nume: eu.nume, numeEnc: eu.numeEnc, h: eu.h || null, ultima: Date.now() });
    scrie(K_LISTA, l.slice(0, 80));
  }
  function alege() {
    var l = lista().sort(function (a, b) { return (b.ultima || 0) - (a.ultima || 0); });
    if (!l.length) { formular(); return; }
    arata('<div class="bar"><b>Cine lucrează acum?</b><div class="mic">Apasă pe numele tău și continui de unde ai rămas. Progresul fiecăruia se păstrează.</div>' +
      '<div class="lista" id="lhp-lista">' + l.map(function (x, i) {
        return '<button class="el" data-i="' + i + '"><b>' + esc(x.nume) + '</b><span>' + esc(x.clasa) + (x.h ? ' · ☁' : '') + '</span></button>';
      }).join('') + '</div>' +
      '<div class="row"><button id="lhp-nou">Nu sunt în listă</button><button class="g" id="lhp-x">Mai târziu</button></div>' +
      '<div class="mic">„Nu sunt în listă” = prima dată pe calculatorul ăsta. Dacă ai lucrat pe alt calculator sau acasă, scrie același nume și același cod și îți vine progresul.</div></div>');
    Array.prototype.forEach.call(box.querySelectorAll('.el'), function (b) { b.onclick = function () { eSunt(l[+b.dataset.i]); }; });
    $('lhp-nou').onclick = formular;
    $('lhp-x').onclick = function () { eu = eu && eu.refuz ? eu : null; if (!eu) { eu = { refuz: Date.now() }; scrie(K_ID, eu); } randeaza(); };
  }
  function eSunt(x) {
    eu = { id: x.id || idNou(), scoala: x.scoala, scoalaNume: x.scoalaNume, clasa: x.clasa, nume: x.nume, numeEnc: x.numeEnc, ultima: Date.now() };
    if (x.scoalaText) eu.scoalaText = x.scoalaText;
    if (x.h) eu.h = x.h;
    scrie(K_ID, eu); confirmat = true; ultimaMiscare = Date.now();
    inregistreaza();
    var schimbat = puneSertar();
    if (primesteNeinscris()) schimbat = true;
    arata('<div class="bar">Salut, <b>' + esc(x.nume) + '</b>! Îți aduc progresul…</div>');
    (eu.h ? Nor.trage() : Promise.resolve(false)).then(function (venit) {
      adaugaInCoada(0, true); trimite(false);
      if (schimbat || venit) { reincarcaDacaTrebuie(true, true); return; }
      randeaza();
      try { dispatchEvent(new CustomEvent('prezenta', { detail: identitate() })); } catch (e) {}
    });
  }
  function cereCod() {
    arata('<div class="bar"><b>Păstrează progresul online</b><div class="mic">Alege un cod de 4 cifre și ține-l minte (scrie-l în caiet). Pe alt calculator sau pe telefon te înscrii cu același nume, aceeași clasă și același cod, iar nivelurile tale te așteaptă acolo.</div>' +
      '<label for="lhp-k">Codul tău (4 cifre)</label><input id="lhp-k" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="ex. 4827">' +
      '<div class="err" id="lhp-e"></div><div class="row"><button id="lhp-ok">Păstrează</button><button class="g" id="lhp-x">Înapoi</button></div></div>');
    $('lhp-x').onclick = meniu;
    $('lhp-ok').onclick = async function () {
      var c = $('lhp-k').value.trim();
      if (!/^\d{4}$/.test(c)) { $('lhp-e').textContent = 'Codul are exact 4 cifre.'; return; }
      this.disabled = true;
      eu.h = await amprenta(eu, c); scrie(K_ID, eu); inregistreaza();
      var venit = await Nor.trage(); await Nor.impinge(true);
      if (venit) { reincarcaDacaTrebuie(true, true); return; }
      meniu();
    };
  }
  async function amprenta(e, cod) {
    var n = function (s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); };
    var sc = e.scoala === 'alta' ? 'alta:' + n(e.scoalaText) : e.scoala;
    var sir = 'lh-progres|' + sc + '|' + n(e.clasa).replace(/^a /, '') + '|' + n(e.nume).split(' ').sort().join(' ') + '|' + cod;
    var b = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(sir)));
    return Array.prototype.map.call(b, function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
  }

  /* ---------------- PROGRESUL ONLINE (26.09.2026) ----------------
     Cheile profilului elevului (tot ce conține profilul ca bucată întreagă: jocuri, lecții, exersări) urcă
     pe teste-vasile/api/progres sub amprenta lui (școală+clasă+nume+cod, SHA-256; nimic în clar). Profilul are
     alt id pe fiecare calculator, deci în nor sufixul devine „~P”. Unirea: la jocuri maximul pe fiecare nivel,
     la restul câștigă schimbarea mai nouă (meta = când s-a schimbat fiecare cheie pe calculatorul ăsta). */
  var K_NOR = 'lh_nor';
  function semn(s) { var h = 5381; s = String(s); for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h.toString(36) + s.length; }
  function uneste(a, b) {   // aceeași regulă ca pe server (progres.mjs)
    if (!a || a.v == null) return b; if (!b || b.v == null) return a;
    var x = null, y = null; try { x = JSON.parse(a.v); y = JSON.parse(b.v); } catch (e) {}
    if (x && y && x.lv && y.lv && typeof x.lv === 'object' && typeof y.lv === 'object') {
      var nou = (b.u || 0) >= (a.u || 0) ? y : x, vechi = nou === y ? x : y, lv = {}, i;
      for (i in vechi.lv) lv[i] = vechi.lv[i];
      for (i in nou.lv) { var p = lv[i], l = nou.lv[i]; lv[i] = p ? Object.assign({}, p, l, { stars: Math.max(p.stars || 0, l.stars || 0), xp: Math.max(p.xp || 0, l.xp || 0) }) : l; }
      var o = Object.assign({}, vechi, nou, { lv: lv, nume: nou.nume || vechi.nume || '' });
      return { v: JSON.stringify(o), u: Math.max(a.u || 0, b.u || 0) };
    }
    return (b.u || 0) >= (a.u || 0) ? b : a;
  }
  var Nor = {
    url: function () { return incarcaDate().then(function () { return server.replace(/\/api\/activitate$/, '/api/progres'); }); },
    chei: function (p) {
      var out = [];
      // profilul poate sta la coadă (joc_x@e_1, learninghub_progress_e_1) sau la mijloc (atomic-progress-e_1-cls5-…)
      var re = Nor.re(p);
      try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && re.test(k)) out.push(k); } } catch (e) {}
      return out;
    },
    re: function (p) { return new RegExp('(^|[_@-])' + p.replace(/[^\w]/g, '\\$&') + '(?=$|[_@-])'); },
    generic: function (k, p) { return k.replace(Nor.re(p), '$1~P'); },
    // ce are calculatorul ăsta pentru profilul elevului, cu momentul ultimei schimbări a fiecărei chei
    aduna: function () {
      var p = citesteProfil(); if (!p || p.charAt(0) === '_') return null;
      var m = citeste(K_NOR, null) || {}; if (m.p !== p) m = { p: p, c: {} };
      var date = {}, acum = Date.now();
      Nor.chei(p).forEach(function (k) {
        var v; try { v = localStorage.getItem(k); } catch (e) { return; }
        if (v == null || v.length > 80000) return;
        var s = semn(v), g = Nor.generic(k, p);
        if (!m.c[g] || m.c[g].s !== s) m.c[g] = { s: s, u: acum };
        date[g] = { v: v, u: m.c[g].u };
      });
      scrie(K_NOR, m);
      return { p: p, date: date, m: m };
    },
    trage: function () {
      if (!eElev() || !eu.h) return Promise.resolve(false);
      return Nor.url().then(function (u) {
        return fetch(u, { method: 'POST', body: JSON.stringify({ op: 'citeste', h: eu.h }) }).then(function (r) { return r.ok ? r.json() : null; });
      }).then(function (j) {
        if (!j || !j.date) return false;
        var a = Nor.aduna(); if (!a) return false;
        var schimbat = false;
        Object.keys(j.date).forEach(function (g) {
          if (g.indexOf('~P') < 0) return;
          var k = g.replace('~P', a.p), loc = a.date[g] || null, dupa = uneste(loc, j.date[g]);
          if (!loc || dupa.v !== loc.v) {
            try { localStorage.setItem(k, dupa.v); } catch (e) { return; }
            a.m.c[g] = { s: semn(dupa.v), u: dupa.u || Date.now() }; schimbat = true;
          }
        });
        a.m.tras = Date.now(); scrie(K_NOR, a.m);
        return schimbat;
      }).catch(function () { return false; });
    },
    impinge: function (forteaza, laInchidere) {
      if (!eElev() || !eu.h) return Promise.resolve();
      var a = Nor.aduna(); if (!a) return Promise.resolve();
      var tot = semn(JSON.stringify(a.date));
      if (!forteaza && a.m.trimis === tot) return Promise.resolve();
      var corp = JSON.stringify({ op: 'scrie', h: eu.h, date: a.date });
      if (corp.length > 380000) return Promise.resolve();
      var marcheaza = function () { var m = citeste(K_NOR, null); if (m && m.p === a.p) { m.trimis = tot; scrie(K_NOR, m); } };
      if (laInchidere && server && navigator.sendBeacon && corp.length < 60000) {
        if (navigator.sendBeacon(server.replace(/\/api\/activitate$/, '/api/progres'), new Blob([corp], { type: 'text/plain' }))) marcheaza();
        return Promise.resolve();
      }
      return Nor.url().then(function (u) { return fetch(u, { method: 'POST', body: corp, keepalive: corp.length < 60000 }); })
        .then(function (r) { if (r.ok) marcheaza(); }).catch(function () {});
    }
  };
  setInterval(function () { if (stare() === 'activ') Nor.impinge(false); }, 60000);
  addEventListener('pagehide', function () { if (stare() === 'activ') Nor.impinge(false, true); });
  addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden' && stare() === 'activ') Nor.impinge(false, true); });

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
      '<label for="lhp-k">Codul tău secret, <b>4 cifre</b> (scrie-l în caiet)</label><input id="lhp-k" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="ex. 4827">' +
      '<div class="mic">Cu același nume și același cod îți continui progresul pe orice calculator sau pe telefon. Dacă ai mai lucrat în altă parte, pune codul de atunci.</div>' +
      '<div class="err" id="lhp-e"></div><div class="row"><button id="lhp-ok">Gata</button>' + (lista().length ? '<button class="g" id="lhp-inapoi">← Înapoi la listă</button>' : '') + '<button class="g" id="lhp-x">Mai târziu</button></div></div>');
    // „Mai târziu” păstrează alegerea de dinainte (vizitatorul rămâne vizitator, cu butonul lui mic)
    $('lhp-x').onclick = function () { if (!(eu && eu.refuz)) eu = null; randeaza(); };
    if ($('lhp-inapoi')) $('lhp-inapoi').onclick = alege;
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
      var cod = $('lhp-k').value.trim();
      if (!/^\d{4}$/.test(cod)) { $('lhp-e').textContent = 'Alege un cod de exact 4 cifre (ex. 4827) și scrie-l în caiet.'; return; }
      this.disabled = true;
      try {
        var sn = st || (DATE.scoli.filter(function (x) { return x.key === sc; })[0] || {}).nume || sc;
        eu = { id: idNou(), scoala: sc, scoalaNume: sn, clasa: cl, nume: nm, numeEnc: await cripteaza(nm), ultima: Date.now() };
        if (st) eu.scoalaText = st;
        eu.h = await amprenta(eu, cod);
        // același elev deja în lista calculatorului: își păstrează id-ul (aceeași înregistrare la profesor)
        var dinLista = lista().filter(function (x) { return x.k === cheieElev(eu); })[0];
        if (dinLista && dinLista.id) eu.id = dinLista.id;
        scrie(K_ID, eu); sterge(K_COADA); if (!dinLista) sterge(K_JURNAL); confirmat = true; ultimaMiscare = Date.now();
        inregistreaza();
        adaugaInCoada(0, true);
        // întâi profilul: dacă s-a schimbat, pagina se reîncarcă pe profilul lui (fără să anunțăm jocul/lecția,
        // care altfel ar scrie numele noului elev în progresul celui dinainte). Apoi progresul lui online, dacă are.
        var schimbat = puneSertar();
        if (primesteNeinscris()) schimbat = true;
        $('lhp-e').textContent = 'Caut progresul tău…';
        var venit = await Nor.trage();
        Nor.impinge(true);
        if (schimbat || venit) { trimite(true); randeaza(); setTimeout(function () { reincarcaDacaTrebuie(true, true); }, 300); return; }
        trimite(false); randeaza();
        try { dispatchEvent(new CustomEvent('prezenta', { detail: identitate() })); } catch (e) {}
      } catch (e) { this.disabled = false; $('lhp-e').textContent = 'Nu a mers. Reîncarcă pagina și încearcă din nou.'; }
    };
    $('lhp-n').addEventListener('keydown', function (e) { if (e.key === 'Enter') $('lhp-ok').click(); });
  }

  /* SERTARUL elevului pe calculator (25.09.2026): profilul activ (learninghub_active_profile), pe care își țin
     progresul lecțiile (atomic-learning, lesson-summary, practice…) și jocurile (motor.js). Harta
     elev -> profil stă în lh_sertare. PRIMUL elev înscris pe calculator după schimbare moștenește profilul care
     era deja activ (deci progresul existent), următorii primesc profil nou. Întoarce true dacă profilul s-a
     schimbat (atunci pagina trebuie reîncărcată, ca lecția/jocul să citească progresul noului elev). */
  var K_SERTARE = 'lh_sertare', K_PROFIL = 'learninghub_active_profile';
  function cheieElev(e) {
    return e.scoala + '|' + e.clasa + '|' + String(e.nume || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ').sort().join(' ');
  }
  function hashScurt(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h.toString(36); }
  function citesteProfil() { try { return localStorage.getItem(K_PROFIL); } catch (e) { return null; } }
  function puneProfil(p) { try { if (p) localStorage.setItem(K_PROFIL, p); else localStorage.removeItem(K_PROFIL); } catch (e) {} }
  function puneSertar() {
    if (!eElev()) return false;
    var t = citeste(K_SERTARE, null) || {}, k = cheieElev(eu), vechi = citesteProfil(), p;
    if (Object.prototype.hasOwnProperty.call(t, k)) p = t[k];
    else if (!Object.keys(t).length) p = (vechi && vechi.charAt(0) !== '_') ? vechi : '';   // primul elev moștenește
    else p = 'e_' + hashScurt(k);
    /* 26.09.2026: „fără profil” (cheile vechi, nesufixate) nu se poate păstra online și nu se poate alege din listă
       fără să-l amestece cu al următorului. Primul elev primește și el sertarul lui, iar cheile nesufixate i se mută. */
    if (!p) { p = 'e_' + hashScurt(k); mutaFaraProfil(p, t); }
    t[k] = p; scrie(K_SERTARE, t);
    if (p && p !== '_guest') {   // în lista de profiluri a site-ului, ca numele să apară unde se afișează profilul
      var L = citeste('learninghub_profiles', []) || [];
      if (!L.some(function (x) { return x && x.id === p; })) {
        L.push({ id: p, name: String(eu.nume).slice(0, 20), avatar: '🎒', grade: 'cls6', created: new Date().toISOString() });
        scrie('learninghub_profiles', L);
      }
    }
    puneProfil(p || null);
    return (vechi || null) !== (p || null);
  }
  /* cheile lecțiilor și jocurilor scrise fără profil (înainte de sertare) trec în sertarul primului elev */
  function mutaFaraProfil(p, t) {
    var cunoscute = Object.keys(t).map(function (x) { return t[x]; }).filter(Boolean);
    (citeste('learninghub_profiles', []) || []).forEach(function (x) { if (x && x.id) cunoscute.push(x.id); });
    var areSufix = function (k) { return cunoscute.some(function (q) { return k.slice(-q.length - 1) === '_' + q || k.slice(-q.length - 1) === '@' + q; }); };
    var toate = []; try { for (var i = 0; i < localStorage.length; i++) toate.push(localStorage.key(i)); } catch (e) { return; }
    toate.forEach(function (k) {
      var nou = null;
      if (/^learninghub_(progress|practice|rpg|evidence)$/.test(k)) nou = k + '_' + p;
      else if (k === 'learninghub_proficiency__guest') nou = 'learninghub_proficiency_' + p;
      else if (/^practice-/.test(k) && !areSufix(k)) nou = k + '_' + p;
      else if (/^joc_[\w-]+$/.test(k) && !/_vazut_\d+$/.test(k)) nou = k + '@' + p;
      if (!nou) return;
      try { if (localStorage.getItem(nou) == null) localStorage.setItem(nou, localStorage.getItem(k)); localStorage.removeItem(k); } catch (e) {}
    });
  }
  function reincarcaDacaTrebuie(schimbat, fortat) {
    if (!schimbat) return;
    // paza împotriva buclei: o singură reîncărcare pentru aceeași pagină + același profil (dacă n-a cerut-o elevul)
    var semn = location.href + '|' + (citesteProfil() || '');
    try { if (!fortat && sessionStorage.getItem('lh_sertar_reincarcat') === semn) return; sessionStorage.setItem('lh_sertar_reincarcat', semn); } catch (e) {}
    location.reload();
  }

  function uita() {
    trimite(true);
    eu = null; confirmat = false;
    sterge(K_ID); sterge(K_COADA); sterge(K_JURNAL); sterge(K_TINUT);
    // nivelurile făcute cât stătea „Ești tot X?” nu sunt ale lui X: trec la cel care stă acum la calculator
    mutaJoc('_tinut', '_neinscris');
    puneProfil('_neinscris');   // până se înscrie următorul, nu lucrează pe profilul celui plecat
    try { dispatchEvent(new CustomEvent('prezenta', { detail: null })); } catch (e) {}
  }
  function identitate() { return eElev() ? { nume: eu.nume, scoala: eu.scoala, clasa: eu.clasa } : null; }

  window.Prezenta = {
    identitate: identitate,
    /* 'activ' | 'intreaba' | 'vizitator' | 'necunoscut' — motor.js ține nivelurile deoparte cât e 'intreaba' */
    stare: stare,
    formular: formular,
    uita: function () { uita(); randeaza(); },
    /* „Nu ești tu? Alege-te din listă” din jocuri și lecții (26.09.2026): lista elevilor calculatorului.
       Nu șterge nimic: elevul de dinainte rămâne în listă, cu progresul lui. */
    alege: function () { if (eElev()) { Nor.impinge(true); trimite(true); uita(); } alege(); },
    /* după un nivel terminat: progresul pleacă online imediat, nu la următorul minut */
    salveaza: function () { if (stare() === 'activ') Nor.impinge(false); },
    areCod: function () { return !!(eElev() && eu.h); },
    cereCod: function () { if (eElev()) cereCod(); },
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
    if (stare() === 'activ') { reincarcaDacaTrebuie(puneSertar()); inregistreaza(); }
    randeaza();
    if (stare() === 'activ') {
      adaugaInCoada(0, true);
      /* progresul de pe alte aparate: la fiecare pagină, dacă n-am mai întrebat de 2 minute. Ce vine se scrie
         în localStorage, iar jocul deschis își reîncarcă cuprinsul (evenimentul lh-progres). */
      var m = citeste(K_NOR, null) || {};
      if (eu.h && Date.now() - (m.tras || 0) > 120000) Nor.trage().then(function (venit) {
        if (venit) { try { dispatchEvent(new CustomEvent('lh-progres')); } catch (e) {} }
        Nor.impinge(false);
      });
    }
    // nota calculată de lesson-summary.js înainte să ne încărcăm noi
    if (window.__lhNotaAsteapta) { window.Prezenta.nota(window.__lhNotaAsteapta); window.__lhNotaAsteapta = null; }
  }
  if (document.body) porneste(); else document.addEventListener('DOMContentLoaded', porneste);
})();
