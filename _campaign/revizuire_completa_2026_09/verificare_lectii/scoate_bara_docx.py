# Scoate <w:removePersonalInformation/> (și <w:removeDateAndTime/>) din word/settings.xml, ca Word să nu mai arate
# bara galbenă „PERSONAL INFORMATION REMOVAL ENABLED” la deschidere. Metadatele rămân goale (curata_metadate.py → 0).
import re
import shutil
import sys
import zipfile
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
for cale in sys.argv[1:]:
    f = Path(cale)
    tmp = f.with_suffix(f.suffix + ".tmp")
    n = 0
    with zipfile.ZipFile(f) as zin, zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zout:
        for it in zin.infolist():
            data = zin.read(it.filename)
            if it.filename == "word/settings.xml":
                s = data.decode("utf-8")
                s2, n = re.subn(r"<w:(removePersonalInformation|removeDateAndTime)\s*/>", "", s)
                data = s2.encode("utf-8")
            zout.writestr(it, data)
    shutil.move(str(tmp), str(f))
    with zipfile.ZipFile(f) as z:
        ramas = b"removePersonalInformation" in z.read("word/settings.xml")
    print(f"{f.name}: scoase {n}, rămas {ramas}")
