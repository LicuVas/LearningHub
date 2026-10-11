import json, re, collections
BASE = "C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/"
src = open(BASE + "_proba_elev/fise_4848.md", encoding="utf-8").read()
ids = re.findall(r"^## (\S+)$", src, re.M)

# doar abaterile de la OK; restul = OK
ab = {
 "audio-audacity-deschidere-sunet": ("INCURCA", "1", "Sunetul descărcat din lecție, de exemplu batai-in-usa.wav, ajunge în Descărcări (Downloads).", "Fișa presupune că sunetul e deja descărcat; cum se descarcă nu spune. Dacă nu l-am luat din lecție, la pasul 3 nu găsesc batai-in-usa."),
 "audio-clipchamp-cap-redare": ("INCURCA", "1-2", "La lecția 11 nu-l pornești: îl recunoști din poze.", "Pașii cer un clic pe riglă în Clipchamp, dar aceeași fișă zice să nu-l pornesc; nu pot verifica «Ce vezi când ai reușit». Trebuie să mă mulțumesc cu poza."),
 "audio-clipchamp-redare": ("INCURCA", "2", "Apasă ▶ Redare, sub previzualizare.", "Nu pot apăsa nimic: editorul nu e deschis și fișa zice să nu-l pornesc; «muzica se aude» nu are cum să se întâmple."),
 "windows-folder-nou": ("INCURCA", "1 și Atenție", "În laborator lucrezi doar în folderul tău, din Documente: Ex, apoi numele și prenumele tău.", "Pasul 1 zice să intru în Documente, Atenție zice că lucrez în Ex + numele meu: nu e clar dacă fac «Ex Pop Ana» direct în Documente sau în alt folder."),
 "windows-cos-restaurare": ("INCURCA", "2", "micșorează cu liniuța ferestrele deschise", "Nu zice unde e liniuța (colțul din dreapta-sus al ferestrei); un copil de 11 ani nu știe care liniuță."),
 "windows-browser-redeschidere-fila": ("INCURCA", "2", "Numai în acest caz, închide cu X fereastra în care nu e lecția (dacă sunt două, pe amândouă).", "Neclar care fereastră închid și de ce; «pe amândouă» sună a închis și lecția. Mă face să ezit."),
 "windows-browser-cautare-ghilimele": ("INCURCA", "1-3, 6", "ține apăsată [Shift] și apasă tasta de lângă [Enter] pe care e desenat semnul \".", "Tasta «de lângă Enter» e ambiguă, iar variantele cu Ț/AltGr/spațiu sunt multe; la pasul 6 «ghilimelele sunt acolo?» nu zice ce fac dacă nu sunt."),
 "windows-scanare-microsoft-defender": ("INCURCA", "3-4 și Atenție", "Nu apăsa niciun buton de scanare, de exemplu Scanare rapidă sau Scanare acum", "Comanda din meniu «Scanați cu Microsoft Defender...» pornește ea însăși o scanare, deci pare să se contrazică cu interdicția; apoi «în coloana Tip scrie Aplicație» pomenește o coloană pe care n-am văzut-o."),
}
fise = []
for i in ids:
    if i in ab:
        v, p, c, pr = ab[i]
    else:
        v, p, c, pr = "OK", "", "", ""
    fise.append({"id": i, "verdict": v, "pas": p, "citat": c, "problema": pr})
cnt = collections.Counter(f["verdict"] for f in fise)
rez = {"OK": cnt["OK"], "INCURCA": cnt["INCURCA"], "BLOCAJ": cnt["BLOCAJ"]}
out = {"profil": "clasa a V-a", "nota_metoda": "citire literala a fiselor ca elev; aplicatiile reale (Audacity, Clipchamp, Explorer) nu au fost rulate", "rezumat": rez, "fise": fise}
json.dump(out, open(BASE + "_proba_elev/raport_m2_clasa_v.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(ids), rez)
