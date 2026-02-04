#!/usr/bin/env python3
"""
Faithful text extraction from PDF workbooks.

This script extracts text with MAXIMUM FIDELITY - no cleaning, no modifications.
Uses PyMuPDF's get_text("rawdict") for the highest quality extraction.

Key features:
- raw_text: Byte-for-byte identical to PyMuPDF extraction (preserves soft hyphens, etc.)
- normalized_text: ONLY encoding fixes (legacy Romanian chars)
- Block-level extraction with bounding boxes
- Reading order by (y, x) coordinates
- NO doubled character removal, NO header/footer removal, NO whitespace normalization

Usage:
    python extract_faithful_text.py <pdf_path> [--output <json_path>]
    python extract_faithful_text.py <pdf_path> --pages 1-10
    python extract_faithful_text.py <pdf_path> --pages 5,10,15
"""

import sys
import io
import json
import argparse
import hashlib
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


# =============================================================================
# ENCODING NORMALIZATION (ONLY encoding fixes - NO other modifications)
# =============================================================================

ROMANIAN_ENCODING_MAP = {
    # Legacy t-cedilla variants to t-comma-below (correct Romanian)
    '\u00fe': '\u021b',  # þ → ț (LATIN SMALL LETTER THORN → LATIN SMALL LETTER T WITH COMMA BELOW)
    '\u0163': '\u021b',  # ţ → ț (LATIN SMALL LETTER T WITH CEDILLA → LATIN SMALL LETTER T WITH COMMA BELOW)
    '\u00de': '\u021a',  # Þ → Ț (LATIN CAPITAL LETTER THORN → LATIN CAPITAL LETTER T WITH COMMA BELOW)
    '\u0162': '\u021a',  # Ţ → Ț (LATIN CAPITAL LETTER T WITH CEDILLA → LATIN CAPITAL LETTER T WITH COMMA BELOW)

    # Legacy s-cedilla variants to s-comma-below (correct Romanian)
    '\u00ba': '\u0219',  # º → ș (MASCULINE ORDINAL INDICATOR → LATIN SMALL LETTER S WITH COMMA BELOW)
    '\u015f': '\u0219',  # ş → ș (LATIN SMALL LETTER S WITH CEDILLA → LATIN SMALL LETTER S WITH COMMA BELOW)
    '\u00aa': '\u0218',  # ª → Ș (FEMININE ORDINAL INDICATOR → LATIN CAPITAL LETTER S WITH COMMA BELOW)
    '\u015e': '\u0218',  # Ş → Ș (LATIN CAPITAL LETTER S WITH CEDILLA → LATIN CAPITAL LETTER S WITH COMMA BELOW)

    # Legacy a-breve (usually correct but included for completeness)
    '\u00e3': '\u0103',  # ã → ă (LATIN SMALL LETTER A WITH TILDE → LATIN SMALL LETTER A WITH BREVE)
    '\u00c3': '\u0102',  # Ã → Ă (LATIN CAPITAL LETTER A WITH TILDE → LATIN CAPITAL LETTER A WITH BREVE)
}


def normalize_romanian_encoding(text: str) -> str:
    """
    Normalize ONLY legacy Romanian character encodings to modern UTF-8.

    This function does NOT:
    - Remove doubled characters
    - Remove headers/footers
    - Normalize whitespace
    - Remove any characters

    It ONLY replaces legacy character encodings with their modern equivalents.
    """
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
    """
    Parse page specification into list of 0-indexed page numbers.

    Supports:
    - Single page: "5" -> [4]
    - Range: "1-10" -> [0,1,2,3,4,5,6,7,8,9]
    - Comma-separated: "1,5,10" -> [0,4,9]
    - Mixed: "1-3,5,7-9" -> [0,1,2,4,6,7,8]
    """
    pages = set()

    for part in page_spec.split(','):
        part = part.strip()
        if '-' in part:
            start, end = part.split('-', 1)
            start = int(start.strip())
            end = int(end.strip())
            for p in range(start, end + 1):
                if 1 <= p <= total_pages:
                    pages.add(p - 1)  # Convert to 0-indexed
        else:
            p = int(part)
            if 1 <= p <= total_pages:
                pages.add(p - 1)

    return sorted(pages)


def extract_page_faithful(page: fitz.Page, page_num: int) -> dict:
    """
    Extract text from a single page with maximum fidelity.

    Uses get_text("dict") for block-level extraction with bounding boxes.
    The "text" mode is used for raw_text to ensure byte-for-byte fidelity.
    """
    # Get dictionary for block-level extraction (dict has 'text' in spans)
    page_dict = page.get_text("dict")

    # Get plain text - this is byte-for-byte what PyMuPDF extracts
    # Note: "text" mode preserves all characters including soft hyphens
    raw_text = page.get_text("text")

    # Normalized text - ONLY encoding fixes
    normalized_text = normalize_romanian_encoding(raw_text)

    # Extract blocks with reading order
    blocks = []
    block_index = 0

    for block in page_dict.get("blocks", []):
        block_type = "image" if block.get("type") == 1 else "text"
        bbox = block.get("bbox", [0, 0, 0, 0])

        # Extract text from block (for text blocks)
        block_text = ""
        if block_type == "text":
            for line in block.get("lines", []):
                for span in line.get("spans", []):
                    block_text += span.get("text", "")
                block_text += "\n"
            block_text = block_text.rstrip("\n")

        blocks.append({
            "text": block_text,
            "bbox": list(bbox),
            "type": block_type,
            "reading_order": block_index
        })
        block_index += 1

    # Sort blocks by reading order: (y, x) - top-to-bottom, left-to-right
    # Use the top-left corner of bbox for sorting
    blocks.sort(key=lambda b: (round(b["bbox"][1] / 10) * 10, b["bbox"][0]))

    # Update reading order after sorting
    for i, block in enumerate(blocks):
        block["reading_order"] = i

    return {
        "page_num": page_num + 1,  # 1-indexed for output
        "raw_text": raw_text,
        "normalized_text": normalized_text,
        "char_count": len(raw_text),
        "word_count": len(raw_text.split()),
        "blocks": blocks
    }


