#!/usr/bin/env python3
"""
Extract comprehensive lesson data for AI analysis.
Supports both atomic learning format and traditional quiz format.
"""

import os
import re
import json
from pathlib import Path
from html import unescape

def clean_text(text):
    """Clean HTML text, remove tags and decode entities."""
    if not text:
        return ""
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', ' ', text)
    # Decode HTML entities
    text = unescape(text)
    # Clean whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def extract_atomic_format(html_content):
    """Extract data from atomic learning format (data-quiz attributes)."""
    atoms = []
    questions = []

    # Find all atoms with data-quiz
    atom_pattern = r'<div[^>]*class="atom"[^>]*id="(atom-\d+)"[^>]*data-quiz=\'(\[.*?\])\'[^>]*>(.*?)</div>\s*(?=<div[^>]*class="atom"|<!-- Atom|<section|</main|<div class="restart)'
    matches = re.findall(atom_pattern, html_content, re.DOTALL)

    if not matches:
        # Try simpler pattern
        atom_pattern = r'<div[^>]*id="(atom-\d+)"[^>]*data-quiz=\'(\[.*?\])\'[^>]*>'
        simple_matches = re.findall(atom_pattern, html_content, re.DOTALL)

        for atom_id, quiz_json in simple_matches:
            try:
                quiz_data = json.loads(quiz_json)
                for q in quiz_data:
                    questions.append({
                        "atom_id": atom_id,
                        "question": q.get("question", ""),
                        "options": [{"letter": chr(97+i), "text": opt} for i, opt in enumerate(q.get("options", []))],
                        "correct_answer": q.get("correct", ""),
                        "hint": q.get("hint", "")
                    })
            except json.JSONDecodeError:
                pass

    for atom_id, quiz_json, content in matches:
        # Extract atom content
        title_match = re.search(r'<h3[^>]*class="atom-title"[^>]*>(.*?)</h3>', content, re.DOTALL)
        content_match = re.search(r'<div[^>]*class="atom-content"[^>]*>(.*?)</div>', content, re.DOTALL)

        atom = {
            "id": atom_id,
            "title": clean_text(title_match.group(1)) if title_match else "",
            "content": clean_text(content_match.group(1)) if content_match else ""
        }
        atoms.append(atom)

        # Parse quiz JSON
        try:
            quiz_data = json.loads(quiz_json)
            for q in quiz_data:
                questions.append({
                    "atom_id": atom_id,
                    "atom_title": atom["title"],
                    "atom_content": atom["content"],
                    "question": q.get("question", ""),
                    "options": [{"letter": chr(97+i), "text": opt} for i, opt in enumerate(q.get("options", []))],
                    "correct_answer": q.get("correct", ""),
                    "hint": q.get("hint", "")
                })
        except json.JSONDecodeError:
            pass

    return atoms, questions


def extract_traditional_format(html_content):
    """Extract data from traditional quiz format."""
    concepts = []
    questions = []

    # Extract concept cards
    concept_pattern = r'<div[^>]*class="[^"]*concept-card[^"]*"[^>]*>(.*?)</div>\s*</div>'
    matches = re.findall(concept_pattern, html_content, re.DOTALL)

    for match in matches:
        name_match = re.search(r'class="[^"]*concept-name[^"]*"[^>]*>([^<]+)', match)
        content = clean_text(match)
        if name_match or content:
            concepts.append({
                "name": clean_text(name_match.group(1)) if name_match else "",
                "content": content
            })

    # Extract quiz questions
    q_pattern = r'<div[^>]*class="[^"]*quiz-question[^"]*"[^>]*(?:data-question="(\d+)")?[^>]*>(.*?)</div>\s*</div>'
    q_matches = re.findall(q_pattern, html_content, re.DOTALL)

    for idx, (q_num, content) in enumerate(q_matches):
        q_text_match = re.search(r'<h4[^>]*>(.*?)</h4>', content, re.DOTALL)
        if q_text_match:
            question = {
                "index": int(q_num) if q_num else idx,
                "question": clean_text(q_text_match.group(1)),
                "options": []
            }

            # Extract options
            opt_pattern = r'<div[^>]*class="[^"]*quiz-option[^"]*"[^>]*data-answer="([^"]+)"[^>]*>(.*?)</div>'
            opt_matches = re.findall(opt_pattern, content, re.DOTALL)
            for letter, opt_text in opt_matches:
                question["options"].append({
                    "letter": letter,
                    "text": clean_text(opt_text)
                })

            questions.append(question)

    # Extract correctAnswers from JS
    correct_match = re.search(r"correctAnswers\s*=\s*\[(.*?)\]", html_content, re.DOTALL)
    if correct_match:
        correct_answers = re.findall(r"['\"]([^'\"]+)['\"]", correct_match.group(1))
        for i, q in enumerate(questions):
            if i < len(correct_answers):
                q["correct_answer"] = correct_answers[i]

    # Extract explanations from JS
    exp_match = re.search(r"explanations\s*=\s*\{(.*?)\}", html_content, re.DOTALL)
    if exp_match:
        pairs = re.findall(r"(\d+)\s*:\s*['\"]([^'\"]+)['\"]", exp_match.group(1))
        for key, value in pairs:
            idx = int(key)
            if idx < len(questions):
                questions[idx]["explanation"] = value

    return concepts, questions


