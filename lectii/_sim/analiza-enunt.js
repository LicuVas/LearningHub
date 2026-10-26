/* lectii/_sim/analiza-enunt.js — „Analiza enunțului unei probleme”: marchezi în enunț datele de intrare și datele de
   ieșire, alegi operațiile care leagă intrarea de ieșire și calculezi ieșirea pentru un exemplu de intrare.

   PROPRIETAR: lecția VII/23 (lectii/vii/m4-l23, „Analiza enunțului unei probleme: date de intrare, date de ieșire,
   operații”, 26.10.2026). Lecțiile următoare îl folosesc NESCHIMBAT sau îl extind cu fișiere NOI
   (`lectii/_sim/analiza-enunt-<ceva>.js`); NU îl rescriu.

   FIDELITATE: nu imită nicio aplicație. E o fișă de lucru în pagină (ca pe caiet): enunțul are cuvinte pe care le atingi,
   iar marcajele țin doar cât e deschisă pagina. Nimic nu se salvează și nimic nu pleacă (0 chei în localStorage,
   0 cereri). Regulile de verificare sunt REGULILE LECȚIEI (ce e dată de intrare / de ieșire / număr fix al regulii),
   spuse în pașii ei, nu fapte despre vreun program.

   ENUNȚUL (sursa): text cu bucăți marcate `[<tip><id>|text]`:
       i = dată de intrare (ce primești), e = dată de ieșire (ce afli), c = număr fix al regulii (nu se citește),
       n = cuvinte despre care se poate discuta (ex. „între elevi”): marcate sau nu, nu sunt nici greșeală, nici punct;
       același <id> pe două bucăți = aceeași dată, spusă de două ori (ajunge să marchezi una).
     Exemplu: 'Se citesc [i1|prețul caietului] și [i2|prețul pixului]. Să se afișeze [e1|cât plătește Ana].'
   Orice cuvânt din enunț se poate atinge (forma nu trădează unde sunt datele). Un cuvânt atins cu „Intrare” primește
   fundal albastru și o linie dedesubt; cu „Ieșire”, fundal galben și linie dublă; „Guma” șterge marcajul.
   O DATĂ E MARCATĂ (1.1) când TOATE cuvintele ei sunt marcate cu creionul ei, într-una din aparițiile ei (judecata 1,
   sonnet 1: un singur cuvânt dintr-o dată nu mai ajunge). După „Verifică”, cuvintele greșite ale UNUI fel (de șters /
   de trecut la „Ieșire” / de trecut la „Intrare”) primesc un contur roșu (`ae-gr`), iar cuvintele care lipsesc dintr-o
   dată marcată doar în parte, un contur roșu punctat (`ae-lp`); mesajul spune cuvântul și, dacă apare de mai multe ori
   în enunț, al câtelea e și în ce propoziție (judecata 1, A: altfel copilul schimba cuvântul bun și intra în buclă).
   Conturul unui cuvânt pleacă la prima lui atingere.

   API PUBLIC (window.AnalizaEnunt):
     versiune                         '1.3 (26.10.2026)'
     arata(enunt, opt)                -> HTML: enunțul cu datele colorate (pentru „Uite cum”); opt.fara = ['c'] nu le colorează
     tabel(rand | [randuri])          -> HTML: tabelul analizei, coloanele Date de intrare / Date de ieșire / Operații;
                                         rand = {intrare:[…], iesire:[…], operatii:[…], problema?:'…'}
     numar(text)                      -> {ok, v, motiv, rest?, cat?}: citește un răspuns scris (cifre, „33 lei”, „50 - 17 = 33”,
                                         „treizeci și trei”, „șase sute douăzeci”, „24 - 22 + 7” fără „=”, „9 ore (24 - 22 + 7)”,
                                         „9:00”, „45.0”, „9 ore și 0 minute”); calculul din stânga lui „=” trebuie să dea numărul
                                         de după el. Împărțirea cu rest, ca la școală (1.1, judecata 1, B): „23 : 5 = 4 rest 3”,
                                         „4 rest 3”, „4 r 3”, „23 : 5 = 4” -> v = 4 (câtul), rest = 3 când e scris
                                         („a : b = c rest r” trece doar dacă b × c + r = a și r < b). „nu …” / „… sau …” -> respins.
                                         1.2 (judecata 2, R): „câtul 4, restul 3”, „4 și rest 3” = „4 rest 3”; împărțirea ca
                                         explicație: „4 (23 : 5)”, „4, adică 23 : 5” (4 = câtul, 3 = restul), „4 rest 3 (23 : 5)”,
                                         „4 rest 3 (5 x 4 + 3 = 23)”; proba singură „23 = 5 x 4 + 3” -> v = 4, rest = 3, iar
                                         `alte` = celelalte citiri adevărate ({v: 5, rest: 3} dacă și 23 : 4 = 5 rest 3; {v: 23}).
                                         1.3 (judecata 3, U, V): la împărțirea ca explicație spune și ROLUL numărului în ea:
                                         `cat: true` (e câtul ei), `dinRest: true` (e restul ei), `imp: {a, b}` (împărțirea);
                                         rolul îl judecă exercițiul (căsuța câtului / a restului). Explicația cu „=” FALSĂ
                                         („4 (23 : 5 = 5)”, „9 (2 + 7 = 10)”) respinge răspunsul: {ok: false, motiv: 'explicatie',
                                         gresita: <citirea explicației>}; cea care nu se poate citi rămâne lăsată deoparte.
     potriveste(text, asteptat)       -> bool (aceeași regulă ca la verificare; la „c rest r” compară câtul; primește și `alte`)
     tipuri.marcheaza                 -> {render, rezolva, gresit}: {t:'marcheaza', q, enunt, ajutor, why}
     tipuri.exemplu                   -> {render, rezolva, gresit}: {t:'exemplu', q, enunt?, date:[{…}], calcul(d) -> număr
                                         sau [numere], iesiri:['…'], gresit?(d) -> ce scrie copilul greșit, ajutor, why,
                                         catRest?: [k_cât, k_rest] (1.1) = căsuța câtului și căsuța restului unei împărțiri
                                         cu rest: în căsuța restului „23 : 5 = 4 rest 3” se citește ca rest 3}
     tipuri.analiza                   -> {render, rezolva, gresit}: atelierul întreg, {t:'analiza', q, probleme:[{id, titlu,
                                         enunt, operatii:{bune:['…'], rele:[['…', 'de ce nu']]}, date, calcul, iesiri,
                                         gresit?, catRest?}], ajutor, why} — la fiecare deschidere ia altă problemă (când se poate)
   EVENIMENT: după fiecare verificare, pe window: CustomEvent('analiza-enunt', {detail:{tip, bune, total, ok}}).
   CE NU SE SCHIMBĂ (pentru lecțiile care îl folosesc): numele tipurilor, forma enunțului, numele testelor, clasele CSS
   cu prefixul `ae-`, id-ul de stil `ae-stil`, regula „nimic nu se salvează, nimic nu pleacă”.
   ISTORIC: 1.0 (26.10.2026, autorul VII/23) · 1.1 (26.10.2026, reparația după judecata 1: A, B, H, sonnet 1, 2, 5) ·
            1.2 (26.10.2026, trecerea după judecata 2: R = împărțirea cu rest scrisă ca explicație / în cuvinte / ca probă;
            S = mesajul cu mai multe cuvinte greșite spune „Primul dintre ele e …” într-o propoziție a lui) ·
            1.3 (26.10.2026, trecerea după judecata 3: U = rolul numărului în împărțirea din explicație — restul ei în
            căsuța câtului, câtul ei în căsuța restului, ori o împărțire care nu dă exact numărul la o problemă fără catRest
            se resping, cu mesaj adevărat; V = explicația cu „=” falsă respinge răspunsul, motivul 'explicatie').
*/
(function () {
  'use strict';
  const VERSIUNE = '1.3 (26.10.2026)';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c]);
  const fara = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[șş]/g, 's').replace(/[țţ]/g, 't').replace(/[ȘŞ]/g, 'S').replace(/[ȚŢ]/g, 'T');
  const anunta = detail => { try { window.dispatchEvent(new CustomEvent('analiza-enunt', {detail})); } catch (e) { /* fără eveniment */ } };
  const amesteca = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const mare = s => s ? s[0].toUpperCase() + s.slice(1) : s;

  /* ===================== 1. STILUL (jetoanele temei: --paper --paper2 --line --ink --ink2 --accent --ok --okbg --bad --badbg --fm) ===================== */
  function stil() {
    if (document.getElementById('ae-stil')) return;
    const e = document.createElement('style'); e.id = 'ae-stil';
    e.textContent = `
.ae-en{background:var(--paper);border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:8px;padding:.55em .75em;margin:.5em 0;line-height:2.05;color:var(--ink)}
.ae-en .ae-w{font:inherit;color:inherit;background:none;border:0;border-radius:4px;padding:3px 2px;margin:0;min-height:32px;min-width:32px;text-align:center;cursor:pointer;line-height:1.5;vertical-align:baseline;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.ae-en .ae-w:hover{background:var(--paper2)}
.ae-en .ae-p{margin-left:-2px}
.ae-en .ae-w:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
.ae-en .ae-w.ae-gr{outline:3px solid var(--bad);outline-offset:1px;border-radius:6px}
.ae-en .ae-w.ae-lp{outline:3px dashed var(--bad);outline-offset:1px;border-radius:6px}
.ae-en .ae-i,.ae-arata .ae-i{background:var(--ae-ibg,#D6E6FB);color:var(--ae-iink,#0E2F5C);text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:4px}
.ae-en .ae-e,.ae-arata .ae-e{background:var(--ae-ebg,#FBE6B8);color:var(--ae-eink,#4A3000);text-decoration:underline double;text-decoration-thickness:2px;text-underline-offset:4px}
.ae-arata .ae-c{border-bottom:2px dotted var(--ink2)}
.ae-arata{line-height:1.8}
.ae-arata .ae-i,.ae-arata .ae-e{border-radius:3px;padding:1px 2px}
.ae-leg{font-size:.86rem;color:var(--ink2);margin:.2em 0 .4em}
.ae-leg span{display:inline-block;margin-right:.8em}
.ae-leg .ae-i,.ae-leg .ae-e{padding:0 4px;border-radius:3px}
.ae-mod{display:flex;flex-wrap:wrap;gap:6px;margin:.3em 0}
.ae-mod button{min-height:40px;min-width:44px;padding:4px 12px;font:inherit;font-weight:700;border:2px solid var(--line);border-radius:8px;background:var(--paper);color:var(--ink);cursor:pointer}
.ae-mod button[aria-pressed="true"]{border-color:var(--accent);box-shadow:0 0 0 2px var(--accent) inset}
.ae-mod button.ae-mi{background:var(--ae-ibg,#D6E6FB);color:var(--ae-iink,#0E2F5C)}
.ae-mod button.ae-me{background:var(--ae-ebg,#FBE6B8);color:var(--ae-eink,#4A3000)}
.ae-ops{display:flex;flex-direction:column;gap:6px;margin:.3em 0}
.ae-ops button{text-align:left;min-height:40px;padding:6px 10px 6px 34px;position:relative;font:inherit;border:1.5px solid var(--line);border-radius:8px;background:var(--paper);color:var(--ink);cursor:pointer}
.ae-ops button::before{content:"";position:absolute;left:9px;top:50%;width:16px;height:16px;margin-top:-9px;border:2px solid var(--ink2);border-radius:4px;background:var(--paper)}
.ae-ops button[aria-pressed="true"]{border-color:var(--accent);background:var(--paper2)}
.ae-ops button[aria-pressed="true"]::before{background:var(--accent);border-color:var(--accent);box-shadow:inset 0 0 0 2px var(--paper)}
.ae-dat{font-family:var(--fm,monospace);font-weight:700;background:var(--paper2);border:1px solid var(--line);border-radius:6px;padding:4px 8px;display:inline-block;margin:.3em 0 .4em;white-space:normal}
.ae-iesiri label{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:.35em 0}
.ae-iesiri input{font:inherit;font-size:1rem;min-height:40px;width:12em;max-width:100%;padding:4px 8px;border:1.5px solid var(--accent);border-radius:6px;background:var(--paper);color:var(--ink);box-sizing:border-box}
.ae-lbl{font-weight:700;margin-top:.7em}
.ae-nota{font-size:.88rem;color:var(--ink2);margin:.3em 0}
.ae-teste{list-style:none;padding:0;margin:.6em 0 0;font-size:.92rem}
.ae-teste li{padding:2px 0}
.ae-teste li::before{content:"○ ";color:var(--ink2)}
.ae-teste li.ok::before{content:"✓ ";color:var(--ok);font-weight:700}
.ae-teste li.no::before{content:"✗ ";color:var(--bad);font-weight:700}
.ae-capat{margin-top:.6em;min-height:36px;padding:4px 12px;font:inherit;border:1.5px solid var(--line);border-radius:8px;background:var(--paper);color:var(--ink);cursor:pointer}
.ae-tw{overflow-x:auto;margin:.5em 0}
.ae-tab{border-collapse:collapse;width:100%;font-size:.93rem}
.ae-tab th,.ae-tab td{border:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}
.ae-tab th{background:var(--paper2)}
.ae-tab ul{margin:0;padding-left:1.1em}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .ae-en,:root:not([data-theme="light"]) .ae-arata,:root:not([data-theme="light"]) .ae-mod,:root:not([data-theme="light"]) .ae-leg{--ae-ibg:#23446E;--ae-iink:#E3EEFF;--ae-ebg:#5A4316;--ae-eink:#FFF1D2}}
:root[data-theme="dark"] .ae-en,:root[data-theme="dark"] .ae-arata,:root[data-theme="dark"] .ae-mod,:root[data-theme="dark"] .ae-leg{--ae-ibg:#23446E;--ae-iink:#E3EEFF;--ae-ebg:#5A4316;--ae-eink:#FFF1D2}
@media (max-width:560px){
  .ae-tab thead{display:none}
  .ae-tab tr{display:block;border-bottom:2px solid var(--line)}
  .ae-tab td{display:block;border:0;border-top:1px solid var(--line)}
  .ae-tab td::before{content:attr(data-c);display:block;font-weight:700;font-size:.82rem;color:var(--ink2)}
}`;
    document.head.appendChild(e);
  }

  /* ===================== 2. ENUNȚUL ===================== */
  function parseaza(src) {
    const buc = [];
    const re = /\[([iecn])(\d+)\|([^\]]+)\]/g;
    let p = 0, m;
    while ((m = re.exec(src))) {
      if (m.index > p) buc.push({txt: src.slice(p, m.index), g: null});
      buc.push({txt: m[3], g: m[1] + m[2], tip: m[1]});
      p = re.lastIndex;
    }
    if (p < src.length) buc.push({txt: src.slice(p), g: null});
    /* cuvinte[k] = {w, g, tip, p (a câta propoziție)}; grupe[g] = {tip, cuv:[k…], bucati:[[k…] pe fiecare apariție]};
       fraze[p] = textul propoziției p (pentru mesajul care spune unde e un cuvânt repetat) */
    const cuvinte = [], grupe = {}, fraze = [''];
    let html = '', ip = 0;
    const adauga = t => { fraze[ip] = (fraze[ip] || '') + t; };
    buc.forEach(b => {
      const bucata = [];
      b.txt.split(/(\s+)/).forEach(t => {
        if (!t) return;
        if (/^\s+$/.test(t)) { html += ' '; if (fraze[ip]) adauga(' '); return; }
        const m2 = t.match(/^([„"(«]*)(.*?)([.,;:!?”")»]*)$/);
        const pre = m2[1], miez = m2[2], post = m2[3];
        adauga(t);
        if (!miez) { html += esc(t); if (/[.!?]/.test(t)) ip++; return; }
        const k = cuvinte.length;
        cuvinte.push({w: miez, g: b.g, tip: b.tip || null, p: ip, post});
        if (b.g) bucata.push(k);
        html += `${esc(pre)}<button type="button" class="ae-w" data-k="${k}">${esc(miez)}</button>${post ? `<span class="ae-p">${esc(post)}</span>` : ''}`;
        if (/[.!?]/.test(post)) ip++;
      });
      if (b.g && bucata.length) {
        const G = (grupe[b.g] = grupe[b.g] || {tip: b.tip, cuv: [], bucati: []});
        G.cuv.push(...bucata); G.bucati.push(bucata);
      }
    });
    return {cuvinte, grupe, html, fraze: fraze.map(f => f.trim())};
  }
  /* enunțul colorat, pentru „Uite cum” (fără butoane) */
  function arata(src, opt) {
    stil();
    const fara0 = (opt && opt.fara) || [];
    const re = /\[([iecn])(\d+)\|([^\]]+)\]/g, s = String(src);
    let h = '', p = 0, m;
    while ((m = re.exec(s))) {
      h += esc(s.slice(p, m.index)) + (fara0.includes(m[1]) || m[1] === 'n' ? esc(m[3]) : `<span class="ae-${m[1]}">${esc(m[3])}</span>`);
      p = re.lastIndex;
    }
    h += esc(s.slice(p));
    return `<div class="ae-en ae-arata">${h}</div>`;
  }
  function legenda() {
    return `<div class="ae-leg"><span><span class="ae-i">albastru, subliniat</span> = dată de intrare</span><span><span class="ae-e">galben, subliniat de două ori</span> = dată de ieșire</span></div>`;
  }
  function tabel(r) {
    stil();
    const rs = Array.isArray(r) ? r : [r], cuP = rs.some(x => x.problema);
    const li = a => a.length > 1 ? `<ul>${a.map(x => `<li>${x}</li>`).join('')}</ul>` : (a[0] || '');
    return `<div class="ae-tw"><table class="ae-tab"><thead><tr>${cuP ? '<th>Problema</th>' : ''}<th>Date de intrare</th><th>Date de ieșire</th><th>Operații</th></tr></thead><tbody>${
      rs.map(x => `<tr>${cuP ? `<td data-c="Problema">${x.problema || ''}</td>` : ''}<td data-c="Date de intrare">${li(x.intrare)}</td><td data-c="Date de ieșire">${li(x.iesire)}</td><td data-c="Operații">${li(x.operatii)}</td></tr>`).join('')
    }</tbody></table></div>`;
  }

  /* ===================== 3. RĂSPUNSURILE SCRISE (numere) ===================== */
  const UNIT = {zero: 0, unu: 1, una: 1, un: 1, o: 1, doi: 2, doua: 2, trei: 3, patru: 4, cinci: 5, sase: 6, sapte: 7, opt: 8, noua: 9};
  const ZECE = {zece: 10, unsprezece: 11, unspe: 11, doisprezece: 12, douasprezece: 12, treisprezece: 13, paisprezece: 14, patrusprezece: 14,
    cincisprezece: 15, saisprezece: 16, saptesprezece: 17, optsprezece: 18, nouasprezece: 19};
  const ZECI = {douazeci: 20, treizeci: 30, patruzeci: 40, cincizeci: 50, saizeci: 60, saptezeci: 70, optzeci: 80, nouazeci: 90};
  const CUV_NR = new Set([...Object.keys(UNIT), ...Object.keys(ZECE), ...Object.keys(ZECI), 'suta', 'sute', 'mie', 'si']);
  function grupNumar(t) {   // ['sase','sute','douazeci','si','unu'] -> 621; null dacă nu e un număr scris corect
    if (t.length === 2 && (t[0] === 'o' || t[0] === 'un') && t[1] === 'mie') return 1000;
    let i = 0, v = 0;
    if (t[i + 1] === 'suta' || t[i + 1] === 'sute') {
      const u = (t[i] === 'o' || t[i] === 'un') ? 1 : UNIT[t[i]];
      if (u == null || u === 0 || (t[i + 1] === 'suta') !== (u === 1) || (u === 1 && !['o', 'un'].includes(t[i]))) return null;
      v += 100 * u; i += 2;
    }
    if (i < t.length) {
      const x = t[i];
      if (x in ZECE) { v += ZECE[x]; i++; }
      else if (x in ZECI) {
        v += ZECI[x]; i++;
        if (t[i] === 'si') { const y = t[i + 1]; if (!(y in UNIT) || ['o', 'un', 'zero'].includes(y)) return null; v += UNIT[y]; i += 2; }
      } else if (x in UNIT && !['o', 'un'].includes(x)) { v += UNIT[x]; i++; }
      else return null;
    }
    return i === t.length && i > 0 ? v : null;
  }
  function dinCuvinte(s) {   // „treizeci si trei”, „noua”, „a dormit noua ore”, „sase sute douazeci” -> număr; altfel null
    const t = s.split(/[\s.,;:!?()]+/).filter(Boolean);
    const gasite = [];
    for (let i = 0; i < t.length;) {
      if (!CUV_NR.has(t[i])) { i++; continue; }
      let j = i; while (j < t.length && CUV_NR.has(t[j])) j++;
      let a = i, b = j; while (a < b && t[a] === 'si') a++; while (b > a && t[b - 1] === 'si') b--;
      const v = a < b ? grupNumar(t.slice(a, b)) : null;
      if (v !== null) gasite.push(v);
      i = j;
    }
    return gasite.length === 1 ? gasite[0] : null;
  }
  function calcul(expr) {   // + - * / ( ) cu x, ×, ·, : pentru înmulțire și împărțire (cum se scrie la matematică); null = nu se poate citi
    if (/\d[\s,]+\d/.test(expr.replace(/(\d),(\d)/g, '$1.$2'))) return null;   // „3 3”, „33 si 17” nu sunt o socoteală
    const s = expr.replace(/[x×·]/g, '*').replace(/[:÷]/g, '/').replace(/[−–]/g, '-').replace(/(\d),(\d)/g, '$1.$2').replace(/\s+/g, '');
    if (!/^[\d.+\-*/()]+$/.test(s)) return null;
    let i = 0;
    const num = () => { let j = i; while (j < s.length && /[\d.]/.test(s[j])) j++; if (j === i) throw 0; const t = s.slice(i, j); if (!/^\d+(\.\d+)?$/.test(t)) throw 0; i = j; return +t; };
    const fact = () => { if (s[i] === '(') { i++; const v = sum(); if (s[i] !== ')') throw 0; i++; return v; } if (s[i] === '-') { i++; return -fact(); } return num(); };
    const prod = () => { let v = fact(); while (s[i] === '*' || s[i] === '/') { const o = s[i++]; const b = fact(); v = o === '*' ? v * b : v / b; } return v; };
    const sum = () => { let v = prod(); while (s[i] === '+' || s[i] === '-') { const o = s[i++]; const b = prod(); v = o === '+' ? v + b : v - b; } return v; };
    try { const v = sum(); return i === s.length && isFinite(v) ? v : null; } catch (e) { return null; }
  }
  /* „A : B” cu A natural (poate fi o socoteală fără + sau − în afara parantezelor) și B natural scris la capăt -> {a, b}; altfel null */
  function impartire(ex) {
    const s = ex.replace(/[:÷]/g, '/').replace(/[x×·]/g, '*').replace(/[−–]/g, '-').replace(/\s+/g, '');
    const m = s.match(/^(.+)\/(\d+)$/);
    if (!m) return null;
    let adanc = 0;
    for (let i = 0; i < m[1].length; i++) {
      const ch = m[1][i];
      if (ch === '(') adanc++; else if (ch === ')') adanc--; else if (adanc === 0 && (ch === '+' || ch === '-')) return null;
    }
    const a = calcul(m[1]), b = +m[2];
    return a !== null && Number.isInteger(a) && a >= 0 && b > 0 ? {a, b} : null;
  }
  /* proba împărțirii cu rest (1.2, judecata 2, R): „a = f1 x f2 + r” (stg: true) sau „f1 x f2 + r = a”, numere naturale,
     -> {a, f1, f2, r, stg} doar dacă f1 × f2 + r = a; altfel null. Cine e împărțitorul o hotărăște cine o folosește (r < împărțitor). */
  function probaImp(t) {
    const u = t.replace(/[x×·*]/g, '*').replace(/\s+/g, '');
    let m = u.match(/^(\d+)=(\d+)\*(\d+)\+(\d+)$/), a, f1, f2, r, stg = true;
    if (m) [a, f1, f2, r] = m.slice(1).map(Number);
    else {
      m = u.match(/^(\d+)\*(\d+)\+(\d+)=(\d+)$/);
      if (!m) return null;
      [f1, f2, r, a] = m.slice(1).map(Number); stg = false;
    }
    return f1 * f2 + r === a ? {a, f1, f2, r, stg} : null;
  }
  const curataCalc = s => s.replace(/[a-z]{2,}/g, ' ').replace(/[.!?]+\s*$/, '').trim();
  function numar(text) {
    let s = fara(String(text || '')).toLowerCase().replace(/[−–]/g, '-').trim().replace(/\s+/g, ' ');
    if (!s) return {ok: false, motiv: 'gol'};
    s = s.replace(/(\d)\.(\d{3})(?!\d)/g, '$1$2');        // 1.000 = o mie, cum se scrie la noi
    s = s.replace(/(\d)\.(\d{1,2})(?!\d)/g, '$1,$2');     // 45.0, 3.5: punctul (de pe tastatura telefonului) ca virgulă
    if (/(^|[^a-z])(nu|sau)([^a-z]|$)/.test(s)) return {ok: false, motiv: 'nesigur'};   // „nu 9”, „9 sau 10”
    s = s.replace(/(\d+) ?(?:de )?(?:ore|ora|h),? ?(?:si )?0+ ?(?:de )?(?:minute|min)\b\.?/g, '$1 ore');   // „9 ore și 0 minute”
    s = s.replace(/(^|[^\d:,])(\d{1,2}):00(?![\d,])/g, '$1$2');                                               // „9:00” = 9
    /* împărțirea cu rest în cuvinte (1.2, judecata 2, R): „câtul 4, restul 3”, „câtul este 4 și restul 3”, „restul 3, câtul 4”,
       „4 și rest 3” -> „4 rest 3” (se judecă apoi ca orice „c rest r”) */
    s = s.replace(/\bcatul(?: este| e)? ?:? ?(\d+),? ?(?:si )?rest(?:ul)?(?: este| e)? ?:? ?(\d+)/g, '$1 rest $2')
      .replace(/\brestul(?: este| e)? ?:? ?(\d+),? ?(?:si )?catul(?: este| e)? ?:? ?(\d+)/g, '$2 rest $1')
      .replace(/(\d),? si rest(?:ul)? ?:? ?(\d)/g, '$1 rest $2');
    /* explicația lângă rezultat: „9 ore (24 - 22 + 7)”, „9 ore, adica 2 + 7” — socoteala trebuie să dea numărul */
    const ex0 = s.match(/^(.*?\d.*?)\s*\(([^()]*)\)\s*[.!]?$/) || s.match(/^(.*?\d.*?),?\s+adica\s+(.+)$/);
    if (ex0 && !/[+\-*/x×·:÷=(]\s*$/.test(ex0[1]) && /\d\s*[+\-*/x×·:÷]\s*\(?\s*\d/.test(ex0[2])) {
      const a = numar(ex0[1]), b = numar(ex0[2]);
      if (!a.ok) return a;
      /* 1.2 (judecata 2, R): explicația e o împărțire, ca la școală — „4 (23 : 5)”, „4, adică 23 : 5”: numărul scris e câtul
         (sau restul) ei; „4 rest 3 (23 : 5)”: câtul și restul se verifică (b × c + r = a, r < b) */
      const ex = curataCalc(ex0[2]), imp = /=/.test(ex) ? null : impartire(ex);
      if (imp && a.rest !== undefined) {
        if (imp.b * a.v + a.rest !== imp.a) return {ok: false, motiv: 'rest', v: a.v, rest: a.rest, a: imp.a, b: imp.b};
        if (a.rest >= imp.b) return {ok: false, motiv: 'restMare', v: a.v, rest: a.rest, a: imp.a, b: imp.b};
        return a;
      }
      /* 1.3 (judecata 3, U): numărul spune ce ROL are în împărțirea din explicație — `cat` (câtul ei; și la împărțirea exactă),
         `dinRest` (restul ei), amândouă când câtul și restul sunt egale (15 : 4 = 3 rest 3); `imp` = împărțirea. Rolul îl
         judecă exercițiul: căsuța câtului nu primește restul altei împărțiri, căsuța restului nu primește câtul ei. */
      if (imp && Number.isInteger(a.v)) {
        const rol = {};
        if (a.v === Math.floor(imp.a / imp.b)) rol.cat = true;
        if (a.v === imp.a % imp.b) rol.dinRest = true;
        if (rol.cat || rol.dinRest) return Object.assign({}, a, rol, {imp: {a: imp.a, b: imp.b}});
      }
      if (b.ok && [b].concat(b.alte || []).some(x => Math.abs(x.v - a.v) <= 1e-9)) return a;
      /* explicația e proba împărțirii: „4 rest 3 (5 x 4 + 3 = 23)”, „4 (23 = 5 x 4 + 3)” — câtul e un factor, restul e mai mic
         decât celălalt (împărțitorul); dacă înainte e scrisă și împărțirea („23 : 5 = 4 rest 3 (…)”), e aceeași */
      const pf = probaImp(ex);
      if (pf && Number.isInteger(a.v)) {
        const d = a.v === pf.f2 && pf.r < pf.f1 ? pf.f1 : a.v === pf.f1 && pf.r < pf.f2 ? pf.f2 : null;
        const imA = /=/.test(ex0[1]) ? impartire(curataCalc(ex0[1].split('=').slice(-2)[0])) : null;
        if (d !== null && (a.rest === undefined || a.rest === pf.r) && (!imA || (imA.a === pf.a && imA.b === d))) return Object.assign({}, a, {rest: pf.r});
      }
      if (b.ok) return {ok: false, motiv: 'explicatie', v: a.v};
      /* 1.3 (judecata 3, V): explicația cu „=” care e FALSĂ („23 : 5 = 5”, „5 x 4 + 3 = 24”, „23 : 5 = 4 rest 2”, „2 + 7 = 10”)
         respinge răspunsul; lăsată deoparte e doar explicația care nu se poate citi (necitit / multe) */
      if (['calcul', 'rest', 'restMare'].includes(b.motiv)) return {ok: false, motiv: 'explicatie', v: a.v, gresita: b};
      return a;
    }
    /* proba împărțirii scrisă singură (1.2, judecata 2, R): „23 = 5 x 4 + 3” (deîmpărțitul = împărțitorul × câtul + restul)
       -> câtul 4, restul 3. Dacă restul e mai mic decât ambii factori, și celălalt factor poate fi câtul: îl pune în `alte`,
       împreună cu deîmpărțitul (egalitatea e adevărată). „5 x 4 + 3 = 23” rămâne o socoteală cu rezultatul 23. */
    const pf = probaImp(curataCalc(s));
    if (pf && pf.stg && (pf.r < pf.f1 || pf.r < pf.f2)) {
      const r = pf.r < pf.f1 ? {ok: true, v: pf.f2, rest: pf.r} : {ok: true, v: pf.f1, rest: pf.r};
      r.alte = (pf.r < pf.f1 && pf.r < pf.f2 && pf.f1 !== pf.f2 ? [{v: pf.f1, rest: pf.r}] : []).concat([{v: pf.a}]);
      return r;
    }
    const parti = s.split('=').map(x => x.trim()).filter(x => x !== '');
    const ultim = parti[parti.length - 1] || '';
    let v = null, rest, cat = false;
    const mr = ultim.match(/^(-?\d+),? ?\(? ?(?:rest|r\.?) ?:? ?(\d+) ?\)?(?: [a-z ]*)?[.!]?$/);   // „4 rest 3”, „4 r 3”, „4 (rest 3)”
    if (mr) { v = +mr[1]; rest = +mr[2]; }
    else {
      const cif = ultim.match(/-?\d+(?:,\d+)?/g);
      if (cif && cif.length === 1) v = parseFloat(cif[0].replace(',', '.'));
      else if (cif && cif.length > 1) {
        /* fără „=”: poate e chiar socoteala („24 - 22 + 7”, „30 + 15 lei”) */
        const c = parti.length === 1 ? calcul(curataCalc(ultim)) : null;
        if (c === null) return {ok: false, motiv: 'multe'};
        return {ok: true, v: c, socoteala: true};
      } else v = dinCuvinte(ultim);
    }
    if (v === null) return {ok: false, motiv: 'necitit'};
    /* calculul scris chiar înaintea ultimului „=” trebuie să dea numărul de după el („50 - 17 = 33”; „12 + 5 = 17, 50 - 17 = 33”).
       Se ia doar bucata de calcul de la capătul ei; un calcul care nu se poate citi nu respinge răspunsul (rezultatul contează).
       Împărțirea cu rest: „23 : 5 = 4 rest 3” trece dacă 5 × 4 + 3 = 23 și 3 < 5; „23 : 5 = 4” trece: 4 e câtul. */
    if (parti.length > 1) {
      const m = parti[parti.length - 2].match(/[\d\s+\-*/x×·:÷(),]+$/);
      const ex = m ? m[0].split(/,\s+/).pop().replace(/^[\s,]+/, '').trim() : '';   // „…= 2, 2 + 7 = 9”: doar „2 + 7”
      if (/\d/.test(ex) && /[+\-*/x×·:÷]/.test(ex)) {
        const c = calcul(ex), imp = impartire(ex);
        if (rest !== undefined) {
          if (imp && imp.b * v + rest !== imp.a) return {ok: false, motiv: 'rest', v, rest, a: imp.a, b: imp.b};
          if (imp && rest >= imp.b) return {ok: false, motiv: 'restMare', v, rest, a: imp.a, b: imp.b};
        } else if (c !== null && Math.abs(c - v) > 1e-9) {
          if (imp && imp.a % imp.b !== 0 && v === Math.floor(imp.a / imp.b)) cat = true;
          else return {ok: false, motiv: 'calcul', v};
        }
      }
    }
    const r = {ok: true, v};
    if (rest !== undefined) r.rest = rest;
    if (cat) r.cat = true;
    return r;
  }
  const potriveste = (text, asteptat) => { const r = numar(text); return !!r.ok && [r].concat(r.alte || []).some(x => Math.abs(x.v - asteptat) < 1e-9); };
  const nrText = v => String(Math.round(v * 1000) / 1000).replace('.', ',');
  function motivNumar(text, asteptat, eticheta) {
    const r = numar(text), E = mare(eticheta);
    if (!r.ok && r.motiv === 'gol') return `${E}: căsuța e goală.`;
    if (!r.ok && r.motiv === 'multe') return `${E}: ai scris mai multe numere. Scrie doar rezultatul (sau calculul, cu „=” și rezultatul la capăt).`;
    if (!r.ok && r.motiv === 'necitit') return `${E}: nu găsesc un număr în ce ai scris. Scrie rezultatul cu cifre, de exemplu 125.`;
    if (!r.ok && r.motiv === 'nesigur') return `${E}: scrie un singur rezultat, fără „sau” și fără „nu”.`;
    if (!r.ok && r.motiv === 'calcul') return `${E}: calculul dinainte de „=” nu dă numărul scris după el. Refă calculul.`;
    if (!r.ok && r.motiv === 'explicatie' && r.gresita) {   // 1.3 (judecata 3, V): socoteala din explicație e ea însăși greșită
      const g = r.gresita;
      const dece = g.motiv === 'rest' ? `${g.b} × ${g.v} + ${g.rest} = ${g.b * g.v + g.rest}, nu ${g.a}`
        : g.motiv === 'restMare' ? `restul ${g.rest} nu poate fi ${g.rest === g.b ? 'egal cu' : 'mai mare decât'} ${g.b}, numărul la care împarți`
        : 'calculul dinainte de „=” nu dă numărul scris după el';
      return `${E}: socoteala din paranteză (sau de după „adică”) e greșită: ${dece}. Refă socoteala.`;
    }
    if (!r.ok && r.motiv === 'explicatie') return `${E}: socoteala din paranteză (sau de după „adică”) nu dă numărul scris înaintea ei. Refă socoteala.`;
    if (!r.ok && r.motiv === 'rest') return `${E}: verifică împărțirea: ${r.b} × ${r.v} + ${r.rest} = ${r.b * r.v + r.rest}, nu ${r.a}. Refă împărțirea.`;
    if (!r.ok && r.motiv === 'restMare') return `${E}: restul ${r.rest} nu poate fi ${r.rest === r.b ? 'egal cu' : 'mai mare decât'} ${r.b}, numărul la care împarți: ${r.b} mai încape o dată. Refă împărțirea.`;
    return `${E}: ${esc(text.trim())} nu e rezultatul pentru intrarea de mai sus. Fă din nou operațiile, cu numerele intrării.`;
  }

  /* ===================== 4. MARCAREA (folosită de „marcheaza” și de „analiza”) ===================== */
  const ORD = ['primul', 'al doilea', 'al treilea', 'al patrulea', 'al cincilea', 'al șaselea', 'al șaptelea', 'al optulea'];
  const CREION = {i: '„Intrare”', e: '„Ieșire”'};
  function zonaMarcare(src, mesajIntrare, butonVerifica) {
    const P = parseaza(src);
    const st = P.cuvinte.map(() => '');
    const rosu = new Set(), lipsa = new Set();   // conturul roșu (greșit) și cel punctat (lipsește dintr-o dată), după „Verifică”
    let mod = 'i', R0 = null;
    const html = `<div class="ae-lbl">Creionul tău</div>
      <div class="ae-mod" role="group" aria-label="Alege creionul, apoi atinge cuvintele din enunț">
        <button type="button" class="ae-mi" data-m="i" aria-pressed="true">Intrare</button>
        <button type="button" class="ae-me" data-m="e" aria-pressed="false">Ieșire</button>
        <button type="button" data-m="" aria-pressed="false">Guma (șterge)</button></div>
      <p class="ae-nota">Alegi creionul, apoi atingi, pe rând, fiecare cuvânt al unei date (o dată are de obicei mai multe cuvinte). Atingi din nou un cuvânt marcat ca să-l ștergi.</p>
      <div class="ae-en" role="group" aria-label="Enunțul: atinge cuvintele">${P.html}</div>`;
    function leaga(root) {
      R0 = root;
      const bs = [...root.querySelectorAll('.ae-mod button')];
      bs.forEach(b => b.addEventListener('click', () => { mod = b.dataset.m; bs.forEach(x => x.setAttribute('aria-pressed', String(x === b))); }));
      root.querySelectorAll('.ae-en .ae-w').forEach(b => b.addEventListener('click', () => {
        const k = +b.dataset.k;
        st[k] = (st[k] === mod) ? '' : mod;
        rosu.delete(k); lipsa.delete(k);
        deseneaza(root);
      }));
      deseneaza(root);
    }
    function deseneaza(root) {
      root.querySelectorAll('.ae-en .ae-w').forEach(b => {
        const k = +b.dataset.k, v = st[k];
        b.classList.toggle('ae-i', v === 'i'); b.classList.toggle('ae-e', v === 'e');
        b.classList.toggle('ae-gr', rosu.has(k)); b.classList.toggle('ae-lp', lipsa.has(k));
        b.setAttribute('aria-label', b.textContent + (v === 'i' ? ' (marcat: intrare)' : v === 'e' ? ' (marcat: ieșire)' : '') +
          (rosu.has(k) ? ' (încercuit cu roșu)' : lipsa.has(k) ? ' (încercuit cu roșu punctat)' : ''));
      });
    }
    /* unde e cuvântul k, dacă apare de mai multe ori în enunț: „al doilea „câți” din enunț, cel din propoziția „…”” ('' dacă e unic)
       (propoziția întreagă dacă e scurtă și cuvântul e o singură dată în ea; altfel 3 cuvinte în jurul lui) */
    function unde(k) {
      const c = P.cuvinte[k], w = c.w.toLowerCase();
      const toate = P.cuvinte.map((x, j) => x.w.toLowerCase() === w ? j : -1).filter(j => j >= 0);
      if (toate.length < 2) return '';
      const nr = toate.indexOf(k), ord = ORD[nr] || `al ${nr + 1}-lea`;
      const inFraza = P.cuvinte.map((x, j) => x.p === c.p ? j : -1).filter(j => j >= 0);
      const deDouaOri = toate.filter(j => P.cuvinte[j].p === c.p).length > 1;
      let fr;
      if (!deDouaOri && inFraza.length <= 10) fr = P.fraze[c.p];
      else {
        const i = inFraza.indexOf(k), a = Math.max(0, i - 3), b = Math.min(inFraza.length, i + 4);
        fr = (a > 0 ? '…' : '') + inFraza.slice(a, b).map(j => P.cuvinte[j].w).join(' ') + (b < inFraza.length ? '…' : '');
      }
      return `${ord} „${esc(c.w)}” din enunț, cel din propoziția „${esc(fr)}”`;
    }
    const plina = g => P.grupe[g].bucati.some(b => b.every(k => st[k] === P.grupe[g].tip));
    function evalueaza() {
      const G = P.grupe, ids = Object.keys(G);
      const iG = ids.filter(g => G[g].tip === 'i'), eG = ids.filter(g => G[g].tip === 'e');
      const iBune = iG.filter(plina).length, eBune = eG.filter(plina).length;
      rosu.clear(); lipsa.clear();
      /* greșelile, pe feluri: 'x' = de șters (nu numește o dată / număr fix al regulii); 'e' = cuvânt al unei date de ieșire
         marcat cu „Intrare”; 'i' = cuvânt al unei date de intrare marcat cu „Ieșire” */
      const gresite = [];
      st.forEach((v, k) => {
        if (!v) return;
        const c = P.cuvinte[k];
        if (c.tip === 'n') return;   // cuvânt neutru: nici greșeală, nici punct
        if (!c.g || c.tip === 'c') gresite.push({k, v, c, fel: 'x'});
        else if (c.tip !== v) gresite.push({k, v, c, fel: c.tip});
      });
      const nimic = st.every(v => !v), verif = butonVerifica || 'Verifică';
      let mesaj = '';
      if (nimic) mesaj = 'Nu ai marcat nimic încă. Alege creionul „Intrare” și atinge cuvintele care spun ce primești.';
      else if (gresite.length) {
        /* un singur fel pe verificare: cuvintele lui primesc conturul roșu, iar mesajul spune exact ce faci cu ele */
        const g0 = gresite[0], fel = gresite.filter(x => x.fel === g0.fel);
        fel.forEach(x => rosu.add(x.k));
        const n = fel.length, u = unde(g0.k), w1 = `cuvântul „${esc(g0.c.w)}”${u ? ` (${u})` : ''}`;
        /* 1.2 (judecata 2, S): la mai multe cuvinte, primul e spus într-o propoziție a lui (nu „(primul: „câți”, al doilea „câți”…)”,
           care se citea ca o listă); propoziția citată se termină deja cu punct */
        const p1 = `Primul dintre ele e ${u || `cuvântul „${esc(g0.c.w)}”`}`, wN = /[.!?…]”$/.test(p1) ? p1 : p1 + '.';
        if (g0.fel === 'x') {
          const fixe = fel.filter(x => x.c.tip === 'c').length;
          const deCe = fixe === n ? (n === 1 ? 'face parte dintr-un număr fix al regulii: e la fel pentru orice intrare, deci nu se citește' : 'fac parte dintr-un număr fix al regulii: e la fel pentru orice intrare, deci nu se citește')
            : fixe === 0 ? (n === 1 ? 'nu numește o dată (ceva ce primești sau ceva ce afli)' : 'nu numesc o dată (ceva ce primești sau ceva ce afli)')
            : 'nu sunt date: unele nu numesc nimic din ce primești sau afli, altele fac parte dintr-un număr fix al regulii';
          mesaj = n === 1 ? `Ai marcat cu ${CREION[g0.v]} ${w1}, dar el ${deCe}. L-am încercuit cu roșu: ia Guma și atinge-l.`
            : `Ai marcat ${n} cuvinte care ${deCe}; le-am încercuit cu roșu. ${wN} Ia Guma și atinge-le pe fiecare.` +
              (n >= 5 ? ' Sunt multe: poți apăsa și „Ia-o de la capăt” și marca din nou doar datele.' : '');
        } else {
          const ce = g0.fel === 'e' ? 'ce afli (o dată de ieșire)' : 'ce primești (o dată de intrare)';
          mesaj = n === 1 ? `Ai marcat cu ${CREION[g0.v]} ${w1}, dar el face parte din ${ce}. L-am încercuit cu roșu: ia creionul ${CREION[g0.fel]} și atinge-l.`
            : `Ai marcat cu ${CREION[g0.v]} ${n} cuvinte care fac parte din ${ce}; le-am încercuit cu roșu. ${wN} Ia creionul ${CREION[g0.fel]} și atinge-le pe fiecare.`;
        }
        const alte = gresite.length - n;
        if (alte) mesaj += ` Apoi apasă din nou „${esc(verif)}”: mai ${alte === 1 ? 'e un cuvânt de reparat, pe care ți-l arăt' : `sunt ${alte} cuvinte de reparat, pe care ți le arăt`} atunci.`;
      } else {
        const partiale = iG.concat(eG).filter(g => !plina(g) && G[g].cuv.some(k => st[k] === G[g].tip));
        if (partiale.length) {
          const g = partiale[0], tip = G[g].tip, cate = b => b.filter(k => st[k] === tip).length;
          const b = G[g].bucati.slice().sort((x, y) => cate(y) - cate(x))[0];
          const lip = b.filter(k => st[k] !== tip);
          lip.forEach(k => lipsa.add(k));
          const txt = b.map((k, j) => P.cuvinte[k].w + (j < b.length - 1 ? (P.cuvinte[k].post || '') : '')).join(' ');
          mesaj = `Data „${esc(txt)}” e marcată doar în parte: ` +
            (lip.length === 1 ? 'un cuvânt al ei nu e marcat; l-am încercuit cu roșu punctat. Atinge-l' : `${lip.length} cuvinte ale ei nu sunt marcate; le-am încercuit cu roșu punctat. Atinge-le`) +
            ` cu creionul ${CREION[tip]}: o dată se marchează cu toate cuvintele ei.`;
        } else if (iBune < iG.length) mesaj = `Ai marcat ${iBune} din ${iG.length} date de intrare. ${mesajIntrare || 'Caută în enunț tot ce primești la început (de obicei, după „Se citește” sau „Se citesc”).'}`;
        else if (eBune < eG.length) mesaj = eG.length > 1 ? `Ai marcat ${eBune} din ${eG.length} date de ieșire. Caută tot ce ți se cere să afli.` : 'Data de ieșire nu e marcată încă. Caută ce ți se cere să afli (de obicei, după „Să se afișeze”).';
      }
      if (R0) deseneaza(R0);
      return {ti: !nimic && iBune === iG.length, te: !nimic && eBune === eG.length, tn: !nimic && !gresite.length, mesaj, iG, eG};
    }
    function rezolva(root) { st.fill(''); rosu.clear(); lipsa.clear(); Object.values(P.grupe).forEach(g => { if (g.tip === 'i' || g.tip === 'e') g.cuv.forEach(k => { st[k] = g.tip; }); }); deseneaza(root); }
    function gresit(root) {   // greșeala tipică: marchezi și numărul fix al regulii ca intrare, sau uiți ieșirea
      rezolva(root);
      const c = Object.values(P.grupe).find(g => g.tip === 'c');
      if (c) st[c.cuv[0]] = 'i'; else Object.values(P.grupe).filter(g => g.tip === 'e').forEach(g => g.cuv.forEach(k => { st[k] = ''; }));
      deseneaza(root);
    }
    function goleste(root) { st.fill(''); rosu.clear(); lipsa.clear(); deseneaza(root); }
    return {html, leaga, evalueaza, rezolva, gresit, goleste, P};
  }
  const TESTE_MARCARE = (n, cuFixe) => [
    {id: 'ti', ce: 'Toate datele de intrare sunt marcate cu „Intrare”'},
    {id: 'te', ce: n > 1 ? 'Toate datele de ieșire sunt marcate cu „Ieșire”' : 'Data de ieșire e marcată cu „Ieșire”'},
    {id: 'tn', ce: cuFixe ? 'Nu e marcat nimic altceva (nici numerele fixe ale regulii)' : 'Nu e marcat nimic altceva'}
  ];
  const nrGrupe = (Z, tip) => Object.values(Z.P.grupe).filter(g => g.tip === tip).length;
  const li = (body, id, ok) => { const e = body.querySelector(`.ae-teste li[data-t="${id}"]`); if (e) e.className = ok ? 'ok' : 'no'; };

  /* ===================== 5. TIPUL „marcheaza” ===================== */
  const MARCHEAZA = {
    render(Q, body, api) {
      stil();
      const Z = zonaMarcare(Q.enunt, Q.mesajIntrare, 'Verifică marcajele');
      const T = TESTE_MARCARE(nrGrupe(Z, 'e'), nrGrupe(Z, 'c') > 0);
      body.innerHTML = Z.html + `<div class="ae-lbl">Testele</div><ul class="ae-teste">${T.map(t => `<li data-t="${t.id}">${t.ce}</li>`).join('')}</ul>
        <button type="button" class="ae-capat">Ia-o de la capăt</button>`;
      Z.leaga(body);
      body.querySelector('.ae-capat').addEventListener('click', () => { Z.goleste(body); T.forEach(t => { const e = body.querySelector(`.ae-teste li[data-t="${t.id}"]`); if (e) e.className = ''; }); });
      body._ae = {Z};
      const nav = api.checkButton(() => {
        const r = Z.evalueaza(), ok = r.ti && r.te && r.tn;
        T.forEach(t => li(body, t.id, r[t.id]));
        anunta({tip: 'marcheaza', bune: T.filter(t => r[t.id]).length, total: T.length, ok});
        if (ok) { nav.innerHTML = ''; api.resolve(true); }
        else {
          api.resolve(false, r.mesaj, !body.querySelector('.ae-en .ae-i,.ae-en .ae-e'));
          api.revealButton(() => { Z.rezolva(body); T.forEach(t => li(body, t.id, true)); nav.innerHTML = ''; api.giveUp('datele sunt marcate acum: albastru = intrare, galben = ieșire.'); });
        }
      }, 'Verifică marcajele');
    },
    rezolva(Q, body) { body._ae.Z.rezolva(body); },
    gresit(Q, body) { body._ae.Z.gresit(body); }
  };

  /* ===================== 6. TIPUL „exemplu” (calculezi ieșirea pentru o intrare) ===================== */
  function alege(lista, ultima) {
    const l = lista.filter(d => d !== ultima);
    const din = l.length ? l : lista;
    return din[Math.floor(Math.random() * din.length)];
  }
  const dateText = d => Object.entries(d).map(([k, v]) => `${esc(k)} = ${esc(String(v).replace('.', ','))}`).join('; ');
  const ca = v => Array.isArray(v) ? v : [v];
  function zonaExemplu(Q, d) {
    const asteptat = ca(Q.calcul(d)), CR = Q.catRest;
    const nota = CR ? `Scrie rezultatele cu cifre. Împărțirea e cu rest: în căsuța „${esc(Q.iesiri[CR[0]])}” scrii câtul, în căsuța „${esc(Q.iesiri[CR[1]])}” restul. Merge și ca la matematică: „19 : 4 = 4 rest 3”.`
      : 'Scrie rezultatul cu cifre (de exemplu 125). Poți scrie și calculul, cu „=” și rezultatul la capăt.';
    const html = `<div class="ae-lbl">Intrarea</div><div class="ae-dat">${dateText(d)}</div>
      <div class="ae-lbl">Ieșirea (calculezi tu)</div><div class="ae-iesiri">${Q.iesiri.map((n, k) => `<label>${esc(n)}: <input data-o="${k}" autocomplete="off" autocapitalize="off" spellcheck="false" inputmode="text"></label>`).join('')}</div>
      <p class="ae-nota">${nota}</p>`;
    const eq = (a, b) => Math.abs(a - b) < 1e-9;
    /* o căsuță: {ok, mesaj}. La împărțirea cu rest (Q.catRest = [cât, rest]): „c rest r” se judecă întreg (câtul ȘI restul),
       în căsuța restului „23 : 5 = 4 rest 3” înseamnă restul 3, iar câtul pus în locul restului (sau invers) e spus pe nume. */
    function judeca(text, k) {
      const E = mare(Q.iesiri[k]), r0 = numar(text), cel = asteptat[CR ? CR[0] : k];
      /* 1.2: „23 = 4 x 5 + 3” are mai multe citiri adevărate (`alte`): o ia pe cea care dă câtul (sau rezultatul) așteptat */
      const alt = r0.ok && r0.alte ? r0.alte.find(x => eq(x.v, cel)) : null;
      const r = alt && !eq(r0.v, cel) ? Object.assign({ok: true}, alt) : r0;
      if (!r.ok) return {ok: false, mesaj: motivNumar(text, asteptat[k], Q.iesiri[k])};
      const altfel = {ok: false, mesaj: motivNumar(text, asteptat[k], Q.iesiri[k])};
      if (CR) {
        const [ic, ir] = CR, Ec = esc(Q.iesiri[ic]), Er = esc(Q.iesiri[ir]);
        if (!Number.isInteger(r.v)) return {ok: false, mesaj: `${E}: ${nrText(r.v)} nu e un număr întreg. Împărțirea e cu rest: în căsuța „${Ec}” scrii câtul, în căsuța „${Er}” restul.`};
        if (r.rest !== undefined && (k === ic || k === ir)) {
          if (!eq(r.v, asteptat[ic])) return altfel;
          if (!eq(r.rest, asteptat[ir])) return {ok: false, mesaj: `${E}: câtul ${r.v} e bun, dar ${r.rest} nu e restul împărțirii. Refă împărțirea.`};
          return {ok: true};
        }
        if (k === ic && !eq(r.v, asteptat[ic]) && eq(r.v, asteptat[ir])) return {ok: false, mesaj: `${E}: ${r.v} e restul împărțirii, nu câtul. Aici scrii câtul; restul merge în căsuța „${Er}”.`};
        if (k === ir && !eq(r.v, asteptat[ir]) && eq(r.v, asteptat[ic])) return {ok: false, mesaj: `${E}: ${r.v} e câtul împărțirii, nu restul. Aici scrii restul (ce rămâne); câtul merge în căsuța „${Ec}”.`};
        /* 1.3 (judecata 3, U): explicația e o împărțire în care numărul are ALT rol decât cel al căsuței („4 (19 : 5)”: 4 e restul
           lui 19 : 5, nu câtul; „3 (17 : 5)”: 3 e câtul lui 17 : 5, nu restul). Când câtul și restul ei sunt egale, ambele merg. */
        const ex = r.imp ? `${r.imp.a} : ${r.imp.b}` : '';
        if (r.imp && k === ic && r.dinRest && !r.cat) return {ok: false, mesaj: `${E}: în socoteala din paranteză (sau de după „adică”), ${r.v} e restul împărțirii ${ex}, nu câtul ei. Aici scrii câtul. Refă socoteala.`};
        if (r.imp && k === ir && r.cat && !r.dinRest) return {ok: false, mesaj: `${E}: în socoteala din paranteză (sau de după „adică”), ${r.v} e câtul împărțirii ${ex}, nu restul ei. Aici scrii restul (ce rămâne). Refă socoteala.`};
      } else if (r.imp && !(r.cat && r.imp.a % r.imp.b === 0)) {
        /* 1.3 (judecata 3, U): fără catRest, explicația care e o împărțire trece doar dacă dă exact numărul (ca în 1.1) */
        const q = Math.floor(r.imp.a / r.imp.b), rr = r.imp.a % r.imp.b;
        return {ok: false, mesaj: `${E}: socoteala din paranteză (sau de după „adică”) nu dă numărul scris înaintea ei: ${r.imp.a} : ${r.imp.b} = ${q} rest ${rr}. Refă socoteala.`};
      }
      return eq(r.v, asteptat[k]) ? {ok: true} : altfel;
    }
    function leaga(root, api) {
      const ins = [...root.querySelectorAll('.ae-iesiri input')];
      ins.forEach((e, k) => e.addEventListener('keydown', ev => {
        if (ev.key !== 'Enter') return;
        ev.preventDefault();
        if (ins[k + 1]) ins[k + 1].focus();
        else if (api && !api.done()) api.feedback('', 'Apasă „Verifică” când ești gata.');
      }));
    }
    function evalueaza(root) {
      const ins = [...root.querySelectorAll('.ae-iesiri input')];
      const J = ins.map((e, k) => judeca(e.value, k)), bune = J.map(j => j.ok);
      const k0 = bune.indexOf(false);
      return {ok: k0 < 0, bune, mesaj: k0 < 0 ? '' : J[k0].mesaj};
    }
    const umple = (root, v) => [...root.querySelectorAll('.ae-iesiri input')].forEach((e, k) => { e.value = String(ca(v)[k]); });
    return {html, leaga, evalueaza, asteptat, umple};
  }
  const EXEMPLU = {
    render(Q, body, api) {
      stil();
      const d = alege(Q.date, Q._ultima); Q._ultima = d;
      const X = zonaExemplu(Q, d);
      body.innerHTML = (Q.enunt ? `<div class="ae-en ae-arata">${arataSimplu(Q.enunt)}</div>` : '') + X.html +
        `<div class="ae-lbl">Testele</div><ul class="ae-teste">${Q.iesiri.map((n, k) => `<li data-t="o${k}">${esc(mare(n))}, pentru intrarea de mai sus</li>`).join('')}</ul>`;
      X.leaga(body, api);
      body._ae = {X, d};
      const nav = api.checkButton(() => {
        const r = X.evalueaza(body);
        r.bune.forEach((b, k) => li(body, 'o' + k, b));
        anunta({tip: 'exemplu', bune: r.bune.filter(Boolean).length, total: r.bune.length, ok: r.ok});
        if (r.ok) { nav.innerHTML = ''; api.resolve(true); }
        else {
          const gol = [...body.querySelectorAll('.ae-iesiri input')].every(e => !e.value.trim());
          api.resolve(false, r.mesaj, gol);
          api.revealButton(() => { X.umple(body, X.asteptat); r.bune.forEach((b, k) => li(body, 'o' + k, true)); nav.innerHTML = ''; api.giveUp(X.asteptat.join(' și ') + (Q.raspunsCum ? ` (${Q.raspunsCum(d)})` : '')); });
        }
      }, 'Verifică ieșirea');
    },
    rezolva(Q, body) { body._ae.X.umple(body, body._ae.X.asteptat); },
    gresit(Q, body) { const d = body._ae.d; body._ae.X.umple(body, Q.gresit ? ca(Q.gresit(d)) : body._ae.X.asteptat.map(x => x + 1)); }
  };
  function arataSimplu(src) { return esc(String(src).replace(/\[([iecn])(\d+)\|([^\]]+)\]/g, '$3')); }

  /* ===================== 7. TIPUL „analiza” (atelierul: marchezi, alegi operațiile, calculezi exemplul) ===================== */
  const ANALIZA = {
    render(Q, body, api) {
      stil();
      const P = alege(Q.probleme, Q._ultima); Q._ultima = P;
      const Z = zonaMarcare(P.enunt, P.mesajIntrare, 'Verifică analiza');
      const d = alege(P.date, P._ultima); P._ultima = d;
      const X = zonaExemplu(P, d);
      const ops = amesteca(P.operatii.bune.map(t => ({t, bun: true})).concat(P.operatii.rele.map(([t, de]) => ({t, bun: false, de}))));
      const T = TESTE_MARCARE(nrGrupe(Z, 'e'), nrGrupe(Z, 'c') > 0).concat([{id: 'to', ce: 'Operațiile alese duc de la intrare la ieșire (toate cele bune, niciuna greșită)'}],
        P.iesiri.map((n, k) => ({id: 'o' + k, ce: `Ieșirea „${esc(n)}”, pentru intrarea dată`})));
      body.innerHTML = `<p class="ae-nota"><b>Problema: ${esc(P.titlu)}</b></p>` + Z.html +
        `<div class="ae-lbl">Operațiile: atinge-le pe cele de care ai nevoie (oricâte)</div>
         <div class="ae-ops" role="group" aria-label="Operațiile">${ops.map((o, k) => `<button type="button" data-op="${k}" aria-pressed="false">${esc(o.t)}</button>`).join('')}</div>` +
        X.html + `<div class="ae-lbl">Testele</div><ul class="ae-teste">${T.map(t => `<li data-t="${t.id}">${t.ce}</li>`).join('')}</ul>
        <button type="button" class="ae-capat">Ia-o de la capăt</button>`;
      Z.leaga(body); X.leaga(body, api);
      const ob = [...body.querySelectorAll('.ae-ops button')];
      ob.forEach(b => b.addEventListener('click', () => b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'))));
      body.querySelector('.ae-capat').addEventListener('click', () => {
        Z.goleste(body); ob.forEach(b => b.setAttribute('aria-pressed', 'false'));
        body.querySelectorAll('.ae-iesiri input').forEach(e => { e.value = ''; });
        body.querySelectorAll('.ae-teste li').forEach(e => { e.className = ''; });
      });
      const evOps = () => {
        const ales = ob.filter(b => b.getAttribute('aria-pressed') === 'true').map(b => ops[+b.dataset.op]);
        const rea = ales.find(o => !o.bun), bune = ales.filter(o => o.bun).length, total = P.operatii.bune.length;
        return {ok: !rea && bune === total, mesaj: rea ? `Operația „${esc(rea.t)}” nu duce la ieșire: ${esc(rea.de)}`
          : bune < total ? `Ai ales ${bune} din ${total} operații de care ai nevoie. Ce mai trebuie făcut cu datele de intrare ca să ajungi la ieșire?` : ''};
      };
      body._ae = {Z, X, ob, ops, d, P};
      const nav = api.checkButton(() => {
        const m = Z.evalueaza(), o = evOps(), x = X.evalueaza(body);
        const rez = {ti: m.ti, te: m.te, tn: m.tn, to: o.ok};
        x.bune.forEach((b, k) => { rez['o' + k] = b; });
        T.forEach(t => li(body, t.id, rez[t.id]));
        const bune = T.filter(t => rez[t.id]).length, ok = bune === T.length;
        anunta({tip: 'analiza', bune, total: T.length, ok});
        if (ok) { nav.innerHTML = ''; api.resolve(true); }
        else {
          const mes = [(!m.ti || !m.te || !m.tn) && m.mesaj, !o.ok && o.mesaj, !x.ok && x.mesaj].filter(Boolean).slice(0, 2);
          const gol = !body.querySelector('.ae-en .ae-i,.ae-en .ae-e') && !ob.some(b => b.getAttribute('aria-pressed') === 'true') && [...body.querySelectorAll('.ae-iesiri input')].every(e => !e.value.trim());
          api.resolve(false, `${bune} din ${T.length} teste trec. ${mes.join(' ')}`, gol);
          api.revealButton(() => { ANALIZA.rezolva(Q, body); T.forEach(t => li(body, t.id, true)); nav.innerHTML = ''; api.giveUp('analiza e completată acum: datele marcate, operațiile bune alese și ieșirea scrisă. Parcurge-le pe rând.'); });
        }
      }, 'Verifică analiza');
    },
    rezolva(Q, body) {
      const A = body._ae; A.Z.rezolva(body);
      A.ob.forEach(b => b.setAttribute('aria-pressed', String(A.ops[+b.dataset.op].bun)));
      A.X.umple(body, A.X.asteptat);
    },
    gresit(Q, body) {   // greșeala tipică: marcajele și operațiile bune, dar ieșirea calculată greșit (un pas sărit)
      ANALIZA.rezolva(Q, body);
      const A = body._ae;
      A.X.umple(body, A.P.gresit ? ca(A.P.gresit(A.d)) : A.X.asteptat.map(x => x + 1));
    }
  };

  window.AnalizaEnunt = {versiune: VERSIUNE, arata, legenda, tabel, numar, potriveste, parseaza,
    tipuri: {marcheaza: MARCHEAZA, exemplu: EXEMPLU, analiza: ANALIZA}};
})();
