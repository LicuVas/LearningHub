import json,glob,re,sys
P='C:/00/Projects/LearningHub/cum-fac/_sursa/termeni.json'
g=json.load(open(P,encoding='utf8'))
orig=len(g)
ch=set()

def find(t,ap=None):
    r=[e for e in g if e['t']==t and (ap is None or e['aplicatii']==ap)]
    assert len(r)==1,(t,ap,len(r))
    return r[0]

def setap(t,ap,cur=None,d=None):
    e=find(t,cur); e['aplicatii']=ap
    if d: e['d']=d
    ch.add(t)

setap('fereastră',[])
setap('folder',[])
setap('browser',[])
setap('Descărcări',[])
setap('cursor',['word','powerpoint'])
setap('pictogramă',[])
setap('bara de activități',['windows','word'])
setap('butonul Start',['windows','word'])
setap('Recente',['word','powerpoint'])
setap('.docx',['word','windows'])
setap('UTF-8',['web','excel'])
setap('a copia',[],d='a pune același lucru și în alt loc, iar originalul rămâne unde era')
setap('a insera',[],d='a pune un obiect nou în document, în foaie sau pe diapozitiv')
setap('editare',[],d='orice schimbare în document sau în prezentare: adaugi, copiezi, muți, ștergi')
setap('vizualizare',[],d='un fel de a privi același fișier: Normal, Sortare diapozitive, Aspect pagină imprimată…')
setap('operație',['word','excel'])
setap('ghilimelele românești',['word','excel'])
setap('format imagine',['word','powerpoint'])
setap('fundal',[])
setap('ghilimele drepte',['excel','web'],d='semnul " pus în jurul unui text, de exemplu în formulă: "promovat"')
setap('chenar',[],d='linia din jurul unui obiect (celulă, poză, casetă); la o casetă din PowerPoint: punctat = scrii în casetă, plin = ai ales toată caseta')
setap('rând',[],d='căsuțele sau literele așezate de-a latul, de la stânga la dreapta; rândurile se numără în jos (într-un tabel, într-o foaie, într-o listă)')
setap('coloană',[],d='căsuțele de sus în jos; coloanele se numără spre dreapta (în Excel au litere: A, B, C…)')
setap('tabel',['word','powerpoint','excel'])
setap('filă',['web','windows'],cur=['web'],d='partea de sus a ferestrei, cu numele fișierului sau al paginii; ● pe ea = modificări nesalvate')
setap('bara de adresă',['windows','web'],d='bara de sus din Explorer sau din browser: arată unde ești (calea sau adresa paginii)')

# prunari de forme
def prune(t,ap,scoate):
    e=find(t,ap); e['forme']=[f for f in e['forme'] if f not in scoate]; ch.add(t)
prune('adresa celulei',['excel'],{'adresa','adrese','adresei'})
prune('margini',['word'],{'marginea'})
prune('pt (puncte)',['word','powerpoint'],{'puncte'})
prune('formă',['powerpoint'],{'forma','forme'})
prune('zona de note',['powerpoint'],{'note','notele','notelor'})
e=find('semnele ¶'); e['t']='semnele de paragraf ¶'; e['forme']=['semne ascunse','semnele de paragraf']; ch.add('semnele ¶')
e=find('punctul ●'); e['t']='punctul ● de pe filă'; e['forme']=['modificari nesalvate']; ch.add('punctul ●')
e=find('cale',['windows']); e['t']='calea unui fișier'; e['forme']=['calea','caile','calea fisierului','calea folderului']; ch.add('cale')
e=find('text',['excel']); e['t']='text în celulă'; e['forme']=['text in celula','textul din celula','texte in celule','textele din celule']; ch.add('text')
e=find('note',['powerpoint']); e['t']='notele (Notes)'; e['forme']=['notes','notele diapozitivului']; ch.add('note')

# intrari noi
def nou(t,forme,ap,d,cale,pas,ancora):
    g.append({'t':t,'forme':forme,'aplicatii':ap,'d':d,'sursa':{'cale':cale,'pas':pas,'ancora':ancora}}); ch.add('+'+t)

nou('antet de tabel',['antet','antetul','antetului','cap de tabel','capul de tabel','rand antet'],['excel','word'],
    'primul rând al tabelului, cel cu numele coloanelor','lectii/vii/m1-l07/','p4',
    'Bifa Header Row (Rând antet), în stânga filei, face primul rând, cel cu numele coloanelor, să arate altfel:')
nou('aspect',['aspect','aspectul','aspecte','aspectele','aspectului','layout'],['excel','word'],
    'felul în care e așezată pagina sau poza: pagina ca la imprimantă, textul lângă poză','lectii/vii/m1-l03/','p6',
    'Aspect pagină imprimată (Print Layout), pagina ca la imprimantă;')
