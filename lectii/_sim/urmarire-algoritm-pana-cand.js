/* lectii/_sim/urmarire-algoritm-pana-cand.js — structura „repetă … până când” (repetiția cu test FINAL) în notația
   clasei și tabelul de urmărire PE TRECERI (corpul, apoi testul, pe același rând).
   Se încarcă DUPĂ lectii/_sim/urmarire-algoritm.js (VI/17); merge și împreună cu urmarire-algoritm-repetitie.js (VI/20)
   și urmarire-algoritm-cattimp.js (VI/21), în orice ordine. Nu schimbă nimic din ele: doar
   UrmarireAlgoritm.instructiune(...) și UrmarireAlgoritm.mod(...).

   PROPRIETAR: lecția VI/22 (lectii/vi/m4-l22, „Structura repetitivă condiționată posterior (cu test final)”, 26.10.2026).
   VI/23-26 adaugă rândurile lor dintr-un fișier NOU și NU schimbă ce e scris aici.
   Granița: _campaign/revizuire_completa_2026_09/m4_26_10/granite/vi_l22.md.

   NOTAȚIA (forma jocului jocuri/algoritmi-vi, nivelul 5, și a manualelor; cuvintele lecțiilor 20-21: corp, trecere, test):
       x ← 3
       repetă                          rândul „repetă”, singur
          x ← x + 5                     corpul: rândurile de sub el, MAI LA DREAPTA; se execută întâi
       până când x > 20                 testul, DUPĂ fiecare trecere, la aceeași margine cu „repetă”:
       Afișează x                       falsă → încă o trecere; adevărată → gata, algoritmul merge sub „până când”.
   Corpul se execută deci CEL PUȚIN O DATĂ (și când condiția e adevărată de la început).
   Condiția = orice condiție a VI/17 (< ≤ > ≥ = ≠, ȘI SAU NU). Fără diacritice („repeta … pana cand”) și cu litere mari:
   primite. „până când” scris mai la dreapta, ca ultim rând al corpului: primit tot ca test (ca „sfârșit cât timp” al
   VI/21). Peste 2000 de pași: mesajul de finitudine al VI/17 („algoritmul nu se oprește (finitudinea!)”).

   CITEȘTE CU MAI MULTE VALORI (pentru „validarea unui răspuns”): cu date:{nota:[12, 0, 9]}, fiecare execuție a lui
   „Citește nota” ia valoarea URMĂTOARE din șir (12, apoi 0, apoi 9); dacă șirul s-a terminat și algoritmul mai citește,
   mesaj pe ecran. Cu o valoare simplă (date:{n:5}), „Citește” face exact ce face în VI/17 (același text în jurnal).
   (Rândul „Citește …” e înregistrat aici din nou, cu același tip 'cit', aceeași formă și același jurnal; doar paginile
   care încarcă fișierul acesta îl primesc.)

   API PUBLIC (window.UrmarirePanaCand; stabil de la 26.10.2026, orice schimbare se trece în graniță, cu data):
     versiune
     treceri(prog, date) → {cond, rand, coloane:[nume…], inainte:{…}, randuri:[{k, valori:{…}, afis:[…], cond:true|false}],
                           treceri (= numărul de teste), final:[afișările de după], afisari:[toate], corpAfiseaza, R, A}
                           (PRIMUL „repetă” de pe marginea stângă; aruncă {mesaj, rand} ca UrmarireAlgoritm.ruleaza)
     tabelTreceri(prog, date, {coloane?}) → HTML: tabelul pe treceri, COMPLETAT (exemplele din pași)
     dateText(date) → text: „nota: 12, apoi 0, apoi 9” (șirurile) / „n = 5” (valorile simple)
     tipuri.panaori      {t:'panaori', q, prog, date?:{…}, cere:'ori'|'afisari', ajutor, why}
                         elevul scrie de câte ori se execută corpul (cere:'ori'; la test final, cel puțin 1) sau ce se
                         afișează, în ordine (cere:'afisari'). Verificarea RULEAZĂ algoritmul.
   Modul nou al tipului UrmarireAlgoritm.tipuri.urmarire: {t:'urmarire', mod:'pana', q, prog, date:[{…}, …],
       coloane?:['x'], facut?:1 (câte treceri sunt completate dinainte), inPlus?:1 (rânduri în plus, după oprire), ajutor, why}
     Un rând „la început” (completat) + câte un rând pe trecere: valorile de după corp, ce se afișează (dacă e cazul) și
     testul (alege… / adevărat / fals), calculat cu valorile NOI de pe ACELAȘI rând; după testul adevărat, rândurile
     „în plus” rămân cu totul goale. „La final se afișează”, dacă e un Afișează după „până când”.
     Pentru poartă: body._ua = {ck:[{id, exp, tip}], Q} și body._umple(), ca tipul „urmarire” al VI/17.
   JURNALUL (pentru cine extinde): înainte de prima trecere ctx.noteaza(rRepeta, undefined, {faza:'inainte', valori});
     la fiecare trecere {trecere:k, faza:'inceput'} pe „repetă”, apoi corpul, apoi pe rândul „până când”:
     ctx.noteaza(rPana, c, {test:k, trecere:k, faza:'test', cond:c, valori, afis}).
   NU e în UrmarireRepetitie.tipuriRepetitie (modul „treceri” al VI/20 cere un contor).

   1.1 (26.10.2026, reparația după judecata 1 a VI/22; API-ul de mai sus NESCHIMBAT, doar textele și primirea răspunsurilor):
     - modul „pana”: nota de sub tabel și motivul unei căsuțe greșite spun adevărul pe FELUL coloanei: scrisă de un
       „Citește” din corp → „ia următoarea valoare din Datele de intrare”; calculată → „cu valorile de pe rândul de
       deasupra” (înainte, tabelul validării primea „calculează cu valorile de pe rândul de deasupra”, fals);
     - „panaori”, cere:'ori': primește și „de 3 ori”, „3 ori”, „trei”, „de trei ori”, „o dată”, „o singură dată”,
       „Corpul se execută de 3 ori”; ce nu e un număr primește „Scrie numărul, cu cifre”;
     - „panaori”, cere:'afisari': despărțite și prin „și”, „apoi”, cratimă între cifre („10-7-4-1”), liniuță cu spații;
       cuvintele („Se afișează”, „k =”) se lasă deoparte; mesajul „Ai scris N numere” numără doar numerele.
     - _intern.oriScris(text) / _intern.afisariScrise(text): pentru probele fără browser (nu pentru lecții).
   1.2 (26.10.2026, trecerea după judecata 2 a VI/22, punctul M; API NESCHIMBAT): „de câte ori” caută întâi textul întreg
     în dicționar, apoi taie „ori / dată / treceri”: „niciodată”, „nici o dată”, „nicio dată”, „nicio trecere” → 0, deci
     mesajul pentru 0 treceri („testul vine DUPĂ corp…”), nu „Scrie numărul, cu cifre”.
*/
(function () {
  'use strict';
  if (window.UrmarirePanaCand) return;
  const UA = window.UrmarireAlgoritm;
  if (!UA) throw new Error('urmarire-algoritm-pana-cand.js: încarcă întâi lectii/_sim/urmarire-algoritm.js');
  const VERSIUNE = '1.2 (26.10.2026)';
  const {esc, stil, anunta, alegeDate} = UA._intern;
  const F = UA.format;
  const Gr = (mesaj, rand) => ({mesaj, rand, greseala: true});
  const copie = (v) => Object.assign({}, v);

  /* ---------------- „Citește” cu șiruri de valori (validarea) ---------------- */
  UA.instructiune({
    tip: 'cit',
    re: /^citește\s+(.+?)\.?$/iu,
    prinde: m => ({nume: m[1].split(/\s*,\s*|\s+și\s+|\s+si\s+/u).filter(Boolean)}),
    executa(nod, ctx) {
      const r = nod.r;
      const lip = r.nume.filter(x => !(x in ctx.date));
      if (lip.length) throw Gr(`lipsesc datele de intrare: ${lip.join(', ')}.`, r.i);
      if (!ctx._citK) ctx._citK = {};
      r.nume.forEach(x => {
        const d = ctx.date[x];
        if (Array.isArray(d)) {
          const i = ctx._citK[x] || 0;
          if (i >= d.length) throw Gr(`datele de intrare pentru ${x} s-au terminat: algoritmul mai citește, dar nu mai e nicio valoare.`, r.i);
          ctx.v[x] = d[i]; ctx._citK[x] = i + 1;
        } else ctx.v[x] = d;
      });
      ctx.noteaza(r, r.nume.map(x => `${x} = ${F(ctx.v[x])}`).join(', '));
    }
  });

  /* ---------------- „până când …” (testul) și „repetă” (blocul) ---------------- */
  UA.instructiune({tip: 'pana', re: /^până\s+când\s+(.+?)\.?$/iu, prinde: m => ({cond: m[1]}), executa(nod) {
    throw Gr('„până când …” încheie un „repetă”: pune-l sub rândurile care se repetă, la aceeași margine cu „repetă”.', nod.r.i);
  }});
  UA.instructiune({
    tip: 'repeta', bloc: true,
    re: /^repetă\.?$/iu,
    dupaBloc(nod, rr, getK, setK) {
      const k = getK(), r = nod.r;
      const ultim = nod.copii[nod.copii.length - 1];
      if (k < rr.length && rr[k].tip === 'pana' && rr[k].ind <= r.ind + 1) { nod.rPana = rr[k]; setK(k + 1); }
      else if (ultim && ultim.r.tip === 'pana') { nod.rPana = ultim.r; nod.copii.pop(); }   // „până când” scris mai la dreapta
    },
    executa(nod, ctx) {
      const r = nod.r;
      if (!nod.copii.length) throw Gr('sub „repetă” trebuie cel puțin un rând mai la dreapta: ce se repetă.', r.i);
      if (!nod.rPana) throw Gr('după rândurile care se repetă vine „până când” și condiția de oprire, la aceeași margine cu „repetă”.', r.i);
      const rp = nod.rPana;
      ctx.noteaza(r, undefined, {faza: 'inainte', valori: copie(ctx.v)});
      for (let k = 1; ; k++) {
        const af0 = ctx.afisari.length;
        ctx.noteaza(r, undefined, {trecere: k, faza: 'inceput'});
        ctx.executa(nod.copii);
        const c = ctx.evalueaza(rp.cond, rp);
        if (typeof c !== 'boolean') throw Gr('după „până când” vine o condiție: o comparație care dă adevărat sau fals.', rp.i);
        ctx.noteaza(rp, c, {test: k, trecere: k, faza: 'test', cond: c, valori: copie(ctx.v), afis: ctx.afisari.slice(af0)});
        if (c) break;
      }
    }
  });

  /* ---------------- trecerile (din jurnalul rulării) ---------------- */
  function coloaneCorp(nod) {
    const out = [];
    const w = (noduri) => noduri.forEach(n => {
      if (n.r.tip === 'cit') n.r.nume.forEach(x => { if (!out.includes(x)) out.push(x); });
      if (n.r.tip === 'set' && !out.includes(n.r.nume)) out.push(n.r.nume);
      if (n.copii) w(n.copii);
      if (n.altfel) w(n.altfel);
    });
    if (nod) w(nod.copii);
    return out;
  }
  /* 1.1: felul fiecărei coloane din corp — 'cit' (scrisă de un „Citește”), 'set' (calculată) sau 'cit+set' */
  function felColoane(nod) {
    const fel = {};
    const w = (noduri) => noduri.forEach(n => {
      if (n.r.tip === 'cit') n.r.nume.forEach(x => { fel[x] = fel[x] === 'set' ? 'cit+set' : (fel[x] || 'cit'); });
      if (n.r.tip === 'set') fel[n.r.nume] = fel[n.r.nume] && fel[n.r.nume] !== 'set' ? 'cit+set' : 'set';
      if (n.copii) w(n.copii);
      if (n.altfel) w(n.altfel);
    });
    if (nod) w(nod.copii);
    return fel;
  }
  const areAfis = (nod) => { let da = false; const w = ns => ns.forEach(n => { if (n.r.tip === 'afis') da = true; if (n.copii) w(n.copii); if (n.altfel) w(n.altfel); }); if (nod) w(nod.copii); return da; };
  function treceri(prog, date) {
    const A = typeof prog === 'object' && prog.arbore ? prog : UA.analizeaza(prog);
    const R = UA.ruleaza(A, date || {});
    const prim = A.arbore.find(n => n.r.tip === 'repeta');
    if (!prim) throw Gr('algoritmul nu are un „repetă” pe marginea din stânga.', 0);
    const rand = prim.r.i, rp = prim.rPana;
    if (!rp) throw Gr('„repetă” nu are „până când”.', rand);
    const ina = R.jurnal.find(e => e.i === rand && e.faza === 'inainte');
    const randuri = R.jurnal.filter(e => e.i === rp.i && e.faza === 'test').map(e => ({k: e.trecere, valori: e.valori, afis: e.afis || [], cond: e.cond}));
    let final = [];
    const ultim = R.jurnal.map((e, x) => ({e, x})).filter(o => o.e.i === rp.i && o.e.faza === 'test').pop();
    if (ultim) final = R.jurnal.slice(ultim.x + 1).filter(e => e.tip === 'afis').map(e => e.val);
    return {cond: rp.cond, rand, coloane: coloaneCorp(prim), inainte: ina ? ina.valori : {}, randuri, treceri: randuri.length,
      final, afisari: R.afisari, corpAfiseaza: areAfis(prim), R, A};
  }
  const cel = (v) => v === undefined ? '–' : esc(F(v));
  const caut = (vals, nume) => { if (!vals) return undefined; if (nume in vals) return vals[nume]; const k = Object.keys(vals).find(x => x.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase() === nume.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()); return k ? vals[k] : undefined; };
  const dateText = (d) => Object.entries(d || {}).map(([k, x]) => Array.isArray(x) ? `${k}: ${x.map(F).join(', apoi ')}` : `${k} = ${F(x)}`).join('; ');

  function stilP() {
    stil();
    if (document.getElementById('upc-stil')) return;
    const e = document.createElement('style'); e.id = 'upc-stil';
    e.textContent = `
.upc-t{border-collapse:collapse;font-size:.92rem;margin:.4em 0;min-width:60%}
.upc-t th,.upc-t td{border:1px solid var(--line);padding:5px 8px;text-align:center;vertical-align:middle}
.upc-t th{background:var(--paper2);font-weight:700;font-family:var(--fm,monospace)}
.upc-t th.tr,.upc-t td.tr{text-align:left;font-family:inherit;white-space:nowrap}
.upc-t td.dinainte{color:var(--ink2);background:var(--paper2)}
.upc-t td.ok{background:var(--okbg)} .upc-t td.no{background:var(--badbg)}
.upc-t input,.upc-t select{font:inherit;font-family:var(--fm,monospace);width:4.6em;max-width:100%;min-height:34px;padding:3px 5px;border:1.5px solid var(--line);border-radius:5px;background:var(--paper);color:var(--ink);box-sizing:border-box;text-align:center}
.upc-t select{width:auto;text-align:left}
.upc-t input.lat{width:7.5em}
.upc-fin{margin:.5em 0}
.upc-fin input{font:inherit;font-family:var(--fm,monospace);width:6em;min-height:34px;padding:3px 6px;border:1.5px solid var(--line);border-radius:5px;background:var(--paper);color:var(--ink);box-sizing:border-box}
.upc-fin.ok input{background:var(--okbg)} .upc-fin.no input{background:var(--badbg)}
.upc-ori{margin:.5em 0} .upc-ori input{font:inherit;font-family:var(--fm,monospace);width:5em;min-height:34px;padding:3px 6px;border:1.5px solid var(--accent);border-radius:5px;background:var(--paper);color:var(--ink);box-sizing:border-box}
.upc-ori input.lat{width:12em;max-width:70vw}
@media (max-width:560px){.upc-t{font-size:.84rem}.upc-t th,.upc-t td{padding:4px 3px}.upc-t input{width:3.4em}.upc-t input.lat{width:5.5em}.upc-t select{max-width:6.6em}}`;
    document.head.appendChild(e);
  }

  /* tabelul completat (pașii lecției): Trecerea | valorile după corp | (se afișează) | condiția ? */
  function tabelTreceri(prog, date, opt) {
    stilP();
    const T = treceri(prog, date);
    const col = (opt && opt.coloane) || T.coloane, afis = T.corpAfiseaza;
    const head = `<tr><th class="tr">Trecerea</th>${col.map(c => `<th>${esc(c)}</th>`).join('')}${afis ? '<th>se afișează</th>' : ''}<th>${esc(T.cond)} ?</th></tr>`;
    const r0 = `<tr><td class="tr">la început</td>${col.map(c => `<td>${cel(caut(T.inainte, c))}</td>`).join('')}${afis ? '<td>–</td>' : ''}<td>–</td></tr>`;
    const rs = T.randuri.map(r => `<tr><td class="tr">${r.k}</td>${col.map(c => `<td>${cel(caut(r.valori, c))}</td>`).join('')}${afis ? `<td>${esc(r.afis.map(F).join(', '))}</td>` : ''}<td>${r.cond ? 'adevărat: se oprește' : 'fals: încă o trecere'}</td></tr>`).join('');
    const fin = T.final.length ? `<p class="upc-fin">La final se afișează: <b>${esc(T.final.map(F).join(', '))}</b></p>` : '';
    return `<div class="ua-tw"><table class="upc-t"><thead>${head}</thead><tbody>${r0}${rs}</tbody></table></div>${fin}`;
  }

  /* ---------------- modul „pana” al tipului urmarire ---------------- */
  const OPRIT = /^(se\s+opre[sș]te|nu\s+se\s+mai\s+execut[aă])\.?$/iu;
  const potrivesteGol = (val) => UA.potriveste(val, '') || OPRIT.test(String(val || '').trim());
  UA.mod('pana', {
    render(Q, body, api) {
      stilP();
      const d = alegeDate(Q)[0] || {};
      const T = treceri(Q.prog, d);
      const col = Q.coloane || T.coloane, afis = T.corpAfiseaza, facut = Q.facut || 0, inPlus = Q.inPlus == null ? 1 : Q.inPlus;
      /* 1.1: nota și motivele spun adevărul pe felul coloanei (citită din date / calculată) */
      const fel = felColoane(T.A.arbore.find(n => n.r.tip === 'repeta'));
      const feluri = new Set(col.map(c => fel[Object.keys(fel).find(k => k.toLowerCase() === c.toLowerCase())] || 'set'));
      const citit = feluri.has('cit') || feluri.has('cit+set'), calculat = feluri.has('set') || feluri.has('cit+set');
      const corpNota = citit && calculat
        ? 'întâi corpul: „Citește” ia următoarea valoare din Datele de intrare, iar un calcul folosește valorile de pe rândul de deasupra; scrii valorile noi.'
        : citit ? 'întâi corpul: „Citește” ia următoarea valoare din Datele de intrare, în ordine; o scrii.'
          : 'întâi corpul, calculat cu valorile de pe rândul de deasupra; scrii valorile noi.';
      const motivCol = (c) => {
        const f = fel[Object.keys(fel).find(k => k.toLowerCase() === String(c).toLowerCase())] || 'set';
        return f === 'cit' ? '„Citește” ia următoarea valoare din Datele de intrare, în ordine'
          : f === 'cit+set' ? 'întâi „Citește” ia următoarea valoare din Datele de intrare, apoi faci calculul din corp'
            : 'calculează cu valorile de pe rândul de deasupra';
      };
      const ck = [];
      const head = `<tr><th class="tr">Trecerea</th>${col.map(c => `<th>${esc(c)}</th>`).join('')}${afis ? '<th>se afișează</th>' : ''}<th>${esc(T.cond)} ?</th></tr>`;
      const r0 = `<tr><td class="tr">la început</td>${col.map(c => `<td class="dinainte">${cel(caut(T.inainte, c))}</td>`).join('')}${afis ? '<td class="dinainte">–</td>' : ''}<td class="dinainte">–</td></tr>`;
      const rows = T.randuri.map(r => ({k: r.k, cond: r.cond, valori: r.valori, afis: r.afis}));
      for (let x = 0; x < inPlus; x++) rows.push({k: rows.length + 1, cond: '', valori: null, afis: [], inPlus: true});
      const sel = (id, k) => `<select data-i="${esc(id)}" aria-label="Trecerea ${k}: condiția"><option value="">alege…</option><option value="adevărat">adevărat</option><option value="fals">fals</option></select>`;
      const inp = (id, et, lat) => `<input${lat ? ' class="lat"' : ''} data-i="${esc(id)}" autocomplete="off" autocapitalize="off" spellcheck="false" inputmode="text" aria-label="${esc(et)}">`;
      const rs = rows.map((r, x) => {
        if (x < facut && !r.inPlus) {
          return `<tr><td class="tr">${r.k}</td>${col.map(c => `<td class="dinainte">${cel(caut(r.valori, c))}</td>`).join('')}${afis ? `<td class="dinainte">${esc(r.afis.map(F).join(', '))}</td>` : ''}<td class="dinainte">${r.cond ? 'adevărat' : 'fals'}</td></tr>`;
        }
        const cells = col.map(c => {
          const id = `p${r.k}-${c}`, exp = r.inPlus ? '' : caut(r.valori, c);
          ck.push({id, k: r.k, col: c, exp: exp === undefined ? '' : exp, tip: 'set', gol: !!r.inPlus, inPlus: !!r.inPlus});
          return `<td data-c="${esc(id)}">${inp(id, `Trecerea ${r.k}: ${c}`)}</td>`;
        }).join('');
        let ca = '';
        if (afis) {
          const id = `p${r.k}-afis`, exp = r.inPlus ? '' : (r.afis.length === 1 ? r.afis[0] : r.afis.map(F).join(', '));
          ck.push({id, k: r.k, col: 'afis', exp, tip: 'afis', gol: !!r.inPlus || !r.afis.length, inPlus: !!r.inPlus});
          ca = `<td data-c="${id}">${inp(id, `Trecerea ${r.k}: ce se afișează`, true)}</td>`;
        }
        const idc = `c${r.k}`;
        ck.push({id: idc, k: r.k, col: 'cond', exp: r.cond, tip: 'cond', inPlus: !!r.inPlus});
        return `<tr><td class="tr">${r.k}</td>${cells}${ca}<td data-c="${idc}">${sel(idc, r.k)}</td></tr>`;
      }).join('');
      let fin = '';
      if (T.final.length) {
        const exp = T.final.length === 1 ? T.final[0] : T.final.map(F).join(', ');
        ck.push({id: 'fin', k: 'fin', col: 'fin', exp, tip: 'afis'});
        fin = `<p class="upc-fin" data-c="fin"><label>La final se afișează: <input data-i="fin" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Ce se afișează la final"></label></p>`;
      }
      const ks = [...new Set(ck.map(c => c.k))];
      body.innerHTML = `${UA.listare(Q.prog)}${Object.keys(d).length ? `<div class="ua-dat">Datele de intrare: ${esc(dateText(d))}</div>` : ''}
        <div class="ua-tw"><table class="upc-t sim"><thead>${head}</thead><tbody>${r0}${rs}</tbody></table></div>${fin}
        <p class="ua-nota">Pe fiecare rând: ${corpNota} Apoi testul, cu valorile NOI, de pe același rând. Fals: încă o trecere, pe rândul următor. Adevărat: repetiția se oprește; pe rândurile de dedesubt nu mai scrii și nu mai alegi nimic.</p>
        <div class="ua-lbl">Testele</div><ul class="ua-teste">${ks.map(k => `<li data-t="${k}">${k === 'fin' ? 'Ce se afișează la final' : `Rândul trecerii ${k}`}</li>`).join('')}</ul>`;
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
            const unde = c.k === 'fin' ? 'la final' : `trecerea ${c.k}${c.tip === 'cond' ? ', testul' : `, coloana ${c.col === 'afis' ? '„se afișează”' : c.col}`}`;
            if (c.inPlus) motive.push(`${unde}: testul de pe rândul de deasupra a fost adevărat, deci repetiția s-a oprit: rândul acesta rămâne gol`);
            else if (c.tip === 'cond' && val === '') motive.push(`${unde}: alege adevărat sau fals`);
            else if (c.tip === 'cond') motive.push(`${unde}: pune în condiție valorile NOI, de pe același rând, și compară din nou`);
            else if (c.gol) motive.push(`${unde}: în trecerea aceasta nu se afișează nimic: căsuța rămâne goală`);
            else if (val.trim() === '') motive.push(`${unde}: corpul se execută la fiecare trecere: completează căsuța`);
            else if (c.k === 'fin') motive.push(`${unde}: se afișează valoarea de după ultima trecere`);
            else if (c.col === 'afis') motive.push(`${unde}: se afișează valoarea de ACUM, din trecerea aceasta`);
            else motive.push(`${unde}: ${motivCol(c.col)}`);
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
        anunta({tip: 'urmarire-pana', bune, total: ck.length, ok});
        if (ok) { nav.innerHTML = ''; api.resolve(true); }
        else {
          api.resolve(false, `${bune} din ${ck.length} căsuțe sunt bune. ${motive.slice(0, 2).map(m => m[0].toUpperCase() + m.slice(1)).join('. ')}.`);
          api.revealButton(() => { umple(); marcheaza(); nav.innerHTML = ''; api.giveUp('valorile corecte sunt acum în tabel, cu verde. Parcurge-le trecere cu trecere.'); });
        }
      }, 'Verifică tabelul');
    }
  });

  /* ---------------- tipul „panaori” ---------------- */
  /* 1.1: răspunsurile scrise în toate formele corecte (regula 23) */
  const fara = (s) => String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const NUM_CUV = {zero: 0, niciodata: 0, nicio: 0, niciuna: 0, unu: 1, una: 1, un: 1, o: 1, odata: 1, doi: 2, doua: 2, trei: 3, patru: 4, cinci: 5,
    sase: 6, sapte: 7, opt: 8, noua: 9, zece: 10, unsprezece: 11, doisprezece: 12, douasprezece: 12, treisprezece: 13,
    paisprezece: 14, cincisprezece: 15, saisprezece: 16, saptesprezece: 17, optsprezece: 18, nouasprezece: 19, douazeci: 20};
  /* „de câte ori”: „3”, „3 ori”, „de 3 ori”, „trei”, „de trei ori”, „o dată”, „o singură dată”, „3 treceri”,
     „Corpul se execută de 3 ori” → numărul; altceva → null */
  /* 1.2: un cuvânt din dicționar, scris și despărțit („nici o data” = „niciodata”, „o data” = „odata”) */
  const cuvNr = (t) => { const k = t.replace(/ /g, ''); return Object.prototype.hasOwnProperty.call(NUM_CUV, k) ? NUM_CUV[k] : undefined; };
  function oriScris(s) {
    let t = fara(s).replace(/[„”"“.!?]/g, ' ').replace(/\s+/g, ' ').trim();
    t = t.replace(/^(corpul\s+)?(se\s+(mai\s+)?executa\s+)?/, '').replace(/^de\s+/, '');
    /* 1.2: întâi textul întreg, abia apoi tai „ori / dată / treceri” (înainte, „niciodată” devenea „nicio” → necunoscut) */
    const intreg = cuvNr(t);
    if (intreg !== undefined) return intreg;
    t = t.replace(/\s*(de\s+)?(ori|data|dati|treceri|trecere|x)$/, '').replace(/^o\s+singura$/, 'o').trim();
    if (/^-?\d+$/.test(t)) return +t;
    const c = cuvNr(t);
    return c === undefined ? null : c;
  }
  /* „ce se afișează”: bucățile scrise, fără cuvinte („și”, „apoi”, „Se afișează”, „k =”); cratima dintre cifre și
     liniuța lungă despart numerele („10-7-4-1”), dar „-2” singur rămâne număr negativ */
  function afisariScrise(s) {
    const t = String(s || '').replace(/[„”"“]/g, ' ')
      .replace(/(\d)\s*[–—]\s*(?=[-−]?\d)/g, '$1 ')
      .replace(/(\d)-(?=[-−]?\d)/g, '$1 ')
      .replace(/=/g, ' ');
    return t.split(/[\s,;]+/).map(x => x.trim().replace(/[.!]+$/, ''))
      .filter(x => x && !/^[-–—]+$/.test(x) && !/^[\p{L}_]+$/u.test(x));
  }
  const listaScrisa = afisariScrise;
  const eNumar = (x) => /^[-−]?\d+(?:[.,]\d+)?$/.test(x);
  const PANAORI = {
    render(Q, body, api) {
      stilP();
      const T = treceri(Q.prog, Q.date || {});
      const cere = Q.cere || 'ori';
      const nr = T.treceri;
      const afisari = T.afisari.map(F);
      const eticheta = cere === 'ori'
        ? `<label>Corpul (rândurile dintre „repetă” și „până când”) se execută de <input data-o autocomplete="off" inputmode="numeric" aria-label="De câte ori se execută corpul"> ori.</label>`
        : `<label>Se afișează, în ordine: <input class="lat" data-o autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Ce se afișează, în ordine"></label>`;
      body.innerHTML = `${UA.listare(Q.prog)}${Q.date && Object.keys(Q.date).length ? `<div class="ua-dat">Datele de intrare: ${esc(dateText(Q.date))}</div>` : ''}
        <p class="upc-ori">${eticheta}</p>
        <p class="ua-nota">${cere === 'afisari' ? 'Scrie numerele în ordine, cu spații între ele (de exemplu 1 2 3).' : 'Scrie doar numărul.'}</p>`;
      const inp = body.querySelector('[data-o]');
      inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); const b = document.getElementById('chk'); if (b) b.click(); } });
      const bun = () => {
        if (cere !== 'afisari') return oriScris(inp.value) === nr || UA.potriveste(inp.value.replace(/\s*(de\s+)?ori\.?$/i, ''), nr);
        const l = listaScrisa(inp.value);
        return l.length === afisari.length && l.every((x, i) => UA.potriveste(x, T.afisari[i]));
      };
      body._bun = () => (cere !== 'afisari' ? String(nr) : afisari.join(' '));
      body._rau = () => (cere !== 'afisari' ? String(nr > 1 ? nr - 1 : 0) : afisari.slice(0, -1).join(' ') || '0');
      const nav = api.checkButton(() => {
        const ok = bun();
        anunta({tip: 'panaori', bune: ok ? 1 : 0, total: 1, ok});
        if (ok) { nav.innerHTML = ''; api.resolve(true); }
        else {
          const l = listaScrisa(inp.value), ln = l.filter(eNumar), ex = nr === 10 ? 12 : 10;
          const o = oriScris(inp.value);
          const m = inp.value.trim() === '' ? 'Scrie răspunsul în căsuță.'
            : cere === 'ori' ? (o === null && !/\d/.test(inp.value) ? `Scrie numărul, cu cifre (de exemplu ${ex}).`
              : o === 0 || UA.potriveste(inp.value.replace(/\s*(de\s+)?ori\.?$/i, ''), 0)
                ? 'La „repetă … până când” testul vine DUPĂ corp, deci corpul se execută cel puțin o dată. Fă tabelul pe treceri și numără rândurile.'
                : 'Fă tabelul pe treceri: întâi corpul, apoi testul cu valorile noi. Fiecare rând e o trecere; ultima e cea cu testul adevărat.')
              : ln.length !== l.length ? 'Scrie doar numerele, în ordine, despărțite prin spații sau virgule (de exemplu 1 2 3).'
                : l.length !== afisari.length ? `Ai scris ${l.length} ${l.length === 1 ? 'număr' : 'numere'}. Fă tabelul: un „Afișează” din corp se execută o dată la fiecare trecere, iar unul de după „până când”, o singură dată.`
                  : 'Calculează, la fiecare trecere, cu valorile de ACUM.';
          api.resolve(false, m);
          api.revealButton(() => { inp.value = body._bun(); nav.innerHTML = ''; api.giveUp(`<code>${esc(body._bun())}</code>`); });
        }
      }, 'Verifică');
    },
    rezolva(Q, body) { body.querySelector('[data-o]').value = body._bun(); },
    gresit(Q, body) { body.querySelector('[data-o]').value = body._rau(); }
  };

  window.UrmarirePanaCand = {versiune: VERSIUNE, treceri, tabelTreceri, dateText, tipuri: {panaori: PANAORI},
    _intern: {oriScris, afisariScrise}};
})();
