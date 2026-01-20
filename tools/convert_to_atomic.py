#!/usr/bin/env python3
"""
Convert Regular Lessons to Atomic Format
==========================================

Converts existing GOAL→TRY→LEARN→TEST lessons to atomic learning format.

Usage:
    python convert_to_atomic.py <lesson_file>
    python convert_to_atomic.py --folder cls5/m1-sisteme
    python convert_to_atomic.py --all-cls5
"""

import os
import re
import sys
import json
from pathlib import Path
from bs4 import BeautifulSoup
import html

CONTENT_ROOT = Path(__file__).parent.parent / "content" / "tic"
TEMPLATE_PATH = Path(__file__).parent.parent / "content" / "tic" / "cls5" / "m1-sisteme" / "lectia2-hardware-atomic.html"


def extract_text_content(element):
    """Extract clean text from HTML element."""
    if element is None:
        return ""
    return ' '.join(element.get_text().split())


def parse_existing_lesson(filepath: Path) -> dict:
    """Parse an existing lesson and extract its components."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    soup = BeautifulSoup(content, 'html.parser')

    lesson_data = {
        'filepath': str(filepath),
        'title': '',
        'subtitle': '',
        'badge': '',
        'goal_text': '',
        'content_sections': [],
        'quiz_questions': [],
        'nav_prev': '',
        'nav_next': '',
        'lesson_id': ''
    }

    # Extract title
    title_el = soup.find('h1', class_='lesson-title') or soup.find('h1')
    if title_el:
        lesson_data['title'] = extract_text_content(title_el)

    # Extract badge
    badge_el = soup.find(class_='lesson-badge') or soup.find(class_='step-badge')
    if badge_el:
        lesson_data['badge'] = extract_text_content(badge_el)

    # Extract goal text
    goal_el = soup.find(class_='goal-text') or soup.find(class_='goal-desc')
    if goal_el:
        lesson_data['goal_text'] = extract_text_content(goal_el)
    else:
        # Try to find in goal-box
        goal_box = soup.find(class_='goal-box')
        if goal_box:
            p = goal_box.find('p')
            if p:
                lesson_data['goal_text'] = extract_text_content(p)

    # Extract content from TRY and LEARN sections
    content_sections = []

    # Look for section cards or sections
    sections = soup.find_all(['section', 'div'], class_=lambda x: x and ('section-card' in x or 'section' in x))

    for section in sections:
        header = section.find(['h2', 'h3'], class_=lambda x: x and 'title' in str(x)) if section else None
        if not header:
            header = section.find(['h2', 'h3'])

        section_title = extract_text_content(header) if header else ""

        # Skip quiz/test sections for content extraction
        if any(skip in section_title.lower() for skip in ['test', 'verifica', 'quiz']):
            continue

        # Get content paragraphs
        paragraphs = section.find_all('p')
        highlight_boxes = section.find_all(class_='highlight-box')

        section_content = []
        for p in paragraphs:
            text = extract_text_content(p)
            if text and len(text) > 20:  # Skip very short paragraphs
                section_content.append(text)

        for box in highlight_boxes:
            text = extract_text_content(box)
            if text:
                section_content.append(f"**{text}**")

        if section_content:
            content_sections.append({
                'title': section_title,
                'content': section_content
            })

    lesson_data['content_sections'] = content_sections

    # Extract quiz questions
    quiz_questions = []
    quiz_elements = soup.find_all(class_='quiz-question')

    for i, quiz in enumerate(quiz_elements):
        question_text_el = quiz.find(class_='question-text')
        question_text = extract_text_content(question_text_el) if question_text_el else f"Intrebarea {i+1}"

        # Remove numbering from question
        question_text = re.sub(r'^\d+\.\s*', '', question_text)

        options = []
        correct_answer = 'a'

        # Try both class names: 'quiz-option' and 'option'
        option_els = quiz.find_all(class_='quiz-option')
        if not option_els:
            option_els = quiz.find_all(class_='option')

        for j, opt in enumerate(option_els):
            opt_text = extract_text_content(opt)
            # Remove letter prefix
            opt_text = re.sub(r'^[A-Za-z]\s*', '', opt_text)

            # Check if this is the correct answer
            onclick = opt.get('onclick', '')
            if 'true' in onclick.lower():
                correct_answer = chr(ord('a') + j)

            options.append(opt_text)

        if options:
            quiz_questions.append({
                'question': question_text,
                'options': options,
                'correct': correct_answer,
                'hint': 'Reciteste sectiunea pentru a gasi raspunsul.'
            })

    lesson_data['quiz_questions'] = quiz_questions

    # Extract navigation links
    nav_links = soup.find_all('a', class_='nav-link')
    for link in nav_links:
        href = link.get('href', '')
        text = extract_text_content(link)
        if 'inapoi' in text.lower() or '←' in text or 'prev' in href.lower():
            lesson_data['nav_prev'] = href
        elif 'urmatoare' in text.lower() or '→' in text or 'next' in href.lower():
            lesson_data['nav_next'] = href

    # Generate lesson ID
    parts = filepath.parts
    try:
        cls_idx = next(i for i, p in enumerate(parts) if p.startswith('cls'))
        cls = parts[cls_idx]
        module = parts[cls_idx + 1]
        lesson = filepath.stem
        lesson_data['lesson_id'] = f"{cls}-{module}-{lesson}"
    except:
        lesson_data['lesson_id'] = filepath.stem

    return lesson_data


def generate_atomic_lesson(lesson_data: dict) -> str:
    """Generate atomic format HTML from parsed lesson data."""

    # Distribute quiz questions among content sections
    questions = lesson_data['quiz_questions']
    content_sections = lesson_data['content_sections']

    # Create atoms from content sections
    atoms = []
    q_idx = 0

    for i, section in enumerate(content_sections):
        if not section['content']:
            continue

        # Create atom for this section
        atom_title = section['title'] or f"Concept {i+1}"
        atom_title = re.sub(r'^(TRY|LEARN|GOAL)\s*[-–—]\s*', '', atom_title)
        atom_title = atom_title.strip()

        if not atom_title or len(atom_title) < 3:
            atom_title = f"Concept {i+1}"

        # Get content paragraphs
        atom_content = '\n'.join([f"<p>{html.escape(p)}</p>" for p in section['content'][:3]])  # Max 3 paragraphs per atom

        # Assign quiz question if available
        atom_question = None
        if q_idx < len(questions):
            atom_question = questions[q_idx]
            q_idx += 1

        atoms.append({
            'id': f"atom-{i+1}",
            'number': i + 1,
            'title': atom_title,
            'content': atom_content,
            'question': atom_question
        })

    # If we have more questions than atoms, create additional atoms
    while q_idx < len(questions):
        q = questions[q_idx]
        atoms.append({
            'id': f"atom-extra-{q_idx}",
            'number': len(atoms) + 1,
            'title': f"Verificare {q_idx + 1}",
            'content': f"<p>Raspunde la intrebarea de mai jos pentru a-ti verifica cunostintele.</p>",
            'question': q
        })
        q_idx += 1

    # Ensure we have at least 2 atoms
    if len(atoms) < 2:
        atoms.append({
            'id': 'atom-summary',
            'number': len(atoms) + 1,
            'title': 'Rezumat',
            'content': '<p>Felicitari! Ai parcurs aceasta lectie.</p>',
            'question': None
        })

    # Generate HTML
    atoms_html = ""
    for atom in atoms:
        question_html = ""
        if atom['question']:
            q = atom['question']
            options_html = ""
            for j, opt in enumerate(q['options']):
                letter = chr(ord('a') + j)
                options_html += f'''
                    <div class="atom-option" data-answer="{letter}">
                        <span class="option-letter">{letter.upper()}</span>
                        <span class="option-text">{html.escape(opt)}</span>
                    </div>'''

            question_html = f'''
                <div class="atom-quiz" data-qid="{atom['id']}-q0">
                    <div class="atom-question-text">{html.escape(q['question'])}</div>
                    <div class="atom-options">
                        {options_html}
                    </div>
                    <div class="atom-feedback"></div>
                    <div class="atom-hint" style="display: none;">
                        <span class="hint-icon">&#128161;</span> {html.escape(q.get('hint', 'Gandeste-te bine!'))}
                    </div>
                </div>'''

        atoms_html += f'''
        <!-- Atom {atom['number']} -->
        <div class="atom" id="{atom['id']}" data-quiz='{json.dumps([atom["question"]] if atom["question"] else [], ensure_ascii=False)}'>
            <div class="atom-header">
                <div class="atom-number">{atom['number']}</div>
                <h3 class="atom-title">{html.escape(atom['title'])}</h3>
            </div>
            <div class="atom-content">
                {atom['content']}
            </div>
            {question_html}
        </div>
'''

    # Build the full HTML
    lesson_html = f'''<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{html.escape(lesson_data['title'])} | TIC Clasa a V-a</title>
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

        body {{
            font-family: 'Inter', sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            min-height: 100vh;
            line-height: 1.6;
        }}

        .container {{ max-width: 900px; margin: 0 auto; padding: 2rem; }}

        .nav-bar {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 2rem;
        }}

        .nav-link {{
            color: var(--accent-blue);
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
        }}

        .nav-link:hover {{ color: var(--accent-blue-light); }}

        .lesson-header {{ text-align: center; margin-bottom: 2rem; }}

        .lesson-badge {{
            display: inline-block;
            background: var(--accent-purple);
            color: white;
            padding: 0.5rem 1.5rem;
            border-radius: 50px;
            font-size: 0.875rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }}

        .lesson-title {{
            font-size: 2.25rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }}

        .lesson-subtitle {{ color: var(--text-secondary); font-size: 1rem; }}

        .progress-container {{
            background: var(--bg-card);
            border-radius: 12px;
            padding: 1rem 1.5rem;
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            gap: 1rem;
        }}

        .progress-label {{ font-size: 0.875rem; color: var(--text-secondary); white-space: nowrap; }}
        .progress-bar-wrapper {{ flex: 1; height: 8px; background: var(--bg-primary); border-radius: 4px; overflow: hidden; }}
        .progress-bar-fill {{ height: 100%; background: linear-gradient(90deg, var(--accent-blue), var(--success)); width: 0%; transition: width 0.5s ease; border-radius: 4px; }}
        .progress-percent {{ font-weight: 600; color: var(--accent-blue-light); min-width: 45px; text-align: right; }}

        .goal-section {{
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
            border: 1px solid var(--accent-purple);
            border-radius: 16px;
            padding: 1.5rem;
            margin-bottom: 2rem;
        }}

        .goal-header {{ display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }}
        .goal-icon {{ font-size: 1.5rem; }}
        .goal-title {{ font-size: 1.25rem; font-weight: 600; color: var(--accent-purple); }}
        .goal-text {{ font-style: italic; color: var(--text-secondary); font-size: 1.1rem; }}

        .atom {{
            background: var(--bg-card);
            border-radius: 16px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            border: 1px solid var(--border-color);
            transition: all 0.3s ease;
        }}

        .atom.atom-completed {{ border-color: var(--success); background: rgba(34, 197, 94, 0.05); }}

        .atom-header {{ display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }}

        .atom-number {{
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1rem;
            flex-shrink: 0;
        }}

        .atom-completed .atom-number {{ background: var(--success); }}

        .atom-title {{ font-size: 1.25rem; font-weight: 600; }}

        .atom-content {{ color: var(--text-secondary); margin-bottom: 1.5rem; }}
        .atom-content p {{ margin-bottom: 0.75rem; }}

        .atom-quiz {{ background: var(--bg-primary); border-radius: 12px; padding: 1.25rem; }}

        .atom-question-text {{ font-weight: 600; margin-bottom: 1rem; color: var(--text-primary); }}

        .atom-options {{ display: flex; flex-direction: column; gap: 0.5rem; }}

        .atom-option {{
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.875rem 1rem;
            background: var(--bg-card);
            border: 2px solid var(--border-color);
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s ease;
        }}

        .atom-option:hover {{ border-color: var(--accent-blue); transform: translateX(4px); }}
        .atom-option.selected {{ border-color: var(--accent-blue); background: rgba(59, 130, 246, 0.1); }}
        .atom-option.correct {{ border-color: var(--success); background: rgba(34, 197, 94, 0.15); }}
        .atom-option.incorrect {{ border-color: var(--error); background: rgba(239, 68, 68, 0.15); }}
        .atom-option.locked {{ pointer-events: none; opacity: 0.7; }}

        .option-letter {{
            width: 28px;
            height: 28px;
            background: var(--bg-primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 0.875rem;
            flex-shrink: 0;
        }}

        .atom-feedback {{
            margin-top: 1rem;
            padding: 0.875rem;
            border-radius: 8px;
            display: none;
            font-weight: 500;
        }}

        .atom-feedback.correct {{ display: block; background: rgba(34, 197, 94, 0.15); border: 1px solid var(--success); color: var(--success); }}
        .atom-feedback.incorrect {{ display: block; background: rgba(239, 68, 68, 0.15); border: 1px solid var(--error); color: var(--error); }}

        .atom-hint {{
            margin-top: 0.75rem;
            padding: 0.75rem;
            background: rgba(245, 158, 11, 0.1);
            border: 1px solid var(--warning);
            border-radius: 8px;
            font-size: 0.9rem;
            color: var(--warning);
        }}

        .hint-icon {{ margin-right: 0.5rem; }}

        .feedback-icon {{ margin-right: 0.5rem; }}

        .restart-section {{
            background: var(--bg-card);
            border-radius: 12px;
            padding: 1.5rem;
            margin-top: 2rem;
            text-align: center;
        }}

        .btn {{
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            border: none;
            font-size: 1rem;
            transition: all 0.3s ease;
        }}

        .btn-primary {{ background: var(--accent-blue); color: white; }}
        .btn-primary:hover {{ background: var(--accent-blue-light); }}

        footer {{
            text-align: center;
            padding: 2rem 0;
            border-top: 1px solid var(--border-color);
            color: var(--text-secondary);
            font-size: 0.875rem;
            margin-top: 2rem;
        }}

        footer a {{ color: var(--accent-blue); }}

        @media (max-width: 768px) {{
            .container {{ padding: 1rem; }}
            .lesson-title {{ font-size: 1.75rem; }}
        }}
    </style>
    <link rel="stylesheet" href="../../../../assets/css/mobile-first.css">
</head>
<body>
    <div class="container">
        <!-- Navigation -->
        <nav class="nav-bar">
            <a href="{lesson_data['nav_prev'] or 'index.html'}" class="nav-link">
                <span>&#8592;</span> Lectia anterioara
            </a>
            <a href="{lesson_data['nav_next'] or 'index.html'}" class="nav-link">
                Lectia urmatoare <span>&#8594;</span>
            </a>
        </nav>

        <!-- Lesson Header -->
        <header class="lesson-header">
            <span class="lesson-badge">{html.escape(lesson_data['badge'] or 'Invatare Atomica')}</span>
            <h1 class="lesson-title">{html.escape(lesson_data['title'])}</h1>
            <p class="lesson-subtitle">Citeste fiecare concept, apoi raspunde la intrebari pentru a continua</p>
        </header>

        <!-- Progress -->
        <div class="progress-container">
            <span class="progress-label">Progres lectie:</span>
            <div class="progress-bar-wrapper">
                <div class="progress-bar-fill" id="progress-fill"></div>
            </div>
            <span class="progress-percent" id="progress-percent">0%</span>
        </div>

        <!-- GOAL Section -->
        <section class="goal-section">
            <div class="goal-header">
                <span class="goal-icon">&#127919;</span>
                <h2 class="goal-title">Obiectivul lectiei</h2>
            </div>
            <p class="goal-text">"{html.escape(lesson_data['goal_text'] or 'Vreau sa inteleg conceptele din aceasta lectie!')}"</p>
        </section>

        <!-- Atomic Content -->
        <main id="atomic-content">
{atoms_html}
        </main>

        <!-- Lesson Summary -->
        <div id="lesson-summary" style="display: none;"></div>

        <!-- Restart Section -->
        <section class="restart-section">
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">
                Vrei un punctaj mai bun? Poti relua lectia de la inceput.
            </p>
            <button onclick="restartLesson()" class="btn" style="background: var(--error); color: white; margin-right: 0.5rem;">
                &#8634; Reia lectia
            </button>
            <button onclick="downloadProgress()" class="btn btn-primary">
                &#128190; Descarca progresul (JSON)
            </button>
        </section>
    </div>

    <footer>
        <p>&copy; 2026 Prof. Gurlan Vasile | <a href="index.html">Inapoi la modul</a></p>
    </footer>

    <!-- User System -->
    <script src="../../../../assets/js/user-system.js"></script>
    <!-- Atomic Learning System -->
    <script src="../../../../assets/js/atomic-learning.js"></script>
    <!-- Lesson Summary System -->
    <script src="../../../../assets/js/lesson-summary.js"></script>

    <script>
        document.addEventListener('DOMContentLoaded', function() {{
            // Initialize Atomic Learning
            AtomicLearning.init('{lesson_data['lesson_id']}');

            // Initialize all atoms
            document.querySelectorAll('.atom[data-quiz]').forEach(function(atomEl) {{
                var quizData = JSON.parse(atomEl.dataset.quiz || '[]');
                if (quizData.length > 0) {{
                    AtomicLearning.initAtom(atomEl.id, quizData);
                }}
            }});

            // Initialize Lesson Summary
            LessonSummary.init('{lesson_data['lesson_id']}');
        }});

        function restartLesson() {{
            if (confirm('Esti sigur ca vrei sa reiei lectia? Tot progresul va fi sters.')) {{
                localStorage.removeItem('atomic-progress-{lesson_data['lesson_id']}');
                localStorage.removeItem('lesson-summary-{lesson_data['lesson_id']}');
                window.location.reload();
            }}
        }}

        function downloadProgress() {{
            LessonSummary.downloadProgress('{lesson_data['lesson_id']}-progres.json');
        }}
    </script>
</body>
</html>'''

    return lesson_html


def convert_lesson(filepath: Path, output_suffix: str = '') -> dict:
    """Convert a lesson to atomic format."""
    result = {
        'input': str(filepath),
        'output': None,
        'status': 'error',
        'message': ''
    }

    try:
        # Parse existing lesson
        lesson_data = parse_existing_lesson(filepath)

        if not lesson_data['title']:
            result['message'] = 'Could not extract lesson title'
            return result

        if not lesson_data['content_sections'] and not lesson_data['quiz_questions']:
            result['message'] = 'No content or quiz questions found'
            return result

        # Generate atomic version
        atomic_html = generate_atomic_lesson(lesson_data)

        # Write output file
        if output_suffix:
            output_path = filepath.with_stem(filepath.stem + output_suffix)
        else:
            # Overwrite original
            output_path = filepath

        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(atomic_html)

        result['output'] = str(output_path)
        result['status'] = 'success'
        result['message'] = f"Converted with {len(lesson_data['quiz_questions'])} questions"
        result['atoms_created'] = len(lesson_data['content_sections']) or 1

    except Exception as e:
        result['message'] = str(e)
        import traceback
        result['traceback'] = traceback.format_exc()

    return result


def main():
    import argparse

    parser = argparse.ArgumentParser(description='Convert lessons to atomic format')
    parser.add_argument('file', nargs='?', help='Single file to convert')
    parser.add_argument('--folder', help='Convert all lessons in folder')
    parser.add_argument('--all-cls5', action='store_true', help='Convert all cls5 lessons')
    parser.add_argument('--suffix', default='', help='Suffix for output files (empty = overwrite)')
    parser.add_argument('--dry-run', action='store_true', help='Parse only, do not write')

    args = parser.parse_args()

    if not (args.file or args.folder or args.all_cls5):
        parser.print_help()
        return

    files_to_convert = []

    if args.file:
        files_to_convert = [Path(args.file)]
    elif args.folder:
        folder = CONTENT_ROOT / args.folder
        files_to_convert = list(folder.glob('lectia*.html'))
        files_to_convert = [f for f in files_to_convert if '-atomic' not in f.stem and '.bak' not in f.suffixes]
    elif args.all_cls5:
        cls5_path = CONTENT_ROOT / 'cls5'
        files_to_convert = list(cls5_path.rglob('lectia*.html'))
        files_to_convert = [f for f in files_to_convert if '-atomic' not in f.stem and '.bak' not in str(f)]

    print(f"Found {len(files_to_convert)} lessons to convert")
    print("=" * 50)

    success = 0
    failed = 0

    for filepath in sorted(files_to_convert):
        print(f"Converting: {filepath.name}...", end=' ')

        if args.dry_run:
            lesson_data = parse_existing_lesson(filepath)
            print(f"[DRY RUN] {len(lesson_data['quiz_questions'])} questions, {len(lesson_data['content_sections'])} sections")
            success += 1
        else:
            result = convert_lesson(filepath, args.suffix)
            if result['status'] == 'success':
                print(f"[OK] {result['message']}")
                success += 1
            else:
                print(f"[FAIL] {result['message']}")
                failed += 1

    print("=" * 50)
    print(f"Success: {success}, Failed: {failed}")


if __name__ == '__main__':
    main()
