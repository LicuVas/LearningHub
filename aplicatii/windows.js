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
    /* runda 30 (aspect, găsit pe drum): z-index:1 = stratul ferestrelor e un context de stivuire propriu; fără el, după ~15 activări
       z-index-ul ferestrei (M.z++) trecea de Start (15) și de bară (20), iar Start se deschidea SUB ferestre (probe/z_stiva.py) */
    '.lh-w-ferestre{position:absolute;left:0;top:0;right:0;bottom:48px;pointer-events:none;z-index:1}',
    '.lh-w-fer{position:absolute;pointer-events:auto;background:#f3f3f3;border:1px solid #9a9a9a;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.35);overflow:hidden;display:flex;flex-direction:column}',
    '.lh-w-fer.lh-w-max{border-radius:0}.lh-w-fer.lh-w-activa{border-color:#5a5a5a}.lh-w-fer:not(.lh-w-activa) .lh-w-titlu{color:#777}',
    '.lh-w-titlu{flex:none;height:32px;display:flex;align-items:center;padding-left:12px;background:#eee}',
    '.lh-w-titlu .lh-w-tt{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.lh-w-tb{width:46px;height:30px;display:flex;align-items:center;justify-content:center;cursor:default}',
    '.lh-w-tb:hover{background:#ddd}.lh-w-tb[data-lh-id="Închidere"]:hover{background:#c42b1c;color:#fff}',
    '.lh-w-corp{flex:1;background:#fff;position:relative;min-height:0;overflow:hidden}',   /* runda 30 (W4): corpul găzduiește Explorer-ul montat */
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
    '.lh-ap-compune .lh-w-caut-in{z-index:16}.lh-ap-compune .lh-w-indiciu-caut{visibility:hidden}',
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
    /* runda 30 (W4): „parcarea” Explorer-ului montat cât fereastra lui e minimizată sau cât se rescrie stratul ferestrelor */
    const parcare = document.createElement('div');
    parcare.className = 'lh-w-parcare';
    parcare.setAttribute('aria-hidden', 'true');
    parcare.style.display = 'none';
    root.appendChild(parcare);
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
      /* runda 30 (critic 26, N1): câmpul cu focus iese din pagină la redesenare, iar focusul cădea pe <body> (F2 / Delete / tasta Windows
         nu mai emiteau nimic). Focusul revine pe rădăcină ÎNAINTE de redesenare, ca la deseneazaStart; blur-ul câmpului vede deja
         M.redenumire = null, deci nu mai cheamă termina a doua oară. Pictograma rămâne selectată (M.selectie neatinsă). */
      if (desk.contains(document.activeElement)) try { root.focus({ preventScroll: true }); } catch (e) { /* */ }
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
      /* runda 30 (aspect; MINOR S3 al criticului 26: maximizarea ieșea 1 px în dreapta și 2 px sub bară): zona ferestrelor = interiorul
         rădăcinii (fără chenarul de 1 px al lui .lh-ap), adică exact stratul în care stau ferestrele și deasupra căruia stă bara */
      const zona = { w: root.clientWidth || W, h: (root.clientHeight || H) - BH };
      /* runda 30 (W4, A22-1): fereastra cu Explorer-ul bibliotecii montat. Rădăcina lui iese din strat ÎNAINTE de rescriere (în
         „parcare”, care rămâne în pagină: o rădăcină scoasă din pagină e închisă de bibliotecă la prima citire), apoi intră în corpul
         nou, în aceeași funcție (api §1). Instanța închisă din afară (LH.aplicatii.inchide) își pierde fereastra. */
      M.ferestre = M.ferestre.filter(f => !(f.mont && f.mont.api && !f.mont.api.radacina.isConnected));
      let cuFocus = null;
      M.ferestre.forEach(f => {
        if (!f.mont || !f.mont.api) return;
        const r = f.mont.api.radacina;
        if (r.contains(document.activeElement)) cuFocus = f;
        if (r.parentElement !== parcare) parcare.appendChild(r);
      });
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
      M.ferestre.forEach(f => {
        if (!f.mont || !f.mont.api || f.stare === 'min') return;
        const c = corpul(f);
        if (c) c.appendChild(f.mont.api.radacina);
      });
      /* focusul: mutarea în DOM îl pierde. Fereastra montată activă îl primește înapoi (și când tocmai a fost activată / readusă:
         M.focusMont, ca în Windows, unde fereastra activată primește tastele); altfel focusul din ea revine pe rădăcina shell-ului */
      const fm = M.focusMont || cuFocus;
      M.focusMont = null;
      if (fm && fm.mont && fm.mont.api && fm.activa && fm.stare !== 'min' && M.ferestre.indexOf(fm) >= 0 && !M.start) fm.mont.api.focus();
      else if (cuFocus) try { root.focus({ preventScroll: true }); } catch (e) { /* */ }
    }
    const corpul = f => { const x = stratF.querySelector('[data-lh-fer="' + M.ferestre.indexOf(f) + '"]'); return x && x.querySelector('.lh-w-corp'); };
    const ferDin = el => { const x = el && el.closest && el.closest('[data-lh-fer]'); return x ? M.ferestre[+x.getAttribute('data-lh-fer')] : null; };
    function activeaza(f) { M.ferestre.forEach(x => { x.activa = x === f; }); if (f) { f.z = ++M.z; if (f.stare === 'min') f.stare = f.max ? 'max' : 'normal'; if (f.mont) M.focusMont = f; } }
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
    /* runda 26 (critic 22, K3): caseta din Start primește textul printr-un câmp ADEVĂRAT, ca I.intrare la Word / Excel / PowerPoint:
       pe telefon atingerea pe casetă îl focalizează (apare tastatura ecranului), iar textul ei („input”, compunerea) ajunge în
       căutare prin I.la.text; la fel textul venit fără keydown pe PC (IME, dictare). Stă în afara lui startEl (care se redesenează
       la fiecare literă: un câmp scos din pagină își pierde focusul și tastatura se închide), peste casetă, invizibil (clasa comună
       lh-ap-intrare). data-lh-intrare-document: tastele lui merg tot pe drumul de până acum (tastaStart, ținta = caseta). */
    const cautIn = document.createElement('input');
    cautIn.className = 'lh-ap-intrare lh-w-caut-in';
    [['data-lh-intrare-document', ''], ['type', 'text'], ['aria-label', CASETA], ['autocomplete', 'off'], ['autocorrect', 'off'],
      ['autocapitalize', 'off'], ['spellcheck', 'false'], ['enterkeyhint', 'search']].forEach(a => cautIn.setAttribute(a[0], a[1]));
    cautIn.style.display = 'none';
    root.appendChild(cautIn);
    I.intrare = cautIn;
    /* runda 26 (critic 22, K1): aici tasta cu sigla e tasta Windows: Windows + literă = gestul ei (win_e), nu ctrl_e (aplicatii.js › gestTasta) */
    I.tastaWindows = true;
    const zona0 = I.zonaTinta;
    const focusCaut = () => { if (cautIn.style.display !== 'none') try { cautIn.focus({ preventScroll: true }); } catch (e) { /* */ } };
    const ascundeCaut = () => {
      if (document.activeElement === cautIn) try { root.focus({ preventScroll: true }); } catch (e) { /* */ }
      cautIn.style.display = 'none';
      I.zonaTinta = zona0;
    };
    function pozCaut() {
      const cs = startEl && startEl.querySelector('.lh-w-cautare-st');
      if (!cs) { ascundeCaut(); return; }
      const rr = root.getBoundingClientRect(), c = cs.getBoundingClientRect(), k = cs.querySelector('.lh-w-caret');
      cautIn.style.display = '';
      cautIn.style.left = Math.round((k ? k.getBoundingClientRect().left : c.left + 40) - rr.left) + 'px';
      cautIn.style.top = Math.round(c.top - rr.top + Math.max(0, (c.height - 20) / 2)) + 'px';
      I.zonaTinta = 'start:' + CASETA;      // ținta evenimentelor venite prin câmp (I.la.text / I.la.sterge)
    }
    /* iOS: focusul care deschide tastatura ecranului trebuie dat din „click”; Chrome îl acceptă și din pointerup (la.clic) */
    root.addEventListener('click', e => { if (M.start && document.activeElement !== cautIn && e.target.closest && e.target.closest('.lh-w-cautare-st')) focusCaut(); });
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
      if (app === 'explorer') { M.start = false; M.caut = null; M.rezSel = 0; return deschideExplorer(); }   // runda 30 (W4)
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
      if (!M.start) { ascundeCaut(); return; }
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
      pozCaut();
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
      /* runda 26 (stare_finala_erori): cu Start deschis tastele sunt ale casetei (ținta lor e caseta, §4), nu ale desktopului din
         spate: Delete / F2 nu mai șterg / redenumesc pictograma selectată sub Start, iar Enter pe caseta goală nu face nimic */
      if (!inGrila && (g === 'tasta_delete' || g === 'tasta_f2')) { e.preventDefault(); I.tintaTasta = ct; return 'fara_efect'; }
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
        /* runda 26 (critic 22, K2): Enter pornește rezultatul ales = butonul apăsat de tastă fără focus → activat (§4) */
        if (g === 'tasta_enter') { e.preventDefault(); if (!rz.length) return I.nesimulat(FARA_POTRIVIRE); I.activat = 'start:' + rz[M.rezSel].nume; return pornire(rz[M.rezSel].nume); }
        return null;
      }
      if (!inGrila && g === 'tasta_enter') { e.preventDefault(); I.tintaTasta = ct; return 'fara_efect'; }
      if (g === 'tasta_tab') {
        e.preventDefault();
        if (inGrila || e.shiftKey) { focusCaut(); if (document.activeElement !== cautIn) try { root.focus({ preventScroll: true }); } catch (x) { /* */ } I.tintaTasta = ct; return 'focus'; }
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
    function seteazaStart(v) {
      M.start = v; M.caut = null; M.rezSel = 0;
      if (v) inchideMeniu();
      /* runda 30 (W4): cu Start deschis tastele sunt ale lui, nu ale Explorer-ului montat (focusul iese din el pe rădăcină); la
         închiderea lui Start, fereastra montată activă primește focusul înapoi (ca fereastra activă din Windows) */
      const m = montata(), mx = m && m.mont.api ? m.mont.api.radacina : null;
      if (v && mx && mx.contains(document.activeElement)) try { root.focus({ preventScroll: true }); } catch (e) { /* */ }
      deseneazaStart(); deseneazaBara();
      if (!v && mx && m.activa && m.stare !== 'min' && !M.meniu) {
        const a = document.activeElement;
        if (!a || a === document.body || a === root) m.mont.api.focus();
      }
      return v ? 'deschide_start' : 'inchide_start';
    }

    /* ---------------- runda 30 (W4, A22-1 + A23-1): Explorer-ul bibliotecii montat într-o fereastră a shell-ului (api §1, opt.incadrat).
       Dosarul galben din bară (fără fereastră Explorer deschisă), Windows + E și „Explorer” găsit în Start îl deschid. Fereastra are bara
       de titlu a shell-ului (titlul = stare().titlu al Explorer-ului, „<folder> - Explorer”, ca „sesiune - Explorer” din
       uia_explorer.json › explorer_fereastra), se minimizează / se readuce / se închide ca celelalte. Conținutul: parametrul `explorer`
       din `continut` (formatul `start` al scenariilor Explorer). O singură instanță Explorer pe pagină (biblioteca le ține pe nume):
       a doua deschidere aduce fereastra în față [A30-1]; un Explorer deschis separat de pagină nu e mutat. Mărimea ferestrei nu e în
       referință (acolo e ecranul altui PC): 82 % × 86 % din zona de lucru, cel mult 1534 × 814 (rect-ul din referință); pe ecranul
       îngust (sub 600 px) se deschide maximizată, ca butoanele ei să rămână pe ecran [DEDUS] R30-1. */
    const MAC = /Mac|iPhone|iPad|iPod/.test(((window.navigator || {}).userAgentData || {}).platform || (window.navigator || {}).platform || '');
    const montata = () => M.ferestre.find(f => f.mont);
    function titluDinExplorer(f) {
      let s = null;
      try { s = f.mont.api.stare(); } catch (e) { s = null; }
      if (!s || !s.titlu || s.titlu === f.titlu) return;
      f.titlu = s.titlu;
      const el = stratF.querySelector('[data-lh-fer="' + M.ferestre.indexOf(f) + '"]');
      if (!el) return;
      el.setAttribute('data-lh-eticheta', f.titlu);
      const tb = el.querySelector('.lh-w-titlu'), tt = el.querySelector('.lh-w-tt');
      if (tb) tb.setAttribute('data-lh-eticheta', f.titlu);
      if (tt) tt.textContent = f.titlu;
    }
    /* activarea fără rescrierea stratului (clicul în Explorer: rădăcina lui nu se mută, deci focusul și redenumirea rămân) */
    function activeazaUsor(f) {
      activeaza(f);
      M.focusMont = null;
      stratF.querySelectorAll('.lh-w-fer[data-lh-fer]').forEach(el => {
        const x = M.ferestre[+el.getAttribute('data-lh-fer')];
        if (!x) return;
        el.classList.toggle('lh-w-activa', !!x.activa);
        el.style.zIndex = x.z;
      });
      deseneazaBara();
    }
    function deschideExplorer() {
      const ex = montata();
      if (ex) { const a = ex.stare === 'min' ? 'restaurare' : 'activare'; activeaza(ex); deseneazaFerestre(); deseneazaBara(); return a; }
      if (L.stare('explorer')) return I.nesimulat(numeApp('explorer'));
      masoara();
      const zw = W, zh = H - BH, w = Math.min(1534, Math.round(zw * 0.82)), h = Math.min(814, Math.round(zh * 0.86));
      const f = normFer({ aplicatie: 'explorer', titlu: numeApp('explorer'), x: Math.max(0, Math.round((zw - w) / 2)) || 1, y: Math.max(0, Math.round((zh - h) / 3)) || 1, w, h,
        stare: W < 600 ? 'max' : 'normal' });
      f.mont = { api: null };
      M.ferestre.push(f);
      if (M.redenumire) termina((desk.querySelector('input') || {}).value, false);
      M.start = false; M.caut = null; M.rezSel = 0;
      inchideMeniu();
      activeaza(f);
      deseneazaFerestre(); deseneazaStart(); deseneazaBara();
      const corp = corpul(f) || parcare;
      L.deschide('explorer', { loc: corp, incadrat: true, continut: c.explorer || {} }).then(api => {
        if (M.ferestre.indexOf(f) < 0 || !root.isConnected) { api.inchide(); return; }   // fereastra s-a închis între timp
        f.mont.api = api;
        const c2 = f.stare === 'min' ? null : corpul(f);
        (c2 || parcare).appendChild(api.radacina);
        titluDinExplorer(f);
        const a = document.activeElement;
        if (f.activa && f.stare !== 'min' && !M.start && !M.meniu && (!a || a === document.body || a === root)) api.focus();
      }).catch(() => {
        const i = M.ferestre.indexOf(f);
        if (i >= 0) M.ferestre.splice(i, 1);
        deseneazaFerestre(); deseneazaBara();
        I.nesimulat(numeApp('explorer'));
      });
      return 'pornire_aplicatie';
    }
    function inchideMontata(f) {
      if (f.mont && f.mont.api) try { f.mont.api.inchide(); } catch (e) { /* */ }
      if (f.mont) f.mont.api = null;
    }
    /* evenimentele Explorer-ului montat: titlul ferestrei urmează folderul; un gest de indicator în el închide meniul desktopului și
       activează fereastra (clicul nu mai ajunge la shell: A23-1 P1 + oprirea din explorer.js) */
    const opresteAsc = L.asculta(d => {
      if (!d || d.aplicatie !== 'explorer' || !root.isConnected) return;
      const f = M.ferestre.find(x => x.mont && x.mont.api);
      if (!f) return;
      titluDinExplorer(f);
      if (/^(tasta_|ctrl_|win_|sageti|alt_sageti|tastare|rotita|zoom)/.test(d.gest || '')) return;
      if (M.meniu) inchideMeniu();
      if (!f.activa) activeazaUsor(f);
    });

    /* runda 30 (A26-2): Start se deschide la RIDICAREA tastei Windows, dacă între timp n-a venit altă tastă (Windows + E nu mai
       deschide Start pentru o clipă și nu mai bifează pasul „Start” al asistentului). Tasta singură = un singur eveniment, la ridicare,
       cu `activat` (I.emite cu extra). Pe Mac rămâne la apăsare (gestTasta nu oprește acolo tasta). */
    I.tastaWindowsLaRidicare = true;
    let winJos = null;
    function apasaWindows(tinta) {
      const ina = I.stare();
      let act, extra = null;
      if (M.redenumire) act = 'tasta_windows';      // ca înainte: în redenumire Start nu se deschide
      else {
        act = seteazaStart(!M.start);
        if (M.start) focusCaut();
        extra = { activat: 'bara_activitati:Start' };
      }
      I.emite('tasta_windows', act, tinta, JSON.parse(JSON.stringify(ina)), extra);
    }
    const tintaFocus = () => { const a = document.activeElement; return L._tintaDin(I, a && root.contains(a) ? a : null); };
    root.addEventListener('keydown', e => {
      if (e.key === 'Meta' || e.key === 'OS') { if (!e.repeat) winJos = { alta: false }; } else if (winJos) winJos.alta = true;
    }, true);
    root.addEventListener('keyup', e => {
      if (e.key !== 'Meta' && e.key !== 'OS') return;
      const j = winJos;
      winJos = null;
      const m = montata();
      if (m && m.mont.api && m.mont.api.radacina.contains(e.target)) return;   // tratată de ascultătorul de pe window (mai jos)
      if (j && !j.alta && !MAC && root.isConnected) apasaWindows(tintaFocus());
    });
    /* tastele cu Windows ținut, când focusul e în Explorer-ul montat, sunt ale shell-ului: Explorer-ul nu le mai vede (altfel
       Windows + E ar fi Ctrl + E acolo, iar tasta Windows n-ar deschide Start). Pe window, în captură: înaintea Explorer-ului. */
    const tasteMontaj = e => {
      if (!root.isConnected || MAC) return;
      const f = M.ferestre.find(x => x.mont && x.mont.api);
      if (!f || !f.mont.api.radacina.contains(e.target)) return;
      const eWin = e.key === 'Meta' || e.key === 'OS';
      if (!eWin && !(e.metaKey && !e.ctrlKey && !e.altKey)) return;
      e.stopPropagation();
      e.preventDefault();
      const tinta = 'fereastra_app:explorer';
      if (e.type === 'keyup') {
        if (!eWin) return;
        const j = winJos;
        winJos = null;
        if (j && !j.alta) apasaWindows(tinta);
        return;
      }
      if (eWin) { if (!e.repeat) winJos = { alta: false }; return; }
      if (winJos) winJos.alta = true;
      const g = L._gestTasta({ key: e.key, code: e.code, ctrlKey: e.ctrlKey, metaKey: e.metaKey, altKey: e.altKey, shiftKey: e.shiftKey, currentTarget: root });
      if (!g || !/^win_/.test(g)) return;
      const ina = JSON.parse(JSON.stringify(I.stare()));
      const act = I.la.tasta({ key: e.key, code: e.code, target: e.target, preventDefault() {}, ctrlKey: e.ctrlKey, metaKey: e.metaKey, altKey: e.altKey, shiftKey: e.shiftKey }, g, false);
      I.emite(g, act || g, tinta, ina);
    };
    window.addEventListener('keydown', tasteMontaj, true);
    window.addEventListener('keyup', tasteMontaj, true);

    /* ---------------- gesturile (aplicatii.js emite evenimentele; aici doar ce face aplicația) */
    const pct = (e) => { const r = root.getBoundingClientRect(); return { x: Math.round(e.clientX - r.left), y: Math.round(e.clientY - r.top) }; };
    const eticheta = t => (t || '').slice(t.indexOf(':') + 1);
    /* runda 30 (N2): numele tastelor din gesturile win_<tastă> (aplicatii.js › tastaWin), cum sunt scrise pe tastatură / în lecții */
    const ETICHETA_WIN = { spatiu: 'Spațiu', punct: '.', virgula: ',', minus: '-', plus: '+', punct_virgula: ';', slash: '/', backslash: '\\',
      apostrof: '\'', accent: '`', paranteza_stanga: '[', paranteza_dreapta: ']', inmultit: '*', tab: 'Tab', enter: 'Enter', esc: 'Esc',
      backspace: 'Backspace', delete: 'Delete', insert: 'Insert', home: 'Home', end: 'End', pagina_sus: 'Page Up', pagina_jos: 'Page Down',
      sus: '↑', jos: '↓', stanga: '←', dreapta: '→', printscreen: 'Print Screen', pauza: 'Pause', meniu: 'Meniu' };
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
          /* runda 30 (W4): aplicația butonului fixat se află și fără fereastră deschisă (AutomationId-ul din referință) */
          const mso = b && b.getAttribute('data-lh-id-mso');
          const app = b && (b.getAttribute('data-lh-app') || Object.keys(D.aplicatii).find(a => mso && D.aplicatii[a].id === mso));
          if (M.start) seteazaStart(false);
          if (app) {
            const fs = M.ferestre.filter(f => f.aplicatie === app);
            if (!fs.length && app === 'explorer') return deschideExplorer();   // dosarul galben → Explorer-ul bibliotecii, montat
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
        if (t === 'start:' + CASETA) { if (M.caut == null) M.caut = ''; deseneazaStart(); focusCaut(); return 'focus_cautare'; }   // W3 + K3 (runda 26): câmpul adevărat primește focusul
        if (fel === 'start' && eticheta(t) === numeApp('explorer')) return deschideExplorer();   // runda 30 (W4): Explorer din „Toate”
        if (fel === 'start' || fel === 'meniu_derulant') return I.nesimulat(eticheta(t));
        if (M.start) seteazaStart(false);
        if (fel === 'bara_titlu') {
          const f = ferDin(el);
          if (!f) return 'fara_efect';
          const nume = eticheta(t);
          if (nume === 'Minimizare') minimizeaza(f);
          else if (nume === 'Maximizare') { f.stare = f.stare === 'max' ? 'normal' : 'max'; activeaza(f); }
          else if (nume === 'Închidere') { inchideMontata(f); M.ferestre.splice(M.ferestre.indexOf(f), 1); const v = M.ferestre.filter(x => x.stare !== 'min').sort((a, b2) => b2.z - a.z)[0]; if (v) activeaza(v); }
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
        /* runda 30 (MINOR „start_fundal”, critic 26 §6): clic dreapta în afara panoului închide Start, ca clicul stâng [DEDUS] R30-2;
           pe fondul panoului mesajul spune „Meniul Start”, nu ținta internă */
        if (startEl && startEl.contains(el)) {
          if (t === 'start_fundal') return seteazaStart(false);
          return I.nesimulat(t === 'start' || t.indexOf(':') < 0 ? 'Meniul Start' : eticheta(t));
        }
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
        /* runda 26 (critic 22, K1): tasta Windows + literă (gestul win_<literă>, aplicatii.js › gestTasta). Start deschis de aceeași
           apăsare se închide (în Windows, Start se deschide doar dacă tasta e lăsată singură); combinația nu e simulată → mesajul
           central, nu tăcere (R12). Ce face fiecare combinație în Windows nu e în referințe: R26-1. */
        if (/^win_/.test(g)) {
          e.preventDefault();
          if (M.redenumire) termina((desk.querySelector('input') || {}).value, false);
          if (M.start) seteazaStart(false);
          inchideMeniu();
          if (g === 'win_e') return deschideExplorer();      // runda 30 (W4): Windows + E = Explorer-ul bibliotecii (lecțiile viii/m2-l14, l15, m3-l16)
          /* runda 30 (critic 26, N2): și tastele care nu sunt litere (gestTasta › tastaWin): mesajul cu numele tastei ca pe tastatură */
          const tk = g.replace(/^win_(shift_)?/, '');
          return I.nesimulat('Windows + ' + (/^win_shift_/.test(g) ? 'Shift + ' : '') + (ETICHETA_WIN[tk] || tk.toUpperCase()));
        }
        if (inCamp && M.redenumire) {
          if (g === 'tasta_enter') { const v = e.target.value; return termina(v, false); }
          if (g === 'tasta_esc') { e.preventDefault(); return termina(null, true); }
          return null;
        }
        if (M.start && !inCamp) { const r = tastaStart(e, g); if (r) return r; }   // runda 22: W3 (căutarea), W2 (Tab, săgețile)
        /* runda 26 (critic 22, K2): tasta Windows face ce face butonul Start („Apasă Start (tasta cu sigla Windows)”) → activat (§4);
           la deschidere focusul intră în casetă (W3: „la deschidere focusul e în Search box”), ca și textul fără keydown să ajungă acolo */
        if (g === 'tasta_windows') { e.preventDefault(); I.activat = 'bara_activitati:Start'; const a = seteazaStart(!M.start); if (M.start) focusCaut(); return a; }
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
      /* runda 26 (K3): textul venit prin câmpul casetei (tastatura telefonului, IME, dictare) → căutarea, ca literele de la tastatură */
      text(v) {
        if (!M.start) return 'fara_efect';
        M.caut = (M.caut || '') + v; M.rezSel = 0;
        deseneazaStart();
        return cautaRez().length || !M.caut.trim() ? 'cautare' : I.nesimulat(FARA_POTRIVIRE);
      },
      sterge(g) {
        if (!M.start || M.caut == null || g !== 'tasta_backspace') return 'fara_efect';
        M.caut = M.caut.slice(0, -1); M.rezSel = 0;
        deseneazaStart();
        return 'cautare';
      },
      jos(e) {
        const el = e.target;
        if (el.closest && el.closest('input')) return null;
        /* runda 26 (K3): pe telefon, după atingere vine „mousedown”-ul de compatibilitate, care ar muta focusul pe rădăcină și ar
           închide tastatura ecranului deschisă la atingerea casetei; anularea lui pointerdown îl oprește (Pointer Events, §11) */
        if (M.start && el.closest && el.closest('.lh-w-cautare-st')) { e.preventDefault(); return null; }
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
    I.distruge = () => {
      if (ceas) clearInterval(ceas);
      if (I._ro) try { I._ro.disconnect(); } catch (e) { /* */ }
      /* runda 30 (W4): Explorer-ul montat pleacă odată cu shell-ul; ascultătorii de pe window se scot */
      try { opresteAsc(); } catch (e) { /* */ }
      window.removeEventListener('keydown', tasteMontaj, true);
      window.removeEventListener('keyup', tasteMontaj, true);
      M.ferestre.forEach(inchideMontata);
    };
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
