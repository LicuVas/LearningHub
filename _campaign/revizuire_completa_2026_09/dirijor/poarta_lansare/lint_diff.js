// Analiza statică a celor 3 fișiere JS (HEAD vs acum): nume nedeclarate (eslint no-undef) și comentarii // NOI
// care conțin ceva ce seamănă a cod (un comentariu care a înghițit cod). Ieșirea: doar ce e NOU față de HEAD.
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const NM = 'C:/00/AI_0/CronicileCodului/node_modules/';
const { Linter } = require(NM + 'eslint');
const acorn = require(NM + 'acorn');
let globals = {};
try { const g = require(NM + 'globals'); globals = Object.assign({}, g.browser, g.es2021 || g.es2020 || {}); } catch (e) { console.log('fără pachetul globals'); }
const LH = 'C:/00/Projects/LearningHub';
const FIS = ['jocuri/_motor/motor.js', 'jocuri/_motor/tip-excel.js', 'assets/js/prezenta.js'];
const linter = new Linter();
const ver = require(NM + 'eslint/package.json').version;
function undef(code) {
  const cfg = parseInt(ver) >= 9
    ? [{ languageOptions: { ecmaVersion: 2022, sourceType: 'script', globals: Object.assign({}, globals, { qrcode: 'readonly' }) }, rules: { 'no-undef': 'error' } }]
    : { parserOptions: { ecmaVersion: 2022 }, env: { browser: true, es2021: true }, rules: { 'no-undef': 'error' } };
  return linter.verify(code, cfg).map(m => m.message);
}
function comentarii(code) {
  const c = [];
  acorn.parse(code, { ecmaVersion: 2022, onComment: (block, text) => { if (!block) c.push(text.trim()); } });
  return c;
}
const COD = /(\bconst |\blet |\bvar |\bfunction\b|\breturn\b|=>|\)\s*\{|\}\s*\)|;\s*\w+\s*[=(.]|\bif\s*\()/;
let n = 0;
for (const f of FIS) {
  const acum = fs.readFileSync(path.join(LH, f), 'utf8');
  const head = execFileSync('git', ['-C', LH, 'show', 'HEAD:' + f]).toString('utf8');
  const uA = undef(acum), uH = new Set(undef(head));
  const noiU = [...new Set(uA)].filter(m => !uH.has(m));
  const cH = new Set(comentarii(head));
  const noiC = comentarii(acum).filter(t => !cH.has(t));
  const susp = noiC.filter(t => COD.test(t));
  console.log(`== ${f}: no-undef acum ${uA.length} (HEAD ${uH.size}); NOI: ${JSON.stringify(noiU)}; comentarii // noi: ${noiC.length}, suspecte: ${susp.length}`);
  susp.forEach(t => console.log('   SUSPECT: ' + t.slice(0, 220)));
  if (process.env.TOATE) noiC.forEach(t => console.log('   // ' + t.slice(0, 160)));
  n += noiU.length;
}
console.log('eslint ' + ver);
console.log(n);
