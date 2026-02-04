#!/usr/bin/env python3
"""Inspect a specific page from PDF to understand structure."""
import sys
import io

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

import pdfplumber

def inspect_page(pdf_path, page_num):
    print(f"\n{'='*70}")
    print(f"Inspecting page {page_num} of {pdf_path}")
    print(f"{'='*70}\n")

    with pdfplumber.open(pdf_path) as pdf:
        if page_num > len(pdf.pages):
            print(f"ERROR: Page {page_num} doesn't exist (PDF has {len(pdf.pages)} pages)")
            return

        page = pdf.pages[page_num - 1]
        text = page.extract_text() or ""

        print(f"Page text ({len(text)} chars):")
        print(text[:2000])
        print("\n...")

        # Try PyMuPDF for comparison
        try:
            import fitz
            doc = fitz.open(pdf_path)
            page_fitz = doc[page_num - 1]
            text_fitz = page_fitz.get_text()

            print(f"\n\n{'='*70}")
            print(f"PyMuPDF extraction (for comparison):")
            print(f"{'='*70}\n")
            print(text_fitz[:2000])
            print("\n...")

        except ImportError:
            print("\n(PyMuPDF not available for comparison)")

if __name__ == '__main__':
    # Inspect page 12 of grade 8 (first lesson)
    inspect_page('C:/AI/Projects/Scoala/2025-2026/VictorBrauner/Manuale/cls_08/A1969.pdf', 12)

    # Inspect page 7 of grade 5 (first content page)
    inspect_page('C:/AI/Projects/Scoala/2025-2026/VictorBrauner/Manuale/cls_05/A1230.pdf', 7)
