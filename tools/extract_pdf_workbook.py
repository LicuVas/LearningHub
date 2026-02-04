#!/usr/bin/env python3
"""
Extract structured content from Romanian ICT/Informatica PDF workbooks.
Designed for LearningHub integration.

Usage:
    python extract_pdf_workbook.py <pdf_path> [--output <json_path>] [--debug]

Example:
    python extract_pdf_workbook.py "C:/AI/Projects/Scoala/2025-2026/VictorBrauner/Manuale/cls_05/A1230.pdf"
"""

import sys
import io

# Fix Windows console encoding for Romanian characters
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

import re
import json
import argparse
from pathlib import Path
from dataclasses import dataclass, field, asdict
from typing import Optional
from datetime import datetime

try:
    import pdfplumber
except ImportError:
    print("ERROR: pdfplumber not installed. Run: pip install pdfplumber")
    exit(1)


# =============================================================================
# SECTION MARKERS (Romanian workbook patterns)
# =============================================================================

SECTION_MARKERS = {
    'objectives': [
        r'OBIECTIVE',
        r'Obiectivele\s+lecției',
        r'La finalul lecției',
    ],
    'theory': [
        r'Noțiuni\s+teoretice',
        r'Concepte\s+de\s+bază',
    ],
    'practical_activity': [
        r'ACTIVITATE\s+PRACTICĂ',
        r'Activitate\s+practică',
        r'activitate\s+practică',
    ],
    'practical_homework': [
        r'TEMA\s+PRACTICĂ',
        r'Tema\s+practică',
        r'TEMĂ\s+PENTRU\s+ACASĂ',
    ],
    'didactic_game': [
        r'Joc\s+didactic',
        r'JOC\s+DIDACTIC',
    ],
    'did_you_know': [
        r'ȘTIAȚI\s+CĂ',
        r'Știați\s+că',
        r'ȘTIAI\s+CĂ',
    ],
    'attention': [
        r'Atenție!',
        r'ATENȚIE!',
        r'⚠',
    ],
    'recap_terms': [
        r'RECAPITULĂM\s+TERMENII',
        r'Recapitulăm\s+termenii',
        r'TERMENI\s+NOI',
    ],
    'evaluation': [
        r'Test\s+de\s+evaluare',
        r'TEST\s+DE\s+EVALUARE',
        r'EVALUARE',
        r'Evaluare',
    ],
    'recapitulation': [
        r'RECAPITULARE',
        r'Recapitulare',
    ],
}


@dataclass
class ExtractedSection:
    """A section extracted from the workbook."""
    type: str
    title: str
    content: str
    page_start: int
    page_end: int
    items: list = field(default_factory=list)  # For exercises, quiz items, etc.


@dataclass
class ExtractedLesson:
    """A complete lesson extracted from the workbook."""
    title: str
    chapter: str
    page_start: int
    page_end: int
    objectives: list = field(default_factory=list)
    theory: str = ""
    activities: list = field(default_factory=list)
    homework: list = field(default_factory=list)
    evaluation: list = field(default_factory=list)
    terms: list = field(default_factory=list)
    fun_facts: list = field(default_factory=list)


@dataclass
class ExtractedWorkbook:
    """Complete workbook extraction result."""
    title: str
    authors: list
    publisher: str
    grade: str
    approval: str
    extracted_at: str
    source_file: str
    total_pages: int
    toc: list = field(default_factory=list)
    chapters: list = field(default_factory=list)
    lessons: list = field(default_factory=list)
    raw_sections: list = field(default_factory=list)


