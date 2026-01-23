"""
Extract all exercises from LearningHub lessons and save to JSON.
Handles multiple formats:
1. Atomic format: data-quiz='[{JSON}]' attribute
2. Legacy format: quiz-question HTML elements with onclick handlers
3. data-correct / data-value format
4. selectOption format
5. Practica Avansata (open-ended exercises)
"""
import os
import re
import json
from pathlib import Path
from html import unescape

def clean_html(text):
    """Remove HTML tags and clean up text."""
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    # Decode HTML entities
    text = unescape(text)
    # Clean whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def extract_practice_advanced(content):
    """Extract Practica Avansata exercises from HTML content."""
    practice_exercises = []

    # === FORMAT A: HTML practice-advanced section ===
    practice_match = re.search(
        r'<section[^>]*class="practice-advanced"[^>]*>(.*?)</section>',
        content, re.DOTALL
    )

    if practice_match:
        practice_content = practice_match.group(1)
        parts = re.split(r'<div[^>]*class="practice-exercise"[^>]*>', practice_content)
        exercise_matches = parts[1:] if len(parts) > 1 else []

        for ex_content in exercise_matches:
            exercise = {}
            title_match = re.search(r'<h4[^>]*>(.*?)</h4>', ex_content, re.DOTALL)
            if title_match:
                exercise["titlu"] = clean_html(title_match.group(1))

            desc_match = re.search(r'<p(?![^>]*class="answer-instruction")[^>]*>(.*?)</p>', ex_content, re.DOTALL)
            if desc_match:
                exercise["descriere"] = clean_html(desc_match.group(1))

            questions = []
            li_matches = re.findall(r'<li[^>]*>(.*?)</li>', ex_content, re.DOTALL)
            for li in li_matches:
                q_text = clean_html(li)
                if q_text:
                    questions.append(q_text)

            if questions:
                exercise["intrebari"] = questions

            exercise["tip"] = "deschis"

            if exercise.get("titlu") or exercise.get("descriere"):
                practice_exercises.append(exercise)

    # === FORMAT B: HTML practice-section with practice-task ===
    practice_section_match = re.search(
        r'<section[^>]*class="practice-section"[^>]*>(.*?)</section>',
        content, re.DOTALL
    )

    if practice_section_match and not practice_exercises:
        practice_content = practice_section_match.group(1)
        parts = re.split(r'<div[^>]*class="practice-task"[^>]*>', practice_content)
        task_matches = parts[1:] if len(parts) > 1 else []

        for task_content in task_matches:
            exercise = {}
            title_match = re.search(r'<h4[^>]*>(.*?)</h4>', task_content, re.DOTALL)
            if title_match:
                exercise["titlu"] = clean_html(title_match.group(1))

            desc_match = re.search(r'<p[^>]*>(.*?)</p>', task_content, re.DOTALL)
            if desc_match:
                exercise["descriere"] = clean_html(desc_match.group(1))

            questions = []
            li_matches = re.findall(r'<li[^>]*>(.*?)</li>', task_content, re.DOTALL)
            for li in li_matches:
                q_text = clean_html(li)
                if q_text:
                    questions.append(q_text)

            if questions:
                exercise["intrebari"] = questions

            exercise["tip"] = "deschis"

            if exercise.get("titlu") or exercise.get("descriere"):
                practice_exercises.append(exercise)

    # === FORMAT C: practice-problem divs (C++ algorithms style) ===
    if 'practice-problem' in content:
        problem_parts = re.split(r'<div[^>]*class="practice-problem[^"]*"[^>]*data-problem="([^"]+)"[^>]*>', content)
        i = 1
        while i < len(problem_parts) - 1:
            problem_id = problem_parts[i]
            problem_content = problem_parts[i + 1]

            exercise = {"tip": "practica_cod"}

            # Extract full title (includes nested spans)
            title_match = re.search(r'<span[^>]*class="problem-title"[^>]*>(.*?)</span>\s*</span>', problem_content, re.DOTALL)
            if not title_match:
                title_match = re.search(r'<span[^>]*class="problem-title"[^>]*>(.*?)</span>', problem_content, re.DOTALL)
            if title_match:
                exercise["titlu"] = clean_html(title_match.group(1))

            # Extract difficulty
            diff_match = re.search(r'<span[^>]*class="difficulty-badge[^"]*"[^>]*>([^<]+)</span>', problem_content)
            if diff_match:
                exercise["dificultate"] = clean_html(diff_match.group(1))

            # Extract problem description
            desc_match = re.search(r'<p[^>]*class="problem-desc"[^>]*>(.*?)</p>', problem_content, re.DOTALL)
            if desc_match:
                exercise["cerinta"] = clean_html(desc_match.group(1))

            # Extract project intro
            intro_match = re.search(r'<p[^>]*class="project-intro"[^>]*>(.*?)</p>', problem_content, re.DOTALL)
            if intro_match:
                exercise["cerinta"] = clean_html(intro_match.group(1))

            # Extract steps from test-io-value spans
            steps = []
            step_matches = re.findall(r'<span[^>]*class="test-io-value"[^>]*>(.*?)</span>', problem_content, re.DOTALL)
            for step in step_matches:
                step_text = clean_html(step)
                if step_text:
                    steps.append(step_text)
            if steps:
                exercise["pasi"] = steps

            # Extract checkpoints (for mini-projects)
            checkpoints = []
            cp_matches = re.findall(r'<span[^>]*class="checkpoint-text"[^>]*>(.*?)</span>', problem_content, re.DOTALL)
            for cp in cp_matches:
                cp_text = clean_html(cp)
                if cp_text:
                    checkpoints.append(cp_text)
            if checkpoints:
                exercise["checkpoint_uri"] = checkpoints

            # Extract hint
            hint_match = re.search(r'<div[^>]*class="hint-content"[^>]*[^>]*>(.*?)</div>', problem_content, re.DOTALL)
            if hint_match:
                exercise["hint"] = clean_html(hint_match.group(1))

            if exercise.get("titlu") or exercise.get("cerinta"):
                practice_exercises.append(exercise)

            i += 2

    # === FORMAT D: JavaScript AdvancedPractice.init() ===
    js_match = re.search(r'AdvancedPractice\.init\s*\([^,]+,\s*\[(.*?)\]\s*\);', content, re.DOTALL)
    if js_match:
        js_content = js_match.group(1)

        # Parse JavaScript object literals
        # Find each exercise object { type: ... }
        obj_pattern = r'\{\s*type:\s*[\'"](\w+)[\'"]([^}]+(?:\{[^}]*\}[^}]*)*)\}'
        obj_matches = re.findall(obj_pattern, js_content, re.DOTALL)

        for ex_type, ex_content in obj_matches:
            exercise = {"tip": ex_type}

            # Extract question
            q_match = re.search(r'question:\s*[\'"]([^\'"]+)[\'"]', ex_content)
            if q_match:
                exercise["cerinta"] = q_match.group(1)

            # Extract scenario (for scenario type)
            scenario_match = re.search(r'scenario:\s*[\'"]([^\'"]+)[\'"]', ex_content)
            if scenario_match:
                exercise["context"] = scenario_match.group(1)

            # Extract options array
            options_match = re.search(r'options:\s*\[(.*?)\]', ex_content, re.DOTALL)
            if options_match:
                opts_content = options_match.group(1)
                opts = re.findall(r'[\'"]([^\'"]+)[\'"]', opts_content)
                if opts:
                    exercise["optiuni"] = opts

            # Extract choices (for scenario type)
            choices_match = re.search(r'choices:\s*\[(.*?)\]', ex_content, re.DOTALL)
            if choices_match:
                choices_content = choices_match.group(1)
                texts = re.findall(r'text:\s*[\'"]([^\'"]+)[\'"]', choices_content)
                if texts:
                    exercise["optiuni"] = texts

            # Extract correct answer
            correct_match = re.search(r'correct:\s*[\'"]([^\'"]+)[\'"]', ex_content)
            if correct_match:
                exercise["raspuns_corect"] = correct_match.group(1)

            # Extract correctChoice (for scenario type)
            correct_choice_match = re.search(r'correctChoice:\s*(\d+)', ex_content)
            if correct_choice_match:
                idx = int(correct_choice_match.group(1))
                exercise["raspuns_corect"] = chr(ord('a') + idx)

            # Extract explanation
            expl_match = re.search(r'explanation:\s*[\'"]([^\'"]+)[\'"]', ex_content)
            if expl_match:
                exercise["explicatie"] = expl_match.group(1)

            # Extract items (for dragdrop)
            items_match = re.search(r'items:\s*\[(.*?)\]', ex_content, re.DOTALL)
            if items_match and ex_type == 'dragdrop':
                items_content = items_match.group(1)
                labels = re.findall(r'label:\s*[\'"]([^\'"]+)[\'"]', items_content)
                categories = re.findall(r'category:\s*[\'"]([^\'"]+)[\'"]', items_content)
                if labels and categories:
                    exercise["elemente"] = [{"label": l, "categorie": c} for l, c in zip(labels, categories)]

            # Extract slots (for schema type)
            slots_match = re.search(r'slots:\s*\[(.*?)\]', ex_content, re.DOTALL)
            if slots_match and ex_type == 'schema':
                slots_content = slots_match.group(1)
                slot_labels = re.findall(r'label:\s*[\'"]([^\'"]+)[\'"]', slots_content)
                slot_correct = re.findall(r'correct:\s*[\'"]([^\'"]+)[\'"]', slots_content)
                if slot_labels:
                    exercise["spatii"] = [{"label": l, "corect": c} for l, c in zip(slot_labels, slot_correct)]

            # Extract hints (for written type)
            hints_match = re.search(r'hints:\s*\[(.*?)\]', ex_content, re.DOTALL)
            if hints_match and ex_type == 'written':
                hints_content = hints_match.group(1)
                hints = re.findall(r'[\'"]([^\'"]+)[\'"]', hints_content)
                if hints:
                    exercise["indicii"] = hints

            # Extract keywords (for written type)
            keywords_match = re.search(r'keywords:\s*\[(.*?)\]', ex_content, re.DOTALL)
            if keywords_match and ex_type == 'written':
                kw_content = keywords_match.group(1)
                keywords = re.findall(r'[\'"]([^\'"]+)[\'"]', kw_content)
                if keywords:
                    exercise["cuvinte_cheie"] = keywords

            if exercise.get("cerinta") or exercise.get("context"):
                practice_exercises.append(exercise)

    return practice_exercises

