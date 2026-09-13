# -*- coding: utf-8 -*-
"""Diacritice pentru cls6/lectia5-tranzitii.
Imparte original.html in bucati de 120 linii (in_NN.txt), aplica dictionarul DOAR pe textul vizibil
(+ atributele title= si data-quiz=), verifica fiecare linie (fara diacritice == original), scrie out_NN.txt si nou.html.
"""
import re
from pathlib import Path

D = Path(r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls6\lectia5-tranzitii\diacritice")
HARTA = str.maketrans("ăâîșțĂÂÎȘȚ", "aaiIstAAIST".replace("I", "i", 1)) if False else str.maketrans(
    {"ă": "a", "â": "a", "î": "i", "ș": "s", "ț": "t", "Ă": "A", "Â": "A", "Î": "I", "Ș": "S", "Ț": "T"})

# fraze decise din context (se aplica inaintea cuvintelor)
FRAZE = [
    ("inseamna ca", "înseamnă că"), ("pare ca", "pare că"), ("stii ca", "știi că"), ("semn ca", "semn că"),
    ("poti adauga", "poți adăuga"), ("poti aplica", "poți aplica"), ("poti incarca", "poți încărca"),
    ("o poti adauga", "o poți adăuga"), ("Poti adauga", "Poți adăuga"), ("Poti incarca", "Poți încărca"),
    ("este singura bifata", "este singura bifată"),
    ("Fly In", "Fly In"),
    ("fata de", "față de"), ("nicio diferenta", "nicio diferență"), ("ce diferenta", "ce diferență"), ("Ce tasta", "Ce tastă"), ("pentru a aplica", "pentru a aplica"), ("de scena", "de scenă"),
]

W = """
in:în In:În si:și sa:să Sa:Să
lectie:lecție lectiei:lecției Lectia:Lecția lectia:lecția
Inapoi:Înapoi urmatoare:următoare Urmatoarea:Următoarea urmatorul:următorul
Invatare:Învățare Atomica:Atomică Tranzitii:Tranziții tranzitii:tranziții INTREGI:ÎNTREGI intregi:întregi
intre:între INTRE:ÎNTRE Tranzitie:Tranziție tranzitie:tranziție tranzitia:tranziția Tranzitia:Tranziția
tranzitiei:tranziției tranzitiile:tranzițiile Tranzitiile:Tranzițiile tranzitiilor:tranzițiilor
schimba:schimbă neasteptat:neașteptat nepregatita:nepregătită amatorica:amatorică
Dupa:După dupa:după aceasta:această automata:automată Automata:Automată numar:număr numarul:numărul Numarul:Numărul
manuala:manuală aceeasi:aceeași ACEEASI:ACEEAȘI aceleasi:aceleași acelasi:același consistenta:consistență Consistenta:Consistența
diferentiezi:diferențiezi animatii:animații Animatii:Animații animatiile:animațiile Animatiile:Animațiile
animatie:animație animatia:animația Incearca:Încearcă incearca:încearcă incerci:încerci incercat:încercat
Adauga:Adaugă adauga:adaugă Inainte:Înainte INAINTE:ÎNAINTE invatam:învățăm invatat:învățat
arata:arată urmeaza:urmează fisierul:fișierul fisier:fișier tau:tău creeaza:creează noua:nouă
stanga:stânga stang:stâng romana:română romanesti:românești pictograma:pictogramă numeste:numește
Apasa:Apasă apasa:apasă sageti:săgeți sageata:săgeata Copiaza:Copiază Diferenta:Diferența diferenta:diferența
afecteaza:afectează Afecteaza:Afectează gasesti:găsești vad:văd mica:mică
misca:mișcă putin:puțin da:dă prezentarii:prezentării Prezentarii:Prezentării optional:opțional
pasioneaza:pasionează inteleg:înțeleg principala:principală exista:există impreuna:împreună
Cate:Câte cate:câte fara:fără Fara:Fără limita:limită singura:singură aplicata:aplicată
Continut:Conținut continut:conținut Continutul:Conținutul continutul:conținutul continutului:conținutului
Definitie:Definiție controleaza:controlează Controleaza:Controlează viata:viața Imagineaza-ti:Imaginează-ți
schimbarile:schimbările povestii:poveștii prezentari:prezentări Prezentari:Prezentări
profesionala:profesională Foloseste:Folosește foloseste:folosește folosesti:folosești amatoriceste:amatoricește
recomandata:recomandată estompeaza:estompează impinge:împinge afara:afară roteste:rotește mareste:mărește
organizeaza:organizează engleza:engleză cauta:caută atentia:atenția descopera:descoperă
Cand:Când cand:când CAND:CÂND scoala:școală scolara:școlară conferinte:conferințe fetele:fețele
rastoarna:răstoarnă pagina:pagină ramane:rămâne raman:rămân simpla:simplă intra:intră miscarea:mișcarea
aleasa:aleasă Daca:Dacă daca:dacă speciala:specială muta:mută doua:două muti:muți
Rezerva-le:Rezervă-le incepători:începători Incepe:Începe functioneaza:funcționează
placut:plăcut placuta:plăcută Sterge:Șterge Aplica:Aplică aplica:aplică aplica-o:aplică-o Porneste:Pornește porneste:pornește
curenta:curentă dureaza:durează directiei:direcției Cat:Cât cat:cât prezentarilor:prezentărilor
Directia:Direcția directia:direcția Poti:Poți poti:poți perfecta:perfectă Directie:Direcție
secunda:secundă evita:evită Evita:Evită fluida:fluidă combinatie:combinație Combinatie:Combinație
folosesti:folosești Intotdeauna:Întotdeauna prezentarile:prezentările Niciodata:Niciodată bifata:bifată
Dezactiveaza:Dezactivează ruleaza:rulează Ruleaza:Rulează necesita:necesită expozitii:expoziții expozitie:expoziție
ORICAND:ORICÂND demonstratii:demonstrații Selecteaza:Selectează selecteaza:selectează bifeaza:bifează
nesfarsit:nesfârșit setari:setări regula:regulă Multi:Mulți uita:uită amandoua:amândouă grabeste:grăbește
adevarata:adevărată numaratoarea:numărătoarea Numaratoarea:Numărătoarea termina:termină asteapta:așteaptă pana:până
inceput:început esti:ești pozitionat:poziționat opreste:oprește Opreste:Oprește setarile:setările comanda:comandă
Seteaza:Setează seteaza:setează dorita:dorită completata:completată rapida:rapidă langa:lângă
Actiune:Acțiune Exercitii:Exerciții Exercitiul:Exercițiul Exercitiu:Exercițiu imi:îmi realizari:realizări
Incheiere:Încheiere incheiere:încheiere Multumesc:Mulțumesc observa:observă Observa:Observă intreaba:întreabă
Salveaza:Salvează campul:câmpul primeasca:primească urmareste:urmărește miniatura:miniatură steluta:steluță
Testeaza:Testează Experimenteaza:Experimentează diferentele:diferențele Schimba:Schimbă compara:compară
Dubleaza:Dublează fa:fă potrivita:potrivită parea:părea aiba:aibă alunecand:alunecând pozitii:poziții
brusca:bruscă celalalt:celălalt discretia:discreția conteaza:contează decat:decât
performanta:performanță Construieste:Construiește construieste-l:construiește-l forma:formă
redimensioneaza:redimensionează lina:lină explica:explică reflectie:reflecție Reflectie:Reflecție reflectia:reflecția
vazut:văzut Comparatie:Comparație lista:listă Anima:Animă randurile:rândurile Verifica:Verifică
avanseze:avanseze Corecteaza:Corectează avanseaza:avansează utila:utilă Noteaza:Notează raspunsurile:răspunsurile
Schita:Schița facut:făcut ceruta:cerută debifeaza:debifează pozitiile:pozițiile astepti:aștepți ramase:rămase
lasi:lași Nota:Notă finala:finală astazi:astăzi opreste-te:oprește-te jumatate:jumătate
gandit:gândit complexa:complexă totusi:totuși taietura:tăietură nevazute:nevăzute lasa:lasă curga:curgă
stridenta:stridentă SCHIMBA:SCHIMBĂ inseamna:înseamnă trecuta:trecută toata:toată panglica:panglică Continua:Continuă cunostintele:cunoștințele
"""
CUV = dict(p.split(":", 1) for p in W.split())

TOK = re.compile(r"(?<![A-Za-z0-9_ăâîșțĂÂÎȘȚ])[A-Za-zăâîșțĂÂÎȘȚ][A-Za-zăâîșțĂÂÎȘȚ\-]*(?![A-Za-z0-9_ăâîșțĂÂÎȘȚ])")


def fa_text(s):
    # fraze intai, cu placeholder ca sa nu mai fie atinse de cuvinte
    hold = []
    for a, b in FRAZE:
        def rep(m, b=b):
            hold.append(b)
            return f"\x00{len(hold)-1}\x01"
        s = re.sub(r"(?<![A-Za-z0-9_])" + re.escape(a) + r"(?![A-Za-z0-9_])", rep, s)

    def w(m):
        t = m.group(0)
        if t in CUV:
            return CUV[t]
        # cuvinte cu cratima: incearca partile (ex. stanga-dreapta)
        if "-" in t and t not in CUV:
            parts = t.split("-")
            return "-".join(CUV.get(p, p) for p in parts)
        return t
    s = TOK.sub(w, s)
    return re.sub("\x00(\\d+)\x01", lambda m: hold[int(m.group(1))], s)


def proceseaza(html):
    out = []
    # zone protejate: comentarii, script, style, title, code, pre, kbd
    prot = re.compile(r"(?s)<!--.*?-->|<(script|style|title|code|pre|kbd)\b[^>]*>.*?</\1>|<[^>]+>")
    poz = 0
    for m in prot.finditer(html):
        out.append(fa_text(html[poz:m.start()]))
        seg = m.group(0)
        if seg.startswith("<") and not seg.startswith("<!--") and m.group(1) is None:
            # tag: doar valorile title= si data-quiz= (si alt/aria-label)
            seg = re.sub(r'''(\b(?:title|alt|aria-label)=")([^"]*)(")''', lambda a: a.group(1) + fa_text(a.group(2)) + a.group(3), seg)
            seg = re.sub(r"""(\bdata-quiz=')([^']*)(')""", lambda a: a.group(1) + fa_text(a.group(2)) + a.group(3), seg)
        out.append(seg)
        poz = m.end()
    out.append(fa_text(html[poz:]))
    return "".join(out)


orig = (D / "original.html").read_text(encoding="utf-8")
lines = orig.splitlines(keepends=True)
for i in range(0, len(lines), 120):
    (D / f"in_{i//120+1:02d}.txt").write_text("".join(lines[i:i+120]), encoding="utf-8", newline="")
nou = proceseaza(orig)
nl = nou.splitlines(keepends=True)
assert len(nl) == len(lines)
for k, (a, b) in enumerate(zip(nl, lines), 1):
    assert a.translate(HARTA) == b.translate(HARTA), f"linia {k} difera in altceva"
for i in range(0, len(nl), 120):
    (D / f"out_{i//120+1:02d}.txt").write_text("".join(nl[i:i+120]), encoding="utf-8", newline="")
(D / "nou.html").write_text(nou, encoding="utf-8", newline="")
# raport: cuvinte ramase fara diacritice in textul vizibil, pentru revizie
rest = {}
vis = re.sub(r"(?s)<!--.*?-->|<(script|style|title|code|pre|kbd)\b[^>]*>.*?</\1>", " ", nou)
vis = re.sub(r"data-quiz='([^']*)'", lambda m: ">" + m.group(1) + "<", vis)
vis = re.sub(r"<[^>]+>", " ", vis)
for t in TOK.findall(vis):
    if not re.search("[ăâîșțĂÂÎȘȚ]", t):
        rest[t] = rest.get(t, 0) + 1
(D / "ramase.txt").write_text(" ".join(sorted(rest)), encoding="utf-8")
print("ok", len(nl), "linii; cuvinte ramase unice:", len(rest))
