"""Mutanții probei proba_corectura.py (02.10.2026): fiecare strică O regulă din prezenta.js / progres.mjs; proba TREBUIE
să-l prindă (ultima ei linie > 0). Ultima linie aici = câți au scăpat (0 = toți prinși)."""
import os
import subprocess
import sys
import tempfile

for s in (sys.stdout, sys.stderr):
    try:
        s.reconfigure(encoding="utf-8")
    except Exception:
        pass

AICI = os.path.dirname(os.path.abspath(__file__))
PREZENTA = os.path.join(AICI, "..", "..", "assets", "js", "prezenta.js")
PROGRES = r"C:\00\AI_0\projects\teste-elevi\site\netlify\functions\progres.mjs"
M = [
    ("școala nerecunoscută", "p", "return g.length === 1 ? g[0] : null;\n  }\n  function clasaRecunoscuta", "return null;\n  }\n  function clasaRecunoscuta"),
    ("recunoaște orice", "p", "return g.length === 1 ? g[0] : null;\n  }\n  function clasaRecunoscuta",
     "return (DATE.scoli || [])[2];\n  }\n  function clasaRecunoscuta"),
    ("fără „insistă”", "p", "if (rec && insista !== as + '|' + al) {", "if (rec) {"),
    ("evenimentul de clic = corectură", "p", "cor = cor && typeof cor.cod === 'string' ? cor : null;", ""),
    ("corectura fără cod", "p", "      if (h !== eu.h) {\n        var ramase = gresit();", "      if (false) {\n        var ramase = gresit();"),
    ("id nou la corectură", "p", "nou.id = eu.id; nou.h = hNou;", "nou.h = hNou;"),
    ("progresul nu se mută pe server", "p", "op: 'redenumeste', h: eu.h", "op: 'stare', h: eu.h"),
    ("numele unui coleg luat", "p", "if (pc && pc.h !== hNou) {", "if (false) {"),
    ("server: vechea amprentă rămâne bună", "s", "await set(K.progres(h), { ...(src || { date: {}, prima: acum }), mutatIn: la, mutat: acum, corectat: true });", ""),
    ("server: fără „corectat”", "s", "...(p.corectat ? { corectat: true } : {})", ""),
    ("server: reînvie codul scos de profesor", "s", "if (dest0 && dest0.mutatIn && !dest0.corectat)", "if (false)"),
]
pz, pr = open(PREZENTA, encoding="utf-8").read(), open(PROGRES, encoding="utf-8").read()
scapati = 0
for nume, unde, din, cu in M:
    sursa = pz if unde == "p" else pr
    if din not in sursa:
        print("MUTANT INVALID:", nume)
        scapati += 1
        continue
    tmp = tempfile.mkdtemp(prefix="mut_corect_")
    f = os.path.join(tmp, "prezenta.js" if unde == "p" else "progres.mjs")
    open(f, "w", encoding="utf-8").write(sursa.replace(din, cu, 1))
    env = dict(os.environ, **({"PROBA_PREZENTA": f} if unde == "p" else {"PROBA_PROGRES": f}))
    r = subprocess.run([sys.executable, os.path.join(AICI, "proba_corectura.py")], env=env, capture_output=True, text=True, encoding="utf-8")
    linii = (r.stdout or "").strip().splitlines()
    n = int(linii[-1]) if linii and linii[-1].strip().isdigit() else -1
    rele = [x.strip() for x in linii if "RĂU" in x][:2]
    print(">>> mutant „%s”: %s (%s probleme) %s" % (nume, "PRINS" if n != 0 else "SCĂPAT", n, rele))
    scapati += 0 if n != 0 else 1
print("Mutanți prinși: %d / %d" % (len(M) - scapati, len(M)))
print(scapati)
