#!/usr/bin/env python3
"""
Improved extraction functions for PDF workbook extraction.
These functions can be copied into extract_pdf_workbook.py
"""

import sys
import io

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

import re


# =============================================================================
# IMPROVED SECTION MARKERS
# =============================================================================

IMPROVED_SECTION_MARKERS = {
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


# =============================================================================
# CONTENT CLEANING FUNCTION
# =============================================================================

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

    original_text = text

    # 1. Remove CID font references (if any remaining)
    text = re.sub(r'\(cid:\d+\)', '', text)

    # 2. Fix doubled characters (e.g., "UUttiilliizzaarreeaa" → "Utilizarea")
    # This is common in some pdfplumber extractions
    # Pattern: repeated pairs of characters
    def undouble(match):
        pairs = match.group(0)
        # Extract unique characters
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
    # Pattern: "Page X" or "Pagina X" or just numbers at start/end of lines
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

        # Skip repeated header text (usually appears on every page)
        # TODO: This could be smarter by detecting repeated lines

        cleaned_lines.append(line)

    text = '\n'.join(cleaned_lines)

    # 4. Join hyphenated words across lines
    # Pattern: "word-\n" → "word"
    text = re.sub(r'(\w+)-\s*\n\s*(\w+)', r'\1\2', text)

    # 5. Normalize whitespace
    # Replace multiple spaces with single space
    text = re.sub(r' {2,}', ' ', text)

    # Replace multiple newlines with max 2 newlines
    text = re.sub(r'\n{3,}', '\n\n', text)

    # Remove trailing/leading whitespace from each line
    lines = [line.rstrip() for line in text.split('\n')]
    text = '\n'.join(lines)

    # Final trim
    text = text.strip()

    return text


# =============================================================================
# IMPROVED EXERCISE EXTRACTION
# =============================================================================

def extract_exercise_items_improved(content: str) -> list:
    """
    Extract numbered exercise items from content with improved handling.

    Improvements:
    - Better multi-line item support
    - Nested sub-items (a, b, c under 1, 2, 3)
    - Better cleanup of extracted text

    Args:
        content: Raw content from exercise section

    Returns:
        List of item dicts with 'number', 'text', 'type', 'subitems'
    """
    items = []

    # Clean content first
    content = clean_extracted_content(content)

    # Pattern 1: Numbered items with potential sub-items
    # Matches: "1. Task description" potentially followed by "a) sub" "b) sub"
    numbered_pattern = r'(\d+)\.\s+(.+?)(?=(?:\n\s*\d+\.)|$)'
    numbered_matches = re.finditer(numbered_pattern, content, re.DOTALL)

    for match in numbered_matches:
        num = int(match.group(1))
        item_text = match.group(2).strip()

        # Check for sub-items (a), b), c) within this item
        sub_items = []
        sub_pattern = r'([a-z])\)\s+(.+?)(?=(?:\n\s*[a-z]\))|$)'
        sub_matches = re.finditer(sub_pattern, item_text, re.DOTALL)

        # Extract sub-items if found
        sub_items_found = []
        for sub_match in sub_matches:
            letter = sub_match.group(1)
            sub_text = sub_match.group(2).strip()
            sub_items_found.append({
                'letter': letter,
                'text': sub_text[:200]
            })

        # If sub-items were found, remove them from main text
        if sub_items_found:
            # Keep only the text before first sub-item
            first_sub = re.search(r'[a-z]\)', item_text)
            if first_sub:
                item_text = item_text[:first_sub.start()].strip()

        items.append({
            'number': num,
            'text': item_text[:300],
            'type': 'task',
            'subitems': sub_items_found
        })

    # Pattern 2: If no numbered items, try lettered items (a, b, c)
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


# =============================================================================
# IMPROVED TERM EXTRACTION
# =============================================================================

def extract_terms_improved(content: str) -> list:
    """
    Extract key terms from recap/definition sections.

    Improvements:
    - Handle bold terms (often in **term** or enclosed format)
    - Handle numbered definitions
    - Better cleanup of definitions
    - Multiple definition formats

    Args:
        content: Raw content from terms/definitions section

    Returns:
        List of term dicts with 'term' and 'definition'
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
        # Lines starting with capitalized words followed by text
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


# =============================================================================
# TEST/DEMO
# =============================================================================

if __name__ == '__main__':
    # Test cleaning function
    test_text = """
    UUttiilliizzaarreeaa ccaallccuullaattoorruulluuii

    Pagina 25

    Acesta este un text cu (cid:123)(cid:456) caractere problematice.

    O propozi-
    tie separată pe două rânduri.



    Prea multe linii goale.

    25
    """

    print("CLEANING TEST:")
    print("="*70)
    print("BEFORE:")
    print(test_text)
    print("\nAFTER:")
    print(clean_extracted_content(test_text))

    # Test exercise extraction
    test_exercises = """
    1. Rezolvați următoarea problemă de programare.
       a) Scrieți algoritmul
       b) Implementați în Scratch
       c) Testați cu date de intrare

    2. Analizați programul dat și stabiliți rezultatul.

    3. Creați un proiect nou.
    """

    print("\n\nEXERCISE EXTRACTION TEST:")
    print("="*70)
    items = extract_exercise_items_improved(test_exercises)
    for item in items:
        print(f"\n{item['number']}. {item['text']}")
        if item['subitems']:
            for sub in item['subitems']:
                print(f"   {sub['letter']}) {sub['text']}")

    # Test term extraction
    test_terms = """
    Algoritm – Secvență finită de pași necesari pentru rezolvarea unei probleme.

    Program – Implementarea unui algoritm într-un limbaj de programare.

    Variabilă – Locație de memorie cu un nume și o valoare care poate fi modificată.
    """

    print("\n\nTERM EXTRACTION TEST:")
    print("="*70)
    terms = extract_terms_improved(test_terms)
    for term in terms:
        print(f"\n{term['term']}")
        print(f"  → {term['definition']}")
