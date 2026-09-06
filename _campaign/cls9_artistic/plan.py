# -*- coding: utf-8 -*-
"""Planul materiei de clasa a IX-a pentru profilul ARTISTIC (orele 9A si 9M de la Brauner).

Sursa: Anexa 22 la OMEC 6.930/19.12.2025 - programa de T.I.C., clasa a IX-a, trunchi
comun, TOATE filierele si profilurile. Textul aprobat, citit prin OCR:
  knowledge/curriculum_liceu/TIC_IX_Anexa22_OMEC6930_2025_ocr.txt (+ PDF-ul alaturi)

Programa are 3 domenii de continut. Alocarea: 1 ora/saptamana. Lectiile de mai jos
acopera domeniile in ordinea lor, cate o lectie pe ora de curs.

Nota din programa, respectata in exemple: pentru Societate digitala se lucreaza pe
Google Workspace sau Microsoft Teams; pentru Continuturi digitale pe LibreOffice sau
Microsoft Office; pentru Sisteme de calcul pe Linux (Ubuntu) sau Windows.
"""

PROFIL = "artistic"
CLASA = "cls9"

MODULE = [
    {
        "id": "m1-societate-digitala",
        "titlu": "Societate digitala",
        "descriere": "Comunicare si colaborare digitala, platforme de invatare, inteligenta artificiala si tehnologii emergente",
        "domeniu": "1. Societate digitala (1.1 - 1.4)",
        "lectii": [
            ("lectia1-forme-comunicare", "Formele comunicarii digitale si cand folosesti fiecare",
             "1.1 - concepte de baza si caracteristici ale formelor de comunicare si colaborare digitala: site-uri web, buletine informative, e-mail, chat, forum, platforme de discutii specializate, retele de socializare, apeluri vocale si video, videoconferinte; modalitati de feedback (formulare)"),
            ("lectia2-email-neticheta", "E-mailul profesional si neticheta",
             "1.1 - repere pentru crearea de mesaje profesionale prin e-mail; respectarea netichetei specifice fiecarei forme de comunicare: adaptarea tonului formal/informal, simboluri expresive (emoticon)"),
            ("lectia3-gestionare-mesaje-risc", "Gestionarea mesajelor si mesajele cu risc de securitate",
             "1.1 - gestionarea mesajelor (foldere, etichete, raspunsuri si redirectionari in e-mail si pe alte platforme); identificarea mesajelor cu risc de securitate"),
            ("lectia4-resurse-partajate", "Resurse digitale partajate si feedbackul constructiv",
             "1.1 - crearea si partajarea de resurse digitale prin Internet, gestionarea in comun a resurselor (organizare, arhivare, accesibilitate), oferirea de feedback constructiv in colaborarea digitala"),
            ("lectia5-platforme-invatare", "Aplicatii si platforme care sprijina invatarea",
             "1.2 - concepte, caracteristici si repere pentru identificarea si utilizarea unor aplicatii, platforme si instrumente adecvate pentru a sprijini invatarea (tutoriale, cursuri online); utilizarea responsabila si cu discernamant a inteligentei artificiale pentru invatare"),
            ("lectia6-ia-ce-este", "Inteligenta artificiala: ce este si pe ce se sprijina",
             "1.3 - elemente care stau la baza IA (statistica, adaptivitate, sabloane, generare probabilistica de continut); diferente fata de gandirea umana; rolul deciziilor umane in proiectarea, selectia si validarea algoritmilor; tipologii si domenii de aplicare (clasificare, recomandare, predictie, generare, interactiune cu mediul)"),
            ("lectia7-ia-date-bias", "Datele din spatele inteligentei artificiale: invatare automata si partinire",
             "1.3 - invatare automata in cadrul IA; datele ca fundament (surse, colectare, etichetare, actualizare in timp real, influenta datelor asupra rezultatelor); prejudecati - partinire (bias) sociala si culturala reflectate in date; confuzia intre fapte reale si fapte prezentate denaturat"),
            ("lectia8-modele-generative", "Modele generative (LLM): cum le adresezi si cum le verifici",
             "1.3 - modele generative pentru crearea de continut digital (LLM): caracteristici, modalitati de adresare (descriere, asistent virtual - chatbot), credibilitate, adevar stiintific in raspunsurile generate; interactiune eficienta prin gandire critica, creativitate, gandire computationala, constiinta de sine si sociala"),
            ("lectia9-ia-responsabila", "Inteligenta artificiala responsabila: drepturi, reglementare, mediu",
             "1.3 - responsabilitatea umana in proiectarea si testarea sistemelor; reglementari, transparenta si responsabilitate (auditare, drepturi fundamentale, confidentialitate, echitate); proprietate intelectuala, autenticitate si drepturi de autor pentru continutul generat de IA; sustenabilitate si impact ecologic (consum energetic, resurse naturale, amprenta de carbon); beneficii si limitari"),
            ("lectia10-tehnologii-emergente", "Tehnologii emergente: realitatea virtuala si augmentata",
             "1.4 - caracteristici ale unor tehnologii emergente din punctul de vedere al impactului; realitate extinsa: realitate virtuala si realitate augmentata; scenarii de utilizare pentru o problema cotidiana"),
        ],
    },
    {
        "id": "m2-continuturi-digitale",
        "titlu": "Continuturi digitale",
        "descriere": "Documente si prezentari digitale la nivel profesional, cu instrumentele suitelor de birotica",
        "domeniu": "2. Continuturi digitale, tehnologii si aplicatii specializate (2.1 - 2.2)",
        "lectii": [
            ("lectia1-text-ascii-unicode", "Cum este reprezentat textul: ASCII si UNICODE",
             "2.1 - concepte de baza si caracteristici ale continuturilor de tip text: reprezentarea textului in memorie, utilizarea seturilor de caractere, codificarea ASCII si UNICODE"),
            ("lectia2-formatare-profesionala", "Formatare profesionala: stiluri, indentari, tabulatori",
             "2.1 - instrumente pentru formatarea profesionala a unui document: stiluri, indentari, tabulatori"),
            ("lectia3-aspect-pagina", "Aspectul paginii: intreruperi, sectiuni si scriere pe coloane",
             "2.1 - aspectul paginii, intreruperi de pagina, scriere pe coloane"),
            ("lectia4-documente-lungi", "Documente lungi: cuprins automat, liste de imagini si tabele",
             "2.1 - nivel avansat: generarea automata a cuprinsului, liste de imagini si tabele, proprietati ale documentului, verificarea automata ortografica si gramaticala"),
            ("lectia5-colaborare-document", "Lucrul in echipa pe un document: comentarii si urmarirea modificarilor",
             "2.1 - nivel avansat: comentarii, gestionarea modificarilor"),
            ("lectia6-imbinare-corespondenta", "Imbinarea corespondentei (Mail Merge)",
             "2.1 - nivel avansat: imbinarea corespondentei - conectarea unui document la o sursa de date, in vederea trimiterii de invitatii sau scrisori personalizate"),
            ("lectia7-ecuatii-campuri-ia", "Ecuatii, simboluri, campuri automate si IA in prelucrarea textului",
             "2.1 - formatarea obiectelor utilizate intr-un document (ecuatii si simboluri, campuri automate); utilizarea responsabila a IA in prelucrarea de texte (redactare, corectare, traducere); adaptarea produsului digital la publicul tinta si la scopul comunicarii"),
            ("lectia8-prezentari-baze", "Prezentari digitale: coordonatorul de diapozitive si temele",
             "2.2 - concepte de baza si caracteristici ale prezentarilor digitale; formatare profesionala: coordonator de diapozitive, teme predefinite"),
            ("lectia9-prezentari-interactive", "Prezentari interactive: butoane de actiune, legaturi, multimedia",
             "2.2 - interactivitate (butoane de actiune, legaturi), integrarea de elemente multimedia, animatii si tranzitii personalizate, expunere personalizata; utilizarea responsabila a IA in generarea de prezentari"),
        ],
    },
    {
        "id": "m3-sisteme-de-calcul",
        "titlu": "Sisteme de calcul",
        "descriere": "Componenta hardware si componenta software a unui sistem de calcul",
        "domeniu": "3. Sisteme de calcul (3.1 - 3.2)",
        "lectii": [
            ("lectia1-arhitectura", "Sisteme desktop si mobile; arhitectura unui sistem de calcul",
             "3.1 - caracteristici, utilizare, avantaje si dezavantaje ale sistemelor de tip desktop (birou, educatie, jocuri) si de tip mobil (laptopuri, telefoane inteligente, tablete); arhitectura sistemului de calcul: concepte de baza si caracteristici ale componentelor, fluxul datelor si al instructiunilor"),
            ("lectia2-procesorul", "Procesorul (CPU): unitatea logico-aritmetica, comanda si cache",
             "3.1 - unitatea centrala de procesare: structura interna (unitatea logico-aritmetica, unitatea de comanda si control, cache); parametri care influenteaza performanta (numar de nuclee, frecventa, cache)"),
            ("lectia3-memoria", "Memoria interna: RAM si ROM",
             "3.1 - memoria interna (RAM - Random Access Memory, ROM - Read Only Memory): rol, caracteristici, asemanari si deosebiri, parametri care influenteaza performanta"),
            ("lectia4-stocarea", "Stocarea datelor: HDD, SSD, medii optice, carduri, memorie flash",
             "3.1 - medii si dispozitive de stocare: caracteristici, utilizare, avantaje si dezavantaje (HDD, SSD, medii optice, card de memorie, memorie flash); parametri care influenteaza performanta"),
            ("lectia5-placa-baza-interfete", "Placa de baza, magistralele, BIOS/UEFI si interfetele",
             "3.1 - placa de baza: structura (magistrale de date, adresa si control, chipseturi si BIOS/UEFI), rol; interfete: caracteristici ale principalelor interfete (placa de sunet, placa de retea, placa video, USB)"),
            ("lectia6-periferice-intrare", "Periferice de intrare: de la tastatura la scanere 3D si RFID",
             "3.1 - caracteristici, utilitate, avantaje, dezavantaje si parametri ai perifericelor de intrare uzuale: tastatura, mouse, microfon, camera digitala, scanere 2D (imagini, coduri de bare sau QR, citire optica a caracterelor - OCR), scanere 3D, cititor RFID"),
            ("lectia7-periferice-iesire", "Periferice de iesire si de intrare-iesire",
             "3.1 - periferice de iesire: monitor, imprimanta, imprimanta 3D, plotter, boxe, videoproiector; periferice de intrare-iesire: touchscreen, controler de joc cu feedback, dispozitive cu NFC"),
            ("lectia8-alimentare-racire", "Alimentare si racire: surse, TDP si metode de racire",
             "3.1 - sisteme de alimentare si racire: surse de alimentare, TDP (cantitatea maxima de caldura generata de componente), metode de racire (pasiva, activa, cu lichid)"),
            ("lectia9-sistemul-de-operare", "Software si sistemul de operare: tipuri, functii, sisteme de fisiere",
             "3.2 - tipuri principale de software (de sistem, aplicatii); concepte de baza si caracteristici ale unui sistem de operare: tipuri (desktop, servere, dispozitive mobile, industriale), functii principale, interfete (grafica, bazata pe gesturi); tipuri comune de sisteme de fisiere (NTFS, FAT32, exFAT, EXT, APFS)"),
            ("lectia10-fisiere-securitate", "Gestionarea fisierelor si securizarea sistemului",
             "3.2 - gestionarea profesionala a folderelor si fisierelor (organizare ierarhica, arhivare), monitorizarea proceselor; securizarea sistemului de operare (firewall, software antivirus, gestionarea utilizatorilor si a permisiunilor, criptare)"),
        ],
    },
]


def toate_lectiile():
    for m in MODULE:
        for i, (fisier, titlu, continut) in enumerate(m["lectii"], 1):
            yield {
                "modul": m["id"], "modul_titlu": m["titlu"], "domeniu": m["domeniu"],
                "nr": i, "din": len(m["lectii"]),
                "fisier": fisier + ".html", "titlu": titlu, "continut": continut,
                "cale": "content/liceu/%s/%s/%s/%s.html" % (PROFIL, CLASA, m["id"], fisier),
                "cheie": "%s-%s-%s-%s" % (PROFIL, CLASA, m["id"], fisier),
            }


if __name__ == "__main__":
    L = list(toate_lectiile())
    print("module: %d | lectii: %d" % (len(MODULE), len(L)))
    for m in MODULE:
        print("  [%s] %s - %d lectii" % (m["id"], m["titlu"], len(m["lectii"])))
        for i, (f, t, _) in enumerate(m["lectii"], 1):
            print("      %2d. %-34s %s" % (i, f, t))
