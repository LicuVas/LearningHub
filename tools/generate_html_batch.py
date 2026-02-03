#!/usr/bin/env python3
"""Generate HTML lesson pages from JSON files for LearningHub."""
import json
import os
from pathlib import Path

PROJECT_ROOT = Path(r"C:\AI\Projects\LearningHub")

HTML_TEMPLATE = '''<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | TIC Clasa a {grade_roman}-a</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {{
            --bg-primary: #0a0a12;
            --bg-card: #1a1a2e;
            --bg-card-hover: #252540;
            --accent-blue: #3b82f6;
            --accent-blue-light: #60a5fa;
            --accent-purple: #8b5cf6;
            --text-primary: #ffffff;
            --text-secondary: #a0a0b0;
            --border-color: #2a2a4a;
            --success: #22c55e;
            --error: #ef4444;
            --warning: #f59e0b;
        }}
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: 'Inter', sans-serif; background: var(--bg-primary); color: var(--text-primary); min-height: 100vh; line-height: 1.6; }}
        .container {{ max-width: 900px; margin: 0 auto; padding: 2rem; }}
        .nav-bar {{ display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid var(--border-color); margin-bottom: 2rem; }}
        .nav-link {{ color: var(--accent-blue); text-decoration: none; display: flex; align-items: center; gap: 0.5rem; font-weight: 500; }}
        .nav-link:hover {{ color: var(--accent-blue-light); }}
        .breadcrumb {{ display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; font-size: 0.875rem; color: var(--text-secondary); flex-wrap: wrap; }}
        .breadcrumb a {{ color: var(--accent-blue); text-decoration: none; }}
        .lesson-header {{ text-align: center; margin-bottom: 2rem; }}
        .lesson-badge {{ display: inline-block; background: var(--accent-purple); color: white; padding: 0.5rem 1.5rem; border-radius: 50px; font-size: 0.875rem; font-weight: 600; margin-bottom: 1rem; }}
        .lesson-title {{ font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }}
        .progress-container {{ background: var(--bg-card); border-radius: 12px; padding: 1rem 1.5rem; margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem; }}
        .progress-bar-wrapper {{ flex: 1; height: 8px; background: var(--bg-primary); border-radius: 4px; overflow: hidden; }}
        .progress-bar-fill {{ height: 100%; background: linear-gradient(90deg, var(--accent-blue), var(--success)); width: 0%; transition: width 0.5s ease; }}
        .progress-text {{ font-size: 0.875rem; color: var(--text-secondary); }}
        .goal-section {{ background: var(--bg-card); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; border-left: 4px solid var(--accent-blue); }}
        .goal-title {{ font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; }}
        .goal-text {{ color: var(--text-secondary); font-style: italic; }}
        .atom {{ background: var(--bg-card); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; }}
        .atom-header {{ display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }}
        .atom-number {{ width: 36px; height: 36px; background: var(--accent-purple); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; }}
        .atom-title {{ font-size: 1.125rem; font-weight: 600; }}
        .atom-content {{ color: var(--text-secondary); margin-bottom: 1rem; }}
        .atom-content p {{ margin-bottom: 0.75rem; }}
        .atom-content ul {{ margin-left: 1.5rem; margin-bottom: 0.75rem; }}
        .quiz-container {{ background: var(--bg-primary); border-radius: 8px; padding: 1rem; margin-top: 1rem; }}
        .quiz-question {{ font-weight: 500; margin-bottom: 0.75rem; }}
        .quiz-options {{ display: flex; flex-direction: column; gap: 0.5rem; }}
        .quiz-option {{ background: var(--bg-card); padding: 0.75rem 1rem; border-radius: 8px; cursor: pointer; transition: all 0.2s; border: 2px solid transparent; }}
        .quiz-option:hover {{ background: var(--bg-card-hover); }}
        .quiz-option.selected {{ border-color: var(--accent-blue); }}
        .quiz-option.correct {{ border-color: var(--success); background: rgba(34, 197, 94, 0.1); }}
        .quiz-option.incorrect {{ border-color: var(--error); background: rgba(239, 68, 68, 0.1); }}
        .quiz-feedback {{ margin-top: 0.75rem; padding: 0.75rem; border-radius: 8px; display: none; }}
        .quiz-feedback.show {{ display: block; }}
        .quiz-feedback.correct {{ background: rgba(34, 197, 94, 0.1); color: var(--success); }}
        .quiz-feedback.incorrect {{ background: rgba(239, 68, 68, 0.1); color: var(--error); }}
        .summary-box {{ background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1)); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; margin: 2rem 0; }}
        .summary-title {{ font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem; }}
        .summary-list {{ list-style: none; }}
        .summary-list li {{ padding: 0.5rem 0; padding-left: 1.5rem; position: relative; color: var(--text-secondary); }}
        .summary-list li::before {{ content: "✓"; position: absolute; left: 0; color: var(--success); }}
        .practice-section {{ background: var(--bg-card); border-radius: 12px; padding: 1.5rem; margin-top: 2rem; }}
        .practice-title {{ font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }}
        .practice-item {{ margin-bottom: 1.5rem; }}
        .practice-question {{ font-weight: 500; margin-bottom: 0.75rem; }}
        .practice-textarea {{ width: 100%; min-height: 100px; padding: 0.75rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-primary); font-family: inherit; resize: vertical; }}
        .lesson-summary {{ background: var(--bg-card); border-radius: 12px; padding: 1.5rem; margin-top: 2rem; }}
        .nav-buttons {{ display: flex; justify-content: space-between; margin-top: 2rem; gap: 1rem; flex-wrap: wrap; }}
        .nav-btn {{ padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 500; transition: all 0.2s; }}
        .nav-btn.prev {{ background: var(--bg-card); color: var(--text-primary); }}
        .nav-btn.next {{ background: var(--accent-blue); color: white; }}
        .nav-btn:hover {{ transform: translateY(-2px); }}
        .restart-btn {{ background: var(--warning); color: white; padding: 0.5rem 1rem; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; margin-top: 1rem; }}
        @media (max-width: 640px) {{
            .container {{ padding: 1rem; }}
            .lesson-title {{ font-size: 1.5rem; }}
            .nav-buttons {{ flex-direction: column; }}
            .nav-btn {{ text-align: center; }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <nav class="nav-bar">
            <a href="../index.html" class="nav-link">← Înapoi la Clasa a {grade_roman}-a</a>
        </nav>

        <div class="breadcrumb">
            <a href="../../../../index.html">Acasă</a> &gt;
            <a href="../index.html">Clasa a {grade_roman}-a</a> &gt;
            <span>{module_name}</span> &gt;
            <span>Lecția {lesson_num}</span>
        </div>

        <header class="lesson-header">
            <span class="lesson-badge">Lecția {lesson_num}</span>
            <h1 class="lesson-title">{title}</h1>
        </header>

        <div class="progress-container">
            <span class="progress-label">Progres lecție:</span>
            <div class="progress-bar-wrapper">
                <div class="progress-bar-fill" id="progressBar"></div>
            </div>
            <span class="progress-text" id="progressText">0%</span>
        </div>

        <section class="goal-section">
            <h2 class="goal-title">🎯 Obiectivul lecției</h2>
            <p class="goal-text">{goal}</p>
        </section>

{atoms_html}

        <div class="summary-box">
            <h3 class="summary-title">📝 Recapitulare</h3>
            <ul class="summary-list">
{summary_items}
            </ul>
        </div>

        <section class="practice-section" id="practice">
            <h2 class="practice-title">✍️ Practică</h2>
{practice_html}
        </section>

        <section class="lesson-summary" id="lessonSummary">
            <h2>📊 Sumar lecție</h2>
            <p>Completează toate întrebările pentru a vedea rezultatul.</p>
        </section>

        <button class="restart-btn" onclick="restartLesson()">🔄 Reîncepe lecția</button>

        <div class="nav-buttons">
            <a href="{prev_link}" class="nav-btn prev">← Lecția anterioară</a>
            <a href="{next_link}" class="nav-btn next">Lecția următoare →</a>
        </div>
    </div>

    <script src="../../../../assets/js/atomic-learning.js"></script>
    <script src="../../../../assets/js/practice-advanced.js"></script>
    <script src="../../../../assets/js/lesson-summary.js"></script>
    <script src="../../../../assets/js/user-system.js"></script>
    <script src="../../../../assets/js/rpg-system.js"></script>
    <script>
        const LESSON_ID = '{lesson_id}';
        let answeredQuestions = new Set();
        const totalQuestions = document.querySelectorAll('.quiz-container').length;

        function updateProgress() {{
            const progress = Math.round((answeredQuestions.size / totalQuestions) * 100);
            document.getElementById('progressBar').style.width = progress + '%';
            document.getElementById('progressText').textContent = progress + '%';
            localStorage.setItem(LESSON_ID + '_progress', progress);
        }}

        document.querySelectorAll('.quiz-option').forEach(option => {{
            option.addEventListener('click', function() {{
                const container = this.closest('.quiz-container');
                const qid = container.dataset.qid;
                if (answeredQuestions.has(qid)) return;

                const options = container.querySelectorAll('.quiz-option');
                const feedback = container.querySelector('.quiz-feedback');
                const isCorrect = this.dataset.correct === 'true';

                options.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                this.classList.add(isCorrect ? 'correct' : 'incorrect');

                feedback.classList.add('show');
                feedback.classList.remove('correct', 'incorrect');
                feedback.classList.add(isCorrect ? 'correct' : 'incorrect');
                feedback.textContent = isCorrect ? '✓ Corect!' : '✗ ' + container.dataset.hint;

                answeredQuestions.add(qid);
                updateProgress();
            }});
        }});

        function restartLesson() {{
            answeredQuestions.clear();
            document.querySelectorAll('.quiz-option').forEach(opt => {{
                opt.classList.remove('selected', 'correct', 'incorrect');
            }});
            document.querySelectorAll('.quiz-feedback').forEach(fb => {{
                fb.classList.remove('show');
            }});
            document.querySelectorAll('.practice-textarea').forEach(ta => {{
                ta.value = '';
            }});
            updateProgress();
            window.scrollTo(0, 0);
        }}

        // Load saved progress
        const savedProgress = localStorage.getItem(LESSON_ID + '_progress');
        if (savedProgress) {{
            document.getElementById('progressBar').style.width = savedProgress + '%';
            document.getElementById('progressText').textContent = savedProgress + '%';
        }}
    </script>
</body>
</html>
'''

