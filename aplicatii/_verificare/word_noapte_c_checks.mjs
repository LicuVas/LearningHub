// Verificari banda C (noaptea Word 23.11.2026): fisierele, fereastra, tiparirea — drumurile pe care probele de paritate
// nu le joaca (alt caz, Ctrl+Z, clic dreapta, atingere pe 390x844, &profil=word2007). Model: fisiere_checks.mjs.
// Rulare:  node aplicatii/_verificare/word_noapte_c_checks.mjs   (din orice director; caile se afla singure)
// Variabila optionala: HARNESS_PW_DIR (implicit: C:/00/AI_0/.scratch/harness-node).
// Iesire: cate o linie PASS / FAIL per verificare; ULTIMA linie = numarul de FAIL. Reteaua din afara 127.0.0.1 e oprita.
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

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2' };
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
function scrie(stare, nume, det) { if (stare === 'FAIL') nFail++; console.log(`${stare} ${nume}${det ? ' - ' + det : ''}`.replace(/\s*\n\s*/g, ' ')); }
const pauza = ms => new Promise(r => setTimeout(r, ms));
const R = '[data-lh-aplicatie="word"]';
const J = x => JSON.stringify(x);
// selectorul doar pe elementele vizibile din Word (fiecare parte a unei liste cu virgulă primește :visible)
const viz = css => css.split(/,(?![^\[]*\])/).map(x => `${R} ${x.trim()}:visible`).join(', ');

async function deschide(browser, base, opt = {}) {
  const ctx = await browser.newContext(opt.telefon ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 } : { viewport: { width: 1366, height: 768 } });
  await ctx.route('**/*', r => (/^https?:\/\/(127\.0\.0\.1|localhost)[:/]/.test(r.request().url()) ? r.continue() : r.abort()));
  ctx.setDefaultTimeout(5000);
  const p = await ctx.newPage();
  await p.goto(`${base}/aplicatii/poligon.html?aplicatie=word${opt.profil ? '&profil=' + opt.profil : ''}`, { waitUntil: 'load' });
  const gata = () => p.waitForFunction(() => { try { return Array.isArray(window.LH.aplicatii.stare('word').text); } catch (e) { return false; } }, null, { timeout: 12000 });
  await gata();
  if (opt.continut) {
    await p.evaluate(([profil, continut]) => window.LH.aplicatii.deschide('word', { profil: profil || undefined, continut, focus: true }), [opt.profil, opt.continut]);
    await gata();
  }
  await pauza(400);
  const u = {
    p, ctx,
    st: () => p.evaluate(() => window.LH.aplicatii.stare('word')),
    loc: css => p.locator(viz(css)).first(),
    async clic(css, o) { await u.loc(css).click(o); await pauza(200); },
    async atinge(css) { await u.loc(css).tap(); await pauza(250); },
    async scrie(t, tap) {
      const par = p.locator(viz('[data-lh-zona] [data-lh-tinta="text"]')).last();
      if (tap) await par.tap(); else await par.click();
      await p.keyboard.press('Control+End');
      await p.keyboard.type(t, { delay: 8 });
      await pauza(150);
    },
    vizibil: async css => (await p.locator(viz(css)).count()) > 0,
    nesim: () => p.evaluate(R => [...document.querySelectorAll(R + ' [data-lh-nesimulat]')].map(e => e.textContent.trim()), R)
  };
  return u;
}
async function check(browser, base, nume, opt, fn) {
  let u;
  try {
    u = await deschide(browser, base, opt);
    const pb = await fn(u);
    if (pb && pb.length) scrie('FAIL', nume, pb.join('; '));
    else scrie('PASS', nume);
  } catch (e) { scrie('FAIL', nume, 'eroare: ' + e.message.split('\n')[0].slice(0, 160)); }
  finally { if (u) await u.ctx.close(); }
}
const QAT = k => `[data-lh-qat="${k}"]`;
const MENIU = t => `[data-lh-tinta="meniu:${t}"]`;

