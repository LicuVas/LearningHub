# Sistem de Fișe de Lucru - LearningHub

## Prezentare generală

Sistemul de fișe de lucru oferă evaluare pe 3 niveluri pentru fiecare lecție:

| Nivel | Notă | Punctaj | Ce testează |
|-------|------|---------|-------------|
| **Minim** | 5-6 | 30 pct | Cunoștințe de bază, reproducere |
| **Standard** | 7-8 | 35 pct | Înțelegere, aplicare, comparare |
| **Performanță** | 9-10 | 35 pct | Analiză, creație, scenarii complexe |

## Structura fișierelor

```
data/worksheets/
├── schema.json          # Schema și reguli de notare
├── cls5.json            # Fișe pentru clasa 5 (30 lecții)
├── cls6.json            # Fișe pentru clasa 6 (25 lecții)
├── cls7.json            # Fișe pentru clasa 7 (29 lecții)
├── cls8.json            # Fișe pentru clasa 8 (20 lecții)
├── submission_template.json  # Template pentru submisii
└── README.md            # Acest fișier
```

## Tipuri de întrebări

### Auto-evaluabile (100% automat)
- **mcq** - Întrebări cu variante de răspuns

### AI-verificabile (necesită confirmare)
- **short** - Răspuns scurt (1-2 propoziții)
- **explain** - Explicație detaliată
- **compare** - Comparație între concepte

### Manual + AI assist
- **task** - Sarcină practică cu dovadă (screenshot/URL)
- **scenario** - Rezolvare situație reală
- **create** - Creare conținut original
- **debug** - Găsire și corectare greșeli

## Cum funcționează verificarea

### 1. Elevul completează fișa
```json
{
  "student": {"name": "Popescu Ion", "class": "5A"},
  "lesson": "cls5/m3-word/lectia1",
  "answers": {
    "minim": {"m1": 1, "m2": "...", ...},
    "standard": {...},
    "performanta": {...}
  }
}
```

### 2. Profesorul rulează verificarea
```bash
python tools/verify_submissions.py --file submisie.json --report
```

### 3. Sistemul generează raport
- Notează automat MCQ-urile
- Evaluează răspunsurile deschise cu keywords
- Marchează ce necesită verificare manuală
- Calculează nota finală

## Calculul notei

```
Punctaj total = minim + standard + performanță
Max = 30 + 35 + 35 = 100 puncte

90-100% → Nota 10
80-89%  → Nota 9
65-79%  → Nota 8
50-64%  → Nota 7
40-49%  → Nota 6
30-39%  → Nota 5
0-29%   → Nota 4
```

## Workflow recomandat

### Pentru profesor

1. **Pregătire lecție**
   - Verifică fișa pentru lecția următoare
   - Ajustează dacă e cazul

2. **În timpul orei**
   - Elevii parcurg lecția pe LearningHub
   - Completează fișa de lucru

3. **După oră**
   - Colectează submisiile (folder sau Google Form → JSON)
   - Rulează verificarea:
   ```bash
   python tools/verify_submissions.py --folder submissions/cls5/m3-word/ --grade cls5 --report
   ```

4. **Revizuire**
   - Verifică răspunsurile marcate cu "needs_review"
   - Ajustează notele dacă e cazul
   - Oferă feedback personalizat

### Pentru elevi

1. Parcurge lecția complet (GOAL → TRY → LEARN → TEST)
2. Completează fișa de lucru la nivelul dorit
3. Pentru notă maximă, completează toate cele 3 niveluri
4. Atașează dovezi (screenshot/URL) pentru sarcinile practice

## Integrare cu LearningHub

Sistemul poate fi integrat direct în paginile de lecție:

```html
<script src="assets/js/worksheet-system.js"></script>
<script>
  WorksheetSystem.init({
    grade: 'cls5',
    module: 'm3-word',
    lesson: 'lectia1',
    onSubmit: (data) => {
      // Trimite la Google Form sau salvează local
    }
  });
</script>
```

## Personalizare

### Adăugare întrebări noi
Editează fișierul JSON corespunzător clasei și adaugă în structura lecției.

### Modificare rubric
Fiecare întrebare poate avea un `rubric` custom:
```json
{
  "rubric": {
    "15": "Răspuns complet cu 3+ argumente",
    "10": "Răspuns bun cu 2 argumente",
    "5": "Răspuns parțial"
  }
}
```

### Ajustare keywords pentru AI
Modifică `answer_hints` și `key_points` pentru a îmbunătăți verificarea automată.

## Statistici disponibile

După verificare, poți vedea:
- Nota medie pe clasă
- Distribuția notelor
- Întrebările cu cele mai multe greșeli
- Elevii care au nevoie de ajutor suplimentar

## Contact

Dezvoltat pentru LearningHub by Prof. Gurlan Vasile
grlnvasile@gmail.com
