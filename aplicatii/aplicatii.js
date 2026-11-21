/* aplicatii.js — BIBLIOTECA CENTRALĂ a aplicațiilor simulate din LearningHub (contractul: _campaign/aplicatii_fidele_2026_11/
   api_biblioteca.md §1-§8 și oracole/CONVENTIE_ARBORE.md). Singurul fișier pe care îl cere o pagină:
       <script src="../../../aplicatii/aplicatii.js"></script>
       <div data-lh-aplicatie-loc></div>
       <script>LH.aplicatii.deschide('word', {continut: {paragrafe: ['Ana are mere.']}})</script>
   Restul (setari.json, stare.js, panglica.js, <aplicatie>.js, date/<aplicatie>.json, profiluri/*.json, aplicatii.css) se
   încarcă de aici, de lângă acest fișier. Aici stau: registrul instanțelor (radacini), evenimentele standard (§4),
   asistarea (§6), tipul comun pentru motorul lecțiilor (§8.1). Interfața fiecărei aplicații se GENEREAZĂ din referința
   reală (date/<aplicatie>.json, scrisă de _unelte/genereaza_<aplicatie>.py) și o desenează panglica.js — o singură dată,
   pentru toate paginile (R1-R3). */
(function () {
  'use strict';
  const W = window;
  if (W.LH && W.LH.aplicatii && W.LH.aplicatii.__biblioteca) return;
  const SCR = document.currentScript;
  const BAZA = SCR && SCR.src ? SCR.src.replace(/[?#].*$/, '').replace(/[^/]*$/, '') : 'aplicatii/';
  const APLICATII = ['windows', 'explorer', 'word', 'excel', 'powerpoint', 'paint'];
  const PROFILURI = { word: ['word365', 'word2007'], excel: ['excel365'], powerpoint: ['powerpoint365'], explorer: ['windows11'],
    windows: ['windows11'], paint: ['paint11'] };
  const SETARI_IMPLICITE = { versiune: '?', profil: { word: 'word365', excel: 'excel365', powerpoint: 'powerpoint365',
    explorer: 'windows11', windows: 'windows11', paint: 'paint11' }, limba: 'en', tema: 'auto',
    asistare: { dupaGreseli: 2, dupaSecunde: 30 }, evenimente: { tampon: 500 } };

  const L = { __biblioteca: true, versiune: null, setari: null };
  const MODULE = {};          // module încărcate: stare, panglica, word...
  const INST = {};            // nume -> instanța deschisă
  const EV = [];              // ultimele evenimente (setari.evenimente.tampon)
  W.__lhAplicatieEv = EV;
  const clona = o => JSON.parse(JSON.stringify(o === undefined ? null : o));
  L._clona = clona;
  L._baza = BAZA;

  /* ------------------------------------------------------------ încărcarea */
  const promis = {};
  function script(src) {
    if (promis[src]) return promis[src];
    return (promis[src] = new Promise((ok, nu) => {
      const s = document.createElement('script');
      s.src = BAZA + src + (L.versiune ? '?v=' + encodeURIComponent(L.versiune) : '');
      s.async = false;
      s.onload = () => ok(true);
      s.onerror = () => nu(new Error('biblioteca: nu s-a încărcat ' + src));
      document.head.appendChild(s);
    }));
  }
  function json(src) {
    if (promis[src]) return promis[src];
    return (promis[src] = fetch(BAZA + src + (L.versiune ? '?v=' + encodeURIComponent(L.versiune) : ''), { cache: 'no-cache' })
      .then(r => { if (!r.ok) throw new Error('biblioteca: ' + src + ' ' + r.status); return r.json(); }));
  }
  function css() {
    if (document.querySelector('link[data-lh-aplicatii-css]')) return Promise.resolve(true);
    return new Promise(ok => {
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = BAZA + 'aplicatii.css' + (L.versiune ? '?v=' + encodeURIComponent(L.versiune) : '');
      l.setAttribute('data-lh-aplicatii-css', '');
      l.onload = () => ok(true);
      l.onerror = () => ok(false);
      document.head.appendChild(l);
    });
  }
  L._modul = (nume, m) => { MODULE[nume] = m; return m; };
  L._module = MODULE;
  L._json = json;
  L._script = script;

  L.gata = json('setari.json').catch(() => SETARI_IMPLICITE).then(s => {
    L.setari = Object.assign({}, SETARI_IMPLICITE, s || {});
    L.versiune = L.setari.versiune;
    return Promise.all([css(), script('stare.js'), script('panglica.js')]);
  }).then(() => true);

  function setari() { return L.setari || SETARI_IMPLICITE; }

  /* ------------------------------------------------------------ deschide / inchide */
  const SURSE_APP = { word: ['word.js', 'date/word.json'], excel: ['excel.js', 'date/excel.json'],
    powerpoint: ['powerpoint.js', 'date/powerpoint.json'] };
  SURSE_APP.windows = ['windows.js', 'date/windows.json'];   // runda 18 (B-windows): Windows 11 RO, generat din uia_windows.json
  SURSE_APP.explorer = ['explorer.js', 'date/explorer.json'];   // runda 15 (B-explorer): File Explorer RO, generat din uia_explorer.json
  PROFILURI.explorer = ['explorer_windows11', 'windows11']; SETARI_IMPLICITE.profil.explorer = 'explorer_windows11';   // runda 15
  function incarcaApp(nume) {
    const s = SURSE_APP[nume];
    if (!s) return Promise.reject(new Error('„' + nume + '” nu e încă în bibliotecă (vine într-un val următor)'));
    return Promise.all([script(s[0]), json(s[1])]).then(r => r[1]);
  }
  function alegeProfil(nume, cerut) {
    const voie = PROFILURI[nume] || [];
    const impl = (setari().profil || {})[nume] || voie[0];
    return voie.indexOf(cerut) >= 0 ? cerut : impl;
  }
  function locDin(opt) {
    let loc = opt.loc;
    if (typeof loc === 'string') loc = document.querySelector(loc);
    if (!loc || !loc.appendChild) loc = document.querySelector('[data-lh-aplicatie-loc]');
    if (!loc) { loc = document.createElement('div'); document.body.appendChild(loc); }
    return loc;
  }

  L.deschide = function (nume, opt) {
    opt = opt || {};
    if (APLICATII.indexOf(nume) < 0) return Promise.reject(new Error('aplicație necunoscută: ' + nume));
    return L.gata.then(() => incarcaApp(nume)).then(date => {
      const M = MODULE[nume];
      if (!M || typeof M.creeaza !== 'function') throw new Error('biblioteca: modulul ' + nume + ' lipsește');
      const profilId = alegeProfil(nume, opt.profil);
      return json('profiluri/' + profilId + '.json').catch(() => ({ id: profilId })).then(profil => {
        const loc = locDin(opt);
        if (INST[nume]) L.inchide(nume);
        const root = document.createElement('div');
        root.setAttribute('data-lh-aplicatie', nume);
        root.setAttribute('data-lh-profil', profilId);
        root.setAttribute('data-lh-versiune', String(L.versiune));
        root.className = 'lh-ap lh-ap-' + nume + (opt.scenariu ? ' lh-ap-scenariu' : '');
        const tema = setari().tema;
        if (tema && tema !== 'auto') root.setAttribute('data-lh-tema', tema);
        root.tabIndex = -1;
        loc.appendChild(root);
        const I = { app: nume, root, opt, profil: Object.assign({ id: profilId }, profil), date, setari: setari(),
          zonaTinta: 'document', ultimaActiune: null };
        I.emite = (gest, actiune, tinta, inainte, extra) => emite(I, gest, actiune, tinta, inainte, extra);   // runda 30 (A26-2): + extra (activat)
        I.nesimulat = (eticheta, tinta) => nesimulat(I, eticheta, tinta);
        M.creeaza(I, opt.continut || {}, L);
        leagaGesturi(I);
        INST[nume] = I;
        if (opt.focus) try { (I.focus || (() => root.focus({ preventScroll: true })))(); } catch (e) { /* */ }
        I.api = { aplicatie: nume, radacina: root, stare: () => clona(I.stare()), element: t => L.element(nume, t),
          focus: () => (I.focus ? I.focus() : root.focus({ preventScroll: true })), inchide: () => L.inchide(nume) };
        if (opt.asistent) {
          const P = (W.LH && W.LH.aplicatii) || W.LHAplicatii || L;
          I.asist = P.asistent(nume, opt.asistent);
        }
        return I.api;
      });
    });
  };
  function viu(nume) {
    const I = INST[nume];
    if (I && !I.root.isConnected) { opresteInstanta(I); delete INST[nume]; return null; }
    return I || null;
  }
  function opresteInstanta(I) {
    if (I.asist) try { I.asist.opreste(); } catch (e) { /* */ }
    if (I.distruge) try { I.distruge(); } catch (e) { /* */ }
    if (I._laSus) W.removeEventListener('pointerup', I._laSus, true);
  }
  L.inchide = function (nume) {
    const I = INST[nume];
    if (!I) return;
    opresteInstanta(I);
    I.root.remove();
    delete INST[nume];
  };
  /* §1 (reparația 8): rădăcinile create de bibliotecă — O1 acceptă un [data-lh-aplicatie] doar dacă e aici */
  L.radacini = () => Object.keys(INST).map(n => INST[n].root).filter(r => r && r.isConnected);

  /* ------------------------------------------------------------ ținte (§3) */
  const canon = e => {
    const t = e.getAttribute('data-lh-tinta') || '', id = e.getAttribute('data-lh-id');
    return t.indexOf(':') >= 0 || id == null || id === '' ? t : t + ':' + id;
  };
  L._canon = canon;
  const vizibil = e => {
    if (!e || !e.isConnected) return false;
    const r = e.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return false;
    const s = getComputedStyle(e);
    return s.visibility !== 'hidden' && s.display !== 'none';
  };
  L._vizibil = vizibil;
  L.element = function (nume, t) {
    const I = viu(nume);
    if (!I || !t) return null;
    if (t.indexOf('mso:') === 0) {
      const id = t.slice(4);
      return [...I.root.querySelectorAll('[data-lh-id-mso="' + CSS.escape(id) + '"]')].find(vizibil) || null;
    }
    return [...I.root.querySelectorAll('[data-lh-tinta]')].find(e => canon(e) === t && vizibil(e)) || null;
  };
  L.tinte = function (nume) {
    const I = viu(nume);
    if (!I) return [];
    return [...new Set([...I.root.querySelectorAll('[data-lh-tinta]')].filter(vizibil).map(canon))];
  };
  L.stare = function (nume) { const I = viu(nume); return I ? clona(I.stare()) : null; };
  L.pxPePunct = function (nume) { const I = viu(nume); return I && I.pxPePunct ? I.pxPePunct() : 1; };
  L.deschideSuprafata = function (cheie, ceruta) {
    const nume = ceruta && viu(ceruta) ? ceruta : Object.keys(INST).find(n => viu(n));   // runda 30 (A23-1 P2): aplicația cerută (montată)
    const I = nume && INST[nume];
    if (!I || !I.deschideSuprafata) return Promise.reject(new Error('nicio aplicație deschisă'));
    return Promise.resolve(I.deschideSuprafata(cheie));
  };
  L.demonstratie = function (nume, gest) {
    const M = MODULE[nume];
    return M && M.demonstratie ? (M.demonstratie[gest] || null) : null;
  };

  /* ------------------------------------------------------------ evenimentele standard (§4) */
  function emite(I, gest, actiune, tinta, inainte, extra) {
    if (!I || !I.root.isConnected) return null;
    let dupa;
    try { dupa = clona(I.stare()); } catch (e) { dupa = {}; }
    const d = { aplicatie: I.app, gest, actiune: actiune || gest, tinta: tinta || I.zonaTinta, inainte: inainte || {}, dupa,
      ts: Date.now(), profil: I.profil.id, pas: W.__lhPas || null };
    /* activat = butonul pe care tasta l-a apăsat fără să fie ținta focusului (Enter într-o fereastră = butonul implicit:
       learn.microsoft.com/en-us/windows/win32/dlgbox/dlgbox-programming-considerations, ENTER „… IDOK or control
       identifier of the default push button”); critic runda 2, GRAV N2 */
    if (extra && extra.activat) d.activat = extra.activat;
    const lim = (setari().evenimente || {}).tampon || 500;
    EV.push(d);
    while (EV.length > lim) EV.shift();
    try { W.dispatchEvent(new CustomEvent('lh-aplicatie', { detail: d })); } catch (e) { /* */ }
    return d;
  }
  L.asculta = fn => {
    const h = e => { try { fn(e.detail); } catch (x) { /* */ } };
    W.addEventListener('lh-aplicatie', h);
    return () => W.removeEventListener('lh-aplicatie', h);
  };
  /* mesajul central standard pentru o comandă afișată, nesimulată (R12, api §3: data-lh-nesimulat, role=status).
     Runda 19 (critic 15, GRAV E1): o aplicație care își REDESENEAZĂ rădăcina (Explorer: root.innerHTML) scotea mesajul în
     aceeași milisecundă. Mesajul rămâne sub rădăcină; cât trăiește, un observator pe rădăcină (doar childList) îl pune
     înapoi când lotul de mutații care l-a scos a adus și noduri noi (= redesenare). Un m.remove() singur (expirarea, alt
     mesaj, o curățare explicită) e respectat; la aplicațiile care nu rescriu rădăcina observatorul nu face nimic. */
  function nesimulat(I, eticheta) {
    I.root.querySelectorAll('[data-lh-nesimulat]:not([data-lh-tip])').forEach(x => x.remove());
    if (I._moMesaj) { I._moMesaj.disconnect(); I._moMesaj = null; }
    const m = document.createElement('div');
    m.className = 'lh-ap-mesaj';
    m.setAttribute('data-lh-nesimulat', eticheta);
    m.setAttribute('role', 'status');
    const sablon = ((setari().mesaje || {}).nesimulat) || 'În aplicația reală, „{x}” funcționează; aici nu e simulată.';
    m.textContent = sablon.replace('{x}', eticheta);
    I.root.appendChild(m);
    const durata = I.opt.scenariu ? 60000 : 5000, pana = Date.now() + durata;
    if (typeof MutationObserver === 'function') {
      const mo = new MutationObserver(lot => {
        if (m.isConnected) return;
        if (I._moMesaj !== mo || Date.now() >= pana || !I.root.isConnected) { mo.disconnect(); return; }
        if (!lot.some(x => [...x.removedNodes].indexOf(m) >= 0) || !lot.some(x => x.addedNodes.length)) return;
        if (I.root.querySelector('[data-lh-nesimulat]:not([data-lh-tip])')) return;   // alt mesaj i-a luat locul
        I.root.appendChild(m);
      });
      mo.observe(I.root, { childList: true });
      I._moMesaj = mo;
    }
    clearTimeout(I._tMesaj);
    I._tMesaj = setTimeout(() => { if (I._moMesaj) { I._moMesaj.disconnect(); I._moMesaj = null; } m.remove(); }, durata);
    return 'nesimulat';
  }

  const TASTE = { Delete: 'tasta_delete', Backspace: 'tasta_backspace', Enter: 'tasta_enter', Escape: 'tasta_esc', Tab: 'tasta_tab',
    Home: 'tasta_home_end', End: 'tasta_home_end', PageUp: 'tasta_pagina', PageDown: 'tasta_pagina', Meta: 'tasta_windows',
    OS: 'tasta_windows' };
  /* T4 (critic 13): tasta fizică în curs (keydown → e.key; keyup → null), citită de tastaFaraClic ca să spună dacă ieșirea din
     modul tastelor de acces vine din Esc (api_biblioteca.md:172 „Esc în modul tastelor de acces: tasta_esc”) sau din Alt apăsat
     a doua oară (tasta_acces). Pe window, în faza de captură: se vede înaintea ascultătorilor aplicațiilor de pe rădăcină. */
  let tastaAcum = null;
  W.addEventListener('keydown', e => { tastaAcum = e.key; }, true);
  W.addEventListener('keyup', () => { tastaAcum = null; }, true);
  function litera(e) {
    const m = /^Key([A-Z])$/.exec(e.code || '');
    if (m) return m[1].toLowerCase();
    return e.key && e.key.length === 1 && /[a-z]/i.test(e.key) ? e.key.toLowerCase() : null;
  }
  /* runda 26 (critic 22, K1): tasta Windows + literă = gestul ei (`win_e`, `win_shift_s`), nu Ctrl + literă, DOAR în aplicația
     care declară tasta cu sigla a ei (`I.tastaWindows`, azi Windows) și nu pe Mac (acolo Cmd ține locul lui Ctrl). În rest, la fel. */
  const MAC = /Mac|iPhone|iPad|iPod/.test(((W.navigator || {}).userAgentData || {}).platform || (W.navigator || {}).platform || '');
  /* runda 30 (critic 26, N2): cu tasta Windows ținută, ORICE altă tastă (Spațiu, cifre, punct, virgulă, Tab, săgeți, F-uri…), nu doar
     literele, e gestul `win_<tastă>`; numele vine din e.code (locul tastei, nu așezarea tastaturii). Shift / Ctrl / Alt nu sunt gesturi. */
  const WIN_COD = { Space: 'spatiu', Period: 'punct', NumpadDecimal: 'punct', Comma: 'virgula', Minus: 'minus', NumpadSubtract: 'minus',
    Equal: 'plus', NumpadAdd: 'plus', Semicolon: 'punct_virgula', Slash: 'slash', NumpadDivide: 'slash', Backslash: 'backslash',
    IntlBackslash: 'backslash', Quote: 'apostrof', Backquote: 'accent', BracketLeft: 'paranteza_stanga', BracketRight: 'paranteza_dreapta',
    NumpadMultiply: 'inmultit', Tab: 'tab', Enter: 'enter', NumpadEnter: 'enter', Escape: 'esc', Backspace: 'backspace', Delete: 'delete',
    Insert: 'insert', Home: 'home', End: 'end', PageUp: 'pagina_sus', PageDown: 'pagina_jos', ArrowUp: 'sus', ArrowDown: 'jos',
    ArrowLeft: 'stanga', ArrowRight: 'dreapta', PrintScreen: 'printscreen', Pause: 'pauza', ContextMenu: 'meniu' };
  function tastaWin(e) {
    const c = e.code || '', k = e.key || '';
    if (/^(Shift|Control|Alt|AltGraph|Meta|OS|CapsLock|NumLock|ScrollLock|Fn|FnLock|Hyper|Super|Symbol)$/.test(k)) return null;
    const d = /^(?:Digit|Numpad)(\d)$/.exec(c) || /^(\d)$/.exec(k);
    if (d) return d[1];
    if (/^F\d{1,2}$/.test(c)) return c.toLowerCase();
    if (WIN_COD[c]) return WIN_COD[c];
    if (k === ' ') return 'spatiu';
    return WIN_COD[k] || null;          // fără e.code (tastaturi virtuale): după numele tastei (Tab, Enter, ArrowUp…)
  }
  function gestTasta(e) {
    const k = e.key, c = e.ctrlKey || (e.metaKey && k !== 'Meta');
    if ((e.metaKey || k === 'Meta' || k === 'OS') && !e.ctrlKey && !e.altKey && !MAC) {
      const rad = e.currentTarget, I = rad && rad.getAttribute ? INST[rad.getAttribute('data-lh-aplicatie')] : null;
      if (I && I.root === rad && I.tastaWindows) {
        /* runda 30 (A26-2): tasta Windows singură nu e un gest la APĂSARE: aplicația care o declară (I.tastaWindowsLaRidicare,
           azi Windows) o emite la RIDICARE, dacă între timp n-a venit altă tastă (Windows + E nu mai deschide Start pentru o clipă) */
        if (k === 'Meta' || k === 'OS') { if (I.tastaWindowsLaRidicare) return null; }
        else { const l = litera(e) || tastaWin(e); if (l) return (e.shiftKey ? 'win_shift_' : 'win_') + l; }
      }
    }
    if (/^Arrow/.test(k)) return e.altKey ? 'alt_sageti' : 'sageti';
    if (/^F\d{1,2}$/.test(k)) return 'tasta_' + k.toLowerCase();
    if (c && !e.altKey) {
      const l = litera(e);
      if (l) return (e.shiftKey ? 'ctrl_shift_' : 'ctrl_') + l;
      if (!(k in TASTE)) return null;      // Ctrl+Enter, Ctrl+Home… → felul tastei
    }
    if (k in TASTE) return TASTE[k];
    if (k && k.length === 1 && !e.altKey) return 'tastare';
    return null;
  }
  L._gestTasta = gestTasta;
  const FEL_CLIC = { fila: 'clic_fila', panglica: 'clic_comanda_panglica', lansator: 'lansator_grup', meniu_derulant: 'meniu_derulant',
    acces_rapid: 'acces_rapid', zoom: 'zoom' };
  function gestClic(t, e) {
    if (e.shiftKey) return 'shift_clic';
    if (e.ctrlKey || e.metaKey) return 'ctrl_clic';
    if (!t) return 'clic';
    if (t === 'fila:File' || t === 'fila_file') return 'fila_file';
    return FEL_CLIC[t.split(':')[0]] || 'clic';
  }
  function tintaDin(I, el) {
    const x = el && el.closest && el.closest('[data-lh-tinta]');
    if (x && I.root.contains(x)) return canon(x);
    return 'fereastra_app:' + I.app;
  }
  L._tintaDin = tintaDin;
  const eCamp = el => !!(el && el.closest && el.closest('input,textarea,select,[contenteditable="true"]') &&
    !el.closest('[data-lh-intrare-document]'));

  function leagaGesturi(I) {
    const r = I.root;
    let jos = null, faraClic = 0, ultim = null, inaintePas = null;
    const st = () => { try { return clona(I.stare()); } catch (e) { return {}; } };
    /* Clicul se recunoaște la RIDICAREA butonului (pointerup), nu din evenimentul „click” al browserului: dacă apăsarea
       redesenează elementul (cursorul pus în document, panglica schimbată), browserul nu mai trimite „click” — §4 cere
       ca dublul clic să fie recunoscut și atunci. „click” rămâne doar pentru clicurile fără mouse (tastatură, el.click()). */
    function clicul(t, ev, ina) {
      const acum = Date.now();
      const n = ultim && acum - ultim.ts < 500 && Math.hypot(ev.clientX - ultim.x, ev.clientY - ultim.y) < 6 ? ultim.n + 1 : 1;
      ultim = { ts: acum, x: ev.clientX, y: ev.clientY, n };
      const g = gestClic(t, ev);
      I.ultimaActiune = null;
      let act = null;
      if (I.la && I.la.clic) act = I.la.clic(t, ev, n, g);
      emite(I, g, act || I.ultimaActiune || 'clic', t, ina);
      if (n === 2) {
        let a2 = null;
        if (I.la && I.la.dublu) a2 = I.la.dublu(t, ev);
        emite(I, 'dublu_clic', a2 || 'dublu_clic', t, ina);
      }
    }
    r.addEventListener('pointerdown', e => {
      /* runda 30 (A23-1 P1): ținta e într-o altă aplicație a bibliotecii, montată în aceasta (opt.incadrat) → clicul e al ei */
      const ra = e.target && e.target.closest && e.target.closest('[data-lh-aplicatie]');
      if (ra && ra !== r) { jos = null; return; }
      if (e.button !== 0) { jos = null; return; }
      /* încheierea compunerii (laAtingere, pe window, înaintea acestui ascultător) redesenează documentul: elementul atins
         nu mai e în pagină → se ia elementul nou din același punct, ca atingerea să mute cursorul acolo (critic runda 2, N3 b) */
      let tg = e.target, ex = e;
      if (!tg.isConnected) {
        const x = document.elementFromPoint(e.clientX, e.clientY);
        if (x && r.contains(x)) {
          tg = x;
          ex = { target: x, clientX: e.clientX, clientY: e.clientY, shiftKey: e.shiftKey, ctrlKey: e.ctrlKey, metaKey: e.metaKey,
            altKey: e.altKey, button: e.button, buttons: e.buttons, pointerType: e.pointerType, preventDefault: () => e.preventDefault() };
        }
      }
      const t = tintaDin(I, tg);
      inaintePas = st();
      jos = { x: e.clientX, y: e.clientY, t, tras: false, fel: null, tinta0: tg };
      if (I.la && I.la.jos) jos.fel = I.la.jos(ex, t) || null;
    }, true);
    r.addEventListener('pointermove', e => {
      if (!jos || !(e.buttons & 1)) return;
      if (!jos.tras && Math.hypot(e.clientX - jos.x, e.clientY - jos.y) > 5) jos.tras = true;
      if (jos.tras && I.la && I.la.misca) I.la.misca(e, jos);
    });
    const laSus = e => {
      const j = jos;
      jos = null;
      if (!j || !r.isConnected) return;
      faraClic = Date.now();
      if (j.tras) {
        const g = j.t === 'maner_umplere' ? 'umplere_tragere' : (j.fel || 'selectie');
        let act = g;
        if (I.la && I.la.sus) act = I.la.sus(e, j, g) || g;
        emite(I, g, act, j.t, inaintePas || st());
        return;
      }
      if (I.la && I.la.sus) I.la.sus(e, j, null);
      const sub = document.elementFromPoint(e.clientX, e.clientY);
      if (!sub || !r.contains(sub)) { if (!(j.tinta0 && j.tinta0.isConnected && r.contains(j.tinta0))) return; }
      const tg = j.tinta0 && j.tinta0.isConnected ? j.tinta0 : sub;
      const ev = { target: tg, clientX: e.clientX, clientY: e.clientY, shiftKey: e.shiftKey, ctrlKey: e.ctrlKey, metaKey: e.metaKey,
        altKey: e.altKey, button: 0, preventDefault() {} };
      const ina = inaintePas || st();
      inaintePas = null;
      clicul(j.t, ev, ina);
    };
    I._laSus = laSus;
    W.addEventListener('pointerup', laSus, true);
    r.addEventListener('click', e => {
      if (e.detail > 0) return;   // clicul de mouse a fost tratat la ridicare (pointerup)
      const t = tintaDin(I, e.target);
      clicul(t, e, st());
    });
    r.addEventListener('contextmenu', e => {
      e.preventDefault();
      const t = tintaDin(I, e.target), ina = st();
      let act = null;
      if (I.la && I.la.dreapta) act = I.la.dreapta(t, e);
      emite(I, 'clic_dreapta', act || 'meniu_contextual', t, ina);
    });
    r.addEventListener('wheel', e => {
      const ina = st(), t = tintaDin(I, e.target);
      if (e.ctrlKey) {
        e.preventDefault();
        let act = null;
        if (I.la && I.la.zoomRotita) act = I.la.zoomRotita(e);
        emite(I, 'zoom', act || 'zoom', t, ina);
      } else emite(I, 'rotita', 'derulare', t, ina);
    }, { passive: false });
    r.addEventListener('keydown', e => {
      const g = gestTasta(e);
      if (!g) return;
      const inCamp = eCamp(e.target);
      const ina = st();
      /* la taste, ținta = focusul din MOMENTUL tastei (§4): Enter în File name închide fereastra, iar focusul de după e
         documentul (critic runda 2, GRAV N2) */
      const t0 = inCamp && r.contains(e.target) ? tintaDin(I, e.target) : null;
      I.ultimaActiune = null;
      I.activat = null;
      /* opțional (doar aplicațiile care îl pun, azi Excel): ținta focusului citită de aplicație ÎNAINTE ca tasta să închidă
         fereastra / meniul (§4: „la taste: ținta focusului” din MOMENTUL tastei; critic runda 7, GRAV K2). Word nu-l pune. */
      I.tintaTasta = null;
      let act = null;
      if (I.la && I.la.tasta) act = I.la.tasta(e, g, inCamp);
      const extra = I.activat ? { activat: I.activat } : null;
      I.activat = null;
      const tAp = I.tintaTasta;
      I.tintaTasta = null;
      /* runda 23 (critic 19, GRAV N2; api §4): scurtăturile se opresc ȘI în câmpurile de text ale aplicației (acolo F5 / Ctrl+R
         reîncărcau lecția, Alt+← pleca din ea). În câmp rămân ale câmpului DOAR tastele de editare: Ctrl+A/C/V/X/Z/Y (+ Ctrl+Shift+
         Z/V), săgețile, Home/End, Backspace/Delete, simple sau cu Ctrl/Shift (cuvinte, selecție); pe Mac și Option+săgeți /
         Backspace / Delete. Tab în câmp rămâne ca înainte. Scrisul, Enter, Esc, Shift+săgeți n-au Ctrl/Alt/F: nu se opresc;
         AltGr (Ctrl+Alt + literă) dă gestTasta = null și iese mai sus, deci diacriticele nu ajung aici. */
      const cuMod = e.ctrlKey || e.metaKey || e.altKey || /^F\d/.test(e.key);
      const lit = /^Key[A-Z]$/.test(e.code || '') ? e.code.slice(3).toLowerCase() : String(e.key || '').toLowerCase();
      const deEditare = !/^F\d/.test(e.key) && (/^(Arrow(Left|Right|Up|Down)|Home|End|Backspace|Delete)$/.test(e.key)
        ? (!e.altKey && !(e.ctrlKey && e.shiftKey && /^(Backspace|Delete)$/.test(e.key))) ||   // Ctrl+Shift+Delete = browserul
          (/Mac|iPhone|iPad/.test(navigator.platform || '') && !e.ctrlKey && !e.metaKey)
        : !e.altKey && (e.ctrlKey || e.metaKey) && (e.shiftKey ? /^[zv]$/ : /^[acvxzy]$/).test(lit));
      if (inCamp ? cuMod && !deEditare : cuMod || e.key === 'Tab') e.preventDefault();
      const t = t0 || tAp || tintaDin(I, document.activeElement && r.contains(document.activeElement) ? document.activeElement : null);
      if (inCamp) setTimeout(() => emite(I, g, act || I.ultimaActiune || g, t, ina, extra), 0);
      else emite(I, g, act || I.ultimaActiune || g, t, ina, extra);
    });
    /* textul venit fără keydown utilizabil (telefon, IME, diacritice): evenimentul „input” pe intrarea documentului.
       Tastaturile care COMPUN cuvântul (Gboard, Samsung Keyboard, IME) trimit „input” cu isComposing la fiecare literă:
       cât compun, caseta NU se golește și documentul nu se schimbă; textul compus pleacă O SINGURĂ dată, la sfârșitul
       compunerii, oricare ar fi ordinea „input” / „compositionend” (Chrome, Safari). Cuvântul în lucru se vede la cursor
       (clasa lh-ap-compune). Critic runda 1, GRAV 1. */
    if (I.intrare) {
      const X = I.intrare;
      let compune = false;
      const trimite = tip => {
        const v = X.value;
        X.value = '';
        if (!v) return;
        const ina = st();
        const act = I.la && I.la.text ? I.la.text(v, { tip: tip || '' }) : 'scriere';
        emite(I, 'tastare', act || 'fara_efect', I.zonaTinta, ina);
      };
      const latime = () => { X.style.width = compune ? Math.max(1, [...X.value].length + 1) + 'ch' : ''; };
      X.addEventListener('compositionstart', () => { compune = true; r.classList.add('lh-ap-compune'); latime(); });
      X.addEventListener('compositionend', () => {
        compune = false;
        r.classList.remove('lh-ap-compune');
        latime();
        /* textul pleacă ACUM: o atingere care a încheiat compunerea e urmată imediat de „click” (un „Verifică” citește
           stare()); caseta rămâne goală, deci un „input” venit după (Safari) nu mai are ce trimite (critic runda 2, N3) */
        trimite('insertFromComposition');
        setTimeout(() => { if (!compune && X.value) trimite('insertFromComposition'); }, 0);
      });
      /* O atingere oriunde (alt rând, panglica, „Verifică” din lecție) încheie întâi cuvântul aflat în compunere, ÎNAINTE ca
         aplicația să mute cursorul: caseta iese din focus, iar browserul încheie compunerea (compositionend → trimite; ordinea
         „mousedown → compositionend → blur”, critic runda 2). Atingerea în aplicație readuce focusul în document (I.la.jos).
         Plasă: dacă browserul nu încheie compunerea, biblioteca trimite ea textul casetei. Critic runda 2, GRAV N3. */
      I.incheieCompunerea = tinta => {
        if (!compune || tinta === X) return;
        try { X.blur(); } catch (e) { /* */ }
        if (compune) {
          compune = false;
          r.classList.remove('lh-ap-compune');
          latime();
          trimite('insertFromComposition');
        }
      };
      const laAtingere = e => {
        if (!r.isConnected) { W.removeEventListener('pointerdown', laAtingere, true); return; }
        I.incheieCompunerea(e.target);
      };
      W.addEventListener('pointerdown', laAtingere, true);
      X.addEventListener('beforeinput', e => {
        if (compune || e.isComposing) return;   // ștergerile din timpul compunerii sunt ale casetei, nu ale documentului
        if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') {
          e.preventDefault();
          const ina = st();
          const g = e.inputType === 'deleteContentBackward' ? 'tasta_backspace' : 'tasta_delete';
          const act = I.la && I.la.sterge ? I.la.sterge(g) : g;
          emite(I, g, act, I.zonaTinta, ina);
        }
      });
      X.addEventListener('input', e => {
        if (compune || e.isComposing) { latime(); return; }
        trimite(e.inputType);
      });
    }
    /* tastele de acces (KeyTips): gestul elevului e o TASTĂ (§4), nu un clic. Efectul clicului pe element, fără
       MouseEvent sintetic și fără detectorul de dublu clic de mai sus (critic runda 1, GRAV 5). */
    I.activeazaTasta = (el, tasta) => {
      const t = tintaDin(I, el), ina = st();
      I.ultimaActiune = null;
      const ev = { target: el, clientX: NaN, clientY: NaN, shiftKey: false, ctrlKey: false, metaKey: false, altKey: false,
        button: 0, detail: 0, tasta, preventDefault() {} };
      let act = null;
      if (I.la && I.la.clic) act = I.la.clic(t, ev, 1, 'tasta_acces');
      return emite(I, 'tasta_acces', act || I.ultimaActiune || 'tasta_acces', t, ina);
    };
    /* T4 (critic 13): Esc în modul tastelor de acces = gestul `tasta_esc` (api_biblioteca.md:172), acțiunea rămâne
       `iesire_taste_acces`; Alt apăsat a doua oară (keyup, tastaAcum = null) rămâne `tasta_acces`. O singură reparație pentru
       PowerPoint, Word și Excel (toate trei ies prin I.tastaFaraClic('iesire_taste_acces')). */
    I.tastaFaraClic = (actiune, el) => emite(I, actiune === 'iesire_taste_acces' && tastaAcum === 'Escape' ? 'tasta_esc' : 'tasta_acces',
      actiune, tintaDin(I, el || document.activeElement), st());

    /* ---- ferestrele (critic 13, GRAV T1), opt-in: doar aplicațiile care dau I.la.fereastra() -> elementul ferestrei deschise
       (azi PowerPoint). Word și Excel au deja Alt + literă în ferestre, cu codul lor (word.js:1957, excel.js:3246), și NU primesc
       cârligul: evenimentele lor rămân neschimbate.
       - Alt + litera subliniată = `tasta_acces` din referință de pe nod (date/<app>.json › `ta` = uia_<app>.json › tasta_acces,
         ex. dialog.FileOpen › File name „Alt+n”, Open „Alt+o”; Save your changes › Save „ALT+S”, Don't Save „ALT+n”): butonul se
         apasă ca la clic, câmpul primește focusul. Un eveniment pe tastă, felul `tasta_acces` (cel existent, ca în Word / Excel;
         api §4 nu are alt fel pentru Alt + literă în fereastră), ținta = comanda apăsată / câmpul; fără potrivire `fara_efect`.
       - Tab / Shift+Tab (I.tabFereastra, chemat de aplicație din la.tasta) trec prin controalele ferestrei și nu ies din ea
         (fereastra modală e capcană de focus: learn.microsoft.com/en-us/windows/win32/dlgbox/dlgbox-programming-considerations).
         Ordinea Tab nu e capturată: ordinea nodurilor din referință ([presupus] R14-1). */
    const APASA_F = new Set(['Button', 'SplitButton', 'CheckBox', 'RadioButton', 'MenuItem', 'TabItem']);
    const CAMP_F = new Set(['Edit', 'ComboBox', 'Spinner']);
    const tipF = x => x.getAttribute('data-lh-tip');
    const evFereastra = x => ({ target: x, clientX: NaN, clientY: NaN, shiftKey: false, ctrlKey: false, metaKey: false, altKey: false,
      button: 0, detail: 0, preventDefault() {} });
    function controaleFereastra(fer) {
      const toate = [...fer.querySelectorAll('[data-lh-tip]')].filter(x => {
        const t = tipF(x);
        if (!APASA_F.has(t) && !CAMP_F.has(t)) return false;
        if (x.closest('[data-lh-tip="TitleBar"]') || x.getAttribute('aria-disabled') === 'true' || !vizibil(x)) return false;
        if (!x.getAttribute('data-lh-eticheta')) return false;
        if (t === 'RadioButton') {
          const fr = [...x.parentElement.children].filter(y => tipF(y) === 'RadioButton');
          const ales = fr.find(y => y.getAttribute('aria-checked') === 'true' || y.classList.contains('lh-ap-bifat'));
          if (ales ? ales !== x : fr[0] !== x) return false;
        }
        return true;
      });
      /* o singură oprire pe control: copiii unui control (săgeata „Deschidere” a casetei, caseta Edit din ComboBox) nu se opresc */
      return toate.filter(x => !toate.some(y => y !== x && y.contains(x)));
    }
    function focusControl(x) {
      const i = x.querySelector('input');
      const t = i || x;
      if (t === x && !x.hasAttribute('tabindex')) x.setAttribute('tabindex', '-1');
      try { t.focus({ preventScroll: true }); if (i && !i.readOnly && i.select) i.select(); } catch (z) { /* */ }
    }
    I.tabFereastra = (fer, inapoi) => {
      const cs = fer ? controaleFereastra(fer) : [];
      if (!cs.length) return 'fara_efect';
      const a = document.activeElement;
      let i = cs.findIndex(x => x === a || x.contains(a));
      i = i < 0 ? (inapoi ? cs.length - 1 : 0) : (i + (inapoi ? -1 : 1) + cs.length) % cs.length;
      focusControl(cs[i]);
      return 'mutare_focus';
    };
    /* focusul la deschiderea unei ferestre fără caseta File name: primul câmp în ordinea de mai sus (Font: Latin text font) */
    I.focusInitialFereastra = fer => {
      const cs = fer ? controaleFereastra(fer) : [];
      const x = cs.find(c => CAMP_F.has(tipF(c))) || cs[0];
      if (x) focusControl(x);
      return !!x;
    };
    r.addEventListener('keydown', e => {
      const fer = I.la && I.la.fereastra ? I.la.fereastra() : null;
      if (!fer || !fer.isConnected || !e.altKey || e.ctrlKey || e.metaKey || !/^Key[A-Z]$/.test(e.code || '')) return;
      e.preventDefault();
      e.stopPropagation();
      const ina = st();
      const re = new RegExp('^alt\\+' + e.code.slice(3) + '$', 'i');
      const cand = [...fer.querySelectorAll('[data-lh-tip]')].filter(x => x.__nod && re.test(String(x.__nod.ta || '').replace(/\s+/g, '')) &&
        vizibil(x) && x.getAttribute('aria-disabled') !== 'true');
      const x = cand.find(c => APASA_F.has(tipF(c))) || cand.find(c => CAMP_F.has(tipF(c)));
      if (!x) { emite(I, 'tasta_acces', 'fara_efect', tintaDin(I, document.activeElement && r.contains(document.activeElement) ? document.activeElement : null), ina); return; }
      I.ultimaActiune = null;
      let act, t;
      if (APASA_F.has(tipF(x))) {
        const tx = x.hasAttribute('data-lh-tinta') ? x : (x.querySelector('[data-lh-tinta]') || x);
        t = tintaDin(I, tx);
        act = I.la && I.la.clic ? I.la.clic(t, evFereastra(tx), 1, 'tasta_acces') : null;
        if (fer.isConnected && fer.contains(tx)) focusControl(tx);
      } else {
        focusControl(x);
        t = tintaDin(I, x.querySelector('input') || x);
        act = 'focus_camp';
      }
      emite(I, 'tasta_acces', act || I.ultimaActiune || 'tasta_acces', t, ina);
    }, true);
  }

  /* ------------------------------------------------------------ asistarea (§6) */
  const aplicatiaDe = t => Object.keys(INST).find(n => viu(n) && L.element(n, t)) || null;
  L.ascunde = function () {
    document.querySelectorAll('[data-lh-indiciu]').forEach(x => x.remove());
    document.querySelectorAll('[data-lh-evidentiat]').forEach(x => x.removeAttribute('data-lh-evidentiat'));
  };
  L.evidentiaza = function (t, o) {
    const n = (o && o.aplicatie) || aplicatiaDe(t), e = n && L.element(n, t);
    if (!e) return null;
    document.querySelectorAll('[data-lh-evidentiat]').forEach(x => x.removeAttribute('data-lh-evidentiat'));
    e.setAttribute('data-lh-evidentiat', '');
    try { e.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (x) { /* */ }
    return e;
  };
  L.indiciu = function (t, text, o) {
    const n = (o && o.aplicatie) || aplicatiaDe(t), e = n && L.element(n, t);
    if (!e) return null;
    document.querySelectorAll('[data-lh-indiciu]').forEach(x => x.remove());
    const I = INST[n], R = I.root.getBoundingClientRect();
    try { e.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (x) { /* */ }
    const r = e.getBoundingClientRect();
    const b = document.createElement('div');
    b.className = 'lh-ap-indiciu';
    b.setAttribute('data-lh-indiciu', '');
    b.setAttribute('data-lh-pentru', t);
    b.setAttribute('role', 'status');
    b.textContent = text;
    b.style.visibility = 'hidden';
    I.root.appendChild(b);
    const bw = b.offsetWidth, bh = b.offsetHeight, vw = document.documentElement.clientWidth, vh = W.innerHeight;
    /* sub țintă (6 px), altfel deasupra; pe orizontală aliniat cu ținta, ținut în fereastră */
    let top = r.bottom + 6;
    if (top + bh > vh - 4 && r.top - 6 - bh >= 4) top = r.top - 6 - bh;
    let left = Math.min(Math.max(4, r.left), Math.max(4, vw - bw - 4));
    b.style.left = (left - R.left) + 'px';
    b.style.top = (top - R.top) + 'px';
    b.style.visibility = '';
    return b;
  };
  const NEGRESELI = new Set(['rotita', 'sageti', 'tasta_home_end', 'tasta_pagina']);
  /* tastele de acces care doar ARATĂ literele sau așteaptă a doua literă nu schimbă nimic (ca săgețile): nu sunt greșeli;
     activarea unei comenzi prin tastă rămâne greșeală dacă nu e ținta pasului */
  const NAVIGARE_TA = new Set(['arata_taste_acces', 'prefix_tasta_acces']);
  /* Runda 28 (critic 24, MINOR 4 / 5; critic 26, „Găsit pe drum”) — indiciul vine după greșeli adevărate, nu pe drumul bun:
     REFUZ = ce a spus aplicația când gestul n-a avut efectul cerut (comanda nesimulată, „… already exists”, numele cu semne
     interzise, Sort fără coloană): un astfel de eveniment nu face pasul, chiar dacă ținta lui e ținta pasului. Clicul pe un
     buton gri (`indisponibil`) face pasul ca înainte: O9 (înghețat) ia ca pas Bold-ul gri al PowerPoint-ului la pornire;
     EDITARE_CAMP = tastele pe care §4 le lasă câmpului de text (tastarea, Backspace / Delete, Ctrl+A/C/V/X/Z/Y): cu focusul
     într-un câmp al interfeței (File name, căutarea din Start, Name Box, adresa — nu documentul: `data-lh-intrare-document`)
     nu sunt greșeli. Un pas cu `asteapta` hotărăște singur, ca înainte. */
  const REFUZ = new Set(['nesimulat', 'nume_interzis', 'eroare_sortare']);
  const EDITARE_CAMP = new Set(['tastare', 'tasta_backspace', 'tasta_delete', 'ctrl_a', 'ctrl_c', 'ctrl_v', 'ctrl_x', 'ctrl_z', 'ctrl_y']);
  const aceeasiStare = ev => { try { return JSON.stringify(ev.inainte || null) === JSON.stringify(ev.dupa || {}); } catch (e) { return false; } };
  L.asistent = function (nume, cfg) {
    cfg = cfg || {};
    const pasi = cfg.pasi || [];
    const impl = setari().asistare || {};
    const dupaGreseli = cfg.dupaGreseli || impl.dupaGreseli || 2, dupaSecunde = cfg.dupaSecunde || impl.dupaSecunde || 30;
    let k = 0, gres = 0, ceas = 0, oprit = false;
    const pas = () => pasi[k];
    const root = () => { const I = INST[nume]; return I && I.root; };
    const opreste = () => {
      if (oprit) return;
      oprit = true;
      off();
      clearTimeout(ceas);
      W.removeEventListener('lh-pas', laPas);
      L.ascunde();
    };
    const desprins = () => { const r = root(); if (!r || !r.isConnected) { opreste(); return true; } return false; };
    const arata = () => {
      if (desprins()) return;
      const p = pas();
      if (!p) return;
      L.evidentiaza(p.tinta, { aplicatie: nume });
      L.indiciu(p.tinta, p.indiciu || 'Aici', { aplicatie: nume });
    };
    const porneste = () => { clearTimeout(ceas); if (!pas() || oprit) return; ceas = setTimeout(arata, dupaSecunde * 1000); };
    const canonPas = p => { const el = L.element(nume, p.tinta); return el ? canon(el) : null; };
    /* focusul e într-un câmp de text al interfeței: un câmp obișnuit (eCamp: File name, adresa, Name Box, redenumirea), sau
       câmpul ascuns care primește tastele pentru o casetă din afara zonei de lucru (caseta din Start: ținta = caseta, nu
       zona). Câmpul ascuns al DOCUMENTULUI (ținta în `[data-lh-zona]` sau `fereastra_app:`) nu e câmp: tastarea acolo
       schimbă documentul și rămâne greșeală dacă pasul nu e ea */
    const inCamp = ev => {
      const f = document.activeElement, r = root();
      if (!r || !f || !r.contains(f) || !f.matches('input,textarea,[contenteditable="true"]')) return false;
      if (eCamp(f)) return true;
      if (/^fereastra_app:/.test(ev.tinta || '')) return false;
      let t = null;
      try { t = L.element(nume, ev.tinta); } catch (e) { t = null; }
      return !!t && !t.closest('[data-lh-zona]');
    };
    const off = L.asculta(ev => {
      if (oprit || desprins()) return;
      const p = pas();
      if (!p || ev.aplicatie !== nume) return;
      let bun = false;
      /* Tab / Shift+Tab care doar mută focusul (`actiune: 'mutare_focus'`, §4: ținta = focusul din momentul tastei) nu apasă
         nimic: nu bifează pasul, nici când pleacă de PE ținta pasului (Tab peste Save ≠ Save), și nu e greșeală (§6.3).
         Critic 20, B (rc20.json › M6); runda 24 */
      const doarFocus = ev.actiune === 'mutare_focus';
      const refuz = REFUZ.has(ev.actiune);
      if (typeof p.asteapta === 'function') { try { bun = !!p.asteapta(ev); } catch (e) { bun = false; } }
      else bun = !doarFocus && !refuz && (ev.tinta === p.tinta || (!!canonPas(p) && ev.tinta === canonPas(p)) || (!!ev.activat && ev.activat === p.tinta));
      if (bun) { L.ascunde(); k++; gres = 0; porneste(); return; }
      /* T4 (critic 13): Esc care doar iese din modul tastelor de acces (tasta_esc / iesire_taste_acces) nu schimbă nimic,
         ca navigarea: nu e greșeală */
      if (doarFocus || NEGRESELI.has(ev.gest) || (ev.gest === 'tasta_acces' && NAVIGARE_TA.has(ev.actiune)) ||
        (ev.gest === 'tasta_esc' && ev.actiune === 'iesire_taste_acces')) return;
      /* runda 28: Alt+↓ / Alt+↑ care doar deschide sau închide lista unei casete (starea nu se schimbă) e navigare, ca săgețile;
         Alt+săgeată care schimbă starea (Explorer: Alt+↑ / Alt+← mută folderul) rămâne greșeală */
      if (ev.gest === 'alt_sageti' && aceeasiStare(ev)) return;
      if (EDITARE_CAMP.has(ev.gest) && inCamp(ev)) return;
      gres++;
      if (gres >= dupaGreseli) arata();
    });
    const laPas = () => { gres = 0; porneste(); };
    W.addEventListener('lh-pas', laPas);
    porneste();
    return { opreste, pas: () => k };
  };

  /* ------------------------------------------------------------ tipul comun pentru motorul lecțiilor (§8.1) */
  L.tipMotor = {
    /* Q = {t:'aplicatie', aplicatie, continut, profil?, sarcina:{cerinte:[{ce, verifica: stare => bool}]}, asistent?} */
    render(Q, body, api) {
      body.innerHTML = '';
      const P = (W.LH && W.LH.aplicatii) || W.LHAplicatii || L;
      const opt = { loc: body, continut: Q.continut || {}, profil: Q.profil, focus: true };
      if (Q.asistent) opt.asistent = Q.asistent;
      let inst = null;
      const gata = P.deschide(Q.aplicatie, opt).then(x => { inst = x; return x; });
      const verifica = () => {
        const s = inst ? inst.stare() : null;
        const cer = ((Q.sarcina || {}).cerinte) || [];
        const rez = cer.map(c => { try { return !!c.verifica(s); } catch (e) { return false; } });
        return { ok: rez.length > 0 && rez.every(Boolean), rez };
      };
      /* „Verifică” al motorului: verdictul vine din STAREA aplicației (glosar: „verificăm” = interogarea stării) */
      if (api && typeof api.checkButton === 'function') {
        api.checkButton(() => {
          const v = verifica();
          const gres = ((Q.sarcina || {}).cerinte || []).filter((c, k) => !v.rez[k]).map(c => c.ce).filter(Boolean);
          if (api.resolve) api.resolve(v.ok, v.ok ? undefined : (gres.length ? 'Încă nu: ' + gres.join('; ') + '.' : 'Mai încearcă.'));
          return v.ok;
        }, 'Verifică');
      }
      body.__lhAplicatie = { gata, verifica, instanta: () => inst };
      return body.__lhAplicatie;
    },
    /* pentru test_joc / oracol_sarcini (§8.1): Q.rezolvare(instanta) / Q.gresit(instanta) fac gesturile soluției, respectiv
       ale unei greșeli, prin API-ul instanței; aici doar se cheamă, după ce aplicația e gata */
    rezolva(Q, body) {
      const x = body && body.__lhAplicatie;
      if (!x || typeof (Q && Q.rezolvare) !== 'function') return null;
      return x.gata.then(inst => Q.rezolvare(inst));
    },
    gresit(Q, body) {
      const x = body && body.__lhAplicatie;
      if (!x || typeof (Q && Q.gresit) !== 'function') return null;
      return x.gata.then(inst => Q.gresit(inst));
    }
  };

  W.LH = W.LH || {};
  W.LH.aplicatii = L;
  W.LHAplicatii = L;
})();
