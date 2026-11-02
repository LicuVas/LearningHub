# Dimineața 03.11.2026 — V/28 și V/29 (lucrate seara 02.11, 19:53 → 23:45)

## FĂCUT
- **V/28 „Structura secvențială (liniară). Descriere în limbaj natural”** — LIVE: https://learninghub-8z6.pages.dev/lectii/v/m4-l28/ (în plan: 16.04.2027). Elevul pune pașii pregătirii ghiozdanului în ordine, iar un robot îi execută exact cum sunt scriși. Robotul se oprește la pasul greșit și spune de ce. Apoi elevul urmărește un algoritm cu date: citește → calculează și pune rezultatul în cutie → afișează, într-un tabel completat pas cu pas. Laboratorul: algoritmul scris în Notepad și salvat, iar la sfârșitul orei elevul închide Notepad și își șterge doar fișierul lui.
- **V/29 „Structura alternativă (decizia). Urmăresc algoritmul pas cu pas”** — LIVE: https://learninghub-8z6.pages.dev/lectii/v/m4-l29/ (în plan: 23.04.2027). Decizia „Dacă … atunci … altfel …”. Elevul completează tabelul de urmărire întâi împreună cu pagina, apoi singur, pe două seturi de date care merg pe drumuri diferite, și compară traseele. Laboratorul e în Explorer, la „Acest PC” („… liber din …”), doar citire: nu se creează și nu se șterge nimic.
- **Dovezi:** commitul `c4b47656` (02.11, 23:42), trimis pe server. Scriptul de publicare a verificat live: conținutul e identic, iar trecerea prin lecție la 390 px și la 1280 px are 0 erori. Am verificat și eu cu `curl`: fiecare pagină live își încarcă simulatorul. Modulul 4: **17 lecții publicate** (erau 15).
- **Verificarea:** fiecare lecție a trecut prin 3 judecăți independente, plus reparațiile dintre ele. La a treia judecată: **0 greșeli grave, 0 mari**. Cele 3 mărunțișuri rămase le-am reparat eu, cu reparația exactă dată de judecător, și am verificat-o. Sunt scrise în `_verificare\judecator3.md`.

## NEFĂCUT (așteaptă decizia ta)
- **VII/24+ și VIII/24+:** C++ sau Python?
- **VI/27+:** ce aplicație de animație?
- **V/30** (evaluarea sumativă „algoritmi în limbaj natural”) e următoarea lecție la a V-a. Nu cere nicio decizie de la tine, dar n-a intrat în lucrarea asta. O pornesc când îmi spui.

## NESIGUR (de văzut la clasă)
- **Durata la elevul lent:** V/28 ar lua ~53 de minute (citit lent, 80 de cuvinte pe minut) și ~46 la ritm obișnuit. V/29 ia ~50, respectiv ~43. Merită cronometrate la clasă.
- **Notepad** nu l-am pornit (regula de noapte), așa că faptele vin din lecția V/15. Pe Windows 10, butonul se poate numi „Nu salva” în loc de „Nu salvați”, iar Notepad nu are file. Pagina le dă pe amândouă.
- **Explorer, „Acest PC”:** pe calculatoarele din laborator textul poate fi „liberi din” (Windows 10), iar discul C: poate avea alt nume. Pagina are ieșiri pentru toate acestea și un număr de rezervă (198) pentru cine nu vede nimic.
- **De verificat de tine în panou:** **2 elevi** care au lucrat ieri au un nume care nu se potrivește cu catalogul. Erau 2 și la pornire și nu vin din probele mele. Numele nu le scriu în fișiere.

## Am hotărât singur
1. V/28 și V/29 sunt în limbaj natural, fără aplicație de programare (Scratch vine mai târziu).
2. La V/29, în tabel, valorile care nu se schimbă apar deja scrise, cu gri și înclinat, iar elevul scrie doar ce schimbă pasul. La V/28 elevul scrie toate cutiile. V/28 învață tabelul întreg, V/29 se concentrează pe condiție, iar pagina spune limpede asta.
3. Pașii rămân scriși „Pasul 1.” la V/29, ca la V/24-26. V/28 folosește ambele forme („Pasul 1.” și „1.”).
4. La V/28, săgeata `←` apare o singură dată, doar ca să fie recunoscută. N-am mutat-o într-un exercițiu opțional.
5. Am reparat eu, după a treia judecată, trei lucruri mici: un rând din `surse.md` al V/29 și două mărunțișuri în simulatorul V/28. Primul: simulatorul primește și „20 − 6 (14)”. Al doilea: datele se scriu „Se dau 20 pentru «bani»…”, ca în V/29. Totul e scris în `judecator3.md`, cu probele.

## Cât a costat
Bugetul pe 7 zile a crescut de la 1 % la 7 %. Contextul dirijorului (cât „ține minte” sesiunea care conduce lucrarea) era 228k din 250k la 23:44. La 23:54 a trecut de prag (254k): dirijorul a scris singur o notă de predare și a dat lucrarea unei sesiuni noi, care a închis verificarea finală. Pe lucrarea asta, nicio sesiune-dirijor n-a trecut de 258k. Dovezile sunt în `_dirijor\p10_dovezi_R3.md`. Verificarea finală de mai jos a avut 3 rulări, cu 25 de agenți în total.

## Verificarea finală (T1)
Un agent care n-a lucrat la lecții scrie întrebările de verificare. Alți agenți caută răspunsurile pe disc și pe site, iar un script decide ce e FĂCUT, numai pe baza dovezilor citite atunci. Printre întrebări e și un **canar**: o întrebare-capcană la care singurul răspuns corect e „nu există”. Dacă un verificator bifează fără să citească, canarul îl prinde.
- **Rularea 1 (23:46 → 23:53):** 11 întrebări, **9 FĂCUT**, canarul trecut. Au rămas deschise două.
- **P1, „ce e pe site nu e identic cu ce e pe disc”:** diferența era doar sfârșitul de rând. Windows ține pe disc un caracter în plus la capătul fiecărui rând (CR), iar site-ul primește fișierul din git, fără el. Am comparat ce e live cu fișierul publicat în git: toate 4 fișierele (cele 2 pagini și cele 2 simulatoare) sunt identice. Proba e `_dirijor\p1_sha1_live_vs_git.sh` (ultima linie 0). **Închis**: FĂCUT la reluarea 1.
- **P10, „predarea ștafetei” (R3 din contract):** raportul spunea că n-a fost nevoie de predare, dar la 23:54 dirijorul a trecut de prag și a predat singur. Am corectat raportul, jurnalul și fișa de memorie, cu măsurătorile din transcript. Reluarea 1: 3 din 4 FĂCUT. A patra întrebare (jurnalul și fișa aveau încă fraza veche) am reparat-o, iar reluarea 2 a ieșit **CURAT**.
- **De știut:** la reluarea 2, agentul a scris întrebările din nou, așa că „P4” de acolo a verificat raportul, nu jurnalul și fișa. Corecția din jurnal (rândul 00:04) și pe cea din fișă le-am verificat eu, pe disc.
