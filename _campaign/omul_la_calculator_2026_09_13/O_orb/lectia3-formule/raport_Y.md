# Recenzia lecției lectia3-formule (cls8)

## 1. Primul exercitiu cu formule: elevul scrie =SUM(E2:E4), Excel da 77, iar ajutorul lectiei ii spune ca trebuia 78 — elevul care a lucrat corect crede ca a gresit.
- **Gravitate:** blocant
- **Unde / dovada:** Rezultatul ar trebui sa fie 78 (27 + 21 + 29).
- **Ce trebuie schimbat:** „Rezultatul ar trebui sa fie 77 (27 + 21 + 29).” — si numerele de control din lectie generate din aceleasi date, nu scrise de mana (atomul 6 are deja 77).

## 2. Rezolvarea Ex. 2 spune ca fara $ formula ar inmulti cu „celule goale”; in foaia elevului B2 e textul „Pret/elev” (C4 = #VALUE!) si B3 = 45 (C5 = 1575, un numar gresit fara niciun semn de eroare).
- **Gravitate:** important
- **Unde / dovada:** adica celule goale
- **Ce trebuie schimbat:** „Fara $, C4 ar inmulti cu B2 (textul Pret/elev → eroare #VALUE!), iar C5 cu B3 (45) → 1575 lei la mancare, un rezultat gresit care arata normal. De aceea verifici a doua si a treia celula, nu doar prima.” Eventual cere elevului sa incerce intai fara $.

## 3. Exemplul si intrebarea despre referinta absoluta folosesc TVA 19%; in Romania cota standard e 21% din 1 august 2025 — iar lectia insasi pomeneste trecerea „de la 19% la 21%”.
- **Gravitate:** important
- **Unde / dovada:** Ai in celula B1 cota de TVA (19%).
- **Ce trebuie schimbat:** Cota 21% in tabelul din atomul 7 si in intrebare (C2..C4 = 1,05 / 0,63 / 1,68), sau un exemplu fara cifra legala („reducerea din B1”); in „Deschidere”: „cand cota se schimba (in 2025 a trecut de la 19% la 21%)”.

## 4. Lectia numeste manerul de copiere „drag handle” de 12 ori (grep pe innerText.txt); Excel il numeste „fill handle” in engleza si „instrumentul de umplere” in romana — elevul care cauta cuvantul sau il intreaba pe profesor nu il gaseste nicaieri in program.
- **Gravitate:** important
- **Unde / dovada:** Drag handle-ul (manerul de completare) este un patrat mic negru
- **Ce trebuie schimbat:** „instrumentul de umplere (fill handle) — patratelul din coltul din dreapta-jos al celulei”; la fel „Formatare celule (Format Cells)”, pe doua limbi la prima aparitie.

## 5. Lectia spune ca Excel „nu calculeaza de la stanga la dreapta”; Microsoft spune ca il calculeaza de la stanga la dreapta, pe niveluri de prioritate — iar exemplul lectiei =10-3+2 = 9 e chiar un calcul de la stanga la dreapta.
- **Gravitate:** important
- **Unde / dovada:** Ca in matematica, Excel nu calculeaza de la stanga la dreapta.
- **Ce trebuie schimbat:** „Ca in matematica: intai parantezele, apoi inmultirea si impartirea, apoi adunarea si scaderea; operatiile de acelasi rang se fac de la stanga la dreapta (=10-3+2 = 9, nu 5).”

## 6. Zecimalele sunt scrise cu punct (=3.5*10, „media 7.50”, 9.67); pe Windows in romana virgula e zecimala, iar verificarea „7.50” nu apare pe ecran nici macar pe engleza (formatul General da 7.5).
- **Gravitate:** important
- **Unde / dovada:** Verifica: Suma Anei trebuie sa fie 30, media 7.50.
- **Ce trebuie schimbat:** „media 7,5 (sau 7.5, daca Windows-ul e in engleza)”; o singura caseta pe modul „cum scrii zecimalele pe calculatorul tau”; tabelul final cu acelasi format pe coloana (9,00 / 7,00 / 9,67).

## 7. Ora 7 din plan e „formule cu operatori aritmetici”; lectia adauga SUM (ora 8), referinte absolute si F4, 3.242 de cuvinte si 3 exercitii — peste 50 de minute la ritmurile provizorii.
- **Gravitate:** important
- **Unde / dovada:** calculat: pornire 8 + citirea lectiei + sarcina din [fișier] peste 50 min; programa ([fișier]) separa „Formule ... operatori aritmetici” de „Functii ... suma”.
- **Ce trebuie schimbat:** Ora 7 = Incearca cu =E2+E3+E4 in loc de SUM, atomii 1-5, Ex. 1 cu =B2+C2+D2+E2; atomul 7 ($B$1) + Ex. 2 mutate la inceputul orei 8 sau ca tema; SUM lasat lectiei 4.

## 8. F4 e prezentat ca „B1 → $B$1 → B1”; Microsoft arata patru tipuri de referinta (inclusiv A$1 si $A1), deci elevul care apasa F4 a doua oara nu revine la B1.
- **Gravitate:** minor
- **Unde / dovada:** B1 → $B$1 → B1
- **Ce trebuie schimbat:** „Apesi F4 o data: $B$1. Daca mai apesi, apar variante in care e blocat doar randul sau doar coloana; apesi pana revii la ce vrei.”

## 9. Intrebarile atomilor 2 si 4 cer ce se preda mai tarziu (actualizarea automata, SUM), iar atomul „ordinea operatiilor” nu are nicio intrebare despre ordinea operatiilor (R2.1).
- **Gravitate:** minor
- **Unde / dovada:** Care formula este echivalenta cu=B2+B3+B4+B5+B6?
- **Ce trebuie schimbat:** Intrebarea despre A1 in atomul 3, cea despre copierea E2→E5 in atomul 4, o intrebare noua pe =2+3*4 in atomul 5; intrebarea SUM mutata in lectia 4.

## 10. Lectia nu are nicio diacritica (0,0 la 1000), desi specificatia proiectului le cere in continut.
- **Gravitate:** important
- **Unde / dovada:** Excel foloseste acesti operatori pentru calcule. Atentie: sunt diferiti de ce scrii pe caiet!
- **Ce trebuie schimbat:** Diacritice (ș, ț cu virgula) in tot corpul lectiei, conform LESSON_SPECIFICATION.md:401; <title> ramane fara.
