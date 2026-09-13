"""U1 - fac provocarea „Organizeaza fisierele ca un profesionist!" + Bonus Challenge, pas cu pas, pe disc.
Pe un dosar-nisip din L (nu ating Documentele reale). Operatiile Explorer-ului sunt modelate cu os/shutil;
unde Explorer ar deschide un dialog (nume deja existent), scriptul inregistreaza coliziunea si urmeaza
fiecare alegere posibila a copilului (Inlocuire / Omitere / ordinea inversata).
Iesire: u1_fisiere_iesire.json. Tipareste <= 20 de randuri."""
import json
import os
import shutil
from pathlib import Path

L = Path(__file__).resolve().parent
NISIP = L / "u1_nisip"
out = {"pasi": [], "ramuri_bonus": {}, "a_doua_clasa_acelasi_pc": {}, "calea_din_lectie": {}}


def arbore(root: Path) -> list:
    return sorted(str(p.relative_to(root)).replace("\\", "/") + ("/" if p.is_dir() else "")
                  for p in root.rglob("*"))


def pregatire(doc: Path):
    """Pasii 1-6 din provocare, in ordinea lectiei."""
    t = doc / "Teme_cls5"
    t.mkdir()                                   # pas 3: New -> Folder, Teme_cls5
    (t / "Matematica").mkdir()                  # pas 4
    (t / "Romana").mkdir()
    (t / "nota_de_test.txt").write_text("tema", encoding="utf-8")   # pas 5 (in Teme_cls5 - „radacina” din Bonus)
    shutil.copy2(t / "nota_de_test.txt", t / "Matematica" / "nota_de_test.txt")  # pas 6: Copy -> Paste
    return t


def muta(src: Path, dst: Path) -> str:
    try:
        os.rename(src, dst)                     # pe Windows ridica FileExistsError daca destinatia exista
        return "mutat fara dialog"
    except FileExistsError:
        return "COLIZIUNE: exista deja nota_de_test.txt in Matematica (Explorer: dialog Inlocuire/Omitere)"


if NISIP.exists():
    shutil.rmtree(NISIP)
TINTA = ["LimbaRomana/", "Matematica/", "Matematica/nota_de_test.txt"]

for ramura in ("ordinea_lectiei_Inlocuire", "ordinea_lectiei_Omitere", "ordinea_inversata_sterg_intai"):
    doc = NISIP / ramura / "Documente"
    doc.mkdir(parents=True)
    t = pregatire(doc)
    if ramura == "ordinea_lectiei_Inlocuire" and not out["pasi"]:
        out["pasi"].append({"dupa_pasii_1_6": arbore(t)})
    jurnal = []
    os.rename(t / "Romana", t / "LimbaRomana")
    jurnal.append("redenumit Romana -> LimbaRomana: ok")
    if ramura.startswith("ordinea_lectiei"):
        r = muta(t / "nota_de_test.txt", t / "Matematica" / "nota_de_test.txt")
        jurnal.append("muta nota_de_test.txt in Matematica: " + r)
        if "COLIZIUNE" in r:
            if ramura.endswith("Inlocuire"):
                os.replace(t / "nota_de_test.txt", t / "Matematica" / "nota_de_test.txt")
                jurnal.append("copilul alege Inlocuire: copia de la pasul 6 a fost suprascrisa")
            else:
                jurnal.append("copilul alege Omitere: fisierul ramane in radacina")
        # „Sterge copia pe care ai facut-o la pasul 6" - copilul sterge fisierul din Matematica (acolo a pus copia)
        m = t / "Matematica" / "nota_de_test.txt"
        if m.exists():
            m.unlink()
            jurnal.append("sterge „copia” din Matematica")
    else:
        (t / "Matematica" / "nota_de_test.txt").unlink()
        jurnal.append("sterge intai copia din Matematica")
        jurnal.append("muta: " + muta(t / "nota_de_test.txt", t / "Matematica" / "nota_de_test.txt"))
    final = arbore(t)
    out["ramuri_bonus"][ramura] = {"jurnal": jurnal, "final": final, "egal_cu_tinta_din_lectie": final == TINTA}

# al doilea elev / a doua clasa la acelasi PC, in acelasi cont
doc = NISIP / "ordinea_lectiei_Inlocuire" / "Documente"
try:
    (doc / "Teme_cls5").mkdir()
    out["a_doua_clasa_acelasi_pc"] = {"creeaza Teme_cls5": "ok"}
except FileExistsError:
    out["a_doua_clasa_acelasi_pc"] = {"creeaza Teme_cls5": "COLIZIUNE: exista deja (cu fisierele elevului dinainte)"}

# calea scrisa in lectie vs calea reala a Documentelor pe PC-ul acesta (Windows 11)
up = Path(os.environ.get("USERPROFILE", ""))
out["calea_din_lectie"] = {
    "C:/Documente exista pe acest PC": Path("C:/Documente").exists(),
    "USERPROFILE/Documents exista": (up / "Documents").is_dir(),
    "USERPROFILE/Documente exista": (up / "Documente").is_dir(),
    "forma_reala": "C:\\Users\\<nume cont>\\Documents (numele contului ascuns aici)",
}

(L / "u1_fisiere_iesire.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
for k, v in out["ramuri_bonus"].items():
    print(k, "->", v["final"], "| tinta:", v["egal_cu_tinta_din_lectie"])
print(out["a_doua_clasa_acelasi_pc"])
print(out["calea_din_lectie"])
