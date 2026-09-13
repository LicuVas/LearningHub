from docx import Document
from docx.oxml.ns import qn
import copy
# text din exemplul situatiei practice (2 randuri) si provocarea (5 randuri, 3 valori)
email = "Popescu Ion, 8, 9, 7\nIonescu Ana, 10, 9, 10"
rows = [r.split(",") for r in email.split("\n")]
print("email: randuri", len(rows), "coloane", {len(r) for r in rows}, "primul rand =", rows[0])
prov = ["Ana Iepure, 9, 2", "Dan Munte, 8, 0", "Ilie Nor, 7, 4", "Oana Rau, 10, 1", "Vlad Lac, 6, 3"]
print("provocare: virgule/rand", {r.count(",") for r in prov}, "coloane", {len(r.split(",")) for r in prov})
d = Document()
t = d.add_table(rows=5, cols=3)
for i, r in enumerate(prov):
    for j, v in enumerate(r.split(",")):
        t.cell(i, j).text = v.strip()
# Insert Above: rand gol nou inainte de randul 0
new_tr = copy.deepcopy(t.rows[0]._tr)
for el in new_tr.iter(qn("w:t")):
    el.text = ""
t.rows[0]._tr.addprevious(new_tr)
c = t.cell(0, 0).merge(t.cell(0, 2)); c.text = "Situatia clasei"
names = [r.cells[0].text for r in t.rows[1:]]
print("randuri", len(t.rows), "rand1", repr(t.rows[0].cells[0].text), "elevi", names, "gridSpan rand1", len(t.rows[0]._tr.findall(qn("w:tc"))))
# gresit: 3 virgule
bad = "Ana Iepure, 9, 2, "
print("rand cu virgula in plus ->", len(bad.split(",")), "celule")
