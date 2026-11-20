/* windows.js — Windows 11 (RO) în biblioteca centrală (api_biblioteca.md §1-§8, CONVENTIE_ARBORE.md §2 „Windows”). Runda 18
   (B-windows). Desktopul, bara de activități (cu zona de notificare și ceasul), meniul Start, meniul de clic dreapta al
   desktopului (nou + clasic, cu submeniul Nou) se desenează din date/windows.json, GENERAT de _unelte/genereaza_windows.py din
   referinte/uia_windows.json — nicio etichetă de interfață scrisă aici. Citirea „fidel” (runde/18/cadru.md, B): configurația
   vine din referință; ce era STARE în captură (ferestrele deschise, ora) vine din starea simulatorului.
   Suprafețele marcate (data-lh-suprafata = cheile din structura_lib.SHELL_SUPRAFETE): bara_activitati, start, meniu_desktop,
   meniu_desktop_clasic; fără referință (simple, [NEVERIFICAT] R18-*): desktop, fereastra, meniu_desktop_nou.
   Starea (§5): ferestre [{aplicatie, titlu, stare: normal|max|min, activa, x, y, w, h}], meniu_start_deschis; în plus
   pictograme_desktop, selectie, redenumire, meniu_deschis. Pozițiile: ca în referință la ecranul ei (1536 px logici), cu
   aceleași reguli de așezare (mijlocul barei centrat, tava lipită la dreapta, Start centrat și lipit de bară). */