def extract_exercises_from_html(file_path):
    """Extract quiz data from a lesson HTML file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    exercises = []

    # Extract lesson title - try multiple patterns
    title_match = re.search(r'<h1[^>]*>([^<]+)</h1>', content)
    lesson_title = title_match.group(1).strip() if title_match else "Unknown"
    # Clean title
    lesson_title = re.sub(r'\s+', ' ', lesson_title)

    # === FORMAT 1: Atomic format with data-quiz JSON ===
    quiz_pattern = r"data-quiz='(\[.*?\])'"
    matches = re.findall(quiz_pattern, content, re.DOTALL)

    for match in matches:
        try:
            quiz_data = json.loads(match)
            for q in quiz_data:
                exercise = {
                    "cerinta": q.get("question", ""),
                    "optiuni": q.get("options", []),
                    "raspuns_corect": q.get("correct", ""),
                    "hint": q.get("hint", "")
                }
                exercises.append(exercise)
        except json.JSONDecodeError:
            continue

    # === FORMAT 2: Legacy HTML format with onclick handlers ===
    if not exercises:
        question_pattern = r'<div[^>]*class="quiz-question"[^>]*id="q(\d+)"[^>]*>(.*?)</div>\s*<div[^>]*class="feedback"'
        question_matches = re.findall(question_pattern, content, re.DOTALL)

        for q_num, q_content in question_matches:
            q_text_match = re.search(r'<p>([^<]+)</p>', q_content)
            if not q_text_match:
                continue

            question_text = q_text_match.group(1).strip()
            question_text = re.sub(r'^\d+\.\s*', '', question_text)

            options = []
            correct_idx = None
            option_pattern = r'<div[^>]*class="quiz-option"[^>]*onclick="checkAnswer\(\d+,\s*this,\s*(true|false)\)"[^>]*>([^<]+)</div>'
            option_matches = re.findall(option_pattern, q_content)

            for idx, (is_correct, opt_text) in enumerate(option_matches):
                options.append(opt_text.strip())
                if is_correct == "true":
                    correct_idx = chr(ord('a') + idx)

            if options:
                exercise = {
                    "cerinta": question_text,
                    "optiuni": options,
                    "raspuns_corect": correct_idx or "",
                    "hint": ""
                }
                exercises.append(exercise)

    # === FORMAT 3: data-correct / data-value format ===
    if not exercises and 'data-correct="' in content:
        # Split by quiz-question divs with data-correct
        parts = re.split(r'(<div[^>]*class="quiz-question"[^>]*data-correct="[a-z]"[^>]*>)', content)
        i = 1
        while i < len(parts):
            header = parts[i]
            correct_match = re.search(r'data-correct="([a-z])"', header)
            if correct_match and i+1 < len(parts):
                correct = correct_match.group(1)
                q_content = parts[i+1]

                q_text_match = re.search(r'<p>([^<]+)</p>', q_content)
                if q_text_match:
                    question_text = q_text_match.group(1).strip()
                    question_text = re.sub(r'^\d+\.\s*', '', question_text)

                    options = []
                    option_pattern = r'<div[^>]*class="quiz-option"[^>]*data-value="([a-z])"[^>]*>([^<]+)</div>'
                    option_matches = re.findall(option_pattern, q_content)

                    for val, opt_text in option_matches:
                        options.append(opt_text.strip())

                    if options:
                        exercises.append({
                            "cerinta": question_text,
                            "optiuni": options,
                            "raspuns_corect": correct,
                            "hint": ""
                        })
            i += 2

    # === FORMAT 4: selectOption format (question-text + options with selectOption) ===
    if not exercises and 'selectOption(' in content:
        # Find all quiz-question divs
        q_pattern = r'<div[^>]*class="quiz-question"[^>]*id="(q\d+)"[^>]*>(.*?)</div>\s*<div[^>]*class="feedback"'
        q_matches = re.findall(q_pattern, content, re.DOTALL)

        for q_id, q_content in q_matches:
            # Find question text (in question-text div)
            q_text_match = re.search(r'<div[^>]*class="question-text"[^>]*>([^<]+)</div>', q_content)
            if not q_text_match:
                continue

            question_text = q_text_match.group(1).strip()
            question_text = re.sub(r'^\d+\.\s*', '', question_text)

            # Find options with selectOption
            options = []
            correct_idx = None
            option_pattern = r'<div[^>]*class="option"[^>]*onclick="selectOption\(this,\s*[\'"]' + q_id + r'[\'"]\s*,\s*(true|false)\)"[^>]*>\s*([^<]+?)\s*</div>'
            option_matches = re.findall(option_pattern, q_content, re.DOTALL)

            for idx, (is_correct, opt_text) in enumerate(option_matches):
                options.append(opt_text.strip())
                if is_correct == "true":
                    correct_idx = chr(ord('a') + idx)

            if options:
                exercises.append({
                    "cerinta": question_text,
                    "optiuni": options,
                    "raspuns_corect": correct_idx or "",
                    "hint": ""
                })

    # === PRACTICA AVANSATA ===
    practice_exercises = extract_practice_advanced(content)

    return lesson_title, exercises, practice_exercises

def get_class_info(file_path):
    """Extract class, module, and lesson info from file path."""
    path_str = str(file_path)

    # Extract class (cls5, cls6, etc.)
    cls_match = re.search(r'cls(\d+)', path_str)
    clasa = f"clasa_{cls_match.group(1)}" if cls_match else "unknown"

    # Extract module
    module_match = re.search(r'm\d+-([^/\\]+)', path_str)
    modul = module_match.group(1) if module_match else "unknown"

    # Extract lesson name
    lesson_match = re.search(r'(lectia\d+[^/\\]*?)\.html', path_str)
    lectie = lesson_match.group(1) if lesson_match else "unknown"

    return clasa, modul, lectie

def main():
    content_path = Path(r"C:\AI\Projects\LearningHub\content\tic")
    output_path = Path(r"A:\learninghub_exercises.json")

    # Find all lesson files
    lesson_files = list(content_path.glob("**/lectia*.html"))

    print(f"Found {len(lesson_files)} lesson files")

    # Structure: {clasa: {modul: {lectie: {titlu, exercitii}}}}
    all_data = {}

    for file_path in sorted(lesson_files):
        clasa, modul, lectie = get_class_info(file_path)
        title, exercises, practice = extract_exercises_from_html(file_path)

        if not exercises and not practice:
            continue

        if clasa not in all_data:
            all_data[clasa] = {}
        if modul not in all_data[clasa]:
            all_data[clasa][modul] = {}

        lesson_data = {
            "titlu": title,
            "exercitii": exercises
        }

        if practice:
            lesson_data["practica_avansata"] = practice

        all_data[clasa][modul][lectie] = lesson_data

        practice_count = len(practice) if practice else 0
        print(f"  {clasa}/{modul}/{lectie}: {len(exercises)} quiz + {practice_count} practica")

    # Count totals
    total_quiz = 0
    total_practice = 0
    for clasa in all_data:
        for modul in all_data[clasa]:
            for lectie in all_data[clasa][modul]:
                total_quiz += len(all_data[clasa][modul][lectie]["exercitii"])
                if "practica_avansata" in all_data[clasa][modul][lectie]:
                    total_practice += len(all_data[clasa][modul][lectie]["practica_avansata"])

    # Create final structure
    output = {
        "meta": {
            "project": "LearningHub",
            "description": "Exercitii extrase din toate lectiile TIC",
            "total_clase": len(all_data),
            "total_exercitii_quiz": total_quiz,
            "total_practica_avansata": total_practice,
            "total_exercitii": total_quiz + total_practice
        },
        "clase": all_data
    }

    # Save to A:
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"\nSaved to {output_path}")
    print(f"Total: {total_quiz} quiz + {total_practice} practica = {total_quiz + total_practice} exercitii din {len(lesson_files)} lectii")

if __name__ == "__main__":
    main()
