import runpy, io, contextlib
names = ["Maria", "Andrei", "Elena", "Bogdan", "Carla", "Dan"]
notes = [8, 6, 9, 5, 7, 10]
orig = dict(zip(names, notes))
for rev, lab in ((False, "crescator"), (True, "descrescator")):
    b = sorted(notes, reverse=rev)
    got = dict(zip(names, b))
    wrong = [n for n in names if got[n] != orig[n]]
    print(lab, got, "gresiti:", len(wrong), "| Maria tot 8?", got["Maria"] == 8, "| Elena tot 9?", got["Elena"] == 9,
          "| controlul prinde:", got["Maria"] != 8 or got["Elena"] != 9, "| sum", sum(b))
# tag balance + quizzes on the new file
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    runpy.run_path(r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls8\lectia7-sortare\verif\v1.py")
print("\n".join(l for l in buf.getvalue().splitlines() if "tag errors" in l or "ratio" in l))
