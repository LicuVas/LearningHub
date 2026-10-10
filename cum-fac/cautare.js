/* cautare.js — motorul de căutare al secțiunii „Cum fac…?” (LearningHub, 10.10.2026).
 *
 * Fără biblioteci și fără rețea: totul rulează în pagină (contract I3). Merge în browser
 * (window.CautareCumFac) și în node (require / import implicit).
 *
 *   var index = CautareCumFac.creeaza(fise, sensuri);       // o singură dată
 *   index.cauta('cum salvez excelu', {aplicatie: 'excel', max: 10})
 *     -> {gasit, aplicatieDedusa, rezultate: [{id, scor, acoperire, de_ce: [cuvinte potrivite]}], propuneri: [id, …]}
 *
 * Cum înțelege întrebarea (SPEC.md, „Motorul de căutare”):
 *  1. normalizare: litere mici, fără diacritice (și ş/ţ cu sedilă), semnele -> spații; Ctrl+S -> „ctrls”;
 *  2. expresiile din sensuri.json („mai multe celule”, „save as”) se recunosc întregi, pe rădăcini;
 *  3. numele aplicației („excel”, „wordul”) arată aplicația și iese din cuvintele căutate; cuvintele de umplutură
 *     („cum”, „fac”, „sa”…) ies; „mai multe”, „toate”, „nou”, „alt” rămân;
 *  4. rădăcina românească (salvez/salvare/salvat -> salv; celula/celulele -> celul);
 *  5. sensuri: cuvintele din același grup se potrivesc între ele (salvez ~ păstrez ~ save; căsuță ~ celulă);
 *  6. greșeli de tastare: cuvântul necunoscut ia cel mai apropiat cuvânt din vocabular (Damerau-Levenshtein:
 *     1 pentru 4-6 litere, 2 pentru 7+, cu aceeași primă literă la 2), inclusiv două litere inversate;
 *     ultimul cuvânt, încă netastat până la capăt, se potrivește și ca început de cuvânt; un cuvânt cunoscut,
 *     dar RAR (în ≤ rar_df fișe, fără sens în dicționar: „colona”, „salvz” scrise de autori în formulări) se
 *     potrivește și cu cel mai apropiat cuvânt mult mai des („coloana”, „salvez”);
 *  7. scorul: cât din întrebare explică fiecare câmp al fișei (ponderi: titlu, întrebare, formulări, cuvinte >
 *     termeni > pași), cântărit cu rareța cuvântului (idf), plus cea mai apropiată frază a fișei (Dice), plus
 *     „identitatea” (Dice cu titlul sau cu întrebarea-tip); fișele aplicației deduse trec în față; numele
 *     aplicației scris în fișă („PowerPoint rămâne deschis”) răspunde la „programul”, „aplicația”;
 *  8. „n-am găsit”: dacă primul rezultat explică mai puțin decât pragul din întrebare -> gasit=false și 3 propuneri;
 *     la frazele lungi, cu cel puțin lung_potrivite cuvinte potrivite pe câmpurile tari, ajunge prag_lung; sub prag,
 *     ajunge și o asemănare (Dice >= fx_dice) cu una dintre formulările în plus ale primei fișe;
 *  9. formulările în plus (_sursa/formulari_extra_*.json, în date.js câmpul „fx”, normalizate, legate cu „|”) sunt un
 *     câmp separat: ponderea lui la ordonare, cât contează la „am găsit” (un cuvânt spus o singură dată e context);
 * 10. „neacoperite” (sensuri.json): gesturile care nu sunt în materie (ascund o coloană, cuprins, video…); dacă întrebarea
 *     pomenește unul și primul rezultat nu-l are în titlu / întrebare / formulări / cuvinte -> „n-am găsit”;
 * 11. viteza: se punctează pe larg doar max_candidati fișe, cele cu cea mai mare margine de sus a acoperirii.
 * Ponderile și pragul stau în sensuri.json („reglaj”), ca reglajul să nu atingă codul.
 */
