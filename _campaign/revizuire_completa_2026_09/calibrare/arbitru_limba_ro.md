# Arbitrul definitiv: panglica reală în română, citită automat

**Data:** 27.09.2026. Am făcut doar investigație: n-am instalat nimic, n-am schimbat registrul și nici setările Office.

## Pe scurt

**Se poate, gratuit.** Pachetul de limbă română se adaugă peste Office-ul de pe acest PC. Apoi un program poate citi panglica românească (numele filelor, grupurilor și butoanelor) pe desktopul ascuns, fără ca profesorul să vadă ceva.

Sunt însă **două condiții**:

1. **Înainte de instalare**, trebuie fixată engleza ca limbă preferată în Office. Motivul e explicat la „Ce se schimbă pentru profesor”.
2. Excel-ul de citire pornește în română printr-o comutare scurtă a unei setări (~10 secunde), făcută automat și anulată imediat. Metoda e descrisă mai jos, dar partea cu comutarea **n-am putut-o proba**, pentru că pachetul nu e instalat.

## Ce e instalat acum (citit din registru)

| Ce | Valoare |
|---|---|
| Produs | Microsoft Office Professional Plus **2021**, licență Retail (`ProductReleaseIds = ProPlus2021Retail`) |
| Tip instalare | **Click-to-Run** (`HKLM\SOFTWARE\Microsoft\Office\ClickToRun\Configuration` există) |
| Versiune | 16.0.20326.20158, pe 64 de biți (`Platform = x64`) |
| Canal de actualizare | Current Channel (`AudienceData = Production::CC`, CDN 492350f6-…) |
| Limbi Office instalate | doar **en-us** (în plus, folderele 1036 și 3082 conțin doar instrumentele de corectură franceză și spaniolă, care vin implicit cu engleza) |
| Limba de afișare Office (utilizatorul <utilizator>) | `HKCU\…\Office\16.0\Common\LanguageResources\UILanguageTag = en-us`; limba de editare preferată = ro-RO |
| Limba Windows | **ro-RO** (afișare, format regional, localizare sistem) |
| Politici de limbă Office | niciuna (`HKCU\Software\Policies\…\LanguageResources` nu există) |

## Pachetul de limbă română

**Este gratuit și se aplică la Office 2021.** Pagina Microsoft „Language Accessory Pack for Microsoft 365” listează Excel, Word și PowerPoint 2021 printre produsele acoperite. Româna apare cu localizare completă: „Display in selected language”, „Help…”, „Proofing tools…”. Descărcarea se face direct de pe pagină, fără cheie. Pagina nu spune explicit că e gratuit, dar nu cere nicio plată.

**Două moduri de instalare** (ambele cer drepturi de administrator, adică o confirmare UAC):

1. **Simplu.** Pe pagina Microsoft *Language Accessory Pack for Office* alegeți „Română”, apoi „Descărcare (64 de biți)”. Rulați `OfficeSetup.exe`, cu toate programele Office închise.
2. **Controlat (recomandat).** Folosiți Office Deployment Tool (unealta oficială Microsoft) cu fișierul de mai jos. `Version="MatchInstalled"` adaugă limba fără să actualizeze Office la altă versiune.

```xml
<Configuration>
  <Add Version="MatchInstalled">
    <Product ID="LanguagePack">
      <Language ID="ro-ro" />
    </Product>
  </Add>
  <Display Level="None" />
</Configuration>
```

Comanda: `setup.exe /configure adauga-ro.xml`. Descărcarea are probabil câteva sute de MB (n-am măsurat).

## Ce se schimbă pentru profesor

**Aici e riscul real.** Windows-ul acestui PC este în **română**.

- În Office, lista „Office display language” are opțiunea *„Match Microsoft Windows”*. Microsoft: „If you want your Office display language to match the display language you have for Windows, select Match Microsoft Windows”.
- Dacă Office-ul profesorului e pe această opțiune, azi rămâne în engleză doar pentru că **româna lipsește**.
- După instalare, la următoarea pornire, **Word, Excel și PowerPoint ar apărea în română**.
- Valoarea `UILanguageTag = en-us` din registru arată limba folosită acum. Fără instalare nu pot ști sigur dacă e aleasă explicit sau doar „căzută” pe engleză.

**Prevenirea (1 minut, înainte de instalare):**

1. În Excel, deschideți **File → Options → Language**.
2. La „Office display language”, selectați **English (United States)**.
3. Apăsați **Set as Preferred**, apoi OK.
4. Reporniți Office.

Engleza devine astfel preferința lui explicită, oricare ar fi limba Windows-ului. Setarea e **per utilizator** și se aplică tuturor programelor Office.

**Ce nu se schimbă:**

- fișierele;
- formulele (funcțiile rămân `SUM`, `IF`… și în Office-ul românesc);
- separatorul `;` (ține de formatul regional al Windows-ului);
- licența;
- panglica particularizată și bara Acces rapid.

Se adaugă corectura ortografică pentru română, care e utilă oricum.

## Cum citim automat panglica românească (fără să schimbăm limba profesorului)

**Partea verificată azi, pe acest PC, cu Excel-ul în engleză.**

