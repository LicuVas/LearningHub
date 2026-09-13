import re
s = open(r"C:\00\Projects\LearningHub\content\tic\cls5\m1-sisteme\lectia6-proiect.html", encoding="utf-8").read()
def plain(x): return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", x))
a1 = s.index('id="atom-1"'); a2 = s.index('id="atom-2"'); a3 = s.index('id="atom-3"'); a4 = s.index('id="atom-4"')
end4 = s.index('practice-description')
print("ATOM1:", plain(s[s.index("'>", a1) + 2:a2])[:2500])
print()
print("ATOM2:", plain(s[s.index("'>", a2) + 2:a3])[:1800])
print()
print("ATOM4:", plain(s[s.index("'>", a4) + 2:end4])[:2500])
for p in [16831, 11090, 24848, 31564]:
    print()
    print("CTX", p, plain(s[p - 500:p + 250]))
