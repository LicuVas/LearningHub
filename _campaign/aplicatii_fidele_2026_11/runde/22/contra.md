# Runda 22 — contra (scris înainte de reparații)

## Planul
- **W1:** meniul desktopului din `ferestre[0]`, cu fundalul calculat din rânduri.
- **W4:** dosarul galben, desenat de noi, plus indiciul cu numele la trecerea mouse-ului. Montarea Explorer-ului se cere prin `A22-1`.
- **W3:** tastarea în Start merge în caseta de căutare.
  - Rezultatele sunt aplicațiile cu nume potrivit.
  - Enter sau clic pornește aplicația: o fereastră generică, cu butonul ei în bară.
  - Fără potrivire apare mesajul central.
- **W2:** „Toate” ia cele 7 categorii din `start_toate`, cu aceeași derulare ca în referință.
  - Tab duce la Fixate, săgețile mută focusul, iar lista urmează focusul.
- **W5:** pe telefon:
  - fereastra se încadrează în ecran;
  - bara de titlu se poate glisa;
  - banda din bară e așezată după lățimile desenate.

## Cel mai puternic argument PENTRU
Fiecare GRAV are o cauză numită la `fișier:rând` și o referință care spune ce trebuie:
- W1: `meniu_desktop › ferestre[0]` = 304×385;
- W2: `start_toate`, 7 categorii;
- W3 și tastatura W2: pagina Microsoft despre Start, cu citat.

Toate reparațiile stau în fișierele benzii, deci celelalte aplicații nu se pot strica. Proba de pornire are 35 de picări, iar fiecare are o verificare pe gest real care trebuie să treacă.

## Cel mai puternic argument ÎMPOTRIVĂ
W3 și W4 adaugă comportament pentru care referința UIA nu are nimic:
- panoul de rezultate;
- fereastra aplicației pornite (Paint, Calculator nu sunt în bibliotecă);
- forma pictogramei;
- indiciul de la trecerea mouse-ului.

Un critic pe aspect ar putea spune că inventăm interfață. Mai mult, fereastra „Paint” e goală: elevul ar putea crede că a pornit Paint, apoi să nu găsească nimic de desenat.

## Adevărul incomod
Punctul cel mai puțin sigur este W3, adică ce vede elevul după „pai”.
- **Ce e sigur:** pagina Microsoft spune doar că rezultatele se actualizează pe măsură ce scrii, că sunt grupate în aplicații / documente / web, că săgețile Sus/Jos le parcurg și că Enter îl deschide pe cel ales.
- **Ce nu știm:** aspectul panoului (de exemplu „Cea mai bună potrivire” în dreapta) nu e capturat.

**Hotărârea:**
- panoul de rezultate e o listă simplă, fără titluri inventate, cu rândul `R22-1` în `de_verificat.md`;
- fereastra pornită e cea generică deja existentă (`R18-4`), cu mesajul central „aici nu e simulată” pentru conținutul ei.

Elevul poate duce la capăt drumul din lecție (pornește → minimizează → readuce din bară → închide), dar nu primește o aplicație inventată.

**De ce aleg asta:** varianta „doar mesaj” lasă drumul lecției neterminabil. Varianta „Paint desenat” ar fi o interfață fără referință.
