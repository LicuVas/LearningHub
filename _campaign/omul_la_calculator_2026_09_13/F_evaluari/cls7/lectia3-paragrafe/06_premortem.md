# 06 — Pre-mortem (U14) și explicații alternative (U13) · lectia3-paragrafe

Schița scrisă după pasul 1 (context proaspăt), completată la pasul 5 cu verificarea făcută.

## Ora de 16.10.2026 (7 MA) / 13.10.2026 (VII A, VII B) a eșuat. De ce?

1. **Nu s-a ajuns la Word.** Ora 6 cuprinde lecțiile 2 ȘI 3; doar citirea atomilor lecției 3 = 43,7 min (5.021 de cuvinte).
   *Verificare făcută:* `u12_sensibilitate.txt` — lecția singură, cu tot: 94,6 min; la ritm dublu 51,3 min. Cu lecția 2 (78,4 min la poartă, JURNAL.md) ora are ~170 min de muncă la ritm normal. **Confirmat.**
2. **Elevii caută „Home”, „Paragraph”, „View”, „Ruler” și au Word în română.** *Verificare:* numele românești există și diferă (Pornire, Paragraf, Vizualizare > riglă, Indentări și spațiere, Agățat, Afișare/Ascundere) — `surse/s01..s03`. Limba din laborator: nu se poate afla fără sală, pentru că nimeni n-a notat limba Office-ului de pe PC-urile elevilor.
3. **Ex.3 îi descurajează pe cei care îl fac cu adevărat:** lecția spune că documentul corectat „arata la fel”; în randare documentul se strânge la 56% din înălțime. *Verificare:* `u3_iesire.json` → ex3 (405 pt vs 225,4 pt; spațiu alb 54,8 vs 9,9 pt), confirmat și aritmetic din setări (101,5 vs 56,5 pt calculat; 101,3 vs 56,4 observat). **Confirmat.**
4. **Elevul care a învățat din atomi „semnătura la dreapta” ezită la Ex.1**, unde se cere semnătura centrată. *Verificare:* ambele citate există în innerText.txt (r.196 și r.1104, 1117). Confirmat în text; cât încurcă la oră = întrebare pentru Vasile.
5. **La Izvoare nu există laborator:** lecția nu are nicio imagine (`grep -c "<img"` = 0) și toate exercițiile cer Word. *Verificare:* 0 imagini; exercițiile 2-3 se pot răspunde pe hârtie (sunt „descrie pașii”), dar elevul n-a văzut niciodată fereastra Paragraf sau rigla. Dacă există un videoproiector la Izvoare nu se poate afla fără sală.

## U13 — pentru semnalările grave, ce altceva ar mai putea fi

**A. „Nu încape în oră”.**
- Alternativa 1: ritmurile de începător din poartă sunt prea lente (provizorii). *Observație discriminantă, făcută:* la ritm dublu tot 51,3 min pentru lecția singură, iar ora conține două lecții → concluzia nu depinde de ritm.
- Alternativa 2: atomii sunt gândiți ca temă acasă. *Observație făcută:* nimic în lecție nu spune asta; butonul „Raspunde ca sa mergi mai departe” și lacătul „Raspunde corect la intrebarile anterioare pentru a continua” (innerText r.1092, r.234) obligă parcurgerea în ordine. Rămâne o decizie de profesor, nu a lecției.

**B. „Ex.3 promite ceva fals («arată la fel»)”.**
- Alternativa 1: randarea LibreOffice diferă de Word. *Observație făcută:* am recalculat pozițiile aritmetic din setările docx (3 rânduri × 15,5 pt, 8 pt după) — diferența de ~45 pt între paragrafe vine din cele două paragrafe goale, nu din motorul de randare; calculul și randarea coincid la 0,2 pt.
- Alternativa 2: documentul colegului avea deja spațiere mare, deci chiar arăta la fel. *Observație:* cerința spune explicit „Spacing After de 10 pt” în locul a „2-3 Enter-uri”; cu 2 Enter-uri spațiul alb e 54,8 pt, cu 3 ar fi mai mare; 10 pt nu poate reproduce asta.

**C. „Ctrl+Alt+V deschide Paste Special” (atomul 9).**
- Alternativa: laboratorul are Word 2021 sau mai vechi, unde scurtătura e cea veche. *Observație:* sursa citată în `surse/s04` spune „There’s no change to Office 2021 and earlier versions.” → versiunea din laborator decide; semnalarea e `depinde_de_necunoscut: true`.
