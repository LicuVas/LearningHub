#!/usr/bin/env python3
"""
High-precision OCR extraction from scanned PDF workbooks.

This script extracts text from scanned PDFs using Tesseract OCR with maximum precision settings.
Designed for Romanian textbooks with optimal settings for academic content.

Key features:
- High DPI rendering (300 DPI for precision)
- Tesseract with Romanian language pack
- PSM 3 (fully automatic page segmentation) - best for book pages
- OEM 3 (LSTM neural net) - highest accuracy mode
- Block-level detection with confidence scores
- Same output format as extract_faithful_text.py for consistency

Requirements:
- Tesseract OCR installed (with Romanian language pack)
- PyMuPDF (fitz)
- pytesseract
- Pillow

Usage:
    python extract_faithful_ocr.py <pdf_path> [--output <json_path>]
    python extract_faithful_ocr.py <pdf_path> --dpi 400  # Higher DPI for very fine print
    python extract_faithful_ocr.py <pdf_path> --pages 1-10
"""

import sys
import io
import json
import argparse
import hashlib
import subprocess
from pathlib import Path
from datetime import datetime
from typing import Optional

# Fix Windows console encoding for Romanian characters
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

try:
    import fitz  # PyMuPDF
except ImportError:
    print("ERROR: PyMuPDF is required. Install with: pip install pymupdf")
    sys.exit(1)

try:
    import pytesseract
    from PIL import Image
except ImportError:
    print("ERROR: pytesseract and Pillow are required.")
    print("Install with: pip install pytesseract Pillow")
    sys.exit(1)


# =============================================================================
# TESSERACT CONFIGURATION
# =============================================================================

def find_tesseract():
    """Find Tesseract executable on Windows."""
    possible_paths = [
        r"C:\Program Files\Tesseract-OCR\tesseract.exe",
        r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        r"C:\tools\tesseract\tesseract.exe",
    ]

    for path in possible_paths:
        if Path(path).exists():
            return path

    # Try to find via where command
    try:
        result = subprocess.run(['where', 'tesseract'], capture_output=True, text=True)
        if result.returncode == 0:
            return result.stdout.strip().split('\n')[0]
    except:
        pass

    return None


def check_tesseract_languages():
    """Check available Tesseract languages."""
    try:
        result = subprocess.run(
            [pytesseract.pytesseract.tesseract_cmd, '--list-langs'],
            capture_output=True, text=True
        )
        langs = result.stdout.strip().split('\n')[1:]  # Skip header
        return [l.strip() for l in langs if l.strip()]
    except:
        return []


# =============================================================================
# ENCODING NORMALIZATION
# =============================================================================

ROMANIAN_ENCODING_MAP = {
    # Legacy t-cedilla variants to t-comma-below
    '\u00fe': '\u021b',  # þ → ț
    '\u0163': '\u021b',  # ţ → ț
    '\u00de': '\u021a',  # Þ → Ț
    '\u0162': '\u021a',  # Ţ → Ț

    # Legacy s-cedilla variants to s-comma-below
    '\u00ba': '\u0219',  # º → ș
    '\u015f': '\u0219',  # ş → ș
    '\u00aa': '\u0218',  # ª → Ș
    '\u015e': '\u0218',  # Ş → Ș

    # Legacy a-breve
    '\u00e3': '\u0103',  # ã → ă
    '\u00c3': '\u0102',  # Ã → Ă
}


def normalize_romanian_encoding(text: str) -> str:
    """Normalize legacy Romanian character encodings to modern UTF-8."""
    if not text:
        return text
    for old_char, new_char in ROMANIAN_ENCODING_MAP.items():
        text = text.replace(old_char, new_char)
    return text


