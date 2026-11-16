/* lectii/_sim/scratch-compozitie.js — SimScratchCompozitie 1.1 (10.11.2026; 1.0 din 09.11): COMPOZIȚIA în Scratch 3, simulată în pagină:
   scena cu mai multe personaje și un decor, lista personajelor (dalele), panoul de sub scenă (Personaj, x, y, Arată,
   Dimensiune, Direcția), tragerea pe scenă (mouse și deget), meniul dalei (duplică · exportă · șterge), coșul de pe dala
   selectată, „Alege un personaj” (o bibliotecă mică) și câteva blocuri din Aspect, rulate cu un clic în paletă.

   PROPRIETAR: lecția VI/30 (lectii/vi/m5-l30, „Editarea compoziției și a proprietăților obiectelor”). Granița:
   _campaign/revizuire_completa_2026_09/m5_noapte_08_11/granite/vi_l30.md. Fișier SINGUR: NU încarcă și NU schimbă
   scratch.js (blocurile se desenează aici, cu CSS; deci nici defectul de 21,8 px al lui scratch.js la 390 px nu apare
   aici). Nu definește blocuri în SimScratch, deci se poate pune pe aceeași pagină cu scratch.js și extensiile lui; nu
   s-a probat împreună cu scratch-animatie.js / scratch-gestiune.js (nu e nevoie). Prefix CSS: `sco-`.

   FIDELITATEA — probat în editorul VIU scratch.mit.edu (Chromium headless, profil temporar, fără cont, 09.11.2026:
   lectii/vi/m5-l30/_proba/live_vi30.py, live_vi30b.py, live_vi30c.py, live_vi30d.py → live_vi30*.json):
     - panoul: „Personaj” (numele), „x”, „y”, „Arată” cu două butoane („Afișează personajul”, „Ascunde personajul”),
       „Dimensiune”, „Direcția”; după încărcarea unui proiect e selectat primul personaj;
     - Dimensiune: 1000 → 540 la pisică, 0 și −20 → 5 (limitele: cel puțin 5 px, cel mult 1,5 × scena; formula de mai
       jos dă exact 539,78 și 5,25 pentru pisică); „2a”, „abc”, „150,5” → nimic (rămâne valoarea de dinainte); x 400 → 272;
     - x și y scrise în panou NU schimbă stratul; un personaj TRAS pe scenă devine selectat și vine în față; un clic
       fără mutare nu-l selectează; un personaj ascuns nu se poate apuca de pe scenă;
     - blocurile (paleta Aspect): „modifică mărimea cu 10”, „setează mărimea la 100 %”, „arată”, „ascunde”,
       „mergi la stratul [în față ▾]” (în față / înapoi), „mergi [înainte ▾] 1 straturi” (înainte / înapoi); apăsate în
       paletă, lucrează pe personajul selectat; „înapoi” = în spatele tuturor personajelor (decorul rămâne mereu în spate);
     - dala: clic dreapta → „duplică · exportă · șterge”; copia se numește „Copac2”, apare într-un loc la întâmplare,
       CHIAR în spatele originalului, și e selectată; ștergerea (din meniu sau cu coșul de pe dala selectată, al cărui
       nume ascuns e „Delete”) întreabă „Ești sigur că vrei să ștergi acest personaj?” (în română) cu butoanele „yes” / „no” (în engleză);
       după „yes”, e selectat alt personaj; meniul Editează are apoi „Anulează ștergere personaj”;
     - „Alege un personaj” → lista „Alege un personaj” (Înapoi, categorii, Abby, Amon, Andie, …, Apple, Arrow1, …);
       personajul ales apare într-un loc la întâmplare (Apple: −12, 3 și −3, −50), în față, selectat; al doilea: Apple2.
   1.1 (10.11.2026, repararea după judecata 1 a lecției VI/30; probe: lectii/vi/m5-l30/_proba/r1_live*.py, r1_probe.py):
     - căsuțele (panoul și numerele blocurilor) au inputmode="text": pe iPhone, tastatura numerică n-are minus (ghidul F3);
     - touchend oprit pe scenă (ghidul F4): după o tragere rapidă cu degetul, atingerea următoare nu se mai pierde;
     - căsuța goală + Enter: x, y, Direcția devin 0, Dimensiune rămâne (ca în Scratch: j1_live L2, r1_live E);
     - clicul pe numărul unui BLOC îl selectează întreg (ca în Scratch, r1_live BF); în panou, clicul pune doar cursorul;
     - blocul „setează efectul [culoare ▾] la 0” (lista întreagă a lui Scratch); se desenează doar „fantomă”: 0-100,
       150 → 100, -20 → 0; cu 100 personajul nu se vede și nu se apucă de pe scenă, dar Arată rămâne pe ochiul deschis
       (r1_live3 T_*); efectul NU intră în proiectul salvat și „Stop” îl anulează (aici nu există Stop);
     - mesajul unui test care aruncă o eroare (personaj șters) devine „Lipsește un personaj … Ia-o de la capăt”.
   ABATERI (în nota de sub simulator sau în surse.md al lecției):
     - unde se suprapun două personaje, aici se apucă mereu cel care SE VEDE; în Scratch, tragerea pornită pe copacul din
       față a mutat uneori pisica din spatele lui (judecata 1, j1_live L5: în 2 din 3 puncte; de ce, nu se știe);
     - din lista efectelor se desenează doar „fantomă” (celelalte spun „Aici, în pagină, se vede doar efectul fantomă.”);
     - pisica și obiectele din bibliotecă sunt desenate mai simplu; biblioteca are 4 personaje, fără categorii;
     - butonul „Alege un personaj” are numele scris (în Scratch e rotund, cu o pisică; numele apare la trecerea mouse-ului);
     - Direcția se scrie doar în căsuță (în Scratch se deschide și un cerc cu săgeată); marginea scenei e aproximată
       (±1 unitate) și nu ține seama de rotire; „exportă” doar spune ce face; „Anulează ștergere personaj” nu e aici;
     - pe telefon, meniul dalei se deschide ținând degetul pe dală (~0,6 s);
     - paleta are doar blocurile de azi, iar categoriile nu sunt desenate.

   API (window.SimScratchCompozitie) — stabil de la 09.11.2026; o schimbare se trece în graniță, cu ora:
     versiune · DESENE (desen → {w, h, cx, cy, svg}) · BIBLIOTECA ([nume, desen]) · stil()
     creeaza(el, o) → inst. o = {personaje: [{id, n?, desen, x, y, size?:100, vis?:true, dir?:90, fantoma?:0}] (ordinea dalelor),
         ordine?: [id…] (straturile, din spate în față; implicit ordinea dalelor), sel?: id (implicit primul),
         paleta?: ['marime_mod','marime_set','arata','ascunde','strat','straturi','efect' (1.1)], meniu?: true (meniul dalei + coșul),
         biblioteca?: false, nota?: text}
       inst: .stare() → S · .aplica(st) · .on(fn) (la orice schimbare) · .element
     S = {p: {id: {id, n, desen, x, y, size, vis, dir, fantoma}}, ordine: [id…] (spate → față), dale: [id…], sel, nume: [n…],
          strat(id) → 0 = cel mai din spate, -1 = nu există, inFata(a, b) → bool, cate(desen) → câte personaje cu desenul,
          dupaNume(n) → personajul cu numele n sau null, raspunsuri: {…} (doar în tipul `compozitie`)}
     aplica(st): st = {p?: {id: {x?, y?, size?, vis?, dir?, n?}}, ordine?: [id…], sterge?: [id…],
                       adauga?: [{id, n, desen, x, y, size?}], sel?: id}
     tipuri.compozitie (în `tipuri` din JocMotor.porneste) — Q = câmpurile lui creeaza + teste: [{ce, msg (text sau
         funcție S → text), ok(S)}] + solutie (st pentru aplica; + raspunsuri) + gresit (st) + intrebari?: {q, variante:
         [text…], randuri: [{id, t, ok}]} (câte o listă pe rând; S.raspunsuri[id] = textul ales). „Rulează testele”;
         după 2 încercări, „Arată-mi răspunsul” pune soluția. Sub simulator, „Ia-o de la capăt” pune înapoi compoziția de început.
*/
(function () {
  'use strict';
  if (window.SimScratchCompozitie) return;
  const VERSIUNE = '1.1 (10.11.2026)';

  /* ---- desenele (ale autorului, făcute cu cod; copacul, mingea și decorul sunt aceleași ca în compozitie-de-aranjat.sb3) ---- */
  const DESENE = {
    pisica: {w: 95.2, h: 100.04, cx: 48, cy: 50, svg: '<g stroke="#8a5300" stroke-width="2.5" stroke-linejoin="round"><path d="M24 66Q6 60 10 40" fill="none" stroke="#F7A21B" stroke-width="7" stroke-linecap="round"/><path d="M28 72Q22 94 32 97h8l3-20z" fill="#F7A21B"/><ellipse cx="46" cy="70" rx="24" ry="16" fill="#F7A21B"/><path d="M54 80l2 17h9l-2-19z" fill="#F7A21B"/><path d="M45 30l2-23 13 14zM70 21l12-16 2 25z" fill="#F7A21B"/><ellipse cx="65" cy="38" rx="25" ry="20" fill="#F7A21B"/><ellipse cx="70" cy="47" rx="12" ry="7" fill="#fff" stroke="none"/><circle cx="60" cy="33" r="4.5" fill="#fff"/><circle cx="75" cy="33" r="4.5" fill="#fff"/><circle cx="61.5" cy="33.5" r="2" fill="#222" stroke="none"/><circle cx="76.5" cy="33.5" r="2" fill="#222" stroke="none"/></g>'},
    copac: {w: 160, h: 200, cx: 80, cy: 100, svg: '<rect x="68" y="118" width="24" height="82" rx="4" fill="#8B5A2B" stroke="#5E3A17" stroke-width="3"/><ellipse cx="80" cy="75" rx="76" ry="70" fill="#3E9B47" stroke="#22662B" stroke-width="4"/><circle cx="52" cy="62" r="14" fill="#5DBB63"/><circle cx="104" cy="88" r="11" fill="#5DBB63"/>'},
    minge: {w: 50, h: 50, cx: 25, cy: 25, svg: '<circle cx="25" cy="25" r="22" fill="#E63946" stroke="#9B1D27" stroke-width="3"/><path d="M5 22Q25 34 45 22" fill="none" stroke="#fff" stroke-width="4"/>'},
    apple: {w: 64, h: 70, cx: 32, cy: 38, svg: '<path d="M32 20C14 8 2 24 6 42c4 20 16 28 26 24 10 4 22-4 26-24 4-18-8-34-26-22z" fill="#E0242B" stroke="#8E1116" stroke-width="3"/><path d="M32 20c0-8 2-13 6-17" fill="none" stroke="#5E3A17" stroke-width="3"/><path d="M36 10c6-6 14-6 18-2-6 6-12 6-18 2z" fill="#3E9B47"/>'},
    arrow1: {w: 90, h: 50, cx: 45, cy: 25, svg: '<path d="M4 18h52V4l30 21-30 21V32H4z" fill="#4C97FF" stroke="#2D6BC4" stroke-width="3" stroke-linejoin="round"/>'},
    ball: {w: 50, h: 50, cx: 25, cy: 25, svg: '<circle cx="25" cy="25" r="22" fill="#FFC21A" stroke="#C78A00" stroke-width="3"/><path d="M5 18c12 6 28 6 40 0M5 32c12-6 28-6 40 0" fill="none" stroke="#C78A00" stroke-width="3"/>'},
    bananas: {w: 80, h: 64, cx: 40, cy: 32, svg: '<path d="M8 20c10 30 44 40 66 22-24 6-46-2-58-26z" fill="#FFE14D" stroke="#B58F00" stroke-width="3" stroke-linejoin="round"/><path d="M12 14c16 24 46 30 62 12-22 2-42-6-54-22z" fill="#FFD21A" stroke="#B58F00" stroke-width="3" stroke-linejoin="round"/><path d="M8 20l-4-6 8-2" fill="#6B4F00"/>'}
  };
  const DECOR = '<rect x="-240" y="-180" width="480" height="360" fill="#BFE6FF"/><circle cx="170" cy="-120" r="30" fill="#FFD84D"/><path d="M-240 50Q-120 20 0 45T240 40V180H-240Z" fill="#8FD16F"/>';
  const BIBLIOTECA = [['Apple', 'apple'], ['Arrow1', 'arrow1'], ['Ball', 'ball'], ['Bananas', 'bananas']];
  const BLOCURI = {
    marime_mod: {t: 'modifică mărimea cu [n:10]'},
    marime_set: {t: 'setează mărimea la [n:100] %'},
    arata: {t: 'arată'},
    ascunde: {t: 'ascunde'},
    strat: {t: 'mergi la stratul [m:în față|înapoi]'},
    straturi: {t: 'mergi [m:înainte|înapoi] [n:1] straturi'},
    /* 1.1: lista întreagă, ca în Scratch (r1_live3 T_lista_efecte); aici se desenează doar „fantomă” */
    efect: {t: 'setează efectul [m:culoare|ochi de pește|vârtej|pixelare|mozaic|strălucire|fantomă] la [n:0]'}
  };
  const NOTA = 'Aici pisica și obiectele sunt desenate mai simplu. În Scratch, butonul Alege un personaj e rotund, cu o pisică. Pe telefon, meniul unei dale îl deschizi ținând degetul pe ea.';
  const OCHI = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3.2" fill="currentColor"/></svg>';
  const OCHI_T = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3.2" fill="currentColor"/><path d="M4 20 20 4" stroke="currentColor" stroke-width="2.2"/></svg>';
  const COS = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 7h14l-1.2 13H6.2zM9 7V4h6v3M3 7h18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg>';
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));

  function stil() {
    if (document.getElementById('sco-css')) return;
    const s = document.createElement('style');
    s.id = 'sco-css';
    s.textContent = `
.sco{--scom:#855CD6;font:400 13px/1.3 "Helvetica Neue","Segoe UI",Arial,sans-serif;color:#575E75;background:#E9F1FC;border:1px solid #D9E3F2;border-radius:10px;padding:8px;position:relative;max-width:100%;box-sizing:border-box}
.sco *{box-sizing:border-box}
.sco-st{display:grid;grid-template-columns:minmax(0,1fr);gap:8px}
.sco.cu-pal .sco-st{grid-template-columns:minmax(150px,230px) minmax(0,1fr)}
@media (max-width:640px){.sco.cu-pal .sco-st{grid-template-columns:minmax(0,1fr)}.sco-pal{order:2}}
.sco-dr{min-width:0;display:flex;flex-direction:column;gap:8px}
.sco-scena{display:block;width:100%;max-width:480px;aspect-ratio:4/3;height:auto;background:#fff;border:1px solid #C9D4E5;border-radius:8px;touch-action:none;user-select:none;-webkit-user-select:none}
.sco-p{cursor:grab}.sco-p.trage{cursor:grabbing}
.sco-hit{opacity:0;pointer-events:none}
@media (pointer:coarse){.sco-hit *{pointer-events:stroke;stroke-width:16px;vector-effect:non-scaling-stroke}}
.sco-p.sco-f100 *{pointer-events:none!important}
.sco-panou{background:#fff;border:1px solid #D9E3F2;border-radius:8px;padding:6px 8px;display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center}
.sco-panou label,.sco-panou .sco-ar{display:inline-flex;align-items:center;gap:5px;font-weight:600;font-size:12px;white-space:nowrap}
.sco-panou input{font:inherit;font-size:13px;color:#575E75;height:34px;border:1px solid #C9D4E5;border-radius:17px;padding:0 10px;text-align:center;background:#fff;min-width:0}
.sco-panou input[data-c="n"]{width:104px;text-align:left}
.sco-panou input[data-c="x"],.sco-panou input[data-c="y"]{width:56px}
.sco-panou input[data-c="size"],.sco-panou input[data-c="dir"]{width:60px}
.sco-panou input:focus{outline:2px solid var(--scom);outline-offset:1px}
.sco-ochi{display:inline-flex;border:1px solid #C9D4E5;border-radius:6px;overflow:hidden}
.sco-ochi button{width:36px;height:34px;border:0;background:#fff;color:#8A93A8;display:grid;place-items:center;cursor:pointer;touch-action:manipulation}
.sco-ochi button[aria-pressed="true"]{background:#E6DDF8;color:var(--scom)}
.sco-dale{display:flex;flex-wrap:wrap;gap:6px;align-items:flex-start;background:#fff;border:1px solid #D9E3F2;border-radius:8px;padding:6px;min-height:84px}
.sco-dala{position:relative;width:72px;min-height:68px;border:2px solid #D9E3F2;border-radius:8px;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:4px 2px;cursor:pointer;font-size:11px;font-weight:600;touch-action:manipulation;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}
.sco-dala>svg{width:40px;height:34px;display:block;pointer-events:none}
.sco-dala span{max-width:66px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;pointer-events:none}
.sco-dala[aria-pressed="true"]{border-color:var(--scom);background:var(--scom);color:#fff}
.sco-dala[aria-pressed="true"]>svg{background:#fff;border-radius:5px}
.sco-cos svg{width:16px;height:16px;pointer-events:none}
.sco-cos{position:absolute;top:-10px;right:-10px;width:32px;height:32px;border-radius:50%;border:2px solid #fff;background:var(--scom);color:#fff;display:grid;place-items:center;cursor:pointer;padding:0}
.sco-alege{min-height:44px;padding:4px 10px;border-radius:22px;border:2px solid #6A47B8;background:var(--scom);color:#fff;font:600 12px "Helvetica Neue","Segoe UI",Arial,sans-serif;cursor:pointer;align-self:center;touch-action:manipulation}
.sco-pal{background:#F9F9F9;border:1px solid #D9E3F2;border-radius:8px;padding:6px;display:flex;flex-direction:column;gap:8px;align-content:flex-start;min-width:0}
.sco-pal .lbl{font-weight:700;color:#575E75}
.sco-b{display:inline-flex;flex-wrap:wrap;align-items:center;gap:4px;align-self:flex-start;max-width:100%;min-height:40px;padding:4px 8px;border-radius:6px;background:#9966FF;border:1px solid #774DCB;color:#fff;font-weight:600;font-size:12px;cursor:pointer;touch-action:manipulation;user-select:none;-webkit-user-select:none}
.sco-b.ruleaza{box-shadow:0 0 0 3px #FFD500}
.sco-b input{width:44px;height:32px;border-radius:16px;border:0;text-align:center;font:600 12px "Helvetica Neue","Segoe UI",Arial,sans-serif;color:#575E75;background:#fff}
.sco-b select{height:32px;border-radius:16px;border:1px solid #6A47B8;background:#774DCB;color:#fff;font:600 12px "Helvetica Neue","Segoe UI",Arial,sans-serif;padding:0 6px}
.sco-nota{font-size:12px;color:#55607A;margin-top:6px}
.sco-msg{font-size:12.5px;color:#4B2F96;margin-top:4px;min-height:1em}
.sco-meniu{position:absolute;z-index:40;background:#fff;border:1px solid #C9D4E5;border-radius:6px;box-shadow:0 4px 14px rgba(0,0,0,.18);display:flex;flex-direction:column;min-width:140px;overflow:hidden}
.sco-meniu button{min-height:40px;border:0;background:#fff;text-align:left;padding:0 14px;font:600 13px "Helvetica Neue","Segoe UI",Arial,sans-serif;color:#575E75;cursor:pointer}
.sco-meniu button:hover,.sco-meniu button:focus{background:#E9F1FC}
.sco-meniu button.sco-rosu{color:#C2262E;border-top:1px solid #D9E3F2}
.sco-fer{position:absolute;inset:0;z-index:45;background:rgba(40,30,70,.25);display:flex;align-items:center;justify-content:center;border-radius:10px}
.sco-fer>div{background:var(--scom);color:#fff;border-radius:10px;padding:14px;max-width:300px;text-align:center;font:600 15px "Helvetica Neue","Segoe UI",Arial,sans-serif}
.sco-fer .bt{display:flex;gap:8px;justify-content:center;margin-top:12px}
.sco-fer button{min-width:96px;min-height:44px;border-radius:22px;border:0;background:#fff;color:var(--scom);font:700 14px "Helvetica Neue","Segoe UI",Arial,sans-serif;cursor:pointer}
.sco-bib{position:absolute;inset:0;z-index:42;background:#E9F1FC;border-radius:10px;display:flex;flex-direction:column;overflow:auto}
.sco-bibcap{display:flex;align-items:center;gap:10px;background:var(--scom);color:#fff;padding:6px 10px;position:sticky;top:0}
.sco-bibcap b{flex:1;text-align:center}
.sco-bibcap button{min-height:36px;min-width:64px;background:transparent;color:#fff;border:1px solid rgba(255,255,255,.6);border-radius:6px;font:600 13px "Helvetica Neue","Segoe UI",Arial,sans-serif;cursor:pointer}
.sco-grila{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:8px;padding:10px}
.sco-grila button{background:#fff;border:2px solid #D9E3F2;border-radius:8px;padding:6px;cursor:pointer;font:600 12px "Helvetica Neue","Segoe UI",Arial,sans-serif;color:#575E75;display:flex;flex-direction:column;align-items:center;gap:4px;min-height:84px}
.sco-grila svg{width:56px;height:48px}
.sco-tst{margin-top:8px;background:var(--paper,#fff);border:1px solid var(--line,#DDD3EE);border-radius:8px;padding:8px 10px}
.sco-tst .lbl{font-weight:800;font-size:.76rem;color:var(--ink2,#55607A);text-transform:uppercase;letter-spacing:.04em;margin:0 0 6px}
.sco-tst ol{margin:0;padding:0;list-style:none}
.sco-tst li{display:flex;gap:8px;padding:3px 0;font-size:.92rem;line-height:1.35;color:var(--ink,#231B33)}
.sco-tst li.ok .s{color:var(--ok,#1E7A46)}.sco-tst li.no .s{color:var(--bad,#B8362E)}
.sco-tst .m{display:block;color:var(--bad,#B8362E);font-size:.86rem}
.sco-reset{margin-top:6px;min-height:36px;padding:4px 12px;border-radius:8px;border:1px solid var(--line,#C9D4E5);background:var(--paper,#fff);color:var(--ink,#231B33);font:600 13px var(--fb,"Segoe UI",Arial,sans-serif);cursor:pointer}
.sco-intr{margin-top:8px;background:var(--paper,#fff);border:1px solid var(--line,#DDD3EE);border-radius:8px;padding:8px 10px;color:var(--ink,#231B33)}
.sco-intr .rand{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;padding:4px 0}
.sco-intr select{min-height:36px;font:inherit;border-radius:6px;border:1px solid var(--line,#C9D4E5);background:var(--paper,#fff);color:var(--ink,#231B33);max-width:100%}
`;
    document.head.appendChild(s);
  }

  /* ---- reguli din Scratch (probate) ---- */
  function limiteMarime(d) {
    return [100 * Math.max(5 / d.w, 5 / d.h), 100 * Math.min(720 / d.w, 540 / d.h)];
  }
  function gard(p, x, y) {
    const d = DESENE[p.desen], s = p.size / 100;
    const st = d.cx * s, dr = (d.w - d.cx) * s, sus = d.cy * s, jos = (d.h - d.cy) * s;
    const ins = Math.min(15, Math.floor(Math.min(d.w * s, d.h * s) / 2));
    const xmax = Math.floor(240 - ins + st - 1), xmin = Math.ceil(-240 + ins - dr + 1);
    const ymax = Math.floor(180 - ins + jos), ymin = Math.ceil(-180 + ins - sus + 1);
    return [Math.min(xmax, Math.max(xmin, x)), Math.min(ymax, Math.max(ymin, y))];
  }
  const NUMAR = /^\s*[+-]?\d+(\.\d+)?\s*$/;
  const r2 = (v) => Math.round(v * 100) / 100;

  function mini(desen) {
    const d = DESENE[desen];
    return `<svg viewBox="${-4} ${-4} ${d.w + 8} ${d.h + 8}" aria-hidden="true">${d.svg}</svg>`;
  }

  function creeaza(el, o) {
    stil();
    o = o || {};
    const P = {};
    let dale = [], ordine = [], sel = null;
    const asc = [];
    let drag = null, meniuDeschis = null, apasLung = null, lungLa = 0;
    const root = document.createElement('div');
    root.className = 'sco' + (o.paleta && o.paleta.length ? ' cu-pal' : '');
    el.innerHTML = '';
    el.appendChild(root);

    function incarca(lista, ord, s) {
      Object.keys(P).forEach(k => delete P[k]);
      dale = []; ordine = [];
      (lista || []).forEach(q => {
        P[q.id] = {id: q.id, n: q.n || q.id, desen: q.desen, x: q.x || 0, y: q.y || 0, size: q.size == null ? 100 : q.size, vis: q.vis !== false, dir: q.dir == null ? 90 : q.dir, fantoma: q.fantoma || 0};
        dale.push(q.id);
      });
      ordine = (ord && ord.length ? ord.filter(i => P[i]) : dale.slice());
      dale.forEach(i => { if (!ordine.includes(i)) ordine.push(i); });
      sel = s && P[s] ? s : dale[0] || null;
    }
    incarca(o.personaje, o.ordine, o.sel);

    const pal = (o.paleta || []).filter(b => BLOCURI[b]);
    root.innerHTML = `<div class="sco-st">${pal.length ? `<div class="sco-pal" aria-label="Paleta Aspect"><div class="lbl">Aspect</div>${pal.map(b => bloc(b)).join('')}</div>` : ''}
<div class="sco-dr"><svg class="sco-scena" viewBox="-240 -180 480 360" role="img" aria-label="Scena"><g class="sco-decor" pointer-events="none">${DECOR}</g><g class="sco-pers"></g></svg>
<div class="sco-panou" role="group" aria-label="Panoul personajului selectat">
<label>Personaj <input data-c="n" autocomplete="off" aria-label="Personaj"></label>
<label>↔ x <input data-c="x" inputmode="text" autocomplete="off" aria-label="x"></label>
<label>↕ y <input data-c="y" inputmode="text" autocomplete="off" aria-label="y"></label>
<span class="sco-ar">Arată <span class="sco-ochi"><button type="button" data-vis="1" aria-label="Afișează personajul" title="Afișează personajul">${OCHI}</button><button type="button" data-vis="0" aria-label="Ascunde personajul" title="Ascunde personajul">${OCHI_T}</button></span></span>
<label>Dimensiune <input data-c="size" inputmode="text" autocomplete="off" aria-label="Dimensiune"></label>
<label>Direcția <input data-c="dir" inputmode="text" autocomplete="off" aria-label="Direcția"></label>
</div>
<div class="sco-dale" role="group" aria-label="Personajele"></div></div></div>
<div class="sco-msg" aria-live="polite"></div>
<div class="sco-nota">${esc(o.nota || NOTA)}</div>`;
    const $ = (q) => root.querySelector(q);
    const svg = $('.sco-scena'), grp = $('.sco-pers'), panou = $('.sco-panou'), cutie = $('.sco-dale'), msg = $('.sco-msg');

    function bloc(id) {
      const parti = BLOCURI[id].t.split(/(\[[nm]:[^\]]*\])/).filter(Boolean).map(p => {
        const m = /^\[([nm]):([^\]]*)\]$/.exec(p);
        if (!m) return `<span>${esc(p.trim())}</span>`;
        if (m[1] === 'n') return `<input value="${esc(m[2])}" inputmode="text" aria-label="număr" autocomplete="off">`;
        return `<select aria-label="alege">${m[2].split('|').map(v => `<option>${esc(v)}</option>`).join('')}</select>`;
      }).join('');
      return `<div class="sco-b" role="button" tabindex="0" data-b="${id}" aria-label="${esc(BLOCURI[id].t.replace(/\[[nm]:([^\]|]*)[^\]]*\]/g, '$1'))}">${parti}</div>`;
    }

    function emite(ce) { asc.forEach(f => { try { f(ce); } catch (e) { /* nimic */ } }); }
    function spune(t) { msg.textContent = t || ''; }

    function transformP(p) { const d = DESENE[p.desen]; return `translate(${r2(p.x)} ${r2(-p.y)}) rotate(${r2(p.dir - 90)}) scale(${p.size / 100}) translate(${-d.cx} ${-d.cy})`; }
    function desenP(p) {
      const d = DESENE[p.desen];
      return `<g class="sco-p" data-id="${esc(p.id)}" transform="${transformP(p)}"${p.vis ? '' : ' style="display:none"'}><rect x="0" y="0" width="${d.w}" height="${d.h}" fill="transparent" pointer-events="none"/>${d.svg}<g class="sco-hit" aria-hidden="true">${d.svg}</g></g>`;
    }
    /* 1.1: efectul fantomă = cât de mult se vede prin personaj (0 tot, 100 deloc); cu 100 nu se mai poate apuca de pe scenă,
       dar NU e ascuns: Arată rămâne pe ochiul deschis (probat viu, r1_live3 T_fantoma_100, T_trag_pisica_fantoma_100) */
    function fantoma(g, p) {
      const f = Math.max(0, Math.min(100, p.fantoma || 0));
      g.style.opacity = f ? String(r2(1 - f / 100)) : '';
      g.style.pointerEvents = f >= 100 ? 'none' : '';
      g.classList.toggle('sco-f100', f >= 100);
    }
    /* scena se REFACE pe loc: nodurile personajelor rămân aceleași (doar mutate în ordinea straturilor). Dacă le-aș înlocui,
       nodul atins cu degetul ar ieși din pagină înainte de touchend, iar prima atingere de DUPĂ tragere n-ar mai da „click”
       (probat la 390 px cu degetul: _proba/dbg_tragere.py). */
    function deseneazaScena() {
      const vechi = {};
      grp.querySelectorAll('.sco-p').forEach(g => { vechi[g.dataset.id] = g; });
      ordine.forEach(i => {
        const p = P[i];
        let g = vechi[i];
        if (g && g.dataset.d !== p.desen) { g.remove(); g = null; }
        if (!g) { const t = document.createElementNS('http://www.w3.org/2000/svg', 'g'); t.innerHTML = desenP(p); g = t.firstElementChild; g.dataset.d = p.desen; }
        delete vechi[i];
        g.setAttribute('transform', transformP(p));
        g.style.display = p.vis ? '' : 'none';
        fantoma(g, p);
        g.classList.remove('trage');
        if (grp.lastElementChild !== g) grp.appendChild(g);
      });
      Object.values(vechi).forEach(g => g.remove());
      /* ordinea: appendChild pe rând, în ordinea straturilor */
      ordine.forEach(i => { const g = grp.querySelector(`.sco-p[data-id="${CSS.escape(i)}"]`); if (g) grp.appendChild(g); });
    }
    function deseneazaPanou() {
      const p = P[sel];
      panou.querySelectorAll('input').forEach(i => {
        i.disabled = !p;
        if (document.activeElement === i) return;
        const c = i.dataset.c;
        i.value = !p ? '' : c === 'n' ? p.n : String(Math.round(p[c]));
      });
      panou.querySelectorAll('[data-vis]').forEach(b => { b.setAttribute('aria-pressed', p && (b.dataset.vis === '1') === p.vis ? 'true' : 'false'); b.disabled = !p; });
    }
    function deseneazaDale() {
      cutie.innerHTML = dale.map(i => `<div class="sco-dala" role="button" tabindex="0" data-id="${esc(i)}" aria-pressed="${i === sel}" aria-label="${esc(P[i].n)}">${mini(P[i].desen)}<span>${esc(P[i].n)}</span>${i === sel && o.meniu !== false ? `<button type="button" class="sco-cos" aria-label="Delete" title="Delete">${COS}</button>` : ''}</div>`).join('') +
        (o.biblioteca ? '<button type="button" class="sco-alege" aria-label="Alege un personaj">Alege un personaj</button>' : '');
    }
    function tot() { deseneazaScena(); deseneazaPanou(); deseneazaDale(); }

    function selecteaza(id) { if (P[id] && sel !== id) { sel = id; deseneazaPanou(); deseneazaDale(); } }
    function inFata(id) { ordine = ordine.filter(i => i !== id); ordine.push(id); }
    function inSpate(id) { ordine = ordine.filter(i => i !== id); ordine.unshift(id); }
    function muta(id, k) {
      const i = ordine.indexOf(id); if (i < 0) return;
      const j = Math.max(0, Math.min(ordine.length - 1, i + k));
      ordine.splice(i, 1); ordine.splice(j, 0, id);
    }
    function marime(p, v) { const [mn, mx] = limiteMarime(DESENE[p.desen]); p.size = r2(Math.min(mx, Math.max(mn, v))); const g = gard(p, p.x, p.y); p.x = g[0]; p.y = g[1]; }
    function numeLiber(baza) { let k = 2; const ex = new Set(Object.values(P).map(p => p.n)); while (ex.has(baza + k)) k++; return baza + k; }
    function idLiber(baza) { let k = 2; while (P[baza + k]) k++; return baza + k; }

    /* ---- panoul ---- */
    function scrie(i) {
      const p = P[sel]; if (!p) return;
      const c = i.dataset.c, v = i.value;
      if (c === 'n') {
        const t = v.trim();
        if (t && t !== p.n) p.n = Object.values(P).some(q => q !== p && q.n === t) ? numeLiber(t.replace(/\d+$/, '')) : t;
      } else if (NUMAR.test(v) || (!v.trim() && c !== 'size')) {
        /* căsuța goală + Enter: x, y, Direcția devin 0; Dimensiune rămâne cum era (probat viu: j1_live L2, r1_live E) */
        const n = v.trim() ? parseFloat(v) : 0;
        if (c === 'x' || c === 'y') { const g = gard(p, c === 'x' ? n : p.x, c === 'y' ? n : p.y); p.x = g[0]; p.y = g[1]; }
        else if (c === 'size') marime(p, n);
        else if (c === 'dir') { let d = ((n + 180) % 360 + 360) % 360 - 180; if (d === -180) d = 180; p.dir = d; }
      }
      tot(); emite('panou');
    }
    panou.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.matches('input')) { e.preventDefault(); const i = e.target, v = i.value; i.blur(); if (i.value === v && document.activeElement !== i) scrie(i); } });
    panou.addEventListener('change', (e) => { if (e.target.matches('input')) scrie(e.target); });
    panou.addEventListener('click', (e) => {
      const b = e.target.closest('[data-vis]'); if (!b || !P[sel]) return;
      P[sel].vis = b.dataset.vis === '1'; tot(); emite('arata');
    });

    /* ---- scena: tragerea (mouse și deget) ---- */
    function pct(e) {
      const m = svg.getScreenCTM(); if (!m) return {x: 0, y: 0};
      const q = svg.createSVGPoint(); q.x = e.clientX; q.y = e.clientY;
      const r = q.matrixTransform(m.inverse());
      return {x: r.x, y: -r.y};
    }
    svg.addEventListener('pointerdown', (e) => {
      inchideMeniu();
      /* o căsuță a panoului rămasă cu cursorul în ea se închide (ca în Scratch, unde clicul pe scenă o confirmă): cu degetul,
         touchend-ul oprit mai jos n-ar mai muta focusul */
      if (document.activeElement && panou.contains(document.activeElement)) document.activeElement.blur();
      let g = e.target.closest && e.target.closest('.sco-p'); if (!g) return; if (e.target.closest('.sco-hit')) { const v = document.elementsFromPoint(e.clientX, e.clientY).find(n => n.closest && n.closest('.sco-p') && !n.closest('.sco-hit')); if (v) g = v.closest('.sco-p'); }
      if (e.pointerType === 'mouse') e.preventDefault();   /* cu degetul, nu (touch-action:none ajunge): altfel prima atingere de după tragere nu dă „click” (probat, _proba/dbg_tragere.py) */
      const id = g.dataset.id, p = P[id], q = pct(e);
      drag = {id, x0: p.x, y0: p.y, dx: q.x - p.x, dy: q.y - p.y, cx: e.clientX, cy: e.clientY, mutat: false, pid: e.pointerId};
      try { svg.setPointerCapture(e.pointerId); } catch (x) { /* nimic */ }
    });
    svg.addEventListener('pointermove', (e) => {
      if (!drag || e.pointerId !== drag.pid) return;
      if (!drag.mutat) {
        if (Math.hypot(e.clientX - drag.cx, e.clientY - drag.cy) < 4) return;
        drag.mutat = true; sel = drag.id; inFata(drag.id); deseneazaPanou(); deseneazaDale();
        /* elementul atins rămâne același (mutat la capăt = în față): dacă l-aș redesena, prima atingere de DUPĂ tragere
           nu mai dădea „click” (probat cu degetul la 390 px, _proba/dbg_tragere.py) */
        const g0 = grp.querySelector(`.sco-p[data-id="${CSS.escape(drag.id)}"]`);
        if (g0) { grp.appendChild(g0); g0.classList.add('trage'); }
      }
      const q = pct(e), p = P[drag.id];
      p.x = r2(q.x - drag.dx); p.y = r2(q.y - drag.dy);
      const g = grp.querySelector(`.sco-p[data-id="${CSS.escape(drag.id)}"]`);
      if (g) g.setAttribute('transform', transformP(p));
      deseneazaPanou();
    });
    function gata(e) {
      if (!drag || (e && e.pointerId !== drag.pid)) return;
      const d = drag; drag = null;
      if (!d.mutat) return;
      const p = P[d.id], r = svg.getBoundingClientRect();
      const afara = e && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom);
      if (afara) { p.x = d.x0; p.y = d.y0; } else { const g = gard(p, Math.round(p.x), Math.round(p.y)); p.x = g[0]; p.y = g[1]; }
      tot(); emite('tras');
    }
    svg.addEventListener('pointerup', gata);
    svg.addEventListener('pointercancel', (e) => { if (drag) { const d = drag; drag = null; if (d.mutat) { P[d.id].x = d.x0; P[d.id].y = d.y0; tot(); } } });
    /* 1.1 (R1, judecata 1, D): degetul ridicat DIN MERS lăsa o „aruncare” (fling) care înghițea atingerea următoare, oriunde
       (dală, căsuță, „Rulează testele”: 12 din 12). Remediul din ghid (III.3 F4): preventDefault pe touchend-ul scenei
       (scena nu folosește „click”). Probat: _proba/r1_probe.py, D (pe 1.0 se pierd, pe 1.1 nu). */
    svg.addEventListener('touchend', (e) => { if (e.cancelable) e.preventDefault(); }, {passive: false});
    /* touchend singur NU a ajuns (r1_probe D: 22 din 24 pierdute): oprim și touchstart-ul pornit pe un personaj (ghidul F4:
       „fără preventDefault pe touchstart” lasă aruncarea), ca Chromium să nu mai pornească gestul care înghite atingerea */
    svg.addEventListener('touchstart', (e) => { if (e.cancelable && e.target.closest && e.target.closest('.sco-p')) e.preventDefault(); }, {passive: false});

    /* ---- dalele: selectare, meniul (clic dreapta / deget ținut), coșul ---- */
    function inchideMeniu() { if (meniuDeschis) { meniuDeschis.remove(); meniuDeschis = null; } }
    function deschideMeniu(id, x, y) {
      inchideMeniu();
      selecteaza(id);
      const m = document.createElement('div');
      m.className = 'sco-meniu'; m.setAttribute('role', 'menu');
      m.innerHTML = '<button type="button" role="menuitem" data-a="dup">duplică</button><button type="button" role="menuitem" data-a="exp">exportă</button><button type="button" role="menuitem" data-a="del" class="sco-rosu">șterge</button>';
      const rr = root.getBoundingClientRect();
      m.style.left = Math.max(4, Math.min(rr.width - 150, x - rr.left)) + 'px';
      m.style.top = Math.max(4, y - rr.top) + 'px';
      root.appendChild(m); meniuDeschis = m;
      m.addEventListener('click', (e) => {
        const b = e.target.closest('button'); if (!b) return;
        inchideMeniu();
        if (b.dataset.a === 'dup') duplica(id);
        else if (b.dataset.a === 'exp') spune('„exportă” descarcă personajul ca fișier, pe calculator. Aici nu face nimic.');
        else intreabaSterge(id);
      });
      m.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); inchideMeniu(); } });
      const b0 = m.querySelector('button'); if (b0) b0.focus();
    }
    function duplica(id) {
      const p = P[id]; if (!p) return;
      const nid = idLiber(id), nn = numeLiber(p.n.replace(/\d+$/, ''));
      const q = Object.assign({}, p, {id: nid, n: nn, x: r2(Math.random() * 200 - 100), y: r2(Math.random() * 150 - 75)});
      const g = gard(q, q.x, q.y); q.x = g[0]; q.y = g[1];
      P[nid] = q; dale.push(nid);
      const i = ordine.indexOf(id); ordine.splice(i, 0, nid);   /* chiar în spatele originalului (probat) */
      sel = nid; tot(); emite('duplica');
    }
    function intreabaSterge(id) {
      const f = document.createElement('div');
      f.className = 'sco-fer';
      f.innerHTML = '<div role="dialog" aria-modal="true" aria-label="Ștergere">Ești sigur că vrei să ștergi acest personaj?<div class="bt"><button type="button" data-r="1">yes</button><button type="button" data-r="0">no</button></div></div>';
      root.appendChild(f);
      f.addEventListener('click', (e) => {
        const b = e.target.closest('button[data-r]'); if (!b) return;
        f.remove();
        if (b.dataset.r === '1') sterge(id);
      });
      f.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); f.remove(); } });
      const b1 = f.querySelector('button[data-r="0"]'); if (b1) b1.focus();
    }
    function sterge(id) {
      if (!P[id]) return;
      const k = dale.indexOf(id);
      delete P[id]; dale = dale.filter(i => i !== id); ordine = ordine.filter(i => i !== id);
      if (sel === id) sel = dale[Math.max(0, k - 1)] || null;
      tot(); emite('sterge');
    }
    cutie.addEventListener('click', (e) => {
      if (e.target.closest('.sco-alege')) { deschideBib(); return; }
      const cos = e.target.closest('.sco-cos');
      const d = e.target.closest('.sco-dala'); if (!d) return;
      if (Date.now() - lungLa < 900) return;   /* ridicarea degetului după meniul deschis prin apăsare lungă */
      if (cos) { intreabaSterge(d.dataset.id); return; }
      inchideMeniu(); selecteaza(d.dataset.id); emite('selectat');
    });
    cutie.addEventListener('keydown', (e) => {
      const d = e.target.closest('.sco-dala'); if (!d || e.target.closest('.sco-cos')) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selecteaza(d.dataset.id); emite('selectat'); const n = cutie.querySelector(`.sco-dala[data-id="${CSS.escape(d.dataset.id)}"]`); if (n) n.focus(); }
      if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) { e.preventDefault(); const r = d.getBoundingClientRect(); deschideMeniu(d.dataset.id, r.left + 10, r.bottom); }
    });
    cutie.addEventListener('contextmenu', (e) => {
      const d = e.target.closest('.sco-dala'); if (!d || o.meniu === false) return;
      e.preventDefault(); if (Date.now() - lungLa < 900) return; if (e.pointerType && e.pointerType !== 'mouse') lungLa = Date.now(); deschideMeniu(d.dataset.id, e.clientX, e.clientY);
    });
    cutie.addEventListener('pointerdown', (e) => {
      const d = e.target.closest('.sco-dala'); if (!d || e.pointerType === 'mouse' || o.meniu === false || e.target.closest('.sco-cos')) return;
      const x = e.clientX, y = e.clientY;
      clearTimeout(apasLung);
      apasLung = setTimeout(() => { lungLa = Date.now(); deschideMeniu(d.dataset.id, x, y); }, 600);
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => cutie.addEventListener(t, () => clearTimeout(apasLung)));
    document.addEventListener('pointerdown', (e) => { if (meniuDeschis && !meniuDeschis.contains(e.target)) inchideMeniu(); }, true);

    /* ---- biblioteca ---- */
    function deschideBib() {
      inchideMeniu();
      const b = document.createElement('div');
      b.className = 'sco-bib';
      b.innerHTML = `<div class="sco-bibcap"><button type="button" class="sco-inapoi">Înapoi</button><b>Alege un personaj</b><span style="width:64px"></span></div><div class="sco-grila">${BIBLIOTECA.map(([n, d]) => `<button type="button" data-d="${d}" data-n="${n}">${mini(d)}<span>${n}</span></button>`).join('')}</div>`;
      root.appendChild(b);
      b.addEventListener('click', (e) => {
        if (e.target.closest('.sco-inapoi')) { b.remove(); return; }
        const x = e.target.closest('button[data-d]'); if (!x) return;
        b.remove(); adauga(x.dataset.n, x.dataset.d);
      });
      b.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); b.remove(); } });
      const f = b.querySelector('.sco-inapoi'); if (f) f.focus();
    }
    function adauga(n, desen) {
      const id = P[n] ? idLiber(n) : n, nn = Object.values(P).some(p => p.n === n) ? numeLiber(n) : n;
      const q = {id, n: nn, desen, x: Math.floor(Math.random() * 200 - 100), y: Math.floor(Math.random() * 100 - 50), size: 100, vis: true, dir: 90};
      P[id] = q; dale.push(id); ordine.push(id); sel = id; tot(); emite('adauga');
    }

    /* ---- paleta: clic pe bloc = rulează pe personajul selectat ---- */
    const palEl = $('.sco-pal');
    function ruleaza(b) {
      const p = P[sel]; if (!p) return;
      spune('');
      const id = b.dataset.b, nr = [...b.querySelectorAll('input')].map(i => parseFloat(i.value) || 0), al = [...b.querySelectorAll('select')].map(s => s.value);
      if (id === 'marime_mod') marime(p, p.size + nr[0]);
      else if (id === 'marime_set') marime(p, nr[0]);
      else if (id === 'arata') p.vis = true;
      else if (id === 'ascunde') p.vis = false;
      else if (id === 'strat') { if (al[0] === 'înapoi') inSpate(sel); else inFata(sel); }
      else if (id === 'straturi') muta(sel, (al[0] === 'înapoi' ? -1 : 1) * Math.round(nr[0]));
      else if (id === 'efect') {
        /* Scratch: fantomă între 0 și 100 (150 → 100, -20 → 0; r1_live3 T_limita_*) */
        if (al[0] === 'fantomă') p.fantoma = Math.max(0, Math.min(100, nr[0]));
        else spune('Aici, în pagină, se vede doar efectul fantomă.');
      }
      b.classList.add('ruleaza'); setTimeout(() => b.classList.remove('ruleaza'), 350);
      tot(); emite('bloc');
    }
    if (palEl) {
      palEl.addEventListener('click', (e) => { const b = e.target.closest('.sco-b'); if (!b || e.target.closest('input,select')) return; ruleaza(b); });
      palEl.addEventListener('keydown', (e) => { const b = e.target.closest('.sco-b'); if (b && e.target === b && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); ruleaza(b); } });
      palEl.addEventListener('input', (e) => { if (e.target.matches('input')) { const v = e.target.value.replace(/[^0-9.\-]/g, ''); if (v !== e.target.value) e.target.value = v; } });
      /* 1.1: clicul pe numărul unui BLOC îl selectează întreg (probat viu, r1_live BF: „10” → selecția 0-2), spre deosebire de
         căsuțele panoului, unde clicul pune doar cursorul */
      const selTot = (e) => { if (e.target.matches('input')) setTimeout(() => { try { e.target.select(); } catch (x) { /* nimic */ } }, 0); };
      palEl.addEventListener('focusin', selTot);
      palEl.addEventListener('pointerup', (e) => { if (e.target.matches('input') && e.target.dataset.sel !== '1') { e.target.dataset.sel = '1'; selTot(e); } });
      palEl.addEventListener('focusout', (e) => { if (e.target.matches('input')) delete e.target.dataset.sel; });
    }

    const inst = {
      element: root,
      stare() {
        const p = {};
        Object.values(P).forEach(q => { p[q.id] = Object.assign({}, q); });
        const ord = ordine.slice();
        return {p, ordine: ord, dale: dale.slice(), sel, nume: dale.map(i => P[i].n),
          strat: (id) => ord.indexOf(id), inFata: (a, b) => ord.indexOf(a) > ord.indexOf(b) && ord.indexOf(b) >= 0,
          cate: (d) => Object.values(p).filter(q => q.desen === d).length,
          dupaNume: (n) => Object.values(p).find(q => q.n === n) || null};
      },
      aplica(st) {
        if (!st) return;
        if (st.reset) incarca(o.personaje, o.ordine, o.sel);
        (st.sterge || []).forEach(id => { if (P[id]) { delete P[id]; dale = dale.filter(i => i !== id); ordine = ordine.filter(i => i !== id); } });
        (st.adauga || []).forEach(q => { if (!P[q.id]) { P[q.id] = Object.assign({size: 100, vis: true, dir: 90}, q, {n: q.n || q.id}); dale.push(q.id); ordine.push(q.id); } });
        Object.entries(st.p || {}).forEach(([id, v]) => { if (P[id]) Object.assign(P[id], v); });
        if (st.ordine) { const ok = st.ordine.filter(i => P[i]); ordine.filter(i => !ok.includes(i)).forEach(i => ok.unshift(i)); ordine = ok; }
        if (st.sel && P[st.sel]) sel = st.sel; else if (!P[sel]) sel = dale[0] || null;
        tot(); emite('aplica');
      },
      reset() { incarca(o.personaje, o.ordine, o.sel); tot(); emite('reset'); },
      on(fn) { asc.push(fn); return inst; }
    };
    tot();
    return inst;
  }

  /* ---- tipul pentru motor ---- */
  /* 1.1 (R1, J): mesajul unui test nu mai poate arunca o eroare (un personaj șters din atelier lăsa caseta goală, fără
     „Arată-mi răspunsul”); dacă totuși aruncă, spune drumul sigur, „Ia-o de la capăt” */
  function mesaj(t, s) {
    try { return typeof t.msg === 'function' ? t.msg(s) : String(t.msg); }
    catch (e) { return 'Lipsește un personaj din compoziție (l-ai șters?). Apasă „Ia-o de la capăt”, sub scenă.'; }
  }
  const tipCompozitie = {
    render(Q, body, api) {
      const teste = Q.teste || [];
      const I = Q.intrebari;
      body.innerHTML = `<div class="sco-gazda"></div><button type="button" class="sco-reset">Ia-o de la capăt</button>${I ? `<div class="sco-intr"><div>${I.q || ''}</div>${I.randuri.map(r => `<div class="rand"><span>${r.t}</span><select data-r="${esc(r.id)}" aria-label="${esc(r.t.replace(/<[^>]+>/g, ''))}"><option value="">alege…</option>${I.variante.map(v => `<option>${esc(v)}</option>`).join('')}</select></div>`).join('')}</div>` : ''}${teste.length ? `<div class="sco-tst"><div class="lbl">Testele sarcinii · <span class="nr">apasă „Rulează testele”</span></div><ol>${teste.map((t, i) => `<li data-i="${i}"><span class="s">○</span><span>${t.ce}<span class="m" hidden></span></span></li>`).join('')}</ol></div>` : ''}`;
      const inst = creeaza(body.querySelector('.sco-gazda'), Q);
      body._sco = inst;
      const rasp = () => { const r = {}; body.querySelectorAll('.sco-intr select').forEach(s => { r[s.dataset.r] = s.value; }); return r; };
      const S = () => Object.assign(inst.stare(), {raspunsuri: rasp()});
      const verifica = () => {
        const s = S();
        let n = 0, prima = null;
        const rez = teste.map(t => {
          let ok = false;
          try { ok = !!t.ok(s); } catch (e) { ok = false; }
          if (ok) n++; else if (!prima) prima = mesaj(t, s);
          return ok;
        });
        return {ok: n === teste.length, n, total: teste.length, msg: prima, rez, s};
      };
      const marcheaza = (r) => {
        body.querySelectorAll('.sco-tst li').forEach((li, i) => {
          const ok = r ? r.rez[i] : null;
          li.className = ok == null ? '' : ok ? 'ok' : 'no';
          li.querySelector('.s').textContent = ok == null ? '○' : ok ? '✓' : '✗';
          const m = li.querySelector('.m');
          m.hidden = ok !== false;
          m.textContent = ok === false ? mesaj(teste[i], r.s) : '';
        });
        const nr = body.querySelector('.sco-tst .nr');
        if (nr) nr.textContent = r ? `${r.n} din ${r.total} trec` : 'apasă „Rulează testele”';
      };
      inst.on(() => marcheaza(null));
      body.querySelectorAll('.sco-intr select').forEach(s => s.addEventListener('change', () => marcheaza(null)));
      body.querySelector('.sco-reset').addEventListener('click', () => { inst.reset(); body.querySelectorAll('.sco-intr select').forEach(s => { s.value = ''; }); marcheaza(null); });
      body._puneRasp = (rs) => { body.querySelectorAll('.sco-intr select').forEach(s => { if (rs && rs[s.dataset.r] != null) s.value = rs[s.dataset.r]; }); };
      api.checkButton(() => {
        const r = verifica();
        marcheaza(r);
        if (r.ok) api.resolve(true);
        else {
          api.resolve(false, r.msg);
          api.revealButton(() => { inst.aplica(Object.assign({reset: true}, Q.solutie)); body._puneRasp(Q.solutie && Q.solutie.raspunsuri); marcheaza(verifica()); api.giveUp('compoziția cerută e acum pe scenă. Privește panoul fiecărui personaj: apasă pe dalele de sub scenă.'); });
        }
      }, 'Rulează testele');
    },
    rezolva(Q, body) { body._sco.aplica(Object.assign({reset: true}, Q.solutie)); body._puneRasp(Q.solutie && Q.solutie.raspunsuri); },
    gresit(Q, body) { body._sco.aplica(Object.assign({reset: true}, Q.gresit)); body._puneRasp(Q.gresit && Q.gresit.raspunsuri); }
  };

  window.SimScratchCompozitie = {versiune: VERSIUNE, DESENE, BIBLIOTECA, stil, creeaza, tipuri: {compozitie: tipCompozitie}};
})();
