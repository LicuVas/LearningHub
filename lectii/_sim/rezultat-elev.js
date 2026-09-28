/* rezultat-elev.js — REZULTATUL UNEI VERIFICĂRI, păstrat pentru elevul care stă ACUM pe scaun (28.09.2026).
   PROPRIETAR: rezultat-elev (comun, lecțiile nr. 1). Pentru autoevaluări, „fișa de pornire”, lista „Recitește”.
   Proba: lectii/_sim/_teste/rezultat_elev_proba.py (caseta ADEVĂRATĂ din prezenta.js, 390 px și 1280 px).

   De ce: calculatorul din laborator e COMUN (regula 23 din _campaign/revizuire_completa_2026_09/05_STANDARD_LECTIE.md).
   Lecțiile nr. 1 de la VI, VII și VIII și-au scris fiecare codul lor, iar judecătorii au găsit de fiecare dată alt caz:
   - caseta întreabă „Ești tot Ana?”, nimeni nu răspunde, Dan face verificarea și ea se scrie pe numele Anei;
   - un elev neînscris face verificarea, altul se înscrie în aceeași filă și primește ✘-urile lui fără să fie întrebat;
   - rezultatul primei încercări se pierde la „Înapoi”, la reîncărcare sau când elevul își repară răspunsurile;
   - elevul se schimbă în altă filă, iar fila lecției arată mai departe rezultatul celui dinainte.
   Trecerea 3 a judecătorilor (28.09.2026) a adăugat:
   - GRAV (VI/1): Ana e încă „activă” (sub 90 de minute), Dan nu vede eticheta, iar verificarea lui se scria direct ca
     „Rezultatul lui Pop Ana”, fără întrebare și fără scăpare;
   - GRAV (VII/1): Ana și Bogdan, amândoi neînscriși, în aceeași filă: evaluarea lui devenea „reîncercarea” Anei, cu
     ✗-urile ei ca „prima încercare” a lui; „Începe o fișă nouă” îi golea și încercarea lui;
   - mărunte: titlul tăiat în mijlocul cuvântului; fișa colegului neînscris arătată ca a ta; butonul „Încep din nou”
     pentru elevul înscris (prima încercare rămâne diagnosticul lui, nu se reîncepe nimic).

   Cine stă pe scaun spune assets/js/prezenta.js (caseta „Spune cine ești”): Prezenta.stare() și Prezenta.identitate().
   Regulile:
   1. NUMELE: o verificare trece pe numele lui X, și una de pe numele lui X SE ARATĂ, doar când Prezenta.stare()==='activ'
      ȘI cel de pe scaun a spus, în încărcarea asta a paginii, că e X.
      - La salvare: „Verificarea se scrie pe numele X. Ești X?” — „Da” o scrie pe X; „Nu, sunt alt elev” o lasă fără
        nume și deschide lista (Prezenta.alege()).
      - La citire (judecata 4, VI/1): citeste() întoarce null (asteaptaConfirmare(K) = {elev, ora}) și componenta
        întreabă „Pe calculator e verificarea lui X, de la ora hh:mm. Ești X?” — „Da”: se arată (motivul 'confirmat');
        „Nu, sunt alt elev”: lista, iar verificarea lui X rămâne neatinsă pe numele lui.
      Contează ca „a spus”: „Da” la o întrebare a componentei; o schimbare în casetă cât e pagina deschisă (evenimentul
      `prezenta`); înscrierea / alegerea din listă făcută chiar înainte ca prezenta.js să reîncarce pagina (semn o
      singură dată, 60 s). Confirmarea se pierde după 8 minute fără nicio atingere în pagină (a plecat de la calculator).
   2. FĂRĂ NUME („Ești tot X?” fără răspuns, nimeni înscris, vizitator, prezenta.js lipsă): verificarea stă doar în fila
      asta (sessionStorage), 50 de minute (o oră de laborator), legată de ÎNCĂRCAREA paginii în care s-a făcut.
   3. PRIMA încercare nu se suprascrie: ea e diagnosticul. Ce vine după, în aceeași încărcare (elevul a văzut
      răspunsurile și reface), se ține separat, ca „reîncercare”.
   4. O verificare fără nume din ALTĂ încărcare (reîncărcare, alt elev venit la aceeași filă) nu e arătată și nu primește
      reîncercări până nu răspunde cel de pe scaun „Ai dat-o tu pe cea de la ora hh:mm?”: „Da” o reia, „Nu” o mută
      DEOPARTE (nu se șterge), iar verificarea lui e prima lui încercare.
   5. REVENDICAREA: elevul confirmat e întrebat de verificările fără nume din fila asta: „Verificarea de la ora hh:mm e a
      ta?” (Da / Nu). Numai „Da” o trece pe numele lui; „Nu” o lasă fără nume și pe el nu-l mai întreabă. Întrebarea vine
      SINGURĂ, pe orice pagină a filei care încarcă scriptul (și pe cuprins). Cine are DEJA o verificare pe numele lui la
      cheia aceea e întrebat altfel: „Ai deja verificarea de la ora hh:mm. Și cea de la ora hh:mm e tot a ta?”, cu „Nu”
      primul și implicit (VII/1: două „Da” la rând îi dădeau lui Bogdan ✗-urile Anei ca primă încercare).
   6. REPARAREA: lângă verificare stă rândul „Se salvează pe numele: X”. Proprietarul CONFIRMAT (numai după „Da”) are
      acolo „Sunt X, dar n-am dat-o eu”; la a doua apăsare verificarea iese de pe numele lui și e mutată DEOPARTE
      (lh_rez_<cheie>@_deoparte), nu ștearsă.
   7. „Sunt alt elev” (golesteAlElevuluiDeAcum): nu șterge nimic. Elevului înscris îi deschide lista (Prezenta.alege());
      prima lui încercare rămâne diagnosticul. Fără nume: verificarea devine „a cui?” și intră la regula 4.
   Nimic nu pleacă în rețea. Cheile încep cu lh_rez_. Fără window.Prezenta (pagina deschisă local) merge fără nume.

   Folosire (scriptul poate sta oriunde; prezenta.js poate sosi mai târziu, componenta îl așteaptă):
     <script src="../../_sim/rezultat-elev.js"></script>
     var K = 'vi-m1-l01-initiala';                      // litere, cifre, - _ .
     function deseneaza() { var r = RezultatElev.citeste(K); ... }
     addEventListener('rezultat-elev', deseneaza); deseneaza();
     // la „Verifică”:  RezultatElev.salveaza(K, {bune: [1, 0, 1], ...})  -> {ca: 'prima'|'reincercare', ...}
     // butonul „Sunt alt elev / Încep din nou”:  RezultatElev.golesteAlElevuluiDeAcum(K)
   citeste(K) întoarce null sau
     {rezultat, ora:'hh:mm', cand, reincercare|null, oraReincercare|null, reincercari, elev:'Nume'|null, faraNume, deConfirmat}
   `rezultat` e mereu PRIMA încercare. deConfirmat = verificarea celui de pe scaun, făcută acum, care așteaptă „Ești X?”.
   Obiectele sunt copii: pagina le poate schimba fără să atingă ce e păstrat.
   RezultatElev.cine() -> {stare, elev, confirmat}: stare = starea din prezenta.js sau 'fara-prezenta' / 'alta-fila'.
   RezultatElev.asteaptaConfirmare(K) -> {elev, ora} | null: de ce citeste(K) e null (verificarea lui X așteaptă „Ești X?”).
   citeste(K, {asteptare: true}) -> la fel ca citeste(K), dar în locul acelui null întoarce {asteaptaConfirmare: {elev, ora}}.
   Evenimentul `rezultat-elev` pe window (detail: {motiv, cheie}) cere paginii să redeseneze. Motive: 'salvat',
   'alt-elev', 'confirmat', 'revendicat', 'refuzat', 'deoparte', 'golit', 'alta-fila', 'expirat', 'reafisare'.
   Locul întrebării și al rândului „Se salvează pe numele”: primul element VIZIBIL [data-rezultat-elev-intrebare] de pe
   pagină. Fără el: întrebarea stă sus, fixă (cu loc rezervat deasupra paginii), iar rândul stă imediat după butonul
   „Sunt alt elev…” al paginii (cel cu data-rezultat-elev-alt sau cel al cărui text spune „sunt alt elev” și „încep din
   nou” / „fișă nouă”). Butonului ăstuia componenta îi pune și eticheta: „Sunt alt elev” pentru elevul înscris, textul
   lui pentru ceilalți. Dacă locul dispare la o redesenare sau e ascuns, totul se mută singur. */
