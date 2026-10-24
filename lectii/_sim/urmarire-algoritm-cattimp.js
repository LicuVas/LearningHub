/* lectii/_sim/urmarire-algoritm-cattimp.js — structura „cât timp … execută” (repetiția cu test inițial) în notația
   clasei și tabelul de urmărire PE TESTE (condiția adevărat/fals la fiecare test, apoi valorile de după trecere).
   Se încarcă DUPĂ lectii/_sim/urmarire-algoritm.js (VI/17); merge și împreună cu urmarire-algoritm-repetitie.js (VI/20),
   în orice ordine. Nu schimbă nimic din ele: doar UrmarireAlgoritm.instructiune(...) și UrmarireAlgoritm.mod(...).

   PROPRIETAR: lecția VI/21 (lectii/vi/m3-l21, „Structura repetitivă condiționată anterior”, 24.10.2026). VI/22-26 adaugă
   rândurile lor dintr-un fișier NOU și NU schimbă ce e scris aici. Granița: …/m3_noapte_23_10/granite/vi_l21.md.

   NOTAȚIA (aleasă de VI/21, după „pentru … sfârșit pentru” al VI/20; documentele profesorului nu o dau — vezi
   lectii/vi/m3-l21/surse.md, „Pentru profesor”):
       n ← 17
       cât timp n ≥ 5 execută          condiția se verifică ÎNAINTE de fiecare trecere: adevărată → corpul (rândurile de
          n ← n - 5                     sub el, MAI LA DREAPTA) se execută o dată, apoi se verifică din nou; falsă → gata,
       sfârșit cât timp                 algoritmul merge după rândul de închidere (se primește și „■”, forma jocului
       Afișează n                       algoritmi-vi; fără rând de închidere, corpul se termină unde se termină rândurile
                                        mai la dreapta). Falsă de la început → corpul de 0 ori.
   Condiția = orice condiție a VI/17 (< ≤ > ≥ = ≠, ȘI SAU NU). Peste 2000 de pași: mesajul de finitudine al VI/17
   („algoritmul nu se oprește (finitudinea!)”). Litere mici / mari, fără diacritice („cat timp … executa”): primite.

   API PUBLIC (window.UrmarireCatTimp; stabil de la 24.10.2026, orice schimbare se trece în graniță, cu data):
     versiune
     teste(prog, date) → {cond, rand, coloane:[nume…], inainte:{…}, randuri:[{k, cond:true|false, valori:{…}|null,
                          afis:[…]}], treceri (numărul de teste adevărate), final:[afișările de după], afisari:[toate],
                          corpAfiseaza}   (PRIMUL „cât timp” de pe marginea stângă; aruncă {mesaj, rand} ca ruleaza)
     tabelTeste(prog, date, {coloane?}) → HTML: tabelul pe teste, COMPLETAT (exemplele din pași)
     tipuri.cattimpori   {t:'cattimpori', q, prog, date?:{…}, cere:'ori'|'teste'|'afisari', ajutor, why}
                         elevul scrie de câte ori se execută corpul (cere:'ori', poate fi 0), de câte ori se verifică
                         condiția (cere:'teste') sau ce se afișează, în ordine (cere:'afisari'). Verificarea RULEAZĂ algoritmul.
   Modul nou al tipului UrmarireAlgoritm.tipuri.urmarire: {t:'urmarire', mod:'teste', q, prog, date:[{…}, …],
       coloane?:['n'], facut?:1 (câte teste sunt completate dinainte), inPlus?:1 (rânduri în plus, după oprire), ajutor, why}
     Un rând „la început” (completat) + câte un rând pe test: condiția (alege… / adevărat / fals) și, dacă e adevărată,
     valorile de după trecere; pe testul fals, căsuțele de valori rămân goale (se primesc și „-”, „se oprește”);
     rândurile „în plus”, după oprire, rămân cu totul goale („alege…”). „La final se afișează”, dacă e un Afișează după.
     Pentru poartă: body._ua = {ck:[{id, exp, tip}], Q} și body._umple(), ca tipul „urmarire” al VI/17.
   JURNALUL (convenția VI/20, pentru cine extinde): înainte de primul test ctx.noteaza(r, undefined, {faza:'inainte',
     valori}); la fiecare test ctx.noteaza(r, c, {test:k, faza:'test', cond:c, valori}); la fiecare trecere
     {trecere:k, faza:'inceput'} și {trecere:k, faza:'sfarsit', valori, afis}.
   NU e în UrmarireRepetitie.tipuriRepetitie (modul „treceri” al VI/20 cere un contor; „cât timp” n-are).
*/
(function () {
  'use strict';
  if (window.UrmarireCatTimp) return;
  const UA = window.UrmarireAlgoritm;
  if (!UA) throw new Error('urmarire-algoritm-cattimp.js: încarcă întâi lectii/_sim/urmarire-algoritm.js');
  const VERSIUNE = '1.1 (24.10.2026)';   /* 1.1: căsuțele de valori din tabelul pe teste cu inputmode="text" (ca VI/17): tastatura numerică a iPhone-ului n-are minus, iar valorile pot fi negative (judecata 1 a VI/21, MINOR 3). API neschimbat. */
  const {esc, stil, dateText, anunta, alegeDate} = UA._intern;
  const Gr = (mesaj, rand) => ({mesaj, rand, greseala: true});
  const PATRAT = /^■\.?$/u;

  /* rândul de închidere: „sfârșit cât timp” („■” se primește doar în dupaBloc, ca să nu-l fure de la „pentru”) */
  UA.instructiune({tip: 'sfcattimp', re: /^sfârșit\s+cât\s+timp\.?$/iu, executa(nod) {
    throw Gr('„sfârșit cât timp” închide un „cât timp”: pune-l sub rândul „cât timp …”, la aceeași margine.', nod.r.i);
  }});
  UA.instructiune({
    tip: 'cattimp', bloc: true,
    re: /^cât\s+timp\s+(.+?)\s+execută\.?$/iu,
    prinde: m => ({cond: m[1]}),
    dupaBloc(nod, rr, getK, setK) {
      const k = getK(), r = nod.r;
      const inchide = (x) => !!x && (x.tip === 'sfcattimp' || PATRAT.test(x.s));
      const ultim = nod.copii[nod.copii.length - 1];
      if (k < rr.length && inchide(rr[k]) && rr[k].ind <= r.ind + 1) { nod.rSf = rr[k]; setK(k + 1); }
      else if (ultim && ultim.r.tip === 'sfcattimp') { nod.rSf = ultim.r; nod.copii.pop(); }   // închiderea scrisă mai la dreapta
    },
    executa(nod, ctx) {
      const r = nod.r;
      if (!nod.copii.length) throw Gr('sub „cât timp” trebuie cel puțin un rând mai la dreapta: ce se repetă.', r.i);
      ctx.noteaza(r, undefined, {faza: 'inainte', valori: Object.assign({}, ctx.v)});
      for (let k = 1; ; k++) {
        const c = ctx.evalueaza(r.cond, r);
        if (typeof c !== 'boolean') throw Gr('după „cât timp” vine o condiție: o comparație care dă adevărat sau fals.', r.i);
        ctx.noteaza(r, c, {test: k, faza: 'test', cond: c, valori: Object.assign({}, ctx.v)});
        if (!c) break;
        const af0 = ctx.afisari.length;
        ctx.noteaza(r, undefined, {trecere: k, faza: 'inceput'});
        ctx.executa(nod.copii);
        ctx.noteaza(r, undefined, {trecere: k, faza: 'sfarsit', valori: Object.assign({}, ctx.v), afis: ctx.afisari.slice(af0)});
      }
      if (nod.rSf) ctx.noteaza(nod.rSf);
    }
  });

  /* ---------------- testele (din jurnalul rulării) ---------------- */
  const SET_IN = (A, rand) => {
    const out = [];
    const w = (noduri) => noduri.forEach(n => {
      if (n.r.tip === 'set' && !out.includes(n.r.nume)) out.push(n.r.nume);
      if (n.copii) w(n.copii);
      if (n.altfel) w(n.altfel);
    });
    const gas = (noduri) => { for (const n of noduri) { if (n.r.i === rand) return n; const x = (n.copii && gas(n.copii)) || (n.altfel && gas(n.altfel)); if (x) return x; } return null; };
    const nod = gas(A.arbore);
    if (nod) w(nod.copii);
    return {out, nod};
  };
  const areAfis = (nod) => { let da = false; const w = ns => ns.forEach(n => { if (n.r.tip === 'afis') da = true; if (n.copii) w(n.copii); if (n.altfel) w(n.altfel); }); if (nod) w(nod.copii); return da; };
  function teste(prog, date) {
    const A = typeof prog === 'object' && prog.arbore ? prog : UA.analizeaza(prog);
    const R = UA.ruleaza(A, date || {});
    const prim = A.arbore.find(n => n.r.tip === 'cattimp');
    if (!prim) throw Gr('algoritmul nu are un „cât timp” pe marginea din stânga.', 0);
    const rand = prim.r.i;
    const {out} = SET_IN(A, rand);
    const j = R.jurnal.filter(e => e.i === rand);
    const ina = j.find(e => e.faza === 'inainte');
    const sf = {};
    j.filter(e => e.faza === 'sfarsit').forEach(e => { sf[e.trecere] = e; });
    const randuri = j.filter(e => e.faza === 'test').map(e => ({k: e.test, cond: e.cond, valori: e.cond && sf[e.test] ? sf[e.test].valori : null, afis: e.cond && sf[e.test] ? (sf[e.test].afis || []) : []}));
    let final = [];
    const ultim = R.jurnal.map((e, x) => ({e, x})).filter(o => o.e.i === rand).pop();
    if (ultim) final = R.jurnal.slice(ultim.x + 1).filter(e => e.tip === 'afis').map(e => e.val);
    return {cond: prim.r.cond, rand, coloane: out, inainte: ina ? ina.valori : {}, randuri, treceri: randuri.filter(x => x.cond).length,
      final, afisari: R.afisari, corpAfiseaza: areAfis(prim), R, A};
  }
  const F = UA.format;
  const cel = (v) => v === undefined ? '–' : esc(F(v));
  const caut = (vals, nume) => { if (!vals) return undefined; if (nume in vals) return vals[nume]; const k = Object.keys(vals).find(x => x.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase() === nume.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()); return k ? vals[k] : undefined; };

  function stilT() {
    stil();
    if (document.getElementById('uct-stil')) return;
    const e = document.createElement('style'); e.id = 'uct-stil';
    e.textContent = `
.uct-t{border-collapse:collapse;font-size:.92rem;margin:.4em 0;min-width:60%}
.uct-t th,.uct-t td{border:1px solid var(--line);padding:5px 8px;text-align:center;vertical-align:middle}
.uct-t th{background:var(--paper2);font-weight:700;font-family:var(--fm,monospace)}
.uct-t th.tr,.uct-t td.tr{text-align:left;font-family:inherit;white-space:nowrap}
.uct-t td.dinainte{color:var(--ink2);background:var(--paper2)}
.uct-t td.stop{font-style:italic;color:var(--ink2)}
.uct-t td.ok{background:var(--okbg)} .uct-t td.no{background:var(--badbg)}
.uct-t input,.uct-t select{font:inherit;font-family:var(--fm,monospace);width:4.6em;max-width:100%;min-height:34px;padding:3px 5px;border:1.5px solid var(--line);border-radius:5px;background:var(--paper);color:var(--ink);box-sizing:border-box;text-align:center}
.uct-t select{width:auto;text-align:left}
.uct-t input.lat{width:7.5em}
.uct-fin{margin:.5em 0}
.uct-fin input{font:inherit;font-family:var(--fm,monospace);width:6em;min-height:34px;padding:3px 6px;border:1.5px solid var(--line);border-radius:5px;background:var(--paper);color:var(--ink);box-sizing:border-box}
.uct-fin.ok input{background:var(--okbg)} .uct-fin.no input{background:var(--badbg)}
.uct-ori{margin:.5em 0} .uct-ori input{font:inherit;font-family:var(--fm,monospace);width:5em;min-height:34px;padding:3px 6px;border:1.5px solid var(--accent);border-radius:5px;background:var(--paper);color:var(--ink);box-sizing:border-box}
.uct-ori input.lat{width:12em;max-width:70vw}
@media (max-width:560px){.uct-t{font-size:.84rem}.uct-t th,.uct-t td{padding:4px 3px}.uct-t input{width:3.4em}.uct-t input.lat{width:5.5em}.uct-t select{max-width:6.6em}}`;
    document.head.appendChild(e);
  }

  /* tabelul completat (pașii lecției) */
  function tabelTeste(prog, date, opt) {
    stilT();
    const T = teste(prog, date);
    const col = (opt && opt.coloane) || T.coloane;
    const afis = T.corpAfiseaza;
    const head = `<tr><th class="tr">Testul</th><th>${esc(T.cond)} ?</th>${col.map(c => `<th>${esc(c)}</th>`).join('')}${afis ? '<th>se afișează</th>' : ''}</tr>`;
    const r0 = `<tr><td class="tr">la început</td><td>–</td>${col.map(c => `<td>${cel(caut(T.inainte, c))}</td>`).join('')}${afis ? '<td>–</td>' : ''}</tr>`;
    const rs = T.randuri.map(r => r.cond
      ? `<tr><td class="tr">${r.k}</td><td>adevărat</td>${col.map(c => `<td>${cel(caut(r.valori, c))}</td>`).join('')}${afis ? `<td>${esc(r.afis.map(F).join(', '))}</td>` : ''}</tr>`
      : `<tr><td class="tr">${r.k}</td><td>fals</td><td class="stop" colspan="${col.length + (afis ? 1 : 0)}">se oprește</td></tr>`).join('');
    const fin = T.final.length ? `<p class="uct-fin">La final se afișează: <b>${esc(T.final.map(F).join(', '))}</b></p>` : '';
    return `<div class="ua-tw"><table class="uct-t"><thead>${head}</thead><tbody>${r0}${rs}</tbody></table></div>${fin}`;
  }

  /* ---------------- modul „teste” al tipului urmarire ---------------- */
  const OPRIT = /^se\s+opre[sș]te\.?$/iu;
  const potrivesteGol = (val) => UA.potriveste(val, '') || OPRIT.test(String(val || '').trim());
  UA.mod('teste', {
    render(Q, body, api) {
      stilT();
      const d = alegeDate(Q)[0] || {};
      const T = teste(Q.prog, d);
      const col = Q.coloane || T.coloane, afis = T.corpAfiseaza, facut = Q.facut || 0, inPlus = Q.inPlus == null ? 1 : Q.inPlus;
      const ck = [];
      const head = `<tr><th class="tr">Testul</th><th>${esc(T.cond)} ?</th>${col.map(c => `<th>${esc(c)}</th>`).join('')}${afis ? '<th>se afișează</th>' : ''}</tr>`;
      const r0 = `<tr><td class="tr">la început</td><td class="dinainte">–</td>${col.map(c => `<td class="dinainte">${cel(caut(T.inainte, c))}</td>`).join('')}${afis ? '<td class="dinainte">–</td>' : ''}</tr>`;
      const rows = T.randuri.map(r => ({k: r.k, cond: r.cond, valori: r.valori, afis: r.afis}));
      for (let x = 0; x < inPlus; x++) rows.push({k: rows.length + 1, cond: '', valori: null, afis: [], inPlus: true});
      const sel = (id, k) => `<select data-i="${esc(id)}" aria-label="Testul ${k}: condiția"><option value="">alege…</option><option value="adevărat">adevărat</option><option value="fals">fals</option></select>`;
      const inp = (id, et, lat) => `<input${lat ? ' class="lat"' : ''} data-i="${esc(id)}" autocomplete="off" autocapitalize="off" spellcheck="false" inputmode="text" aria-label="${esc(et)}">`;
      const rs = rows.map((r, x) => {
        const gata = x < facut && !r.inPlus;
        if (gata) {
          return r.cond
            ? `<tr><td class="tr">${r.k}</td><td class="dinainte">adevărat</td>${col.map(c => `<td class="dinainte">${cel(caut(r.valori, c))}</td>`).join('')}${afis ? `<td class="dinainte">${esc(r.afis.map(F).join(', '))}</td>` : ''}</tr>`
            : `<tr><td class="tr">${r.k}</td><td class="dinainte">fals</td><td class="stop dinainte" colspan="${col.length + (afis ? 1 : 0)}">se oprește</td></tr>`;
        }
        const idc = `c${r.k}`;
        ck.push({id: idc, k: r.k, col: 'cond', exp: r.cond, tip: 'cond', inPlus: !!r.inPlus});
        const cells = col.map(c => {
          const id = `t${r.k}-${c}`, exp = r.cond === true ? caut(r.valori, c) : '';
          ck.push({id, k: r.k, col: c, exp: exp === undefined ? '' : exp, tip: 'set', gol: r.cond !== true, inPlus: !!r.inPlus});
          return `<td data-c="${esc(id)}">${inp(id, `Testul ${r.k}: ${c}`)}</td>`;
        }).join('');
        let ca = '';
        if (afis) {
          const id = `t${r.k}-afis`, exp = r.cond === true ? (r.afis.length === 1 ? r.afis[0] : r.afis.map(F).join(', ')) : '';
          ck.push({id, k: r.k, col: 'afis', exp, tip: 'afis', gol: r.cond !== true, inPlus: !!r.inPlus});
          ca = `<td data-c="${id}">${inp(id, `Testul ${r.k}: ce se afișează`, true)}</td>`;
        }
        return `<tr><td class="tr">${r.k}</td><td data-c="${idc}">${sel(idc, r.k)}</td>${cells}${ca}</tr>`;
      }).join('');
      let fin = '';
      if (T.final.length) {
        const exp = T.final.length === 1 ? T.final[0] : T.final.map(F).join(', ');
        ck.push({id: 'fin', k: 'fin', col: 'fin', exp, tip: 'afis'});
        fin = `<p class="uct-fin" data-c="fin"><label>La final se afișează: <input data-i="fin" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Ce se afișează la final"></label></p>`;
      }
      const ks = [...new Set(ck.map(c => c.k))];
      body.innerHTML = `${UA.listare(Q.prog)}${Object.keys(d).length ? `<div class="ua-dat">Datele de intrare: ${esc(dateText(d))}</div>` : ''}
        <div class="ua-tw"><table class="uct-t sim"><thead>${head}</thead><tbody>${r0}${rs}</tbody></table></div>${fin}
        <p class="ua-nota">Pe fiecare rând: întâi condiția, cu valorile de pe rândul de deasupra. Adevărată? Calculezi corpul și scrii valorile noi. Falsă? Repetiția se oprește: lași căsuțele de valori goale, iar pe rândurile de după nu mai alegi nimic.</p>
        <div class="ua-lbl">Testele</div><ul class="ua-teste">${ks.map(k => `<li data-t="${k}">${k === 'fin' ? 'Ce se afișează la final' : `Rândul testului ${k}`}</li>`).join('')}</ul>`;
      body._ua = {ck, Q};
      const el = id => body.querySelector(`[data-i="${id}"]`);
      const inputs = [...body.querySelectorAll('[data-i]')];
      inputs.forEach((e, k) => e.addEventListener('keydown', ev => {
        if (ev.key === 'Enter') { ev.preventDefault(); const n = inputs[k + 1]; if (n) n.focus(); else { const b = document.getElementById('chk'); if (b) b.focus(); } }
      }));
      const marcheaza = () => {
        let bune = 0; const motive = [], rau = new Set();
        ck.forEach(c => {
          const e = el(c.id), val = e ? e.value : '';
          let ok;
          if (c.tip === 'cond') ok = c.exp === '' ? val === '' : UA.potriveste(val, c.exp);
          else ok = c.gol ? potrivesteGol(val) : UA.potriveste(val, c.exp);
          if (ok) bune++;
          else {
            rau.add(c.k);
            const unde = c.k === 'fin' ? 'la final' : `testul ${c.k}${c.tip === 'cond' ? ', condiția' : `, coloana ${c.col === 'afis' ? '„se afișează”' : c.col}`}`;
            if (c.inPlus) motive.push(`${unde}: repetiția s-a oprit mai sus, la testul fals; testul ${c.k} nu se mai face, deci rândul rămâne gol`);
            else if (c.tip === 'cond' && val === '') motive.push(`${unde}: alege adevărat sau fals`);
            else if (c.tip === 'cond') motive.push(`${unde}: pune în condiție valorile de pe rândul de deasupra și compară din nou`);
            else if (c.gol) motive.push(`${unde}: aici condiția e falsă, deci corpul nu se mai execută: căsuța rămâne goală`);
            else if (val.trim() === '') motive.push(`${unde}: condiția e adevărată, deci corpul se execută: completează căsuța`);
            else if (c.k === 'fin') motive.push(`${unde}: se afișează valoarea de după ultimul test`);
            else if (c.col === 'afis') motive.push(`${unde}: se afișează valoarea de ACUM, din trecerea aceasta`);
            else motive.push(`${unde}: calculează cu valorile de ACUM, de pe rândul de deasupra`);
          }
          const td = body.querySelector(`[data-c="${c.id}"]`);
          if (td) td.classList.toggle('ok', ok), td.classList.toggle('no', !ok);
        });
        ks.forEach(k => { const li = body.querySelector(`li[data-t="${k}"]`); if (li) li.className = rau.has(k) ? 'no' : 'ok'; });
        return {bune, motive, ok: bune === ck.length};
      };
      const umple = () => ck.forEach(c => { const e = el(c.id); if (!e) return; e.value = c.exp === '' ? '' : (typeof c.exp === 'string' ? c.exp : F(c.exp)); });
      body._umple = umple;
      const nav = api.checkButton(() => {
        const {bune, motive, ok} = marcheaza();
        anunta({tip: 'urmarire-teste', bune, total: ck.length, ok});
        if (ok) { nav.innerHTML = ''; api.resolve(true); }
        else {
          api.resolve(false, `${bune} din ${ck.length} căsuțe sunt bune. ${motive.slice(0, 2).map(m => m[0].toUpperCase() + m.slice(1)).join('. ')}.`);
          api.revealButton(() => { umple(); marcheaza(); nav.innerHTML = ''; api.giveUp('valorile corecte sunt acum în tabel, cu verde. Parcurge-le test cu test.'); });
        }
      }, 'Verifică tabelul');
    }
  });

  /* ---------------- tipul „cattimpori” ---------------- */
  const listaScrisa = (s) => String(s || '').replace(/[„”"“]/g, '').split(/[\s,;]+/).map(x => x.trim()).filter(Boolean);
  const CATTIMPORI = {
    render(Q, body, api) {
      stilT();
      const T = teste(Q.prog, Q.date || {});
      const cere = Q.cere || 'ori';
      const nr = cere === 'teste' ? T.randuri.length : T.treceri;
      const afisari = T.afisari.map(F);
      const eticheta = cere === 'ori' ? `<label>Corpul (rândurile de sub „cât timp”) se execută de <input data-o autocomplete="off" inputmode="numeric" aria-label="De câte ori se execută corpul"> ori.</label>`
        : cere === 'teste' ? `<label>Condiția se verifică de <input data-o autocomplete="off" inputmode="numeric" aria-label="De câte ori se verifică condiția"> ori.</label>`
          : `<label>Se afișează, în ordine: <input class="lat" data-o autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Ce se afișează, în ordine"></label>`;
      body.innerHTML = `${UA.listare(Q.prog)}${Q.date && Object.keys(Q.date).length ? `<div class="ua-dat">Datele de intrare: ${esc(dateText(Q.date))}</div>` : ''}
        <p class="uct-ori">${eticheta}</p>
        <p class="ua-nota">${cere === 'afisari' ? 'Scrie numerele în ordine, cu spații între ele (de exemplu 1 2 3).' : 'Scrie doar numărul (poate fi și 0).'}</p>`;
      const inp = body.querySelector('[data-o]');
      inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); const b = document.getElementById('chk'); if (b) b.click(); } });
      const bun = () => {
        if (cere !== 'afisari') return UA.potriveste(inp.value.replace(/\s*(de\s+)?ori\.?$/i, ''), nr);
        const l = listaScrisa(inp.value);
        return l.length === afisari.length && l.every((x, i) => UA.potriveste(x, T.afisari[i]));
      };
      body._bun = () => (cere !== 'afisari' ? String(nr) : afisari.join(' '));
      body._rau = () => (cere !== 'afisari' ? String(nr === 0 ? 1 : nr + 1) : afisari.concat(afisari.slice(-1)).join(' '));
      const nav = api.checkButton(() => {
        const ok = bun();
        anunta({tip: 'cattimpori', bune: ok ? 1 : 0, total: 1, ok});
        if (ok) { nav.innerHTML = ''; api.resolve(true); }
        else {
          const l = listaScrisa(inp.value);
          const m = inp.value.trim() === '' ? 'Scrie răspunsul în căsuță.'
            : cere === 'ori' ? 'Fă tabelul: la fiecare test pui în condiție valorile de ACUM. Numără doar testele adevărate: după fiecare vine o trecere. Dacă primul test e fals, corpul se execută de 0 ori.'
              : cere === 'teste' ? 'Fă tabelul: numără TOATE testele, și pe ultimul, cel fals, la care repetiția se oprește.'
                : l.length !== afisari.length ? `Ai scris ${l.length} ${l.length === 1 ? 'număr' : 'numere'}. Fă tabelul: un „Afișează” din corp se execută o dată la fiecare trecere, iar unul de după „sfârșit cât timp”, o singură dată.`
                  : 'Calculează, la fiecare trecere, cu valorile de ACUM.';
          api.resolve(false, m);
          api.revealButton(() => { inp.value = body._bun(); nav.innerHTML = ''; api.giveUp(`<code>${esc(body._bun())}</code>`); });
        }
      }, 'Verifică');
    },
    rezolva(Q, body) { body.querySelector('[data-o]').value = body._bun(); },
    gresit(Q, body) { body.querySelector('[data-o]').value = body._rau(); }
  };

  window.UrmarireCatTimp = {versiune: VERSIUNE, teste, tabelTeste, tipuri: {cattimpori: CATTIMPORI}};
})();
