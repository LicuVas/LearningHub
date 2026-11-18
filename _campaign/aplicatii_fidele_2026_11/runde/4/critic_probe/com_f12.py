# -*- coding: utf-8 -*-
"""Word real, INVIZIBIL (DispatchEx, Visible=False, DisplayAlerts=0): ce nume propune Save As (F12) pentru un document
NOU și pentru unul deja SALVAT — Application.Dialogs(wdDialogFileSaveAs=84).Name, citit fără să afișeze fereastra.
Calibrare: documentul nou trebuie să dea primul rând (ca scenarii_real/word-salvare-ca-f12.json: „Tema mea de azi.docx”).
Fișierele în %TEMP% (dosar unic, șters la final); închid DOAR PID-ul meu."""
import json, os, shutil, subprocess, sys, tempfile, time
import pythoncom, win32com.client

OUT = r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/4/critic_probe/com_f12.json"


def pids():
    r = subprocess.run(['tasklist', '/FI', 'IMAGENAME eq WINWORD.EXE', '/FO', 'CSV', '/NH'], capture_output=True, text=True)
    return {int(l.split('","')[1]) for l in r.stdout.splitlines() if l.startswith('"WINWORD')}


inainte = pids()
if inainte:
    print('REFUZ: WINWORD rulează deja', inainte); sys.exit(1)
pythoncom.CoInitialize()
dosar = tempfile.mkdtemp(prefix='critic_r4_')
rez = {'versiune': None}
w = None
try:
    w = win32com.client.DispatchEx('Word.Application')
    w.Visible = False
    w.DisplayAlerts = 0
    mei = pids() - inainte
    rez['versiune'] = w.Build
    d = w.Documents.Add()
    d.Content.Text = 'Tema mea de azi'
    rez['nou_tema'] = w.Dialogs(84).Name
    d.Content.Text = 'Orarul meu\rLuni: română, matematică, TIC'
    rez['nou_orar'] = w.Dialogs(84).Name
    cale = os.path.join(dosar, 'Popescu_Ana_7A_orar.docx')
    d.SaveAs2(cale, 16)
    rez['salvat_nume'] = d.Name
    rez['salvat_propus_F12'] = w.Dialogs(84).Name
    d.Content.InsertAfter('\rMarți: sport')
    rez['salvat_modificat_propus_F12'] = w.Dialogs(84).Name
    d.Close(0)
finally:
    try:
        if w is not None:
            w.Quit(0)
    except Exception as e:
        rez['quit'] = repr(e)
    time.sleep(2)
    ramase = pids() - inainte
    for p in ramase:
        subprocess.run(['taskkill', '/PID', str(p), '/F'], capture_output=True)
    rez['pid_inchise_fortat'] = sorted(ramase)
    shutil.rmtree(dosar, ignore_errors=True)
rez['cum'] = 'DispatchEx Word.Application, Visible=False, DisplayAlerts=0; Dialogs(84).Name fără Display; %TEMP%'
json.dump(rez, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(json.dumps(rez, ensure_ascii=False, indent=1))
