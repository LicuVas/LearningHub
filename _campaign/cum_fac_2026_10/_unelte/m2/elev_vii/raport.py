import json, collections
OK = "OK"; IN = "INCURCA"; BL = "BLOCAJ"
ids_ok = """audio-audacity-pornire audio-audacity-deschidere-sunet audio-audacity-zone-fereastra
audio-audacity-unda-sunet-liniste audio-audacity-linia-de-timp-secunda audio-audacity-marire-micsorare
audio-audacity-cap-redare-mutare audio-audacity-afisaj-timp audio-audacity-redare audio-audacity-pauza
audio-audacity-stop audio-audacity-inceput-sfarsit audio-audacity-inchidere-fara-salvare windows-folder-nou
windows-redenumire-f2 windows-copiere-lipire windows-mutare-decupare windows-clic-dreapta-comenzi-fisier
windows-explorer-anulare-ctrl-z windows-acelasi-nume-omitere windows-stergere-fisier windows-cos-restaurare
windows-explorer-inapoi windows-browser-trecere-fila windows-browser-inchidere-fila windows-browser-inapoi
windows-browser-inainte windows-browser-reimprospatare windows-browser-cautare-bara-adrese
windows-browser-cuvinte-cheie windows-browser-cautare-imagini windows-browser-alegere-rezultat
windows-browser-fereastra-falsa windows-securitate-scut-ceas windows-scanare-microsoft-defender
windows-tastatura-shift-litera-mare windows-inchidere-meniu-start windows-inchidere-meniu-esc""".split()
probs = {
 "windows-stergere-fisier-descarcat": (IN, "pas 3", "Un clic pe fișierul descărcat la lecție, de exemplu batai-in-usa, și apasă tasta [Delete].",
   "În laborator toți descarcă același nume: poți șterge fișierul unui coleg din Descărcări; fișa nu spune cum știi că e al tău (ex. ora/prima dată)."),
 "audio-clipchamp-zone": (IN, "pașii 1-4", "În stânga e Conținutul meu media (Your media)",
   "Pașii cer să găsești zone „pe ecran”, dar Atenția spune că nu pornești Clipchamp: nu am ce vedea decât în poză; pașii ar trebui să fie scriși ca descriere a pozei."),
 "audio-clipchamp-cap-redare": (IN, "pas 2", "Îl muți cu un clic pe rigla cu secunde, deasupra clipului pe care vrei să-l vezi.",
   "Pas de executat, dar Atenția zice „La lecția 11 nu-l pornești”: nu am editorul deschis, nu pot face clicul."),
 "audio-clipchamp-redare": (BL, "pas 2", "Apasă ▶ Redare, sub previzualizare.",
   "Nu am Clipchamp deschis (fișa însăși spune să nu-l pornesc) și nu are captură: nu pot executa pașii, nici verifica rezultatul („muzica se aude”)."),
 "windows-cautare-fisier-explorer": (IN, "pas 2", "în ea scrie Căutați în și numele folderului în care ești",
   "Pe Windows în engleză caseta scrie altceva („Search Documents”); fișa nu dă numele englezesc. Exemplul „compunere” poate să nu existe în folderul meu."),
 "windows-browser-redeschidere-fila": (IN, "pas 2", "Numai în acest caz, închide cu X fereastra în care nu e lecția (dacă sunt două, pe amândouă).",
   "Dacă am închis tot browserul, fișa e închisă și nu mai văd pasul; apoi „închide fereastra în care nu e lecția” e greu de deosebit și riscă să închid lecția. Pe Chrome: „scrie edge” nu se potrivește."),
 "windows-browser-legatura": (IN, "pas 1", "Găsește legătura pe pagină: textul ei e adesea albastru și subliniat.",
   "Nu spune pe ce pagină (ce legătură) să dau clic; Atenția zice filă nouă, dar pașii nu spun cum o deschid."),
 "windows-browser-cautare-ghilimele": (IN, "pașii 1-3", "ține apăsate [Shift] și [AltGr] (în dreapta barei de spațiu) și apasă aceeași tastă.",
   "Prea lung pentru ce se cere: ghicit ce tastatură am, „tasta lungă de deasupra Enter” (Backspace nu e deasupra lui Enter), iar la pasul 6 „ghilimelele sunt acolo?” nu spune ce fac dacă nu sunt."),
 "windows-securitate-stare-antivirus": (IN, "pașii 1-2", "scrie securitate ... Alege Protecție antivirus și împotriva amenințărilor.",
   "Pe Windows în engleză „securitate” nu găsește nimic, iar meniul se numește „Virus & threat protection”; fișa dă engleza doar pentru numele aplicației."),
 "windows-securitate-istoric-protectie": (IN, "pașii 1-2", "apoi apasă Istoric protecție.",
   "La fel: pe Windows în engleză „securitate” nu merge, iar „Protection history” / „Virus & threat protection” nu sunt date."),
}
fise = []
for i in ids_ok:
    fise.append({"id": i, "verdict": OK, "pas": "", "citat": "", "problema": ""})
for i, (v, p, c, pr) in probs.items():
    fise.append({"id": i, "verdict": v, "pas": p, "citat": c, "problema": pr})
cnt = collections.Counter(f["verdict"] for f in fise)
out = {"profil": "clasa a VII-a", "rezumat": {"OK": cnt[OK], "INCURCA": cnt[IN], "BLOCAJ": cnt[BL]}, "fise": fise}
with open(r"C:\00\Projects\LearningHub\_campaign\cum_fac_2026_10\_proba_elev\raport_m2_clasa_vii.json", "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
print(len(fise), out["rezumat"])
