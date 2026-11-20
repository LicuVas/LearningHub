# -*- coding: utf-8 -*-
"""Masuratori comune: arborele simulat al unei suprafete vs referinta (rect_css la 1366x768, factor 1)."""
import json
D='C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11'
REF=json.load(open(D+'/referinte/uia_powerpoint.json',encoding='utf-8'))
S=REF['suprafete']
JS_ARB = r"""(sel)=>{const R=document.querySelector('[data-lh-aplicatie]').getBoundingClientRect();
 const s=document.querySelector(sel); if(!s) return null; const rs=s.getBoundingClientRect();
 const vis=e=>{const cs=getComputedStyle(e);return cs.display!=='none'&&cs.visibility!=='hidden'&&e.getClientRects().length>0};
 const out=[...s.querySelectorAll('[data-lh-tip]')].map(e=>{const r=e.getBoundingClientRect();
   return {tip:e.getAttribute('data-lh-tip'),et:e.getAttribute('data-lh-eticheta'),r:[r.x-R.x,r.y-R.y,r.width,r.height].map(v=>Math.round(v*10)/10),
   vis:vis(e),txt:(e.innerText||'').trim().slice(0,60),gri:e.matches('[aria-disabled="true"],.lh-ap-gri,[data-lh-gri]')||e.getAttribute('aria-disabled')==='true',tinta:e.getAttribute('data-lh-tinta')?(e.getAttribute('data-lh-tinta')+(e.getAttribute('data-lh-id')?':'+e.getAttribute('data-lh-id'):'')):null}});
 return {root:[R.x,R.y,R.width,R.height],s:[rs.x-R.x,rs.y-R.y,rs.width,rs.height],scrollH:s.scrollHeight,clientH:s.clientHeight,ov:getComputedStyle(s).overflowY,noduri:out}}"""
def ref_noduri(cheie):
    out=[]
    def w(n):
        out.append((n.get('tip'),n.get('eticheta'),n.get('rect_css'),n.get('activ')))
        for c in n.get('copii') or []: w(c)
    w(S[cheie]); return out
def compara(cheie, m, tol=2.5):
    """m = rezultatul JS_ARB; compara pozitia absoluta si relativa la colțul suprafeței"""
    if not m: return {'eroare':'suprafata lipsa'}
    ref=ref_noduri(cheie); r0=S[cheie]['rect_css']
    sim=list(m['noduri']); folosite=set(); abs_d=[]; rel_d=[]; lipsa=[]
    for tip,et,rr,act in ref:
        if not rr or rr[2]==0: continue
        idx=None
        for i,n in enumerate(sim):
            if i in folosite: continue
            if n['tip']==tip and (n['et'] or '')==(et or ''): idx=i;break
        if idx is None: lipsa.append((tip,et)); continue
        folosite.add(idx); n=sim[idx]
        da=max(abs(a-b) for a,b in zip(n['r'],rr))
        rel=[n['r'][0]-m['s'][0],n['r'][1]-m['s'][1],n['r'][2],n['r'][3]]; rrel=[rr[0]-r0[0],rr[1]-r0[1],rr[2],rr[3]]
        dr=max(abs(a-b) for a,b in zip(rel,rrel))
        if da>tol: abs_d.append((tip,et,rr,n['r'],n['vis']))
        if dr>tol: rel_d.append((tip,et,rrel,rel,n['vis']))
    extra=[(sim[i]['tip'],sim[i]['et']) for i in range(len(sim)) if i not in folosite]
    return {'ref_rect':r0,'sim_rect':m['s'],'root':m['root'],'scroll':[m['scrollH'],m['clientH'],m['ov']],'n_ref':len(ref),'n_sim':len(sim),
            'lipsa':lipsa[:15],'n_lipsa':len(lipsa),'extra':extra[:15],'n_extra':len(extra),'abs_dif':abs_d[:8],'n_abs_dif':len(abs_d),'rel_dif':rel_d[:8],'n_rel_dif':len(rel_d)}