(function (global, fabrica) {
  var M = fabrica();
  if (typeof module === 'object' && module && module.exports) module.exports = M;
  else if (global) global.CautareCumFac = M;
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : null), function () {
  'use strict';
  // semnele diacritice combinate (U+0300..U+036F), după normalize('NFD'): ă -> a + ˘, ș -> s + virgulă
  var SEMNE = new RegExp('[' + String.fromCharCode(0x300) + '-' + String.fromCharCode(0x36F) + ']', 'g');

  var VERSIUNE = '1.2 (11.10.2026, reglajul nr. 2: formulările în plus, gesturile neacoperite)';
  var APLICATII = ['excel', 'word', 'powerpoint', 'windows', 'web'];
  var REGLAJ_IMPLICIT = {
    prag: 0.55,
    ponderi_campuri: { titlu: 1.0, intrebare: 1.0, formulari: 0.95, cuvinte: 0.9, scurtatura: 0.9, termeni: 0.7,
      formulari_extra: 0, termeni_def: 0.3, titlu_pas: 0.45, pasi: 0.45, rezultat: 0.4, atentie: 0.3 },
    fx_tare: 0,          // formulările în plus: cât din ponderea lor contează la „am găsit” (0 = deloc)
    fx_fraza: 0,         // … factorul lor la „cea mai apropiată frază” (0 = nu intră)
    fx_vocabular: false, // … cuvintele lor intră în vocabularul greșelilor de tastare
    fx_df: false,        // … intră la socotirea rareței (idf)
    potrivire: { radacina: 1.0, sens: 0.85, prefix: 0.7, greseala_1: 0.8, greseala_2: 0.6 },
    pondere_fraza: 0.5,
    alta_aplicatie_numita: 0.55,
    alta_aplicatie_indiciu: 0.85,
    necunoscut: 0.9,
    scor_minim: 0.2,
    rar_df: 2,
    rar_ori: 3,
    pondere_identitate: 0,
    lung_potrivite: 0,
    prag_lung: 0.4,
    grup_nume_aplicatie: null
  };

  // ---------------------------------------------------------------- normalizare și rădăcini
  function normalizeaza(s) {
    s = String(s == null ? '' : s);
    // doar etichetele de formatare ies; „<title>”, „<head>” (fișele de HTML) rămân cuvinte: title, head
    s = s.replace(/<\/?(?:b|kbd|code|i|br|em|strong|span|p)\b[^>]*>/gi, ' ')
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&[a-z]+;/g, ' ');
    s = s.toLowerCase();
    if (s.normalize) s = s.normalize('NFD');
    s = s.replace(SEMNE, '').replace(/[\[\]]/g, '');
    // combinațiile de taste devin un singur cuvânt: Ctrl+S -> ctrls, Win+Shift+S -> winshifts, Alt+F4 -> altf4
    s = s.replace(/\b((?:ctrl|alt|shift|win)(?:\s*\+\s*(?:ctrl|alt|shift|win))*)\s*\+\s*([a-z0-9]+)/g,
      function (m, mod, tasta) { return ' ' + mod.replace(/[\s+]/g, '') + tasta + ' '; });
    s = s.replace(/\b(ctrl|alt|shift|win)\s+([a-z0-9]|f\d{1,2})\b/g, function (m, mod, tasta) { return mod + tasta; });
    return s.replace(/[^a-z0-9]+/g, ' ').trim();
  }

  // terminațiile românești (și câteva englezești); se taie UNA, cea mai lungă, cu rădăcina de cel puțin 3 litere;
  // apoi, la rădăcinile lungi, și vocala de la coadă (slideuri -> slide -> slid = slide)
  var SUFIXE = ['urilor', 'iesti', 'ieste', 'urile', 'easca', 'ilor', 'elor', 'ului', 'area', 'irea', 'erea', 'eaza',
    'iesc', 'arii', 'esti', 'este', 'ari', 'esc', 'ezi', 'eze', 'are', 'ire', 'ere', 'ata', 'ate', 'ati', 'ita', 'ite',
    'iti', 'uta', 'ute', 'ind', 'and', 'eti', 'uri', 'ele', 'ile', 'ing', 'ul', 'ui', 'ii', 'ei', 'ea', 'ez', 'at',
    'it', 'ut', 'am', 'em', 'im', 'ed', 'a', 'e', 'i', 'u'];
  var memoRad = new Map();
  // rădăcinile fixate din sensuri.json („radacini_fixe”): formele unui cuvânt pe care tăietura le-ar lipi de altul
  // („alineat” -> „alin” = „aliniere”)
  var radFixe = new Map();
  var semnFixe = '';
  function fixeazaRadacini(liste) {
    var semn = JSON.stringify(liste || []);
    if (semn === semnFixe) return;
    semnFixe = semn;
    radFixe = new Map();
    memoRad.clear();
    (liste || []).forEach(function (l) {
      var r = normalizeaza(l[0]);
      l.forEach(function (w) { var n = normalizeaza(w); if (n) radFixe.set(n, r); });
    });
  }
  function radacina(w) {
    if (radFixe.size && radFixe.has(w)) return radFixe.get(w);
    if (!w || w.length <= 3 || /^\d/.test(w)) return w;
    var m = memoRad.get(w);
    if (m !== undefined) return m;
    var r = rad1(w);
    if (memoRad.size < 50000) memoRad.set(w, r);
    return r;
  }
  function rad1(w) {
    var r = w;
    for (var i = 0; i < SUFIXE.length; i++) {
      var x = SUFIXE[i];
      // o singură vocală se taie doar la cuvintele lungi („cale”≠„cal”, „tabla”≠„table”, „fila”≠„file”), iar după
      // două litere rămân măcar 4 („calea”≠„cal”); după trei sau mai multe ajung 3 (mutare -> mut, pozele -> poz)
      if (x.length === 1 && w.length < 6) continue;
      if (w.length - x.length >= (x.length === 2 ? 4 : 3) && w.slice(-x.length) === x) { r = w.slice(0, -x.length); break; }
    }
    if (r.length > 4 && /[aeiu]$/.test(r)) r = r.slice(0, -1);
    return r;
  }

  // Damerau-Levenshtein (alinierea optimă): inversarea a două litere vecine costă 1; se oprește peste „max”
  function distanta(a, b, max) {
    if (max == null) max = 99;
    var la = a.length, lb = b.length;
    if (Math.abs(la - lb) > max) return max + 1;
    if (a === b) return 0;
    var d = [], i, j;
    for (i = 0; i <= la; i++) { d[i] = [i]; }
    for (j = 0; j <= lb; j++) d[0][j] = j;
    for (i = 1; i <= la; i++) {
      var minRand = 99;
      for (j = 1; j <= lb; j++) {
        var cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
        var v = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        if (i > 1 && j > 1 && a.charCodeAt(i - 1) === b.charCodeAt(j - 2) && a.charCodeAt(i - 2) === b.charCodeAt(j - 1)) {
          v = Math.min(v, d[i - 2][j - 2] + 1);
        }
        d[i][j] = v;
        if (v < minRand) minRand = v;
      }
      if (minRand > max) return max + 1;
    }
    return d[la][lb];
  }

  function adauga(map, cheie, val) {
    var s = map.get(cheie);
    if (!s) { s = new Set(); map.set(cheie, s); }
    s.add(val);
  }
  function seIntersecteaza(a, b) {
    if (!a || !b || !a.size || !b.size) return false;
    var mic = a.size <= b.size ? a : b, mare = mic === a ? b : a;
    for (var it = mic.values(), x = it.next(); !x.done; x = it.next()) if (mare.has(x.value)) return true;
    return false;
  }

  // ---------------------------------------------------------------- dicționarul (sensuri.json)
  function pregatesteDictionar(sensuri) {
    sensuri = sensuri || {};
    fixeazaRadacini(sensuri.radacini_fixe);
    var D = {
      stop: new Set(),
      grupCuvant: new Map(),      // cuvânt normalizat -> Set(grupuri)
      grupRad: new Map(),         // rădăcină -> Set(grupuri)
      grupFraza: new Map(),       // "rad1 rad2" -> Set(grupuri)
      aplicGrup: new Map(),       // grup -> aplicatie | null
      numeCuvant: new Map(),      // cuvânt/rădăcină -> aplicatie (numele aplicației: iese din căutare)
      numeFraza: new Map(),
      indiciuCuvant: new Map(),   // cuvânt/rădăcină -> Set(aplicatii) (rămâne în căutare)
      indiciuFraza: new Map(),
      maxFraza: 1,
      inceputFraza: new Set(),    // rădăcinile cu care începe o expresie (restul pozițiilor nu se mai încearcă)
      etichete: {},
      cuvinteDictionar: new Map() // cuvânt -> rădăcină (vocabular pentru greșeli)
    };
    (sensuri.umplutura || []).forEach(function (w) {
      normalizeaza(w).split(' ').forEach(function (x) { if (x) D.stop.add(x); });
    });
    function bucati(w) { var n = normalizeaza(w); return n ? n.split(' ') : []; }
    function cheieFraza(b) { return b.map(radacina).join(' '); }
    (sensuri.grupuri || []).forEach(function (g) {
      if (!g || !g.id) return;
      D.aplicGrup.set(g.id, g.aplicatie || null);
      (g.cuvinte || []).forEach(function (w) {
        var b = bucati(w);
        if (!b.length) return;
        if (b.length === 1) {
          adauga(D.grupCuvant, b[0], g.id);
          adauga(D.grupRad, radacina(b[0]), g.id);
          if (b[0].length > 1) D.cuvinteDictionar.set(b[0], radacina(b[0]));
        } else {
          adauga(D.grupFraza, cheieFraza(b), g.id);
          if (b.length > D.maxFraza) D.maxFraza = b.length;
          b.forEach(function (x) { if (x.length > 1 && !D.stop.has(x)) D.cuvinteDictionar.set(x, radacina(x)); });
        }
      });
    });
    var ap = sensuri.aplicatii || {};
    Object.keys(ap).forEach(function (a) {
      D.etichete[a] = ap[a].eticheta || a;
      (ap[a].nume || []).forEach(function (w) {
        var b = bucati(w);
        if (!b.length) return;
        if (b.length === 1) { D.numeCuvant.set(b[0], a); D.numeCuvant.set(radacina(b[0]), a); }
        else { D.numeFraza.set(cheieFraza(b), a); if (b.length > D.maxFraza) D.maxFraza = b.length; }
      });
      (ap[a].indicii || []).forEach(function (w) {
        var b = bucati(w);
        if (!b.length) return;
        if (b.length === 1) { adauga(D.indiciuCuvant, b[0], a); adauga(D.indiciuCuvant, radacina(b[0]), a); }
        else { adauga(D.indiciuFraza, cheieFraza(b), a); if (b.length > D.maxFraza) D.maxFraza = b.length; }
      });
    });
    D.lungimiFraza = new Map();   // rădăcina de început -> lungimile expresiilor care încep cu ea (descrescător)
    [D.grupFraza, D.numeFraza, D.indiciuFraza].forEach(function (m) {
      m.forEach(function (v, k) {
        var b = k.split(' ');
        D.inceputFraza.add(b[0]);
        var l = D.lungimiFraza.get(b[0]);
        if (!l) { l = []; D.lungimiFraza.set(b[0], l); }
        if (l.indexOf(b.length) < 0) { l.push(b.length); l.sort(function (x, y) { return y - x; }); }
      });
    });
    // gesturile care NU sunt în materie („neacoperite”: ascund o coloană, cuprins, filtru, video…): fiecare intrare =
    // formele ei (cuvinte sau expresii), comparate pe rădăcini
    D.veto = (sensuri.neacoperite || []).map(function (l) {
      return (Array.isArray(l) ? l : [l]).map(function (w) { return bucati(w).map(radacina); }).filter(function (b) { return b.length; });
    });
    D.vetoStart = new Map();      // rădăcina de început -> [[intrarea, forma]]
    D.veto.forEach(function (forme, ix) {
      forme.forEach(function (b) { var l = D.vetoStart.get(b[0]); if (!l) { l = []; D.vetoStart.set(b[0], l); } l.push([ix, b]); });
    });
    return D;
  }
  // intrările „neacoperite” pomenite într-un text (dat ca listă de rădăcini)
  function vetoIn(D, rads) {
    var o = new Set();
    if (!D.veto.length || !rads.length) return o;
    for (var i = 0; i < rads.length; i++) {
      var l = D.vetoStart.get(rads[i]);
      if (!l) continue;
      for (var q = 0; q < l.length; q++) {
        var ix = l[q][0], b = l[q][1];
        if (o.has(ix) || i + b.length > rads.length) continue;
        var ok = true;
        for (var j = 1; j < b.length; j++) if (rads[i + j] !== b[j]) { ok = false; break; }
        if (ok) o.add(ix);
      }
    }
    return o;
  }
  function radaciniText(t, normalizat) { var n = normalizat ? t : normalizeaza(t); return n ? n.split(' ').map(radacina) : []; }

  // textul -> jetoane {w: cuvântul (sau expresia), s: rădăcina (sau „f:expresia”), g: Set(grupuri)}
  // + voturile pentru aplicație (nume = 3, indiciu = 1)
  function analizeaza(D, text, cuParti, normalizat) {
    var w = normalizat ? String(text || '') : normalizeaza(text);
    var cuv = w ? w.split(' ') : [];
    var rad = cuv.map(radacina);
    var jet = [], vot = {}, numite = {};
    function voteaza(a, p, numit) { vot[a] = (vot[a] || 0) + p; if (numit) numite[a] = true; }
    var i = 0;
    while (i < cuv.length) {
      var potrivit = false;
      var lungimi = D.lungimiFraza.get(rad[i]);
      for (var li = 0; lungimi && li < lungimi.length && !potrivit; li++) {
        var L = lungimi[li];
        if (L > cuv.length - i) continue;
        var k = rad.slice(i, i + L).join(' ');
        if (D.numeFraza.has(k)) { voteaza(D.numeFraza.get(k), 3, true); potrivit = true; }
        else if (D.grupFraza.has(k) || D.indiciuFraza.has(k)) {
          if (D.indiciuFraza.has(k)) D.indiciuFraza.get(k).forEach(function (a) { voteaza(a, 1); });
          var g = new Set(D.grupFraza.get(k) || []);
          // expresia e un singur jeton; cuvintele ei nu se mai numără separat
          // (în fișe, cuParti: și cuvintele expresiei, ca „multe celule” scris fără „mai” să găsească „mai multe celule”)
          var g2 = cuv.slice(i, i + L).join(' ');
          if (g.size) jet.push({ w: g2, s: 'f:' + k, g: g, fraza: true });
          if (!g.size || cuParti) rad.slice(i, i + L).forEach(function (r, j) {
            var c = cuv[i + j];
            if (!D.stop.has(c) && c.length > 1 && !D.numeCuvant.has(c)) jet.push({ w: c, s: r, g: grupuri(D, c, r), parte: !!g.size });
          });
          potrivit = true;
        }
        if (potrivit) i += L;
      }
      if (potrivit) continue;
      var c = cuv[i], r = rad[i];
      i++;
      if (D.numeCuvant.has(c) || (!D.grupCuvant.has(c) && D.numeCuvant.has(r) && r.length >= 4)) {
        voteaza(D.numeCuvant.get(c) || D.numeCuvant.get(r), 3, true); continue;
      }
      if (D.stop.has(c) || c.length < 2) continue;
      var ind = D.indiciuCuvant.get(c) || D.indiciuCuvant.get(r);
      if (ind) ind.forEach(function (a) { voteaza(a, 1); });
      jet.push({ w: c, s: r, g: grupuri(D, c, r) });
    }
    return { jetoane: jet, vot: vot, numite: numite, text: w };
  }
  // grupurile cuvântului: mulțimea din dicționar, împărțită (nimeni nu o modifică)
  var FARA_GRUP = new Set();
  function grupuri(D, c, r) {
    return D.grupCuvant.get(c) || D.grupRad.get(r) || FARA_GRUP;
  }

  // ---------------------------------------------------------------- indexul
  // formulari_extra = formulările în plus (_sursa/formulari_extra_*.json, în date.js câmpul „fx”: un șir cu „|”);
  // e un câmp tare doar pe jumătate: cât contează la „am găsit” spune reglaj.fx_tare
  var CAMPURI = ['titlu', 'intrebare', 'formulari', 'cuvinte', 'scurtatura', 'termeni', 'formulari_extra', 'termeni_def',
    'titlu_pas', 'pasi', 'rezultat', 'atentie'];
  // „am găsit” se judecă doar pe câmpurile care spun CE GEST e fișa; pașii și rezultatul ajută doar la ordonare
  var CAMPURI_TARI = ['titlu', 'intrebare', 'formulari', 'cuvinte', 'scurtatura', 'termeni'];
  var NR_TARI = CAMPURI_TARI.length, IX_FX = CAMPURI.indexOf('formulari_extra');
  function formulariExtra(f) {
    if (typeof f.fx === 'string') return f.fx ? f.fx.split('|') : [];
    return Array.isArray(f.formulari_extra) ? f.formulari_extra : [];
  }

  function creeaza(fise, sensuri, optiuni) {
    fise = Array.isArray(fise) ? fise : [];
    var R = JSON.parse(JSON.stringify(REGLAJ_IMPLICIT));
    var rs = (sensuri && sensuri.reglaj) || {};
    Object.keys(rs).forEach(function (k) {
      if (rs[k] && typeof rs[k] === 'object' && R[k] && typeof R[k] === 'object') Object.keys(rs[k]).forEach(function (j) { R[k][j] = rs[k][j]; });
      else R[k] = rs[k];
    });
    if (optiuni && optiuni.reglaj) Object.keys(optiuni.reglaj).forEach(function (k) { R[k] = optiuni.reglaj[k]; });
    var D = pregatesteDictionar(sensuri);
    var N = fise.length;
    var df = new Map();              // „s:rad” / „g:grup” -> în câte fișe apare
    var postari = new Map();         // aceeași cheie -> Set(indicii fișelor)
    var vocabular = new Map();       // cuvânt -> rădăcină (pentru greșeli și început de cuvânt)
    D.cuvinteDictionar.forEach(function (r, w) { vocabular.set(w, r); });
    D.numeCuvant.forEach(function (a, w) { if (w.length > 2) vocabular.set(w, '@' + a); });

    var memoAn = new Map();          // aceeași analiză pentru același text (titlul intră și în câmp, și în fraze)
    function an(t) { var m = memoAn.get(t); if (!m) { m = analizeaza(D, t, true); memoAn.set(t, m); } return m; }
    var faraDfFx = new Map();        // cheile care apar DOAR în formulările în plus (când fx_df e oprit) -> în câte fișe
    var intrari = fise.map(function (f, ix) {
      var app = f.aplicatie;
      var campuri = {};
      var chei = new Set();
      var cheiFx = new Set();
      var fx = formulariExtra(f);
      var fxNormalizat = typeof f.fx === 'string';   // build.mjs le scrie normalizate
      var analizeFx = null;
      function camp(nume, texte, analize) {
        var C = { s: new Set(), g: new Set() };
        var tare = CAMPURI_TARI.indexOf(nume) >= 0;
        var eFx = nume === 'formulari_extra';
        // la formulările în plus ținem minte și în câte fraze apare fiecare cheie: un cuvânt spus o singură dată
        // („la romana”, „profa”) e context, nu gestul fișei
        if (eFx) C.tf = new Map();
        texte.forEach(function (t, k) {
          var a = analize ? analize[k] : an(t);
          var aici = eFx ? new Set() : null;
          if ((tare || eFx) && R.grup_nume_aplicatie && Object.keys(a.numite).length) { C.g.add(R.grup_nume_aplicatie); if (aici) aici.add('g:' + R.grup_nume_aplicatie); }
          a.jetoane.forEach(function (j) {
            C.s.add(j.s);
            if (aici) aici.add('s:' + j.s);
            j.g.forEach(function (g) { var ag = D.aplicGrup.get(g); if (!ag || ag === app) { C.g.add(g); if (aici) aici.add('g:' + g); } });
            // vocabularul greșelilor: doar cuvintele din câmpurile tari (nu orice cuvânt din pași: „clatite” -> „citite”)
            if (!j.fraza && (tare || (eFx && R.fx_vocabular))) vocabular.set(j.w, j.s);
          });
          if (aici) aici.forEach(function (x) { C.tf.set(x, (C.tf.get(x) || 0) + 1); });
        });
        var tinta = eFx ? cheiFx : chei;
        C.s.forEach(function (s) { tinta.add('s:' + s); });
        C.g.forEach(function (g) { tinta.add('g:' + g); });
        campuri[nume] = C;
      }
      var sursa = f.sursa || {};
      camp('titlu', [f.titlu]);
      camp('intrebare', [f.intrebare]);
      camp('formulari', f.formulari || []);
      camp('cuvinte', f.cuvinte || []);
      camp('scurtatura', [f.scurtatura]);
      camp('termeni', (f.termeni || []).map(function (t) { return t.t; }));
      if (R.ponderi_campuri.formulari_extra && fx.length) {
        analizeFx = fx.map(function (t) { return analizeaza(D, t, true, fxNormalizat); });
        camp('formulari_extra', fx, analizeFx);
      } else campuri.formulari_extra = { s: new Set(), g: new Set(), tf: new Map() };
      camp('termeni_def', (f.termeni || []).map(function (t) { return t.d; }));
      camp('titlu_pas', [sursa.titlu_pas]);
      camp('pasi', f.pasi || []);
      camp('rezultat', [f.rezultat]);
      camp('atentie', [f.atentie]);
      // frazele întregi (pentru „cea mai apropiată formulare”); formulările în plus intră doar cu fx_fraza
      function fraza(a, fxF) {
        var P = { s: new Set(), g: new Set(), j: a.jetoane.filter(function (j) { return !j.parte; }), w: 0, fx: fxF };
        if (R.grup_nume_aplicatie && Object.keys(a.numite).length) P.g.add(R.grup_nume_aplicatie);
        a.jetoane.forEach(function (j) {
          P.s.add(j.s);
          j.g.forEach(function (g) { var ag = D.aplicGrup.get(g); if (!ag || ag === app) P.g.add(g); });
        });
        return P;
      }
      var fraze = [f.titlu, f.intrebare].concat(f.formulari || [], f.cuvinte || []).filter(Boolean).map(function (t) {
        return fraza(an(t), 0);
      });
      if (analizeFx && R.fx_fraza) analizeFx.forEach(function (a) { if (a.jetoane.length) fraze.push(fraza(a, 1)); });
      chei.forEach(function (k) { df.set(k, (df.get(k) || 0) + 1); adauga(postari, k, ix); });
      cheiFx.forEach(function (k) {
        if (chei.has(k)) return;
        if (R.fx_df) df.set(k, (df.get(k) || 0) + 1); else faraDfFx.set(k, (faraDfFx.get(k) || 0) + 1);
        adauga(postari, k, ix);
      });
      // ce gesturi „neacoperite” pomenește fișa în câmpurile care spun ce e ea (titlu, întrebare, formulări, cuvinte):
      // dacă o fișă nouă le predă, nu mai sunt „neacoperite” pentru ea
      var veto = new Set();
      if (D.veto.length) {
        [f.titlu, f.intrebare].concat(f.formulari || [], f.cuvinte || []).forEach(function (t) {
          if (t) vetoIn(D, radaciniText(an(t).text, true)).forEach(function (x) { veto.add(x); });
        });
      }
      return { f: f, ix: ix, app: app, c: campuri, fraze: fraze, veto: veto, nIdent: (f.titlu ? 1 : 0) + (f.intrebare ? 1 : 0),
        fxText: fx, fxNorm: fxNormalizat, fraziFx: null };
    });
    // fx_df oprit: rareța se socotește pe câmpurile autorilor; o cheie care apare DOAR în formulările în plus
    // primește rareța din ele
    faraDfFx.forEach(function (n, k) { if (!df.has(k)) df.set(k, n); });

    var idfMax = Math.log(1 + Math.max(N, 1));
    function idfCheie(k) { var n = df.get(k); return n ? Math.log(1 + N / n) : 0; }
    function idfJeton(j) {
      var v = idfCheie('s:' + j.s);
      if (j.g) j.g.forEach(function (g) { var x = idfCheie('g:' + g); if (x > v) v = x; });
      return v;
    }
    var suma = 0, nr = 0;
    df.forEach(function (n, k) { if (k[0] === 's') { suma += Math.log(1 + N / n); nr++; } });
    var idfMediu = nr ? suma / nr : idfMax;
    intrari.forEach(function (E) {
      E.fraze.forEach(function (P) { P.w = P.j.reduce(function (s, j) { return s + (idfJeton(j) || idfMediu); }, 0); });
    });
    // vocabularul pe lungimi (greșelile se caută doar printre cuvintele cu lungime apropiată)
    var peLungimi = {};
    vocabular.forEach(function (r, w) { (peLungimi[w.length] = peLungimi[w.length] || []).push(w); });
    var cuvinteStop = ['cum', 'fac', 'pot'].filter(function (w) { return D.stop.has(w); });   // „cun”, „fsc”, „pto”
    var memo = new Map();

    function cunoscut(j) {
      if (df.has('s:' + j.s)) return true;
      var da = false;
      j.g.forEach(function (g) { if (df.has('g:' + g)) da = true; });
      return da;
    }
    // cel mai apropiat cuvânt din vocabular; null dacă nu e niciunul destul de aproape
    function corecteaza(w) {
      if (memo.has(w)) return memo.get(w);
      var rez = null;
      var max = w.length >= 7 ? 2 : (w.length >= 4 ? 1 : 0);
      if (max) {
        var best = null;
        for (var L = w.length - max; L <= w.length + max; L++) {
          var lista = peLungimi[L];
          if (!lista) continue;
          for (var i = 0; i < lista.length; i++) {
            var v = lista[i];
            var d = distanta(w, v, max);
            if (d > max) continue;
            if (d === 2 && v[0] !== w[0]) continue;
            var r = vocabular.get(v);
            var pop = r[0] === '@' ? N : (df.get('s:' + r) || 0);
            var c = { w: v, d: d, s: r, prim: v[0] === w[0] ? 1 : 0, pop: pop };
            if (!best || c.d < best.d || (c.d === best.d && (c.prim > best.prim || (c.prim === best.prim &&
              (c.pop > best.pop || (c.pop === best.pop && c.w < best.w)))))) best = c;
          }
        }
        rez = best;
      }
      if (!rez && w.length === 3) {   // „cun” -> „cum”: greșeala la un cuvânt de umplutură (nu „mail” -> „mai”)
        for (var k = 0; k < cuvinteStop.length; k++) if (distanta(w, cuvinteStop[k], 1) <= 1) { rez = { stop: true }; break; }
      }
      memo.set(w, rez);
      return rez;
    }
    // un cuvânt CUNOSCUT, dar rar (în ≤ rar_df fișe) și fără sens în dicționar, e adesea o greșeală pe care un
    // autor a pus-o într-o formulare („colona”, „salvz”, „foia”): îl lăsăm să se potrivească și cu cel mai apropiat
    // cuvânt mult mai des (de cel puțin rar_ori ori), cu factorul greșelii
    var memoRar = new Map();
    function corecteazaRar(w, dfW) {
      if (memoRar.has(w)) return memoRar.get(w);
      var best = null;
      var max = w.length >= 7 ? 2 : (w.length >= 4 ? 1 : 0);
      for (var L = w.length - max; max && L <= w.length + max; L++) {
        var lista = peLungimi[L];
        if (!lista) continue;
        for (var i = 0; i < lista.length; i++) {
          var v = lista[i];
          if (v === w) continue;
          var r = vocabular.get(v);
          if (r[0] === '@' || r === radacina(w)) continue;
          var pop = df.get('s:' + r) || 0;
          if (pop < Math.max(2, dfW * (R.rar_ori || 3))) continue;
          var d = distanta(w, v, max);
          if (d > max) continue;
          if (d === 2 && v[0] !== w[0]) continue;
          var c = { w: v, d: d, s: r, prim: v[0] === w[0] ? 1 : 0, pop: pop };
          if (!best || c.d < best.d || (c.d === best.d && (c.prim > best.prim || (c.prim === best.prim &&
            (c.pop > best.pop || (c.pop === best.pop && c.w < best.w)))))) best = c;
        }
      }
      memoRar.set(w, best);
      return best;
    }
    // numele de aplicație cel mai apropiat (o literă la 5-7 litere, două la 8+, cu aceeași primă literă)
    var numeApp = [];
    D.numeCuvant.forEach(function (a, w) { if (w.length >= 4 && /^[a-z]+$/.test(w)) numeApp.push([w, a]); });
    function numeAplicatieGresit(w) {
      if (w.length < 5) return null;
      var max = w.length >= 8 ? 2 : 1;
      for (var i = 0; i < numeApp.length; i++) {
        var v = numeApp[i][0];
        if (v === w || v[0] !== w[0]) continue;
        if (distanta(w, v, max) <= max) return numeApp[i][1];
      }
      return null;
    }
    function inceputuri(w) {
      var r = new Set();
      if (w.length < 3) return r;
      vocabular.forEach(function (rad, v) { if (rad[0] !== '@' && v.length > w.length && v.lastIndexOf(w, 0) === 0 && df.has('s:' + rad)) r.add(rad); });
      return r;
    }

    // întrebarea -> jetoanele lămurite (cu rădăcina corectată, factorul de încredere și idf-ul)
    function intelege(text) {
      var A = analizeaza(D, text);
      var P = R.potrivire;
      var tastare = !/\s$/.test(String(text || ''));
      var jet = [];
      A.jetoane.forEach(function (j, nrJ) {
        var t = { w: j.w, s: j.s, g: j.g, f: 1, fel: 'exact', ps: null };
        // numele aplicației scris greșit („powerpiont”, „exel”), chiar dacă greșeala apare și în formulările în plus:
        // un cuvânt fără sens în dicționar, rar sau necunoscut câmpurilor tari, la o literă de numele aplicației
        if (R.app_rar && !j.fraza && !t.g.size && (!vocabular.has(j.w) || (df.get('s:' + t.s) || 0) <= R.rar_df)) {
          var ca = numeAplicatieGresit(j.w);
          if (ca) { A.vot[ca] = (A.vot[ca] || 0) + 3; A.numite[ca] = true; return; }
        }
        if (!cunoscut(t)) {
          var c = j.fraza ? null : corecteaza(j.w);
          if (c && c.stop) return;
          if (c && c.s[0] === '@') { var ap = c.s.slice(1); A.vot[ap] = (A.vot[ap] || 0) + 3; A.numite[ap] = true; return; }
          if (c) {
            t.s = c.s; t.g = grupuri(D, c.w, c.s); t.f = c.d === 1 ? P.greseala_1 : P.greseala_2; t.fel = 'greșeală→' + c.w;
          } else if (tastare && nrJ === A.jetoane.length - 1 && j.w.length >= 3 && (t.ps = inceputuri(j.w)).size) {
            t.f = P.prefix; t.fel = 'început';
          } else { t.fel = 'necunoscut'; t.f = 0; }
        } else if (!j.fraza && R.rar_df && !t.g.size && (df.get('s:' + t.s) || 0) <= R.rar_df) {
          var cr = corecteazaRar(j.w, df.get('s:' + t.s) || 0);
          if (cr) { t.alt = { s: cr.s, g: grupuri(D, cr.w, cr.s), f: cr.d === 1 ? P.greseala_1 : P.greseala_2 }; t.fel = 'rar~' + cr.w; }
        }
        t.idf = t.fel === 'necunoscut' ? idfMax * R.necunoscut : (t.fel === 'început' ? idfMediu : (idfJeton(t) || idfMediu));
        if (t.alt) t.idf = Math.min(t.idf, idfJeton(t.alt) || t.idf);
        jet.push(t);
      });
      // aplicația dedusă: cele mai multe puncte, fără egalitate
      var dedusa = null, max = 0, egal = false;
      Object.keys(A.vot).forEach(function (a) {
        if (A.vot[a] > max) { max = A.vot[a]; dedusa = a; egal = false; } else if (A.vot[a] === max) egal = true;
      });
      if (egal) dedusa = null;
      return { jetoane: jet, dedusa: dedusa, numita: !!(dedusa && A.numite[dedusa]), text: A.text };
    }

    function potrivire(t, s, g) {
      var P = R.potrivire;
      if (s.has(t.s)) return P.radacina;
      if (seIntersecteaza(t.g, g)) return P.sens;
      if (t.ps && seIntersecteaza(t.ps, s)) return 1;   // factorul „început” e deja în t.f
      if (t.alt) {                                         // cuvântul rar, citit ca greșeală a unuia des
        if (s.has(t.alt.s)) return t.alt.f;
        if (seIntersecteaza(t.alt.g, g)) return t.alt.f * P.sens;
      }
      return 0;
    }

    var fxTare = R.fx_tare || 0;
    var incertTare = R.incert_tare == null ? 1 : R.incert_tare;
    var lungM = R.lung_m || 0;
    // formulările în plus: potrivirea cântărită cu numărul de fraze în care apare cheia (1, 2, 3+)
    // la ordonare (tfF) și, separat, la „am găsit” (tfT)
    var tf1 = R.fx_tf1 == null ? 1 : R.fx_tf1, tf2 = R.fx_tf2 == null ? 1 : R.fx_tf2;
    var tt1 = R.fx_tare_tf1 == null ? tf1 : R.fx_tare_tf1, tt2 = R.fx_tare_tf2 == null ? tf2 : R.fx_tare_tf2;
    function tfF(n) { return n >= 3 ? 1 : (n === 2 ? tf2 : tf1); }
    function tfT(n) { return n >= 3 ? 1 : (n === 2 ? tt2 : tt1); }
    function maxTfGrup(gs, C) { var m = 0; gs.forEach(function (g) { var n = C.tf.get('g:' + g) || 0; if (n > m) m = n; }); return m; }
    // întoarce potrivirea de bază și pune în fxN în câte fraze apare cheia potrivită
    var fxN = 0;
    function potrivireFx(t, C) {
      var P = R.potrivire, n;
      if ((n = C.tf.get('s:' + t.s))) { fxN = n; return P.radacina; }
      if (t.g.size && (n = maxTfGrup(t.g, C))) { fxN = n; return P.sens; }
      if (t.ps) { var b = 0; t.ps.forEach(function (x) { var k = C.tf.get('s:' + x); if (k > b) b = k; }); if (b) { fxN = b; return 1; } }
      if (t.alt) {
        if ((n = C.tf.get('s:' + t.alt.s))) { fxN = n; return t.alt.f; }
        if (t.alt.g.size && (n = maxTfGrup(t.alt.g, C))) { fxN = n; return t.alt.f * P.sens; }
      }
      return 0;
    }
    // frazele formulărilor în plus ale unei fișe, analizate doar când e nevoie (la primul rezultat), apoi ținute minte
    function fraziFx(E) {
      if (E.fraziFx) return E.fraziFx;
      E.fraziFx = E.fxText.map(function (t) {
        var a = analizeaza(D, t, true, E.fxNorm);
        var Pz = { s: new Set(), g: new Set(), w: 0 };
        if (R.grup_nume_aplicatie && Object.keys(a.numite).length) Pz.g.add(R.grup_nume_aplicatie);
        a.jetoane.forEach(function (j) {
          Pz.s.add(j.s);
          j.g.forEach(function (g) { var ag = D.aplicGrup.get(g); if (!ag || ag === E.app) Pz.g.add(g); });
          if (!j.parte) Pz.w += idfJeton(j) || idfMediu;
        });
        return Pz;
      }).filter(function (Pz) { return Pz.s.size; });
      return E.fraziFx;
    }
    // cât de aproape e întrebarea de cea mai apropiată formulare în plus a fișei (Dice, ca la „fraza”)
    function diceFx(E, Q, numitor) {
      var best = 0, L = fraziFx(E);
      for (var p = 0; p < L.length; p++) {
        var Pz = L[p], inter = 0;
        for (var k = 0; k < Q.length; k++) {
          if (!Q[k].f) continue;
          var mm = potrivire(Q[k], Pz.s, Pz.g);
          if (mm) inter += Q[k].idf * Q[k].f * mm;
        }
        var d = inter ? 2 * inter / (numitor + Pz.w) : 0;
        if (d > best) best = d;
      }
      return best;
    }
    function puncteaza(E, Q, numitor, jur) {
      var W = R.ponderi_campuri;
      var acop = 0, tare = 0, deCe = [], nTare = 0, tareA = 0;
      for (var q = 0; q < Q.length; q++) {
        var t = Q[q];
        if (!t.f) continue;
        var best = 0, bestTare = 0, bestA = 0;
        for (var c = 0; c < CAMPURI.length; c++) {
          var C = E.c[CAMPURI[c]];
          var w = W[CAMPURI[c]] || 0;
          if (!w) continue;
          var wt = c < NR_TARI ? w : (c === IX_FX ? w * fxTare : 0);   // cât contează la „am găsit”
          if (w <= best && wt <= bestTare) continue;
          var m, mt;
          if (c === IX_FX) { m = potrivireFx(t, C); mt = m * tfT(fxN); m *= tfF(fxN); } else mt = m = potrivire(t, C.s, C.g);
          if (!m && !mt) continue;
          if (w * m > best) best = w * m;
          if (wt * mt > bestTare) bestTare = wt * mt;
          if (c < NR_TARI && w * m > bestA) bestA = w * m;
        }
        if (best > 0) { acop += t.idf * t.f * best; deCe.push(t.w); }
        // la „am găsit”, un cuvânt ghicit (greșeală de tastare, început de cuvânt) cântărește mai puțin
        var inc = t.fel !== 'exact' && t.fel.charAt(0) !== 'r' ? incertTare : 1;
        tare += t.idf * t.f * bestTare * inc;
        tareA += t.idf * t.f * bestA;
        if (bestTare > lungM) nTare++;
        if (jur) jur.push({ i: t.idf * t.f * inc, t: bestTare, a: bestA });
      }
      var fraza = 0, identDice = 0, fq = 0;
      for (var p = 0; p < E.fraze.length; p++) {
        var Pz = E.fraze[p], inter = 0;
        for (var k = 0; k < Q.length; k++) {
          if (!Q[k].f) continue;
          var mm = potrivire(Q[k], Pz.s, Pz.g);
          if (mm) inter += Q[k].idf * Q[k].f * mm;
        }
        var dice = inter ? 2 * inter / (numitor + Pz.w) : 0;
        if (inter > fq) fq = inter;
        if (Pz.fx) dice *= R.fx_fraza;
        if (dice > fraza) fraza = dice;
        if (p < E.nIdent && dice > identDice) identDice = dice;
      }
      var a = numitor ? acop / numitor : 0;
      // „identitatea” fișei: cât de aproape e întrebarea de titlu sau de întrebarea-tip (Dice, deci un titlu scurt
      // și la obiect trece înaintea unuia lung care doar pomenește cuvântul; o formulare de pe margine nu ajunge)
      var ident = R.pondere_identitate ? identDice : 0;
      return { acoperire: a, tare: numitor ? tare / numitor : 0, tareA: numitor ? tareA / numitor : 0, nTare: nTare, fraza: fraza, ident: ident,
        fq: numitor ? fq / numitor : 0,
        scor: a + R.pondere_fraza * fraza + (R.pondere_identitate || 0) * ident, de_ce: deCe };
    }

    function propuneriImplicite(app, exclude, n) {
      var o = [];
      for (var i = 0; i < intrari.length && o.length < n; i++) {
        var E = intrari[i];
        if (app && E.app !== app) continue;
        if (exclude.indexOf(E.f.id) < 0) o.push(E.f.id);
      }
      return o;
    }

    function cauta(text, opt) {
      opt = opt || {};
      var max = opt.max || 10;
      var filtru = APLICATII.indexOf(opt.aplicatie) >= 0 ? opt.aplicatie : null;
      var I = intelege(text);
      var Q = I.jetoane;
      var rez = { gasit: false, aplicatieDedusa: I.dedusa, rezultate: [], propuneri: [] };
      var numitor = Q.reduce(function (s, t) { return s + t.idf; }, 0);
      if (!Q.length) {
        // doar numele aplicației („excel”): fișele ei, în ordinea lor
        var app = filtru || I.dedusa;
        if (app && I.numita) {
          rez.gasit = true;
          // întâi fișele care pomenesc chiar numele scris („file explorer” -> „Deschizi File Explorer”), apoi restul, în ordine
          var Qn = [];
          I.text.split(' ').forEach(function (w) {
            if (!w || D.stop.has(w) || w.length < 2) return;
            var tn = { w: w, s: radacina(w), g: grupuri(D, w, radacina(w)), f: 1, fel: 'exact', ps: null };
            tn.idf = idfJeton(tn) || idfMediu;
            Qn.push(tn);
          });
          var numN = Qn.reduce(function (s, t) { return s + t.idf; }, 0);
          rez.rezultate = intrari.filter(function (E) { return E.app === app; })
            .map(function (E) { return { E: E, sc: Qn.length ? puncteaza(E, Qn, numN).scor : 0 }; })
            .sort(function (a, b) { return (b.sc - a.sc) || (a.E.ix - b.E.ix); }).slice(0, max)
            .map(function (x) { return { id: x.E.f.id, scor: Math.round(x.sc * 1000) / 1000, acoperire: 0, de_ce: [] }; });
        }
        return rez;
      }
      // candidații: fișele care au măcar o cheie a întrebării
      // candidații: fișele care au măcar o cheie a întrebării, fiecare cu o margine de sus a acoperirii (idf-ul
      // cuvintelor pe care le are, în orice câmp); se punctează pe larg doar primii max_candidati după margine
      var cand = [], margine = new Float64Array(N), vazut = new Int32Array(N);
      Q.forEach(function (t, k) {
        if (!t.f) return;
        var semn = k + 1, w = t.idf * t.f;
        function ia(p) { if (p) p.forEach(function (x) { if (vazut[x] !== semn) { vazut[x] = semn; if (!margine[x]) cand.push(x); margine[x] += w; } }); }
        ia(postari.get('s:' + t.s));
        t.g.forEach(function (g) { ia(postari.get('g:' + g)); });
        if (t.ps) t.ps.forEach(function (s) { ia(postari.get('s:' + s)); });
        if (t.alt) { ia(postari.get('s:' + t.alt.s)); t.alt.g.forEach(function (g) { ia(postari.get('g:' + g)); }); }
      });
      if (filtru) cand = cand.filter(function (ix) { return intrari[ix].app === filtru; });
      var maxC = R.max_candidati || 0;
      if (maxC && cand.length > maxC) {
        cand.sort(function (a, b) { return (margine[b] - margine[a]) || (a - b); });
        var prag = margine[cand[maxC - 1]];
        var taie = maxC;
        while (taie < cand.length && margine[cand[taie]] >= prag) taie++;   // egalitățile de la margine rămân
        cand = cand.slice(0, taie);
      }
      var lista = [];
      cand.forEach(function (ix) {
        var E = intrari[ix];
        if (filtru && E.app !== filtru) return;
        var p = puncteaza(E, Q, numitor);
        if (!p.acoperire) return;
        if (I.dedusa && E.app !== I.dedusa) p.scor *= I.numita ? R.alta_aplicatie_numita : R.alta_aplicatie_indiciu;
        lista.push({ E: E, p: p });
      });
      lista.sort(function (a, b) { return (b.p.scor - a.p.scor) || (b.p.acoperire - a.p.acoperire) || (a.E.ix - b.E.ix); });
      var top = lista[0];
      // frazele lungi au și cuvinte de context („colegul”, „acum”, „pe tablă”): dacă primul rezultat potrivește
      // pe câmpurile tari măcar lung_potrivite cuvinte, ajunge pragul mai mic prag_lung (din afara materiei, în
      // setul de dezvoltare, primul rezultat potrivește cel mult 2 cuvinte)
      var pragTop = top && R.lung_potrivite && top.p.nTare >= R.lung_potrivite ? Math.min(R.prag, R.prag_lung) : R.prag;
      var peste = !!(top && top.p.tare >= pragTop);
      // sub prag, dar întrebarea seamănă tare cu una dintre formulările în plus ale primei fișe (Dice >= fx_dice):
      // copiii întreabă cu vorbe de context („la geografie”, „colegul”) pe care fișa nu le are, dar fraza e a ei
      if (top && !peste && R.fx_dice && top.E.fxText.length && diceFx(top.E, Q, numitor) >= R.fx_dice) peste = true;
      rez.gasit = peste && !(I.numita && I.dedusa && top.E.app !== I.dedusa && !filtru);
      // întrebarea cere un gest care nu e în materie, iar primul rezultat nu-l pomenește: „n-am găsit” + propuneri
      if (top && (rez.gasit || opt.diag) && R.veto !== false && D.veto.length) {
        var taie = false;
        vetoIn(D, I.text ? I.text.split(' ').map(radacina) : []).forEach(function (x) { if (!top.E.veto.has(x)) taie = true; });
        if (taie) rez.gasit = false;
        if (opt.diag) rez.vetoTaie = taie;
      }
      if (opt.diag && top) { rez.jur = []; puncteaza(top.E, Q, numitor, rez.jur); rez.diceFx = diceFx(top.E, Q, numitor); }
      if (opt.diag) rez.diag = { ids: lista.slice(0, 3).map(function (x) { return x.E.f.id; }), top: top ? { id: top.E.f.id, p: top.p, app: top.E.app } : null, doi: lista[1] ? { id: lista[1].E.f.id, p: lista[1].p } : null,
        Q: Q.map(function (t) { return { w: t.w, fel: t.fel, idf: t.idf, f: t.f }; }), numitor: numitor, dedusa: I.dedusa, numita: I.numita };
      if (rez.gasit) {
        rez.rezultate = lista.filter(function (x) { return x.p.acoperire >= R.scor_minim; }).slice(0, max).map(function (x) {
          return { id: x.E.f.id, scor: Math.round(x.p.scor * 1000) / 1000, acoperire: Math.round(x.p.tare * 1000) / 1000, de_ce: x.p.de_ce };
        });
      } else {
        // propunerile: întâi cele din aplicația cerută / dedusă, apoi oricare
        var app2 = filtru || I.dedusa;
        var ord = lista.slice().sort(function (a, b) {
          var pa = app2 && a.E.app === app2 ? 1 : 0, pb = app2 && b.E.app === app2 ? 1 : 0;
          return (pb - pa) || (b.p.scor - a.p.scor) || (a.E.ix - b.E.ix);
        });
        rez.propuneri = ord.slice(0, 3).map(function (x) { return x.E.f.id; });
        if (rez.propuneri.length < 3) rez.propuneri = rez.propuneri.concat(propuneriImplicite(app2, rez.propuneri, 3 - rez.propuneri.length));
        if (rez.propuneri.length < 3) rez.propuneri = rez.propuneri.concat(propuneriImplicite(null, rez.propuneri, 3 - rez.propuneri.length));
      }
      return rez;
    }

    // pentru depanare (evalueaza.mjs --detalii): cum a înțeles întrebarea și de unde vine scorul
    function explica(text, opt) {
      var I = intelege(text);
      var numitor = I.jetoane.reduce(function (s, t) { return s + t.idf; }, 0);
      var r = cauta(text, opt);
      var ids = (r.gasit ? r.rezultate.map(function (x) { return x.id; }) : r.propuneri).slice(0, 5);
      return {
        normalizat: I.text,
        aplicatieDedusa: I.dedusa, numita: I.numita,
        jetoane: I.jetoane.map(function (t) {
          return { w: t.w, rad: t.s, sensuri: Array.from(t.g || []), fel: t.fel, idf: Math.round(t.idf * 100) / 100 };
        }),
        primele: ids.map(function (id) {
          var E = intrari.filter(function (x) { return x.f.id === id; })[0];
          var p = puncteaza(E, I.jetoane, numitor);
          return { id: id, acoperire: Math.round(p.acoperire * 1000) / 1000, tare: Math.round(p.tare * 1000) / 1000, nTare: p.nTare, fraza: Math.round(p.fraza * 1000) / 1000, de_ce: p.de_ce };
        }),
        rezultat: r
      };
    }

    // pentru depanare: scorul unei fișe anume la o întrebare și locul ei în listă
    function explicaId(text, id) {
      var I = intelege(text);
      var numitor = I.jetoane.reduce(function (s, t) { return s + t.idf; }, 0);
      var E = intrari.filter(function (x) { return x.f.id === id; })[0];
      if (!E) return null;
      var p = puncteaza(E, I.jetoane, numitor);
      var sc = p.scor * (I.dedusa && E.app !== I.dedusa ? (I.numita ? R.alta_aplicatie_numita : R.alta_aplicatie_indiciu) : 1);
      var loc = 1;
      intrari.forEach(function (X) {
        if (X === E) return;
        var q = puncteaza(X, I.jetoane, numitor);
        var s = q.scor * (I.dedusa && X.app !== I.dedusa ? (I.numita ? R.alta_aplicatie_numita : R.alta_aplicatie_indiciu) : 1);
        if (q.acoperire && s > sc) loc++;
      });
      var r3 = function (x) { return Math.round(x * 1000) / 1000; };
      return { acoperire: r3(p.acoperire), tare: r3(p.tare), fraza: r3(p.fraza), ident: r3(p.ident), scor: r3(sc), loc: loc, de_ce: p.de_ce };
    }

    var dupaId = {};
    fise.forEach(function (f) { dupaId[f.id] = f; });
    return {
      cauta: cauta,
      explica: explica,
      explicaId: explicaId,
      fisa: function (id) { return dupaId[id] || null; },
      fise: fise,
      numar: N,
      etichete: D.etichete,
      reglaj: R,
      vocabular: vocabular.size
    };
  }

  // ---------------------------------------------------------------- glosarul (_sursa/termeni.json)
  // Termenii glosarului găsiți într-un text: cuvânt întreg, fără diacritice, pe „t” și pe „forme”; doar cei ai
  // aplicației (sau cu „aplicatii” gol), afară de cazul toateAplicatiile. În ordinea în care apar în text.
  function gasesteTermeni(text, glosar, aplicatie, toateAplicatiile) {
    var t = ' ' + normalizeaza(text) + ' ';
    var o = [];
    (glosar || []).forEach(function (g) {
      if (!g || !g.t) return;
      var ap = g.aplicatii || [];
      var inAplicatie = !ap.length || ap.indexOf(aplicatie) >= 0;
      if (!inAplicatie && !toateAplicatiile) return;
      var chei = [g.t].concat(g.forme || []).map(normalizeaza).filter(Boolean);
      var poz = -1;
      chei.forEach(function (k) { var p = t.indexOf(' ' + k + ' '); if (p >= 0 && (poz < 0 || p < poz)) poz = p; });
      if (poz >= 0) o.push({ g: g, poz: poz, inAplicatie: inAplicatie, chei: chei });
    });
    o.sort(function (a, b) { return a.poz - b.poz; });
    return o;
  }
  // „Cuvinte de știut” ale unei fișe: întâi fisa.termeni, apoi termenii glosarului găsiți în pași și în rezultat,
  // fără dubluri (un termen al glosarului e dublură dacă oricare formă a lui e deja un termen al fișei).
  function termeniFisa(f, glosar) {
    var lista = [], vazute = new Set();
    (f.termeni || []).forEach(function (x) {
      var k = normalizeaza(x && x.t);
      if (k && !vazute.has(k)) { vazute.add(k); lista.push({ t: x.t, d: x.d, din: 'fisa', forme: [k] }); }
    });
    var text = (f.pasi || []).concat([f.rezultat || '']).join(' . ');
    gasesteTermeni(text, glosar, f.aplicatie).forEach(function (m) {
      if (m.chei.some(function (k) { return vazute.has(k); })) return;
      m.chei.forEach(function (k) { vazute.add(k); });
      lista.push({ t: m.g.t, d: m.g.d, din: 'glosar', forme: m.chei });
    });
    return lista;
  }
  // pentru raportul din build: termenii glosarului din pașii fișei, dar ai ALTEI aplicații, pe care fișa nu-i are
  // nici în fisa.termeni și nici prin glosarul aplicației ei
  function termeniNeacoperiti(f, glosar) {
    var acoperite = new Set();
    termeniFisa(f, glosar).forEach(function (x) { x.forme.forEach(function (k) { acoperite.add(k); }); });
    var text = (f.pasi || []).concat([f.rezultat || '']).join(' . ');
    return gasesteTermeni(text, glosar, f.aplicatie, true)
      .filter(function (m) { return !m.inAplicatie && !m.chei.some(function (k) { return acoperite.has(k); }); })
      .map(function (m) { return m.g.t; });
  }

  return {
    versiune: VERSIUNE,
    aplicatii: APLICATII.slice(),
    termeniFisa: termeniFisa,
    termeniNeacoperiti: termeniNeacoperiti,
    gasesteTermeni: gasesteTermeni,
    creeaza: creeaza,
    normalizeaza: normalizeaza,
    radacina: radacina,
    distanta: distanta
  };
});
