# 01 — Citesc înapoi (U8, U10) — cls8 / lectia6-proiect

## Ce promite lecția
- **Titlu (`<title>`, rândul 6):** „Proiect: Catalog Scolar Complet | TIC Clasa a VIII-a”; **h1 (rândul 24):** „Proiect Final: Catalogul Scolar Complet”.
- **Obiective (caseta de sus):** „Sa analizezi faza 1: proiectarea structurii de date”, „Sa explici combinarea functiilor intr-un proiect real”,
  „Sa aplici de la tabel simplu la document profesional”, „Sa aplici ce grafice au sens pentru un catalog scolar”, „Sa aplici de la ecran la hartie - page layout”.
  (Obiectivele sunt titluri de atomi lipite după „Sa analizezi/Sa aplici” — „Sa aplici de la ecran la hartie” nu e o propoziție.)
- **Ce FACE elevul la final:** un fișier `Catalog_Clasa8.xlsx` cu titlu îmbinat A1:G1, antet pe rândul 3, 10 elevi × 4 materii (datele se lipesc dintr-un bloc „Copiaza”),
  media pe elev în G4:G13 (`AVERAGE`), rândurile 15-17 cu media/minimul/maximul pe materie (C:G), formatare (antet bold, fundal roșu închis, text alb,
  2 zecimale, All Borders), grafic Column cu mediile elevilor, pagină Landscape/Narrow cu antet de pagină. Bonus `COUNTIF`. Timp declarat: „15-20 minute”.
  Apoi 2+ exerciții practice (proiect cu 15 elevi și coloană Status cu `IF`; buletinul clasei cu grafic pe materii și Page Layout).

## Trei identificatori (U10)
| Identificator | Ce spune | Se potrivește? |
|:--|:--|:--|
| Numele fișierului | `lectia6-proiect.html` | proiect — da |
| Titlul / h1 | „Catalog Scolar Complet” | da cu fișierul |
| Cardul din `m1-excel-fundamente/index.html` (rândul ~382, link spre `lectia6-proiect.html`) | **„PROIECT FINAL: Buget Personal”** | **NU** — cardul promite alt proiect decât pagina |
| Ora din planul anului (`B_context_real.md` §2, `Proiectul_unitatii_VIII-U1.md`) | ora 12 „Mini-proiect: produs informatic cu tabel, formule și grafic” | da ca tip (tabel+formule+grafic); dar lecția mai cere **Page Layout / antet de pagină** (nu apare în nicio oră din VIII-U1) și `IF` (ora 9) — sortarea (ora 10) nu e cerută |

## Luna în care se ține
- **Brauner 8A/8M:** ora 12 = **04.12.2026** (vineri, `Calendar_ore_8A_8M.md`, rândul 20) — Modulul 2 al școlii, decembrie.
- **Izvoare VIII:** ora 12 **nu există** în calendar: „Se comasează (conținutul trece la ora anterioară + temă acasă)… ora 12 — Mini-proiect”
  (`Calendar_ore_VIII.md`, rândurile 11-13; 01.12.2026 e zi liberă). Deci la Izvoare proiectul devine **temă acasă** după ora 11 (24.11.2026), într-o școală fără laborator.
- Lecțiile 4-7 din modul se țin abia în noiembrie-decembrie; lecția 6 e ultima oră de predare/consolidare a unității, înainte de evaluarea sumativă (08.12 / 11.12).

## Criteriul de „gata” pentru mine
Construiesc catalogul exact după pașii 1-6 (+bonus) cu openpyxl, îl recalculez și randez prin `H_randeaza.py`, verific rândurile 4, 5 și ultimul (nu doar primul),
redeschid fișierul, notez produsul după baremul lecției (dacă există unul) și verific dacă baremul se poate aplica pe o clasă întreagă.
