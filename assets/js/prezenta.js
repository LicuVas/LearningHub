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
 *  3. La ~5 minute (și la închiderea paginii) trimite ce s-a adunat la teste-vasile.netlify.app/api/activitate.
 *     (10.10.2026: era la ~3 minute; la 800 de elevi, cererile periodice sunt aproape tot costul serverului. Plecările,
 *     nivelurile și notele pleacă tot imediat.) Vezi „DE UNDE A PLECAT” și „PRIMA ATINGERE A UNUI PAS” mai jos.
 *  4. Elevul VEDE că e văzut: o etichetă mică jos („Profesorul vede activitatea ta · Ana P.”) și pagina
 *     /jurnal/ cu minutele lui. Nu există clasament — fiecare se vede doar pe sine. Eticheta nu stă peste
 *     butoane sau simulatoare, iar întrebarea „Spune cine ești” se strânge la primul gest (27.09.2026, fereste()).
 *  5. Calculatoare comune: „Nu ești tu? Schimbă elevul”; după 90 de minute fără activitate întreabă
 *     „Ești tot Ana?” și NU numără nimic până nu răspunde.
 * Vizitatorii („Nu, doar vizitez”) nu sunt urmăriți deloc; întrebarea revine abia peste 30 de zile.
 *  6. (30.09.2026, el: „fă să li se ceară acel pin dacă se deconectează și fă să fie deconectarea clară”)
 *     Pe numele unui elev se intră DOAR cu codul lui de 4 cifre: din lista „Cine lucrează acum?”, din formular cu un
 *     nume care există deja pe calculator, după „Scoate-mă din listă”. Codul se compară prin amprentă (amprenta()),
 *     nu stă nicăieri. Eticheta → „Ieși (deconectare)” → „Ai ieșit, X. Data viitoare îți cer codul.” „Mi-am uitat
 *     codul”: elevul își alege un cod nou, pleacă doar amprenta lui (cu numele criptat) spre panoul profesorului, care
 *     îl deblochează; 5 coduri greșite la rând = 30 de secunde de pauză. Vezi „CODUL LA INTRARE” mai jos.
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
  var TICK = 5, FEREASTRA = 120000, TRIMITE_LA = 300000, UITAT_DUPA = 90 * 60000, REFUZ_ZILE = 30;

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

  /* ---------------- O SINGURĂ identitate pentru toate filele (28.09.2026) ----------------
     Judecătorul VIII/1: fila lecției rescria la 5 secunde identitatea citită la încărcare, deci o înscriere făcută
     în ALTĂ filă (elevul nou, pe calculatorul comun) revenea în 6 secunde la numele celui de dinainte, iar munca
     noului elev se scria pe numele altui copil. Acum, înainte de orice scriere a identității sau a minutelor, fila
     recitește lh_prezenta (sincron); dacă altă filă a schimbat-o, o ADOPTĂ (nu o suprascrie), redesenează eticheta
     și anunță lecția/jocul prin evenimentul „prezenta”. La evenimentul „storage” se întâmplă imediat.
     Minutele de dinainte de schimbare rămân ale elevului de dinainte: fila care schimbă elevul le trimite pe numele
     lui (uita -> trimite), iar fila care adoptă nu mai scrie nimic pe numele vechi și nu mută nimic pe cel nou. */
  function formaId(e) {   // identitatea fără „ultima”, pe care fiecare filă o împrospătează
    if (!e || typeof e !== 'object') return '';
    return JSON.stringify(Object.keys(e).filter(function (k) { return k !== 'ultima'; }).sort().map(function (k) { return [k, e[k]]; }));
  }
  function cine(e) { return e && e.id && e.numeEnc ? e.id + '|' + e.nume : ''; }
  var pornit = false, tAnunt = 0;
  function anunta() {   // o dată după o rafală: identitatea și profilul (sertarul) sosesc unul după altul din cealaltă filă
    clearTimeout(tAnunt);
    tAnunt = setTimeout(function () { try { dispatchEvent(new CustomEvent('prezenta', { detail: identitate() })); } catch (e) {} }, 80);
  }
  function sincron() {   // true = altă filă a schimbat identitatea și am adoptat-o
    var raw, d = null;
    try { raw = localStorage.getItem(K_ID); } catch (e) { return false; }   // fără localStorage: rămâne ce e în memorie
    try { d = JSON.parse(raw); } catch (e) {}
    if (formaId(d) === formaId(eu)) {
      if (d && eu && (d.ultima || 0) > (eu.ultima || 0)) eu.ultima = d.ultima;
      return false;
    }
    var altul = cine(d) !== cine(eu);
    eu = d;
    if (altul) { confirmat = false; strans = false; laPagina = 0; }
    if (pornit) { randeaza(); if (altul) anunta(); }
    return true;
  }
  // „ultima” pe numele lui: peste identitatea de pe disc, proaspăt recitită (nu peste copia din memorie), cel mult o dată la 30 s
  function atinge() {
    var t = Date.now(), d = citeste(K_ID, null);
    eu.ultima = t;
    if (d && d.id === eu.id && t - (d.ultima || 0) > 30000) { d.ultima = t; scrie(K_ID, d); }
  }
  addEventListener('storage', function (e) {
    if (e.storageArea && e.storageArea !== localStorage) return;
    if (e.key === K_ID || e.key === null) sincron();
    else if (e.key === K_PROFIL && pornit) anunta();   // sertarul elevului nou vine imediat după identitate
  });

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
    if (cheie === K_TINUT && sec) c.u = Date.now();   // când s-a lucrat ULTIMA oară deoparte (vezi tinutDeoparte)
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
  function mutaJoc(din, p, doar) {   // doar(src) (opțional, 28.09.2026): mută numai cheile pentru care întoarce true
    if (!p || p === din) return false;
    var chei = [], suf = '@' + din, mutat = false;
    try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && k.length > suf.length && k.slice(-suf.length) === suf && /^[\w-]+$/.test(k.slice(0, -suf.length))) chei.push(k); } } catch (e) { return false; }
    chei.forEach(function (k) {
      var src = citeste(k, null), kd = k.slice(0, -suf.length) + '@' + p, dst = citeste(kd, null);
      if (!src || typeof src !== 'object' || !src.lv) { sterge(k); return; }
      if (doar && !doar(src)) return;
      if (!dst || typeof dst !== 'object') dst = { nume: '', lv: {} };
      if (!dst.lv) dst.lv = {};
      Object.keys(src.lv).forEach(function (n) {
        var a = src.lv[n] || {}, b = dst.lv[n];
        dst.lv[n] = b ? nivelMutat(b, a) : a;
      });
      if (!dst.nume && src.nume && din === '_neinscris') dst.nume = src.nume;
      scrie(kd, dst); sterge(k); mutat = true;
    });
    return mutat;
  }
  /* CE FACE ELEVUL PE NIVEL (01.10.2026, fișa elevului, R11): pe lângă stars/xp, nivelul din sertar poate avea ind
     (indicii cerute), ara („Arată-mi răspunsul”), sec (secunde lucrate), p1 {b,t,c} (prima încercare), t0/t1 (prima și
     ultima atingere), ps/pn (pașii văzuți / câți sunt), at (atelierul), v (văzut), fp (terminat fără p1, apoi șters cu
     „Ia-o de la capăt”: nu mai primește p1). Scrise de jocuri/_motor/motor.js
     (acolo e lista întreagă); o intrare FĂRĂ stars = nivel văzut, neterminat.
     Două uniri, cu reguli diferite:
      - nivelMutat (aici, mutaJoc): munca ținută DEOPARTE (@_tinut, @_neinscris) se MUTĂ în sertar și sursa se șterge,
        deci numărătorile (ind, ara, sec) se ADUNĂ: în @_tinut motorul a scris doar ce s-a făcut cât stătea întrebarea.
        p1 trece doar dacă sertarul n-a terminat deja nivelul fără ea și nu are fp (atunci nu mai e o primă încercare);
      - unesteNivel (uneste, mai jos; aceeași ca pe server, netlify/lib/unire.mjs): ACELAȘI elev de pe două aparate,
        deci numărătorile iau MAXIMUL (un aparat rămas în urmă nu șterge nimic), p1/t0 cel mai vechi, t1 cel mai nou.
     Un nivel vechi, doar cu {stars, xp}, se unește exact ca înainte (aceeași formă, același text).
     10.10.2026 (bara pașilor, pe elev; motor.js „BARA PE ELEV”): și re (Aplicația văzută), qm (cea mai mare întrebare
     atinsă) = MAXIMUL în ambele uniri; ul (ultimul pas afișat) = de la valoarea mai nouă la unesteNivel (ca pe server),
     iar la mutare de la munca mutată (e făcută mai târziu, cât stătea întrebarea / neînscris). */
  var NOI = ['ind', 'ara', 'sec', 'p1', 't0', 't1', 'ps', 'pn', 'at', 'v', 'fp', 're', 'qm', 'ul'];
  function numar(x) { return typeof x === 'number' && isFinite(x) && x >= 0 ? x : 0; }
  function areNoi(a, b) { return NOI.some(function (k) { return (a && a[k] != null) || (b && b[k] != null); }); }
  function ordonat(o) { var r = {}; Object.keys(o).sort().forEach(function (k) { r[k] = o[k]; }); return r; }
  function p1Bun(p) { return !!p && typeof p === 'object' && typeof p.b === 'number' && typeof p.t === 'number'; }
  function p1Vechi(x, y) {   // cea mai veche dintre două prime încercări (c = când); la egalitate sau fără c, prima
    if (!p1Bun(x)) return p1Bun(y) ? y : null; if (!p1Bun(y)) return x;
    var cx = numar(x.c) || Infinity, cy = numar(y.c) || Infinity;
    return cy < cx ? y : x;
  }
  function pasi(a, b) {      // reuniunea pașilor văzuți (numere întregi mici), crescător
    var v = {}; [a, b].forEach(function (l) { if (Array.isArray(l)) l.forEach(function (x) { if (typeof x === 'number' && x % 1 === 0 && x >= 0 && x < 500) v[x] = 1; }); });
    return Object.keys(v).map(Number).sort(function (x, y) { return x - y; });
  }
  /* câmpurile noi ale lui p (vechi / sertarul-țintă) și l (nou / mutat) în o; suma = true la mutare, maximul altfel */
  function puneNoi(o, p, l, suma) {
    ['ind', 'ara', 'sec'].forEach(function (k) { if (p[k] != null || l[k] != null) o[k] = suma ? numar(p[k]) + numar(l[k]) : Math.max(numar(p[k]), numar(l[k])); });
    ['pn', 'at', 'v', 'fp', 're', 'qm'].forEach(function (k) { if (p[k] != null || l[k] != null) o[k] = Math.max(numar(p[k]), numar(l[k])); });
    var t0 = [p.t0, l.t0].filter(function (x) { return numar(x) > 0; }), t1 = [p.t1, l.t1].filter(function (x) { return numar(x) > 0; });
    if (t0.length) o.t0 = Math.min.apply(null, t0); else delete o.t0;
    if (t1.length) o.t1 = Math.max.apply(null, t1); else delete o.t1;
    if (p.ps != null || l.ps != null) o.ps = pasi(p.ps, l.ps);
    return o;
  }
  function stele(o, p, l) {   // stars/xp = maximul, doar dacă măcar o parte le are (o intrare „văzut” rămâne fără ele)
    if (p.stars != null || l.stars != null) o.stars = Math.max(p.stars || 0, l.stars || 0);
    if (p.xp != null || l.xp != null) o.xp = Math.max(p.xp || 0, l.xp || 0);
    return o;
  }
  function nivelMutat(b, a) {   // b = în sertarul-țintă, a = mutat din @_tinut / @_neinscris
    if (!areNoi(a, b)) return Object.assign({}, b, { stars: Math.max(b.stars || 0, a.stars || 0), xp: Math.max(b.xp || 0, a.xp || 0) });   // ca înainte
    var o = stele(Object.assign({}, a, b), b, a);
    puneNoi(o, b, a, true);
    if (a.ul != null) o.ul = a.ul;   // ultimul pas: al muncii mutate (vezi mai sus)
    var p1 = p1Bun(b.p1) ? p1Vechi(b.p1, a.p1) : (p1Bun(a.p1) && !((b.stars || 0) > 0) && !b.fp ? a.p1 : null);
    if (p1) o.p1 = p1; else delete o.p1;
    return ordonat(o);
  }
  function unesteNivel(p, l) {   // p = din valoarea mai veche, l = din cea mai nouă (același elev, două aparate)
    if (!areNoi(p, l)) return Object.assign({}, p, l, { stars: Math.max(p.stars || 0, l.stars || 0), xp: Math.max(p.xp || 0, l.xp || 0) });   // ca înainte
    var o = stele(Object.assign({}, p, l), p, l);
    puneNoi(o, p, l, false);
    var p1 = p1Vechi(p.p1, l.p1);
    if (p1) o.p1 = p1; else delete o.p1;
    return ordonat(o);
  }
  // la înscriere / alegerea din listă: ce a lucrat neînscris (și ce era ținut deoparte) intră în sertarul lui
  function primesteNeinscris() {
    var p = citesteProfil(); if (!p || p.charAt(0) === '_') return false;
    var a = mutaJoc('_neinscris', p), b = mutaJoc('_tinut', p);
    return a || b;
  }
  /* CE S-A LUCRAT DEOPARTE (28.09.2026, judecătorul V/1: „Da, sunt eu” apăsat doar ca să închidă caseta trecea pe numele
     lui X munca altui elev). „Da” nu mai mută nimic singur: dacă s-a lucrat deoparte în ultimele TINUT_RECENT minute,
     a doua întrebare arată CE („Lecția 4 …, 6 minute”) și întreabă „Ai lucrat TU asta acum?”; munca mai veche nu i se
     mai oferă și merge la „neînscris” (o primește următorul elev care se înscrie). Întoarce null dacă nu e nimic. */
  var TINUT_RECENT = 20 * 60000, TINUT_MIN_SEC = 180;
  var recent = function (ts) { return !!ts && Date.now() - ts <= TINUT_RECENT; };
  /* Ce s-a lucrat deoparte în ultimele TINUT_RECENT minute: nivelurile (fiecare joc are momentul lui, `u`, pus de motor)
     și timpul (numai dacă ședința ținută deoparte a ÎNCEPUT recent, `de`: timpul se adună pe pagini, fără ore). Întâi,
     nivelurile mai vechi pleacă la „neînscris”. Întoarce null dacă nu rămâne nimic recent de oferit. */
  function tinutDeoparte() {
    mutaJoc('_tinut', '_neinscris', function (s) { return !recent(s.u); });
    var t = citeste(K_TINUT, null) || {}, sec = 0, ce = [], niv = 0, suf = '@_tinut';
    if (recent(t.de)) Object.keys(t.pag || {}).forEach(function (p) { sec += t.pag[p].s || 0; });
    (t.ev || []).forEach(function (e) { if (e.tip === 'nivel' && e.titlu && recent(Date.parse(e.cand || '')) && ce.indexOf(e.titlu) < 0) ce.push(e.titlu); });
    try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && k.slice(-suf.length) === suf) {
      // doar nivelurile TERMINATE (cu stele); o intrare doar „văzut” (motor.js, 01.10.2026) nu e un nivel făcut
      var s = citeste(k, null); if (s && s.lv) niv += Object.keys(s.lv).filter(function (n) { return s.lv[n] && (s.lv[n].stars || 0) > 0; }).length; } } } catch (e) {}
    if (!niv && sec < TINUT_MIN_SEC) return null;   // doar câteva minute pe pagină, fără niveluri: nu e nimic de întrebat
    return { sec: sec, niveluri: niv, ce: ce };
  }
  /* răspunsul întreg la „Ești tot X?”: X rămâne; munca ținută deoparte merge la el (cuMunca) sau la „neînscris” */
  function confirmaEu(cuMunca) {
    confirmat = true; eu.intreaba = false; eu.ultima = Date.now(); scrie(K_ID, eu); ultimaMiscare = Date.now();
    var t = citeste(K_TINUT, null);
    if (t && !recent(t.de)) sterge(K_TINUT);   // timpul unei ședințe deoparte începute de mult nu e al lui
    if (cuMunca) { mutaTinut(); mutaJoc('_tinut', citesteProfil()); }
    else { sterge(K_TINUT); mutaJoc('_tinut', '_neinscris'); }
    trimite(false); Nor.impinge(false); randeaza();
    try { dispatchEvent(new CustomEvent('prezenta', { detail: identitate() })); } catch (e) {}
  }
  // unde merge ce se întâmplă acum: în coada lui, deoparte (până răspunde la „Ești tot X?”), sau nicăieri
  function tinta() { var s = stare(); return s === 'activ' ? K_COADA : s === 'intreaba' ? K_TINUT : null; }

  setInterval(function () {
    if (sincron()) return;   // altă filă a schimbat elevul: secundele astea nu se scriu nici pe cel vechi, nici pe cel nou
    var s = stare();
    if (s !== 'activ' && s !== 'intreaba') return;
    if (document.visibilityState !== 'visible' || !document.hasFocus()) return;
    // pagina e în față, dar fără niciun gest de 2 minute: o singură plecare „fără gesturi” (vezi „DE UNDE A PLECAT”)
    if (Date.now() - ultimaMiscare > FEREASTRA) { if (s === 'activ') pleaca('fara-gesturi', false); return; }
    if (s === 'intreaba') { adaugaInCoada(TICK, false, K_TINUT); return; }   // deoparte, nu pierdut
    atinge();
    laPagina += TICK;
    adaugaInCoada(TICK, false);
    // a revenit după o plecare anunțată: plecarea se încheie și profesorul trebuie să afle că lucrează iar (altfel ar vedea
    // „inactiv de … a plecat de pe” până la trimiterea periodică, ~5 minute). Revenirea se anunță MEREU, cu un singur „acum”
    // pe plecare: pe loc, dacă plecarea a fost acum cel puțin un minut; altfel în clipa în care se împlinește minutul
    // (revino). Bucla 10.10.2026, G2: înainte, după o plecare sub un minut (o notificare, o privire în Excel) nu pleca nimic.
    if (plecatTrimis) {
      plecatTrimis = null; seInchide = false; revenireLa = tPlecat + REVENIRE_DUPA;
      if (revenireLa > Date.now()) programeazaRevenirea();
    }
    if ((revenireLa && Date.now() >= revenireLa) || laPagina === 30 || Date.now() - ((citeste(K_COADA, {}) || {}).de || Date.now()) > TRIMITE_LA) trimite(false);
  }, TICK * 1000);
  /* „acum”-ul de după o plecare scurtă: pleacă la un minut de la plecare, dacă elevul lucrează (pagina în față, cu focus,
     cu un gest în ultimele 2 minute) și nu a plecat din nou între timp. Orice „acum” trimis îl încheie (trimite). Dacă nu
     poate pleca acum (o cerere e pe drum, nu mai lucrează), îl trimite următorul semn numărat (revenireLa rămâne). */
  var revenireLa = 0, tRevenire = 0;
  function programeazaRevenirea() { clearTimeout(tRevenire); tRevenire = setTimeout(revino, Math.max(0, revenireLa - Date.now())); }
  function revino() {
    tRevenire = 0;
    if (!revenireLa || plecatTrimis || Date.now() < revenireLa) return;
    if (document.visibilityState !== 'visible' || !document.hasFocus() || Date.now() - ultimaMiscare > FEREASTRA) return;
    trimite(false);
  }

  /* ---------------- trimiterea ---------------- */
  var inZbor = false, plecatAmanat = null;
  /* motiv (10.10.2026, spec_api.md §2): 'ascuns' | 'inchis' | 'fara-gesturi' = cererea anunță o PLECARE de pe pagina asta
     (plecat: {p, t, pas?, motiv}) în locul lui „acum”; pleacă și cu coada goală. Întoarce true dacă cererea a plecat
     (sau pleacă după ce se află adresa serverului). */
  function trimite(laInchidere, motiv) {
    sincron();   // coada e a celui înscris ACUM pe calculator (altă filă îl poate fi schimbat)
    if (!eElev() || stare() !== 'activ') return false;
    // o cerere e deja pe drum: NU pleacă a doua, nici o plecare (bucla 10.10.2026, G4). Pe server, activ/<id> e citit-modificat-
    // scris, deci cererea care ajunge a doua (chiar o plecare mică, de la închidere) scria peste ce adusese prima: secundele,
    // nivelul terminat, nota. Plecarea rămâne deoparte și pleacă după ce se întoarce cererea de pe drum, dacă elevul tot n-a
    // revenit (dupaZbor); dacă pagina se închide între timp, se renunță la ea (panoul îl arată inactiv după 6 minute fără semn).
    if (inZbor) { if (motiv && !(plecatAmanat && RANG[plecatAmanat] >= RANG[motiv])) plecatAmanat = motiv; return false; }
    var c = citeste(K_COADA, null);
    if (!motiv && (!c || (!Object.keys(c.pag).length && !c.ev.length))) return false;
    if (!c) c = { pag: {}, ev: [] };
    // ca înainte (acum:null cu pagina ascunsă), dar acum se spune și de pe ce pagină a plecat
    if (!motiv && document.visibilityState !== 'visible') motiv = 'ascuns';
    if (!server && laInchidere) return false;
    var go = function () {
      // între apel și trimitere elevul se poate fi schimbat („Nu ești tu?”): atunci nu trimitem nimic și coada rămâne
      // pe loc, ca la ieșirea de mai sus (găsit 26.09.2026: „null.id” când pagina se încarcă mai încet)
      if (sincron() || !eu || !eElev() || stare() !== 'activ') { inZbor = false; return; }
      var al = eu.id, unde = { p: p0, t: (document.title || '').slice(0, 120) }, ps = pasAcum();
      if (ps) unde.pas = ps;
      var o = {
        id: eu.id, scoala: eu.scoala, clasa: eu.clasa, numeEnc: eu.numeEnc, scoalaText: eu.scoalaText,
        h: eu.h || null,   // amprenta progresului: jurnalul elevului găsește pe server toate aparatele lui
        pag: Object.keys(c.pag).map(function (p) { return { p: p, t: c.pag[p].t, s: c.pag[p].s, n: c.pag[p].n }; }),
        ev: c.ev
      };
      if (motiv) { unde.motiv = motiv; o.plecat = unde; } else o.acum = unde;
      if (!motiv) { revenireLa = 0; clearTimeout(tRevenire); }   // orice „acum” anunță și revenirea (vezi revino)
      var corp = JSON.stringify(o);
      sterge(K_COADA);
      if (laInchidere && navigator.sendBeacon) { navigator.sendBeacon(server, new Blob([corp], { type: 'text/plain' })); return; }
      inZbor = true;
      fetch(server, { method: 'POST', body: corp, keepalive: true }).then(function (r) { if (!r.ok && r.status >= 500) throw 0; })
        .catch(function () { inapoi(c, al); }).then(function () { inZbor = false; dupaZbor(); });
    };
    if (server) go(); else if (!laInchidere) incarcaDate().then(go, function () {});
    return true;
  }
  // plecarea ținută deoparte cât era o cerere pe drum (G4): pleacă acum, singură, doar dacă elevul tot nu lucrează
  function dupaZbor() {
    var m = plecatAmanat; plecatAmanat = null;
    if (!m) return;
    if (document.visibilityState === 'visible' && document.hasFocus() && Date.now() - ultimaMiscare <= FEREASTRA) return;   // a revenit
    pleaca(m, false);
  }

  /* ---------------- DE UNDE A PLECAT (10.10.2026) ----------------
     Profesorul: „să văd [...] de pe ce pagină a plecat când a intrat în idle” (elevul s-a dus în Excel sau în Word).
     Până acum, la ascunderea paginii pleca „acum: null”, deci panoul nu știa de unde a plecat. Acum pleacă o PLECARE:
     pagina, pasul din lecție (window.__lhPas, de la motor.js) și motivul:
       'ascuns'       = pagina ascunsă (altă filă / altă aplicație) sau fereastra fără focus de 10 secunde;
       'inchis'       = pagina închisă sau părăsită (beforeunload / pagehide);
       'fara-gesturi' = pagina în față, dar 2 minute fără niciun gest (o dată, la intrarea în inactiv).
     O singură cerere pe plecare: o plecare „mai mare” (fără gesturi < ascuns < închis) se mai anunță o dată, una egală sau
     mai mică nu. Primul gest numărat după plecare o încheie, iar revenirea se anunță cu un singur „acum”: pe loc, dacă a
     lipsit cel puțin un minut, altfel la un minut de la plecare (revino; cel mult o cerere în plus pe plecare).
     Cu o cerere pe drum, plecarea așteaptă să se întoarcă (dupaZbor), nu pleacă în paralel.
     Ce se numără nu se schimbă: tot doar cu pagina în față și cu mișcare în ultimele 2 minute. */
  var RANG = { 'fara-gesturi': 1, ascuns: 2, inchis: 3 }, REVENIRE_DUPA = 60000;
  var plecatTrimis = null, tPlecat = 0, seInchide = false, tBlur = 0;
  function pleaca(motiv, laInchidere) {
    if (plecatTrimis && RANG[plecatTrimis] >= RANG[motiv]) return;   // aceeași plecare, deja anunțată
    // o plecare nouă e starea de acum: un „acum” de revenire încă neplecat nu mai are rost
    if (trimite(laInchidere, motiv)) { plecatTrimis = motiv; tPlecat = Date.now(); revenireLa = 0; clearTimeout(tRevenire); }
  }
  // pasul din motorul lecției / jocului, dacă pagina are motor (spec_api.md §1); altfel nimic
  function pasAcum() {
    var d = window.__lhPas;
    if (!d || typeof d !== 'object' || typeof d.pas !== 'string') return null;
    return { cheie: d.cheie, nivel: d.nivel, pas: d.pas, eticheta: String(d.eticheta || '').slice(0, 40), real: d.real === true };
  }
  // la închidere / părăsire, beforeunload vine ÎNAINTE de ascundere: așa ascunderea de atunci se anunță ca „închis”, într-o
  // singură cerere (ca înainte); dacă pagina rămâne totuși deschisă, primul gest numărat șterge semnul
  addEventListener('beforeunload', function () { seInchide = true; });
  addEventListener('blur', function () {
    clearTimeout(tBlur);
    tBlur = setTimeout(function () {   // hasFocus() rămâne true cât lucrează într-un cadru (iframe) din pagină
      if (document.visibilityState === 'visible' && !document.hasFocus()) pleaca('ascuns', false);
    }, 10000);
  });
  addEventListener('focus', function () { clearTimeout(tBlur); });

  /* ---------------- PRIMA ATINGERE A UNUI PAS (10.10.2026, spec_api.md §2) ----------------
     Motorul anunță fiecare pas afișat (evenimentul „lh-pas”). Prima dată când elevul ajunge la un pas al unei lecții sau
     al unui joc (P3, Atelier, Aplicația, Î2, Citire), în coadă intră {tip:'pas', p, cheie, nivel, pas, eticheta, cand};
     o revenire la același pas nu mai trimite nimic. Ce s-a trimis se ține minte pe aparat, pe PROFILUL elevului
     (lh_prezenta_pasi = {profil: {"cheie|nivel|pas": 1}}; nu în cheile profilului, care urcă în progresul online).
     Pașii nu cer o trimitere a lor: pleacă împreună cu următoarea (la ~5 minute, la plecare, la un nivel terminat). */
  var K_PASI = 'lh_prezenta_pasi', RE_PAS = /^(p\d{1,2}|atelier|real|q\d{1,2}|citire)$/;
  function notaPas(d) {
    if (!d || typeof d !== 'object' || !RE_PAS.test(String(d.pas)) || typeof d.nivel !== 'number' || !d.cheie) return;
    if (!eElev() || tinta() !== K_COADA) return;   // cât stă „Ești tot X?” nu notăm: nu e sigur al cui e pasul
    var prof = citesteProfil(); if (!prof || prof.charAt(0) === '_') return;
    var m = citeste(K_PASI, null); if (!m || typeof m !== 'object') m = {};
    var al = m[prof] && typeof m[prof] === 'object' ? m[prof] : (m[prof] = {}), k = d.cheie + '|' + d.nivel + '|' + d.pas;
    if (al[k]) return;
    al[k] = 1;
    var ch = Object.keys(al); if (ch.length > 3000) ch.slice(0, 500).forEach(function (x) { delete al[x]; });
    var pr = Object.keys(m); if (pr.length > 80) pr.filter(function (x) { return x !== prof; }).slice(0, pr.length - 80).forEach(function (x) { delete m[x]; });
    scrie(K_PASI, m);
    var c = citeste(K_COADA, null) || { pag: {}, ev: [] };
    c.ev.push({ tip: 'pas', p: p0, cheie: String(d.cheie).slice(0, 120), nivel: d.nivel, pas: d.pas, eticheta: String(d.eticheta || '').slice(0, 40), cand: new Date().toISOString() });
    // cel mult 30 de evenimente în coadă (cât primește serverul): întâi ies pașii cei mai vechi, nivelurile și notele rămân
    while (c.ev.length > 30) { var i = 0; for (var x = 0; x < c.ev.length; x++) if (c.ev[x].tip === 'pas') { i = x; break; } c.ev.splice(i, 1); }
    if (!c.de) c.de = Date.now();
    scrie(K_COADA, c);
    if (c.ev.length >= 25) trimite(false);   // o rafală de pași: pleacă acum, ca să nu împingă afară un nivel terminat
  }
  addEventListener('lh-pas', function (e) { notaPas(e && e.detail); });
  function inapoi(c, al) {   // n-a mers: punem înapoi ce n-a ajuns, peste ce s-a mai adunat între timp
    var d = citeste(K_ID, null);
    if (!d || d.id !== al) return;   // între timp s-a înscris altul (în altă filă): minutele lui X nu trec pe el
    var n = citeste(K_COADA, null) || { pag: {}, ev: [] };
    Object.keys(c.pag).forEach(function (p) { var a = n.pag[p] || { t: c.pag[p].t, s: 0, n: 0 }; a.s += c.pag[p].s; a.n += c.pag[p].n; n.pag[p] = a; });
    n.ev = c.ev.concat(n.ev).slice(-30); n.de = Math.min(n.de || Date.now(), c.de || Date.now());
    scrie(K_COADA, n);
  }
  addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') pleaca(seInchide ? 'inchis' : 'ascuns', true); else if (pornit) sincron(); });
  addEventListener('pagehide', function () { pleaca('inchis', true); });

  /* ---------------- ce vede elevul ---------------- */
  var CSS = '#lhp{position:fixed;left:12px;bottom:12px;z-index:2147483000;font:14px/1.35 system-ui,Segoe UI,Arial,sans-serif;color:#e8ecf4;max-width:calc(100vw - 24px)}' +
    '#lhp .pill{display:inline-flex;align-items:center;gap:6px;background:#1b2234;border:1px solid #33405e;border-radius:999px;padding:5px 11px;cursor:pointer;box-shadow:0 2px 8px #0006;font-size:12.5px;min-height:32px;box-sizing:border-box}' +
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
    /* 27.09.2026: eticheta se ferește de ce se poate apăsa (vezi fereste()); întrebările strânse devin etichete.
       28.09.2026: forma strânsă (.mini) nu mai e un punct fără nume: arată textul scurt .s („Ana-Maria P.”, iar din 30.09 și „Ieși”),
       32 px înălțime; textul lung .t rămâne în pagină pentru cititoarele de ecran. .mini.st = strânsă, dar în stânga. */
    '#lhp{transition:opacity .2s}#lhp.ferit{opacity:0;pointer-events:none}#lhp.mini{left:auto;right:8px}#lhp.mini.st{left:12px;right:auto}' +
    '#lhp .pill .s{display:none}#lhp.mini .pill{height:32px;padding:0 10px;gap:5px}' +
    '#lhp.mini .pill .s{display:inline;white-space:nowrap}#lhp.mini .pill .s b{display:inline-block;max-width:8.5em;overflow:hidden;text-overflow:ellipsis;vertical-align:bottom}' +
    '#lhp.mini .pill .t{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}' +
    '#lhp .pill.cere{border-color:#5b8cff;background:#1d2a4a}#lhp .pill.cere .dot{background:#5b8cff}' +
    /* 30.09.2026: codul se tastează ascuns (colegul de alături nu-l vede); „Ieși” e roșu, nu se confundă */
    '#lhp input.cod{-webkit-text-security:disc;letter-spacing:.35em;font-size:18px;max-width:9em}' +
    '#lhp button.iesi{background:#b3392f;border-color:#b3392f}#lhp .bun{color:#86efac;font-size:13px;margin-top:6px}' +
    '#lhp .pill.nimeni .dot{background:#9aa7c2}' +
    /* 30.09.2026 noaptea: „Ieși” pe etichetă, cu aspect de buton (aceeași culoare ca „Ieși (deconectare)” din meniu) */
    '#lhp .pill .bt{background:#b3392f;color:#fff;border-radius:999px;padding:2px 9px;font-weight:600;white-space:nowrap;line-height:1.35}' +
    '@media print{#lhp{display:none}}';
  var box;
  /* strangibil = întrebare nechemată de elev (sau meniul etichetei): la primul lui gest în pagină se strânge */
  function arata(html, strangibil) {
    if (!box) {
      var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
      box = document.createElement('div'); box.id = 'lhp'; box.setAttribute('role', 'region'); box.setAttribute('aria-label', 'Evidența activității');
      document.body.appendChild(box);
      try { new MutationObserver(planFereste).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style', 'hidden', 'open'] }); } catch (e) {}
    }
    seStrange = !!strangibil;
    box.className = ''; dimPill = null;
    box.innerHTML = html;
    rezerva();
    fereste();
  }

  /* ---------------- să nu stea peste lecție (27.09.2026) ----------------
     Trei judecători pe lecțiile noi din /lectii/: pe telefon (390 px) întrebarea „Spune cine ești” avea 227 px și
     acoperea partea de jos a simulatorului și „Verifică” până răspundea elevul; eticheta mică acoperea uneori
     „Verifică”, iar un clic pe diapozitivul simulat a nimerit panoul.
     1. Întrebarea care apare singură (și lista „Cine lucrează acum?”, și meniul etichetei) se STRÂNGE la primul
        gest al elevului în pagină (apăsare, derulare, tastă) într-o etichetă „Spune cine ești”; o apăsare pe ea o
        redeschide. Nu se strâng: „Ești tot X?” (trebuie răspuns, altfel timpul rămâne deoparte) și formularele.
     2. Eticheta (orice .pill) nu stă NICIODATĂ peste ceva ce se poate apăsa: dacă sub ea e un buton, o
        legătură, un câmp, o celulă de simulator etc., se strânge la forma scurtă (tot în stânga, apoi în colțul
        din dreapta); dacă și acolo e ceva, dispare (și lasă clicurile să treacă) până se eliberează locul.
     3. (28.09.2026, judecătorul lecției VI/1, regula 20) Forma strânsă era un punct rotund FĂRĂ nume: pe telefon
        elevul nu găsea eticheta pe care lecția îi cere s-o atingă ca să schimbe elevul. Acum orice formă a
        etichetei are nume vizibil (textul scurt .s, ex. „Ana-Maria P. · Schimbă”) și cel puțin 32x32 px de atins. */
  var seStrange = false, strans = false, dimPill = null, rafF = 0, MINI = 32;
  function gest(e) {
    if (!seStrange || !box) return;
    if (e.type === 'keydown' && /^(Tab|Shift|Control|Alt|Meta|CapsLock)$/.test(e.key)) return;
    var t = e.target;
    if (t && t.nodeType === 1 && box.contains(t) && (e.type !== 'pointerdown' || t.closest('button,a,input,select,textarea,label,.lista'))) return;
    strans = true; randeaza();
  }
  ['pointerdown', 'wheel', 'touchmove', 'keydown'].forEach(function (ev) { addEventListener(ev, gest, { passive: true, capture: true }); });

  var TAG_I = /^(A|BUTTON|INPUT|SELECT|TEXTAREA|LABEL|SUMMARY|OPTION|CANVAS|VIDEO|AUDIO|IFRAME|EMBED|OBJECT)$/,
    ROL_I = /^(button|link|checkbox|radio|tab|slider|textbox|gridcell|option|menuitem|switch|combobox|spinbutton|application|grid|listbox|treeitem)$/;
  function interactiv(e) {
    for (var n = 0; e && e.nodeType === 1 && e !== document.body && e !== document.documentElement && n < 25; e = e.parentElement, n++) {
      if (TAG_I.test(e.tagName.toUpperCase()) || e.isContentEditable || e.hasAttribute('onclick') || ROL_I.test(e.getAttribute('role') || '') ||
        (e.getAttribute('tabindex') !== null && e.tabIndex >= 0) || e.getAttribute('draggable') === 'true') return true;
      var cs = getComputedStyle(e), c = cs.cursor;
      if (c && c !== 'auto' && c !== 'default') return true;
      // o bandă care se derulează în lateral (foaia de calcul pe telefon): degetul trebuie să ajungă la ea
      if ((cs.overflowX === 'auto' || cs.overflowX === 'scroll') && e.scrollWidth > e.clientWidth + 1) return true;
      // celulele unui tabel-simulator (în care sunt butoane sau câmpuri) sunt și ele de apăsat
      var tg = e.tagName.toUpperCase();
      if ((tg === 'TD' || tg === 'TH') && e.closest('table') && e.closest('table').querySelector('button,input,select,textarea,[contenteditable]')) return true;
    }
    return false;
  }
  // e ceva de apăsat în dreptunghiul ăsta (cu 6 px de jur împrejur, cât un deget)?
  function ocupat(l, t, r, b) {
    /* puncte la cel mult ~28 px pe orizontală și ~9 px pe verticală (28.09.2026: cu 3 rânduri, o legătură de 17 px, ca
       „Wikimedia Commons” din lecția V/5, încăpea între ele și eticheta strânsă, acum lată cât numele, stătea peste ea) */
    var W = document.documentElement.clientWidth, H = innerHeight, xs = [], ys = [], memo = new Map();
    for (var nx = Math.max(5, Math.ceil((r - l + 12) / 28) + 1), ix = 0; ix < nx; ix++) xs.push(l - 6 + (r - l + 12) * ix / (nx - 1));
    for (var ny = Math.max(3, Math.ceil((b - t + 10) / 9) + 1), iy = 0; iy < ny; iy++) ys.push(t - 6 + (b - t + 10) * iy / (ny - 1));
    for (var i = 0; i < xs.length; i++) for (var j = 0; j < ys.length; j++) {
      var lst = document.elementsFromPoint(Math.min(W - 1, Math.max(0, xs[i])), Math.min(H - 1, Math.max(0, ys[j])));
      for (var k = 0; k < lst.length; k++) if (!box.contains(lst[k])) {
        var v = memo.get(lst[k]); if (v === undefined) { v = interactiv(lst[k]); memo.set(lst[k], v); }
        if (v) return true;
        break;
      }
    }
    return false;
  }
  function planFereste() { if (!rafF) rafF = requestAnimationFrame(fereste); }
  function fereste() {
    rafF = 0;
    var el = box && box.firstElementChild;
    if (!el || !el.classList.contains('pill')) { if (box && box.className) box.className = ''; return; }
    if (!dimPill) {   // mărimea formei pline și a celei strânse (cu nume), măsurate o dată pe etichetă
      var c0 = box.className;
      box.className = ''; var q = el.getBoundingClientRect();
      box.className = 'mini'; var m = el.getBoundingClientRect();
      box.className = c0;
      dimPill = { w: q.width, h: q.height, mw: Math.max(MINI, m.width), mh: Math.max(MINI, m.height) };
    }
    var W = document.documentElement.clientWidth, B = box.getBoundingClientRect().bottom, d = dimPill;
    // plină în stânga -> strânsă în stânga -> strânsă în dreapta -> ascunsă (niciodată peste ceva de apăsat)
    var mod = !ocupat(12, B - d.h, 12 + d.w, B) ? '' : !ocupat(12, B - d.mh, 12 + d.mw, B) ? 'mini st'
      : !ocupat(W - 8 - d.mw, B - d.mh, W - 8, B) ? 'mini' : 'mini ferit';
    if (box.className !== mod) box.className = mod;
  }
  addEventListener('scroll', planFereste, { passive: true, capture: true });
  addEventListener('resize', function () { dimPill = null; planFereste(); });
  addEventListener('load', planFereste);
  setInterval(function () { if (box && document.visibilityState === 'visible') planFereste(); }, 1000);
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
      arata('<span class="pill" id="lhp-elev" style="opacity:.75" title="Ești elev? Înscrie-te ca profesorul să-ți vadă munca."><span class="dot" style="background:#9aa7c2"></span><span class="t">Sunt elev — mă înscriu</span><span class="s" aria-hidden="true">Mă înscriu</span></span>');
      $('lhp-elev').onclick = formular;
      return;
    }
    if (s === 'activ') {
      /* 30.09.2026 noaptea (MINOR 1 al porții): amândoi începătorii au ezitat — eticheta nu arăta a buton și nu scria „Ieși”.
         Acum are, și plină, și strânsă, un „Ieși” roșu, ca butonul din meniu. Drumul rămâne: apăsarea pe etichetă -> meniul. */
      arata('<span class="pill" id="lhp-pill" title="Profesorul vede ce pagini deschizi, cât timp lucrezi și ce niveluri termini. Apasă ca să ieși (deconectare) sau ca să-ți vezi jurnalul."><span class="dot"></span><span class="t">Profesorul vede activitatea ta · <b>' + esc(scurt(eu.nume)) + '</b></span>' +
        '<span class="s" aria-hidden="true"><b>' + esc(scurt(eu.nume)) + '</b></span><span class="bt">Ieși</span></span>');
      $('lhp-pill').onclick = meniu;
    } else if (s === 'intreaba') {
      arata('<div class="bar">Ești tot <b>' + esc(eu.nume) + '</b> (' + esc(eu.clasa) + ')?<div class="mic">Ce lucrezi acum se păstrează: ajunge la profesor pe numele tău după ce apeși „Da”.</div>' +
        '<div class="row"><button id="lhp-da">Da, sunt eu</button><button class="g" id="lhp-nu">Nu, sunt alt elev</button></div></div>');
      $('lhp-da').onclick = function () {
        if (sincron()) return;   // altă filă a schimbat între timp elevul: întrebarea de pe ecran nu mai e valabilă
        var t = tinutDeoparte();                         // nivelurile vechi pleacă întâi la „neînscris”
        if (!t) { confirmaEu(true); return; }            // nimic recent de întrebat: doar confirmarea
        var min = Math.max(1, Math.round(t.sec / 60)), ce = t.ce.slice(0, 3).map(esc).join(', ');
        arata('<div class="bar">Cât stătea întrebarea, pe calculatorul ăsta s-a lucrat: <b>' + (ce || (t.niveluri + (t.niveluri === 1 ? ' nivel' : ' niveluri'))) + '</b>' +
          (t.sec ? ' (' + min + ' min)' : '') + '.<div class="mic"><b>Ai lucrat TU asta, acum?</b> Dacă nu, rămâne pentru elevul care a lucrat, nu intră pe numele tău.</div>' +
          '<div class="row"><button id="lhp-da2">Da, eu am lucrat</button><button class="g" id="lhp-nu2">Nu, a lucrat altcineva</button></div></div>');
        $('lhp-da2').onclick = function () { if (sincron()) return; confirmaEu(true); };
        $('lhp-nu2').onclick = function () { if (sincron()) return; confirmaEu(false); };
      };
      $('lhp-nu').onclick = function () { if (sincron()) return; sterge(K_TINUT); uita(); alege(); };
    } else if (iesit()) {
      /* după „Ieși” (30.09.2026, R3): nu e nimeni conectat și eticheta o spune; „Intră” duce la listă, unde se cere codul.
         Mesajul întreg („Ai ieșit, X…”) stă doar pe pagina pe care s-a apăsat „Ieși”; se strânge la primul gest. */
      if (mesajIesit && !strans) {
        arata('<div class="bar" role="status"><span id="lhp-iesit">' + mesajIesit + '</span>' +
          '<div class="row"><button id="lhp-intra2">Intră</button><button class="g" id="lhp-bine">Bine</button></div></div>', true);
        $('lhp-intra2').onclick = function () { mesajIesit = ''; strans = false; alege(); };
        $('lhp-bine').onclick = function () { mesajIesit = ''; randeaza(); };
      } else {
        arata('<span class="pill cere nimeni" id="lhp-nimeni" title="Nu e nimeni conectat pe calculatorul ăsta. Apasă ca să intri pe numele tău, cu codul tău.">' +
          '<span class="dot"></span><span class="t">Nu e nimeni conectat · <b>Intră</b></span><span class="s" aria-hidden="true">Nimeni conectat · <b>Intră</b></span></span>');
        $('lhp-nimeni').onclick = function () { mesajIesit = ''; strans = false; alege(); };
      }
    } else if (strans) {   // întrebarea strânsă la primul gest: o etichetă care duce la înscriere
      /* fără listă, eticheta ține locul butonului „Spune cine ești” (același id) și deschide direct formularul */
      var cuLista = lista().length > 0, idP = cuLista ? 'lhp-cere' : 'lhp-cine';
      arata('<span class="pill cere" id="' + idP + '" title="Profesorul vede ce lecții deschizi, cât lucrezi și ce niveluri termini — doar după ce spui cine ești."><span class="dot"></span><span class="t">' +
        (cuLista ? 'Cine lucrează acum? <b>Alege-te din listă</b>' : '<b>Spune cine ești</b> · pentru ora de informatică') + '</span>' +
        '<span class="s" aria-hidden="true"><b>' + (cuLista ? 'Alege-te din listă' : 'Spune cine ești') + '</b></span></span>');
      $(idP).onclick = cuLista ? function () { strans = false; alege(); } : formular;
    } else if (lista().length) {
      alege();
    } else {
      arata('<div class="bar">Lucrezi pentru ora de informatică? <b>Spune cine ești</b>: profesorul vede ce lecții deschizi, cât lucrezi și ce niveluri termini.' + NOTA + NOTA_NOTA +
        '<div class="row"><button id="lhp-cine">Spune cine ești</button><button class="g" id="lhp-viz">Nu, doar vizitez</button></div></div>', true);
      $('lhp-cine').onclick = formular;
      $('lhp-viz').onclick = function () { eu = { refuz: Date.now() }; scrie(K_ID, eu); randeaza(); };
    }
  }

  /* Ca să nu se sperie (25.09.2026, el: „să le spunem că monitorizăm doar activitatea de pe siturile mele,
     nu activitatea lui în general - să nu creăm panică”). Apare la întrebare, în formular și în meniu. */
  var NOTA = '<div class="mic">🔒 Se vede <b>doar</b> ce faci pe LearningHub (lecțiile și jocurile profesorului). ' +
    'Nu se vede nimic din alte site-uri, aplicații, mesaje, poze sau fișiere de pe calculator ori telefon.</div>';
  /* Ce înseamnă pentru notă (07.10.2026, decizia profesorului: nota lucrării de modul = 80% lucrarea + 20% munca pe
     LearningHub; SISTEM_EVALUARE §4.5, tools\nota_site.py din AI_0). Elevul o află înainte să aleagă „Nu, doar vizitez”,
     împreună cu calea fără urmărire. Scurt: bara de pe telefon nu trebuie să crească mult. */
  var NOTA_NOTA = '<div class="mic" id="lhp-nota-nota">📝 Ce termini aici poate aduce <b>până la 2 puncte</b> la nota lucrării de modul, ' +
    'de la ora la care profesorul anunță regula (fișa de criterii). Fără înscriere, faci aceeași muncă la oră, la calculatorul școlii, sau pe foaie.</div>';

  function meniu() {
    /* „Ieși (deconectare)” sus, la o apăsare pe etichetă (30.09.2026, R3): nu mai e ascuns după „Nu ești tu?” */
    arata('<div class="bar">Ești înscris ca <b>' + esc(eu.nume) + '</b> · ' + esc(eu.clasa) + ' · ' + esc(eu.scoalaNume || eu.scoala) + '.' +
      '<div class="row"><button class="iesi" id="lhp-iesi">Ieși (deconectare)</button><button class="g" id="lhp-x">Închide</button></div>' +
      '<div class="mic">Pleci de la calculator? Apasă „Ieși”. După aceea, pe numele tău se intră doar cu codul tău.</div>' +
      '<div class="mic">Profesorul vede: paginile deschise, minutele lucrate (doar când lucrezi, nu cu fila uitată deschisă) și nivelurile terminate. Numele pleacă criptat.</div>' + NOTA + NOTA_NOTA +
      (eu.h ? '<div class="mic">☁ Progresul tău se păstrează online: pe alt calculator sau pe telefon te înscrii cu același nume și același cod și continui de unde ai rămas.</div>'
        : '<div class="mic"><b>Progresul tău stă doar pe calculatorul ăsta.</b> Alege un cod ca să-l poți continua și pe alt calculator sau acasă.</div>') +
      '<div class="row"><a href="' + JURNAL_URL + '"><button>Jurnalul meu</button></a>' + (eu.h ? '' : '<button id="lhp-cod">Păstrează-l online</button>') +
      '<button class="g" id="lhp-alt">Nu ești tu? Schimbă elevul</button></div>' +
      '<div class="row"><button class="g" id="lhp-corect">Mi-am scris greșit numele, clasa sau școala</button></div>' +
      '<div class="row"><button class="g" id="lhp-scoate" title="Progresul tău nu se șterge; doar numele tău nu mai apare în lista calculatorului.">Scoate-mă din lista calculatorului</button></div></div>', true);
    $('lhp-iesi').onclick = function () { if (sincron()) return; iesi(); };
    $('lhp-alt').onclick = function () { if (sincron()) return; if (eElev()) Nor.impinge(true); uita(); alege(); };
    $('lhp-x').onclick = randeaza;
    if ($('lhp-cod')) $('lhp-cod').onclick = cereCod;
    $('lhp-corect').onclick = function () { if (sincron()) return; corecteaza(); };
    $('lhp-scoate').onclick = function () {
      if (sincron()) return;
      /* codul rămâne legat de sertarul lui (lh_coduri): fără listă, pe numele lui tot nu se intră fără cod (R2) */
      var k = cheieElev(eu); if (eu.h) tineCod(k, eu.h, eu.id);
      scrie(K_LISTA, lista().filter(function (x) { return x.k !== k; }));
      iesi();
    };
  }

  /* ---------------- CORECTURA (02.10.2026) ----------------
     El: „dacă un elev și-a scris greșit numele ar trebui să-l poată rezolva după ce i se cere pinul”. Contract:
     AI_0\projects\teste-elevi\contracte\2026-10-02_alta_scoala_corectura. Codul intră în amprenta progresului împreună cu
     școala, clasa și numele, deci corectura MUTĂ progresul: serverul unește ce e sub amprenta veche în cea nouă
     (progres.mjs „redenumeste”, aceeași unire ca la „Deblochează”) și o marchează pe cea veche (pe numele greșit nu se mai
     intră). Id-ul rămâne același, deci și minutele de la profesor trec la numele corect. Fără cod nu se schimbă nimic:
     elevul fără cod și-l alege întâi. Codul greșit se numără la pauza de după 5 greșeli, ca la intrare. */
  function corecteaza() {
    if (!eu.h) {
      arata('<div class="bar"><b>Întâi alege-ți un cod</b><div class="mic">Ca să-ți poți corecta numele, ai nevoie de un cod de 4 cifre. Alege-l acum, scrie-l în caiet, apoi apasă din nou „Mi-am scris greșit…”.</div>' +
        '<div class="row"><button id="lhp-ok">Aleg codul</button><button class="g" id="lhp-x">Înapoi</button></div></div>');
      $('lhp-ok').onclick = cereCod; $('lhp-x').onclick = meniu;
      return;
    }
    arata('<div class="bar"><b>Corectează ce ai scris greșit</b> · ' + esc(eu.nume) + ' (' + esc(eu.clasa) + ')' +
      '<div class="mic">Întâi scrie codul tău de 4 cifre, ca să știm că ești tu.</div>' +
      '<label for="lhp-pc">Codul tău (4 cifre)</label><input id="lhp-pc"' + CAMP_COD + '>' +
      '<div class="err" id="lhp-e" aria-live="polite"></div><div class="row"><button id="lhp-ok">Mai departe</button><button class="g" id="lhp-x">Înapoi</button></div></div>');
    $('lhp-x').onclick = meniu;
    var btn = $('lhp-ok'), err = $('lhp-e');
    $('lhp-pc').addEventListener('keydown', function (e) { if (e.key === 'Enter') btn.click(); });
    if (pauza()) asteaptaPauza(btn, err, 'Mai departe');
    btn.onclick = async function () {
      var cod = $('lhp-pc').value.trim();
      if (!/^\d{4}$/.test(cod)) { err.textContent = 'Codul are exact 4 cifre.'; return; }
      if (pauza()) { asteaptaPauza(btn, err, 'Mai departe'); return; }
      btn.disabled = true;
      var h = await amprenta(eu, cod);
      if (sincron() || !btn.isConnected) return;
      if (h !== eu.h) {
        var ramase = gresit(); btn.disabled = false;
        err.textContent = mesajCod({ motiv: 'gresit' }, ramase);
        if (ramase === 0) asteaptaPauza(btn, err, 'Mai departe');
        return;
      }
      sterge(K_GRESIT);
      formular({ cod: cod });
    };
  }
  async function salveazaCorectura(nou, cod, btn) {
    var err = $('lhp-e'), kVechi = cheieElev(eu), kNou = cheieElev(nou);
    if (kNou === kVechi && (nou.scoalaText || '') === (eu.scoalaText || '')) { err.textContent = 'N-ai schimbat nimic. Corectează școala, clasa sau numele, apoi apasă „Salvează”.'; return; }
    btn.disabled = true; err.textContent = 'Îți mut progresul…';
    try {
      var hNou = await amprenta(nou, cod);
      /* numele corect e deja pe calculatorul ăsta, cu alt cod sau cu progres fără cod: nu-l unim (R2 / GRAV-1 - altfel
         oricine și-ar „corecta” numele în al unui coleg ca să-i ia progresul de pe calculator) */
      var pc = kNou === kVechi ? null : peCalculator(kNou);
      if (pc && pc.h !== hNou) {
        btn.disabled = false;
        err.textContent = 'Pe calculatorul ăsta e deja ' + nou.nume + (pc.h ? ', cu alt cod' : '') + '. Intră pe numele acela din listă, cu codul lui, sau spune-i profesorului.';
        return;
      }
      await Nor.impinge(true);   // ce s-a lucrat aici ajunge întâi sub amprenta veche; serverul le mută pe toate
      var u = await Nor.url(), ctl = window.AbortController ? new AbortController() : null, t0 = ctl ? setTimeout(function () { ctl.abort(); }, 10000) : 0;
      var j = await fetch(u, { method: 'POST', body: JSON.stringify({ op: 'redenumeste', h: eu.h, la: hNou, id: eu.id }), signal: ctl ? ctl.signal : undefined })
        .then(function (r) { return r.json().catch(function () { return null; }); }, function () { return null; });
      clearTimeout(t0);
      if (sincron() || !btn.isConnected) return;
      if (!j || !j.ok) {
        btn.disabled = false;
        err.textContent = j && j.motiv === 'mutat' ? 'Codul tău nu mai e bun aici. Ieși și intră din nou, apoi încearcă iar.'
          : j && j.motiv === 'alt-cod' ? 'Pe numele ' + nou.nume + ' se intră acum cu alt cod (ales după o deblocare). Intră cu codul acela.'
          : 'Nu am putut salva acum (verifică internetul). Nu s-a schimbat nimic; încearcă din nou.';
        return;
      }
      nou.id = eu.id; nou.h = hNou; nou.numeEnc = await cripteaza(nou.nume); nou.ultima = Date.now();
      // pe calculator: sertarul trece pe numele corect; numele greșit iese din listă și din coduri
      var s = citeste(K_SERTARE, null) || {}, has = function (k) { return Object.prototype.hasOwnProperty.call(s, k); };
      if (kNou !== kVechi) {
        if (!has(kNou) && has(kVechi)) s[kNou] = s[kVechi];
        delete s[kVechi]; scrie(K_SERTARE, s);
        var c = coduri(); delete c[kVechi]; scrie(K_CODURI, c);
      }
      scrie(K_LISTA, lista().filter(function (x) { return x.k !== kVechi; }));
      eu = nou; scrie(K_ID, eu); inregistreaza();
      var schimbat = puneSertar();
      var venit = await Nor.trage();
      Nor.impinge(true);
      adaugaInCoada(0, true); trimite(false);   // la profesor, aceeași înregistrare (același id), cu numele corect
      arata('<div class="bar" role="status"><b>Gata, ' + esc(eu.nume) + '!</b> Acum ești la ' + esc(eu.clasa) + ' · ' + esc(eu.scoalaNume || eu.scoala) +
        '. Progresul tău a venit cu tine. Data viitoare intri cu numele ăsta și cu același cod.<div class="row"><button id="lhp-bine2">Bine</button></div></div>');
      $('lhp-bine2').onclick = function () { if (schimbat || venit) reincarcaDacaTrebuie(true, true); else randeaza(); };
      try { dispatchEvent(new CustomEvent('prezenta', { detail: identitate() })); } catch (e) {}
    } catch (e) { btn.disabled = false; if (err) err.textContent = 'Nu a mers. Încearcă din nou.'; }
  }

  /* ---------------- IEȘIREA (30.09.2026, R3) ----------------
     El: „fă să fie deconectarea clară”. „Ieși (deconectare)” trimite ce s-a adunat (minutele, progresul online),
     scoate elevul de pe calculator (uita(): lista rămâne, I2) și lasă un semn (lh_prezenta_iesit) cât nu intră nimeni:
     eticheta spune „Nu e nimeni conectat · Intră”, pe orice pagină și în orice filă. Pe pagina asta apare întâi mesajul. */
  var K_IESIT = 'lh_prezenta_iesit', mesajIesit = '';
  function iesit() { return !!citeste(K_IESIT, null); }
  function iesi(mesaj) {
    var nume = eElev() ? eu.nume : '';
    if (eElev()) Nor.impinge(true);   // corpul cererii se face acum, pe amprenta lui; pleacă după
    // semnul ÎNAINTE de uita(): celelalte file află de ieșire prin „storage” (lh_prezenta), și atunci semnul trebuie să fie deja scris
    scrie(K_IESIT, { t: Date.now() });   // fără nume: semnul spune doar că nu e nimeni conectat
    uita();
    mesajIesit = mesaj || ('Ai ieșit' + (nume ? ', <b>' + esc(nume) + '</b>' : '') + '. Data viitoare îți cer codul.');
    randeaza();
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
    if (eu.h) tineCod(k, eu.h, eu.id);
    // cei care ies din listă (peste 80) își păstrează codul: pe sertarul lor tot nu se intră fără el (R2)
    l.slice(80).forEach(function (x) { if (x.h) tineCod(x.k, x.h, x.id); });
    scrie(K_LISTA, l.slice(0, 80));
  }
  function alege() {
    var l = lista().sort(function (a, b) { return (b.ultima || 0) - (a.ultima || 0); });
    if (!l.length) { formular(); return; }
    arata('<div class="bar"><b>Cine lucrează acum?</b><div class="mic">Apasă pe numele tău, scrie-ți codul și continui de unde ai rămas. Progresul fiecăruia se păstrează.</div>' +
      '<div class="lista" id="lhp-lista">' + l.map(function (x, i) {
        return '<button class="el" data-i="' + i + '"><b>' + esc(x.nume) + '</b><span>' + esc(x.clasa) + (x.h ? ' · ☁' : '') + '</span></button>';
      }).join('') + '</div>' +
      '<div class="row"><button id="lhp-nou">Nu sunt în listă</button><button class="g" id="lhp-x">Mai târziu</button></div>' +
      '<div class="mic">„Nu sunt în listă” = prima dată pe calculatorul ăsta. Dacă ai lucrat pe alt calculator sau acasă, scrie același nume și același cod și îți vine progresul.</div></div>', true);
    Array.prototype.forEach.call(box.querySelectorAll('.el'), function (b) { b.onclick = function () { eSunt(l[+b.dataset.i]); }; });
    $('lhp-nou').onclick = formular;
    $('lhp-x').onclick = function () { eu = eu && eu.refuz ? eu : null; if (!eu) { eu = { refuz: Date.now() }; scrie(K_ID, eu); } randeaza(); };
  }
  /* ---------------- CODUL LA INTRARE (30.09.2026, R1, R2, R8, R9) ----------------
     El: „la conectarea pe learning hub cu pinul pe care îl selectează elevii - fă să li se ceară acel pin dacă se
     deconectează”. Până acum un clic pe nume în „Cine lucrează acum?” intra FĂRĂ cod, iar formularul cu același nume și
     ORICE cod lua sertarul celuilalt. Acum:
      - pe numele din listă se intră cu codul lui: amprenta(elev, cod) === amprenta ținută pe calculator (x.h din listă
        sau lh_coduri, care rămâne și după „Scoate-mă din listă” ori după ce lista trece de 80). Codul nu se ține nicăieri;
      - elevii de dinainte de coduri (fără amprentă) își aleg un cod la prima intrare, apoi li se cere mereu;
      - formularul cu un nume deja de pe calculator (listă, lh_coduri, sertar) cere același cod (formular()); un sertar
        rămas fără amprentă de la versiunea de dinainte cere dovada serverului: progres online sub codul scris, salvat
        ÎNAINTE de lansarea codurilor, după ceasul serverului (verificaCod, GRAV-1 + GRAV-2);
      - alt cod decât cel de pe calculator intră doar dacă profesorul l-a deblocat („Mi-am uitat codul”, uitat()), iar
        codul vechi al unui elev deblocat nu mai intră (serverul spune mutat); fără internet se judecă doar pe calculator;
      - 5 coduri greșite la rând (în listă sau în formular, pe orice nume) = 30 de secunde în care butonul așteaptă.
     Limite spuse cinstit (vezi PREDARE.md): cine are acces la instrumentele browserului poate scrie orice în
     localStorage; elevul fără cod e „revendicat” de primul care îi alege unul; „Ești tot X?” rămâne Da/Nu (decizia lui). */
  var K_CODURI = 'lh_coduri', K_GRESIT = 'lh_cod_gresit', GRESITE_MAX = 5, PAUZA_MS = 30000;
  function coduri() { var c = citeste(K_CODURI, null); return c && typeof c === 'object' && !Array.isArray(c) ? c : {}; }
  function tineCod(k, h, id) { if (!k || !h) return; var c = coduri(); c[k] = { h: h, id: id || (c[k] && c[k].id) || null }; scrie(K_CODURI, c); }
  // ce știe calculatorul despre elevul k (listă, lh_coduri, sertare); null = nimic, deci e un elev nou aici
  function peCalculator(k) {
    var x = lista().filter(function (y) { return y.k === k; })[0] || null, c = coduri()[k] || null, t = citeste(K_SERTARE, null) || {};
    if (!x && !c && !Object.prototype.hasOwnProperty.call(t, k)) return null;
    return { x: x, h: (x && x.h) || (c && c.h) || null, id: (x && x.id) || (c && c.id) || null };
  }
  function pauza() { var g = citeste(K_GRESIT, null) || {}; return g.pana && g.pana > Date.now() ? g.pana - Date.now() : 0; }
  function gresit() {   // încă un cod greșit; întoarce câte mai sunt până la pauză (0 = pauza a început)
    var g = citeste(K_GRESIT, null) || {};
    if (g.pana) g = {};
    g.n = (g.n || 0) + 1;
    if (g.n >= GRESITE_MAX) g = { pana: Date.now() + PAUZA_MS };
    scrie(K_GRESIT, g);
    return g.pana ? 0 : GRESITE_MAX - g.n;
  }
  function secunde(n) { return n >= 20 ? n + ' de secunde' : n === 1 ? 'o secundă' : n + ' secunde'; }
  function asteaptaPauza(btn, err, text) {   // butonul așteaptă cât ține pauza, cu secundele rămase
    (function tick() {
      if (!btn.isConnected) return;
      var p = pauza();
      if (!p) { btn.disabled = false; btn.textContent = text; err.textContent = ''; return; }
      var s = Math.ceil(p / 1000);
      btn.disabled = true; btn.textContent = 'Așteaptă ' + s + ' s';
      err.textContent = 'Ai greșit codul de 5 ori la rând. Mai încearcă peste ' + secunde(s) + '.';
      setTimeout(tick, 1000);
    })();
  }
  function mesajCod(r, ramase) {
    if (r.motiv === 'mutat') return 'Codul ăsta nu mai e bun: profesorul te-a deblocat cu un cod nou. Intră cu codul nou.';
    if (r.motiv === 'corectat') return 'Pe datele astea nu se mai intră: au fost corectate (numele, clasa sau școala). Intră cu datele corecte și cu același cod.';
    if (r.motiv === 'asteptare') return 'Profesorul nu te-a deblocat încă. Intri cu codul nou după ce te deblochează.';
    if (r.motiv === 'respins') return 'Profesorul a respins cererea pentru codul ăsta.';
    if (r.motiv === 'offline') return 'Nu pot verifica acum codul: nu merge internetul. Încearcă din nou peste puțin timp.';
    return 'Cod greșit.' + (ramase === 1 ? ' Mai ai o încercare, apoi urmează o pauză de 30 de secunde.'
      : ramase === 2 ? ' Mai ai două încercări, apoi urmează o pauză de 30 de secunde.' : ramase > 0 ? ' Mai încearcă.' : '');
  }
  /* {cerere, mutat, inainte?} pentru amprenta h, de la /api/progres; null fără internet, de la un server vechi (care nu
     știe „stare”) sau la un răspuns care nu e al lui „stare” (un portal Wi-Fi, un {ok:true} gol): mutat e mereu true/false */
  function stareServer(h) {
    return Nor.url().then(function (u) {
      var ctl = window.AbortController ? new AbortController() : null, t = ctl ? setTimeout(function () { ctl.abort(); }, 6000) : 0;
      return fetch(u, { method: 'POST', body: JSON.stringify({ op: 'stare', h: h }), signal: ctl ? ctl.signal : undefined })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) { clearTimeout(t); return j && j.ok && typeof j.mutat === 'boolean' ? j : null; }, function () { clearTimeout(t); return null; });
    }).catch(function () { return null; });
  }
  /* codul scris pentru elevul e (școală, clasă, nume): {ok:true, h} sau {ok:false, motiv}. hStiut = amprenta ținută pe
     calculator pentru el; null = elev de dinainte de coduri, iar codul ales acum devine al lui (întrebarea 1 din contract).
     sertarVechi = pe calculator e deja un sertar pe numele ăsta, dar fără nicio amprentă ținută (vezi mai jos, GRAV-1). */
  async function verificaCod(e, cod, hStiut, sertarVechi) {
    var h = await amprenta(e, cod);
    if (!hStiut) {   // elev nou aici (sau fără cod): intră, afară de codul VECHI al unui elev deblocat între timp (R9)
      var s1 = await stareServer(h);
      if (s1 && s1.mutat) return { ok: false, motiv: s1.corectat ? 'corectat' : 'mutat' };
      if (!sertarVechi) return { ok: true, h: h, nou: true };
      /* GRAV-1 (poarta de lansare, 30.09.2026 seara). Versiunea de dinainte (28.09) scotea elevul din listă („Scoate-mă din
         lista calculatorului”, sau lista trecea de 80) FĂRĂ să-i țină amprenta: pe calculator îi rămâne doar sertarul
         (lh_sertare). Pe sertarul ăsta nu se mai intră cu primul cod scris, ci doar dacă e dovedit că e al lui:
          - elevul cu cod și-a urcat progresul online sub amprenta lui, deci codul BUN găsește progres acolo; un cod
            oarecare nu găsește nimic;
          - sau profesorul a deblocat codul ăsta („Mi-am uitat codul” -> „Deblochează”): așa intră și elevul fără cod
            de dinainte (25.09) sau cel care nu și-a urcat niciodată progresul.
         Altfel: refuzat, ca la un cod greșit (se numără la cele 5), cu trimitere la „Mi-am uitat codul”.
         GRAV-2 (a doua poartă, 30.09.2026 noaptea): „orice progres online sub codul scris” NU mai e dovadă. Un coleg și-l face
         singur: se înscrie pe telefonul lui cu numele celuilalt și un cod ales de el, deschide o pagină, iar progresul urcă.
         Dovadă e doar progresul salvat prima dată ÎNAINTE de lansarea codurilor. Judecă serverul, pe ceasul LUI (câmpul
         `inainte` din „stare”; ceasul telefonului nu contează). Fără răspuns bun de la server, nu se poate dovedi nimic acum
         (nu se numără ca greșeală). */
      if (s1 && s1.cerere === 'deblocat') return { ok: true, h: h, deblocat: true };
      if (!s1) return { ok: false, motiv: 'offline' };
      if (s1.inainte === true) return { ok: true, h: h };
      return { ok: false, motiv: s1.cerere === 'asteptare' || s1.cerere === 'respins' ? s1.cerere : 'sertar' };
    }
    if (h === hStiut) {
      var s0 = await stareServer(h);   // codul VECHI al unui elev deblocat între timp în altă parte nu mai intră (R9)
      return s0 && s0.mutat ? { ok: false, motiv: s0.corectat ? 'corectat' : 'mutat' } : { ok: true, h: h };
    }
    var s = await stareServer(h);      // alt cod: intră doar dacă profesorul l-a deblocat
    if (s && s.cerere === 'deblocat' && !s.mutat) return { ok: true, h: h, deblocat: true };
    return { ok: false, motiv: s && (s.cerere === 'asteptare' || s.cerere === 'respins') ? s.cerere : 'gresit' };
  }
  var CAMP_COD = ' class="cod" inputmode="numeric" maxlength="4" autocomplete="off"';
  /* apăsare pe un nume din listă: întâi codul (fereastra care cere codul); intra() abia după */
  function eSunt(x) {
    var pc = peCalculator(x.k), hStiut = x.h || (pc && pc.h) || null, nou = !hStiut;
    arata('<div class="bar"><b>Salut, ' + esc(x.nume) + '!</b> (' + esc(x.clasa) + ')' +
      (nou ? '<div class="mic">De acum, fiecare elev intră pe numele lui <b>cu un cod de 4 cifre</b>, ca nimeni altcineva să nu poată intra în locul lui. Alege-ți codul și scrie-l în caiet. Dacă ai mai lucrat cu un cod pe alt calculator sau pe telefon, pune codul de atunci.</div>'
        : '<div class="mic">Scrie codul tău de 4 cifre.</div>') +
      '<label for="lhp-pc">' + (nou ? 'Alege-ți codul (4 cifre)' : 'Codul tău (4 cifre)') + '</label><input id="lhp-pc"' + CAMP_COD + '>' +
      (nou ? '<label for="lhp-pc2">Scrie-l încă o dată</label><input id="lhp-pc2"' + CAMP_COD + '>' : '') +
      '<div class="err" id="lhp-e" aria-live="polite"></div><div class="row"><button id="lhp-intra">Intră</button><button class="g" id="lhp-inapoi">← Înapoi la listă</button></div>' +
      (nou ? '' : '<div class="row"><button class="g" id="lhp-uitat">Mi-am uitat codul</button></div>') + '</div>');
    var btn = $('lhp-intra'), err = $('lhp-e');
    $('lhp-inapoi').onclick = alege;
    if ($('lhp-uitat')) $('lhp-uitat').onclick = function () { uitat(x, hStiut, function () { eSunt(x); }); };
    ['lhp-pc', 'lhp-pc2'].forEach(function (id) { var i = $(id); if (i) i.addEventListener('keydown', function (e) { if (e.key === 'Enter') btn.click(); }); });
    if (pauza()) asteaptaPauza(btn, err, 'Intră');
    try { $('lhp-pc').focus({ preventScroll: true }); } catch (e) {}
    btn.onclick = async function () {
      if (pauza()) { asteaptaPauza(btn, err, 'Intră'); return; }
      var c = $('lhp-pc').value.trim();
      if (!/^\d{4}$/.test(c)) { err.textContent = 'Codul are exact 4 cifre.'; return; }
      if (nou && $('lhp-pc2').value.trim() !== c) { err.textContent = 'Cele două coduri nu sunt la fel. Scrie-l din nou.'; return; }
      btn.disabled = true; err.textContent = 'Verific codul…';
      var r = await verificaCod(x, c, hStiut);
      if (sincron() || !btn.isConnected) return;   // între timp a intrat altcineva (altă filă): caseta s-a redesenat
      if (r.ok) { sterge(K_GRESIT); intra(x, r.h); return; }
      var ramase = r.motiv === 'gresit' ? gresit() : -1;
      $('lhp-pc').value = '';
      btn.disabled = false; err.textContent = mesajCod(r, ramase);
      if (ramase === 0) asteaptaPauza(btn, err, 'Intră');
      try { $('lhp-pc').focus({ preventScroll: true }); } catch (e) {}
    };
  }
  /* „MI-AM UITAT CODUL” (30.09.2026, R8; el: „să le pot reseta eu codurile și să își primească progresul după ce îi deblochez
     eu dintr-un panou”; codul nou îl alege ELEVUL). Spre profesor pleacă doar amprenta nouă (ca la progresul online), numele
     criptat, școala, clasa, id-ul și, de pe calculatorul din listă, amprenta veche. Codul nu pleacă nicăieri. După
     „Deblochează” în panou, codul nou intră pe orice aparat: verificaCod() întreabă serverul. */
  function uitat(x, hVechi, inapoi) {
    arata('<div class="bar"><b>Mi-am uitat codul</b> · ' + esc(x.nume) + ' (' + esc(x.clasa) + ')' +
      '<div class="mic">Alege un cod NOU de 4 cifre și scrie-l în caiet. Cererea ajunge la profesor; după ce te deblochează, intri cu numele tău și cu codul nou și îți găsești tot progresul. Profesorul nu vede codul.</div>' +
      '<label for="lhp-n1">Codul nou (4 cifre)</label><input id="lhp-n1"' + CAMP_COD + '>' +
      '<label for="lhp-n2">Scrie-l încă o dată</label><input id="lhp-n2"' + CAMP_COD + '>' +
      '<div class="err" id="lhp-e" aria-live="polite"></div><div class="row"><button id="lhp-trimite">Trimite cererea</button><button class="g" id="lhp-inapoi">Înapoi</button></div></div>');
    var btn = $('lhp-trimite'), err = $('lhp-e');
    $('lhp-inapoi').onclick = inapoi;
    $('lhp-n2').addEventListener('keydown', function (e) { if (e.key === 'Enter') btn.click(); });
    try { $('lhp-n1').focus({ preventScroll: true }); } catch (e) {}
    btn.onclick = async function () {
      var c = $('lhp-n1').value.trim();
      if (!/^\d{4}$/.test(c)) { err.textContent = 'Codul nou are exact 4 cifre.'; return; }
      if ($('lhp-n2').value.trim() !== c) { err.textContent = 'Cele două coduri nu sunt la fel. Scrie-l din nou.'; return; }
      btn.disabled = true; err.textContent = 'Trimit cererea…';
      var j = null, st = 0;
      try {
        var corp = { op: 'cerere', h: await amprenta(x, c), numeEnc: x.numeEnc || await cripteaza(x.nume), scoala: x.scoala, clasa: x.clasa, id: x.id || idNou() };
        if (x.scoalaText) corp.scoalaText = x.scoalaText;
        if (hVechi) corp.hVechi = hVechi;
        var r = await fetch(await Nor.url(), { method: 'POST', body: JSON.stringify(corp) });
        st = r.status; j = await r.json().catch(function () { return null; });
      } catch (e) { j = null; }
      if (!btn.isConnected) return;
      if (st === 200 && j && j.ok) {
        arata('<div class="bar" role="status"><b>Cererea a ajuns la profesor.</b> După ce te deblochează, intri cu numele și codul nou.' +
          '<div class="row"><button id="lhp-am">Am înțeles</button></div></div>');
        $('lhp-am').onclick = function () { strans = false; alege(); };
        return;
      }
      btn.disabled = false;
      err.textContent = st === 429 && j && j.eroare ? j.eroare : 'Cererea nu a plecat. Verifică internetul și încearcă din nou.';
    };
  }
  /* codul e bun: elevul x intră pe calculator (fostul eSunt, neschimbat mai jos), cu amprenta h */
  function intra(x, h) {
    eu = { id: x.id || idNou(), scoala: x.scoala, scoalaNume: x.scoalaNume, clasa: x.clasa, nume: x.nume, numeEnc: x.numeEnc, ultima: Date.now() };
    if (x.scoalaText) eu.scoalaText = x.scoalaText;
    if (h) eu.h = h;   // după o deblocare, amprenta NOUĂ ia locul celei vechi în listă (inregistreaza): codul vechi nu mai intră
    scrie(K_ID, eu); sterge(K_IESIT); mesajIesit = ''; confirmat = true; ultimaMiscare = Date.now();
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
      var h = await amprenta(eu, c);
      if (sincron()) return;   // alt elev s-a înscris între timp în altă filă: codul nu e al lui
      eu.h = h; scrie(K_ID, eu); inregistreaza();
      var venit = await Nor.trage(); await Nor.impinge(true);
      if (venit) { reincarcaDacaTrebuie(true, true); return; }
      meniu();
    };
  }
  async function amprenta(e, cod) {
    var n = function (s) { return faraDiacritice(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); };
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
      for (i in nou.lv) { var p = lv[i], l = nou.lv[i]; lv[i] = p ? unesteNivel(p, l) : l; }   // unesteNivel: vezi „CE FACE ELEVUL PE NIVEL”
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
      sincron();
      if (!eElev() || !eu.h) return Promise.resolve(false);
      var hCerut = eu.h;
      return Nor.url().then(function (u) {
        return fetch(u, { method: 'POST', body: JSON.stringify({ op: 'citeste', h: hCerut }) }).then(function (r) { return r.ok ? r.json() : null; });
      }).then(function (j) {
        if (!j || !j.date) return false;
        /* 30.09.2026 (R9): profesorul a deblocat între timp un cod NOU al elevului (cerut de pe alt aparat): amprenta asta e
           mutată, deci codul vechi nu mai intră. Elevul iese; ce a lucrat aici rămâne în sertarul lui și urcă sub codul
           nou când intră cu el. Doar dacă e tot el pe calculator (altă filă îl poate fi schimbat între timp). */
        if (j.mutat) {
          sincron();
          if (eElev() && eu.h === hCerut) iesi(j.corectat   // 02.10.2026: și-a corectat numele / clasa / școala pe alt aparat
            ? 'Ți-ai corectat numele, clasa sau școala pe alt calculator, <b>' + esc(eu.nume) + '</b>. Intră cu datele corecte și cu același cod.'
            : 'Profesorul te-a deblocat cu un cod nou, <b>' + esc(eu.nume) + '</b>. Intră cu numele tău și cu codul nou.');
          return false;
        }
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
      sincron();   // amprenta (eu.h) și profilul trebuie să fie ale aceluiași elev, cel de ACUM
      if (!eElev() || !eu.h) return Promise.resolve();
      var a = Nor.aduna(); if (!a) return Promise.resolve();
      /* id-ul elevului pleacă lângă progres (30.09.2026, R10: legătura progres <-> elev, pentru „Deblochează” din panou);
         intră și în semn, ca progresul salvat ÎNAINTE de schimbare să urce o dată cu id-ul și să se lege singur */
      var tot = semn(JSON.stringify(a.date) + '|' + eu.id);
      if (!forteaza && a.m.trimis === tot) return Promise.resolve();
      var corp = JSON.stringify({ op: 'scrie', h: eu.h, date: a.date, id: eu.id });
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
  /* clasă scrisă de mână la „Altă clasă din școala asta” (28.09.2026): „a VI-a b” → „VI B”, „6b” → „6 B”;
     dacă e de fapt una dintre clasele profesorului, ia eticheta lui — amprenta iese aceeași pe orice aparat */
  function normClasa(s, proprii) {
    var t = String(s || '').trim().replace(/\s+/g, ' ').replace(/^clasa\s+/i, '').replace(/^a\s+/i, '').replace(/-a\b/i, '').toUpperCase();
    t = t.replace(/^(\d+|[IVX]+(?![IVX]))(?=[A-Z])/, '$1 ').slice(0, 20);
    if (!t) return '';
    var k = cheieClasa(t);
    return (proprii || []).filter(function (x) { var q = cheieClasa(x); return q[0] === k[0] && q[1] === k[1]; })[0] || t;
  }
  /* ȘCOALA SCRISĂ DE MÂNĂ CARE E ÎN LISTĂ (02.10.2026). Copiii de 10 ani nu-și recunosc școala după numele oficial
     („Liceul de Arte…”; Izvoare ține de Dumbrava Roșie), aleg „Altă școală” și scriu „Victor Brauner, Neamt”: toate cele
     4 înscrieri de acolo erau ale profesorului. Cuvintele care recunosc o școală vin din diplome-date.js („alias”, din
     AI_0\tools\diplome.py ALIAS); o școală doar dacă e UNA singură. Clasa: întâi eticheta întreagă („a-5-a AM” → „5 AM”),
     apoi doar numărul, dacă școala are o singură clasă cu numărul ăla; altfel n-o ghicim (o alege elevul). */
  function scoalaRecunoscuta(s) {
    var w = ' ' + faraDiacritice(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() + ' ';
    var g = ((DATE && DATE.scoli) || []).filter(function (x) { return (x.alias || []).some(function (a) { return w.indexOf(' ' + a + ' ') >= 0; }); });
    return g.length === 1 ? g[0] : null;
  }
  function clasaRecunoscuta(s, clase) {
    var t = faraDiacritice(s).toLowerCase().trim().replace(/^(clasa|cls\.?)\s*/, '').replace(/^a\s*[-\s]\s*(?=\d|[ivx])/, '')
      .replace(/(\d+|\b[ivx]+)\s*-\s*a\b/, '$1');
    var k = cheieClasa(t), l = clase || [];
    var ex = l.filter(function (x) { var q = cheieClasa(x); return q[0] === k[0] && q[1] === k[1]; });
    if (ex.length === 1) return ex[0];
    if (k[0] === 99) return '';
    var nr = l.filter(function (x) { return cheieClasa(x)[0] === k[0]; });
    return nr.length === 1 ? nr[0] : '';
  }

  /* cor = {cod} (02.10.2026): același formular, pentru CORECTURA elevului conectat (corecteaza()): fără câmpul de cod
     (codul l-a scris deja), completat cu ce scrisese, iar „Salvează” mută progresul (salveazaCorectura) */
  function formular(cor) {
    cor = cor && typeof cor.cod === 'string' ? cor : null;   // ca handler de clic (onclick = formular) primește evenimentul
    var GATA = cor ? 'Salvează' : 'Gata';
    arata('<div class="bar">' + (cor ? '<b>Corectează ce ai scris greșit</b><div class="mic">Schimbă școala, clasa sau numele. Nivelurile, lecțiile și minutele tale vin cu tine; codul rămâne același.</div>'
      : '<b>Cine ești?</b><div class="mic">Pe calculatoarele din laborator, la final apasă pe etichetă → „Ieși”.</div>' + NOTA + NOTA_NOTA) +
      '<label for="lhp-s">Școala</label><select id="lhp-s"><option value="">— alege —</option></select>' +
      '<div id="lhp-alta" style="display:none"><label for="lhp-as">Numele școlii</label><input id="lhp-as" maxlength="60" autocomplete="off" placeholder="ex. Școala Gimnazială Nr. 3">' +
      '<label for="lhp-al">Localitatea și județul</label><input id="lhp-al" maxlength="50" autocomplete="off" placeholder="ex. Roman, Neamț">' +
      '<label for="lhp-ac">Clasa</label><input id="lhp-ac" maxlength="20" autocomplete="off" placeholder="ex. a VI-a B"></div>' +
      '<div id="lhp-cc"><label for="lhp-c">Clasa</label><select id="lhp-c" disabled><option value="">— alege întâi școala —</option></select>' +
      '<div id="lhp-cxw" style="display:none"><label for="lhp-cx">Scrie clasa ta</label><input id="lhp-cx" maxlength="20" autocomplete="off" placeholder="ex. a VI-a B"></div></div>' +
      '<label for="lhp-n">Numele și prenumele, <b>întregi, ca în catalog</b></label><input id="lhp-n" maxlength="40" autocomplete="off" placeholder="ex. Popescu Ana-Maria">' +
      (cor ? '' : '<label for="lhp-k">Codul tău secret, <b>4 cifre</b> (scrie-l în caiet)</label><input id="lhp-k" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="ex. 4827">' +
      '<div class="mic">Cu același nume și același cod îți continui progresul pe orice calculator sau pe telefon. Dacă ai mai lucrat în altă parte, pune codul de atunci.</div>') +
      '<div class="err" id="lhp-e" aria-live="polite"></div><div class="row"><button id="lhp-ok">' + GATA + '</button>' +
      (cor ? '<button class="g" id="lhp-x">Înapoi</button></div>'
        : (lista().length ? '<button class="g" id="lhp-inapoi">← Înapoi la listă</button>' : '') + '<button class="g" id="lhp-x">Mai târziu</button></div>' +
      '<div class="row"><button class="g" id="lhp-uitat">Mi-am uitat codul</button></div>') + '</div>');
    // „Mai târziu” păstrează alegerea de dinainte (vizitatorul rămâne vizitator, cu butonul lui mic)
    $('lhp-x').onclick = cor ? meniu : function () { if (!(eu && eu.refuz)) eu = null; randeaza(); };
    if ($('lhp-inapoi')) $('lhp-inapoi').onclick = alege;
    var insista = '';   // „Altă școală” aleasă din nou după ce formularul i-a arătat școala din listă: îl lăsăm (nu e a lui)
    incarcaDate().then(function (d) {
      // formularul poate fi deja închis („Mai târziu”) sau redeschis (lista deja pusă) până sosesc datele
      if (!$('lhp-s') || $('lhp-s').options.length > 1) return;
      $('lhp-s').insertAdjacentHTML('beforeend', d.scoli.map(function (x) { return '<option value="' + esc(x.key) + '">' + esc(x.nume) + '</option>'; }).join('') +
        /* 01.10.2026 (R12, el: „am dat linkul și foștilor colegi [...] să nu-i amestecăm”): eticheta spunea „din altă
           localitate sau alt județ”, deci elevii colegilor din același oraș își alegeau o școală din listă. Valoarea
           rămâne „alta”: elevul de aici nu se leagă niciodată de un elev din ELEVI (activitate.py unde_e). */
        '<option value="alta">Altă școală (nu e în listă)</option>');
      $('lhp-s').onchange = function () {
        var alta = $('lhp-s').value === 'alta';
        $('lhp-alta').style.display = alta ? '' : 'none'; $('lhp-cc').style.display = alta ? 'none' : '';
        var sc = d.scoli.filter(function (x) { return x.key === $('lhp-s').value; })[0], c = $('lhp-c');
        c.innerHTML = '<option value="">— alege —</option>' + (sc ? sc.clase.slice().sort(cmpClasa).map(function (x) { return '<option>' + esc(x) + '</option>'; }).join('') +
          '<option value="__alta">Altă clasă din școala asta…</option>' : '');
        c.disabled = !sc;
        $('lhp-cxw').style.display = 'none';
        rezerva();
      };
      // în listă sunt doar clasele la care predă profesorul; celelalte clase ale școlii se scriu de mână
      $('lhp-c').onchange = function () {
        var alta = $('lhp-c').value === '__alta';
        $('lhp-cxw').style.display = alta ? '' : 'none';
        if (alta) $('lhp-cx').focus();
        rezerva();
      };
      // corectura: formularul pornește cu ce scrisese elevul (școala, clasa - din listă sau scrisă de mână -, numele)
      if (cor && eElev()) {
        var s0 = $('lhp-s');
        if (eu.scoala === 'alta' || d.scoli.some(function (x) { return x.key === eu.scoala; })) { s0.value = eu.scoala; s0.onchange(); }
        if (eu.scoala === 'alta') {
          var tx = String(eu.scoalaText || ''), i = tx.indexOf(', ');
          $('lhp-as').value = i < 0 ? tx : tx.slice(0, i); $('lhp-al').value = i < 0 ? '' : tx.slice(i + 2); $('lhp-ac').value = eu.clasa;
        } else if ([].some.call($('lhp-c').options, function (o) { return o.value === eu.clasa; })) $('lhp-c').value = eu.clasa;
        else if (s0.value) { $('lhp-c').value = '__alta'; $('lhp-c').onchange(); $('lhp-cx').value = eu.clasa; }
        $('lhp-n').value = eu.nume;
      }
    }, function () { if ($('lhp-e')) $('lhp-e').textContent ='Nu s-a putut încărca lista școlilor. Verifică internetul și reîncarcă pagina.'; });
    // școala, clasa și numele din formular (null + mesaj dacă lipsește ceva); folosit de „Gata” și de „Mi-am uitat codul”
    var dateFormular = function () {
      var sc = $('lhp-s').value, cl = $('lhp-c').value, nm = $('lhp-n').value.trim().replace(/\s+/g, ' '), st = '';
      if (sc === 'alta') {
        var as = $('lhp-as').value.trim(), al = $('lhp-al').value.trim(); cl = $('lhp-ac').value.trim();
        if (!as || !al || !cl) { $('lhp-e').textContent = 'Scrie numele școlii, localitatea cu județul și clasa.'; return null; }
        var rec = scoalaRecunoscuta(as + ' ' + al);
        if (rec && insista !== as + '|' + al) {   // școala lui e în listă: i-o alegem (și clasa, dacă o recunoaștem)
          insista = as + '|' + al;
          $('lhp-s').value = rec.key; $('lhp-s').onchange();
          var rc = clasaRecunoscuta(cl, rec.clase);
          if (rc) $('lhp-c').value = rc;
          $('lhp-e').textContent = 'Școala ta e în listă: ' + rec.nume + '. Am ales-o mai sus' + (rc ? ', cu clasa ' + rc : '; alege-ți și clasa') +
            '. Verifică și apasă din nou „' + GATA + '”.';
          return null;
        }
        st = (as + ', ' + al).slice(0, 120);
      } else if (cl === '__alta') {
        cl = normClasa($('lhp-cx').value, ((DATE.scoli.filter(function (x) { return x.key === sc; })[0]) || {}).clase);
        if (!cl) { $('lhp-e').textContent = 'Scrie clasa ta (ex. a VI-a B).'; return null; }
      }
      if (!sc || !cl) { $('lhp-e').textContent = 'Alege școala și clasa.'; return null; }
      if (nm.split(' ').length < 2) { $('lhp-e').textContent = 'Scrie numele și prenumele (două cuvinte).'; return null; }
      var sn = st || (DATE.scoli.filter(function (x) { return x.key === sc; })[0] || {}).nume || sc;
      var e = { id: idNou(), scoala: sc, scoalaNume: sn, clasa: cl, nume: nm, ultima: Date.now() };
      if (st) e.scoalaText = st;
      return e;
    };
    /* „Mi-am uitat codul” și din formular (30.09.2026): pe telefon sau pe alt calculator elevul nu e în listă */
    if ($('lhp-uitat')) $('lhp-uitat').onclick = function () {
      $('lhp-e').textContent = '';
      var e = dateFormular(); if (!e) return;
      var pc = peCalculator(cheieElev(e));
      if (pc && pc.id) e.id = pc.id;
      uitat(e, pc && pc.h, formular);
    };
    $('lhp-ok').onclick = async function () {
      var btn = this;
      $('lhp-e').textContent = '';
      var nou = dateFormular(); if (!nou) return;
      if (cor) { salveazaCorectura(nou, cor.cod, btn); return; }
      var cod = $('lhp-k').value.trim();
      if (!/^\d{4}$/.test(cod)) { $('lhp-e').textContent = 'Alege un cod de exact 4 cifre (ex. 4827) și scrie-l în caiet.'; return; }
      /* R2 (30.09.2026): un nume care e deja pe calculatorul ăsta (în listă, în lh_coduri sau cu sertar) intră doar cu
         codul LUI; înainte, formularul cu același nume și ORICE cod lua sertarul celuilalt. Același cod = același elev. */
      var pc = peCalculator(cheieElev(nou)), hStiut = (pc && pc.h) || null;
      /* GRAV-1 (30.09 seara): numele are sertar pe calculator, dar nicio amprentă ținută (nici în listă, nici în lh_coduri):
         scos din listă de versiunea de dinainte sau ieșit din lista de 80. Sertarul nu se dă pe primul cod (verificaCod). */
      var sertarVechi = !!(pc && !pc.x && !hStiut);
      if ((hStiut || sertarVechi) && pauza()) { asteaptaPauza(btn, $('lhp-e'), 'Gata'); return; }
      btn.disabled = true;
      try {
        $('lhp-e').textContent = 'Verific codul…';
        var r = await verificaCod(nou, cod, hStiut, sertarVechi);
        if (sincron() || !btn.isConnected) return;   // între timp a intrat altcineva (altă filă): caseta s-a redesenat
        if (!r.ok) {
          var ramase = r.motiv === 'gresit' || r.motiv === 'sertar' ? gresit() : -1;
          btn.disabled = false;
          $('lhp-e').textContent = (r.motiv === 'gresit' ? 'Pe calculatorul ăsta, ' + nou.nume + ' intră cu alt cod. '
            : r.motiv === 'sertar' ? 'Pe calculatorul ăsta e deja progres pe numele ' + nou.nume + ', iar codul ăsta nu se potrivește. ' : '') + mesajCod(r, ramase) +
            (r.motiv === 'gresit' ? ' Dacă ți-ai uitat codul, apasă „Mi-am uitat codul”.'
              : r.motiv === 'sertar' ? ' Dacă ți-ai uitat codul sau n-ai avut cod până acum, apasă „Mi-am uitat codul”.' : '');
          if (ramase === 0) asteaptaPauza(btn, $('lhp-e'), 'Gata');
          return;
        }
        if (hStiut || sertarVechi) sterge(K_GRESIT);
        nou.h = r.h;
        nou.numeEnc = await cripteaza(nou.nume);
        if (sincron() || !btn.isConnected) return;
        // același elev deja pe calculator: își păstrează id-ul (aceeași înregistrare la profesor)
        var dinLista = pc && pc.x;
        if (pc && pc.id) nou.id = pc.id;
        eu = nou;
        scrie(K_ID, eu); sterge(K_IESIT); mesajIesit = ''; sterge(K_COADA); if (!dinLista) sterge(K_JURNAL); confirmat = true; ultimaMiscare = Date.now();
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
      } catch (e) { btn.disabled = false; if ($('lhp-e')) $('lhp-e').textContent = 'Nu a mers. Reîncarcă pagina și încearcă din nou.'; }
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
    return e.scoala + '|' + e.clasa + '|' + faraDiacritice(e.nume)
      .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ').sort().join(' ');
  }
  /* FARA DIACRITICE (01.10.2026): NFD desface literele romanesti in litera + semn, dar unele litere (i fara punct
     turcesc, l taiat, o taiat, ss german...) nu au forma "fara semn" si ramaneau ("Isik" cu i turcesc iesea "is k",
     deci acelasi elev scris cu si fara i turcesc avea doua sertare). Aceeasi lista ca in AI_0\tools\litere.py
     (sursa); oracolul care compara toate copiile: AI_0\tools\tests\litere_proba.py.
     Pe 01.10.2026 nicio inscriere nu avea astfel de litere, deci nicio amprenta existenta nu se schimba. */
  function faraDiacritice(s) {
    var L = { '\u0131': 'i', '\u0130': 'I', '\u0142': 'l', '\u0141': 'L', '\u00f8': 'o', '\u00d8': 'O', '\u0111': 'd', '\u0110': 'D', '\u00f0': 'd', '\u00d0': 'D', '\u00fe': 'th', '\u00de': 'Th',
      '\u00df': 'ss', '\u00e6': 'ae', '\u00c6': 'Ae', '\u0153': 'oe', '\u0152': 'Oe', '\u0127': 'h', '\u0126': 'H', '\u0167': 't', '\u0166': 'T' };
    return String(s || '').replace(/[\u0131\u0130\u0142\u0141\u00f8\u00d8\u0111\u0110\u00f0\u00d0\u00fe\u00de\u00df\u00e6\u00c6\u0153\u0152\u0127\u0126\u0167\u0166]/g, function (c) { return L[c]; })
      .normalize('NFKD').replace(/[\u0300-\u036f\u1ab0-\u1aff\u1dc0-\u1dff\u20d0-\u20ff\ufe20-\ufe2f]/g, '');
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
    eu = null; confirmat = false; strans = false;   // alt elev la calculator: întrebarea i se arată întreagă
    sterge(K_ID); sterge(K_COADA); sterge(K_JURNAL); sterge(K_TINUT);
    // nivelurile făcute cât stătea „Ești tot X?” nu sunt ale lui X: trec la cel care stă acum la calculator
    mutaJoc('_tinut', '_neinscris');
    puneProfil('_neinscris');   // până se înscrie următorul, nu lucrează pe profilul celui plecat
    try { dispatchEvent(new CustomEvent('prezenta', { detail: null })); } catch (e) {}
  }
  function identitate() { return eElev() ? { nume: eu.nume, scoala: eu.scoala, clasa: eu.clasa } : null; }

  window.Prezenta = {
    versiune: 'plecat-pas-2026-10-10',   // marcajul pentru verificarea live (10.10: h, acum.pas, plecat, ev „pas”, cadența de 5 minute)
    identitate: identitate,
    iesi: function () { if (eElev()) iesi(); },
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
    intreaba: function () { sincron(); if (!eElev()) return; trimite(true); eu.intreaba = true; scrie(K_ID, eu); randeaza(); },
    eveniment: function (e) {
      sincron();
      var K = tinta(); if (!eElev() || !K || !e || !e.tip || !e.joc) return;
      var c = citeste(K, null) || { pag: {}, ev: [] };
      var x = { tip: e.tip, joc: e.joc, titlu: e.titlu || '', nivel: e.nivel, din: e.din, stele: e.stele, max: e.max, cand: new Date().toISOString() };
      // sinc (bucla 10.10.2026, T1): motor.js retrimite la deschiderea paginii nivelurile terminate cândva; nu sunt progres de azi
      if (e.sinc) x.sinc = 1;
      c.ev.push(x);
      c.ev = c.ev.slice(-30); if (!c.de) c.de = Date.now();
      if (K === K_TINUT) c.u = Date.now();
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
      sincron();
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
    pornit = true; eu = citeste(K_ID, null);   // ce e pe disc ACUM (altă filă poate fi scris între timp)
    if (eElev()) sterge(K_IESIT);            // e cineva conectat: semnul „nu e nimeni conectat” nu mai e adevărat
    if (stare() === 'activ') { reincarcaDacaTrebuie(puneSertar()); inregistreaza(); }
    randeaza();
    /* adresa serverului, de la început (28.09.2026): altfel, în primele 30 s pe pagină „Schimbă elevul” (uita -> trimite)
       nu știa unde să trimită, iar secundele elevului de dinainte se ștergeau netrimise */
    if (stare() === 'activ' || stare() === 'intreaba') incarcaDate().then(null, function () {});
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
    // pasul anunțat de motor înainte să ne încărcăm noi (motor.js ne încarcă după ce și-a desenat primul pas)
    if (window.__lhPas) notaPas(window.__lhPas);
  }
  if (document.body) porneste(); else document.addEventListener('DOMContentLoaded', porneste);
})();
