#!/usr/bin/env python3
"""
inject_practica.py - Injecteaza exercitii de practica avansata din JSON in HTML-uri

Utilizare:
    python inject_practica.py --json "A:\learninghub_exercises.json" --dry-run
    python inject_practica.py --json "A:\learninghub_exercises.json" --apply
    python inject_practica.py --verify
"""

import json
import os
import re
import argparse
import shutil
from datetime import datetime
from pathlib import Path

# Configurare paths
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
CONTENT_PATH = PROJECT_ROOT / "content" / "tic"
BACKUP_PATH = PROJECT_ROOT / ".backup-before-practica"

# Mapare clase
CLS_MAP = {
    'clasa_5': 'cls5',
    'clasa_6': 'cls6',
    'clasa_7': 'cls7',
    'clasa_8': 'cls8'
}

# Mapare module (JSON -> folder)
MODUL_MAP = {
    'sisteme': 'm1-sisteme',
    'birotice': 'm2-birotice',
    'word': 'm3-word',
    'siguranta': 'm4-siguranta',
    'proiect': 'm5-proiect',
    'prezentari': 'm1-prezentari',
    'scratch': 'm2-scratch',
    'scratch-control': 'm3-scratch-control',
    'comunicare': 'm4-comunicare',
    'baze-date': 'm1-baze-date',
    'multimedia': 'm2-multimedia',
    'cpp-algorithms': 'm3-cpp-algorithms',
    'web': 'm4-web',
    'calcul-tabelar': 'm1-calcul-tabelar',
    'subprograme': 'm1-subprograme',
    'structuri-date': 'm2-structuri-date',
    'databases': 'm3-databases',
    'recapitulare': 'm5-recapitulare',
}

# Iconite pentru tipuri
ICONS = {
    'deschis': '&#128218;',      # 📚
    'written': '&#128221;',      # 📝
    'synthesis': '&#129504;',    # 🧠
    'scenario': '&#127919;',     # 🎯
    'proiect': '&#128187;',      # 💻
    'coding': '&#128187;',       # 💻
    'practica_cod': '&#128187;', # 💻
    'dragdrop': '&#128268;',     # 🔌
    'schema': '&#128200;',       # 📈
    'default': '&#10004;',       # ✔
}


def get_icon(tip):
    """Returneaza iconita pentru tipul de exercitiu"""
    return ICONS.get(tip, ICONS['default'])


def render_deschis(ex, num):
    """Render exercitiu tip deschis"""
    titlu = ex.get('titlu', f'Exercitiul {num}')
    descriere = ex.get('descriere', '')
    intrebari = ex.get('intrebari', [])

    intrebari_html = '\n'.join([f'                    <li>{q}</li>' for q in intrebari])

    return f'''
            <div class="practice-exercise" data-type="deschis">
                <h4>{get_icon('deschis')} {titlu}</h4>
                <p>{descriere}</p>
                <ol class="practice-questions">
{intrebari_html}
                </ol>
                <p class="answer-instruction"><strong>Raspunde numerotat:</strong> 1. ... 2. ... 3. ...</p>
            </div>
'''


def render_written(ex, num):
    """Render exercitiu tip written"""
    cerinta = ex.get('cerinta', '')
    indicii = ex.get('indicii', [])
    cuvinte_cheie = ex.get('cuvinte_cheie', [])

    indicii_html = '\n'.join([f'                        <li>{i}</li>' for i in indicii])
    cuvinte_str = ', '.join(cuvinte_cheie) if cuvinte_cheie else ''

    cuvinte_section = f'''
                <p class="keywords"><strong>Cuvinte cheie de folosit:</strong> {cuvinte_str}</p>''' if cuvinte_str else ''

    return f'''
            <div class="practice-exercise" data-type="written">
                <h4>{get_icon('written')} Exercitiul {num}: Compunere</h4>
                <p><strong>Cerinta:</strong> {cerinta}</p>
                <div class="hints">
                    <p><strong>Indicii:</strong></p>
                    <ul>
{indicii_html}
                    </ul>
                </div>{cuvinte_section}
                <textarea class="practice-answer" rows="6" placeholder="Scrie raspunsul aici..."></textarea>
            </div>
'''


