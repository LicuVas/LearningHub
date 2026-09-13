"""Randeaza / recalculeaza un fisier Office fara ecran, cu dovada ca rezultatul chiar exista.

python H_randeaza.py pdf  <fisier.docx|pptx|xlsx> <folder_lectie>   -> <nume>.pdf + <nume>_pN.png (primele 3 pagini)
python H_randeaza.py xlsx <fisier.xlsx> <folder_lectie>             -> recalculat/<nume>.xlsx (valorile calculate de LibreOffice)

De ce exista (E_verificare_adversariala.md B5): mai multe LibreOffice pornite deodata cu profilul implicit
pierd conversii IN TACERE (5 din 6 fara rezultat, 4 dintre ele cu exit 0). Aici fiecare lectie are profilul ei,
iar succesul = fisierul-tinta exista si e mai nou decat sursa. Altfel: exit 1.

ATENTIE la xlsx (B4): in fisier formulele stau MEREU in forma engleza cu virgula (=SUM(A1,A2)).
Separatorul ';' si numele traduse tin de TASTAREA in program, pe setarea regionala. Un #VALUE! pe o formula
scrisa cu ';' in openpyxl e artefact de format, NU defect al lectiei.
"""
import subprocess
import sys
import time
from pathlib import Path

SOFFICE = r"C:\Program Files\LibreOffice\program\soffice.exe"


def main() -> int:
    if len(sys.argv) != 4 or sys.argv[1] not in ("pdf", "xlsx"):
        print(__doc__)
        return 2
    mode, src, L = sys.argv[1], Path(sys.argv[2]).resolve(), Path(sys.argv[3]).resolve()
    if not src.is_file():
        print(f"nu exista: {src}")
        return 1
    import hashlib
    import tempfile
    # profil separat per lectie, dar in %TEMP% - nu in dovezi (pilot: 450 KB de gunoi in folderul lectiei)
    prof_dir = Path(tempfile.gettempdir()) / "lh_lo_profiles" / hashlib.sha1(str(L).encode()).hexdigest()[:12]
    profile = prof_dir.as_uri()
    if mode == "pdf":
        outdir = L / f"randat_{src.suffix[1:]}"
        target = outdir / (src.stem + ".pdf")
        conv = "pdf"
    else:
        outdir = L / "recalculat"
        target = outdir / src.name
        conv = 'xlsx:Calc MS Excel 2007 XML'
    outdir.mkdir(parents=True, exist_ok=True)
    t0 = time.time()
    r = subprocess.run([SOFFICE, f"-env:UserInstallation={profile}", "--headless", "--convert-to", conv,
                        "--outdir", str(outdir), str(src)], capture_output=True, text=True, timeout=180)
    if not target.is_file() or target.stat().st_mtime < t0 - 1:
        print(f"ESEC: {target} nu a fost produs (exit soffice {r.returncode}). stderr: {r.stderr[-300:]}")
        return 1
    print(f"OK {target}")
    if mode == "pdf":
        import fitz
        doc = fitz.open(str(target))
        print(f"pagini: {doc.page_count}")
        for i in range(min(3, doc.page_count)):
            png = outdir / f"{src.stem}_p{i + 1}.png"
            doc[i].get_pixmap(dpi=80).save(str(png))
            print(f"OK {png}")
    else:
        import openpyxl
        wb = openpyxl.load_workbook(str(src))
        wv = openpyxl.load_workbook(str(target), data_only=True)
        n = 0
        for ws in wb.worksheets:
            for row in ws.iter_rows():
                for c in row:
                    if isinstance(c.value, str) and c.value.startswith("="):
                        n += 1
                        if n <= 20:
                            print(f"{ws.title}!{c.coordinate}: {c.value} -> {wv[ws.title][c.coordinate].value!r}")
        print(f"formule: {n}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
