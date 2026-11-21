"""Scrie P/explorer-windows.md din P/explorer-windows.json (listele NU / PARȚIAL vin din JSON, nu se copiază de mână)."""
import json
from collections import Counter
from pathlib import Path

P = Path(r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/paritate")
d = json.loads((P / "explorer-windows.json").read_text(encoding="utf-8"))
F = d["functii"]
c = Counter(f["biblioteca"] for f in F)
ca = Counter((f["aplicatie"], f["biblioteca"]) for f in F)
ce = Counter(f["biblioteca"] for f in F if f["ceruta_de_exercitiu"])
ncer = sum(ce.values())

def scurt(s, n=170):
    s = (s or "").replace("\n", " ").strip()
    return s if len(s) <= n else s[: n - 1].rstrip() + "…"

def lista(verdict, cerute):
    xs = [f for f in F if f["biblioteca"] == verdict and f["ceruta_de_exercitiu"] == cerute]
    out = []
    for f in xs:
        r = f"- `{f['id'][-4:]}` ({f['aplicatie']}) {scurt(f['functie'], 140)}"
        if verdict == "PARTIAL" and f.get("lipsa"):
            r += f" — **lipsește:** {scurt(f['lipsa'])}"
        if cerute and f.get("unde"):
            r += f" _[{', '.join(f['unde'])}]_"
        out.append(r)
    return xs, out

rows = []
rows.append("# Paritate: File Explorer și Windows (vechi pe proba → biblioteca nouă)")
rows.append("")
rows.append("Data: 21.11.2026. Detaliile, cu dovezile pe linii, sunt în `explorer-windows.json`.")
rows.append("")
rows.append("## Pe scurt")
rows.append(f"- **{len(F)} funcții** pe care elevul le poate folosi în simulatoarele vechi: "
            f"**{c['DA']} DA**, **{c['PARTIAL']} PARȚIAL**, **{c['NU']} NU** în biblioteca nouă.")
rows.append(f"  - File Explorer: {sum(v for (a, _), v in ca.items() if a == 'explorer')} "
            f"(DA {ca[('explorer', 'DA')]}, PARȚIAL {ca[('explorer', 'PARTIAL')]}, NU {ca[('explorer', 'NU')]}).")
rows.append(f"  - Windows (desktop, Start, ferestre, browser, Securitate): {sum(v for (a, _), v in ca.items() if a == 'windows')} "
            f"(DA {ca[('windows', 'DA')]}, PARȚIAL {ca[('windows', 'PARTIAL')]}, NU {ca[('windows', 'NU')]}).")
rows.append(f"- **{ncer} sunt cerute de exerciții** (verificate de un test din pagină): DA {ce['DA']}, PARȚIAL {ce['PARTIAL']}, NU {ce['NU']}.")
rows.append(f"- {len(d['doar_afisate'])} grupuri de butoane doar afișate (dau doar un mesaj), trecute separat în JSON.")
rows.append("- Sursele vechi: explorer-citire, explorer-operatii, explorer-organizare, explorer-proba, desktop-windows, "
            "siguranta-pc (lectii/_sim/) și jocul jocuri/fisiere-v (simulator scris în pagină: tipurile `ecran` și `explorer`). "
            "Aceeași funcție găsită în mai multe simulatoare e trecută o singură dată, cu toate dovezile.")
rows.append("")
rows.append("## Ce lipsește peste tot (nu e o singură funcție)")
rows.append("- **Starea pe care o verifică exercițiile e prea săracă.** Starea Explorer-ului din bibliotecă arată doar folderul de lucru "
            "(fără subfoldere, fără id, dată sau dimensiune pe fișier). Testele vechi pe căi adânci, „copiat” față de „mutat”, "
            "„același fișier” sau Coșul cu fișierele colegilor nu se pot scrie peste ea. Și unde funcția e DA, exercițiul vechi "
            "nu se poate muta pe bibliotecă fără o stare mai bogată.")
rows.append("- **Testele pe istoric** („ai maximizat”, „ai deschis Start”, „ai citit calea”, „ai căutat”, „ai scanat ÎNAINTE să deschizi”) "
            "nu au pereche în stare. Biblioteca trimite evenimente, dar tipul comun de exercițiu verifică doar starea.")
rows.append("- **Bifele pe loc** („Testele sarcinii · x din y trec”) și **„Arată-mi răspunsul”** din simulatoarele vechi lipsesc. "
            "Tipul comun de exercițiu are doar butonul Verifică.")
rows.append("- **Acest PC, unitățile și stickul (E:)** nu există: cine apasă pe ele primește „aici nu e simulată”. "
            "De aici vin mai multe PARȚIAL (panoul din stânga, Sus, bara de adresă) și NU (stickul, ștergerea definitivă de pe stick, scanarea stickului).")
rows.append("- **Browserul și Securitate Windows nu există** în bibliotecă: lecția VI · M2 · 11 (pagina falsă, scanarea) nu are pe ce rula.")
rows.append("- **Defect găsit la probă:** un folder decupat și lipit chiar în subfolderul lui dispare, fără niciun mesaj "
            "(`aplicatii/explorer.js:512-542`, `lipeste` nu verifică destinația). Vechiul spunea „Folderul destinație este un subfolder al folderului sursă.”")
rows.append("")
for verdict, titlu in (("NU", "NU"), ("PARTIAL", "PARȚIAL")):
    xs, out = lista(verdict, True)
    rows.append(f"## {titlu}: cerute de exerciții ({len(xs)})")
    rows += out
    rows.append("")
for verdict, titlu in (("NU", "NU"), ("PARTIAL", "PARȚIAL")):
    xs, out = lista(verdict, False)
    rows.append(f"## {titlu}: necerute de exerciții ({len(xs)})")
    rows += out
    rows.append("")
rows.append("## Ce n-am apucat / ce e nesigur")
rows.append("- Tot codul vechi din listă a fost citit (nimic neacoperit). Ce codul nu lămurea s-a jucat headless în poligon (scripturile și rezultatele: `probe_explorer-windows/`).")
rows.append("- Neprobate: ținutul apăsat pe telefon (biblioteca se bizuie pe meniul nativ al browserului; pe iOS nu vine), ecranele sub 600 px.")
rows.append("- Hotărâri la limită: butonul de readucere a ferestrei e PARȚIAL doar pentru că păstrează numele „Maximizare” "
            "(devine DA dacă numele e socotit aspect). Coloana Tip e PARȚIAL pentru că arată „FastStone PNG File”, de pe PC-ul de referință, nu „Fișier PNG”, cum spune lecția.")
rows.append("- Casetele de răspuns scris (calea, ediția Windows) sunt trecute ca funcții NU, cu notă: țin de exercițiu, nu de aplicație. "
            "Casetele pentru oră și pentru numărul de amenințări nu sunt trecute ca funcții, fiindcă țin de lecție. "
            "La fel butoanele „Reîncep exercițiul” / „Ia-o de la capăt”, întrebarea cu variante (`probaalege`) și analiza organizării din lecția V · M2 · 11. "
            "Lista completă e în `nesigure`, în JSON.")
rows.append("")
rows.append(f"GATA_PARITATE explorer-windows total={len(F)} da={c['DA']} partial={c['PARTIAL']} nu={c['NU']}")
(P / "explorer-windows.md").write_text("\n".join(rows) + "\n", encoding="utf-8")
print("scris", len(rows), "rânduri")
