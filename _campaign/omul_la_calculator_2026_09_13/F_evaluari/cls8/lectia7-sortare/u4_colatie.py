"""U4 - ordinea alfabetica a numelor romanesti cu diacritice dupa setarea regionala a Windows-ului.
Sursa (text brut, surse/sort_en.txt): „Sort orders vary by locale setting ... Regional Settings ... in Control Panel”.
Excel nu e pornit (interdictie). Observ doar ce da COLATIA Windows (CompareStringEx) pe ro-RO vs en-US
si ce da o sortare naiva pe coduri Unicode (cum ar sorta un script Python fara locale).
CE NU DOVEDESTE: ca Excel foloseste exact aceasta functie -> legatura Excel <-> colatia Windows ramane NESIGURA,
sustinuta doar de fraza Microsoft despre setarea regionala."""
import ctypes
import functools
import json
from pathlib import Path

L = Path(__file__).resolve().parent
NUME = ["Zamfir", "Țăranu", "Tudor", "Ștefan", "Szabo", "Suciu", "Sandu", "Anghel", "Ababei",
        "Ăsăvoaie", "Şerban", "Șerban", "Iordache", "Îndrieș", "Țurcanu", "Toma"]  # Şerban cu sedila + Șerban cu virgula

k32 = ctypes.WinDLL("kernel32", use_last_error=True)
k32.CompareStringEx.argtypes = [ctypes.c_wchar_p, ctypes.c_uint32, ctypes.c_wchar_p, ctypes.c_int,
                                ctypes.c_wchar_p, ctypes.c_int, ctypes.c_void_p, ctypes.c_void_p, ctypes.c_void_p]
LINGUISTIC_IGNORECASE = 0x00000010
NORM_LINGUISTIC_CASING = 0x08000000


def cmp_locale(loc):
    def c(a, b):
        r = k32.CompareStringEx(loc, LINGUISTIC_IGNORECASE, a, -1, b, -1, None, None, None)
        if r == 0:
            raise OSError(ctypes.get_last_error())
        return r - 2
    return c


rez = {"naiv_unicode": sorted(NUME)}
for loc in ("ro-RO", "en-US"):
    rez[loc] = sorted(NUME, key=functools.cmp_to_key(cmp_locale(loc)))
rez["sedila_egal_virgula"] = {loc: cmp_locale(loc)("Şerban", "Șerban") == 0 for loc in ("ro-RO", "en-US")}
(L / "u4_colatie.json").write_text(json.dumps(rez, ensure_ascii=False, indent=1), encoding="utf-8")
for k, v in rez.items():
    print(k, ":", v)
