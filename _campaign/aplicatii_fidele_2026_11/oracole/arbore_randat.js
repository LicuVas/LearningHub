/* arbore_randat.js — extractorul injectat în pagină de oracolele de structură (O1, O2, O3, O7, O8). Etapa 0, 16.11.2026.
   Citește arborele de interfață RANDAT al unei aplicații simulate, în formatul referinței (referinte/uia_*.json):
   nod = {tip, eticheta, cand[], id_mso, rect[x,y,l,h] față de rădăcină, nesim, copii[]}.
   Două moduri:
   - „conventie”: biblioteca centrală, marcată după oracole/CONVENTIE_ARBORE.md (data-lh-aplicatie / data-lh-suprafata /
     data-lh-tip / data-lh-eticheta / data-lh-id-mso / data-lh-nesimulat). O rădăcină [data-lh-aplicatie] contează DOAR
     dacă biblioteca a creat-o: e în LH.aplicatii.radacini() și pagina încarcă aplicatii/aplicatii.js (reparația 8);
     una pusă de lecție e interfață desenată în pagină (O1);
   Fiecare nod randat poartă și „text_vizibil” (rândurile de text văzute pe ecran) și „declarata” (data-lh-eticheta):
   O2/O3 compară TEXTUL VIZIBIL, iar o etichetă declarată care nu e pe ecran e o diferență în sine (reparația 9);
   - „vechi”: simulatoarele vechi din lectii/_sim și jocuri, citite după roluri ARIA și câteva clase (rândul filelor
     [role=tablist], grupurile [role=group][aria-label] de sub el, bara de stare, Acces rapid, bara de titlu, ferestrele
     [role=dialog]). Ce nu se recunoaște lipsește — și se numără ca lipsă de oracole, nu ca potrivire.
   Nu modifică pagina, în afară de atributele de lucru data-lho-* (puse pe elementele pe care oracolul le apasă). */
