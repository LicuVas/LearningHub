# -*- coding: utf-8 -*-
"""Ajutoarele criticului rece, runda 5 (unghiul stare_finala_erori). Refolosesc h4.py din runda 4 (server pe 127.0.0.1,
port liber; Chromium headless; ruta care abandoneaza tot ce nu e 127.0.0.1/localhost) si adaug citirea ferestrelor:
bara de adrese, panoul din stanga, randurile listei, zona PDF, mesajul central, caseta File name."""
import sys, traceback, json
sys.path.insert(0, r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/4/critic_probe")
from h4 import *  # noqa: F401,F403

OUT = r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/5/critic_probe/"

JS_DLG = r"""() => {
  const R = document.querySelector('[data-lh-aplicatie="word"]');
  const vis = e => { if (!e) return false; const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const d = R.querySelector('.lh-ap-strat-dialog [data-lh-suprafata^="dialog"]');
  if (!d) return null;
  const adr = [...d.querySelectorAll('[data-lh-eticheta^="Adres"]')].map(x => x.getAttribute('data-lh-eticheta') + ' | ecran=' + [...x.querySelectorAll('[data-lh-tip="SplitButton"]')].filter(vis).map(y => y.innerText.trim()).filter(Boolean).join(' > '));
  const nav = [...d.querySelectorAll('.lh-ap-nav-rand')].filter(vis).map(x => x.innerText.trim() + (x.hasAttribute('data-lh-selectat') ? ' [ales]' : ''));
  const lista = [...d.querySelectorAll('[data-lh-tip="List"] [data-lh-tip="ListItem"]')].filter(vis).map(x => (x.innerText.trim() || '(gol)') + ' {' + (x.getAttribute('data-lh-tinta') || '') + '}' + (x.hasAttribute('data-lh-selectat') ? ' [ales]' : ''));
  const ctl = [...d.querySelectorAll('[data-lh-tip="RadioButton"],[data-lh-tip="CheckBox"],[data-lh-tip="Group"]')].filter(x => /Optimize|Standard|Minimum|Open file|Thumbnail|Save Thumbnail/.test(x.getAttribute('data-lh-eticheta') || '')).map(x => x.getAttribute('data-lh-tip') + ':' + x.getAttribute('data-lh-eticheta') + ' vis=' + vis(x) + ' checked=' + x.getAttribute('aria-checked') + ' ecran=' + JSON.stringify((x.innerText || '').trim().slice(0, 50)));
  const opt = [...d.querySelectorAll('[data-lh-eticheta="Options..."]')].map(x => 'Options... vis=' + vis(x));
  const nf = d.querySelector('[data-lh-tinta="camp:nume_fisier"] input');
  const tip = d.querySelector('[data-lh-tinta="camp:tip_fisier"] input, [data-lh-tip="ComboBox"][data-lh-eticheta^="Files of type"] input');
  const tipText = [...d.querySelectorAll('[data-lh-tip="ComboBox"][data-lh-eticheta^="Files of type"], [data-lh-tinta="camp:tip_fisier"]')].map(x => (x.innerText || '').trim() + (x.querySelector('input') ? ' / input=' + x.querySelector('input').value : ''));
  const btn = [...d.querySelectorAll('[data-lh-tip="Button"],[data-lh-tip="SplitButton"]')].filter(vis).map(x => (x.innerText || '').trim()).filter(t => /^(Open|Save|Cancel|Don't Save|Deschidere|Options\.\.\.|Tools)$/.test(t));
  const titlu = [...d.querySelectorAll('.lh-ap-titlu-dialog, [data-lh-tip="TitleBar"]')].map(x => (x.innerText || '').trim()).filter(Boolean);
  return {sup: d.getAttribute('data-lh-suprafata'), titlu, adr, nav, lista, ctl, opt, nume_box: nf ? nf.value : null, tip: tipText, btn,
          focus: document.activeElement ? (document.activeElement.closest('[data-lh-tinta]') || {getAttribute: () => null}).getAttribute('data-lh-tinta') : null};
}"""

JS_TITLU_ECRAN = """() => { const R = document.querySelector('[data-lh-aplicatie="word"]');
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  return [...R.querySelectorAll('[data-lh-suprafata="bara_titlu"] *')].filter(b => vis(b) && b.children.length === 0 && /Word/.test(b.textContent)).map(b => b.textContent.trim()); }"""


def dlg(pg):
    return pg.evaluate(JS_DLG)


def titlu_ecran(pg):
    return pg.evaluate(JS_TITLU_ECRAN)


R = {}


def caz(nume, fn):
    try:
        R[nume] = fn()
    except Exception as e:
        R[nume] = {'EROARE': repr(e), 'tb': traceback.format_exc()[-900:]}
    print('--', nume, 'ok' if 'EROARE' not in (R[nume] if isinstance(R[nume], dict) else {}) else 'EROARE')


def scurt(pg):
    """starea + ecranul, pe scurt"""
    x = obs(pg)
    return {k: x[k] for k in ('text', 'ecran', 'nume', 'folder', 'salvate', 'fisiere', 'docs', 'titlu', 'bs', 'msg', 'dlg', 'nume_box', 'tip_box', 'tip_afisat', 'focus', 'pas', 'indicii', 'dialog')}


ORAR = ['Orarul meu', 'Luni: română, matematică, TIC']
ORAR_ANA = {'folder': 'Documente', 'nume': 'Popescu_Ana_7A_orar', 'text': ORAR}
CLUB = ['Clubul de lectură – fișa de înscriere', 'Ne întâlnim joi, după ore, în biblioteca școlii. Fiecare membru citește o carte pe lună și le povestește celorlalți despre ea.', 'Cartea pe care o propun: o carte de aventuri.', 'Numele meu:']
