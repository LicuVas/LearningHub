"""Genereaza spec_NN.txt dintr-o harta de cuvinte/fraze aplicata DOAR pe textul citit de elev
(noduri text + data-quiz), sarind <title>, <script>, <style>, <code>, <pre>, <kbd>, comentarii, alte atribute.
Apoi build.py verifica fiecare rand. Afiseaza diff la nivel de cuvant pentru revizuire."""
import re
from pathlib import Path

D = Path(r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls8\lectia7-sortare\diacritice")
CH = 120

W = {
 # fraze contextuale (inaintea cuvintelor)
 "o coloana noua": "o coloană nouă", "noua coloana": "noua coloană",
 "o coloana": "o coloană", "dintr-o coloana": "dintr-o coloană", "ce coloana": "ce coloană",
 "fiecare coloana": "fiecare coloană", "de coloana": "de coloană", "singura coloana": "singură coloană",
 "vs coloana": "vs coloană", "o celula": "o celulă", "orice celula": "orice celulă", "celula DIN": "celulă DIN",
 "Selectie celula": "Selecție celulă", "celula activa": "celula activă", "o regula": "o regulă",
 "prima grupa": "prima grupă", "prima nota": "prima notă", "ce fila": "ce filă",
 "pentru ca Undo": "pentru că Undo", "pentru ca fiecare": "pentru că fiecare", "recunoaste ca,": "recunoaște că,",
 "numarul sau": "numărul său", "nume, nota, clasa": "nume, notă, clasă", "dupa clasa SI nota": "după clasă ȘI notă",
 "dupa clasa,": "după clasă,", "dupa nota.": "după notă.", "sortate dupa nota": "sortate după notă",
 "o data": "o dată", "Nivel performanta": "Nivel performanță", "coloana numerica": "coloana numerică",
 "Practica profesionala": "Practica profesională", "Sortarea simpla": "Sortarea simplă", "o singura": "o singură",
 "SI inchis": "ȘI închis", "intr-o celula": "într-o celulă", "intr-o coloana": "într-o coloană",
 # cuvinte
 "Invatare": "Învățare", "Atomica": "Atomică", "dupa": "după", "in": "în", "lectie": "lecție", "lectiei": "lecției",
 "Lectia": "Lecția", "sa": "să", "si": "și", "mica": "mică", "acelasi": "același", "aceleasi": "aceleași",
 "aceeasi": "aceeași", "aceleiasi": "aceleiași", "fara": "fără", "muti": "muți", "rand": "rând", "randul": "rândul",
 "randuri": "rânduri", "randurile": "rândurile", "randurilor": "rândurilor", "aceasta": "această", "utila": "utilă",
 "crescatoare": "crescătoare", "descrescatoare": "descrescătoare", "crescator": "crescător", "descrescator": "descrescător",
 "folosesti": "folosești", "importanta": "importanța", "selectiei": "selecției", "partiale": "parțiale",
 "Incearca": "Încearcă", "INCEARCA": "ÎNCEARCĂ", "Testeaza": "Testează", "inainte": "înainte", "inveti": "înveți",
 "urmeaza": "urmează", "pasii": "pașii", "pasi": "pași", "Ordoneaza": "Ordonează", "fisier": "fișier", "fisierul": "fișierul",
 "fisierului": "fișierului", "Gaseste": "Găsește", "Apasa": "Apasă", "apasa": "apasă", "intampla": "întâmplă",
 "sageata": "săgeata", "dubla": "dublă", "Inchide": "Închide", "doua": "două", "revina": "revină",
 "initiala": "inițială", "initiale": "inițiale", "initial": "inițial", "adauga": "adaugă", "intr-un": "într-un",
 "intr-o": "într-o", "Elimina": "Elimină", "contin": "conțin", "Reordoneaza": "Reordonează", "reordoneaza": "reordonează",
 "Calculeaza": "Calculează", "selectata": "selectată", "Modifica": "Modifică", "continutul": "conținutul",
 "raman": "rămân", "schimba": "schimbă", "afisate": "afișate", "Imagineaza-ti": "Imaginează-ți", "carti": "cărți",
 "cartile": "cărțile", "vizita": "vizită", "logica": "logică", "operatie": "operație", "intregul": "întregul",
 "muta": "mută", "impreuna": "împreună", "gasesti": "găsești", "Gasesti": "Găsești", "optiunile": "opțiunile",
 "Optiunile": "Opțiunile", "optiuni": "opțiuni", "optiunea": "opțiunea", "contine": "conține", "functii": "funcții",
 "gasesc": "găsesc", "romana": "română", "directa": "directă", "Cand": "Când", "cand": "când", "il": "îl", "ii": "îi",
 "pictograma": "pictogramă", "Sorteaza": "Sortează", "sorteaza": "sortează", "activa": "activă", "stie": "știe",
 "apesi": "apeși", "afla": "află", "dorita": "dorită", "apasa": "apăsa", "ramane": "rămâne", "detecteaza": "detectează",
 "simpla": "simplă", "exacti": "exacți", "realizeaza": "realizează", "Actiune": "Acțiune", "actiune": "acțiune",
 "actiunile": "acțiunile", "protejeaza": "protejează", "Daca": "Dacă", "daca": "dacă", "recunoaste": "recunoaște",
 "totusi": "totuși", "bifeaza": "bifează", "Atentie": "Atenție", "atentie": "atenție", "Selectia": "Selecția",
 "partiala": "parțială", "toata": "toată", "lasand": "lăsând", "greseala": "greșeală", "avertizeaza": "avertizează",
 "verifica": "verifică", "Verifica": "Verifică", "cunoscuti": "cunoscuți", "intai": "întâi", "fiecarei": "fiecărei",
 "cate": "câte", "separati": "separați", "decat": "decât", "ierarhica": "ierarhică", "inaintea": "înaintea",
 "alfabetica": "alfabetică", "Alfabetica": "Alfabetică", "campurile": "câmpurile", "facut": "făcut", "obtii": "obții",
 "Stergi": "Ștergi", "anuleaza": "anulează", "sortarii": "sortării", "distructiva": "distructivă", "Exista": "Există",
 "anterioara": "anterioară", "cat": "cât", "modificari": "modificări", "inchizi": "închizi", "Necesita": "Necesită",
 "facuta": "făcută", "facute": "făcute", "Profesionistii": "Profesioniștii", "intotdeauna": "întotdeauna",
 "inceputul": "începutul", "inceput": "început", "originala": "originală", "oricand": "oricând", "continut": "conținut",
 "Numerica": "Numerică", "acopera": "acoperă", "alaturi": "alături", "interfata": "interfață", "Exercitii": "Exerciții",
 "Exercitiul": "Exercițiul", "exercitiu": "exercițiu", "Cerinta": "Cerința", "Construieste": "Construiește",
 "construieste": "construiește", "sorteaza-l": "sortează-l", "obtinuta": "obținută", "intors": "întors",
 "Raspunsuri": "Răspunsuri", "asteptate": "așteptate", "oara": "oară", "inversa": "inversă", "alta": "altă",
 "intre": "între", "sortari": "sortări", "alternand": "alternând", "Insereaza": "Inserează", "fata": "fața",
 "adaugat": "adăugat", "coboara": "coboară", "acestia": "aceștia", "pastreaza": "păstrează", "Analizeaza": "Analizează",
 "explica": "explică", "Raspunde": "Răspunde", "intrebarile": "întrebările", "Pret": "Preț", "pret": "preț",
 "inchis": "închis", "Schita": "Schița", "raspunsul": "răspunsul", "identifica": "identifică", "inseamna": "înseamnă",
 "gandeste-te": "gândește-te", "aplica": "aplică", "enumera": "enumeră", "diferenta": "diferența",
 "desperecheaza": "desperechează", "gresesti": "greșești", "functioneaza": "funcționează", "ajuta": "ajută",
 "inca": "încă", "foloseste": "folosește", "ceruta": "cerută", "solutia": "soluția", "inchidere": "închidere",
 "exista": "există", "exacta": "exactă", "invatat": "învățat", "astazi": "astăzi", "inteles": "înțeles",
 "Incepator": "Începător", "normala": "normală", "ordoneaza": "ordonează", "gresit": "greșit", "Cauta": "Caută",
 "defineste": "definește", "corecta": "corectă", "pozitia": "poziția", "ramana": "rămână", "legata": "legată",
 "sta": "stă", "oricarei": "oricărei", "invatata": "învățată", "varsta": "vârstă", "urmatoare": "următoare",
 "Continua": "Continuă", "In": "În", "Dupa": "După", "Sa": "Să", "Randul": "Rândul", "Aceasta": "Această",
 "intregul": "întregul", "Inainte": "Înainte", "Aceleasi": "Aceleași", "Adauga": "Adaugă", "Adaugi": "Adaugi",
 "Metoda": "Metoda",
}
# 'apasa' apare de doua ori in harta (imperativ 'apasă' vs infinitiv 'a apăsa'): tratat prin fraza
W["a apasa"] = "a apăsa"
W["apasa"] = "apasă"

keys = sorted(W, key=len, reverse=True)
pat = re.compile(r"(?<![\w-])(" + "|".join(re.escape(k) for k in keys) + r")(?![\w])")

def fix(text):
    return pat.sub(lambda m: W[m.group(1)], text)

src = (D / "original.html").read_bytes().decode("utf-8")
lines = src.splitlines(keepends=True)
TOKEN = re.compile(r"(<!--.*?-->|<(title|script|style|code|pre|kbd)\b[^>]*>.*?</\2>|<[^>]+>)", re.S)

def process_line(line):
    out = []
    pos = 0
    for m in TOKEN.finditer(line):
        out.append(fix(line[pos:m.start()]))
        tag = m.group(0)
        if tag.startswith("<") and "data-quiz=" in tag:
            tag = re.sub(r'(data-quiz=")([^"]*)(")', lambda q: q.group(1) + fix(q.group(2)) + q.group(3), tag)
        out.append(tag)
        pos = m.end()
    out.append(fix(line[pos:]))
    return "".join(out)

SKIP = set(range(1, 12)) | set(range(256, 280))  # head + scripturi
specs = {}
for i, line in enumerate(lines, 1):
    if i in SKIP:
        continue
    body = line.rstrip("\r\n")
    new = process_line(body)
    if new != body:
        nn = (i - 1) // CH + 1
        specs.setdefault(nn, []).append(f"{i}|{new.lstrip(' \t')}")
        ow, nw = body.split(), new.split()
        ch = [f"{a}->{b}" for a, b in zip(ow, nw) if a != b]
        print(i, " ".join(ch))
for nn in range(1, (len(lines) + CH - 1) // CH + 1):
    (D / f"spec_{nn:02d}.txt").write_bytes("\n".join(specs.get(nn, [])).encode("utf-8"))
