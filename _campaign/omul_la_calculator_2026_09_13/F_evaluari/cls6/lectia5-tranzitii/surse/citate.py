"""Scrie surse/s_<nume>.txt: URL + citatul EXACT copiat din textul brut (raw/<pagina>.txt, scos din HTML descarcat cu curl, 13.09.2026).
Daca fraza nu e gasita -> EROARE (nu scrie). (Tiparul: lectia4-animatii/surse/citate.py.)"""
from pathlib import Path

D = Path(__file__).resolve().parent
RAW = D / "raw"

CERERI = {
    "s_fila_tranzitii": [("tranzitii_ro", "Selectați fila Tranziții și alegeți o tranziție"),
                         ("tranzitii_en", "Select the Transitions tab and choose a transition"),
                         ("scurtaturi_ro", "Deschideți fila Tranziții și adăugați tranziții între diapozitive")],
    "s_se_aplica_tuturor": [("tranzitii_ro", "Selectați Se aplică tuturor pentru a adăuga tranziția la întreaga prezentare"),
                            ("tranzitii_ro", "faceți clic pe Se aplică pentru toate în panglică"),
                            ("tranzitii_en", "Select Apply To All to add the transition to the entire presentation")],
    "s_optiuni_efect": [("tranzitii_ro", "Selectați Opțiuni efect pentru a alege direcția și natura tranziției"),
                        ("tranzitii_en", "Select Effect Options to choose the direction and nature of the transition")],
    "s_de_la_dreapta": [("timp_ro", "este selectată opțiunea De la dreapta"),
                        ("timp_en", "a Gallery transition is applied to the slide and the From Right option is selected")],
    "s_durata": [("timp_ro", "în caseta Durată , tastați numărul de secunde dorit"),
                 ("timp_en", "in the Duration box, type the number of seconds that you want")],
    "s_la_clic_dupa": [("timp_ro", "sub Avansare diapozitiv, alegeți una dintre următoarele variante"),
                       ("timp_ro", "bifați caseta de selectare La clic de mouse"),
                       ("timp_ro", "bifați caseta de selectare După și introduceți numărul de minute sau secunde dorit"),
                       ("timp_en", "under Advance Slide , do one of the following"),
                       ("timp_en", "select the On Mouse Click check box"),
                       ("timp_en", "select the After check box, and then enter the number of minutes or seconds that you want")],
    "s_ambele_bifate": [("timp_en", "The slide will advance automatically, but you can advance it more quickly by clicking the mouse"),
                        ("timp_ro", "Diapozitivul va avansa automat, dar îl puteți avansa mai rapid făcând clic cu mouse-ul")],
    "s_timer_dupa_animatie": [("timp_en", "The timer starts when the final animation or other effect on the slide finishes"),
                              ("timp_ro", "Cronometrul pornește atunci când se termină animația finală sau alt efect din diapozitiv")],
    "s_sunet": [("timp_ro", "în lista Sunet , selectați sunetul dorit"),
                ("timp_ro", "în lista Sunet , selectați Alt sunet"),
                ("timp_en", "in the Sound list, select Other Sound")],
    "s_o_tranzitie": [("tranzitii_en", "Only one transition effect can be applied to a slide at a time"),
                      ("tranzitii_ro", "Un singur efect de tranziție poate fi aplicat la un diapozitiv odată"),
                      ("diferenta_ro", "O tranziție este aplicată la întregul diapozitiv. Un singur efect de tranziție poate fi aplicat unui diapozitiv.")],
    "s_categorii": [("tranzitii_en", "grouped into Subtle , Exciting , and Dynamic categories"),
                    ("tranzitii_ro", "grupate în categoriile Subtil , Interesant și Dinamic")],
    "s_dynamic_content": [("mvp2010_en", "There are seven options for Dynamic Content; Pan, Ferris Wheel, Conveyor, Rotate, Window, Orbit and Fly Through"),
                          ("indezine_dinamic2013", "all seven Dynamic Transition effects: Pan , Ferris Wheel , Conveyor , Rotate , Window , Orbit , and Fly Through"),
                          ("mspptx_en", "vortex (section 2.3.1.30 )")],
    "s_morph": [("tranzitii_ro", "Utilizați tranziția Metamorfoză în PowerPoint (numai în Microsoft 365 sau PowerPoint 2019/2021)"),
                ("tranzitii_en", "Use the Morph transition in PowerPoint (only in Microsoft 365 or PowerPoint 2019/2021)"),
                ("morph_ro", "Tranziția Morph vă permite să animați o mișcare lină"),
                ("morph_ro", "Pe fila Tranziții , faceți clic pe Metamorfoză")],
    "s_estompare": [("tranzitii_ro", "aplicând o tranziție Estompare la diapozitivul 3"),
                    ("tranzitii_en", "applying a Fade transition to slide 3")],
    "s_previzualizare": [("tranzitii_ro", "Selectați Previzualizare pentru a vedea cum arată tranziția"),
                         ("tranzitii_en", "Select Preview to see what the transition looks like")],
    "s_pictograma": [("tranzitii_ro", "căutând pictograma de tranziție în panoul de miniaturi"),
                     ("tranzitii_en", "looking for the transition icon in the Thumbnail pane")],
    "s_taste_livrare": [("livrare_en", "Start a presentation from the beginning. F5 Start a presentation from the current slide. Shift+F5"),
                        ("livrare_en", "Display a blank black slide, or return to the presentation from a blank black slide. B"),
                        ("livrare_en", "Display a blank white slide"),
                        ("livrare_ro", "Porniți o prezentare de la început. F5 Porniți o prezentare de la diapozitivul curent. Shift+F5"),
                        ("livrare_ro", "Afișați un diapozitiv negru necompletat")],
    "s_bucla": [("autorulare_en", "On the Slide Show tab, select Set Up Slide Show"),
                ("autorulare_en", "Loop continuously until 'Esc'"),
                ("autorulare_ro", "Pe fila Expunere diapozitive , selectați Configurare expunere diapozitive"),
                ("autorulare_ro", "Loop continuu până la 'Esc'")],
}

for nume, lista in CERERI.items():
    buc = []
    for pag, fraza in lista:
        t = (RAW / f"{pag}.txt").read_text(encoding="utf-8")
        url = t.splitlines()[0]
        if fraza not in t:
            raise SystemExit(f"EROARE: '{fraza}' nu e in {pag}")
        i = t.find(fraza)
        buc.append(f"Sursa: {url}\nDescarcat: curl -sL -A Mozilla/5.0, 13.09.2026 -> surse/raw/{pag}.html (text brut: raw/{pag}.txt)\n"
                   f"Citat exact: \"{t[max(0, i - 60):i + len(fraza) + 60]}\"\n")
    (D / f"{nume}.txt").write_text("\n".join(buc), encoding="utf-8")
    print("scris", nume, len(buc))
