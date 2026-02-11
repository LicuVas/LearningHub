#!/usr/bin/env python3
"""Fix placeholder practice exercises in cls7/extra-baze-date/ (5 files)."""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
import re
from pathlib import Path

BASE = Path(__file__).parent.parent / "content" / "tic" / "cls7" / "extra-baze-date"

REPLACEMENTS = {
    "lectia1-ce-sunt-bd.html": {
        "ex1_title": "Gandeste in baze de date",
        "ex1_prompt": "Gandeste-te la o biblioteca scolara cu sute de carti:",
        "ex1_questions": [
            "Cum ar organiza bibliotecara cartile fara un computer? Ce probleme ar aparea?",
            "Ce informatii despre fiecare carte ar trebui salvate intr-o baza de date? (minim 5)",
            "Cum ar gasi un elev rapid o carte despre dinozauri daca biblioteca are 2000 de carti?",
        ],
        "ex2_scenario": "Profesorul vrea sa tina evidenta notelor pentru 30 de elevi la 5 materii. Care e cea mai buna metoda?",
        "ex2_options": [
            ("a", "Un caiet cu tabele desenate manual"),
            ("b", "Un fisier Excel cu un singur tabel mare"),
            ("c", "O baza de date cu tabele separate pentru elevi, materii si note"),
        ],
        "ex2_correct": "c",
        "ex2_explanation": "O baza de date cu tabele separate permite cautare rapida, evita repetitiile si poate gestiona mii de inregistrari fara erori.",
        "ex3_prompt": "Descrie un sistem real care foloseste baze de date (ex: aplicatia de note de la scoala, Facebook, un magazin online). Explica ce date stocheaza si de ce nu ar merge fara o baza de date.",
        "ex3_hints": [
            "Alege un exemplu concret pe care il folosesti zilnic",
            "Mentioneaza cel putin 3 tipuri de date stocate",
            "Explica ce s-ar intampla daca datele s-ar pierde",
        ],
        "ex3_keywords": "baza de date, organizare, cautare, stocare, informatii structurate",
    },
    "lectia2-tabele.html": {
        "ex1_title": "Proiecteaza un tabel",
        "ex1_prompt": "Imaginati-va ca faceti o baza de date pentru o florarie online:",
        "ex1_questions": [
            "Ce coloane (campuri) ar avea tabelul 'Flori'? Scrie minim 5 coloane cu tipul lor.",
            "De ce nu e bine sa punem adresa clientului si comanda in acelasi tabel cu florile?",
            "Deseneaza pe caiet un tabel 'Comenzi' cu 3 coloane si 4 randuri de exemplu.",
        ],
        "ex2_scenario": "Un tabel 'Elevi' are coloanele: Nume, Clasa, Nota1, Nota2, Nota3, Nota4, Media, Adresa, Telefon, NotaRomana, NotaMatematica. Ce problema are acest design?",
        "ex2_options": [
            ("a", "Tabelul e prea mic, are nevoie de mai multe coloane"),
            ("b", "Tabelul amesteca date despre elev, note si contact - ar trebui separate"),
            ("c", "Tabelul nu are destule randuri"),
        ],
        "ex2_correct": "b",
        "ex2_explanation": "Un tabel bine proiectat contine un singur tip de informatie. Notele, datele personale si contactul ar trebui in tabele separate, legate prin ID-ul elevului.",
        "ex3_prompt": "Proiecteaza pe caiet structura tabelelor pentru o aplicatie de biblioteca scolara. Deseneaza minim 2 tabele (Carti si Imprumuturi) cu coloanele potrivite si 2-3 randuri exemplu in fiecare.",
        "ex3_hints": [
            "Fiecare tabel trebuie sa aiba o coloana ID unica",
            "Gandeste-te ce leaga cele doua tabele",
            "Alege tipuri de date potrivite (text, numar, data)",
        ],
        "ex3_keywords": "tabel, coloana, rand, structura, camp, tip de date, relatie",
    },
    "lectia3-campuri.html": {
        "ex1_title": "Alege tipul corect de date",
        "ex1_prompt": "Pentru fiecare informatie de mai jos, alege tipul de camp potrivit (Text, Numar, Data, Da/Nu, Memo):",
        "ex1_questions": [
            "Numele unui elev, varsta, data nasterii, daca e prezent azi, descrierea unui proiect scoalar - ce tip folosesti pentru fiecare?",
            "De ce nu putem pune numarul de telefon ca tip 'Numar'? (Indiciu: ce se intampla cu 0-ul de la inceput?)",
            "Ce se intampla daca punem nota unui elev (ex: 8.50) intr-un camp de tip 'Text' in loc de 'Numar'?",
        ],
        "ex2_scenario": "Vrei sa stochezi pretul produselor intr-un magazin. Ce tip de camp alegi?",
        "ex2_options": [
            ("a", "Text - ca sa poti scrie '25 lei'"),
            ("b", "Numar intreg (Integer) - pretul e un numar simplu"),
            ("c", "Numar zecimal (Decimal/Currency) - preturile au bani si lei"),
        ],
        "ex2_correct": "c",
        "ex2_explanation": "Preturile au parte zecimala (ex: 24.99 lei), deci avem nevoie de un camp numeric zecimal. Textul nu permite calcule, iar numarul intreg pierde banii.",
        "ex3_prompt": "Creeaza pe caiet un tabel 'Catalog' cu minim 6 campuri. Pentru fiecare camp, scrie: numele, tipul de date ales si un exemplu de valoare. Explica de ce ai ales fiecare tip.",
        "ex3_hints": [
            "Include cel putin 3 tipuri diferite de date",
            "Gandeste-te la validare - ce valori sunt acceptabile?",
            "Un camp 'Observatii' ar fi Text sau Memo? De ce?",
        ],
        "ex3_keywords": "camp, tip de date, text, numar, data, boolean, memo, validare",
    },
    "lectia4-inregistrari.html": {
        "ex1_title": "Lucreaza cu inregistrari",
        "ex1_prompt": "Ai un tabel 'Biblioteca' cu 500 de carti inregistrate:",
        "ex1_questions": [
            "Ce e o inregistrare in acest context? Dar o cheie primara? Da un exemplu concret.",
            "Doi elevi au acelasi nume 'Andrei Popescu'. De ce nu putem folosi numele ca cheie primara? Ce folosim in loc?",
            "Daca stergem inregistrarea cu ID=247, ce se intampla cu ID-urile 248-500? Se renumeroteaza?",
        ],
        "ex2_scenario": "Intr-un tabel 'Pacienti' la un cabinet medical, care ar fi cea mai buna cheie primara?",
        "ex2_options": [
            ("a", "Numele pacientului - e unic pentru fiecare persoana"),
            ("b", "CNP-ul (Codul Numeric Personal) - e unic si nu se schimba"),
            ("c", "Numarul de telefon - fiecare are alt numar"),
        ],
        "ex2_correct": "b",
        "ex2_explanation": "CNP-ul e ideal ca cheie primara: e unic pentru fiecare persoana si nu se schimba niciodata. Numele poate fi duplicat, telefonul se poate schimba.",
        "ex3_prompt": "Creeaza pe caiet un tabel 'Magazin' cu 5 inregistrari complete. Include o cheie primara (ID) si minim 4 campuri. Apoi raspunde: daca un produs se scumpeste, ce inregistrare modifici si cum?",
        "ex3_hints": [
            "Cheia primara trebuie sa fie unica si sa nu se repete",
            "Gandeste-te ce se intampla cand stergi o inregistrare",
            "Poti avea doua produse cu acelasi nume dar pret diferit?",
        ],
        "ex3_keywords": "inregistrare, rand, cheie primara, ID, unic, adaugare, stergere, modificare",
    },
    "lectia5-access-intro.html": {
        "ex1_title": "Exploreaza MS Access",
        "ex1_prompt": "Deschide Microsoft Access (sau imagineaza-ti interfata):",
        "ex1_questions": [
            "Care sunt cele 4 obiecte principale din Access? (Indiciu: Tabele, ..., ..., ...) Descrie pe scurt fiecare.",
            "Care e diferenta intre vizualizarea 'Design View' si 'Datasheet View' a unui tabel?",
            "De ce Access afiseaza un camp 'ID' automat cand creezi un tabel nou? La ce ajuta?",
        ],
        "ex2_scenario": "Vrei sa vezi doar elevii din clasa a 7-a care au media peste 8. Ce obiect Access folosesti?",
        "ex2_options": [
            ("a", "Un tabel nou - copiezi manual elevii care se potrivesc"),
            ("b", "O interogare (Query) - filtreaza automat dupa criterii"),
            ("c", "Un raport (Report) - afiseaza datele frumos formatate"),
        ],
        "ex2_correct": "b",
        "ex2_explanation": "Interogarea (Query) filtreaza si sorteaza datele automat dupa criterii. Tabelul stocheaza date, raportul le afiseaza frumos, dar doar interogarea filtreaza.",
        "ex3_prompt": "Descrie pas cu pas cum ai crea o baza de date pentru clasa ta in MS Access: ce tabele ai face, ce campuri ar avea fiecare, si cum ai gasi rapid toti elevii nascuti in luna martie.",
        "ex3_hints": [
            "Incepe cu crearea bazei de date si primul tabel",
            "Foloseste Design View pentru a seta tipurile de date",
            "Explica cum creezi o interogare simpla cu criteriu",
        ],
        "ex3_keywords": "Access, tabel, interogare, formular, raport, Design View, Datasheet View",
    },
}

