# -*- coding: utf-8 -*-
"""Critic r9 p7: regresul X8 (proba veche r7c2 a picat 3 randuri): Ctrl+W pe registru nemodificat, Ctrl+N, Ctrl+W pe modificat + Don't Save."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/9/critic_probe")
from h import *
out = {}
s = Sesiune(); K = s.page.keyboard
def st(n):
    x = s.stare(); out[n] = {"registru_activ": x.get("registru_activ"), "registre": x.get("registre"), "dialog": x.get("dialog"), "titlu": x.get("titlu_fereastra"), "ev": ultimele_ev(s, 1), "mesaj": mesaj_tot(s)}
try:
    deschide_cu(s, {"celule": {"A1": 1}, "selectie": "B2"}); clic_cel(s, "B2"); s.page.wait_for_timeout(650)
    K.press("Control+w"); s.page.wait_for_timeout(300); st("1_ctrl_w_nemodificat")
    K.press("Control+n"); s.page.wait_for_timeout(300); st("2_ctrl_n")
    clic_cel(s, "B2"); s.page.wait_for_timeout(650); K.type("x"); K.press("Enter"); K.press("Control+w"); s.page.wait_for_timeout(300); st("3_ctrl_w_modificat")
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-eticheta="Don\'t Save"]'); s.page.wait_for_timeout(300); st("4_dont_save")
    out["erori"] = s.erori
finally:
    json.dump(out, open(P + "p7.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1); s.gata()
