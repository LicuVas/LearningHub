# -*- coding: utf-8 -*-
"""Descarca O DATA fiecare sursa web din meniuri_ro_en.json in _cache/.

Pentru fiecare URL (http/https) din campul "surse" al oricarei intrari:
  _cache/<hash>.txt   = textul VIZIBIL al paginii (fara taguri, fara script/style),
                        pe primul rand titlul paginii, apoi textul
  _cache/index.json   = {url: {fisier, stare_http, url_final, tip, descarcat_la, lungime}}

Un URL deja descarcat NU se mai cere (cache). Validatorul verifica_calibrare.py
citeste NUMAI din _cache, deci ruleaza fara retea si da mereu acelasi rezultat.

Folosire:
  python cache_surse.py                 # descarca ce lipseste
  python cache_surse.py --refresh       # redescarca tot
  python cache_surse.py --url URL ...   # descarca si URL-uri in plus (cercetare)
  python cache_surse.py --status        # doar arata ce lipseste / ce a esuat

Ultimele 3 randuri: rezumat, esuate, iar ultima = DOAR numarul de URL-uri
din dictionar care NU au text in cache.
"""
import argparse
import datetime
import hashlib
import html
import io
import json
import os
import re
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, "_cache")
INDEX = os.path.join(CACHE, "index.json")
DICT = os.path.join(HERE, "meniuri_ro_en.json")

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/128.0 Safari/537.36")


def url_hash(url):
    return hashlib.sha1(url.encode("utf-8")).hexdigest()[:16]


def cache_path(url):
    return os.path.join(CACHE, url_hash(url) + ".txt")


def load_index():
    if os.path.isfile(INDEX):
        with open(INDEX, encoding="utf-8") as f:
            return json.load(f)
    return {}


def save_index(idx):
    tmp = INDEX + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(idx, f, ensure_ascii=False, indent=1, sort_keys=True)
    os.replace(tmp, INDEX)


def dictionary_urls():
    with open(DICT, encoding="utf-8") as f:
        data = json.load(f)
    urls = []
    for e in data.get("intrari", []):
        for key in ("surse", "surse_respinse"):
            for s in e.get(key, []) or []:
                u = (s.get("url") or "").strip()
                if u.startswith("http") and u not in urls:
                    urls.append(u)
    return urls


def html_to_text(raw_html):
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(raw_html, "html.parser")
    title = soup.title.get_text(" ", strip=True) if soup.title else ""
    for tag in soup(["script", "style", "noscript", "template", "svg", "head"]):
        tag.decompose()
    text = soup.get_text(" ")
    text = html.unescape(text)
    text = re.sub(r"[ \t\r\f\v ​]+", " ", text)
    text = re.sub(r"\s*\n\s*", "\n", text)
    text = re.sub(r"\n{2,}", "\n", text).strip()
    return title, text


def pdf_to_text(raw):
    try:
        from pypdf import PdfReader
    except ImportError:
        return "", ""
    reader = PdfReader(io.BytesIO(raw))
    parts = []
    for page in reader.pages:
        try:
            parts.append(page.extract_text() or "")
        except Exception:
            parts.append("")
    return "", "\n".join(parts)


def fetch(url):
    import requests
    for attempt in range(3):
        r = requests.get(url, headers={"User-Agent": UA,
                                       "Accept-Language": "ro-RO,ro;q=0.9,en;q=0.5"},
                         timeout=40, allow_redirects=True)
        if r.status_code not in (403, 429, 503):
            break
        time.sleep(6 * (attempt + 1))   # limitare de trafic: asteapta si reincearca
    ctype = r.headers.get("content-type", "").lower()
    if "pdf" in ctype or url.lower().endswith(".pdf"):
        title, text = pdf_to_text(r.content)
        kind = "pdf"
    else:
        r.encoding = r.apparent_encoding if not r.encoding or r.encoding.lower() == "iso-8859-1" else r.encoding
        title, text = html_to_text(r.text)
        kind = "html"
    return r.status_code, r.url, kind, title, text


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--refresh", action="store_true")
    ap.add_argument("--status", action="store_true")
    ap.add_argument("--url", action="append", default=[])
    args = ap.parse_args()
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

    os.makedirs(CACHE, exist_ok=True)
    idx = load_index()
    dict_urls = dictionary_urls()
    todo = list(dict_urls)
    for u in args.url:
        if u not in todo:
            todo.append(u)

    fetched, failed = 0, []
    if not args.status:
        for u in todo:
            have = os.path.isfile(cache_path(u)) and idx.get(u, {}).get("stare_http") == 200
            if have and not args.refresh:
                continue
            try:
                code, final, kind, title, text = fetch(u)
            except Exception as ex:
                idx[u] = {"fisier": None, "stare_http": None, "eroare": str(ex)[:200],
                          "descarcat_la": datetime.datetime.now().isoformat(timespec="seconds")}
                failed.append(u)
                print(f"ESEC  {u}  ({str(ex)[:80]})")
                continue
            fname = url_hash(u) + ".txt"
            if code == 200 and text.strip():
                with open(os.path.join(CACHE, fname), "w", encoding="utf-8") as f:
                    f.write((title + "\n" if title else "") + text + "\n")
            idx[u] = {"fisier": fname if code == 200 else None, "stare_http": code,
                      "url_final": final, "tip": kind, "titlu": title[:200],
                      "lungime": len(text),
                      "descarcat_la": datetime.datetime.now().isoformat(timespec="seconds")}
            fetched += 1
            print(f"{code}  {len(text):>7}  {u}")
            time.sleep(0.4)
        save_index(idx)

    missing = [u for u in dict_urls
               if not (os.path.isfile(cache_path(u)) and idx.get(u, {}).get("stare_http") == 200)]
    for u in missing:
        info = idx.get(u, {})
        print(f"FARA TEXT: {u}  (http={info.get('stare_http')} {info.get('eroare', '')[:60]})")
    print(f"Cache surse: {len(dict_urls)} URL-uri in dictionar, {fetched} descarcate acum, {len(idx)} in index")
    print(f"URL-uri din dictionar fara text in cache: {len(missing)} (esuate acum: {len(failed)})")
    print(len(missing))


if __name__ == "__main__":
    main()