(function () {
  'use strict';
  if (window.RezultatElev) return;

  var PREF = 'lh_rez_', FARA = '@_fila', DEOP = '@_deoparte', K_ID = 'lh_prezenta', K_CONF = 'lh_rez_@_confirmat';
  var VALABIL = 50 * 60000, MAX_RE = 10, MAX_DEOP = 20, PAUZA = 8 * 60000, SEMN_VALABIL = 60000;
  var hop = Object.prototype.hasOwnProperty;
  function acum() { return Date.now(); }
  // ÎNCĂRCAREA asta a paginii: o verificare fără nume primește reîncercări doar în încărcarea în care s-a făcut
  var INC = acum().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  /* CINE A SPUS CĂ E EL. confirmat = amprentele elevilor care au spus, în încărcarea asta, că ei stau pe scaun.
     - „Da” la o întrebare a componentei sau o schimbare în casetă cât e pagina deschisă (evenimentul `prezenta`).
     - Semnul de la reîncărcare: prezenta.js reîncarcă pagina imediat după înscriere / alegerea din listă; elevul tocmai
       a spus cine e, deci noua încărcare îl primește confirmat (o singură dată, cel mult 60 s după plecarea paginii).
     - Confirmarea se pierde după 8 minute fără nicio atingere în pagină: Ana pleacă, pagina rămâne deschisă, Dan vine
       peste 25 de minute — nu-i vede fișa și nu scrie pe numele ei fără să fie întrebat.
       De ce 8 și nu 20 (judecătorul VII/1 a întrebat): pauza dintre ore e de 10 minute, iar pagina rămâne des deschisă
       de la o oră la alta. Cu 20 de minute, elevul orei următoare ar găsi-o pe Ana încă „confirmată”: i-ar vedea fișa,
       iar verificarea lui s-ar scrie direct pe numele ei (GRAV A în aceeași încărcare). Costul celor 8 minute: elevul
       care copiază fișa în caiet fără să atingă pagina răspunde o dată „Da, sunt X” ca s-o vadă din nou; pentru asta
       lecția întreabă asteaptaConfirmare(K) și scrie „fișa e aici, răspunde sus «Da»”, nu „fișa e goală”. */
  var confirmat = {}, ultimaMiscare = acum(), marcaj = null, hVazut = null, vazutInitial = false, tSchimbat = 0;
  try {
    var m0 = JSON.parse(window.sessionStorage.getItem(K_CONF));
    window.sessionStorage.removeItem(K_CONF);
    if (m0 && m0.h && acum() - m0.t >= 0 && acum() - m0.t < SEMN_VALABIL) marcaj = m0.h;
  } catch (e) {}
  ['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach(function (ev) {
    window.addEventListener(ev, function () { ultimaMiscare = acum(); }, { passive: true, capture: true });
  });
  function eConfirmat(c) {
    if (!c || !c.elev) return false;
    if (marcaj !== null) { if (c.h === marcaj) confirmat[c.h] = true; marcaj = null; }   // semnul e doar pentru primul elev văzut
    if (confirmat[c.h] && acum() - ultimaMiscare > PAUZA) confirmat = {};                // a plecat de la calculator
    return !!confirmat[c.h];
  }
  function confirma(c) { confirmat[c.h] = true; ultimaMiscare = acum(); }

  /* ---------------- stocarea ----------------
     Dacă browserul nu lasă scrierea (fereastră privată, spațiu plin), păstrăm în memorie cât e pagina deschisă.
     O scriere reușită șterge copia din memorie, deci citirea o preferă doar când e mai nouă. */
  var MEM_L = {}, MEM_S = {};
  function ls() { return window.localStorage; }
  function ss() { return window.sessionStorage; }
  function ia(st, mem, k) {
    var v = null;
    if (hop.call(mem, k)) v = mem[k];
    else { try { v = st().getItem(k); } catch (e) { v = null; } }
    if (v == null) return null;
    try { return JSON.parse(v); } catch (e) { return null; }
  }
  function pune(st, mem, k, o) {
    var v = JSON.stringify(o);
    try { st().setItem(k, v); delete mem[k]; } catch (e) { mem[k] = v; }
  }
  function scoate(st, mem, k) { delete mem[k]; try { st().removeItem(k); } catch (e) {} }
  function eLista(x) { return Object.prototype.toString.call(x) === '[object Array]'; }

  function ora(t) { var d = new Date(t); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function copie(o) { return o == null ? null : JSON.parse(JSON.stringify(o)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function curata(cheie) {
    var k = String(cheie == null ? '' : cheie).replace(/[^\w.-]/g, '_').slice(0, 80);
    if (!k) throw new TypeError('RezultatElev: lipsește cheia lecției');
    return k;
  }
  /* titlul paginii în întrebare: tăiat la un cuvânt întreg, cu „…” (nu în mijlocul cuvântului) */
  function scurtTitlu(s, n) {
    s = String(s || '').replace(/\s+/g, ' ').replace(/^ | $/g, '');
    if (s.length <= n) return s;
    var t = s.slice(0, n + 1), i = t.lastIndexOf(' ');
    t = i > n / 2 ? t.slice(0, i) : s.slice(0, n);
    return t.replace(/[\s,.;:·–—\-]+$/, '') + '…';
  }

  /* ---------------- cine stă pe scaun ----------------
     Cheia elevului e aceeași ca în prezenta.js (cheieElev: școala|clasa|numele fără diacritice, cuvintele în ordine),
     deci „Popescu Ana” și „Ana Popescu” sunt același elev. În stocare stă doar amprenta ei (două sume diferite),
     nu numele în clar. */
  function normNume(s) {
    s = String(s || '');
    try { s = s.normalize('NFD'); } catch (e) {}
    return s.replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/^\s+|\s+$/g, '').split(' ').sort().join(' ');
  }
  function cheieElev(e) { return e.scoala + '|' + e.clasa + '|' + normNume(e.nume); }
  function inm(a, b) {   // înmulțire pe 32 de biți (Math.imul, scrisă de mână)
    var ah = (a >>> 16) & 0xffff, al = a & 0xffff, bh = (b >>> 16) & 0xffff, bl = b & 0xffff;
    return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)) >>> 0;
  }
  function amprenta(s) {
    var h1 = 5381, h2 = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) { h1 = ((h1 << 5) + h1 + s.charCodeAt(i)) >>> 0; h2 = inm((h2 ^ s.charCodeAt(i)) >>> 0, 16777619); }
    return h1.toString(36) + '-' + h2.toString(36);
  }
  function Prez() {
    if (window.Prezenta) return window.Prezenta;
    try { if (window.top !== window && window.top.Prezenta) return window.top.Prezenta; } catch (e) {}   // pagina într-un iframe
    return null;
  }
  /* Gardă: identitatea salvată pe calculator trebuie să fie aceeași cu cea din fila asta. Dacă alt elev s-a înscris
     în altă filă (sau cel de aici a fost scos acolo), fila asta nu mai știe sigur cine e pe scaun: nu arată și nu
     leagă nimic de elevul ei până nu o preia (prezenta.js: evenimentul `prezenta`). */
  function pePc(ck) {
    var v;
    try { v = window.localStorage.getItem(K_ID); } catch (e) { return true; }   // fără acces la stocare n-avem ce compara
    if (v === null) return false;
    try { var o = JSON.parse(v); return !!(o && o.nume) && cheieElev(o) === ck; } catch (e) { return false; }
  }
  function cine() {
    var P = Prez();
    if (!P || typeof P.stare !== 'function') return { stare: 'fara-prezenta', elev: null };
    var s = 'necunoscut', id = null;
    try { s = P.stare(); } catch (e) {}
    if (s !== 'activ') return { stare: s, elev: null };   // 'intreaba' („Ești tot X?”): nimic nu se leagă de X
    try { id = P.identitate(); } catch (e) {}
    if (!id || !id.nume) return { stare: 'necunoscut', elev: null };
    var ck = cheieElev(id);
    if (!pePc(ck)) return { stare: 'alta-fila', elev: null };
    return { stare: 'activ', elev: String(id.nume), h: amprenta(ck) };
  }

  /* ---------------- înregistrările ----------------
     Cu nume (localStorage, lh_rez_<cheie>@<amprenta>): {v:1, prima:{r, t}, re:[{r, t}, … ultimele 10], n}.
     Fără nume (sessionStorage, lh_rez_<cheie>@_fila): {v:2, lista:[…]}; fiecare are în plus
       pl = încărcarea în care s-a făcut (null = „a cui?”), pentru = amprenta lui X cât așteaptă „Ești X?”,
       nu = [amprentele elevilor care au spus „Nu e a mea”], ti = titlul paginii.
     Deoparte (lh_rez_<cheie>@_deoparte, listă): ce a ieșit de pe un nume sau n-a fost a nimănui; nu se șterge. */
  function cheieNumit(k, c) { return PREF + k + '@' + c.h; }
  function cheieFara(k) { return PREF + k + FARA; }
  function valid(r) { return !!(r && r.v === 1 && r.prima && typeof r.prima.t === 'number' && eLista(r.re)); }
  function expirat(r) { var d = acum() - r.prima.t; return d > VALABIL || d < -5 * 60000; }   // și ceasul dat înapoi
  function numit(k, c) { var r = ia(ls, MEM_L, cheieNumit(k, c)); return valid(r) ? r : null; }
  function brut(k) {   // lista din stocare, fără curățare (și formatul de dinainte: o singură verificare)
    var o = ia(ss, MEM_S, cheieFara(k));
    if (!o) return [];
    if (o.v === 1) return valid(o) ? [o] : [];
    return eLista(o.lista) ? o.lista : [];
  }
  function fila(k) {   // verificările fără nume ale filei pentru cheia asta, cele expirate scoase
    var L = brut(k), bune = L.filter(function (r) { return valid(r) && !expirat(r); });
    bune.forEach(function (r) { if (!eLista(r.nu)) r.nu = []; if (r.pl === undefined) r.pl = null; if (!r.pentru) r.pentru = null; });
    if (bune.length !== L.length) scrieFila(k, bune);
    return bune;
  }
  function scrieFila(k, L) { if (L.length) pune(ss, MEM_S, cheieFara(k), { v: 2, lista: L }); else scoate(ss, MEM_S, cheieFara(k)); }
  function curent(L) { for (var i = 0; i < L.length; i++) if (L[i].pl === INC) return L[i]; return null; }   // a celui de acum
  function vechi(L) { return L.filter(function (r) { return r.pl !== INC; }); }                                 // din altă încărcare
  function deoparte(st, mem, k, intrare) {
    var K = PREF + k + DEOP, l = ia(st, mem, K);
    if (!eLista(l)) l = [];
    l.push(intrare); pune(st, mem, K, l.slice(-MAX_DEOP));
  }
  function nou(r, t) { return { v: 1, prima: { r: r, t: t }, re: [], n: 0 }; }
  function adauga(rec, r, t) { rec.re.push({ r: r, t: t }); if (rec.re.length > MAX_RE) rec.re = rec.re.slice(-MAX_RE); rec.n = (rec.n || 0) + 1; }
  /* două verificări ale aceluiași elev: încercările se așază după oră; cea mai veche rămâne PRIMA (diagnosticul) */
  function uneste(a, b) {
    var toate = [];
    [a, b].forEach(function (x) { if (x) toate = toate.concat([x.prima], x.re); });
    toate.sort(function (p, q) { return p.t - q.t; });
    var n = (a ? (a.n || 0) + 1 : 0) + (b ? (b.n || 0) + 1 : 0) - 1;
    return { v: 1, prima: toate[0], re: toate.slice(1).slice(-MAX_RE), n: n };
  }
  function vedere(rec, elev, ca, deConf) {
    var u = rec.re.length ? rec.re[rec.re.length - 1] : null;
    var v = { rezultat: copie(rec.prima.r), ora: ora(rec.prima.t), cand: rec.prima.t,
      reincercare: u ? copie(u.r) : null, oraReincercare: u ? ora(u.t) : null, reincercari: rec.n || rec.re.length,
      elev: elev || null, faraNume: !elev, deConfirmat: !!deConf };
    if (ca) v.ca = ca;
    return v;
  }

  /* cheile folosite de pagina asta (rândul „Se salvează pe numele”, „Ai dat-o tu?”, golirea fără cheie) */
  var chei = {};
  function inregistreaza(k) { if (!hop.call(chei, k)) { chei[k] = 1; planVerifica(); } }
  function areChei() { for (var k in chei) if (hop.call(chei, k)) return true; return false; }
  /* Verificările FĂRĂ NUME din fila asta, oricare ar fi pagina care le-a făcut: le citim chiar din sessionStorage.
     (VIII/1: întrebarea „e a ta?” apărea abia după ce pagina chema citeste(); pe cuprins nu întreba nimic.) */
  function cheiFila() {
    var out = [], toate = [], i, k;
    try { for (i = 0; i < ss().length; i++) toate.push(ss().key(i)); } catch (e) {}
    for (k in MEM_S) if (hop.call(MEM_S, k)) toate.push(k);
    toate.forEach(function (x) {
      if (!x || x.indexOf(PREF) !== 0 || x.length <= PREF.length + FARA.length || x.slice(-FARA.length) !== FARA) return;
      var n = x.slice(PREF.length, -FARA.length);
      if (out.indexOf(n) < 0) out.push(n);
    });
    return out;
  }

  function salveaza(cheie, rezultat) {
    var k = curata(cheie), t = acum(), r, rec, ca;
    try { r = JSON.parse(JSON.stringify(rezultat === undefined ? null : rezultat)); }
    catch (e) { throw new TypeError('RezultatElev.salveaza: rezultatul trebuie să se poată scrie ca JSON'); }
    inregistreaza(k);
    var c = cine();
    if (eConfirmat(c)) {   // elevul a spus deja, în încărcarea asta, că e el: direct pe numele lui
      rec = numit(k, c);
      if (rec) { adauga(rec, r, t); ca = 'reincercare'; } else { rec = nou(r, t); ca = 'prima'; }
      pune(ls, MEM_L, cheieNumit(k, c), rec);
      anunta('salvat', k);
      return vedere(rec, c.elev, ca);
    }
    /* altfel: verificarea celui de pe scaun, în încărcarea asta, fără nume. Cu un elev „activ” neconfirmat aici, ea
       așteaptă „Ești X?” (pentru = X) și nu atinge nimic din ce e deja pe numele lui X. */
    var L = fila(k);
    rec = curent(L);
    if (rec) { adauga(rec, r, t); ca = 'reincercare'; }
    else { rec = nou(r, t); rec.nu = []; rec.ti = String(document.title || '').slice(0, 200); rec.pl = INC; rec.pentru = null; L.push(rec); ca = 'prima'; }
    if (c.elev) rec.pentru = c.h;
    scrieFila(k, L);
    anunta('salvat', k);
    planVerifica();
    return vedere(rec, null, ca, !!c.elev);
  }

  /* verificarea lui X există, dar cel de pe scaun n-a spus încă (în încărcarea asta, în ultimele 8 minute) că e X */
  function asteapta(k, c) {
    if (!c.elev || eConfirmat(c) || curent(fila(k))) return null;
    var r = numit(k, c);
    return r ? { elev: c.elev, ora: ora(r.prima.t) } : null;
  }
  function citeste(cheie, opt) {
    var k = curata(cheie), c, rec;
    inregistreaza(k);
    c = cine();
    if (c.elev) {
      if (!eConfirmat(c)) {
        rec = curent(fila(k));
        if (rec) return vedere(rec, null, null, true);   // ce a făcut ACUM cel de pe scaun
        // pe numele lui X nu se arată nimic până nu spune cel de pe scaun că e X; cu {asteptare:true}, în loc de null,
        // pagina primește semnalul că fișa EXISTĂ și așteaptă „Ești X?” (ca să nu scrie „fișa e goală”)
        var a = opt && opt.asteptare ? asteapta(k, c) : null;
        return a ? { asteaptaConfirmare: a } : null;
      }
      rec = numit(k, c);
      return rec ? vedere(rec, c.elev) : null;
    }
    rec = curent(fila(k));   // doar verificarea din încărcarea asta; una mai veche așteaptă „Ai dat-o tu?”
    return rec ? vedere(rec, null) : null;
  }

  /* „Sunt alt elev” / „Începe o fișă nouă”. Fără cheie: toate verificările paginii. Nu se șterge nimic.
     Elev înscris: Prezenta.alege() (lista „Cine lucrează acum?”); ce e pe numele lui rămâne al lui, iar verificarea
     neconfirmată de acum rămâne fără nume. Fără nume: verificarea de acum devine „a cui?” (pl = null) și următorul
     de pe scaun e întrebat „Ai dat-o tu pe cea de la ora hh:mm?”. */
  function golesteAlElevuluiDeAcum(cheie) {
    var lista = [], k;
    if (cheie == null) { lista = cheiFila(); for (k in chei) if (hop.call(chei, k) && lista.indexOf(k) < 0) lista.push(k); }
    else { k = curata(cheie); inregistreaza(k); lista.push(k); }
    var P = Prez(), s = '';
    try { s = P && typeof P.stare === 'function' ? P.stare() : ''; } catch (e) {}
    var inscris = s === 'activ' || s === 'intreaba';
    lista.forEach(function (x) {
      var L = fila(x), cur = curent(L);
      if (!cur) return;
      cur.pentru = null;
      if (!inscris) cur.pl = null;
      scrieFila(x, L);
    });
    ascunde();
    if (inscris && typeof P.alege === 'function') { try { P.alege(); } catch (e) {} }
    anunta('golit', lista.length === 1 ? lista[0] : null);
    planVerifica();
  }

  /* ---------------- întrebările ----------------
     Una singură pe ecran, în ordinea: „Ești X?” (ce s-a salvat acum pe X) > „Verificarea de la ora hh:mm e a ta?”
     (elev confirmat, verificări fără nume ale filei) > „Ai dat-o tu pe cea de la ora hh:mm?” (nimeni înscris,
     verificări fără nume din altă încărcare, pe cheile paginii). */
  function pas0(c, ks) {   // o verificare nu mai poate aștepta „Ești X?” dacă X nu mai e pe scaun sau pagina s-a reîncărcat
    ks.forEach(function (k) {
      var L = fila(k), sch = false;
      L.forEach(function (r) { if (r.pentru && (r.pl !== INC || !c.elev || r.pentru !== c.h)) { r.pentru = null; sch = true; } });
      if (sch) scrieFila(k, L);
    });
  }
  function numitePagina(c) {   // verificările de pe numele lui X, pe cheile paginii: [{k, r}], cea mai nouă întâi
    var out = [], k, r;
    for (k in chei) if (hop.call(chei, k)) { r = numit(k, c); if (r) out.push({ k: k, r: r }); }
    out.sort(function (a, b) { return b.r.prima.t - a.r.prima.t; });
    return out;
  }
  function deIntrebat(c, ks) {
    var i, j, L, r, cand = [], conf = eConfirmat(c);
    if (c.elev && !conf) {
      for (i = 0; i < ks.length; i++) { r = curent(fila(ks[i])); if (r && r.pentru === c.h) return { tip: 'esti', k: ks[i], r: r }; }
      /* CITIREA (judecata 4, VI/1, geamănul lui GRAV A): pe numele lui X nu se arată nimic și nu se revendică nimic
         până nu spune cel de pe scaun că e X */
      var nm = numitePagina(c);
      if (nm.length) return { tip: 'cine-esti', k: nm[0].k, r: nm[0].r };
      for (i = 0; i < ks.length; i++) { L = fila(ks[i]); for (j = 0; j < L.length; j++) if (!L[j].pentru && L[j].nu.indexOf(c.h) < 0) return { tip: 'cine-esti', k: ks[i], r: null }; }
      return null;
    }
    if (c.elev) {
      for (i = 0; i < ks.length; i++) { L = fila(ks[i]); for (j = 0; j < L.length; j++) { r = L[j]; if (!r.pentru && r.nu.indexOf(c.h) < 0) cand.push({ tip: 'e-a-ta', k: ks[i], r: r }); } }
      cand.sort(function (a, b) { return b.r.prima.t - a.r.prima.t; });
      /* Judecata 4 (VII/1): Bogdan apăsa „Da” la AMBELE „e a ta?” (a lui, apoi cea mai veche, a Anei) și ✗-urile Anei
         deveneau prima lui încercare. Cine are DEJA o verificare pe numele lui la cheia asta e întrebat altfel:
         „Ai deja … Și cea de la ora … e tot a ta?”, cu „Nu” primul și implicit. */
      if (cand[0]) { var deja = numit(cand[0].k, c); if (deja) { cand[0].tip = 'e-a-ta-si'; cand[0].deja = deja; } }
      return cand[0] || null;
    } else {
      for (i = 0; i < ks.length; i++) if (hop.call(chei, ks[i])) { L = vechi(fila(ks[i])); for (j = 0; j < L.length; j++) cand.push({ tip: 'ai-dat-o', k: ks[i], r: L[j] }); }
    }
    cand.sort(function (a, b) { return b.r.prima.t - a.r.prima.t; });   // cea mai nouă întâi
    return cand[0] || null;
  }

  var CSS = '#lh-rez-q{position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:2147483001;width:440px;max-width:calc(100vw - 24px);' +
    'box-sizing:border-box;background:#1b2234;color:#e8ecf4;border:1px solid #5b8cff;border-radius:12px;padding:12px 14px;' +
    'box-shadow:0 4px 16px rgba(0,0,0,.5);font:15px/1.4 system-ui,"Segoe UI",Arial,sans-serif;text-align:left}' +
    '#lh-rez-q.in{position:static;transform:none;width:auto;max-width:100%;margin:10px 0;box-shadow:none}' +
    '#lh-rez-q b{color:#fff}#lh-rez-q p{margin:0}#lh-rez-q .mic{font-size:13px;color:#b8c3da;margin-top:6px}' +
    '#lh-rez-q .row{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}' +
    '#lh-rez-q button{font:inherit;min-height:40px;min-width:64px;padding:8px 14px;border-radius:8px;border:1px solid #5b8cff;background:#5b8cff;color:#fff;cursor:pointer}' +
    '#lh-rez-q button.g{background:transparent;color:#dbe3f3;border-color:#6b7a99}' +
    '#lh-rez-q button:focus-visible,.lh-rez-rand button:focus-visible{outline:3px solid #ffd166;outline-offset:2px}' +
    '.lh-rez-rand{flex-basis:100%;width:100%;box-sizing:border-box;margin:6px 0;font-size:13.5px;line-height:1.45;opacity:.92}' +
    '.lh-rez-rand button{font:inherit;min-height:32px;padding:4px 10px;margin:4px 0 0 6px;border-radius:8px;border:1px solid currentColor;background:transparent;color:inherit;cursor:pointer}' +
    '.lh-rez-rand button.arm{border-width:2px;font-weight:600}@media print{#lh-rez-q,.lh-rez-rand{display:none}}';
  function stil() {
    if (document.getElementById('lh-rez-css')) return;
    var st = document.createElement('style'); st.id = 'lh-rez-css'; st.textContent = CSS; (document.head || document.body).appendChild(st);
  }
  var box = null, intrebat = null, plan = 0;
  function planVerifica() { if (!plan) plan = setTimeout(verifica, 0); }
  function verifica() {
    plan = 0;
    if (!document.body) { document.addEventListener('DOMContentLoaded', planVerifica); return; }
    var c = cine(), ks = cheiFila();
    pas0(c, ks);
    var q = deIntrebat(c, ks);
    if (!q) { ascunde(); aranjeaza(c); return; }
    var t0 = q.r ? q.r.prima.t : 0, semn = q.tip + '|' + q.k + '|' + t0 + '|' + (c.h || '');
    if (!(box && intrebat && intrebat.semn === semn)) {
      intrebat = { tip: q.tip, k: q.k, t: t0, h: c.h || null, semn: semn };
      arata(q, c);
    }
    aseaza(); aranjeaza(c);
  }
  function arata(q, c) {
    stil();
    ascunde(true);
    var o = q.r ? ora(q.r.prima.t) : '', ti = q.r && q.r.ti && q.r.ti !== document.title ? ', pe pagina „' + esc(scurtTitlu(q.r.ti, 60)) + '”' : '', sus, jos, da, nu;
    if (q.tip === 'cine-esti') {
      sus = (q.r ? 'Pe calculator e verificarea lui <b>' + esc(c.elev) + '</b>, de la ora <b>' + o + '</b>.' : 'Pe calculator lucrează <b>' + esc(c.elev) + '</b>.') +
        ' Ești <b>' + esc(c.elev) + '</b>?';
      jos = q.r ? 'O vezi doar dacă ești ' + esc(c.elev) + '. Dacă nu ești, apasă „Nu, sunt alt elev” și alege-te din listă: verificarea lui ' + esc(c.elev) + ' rămâne a lui, neatinsă.'
        : 'Dacă nu ești, apasă „Nu, sunt alt elev” și alege-te din listă.';
      da = 'Da, sunt ' + esc(c.elev); nu = 'Nu, sunt alt elev';
    } else if (q.tip === 'esti') {
      sus = 'Verificarea se scrie pe numele <b>' + esc(c.elev) + '</b>. Ești <b>' + esc(c.elev) + '</b>?';
      jos = 'Dacă nu ești, apasă „Nu, sunt alt elev”: verificarea ta rămâne fără nume, iar tu te alegi din listă sau spui cine ești.';
      da = 'Da, sunt eu'; nu = 'Nu, sunt alt elev';
    } else if (q.tip === 'e-a-ta-si') {
      sus = 'Ai deja verificarea de la ora <b>' + ora(q.deja.prima.t) + '</b>. Și cea de la ora <b>' + o + '</b> e tot a ta?';
      jos = 'De obicei nu: fiecare elev are o singură primă încercare. Apasă „Da” doar dacă ai dat-o de două ori, TU' + ti + '.';
      da = 'Da, e tot a mea'; nu = 'Nu, nu e a mea';
    } else if (q.tip === 'e-a-ta') {
      sus = 'Verificarea de la ora <b>' + o + '</b> e a ta?';
      jos = 'E făcută în fila asta' + ti + ', înainte să spui cine ești. Apasă „Da” doar dacă ai făcut-o TU: atunci trece pe numele tău (<b>' + esc(c.elev) + '</b>).';
      da = 'Da, e a mea'; nu = 'Nu, nu e a mea';
    } else {
      sus = 'Ai dat-o tu pe cea de la ora <b>' + o + '</b>?';
      jos = 'Pe calculator e o verificare fără nume, făcută în fila asta' + ti + '. „Da”: o vezi și continui de la ea. „Nu”: o pun deoparte (nu se șterge), iar verificarea ta e prima ta încercare.';
      da = 'Da, eu am dat-o'; nu = 'Nu, nu e a mea';
    }
    box = document.createElement('div');
    box.id = 'lh-rez-q'; box.setAttribute('role', 'region'); box.setAttribute('aria-live', 'polite'); box.setAttribute('data-tip', q.tip);
    box.setAttribute('aria-label', 'Întrebare despre o verificare');
    var nuIntai = q.tip === 'e-a-ta-si';   // aici „Nu” e răspunsul obișnuit: primul, plin, cu focus
    box.innerHTML = '<p>' + sus + '</p><p class="mic">' + jos + '</p><div class="row">' + (nuIntai
      ? '<button type="button" id="lh-rez-nu">' + nu + '</button><button type="button" class="g" id="lh-rez-da">' + da + '</button>'
      : '<button type="button" id="lh-rez-da">' + da + '</button><button type="button" class="g" id="lh-rez-nu">' + nu + '</button>') + '</div>';
    box.querySelector('#lh-rez-da').onclick = function () { raspuns(true); };
    box.querySelector('#lh-rez-nu').onclick = function () { raspuns(false); };
    urmareste(true);
    if (nuIntai) setTimeout(function () { var b = document.getElementById('lh-rez-nu'); if (b) { try { b.focus({ preventScroll: true }); } catch (e) { b.focus(); } } }, 0);
  }
  /* LOCUL întrebării: primul loc VIZIBIL [data-rezultat-elev-intrebare]; dacă locul dispare (atelierul se redesenează)
     sau e ascuns, trece sus, fixă; când apare iar un loc vizibil, se mută în el (cu butoanele ei, neatinse). */
  function vizibilEl(e) { return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length); }
  function locul() {
    var l = document.querySelectorAll('[data-rezultat-elev-intrebare]');
    for (var i = 0; i < l.length; i++) if (vizibilEl(l[i])) return l[i];
    return null;
  }
  function aseaza() {
    if (!box || !document.body) return;
    var loc = locul();
    if (loc) { if (box.parentNode !== loc) { box.className = 'in'; loc.insertBefore(box, loc.firstChild); elibereazaSus(); } }
    else if (box.parentNode !== document.body) { box.className = ''; document.body.appendChild(box); }
    if (box.className !== 'in') rezervaSus();
  }
  function ascunde(pastreaza) {
    if (box && box.parentNode) box.parentNode.removeChild(box);
    box = null; if (!pastreaza) intrebat = null;
    elibereazaSus();
    urmareste(false);
  }
  /* Întrebarea fixă stă sus. Fără loc rezervat ar acoperi, pe telefon, începutul paginii (titlul, bara pașilor,
     „← Înapoi”), care nu se poate derula de sub ea. Cât e pe ecran, pagina primește deasupra spațiu cât ea
     (ca prezenta.js, care rezervă jos loc pentru eticheta lui). */
  var padInline = null, padBaza = 0;
  function rezervaSus() {
    if (!box || box.className === 'in' || !document.body) return;
    var b = document.body;
    // spațiul de sus al paginii, măsurat O DATĂ, înainte să punem noi ceva (altfel ne-am măsura pe noi înșine)
    if (padInline === null) { padInline = b.style.paddingTop; padBaza = parseFloat(getComputedStyle(b).paddingTop) || 0; }
    var vrut = Math.round(padBaza + box.getBoundingClientRect().height + 24) + 'px';
    if (b.style.paddingTop !== vrut) b.style.paddingTop = vrut;   // scriem doar când se schimbă (MutationObserver-ul ne vede)
  }
  function elibereazaSus() { if (padInline !== null && document.body) { document.body.style.paddingTop = padInline; padInline = null; } }
  window.addEventListener('resize', rezervaSus);

  function raspuns(da) {
    var c = cine(), q = intrebat;
    if (!q || (c.h || null) !== q.h) { ascunde(); planVerifica(); return; }   // între timp s-a schimbat elevul
    var P0 = Prez();
    if (q.tip === 'cine-esti') {   // „Da”: rezultatul lui se arată; „Nu”: lista, iar ce e pe numele lui X rămâne neatins
      ascunde();
      if (da) { confirma(c); anunta('confirmat', q.k); }
      else if (P0 && typeof P0.alege === 'function') { try { P0.alege(); } catch (e) {} }
      planVerifica();
      return;
    }
    var L = fila(q.k), r = null, i, motiv;
    for (i = 0; i < L.length; i++) if (L[i].prima.t === q.t) r = L[i];
    if (!r) { ascunde(); planVerifica(); return; }
    if (q.tip === 'esti' || q.tip === 'e-a-ta' || q.tip === 'e-a-ta-si') {
      if (da) {
        confirma(c);
        pune(ls, MEM_L, cheieNumit(q.k, c), uneste(numit(q.k, c), r));
        L.splice(L.indexOf(r), 1); motiv = 'revendicat';
      } else {
        r.nu = r.nu.concat([c.h]).slice(-20); r.pentru = null;
        if (q.tip !== 'esti' && r.pl === INC) r.pl = null;   // nu e a lui: nici nu i se mai arată ca a lui
        motiv = 'refuzat';
      }
    } else if (da) {   // „Ai dat-o tu?” — Da: o reia în încărcarea asta; ce a făcut între timp devine reîncercare
      var cur = curent(L), m = r;
      L.splice(L.indexOf(r), 1);
      if (cur) { L.splice(L.indexOf(cur), 1); m = uneste(r, cur); m.nu = r.nu.concat(cur.nu); m.ti = r.ti || cur.ti; m.pentru = cur.pentru || null; }
      m.pl = INC; L.push(m); motiv = 'revendicat';
    } else {           // „Ai dat-o tu?” — Nu: deoparte, nu ștearsă; verificarea lui e prima lui încercare
      L.splice(L.indexOf(r), 1);
      deoparte(ss, MEM_S, q.k, { cand: acum(), rec: r });
      motiv = 'deoparte';
    }
    scrieFila(q.k, L);
    ascunde();
    anunta(motiv, q.k);
    if (q.tip === 'esti' && !da && P0 && typeof P0.alege === 'function') { try { P0.alege(); } catch (e) {} }
    planVerifica();
  }

  /* ---------------- rândul „Se salvează pe numele: X” și butonul paginii „Sunt alt elev” ----------------
     Rândul stă în locul [data-rezultat-elev-intrebare] (dacă pagina are unul vizibil), altfel imediat după butonul
     „Sunt alt elev…” al paginii, adică lângă rezultat. Proprietarul are acolo „Nu e verificarea mea” (două apăsări). */
  var RE_ALT = /sunt alt elev/, RE_NOU = /(incep din nou|fisa noua)/, ETICHETA_INSCRIS = 'Sunt alt elev';
  function simplu(s) { s = String(s || ''); try { s = s.normalize('NFD'); } catch (e) {} return s.replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' '); }
  function butoaneAlt() {
    var out = [], l = document.querySelectorAll('[data-rezultat-elev-alt],button,[role="button"]'), i, b;
    for (i = 0; i < l.length; i++) {
      b = l[i];
      if (b._lhRez === undefined) {   // o singură dată pe buton (proprietate JS, nu atribut: nu murdărim pagina)
        var t = simplu(b.textContent);
        b._lhRez = b.hasAttribute('data-rezultat-elev-alt') || (RE_ALT.test(t) && RE_NOU.test(t));
        if (b._lhRez) b._lhRezT0 = String(b.textContent).replace(/^\s+|\s+$/g, '');
      }
      if (b._lhRez) out.push(b);
    }
    return out;
  }
  var armat = null;   // {k, pana}: prima apăsare pe „Nu e verificarea mea”
  function continutRand(c) {
    if (!c.elev) return c.stare === 'fara-prezenta' ? 'Verificarea se păstrează doar în fila asta, 50 de minute.'
      : 'Se păstrează fără nume, doar în fila asta, 50 de minute. Spune cine ești (jos, pe etichetă) ca să treacă pe numele tău.';
    var h = 'Se salvează pe numele: <b>' + esc(c.elev) + '</b>.', cu = [], k;
    /* butonul proprietarului: DOAR după ce cel de pe scaun a spus că e X (judecata 4: formularea „Nu e verificarea mea”
       era adevărată pentru Dan, care în două apăsări muta deoparte diagnosticul real al Anei) */
    if (!eConfirmat(c)) return h + ' Nu ești ' + esc(c.elev) + '? Apasă „Sunt alt elev”.';
    for (k in chei) if (hop.call(chei, k) && numit(k, c)) cu.push(k);
    cu.forEach(function (x) {
      var arm = armat && armat.k === x && armat.pana > acum();
      h += ' <button type="button" class="' + (arm ? 'arm' : '') + '" data-lh-rez-nu-e="' + esc(x) + '">' +
        (arm ? 'Sigur? Apasă încă o dată: o scot de pe numele tău (nu se șterge)'
          : 'Sunt ' + esc(c.elev) + ', dar n-am dat-o eu' + (cu.length > 1 ? ' (ora ' + ora(numit(x, c).prima.t) + ')' : '')) + '</button>';
    });
    return h;
  }
  function aranjeaza(c) {
    if (!document.body) return;
    c = c || cine();
    var alt = butoaneAlt(), i, tinte = [], loc = locul();
    alt.forEach(function (b) {   // elevul înscris nu „începe din nou”: prima lui încercare rămâne diagnosticul
      var vrut = c.elev ? ETICHETA_INSCRIS : b._lhRezT0;
      if (vrut && !b.childElementCount && b.textContent !== vrut) b.textContent = vrut;
    });
    if (areChei()) { if (loc) tinte.push({ in: loc }); else alt.forEach(function (b) { if (vizibilEl(b) && b.parentNode) tinte.push({ dupa: b }); }); }
    var html = tinte.length ? continutRand(c) : '', vazute = [];
    if (tinte.length) stil();
    tinte.forEach(function (x) {
      var el = null, j;
      if (x.in) { for (j = 0; j < x.in.children.length; j++) if (x.in.children[j].className === 'lh-rez-rand') el = x.in.children[j]; }
      else { el = x.dupa.nextElementSibling; if (el && el.className !== 'lh-rez-rand') el = null; }
      if (!el) {
        el = document.createElement('div'); el.className = 'lh-rez-rand'; el.setAttribute('aria-live', 'polite');
        if (x.in) x.in.appendChild(el); else x.dupa.parentNode.insertBefore(el, x.dupa.nextSibling);
      }
      if (el._lhHtml !== html) { el.innerHTML = html; el._lhHtml = html; }
      vazute.push(el);
    });
    var toate = document.querySelectorAll('.lh-rez-rand');
    for (i = 0; i < toate.length; i++) if (vazute.indexOf(toate[i]) < 0 && toate[i].parentNode) toate[i].parentNode.removeChild(toate[i]);
  }
  function scoateDePeNume(k, c) {   // „Nu e verificarea mea”, a doua apăsare: deoparte (nu ștearsă), apoi de pe numele lui
    var rec = numit(k, c);
    if (!rec) return;
    deoparte(ls, MEM_L, k, { de: c.h, cand: acum(), rec: rec });
    scoate(ls, MEM_L, cheieNumit(k, c));
    anunta('deoparte', k);
  }
  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('[data-lh-rez-nu-e]') : null;
    if (!b) return;
    var k = b.getAttribute('data-lh-rez-nu-e'), c = cine();
    if (!eConfirmat(c)) { planVerifica(); return; }
    if (armat && armat.k === k && armat.pana > acum()) { armat = null; scoateDePeNume(k, c); }
    else { armat = { k: k, pana: acum() + 8000 }; setTimeout(planVerifica, 8100); }
    planVerifica();
  });

  /* orice redesenare a paginii: rândul și eticheta butonului se repun (cel mult o dată la 150 ms); cât e întrebarea pe
     ecran, și schimbările de clasă/stil (un atelier ascuns), imediat */
  var obsC = null, obsA = null, tMut = 0;
  function laMutatie() { if (!tMut) tMut = setTimeout(function () { tMut = 0; verifica(); }, box ? 0 : 150); }
  function urmareste(cuAtribute) {
    if (!window.MutationObserver || !document.body) return;
    try {
      if (!obsC) { obsC = new MutationObserver(laMutatie); obsC.observe(document.body, { childList: true, subtree: true }); }
      if (cuAtribute && !obsA) { obsA = new MutationObserver(laMutatie); obsA.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class', 'style', 'hidden', 'open'] }); }
      if (!cuAtribute && obsA) { obsA.disconnect(); obsA = null; }
    } catch (e) {}
  }

  /* ---------------- anunțarea paginii ---------------- */
  var semnAnuntat = null;
  // cine e pe scaun + dacă a spus că e el: când confirmarea se pierde (pauza de 8 minute), pagina redesenează
  function semnCine() { var c = cine(); return c.stare + '|' + (c.h || '') + '|' + (eConfirmat(c) ? 1 : 0); }
  function anunta(motiv, cheie) {
    semnAnuntat = semnCine();
    var d = { motiv: motiv, cheie: cheie || null }, ev;
    try { ev = new CustomEvent('rezultat-elev', { detail: d }); }
    catch (e) { ev = document.createEvent('CustomEvent'); ev.initCustomEvent('rezultat-elev', false, false, d); }
    window.dispatchEvent(ev);
  }
  function vede(c) {   // ține minte cine e pe scaun și CÂND s-a schimbat ultima oară (pentru semnul de la reîncărcare)
    if (!vazutInitial) { if (c.stare !== 'fara-prezenta') { vazutInitial = true; hVazut = c.h || null; } return; }
    if ((c.h || null) !== hVazut) { hVazut = c.h || null; tSchimbat = acum(); }
  }
  function altElev() {
    vede(cine());
    if (semnCine() !== semnAnuntat) anunta('alt-elev');
    planVerifica();
  }
  /* caseta: înscriere, „Da, sunt eu”, alegere din listă, „Schimbă elevul”, preluarea din altă filă. O schimbare făcută
     în casetă cât e pagina deschisă = cel de pe scaun a spus cine e (nu mai e nevoie de „Ești X?”). */
  window.addEventListener('prezenta', function () {
    var c = cine();
    vazutInitial = true; hVazut = c.h || null; tSchimbat = acum();
    if (c.elev) confirma(c);
    anunta('alt-elev'); planVerifica();
  });
  /* Semnul de la reîncărcare: dacă cel de pe scaun și-a schimbat identitatea în casetă chiar acum (în ultimele 60 s:
     înscriere, alegere din listă — după care prezenta.js reîncarcă pagina), următoarea încărcare îl primește
     confirmat. O schimbare veche nu lasă semn: Dan care reîncarcă pagina Anei peste 25 de minute e întrebat. */
  window.addEventListener('pagehide', function () {
    var c = cine();
    if (!c.elev || !vazutInitial) return;
    if (c.h !== hVazut || acum() - tSchimbat < SEMN_VALABIL) {   // c.h !== hVazut: schimbată în ultima secundă, încă nevăzută
      try { window.sessionStorage.setItem(K_CONF, JSON.stringify({ h: c.h, t: acum() })); } catch (e) {}
    }
  });
  window.addEventListener('storage', function (e) {
    var k = e.key;
    if (k === null) { anunta('alta-fila'); planVerifica(); return; }   // stocarea golită
    if (k.indexOf(PREF) === 0) { var lk = k.slice(PREF.length).split('@')[0]; if (hop.call(chei, lk)) { anunta('alta-fila', lk); planVerifica(); } return; }
    if (k === K_ID) altElev();   // altă filă a schimbat elevul (fila asta îl preia prin prezenta.js)
  });
  window.addEventListener('pageshow', function (e) { if (e.persisted) { anunta('reafisare'); planVerifica(); } });   // „Înapoi” din cache
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') altElev(); });
  /* Paznicul: prezenta.js se încarcă după noi (site-credit.js și motor.js îl aduc cu `defer`), iar unele schimbări
     n-au eveniment (sosirea casetei, garda de mai sus). O dată pe secundă: s-a schimbat cine e pe scaun? A expirat
     un rezultat fără nume? */
  semnAnuntat = semnCine();
  setInterval(function () {
    altElev();
    cheiFila().forEach(function (k) { var n = brut(k).length; if (fila(k).length < n) { anunta('expirat', k); planVerifica(); } });
  }, 1000);
  planVerifica();   // o verificare fără nume din fila asta primește întrebarea chiar dacă pagina nu cheamă nimic
  if (document.body) urmareste(false); else document.addEventListener('DOMContentLoaded', function () { urmareste(false); });

  window.RezultatElev = {
    salveaza: salveaza,
    citeste: citeste,
    golesteAlElevuluiDeAcum: golesteAlElevuluiDeAcum,
    cine: function () { var c = cine(); return { stare: c.stare, elev: c.elev, confirmat: eConfirmat(c) }; },
    /* citeste(K) e null și pentru că pe calculator e verificarea lui X, iar cel de pe scaun n-a spus încă, în încărcarea
       asta, că e X. Atunci asta întoarce {elev, ora}: pagina poate scrie „Răspunde întâi sus: ești X?” în loc de
       „nu e încă niciun rezultat”. Altfel null. */
    asteaptaConfirmare: function (cheie) { var k = curata(cheie); inregistreaza(k); return asteapta(k, cine()); },
    VALABIL_MIN: VALABIL / 60000
  };
})();
