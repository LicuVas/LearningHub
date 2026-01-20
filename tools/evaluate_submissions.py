#!/usr/bin/env python3
"""
Student Submission Evaluator for LearningHub
=============================================

This tool processes student JSON submissions and:
1. Verifies SHA-256 checksums (anti-tampering)
2. Extracts detailed performance data
3. Evaluates written answers (AI-assisted with confidence levels)
4. Generates teacher evaluation reports

Usage:
    python evaluate_submissions.py <json_file_or_folder>
    python evaluate_submissions.py --batch <folder>
    python evaluate_submissions.py --verify <json_file>

Output:
    - Verification status (VALID/TAMPERED)
    - Per-item breakdown with student answers
    - Written answer analysis with confidence scores
    - Summary report for quick review
"""

import json
import hashlib
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple

# Try to import rich for better output, fall back to basic print
try:
    from rich.console import Console
    from rich.table import Table
    from rich.panel import Panel
    from rich import print as rprint
    RICH_AVAILABLE = True
    console = Console()
except ImportError:
    RICH_AVAILABLE = False


class SubmissionEvaluator:
    """Evaluates student submissions from LearningHub."""

    # Keywords for written answer evaluation (Romanian)
    QUALITY_KEYWORDS = {
        'ram_vs_hdd': {
            'excellent': ['temporar', 'permanent', 'rapid', 'lent', 'volatil', 'non-volatil'],
            'good': ['memorie', 'stocare', 'program', 'fisier', 'inchide'],
            'basic': ['ram', 'hard', 'disk', 'salvat']
        }
    }

    def __init__(self, verbose: bool = True):
        self.verbose = verbose
        self.results = []

    def calculate_checksum(self, data: dict) -> str:
        """Calculate SHA-256 checksum of payload data."""
        json_string = json.dumps(data, sort_keys=True, ensure_ascii=False)
        return hashlib.sha256(json_string.encode('utf-8')).hexdigest()

    def verify_submission(self, filepath: str) -> Tuple[bool, dict, str]:
        """
        Verify a submission's integrity.
        Returns: (is_valid, data, error_message)
        """
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                submission = json.load(f)

            # Check structure
            if 'payload' not in submission or 'security' not in submission:
                return False, submission, "Invalid structure: missing payload or security"

            payload = submission['payload']
            security = submission['security']

            # Verify checksum
            expected_checksum = security.get('checksum', '')
            calculated_checksum = self.calculate_checksum(payload)

            if expected_checksum != calculated_checksum:
                return False, submission, f"CHECKSUM MISMATCH - File has been tampered!"

            return True, submission, "OK"

        except json.JSONDecodeError as e:
            return False, {}, f"Invalid JSON: {e}"
        except FileNotFoundError:
            return False, {}, f"File not found: {filepath}"
        except Exception as e:
            return False, {}, f"Error: {e}"

    def evaluate_written_answer(self, item: dict) -> dict:
        """
        Evaluate a written answer and return analysis with confidence level.
        """
        answer = item.get('studentWrittenAnswer', '').lower()
        keywords = item.get('keywords', [])
        hints = item.get('hints', [])
        min_chars = item.get('minChars', 50)

        if not answer:
            return {
                'score': 0,
                'confidence': 1.0,
                'feedback': 'Raspuns lipsa',
                'keywordsFound': [],
                'keywordsMissing': keywords,
                'lengthOK': False,
                'requiresManualReview': False
            }

        # Check keywords
        found_keywords = [kw for kw in keywords if kw.lower() in answer]
        missing_keywords = [kw for kw in keywords if kw.lower() not in answer]
        keyword_ratio = len(found_keywords) / len(keywords) if keywords else 0

        # Check length
        length_ok = len(answer) >= min_chars
        length_bonus = min(0.2, (len(answer) - min_chars) / (min_chars * 2)) if length_ok else 0

        # Calculate base score (0-100)
        base_score = (keyword_ratio * 0.7 + (0.3 if length_ok else 0)) * 100 + length_bonus * 100
        base_score = min(100, base_score)

        # Determine confidence level
        # High confidence if: many keywords found, appropriate length
        # Low confidence if: borderline cases, needs teacher review
        if keyword_ratio >= 0.7 and length_ok:
            confidence = 0.9  # High confidence
            requires_review = False
        elif keyword_ratio >= 0.4 and length_ok:
            confidence = 0.7  # Medium confidence
            requires_review = True  # Teacher should verify quality
        else:
            confidence = 0.5  # Low confidence
            requires_review = True

        # Generate feedback
        if base_score >= 80:
            feedback = "Raspuns complet si detaliat"
        elif base_score >= 60:
            feedback = f"Raspuns bun, lipsesc: {', '.join(missing_keywords[:3])}"
        elif base_score >= 40:
            feedback = f"Raspuns partial, lipsesc concepte importante"
        else:
            feedback = "Raspuns insuficient sau incomplet"

        return {
            'score': round(base_score),
            'confidence': confidence,
            'feedback': feedback,
            'keywordsFound': found_keywords,
            'keywordsMissing': missing_keywords,
            'lengthOK': length_ok,
            'charCount': len(answer),
            'requiresManualReview': requires_review,
            'rawAnswer': item.get('studentWrittenAnswer', '')[:500]  # First 500 chars for preview
        }

    def analyze_submission(self, filepath: str) -> dict:
        """
        Fully analyze a student submission.
        """
        is_valid, submission, message = self.verify_submission(filepath)

        result = {
            'filepath': filepath,
            'filename': os.path.basename(filepath),
            'isValid': is_valid,
            'verificationMessage': message,
            'analyzed_at': datetime.now().isoformat()
        }

        if not is_valid:
            result['error'] = message
            return result

        payload = submission['payload']

        # Extract basic info
        result['student'] = payload.get('student', {})
        result['lesson'] = payload.get('lesson', {})
        result['grading'] = payload.get('grading', {})
        result['summary'] = payload.get('summary', {})
        result['meta'] = payload.get('_meta', {})

        # Analyze atomic items
        atomic_items = payload.get('atomicItems', [])
        result['atomicAnalysis'] = {
            'totalItems': len(atomic_items),
            'answeredItems': len([i for i in atomic_items if i.get('answered')]),
            'correctItems': len([i for i in atomic_items if i.get('isCorrect')]),
            'incorrectItems': [],
            'items': atomic_items
        }

        # Find incorrect items for teacher attention
        for item in atomic_items:
            if item.get('answered') and not item.get('isCorrect'):
                result['atomicAnalysis']['incorrectItems'].append({
                    'question': item.get('questionText', ''),
                    'studentAnswer': item.get('studentAnswerText', ''),
                    'correctAnswer': item.get('correctAnswerText', ''),
                    'atomTitle': item.get('atomTitle', '')
                })

        # Analyze practice items
        practice_items = payload.get('practiceItems', [])
        result['practiceAnalysis'] = {
            'totalItems': len(practice_items),
            'answeredItems': len([i for i in practice_items if i.get('answered')]),
            'correctItems': len([i for i in practice_items if i.get('isCorrect')]),
            'items': practice_items
        }

        # Evaluate written answers with confidence levels
        written_evaluations = []
        for item in practice_items:
            if item.get('requiresTeacherEvaluation'):
                evaluation = self.evaluate_written_answer(item)
                evaluation['questionText'] = item.get('questionText', '')
                evaluation['context'] = item.get('context', '')
                written_evaluations.append(evaluation)

        result['writtenEvaluations'] = written_evaluations

        # Calculate items needing manual review
        result['manualReviewRequired'] = {
            'count': len([e for e in written_evaluations if e.get('requiresManualReview')]),
            'items': [e for e in written_evaluations if e.get('requiresManualReview')]
        }

        # Overall confidence in automated evaluation
        if written_evaluations:
            avg_confidence = sum(e['confidence'] for e in written_evaluations) / len(written_evaluations)
        else:
            avg_confidence = 1.0
        result['overallConfidence'] = round(avg_confidence, 2)

        return result

    def print_report(self, result: dict):
        """Print a formatted report of the analysis."""
        if RICH_AVAILABLE:
            self._print_rich_report(result)
        else:
            self._print_basic_report(result)

    def _print_rich_report(self, result: dict):
        """Print report using rich library."""
        # Header
        status = "[green]VALID[/green]" if result['isValid'] else "[red]TAMPERED/INVALID[/red]"
        console.print(Panel(
            f"[bold]{result['filename']}[/bold]\nStatus: {status}\n{result['verificationMessage']}",
            title="Submission Analysis"
        ))

        if not result['isValid']:
            console.print("[red]Cannot analyze tampered/invalid submission![/red]")
            return

        # Student & Lesson Info
        student = result.get('student', {})
        lesson = result.get('lesson', {})
        grading = result.get('grading', {})

        console.print(f"\n[bold]Student:[/bold] {student.get('name', 'Unknown')}")
        console.print(f"[bold]Lectie:[/bold] {lesson.get('title', lesson.get('id', 'Unknown'))}")
        console.print(f"[bold]Nota:[/bold] {grading.get('grade', '?')}/10 ({grading.get('gradeLabel', '')})")
        console.print(f"[bold]Scor:[/bold] {grading.get('finalScore', 0)}%")
        console.print(f"[bold]Confidence evaluare automata:[/bold] {result.get('overallConfidence', 0)*100:.0f}%")

        # Atomic Items Table
        atomic = result.get('atomicAnalysis', {})
        console.print(f"\n[bold]Invatare Atomica:[/bold] {atomic.get('correctItems', 0)}/{atomic.get('totalItems', 0)} corecte")

        if atomic.get('incorrectItems'):
            table = Table(title="Greseli la intrebari")
            table.add_column("Intrebare", style="cyan")
            table.add_column("Raspuns elev", style="red")
            table.add_column("Corect", style="green")

            for item in atomic['incorrectItems'][:5]:  # Show first 5
                table.add_row(
                    item['question'][:50] + '...' if len(item['question']) > 50 else item['question'],
                    item['studentAnswer'][:30],
                    item['correctAnswer'][:30]
                )
            console.print(table)

        # Written Answers
        written = result.get('writtenEvaluations', [])
        if written:
            console.print("\n[bold]Raspunsuri scrise (bonus):[/bold]")
            for i, w in enumerate(written, 1):
                confidence_color = "green" if w['confidence'] >= 0.8 else "yellow" if w['confidence'] >= 0.6 else "red"
                review_flag = " [yellow][NEEDS REVIEW][/yellow]" if w['requiresManualReview'] else ""

                console.print(f"\n  [{i}] {w.get('questionText', '')[:80]}...")
                console.print(f"      Scor: {w['score']}/100 | Confidence: [{confidence_color}]{w['confidence']*100:.0f}%[/{confidence_color}]{review_flag}")
                console.print(f"      Keywords: {len(w['keywordsFound'])}/{len(w['keywordsFound']) + len(w['keywordsMissing'])} gasite")
                console.print(f"      Feedback: {w['feedback']}")
                if w.get('rawAnswer'):
                    console.print(f"      [dim]Raspuns: \"{w['rawAnswer'][:100]}...\"[/dim]")

        # Summary
        manual_review = result.get('manualReviewRequired', {})
        if manual_review.get('count', 0) > 0:
            console.print(f"\n[yellow]>>> {manual_review['count']} item(e) necesita verificare manuala![/yellow]")

    def _print_basic_report(self, result: dict):
        """Print report using basic print statements."""
        print("\n" + "="*60)
        print(f"FILE: {result['filename']}")
        print(f"STATUS: {'VALID' if result['isValid'] else 'TAMPERED/INVALID'}")
        print(f"MESSAGE: {result['verificationMessage']}")
        print("="*60)

        if not result['isValid']:
            print("Cannot analyze tampered/invalid submission!")
            return

        student = result.get('student', {})
        lesson = result.get('lesson', {})
        grading = result.get('grading', {})

        print(f"\nStudent: {student.get('name', 'Unknown')}")
        print(f"Lectie: {lesson.get('title', lesson.get('id', 'Unknown'))}")
        print(f"Nota: {grading.get('grade', '?')}/10 ({grading.get('gradeLabel', '')})")
        print(f"Scor: {grading.get('finalScore', 0)}%")
        print(f"Confidence: {result.get('overallConfidence', 0)*100:.0f}%")

        atomic = result.get('atomicAnalysis', {})
        print(f"\nInvatare Atomica: {atomic.get('correctItems', 0)}/{atomic.get('totalItems', 0)} corecte")

        written = result.get('writtenEvaluations', [])
        if written:
            print("\nRaspunsuri scrise:")
            for i, w in enumerate(written, 1):
                print(f"  [{i}] Scor: {w['score']}/100, Confidence: {w['confidence']*100:.0f}%")
                print(f"      {w['feedback']}")

        manual_review = result.get('manualReviewRequired', {})
        if manual_review.get('count', 0) > 0:
            print(f"\n>>> {manual_review['count']} item(e) necesita verificare manuala!")

    def export_report(self, result: dict, output_path: str = None):
        """Export analysis to JSON file."""
        if output_path is None:
            base = os.path.splitext(result['filepath'])[0]
            output_path = f"{base}_evaluation.json"

        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)

        print(f"Report saved to: {output_path}")
        return output_path