def compute_md5(file_path: str) -> str:
    """Compute MD5 hash of file."""
    hash_md5 = hashlib.md5()
    with open(file_path, 'rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()


def parse_page_range(page_spec: str, total_pages: int) -> list[int]:
    """Parse page specification into list of 0-indexed page numbers."""
    pages = set()

    for part in page_spec.split(','):
        part = part.strip()
        if '-' in part:
            start, end = part.split('-', 1)
            start = int(start) - 1  # Convert to 0-indexed
            end = int(end) - 1
            pages.update(range(max(0, start), min(total_pages, end + 1)))
        else:
            page = int(part) - 1  # Convert to 0-indexed
            if 0 <= page < total_pages:
                pages.add(page)

    return sorted(pages)


# =============================================================================
# HIGH-PRECISION OCR EXTRACTION
# =============================================================================

class HighPrecisionOCRExtractor:
    """
    High-precision OCR extractor for scanned PDFs.

    Uses Tesseract with optimal settings for Romanian academic content:
    - DPI: 300 (or higher for fine print)
    - Language: ron (Romanian)
    - PSM: 3 (fully automatic page segmentation)
    - OEM: 3 (LSTM neural net - highest accuracy)
    """

    def __init__(self, dpi: int = 300, lang: str = 'ron'):
        self.dpi = dpi
        self.lang = lang

        # Find and configure Tesseract
        tesseract_path = find_tesseract()
        if tesseract_path:
            pytesseract.pytesseract.tesseract_cmd = tesseract_path
            print(f"Tesseract: {tesseract_path}")
        else:
            print("WARNING: Tesseract not found in common locations.")
            print("         Will try system PATH.")

        # Check languages
        available_langs = check_tesseract_languages()
        print(f"Available languages: {', '.join(available_langs[:10])}{'...' if len(available_langs) > 10 else ''}")

        if lang not in available_langs:
            if 'eng' in available_langs:
                print(f"WARNING: '{lang}' not available. Using 'eng' instead.")
                self.lang = 'eng'
            else:
                print(f"WARNING: '{lang}' not available. Using default.")
                self.lang = None

        # Tesseract configuration for maximum precision
        # PSM 3: Fully automatic page segmentation, but no OSD (Orientation and script detection)
        # OEM 3: Default, based on what is available (LSTM if available)
        self.tesseract_config = '--psm 3 --oem 3'

        # Additional config for better accuracy
        # preserve_interword_spaces: Don't merge words
        # tessedit_char_blacklist: Could be used to exclude unlikely characters
        self.tesseract_config += ' -c preserve_interword_spaces=1'

    def render_page_to_image(self, page: fitz.Page) -> Image.Image:
        """Render a PDF page to a PIL Image at specified DPI."""
        # Calculate zoom factor for desired DPI (PDF default is 72 DPI)
        zoom = self.dpi / 72.0
        mat = fitz.Matrix(zoom, zoom)

        # Render page to pixmap
        pix = page.get_pixmap(matrix=mat, alpha=False)

        # Convert to PIL Image
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

        return img

    def ocr_page(self, image: Image.Image) -> dict:
        """
        Perform OCR on a page image with detailed output.

        Returns dict with:
        - raw_text: Full page text
        - blocks: List of text blocks with bounding boxes and confidence
        """
        # Get full page text
        lang_param = self.lang if self.lang else 'eng'
        raw_text = pytesseract.image_to_string(
            image,
            lang=lang_param,
            config=self.tesseract_config
        )

        # Get detailed block-level data with confidence scores
        # image_to_data returns TSV with columns:
        # level, page_num, block_num, par_num, line_num, word_num,
        # left, top, width, height, conf, text
        data = pytesseract.image_to_data(
            image,
            lang=lang_param,
            config=self.tesseract_config,
            output_type=pytesseract.Output.DICT
        )

        # Group words into blocks
        blocks = []
        current_block = None
        current_block_num = -1

        for i in range(len(data['text'])):
            text = data['text'][i]
            if not text or not text.strip():
                continue

            block_num = data['block_num'][i]
            conf = int(data['conf'][i]) if data['conf'][i] != '-1' else 0

            # Bounding box
            x = data['left'][i]
            y = data['top'][i]
            w = data['width'][i]
            h = data['height'][i]

            if block_num != current_block_num:
                # Save previous block
                if current_block:
                    blocks.append(current_block)

                # Start new block
                current_block_num = block_num
                current_block = {
                    'block_num': block_num,
                    'text': text,
                    'bbox': [x, y, x + w, y + h],
                    'confidence': [conf],
                    'word_count': 1
                }
            else:
                # Extend current block
                current_block['text'] += ' ' + text
                current_block['bbox'][0] = min(current_block['bbox'][0], x)
                current_block['bbox'][1] = min(current_block['bbox'][1], y)
                current_block['bbox'][2] = max(current_block['bbox'][2], x + w)
                current_block['bbox'][3] = max(current_block['bbox'][3], y + h)
                current_block['confidence'].append(conf)
                current_block['word_count'] += 1

        # Don't forget last block
        if current_block:
            blocks.append(current_block)

        # Calculate average confidence per block
        for block in blocks:
            confs = block['confidence']
            block['avg_confidence'] = sum(confs) / len(confs) if confs else 0
            del block['confidence']  # Remove raw list, keep average

        return {
            'raw_text': raw_text,
            'blocks': blocks
        }

    def extract(self, pdf_path: str, pages: Optional[list[int]] = None) -> dict:
        """
        Extract text from PDF using high-precision OCR.

        Args:
            pdf_path: Path to PDF file
            pages: Optional list of 0-indexed page numbers to extract

        Returns:
            Dictionary with extraction results in faithful format
        """
        pdf_path = Path(pdf_path)

        if not pdf_path.exists():
            raise FileNotFoundError(f"PDF not found: {pdf_path}")

        print(f"Extracting from: {pdf_path}")
        print(f"OCR Settings: DPI={self.dpi}, Lang={self.lang}, Config={self.tesseract_config}")

        doc = fitz.open(str(pdf_path))
        total_pages = len(doc)

        # Determine which pages to extract
        if pages is None:
            pages_to_extract = list(range(total_pages))
        else:
            pages_to_extract = [p for p in pages if 0 <= p < total_pages]

        print(f"Total pages: {total_pages}, Extracting: {len(pages_to_extract)}")

        # Get title from metadata or filename
        title = doc.metadata.get('title', '') or pdf_path.stem

        # Extract pages
        extracted_pages = []
        total_chars = 0
        total_words = 0
        total_blocks = 0

        for i, page_num in enumerate(pages_to_extract):
            # Progress indicator
            progress = (i + 1) / len(pages_to_extract) * 100
            print(f"\r  OCR... {progress:.0f}%  ", end='', flush=True)

            page = doc[page_num]

            # Render to image
            image = self.render_page_to_image(page)

            # OCR
            ocr_result = self.ocr_page(image)

            raw_text = ocr_result['raw_text']
            normalized_text = normalize_romanian_encoding(raw_text)

            # Format blocks for output
            blocks = []
            for block in ocr_result['blocks']:
                blocks.append({
                    'text': block['text'],
                    'bbox': block['bbox'],
                    'type': 'text',
                    'confidence': round(block['avg_confidence'], 1),
                    'word_count': block['word_count']
                })

            page_chars = len(raw_text)
            page_words = len(raw_text.split())

            extracted_pages.append({
                'page_num': page_num + 1,  # 1-indexed for humans
                'raw_text': raw_text,
                'normalized_text': normalized_text,
                'char_count': page_chars,
                'word_count': page_words,
                'block_count': len(blocks),
                'blocks': blocks
            })

            total_chars += page_chars
            total_words += page_words
            total_blocks += len(blocks)

        print()  # Newline after progress

        doc.close()

        # Build output structure (same format as extract_faithful_text.py)
        result = {
            'workbook': {
                'title': title,
                'source_file': str(pdf_path.absolute()),
                'total_pages': total_pages,
                'extraction': {
                    'backend': 'tesseract_ocr',
                    'tesseract_lang': self.lang,
                    'dpi': self.dpi,
                    'timestamp': datetime.now().isoformat(),
                    'md5_hash': compute_md5(str(pdf_path))
                }
            },
            'pages': extracted_pages,
            'statistics': {
                'extracted_pages': len(extracted_pages),
                'total_characters': total_chars,
                'total_words': total_words,
                'total_blocks': total_blocks
            }
        }

        return result


def main():
    parser = argparse.ArgumentParser(
        description='High-precision OCR extraction from scanned PDF workbooks'
    )
    parser.add_argument('pdf_path', help='Path to PDF file')
    parser.add_argument('--output', '-o', help='Output JSON path (default: <pdf>.ocr_faithful.json)')
    parser.add_argument('--dpi', type=int, default=300, help='Render DPI (default: 300)')
    parser.add_argument('--lang', default='ron', help='Tesseract language (default: ron)')
    parser.add_argument('--pages', help='Page range to extract (e.g., "1-10" or "5,10,15")')

    args = parser.parse_args()

    pdf_path = Path(args.pdf_path)

    if not pdf_path.exists():
        print(f"ERROR: File not found: {pdf_path}")
        sys.exit(1)

    # Determine output path
    if args.output:
        output_path = Path(args.output)
    else:
        output_path = pdf_path.with_suffix('.ocr_faithful.json')

    # Create extractor
    extractor = HighPrecisionOCRExtractor(dpi=args.dpi, lang=args.lang)

    # Parse page range if specified
    pages = None
    if args.pages:
        doc = fitz.open(str(pdf_path))
        pages = parse_page_range(args.pages, len(doc))
        doc.close()
        print(f"Extracting pages: {[p+1 for p in pages]}")

    # Extract
    result = extractor.extract(str(pdf_path), pages=pages)

    # Save
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    # Summary
    stats = result['statistics']
    print()
    print("=" * 60)
    print("HIGH-PRECISION OCR EXTRACTION COMPLETE")
    print("=" * 60)
    print(f"Title: {result['workbook']['title']}")
    print(f"Source: {result['workbook']['source_file']}")
    print(f"DPI: {args.dpi}")
    print(f"Language: {args.lang}")
    print(f"Total Pages: {result['workbook']['total_pages']}")
    print(f"Extracted Pages: {stats['extracted_pages']}")
    print(f"Total Characters: {stats['total_characters']:,}")
    print(f"Total Words: {stats['total_words']:,}")
    print(f"Total Blocks: {stats['total_blocks']:,}")
    print(f"Output: {output_path}")
    print("=" * 60)

    # Show sample from first page
    if result['pages']:
        first_page = result['pages'][0]
        sample = first_page['raw_text'][:500].replace('\n', '\n  ')
        print(f"\nFirst page sample (raw_text):\n  {sample}...")


if __name__ == '__main__':
    main()
