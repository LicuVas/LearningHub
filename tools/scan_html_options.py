#!/usr/bin/env python3
"""
scan_html_options.py - Find quiz options containing < or > characters.

These characters break HTML rendering when inserted via template literal ${opt}
into innerHTML, because the browser interprets them as HTML tags.

Scans:
  1. quiz*.html files: inline JavaScript levels objects with options arrays
  2. lectia*.html files: data-quiz JSON attributes with options arrays
"""

import os, re, json, sys, io
from pathlib import Path

# Fix encoding for Windows console
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

CONTENT_DIR = Path(r"C:\AI\Projects\LearningHub\content")

RED = "\033[91m"
YEL = "\033[93m"
GRN = "\033[92m"
CYN = "\033[96m"
BLD = "\033[1m"
DIM = "\033[2m"
RST = "\033[0m"


def relpath(fp):
    try:
        return str(Path(fp).relative_to(CONTENT_DIR))
    except ValueError:
        return str(fp)


def extract_js_levels_options(html, fpath):
    findings = []
    m = re.search(r'(?:const|var|let)\s+levels\s*=\s*\{', html)
    if not m:
        return findings
    brace = 0
    start = html.index('{', m.start())
    end = start
    for i in range(start, len(html)):
        if html[i] == '{':
            brace += 1
        elif html[i] == '}':
            brace -= 1
            if brace == 0:
                end = i
                break
    block = html[start:end+1]
    ltitles = {}
    for lm in re.finditer(r'(\d+)\s*:\s*\{[^}]*?title\s*:\s*"([^"\\]*)"', block, re.DOTALL):
        ltitles[lm.start()] = (int(lm.group(1)), lm.group(2))
    lpos = sorted(ltitles.keys())
    def get_level(pos):
        cur = (0, "Unknown")
        for p in lpos:
            if p > pos:
                break
            cur = ltitles[p]
        return cur
    qpat = re.compile(
        r'\{\s*text\s*:\s*"((?:[^"\\]|\\.)*)"\s*,\s*options\s*:\s*\[(.*?)\]\s*,\s*correct\s*:\s*(\d+)',
        re.DOTALL)
    for qm in qpat.finditer(block):
        qtext = qm.group(1)
        opts_raw = qm.group(2)
        correct = int(qm.group(3))
        lnum, ltitle = get_level(qm.start())
        opts = [o.group(1) for o in re.finditer(r'"((?:[^"\\]|\\.)*)"', opts_raw)]
        if not opts:
            opts = [o.group(1) for o in re.finditer(r"'((?:[^'\\]|\\.)*)'", opts_raw)]
        probs = []
        for idx, opt in enumerate(opts):
            if '<' in opt or '>' in opt:
                probs.append({'index': idx, 'text': opt, 'is_correct': idx == correct})
        if probs:
            findings.append({
                'level': lnum, 'level_title': ltitle,
                'question': qtext, 'correct_idx': correct,
                'all_options': opts, 'problematic': probs})
    return findings


def extract_data_quiz_options(html, fpath):
    findings = []
    dqpat = re.compile(r"data-quiz='(\[.*?\])'", re.DOTALL)
    for match in dqpat.finditer(html):
        json_str = match.group(1)
        try:
            qdata = json.loads(json_str)
        except json.JSONDecodeError:
            fixed = json_str.replace('&lt;', '<').replace('&gt;', '>').replace('&amp;', '&')
            try:
                qdata = json.loads(fixed)
            except json.JSONDecodeError:
                findings.append({'parse_error': True, 'raw': json_str[:200], 'position': match.start()})
                continue
        for qi, q in enumerate(qdata):
            qtext = q.get('question', 'Unknown')
            options = q.get('options', [])
            correct = q.get('correct', '')
            cidx = None
            if isinstance(correct, str) and len(correct) == 1 and correct.isalpha():
                cidx = ord(correct.lower()) - ord('a')
            elif isinstance(correct, int):
                cidx = correct
            elif isinstance(correct, str) and correct.isdigit():
                cidx = int(correct)
            probs = []
            for idx, opt in enumerate(options):
                s = str(opt)
                if '<' in s or '>' in s:
                    is_c = (idx == cidx) if cidx is not None else None
                    probs.append({'index': idx, 'text': s, 'is_correct': is_c, 'correct_letter': correct})
            if probs:
                findings.append({
                    'question_idx': qi, 'question': qtext,
                    'correct': correct, 'correct_idx': cidx,
                    'all_options': options, 'problematic': probs})
    return findings


