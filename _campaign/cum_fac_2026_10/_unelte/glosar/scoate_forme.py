import json
p=r'C:/00/Projects/LearningHub/cum-fac/_sursa/termeni.json'
t=json.load(open(p,encoding='utf-8')); n=0
for x in t:
    if x['t']=='filă' and 'file' in x['forme']: x['forme'].remove('file'); n+=1
    if x['t']=='format de fișier':
        for f in ('format','formate'):
            if f in x['forme']: x['forme'].remove(f); n+=1
json.dump(t,open(p,'w',encoding='utf-8'),ensure_ascii=False,indent=1); print('forme scoase',n)
