# -*- coding: utf-8 -*-
"""Poarta datelor personale (regula 27) pe worktree-ul măsurat (16.11.2026, lucrarea „Aplicațiile fidele”).

`C:/00/AI_0/tools/learninghub_date_personale.py` are rădăcina scrisă fix (`RAD = Path(r"C:\\00\\Projects\\LearningHub")`) și stă
în AI_0 (conține chiar tiparele căutate, deci NU se copiază pe sit). Aici îi citesc codul, înlocuiesc DOAR linia rădăcinii cu
situl măsurat (LH_RADACINA, implicit worktree-ul C:/00/Projects/LearningHub_fidel) și îl rulez în același proces, FĂRĂ
`--curata` (doar listează; nu schimbă niciun fișier). Unealta originală nu se atinge.
Ultima linie = numărul de fișiere cu date personale (al uneltei), sau -1 dacă înlocuirea n-a avut loc exact o dată.
"""
import os
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
UNEALTA = Path("C:/00/AI_0/tools/learninghub_date_personale.py")
RAD = Path(os.environ.get("LH_RADACINA") or Path(__file__).resolve().parents[4]).resolve()
LINIA = 'RAD = Path(r"C:\\00\\Projects\\LearningHub")'


def main():
    src = UNEALTA.read_text(encoding="utf-8")
    if src.count(LINIA) != 1:
        print(f"POARTA NU A RULAT: linia rădăcinii apare de {src.count(LINIA)} ori în {UNEALTA.name} (aștept 1)")
        print(-1)
        return 3
    src = src.replace(LINIA, f"RAD = Path({str(RAD)!r})")
    print(f"  info situl măsurat: {RAD.as_posix()} (unealta: {UNEALTA.as_posix()}, fără --curata)")
    sys.stdout.flush()
    sys.argv = [str(UNEALTA)]          # niciodată --curata
    g = {"__name__": "__main__", "__file__": str(UNEALTA)}
    exec(compile(src, str(UNEALTA), "exec"), g)   # noqa: S102 — codul uneltei, cu rădăcina schimbată
    return 0 if g.get("gasite", 1) == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