def check_data_quiz_entities(html):
    findings = []
    dqpat = re.compile(r"data-quiz='(\[.*?\])'", re.DOTALL)
    for match in dqpat.finditer(html):
        raw = match.group(1)
        if '&lt;' in raw or '&gt;' in raw:
            findings.append({'has_html_entities': True, 'raw_snippet': raw[:300], 'position': match.start()})
    return findings


def scan_all_files():
    SEP = '=' * 80
    TSEP = '~' * 80
    print(f"{BLD}{SEP}{RST}")
    print(f"{BLD}  SCAN: Quiz Options with < > Characters (HTML Injection Risk){RST}")
    print(f"{BLD}{SEP}{RST}")
    print(f"\n{DIM}Content directory: {CONTENT_DIR}{RST}")
    print(f"{DIM}Looking for options containing < or > that break innerHTML rendering{RST}\n")
    quiz_files = sorted(CONTENT_DIR.rglob("quiz*.html"))
    lectia_files = sorted(CONTENT_DIR.rglob("lectia*.html"))
    print(f"Found {CYN}{len(quiz_files)}{RST} quiz files")
    print(f"Found {CYN}{len(lectia_files)}{RST} lectia files\n")
    total_issues = 0
    total_correct_broken = 0
    files_with_issues = 0
    all_results = []

    # PART 1: quiz files
    print(f"{BLD}{TSEP}{RST}")
    print(f"{BLD}  PART 1: Scanning quiz*.html files (inline JS levels objects){RST}")
    print(f"{BLD}{TSEP}{RST}\n")
    quiz_issues = 0
    for qf in quiz_files:
        try:
            with open(qf, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            print(f"  {RED}ERROR reading {qf}: {e}{RST}")
            continue
        findings = extract_js_levels_options(content, qf)
        if findings:
            rel = relpath(qf)
            files_with_issues += 1
            print(f"{RED}{BLD}FILE: {rel}{RST}")
            for finding in findings:
                quiz_issues += 1
                total_issues += 1
                linfo = ""
                if finding.get('level'):
                    linfo = f"Level {finding['level']}"
                if finding.get('level_title'):
                    linfo += f" ({finding['level_title']})"
                print(f"  {YEL}Question:{RST} {finding['question']}")
                if linfo:
                    print(f"  {DIM}{linfo}{RST}")
                for prob in finding['problematic']:
                    marker = f"{RED}>>> CORRECT ANSWER <<<{RST}" if prob['is_correct'] else ""
                    letter = chr(65 + prob['index'])
                    print(f"    {RED}Option [{letter}] (index {prob['index']}):{RST} {prob['text']}  {marker}")
                    if prob['is_correct']:
                        total_correct_broken += 1
                print(f"  {DIM}All options:{RST}")
                for idx, opt in enumerate(finding['all_options']):
                    cm = " <-- correct" if idx == finding['correct_idx'] else ""
                    ha = " *** HAS <>" if '<' in opt or '>' in opt else ""
                    print(f"    {DIM}[{chr(65+idx)}] {opt}{cm}{ha}{RST}")
                print()
            all_results.append({'file': str(qf), 'rel_path': rel, 'type': 'quiz', 'findings': findings})
    if quiz_issues == 0:
        print(f"  {GRN}No issues found in quiz files.{RST}\n")
    else:
        print(f"  {RED}Found {quiz_issues} questions with angle brackets in quiz files.{RST}\n")

    # PART 2: lectia files
    print(f"{BLD}{TSEP}{RST}")
    print(f"{BLD}  PART 2: Scanning lectia*.html files (data-quiz JSON attributes){RST}")
    print(f"{BLD}{TSEP}{RST}\n")
    lectia_issues = 0
    lectia_entities = 0
    for lf in lectia_files:
        try:
            with open(lf, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            print(f"  {RED}ERROR reading {lf}: {e}{RST}")
            continue
        if 'data-quiz' not in content:
            continue
        findings = extract_data_quiz_options(content, lf)
        entity_findings = check_data_quiz_entities(content)
        if findings:
            rel = relpath(lf)
            files_with_issues += 1
            print(f"{RED}{BLD}FILE: {rel}{RST}")
            for finding in findings:
                if finding.get('parse_error'):
                    print(f"  {YEL}JSON PARSE ERROR at position {finding['position']}{RST}")
                    continue
                lectia_issues += 1
                total_issues += 1
                print(f"  {YEL}Question:{RST} {finding['question']}")
                for prob in finding['problematic']:
                    is_c = prob.get('is_correct')
                    if is_c is None:
                        marker = f"{YEL}(correct unknown){RST}"
                    elif is_c:
                        marker = f"{RED}>>> CORRECT ANSWER <<<{RST}"
                        total_correct_broken += 1
                    else:
                        marker = ""
                    letter = chr(65 + prob['index'])
                    print(f"    {RED}Option [{letter}] (index {prob['index']}):{RST} {prob['text']}  {marker}")
                print(f"  {DIM}All options (correct={finding.get('correct', '?')}):{RST}")
                for idx, opt in enumerate(finding['all_options']):
                    ci = finding.get('correct_idx')
                    cm = " <-- correct" if ci is not None and idx == ci else ""
                    ha = " *** HAS <>" if '<' in str(opt) or '>' in str(opt) else ""
                    print(f"    {DIM}[{chr(65+idx)}] {opt}{cm}{ha}{RST}")
                print()
            all_results.append({'file': str(lf), 'rel_path': rel, 'type': 'lectia', 'findings': findings})
        if entity_findings:
            rel = relpath(lf)
            lectia_entities += len(entity_findings)
            for ef in entity_findings:
                if ef.get('has_html_entities'):
                    print(f"  {YEL}NOTE: {rel} has html entities in data-quiz{RST}")
                    print(f"  {DIM}Snippet: {ef['raw_snippet'][:150]}...{RST}\n")
    if lectia_issues == 0 and lectia_entities == 0:
        print(f"  {GRN}No issues found in lectia files.{RST}\n")
    else:
        if lectia_issues:
            print(f"  {RED}Found {lectia_issues} questions with angle brackets in lectia files.{RST}")
        if lectia_entities:
            print(f"  {YEL}Found {lectia_entities} data-quiz blocks with HTML entities.{RST}")
        print()

    # PART 3: rendering patterns
    print(f"{BLD}{TSEP}{RST}")
    print(f"{BLD}  PART 3: Checking rendering patterns{RST}")
    print(f"{BLD}{TSEP}{RST}\n")
    unsafe = 0
    safe = 0
    dollar_opt = "${opt}"
    for qf in quiz_files:
        try:
            with open(qf, 'r', encoding='utf-8') as f:
                content = f.read()
        except:
            continue
        if dollar_opt in content:
            unsafe += 1
        if 'textContent' in content and 'opt' in content:
            safe += 1
    print(f"  Quiz files using innerHTML with {dollar_opt} (UNSAFE): {RED}{unsafe}{RST}")
    print(f"  Quiz files using textContent (SAFE): {GRN}{safe}{RST}\n")

    # SUMMARY
    print(f"{BLD}{SEP}{RST}")
    print(f"{BLD}  SUMMARY{RST}")
    print(f"{BLD}{SEP}{RST}\n")
    print(f"  Total files scanned:     {len(quiz_files) + len(lectia_files)}")
    c1 = RED if files_with_issues else GRN
    print(f"  Files with issues:       {c1}{files_with_issues}{RST}")
    c2 = RED if total_issues else GRN
    print(f"  Total problematic Qs:    {c2}{total_issues}{RST}")
    c3 = RED + BLD if total_correct_broken else GRN
    print(f"  CORRECT answers broken:  {c3}{total_correct_broken}{RST}")
    print()
    if total_issues > 0:
        print(f"  {RED}{BLD}BUG EXPLANATION:{RST}")
        print(f"  When an option like '<html>' is inserted via:")
        print(f"    optionsHTML += `<div class=option>{dollar_opt}</div>`;")
        print(f"  The browser interprets '<html>' as an HTML tag, not text.")
        print(f"  The option div becomes empty or malformed, making it unclickable.\n")
        print(f"  {GRN}{BLD}FIX:{RST} Escape options before insertion:")
        print(f"    const esc = opt.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');")
        print(f"    Then use esc instead of opt in the template literal.\n")
        print(f"  OR use textContent instead of innerHTML:")
        print(f"    const div = document.createElement('div');")
        print(f"    div.className = 'option';")
        print(f"    div.textContent = opt;\n")
    if total_correct_broken > 0:
        print(f"  {RED}{BLD}CRITICAL: {total_correct_broken} correct answer(s) contain angle brackets!{RST}")
        print(f"  {RED}These quizzes are IMPOSSIBLE TO COMPLETE correctly.{RST}\n")
    return {
        'total_files': len(quiz_files) + len(lectia_files),
        'files_with_issues': files_with_issues,
        'total_issues': total_issues,
        'correct_broken': total_correct_broken,
        'details': all_results
    }


if __name__ == '__main__':
    results = scan_all_files()
    sys.exit(1 if results['total_issues'] > 0 else 0)
