#!/usr/bin/env bash
# P1 (T1): sha1 al continutului SERVIT live fata de blobul publicat in git (c4b47656, LF)
# si fata de fisierul de pe disc (brut = CRLF pe paginile HTML; fara CR).
# Rulare: bash <acest fisier>   -> ultima linie = numarul de fisiere cu live != git (0 = inchis)
R=C:/00/Projects/LearningHub
diferite=0
for f in lectii/v/m4-l28/index.html lectii/v/m4-l29/index.html lectii/_sim/secventa-liniara.js lectii/_sim/urmarire-decizie.js; do
  u="https://learninghub-8z6.pages.dev/${f}"; u="${u%index.html}"
  L=$(curl -s -A "Mozilla/5.0" "$u" | sha1sum | cut -c1-40)
  G=$(git -C $R show c4b47656:$f | sha1sum | cut -c1-40)
  Dk=$(tr -d '\r' < $R/$f | sha1sum | cut -c1-40)
  Draw=$(sha1sum < $R/$f | cut -c1-40)
  echo "$f"
  echo "  url=$u"
  echo "  live=$L"
  echo "  git(c4b47656)=$G"
  echo "  disc(fara CR)=$Dk  disc(brut)=$Draw"
  if [ "$L" = "$G" ]; then echo "  LIVE==GIT"; else echo "  LIVE!=GIT"; diferite=$((diferite+1)); fi
done
echo "$diferite"