(function () {
  'use strict';
  if (window.__LHO) return;
  const UNIT = 'button,select,input:not([type=hidden]),textarea,a[href],[role=button],[role=menuitem],[role=menuitemcheckbox],' +
    '[role=menuitemradio],[role=tab],[role=option],[role=checkbox],[role=radio],[role=slider],[role=combobox],[role=link],' +
    '[role=treeitem],[role=spinbutton],[role=textbox],[role=switch],[data-nesim]';
  const APP_UI = '[role=tablist],[role=tab],[role=toolbar],[role=menubar],[role=menu],[role=menuitem],[role=group][aria-label],' +
    '[role=dialog],[role=tree],[role=treeitem],[role=grid],[role=application]';
  /* într-un exercițiu SIMULAT, #body conține doar simulatorul (butoanele motorului — Verifică, pașii — stau în afara lui):
     orice control interactiv de acolo care nu e sub rădăcina bibliotecii e interfață de aplicație desenată în afara ei */
  const INTERACTIV = 'button,input:not([type=hidden]),select,textarea,[role=button],[contenteditable=""],[contenteditable=true],' +
    '[tabindex]:not([tabindex="-1"])';

  function vis(e) {
    if (!e || !e.getClientRects || !e.getClientRects().length) return false;
    const c = getComputedStyle(e);
    if (c.visibility === 'hidden' || c.display === 'none') return false;
    const r = e.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }
  function rect(e, R) {
    const r = e.getBoundingClientRect(), q = R.getBoundingClientRect();
    return [Math.round(r.left - q.left), Math.round(r.top - q.top), Math.round(r.width), Math.round(r.height)];
  }
  function txt(e) { return (e.innerText || e.textContent || '').replace(/\s+/g, ' ').trim(); }

  /* ---------------- textul VIZIBIL (reparația 9): ce citește elevul pe ecran, nu ce declară un atribut ----------------
     Rândurile = textul nodurilor-text grupat pe blocul lor (cel mai apropiat strămoș care nu e „inline”), doar dacă se
     vede: elementul și strămoșii lui (până la e) au mărime, opacitate > 0, nu sunt tăiați la 1-3 px (tiparul sr-only),
     n-au clip, fontul ≥ 6 px, culoarea nu e transparentă și nu stau în afara paginii (stânga/sus). propriu=true: doar
     textul care nu e într-un nod [data-lh-tip] copil (numele unui grup, nu comenzile lui). */
  function ascuns(a) {
    const c = getComputedStyle(a);
    if (c.display === 'none' || c.visibility === 'hidden' || c.visibility === 'collapse' || parseFloat(c.opacity) === 0) return true;
    const r = a.getBoundingClientRect();
    if ((r.width < 4 || r.height < 4) && c.overflow !== 'visible') return true;
    if (c.clip && c.clip !== 'auto' && /absolute|fixed/.test(c.position)) return true;
    if (c.clipPath && c.clipPath !== 'none' && (r.width < 4 || r.height < 4 || /inset\(\s*50%|circle\(\s*0/.test(c.clipPath))) return true;
    if (r.right < 0 || r.bottom < 0) return true;
    return false;
  }
  function textSeVede(p, e) {
    if (!p.getClientRects().length) return false;
    const c = getComputedStyle(p);
    if (parseFloat(c.fontSize) < 6 || /^transparent$|rgba\([^)]*,\s*0\)$/.test(c.color)) return false;
    const stop = e.parentElement;
    for (let a = p; a && a !== stop; a = a.parentElement) if (ascuns(a)) return false;
    return true;
  }
  function blocDe(n, e) {
    for (let p = n.parentElement; p && p !== e; p = p.parentElement) {
      const d = getComputedStyle(p).display;
      if (!/^inline/.test(d) && d !== 'contents') return p;
    }
    return e;
  }
  /* faraSel (reverificare_etapa0.md 6.a): textul din elementele care se potrivesc cu faraSel (sub e) nu se citește —
     legenda unui grup vechi fără .pg-nume = textul grupului care nu e într-o comandă */
  function liniiVizibile(e, propriu, faraSel) {
    const bl = new Map(), ord = [];
    const tw = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
    for (let n = tw.nextNode(); n; n = tw.nextNode()) {
      const s = n.nodeValue;
      if (!s || !s.trim()) continue;
      const p = n.parentElement;
      if (!p || p.closest('script,style,template,noscript')) continue;
      if (propriu) { const t = p.closest('[data-lh-tip]'); if (t && t !== e) continue; }
      if (faraSel) { const u = p.closest(faraSel); if (u && u !== e && e.contains(u)) continue; }
      if (!textSeVede(p, e)) continue;
      const b = blocDe(n, e);
      if (!bl.has(b)) { bl.set(b, []); ord.push(b); }
      bl.get(b).push(s);
    }
    return ord.map(b => bl.get(b).join(' ').replace(/\s+/g, ' ').trim()).filter(x => x).slice(0, 12);
  }
  /* controalele care arată o VALOARE, nu numele lor (caseta fontului „Calibri”, mărimea „11”): numele rămâne cel declarat */
  function eValoare(e, tip) {
    return /^(INPUT|SELECT|TEXTAREA)$/.test(e.tagName) || /^(ComboBox|Edit|Spinner|Slider)$/.test(tip || '');
  }
  function variante(s) {
    const out = [];
    if (s == null) return out;
    s = String(s).replace(/\s+/g, ' ').trim();
    if (!s) return out;
    const add = x => { x = (x || '').trim(); if (x && out.indexOf(x) < 0) out.push(x); };
    add(s);
    const parti = s.split(/\s+·\s+/);
    parti.forEach(add);
    const p = parti[0];
    const c = p.split(/:\s/)[0];
    add(c);
    [p, c].forEach(z => { const m = z.match(/^(.*?)\s*\(([^()]*)\)\s*$/); if (m) { add(m[1]); add(m[2]); } });
    return out.slice(0, 12);
  }
  function cand(e) {
    const L = [];
    const push = a => variante(a).forEach(x => { if (L.indexOf(x) < 0) L.push(x); });
    if (e.hasAttribute && e.hasAttribute('data-lh-eticheta')) { push(e.getAttribute('data-lh-eticheta')); return L; }
    push(e.getAttribute('aria-label'));
    push(e.getAttribute('title'));
    push(e.getAttribute('data-n'));
    push(e.getAttribute('data-nume'));
    if (e.tagName !== 'SELECT') { const t = txt(e); if (t && t.length <= 80) push(t); }
    if (e.tagName === 'INPUT' && (e.type === 'button' || e.type === 'submit')) push(e.value);
    /* data-nesim: când arată ca un idMso (FontDialog, Strikethrough) e IDENTIFICATORUL (îl ia idVechi), nu eticheta afișată —
       intră ca etichetă doar dacă elementul n-are alt nume, ori dacă e scris ca nume („Hide Folders”, „galerie:Normal”) */
    const ns = e.getAttribute('data-nesim');
    if (ns && ns !== '1') {
      const v = /^galerie:/.test(ns) ? ns.slice(8) : ns;
      if (!L.length || !/^[A-Z][A-Za-z0-9]+$/.test(v)) push(v);
    }
    return L;
  }
  function nesimVechi(e) {
    for (const a of e.attributes) { if (/nesim/i.test(a.name) || /(^|[-:])nesim/i.test(a.value)) return true; }
    return /\bpg-nesim\b/.test(typeof e.className === 'string' ? e.className : '');
  }
  function tipVechi(e) {
    const r = (e.getAttribute('role') || '').toLowerCase(), t = e.tagName;
    if (r === 'tab') return 'TabItem';
    if (/^menuitem/.test(r)) return 'MenuItem';
    if (t === 'SELECT' || r === 'combobox' || (e.querySelector && e.querySelector('.pg-cb'))) return 'ComboBox';
    if (r === 'checkbox' || r === 'switch' || (t === 'INPUT' && e.type === 'checkbox')) return 'CheckBox';
    if (r === 'radio' || (t === 'INPUT' && e.type === 'radio')) return 'RadioButton';
    if (r === 'slider' || (t === 'INPUT' && e.type === 'range')) return 'Slider';
    if (t === 'INPUT' || t === 'TEXTAREA' || r === 'textbox' || r === 'spinbutton') return 'Edit';
    if (r === 'option' || r === 'treeitem') return 'ListItem';
    if (r === 'link' || t === 'A') return 'Hyperlink';
    if (e.hasAttribute('aria-haspopup') || e.hasAttribute('aria-expanded') || /▾|▼/.test(e.textContent || '') ||
        (e.querySelector && e.querySelector('.pg-sag'))) return 'Dropdown';
    return 'Button';
  }
  function idVechi(e) {
    const v = e.getAttribute('data-nesim');
    return v && /^[A-Z][A-Za-z0-9]+$/.test(v) ? v : null;
  }
  function nodUnit(e, R) {
    const c = cand(e), tip = tipVechi(e);
    return { tip, eticheta: c[0] || '', cand: c, id_mso: idVechi(e), rect: rect(e, R), nesim: nesimVechi(e), copii: [],
      text_vizibil: liniiVizibile(e, false), valoare: eValoare(e, tip),
      declarata: e.hasAttribute('data-lh-eticheta') ? e.getAttribute('data-lh-eticheta') : null };
  }
  /* unitățile din containerul C (cele mai din afară: un buton dintr-un element de meniu nu se numără de două ori) */
  function unitati(C, R, filtru) {
    const out = [];
    C.querySelectorAll(UNIT).forEach(e => {
      if (!vis(e)) return;
      const p = e.parentElement && e.parentElement.closest(UNIT);
      if (p && C.contains(p)) return;
      if (filtru && !filtru(e)) return;
      out.push(e);
    });
    return out;
  }
  /* frunzele de text (bara de stare, bara de titlu, ferestre): text vizibil care nu e într-o unitate */
  function frunzeText(C, R) {
    const out = [];
    const tw = document.createTreeWalker(C, NodeFilter.SHOW_ELEMENT);
    let e = tw.currentNode;
    while (e) {
      if (e !== C && vis(e) && !e.closest(UNIT) && !e.querySelector(UNIT)) {
        const kids = [...e.children].filter(vis);
        const t = txt(e);
        if (!kids.length && t && t.length <= 80) out.push(e);
      }
      e = tw.nextNode();
    }
    return out;
  }
  function inOrdine(a) { return a.sort((x, y) => (x.compareDocumentPosition(y) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1); }
  function nodContainer(C, R, tip, eticheta, cuText) {
    const els = unitati(C, R);
    const all = cuText ? inOrdine(els.concat(frunzeText(C, R))) : els;
    return {
      tip, eticheta, rect: rect(C, R), copii: all.map(e => {
        if (els.indexOf(e) >= 0) return nodUnit(e, R);
        return { tip: 'Text', eticheta: txt(e), cand: [txt(e)], id_mso: null, rect: rect(e, R), nesim: false, copii: [],
          text_vizibil: liniiVizibile(e, false), valoare: false, declarata: null };
      })
    };
  }

  /* ------------------------------------------------------------------ rădăcina */
  /* rădăcinile ÎNREGISTRATE (reparația 8): doar elementele pe care biblioteca spune că le-a creat
     (LH.aplicatii.radacini(), api_biblioteca.md §1), și doar dacă pagina încarcă aplicatii/aplicatii.js. Un
     [data-lh-aplicatie] pus de lecție (neînregistrat) NU e rădăcină: e interfață desenată în pagină (O1 îl numără). */
  function bibliotecaIncarcata() {
    return [...document.scripts].some(s => /(^|\/)aplicatii\/aplicatii\.js([?#]|$)/.test(s.src || ''));
  }
  function radaciniInregistrate() {
    if (!bibliotecaIncarcata()) return [];
    try {
      const A = (window.LH && window.LH.aplicatii) || window.LHAplicatii;
      if (!A || typeof A.radacini !== 'function') return [];
      const l = A.radacini();
      if (!l || typeof l.length !== 'number') return [];
      return [...l].filter(e => e instanceof Element && e.isConnected && e.hasAttribute('data-lh-aplicatie'));
    } catch (e) { return []; }
  }
  function radaciniNeinregistrate() {
    const reg = radaciniInregistrate();
    return [...document.querySelectorAll('[data-lh-aplicatie]')].filter(e => reg.indexOf(e) < 0);
  }
  function radacinaBiblioteca(app) {
    const rs = radaciniInregistrate().filter(vis);
    if (!rs.length) return null;
    return rs.find(r => r.getAttribute('data-lh-aplicatie') === app) || rs[0];
  }
  function radacina(app) {
    return radacinaBiblioteca(app) || document.getElementById('body') || document.body;
  }

  /* ------------------------------------------------------------------ modul „conventie” */
  const TIP_CONTAINER = /^(Group|Pane|List|Menu|ToolBar|StatusBar|TitleBar|Window|Tab|DataGrid|Document|Custom|Table|Tree)$/;
  function arboreConv(S, R) {
    const root = { tip: S.getAttribute('data-lh-tip') || 'Pane', eticheta: S.getAttribute('data-lh-eticheta') || '', cand: [],
      id_mso: S.getAttribute('data-lh-id-mso'), rect: rect(S, R), nesim: false, copii: [] };
    const harta = new Map([[S, root]]);
    S.querySelectorAll('[data-lh-tip]').forEach(e => {
      if (e.closest('[data-lh-suprafata]') !== S) return;
      if (!vis(e)) return;
      let p = e.parentElement;
      while (p && p !== S && !harta.has(p)) p = p.parentElement;
      const parinte = harta.get(p) || root;
      const tip = e.getAttribute('data-lh-tip');
      const et = e.hasAttribute('data-lh-eticheta') ? e.getAttribute('data-lh-eticheta') : (e.getAttribute('aria-label') || txt(e));
      /* textul vizibil: la comenzi tot textul lor; la containere (grupul Font) doar textul propriu (numele grupului) */
      const n = { tip, eticheta: et, cand: [et], id_mso: e.getAttribute('data-lh-id-mso'),
        rect: rect(e, R), nesim: e.hasAttribute('data-lh-nesimulat'), copii: [],
        text_vizibil: liniiVizibile(e, TIP_CONTAINER.test(tip || '')), valoare: eValoare(e, tip),
        declarata: e.hasAttribute('data-lh-eticheta') ? e.getAttribute('data-lh-eticheta') : null };
      parinte.copii.push(n);
      harta.set(e, n);
    });
    return root;
  }
  function extrageConv(R) {
    const s = {};
    R.querySelectorAll('[data-lh-suprafata]').forEach(S => {
      if (!vis(S)) return;
      s[S.getAttribute('data-lh-suprafata')] = arboreConv(S, R);
    });
    return s;
  }

  /* ------------------------------------------------------------------ modul „vechi” */
  function normJS(s) {
    return String(s || '').replace(/[‐‑–]/g, '-').replace(/\s+/g, ' ').trim()
      .replace(/^¶\s*/, '').replace(/(\.\.\.|…|▾|▼|:)+\s*$/, '').trim().toLowerCase();
  }
  function tabsDin(tl) {
    let t = [...tl.querySelectorAll('[role=tab]')].filter(vis);
    if (!t.length) t = [...tl.querySelectorAll('[data-tab],[data-t^="tab-"]')].filter(vis);
    return t;
  }
  function randFile(R, refTabs) {
    const ref = (refTabs || []).map(normJS);
    let tls = [...R.querySelectorAll('[role=tablist]')].filter(vis);
    if (!tls.length) {
      const b = [...R.querySelectorAll('[data-tab],[data-t^="tab-"]')].filter(vis);
      if (b.length >= 2) tls = [b[0].parentElement];
    }
    let best = null, bs = -1;
    for (const tl of tls) {
      const tabs = tabsDin(tl);
      if (tabs.length < 2) continue;
      let s = 0;
      tabs.forEach(t => { if (cand(t).some(c => ref.indexOf(normJS(c)) >= 0)) s++; });
      if (s > bs) { bs = s; best = tl; }
    }
    return best && bs > 0 ? best : (ref.length ? null : best);
  }
  function fisierVechi(tl) {
    if (!tl) return null;
    const zona = tl.parentElement || tl;
    return [...zona.querySelectorAll('*')].find(e => vis(e) && !e.children.length && /^(File|Fișier|Fişier)$/i.test(txt(e)) &&
      !e.closest('[role=tab]')) || null;
  }
  function extrageVechi(R, o) {
    const s = {};
    const Rr = R.getBoundingClientRect();
    const tl = randFile(R, o.refTabs);
    let activ = null;
    if (tl) {
      const tabs = tabsDin(tl);
      const f = fisierVechi(tl);
      const copii = [];
      if (f) copii.push({ tip: f.tagName === 'BUTTON' ? 'Button' : 'Text', eticheta: 'File', cand: ['File', txt(f)], id_mso: 'FileTabButton',
        rect: rect(f, R), nesim: f.tagName !== 'BUTTON' && !f.closest('button'), copii: [],
        text_vizibil: liniiVizibile(f, false), valoare: false, declarata: null });
      tabs.forEach(t => {
        const n = nodUnit(t, R); copii.push(n);      // tipul rămâne cel din DOM: o filă desenată ca buton simplu NU e TabItem
        if (t.getAttribute('aria-selected') === 'true' || /\bon\b|\bactiv/.test(t.className || '')) activ = activ || t;
      });
      s['file_panglicii'] = { tip: 'Tab', eticheta: 'rândul filelor', cand: [], id_mso: null, rect: rect(tl, R), nesim: false, copii };
      const tb = tl.getBoundingClientRect();
      const grupuri = [...R.querySelectorAll('[role=group][aria-label],.pg-grup')].filter(g => {
        if (!vis(g) || g.closest('[role=dialog],[role=menu]')) return false;
        if (g.parentElement && g.parentElement.closest('[role=group][aria-label],.pg-grup')) return false;
        const r = g.getBoundingClientRect();
        return r.top >= tb.bottom - 4 && r.top <= tb.bottom + 60;
      });
      if (activ) {
        const ca = cand(activ);
        const banda = grupuri.map(g => {
          const cap = g.querySelector('.pg-nume');
          const nume = g.getAttribute('aria-label') || txt(cap || g).slice(0, 40);
          const n = nodContainer(g, R, 'Group', nume, false);
          n.cand = [nume];
          /* numele VIZIBIL al grupului = legenda de sub el (.pg-nume); fără legendă rămâne aria-label (ca înainte) */
          n.text_vizibil = cap ? liniiVizibile(cap, false) : [];
          /* reverificare_etapa0.md 6.a: LEGENDA văzută — .pg-nume, altfel textul grupului care nu e într-o comandă
             (alt simulator, altă clasă). Niciun rând vizibil = grup fără legendă (în Office numele grupului se vede
             mereu sub el); structura_lib.py o numără (grup_fara_legenda), oricât de corect ar fi aria-label */
          n.legenda = cap ? n.text_vizibil : liniiVizibile(g, false, UNIT);
          n.valoare = false;
          n.declarata = null;
          return n;
        });
        const sus = grupuri.length ? grupuri[0].parentElement : tl;
        s['panglica?' + (ca[0] || '')] = { tip: 'Pane', eticheta: 'Lower Ribbon', cand: ca, id_mso: null,
          rect: grupuri.length ? rect(sus, R) : [0, 0, 0, 0], nesim: false,
          copii: [{ tip: 'Group', eticheta: ca[0] || '', cand: ca, id_mso: null, rect: grupuri.length ? rect(sus, R) : [0, 0, 0, 0], nesim: false, copii: banda }] };
      }
    }
    const larg = e => { const r = e.getBoundingClientRect(); return r.width >= 0.4 * Rr.width; };
    const clsRe = re => e => typeof e.className === 'string' && re.test(e.className);
    // bara de stare: jos, lată, joasă
    const stari = [...R.querySelectorAll('[role=status],[class]')].filter(e => {
      if (!(e.getAttribute('role') === 'status' || clsRe(/(^|[-_ ])(stare|status|statusbar)([-_ ]|$)/i)(e)) || !vis(e)) return false;
      const r = e.getBoundingClientRect();
      return larg(e) && r.height <= 60 && (r.top - Rr.top) >= 0.5 * Rr.height;
    });
    if (stari.length) {
      const sb = stari.sort((a, b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top)[0];
      s['bara_stare'] = nodContainer(sb, R, 'StatusBar', 'Status Bar', true);
    }
    const qat = [...R.querySelectorAll('[aria-label],[class]')].find(e =>
      (/quick access|acces rapid/i.test(e.getAttribute('aria-label') || '') || clsRe(/(^|[-_ ])qat([-_ ]|$)/i)(e)) && vis(e));
    if (qat) s['acces_rapid'] = nodContainer(qat, R, 'ToolBar', 'Quick Access Toolbar', false);
    const tit = [...R.querySelectorAll('[class]')].find(e => {
      if (!clsRe(/(^|[-_ ])(titlu|title|titlebar|tb)([-_ ]|$)/i)(e) || !vis(e)) return false;
      const r = e.getBoundingClientRect();
      return larg(e) && (r.top - Rr.top) <= 0.15 * Rr.height + 5 && r.height <= 80;
    });
    if (tit) s['bara_titlu'] = nodContainer(tit, R, 'TitleBar', 'bara de titlu', true);
    [...document.querySelectorAll('[role=dialog]')].filter(vis).forEach(d => {
      if (!R.contains(d) && !d.closest('#body')) { if (!o.dialogeGlobale) return; }
      const nume = d.getAttribute('aria-label') || txt(d.querySelector('h1,h2,h3,[class*=tit]') || d).slice(0, 60);
      s['dialog?' + nume] = nodContainer(d, R, 'Window', nume, true);
    });
    [...R.querySelectorAll('[role=menu]')].filter(vis).forEach((m, i) => {
      const nume = m.getAttribute('aria-label') || ('#' + i);
      s['meniu?' + nume] = nodContainer(m, R, 'Menu', nume, false);
    });
    [...R.querySelectorAll('[class*=backstage],[aria-label*=Backstage],[role=navigation]')].filter(vis).slice(0, 1).forEach(b => {
      s['backstage?nav'] = nodContainer(b, R, 'List', 'File', false);
    });
    return s;
  }

  /* ------------------------------------------------------------------ interfață de aplicație în afara bibliotecii (O1) */
  function descr(e) {
    const c = typeof e.className === 'string' ? e.className.split(/\s+/).slice(0, 2).join('.') : '';
    return e.tagName.toLowerCase() + (e.getAttribute('role') ? '[role=' + e.getAttribute('role') + ']' : '') + (c ? '.' + c : '') +
      (e.getAttribute('aria-label') ? ' „' + e.getAttribute('aria-label').slice(0, 30) + '”' : '');
  }
  function uiInAfara() {
    const B = document.getElementById('body');
    const reg = radaciniInregistrate();
    const sub = e => reg.some(r => r === e || r.contains(e));
    const vazut = new Set(), m = [];
    const ia = (e, eticheta) => {
      if (vazut.has(e) || sub(e) || !vis(e)) return;
      vazut.add(e);
      if (m.length < 8) m.push((eticheta || '') + descr(e));
    };
    /* o rădăcină [data-lh-aplicatie] pe care biblioteca n-a creat-o = interfață desenată de lecție (reparația 8) */
    radaciniNeinregistrate().forEach(e => ia(e, 'rădăcină neînregistrată în LH.aplicatii.radacini(): '));
    document.querySelectorAll('[data-nesim],.pg,.rb').forEach(e => ia(e));
    if (B) B.querySelectorAll(APP_UI + ',canvas,' + INTERACTIV).forEach(e => ia(e));
    return { n: vazut.size, mostre: m };
  }

  /* ---------------- starea observabilă pentru O8 (reparația 7b) ----------------
     „s” = amprenta STRUCTURII: DOM-ul aplicației fără blocurile-mesaj + ferestrele de dialog; „v” = valorile câmpurilor;
     „m” = textele mesajelor vizibile din pagină; „n” = cele dintre ele care spun „aici nu e simulată” (atributul
     data-lh-nesimulat pe un element care nu e comandă, sau un tipar de text din o.tipare — lista e în structura_lib.py).
     Un bloc-mesaj = o zonă de mesaje (role=status/alert/tooltip, aria-live, .toast, #fb, [data-lh-mesaj], clasă
     msg/mesaj/nota/toast/hint/info/fb/sfat/spune) FĂRĂ controale în ea și cu cel mult 600 de caractere, sau cel mai mic
     element al cărui text propriu se potrivește cu un tipar (urcat prin învelișurile care au același text). */
  const SEL_ZONA = '[role=alert],[role=status],[aria-live],[role=tooltip],.toast,#fb,[data-lh-mesaj],[data-lh-nesimulat]';
  const CLS_ZONA = /(^|[-_ ])(msg|mesaj|mes|nota|toast|hint|info|fb|feedback|sfat|spune|alerta)([-_ ]|$)/i;
  const CLS_GOL = /msg|mesaj|nota|toast|hint|info|feedback|sfat|spune|alerta|status/i;
  function clasa(e) { return typeof e.className === 'string' ? e.className : ''; }
  function eZona(e, R) {
    if (e.hasAttribute('data-lh-nesimulat') && e.hasAttribute('data-lh-tip')) return false;   // marcajul unei COMENZI
    if (!(e.matches(SEL_ZONA) || CLS_ZONA.test(clasa(e)))) return false;
    if (!R.contains(e)) return true;        // în afara aplicației (ex. #fb al motorului): doar mesaj, structura n-o atinge
    if (e.matches(UNIT) || e.querySelector(UNIT)) return false;
    return (e.textContent || '').replace(/\s+/g, ' ').trim().length <= 600;
  }
  function stareO8(o) {
    o = o || {};
    const R = radacina(o.app);
    const tipare = (o.tipare || []).map(s => { try { return new RegExp(s, 'i'); } catch (e) { return null; } }).filter(Boolean);
    const potriveste = t => tipare.some(r => r.test(t));
    const opreste = x => !x || x === R || x === document.body || x === document.documentElement || x.id === 'body' || x.id === 'app';
    const blocuri = [];
    const B = document.body;
    if (B) {
      for (const e of B.querySelectorAll('*')) {
        if (/^(SCRIPT|STYLE|TEMPLATE|NOSCRIPT)$/.test(e.tagName)) continue;
        let bloc = null;
        if (eZona(e, R)) bloc = e;
        else {
          let own = '';
          for (const c of e.childNodes) if (c.nodeType === 3) own += c.nodeValue;
          own = own.replace(/\s+/g, ' ').trim();
          if (own && potriveste(own) && !e.matches(UNIT)) {
            bloc = e;
            const t0 = (e.textContent || '').replace(/\s+/g, ' ').trim().length;
            while (!opreste(bloc.parentElement) && !bloc.parentElement.querySelector(UNIT) &&
                   (bloc.parentElement.textContent || '').replace(/\s+/g, ' ').trim().length <= t0 + 3)
              bloc = bloc.parentElement;
          }
        }
        if (bloc && blocuri.indexOf(bloc) < 0) blocuri.push(bloc);
      }
    }
    /* blocurile se scot din amprenta structurii fie că se văd, fie că nu (un mesaj ascuns care apare nu e „efect”);
       textele intră în „m”/„n” doar dacă se văd */
    const exterior = blocuri.filter(b => !blocuri.some(a => a !== b && a.contains(b)));
    const m = [], n = [];
    exterior.forEach(b => {
      if (!vis(b)) return;
      const t = txt(b);
      if (!t) return;
      m.push(t);
      const marcat = (b.hasAttribute('data-lh-nesimulat') && !b.hasAttribute('data-lh-tip')) ||
        !!b.querySelector('[data-lh-nesimulat]:not([data-lh-tip])');
      if (marcat || potriveste(t)) n.push(t);
    });
    exterior.forEach(b => b.setAttribute('data-lho-msg', '1'));
    let html;
    try {
      const cl = R.cloneNode(true);
      cl.querySelectorAll('[data-lho-msg]').forEach(x => x.remove());
      /* învelișurile-mesaj rămase goale (sau care încă nu există înainte de clic) nu sunt „efect” */
      [...cl.querySelectorAll('*')].reverse().forEach(x => {
        if (!x.children.length && !(x.textContent || '').trim() && (CLS_GOL.test(clasa(x)) || x.matches(SEL_ZONA))) x.remove();
      });
      html = (R.hasAttribute && R.hasAttribute('data-lho-msg')) ? '' : cl.outerHTML.replace(/\sdata-lho-[a-z]+="[^"]*"/g, '');
    } finally {
      exterior.forEach(b => b.removeAttribute('data-lho-msg'));
    }
    const vals = [...R.querySelectorAll('input,select,textarea')].map(e => (e.type === 'checkbox' || e.type === 'radio') ? String(e.checked) : String(e.value)).join('\u0001');
    const dlg = [...document.querySelectorAll('[role=dialog]')];
    const dlgVis = dlg.filter(vis).map(d => txt(d).slice(0, 400)).join('\u0003');
    /* ferestrele-meniu deschise de simulator ÎN AFARA rădăcinii (ex. excelx: meniul „Clear ▾” e pus în document.body)
       sunt tot efect de structură: altfel o comandă care deschide un meniu acolo ar părea moartă */
    const pop = [...document.querySelectorAll('[role=menu],[role=listbox],[role=menubar]')]
      .filter(e => !R.contains(e) && vis(e))
      .map(e => e.outerHTML.replace(/\sdata-lho-[a-z]+="[^"]*"/g, '')).join('\u0004');
    return { s: hash(html) + ':' + dlg.length + ':' + hash(dlgVis) + ':' + hash(pop), v: hash(vals), m, n };
  }

  /* ------------------------------------------------------------------ API pentru oracole */
  function modul(app) { return radacinaBiblioteca(app) ? 'conventie' : (document.getElementById('body') ? 'vechi' : 'nimic'); }
  function curata(attr) { document.querySelectorAll('[' + attr + ']').forEach(e => e.removeAttribute(attr)); }
  function fileElem(app, refTabs) {
    const R = radacina(app);
    if (modul(app) === 'conventie') {
      const fp = R.querySelector('[data-lh-suprafata="file_panglicii"]');
      return fp ? [...fp.querySelectorAll('[data-lh-tip="TabItem"]')].filter(vis) : [];
    }
    const tl = randFile(R, refTabs);
    return tl ? tabsDin(tl) : [];
  }
  const TIPURI_UNITATE = new Set(['Button', 'SplitButton', 'MenuItem', 'ComboBox', 'CheckBox', 'RadioButton', 'Edit', 'Spinner',
    'ListItem', 'Slider', 'TabItem', 'Hyperlink', 'TreeItem', 'DataItem']);
  function toateUnitatile(R, conv) {
    if (conv) return [...R.querySelectorAll('[data-lh-tip]')].filter(e => vis(e) && TIPURI_UNITATE.has(e.getAttribute('data-lh-tip')));
    return unitati(R, R);
  }
  /* gri pe ecran (ca în aplicația reală, unde o comandă indisponibilă e gri și nu face nimic) */
  function dezactivat(e) {
    return !!(e.disabled || e.getAttribute('aria-disabled') === 'true' ||
      /(^|[-_ ])(gri|dezactivat|disabled|inactiv|pg-gri)([-_ ]|$)/i.test(typeof e.className === 'string' ? e.className : ''));
  }
  function hash(s) { let h = 2166136261 >>> 0; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h.toString(16) + '/' + s.length; }

  window.__LHO = {
    versiune: 2,
    modul,
    extrage(o) {
      o = o || {};
      const R = radacina(o.app);
      const conv = modul(o.app) === 'conventie';
      const r = R.getBoundingClientRect();
      return { mod: conv ? 'conventie' : 'vechi', aplicatie: conv ? R.getAttribute('data-lh-aplicatie') : o.app,
        profil: conv ? R.getAttribute('data-lh-profil') : null, rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)],
        suprafete: conv ? extrageConv(R) : extrageVechi(R, o), ui: uiInAfara(),
        radacini: radaciniInregistrate().length, radacini_neinregistrate: radaciniNeinregistrate().length };
    },
    ui: uiInAfara,
    stareO8,
    /* filele: le marchează cu data-lho-fila=i ca oracolul să le apese cu mouse-ul */
    file(o) {
      curata('data-lho-fila');
      return fileElem(o.app, o.refTabs).map((t, i) => {
        t.setAttribute('data-lho-fila', String(i));
        return { i, cand: cand(t), id: t.getAttribute('data-lh-id-mso') || null,
          activ: t.getAttribute('aria-selected') === 'true' || /\bon\b|\bactiv/.test(t.className || '') };
      });
    },
    fisier(o) {
      curata('data-lho-fisier');
      const R = radacina(o.app);
      let f = null;
      if (modul(o.app) === 'conventie') f = R.querySelector('[data-lh-id-mso="FileTabButton"]');
      else f = fisierVechi(randFile(R, o.refTabs));
      if (!f || !vis(f)) return false;
      f.setAttribute('data-lho-fisier', '1');
      return true;
    },
    /* caută o unitate după idMso (convenție: data-lh-id-mso; vechi: data-nesim) sau după o etichetă brută exactă */
    gaseste(o) {
      curata('data-lho-t');
      const R = radacina(o.app);
      const conv = modul(o.app) === 'conventie';
      const els = toateUnitatile(R, conv);
      let e = null;
      if (o.id) e = els.find(x => (x.getAttribute('data-lh-id-mso') || idVechi(x)) === o.id);
      if (!e && o.eticheta) e = els.find(x => cand(x).some(c => normJS(c) === normJS(o.eticheta)));
      if (!e && o.raw) e = els.find(x => cand(x).indexOf(o.raw) >= 0);
      if (!e) return false;
      e.setAttribute('data-lho-t', '1');
      return { tag: e.tagName, dezactivat: dezactivat(e) };
    },
    /* toate unitățile vizibile (pentru țintele O8 și procentul de comenzi simulate) */
    unitati(o) {
      const R = radacina(o.app);
      const conv = modul(o.app) === 'conventie';
      return toateUnitatile(R, conv).map(e => ({ cand: cand(e), id: e.getAttribute('data-lh-id-mso') || idVechi(e),
        nesim: conv ? e.hasAttribute('data-lh-nesimulat') : nesimVechi(e), tip: conv ? e.getAttribute('data-lh-tip') : tipVechi(e),
        tag: e.tagName, dezactivat: dezactivat(e) }));
    },
    tinte(o) {
      const R = radacina(o.app);
      return [...new Set([...R.querySelectorAll('[data-lh-tinta]')].filter(vis).map(e => e.getAttribute('data-lh-tinta')))];
    },
    marcheazaTinta(o) {
      curata('data-lho-tinta');
      const R = radacina(o.app);
      const e = [...R.querySelectorAll('[data-lh-tinta="' + o.tinta + '"]')].find(vis);
      if (!e) return false;
      e.setAttribute('data-lho-tinta', '1');
      return true;
    },
    listaBackstage(o) {
      curata('data-lho-bs');
      const R = radacina(o.app);
      const nav = R.querySelector('[data-lh-suprafata="backstage.nav"]');
      if (!nav) return [];
      return [...nav.querySelectorAll('[data-lh-tip="ListItem"]')].filter(vis).map((e, i) => {
        e.setAttribute('data-lho-bs', String(i));
        return { i, eticheta: e.getAttribute('data-lh-eticheta') || txt(e) };
      });
    },
    fileDialog(o) {
      curata('data-lho-fd');
      const R = radacina(o.app);
      const d = R.querySelector('[data-lh-suprafata="' + o.cheie + '"]');
      if (!d) return [];
      return [...d.querySelectorAll('[data-lh-tip="TabItem"]')].filter(vis).map((e, i) => {
        e.setAttribute('data-lho-fd', String(i));
        return { i, eticheta: e.getAttribute('data-lh-eticheta') || txt(e) };
      });
    },
    /* starea observabilă: DOM-ul aplicației + valorile câmpurilor + mesajele vizibile din pagină */
    instantaneu(o) {
      const R = radacina(o && o.app);
      const vals = [...R.querySelectorAll('input,select,textarea')].map(e => (e.type === 'checkbox' || e.type === 'radio') ? String(e.checked) : String(e.value)).join('\u0001');
      const msg = [...document.querySelectorAll('[role=alert],[role=status],[aria-live],[role=dialog],[role=tooltip],.toast,#fb,[data-lh-mesaj]')]
        .filter(vis).map(txt).join('\u0002');
      const html = R.outerHTML.replace(/\sdata-lho-[a-z]+="[^"]*"/g, '');
      return hash(html) + ':' + hash(vals) + ':' + hash(msg) + ':' + document.querySelectorAll('[role=dialog]').length;
    },
    /* ajunge la un exercițiu prin cârligele motorului (ca jocuri/_motor/test_joc.py) */
    mergi(nav) {
      const JM = window.JocMotor;
      if (!JM || !JM.test) throw new Error('JocMotor.test lipsește');
      const h = document.getElementById('go-home');
      if (h) h.click();
      const lv = document.querySelector('.lvl[data-l="' + nav.li + '"]');
      if (!lv) throw new Error('nivelul ' + nav.li + ' lipsește');
      lv.click();
      if (nav.fel === 'pas') { JM.test.pas(nav.si); JM.test.exercitiu(nav.ei); }
      else if (nav.fel === 'atelier') { JM.test.atelier(); JM.test.exercitiu(nav.ei); }
      else { const g = document.getElementById('go'); if (g) g.click(); }
      return JM.test.stare();
    },
    deschideSuprafata(cheie) {
      const A = window.LHAplicatii;
      if (!A || typeof A.deschideSuprafata !== 'function') return false;
      return Promise.resolve(A.deschideSuprafata(cheie)).then(() => true, () => false);
    }
  };
})();
