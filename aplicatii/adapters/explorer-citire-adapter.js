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
   Limite față de simulatorul vechi (spuse și în cod): „Arată-mi răspunsul” nu mută Explorer-ul în starea finală; spune pașii
   (Q.solutieText) și apoi testele trec doar când elevul face gesturile. */
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
  async function navigheaza(root, cale, stareFn) {
    if (!cale || cale === 'PC') return;
    const parti = cale.replace(/\/$/, '').split('/');
    for (let i = 0; i < parti.length; i++) {
      const tinta = parti.slice(0, i + 1).join('/') + '/';
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
        api.revealButton(() => { api.giveUp(Q.solutieText || 'uită-te în Explorer și la testele de sub el: acum trec toate.'); });
      });
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
