// Verificari pentru functiile de Word construite in noaptea 23.11.2026 (aplicatii/word.js), dincolo de probele de paritate:
// alte cazuri, Ctrl+Z, clic dreapta, telefonul (390x844 cu hasTouch), profilul word2007. Banda A: editarea, selectia,
// clipboard-ul, anularea, navigarea si bara de taste pentru deget. Ceilalti constructori adauga la el, fara sa-l rescrie.
// Rulare:  node aplicatii/_verificare/word_noapte_checks.mjs   (din orice director)
// Variabila optionala: HARNESS_PW_DIR (implicit: C:/00/AI_0/.scratch/harness-node).
// Iesire: cate o linie PASS / FAIL per verificare; ULTIMA linie = numarul de FAIL. Totul headless, reteaua doar 127.0.0.1.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const PW_DIR = process.env.HARNESS_PW_DIR || 'C:/00/AI_0/.scratch/harness-node';
const require = createRequire(path.join(PW_DIR, 'package.json'));
const { chromium } = require('playwright');

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
function serve() {
  return new Promise(resolve => {
    const srv = http.createServer((q, s) => {
      const rel = decodeURIComponent(new URL(q.url, 'http://x').pathname);
      if (rel === '/favicon.ico') { s.writeHead(204); return s.end(); }
      const f = path.join(ROOT, rel);
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { s.writeHead(404); return s.end('nu'); }
      s.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(s);
    });
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}

let nFail = 0;
function scrie(stare, nume, detalii) {
  if (stare === 'FAIL') nFail++;
  console.log(`${stare} ${nume}${detalii ? ' - ' + detalii : ''}`.replace(/\s*\n\s*/g, ' '));
}
const pauza = ms => new Promise(r => setTimeout(r, ms));
const R = '[data-lh-aplicatie="word"]';
const J = x => JSON.stringify(x);

// cazurile jucate în Word-ul real prin COM (Word 16, „Smart cut and paste” pornit): LearningHub/lectii/vii/m1-l05/_proba/cazuri_word.json
const TEXTE = ["Aduceți apă și un sandviș. Plecăm luni la ora 8.", "Mergem la munte mâine.", "Mergem la munte.", "Mâine vine vine și echipa de la Bicaz.", "Plecăm luni la munte.", "Plecăm luni, la munte."];
// [op d/c/b, text, de_la, pana_la, rezultat]
const STERGERI = [["d", 3, 11, 15, "Mâine vine și echipa de la Bicaz."], ["c", 3, 11, 15, "Mâine vine și echipa de la Bicaz."], ["b", 3, 11, 15, "Mâine vine și echipa de la Bicaz."], ["d", 3, 11, 16, "Mâine vine și echipa de la Bicaz."], ["c", 3, 11, 16, "Mâine vine și echipa de la Bicaz."], ["b", 3, 11, 16, "Mâine vine și echipa de la Bicaz."], ["d", 3, 10, 15, "Mâine vine și echipa de la Bicaz."], ["c", 3, 10, 15, "Mâine vine și echipa de la Bicaz."], ["b", 3, 10, 15, "Mâine vine și echipa de la Bicaz."], ["d", 3, 0, 5, "vine vine și echipa de la Bicaz."], ["c", 3, 0, 5, "vine vine și echipa de la Bicaz."], ["b", 3, 0, 5, "vine vine și echipa de la Bicaz."], ["d", 3, 0, 6, "vine vine și echipa de la Bicaz."], ["c", 3, 0, 6, "vine vine și echipa de la Bicaz."], ["b", 3, 0, 6, "vine vine și echipa de la Bicaz."], ["d", 3, 32, 37, "Mâine vine vine și echipa de la."], ["c", 3, 32, 37, "Mâine vine vine și echipa de la."], ["b", 3, 32, 37, "Mâine vine vine și echipa de la."], ["d", 3, 31, 37, "Mâine vine vine și echipa de la."], ["c", 3, 31, 37, "Mâine vine vine și echipa de la."], ["b", 3, 31, 37, "Mâine vine vine și echipa de la."], ["d", 3, 32, 38, "Mâine vine vine și echipa de la "], ["c", 3, 32, 38, "Mâine vine vine și echipa de la "], ["b", 3, 32, 38, "Mâine vine vine și echipa de la "], ["d", 3, 19, 28, "Mâine vine vine și la Bicaz."], ["c", 3, 19, 28, "Mâine vine vine și la Bicaz."], ["b", 3, 19, 28, "Mâine vine vine și la Bicaz."], ["d", 3, 2, 8, "Mâne vine și echipa de la Bicaz."], ["c", 3, 2, 8, "Mâne vine și echipa de la Bicaz."], ["b", 3, 2, 8, "Mâne vine și echipa de la Bicaz."], ["d", 3, 6, 16, "Mâine și echipa de la Bicaz."], ["c", 3, 6, 16, "Mâine și echipa de la Bicaz."], ["b", 3, 6, 16, "Mâine și echipa de la Bicaz."], ["d", 3, 16, 38, "Mâine vine vine "], ["c", 3, 16, 38, "Mâine vine vine "], ["b", 3, 16, 38, "Mâine vine vine "], ["d", 0, 27, 48, "Aduceți apă și un sandviș. "], ["c", 0, 27, 48, "Aduceți apă și un sandviș. "], ["b", 0, 27, 48, "Aduceți apă și un sandviș. "], ["d", 0, 26, 48, "Aduceți apă și un sandviș."], ["c", 0, 26, 48, "Aduceți apă și un sandviș."], ["b", 0, 26, 48, "Aduceți apă și un sandviș."], ["d", 0, 0, 26, "Plecăm luni la ora 8."], ["c", 0, 0, 26, "Plecăm luni la ora 8."], ["b", 0, 0, 26, "Plecăm luni la ora 8."], ["d", 0, 0, 27, "Plecăm luni la ora 8."], ["c", 0, 0, 27, "Plecăm luni la ora 8."], ["b", 0, 0, 27, "Plecăm luni la ora 8."], ["d", 0, 18, 26, "Aduceți apă și un Plecăm luni la ora 8."], ["c", 0, 18, 26, "Aduceți apă și un Plecăm luni la ora 8."], ["b", 0, 18, 26, "Aduceți apă și un Plecăm luni la ora 8."], ["d", 0, 8, 15, "Aduceți un sandviș. Plecăm luni la ora 8."], ["c", 0, 8, 15, "Aduceți un sandviș. Plecăm luni la ora 8."], ["b", 0, 8, 15, "Aduceți un sandviș. Plecăm luni la ora 8."], ["d", 0, 18, 25, "Aduceți apă și un. Plecăm luni la ora 8."], ["c", 0, 18, 25, "Aduceți apă și un. Plecăm luni la ora 8."], ["b", 0, 18, 25, "Aduceți apă și un. Plecăm luni la ora 8."], ["d", 1, 16, 21, "Mergem la munte."], ["c", 1, 16, 21, "Mergem la munte."], ["b", 1, 16, 21, "Mergem la munte."], ["d", 1, 15, 21, "Mergem la munte."], ["c", 1, 15, 21, "Mergem la munte."], ["b", 1, 15, 21, "Mergem la munte."], ["d", 1, 16, 22, "Mergem la munte "], ["c", 1, 16, 22, "Mergem la munte "], ["b", 1, 16, 22, "Mergem la munte "], ["d", 1, 10, 15, "Mergem la mâine."], ["c", 1, 10, 15, "Mergem la mâine."], ["b", 1, 10, 15, "Mergem la mâine."], ["d", 1, 0, 6, "la munte mâine."], ["c", 1, 0, 6, "la munte mâine."], ["b", 1, 0, 6, "la munte mâine."], ["d", 1, 0, 10, "munte mâine."], ["c", 1, 0, 10, "munte mâine."], ["b", 1, 0, 10, "munte mâine."], ["d", 5, 7, 11, "Plecăm, la munte."], ["c", 5, 7, 11, "Plecăm, la munte."], ["b", 5, 7, 11, "Plecăm, la munte."], ["d", 5, 7, 12, "Plecăm la munte."], ["c", 5, 7, 12, "Plecăm la munte."], ["b", 5, 7, 12, "Plecăm la munte."], ["d", 5, 6, 11, "Plecăm, la munte."], ["c", 5, 6, 11, "Plecăm, la munte."], ["b", 5, 6, 11, "Plecăm, la munte."], ["d", 5, 16, 21, "Plecăm luni, la."], ["c", 5, 16, 21, "Plecăm luni, la."], ["b", 5, 16, 21, "Plecăm luni, la."]];
// [text, poziția, textul lipit, rezultat]
const LIPIRI = [[2, 0, "Bravo!", "Bravo!Mergem la munte."], [2, 6, "Bravo!", "Mergem Bravo! la munte."], [2, 7, "Bravo!", "Mergem Bravo!la munte."], [2, 13, "Bravo!", "Mergem la mun Bravo!te."], [2, 15, "Bravo!", "Mergem la munte Bravo!."], [2, 16, "Bravo!", "Mergem la munte. Bravo!"], [2, 0, "luni", "luni Mergem la munte."], [2, 6, "luni", "Mergem luni la munte."], [2, 7, "luni", "Mergem luni la munte."], [2, 13, "luni", "Mergem la mun luni te."], [2, 15, "luni", "Mergem la munte luni."], [2, 16, "luni", "Mergem la munte. luni"], [2, 0, "luni ", "luni Mergem la munte."], [2, 6, "luni ", "Mergem luni la munte."], [2, 7, "luni ", "Mergem luni la munte."], [2, 13, "luni ", "Mergem la mun luni te."], [2, 15, "luni ", "Mergem la munte luni."], [2, 16, "luni ", "Mergem la munte. luni"], [2, 0, "Plecăm luni la ora 8.", "Plecăm luni la ora 8.Mergem la munte."], [2, 6, "Plecăm luni la ora 8.", "Mergem Plecăm luni la ora 8. la munte."], [2, 7, "Plecăm luni la ora 8.", "Mergem Plecăm luni la ora 8.la munte."], [2, 13, "Plecăm luni la ora 8.", "Mergem la mun Plecăm luni la ora 8.te."], [2, 15, "Plecăm luni la ora 8.", "Mergem la munte Plecăm luni la ora 8.."], [2, 16, "Plecăm luni la ora 8.", "Mergem la munte. Plecăm luni la ora 8."], [2, 0, " Plecăm luni la ora 8.", "Plecăm luni la ora 8.Mergem la munte."], [2, 6, " Plecăm luni la ora 8.", "Mergem Plecăm luni la ora 8. la munte."], [2, 7, " Plecăm luni la ora 8.", "Mergem Plecăm luni la ora 8.la munte."], [2, 13, " Plecăm luni la ora 8.", "Mergem la mun Plecăm luni la ora 8.te."], [2, 15, " Plecăm luni la ora 8.", "Mergem la munte Plecăm luni la ora 8.."], [2, 16, " Plecăm luni la ora 8.", "Mergem la munte. Plecăm luni la ora 8."], [2, 0, "Aduceți apă și un sandviș. ", "Aduceți apă și un sandviș. Mergem la munte."], [2, 6, "Aduceți apă și un sandviș. ", "Mergem Aduceți apă și un sandviș.  la munte."], [2, 7, "Aduceți apă și un sandviș. ", "Mergem Aduceți apă și un sandviș. la munte."], [2, 13, "Aduceți apă și un sandviș. ", "Mergem la mun Aduceți apă și un sandviș. te."], [2, 15, "Aduceți apă și un sandviș. ", "Mergem la munte Aduceți apă și un sandviș.."], [2, 16, "Aduceți apă și un sandviș. ", "Mergem la munte. Aduceți apă și un sandviș."], [2, 0, "mâine", "mâine Mergem la munte."], [2, 6, "mâine", "Mergem mâine la munte."], [2, 7, "mâine", "Mergem mâine la munte."], [2, 13, "mâine", "Mergem la mun mâine te."], [2, 15, "mâine", "Mergem la munte mâine."], [2, 16, "mâine", "Mergem la munte. mâine"], [2, 0, "Hai, ", "Hai, Mergem la munte."], [2, 6, "Hai, ", "Mergem Hai,  la munte."], [2, 7, "Hai, ", "Mergem Hai, la munte."], [2, 13, "Hai, ", "Mergem la mun Hai, te."], [2, 15, "Hai, ", "Mergem la munte Hai,."], [2, 16, "Hai, ", "Mergem la munte. Hai,"]];
// [text, de_la, pana_la, ce se tastează, rezultat]
const TASTARI = [[4, 7, 11, "marți", "Plecăm marți la munte."], [4, 7, 12, "marți", "Plecăm marțila munte."], [4, 6, 11, "marți", "Plecămmarți la munte."]];

// o pagina cu Word: tel = 390x844 cu atingere; profil = 'word2007'; continut = Word redeschis cu acest continut
async function pagina(browser, base, { tel, profil, continut } = {}) {
  const ctx = await browser.newContext(tel ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } : { viewport: { width: 1280, height: 800 } });
  ctx.setDefaultTimeout(5000);
  await ctx.route('**/*', r => (/^https?:\/\/(127\.0\.0\.1|localhost)[:/]/.test(r.request().url()) ? r.continue() : r.abort()));
  const p = await ctx.newPage();
  const erori = [];
  p.on('pageerror', e => erori.push(e.message.split('\n')[0].slice(0, 120)));
  await p.goto(`${base}/aplicatii/poligon.html?aplicatie=word${profil ? '&profil=' + profil : ''}`, { waitUntil: 'load' });
  await p.waitForFunction(() => { try { return Array.isArray(window.LH.aplicatii.stare('word').text); } catch (e) { return false; } }, null, { timeout: 12000 });
  const u = {
    p, ctx, erori,
    st: () => p.evaluate(() => window.LH.aplicatii.stare('word')),
    text: async () => (await u.st()).text,
    // Word redeschis cu un continut (pregatirea, nu gestul elevului)
    async deschide(c) {
      await p.evaluate(([profil, c]) => window.LH.aplicatii.deschide('word', { profil: profil || undefined, continut: c, focus: true }), [profil, c]);
      await p.waitForFunction(() => { try { return Array.isArray(window.LH.aplicatii.stare('word').text); } catch (e) { return false; } }, null, { timeout: 12000 });
      await pauza(60);
    },
    par: (n = 1) => p.locator(`${R} [data-lh-zona] [data-lh-tinta="text"][data-lh-id="${n}"], ${R} [data-lh-zona] [data-lh-tinta="text:${n}"]`).first(),
    async scrieLa(t, tap) {
      if (tap) await u.par(1).tap(); else await u.par(1).click();
      await p.keyboard.press('Control+End');
      if (t) await p.keyboard.type(t, { delay: 6 });
      await pauza(80);
    },
    tasta: et => p.locator(`${R} [data-lh-ajutor="taste"] [data-lh-eticheta="${et}"]`).first(),
    async atingeTasta(et) { await u.tasta(et).tap(); await pauza(120); },
    // dreptunghiul unui cuvant din document
    cuvant: (cuv, k = 0) => p.evaluate(([R, cuv, k]) => {
      const root = document.querySelector(R);
      const w = document.createTreeWalker(root.querySelector('[data-lh-tinta="document"]') || root, NodeFilter.SHOW_TEXT);
      let n = 0;
      while (w.nextNode()) {
        const t = w.currentNode.textContent.toLowerCase();
        let i = t.indexOf(cuv.toLowerCase());
        while (i >= 0) {
          if (n++ === k) { const r = document.createRange(); r.setStart(w.currentNode, i); r.setEnd(w.currentNode, i + cuv.length); const q = r.getBoundingClientRect(); return { x: q.x, y: q.y, w: q.width, h: q.height, cx: q.x + q.width / 2, cy: q.y + q.height / 2 }; }
          i = t.indexOf(cuv.toLowerCase(), i + 1);
        }
      }
      return null;
    }, [R, cuv, k]),
    // formatarea aldin a primului paragraf: sir de 0/1
    async aldin() { let o = ''; for (const b of (await u.st()).formatare_pe_caractere || []) { if (b.paragraf != null && b.paragraf > 1) continue; o += String(b.text || '').split('').map(() => (b.bold ? '1' : '0')).join(''); } return o; },
  };
  return u;
}

const VERIF = [];
const verif = (nume, fn, opt = {}) => VERIF.push({ nume, fn, opt });

// ================= banda A, runda 1: bara de taste pentru deget (hotarari_dirijor.md pct. 1)
const TASTE_BARA = ['Ctrl+Z', 'Ctrl+Y', 'Ctrl+B', 'Ctrl+I', 'Ctrl+U', 'Ctrl+S', 'Ctrl+N', 'Tab', 'Enter', '⌫', 'Delete', 'Esc', 'Home', 'End', '←', '→', '↑', '↓', 'Shift+←', 'Shift+→'];
verif('A-bara: pe calculatorul fără atingere bara de taste nu există', async u => {
  const n = await u.p.locator(`${R} [data-lh-ajutor="taste"]`).count();
  return n ? [`${n} bare de taste pe 1280x800 fără atingere`] : [];
});
verif('A-bara: gazda o poate cere (continut.taste = true) și pe calculator', async u => {
  await u.deschide({ paragrafe: ['Ana'], taste: true });
  return (await u.p.locator(`${R} [data-lh-ajutor="taste"]:visible`).count()) ? [] : ['cu continut.taste = true bara nu apare'];
});
verif('A-bara: pe telefon (390x844) toate cele 20 de taste se văd, în ecran, în rădăcina Word, sub fereastră', async u => {
  const pb = [];
  const r = await u.p.evaluate(([R, et]) => {
    const root = document.querySelector(R), bara = root.querySelector('[data-lh-ajutor="taste"]');
    if (!bara) return null;
    const jos = root.querySelector('.lh-ap-jos').getBoundingClientRect().bottom;
    return et.map(e => { const b = bara.querySelector(`[data-lh-eticheta="${e}"]`); if (!b) return [e, 'lipsă']; const q = b.getBoundingClientRect(); return [e, q.left >= 0 && q.right <= innerWidth && q.top >= jos - 1 && q.bottom <= innerHeight && q.width >= 30 && q.height >= 30 ? 'ok' : `în afara ecranului / prea mic ${J([q.left, q.top, q.width, q.height])}`]; });
  }, [R, TASTE_BARA]);
  if (!r) return ['pe telefon nu există bara de taste'];
  for (const [e, s] of r) if (s !== 'ok') pb.push(`${e}: ${s}`);
  return pb;
}, { tel: true });
verif('A-bara [2007]: ⌫, Enter și Ctrl+Z din bară, pe telefon', async u => {
  const pb = [];
  await u.scrieLa('abc', true);
  await u.atingeTasta('⌫');
  let t = await u.text();
  if (J(t) !== J(['ab'])) pb.push(`⌫: ${J(t)}`);
  await u.atingeTasta('Enter');
  t = await u.text();
  if (t.length !== 2) pb.push(`Enter: ${J(t)}`);
  await u.atingeTasta('Ctrl+Z');
  t = await u.text();
  if (J(t) !== J(['ab'])) pb.push(`Ctrl+Z după Enter: ${J(t)}`);
  return pb;
}, { tel: true, profil: 'word2007' });
verif('A-bara: Home, Shift+→ ×3, Ctrl+B din bară îngroașă „Ana”', async u => {
  await u.scrieLa('Ana are mere', true);
  await u.atingeTasta('Home');
  for (let i = 0; i < 3; i++) await u.atingeTasta('Shift+→');
  const s = (await u.st()).selectie;
  if (s.text !== 'Ana') return [`selecția după Shift+→ ×3: ${J(s.text)}`];
  await u.atingeTasta('Ctrl+B');
  const f = await u.aldin();
  return f.startsWith('111') && !f.slice(3).includes('1') ? [] : [`aldin pe caractere: ${f}`];
}, { tel: true });
verif('A-bara: Ctrl+S deschide „Save this file”, Esc din bară o închide', async u => {
  await u.scrieLa('Orarul meu', true);
  await u.atingeTasta('Ctrl+S');
  const desc = () => u.p.locator(`${R} [data-lh-tinta="dialog_salvare:Save"]:visible, ${R} [data-lh-tinta="dialog_salvare"][data-lh-id="Save"]:visible`).count();
  if (!(await desc())) return ['Ctrl+S din bară nu deschide fereastra de salvare'];
  await u.atingeTasta('Esc');
  return (await desc()) ? ['Esc din bară nu închide fereastra'] : [];
}, { tel: true });
verif('A-bara: Ctrl+Y din bară repetă ⌫ (Repeat)', async u => {
  await u.scrieLa('abcd', true);
  await u.atingeTasta('⌫');
  await u.atingeTasta('Ctrl+Y');
  const t = await u.text();
  return J(t) === J(['ab']) ? [] : [`⌫ + Ctrl+Y: ${J(t)}`];
}, { tel: true });

// ================= banda A: Smart cut / Smart paste pe cazurile jucate in Word real (COM)
verif('A-F006: cele 87 de ștergeri (Delete / ⌫ / Ctrl+X) din cazuri_word.json dau textul din Word real', async u => {
  const rau = [];
  for (const [op, k, a, b, rez] of STERGERI) {
    await u.deschide({ paragrafe: [TEXTE[k]], selectie: { de_la: a, pana_la: b } });
    await u.p.keyboard.press(op === 'd' ? 'Delete' : op === 'b' ? 'Backspace' : 'Control+x');
    await pauza(20);
    const t = (await u.text())[0];
    if (t !== rez) rau.push(`${op} ${J(TEXTE[k].slice(a, b))} din ${J(TEXTE[k])}: ${J(t)} (Word: ${J(rez)})`);
  }
  return rau.length ? [`${rau.length} diferențe; prima: ${rau[0]}`] : [];
}, { limita: 120000 });
verif('A-F021: cele 48 de lipiri din cazuri_word.json dau textul din Word real', async u => {
  const rau = [];
  for (const [k, poz, t, rez] of LIPIRI) {
    const s = TEXTE[k];
    await u.deschide({ paragrafe: [s, t], selectie: { de_la: s.length + 1, pana_la: s.length + 1 + t.length } });
    await u.p.keyboard.press('Control+c');
    await u.p.keyboard.press('Control+Home');
    for (let i = 0; i < poz; i++) await u.p.keyboard.press('ArrowRight');
    await u.p.keyboard.press('Control+v');
    await pauza(20);
    const x = (await u.text())[0];
    if (x !== rez) rau.push(`${J(t)} la ${poz} în ${J(s)}: ${J(x)} (Word: ${J(rez)})`);
  }
  return rau.length ? [`${rau.length} diferențe; prima: ${rau[0]}`] : [];
}, { limita: 150000 });
verif('A-F007: tastarea peste o selecție făcută cu tastele o înlocuiește întreagă (cele 3 tastări din cazuri_word.json)', async u => {
  const rau = [];
  for (const [k, a, b, t, rez] of TASTARI) {
    await u.deschide({ paragrafe: [TEXTE[k]], selectie: { de_la: a, pana_la: b } });
    await u.p.keyboard.type(t, { delay: 6 });
    await pauza(40);
    const x = (await u.text())[0];
    if (x !== rez) rau.push(`${J(t)} peste ${J(TEXTE[k].slice(a, b))}: ${J(x)} (Word: ${J(rez)})`);
  }
  return rau;
});
verif('A-F006 [2007]: „frumoase” șters dinaintea punctului și „Ana” de la început (Smart cut și pe 2007)', async u => {
  const pb = [];
  await u.deschide({ paragrafe: ['Ana are mere frumoase.'], selectie: { de_la: 13, pana_la: 21 } });
  await u.p.keyboard.press('Backspace');
  let t = (await u.text())[0];
  if (t !== 'Ana are mere.') pb.push(`⌫: ${J(t)}`);
  await u.deschide({ paragrafe: ['Ana are mere.'], selectie: { de_la: 0, pana_la: 3 } });
  await u.p.keyboard.press('Control+x');
  t = (await u.text())[0];
  if (t !== 'are mere.') pb.push(`Ctrl+X: ${J(t)}`);
  return pb;
}, { profil: 'word2007' });
verif('A-F021: Ctrl+V peste o selecție o șterge inteligent întâi (rezultate_word.json › lipire_peste_selectie), Ctrl+Z o pune la loc', async u => {
  const s = 'Plecăm luni la munte. Ne întoarcem vineri.';
  await u.deschide({ paragrafe: [s], selectie: { de_la: 35, pana_la: 41 } });
  await u.p.keyboard.press('Control+c');
  await u.p.keyboard.press('Control+Home');
  for (let i = 0; i < 7; i++) await u.p.keyboard.press('ArrowRight');
  for (let i = 0; i < 4; i++) await u.p.keyboard.press('Shift+ArrowRight');
  await u.p.keyboard.press('Control+v'); await pauza(60);
  const t = (await u.text())[0];
  const pb = t === 'Plecăm vineri la munte. Ne întoarcem vineri.' ? [] : [`lipit peste „luni”: ${J(t)}`];
  await u.p.keyboard.press('Control+z'); await pauza(60);
  const t2 = (await u.text())[0];
  if (t2 !== s) pb.push(`Ctrl+Z după lipire: ${J(t2)}`);
  return pb;
});

// ================= banda A: meniul de clic dreapta (Paste Options)
verif('A-F020: clic dreapta › Keep Source Formatting păstrează aldinul, Keep Text Only nu; Ctrl+Z anulează lipirea', async u => {
  const pb = [];
  await u.scrieLa('Ana are mere');
  await u.p.keyboard.press('Home');
  for (let i = 0; i < 3; i++) await u.p.keyboard.press('Shift+ArrowRight');
  await u.p.keyboard.press('Control+b'); await u.p.keyboard.press('Control+c');
  await u.p.keyboard.press('End'); await u.p.keyboard.type(' ');
  const meniu = async et => {
    const b = await u.par(1).boundingBox();
    await u.p.mouse.click(b.x + b.width - 3, b.y + b.height / 2, { button: 'right' }); await pauza(250);
    const l = u.p.locator(`${R} [data-lh-tinta="meniu:${et}"]:visible`).first();
    if (!(await l.count())) return false;
    await l.click(); await pauza(200); return true;
  };
  if (!(await meniu('Keep Text Only'))) return ['meniul n-are Keep Text Only'];
  let f = await u.aldin(), t = (await u.text())[0];
  if (!/Ana$/.test(t) || f.slice(-3) !== '000') pb.push(`Keep Text Only: ${J(t)} aldin ${f}`);
  await u.p.keyboard.press('Control+z'); await pauza(80);
  t = (await u.text())[0];
  if (t !== 'Ana are mere ') pb.push(`Ctrl+Z după Keep Text Only: ${J(t)}`);
  await u.p.keyboard.press('End');
  if (!(await meniu('Keep Source Formatting'))) return [...pb, 'meniul n-are Keep Source Formatting'];
  f = await u.aldin(); t = (await u.text())[0];
  if (!/Ana$/.test(t) || f.slice(-3) !== '111') pb.push(`Keep Source Formatting: ${J(t)} aldin ${f}`);
  // fără nimic copiat: doar Keep Text Only (referința UIA), fără pictogramele de Word
  await u.deschide({ paragrafe: ['Ana'] });
  const b = await u.par(1).boundingBox();
  await u.p.mouse.click(b.x + 5, b.y + b.height / 2, { button: 'right' }); await pauza(250);
  if (await u.p.locator(`${R} [data-lh-tinta="meniu:Keep Source Formatting"]:visible`).count()) pb.push('Keep Source Formatting apare și fără nimic copiat');
  return pb;
});

// ================= banda A: anularea
verif('A-F027: 365 — două Delete-uri la rând = două anulări; tastarea după ⌫ e altă anulare', async u => {
  const pb = [];
  await u.scrieLa('abcd');
  await u.p.keyboard.press('Control+Home');
  await u.p.keyboard.press('Delete'); await u.p.keyboard.press('Delete');
  await u.p.keyboard.press('Control+z'); await pauza(60);
  let t = (await u.text())[0];
  if (t !== 'bcd') pb.push(`după 2 × Delete + Ctrl+Z: ${J(t)} (trebuia „bcd”)`);
  await u.p.keyboard.press('Control+z'); await pauza(60);
  t = (await u.text())[0];
  if (t !== 'abcd') pb.push(`al doilea Ctrl+Z: ${J(t)}`);
  return pb;
});
verif('A-F026: Ctrl+Y de două ori după Enter = două Enter-uri în plus (Repeat se repetă)', async u => {
  await u.scrieLa('Ana');
  await u.p.keyboard.press('Enter');
  await u.p.keyboard.press('Control+y'); await u.p.keyboard.press('Control+y'); await pauza(80);
  const t = await u.text();
  return t.length === 4 ? [] : [`Enter + 2 × Ctrl+Y: ${t.length} paragrafe (trebuia 4)`];
});
verif('A-F026 [2007]: Delete apoi Ctrl+Y, apoi Ctrl+Z anulează doar repetarea', async u => {
  await u.scrieLa('abcd');
  await u.p.keyboard.press('Control+Home');
  await u.p.keyboard.press('Delete'); await u.p.keyboard.press('Control+y'); await pauza(60);
  const t1 = (await u.text())[0];
  await u.p.keyboard.press('Control+z'); await pauza(60);
  const t2 = (await u.text())[0];
  return t1 === 'cd' && t2 === 'bcd' ? [] : [`Delete + Ctrl+Y: ${J(t1)}; apoi Ctrl+Z: ${J(t2)} (trebuia „cd”, „bcd”)`];
}, { profil: 'word2007' });

// ================= banda A: editarea
verif('A-F005: Ctrl+⌫ în celulă, apoi Ctrl+Z pune cuvântul la loc', async u => {
  await u.deschide({ paragrafe: ['Ana', ''], tabel: { randuri: 2, coloane: 2, celule: [['unu doi trei', ''], ['', '']] }, cursor_in_celula: [1, 1] });
  await u.p.keyboard.press('End');
  await u.p.keyboard.press('Control+Backspace'); await pauza(60);
  const c1 = (await u.st()).tabele[0].celule[0][0];
  await u.p.keyboard.press('Control+z'); await pauza(60);
  const c2 = (await u.st()).tabele[0].celule[0][0];
  return c1 === 'unu doi ' && c2 === 'unu doi trei' ? [] : [`Ctrl+⌫: ${J(c1)}; Ctrl+Z: ${J(c2)}`];
});
verif('A-F007 [2007]: dublu clic pe „mere” (urmat de punct) + „pere” → „Ana are pere.”; Ctrl+Z întoarce cuvântul', async u => {
  await u.deschide({ paragrafe: ['Ana are mere.'] });
  const w = await u.cuvant('mere');
  await u.p.mouse.dblclick(w.cx, w.cy); await pauza(250);
  await u.p.keyboard.type('pere', { delay: 8 }); await pauza(80);
  const t1 = (await u.text())[0];
  for (let i = 0; i < 4 && (await u.text())[0] !== 'Ana are mere.'; i++) { await u.p.keyboard.press('Control+z'); await pauza(60); }
  const t2 = (await u.text())[0];
  return t1 === 'Ana are pere.' && t2 === 'Ana are mere.' ? [] : [`tastat: ${J(t1)}; după Ctrl+Z: ${J(t2)}`];
}, { profil: 'word2007' });
verif('A-F007: pe telefon, două atingeri pe „mâine” + „joi” → spațiul rămâne', async u => {
  await u.deschide({ paragrafe: ['Plecăm mâine la bunici.'] });
  const w = await u.cuvant('mâine');
  await u.p.touchscreen.tap(w.cx, w.cy); await pauza(90); await u.p.touchscreen.tap(w.cx, w.cy); await pauza(250);
  const s = (await u.st()).selectie;
  await u.p.keyboard.type('joi', { delay: 8 }); await pauza(80);
  const t = (await u.text())[0];
  return t === 'Plecăm joi la bunici.' ? [] : [`selecția ${J(s.text)}, apoi „joi”: ${J(t)}`];
}, { tel: true });

// ================= banda A: selectia
verif('A-F015: Ctrl+clic pe ultima propoziție fără punct și în paragraful 2', async u => {
  const pb = [];
  await u.deschide({ paragrafe: ['Ana are mere. Dan are pere', 'Ion are prune! Maria are nuci.'] });
  const ctrlClic = async (cuv) => { const w = await u.cuvant(cuv); await u.p.keyboard.down('Control'); await u.p.mouse.click(w.cx, w.cy); await u.p.keyboard.up('Control'); await pauza(150); return (await u.st()).selectie.text; };
  let s = await ctrlClic('pere');
  if (s !== 'Dan are pere') pb.push(`Ctrl+clic pe „pere”: ${J(s)}`);
  s = await ctrlClic('prune');
  if (s !== 'Ion are prune! ') pb.push(`Ctrl+clic pe „prune”: ${J(s)}`);
  return pb;
});

// ================= banda A: clipboard (Ctrl+tragere)
verif('A-F023: Ctrl+tragere (după o pauză) copiază „uno ” înaintea lui „tres”; Ctrl+Z o scoate', async u => {
  await u.deschide({ paragrafe: ['uno dos tres'] });
  const a = await u.cuvant('uno'), b = await u.cuvant('tres');
  await u.p.mouse.dblclick(a.cx, a.cy); await pauza(650);
  await u.p.mouse.move(a.cx, a.cy); await u.p.mouse.down();
  await u.p.mouse.move((a.cx + b.x) / 2, a.cy, { steps: 5 }); await u.p.mouse.move(b.x + 1, b.cy, { steps: 5 }); await pauza(120);
  await u.p.keyboard.down('Control'); await pauza(50); await u.p.mouse.up(); await u.p.keyboard.up('Control'); await pauza(200);
  const t1 = (await u.text())[0];
  await u.p.keyboard.press('Control+z'); await pauza(80);
  const t2 = (await u.text())[0];
  return t1 === 'uno dos uno tres' && t2 === 'uno dos tres' ? [] : [`Ctrl+tragere: ${J(t1)}; Ctrl+Z: ${J(t2)}`];
});

// ================= banda A: derularea
verif('A-F010: degetul barei coboară după PageDown, „Page up” apare deasupra lui și urcă un ecran', async u => {
  const pb = [];
  await u.deschide({ paragrafe: Array.from({ length: 80 }, (_, i) => 'Rândul ' + (i + 1)) });
  const deget = u.p.locator(`${R} [data-lh-tip="ScrollBar"] [data-lh-tip="Thumb"]`).first();
  const pu = u.p.locator(`${R} [data-lh-tinta="bara_derulare:Page up"]`).first();
  const y0 = (await deget.boundingBox()).y;
  if (await pu.isVisible()) pb.push('„Page up” se vede cu documentul la început');
  await u.par(1).click();
  await u.p.keyboard.press('PageDown'); await pauza(200);
  const y1 = (await deget.boundingBox()).y;
  if (!(y1 > y0 + 5)) pb.push(`degetul nu coboară după PageDown (${Math.round(y0)} → ${Math.round(y1)})`);
  const z = () => u.p.evaluate(R => document.querySelector(R + ' .lh-ap-zona').scrollTop, R);
  const s1 = await z();
  if (!(await pu.isVisible())) pb.push('„Page up” nu apare după PageDown');
  else { await pu.click(); await pauza(200); const s2 = await z(); if (!(s2 < s1 - 40)) pb.push(`clic pe „Page up”: scrollTop ${s1} → ${s2}`); }
  return pb;
});

// ================= banda A, lotul 2 (formatarea)
const fmtSt = async (u, cuv) => ((await u.st()).formatare_pe_caractere || []).find(x => x.text.includes(cuv)) || {};
const stilVazut = (u, cuv) => u.p.evaluate(([R, cuv]) => {
  const root = document.querySelector(R);
  const w = document.createTreeWalker(root.querySelector('[data-lh-tinta="document"]'), NodeFilter.SHOW_TEXT);
  while (w.nextNode()) if (w.currentNode.textContent.includes(cuv)) { const cs = getComputedStyle(w.currentNode.parentElement); return { font: cs.fontFamily, culoare: cs.color, marime: parseFloat(cs.fontSize) }; }
  return null;
}, [R, cuv]);
verif('A-F033 [2007]: Georgia din listă pe „Ana”, Ctrl+Z o scoate; „Verdana” scris cu cursorul în „mere” = tot cuvântul', async u => {
  const pb = [];
  await u.deschide({ paragrafe: ['Ana are mere'], selectie: { de_la: 0, pana_la: 3 } });
  await u.p.locator(`${R} [data-lh-id-mso="Font"] [data-lh-tip="Button"]`).first().click(); await pauza(200);
  await u.p.locator(`${R} .lh-ap-meniu [data-lh-tinta="meniu:Georgia"], ${R} .lh-ap-meniu [data-lh-eticheta="Georgia"]`).first().click(); await pauza(150);
  let v = await stilVazut(u, 'Ana');
  if (!/Georgia/.test(v && v.font)) pb.push(`Georgia: ${v && v.font}`);
  await u.p.keyboard.press('Control+z'); await pauza(80);
  v = await stilVazut(u, 'Ana');
  if (/Georgia/.test(v && v.font)) pb.push('Ctrl+Z nu scoate Georgia');
  await u.p.keyboard.press('Control+End'); for (let i = 0; i < 2; i++) await u.p.keyboard.press('ArrowLeft');
  const c = u.p.locator(`${R} [data-lh-id-mso="Font"] input`).first();
  await c.click(); await u.p.keyboard.press('Control+a'); await u.p.keyboard.type('Verdana'); await u.p.keyboard.press('Enter'); await pauza(150);
  v = await stilVazut(u, 'mere');
  const va = await stilVazut(u, 'Ana');
  if (!/Verdana/.test(v && v.font) || /Verdana/.test(va && va.font)) pb.push(`Verdana în „mere”: mere ${v && v.font}, Ana ${va && va.font}`);
  return pb;
}, { profil: 'word2007' });
verif('A-F036: Blue din listă, butonul pune apoi Blue, Automatic scoate culoarea; Ctrl+Z', async u => {
  const pb = [];
  await u.deschide({ paragrafe: ['Ana are mere'], selectie: { de_la: 0, pana_la: 3 } });
  const lista = async et => { await u.p.locator(`${R} [data-lh-id-mso="FontColorPicker_Dropdown"]`).first().click(); await pauza(200); await u.p.locator(`${R} .lh-ap-meniu [data-lh-tinta="meniu:${et}"], ${R} .lh-ap-meniu [data-lh-eticheta="${et}"]`).first().click(); await pauza(150); };
  await lista('Blue');
  let v = await stilVazut(u, 'Ana');
  if (!v || v.culoare !== 'rgb(0, 112, 192)') pb.push(`Blue: ${v && v.culoare}`);
  await u.p.keyboard.press('Control+End'); for (let i = 0; i < 4; i++) await u.p.keyboard.press('Shift+ArrowLeft');
  await u.p.locator(`${R} [data-lh-id-mso="FontColorPicker"] [data-lh-tip="Button"]`).first().click(); await pauza(150);
  v = await stilVazut(u, 'mere');
  if (!v || v.culoare !== 'rgb(0, 112, 192)') pb.push(`butonul după Blue, pe „mere”: ${v && v.culoare}`);
  await u.p.keyboard.press('Control+z'); await pauza(80);
  v = await stilVazut(u, 'mere');
  if (!v || v.culoare === 'rgb(0, 112, 192)') pb.push('Ctrl+Z nu scoate culoarea de pe „mere”');
  await u.p.keyboard.press('Control+Home'); for (let i = 0; i < 3; i++) await u.p.keyboard.press('Shift+ArrowRight');
  await lista('Automatic');
  v = await stilVazut(u, 'Ana');
  if (!v || v.culoare === 'rgb(0, 112, 192)') pb.push(`Automatic: ${v && v.culoare}`);
  return pb;
});
verif('A-F035: Grow Font de la 1630 se oprește la 1638; Shrink Font de la 1 rămâne 1', async u => {
  const pb = [];
  await u.deschide({ paragrafe: ['Ana'], selectie: { de_la: 0, pana_la: 3 } });
  const c = u.p.locator(`${R} [data-lh-id-mso="FontSize"] input`).first();
  const pune = async v => { await c.click(); await u.p.keyboard.press('Control+a'); await u.p.keyboard.type(String(v)); await u.p.keyboard.press('Enter'); await pauza(150); };
  await pune(1630);
  await u.p.keyboard.press('Control+Shift+Period'); await pauza(100);
  let m = (await fmtSt(u, 'Ana')).marime;
  if (m !== 1638) pb.push(`1630 + Ctrl+Shift+>: ${m}`);
  await pune(1);
  await u.p.keyboard.press('Control+Shift+Comma'); await pauza(100);
  m = (await fmtSt(u, 'Ana')).marime;
  if (m !== 1) pb.push(`1 + Ctrl+Shift+<: ${m}`);
  return pb;
});
verif('A-F037/F044 [2007]: Ctrl+Z după Ctrl+Space pune aldinul la loc; Ctrl+M apoi Ctrl+Q scoate retragerea', async u => {
  const pb = [];
  await u.deschide({ paragrafe: ['Ana are'], selectie: { de_la: 0, pana_la: 7 } });
  await u.p.keyboard.press('Control+b'); await u.p.keyboard.press('Control+Space'); await pauza(80);
  if ((await fmtSt(u, 'Ana')).bold) pb.push('Ctrl+Space n-a scos aldinul');
  await u.p.keyboard.press('Control+z'); await pauza(80);
  if (!(await fmtSt(u, 'Ana')).bold) pb.push('Ctrl+Z după Ctrl+Space nu pune aldinul la loc');
  const x = () => u.p.evaluate(R => document.querySelector(R + ' [data-lh-zona] [data-lh-tinta="text"][data-lh-id="1"], ' + R + ' [data-lh-zona] [data-lh-tinta="text:1"]').getBoundingClientRect().left, R);
  const x0 = await x();
  await u.p.keyboard.press('Control+m'); await pauza(80);
  const x1 = await x();
  await u.p.keyboard.press('Control+q'); await pauza(80);
  const x2 = await x();
  if (!(x1 > x0 + 30) || Math.abs(x2 - x0) > 1) pb.push(`retragerea: ${Math.round(x0)} → Ctrl+M ${Math.round(x1)} → Ctrl+Q ${Math.round(x2)}`);
  return pb;
}, { profil: 'word2007' });
verif('A-F046: Heading 1 pe tot paragraful îl schimbă (stil de paragraf), pe o bucată doar bucata; Ctrl+Z', async u => {
  const pb = [];
  await u.deschide({ paragrafe: ['Textul primei părți.'], selectie: { de_la: 0, pana_la: 6 } });
  const h1 = async () => { const g = u.p.locator(`${R} [data-lh-id-mso="QuickStylesGallery"] [data-lh-eticheta="Heading 1"]`).first(); await g.click(); await pauza(200); };
  await h1();
  let s = await u.st();
  const v = await stilVazut(u, 'Textul'), vr = await stilVazut(u, 'primei');
  if (s.stil_paragrafe[0] !== 'Normal' || !v || !vr || !(v.marime > vr.marime + 2)) pb.push(`bucata: stil ${s.stil_paragrafe[0]}, mărimi ${v && v.marime}/${vr && vr.marime}`);
  await u.p.keyboard.press('Control+z'); await pauza(80);
  const v2 = await stilVazut(u, 'Textul');
  if (!v2 || v2.marime !== vr.marime) pb.push(`Ctrl+Z după bucată: ${v2 && v2.marime}`);
  await u.p.keyboard.press('Control+a'); await h1();
  s = await u.st();
  if (s.stil_paragrafe[0] !== 'Heading 1') pb.push(`tot paragraful: ${s.stil_paragrafe[0]}`);
  return pb;
});
verif('A-F045/F040: ¶ nu e o operație de anulat; ⌫ la începutul unui paragraf fără alineat îl unește cu cel dinainte', async u => {
  const pb = [];
  await u.deschide({ paragrafe: ['Ana', 'are'] });
  await u.p.locator(`${R} [data-lh-id-mso="ParagraphMarks"]`).first().click(); await pauza(120);
  await u.p.keyboard.press('Control+z'); await pauza(80);
  if ((await u.p.locator(`${R} [data-lh-id-mso="ParagraphMarks"]`).first().getAttribute('aria-pressed')) !== 'true') pb.push('Ctrl+Z a ascuns semnele');
  await u.p.keyboard.press('Control+End'); await u.p.keyboard.press('Home'); await u.p.keyboard.press('Backspace'); await pauza(80);
  const t = await u.text();
  if (J(t) !== J(['Anaare'])) pb.push(`⌫ la începutul lui „are”: ${J(t)}`);
  return pb;
});

// ================= rularea
async function main() {
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const v of VERIF) {
      let u = null;
      try {
        u = await pagina(browser, base, v.opt);
        const lim = v.opt.limita || 30000;
        let t;
        const pb = await Promise.race([v.fn(u), new Promise((_, rej) => { t = setTimeout(() => rej(new Error(`timp depășit (${lim / 1000} s)`)), lim); })]).finally(() => clearTimeout(t));
        const er = [...new Set(u.erori)];
        if (er.length) pb.push('eroare în pagină: ' + er.slice(0, 2).join(' | '));
        scrie(pb.length ? 'FAIL' : 'PASS', v.nume, pb.join('; '));
      } catch (e) {
        scrie('FAIL', v.nume, 'a crăpat: ' + e.message.split('\n')[0].slice(0, 200));
      } finally { if (u) await u.ctx.close().catch(() => {}); }
    }
  } finally {
    await browser.close();
    srv.close();
  }
  console.log(String(nFail));
}

main().catch(e => { console.log('FAIL eroare la rulare - ' + e.message); console.log('1'); process.exitCode = 0; });
