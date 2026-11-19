# -*- coding: utf-8 -*-
"""Word real, INVIZIBIL (DispatchEx, Visible=False, DisplayAlerts=0), doar citiri de model, fara ferestre afisate:
 1. numele documentelor noi la Documents.Add (numerotarea Document1/2/3) si numele propus de Save As pentru un document gol;
 2. folderul propus de Save As (Dialogs(84).Name) pentru un document DESCHIS dintr-un alt folder decat Documente;
 3. Word fara document: CommandBars.GetEnabledMso pe comenzile apasate de elev (calibrare: aceleasi cu document deschis);
 4. un nume cu semne interzise (: ? * ") nu poate fi fisier (SaveAs2 + os.open);
 5. Documents.Open pe un fisier deja deschis (nemodificat): cate documente raman.
Fisierele in %TEMP% (dosar unic, sters la final); inchid DOAR PID-ul meu; PowerPoint neatins.
In iesire, calea %TEMP% e inlocuita cu textul „%TEMP%”."""
import json, os, shutil, subprocess, sys, tempfile, threading, time
import pythoncom, win32com.client

OUT = r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/5/critic_probe/com_r5.json"
TMP = tempfile.gettempdir()


def pids():
    r = subprocess.run(['tasklist', '/FI', 'IMAGENAME eq WINWORD.EXE', '/FO', 'CSV', '/NH'], capture_output=True, text=True)
    return {int(l.split('","')[1]) for l in r.stdout.splitlines() if l.startswith('"WINWORD')}


def curat(v):
    if isinstance(v, str):
        return v.replace(TMP, '%TEMP%')
    if isinstance(v, dict):
        return {k: curat(x) for k, x in v.items()}
    if isinstance(v, list):
        return [curat(x) for x in v]
    return v


inainte = pids()
if inainte:
    print('REFUZ: WINWORD ruleaza deja', inainte); sys.exit(1)
pythoncom.CoInitialize()
dosar = tempfile.mkdtemp(prefix='critic_r5_')
desc = os.path.join(dosar, 'Descarcari'); os.makedirs(desc)
rez = {}
w = None
mei = set()


def paznic():
    time.sleep(150)
    for p in pids() - inainte:
        subprocess.run(['taskkill', '/PID', str(p), '/F'], capture_output=True)
    rez['paznic'] = 'a oprit fortat dupa 150 s'


threading.Thread(target=paznic, daemon=True).start()
COM_IDS = ['Bold', 'Italic', 'FontSize', 'FileSave', 'FileSaveAs', 'FilePrint', 'Copy', 'Paste', 'FileNewDefault', 'FileOpen', 'Undo', 'FileClose']
try:
    w = win32com.client.DispatchEx('Word.Application')
    w.Visible = False
    w.DisplayAlerts = 0
    mei = pids() - inainte
    rez['versiune'] = w.Build
    rez['documente_la_pornire'] = w.Documents.Count
    # 1. numerotarea
    d1 = w.Documents.Add()
    rez['nou1_nume'] = d1.Name
    rez['nou1_gol_propus_F12'] = w.Dialogs(84).Name
    en_cu_doc = {}
    for i in COM_IDS:
        try:
            en_cu_doc[i] = bool(w.CommandBars.GetEnabledMso(i))
        except Exception as e:
            en_cu_doc[i] = 'eroare ' + type(e).__name__
    rez['activ_cu_document'] = en_cu_doc
    d2 = w.Documents.Add()
    rez['nou2_nume'] = d2.Name
    rez['nou2_gol_propus_F12'] = w.Dialogs(84).Name
    rez['documente_dupa_2'] = w.Documents.Count
    d2.Close(0); d1.Close(0)
    rez['documente_dupa_inchidere'] = w.Documents.Count
    # 3. Word fara document
    en_fara = {}
    for i in COM_IDS:
        try:
            en_fara[i] = bool(w.CommandBars.GetEnabledMso(i))
        except Exception as e:
            en_fara[i] = 'eroare ' + type(e).__name__
    rez['activ_fara_document'] = en_fara
    d3 = w.Documents.Add()
    rez['nou3_dupa_inchiderea_tuturor_nume'] = d3.Name
    # 2. document deschis din alt folder
    d3.Content.Text = 'Clubul de lectura'
    cale = os.path.join(desc, 'club-lectura.docx')
    d3.SaveAs2(cale, 16)
    d3.Close(0)
    d4 = w.Documents.Open(cale)
    rez['deschis_din_descarcari_nume'] = d4.Name
    rez['deschis_din_descarcari_propus_F12'] = w.Dialogs(84).Name
    d4.Content.InsertAfter(' Pop Mihai')
    rez['deschis_din_descarcari_modificat_propus_F12'] = w.Dialogs(84).Name
    d4.Save()
    # 5. deschis iar, nemodificat
    n0 = w.Documents.Count
    d5 = w.Documents.Open(cale)
    rez['deschis_iar'] = {'documente_inainte': n0, 'documente_dupa': w.Documents.Count, 'acelasi_document': d5.FullName == d4.FullName}
    d4.Close(0)
    # 4. nume interzise
    d6 = w.Documents.Add()
    d6.Content.Text = 'Orarul meu'
    inv = {}
    for nume in ('Pop_Mihai:7A', 'Pop?Mihai', 'Pop*Mihai', 'Pop"Mihai'):
        c = os.path.join(dosar, nume + '.docx')
        try:
            d6.SaveAs2(c, 16)
            inv[nume] = {'word_SaveAs2': 'a mers: ' + d6.FullName}
        except Exception as e:
            inv[nume] = {'word_SaveAs2': 'eroare: ' + str(getattr(e, 'excepinfo', [None, None, str(e)])[2])[:160]}
        try:
            fd = os.open(c, os.O_CREAT | os.O_WRONLY)
            os.close(fd)
            inv[nume]['os_open'] = 'a mers (' + str(os.listdir(dosar)) + ')'
        except OSError as e:
            inv[nume]['os_open'] = 'OSError ' + str(e.errno) + ' ' + e.strerror
    rez['nume_interzise'] = inv
    d6.Close(0)
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
rez['cum'] = 'DispatchEx Word.Application, Visible=False, DisplayAlerts=0; Dialogs(84).Name fara Display; CommandBars.GetEnabledMso; %TEMP%'
rez = curat(rez)
json.dump(rez, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(json.dumps(rez, ensure_ascii=False, indent=1))
