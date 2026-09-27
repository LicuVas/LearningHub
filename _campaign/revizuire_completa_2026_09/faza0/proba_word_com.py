"""Faza 0 (27.09.2026), bonus: merge arbitrul Word pe acest PC? Instanta NOUA si INVIZIBILA prin COM,
document nou, tabel 2x2 + o imagine din sit, numar obiectele, apoi cateva afirmatii din VII nr. 4
(word-obiecte-vii N3 P5). Inchid FARA salvare, Quit() doar pe instanta mea. Iesire: proba_word_com.txt."""
import sys, time, tempfile
from pathlib import Path
import win32com.client
import pywintypes

sys.stdout.reconfigure(encoding="utf-8")
AICI = Path(__file__).resolve().parent
IMG = Path(r"C:/00/Projects/LearningHub/jocuri/word-obiecte-vii/img/obiecte-document.webp")
L = []
def log(s):
    L.append(s); print(s)

t0 = time.time()
w = win32com.client.DispatchEx("Word.Application")
w.Visible = False
w.DisplayAlerts = 0  # wdAlertsNone
doc = None
try:
    log(f"Word {w.Version} · build {w.Build} · limba interfetei LCID {w.LanguageSettings.LanguageID(2)} · pornit in {time.time()-t0:.1f}s")
    doc = w.Documents.Add()
    rng = doc.Range(0, 0)
    rng.InsertAfter("Paragraf de text pentru proba.")
    rng.InsertParagraphAfter()
    # 1. tabel 2x2
    end = doc.Content; end.Collapse(0)  # wdCollapseEnd
    t = doc.Tables.Add(end, 2, 2)
    t.Cell(1, 1).Range.Text = "Nume"; t.Cell(1, 2).Range.Text = "Nota"
    log(f"[1] tabel 2x2: Tables.Count={doc.Tables.Count}, randuri={t.Rows.Count}, coloane={t.Columns.Count}")
    # 2. imagine din sit (webp; daca Word o refuza, o convertesc in PNG temporar)
    end = doc.Content; end.Collapse(0)
    try:
        sh = doc.InlineShapes.AddPicture(str(IMG), False, True, end)
        log(f"[2] imagine .webp inserata direct: {IMG.name} ({sh.Width:.0f}x{sh.Height:.0f} pt)")
    except pywintypes.com_error as e:
        log(f"[2] Word a REFUZAT .webp: {str(e)[:160]}")
        from PIL import Image
        tmp = Path(tempfile.gettempdir()) / "proba_word_com_img.png"
        Image.open(IMG).save(tmp)
        end = doc.Content; end.Collapse(0)
        sh = doc.InlineShapes.AddPicture(str(tmp), False, True, end)
        log(f"    ...inserata dupa conversie in PNG temporar ({tmp})")
    log(f"[3] obiecte numarate: paragrafe={doc.Paragraphs.Count}, tabele={doc.Tables.Count}, imagini in linie={doc.InlineShapes.Count}, forme plutitoare={doc.Shapes.Count}")
    log(f"[4] optiunea „pozele se insereaza ca” (Options.PictureWrapType; 0 = In linie cu textul / In line with text): {w.Options.PictureWrapType}")
    # 5. VII N3 P5: „3x4 Table” = 3 coloane, 4 randuri (API: NumRows=4, NumColumns=3)
    end = doc.Content; end.Collapse(0)
    t2 = doc.Tables.Add(end, 4, 3)
    log(f"[5] tabel cerut ca 4 randuri x 3 coloane: randuri={t2.Rows.Count}, coloane={t2.Columns.Count} (eticheta grilei „3x4 Table” = UI, netestabila prin COM)")
    # 6. VII N3 P5: „Apăsat în ultima celulă, Tab adaugă un rând nou.” -> Selection.MoveRight(wdCell) = echivalentul lui Tab in tabel
    t2.Cell(4, 3).Select()
    inainte = t2.Rows.Count
    w.Selection.MoveRight(12)  # wdCell
    log(f"[6] Tab (MoveRight wdCell) in ultima celula: randuri {inainte} -> {t2.Rows.Count} · coloane pe randul nou={t2.Rows(t2.Rows.Count).Cells.Count}")
    log(f"VERDICT: arbitrul Word MERGE pe acest PC (COM, invizibil) · total {time.time()-t0:.1f}s")
except Exception as e:
    log(f"VERDICT: arbitrul Word NU merge: {e!r}"[:400])
finally:
    try:
        if doc is not None:
            doc.Close(0)  # wdDoNotSaveChanges
    finally:
        w.Quit(0)
    log("document inchis fara salvare; instanta mea inchisa (Quit)")
(AICI / "proba_word_com.txt").write_text("\n".join(L) + "\n", encoding="utf-8")