class PDFWorkbookExtractor:
    """Extract structured content from Romanian ICT workbooks."""

    def __init__(self, pdf_path: str, debug: bool = False):
        self.pdf_path = Path(pdf_path)
        self.debug = debug
        self.pdf = None
        self.pages_text = []
        self.metadata = {}

    def log(self, msg: str):
        """Debug logging."""
        if self.debug:
            print(f"[DEBUG] {msg}")

    def extract(self) -> ExtractedWorkbook:
        """Main extraction method."""
        print(f"Opening PDF: {self.pdf_path}")

        with pdfplumber.open(self.pdf_path) as pdf:
            self.pdf = pdf
            self.metadata = pdf.metadata or {}

            # Extract all pages text
            print(f"Extracting text from {len(pdf.pages)} pages...")
            for i, page in enumerate(pdf.pages):
                text = page.extract_text() or ""
                self.pages_text.append(text)
                if self.debug and i < 3:
                    self.log(f"Page {i+1} preview: {text[:200]}...")

            # Build result
            result = ExtractedWorkbook(
                title=self._extract_title(),
                authors=self._extract_authors(),
                publisher=self._extract_publisher(),
                grade=self._extract_grade(),
                approval=self._extract_approval(),
                extracted_at=datetime.now().isoformat(),
                source_file=str(self.pdf_path),
                total_pages=len(pdf.pages),
            )

            # Extract table of contents
            result.toc = self._extract_toc()

            # Extract sections by markers
            result.raw_sections = self._extract_sections()

            # Group into lessons
            result.lessons = self._group_into_lessons(result.toc, result.raw_sections)

            return result

    def _extract_title(self) -> str:
        """Extract workbook title from metadata or first pages."""
        if self.metadata.get('Title'):
            return self.metadata['Title']

        # Try to find title in first 3 pages
        for page_text in self.pages_text[:3]:
            # Pattern: "Informatica și TIC" with possible line breaks
            match = re.search(r'(Informatica?\s*și\s*T\s*I\s*C|Informatică\s*și\s*TIC)', page_text, re.IGNORECASE)
            if match:
                # Try to get grade info
                grade_match = re.search(r'clasa\s+a\s+([IVXL]+)-a', page_text, re.IGNORECASE)
                grade = f" - clasa a {grade_match.group(1)}-a" if grade_match else ""
                return f"Informatică și TIC{grade}"

        return "Informatică și TIC"

    def _extract_authors(self) -> list:
        """Extract authors from metadata or first pages."""
        if self.metadata.get('Author'):
            authors = self.metadata['Author']
            # Handle comma-separated authors
            if ',' in authors:
                return [a.strip() for a in authors.split(',')]
            return [authors]

        authors = []
        # Check first 3 pages for author patterns
        for page_text in self.pages_text[:3]:
            # Exclude common false positives
            exclude_words = ['Ministerul', 'Ordinul', 'Editura', 'Educației', 'Aprobat', 'Manual']

            # Pattern: Two capitalized words (First Last)
            matches = re.findall(r'\b([A-ZĂÂÎȘȚ][a-zăâîșț]+\s+[A-ZĂÂÎȘȚ][a-zăâîșț]+)\b', page_text)
            for match in matches:
                # Skip if contains excluded words
                if any(excl in match for excl in exclude_words):
                    continue
                # Skip if too short or too long
                if len(match) < 8 or len(match) > 40:
                    continue
                authors.append(match)

        # Deduplicate while preserving order
        seen = set()
        unique = []
        for a in authors:
            if a not in seen:
                seen.add(a)
                unique.append(a)

        return unique[:4] if unique else ["Unknown"]

    def _extract_publisher(self) -> str:
        """Extract publisher."""
        if self.metadata.get('Producer'):
            return self.metadata['Producer']

        for page_text in self.pages_text[:5]:
            match = re.search(r'Editura\s+([A-Za-zăâîșțĂÂÎȘȚ\s]+)', page_text)
            if match:
                return f"Editura {match.group(1).strip()}"

        return "Unknown Publisher"

    def _extract_grade(self) -> str:
        """Extract grade/class level."""
        for page_text in self.pages_text[:5]:
            match = re.search(r'clasa\s+a\s+([IVXL]+)-a', page_text, re.IGNORECASE)
            if match:
                return match.group(1)
        return "V"  # Default

    def _extract_approval(self) -> str:
        """Extract ministry approval order."""
        for page_text in self.pages_text[:5]:
            match = re.search(r'Ordinul\s+(?:Ministrului\s+)?(?:Educației\s+)?(?:nr\.?\s*)?(\d+[/\d.]+)', page_text, re.IGNORECASE)
            if match:
                return f"Ordin {match.group(1)}"
        return ""

    def _extract_toc(self) -> list:
        """Extract table of contents."""
        toc = []

        # Find ToC page (usually page 3-7)
        toc_page_idx = None

        # Method 1: Look for "CUPRINS" keyword
        for i, text in enumerate(self.pages_text[:10]):
            if re.search(r'CUPRINS|Cuprins|CONȚINUT', text):
                toc_page_idx = i
                break

        # Method 2: Look for page with many "....." patterns (ToC entries)
        if toc_page_idx is None:
            for i, text in enumerate(self.pages_text[3:10], start=3):
                # ToC typically has many dotted lines
                dot_matches = re.findall(r'\.{3,}', text)
                if len(dot_matches) >= 5:
                    toc_page_idx = i
                    self.log(f"Found ToC by dot pattern at page {i + 1}")
                    break

        if toc_page_idx is None:
            self.log("No ToC page found")
            return toc

        self.log(f"Found ToC at page {toc_page_idx + 1}")

        # Parse ToC entries - pattern: "Title ... page_number"
        toc_text = self.pages_text[toc_page_idx]

        # Match lines with page numbers
        lines = toc_text.split('\n')
        for line in lines:
            # Skip empty or header lines
            if not line.strip() or re.match(r'^(CUPRINS|Cuprins|CONȚINUT)', line):
                continue

            # Pattern: "Chapter/Lesson title ... 123" or "Title 123"
            match = re.match(r'^(.+?)\s*\.{2,}\s*(\d+)\s*$', line.strip())
            if not match:
                # Try without dots
                match = re.match(r'^(.+?)\s+(\d{1,3})\s*$', line.strip())

            if match:
                title = match.group(1).strip()
                page = int(match.group(2))

                # Determine if it's a chapter or lesson based on indentation/formatting
                is_chapter = (
                    title.isupper() or
                    re.match(r'^(Capitolul|Unitatea|Modulul)\s+\d', title, re.IGNORECASE) or
                    not title.startswith(' ')
                )

                toc.append({
                    'title': title,
                    'page': page,
                    'type': 'chapter' if is_chapter else 'lesson'
                })

        self.log(f"Extracted {len(toc)} ToC entries")
        return toc

    def _extract_sections(self) -> list:
        """Extract all marked sections from the workbook."""
        sections = []

        for page_num, page_text in enumerate(self.pages_text):
            page_idx = page_num + 1  # 1-indexed

            for section_type, patterns in SECTION_MARKERS.items():
                for pattern in patterns:
                    matches = list(re.finditer(pattern, page_text, re.IGNORECASE))

                    for match in matches:
                        # Extract content after the marker until next marker or end
                        start_pos = match.end()

                        # Find next section marker
                        next_marker_pos = len(page_text)
                        for other_patterns in SECTION_MARKERS.values():
                            for other_pattern in other_patterns:
                                next_match = re.search(other_pattern, page_text[start_pos:], re.IGNORECASE)
                                if next_match:
                                    next_marker_pos = min(next_marker_pos, start_pos + next_match.start())

                        content = page_text[start_pos:next_marker_pos].strip()

                        # Extract items if it's an exercise/homework section
                        items = []
                        if section_type in ['practical_activity', 'practical_homework', 'evaluation']:
                            items = self._extract_exercise_items(content)
                        elif section_type == 'recap_terms':
                            items = self._extract_terms(content)

                        section = ExtractedSection(
                            type=section_type,
                            title=match.group(0),
                            content=content[:500],  # Limit content preview
                            page_start=page_idx,
                            page_end=page_idx,
                            items=items
                        )
                        sections.append(section)

        self.log(f"Extracted {len(sections)} raw sections")
        return sections

    def _extract_exercise_items(self, content: str) -> list:
        """Extract numbered exercise items from content."""
        items = []

        # Pattern 1: Numbered items "1. Task description"
        numbered = re.findall(r'(\d+)\.\s*(.+?)(?=\d+\.|$)', content, re.DOTALL)
        for num, text in numbered:
            items.append({
                'number': int(num),
                'text': text.strip()[:300],
                'type': 'task'
            })

        # Pattern 2: Lettered items "a) Option"
        if not items:
            lettered = re.findall(r'([a-z])\)\s*(.+?)(?=[a-z]\)|$)', content, re.DOTALL)
            for letter, text in lettered:
                items.append({
                    'number': ord(letter) - ord('a') + 1,
                    'text': text.strip()[:300],
                    'type': 'option'
                })

        # Pattern 3: Bullet points "• Item" or "- Item"
        if not items:
            bullets = re.findall(r'[•\-]\s*(.+?)(?=[•\-]|$)', content, re.DOTALL)
            for i, text in enumerate(bullets):
                items.append({
                    'number': i + 1,
                    'text': text.strip()[:300],
                    'type': 'bullet'
                })

        return items

    def _extract_terms(self, content: str) -> list:
        """Extract key terms from recap section."""
        terms = []

        # Pattern: "term – definition" or "term: definition"
        matches = re.findall(r'([A-Za-zăâîșțĂÂÎȘȚ\s]+)\s*[–\-:]\s*(.+?)(?=\n|$)', content)
        for term, definition in matches:
            term = term.strip()
            if len(term) > 2 and len(term) < 50:
                terms.append({
                    'term': term,
                    'definition': definition.strip()[:200]
                })

        return terms

    def _group_into_lessons(self, toc: list, sections: list) -> list:
        """Group extracted sections into lessons based on ToC."""
        lessons = []

        # Get lesson entries from ToC
        lesson_entries = [e for e in toc if e.get('type') == 'lesson']

        if not lesson_entries:
            # Fallback: create lessons from section clusters
            self.log("No lessons in ToC, using section clustering")
            return self._cluster_sections_into_lessons(sections)

        # For each lesson in ToC, gather relevant sections
        for i, entry in enumerate(lesson_entries):
            start_page = entry['page']
            end_page = lesson_entries[i + 1]['page'] - 1 if i + 1 < len(lesson_entries) else start_page + 10

            # Find parent chapter
            chapter = ""
            for toc_entry in reversed(toc[:toc.index(entry)]):
                if toc_entry.get('type') == 'chapter':
                    chapter = toc_entry['title']
                    break

            # Gather sections for this page range
            lesson_sections = [
                s for s in sections
                if start_page <= s.page_start <= end_page
            ]

            lesson = ExtractedLesson(
                title=entry['title'],
                chapter=chapter,
                page_start=start_page,
                page_end=end_page,
                objectives=[s.content for s in lesson_sections if s.type == 'objectives'],
                theory="\n".join([s.content for s in lesson_sections if s.type == 'theory']),
                activities=[asdict(s) for s in lesson_sections if s.type == 'practical_activity'],
                homework=[asdict(s) for s in lesson_sections if s.type == 'practical_homework'],
                evaluation=[asdict(s) for s in lesson_sections if s.type == 'evaluation'],
                terms=[item for s in lesson_sections if s.type == 'recap_terms' for item in s.items],
                fun_facts=[s.content for s in lesson_sections if s.type == 'did_you_know'],
            )
            lessons.append(lesson)

        self.log(f"Grouped into {len(lessons)} lessons")
        return lessons

    def _cluster_sections_into_lessons(self, sections: list) -> list:
        """Fallback: cluster sections by page proximity."""
        lessons = []
        current_lesson = None

        for section in sorted(sections, key=lambda s: s.page_start):
            if section.type == 'objectives':
                # New lesson starts with objectives
                if current_lesson:
                    lessons.append(current_lesson)
                current_lesson = ExtractedLesson(
                    title=f"Lesson (Page {section.page_start})",
                    chapter="",
                    page_start=section.page_start,
                    page_end=section.page_start,
                    objectives=[section.content]
                )
            elif current_lesson:
                # Add to current lesson
                current_lesson.page_end = section.page_start
                if section.type == 'practical_activity':
                    current_lesson.activities.append(asdict(section))
                elif section.type == 'practical_homework':
                    current_lesson.homework.append(asdict(section))
                elif section.type == 'evaluation':
                    current_lesson.evaluation.append(asdict(section))
                elif section.type == 'recap_terms':
                    current_lesson.terms.extend(section.items)
                elif section.type == 'did_you_know':
                    current_lesson.fun_facts.append(section.content)

        if current_lesson:
            lessons.append(current_lesson)

        return lessons


