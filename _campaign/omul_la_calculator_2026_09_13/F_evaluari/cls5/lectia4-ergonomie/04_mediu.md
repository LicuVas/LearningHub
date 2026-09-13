# 04 — Ce mediu presupune lecția (U4)

## Ce presupune lecția
| Presupunere | Unde în lecție | Ce se știe (13.09.2026) |
|:--|:--|:--|
| Un **birou cu calculator** la care elevul stă și măsoară | „Evalueaza-ti locul de munca”, pașii 1-6 | Brauner are sala „1 (TIC)”; clasa-pereche (5M) poate fi în sala 4/5 — laborator sau clasă obișnuită = **necunoscut**. Lecția are și varianta „Nu ai birou cu calculator acum? … imaginandu-ti locul tau de lucru” — bună pentru sala fără PC. |
| **Scaun reglabil / monitor mutabil** (ca „marcheaza”, „ce trebuie schimbat”) | pașii 1-2, indiciul 2 (cutie / carte groasă) | mobilierul din laborator = **necunoscut**. CCOHS: soluția standard e scaunul reglabil + suport de picioare reglabil (`surse/ccohs_chair_adjusting.txt`). |
| **Telefon** al elevului (alarme, reminder-e, aplicația „Eye Care 20 20 20”, poză a locului) | pasul 2 („Trucul profesional”), pasul 3 metodele 1-2, Ex. 2, Provocare bonus | dacă elevii de a V-a au / au voie cu telefonul la oră = **necunoscut** (regulamentul școlii necitit). 7 rânduri din lecție cer telefon/descărcare/poză (`u5_iesire.json` A5). |
| **Drept de instalare** pe PC („Descarca aplicatia Stretchly … Windows/Mac/Linux”) | pasul 5 | Stretchly există în 2026, gratuit și open source (`surse/stretchly.txt`, text brut). Dacă contul de elev poate instala = **necunoscut** (de regulă nu, pe PC-uri de școală — nesursat). |
| **Browserul** păstrează răspunsurile | „Salveaza raspunsul” | măsurat: doar `localStorage` al acelui browser (`u7_salvare_iesire.json`). |
| Un geam / obiect la 6 m | regula 20-20-20 | în laborator: depinde de sală (necunoscut); pe hol sau pe geam, de obicei da. |
| Proiector pentru tabelul „Postura corecta” | — (nu cere explicit) | proiectorul = necunoscut; `proiector_25.png` arată pagina la 25%. |

## Software
Lecția nu cere niciun program Office, nicio comandă Windows, niciun separator de formule. Nu are pași `interfata` de tip Microsoft; singurele „interfețe” sunt telefonul și aplicațiile de reamintire.

## Concluzie
Mediul critic al acestei lecții nu e softul, e **mobilierul și regula despre telefoane**. Ambele sunt necunoscute → întrebări pentru Vasile (anexă), iar semnalările care depind de ele sunt `depinde_de_necunoscut: true`.
