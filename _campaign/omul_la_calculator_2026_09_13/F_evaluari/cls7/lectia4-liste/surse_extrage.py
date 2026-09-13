"""Copiaza citatele EXACTE (randuri intregi) din textul brut al paginilor Microsoft (surse/raw/*.txt) in surse/sNN_*.txt,
fiecare cu adresa paginii. Nicio fraza nu e scrisa de mana: se cauta un fragment si se copiaza randul gasit."""
from pathlib import Path

L = Path(__file__).resolve().parent
R = L / "surse" / "raw"
CITATE = {
    "s01_marcatori_numerotare": [("create_list_ro-ro", "Pornire >, Numerotare"), ("create_list_ro-ro", "tastați 1, un punct"),
                                 ("create_list_ro-ro", "Tastați * și un spațiu"), ("create_list_en-us", "Applies To")],
    "s02_definire_format": [("define_new_ro-ro", "Definire format nou de numerotare"), ("define_new_ro-ro", "Definire marcator nou ."),
                            ("define_new_en-us", "select Define New Number Format"), ("define_new_ro-ro", "Faceți clic pe Imagine")],
    "s03_selectare_marcator_ctrl_a": [("color_size_en-us", "select any bullet or number to select all"),
                                      ("color_size_ro-ro", "selectați orice marcator sau număr pentru a selecta toți"),
                                      ("color_size_en-us", "you select all of the list items that are at that particular level"),
                                      ("shortcuts_en-us", "Select all document content."), ("shortcuts_ro-ro", "Selectați tot conținutul documentului.")],
    "s04_numerotare_repornire": [("change_numbering_ro-ro", "Repornire de la 1"), ("change_numbering_ro-ro", "Setați valoarea de numerotare"),
                                 ("change_numbering_en-us", "Restart at 1"), ("change_numbering_en-us", "Set Numbering Value")],
    "s05_sortare": [("sort_list_ro-ro", "cu un singur nivel"), ("sort_list_ro-ro", "Pe fila Pornire , faceți clic pe Sortare"),
                    ("sort_list_en-us", "one-level")],
    "s06_autoformatare": [("auto_bullets_en-us", "if you type an asterisk or 1."), ("auto_bullets_ro-ro", "dacă tastați asterisc sau 1."),
                          ("auto_bullets_ro-ro", "Liste automat cu marcatori"), ("define_new_ro-ro", "Selectați fila AutoFormatare la tastare")],
    "s07_nivel_lista": [("color_size_en-us", "Point to Change List Level"), ("color_size_en-us", "change the formatting one level at a time")],
}
for nume, lst in CITATE.items():
    out = []
    for src, frag in lst:
        lines = (R / f"{src}.txt").read_text(encoding="utf-8").splitlines()
        adr = lines[0]
        hit = next((x for x in lines[1:] if frag in x), None)
        out.append(f"{adr}\n  [{src}] " + (hit if hit else f"NEGASIT: {frag!r}"))
    (L / "surse" / f"{nume}.txt").write_text("\n".join(out) + "\n", encoding="utf-8")
    print(nume, sum("NEGASIT" in o for o in out), "negasite")
