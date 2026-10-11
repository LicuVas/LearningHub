p=r'C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/_unelte/m2/reglaj_3/mod.mjs'
s=open(p,encoding='utf8').read()
rep=[
("['sortez fișierele', 'aranjez fișierele', 'ordonez fișierele', 'fișierele după', 'folderele după', 'sort by', 'cel mai nou primul']","['sortez fișierele', 'aranjez fișierele', 'ordonez fișierele', 'cel mai nou primul']"),
("['mute', 'fără sonor', 'sonorul',","['fără sonor', 'sonorul',"),
("['tabel', 'tabelul', 'tabele', 'table'],","['tabel', 'tabelul', 'tabele'],"),
("'prea încet', 'prea tare', 'volum']","'prea încet', 'prea tare']"),
("'cu numele fiecăruia', 'pentru fiecare elev');","'cu numele fiecăruia');"),
]
for a,b in rep:
    assert a in s, a[:50]
    s=s.replace(a,b)
open(p,'w',encoding='utf8').write(s)
print('ok')