def extract_workbook_faithful(
    pdf_path: str,
    pages: Optional[list[int]] = None
) -> dict:
    """
    Extract text from PDF workbook with maximum fidelity.

    Args:
        pdf_path: Path to the PDF file
        pages: Optional list of 0-indexed page numbers to extract (None = all)

    Returns:
        Extraction result as dictionary matching the output schema
    """
    pdf_path = Path(pdf_path)

    # Open document
    doc = fitz.open(str(pdf_path))
    total_pages = len(doc)

    # Determine which pages to extract
    if pages is None:
        pages_to_extract = list(range(total_pages))
    else:
        pages_to_extract = [p for p in pages if 0 <= p < total_pages]

    # Extract title from metadata or filename
    title = doc.metadata.get("title", "") or pdf_path.stem

    # Compute file hash
    md5_hash = compute_md5(str(pdf_path))

    # Extract pages
    extracted_pages = []
    for page_num in pages_to_extract:
        page = doc[page_num]
        page_data = extract_page_faithful(page, page_num)
        extracted_pages.append(page_data)

        # Progress indicator
        if len(pages_to_extract) > 10:
            progress = (pages_to_extract.index(page_num) + 1) / len(pages_to_extract) * 100
            print(f"\r  Extracting... {progress:.0f}%", end="", flush=True)

    if len(pages_to_extract) > 10:
        print()  # Newline after progress

    doc.close()

    # Build result
    result = {
        "workbook": {
            "title": title,
            "source_file": str(pdf_path.absolute()),
            "total_pages": total_pages,
            "extraction": {
                "backend": "pymupdf",
                "timestamp": datetime.now().isoformat(),
                "md5_hash": md5_hash
            }
        },
        "pages": extracted_pages
    }

    return result


def main():
    parser = argparse.ArgumentParser(
        description='Faithful text extraction from PDF workbooks',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
This script extracts text with MAXIMUM FIDELITY:
- raw_text: Exact extraction, no modifications (preserves soft hyphens, etc.)
- normalized_text: Only legacy Romanian encoding fixes

NO CLEANING is applied:
- No doubled character removal
- No header/footer removal
- No whitespace normalization
- No text alteration of any kind

Examples:
  %(prog)s manual.pdf                      # Extract all pages
  %(prog)s manual.pdf --output out.json    # Specify output file
  %(prog)s manual.pdf --pages 1-10         # Extract pages 1-10
  %(prog)s manual.pdf --pages 1,5,10       # Extract specific pages
"""
    )
    parser.add_argument('pdf_path', help='Path to PDF workbook')
    parser.add_argument('--output', '-o', help='Output JSON path (default: <pdf_name>.faithful.json)')
    parser.add_argument('--pages', '-p', help='Page range to extract (e.g., "1-10", "1,5,10", "1-3,7-9")')

    args = parser.parse_args()

    # Validate input
    pdf_path = Path(args.pdf_path)
    if not pdf_path.exists():
        print(f"ERROR: File not found: {pdf_path}")
        return 1

    # Parse page range if specified
    pages = None
    if args.pages:
        # Need to open doc first to get total pages for validation
        doc = fitz.open(str(pdf_path))
        total_pages = len(doc)
        doc.close()

        try:
            pages = parse_page_range(args.pages, total_pages)
            if not pages:
                print(f"ERROR: No valid pages in range '{args.pages}' (document has {total_pages} pages)")
                return 1
        except ValueError as e:
            print(f"ERROR: Invalid page specification '{args.pages}': {e}")
            return 1

    # Determine output path
    if args.output:
        output_path = Path(args.output)
    else:
        output_path = pdf_path.with_suffix('.faithful.json')

    print(f"Extracting from: {pdf_path}")
    print(f"Backend: PyMuPDF (get_text dict)")
    if pages:
        print(f"Pages: {len(pages)} selected")

    # Extract
    result = extract_workbook_faithful(str(pdf_path), pages)

    # Save
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    # Summary
    total_chars = sum(p['char_count'] for p in result['pages'])
    total_words = sum(p['word_count'] for p in result['pages'])
    total_blocks = sum(len(p['blocks']) for p in result['pages'])

    print(f"\n{'='*60}")
    print(f"FAITHFUL EXTRACTION COMPLETE")
    print(f"{'='*60}")
    print(f"Title: {result['workbook']['title']}")
    print(f"Source: {result['workbook']['source_file']}")
    print(f"Total Pages: {result['workbook']['total_pages']}")
    print(f"Extracted Pages: {len(result['pages'])}")
    print(f"Total Characters: {total_chars:,}")
    print(f"Total Words: {total_words:,}")
    print(f"Total Blocks: {total_blocks:,}")
    print(f"MD5 Hash: {result['workbook']['extraction']['md5_hash']}")
    print(f"Output: {output_path}")
    print(f"{'='*60}")

    # Show sample of first page raw_text for verification
    if result['pages']:
        first_page = result['pages'][0]
        sample = first_page['raw_text'][:200].replace('\n', '\\n')
        print(f"\nFirst page sample (raw_text):")
        print(f"  {sample}...")

        # Check for soft hyphens
        soft_hyphen_count = first_page['raw_text'].count('\xad')
        if soft_hyphen_count:
            print(f"\n  Soft hyphens (\\xad) preserved: {soft_hyphen_count}")

    return 0


if __name__ == '__main__':
    sys.exit(main())
