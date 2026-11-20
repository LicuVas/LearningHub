# Runda 19 · B-explorer · CONTRA (înainte de hotărâre)

## Planul
1. **E1, comun** (`aplicatii.js › nesimulat`): mesajul rămâne sub rădăcină; un `MutationObserver` pe rădăcină (doar `childList`,
   pornit numai când există un mesaj, oprit când expiră) îl pune înapoi dacă a fost scos de o REDESENARE: în același lot de
   mutații rădăcina a primit noduri noi, mesajul n-a expirat și nu l-a înlocuit alt mesaj. Un `m.remove()` singur (expirarea,
   un mesaj nou al aplicației, o probă care curăță) nu e redesenare și e respectat.
2. **E2, Explorer**: `blur`-ul casetei venit în cel mult 800 ms după un `pointerup` de atingere, fără niciun `pointerdown` nou între
   ele (= `mousedown`-ul de compatibilitate al aceleiași atingeri), nu încheie redenumirea: focusul se întoarce în casetă. Clicul /
   atingerea ÎN casetă nu mai redesenează lista (ar reseta textul scris).
3. **Tastatura**: Alt+Enter = „Proprietăți” (mesajul central, cum e și în meniu), nu Enter; Ctrl+Shift+C cu un element ales =
   „Copiere ca o cale” (mesajul central, cum e și în meniu).

## Cel mai puternic argument PENTRU
- E o singură reparație comună, mică (o funcție), care face R12 adevărat pentru ORICE aplicație care își redesenează rădăcina
  (Explorer azi, Windows dacă ajunge acolo) fără ca aplicația să știe de mesaj; aplicațiile care nu rescriu rădăcina nu văd nicio
  schimbare (observatorul e inert: lotul fără noduri adăugate nu face nimic, iar fără mesaj nu există observator).
- Reparația E2 nu schimbă nimic pe mouse (cu mouse-ul `mousedown` vine ÎNAINTEA `pointerup`, deci fereastra de 800 ms nu se
  deschide; pointerType = mouse) și lasă intactă încheierea prin atingere / clic în altă parte (acolo vine un `pointerdown` nou).

## Cel mai puternic argument ÎMPOTRIVĂ
- Un observator care „reînvie” un nod e magie: dacă o aplicație vrea să-și ascundă mesajul la o redesenare (ex. la închiderea
  unui dialog), nu mai poate decât cu `m.remove()` explicit. Și: mesajul supraviețuiește acum ORICĂREI redesenări în 5 s, deci și
  după ce elevul a făcut altceva (la Word e la fel azi, deci e consecvent, dar în Explorer e nou).
- Alternativa „curată” (fiecare aplicație își repune mesajul după `deseneaza()`) cere atingerea fiecărei aplicații, iar Windows
  (r22) nu e al meu.

## Adevărul incomod (punctul cel mai puțin sigur)
- Fereastra de 800 ms pentru E2 e dedusă din ordinea evenimentelor din Chromium (Pointer Events: `mousedown`-ul de compatibilitate
  vine după `pointerup`); pe Safari iOS ordinea și momentul pot diferi, iar dacă focusul pleacă mai târziu de 800 ms caseta se
  închide la fel. Proba e doar headless Chromium (`page.touchscreen`, CDP `Input.insertText`), nu un telefon adevărat; deschiderea
  tastaturii virtuale la `focus()` programatic nu se poate dovedi headless → NESIGUR în raport.

## Hotărârea
Merg pe plan: argumentul ÎMPOTRIVĂ e acceptabil pentru că (a) regula „doar dacă lotul a adus noduri noi” lasă `m.remove()` explicit
să funcționeze, (b) durata e aceeași cu cea de azi a Word / Excel / PowerPoint (5 s, 60 s în modul scenariu), (c) regresul pe Word /
Excel / PowerPoint / Windows se măsoară (2 gesturi nesimulate fiecare). Pentru E2 adaug în probă și atingerea în afară, Esc,
Redenumire din bară și F2, pe 360 și 390 px, plus drumul cu mouse-ul la 1366.