def render_synthesis(ex, num):
    """Render exercitiu tip synthesis"""
    cerinta = ex.get('cerinta', '')
    optiuni = ex.get('optiuni', [])
    raspuns = ex.get('raspuns_corect', '')
    explicatie = ex.get('explicatie', '')

    optiuni_html = ''
    for i, opt in enumerate(optiuni):
        letter = chr(97 + i)  # a, b, c, d
        optiuni_html += f'''
                    <label class="synthesis-option">
                        <input type="radio" name="synthesis_{num}" value="{letter}">
                        <span>{letter}) {opt}</span>
                    </label>'''

    return f'''
            <div class="practice-exercise" data-type="synthesis">
                <h4>{get_icon('synthesis')} Exercitiul {num}: Gandire critica</h4>
                <p class="scenario">{cerinta}</p>
                <div class="synthesis-options">{optiuni_html}
                </div>
                <button class="check-synthesis-btn" onclick="checkSynthesis(this, '{raspuns}')">Verifica</button>
                <div class="synthesis-explanation hidden">
                    <p><strong>Explicatie:</strong> {explicatie}</p>
                </div>
            </div>
'''


def render_scenario(ex, num):
    """Render exercitiu tip scenario"""
    cerinta = ex.get('cerinta', '')
    context = ex.get('context', '')
    optiuni = ex.get('optiuni', [])
    raspuns = ex.get('raspuns_corect', '')

    if optiuni:
        optiuni_html = ''
        for i, opt in enumerate(optiuni):
            letter = chr(97 + i)
            optiuni_html += f'''
                    <label class="scenario-option">
                        <input type="radio" name="scenario_{num}" value="{letter}">
                        <span>{letter}) {opt}</span>
                    </label>'''
        answer_section = f'''
                <div class="scenario-options">{optiuni_html}
                </div>
                <button class="check-scenario-btn" onclick="checkScenario(this, '{raspuns}')">Verifica</button>'''
    else:
        answer_section = '''
                <textarea class="practice-answer" rows="4" placeholder="Scrie raspunsul tau..."></textarea>'''

    return f'''
            <div class="practice-exercise" data-type="scenario">
                <h4>{get_icon('scenario')} Exercitiul {num}: Situatie reala</h4>
                <div class="scenario-context"><em>{context}</em></div>
                <p><strong>Intrebare:</strong> {cerinta}</p>{answer_section}
            </div>
'''


def render_proiect(ex, num):
    """Render exercitiu tip proiect"""
    titlu = ex.get('titlu', f'Mini-proiect {num}')
    descriere = ex.get('descriere', '')
    cerinte = ex.get('cerinte', [])
    bonus = ex.get('bonus', [])

    cerinte_html = '\n'.join([f'''                        <li><label><input type="checkbox"> {c}</label></li>''' for c in cerinte])

    bonus_section = ''
    if bonus:
        bonus_html = '\n'.join([f'                        <li>{b}</li>' for b in bonus])
        bonus_section = f'''
                <div class="project-bonus">
                    <p><strong>&#11088; Bonus (pentru nota maxima):</strong></p>
                    <ul>
{bonus_html}
                    </ul>
                </div>'''

    return f'''
            <div class="practice-exercise" data-type="proiect">
                <h4>{get_icon('proiect')} {titlu}</h4>
                <p>{descriere}</p>
                <div class="project-checklist">
                    <p><strong>Cerinte obligatorii:</strong></p>
                    <ul class="checklist">
{cerinte_html}
                    </ul>
                </div>{bonus_section}
            </div>
'''


def render_coding(ex, num):
    """Render exercitiu tip coding sau practica_cod"""
    cerinta = ex.get('cerinta', ex.get('titlu', ''))
    input_ex = ex.get('input_exemplu', '')
    output_ex = ex.get('output_exemplu', '')
    indicii = ex.get('indicii', [])
    solutie = ex.get('solutie_partiala', '')

    io_section = ''
    if input_ex or output_ex:
        io_section = f'''
                <div class="code-example">
                    <p><strong>Exemplu input:</strong> <code>{input_ex}</code></p>
                    <p><strong>Exemplu output:</strong> <code>{output_ex}</code></p>
                </div>'''

    indicii_section = ''
    if indicii:
        indicii_html = '\n'.join([f'                        <li>{i}</li>' for i in indicii])
        indicii_section = f'''
                <div class="hints">
                    <p><strong>Indicii:</strong></p>
                    <ul>
{indicii_html}
                    </ul>
                </div>'''

    solutie_section = ''
    if solutie:
        solutie_section = f'''
                <div class="code-template">
                    <p><strong>Schelet de cod:</strong></p>
                    <pre><code>{solutie}</code></pre>
                </div>'''

    return f'''
            <div class="practice-exercise" data-type="coding">
                <h4>{get_icon('coding')} Exercitiul {num}: Programare</h4>
                <p><strong>Cerinta:</strong> {cerinta}</p>{io_section}{indicii_section}{solutie_section}
            </div>
'''


