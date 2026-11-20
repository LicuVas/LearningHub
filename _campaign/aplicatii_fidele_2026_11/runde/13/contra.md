# Runda 13 · contra (pasul 4)

- **PENTRU:** referința are acum exact ce lipsea (8 suprafețe + 12 scenarii probate + faptele a_forma_clic / c_* / b_* / d_durate);
  fiecare reparație are citat, iar drumurile lecțiilor se pot duce la capăt. O4 are 20 de puncte de câștigat fără să atingă oracolele.
- **ÎMPOTRIVĂ:** runda e lată (8 bucăți) pe un fișier de 1706 rânduri; riscul e o regresie în comportamentele închise de critic 12
  (P1, P2, P5) sau în Word/Excel prin `aplicatii.css`; plus tastatura pe liste, necapturată pentru PowerPoint ([presupus]).
- **Adevărul incomod:** clicul pe formă cu lovirea desenului SVG e cel mai puțin sigur: dacă un rulator (O4/O5) apasă centrul
  dreptunghiului unei forme al cărei desen nu acoperă centrul, ținta „forma” n-ar mai fi lovită. Steaua / săgeata / ovalul /
  dreptunghiul acoperă centrul; O5 (tragerea) folosește margine_forma — de verificat în probă și cu O5.

**Hotărârea:** reparațiile în ordinea suplimentului, fiecare cu proba ei (mouse ȘI tastatură); după fiecare bucată O4 doar pe
PowerPoint (`runde/13/o4_ppt.py`) + regresul P1/P2/P5 din `runde/12/proba_grav.py`; codul comun (`aplicatii.css`) doar sub
`.lh-ap-powerpoint`. La ~200k de context, predare la prima graniță curată.
