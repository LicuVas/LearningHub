// Caută în toate seturile din cum-fac/_teste întrebările cu cuvinte de sunet / video / redare (cine poate fi „furat”
// de aplicația nouă audio). Rulare: node cauta_seturi.mjs
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const C = createRequire(import.meta.url)('C:/00/Projects/LearningHub/cum-fac/cautare.js');
const T = 'C:/00/Projects/LearningHub/cum-fac/_teste';
const re = /\b(audio|video\w*|sunet\w*|muzic\w*|melodi\w*|cantec\w*|film\w*|clip\w*|play|pauz\w*|pause|stop|redare|reda\w*|timeline|timp|unda|und\w*|pist\w*|lup\w*|zoom|inregistr\w*|audacity|clipchamp|ascult\w*|opr\w*|porn\w*|difuz\w*|boxe|volum\w*|media|secund\w*|derul\w*|cap\w*)\b/;
for (const n of fs.readdirSync(T).filter(n => n.endsWith('.json')).sort()) {
  let s; try { s = JSON.parse(fs.readFileSync(path.join(T, n), 'utf8')); } catch { continue; }
  if (!Array.isArray(s)) continue;
  const h = s.filter(x => x && x.q && re.test(C.normalizeaza(x.q)));
  if (h.length) console.log(`== ${n} (${s.length})\n` + h.map(x => `  ${x.q} -> ${(x.accept || []).join('|') || 'n-am găsit'}`).join('\n'));
}