def render_dragdrop(ex, num):
    """Render exercitiu tip dragdrop (simplificat ca text)"""
    cerinta = ex.get('cerinta', '')

    return f'''
            <div class="practice-exercise" data-type="dragdrop">
                <h4>{get_icon('dragdrop')} Exercitiul {num}: Potriveste elementele</h4>
                <p>{cerinta}</p>
                <p class="dragdrop-note"><em>(Exercitiu interactiv - disponibil in versiunea completa)</em></p>
            </div>
'''


def render_schema(ex, num):
    """Render exercitiu tip schema"""
    cerinta = ex.get('cerinta', '')
    raspuns = ex.get('raspuns_corect', '')

    return f'''
            <div class="practice-exercise" data-type="schema">
                <h4>{get_icon('schema')} Exercitiul {num}: Completeaza schema</h4>
                <p>{cerinta}</p>
                <input type="text" class="schema-answer" placeholder="Completeaza aici...">
                <button class="check-schema-btn" onclick="checkSchema(this, '{raspuns}')">Verifica</button>
            </div>
'''


def render_exercise(ex, num):
    """Render un exercitiu bazat pe tipul sau"""
    tip = ex.get('tip', 'deschis')

    renderers = {
        'deschis': render_deschis,
        'written': render_written,
        'synthesis': render_synthesis,
        'scenario': render_scenario,
        'proiect': render_proiect,
        'coding': render_coding,
        'practica_cod': render_coding,
        'dragdrop': render_dragdrop,
        'schema': render_schema,
    }

    renderer = renderers.get(tip, render_deschis)
    return renderer(ex, num)


def generate_practice_section(practica_list):
    """Genereaza sectiunea HTML completa pentru practica avansata"""
    if not practica_list:
        return ''

    exercises_html = ''
    for i, ex in enumerate(practica_list, 1):
        exercises_html += render_exercise(ex, i)

    return f'''
        <!-- PRACTICA AVANSATA - Injectat automat din JSON -->
        <section class="practice-advanced" id="practice-advanced">
            <div class="practice-advanced-header">
                <span class="practice-advanced-icon">&#127942;</span>
                <div>
                    <h3 class="practice-advanced-title">Practica Avansata</h3>
                    <p class="practice-advanced-subtitle">Fara practica: nota maxima 8. Cu practica completa: nota maxima 10!</p>
                </div>
            </div>
{exercises_html}
        </section>
        <!-- END PRACTICA AVANSATA -->
'''


def find_html_path(clasa, modul, lectie):
    """Gaseste path-ul HTML pentru o lectie din JSON"""
    cls_folder = CLS_MAP.get(clasa)
    if not cls_folder:
        return None

    # Incearca maparea directa
    modul_folder = MODUL_MAP.get(modul)

    # Daca nu exista in map, cauta in folder
    if not modul_folder:
        cls_path = CONTENT_PATH / cls_folder
        if cls_path.exists():
            for folder in cls_path.iterdir():
                if folder.is_dir() and modul in folder.name:
                    modul_folder = folder.name
                    break

    if not modul_folder:
        return None

    html_path = CONTENT_PATH / cls_folder / modul_folder / f"{lectie}.html"
    return html_path if html_path.exists() else None


def has_practice_section(html_content):
    """Verifica daca HTML-ul are deja sectiune de practica"""
    return 'practice-advanced' in html_content.lower() or 'id="practice-advanced"' in html_content


def inject_practice(html_content, practice_html):
    """Injecteaza sectiunea de practica in HTML"""
    # Cauta locul potrivit pentru injectare
    # Prioritate: inainte de </main>, sau inainte de ultimul </div> din container

    # Pattern 1: Inainte de </main>
    if '</main>' in html_content:
        return html_content.replace('</main>', f'{practice_html}\n        </main>')

    # Pattern 2: Inainte de section.lesson-navigation sau similar
    nav_match = re.search(r'(<section[^>]*class="[^"]*navigation[^"]*")', html_content)
    if nav_match:
        return html_content.replace(nav_match.group(1), f'{practice_html}\n\n        {nav_match.group(1)}')

    # Pattern 3: Inainte de ultimul </section> din container
    last_section = html_content.rfind('</section>')
    if last_section > 0:
        return html_content[:last_section] + f'{practice_html}\n\n        ' + html_content[last_section:]

    # Fallback: Inainte de </body>
    return html_content.replace('</body>', f'{practice_html}\n    </body>')


def process_lesson(clasa, modul, lectie, practica_list, dry_run=True):
    """Proceseaza o singura lectie"""
    html_path = find_html_path(clasa, modul, lectie)

    if not html_path:
        return {'status': 'missing', 'path': f'{clasa}/{modul}/{lectie}'}

    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    if has_practice_section(html_content):
        return {'status': 'exists', 'path': str(html_path)}

    practice_html = generate_practice_section(practica_list)
    new_html = inject_practice(html_content, practice_html)

    if dry_run:
        return {'status': 'would_inject', 'path': str(html_path), 'exercises': len(practica_list)}

    # Aplica modificarea
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(new_html)

    return {'status': 'injected', 'path': str(html_path), 'exercises': len(practica_list)}


