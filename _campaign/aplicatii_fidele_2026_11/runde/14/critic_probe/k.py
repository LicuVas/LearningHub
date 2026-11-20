# -*- coding: utf-8 -*-
"""Ajutoarele criticului 13 peste h.py (hamul criticului 12): focus, insigne KeyTips, lista deschisă, stare pe chei."""
import json, sys
sys.path.insert(0, __import__('os').path.dirname(__file__))
from h import Ham, st, ev, el, centru, clic, nesimulat, scrie

def foc(pg):
    return pg.evaluate("""(()=>{const a=document.activeElement;if(!a)return null;const t=a.closest&&a.closest('[data-lh-tinta]');
      const d=a.closest&&a.closest('[data-lh-suprafata]');
      return {tag:a.tagName,cls:String(a.className||'').slice(0,50),ro:!!a.readOnly,val:String(a.value==null?'':a.value).slice(0,40),
        tinta:t?(t.getAttribute('data-lh-tinta')+(t.getAttribute('data-lh-id')?':'+t.getAttribute('data-lh-id'):'')):null,
        supr:d?d.getAttribute('data-lh-suprafata'):null,inRoot:!!(a.closest&&a.closest('[data-lh-aplicatie]'))}})()""")

def kt(pg):
    return pg.evaluate("(()=>[...document.querySelectorAll('.lh-ap-keytip')].filter(x=>x.offsetParent).map(x=>x.textContent))()")

def men(pg):
    return pg.evaluate("""(()=>{const m=[...document.querySelectorAll('.lh-ap-p-lista-ref,.lh-ap-p-meniu')].filter(x=>x.offsetParent);
      if(!m.length)return null;const x=m[m.length-1];const h=x.querySelector('.lh-ap-p-tasta');
      return {supr:x.getAttribute('data-lh-suprafata'),tasta:h?h.getAttribute('data-lh-eticheta'):null,n:m.length}})()""")

def dlg(pg):
    return pg.evaluate("""(()=>{const d=[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata^="dialog."]')].filter(x=>x.offsetParent);
      return d.map(x=>x.getAttribute('data-lh-suprafata'))})()""")

def S(pg, *chei, app='powerpoint'):
    s = st(pg, app)
    return {k: s.get(k) for k in chei} if chei else s

def taste(pg, *k, pauza=90):
    for x in k:
        pg.keyboard.press(x)
        pg.wait_for_timeout(pauza)

def pas(pg, k, pauza=90):
    """o tastă + ce s-a văzut după ea"""
    pg.keyboard.press(k); pg.wait_for_timeout(pauza)
    return {'k': k, 'kt': kt(pg)[:40], 'men': men(pg), 'foc': foc(pg), 'ev': ev(pg), 'dlg': dlg(pg), 'nesim': nesimulat(pg)}

def sir(pg, chei, pauza=90):
    return [pas(pg, k, pauza) for k in chei]
