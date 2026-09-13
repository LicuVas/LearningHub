"""U1 pentru lectia5-reguli (cls5): fac pe disc sarcina „Incearca singur” pas cu pas, ca elevul.
Sandbox: L/u1_sandbox/<clasa>/Documents (in locul Documents-ului real al PC-ului din laborator).
Ramuri: (a) prima clasa, cale fericita; (b) a doua clasa pe acelasi PC / acelasi cont; (c) numele interzise
din regula lectiei („nu folosi \\ / : * ? \" < > |”) incercate efectiv pe Windows.
Scrie u1_sarcina_iesire.json; tipareste <= 20 de randuri."""
import json
import shutil
from pathlib import Path

L = Path(__file__).resolve().parent
SB = L / "u1_sandbox"
if SB.exists():
    shutil.rmtree(SB)
out = {"pasi": []}


def pas(nr, ce, rez):
    out["pasi"].append({"nr": nr, "ce_scrie_lectia": ce, "rezultat": rez})


def ruleaza(clasa: str):
    docs = SB / "PC_laborator_cont_comun" / "Documents"
    docs.mkdir(parents=True, exist_ok=True)
    rez = {}
    cale = docs
    for nr, nume in [(2, "Scoala"), (3, "TIC"), (4, "Clasa5"), (5, "M1-Sisteme")]:
        cale = cale / nume
        try:
            cale.mkdir()  # Explorer: New -> Folder, apoi redenumire
            rez[nume] = "creat"
        except FileExistsError:
            rez[nume] = "EXISTA DEJA (alt elev l-a creat)"
    f = cale / "Test_Organizare.txt"
    existent = f.read_text(encoding="utf-8") if f.exists() else None
    linie = "Aceasta este prima mea tema organizata! Data: 18.09.2026"
    f.write_text(linie + "\n", encoding="utf-8")  # pasul 8: Ctrl+S, Save As cu numele cerut
    for i in range(5):  # pasul 9: inca o linie + Ctrl+S, de 5 ori
        with f.open("a", encoding="utf-8") as h:
            h.write(f"Linie {i + 2} ({clasa})\n")
    rez["fisier_existent_inainte"] = existent
    rez["fisier_dupa"] = f.read_text(encoding="utf-8").splitlines()
    return rez


out["a_prima_clasa_5AM"] = ruleaza("5AM")
out["b_a_doua_clasa_5M_acelasi_cont"] = ruleaza("5M")

# structura finala vs desenul din lectie (innerText r. 85-90)
docs = SB / "PC_laborator_cont_comun" / "Documents"
arbore = sorted(str(p.relative_to(docs)).replace("\\", "/") for p in docs.rglob("*"))
out["structura_pe_disc"] = arbore
out["structura_din_lectie"] = ["Scoala", "Scoala/TIC", "Scoala/TIC/Clasa5", "Scoala/TIC/Clasa5/M1-Sisteme",
                               "Scoala/TIC/Clasa5/M1-Sisteme/Test_Organizare.txt"]
out["structura_identica"] = arbore == out["structura_din_lectie"]

# (c) caracterele interzise, incercate efectiv
interz = {}
for ch in ['\\', '/', ':', '*', '?', '"', '<', '>', '|']:
    p = SB / f"tema{ch}1.txt"
    try:
        p.write_text("x", encoding="utf-8")
        interz[ch] = "PERMIS (fisier creat: " + ",".join(x.name for x in SB.glob("tema*")) + ")"
        for x in SB.glob("tema*"):
            x.unlink()
    except OSError as e:
        interz[ch] = f"refuzat: {type(e).__name__}"
out["c_caractere_interzise_windows"] = interz
p = SB / "TIC Tema 1 cu spatii.txt"
p.write_text("x", encoding="utf-8")
out["c_spatiu_in_nume_merge"] = p.exists()

(L / "u1_sarcina_iesire.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print("prima clasa:", out["a_prima_clasa_5AM"]["Scoala"], "| a doua clasa:", out["b_a_doua_clasa_5M_acelasi_cont"]["Scoala"])
print("fisierul gasit de clasa a doua inainte sa scrie:", (out["b_a_doua_clasa_5M_acelasi_cont"]["fisier_existent_inainte"] or "")[:80].replace("\n", " | "))
print("structura identica cu desenul:", out["structura_identica"])
print("caractere interzise:", out["c_caractere_interzise_windows"])
print("spatiu in nume merge:", out["c_spatiu_in_nume_merge"])