def extract_goal_section(html_content):
    """Extract goal/objective section."""
    # Try multiple patterns
    patterns = [
        r'class="[^"]*goal-desc[^"]*"[^>]*>(.*?)</p>',
        r'class="[^"]*goal-text[^"]*"[^>]*>(.*?)</p>',
        r'<section[^>]*class="[^"]*goal[^"]*"[^>]*>(.*?)</section>'
    ]

    for pattern in patterns:
        match = re.search(pattern, html_content, re.DOTALL)
        if match:
            return clean_text(match.group(1))
    return ""


def extract_learn_section(html_content):
    """Extract full learn section content."""
    patterns = [
        r'id="section-learn"[^>]*>(.*?)</div>\s*<div class="nav-buttons"',
        r'class="[^"]*learn-section[^"]*"[^>]*>(.*?)</div>\s*<div class="nav-buttons"',
        r'<main[^>]*id="atomic-content"[^>]*>(.*?)</main>'
    ]

    for pattern in patterns:
        match = re.search(pattern, html_content, re.DOTALL)
        if match:
            return clean_text(match.group(1))
    return ""


def extract_practice_section(html_content):
    """Extract practice exercises."""
    exercises = []

    pattern = r'<section[^>]*class="[^"]*practice-advanced[^"]*"[^>]*>(.*?)</section>'
    match = re.search(pattern, html_content, re.DOTALL)

    if match:
        practice_html = match.group(1)
        ex_pattern = r'<div[^>]*class="[^"]*practice-exercise[^"]*"[^>]*>(.*?)</div>\s*(?=<div[^>]*class="[^"]*practice-exercise|</section|<script)'
        ex_matches = re.findall(ex_pattern, practice_html, re.DOTALL)

        for ex in ex_matches:
            title_match = re.search(r'<h4[^>]*>(.*?)</h4>', ex, re.DOTALL)
            desc_match = re.search(r'<p[^>]*>(.*?)</p>', ex, re.DOTALL)

            exercises.append({
                "title": clean_text(title_match.group(1)) if title_match else "",
                "description": clean_text(desc_match.group(1)) if desc_match else ""
            })

    return exercises


def analyze_question_coverage(atoms, questions, learn_content):
    """Analyze if questions are covered by lesson content."""
    issues = []

    for q in questions:
        q_text = q.get("question", "").lower()
        atom_content = q.get("atom_content", "").lower()

        # Check for visual/color questions without visual content
        if any(word in q_text for word in ["culoare", "color", "arata", "forma", "aspect"]):
            if not any(word in atom_content for word in ["portocaliu", "orange", "albastru", "blue", "verde", "green", "mov", "purple", "rosu", "red", "galben", "yellow"]):
                issues.append({
                    "type": "visual_without_description",
                    "question": q.get("question"),
                    "atom_content": q.get("atom_content", ""),
                    "suggestion": "Intrebarea cere identificarea vizuala a unui element fara ca lectia sa descrie acest aspect. Sugestie: adauga o descriere vizuala sau indica elevului sa verifice in aplicatie."
                })

        # Check for tool-specific questions
        if any(tool in q_text for tool in ["scratch", "word", "powerpoint", "excel", "access", "codeblocks"]):
            if "deschide" not in atom_content and "aplicati" not in atom_content and "program" not in atom_content:
                issues.append({
                    "type": "tool_reference_without_instruction",
                    "question": q.get("question"),
                    "atom_content": q.get("atom_content", ""),
                    "suggestion": "Intrebarea face referire la o aplicatie specifica. Sugestie: indica clar ca elevul trebuie sa deschida aplicatia pentru a verifica."
                })

        # Check for concept not explained
        correct_opt = None
        for opt in q.get("options", []):
            if opt.get("letter") == q.get("correct_answer"):
                correct_opt = opt.get("text", "").lower()
                break

        if correct_opt and correct_opt not in atom_content and correct_opt not in learn_content.lower():
            issues.append({
                "type": "answer_not_in_content",
                "question": q.get("question"),
                "correct_answer": correct_opt,
                "atom_content": q.get("atom_content", ""),
                "suggestion": f"Raspunsul corect '{correct_opt}' nu apare in continutul lectiei. Sugestie: adauga explicatia sau indica sursa de verificare."
            })

    return issues


