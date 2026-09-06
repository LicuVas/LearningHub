# -*- coding: utf-8 -*-
"""Oracol independent pe cele 29 de lectii noi de clasa a IX-a."""
import io, os, re, sys, json, html as _html, subprocess, collections
sys.path.insert(0, r"C:\00\Projects\LearningHub\_campaign\cls9_artistic")
from plan import toate_lectiile

R = r"C:\00\Projects\LearningHub"
G = os.path.join(R, "tools", "verifica_lectie.py")
L = list(toate_lectiile())
T = []
def t(n, v): T.append((n, bool(v)))

lipsa, schela, fara_atomi, fara_quiz, poarta_pica = [], [], [], [], []
sablon = []
chei_tot = collections.Counter()
per_lectie = {}
atomi_tot = intreb_tot = 0

for x in L:
    p = os.path.join(R, x["cale"].replace("/", os.sep))
    if not os.path.exists(p):
        lipsa.append(x["fisier"]); continue
    s = io.open(p, encoding="utf-8", errors="replace").read()
    if "SCHELA:" in s:
        schela.append(x["fisier"])
    # resturi din lectia-sablon, in lectii care NU sunt despre sisteme de calcul
    if x["modul"] != "m3-sisteme-de-calcul":
        txt = re.sub(r"<[^>]+>", " ", s).lower()
        if txt.count("hardware") >= 3 and txt.count("software") >= 3 and "sistem de operare" in txt:
            sablon.append(x["fisier"])
    na = len([c for c in re.findall(r'<div\b[^>]*\bclass="([^"]*)"', s) if "atom" in c.split()])
    atomi_tot += na
    if na == 0: fara_atomi.append(x["fisier"])
    chei = []
    for m in re.finditer(r'data-quiz\s*=\s*(["\'])(.*?)\1', s, re.S):
        try:
            d = json.loads(_html.unescape(m.group(2)))
        except Exception:
            continue
        if not isinstance(d, list): continue
        for q in d:
            c = (q.get("correct") or "").strip().lower()
            opt = q.get("options") or []
            if len(c) == 1 and "a" <= c <= "z" and ord(c) - 97 < len(opt):
                chei.append(c); intreb_tot += 1
    if not chei: fara_quiz.append(x["fisier"])
    chei_tot.update(chei)
    per_lectie[x["fisier"]] = chei
    r = subprocess.run([sys.executable, G, p], capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode != 0:
        poarta_pica.append((x["fisier"], [l.strip() for l in r.stdout.splitlines() if l.strip().startswith("-")][:2]))

t("toate cele 29 de fisiere exista", not lipsa)
t("niciun fisier nu mai are marcajul SCHELA", not schela)
t("nicio lectie din M1/M2 n-a ramas cu continutul sablonului", not sablon)
t("fiecare lectie are atomi", not fara_atomi)
t("fiecare lectie are chestionare", not fara_quiz)
t("toate trec poarta", not poarta_pica)

# distributia literelor: nicio litera sub 10% inseamna ca nu se poate elimina din start
tot = sum(chei_tot.values())
proc = {k: 100.0 * v / max(1, tot) for k, v in chei_tot.items()}
t("nicio litera nu domina peste 45%%", all(v <= 45 for v in proc.values()))
t("fiecare din a,b,c,d apare macar o data", all(chei_tot.get(k, 0) > 0 for k in "abcd"))

# lectii in care o litera nu apare DELOC (exploatabil: elevul o elimina din start)
nul = [(f, [k for k in "abcd" if k not in set(c)]) for f, c in per_lectie.items() if len(c) >= 6]
nul = [(f, k) for f, k in nul if k]
t("nicio lectie cu >=6 intrebari in care o litera lipseste complet", not nul)

print("atomi: %d | intrebari: %d" % (atomi_tot, intreb_tot))
print("distributia cheilor: " + ", ".join("%s=%d (%.1f%%)" % (k, chei_tot[k], proc[k]) for k in sorted(chei_tot)))
for n, v in T: print(("  PASS  " if v else "  FAIL  ") + n)
if lipsa: print("   lipsa:", lipsa)
if schela: print("   inca SCHELA:", schela)
if sablon: print("   resturi de sablon:", sablon)
if poarta_pica:
    for f, m in poarta_pica[:6]: print("   pica:", f, m)
if nul:
    print("   lectii in care o litera nu apare deloc:")
    for f, k in nul: print("      %-40s lipseste: %s" % (f, ",".join(k)))
b = sum(v for _, v in T)
print("VERDICT: %s %d/%d" % ("PASS" if b == len(T) else "FAIL", b, len(T)))
