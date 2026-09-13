"""U7 - proces Python nou: redeschid artefactele produse (raspunsurile elevului, scorurile checklistului,
salvarea din browser) si citesc 1-2 valori din fiecare. Scrie 07_redeschis.json."""
import json
from pathlib import Path

L = Path(__file__).resolve().parent
r = json.loads((L / "u1_raspunsuri_elev.json").read_text(encoding="utf-8"))
c = json.loads((L / "u1_checklist_iesire.json").read_text(encoding="utf-8"))
s = json.loads((L / "u7_salvare_iesire.json").read_text(encoding="utf-8"))
out = {
    "u1_raspunsuri_numar_intrari": len(r),
    "u1_raspuns_ex1_primele_60": r[1]["raspuns_elev_11_ani"][:60],
    "checklist_Mihai_DA_NU": [c["Mihai"]["scor_DA"], c["Mihai"]["NU"]],
    "checklist_Elena_DA_NU": [c["Elena"]["scor_DA"], c["Elena"]["NU"]],
    "raspuns_salvat_dupa_reincarcare": (s.get("dupa_reincarcare_acelasi_browser") or "")[:40],
    "raspuns_in_alt_profil": s.get("alt_profil_browser"),
}
(L / "07_redeschis.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print(json.dumps(out, ensure_ascii=False))
