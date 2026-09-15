# Raport: evaluare independentă „Misiunea Mesaj Sigur” (internet-vi, VI-U2), 15.09.2026

**Pe scurt:** faptele și cheile sunt în mare parte corecte, iar exemplele sunt toate fictive (domenii `.test`, nicio marcă). Am găsit **15 semnalări: 0 blocante, 7 importante, 8 minore**. **4 sunt reparate** în joc, iar poarta dă din nou `[TRECUT]` (60 de întrebări jucate, 68,2 diacritice la 1000 de litere).
Cum am lucrat: am citit toată configurația (vezi `harta_acoperirii.md`, fiecare element), apoi am jucat jocul cu Playwright pe iPhone SE în tema luminoasă și pe Pixel 7 în tema întunecată. Am greșit intenționat, ca un copil. Sfaturile de siguranță le-am verificat pe text brut din surse oficiale: DNSC, CISA, NCSC, UNICEF (`surse\`).

## Ce schimbă ora de mâine
1. **Parola: 8 → 15 caractere (REPARAT în joc).** DNSC: „cel puțin 15 caractere”. CISA: „At least 16 characters”.
2. **Lecția 1 LearningHub cere încă „minim 8 caractere”** (S06). Acum jocul și lecția se contrazic, iar lecția o actualizează profesorul.
3. **Provocarea de pe diplomă cere un cont de e-mail școlar** pentru fiecare elev și pentru colegul de bancă (S08). Pentru elevii fără cont sau școlile fără laborator trebuie o variantă.

## Importante
- **S02 (REPARAT).** Pagina nivelului 4 interzicea redirecționarea oricărui mesaj fără acord. Întrebarea din același nivel cere tocmai redirecționarea anunțului dirigintei. Acum regula se referă la mesajele *personale*.
- **S03 (REPARAT).** În vânătoarea din mesajul-capcană, „contul tău va fi” era text corect, iar „închis în 24 de ore.” era greșeală. Un copil care marca propoziția întreagă era penalizat; jocul a respins marcajul la testare. Acum toată propoziția e un singur fragment.
- **S05 (motor, nereparat).** Fiecare greșeală apare ca **un singur buton, oricât de lungă e**, iar textul corect e tăiat în câte un buton pe cuvânt. Butoanele „lungi” dau de gol răspunsul. Am măsurat: N5 are 1 buton cu mai multe cuvinte, N6 are 3, și toate sunt greșelile. Cererea pentru motor: aceeași tăietură pentru tot textul.
- **S07 (neverificat).** Numele dosarelor (Primite/Trimise/Ciorne/Spam) și prefixul Fw:/Fwd: depind de aplicația și limba folosite la clasă. Lecția 1 le dă în engleză.

## Minore (grupate)
- **Reparat:** S04. Why-ul spunea că un .exe „pornește singur” și că e periculos oricând. Pagina spune că pornește când îl deschizi.
- **Sfaturi corecte, dar incomplete față de surse:** S09 (DNSC: parola se schimbă și pe celelalte conturi cu aceeași parolă) și S10 (UNICEF și lecția 4: blochezi și raportezi).
- **Formulări:** S11 (why-ul linkului nu arată că numele site-ului se citește la final), S14 („pare trimis de el”, pronume ambiguu), S15 („adresa și telefonul rămân secrete”, prea absolut).
- **Aspect (motor):** S12 (linkul se rupe la cratimă pe iPhone SE) și S13 (mesajul lui Tudor apare pe un singur șir, nu arată ca un e-mail).

## Ce e în regulă (verificat)
- Toate cele 30 de chei au o singură variantă corectă. Ordinea de la `order` e unică. Nu am găsit alte greșeli nemarcate în cele 3 vânători: am verificat fiecare cuvânt nemarcat, iar marcajele în plus pe text corect au fost respinse pe bună dreptate.
- Semnele phishingului și ce faci cu mesajul se potrivesc cu CISA („Urgent… language”, „Incorrect email addresses or links”, „Don't reply or click on any attachment or link”, „report spam”). Why-ul „șapte semne” e numărat corect.
- Urma digitală se potrivește cu fișa de pregătire VI-U2 („'Am sters' inseamna doar ca l-ai sters DE LA TINE”).
- Acoperirea programei CS.1.3: antivirus/malware, parole/identitate, cont/adresă/structură, operații cu mesaje, dosare/agendă, netichetă. Lecția 16 (evaluarea sumativă) e acoperită ca recapitulare prin nivelul final.
- Am jucat pe 2 telefoane, în ambele teme: zero erori JS, nimic mai lat decât ecranul, contrast bun, diploma se deschide cu provocarea. Timpul estimat e de 30–40 de minute (645 de cuvinte și 30 de întrebări).

## Ce n-am putut verifica și de ce
- **Paginile HTML DNSC** sunt blocate de Cloudflare atât pentru curl, cât și pentru Chromium headless, iar din arhivă n-am putut citi pagina de parole. Am folosit PDF-ul DNSC arhivat pe web.archive.org (2024-04-19); regula de 15 caractere vine de acolo. Paginile CISA sunt marcate de CISA „Archived Content”, dar recomandarea de 16 caractere e în același sens.
- **Interfața reală de e-mail în română** (numele dosarelor, butoanele): n-am avut acces la aplicația folosită la școală (S07).
- **Dacă elevii au conturi de e-mail școlare:** necunoscut (S08).
