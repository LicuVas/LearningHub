"""Reechilibrează lungimea variantelor greșite (varianta corectă se ghicea după lungime). Doar variantele GREȘITE se schimbă,
cu formulări la fel de plauzibile și tot greșite; la CC0 se scurtează varianta corectă, păstrând sensul."""
from pathlib import Path

J = Path(r"C:\00\Projects\LearningHub\jocuri")
FIX = {
    "audio-video-vii": [
        ("'Ștergerea întregului clip'", "'Ștergerea întregului clip și filmarea din nou'"),
        ("'Copierea clipului'", "'Copierea clipului în alt loc pe pistă'"),
        ("'Exportul proiectului'", "'Exportul proiectului ca fișier video nou'"),
        ("'O poți folosi fără să ceri voie și fără să fie obligatoriu să scrii autorul'", "'O folosești fără să ceri voie; autorul nu e obligatoriu'"),
        ("'O poți folosi doar dacă plătești'", "'O poți folosi doar dacă îi plătești autorului'"),
        ("'Micșorezi textul'", "'Micșorezi textul ca să ocupe mai puțin din imagine'"),
        ("'Adaugi o tranziție'", "'Adaugi o tranziție înainte de imaginea cu cerul'"),
        ("'Muți titlul pe pista audio'", "'Muți titlul pe pista audio, sub imaginea video'"),
        ("'720p are imaginea mai clară'", "'720p are mai mulți pixeli, deci imaginea e mai clară'"),
        ("'Nu e nicio diferență'", "'Nu e nicio diferență de imagine, doar de nume'"),
        ("'Exportul în 1080p nu are sunet'", "'Exportul în 1080p păstrează imaginea, dar pierde sunetul'"),
    ],
    "calculator-v": [
        ("'Pentru că priza e prea departe de scaun'", "'Pentru că priza e prea departe de scaun și cablul se rupe'"),
        ("'Nu contează cum îl oprești'", "'Nu contează cum îl oprești, programele se salvează singure'"),
        ("'Ca să nu se stingă lumina din laborator'", "'Ca să nu se stingă lumina și celelalte calculatoare din laborator'"),
        ("'Are mereu tastatură și monitor'", "'Are mereu tastatură, mouse și monitor legate la el'"),
        ("'Funcționează doar cu internet'", "'Funcționează doar când e conectat la internet'"),
        ("'Se folosește doar la birou'", "'Se folosește doar la birou, pentru scris documente'"),
        ("'Pentru că au un cablu lung'", "'Pentru că au un cablu lung și se leagă la calculator'"),
        ("'Pentru că se pun pe cap'", "'Pentru că se pun pe cap și acoperă ambele urechi'"),
        ("'Pentru că sunt mai scumpe'", "'Pentru că sunt mai scumpe decât căștile fără microfon'"),
    ],
    "excel-viii": [
        ("'Dublu-clic pe celula A1'", "'Dublu-clic pe celula A1, cea cu primul nume'"),
        ("'Ștergi literele din nume'", "'Scurtezi numele până încap în coloană'"),
        ("'Clic pe numărul rândului 1'", "'Clic pe numărul rândului 1 din stânga foii'"),
    ],
    "internet-vi": [
        ("'Un program care curăță calculatorul'", "'Un program care curăță calculatorul de viruși'"),
        ("'Un dosar pentru mesaje vechi'", "'Un dosar în care se mută singure mesajele vechi'"),
        ("'Un mesaj redirecționat'", "'Un mesaj redirecționat către toată agenda ta'"),
    ],
    "prezentari-vi": [
        ("'Aplicațiile nu au nimic în comun'", "'Aplicațiile nu au nimic în comun, fiecare face altceva'"),
        ("'Google Slides nu are diapozitive'", "'Google Slides nu are diapozitive, doar pagini de text'"),
        ("'Doar PowerPoint poate face prezentări'", "'Doar PowerPoint poate face prezentări cu teme și animații'"),
        ("'Te uiți la miniaturi'", "'Te uiți la miniaturile din stânga ferestrei'"),
        ("'Salvezi prezentarea ca PDF'", "'Salvezi prezentarea ca PDF și o deschizi'"),
        ("'Mărești textul'", "'Mărești textul ca să vezi animațiile mai bine'"),
    ],
    "web-viii": [
        ("'Un limbaj de programare, care face calcule'", "'Un limbaj de programare, care face calcule și ia decizii'"),
        ("'Un browser'", "'Un browser, programul care deschide paginile web'"),
        ("'Un program de desenat'", "'Un program de desenat imaginile unei pagini'"),
        ("'Alege fișierul imaginii'", "'Alege fișierul imaginii care se afișează pe pagină'"),
        ("'Mărește imaginea'", "'Mărește imaginea până umple toată lățimea'"),
        ("'Pune un chenar în jurul imaginii'", "'Pune un chenar colorat în jurul imaginii'"),
    ],
}
problems = []
for slug, pairs in FIX.items():
    f = J / slug / "index.html"
    s = f.read_text(encoding="utf-8")
    for old, new in pairs:
        n = s.count(old)
        if n != 1:
            problems.append(f"{slug}: {old} apare de {n} ori")
            continue
        s = s.replace(old, new)
    f.write_text(s, encoding="utf-8")
    print(slug, "ok")
print("probleme:", problems or "niciuna")
