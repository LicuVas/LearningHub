# Cum creezi Google Forms pentru fișele de lucru

## Pas 1: Deschide Google Apps Script

1. Du-te la [script.google.com](https://script.google.com)
2. Click **New Project**
3. Șterge codul existent

## Pas 2: Copiază scriptul

1. Deschide fișierul `form_generator.gs` din acest folder
2. Copiază tot conținutul
3. Lipește în Google Apps Script

## Pas 3: Modifică pentru lecția ta

În secțiunea **CONFIGURARE**, schimbă:

```javascript
const CONFIG = {
  formTitle: "Fișă de lucru - Word: Primii pași",  // Titlul tău
  formDescription: "Completează această fișă...",   // Descrierea ta
  grade: "cls5",       // cls5, cls6, cls7, cls8
  module: "m3-word",   // modulul
  lesson: "lectia1"    // lecția
};
```

În secțiunea **LESSON_DATA**, copiază întrebările din fișierul JSON corespunzător:
- `data/worksheets/cls5.json` pentru clasa 5
- etc.

## Pas 4: Rulează scriptul

1. Click pe **Run** (▶️) sau `Ctrl+Enter`
2. Autorizează scriptul când ți se cere
3. Verifică **Logs** (View → Logs) pentru URL-urile formularului

## Pas 5: Distribuie elevilor

Copiază **URL completare** din Logs și trimite-l elevilor.

## Pas 6: Colectează răspunsurile

### Opțiunea A: Export automat (recomandat)
1. În același script, rulează funcția `exportResponsesToJSON()`
2. Fișierul JSON apare în Google Drive

### Opțiunea B: Export manual
1. Responses → Download responses (.csv)
2. Convertește CSV în JSON cu un convertor online

## Pas 7: Verifică cu AI

```bash
python tools/verify_submissions.py --file submissions_lectia1.json --report
```

---

## Scurtătură: Generator rapid

Pentru a genera rapid formulare pentru mai multe lecții, poți modifica doar `LESSON_DATA` și rula din nou.

## Notă

Scriptul exemplu conține deja întrebările pentru **cls5/m3-word/lectia1**. Pentru alte lecții, copiază structura din fișierele JSON.