nou('umplere',['umplere','umplerea','umplerii'],['excel'],
    'culoarea din interiorul celulei (găleata Fill Color)','lectii/viii/m1-l06/','p5',
    'Culoare de umplere (Fill Color), butonul cu găleată de lângă el, colorează fundalul celulei.')
nou('etichete de date',['eticheta','etichete','etichetele','etichetei','etichetelor'],['excel'],
    'numerele scrise pe grafic, lângă fiecare coloană sau punct','lectii/viii/m2-l11/','p6',
    'Etichetele de date sunt numerele scrise pe grafic, lângă fiecare coloană sau punct.')
nou('încadrare text (Wrap Text)',['incadrare text','incadrarea textului','incadrarea'],['excel'],
    'un text lung stă pe mai multe rânduri, în aceeași celulă','lectii/viii/m1-l06/','p4',
    'Un text lung îl așezi pe mai multe rânduri, în aceeași celulă, cu Încadrare text (Wrap Text):')
nou('sortare diapozitive',['sortare','sortarea'],['powerpoint'],
    'vizualizarea cu toate diapozitivele mici, ca să le vezi dintr-o privire','lectii/vi/m1-l02/','p6',
    'Mihai apasă Sortare diapozitive (patru pătrățele) și vede toate cele 7 diapozitive.')
nou('previzualizare (Preview)',['previzualizare','previzualizarea','preview'],['powerpoint'],
    'butonul care îți arată din nou efectul pus pe diapozitiv','lectii/vi/m1-l07/','p3',
    'Previzualizare (Preview), primul buton din stânga filei, îți arată din nou efectul.')
nou('fontul de corp (Body)',['body','corp','corpul'],['powerpoint'],
    'fontul pentru restul textului, nu pentru titluri','lectii/vi/m2-l08/','p2',
    'al doilea, cu (Body), pentru text;')
nou('zona de lucru',['zona','zone','zonele'],['powerpoint'],
    'diapozitivul ales, mare, în mijlocul ferestrei; acolo lucrezi','lectii/vi/m1-l02/','p4',
    'Clic pe o miniatură și diapozitivul ei apare mare; zona de lucru, în mijloc:')
nou('zona de notificare',['zona','zone','zonele'],['windows'],
    'colțul din dreapta al barei de activități, cu ceasul, data și pictograme mici','lectii/v/m2-l08/','p3',
    'În dreapta e zona de notificare, cu ceasul, data și câteva pictograme mici, de exemplu cea a sunetului.')
nou('zona albă',['zona','zone','zonele'],['web'],
    'partea albă a Notepad, unde scrii','lectii/viii/m2-l14/','p4',
    'zona albă, unde scrii;')
nou('grupul de butoane',['grup','grupul','grupuri','grupurile'],['windows'],
    'butoanele așezate la un loc pe bara de activități','lectii/v/m2-l08/','p4',
    'Pe Windows 11 e primul din grupul de butoane din mijlocul barei.')
nou('foaie (de scris)',['foaie','foaia','foi','foii','foile','foilor'],['word','windows'],
    'coala albă pe care scrii sau desenezi, ca hârtia','lectii/vii/m1-l02/','p4',
    'Cursorul e vârful creionului pus pe foaie:')

# validare
strange=lambda s:re.sub(r'\s+',' ',str(s or '')).strip()
dig={}
for p in glob.glob('C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/digest/*.json'):
    if p.replace('\\','/').split('/')[-1].startswith('_'): continue
    d=json.load(open(p,encoding='utf8')); dig[d['cale']]=d
def textpas(cale,pas):
    d=dig.get(cale.rstrip('/')+'/') or dig.get(cale)
    if not d: return None
    x=[p for p in d['pasi'] if p['id']==pas]
    if not x: return None
    p=x[0]
    return strange(' '.join([p['titlu'],p['text'],p['uite_cum'],p['altfel']]+[y for i in (p.get('incearca') or []) for y in (i.get('cerinta',''),i.get('ajutor',''),i.get('de_ce',''))]))
bad=0
for e in g:
    s=e['sursa']; t=textpas(s['cale'],s['pas'])
    if t is None or strange(s['ancora']) not in t:
        print('ANCORA NU APARE:',e['t'],s['cale'],s['pas']); bad+=1
print('intrari',orig,'->',len(g),'schimbate',len([c for c in ch if not c.startswith('+')]),'noi',len([c for c in ch if c.startswith('+')]),'ancore rele',bad)
if '--scrie' in sys.argv and bad==0:
    json.dump(g,open(P,'w',encoding='utf8',newline='\n'),ensure_ascii=False,indent=1)
    print('scris')
