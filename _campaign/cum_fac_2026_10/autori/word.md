# Autor „word”: Word, clasa a VII-a, lecțiile 1-9 (10.10.2026)

Fișierul: `cum-fac/_sursa/fise_word.json`. **78 de fișe**, 824 de formulări (8-12 pe fișă).
Verificatorul (`node cum-fac/_build/valideaza_fise.mjs fise_word.json`) are ultima linie **0**.
O probă în plus, a mea: nicio formulare în două fișe, nicio întrebare-tip repetată, nicio vorbă despre simulator.

## Câte fișe, pe lecții
| Lecția | Fișe | Ce gesturi |
|---|---|---|
| 1 (note și niveluri) | 0 | nu are niciun gest în Word |
| 2 Interfața | 13 | pornești Word, derulezi, bara de stare (pagini, cuvinte), panglica, săgeata ↘, rigla, cursorul, Enter, semnele ¶, Backspace/Delete, rândul gol, Ctrl+Z, Ctrl+Y |
| 3 Gestionarea documentului | 17 | document nou, din șablon, prima salvare (F12), numele în laborator, „already exists”, Ctrl+S, Salvare ca, PDF, închizi documentul (Ctrl+W), închizi Word-ul (✕), Recente/Ctrl+O, din Explorer, fișierul descărcat, Activare editare, vizualizări, ieși din Mod citire, zoom |
| 4 Obiecte | 5 | rândul nou sub paragraf, inserezi poza, inserezi tabelul, Tab între celule, Tab adaugă un rând |
| 5 Editare | 7 | selectezi trăgând, dublu-clic pe cuvânt, scoți selecția, ștergi textul selectat, copiezi, muți, repari rândul după lipire |
| 6 Formatare text/paragraf | 14 | aldin, cursiv, subliniat, font, mărime, culoare, un cuvânt fără selecție, scrii direct aldin, cele 4 alinieri, alineatul, spațierea |
| 7 Imagine/tabel/pagină | 7 | mărești poza din colț, încadrarea textului, stilul tabelului, Header Row, lățimea coloanei, orientarea, marginile din listă |
| 8 Tehnoredactare | 8 | repari spațiile, ghilimelele „ ”, diacriticele, linia de pauză, unești un paragraf rupt, titlul centrat fără spații, previzualizarea (Ctrl+P), scapi de pagina în plus |
| 9 Document după specificații | 7 | marginile exacte (Custom Margins), mărimea foii (A5), foaie de mărime anume (9 × 5 cm), afli fontul și mărimea, afli mărimea pozei, afli marginile foii, centrezi poza |

Fișa cerută de profesor, „cum închid un document Word”, este `word-inchidere-document` (Ctrl+W + fereastra Save / Don't Save / Cancel). Lângă ea e `word-inchidere-word` (✕).

## Gesturi văzute în lecții care NU au fișă separată, și de ce
1. **Salvarea în format .odt** (lecția 3, pasul 4): lecția îl pomenește în trecere, dar nu spune ce rând alegi în listă. O fișă ar fi trebuit să scrie lucruri pe care lecția nu le spune.
2. **Mutarea textului trăgându-l cu mouse-ul** (lecția 5, pasul 6): lecția o prezintă ca pe un accident, nu ca pe un gest de învățat. Am pus-o în atenționarea fișei `word-mutare-text`, împreună cu repararea ei (Ctrl+Z).
3. **Butonul Opțiuni lipire (Paste Options)** (lecția 5, pasul 5): lecția spune „azi nu-l folosim”. Apare în atenționarea fișei de copiere.
4. **Afișarea barei Acces rapid** (lecția 2, pasul 3): lecția spune doar că în Word-ul nou e ascunsă, nu și cum o afișezi.
5. **Cratima** (lecția 8, pasul 3): e o regulă de scris (fără spații în jur), nu un gest separat. Stă în atenționarea fișei de linie de pauză.
6. **„Puține fonturi, titluri la fel”** (lecția 8, pasul 5): e o regulă. Gesturile cu care o aplici (fontul, mărimea, aldinul) au deja fișe din lecția 6.
7. **Marginile particularizate din lecția 7, pasul 6**: fișa e scrisă din lecția 9, unde pașii sunt mai compleți (ștergi „cm”, virgulă sau punct, mesajele de eroare). În fișa de margini din lecția 7, ele apar doar ca atenționare.
8. **Fila Table Layout (Aspect tabel)** (lecția 7): lecția doar o numește, nu predă niciun gest pe ea.
9. **Ordinea de lucru și bifele** (lecția 9, pasul 6) și verificarea încrucișată cu colegul: sunt un mod de lucru, nu un gest în Word.
10. Ideile fără gest: cele trei feluri de obiecte, ce sunt rândul, coloana și celula (lecția 4), ce e o specificație (lecția 9). Toată lecția 1.

## Nesiguranțe (de văzut la judecată)
- **Fila grupului Paragraf în lecția 6.** La cele 4 fișe de aliniere am scris „grupul Paragraf (Paragraph) de pe fila Pornire (Home)”. Lecția 6 nu numește fila. O spun lecțiile 2 și 8, iar fără ea pasul n-ar spune UNDE e butonul.
- **Definiții luate din altă lecție.** Unele definiții din `termeni` sunt din lecția care a introdus termenul (de exemplu bara de stare și cursorul, din lecția 2), nu din lecția-sursă a fișei.
- **Fișe vecine, pe situații diferite**, pe care un judecător le-ar putea vrea unite:
  - rând nou cu Enter (lecția 2) și loc pentru un rând nou sub un paragraf (lecția 4);
  - repararea rândului după lipire (lecția 5) și paragraful rupt de un Enter (lecția 8);
  - rândul gol (lecția 2) și pagina în plus făcută de rânduri goale (lecția 8).

  Le-am lăsat separate, pentru că elevul le caută cu alte vorbe.
- **Tastele diacriticelor.** Am citit „ă, î, â sunt pe [, ], \\” în ordine: ă pe [, î pe ], â pe \\. Așa e pe tastatura Română (standard), dar lecția le scrie doar ca listă.
- **Două rezultate deduse, nu citate:**
  - „Document1” în bara de titlu a unui document nou. Lecția spune doar că, după salvare, „în loc de Document1 apare numele”.
  - „Panglica revine” după Esc din Mod citire. Lecția spune că Mod citire n-are panglică și că ieși cu Esc.
- **Linia de pauză.** Lecția spune cum o face Word singur doar „pe alte tastaturi” decât Română (standard). Pentru tastatura standard nu dă nicio tastă, așa că nici fișa nu dă.
- **Capturi folosite de mai multe fișe**, fiecare din pasul-sursă al fișei:
  - grupul Font: aldin, cursiv, subliniat;
  - grupul Paragraf: cele 4 alinieri;
  - bara Acces rapid: Ctrl+Z și Ctrl+Y;
  - fereastra Print: previzualizarea și pagina în plus;
  - lista Margins: lecțiile 7 și 9;
  - panglica cu săgeata ↘: panglica și săgeata ↘.
