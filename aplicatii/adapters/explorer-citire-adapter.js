/* explorer-citire-adapter.js — tipurile „explorer” și „cale” ale motorului de lecții, pe biblioteca aplicatii/ (explorer.js).
   Înlocuiește lectii/_sim/explorer-citire.js în lecția m2-l09 (și în orice lecție care citește Explorer-ul ca el).
   Folosire (după aplicatii/aplicatii.js, care încarcă explorer.js și stare.js):
     <script src="../../../aplicatii/aplicatii.js"></script>
     <script src="../../../aplicatii/adapters/explorer-citire-adapter.js"></script>
     JocMotor.porneste({ …, tipuri:{explorer:SimExplorerCitire, cale:TipCale} })

   Verdictul vine din LH.aplicatii stare() (inst.stare()) după gesturile elevului, nu din starea simulatorului vechi:
   - {in:cale}     cale_curenta
   - {sel:nume}    selectie (numele real al elementului, cu extensie; folderele cu /)
   - {vazut:cale}  elevul a făcut clic pe bara de adresă (bara_adresa.clicata) cât era în cale; urmărit aici, din sondare
   - {cale:true}   caseta de răspuns din pagină (Q.raspuns) are calea corectă (verificaCale, copiat din simulatorul vechi)
   Pornirea din alt folder (Q.start) se face prin gesturile bibliotecii (clic + Enter), înainte ca elevul să înceapă.
   „Arată-mi răspunsul” (noaptea 27-28.11.2026, ca simulatorul vechi, care aplica Q.solutie): joacă Q.solutie în Explorer prin
   aceleași gesturi ale bibliotecii ca pornirea (clic + Enter pe rânduri, clic în bara de adresă) și pune calea în casetă.
   Textul spune „am făcut pașii” DOAR dacă după asta testele exercițiului chiar trec; altfel spune pașii exercițiului de față,
   ca elevul să-i facă el, fără să afirme ceva despre fereastră. Q.solutieText (scris pentru simulatorul vechi) nu se mai
   afișează: el descrie fereastra de la capăt, iar testele de sub Explorer arată deja asta. */
