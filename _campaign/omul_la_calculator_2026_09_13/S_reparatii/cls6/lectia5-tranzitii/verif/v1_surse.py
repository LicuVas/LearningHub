import subprocess, re, html, os, sys
OUT = r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls6\lectia5-tranzitii\verif\raw"
os.makedirs(OUT, exist_ok=True)
PAGES = {
 "tranzitii_ro": "https://support.microsoft.com/ro-ro/office/add-change-or-remove-transitions-between-slides-3f8244bf-f893-4efd-a7eb-3a4845c9c971",
 "tranzitii_en": "https://support.microsoft.com/en-us/office/add-change-or-remove-transitions-between-slides-3f8244bf-f893-4efd-a7eb-3a4845c9c971",
 "timp_ro": "https://support.microsoft.com/ro-ro/office/set-the-timing-and-speed-of-a-transition-c3c3c66f-4cca-4821-b8b9-7de0f3f6ead1",
 "timp_en": "https://support.microsoft.com/en-us/office/set-the-timing-and-speed-of-a-transition-c3c3c66f-4cca-4821-b8b9-7de0f3f6ead1",
 "morph_ro": "https://support.microsoft.com/ro-ro/office/use-the-morph-transition-in-powerpoint-8dd1c7b2-b935-44f5-a74c-741d8d9244ea",
 "morph_en": "https://support.microsoft.com/en-us/office/use-the-morph-transition-in-powerpoint-8dd1c7b2-b935-44f5-a74c-741d8d9244ea",
 "autorulare_ro": "https://support.microsoft.com/ro-ro/powerpoint/training/create-a-self-running-presentation",
 "autorulare_en": "https://support.microsoft.com/en-us/powerpoint/training/create-a-self-running-presentation",
 "ebb_ro": "https://support.microsoft.com/ro-ro/office/ebb3d20e-dcd4-444f-a38e-bb5c5ed180f4",
 "ebb_en": "https://support.microsoft.com/en-us/office/ebb3d20e-dcd4-444f-a38e-bb5c5ed180f4",
 "animtiming_en": "https://support.microsoft.com/en-us/office/set-animation-effect-timing-and-speed-in-powerpoint-3fc7ef1e-a2e3-4ab9-a0bd-ec2a6ea8d6bb",
 "animtiming_ro": "https://support.microsoft.com/ro-ro/office/set-animation-effect-timing-and-speed-in-powerpoint-3fc7ef1e-a2e3-4ab9-a0bd-ec2a6ea8d6bb",
}
def text(h):
    h = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", h)
    h = re.sub(r"(?s)<[^>]+>", " ", h)
    return re.sub(r"\s+", " ", html.unescape(h))
T = {}
for k, u in PAGES.items():
    r = subprocess.run(["curl", "-sL", "-A", "Mozilla/5.0", u], capture_output=True)
    t = text(r.stdout.decode("utf-8", "replace"))
    T[k] = t
    open(os.path.join(OUT, k + ".txt"), "w", encoding="utf-8").write(t)
    print(k, len(t))
TERMS = sys.argv[1:] or []
CHECK = [
 ("tranzitii_ro", ["Subtil", "Interesant", "Dinamic", "Estompare", "Metamorfoză", "Previzualizare", "Se aplică tuturor", "Conținut dinamic", "Alt sunet", "Durată"]),
 ("timp_ro", ["Avansare diapozitiv", "La clic de mouse", "După", "Cronometrul pornește", "avansa mai rapid", "Alt sunet", "Temporizare"]),
 ("morph_ro", ["Metamorfoz", "2019", "2021", "2024", "cel puțin un obiect în comun", "dublați", "2016"]),
 ("morph_en", ["2024", "2019", "2021", "at least one object in common", "2016", "web"]),
 ("autorulare_ro", ["clic", "chioșc", "animați", "Utilizare temporizări", "Temporiz"]),
 ("autorulare_en", ["click", "kiosk", "animation", "Use Timings"]),
 ("ebb_en", ["click", "kiosk", "animation", "timing"]),
 ("animtiming_en", ["On Click", "timer", "advance", "slide"]),
 ("tranzitii_en", ["Other Sound", "Dynamic Content", "Subtle", "Exciting"]),
]
for k, terms in CHECK:
    t = T[k]
    for term in terms:
        idx = [m.start() for m in re.finditer(re.escape(term), t)]
        print(f"--- {k} | {term!r}: {len(idx)}")
        for i in idx[:3]:
            print("    ..." + t[max(0, i-160): i+200] + "...")