def generate_atom_html(atom_num, title, content_paragraphs, quiz):
    """Generate HTML for a single atom with quiz."""
    content_html = '\n'.join(f'                <p>{p}</p>' for p in content_paragraphs)

    options_html = ''
    for i, opt in enumerate(quiz.get('options', [])):
        is_correct = 'true' if i == quiz.get('correct_index', 0) else 'false'
        options_html += f'''                    <div class="quiz-option" data-correct="{is_correct}">{opt}</div>\n'''

    return f'''        <section class="atom" id="atom-{atom_num}">
            <div class="atom-header">
                <span class="atom-number">{atom_num}</span>
                <h2 class="atom-title">{title}</h2>
            </div>
            <div class="atom-content">
{content_html}
            </div>
            <div class="quiz-container" data-qid="atom-{atom_num}-q0" data-hint="{quiz.get('hint', 'Încearcă din nou!')}">
                <p class="quiz-question">{quiz.get('question', 'Întrebare')}</p>
                <div class="quiz-options">
{options_html}                </div>
                <div class="quiz-feedback"></div>
            </div>
        </section>
'''

def generate_practice_html(questions):
    """Generate HTML for practice questions."""
    html = ''
    for i, q in enumerate(questions, 1):
        html += f'''            <div class="practice-item">
                <p class="practice-question">{i}. {q}</p>
                <textarea class="practice-textarea" placeholder="Scrie răspunsul tău aici..."></textarea>
            </div>
'''
    return html

