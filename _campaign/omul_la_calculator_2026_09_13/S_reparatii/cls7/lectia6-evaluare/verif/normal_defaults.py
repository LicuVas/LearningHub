import zipfile, re, os, time, subprocess
p = os.path.expandvars(r"%APPDATA%\Microsoft\Templates\Normal.dotm")
print("Normal.dotm mtime", time.ctime(os.path.getmtime(p)))
z = zipfile.ZipFile(p)
s = z.read("word/styles.xml").decode("utf8")
d = re.search(r"<w:docDefaults>.*?</w:docDefaults>", s, re.S).group(0)
print(d[:900])
m = re.search(r'<w:style w:type="paragraph" w:default="1".*?</w:style>', s, re.S)
print("NORMAL:", m.group(0)[:600] if m else None)
t = z.read("word/theme/theme1.xml").decode("utf8")
print(re.findall(r'<a:(?:major|minor)Font><a:latin typeface="[^"]+"', t))
exe = r"C:\Program Files\Microsoft Office\root\Office16\WINWORD.EXE"
if os.path.exists(exe):
    out = subprocess.run(["powershell", "-NoProfile", "-Command", "(Get-Item '" + exe + "').VersionInfo.ProductVersion"], capture_output=True, text=True)
    print("WINWORD", out.stdout.strip())
