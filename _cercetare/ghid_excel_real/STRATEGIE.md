# Ghid peste aplicația REALĂ (Excel / Google Sheets) — informații + strategie

> Scris 25.09.2026 seara, după prototipul din acest dosar. Cererea lui Vasile: „să-i învățăm pe elevi să folosească
> efectiv aplicațiile reale (Excel, Google Sheets) — ca la tutoriale, cu zone evidențiate pe aplicație unde să dea
> clic, eventual să introducă ceva”.

## 1. Cele trei variante cântărite

| Variantă | Cum | Plus | Minus |
|---|---|---|---|
| **A. Program peste Excel desktop** (ALES) | fereastră transparentă deasupra Excel: chenar pe țintă + balon; citește Excel prin COM | aplicația reală, exact ce folosesc; merge offline | trebuie pus pe fiecare PC (stick / folder comun) |
| B. Extensie Chrome peste Google Sheets | extensia evidențiază meniuri/bara de formule (sunt HTML); grila e desen (canvas) → celula selectată se citește din caseta de nume | fără instalare de program | extensie pe fiecare Chrome + elev logat cu cont Google |
| C. Fișier .xlsm cu macro-uri | panou de pași în fișier, urmărește celulele prin evenimente; filă proprie „Lecția” în panglică | zero instalare | NU poate evidenția panglica normală; macro-urile sunt des blocate („Enable Content”) |

Recomandare: **A pentru laborator**, simulatorul de pe site (`jocuri\excel-pas-cu-pas-viii\`, motorul `tip-excel.js`) pentru acasă.
B rămâne rezervă dacă o școală are doar Google.

## 2. Ce am aflat (MĂSURAT pe PC-ul lui, 25.09.2026)

1. **Butoanele din panglică au ID Microsoft stabil în UI Automation** (`automation_id`): `TabHome`, `TabInsert`,
   `TabFormulas`, `AutoSum`, `Bold`, `SortFilterMenu`… = numele „idMso”. **Nu depind de limba Office** → problema RO/EN
   ([[project_laboratoare_tic_dotare]]) dispare pentru butoane. Căutarea tuturor elementelor: ~1,5 s; căutarea unui singur ID: rapidă.
2. **Poziția celulelor pe ecran:** `ActiveWindow.PointsToScreenPixelsX/Y` din COM **greșește** (socotește 1 punct = 1 pixel,
   iar când foaia e derulată eroarea e de 30-40 px, diferită cu zoom-ul). Soluția bună: **antetele de coloană (A, B…) și de rând
   (1, 2…) raportate prin UIA** (`DataItem`) → marginile exacte. Se recitesc doar când se schimbă zoom/derulare/fereastră (~1 s).
3. **Oracol independent pentru poziții:** selectezi celula prin COM, Excel desenează chenarul verde (#107C41), îl găsești în
   captură și compari. Rezultat: abatere ≤ 2 px (grosimea chenarului) la zoom 75/100/150 + derulat → `oracol_pozitii.py` = 0.
4. **Tkinter, capcane:**
   - procesul trebuie `SetProcessDpiAwareness(2)` ÎNAINTE de Tk, altfel coordonatele nu bat cu UIA;
   - fereastra-balon rămânea la 0,0 (Tk o punea înapoi la schimbarea textului) → se mută cu `win32gui.SetWindowPos`
     și se verifică la fiecare tic locul REAL (`GetWindowRect`); `ctypes` cu `-1` (HWND_TOPMOST) NU merge pe 64 de biți;
   - chenarul = 4 benzi subțiri (nu un dreptunghi plin) → nu acoperă ținta, clicul ajunge în Excel;
   - `WS_EX_NOACTIVATE | WS_EX_TOOLWINDOW` ca să nu fure focusul de la Excel; benzile au și `WS_EX_TRANSPARENT`.
5. **Cât timp elevul scrie în celulă, Excel refuză apelurile COM** (`com_error`) → ghidul arată „apasă Enter când ai terminat”
   și reîncearcă. Ramura asta e NETESTATĂ cu mână reală.
6. Ghidul pornește **propria instanță** Excel (`DispatchEx`) — nu atinge Excel-urile deja deschise. Atenție la testele care
   crapă: instanța rămâne deschisă (s-a întâmplat; verifici cu `Get-Process EXCEL` + StartTime).

## 3. Ce există (prototipul)

- `ghid_excel.py` — ghidul; lecția = lista `PASI` (titlu, text, țintă `("celula","A2:A6")` sau `("buton","AutoSum","TabHome")`,
  funcția `gata` care citește Excel prin COM).
- `porneste_ghidul.bat` — dublu-clic.
- `proba_ghid.py` — elev simulat prin COM + capturi în `capturi\`; ultima linie = pași blocați (azi 0).
- `oracol_pozitii.py` — oracolul pozițiilor (azi 0).

## 4. Strategia — pașii următori, în ordine

1. **Proba cu mâna lui** pe `porneste_ghidul.bat` (clic real pe AutoSum, scris în celulă). Ce nu merge → reparat.
2. **Lecțiile din fișier, nu din cod:** `lectii\*.yaml` (sau json) cu pașii; tipuri de verificare gata făcute
   (valoare în celulă, formulă conține X, celula activă, format bold/culoare, filă activă). Profesorul scrie o lecție fără Python.
3. **Pachet pentru școală:** un singur `.exe` (PyInstaller) pe stick / folder comun. De verificat ÎNTÂI pe un PC de școală:
   pornește un .exe necunoscut? (antivirus/SmartScreen/cont restricționat). *Presupunere neverificată: PC-urile școlii nu au Python.*
4. **Proba pe Office ROMÂNESC** (PC de școală sau VM): ID-urile ar trebui să fie aceleași — de confirmat cu `ghid_excel.py`.
5. **Balon mai inteligent:** să nu acopere butoanele din vecinătatea țintei (azi la AutoSum acoperă Fill/Clear/Sort).
6. **Legătura cu LearningHub:** la final ghidul poate trimite rezultatul în evidența activității ([[project_evidenta_activitate]]),
   cu numele elevului + clasa; și din simulator („exersează acasă”) → în laborator („fă-o în Excel-ul adevărat”).
7. Extindere: Word și PowerPoint au aceeași panglică → același mecanism (ID-uri idMso). Google Sheets = varianta B, doar la nevoie.

Timp estimat: pasul 2 + 3 ≈ o sesiune de 2–3 ore; pasul 4 depinde de accesul la un PC cu Office RO.