(function () {
  'use strict';
  const L = window.LH && window.LH.aplicatii;
  if (!L) return;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const CSS = [
    '.lh-ap-windows{position:relative;width:100%;height:min(100vh,1080px);min-height:360px;overflow:hidden;font:12px "Segoe UI",system-ui,sans-serif;',
    'color:#1b1b1b;background:linear-gradient(135deg,#1f4e8c 0%,#3a7bd5 55%,#7fb2f0 100%);user-select:none;isolation:isolate}',
    '.lh-ap-windows *{box-sizing:border-box}',
    '.lh-w-desk{position:absolute;left:0;top:0;right:0;bottom:48px}',
    '.lh-w-ico{position:absolute;width:76px;height:86px;display:flex;flex-direction:column;align-items:center;gap:4px;padding:4px 2px;',
    'border:1px solid transparent;border-radius:3px;color:#fff;text-align:center;cursor:default}',
    '.lh-w-ico:hover{background:rgba(255,255,255,.15)}.lh-w-ico.lh-w-ales{background:rgba(160,200,255,.35);border-color:rgba(200,225,255,.7)}',
    '.lh-w-ico .lh-w-et{font-size:12px;line-height:15px;text-shadow:0 1px 2px #000;word-break:break-word;max-height:31px;overflow:hidden}',
    '.lh-w-ico input{width:74px;font:12px "Segoe UI",system-ui,sans-serif;text-align:center;border:1px solid #0067c0;padding:1px;color:#000}',
    '.lh-w-forma{width:40px;height:34px;position:relative;flex:none}',
    '.lh-w-forma.f-folder::before{content:"";position:absolute;left:2px;top:4px;width:16px;height:6px;border-radius:2px 2px 0 0;background:#e0a91c}',
    '.lh-w-forma.f-folder::after{content:"";position:absolute;left:2px;top:8px;width:36px;height:24px;border-radius:2px;background:#f8c94a}',
    '.lh-w-forma.f-pc::before{content:"";position:absolute;left:4px;top:3px;width:32px;height:21px;border:3px solid #cfe3ff;border-radius:2px;background:#2b6cc4}',
    '.lh-w-forma.f-pc::after{content:"";position:absolute;left:13px;top:26px;width:14px;height:5px;background:#cfe3ff;border-radius:1px}',
    '.lh-w-forma.f-cos::before{content:"";position:absolute;left:9px;top:8px;width:22px;height:25px;border:2px solid #dfe8f3;border-top:none;border-radius:0 0 4px 4px;background:rgba(255,255,255,.18)}',
    '.lh-w-forma.f-cos::after{content:"";position:absolute;left:6px;top:4px;width:28px;height:4px;background:#dfe8f3;border-radius:2px}',
    '.lh-w-forma.f-fisier::before{content:"";position:absolute;left:8px;top:2px;width:24px;height:30px;background:#fff;border:1px solid #9bb;border-radius:2px}',
    '.lh-w-sel{position:absolute;border:1px solid #3d8ee0;background:rgba(61,142,224,.25);pointer-events:none}',
    '.lh-w-ferestre{position:absolute;left:0;top:0;right:0;bottom:48px;pointer-events:none}',
    '.lh-w-fer{position:absolute;pointer-events:auto;background:#f3f3f3;border:1px solid #9a9a9a;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.35);overflow:hidden;display:flex;flex-direction:column}',
    '.lh-w-fer.lh-w-max{border-radius:0}.lh-w-fer.lh-w-activa{border-color:#5a5a5a}.lh-w-fer:not(.lh-w-activa) .lh-w-titlu{color:#777}',
    '.lh-w-titlu{flex:none;height:32px;display:flex;align-items:center;padding-left:12px;background:#eee}',
    '.lh-w-titlu .lh-w-tt{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.lh-w-tb{width:46px;height:30px;display:flex;align-items:center;justify-content:center;cursor:default}',
    '.lh-w-tb:hover{background:#ddd}.lh-w-tb[data-lh-id="Închidere"]:hover{background:#c42b1c;color:#fff}',
    '.lh-w-corp{flex:1;background:#fff}',
    '.lh-w-bara{position:absolute;left:0;right:0;bottom:0;height:48px;background:rgba(238,242,248,.92);border-top:1px solid rgba(0,0,0,.12);backdrop-filter:blur(20px);z-index:20}',
    '.lh-w-b{position:absolute;top:0;height:48px;display:flex;align-items:center;justify-content:center;gap:6px;border-radius:4px;cursor:default;color:#1b1b1b}',
    '.lh-w-b:hover{background:rgba(255,255,255,.7)}.lh-w-b.lh-w-apasat{background:rgba(255,255,255,.85)}',
    '.lh-w-b .lh-w-ind{position:absolute;bottom:2px;left:50%;width:6px;height:3px;margin-left:-3px;border-radius:2px;background:#8a8a8a}',
    '.lh-w-b.lh-w-activ .lh-w-ind{width:16px;margin-left:-8px;background:#0067c0}',
    '.lh-w-b.lh-w-cautare{height:32px;top:8px;border-radius:16px;background:#fff;border:1px solid #d6d6d6;justify-content:flex-start;padding-left:12px;color:#555}',
    '.lh-w-vreme{display:flex;flex-direction:column;line-height:15px;font-size:12px}.lh-w-vreme span:last-child{color:#555}',
    '.lh-w-ceas{display:flex;flex-direction:column;align-items:flex-end;line-height:16px;font-size:12px;padding-right:6px}',
    '.lh-w-baterie{width:18px;height:10px;border:1.5px solid #333;border-radius:2px;position:relative}.lh-w-baterie::after{content:"";position:absolute;left:1px;top:1px;right:1px;bottom:1px;background:#333}',
    '.lh-w-sigla{width:20px;height:20px;display:grid;grid-template-columns:9px 9px;gap:2px}.lh-w-sigla i{background:#0078d4;border-radius:1px}',
    '.lh-w-start{position:absolute;left:0;top:0;right:0;bottom:48px;z-index:15}',
    '.lh-w-panou{position:absolute;background:rgba(243,243,243,.97);border:1px solid rgba(0,0,0,.15);border-radius:8px;box-shadow:0 12px 32px rgba(0,0,0,.35);overflow:hidden}',
    '.lh-w-p{position:absolute;display:flex;align-items:center;cursor:default}',
    '.lh-w-p:hover{background:rgba(0,0,0,.05)}',
    '.lh-w-antet{font-weight:600;font-size:14px;cursor:default}.lh-w-antet:hover{background:none}',
    '.lh-w-zona-apps{position:absolute;overflow-y:auto;overflow-x:hidden}',
    '.lh-w-dala{flex-direction:column;justify-content:flex-start;padding-top:12px;gap:6px;border-radius:4px;text-align:center}',
    '.lh-w-dala .lh-w-et{font-size:12px;line-height:15px;max-height:30px;overflow:hidden;word-break:break-word;padding:0 4px}',
    '.lh-w-ico32{width:32px;height:32px;border-radius:6px;background:#dbe6f4;display:flex;align-items:center;justify-content:center;color:#0067c0;flex:none}',
    '.lh-w-cautare-st{border-radius:16px;background:#fff;border:1px solid #c8c8c8;padding-left:12px;gap:8px;color:#555}',
    /* runda 22 (W2): categoria din „Toate” = grila 2×2 de butoane 68×68 (uia_windows.json › start_toate: Chrome [521,668],
       Explorer [589,668], Excel [521,736] față de categoria [510,658] → 11 px stânga, 10 px sus), numele jos [DEDUS] R22-3 */
    '.lh-w-categ{flex-wrap:wrap;align-content:flex-start;align-items:flex-start;padding:10px 0 0 11px;border-radius:8px;background:rgba(0,0,0,.04)}',
    '.lh-w-p.lh-w-cbtn{position:relative;width:68px;height:68px;justify-content:center;border-radius:6px}',
    '.lh-w-cmai{width:68px;height:68px;display:grid;grid-template-columns:14px 14px;gap:4px;align-content:center;justify-content:center}.lh-w-cmai i{width:14px;height:14px;border-radius:3px;background:#c9d6e8}',
    '.lh-w-categ-et{position:absolute;left:4px;right:4px;bottom:12px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;pointer-events:none}',
    '.lh-w-categ-et::after{content:attr(data-et)}',   /* numele accesibil rămâne cel întreg din UIA (data-lh-eticheta); pe ecran doar partea dinaintea lui „ categorie” */
    '.lh-ap-windows .lh-w-p:focus{outline:2px solid #1b1b1b;outline-offset:-2px}',
    /* runda 22 (W3): căutarea din Start — textul scris în casetă, rezultatele = listă simplă [NEVERIFICAT] R22-1 */
    '.lh-w-caret{display:inline-block;width:1px;height:16px;background:#1b1b1b;vertical-align:middle;animation:lhWClip 1s steps(1) infinite}',
    '@keyframes lhWClip{50%{opacity:0}}',
    '.lh-w-cautare-st .lh-w-tx-caut{color:#1b1b1b}.lh-w-cautare-st .lh-w-indiciu-caut{color:#777}',
    '.lh-w-p.lh-w-rez{height:40px;padding:0 12px;gap:10px;border-radius:4px}.lh-w-p.lh-w-rez-ales{background:rgba(0,103,192,.12)}',
    /* runda 22 (W4): numele la trecerea mouse-ului peste un buton din bară [NEVERIFICAT] R22-4 */
    '.lh-w-indiciu{position:absolute;z-index:45;background:#f9f9f9;border:1px solid rgba(0,0,0,.18);border-radius:4px;padding:4px 8px;box-shadow:0 2px 6px rgba(0,0,0,.2);pointer-events:none;white-space:nowrap;color:#1b1b1b}',
    /* runda 22 (W5): pe ecranul tactil, glisarea barei de titlu și a pictogramelor e gestul aplicației, nu derularea paginii */
    '.lh-w-titlu,.lh-w-ico{touch-action:none}',
    '.lh-w-nav{border-top:1px solid rgba(0,0,0,.08);background:rgba(0,0,0,.03)}',
    '.lh-w-meniu{position:absolute;z-index:30}',
    '.lh-w-fond{position:absolute;background:#f9f9f9;border:1px solid rgba(0,0,0,.18);box-shadow:0 8px 16px rgba(0,0,0,.25)}',
    '.lh-w-meniu.m-nou .lh-w-fond{border-radius:8px}.lh-w-meniu.m-clasic .lh-w-fond{border-radius:0;background:#f2f2f2}',
    '.lh-w-r{position:absolute;display:block;line-height:32px;padding-left:44px;white-space:nowrap;border-radius:4px;cursor:default}',
    '.m-clasic .lh-w-r{line-height:24px;padding-left:30px;border-radius:0}',
    '.lh-w-r:hover:not(.lh-ap-gri){background:rgba(0,0,0,.06)}.lh-w-r .lh-w-ic{position:absolute;left:12px;top:50%;margin-top:-8px}',
    '.lh-w-r .lh-w-et{display:inline-block;min-width:170px}.lh-w-r .lh-w-sc{color:#666}',
    '.lh-w-r .lh-w-sag{position:absolute;right:10px;top:50%;margin-top:-6px}',
    '.lh-w-linie{position:absolute;height:1px;background:rgba(0,0,0,.12)}',
    '.lh-ap-windows .lh-ap-gri{color:#9a9a9a}',
    '.lh-ap-windows .lh-ap-mesaj{position:absolute;left:50%;bottom:60px;transform:translateX(-50%);max-width:90%;z-index:40;background:#fff8c4;border:1px solid #d6c56a;padding:6px 10px;border-radius:4px;color:#222}',
    /* I1: telefon / tabletă (lățimea rădăcinii sub 600 px): bara se derulează lateral, Start ocupă lățimea, dalele curg */
    '.lh-w-ingust .lh-w-b[data-lh-id-mso="WidgetsButton"]{display:none}',
    '.lh-w-ingust .lh-w-b.lh-w-cautare{width:44px!important;padding:0;justify-content:center;border:none;background:none}',
    '.lh-w-ingust .lh-w-b.lh-w-cautare .lh-w-tx{display:none}',
    '.lh-w-ingust .lh-w-b.lh-w-in-plus{display:none}',
    '.lh-w-ingust .lh-w-mijloc{overflow-x:auto;overflow-y:hidden;scrollbar-width:none}',
    '.lh-w-ingust .lh-w-panou .lh-w-p,.lh-w-ingust .lh-w-panou .lh-w-zona-apps{position:relative!important;left:auto!important;top:auto!important}',
    '.lh-w-ingust .lh-w-panou{display:flex;flex-direction:column;padding:8px;gap:8px}',
    '.lh-w-ingust .lh-w-zona-apps{flex:1;display:flex;flex-wrap:wrap;align-content:flex-start;gap:4px;width:auto!important;height:auto!important}',
    '.lh-w-ingust .lh-w-zona-apps .lh-w-antet{flex-basis:100%}',
    '.lh-w-ingust .lh-w-panou .lh-w-p{min-height:32px;max-width:100%}',
    '.lh-w-ingust .lh-w-nav{flex:none;width:auto!important}',
    '.lh-w-ingust .lh-w-r{min-height:32px}',
    '.lh-w-ingust .lh-w-bara > .lh-w-b:not([data-lh-id^="Afișați desktopul"]){min-width:32px!important}'
  ].join('');
  function stil() {
    if (document.querySelector('style[data-lh-windows-css]')) return;
    const s = document.createElement('style');
    s.setAttribute('data-lh-windows-css', '');
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function creeaza(I, c) {
    stil();
    const root = I.root, D = I.date, scenariu = !!I.opt.scenariu;
    const B = D.bara_activitati, S = D.start, REF_W = D.ecran_ref.w, REF_H = D.ecran_ref.h, BH = B.rect[3];
    const ico = (k, m) => {
      const p = D.icoane && D.icoane[k];
      return p ? '<svg class="lh-w-ic" aria-hidden="true" width="' + (m || 16) + '" height="' + (m || 16) +
        '" viewBox="0 0 20 20" fill="currentColor" focusable="false">' + p.map(d => '<path d="' + esc(d) + '"/>').join('') + '</svg>' : '';
    };
    const sageata = '<svg class="lh-w-sag" aria-hidden="true" width="12" height="12" viewBox="0 0 12 12"><path d="M4 2l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>';
    const sigla = '<span class="lh-w-sigla" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';
    /* runda 22 (W4): Explorer = „dosarul galben” din lecții. Setul Fluent al proiectului n-are dosarul: formă simplă proprie (I7),
       aceeași ca în explorer.js (FORME.dosar); forma reală nu e în UI Automation: [NEVERIFICAT] R22-4 */
    const DOSAR = '<svg aria-hidden="true" width="24" height="24" viewBox="0 0 20 20" focusable="false"><path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h4L9 5.5h7.5A1.5 1.5 0 0 1 18 7v7.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 2 14.5z" fill="#f2c55c" stroke="#c9952a" stroke-width=".8"/></svg>';
    const icoApp = (a, m) => a === 'explorer' ? DOSAR : ico(a === 'word' || a === 'powerpoint' ? 'document' : a === 'excel' ? 'lista' : a === 'paint' ? 'personalizare' : a === 'calculator' ? 'grila' : 'straturi', m || 22);

    /* ---------------- modelul */
    const M = { ferestre: [], start: false, meniu: null, pict: [], selectie: [], redenumire: null, z: 1 };
    const pozImplicita = k => ({ x: 8, y: 8 + k * 92 });
    (D.desktop.pictograme || []).concat(c.pictograme || []).forEach((p, k) => {
      const q = typeof p === 'string' ? { nume: p, fel: 'folder' } : p;
      M.pict.push({ nume: q.nume, fel: q.fel || 'folder', sistem: !!(q.fel === 'pc' || q.fel === 'cos'), ...pozImplicita(k) });
    });
    (c.ferestre || []).forEach(f => M.ferestre.push(normFer(f)));
    if (M.ferestre.length && !M.ferestre.some(f => f.activa && f.stare !== 'min')) {
      const v = M.ferestre.filter(f => f.stare !== 'min').pop();
      if (v) v.activa = true;
    }
    M.start = !!c.meniu_start_deschis;
    function normFer(f) {
      return { aplicatie: String(f.aplicatie || 'explorer'), titlu: String(f.titlu || ''), stare: ['normal', 'max', 'min'].indexOf(f.stare) >= 0 ? f.stare : 'normal',
        activa: !!f.activa, x: +f.x || 80, y: +f.y || 60, w: +f.w || 640, h: +f.h || 420, z: M.z++ };
    }
    I.stare = () => ({
      ferestre: M.ferestre.map(f => ({ aplicatie: f.aplicatie, titlu: f.titlu, stare: f.stare, activa: !!f.activa && f.stare !== 'min', x: f.x, y: f.y, w: f.w, h: f.h })),
      meniu_start_deschis: !!M.start,
      pictograme_desktop: M.pict.map(p => p.nume),
      selectie: M.selectie.slice(),
      redenumire: M.redenumire,
      meniu_deschis: M.meniu ? (M.meniu.sub ? 'meniu_desktop_nou' : M.meniu.fel) : null
    });

    /* ---------------- scheletul */
    root.innerHTML = '<div class="lh-w-desk" data-lh-zona data-lh-suprafata="desktop" data-lh-tip="Pane" data-lh-eticheta="Desktop"></div>' +
      '<div class="lh-w-ferestre"></div><div class="lh-w-bara" data-lh-suprafata="bara_activitati" data-lh-tip="Pane" data-lh-eticheta="Bară de activități"></div>';
    const desk = root.querySelector('.lh-w-desk'), stratF = root.querySelector('.lh-w-ferestre'), bara = root.querySelector('.lh-w-bara');
    let W = 1366, H = 768;
    /* runda 22 (W4): numele aplicației când ții mouse-ul pe un buton din mijlocul barei (lecția v/m2-l08: „Ții săgeata pe una și
       îi vezi numele”). Textul = numele din referință fără sufixul șabloanelor („Explorer fixat” → „Explorer”); aspectul și
       întârzierea nu sunt capturate: [NEVERIFICAT] R22-4. Doar mouse-ul (pe telefon nu există „trecerea”). */
    let indEl = null, tInd = null;
    const sabRe = s => new RegExp('^' + s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace('\\{x\\}', '(.+)').replace('\\{n\\}', '\\d+') + '$');
    const SAB = ['fixat', 'deschisa_1', 'deschise_n'].map(k => D.sabloane && D.sabloane[k]).filter(Boolean).map(sabRe);
    const numeScurt = s => { s = String(s || '').split('\n')[0]; for (const r of SAB) { const m = r.exec(s); if (m) return m[1]; } return s; };
    const ascundeInd = () => { clearTimeout(tInd); tInd = null; if (indEl) { indEl.remove(); indEl = null; } };
    function arataInd(b) {
      ascundeInd();
      if (!b.isConnected || M.start || M.meniu) return;            // cu Start sau un meniu deschis, indiciul nu apare
      indEl = document.createElement('div');
      indEl.className = 'lh-w-indiciu';
      indEl.setAttribute('role', 'tooltip');
      indEl.textContent = numeScurt(b.getAttribute('data-lh-eticheta') || b.getAttribute('aria-label'));
      root.appendChild(indEl);
      const rb = b.getBoundingClientRect(), rr = root.getBoundingClientRect();
      indEl.style.left = Math.round(Math.max(4, Math.min(rb.left - rr.left + rb.width / 2 - indEl.offsetWidth / 2, W - indEl.offsetWidth - 4))) + 'px';
      indEl.style.bottom = (BH + 8) + 'px';
    }
    bara.addEventListener('pointerover', e => {
      if (e.pointerType !== 'mouse') return;
      const b = e.target.closest && e.target.closest('.lh-w-b[data-lh-app]');
      if (!b || (e.relatedTarget && b.contains(e.relatedTarget))) return;
      ascundeInd();
      tInd = setTimeout(() => arataInd(b), 500);
    });
    bara.addEventListener('pointerout', e => { const b = e.target.closest && e.target.closest('.lh-w-b'); if (b && e.relatedTarget && b.contains(e.relatedTarget)) return; ascundeInd(); });
    bara.addEventListener('pointerdown', ascundeInd);
    const masoara = () => { const r = root.getBoundingClientRect(); W = Math.round(r.width) || 1366; H = Math.round(r.height) || 768; root.classList.toggle('lh-w-ingust', W < 600); };

    /* ---------------- desktopul (windows.desktop: fără referință, R18-5) */
    function deseneazaDesktop() {
      desk.innerHTML = M.pict.map(p => {
        const ales = M.selectie.indexOf(p.nume) >= 0, red = M.redenumire === p.nume;
        return '<div class="lh-w-ico' + (ales ? ' lh-w-ales' : '') + '" data-lh-tip="ListItem" data-lh-tinta="desktop" data-lh-id="' + esc(p.nume) +
          '"' + (red ? '' : ' data-lh-eticheta="' + esc(p.nume) + '"') + (ales ? ' data-lh-selectat' : '') + ' style="left:' + p.x + 'px;top:' + p.y + 'px">' +
          '<span class="lh-w-forma f-' + esc(p.fel) + '" aria-hidden="true"></span>' +
          (red ? '<input data-lh-tinta="camp" data-lh-id="redenumire" data-lh-tip="Edit" data-lh-eticheta="Nume" value="' + esc(p.nume) + '">' : '<span class="lh-w-et">' + esc(p.nume) + '</span>') + '</div>';
      }).join('');
      if (M.redenumire) {
        const inp = desk.querySelector('input');
        if (inp) {
          setTimeout(() => { try { inp.focus({ preventScroll: true }); inp.select(); } catch (e) { /* */ } }, 0);
          inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); } });
          inp.addEventListener('blur', () => { if (M.redenumire && inp.isConnected) termina(inp.value, false); });
        }
      }
    }
    function termina(val, anuleaza) {
      const p = M.pict.find(q => q.nume === M.redenumire);
      M.redenumire = null;
      if (p && !anuleaza) {
        const v = String(val || '').trim();
        if (v && !/[\\/:*?"<>|]/.test(v) && !M.pict.some(q => q !== p && q.nume.toLowerCase() === v.toLowerCase())) {
          M.selectie = M.selectie.map(n => n === p.nume ? v : n);
          p.nume = v;
        }
      }
      deseneazaDesktop();
      return p ? (anuleaza ? 'anulare_redenumire' : 'redenumire') : 'fara_efect';
    }
    function folderNou() {
      const nume = D.folder_nou.nume[0] || 'Folder nou';
      let n = nume, k = 2;
      while (M.pict.some(q => q.nume.toLowerCase() === n.toLowerCase())) n = nume + ' (' + (k++) + ')';
      const loc = M.meniu ? { x: Math.max(0, M.meniu.x - 30), y: Math.max(0, M.meniu.y - 20) } : pozImplicita(M.pict.length);
      M.pict.push({ nume: n, fel: 'folder', sistem: false, x: loc.x, y: loc.y });
      M.selectie = [n];
      M.redenumire = n;
      inchideMeniu();
      deseneazaDesktop();
      return 'folder_nou';
    }

    /* ---------------- ferestrele (windows.fereastra: fără referință, R18-4; butoanele din explorer_fereastra) */
    function deseneazaFerestre() {
      const zona = { w: W, h: H - BH };
      stratF.innerHTML = M.ferestre.filter(f => f.stare !== 'min').sort((a, b) => a.z - b.z).map(f => {
        /* I1 (runda 22, W5): pe ecranul îngust fereastra încape toată (x + l ≤ lățimea), ca Minimizare / Maximizare / Închidere să
           rămână pe ecran; pe PC rămâne regula de până acum (fereastra poate ieși parțial, ca în Windows) */
        const fw = Math.min(f.w, zona.w), fh = Math.min(f.h, zona.h), ing = W < 600;
        const g = f.stare === 'max' ? { x: 0, y: 0, w: zona.w, h: zona.h } : ing ? { x: Math.max(0, Math.min(f.x, zona.w - fw)), y: Math.max(0, Math.min(f.y, zona.h - fh)), w: fw, h: fh } :
          { x: Math.min(f.x, Math.max(0, zona.w - 120)), y: Math.min(f.y, Math.max(0, zona.h - 40)), w: fw, h: fh };
        const bt = D.fereastra.butoane.map(b => {
          const nume = b.nume === 'Maximizare' && f.stare === 'max' ? 'Maximizare' : b.nume;
          const gl = b.nume === 'Minimizare' ? '<path d="M5 10h10" stroke="currentColor"/>' : b.nume === 'Maximizare' ? '<rect x="5.5" y="5.5" width="9" height="9" fill="none" stroke="currentColor"/>' : '<path d="M5 5l10 10M15 5L5 15" stroke="currentColor"/>';
          return '<span class="lh-w-tb" data-lh-tip="Button" data-lh-tinta="bara_titlu" data-lh-id="' + esc(nume) + '" data-lh-eticheta="' + esc(nume) +
            '" role="button"><svg aria-hidden="true" width="12" height="12" viewBox="0 0 20 20">' + gl + '</svg></span>';
        }).join('');
        return '<div class="lh-w-fer' + (f.activa ? ' lh-w-activa' : '') + (f.stare === 'max' ? ' lh-w-max' : '') + '" data-lh-suprafata="fereastra" data-lh-tip="Window" data-lh-tinta="fereastra_app" data-lh-id="' +
          esc(f.aplicatie) + '" data-lh-eticheta="' + esc(f.titlu) + '" data-lh-fer="' + M.ferestre.indexOf(f) + '" style="left:' + g.x + 'px;top:' + g.y + 'px;width:' + g.w + 'px;height:' + g.h + 'px;z-index:' + f.z + '">' +
          '<div class="lh-w-titlu" data-lh-tip="TitleBar" data-lh-eticheta="' + esc(f.titlu) + '"><span class="lh-w-tt">' + esc(f.titlu) + '</span>' + bt + '</div><div class="lh-w-corp"></div></div>';
      }).join('');
    }
    const ferDin = el => { const x = el && el.closest && el.closest('[data-lh-fer]'); return x ? M.ferestre[+x.getAttribute('data-lh-fer')] : null; };
    function activeaza(f) { M.ferestre.forEach(x => { x.activa = x === f; }); if (f) { f.z = ++M.z; if (f.stare === 'min') f.stare = f.max ? 'max' : 'normal'; } }
    function minimizeaza(f) { f.max = f.stare === 'max'; f.stare = 'min'; f.activa = false; const v = M.ferestre.filter(x => x.stare !== 'min').sort((a, b) => b.z - a.z)[0]; if (v) v.activa = true; }

    /* ---------------- bara de activități (uia_windows.json › bara_activitati) */
    const numeApp = a => (D.aplicatii[a] && D.aplicatii[a].nume) || a;
    function butoaneDeschise() {
      /* un buton pe aplicație (gruparea implicită a barei); fixatul aceleiași aplicații își schimbă numele */
      const grup = [];
      M.ferestre.forEach(f => { let g = grup.find(x => x.aplicatie === f.aplicatie); if (!g) grup.push(g = { aplicatie: f.aplicatie, f: [] }); g.f.push(f); });
      return grup;
    }
    function etichetaDeschisa(app, n) {
      const s = D.sabloane;
      return (n === 1 ? s.deschisa_1 : s.deschise_n).replace('{x}', numeApp(app)).replace('{n}', n);
    }
    function ceasText() {
      const d = new Date(), p = x => String(x).padStart(2, '0');
      return { ora: p(d.getHours()) + ':' + p(d.getMinutes()), data: p(d.getDate()) + '.' + p(d.getMonth() + 1) + '.' + d.getFullYear(),
        nume: D.ceas.format.replace('{hh}', p(d.getHours())).replace('{mm}', p(d.getMinutes())).replace('{zz}', p(d.getDate())).replace('{ll}', p(d.getMonth() + 1)).replace('{aaaa}', d.getFullYear()) };
    }
    const ICO_TAVA = n => /^Volum/.test(n) ? ico('difuzor') : /^Rețea/.test(n) ? ico('web') : /^Pornit\/Oprit|baterie/i.test(n) ? '<span class="lh-w-baterie" aria-hidden="true"></span>' :
      /^Afișați pictogramele/.test(n) ? '<svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12"><path d="M2 8l4-4 4 4" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>' :
      /^Obțineți/.test(n) ? ico('sparkle') : /^Confidențialitate/.test(n) ? ico('pornire') : /^Indicator/.test(n) ? ico('lista') : /^Afișați desktopul/.test(n) ? '' : ico('straturi');
    function butonBara(n, x, extra) {
      const nume = extra && extra.nume || n.nume;
      const tx = extra && extra.html || '';
      /* AutomationId doar unde e unic (SystemTrayIcon / NotifyItemIcon se repetă: structura_lib.canon_shell nu le păstrează) */
      const id = n.id && !/^(SystemTrayIcon|NotifyItemIcon)$/.test(n.id) ? ' data-lh-id-mso="' + esc(n.id) + '"' : '';
      const cls = 'lh-w-b' + (extra && extra.cls ? ' ' + extra.cls : '');
      const dec = extra && extra.faraEticheta ? ' aria-label="' + esc(nume) + '"' : ' data-lh-eticheta="' + esc(nume) + '"';
      const r = n.rect;
      return '<div class="' + cls + '" role="button" data-lh-tip="Button" data-lh-tinta="bara_activitati" data-lh-id="' + esc(extra && extra.tinta || nume) + '"' + id + dec +
        ' style="left:' + x + 'px;width:' + r[2] + 'px' + (r[1] ? ';top:' + r[1] + 'px;height:' + r[3] + 'px' : '') + '">' + tx + '</div>';
    }
    function deseneazaBara() {
      const h = [];
      /* stânga: Widgeturi (textul de pe ecran = copiii Text ai butonului din referință; numele întreg doar în aria-label) */
      B.stanga.forEach(n => h.push(butonBara(n, n.rect[0], { faraEticheta: true, html: ico('sparkle', 24) + '<span class="lh-w-vreme">' + (n.text || []).map(t => '<span>' + esc(t) + '</span>').join('') + '</span>' })));
      /* mijlocul: Start, Căutare, Vizualizare activități, fixatele; apoi aplicațiile deschise care nu sunt fixate */
      const grup = butoaneDeschise();
      const mij = [];
      B.centru.forEach(n => {
        let ex = {};
        if (n.id === 'StartButton') ex = { html: sigla, apasat: M.start };
        else if (n.id === 'SearchButton') ex = { html: ico('cautare') + '<span class="lh-w-tx">' + esc((n.text || [n.nume])[0]) + '</span>', cls: 'lh-w-cautare' };
        else if (n.id === 'TaskViewButton') ex = { html: ico('fereastra', 20) };
        else if (n.fixat) {
          const app = Object.keys(D.aplicatii).find(a => D.aplicatii[a].id && D.aplicatii[a].id === n.id);
          const g = app && grup.find(x => x.aplicatie === app);
          ex = { html: /Explorer/.test(n.nume) ? DOSAR : ico(/Chrome/.test(n.nume) ? 'web' : /Notepad/.test(n.nume) ? 'notepad' : 'lista', 22) };
          if (g) { ex.nume = etichetaDeschisa(app, g.f.length); ex.html += '<span class="lh-w-ind" aria-hidden="true"></span>'; ex.activ = g.f.some(f => f.activa && f.stare !== 'min'); ex.app = app; }
        }
        mij.push({ n, ex });
      });
      grup.filter(g => !B.centru.some(n => n.fixat && D.aplicatii[g.aplicatie] && D.aplicatii[g.aplicatie].id === n.id)).forEach(g => {
        mij.push({ n: { nume: etichetaDeschisa(g.aplicatie, g.f.length), id: (D.aplicatii[g.aplicatie] || {}).id || null, rect: [0, 0, 44, 48] },
          ex: { html: icoApp(g.aplicatie) + '<span class="lh-w-ind" aria-hidden="true"></span>', activ: g.f.some(f => f.activa && f.stare !== 'min'), app: g.aplicatie } });
      });
      /* așezarea: pașii dintre butoane ca în referință; grupul centrat ca în referință (decalajul ei față de centru) */
      const x0 = B.centru[0].rect[0];
      const ref = B.centru.concat(B.deschise_ref);
      const lastRef = ref[ref.length - 1];
      const decal = x0 - (REF_W - (lastRef.rect[0] + lastRef.rect[2] - x0)) / 2;
      let x = 0;
      const ingust = W < 600;
      /* I1 (runda 22, W5): pe ecranul îngust butoanele stau unul după altul, după lățimea DESENATĂ (Căutare = 44 px, CSS
         .lh-w-ingust), nu după pașii referinței (unde Căutare are 219 px și lasă un gol de ~178 px) */
      const latDes = m => ingust && m.n.id === 'SearchButton' ? 44 : m.n.rect[2];
      const pos = mij.map((m, k) => {
        const px = ingust ? x : k === 0 ? 0 : (m.n.rect && k < B.centru.length ? m.n.rect[0] - x0 : x);
        x = px + latDes(m);
        return px;
      });
      /* pe ecranul îngust Start stă fix la stânga, în afara benzii derulabile (altfel derularea spre aplicația activă îl scoate
         din vedere); banda începe după el */
      const ofs = ingust && mij.length && mij[0].n.id === 'StartButton' ? latDes(mij[0]) : 0;
      const gw = x - ofs;
      const st = Math.round((W - gw) / 2 + decal);
      mij.forEach((m, k) => {
        const cls = [m.ex.cls, m.ex.activ ? 'lh-w-activ' : '', m.ex.apasat ? 'lh-w-apasat' : ''].filter(Boolean).join(' ');
        h.push(butonBara(m.n, ingust ? (k === 0 && ofs ? 0 : pos[k] - ofs) : st + pos[k], { html: m.ex.html, nume: m.ex.nume, cls, tinta: m.n.id === 'StartButton' ? 'Start' : null }).replace('class="lh-w-b', 'data-lh-app="' + esc(m.ex.app || '') + '" class="lh-w-b'));
      });
      /* tava: lipită la dreapta, cu pașii din referință */
      const ct = ceasText();
      B.tava.forEach(n => {
        const xr = W - (REF_W - n.rect[0]);
        let ex = { html: ICO_TAVA(n.nume), faraEticheta: false };
        if (/^Ceas /.test(n.nume)) ex = { html: '<span class="lh-w-ceas" aria-hidden="false"><span>' + ct.ora + '</span><span>' + ct.data + '</span></span>', nume: ct.nume };
        if (!/^(Afișați pictogramele|Rețea|Volum|Pornit|Ceas|Afișați desktopul)/.test(n.nume)) ex.cls = 'lh-w-in-plus';
        h.push(butonBara(n, xr, ex));
      });
      if (ingust) {
        /* I1: mijlocul într-un rând care se derulează lateral, între margine și tavă */
        const eStart = s => ofs && /data-lh-id="Start"/.test(s);
        const mijHtml = h.filter(s => /data-lh-app=/.test(s) && !eStart(s)).join('');
        const rest = h.filter(s => !/data-lh-app=/.test(s) || eStart(s));
        bara.innerHTML = rest.join('') + '<div class="lh-w-mijloc" style="position:absolute;left:' + ofs + 'px;top:0;height:48px"><div class="lh-w-mijloc-in" style="position:relative;height:48px">' + mijHtml + '</div></div>';
        /* tava îngustă: doar butoanele de sistem, lipite la dreapta în ordinea lor */
        let xr = W;
        [...bara.querySelectorAll(':scope > .lh-w-b:not([data-lh-app])')].reverse().forEach(b => { if (getComputedStyle(b).display === 'none') return; xr -= b.offsetWidth; b.style.left = xr + 'px'; });
        /* runda 22 (W5): banda = de la margine până la tava DESENATĂ (nu lățimea tăvii din referință, 382 px); aplicația activă
           (sau, fără una activă, ultima cu ferestre) e adusă în vedere */
        const lat = Math.max(120, xr - 4 - ofs);
        const mj = bara.querySelector('.lh-w-mijloc'), mi = mj.firstChild;
        mj.style.width = lat + 'px';
        mi.style.width = Math.max(gw, lat) + 'px';
        mi.style.marginLeft = Math.max(0, Math.round((lat - gw) / 2)) + 'px';
        const vede = mi.querySelector('.lh-w-activ') || [...mi.querySelectorAll('.lh-w-b')].filter(b => b.querySelector('.lh-w-ind')).pop();
        if (vede && gw > lat) mj.scrollLeft = Math.max(0, vede.offsetLeft - Math.round((lat - vede.offsetWidth) / 2));
      } else bara.innerHTML = h.join('');
    }

    /* ---------------- meniul Start (uia_windows.json › start) */
    let startEl = null;
    /* runda 22 (W3): căutarea din Start. Sursa comportamentului: support.microsoft.com „Use a screen reader to explore and
       navigate the Start menu in Windows”, „Search (Windows 11)”: la deschidere focusul e în „Search box”; „The list of search
       results is updated as you type”; „Use the Up or Down arrow key to browse through the search results”; „press Enter to
       select it”. Lista candidaților = numele aplicațiilor din referință (dale, categoriile din „Toate”, fixatele barei) +
       date/windows.json › aplicatii; panoul cu rezultate nu e capturat: listă simplă [NEVERIFICAT] R22-1. */
    const CASETA = (S.noduri.find(n => n.rol === 'cautare') || {}).nume || 'Căutare';
    const FARA_POTRIVIRE = 'căutarea în documente și pe web';
    const fara = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    const CAND = (() => {
      const v = [], vaz = new Set();
      const pune = (nume, app) => { nume = String(nume || '').split(', ')[0].trim(); if (!nume || vaz.has(nume)) return; vaz.add(nume); v.push({ nume, app: app || null }); };
      Object.keys(D.aplicatii).forEach(a => pune(D.aplicatii[a].nume, a));
      S.noduri.forEach(n => {
        if (n.rol === 'fixat' && !n.ascuns && !/Folder cu elemente/.test(n.nume)) pune(n.nume);
        if (n.rol === 'categorie') (n.butoane || []).forEach(b => pune(b.nume));
      });
      B.centru.filter(n => n.fixat).forEach(n => pune(n.nume.replace(/ fixat$/, '')));
      return v;
    })();
    function cautaRez() {
      const q = fara(M.caut || '').trim();
      if (!q) return [];
      return CAND.filter(c => fara(c.nume).indexOf(q) === 0).concat(CAND.filter(c => fara(c.nume).indexOf(q) !== 0 && fara(c.nume).split(/[\s\-+]+/).some(w => w.indexOf(q) === 0)));
    }
    function pornire(nume) {
      const app = Object.keys(D.aplicatii).find(a => D.aplicatii[a].nume === nume);
      if (!app || !D.aplicatii[app].fereastra_generica) return I.nesimulat(nume);
      /* Paint, Calculator: fereastra generică (R18-4) cu titlul aplicației și butonul ei în bară; conținutul nu e simulat
         (mesajul central). Fereastra există deja → o aduce în față. [NEVERIFICAT] R22-2 */
      let f = M.ferestre.find(x => x.aplicatie === app);
      if (!f) { const k = M.ferestre.length; f = normFer({ aplicatie: app, titlu: nume, x: 80 + 32 * k, y: 40 + 32 * k }); M.ferestre.push(f); }
      activeaza(f);
      M.start = false; M.caut = null; M.rezSel = 0;
      deseneazaFerestre(); deseneazaStart(); deseneazaBara();
      I.nesimulat(nume);
      return 'pornire_aplicatie';
    }
    function deseneazaStart() {
      if (startEl) {
        if (startEl.contains(document.activeElement)) try { root.focus({ preventScroll: true }); } catch (e) { /* */ }   // tastele rămân la aplicație
        startEl.remove(); startEl = null;
      }
      if (!M.start) return;
      const Ha = H - BH, P = S.panou, ingust = W < 600;
      const pw = ingust ? W - 16 : P[2], top = Math.max(6, Ha - (S.rect[3] - P[1]));
      const ph = Ha - top, left = ingust ? 8 : Math.round((W - P[2]) / 2);
      const rel = r => [r[0] - P[0], r[1] - P[1]];
      const jos = r => r[1] >= P[1] + P[3] - 80;                               // lipite de marginea de jos a panoului
      const zonaRef = [P[0] + 79, P[1] + 76, 640, P[3] - 154];                 // AppsList (uia: [447,142,640,596])
      const p = [];
      const nod = (n, cls, html, extra) => {
        const r = n.rect;
        const st = r ? (jos(r) ? 'left:' + rel(r)[0] + 'px;top:' + (ph - (S.rect[3] - r[1])) + 'px;' : 'left:' + rel(r)[0] + 'px;top:' + rel(r)[1] + 'px;') + 'width:' + r[2] + 'px;height:' + r[3] + 'px' : '';
        const t = extra && extra.tinta || 'start';
        return '<div class="lh-w-p ' + (cls || '') + '" role="button" data-lh-tip="' + esc(n.tip) + '" data-lh-tinta="' + t + '" data-lh-id="' + esc(n.nume) + '"' +
          (n.id ? ' data-lh-id-mso="' + esc(n.id) + '"' : '') + (extra && extra.faraEticheta ? ' aria-label="' + esc(n.nume) + '"' : ' data-lh-eticheta="' + esc(n.nume) + '"') + ' style="' + st + '">' + (html || '') + '</div>';
      };
      const inZona = (n, cls, html, extra) => {
        const r = n.rect;
        const st = 'left:' + (r[0] - zonaRef[0]) + 'px;top:' + (r[1] - zonaRef[1]) + 'px;width:' + r[2] + 'px;height:' + r[3] + 'px';
        return nod(Object.assign({}, n, { rect: null }), cls, html, extra).replace('style=""', 'style="' + st + '"');
      };
      const z = [], pj = [];                                               // pj = bara de jos (contul, Alimentare): după dale, ca în referință
      S.noduri.forEach(n => {
        if (n.in_afara_ecranului || (!n.rect && n.rol !== 'cont')) return;
        if (n.rol === 'cautare') p.push(nod(n, 'lh-w-cautare-st', ico('cautare') + (M.caut ? '<span class="lh-w-tx-caut">' + esc(M.caut) + '</span><span class="lh-w-caret" aria-hidden="true"></span>' :
          M.caut === '' ? '<span class="lh-w-caret" aria-hidden="true"></span><span class="lh-w-indiciu-caut">' + esc(n.nume) + '</span>' : '<span>' + esc(n.nume) + '</span>')));
        else if (n.rol === 'antet') z.push('<div class="lh-w-p lh-w-antet" data-lh-tip="Group" data-lh-eticheta="' + esc(n.nume) + '" style="left:' + (n.rect[0] - zonaRef[0]) + 'px;top:' + (n.rect[1] - zonaRef[1]) + 'px;height:' + n.rect[3] + 'px">' + esc(n.nume) + '</div>');
        else if (n.rol === 'mai_putine') z.push(inZona(n, '', '<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(n.nume) + '</span>'));
        else if (n.rol === 'vizualizare') z.push(inZona(n, '', '<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(n.nume) + '</span>', { tinta: 'meniu_derulant' }));
        else if (n.rol === 'fixat') z.push(inZona(n, 'lh-w-dala', '<span class="lh-w-ico32" aria-hidden="true">' + (n.ascuns ? '' : ico(/Folder cu elemente/.test(n.nume) ? 'straturi' : /Setări/.test(n.nume) ? 'setari' : /Ceas/.test(n.nume) ? 'pornire' : 'lista', 20)) + '</span>' +
          (n.ascuns ? '' : '<span class="lh-w-et">' + esc(n.nume) + '</span>'), n.ascuns ? { faraEticheta: true } : null));
        else if (n.rol === 'recomandat') z.push(inZona(n, '', '<span class="lh-w-ico32" aria-hidden="true">' + ico('document', 20) + '</span><span style="padding-left:8px">' + esc(n.nume) + '</span>'));
        else if (n.rol === 'categorie') {
          /* runda 22 (W2): cele 7 categorii din start_toate, cu butoanele 68×68 ale aplicațiilor (ținte `start:<nume>`, clic =
             mesajul central) și locul al 4-lea = celelalte aplicații (desen, fără țintă); numele categoriei jos [DEDUS] R22-3 */
          const bt = (n.butoane || []).map(b => '<div class="lh-w-p lh-w-cbtn" role="button" data-lh-tip="Button" data-lh-tinta="start" data-lh-id="' + esc(b.nume) +
            '" data-lh-eticheta="' + esc(b.nume) + '"><span class="lh-w-ico32" aria-hidden="true">' + (/^Explorer/.test(b.nume) ? DOSAR : ico('lista', 20)) + '</span></div>').join('') +
            '<span class="lh-w-cmai" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="lh-w-categ-et" aria-hidden="true" data-et="' + esc(n.eticheta || '') + '"></span>';
          z.push(inZona(n, 'lh-w-categ', bt, { faraEticheta: false }).replace(/data-lh-eticheta="([^"]*)"/, 'data-lh-eticheta="$1" aria-label="$1"'));
        }
        else if (n.rol === 'nav_lista') pj.push('<div class="lh-w-p lh-w-nav" data-lh-tip="List" data-lh-eticheta="' + esc(n.nume) + '" style="left:0;top:' + (ph - (S.rect[3] - n.rect[1]) - 10) + 'px;width:' + pw + 'px;height:' + (S.rect[3] - n.rect[1] + 10) + 'px;cursor:default"></div>');
        else if (n.rol === 'cont') pj.push('<div class="lh-w-p" role="button" data-lh-tip="ListItem" data-lh-tinta="start" data-lh-id="[utilizator]" data-lh-eticheta="[utilizator]" style="left:' + (S.noduri.find(x => x.rol === 'nav_lista').rect[0] - P[0]) + 'px;top:' + (ph - 66) + 'px;height:40px;gap:8px;padding:0 8px"><span class="lh-w-ico32" aria-hidden="true" style="border-radius:50%"></span><span>[utilizator]</span></div>');
        else if (n.rol === 'alimentare') pj.push(nod(n, '', ico('pornire', 16), { faraEticheta: false }).replace('data-lh-eticheta', 'aria-label="' + esc(n.nume) + '" data-lh-eticheta'));
      });
      /* conținutul derulabil: dalele etc. Celelalte (căutarea, bara de jos) stau fixe */
      let zh = z;
      if (M.caut) {
        /* runda 22 (W3): cu text în casetă, lista derulabilă arată rezultatele (Sus / Jos aleg, Enter / clic pornește) */
        const rz = cautaRez();
        if (M.rezSel >= rz.length) M.rezSel = 0;
        zh = rz.map((a, k) => '<div class="lh-w-p lh-w-rez' + (k === M.rezSel ? ' lh-w-rez-ales' : '') + '" role="option" data-lh-tip="ListItem" data-lh-tinta="start" data-lh-id="' + esc(a.nume) +
          '" data-lh-eticheta="' + esc(a.nume) + '" data-lh-rezultat="' + k + '"' + (k === M.rezSel ? ' aria-selected="true"' : '') + ' style="left:0;right:0;top:' + (k * 44) + 'px">' +
          (a.app ? icoApp(a.app, 20) : ico('lista', 20)) + '<span>' + esc(a.nume) + '</span></div>');
      } else if (S.toate) zh = z.concat('<div aria-hidden="true" style="position:absolute;left:0;width:1px;height:1px;top:' + (S.toate.jos - zonaRef[1] - 1) + 'px"></div>');   // capătul listei derulate (start_toate)
      p.push('<div class="lh-w-zona-apps" style="left:' + (zonaRef[0] - P[0]) + 'px;top:' + (zonaRef[1] - P[1]) + 'px;width:' + zonaRef[2] + 'px;height:' + Math.max(80, ph - 154) + 'px">' + zh.join('') + '</div>');
      p.push.apply(p, pj);
      startEl = document.createElement('div');
      startEl.className = 'lh-w-start';
      startEl.setAttribute('data-lh-suprafata', 'start');
      startEl.setAttribute('data-lh-tip', 'Window');
      startEl.setAttribute('data-lh-eticheta', 'Meniul Start');
      startEl.setAttribute('data-lh-tinta', 'start_fundal');
      startEl.innerHTML = '<div class="lh-w-panou" data-lh-tinta="start" style="left:' + left + 'px;top:' + top + 'px;width:' + pw + 'px;height:' + ph + 'px">' + p.join('') + '</div>';
      root.appendChild(startEl);
      startEl.querySelectorAll('.lh-w-zona-apps [data-lh-tinta]').forEach(x => { x.tabIndex = -1; });   // focusul tastaturii (W2)
    }
    /* runda 22 (W2): tastatura în Start. Sursa: aceeași pagină Microsoft, „Navigate to Pinned and All apps”: „press the Tab key
       until you hear "Pinned," followed by the name of the first pinned app. Then use the arrow keys to navigate the apps, and
       press Enter to open the selected app”; nota: „To navigate the options in the Start menu's grid view, use the arrow keys”.
       Tab: caseta → prima dală fixată (și înapoi la casetă); săgețile: cel mai apropiat element în direcția apăsată; lista
       derulează după focus. Ordinea completă a lui Tab (Recomandate, Toate, contul, Alimentare) nu e capturată: R22-5. */
    function zonaStart() { return startEl && startEl.querySelector('.lh-w-zona-apps'); }
    function mutaFocus(k) {
      const z = zonaStart(), el = document.activeElement;
      if (!z || !z.contains(el)) return 'fara_efect';
      const dir = { ArrowDown: [0, 1], ArrowUp: [0, -1], ArrowRight: [1, 0], ArrowLeft: [-1, 0] }[k];
      if (!dir) return null;
      const c = el.getBoundingClientRect(), cx = c.left + c.width / 2, cy = c.top + c.height / 2;
      let best = null, bs = Infinity;
      z.querySelectorAll('[data-lh-tinta]').forEach(x => {
        if (x === el || x.classList.contains('lh-w-categ') || !L._vizibil(x)) return;
        const b = x.getBoundingClientRect(), dx = b.left + b.width / 2 - cx, dy = b.top + b.height / 2 - cy;
        const ax = dir[0] ? dx * dir[0] : dy * dir[1], lat = dir[0] ? Math.abs(dy) : Math.abs(dx);
        if (ax <= 4 || (dir[0] && lat > c.height / 2)) return;
        const s = ax + 2 * lat;
        if (s < bs) { bs = s; best = x; }
      });
      if (!best) return 'fara_efect';
      try { best.focus({ preventScroll: true }); } catch (e) { /* */ }
      best.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      return 'focus';
    }
    function tastaStart(e, g) {
      const z = zonaStart(), inGrila = !!(z && z.contains(document.activeElement));
      const ct = 'start:' + CASETA;
      if (g === 'tastare' && e.key && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        M.caut = (M.caut || '') + e.key; M.rezSel = 0;
        deseneazaStart();
        I.tintaTasta = ct;
        return cautaRez().length || !M.caut.trim() ? 'cautare' : I.nesimulat(FARA_POTRIVIRE);
      }
      if (g === 'tasta_backspace' && M.caut != null && !inGrila) {
        e.preventDefault();
        M.caut = M.caut.slice(0, -1); M.rezSel = 0;
        deseneazaStart();
        I.tintaTasta = ct;
        return 'cautare';
      }
      if (M.caut && !inGrila) {
        const rz = cautaRez();
        I.tintaTasta = ct;
        if (g === 'sageti' && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
          e.preventDefault();
          if (!rz.length) return 'fara_efect';
          M.rezSel = (M.rezSel + (e.key === 'ArrowUp' ? rz.length - 1 : 1)) % rz.length;
          deseneazaStart();
          return 'alegere_rezultat';
        }
        if (g === 'tasta_enter') { e.preventDefault(); return rz.length ? pornire(rz[M.rezSel].nume) : I.nesimulat(FARA_POTRIVIRE); }
        return null;
      }
      if (g === 'tasta_tab') {
        e.preventDefault();
        if (inGrila || e.shiftKey) { try { root.focus({ preventScroll: true }); } catch (x) { /* */ } I.tintaTasta = ct; return 'focus'; }
        const prima = z && z.querySelector('.lh-w-dala');
        if (!prima) return 'fara_efect';
        try { prima.focus({ preventScroll: true }); } catch (x) { /* */ }
        prima.scrollIntoView({ block: 'nearest' });
        return 'focus';
      }
      if (inGrila && g === 'sageti') { e.preventDefault(); return mutaFocus(e.key); }
      if (inGrila && g === 'tasta_enter') {
        e.preventDefault();
        const el = document.activeElement;
        return I.la.clic(L._canon(el), { target: el, clientX: NaN, clientY: NaN, shiftKey: false, ctrlKey: false, metaKey: false, preventDefault() {} }, 1, 'clic');
      }
      return null;
    }

    /* ---------------- meniurile desktopului (uia_windows.json › meniu_desktop / meniu_desktop_clasic; Nou: R18-2) */
    let meniuEl = null, subEl = null;
    const ICO_MENIU = { view: 'vizualizare', arrange: 'sortare', refresh: 'reimprospatare', undo: 'anulare', New: 'nou', Display: 'afisare', Personalize: 'personalizare', expandtoclassic: 'lista' };
    function randuri(def, fel) {
      const rs = def.randuri;
      let h = '';
      rs.forEach((r, k) => {
        const [x, y, w, hh] = r.rect;
        if (k > 0) { const pr = rs[k - 1].rect; if (y - (pr[1] + pr[3]) >= 5) h += '<div class="lh-w-linie" aria-hidden="true" style="left:' + (x + 4) + 'px;width:' + (w - 8) + 'px;top:' + Math.round((pr[1] + pr[3] + y) / 2) + 'px"></div>'; }
        const sub = r.extins === false;
        const ic = fel === 'nou' ? ico(ICO_MENIU[r.id] || (r.nume === 'Dropbox' ? 'straturi' : r.nume === 'Deschideți în Terminal' ? 'terminal' : ''), 16) : (fel === 'meniu_nou' ? ico(/^Folder$/.test(r.nume) ? 'straturi' : /Comandă rapidă/.test(r.nume) ? 'link' : 'document', 16) : '');
        const sc = r.scurtatura ? ' <span class="lh-w-sc">' + esc(r.scurtatura) + '</span>' : '';
        h += '<div class="lh-w-r' + (r.dezactivat ? ' lh-ap-gri' : '') + '" role="menuitem" data-lh-tip="MenuItem" data-lh-tinta="meniu" data-lh-id="' + esc(r.nume) + '" data-lh-eticheta="' + esc(r.nume) + '"' +
          (r.id ? ' data-lh-id-mso="' + esc(r.id) + '"' : '') + (r.dezactivat ? ' aria-disabled="true"' : '') + (sub ? ' aria-haspopup="true"' : '') +
          ' style="left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;height:' + hh + 'px;line-height:' + hh + 'px">' + ic + '<span class="lh-w-et">' + esc(r.nume) + '</span>' + sc + (sub ? sageata : '') + '</div>';
      });
      return h;
    }
    function deseneazaMeniu() {
      if (meniuEl) { meniuEl.remove(); meniuEl = null; }
      if (subEl) { subEl.remove(); subEl = null; }
      if (!M.meniu) return;
      const fel = M.meniu.fel, def = fel === 'meniu_desktop_clasic' ? D.meniu_desktop_clasic : D.meniu_desktop;
      const [, , mw, mh] = def.rect, Ha = H - BH;
      const x = Math.max(0, Math.min(M.meniu.x, W - mw)), y = Math.max(0, Math.min(M.meniu.y, Ha - mh));
      M.meniu.x = x; M.meniu.y = y;
      meniuEl = document.createElement('div');
      meniuEl.className = 'lh-w-meniu ' + (fel === 'meniu_desktop_clasic' ? 'm-clasic' : 'm-nou');
      meniuEl.setAttribute('data-lh-suprafata', fel);
      meniuEl.setAttribute('data-lh-tip', 'Menu');
      meniuEl.setAttribute('role', 'menu');
      meniuEl.style.cssText = 'left:' + x + 'px;top:' + y + 'px;width:' + mw + 'px;height:' + mh + 'px';
      /* runda 22 (W1): fondul meniului nou = marginile rândurilor (uia_windows.json › meniu_desktop › ferestre[0]: rândurile
         [17,6,270,32] … [17,330,270,32] în fereastra 304×385) + 9 px lateral / 5 px sus-jos (cât lăsa fondul vechi în jurul lor) */
      const rs = def.randuri.map(r => r.rect);
      const fx = Math.min(...rs.map(r => r[0])) - 9, fy = Math.min(...rs.map(r => r[1])) - 5;
      const fw = Math.max(...rs.map(r => r[0] + r[2])) + 9 - fx, fh = Math.max(...rs.map(r => r[1] + r[3])) + 5 - fy;
      meniuEl.innerHTML = '<div class="lh-w-fond" aria-hidden="true" style="' + (fel === 'meniu_desktop_clasic' ? 'left:0;top:0;right:0;bottom:0' : 'left:' + fx + 'px;top:' + fy + 'px;width:' + fw + 'px;height:' + fh + 'px;border-radius:8px') + '"></div>' +
        randuri(def, fel === 'meniu_desktop_clasic' ? 'clasic' : 'nou');
      root.appendChild(meniuEl);
      if (M.meniu.sub) {
        const N = D.meniu_nou, [, , sw, sh] = N.rect;
        const rN = def.randuri.find(r => r.nume === 'Nou');
        let sx = x + (rN ? rN.rect[0] + rN.rect[2] : mw) - 4, sy = y + (rN ? rN.rect[1] : 0) - 7;
        if (sx + sw > W) sx = Math.max(0, x - sw + 8);
        sy = Math.max(0, Math.min(sy, Ha - sh));
        subEl = document.createElement('div');
        subEl.className = 'lh-w-meniu m-nou';
        subEl.setAttribute('data-lh-suprafata', 'meniu_desktop_nou');
        subEl.setAttribute('data-lh-tip', 'Menu');
        subEl.setAttribute('role', 'menu');
        subEl.style.cssText = 'left:' + sx + 'px;top:' + sy + 'px;width:' + sw + 'px;height:' + Math.min(sh, Ha) + 'px;overflow-y:auto';
        subEl.innerHTML = '<div class="lh-w-fond" aria-hidden="true" style="left:10px;top:2px;width:' + (sw - 20) + 'px;height:' + (sh - 18) + 'px;border-radius:8px"></div>' + randuri(N, 'meniu_nou');
        root.appendChild(subEl);
      }
    }
    function deschideMeniu(fel, x, y) { M.start = false; M.meniu = { fel, x, y, sub: false }; deseneazaStart(); deseneazaMeniu(); deseneazaBara(); }
    function inchideMeniu() { if (!M.meniu) return false; M.meniu = null; deseneazaMeniu(); return true; }

    function deseneaza() { masoara(); deseneazaDesktop(); deseneazaFerestre(); deseneazaBara(); deseneazaStart(); deseneazaMeniu(); }
    function seteazaStart(v) { M.start = v; M.caut = null; M.rezSel = 0; if (v) inchideMeniu(); deseneazaStart(); deseneazaBara(); return v ? 'deschide_start' : 'inchide_start'; }

    /* ---------------- gesturile (aplicatii.js emite evenimentele; aici doar ce face aplicația) */
    const pct = (e) => { const r = root.getBoundingClientRect(); return { x: Math.round(e.clientX - r.left), y: Math.round(e.clientY - r.top) }; };
    const eticheta = t => (t || '').slice(t.indexOf(':') + 1);
    function clicMeniu(nume, el) {
      if (el && el.getAttribute('aria-disabled') === 'true') return 'fara_efect';
      if (nume === 'Nou' && el && el.closest('[data-lh-suprafata="meniu_desktop"],[data-lh-suprafata="meniu_desktop_clasic"]')) { M.meniu.sub = !M.meniu.sub; deseneazaMeniu(); return M.meniu.sub ? 'deschide_submeniu' : 'inchide_submeniu'; }
      if (nume === 'Afișați mai multe opțiuni') { const m = M.meniu; M.meniu = { fel: 'meniu_desktop_clasic', x: m.x + 10, y: m.y + 1, sub: false }; deseneazaMeniu(); return 'meniu_clasic'; }
      if (nume === 'Folder' && el && el.closest('[data-lh-suprafata="meniu_desktop_nou"]')) return folderNou();
      if (nume === 'Reîmprospătare') { inchideMeniu(); deseneazaDesktop(); return 'reimprospatare'; }
      if (el && el.getAttribute('aria-haspopup') === 'true') return I.nesimulat(nume);   // Vizualizare / Sortați după / Dropbox: submeniuri necapturate
      inchideMeniu();
      return I.nesimulat(nume);
    }
    I.la = {
      clic(t, ev, n, g) {
        const el = ev && ev.target;
        const fel = (t || '').split(':')[0];
        if (M.redenumire && !(el && el.closest && el.closest('input'))) termina((desk.querySelector('input') || {}).value, false);
        if (fel === 'meniu') return clicMeniu(eticheta(t), el && el.closest('[data-lh-tinta="meniu"]'));
        if (M.meniu && fel !== 'meniu') inchideMeniu();
        if (t === 'bara_activitati:Start') return seteazaStart(!M.start);
        if (fel === 'bara_activitati') {
          const b = el && el.closest('[data-lh-tinta="bara_activitati"]');
          const app = b && b.getAttribute('data-lh-app');
          if (M.start) seteazaStart(false);
          if (app) {
            const fs = M.ferestre.filter(f => f.aplicatie === app);
            if (!fs.length) return I.nesimulat(eticheta(t));
            const f = fs.sort((a, b2) => b2.z - a.z)[0];
            let a;
            if (f.stare === 'min') { activeaza(f); a = 'restaurare'; } else if (f.activa) { minimizeaza(f); a = 'minimizare'; } else { activeaza(f); a = 'activare'; }
            deseneazaFerestre(); deseneazaBara();
            return a;
          }
          if (/^Afișați desktopul/.test(eticheta(t))) { M.ferestre.forEach(f => { if (f.stare !== 'min') minimizeaza(f); }); deseneazaFerestre(); deseneazaBara(); return 'afiseaza_desktop'; }
          return I.nesimulat(eticheta(t).split('\n')[0]);
        }
        if (fel === 'start_fundal') return seteazaStart(false);
        if (t === 'start') return 'fara_efect';                          // clic pe fondul panoului Start: nu se închide
        if (fel === 'start' && el && el.closest && el.closest('[data-lh-rezultat]')) return pornire(eticheta(t));   // W3: rezultatul căutării
        if (t === 'start:' + CASETA) { if (M.caut == null) M.caut = ''; deseneazaStart(); return 'focus_cautare'; }   // W3: caseta primește textul
        if (fel === 'start' || fel === 'meniu_derulant') return I.nesimulat(eticheta(t));
        if (M.start) seteazaStart(false);
        if (fel === 'bara_titlu') {
          const f = ferDin(el);
          if (!f) return 'fara_efect';
          const nume = eticheta(t);
          if (nume === 'Minimizare') minimizeaza(f);
          else if (nume === 'Maximizare') { f.stare = f.stare === 'max' ? 'normal' : 'max'; activeaza(f); }
          else if (nume === 'Închidere') { M.ferestre.splice(M.ferestre.indexOf(f), 1); const v = M.ferestre.filter(x => x.stare !== 'min').sort((a, b2) => b2.z - a.z)[0]; if (v) activeaza(v); }
          deseneazaFerestre(); deseneazaBara();
          return nume === 'Minimizare' ? 'minimizare' : nume === 'Închidere' ? 'inchidere_fereastra' : 'maximizare';
        }
        if (fel === 'fereastra_app' && el && el.closest('[data-lh-fer]')) { const f = ferDin(el); if (f && !f.activa) { activeaza(f); deseneazaFerestre(); deseneazaBara(); return 'activare'; } return 'fara_efect'; }
        if (fel === 'desktop') {
          const nume = eticheta(t);
          if (g === 'ctrl_clic') { const i = M.selectie.indexOf(nume); if (i >= 0) M.selectie.splice(i, 1); else M.selectie.push(nume); } else M.selectie = [nume];
          deseneazaDesktop();
          return 'selectare';
        }
        if (el && desk.contains(el)) { const a = M.selectie.length ? 'deselectare' : 'fara_efect'; M.selectie = []; deseneazaDesktop(); return a; }
        return null;
      },
      dublu(t) {
        const fel = (t || '').split(':')[0];
        if (fel === 'desktop') return I.nesimulat(eticheta(t));        // deschiderea în Explorer vine la integrarea cu banda Explorer (R18-7)
        if (fel === 'bara_titlu' || (fel === 'fereastra_app' && t !== 'fereastra_app:windows')) return null;
        return null;
      },
      dreapta(t, e) {
        const el = e && e.target;
        if (M.redenumire) termina((desk.querySelector('input') || {}).value, false);
        if (el && bara.contains(el)) { if (M.start) seteazaStart(false); inchideMeniu(); return I.nesimulat(bara.getAttribute('data-lh-eticheta')); }
        if (startEl && startEl.contains(el)) return I.nesimulat(eticheta(t) || 'Meniul Start');
        if ((meniuEl && meniuEl.contains(el)) || (subEl && subEl.contains(el))) return 'fara_efect';
        if (el && stratF.contains(el)) return 'fara_efect';
        if (el && desk.contains(el)) {
          const p = pct(e);
          if ((t || '').indexOf('desktop:') === 0) { M.selectie = [eticheta(t)]; deseneazaDesktop(); inchideMeniu(); return I.nesimulat(eticheta(t)); }
          M.selectie = [];
          deseneazaDesktop();
          deschideMeniu(e.shiftKey ? 'meniu_desktop_clasic' : 'meniu_desktop', p.x, p.y);
          return e.shiftKey ? 'meniu_clasic' : 'meniu_contextual';
        }
        return 'fara_efect';
      },
      tasta(e, g, inCamp) {
        if (inCamp && M.redenumire) {
          if (g === 'tasta_enter') { const v = e.target.value; return termina(v, false); }
          if (g === 'tasta_esc') { e.preventDefault(); return termina(null, true); }
          return null;
        }
        if (M.start && !inCamp) { const r = tastaStart(e, g); if (r) return r; }   // runda 22: W3 (căutarea), W2 (Tab, săgețile)
        if (g === 'tasta_windows') { e.preventDefault(); return seteazaStart(!M.start); }
        if (g === 'tasta_esc') {
          if (M.meniu && M.meniu.sub) { M.meniu.sub = false; deseneazaMeniu(); return 'inchide_submeniu'; }
          if (inchideMeniu()) return 'inchide_meniu';
          if (M.start) return seteazaStart(false);
          return 'fara_efect';
        }
        if (g === 'tasta_f2') {
          if (M.selectie.length === 1) { M.redenumire = M.selectie[0]; deseneazaDesktop(); return 'redenumire_incepe'; }
          return 'fara_efect';
        }
        if (g === 'tasta_delete') {
          const de = M.pict.filter(p => M.selectie.indexOf(p.nume) >= 0 && !p.sistem);
          if (!de.length) return 'fara_efect';
          M.pict = M.pict.filter(p => de.indexOf(p) < 0);
          M.selectie = [];
          deseneazaDesktop();
          return 'mutare_in_cos';
        }
        if (g === 'tasta_enter' && M.selectie.length) return I.nesimulat(M.selectie[0]);
        return null;
      },
      /* tragerea: pe o pictogramă = mutare; pe desktopul gol = dreptunghiul de selecție; pe bara de titlu = mutarea ferestrei */
      jos(e) {
        const el = e.target;
        if (el.closest && el.closest('input')) return null;
        const ic = el.closest && el.closest('.lh-w-ico');
        if (ic && desk.contains(ic)) { I._tr = { fel: 'ico', nume: ic.getAttribute('data-lh-id'), el: ic, x0: e.clientX, y0: e.clientY }; return 'tragere'; }
        const tb = el.closest && el.closest('.lh-w-titlu');
        if (tb && !el.closest('.lh-w-tb')) { const f = ferDin(tb); if (f && f.stare === 'normal') { I._tr = { fel: 'fer', f, x0: e.clientX, y0: e.clientY, fx: f.x, fy: f.y }; return 'tragere'; } }
        if (el === desk) { const p = pct(e); I._tr = { fel: 'sel', p0: p }; return 'selectie'; }
        I._tr = null;
        return null;
      },
      misca(e) {
        const T = I._tr;
        if (!T) return;
        if (T.fel === 'ico') { T.el.style.transform = 'translate(' + (e.clientX - T.x0) + 'px,' + (e.clientY - T.y0) + 'px)'; }
        else if (T.fel === 'fer') { const fe = stratF.querySelector('[data-lh-fer="' + M.ferestre.indexOf(T.f) + '"]'); if (fe) fe.style.transform = 'translate(' + (e.clientX - T.x0) + 'px,' + (e.clientY - T.y0) + 'px)'; }
        else if (T.fel === 'sel') {
          const p = pct(e);
          if (!T.box) { T.box = document.createElement('div'); T.box.className = 'lh-w-sel'; T.box.setAttribute('aria-hidden', 'true'); desk.appendChild(T.box); }
          const x = Math.min(p.x, T.p0.x), y = Math.min(p.y, T.p0.y);
          T.box.style.cssText = 'left:' + x + 'px;top:' + y + 'px;width:' + Math.abs(p.x - T.p0.x) + 'px;height:' + Math.abs(p.y - T.p0.y) + 'px';
          T.r = [x, y, Math.abs(p.x - T.p0.x), Math.abs(p.y - T.p0.y)];
        }
      },
      sus(e, j, g) {
        const T = I._tr;
        I._tr = null;
        if (!g || !T) { if (T && T.box) T.box.remove(); if (T && T.el) T.el.style.transform = ''; return null; }
        if (T.fel === 'ico') {
          const p = M.pict.find(q => q.nume === T.nume);
          if (p) { p.x = Math.max(0, p.x + Math.round(e.clientX - T.x0)); p.y = Math.max(0, p.y + Math.round(e.clientY - T.y0)); M.selectie = [p.nume]; }
          deseneazaDesktop();
          return 'mutare_pictograma';
        }
        if (T.fel === 'fer') { T.f.x += Math.round(e.clientX - T.x0); T.f.y = Math.max(0, T.f.y + Math.round(e.clientY - T.y0)); activeaza(T.f); deseneazaFerestre(); deseneazaBara(); return 'mutare_fereastra'; }
        if (T.fel === 'sel') {
          const r = T.r || [0, 0, 0, 0];
          if (T.box) T.box.remove();
          M.selectie = M.pict.filter(p => p.x < r[0] + r[2] && p.x + 76 > r[0] && p.y < r[1] + r[3] && p.y + 86 > r[1]).map(p => p.nume);
          deseneazaDesktop();
          return 'selectie_dreptunghi';
        }
        return null;
      }
    };
    I.focus = () => { try { root.focus({ preventScroll: true }); } catch (e) { /* */ } };

    /* plasa oracolelor (CONVENTIE_ARBORE.md §4.6) — doar pentru ce nu se vede la pornire */
    I.deschideSuprafata = cheie => {
      masoara();
      if (cheie === 'start') { seteazaStart(true); return true; }
      if (cheie === 'meniu_desktop' || cheie === 'meniu_desktop_clasic' || cheie === 'meniu_desktop_nou') {
        deschideMeniu(cheie === 'meniu_desktop_clasic' ? 'meniu_desktop_clasic' : 'meniu_desktop', Math.round(W * 0.35), 40);
        if (cheie === 'meniu_desktop_nou') { M.meniu.sub = true; deseneazaMeniu(); }
        return true;
      }
      return cheie === 'bara_activitati' || cheie === 'desktop';
    };
    let ceas = null;
    if (!scenariu) ceas = setInterval(() => { if (!root.isConnected) { clearInterval(ceas); return; } deseneazaBara(); }, 30000);
    I.distruge = () => { if (ceas) clearInterval(ceas); if (I._ro) try { I._ro.disconnect(); } catch (e) { /* */ } };
    if (typeof ResizeObserver === 'function') {
      let lw = 0, lh = 0;
      I._ro = new ResizeObserver(() => { if (!root.isConnected) return; const r = root.getBoundingClientRect(); if (Math.round(r.width) !== lw || Math.round(r.height) !== lh) { lw = Math.round(r.width); lh = Math.round(r.height); deseneaza(); } });
      I._ro.observe(root);
    }
    deseneaza();
  }

  L._modul('windows', {
    creeaza,
    /* O5 › meniu_derulant (§4.4): lista „Vizualizare selectată, Categorie” stă în Start — Start se deschide întâi */
    demonstratie: { meniu_derulant: { pregatire: ['bara_activitati:Start'] } }
  });
})();