def build_practice_html(data):
    """Build the practice exercises HTML from topic-specific data."""
    opts_html = ""
    for val, text in data["ex2_options"]:
        opts_html += f"""                    <label class="synthesis-option">
                        <input type="radio" name="synthesis_2" value="{val}">
                        <span>{text}</span>
                    </label>
"""

    hints_html = ""
    for hint in data["ex3_hints"]:
        hints_html += f"                        <li>{hint}</li>\n"

    questions_html = ""
    for q in data["ex1_questions"]:
        questions_html += f"                    <li>{q}</li>\n"

    return f"""            <div class="practice-exercise" data-type="deschis">
                <h4>&#128218; Exercitiul 1: {data["ex1_title"]}</h4>
                <p>{data["ex1_prompt"]}</p>
                <ol class="practice-questions">
{questions_html}                </ol>
            </div>

            <div class="practice-exercise" data-type="synthesis">
                <h4>&#129504; Exercitiul 2: Gandire critica</h4>
                <p class="scenario">{data["ex2_scenario"]}</p>
                <div class="synthesis-options">
{opts_html}                </div>
                <button class="check-synthesis-btn" onclick="checkSynthesis(this, '{data["ex2_correct"]}')">Verifica</button>
                <div class="synthesis-explanation hidden">
                    <p><strong>Explicatie:</strong> {data["ex2_explanation"]}</p>
                </div>
            </div>

            <div class="practice-exercise" data-type="written">
                <h4>&#128221; Exercitiul 3: Compunere</h4>
                <p><strong>Cerinta:</strong> {data["ex3_prompt"]}</p>
                <div class="hints">
                    <p><strong>Indicii:</strong></p>
                    <ul>
{hints_html}                    </ul>
                </div>
                <p class="keywords"><strong>Cuvinte cheie de folosit:</strong> {data["ex3_keywords"]}</p>
            </div>"""


def fix_file(filename, data):
    filepath = BASE / filename
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_html = build_practice_html(data)

    lines = content.split('\n')
    start_idx = None
    end_idx = None

    for i, line in enumerate(lines):
        if 'practice-exercise' in line and 'data-type="deschis"' in line and start_idx is None:
            start_idx = i
        if start_idx and 'class="keywords"' in line:
            for j in range(i, min(i + 3, len(lines))):
                if '</div>' in lines[j]:
                    end_idx = j
                    break
            break

    if start_idx is None or end_idx is None:
        print(f"  SKIP: {filename} - could not find practice block")
        return False

    new_lines = lines[:start_idx] + [new_html] + lines[end_idx + 1:]
    new_content = '\n'.join(new_lines)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"  FIXED: {filename}")
    return True


def main():
    print("Fixing placeholder practices in cls7/extra-baze-date/")
    print("=" * 50)

    fixed = 0
    for filename, data in REPLACEMENTS.items():
        if fix_file(filename, data):
            fixed += 1

    print(f"\nFixed {fixed}/{len(REPLACEMENTS)} files")


if __name__ == '__main__':
    main()