def generate_lesson_html(json_path, output_path, grade, module_name, lesson_num, prev_link, next_link):
    """Generate HTML file from JSON lesson data."""
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    meta = data.get('meta', {})
    title = meta.get('title_ro', 'Lecție')

    # Extract content for atoms
    knowledge = data.get('knowledge_progression', {}).get('levels', [])
    why = data.get('why_this_matters', {})

    # Create 3 atoms from the content
    atoms_html = ''

    # Atom 1: Introduction/General concepts
    atom1_content = []
    if why.get('purpose'):
        atom1_content.append(why['purpose'])
    if knowledge and len(knowledge) > 0:
        for concept in knowledge[0].get('concepts', [])[:2]:
            atom1_content.append(concept)

    atom1_quiz = {
        'question': 'Ce ai învățat în această secțiune?',
        'options': ['Am înțeles conceptele de bază', 'Nu sunt sigur', 'Am nevoie de mai multe explicații', 'Totul este clar'],
        'correct_index': 0,
        'hint': 'Gândește-te la ceea ce tocmai ai citit.'
    }
    atoms_html += generate_atom_html(1, 'Introducere', atom1_content or ['Această secțiune prezintă conceptele de bază.'], atom1_quiz)

    # Atom 2: Intermediate concepts
    atom2_content = []
    if knowledge and len(knowledge) > 1:
        for concept in knowledge[1].get('concepts', []):
            atom2_content.append(concept)

    atom2_quiz = {
        'question': 'Care este ideea principală din această secțiune?',
        'options': ['Am identificat ideea principală', 'Trebuie să recitesc', 'Este complicat', 'Am înțeles perfect'],
        'correct_index': 0,
        'hint': 'Recitește paragraful cu atenție.'
    }
    atoms_html += generate_atom_html(2, 'Concepte intermediare', atom2_content or ['Această secțiune dezvoltă conceptele.'], atom2_quiz)

    # Atom 3: Specific/Advanced concepts
    atom3_content = []
    if knowledge and len(knowledge) > 2:
        for concept in knowledge[2].get('concepts', []):
            atom3_content.append(concept)

    atom3_quiz = {
        'question': 'Poți aplica ce ai învățat?',
        'options': ['Da, pot aplica cunoștințele', 'Poate cu ajutor', 'Am nevoie de practică', 'Sunt expert'],
        'correct_index': 0,
        'hint': 'Gândește-te la aplicațiile practice.'
    }
    atoms_html += generate_atom_html(3, 'Concepte avansate', atom3_content or ['Această secțiune prezintă detalii avansate.'], atom3_quiz)

    # Summary items
    summary_items = ''
    all_concepts = []
    for level in knowledge:
        all_concepts.extend(level.get('concepts', []))
    for concept in all_concepts[:5]:
        summary_items += f'                <li>{concept}</li>\n'

    # Practice questions
    practice_questions = [
        'Descrie în propriile cuvinte ce ai învățat în această lecție.',
        'Cum ai aplica aceste cunoștințe într-o situație reală?',
        'Ce întrebări ai despre acest subiect?'
    ]
    practice_html = generate_practice_html(practice_questions)

    # Grade roman numeral
    grade_map = {'V': 'V', 'VI': 'VI', 'VII': 'VII', 'VIII': 'VIII', '5': 'V', '6': 'VI', '7': 'VII', '8': 'VIII'}
    grade_roman = grade_map.get(str(grade), grade)

    # Generate final HTML
    html = HTML_TEMPLATE.format(
        title=title,
        grade_roman=grade_roman,
        module_name=module_name,
        lesson_num=lesson_num,
        goal=why.get('purpose', 'Învață conceptele prezentate în această lecție.'),
        atoms_html=atoms_html,
        summary_items=summary_items,
        practice_html=practice_html,
        prev_link=prev_link,
        next_link=next_link,
        lesson_id=meta.get('lesson_code', f'lesson-{lesson_num}')
    )

    # Write output
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f"Created: {output_path}")

