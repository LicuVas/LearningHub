# -*- coding: utf-8 -*-
"""Critic r7: regresul celor trecute in runda 6 + modul Point cu sagetile + data in coloana ingusta + bara de stare."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/7/critic_probe")
from h import *
out = {}
def rec(k, **v): out[k] = v; print(k, json.dumps(v, ensure_ascii=False)[:1000])
s = Sesiune()
K = s.page.keyboard
def ev(n=3): return ultimele_ev(s, n)
def pauza(): s.page.wait_for_timeout(650)
def cel(a): return s.ev("a=>LH.aplicatii.stare('excel').celule[a]||null", a)
MOD = "()=>{const e=[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-tip]')].find(x=>/^(Ready|Enter|Edit|Point)$/.test((x.getAttribute('data-lh-eticheta')||x.textContent||'').trim()));return e?(e.getAttribute('data-lh-eticheta')||e.textContent).trim():null}"
try:
    s.deschide()
    # m1-l07: formula, #VALUE!, Ctrl+Z
    scrie(s, "E2", "9"); pauza(); scrie(s, "F2", "8"); pauza(); scrie(s, "G2", "=(E2+F2)/2"); pauza(); scrie(s, "F3", "5 bucăți"); pauza(); scrie(s, "G3", "=E2+F3")
    rec("m1_l07", G2=cel("G2"), G3=cel("G3"))
    # umplerea G2 -> G4 cu manerul
    pauza(); clic_cel(s, "G2")
    m = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"maner_umplere\"]');if(!e)return null;const b=e.getBoundingClientRect();return [b.x+b.width/2,b.y+b.height/2]}")
    x4, y4 = s.ev(CEL, "G4")
    if m: s.page.mouse.move(*m); s.page.mouse.down(); s.page.mouse.move(m[0], y4, steps=6); s.page.mouse.up(); s.page.wait_for_timeout(200)
    rec("umplere", G3=cel("G3"), G4=cel("G4"), ev=ev(1))
    # bara de stare: Ready -> Enter -> Edit
    pauza(); clic_cel(s, "H5"); m0 = s.ev(MOD); K.type("4"); m1 = s.ev(MOD); K.press("F2"); m2 = s.ev(MOD); K.press("Escape")
    rec("bara_stare", ready=m0, tastare=m1, f2=m2)
    # modul Point cu sagetile: „=” apoi sageata sus (in Excel scrie referinta celulei de deasupra)
    pauza(); clic_cel(s, "B5"); K.type("="); K.press("ArrowUp"); s.page.wait_for_timeout(150)
    ed = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] .lh-ap-x-ed');return e?e.value:null}")
    rec("egal_sageata", editare=ed, mod=s.ev(MOD), B5=cel("B5"), sel=s.stare()["selectie"], mesaj=mesaj(s), ev=ev(1))
    K.press("Escape"); K.press("Escape"); gol_mesaj(s)
    pauza(); clic_cel(s, "D2"); K.type("=B2+"); K.press("ArrowRight"); s.page.wait_for_timeout(150)
    ed = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] .lh-ap-x-ed');return e?e.value:null}")
    rec("plus_sageata", editare=ed, mod=s.ev(MOD), D2=cel("D2"), mesaj=mesaj(s), ev=ev(1))
    K.press("Escape"); K.press("Escape"); gol_mesaj(s)
    # data tastata intr-o coloana de 64 px
    pauza(); scrie(s, "K2", "12.03.2026"); pauza(); scrie(s, "K3", "=25/3")
    rec("data_ingusta", K2=cel("K2"), ecran=vezi(s, "K2")["text"], K3=cel("K3"), latimi=s.stare().get("latimi_coloane"))
    # Merge & Center, Bold, + foaie noua, Sort A to Z
    pauza(); clic_cel(s, "A1"); K.press("Shift+ArrowRight"); clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="MergeCenter"]'); r1 = ev(1)
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="Bold"]'); r2 = ev(1)
    clic_el(s, '[data-lh-aplicatie] [data-lh-eticheta="New sheet"], [data-lh-aplicatie] [data-lh-tinta="fila_foii_noua"], [data-lh-aplicatie] .lh-ap-x-file-foi [data-lh-eticheta="Add Sheet"]'); r3 = s.stare().get("foi")
    rec("merge_bold_foaie", merge=r1, bold=r2, foi=r3)
    # meniul de clic dreapta pe celula, apoi tasta C (Copy, acc C in referinta) cu meniul deschis
    pauza(); x, y = s.ev(CEL, "B2"); s.page.mouse.click(x, y, button="right"); s.page.wait_for_timeout(200)
    K.press("c"); s.page.wait_for_timeout(150)
    rec("meniu_tasta_c", meniu=s.ev("()=>!!document.querySelector('[data-lh-aplicatie] .lh-ap-x-meniu')"), B2=cel("B2"), clip=s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-x-clip')].filter(e=>getComputedStyle(e).display!=='none').length"), ev=ev(1))
    K.press("Escape"); K.press("Escape"); K.press("Escape")
    # Delete cu meniul deschis
    pauza(); x, y = s.ev(CEL, "C2"); s.page.mouse.click(x, y, button="right"); s.page.wait_for_timeout(200)
    K.press("Delete"); s.page.wait_for_timeout(150)
    rec("meniu_delete", meniu=s.ev("()=>!!document.querySelector('[data-lh-aplicatie] .lh-ap-x-meniu')"), C2=cel("C2"), ev=ev(1))
    s.shot("r1_meniu_delete.png", clip={"x": 0, "y": 170, "width": 700, "height": 420})
    rec("erori", e=s.erori)
finally:
    json.dump(out, open(P + "r1.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    s.gata()
