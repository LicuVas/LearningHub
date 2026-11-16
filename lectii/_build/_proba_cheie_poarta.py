"""Proba cheii din build_lectii: cheia trebuie să se schimbe când se schimbă orice încarcă lecția, și NUMAI atunci.
Ultima linie = probleme (0 = bine). Nu rulează nicio poartă și nu scrie nimic."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
sys.stdout.reconfigure(encoding="utf-8")
import build_lectii as B  # noqa: E402

CLASA, LECTIE = "v", "m4-l28"
original = Path.read_bytes
start = B.cheie_poarta(CLASA, LECTIE)
probleme = 0


def verifica(eticheta, nume_fisier, trebuie_sa_se_schimbe):
    global probleme

    def citeste(self):
        date = original(self)
        return date + b"//mutant" if self.name == nume_fisier else date

    Path.read_bytes = citeste
    try:
        schimbat = B.cheie_poarta(CLASA, LECTIE) != start
    finally:
        Path.read_bytes = original
    bine = schimbat == trebuie_sa_se_schimbe
    probleme += 0 if bine else 1
    print(("OK    " if bine else "PICAT ") + f"{eticheta}: cheia {'s-a schimbat' if schimbat else 'a rămas la fel'}")


verifica("control: nimic schimbat", "fisier-care-nu-exista.js", False)
verifica("pagina lecției", "index.html", True)
verifica("simulatorul încărcat de lecție", "secventa-liniara.js", True)
verifica("motorul", "motor.js", True)
verifica("stilul motorului", "motor.css", True)
verifica("testul", "test_joc.py", True)
verifica("prezența", "prezenta.js", True)
verifica("simulator pe care lecția NU îl încarcă", "cpp-mic.js", False)
print(probleme)
