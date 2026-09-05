# -*- coding: utf-8 -*-
"""Oracol independent pe cele doua decizii aplicate."""
import io, os, re, sys, json, html as _html, subprocess
R = r"C:\00\Projects\LearningHub"
T = []
def t(n, v): T.append((n, bool(v)))
def raw(rel): return io.open(os.path.join(R, rel.replace("/", os.sep)), encoding="utf-8", errors="replace").read()
def vz(s): return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", s))

# --- D1: lectia 4 de clasa a V-a ---
f1 = "content/tic/cls5/extra-siguranta-backup/lectia4-prezentari-intro.html"
s1 = raw(f1); v1 = vz(s1)
t("D1: preda acum prezentari (apar slide/prezentare)", v1.lower().count("slide") >= 5 and "prezentare" in v1.lower())
t("D1: zero urme de cyberbullying", v1.lower().count("cyberbullying") == 0)
h1 = re.search(r"<h1[^>]*>(.*?)</h1>", s1, re.S)
t("D1: titlul e 'Prima mea prezentare'", h1 and "prima mea prezentare" in vz(h1.group(1)).lower())
t("D1: cheia de progres numeste subiectul nou", "lectia4-prezentari-intro" in s1 and "lectia4-cyberbullying" not in s1)
t("D1: cartonasul din index se potriveste acum cu lectia",
  "Prima mea prezentare" in raw("content/tic/cls5/extra-siguranta-backup/index.html"))

# --- D2: duplicatul sters ---
t("D2: duplicatul orfan nu mai exista pe disc",
  not os.path.exists(os.path.join(R, "content", "tic", "cls5", "extra-word-cls7", "lectia6-proiect.html")))
t("D2: lectia care RAMANE e intacta",
  os.path.exists(os.path.join(R, "content", "tic", "cls5", "extra-word-cls7", "lectia7-proiect.html")))

# --- D3: tutorialul ---
f3 = "content/tic/cls8/extra-materiale-suplimentare/tutorial-github-netlify.html"
s3 = raw(f3)
dq = re.findall(r'data-quiz\s*=\s*(["\'])(.*?)\1', s3, re.S)
t("D3: tutorialul are acum chestionare", len(dq) >= 5)
ok = 0
for _, a in dq:
    try:
        d = json.loads(_html.unescape(a))
        q = d[0]
        if isinstance(d, list) and q["options"][ord(q["correct"]) - 97]:
            ok += 1
    except Exception:
        pass
t("D3: toate chestionarele se parseaza si cheia arata spre o varianta reala", ok == len(dq))
chei = []
for _, a in dq:
    try: chei.append(json.loads(_html.unescape(a))[0]["correct"])
    except Exception: pass
t("D3: cheile nu cad toate pe aceeasi litera", len(set(chei)) > 1)

# --- poarta pe toate trei ---
G = os.path.join(R, "tools", "verifica_lectie.py")
pica = []
for rel in [f1, f3, "content/tic/cls5/extra-siguranta-backup/lectia3-date-personale.html",
            "content/tic/cls5/extra-siguranta-backup/lectia5-prezentari-design.html",
            "content/tic/cls5/extra-word-cls7/lectia7-proiect.html"]:
    r = subprocess.run([sys.executable, G, os.path.join(R, rel.replace("/", os.sep))],
                       capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode != 0:
        pica.append((rel, [l.strip() for l in r.stdout.splitlines() if l.strip().startswith("-")][:2]))
t("poarta trece pe lectiile atinse SI pe vecinele lor", not pica)
if pica:
    for rel, m in pica: print("   PICA", rel, m)

for n, v in T: print(("  PASS  " if v else "  FAIL  ") + n)
b = sum(v for _, v in T)
print("VERDICT: %s %d/%d" % ("PASS" if b == len(T) else "FAIL", b, len(T)))
