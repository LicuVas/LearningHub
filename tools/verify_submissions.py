#!/usr/bin/env python3
"""
LearningHub - Script de verificare submisii cu AI

Folosire:
    python verify_submissions.py --folder submissions/cls5/m3-word
    python verify_submissions.py --file submission.json
    python verify_submissions.py --grade cls5 --module m3-word --all

Structura submisiei (JSON):
{
    "student": {"name": "...", "class": "..."},
    "lesson": "cls5/m3-word/lectia1",
    "timestamp": "2026-01-19T10:00:00",
    "answers": {
        "minim": {"m1": "...", "m2": "...", ...},
        "standard": {"s1": "...", ...},
        "performanta": {"p1": "...", ...}
    }
}
"""

import json
import os
import sys
import argparse
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Any

# Calea catre worksheets
WORKSHEETS_DIR = Path(__file__).parent.parent / "data" / "worksheets"
SUBMISSIONS_DIR = Path(__file__).parent.parent / "submissions"
RESULTS_DIR = Path(__file__).parent.parent / "results"


def load_worksheet(grade: str) -> Dict:
    """Incarca fisierul de worksheet pentru o clasa."""
    worksheet_path = WORKSHEETS_DIR / f"{grade}.json"
    if not worksheet_path.exists():
        raise FileNotFoundError(f"Nu exista worksheet pentru {grade}")

    with open(worksheet_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def find_lesson_questions(worksheet: Dict, lesson_id: str) -> Optional[Dict]:
    """Gaseste intrebarile pentru o lectie specifica."""
    for module in worksheet.get("modules", []):
        for lesson in module.get("lessons", []):
            if lesson["lesson_id"] == lesson_id or \
               f"{module['module_id']}/{lesson['lesson_id']}" in lesson_id:
                return lesson
    return None


def auto_grade_mcq(answer: Any, correct_index: int, options: List[str]) -> Dict:
    """Noteaza automat o intrebare MCQ."""
    # Answer poate fi index (0-3) sau textul optiunii
    if isinstance(answer, int):
        is_correct = answer == correct_index
    elif isinstance(answer, str):
        # Verifica daca e textul optiunii corecte
        try:
            answer_index = int(answer)
            is_correct = answer_index == correct_index
        except ValueError:
            # E text, verifica daca e optiunea corecta
            is_correct = answer.lower().strip() == options[correct_index].lower().strip()
    else:
        is_correct = False

    return {
        "correct": is_correct,
        "score": 1.0 if is_correct else 0.0,
        "feedback": "Corect!" if is_correct else f"Raspunsul corect era: {options[correct_index]}"
    }


def ai_grade_open_question(question: Dict, answer: str, item_type: str) -> Dict:
    """
    Noteaza o intrebare deschisa folosind AI.

    Aceasta functie poate fi conectata la un API AI (Claude, GPT, etc.)
    Pentru moment, returneaza un placeholder care trebuie verificat manual.
    """
    # Extrage informatii pentru grading
    hints = question.get("answer_hints", [])
    key_points = question.get("key_points", [])
    rubric = question.get("rubric", {})

    # Verifica daca raspunsul contine keywords
    answer_lower = answer.lower()
    hints_found = sum(1 for hint in hints if hint.lower() in answer_lower)
    points_found = sum(1 for point in key_points if point.lower() in answer_lower)

    # Scor simplu bazat pe keywords (poate fi inlocuit cu AI)
    total_expected = len(hints) + len(key_points)
    if total_expected > 0:
        keyword_score = (hints_found + points_found) / total_expected
    else:
        keyword_score = 0.5  # Default pentru intrebari fara hints

    # Verifica lungimea minima
    min_length = 20 if item_type in ["short", "explain"] else 50
    length_ok = len(answer.strip()) >= min_length

    if not length_ok:
        return {
            "correct": None,  # Necesita review manual
            "score": 0.3,
            "feedback": f"Raspunsul e prea scurt (minim {min_length} caractere).",
            "needs_review": True,
            "auto_score": keyword_score
        }

    return {
        "correct": None,  # Necesita review manual pentru precizie
        "score": keyword_score,
        "feedback": f"Scor automat: {keyword_score:.0%}. Verificare manuala recomandata.",
        "needs_review": True,
        "keywords_found": hints_found + points_found,
        "keywords_expected": total_expected
    }


def grade_submission(submission: Dict, worksheet: Dict) -> Dict:
    """Noteaza o submisie completa."""
    lesson_path = submission.get("lesson", "")

    # Extrage grade si lesson_id
    parts = lesson_path.split("/")
    if len(parts) >= 3:
        grade = parts[0]
        module_id = parts[1]
        lesson_id = parts[2]
    else:
        return {"error": f"Format lectie invalid: {lesson_path}"}

    # Gaseste intrebarile
    lesson = find_lesson_questions(worksheet, lesson_id)
    if not lesson:
        return {"error": f"Lectia nu a fost gasita: {lesson_id}"}

    results = {
        "student": submission.get("student", {}),
        "lesson": lesson_path,
        "timestamp_submission": submission.get("timestamp"),
        "timestamp_graded": datetime.now().isoformat(),
        "levels": {},
        "summary": {}
    }

    total_points = 0
    max_points = 0
    needs_review = False

    # Proceseaza fiecare nivel
    for level in ["minim", "standard", "performanta"]:
        level_data = lesson.get("levels", {}).get(level, {})
        student_answers = submission.get("answers", {}).get(level, {})

        level_results = {
            "items": [],
            "points": 0,
            "max_points": level_data.get("punctaj_max", 0)
        }

        for item in level_data.get("items", []):
            item_id = item.get("id")
            item_type = item.get("type")
            item_points = item.get("points", 0)
            student_answer = student_answers.get(item_id, "")

            item_result = {
                "id": item_id,
                "type": item_type,
                "question": item.get("question", item.get("description", "")),
                "student_answer": student_answer,
                "max_points": item_points
            }

            # Grade based on type
            if not student_answer:
                item_result["score"] = 0
                item_result["points_earned"] = 0
                item_result["feedback"] = "Fara raspuns"
            elif item_type == "mcq":
                grade_result = auto_grade_mcq(
                    student_answer,
                    item.get("correct", 0),
                    item.get("options", [])
                )
                item_result["score"] = grade_result["score"]
                item_result["points_earned"] = item_points if grade_result["correct"] else 0
                item_result["feedback"] = grade_result["feedback"]
            else:
                # Intrebari deschise - AI grading
                grade_result = ai_grade_open_question(item, str(student_answer), item_type)
                item_result["score"] = grade_result["score"]
                item_result["points_earned"] = round(item_points * grade_result["score"], 1)
                item_result["feedback"] = grade_result["feedback"]
                item_result["needs_review"] = grade_result.get("needs_review", False)
                if grade_result.get("needs_review"):
                    needs_review = True

            level_results["items"].append(item_result)
            level_results["points"] += item_result.get("points_earned", 0)

        results["levels"][level] = level_results
        total_points += level_results["points"]
        max_points += level_results["max_points"]

    # Calculeaza nota finala
    if max_points > 0:
        percentage = (total_points / max_points) * 100
    else:
        percentage = 0

    # Converteste in nota
    if percentage >= 90:
        nota = 10
    elif percentage >= 80:
        nota = 9
    elif percentage >= 65:
        nota = 8
    elif percentage >= 50:
        nota = 7
    elif percentage >= 40:
        nota = 6
    elif percentage >= 30:
        nota = 5
    else:
        nota = 4

    results["summary"] = {
        "total_points": round(total_points, 1),
        "max_points": max_points,
        "percentage": round(percentage, 1),
        "nota": nota,
        "needs_review": needs_review,
        "levels_completed": {
            level: results["levels"][level]["points"] > 0
            for level in ["minim", "standard", "performanta"]
        }
    }

    return results


def generate_feedback_report(results: Dict) -> str:
    """Genereaza un raport text din rezultate."""
    lines = []
    lines.append("=" * 60)
    lines.append("RAPORT DE VERIFICARE - LearningHub")
    lines.append("=" * 60)
    lines.append("")

    student = results.get("student", {})
    lines.append(f"Elev: {student.get('name', 'Necunoscut')}")
    lines.append(f"Clasa: {student.get('class', '-')}")
    lines.append(f"Lectia: {results.get('lesson', '-')}")
    lines.append(f"Data verificare: {results.get('timestamp_graded', '-')}")
    lines.append("")

    summary = results.get("summary", {})
    lines.append("-" * 40)
    lines.append("REZULTAT FINAL")
    lines.append("-" * 40)
    lines.append(f"Punctaj: {summary.get('total_points', 0)} / {summary.get('max_points', 0)}")
    lines.append(f"Procent: {summary.get('percentage', 0)}%")
    lines.append(f"NOTA: {summary.get('nota', '-')}")

    if summary.get("needs_review"):
        lines.append("")
        lines.append("⚠️  NECESITA VERIFICARE MANUALA pentru raspunsuri deschise")

    lines.append("")

    # Detalii pe nivele
    for level in ["minim", "standard", "performanta"]:
        level_data = results.get("levels", {}).get(level, {})
        level_name = {"minim": "MINIM (5-6)", "standard": "STANDARD (7-8)", "performanta": "PERFORMANTA (9-10)"}

        lines.append("-" * 40)
        lines.append(f"{level_name.get(level, level.upper())}")
        lines.append(f"Punctaj: {level_data.get('points', 0)} / {level_data.get('max_points', 0)}")
        lines.append("")

        for item in level_data.get("items", []):
            status = "✓" if item.get("points_earned", 0) == item.get("max_points", 0) else "✗"
            if item.get("needs_review"):
                status = "?"

            lines.append(f"  {status} [{item.get('id')}] {item.get('question', '')[:50]}...")
            lines.append(f"      Puncte: {item.get('points_earned', 0)} / {item.get('max_points', 0)}")
            lines.append(f"      {item.get('feedback', '')}")
            lines.append("")

    lines.append("=" * 60)

    return "\n".join(lines)


def process_submission_file(filepath: Path, worksheet: Dict) -> Dict:
    """Proceseaza un fisier de submisie."""
    with open(filepath, 'r', encoding='utf-8') as f:
        submission = json.load(f)

    return grade_submission(submission, worksheet)


def main():
    parser = argparse.ArgumentParser(description="Verifica submisii LearningHub cu AI")
    parser.add_argument("--file", type=str, help="Fisier JSON de submisie")
    parser.add_argument("--folder", type=str, help="Folder cu submisii")
    parser.add_argument("--grade", type=str, help="Clasa (cls5, cls6, cls7, cls8)")
    parser.add_argument("--output", type=str, help="Folder output pentru rezultate")
    parser.add_argument("--report", action="store_true", help="Genereaza raport text")

    args = parser.parse_args()

    # Asigura existenta folderelor
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)

    if args.file:
        # Proceseaza un singur fisier
        filepath = Path(args.file)
        if not filepath.exists():
            print(f"Eroare: Fisierul nu exista: {filepath}")
            sys.exit(1)

        # Detecteaza clasa din path sau submission
        with open(filepath, 'r', encoding='utf-8') as f:
            submission = json.load(f)

        lesson = submission.get("lesson", "")
        grade = lesson.split("/")[0] if "/" in lesson else args.grade

        if not grade:
            print("Eroare: Nu pot detecta clasa. Specifica --grade")
            sys.exit(1)

        worksheet = load_worksheet(grade)
        results = process_submission_file(filepath, worksheet)

        # Salveaza rezultatele
        output_path = RESULTS_DIR / f"result_{filepath.stem}.json"
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)

        print(f"Rezultate salvate: {output_path}")

        if args.report:
            report = generate_feedback_report(results)
            print("\n" + report)

            report_path = RESULTS_DIR / f"report_{filepath.stem}.txt"
            with open(report_path, 'w', encoding='utf-8') as f:
                f.write(report)
            print(f"\nRaport salvat: {report_path}")

    elif args.folder:
        # Proceseaza toate fisierele din folder
        folder = Path(args.folder)
        if not folder.exists():
            print(f"Eroare: Folderul nu exista: {folder}")
            sys.exit(1)

        if not args.grade:
            print("Eroare: Specifica --grade pentru procesare folder")
            sys.exit(1)

        worksheet = load_worksheet(args.grade)

        submissions = list(folder.glob("*.json"))
        print(f"Procesez {len(submissions)} submisii...")

        all_results = []
        for filepath in submissions:
            print(f"  Procesez: {filepath.name}")
            results = process_submission_file(filepath, worksheet)
            all_results.append(results)

            # Salveaza individual
            output_path = RESULTS_DIR / f"result_{filepath.stem}.json"
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(results, f, indent=2, ensure_ascii=False)

        # Sumar
        print(f"\nProcesat: {len(all_results)} submisii")

        # Statistici
        if all_results:
            notes = [r.get("summary", {}).get("nota", 0) for r in all_results]
            avg_nota = sum(notes) / len(notes)
            print(f"Nota medie: {avg_nota:.1f}")
            print(f"Nota maxima: {max(notes)}")
            print(f"Nota minima: {min(notes)}")

    else:
        parser.print_help()
        print("\nExemplu folosire:")
        print("  python verify_submissions.py --file submission.json --report")
        print("  python verify_submissions.py --folder submissions/cls5/ --grade cls5")


if __name__ == "__main__":
    main()
