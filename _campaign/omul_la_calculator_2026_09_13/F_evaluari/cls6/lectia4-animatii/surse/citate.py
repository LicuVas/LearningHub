"""Scrie surse/s_<nume>.txt: URL + citatul EXACT copiat din textul brut (raw/<pagina>.txt, scos din HTML descarcat cu curl).
Daca fraza nu e gasita -> EROARE (nu scrie). (Tiparul: lectia3-text-imagini/surse/citate.py.)"""
from pathlib import Path

D = Path(__file__).resolve().parent
RAW = D / "raw"

CERERI = {
    "s_fila_animatii": [("scurtaturi_ro", "Deschideți fila Tranziții și adăugați tranziții între diapozitive. Alt+K Deschideți fila Animații și adăugați animații la diapozitive. Alt+A Deschideți fila Expunere diapozitive"),
                        ("scurtaturi_en", "Open the Transitions tab and add transitions between slides. Alt+K Open the Animations tab and add animations to slides. Alt+A Open the Slide Show tab"),
                        ("animare_ro", "Selectați obiectul sau textul pe care doriți să îl animați. Selectați fila Animații , apoi alegeți un efect de animație.")],
    "s_f5": [("scurtaturi_ro", "Pornirea expunerii de diapozitive. F5"),
             ("scurtaturi_en", "Start the slide show. F5")],
    "s_culori_categorii": [("baza_ro", "pictogramele efecte de intrare sunt colorate în verde, pictogramele efecte de evidențiere sunt colorate în galben, iar pictogramele efecte de ieșire sunt colorate în roșu"),
                           ("baza_en", "entrance effects icons are colored green, emphasis effects icons are colored yellow, and exit effects icons are colored red")],
    "s_estompare_iesire": [("efecte_ro", "Dispariție ieșire Textul sau obiectul dispare rapid Estompare ieșire Textul sau obiectul se estompează din vizualizare"),
                           ("efecte_ro", "Ștergere ieșire Textul sau obiectul este șters dintr-o direcție"),
                           ("efecte_ro", "Mărire ieșire Textul sau obiectul se micșorează în depărtare"),
                           ("efecte_en", "Disappear exit Text or object disappears rapidly Fade exit Text or object fades from view Fly Out exit"),
                           ("efecte_en", "Wipe exit Text or object is wiped away from a specified direction"),
                           ("efecte_en", "Zoom exit Text or object zooms into the distance and disappears"),
                           ("efecte_en", "Many of the animation effects available in the PowerPoint desktop application are also available in PowerPoint for the web")],
    "s_estompare_intrare": [("efecte_ro", "Estompare intrare Textul sau obiectul se afișează gradual Zbor înauntru intrare"),
                            ("efecte_en", "Fade In entrance Text or object gradually comes into view Fly In entrance"),
                            ("multiple_ro", "PowerPoint îi atribuie automat un efect implicit, cum ar fi Atenuare"),
                            ("multiple_en", "PowerPoint automatically assigns it a default effect, such as Fade")],
    "s_start": [("animare_ro", "La clic : Efectul de animație începe atunci când faceți clic pe diapozitiv. Cu anterioară: Efectul de animație se redă în același timp cu animația anterioară din secvența dvs. După precedentul"),
                ("animare_ro", "Cu precedentul : Redați o animație simultan cu animația anterioară"),
                ("animare_en", "On Click : The animation effect begins when you click the slide. With Previous : The animation effect plays at the same time as the previous animation in your sequence. After Previous")],
    "s_durata_intarziere": [("timp_ro", "Selectați fila Animații și, în caseta Întârziere , introduceți numărul de secunde"),
                            ("timp_ro", "dacă un efect este setat la Pornire după anteriorul cu o întârziere de 1,5 secunde, întârzierea de 1,5 secunde începe când se termină efectul ant"),
                            ("timp_en", "if an effect is set to start After Previous with a delay of 1.5 seconds, its delay of 1.5 seconds begins when the previous effect ends")],
    "s_panou_animatii": [("modifica_ro", "selectați Panou animație de pe fila Animații"),
                         ("modifica_ro", "În partea de sus a panoului, selectați ta"),
                         ("modifica_en", "At the top of the pane, select the arrow key"),
                         ("baza_ro", "Pe fila Animații , selectați Panou de animație în grupul Animație avansată"),
                         ("animare_ro", "Panoul Animații din partea dreaptă afișează toate animațiile din diapozitiv"),
                         ("animare_ro", "Mutare mai devreme : Faceți ca o animație să apară mai repede într-o secvență. Mutare mai târziu")],
    "s_dupa_paragraf": [("rand_ro", "Selectați Opțiuni efect , apoi selectați După paragraf pentru ca paragrafele de text să apară pe rând. (Cealaltă opțiune, Toate odată"),
                        ("rand_en", "Select Effect Options , and then select By Paragraph to make the paragraphs of text appear one at a time. (The other option, All at Once"),
                        ("rand_en", "on the Effect tab under Enhancements , select the arrow next to Animate text , and select By letter"),
                        ("rand_ro", "pe fila Efect , sub Îmbunătățiri , selectați săgeata de lângă Animare text și selectați După literă")],
    "s_zbor_directie": [("rand_ro", "Pentru unele animații, cum ar fi Zbor spre interior , selectați Opțiuni efecte , deoarece va trebui să alegeți o direcție"),
                        ("rand_en", "you'll need to pick a direction for the bullets to fly in from, such as bottom, top, left, or right")],
    "s_cale_particularizata": [("traseu_ro", "Defilați în jos la Căi de mișcare și alegeți una. Sfat: Dacă alegeți opțiunea Cale particularizată , veți desena calea"),
                               ("traseu_ro", "Dacă ați selectat o cale Desenare curbă sau Desenare formă liberă . Selectați punctul de plecare, apoi faceți clic de fiecare dată când doriți să începeți o schimbare de direcție. Faceți dublu clic pentru a termina."),
                               ("traseu_en", "Double-click to finish")],
    "s_declansator": [("trigger_ro", "În grupul Animație complexă , faceți clic pe Declanșator , indicați spre La clic și selectați obiectul."),
                      ("trigger_en", "On the Animation tab, select Trigger , point to On Click , and then choose the object")],
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
