# Modificări în `jocuri\audio-video-vii\index.html` (15.09.2026)

Copia dinainte: `index.before.html` (în acest folder). `diff` arată exact 5 rânduri schimbate. Poarta după: `[TRECUT] audio-video-vii · întrebări jucate: 70 · diacritice/1000: 67.0`.

| # | semnalare | înainte | după | de ce | dovada |
|---|---|---|---|---|---|
| 1 | S02 | `În orice editor găsești patru zone:` | `Într-un editor video găsești, de obicei, patru zone:` | fapt fals: editoarele audio (Audacity, folosit în lecția LearningHub a unității) nu au bibliotecă de materiale și previzualizare | `content\tic\cls7\extra-multimedia\lectia4-audio.html` (Audacity: „File → Export → Export as MP3”) |
| 2 | S03 | `De aceea, un fișier comprimat iar și iar sună tot mai rău.` | `De aceea, un fișier comprimat cu pierderi iar și iar sună tot mai rău.` | fraza urma direct după FLAC/ZIP; pentru comprimarea fără pierderi afirmația e falsă | definiția de pe aceeași pagină („se desface identic, bit cu bit”); captura `capturi\iPhone_SE_dark_citire_formate.png` |
| 3 | S04 | why: `Așa ajunge de aproape zece ori mai mic decât un WAV.` | `Așa ajunge de vreo zece ori mai mic decât un WAV.` | cifră recalculată: raportul e 11, „aproape zece” înseamnă sub 10 | 44100×16×2×60/8 = 10 584 000 octeți; 128 000×60/8 = 960 000 octeți; 10 584 000/960 000 = 11,025 |
| 4 | S05 | `Des, <strong>tăietura simplă</strong> e cea mai bună.` | `Adesea, <strong>tăietura simplă</strong> e cea mai bună.` | greșeală de limbă (adverb stângaci la început de propoziție) | citit |
| 5 | S01 | intro: `tai și ordonezi clipuri adevărate` | `tai și ordonezi clipuri ca într-un editor adevărat` | afirmație falsă despre joc: clipurile sunt simulate | configurația `clipuri:[{…bucati:[[0,3,'liniște…','x']…]}]` |

Nimic altceva nu a fost atins (fără `_motor\`, alte jocuri, `index.html` al colecției, `catalog.js`; fără commit).
