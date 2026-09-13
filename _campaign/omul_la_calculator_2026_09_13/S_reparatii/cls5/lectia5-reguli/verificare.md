# Verificare reparatie — cls5 / m1-sisteme / lectia5-reguli

**Verdict: trece_cu_defecte_minore** · 35 schimbari verificate (33 declarate + 2 nedeclarate inofensive)

| Ce | Rezultat | Dovada |
|:--|:--|:--|
| Norme de securitate (3 reguli) | corect, general, fara lege inventata | diff + captura pas_01 |
| Parola NIST 800-63B | corect | curl proaspat pages.nist.gov: 15 caractere, fara reguli de compozitie |
| Documente (Documents) | corect | curl proaspat MS ro-ro Explorer |
| Alimentare → Închidere | corect | curl proaspat MS ro-ro shut-down |
| Word / pana de curent | corect | crash_ro.txt (raportul citeaza gresit word_recover_ro.txt) |
| Chestionare (8 intrebari schimbate) | chei corecte, raport lungime 0,69-1,16, fara litera in indiciu | verif/v_quiz.py |
| HTML | 0 etichete rupte; poarta S_poarta.py: OK | v_quiz.py, S_poarta |
| Minore | ex.3 „prin Shut down” fara RO; atom 3 inca Scoala/TIC/Clasa5; pasul „exista deja” nu spune Nu; ajutor „Nou” vs nota; distractor slab | verificare.json |

Reparatiile de fond sunt corecte si verificate pe surse brute proaspete.
Nimic blocant sau important; 6 defecte minore de consecventa/trasabilitate.
Deciziile de structura (lungimea orei, regulamentul scolii) raman corect la profesor.
