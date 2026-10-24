/* lectii/_sim/scratch.js — SimScratch: editorul Scratch 3, simulat în pagină (paleta cu categorii, zona de cod,
   scena cu personajul, steagul verde și butonul Stop), cu blocuri TRASE cu mouse-ul sau cu degetul (pointer events).

   PROPRIETAR: lecția VI/18 (lectii/vi/m3-l18, „Aplicația de exersare a algoritmilor: interfață și instrumente de bază”,
   24.10.2026). Lecțiile următoare (VI/19-26: repetiția, decizia, blocurile) îl EXTIND cu fișiere NOI
   (`lectii/_sim/scratch-<ceva>.js`), prin `SimScratch.bloc(...)` / `SimScratch.categorie(...)`; NU îl rescriu și NU
   schimbă ce e scris mai jos. Granița: _campaign/revizuire_completa_2026_09/m3_noapte_23_10/granite/vi_l18.md.

   FIDELITATEA (regula 9) — fapte PROBATE în editorul viu scratch.mit.edu (Chromium headless, fără cont, 24.10.2026,
   lectii/vi/m3-l18/_proba/live_scratch*.py → live/rezultat.json):
     - numele blocurilor și ale categoriilor = textul din editorul viu în română (traducerea oficială scratch-l10n);
       „mergi la x (0) y: (0)” fără „:” după x (așa e azi în editor);
     - culorile categoriilor (bulina și marginea) și forma blocurilor (căile SVG ale editorului: pălăria, stiva cu
       crestătură, blocul C, raportorul rotunjit, booleanul în șase colțuri), la scara editorului (aici 0,72 / 0,68);
     - gesturi: tragi un bloc din paletă în zona de cod; se lipește dacă îl lași aproape (sub un bloc, în gura unui
       bloc C, deasupra unei stive fără pălărie); tras din MIJLOCUL unei stive, vin și blocurile de sub el; tras înapoi
       în paletă = șters; clic pe un bloc din zona de cod = rulează toată stiva lui (clic din nou cât rulează = o
       oprește); clic pe un bloc din paletă = rulează doar blocul acela; clic dreapta (pe telefon: ții apăsat) pe bloc
       → Duplică · Adaugă comentariu · Șterge blocul; după clic pe un bloc, tasta Delete îl șterge doar pe el, iar cele
       de sub el urcă; Ctrl+Z / Ctrl+Y = anulează / refă; câmpul numeric primește doar cifre, „.” și „-” („5a0” → „50”,
       probat); personajul se poate trage pe scenă (ca în editor; acest gest NU e probat viu, lecția nu-l cere);
     - steagul verde oprește tot și pornește de la capăt scripturile cu „când se dă click pe ⚑” (balonul vechi dispare);
       butonul Stop oprește tot și șterge baloanele; pisica NU se întoarce singură la start (pornește de unde a rămas);
       scena: x de la −240 la 240, y de la −180 la 180, direcția 90 = spre dreapta; Scratch ține pisica pe scenă:
       la direcția 90, x între −272 și 272, y între −214 și 215 (măsurat); la alte direcții, cutia rotită (aproximare);
     - 30 de cadre pe secundă; blocurile de mișcare sunt instantanee (vezi doar unde ajunge pisica); „spune … pentru 2
       secunde” și „așteaptă” țin scriptul pe loc atâtea secunde;
     - (1.1, 24.10.2026, după judecata 1) în PALETĂ, numerele din „mergi la x … y: …”, „setează x la …” și „setează y
       la …” arată poziția de ACUM a personajului, rotunjită (probat viu de ambii judecători și de reparare: după 3
       steaguri cu „mergi 10 pași”, paleta arată „mergi la x 30 y: 0”; la fel face editorul: scratch-gui, blocks.jsx,
       onTargetsUpdate). Un bloc tras din paletă ia numerele de atunci; elevul le schimbă (clic pe câmp, scrie, Enter).
   ABATERI SPUSE PE ECRAN: paleta are doar blocurile cerute de lecție (în Scratch sunt mult mai multe) și pisica e
   desenată mai simplu (nota de sub paletă); „Adaugă comentariu” doar spune ce face în Scratch; butonul „Pas cu pas”
   e DOAR în pagină (Scratch nu-l are); scena e mică (Scratch are și el „scena mică”); pe telefon, meniul blocului se
   deschide ținând degetul apăsat.
   1.2 (24.10.2026, componenta comună, după judecățile VI/19 și VI/20) — DEFECTELE DE TELEFON (la 390 px zona de cod
   are ~133 px): (1) după ce închizi caseta unui câmp (Enter, Escape, atingere în altă parte), zona de cod revine
   singură spre stânga cât să se vadă marginea stângă a programului (rămânea derulată ~89 px, iar blocul tras din
   paletă sub program cădea deoparte); cu degetul, atingerea unui bloc din paletă închide și ea caseta; (2) cât zona e
   derulată spre dreapta, locurile de lipire ascunse la stânga se măsoară față de marginea văzută a zonei; (3) în zona
   de cod, degetul pus pe un loc gol de lângă un bloc derulează zona (înainte, „atracția” atingerii spre bloc îl
   apuca și rupea programul); (4) blocul tras cu degetul din zona de cod rămâne în document, ascuns, până ridici
   degetul (înainte, prima atingere de după, ex. pe steag, se pierdea uneori). Probele: _campaign/revizuire_completa_
   2026_09/m3_noapte_23_10/scratch_12/ (proba_telefon.py, dbg_steag.py, raport.md). Mouse și taste: neschimbate.
   ABATERI NESPUSE PE ECRAN (1.2, mărunte, doar cât zona e derulată în lateral): Scratch nu derulează singur zona la
   închiderea unui câmp și nu lipește de un loc ascuns; aici da, ca blocurile să nu se piardă pe ecranul mic.
   1.3 (24.10.2026, componenta comună, după judecățile VI/21 [MAJOR] și VI/20, VI/19) — ȚINTELE DE ATINGERE (regula 20:
   ≥ 32 × 32 px pe telefon), DOAR pe ecranele cu deget (`@media (pointer: coarse)`), cu zone INVIZIBILE: desenul și
   așezarea blocurilor nu se schimbă (nici pe telefon, nici la 1280). (1) câmpurile (.ss-pill: numere, texte, liste ▾)
   din paletă și din zona de cod se ating pe toată înălțimea rândului: 48u = 32,6 px (la --ss-u .68), × lățimea + 6 px;
   înainte, zona lor (−7 px) trecea ~1,5 px în blocul de deasupra: o atingere pe marginea de jos a unui bloc deschidea
   câmpul blocului de dedesubt; (2) raportoarele și booleenele („poziția x”, „( ) > 50”, „atinge … ▾?”),
   înalte de 40u = 27 px, au sus și jos câte o margine invizibilă de 4u (2,7 px) → 32,6 px, cât rândul blocului în
   care stau (nu trec în vecini); (3) cu DEGETUL, cu caseta unui câmp deschisă, atingerea altui câmp sau bloc își face
   treaba DIN PRIMA (alt câmp → se deschide; bloc → rulează sau se trage; ținut apăsat → meniul blocului). Înainte,
   închiderea casetei redesena zona chiar în pointerdown: elementul atins ieșea din pagină, iar atingerea se pierdea
   (trebuia a doua). Acum blocul redesenat (același uid) preia atingerea, iar cel vechi stă ascuns în „parcarea” din
   1.2 până după ridicarea degetului; zona de cod NU mai fuge atunci spre stânga (ar muta câmpul de sub deget), iar o
   atingere pe chiar câmpul deschis îl lasă deschis. Probele: _campaign/revizuire_completa_2026_09/m3_noapte_23_10/
   scratch_13/ (tinte.py, comportamente.py, raport.md). Mouse și taste: neschimbate (desen, ținte și pași, probat).

   API PUBLIC (window.SimScratch) — stabil de la 24.10.2026; orice schimbare se trece în graniță, cu data:
     versiune                                            '1.3 (24.10.2026)' — înainte '1.2 (24.10.2026)', '1.1 (24.10.2026)'
                                                         (1.1 = paleta urmează personajul, `dinPersonaj`; 1.2 = defectele
                                                         de telefon de mai sus; 1.3 = țintele de atingere ≥ 32 px și
                                                         atingerile din prima cu o casetă deschisă; API-ul NESCHIMBAT)
     categorie(id, {nume, en, culoare, margine})       categoriile (cele 9 ale editorului sunt deja înregistrate:
                                                         miscare, aspect, sunet, evenimente, control, detectare,
                                                         operatori, variabile, blocurile_mele)
     categorii() → [{id, nume, en, culoare, margine}…]  în ordinea editorului
     bloc(id, def)                                       înregistrează un bloc. def = {
         cat: 'miscare'|…,  forma: 'palarie'|'stiva'|'capac'|'c'|'raportor'|'boolean',
         text: 'mergi [n:10] pași'   — câmpurile, în ordine, sunt valorile v[0], v[1]…:
                [n:10] număr  ·  [t:Salut!] text  ·  [b] loc de condiție (bloc boolean)  ·  [m:a|b|c] listă;
                la forma 'c', rândurile se despart cu „ | ” (ex. 'dacă [b] atunci | altfel' = 2 guri);
                ⚑ = steagul verde (desenat), ↻ ↺ = săgețile de rotire;
         dinPersonaj: ['x', 'y'] (opțional; 1.1) — în PALETĂ, câmpul i ia Math.round(personaj[dinPersonaj[i]]) la
               fiecare mișcare a personajului (null = câmp care nu urmează); au deja: mergi_la_xy ['x','y'],
               seteaza_x ['x'], seteaza_y ['y']; un „glisează … la x: y:” nou (VI/24) pune [null, 'x', 'y'];
         en: 'move %1 steps' (opțional, pentru surse),  final: true (fără crestătură jos: „la infinit”),
         executa: function*(ctx, v, nod) { … }   generator; `yield` = așteaptă cadrul următor (1/30 s);
               ctx.personaj: {x, y, directie, mergi(n), roteste(grade), mergiLa(x, y), orienteaza(d), spune(text, sec?),
                              gandeste(text, sec?)} · ctx.asteapta(sec) (generator: `yield* ctx.asteapta(1)`) ·
               ctx.ruleaza(lista) (generator: `yield* ctx.ruleaza(nod.guri[0])`) · ctx.valoare(nod, i) (reevaluează
               câmpul i: pentru condiții la fiecare trecere) · ctx.noteaza(tip, valoare) · ctx.cadru · ctx.oprestetot();
         valoare: function(ctx, v, nod) { return … }   pentru 'raportor' / 'boolean' (fără yield) }
     def(id) → definiția înregistrată (cea de mai sus, cu .randuri, .campuri)  ·  blocuri() → [id…] (toate înregistrate)
     creeaza(element, optiuni) → instanța. optiuni = {
         paleta: ['steag', 'mergi', …] (ordinea categoriilor e a editorului),  program: [script, …] (de început),
         personaj: {nume:'Sprite1', x:0, y:0, directie:90} (de aici pornesc și pisica, și numerele din paletă, și
                   testele fără `o`),  teste: [{ce, msg, ok(U, P, S), o?:{x,y,directie}}],
         pasCuPas: true (butonul „Pas cu pas”, implicit da),  nota: 'text sub paletă' (opțional; implicit spune că
                   paleta are doar blocurile de azi și că pisica e desenată mai simplu) }
       instanța: .program() / .seteaza(program) · .steag() · .opreste() · .stare() → {x, y, directie, balon, ruleaza,
         apasatSteag, oprit} · .urma(o?) → U · .verifica() → {ok, n, total, msg, rez:[bool…]} · .on(nume, fn) ·
         .punePersonaj({x, y, directie}) (oprește și mută pisica; paleta urmează) · .ruleazaClic(si) (ca un clic pe
         scriptul si) · .element
     urma(program, o?) → U = {x, y, directie, spuse:[text…], evenimente:[{cadru, tip, valoare}], executate:[id…],
                            terminat, cadre}   (rulare fără ecran, de la steag; o = {x, y, directie, cadre})
     ajutor: {cuSteag(P), dupaSteag(P) → [id…] (sub PRIMUL „când se dă click pe ⚑”), libere(P) (scripturi fără
              pălărie), toate(P) → [id…], valori(P, id) → [[…], …]}
     BLOCURI DESENATE ÎN TEXT (fără tragere; ca STIVA din lectii/vi/m3-l18/index.html):
       stil() — pune o dată foaia de stil a simulatorului (creeaza() o pune singur);
       html(spec, {paleta?}) → șirul HTML al unui bloc (spec = ['mergi', 10] etc.), pus într-un .ss > .ss-script;
       text(spec) → textul blocului, pe un rând („mergi 10 pași”), pentru aria-label / mesaje;
       deseneaza(el) → desenează formele (căile SVG) blocurilor din el; cheamă-l DUPĂ ce el e afișat (formele
                       depind de mărimea textului măsurată pe ecran: la display:none nu iese nimic).
     tipuri.scratch                                       tipul pentru motor (render / rezolva / gresit), câmpurile:
         Q.paleta, Q.program (sau Q.start), Q.personaj, Q.teste, Q.solutie, Q.gresit, Q.nota
   FORMATUL PROGRAMULUI (serializat, folosit și în pagini): listă de scripturi; script = {x, y, b:[bloc, …]};
     bloc = [id, valoare0, valoare1, …, {guri:[[bloc…], …], s:{i: bloc}}?]  (obiectul de la capăt doar dacă are guri
     sau câmpuri ocupate de alte blocuri). Ex.: {x:20, y:20, b:[['steag'], ['mergi', 10], ['spune_sec', 'Salut!', 2]]}.
   EVENIMENTE: pe window, 'scratch-sim' cu detail = {tip:'schimbat'|'pornit'|'oprit'|'terminat'|'verificat', inst, …};
     aceleași nume prin inst.on(tip, fn).
*/
(function () {
  'use strict';
  if (window.SimScratch) return;
  const VERSIUNE = '1.3 (24.10.2026)';
  const FPS = 30;
  const CAT = {};
  const DEF = {};
  const ORDINE_CAT = [];

  /* ---------------- categoriile (culorile citite din editorul viu, 24.10.2026) ---------------- */
  function categorie(id, o) {
    if (!CAT[id]) ORDINE_CAT.push(id);
    CAT[id] = Object.assign({id}, CAT[id] || {}, o);
  }
  categorie('miscare', {nume: 'Mișcare', en: 'Motion', culoare: '#4C97FF', margine: '#3373CC'});
  categorie('aspect', {nume: 'Aspect', en: 'Looks', culoare: '#9966FF', margine: '#774DCB'});
  categorie('sunet', {nume: 'Sunet', en: 'Sound', culoare: '#CF63CF', margine: '#BD42BD'});
  categorie('evenimente', {nume: 'Evenimente', en: 'Events', culoare: '#FFBF00', margine: '#CC9900'});
  categorie('control', {nume: 'Control', en: 'Control', culoare: '#FFAB19', margine: '#CF8B17'});
  categorie('detectare', {nume: 'Detectare', en: 'Sensing', culoare: '#5CB1D6', margine: '#2E8EB8'});
  categorie('operatori', {nume: 'Operatori', en: 'Operators', culoare: '#59C059', margine: '#389438'});
  categorie('variabile', {nume: 'Variabile', en: 'Variables', culoare: '#FF8C1A', margine: '#DB6E00'});
  categorie('blocurile_mele', {nume: 'Blocurile mele', en: 'My Blocks', culoare: '#FF6680', margine: '#FF3355'});

  /* ---------------- blocurile: textul se împarte în etichete și câmpuri ---------------- */
  function parseText(text) {
    return String(text).split(' | ').map(rand => {
      const parti = [];
      const re = /\[(n|t|b|m)(?::([^\]]*))?\]/g;
      let last = 0, m;
      while ((m = re.exec(rand))) {
        const et = rand.slice(last, m.index).trim();
        if (et) parti.push({e: et});
        const c = {c: m[1]};
        if (m[1] === 'm') { c.opt = (m[2] || '').split('|'); c.imp = c.opt[0]; } else c.imp = m[2] == null ? '' : m[2];
        parti.push(c);
        last = re.lastIndex;
      }
      const et = rand.slice(last).trim();
      if (et) parti.push({e: et});
      return parti;
    });
  }
  function bloc(id, def) {
    const d = Object.assign({id, forma: 'stiva'}, def);
    d.randuri = parseText(d.text);
    d.campuri = [];
    d.randuri.forEach(r => r.forEach(p => { if (p.c) d.campuri.push(p); }));
    d.guri = d.forma === 'c' ? Math.max(1, d.randuri.length) : 0;
    d.valoric = d.forma === 'raportor' || d.forma === 'boolean';
    DEF[id] = d;
    return d;
  }
  const nr = (s) => { const x = parseFloat(String(s).replace(',', '.')); return isFinite(x) ? x : 0; };

  /* ---- blocurile de bază ale lecției VI/18 (textul din editorul viu, 24.10.2026) ---- */
  bloc('steag', {cat: 'evenimente', forma: 'palarie', text: 'când se dă click pe ⚑', en: 'when green flag clicked'});
  bloc('mergi', {cat: 'miscare', text: 'mergi [n:10] pași', en: 'move %1 steps', *executa(ctx, v) { ctx.personaj.mergi(nr(v[0])); }});
  bloc('roteste_dr', {cat: 'miscare', text: 'rotește-te ↻ [n:15] grade', en: 'turn right %1 degrees', *executa(ctx, v) { ctx.personaj.roteste(nr(v[0])); }});
  bloc('roteste_st', {cat: 'miscare', text: 'rotește-te ↺ [n:15] grade', en: 'turn left %1 degrees', *executa(ctx, v) { ctx.personaj.roteste(-nr(v[0])); }});
  /* dinPersonaj (1.1): în paletă, numerele urmează personajul, ca în editor (după 3 steaguri: „mergi la x 30 y: 0”) */
  bloc('mergi_la_xy', {cat: 'miscare', text: 'mergi la x [n:0] y: [n:0]', en: 'go to x: %1 y: %2', dinPersonaj: ['x', 'y'], *executa(ctx, v) { ctx.personaj.mergiLa(nr(v[0]), nr(v[1])); }});
  bloc('orienteaza', {cat: 'miscare', text: 'orientează-te în direcția [n:90]', en: 'point in direction %1', *executa(ctx, v) { ctx.personaj.orienteaza(nr(v[0])); }});
  bloc('modifica_x', {cat: 'miscare', text: 'modifică x cu [n:10]', en: 'change x by %1', *executa(ctx, v) { const p = ctx.personaj; p.mergiLa(p.x + nr(v[0]), p.y); }});
  bloc('seteaza_x', {cat: 'miscare', text: 'setează x la [n:0]', en: 'set x to %1', dinPersonaj: ['x'], *executa(ctx, v) { const p = ctx.personaj; p.mergiLa(nr(v[0]), p.y); }});
  bloc('modifica_y', {cat: 'miscare', text: 'modifică y cu [n:10]', en: 'change y by %1', *executa(ctx, v) { const p = ctx.personaj; p.mergiLa(p.x, p.y + nr(v[0])); }});
  bloc('seteaza_y', {cat: 'miscare', text: 'setează y la [n:0]', en: 'set y to %1', dinPersonaj: ['y'], *executa(ctx, v) { const p = ctx.personaj; p.mergiLa(p.x, nr(v[0])); }});
  bloc('spune_sec', {cat: 'aspect', text: 'spune [t:Salut!] pentru [n:2] secunde', en: 'say %1 for %2 seconds', *executa(ctx, v) { yield* ctx.personaj.spune(v[0], nr(v[1])); }});
  bloc('spune', {cat: 'aspect', text: 'spune [t:Salut!]', en: 'say %1', *executa(ctx, v) { ctx.personaj.spune(v[0]); }});
  bloc('gandeste_sec', {cat: 'aspect', text: 'gândește [t:Hmm...] pentru [n:2] secunde', en: 'think %1 for %2 seconds', *executa(ctx, v) { yield* ctx.personaj.gandeste(v[0], nr(v[1])); }});
  bloc('gandeste', {cat: 'aspect', text: 'gândește [t:Hmm...]', en: 'think %1', *executa(ctx, v) { ctx.personaj.gandeste(v[0]); }});
  bloc('asteapta', {cat: 'control', text: 'așteaptă [n:1] secunde', en: 'wait %1 seconds', *executa(ctx, v) { yield* ctx.asteapta(nr(v[0])); }});

  /* ---------------- modelul: noduri ---------------- */
  let UID = 1;
  function nod(id, valori, extra) {
    const d = DEF[id];
    if (!d) throw new Error('SimScratch: blocul „' + id + '” nu e înregistrat');
    const v = d.campuri.map((c, i) => (valori && valori[i] != null ? String(valori[i]) : String(c.imp)));
    const n = {uid: UID++, id, v, s: {}, guri: []};
    for (let k = 0; k < d.guri; k++) n.guri.push([]);
    if (extra) {
      (extra.guri || []).forEach((g, k) => { n.guri[k] = (g || []).map(dinSpec); });
      Object.entries(extra.s || {}).forEach(([i, sp]) => { n.s[i] = dinSpec(sp); });
    }
    return n;
  }
  function dinSpec(sp) {
    if (!Array.isArray(sp)) sp = [sp];
    const [id, ...rest] = sp;
    let extra = null;
    if (rest.length && rest[rest.length - 1] && typeof rest[rest.length - 1] === 'object' && !Array.isArray(rest[rest.length - 1])) extra = rest.pop();
    return nod(id, rest, extra);
  }
  function spre(n) {
    const sp = [n.id].concat(n.v.map(x => (/^-?\d+(\.\d+)?$/.test(x) ? Number(x) : x)));
    const ex = {};
    if (n.guri.length) ex.guri = n.guri.map(g => g.map(spre));
    const sk = Object.keys(n.s);
    if (sk.length) { ex.s = {}; sk.forEach(i => { ex.s[i] = spre(n.s[i]); }); }
    if (ex.guri || ex.s) sp.push(ex);
    return sp;
  }
  const programDin = (P) => (P || []).map(sc => ({x: sc.x || 0, y: sc.y || 0, b: (sc.b || []).map(dinSpec)}));
  const programSpre = (scr) => scr.map(sc => ({x: Math.round(sc.x), y: Math.round(sc.y), b: sc.b.map(spre)}));
  const copie = (P) => JSON.parse(JSON.stringify(P));

  /* ---------------- execuția (aceeași pentru ecran și pentru teste) ---------------- */
  const roteste = (d) => { let r = ((d + 180) % 360 + 360) % 360 - 180; if (r === -180) r = 180; return Math.round(r * 1e6) / 1e6; };
  const rot = (v) => Math.round(v * 1e6) / 1e6;
  /* gardul scenei: pisica (cutia ei −47..47 × −50..49 față de centru) rămâne vizibilă cel puțin 15 unități */
  function gard(x, y, dir) {
    const a = (dir - 90) * Math.PI / 180, c = Math.abs(Math.cos(a)), s = Math.abs(Math.sin(a));
    const hw = 47 * c + 49.5 * s, hh = 47 * s + 49.5 * c;
    const lim = (v, m) => Math.max(-m, Math.min(m, v));
    return [lim(x, 240 + hw - 15), lim(y, 180 + hh - 15)];
  }
  function Motor(scripturi, st0, opt) {
    opt = opt || {};
    const S = {x: st0.x, y: st0.y, directie: st0.directie, balon: null, cadru: 0, fire: [], ev: [], executate: [], spuse: []};
    const note = (tip, valoare) => { S.ev.push({cadru: S.cadru, tip, valoare}); if (opt.laEveniment) opt.laEveniment(tip, valoare); };
    const pune = (x, y) => {
      const g = gard(x, y, S.directie);
      S.x = rot(g[0]); S.y = rot(g[1]);
      note('poz', [S.x, S.y]);
    };
    function balon(text, tip, sec) {
      const b = {text: String(text), tip, id: Math.random(), temporar: !!sec};
      S.balon = String(text) === '' ? null : b;
      if (String(text) !== '') { S.spuse.push(String(text)); note(tip, String(text)); }
      if (!sec || opt.pasCuPas) return (function* () {})();
      return (function* () {
        yield* asteapta(sec);
        if (S.balon && S.balon.id === b.id) S.balon = null;
      })();
    }
    function* asteapta(sec) {
      /* „Pas cu pas” (doar în pagină): timpul nu trece singur; balonul „pentru N secunde” stă până la pasul următor */
      if (opt.pasCuPas) return;
      const fin = S.cadru + Math.max(1, Math.round(nr(sec) * FPS));
      while (S.cadru < fin) yield;
    }
    const personaj = {
      get x() { return S.x; }, get y() { return S.y; }, get directie() { return S.directie; },
      mergi(n) { const r = S.directie * Math.PI / 180; pune(S.x + n * Math.sin(r), S.y + n * Math.cos(r)); },
      roteste(g) { S.directie = roteste(S.directie + g); note('dir', S.directie); },
      mergiLa(x, y) { pune(x, y); },
      orienteaza(d) { S.directie = roteste(d); note('dir', S.directie); },
      spune(t, sec) { return balon(t, 'spune', sec); },
      gandeste(t, sec) { return balon(t, 'gandeste', sec); }
    };
    function valoare(n, i) {
      const r = n.s[i];
      if (r) { const d = DEF[r.id]; return d.valoare ? d.valoare(ctx, r.v.map((_, k) => valoare(r, k)), r) : ''; }
      return n.v[i];
    }
    function* ruleaza(lista, fir) {
      for (const n of lista) {
        if (fir) fir.curent = n.uid;
        if (opt.pasCuPas) { yield 'pas'; if (S.balon && S.balon.temporar) S.balon = null; }
        S.executate.push(n.id);
        note('bloc', n.id);
        const d = DEF[n.id];
        if (!d || !d.executa) continue;
        const it = d.executa(ctx, n.v.map((_, i) => valoare(n, i)), n);
        if (it && typeof it.next === 'function') yield* it;
      }
    }
    const ctx = {
      personaj, asteapta, valoare, noteaza: note,
      ruleaza: (lista) => ruleaza(lista, ctx._fir),
      get cadru() { return S.cadru; },
      oprestetot() { S.fire = []; S.balon = null; }
    };
    function porneste(sc, deLa) {
      const lista = deLa != null ? deLa : sc.b;
      const fir = {sc, gen: null, curent: null, gata: false};
      fir.gen = (function* () { ctx._fir = fir; yield* ruleaza(lista, fir); })();
      S.fire.push(fir);
      return fir;
    }
    function pas() {
      S.fire.forEach(f => { ctx._fir = f; const r = f.gen.next(); if (r.done) f.gata = true; });
      S.fire = S.fire.filter(f => !f.gata);
      S.cadru++;
    }
    return {
      S, personaj, porneste, pas,
      steag() {
        S.fire = []; S.balon = null;
        scripturi.forEach(sc => { if (sc.b[0] && sc.b[0].id === 'steag') porneste(sc, sc.b.slice(1)); });
      },
      opreste() { S.fire = []; S.balon = null; note('stop', true); },
      merge() { return S.fire.length > 0; }
    };
  }
  function urmaPentru(scripturi, o) {
    o = o || {};
    const M = Motor(scripturi, {x: o.x != null ? o.x : 0, y: o.y != null ? o.y : 0, directie: o.directie != null ? o.directie : 90});
    M.steag();
    const max = o.cadre || FPS * 30;
    let f = 0;
    while (M.merge() && f < max) { M.pas(); f++; }
    return {x: M.S.x, y: M.S.y, directie: M.S.directie, balon: M.S.balon ? M.S.balon.text : null, spuse: M.S.spuse.slice(),
      evenimente: M.S.ev.slice(), executate: M.S.executate.slice(), terminat: !M.merge(), cadre: f};
  }

  /* ---------------- ajutor pentru teste (pe programul serializat) ---------------- */
  const ajutor = {
    cuSteag: (P) => (P || []).filter(sc => sc.b[0] && sc.b[0][0] === 'steag'),
    dupaSteag: (P) => { const s = ajutor.cuSteag(P)[0]; return s ? s.b.slice(1).map(b => b[0]) : []; },
    libere: (P) => (P || []).filter(sc => !(sc.b[0] && DEF[sc.b[0][0]] && DEF[sc.b[0][0]].forma === 'palarie')),
    toate: (P) => { const r = []; const w = (b) => { r.push(b[0]); const ex = b[b.length - 1]; if (ex && typeof ex === 'object' && !Array.isArray(ex)) { (ex.guri || []).forEach(g => g.forEach(w)); Object.values(ex.s || {}).forEach(w); } }; (P || []).forEach(sc => sc.b.forEach(w)); return r; },
    valori: (P, id) => { const r = []; const w = (b) => { if (b[0] === id) r.push(b.slice(1).filter(x => typeof x !== 'object')); const ex = b[b.length - 1]; if (ex && typeof ex === 'object' && !Array.isArray(ex)) (ex.guri || []).forEach(g => g.forEach(w)); }; (P || []).forEach(sc => sc.b.forEach(w)); return r; }
  };

  /* ---------------- CSS ---------------- */
  const CSS = `
.ss,.ss-meniu,.ss-fantoma{--ss-f:"Helvetica Neue","Segoe UI",Helvetica,Arial,sans-serif}
.ss{--ss-u:.68;position:relative;display:grid;gap:8px;grid-template-columns:minmax(0,1fr);font-family:var(--ss-f);color:#575E75;-webkit-user-select:none;user-select:none;margin-top:6px}
.ss *{box-sizing:border-box}
.ss-sus{display:grid;grid-template-columns:minmax(0,1fr);gap:8px;align-content:start}
.ss-lucru{display:grid;grid-template-columns:minmax(0,52fr) minmax(0,48fr);border:1px solid #D9E3F2;border-radius:10px;overflow:hidden;background:#F9F9F9;height:360px;grid-template-rows:minmax(0,100%)}
.ss.lat{grid-template-columns:minmax(0,1fr) 236px}
.ss.lat .ss-sus{grid-column:2;grid-row:1}
.ss.lat .ss-lucru{grid-column:1;grid-row:1;height:440px;grid-template-columns:268px minmax(0,1fr)}
.ss.lat .ss-scena{max-width:none}
.ss-pal{display:grid;grid-template-columns:52px minmax(0,1fr);grid-template-rows:minmax(0,100%);min-width:0;min-height:0;height:100%;border-right:1px solid #D9E3F2;background:#fff}
.ss-cats{overflow-y:auto;min-height:0;border-right:1px solid #E1E6EE;background:#fff;padding:2px 0}
.ss-catb{display:flex;flex-direction:column;align-items:center;gap:2px;width:100%;border:0;background:none;padding:5px 1px;cursor:pointer;font:500 10px/1.1 var(--ss-f);color:#575E75;min-height:44px}
.ss-catb i{width:20px;height:20px;border-radius:50%;border:1px solid;display:block}
.ss-catb.sel{background:#E9EEF2}
.ss-lista{overflow:auto;min-height:0;padding:6px 6px 40px;touch-action:pan-y;position:relative}
.ss-lista h4{margin:8px 0 6px;font:700 13px/1.2 var(--ss-f);color:#575E75}
.ss-lista h4:first-child{margin-top:2px}
.ss-lista .ss-b{margin:0 0 calc(var(--ss-u)*16px)}
.ss-lista .ss-b.ss-pal-palarie{margin-top:4px}
.ss-nota{font:400 11px/1.3 var(--ss-f);color:#717A90;margin:10px 2px 0;white-space:normal}
.ss-cod{position:relative;overflow:auto;min-height:0;height:100%;background-color:#F9F9F9;background-image:radial-gradient(#DDE1E7 1px,transparent 1px);background-size:18px 18px;outline:0}
.ss-cod:focus-visible{box-shadow:inset 0 0 0 2px #4C97FF}
.ss-panza{position:relative;min-width:100%;min-height:100%}
.ss-script{position:absolute;display:flex;flex-direction:column;align-items:flex-start}
.ss-gol{position:absolute;left:12px;top:12px;right:12px;margin:0;font:400 12px/1.35 var(--ss-f);color:#717A90;pointer-events:none}
.ss-b{position:relative;display:flex;flex-direction:column;align-items:flex-start;width:max-content;touch-action:none;cursor:grab}
.ss-lista .ss-b{touch-action:pan-y}
.ss-forma{position:absolute;left:0;top:0;overflow:visible;pointer-events:none;z-index:0}
.ss-rand{position:relative;z-index:1;display:flex;align-items:center;gap:calc(var(--ss-u)*8px);min-height:calc(var(--ss-u)*48px);padding:0 calc(var(--ss-u)*10px) 0 calc(var(--ss-u)*8px);font:500 12px/1 var(--ss-f);color:#fff;white-space:nowrap}
.ss-b[data-forma="palarie"]{padding-top:calc(var(--ss-u)*16.5px)}
.ss-b[data-forma="palarie"] > .ss-rand{min-width:calc(var(--ss-u)*100px)}
.ss-b[data-forma="raportor"],.ss-b[data-forma="boolean"]{display:inline-flex}
.ss-b[data-forma="raportor"] > .ss-rand,.ss-b[data-forma="boolean"] > .ss-rand{min-height:calc(var(--ss-u)*40px);padding:0 calc(var(--ss-u)*14px)}
.ss-b[data-forma="boolean"] > .ss-rand{padding:0 calc(var(--ss-u)*22px)}
.ss-gura{position:relative;z-index:1;margin-left:calc(var(--ss-u)*16px);min-height:calc(var(--ss-u)*24px);display:flex;flex-direction:column;align-items:flex-start}
.ss-brat{height:calc(var(--ss-u)*32px)}
.ss-c-min{min-width:calc(var(--ss-u)*160px)}
.ss-pill{display:inline-flex;align-items:center;justify-content:center;min-width:calc(var(--ss-u)*40px);height:calc(var(--ss-u)*32px);padding:0 calc(var(--ss-u)*11px);border-radius:calc(var(--ss-u)*16px);background:#fff;color:#575E75;border:1px solid rgba(0,0,0,.15);font:500 12px/1 var(--ss-f);cursor:text}
.ss-pill{position:relative}
.ss-pill::after{content:"";position:absolute;left:-4px;right:-4px;top:-7px;bottom:-7px}
.ss-dd{background:rgba(0,0,0,.15);color:#fff;border-color:rgba(0,0,0,.2);cursor:pointer}
.ss-golb{display:inline-block;width:calc(var(--ss-u)*48px);height:calc(var(--ss-u)*32px);background:rgba(0,0,0,.18);clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)}
.ss-pill input{width:5.5em;border:0;outline:0;font:500 12px/1 var(--ss-f);color:#575E75;background:transparent;text-align:center;padding:0;min-width:2em;-webkit-user-select:text;user-select:text}
.ss-ic{width:1.25em;height:1.25em;flex:none}
.ss-ruleaza > .ss-forma path{filter:drop-shadow(0 0 3px #FFF200) drop-shadow(0 0 2px #FFF200)}
.ss-pas > .ss-forma path{stroke:#E5484D;stroke-width:4}
.ss-fantoma{position:fixed;left:0;top:0;z-index:2147483000;pointer-events:none;opacity:.92}
.ss-fantoma.sterge{opacity:.45}
.ss-slot-tinta{outline:3px solid #fff;outline-offset:1px;box-shadow:0 0 0 5px rgba(0,0,0,.25)}
.ss-scenacap{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.ss-steag,.ss-stop{width:40px;height:36px;border-radius:6px;border:1px solid transparent;background:transparent;cursor:pointer;display:grid;place-items:center;padding:0}
.ss-steag:hover,.ss-stop:hover{background:#E6F0FF}
.ss-steag.on{background:#DDEBFF;border-color:#4C97FF}
.ss-steag svg{width:26px;height:26px}
.ss-stop i{width:20px;height:20px;background:#EC5959;clip-path:polygon(30% 0,70% 0,100% 30%,100% 70%,70% 100%,30% 100%,0 70%,0 30%);display:block}
.ss-pasb{margin-left:auto}
.ss-scena{position:relative;width:100%;max-width:330px;aspect-ratio:4/3;background:#fff;border:1px solid #D9E3F2;border-radius:8px;overflow:hidden;margin:0 auto}
.ss-sprite{position:absolute;width:19.6%;transform:translate(-50%,-50%);pointer-events:none}
.ss-sprite svg{display:block;width:100%;height:auto}
.ss-balon{position:absolute;transform:translate(0,-100%);background:#fff;color:#575E75;border:2px solid #C8CCD4;border-radius:14px;padding:4px 9px;font:700 12px/1.25 var(--ss-f);max-width:46%;white-space:normal;overflow-wrap:anywhere;pointer-events:none}
.ss-balon::after{content:"";position:absolute;left:12px;bottom:-8px;width:11px;height:11px;background:#fff;border-right:2px solid #C8CCD4;border-bottom:2px solid #C8CCD4;transform:rotate(45deg)}
.ss-balon.gand{border-style:dashed}
.ss-balon.gand::after{border-radius:50%;transform:none;width:9px;height:9px;bottom:-14px;border:2px solid #C8CCD4}
.ss-info{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;font:500 12px/1.2 var(--ss-f);color:#575E75;background:#fff;border:1px solid #D9E3F2;border-radius:8px;padding:7px 9px}
.ss-info label{display:inline-flex;align-items:center;gap:4px}
.ss-info input{width:4.3em;height:32px;border:1px solid #D9E3F2;border-radius:16px;text-align:center;font:500 12px/1 var(--ss-f);color:#575E75;background:#fff;-webkit-user-select:text;user-select:text}
.ss-info input.nume{width:6.2em}
.ss-urm{font:400 12px/1.35 var(--ss-f);color:#3D4458;background:#FFF8D6;border:1px solid #F0DA7A;border-radius:6px;padding:5px 8px}
.ss-meniu{position:fixed;z-index:2147483001;background:#fff;border:1px solid #C8CCD4;border-radius:6px;box-shadow:0 4px 14px rgba(0,0,0,.18);padding:4px 0;min-width:190px;font:400 14px/1.2 var(--ss-f);color:#575E75}
.ss-meniu button{display:block;width:100%;text-align:left;border:0;background:none;padding:9px 16px;font:400 14px/1.2 var(--ss-f);color:inherit;cursor:pointer;min-height:36px}
.ss-meniu button:hover,.ss-meniu button:focus{background:#E9EEF2;outline:0}
.ss-toast{position:absolute;left:8px;right:8px;bottom:8px;z-index:5;background:#3D4458;color:#fff;border-radius:8px;padding:7px 10px;font:400 12px/1.35 var(--ss-f)}
.ss-tst{border:1px solid var(--line,#D9E3F2);border-radius:10px;padding:8px 10px;background:var(--paper,#fff);color:var(--ink,#1A2233)}
.ss-tst .lbl{font-weight:800;font-size:.76rem;color:var(--ink2,#55607A);text-transform:uppercase;letter-spacing:.04em;margin:0 0 6px}
.ss-tst ol{margin:0;padding:0;list-style:none}
.ss-tst li{display:flex;gap:8px;padding:3px 0;font-size:.92rem;line-height:1.35}
.ss-tst li .s{flex:none;width:1.1em;font-weight:800}
.ss-tst li.ok .s{color:var(--ok,#23784A)}.ss-tst li.no .s{color:var(--bad,#B8362E)}
.ss-tst .m{display:block;color:var(--bad,#B8362E);font-size:.86rem}
@media (max-width:559px){.ss-scena{max-width:250px}.ss-lucru{height:340px}.ss-pal{grid-template-columns:42px minmax(0,1fr)}.ss-catb{font-size:9px}}
@media (pointer:coarse){
.ss-pal .ss-pill::after,.ss-panza .ss-pill::after{top:calc(var(--ss-u)*-8px - 1px);bottom:calc(var(--ss-u)*-8px - 1px)}
.ss-pal .ss-b[data-forma="raportor"]::before,.ss-pal .ss-b[data-forma="boolean"]::before,.ss-panza .ss-b[data-forma="raportor"]::before,.ss-panza .ss-b[data-forma="boolean"]::before{content:"";position:absolute;left:0;right:0;top:calc(var(--ss-u)*-4px);bottom:calc(var(--ss-u)*-4px)}
}
`;
  /* 1.3 (24.10.2026): ultimul bloc de mai sus = ȚINTELE DE ATINGERE pe ecranele cu deget (regula 20, ≥ 32 × 32 px),
     doar în paletă și în zona de cod (nu și în blocurile desenate în text, .ss-static, unde o margine în plus ar face
     loc de derulare). Zonele sunt INVIZIBILE (pseudo-elemente): nimic nu se mută și nimic nu se redesenează.
       - câmpul: zona lui = rândul blocului: 48u = 32,6 px, cât .ss-rand (pseudo-elementul se așază față de interiorul
         chenarului de 1 px al câmpului: 32u − 2 px + 2 × (8u + 1 px) = 48u), × lățimea câmpului + 6 px (regula de
         bază, −4 px). Câmpul e la mijlocul rândului, deci zona nu trece în blocul de deasupra / dedesubt;
       - raportorul / booleanul: 40u + 2×4u = 48u = 32,6 px; așezat într-un rând de 48u (la mijloc), zona ajunge exact la
         marginile rândului. Câmpurile din el și raportorul pus într-un câmp al lui sunt mai jos în arbore, deci câștigă
         în banda lor (atinsă acolo, se deschide câmpul / se trage raportorul, ca pe desen);
       - butoanele (steagul 40 × 36, Stop 40 × 36, categoriile 42 × 44, meniul 190 × 36, căsuțele x / y 52 × 32) au
         deja ≥ 32. Mouse (`pointer: fine`): neschimbat. */
  function stil() {
    if (document.getElementById('ss-stil')) return;
    const e = document.createElement('style');
    e.id = 'ss-stil';
    e.textContent = CSS;
    document.head.appendChild(e);
  }

  /* ---------------- desenul blocurilor ---------------- */
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
  const STEAG = '<svg class="ss-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3v19" stroke="#45993D" stroke-width="2.4" stroke-linecap="round"/><path d="M6 4c4-2 7 2 13 0v9c-6 2-9-2-13 0z" fill="#4CBF56" stroke="#45993D" stroke-width="1.4"/></svg>';
  const ROT_DR = '<svg class="ss-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M17 8a7 7 0 1 0 2 5" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><path d="M13 4h6v6" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const ROT_ST = '<svg class="ss-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8a7 7 0 1 1-2 5" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><path d="M11 4H5v6" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function eticheta(t) {
    return esc(t).replace('⚑', STEAG).replace('↻', ROT_DR).replace('↺', ROT_ST);
  }
  /* textul unui bloc, cu valorile lui (pentru citit cu voce, teste, mesaje) */
  function textBloc(n) {
    const d = DEF[n.id];
    let i = 0;
    return d.randuri.map(r => r.map(p => {
      if (p.e) return p.e;
      const k = i++;
      if (n.s && n.s[k]) return '(' + textBloc(n.s[k]) + ')';
      return p.c === 'b' ? '⬡' : n.v[k];
    }).join(' ')).join(' … ').replace('⚑', 'steagul verde');
  }
  function htmlNod(n, paleta) {
    const d = DEF[n.id];
    const c = CAT[d.cat] || CAT.miscare;
    let i = 0;
    const rand = (r) => `<div class="ss-rand">${r.map(p => {
      if (p.e) return `<span>${eticheta(p.e)}</span>`;
      const k = i++;
      if (n.s[k]) return `<span class="ss-slot" data-k="${k}">${htmlNod(n.s[k], paleta)}</span>`;
      if (p.c === 'b') return `<span class="ss-slot ss-golb" data-k="${k}"></span>`;
      if (p.c === 'm') return `<span class="ss-slot ss-pill ss-dd" data-k="${k}" data-edit="m">${esc(n.v[k])} ▾</span>`;
      return `<span class="ss-slot ss-pill" data-k="${k}" data-edit="${p.c}">${esc(n.v[k])}</span>`;
    }).join('')}</div>`;
    let inner;
    if (d.forma === 'c') {
      inner = d.randuri.map((r, k) => rand(r) + `<div class="ss-gura" data-g="${k}">${n.guri[k].map(x => htmlNod(x, paleta)).join('')}</div>`).join('') + '<div class="ss-brat"></div>';
    } else inner = rand(d.randuri[0] || []);
    return `<div class="ss-b${d.forma === 'c' ? ' ss-c-min' : ''}${paleta && d.forma === 'palarie' ? ' ss-pal-palarie' : ''}" data-uid="${n.uid}" data-id="${n.id}" data-forma="${d.forma}" role="group" aria-label="Bloc: ${esc(textBloc(n))}"><svg class="ss-forma" aria-hidden="true"><path fill="${c.culoare}" stroke="${c.margine}" stroke-width="1"/></svg>${inner}</div>`;
  }
  /* căile, în unități Scratch (forma editorului, citită din DOM-ul viu), apoi scale(u) */
  const CREST_SUS = 'c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2';
  const CREST_JOS = 'c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2';
  function cale(d, W, parti, jos) {
    /* parti: pentru stiva/palarie [H]; pentru c: [T, M1, R2, M2, …, B] */
    const f = (v) => Math.round(v * 100) / 100;
    if (d.forma === 'raportor') { const H = parti[0], r = H / 2; return `M ${f(r)} 0 H ${f(W - r)} a ${f(r)} ${f(r)} 0 0 1 0 ${f(H)} H ${f(r)} a ${f(r)} ${f(r)} 0 0 1 0 ${f(-H)} Z`; }
    if (d.forma === 'boolean') { const H = parti[0], r = H / 2; return `M ${f(r)} 0 H ${f(W - r)} l ${f(r)} ${f(r)} l ${f(-r)} ${f(r)} H ${f(r)} l ${f(-r)} ${f(-r)} Z`; }
    let p, y;
    if (d.forma === 'palarie') { p = `M 0 16.5 c 25,-22 71,-22 96,0 H ${f(W - 4)} a 4 4 0 0 1 4 4`; y = 16.5 + parti[0]; }
    else { p = `M 0 4 a 4 4 0 0 1 4 -4 H 12 ${CREST_SUS} H ${f(W - 4)} a 4 4 0 0 1 4 4`; y = parti[0]; }
    if (d.forma === 'c') {
      for (let k = 1; k < parti.length - 1; k += 2) {
        const M = parti[k], R = parti[k + 1];
        p += ` V ${f(y - 4)} a 4 4 0 0 1 -4 4 H 64 ${CREST_JOS} H 20 a 4 4 0 0 0 -4 4 V ${f(y + M - 4)} a 4 4 0 0 0 4 4 H 28 ${CREST_SUS} H ${f(W - 4)} a 4 4 0 0 1 4 4`;
        y += M + R;
      }
    }
    p += ` V ${f(y - 4)} a 4 4 0 0 1 -4 4`;
    p += jos ? ` H 48 ${CREST_JOS} H 4` : ' H 4';
    p += ' a 4 4 0 0 1 -4 -4 Z';
    return p;
  }
  function deseneaza(root, u) {
    const bl = [...root.querySelectorAll('.ss-b')];
    if (root.classList && root.classList.contains('ss-b')) bl.unshift(root);
    /* de la cele mai adânci spre exterior: un bloc C își măsoară gura după ce copiii sunt așezați */
    bl.sort((a, b) => adancime(b) - adancime(a));
    bl.forEach(el => {
      const d = DEF[el.dataset.id];
      if (!d) return;
      const W = el.offsetWidth / u, Hpx = el.offsetHeight;
      let parti;
      if (d.forma === 'c') {
        parti = [];
        [...el.children].forEach(ch => {
          if (ch.classList.contains('ss-rand') || ch.classList.contains('ss-gura') || ch.classList.contains('ss-brat')) parti.push(ch.offsetHeight / u);
        });
      } else if (d.forma === 'palarie') parti = [(Hpx / u) - 16.5];
      else parti = [Hpx / u];
      /* pe telefon, Chrome „mută” atingerea pe cel mai apropiat element care răspunde la clic (aici, butoanele de
         categorii); un ascultător de clic pe bloc îl face și pe el țintă, deci atingerea rămâne pe bloc */
      /* 1.2 (24.10.2026): NU și blocurilor din zona de cod. Acolo „atracția” făcea ca degetul pus pe un loc gol, la
         ~10 px de un bloc, să apuce blocul (și să rupă programul) în loc să deruleze zona; în zona de cod nu e alt
         element apăsabil care să fure atingerea (probat: proba_telefon.py, scratch_12) */
      if (!el._ssClic && !el.closest('.ss-panza')) { el.addEventListener('click', () => {}); el._ssClic = true; }
      const svg = el.querySelector(':scope > .ss-forma');
      svg.setAttribute('width', el.offsetWidth);
      svg.setAttribute('height', Hpx);
      const path = svg.firstChild;
      path.setAttribute('d', cale(d, W, parti, !(d.final || d.forma === 'capac')));
      path.setAttribute('transform', `scale(${u})`);
    });
  }
  function adancime(el) { let k = 0; for (let e = el; e; e = e.parentElement) if (e.classList && e.classList.contains('ss-b')) k++; return k; }

  const PISICA = '<svg viewBox="0 0 60 60" aria-hidden="true"><path d="M13 24 L15 5 L27 17 Z M47 24 L45 5 L33 17 Z" fill="#F7A21B" stroke="#8a5300" stroke-width="2" stroke-linejoin="round"/><ellipse cx="30" cy="33" rx="21" ry="18" fill="#F7A21B" stroke="#8a5300" stroke-width="2"/><ellipse cx="30" cy="40" rx="11" ry="7" fill="#fff"/><circle cx="23" cy="29" r="4.5" fill="#fff" stroke="#8a5300"/><circle cx="37" cy="29" r="4.5" fill="#fff" stroke="#8a5300"/><circle cx="24.5" cy="29.5" r="2" fill="#222"/><circle cx="38.5" cy="29.5" r="2" fill="#222"/><path d="M24 41 Q30 46 36 41" stroke="#5a3500" stroke-width="2" fill="none"/></svg>';
  const STEAG_MARE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3v19" stroke="#45993D" stroke-width="2.4" stroke-linecap="round"/><path d="M6 4c4-2 7 2 13 0v9c-6 2-9-2-13 0z" fill="#4CBF56" stroke="#45993D" stroke-width="1.4"/></svg>';

  /* ---------------- instanța ---------------- */
  function creeaza(el, o) {
    stil();
    o = Object.assign({pasCuPas: true}, o || {});
    const pers0 = Object.assign({nume: 'Sprite1', x: 0, y: 0, directie: 90}, o.personaj || {});
    const NOTA = 'În pagină sunt doar blocurile de azi, iar pisica e desenată mai simplu. În Scratch, fiecare categorie are mult mai multe blocuri, iar pisica arată ca în pozele din lecție.';
    const asc = {};
    let scripturi = programDin(o.program || []);
    const paleta = (o.paleta || ['steag', 'mergi', 'roteste_dr', 'roteste_st', 'spune_sec']).filter(id => DEF[id]);
    let istoric = [], viitor = [];
    let selectat = null;
    let M = null, timer = null, pasMod = false;
    const st = {x: pers0.x, y: pers0.y, directie: pers0.directie, apasatSteag: false, oprit: false};
    const inst = {element: el};
    const emite = (tip, extra) => {
      (asc[tip] || []).forEach(f => { try { f(Object.assign({tip, inst}, extra || {})); } catch (e) { /* ascultător greșit */ } });
      try { window.dispatchEvent(new CustomEvent('scratch-sim', {detail: Object.assign({tip, inst}, extra || {})})); } catch (e) { /* fără eveniment */ }
    };

    el.innerHTML = `<div class="ss">
  <div class="ss-sus">
    <div class="ss-scenacap"><button type="button" class="ss-steag" title="Mergi" aria-label="Steagul verde: pornește programul">${STEAG_MARE}</button><button type="button" class="ss-stop" title="Stop" aria-label="Butonul Stop: oprește tot"><i></i></button>${o.pasCuPas ? '<button type="button" class="btn ghost sm ss-pasb" title="Doar în pagină: Scratch nu are acest buton">Pas cu pas (doar aici)</button>' : ''}</div>
    <div class="ss-scena" role="img" aria-label="Scena"><div class="ss-sprite">${PISICA}</div><div class="ss-balon" hidden></div></div>
    <div class="ss-info"><label>Personaj <input class="nume" value="${esc(pers0.nume)}" aria-label="Numele personajului"></label><label>↔ x <input data-p="x" inputmode="decimal" aria-label="x"></label><label>↕ y <input data-p="y" inputmode="decimal" aria-label="y"></label><label>Direcția <input data-p="directie" inputmode="decimal" aria-label="Direcția"></label></div>
    <div class="ss-urm" hidden></div>
  </div>
  <div class="ss-lucru">
    <div class="ss-pal" aria-label="Paleta de blocuri"><div class="ss-cats"></div><div class="ss-lista"></div></div>
    <div class="ss-cod" aria-label="Zona de cod"><div class="ss-panza"></div></div>
  </div>
</div>`;
    const root = el.querySelector('.ss');
    const $ = (s) => root.querySelector(s);
    const lat = () => root.classList.toggle('lat', el.clientWidth >= 720);
    lat();
    const u = () => parseFloat(getComputedStyle(root).getPropertyValue('--ss-u')) || 0.72;

    /* ---- paleta ---- */
    const catFolosite = ORDINE_CAT.filter(c => paleta.some(id => DEF[id].cat === c));
    $('.ss-cats').innerHTML = catFolosite.map(c => `<button type="button" class="ss-catb" data-cat="${c}"><i style="background:${CAT[c].culoare};border-color:${CAT[c].margine}"></i>${esc(CAT[c].nume)}</button>`).join('');
    const nodPaleta = {};
    $('.ss-lista').innerHTML = catFolosite.map(c => `<h4 data-cat="${c}">${esc(CAT[c].nume)}</h4>` + paleta.filter(id => DEF[id].cat === c).map(id => { const n = nod(id); nodPaleta[n.uid] = n; return htmlNod(n, true); }).join('')).join('') + `<p class="ss-nota">${o.nota || NOTA}</p>`;
    $('.ss-cats').addEventListener('click', (e) => {
      const b = e.target.closest('.ss-catb');
      if (!b) return;
      root.querySelectorAll('.ss-catb').forEach(x => x.classList.toggle('sel', x === b));
      const h = $(`.ss-lista h4[data-cat="${b.dataset.cat}"]`);
      if (h) $('.ss-lista').scrollTo({top: h.offsetTop - 4, behavior: 'smooth'});
    });
    const c0 = $('.ss-catb');
    if (c0) c0.classList.add('sel');

    /* ---- index: uid → nod și locul lui ---- */
    let idx = {};
    function indexeaza() {
      idx = {};
      const wn = (n, loc) => {
        idx[n.uid] = Object.assign({n}, loc);
        n.guri.forEach((gl, k) => wl(gl, loc.sc, n, k));
        Object.entries(n.s).forEach(([k, r]) => wn(r, {slotDe: n, k: +k, sc: loc.sc}));
      };
      const wl = (lista, sc, par, gk) => lista.forEach((n, i) => wn(n, {lista, i, sc, par, g: gk}));
      scripturi.forEach(sc => wl(sc.b, sc, null, null));
    }

    /* ---- zona de cod ---- */
    function deseneazaCod(insertie) {
      indexeaza();
      const pz = $('.ss-panza'), U = u();
      let maxX = 0, maxY = 0;
      pz.innerHTML = scripturi.map((sc, si) => `<div class="ss-script" data-si="${si}" style="left:${sc.x * U}px;top:${sc.y * U}px">${sc.b.map(n => htmlNod(n)).join('')}</div>`).join('') +
        (scripturi.length ? '' : '<p class="ss-gol">Zona de cod e goală. Trage aici un bloc din paletă.</p>');
      deseneaza(pz, U);
      pz.querySelectorAll('.ss-script').forEach(s => { maxX = Math.max(maxX, s.offsetLeft + s.offsetWidth); maxY = Math.max(maxY, s.offsetTop + s.offsetHeight); });
      pz.style.width = (maxX + 60) + 'px';
      pz.style.height = (maxY + 80) + 'px';
      if (insertie) insertie();
      marcheazaRulare();
    }
    /* istoricul pentru Ctrl+Z: „ultim” = programul de după ultima schimbare încheiată */
    let ultim = null;
    function schimbat() {
      const acum = copie(programSpre(scripturi));
      if (ultim && JSON.stringify(acum) !== JSON.stringify(ultim)) { istoric.push(ultim); if (istoric.length > 60) istoric.shift(); viitor = []; }
      ultim = acum;
      st.apasatSteag = false; st.oprit = false;
      deseneazaCod();
      emite('schimbat', {program: inst.program()});
    }
    function seteaza(P, faraIstoric) {
      opreste(false);
      if (!faraIstoric && ultim) { istoric.push(ultim); viitor = []; }
      scripturi = programDin(P);
      ultim = copie(programSpre(scripturi));
      st.apasatSteag = false; st.oprit = false;
      deseneazaCod();
      emite('schimbat', {program: inst.program()});
    }

    /* ---- scena ---- */
    function deseneazaScena() {
      const S = M ? M.S : st;
      const sp = $('.ss-sprite');
      sp.style.left = ((S.x + 240) / 480 * 100) + '%';
      sp.style.top = ((180 - S.y) / 360 * 100) + '%';
      sp.style.transform = `translate(-50%,-50%) rotate(${S.directie - 90}deg)`;
      const b = $('.ss-balon'), bal = M ? M.S.balon : null;
      b.hidden = !bal;
      if (bal) {
        b.textContent = bal.text;
        b.classList.toggle('gand', bal.tip === 'gandeste');
        b.style.left = Math.min(62, (S.x + 240) / 480 * 100 + 4) + '%';
        b.style.top = Math.max(18, (180 - S.y) / 360 * 100 - 12) + '%';
      }
      root.querySelectorAll('.ss-info input[data-p]').forEach(i => { if (document.activeElement !== i) i.value = Math.round(S[i.dataset.p]); });
      paletaUrmeaza();
    }
    /* 1.1 (24.10.2026, judecata 1 a VI/18): în paletă, câmpurile blocurilor cu `dinPersonaj` arată poziția de ACUM a
       personajului, rotunjită — ca editorul (scratch-gui, blocks.jsx, onTargetsUpdate → updateToolboxBlockValue).
       Nu se schimbă cât elevul ține apăsat / trage un bloc sau scrie într-un câmp din paletă (se reia imediat după). */
    function paletaUrmeaza() {
      if (g) return;
      const L = $('.ss-lista'), a = document.activeElement;
      if (L && a && a.tagName === 'INPUT' && L.contains(a)) return;
      const S = M ? M.S : st;
      let schimb = false;
      Object.values(nodPaleta).forEach(n => {
        const dp = DEF[n.id].dinPersonaj;
        if (!dp) return;
        dp.forEach((p, k) => {
          if (p == null || !(p in S)) return;
          const v = String(Math.round(+S[p]) || 0);
          if (n.v[k] !== v) { n.v[k] = v; schimb = true; }
        });
      });
      if (schimb) refaPaleta();
    }
    function marcheazaRulare() {
      root.querySelectorAll('.ss-ruleaza,.ss-pas').forEach(e => e.classList.remove('ss-ruleaza', 'ss-pas'));
      if (!M) return;
      M.S.fire.forEach(f => {
        const si = scripturi.indexOf(f.sc);
        const top = root.querySelector(`.ss-script[data-si="${si}"] > .ss-b`);
        if (top) top.classList.add('ss-ruleaza');
        if (pasMod && f.curent) { const b = root.querySelector(`.ss-panza .ss-b[data-uid="${f.curent}"]`); if (b) b.classList.add('ss-pas'); }
      });
    }
    function tactPornit() {
      if (timer) return;
      $('.ss-steag').classList.add('on');
      timer = setInterval(() => {
        if (!root.isConnected) { clearInterval(timer); timer = null; return; }
        M.pas();
        sincron();
        if (!M.merge()) gata();
      }, 1000 / FPS);
    }
    function sincron() { st.x = M.S.x; st.y = M.S.y; st.directie = M.S.directie; deseneazaScena(); marcheazaRulare(); }
    function gata() {
      if (timer) { clearInterval(timer); timer = null; }
      $('.ss-steag').classList.remove('on');
      marcheazaRulare();
      emite('terminat', {stare: inst.stare()});
    }
    function motorNou() {
      const bal = M ? M.S.balon : null;
      M = Motor(scripturi, {x: st.x, y: st.y, directie: st.directie}, {pasCuPas: pasMod});
      M.S.balon = bal;
    }
    function steag() {
      iesiPas();
      if (timer) { clearInterval(timer); timer = null; }
      motorNou();
      M.steag();
      st.apasatSteag = true;
      emite('pornit', {cum: 'steag'});
      sincron();
      tactPornit();
    }
    function opreste(deLaElev) {
      const mergea = !!(timer || (M && M.merge()));
      iesiPas();
      if (timer) { clearInterval(timer); timer = null; }
      if (M) { M.opreste(); }
      if (deLaElev && mergea) st.oprit = true;
      $('.ss-steag').classList.remove('on');
      if (M) deseneazaScena();
      marcheazaRulare();
      if (deLaElev) emite('oprit', {mergea});
    }
    function ruleazaScript(sc) {
      /* clic pe o stivă: dacă rulează deja, o oprește (ca în Scratch); altfel o pornește de la primul ei bloc */
      iesiPas();
      if (M && M.S.fire.some(f => f.sc === sc)) { M.S.fire = M.S.fire.filter(f => f.sc !== sc); sincron(); if (!M.merge()) gata(); return; }
      if (!M) motorNou();
      const lista = sc.b[0] && DEF[sc.b[0].id].forma === 'palarie' ? sc.b.slice(1) : sc.b;
      M.porneste(sc, lista);
      emite('pornit', {cum: 'clic'});
      sincron();
      tactPornit();
    }
    function ruleazaUnul(n) {
      iesiPas();
      if (!M) motorNou();
      const sc = {x: 0, y: 0, b: [n]};
      M.porneste(sc, [n]);
      emite('pornit', {cum: 'paleta', id: n.id});
      sincron();
      tactPornit();
    }
    /* ---- „Pas cu pas”: DOAR în pagină ---- */
    function iesiPas() {
      if (!pasMod) return;
      pasMod = false;
      if (M) M.S.fire = [];
      $('.ss-urm').hidden = true;
      const b = $('.ss-pasb');
      if (b) b.textContent = 'Pas cu pas (doar aici)';
    }
    function pasUnu() {
      if (!pasMod) {
        if (timer) { clearInterval(timer); timer = null; }
        pasMod = true;
        M = Motor(scripturi, {x: st.x, y: st.y, directie: st.directie}, {pasCuPas: true});
        M.steag();
        st.apasatSteag = true;
        $('.ss-pasb').textContent = 'Pasul următor';
      }
      if (M.merge()) { M.pas(); while (M.merge() && M.S.fire.every(f => !f.curent)) M.pas(); }
      sincron();
      const f = M.S.fire[0];
      const urm = $('.ss-urm');
      urm.hidden = false;
      if (!M.merge() || !f) {
        urm.innerHTML = M.S.executate.length ? 'Gata: s-au executat toate blocurile de sub „când se dă click pe steag”.' : 'Nu e niciun bloc sub „când se dă click pe steag”.';
        pasMod = false;
        $('.ss-pasb').textContent = 'Pas cu pas (doar aici)';
        marcheazaRulare();
        emite('terminat', {stare: inst.stare(), pasCuPas: true});
        return;
      }
      const n = idx[f.curent] ? idx[f.curent].n : null;
      urm.innerHTML = n ? `Urmează blocul încadrat cu roșu: „${esc(textBloc(n))}”. Apasă „Pasul următor”.` : 'Apasă „Pasul următor”.';
    }

    /* ---- editarea câmpurilor (clic pe un câmp alb) ---- */
    function editeaza(span, n, k, inPaleta) {
      const d = DEF[n.id];
      const camp = d.campuri[k];
      if (camp.c === 'm') {
        meniu(span.getBoundingClientRect().left, span.getBoundingClientRect().bottom, camp.opt.map(op => [op, () => { n.v[k] = op; inPaleta ? redeseneazaPaleta() : schimbat(); }]));
        return;
      }
      const vechi = n.v[k];
      span.innerHTML = `<input value="${esc(vechi)}" ${camp.c === 'n' ? 'inputmode="decimal"' : ''} aria-label="Valoarea din bloc">`;
      const inp = span.querySelector('input');
      inp.focus();
      inp.select();
      if (camp.c === 'n') inp.addEventListener('input', () => { const c = inp.value.replace(/[^0-9.\-]/g, ''); if (c !== inp.value) inp.value = c; });
      let terminat = false;
      const ed = {inp, faraStanga: false};   /* 1.3: faraStanga = închis de degetul pus pe alt bloc din zona de cod */
      const fin = (pastreaza) => {
        if (terminat) return;
        terminat = true;
        if (editare === ed) editare = null;
        let v = pastreaza ? inp.value : vechi;
        if (camp.c === 'n' && v.trim() === '') v = '0';
        n.v[k] = v;
        if (inPaleta) redeseneazaPaleta();
        else { if (v !== vechi) schimbat(); else deseneazaCod(); if (!ed.faraStanga) laStanga(n); }
      };
      if (!inPaleta) editare = ed;
      inp.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') fin(true); else if (e.key === 'Escape') fin(false); });
      inp.addEventListener('blur', () => fin(true));
      inp.addEventListener('pointerdown', (e) => e.stopPropagation());
    }
    let editare = null;   /* 1.2: caseta deschisă acum într-un bloc din zona de cod ({inp, faraStanga}), altfel null */
    /* 1.2 (24.10.2026): după ce se închide caseta unui câmp (Enter, Escape, atingere în altă parte), zona de cod revine
       spre stânga cât să se vadă marginea stângă a programului în care ai scris (programul de la x 20 → la capăt).
       La 390 px câmpurile din dreapta unui bloc lung se văd doar cu zona derulată; rămasă așa, marginea stângă a
       programului stătea ascunsă sub paletă (lipirea „sub program” nu mai mergea). Zona nederulată: nimic schimbat. */
    function laStanga(n) {
      const cod = $('.ss-cod'), loc = idx[n.uid];
      const se = loc ? root.querySelector(`.ss-panza .ss-script[data-si="${scripturi.indexOf(loc.sc)}"]`) : null;
      const m = se ? se.offsetLeft - 6 : 0;
      if (cod.scrollLeft > m) cod.scrollLeft = m <= 24 ? 0 : m;
    }
    function redeseneazaPaleta() { refaPaleta(); }
    function refaPaleta() {
      const L = $('.ss-lista'), top = L.scrollTop;
      L.innerHTML = catFolosite.map(c => `<h4 data-cat="${c}">${esc(CAT[c].nume)}</h4>` + Object.values(nodPaleta).filter(n => DEF[n.id].cat === c).map(n => htmlNod(n, true)).join('')).join('') + `<p class="ss-nota">${o.nota || NOTA}</p>`;
      deseneaza(L, u());
      L.scrollTop = top; L.scrollLeft = 0;
    }

    /* ---- scoaterea / punerea blocurilor în model ---- */
    function scoateStiva(uid) {
      /* scoate blocul și tot ce e sub el în aceeași listă; întoarce [noduri] */
      const loc = idx[uid];
      if (!loc) return [];
      if (loc.slotDe) { delete loc.slotDe.s[loc.k]; return [loc.n]; }
      const bucata = loc.lista.splice(loc.i);
      curataScripturi();
      return bucata;
    }
    function scoateUnul(uid) {
      /* „Șterge blocul” / Delete: doar blocul; cele de sub el urcă în locul lui */
      const loc = idx[uid];
      if (!loc) return;
      if (loc.slotDe) { delete loc.slotDe.s[loc.k]; return; }
      loc.lista.splice(loc.i, 1);
      if (loc.lista === loc.sc.b && loc.i === 0 && loc.lista.length) {
        /* pălăria ștearsă: stiva rămâne pe loc */
        const d = DEF[loc.n.id];
        if (d.forma === 'palarie') loc.sc.y += 16.5;
      }
      curataScripturi();
    }
    function curataScripturi() { scripturi = scripturi.filter(sc => sc.b.length); }
    const areJos = (lista) => { const ul = lista[lista.length - 1]; const d = ul && DEF[ul.id]; return !!d && !d.final && d.forma !== 'capac'; };

    /* ---- tragerea (pointer events: mouse, deget, creion) ---- */
    let g = null;
    function inaltimeU(noduri) {
      const tmp = document.createElement('div');
      tmp.className = 'ss-script';
      tmp.style.cssText = 'position:absolute;visibility:hidden;left:-9999px;top:0';
      tmp.innerHTML = noduri.map(n => htmlNod(n)).join('');
      $('.ss-panza').appendChild(tmp);
      const h = tmp.offsetHeight / u();
      tmp.remove();
      return h;
    }
    function incepeTragerea(e) {
      const U = u();
      let noduri, r0;
      if (g.inPaleta) {
        const tpl = nodPaleta[g.bl.dataset.uid];
        noduri = [nod(tpl.id, tpl.v.slice())];
        r0 = g.bl.getBoundingClientRect();
      } else {
        r0 = g.bl.getBoundingClientRect();
        const loc = idx[g.bl.dataset.uid];
        if (loc && !loc.slotDe && loc.lista === loc.sc.b && loc.i === 0) {
          noduri = loc.sc.b; scripturi = scripturi.filter(s => s !== loc.sc);
        } else noduri = scoateStiva(g.bl.dataset.uid);
        g.instantaneu = istoric.length;
      }
      g.noduri = noduri;
      g.offX = g.x0 - r0.left;
      g.offY = g.y0 - r0.top;
      const f = document.createElement('div');
      f.className = 'ss-fantoma';
      f.style.setProperty('--ss-u', U);
      f.innerHTML = `<div class="ss" style="display:block;margin:0"><div class="ss-script" style="position:relative">${noduri.map(n => htmlNod(n)).join('')}</div></div>`;
      document.body.appendChild(f);
      deseneaza(f, U);
      g.fantoma = f;
      g.dragging = true;
      g.valoric = DEF[noduri[0].id].valoric;
      g.hU = f.firstChild.offsetHeight / U;
      if (!g.inPaleta) { if (g.tip !== 'mouse') parcheaza(g.bl); deseneazaCod(); }
      muta(e);
    }
    /* 1.2 (24.10.2026): blocul atins cu DEGETUL în zona de cod rămâne în document (ascuns) până ridici degetul.
       Fără asta, deseneazaCod() îl scoate din pagină chiar la începutul tragerii, iar restul atingerii (touchmove,
       touchend) merge la un element scos: ascultătorul de pe document (cel care oprește derularea cât tragi) nu-l mai
       vede, iar prima atingere de după (ex. steagul) se pierdea uneori (dbg_steag.py, scratch_12). Mouse: neschimbat. */
    let parcare = null;
    function parcheaza(b) {
      if (!parcare) {
        parcare = document.createElement('div'); parcare.hidden = true; parcare.setAttribute('aria-hidden', 'true');
        /* 1.3: ținut apăsat pe un element parcat (ascuns): fără meniul browserului */
        parcare.addEventListener('contextmenu', (e) => e.preventDefault());
      }
      if (!parcare.isConnected) document.body.appendChild(parcare);
      parcare.appendChild(b);
    }
    function golesteParcarea() { if (parcare) { parcare.textContent = ''; parcare.remove(); } }
    /* 1.3: elementul atins cu degetul a fost scos din pagină chiar acum (redesenarea de la închiderea casetei): îl
       parchez cu tot cu bucata scoasă din care face parte, ca restul atingerii (touchmove, touchend) să ajungă la
       document (vezi 1.2, steagul pierdut) */
    function parcheazaScos(t) { let r = t; while (r.parentNode) r = r.parentNode; if (r !== document && r.nodeType === 1) parcheaza(r); }
    function tinte() {
      /* conexiunile posibile, în coordonate de ecran */
      const T = [], U = u();
      const prim = DEF[g.noduri[0].id], ultimJos = areJos(g.noduri);
      if (g.valoric) {
        root.querySelectorAll('.ss-panza .ss-slot').forEach(sl => {
          const b = sl.closest('.ss-b'), loc = idx[b.dataset.uid], k = +sl.dataset.k;
          const camp = DEF[loc.n.id].campuri[k];
          if (camp.c === 'm') return;
          if (camp.c === 'b' && prim.forma !== 'boolean') return;
          const r = sl.getBoundingClientRect();
          T.push({tip: 'slot', x: r.left, y: r.top + r.height / 2, n: loc.n, k, el: sl});
        });
        return T;
      }
      /* 1.2 (24.10.2026): zona de cod derulată spre dreapta = marginea stângă a stivelor e ascunsă (sub paletă, unde
         lăsarea ar șterge blocul). Atunci locurile de lipire ascunse la stânga se măsoară față de marginea VĂZUTĂ a
         zonei: blocul lăsat sub program, lângă marginea stângă a zonei, se lipește. Zona nederulată: nimic schimbat. */
      const cod = $('.ss-cod'), cl = cod.scrollLeft > 0 ? cod.getBoundingClientRect().left : -Infinity;
      const vx = (x) => Math.max(x, cl);
      root.querySelectorAll('.ss-panza .ss-b').forEach(b => {
        const loc = idx[b.dataset.uid];
        if (!loc || loc.slotDe) return;
        const d = DEF[loc.n.id];
        if (d.valoric) return;
        const r = b.getBoundingClientRect();
        if (prim.forma !== 'palarie' && !d.final && d.forma !== 'capac') T.push({tip: 'dupa', x: vx(r.left), y: r.top + b.offsetHeight * (r.height / b.offsetHeight), loc});
        if (d.forma === 'c' && prim.forma !== 'palarie') b.querySelectorAll(':scope > .ss-gura').forEach(gu => { const rg = gu.getBoundingClientRect(); T.push({tip: 'gura', x: vx(rg.left), y: rg.top, n: loc.n, k: +gu.dataset.g}); });
      });
      if (ultimJos) scripturi.forEach((sc, si) => {
        const p = sc.b[0];
        if (!p || DEF[p.id].forma === 'palarie' || DEF[p.id].valoric) return;
        const el2 = root.querySelector(`.ss-script[data-si="${si}"]`);
        if (!el2) return;
        const r = el2.getBoundingClientRect();
        T.push({tip: 'inainte', x: vx(r.left), y: r.top, sc, jos: true});
      });
      return T;
    }
    function celMaiAproape(px, py) {
      const fr = g.fantoma.getBoundingClientRect();
      const lim = (g.tip === 'touch' ? 44 : 36);
      let best = null, bd = 1e9;
      g.T.forEach(t => {
        let dx, dy;
        if (t.tip === 'slot') { dx = fr.left - t.x; dy = (fr.top + fr.height / 2) - t.y; }
        else if (t.tip === 'inainte') { dx = fr.left - t.x; dy = (fr.top + g.hU * u()) - t.y; }
        else { dx = fr.left - t.x; dy = fr.top - t.y; }
        const dd = Math.hypot(dx, dy);
        if (dd < lim && dd < bd) { bd = dd; best = t; }
      });
      return best;
    }
    function pestePaleta(x, y) { const r = $('.ss-pal').getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; }
    function muta(e) {
      const x = e.clientX - g.offX, y = e.clientY - g.offY;
      g.fantoma.style.transform = `translate(${x}px,${y}px)`;
      g.lastX = e.clientX; g.lastY = e.clientY;
      const sterge = pestePaleta(e.clientX, e.clientY);
      g.fantoma.classList.toggle('sterge', sterge);
      if (!g.T) g.T = tinte();
      const t = sterge ? null : celMaiAproape();
      root.querySelectorAll('.ss-slot-tinta').forEach(s => s.classList.remove('ss-slot-tinta'));
      root.querySelectorAll('.ss-indicator').forEach(s => s.remove());
      g.tinta = t;
      if (t && t.tip === 'slot') t.el.classList.add('ss-slot-tinta');
      else if (t) {
        const ind = document.createElement('div');
        ind.className = 'ss-indicator';
        const pz = $('.ss-panza').getBoundingClientRect();
        const top = t.tip === 'inainte' ? t.y - 4 : t.y - 3;
        ind.style.cssText = `position:absolute;left:${t.x - pz.left}px;top:${top - pz.top}px;width:${Math.max(60, g.fantoma.firstChild.offsetWidth * 0.6)}px;height:6px;border-radius:3px;background:#575E75;opacity:.55;z-index:3;pointer-events:none`;
        $('.ss-panza').appendChild(ind);
      }
    }
    function lasa() {
      const f = g.fantoma, U = u();
      const fr = f.getBoundingClientRect();
      f.remove();
      root.querySelectorAll('.ss-slot-tinta').forEach(s => s.classList.remove('ss-slot-tinta'));
      root.querySelectorAll('.ss-indicator').forEach(s => s.remove());
      const noduri = g.noduri, t = g.tinta;
      if (pestePaleta(g.lastX, g.lastY)) { if (g.inPaleta) deseneazaCod(); else schimbat(); return; }
      if (t && t.tip === 'slot') {
        const vechi = t.n.s[t.k];
        t.n.s[t.k] = noduri[0];
        if (vechi) { const pz = $('.ss-panza').getBoundingClientRect(); scripturi.push({x: (fr.left - pz.left) / U + 30, y: (fr.top - pz.top) / U + 30, b: [vechi]}); }
      } else if (t && t.tip === 'dupa') {
        const rest = t.loc.lista.splice(t.loc.i + 1);
        t.loc.lista.push(...noduri);
        if (rest.length) { if (areJos(noduri)) t.loc.lista.push(...rest); else scripturi.push({x: t.loc.sc.x + 40, y: t.loc.sc.y + 120, b: rest}); }
      } else if (t && t.tip === 'gura') {
        const lista = t.n.guri[t.k];
        const rest = lista.splice(0);
        lista.push(...noduri);
        if (rest.length) { if (areJos(noduri)) lista.push(...rest); else scripturi.push({x: 40, y: 40, b: rest}); }
      } else if (t && t.tip === 'inainte') {
        const h = g.hU;
        t.sc.b.unshift(...noduri);
        t.sc.y -= h;
        if (t.sc.y < 0) { const d = -t.sc.y; scripturi.forEach(s => { s.y += d; }); }
      } else {
        const pz = $('.ss-panza').getBoundingClientRect();
        let x = (fr.left - pz.left) / U, y = (fr.top - pz.top) / U;
        const cod = $('.ss-cod').getBoundingClientRect();
        if (g.lastX < cod.left || g.lastX > cod.right || g.lastY < cod.top || g.lastY > cod.bottom) {
          /* lăsat în afara zonei de cod (pe scenă etc.): rămâne în zona de cod, la marginea cea mai apropiată */
          x = Math.max(4, Math.min(x, ($('.ss-cod').scrollLeft + cod.width) / U - 60));
          y = Math.max(4, Math.min(y, ($('.ss-cod').scrollTop + cod.height) / U - 50));
        }
        scripturi.push({x: Math.max(2, x), y: Math.max(2, y), b: noduri});
      }
      schimbat();
    }
    function inchideMeniu() { document.querySelectorAll('.ss-meniu').forEach(m => m.remove()); }
    function meniu(x, y, items) {
      inchideMeniu();
      const m = document.createElement('div');
      m.className = 'ss-meniu';
      m.setAttribute('role', 'menu');
      m.innerHTML = items.map((it, i) => `<button type="button" role="menuitem" data-i="${i}">${esc(it[0])}</button>`).join('');
      document.body.appendChild(m);
      const W = m.offsetWidth, H = m.offsetHeight;
      m.style.left = Math.max(4, Math.min(x, window.innerWidth - W - 4)) + 'px';
      m.style.top = Math.max(4, Math.min(y, window.innerHeight - H - 4)) + 'px';
      m.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; inchideMeniu(); items[+b.dataset.i][1](); });
      m.addEventListener('keydown', (e) => {
        const bs = [...m.querySelectorAll('button')], i = bs.indexOf(document.activeElement);
        if (e.key === 'Escape') { e.preventDefault(); inchideMeniu(); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); bs[(i + 1) % bs.length].focus(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); bs[(i - 1 + bs.length) % bs.length].focus(); }
      });
      setTimeout(() => {
        const inchide = (e) => { if (!m.contains(e.target)) { inchideMeniu(); document.removeEventListener('pointerdown', inchide, true); } };
        document.addEventListener('pointerdown', inchide, true);
      }, 0);
      const b0 = m.querySelector('button');
      if (b0) b0.focus({preventScroll: true});
    }
    function toast(t) {
      const old = root.querySelector('.ss-toast');
      if (old) old.remove();
      const d = document.createElement('div');
      d.className = 'ss-toast';
      d.textContent = t;
      $('.ss-lucru').style.position = 'relative';
      $('.ss-lucru').appendChild(d);
      setTimeout(() => d.remove(), 4200);
    }
    function nrBlocuri(n) { let k = 1; n.guri.forEach(gl => gl.forEach(x => { k += nrBlocuri(x); })); Object.values(n.s).forEach(x => { k += nrBlocuri(x); }); return k; }
    function meniuBloc(uid, x, y) {
      const loc = idx[uid];
      if (!loc) return;
      const k = nrBlocuri(loc.n);
      meniu(x, y, [
        ['Duplică', () => duplica(uid, x, y)],
        ['Adaugă comentariu', () => toast('În Scratch, „Adaugă comentariu” lipește lângă bloc o notiță galbenă, în care scrii ce face blocul. În pagină nu punem comentarii.')],
        [k > 1 ? `Șterge ${k} blocuri` : 'Șterge blocul', () => { scoateUnul(uid); schimbat(); }]
      ]);
    }
    function meniuZona(x, y) {
      const tot = scripturi.reduce((a, sc) => a + sc.b.reduce((b, n) => b + nrBlocuri(n), 0), 0);
      const it = [
        ['Anulează ultima modificare', anuleaza],
        ['Refă acțiunea anulată', reface],
        ['Șterge blocurile', () => { let y0 = 8; scripturi.forEach(sc => { sc.x = 8; sc.y = y0; y0 += inaltimeU(sc.b) + 24; }); schimbat(); }],
        ['Adaugă comentariu', () => toast('În Scratch, „Adaugă comentariu” pune în zona de cod o notiță galbenă. În pagină nu punem comentarii.')]
      ];
      if (tot) it.push([tot > 1 ? `Șterge ${tot} blocuri` : 'Șterge blocul', () => { if (tot < 2 || window.confirm(`Șterg toate ${tot} blocuri?`)) { scripturi = []; schimbat(); } }]);
      meniu(x, y, it);
    }
    function duplica(uid, x, y) {
      const loc = idx[uid];
      if (!loc) return;
      const spec = loc.slotDe ? [spre(loc.n)] : loc.lista.slice(loc.i).map(spre);
      const noduri = spec.map(dinSpec);
      /* ca în Scratch: copia vine „lipită” de mouse/deget; o lași cu un clic / o atingere */
      g = {id: null, x0: x, y0: y, inPaleta: false, tip: 'mouse', dragging: false, urmareste: true};
      g.noduri = noduri; g.offX = 10; g.offY = 10;
      const f = document.createElement('div');
      f.className = 'ss-fantoma';
      f.style.setProperty('--ss-u', u());
      f.innerHTML = `<div class="ss" style="display:block;margin:0"><div class="ss-script" style="position:relative">${noduri.map(n => htmlNod(n)).join('')}</div></div>`;
      document.body.appendChild(f);
      deseneaza(f, u());
      g.fantoma = f; g.dragging = true; g.valoric = DEF[noduri[0].id].valoric; g.hU = f.firstChild.offsetHeight / u();
      muta({clientX: x + 24, clientY: y + 24});
      const mv = (e) => { if (g && g.urmareste) muta(e); };
      const jos = (e) => {
        if (!g || !g.urmareste) return;
        e.preventDefault(); e.stopPropagation();
        muta(e); lasa(); g = null;
        window.removeEventListener('pointermove', mv, true);
        window.removeEventListener('pointerdown', jos, true);
      };
      window.addEventListener('pointermove', mv, true);
      setTimeout(() => window.addEventListener('pointerdown', jos, true), 0);
    }
    function anuleaza() {
      if (!istoric.length) return;
      viitor.push(ultim);
      seteaza(istoric.pop(), true);
    }
    function reface() {
      if (!viitor.length) return;
      istoric.push(ultim);
      seteaza(viitor.pop(), true);
    }

    function laJos(e) {
      if (g && g.urmareste) return;
      /* 1.3: ce a rămas parcat de la o atingere încheiată (ex. ținut apăsat → meniul) pleacă acum */
      if (!g && parcare && parcare.firstChild && !parcare.contains(e.target)) golesteParcarea();
      if (e.target.closest('input')) return;
      let bl = e.target.closest('.ss-b');
      if (!bl || !root.contains(bl)) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      let pill = e.target.closest('.ss-pill');
      inchideMeniu();
      /* 1.2: cu degetul, o atingere pe un bloc din paletă cât e deschisă caseta unui câmp din zona de cod o închide
         (ca o atingere în altă parte), deci zona revine înainte de tragere. Fără asta caseta rămânea deschisă toată
         tragerea (pointerdown anulat mai jos = fără blur), zona rămânea derulată, iar la lăsare redesenarea zonei
         scotea caseta din pagină cu o eroare în consolă („…moved in a 'blur' event handler?”). Mouse: neschimbat.
         1.3: la fel pentru caseta unui câmp din PALETĂ și pentru atingerile pe blocurile din ZONA DE COD (ascultătorul
         zonei le lasă aici). Atingerea își face treaba din prima: închiderea redesenează zona (sau paleta) și scoate
         elementul atins, deci îl parchez (parcheazaScos) și lucrez mai departe pe blocul redesenat, cu același uid,
         și pe câmpul lui cu același data-k. Pe un bloc din zona de cod, zona NU se întoarce la stânga (faraStanga):
         câmpul / blocul atins ar fugi de sub deget. Pe chiar câmpul deschis (lângă casetă): rămâne deschis. */
      if (e.pointerType !== 'mouse') {
        const L = $('.ss-lista'), a = document.activeElement;
        const cas = editare ? editare.inp : (a && a.tagName === 'INPUT' && L.contains(a) ? a : null);
        if (cas) {
          if (pill && pill.contains(cas)) { e.preventDefault(); return; }
          const t = e.target, uid = bl.dataset.uid, k = pill ? pill.dataset.k : null, inCod = !!bl.closest('.ss-panza');
          if (editare && inCod) editare.faraStanga = true;
          cas.blur();
          if (!t.isConnected) parcheazaScos(t);
          if (inCod) $('.ss-cod').focus({preventScroll: true});
          if (!root.contains(bl)) {
            bl = root.querySelector(`.ss-b[data-uid="${uid}"]`);
            if (!bl) return;
            pill = k == null ? null : [...bl.querySelectorAll(`.ss-pill[data-k="${k}"]`)].find(p => p.closest('.ss-b') === bl) || null;
          }
        }
      }
      if (!root.contains(bl)) return;
      const inPaleta = !!bl.closest('.ss-pal');
      /* blocul de apucat: dacă degetul e pe un raportor dintr-un câmp, raportorul; altfel blocul de sub deget */
      g = {id: e.pointerId, x0: e.clientX, y0: e.clientY, bl, inPaleta, tip: e.pointerType, pill, dragging: false};
      /* și la atingere: fără evenimentele de mouse „de compatibilitate” de după atingere (un mousedown care ar muta
         focusul de pe caseta de scris a câmpului, abia deschisă); derularea paletei o decide touch-action, nu asta */
      e.preventDefault();
      if (e.pointerType !== 'mouse' && !inPaleta) {
        g.lung = setTimeout(() => { if (g && !g.dragging) { const uid = bl.dataset.uid; g = null; curataAscultatori(); meniuBloc(uid, e.clientX, e.clientY); } }, 600);
      }
      window.addEventListener('pointermove', laMiscare, true);
      window.addEventListener('pointerup', laSus, true);
      window.addEventListener('pointercancel', laAnulare, true);
    }
    function curataAscultatori() {
      window.removeEventListener('pointermove', laMiscare, true);
      window.removeEventListener('pointerup', laSus, true);
      window.removeEventListener('pointercancel', laAnulare, true);
    }
    function laMiscare(e) {
      if (!g || e.pointerId !== g.id) return;
      if (!g.dragging) {
        const dx = e.clientX - g.x0, dy = e.clientY - g.y0;
        const prag = g.tip === 'mouse' ? 4 : 9;
        if (Math.hypot(dx, dy) < prag) return;
        if (g.lung) { clearTimeout(g.lung); g.lung = null; }
        if (g.inPaleta && g.tip !== 'mouse' && Math.abs(dy) > Math.abs(dx) * 1.2) { g = null; curataAscultatori(); return; }
        incepeTragerea(e);
        return;
      }
      e.preventDefault();
      muta(e);
    }
    function laSus(e) {
      if (!g || e.pointerId !== g.id) return;
      curataAscultatori();
      if (g.lung) { clearTimeout(g.lung); g.lung = null; }
      const gg = g;
      if (gg.dragging) { muta(e); lasa(); g = null; paletaUrmeaza(); if (parcare) setTimeout(golesteParcarea, 0); return; }
      g = null;
      setTimeout(paletaUrmeaza, 0);   /* după ce clicul și-a făcut treaba (caseta câmpului deschisă = paleta nu se schimbă) */
      if (parcare && parcare.firstChild) setTimeout(golesteParcarea, 0);   /* 1.3: după touchend (vezi laJos) */
      /* clic fără tragere */
      if (gg.pill && !gg.inPaleta) {
        const b = gg.pill.closest('.ss-b'), loc = idx[b.dataset.uid];
        if (loc) { editeaza(gg.pill, loc.n, +gg.pill.dataset.k, false); return; }
      }
      if (gg.pill && gg.inPaleta) {
        const b = gg.pill.closest('.ss-b'), n = nodPaleta[b.dataset.uid];
        if (n) { editeaza(gg.pill, n, +gg.pill.dataset.k, true); return; }
      }
      if (gg.inPaleta) { const n = nodPaleta[gg.bl.dataset.uid]; if (n && !DEF[n.id].valoric && DEF[n.id].forma !== 'palarie') ruleazaUnul(nod(n.id, n.v.slice())); return; }
      const loc = idx[gg.bl.dataset.uid];
      if (!loc) return;
      selectat = loc.n.uid;
      ruleazaScript(loc.sc);
    }
    function laAnulare(e) {
      if (!g || e.pointerId !== g.id) return;
      curataAscultatori();
      if (g.lung) clearTimeout(g.lung);
      if (g.dragging) { lasa(); }
      g = null;
      paletaUrmeaza();
      if (parcare) setTimeout(golesteParcarea, 0);
    }
    root.addEventListener('pointerdown', laJos);
    root.addEventListener('contextmenu', (e) => {
      if (e.target.closest('input')) return;
      if (document.querySelector('.ss-meniu')) { e.preventDefault(); return; }
      const bl = e.target.closest('.ss-panza .ss-b');
      if (bl) { e.preventDefault(); meniuBloc(bl.dataset.uid, e.clientX, e.clientY); return; }
      if (e.target.closest('.ss-cod')) { e.preventDefault(); meniuZona(e.clientX, e.clientY); }
    });
    document.addEventListener('touchmove', (e) => { if (g && g.dragging) e.preventDefault(); }, {passive: false});
    root.addEventListener('keydown', (e) => {
      if (e.target.closest('input')) return;
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectat && idx[selectat]) { e.preventDefault(); scoateUnul(selectat); selectat = null; schimbat(); }
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) { e.preventDefault(); anuleaza(); }
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || ((e.key === 'z' || e.key === 'Z') && e.shiftKey))) { e.preventDefault(); reface(); }
    });
    $('.ss-cod').tabIndex = 0;
    $('.ss-cod').addEventListener('pointerdown', (e) => {
      if (e.target.closest('input')) return;
      /* 1.3: cu degetul, cu caseta unui câmp deschisă, pe un bloc al zonei: caseta o închide laJos (din prima, vezi acolo) */
      if (e.pointerType !== 'mouse' && editare && e.target.closest('.ss-panza .ss-b')) return;
      const t = e.target;
      $('.ss-cod').focus({preventScroll: true});
      /* 1.3: degetul pe un loc gol, cu o casetă deschisă: redesenarea poate scoate elementul atins (marginea unui script) */
      if (e.pointerType !== 'mouse' && !t.isConnected) parcheazaScos(t);
    });
    $('.ss-steag').addEventListener('click', steag);
    $('.ss-stop').addEventListener('click', () => opreste(true));
    const pb = $('.ss-pasb');
    if (pb) pb.addEventListener('click', pasUnu);
    root.querySelectorAll('.ss-info input[data-p]').forEach(i => {
      const apl = () => {
        const v = parseFloat(String(i.value).replace(',', '.'));
        if (!isFinite(v)) { deseneazaScena(); return; }
        const S = M ? M.S : st;
        if (i.dataset.p === 'directie') S.directie = roteste(v);
        else { const nx = i.dataset.p === 'x' ? v : S.x, ny = i.dataset.p === 'y' ? v : S.y; const gg = gard(nx, ny, S.directie); S.x = rot(gg[0]); S.y = rot(gg[1]); }
        st.x = S.x; st.y = S.y; st.directie = S.directie;
        deseneazaScena();
        emite('schimbat', {program: inst.program(), personaj: true});
      };
      i.addEventListener('change', apl);
      i.addEventListener('keydown', (e) => { if (e.key === 'Enter') { apl(); i.blur(); } });
    });
    /* ca în editor: personajul se poate trage cu mouse-ul / degetul pe scenă (rămâne pe scenă, după gard) */
    (function () {
      const sp = $('.ss-sprite'), sc = $('.ss-scena');
      sp.style.pointerEvents = 'auto';
      sp.style.touchAction = 'none';
      sp.style.cursor = 'grab';
      let tr = null;
      sp.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        const S = M ? M.S : st;
        const r = sc.getBoundingClientRect();
        tr = {id: e.pointerId, dx: S.x - ((e.clientX - r.left) / r.width * 480 - 240), dy: S.y - (180 - (e.clientY - r.top) / r.height * 360)};
        try { sp.setPointerCapture(e.pointerId); } catch (er) { /* fără captură */ }
      });
      sp.addEventListener('pointermove', (e) => {
        if (!tr || e.pointerId !== tr.id) return;
        const r = sc.getBoundingClientRect(), S = M ? M.S : st;
        const gg = gard((e.clientX - r.left) / r.width * 480 - 240 + tr.dx, 180 - (e.clientY - r.top) / r.height * 360 + tr.dy, S.directie);
        S.x = Math.round(gg[0]); S.y = Math.round(gg[1]);
        st.x = S.x; st.y = S.y;
        deseneazaScena();
      });
      const gata2 = (e) => { if (tr && e.pointerId === tr.id) { tr = null; emite('schimbat', {program: inst.program(), personaj: true}); } };
      sp.addEventListener('pointerup', gata2);
      sp.addEventListener('pointercancel', gata2);
    })();
    if (window.ResizeObserver) { let lw = el.clientWidth; new ResizeObserver(() => { if (Math.abs(el.clientWidth - lw) < 2) return; lw = el.clientWidth; lat(); deseneazaCod(); refaPaleta(); }).observe(el); }

    /* ---- testele ---- */
    function urma(oo) { return urmaPentru(programDin(inst.program()), Object.assign({x: pers0.x, y: pers0.y, directie: pers0.directie}, oo || {})); }
    function verifica() {
      const T = o.teste || [];
      const P = inst.program();
      let n = 0, prima = null;
      const rez = T.map(t => {
        let ok = false;
        try { ok = !!t.ok(urma(t.o), P, inst.stare()); } catch (e) { ok = false; }
        if (ok) n++; else if (!prima) prima = t.msg;
        return ok;
      });
      const r = {ok: n === T.length, n, total: T.length, msg: prima, rez};
      emite('verificat', r);
      return r;
    }

    Object.assign(inst, {
      program: () => programSpre(scripturi),
      seteaza: (P) => seteaza(P),
      steag, opreste: () => opreste(true),
      stare: () => ({x: st.x, y: st.y, directie: st.directie, balon: M && M.S.balon ? M.S.balon.text : null, ruleaza: !!(M && M.merge()), apasatSteag: st.apasatSteag, oprit: st.oprit}),
      punePersonaj: (p) => { opreste(false); Object.assign(st, p); M = null; deseneazaScena(); },
      urma, verifica,
      on: (tip, fn) => { (asc[tip] = asc[tip] || []).push(fn); return inst; },
      ruleazaClic: (si) => { if (scripturi[si]) ruleazaScript(scripturi[si]); }
    });
    deseneazaCod();
    deseneaza($('.ss-lista'), u());
    deseneazaScena();
    istoric = [];
    ultim = copie(programSpre(scripturi));
    return inst;
  }

  /* ---------------- tipul pentru motor (atelier / „Încearcă”) ---------------- */
  const tipScratch = {
    render(Q, body, api) {
      const teste = Q.teste || [];
      body.innerHTML = `<div class="ss-gazda"></div>${teste.length ? `<div class="ss-tst" style="margin-top:8px"><div class="lbl">Testele sarcinii · <span class="nr">apasă „Rulează testele”</span></div><ol>${teste.map((t, i) => `<li data-i="${i}"><span class="s">○</span><span>${t.ce}<span class="m" hidden></span></span></li>`).join('')}</ol></div>` : ''}`;
      const inst = creeaza(body.querySelector('.ss-gazda'), {paleta: Q.paleta, program: Q.program || Q.start || [], personaj: Q.personaj, teste, nota: Q.nota, pasCuPas: Q.pasCuPas !== false});
      body._ss = inst;
      const marcheaza = (r) => {
        body.querySelectorAll('.ss-tst li').forEach((li, i) => {
          const ok = r ? r.rez[i] : null;
          li.className = ok == null ? '' : ok ? 'ok' : 'no';
          li.querySelector('.s').textContent = ok == null ? '○' : ok ? '✓' : '✗';
          const m = li.querySelector('.m');
          m.hidden = ok !== false;
          m.textContent = ok === false ? teste[i].msg : '';
        });
        const nrr = body.querySelector('.ss-tst .nr');
        if (nrr) nrr.textContent = r ? `${r.n} din ${r.total} trec` : 'apasă „Rulează testele”';
      };
      inst.on('schimbat', () => marcheaza(null));
      api.checkButton(() => {
        const r = inst.verifica();
        marcheaza(r);
        if (r.ok) api.resolve(true);
        else {
          api.resolve(false, r.msg);
          api.revealButton(() => { inst.seteaza(Q.solutie); marcheaza(inst.verifica()); api.giveUp('programul corect e acum în zona de cod. Apasă steagul verde și privește ce face pisica.'); });
        }
      }, 'Rulează testele');
    },
    rezolva(Q, body) { const i = body._ss; i.seteaza(Q.solutie); i.steag(); i.opreste(); },
    gresit(Q, body) { body._ss.seteaza(Q.gresit || Q.program || Q.start || []); }
  };

  window.SimScratch = {
    versiune: VERSIUNE, FPS,
    categorie, bloc, creeaza,
    urma: (P, o) => urmaPentru(programDin(P), o),
    text: (spec) => textBloc(dinSpec(spec)),
    blocuri: () => Object.keys(DEF), def: (id) => DEF[id], categorii: () => ORDINE_CAT.map(c => CAT[c]),
    ajutor,
    html: (spec, o) => htmlNod(dinSpec(spec), o && o.paleta),
    deseneaza: (el) => deseneaza(el, parseFloat(getComputedStyle(el.closest('.ss') || el).getPropertyValue('--ss-u')) || 0.72),
    stil,
    tipuri: {scratch: tipScratch}
  };
})();