- Am pornit un Excel **separat** (`EXCEL.EXE /x /e`, adică proces nou, fără registru deschis) pe desktopul ascuns `A6CalibRO`, cu `tools/hidden_desktop.py`.
- Un cititor UI Automation (`pywinauto`, deja instalat), pornit pe același desktop ascuns, a citit:
  - **filele**: Home, Insert, Page Layout, Formulas, Data, Review, View, Developer, Help;
  - **grupurile**: Clipboard, Font, Alignment, Number, Styles, Cells, Editing…;
  - **butoanele**: Paste, Cut, Copy, Bold, Italic, Font Color, Wrap Text, Merge & Center…
- Apoi am închis numai acel proces. Pe ecranul profesorului nu a apărut nimic. Scripturile de probă sunt în scratchpad-ul sesiunii.
- Singurul alt Excel care rula era pornit la 12:58, fără fereastră, dinainte de această probă; nu l-am atins.

**Partea care rămâne de probat după instalare** (limba unui singur proces). Office citește limba de afișare **la pornire**, din `UILanguageTag` (setare per utilizator). Pașii:

1. Salvează valoarea curentă (`en-us`).
2. Scrie `ro-ro`.
3. Pornește `EXCEL.EXE /x /e` pe desktopul ascuns.
4. După ce fereastra există (~5–10 s), **pune imediat înapoi `en-us`**.
5. Citește panglica prin UI Automation, pe fiecare filă, și salvează textul în `calibrare/capturi/panglica-excel-ro.txt`.
6. Închide numai procesul pornit de el.

La fel se face pentru Word (`WINWORD.EXE /q /n`) și PowerPoint.

- **Risc rămas:** dacă profesorul deschide un program Office exact în acele ~10 secunde, acel program apare în română până îl redeschide. Programele deja deschise nu sunt afectate.
- **Măsuri:** rularea se face noaptea sau când nu rulează Office în sesiunea lui. Scriptul verifică la final că valoarea a revenit la `en-us`.

**Ce am cercetat și am respins:**

- **Citirea directă a fișierelor de limbă.** Etichetele există în `XLINTL32.DLL` și `MSOINTL.DLL` (am găsit „Conditional Formatting”, „Print Area”, „Format Shape”). Dar Office nu le ține în tabelele standard de șiruri Windows: parserul meu a găsit 0 intrări RT_STRING în `XLINTL32.DLL`. Potrivirea EN↔RO din fișiere ar cere decodarea formatului intern Microsoft. Nu merită.
- **Un cont Windows separat** („calibrare”, cu Office în română). Nu atinge deloc setările profesorului, dar programele unui alt utilizator nu pot desena pe desktopul lui ascuns fără schimbări de permisiuni sau o sesiune separată. E posibil, dar mai complicat. Nu l-am probat.

**Rezultatul pentru dicționar:** fișierele `capturi/*.txt` intră ca surse `captura:capturi/…`. `verifica_calibrare.py` le acceptă deja ca „captură din aplicația reală”, echivalentă cu o sursă Microsoft. O singură rulare ar lămuri deodată toate cele 22 de rânduri din `de_confirmat_in_laborator.md`, fără laborator.

## Cum se anulează

1. **Pachetul de limbă**, pe una din două căi:
   - Setări Windows → Aplicații → Aplicații instalate → intrarea Office cu „ro-ro”, pe modelul „Microsoft Office Professional Plus 2021 - ro-ro” (azi există doar „… - en-us”) → Dezinstalare;
   - Office Deployment Tool cu `<Remove><Product ID="LanguagePack"><Language ID="ro-ro"/></Product></Remove>` (exemplul oficial Microsoft pentru eliminarea unui pachet de limbă).
2. **Setarea de limbă:** File → Options → Language. Englezei i se păstrează „Set as Preferred”, iar dacă scriptul a fost întrerupt, `UILanguageTag` se pune înapoi la `en-us`.
3. **Office însuși nu se reinstalează.** Engleza rămâne limba de bază (limba pentru meniurile contextuale Windows), pentru că aceasta se schimbă doar la reinstalare.

## Surse

- Microsoft, *Language Accessory Pack for Microsoft 365*: https://support.microsoft.com/en-us/office/languages/language-accessory-pack-for-microsoft-365. Produse acoperite: 2016–2024 și Microsoft 365; româna are localizare completă; „Restart all programs for your changes to take effect”.
- Microsoft, *Change the language Office uses in its menus and proofing tools*: https://support.microsoft.com/en-us/office/change-the-language-office-uses-in-its-menus-and-proofing-tools-f5c54ff9-a6fa-4348-a43c-760e7ef148f8. Conține „Match Microsoft Windows” și „Set as Preferred”.
- Microsoft Learn, *Overview of deploying languages for Microsoft 365 Apps*: https://learn.microsoft.com/en-us/microsoft-365-apps/deploy/overview-deploying-languages-microsoft-365-apps. Acoperă adăugarea cu `Product ID="LanguagePack"`, eliminarea cu `<Remove>` și faptul că utilizatorii au nevoie de drepturi de administrator.
- Pe acest PC: `reg query` pe cheile de mai sus, `Get-UICulture` = ro-RO și proba UI Automation descrisă mai sus.