(function () {
  'use strict';
  const L = window.LH && window.LH.aplicatii;
  if (!L) throw new Error('explorer-citire-adapter: biblioteca aplicatii/ nu e încărcată (aplicatii.js înainte de adaptor)');

  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ext = n => { const i = n.lastIndexOf('.'); return i > 0 ? n.slice(i + 1) : ''; };
  /* calea din lecție (C:/Users/Ana/Documents/…, cu Documents în engleză) ↔ Documente/… din bibliotecă (pe ecran: Documente) */
  const DOC_CALE = 'C:\\Users\\Ana\\Documents';
  const DOC_PREF = 'C:/Users/Ana/Documents/';
  const laBiblioteca = c => (typeof c === 'string' && c.indexOf(DOC_PREF) === 0) ? 'Documente/' + c.slice(DOC_PREF.length) : c;
  const norm = c => (c === 'PC' ? 'Acest PC' : laBiblioteca(c));
  /* Q.fs (lista de fișiere a lecției) → conținutul Documente/ al bibliotecii: căi relative la Documente, cu dimensiune și dată */
  function documente(fs) {
    const arbore = [], detalii = {};
    (fs || []).forEach(e => {
      const cale = Array.isArray(e) ? e[0] : e;
      if (typeof cale !== 'string' || cale.indexOf(DOC_PREF) !== 0) return;
      const rel = cale.slice(DOC_PREF.length);
      arbore.push(rel);
      if (Array.isArray(e)) detalii[rel] = [e[1], e[2]];
    });
    return arbore.length ? { cale: DOC_CALE, arbore, detalii } : null;
  }
  const pauza = ms => new Promise(r => setTimeout(r, ms));

  let css_ok = false;
  function css() {
    if (css_ok) return; css_ok = true;
    const s = document.createElement('style');
    s.id = 'ae-css';
    s.textContent = `
.ae-cum{margin:0 0 8px;font-size:.88rem;color:var(--ink2)}
.ae-host{min-height:0}
.ae-rasp{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:8px 0;font-size:.9rem}
.ae-rasp input{font-family:var(--fm);font-size:.9rem;padding:6px 8px;min-width:200px;flex:1 1 200px;max-width:100%;border:1px solid var(--accent);border-radius:6px;background:var(--paper);color:var(--ink)}
.ae-mic{font-size:.84rem;color:var(--ink2);margin:4px 0}
.ae-teste{margin:8px 0;font-size:.9rem}
.ae-teste .lbl{font-weight:700;color:var(--accent)}
.ae-teste ol{list-style:none;padding:0;margin:4px 0}
.ae-teste li{display:flex;gap:8px;margin:2px 0;color:var(--ink2)}
.ae-teste li.ok{color:var(--ok)}`;
    document.head.appendChild(s);
  }

  /* verificarea căii scrise de elev — copie a regulilor din lectii/_sim/explorer-citire.js (aceleași mesaje) */
  function verificaCale(txt, ok) {
    const raw = String(txt || '').trim();
    const B = '<code>\\</code>';
    if (!raw) return { ok: false, msg: 'Scrie calea în casetă.' };
    if (raw.includes('/')) return { ok: false, msg: `Între părțile căii pune bara ${B} (bara spre stânga), nu <code>/</code>. Așa scrie Windows calea când faci clic pe bara de adresă. Nu găsești tasta? Apasă butonul <b>Pune \\</b>.` };
    if (/[›>]/.test(raw)) return { ok: false, msg: `Semnul › apare doar în bara cu butoane. În cale, între părți stă ${B}.` };
    if (/\s\\|\\\s/.test(raw)) return { ok: false, msg: `Nu pune spații lângă ${B}: spațiul ar deveni parte din nume, iar Windows n-ar mai găsi locul.` };
    if (/\\\\/.test(raw.replace(/\\+$/, ''))) return { ok: false, msg: `Între două părți pune o singură bară ${B}. Bara de adresă ar primi și două, dar Windows scrie calea cu una singură.` };
    const a = raw.replace(/\\+$/, '').toLowerCase(), b = String(ok).replace(/\\+$/, '').toLowerCase();
    if (a === b) return { ok: true };
    const e = ext(b.slice(b.lastIndexOf('\\') + 1));
    const tinta = e ? 'fișierul' : 'folderul cerut';
    if (e && a === b.slice(0, b.length - e.length - 1)) return { ok: false, msg: `Lipsește extensia de la sfârșit (<code>.${e}</code>). Numele adevărat al fișierului are extensia, chiar dacă Explorer o ascunde. O afli din coloana Tip.` };
    if (/(^|\\)documente(\\|$)/.test(a) && /(^|\\)documents(\\|$)/.test(b)) return { ok: false, msg: 'Pe ecran scrie „Documente”, dar în cale Windows păstrează numele englezesc: <code>Documents</code>. Uită-te în caseta de adresă, după clic.' };
    if (/(^|\\)utilizatori(\\|$)/.test(a)) return { ok: false, msg: 'Pe ecran scrie „Utilizatori”, dar în cale scrie <code>Users</code>.' };
    if (/^(acest pc|this pc)/.test(a)) return { ok: false, msg: 'Calea începe cu litera unității și două puncte (de exemplu <code>C:</code>), nu cu „Acest PC”.' };
    if (/^[a-z]:/.test(b)) {
      const u = b.slice(0, 2);
      if (/\([a-z]:\)/.test(a)) return { ok: false, msg: `La început scrii doar litera și două puncte: <code>${u.toUpperCase()}</code>, fără numele unității din fața parantezei.` };
      if (!a.startsWith(u)) return { ok: false, msg: `Calea începe cu unitatea pe care stă ${tinta}: <code>${u.toUpperCase()}</code>.` };
      if (!a.startsWith(u + '\\')) return { ok: false, msg: `După <code>${u.toUpperCase()}</code> vine bara ${B}, apoi primul folder.` };
    }
    const pa = a.split('\\'), pb = b.split('\\');
    if (pa.length < pb.length && pb[pb.length - 1] === pa[pa.length - 1]) return { ok: false, msg: `Lipsește un folder din drum. Scrie toate folderele, în ordine, de la unitate până la ${e ? 'fișier' : 'folderul cerut'}.` };
    if (pa.length === pb.length && pa.slice().sort().join('|') === pb.slice().sort().join('|')) return { ok: false, msg: `Ai toate părțile, dar nu în ordine: unitatea întâi, apoi folderele de la cel din afară la cel dinăuntru, iar ${tinta} la sfârșit.` };
    return { ok: false, msg: e ? `Nu e calea bună. Citește-o din nou: unitatea, folderele în ordine, apoi fișierul, cu ${B} între ele.` : `Nu e calea bună. Citește-o din nou: unitatea, apoi folderele în ordine, până la folderul cerut, cu ${B} între ele.` };
  }
  function puneBackslash(inp) {
    const st = inp.selectionStart == null ? inp.value.length : inp.selectionStart, en = inp.selectionEnd == null ? st : inp.selectionEnd;
    inp.setRangeText('\\', st, en, 'end'); inp.focus({ preventScroll: true }); inp.dispatchEvent(new Event('input', { bubbles: true }));
  }

  /* pornirea într-un alt folder: clic pe fiecare pas (unitate, folder) + Enter, prin gesturile bibliotecii */
  /* fiecare pas: așteaptă rândul, îl selectează, apasă Enter și așteaptă ca biblioteca să ajungă în folderul cerut (cu o reîncercare) */
  /* prefix = folderul în care ești deja (ex. 'Documente/'), iar cale e drumul de acolo în jos */
  async function navigheaza(root, cale, stareFn, prefix) {
    if (!cale || cale === 'PC') return;
    const parti = cale.replace(/\/$/, '').split('/');
    for (let i = 0; i < parti.length; i++) {
      const tinta = (prefix || '') + parti.slice(0, i + 1).join('/') + '/';
      for (let incercare = 0; incercare < 3 && stareFn().cale_curenta !== tinta; incercare++) {
        let rand = null;
        for (let t = 0; t < 20 && !rand; t++) { rand = root.querySelector(`.lh-ap-e-rand[data-lh-id="${CSS.escape(parti[i])}"]`); if (!rand) await pauza(50); }
        if (!rand) return;
        rand.click();
        await pauza(60);
        /* Enter ca de la tastatură: focusul e pe Explorer (root are tabIndex -1), tasta pleacă de acolo */
        try { root.focus({ preventScroll: true }); } catch (e) { /* */ }
        root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        for (let t = 0; t < 20 && stareFn().cale_curenta !== tinta; t++) await pauza(50);
      }
      await pauza(150);   /* biblioteca își redesenează lista după schimbarea folderului; până atunci rândurile vechi nu se aleg */
    }
  }

  function testa(Q, st, c) {
    const s = st.s;
    if (!s) return false;
    if (c.in) return s.cale_curenta === norm(c.in);
    if (c.sel) return (s.selectie || []).indexOf(c.sel) >= 0;
    if (c.cale) return !!(Q.raspuns && verificaCale(st.rasp, Q.raspuns.ok).ok);
    if (c.vazut) return st.vazut.has(norm(c.vazut));
    return false;
  }

  /* „Arată-mi răspunsul”: mergi în folderul cerut (din panoul din stânga, dacă e acolo un nod pe drum, altfel din Acest PC) */
  async function mergiIn(root, cale, stareFn) {
    const tinta = norm(cale);
    if (stareFn().cale_curenta === tinta) return;
    /* cel mai lung început al drumului care are nod în panoul din stânga (ex. Documente/) */
    const noduri = [...root.querySelectorAll('[data-lh-tinta="arbore"][data-e-cale]')].filter(n => tinta.indexOf(n.getAttribute('data-e-cale')) === 0 && /\/$/.test(n.getAttribute('data-e-cale')));
    noduri.sort((a, b) => b.getAttribute('data-e-cale').length - a.getAttribute('data-e-cale').length);
    let prefix = '';
    if (noduri.length) {
      prefix = noduri[0].getAttribute('data-e-cale');
      noduri[0].click();
      for (let t = 0; t < 20 && stareFn().cale_curenta !== prefix; t++) await pauza(50);
      await pauza(150);
      if (stareFn().cale_curenta !== prefix) prefix = '';
    }
    if (!prefix) {
      const pc = root.querySelector('.lh-ap-e-cr0');   /* primul buton al barei de adresă: Acest PC */
      if (pc) { pc.click(); for (let t = 0; t < 20 && stareFn().cale_curenta !== norm('PC'); t++) await pauza(50); await pauza(150); }
    }
    await navigheaza(root, tinta.slice(prefix.length), stareFn, prefix);
  }
  /* pașii exercițiului de față, în cuvinte (din Q.solutie) */
  function pasiText(Q, root) {
    /* drumul cu numele de pe ecran: unitatea cu eticheta ei din panoul din stânga (E: → STICK (E:)) */
    const arata = c => {
      const p = norm(c).replace(/\/$/, '').split('/');
      const n0 = root && root.querySelector(`[data-lh-tinta="arbore"][data-e-cale="${CSS.escape(p[0] + '/')}"]`);
      const et = n0 && n0.textContent.replace(/\s+/g, ' ').trim();
      if (et && et.indexOf(p[0]) >= 0) p[0] = et;
      return esc(p.join(' › '));
    };
    const numeVazut = n => (Q.extensii || !ext(n) ? n : n.slice(0, n.lastIndexOf('.')));
    const unul = ([op, x]) => {
      if (op === 'cd') return 'dublu-clic, pe rând, pe <b>' + arata(x) + '</b>';
      if (op === 'sel') return 'un clic pe <b>' + esc(numeVazut(x)) + '</b>' + (Q.extensii || !ext(x) ? '' : ' (cel cu tipul ' + esc(ext(x).toUpperCase()) + ')');
      if (op === 'vezi') return 'un clic pe partea goală a barei de adresă';
      if (op === 'scrie') return 'în casetă, calea <code>' + esc(x) + '</code>';
      return '';
    };
    return (Q.solutie || []).map(unul).filter(Boolean).map((t, i) => (i + 1) + ') ' + t).join('; ');
  }

  const SimExplorerCitire = {
    render(Q, body, api) {
      css();
      const raspHTML = Q.raspuns ? `<div class="ae-rasp"><label>${esc(Q.raspuns.eticheta || 'Calea')}: <input class="ae-in" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" value="" aria-label="${esc(Q.raspuns.eticheta || 'Calea')}"></label><button type="button" class="btn sm ae-bs" data-bs="1" aria-label="Pune bara inversă \\">Pune \\</button></div><p class="ae-mic">Nu găsești tasta <code>\\</code>? Apasă butonul <b>Pune \\</b>: pune bara acolo unde e cursorul.</p>` : '';
      body.innerHTML = `<p class="ae-cum">În partea din dreapta, un clic pe un folder îl <b>selectează</b>, iar dublu-clic îl <b>deschide</b>. În panoul din stânga, un singur clic te duce acolo. Clic pe partea goală a barei de adresă îți arată <b>calea</b>.</p>
<div class="ae-host"></div>${raspHTML}
<p class="ae-mic">Atelierul e un Explorer mic: aici doar citești și deschizi foldere. Nu muți, nu ștergi și nu deschizi fișiere (asta vine la lecția 10).</p>
<div class="ae-teste"></div>`;
      const host = body.querySelector('.ae-host');
      const st = { s: null, inst: null, vazut: new Set(), rasp: '' };
      const inp = body.querySelector('.ae-in');
      if (inp) {
        inp.addEventListener('input', () => { st.rasp = inp.value; refresh(); });
        inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); const b = document.getElementById('chk'); if (b) b.click(); } });
        body.querySelector('[data-bs]').onclick = () => puneBackslash(inp);
      }

      function refresh() {
        const t = body.querySelector('.ae-teste');
        if (!t) return;
        const r = (Q.checks || []).map(c => testa(Q, st, c));
        t.innerHTML = (Q.checks || []).length ? `<div class="lbl">Testele sarcinii · ${r.filter(Boolean).length} din ${r.length} trec</div><ol>${Q.checks.map((c, i) => `<li class="${r[i] ? 'ok' : ''}"><span>${r[i] ? '✓' : '○'}</span><span>${c.ce}</span></li>`).join('')}</ol>` : '';
      }

      const ascultator = setInterval(() => {
        if (!host.isConnected) { clearInterval(ascultator); return; }
        if (!st.inst) return;
        st.s = st.inst.stare();
        if (st.s && st.s.bara_adresa && st.s.bara_adresa.clicata) st.vazut.add(st.s.cale_curenta);
        refresh();
      }, 150);

      /* start:'PC' = Acest PC (altfel biblioteca pornește în folderul ei Documente/Exercitii); Q.start se ajunge prin clicuri */
      const cont = { start: 'PC', setari: { extensii_vizibile: !!Q.extensii } };
      const doc = documente(Q.fs);
      if (doc) cont.documente = doc;
      L.deschide('explorer', { loc: host, continut: cont, focus: false })
        .then(async inst => {
          st.inst = inst;
          const root = host.querySelector('[data-lh-aplicatie="explorer"]') || host;
          await pauza(200);
          await navigheaza(root, Q.start, () => inst.stare());
          st.s = inst.stare(); st.vazut = new Set();   // pornirea nu e „vizită” a elevului
          refresh();
        })
        .catch(e => { host.textContent = 'Explorer-ul nu s-a putut încărca: ' + e.message; });

      api.checkButton(() => {
        if (st.inst) st.s = st.inst.stare();
        const rez = (Q.checks || []).map(c => testa(Q, st, c)), k = rez.indexOf(false);
        refresh();
        if (k < 0) { api.resolve(true); return; }
        let msg = 'Testul care nu trece încă: ' + Q.checks[k].ce + '.';
        if (Q.checks[k].cale && Q.raspuns) { const v = verificaCale(st.rasp, Q.raspuns.ok); if (!v.ok) msg += ' ' + v.msg; }
        api.resolve(false, msg);
        api.revealButton(() => { arataRaspunsul(); });
      });

      /* „Arată-mi răspunsul”: joacă Q.solutie cu gesturile bibliotecii și citește testele; textul spune „am făcut” doar dacă trec */
      async function joacaSolutia() {
        const inst = st.inst;
        if (!inst || !(Q.solutie || []).length) return { facut: false, incercat: false };
        const root = host.querySelector('[data-lh-aplicatie="explorer"]') || host;
        const stareFn = () => inst.stare();
        try {
          for (const [op, x] of Q.solutie) {
            if (op === 'cd') await mergiIn(root, x, stareFn);
            else if (op === 'sel') {
              const rand = root.querySelector(`.lh-ap-e-rand[data-lh-id="${CSS.escape(x)}"]`);
              if (rand) rand.click();
              await pauza(100);
            } else if (op === 'vezi') {
              const adr = root.querySelector('.lh-ap-e-adr-edit');   /* partea goală a barei de adresă */
              if (adr) adr.click();
              await pauza(100);
              const s = stareFn();
              if (s && s.bara_adresa && s.bara_adresa.clicata) st.vazut.add(s.cale_curenta);
            } else if (op === 'scrie') {
              if (inp) { inp.value = x; st.rasp = x; inp.readOnly = true; }
            } else return { facut: false, incercat: true };
          }
        } catch (e) { return { facut: false, incercat: true }; }
        st.s = stareFn();
        refresh();
        const rez = (Q.checks || []).map(c => testa(Q, st, c));
        return { facut: rez.length > 0 && rez.every(Boolean), incercat: true, n: rez.length };
      }
      let arataPornit = false;
      async function arataRaspunsul() {
        if (arataPornit || api.done()) return;
        arataPornit = true;
        const nav = api.nav && api.nav();
        if (nav) nav.querySelectorAll('button').forEach(b => { b.disabled = true; });
        const rez = await joacaSolutia();
        const pasi = pasiText(Q, host.querySelector('[data-lh-aplicatie="explorer"]'));
        if (rez.facut) {
          api.giveUp(`am făcut eu pașii în Explorer-ul de mai sus: ${pasi}. Uită-te în fereastră: testele de sub ea trec acum (${rez.n} din ${rez.n}).`);
          return;
        }
        if (inp && rez.incercat) inp.readOnly = false;
        const cum = Q.ajutor ? ` Cum: ${Q.ajutor}` : '';
        api.giveUp(`${rez.incercat ? 'n-am reușit să fac pașii în fereastră. Fă-i tu' : 'fă tu pașii'} în Explorer-ul de mai sus${pasi ? ': ' + pasi + '.' : '.'}${cum} Testele de sub fereastră se bifează pe rând, cât lucrezi. Când trec toate:`);
      }
    }
  };

  const TipCale = {
    render(Q, body, api) {
      css();
      body.innerHTML = `<div class="ae-rasp"><label>${esc(Q.eticheta || 'Calea')}: <input class="ae-in" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${esc(Q.eticheta || 'Calea')}"></label><button type="button" class="btn sm ae-bs" data-bs="1" aria-label="Pune bara inversă \\">Pune \\</button></div>
<p class="ae-mic">Nu găsești tasta <code>\\</code>? Apasă butonul <b>Pune \\</b>: pune bara acolo unde e cursorul.</p>`;
      const inp = body.querySelector('.ae-in');
      body.querySelector('[data-bs]').onclick = () => puneBackslash(inp);
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); const b = document.getElementById('chk'); if (b) b.click(); } });
      const nav = api.checkButton(() => {
        const v = verificaCale(inp.value, Q.ok);
        if (v.ok) { inp.readOnly = true; api.resolve(true); return; }
        api.resolve(false, v.msg); inp.focus({ preventScroll: true });
        api.revealButton(() => { inp.value = Q.ok; inp.readOnly = true; nav.innerHTML = ''; api.giveUp(`<code>${esc(Q.ok)}</code>`); });
      });
    }
  };

  window.SimExplorerCitire = SimExplorerCitire;
  window.TipCale = TipCale;
})();
