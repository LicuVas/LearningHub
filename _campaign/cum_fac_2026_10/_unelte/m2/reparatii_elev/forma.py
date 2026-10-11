"""Scrierea fiselor in forma fisierului (ca diff-ul sa arate doar ce s-a schimbat).
fise_m2_windows.json: forma compacta (pasi si termeni pe randuri); fise_m2_audio_evaluari.json: indent=1."""
import json

B = 'C:/00/Projects/LearningHub/cum-fac/_sursa/'


def _v(x):
    return json.dumps(x, ensure_ascii=False)


def compact(fise):
    out = ['[']
    for i, f in enumerate(fise):
        out.append(' {')
        chei = list(f.keys())
        for j, k in enumerate(chei):
            v = f[k]
            virg = ',' if j < len(chei) - 1 else ''
            if k in ('pasi', 'termeni') and isinstance(v, list) and v:
                out.append('  %s: [' % _v(k))
                for m, e in enumerate(v):
                    out.append('   %s%s' % (_v(e), ',' if m < len(v) - 1 else ''))
                out.append('  ]' + virg)
            else:
                out.append('  %s: %s%s' % (_v(k), _v(v), virg))
        out.append(' }' + (',' if i < len(fise) - 1 else ''))
    out.append(']')
    return '\n'.join(out) + '\n'


def indent1(fise):
    return json.dumps(fise, ensure_ascii=False, indent=1) + '\n'


FORMA = {'fise_m2_windows.json': compact, 'fise_m2_audio_evaluari.json': indent1}


def citeste(nume):
    return json.loads(open(B + nume, 'rb').read().decode('utf-8'))


def scrie(nume, fise):
    open(B + nume, 'wb').write(FORMA[nume](fise).encode('utf-8'))


if __name__ == '__main__':
    for n, fn in FORMA.items():
        raw = open(B + n, 'rb').read()
        print(n, 'forma identica' if fn(json.loads(raw)).encode('utf-8') == raw else 'FORMA DIFERITA')
