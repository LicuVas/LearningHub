import sys; sys.path.insert(0, 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/paritate/probe_verif_excel-2')
from h import H
import json
with H() as h:
    t = h.ev("LH.aplicatii.tinte('excel')")
    print(len(t)); print([x for x in t if not x.startswith('celula:')][:400])
    s = h.stare(); print(list(s.keys())); print(json.dumps(s.get('celule'), ensure_ascii=False)[:500])
    print('erori', h.erori)
