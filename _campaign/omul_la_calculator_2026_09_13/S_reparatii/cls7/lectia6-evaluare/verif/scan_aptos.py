import zipfile, re, os, subprocess, collections
out = subprocess.run(["es.exe", "-n", "4000", "-sort", "date-modified-descending", "ext:docx"], capture_output=True, text=True, errors="ignore").stdout.splitlines()
cnt = collections.Counter(); ex = {}
n = 0
for p in out:
    try:
        z = zipfile.ZipFile(p)
        app = z.read("docProps/app.xml").decode("utf8", "ignore")
        if "Microsoft Office Word" not in app:
            continue
        ver = re.search(r"<AppVersion>([^<]+)", app)
        th = z.read("word/theme/theme1.xml").decode("utf8", "ignore")
        minor = re.search(r'<a:minorFont><a:latin typeface="([^"]+)"', th).group(1)
        st = z.read("word/styles.xml").decode("utf8", "ignore")
        d = re.search(r"<w:rPrDefault>.*?</w:rPrDefault>", st, re.S)
        sz = re.search(r'<w:sz w:val="(\d+)"', d.group(0)) if d else None
        key = (minor, sz.group(1) if sz else None)
        cnt[key] += 1
        ex.setdefault(key, p)
        n += 1
    except Exception:
        pass
    if n >= 600:
        break
print("scanned", n)
for k, v in cnt.most_common():
    print(k, v, ex[k])
