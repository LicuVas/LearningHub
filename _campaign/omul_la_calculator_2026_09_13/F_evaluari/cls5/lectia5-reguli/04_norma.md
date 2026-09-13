# 04 — Norma din afara lecției (U16 + normele de securitate)

## 1. Programa (OMEN 3393/2017) și planul anului
- `surse/curriculum_extras.txt`: clasa a V-a, domeniul „Norme de ergonomie și de siguranță” = „Normele de securitate și protecție a muncii în laboratorul de informatică” + „Poziția corectă a corpului la stația de lucru” (CS.1.1).
- `surse/calendar_5AM_5M_extras.txt`: ora 2, **18.09.2026**, „Norme de securitate în laboratorul de informatică. Poziția corectă la calculator”.
- `surse/calendar_5AM_5M_grep_teme.txt`: fișiere și directoare = orele 9-10 (13.11 și 20.11.2026, M2); siguranța pe Internet = ora 16 (15.01.2027, M3). Lecția 5 predă ambele în septembrie. Pasul 6 are nota „depaseste continutul lectiei … (programa cls. V, OMEN 3393/2017)” afișată elevului (R4.3).

## 2. Normele de securitate — sursă primară românească
- **Nu am găsit o normă românească specifică „laboratorului de informatică” din gimnaziu** (căutare 13.09.2026). Ce există, pe text brut:
  - **Legea 319/2006** (legislatie.just.ro, forma consolidată afișată „actualizată până la data 24 martie 2012”, `surse/legea319.txt`), art. 5 a): lucrător înseamnă inclusiv „elevii în perioada efectuării stagiului de practica”. Deci un elev de a V-a la ora de TIC **nu intră** în definiția de lucrător. Legea nu impune „instructaj semnat” pentru ora de TIC; regula vine din școală (ROF / regulamentul laboratorului), pe care nu îl am. Art. 23 (1) d), pentru lucrători: „sa comunice imediat … orice situaţie de muncă despre care au motive întemeiate sa o considere un pericol” — spiritul regulii „anunță, nu interveni”.
  - **Statutul elevului, OMENCS 4742/2016** (reproducere actualizată mai 2024, nu Monitorul Oficial; `surse/statut_elev_2024.txt`), art. 15 a): elevilor le e interzis „să deterioreze bunurile din patrimoniul unităţii de învăţământ”; art. 28 (1): elevii răspunzători de deteriorare „sunt obligaţi să acopere … toate cheltuielile”. Lecția spune doar că reparațiile „costa scump” și că elevul „a primit avertisment”; nu spune că familia plătește paguba.
  - **HG 1028/2006** (ecran de vizualizare, pentru lucrători) — folosit la lecția 4 (`lectia4-ergonomie/surse/hg1028_portalssm.txt`); nu se referă la regulile electrice ale laboratorului.
- **Ce are o fișă de instructaj de laborator și lecția NU are** (numărat în `u5_iesire.json` A7): prize, prelungitoare, cabluri deteriorate/fără izolație (0), miros de ars / fum / incendiu (0), evacuare / ieșire (0), alergatul printre mese (0), ghiozdanele pe culoar (lecția chiar spune „Lasa sticla … pe podea”), ce faci dacă un coleg ia curent (0). Aceste norme sunt sinteza mea de practică, **nesursată** — de confirmat cu regulamentul laboratorului de la Brauner.

## 3. Specialistul, în 2026
- **Parola:** lecția predă „Minim 8 caractere” + „Combina litere mari, litere mici, cifre si simboluri”. NIST SP 800-63B-4 (text brut, `surse/nist_63b.txt`): minim **15** caractere când parola e singurul factor și „SHALL NOT impose other composition rules”. Recomandarea actuală = frază-parolă lungă.
- **Word și pana de curent:** Microsoft ro-ro spune că aplicația recuperează automat lucrul (`surse/word_recover_ro.txt`); lecția spune că se pierde tot.

## 4. Limba (U16)
- `LESSON_SPECIFICATION.md:751`: „Romanian text with proper diacritics (ă, â, î, ș, ț)”.
- Măsurat: **0,1 diacritice la 1000 de litere** (2 diacritice în toată lecția: „ț” din „siguranță” și „ă”), față de ~52 într-un text românesc normal. ș/ț cu virgulă vs sedilă: nu se aplică (nu există).
- Cuvinte stricate, cu citat (`u5_iesire.json` A5): „profesormeaintine”, „dosap”, „tranjand”, „Instaleza”, „nu vei stii”.
