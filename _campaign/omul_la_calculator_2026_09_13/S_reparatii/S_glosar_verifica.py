# -*- coding: utf-8 -*-
"""
S_glosar_verifica.py — re-verifica mecanic GLOSAR_UI.md.

Pentru fiecare tabel care are o coloana "Fragment" (adica orice tabel CONFIRMAT:
Word / Excel / PowerPoint / Windows / Office, "Scurtaturi confirmate" si
"Excel - fapte confirmate"), scriptul:
  1. gaseste coloana cu calea sursa (continut intre backtick-uri, incepe cu "F_evaluari/")
  2. gaseste coloana "Fragment" (citatul exact)
  3. deschide fisierul sursa (relativ la radacina campaniei = parintele acestui folder)
  4. verifica ca fragmentul apare LITERAL (substring, nu regex) in fisier

Tabelul "NECONFIRMAT / VARIANTE" nu are coloana "Fragment" -> e sarit intentionat,
nu e verificat mecanic (e cules manual, cu nota "neconfirmat").

Exit 0 = toate randurile confirmate chiar apar in sursele citate.
Exit 1 = cel putin un rand nu se mai potriveste (fisier lipsa sau fragment schimbat).
"""
import os
import re
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CAMPAIGN_ROOT = os.path.dirname(SCRIPT_DIR)
GLOSAR_PATH = os.path.join(SCRIPT_DIR, "GLOSAR_UI.md")

CELL_SPLIT_RE = re.compile(r"(?<!\\)\|")
SOURCE_CELL_RE = re.compile(r"`([^`]+)`")


def unescape_cell(cell: str) -> str:
    return cell.strip().replace("\\|", "|")


def split_row(line: str):
    """Split a markdown table row into cells, respecting \\| as an escaped pipe."""
    parts = CELL_SPLIT_RE.split(line.strip())
    # a well-formed row starts and ends with "|", so the first/last split are empty
    if parts and parts[0].strip() == "":
        parts = parts[1:]
    if parts and parts[-1].strip() == "":
        parts = parts[:-1]
    return [unescape_cell(p) for p in parts]


def is_divider_row(cells) -> bool:
    return all(re.fullmatch(r":?-{2,}:?", c.strip()) for c in cells if c.strip() != "") and len(cells) > 0


def find_tables(lines):
    """Yield (header_cells, [data_row_cells, ...]) for every pipe-table in the file."""
    i = 0
    n = len(lines)
    while i < n:
        line = lines[i]
        if line.strip().startswith("|") and i + 1 < n:
            header_cells = split_row(line)
            next_cells = split_row(lines[i + 1]) if lines[i + 1].strip().startswith("|") else []
            if next_cells and is_divider_row(next_cells):
                data_rows = []
                j = i + 2
                while j < n and lines[j].strip().startswith("|"):
                    data_rows.append(split_row(lines[j]))
                    j += 1
                yield header_cells, data_rows
                i = j
                continue
        i += 1


def main():
    if not os.path.isfile(GLOSAR_PATH):
        print(f"LIPSA: {GLOSAR_PATH}")
        return 1

    with open(GLOSAR_PATH, "r", encoding="utf-8") as fh:
        content = fh.read()
    lines = content.split("\n")

    total_checked = 0
    failures = []
    tables_checked = 0
    file_cache = {}

    for header_cells, data_rows in find_tables(lines):
        if not any("Fragment" in h for h in header_cells):
            continue  # tabelul NECONFIRMAT / VARIANTE (sau alt tabel fara citat) - sarit intentionat
        try:
            src_idx = next(k for k, h in enumerate(header_cells) if "Surs" in h)
            frag_idx = next(k for k, h in enumerate(header_cells) if "Fragment" in h)
        except StopIteration:
            continue
        tables_checked += 1
        for row in data_rows:
            if len(row) <= max(src_idx, frag_idx):
                failures.append(("?", "?", f"rand malformat: {row}"))
                continue
            src_cell = row[src_idx]
            frag = row[frag_idx]
            m = SOURCE_CELL_RE.search(src_cell)
            src_rel = m.group(1) if m else src_cell.strip()
            total_checked += 1
            label = row[0] if row else "?"

            if not frag.strip():
                failures.append((src_rel, label, "fragment gol"))
                continue

            abs_path = os.path.normpath(os.path.join(CAMPAIGN_ROOT, src_rel.replace("/", os.sep)))
            if abs_path not in file_cache:
                if not os.path.isfile(abs_path):
                    file_cache[abs_path] = None
                else:
                    with open(abs_path, "r", encoding="utf-8", errors="replace") as sf:
                        file_cache[abs_path] = sf.read()
            file_content = file_cache[abs_path]

            if file_content is None:
                failures.append((src_rel, label, f"FISIER LIPSA: {abs_path}"))
                continue
            if frag not in file_content:
                failures.append((src_rel, label, "FRAGMENT NEGASIT in fisierul sursa"))

    print(f"Tabele verificate (cu coloana Fragment): {tables_checked}")
    print(f"Randuri verificate: {total_checked}")
    print(f"Esecuri: {len(failures)}")
    for src, label, why in failures:
        print(f"  - [{label}] {why}  <- {src}")

    if failures:
        print("REZULTAT: FAIL — repara randurile de mai sus in GLOSAR_UI.md inainte de folosire.")
        return 1

    print("REZULTAT: OK — toate randurile confirmate chiar apar, literal, in sursele citate.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
