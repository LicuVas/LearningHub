import fs from 'node:fs'; import vm from 'node:vm'; import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const C = require('C:/00/Projects/LearningHub/cum-fac/cautare.js');
const ctx = { window: {} }; vm.runInNewContext(fs.readFileSync('C:/00/Projects/LearningHub/cum-fac/date.js', 'utf8'), ctx);
const D = ctx.window.CUM_FAC_DATE;
for (const id of process.argv.slice(2)) {
  const f = D.fise.find(x => x.id === id);
  console.log(id, '→', C.termeniFisa(f, D.termeni).map(x => `${x.t} [${x.din}]`).join(' · '));
}
