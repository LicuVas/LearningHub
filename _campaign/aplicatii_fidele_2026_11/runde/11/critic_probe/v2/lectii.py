import re,sys
W='C:/00/Projects/LearningHub_fidel/'
pag=['lectii/vi/m1-l02','lectii/vi/m1-l03','lectii/vi/m1-l05','lectii/vi/m1-l06','lectii/vi/m1-l07','lectii/vi/m2-l08','lectii/vi/m2-l09','lectii/vi/m2-l10','jocuri/prezentari-vi']
kw=re.compile(r"(Font Color|This Device|Pictures|Close|Închide|Ctrl\+[NOWSZYCVXM]|Save As|Format Background|Animation Pane|Apply To All|Apply to All|From Beginning|Layout|Insert Table|Table|Design|Transitions|Animations|Bold|Italic|Underline|Font Size|Duplicate|Delete Slide|Esc)")
for p in pag:
    t=open(W+p+'/index.html',encoding='utf-8').read()
    t=re.sub(r'<[^>]+>',' ',t); t=re.sub(r'\s+',' ',t)
    seen=set(); out=[]
    for m in kw.finditer(t):
        s=t[max(0,m.start()-110):m.end()+110]
        key=m.group(0)+s[100:140]
        if m.group(0) in seen and len([o for o in out if o[0]==m.group(0)])>=2: continue
        seen.add(m.group(0)); out.append((m.group(0),s))
    print('=====',p,len(t))
    for k,s in out: print(' ['+k+']',s)
