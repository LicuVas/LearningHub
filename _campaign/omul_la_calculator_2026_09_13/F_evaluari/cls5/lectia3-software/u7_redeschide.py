"""U7 - redeschid artefactele intr-un proces Python NOU si citesc valori din ele (nu din memoria scriptului care le-a facut).
Iesire: 07_redeschis.json."""
import json
from pathlib import Path

L = Path(__file__).resolve().parent
out = {}
t = L / "u1_nisip" / "ordinea_inversata_sterg_intai" / "Documente" / "Teme_cls5"
out["structura_redeschisa_ramura_corecta"] = sorted(str(p.relative_to(t)).replace("\\", "/") for p in t.rglob("*"))
out["continut_nota_de_test"] = (t / "Matematica" / "nota_de_test.txt").read_text(encoding="utf-8")
g = L / "u1_nisip" / "ordinea_lectiei_Inlocuire" / "Documente" / "Teme_cls5" / "Matematica"
out["Matematica_in_ordinea_lectiei_Inlocuire"] = sorted(p.name for p in g.iterdir())
r = json.loads((L / "u1_raspunsuri_elev.json").read_text(encoding="utf-8"))
out["u1_raspunsuri_numar_intrari"] = len(r)
s = json.loads((L / "u7_salvare_iesire.json").read_text(encoding="utf-8"))
out["raspuns_salvat_dupa_reincarcare"] = s["dupa_reincarcare_acelasi_browser"][:40]
out["raspuns_in_alt_profil"] = s["alt_profil_browser"]
(L / "07_redeschis.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print(json.dumps(out, ensure_ascii=False))
