# Autor „m2 audio + evaluări” — VII/11 (Audacity, Clipchamp), VI/10, VII/10 (11.10.2026)

Fișierul: `cum-fac/_sursa/fise_m2_audio_evaluari.json` · **17 fișe** (16 `audio`, 1 `windows`) · verificatorul
(`node cum-fac/_build/valideaza_fise.mjs fise_m2_audio_evaluari.json`) → ultima linie **0**; pe toate fișierele
(302 fișe) → **0**.

| Lecția | Fișe | Ce acoperă |
|---|---|---|
| VII/11 | 17 | Audacity: pornire, deschiderea sunetului (Fișier › Deschide…, Ctrl+O), zonele ferestrei, unda (sunet/liniște), linia de timp (la ce secundă), lupele Mărește/Micșorează, mutarea capului de redare, afișajul timpului, Redare, Pauză (Audacity 4 vs 3), Stop, |◀ / ▶|, închiderea cu Nu salva · Clipchamp: zonele, capul de redare (clic pe riglă), ▶ sub previzualizare · Windows: ștergerea sunetului din Descărcări |
| VI/10 | 0 | toate gesturile din probă au deja fișe (lista de mai jos) |
| VII/10 | 0 | toate gesturile din probă au deja fișe (lista de mai jos) |

Cum sunt făcute: `_campaign/cum_fac_2026_10/_unelte/m2/autor_audio/fise_audio.py` scrie fișierul. Din digest
completează `sursa.titlu_pas`, `clasa`, `lectia` și capturile (alt, w, h). Verifică singur ancora literală, titlul ≤ 70
și formulările: fără diacritice, nerepetate în fișier și nici în celelalte `fise_*.json`.
Proba de căutare (`proba_cautare.cjs`, 16 întrebări de copil scrise de mine) dă 15/16 pe locul 1.

## De știut pentru dirijor
1. **`windows-stergere-fisier-descarcat`** (aplicatie `windows`, sursa VII/11, pasul „în aplicația adevărată”, punctul 10):
   catalogul nu avea niciun gest de ștergere a unui fișier. E gestul de laborator „Lasă calculatorul cum l-ai găsit”
   (regula 9), așa că l-am făcut aici. Dacă îl vreți în fișierul autorului Windows, se mută așa cum e.
2. **Captura `audacity-nu-salva.webp`** (fișa `audio-audacity-inchidere-fara-salvare`) e din pasul „în aplicația adevărată”,
   punctul 9. Digestul nu extrage capturile acelui pas. Alt-ul și legenda sunt copiate din `lectii/vii/m2-l11/index.html`
   (`NU_SALVA=fig(...)`).
3. **Clipchamp**: lecția spune „Azi îl recunoști din poze și din simulator” (cere cont Microsoft). Fișele scriu doar ce
   spune lecția despre aplicația reală (zonele, clic pe riglă, ▶ sub previzualizare, fără ■). Lecția nu spune ce fac
   ↺5/↻5, cum oprești filmul și nici cum pornești Clipchamp, așa că nici fișele nu spun.
4. **Numele butoanelor |◀ și ▶|** („Început”, „Sfârșit”) sunt luate din alt-ul capturii reale `audacity-butoane.webp`.
   Lecția scrie doar „duc capul la începutul și la capătul sunetului”.
5. **Pentru inginer**: „ce inseamna 00h00m03.60s” nu găsește nimic (`gasit=false`), fiindcă o valoare de afișaj cu
   alte cifre nu se potrivește cu `00h00m02.30s` din fișă. `sensuri.json` nu are „melodie/cântec/muzică ↔ sunet”.
   Le-am pus doar ca formulări; nu ating sensurile.

## VII/11: ce n-a primit fișă separată, și de ce
- **Descărcarea sunetului** (p2 „Uite cum”): există deja `windows-browser-descarcare-fisier`.
- **Deschiderea Explorer** (punctul 10): există deja `windows-deschidere-explorer`; fișa de ștergere trimite spre ea.
- **„Asculți doar o bucată”** (p5, punctul 6): e Redare + Stop. E un pas în `audio-audacity-stop`, nu o fișă separată.
- **p1** (ce e o aplicație audio / audio-video): nu e gest.

