"""Pregateste comparatia OARBA A/B pe cele 4 lectii comune.

Pentru fiecare lectie scrie O_orb/<lectie>/raport_X.md si raport_Y.md:
  - unul e auditul „AI obisnuit" (CONTROL/C_baseline/<cls>_<lectie>.md, text liber, neatins);
  - celalalt e evaluarea „omul la calculator", adusa la aceeasi forma de text: doar ce s-a gasit, unde/dovada,
    gravitate, ce trebuie schimbat — FARA codurile U1..U17, rolurile, caile catre fisiere de dovada si numele protocolului.
Eticheta X/Y se trage la intamplare per lectie; cheia sta in CONTROL/O_cheie_orb.json (judecatorii nu o vad).
Limita declarata: stilul textului tot poate tradea sursa; judecatorul e instruit sa judece continutul.
"""
import json
import random
import re
from pathlib import Path

CAMP = Path(__file__).resolve().parent
CTRL = CAMP.parent / "omul_la_calculator_2026_09_13_CONTROL"
LECTII = [("cls5", "lectia2-hardware"), ("cls6", "lectia3-text-imagini"), ("cls7", "lectia5-tabele"), ("cls8", "lectia3-formule")]
rng = random.SystemRandom()
cheie = {}

for cls, les in LECTII:
    base = (CTRL / "C_baseline" / f"{cls}_{les}.md").read_text(encoding="utf-8")
    # scot indiciile de sursa din antet („recenzie de bază", data, tipul) - ar strica orbirea
    base = re.sub(r"(?m)^\s*-\s*\*\*(Data|Tip)[^\n]*\n", "", base)
    base = re.sub(r"(?i)recenzie de baz[aă]|baseline|audit(ul)? de control", "recenzie", base)
    log = json.loads((CAMP / "F_evaluari" / cls / les / "log.json").read_text(encoding="utf-8"))
    out = [f"# Recenzia lecției {les} ({cls})\n"]
    for i, f in enumerate(log.get("findings") or [], 1):
        dov = re.sub(r"[A-Za-z]:[\\/][^\s,;)]+|\b[\w\-]+\.(json|txt|py|png|pdf|docx|xlsx|pptx|md)\b", "[fișier]", f.get("dovada") or "")
        dov = re.sub(r"\bU\d{1,2}\b", "", dov)
        ce = re.sub(r"\bU\d{1,2}\b", "", f.get("ce_vede_omul") or "")
        dif = re.sub(r"\bU\d{1,2}\b", "", f.get("ce_trebuie_diferit") or "")
        out.append(f"## {i}. {ce}\n- **Gravitate:** {f.get('gravitate')}\n- **Unde / dovada:** {dov}\n- **Ce trebuie schimbat:** {dif}\n")
    uman = "\n".join(out)
    uman = re.sub(r"(?i)\b(la |de |calculat de )?poart[aă]\b|\bprotocol(ul)?\b", "calculat", uman)
    x_is_uman = rng.random() < 0.5
    d = CAMP / "O_orb" / les
    d.mkdir(parents=True, exist_ok=True)
    (d / "raport_X.md").write_text(uman if x_is_uman else base, encoding="utf-8")
    (d / "raport_Y.md").write_text(base if x_is_uman else uman, encoding="utf-8")
    cheie[les] = {"X": "om_la_calculator" if x_is_uman else "control_ai_obisnuit",
                  "Y": "control_ai_obisnuit" if x_is_uman else "om_la_calculator"}
(CTRL / "O_cheie_orb.json").write_text(json.dumps(cheie, indent=1), encoding="utf-8")
print("gata: 4 lectii; cheia in CONTROL (nu se da judecatorilor)")