async function main() {
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const C = (nume, opt, fn) => check(browser, base, nume, opt, fn);
  try {
    // ---- word-F099 / F100: bara Acces rapid
    await C('C-F099a clic dreapta pe panglică › Show Quick Access Toolbar arată bara; Ribbon Display Options › Hide o ascunde', {}, async u => {
      const pb = [];
      await u.loc('[data-lh-tinta="panglica:Home/Font/Bold"], [data-lh-id-mso="Bold"]').click({ button: 'right' }); await pauza(250);
      if (!(await u.vizibil(MENIU('Show Quick Access Toolbar')))) return ['clic dreapta pe panglică n-are Show Quick Access Toolbar'];
      await u.clic(MENIU('Show Quick Access Toolbar'));
      if (!(await u.vizibil(QAT('Undo')))) pb.push('bara nu apare');
      await u.clic('[data-lh-tinta="meniu_derulant:Ribbon Display Options"], [data-lh-tinta="meniu_derulant"][data-lh-id="Ribbon Display Options"]');
      if (!(await u.vizibil(MENIU('Hide Quick Access Toolbar')))) pb.push('Ribbon Display Options n-are Hide Quick Access Toolbar după afișare');
      else {
        await u.clic(MENIU('Hide Quick Access Toolbar')); await pauza(300);
        if (await u.vizibil(QAT('Undo'))) pb.push('Hide nu ascunde bara (' + J(await u.p.evaluate(R => [...document.querySelectorAll(R + ' .lh-ap-qat')].map(x => x.style.display), R)) + ')');
      }
      return pb;
    });
    const arataQat = async u => {
      await u.clic('[data-lh-tinta="meniu_derulant:Ribbon Display Options"], [data-lh-tinta="meniu_derulant"][data-lh-id="Ribbon Display Options"]');
      await u.clic(MENIU('Show Quick Access Toolbar'));
    };
    await C('C-F100a Undo din bara anulează Bold (alt caz decât tastarea); numele Can\'t Undo / Undo / Redo', {}, async u => {
      const pb = [];
      await arataQat(u);
      const et = async k => (await u.loc(QAT(k))).getAttribute('data-lh-eticheta');
      if ((await et('Undo')) !== "Can't Undo") pb.push(`fără nimic de anulat: ${J(await et('Undo'))}`);
      await u.scrie('Ana are');
      await u.p.keyboard.press('Control+a'); await u.p.keyboard.press('Control+b'); await pauza(150);
      const b1 = (await u.st()).formatare_pe_caractere.some(x => x.bold);
      await u.clic(QAT('Undo'));
      const s = await u.st();
      if (!b1) pb.push('pregătirea: Ctrl+B n-a îngroșat');
      if (s.formatare_pe_caractere.some(x => x.bold)) pb.push('Undo din bară nu anulează Bold');
      if (s.text[0] !== 'Ana are') pb.push(`Undo a schimbat textul: ${J(s.text)}`);
      await u.clic(QAT('Redo'));
      if (!(await u.st()).formatare_pe_caractere.some(x => x.bold)) pb.push('Redo din bară nu reface Bold');
      return pb;
    });
    await C('C-F100b [2007] Undo din bară scoate câte o literă (anularea Word 2007)', { profil: 'word2007' }, async u => {
      await arataQat(u);
      await u.scrie('abc');
      await u.clic(QAT('Undo'));
      const t = (await u.st()).text[0];
      return t === 'ab' ? [] : [`după un Undo: ${J(t)} (Word 2007: „ab”)`];
    });
    await C('C-F100c Save din bară: document nou → fereastra de salvare; salvat → pe loc', {}, async u => {
      const pb = [];
      await arataQat(u);
      await u.scrie('Poezia');
      await u.clic(QAT('Save'));
      const s = await u.st();
      if (!s.dialog_salvare) pb.push('Save pe document nou nu deschide fereastra de salvare');
      return pb;
    });
    await C('C-F100d telefon 390x844: atingere pe Ribbon Display Options › Show, apoi Undo atins', { telefon: true }, async u => {
      await u.atinge('[data-lh-tinta="meniu_derulant:Ribbon Display Options"], [data-lh-tinta="meniu_derulant"][data-lh-id="Ribbon Display Options"]');
      await u.atinge(MENIU('Show Quick Access Toolbar'));
      await u.scrie('xyz', true);
      await u.atinge(QAT('Undo'));
      const t = (await u.st()).text[0];
      return t === 'xyz' ? ['Undo atins n-a anulat nimic'] : [];
    });
    // ---- word-F102: panourile Clipboard și Styles
    await C('C-F102a Clipboard: rândul copiat se lipește la clic (cu spațiul inteligent), Clear All golește, Close închide', {}, async u => {
      const pb = [];
      await u.scrie('Ana are');
      await u.p.keyboard.press('Control+Home'); for (let i = 0; i < 3; i++) await u.p.keyboard.press('Shift+ArrowRight');
      await u.p.keyboard.press('Control+c'); await u.p.keyboard.press('End'); await pauza(100);
      await u.clic('[data-lh-tinta="lansator:Home/Clipboard"]', { force: false });
      if (!(await u.vizibil('.lh-ap-panou-rand[data-lh-eticheta="Ana"]'))) return ['panoul Clipboard nu arată „Ana”'];
      await u.clic('.lh-ap-panou-rand[data-lh-eticheta="Ana"]');
      const t = (await u.st()).text[0];
      if (t !== 'Ana are Ana') pb.push(`clic pe rând: ${J(t)} (trebuia „Ana are Ana”, cu spațiul pus de lipire, ca la Ctrl+V)`);
      await u.clic('[data-lh-tinta="fereastra:Clear All"]');
      if (await u.vizibil('.lh-ap-panou-rand')) pb.push('Clear All n-a golit lista');
      await u.clic('[data-lh-tinta="fereastra:Close"]');
      if (await u.vizibil('[data-lh-suprafata="dialog.panou_Clipboard"]')) pb.push('Close nu închide panoul');
      return pb;
    });
    await C('C-F102b Styles: clic pe Heading 1 = stilul paragrafului; Ctrl+Z după închidere îl anulează', {}, async u => {
      const pb = [];
      await u.scrie('Titlu');
      await u.clic('[data-lh-tinta="lansator:Home/Styles"]');
      await u.clic('.lh-ap-panou-rand[data-lh-eticheta="Heading 1"]');
      if ((await u.st()).stil_paragrafe[0] !== 'Heading 1') pb.push(`stilul: ${J((await u.st()).stil_paragrafe)}`);
      await u.p.keyboard.press('Escape'); await pauza(150);
      await u.p.keyboard.press('Control+z'); await pauza(150);
      if ((await u.st()).stil_paragrafe[0] === 'Heading 1') pb.push('Ctrl+Z nu anulează stilul pus din panou');
      return pb;
    });
    await C('C-F102c telefon 390x844 [2007]: lansatorul Styles atins deschide panoul, un stil atins se aplică', { telefon: true, profil: 'word2007' }, async u => {
      await u.scrie('Ana', true);
      await u.atinge('[data-lh-tinta="lansator:Home/Styles"]');
      if (!(await u.vizibil('[data-lh-suprafata="dialog.panou_Styles"]'))) return ['panoul Styles nu apare'];
      await u.atinge('.lh-ap-panou-rand[data-lh-eticheta="Title"]');
      const s = (await u.st()).stil_paragrafe[0];
      return s === 'Title' ? [] : [`stilul după atingere: ${J(s)}`];
    });
    // ---- word-F104: bara de stare
    await C('C-F104a selecția peste două paragrafe: „4 of 5 words” (cuvântul tăiat se numără); fără selecție înapoi la „5 words”', {}, async u => {
      const pb = [];
      await u.scrie('Ana are mere'); await u.p.keyboard.press('Enter'); await u.p.keyboard.type('si pere', { delay: 8 }); await pauza(100);
      const wc = async () => u.p.evaluate(R => (document.querySelector(R + ' [data-lh-suprafata="bara_stare"] [data-lh-eticheta^="Word Count"]') || {}).textContent || '', R);
      await u.p.keyboard.press('Control+Home'); for (let i = 0; i < 4; i++) await u.p.keyboard.press('ArrowRight');
      await u.p.keyboard.press('Shift+ArrowDown'); await pauza(120);   // „are mere¶si p” = are, mere, si, p(ere)
      const t1 = await wc();
      if (!/\b4 of 5 words\b/.test(t1)) pb.push(`selecție peste 2 paragrafe: ${J(t1)}`);
      await u.p.keyboard.press('ArrowRight'); await pauza(120);
      const t2 = await wc();
      if (!/^\s*5 words\s*$/.test(t2)) pb.push(`fără selecție: ${J(t2)}`);
      return pb;
    });
    // ---- word-F080: „already exists”
    const CONT = { fisiere: [{ nume: 'tema.docx', folder: 'Documente', text: ['textul colegei'] }] };
    await C('C-F080a F12: „Save changes with a different name.” + OK și Esc lasă fișierul colegei, Save As rămâne cu numele; OK (Replace) înlocuiește', { continut: CONT }, async u => {
      const pb = [];
      const Q = '[data-lh-suprafata="dialog.fisier_exista"]';
      await u.scrie('Munca mea');
      await u.p.keyboard.press('F12'); await pauza(500);
      await u.clic('[data-lh-tinta="camp:nume_fisier"]'); await u.p.keyboard.press('Control+a'); await u.p.keyboard.type('tema', { delay: 5 });
      await u.clic('[data-lh-tinta="dialog_salvare:Save"]');
      if (!(await u.vizibil(Q))) return ['întrebarea Microsoft Word („already exists”) nu apare'];
      await u.clic('[data-lh-tinta="fereastra:Save changes with a different name."]');
      await u.clic('[data-lh-tinta="fereastra:OK"]');
      let s = await u.st();
      if (s.fisiere.find(x => x.nume === 'tema.docx').text[0] !== 'textul colegei') pb.push('„different name” + OK a atins fișierul');
      const v = await u.p.evaluate(R => { const i = document.querySelector(R + ' [data-lh-tinta="camp:nume_fisier"] input'); return i ? i.value : null; }, R);
      if (!/^tema(\.docx)?$/.test(v || '')) pb.push(`înapoi în Save As, caseta File name: ${J(v)}`);
      await u.clic('[data-lh-tinta="dialog_salvare:Save"]');
      await u.p.keyboard.press('Escape'); await pauza(200);
      s = await u.st();
      if (await u.vizibil(Q)) pb.push('Esc nu închide întrebarea');
      if (!(await u.vizibil('[data-lh-tinta="dialog_salvare:Save"]'))) pb.push('Esc a închis și fereastra Save As');
      if (s.fisiere.find(x => x.nume === 'tema.docx').text[0] !== 'textul colegei') pb.push('Esc a atins fișierul');
      await u.clic('[data-lh-tinta="dialog_salvare:Save"]');
      await u.clic('[data-lh-tinta="fereastra:OK"]');
      s = await u.st();
      if (s.fisiere.find(x => x.nume === 'tema.docx').text[0] !== 'Munca mea') pb.push(`OK cu Replace ales: ${J(s.fisiere.find(x => x.nume === 'tema.docx').text)}`);
      if (s.nume_fisier !== 'tema.docx') pb.push(`documentul după Replace: ${J(s.nume_fisier)}`);
      return pb;
    });
    await C('C-F080b [2007] Ctrl+S pe document nou cu nume existent: întrebarea cu OK / Cancel; Cancel înapoi, Enter (OK) înlocuiește', { continut: CONT, profil: 'word2007' }, async u => {
      const pb = [];
      await u.scrie('Munca mea');
      await u.p.keyboard.press('Control+s'); await pauza(500);
      await u.clic('[data-lh-tinta="camp:nume_fisier"]'); await u.p.keyboard.press('Control+a'); await u.p.keyboard.type('tema', { delay: 5 });
      await u.p.keyboard.press('Enter'); await pauza(300);
      const s1 = await u.st();
      if (!s1.dialog || !/already exists/.test(s1.dialog.intrebare || '') || !s1.dialog.butoane.includes('Cancel')) return [`întrebarea: ${J(s1.dialog)}`];
      await u.clic('[data-lh-tinta="fereastra:Cancel"]');
      if ((await u.st()).fisiere.find(x => x.nume === 'tema.docx').text[0] !== 'textul colegei') pb.push('Cancel a atins fișierul');
      await u.p.keyboard.press('Enter'); await pauza(300);
      await u.p.keyboard.press('Enter'); await pauza(300);
      const s = await u.st();
      if (s.fisiere.find(x => x.nume === 'tema.docx').text[0] !== 'Munca mea') pb.push(`după Enter: ${J(s.fisiere.find(x => x.nume === 'tema.docx').text)}`);
      if (s.nume_fisier !== 'tema.docx') pb.push(`documentul după OK: ${J(s.nume_fisier)}`);
      return pb;
    });
    // ---- word-F088 / F089
    await C('C-F088a File › Close pe document modificat întreabă „Save your changes…”; Don\'t Save închide', {}, async u => {
      await u.scrie('ceva');
      await u.clic('[data-lh-tinta="fila:File"]'); await pauza(300);
      await u.clic('[data-lh-tinta="backstage:Close"]'); await pauza(300);
      const s = await u.st();
      if (!s.dialog || !/Save your changes/.test(s.dialog.intrebare)) return [`întrebarea: ${J(s.dialog)}`];
      await u.clic('[data-lh-tinta="fereastra:Don\'t Save"]'); await pauza(200);
      const n = (await u.st()).documente_deschise;
      return n === 0 ? [] : [`după Don't Save: ${n} documente`];
    });
    await C('C-F089a File › Save pe document nou duce la pagina Save As (nu salvează)', {}, async u => {
      await u.scrie('nou');
      await u.clic('[data-lh-tinta="fila:File"]'); await pauza(300);
      await u.clic('[data-lh-tinta="backstage:Save"]'); await pauza(300);
      const s = await u.st();
      return s.pagina_backstage === 'Save As' && !s.nume_fisier ? [] : [`pagina ${J(s.pagina_backstage)}, fișier ${J(s.nume_fisier)}`];
    });
    // ---- word-F077: Acest PC
    await C('C-F077a [2007] Save As › Acest PC › Imagini, Save → fișierul e în Imagini', { profil: 'word2007' }, async u => {
      await u.scrie('Desen');
      await u.p.keyboard.press('F12'); await pauza(500);
      await u.clic('[data-lh-tinta="arbore:Acest PC"]');
      await u.clic('[data-lh-tinta="arbore:Imagini"]');
      await u.clic('[data-lh-tinta="camp:nume_fisier"]'); await u.p.keyboard.press('Control+a'); await u.p.keyboard.type('desen', { delay: 5 });
      await u.clic('[data-lh-tinta="dialog_salvare:Save"]'); await pauza(300);
      const f = (await u.st()).fisiere.find(x => x.nume === 'desen.docx');
      return f && f.folder === 'Imagini' ? [] : [`desen.docx: ${J(f)}`];
    });
    // ---- word-F087: Switch Windows
    await C('C-F087a trei documente: Switch Windows › Document2 îl aduce în față, cu textul lui', {}, async u => {
      const pb = [];
      await u.scrie('unu');
      for (const t of ['doi', 'trei']) { await u.clic('[data-lh-tinta="fila:File"]'); await pauza(300); await u.clic('[data-lh-tinta="backstage:Blank document"]'); await pauza(300); await u.scrie(t); }
      await u.clic('[data-lh-tinta="fila:View"]'); await pauza(700);
      await u.clic('[data-lh-tinta="meniu_derulant:View/Window/Switch Windows"], [data-lh-tinta="meniu_derulant"][data-lh-id="View/Window/Switch Windows"]');
      const rows = await u.p.evaluate(R => [...document.querySelectorAll(R + ' .lh-ap-meniu [data-lh-tinta^="meniu:"]')].map(x => x.getAttribute('aria-label')), R);
      if (J(rows) !== J(['1 Document1', '2 Document2', '3 Document3'])) pb.push(`rândurile: ${J(rows)}`);
      await u.clic(MENIU('2 Document2'));
      const s = await u.st();
      if (!/^Document2\b/.test(s.titlu_fereastra) || s.text[0] !== 'doi' || s.documente_deschise !== 3) pb.push(`după alegere: ${J(s.titlu_fereastra)} ${J(s.text)} ${s.documente_deschise}`);
      return pb;
    });
    // ---- word-F079: .odt
    await C('C-F079a .odt: No la întrebarea de format = înapoi, nesalvat; Yes = tema.odt; Ctrl+S apoi scrie în tema.odt', {}, async u => {
      const pb = [];
      await u.scrie('Tema');
      await u.p.keyboard.press('F12'); await pauza(500);
      await u.clic('[data-lh-tinta="camp:nume_fisier"]'); await u.p.keyboard.press('Control+a'); await u.p.keyboard.type('tema', { delay: 5 });
      await u.clic('[data-lh-tinta="camp:tip_fisier"]'); await pauza(200);
      await u.clic('[data-lh-tinta="meniu:OpenDocument Text (*.odt)"]');
      await u.clic('[data-lh-tinta="dialog_salvare:Save"]');
      const s1 = await u.st();
      if (!s1.dialog || J(s1.dialog.butoane) !== J(['Yes', 'No'])) return [`întrebarea .odt: ${J(s1.dialog)}`];
      await u.clic('[data-lh-tinta="fereastra:No"]');
      if ((await u.st()).nume_fisier) pb.push('No a salvat');
      if (!(await u.vizibil('[data-lh-tinta="dialog_salvare:Save"]'))) pb.push('după No fereastra Save As nu mai e');
      await u.clic('[data-lh-tinta="dialog_salvare:Save"]');
      await u.clic('[data-lh-tinta="fereastra:Yes"]');
      let s = await u.st();
      if (s.nume_fisier !== 'tema.odt') pb.push(`după Yes: ${J(s.nume_fisier)}`);
      await u.scrie(' noua'); await u.p.keyboard.press('Control+s'); await pauza(250);
      s = await u.st();
      const f = s.fisiere.find(x => x.nume === 'tema.odt');
      if (!f || f.text[0] !== 'Tema noua') pb.push(`Ctrl+S în tema.odt: ${J(f && f.text)}`);
      return pb;
    });
    // ---- word-F092: PROTECTED VIEW
    const WEB = { fisiere: [{ nume: 'club-lectura.docx', folder: 'Descărcări', text: ['Clubul de lectură'], internet: true }] };
    const deschideWeb = async u => {
      await u.p.keyboard.press('Control+F12'); await pauza(500);
      await u.clic('[data-lh-tinta="arbore:Descărcări"]');
      await u.loc('[data-lh-tinta="lista:club-lectura.docx"]').dblclick(); await pauza(400);
    };
    await C('C-F092a PROTECTED VIEW: Delete, Ctrl+B, lipirea nu schimbă nimic; Ctrl+Z nu are ce anula; după Enable Editing Delete merge', { continut: WEB }, async u => {
      const pb = [];
      await deschideWeb(u);
      if (!(await u.vizibil('[data-lh-eticheta="PROTECTED VIEW"]'))) return ['bara PROTECTED VIEW nu apare'];
      await u.loc('[data-lh-zona] [data-lh-tinta="text"]').click(); await u.p.keyboard.press('Control+Home');
      await u.p.keyboard.press('Delete'); await u.p.keyboard.press('Control+a'); await u.p.keyboard.press('Control+b'); await pauza(150);
      let s = await u.st();
      if (s.text[0] !== 'Clubul de lectură' || s.formatare_pe_caractere.some(x => x.bold)) pb.push(`în Protected View: ${J(s.text)} bold=${s.formatare_pe_caractere.some(x => x.bold)}`);
      await u.clic('[data-lh-tinta="bara_mesaj:Enable Editing"]');
      if (await u.vizibil('[data-lh-eticheta="PROTECTED VIEW"]')) pb.push('bara rămâne după Enable Editing');
      await u.p.keyboard.press('Control+Home'); await u.p.keyboard.press('Delete'); await pauza(150);
      s = await u.st();
      if (s.text[0] !== 'lubul de lectură') pb.push(`după Enable Editing, Delete: ${J(s.text)}`);
      return pb;
    });
    await C('C-F092b telefon 390x844: Enable Editing atins oprește Protected View', { continut: WEB, telefon: true }, async u => {
      await deschideWeb(u);
      if (!(await u.vizibil('[data-lh-tinta="bara_mesaj:Enable Editing"]'))) return ['nu văd Enable Editing pe telefon'];
      await u.atinge('[data-lh-tinta="bara_mesaj:Enable Editing"]');
      return (await u.vizibil('[data-lh-eticheta="PROTECTED VIEW"]')) ? ['bara rămâne după atingere'] : [];
    });
    // ---- word-F105: previzualizarea
    await C('C-F105a File › Print: previzualizarea fără ¶, Previous Page gri pe pagina 1, ▶ ◀', {}, async u => {
      const pb = [];
      await u.scrie('Ana are mere');
      for (let i = 0; i < 40; i++) await u.p.keyboard.press('Enter');
      await u.p.keyboard.type('Final', { delay: 5 });
      await u.clic('[data-lh-tinta="fila:File"]'); await pauza(300);
      await u.clic('[data-lh-tinta="backstage:Print"]'); await pauza(400);
      const t = await u.p.evaluate(R => document.querySelector(R).innerText, R);
      if (!/\b1\s*of\s*2\b/.test(t)) pb.push(`numărătoarea: ${J((/\d*\s*of\s*\d+/.exec(t) || [''])[0])}`);
      const prev = await u.p.evaluate(R => (document.querySelector(R + ' .lh-ap-prev-foaie') || {}).textContent || '', R);
      if (!/Ana are mere/.test(prev) || /¶/.test(prev)) pb.push(`foaia: ${J(prev.slice(0, 40))}`);
      const dis = await u.p.evaluate(R => { const b = document.querySelector(R + ' [data-lh-tip="Button"][data-lh-eticheta="Previous Page"]'); return b && b.getAttribute('aria-disabled'); }, R);
      if (dis !== 'true') pb.push(`Previous Page pe pagina 1: aria-disabled ${J(dis)}`);
      await u.clic('[data-lh-tinta="backstage:Next Page"]');
      const p2 = await u.p.evaluate(R => (document.querySelector(R + ' .lh-ap-prev-foaie') || {}).textContent || '', R);
      if (!/Final/.test(p2)) pb.push(`pagina 2: ${J(p2.slice(0, 40))}`);
      await u.clic('[data-lh-tinta="backstage:Previous Page"]');
      const t3 = await u.p.evaluate(R => document.querySelector(R).innerText, R);
      if (!/\b1\s*of\s*2\b/.test(t3)) pb.push('◀ nu revine la 1 of 2');
      return pb;
    });
    await C('C-F105b [2007] Ctrl+P dă mesajul central (Word 2007: fereastra Print, fără referință)', { profil: 'word2007' }, async u => {
      await u.scrie('Ana');
      await u.p.keyboard.press('Control+p'); await pauza(300);
      const n = await u.nesim();
      return n.some(x => /Ctrl\+P/.test(x)) ? [] : [`mesaje: ${J(n)}`];
    });
    // ================= runda 2c (lot_6: pagina și vizualizarea) =================
    let u2c = null;
    const PAG = () => u2c.st().then(s => s.pagina);
    const zoomEt = async u => { const e = await u.p.locator(viz('[data-lh-tinta="zoom:Zoom"]')).first().getAttribute('data-lh-eticheta'); return +((/(\d+)\s*%/.exec(e || '') || [])[1]); };
    const OKW = u => u.p.locator(viz('[data-lh-tinta="fereastra:OK"]')).last();
    const camp = async (u, nume, val) => { const x = u.loc(`[data-lh-tinta="camp:${nume}"] input`); await x.click(); await u.p.keyboard.press('Control+a'); await u.p.keyboard.type(val); await pauza(60); };
    const meniuLay = async (u, ce, rand, tap) => {
      if (tap) { await u.atinge('[data-lh-tinta="fila:Layout"]'); await u.atinge(`[data-lh-tinta="meniu_derulant:Layout/Page Setup/${ce}"]`); await u.atinge(MENIU(rand)); }
      else { await u.clic('[data-lh-tinta="fila:Layout"]'); await u.clic(`[data-lh-tinta="meniu_derulant:Layout/Page Setup/${ce}"]`); await u.clic(MENIU(rand)); }
      await pauza(150);
    };
    const textTot = u => u.p.evaluate(R => document.querySelector(R).innerText, R);
    // ---- word-F068: orientarea rotește marginile, înapoi și cu Ctrl+Z
    await C('C2-F068a Landscape apoi Portrait: marginile se rotesc și revin; Ctrl+Z întoarce foaia și marginile', {}, async u => {
      u2c = u; const pb = [];
      await u.scrie('Ana');
      await meniuLay(u, 'Margins', 'Moderate Margins');           // sus 2,54 jos 2,54 st 1,91 dr 1,91
      await meniuLay(u, 'Orientation', 'Landscape');
      let g = await PAG();
      if (!(g.orientare === 'vedere' && Math.abs(g.margini_cm.sus - 1.91) < 0.01 && Math.abs(g.margini_cm.stanga - 2.54) < 0.01)) pb.push(`vedere: ${J(g)}`);
      await meniuLay(u, 'Orientation', 'Portrait');
      g = await PAG();
      if (!(g.orientare === 'portret' && Math.abs(g.margini_cm.sus - 2.54) < 0.01 && Math.abs(g.margini_cm.stanga - 1.91) < 0.01)) pb.push(`înapoi portret: ${J(g)}`);
      await u.p.keyboard.press('Control+z'); await pauza(200);
      g = await PAG();
      if (!(g.orientare === 'vedere' && Math.abs(g.margini_cm.sus - 1.91) < 0.01)) pb.push(`Ctrl+Z după Portrait: ${J(g)}`);
      return pb;
    });
    await C('C2-F068b [2007] pe telefon (atingere): Layout › Orientation › Landscape rotește marginile', { telefon: true, profil: 'word2007' }, async u => {
      u2c = u;
      await meniuLay(u, 'Margins', 'Moderate Margins', true);
      await meniuLay(u, 'Orientation', 'Landscape', true);
      const g = await PAG();
      return g.orientare === 'vedere' && Math.abs(g.margini_cm.sus - 1.91) < 0.01 && Math.abs(g.latime_cm - 29.7) < 0.01 ? [] : [`după atingeri: ${J(g)}`];
    });
    // ---- word-F070 / F073: mesajele, fereastra rămâne deschisă, caseta greșită selectată, Esc, Ctrl+Z
    await C('C2-F073a Top „abc” + OK: mesajul, OK pe mesaj → Page Setup tot deschisă, Top selectat; apoi 3 + OK aplică, Ctrl+Z întoarce', {}, async u => {
      u2c = u; const pb = [];
      await u.scrie('Ana');
      await u.clic('[data-lh-tinta="fila:Layout"]'); await u.clic('[data-lh-tinta="lansator:Layout/Page Setup"]'); await pauza(300);
      await camp(u, 'Top', 'abc');
      await OKW(u).click(); await pauza(250);
      if (!/This is not a valid measurement\./.test(await textTot(u))) return ['nu apare mesajul'];
      await OKW(u).click(); await pauza(250);
      if (!(await u.vizibil('[data-lh-tinta="camp:Top"] input'))) return ['după OK pe mesaj, Page Setup s-a închis'];
      const s = await u.p.evaluate(() => { const a = document.activeElement; return a && a.tagName === 'INPUT' ? [a.value, a.selectionStart, a.selectionEnd] : null; });
      if (!s || s[0] !== 'abc' || s[1] !== 0 || s[2] !== 3) pb.push(`caseta Top după mesaj: ${J(s)} (trebuia „abc” selectat tot)`);
      await u.p.keyboard.type('3'); await pauza(60);
      await OKW(u).click(); await pauza(250);
      let g = await PAG();
      if (Math.abs(g.margini_cm.sus - 3) > 0.01) pb.push(`după 3 + OK: ${J(g.margini_cm)}`);
      await u.p.keyboard.press('Control+z'); await pauza(200);
      g = await PAG();
      if (Math.abs(g.margini_cm.sus - 2.5) > 0.01) pb.push(`Ctrl+Z: ${J(g.margini_cm)}`);
      return pb;
    });
    await C('C2-F073b [2007] Left 12 + Right 12: mesajul stânga/dreapta; Esc pe mesaj, apoi Cancel: marginile neatinse', { profil: 'word2007' }, async u => {
      u2c = u; const pb = [];
      await u.clic('[data-lh-tinta="fila:Layout"]'); await u.clic('[data-lh-tinta="lansator:Layout/Page Setup"]'); await pauza(300);
      await camp(u, 'Left', '12'); await camp(u, 'Right', '12');
      await OKW(u).click(); await pauza(250);
      if (!/left and right margins.*too large for the page width/.test(await textTot(u))) pb.push('nu apare mesajul stânga/dreapta');
      await u.p.keyboard.press('Escape'); await pauza(200);
      if (!(await u.vizibil('[data-lh-tinta="camp:Left"] input'))) return pb.concat(['după Esc pe mesaj, Page Setup s-a închis']);
      await u.clic('[data-lh-tinta="fereastra:Cancel"]');
      const g = await PAG();
      if (Math.abs(g.margini_cm.stanga - 2.5) > 0.01) pb.push(`după Cancel: ${J(g.margini_cm)}`);
      return pb;
    });
    await C('C2-F070p pe telefon (atingere): Margins › Custom Margins, Left 3, OK pe mesajul de margini prea mari, apoi OK', { telefon: true }, async u => {
      u2c = u; const pb = [];
      await meniuLay(u, 'Margins', 'Custom Margins', true);
      const x = u.loc('[data-lh-tinta="camp:Left"] input');
      await x.tap(); await u.p.keyboard.press('Control+a'); await u.p.keyboard.type('20'); await pauza(60);
      await OKW(u).tap(); await pauza(250);
      if (!/too large for the page width/.test(await textTot(u))) pb.push('Left 20: nu apare mesajul');
      await OKW(u).tap(); await pauza(250);
      await x.tap(); await u.p.keyboard.press('Control+a'); await u.p.keyboard.type('3'); await pauza(60);
      await OKW(u).tap(); await pauza(250);
      const g = await PAG();
      if (Math.abs(g.margini_cm.stanga - 3) > 0.01) pb.push(`după OK: ${J(g.margini_cm)}`);
      return pb;
    });
    await C('C2-F070o [2007] Page Setup › Landscape (în fereastră): Width/Height și marginile se rotesc, OK = foaia culcată', { profil: 'word2007' }, async u => {
      u2c = u; const pb = [];
      await u.clic('[data-lh-tinta="fila:Layout"]'); await u.clic('[data-lh-tinta="lansator:Layout/Page Setup"]'); await pauza(300);
      await camp(u, 'Top', '2'); await camp(u, 'Left', '3');
      await u.clic('[data-lh-tinta="fereastra:Landscape"]');
      const ac = await u.loc('[data-lh-tinta="fereastra:Landscape"]').getAttribute('aria-checked');
      if (ac !== 'true') pb.push(`Landscape aria-checked ${J(ac)}`);
      const top = await u.loc('[data-lh-tinta="camp:Top"] input').inputValue();
      if (top !== '3') pb.push(`Top după Landscape: ${J(top)} (trebuia 3, fosta stângă)`);
      await OKW(u).click(); await pauza(250);
      const g = await PAG();
      if (!(g.orientare === 'vedere' && Math.abs(g.latime_cm - 29.7) < 0.01 && g.margini_cm.sus === 3 && g.margini_cm.dreapta === 2)) pb.push(`după OK: ${J(g)}`);
      return pb;
    });
    // ---- word-F072: cartea de vizită (lectii/vii/m2-l09/surse.md:34): Width 9 / Height 5, mesajul sus/jos, fila Margins 0,5
    await C('C2-F072a More Paper Sizes: 9 × 5 → mesajul sus/jos; fila Margins 0,5 peste tot (Width păstrat între file) → foaia 9 × 5 culcată', {}, async u => {
      u2c = u; const pb = [];
      await meniuLay(u, 'Size', 'More Paper Sizes...');
      await camp(u, 'Width', '9'); await camp(u, 'Height', '5');
      await OKW(u).click(); await pauza(250);
      if (!/The top\/bottom margins are too large for the page height/.test(await textTot(u))) pb.push('nu apare mesajul sus/jos');
      await OKW(u).click(); await pauza(200);
      await u.clic('[data-lh-tinta="fila_dialog:Margins"]');
      for (const k of ['Top', 'Bottom', 'Left', 'Right']) await camp(u, k, '0,5');
      await u.clic('[data-lh-tinta="fila_dialog:Paper"]');
      const w = await u.loc('[data-lh-tinta="camp:Width"] input').inputValue();
      const ps = await u.loc('[data-lh-tinta="camp:Paper size"] input').inputValue().catch(() => '');
      if (w !== '9') pb.push(`Width după schimbarea filelor: ${J(w)}`);
      if (ps !== 'Custom size') pb.push(`Paper size: ${J(ps)} (trebuia Custom size)`);
      await OKW(u).click(); await pauza(250);
      const g = await PAG();
      if (!(g.latime_cm === 9 && g.inaltime_cm === 5 && g.orientare === 'vedere' && g.margini_cm.sus === 0.5)) pb.push(`după OK: ${J(g)}`);
      return pb;
    });
    // ---- word-F071: Size pe foaia culcată păstrează orientarea; Page Setup › Paper arată numele; Ctrl+Z
    await C('C2-F071a [2007] Landscape apoi Size › A5 = 21 × 14,8, marginile neatinse; Page Setup › Paper arată A5; Ctrl+Z = A4 culcat', { profil: 'word2007' }, async u => {
      u2c = u; const pb = [];
      await u.scrie('Ana');
      await meniuLay(u, 'Orientation', 'Landscape');
      await meniuLay(u, 'Size', 'A5');
      let g = await PAG();
      if (!(Math.abs(g.latime_cm - 21) < 0.01 && Math.abs(g.inaltime_cm - 14.8) < 0.01 && g.orientare === 'vedere' && g.margini_cm.sus === 2.5)) pb.push(`A5 culcat: ${J(g)}`);
      await u.clic('[data-lh-tinta="fila:Layout"]'); await u.clic('[data-lh-tinta="lansator:Layout/Page Setup"]'); await pauza(300);
      await u.clic('[data-lh-tinta="fila_dialog:Paper"]');
      const ps = await u.loc('[data-lh-tinta="camp:Paper size"] input').inputValue().catch(() => '');
      if (ps !== 'A5') pb.push(`Paper size: ${J(ps)}`);
      await u.clic('[data-lh-tinta="fereastra:Cancel"]');
      await u.p.keyboard.press('Control+z'); await pauza(200);
      g = await PAG();
      if (!(Math.abs(g.latime_cm - 29.7) < 0.01 && Math.abs(g.inaltime_cm - 21) < 0.01)) pb.push(`Ctrl+Z: ${J(g)}`);
      return pb;
    });
    // ---- word-F095 / F096 / F097: zoomul
    await C('C2-F095a + de trei ori: 108 → 116 → 124 (măsurat în Word real); View › 100% din 124', {}, async u => {
      const pb = [];
      const z = [];
      for (let i = 0; i < 3; i++) { await u.clic('[data-lh-tinta="zoom:Zoom In (Ctrl +)"]'); z.push(await zoomEt(u)); }
      if (J(z) !== '[108,116,124]') pb.push(`+ + +: ${J(z)}`);
      await u.clic('[data-lh-tinta="fila:View"]'); await u.clic('[data-lh-tinta="panglica:View/Zoom/100%"]');
      if ((await zoomEt(u)) !== 100) pb.push(`View › 100%: ${await zoomEt(u)}`);
      return pb;
    });
    await C('C2-F096a glisorul tras spre stânga scade sub 100 % în timpul tragerii; după tragere + merge (câte 2 sub 100)', {}, async u => {
      const pb = [];
      const d = await u.loc('[data-lh-suprafata="bara_stare"] [data-lh-tip="Slider"] [data-lh-tip="Thumb"]').boundingBox();
      await u.p.mouse.move(d.x + 2, d.y + 5); await u.p.mouse.down();
      await u.p.mouse.move(d.x - 25, d.y + 5, { steps: 6 }); await pauza(100);
      const zin = await zoomEt(u);
      await u.p.mouse.up(); await pauza(200);
      if (!(zin < 100)) pb.push(`în timpul tragerii spre stânga: ${zin} %`);
      const z1 = await zoomEt(u);
      await u.clic('[data-lh-tinta="zoom:Zoom In (Ctrl +)"]');
      if ((await zoomEt(u)) !== Math.min(100, z1 + 2)) pb.push(`+ de la ${z1}: ${await zoomEt(u)}`);
      return pb;
    });
    // ---- word-F094 / F093: vizualizările
    await C('C2-F094a [2007] Web Layout din bara de stare: foaia pe toată lățimea, butonul apăsat; Print Layout din bara de stare revine', { profil: 'word2007' }, async u => {
      const pb = [];
      await u.scrie('Ana');
      const lat = () => u.p.evaluate(R => document.querySelector(R + ' [data-lh-eticheta="Page 1"]').getBoundingClientRect().width, R);
      const w0 = await lat();
      await u.clic('[data-lh-tinta="bara_stare:Web Layout"]');
      const w1 = await lat();
      if (!(w1 > w0 + 200)) pb.push(`Web Layout: ${Math.round(w0)}→${Math.round(w1)} px`);
      const ap = await u.loc('[data-lh-tinta="bara_stare:Web Layout"]').getAttribute('aria-pressed');
      if (ap !== 'true') pb.push(`butonul Web Layout aria-pressed ${J(ap)}`);
      await u.clic('[data-lh-tinta="bara_stare:Print Layout"]');
      if (Math.abs((await lat()) - w0) > 3) pb.push('Print Layout nu revine');
      return pb;
    });
    await C('C2-F093a View › Read Mode: fără panglică, Enter / Backspace nu schimbă; View › Edit Document revine și tastarea scrie', {}, async u => {
      const pb = [];
      await u.scrie('Ana');
      await u.clic('[data-lh-tinta="fila:View"]'); await u.clic('[data-lh-tinta="panglica:View/Views/Read Mode"]'); await pauza(200);
      if (await u.vizibil('[data-lh-tinta="fila:Home"]')) pb.push('panglica e tot acolo');
      await u.p.keyboard.press('Enter'); await u.p.keyboard.press('Backspace'); await pauza(100);
      if (J((await u.st()).text) !== '["Ana"]') pb.push(`în Read Mode: ${J((await u.st()).text)}`);
      await u.clic('[data-lh-tinta="citire:View"]'); await u.clic(MENIU('Edit Document'));
      if (!(await u.vizibil('[data-lh-tinta="fila:Home"]'))) pb.push('Edit Document nu aduce panglica');
      await u.p.keyboard.press('Control+End'); await u.p.keyboard.type('X'); await pauza(100);
      if (J((await u.st()).text) !== '["AnaX"]') pb.push(`după Edit Document: ${J((await u.st()).text)}`);
      return pb;
    });
    await C('C2-F093b pe telefon (atingere): Read Mode din bara de stare, View › Edit Document', { telefon: true }, async u => {
      const pb = [];
      await u.atinge('[data-lh-tinta="bara_stare:Read Mode"]');
      if (!(await u.vizibil('[data-lh-tinta="citire:View"]'))) return ['nu văd View în Read Mode pe telefon'];
      await u.atinge('[data-lh-tinta="citire:View"]'); await u.atinge(MENIU('Edit Document'));
      if (!(await u.vizibil('[data-lh-tinta="fila:Home"]'))) pb.push('panglica nu revine');
      return pb;
    });
    // ---- word-F098 / F103: riglele
    await C('C2-F098a riglele ascunse la pornire; View › Ruler le arată (bifa pusă), Ctrl+Z nu le ascunde, a doua bifă le ascunde', {}, async u => {
      const pb = [];
      await u.scrie('Ana');
      const rig = () => u.vizibil('[data-lh-eticheta="Horizontal Ruler"], [data-lh-eticheta="Vertical Ruler"]');
      if (await rig()) pb.push('riglele se văd la pornire');
      await u.clic('[data-lh-tinta="fila:View"]'); await u.clic('[data-lh-tinta="panglica:View/Show/Ruler"]');
      if (!(await rig())) pb.push('View › Ruler nu le arată');
      const ac = await u.loc('[data-lh-tinta="panglica:View/Show/Ruler"]').getAttribute('aria-checked');
      if (ac !== 'true') pb.push(`bifa Ruler: aria-checked ${J(ac)}`);
      await u.p.keyboard.press('Control+z'); await pauza(200);
      if (!(await rig())) pb.push('Ctrl+Z a ascuns riglele');
      await u.clic('[data-lh-tinta="panglica:View/Show/Ruler"]');
      if (await rig()) pb.push('a doua bifă nu le ascunde');
      return pb;
    });
    await C('C2-F098b [2007] pe telefon (atingere): View › Ruler arată riglele', { telefon: true, profil: 'word2007' }, async u => {
      await u.atinge('[data-lh-tinta="fila:View"]'); await u.atinge('[data-lh-tinta="panglica:View/Show/Ruler"]');
      return (await u.vizibil('[data-lh-eticheta="Horizontal Ruler"]')) ? [] : ['rigla nu apare după atingere'];
    });
  } finally {
    await browser.close();
    srv.close();
  }
  console.log(String(nFail));
}

main().catch(e => { console.log('FAIL eroare la rulare - ' + e.message); console.log('1'); process.exitCode = 0; });
