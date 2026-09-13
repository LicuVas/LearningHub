"""U7: redeschid artefactele sarcinii intr-un proces Python nou si citesc valorile.
Scrie 07_redeschis.json."""
import json
from pathlib import Path

L = Path(__file__).resolve().parent
f = L / "u1_sandbox" / "PC_laborator_cont_comun" / "Documents" / "Scoala" / "TIC" / "Clasa5" / "M1-Sisteme" / "Test_Organizare.txt"
r = json.loads((L / "u1_raspunsuri_elev.json").read_text(encoding="utf-8"))
out = {
    "fisier": str(f.relative_to(L)).replace("\\", "/"),
    "exista": f.is_file(),
    "primul_rand": f.read_text(encoding="utf-8").splitlines()[0] if f.is_file() else None,
    "numar_randuri": len(f.read_text(encoding="utf-8").splitlines()) if f.is_file() else 0,
    "ultimul_rand": f.read_text(encoding="utf-8").splitlines()[-1] if f.is_file() else None,
    "exercitii_in_u1_raspunsuri_elev": len(r),
    "nota": "ultimul rand e al clasei a doua (5M): fisierul primei clase a fost suprascris pe acelasi cont",
}
(L / "07_redeschis.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print(json.dumps(out, ensure_ascii=False))
