import re, html, sys, subprocess
D = r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls6\lectia6-proiect\verif"
PAGES = {
    "pdf_ro": "https://support.microsoft.com/ro-ro/office/save-powerpoint-presentations-as-pdf-files-9b5c786b-9c6e-4fe6-81f6-9372f77c47c8",
    "pdf_en": "https://support.microsoft.com/en-us/office/save-powerpoint-presentations-as-pdf-files-9b5c786b-9c6e-4fe6-81f6-9372f77c47c8",
}
KEYS = sys.argv[1:] or ["PDF/XPS", "hyperlink", "macOS", "Mac "]
for name, url in PAGES.items():
    raw = subprocess.run(["curl", "-sL", "-A", "Mozilla/5.0", url], capture_output=True).stdout.decode("utf-8", "replace")
    t = re.sub(r"<script.*?</script>|<style.*?</style>", " ", raw, flags=re.S)
    t = html.unescape(re.sub(r"<[^>]+>", " ", t))
    t = re.sub(r"\s+", " ", t)
    open(D + "\\" + name + ".txt", "w", encoding="utf-8").write(t)
    print("==", name, len(t))
    for k in KEYS:
        for m in re.finditer(re.escape(k), t, flags=re.I):
            print(" [" + k + "]", t[max(0, m.start() - 160): m.end() + 160])
