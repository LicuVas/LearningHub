#!/usr/bin/env python3
"""
Batch extraction script for Romanian ICT workbooks.
Processes multiple PDFs and generates a comprehensive summary report.

Usage:
    python batch_extract_workbooks.py [--dry-run] [--school <name>] [--grade <N>] [--force]

Examples:
    python batch_extract_workbooks.py --dry-run
    python batch_extract_workbooks.py --school tupilati --grade 5
    python batch_extract_workbooks.py --force
"""

import sys
import io
import os
import json
import argparse
import subprocess
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# School configurations
SCHOOLS = {
    'tupilati': {
        'name': 'Tupilati',
        'path': 'C:/AI/Projects/Scoala/2025-2026/Tupilati/Manuale',
        'grades': [5, 6]
    },
    'victorbrauner': {
        'name': 'VictorBrauner',
        'path': 'C:/AI/Projects/Scoala/2025-2026/VictorBrauner/Manuale',
        'grades': [5, 6, 7, 8, 9, 11, 12]
    },
    'cuza': {
        'name': 'Cuza',
        'path': 'C:/AI/Projects/Scoala/2025-2026/Cuza/Manuale',
        'grades': [5, 6, 7, 8]
    }
}

# Extraction script path
EXTRACTOR_SCRIPT = Path(__file__).parent / 'extract_pdf_workbook.py'


class ProgressBar:
    """Simple progress bar for terminal."""

    def __init__(self, total: int, width: int = 50):
        self.total = total
        self.width = width
        self.current = 0

    def update(self, current: int, description: str = ""):
        self.current = current
        percent = current / self.total if self.total > 0 else 0
        filled = int(self.width * percent)
        bar = '█' * filled + '░' * (self.width - filled)

        # Clear line and print progress
        sys.stdout.write(f'\r[{bar}] {current}/{self.total} ({percent*100:.1f}%) {description}')
        sys.stdout.flush()

    def finish(self):
        sys.stdout.write('\n')
        sys.stdout.flush()


def find_workbook_pdfs(school_filter: Optional[str] = None,
                       grade_filter: Optional[int] = None) -> List[Dict]:
    """
    Find all workbook PDFs based on filters.

    Returns:
        List of dicts with: {path, school, grade, filename}
    """
    pdfs = []

    for school_key, school_info in SCHOOLS.items():
        # Apply school filter
        if school_filter and school_key != school_filter.lower():
            continue

        base_path = Path(school_info['path'])
        if not base_path.exists():
            print(f"⚠ Warning: Path not found: {base_path}")
            continue

        # Search each grade folder
        for grade in school_info['grades']:
            # Apply grade filter
            if grade_filter and grade != grade_filter:
                continue

            grade_folder = base_path / f"cls_{grade:02d}"
            if not grade_folder.exists():
                continue

            # Find PDF files
            for pdf_file in grade_folder.glob("*.pdf"):
                pdfs.append({
                    'path': str(pdf_file),
                    'school': school_info['name'],
                    'school_key': school_key,
                    'grade': grade,
                    'filename': pdf_file.name,
                    'output_path': str(pdf_file.with_suffix('.extracted.json'))
                })

    return pdfs


