/* lectii/_sim/compara-repetitii.js — cele trei structuri repetitive PUSE UNA LÂNGĂ ALTA: tabelul comparativ, aceeași
   problemă scrisă cu trei structuri (de câte ori se execută corpul, ce se afișează) și alegerea structurii pentru o
   problemă, cu motivul. Se încarcă DUPĂ lectii/_sim/urmarire-algoritm.js (VI/17), urmarire-algoritm-repetitie.js (VI/20),
   urmarire-algoritm-cattimp.js (VI/21) și urmarire-algoritm-pana-cand.js (VI/22); NU schimbă nimic din ele: le CITEȘTE
   (treceri(), teste(), ruleaza(), listare()) — numele rândurilor și forma lui treceri() rămân ale lor.

   PROPRIETAR: lecția VI/23 (lectii/vi/m4-l23, „Comparăm cele trei structuri repetitive. Când o folosesc pe fiecare”,
   01.11.2026). Granița: _campaign/revizuire_completa_2026_09/m4_noapte_01_11/granite/vi_l23.md.
   Lecțiile următoare (VI/24-26) NU schimbă ce e scris aici; dacă le trebuie altceva, fac un fișier NOU.

   API PUBLIC (window.ComparaRepetitii):
     versiune
     structura(prog)          -> 'pentru' | 'cattimp' | 'repeta' | null  (PRIMA structură de pe marginea stângă)
     treceri(prog, date)      -> de câte ori se execută corpul (calculat de componenta structurii: UrmarireRepetitie.
                                 treceri().randuri.length / UrmarireCatTimp.teste().treceri / UrmarirePanaCand.treceri().treceri)
     afisari(prog, date)      -> ce se afișează, în ordine (UrmarireAlgoritm.ruleaza().afisari)
     NUME                     -> {pentru:'„pentru”', cattimp:'„cât timp”', repeta:'„repetă … până când”'}
     tipuri.comparatie        {t:'comparatie', q, coloane:[3 etichete HTML], randuri:[{ce, optiuni:[…], ok:[k0,k1,k2],
                               motive:[m0,m1,m2]}], ajutor, why}
                              Tabelul: pe fiecare rând (o întrebare) și în fiecare coloană (o structură) elevul alege o
                              variantă (butoane; aceleași variante în toată linia). Fiecare căsuță se verifică singură;
                              mesajul numește rândul și coloana căsuțelor greșite (cel mult două) și spune motivul din
                              `motive` (adevărat, fără răspuns), plus câte căsuțe sunt bune.
     tipuri.treiori           {t:'treiori', q, progs:[{prog, et?}, …] (2 sau 3), date?:{…}, cere:'ori'|'afisari'|'ambele',
                               ajutor, why}
                              Algoritmii stau unul lângă altul (pe telefon unul sub altul); pentru fiecare, elevul scrie de
                              câte ori se execută corpul și / sau ce se afișează. Verificarea RULEAZĂ fiecare algoritm cu
                              componenta lui. Răspunsurile se primesc în formele VI/22 („de 3 ori”, „trei”, „o dată”, „0”,
                              „niciodată”; afișările despărțite prin spații, virgule, „și”).
     tipuri.alegestructura    {t:'alegestructura', q, probleme:[{text, ok:[indicii structurilor bune: 0 pentru, 1 cât timp,
                               2 repetă], motive:[3 motive], motivOk:{structură: indicele motivului}, ajutor?}], ajutor, why}
                              Pentru fiecare problemă: structura (trei butoane) și motivul (trei butoane, variante-soră).
                              Bună = structura e în `ok` ȘI motivul e cel al structurii alese. Mesajul spune, pe problemă,
                              ce nu se potrivește (structura sau doar motivul), fără să dea răspunsul.
     _intern.oriScris / _intern.afisariScrise   (doar pentru probe)
   EVENIMENT: după fiecare verificare, pe window: CustomEvent('compara-repetitii', {detail:{tip, bune, total, ok}}).
   Toate trei tipurile au rezolva() și gresit() pentru poartă (test_joc.py).
*/
(function () {
  'use strict';
  const VERSIUNE = '1.0 (01.11.2026)';
  const UA = window.UrmarireAlgoritm, UR = window.UrmarireRepetitie, UC = window.UrmarireCatTimp, UP = window.UrmarirePanaCand;
  if (!UA || !UR || !UC || !UP) {
    console.error('compara-repetitii.js: încarcă întâi urmarire-algoritm.js, urmarire-algoritm-repetitie.js, urmarire-algoritm-cattimp.js și urmarire-algoritm-pana-cand.js');
    return;
  }
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
  const fara = (s) => String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const anunta = (d) => { try { window.dispatchEvent(new CustomEvent('compara-repetitii', {detail: d})); } catch (e) { /* nimic */ } };
  const NUME = {pentru: '„pentru”', cattimp: '„cât timp”', repeta: '„repetă … până când”'};
  const LIT = ['A', 'B', 'C'];

  /* ---------------- structura și execuția (citite din componentele publicate) ---------------- */
  function structura(prog) {
    for (const r of prog || []) {
      if (!/^\S/.test(r)) continue;                 // doar marginea stângă
      const t = fara(r).trim();
      if (/^pentru\b/.test(t)) return 'pentru';
      if (/^cat\s+timp\b/.test(t)) return 'cattimp';
      if (/^repeta\s*$/.test(t)) return 'repeta';
    }
    return null;
  }
  function treceri(prog, date) {
    const s = structura(prog), d = date || {};
    if (s === 'pentru') return UR.treceri(prog, d).randuri.length;
    if (s === 'cattimp') return UC.teste(prog, d).treceri;
    if (s === 'repeta') return UP.treceri(prog, d).treceri;
    throw new Error('compara-repetitii: algoritmul nu are o structură repetitivă pe marginea stângă');
  }
  const afisari = (prog, date) => UA.ruleaza(prog, date || {}).afisari;
  /* „Afișează” în corp (rând mai la dreapta) sau doar sub repetiție */
  const afiseazaInCorp = (prog) => prog.some(r => /^\s+/.test(r) && /^afiseaza\b/.test(fara(r).trim()));

  /* ---------------- răspunsurile scrise: COPIA regulilor din urmarire-algoritm-pana-cand.js 1.2 (VI/22) ----------------
     (aceleași forme primite, ca elevul să nu fie respins aici pentru ce i s-a primit la lecția 22) */
  const NUM_CUV = {zero: 0, niciodata: 0, nicio: 0, niciuna: 0, unu: 1, una: 1, un: 1, o: 1, odata: 1, doi: 2, doua: 2, trei: 3, patru: 4, cinci: 5,
    sase: 6, sapte: 7, opt: 8, noua: 9, zece: 10, unsprezece: 11, doisprezece: 12, douasprezece: 12, treisprezece: 13,
    paisprezece: 14, cincisprezece: 15, saisprezece: 16, saptesprezece: 17, optsprezece: 18, nouasprezece: 19, douazeci: 20};
  const cuvNr = (t) => { const k = t.replace(/ /g, ''); return Object.prototype.hasOwnProperty.call(NUM_CUV, k) ? NUM_CUV[k] : undefined; };
  function oriScris(s) {
    let t = fara(s).replace(/[„”"“.!?]/g, ' ').replace(/\s+/g, ' ').trim();
    t = t.replace(/^(corpul\s+)?(se\s+(mai\s+)?executa\s+)?/, '').replace(/^de\s+/, '');
    const intreg = cuvNr(t);
    if (intreg !== undefined) return intreg;
    t = t.replace(/\s*(de\s+)?(ori|data|dati|treceri|trecere|x)$/, '').replace(/^o\s+singura$/, 'o').trim();
    if (/^-?\d+$/.test(t)) return +t;
    const c = cuvNr(t);
    return c === undefined ? null : c;
  }
  function afisariScrise(s) {
    const t = String(s || '').replace(/[„”"“]/g, ' ')
      .replace(/(\d)\s*[–—]\s*(?=[-−]?\d)/g, '$1 ')
      .replace(/(\d)-(?=[-−]?\d)/g, '$1 ')
      .replace(/=/g, ' ');
    return t.split(/[\s,;]+/).map(x => x.trim().replace(/[.!]+$/, ''))
      .filter(x => x && !/^[-–—]+$/.test(x) && !/^[\p{L}_]+$/u.test(x));
  }
  const eNumar = (x) => /^[-−]?\d+(?:[.,]\d+)?$/.test(x);

  /* ---------------- stilul ---------------- */
  function stil() {
    if (document.getElementById('cr-stil')) return;
    const e = document.createElement('style'); e.id = 'cr-stil';
    e.textContent = `
.cr-trei{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:10px;align-items:start}
.cr-col{min-width:0;border:1px solid var(--line);border-radius:10px;padding:6px 8px;background:var(--paper)}
.cr-col.ok{border-color:var(--ok);box-shadow:0 0 0 2px var(--okbg)} .cr-col.no{border-color:var(--bad);box-shadow:0 0 0 2px var(--badbg)}
.cr-et{font-weight:700;margin:.1em 0 .2em}
.cr-in{display:block;margin:.35em 0}
.cr-in input{font:inherit;min-height:36px;width:5em;max-width:100%;padding:3px 6px;border:1.5px solid var(--accent);border-radius:6px;background:var(--paper);color:var(--ink);box-sizing:border-box}
.cr-in input.lat{width:9em}
.cr-in input.ok{border-color:var(--ok);background:var(--okbg)} .cr-in input.no{border-color:var(--bad);background:var(--badbg)}
.cr-tab{display:grid;grid-template-columns:minmax(8.5em,1.05fr) repeat(3,minmax(0,1fr));gap:6px;margin:.5em 0}
.cr-tab .cr-h{font-weight:700;background:var(--paper2);border-radius:6px;padding:6px 8px}
.cr-tab .cr-r{display:contents}
.cr-tab .cr-ce{font-weight:700;padding:6px 4px;border-top:1px solid var(--line)}
.cr-tab .cr-c{border-top:1px solid var(--line);padding:4px 2px;border-radius:6px}
.cr-tab .cr-c.ok{background:var(--okbg)} .cr-tab .cr-c.no{background:var(--badbg)}
.cr-cn{display:none;font-weight:700;margin:2px 0}
.cr-ch{display:flex;flex-direction:column;gap:4px}
.cr-b{font:inherit;font-size:.9rem;text-align:left;min-height:38px;padding:5px 9px;border:1.5px solid var(--line);border-radius:8px;background:var(--paper);color:var(--ink);cursor:pointer;line-height:1.25}
.cr-b[aria-pressed="true"]{border-color:var(--accent);background:var(--sel);font-weight:700}
.cr-b[aria-pressed="true"]::before{content:"● ";color:var(--accent)}
.cr-pb{border:1px solid var(--line);border-radius:10px;padding:8px 10px;margin:.5em 0;background:var(--paper)}
.cr-pb.ok{border-color:var(--ok);background:var(--okbg)} .cr-pb.no{border-color:var(--bad);background:var(--badbg)}
.cr-pt{font-weight:700;margin:0 0 .3em}
.cr-pl{font-size:.88rem;color:var(--ink2);margin:.3em 0 .15em}
.cr-pb .cr-ch{flex-direction:row;flex-wrap:wrap}
.cr-pb .cr-ch.cr-mot{flex-direction:column}
@media (max-width:700px){ .cr-trei{grid-template-columns:minmax(0,1fr)} }
@media (max-width:560px){
  .cr-tab{display:block}
  .cr-tab .cr-h{display:none}
  .cr-tab .cr-r{display:block;border:1px solid var(--line);border-radius:10px;padding:6px 8px;margin:.5em 0}
  .cr-tab .cr-ce{border-top:0;padding:2px 0 4px}
  .cr-tab .cr-c{border-top:1px dashed var(--line);padding:4px 0 6px}
  .cr-cn{display:block}
  .cr-tab .cr-ch{flex-direction:row;flex-wrap:wrap}
}`;
    document.head.appendChild(e);
  }

  /* butoane-variante (ca un grup de opțiuni: una singură apăsată) */
  const grup = (nume, optiuni, eticheta) => `<div class="cr-ch" role="group" aria-label="${esc(eticheta)}" data-g="${esc(nume)}">${
    optiuni.map((o, k) => `<button type="button" class="cr-b" data-k="${k}" aria-pressed="false">${o}</button>`).join('')}</div>`;
  function leagaGrupuri(body) {
    body.querySelectorAll('.cr-ch').forEach(g => g.querySelectorAll('.cr-b').forEach(b => b.addEventListener('click', () => {
      g.querySelectorAll('.cr-b').forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      const cut = g.closest('.cr-c, .cr-pb'); if (cut) cut.classList.remove('ok', 'no');
    })));
  }
  const ales = (g) => { const b = g && g.querySelector('.cr-b[aria-pressed="true"]'); return b ? +b.dataset.k : -1; };
  const alege = (g, k) => g.querySelectorAll('.cr-b').forEach(x => x.setAttribute('aria-pressed', +x.dataset.k === k ? 'true' : 'false'));

  /* ================= tipul „comparatie” (tabelul comparativ) ================= */
  const COMPARATIE = {
    render(Q, body, api) {
      stil();
      const col = Q.coloane;
      body.innerHTML = `<div class="cr-tab" role="table" aria-label="Tabelul comparativ">
        <div class="cr-h" role="columnheader">Întrebarea</div>${col.map(c => `<div class="cr-h" role="columnheader">${c}</div>`).join('')}
        ${Q.randuri.map((r, i) => `<div class="cr-r" role="row"><div class="cr-ce" role="rowheader">${r.ce}</div>${col.map((c, j) =>
          `<div class="cr-c" role="cell" data-r="${i}" data-c="${j}"><span class="cr-cn">${c}</span>${grup(`${i}-${j}`, r.optiuni, `${r.ce.replace(/<[^>]+>/g, '')} — ${c.replace(/<[^>]+>/g, '')}`)}</div>`).join('')}</div>`).join('')}
      </div><p class="ua-nota">Una singură pe căsuță.</p>`;
      leagaGrupuri(body);
      const celule = () => [...body.querySelectorAll('.cr-c')].map(c => ({el: c, r: +c.dataset.r, c: +c.dataset.c, k: ales(c.querySelector('.cr-ch'))}));
      body._umple = () => celule().forEach(x => alege(x.el.querySelector('.cr-ch'), Q.randuri[x.r].ok[x.c]));
      /* greșeala tipică: „cât timp” și „repetă” schimbate între ele pe fiecare rând unde diferă (restul bun) */
      body._rau = () => celule().forEach(x => { const r = Q.randuri[x.r], j = x.c === 1 ? 2 : x.c === 2 ? 1 : x.c; alege(x.el.querySelector('.cr-ch'), r.ok[j]); });
      const nav = api.checkButton(() => {
        const cs = celule(), goale = cs.filter(x => x.k < 0), gresite = cs.filter(x => x.k >= 0 && x.k !== Q.randuri[x.r].ok[x.c]);
        cs.forEach(x => { x.el.classList.remove('ok', 'no'); if (x.k >= 0) x.el.classList.add(x.k === Q.randuri[x.r].ok[x.c] ? 'ok' : 'no'); });
        const bune = cs.length - goale.length - gresite.length, ok = bune === cs.length;
        anunta({tip: 'comparatie', bune, total: cs.length, ok});
        if (ok) { nav.innerHTML = ''; api.resolve(true); return; }
        const fara_ = (s) => s.replace(/<[^>]+>/g, '');
        const loc = (x) => `rândul „${fara_(Q.randuri[x.r].ce)}”, coloana ${fara_(col[x.c])}`;
        const m = [`${bune} din ${cs.length} căsuțe sunt bune.`];
        if (gresite.length) gresite.slice(0, 2).forEach(x => m.push(`La ${loc(x)}: ${Q.randuri[x.r].motive[x.c]}`));
        if (goale.length) m.push(goale.length === 1 ? `O căsuță e necompletată (${loc(goale[0])}).` : `${goale.length} căsuțe sunt necompletate: prima e la ${loc(goale[0])}.`);
        api.resolve(false, m.join(' '));
        api.revealButton(() => { body._umple(); celule().forEach(x => { x.el.classList.remove('no'); x.el.classList.add('ok'); }); nav.innerHTML = ''; api.giveUp('tabelul e completat acum, cu verde. Citește-l pe rânduri.'); });
      }, 'Verifică tabelul');
    },
    rezolva(Q, body) { body._umple(); },
    gresit(Q, body) { body._rau(); }
  };

  /* ================= tipul „treiori” (aceeași problemă, mai multe structuri) ================= */
  const TREIORI = {
    render(Q, body, api) {
      stil();
      const cere = Q.cere || 'ambele', d = Q.date || {};
      const R = Q.progs.map(p => ({s: structura(p.prog), n: treceri(p.prog, d), a: afisari(p.prog, d), inCorp: afiseazaInCorp(p.prog)}));
      body.innerHTML = `<div class="cr-trei" style="--cr-n:${Q.progs.length}">${Q.progs.map((p, i) => `<div class="cr-col" data-i="${i}">
          <p class="cr-et">${LIT[i]}: ${p.et || `cu ${NUME[R[i].s]}`}</p>${UA.listare(p.prog)}
          ${cere !== 'afisari' ? `<label class="cr-in">Corpul se execută de <input data-o="${i}" inputmode="numeric" autocomplete="off" aria-label="Algoritmul ${LIT[i]}: de câte ori se execută corpul"> ori.</label>` : ''}
          ${cere !== 'ori' ? `<label class="cr-in">Se afișează: <input class="lat" data-a="${i}" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Algoritmul ${LIT[i]}: ce se afișează"></label>` : ''}
        </div>`).join('')}</div>
        <p class="ua-nota">${cere === 'afisari' ? 'Scrie numerele afișate, cu spații între ele.' : cere === 'ori' ? 'Scrie doar numărul; 0 dacă nu se execută deloc.' : 'La „de câte ori”: doar numărul (0 dacă nu se execută deloc). La „Se afișează”: numerele, cu spații între ele.'}</p>`;
      const inO = i => body.querySelector(`[data-o="${i}"]`), inA = i => body.querySelector(`[data-a="${i}"]`);
      body.querySelectorAll('input').forEach(inp => inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); } }));
      const okO = i => !inO(i) || oriScris(inO(i).value) === R[i].n;
      const okA = i => { if (!inA(i)) return true; const l = afisariScrise(inA(i).value); return l.length === R[i].a.length && l.every((x, k) => UA.potriveste(x, R[i].a[k])); };
      body._umple = () => R.forEach((r, i) => { if (inO(i)) inO(i).value = String(r.n); if (inA(i)) inA(i).value = r.a.map(UA.format).join(' '); });
      body._rau = () => R.forEach((r, i) => { if (inO(i)) inO(i).value = String(r.n > 0 ? r.n - 1 : 1); if (inA(i)) inA(i).value = r.a.map(v => (typeof v === 'number' ? UA.format(v + 1) : UA.format(v))).join(' '); });
      const motivO = (i) => {
        const v = inO(i).value, o = oriScris(v), r = R[i], L = LIT[i];
        if (v.trim() === '') return `${L}: scrie de câte ori se execută corpul.`;
        if (o === null) return `${L}: scrie numărul de treceri, cu cifre (0 dacă nu se execută deloc).`;
        if (r.s === 'pentru') return `${L}: la „pentru”, o trecere pe valoare a contorului (finală − inițială + 1).`;
        if (r.s === 'cattimp') return r.n === 0 || o === 0
          ? `${L}: la „cât timp”, testul vine ÎNAINTE de corp. Primul test, cu valoarea de la început, e adevărat?`
          : `${L}: la „cât timp”, numără testele adevărate.`;
        return o === 0
          ? `${L}: la „repetă … până când”, testul vine DUPĂ corp: cel puțin o trecere.`
          : `${L}: la „repetă … până când”, întâi corpul, apoi testul; numără trecerile până la testul adevărat, inclusiv.`;
      };
      const motivA = (i) => {
        const v = inA(i).value, l = afisariScrise(v), r = R[i], L = LIT[i];
        if (v.trim() === '') return `${L}: scrie ce se afișează.`;
        if (l.filter(eNumar).length !== l.length) return `${L}: scrie doar numerele afișate, despărțite prin spații.`;
        /* 1.0 (parcurgerea, 02.11): numărul de valori e bun, dar nu și valorile → greșeala e în treceri, nu în locul lui „Afișează” */
        if (l.length === r.a.length) return r.s === 'pentru' ? `${L}: refă trecerile: câte una pentru fiecare valoare a contorului, apoi te oprești.`
          : r.s === 'cattimp' ? `${L}: refă trecerile: înainte de fiecare, testul; te oprești la primul test fals.`
            : `${L}: refă trecerile: întâi corpul, apoi testul; te oprești la primul test adevărat.`;
        return r.inCorp ? `${L}: „Afișează” e în corp: se execută la fiecare trecere.`
          : `${L}: „Afișează” e sub repetiție: o singură dată, cu valoarea de după ultima trecere.`;
      };
      const nav = api.checkButton(() => {
        const rez = R.map((_, i) => ({i, o: okO(i), a: okA(i)}));
        rez.forEach(x => {
          const c = body.querySelector(`.cr-col[data-i="${x.i}"]`); c.classList.remove('ok', 'no'); c.classList.add(x.o && x.a ? 'ok' : 'no');
          if (inO(x.i)) { inO(x.i).classList.remove('ok', 'no'); inO(x.i).classList.add(x.o ? 'ok' : 'no'); }
          if (inA(x.i)) { inA(x.i).classList.remove('ok', 'no'); inA(x.i).classList.add(x.a ? 'ok' : 'no'); }
        });
        const total = rez.reduce((s, x) => s + (inO(x.i) ? 1 : 0) + (inA(x.i) ? 1 : 0), 0);
        const bune = rez.reduce((s, x) => s + (inO(x.i) && x.o ? 1 : 0) + (inA(x.i) && x.a ? 1 : 0), 0);
        const ok = bune === total;
        anunta({tip: 'treiori', bune, total, ok});
        if (ok) { nav.innerHTML = ''; api.resolve(true); return; }
        const m = [];
        rez.forEach(x => { if (!x.o) m.push(motivO(x.i)); if (!x.a) m.push(motivA(x.i)); });
        api.resolve(false, `${bune} din ${total} răspunsuri sunt bune. ${m.slice(0, 2).join(' ')}`);
        api.revealButton(() => { body._umple(); body.querySelectorAll('.cr-col').forEach(c => { c.classList.remove('no'); c.classList.add('ok'); });
          body.querySelectorAll('.cr-in input').forEach(x => { x.classList.remove('no'); x.classList.add('ok'); });
          nav.innerHTML = ''; api.giveUp(R.map((r, i) => `${LIT[i]}: ${cere !== 'afisari' ? `${r.n === 1 ? 'o dată' : `de ${r.n} ori`}` : ''}${cere === 'ambele' ? ', ' : ''}${cere !== 'ori' ? `afișează ${r.a.map(UA.format).join(' ')}` : ''}`).join('; ') + '.'); });
      }, 'Verifică');
    },
    rezolva(Q, body) { body._umple(); },
    gresit(Q, body) { body._rau(); }
  };

  /* ================= tipul „alegestructura” (structura potrivită + motivul) ================= */
  const STRUCT = ['„pentru”', '„cât timp”', '„repetă … până când”'];
  const ALEGE = {
    render(Q, body, api) {
      stil();
      body.innerHTML = Q.probleme.map((p, i) => `<div class="cr-pb" data-i="${i}">
          <p class="cr-pt">${i + 1}. ${p.text}</p>
          <p class="cr-pl">Structura:</p>${grup(`s${i}`, STRUCT, `Problema ${i + 1}: structura`)}
          <p class="cr-pl">De ce:</p>${grup(`m${i}`, p.motive, `Problema ${i + 1}: motivul`).replace('class="cr-ch"', 'class="cr-ch cr-mot"')}
        </div>`).join('') + ``;
      leagaGrupuri(body);
      const gS = i => body.querySelector(`[data-g="s${i}"]`), gM = i => body.querySelector(`[data-g="m${i}"]`);
      const stare = i => { const p = Q.probleme[i], s = ales(gS(i)), m = ales(gM(i));
        return {s, m, sOk: p.ok.includes(s), mOk: p.ok.includes(s) && p.motivOk[s] === m}; };
      body._umple = () => Q.probleme.forEach((p, i) => { alege(gS(i), p.ok[0]); alege(gM(i), p.motivOk[p.ok[0]]); });
      /* greșeala tipică: structura bună, dar motivul altei structuri; la prima problemă, și structura greșită */
      body._rau = () => Q.probleme.forEach((p, i) => { const s = i === 0 ? [0, 1, 2].find(k => !p.ok.includes(k)) : p.ok[0];
        alege(gS(i), s); alege(gM(i), [0, 1, 2].find(k => k !== p.motivOk[p.ok[0]])); });
      const nav = api.checkButton(() => {
        const st = Q.probleme.map((_, i) => stare(i));
        st.forEach((x, i) => { const c = body.querySelector(`.cr-pb[data-i="${i}"]`); c.classList.remove('ok', 'no'); if (x.s >= 0 || x.m >= 0) c.classList.add(x.mOk ? 'ok' : 'no'); });
        const bune = st.filter(x => x.mOk).length, ok = bune === st.length;
        anunta({tip: 'alegestructura', bune, total: st.length, ok});
        if (ok) { nav.innerHTML = ''; api.resolve(true); return; }
        const m = [];
        st.forEach((x, i) => {
          if (x.mOk) return;
          const p = Q.probleme[i];
          if (x.s < 0) m.push(`Problema ${i + 1}: alege structura.`);
          else if (!x.sOk) m.push(`Problema ${i + 1}: ${STRUCT[x.s]} nu e structura dată de regulă. ${p.ajutor || 'Pune-ți cele trei întrebări, în ordine.'}`);
          else if (x.m < 0) m.push(`Problema ${i + 1}: structura e bună; alege și motivul.`);
          else m.push(`Problema ${i + 1}: structura e bună, dar motivul ales nu e cel care o alege. Citește motivele încă o dată, cu problema în minte.`);
        });
        api.resolve(false, `${bune} din ${st.length} probleme sunt bune. ${m.slice(0, 2).join(' ')}`);
        api.revealButton(() => { body._umple(); body.querySelectorAll('.cr-pb').forEach(c => { c.classList.remove('no'); c.classList.add('ok'); });
          nav.innerHTML = ''; api.giveUp(Q.probleme.map((p, i) => `${i + 1}. ${STRUCT[p.ok[0]]}: ${p.motive[p.motivOk[p.ok[0]]]}`).join(' ')); });
      }, 'Verifică');
    },
    rezolva(Q, body) { body._umple(); },
    gresit(Q, body) { body._rau(); }
  };

  window.ComparaRepetitii = {versiune: VERSIUNE, structura, treceri, afisari, NUME,
    tipuri: {comparatie: COMPARATIE, treiori: TREIORI, alegestructura: ALEGE},
    _intern: {oriScris, afisariScrise}};
})();
