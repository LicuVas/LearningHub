"""Montaj 2x2 din paginile randate (randat_xlsx/*_p1.png), re-randate la 100 dpi si decupate la zona cu date."""
import sys
from pathlib import Path
import fitz
from PIL import Image
L = Path(__file__).resolve().parent
def pag(n):
    d = fitz.open(str(L / "randat_xlsx" / f"{n}.pdf"))
    pm = d[0].get_pixmap(dpi=100)
    im = Image.frombytes("RGB", (pm.width, pm.height), pm.samples)
    return im.crop((0, 0, im.width, int(im.height * 0.62)))
for out, names in [("montaj_incearca.png", ["incearca_column", "incearca_pie", "incearca_line", "lipire_roRO"]),
                   ("montaj_exercitii.png", ["ex1_column_bar", "ex3_coleg", "serii_provocare", "stil_3d"])]:
    ims = [pag(n) for n in names]
    w, h = max(i.width for i in ims), max(i.height for i in ims)
    M = Image.new("RGB", (2 * w, 2 * h), "white")
    for k, im in enumerate(ims):
        M.paste(im, ((k % 2) * w, (k // 2) * h))
    M.save(L / "randat_xlsx" / out)
    print(out, M.size)