def create_backup():
    """Creaza backup pentru content/tic"""
    if BACKUP_PATH.exists():
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_with_ts = BACKUP_PATH.parent / f".backup-before-practica-{timestamp}"
        shutil.move(str(BACKUP_PATH), str(backup_with_ts))

    shutil.copytree(str(CONTENT_PATH), str(BACKUP_PATH))
    print(f"Backup creat: {BACKUP_PATH}")


def verify_integration():
    """Verifica integrarea practicii in HTML-uri"""
    results = {'with_practice': 0, 'without_practice': 0, 'missing': []}

    for cls in ['cls5', 'cls6', 'cls7', 'cls8']:
        cls_path = CONTENT_PATH / cls
        if not cls_path.exists():
            continue

        for modul in cls_path.iterdir():
            if not modul.is_dir():
                continue

            for html_file in modul.glob('lectia*.html'):
                with open(html_file, 'r', encoding='utf-8') as f:
                    content = f.read()

                if has_practice_section(content):
                    results['with_practice'] += 1
                else:
                    results['without_practice'] += 1
                    results['missing'].append(str(html_file.relative_to(CONTENT_PATH)))

    return results


def main():
    parser = argparse.ArgumentParser(description='Injecteaza practica avansata din JSON in HTML')
    parser.add_argument('--json', type=str, default=r'A:\learninghub_exercises.json',
                        help='Path catre JSON cu exercitii')
    parser.add_argument('--dry-run', action='store_true',
                        help='Afiseaza ce ar face fara sa modifice')
    parser.add_argument('--apply', action='store_true',
                        help='Aplica modificarile')
    parser.add_argument('--verify', action='store_true',
                        help='Verifica integrarea')
    parser.add_argument('--backup', action='store_true',
                        help='Creaza backup inainte de aplicare')
    parser.add_argument('--only-class', type=str,
                        help='Proceseaza doar o clasa (ex: clasa_5)')

    args = parser.parse_args()

    if args.verify:
        print("=== VERIFICARE INTEGRARE ===\n")
        results = verify_integration()
        print(f"Lectii cu practica: {results['with_practice']}")
        print(f"Lectii fara practica: {results['without_practice']}")
        if results['missing']:
            print(f"\nLectii fara practica ({len(results['missing'])}):")
            for m in results['missing'][:20]:
                print(f"  - {m}")
            if len(results['missing']) > 20:
                print(f"  ... si inca {len(results['missing']) - 20}")
        return

    if not args.dry_run and not args.apply:
        print("Specifica --dry-run sau --apply")
        return

    # Citeste JSON
    print(f"Citesc JSON: {args.json}")
    with open(args.json, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if args.backup and args.apply:
        create_backup()

    # Proceseaza lectiile
    stats = {'injected': 0, 'exists': 0, 'missing': 0, 'would_inject': 0, 'no_practice': 0}

    mode = "DRY-RUN" if args.dry_run else "APLICARE"
    print(f"\n=== {mode} ===\n")

    for clasa, module in data.get('clase', {}).items():
        if args.only_class and clasa != args.only_class:
            continue

        print(f"\n{clasa.upper()}:")

        for modul, lectii in module.items():
            for lectie, content in lectii.items():
                practica = content.get('practica_avansata', [])

                if not practica:
                    stats['no_practice'] += 1
                    continue

                result = process_lesson(clasa, modul, lectie, practica, dry_run=args.dry_run)
                stats[result['status']] = stats.get(result['status'], 0) + 1

                if result['status'] == 'would_inject':
                    print(f"  [+] {modul}/{lectie}: {result['exercises']} exercitii")
                elif result['status'] == 'injected':
                    print(f"  [OK] {modul}/{lectie}: {result['exercises']} exercitii injectate")
                elif result['status'] == 'exists':
                    print(f"  [=] {modul}/{lectie}: practica existenta")
                elif result['status'] == 'missing':
                    print(f"  [!] {modul}/{lectie}: HTML negasit")

    print(f"\n=== REZULTAT ===")
    if args.dry_run:
        print(f"Ar injecta: {stats.get('would_inject', 0)} lectii")
    else:
        print(f"Injectat: {stats.get('injected', 0)} lectii")
    print(f"Deja exista: {stats.get('exists', 0)} lectii")
    print(f"HTML negasit: {stats.get('missing', 0)} lectii")
    print(f"Fara practica in JSON: {stats['no_practice']} lectii")


if __name__ == '__main__':
    main()
