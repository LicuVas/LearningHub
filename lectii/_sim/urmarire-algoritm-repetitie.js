/* lectii/_sim/urmarire-algoritm-repetitie.js — structura „pentru” (repetiția cu contor) în notația clasei și tabelul
   de urmărire PE TRECERI. Se încarcă DUPĂ lectii/_sim/urmarire-algoritm.js (VI/17); nu schimbă nimic din el: doar
   UrmarireAlgoritm.instructiune(...) și UrmarireAlgoritm.mod(...), cum a lăsat VI/17 („Pentru lecția următoare”).

   PROPRIETAR: lecția VI/20 (lectii/vi/m3-l20, „Structura repetitivă cu contor”, 24.10.2026). VI/21-26 (cât timp, repetă
   până când, probleme cu repetiție) adaugă rândurile lor dintr-un fișier NOU și NU schimbă ce e scris aici.
   Granița: _campaign/revizuire_completa_2026_09/m3_noapte_23_10/granite/vi_l20.md.

   NOTAȚIA (aleasă de VI/20: documentele profesorului nu o dau; vezi lectii/vi/m3-l20/surse.md, „Pentru profesor”):
       s ← 0
       pentru i ← 1, n execută         contorul i ia pe rând valorile 1, 2, …, n (pasul e 1); corpul = rândurile de sub
          s ← s + i                     el, MAI LA DREAPTA (ca la „Dacă” în VI/17)
       sfârșit pentru                  rândul de închidere, sub „pentru”, la aceeași margine (se primește și „■”, forma
       Afișează s                      jocului algoritmi-vi; fără rând de închidere, corpul se termină unde se termină
                                       rândurile mai la dreapta)
   Valoarea inițială și cea finală pot fi calcule cu date cunoscute („pentru i ← 1, n execută”). Dacă inițiala e mai mare
   decât finala, corpul nu se execută deloc. După ultima trecere, contorul rămâne la valoarea finală (lecția nu-l
   folosește după repetiție). Litere mici / mari, cu sau fără diacritice, „<-” în loc de „←”: primite, ca la VI/17.
   Peste 2000 de pași: mesajul de finitudine al lui VI/17.

   API PUBLIC (window.UrmarireRepetitie; stabil de la 24.10.2026, orice schimbare se trece în graniță, cu data):
     versiune
     treceri(prog, date) → {contor, rand, coloane:[nume…], inainte:{nume: valoare}, randuri:[{k, valori:{…}, afis:[…]}],
                            final:[afișările de după repetiție], afisari:[toate]}
                           (PRIMUL „pentru” de pe marginea stângă; aruncă {mesaj, rand} ca UrmarireAlgoritm.ruleaza)
     tabelTreceri(prog, date, {coloane?}) → HTML: tabelul pe treceri, COMPLETAT (exemplele din pași)
     tipuri.decateori    {t:'decateori', q, prog, date?:{…}, cere:'ori'|'afisari', ajutor, why}
                         elevul scrie de câte ori se execută corpul (cere:'ori') sau ce se afișează, în ordine
                         (cere:'afisari'; despărțite prin spații sau virgule). Verificarea RULEAZĂ algoritmul.
   Modul nou al tipului UrmarireAlgoritm.tipuri.urmarire:  {t:'urmarire', mod:'treceri', q, prog, date:[{…}, …],
       coloane?:['i', 's'], facut?:1 (câte treceri sunt completate dinainte), ajutor, why}
     Un rând „la început” (valorile de dinainte, completate) + câte un rând pe trecere (contorul + datele schimbate în
     corp + „se afișează”, dacă în corp e un Afișează) + „La final se afișează”, dacă după repetiție e un Afișează.
     Testele: câte unul pe trecere. Mesajele folosesc cuvintele VI/17 („cu valorile de ACUM”).
     Pentru poartă: body._ua = {ck:[{id, exp, tip}], Q} și body._umple(), ca tipul „urmarire” al VI/17.
   EXTINDERE (VI/21): rândurile voastre de repetiție notează trecerile cu ctx.noteaza(r, val, {trecere:k, faza:'inceput'})
     la începutul trecerii și ctx.noteaza(r, undefined, {trecere:k, faza:'sfarsit', valori:{...ctx.v}, afis:[…]}) la
     sfârșitul ei, iar înainte de prima trecere ctx.noteaza(r, undefined, {faza:'inainte', valori:{...ctx.v}}); atunci
     treceri() și modul „treceri” merg și pentru ele (tipul rândului se dă în `tipuriRepetitie`).
*/
(function () {
  'use strict';
  if (window.UrmarireRepetitie) return;
  const UA = window.UrmarireAlgoritm;
  if (!UA) throw new Error('urmarire-algoritm-repetitie.js: încarcă întâi lectii/_sim/urmarire-algoritm.js');
  const VERSIUNE = '1.0 (24.10.2026)';
  const {esc, stil, dateText, anunta, alegeDate} = UA._intern;
  const Gr = (mesaj, rand) => ({mesaj, rand, greseala: true});
  const NUME = String.raw`[\p{L}_][\p{L}\p{M}\d_]*`;
  const tipuriRepetitie = new Set(['pentru']);

  /* rândul de închidere: „sfârșit pentru” (sau „■”) */
  UA.instructiune({tip: 'sfpentru', re: /^(?:sfârșit\s+pentru|■)\.?$/iu, executa(nod) {
    throw Gr('„sfârșit pentru” închide un „pentru”: pune-l sub rândul „pentru …”, la aceeași margine.', nod.r.i);
  }});
  UA.instructiune({
    tip: 'pentru', bloc: true,
    re: new RegExp(String.raw`^pentru\s+(${NUME})\s*(?:←|<-)\s*(.+?)\s*,\s*(.+?)\s+execută\.?$`, 'iu'),
    prinde: m => ({contor: m[1], de: m[2], pana: m[3]}),
    dupaBloc(nod, rr, getK, setK) {
      const k = getK(), r = nod.r;
      const ultim = nod.copii[nod.copii.length - 1];
      if (k < rr.length && rr[k].tip === 'sfpentru' && rr[k].ind <= r.ind + 1) { nod.rSf = rr[k]; setK(k + 1); }
      else if (ultim && ultim.r.tip === 'sfpentru') { nod.rSf = ultim.r; nod.copii.pop(); }   // închiderea scrisă mai la dreapta
    },
    executa(nod, ctx) {
      const r = nod.r;
      if (/,/.test(r.pana)) throw Gr('aici contorul crește mereu cu 1: după virgulă vine doar valoarea finală.', r.i);
      const a = ctx.evalueaza(r.de, r), b = ctx.evalueaza(r.pana, r);
      if (typeof a !== 'number' || typeof b !== 'number') throw Gr('după „←” vin două numere: valoarea inițială și valoarea finală a contorului.', r.i);
      if (!nod.copii.length) throw Gr('sub „pentru” trebuie cel puțin un rând mai la dreapta: ce se repetă.', r.i);
      ctx.noteaza(r, undefined, {faza: 'inainte', valori: Object.assign({}, ctx.v)});
      let k = 0;
      for (let i = a; i <= b; i++) {
        k++;
        ctx.v[r.contor] = i;
        const af0 = ctx.afisari.length;
        ctx.noteaza(r, i, {trecere: k, faza: 'inceput'});
        ctx.executa(nod.copii);
        ctx.noteaza(r, undefined, {trecere: k, faza: 'sfarsit', valori: Object.assign({}, ctx.v), afis: ctx.afisari.slice(af0)});
      }
      if (nod.rSf) ctx.noteaza(nod.rSf);
    }
  });

  /* ---------------- trecerile (din jurnalul rulării) ---------------- */
  const SET_IN = (A, rand) => {   // numele atribuite în corpul repetiției care începe pe rândul `rand`, în ordine
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
  function treceri(prog, date) {
    const A = typeof prog === 'object' && prog.arbore ? prog : UA.analizeaza(prog);
    const R = UA.ruleaza(A, date || {});
    const prim = A.arbore.find(n => tipuriRepetitie.has(n.r.tip));
    if (!prim) throw Gr('algoritmul nu are o repetiție pe marginea din stânga.', 0);
    const rand = prim.r.i;
    const {out} = SET_IN(A, rand);
    const coloane = [prim.r.contor].concat(out.filter(x => x !== prim.r.contor));
    const j = R.jurnal.filter(e => e.i === rand);
    const ina = j.find(e => e.faza === 'inainte');
    const randuri = j.filter(e => e.faza === 'sfarsit').map(e => ({k: e.trecere, valori: e.valori, afis: e.afis || []}));
    let final = [];
    const ultim = R.jurnal.map((e, x) => ({e, x})).filter(o => o.e.i === rand).pop();
    if (ultim) final = R.jurnal.slice(ultim.x + 1).filter(e => e.tip === 'afis').map(e => e.val);
    return {contor: prim.r.contor, rand, coloane, inainte: ina ? ina.valori : {}, randuri, final, afisari: R.afisari,
      corpAfiseaza: areAfis(prim), R, A};
  }
  const F = UA.format;
  const cel = (v) => v === undefined ? '–' : esc(F(v));
  const caut = (vals, nume) => { if (nume in vals) return vals[nume]; const k = Object.keys(vals).find(x => x.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase() === nume.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()); return k ? vals[k] : undefined; };

  function stilT() {
    stil();
    if (document.getElementById('ur-stil')) return;
    const e = document.createElement('style'); e.id = 'ur-stil';
    e.textContent = `
.ur-t{border-collapse:collapse;font-size:.92rem;margin:.4em 0;min-width:60%}
.ur-t th,.ur-t td{border:1px solid var(--line);padding:5px 8px;text-align:center;vertical-align:middle}
.ur-t th{background:var(--paper2);font-weight:700;font-family:var(--fm,monospace)}
.ur-t th.tr,.ur-t td.tr{text-align:left;font-family:inherit;white-space:nowrap}
.ur-t td.dinainte{color:var(--ink2);background:var(--paper2)}
.ur-t td.ok{background:var(--okbg)} .ur-t td.no{background:var(--badbg)}
.ur-t input{font:inherit;font-family:var(--fm,monospace);width:4.6em;max-width:100%;min-height:34px;padding:3px 5px;border:1.5px solid var(--line);border-radius:5px;background:var(--paper);color:var(--ink);box-sizing:border-box;text-align:center}
.ur-t input.lat{width:7.5em}
.ur-fin{margin:.5em 0}
.ur-fin input{font:inherit;font-family:var(--fm,monospace);width:6em;min-height:34px;padding:3px 6px;border:1.5px solid var(--line);border-radius:5px;background:var(--paper);color:var(--ink);box-sizing:border-box}
.ur-fin.ok input{background:var(--okbg)} .ur-fin.no input{background:var(--badbg)}
.ur-ori{margin:.5em 0} .ur-ori input{font:inherit;font-family:var(--fm,monospace);width:5em;min-height:34px;padding:3px 6px;border:1.5px solid var(--accent);border-radius:5px;background:var(--paper);color:var(--ink);box-sizing:border-box}
.ur-ori input.lat{width:12em;max-width:70vw}
@media (max-width:560px){.ur-t{font-size:.86rem}.ur-t th,.ur-t td{padding:4px 4px}.ur-t input{width:3.6em}.ur-t input.lat{width:5.5em}}`;
    document.head.appendChild(e);
  }

  /* tabelul completat (pașii lecției) */
  function tabelTreceri(prog, date, opt) {
    stilT();
    const T = treceri(prog, date);
    const col = (opt && opt.coloane) || T.coloane;
    const afis = T.corpAfiseaza;
    const head = `<tr><th class="tr">Trecerea</th>${col.map(c => `<th>${esc(c)}</th>`).join('')}${afis ? '<th>se afișează</th>' : ''}</tr>`;
    const r0 = `<tr><td class="tr">la început</td>${col.map(c => `<td>${c === T.contor ? '–' : cel(caut(T.inainte, c))}</td>`).join('')}${afis ? '<td>–</td>' : ''}</tr>`;
    const rs = T.randuri.map(r => `<tr><td class="tr">${r.k}</td>${col.map(c => `<td>${cel(caut(r.valori, c))}</td>`).join('')}${afis ? `<td>${esc(r.afis.map(F).join(', '))}</td>` : ''}</tr>`).join('');
    const fin = T.final.length ? `<p class="ur-fin">La final se afișează: <b>${esc(T.final.map(F).join(', '))}</b></p>` : '';
    return `<div class="ua-tw"><table class="ur-t"><thead>${head}</thead><tbody>${r0}${rs}</tbody></table></div>${fin}`;
  }

  /* ---------------- modul „treceri” al tipului urmarire ---------------- */
  UA.mod('treceri', {
    render(Q, body, api) {
      stilT();
      const d = alegeDate(Q)[0] || {};
      const T = treceri(Q.prog, d);
      const col = Q.coloane || T.coloane, afis = T.corpAfiseaza, facut = Q.facut || 0;
      const ck = [];
      const head = `<tr><th class="tr">Trecerea</th>${col.map(c => `<th>${esc(c)}</th>`).join('')}${afis ? '<th>se afișează</th>' : ''}</tr>`;
      const r0 = `<tr><td class="tr">la început</td>${col.map(c => `<td class="dinainte">${c === T.contor ? '–' : cel(caut(T.inainte, c))}</td>`).join('')}${afis ? '<td class="dinainte">–</td>' : ''}</tr>`;
      const rs = T.randuri.map((r, x) => {
        const gata = x < facut;
        const cells = col.map(c => {
          const exp = caut(r.valori, c), id = `t${r.k}-${c}`;
          if (gata) return `<td class="dinainte">${cel(exp)}</td>`;
          ck.push({id, k: r.k, col: c, exp, tip: 'set', contor: c === T.contor});
          return `<td data-c="${esc(id)}"><input data-i="${esc(id)}" autocomplete="off" autocapitalize="off" spellcheck="false" inputmode="numeric" aria-label="Trecerea ${r.k}: ${esc(c)}"></td>`;
        }).join('');
        let ca = '';
        if (afis) {
          const exp = r.afis.map(F).join(', '), id = `t${r.k}-afis`;
          if (gata) ca = `<td class="dinainte">${esc(exp)}</td>`;
          else { ck.push({id, k: r.k, col: 'afis', exp: r.afis.length === 1 ? r.afis[0] : exp, tip: 'afis'}); ca = `<td data-c="${id}"><input class="lat" data-i="${id}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Trecerea ${r.k}: ce se afișează"></td>`; }
        }
        return `<tr><td class="tr">${r.k}</td>${cells}${ca}</tr>`;
      }).join('');
      let fin = '';
      if (T.final.length) {
        const exp = T.final.length === 1 ? T.final[0] : T.final.map(F).join(', ');
        ck.push({id: 'fin', k: 'fin', col: 'fin', exp, tip: 'afis'});
        fin = `<p class="ur-fin" data-c="fin"><label>La final se afișează: <input data-i="fin" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Ce se afișează la final"></label></p>`;
      }
      const pas = [...new Set(ck.map(c => c.k))];
      body.innerHTML = `${UA.listare(Q.prog)}${Object.keys(d).length ? `<div class="ua-dat">Datele de intrare: ${esc(dateText(d))}</div>` : ''}
        <div class="ua-tw"><table class="ur-t sim"><thead>${head}</thead><tbody>${r0}${rs}</tbody></table></div>${fin}
        <p class="ua-nota">Pe fiecare rând: întâi contorul, apoi calculezi cu valorile de pe rândul de deasupra și cu contorul de pe rândul acesta. Scrie doar numărul.</p>
        <div class="ua-lbl">Testele</div><ul class="ua-teste">${pas.map(k => `<li data-t="${k}">${k === 'fin' ? 'Ce se afișează la final' : `Trecerea ${k}: ${col.map(esc).join(', ')}${afis ? ' și ce se afișează' : ''}`}</li>`).join('')}</ul>`;
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
          const ok = UA.potriveste(val, c.exp);
          if (ok) bune++;
          else {
            rau.add(c.k);
            const unde = c.k === 'fin' ? 'la final' : `trecerea ${c.k}, coloana ${c.col === 'afis' ? '„se afișează”' : c.col}`;
            if (val.trim() === '') motive.push(`${unde}: completează căsuța`);
            else if (c.contor) motive.push(`${unde}: contorul pornește de la valoarea inițială și crește cu 1 la fiecare trecere`);
            else if (c.k === 'fin') motive.push(`${unde}: se afișează valoarea de după ultima trecere`);
            else if (c.col === 'afis') motive.push(`${unde}: se afișează valoarea de ACUM, cu contorul de pe rândul acesta`);
            else motive.push(`${unde}: calculează cu valorile de ACUM: ${c.col} de pe rândul de deasupra și contorul de pe rândul acesta`);
          }
          const td = body.querySelector(`[data-c="${c.id}"]`);
          if (td) td.classList.toggle('ok', ok), td.classList.toggle('no', !ok);
        });
        pas.forEach(k => { const li = body.querySelector(`li[data-t="${k}"]`); if (li) li.className = rau.has(k) ? 'no' : 'ok'; });
        return {bune, motive, ok: bune === ck.length};
      };
      const umple = () => ck.forEach(c => { const e = el(c.id); if (e) e.value = typeof c.exp === 'string' ? c.exp : F(c.exp); });
      body._umple = umple;
      const nav = api.checkButton(() => {
        const {bune, motive, ok} = marcheaza();
        anunta({tip: 'urmarire-treceri', bune, total: ck.length, ok});
        if (ok) { nav.innerHTML = ''; api.resolve(true); }
        else {
          api.resolve(false, `${bune} din ${ck.length} căsuțe sunt bune. ${motive.slice(0, 2).map(m => m[0].toUpperCase() + m.slice(1)).join('. ')}.`);
          api.revealButton(() => { umple(); marcheaza(); nav.innerHTML = ''; api.giveUp('valorile corecte sunt acum în tabel, cu verde. Parcurge-le trecere cu trecere.'); });
        }
      }, 'Verifică tabelul');
    }
  });

  /* ---------------- tipul „decateori” ---------------- */
  const listaScrisa = (s) => String(s || '').replace(/[„”"“]/g, '').split(/[\s,;]+/).map(x => x.trim()).filter(Boolean);
  const DECATEORI = {
    render(Q, body, api) {
      stilT();
      const T = treceri(Q.prog, Q.date || {});
      const ori = T.randuri.length, afisari = T.afisari.map(F);
      const cere = Q.cere || 'ori';
      body.innerHTML = `${UA.listare(Q.prog)}${Q.date && Object.keys(Q.date).length ? `<div class="ua-dat">Datele de intrare: ${esc(dateText(Q.date))}</div>` : ''}
        <p class="ur-ori">${cere === 'ori'
          ? `<label>Rândurile de sub „pentru” se execută de <input data-o autocomplete="off" inputmode="numeric" aria-label="De câte ori se execută"> ori.</label>`
          : `<label>Se afișează, în ordine: <input class="lat" data-o autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Ce se afișează, în ordine"></label>`}</p>
        <p class="ua-nota">${cere === 'ori' ? 'Scrie doar numărul.' : 'Scrie numerele în ordine, cu spații între ele (de exemplu 1 2 3).'}</p>`;
      const inp = body.querySelector('[data-o]');
      inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); const b = document.getElementById('chk'); if (b) b.click(); } });
      const bun = () => {
        if (cere === 'ori') return UA.potriveste(inp.value.replace(/\s*(de\s+)?ori\.?$/i, ''), ori);
        const l = listaScrisa(inp.value);
        return l.length === afisari.length && l.every((x, i) => UA.potriveste(x, T.afisari[i]));
      };
      body._bun = () => (cere === 'ori' ? String(ori) : afisari.join(' '));
      body._rau = () => (cere === 'ori' ? String(ori + 1) : afisari.slice(0, -1).join(' '));
      const nav = api.checkButton(() => {
        const ok = bun();
        anunta({tip: 'decateori', bune: ok ? 1 : 0, total: 1, ok});
        if (ok) { nav.innerHTML = ''; api.resolve(true); }
        else {
          const l = listaScrisa(inp.value);
          const m = inp.value.trim() === '' ? 'Scrie răspunsul în căsuță.'
            : cere === 'ori' ? 'Scrie, pe rând, valorile contorului, de la cea inițială la cea finală, și numără-le.'
              : l.length !== afisari.length ? `Ai scris ${l.length} ${l.length === 1 ? 'număr' : 'numere'}. Scrie câte unul pentru fiecare trecere: contorul ia pe rând toate valorile de la cea inițială la cea finală.`
                : 'Calculează, la fiecare trecere, cu valoarea de ACUM a contorului.';
          api.resolve(false, m);
          api.revealButton(() => { inp.value = body._bun(); nav.innerHTML = ''; api.giveUp(`<code>${esc(body._bun())}</code>`); });
        }
      }, 'Verifică');
    },
    rezolva(Q, body) { body.querySelector('[data-o]').value = body._bun(); },
    gresit(Q, body) { body.querySelector('[data-o]').value = body._rau(); }
  };

  window.UrmarireRepetitie = {versiune: VERSIUNE, treceri, tabelTreceri, tipuri: {decateori: DECATEORI}, tipuriRepetitie};
})();