def to_learninghub_format(workbook: ExtractedWorkbook) -> dict:
    """Convert extracted workbook to LearningHub-compatible format."""

    # Map Roman numeral grade
    grade_map = {'V': 5, 'VI': 6, 'VII': 7, 'VIII': 8}
    grade_num = grade_map.get(workbook.grade, 5)

    lessons_json = []

    for i, lesson in enumerate(workbook.lessons):
        lesson_code = f"{workbook.grade}-M1-L{i+1:02d}"

        # Convert activities to practice tasks
        practice_tasks = {
            'minim': [],
            'standard': [],
            'performanta': []
        }

        for activity in lesson.activities:
            items = activity.get('items', [])
            for j, item in enumerate(items):
                task = {
                    'task': item.get('text', ''),
                    'expected_output': 'Răspuns corect conform cerințelor'
                }
                # Distribute across levels
                if j % 3 == 0:
                    practice_tasks['minim'].append(task)
                elif j % 3 == 1:
                    practice_tasks['standard'].append(task)
                else:
                    practice_tasks['performanta'].append(task)

        # Ensure at least one item per level
        for level in practice_tasks:
            if not practice_tasks[level]:
                practice_tasks[level].append({
                    'task': f'Exercițiu {level} din lecție',
                    'expected_output': 'Completează conform cerințelor'
                })

        lesson_json = {
            'meta': {
                'grade': workbook.grade,
                'module_index': 1,
                'lesson_code': lesson_code,
                'title_ro': lesson.title,
                'duration_minutes': 50,
                'prerequisites': [],
                'tools': ['Calculator', 'Manual'],
                'safety_and_ethics': ['Utilizarea responsabilă a calculatorului']
            },
            'source': {
                'workbook': workbook.title,
                'authors': workbook.authors,
                'page_start': lesson.page_start,
                'page_end': lesson.page_end,
                'chapter': lesson.chapter
            },
            'objectives': lesson.objectives,
            'theory_preview': lesson.theory[:500] if lesson.theory else '',
            'practice_tasks': practice_tasks,
            'evaluation_items': [
                {'text': item.get('text', ''), 'type': item.get('type', 'task')}
                for activity in lesson.evaluation
                for item in activity.get('items', [])
            ],
            'key_terms': lesson.terms,
            'fun_facts': lesson.fun_facts,
            'x_metadata': {
                'extracted_from_pdf': True,
                'extraction_date': workbook.extracted_at,
                'needs_manual_review': True
            }
        }

        lessons_json.append(lesson_json)

    return {
        'workbook': {
            'title': workbook.title,
            'authors': workbook.authors,
            'publisher': workbook.publisher,
            'grade': workbook.grade,
            'approval': workbook.approval,
            'total_pages': workbook.total_pages,
            'source_file': workbook.source_file,
            'extracted_at': workbook.extracted_at
        },
        'table_of_contents': workbook.toc,
        'lessons': lessons_json,
        'statistics': {
            'total_lessons': len(lessons_json),
            'total_activities': sum(len(l.activities) for l in workbook.lessons),
            'total_terms': sum(len(l.terms) for l in workbook.lessons),
            'total_sections': len(workbook.raw_sections)
        }
    }


