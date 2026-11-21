/* explorer.js — File Explorer (Windows 11, română) în biblioteca centrală (api_biblioteca.md §1-§8, oracole/CONVENTIE_ARBORE.md §2).
   Interfața (etichete, tipuri, AutomationId, ordine, poziții, gri) vine din date/explorer.json, GENERAT din referința reală
   înghețată (referinte/uia_explorer.json) de _unelte/genereaza_explorer.py — aici nu se scrie nicio etichetă de interfață.
   Comportamentul = cele 18 scenarii (scenarii/explorer/*.json, rezultatele reale în referinte/scenarii_real/explorer_*.json);
   ce nu dau scenariile dă mesajul central „aici nu e simulată” (R12) și e rând R15-… în de_verificat.md.
   Suprafețele (data-lh-suprafata) = cheile de randare ale O3 (structura_lib.SHELL_SUPRAFETE): fereastra pe părți
   (fereastra › file_fereastra, butoane_navigare, bara_adresa, cautare, bara_comenzi, panou_navigare, zona_continut,
   panou_detalii, bara_stare) și meniurile (meniu_nou, meniu_sortare, meniu_vizualizare, meniu_fisier, meniu_fisier_clasic,
   meniu_fundal). Pictogramele: setul Fluent din date/explorer.json › icoane (MIT) + forme simple proprii (I7). */
