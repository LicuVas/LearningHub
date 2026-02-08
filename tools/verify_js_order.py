import os, sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
wrong = 0
correct = 0
for root, dirs, files in os.walk('content/tic'):
    for f in sorted(files):
        if f.startswith('lectia') and f.endswith('.html'):
            fp = os.path.join(root, f)
            with open(fp, 'r', encoding='utf-8') as fh:
                content = fh.read()
            s = content.find('lesson-summary.js')
            p = content.find('practice-simple.js')
            if s != -1 and p != -1 and s < p:
                wrong += 1
                print(f'STILL WRONG: {fp}')
            elif s != -1 and p != -1:
                correct += 1
print(f'Correct order: {correct}, Still wrong: {wrong}')
