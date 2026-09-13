# 04 — Ce mediu presupune lecția (U4)

## Ce presupune lecția
- **Trei programe la alegere:** PowerPoint, Paint sau Canva.com (plus Google Slides). Nu declară versiunea, limba interfeței sau sistemul de operare.
- **Interfață în engleză:** „Insert → Shapes”, „Insert → Shapes → Arrow”, „Start → Power → Shut Down”. Nicio denumire în română.
- **Windows:** implicit (Start → Power). **Internet:** da, pentru Canva, Google Slides, pixabay.com. **Cont:** „Canva.com (gratuit)” fără să spună că e nevoie de cont; Google Slides „necesita cont Google”.
- **Format de predare:** PDF. Locul salvării și calea de predare (stick, rețea, e-mail, Classroom): **nespecificate** (`u5_iesire.json` A7: zero apariții pentru Documente/Desktop/stick/folder/rețea/e-mail).

## Comparat cu ce se știe (text brut, 13.09.2026)
| Presupunere | Sursa | Ce spune sursa | Consecință |
|:--|:--|:--|:--|
| Insert → Shapes | `surse/shapes_ro.txt` (support.microsoft.com/ro-RO/PowerPoint/add-shapes) | „Pe fila **Inserare** , faceți clic pe .” (butonul e imagine; en-us: „On the Insert tab, select Shapes”) | în Office în română fila e „Inserare”; lecția ar trebui să scrie „Inserare (Insert) → Forme (Shapes)” — numele „Forme” NU e confirmat pe text brut |
| Start → Power → Shut Down | `surse/shutdown_ro.txt` | „selectați Start și apoi selectați Alimentare > Închidere” | pe Windows în română elevul nu găsește „Power” |
| Paint salvează PDF | `surse/paint_ro.txt` | „vă puteți salva lucrarea în diverse formate de fișier, inclusiv PNG, JPEG, BMP și GIF, printre altele” | PDF nu e numit; „Salvat in format PDF” nu e o bifă realizabilă direct din Paint (pe Windows există imprimarea în PDF, dar nu e predată) — `neclar` |
| Canva gratuit, fără condiții | `surse/canva_about_edu.txt`, `surse/canva_invite_faq.txt` | „Eligible students can only get access if their teacher invites them”; „Teachers need to get parental consent for children below 13”; „Will my students be given their own Canva login? Yes” | elevul de 11 ani nu poate intra singur; profesorul trebuie să creeze clasa și să aibă acordul părinților |
| pixabay.com „gratuite, fara cont” | `surse/raw/pixabay_license.html` | pagina întoarce doar provocarea Cloudflare („Just a moment...”), 16 caractere de text | NEVERIFICAT; și ar cere internet în laborator |
| Office / Paint / LibreOffice în laborator | `B_context_real.md` §3 | NECUNOSCUT (sistem, versiune, limbă, internet, conturi) | tot ce ține de dotare e `depinde_de_necunoscut: true` |
| Programul e predat până la ora asta | `surse/calendar_plan_extras.txt` | editor grafic = orele 18-21 (29.01-19.02.2027); afiș = ora 22 (05.03.2027); PowerPoint = clasa a VI-a | în M1 (oct. 2026) elevul nu are nicio unealtă grafică predată — **fapt cunoscut, nu necunoscut** |

## Randarea mea
Posterul l-am construit cu python-pptx (casete + forme, diapozitiv 16:9) și l-am randat cu LibreOffice (`H_randeaza.py`). Asta probează **conținutul** (încape, se citește, se exportă PDF), nu aspectul exact din PowerPoint și nici cât durează la mâna unui copil.