(function () {
  'use strict';
  const L = window.LH && window.LH.aplicatii;
  if (!L) return;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const COL = new Intl.Collator('ro', { numeric: true, sensitivity: 'base' });
  const ext = n => { const i = n.lastIndexOf('.'); return i > 0 ? n.slice(i + 1) : ''; };
  const baza = n => { const i = n.lastIndexOf('.'); return i > 0 ? n.slice(0, i) : n; };
  const COS = 'Coș de reciclare/';
  const eDir = p => /\/$/.test(p);
  const par = p => { const q = p.replace(/\/$/, ''); const i = q.lastIndexOf('/'); return i < 0 ? '' : q.slice(0, i + 1); };
  const num = p => { const q = p.replace(/\/$/, ''); return q.slice(q.lastIndexOf('/') + 1); };
  const cu = p => num(p) + (eDir(p) ? '/' : '');
  /* Acest PC (This PC) și unitățile. Implicit: C: (disc local) și E: (stick USB, „STICK (E:)”, ca în lecția m2-l09 / lectii/_sim/explorer-citire.js).
     Unitate = { nume, stick?, arbore (relativ la rădăcina ei), detalii: { 'cale/relativa': ['dd.mm.yyyy hh:mm', 'N KB'] } }; c.unitati o înlocuiește. */
  const PC = 'Acest PC';
  const UNITATI_IMPLICITE = {
    'C:': { nume: 'Disc local', arbore: ['Windows/', 'Windows/Media/'] },
    'E:': { nume: 'STICK', stick: true,
      arbore: ['Scoala/', 'Scoala/TIC/', 'Scoala/TIC/afis.png', 'Scoala/TIC/afis.docx', 'Scoala/TIC/orar.txt', 'Scoala/Muzica/', 'Scoala/Muzica/colind.mp3', 'Scoala/Muzica/colind.txt', 'Excursie/', 'Excursie/munte.jpg', 'Excursie/drumul.mp4'],
      detalii: { 'Scoala/TIC/afis.png': ['12.11.2026 10:15', '245 KB'], 'Scoala/TIC/afis.docx': ['12.11.2026 10:20', '18 KB'], 'Scoala/TIC/orar.txt': ['10.11.2026 08:05', '1 KB'],
        'Scoala/Muzica/colind.mp3': ['09.11.2026 17:40', '3.850 KB'], 'Scoala/Muzica/colind.txt': ['09.11.2026 17:42', '2 KB'],
        'Excursie/munte.jpg': ['18.10.2026 12:31', '2.140 KB'], 'Excursie/drumul.mp4': ['18.10.2026 12:50', '48.320 KB'] } } };
  const esteU = p => /^[A-Z]:\/$/.test(p);

  /* forme simple, desenate aici (nu sunt resurse Microsoft): ce lipsește din setul Fluent al proiectului */
  const FORME = {
    dosar: '<path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h4L9 5.5h7.5A1.5 1.5 0 0 1 18 7v7.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 2 14.5z" fill="#f2c55c" stroke="#c9952a" stroke-width=".8"/>',
    cos: '<path d="M6 6h8l-.8 10.5H6.8z" fill="#e8eef5" stroke="currentColor" stroke-width=".9"/><path d="M4.5 6h11M8 4h4" stroke="currentColor" stroke-width=".9"/>',
    Ștergere: '<path d="M6 6h8l-.8 10.5H6.8z" fill="none" stroke="currentColor"/><path d="M4.5 6h11M8 4h4M9 8.5v5.5M11 8.5v5.5" stroke="currentColor"/>',
    inapoi: '<path d="M16 10H4.5M9 5.5 4.5 10 9 14.5" fill="none" stroke="currentColor" stroke-width="1.1"/>',
    inainte: '<path d="M4 10h11.5M11 5.5l4.5 4.5-4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.1"/>',
    Minimizare: '<path d="M5 10h10" stroke="currentColor"/>',
    Maximizare: '<rect x="5.5" y="5.5" width="9" height="9" fill="none" stroke="currentColor"/>',
    Închidere: '<path d="M5.5 5.5l9 9M14.5 5.5l-9 9" stroke="currentColor"/>',
    pc: '<rect x="3" y="4" width="14" height="9" rx="1" fill="#cfe3f7" stroke="currentColor" stroke-width=".9"/><path d="M7 16h6M10 13v3" stroke="currentColor"/>',
    disc: '<rect x="3" y="7.5" width="14" height="5.5" rx="1" fill="#e6e6e6" stroke="currentColor" stroke-width=".9"/><circle cx="14" cy="10.25" r=".9" fill="#2a8c2a"/>',
    stick: '<rect x="3" y="8" width="14" height="5" rx="1" fill="#6C7A86" stroke="currentColor" stroke-width=".9"/><path d="M5 15.5h10" stroke="currentColor"/>',
    casa: '<path d="M3.5 9.5 10 4l6.5 5.5V16H12v-4H8v4H3.5z" fill="none" stroke="currentColor" stroke-width=".9"/>',
    jos: '<path d="M6 8l4 4 4-4" fill="none" stroke="currentColor"/>',
    dreapta: '<path d="M8 6l4 4-4 4" fill="none" stroke="currentColor"/>',
    sus_sort: '<path d="M6 12l4-4 4 4" fill="none" stroke="currentColor"/>',
    'Mai multe opțiuni': '<circle cx="5" cy="10" r="1.1" fill="currentColor"/><circle cx="10" cy="10" r="1.1" fill="currentColor"/><circle cx="15" cy="10" r="1.1" fill="currentColor"/>',
    Previzualizare: '<rect x="3" y="4" width="14" height="12" rx="1.2" fill="none" stroke="currentColor"/><path d="M11.5 4v12" stroke="currentColor"/>',
    bifa: '<path d="M4.5 10.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" stroke-width="1.2"/>',
    Detalii: '<path d="M3 5.5h14M3 10h14M3 14.5h14" stroke="currentColor"/>',
    'Pictograme mari': '<rect x="3.5" y="3.5" width="5.5" height="5.5" fill="none" stroke="currentColor"/><rect x="11" y="3.5" width="5.5" height="5.5" fill="none" stroke="currentColor"/><rect x="3.5" y="11" width="5.5" height="5.5" fill="none" stroke="currentColor"/><rect x="11" y="11" width="5.5" height="5.5" fill="none" stroke="currentColor"/>',
    fila: '<path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h4L9 5.5h7.5A1.5 1.5 0 0 1 18 7v7.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 2 14.5z" fill="#f2c55c" stroke="#c9952a" stroke-width=".8"/>'
  };
  const STIL = `
.lh-ap.lh-ap-explorer{--e-h:640px;--e-fond:#f3f3f3;--e-alb:#fff;--e-linie:#e5e5e5;--e-ales:#cce8ff;--e-ales-b:#99d1ff;--e-hover:#e5f3ff;--e-text:#1a1a1a;--e-gri:#a0a0a0;--e-desk:#1f5b8f;
  display:flex;grid-template-rows:none;height:var(--e-h);max-height:100vh;min-height:420px;background:var(--e-desk);color:var(--e-text);
  font:12px 'Segoe UI Variable','Segoe UI',system-ui,sans-serif;user-select:none;-webkit-user-select:none}
.lh-ap.lh-ap-explorer.lh-ap-e-incadrat{height:100%;max-height:none;min-height:0;border:0;background:var(--e-fond)}
.lh-ap-e-incadrat .lh-ap-e-win{grid-template-rows:48px 1px 46px 1px minmax(0,1fr) 24px 8px;border:0}
.lh-ap-explorer[data-lh-tema="intunecat"]{--e-fond:#202020;--e-alb:#191919;--e-linie:#3a3a3a;--e-ales:#3b4f66;--e-ales-b:#5a7a9e;--e-hover:#2d2d2d;--e-text:#f0f0f0;--e-gri:#777}
@media (prefers-color-scheme:dark){.lh-ap-explorer:not([data-lh-tema="luminos"]){--e-fond:#202020;--e-alb:#191919;--e-linie:#3a3a3a;--e-ales:#3b4f66;--e-ales-b:#5a7a9e;--e-hover:#2d2d2d;--e-text:#f0f0f0;--e-gri:#777}}
.lh-ap-explorer button{font:inherit;color:inherit;background:none;border:0;padding:0;margin:0;cursor:default}
.lh-ap-e-ic{width:16px;height:16px;flex:none;display:inline-block;vertical-align:middle}
.lh-ap-e-desk{flex:none;width:80px;padding:6px 2px;display:flex;flex-direction:column;align-items:center}
.lh-ap-e-desk-ic{width:74px;min-height:68px;display:flex;flex-direction:column;align-items:center;gap:3px;color:#fff;text-align:center;border:1px solid transparent;border-radius:3px;padding:4px 2px;text-shadow:0 1px 2px #000}
.lh-ap-e-desk-ic .lh-ap-e-ic{width:34px;height:34px;color:#fff}
.lh-ap-e-desk-ic[data-lh-selectat]{background:rgba(255,255,255,.22);border-color:rgba(255,255,255,.55)}
.lh-ap-e-win{position:relative;flex:1;min-width:0;display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:40px 48px 1px 46px 1px minmax(0,1fr) 24px 8px;background:var(--e-fond);border:1px solid #8a8a8a;overflow:hidden}
.lh-ap-e-r1{position:relative}
.lh-ap-e-sistem{position:absolute;left:8px;top:8px;width:22px;height:22px;z-index:0}
.lh-ap-e-file{position:absolute;left:8px;top:2px;height:38px;right:150px;z-index:1}
.lh-ap-e-fila{position:absolute;left:4px;top:6px;width:248px;height:32px;display:flex;align-items:center;gap:10px;padding:0 0 0 12px;background:var(--e-alb);border-radius:8px 8px 0 0}
.lh-ap-e-fila .lh-ap-e-ft{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lh-ap-e-fila-x{position:absolute;left:208px;top:4px;width:32px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:4px}
.lh-ap-e-adauga{position:absolute;left:255px;top:11px;width:32px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:4px}
.lh-ap-e-tbut{position:absolute;top:1px;width:47px;height:30px;display:flex;align-items:center;justify-content:center}
.lh-ap-e-tbut:hover{background:var(--e-hover)}.lh-ap-e-tbut[data-lh-id="Închidere"]:hover{background:#c42b1c;color:#fff}
.lh-ap-e-r2{display:flex;align-items:flex-start;background:var(--e-alb);min-width:0}
.lh-ap-e-nav{position:relative;flex:none;width:198px;height:48px;margin-left:11px}
.lh-ap-e-nb{position:absolute;top:8px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:4px}
.lh-ap-e-nb[aria-disabled="true"]{color:var(--e-gri)}
.lh-ap-explorer button:not([aria-disabled="true"]):hover,.lh-ap-e-nod:hover,.lh-ap-e-mr:hover{background:var(--e-hover)}
.lh-ap-e-adr{position:relative;flex:1;min-width:60px;height:32px;margin-top:8px;border:1px solid var(--e-linie);border-radius:4px;background:var(--e-fond)}
.lh-ap-e-adr-edit{position:absolute;inset:0;z-index:0}
.lh-ap-e-crumbs{position:absolute;left:0;top:0;bottom:0;right:0;display:flex;align-items:center;padding-left:13px;overflow:hidden;z-index:1;pointer-events:none}
.lh-ap-e-crumbs>*{pointer-events:auto}
.lh-ap-e-cr{height:24px;display:flex;align-items:center;gap:4px;padding:0 4px 0 9px;white-space:nowrap;border-radius:4px}
.lh-ap-e-cr0{width:51px;padding:0;justify-content:flex-start}
.lh-ap-e-adr input,.lh-ap-e-caut input{position:absolute;inset:0;width:100%;height:100%;border:0;outline:0;background:transparent;font:inherit;color:inherit;padding:0 10px}
.lh-ap-e-adr input{z-index:2;background:var(--e-alb);border-bottom:2px solid #005fb8}
.lh-ap-e-caut{position:relative;flex:none;width:min(378px,30%);min-width:110px;height:32px;margin:8px 19px 0 8px;border:1px solid var(--e-linie);border-radius:4px;background:var(--e-fond)}
.lh-ap-e-caut input{padding-left:12px}
.lh-ap-e-sep{background:var(--e-linie)}
.lh-ap-e-cmdw{overflow-x:auto;overflow-y:hidden;scrollbar-width:thin;background:var(--e-alb)}
.lh-ap-e-cmd{position:relative;display:flex;align-items:stretch;height:46px;margin:0 8px;min-width:640px}
.lh-ap-e-cb{height:46px;display:flex;align-items:center;justify-content:center;gap:6px;border-radius:4px;white-space:nowrap;flex:none}
.lh-ap-e-cb[aria-disabled="true"]{color:var(--e-gri)}
.lh-ap-e-cb .lh-ap-e-ic{width:16px;height:16px}
.lh-ap-e-corp{display:flex;min-height:0;background:var(--e-alb)}
.lh-ap-e-np{position:relative;flex:none;width:clamp(120px,26%,389px);margin-left:10px;overflow:auto;padding:0 0 8px}
.lh-ap-e-np.lh-ap-e-ascuns{display:none}
.lh-ap-e-nod{position:relative;height:32px;display:flex;align-items:center;border-radius:4px;white-space:nowrap}
.lh-ap-e-nod[data-lh-selectat]{background:var(--e-ales)}
.lh-ap-e-nod-ic{position:absolute;display:flex;align-items:center;gap:6px;top:8px}
.lh-ap-e-nod-sep{height:1px;margin:0 8px;background:var(--e-linie)}
.lh-ap-e-cont{position:relative;flex:1;min-width:80px;margin-left:4px;display:flex;flex-direction:column;overflow:auto}
.lh-ap-e-antet{flex:none;display:flex;height:25px;min-width:770px;position:sticky;top:0;z-index:2;background:var(--e-alb)}
.lh-ap-e-col{flex:none;height:25px;display:flex;align-items:center;padding-left:8px;border-right:1px solid var(--e-linie);position:relative;white-space:nowrap}
.lh-ap-e-col .lh-ap-e-sageata{position:absolute;left:50%;top:-4px;width:12px;height:12px;transform:translateX(-50%)}
.lh-ap-e-lista{position:relative;flex:1 0 auto;min-width:770px;padding:6px 0 40px}
.lh-ap-e-rand{display:flex;align-items:center;height:24px;margin:0 0 4px 14px;width:752px;border:1px solid transparent;border-radius:3px;white-space:nowrap}
.lh-ap-e-rand[data-lh-selectat]{background:var(--e-ales);border-color:var(--e-ales-b)}
.lh-ap-e-rand.lh-ap-e-taiat{opacity:.55}
.lh-ap-e-rand>span{flex:none;overflow:hidden;text-overflow:ellipsis;padding-right:6px}
.lh-ap-e-nume{width:326px;display:flex;align-items:center;gap:6px;padding-left:2px}
.lh-ap-e-nume input{font:inherit;color:inherit;border:1px solid #005fb8;outline:0;height:20px;padding:0 3px;width:240px;background:var(--e-alb);user-select:text;-webkit-user-select:text}
.lh-ap-e-c1{width:180px;color:#6b6b6b}.lh-ap-e-c2{width:150px;color:#6b6b6b}.lh-ap-e-c3{width:96px;color:#6b6b6b;text-align:right}
.lh-ap-e-lista.lh-ap-e-ico{min-width:0;display:flex;flex-wrap:wrap;align-content:flex-start;gap:4px;padding:8px}
.lh-ap-e-ico .lh-ap-e-rand{flex-direction:column;justify-content:flex-start;width:96px;height:auto;min-height:86px;margin:0;padding:4px 2px;white-space:normal;text-align:center}
.lh-ap-e-ico .lh-ap-e-rand>span:not(.lh-ap-e-nume){display:none}
.lh-ap-e-ico .lh-ap-e-nume{width:auto;flex-direction:column;padding:0}.lh-ap-e-ico .lh-ap-e-nume .lh-ap-e-ic{width:48px;height:48px}
.lh-ap-e-cadru{position:absolute;border:1px solid #0078d4;background:rgba(0,120,212,.15);pointer-events:none;z-index:5}
.lh-ap-e-pd{position:relative;flex:none;width:clamp(0px,30%,456px);margin:4px 4px 4px 21px;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden}
.lh-ap-e-pd.lh-ap-e-ascuns,.lh-ap-e-ingust .lh-ap-e-pd{display:none}
.lh-ap-e-stare{position:relative;display:flex;align-items:center;margin:0 8px;height:24px;background:var(--e-fond)}
.lh-ap-e-stare .lh-ap-e-nr{margin-left:12px;white-space:nowrap;height:24px;display:flex;align-items:center}
.lh-ap-e-moduri{margin-left:auto;margin-right:4px;display:flex}
.lh-ap-e-mod{width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:3px}
.lh-ap-e-mod[aria-checked="true"]{background:var(--e-ales)}
.lh-ap-e-mw{position:absolute;z-index:30;overflow:auto;max-height:100%}
.lh-ap-e-meniu{position:relative}
.lh-ap-e-cutie{position:absolute;background:var(--e-alb);border:1px solid #c7c7c7;border-radius:8px;box-shadow:0 8px 16px rgba(0,0,0,.14)}
.lh-ap-e-clasic .lh-ap-e-cutie{border-radius:0;background:#f2f2f2;box-shadow:2px 2px 4px rgba(0,0,0,.3)}
.lh-ap-e-mr{position:absolute;display:flex;align-items:center;gap:10px;padding:0 10px;border-radius:4px;white-space:nowrap}
.lh-ap-e-clasic .lh-ap-e-mr{border-radius:0;padding-left:30px}
.lh-ap-e-mr .lh-ap-e-sc{margin-left:auto;color:#6b6b6b}
.lh-ap-e-mr .lh-ap-e-sub{margin-left:auto}
.lh-ap-e-mr .lh-ap-e-b{position:absolute;left:-2px;width:14px;height:14px}
.lh-ap-e-mr.lh-ap-e-icon{justify-content:center;padding:0}
.lh-ap-e-ms{position:absolute;height:1px;background:var(--e-linie)}
.lh-ap-e-dfond{position:absolute;inset:0;z-index:40;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.12)}
.lh-ap-e-dlg{min-width:min(420px,92%);max-width:92%;background:var(--e-fond);border:1px solid #8a8a8a;box-shadow:0 10px 30px rgba(0,0,0,.3)}
.lh-ap-e-dlg-t{height:32px;display:flex;align-items:center;padding:0 12px;background:var(--e-alb)}
.lh-ap-e-dlg-q{padding:16px 16px 8px;white-space:pre-line;font-size:13px}
.lh-ap-e-dlg-b{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end;padding:8px 16px 16px}
.lh-ap-e-dlg-b.lh-ap-e-vert{flex-direction:column;align-items:stretch}
.lh-ap-e-db{min-width:80px;min-height:32px;padding:4px 12px;border:1px solid #c7c7c7 !important;border-radius:4px;background:var(--e-alb) !important;text-align:left}
.lh-ap-e-db:focus{outline:2px solid #005fb8}
@media (max-width:480px){
  .lh-ap.lh-ap-explorer{--e-h:600px}
  .lh-ap-e-desk{width:58px}.lh-ap-e-desk-ic{width:54px;font-size:11px}
  .lh-ap-e-np{width:118px;margin-left:2px}.lh-ap-e-pd{display:none}
  .lh-ap-e-caut{width:92px;min-width:92px;margin-right:6px}
  .lh-ap-e-adr{min-width:40px}
  .lh-ap-e-nav{width:146px;margin-left:2px}.lh-ap-e-nb{width:34px;height:34px;top:7px}
  .lh-ap-e-nb[data-lh-id="inapoi"]{left:2px!important}.lh-ap-e-nb[data-lh-id="inainte"]{left:38px!important}.lh-ap-e-nb[data-lh-id="sus"]{left:74px!important}.lh-ap-e-nb[data-lh-id="reimprospatare"]{left:110px!important}
  .lh-ap-e-rand{height:34px}.lh-ap-e-nod{height:36px}.lh-ap-e-mr{min-height:32px}
  .lh-ap-e-cb{min-width:36px}.lh-ap-e-mod{width:34px;height:24px}
}`;
  function stil() {
    if (document.getElementById('lh-ap-explorer-css')) return;
    const s = document.createElement('style');
    s.id = 'lh-ap-explorer-css';
    s.textContent = STIL;
    document.head.appendChild(s);
  }

  function creeaza(I, c, L) {
    stil();
    const D = I.date, root = I.root, scenariu = !!(I.opt && I.opt.scenariu);
    root.classList.add('lh-ap-explorer');
    c = c || {};
    const UNIT = c.unitati || UNITATI_IMPLICITE;
    const litU = p => p.slice(0, 2);
    const stickU = p => !!((UNIT[litU(p)] || {}).stick);
    const etichU = p => ((UNIT[litU(p)] || {}).nume || 'Disc local') + ' (' + litU(p) + ')';
    const unitatiCale = () => Object.keys(UNIT).map(l => l + '/');
    const set = c.setari || {};
    const ic = (k, cls) => {
      const f = (D.icoane || {})[k];
      const inner = f ? f.map(d => '<path d="' + d + '" fill="currentColor"/>').join('') : (FORME[k] || '');
      return '<svg class="lh-ap-e-ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 20 20" aria-hidden="true">' + inner + '</svg>';
    };
    const icFisier = p => esteU(p) ? ic(stickU(p) ? 'stick' : 'disc') : eDir(p) ? ic('dosar') : /^(png|jpe?g|bmp|gif)$/i.test(ext(num(p))) ? ic('imagine') : /^txt$/i.test(ext(num(p))) ? ic('text') : ic('document');

    /* ---------------------------------------------------------------- modelul: sistemul de fișiere virtual */
    const F = new Map();
    const PARINTE = (c.parinte || 'Documente') + '/';
    const W = PARINTE + (c.folder || 'Exercitii') + '/';
    const pune = (dir, arb, cont, det) => {
      F.set(dir, {});
      (arb || []).forEach(n => {
        const p = dir + n;
        const parti = p.split('/');
        for (let k = 1; k < parti.length - (eDir(p) ? 1 : 0); k++) { const d = parti.slice(0, k).join('/') + '/'; if (!F.has(d)) F.set(d, {}); }
        F.set(p, Object.assign({ continut: cont && cont[n] }, det && det[n] ? { data: det[n][0], marime: det[n][1] } : {}));
      });
    };
    F.set(PARINTE, {});
    /* fără `arbore` (pagina nu dă conținut: poligonul gol, oracolele O5/O9) = un folder de lucru mic, ca în lecțiile de clasa a V-a;
       `arbore: []` = folder gol (scenariul explorer_folder_nou) */
    pune(W, c.arbore || (c.folder ? [] : ['Desene/', 'Proiect/', 'harta.png', 'notite.txt', 'tema.docx']), c.continut);
    Object.keys(UNIT).forEach(l => { const u = UNIT[l]; pune(l + '/', u.arbore || [], u.continut, u.detalii); });
    if (c.sursa_lipirii) pune(PARINTE + c.sursa_lipirii.folder + '/', c.sursa_lipirii.arbore, c.sursa_lipirii.continut);
    (c.foldere_alaturate || []).forEach(x => pune(PARINTE + x.folder + '/', x.arbore, x.continut));
    const srt = c.sortare || {};
    const M = { F, cur: c.start === 'PC' ? PC : W, sel: [], ancora: null, clip: null, taiat: false, cos: [], meniu: null, dlg: null, dialog: null, edit: null,
      ext: !!set.extensii_vizibile, ascunse: false, casete: false, compact: false, panouNav: true,
      panouDreapta: set.panou_examinare === false ? null : 'examinare', vedere: 'Detalii',
      sortare: { col: srt.coloana || 'Nume', desc: srt.directie === 'descrescator' }, istoric: [], refacere: [], inapoi: [], inainte: [],
      cautare: '', editAdresa: false, adrTxt: null, deskSel: false };
    /* runda 23 (A22-1, cererea benzii Windows): montat într-o fereastră străină (opt.incadrat), Explorer-ul nu-și desenează bara de
       titlu (rândul filelor + Minimizare / Maximizare / Închidere) și nici desktopul cu Coșul: le are gazda. Umple corpul gazdei. */
    const incadrat = !!(I.opt && I.opt.incadrat);
    const desktop = !incadrat && c.desktop !== false;
    if (incadrat) { root.classList.add('lh-ap-e-incadrat'); root.setAttribute('data-lh-incadrat', ''); }

    const copii = d => {
      if (d === COS) return M.cos.map(e => e.p);
      if (d === PC) return unitatiCale().filter(p => M.F.has(p));
      const k = [...M.F.keys()].filter(p => p !== d && par(p) === d);
      const cmp = (a, b) => {
        let r = 0;
        if (M.sortare.col === 'Tip') r = COL.compare(tipText(a), tipText(b));
        if (!r) r = COL.compare(num(a), num(b));
        return M.sortare.desc ? -r : r;
      };
      return k.filter(eDir).sort(cmp).concat(k.filter(p => !eDir(p)).sort(cmp));
    };
    const vizibile = d => {
      const q = M.cautare.trim().toLowerCase();
      return copii(d).filter(p => !q || num(p).toLowerCase().indexOf(q) >= 0);
    };
    const afis = p => { if (esteU(p)) return etichU(p); const n = num(p); return eDir(p) || M.ext || !ext(n) ? n : baza(n); };
    /* bara de adresă ca text (cum o scrie Windows, cu \): Acest PC · E:\Excursie · Documente\Clasa a V-a */
    const cuBara = p => p === PC ? PC : p === COS ? 'Coș de reciclare' : esteU(p) ? litU(p) + '\\' : p.replace(/\/$/, '').replace(/\//g, '\\');
    const nmSeg = p => esteU(p) ? etichU(p) : num(p);
    const tipText = p => {
      if (esteU(p)) return stickU(p) ? 'Unitate amovibilă' : 'Disc local';
      const t = (D.zona_continut || {}).tipuri || {};
      if (eDir(p)) return t['/'] || '';
      const x = ext(num(p)).toLowerCase();
      return t[x] || (x ? 'Fișier ' + x.toUpperCase() : '');
    };
    const liber = (d, n, folder) => { const b = folder ? n : baza(n), e = folder || !ext(n) ? '' : '.' + ext(n); let x = b + e, i = 2; while (M.F.has(d + x + (folder ? '/' : ''))) x = b + ' (' + (i++) + ')' + e; return x; };
    const copie = (d, n, folder) => { const b = folder ? n : baza(n), e = folder || !ext(n) ? '' : '.' + ext(n); let x = b + ' - Copie' + e, i = 2; while (M.F.has(d + x + (folder ? '/' : ''))) x = b + ' - Copie (' + (i++) + ')' + e; return x; };
    const subarbore = p => [...M.F.keys()].filter(q => q === p || (eDir(p) && q.indexOf(p) === 0));
    const muta = (src, dst) => { subarbore(src).forEach(q => { const v = M.F.get(q); M.F.delete(q); M.F.set(dst + q.slice(src.length), v); }); };
    const copiaza = (src, dst) => { subarbore(src).forEach(q => M.F.set(dst + q.slice(src.length), Object.assign({}, M.F.get(q)))); };
    const instantaneu = () => ({ F: [...M.F.entries()].map(([k, v]) => [k, Object.assign({}, v)]), cos: M.cos.map(e => ({ p: e.p, v: e.v.map(x => [x[0], Object.assign({}, x[1])]) })) });
    const reface = s => { M.F = new Map(s.F.map(([k, v]) => [k, Object.assign({}, v)])); M.cos = s.cos.map(e => ({ p: e.p, v: e.v.slice() })); };
    const memoreaza = op => { M.istoric.push({ op, s: instantaneu() }); if (M.istoric.length > 50) M.istoric.shift(); M.refacere.length = 0; };

    I.stare = () => {
      const k = copii(W);
      return {
        nume_fisiere: k.map(cu), ordine_afisata: vizibile(M.cur).map(cu),
        in_cos: M.cos.filter(e => par(e.p) === W).map(e => cu(e.p)),
        continut_fisiere: Object.fromEntries(k.filter(p => M.F.get(p).continut !== undefined).map(p => [num(p), M.F.get(p).continut])),
        dialog: M.dialog ? JSON.parse(JSON.stringify(M.dialog)) : null,
        cale_curenta: M.cur, selectie: M.sel.map(cu),
        /* starea barei de adresă și a listei, așa cum se văd: calea cu \, caseta (clicată / scrisă), numele afișate, selecția cu numele afișat */
        cale_afisata: cuBara(M.cur),
        bara_adresa: { clicata: !!M.editAdresa, scris: M.editAdresa ? (M.adrTxt != null ? M.adrTxt : cuBara(M.cur)) : null },
        elemente_afisate: vizibile(M.cur).map(afis), selectie_afisata: M.sel.map(afis),
        extensii_vizibile: !!M.ext, elemente_ascunse: !!M.ascunse,
        /* A22-1: titlul ferestrei, pentru bara de titlu a gazdei — „<folder> - Explorer” (uia_explorer.json › explorer_fereastra ›
           ferestre[0].arbore.nume = „sesiune - Explorer”); doar la montare, ca starea din poligon / O4 să rămână aceeași */
        ...(incadrat ? { titlu: fol() + ' - Explorer' } : {})
      };
    };
    I.zonaTinta = 'lista';

    /* ---------------------------------------------------------------- desenul */
    const atr = o => Object.keys(o).filter(k => o[k] != null && o[k] !== false).map(k => o[k] === true ? k : k + '="' + esc(o[k]) + '"').join(' ');
    const fol = () => M.cur === COS ? 'Coș de reciclare' : M.cur === PC ? PC : esteU(M.cur) ? etichU(M.cur) : num(M.cur);
    const sablon = (s, f, p) => String(s || '').replace('{folder}', f).replace('{parinte}', p);
    function htmlFereastra() {
      const fb = D.fereastra.butoane || [];
      const sist = fb.find(b => b.t === 'MenuItem');
      const tb = fb.filter(b => b.t === 'Button');
      const wR = D.fereastra.w;
      const fl = D.file, nav = D.navigare.butoane, cb = D.bara_comenzi;
      const pa = par(M.cur), folder = fol();
      const parinte = M.cur === COS || M.cur === PC ? 'Desktop' : esteU(M.cur) ? PC : pa ? nmSeg(pa) : PC;
      const sel = M.sel.length > 0, poateLipi = !!M.clip && M.cur !== COS;
      const activ = { Decupare: sel, Copiere: sel, Lipire: poateLipi, Redenumire: M.sel.length === 1 && M.cur !== COS, Partajați: sel, Ștergere: sel };
      const navId = { backButton: 'inapoi', forwardButton: 'inainte', upButton: 'sus', refreshButton: 'reimprospatare' };
      const navActiv = { inapoi: M.inapoi.length > 0, inainte: M.inainte.length > 0, sus: true, reimprospatare: true };
      let h = '<div class="lh-ap-e-r1">';
      if (sist) h += '<div class="lh-ap-e-sistem" ' + atr({ 'data-lh-tip': 'MenuItem', 'data-lh-eticheta': sist.e, 'aria-label': sist.e }) + '></div>';
      h += '<div class="lh-ap-e-file" data-lh-suprafata="file_fereastra" role="tablist">' +
        '<div class="lh-ap-e-fila" role="tab" data-lh-selectat ' + atr({ 'data-lh-tip': fl.fila.t, 'data-lh-eticheta': folder, 'data-lh-tinta': 'fila', 'data-lh-id': folder }) + '>' +
        ic(M.cur === COS ? 'cos' : M.cur === PC ? 'pc' : 'fila') +'<span class="lh-ap-e-ft">' + esc(folder) + '</span>' +
        '<button class="lh-ap-e-fila-x" ' + atr({ 'data-lh-tip': fl.inchide.t, 'data-lh-id-mso': fl.inchide.id, 'aria-label': fl.inchide.e, 'data-lh-eticheta': fl.inchide.e, 'data-lh-tinta': 'bara_titlu', 'data-lh-id': fl.inchide.e }) + '>' + ic('Închidere') + '</button></div>' +
        '<button class="lh-ap-e-adauga" ' + atr({ 'data-lh-tip': fl.adauga.t, 'data-lh-id-mso': fl.adauga.id, 'aria-label': fl.adauga.e, 'data-lh-eticheta': fl.adauga.e, 'data-lh-tinta': 'bara_titlu', 'data-lh-id': fl.adauga.e }) + '>' +
        '<svg class="lh-ap-e-ic" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4.5v11M4.5 10h11" stroke="currentColor"/></svg></button></div>';
      tb.forEach(b => { h += '<button class="lh-ap-e-tbut" style="right:' + (wR - b.r[0] - b.r[2]) + 'px" ' + atr({ 'data-lh-tip': b.t, 'aria-label': b.e, 'data-lh-eticheta': b.e, 'data-lh-tinta': 'bara_titlu', 'data-lh-id': b.e }) + '>' + ic(b.e) + '</button>'; });
      if (incadrat) h = '';   // A22-1: bara de titlu e a gazdei
      h += (incadrat ? '' : '</div>') + '<div class="lh-ap-e-r2"><div class="lh-ap-e-nav" data-lh-suprafata="butoane_navigare">';
      nav.forEach(b => {
        const k = navId[b.id] || b.id, et = sablon(b.sablon || b.e, folder, parinte);
        h += '<button class="lh-ap-e-nb" style="left:' + b.r[0] + 'px" ' + atr({ 'data-lh-tip': b.t, 'data-lh-id-mso': b.id, 'aria-label': et, 'data-lh-eticheta': et, title: et, 'data-lh-tinta': 'nav', 'data-lh-id': k, 'aria-disabled': navActiv[k] ? null : 'true' }) + '>' + ic(k) + '</button>';
      });
      const A = D.adresa;
      h += '</div><div class="lh-ap-e-adr" data-lh-suprafata="bara_adresa"><div class="lh-ap-e-adr-edit" ' + atr({ 'data-lh-tip': A.edit.t, 'data-lh-eticheta': A.edit.e, 'aria-label': A.edit.e, 'data-lh-tinta': 'adresa' }) + '></div><div class="lh-ap-e-crumbs">' +
        '<button class="lh-ap-e-cr lh-ap-e-cr0" ' + atr({ 'data-lh-tip': A.prima.t, 'data-lh-id-mso': A.prima.id, 'aria-label': A.prima.e, 'data-lh-eticheta': A.prima.e, 'data-lh-tinta': 'adresa', 'data-lh-id': '' + A.prima.e }) + '>' + ic(M.cur === COS ? 'cos' : 'pc') + '<span aria-hidden="true">' + ic('dreapta') + '</span></button>';
      const seg = M.cur === COS ? [COS] : M.cur === PC ? [] : M.cur.split('/').filter(Boolean).map((s, k, a) => a.slice(0, k + 1).join('/') + '/');
      seg.forEach(p => { h += '<button class="lh-ap-e-cr" ' + atr({ 'data-lh-tip': 'SplitButton', 'data-lh-eticheta': nmSeg(p), 'data-lh-tinta': 'adresa', 'data-lh-id': p }) + '><span>' + esc(nmSeg(p)) + '</span><span aria-hidden="true">' + ic('dreapta') + '</span></button>'; });
      h += '</div>' + (M.editAdresa ? '<input class="lh-ap-e-adr-in" aria-label="' + esc(A.edit.e) + '" value="' + esc(M.adrTxt != null ? M.adrTxt : cuBara(M.cur)) + '">' : '') + '</div>';
      const C = D.cautare.edit, ce = sablon(C.sablon || C.e, folder, parinte);
      h += '<div class="lh-ap-e-caut" data-lh-suprafata="cautare"><div ' + atr({ 'data-lh-tip': C.t, 'data-lh-eticheta': ce, 'data-lh-tinta': 'cautare' }) + '><input class="lh-ap-e-caut-in" aria-label="' + esc(ce.trim()) + '" placeholder="' + esc(ce.trim()) + '" value="' + esc(M.cautare) + '"></div></div></div>';
      h += '<div class="lh-ap-e-sep"></div><div class="lh-ap-e-cmdw"><div class="lh-ap-e-cmd" data-lh-suprafata="bara_comenzi">';
      let x = 0;
      cb.butoane.forEach(b => {
        const ml = b.r[0] - x; x = b.r[0] + b.r[2];
        const text = b.r[2] > 60, gri = b.e in activ ? !activ[b.e] : false;
        const t = /^(Sortați|Vizualizați)$/.test(b.e) ? 'meniu_derulant' : 'bara_comenzi';
        h += '<button class="lh-ap-e-cb" style="margin-left:' + ml + 'px;width:' + b.r[2] + 'px" ' + atr({ 'data-lh-tip': b.t, 'data-lh-id-mso': b.id, 'data-lh-eticheta': b.e, 'aria-label': text ? null : b.e, title: b.e, 'data-lh-tinta': t, 'data-lh-id': b.e, 'aria-disabled': gri ? 'true' : null, 'aria-haspopup': /^(Nou|Sortați|Vizualizați|Mai multe opțiuni)$/.test(b.e) ? 'menu' : null }) + '>' +
          ic(b.e) + (text ? '<span>' + esc(b.e) + '</span>' : '') + (/^(Nou|Sortați|Vizualizați)$/.test(b.e) ? '<span aria-hidden="true">' + ic('jos') + '</span>' : '') + '</button>';
      });
      (cb.dreapta || []).forEach(b => {
        h += '<button class="lh-ap-e-cb" style="margin-left:auto;margin-right:' + (cb.r[2] - b.r[0] - b.r[2]) + 'px;width:' + b.r[2] + 'px" ' + atr({ 'data-lh-tip': b.t, 'data-lh-id-mso': b.id, 'data-lh-eticheta': b.e, title: b.e, 'data-lh-tinta': 'bara_comenzi', 'data-lh-id': b.e, 'aria-pressed': M.panouDreapta === 'examinare' ? 'true' : 'false' }) + '>' + ic(b.e) + '<span>' + esc(b.e) + '</span></button>';
      });
      h += '</div></div><div class="lh-ap-e-sep"></div><div class="lh-ap-e-corp">' + htmlPanouNav() + htmlLista() + htmlPanouDreapta() + '</div>' + htmlStare() + '<div></div>';
      return h;
    }
    function htmlPanouNav() {
      const P = D.panou_navigare, el = P.elemente || [];
      const fix = el.filter(e => !e.ascuns && e.nivel === 1 && e.in_afara_ecranului && !/^Rețea$/.test(e.e));   // Acasă, Galerie (deasupra derulării în captură)
      const pc = el.find(e => e.e && !e.ascuns && e.nivel === 1 && e.extins);
      const disc = pc ? unitatiCale() : [];
      const retea = el.find(e => e.e === 'Rețea');
      const ales = M.cur === COS ? null : M.cur;
      const nod = (eticheta, tinta, nivel, icon, aleseste, cale) => {
        const st = 51 + 8 * Math.max(0, nivel - 1);
        return '<div class="lh-ap-e-nod" ' + atr({ 'data-lh-tinta': 'arbore', 'data-lh-id': tinta, 'data-lh-selectat': aleseste, 'data-e-cale': cale }) + '>' +
          '<span class="lh-ap-e-nod-ic" style="left:' + (st - 24) + 'px">' + icon + '</span><span style="margin-left:' + st + 'px" ' + atr({ 'data-lh-tip': 'TreeItem', 'data-lh-eticheta': eticheta }) + '>' + esc(eticheta) + '</span></div>';
      };
      let h = '<div class="lh-ap-e-np' + (M.panouNav ? '' : ' lh-ap-e-ascuns') + '" data-lh-suprafata="panou_navigare" aria-label="' + esc(P.eticheta || '') + '" role="tree">';
      fix.forEach(e => { h += nod(e.e, e.e, 1, ic(e.e === 'Galerie' ? 'Galerie' : 'casa')); });
      h += '<div class="lh-ap-e-nod-sep"></div>';
      /* locurile ascunse pentru date personale (folderele contului) = folderele de lucru ale lecției, în Documente */
      h += nod(num(PARINTE), num(PARINTE), 1, ic('dosar'), ales === PARINTE, PARINTE);
      copii(PARINTE).filter(eDir).forEach(p => { h += nod(num(p), num(p), 2, ic('dosar'), ales === p, p); });
      h += '<div class="lh-ap-e-nod-sep"></div>';
      if (pc) h += nod(pc.e, pc.e, 1, ic('pc'), ales === PC, PC);
      disc.forEach(d => { const et = etichU(d); h += nod(et, et, 2, ic(stickU(d) ? 'stick' : 'disc'), ales === d, d); });
      if (retea) h += nod(retea.e, retea.e, 1, ic('Rețea'));
      return h + '</div>';
    }
    function htmlLista() {
      const Z = D.zona_continut, cols = Z.coloane || [];
      const lp = vizibile(M.cur);
      const det = M.vedere === 'Detalii' || M.vedere === 'Listă';
      let h = '<div class="lh-ap-e-cont" data-lh-suprafata="zona_continut">';
      if (det) {
        h += '<div class="lh-ap-e-antet">';
        cols.forEach(cl => {
          const s = M.sortare.col === cl.e;
          h += '<div class="lh-ap-e-col" style="width:' + cl.r[2] + 'px" ' + atr({ 'data-lh-tip': cl.t, 'data-lh-id-mso': cl.id, 'data-lh-eticheta': cl.e, 'data-lh-tinta': 'antet_coloana', 'data-lh-id': cl.e }) + '>' +
            (s ? '<span aria-hidden="true">' + ic(M.sortare.desc ? 'jos' : 'sus_sort', 'lh-ap-e-sageata') + '</span>' : '') + '<span>' + esc(cl.e) + '</span></div>';
        });
        h += '</div>';
      }
      h += '<div class="lh-ap-e-lista' + (det ? '' : ' lh-ap-e-ico') + '" data-lh-zona data-lh-tinta="lista" role="list">';
      lp.forEach(p => {
        const fel = M.cur === COS ? 'cos' : 'lista', nm = num(p);
        const ales = M.sel.indexOf(p) >= 0, taiat = M.taiat && M.clip && M.clip.indexOf(p) >= 0;
        const eti = afis(p), drv = esteU(p) || M.cur === PC;
        let nume;
        if (M.edit === p) nume = '<input class="lh-ap-e-ren" value="' + esc(eti) + '" aria-label="Nume">';
        else nume = '<span>' + esc(eti) + '</span>';
        h += '<div class="lh-ap-e-rand' + (taiat ? ' lh-ap-e-taiat' : '') + '" role="listitem" ' + atr({ 'data-lh-tip': 'ListItem', 'data-lh-eticheta': eti, 'data-lh-tinta': fel, 'data-lh-id': nm, 'data-lh-selectat': ales }) + '>' +
          '<span class="lh-ap-e-nume" data-e-nume>' + (M.casete ? '<span aria-hidden="true">' + (ales ? ic('bifa') : '<svg class="lh-ap-e-ic" viewBox="0 0 20 20" aria-hidden="true"><rect x="4" y="4" width="12" height="12" fill="none" stroke="currentColor"/></svg>') + '</span>' : '') + icFisier(p) + nume + '</span>' +
          '<span class="lh-ap-e-c1">' + (drv ? '' : esc((M.F.get(p) || {}).data || Z.data_exemplu || '')) + '</span><span class="lh-ap-e-c2">' + esc(tipText(p)) + '</span><span class="lh-ap-e-c3">' + (eDir(p) || drv ? '' : esc((M.F.get(p) || {}).marime || Z.dimensiune_exemplu || '')) + '</span></div>';
      });
      return h + '</div></div>';
    }
    function htmlPanouDreapta() {
      const P = D.panou_detalii;
      let h = '<div class="lh-ap-e-pd' + (M.panouDreapta ? '' : ' lh-ap-e-ascuns') + '" data-lh-suprafata="panou_detalii">';
      if (M.sel.length === 1 && !eDir(M.sel[0])) h += '<div aria-hidden="true">' + icFisier(M.sel[0]).replace('lh-ap-e-ic"', 'lh-ap-e-ic" style="width:96px;height:96px"') + '</div>';
      else h += '<div ' + atr({ 'data-lh-tip': P.text.t, 'data-lh-id-mso': P.text.id, 'data-lh-eticheta': P.text.e }) + '>' + esc(P.text.e) + '</div>';
      return h + '</div>';
    }
    function htmlStare() {
      const S = D.bara_stare, n = vizibile(M.cur).length;
      const cuv = M.cur === PC ? 'unități' : (S.numar.cuvant_plural || '');
      const txt = n + ' ' + cuv;   // forma la singular nu e în referință (R15-5): „1 elemente” rămâne cum ar scrie șablonul
      let h = '<div class="lh-ap-e-stare" data-lh-suprafata="bara_stare" aria-label="' + esc(S.eticheta || '') + '"><span class="lh-ap-e-nr" ' + atr({ 'data-lh-tip': S.numar.t, 'data-lh-id-mso': S.numar.id, 'data-lh-eticheta': txt }) + '>' + esc(txt) + '</span><div class="lh-ap-e-moduri" role="radiogroup">';
      (S.moduri || []).forEach(m => {
        h += '<button class="lh-ap-e-mod" role="radio" ' + atr({ 'aria-checked': M.vedere === m.e ? 'true' : 'false', 'data-lh-tip': m.t, 'data-lh-id-mso': m.id, 'aria-label': m.e, 'data-lh-eticheta': m.e, title: m.e, 'data-lh-tinta': 'bara_stare', 'data-lh-id': m.e }) + '>' + ic(m.e) + '</button>';
      });
      return h + '</div></div>';
    }
    function htmlMeniu() {
      const m = M.meniu;
      if (!m) return '';
      if (m.fel === 'cos') {
        let h = '<div class="lh-ap-e-mw" style="left:' + m.x + 'px;top:' + m.y + 'px"><div class="lh-ap-e-meniu" style="width:220px;height:44px" role="menu"><div class="lh-ap-e-cutie" style="left:0;top:0;width:220px;height:44px"></div>';
        h += '<div class="lh-ap-e-mr" style="left:6px;top:6px;width:208px;height:32px" role="menuitem" ' + atr({ 'data-lh-tinta': 'meniu', 'data-lh-id': 'Restaurare' }) + '>Restaurare</div>';
        return h + '</div></div>';
      }
      const R = D.meniuri[m.fel];
      if (!R) return '';
      const clasic = m.fel === 'meniu_fisier_clasic';
      let h = '<div class="lh-ap-e-mw' + (clasic ? ' lh-ap-e-clasic' : '') + '" style="left:' + m.x + 'px;top:' + m.y + 'px"><div class="lh-ap-e-meniu" data-lh-suprafata="' + m.fel + '" role="menu" style="width:' + R.w + 'px;height:' + R.h + 'px">';
      const cutii = m.fel === 'meniu_vizualizare' && !m.afisati ? R.cutii.slice(0, 1) : R.cutii;
      cutii.forEach(b => { h += '<div class="lh-ap-e-cutie" style="left:' + b[0] + 'px;top:' + b[1] + 'px;width:' + b[2] + 'px;height:' + b[3] + 'px"></div>'; });
      const bifat = e => (e === 'Extensii nume de fișier' && M.ext) || (e === 'Elemente ascunse' && M.ascunse) || (e === 'Casete de selectare element' && M.casete) ||
        (e === 'Vizualizare compactă' && M.compact) || (e === 'Panou de navigare' && M.panouNav) || (e === 'Panou de examinare' && M.panouDreapta === 'examinare') ||
        (e === 'Panou detalii' && M.panouDreapta === 'detalii') || (m.fel === 'meniu_vizualizare' && e === M.vedere) ||
        (m.fel === 'meniu_sortare' && (e === M.sortare.col || (e === 'Ascendent' && !M.sortare.desc) || (e === 'Descendent' && M.sortare.desc)));
      R.randuri.forEach(r => {
        if (m.fel === 'meniu_vizualizare' && !m.afisati && r.r[0] > R.cutii[0][0] + R.cutii[0][2]) return;
        if (m.fel === 'meniu_fundal' && /^Anulare /.test(r.e) && !M.istoric.length) return;
        let e = r.e;
        if (m.fel === 'meniu_fundal' && /^Anulare /.test(r.e)) e = r.e.split(' ')[0] + ' ' + (M.istoric[M.istoric.length - 1].op);
        if (r.sep) h += '<div class="lh-ap-e-ms" aria-hidden="true" style="left:' + (r.r[0] - 4) + 'px;top:' + (r.r[1] - 4) + 'px;width:' + (r.r[2] + 8) + 'px"></div>';
        const icon = r.r[3] >= 44 && r.r[2] < 80;
        h += '<div class="lh-ap-e-mr' + (icon ? ' lh-ap-e-icon' : '') + '" style="left:' + r.r[0] + 'px;top:' + r.r[1] + 'px;width:' + r.r[2] + 'px;height:' + r.r[3] + 'px" role="menuitem" ' +
          atr({ 'data-lh-tip': r.t, 'data-lh-id-mso': r.id, 'data-lh-eticheta': e, 'aria-label': icon ? e : null, title: icon ? e : null, 'data-lh-tinta': 'meniu', 'data-lh-id': e, 'aria-haspopup': r.sub ? 'menu' : null }) + '>' +
          (bifat(r.e) ? '<span aria-hidden="true">' + ic('bifa', 'lh-ap-e-b') + '</span>' : '') +
          (icon ? ic(r.e === 'Decupare' || r.e === 'Copiere' || r.e === 'Redenumire' || r.e === 'Partajați' ? r.e : 'Ștergere') : '<span>' + esc(e) + '</span>') +
          (r.sc && !clasic && !icon ? '<span class="lh-ap-e-sc">' + esc(r.sc) + '</span>' : '') + (r.sub ? '<span class="lh-ap-e-sub" aria-hidden="true">' + ic('dreapta') + '</span>' : '') + '</div>';
      });
      return h + '</div></div>';
    }
    function htmlDialog() {
      const d = M.dlg;
      if (!d) return '';
      const vert = d.butoane.length > 2;
      return '<div class="lh-ap-e-dfond"><div class="lh-ap-e-dlg" role="dialog" aria-modal="true" data-lh-suprafata="' + d.cheie + '" aria-label="' + esc(d.titlu) + '">' +
        '<div class="lh-ap-e-dlg-t">' + esc(d.titlu) + '</div><div class="lh-ap-e-dlg-q" data-lh-dialog-intrebare>' + esc(d.intrebare) + '</div>' +
        '<div class="lh-ap-e-dlg-b' + (vert ? ' lh-ap-e-vert' : '') + '">' + d.butoane.map(b => '<button class="lh-ap-e-db" ' + atr({ 'data-lh-tip': 'Button', 'data-lh-eticheta': b, 'data-lh-tinta': 'fereastra', 'data-lh-id': b }) + '>' + esc(b) + '</button>').join('') + '</div></div></div>';
    }
    let redesenez = false;
    let josNr = 0, josLaAtingere = -1, atingereSus = 0;   // E2: pointerdown-uri numărate, ultima ridicare a unei atingeri
    function deseneaza() {
      const aveaFocus = root.contains(document.activeElement);
      redesenez = true;
      const lst = root.querySelector('.lh-ap-e-cont'), sc = lst ? lst.scrollTop : 0, sl = lst ? lst.scrollLeft : 0;
      root.innerHTML = (desktop ? '<div class="lh-ap-e-desk"><div class="lh-ap-e-desk-ic" ' + atr({ 'data-lh-tinta': 'desktop', 'data-lh-id': 'Coș de reciclare', 'data-lh-selectat': M.deskSel }) + '>' + ic('cos') + '<span>Coș de reciclare</span></div></div>' : '') +
        '<div class="lh-ap-e-win" data-lh-suprafata="fereastra" aria-label="' + esc(fol() + ' - Explorer') + '">' + htmlFereastra() + htmlMeniu() + htmlDialog() + '</div>';
      const l2 = root.querySelector('.lh-ap-e-cont');
      if (l2) { l2.scrollTop = sc; l2.scrollLeft = sl; }
      redesenez = false;
      const inp = root.querySelector('.lh-ap-e-ren');
      if (inp) {
        inp.focus({ preventScroll: true });
        const v = inp.value, e = eDir(M.edit) || !M.ext || !ext(v) ? v.length : v.lastIndexOf('.');
        try { inp.setSelectionRange(0, e); } catch (x) { /* */ }
        inp.addEventListener('blur', ev => {
          if (redesenez || !M.edit) return;
          /* runda 19 (critic 15, GRAV E2): pe telefon comanda (Nou › Folder, Redenumire) rulează la pointerup, iar mousedown-ul
             de compatibilitate al ACELEIAȘI atingeri vine după el și mută focusul pe rădăcină. Fără un pointerdown nou de la
             atingere încoace, nu e „clic în altă parte”: caseta rămâne și focusul se întoarce în ea. */
          if (josNr === josLaAtingere && Date.now() - atingereSus < 800) {
            setTimeout(() => { if (inp.isConnected && M.edit && document.activeElement !== inp) inp.focus({ preventScroll: true }); }, 0);
            return;
          }
          const p0 = M.edit;
          const confirma = () => { if (M.edit !== p0 || !root.contains(inp)) return; M.edit = null; redenumeste(p0, inp.value); deseneaza(); };
          if (ev.relatedTarget) return confirma();   // focusul a plecat pe alt element (clic în listă = root.focus() din I.la.jos, Tab)
          /* runda 27 (critic 23, MINOR 4): un blur fără element-țintă vine din clicul pe un loc nefocusabil, din fereastra
             browserului părăsită SAU din gazda care își rescrie stratul (api §1, opt.incadrat: scoate rădăcina și o pune înapoi în
             aceeași funcție — Chromium trimite blur-ul la scoatere). Hotărârea se ia după ce funcția aceea s-a terminat (microtask):
             dacă rădăcina a fost scoasă / pusă în pagină între timp, e o mutare, nu un clic în altă parte — caseta rămâne cu textul
             ei și nimic nu se redenumește până la Enter (instanta.focus() pune cursorul înapoi în ea). */
          const mo = typeof MutationObserver === 'function' ? new MutationObserver(() => { /* doar takeRecords */ }) : null;
          if (mo) mo.observe(document, { childList: true, subtree: true });
          queueMicrotask(() => {
            const rec = mo ? mo.takeRecords() : [];
            if (mo) mo.disconnect();
            const atinsa = n => n === root || (n.nodeType === 1 && n.contains(root));
            const mutata = !root.isConnected || rec.some(r => [...r.removedNodes, ...r.addedNodes].some(atinsa));
            if (!mutata) return confirma();
            if (root.isConnected && M.edit === p0 && root.contains(inp) && root.contains(document.activeElement) && document.activeElement !== inp) inp.focus({ preventScroll: true });
          });
        });
        return;
      }
      const ad = root.querySelector('.lh-ap-e-adr-in');
      if (ad) { ad.focus({ preventScroll: true }); ad.select(); return; }
      if (M.cautareFocus) {
        const ci = root.querySelector('.lh-ap-e-caut-in');
        if (ci) { ci.focus({ preventScroll: true }); try { ci.setSelectionRange(ci.value.length, ci.value.length); } catch (x) { /* */ } return; }
      }
      if (M.dlg) { const b = root.querySelector('.lh-ap-e-db'); if (b && aveaFocus) b.focus({ preventScroll: true }); return; }
      if (aveaFocus && !root.contains(document.activeElement)) root.focus({ preventScroll: true });
    }

    /* runda 27 (critic 23, MINOR 2): căutarea filtrează lista fără să rescrie caseta în care scrie elevul. Înainte, fiecare literă
       redesena toată fereastra, iar caseta nouă nu mai avea istoricul de anulare: Ctrl+Z / Ctrl+Y nu mergeau (alt text decât un
       <input> obișnuit pe aceleași taste). Acum se rescriu doar lista (cu antetul) și bara de stare; caseta, cursorul și istoricul ei
       rămân. Cu un meniu, un dialog sau o redenumire deschisă se redesenează tot, ca înainte. */
    function deseneazaLista() {
      const cont = root.querySelector('.lh-ap-e-cont'), bs = root.querySelector('.lh-ap-e-stare');
      if (!cont || !bs || M.meniu || M.dlg || M.edit || M.editAdresa) { deseneaza(); return; }
      redesenez = true;
      const t = document.createElement('div');
      t.innerHTML = htmlLista(); cont.replaceWith(t.firstElementChild);
      t.innerHTML = htmlStare(); bs.replaceWith(t.firstElementChild);
      redesenez = false;
    }
    /* textul căutării vine și fără tastă: lipire, Ctrl+Z / Ctrl+Y, scrisul de pe telefon (insertText), dictarea */
    root.addEventListener('input', e => {
      const tg = e.target;
      if (!tg || !tg.classList || !tg.classList.contains('lh-ap-e-caut-in') || M.cautare === tg.value) return;
      M.cautare = tg.value; M.cautareFocus = true; deseneazaLista();
    });
    /* ce scrie elevul în caseta de adresă (calea), păstrat până la Enter / Esc: starea „bara_adresa.scris” */
    root.addEventListener('input', e => { const tg = e.target; if (tg && tg.classList && tg.classList.contains('lh-ap-e-adr-in')) M.adrTxt = tg.value; });

    /* ---------------------------------------------------------------- operațiile */
    const dialog = (cheie, titlu, intrebare, butoane, fa) => { M.dlg = { cheie, titlu, intrebare, butoane, fa }; M.dialog = { titlu, intrebare, butoane: butoane.slice(), apasat: null }; M.meniu = null; };
    function navigheaza(p, istoric) {
      if (!p || (p !== COS && p !== PC && !M.F.has(p))) return 'fara_efect';
      if (istoric !== false && p !== M.cur) { M.inapoi.push(M.cur); M.inainte.length = 0; }
      M.cur = p; M.sel = []; M.ancora = null; M.meniu = null; M.cautare = ''; M.edit = null; M.editAdresa = false; M.adrTxt = null;
      return 'navigare';
    }
    function folderNou() {
      if (M.cur === COS || M.cur === PC) return 'fara_efect';
      memoreaza('Nou');
      const n = liber(M.cur, 'Folder nou', true);
      M.F.set(M.cur + n + '/', {});
      M.sel = [M.cur + n + '/']; M.edit = M.cur + n + '/'; M.meniu = null;
      return 'folder_nou';
    }
    function copiaza_(taie) {
      if (!M.sel.length || M.cur === COS) return 'fara_efect';
      M.clip = M.sel.slice(); M.taiat = !!taie;
      return taie ? 'decupare' : 'copiere';
    }
    /* Windows (engleză): „The destination folder is a subfolder of the source folder.” — folderul nu se mută și nu se copiază
       în el însuși sau într-un subfolder al lui; nimic nu se schimbă. Prin mesajul central (I.nesimulat), cu textul Windows. */
    function subfolder() {
      I.nesimulat('Mutare sau copiere');
      const m = I.root.querySelector('[data-lh-nesimulat]:not([data-lh-tip])');
      if (m) m.textContent = 'The destination folder is a subfolder of the source folder.';
      return 'nesimulat';
    }
    function lipeste() {
      if (!M.clip || M.cur === COS || M.cur === PC) return 'fara_efect';
      const d = M.cur, surse = M.clip.filter(p => M.F.has(p));
      if (!surse.length) return 'fara_efect';
      if (surse.some(p => eDir(p) && (d === p || d.indexOf(p) === 0))) return subfolder();
      memoreaza(M.taiat ? 'Mutare' : 'Copiere');
      const noi = [];
      const pas = k => {
        if (k >= surse.length) { M.sel = noi; if (M.taiat) { M.clip = null; M.taiat = false; } return; }
        const src = surse[k], n = num(src), f = eDir(src);
        if (par(src) === d) {
          if (!M.taiat) { const nn = copie(d, n, f); copiaza(src, d + nn + (f ? '/' : '')); noi.push(d + nn + (f ? '/' : '')); }
          return pas(k + 1);
        }
        const tinta = d + n + (f ? '/' : '');
        if (M.F.has(tinta) && !f) {
          dialog('dialog.inlocuire_sau_omitere_fisiere', 'Înlocuire sau omitere fișiere', 'Destinația are deja un fișier cu numele „' + n + '”',
            ['Mai puține detalii', 'Înlocuire fișier de la destinație', 'Se omite acest fișier', 'Comparați informațiile pentru ambele fișiere'],
            b => {
              if (b === 'Mai puține detalii' || b === 'Comparați informațiile pentru ambele fișiere') return I.nesimulat(b);
              if (b === 'Înlocuire fișier de la destinație') { M.F.set(tinta, Object.assign({}, M.F.get(src))); if (M.taiat) M.F.delete(src); noi.push(tinta); }
              M.dlg = null; pas(k + 1); return 'raspuns';
            });
          return;
        }
        if (M.taiat) muta(src, tinta); else copiaza(src, tinta);
        noi.push(tinta);
        pas(k + 1);
      };
      pas(0);
      return 'lipire';
    }
    function redenumeste(p, v) {
      v = String(v || '').trim();
      if (!v || !M.F.has(p)) return 'fara_efect';
      /* runda 23 (G23-1, unghiul stare_finala_erori): Windows nu primește în nume semnele \ / : * ? " < > |. Înainte, „a/b” muta
         fișierul într-un folder inexistent (dispărea din listă), iar „x:y” devenea un nume imposibil. Avertizarea reală (balonul de
         lângă casetă) nu e în referință (R23-2): numele rămâne neschimbat și apare mesajul central (R12). */
      if (/[\\/:*?"<>|]/.test(v)) return I.nesimulat('avertizarea pentru semnele \\ / : * ? " < > | din nume');
      const f = eDir(p), n = num(p), vechiExt = ext(n);
      let nou = f || M.ext || !vechiExt ? v : v + '.' + vechiExt;
      if (nou === n) return 'fara_efect';
      const d = par(p);
      const fa = x => { memoreaza('Redenumire'); const dst = d + x + (f ? '/' : ''); muta(p, dst); M.sel = [dst]; };
      const pasul2 = () => {
        if (M.F.has(d + nou + (f ? '/' : '')) && nou.toLowerCase() !== n.toLowerCase()) {
          if (f) return I.nesimulat('Redenumire');   // dialogul pentru folder nu e în referință (R15-9)
          const pr = liber(d, nou, false);
          dialog('dialog.redenumire', 'Redenumire fișier', 'Redenumiți "' + n + '" ca "' + pr + '"?', ['Da', 'Nu'], b => { M.dlg = null; if (b === 'Da') fa(pr); return 'raspuns'; });
        } else fa(nou);
      };
      if (!f && M.ext && ext(nou) !== vechiExt) {
        dialog('dialog.redenumire', 'Redenumire', 'Dacă modificați extensia unui fișier, acesta poate deveni inutilizabil.\n\nSigur modificați extensia?', ['Da', 'Nu'],
          b => { M.dlg = null; if (b === 'Da') pasul2(); return 'raspuns'; });
        return 'redenumire';
      }
      pasul2();
      return 'redenumire';
    }
    function laCos() {
      if (M.cur === PC) return 'fara_efect';   // unitățile nu se mută în Coș
      if (!M.sel.length || M.cur === COS) return 'fara_efect';
      memoreaza('Ștergere');
      M.sel.forEach(p => { if (!M.F.has(p)) return; const v = subarbore(p).map(q => [q, M.F.get(q)]); v.forEach(x => M.F.delete(x[0])); M.cos.push({ p, v }); });
      M.sel = [];
      return 'stergere';
    }
    function stergeDefinitiv() {
      if (!M.sel.length || M.cur === COS) return 'fara_efect';
      if (M.sel.length > 1 || eDir(M.sel[0])) return I.nesimulat('Ștergere');   // folder / mai multe elemente: textul dialogului nu e în referință (R15-9)
      const p = M.sel[0];
      dialog('dialog.dinamic', 'Ștergere fișier', 'Sigur ștergeți definitiv acest fișier?', ['Da', 'Nu'], b => { M.dlg = null; if (b === 'Da') { memoreaza('Ștergere'); M.F.delete(p); M.sel = []; } return 'raspuns'; });
      return 'stergere_definitiva';
    }
    function restaureaza() {
      const ps = M.cur === COS ? M.sel : [];
      if (!ps.length) return 'fara_efect';
      memoreaza('Restaurare');
      ps.forEach(p => { const k = M.cos.findIndex(e => e.p === p); if (k < 0) return; const e = M.cos.splice(k, 1)[0]; e.v.forEach(x => M.F.set(x[0], x[1])); });
      M.sel = []; M.meniu = null;
      return 'restaurare';
    }
    function anuleaza() {
      const u = M.istoric.pop();
      if (!u) return 'fara_efect';
      M.refacere.push({ op: u.op, s: instantaneu() }); reface(u.s);
      M.sel = M.sel.filter(p => M.F.has(p)); if (M.cur !== COS && !M.F.has(M.cur)) M.cur = W;
      return 'anulare';
    }
    function refa() {
      const r = M.refacere.pop();
      if (!r) return 'fara_efect';
      M.istoric.push({ op: r.op, s: instantaneu() }); reface(r.s);
      M.sel = M.sel.filter(p => M.F.has(p));
      return 'refacere';
    }
    function deschide(p) {
      if (!p) return 'fara_efect';
      if (eDir(p)) return navigheaza(p);
      return I.nesimulat('Deschideți');
    }
    function alege(p, ev) {
      const lp = vizibile(M.cur);
      if (ev && ev.shiftKey && M.ancora && lp.indexOf(M.ancora) >= 0) {
        const a = lp.indexOf(M.ancora), b = lp.indexOf(p);
        M.sel = lp.slice(Math.min(a, b), Math.max(a, b) + 1);
      } else if (ev && (ev.ctrlKey || ev.metaKey)) {
        M.sel = M.sel.indexOf(p) >= 0 ? M.sel.filter(x => x !== p) : M.sel.concat([p]); M.ancora = p;
      } else { M.sel = [p]; M.ancora = p; }
      return 'selectare';
    }
    const caleDin = (fel, v) => {
      if (fel === 'cos') { const e = M.cos.find(x => num(x.p) === v); return e ? e.p : null; }
      if (M.cur === PC) return M.F.has(v + '/') ? v + '/' : null;
      const p = M.cur + v;
      return M.F.has(p + '/') ? p + '/' : (M.F.has(p) ? p : null);
    };
    function deschideMeniu(fel, x, y, extra) {
      const W0 = root.querySelector('.lh-ap-e-win'), rw = W0.getBoundingClientRect();
      const R = fel === 'cos' ? { w: 220, h: 44 } : D.meniuri[fel];
      if (!R) return false;
      let lx = Math.round(x - rw.left), ly = Math.round(y - rw.top);
      lx = Math.max(0, Math.min(lx, rw.width - R.w - 2));
      if (ly + R.h > rw.height) ly = Math.max(0, rw.height - R.h - 2);
      M.meniu = Object.assign({ fel, x: lx, y: ly }, extra || {});
      return true;
    }
    function subButon(nume) {
      const b = root.querySelector('[data-lh-tinta="bara_comenzi"][data-lh-id="' + nume + '"],[data-lh-tinta="meniu_derulant"][data-lh-id="' + nume + '"]');
      const r = b ? b.getBoundingClientRect() : root.getBoundingClientRect();
      return [r.left, r.bottom + 2];
    }
    function comanda(nume, ev) {
      if (M.cur === PC && /^(Decupare|Copiere|Lipire|Redenumire|Ștergere)$/.test(nume)) return 'fara_efect';
      switch (nume) {
        case 'Nou': { const [x, y] = subButon('Nou'); deschideMeniu('meniu_nou', x, y); return 'deschide_meniu'; }
        case 'Sortați': { const [x, y] = subButon('Sortați'); deschideMeniu('meniu_sortare', x, y); return 'deschide_meniu'; }
        case 'Vizualizați': { const [x, y] = subButon('Vizualizați'); deschideMeniu('meniu_vizualizare', x, y); return 'deschide_meniu'; }
        case 'Decupare': return copiaza_(true);
        case 'Copiere': return copiaza_(false);
        case 'Lipire': return lipeste();
        case 'Redenumire': if (M.sel.length === 1 && M.cur !== COS) { M.edit = M.sel[0]; return 'redenumire'; } return 'fara_efect';
        case 'Ștergere': return M.cur === COS ? I.nesimulat('Ștergere') : laCos();
        case 'Previzualizare': M.panouDreapta = M.panouDreapta === 'examinare' ? null : 'examinare'; return 'panou_examinare';
        default: return I.nesimulat(nume);
      }
    }
    function dinMeniu(e) {
      const m = M.meniu || {};
      const fel = m.fel;
      M.meniu = null;
      if (fel === 'cos') return e === 'Restaurare' ? restaureaza() : I.nesimulat(e);
      if (fel === 'meniu_nou') {
        if (e === 'Folder') return folderNou();
        return I.nesimulat(e);   // numele fișierelor noi nu sunt în referință (R15-8)
      }
      if (fel === 'meniu_sortare') {
        if (e === 'Ascendent' || e === 'Descendent') { M.sortare.desc = e === 'Descendent'; return 'sortare'; }
        if (/^(Nume|Data modificării|Tip)$/.test(e)) { M.sortare.col = e; return 'sortare'; }
        return I.nesimulat(e);
      }
      if (fel === 'meniu_vizualizare') {
        if (e === 'Afișați') { M.meniu = m; M.meniu.afisati = true; return 'deschide_meniu'; }
        if (/^(Pictograme|Listă|Detalii|Dale|Cuprins)/.test(e)) { M.vedere = e; return 'vizualizare'; }
        if (e === 'Extensii nume de fișier') { M.ext = !M.ext; return 'extensii'; }
        if (e === 'Elemente ascunse') { M.ascunse = !M.ascunse; return 'elemente_ascunse'; }
        if (e === 'Casete de selectare element') { M.casete = !M.casete; return 'casete'; }
        if (e === 'Vizualizare compactă') { M.compact = !M.compact; return 'compact'; }
        if (e === 'Panou de navigare') { M.panouNav = !M.panouNav; return 'panou_navigare'; }
        if (e === 'Panou de examinare') { M.panouDreapta = M.panouDreapta === 'examinare' ? null : 'examinare'; return 'panou_examinare'; }
        if (e === 'Panou detalii') { M.panouDreapta = M.panouDreapta === 'detalii' ? null : 'detalii'; return 'panou_detalii'; }
        return I.nesimulat(e);
      }
      if (fel === 'meniu_fisier' || fel === 'meniu_fisier_clasic') {
        if (e === 'Afișați mai multe opțiuni') { deschideMeniu('meniu_fisier_clasic', m.cx, m.cy, { cx: m.cx, cy: m.cy }); return 'deschide_meniu'; }
        if (e === 'Deschideți' || e === 'Open') return deschide(M.sel[0]);
        if (e === 'Decupare' || e === 'Copiere' || e === 'Ștergere' || e === 'Redenumire') return comanda(e);
        return I.nesimulat(e);
      }
      if (fel === 'meniu_fundal') {
        if (e === 'Nou') { deschideMeniu('meniu_nou', m.cx + (D.meniuri.meniu_fundal.w - 20), m.cy); return 'deschide_meniu'; }   // același meniu „Nou” al shell-ului (poziția submeniului: R15-6)
        if (/^Anulare /.test(e)) return anuleaza();
        return I.nesimulat(e);
      }
      return 'fara_efect';
    }

    /* ---------------------------------------------------------------- gesturile (le emite aplicatii.js; aici doar efectul) */
    I.la = {};
    I.la.jos = (ev, t) => {
      josNr++;
      /* runda 27 (MINOR 4): caseta rămasă deschisă după o mutare a rădăcinii, fără focus (gazda inactivă n-a chemat focus()):
         clicul în altă parte o confirmă, ca blur-ul pe care nu-l mai primește */
      const c0 = M.edit && root.querySelector('.lh-ap-e-ren');
      if (c0 && document.activeElement !== c0 && !(ev.target && ev.target.closest && ev.target.closest('.lh-ap-e-ren'))) { const p = M.edit; M.edit = null; redenumeste(p, c0.value); deseneaza(); }
      if (!(ev.target && ev.target.closest && ev.target.closest('input'))) try { root.focus({ preventScroll: true }); } catch (x) { /* */ }
      if (ev.target && ev.target.closest && ev.target.closest('.lh-ap-e-ren')) return null;   // în caseta de nume: cursorul / selecția textului, nu tragere
      const m = /^(lista):(.+)$/.exec(t || '');
      if (m) {
        const p = caleDin('lista', m[2]);
        const peNume = !!(ev.target.closest && ev.target.closest('[data-e-nume]'));
        if (p && (peNume || M.sel.indexOf(p) >= 0)) return 'tragere';
        return 'selectie';
      }
      if (t === 'lista') return 'selectie';
      return null;
    };
    let cadru = null;
    I.la.misca = (e, j) => {
      if (j.fel !== 'selectie') return;
      const z = root.querySelector('.lh-ap-e-lista');
      if (!z) return;
      const zr = z.getBoundingClientRect();
      const x0 = Math.min(j.x, e.clientX), y0 = Math.min(j.y, e.clientY), x1 = Math.max(j.x, e.clientX), y1 = Math.max(j.y, e.clientY);
      if (!cadru) { cadru = document.createElement('div'); cadru.className = 'lh-ap-e-cadru'; cadru.setAttribute('aria-hidden', 'true'); z.appendChild(cadru); }
      Object.assign(cadru.style, { left: (x0 - zr.left + z.scrollLeft) + 'px', top: (y0 - zr.top + z.scrollTop) + 'px', width: (x1 - x0) + 'px', height: (y1 - y0) + 'px' });
      [...z.querySelectorAll('.lh-ap-e-rand')].forEach(r => {
        const b = r.getBoundingClientRect(), in_ = b.right > x0 && b.left < x1 && b.bottom > y0 && b.top < y1;
        if (in_) r.setAttribute('data-lh-selectat', ''); else r.removeAttribute('data-lh-selectat');
      });
    };
    I.la.sus = (e, j, g) => {
      if (cadru) { cadru.remove(); cadru = null; }
      if (e && e.pointerType && e.pointerType !== 'mouse') { atingereSus = Date.now(); josLaAtingere = josNr; }
      if (M.edit && j && j.tinta0 && j.tinta0.closest && j.tinta0.closest('.lh-ap-e-ren')) return g ? 'fara_efect' : null;
      if (!g) return null;
      if (g === 'selectie') {
        const z = root.querySelector('.lh-ap-e-lista');
        M.sel = z ? [...z.querySelectorAll('.lh-ap-e-rand[data-lh-selectat]')].map(r => caleDin(r.getAttribute('data-lh-tinta'), r.getAttribute('data-lh-id'))).filter(Boolean) : [];
        deseneaza();
        return 'selectie';
      }
      /* tragerea: elementul (sau selecția) se mută în folderul de sub cursor (rând de folder, nod din panou, Coș) */
      const m = /^lista:(.+)$/.exec(j.t || '');
      const p0 = m && caleDin('lista', m[1]);
      if (!p0) return 'fara_efect';
      if (M.sel.indexOf(p0) < 0) { M.sel = [p0]; }
      const sub = document.elementFromPoint(e.clientX, e.clientY);
      const tg = sub && sub.closest && sub.closest('[data-lh-tinta]');
      let dst = null;
      if (tg && root.contains(tg)) {
        const f = tg.getAttribute('data-lh-tinta'), v = tg.getAttribute('data-lh-id');
        if (f === 'lista') { const q = caleDin('lista', v); if (q && eDir(q)) dst = q; }
        else if (f === 'arbore') dst = tg.getAttribute('data-e-cale') || null;
        else if (f === 'desktop') { const a = laCos(); deseneaza(); return a; }
      }
      if (!dst || M.sel.indexOf(dst) >= 0) { deseneaza(); return 'fara_efect'; }
      if (M.sel.some(p => eDir(p) && dst.indexOf(p) === 0)) { deseneaza(); return subfolder(); }
      const clip = M.clip, taiat = M.taiat, cur = M.cur;
      M.clip = M.sel.slice(); M.taiat = !(e.ctrlKey); M.cur = dst;
      const a = lipeste();
      M.cur = cur; if (!M.dlg) { M.clip = clip; M.taiat = taiat; }
      deseneaza();
      return a === 'lipire' ? (e.ctrlKey ? 'copiere' : 'mutare') : a;
    };
    I.la.clic = (t, ev, n, g) => {
      t = t || '';
      const i = t.indexOf(':'), fel = i < 0 ? t : t.slice(0, i), v = i < 0 ? '' : t.slice(i + 1);
      let a = 'fara_efect';
      /* clicul / atingerea ÎN caseta de nume mută doar cursorul: fără redesenare (ar pune înapoi numele vechi peste ce s-a scris) */
      if (M.edit && ev && ev.target && ev.target.closest && ev.target.closest('.lh-ap-e-ren')) return 'fara_efect';
      /* runda 27 (G27-1, găsit la proba MINOR 4): clicul care confirmă redenumirea redesenează lista chiar în pointerdown; acțiunea
         implicită a lui mousedown cade pe rândul vechi, scos din pagină, iar browserul mută focusul pe <body>: Delete / F2 / Ctrl+C
         de după clic nu mai ajungeau la Explorer. Clicul a fost în Explorer, deci focusul rămâne al lui (I.la.jos îl pusese deja). */
      if (!document.activeElement || document.activeElement === document.body) try { root.focus({ preventScroll: true }); } catch (x) { /* */ }
      if (M.edit && fel !== 'lista') { const p = M.edit; M.edit = null; redenumeste(p, (root.querySelector('.lh-ap-e-ren') || {}).value); }
      if (fel !== 'adresa' && M.editAdresa) M.editAdresa = false;
      if (fel !== 'cautare') M.cautareFocus = false;
      if (M.dlg) {
        if (fel === 'fereastra') { const d = M.dlg; M.dialog.apasat = v; a = d.fa(v) || 'raspuns'; deseneaza(); return a; }
        return 'fara_efect';
      }
      if (fel !== 'desktop') M.deskSel = false;
      if (M.meniu && fel !== 'meniu') { M.meniu = null; if (fel === 'lista' && !v) { deseneaza(); return 'inchide_meniu'; } }
      switch (fel) {
        case 'meniu': a = dinMeniu(v); break;
        case 'lista': if (v) { const p = caleDin('lista', v); if (p) a = n >= 2 ? 'selectare' : alege(p, ev); } else if (!(ev.ctrlKey || ev.shiftKey)) { M.sel = []; a = 'deselectare'; } break;
        case 'cos': { const p = caleDin('cos', v); if (p) a = alege(p, ev); break; }
        case 'arbore': {
          const nd = root.querySelector('[data-lh-tinta="arbore"][data-lh-id="' + CSS.escape(v) + '"]');
          const p = nd && nd.getAttribute('data-e-cale');
          a = p ? navigheaza(p) : I.nesimulat(v);
          break;
        }
        case 'nav':
          if (v === 'inapoi' && M.inapoi.length) { M.inainte.push(M.cur); a = navigheaza(M.inapoi.pop(), false); }
          else if (v === 'inainte' && M.inainte.length) { M.inapoi.push(M.cur); a = navigheaza(M.inainte.pop(), false); }
          else if (v === 'sus' && esteU(M.cur)) a = navigheaza(PC);
          else if (v === 'sus') a = M.cur === COS ? 'fara_efect' : (par(M.cur) ? navigheaza(par(M.cur)) : I.nesimulat(ev && ev.target && ev.target.closest('[data-lh-eticheta]') ? ev.target.closest('[data-lh-eticheta]').getAttribute('data-lh-eticheta') : 'sus'));
          else if (v === 'reimprospatare') a = 'reimprospatare';
          break;
        case 'adresa':
          if (v === D.adresa.prima.e) a = navigheaza(PC);
          else if (v) a = navigheaza(v);
          else { M.editAdresa = true; M.adrTxt = null; a = 'editare_adresa'; }
          break;
        case 'cautare': M.cautareFocus = true; a = 'cautare'; break;
        case 'bara_comenzi': case 'meniu_derulant':
          a = (root.querySelector('[data-lh-tinta="' + fel + '"][data-lh-id="' + CSS.escape(v) + '"][aria-disabled="true"]')) ? 'fara_efect' : comanda(v, ev);
          break;
        case 'antet_coloana': if (M.sortare.col === v) M.sortare.desc = !M.sortare.desc; else { M.sortare.col = v; M.sortare.desc = false; } a = /^(Nume|Data modificării|Tip|Dimensiune)$/.test(v) ? 'sortare' : 'fara_efect'; break;
        case 'bara_stare': if (v) { M.vedere = v; a = 'vizualizare'; } break;
        case 'desktop': M.deskSel = true; M.sel = []; a = 'selectare'; break;
        case 'fila': a = 'fara_efect'; break;
        case 'bara_titlu': a = I.nesimulat(v); break;
        default: a = 'clic';
      }
      deseneaza();
      return a;
    };
    I.la.dublu = t => {
      t = t || '';
      let a = 'fara_efect';
      const i = t.indexOf(':'), fel = i < 0 ? t : t.slice(0, i), v = i < 0 ? '' : t.slice(i + 1);
      if (fel === 'desktop' && v === 'Coș de reciclare') a = navigheaza(COS);
      else if (fel === 'lista' && v) a = deschide(caleDin('lista', v));
      else if (fel === 'cos' && v) a = I.nesimulat('Deschideți');
      else if (fel === 'arbore') a = 'navigare';
      deseneaza();
      return a;
    };
    I.la.dreapta = (t, e) => {
      t = t || '';
      const i = t.indexOf(':'), fel = i < 0 ? t : t.slice(0, i), v = i < 0 ? '' : t.slice(i + 1);
      if (M.dlg) return 'fara_efect';
      M.editAdresa = false;
      let a = 'meniu_contextual';
      if (fel === 'lista' && v) {
        const p = caleDin('lista', v);
        if (p && M.sel.indexOf(p) < 0) { M.sel = [p]; M.ancora = p; }
        deschideMeniu('meniu_fisier', e.clientX, e.clientY, { cx: e.clientX, cy: e.clientY });
      } else if (fel === 'cos' && v) {
        const p = caleDin('cos', v);
        if (p && M.sel.indexOf(p) < 0) M.sel = [p];
        deschideMeniu('cos', e.clientX, e.clientY);
      } else if (fel === 'lista' || (e.target && e.target.closest && e.target.closest('.lh-ap-e-lista'))) {
        M.sel = [];
        deschideMeniu('meniu_fundal', e.clientX, e.clientY, { cx: e.clientX, cy: e.clientY });
      } else { M.meniu = null; a = 'fara_efect'; }
      deseneaza();
      return a;
    };
    I.la.tasta = (e, g, inCamp) => {
      const tg = e.target;
      I.tintaTasta = M.sel.length ? (M.cur === COS ? 'cos:' : 'lista:') + num(M.sel[0]) : 'lista';
      if (inCamp) {
        if (tg.classList.contains('lh-ap-e-ren')) {
          I.tintaTasta = 'lista:' + num(M.edit || '');
          if (e.key === 'Enter') { e.preventDefault(); const p = M.edit; M.edit = null; const a = redenumeste(p, tg.value); deseneaza(); return a; }
          if (e.key === 'Escape') { e.preventDefault(); M.edit = null; deseneaza(); return 'anulare_redenumire'; }
          return null;
        }
        if (tg.classList.contains('lh-ap-e-adr-in')) {
          I.tintaTasta = 'adresa';
          if (e.key === 'Enter') {
            e.preventDefault();
            const v = tg.value.trim().replace(/\\/g, '/').replace(/\/?$/, '/');
            /* Windows: „Acest PC” = rădăcina; altfel potrivire exactă (E:\Excursie), apoi după sfârșitul căii (regula veche) */
            const p = /^(acest pc|this pc)\/$/i.test(v) ? PC : ([...M.F.keys()].find(q => eDir(q) && q === v) || [...M.F.keys()].find(q => eDir(q) && (q.toLowerCase().endsWith('/' + v.toLowerCase()) || q.toLowerCase() === v.toLowerCase())));
            M.editAdresa = false;
            const a = p ? navigheaza(p) : 'fara_efect';
            deseneaza(); return a;
          }
          if (e.key === 'Escape') { e.preventDefault(); M.editAdresa = false; deseneaza(); return 'fara_efect'; }
          return null;
        }
        if (tg.classList.contains('lh-ap-e-caut-in')) {
          I.tintaTasta = 'cautare';
          if (e.key === 'Escape') { e.preventDefault(); M.cautare = ''; M.cautareFocus = false; deseneaza(); return 'fara_efect'; }
          setTimeout(() => { if (root.isConnected && tg.isConnected && M.cautare !== tg.value) { M.cautare = tg.value; M.cautareFocus = true; deseneazaLista(); } }, 0);
          return 'cautare';
        }
        return null;
      }
      if (M.dlg) {
        I.tintaTasta = 'fereastra:' + (document.activeElement && document.activeElement.getAttribute('data-lh-id') || M.dlg.butoane[0]);
        if (g === 'tasta_tab') { e.preventDefault(); return I.tabFereastra(root.querySelector('.lh-ap-e-dlg'), e.shiftKey); }
        if (g === 'tasta_enter') {
          e.preventDefault();
          const b = document.activeElement && document.activeElement.closest && document.activeElement.closest('.lh-ap-e-db');
          const v = b ? b.getAttribute('data-lh-id') : M.dlg.butoane.find(x => x === 'Da') || M.dlg.butoane[1] || M.dlg.butoane[0];
          I.activat = 'fereastra:' + v;
          const d = M.dlg; M.dialog.apasat = v; const a = d.fa(v) || 'raspuns'; deseneaza(); return a;
        }
        if (g === 'tasta_esc') { const d = M.dlg; const v = d.butoane.indexOf('Nu') >= 0 ? 'Nu' : 'Se omite acest fișier'; M.dialog.apasat = v; d.fa(v); M.dlg = null; deseneaza(); return 'raspuns'; }
        return 'fara_efect';
      }
      if (M.meniu) {
        if (g === 'tasta_esc') { M.meniu = null; deseneaza(); return 'inchide_meniu'; }
        if (g !== 'sageti' && g !== 'tasta_enter') { M.meniu = null; }
      }
      const lp = vizibile(M.cur);
      let a = null;
      switch (g) {
        case 'ctrl_c': a = copiaza_(false); break;
        case 'ctrl_x': a = copiaza_(true); break;
        case 'ctrl_v': a = lipeste(); break;
        case 'ctrl_a': M.sel = lp.slice(); a = 'selectare_tot'; break;
        case 'ctrl_z': a = anuleaza(); break;
        case 'ctrl_y': a = refa(); break;
        case 'ctrl_d': a = laCos(); break;
        case 'ctrl_shift_n': a = folderNou(); break;
        case 'ctrl_e': case 'ctrl_f': M.cautareFocus = true; a = 'cautare'; break;
        case 'ctrl_l': M.editAdresa = true; M.adrTxt = null; a = 'editare_adresa'; break;
        case 'tasta_f4': M.editAdresa = true; M.adrTxt = null; a = 'editare_adresa'; break;
        case 'tasta_f5': a = 'reimprospatare'; break;
        case 'tasta_f2': if (M.sel.length === 1 && M.cur !== COS) { M.edit = M.sel[0]; a = 'redenumire'; } else a = 'fara_efect'; break;
        case 'tasta_delete': a = e.shiftKey ? stergeDefinitiv() : (M.cur === COS ? I.nesimulat('Ștergere') : laCos()); break;
        /* Alt+Enter = Proprietăți (uia_explorer.json › explorer_meniu_fisier / _fundal › „Proprietăți”, scurtatura „Alt+Enter”),
           nu deschidere; fereastra nu e simulată → mesajul central, ca din meniu (runda 19, critic 15 MINOR 10) */
        case 'tasta_enter': a = e.altKey ? I.nesimulat('Proprietăți') : (M.sel.length ? deschide(M.sel[0]) : 'fara_efect'); break;
        /* Ctrl+Shift+C = „Copiere ca o cale” (explorer_meniu_fisier, scurtatura „Ctrl+Shift+C”): ca din meniu, nu tace */
        case 'ctrl_shift_c': a = M.sel.length && M.cur !== COS ? I.nesimulat('Copiere ca o cale') : 'fara_efect'; break;
        case 'tasta_backspace': if (M.inapoi.length) { M.inainte.push(M.cur); a = navigheaza(M.inapoi.pop(), false); } else a = 'fara_efect'; break;
        case 'alt_sageti':
          if (e.key === 'ArrowLeft' && M.inapoi.length) { M.inainte.push(M.cur); a = navigheaza(M.inapoi.pop(), false); }
          else if (e.key === 'ArrowRight' && M.inainte.length) { M.inapoi.push(M.cur); a = navigheaza(M.inainte.pop(), false); }
          else if (e.key === 'ArrowUp' && M.cur !== COS && par(M.cur)) a = navigheaza(par(M.cur));
          else a = 'fara_efect';
          break;
        case 'sageti': case 'tasta_home_end': {
          if (!lp.length) { a = 'fara_efect'; break; }
          let k = M.sel.length ? lp.indexOf(M.sel[M.sel.length - 1]) : -1;
          if (e.key === 'Home') k = 0; else if (e.key === 'End') k = lp.length - 1;
          else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') k = Math.min(lp.length - 1, k + 1);
          else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') k = Math.max(0, k - 1);
          a = alege(lp[k], e.shiftKey ? e : null) && 'mutare_selectie';
          break;
        }
        case 'tastare': {
          const ch = e.key.toLowerCase(), k = lp.findIndex(p => afis(p).toLowerCase().startsWith(ch));
          if (k >= 0) { M.sel = [lp[k]]; M.ancora = lp[k]; a = 'cautare_rapida'; } else a = 'fara_efect';
          break;
        }
        case 'tasta_esc': M.sel = []; a = 'deselectare'; break;
        default: a = 'fara_efect';
      }
      I.tintaTasta = M.sel.length ? (M.cur === COS ? 'cos:' : 'lista:') + num(M.sel[0]) : I.tintaTasta;
      deseneaza();
      return a;
    };
    I.la.fereastra = () => root.querySelector('.lh-ap-e-dlg');
    /* runda 27 (MINOR 4): cu redenumirea deschisă, focusul cerut de gazdă (după mutarea rădăcinii) se întoarce în caseta de nume */
    I.focus = () => { try { const c = M.edit && root.querySelector('.lh-ap-e-ren'); (c || root).focus({ preventScroll: true }); } catch (e) { /* */ } };

    /* plasa oracolelor (CONVENTIE_ARBORE.md §4.6): deschide o suprafață fără gest */
    I.deschideSuprafata = cheie => {
      const r = root.getBoundingClientRect();
      if (['fereastra', 'file_fereastra', 'butoane_navigare', 'bara_adresa', 'cautare', 'bara_comenzi', 'zona_continut', 'bara_stare'].indexOf(cheie) >= 0) return true;
      if (cheie === 'panou_navigare') { M.panouNav = true; deseneaza(); return true; }
      if (cheie === 'panou_detalii') { M.panouDreapta = 'examinare'; M.sel = []; deseneaza(); return true; }
      if (cheie === 'meniu_nou') { comanda('Nou'); deseneaza(); return true; }
      if (cheie === 'meniu_sortare') { comanda('Sortați'); deseneaza(); return true; }
      if (cheie === 'meniu_vizualizare') { comanda('Vizualizați'); M.meniu.afisati = true; deseneaza(); return true; }
      if (cheie === 'meniu_fisier' || cheie === 'meniu_fisier_clasic') {
        const lp = vizibile(M.cur);
        if (!lp.length) return false;
        M.sel = [lp[0]];
        deschideMeniu(cheie, r.left + 300, r.top + 140, { cx: r.left + 300, cy: r.top + 140 });
        deseneaza(); return true;
      }
      if (cheie === 'meniu_fundal') { M.sel = []; deschideMeniu(cheie, r.left + 420, r.top + 180, { cx: r.left + 420, cy: r.top + 180 }); deseneaza(); return true; }
      return false;
    };
    if (typeof ResizeObserver === 'function') {
      I._ro = new ResizeObserver(() => { if (!root.isConnected) return; const w = root.getBoundingClientRect().width; root.classList.toggle('lh-ap-e-ingust', w < 700); });
      I._ro.observe(root);
    }
    I.distruge = () => { if (I._ro) try { I._ro.disconnect(); } catch (e) { /* */ } };
    /* A22-1: montat într-o fereastră străină, Explorer-ul își oprește evenimentele în rădăcina lui (după ce ascultătorii bibliotecii
       de pe ea le-au tratat), ca gazda să nu le mai trateze o dată. Ce prinde gazda ÎNAINTE (captura ei de pointerdown, pointerup
       pe window) nu se poate opri de aici: paza comună e în runde/23/propunere_comun_A22-1.md. */
    if (incadrat) ['click', 'dblclick', 'auxclick', 'contextmenu', 'wheel', 'keydown', 'keyup', 'keypress', 'pointerdown', 'pointermove',
      'pointerup', 'mousedown', 'mouseup', 'touchstart', 'touchmove', 'touchend', 'input', 'beforeinput', 'dragstart', 'dragover', 'drop']
      .forEach(t => root.addEventListener(t, e => e.stopPropagation(), t === 'wheel' || /^touch/.test(t) ? { passive: true } : false));
    deseneaza();
  }

  L._modul('explorer', {
    creeaza,
    /* O5 › tragere (§4.4): rândul ales întâi (clic pe el), ca tragerea să-l mute, nu să deseneze dreptunghiul de selecție */
    demonstratie: {}
  });
})();