def process_grade(grade, modules_config):
    """Process all modules for a grade."""
    grade_folder = f"clasa-{grade.lower().replace('vi', '6').replace('v', '5').replace('ii', '7').replace('i', '8')}"
    if grade == 'VI':
        grade_folder = 'clasa-6'
    elif grade == 'VII':
        grade_folder = 'clasa-7'
    elif grade == 'VIII':
        grade_folder = 'clasa-8'
    elif grade == 'V':
        grade_folder = 'clasa-5'

    for module_id, module_config in modules_config.items():
        json_dir = PROJECT_ROOT / 'content' / 'gimnaziu' / grade / module_id
        html_dir = PROJECT_ROOT / 'hub' / 'sunt-in-clasa' / grade_folder / module_config['folder']

        if not json_dir.exists():
            print(f"Skipping {json_dir} - not found")
            continue

        json_files = sorted([f for f in json_dir.glob('*.json') if '.quiz' not in f.name])
        for i, json_file in enumerate(json_files):
            lesson_num = int(json_file.stem.split('-L')[1]) if '-L' in json_file.stem else i + 1

            prev_link = f"lectia-{lesson_num - 1}.html" if lesson_num > 1 else "../index.html"
            next_link = f"lectia-{lesson_num + 1}.html" if lesson_num < len(json_files) else "../index.html"

            output_path = html_dir / f"lectia-{lesson_num}.html"
            generate_lesson_html(json_file, output_path, grade, module_config['name'], lesson_num, prev_link, next_link)

def main():
    # Grade VI modules configuration
    grade_vi_modules = {
        'm1': {'folder': 'm1-prezentari', 'name': 'M1: Prezentări multimedia'},
        'm2': {'folder': 'm2-scratch-algoritmi', 'name': 'M2: Algoritmi în Scratch'},
        'm3': {'folder': 'm3-scratch-control', 'name': 'M3: Structuri de control'},
        'm4': {'folder': 'm4-comunicare', 'name': 'M4: Comunicare digitală'},
        'm5': {'folder': 'm5-proiect', 'name': 'M5: Proiect integrat'},
    }

    print("Generating Grade VI HTML files...")
    process_grade('VI', grade_vi_modules)
    print("\nDone!")

if __name__ == '__main__':
    main()