def main():
    """Main entry point."""
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    evaluator = SubmissionEvaluator()

    if sys.argv[1] == '--verify':
        # Just verify checksum
        if len(sys.argv) < 3:
            print("Usage: --verify <json_file>")
            sys.exit(1)

        is_valid, _, message = evaluator.verify_submission(sys.argv[2])
        print(f"{'VALID' if is_valid else 'INVALID'}: {message}")
        sys.exit(0 if is_valid else 1)

    elif sys.argv[1] == '--batch':
        # Process all JSON files in folder
        if len(sys.argv) < 3:
            print("Usage: --batch <folder>")
            sys.exit(1)

        folder = sys.argv[2]
        json_files = list(Path(folder).glob('*.json'))

        print(f"Processing {len(json_files)} files...")
        results = []

        for filepath in json_files:
            result = evaluator.analyze_submission(str(filepath))
            results.append(result)
            evaluator.print_report(result)
            print("\n" + "-"*40 + "\n")

        # Summary
        valid_count = len([r for r in results if r['isValid']])
        print(f"\nSUMMARY: {valid_count}/{len(results)} valid submissions")

    else:
        # Single file analysis
        filepath = sys.argv[1]
        result = evaluator.analyze_submission(filepath)
        evaluator.print_report(result)

        # Export report
        evaluator.export_report(result)


if __name__ == '__main__':
    main()