## VI/10 (prezentări): gesturile din probă, toate cu fișă
- Descarci fotografia → `windows-browser-descarcare-fisier`
- PowerPoint, Prezentare necompletată → `powerpoint-prezentare-noua-goala`
- Click to add title / subtitle → `powerpoint-scrii-in-substituent`
- Ctrl+S, numele cu clasa, Documents → `powerpoint-salvare-prima-data`
- More options › Browse → `powerpoint-salvare-alt-folder`
- „already exists” → Anulare → `powerpoint-salvare-prima-data` (în `atentie`)
- Diapozitiv nou → `powerpoint-diapozitiv-nou`
- „of 4” în bara de stare → `powerpoint-fereastra-zone`
- Two Content + imaginea → `powerpoint-imagine-langa-text`, `powerpoint-aspect-diapozitiv`, `powerpoint-imagine-din-fisier`
- Arrow: Right → `powerpoint-forma`
- Ștergi diapozitivul în plus → `powerpoint-stergi-diapozitiv`
- Fade + Durată 0,5 + Apply To All → `powerpoint-tranzitie`, `powerpoint-tranzitie-durata`, `powerpoint-tranzitie-toate`
- Animația La clic → `powerpoint-animatie`, `powerpoint-animatie-pornire`
- Motivul în note → `powerpoint-note-scrii`
- F5, clic, Esc → `powerpoint-expunere-de-la-inceput`, `powerpoint-expunere-inainte-inapoi`, `powerpoint-expunere-iesire`
- ✕ și Save → `powerpoint-inchizi-powerpoint`

Fără gest, deci fără fișă: lista de bife pe foaie, grila (punctele, oficiul, nota), animația „justificată” (motivul) și
susținerea (ce spui).

## VII/10 (tehnoredactare): gesturile din probă, toate cu fișă
- Documentul descărcat → `word-deschidere-fisier-descarcat`
- Activare editare → `word-activare-editare`
- Print Layout → `word-vizualizare-aspect`
- ¶ → `word-afisare-semne-paragraf`
- Ctrl+P, „1 of 2”, Esc → `word-previzualizare-imprimare`
- Selectezi trăgând → `word-selectare-text-tragand`
- B / Ctrl+B → `word-aldin`
- Mărimea → `word-marime-font`
- Center / Ctrl+E → `word-aliniere-centrat`
- Justify → `word-aliniere-stanga-dreapta`
- Verifici fontul, mărimea și B/Center aprinse → `word-aflu-font-marime`
- Clic la capătul rândului + Enter → `word-rand-nou-sub-paragraf`
- Poza → `word-inserare-imagine`
- Tabelul 2x3 → `word-inserare-tabel`
- Tab între celule → `word-tabel-scriere-tab`
- Margini de 2 cm → `word-margini-particularizate`
- Citești marginile → `word-aflu-margini-foaie`
- Poza de 6 cm, nedeformată → `word-redimensionare-imagine`
- Citești lățimea → `word-aflu-dimensiune-poza`
- Poza la mijloc → `word-centrare-poza`
- Grid Table 4 → `word-stil-tabel`
- Header Row → `word-rand-antet-tabel`
- First line 1,25 cm → `word-alineat-primul-rand`
- Spațiile lângă semne → `word-reparare-spatii`
- Paragraful rupt → `word-unire-paragraf-rupt`
- Rândurile goale de la sfârșit → `word-pagina-in-plus-randuri-goale`
- Semnătura cu Align Right → `word-aliniere-dreapta`
- Page 1 of 1 → `word-numar-cuvinte-pagini`
- Landscape → `word-orientare-pagina`
- Zoom 200% → `word-zoom`
- F12 + nume → `word-salvare-ca-copie`, `word-nume-fisier-laborator`
- „already exists” → `word-fisier-exista-deja`
- Ctrl+W → `word-inchidere-document`
- Ctrl+O, Recente → `word-deschidere-recente`
- ✕ → `word-inchidere-word`

Fără gest, deci fără fișă: părțile C/B/A, punctajul și nota, nivelul citit din notă, explicația scrisă în caiet. Lista
„Înainte să predai” (p6) leagă patru gesturi care au deja fișă (`word-aflu-*`, `word-afisare-semne-paragraf`,
`word-previzualizare-imprimare`, `word-numar-cuvinte-pagini`), deci nu e un gest nou. O formulare care ar ajuta în
fișierul altui autor (nu l-am atins): „cum verific lucrarea inainte sa predau” → `word-aflu-font-marime`.