def extract_workbook(pdf_info: Dict, force: bool = False) -> Dict:
    """
    Extract a single workbook PDF.

    Returns:
        Result dict with status, lessons, sections, warnings, etc.
    """
    pdf_path = Path(pdf_info['path'])
    output_path = Path(pdf_info['output_path'])

    # Check if already extracted
    if output_path.exists() and not force:
        try:
            with open(output_path, 'r', encoding='utf-8') as f:
                existing = json.load(f)

            return {
                'file': pdf_info['filename'],
                'school': pdf_info['school'],
                'grade': pdf_info['grade'],
                'status': 'skipped',
                'lessons': existing.get('statistics', {}).get('total_lessons', 0),
                'sections': existing.get('statistics', {}).get('total_sections', 0),
                'warnings': ['Already extracted (use --force to re-extract)'],
                'output': str(output_path)
            }
        except Exception as e:
            # If JSON is corrupted, re-extract
            pass

    # Run extraction
    try:
        result = subprocess.run(
            [sys.executable, str(EXTRACTOR_SCRIPT), str(pdf_path)],
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace',
            timeout=120  # 2 minute timeout per PDF
        )

        # Parse output for statistics
        lessons = 0
        sections = 0
        warnings = []
        needs_ocr = False

        for line in result.stdout.split('\n'):
            if 'Lessons Grouped:' in line:
                try:
                    lessons = int(line.split(':')[1].strip())
                except:
                    pass
            elif 'Sections Found:' in line:
                try:
                    sections = int(line.split(':')[1].strip())
                except:
                    pass
            elif 'WARNING' in line:
                warnings.append(line.strip())
                if 'OCR' in line:
                    needs_ocr = True

        # Check if extraction succeeded
        if result.returncode == 0 and output_path.exists():
            status = 'success'

            # Load JSON to get accurate stats
            try:
                with open(output_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    stats = data.get('statistics', {})
                    lessons = stats.get('total_lessons', lessons)
                    sections = stats.get('total_sections', sections)
            except:
                pass
        else:
            status = 'failed'
            warnings.append(f"Exit code: {result.returncode}")
            if result.stderr:
                warnings.append(result.stderr[:200])

        return {
            'file': pdf_info['filename'],
            'school': pdf_info['school'],
            'grade': pdf_info['grade'],
            'status': status,
            'lessons': lessons,
            'sections': sections,
            'warnings': warnings,
            'needs_ocr': needs_ocr,
            'output': str(output_path) if status == 'success' else None
        }

    except subprocess.TimeoutExpired:
        return {
            'file': pdf_info['filename'],
            'school': pdf_info['school'],
            'grade': pdf_info['grade'],
            'status': 'timeout',
            'lessons': 0,
            'sections': 0,
            'warnings': ['Extraction timeout after 2 minutes'],
            'needs_ocr': False,
            'output': None
        }
    except Exception as e:
        return {
            'file': pdf_info['filename'],
            'school': pdf_info['school'],
            'grade': pdf_info['grade'],
            'status': 'error',
            'lessons': 0,
            'sections': 0,
            'warnings': [f"Exception: {str(e)}"],
            'needs_ocr': False,
            'output': None
        }


def generate_summary_report(results: List[Dict], output_path: Path):
    """Generate comprehensive summary report."""

    # Count statuses
    successful = len([r for r in results if r['status'] == 'success'])
    failed = len([r for r in results if r['status'] in ['failed', 'error', 'timeout']])
    skipped = len([r for r in results if r['status'] == 'skipped'])

    # Count lessons and sections
    total_lessons = sum(r['lessons'] for r in results)
    total_sections = sum(r['sections'] for r in results)

    # Files needing OCR
    needs_ocr = [r for r in results if r.get('needs_ocr', False)]

    # Group by school
    by_school = {}
    for r in results:
        school = r['school']
        if school not in by_school:
            by_school[school] = []
        by_school[school].append(r)

    report = {
        'timestamp': datetime.now().isoformat(),
        'total_files': len(results),
        'successful': successful,
        'failed': failed,
        'skipped': skipped,
        'total_lessons': total_lessons,
        'total_sections': total_sections,
        'needs_ocr_count': len(needs_ocr),
        'by_school': {
            school: {
                'total': len(files),
                'successful': len([f for f in files if f['status'] == 'success']),
                'lessons': sum(f['lessons'] for f in files),
                'sections': sum(f['sections'] for f in files)
            }
            for school, files in by_school.items()
        },
        'results': results
    }

    # Save report
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    return report


def print_summary(report: Dict):
    """Print human-readable summary to console."""

    print("\n" + "="*70)
    print("BATCH EXTRACTION SUMMARY")
    print("="*70)
    print(f"Timestamp: {report['timestamp']}")
    print(f"Total Files: {report['total_files']}")
    print(f"  ✓ Successful: {report['successful']}")
    print(f"  ✗ Failed: {report['failed']}")
    print(f"  ⊘ Skipped: {report['skipped']}")
    print()
    print(f"Content Extracted:")
    print(f"  • Lessons: {report['total_lessons']}")
    print(f"  • Sections: {report['total_sections']}")

    if report['needs_ocr_count'] > 0:
        print(f"\n⚠ Files needing OCR: {report['needs_ocr_count']}")

    print("\nBy School:")
    for school, stats in report['by_school'].items():
        print(f"  {school}:")
        print(f"    Files: {stats['successful']}/{stats['total']}")
        print(f"    Lessons: {stats['lessons']}, Sections: {stats['sections']}")

    # Show failures
    failures = [r for r in report['results'] if r['status'] in ['failed', 'error', 'timeout']]
    if failures:
        print("\nFailed Extractions:")
        for f in failures:
            print(f"  ✗ {f['school']} Grade {f['grade']} - {f['file']}")
            if f['warnings']:
                print(f"    → {f['warnings'][0]}")

    print("="*70 + "\n")


def main():
    parser = argparse.ArgumentParser(
        description='Batch extract workbooks from PDFs',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Dry run - list files without extracting
  python batch_extract_workbooks.py --dry-run

  # Extract only Tupilati school
  python batch_extract_workbooks.py --school tupilati

  # Extract only grade 5
  python batch_extract_workbooks.py --grade 5

  # Force re-extraction of all files
  python batch_extract_workbooks.py --force

  # Extract specific school and grade
  python batch_extract_workbooks.py --school victorbrauner --grade 8
        """
    )

    parser.add_argument('--dry-run', action='store_true',
                        help='List files without extracting')
    parser.add_argument('--school', choices=['tupilati', 'victorbrauner', 'cuza'],
                        help='Filter by school')
    parser.add_argument('--grade', type=int, choices=[5, 6, 7, 8, 9, 11, 12],
                        help='Filter by grade')
    parser.add_argument('--force', action='store_true',
                        help='Re-extract even if JSON exists')
    parser.add_argument('--output', default='extraction_report.json',
                        help='Report output path (default: extraction_report.json)')

    args = parser.parse_args()

    # Validate extractor script exists
    if not EXTRACTOR_SCRIPT.exists():
        print(f"ERROR: Extractor script not found: {EXTRACTOR_SCRIPT}")
        return 1

    # Find PDFs
    print("Scanning for workbook PDFs...")
    pdfs = find_workbook_pdfs(args.school, args.grade)

    if not pdfs:
        print("No PDF files found matching filters.")
        return 0

    print(f"Found {len(pdfs)} workbook(s)\n")

    # Dry run mode
    if args.dry_run:
        print("DRY RUN MODE - Files to process:")
        print("-" * 70)
        for pdf in pdfs:
            status = ""
            output = Path(pdf['output_path'])
            if output.exists():
                status = " [already extracted]"
            print(f"  {pdf['school']:15} Grade {pdf['grade']:2} - {pdf['filename']}{status}")
        print("-" * 70)
        print(f"\nTotal: {len(pdfs)} files")
        print("\nRun without --dry-run to process.")
        return 0

    # Process each PDF
    print("Processing workbooks...\n")
    progress = ProgressBar(len(pdfs))
    results = []

    for i, pdf in enumerate(pdfs, 1):
        desc = f"{pdf['school']} Gr{pdf['grade']}"
        progress.update(i, desc)

        result = extract_workbook(pdf, force=args.force)
        results.append(result)

    progress.finish()

    # Generate report
    report_path = Path(args.output)
    print(f"\nGenerating summary report: {report_path}")
    report = generate_summary_report(results, report_path)

    # Print summary
    print_summary(report)

    # Return exit code based on failures
    if report['failed'] > 0:
        print(f"⚠ {report['failed']} extraction(s) failed. See report for details.")
        return 1

    print("✓ All extractions completed successfully!")
    return 0


if __name__ == '__main__':
    exit(main())
