"""Copiaza citatele EXACTE (randuri intregi) din textul brut al paginilor Microsoft (surse/raw/*.txt) in surse/sNN_*.txt,
fiecare cu adresa paginii. Nicio fraza nu e scrisa de mana: se cauta un fragment si se copiaza randul gasit.
Adaptat din lectia4-liste/surse_extrage.py."""
from pathlib import Path

L = Path(__file__).resolve().parent
R = L / "surse" / "raw"
CITATE = {
    "s01_backspace_delete_tabel": [
        ("delete_table_en-us", "click the table move handle and press the Backspace key"),
        ("delete_table_ro-ro", "apăsați tasta Backspace"),
        ("delete_table_en-us", "then press the Delete key. The rows and columns remain"),
        ("delete_table_ro-ro", "Rândurile și coloanele rămân"),
        ("delete_rowcol_en-us", "select the row or column and then press the Delete key"),
        ("delete_rowcol_ro-ro", "selectați rândul sau coloana, apoi apăsați tasta Delete"),
        ("add_delete_rows_en-us", "click Delete Table or press Delete on your keyboard"),
    ],
    "s02_ctrl_a": [
        ("shortcuts_en-us", "Select all document content."),
        ("shortcuts_ro-ro", "Selectați tot conținutul documentului."),
        ("shortcuts_en-us", "Select the whole table."),
        ("shortcuts_en-us", "Alt+5 on the numeric keypad"),
        ("shortcuts_ro-ro", "Alt+5 pe tastatura numerică"),
        ("excel_shortcuts_en-us", "Select the current region if the worksheet contains data. Press a second time"),
    ],
    "s03_tab_ultima_celula": [
        ("add_delete_rows_en-us", "To add a row at the end of a table, click the rightmost cell of the last row, and then press Tab."),
        ("shortcuts_en-us", "Move to the next cell in the row and select its content."),
        ("shortcuts_ro-ro", "Treceți la celula următoare a liniei și selectați conținutul său."),
        ("shortcuts_en-us", "Insert a tab character in a cell."),
        ("shortcuts_ro-ro", "Inserați un caracter tabulator într-o celulă."),
    ],
    "s04_nume_ro_file_tabel": [
        ("add_delete_rows_ro-ro", "Pe fila Aspect tabel , în grupul Rânduri & Coloane"),
        ("add_delete_rows_ro-ro", "Ștergere coloane sau Ștergere rânduri"),
        ("add_delete_rows_ro-ro", "nu o filă Proiectare tabel"),
        ("add_delete_rows_en-us", "On the Table Layout tab, in the Rows & Columns group"),
        ("resize_table_ro-ro", "selectați Potrivire automată , apoi Potrivire automată la conținut."),
        ("resize_table_ro-ro", "Potrivire automată fereastră"),
        ("convert_text_ro-ro", "Inserare > tabel > Conversie text în tabel"),
        ("convert_text_ro-ro", "Pe fila Aspect , în secțiunea Date"),
        ("table_props_ro-ro", "alegeți Proprietăți tabel ."),
        ("table_props_ro-ro", "Borduri și umbrire"),
    ],
    "s05_alt_rigla_selectie": [
        ("resize_table_ro-ro", "țineți apăsată tasta ALT în timp ce glisați marcajul"),
        ("resize_table_ro-ro", "Faceți clic pe marginea celulei."),
        ("resize_table_ro-ro", "Faceți clic pe linia de grilă sau pe bordura de deasupra coloanei."),
    ],
    "s06_ctrl_alt_v": [
        ("shortcuts_en-us", "Paste the selected text formatting."),
        ("shortcuts_ro-ro", "Ctrl+Alt+V"),
    ],
    "s07_autofit_fereastra_vs_distribuire": [
        ("convert_text_ro-ro", "Redimensionați automat tabelul în cazul în care lățimea spațiului disponibil se modifică"),
        ("resize_table_ro-ro", "Distribuiți coloanele sau Distribuire rânduri"),
        ("resize_table_en-us", "Distribute Columns"),
    ],
}
for nume, lst in CITATE.items():
    out = []
    for src, frag in lst:
        lines = (R / f"{src}.txt").read_text(encoding="utf-8").splitlines()
        adr = lines[0]
        hits = [i for i, x in enumerate(lines[1:], 1) if frag in x]
        if hits:
            i = hits[0]
            ctx = lines[i] if nume != "s06_ctrl_alt_v" else " | ".join(lines[i - 1:i + 1])
            out.append(f"{adr}  (r.{i + 1})\n  [{src}] {ctx}")
        else:
            out.append(f"{adr}\n  [{src}] NEGASIT: {frag!r}")
    (L / "surse" / f"{nume}.txt").write_text("\n".join(out) + "\n", encoding="utf-8")
    print(nume, sum("NEGASIT" in o for o in out), "negasite")
