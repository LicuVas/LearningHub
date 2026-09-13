# 04 — Mediul presupus de lecție (U4)

## Ce presupune lecția
| Aspect | Ce reiese din text | Dovada |
|:--|:--|:--|
| Program | Microsoft PowerPoint desktop (Slide Master, gradient cu direcții, Header & Footer); pomenește și Google Slides în „Încearcă tu” | „Deschide PowerPoint sau Google Slides”; atomii 5 și 7 |
| Versiune | Office 2016+ / Microsoft 365 (nota despre Celestial/Metropolitan care „pot lipsi în Office 2013/2016”) | innerText r. 636 |
| Limba interfeței | **engleză**: Home, New Slide, Design, View, Slide Master, Close Master View, Format Background, Gradient fill, Apply to All, Insert, Header & Footer, Title Slide, Two Content, Comparison, Title Only, Picture with Caption | `u3_iesire.json` → `termeni_en` |
| Windows | da (click dreapta, Ctrl+…) | — |
| Internet | Ex.3 (SlideShare), eventual imagini la Ex.1/Ex.4 | — |
| Alt program | Word pentru raportul din Ex.3 | „Scrie un mini-raport de 1 pagina in Word” |

## Ce se știe (13.09.2026)
- Laboratorul: sala „1 (TIC)” la Brauner există; versiunea Office, limba, internetul — **necunoscute** (`B_context_real.md` §3). La Izvoare, ipoteza de lucru: fără laborator.
- Office-ul lui Vasile e în engleză — nu spune nimic despre laborator.

## Numele românești, verificate pe text brut Microsoft (curl, nu WebFetch)
| În lecție (en) | În română (Microsoft ro-ro) | Fișierul cu citatul |
|:--|:--|:--|
| Home → New Slide | fila Pornire → Diapozitiv nou | `surse/s_diapozitiv_nou.txt` |
| Duplicate Slide | Dublare diapozitiv | `surse/s_dublare.txt` |
| panoul din stânga | panoul de miniaturi (≠ vizualizarea Sortare diapozitive) | `surse/s_panou_miniaturi.txt` |
| Design → Format Background | fila Proiectare → Formatare fundal | `surse/s_fundal.txt` |
| Solid / Gradient / Pattern fill | Umplere solidă / Umplere gradient / Umplere model | `surse/s_fundal.txt` |
| Apply to All | Se aplică pentru toate | `surse/s_fundal.txt` |
| View → Slide Master | fila Coordonator de diapozitive (vizualizarea Coordonator de diapozitive) | `surse/s_coordonator.txt` |
| Close Master View | Închidere vizualizare coordonator | `surse/s_coordonator.txt` |
| Insert → Header & Footer | Inserare → Antet și subsol, fila Diapozitiv, caseta Subsol | `surse/s_antet_subsol.txt` |
| Layout; Title Slide; Title and Content | Aspect; Titlu; Titlu și conținut | `surse/s_aspecte.txt` |
| Two Content, Comparison, Title Only, Picture with Caption | **NECONFIRMAT** (nu apar în textul brut descărcat) | `03_pasi.json` pas 10 |
| teme Ion, Facet, Organic, Basis, Integral… | temele au **nume traduse** în română: „tema Bază”, „tema Integrală” | `surse/s_teme.txt` |
| Linear Diagonal - Top Left to Bottom Right | **NECONFIRMAT** (nu apare în paginile despre fundal) | `u12_sensibilitate.txt` |

Atenție: documentația însăși are inconsecvențe de traducere („Aspect de diapozitiv de pornire >” pentru Home > Slide Layout). Ce vede elevul se află doar pe PC-ul din laborator.

## Scurtături (text brut, `surse/s_dublare.txt`)
- Ctrl+M = diapozitiv nou — **corect** (confirmat ro și en).
- Pentru copia diapozitivului selectat documentația dă **Ctrl+Shift+D**; **Ctrl+D** e trecut la „Dublați obiectele selectate”. Lecția predă Ctrl+D ca „cea mai rapidă metodă de duplicare” a diapozitivului. Dacă Ctrl+D funcționează și pe miniatura selectată se vede doar în program → semnalare `minor`, `depinde_de_necunoscut: true`.

## PowerPoint pentru web / Google Slides
Pagina Microsoft despre fundal spune că în varianta web gradientul nu e disponibil pentru fundal („To do more advanced formatting, such as adding a color gradient ... use the desktop version”, `surse/raw/fundal_en.txt`). Deci un laborator cu PowerPoint online nu poate face cerința „gradient personalizat” din Ex.1. Google Slides nu a fost verificat; cere cont Google.

## Concluzie
Lecția e scrisă pentru PowerPoint desktop în engleză. Tastatura (Ctrl+M, Ctrl+Z, Delete, tragerea miniaturilor) e aceeași în ambele limbi și poate rămâne drumul principal; numele de comenzi trebuie date în ambele limbi: „Formatare fundal (Format Background)”.
