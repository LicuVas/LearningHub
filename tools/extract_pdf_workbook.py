#!/usr/bin/env python3
"""
Extract structured content from Romanian ICT/Informatica PDF workbooks.
Designed for LearningHub integration.

Supports two PDF extraction backends:
- pdfplumber: Default, good for most PDFs
- pymupdf (fitz): Better handling of CID fonts and complex encodings

OCR Support (for scanned PDFs):
- Uses Tesseract OCR with Romanian language support
- Requires: pytesseract, PyMuPDF, Tesseract OCR installed

Usage:
    python extract_pdf_workbook.py <pdf_path> [--output <json_path>] [--debug]
    python extract_pdf_workbook.py <pdf_path> --ocr          # Force OCR mode
    python extract_pdf_workbook.py <pdf_path> --no-ocr       # Disable OCR fallback
    python extract_pdf_workbook.py --check-ocr               # Check OCR availability

Examples:
    # Auto mode (recommended) - tries text extraction, falls back to OCR if needed
    python extract_pdf_workbook.py "C:/AI/Projects/Scoala/2025-2026/VictorBrauner/Manuale/cls_05/A1230.pdf"

    # Force OCR for scanned PDFs
    python extract_pdf_workbook.py "scanned_manual.pdf" --ocr

    # Force PyMuPDF backend (no OCR)
    python extract_pdf_workbook.py "manual.pdf" --backend pymupdf --no-ocr

OCR Requirements:
    - pytesseract: pip install pytesseract
    - PyMuPDF: pip install pymupdf (for rendering PDF pages to images)
    - Tesseract OCR: https://github.com/tesseract-ocr/tesseract
      Windows: choco install tesseract OR download from UB-Mannheim releases
      Linux: apt install tesseract-ocr tesseract-ocr-ron
    - Romanian language pack: tesseract-ocr-ron
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
    PDFPLUMBER_AVAILABLE = True
except ImportError:
    PDFPLUMBER_AVAILABLE = False

try:
    import fitz  # PyMuPDF
    PYMUPDF_AVAILABLE = True
except ImportError:
    PYMUPDF_AVAILABLE = False

# Ensure at least one backend is available
if not PDFPLUMBER_AVAILABLE and not PYMUPDF_AVAILABLE:
    print("ERROR: No PDF backend available. Install one of:")
    print("  pip install pdfplumber")
    print("  pip install pymupdf")
    exit(1)

# =============================================================================
# OCR DEPENDENCIES
# =============================================================================

OCR_AVAILABLE = False
TESSERACT_PATH = None
TESSERACT_VERSION = None

try:
    import pytesseract
    from PIL import Image

    # Try to find Tesseract on Windows
    if sys.platform == 'win32':
        tesseract_paths = [
            r"C:\Program Files\Tesseract-OCR\tesseract.exe",
            r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
            r"C:\tools\Tesseract-OCR\tesseract.exe",
            r"C:\Tesseract-OCR\tesseract.exe",
            r"C:\Users\Default\AppData\Local\Programs\Tesseract-OCR\tesseract.exe",
        ]
        for path in tesseract_paths:
            if Path(path).exists():
                pytesseract.pytesseract.tesseract_cmd = path
                TESSERACT_PATH = path
                break

    # Verify Tesseract works
    try:
        TESSERACT_VERSION = pytesseract.get_tesseract_version()
        OCR_AVAILABLE = True
    except Exception:
        OCR_AVAILABLE = False

except ImportError:
    pass  # OCR will be disabled


def normalize_romanian_encoding(text: str) -> str:
    """Normalize legacy Romanian character encodings to modern UTF-8."""
    if not text:
        return text
    # Legacy encoding mappings (common in older PDFs)
    replacements = {
        'þ': 'ț',  # Legacy t-cedilla to t-comma
        'º': 'ș',  # Legacy s-cedilla to s-comma
        'ã': 'ă',  # Legacy a-breve
        'Þ': 'Ț',  # Uppercase variants
        'ª': 'Ș',
        'Ã': 'Ă',
        # Additional common substitutions
        'ţ': 'ț',  # Wrong cedilla variant
        'ş': 'ș',
        'Ţ': 'Ț',
        'Ş': 'Ș',
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


def clean_extracted_content(text: str) -> str:
    """
    Clean and normalize extracted PDF text.

    Fixes common issues:
    - Removes doubled characters (common in pdfplumber)
    - Removes page headers/footers
    - Removes orphan page numbers
    - Joins hyphenated words across lines
    - Normalizes whitespace
    - Removes CID font references

    Args:
        text: Raw extracted text

    Returns:
        Cleaned text
    """
    if not text:
        return text

    # 1. Remove CID font references (if any remaining)
    text = re.sub(r'\(cid:\d+\)', '', text)

    # 2. Fix doubled characters (e.g., "UUttiilliizzaarreeaa" → "Utilizarea")
    # This is common in some pdfplumber extractions
    def undouble(match):
        pairs = match.group(0)
        result = ''
        i = 0
        while i < len(pairs):
            if i + 1 < len(pairs) and pairs[i] == pairs[i + 1]:
                result += pairs[i]
                i += 2
            else:
                result += pairs[i]
                i += 1
        return result

    # Only apply to sequences of 4+ doubled chars (to avoid false positives)
    text = re.sub(r'((\w)\2){4,}', undouble, text)

    # 3. Remove common page headers/footers
    lines = text.split('\n')
    cleaned_lines = []

    for line in lines:
        line_stripped = line.strip()

        # Skip lines that are just page numbers
        if re.match(r'^\d{1,3}$', line_stripped):
            continue

        # Skip common header/footer patterns
        if re.match(r'^(Pagina?|Page)\s+\d+', line_stripped, re.IGNORECASE):
            continue

        cleaned_lines.append(line)

    text = '\n'.join(cleaned_lines)

    # 4. Join hyphenated words across lines
    text = re.sub(r'(\w+)-\s*\n\s*(\w+)', r'\1\2', text)

    # 5. Normalize whitespace
    text = re.sub(r' {2,}', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text)

    # Remove trailing/leading whitespace from each line
    lines = [line.rstrip() for line in text.split('\n')]
    text = '\n'.join(lines)

    return text.strip()


def detect_broken_cid_text(text: str, threshold: float = 0.05) -> bool:
    """
    Detect if text contains CID font patterns indicating broken extraction.

    CID (Character Identifier) patterns like (cid:123) appear when pdfplumber
    cannot decode the font's character mapping. This is common with:
    - Embedded CID fonts
    - Custom/proprietary fonts
    - Some Romanian diacritic fonts

    Args:
        text: The extracted text to check
        threshold: Ratio of CID patterns to total characters (default 5%)

    Returns:
        True if text appears broken (high CID ratio)
    """
    if not text:
        return False

    # Pattern matches: (cid:123) or similar CID references
    cid_pattern = r'\(cid:\d+\)'
    cid_matches = re.findall(cid_pattern, text)

    if not cid_matches:
        return False

    # Calculate ratio of CID content to total text
    cid_chars = sum(len(m) for m in cid_matches)
    total_chars = len(text)

    ratio = cid_chars / total_chars if total_chars > 0 else 0
    return ratio > threshold


def extract_text_with_pymupdf(pdf_path: str) -> tuple[list[str], dict, dict]:
    """
    Extract text from PDF using PyMuPDF (fitz) backend.

    PyMuPDF often handles CID fonts better than pdfplumber because it:
    - Uses MuPDF's font rendering engine
    - Has better ToUnicode CMap support
    - Can extract text even from complex font encodings

    Args:
        pdf_path: Path to the PDF file

    Returns:
        Tuple of (pages_text, metadata, quality_metrics)
        - pages_text: List of text strings, one per page
        - metadata: PDF metadata dict
        - quality_metrics: Extraction quality information
    """
    if not PYMUPDF_AVAILABLE:
        raise ImportError("PyMuPDF (fitz) is not installed. Run: pip install pymupdf")

    pages_text = []
    quality_metrics = {
        'backend': 'pymupdf',
        'empty_pages': 0,
        'total_chars': 0,
        'cid_patterns_found': 0,
    }

    doc = fitz.open(pdf_path)
    metadata = dict(doc.metadata) if doc.metadata else {}

    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text("text")  # "text" mode for plain text

        # Normalize Romanian encoding
        text = normalize_romanian_encoding(text)

        pages_text.append(text)

        # Track quality metrics
        quality_metrics['total_chars'] += len(text)
        if not text.strip():
            quality_metrics['empty_pages'] += 1

        # Check for any remaining CID patterns
        cid_matches = re.findall(r'\(cid:\d+\)', text)
        quality_metrics['cid_patterns_found'] += len(cid_matches)

    doc.close()

    quality_metrics['total_pages'] = len(pages_text)
    quality_metrics['avg_chars_per_page'] = (
        quality_metrics['total_chars'] / len(pages_text) if pages_text else 0
    )

    return pages_text, metadata, quality_metrics


def extract_text_with_pdfplumber(pdf_path: str) -> tuple[list[str], dict, dict]:
    """
    Extract text from PDF using pdfplumber backend.

    Args:
        pdf_path: Path to the PDF file

    Returns:
        Tuple of (pages_text, metadata, quality_metrics)
    """
    if not PDFPLUMBER_AVAILABLE:
        raise ImportError("pdfplumber is not installed. Run: pip install pdfplumber")

    pages_text = []
    quality_metrics = {
        'backend': 'pdfplumber',
        'empty_pages': 0,
        'total_chars': 0,
        'cid_patterns_found': 0,
    }

    with pdfplumber.open(pdf_path) as pdf:
        metadata = pdf.metadata or {}

        for page in pdf.pages:
            text = page.extract_text() or ""

            # Normalize Romanian encoding
            text = normalize_romanian_encoding(text)

            pages_text.append(text)

            # Track quality metrics
            quality_metrics['total_chars'] += len(text)
            if not text.strip():
                quality_metrics['empty_pages'] += 1

            # Check for CID patterns
            cid_matches = re.findall(r'\(cid:\d+\)', text)
            quality_metrics['cid_patterns_found'] += len(cid_matches)

    quality_metrics['total_pages'] = len(pages_text)
    quality_metrics['avg_chars_per_page'] = (
        quality_metrics['total_chars'] / len(pages_text) if pages_text else 0
    )

    return pages_text, metadata, quality_metrics


# =============================================================================
# OCR FUNCTIONS
# =============================================================================

def is_text_mostly_empty_or_garbage(text: str, min_words: int = 5) -> bool:
    """
    Check if extracted text is empty, too short, or garbage.

    Args:
        text: The extracted text
        min_words: Minimum word count to consider valid

    Returns:
        True if text should trigger OCR fallback
    """
    if not text or not text.strip():
        return True

    # Count actual words (alphabetic sequences)
    words = re.findall(r'[a-zA-ZăâîșțĂÂÎȘȚ]{2,}', text)
    if len(words) < min_words:
        return True

    # Check for high ratio of non-letter characters (garbage)
    letters = len(re.findall(r'[a-zA-ZăâîșțĂÂÎȘȚ]', text))
    total = len(text.replace(' ', '').replace('\n', ''))
    if total > 0 and letters / total < 0.5:
        return True

    return False


def extract_text_with_ocr(pdf_path: str, page_num: int, lang: str = 'ron',
                          dpi: int = 300, debug: bool = False) -> str:
    """
    Extract text from a PDF page using OCR.

    Uses PyMuPDF to render the page as an image, then Tesseract for OCR.

    Args:
        pdf_path: Path to the PDF file
        page_num: Page number (0-indexed)
        lang: Tesseract language code ('ron' for Romanian)
        dpi: Resolution for rendering (higher = better quality but slower)
        debug: Enable debug output

    Returns:
        Extracted text from OCR
    """
    if not OCR_AVAILABLE:
        raise RuntimeError("OCR not available. Install Tesseract and pytesseract.")

    if not PYMUPDF_AVAILABLE:
        raise RuntimeError("PyMuPDF required for OCR. Run: pip install pymupdf")

    doc = fitz.open(pdf_path)
    page = doc[page_num]

    # Render page to image
    # zoom = dpi / 72 gives us the target DPI (PDF default is 72 DPI)
    zoom = dpi / 72
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat)

    # Convert to PIL Image
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

    doc.close()

    # Run Tesseract OCR
    try:
        text = pytesseract.image_to_string(img, lang=lang)
    except pytesseract.TesseractError as e:
        if 'ron' in str(e):
            # Romanian language pack not installed, try English
            if debug:
                print(f"  [OCR] Romanian language not available, using English")
            text = pytesseract.image_to_string(img, lang='eng')
        else:
            raise

    # Normalize Romanian characters from OCR output
    text = normalize_romanian_encoding(text)

    return text


def extract_all_pages_ocr(pdf_path: str, lang: str = 'ron', dpi: int = 300,
                          progress_callback=None) -> tuple[list[str], dict]:
    """
    Extract text from all PDF pages using OCR.

    Args:
        pdf_path: Path to the PDF file
        lang: Tesseract language code
        dpi: Resolution for rendering
        progress_callback: Optional callback(page_num, total_pages, text_preview)

    Returns:
        Tuple of (pages_text, quality_metrics)
    """
    if not PYMUPDF_AVAILABLE:
        raise RuntimeError("PyMuPDF required for OCR")

    doc = fitz.open(pdf_path)
    total_pages = len(doc)
    metadata = dict(doc.metadata) if doc.metadata else {}
    doc.close()

    pages_text = []
    quality_metrics = {
        'backend': 'ocr',
        'ocr_engine': f'tesseract-{TESSERACT_VERSION}' if TESSERACT_VERSION else 'tesseract',
        'language': lang,
        'dpi': dpi,
        'empty_pages': 0,
        'total_chars': 0,
        'pages_processed': 0,
    }

    for page_num in range(total_pages):
        try:
            text = extract_text_with_ocr(pdf_path, page_num, lang=lang, dpi=dpi)
            pages_text.append(text)
            quality_metrics['total_chars'] += len(text)

            if not text.strip():
                quality_metrics['empty_pages'] += 1

            quality_metrics['pages_processed'] += 1

            if progress_callback:
                preview = text[:50].replace('\n', ' ') if text else "(empty)"
                progress_callback(page_num + 1, total_pages, preview)

        except Exception as e:
            pages_text.append("")
            quality_metrics['empty_pages'] += 1
            if progress_callback:
                progress_callback(page_num + 1, total_pages, f"(error: {e})")

    quality_metrics['total_pages'] = total_pages
    quality_metrics['avg_chars_per_page'] = (
        quality_metrics['total_chars'] / total_pages if total_pages else 0
    )

    return pages_text, metadata, quality_metrics


def print_ocr_status():
    """Print OCR availability status."""
    print("\nOCR Status:")
    if OCR_AVAILABLE:
        print(f"  Tesseract: Available (v{TESSERACT_VERSION})")
        if TESSERACT_PATH:
            print(f"  Path: {TESSERACT_PATH}")
    else:
        print("  Tesseract: NOT AVAILABLE")
        print("  Install Tesseract for OCR support:")
        if sys.platform == 'win32':
            print("    choco install tesseract")
            print("    OR download from: https://github.com/UB-Mannheim/tesseract/wiki")
        else:
            print("    apt install tesseract-ocr tesseract-ocr-ron")
    print(f"  PyMuPDF: {'Available' if PYMUPDF_AVAILABLE else 'NOT AVAILABLE'}")


# =============================================================================
# SECTION MARKERS (Romanian workbook patterns)
# =============================================================================

SECTION_MARKERS = {
    'objectives': [
        r'OBIECTIVE',
        r'Obiectivele\s+lecției',
        r'La finalul lecției',
        r'La\s+sfâr[șs]itul\s+lec[țt]iei',
    ],
    'theory': [
        r'Noțiuni\s+teoretice',
        r'Concepte\s+de\s+bază',
        r'Conținut\s+teoretic',
    ],
    'practical_activity': [
        r'ACTIVITATE\s+PRACTICĂ',
        r'Activitate\s+practică',
        r'activitate\s+practică',
        r'ACTIVITATE\s+\d+',
    ],
    'practical_homework': [
        r'TEMA\s+PRACTICĂ',
        r'Tema\s+practică',
        r'TEMĂ\s+PENTRU\s+ACASĂ',
        r'Teme\s+și\s+activități\s+practice',
    ],
    'didactic_game': [
        r'Joc\s+didactic',
        r'JOC\s+DIDACTIC',
    ],
    'did_you_know': [
        r'ȘTIAȚI\s+CĂ',
        r'Știați\s+că',
        r'ȘTIAI\s+CĂ',
        r'Știai\s+că',
    ],
    'attention': [
        r'Atenție!',
        r'ATENȚIE!',
        r'Atenţie!',
        r'⚠',
    ],
    'recap_terms': [
        r'RECAPITULĂM\s+TERMENII',
        r'Recapitulăm\s+termenii',
        r'TERMENI\s+NOI',
        r'Termeni\s+cheie',
        r'Cuvinte\s+cheie',
    ],
    'evaluation': [
        r'Test\s+de\s+evaluare',
        r'TEST\s+DE\s+EVALUARE',
        r'EVALUARE',
        r'Evaluare',
        r'Test\s+de\s+autoevaluare',
    ],
    'recapitulation': [
        r'RECAPITULARE',
        r'Recapitulare',
    ],
    # Additional markers from quality analysis
    'requirements': [
        r'Cerințe:',
        r'Cerință:',
        r'CERINȚE',
    ],
    'exercises': [
        r'Exerciții',
        r'EXERCIȚII',
        r'Exercițiul\s+\d+',
    ],
    'problems': [
        r'Probleme',
        r'PROBLEME',
        r'Problema\s+\d+',
    ],
    'definitions': [
        r'Definiție:',
        r'Definiții:',
        r'DEFINIȚIE',
        r'DEFINIȚII',
    ],
    'examples': [
        r'Exemple',
        r'EXEMPLE',
        r'Exemplul?\s+\d+',
    ],
    'solution': [
        r'Rezolvare',
        r'REZOLVARE',
        r'Soluție',
        r'SOLUȚIE',
    ],
    'remember': [
        r'Reține!?',
        r'REȚINE',
        r'De\s+reținut',
    ],
    'important': [
        r'Important!',
        r'IMPORTANT!?',
    ],
    'self_check': [
        r'Verifică-ți\s+cunoștințele',
        r'Autoevaluare',
        r'AUTOEVALUARE',
    ],
    'worksheet': [
        r'Fișa\s+de\s+lucru',
        r'FIȘA\s+DE\s+LUCRU',
    ],
    'suggestions': [
        r'Sugestii',
        r'SUGESTII',
        r'Sugestii\s+de\s+continuare',
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
    extraction_method: str = "text"  # 'text' or 'ocr'
    ocr_pages: list = field(default_factory=list)  # Pages that used OCR (0-indexed)


class PDFWorkbookExtractor:
    """Extract structured content from Romanian ICT workbooks."""

    def __init__(self, pdf_path: str, debug: bool = False, backend: str = 'auto',
                 ocr_mode: str = 'auto'):
        """
        Initialize the PDF workbook extractor.

        Args:
            pdf_path: Path to the PDF file
            debug: Enable debug output
            backend: PDF extraction backend to use
                - 'auto': Try pdfplumber first, fall back to pymupdf if CID issues detected
                - 'pdfplumber': Use pdfplumber only
                - 'pymupdf': Use PyMuPDF (fitz) only
            ocr_mode: OCR behavior
                - 'auto': Use OCR as fallback when text extraction fails
                - 'force': Always use OCR
                - 'disable': Never use OCR
        """
        self.pdf_path = Path(pdf_path)
        self.debug = debug
        self.backend = backend
        self.ocr_mode = ocr_mode
        self.pdf = None
        self.pages_text = []
        self.metadata = {}
        self.quality_metrics = {}
        self.backend_used = None
        self.ocr_pages = []  # Track which pages used OCR (0-indexed)

    def log(self, msg: str):
        """Debug logging."""
        if self.debug:
            print(f"[DEBUG] {msg}")

    def extract(self) -> ExtractedWorkbook:
        """Main extraction method."""
        print(f"Opening PDF: {self.pdf_path}")

        # Extract text using selected backend
        self._extract_with_backend()

        # Warn about potential scanned PDF
        empty_pages = self.quality_metrics.get('empty_pages', 0)
        total_pages = self.quality_metrics.get('total_pages', len(self.pages_text))
        if empty_pages > total_pages * 0.8:
            print(f"WARNING: {empty_pages}/{total_pages} pages have no extractable text.")
            print("This might be a scanned/image-based PDF that requires OCR.")

        # Build result
        result = ExtractedWorkbook(
            title=self._extract_title(),
            authors=self._extract_authors(),
            publisher=self._extract_publisher(),
            grade=self._extract_grade(),
            approval=self._extract_approval(),
            extracted_at=datetime.now().isoformat(),
            source_file=str(self.pdf_path),
            total_pages=total_pages,
            extraction_method='ocr' if len(self.ocr_pages) == total_pages else ('text+ocr' if self.ocr_pages else 'text'),
            ocr_pages=self.ocr_pages,
        )

        # Extract table of contents
        result.toc = self._extract_toc()

        # Extract sections by markers
        result.raw_sections = self._extract_sections()

        # Group into lessons
        result.lessons = self._group_into_lessons(result.toc, result.raw_sections)

        return result

    def _ocr_progress(self, current: int, total: int, preview: str):
        """Progress callback for OCR."""
        bar_width = 30
        filled = int(bar_width * current / total)
        bar = '=' * filled + '-' * (bar_width - filled)
        print(f"\r  OCR: [{bar}] {current}/{total} - {preview[:30]}...", end='', flush=True)
        if current == total:
            print()  # New line at end

    def _extract_with_backend(self) -> None:
        """
        Extract text from PDF using the configured backend with optional OCR fallback.

        Backend selection logic:
        - 'auto': Try pdfplumber first. If CID patterns detected, retry with pymupdf.
        - 'pdfplumber': Use pdfplumber only.
        - 'pymupdf': Use PyMuPDF (fitz) only.

        OCR mode:
        - 'force': Always use OCR
        - 'auto': Fall back to OCR when text extraction fails
        - 'disable': Never use OCR
        """
        pdf_path_str = str(self.pdf_path)

        # Force OCR mode - skip text extraction entirely
        if self.ocr_mode == 'force':
            if not OCR_AVAILABLE:
                print("ERROR: OCR requested but Tesseract is not available.")
                print_ocr_status()
                raise RuntimeError("OCR not available")

            print(f"Extracting with OCR (forced mode)...")
            self.pages_text, self.metadata, self.quality_metrics = extract_all_pages_ocr(
                pdf_path_str,
                lang='ron',
                progress_callback=self._ocr_progress
            )
            self.backend_used = 'ocr'
            self.ocr_pages = list(range(len(self.pages_text)))
            return

        # Standard text extraction
        if self.backend == 'pymupdf':
            # Force PyMuPDF backend
            if not PYMUPDF_AVAILABLE:
                raise ImportError("PyMuPDF requested but not installed. Run: pip install pymupdf")
            print(f"Using PyMuPDF backend...")
            self.pages_text, self.metadata, self.quality_metrics = extract_text_with_pymupdf(pdf_path_str)
            self.backend_used = 'pymupdf'

        elif self.backend == 'pdfplumber':
            # Force pdfplumber backend
            if not PDFPLUMBER_AVAILABLE:
                raise ImportError("pdfplumber requested but not installed. Run: pip install pdfplumber")
            print(f"Using pdfplumber backend...")
            self.pages_text, self.metadata, self.quality_metrics = extract_text_with_pdfplumber(pdf_path_str)
            self.backend_used = 'pdfplumber'

        else:  # 'auto' mode
            # Try pdfplumber first if available
            if PDFPLUMBER_AVAILABLE:
                print(f"Extracting text with pdfplumber (auto mode)...")
                self.pages_text, self.metadata, self.quality_metrics = extract_text_with_pdfplumber(pdf_path_str)
                self.backend_used = 'pdfplumber'

                # Check for CID patterns in extracted text
                combined_text = '\n'.join(self.pages_text[:10])  # Check first 10 pages
                if detect_broken_cid_text(combined_text):
                    cid_count = self.quality_metrics.get('cid_patterns_found', 0)
                    print(f"WARNING: Detected {cid_count} CID font patterns with pdfplumber.")

                    if PYMUPDF_AVAILABLE:
                        print(f"Falling back to PyMuPDF backend for better CID font handling...")
                        self.pages_text, self.metadata, self.quality_metrics = extract_text_with_pymupdf(pdf_path_str)
                        self.backend_used = 'pymupdf'
                        new_cid_count = self.quality_metrics.get('cid_patterns_found', 0)
                        print(f"PyMuPDF extraction complete. CID patterns: {new_cid_count}")
                    else:
                        print("WARNING: PyMuPDF not available for fallback. Text may contain CID patterns.")
            elif PYMUPDF_AVAILABLE:
                # Only PyMuPDF available
                print(f"Using PyMuPDF backend (pdfplumber not available)...")
                self.pages_text, self.metadata, self.quality_metrics = extract_text_with_pymupdf(pdf_path_str)
                self.backend_used = 'pymupdf'
            else:
                raise ImportError("No PDF backend available. Install pdfplumber or pymupdf.")

        # Log extraction summary
        total_pages = self.quality_metrics.get('total_pages', len(self.pages_text))
        total_chars = self.quality_metrics.get('total_chars', 0)
        cid_count = self.quality_metrics.get('cid_patterns_found', 0)
        print(f"Extracted {total_pages} pages, {total_chars:,} chars using {self.backend_used}")
        if cid_count > 0:
            print(f"Note: {cid_count} CID patterns remain in extracted text")

        # OCR fallback for pages with no/bad text (unless disabled)
        if self.ocr_mode != 'disable':
            self._apply_ocr_fallback(pdf_path_str)

        # Debug output for first few pages
        if self.debug:
            for i, text in enumerate(self.pages_text[:3]):
                self.log(f"Page {i+1} preview: {text[:200]}...")

    def _apply_ocr_fallback(self, pdf_path_str: str) -> None:
        """
        Apply OCR to pages that have empty or garbage text.

        Args:
            pdf_path_str: Path to the PDF file
        """
        needs_ocr_pages = []

        # Identify pages that need OCR
        for i, text in enumerate(self.pages_text):
            if is_text_mostly_empty_or_garbage(text) or detect_broken_cid_text(text):
                needs_ocr_pages.append(i)

        if not needs_ocr_pages:
            self.log("Text extraction successful, no OCR needed")
            return

        # Report OCR need
        total_pages = len(self.pages_text)
        ocr_ratio = len(needs_ocr_pages) / total_pages
        print(f"  {len(needs_ocr_pages)}/{total_pages} pages need OCR ({ocr_ratio:.0%})")

        if not OCR_AVAILABLE:
            print("  WARNING: OCR not available. Some pages may have missing text.")
            print("  Install Tesseract for OCR support:")
            if sys.platform == 'win32':
                print("    choco install tesseract")
                print("    OR download from: https://github.com/UB-Mannheim/tesseract/wiki")
            else:
                print("    apt install tesseract-ocr tesseract-ocr-ron")
            return

        print(f"  Running OCR on {len(needs_ocr_pages)} pages (this may take a while)...")

        for i, page_num in enumerate(needs_ocr_pages):
            try:
                ocr_text = extract_text_with_ocr(pdf_path_str, page_num, lang='ron', debug=self.debug)
                self.pages_text[page_num] = ocr_text
                self.ocr_pages.append(page_num)

                # Progress indicator
                preview = ocr_text[:30].replace('\n', ' ') if ocr_text else "(empty)"
                bar_width = 20
                filled = int(bar_width * (i + 1) / len(needs_ocr_pages))
                bar = '=' * filled + '-' * (bar_width - filled)
                print(f"\r  OCR [{bar}] {i+1}/{len(needs_ocr_pages)} p.{page_num+1}: {preview}...", end='', flush=True)

            except Exception as e:
                self.log(f"OCR failed for page {page_num}: {e}")

        print()  # New line after progress

        if self.ocr_pages:
            self.backend_used = f"{self.backend_used}+ocr"
            print(f"  OCR completed for {len(self.ocr_pages)} pages")

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
                title_raw = match.group(1)  # Before strip - preserve indentation info
                title = title_raw.strip()

                # Validate page number
                try:
                    page = int(match.group(2))
                except ValueError:
                    self.log(f"Invalid page number in ToC: {match.group(2)}")
                    continue

                # Check if it's a lesson (Lecția/Lecþia pattern - handles legacy encoding)
                is_lesson = bool(re.search(r'Lec[țþ]ia\s+\d|Lecția\s+\d', title, re.IGNORECASE))

                # Check indentation BEFORE stripping (spaces/tabs indicate sub-item)
                is_indented = title_raw.startswith(' ') or title_raw.startswith('\t')

                # Determine if it's a chapter (unit/module header)
                is_chapter = (not is_lesson) and (
                    title.isupper() or
                    re.match(r'^(Capitolul|Unitatea|Modulul)\s+\d', title, re.IGNORECASE) or
                    (not is_indented and not is_lesson)
                )

                # If it's a lesson or indented, mark as lesson
                entry_type = 'lesson' if (is_lesson or is_indented) else 'chapter'

                toc.append({
                    'title': title,
                    'page': page,
                    'type': entry_type
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
        """
        Extract numbered exercise items from content with improved handling.

        Improvements:
        - Better multi-line item support
        - Nested sub-items (a, b, c under 1, 2, 3)
        - Content cleaning before extraction
        """
        items = []

        # Clean content first
        content = clean_extracted_content(content)

        # Pattern 1: Numbered items with potential sub-items
        numbered_pattern = r'(\d+)\.\s+(.+?)(?=(?:\n\s*\d+\.)|$)'
        numbered_matches = re.finditer(numbered_pattern, content, re.DOTALL)

        for match in numbered_matches:
            num = int(match.group(1))
            item_text = match.group(2).strip()

            # Check for sub-items (a), b), c) within this item
            sub_items_found = []
            sub_pattern = r'([a-z])\)\s+(.+?)(?=(?:\n\s*[a-z]\))|$)'
            sub_matches = re.finditer(sub_pattern, item_text, re.DOTALL)

            for sub_match in sub_matches:
                letter = sub_match.group(1)
                sub_text = sub_match.group(2).strip()
                sub_items_found.append({
                    'letter': letter,
                    'text': sub_text[:200]
                })

            # If sub-items were found, remove them from main text
            if sub_items_found:
                first_sub = re.search(r'[a-z]\)', item_text)
                if first_sub:
                    item_text = item_text[:first_sub.start()].strip()

            items.append({
                'number': num,
                'text': item_text[:300],
                'type': 'task',
                'subitems': sub_items_found
            })

        # Pattern 2: If no numbered items, try lettered items
        if not items:
            lettered_pattern = r'([a-z])\)\s+(.+?)(?=(?:\n\s*[a-z]\))|$)'
            lettered_matches = re.finditer(lettered_pattern, content, re.DOTALL)

            for match in lettered_matches:
                letter = match.group(1)
                text = match.group(2).strip()

                items.append({
                    'number': ord(letter) - ord('a') + 1,
                    'text': text[:300],
                    'type': 'option',
                    'subitems': []
                })

        # Pattern 3: Bullet points "• Item" or "- Item"
        if not items:
            bullet_pattern = r'[•\-]\s+(.+?)(?=(?:\n\s*[•\-])|$)'
            bullet_matches = re.finditer(bullet_pattern, content, re.DOTALL)

            for i, match in enumerate(bullet_matches):
                text = match.group(1).strip()

                items.append({
                    'number': i + 1,
                    'text': text[:300],
                    'type': 'bullet',
                    'subitems': []
                })

        return items

    def _extract_terms(self, content: str) -> list:
        """
        Extract key terms from recap/definition sections.

        Improvements:
        - Multiple definition formats
        - Numbered definitions support
        - Better cleanup of definitions
        """
        terms = []

        # Clean content first
        content = clean_extracted_content(content)

        # Pattern 1: "term – definition" or "term: definition" or "term - definition"
        pattern1 = r'([A-ZĂÂÎȘȚ][A-Za-zăâîșțĂÂÎȘȚ\s]{2,50}?)\s*[–\-:]\s*(.+?)(?=\n[A-ZĂÂÎȘȚ]|\n\n|$)'
        matches1 = re.finditer(pattern1, content, re.DOTALL)

        for match in matches1:
            term = match.group(1).strip()
            definition = match.group(2).strip()

            # Clean up definition (remove newlines within definition)
            definition = ' '.join(definition.split())

            if len(term) > 2 and len(term) < 60 and len(definition) > 5:
                terms.append({
                    'term': term,
                    'definition': definition[:250]
                })

        # Pattern 2: Numbered definitions "1. Term – definition"
        if not terms:
            pattern2 = r'\d+\.\s+([A-ZĂÂÎȘȚ][A-Za-zăâîșțĂÂÎȘȚ\s]{2,50}?)\s*[–\-:]\s*(.+?)(?=\n\d+\.|\n\n|$)'
            matches2 = re.finditer(pattern2, content, re.DOTALL)

            for match in matches2:
                term = match.group(1).strip()
                definition = match.group(2).strip()
                definition = ' '.join(definition.split())

                if len(term) > 2 and len(term) < 60 and len(definition) > 5:
                    terms.append({
                        'term': term,
                        'definition': definition[:250]
                    })

        # Pattern 3: Bold terms (approximated by UPPERCASE or title case at line start)
        if not terms:
            pattern3 = r'^([A-ZĂÂÎȘȚ][A-Za-zăâîșțĂÂÎȘȚ\s]{2,50})\n(.+?)(?=\n[A-ZĂÂÎȘȚ]|\n\n|$)'
            matches3 = re.finditer(pattern3, content, re.MULTILINE | re.DOTALL)

            for match in matches3:
                term = match.group(1).strip()
                definition = match.group(2).strip()
                definition = ' '.join(definition.split())

                # Validate it looks like a term (not a sentence)
                if (len(term) > 2 and len(term) < 60 and
                    not term.endswith('.') and
                    len(definition) > 10):
                    terms.append({
                        'term': term,
                        'definition': definition[:250]
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
            'extracted_at': workbook.extracted_at,
            'extraction_method': workbook.extraction_method,
            'ocr_pages': workbook.ocr_pages,
        },
        'table_of_contents': workbook.toc,
        'lessons': lessons_json,
        'statistics': {
            'total_lessons': len(lessons_json),
            'total_activities': sum(len(l.activities) for l in workbook.lessons),
            'total_terms': sum(len(l.terms) for l in workbook.lessons),
            'total_sections': len(workbook.raw_sections),
            'ocr_pages_count': len(workbook.ocr_pages),
        }
    }


def main():
    parser = argparse.ArgumentParser(
        description='Extract content from PDF workbooks',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
OCR Support:
  For scanned PDFs, this script can use Tesseract OCR with Romanian language.
  Use --ocr to force OCR, --no-ocr to disable it.

Examples:
  %(prog)s manual.pdf                    # Auto-detect OCR need
  %(prog)s manual.pdf --ocr              # Force OCR mode
  %(prog)s manual.pdf --no-ocr           # Disable OCR fallback
  %(prog)s --check-ocr                   # Check OCR availability
"""
    )
    parser.add_argument('pdf_path', nargs='?', help='Path to PDF workbook')
    parser.add_argument('--output', '-o', help='Output JSON path (default: same name as PDF)')
    parser.add_argument('--debug', '-d', action='store_true', help='Enable debug output')
    parser.add_argument('--raw', '-r', action='store_true', help='Output raw extraction (not LearningHub format)')
    parser.add_argument('--backend', '-b', choices=['auto', 'pdfplumber', 'pymupdf'], default='auto',
                        help='PDF extraction backend: auto (try pdfplumber, fallback to pymupdf on CID issues), '
                             'pdfplumber (force pdfplumber), pymupdf (force PyMuPDF/fitz). Default: auto')
    parser.add_argument('--ocr', action='store_true', help='Force OCR mode (use Tesseract for all pages)')
    parser.add_argument('--no-ocr', action='store_true', help='Disable OCR fallback')
    parser.add_argument('--check-ocr', action='store_true', help='Check OCR availability and exit')

    args = parser.parse_args()

    # Check OCR status only
    if args.check_ocr:
        print_ocr_status()
        return 0

    # Validate input
    if not args.pdf_path:
        parser.print_help()
        return 1

    pdf_path = Path(args.pdf_path)
    if not pdf_path.exists():
        print(f"ERROR: File not found: {pdf_path}")
        return 1

    # Handle OCR mode conflicts
    if args.ocr and args.no_ocr:
        print("ERROR: Cannot use both --ocr and --no-ocr")
        return 1

    # Determine OCR mode
    if args.ocr:
        ocr_mode = 'force'
    elif args.no_ocr:
        ocr_mode = 'disable'
    else:
        ocr_mode = 'auto'

    # Determine output path
    if args.output:
        output_path = Path(args.output)
    else:
        output_path = pdf_path.with_suffix('.extracted.json')

    # Show OCR status if in debug mode
    if args.debug:
        print_ocr_status()

    # Extract
    extractor = PDFWorkbookExtractor(
        str(pdf_path),
        debug=args.debug,
        backend=args.backend,
        ocr_mode=ocr_mode
    )

    try:
        workbook = extractor.extract()
    except RuntimeError as e:
        print(f"ERROR: {e}")
        return 1

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
            'extraction_method': workbook.extraction_method,
            'ocr_pages': workbook.ocr_pages,
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
    print(f"Extraction: {workbook.extraction_method.upper()}")
    if workbook.ocr_pages:
        ocr_preview = ', '.join(str(p+1) for p in workbook.ocr_pages[:10])
        if len(workbook.ocr_pages) > 10:
            ocr_preview += '...'
        print(f"OCR Pages: {len(workbook.ocr_pages)} ({ocr_preview})")
    print(f"Backend: {extractor.backend_used}")
    print(f"ToC Entries: {len(workbook.toc)}")
    print(f"Sections Found: {len(workbook.raw_sections)}")
    print(f"Lessons Grouped: {len(workbook.lessons)}")
    if extractor.quality_metrics.get('cid_patterns_found', 0) > 0:
        print(f"CID Patterns: {extractor.quality_metrics['cid_patterns_found']} (may affect text quality)")
    print(f"Output: {output_path}")
    print(f"{'='*60}")

    return 0


if __name__ == '__main__':
    exit(main())
