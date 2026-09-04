# -*- coding: utf-8 -*-
"""Cate lectii impart aceeasi cheie de progres si daca au acelasi continut.

Cheia arata asa: 'cls10-m1-procesare-text-lectia3-corespondenta-aplicatie' - NU
contine profilul (pedagogic / militar / stiinte / tehnologic). Deci patru lectii
DIFERITE, din patru profiluri, scriu in acelasi loc din memoria browserului.
"""
import os, io, re, collections, hashlib

R = r"C:\00\Projects\LearningHub"
chei = collections.defaultdict(list)
for dp, _, fns in os.walk(os.path.join(R, "content")):
    if ".backup" in dp.lower() or "_atasamente" in dp.lower():
        continue
    for f in fns:
        if not f.endswith(".html"):
            continue
        p = os.path.join(dp, f)
        s = io.open(p, encoding="utf-8", errors="replace").read()
        for k in set(re.findall(r"AtomicLearning\.init\(\s*'([^']+)'", s)):
            h1 = re.search(r"<h1[^>]*>(.*?)</h1>", s, re.S | re.I)
            titlu = re.sub(r"\s+", " ", re.sub("<[^>]+>", "", h1.group(1))).strip() if h1 else ""
            atomi = re.findall(r'<h3 class="atom-title"[^>]*>(.*?)</h3>', s, re.S | re.I)
            amp = hashlib.sha1(("|".join(atomi)).encode("utf-8", "replace")).hexdigest()[:8]
            chei[k].append((os.path.relpath(p, R).replace(os.sep, "/"), titlu, amp))

ciocniri = {k: v for k, v in chei.items() if len(v) > 1}
print("chei de progres distincte : %d" % len(chei))
print("chei folosite de >1 lectie: %d" % len(ciocniri))
print("lectii implicate          : %d" % sum(len(v) for v in ciocniri.values()))
print("")

acelasi = dif = 0
for k, v in ciocniri.items():
    if len({x[2] for x in v}) == 1:
        acelasi += 1
    else:
        dif += 1
print("dintre ele:")
print("  %d chei unde lectiile au ACELASI continut (duplicate reale, ciocnirea e inofensiva)" % acelasi)
print("  %d chei unde lectiile au CONTINUT DIFERIT (progresul unei lectii marcheaza alta ca facuta)" % dif)
print("")
print("primele 8 cu continut diferit:")
n = 0
for k, v in ciocniri.items():
    if len({x[2] for x in v}) == 1:
        continue
    n += 1
    if n > 8:
        break
    print("  cheia %s" % k)
    for cale, titlu, amp in v:
        print("      %-62s %s" % (cale[-62:], titlu[:46]))
