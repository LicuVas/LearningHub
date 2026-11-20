# -*- coding: utf-8 -*-
"""Runda 15, acoperire pe instrumente: completează în suprafete.json `sursa` / `ce_contine` pe suprafețele explorer.* /
windows.* legate acum de referințele shell (structura_lib.referinte_shell + SHELL_LEGATURI), motivul pe cele rămase fără
referință, `surse_reale` / `nr_suprafete_neverificate` pe cele două aplicații și nota `acoperire_r15`.
Formatul fișierului rămâne cel de azi (indent 1, CRLF, ensure_ascii=False — verificat octet cu octet la încărcare).
    python .../probe/actualizeaza_suprafete.py            # scrie
    python .../probe/actualizeaza_suprafete.py --arata    # doar afișează ce ar scrie"""
import json
import sys
from pathlib import Path

AICI = Path(__file__).resolve().parent
D = AICI.parents[3]
sys.path.insert(0, str(D / "oracole"))
import structura_lib as L  # noqa: E402

F = D / "suprafete.json"
SESIUNE = "UI Automation pe Windows-ul profesorului, sesiunea din 20.11.2026"
NOTA = ("20.11.2026, runda `acoperire` pe instrumente (înainte de valul B-explorer): O3 citește referinte/uia_explorer.json "
        "și referinte/uia_windows.json (formatul referinte/dump_shell_uia.py) prin oracole/structura_lib.referinte_shell(). "
        "Suprafețele explorer.* / windows.* legate de o captură au acum `sursa` (captura și regula de tăiere) și `ce_contine` "
        "(comenzile comparate; „ascunse” = noduri ascunse pentru date personale, comparate ca prezente, fără text); cheia de "
        "randare (data-lh-suprafata) e în `sursa`, după „→”. Cele fără captură păstrează [NEVERIFICAT], cu motivul. "
        "Scris de runde/15/acoperire_instrumente/probe/actualizeaza_suprafete.py; inventar_build.py NU le știe: o regenerare "
        "a fișierului le-ar pierde (de refăcut cu scriptul acesta).")


def text(o):
    return json.dumps(o, ensure_ascii=False, indent=1).replace("\n", "\r\n") + "\r\n"


def descrie(c, maxim=12):
    us = [u for g in c["grupuri"] for u in g["u"]]
    vazute = [u["raw"].replace("\n", " ").replace("\r", " ").strip() for u in us if not u.get("ascuns")]
    asc = sum(1 for u in us if u.get("ascuns"))
    gri = sum(1 for u in us if not u.get("activ", True))
    s = f"{len(us)} comenzi: " + ", ".join(vazute[:maxim]) + (f" … (+{len(vazute) - maxim})" if len(vazute) > maxim else "")
    if asc:
        s += f"; {asc} ascunse (date personale: prezente, fără text)"
    if gri:
        s += f"; {gri} gri în captură"
    return s


def main():
    b = F.read_bytes()
    d = json.loads(b.decode("utf-8"))
    if text(d).encode("utf-8") != b:
        sys.exit("suprafete.json nu mai are formatul așteptat (indent 1, CRLF): nu-l rescriu")
    refs = L.referinte_shell()
    schimbate = []
    for app in L.SHELL:
        ref = refs[app]
        a = d["aplicatii"][app]
        for s in a["suprafete"]:
            chei = L.referinta_suprafata(app, s["id"], ref)
            if chei:
                surse = []
                for k in chei:
                    cap, regula = ref.surse[k]
                    surse.append(f"{cap}" + ("" if regula == "toată captura" else f" ({regula})") + f" → cheia „{k}”")
                s["sursa"] = f"referinte/{L.SHELL_FISIER[app]} › " + " + ".join(surse) + f" ({SESIUNE})"
                s["ce_contine"] = " | ".join(f"{k}: {descrie(ref.canon[k])}" for k in chei)
            else:
                s["sursa"] = "[NEVERIFICAT]: " + ref.motiv_fara(s["id"])
            schimbate.append(s["id"])
        a["surse_reale"] = [f"referinte/{L.SHELL_FISIER[app]} ({SESIUNE}; scris de referinte/dump_shell_uia.py; citit de O3 "
                            f"prin oracole/structura_lib.referinte_shell)"]
        a["nr_suprafete_neverificate"] = sum(1 for s in a["suprafete"] if "NEVERIFICAT" in (s.get("sursa") or ""))
    d["acoperire_r15"] = NOTA
    if "--arata" in sys.argv:
        for app in L.SHELL:
            for s in d["aplicatii"][app]["suprafete"]:
                print(s["id"], "|", s["sursa"][:160], "|", (s.get("ce_contine") or "")[:160])
        return
    F.write_bytes(text(d).encode("utf-8"))
    print(f"suprafete.json: {len(schimbate)} suprafețe explorer/windows actualizate; neverificate: "
          + ", ".join(f"{a} {d['aplicatii'][a]['nr_suprafete_neverificate']}" for a in L.SHELL))


if __name__ == "__main__":
    main()
