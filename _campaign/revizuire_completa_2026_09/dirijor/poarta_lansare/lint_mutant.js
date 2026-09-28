// Control pentru lint_diff.js: comentariul care înghite `const b=` (defectul cunoscut din load()) TREBUIE prins de no-undef.
const NM = 'C:/00/AI_0/CronicileCodului/node_modules/';
const { Linter } = require(NM + 'eslint');
const g = require(NM + 'globals');
const fs = require('fs');
const c = fs.readFileSync('C:/00/Projects/LearningHub/jocuri/_motor/motor.js', 'utf8');
const m = c.replace('doar citește\n    const b=citesteJoc', 'doar citeșteconst b=citesteJoc').replace('doar citește\r\n    const b=citesteJoc', 'doar citeșteconst b=citesteJoc');
console.log('mutant diferit de original:', m !== c);
const L = new Linter();
const cfg = [{ languageOptions: { ecmaVersion: 2022, sourceType: 'script', globals: Object.assign({}, g.browser) }, rules: { 'no-undef': 'error' } }];
console.log('original:', L.verify(c, cfg).map(x => x.line + ': ' + x.message));
console.log('mutant:', L.verify(m, cfg).map(x => x.line + ': ' + x.message));
