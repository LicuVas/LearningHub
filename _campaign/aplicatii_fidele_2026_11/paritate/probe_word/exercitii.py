# Rezumă, pe fiecare exercițiu Word din paginile vechi, ce câmpuri de verificare folosește (pentru inventarul de paritate).
import re, sys, json
S = 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/paritate/proba_src/'
pag = ['lectii/vii/m1-l02','lectii/vii/m1-l03','lectii/vii/m1-l04','lectii/vii/m1-l05','lectii/vii/m1-l06','lectii/vii/m1-l07',
       'lectii/vii/m2-l08','lectii/vii/m2-l09','lectii/vii/m2-l10']
CHEI = r"(foloseste:'[a-z]+'|pil:(?:true|false)|rigle:(?:true|false)|zoom:\d+|qat:(?:true|false)|fila:'\w+'|lans:'\w+'|zona:'\w+'|cuvinte:\d+|cursorFinal|cursorPar|selectat:|sters:|tip:'(?:text|poza|tabel)'|\bb:1|\bi:1|\bu:1|font:'[^']+'|sz:\d+|col:'[^']+'|\bal:'\w+'|\bst:[\d.]+|\bdr:[\d.]+|prim:[-\d.]+|rand:[\d.]+|inainte:\d+|dupa:\d+|wrap:'?\w+|wmin|hmin|prop:true|stil:'[^']+'|antet:|benzi|prima:|incape|col:\d|\bor:'\w+'|\bm:\{|hartie:'\w+'|\blat:|inalt:|fara:'\w+'|fara:\[|paragraf:'|paragrafe:\d|fonturiDe|fmt:\{|tinta:true|textPastrat|previzualizare|pagini:\d|textulNeschimbat|doar:true|fisier:\{|fara:\{|neschimbat:|activ:\{|activNou|docuri:|word:'\w+'|vedere:'\w+'|zoom:\[|pv:false|modificat:false|fost:'\w+'|scris:|jurnal:\{[^}]*\}|salvatNume|restul:|stil:\{)"
for p in pag:
    t = open(S + p + '/index.html', encoding='utf-8').read()
    poz = [m.start() for m in re.finditer(r"t:'(word|proba)[a-z]*'", t)]
    for k, a in enumerate(poz):
        b = poz[k + 1] if k + 1 < len(poz) else len(t)
        bucata = t[a:b]
        tip = re.match(r"t:'(\w+)'", bucata).group(1)
        linie = t.count('\n', 0, a) + 1
        ch = sorted(set(re.findall(CHEI, bucata)))
        print(f"{p}:{linie} {tip} | " + ' '.join(ch)[:400])