def analyze_lesson(file_path):
    """Analyze a single lesson file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Extract title
    title_match = re.search(r'<title>(.*?)</title>', html_content)
    title = clean_text(title_match.group(1)) if title_match else ""

    # Determine format and extract data
    is_atomic = 'data-quiz=' in html_content or 'atomic-content' in html_content

    if is_atomic:
        atoms, questions = extract_atomic_format(html_content)
        concepts = [{"name": a["title"], "content": a["content"]} for a in atoms]
    else:
        concepts, questions = extract_traditional_format(html_content)
        atoms = []

    # Extract other sections
    goal = extract_goal_section(html_content)
    learn_content = extract_learn_section(html_content)
    practice = extract_practice_section(html_content)

    # Analyze coverage
    issues = analyze_question_coverage(atoms, questions, learn_content)

    # Build relative path
    rel_path = str(file_path).replace('\\', '/')
    if 'content/' in rel_path:
        rel_path = rel_path.split('content/')[1]

    return {
        "file_path": rel_path,
        "title": title,
        "format": "atomic" if is_atomic else "traditional",
        "goal_description": goal,
        "concepts_taught": concepts,
        "full_learn_content": learn_content[:2000] + "..." if len(learn_content) > 2000 else learn_content,
        "quiz_questions": questions,
        "practice_exercises": practice,
        "potential_issues": issues,
        "metadata": {
            "num_concepts": len(concepts),
            "num_questions": len(questions),
            "num_practice": len(practice),
            "num_issues": len(issues)
        }
    }


def main():
    base_path = Path("C:/AI/Projects/LearningHub/content/tic")
    output_file = Path("A:/learninghub_lessons_full_analysis.json")

    all_lessons = []
    total_issues = []

    # Process all lesson files
    for html_file in sorted(base_path.rglob("lectia*.html")):
        print(f"Processing: {html_file.name}")
        try:
            lesson_data = analyze_lesson(html_file)
            all_lessons.append(lesson_data)

            # Collect issues with file reference
            for issue in lesson_data["potential_issues"]:
                issue["file"] = lesson_data["file_path"]
                total_issues.append(issue)

        except Exception as e:
            print(f"  Error: {e}")

    # Create summary
    summary = {
        "total_lessons": len(all_lessons),
        "total_concepts": sum(l["metadata"]["num_concepts"] for l in all_lessons),
        "total_questions": sum(l["metadata"]["num_questions"] for l in all_lessons),
        "total_practice": sum(l["metadata"]["num_practice"] for l in all_lessons),
        "total_potential_issues": len(total_issues),
        "lessons_by_format": {
            "atomic": len([l for l in all_lessons if l["format"] == "atomic"]),
            "traditional": len([l for l in all_lessons if l["format"] == "traditional"])
        },
        "issues_by_type": {}
    }

    # Count issues by type
    for issue in total_issues:
        issue_type = issue["type"]
        if issue_type not in summary["issues_by_type"]:
            summary["issues_by_type"][issue_type] = 0
        summary["issues_by_type"][issue_type] += 1

    output = {
        "meta": {
            "description": "Full lesson analysis for AI review",
            "purpose": "Identify gaps where questions test concepts not taught in the lesson",
            "generated_from": "LearningHub TIC lessons",
            "analysis_criteria": [
                "visual_without_description: Intrebari despre aspecte vizuale (culori, forme) fara descriere in lectie",
                "tool_reference_without_instruction: Referinte la aplicatii fara instructiuni de verificare",
                "answer_not_in_content: Raspunsul corect nu apare in continutul lectiei"
            ],
            "usage": "Acest JSON poate fi folosit de AI pentru a genera sugestii de imbunatatire pentru fiecare lectie"
        },
        "summary": summary,
        "all_potential_issues": total_issues,
        "lessons": all_lessons
    }

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*50}")
    print(f"Analysis complete!")
    print(f"{'='*50}")
    print(f"Total lessons: {summary['total_lessons']}")
    print(f"  - Atomic format: {summary['lessons_by_format']['atomic']}")
    print(f"  - Traditional format: {summary['lessons_by_format']['traditional']}")
    print(f"Total concepts: {summary['total_concepts']}")
    print(f"Total questions: {summary['total_questions']}")
    print(f"Total practice exercises: {summary['total_practice']}")
    print(f"Potential issues found: {summary['total_potential_issues']}")
    if summary["issues_by_type"]:
        print(f"\nIssues by type:")
        for issue_type, count in summary["issues_by_type"].items():
            print(f"  - {issue_type}: {count}")
    print(f"\nOutput saved to: {output_file}")


if __name__ == "__main__":
    main()