def main():
    parser = argparse.ArgumentParser(description='Extract content from PDF workbooks')
    parser.add_argument('pdf_path', help='Path to PDF workbook')
    parser.add_argument('--output', '-o', help='Output JSON path (default: same name as PDF)')
    parser.add_argument('--debug', '-d', action='store_true', help='Enable debug output')
    parser.add_argument('--raw', '-r', action='store_true', help='Output raw extraction (not LearningHub format)')

    args = parser.parse_args()

    # Validate input
    pdf_path = Path(args.pdf_path)
    if not pdf_path.exists():
        print(f"ERROR: File not found: {pdf_path}")
        return 1

    # Determine output path
    if args.output:
        output_path = Path(args.output)
    else:
        output_path = pdf_path.with_suffix('.extracted.json')

    # Extract
    extractor = PDFWorkbookExtractor(str(pdf_path), debug=args.debug)
    workbook = extractor.extract()

    # Convert to output format
    if args.raw:
        # Raw extraction (use asdict for dataclasses)
        output_data = {
            'title': workbook.title,
            'authors': workbook.authors,
            'publisher': workbook.publisher,
            'grade': workbook.grade,
            'approval': workbook.approval,
            'extracted_at': workbook.extracted_at,
            'source_file': workbook.source_file,
            'total_pages': workbook.total_pages,
            'toc': workbook.toc,
            'lessons': [asdict(l) for l in workbook.lessons],
            'raw_sections': [asdict(s) for s in workbook.raw_sections]
        }
    else:
        output_data = to_learninghub_format(workbook)

    # Save
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*60}")
    print(f"EXTRACTION COMPLETE")
    print(f"{'='*60}")
    print(f"Title: {workbook.title}")
    print(f"Grade: Clasa a {workbook.grade}-a")
    print(f"Authors: {', '.join(workbook.authors)}")
    print(f"Pages: {workbook.total_pages}")
    print(f"ToC Entries: {len(workbook.toc)}")
    print(f"Sections Found: {len(workbook.raw_sections)}")
    print(f"Lessons Grouped: {len(workbook.lessons)}")
    print(f"Output: {output_path}")
    print(f"{'='*60}")

    return 0


if __name__ == '__main__':
    exit(main())
