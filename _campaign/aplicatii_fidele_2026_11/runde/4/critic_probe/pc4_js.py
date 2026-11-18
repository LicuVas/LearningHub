# -*- coding: utf-8 -*-
JS_TITLU_ECRAN = """() => { const R = document.querySelector('[data-lh-aplicatie="word"]');
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  return [...R.querySelectorAll('[data-lh-tip="Button"]')].filter(b => vis(b) && /Word/.test(b.innerText)).map(b => b.innerText.trim() + ' | ' + b.getAttribute('data-lh-eticheta')); }"""
