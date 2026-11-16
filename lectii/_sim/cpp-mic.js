/* lectii/_sim/cpp-mic.js — C++ în pagină: un interpretor mic de C++ scris în JavaScript (fără bibliotecă, fără eval, fără
   rețea) + interfața: editor cu numere de linie, bară cu semnele greu de găsit pe telefon, consolă adevărată, rulare pas cu pas.

   PROPRIETAR: componenta c_cppmic (09.11.2026), pentru VII/24+ și VIII/24+. Predarea: lectii/_sim/cpp-mic.GATA.md (API-ul cu un
   exemplu complet, ce acceptă, ce refuză, oracolele). Cine are nevoie de altceva scrie o extensie cu nume nou; nu schimbă fișierul.

   FIDELITATE (arbitrul = g++ 16.1 MinGW-w64 UCRT, -std=c++17 -O0; probele: lectii/_sim/_teste/cpp-mic/; Code::Blocks de aici = g++ 6.3,
     diferențele sunt în GATA, secțiunea „g++ 16.1 și g++ 6.3”):
     PROBAT diferențial, octet cu octet (oracol.py): împărțirea întreagă și % cu negative; int pe 32 de biți și long long pe 64,
       cu împachetare (în C++ e comportament nedefinit; g++ -O0 împachetează pe programele din oracol); float față de double;
       conversiile implicite, inclusiv real → întreg în afara domeniului (cvttsd2si: INT_MIN); afișarea cu cout (6 cifre,
       1e+06, fixed, setprecision, jumătatea la par pe egalități exacte, nan fără semn, inf); char și bool; cin ca în libstdc++
       (sare peste spații; litere în int → 0 și citirile următoare nu mai fac nimic; depășire → valoarea maximă + eșec;
       la sfârșitul datelor variabila rămâne neschimbată); ordinea din C++17 (<<, =, a[i++] = i).
     PROBAT (oracol_erori.py): eroarea de compilare: linia și mesajul g++ în engleză, cu „did you mean”, în ordinea lui g++ (întâi ce
       găsește la citirea fișierului, apoi restul). Numele globale pentru sugestii sunt extrase din preprocesorul real.
     NU INVENTEAZĂ, se oprește cu mesaj: variabilă sau element fără valoare; indice în afara tabloului; împărțire întreagă la 0;
       aceeași variabilă schimbată și folosită fără ordine (i++ + i++); cout << tablou (adresă); tablou prea mare pentru stivă.
     ABATERI SPUSE: un pas e o instrucțiune (în Code::Blocks, o linie); „fără valoare” în tabelul variabilelor (acolo: un număr
       oarecare); diacriticele se văd corect (consola Windows poate arăta altceva); în pagină, după 15 s programul stă și întreabă
       (plafon pe timp, poate continua); la teste, plafon de 3.000.000 de pași; consola arată doar coada unei ieșiri foarte lungi; pow cu rezultat ≥ 1e23 la
       setprecision ≥ 16 poate diferi la ultimele cifre; modificări neordonate pe elemente de tablou nu se detectează.
   REFUZĂ CINSTIT (mesaj distinct de o eroare de compilare): funcții proprii, string, pointeri, clase, fișiere, tablouri cu două
     dimensiuni și ce nu e în lista din GATA. Nimic nu pleacă în afara calculatorului.

   API: window.CppMic = {versiune, tipuri:{'cpp-mic':…}, tip, monteaza(el, Q), compileaza(sursa), ruleaza(sursa, {intrare, plafon, limIesire}),
     judecaTest, fmtGeneral, fmtFixed}. În lecție: <script src="../../_sim/cpp-mic.js"></script> și tipuri:CppMic.tipuri în configurație;
     exercițiul / atelierul: {t:'cpp-mic', q, start, intrare?, teste:[…], rezolvare, gresit, why, doarCitire?, pasCuPas?, linii?, id?}.
   CE NU SE SCHIMBĂ (lecțiile se sprijină pe ele): numele tipului, câmpurile lui Q și ale testelor, clasele cu prefixul cm-, id-ul
     stilului cm-css, cheile ciornei cppmic:<lecție>:<exercițiu>[@<profil>]. Schimbările se fac numai adăugând, cu data aici. */
(function (root) {
'use strict';
const VERSIUNE = '1.1 (09.11.2026)';

/* ---------------- octeți: ieșirea și intrarea programului sunt OCTEȚI, ca în C++ ---------------- */
function utf8(s) {
  let r = '';
  for (const ch of String(s)) {
    const c = ch.codePointAt(0);
    if (c < 0x80) r += ch;
    else if (c < 0x800) r += String.fromCharCode(0xC0 | c >> 6, 0x80 | c & 63);
    else if (c < 0x10000) r += String.fromCharCode(0xE0 | c >> 12, 0x80 | c >> 6 & 63, 0x80 | c & 63);
    else r += String.fromCharCode(0xF0 | c >> 18, 0x80 | c >> 12 & 63, 0x80 | c >> 6 & 63, 0x80 | c & 63);
  }
  return r;
}
function dinOcteti(b) {
  let r = '', i = 0;
  while (i < b.length) {
    const c = b.charCodeAt(i);
    if (c < 0x80) { r += b[i]; i++; continue; }
    const n = c >= 0xF0 && c < 0xF8 ? 3 : c >= 0xE0 && c < 0xF0 ? 2 : c >= 0xC2 && c < 0xE0 ? 1 : -1;
    let ok = n > 0 && i + n < b.length + 0 && i + n <= b.length - 0;
    let cp = n === 1 ? c & 31 : n === 2 ? c & 15 : c & 7;
    if (ok) for (let k = 1; k <= n; k++) {
      const d = b.charCodeAt(i + k);
      if (isNaN(d) || (d & 0xC0) !== 0x80) { ok = false; break; }
      cp = cp << 6 | d & 63;
    }
    if (ok) { r += String.fromCodePoint(cp); i += n + 1; } else { r += '�'; i++; }
  }
  return r;
}

/* ---------------- afișarea numerelor reale: exact ca printf din runtime-ul folosit de g++ (MinGW, UCRT) ----------------
   Valoarea binară se scrie EXACT în zecimal (BigInt), apoi se rotunjește cu „jumătatea la par” numai pe egalități
   exacte (probat: fixed setprecision(0): 0.5→0, 1.5→2, 2.5→2; 2.675 cu 2 zecimale → 2.67). NaN se afișează „nan”, fără
   semn (probat: 0.0/0.0, -(0.0/0.0), sqrt(-1)). */
const F64 = new Float64Array(1), U64 = new BigUint64Array(F64.buffer);
function zecimalExact(x) {          /* x finit, ≥ 0: {cifre, punct}: valoarea = 0.<cifre> × 10^punct */
  F64[0] = x;
  const bits = U64[0], ex = Number(bits >> 52n & 0x7FFn);
  let m = bits & 0xFFFFFFFFFFFFFn, e;
  if (ex === 0) e = -1074; else { m |= 1n << 52n; e = ex - 1075; }
  if (m === 0n) return {cifre: '0', punct: 1};
  if (e >= 0) { const s = (m << BigInt(e)).toString(); return {cifre: s, punct: s.length}; }
  const k = -e, s = (m * 5n ** BigInt(k)).toString();
  return {cifre: s, punct: s.length - k};
}
function rotunjeste(cifre, n) {     /* primele n cifre, rotunjite; {s, plus}: plus=1 dacă a apărut o cifră nouă în față */
  if (n < 0) return {s: '', plus: 0, zero: true};
  if (n >= cifre.length) return {s: cifre + '0'.repeat(n - cifre.length), plus: 0};
  let s = cifre.slice(0, n), rest = cifre.slice(n);
  const c0 = rest.charCodeAt(0) - 48;
  let sus;
  if (c0 > 5) sus = true; else if (c0 < 5) sus = false;
  else if (/[1-9]/.test(rest.slice(1))) sus = true;
  else sus = n > 0 && (s.charCodeAt(n - 1) - 48) % 2 === 1;
  if (!sus) return {s, plus: 0};
  const a = s.split('');
  let i = n - 1;
  while (i >= 0) { if (a[i] === '9') { a[i] = '0'; i--; } else { a[i] = String.fromCharCode(a[i].charCodeAt(0) + 1); break; } }
  if (i < 0) return {s: '1' + a.join(''), plus: 1};
  return {s: a.join(''), plus: 0};
}
function fmtFixed(x, prec) {
  if (x !== x) return 'nan';
  if (x === Infinity) return 'inf';
  if (x === -Infinity) return '-inf';
  const neg = x < 0 || Object.is(x, -0), v = Math.abs(x);
  const {cifre, punct} = zecimalExact(v);
  let intreg, frac;
  /* ținem punct cifre înaintea virgulei + prec după */
  const tot = punct + prec;
  let c = cifre;
  if (punct <= 0) { c = '0'.repeat(1 - punct) + cifre; }
  const pp = punct <= 0 ? 1 : punct;
  const r = rotunjeste(c, pp + prec);
  intreg = r.s.slice(0, pp + r.plus); frac = r.s.slice(pp + r.plus);
  void tot;
  intreg = intreg.replace(/^0+(?=\d)/, '');
  return (neg ? '-' : '') + intreg + (prec > 0 ? '.' + frac : '');
}
function fmtGeneral(x, prec) {
  if (x !== x) return 'nan';
  if (x === Infinity) return 'inf';
  if (x === -Infinity) return '-inf';
  const P = prec < 0 ? 6 : prec === 0 ? 1 : prec;
  const neg = x < 0 || Object.is(x, -0), v = Math.abs(x);
  if (v === 0) return (neg ? '-' : '') + '0';
  const z = zecimalExact(v);
  /* prima cifră nenulă */
  const lead = z.cifre.match(/^0*/)[0].length;
  const cif = z.cifre.slice(lead);
  let X = z.punct - lead - 1;
  const r = rotunjeste(cif, P);
  let d = r.s;
  if (r.plus) { X += 1; d = d.slice(0, P); }
  let s;
  if (X < -4 || X >= P) {
    let m = d[0] + (P > 1 ? '.' + d.slice(1) : '');
    if (m.indexOf('.') >= 0) m = m.replace(/0+$/, '').replace(/\.$/, '');
    const ae = Math.abs(X);
    s = m + 'e' + (X < 0 ? '-' : '+') + (ae < 10 ? '0' + ae : ae);
  } else if (X >= 0) {
    s = d.slice(0, X + 1) + '.' + d.slice(X + 1);
    s = s.replace(/0+$/, '').replace(/\.$/, '');
  } else {
    s = '0.' + '0'.repeat(-X - 1) + d;
    s = s.replace(/0+$/, '').replace(/\.$/, '');
  }
  return (neg ? '-' : '') + s;
}

/* ---------------- tipurile și conversiile ---------------- */
const NUME_TIP = {int: 'int', ll: 'long long int', float: 'float', double: 'double', bool: 'bool', char: 'char'};
const OCTETI = {int: 4, ll: 8, float: 4, double: 8, bool: 1, char: 1};
const ARIT = new Set(['int', 'll', 'float', 'double', 'bool', 'char']);
const INTREG = new Set(['int', 'll', 'bool', 'char']);
const MIN32 = -2147483648, LLMIN = -(2n ** 63n), LLMAX = 2n ** 63n - 1n;
const laInt = d => (d !== d || d >= 2147483648 || d <= -2147483649) ? MIN32 : Math.trunc(d) | 0;   /* cvttsd2si, probat */
const laLL = d => (d !== d || d >= 9223372036854775808 || d < -9223372036854775808) ? LLMIN : BigInt(Math.trunc(d));
const laChar = n => n << 24 >> 24;
function cvf(de, la) {               /* funcția de conversie sau null dacă e aceeași reprezentare */
  if (de === la) return null;
  switch (la) {
    case 'int':
      if (de === 'char' || de === 'bool') return null;
      if (de === 'll') return v => Number(BigInt.asIntN(32, v));
      return laInt;
    case 'll':
      if (de === 'float' || de === 'double') return laLL;
      return v => BigInt(v);
    case 'double':
      if (de === 'll') return v => Number(v);
      return null;
    case 'float':
      if (de === 'll') return v => Math.fround(Number(v));
      if (de === 'double') return Math.fround;
      return Math.fround;
    case 'char':
      if (de === 'bool') return null;
      if (de === 'int') return laChar;
      if (de === 'll') return v => Number(BigInt.asIntN(8, v));
      return v => laChar(laInt(v));
    case 'bool':
      if (de === 'll') return v => v !== 0n ? 1 : 0;
      return v => v !== 0 ? 1 : 0;
  }
  return null;
}
const comun = (a, b) => a === 'double' || b === 'double' ? 'double' : a === 'float' || b === 'float' ? 'float' : a === 'll' || b === 'll' ? 'll' : 'int';
const promov = a => a === 'bool' || a === 'char' ? 'int' : a;

/* ---------------- oprirea rulării: ce g++ nu definește, simulatorul nu inventează ---------------- */
class Oprire { constructor(tip, mesaj) { this.tip = tip; this.mesaj = mesaj; } }
const NU_E_SIGUR = 'În Code::Blocks programul ar putea afișa altceva la fiecare rulare.';

/* ---------------- numele globale pe care g++ le vede: pentru „did you mean …” (extrase din preprocesorul real) ---------------- */
const NUME_IO_FN = 'wctype wctrans towctrans wctrans_t qsort_s wcstombs_s wctomb_s mbstowcs_s getenv_s bsearch_s atoll strtoull strtoll llabs lldiv lldiv_t onexit ultoa swab putenv ltoa itoa gcvt fcvt ecvt realloc malloc free calloc wcstombs wctomb strtoul strtol strtold strtof strtod srand rand mkdtemp mkstemp mbstowcs mbtowc mblen ldiv getenv div qsort bsearch atol atoi atof at_quick_exit atexit labs abs ldiv_t div_t pthread_rwlockattr_setpshared pthread_rwlockattr_init pthread_rwlockattr_getpshared pthread_rwlockattr_destroy pthread_getevent pthread_gethandle pthread_getclean pthread_barrierattr_getpshared pthread_barrierattr_setpshared pthread_barrierattr_destroy pthread_barrierattr_init pthread_condattr_setclock pthread_condattr_getclock pthread_condattr_setpshared pthread_condattr_getpshared pthread_condattr_init pthread_condattr_destroy pthread_setconcurrency pthread_getconcurrency pthread_mutexattr_setprioceiling pthread_mutexattr_getprioceiling pthread_mutexattr_setprotocol pthread_mutexattr_getprotocol pthread_mutexattr_setpshared pthread_mutexattr_getpshared pthread_mutexattr_settype pthread_mutexattr_gettype pthread_mutexattr_destroy pthread_mutexattr_init pthread_attr_setstacksize pthread_attr_getstacksize pthread_attr_setstackaddr pthread_attr_getstackaddr pthread_attr_setstack pthread_attr_getstack pthread_attr_getscope pthread_attr_setscope pthread_attr_getinheritsched pthread_attr_setinheritsched pthread_attr_getdetachstate pthread_attr_setdetachstate pthread_attr_destroy pthread_attr_init pthread_spin_unlock pthread_spin_trylock pthread_spin_lock pthread_spin_destroy pthread_spin_init pthread_barrier_wait pthread_barrier_init pthread_barrier_destroy pthread_mutex_destroy pthread_mutex_init pthread_mutex_trylock pthread_mutex_timedlock timespec pthread_mutex_timedlock64 pthread_mutex_timedlock32 pthread_cond_timedwait_relative_np pthread_cond_timedwait64_relative_np pthread_cond_timedwait pthread_cond_timedwait64 pthread_cond_timedwait32 pthread_cond_wait pthread_cond_broadcast pthread_cond_signal pthread_cond_destroy pthread_cond_init pthread_rwlock_destroy pthread_rwlock_trywrlock pthread_rwlock_tryrdlock pthread_rwlock_timedrdlock pthread_rwlock_timedrdlock64 pthread_rwlock_timedrdlock32 pthread_rwlock_timedwrlock pthread_rwlock_timedwrlock64 pthread_rwlock_timedwrlock32 pthread_rwlock_wrlock pthread_rwlock_init pthread_getname_np pthread_setname_np pthread_detach pthread_join pthread_create pthread_create_wrapper pthread_setcanceltype pthread_setcancelstate pthread_kill pthread_cancel pthread_exit pthread_set_concurrency pthread_get_concurrency pthread_tls_init pthread_equal pthread_testcancel pthread_once pthread_self pthread_setspecific pthread_getspecific pthread_key_delete pthread_key_create void pthread_barrier_t pthread_rwlock_t pthread_cond_t pthread_mutex_t pthread_spinlock_t pthread_attr_getschedpolicy pthread_attr_setschedpolicy pthread_setschedparam pthread_getschedparam pthread_attr_getschedparam pthread_attr_setschedparam pthread_attr_t pthread_t pthread_rwlockattr_t pthread_condattr_t pthread_barrierattr_t pthread_key_t pthread_mutexattr_t pthread_once_t pthread_set_num_processors_np pthread_delay_np pthread_delay64_np pthread_delay32_np pthread_timechange_handler_np sched_setscheduler sched_getscheduler sched_get_priority_max sched_get_priority_min sched_yield sched_param clock_settime64 clock_gettime clock_gettime64 clock_getres clock_getres64 clock_nanosleep clock_nanosleep64 nanosleep nanosleep64 nanosleep32 clockid_t mingw_gettimeofday timezone timeval tzset tzname daylight mktime ctime_s ctime gmtime_s gmtime localtime_s localtime difftime timespec_get time strftime clock asctime_s asctime clock_t ftime timeb raise signal sig_atomic_t spawnvpe spawnvp spawnve spawnv execvpe execvp execve execv spawnlpe spawnlp spawnle spawnl execlpe execlp execle execl cwait getpid int system abort quick_exit exit itimerspec useconds_t mode_t pid_t iscsymf iscsym toascii isascii toupper tolower isxdigit isupper isspace ispunct isprint islower isgraph isdigit iscntrl isblank isalpha isalnum localeconv setlocale lconv tmpnam_s tmpfile_s gets_s freopen_s fopen_s sprintf_s vsprintf_s vsnprintf_s printf_s fprintf_s vprintf_s vfprintf_s sscanf_s vsscanf_s scanf_s fscanf_s vscanf_s vfscanf_s fread_s clearerr_s rmtmp putw getw fputchar flushall fileno fgetchar fdopen fcloseall tempnam ungetc tmpnam tmpfile64 tmpfile setvbuf setbuf rewind unlink rename remove puts putchar putc perror gets getchar getc fwrite ftello64 ftello fseeko64 fseeko ftell fseek fsetpos64 fsetpos freopen64 freopen fread fputs fputc fopen64 fopen fgets fgetpos64 fgetpos fgetc fflush ferror feof fclose clearerr vsnprintf snprintf vsprintf vprintf vfprintf sprintf printf fprintf vfscanf vscanf vsscanf fscanf scanf sscanf fpos_t delete new wmemmove_s wmemcpy_s wcsrtombs_s wcrtomb_s mbsrtowcs_s wcsnlen_s wcsncpy_s wcsncat_s wcscpy_s wcscat_s wcstok_s swprintf_s vswprintf_s wprintf_s fwprintf_s vwprintf_s vfwprintf_s swscanf_s vswscanf_s wscanf_s fwscanf_s vwscanf_s vfwscanf_s memcpy memmove wcstoull wcstoll fwide wmemmove wmempcpy wmemcpy wmemcmp wmemchr wmemset wctob wcsrtombs wcrtomb mbsrtowcs mbrtowc mbrlen mbsinit btowc mbstate_t wcsftime tm wcsicoll wcsupr wcslwr wcsset wcsrev wcsnset wcsnicmp wcsicmp wcsdup wcscoll wcsxfrm wcstok wcsstr wcsspn wcsrchr wcspbrk wcsncpy wcsncmp wcsncat wcsnlen wcslen wcscspn wcscpy wcscmp wcschr wcscat wcstoul wcstol wcstold wcstof wcstod swprintf vswprintf fputws fgetws ungetwc putwchar putwc getwchar getwc fputwc fgetwc vsnwprintf snwprintf vwprintf vfwprintf wprintf fwprintf vfwscanf vwscanf vswscanf fwscanf wscanf swscanf off_t off64_t off32_t dev_t ino_t FILE isleadbyte is_wctype iswascii towupper towlower iswxdigit iswupper iswspace iswpunct iswprint iswlower iswgraph iswdigit iswcntrl iswblank iswalpha iswalnum iswctype max_align_t threadlocinfo threadlocaleinfostruct LPLC_ID tagLC_ID localeinfo_struct pthreadmbcinfo pthreadlocinfo threadmbcinfostruct time_t errno_t wctype_t wint_t ptrdiff_t uintptr_t intptr_t rsize_t ssize_t size_t va_list', NUME_IO_TY = 'wctrans_t lldiv_t ldiv_t div_t timespec pthread_barrier_t pthread_rwlock_t pthread_cond_t pthread_mutex_t pthread_spinlock_t pthread_attr_t pthread_t pthread_rwlockattr_t pthread_condattr_t pthread_barrierattr_t pthread_key_t pthread_mutexattr_t pthread_once_t sched_param clockid_t timezone timeval clock_t timeb sig_atomic_t itimerspec useconds_t mode_t pid_t lconv fpos_t mbstate_t tm off_t off64_t off32_t dev_t ino_t FILE max_align_t threadlocinfo threadlocaleinfostruct LPLC_ID tagLC_ID localeinfo_struct pthreadmbcinfo pthreadlocinfo threadmbcinfostruct time_t errno_t wctype_t wint_t ptrdiff_t uintptr_t intptr_t rsize_t ssize_t size_t va_list', NUME_IO_MAC = 'BUFSIZ CHAR_BIT CHAR_MAX CHAR_MIN CLK_TCK CLOCKS_PER_SEC CLOCK_MONOTONIC CLOCK_PROCESS_CPUTIME_ID CLOCK_REALTIME CLOCK_REALTIME_COARSE CLOCK_THREAD_CPUTIME_ID DUMMYSTRUCTNAME DUMMYSTRUCTNAME1 DUMMYSTRUCTNAME2 DUMMYSTRUCTNAME3 DUMMYSTRUCTNAME4 DUMMYSTRUCTNAME5 DUMMYUNIONNAME DUMMYUNIONNAME1 DUMMYUNIONNAME2 DUMMYUNIONNAME3 DUMMYUNIONNAME4 DUMMYUNIONNAME5 DUMMYUNIONNAME6 DUMMYUNIONNAME7 DUMMYUNIONNAME8 DUMMYUNIONNAME9 E2BIG EACCES EADDRINUSE EADDRNOTAVAIL EAFNOSUPPORT EAGAIN EALREADY EBADF EBADMSG EBUSY ECANCELED ECHILD ECONNABORTED ECONNREFUSED ECONNRESET EDEADLK EDEADLOCK EDESTADDRREQ EDOM EEXIST EFAULT EFBIG EHOSTUNREACH EIDRM EILSEQ EINPROGRESS EINTR EINVAL EIO EISCONN EISDIR ELOOP EMFILE EMLINK EMSGSIZE ENAMETOOLONG ENETDOWN ENETRESET ENETUNREACH ENFILE ENOBUFS ENODATA ENODEV ENOENT ENOEXEC ENOFILE ENOLCK ENOLINK ENOMEM ENOMSG ENOPROTOOPT ENOSPC ENOSR ENOSTR ENOSYS ENOTCONN ENOTDIR ENOTEMPTY ENOTRECOVERABLE ENOTSOCK ENOTSUP ENOTTY ENXIO EOF EOPNOTSUPP EOVERFLOW EOWNERDEAD EPERM EPIPE EPROTO EPROTONOSUPPORT EPROTOTYPE ERANGE EROFS ESPIPE ESRCH ETIME ETIMEDOUT ETXTBSY EWOULDBLOCK EXDEV EXIT_FAILURE EXIT_SUCCESS FILENAME_MAX FOPEN_MAX GENERIC_ERRORCHECK_INITIALIZER GENERIC_INITIALIZER GENERIC_NORMAL_INITIALIZER GENERIC_RECURSIVE_INITIALIZER INT_MAX INT_MIN LC_ALL LC_COLLATE LC_CTYPE LC_MAX LC_MIN LC_MONETARY LC_NUMERIC LC_TIME LLONG_MAX LLONG_MIN LONG_LONG_MAX LONG_LONG_MIN LONG_MAX LONG_MIN L_tmpnam L_tmpnam_s MAX_READ_LOCKS MB_CUR_MAX MB_LEN_MAX NOMINMAX NSIG NULL OLD_P_OVERLAY PATH_MAX PTHREAD_BARRIER_SERIAL_THREAD PTHREAD_CANCELED PTHREAD_CANCEL_ASYNCHRONOUS PTHREAD_CANCEL_DEFERRED PTHREAD_CANCEL_DISABLE PTHREAD_CANCEL_ENABLE PTHREAD_COND_INITIALIZER PTHREAD_CREATE_DETACHED PTHREAD_CREATE_JOINABLE PTHREAD_DEFAULT_ATTR PTHREAD_DEFAULT_MUTEX_INITIALIZER PTHREAD_DESTRUCTOR_ITERATIONS PTHREAD_ERRORCHECK_MUTEX_INITIALIZER PTHREAD_EXPLICIT_SCHED PTHREAD_INHERIT_SCHED PTHREAD_KEYS_MAX PTHREAD_MUTEX_ADAPTIVE_NP PTHREAD_MUTEX_DEFAULT PTHREAD_MUTEX_ERRORCHECK PTHREAD_MUTEX_ERRORCHECK_NP PTHREAD_MUTEX_FAST_NP PTHREAD_MUTEX_INITIALIZER PTHREAD_MUTEX_NORMAL PTHREAD_MUTEX_PRIVATE PTHREAD_MUTEX_RECURSIVE PTHREAD_MUTEX_RECURSIVE_NP PTHREAD_MUTEX_SHARED PTHREAD_MUTEX_TIMED_NP PTHREAD_NORMAL_MUTEX_INITIALIZER PTHREAD_ONCE_INIT PTHREAD_PRIO_INHERIT PTHREAD_PRIO_MULT PTHREAD_PRIO_NONE PTHREAD_PRIO_PROTECT PTHREAD_PROCESS_PRIVATE PTHREAD_PROCESS_SHARED PTHREAD_RECURSIVE_MUTEX_INITIALIZER PTHREAD_RWLOCK_INITIALIZER PTHREAD_SCOPE_PROCESS PTHREAD_SCOPE_SYSTEM PTHREAD_SPINLOCK_INITIALIZER PTHREAD_THREADS_MAX P_DETACH P_NOWAIT P_NOWAITO P_OVERLAY P_WAIT P_tmpdir RAND_MAX RWLS_PER_THREAD SCHAR_MAX SCHAR_MIN SCHED_FIFO SCHED_MAX SCHED_MIN SCHED_OTHER SCHED_RR SEEK_CUR SEEK_END SEEK_SET SEM_NSEMS_MAX SHRT_MAX SHRT_MIN SIGABRT SIGABRT2 SIGABRT_COMPAT SIGBREAK SIGFPE SIGILL SIGINT SIGSEGV SIGTERM SIG_ACK SIG_BLOCK SIG_DFL SIG_ERR SIG_GET SIG_IGN SIG_SETMASK SIG_SGE SIG_UNBLOCK SIZE_MAX SSIZE_MAX STDERR_FILENO STDIN_FILENO STDOUT_FILENO STRUNCATE SYS_OPEN TIMER_ABSTIME TIME_UTC TMP_MAX TMP_MAX_S UCHAR_MAX UINT_MAX ULLONG_MAX ULONG_LONG_MAX ULONG_MAX UNALIGNED USE___UUIDOF USHRT_MAX WAIT_CHILD WAIT_GRANDCHILD WCHAR_MAX WCHAR_MIN WEOF WIDL_EXPLICIT_AGGREGATE_RETURNS WINPTHREADS_ALWAYS_INLINE WINPTHREADS_ATTRIBUTE WINPTHREADS_INLINE WINPTHREADS_SECTION WINPTHREADS_STATIC_ASSERT WINPTHREADS_TIME_BITS WINPTHREAD_API WINPTHREAD_CLOCK_DECL WINPTHREAD_COND_DECL WINPTHREAD_MUTEX_DECL WINPTHREAD_NANOSLEEP_DECL WINPTHREAD_RWLOCK_DECL WINPTHREAD_SEM_DECL WINPTHREAD_THREAD_DECL WIN_PTHREADS_H WIN_PTHREADS_PTHREAD_COMPAT_H WIN_PTHREADS_SCHED_H WIN_PTHREADS_SIGNAL_H WIN_PTHREADS_TIME_H WIN_PTHREADS_UNISTD_H alloca environ errno offsetof onexit_t pclose popen pthread_atfork pthread_attr_getguardsize pthread_attr_setguardsize pthread_cleanup_pop pthread_cleanup_push pthread_getcpuclockid pthread_mutex_getprioceiling pthread_mutex_setprioceiling pthread_sigmask sched_rr_get_interval stderr stdin stdout sys_errlist sys_nerr timerclear timercmp timerisset wcswcs wpopen', NUME_CM_FN = 'fmal fmaf fma fminl fminf fmin fmaxl fmaxf fmax fdiml fdimf fdim nexttowardl nexttowardf nexttoward nextafterl nextafterf nextafter nanl nanf nan copysignl copysignf copysign remquol remquof remquo remainderl remainderf remainder fmodl fmodf truncl truncf trunc llroundl llroundf llround lroundl lroundf lround roundl roundf round llrintl llrintf llrint lrintl lrintf lrint rintl rintf rint nearbyintl nearbyintf nearbyint floorl floorf ceill ceilf tgammal tgammaf tgamma signgam lgammal lgammaf lgamma erfcl erfcf erfc erfl erff erf sqrtl sqrtf powl powf hypotl hypotf hypot cbrtl cbrtf cbrt scalblnl scalblnf scalbln scalbnl scalbnf scalbn modfl modff logbl logbf logb log2l log2f log2 log1pl log1pf log1p log10l log10f logl logf ldexpl ldexpf ilogbl ilogbf ilogb frexpl frexpf expm1l expm1f expm1 exp2l exp2f exp2 expl expf atanhl atanhf atanh asinhl asinhf asinh acoshl acoshf acosh tanhl tanhf coshl coshf sinhl sinhf atan2l atan2f atanl atanf acosl acosf asinl asinf tanl tanf cosl cosf sinl sinf double_t float_t sincosf sincosl sincos fmod modf frexp ldexp fabs fabsl fabsf floor ceil sqrt pow log10 log exp atan2 atan acos asin tanh cosh sinh tan cos sin', NUME_CM_TY = 'double_t float_t', NUME_CM_MAC = 'FP_ILOGB0 FP_ILOGBNAN FP_INFINITE FP_NAN FP_NORMAL FP_SUBNORMAL FP_ZERO HUGE HUGE_VAL HUGE_VALF HUGE_VALL INFINITY MATH_ERREXCEPT MATH_ERRNO NAN math_errhandling matherr';
const CHEI_DECL = 'auto bool char char16_t char32_t char8_t class const consteval constexpr constinit decltype double enum explicit extern float friend inline int long mutable register short signed static struct thread_local typedef typename union unsigned virtual void volatile wchar_t'.split(' ');
function distanta(a, b) {             /* get_edit_distance din GCC: BASE 2, CASE 1, transpunere 2 */
  const n = a.length, m = b.length;
  let d0 = [], d1 = [], d2 = [];
  for (let j = 0; j <= m; j++) d1[j] = j * 2;
  for (let i = 0; i < n; i++) {
    d2[0] = (i + 1) * 2;
    for (let j = 0; j < m; j++) {
      const eq = a[i] === b[j], ci = !eq && a[i].toLowerCase() === b[j].toLowerCase();
      let c = Math.min(d1[j + 1] + 2, d2[j] + 2, d1[j] + (eq ? 0 : ci ? 1 : 2));
      if (i > 0 && j > 0 && a[i] === b[j - 1] && a[i - 1] === b[j]) c = Math.min(c, d0[j - 1] + 2);
      d2[j + 1] = c;
    }
    const t = d0; d0 = d1; d1 = d2; d2 = t;
  }
  return d1[m];
}
function prag(lg, lc) {
  const mx = Math.max(lg, lc), mn = Math.min(lg, lc);
  if (mx <= 1) return 0;
  if (mx - mn <= 1) return 2 * Math.max(Math.floor(mx / 3), 1);
  return Math.floor(2 * (mx + 2) / 3);
}
function ceaMaiApropiata(gol, liste, macrouri, chei) {   /* best_match din GCC: pragul se aplică abia la sfârșit, celui mai bun */
  let best = null, bd = Infinity;
  const ia = c => {
    const mn = Math.abs(gol.length - c.length) * 2;
    if (mn >= bd || mn > prag(gol.length, c.length)) return;
    const d = distanta(gol, c);
    if (d < bd) { bd = d; best = c; }
  };
  for (const L of liste) for (const c of L) if (c) ia(c);
  if (macrouri && macrouri.length) {
    let bm = null, dm = bd;
    for (const L of macrouri) for (const c of L) {
      if (!c) continue;
      const mn = Math.abs(gol.length - c.length) * 2;
      if (mn >= dm || mn > prag(gol.length, c.length)) continue;
      const d = distanta(gol, c);
      if (d < dm) { dm = d; bm = c; }
    }
    if (bm && dm > 0 && dm <= prag(gol.length, bm.length)) ia(bm);
  }
  if (chei) for (const c of chei) ia(c);
  if (best === null || bd === 0 || bd > prag(gol.length, best.length)) return null;
  return best;
}

/* ---------------- ce nu acceptă simulatorul (nu e o greșeală de C++) ---------------- */
const ANTETE_BUNE = {iostream: ['io'], cmath: ['cm'], 'math.h': ['cm'], iomanip: ['im'], 'bits/stdc++.h': ['io', 'cm', 'im']};
const ANTETE_REALE = new Set('string vector fstream algorithm cstring cstdio cstdlib ctime climits cfloat sstream map set queue stack list deque array bitset utility numeric iterator functional memory random chrono thread limits stdio.h stdlib.h string.h time.h limits.h conio.h windows.h cctype ctype.h cassert complex tuple unordered_map unordered_set'.split(' '));
const NEACC_TIP = new Set('string vector map set queue stack pair list deque array ifstream ofstream fstream istream ostream stringstream size_t'.split(' '));
const NEACC_NUME = {   /* nume reale, pe care programul le poate folosi în g++ dar simulatorul nu le are; cu ce antet se văd */
  getline: 'io', cerr: 'io', clog: 'io', flush: 'io', ends: 'io', ws: 'io', left: 'io', right: 'io', internal: 'io', hex: 'io', oct: 'io', dec: 'io', scientific: 'io', defaultfloat: 'io', hexfloat: 'io', boolalpha: 'io', noboolalpha: 'io', showpoint: 'io', noshowpoint: 'io', showpos: 'io', noshowpos: 'io', skipws: 'io', noskipws: 'io', uppercase: 'io', nouppercase: 'io', ios: 'io', ios_base: 'io',
  max: 'io', min: 'io', swap: 'io', printf: 'io', scanf: 'io', puts: 'io', getchar: 'io', putchar: 'io', exit: 'io', system: 'io', rand: 'io', srand: 'io', atoi: 'io', atof: 'io', time: 'io', clock: 'io', labs: 'io', llabs: 'io', div: 'io', NULL: 'io',
  setw: 'im', setfill: 'im', setbase: 'im', setiosflags: 'im', resetiosflags: 'im', put_money: 'im', get_money: 'im', quoted: 'im',
  floor: 'cm', ceil: 'cm', round: 'cm', trunc: 'cm', fabs: 'cm', fmod: 'cm', exp: 'cm', log: 'cm', log2: 'cm', log10: 'cm', sin: 'cm', cos: 'cm', tan: 'cm', asin: 'cm', acos: 'cm', atan: 'cm', atan2: 'cm', sinh: 'cm', cosh: 'cm', tanh: 'cm', hypot: 'cm', cbrt: 'cm', lround: 'cm', llround: 'cm', isnan: 'cm', isinf: 'cm', floorf: 'cm', ceilf: 'cm', fmax: 'cm', fmin: 'cm', M_PI: 'cm', sqrtf: 'cm', sqrtl: 'cm', powf: 'cm', powl: 'cm', fabsf: 'cm'
};
const STD_DIN_ANTET = {cout: 'io', cin: 'io', endl: 'io', cerr: 'io', clog: 'io', fixed: 'io', scientific: 'io', string: 'io', setprecision: 'im', setw: 'im', setfill: 'im', getline: 'io', max: 'io', min: 'io', swap: 'io'};
const REFUZ = {
  functie: 'funcții proprii', string: 'tipul string', pointer: 'pointeri', clasa: 'clase și structuri', fisier: 'lucrul cu fișiere',
};
/* D2: propoziția „Asta nu spune că ai greșit” numai pe construcțiile care există în C++ (listă pozitivă, probată de oracol_explicatii.py --refuz); e adevărată și când mai jos e altă greșeală.
   Pe restul nu se știe de aici: refuzul spune doar ce e sigur. */
const REFUZ_G_PRIMESTE = /^(funcții proprii|tipul |clase și structuri|lucrul cu fișiere|pointeri$|biblioteca |directiva #(define|undef|pragma)$|tablouri de caractere|tablouri cu două dimensiuni|tablouri atât de mari|std::|forma indice|indici pe un text|atribuiri în lanț|static_cast$|sizeof$|numere fără semn|parametri la main|declarații în condiție|(cin|cout)\.\w+$)/;
const textRefuz = (ce, l) => (REFUZ_G_PRIMESTE.test(ce) || (NEACC_NUME[ce] && ce !== 'M_PI')
  ? `La lecțiile astea nu folosim ${ce}. Asta nu spune că ai greșit: în C++ există, iar în Code::Blocks poate merge, dacă restul e corect. De aici nu pot verifica.`
  : `La lecțiile astea nu folosim ${ce}, iar simulatorul din pagină nu poate rula programul așa. De aici nu pot spune dacă rândul ${l} e corect în C++: citește-l încă o dată sau scrie-l altfel.`);

/* ---------------- explicațiile: lista pozitivă e în compileaza (claseaErorii); aici, textul comun și propoziția neutră ---------------- */
const EX_COMENTARIU = 'Pune-l după instrucțiune, înainte de //. Ce scrii după // nu se citește.';
const EX_PV_SFARSIT = cuCom => `Lipsește semnul ; la sfârșitul instrucțiunii de pe linia arătată. ${cuCom ? EX_COMENTARIU : 'Pune-l chiar după ultimul lucru scris acolo.'} (Un compilator mai vechi din Code::Blocks arată linia de dedesubt: semnul lipsește tot de la sfârșitul liniei de deasupra ei.)`;
/* nu pretinde o cauză, deci e adevărată și când greșeala e pe alt rând */
const EX_NEUTRA = l => (l == null ? 'Compilatorul nu poate termina programul. Citește mesajul lui de mai sus.' : `Compilatorul s-a oprit la rândul ${l}: nu înțelege ce e scris acolo. Citește rândul ăsta${l > 1 ? ' și pe cel de deasupra' : ''}: poate lipsește un semn, poate e unul în plus, poate un cuvânt e scris altfel.`);
/* R6 (decizia dirijorului după poarta 6: a treia cădere pe aceeași familie ⇒ propoziția neutră pe TOATĂ familia; „mai puțin ajutor, dar niciodată fals”).
   Propozițiile neutre ale celor două familii: numesc doar ce e sigur (rândul compilatorului, numele scris de elev) și dau METODA; nu propun nicio
   editare (nici „declară-l înainte de …”, nici numele propus de compilator, nici ce acoladă se pune / se mută / se șterge, nici „Rândul N …”). */
const EX_NUME = (n, l) => `La rândul ${l}, compilatorul nu cunoaște numele ${n}. Caută unde e declarat și verifică trei lucruri: declarația există și e mai sus de rândul ${l}? E în același bloc { } cu rândul ${l} sau într-unul care îl cuprinde? (Ce declari într-un for sau între acolade se vede numai acolo.) Numele e scris la fel, literă cu literă?`;
const EX_ACOLADE = l => `Compilatorul s-a oprit la rândul ${l}: ce e scris aici nu se potrivește cu locul unde începe sau se termină corpul lui main, al unui for, while, if sau else. Numără acoladele: fiecare { are o } a ei. Chiar dacă sunt tot atâtea, una poate sta în alt loc: urmărește de sus în jos unde se închide fiecare corp și ce instrucțiuni trebuie să fie în el. Fără acolade, corpul lui for, while, if sau else e o singură instrucțiune.`;
/* semnele lipite din altă parte: spunem ce e FIECARE, nu „ghilimele” la orice (spațiile astea nici nu se văd) */
const LAT = {'\uFF1B': ';', '\uFF0C': ',', '\uFF1A': ':', '\uFF08': '(', '\uFF09': ')', '\uFF1D': '=', '\uFF1C': '<', '\uFF1E': '>', '\uFF0B': '+', '\uFF0D': '-', '\uFF0A': '*', '\uFF0F': '/', '\uFF05': '%', '\uFF01': '!', '\uFF3B': '[', '\uFF3D': ']', '\uFF5B': '{', '\uFF5D': '}', '\uFF02': '"', '\uFF07': "'", '\u037E': ';'};
const reInvizibil = /[\u00A0\u00AD\u034F\u061C\u1680\u180E\u2000-\u200F\u2028-\u202F\u205F-\u206F\u3000\uFEFF]/;
const reLiniuta = /[\u2010-\u2015\u2212\uFE58\uFE63]/;
const reGhilimele = /[\u201C-\u201F\u00AB\u00BB\u2039\u203A]/, reApostrof = /[\u2018-\u201B\u00B4\u0060]/;
const SEMNE_MAT = {'\u2264': '<=', '\u2265': '>=', '\u2260': '!=', '\u226A': '<<', '\u226B': '>>'};
const clasaSemn = ch => (reInvizibil.test(ch) ? 'invizibil' : reLiniuta.test(ch) ? 'liniuta' : reGhilimele.test(ch) ? 'ghilimele' : reApostrof.test(ch) ? 'apostrof' : LAT[ch] ? 'alta_tastatura' : ch === '\u00D7' || ch === '\u00B7' || ch === '\u22C5' ? 'inmultire' : ch === '\u00F7' || ch === '\u2236' ? 'impartire' : SEMNE_MAT[ch] ? 'matematic' : 'strain');
/* ce pune reparația în locul semnului lipit (același fel de semn, pe tot rândul); '' = îl șterge */
const inlocSemn = ch => ({liniuta: '-', ghilimele: '"', apostrof: "'", inmultire: '*', impartire: '/', invizibil: ' '}[clasaSemn(ch)] || LAT[ch] || SEMNE_MAT[ch] || '');
function explicaSemn(ch) {
  if (reInvizibil.test(ch)) return `Pe linia asta e un spațiu care nu se vede (U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}), venit de obicei dintr-un text lipit din altă parte. Cel mai sigur: șterge toată linia și scrie-o din nou, de mână.`;
  if (reLiniuta.test(ch)) return `Semnul ${ch} seamănă cu minus, dar în C++ nu e minus: îl pune uneori telefonul sau vine dintr-un text lipit. Șterge-l și scrie - din bara de semne (la i-- scrii două semne -).`;
  if (reGhilimele.test(ch)) return `${ch} sunt ghilimele întoarse: nu sunt semnul din C++. Le pune uneori telefonul sau vin dintr-un text lipit. Șterge-le și pune " din bara de semne.`;
  if (reApostrof.test(ch)) return `${ch} e un apostrof întors: nu e semnul din C++. Șterge-l. O literă stă între apostrofuri drepte (' din bara de semne), iar un text între ghilimele drepte (").`;
  if (LAT[ch]) return `Semnul ${ch} seamănă cu ${LAT[ch]}, dar e de pe altă tastatură și în C++ nu e același. Șterge-l și scrie ${LAT[ch]} din bara de semne.`;
  if (ch === '\u00D7' || ch === '\u00B7' || ch === '\u22C5') return `În C++, înmulțirea se scrie cu *: a * 2. Șterge semnul ${ch} și scrie * din bara de semne.`;
  if (ch === '\u00F7' || ch === '\u2236') return `În C++, împărțirea se scrie cu /: a / 2. Șterge semnul ${ch} și scrie / din bara de semne.`;
  if (SEMNE_MAT[ch]) return `În C++, ${ch} se scrie ${SEMNE_MAT[ch]}. Șterge semnul ${ch} și scrie ${SEMNE_MAT[ch]} din bara de semne.`;
  if (ch === '\u2026') return 'Semnul … (trei puncte puse dintr-odată) nu are sens în C++ în afara unui text. Șterge-l.';
  return `Semnul ${ch} nu face parte din C++ în afara unui text. Șterge-l sau, dacă vrei să-l afișezi, pune-l între ghilimele.`;
}
const eLitera = ch => /^[\p{L}\p{N}\p{M}]/u.test(ch);
function semnDinMesaj(m) {        /* semnul străin din mesajul lui g++: scris ca atare sau ca \U0000xxxx; literele cu diacritice nu sunt semne */
  let r = /^extended character (.)/su.exec(m);
  if (r) return r[1];
  const re = /\\U([0-9a-f]{8})/g;
  while ((r = re.exec(m))) { const ch = String.fromCodePoint(parseInt(r[1], 16)); if (!eLitera(ch)) return ch; }
  return null;
}
/* ---------------- compilatorul: analizează și produce codul mașinii, dintr-o singură trecere, ca g++ (ordinea erorilor) ---------------- */
const CUVINTE = new Set('alignas alignof asm auto bool break case catch char char16_t char32_t char8_t class const const_cast constexpr continue decltype default delete do double dynamic_cast else enum explicit export extern false float for friend goto if inline int long mutable namespace new noexcept nullptr operator private protected public register reinterpret_cast return short signed sizeof static static_assert static_cast struct switch template this thread_local throw true try typedef typeid typename union unsigned using virtual void volatile wchar_t while'.split(' '));
const ALT_OP = {and: '&&', or: '||', not: '!', not_eq: '!=', bitand: '&', bitor: '|', xor: '^', compl: '~', and_eq: '&=', or_eq: '|=', xor_eq: '^='};
const OPS = ['<<=', '>>=', '...', '->*', '<<', '>>', '<=', '>=', '==', '!=', '&&', '||', '++', '--', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '->', '::', '.*', '{', '}', '(', ')', '[', ']', ';', ',', '.', ':', '?', '=', '+', '-', '*', '/', '%', '<', '>', '!', '~', '&', '|', '^', '#'];
const DIRECTIVE = 'define undef include if ifdef ifndef else elif elifdef elifndef endif pragma error warning line import include_next assert unassert ident sccs'.split(' ');
const MEMBRI_IOS = 'clear fail eof good bad rdstate setstate exceptions tie rdbuf fill precision width flags setf unsetf imbue getloc copyfmt narrow widen init move swap sync_with_stdio'.split(' ');
const MEMBRI_IN = 'get getline ignore peek putback read readsome gcount sync tellg seekg unget'.split(' ').concat(MEMBRI_IOS);
const MEMBRI_OUT = 'put write flush tellp seekp'.split(' ').concat(MEMBRI_IOS);
const AMBIGUE = new Set('max min swap end begin next prev size data empty find copy fill move left right hex dec oct fixed distance advance string pair array exception rank search equal mismatch less greater plus minus divides modulus negate tuple get ws flush ends hash cin cout cerr clog endl iterator allocator'.split(' '));
const PLAFON_EXPLICATIE = 50000;        /* pașii probei de după reparație: mic, ca explicația să nu coste */
/* R4, B4-1: a doua rulare a probei, cu date mici nenule (un for fără i++ cu n citit nu pornește la intrare goală). 0 0 la capăt: citirile „până la 0” se termină */
const INTRARE_EXPLICATIE = '3 3 3 3 3 3 3 3 3 3 0 0';
/* R5 (decizia dirijorului, punctul 2): proba se rulează pe șase seturi; buclă sau limita ieșirii în ORICARE = neutra. Perechile descrescătoare și
   crescătoare prind sensul ghicit al lui for cu != (B5-1), negativul prinde i != n pornit de la 0, -1 singur prinde citirea „până la -1” */
const SEMNE_OPRIRE = ' 0 -1 0 -1';
const INTRARI_EXPLICATIE = ['', INTRARE_EXPLICATIE, '5 2 5 2 5 2 5 2 5 2 0 0', '1 9 1 9 1 9 1 9 1 9 0 0', '-5 0 0 0 0 0 0 0 0 0 0 0', '-1'];
/* R5, punctul 4: echilibrul acoladelor (fără cele din texte, litere și comentarii): { minus } */
function echilibruAcolade(s) {
  let d = 0;
  for (let k = 0; k < s.length; k++) {
    const c = s[k];
    if (c === '/' && s[k + 1] === '/') { while (k < s.length && s[k] !== '\n') k++; continue; }
    if (c === '/' && s[k + 1] === '*') { const z = s.indexOf('*/', k + 2); k = z < 0 ? s.length : z + 1; continue; }
    if (c === '"' || c === "'") { k++; while (k < s.length && s[k] !== c && s[k] !== '\n') { if (s[k] === '\\') k++; k++; } continue; }
    if (c === '{') d++; else if (c === '}') d--;
  }
  return d;
}
const SEMNE_LIPITE = new Set(['++', '--', '<=', '>=', '==', '!=', '<<', '>>', '&&', '||', '+=', '-=', '*=', '/=', '%=']);
const ABANDON = {abandon: true};
const ASTEAPTA = {asteapta: true};
const numeAfis = s => s.replace(/[^\x00-\x7F]/gu, c => '\\U' + c.codePointAt(0).toString(16).padStart(8, '0'));
/* caracterele permise într-un nume: lista din C++11 (anexa E), pe care g++ o aplică la -std=c++17 */
const INTERVALE_NUME = [0xA8, 0xA8, 0xAA, 0xAA, 0xAD, 0xAD, 0xAF, 0xAF, 0xB2, 0xB5, 0xB7, 0xBA, 0xBC, 0xBE, 0xC0, 0xD6, 0xD8, 0xF6, 0xF8, 0xFF, 0x100, 0x167F, 0x1681, 0x180D, 0x180F, 0x1FFF, 0x200B, 0x200D, 0x202A, 0x202E, 0x203F, 0x2040, 0x2054, 0x2054, 0x2060, 0x206F, 0x2070, 0x218F, 0x2460, 0x24FF, 0x2776, 0x2793, 0x2C00, 0x2DFF, 0x2E80, 0x2FFF, 0x3004, 0x3007, 0x3021, 0x302F, 0x3031, 0x303F, 0x3040, 0xD7FF, 0xF900, 0xFD3D, 0xFD40, 0xFDCF, 0xFDF0, 0xFE44, 0xFE47, 0xFFFD, 0x10000, 0x1FFFD, 0x20000, 0x2FFFD, 0x30000, 0x3FFFD, 0x40000, 0x4FFFD, 0x50000, 0x5FFFD, 0x60000, 0x6FFFD, 0x70000, 0x7FFFD, 0x80000, 0x8FFFD, 0x90000, 0x9FFFD, 0xA0000, 0xAFFFD, 0xB0000, 0xBFFFD, 0xC0000, 0xCFFFD, 0xD0000, 0xDFFFD, 0xE0000, 0xEFFFD];
const eCaracterNume = cp => { for (let i = 0; i < INTERVALE_NUME.length; i += 2) if (cp >= INTERVALE_NUME[i] && cp <= INTERVALE_NUME[i + 1]) return true; return false; };

function compileaza(sursa, optCompilare) {
  const src = String(sursa).replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');   /* BOM la început: g++ îl ignoră */
  const C = {erori: [], refuz: null, inc: {io: false, cm: false, im: false}, usingStd: false, vizibil: new Set()};
  const eroare = (l, c, m, cls) => { C.erori.push({linie: l, col: c, mesaj: m, clasa: cls || 'error', explicatie: ''}); };
  const amana = (l, ce, mesaj) => { if (!C.refuz) C.refuz = {linie: l, ce, mesaj: mesaj || textRefuz(ce, l)}; };   /* g++ poate primi construcția: se merge mai departe, ca o eroare de mai jos să aibă întâietate */
  const refuza = (l, ce, mesaj) => { amana(l, ce, mesaj); throw ABANDON; };

  /* ---- 1. împărțirea în cuvinte: g++ citește tot fișierul ÎNTÂI, deci erorile de aici apar primele ---- */
  const T = [];
  function lex() {
    let i = 0, line = 1, ls = 0, inceput = true;
    const n = src.length;
    const col = k => k - ls + 1;
    function esc(k, cod) {              /* k stă pe caracterul de după \; întoarce [octeți, k nou] */
      const c = src[k];
      const simple = {n: 10, t: 9, r: 13, a: 7, b: 8, f: 12, v: 11, '\\': 92, "'": 39, '"': 34, '?': 63, e: 27};
      if (c === 'x') { let j = k + 1, v = 0; while (j < n && /[0-9a-fA-F]/.test(src[j])) { v = (v * 16 + parseInt(src[j], 16)) & 255; j++; } return [String.fromCharCode(v), j]; }
      if (c >= '0' && c <= '7') { let j = k, v = 0; while (j < n && j < k + 3 && src[j] >= '0' && src[j] <= '7') { v = v * 8 + (+src[j]); j++; } return [String.fromCharCode(v & 255), j]; }
      if (c in simple) return [String.fromCharCode(simple[c]), k + 1];
      if (c === undefined) return ['', k];
      return [utf8(c), k + 1];          /* secvență necunoscută: g++ dă doar avertisment și păstrează litera */
    }
    while (i < n) {
      const c = src[i];
      if (c === '\n') { i++; line++; ls = i; inceput = true; continue; }
      if (c === ' ' || c === '\t' || c === '\f' || c === '\v') { i++; continue; }
      if (c === '\\' && src[i + 1] === '\n') { i += 2; line++; ls = i; continue; }
      if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') i++; continue; }
      if (c === '/' && src[i + 1] === '*') {
        const e = src.indexOf('*/', i + 2);
        if (e < 0) { eroare(line, col(i), 'unterminated comment'); i = n; break; }
        for (let k = i; k < e; k++) if (src[k] === '\n') { line++; ls = k + 1; }
        i = e + 2; continue;
      }
      if (c === '#' && inceput) {
        const lin = line;
        let j = i + 1;
        while (j < n && (src[j] === ' ' || src[j] === '\t')) j++;
        const s0 = j;
        while (j < n && /\w/.test(src[j])) j++;
        const dir = src.slice(s0, j);
        let e = src.indexOf('\n', j); if (e < 0) e = n;
        const rest = src.slice(j, e).replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, ' ').trim();
        if (dir === 'include') {
          const mm = rest.match(/^<([^>\n]*)>/) || rest.match(/^"([^"\n]*)"/);
          if (!mm && rest[0] === '<') { eroare(lin, col(j) + 1, "missing terminating '>' character"); C.fatal = true; throw ABANDON; }
          else if (!mm) eroare(lin, col(j) + 1, '\'#include\' expects \'"FILENAME"\' or \'<FILENAME>\'');
          else {
            const h = mm[1].trim().toLowerCase();   /* pe Windows numele fișierelor nu țin cont de majuscule: <Iostream> merge */
            if (ANTETE_BUNE[h]) ANTETE_BUNE[h].forEach(x => { C.inc[x] = true; });
            else if (ANTETE_REALE.has(h)) { try { refuza(lin, `biblioteca <${h}>`); } catch (x) { throw x; } }
            else { eroare(lin, col(j) + 1, `${mm[1].trim()}: No such file or directory`, 'fatal error'); C.fatal = true; throw ABANDON; }
          }
        } else if (dir && DIRECTIVE.includes(dir)) refuza(lin, `directiva #${dir}`);
        else if (/^\d+$/.test(dir)) { /* # 5: g++ îl citește ca pe un semn de linie */ }
        else if (!dir && src[j] !== undefined && src[j] !== '\n') eroare(lin, j - ls + 1, `invalid preprocessing directive #${src[j]}`);
        else if (dir) {
          const s = ceaMaiApropiata(dir, [DIRECTIVE.slice(0, 15)]);
          eroare(lin, s0 - ls + 1, `invalid preprocessing directive #${numeAfis(dir)}` + (s ? `; did you mean #${s}?` : ''));
        }
        i = e; continue;
      }
      inceput = false;
      const startCol = col(i);
      /* șir de caractere */
      if (c === '"') {
        let j = i + 1, b = '', ok = false;
        while (j < n && src[j] !== '\n') {
          if (src[j] === '"') { ok = true; break; }
          if (src[j] === '\\') { const r = esc(j + 1); b += r[0]; j = r[1]; continue; }
          const cp = src.codePointAt(j), ch = String.fromCodePoint(cp);
          b += utf8(ch); j += ch.length;
        }
        if (!ok) { eroare(line, startCol, 'missing terminating " character'); i = j; continue; }
        T.push({k: 'str', v: b, line, col: startCol, eline: line, ecol: col(j) + 1});
        i = j + 1; continue;
      }
      if (c === "'") {
        let j = i + 1, b = '', ok = false;
        while (j < n && src[j] !== '\n') {
          if (src[j] === "'") { ok = true; break; }
          if (src[j] === '\\') { const r = esc(j + 1); b += r[0]; j = r[1]; continue; }
          const cp = src.codePointAt(j), ch = String.fromCodePoint(cp);
          b += utf8(ch); j += ch.length;
        }
        if (!ok) { eroare(line, startCol, "missing terminating ' character"); i = j; continue; }
        if (b.length === 0) { eroare(line, startCol, 'empty character constant'); T.push({k: 'chr', v: 0, ty: 'char', line, col: startCol, eline: line, ecol: col(j) + 1}); i = j + 1; continue; }
        let v, ty = 'char';
        if (b.length === 1) v = laChar(b.charCodeAt(0));
        else { ty = 'int'; v = 0; for (const o of b) v = (v << 8 | o.charCodeAt(0)) | 0; }
        T.push({k: 'chr', v, ty, line, col: startCol, eline: line, ecol: col(j) + 1});
        i = j + 1; continue;
      }
      /* număr */
      if ((c >= '0' && c <= '9') || (c === '.' && src[i + 1] >= '0' && src[i + 1] <= '9')) {
        let j = i + 1;
        while (j < n) {
          const d = src[j];
          if ((d === '+' || d === '-') && /[eEpP]/.test(src[j - 1]) && !/^0[xX]/.test(src.slice(i, i + 2))) { j++; continue; }
          if (/[\w.]/.test(d) || (d === "'" && /\w/.test(src[j + 1] || ''))) { j++; continue; }
          if (d > '\x7F') {          /* un semn lipit de număr: g++ îl citește ca parte din număr */
            const ch = String.fromCodePoint(src.codePointAt(j));
            if (!eCaracterNume(ch.codePointAt(0))) eroare(line, col(j), `extended character ${ch} is not valid in an identifier`);
            j += ch.length; continue;
          }
          break;
        }
        const txt = src.slice(i, j);
        T.push({k: 'num', txt, line, col: startCol, eline: line, ecol: col(j)});
        i = j; continue;
      }
      /* nume */
      const cp0 = src.codePointAt(i), ch0 = String.fromCodePoint(cp0);
      if (/[A-Za-z_$]/.test(c) || cp0 > 127) {
        let j = i, nume = '';
        while (j < n) {
          const cp = src.codePointAt(j), ch = String.fromCodePoint(cp);
          if (cp < 128) { if (!/[\w$]/.test(ch)) break; }
          else if (!eCaracterNume(cp)) eroare(line, col(j), `extended character ${ch} is not valid in an identifier`);
          nume += ch; j += ch.length;
        }
        if (CUVINTE.has(nume)) T.push({k: 'kw', v: nume, line, col: startCol, eline: line, ecol: col(j)});
        else if (ALT_OP[nume]) T.push({k: 'op', v: ALT_OP[nume], line, col: startCol, eline: line, ecol: col(j)});
        else T.push({k: 'id', v: nume, line, col: startCol, eline: line, ecol: col(j)});
        i = j; void ch0; continue;
      }
      /* operator */
      let gasit = null;
      for (const o of OPS) if (src.startsWith(o, i)) { gasit = o; break; }
      if (gasit && gasit !== '#') { T.push({k: 'op', v: gasit, line, col: startCol, eline: line, ecol: col(i + gasit.length)}); i += gasit.length; continue; }
      eroare(line, startCol, `stray '${c}' in program`);
      i++;
    }
    T.push({k: 'eof', line, col: col(i), eline: line, ecol: col(i)});
  }

  /* ---- 2. mașina: variabilele, ieșirea, intrarea ---- */
  const S = [];
  const M = {out: '', inel: null, total: 0, nl: 0, pc: 0, linie: 0, pasi: 0, plafon: 100000000, limIesire: 2000000, fixed: false, prec: 6, ibuf: '', ip: 0, iend: true, ifail: false, ieof: false, exit: 0, r: 0, ti: 0, sari: false};
  const code = [], K_EXPR = 0, K_JF = 1, K_JMP = 2, K_LINE = 3, K_CIN = 4, K_END = 5, K_JT = 6;
  const emit = (k, f, t) => { code.push({k, f, t}); return code.length - 1; };
  const emitLinie = tok => { code.push({k: K_LINE, l: tok.line, c: tok.col}); };
  /* Ieșirea: pentru rularea dintr-o bucată (teste, oracol), un șir. În pagină, un inel de octeți: un program care afișează la nesfârșit nu
     mai lasă în urmă lanțuri de șiruri pe care colectorul să le mute (pauze lungi), iar pagina ține doar coada și numără tot. */
  const scrie = s => {
    const I = M.inel;
    if (I) {
      const n = I.length; let q = M.total;
      for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); I[q++ % n] = c; if (c === 10) M.nl++; }
      M.total = q;
      return;
    }
    M.out += s;
    if (M.out.length > M.limIesire) throw new Oprire('iesire', 'Programul a afișat peste ' + M.limIesire.toLocaleString('ro-RO') + ' de caractere și nu s-a terminat, așa că rularea s-a oprit aici. Fie are o repetiție care nu se termină, fie afișează pur și simplu foarte mult.');
  };
  function dinInel(a, b) {          /* octeții de la poziția absolută a până la b, ca șir */
    const I = M.inel, n = I.length;
    a = Math.max(a, M.total - n); if (b == null || b > M.total) b = M.total;
    let r = '';
    while (a < b) {
      const k = a % n, c = Math.min(b - a, n - k, 8192);
      r += String.fromCharCode.apply(null, I.subarray(k, k + c));
      a += c;
    }
    return r;
  }
  const opreste = (tip, m) => { throw new Oprire(tip, m); };
  const nvar = n => opreste('neinit', `Variabila ${n} n-a primit nicio valoare până aici, iar programul o folosește. C++ nu spune ce e în ea. ${NU_E_SIGUR} Dă-i o valoare înainte s-o folosești.`);
  const nel = (n, j) => opreste('neinit', `Elementul ${n}[${j}] n-a primit nicio valoare până aici, iar programul îl folosește. C++ nu spune ce e în el. ${NU_E_SIGUR} Dă-i o valoare înainte să-l folosești.`);
  const nind = (n, j, len) => opreste('indice', `Indicele ${j} nu există în tabloul ${n}: ${len === 0 ? 'tabloul nu are niciun element' : `tabloul are ${len} ${len === 1 ? 'element, cu indicele 0' : `elemente, cu indicii de la 0 la ${len - 1}`}`}. ${NU_E_SIGUR} Verifică valoarea indicelui.`);
  const imp0 = () => opreste('imp0', 'Împărțire la 0 între numere întregi (sau rest la împărțirea cu 0). C++ nu spune ce se întâmplă aici; compilat cu g++, programul se oprește pe loc, cu o eroare, și nu mai afișează nimic. Verifică împărțitorul înainte de împărțire.');
  const impOv = () => opreste('imp0', 'Împărțirea celui mai mic număr int la -1 nu are rezultat în int. C++ nu spune ce se întâmplă aici; compilat cu g++, programul se oprește pe loc, cu o eroare.');

  function opFn(op, t) {
    if (t === 'int') switch (op) {
      case '+': return (a, b) => (a + b) | 0;
      case '-': return (a, b) => (a - b) | 0;
      case '*': return Math.imul;
      case '/': return (a, b) => { if (b === 0) imp0(); if (b === -1 && a === MIN32) impOv(); return (a / b) | 0; };
      case '%': return (a, b) => { if (b === 0) imp0(); if (b === -1) { if (a === MIN32) impOv(); return 0; } return (a % b) | 0; };
      case '&': return (a, b) => a & b;
      case '|': return (a, b) => a | b;
      case '^': return (a, b) => a ^ b;
      case '<<': return (a, b) => a << (b & 31);
      case '>>': return (a, b) => a >> (b & 31);
    }
    if (t === 'll') switch (op) {
      case '+': return (a, b) => BigInt.asIntN(64, a + b);
      case '-': return (a, b) => BigInt.asIntN(64, a - b);
      case '*': return (a, b) => BigInt.asIntN(64, a * b);
      case '/': return (a, b) => { if (b === 0n) imp0(); if (b === -1n && a === LLMIN) impOv(); return a / b; };
      case '%': return (a, b) => { if (b === 0n) imp0(); if (b === -1n && a === LLMIN) impOv(); return a % b; };
      case '&': return (a, b) => a & b;
      case '|': return (a, b) => a | b;
      case '^': return (a, b) => a ^ b;
      case '<<': return (a, b) => BigInt.asIntN(64, a << (b & 63n));
      case '>>': return (a, b) => a >> (b & 63n);
    }
    if (t === 'float') switch (op) {
      case '+': return (a, b) => Math.fround(a + b);
      case '-': return (a, b) => Math.fround(a - b);
      case '*': return (a, b) => Math.fround(a * b);
      case '/': return (a, b) => Math.fround(a / b);
    }
    if (t === 'double') switch (op) {
      case '+': return (a, b) => a + b;
      case '-': return (a, b) => a - b;
      case '*': return (a, b) => a * b;
      case '/': return (a, b) => a / b;
    }
    return null;
  }
  const CMP = {'<': (a, b) => a < b ? 1 : 0, '>': (a, b) => a > b ? 1 : 0, '<=': (a, b) => a <= b ? 1 : 0, '>=': (a, b) => a >= b ? 1 : 0, '==': (a, b) => a === b ? 1 : 0, '!=': (a, b) => a !== b ? 1 : 0};

  /* ---- 3. analiza: se face odată cu generarea, în ordinea lui g++ ---- */
  let p = 0;
  const isOp = v => T[p].k === 'op' && T[p].v === v;
  const isKw = v => T[p].k === 'kw' && T[p].v === v;
  const urm = (d) => T[Math.min(p + (d || 1), T.length - 1)];
  const inainte = t => t.k === 'eof' ? 'at end of input' : t.k === 'id' ? `before '${numeAfis(t.v)}'` : t.k === 'kw' ? `before '${t.v}'` : t.k === 'num' ? 'before numeric constant' : t.k === 'str' ? 'before string constant' : t.k === 'chr' ? (t.v >= 33 && t.v <= 126 ? `before '${String.fromCharCode(t.v)}'` : `before '\\x${(t.v >>> 0).toString(16)}'`) : `before '${t.v}' token`;
  const sint = (m, t) => { t = t || T[p]; eroare(t.line, t.col, m); throw ABANDON; };
  let inIf = false;        /* suntem în corpul unui if, ca la g++: acolo, un else într-un bloc înseamnă că blocul n-a fost închis */
  const inBucla = f => { const v = inIf; inIf = false; f(); inIf = v; };
  const sem = (m, t) => { eroare(t.line, t.col, m); };
  /* cum arată un cuvânt în explicație */
  const arata = t => t.k === 'chr' ? 'litera dintre apostrofuri' : t.k === 'eof' ? 'sfârșitul programului' : `„${t.k === 'num' ? t.txt : t.k === 'str' ? `"${dinOcteti(t.v)}"` : String(t.v)}”`;
  const eValoare = t => t.k === 'id' || t.k === 'num' || t.k === 'str' || t.k === 'chr' || t.k === 'kw';
  function cere(op) {
    if (isOp(op)) { p++; return T[p - 1]; }
    const t = T[p], m = `expected '${op}' ${inainte(t)}`;
    if (';)]},'.includes(op) && p > 0) { eroare(T[p - 1].eline, T[p - 1].ecol, m); throw ABANDON; }
    sint(m, t);
  }

  const domenii = [new Map()];
  const toateVar = [];
  let sloturi = 0;
  const initGlobal = [];
  let nivelBucle = [];
  let inMain = false, adancime = 0, stivaLocala = 0, stivaMare = null, instrStart = 0, inCapFor = false;
  const etichete = [];
  const pune = () => domenii.push(new Map());
  function scoate() { const d = domenii.pop(); d.forEach(v => { if (v.pc1 == null) v.pc1 = code.length; }); }
  function cauta(n) { for (let i = domenii.length - 1; i >= 0; i--) { const v = domenii[i].get(n); if (v) return v; } return null; }
  const declStr = (v) => `${v.con ? 'const ' : ''}${NUME_TIP[v.ty]} ${numeAfis(v.nume)}${v.arr ? ` [${v.n == null ? '' : v.n}]` : ''}`;
  function declara(nume, ty, con, arr, n, tok) {
    const d = domenii[domenii.length - 1];
    const v = {nume, ty, con, arr, n, slot: sloturi++, line: tok.line, glob: domenii.length === 1, nivel: adancime, pc0: code.length, pc1: null, ui: null};
    const vechi = d.get(nume) || (d.forInit && d.forInit.get(nume));
    if (vechi && vechi.ty !== 'err') {
      if (vechi.ty === ty && !!vechi.con === !!con && !!vechi.arr === !!arr) sem(`redeclaration of '${declStr(v)}'`, tok);
      else sem(`conflicting declaration '${declStr(v)}'`, tok);
    }
    d.set(nume, v); toateVar.push(v);
    return v;
  }
  const eErr = t => ({ty: 'err', ev: () => 0, tk: t, rd: [], wr: []});
  const uneste = (a, b) => (a && a.length ? (b && b.length ? a.concat(b) : a) : (b || []));
  const seIntersect = (a, b) => a.some(x => b.includes(x));
  const eFlux = E => E.ty === 'ostream' || E.ty === 'istream';
  function tn(E) {
    if (eFlux(E)) return E.sn;
    if (E.ty === 'cstr') return `const char [${E.n}]`;
    if (E.ty === 'ptr') return `${E.pt}*`;
    if (E.ty === 'arr') return `${E.v.con ? 'const ' : ''}${NUME_TIP[E.v.ty]} [${E.v.n == null ? '' : E.v.n}]`;
    if (E.ty === 'manip' || E.ty === 'fn') return E.tipAfis;
    return `${E.con ? 'const ' : ''}${NUME_TIP[E.ty] || E.ty}`;
  }
  const q = E => (eFlux(E) ? tn(E) : `'${tn(E)}'`);
  const SN_COUT = "'std::ostream' {aka 'std::basic_ostream<char>'}", SN_CIN = "'std::istream' {aka 'std::basic_istream<char>'}";
  const SN_O1 = "'std::basic_ostream<char>'", SN_O2 = "'std::basic_ostream<char>::__ostream_type' {aka 'std::basic_ostream<char>'}";
  const SN_I1 = "'std::basic_istream<char>'", SN_I2 = "'std::basic_istream<char>::__istream_type' {aka 'std::basic_istream<char>'}";
  const noMatch = (op, a, b, t) => { sem(`no match for 'operator${op}' (operand types are ${q(a)} and ${q(b)})`, t); return eErr(t); };
  const cinInterzis = t => refuza(t.line, 'citirea cu cin în mijlocul unui calcul');
  /* ce fel de adresă e: numele unui tablou, un text între ghilimele sau rezultatul unui calcul cu ele */
  const ptNume = E => (E.ty === 'ptr' ? E.pt : E.ty === 'arr' ? `${E.v.con ? 'const ' : ''}${NUME_TIP[E.v.ty]}` : E.ty === 'cstr' ? 'const char' : null);
  const adresaInVar = (E, la, cum, t) => {
    if (la === 'bool') return () => 1;
    if (la === 'double' || la === 'float') sem(`cannot convert '${ptNume(E)}*' to '${NUME_TIP[la]}' in ${cum}`, E.tk || t);
    else sem(`invalid conversion from '${ptNume(E)}*' to '${NUME_TIP[la] || la}' [-fpermissive]`, E.tk || t);
    return () => ZERO(la);
  };
  function conv(E, la) {
    if (ptNume(E)) return adresaInVar(E, la, 'assignment', E.tk);
    if (E.supra) { sem(`cannot resolve overloaded function '${E.supra}' based on conversion to type '${NUME_TIP[la] || la}'`, E.tk); return () => ZERO(la); }
    if (E.ty === 'manip') refuza(E.tk.line, 'fixed sau setprecision folosite ca valori');
    if (E.ty === 'fn') refuza(E.tk.line, `numele funcției ${E.nume} fără paranteze`);
    if (E.cin) cinInterzis(E.tk);
    const f = cvf(E.ty, la), ev = E.ev;
    return f ? () => f(ev()) : ev;
  }
  function laBool(E) {
    if (E.cin) cinInterzis(E.tk);
    const ev = E.ev;
    switch (E.ty) {
      case 'bool': return ev;
      case 'int': case 'char': return () => ev() !== 0 ? 1 : 0;
      case 'll': return () => ev() !== 0n ? 1 : 0;
      case 'float': case 'double': return () => ev() !== 0 ? 1 : 0;
      case 'ostream': case 'istream': return ev;
      default: return () => 1;
    }
  }
  function cuOrdine(E, a, b) {            /* aceeași variabilă schimbată și folosită fără ordine: nedefinit în C++ */
    if (seIntersect(a.wr, b.wr) || seIntersect(a.wr, b.rd) || seIntersect(b.wr, a.rd)) {
      const num = toateVar.find(v => a.wr.concat(b.wr).includes(v.slot));
      E.ev = () => opreste('ordine', `Variabila ${num ? num.nume : ''} e schimbată (cu ++, -- sau =) și folosită în aceeași expresie, iar C++ nu spune care se face întâi. ${NU_E_SIGUR} Scrie calculul în două instrucțiuni.`);
      E.isC = false;
    }
    return E;
  }

  function binar(op, a, b, t) {
    if (a.ty === 'err' || b.ty === 'err') return eErr(t);
    if ((a.supra && ARIT.has(b.ty)) || (b.supra && ARIT.has(a.ty))) { sem(`invalid operands of types ${q(a)} and ${q(b)} to binary 'operator${op}'`, t); return eErr(t); }
    if (eFlux(a) || eFlux(b) || a.ty === 'manip' || b.ty === 'manip') return noMatch(op, a, b, t);
    if (a.ty === 'fn' || b.ty === 'fn') refuza(t.line, 'numele unei funcții fără paranteze');
    const cmp = CMP[op];
    const pa = ptNume(a), pb = ptNume(b);
    if (pa || pb) {
      const rau = () => { sem(`invalid operands of types ${q(a)} and ${q(b)} to binary 'operator${op}'`, t); return eErr(t); };
      if (cmp) {
        if (pa && pb) { amana(t.line, 'comparații între tablouri sau între texte'); return {ty: 'bool', ev: () => 0, tk: t, rd: [], wr: []}; }
        const alt0 = pa ? b : a;
        if (alt0.isC && alt0.ty === 'int' && alt0.ev() === 0) {
          if (op === '==' || op === '!=') { amana(t.line, 'comparații între un tablou și 0'); return {ty: 'bool', ev: () => 0, tk: t, rd: [], wr: []}; }
          sem(`ordered comparison of pointer with integer zero (${pa ? `'${pa}*' and 'int'` : `'int' and '${pb}*'`})`, t); return eErr(t);
        }
        sem('ISO C++ forbids comparison between pointer and integer [-fpermissive]', t); return eErr(t);
      }
      if (op === '+' || op === '-') {
        if (pa && pb) { if (op === '+') return rau(); amana(t.line, 'scăderi între tablouri sau între texte'); return {ty: 'll', ev: () => 0n, tk: t, rd: [], wr: []}; }
        const alt = pa ? b : a;
        if (!INTREG.has(alt.ty) || (!pa && op === '-')) return rau();
        if (a.ty === 'cstr' || b.ty === 'cstr' || (a.ty === 'ptr' && a.pt === 'const char') || (b.ty === 'ptr' && b.pt === 'const char')) amana(t.line, 'un text și un număr într-un calcul', 'Un text și un număr nu se adună în C++. g++ primește programul, dar nu afișează ce crezi: de obicei o bucată din text, fără număr. Scrie-le unul după altul: cout << "Suma: " << s;. Aici, în pagină, programul nu rulează așa.');
        else amana(t.line, 'calcule cu numele unui tablou (fără indice)', 'La lecțiile astea nu folosim calcule cu numele unui tablou (fără indice). g++ primește programul, dar rezultatul e o adresă din memorie, nu un element. Pentru un element scrii indicele: v[i]. Aici, în pagină, programul nu rulează așa.');
        return {ty: 'ptr', pt: pa || pb, ev: () => 0, tk: t, rd: [], wr: []};
      }
      return rau();
    }
    if (a.cin || b.cin) cinInterzis(t);
    if (cmp) {
      const c = comun(a.ty, b.ty), fa = conv(a, c), fb = conv(b, c);
      return cuOrdine({ty: 'bool', ev: () => cmp(fa(), fb()), isC: a.isC && b.isC, rd: uneste(a.rd, b.rd), wr: uneste(a.wr, b.wr), tk: t}, a, b);
    }
    if ('%&|^<<>>'.includes(op) && (!INTREG.has(a.ty) || !INTREG.has(b.ty))) {
      sem(`invalid operands of types ${q(a)} and ${q(b)} to binary 'operator${op}'`, t); return eErr(t);
    }
    if (op === '<<' || op === '>>') {
      const tt = promov(a.ty), fa = conv(a, tt), fb = conv(b, tt), f = opFn(op, tt);
      return cuOrdine({ty: tt, ev: () => f(fa(), fb()), isC: a.isC && b.isC, rd: uneste(a.rd, b.rd), wr: uneste(a.wr, b.wr), tk: t}, a, b);
    }
    const c = comun(a.ty, b.ty), fa = conv(a, c), fb = conv(b, c), f = opFn(op, c);
    return cuOrdine({ty: c, ev: () => f(fa(), fb()), isC: a.isC && b.isC, rd: uneste(a.rd, b.rd), wr: uneste(a.wr, b.wr), tk: t}, a, b);
  }

  /* citirea cu cin: ca în libstdc++ (sentry, _M_extract_int, _M_extract_float) */
  const eSp = c => c === 32 || (c >= 9 && c <= 13);
  function citeste(ty, pune) {
    return () => {
      if (M.ifail || M.ieof) { M.ifail = true; return true; }
      const b = M.ibuf; let i = M.ip;
      for (;;) {
        if (i >= b.length) { M.ip = i; if (M.iend) { M.ieof = true; M.ifail = true; return true; } return false; }
        if (eSp(b.charCodeAt(i))) i++; else break;
      }
      M.ip = i;
      if (ty === 'char') { pune(laChar(b.charCodeAt(i))); M.ip = i + 1; return true; }
      if (ty === 'double' || ty === 'float') {
        let j = i, x = '', dec = false, sci = false, mant = false, eof = false;
        const lu = () => { if (j >= b.length) { if (!M.iend) return null; eof = true; return -1; } return b.charCodeAt(j); };
        let c = lu(); if (c === null) return false;
        if (c === 43 || c === 45) { x += b[j]; j++; c = lu(); if (c === null) return false; }
        while (c !== -1) {
          if (c >= 48 && c <= 57) { x += b[j]; mant = true; }
          else if (c === 46 && !dec && !sci) { x += '.'; dec = true; }
          else if ((c === 101 || c === 69) && !sci && mant) {
            x += 'e'; sci = true; j++; c = lu(); if (c === null) return false;
            if (c === -1) break;
            if (c === 43 || c === 45) x += b[j]; else continue;
          } else break;
          j++; c = lu(); if (c === null) return false;
        }
        M.ip = j; if (eof) M.ieof = true;
        if (!/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/.test(x)) { pune(0); M.ifail = true; return true; }
        let v = Number(x);
        const mx = ty === 'float' ? 3.4028234663852886e38 : Number.MAX_VALUE;
        if (ty === 'float') v = Math.fround(v);
        if (v === Infinity) { v = mx; M.ifail = true; } else if (v === -Infinity) { v = -mx; M.ifail = true; }
        pune(v); return true;
      }
      /* întregi */
      let j = i, neg = false, cif = '', eof = false;
      const lu = () => { if (j >= b.length) { if (!M.iend) return null; eof = true; return -1; } return b.charCodeAt(j); };
      let c = lu(); if (c === null) return false;
      if (c === 43 || c === 45) { neg = c === 45; j++; c = lu(); if (c === null) return false; }
      while (c >= 48 && c <= 57) { cif += b[j]; j++; c = lu(); if (c === null) return false; }
      M.ip = j; if (eof) M.ieof = true;
      if (!cif) { pune(ty === 'll' ? 0n : 0); M.ifail = true; return true; }
      const val = BigInt(cif) * (neg ? -1n : 1n);
      if (ty === 'bool') {
        if (val === 0n || val === 1n) pune(Number(val)); else { pune(1); M.ifail = true; }
        return true;
      }
      if (ty === 'll') {
        if (val > LLMAX) { pune(LLMAX); M.ifail = true; } else if (val < LLMIN) { pune(LLMIN); M.ifail = true; } else pune(val);
        return true;
      }
      if (val > 2147483647n) { pune(2147483647); M.ifail = true; } else if (val < -2147483648n) { pune(MIN32); M.ifail = true; } else pune(Number(val));
      return true;
    };
  }
  function shift(op, a, b, t) {
    if (a.ty === 'err' || b.ty === 'err') return eErr(t);
    if (a.ty === 'ostream' && op === '<<') {
      if (b.cin && eFlux(b)) return noMatch(op, a, b, t);
      if (b.cin) cinInterzis(t);
      const l = a.ev;
      if (b.ty === 'fn' && !b.supra) refuza(t.line, 'setprecision fără paranteze');
      if (b.ty === 'fn') return noMatch(op, a, b, t);
      if (b.ty === 'manip') {
        const w = b.scrie;
        return {ty: 'ostream', sn: SN_O2, ev: () => { l(); w(); return 1; }, tk: t, rd: uneste(a.rd, b.rd), wr: uneste(a.wr, b.wr)};
      }
      if (eFlux(b)) return noMatch(op, a, b, t);
      const r = b.ev;
      const sn = (b.ty === 'int' || b.ty === 'char' || b.ty === 'cstr') ? SN_O1 : SN_O2;
      let w;
      switch (b.ty) {
        case 'int': case 'bool': w = () => scrie(String(r())); break;
        case 'll': w = () => scrie(r().toString()); break;
        case 'char': w = () => scrie(String.fromCharCode(r() & 255)); break;
        case 'cstr': w = () => { const s = r(), k = s.indexOf('\0'); scrie(k >= 0 ? s.slice(0, k) : s); }; break;
        case 'float': case 'double': w = () => { const v = r(); scrie(M.fixed ? fmtFixed(v, M.prec < 0 ? 6 : M.prec) : fmtGeneral(v, M.prec)); }; break;
        case 'ptr': w = () => {}; break;
        case 'arr': {
          if (b.v.ty === 'char') refuza(t.line, 'tablouri de caractere afișate ca text');
          const nu = b.v.nume;
          w = () => opreste('adresa', `cout << ${nu} nu afișează elementele tabloului, ci o adresă din memorie, un număr de forma 0x61fe00, diferit de la o rulare la alta. Pentru elemente scrii indicele: cout << ${nu}[i];.`);
          break;
        }
        default: return noMatch(op, a, b, t);
      }
      return {ty: 'ostream', sn, ev: () => { l(); w(); return 1; }, tk: t, rd: uneste(a.rd, b.rd), wr: uneste(a.wr, b.wr)};
    }
    if (a.ty === 'istream' && op === '>>') {
      if (b.ty === 'arr' && b.v.ty === 'char') refuza(t.line, 'tablouri de caractere citite ca text');
      if (b.ty === 'arr' || !b.lv || b.con || b.ty === 'manip' || b.ty === 'fn' || eFlux(b)) return noMatch(op, a, b, t);
      const ty = b.ty, lv = b.lv;
      let o;
      if (lv.kind === 'var') { const i = lv.v.slot; o = {f: citeste(ty, x => { S[i] = x; })}; }
      else { const s = lv.v.slot, loc = lv.loc; o = {pre: () => { M.ti = loc(); }, f: citeste(ty, x => { S[s][M.ti] = x; })}; }
      return {ty: 'istream', sn: ty === 'char' ? SN_I1 : SN_I2, cin: true, ops: (a.ops || []).concat([o]), ev: () => (M.ifail ? 0 : 1), tk: t, rd: uneste(a.rd, b.rd), wr: uneste(a.wr, lv.kind === 'var' ? [lv.v.slot] : [])};
    }
    if (!(a.supra && ARIT.has(b.ty)) && !(b.supra && ARIT.has(a.ty)) && (eFlux(a) || eFlux(b) || a.ty === 'manip' || b.ty === 'manip')) return noMatch(op, a, b, t);
    return binar(op, a, b, t);
  }

  function atribuire(op, a, b, t) {
    if (a.ty === 'err' || b.ty === 'err') return eErr(t);
    if (b.cin && !eFlux(b)) cinInterzis(t);
    if (a.ty === 'arr') {
      if (op !== '=' && op !== '+=' && op !== '-=') { sem(`invalid operands of types ${q(a)} and ${q(b)} to binary 'operator${op.slice(0, -1)}'`, t); return eErr(t); }
      if (b.ty === 'arr' && op === '=') sem('invalid array assignment', t); else sem(`incompatible types in assignment of ${q(b)} to ${q(a)}`, t);
      return eErr(t);
    }
    if (eFlux(a) || a.ty === 'manip') return noMatch(op, a, b, t);
    if (!a.lv) {
      if (a.rvalLv) refuza(t.line, 'atribuiri în lanț pe rezultatul altei atribuiri sau al lui ++');
      sem('lvalue required as left operand of assignment', t); return eErr(t);
    }
    if (a.con) { sem(a.lv.kind === 'var' ? `assignment of read-only variable '${numeAfis(a.lv.v.nume)}'` : 'assignment of read-only location', t); return eErr(t); }
    const ty = a.ty;
    if (eFlux(b)) { sem(`cannot convert ${tn(b)} to '${NUME_TIP[ty]}' in assignment`, b.tk || t); return eErr(t); }
    if (b.supra) { sem(`cannot resolve overloaded function '${b.supra}' based on conversion to type '${NUME_TIP[ty]}'`, b.tk); return eErr(t); }
    if (b.ty === 'manip') refuza(t.line, 'fixed sau setprecision folosite ca valori');
    let r;
    if (b.ty === 'cstr') {
      if (ty === 'bool') r = () => 1;
      else if (ty === 'double' || ty === 'float') { sem(`cannot convert ${q(b)} to '${NUME_TIP[ty]}' in assignment`, b.tk || t); return eErr(t); }
      else { sem(`invalid conversion from 'const char*' to '${NUME_TIP[ty]}' [-fpermissive]`, b.tk || t); return eErr(t); }
    } else if (b.ty === 'arr' || b.ty === 'ptr') {
      if (op !== '=' && op !== '+=') { sem(`invalid operands of types '${NUME_TIP[ty]}' and '${ptNume(b)}*' to binary 'operator${op.slice(0, -1)}'`, t); return eErr(t); }
      if (ty === 'bool' && op === '=') { amana(t.line, 'o valoare de adevăr luată dintr-un tablou'); return eErr(t); }
      adresaInVar(b, ty, 'assignment', t); return eErr(t);
    }
    const rd = uneste(a.rd, b.rd), wr = uneste(uneste(a.wr, b.wr), a.lv.kind === 'var' ? [a.lv.v.slot] : []);
    const lv = a.lv;
    if (op === '=') {
      r = r || conv(b, ty);
      if (lv.kind === 'var') { const i = lv.v.slot; return {ty, ev: () => { const x = r(); S[i] = x; return x; }, rvalLv: true, tk: t, rd, wr}; }
      const s = lv.v.slot, loc = lv.loc;
      return {ty, ev: () => { const x = r(); const j = loc(); S[s][j] = x; return x; }, rvalLv: true, tk: t, rd, wr};
    }
    const o = op.slice(0, -1);
    if ('%&|^<<>>'.includes(o) && (!INTREG.has(a.ty) || !INTREG.has(b.ty))) { sem(`invalid operands of types ${q(a)} and ${q(b)} to binary 'operator${o}'`, t); return eErr(t); }
    const shf = o === '<<' || o === '>>';
    const c = shf ? promov(ty) : comun(ty, b.ty);
    const f = opFn(o, c), rb = conv(b, c), sus = cvf(ty, c) || (x => x), jos = cvf(c, ty) || (x => x);
    if (lv.kind === 'var') {
      const i = lv.v.slot, nu = lv.v.nume;
      return {ty, ev: () => { const y = rb(); const cur = S[i]; if (cur === undefined) nvar(nu); const x = jos(f(sus(cur), y)); S[i] = x; return x; }, rvalLv: true, tk: t, rd, wr};
    }
    const s = lv.v.slot, loc = lv.loc, nu = lv.v.nume;
    return {ty, ev: () => { const y = rb(); const j = loc(); const cur = S[s][j]; if (cur === undefined) nel(nu, j); const x = jos(f(sus(cur), y)); S[s][j] = x; return x; }, rvalLv: true, tk: t, rd, wr};
  }
  function incdec(E, delta, post, t) {
    if (E.ty === 'err') return eErr(t);
    const nume = delta > 0 ? 'increment' : 'decrement', sc = delta > 0 ? '++' : '--';
    if (eFlux(E) || E.ty === 'manip') { sem(`no match for 'operator${sc}' (operand type is ${q(E)})`, t); return eErr(t); }
    if (!E.lv) {
      if (E.rvalLv && !post) refuza(t.line, 'atribuiri în lanț pe rezultatul altei atribuiri sau al lui ++');
      sem(`lvalue required as ${nume} operand`, t); return eErr(t);
    }
    if (E.con) { sem(E.lv.kind === 'var' ? `${nume} of read-only variable '${numeAfis(E.lv.v.nume)}'` : `${nume} of read-only location`, t); return eErr(t); }
    if (E.ty === 'bool') { sem(`use of an operand of type 'bool' in 'operator${sc}' is forbidden${delta > 0 ? ' in C++17' : ''}`, t); return eErr(t); }
    const ty = E.ty;
    const pas = ty === 'll' ? (delta > 0 ? (x => BigInt.asIntN(64, x + 1n)) : (x => BigInt.asIntN(64, x - 1n)))
      : ty === 'int' ? (x => (x + delta) | 0)
      : ty === 'char' ? (x => laChar(x + delta))
      : ty === 'float' ? (x => Math.fround(x + delta)) : (x => x + delta);
    const lv = E.lv;
    const wr = uneste(E.wr, lv.kind === 'var' ? [lv.v.slot] : []);
    if (lv.kind === 'var') {
      const i = lv.v.slot, nu = lv.v.nume;
      return {ty, ev: post ? (() => { const c = S[i]; if (c === undefined) nvar(nu); S[i] = pas(c); return c; }) : (() => { const c = S[i]; if (c === undefined) nvar(nu); const x = pas(c); S[i] = x; return x; }), rvalLv: !post, tk: t, rd: E.rd, wr};
    }
    const s = lv.v.slot, loc = lv.loc, nu = lv.v.nume;
    return {ty, ev: post ? (() => { const j = loc(); const c = S[s][j]; if (c === undefined) nel(nu, j); S[s][j] = pas(c); return c; }) : (() => { const j = loc(); const c = S[s][j]; if (c === undefined) nel(nu, j); const x = pas(c); S[s][j] = x; return x; }), rvalLv: !post, tk: t, rd: E.rd, wr};
  }
  function cast(tip, E, t) {
    if (E.ty === 'err') return eErr(t);
    if (E.ty === 'cstr' || E.ty === 'arr' || E.ty === 'ptr' || eFlux(E) || E.ty === 'manip') refuza(t.line, 'conversii ale unui text, ale unui tablou sau ale lui cin / cout');
    const f = conv(E, tip);
    return {ty: tip, ev: f, isC: E.isC, tk: t, rd: E.rd, wr: E.wr};
  }

  function sugereaza(n, tip) {
    const io = C.inc.io || C.inc.im, cm = C.inc.cm, lis = [], mac = [];
    if (!tip) for (let i = domenii.length - 1; i >= 0; i--) lis.push([...domenii[i].keys()].reverse());
    if (cm) lis.push((tip ? NUME_CM_TY : NUME_CM_FN).split(' '));
    if (io || cm) lis.push((tip ? NUME_IO_TY : NUME_IO_FN).split(' '));
    if (io || cm) { mac.push(NUME_IO_MAC.split(' ')); if (cm) mac.push(NUME_CM_MAC.split(' ')); }
    return ceaMaiApropiata(utf8(n), lis, mac, CHEI_DECL);   /* g++ măsoară în octeți */
  }
  function nedeclarat(n, t) {
    if (STD_DIN_ANTET[n] && C.inc[STD_DIN_ANTET[n]] && !C.usingStd && !C.vizibil.has(n)) { sem(`'${n}' was not declared in this scope; did you mean 'std::${n}'?`, t); }
    else if (STD_DIN_ANTET[n]) sem(`'${n}' was not declared in this scope`, t);
    else {
      const s = sugereaza(n, false);
      sem(`'${numeAfis(n)}' was not declared in this scope` + (s ? `; did you mean '${numeAfis(s)}'?` : ''), t);
    }
    /* g++ pune un înlocuitor cu numele ăsta în blocul curent: nu mai spune o dată aceeași eroare */
    domenii[domenii.length - 1].set(n, {nume: n, ty: 'err', slot: -1});
    return eErr(t);
  }
  const vizibilStd = n => C.usingStd || C.vizibil.has(n);
  function eConstruit(n, t, std) {       /* cout, cin, endl, fixed, setprecision, sqrt, abs, pow; null dacă nu se vede */
    const v = h => C.inc[h] && (std || vizibilStd(n));
    if (n === 'cout' && v('io')) return {ty: 'ostream', sn: SN_COUT, ev: () => 1, tk: t, rd: [], wr: []};
    if (n === 'cin' && v('io')) return {ty: 'istream', sn: SN_CIN, ev: () => (M.ifail ? 0 : 1), ops: [], tk: t, rd: [], wr: []};
    if (n === 'endl' && v('io')) return {ty: 'manip', supra: 'endl', tipAfis: '<unresolved overloaded function type>', scrie: () => scrie('\n'), tk: t, ev: () => 0, rd: [], wr: []};
    if (n === 'fixed' && v('io')) return {ty: 'manip', tipAfis: 'std::ios_base& (*)(std::ios_base&)', scrie: () => { M.fixed = true; }, tk: t, ev: () => 0, rd: [], wr: []};
    if (n === 'setprecision' && v('im')) return {ty: 'fn', nume: n, tk: t, rd: [], wr: []};
    if ((n === 'sqrt' || n === 'pow') && C.inc.cm) return {ty: 'fn', supra: n, nume: n, tk: t, rd: [], wr: []};
    if (n === 'abs' && (C.inc.io || C.inc.cm)) return {ty: 'fn', supra: n, nume: n, tk: t, rd: [], wr: []};
    return null;
  }
  const eVizibilNeacc = (n, std) => { const h = NEACC_NUME[n]; return h && C.inc[h] && (h === 'cm' || std || vizibilStd(n) || ['printf', 'scanf', 'puts', 'getchar', 'putchar', 'exit', 'system', 'rand', 'srand', 'atoi', 'atof', 'time', 'clock', 'labs', 'llabs', 'div', 'NULL'].includes(n)); };

  function primar() {
    const t = T[p];
    if (t.k === 'num') { p++; return numar(t); }
    if (t.k === 'chr') { p++; const v = t.v; return {ty: t.ty, ev: () => v, isC: true, tk: t, rd: [], wr: []}; }
    if (t.k === 'str') {
      let s = ''; while (T[p].k === 'str') { s += T[p].v; p++; }
      return {ty: 'cstr', n: s.length + 1, ev: () => s, tk: t, rd: [], wr: []};
    }
    if (t.k === 'kw') {
      if (t.v === 'true' || t.v === 'false') { p++; const v = t.v === 'true' ? 1 : 0; return {ty: 'bool', ev: () => v, isC: true, tk: t, rd: [], wr: []}; }
      if (['int', 'double', 'float', 'char', 'bool'].includes(t.v) && urm().k === 'op' && urm().v === '(') {
        p += 2; const E = expresie(); cere(')'); return cast(t.v, E, t);
      }
      if (t.v === 'static_cast') refuza(t.line, 'static_cast');
      if (t.v === 'sizeof') refuza(t.line, 'sizeof');
      if (t.v === 'new' || t.v === 'delete' || t.v === 'nullptr' || t.v === 'this') refuza(t.line, `cuvântul ${t.v}`);
      sint(`expected primary-expression ${inainte(t)}`, t);
    }
    if (t.k === 'id') {
      p++;
      if (t.v === 'std' && isOp('::') && !cauta('std')) {
        p++;
        const n = T[p];
        if (n.k !== 'id') sint(`expected unqualified-id ${inainte(n)}`, n);
        p++;
        const b = eConstruit(n.v, n, true);
        if (b) return b;
        if (eVizibilNeacc(n.v, true) || NEACC_TIP.has(n.v)) refuza(n.line, `std::${n.v}`);
        sem(`'${numeAfis(n.v)}' is not a member of 'std'`, n);
        return eErr(n);
      }
      const v = cauta(t.v);
      if (v && v.glob && AMBIGUE.has(t.v) && C.inc.io && C.usingStd && v.ty !== 'err') { sem(`reference to '${numeAfis(t.v)}' is ambiguous`, t); return eErr(t); }
      if (v) return varE(v, t);
      const b = eConstruit(t.v, t, false);
      if (b) return b;
      if (eVizibilNeacc(t.v, false)) refuza(t.line, `${t.v}`);
      if (isOp('(')) return {ty: 'nedecl', nume: t.v, tk: t, rd: [], wr: []};
      return nedeclarat(t.v, t);
    }
    if (t.k === 'op' && t.v === '(') {
      const u = urm();
      if (u.k === 'kw' && ['int', 'double', 'float', 'char', 'bool', 'long', 'const', 'unsigned', 'short', 'signed'].includes(u.v)) {
        p++;
        const sp = specificator();
        if (isOp('*') || isOp('&')) refuza(T[p].line, 'pointeri');
        cere(')');
        const E = unar();
        return cast(sp.ty, E, t);
      }
      p++;
      const E = expresie();
      cere(')');
      if (E.lv || E.cin) return E;
      return Object.assign({}, E);
    }
    if (t.k === 'op' && t.v === '::') refuza(t.line, 'operatorul ::');
    if (t.k === 'op' && t.v === '[' && urm().k === 'num') sint(`expected identifier ${inainte(urm())}`, urm());
    sint(`expected primary-expression ${inainte(t)}`, t);
  }
  function varE(v, t) {
    if (v.ty === 'err') return eErr(t);
    if (v.fn) refuza(t.line, REFUZ.functie);
    if (v.arr) return {ty: 'arr', v, ev: () => S[v.slot], tk: t, rd: [], wr: []};
    if (v.con && v.isC) { const val = v.cv; return {ty: v.ty, con: true, ev: () => val, isC: true, lv: {kind: 'var', v}, tk: t, rd: [], wr: []}; }
    const i = v.slot, nu = v.nume;
    return {ty: v.ty, con: v.con, ev: () => { const x = S[i]; if (x === undefined) nvar(nu); return x; }, lv: {kind: 'var', v}, tk: t, rd: [i], wr: []};
  }
  function numar(t) {
    const txt = t.txt.replace(/'/g, '');
    let m;
    if ((m = txt.match(/^(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?([fFlL]?)$/)) && (txt.includes('.') || m[2]) && !/^0[xXbB]/.test(txt)) {
      if (/[lL]/.test(m[3])) refuza(t.line, 'tipul long double');
      let v = Number(m[1] + (m[2] || ''));
      const ty = /[fF]/.test(m[3]) ? 'float' : 'double';
      if (ty === 'float') v = Math.fround(v);
      return {ty, ev: () => v, isC: true, tk: t, rd: [], wr: []};
    }
    m = txt.match(/^(0[xX][0-9a-fA-F]+|0[bB][01]+|\d+)([a-zA-Z_]\w*)?$/);
    if (!m) {
      if ((txt.match(/\./g) || []).length > 1) sint('too many decimal points in number', t);
      const s = txt.match(/^[\d.]+(?:[eE][+-]?\d+)?(.*)$/);
      sint(`unable to find numeric literal operator 'operator""${numeAfis(s ? s[1] : txt)}'`, t);
    }
    const suf = m[2] || '', cif = m[1];
    if (suf && !/^(l|L|ll|LL|u|U|ul|UL|ull|ULL|lu|LU|llu|LLU)$/.test(suf)) sint(`unable to find numeric literal operator 'operator""${suf}'`, t);
    if (/u/i.test(suf)) refuza(t.line, 'numere fără semn (unsigned)');
    let val;
    const baza = /^0[xX]/.test(cif) ? 16 : /^0[bB]/.test(cif) ? 2 : /^0\d/.test(cif) ? 8 : 10;
    if (baza === 8 && /[89]/.test(cif)) sint(`invalid digit '${cif.match(/[89]/)[0]}' in octal constant`, t);
    val = baza === 10 ? BigInt(cif) : baza === 8 ? BigInt('0o' + cif.slice(1)) : BigInt(cif);
    if (val > LLMAX) refuza(t.line, 'numere mai mari decât încap în long long');
    if (/^(ll|LL)$/.test(suf) || val > 2147483647n) {
      if (baza !== 10 && !/^(ll|LL)$/.test(suf) && val <= 4294967295n) refuza(t.line, 'numere fără semn (unsigned)');
      const w = val;
      return {ty: 'll', ev: () => w, isC: true, tk: t, rd: [], wr: []};
    }
    const w = Number(val);
    return {ty: 'int', ev: () => w, isC: true, tk: t, rd: [], wr: []};
  }
  function apel(f, t) {                   /* f: {ty:'fn'|'nedecl', nume}; T[p] e „(” */
    const pl = T[p]; p++;
    const a = [];
    if (!isOp(')')) { for (;;) { a.push(atrib()); if (isOp(',')) { p++; continue; } break; } }
    cere(')');
    if (f.ty === 'nedecl') return nedeclarat(f.nume, f.tk);
    if (a.some(x => x.ty === 'err')) return eErr(t);
    const n = f.nume;
    a.forEach(x => { if (x.cin) cinInterzis(x.tk || t); });
    const rd = a.reduce((r, x) => uneste(r, x.rd), []), wr = a.reduce((r, x) => uneste(r, x.wr), []);
    const nuMerge = () => { sem(`no matching function for call to '${n}(${a.map(tn).map(s => s.replace(/^'|'$/g, '')).join(', ')})'`, f.tk); return eErr(t); };
    if (n === 'setprecision') {
      if (a.length !== 1 || !ARIT.has(a[0].ty)) return nuMerge();
      const c = conv(a[0], 'int');
      return {ty: 'manip', tipAfis: 'std::_Setprecision', scrie: () => { M.prec = c(); }, tk: t, ev: () => 0, rd, wr};
    }
    if (n === 'sqrt') {
      if (a.length !== 1 || !ARIT.has(a[0].ty)) return nuMerge();
      const E = a[0];
      if (E.ty === 'float') { const e = E.ev; return {ty: 'float', ev: () => Math.fround(Math.sqrt(e())), isC: false, tk: t, rd, wr}; }
      const e = conv(E, 'double');
      return {ty: 'double', ev: () => Math.sqrt(e()), tk: t, rd, wr};
    }
    if (n === 'abs') {
      if (a.length !== 1 || !ARIT.has(a[0].ty)) return nuMerge();
      const E = a[0];
      if (E.ty === 'll') { const e = E.ev; return {ty: 'll', ev: () => { const x = e(); return x < 0n ? BigInt.asIntN(64, -x) : x; }, tk: t, rd, wr}; }
      if (E.ty === 'float' || E.ty === 'double') { const e = E.ev; return {ty: E.ty, ev: () => Math.abs(e()), tk: t, rd, wr}; }
      const e = E.ev;
      return {ty: 'int', ev: () => { const x = e(); return x < 0 ? (-x) | 0 : x; }, tk: t, rd, wr};
    }
    if (n === 'pow') {
      if (a.length !== 2 || !ARIT.has(a[0].ty) || !ARIT.has(a[1].ty)) return nuMerge();
      const tot = a[0].ty === 'float' && a[1].ty === 'float';
      const x = conv(a[0], 'double'), y = conv(a[1], 'double');
      const E = {ty: tot ? 'float' : 'double', ev: tot ? (() => Math.fround(putere(x(), y()))) : (() => putere(x(), y())), tk: t, rd, wr};
      return cuOrdine(E, a[0], a[1]);
    }
    return nuMerge();
  }

  function postfix() {
    let E = primar();
    for (;;) {
      const t = T[p];
      if (t.k !== 'op') break;
      if (t.v === '(') {
        if (E.ty === 'fn' || E.ty === 'nedecl') { E = apel(E, t); continue; }
        if (E.ty === 'err') { p++; if (!isOp(')')) { for (;;) { atrib(); if (isOp(',')) { p++; continue; } break; } } cere(')'); continue; }
        if ((E.lv && E.lv.kind === 'var') || E.ty === 'arr') { const nn = E.ty === 'arr' ? E.v.nume : E.lv.v.nume; p++; if (!isOp(')')) { for (;;) { atrib(); if (isOp(',')) { p++; continue; } break; } } cere(')'); sem(`'${numeAfis(nn)}' cannot be used as a function`, E.tk); E = eErr(t); continue; }
        const vaApel = () => { const A = []; p++; if (!isOp(')')) { for (;;) { A.push(atrib()); if (isOp(',')) { p++; continue; } break; } } cere(')'); return A; };
        const tipArg = x => (x.lv && !x.con ? tn(x) + '&' : x.lv ? tn(x) + '&' : tn(x));
        if (eFlux(E) && !E.cin && E.tk && (E.tk.v === 'cout' || E.tk.v === 'cin')) {
          const A = vaApel();
          if (!A.some(x => x.ty === 'err')) sem(`no match for call to '(${E.ty === 'ostream' ? 'std::ostream {aka std::basic_ostream<char>}' : 'std::istream {aka std::basic_istream<char>}'}) (${A.map(tipArg).join(', ')})'`, t);
          E = eErr(t); continue;
        }
        if (E.ty === 'manip') {
          const nume = E.supra || 'fixed', A = vaApel();
          if (A.length) refuza(t.line, `${nume} cu paranteze`);
          if (E.supra) sem(`no matching function for call to '${nume}()'`, E.tk);
          else sem(`too few arguments to function 'std::ios_base& std::fixed(ios_base&)'`, E.tk);
          E = eErr(t); continue;
        }
        if (ARIT.has(E.ty) && !E.lv) {
          vaApel();
          sem('expression cannot be used as a function', t);
          E = eErr(t); continue;
        }
        break;
      }
      if (t.v === '[') {
        p++;
        const I = expresie();
        cere(']');
        if (E.ty === 'err' || I.ty === 'err') { E = eErr(t); continue; }
        if (E.ty !== 'arr' || !INTREG.has(I.ty)) {
          if (E.ty === 'arr' || ARIT.has(E.ty)) {
            if (ARIT.has(E.ty) && I.ty === 'arr') refuza(t.line, 'forma indice[tablou]');
            sem(`invalid types '${E.ty === 'arr' ? tn(E) : tn(E)}[${tn(I)}]' for array subscript`, t);
            E = eErr(t); continue;
          }
          if (E.ty === 'cstr') refuza(t.line, 'indici pe un text între ghilimele');
          sem(`no match for 'operator[]' (operand types are ${q(E)} and ${q(I)})`, t);
          E = eErr(t); continue;
        }
        if (I.cin) cinInterzis(t);
        const v = E.v, s = v.slot, ix = I.ty === 'll' ? (() => Number(I.ev())) : I.ev, nu = v.nume;
        const loc = () => { const j = ix(), a = S[s]; if (j < 0 || j >= a.length) nind(nu, j, a.length); v.ui = j; return j; };
        E = {ty: v.ty, con: v.con, lv: {kind: 'elem', v, loc}, ev: () => { const j = loc(), x = S[s][j]; if (x === undefined) { if (v.glob) return 0; nel(nu, j); } return x; }, tk: t, rd: I.rd, wr: I.wr};
        continue;
      }
      if (t.v === '++' || t.v === '--') { p++; E = incdec(rez(E), t.v === '++' ? 1 : -1, true, t); continue; }
      if (t.v === '.' || t.v === '->') {
        if (eFlux(E)) {
          const u = urm(), L = E.ty === 'istream' ? MEMBRI_IN : MEMBRI_OUT;
          if (t.v === '.' && u.k === 'id' && !L.includes(u.v)) {
            const su = ceaMaiApropiata(u.v, [L]);
            p += 2;
            sem(`${E.ty === 'istream' ? "'std::istream' {aka 'class std::basic_istream<char>'}" : "'std::ostream' {aka 'class std::basic_ostream<char>'}"} has no member named '${numeAfis(u.v)}'` + (su ? `; did you mean '${su}'?` : ''), u);
            E = eErr(t); continue;
          }
          refuza(t.line, `${E.ty === 'istream' ? 'cin' : 'cout'}${t.v}${u.v || ''}`);
        }
        if (E.ty === 'err') { p++; if (T[p].k === 'id') p++; continue; }
        const u = urm();
        if (t.v === '.' && u.k === 'id' && E.lv) { p += 2; sem(`request for member '${numeAfis(u.v)}' in '${numeAfis(E.lv.v.nume)}', which is of non-class type '${tn(E)}'`, t); E = eErr(t); continue; }
        refuza(t.line, 'operatorii . și ->');
      }
      break;
    }
    return rez(E);
  }
  function rez(E) {                       /* un nume de funcție fără paranteze */
    if (E.ty === 'fn') { E.ev = () => 0; E.tipAfis = '<unresolved overloaded function type>'; }
    return E;
  }
  function unar() {
    const t = T[p];
    if (t.k === 'op') {
      switch (t.v) {
        case '++': case '--': { p++; const E = unar(); return incdec(E, t.v === '++' ? 1 : -1, false, t); }
        case '+': case '-': {
          p++; const E = unar();
          if (E.ty === 'err') return eErr(t);
          if (!ARIT.has(E.ty)) { if (eFlux(E)) { sem(`no match for 'operator${t.v}' (operand type is ${q(E)})`, t); return eErr(t); } sem(`wrong type argument to unary ${t.v === '-' ? 'minus' : 'plus'}`, t); return eErr(t); }
          const ty = promov(E.ty), e = conv(E, ty);
          let f;
          if (t.v === '+') f = e;
          else if (ty === 'int') f = () => (-e()) | 0;
          else if (ty === 'll') f = () => BigInt.asIntN(64, -e());
          else f = () => -e();
          return {ty, ev: f, isC: E.isC, tk: t, rd: E.rd, wr: E.wr};
        }
        case '!': {
          p++; const E = unar();
          if (E.ty === 'err') return eErr(t);
          if (E.cin) { return {ty: 'bool', cin: true, emite: () => { spreR(E); emit(K_EXPR, () => { M.r = M.r ? 0 : 1; }); }, ev: () => 0, tk: t, rd: E.rd, wr: E.wr}; }
          const f = laBool(E);
          return {ty: 'bool', ev: () => (f() ? 0 : 1), isC: E.isC, tk: t, rd: E.rd, wr: E.wr};
        }
        case '~': {
          p++; const E = unar();
          if (E.ty === 'err') return eErr(t);
          if (!INTREG.has(E.ty)) { sem('wrong type argument to bit-complement', t); return eErr(t); }
          const ty = promov(E.ty), e = conv(E, ty);
          return {ty, ev: ty === 'll' ? (() => ~e()) : (() => ~e()), isC: E.isC, tk: t, rd: E.rd, wr: E.wr};
        }
        case '*': {
          p++; const E = unar();
          if (E.ty === 'err') return eErr(t);
          if (ARIT.has(E.ty)) { sem(`invalid type argument of unary '*' (have '${NUME_TIP[E.ty]}')`, t); return eErr(t); }
          if (E.ty === 'arr' || E.ty === 'ptr' || E.ty === 'cstr') refuza(t.line, 'pointeri');
          refuza(t.line, 'semnul * în fața unui nume care nu e număr');
          break;
        }
        case '&': {
          p++; const E = unar();
          if (E.ty === 'err') return eErr(t);
          if (ARIT.has(E.ty) && E.lv) { amana(t.line, 'pointeri'); return {ty: 'ptr', pt: `${E.con ? 'const ' : ''}${NUME_TIP[E.ty]}`, ev: () => 0, tk: t, rd: [], wr: []}; }
          if (ARIT.has(E.ty)) { sem("lvalue required as unary '&' operand", t); return eErr(t); }
          refuza(t.line, 'semnul & în fața unui tablou sau a unui text');
          break;
        }
      }
    }
    return postfix();
  }
  const NIVELE = [['*', '/', '%'], ['+', '-'], ['<<', '>>'], ['<', '>', '<=', '>='], ['==', '!='], ['&'], ['^'], ['|']];
  function binarNivel(n) {
    if (n < 0) return unar();
    let a = binarNivel(n - 1);
    for (;;) {
      const t = T[p];
      if (t.k !== 'op' || !NIVELE[n].includes(t.v)) return a;
      p++;
      const b = binarNivel(n - 1);
      a = (t.v === '<<' || t.v === '>>') ? shift(t.v, a, b, t) : binar(t.v, a, b, t);
    }
  }
  function si() {
    let a = binarNivel(NIVELE.length - 1);
    while (isOp('&&')) { const t = T[p]; p++; a = logic('&&', a, binarNivel(NIVELE.length - 1), t); }
    return a;
  }
  function sau() {
    let a = si();
    while (isOp('||')) { const t = T[p]; p++; a = logic('||', a, si(), t); }
    return a;
  }
  function logic(op, a, b, t) {
    if (a.ty === 'err' || b.ty === 'err') return eErr(t);
    const rd = uneste(a.rd, b.rd), wr = uneste(a.wr, b.wr);
    if (a.cin || b.cin) {
      return {ty: 'bool', cin: true, tk: t, rd, wr, ev: () => 0, emite: () => {
        spreR(a);
        const j = emit(op === '&&' ? K_JF : K_JT, () => M.r);
        spreR(b);
        code[j].t = code.length;
      }};
    }
    const fa = laBool(a), fb = laBool(b);
    return {ty: 'bool', ev: op === '&&' ? (() => (fa() && fb() ? 1 : 0)) : (() => (fa() || fb() ? 1 : 0)), isC: a.isC && b.isC, tk: t, rd, wr};
  }
  function conditionala() {
    const c = sau();
    if (!isOp('?')) return c;
    const t = T[p]; p++;
    const a = expresie();
    cere(':');
    const b = atrib();
    if (c.ty === 'err' || a.ty === 'err' || b.ty === 'err') return eErr(t);
    if (a.supra || b.supra) { if (a.supra) sem('overloaded function with no contextual type information', a.tk); if (b.supra) sem('overloaded function with no contextual type information', b.tk); return eErr(t); }
    const rd = uneste(c.rd, uneste(a.rd, b.rd)), wr = uneste(c.wr, uneste(a.wr, b.wr));
    if (c.cin || a.cin || b.cin) {
      if (a.cin !== b.cin && !(a.ty === b.ty)) refuza(t.line, 'citirea cu cin în mijlocul unui calcul');
      return {ty: a.ty, sn: a.sn, cin: true, tk: t, rd, wr, ev: () => 0, emite: () => {
        spreR(c);
        const j = emit(K_JF, () => M.r);
        spreR(a);
        const s = emit(K_JMP);
        code[j].t = code.length;
        spreR(b);
        code[s].t = code.length;
      }};
    }
    if (a.ty === 'ptr' || b.ty === 'ptr' || a.ty === 'arr' || b.ty === 'arr') refuza(t.line, 'calcule cu numele unui tablou (fără indice) în ?:');
    const fc = laBool(c);
    if (a.ty === 'cstr' && b.ty === 'cstr') { const x = a.ev, y = b.ev; return {ty: 'cstr', n: a.n, ev: () => (fc() ? x() : y()), tk: t, rd, wr}; }
    if ((a.ty === 'ostream' && b.ty === 'ostream')) { const x = a.ev, y = b.ev; return {ty: 'ostream', sn: a.sn, ev: () => (fc() ? x() : y()), tk: t, rd, wr}; }
    if ((a.ty === 'cstr' && b.isC && b.ty === 'int' && b.ev() === 0) || (b.ty === 'cstr' && a.isC && a.ty === 'int' && a.ev() === 0)) refuza(t.line, 'un text și 0 în aceeași expresie cu ?:');
    if (!ARIT.has(a.ty) || !ARIT.has(b.ty)) {
      const nm = E => (E.ty === 'cstr' ? "'const char*'" : q(E));
      sem(`operands to '?:' have different types ${nm(a)} and ${nm(b)}`, t);
      return eErr(t);
    }
    const ty = a.ty === b.ty ? a.ty : comun(a.ty, b.ty);
    const x = conv(a, ty), y = conv(b, ty);
    return {ty, ev: () => (fc() ? x() : y()), isC: c.isC && a.isC && b.isC, tk: t, rd, wr};
  }
  function atrib() {
    const a = conditionala();
    const t = T[p];
    if (t.k === 'op' && ['=', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<=', '>>='].includes(t.v)) {
      p++;
      if (isOp('{')) refuza(t.line, 'atribuirea cu acolade');
      const b = atrib();
      return atribuire(t.v, a, b, t);
    }
    return a;
  }
  function expresie() {
    let a = atrib();
    while (isOp(',')) {
      const t = T[p]; p++;
      const l = a, r = atrib();
      if (l.ty === 'err' || r.ty === 'err') { a = eErr(t); continue; }
      if (l.supra) { sem('left operand of comma operator cannot resolve address of overloaded function', l.tk); a = eErr(t); continue; }
      if (r.supra) { sem(`no context to resolve type of 'std::${r.supra}'`, r.tk); a = eErr(t); continue; }
      const rd = uneste(l.rd, r.rd), wr = uneste(l.wr, r.wr);
      if (l.cin || r.cin) {
        a = {ty: r.ty, sn: r.sn, cin: true, tk: t, rd, wr, ev: () => 0, emite: () => { emiteRenunta(l); spreR(r); }, parti: [l, r]};
      } else {
        const d = renunta(l), e = r.ev;
        a = {ty: r.ty, n: r.n, sn: r.sn, v: r.v, tipAfis: r.tipAfis, scrie: r.scrie ? () => { if (d) d(); r.scrie(); } : undefined, ev: () => { if (d) d(); return e(); }, tk: t, rd, wr, parti: [l, r]};
      }
    }
    return a;
  }
  /* valoarea nefolosită: o citire simplă de variabilă nu are niciun efect, nici dacă variabila n-are valoare */
  const renunta = E => (E.lv && E.lv.kind === 'var' ? null : E.ty === 'manip' ? null : E.ev);
  function spreR(E) {
    if (E.cin) {
      if (E.ops) { for (const o of E.ops) { if (o.pre) emit(K_EXPR, o.pre); emit(K_CIN, o.f); } emit(K_EXPR, () => { M.r = M.ifail ? 0 : 1; }); return; }
      E.emite(); return;
    }
    const f = laBool(E);
    emit(K_EXPR, () => { M.r = f(); });
  }
  function emiteRenunta(E) {
    if (E.parti) { emiteRenunta(E.parti[0]); emiteRenunta(E.parti[1]); return; }
    if (E.cin) { spreR(E); return; }
    const d = renunta(E);
    if (d) emit(K_EXPR, d);
  }
  function salt(E, cand) {                 /* sare când condiția e falsă (K_JF) sau adevărată (K_JT); întoarce indicele de reparat */
    const k = cand ? K_JT : K_JF;
    if (E.cin) { spreR(E); return emit(k, () => M.r); }
    if (E.supra) { sem(`cannot resolve overloaded function '${E.supra}' based on conversion to type 'bool'`, E.tk); return emit(k, () => 0); }
    if (E.ty === 'manip' && E.tipAfis === 'std::_Setprecision') refuza(E.tk.line, 'setprecision într-o condiție');
    if (E.ty === 'manip' || E.ty === 'fn') return emit(k, () => 1);    /* numele unei funcții: adevărat, ca în g++ */
    if (E.ty === 'void') return emit(k, () => 0);
    return emit(k, laBool(E));
  }

  /* ---- declarațiile ---- */
  const INCEP_TIP = new Set('int float double bool char long const unsigned signed short auto static void struct class enum union typedef extern volatile constexpr inline register template'.split(' '));
  const incepeTip = t => t.k === 'kw' && INCEP_TIP.has(t.v);
  function specificator() {
    let con = false, ty = null;
    const t0 = T[p];
    for (;;) {
      const t = T[p];
      if (t.k !== 'kw') break;
      if (t.v === 'const') { con = true; p++; continue; }
      if ((t.v === 'class' || t.v === 'struct') && ty && adancime > 0) sint(`expected primary-expression before '${t0.v}'`, t0);
      if (['int', 'float', 'double', 'bool', 'char'].includes(t.v)) {
        if (ty) { const u = urm(); if (u.k === 'id') { sem(`two or more data types in declaration of '${numeAfis(u.v)}'`, T[p + 1]); throw ABANDON; } refuza(t.line, 'două tipuri la aceeași declarație'); }
        ty = t.v; p++; continue;
      }
      if (t.v === 'long') {
        p++;
        if (isKw('long')) {
          p++;
          if (isKw('int')) p++;
          ty = 'll'; continue;
        }
        if (isKw('double')) refuza(t.line, 'tipul long double');
        refuza(t.line, 'tipul long');
      }
      if (t.v === 'unsigned' || t.v === 'signed' || t.v === 'short') refuza(t.line, `tipul ${t.v}`);
      if (t.v === 'void') {
        const u1 = urm(), u2 = urm(2);
        if (u1.k === 'id' && !(u2.k === 'op' && u2.v === '(')) { sem(`variable or field '${numeAfis(u1.v)}' declared void`, u1); throw ABANDON; }
        refuza(t.line, 'funcții proprii');
      }
      if (t.v === 'struct' || t.v === 'class' || t.v === 'union' || t.v === 'enum' || t.v === 'typedef' || t.v === 'template') refuza(t.line, REFUZ.clasa);
      if (INCEP_TIP.has(t.v)) refuza(t.line, `cuvântul ${t.v}`);
      break;
    }
    if (!ty) {
      const t = T[p];
      if (t.k === 'id') { sem(`'${numeAfis(t.v)}' does not name a type`, t); throw ABANDON; }
      sint(`expected unqualified-id ${inainte(t)}`, t);
    }
    return {ty, con, tk: t0};
  }
  const ZERO = ty => (ty === 'll' ? 0n : 0);
  function decl(spec, ctx) {               /* ctx: 'local' | 'global' | 'for'; consumă până după ; */
    let linieScrisa = false;
    const scrieLinie = (t) => { if (!linieScrisa && ctx === 'local') { emitLinie(t); linieScrisa = true; } };
    const ty = spec.ty, con = spec.con;
    const pus = f => { if (ctx === 'global') initGlobal.push(f); else emit(K_EXPR, f); };
    for (;;) {
      const t = T[p];
      if (isOp('*')) refuza(t.line, REFUZ.pointer);
      if (isOp('&') || isOp('&&')) refuza(t.line, 'referințe');
      if (t.k !== 'id') {
        if (t.k === 'op' && t.v === '(') refuza(t.line, 'declarații cu paranteze');
        sint(`expected unqualified-id ${inainte(t)}`, t);
      }
      p++;
      let arr = false, nExpr = null, gol = false;
      if (isOp('[')) {
        arr = true; p++;
        if (isOp(']')) { gol = true; p++; }
        else { nExpr = expresie(); cere(']'); }
        if (isOp('[')) refuza(t.line, 'tablouri cu două dimensiuni');
      }
      if (isOp('(') && !arr) {
        const u = urm();
        if ((u.k === 'op' && u.v === ')') || incepeTip(u)) refuza(t.line, REFUZ.functie);
      }
      /* urmează ce trebuie? */
      const ok = isOp('=') || isOp(';') || isOp(',') || isOp('(') || isOp('{') ;
      if (!ok) {
        if (ctx === 'for') cere(';');
        sint(`expected initializer ${inainte(T[p])}`);
      }
      if (t.v === 'main' && ctx === 'global') { sem("cannot declare '::main' to be a global variable", t); throw ABANDON; }
      if (arr && gol && !isOp('=')) { sem(`storage size of '${numeAfis(t.v)}' isn't known`, t); }
      /* mărimea tabloului */
      let n = null, vlaF = null;
      if (arr && nExpr) {
        if (nExpr.ty !== 'err') {
          if (!INTREG.has(nExpr.ty)) {
            if (nExpr.isC && ARIT.has(nExpr.ty)) sem(`conversion from '${tn(nExpr)}' to 'long long unsigned int' in a converted constant expression`, nExpr.tk || t);
            else sem(`size of array '${numeAfis(t.v)}' has non-integral type '${tn(nExpr)}'`, t);
          }
          else if (nExpr.isC) {
            let v0 = 0;
            try { v0 = Number(nExpr.ev()); } catch (e) { v0 = 0; }
            n = v0;
            if (n < 0) { sem(`narrowing conversion of '${n}' from '${tn(nExpr)}' to 'long long unsigned int' [-Wnarrowing]`, nExpr.tk || t); n = 0; }
          } else {
            if (ctx === 'global') { sem(`size of array '${numeAfis(t.v)}' is not an integral constant-expression`, t); }
            vlaF = nExpr.ty === 'll' ? (() => Number(nExpr.ev())) : nExpr.ev;
          }
        }
      }
      const v = declara(t.v, ty, con, arr, n, t);
      const cuValoare = isOp('=') || isOp('(') || isOp('{');
      if (cuValoare) domenii[domenii.length - 1].cuInit = true;
      if (ctx === 'global' && (C.inc.io || C.inc.cm) && !domenii[0].numeLib) {
        domenii[0].numeLib = new Set(NUME_IO_FN.split(' ').concat(C.inc.cm ? NUME_CM_FN.split(' ') : []));
        domenii[0].numeTip = new Set(NUME_IO_TY.split(' ').concat(C.inc.cm ? NUME_CM_TY.split(' ') : []));
      }
      if (ctx === 'global' && domenii[0].numeLib && domenii[0].numeLib.has(t.v) && !domenii[0].numeTip.has(t.v)) sem(`'${declStr(v)}' redeclared as different kind of entity`, t);
      if (arr) {
        if (n != null && n > 20000000) refuza(t.line, 'tablouri atât de mari');
        const s = v.slot, zero = ZERO(ty), oct = OCTETI[ty];
        const stivaLim = 2000000;
        if (ctx !== 'global' && n != null) { stivaLocala += n * oct; if (stivaLocala > stivaLim && !stivaMare) stivaMare = {nume: t.v, linie: t.line}; }
        let vals = null, pl = T[p];
        if (isOp('=')) {
          p++;
          if (T[p].k === 'str') refuza(T[p].line, 'tablouri de caractere inițializate cu text');
          if (!isOp('{')) {
            const E = atrib();
            if (E.ty !== 'err') sem('array must be initialized with a brace-enclosed initializer', t);
          } else vals = listaInit(ty, n, vlaF != null, t);
        } else if (isOp('{')) {
          vals = listaInit(ty, n, vlaF != null, t);
        } else if (isOp('(')) refuza(t.line, 'declarații cu paranteze la tablouri');
        if (gol && vals) { n = vals.length; v.n = n; }
        const nf = vlaF;
        const vv = vals, numeA = t.v, glob = ctx === 'global';
        if (vv || nf) scrieLinie(t);
        pus(() => {
          let m = n;
          if (nf) {
            m = nf();
            if (m < 0 || m > 20000000) opreste('stiva', `Tabloul ${numeA} ar avea ${m} elemente. ${m < 0 ? 'Un tablou nu poate avea mărime negativă.' : 'Simulatorul nu lucrează cu tablouri atât de mari.'} ${NU_E_SIGUR}`);
            if (m * oct > 2000000) opreste('stiva', `Tabloul ${numeA} e prea mare pentru a sta în main: compilat cu g++, programul se oprește cu o eroare (depășirea stivei). Pune tabloul înainte de main, ca variabilă globală, sau folosește mai puține elemente.`);
            v.nViu = m;
          }
          const a = new Array(m || 0);
          if (glob || vv) a.fill(zero);
          if (vv) { for (let k = 0; k < vv.length; k++) a[k] = vv[k](); }
          S[s] = a;
          v.ui = null;
        });
      } else {
        const s = v.slot;
        if (isOp('=') || isOp('(') || isOp('{')) {
          const pl = T[p];
          let E, gol2 = false;
          if (isOp('=')) { p++; E = atrib(); }
          else if (isOp('(')) { p++; E = expresie(); cere(')'); }
          else {
            p++;
            if (isOp('}')) { gol2 = true; E = {ty, ev: () => ZERO(ty), isC: true, rd: [], wr: [], tk: pl}; }
            else E = atrib();
            cere('}');
            if (!gol2 && E.ty !== 'err') narrowing(E, ty, pl);
          }
          const f = convInit(E, ty, pl);
          if (con && E.isC && f) {
            try { v.cv = f(); v.isC = true; } catch (e) { /* 5/0: rămâne la rulare */ }
          }
          scrieLinie(t);
          if (f) pus(() => { S[s] = f(); });
        } else {
          if (con) sem(`uninitialized 'const ${numeAfis(t.v)}' [-fpermissive]`, t);
          if (ctx === 'global') { const z = ZERO(ty); pus(() => { S[s] = z; }); }
          else pus(() => { S[s] = undefined; });
        }
      }
      void pl0;
      if (isOp(',')) { p++; continue; }
      if (isOp(';')) { p++; return; }
      if (ctx === 'for') cere(';');
      sint(`expected ',' or ';' ${inainte(T[p])}`, T[p]);
    }
  }
  const pl0 = 0;
  /* între acolade, g++ refuză conversiile care pot pierde din valoare (narrowing) */
  function narrowing(E, ty, t) {
    if (!ARIT.has(E.ty) || E.ty === ty) return false;
    const rang = {bool: 1, char: 2, int: 4, ll: 8}, dinReal = E.ty === 'float' || E.ty === 'double', laReal = ty === 'float' || ty === 'double';
    let rau = false, val;
    if (E.isC) { try { val = E.ev(); } catch (e) { val = undefined; } }
    if (!E.isC) return false;            /* pe o variabilă, g++ dă doar avertisment */
    if (dinReal && !laReal) rau = true;
    else if (dinReal && laReal) { if (E.ty === 'double' && ty === 'float') rau = !(val !== undefined && Math.abs(val) <= 3.4028234663852886e38); }
    else if (!dinReal && !laReal && (rang[E.ty] > rang[ty] || (ty === 'bool' && E.ty !== 'bool'))) {
      const v = Number(val);
      rau = ty === 'bool' ? !(v === 0 || v === 1) : ty === 'char' ? (v < -128 || v > 127) : ty === 'int' ? (v < MIN32 || v > 2147483647) : false;
    }
    if (!rau) return false;
    let txt;
    if (E.isC && dinReal) {
      txt = Number(val).toExponential(16).replace(/\.?0+e/, 'e');
    } else if (E.isC) txt = String(val);
    else txt = '…';
    sem(`narrowing conversion of '${txt}' from '${NUME_TIP[E.ty]}' to '${NUME_TIP[ty]}' [-Wnarrowing]`, E.tk || t);
    return true;
  }
  function listaInit(ty, n, vla, t) {
    const pl = T[p];
    cere('{');
    if (vla) refuza(t.line, 'tablouri cu mărime citită și valori între acolade');
    const vals = [];
    let peste = false;
    while (!isOp('}')) {
      const tk = T[p];
      if (isOp('{')) refuza(t.line, 'acolade în acolade');
      if (tk.k === 'str') refuza(t.line, 'texte între acoladele unui tablou');
      const E = atrib();
      if (n != null && vals.length >= n && !peste) { sem(`too many initializers for '${NUME_TIP[ty]} [${n}]'`, tk); peste = true; }
      narrowing(E, ty, tk);
      const f = convInit(E, ty, tk);
      vals.push(f || (() => 0));
      if (isOp(',')) { p++; continue; }
      break;
    }
    cere('}');
    void pl;
    return vals;
  }
  function convInit(E, ty, t) {
    if (E.ty === 'err') return null;
    if (E.cin || eFlux(E)) {
      if (E.cin && !eFlux(E)) cinInterzis(t);
      sem(`cannot convert ${tn(E)} to '${NUME_TIP[ty]}' in initialization`, E.tk || t); return null;
    }
    if (E.ty === 'cstr') {
      if (ty === 'bool') return () => 1;
      if (ty === 'double' || ty === 'float') sem(`cannot convert 'const char*' to '${NUME_TIP[ty]}' in initialization`, E.tk || t);
      else sem(`invalid conversion from 'const char*' to '${NUME_TIP[ty]}' [-fpermissive]`, E.tk || t);
      return null;
    }
    if (E.ty === 'arr' || E.ty === 'ptr') {
      if (ty === 'bool') { amana(t.line, 'o valoare de adevăr luată dintr-un tablou'); return () => 1; }
      adresaInVar(E, ty, 'initialization', t); return null;
    }
    if (E.supra) { sem(`cannot resolve overloaded function '${E.supra}' based on conversion to type '${NUME_TIP[ty]}'`, E.tk || t); return null; }
    if (E.ty === 'manip') refuza(t.line, 'endl sau fixed în afara lui cout');
    return conv(E, ty);
  }

  /* ---- instrucțiunile ---- */
  function bloc(forInit) {
    const pl = cere('{');
    void pl;
    pune();
    if (forInit) domenii[domenii.length - 1].forInit = forInit;
    adancime++;
    while (!isOp('}')) {
      if (inIf && isKw('else')) sint(`expected '}' ${inainte(T[p])}`, T[p]);
      if (T[p].k === 'eof') {
        const m = "expected '}' at end of input";
        eroare(T[p - 1].eline, T[p - 1].ecol, m); throw ABANDON;
      }
      instructiune();
    }
    p++;
    adancime--;
    scoate();
  }
  /* cp_parser_init_statement_p din g++: caută ; în afara parantezelor și a acoladelor, înainte de ) */
  function eInitStatement() {
    let par = 0, ac = 0, dr = 0;
    for (let i = p; i < T.length; i++) {
      const t = T[i];
      if (t.k === 'eof') return false;
      if (t.k !== 'op') continue;
      switch (t.v) {
        case ';': if (!par && !ac && !dr) return true; break;
        case '(': par++; break;
        case ')': if (!par && !ac && !dr) return false; if (par) par--; break;
        case '[': dr++; break;
        case ']': if (dr) dr--; break;
        case '{': ac++; break;
        case '}': if (!ac) return false; ac--; break;
      }
    }
    return false;
  }
  function conditie() {
    const t = T[p];
    if (incepeTip(t)) refuza(t.line, 'declarații în condiție');
    return expresie();
  }
  const trecePesteInit = sw => { for (let i = sw.dom; i < domenii.length; i++) if (domenii[i].cuInit) return true; return false; };
  function instrBucla(forInit) {        /* corpul unei repetiții sau al lui if */
    if (isKw('else')) sint(`expected primary-expression ${inainte(T[p])}`, T[p]);
    if (forInit && isOp('{')) { bloc(forInit); return; }
    pune();
    if (forInit) domenii[domenii.length - 1].forInit = forInit;
    adancime++;
    instructiune();
    adancime--;
    scoate();
  }
  function instructiune() {
    const t = T[p];
    instrStart = p;
    /* o etichetă: g++ o primește (a: b = 1;), de aceea a:=5; dă eroarea de la = */
    if (t.k === 'id' && urm().k === 'op' && urm().v === ':') {
      p += 2;
      if (isOp('=')) sint(`expected primary-expression ${inainte(T[p])}`, T[p]);
      etichete.push(t);
      if (!isOp('}')) instructiune();
      return;
    }
    if (t.k === 'op') {
      if (t.v === '{') { bloc(); return; }
      if (t.v === ';') { p++; return; }
    }
    if (t.k === 'kw') {
      switch (t.v) {
        case 'if': {
          p++; emitLinie(t);
          cere('(');
          if (eInitStatement()) {
            if (incepeTip(T[p])) refuza(t.line, 'if cu inițializare');
            /* if (init; condiție): g++ îl citește ca pe o instrucțiune */
            expresie();
            cere(';');
            conditie();
            cere(')');
            refuza(t.line, 'if cu inițializare');
          }
          const E = conditie();
          cere(')');
          const j = salt(E, false);
          const dinIf = inIf;
          inIf = true;
          instrBucla();
          inIf = dinIf;
          if (isKw('else')) {
            p++;
            const s = emit(K_JMP);
            code[j].t = code.length;
            instrBucla();
            code[s].t = code.length;
          } else code[j].t = code.length;
          return;
        }
        case 'while': {
          p++;
          const cap = code.length;
          emitLinie(t);
          cere('(');
          const E = conditie();
          cere(')');
          const j = salt(E, false);
          nivelBucle.push({bucla: true, brk: [], con: []});
          inBucla(instrBucla);
          const nb = nivelBucle.pop();
          nb.con.forEach(k => { code[k].t = cap; });
          emit(K_JMP, null, cap);
          code[j].t = code.length;
          nb.brk.forEach(k => { code[k].t = code.length; });
          return;
        }
        case 'do': {
          p++;
          const cap = code.length;
          nivelBucle.push({bucla: true, brk: [], con: []});
          inBucla(instrBucla);
          const nb = nivelBucle.pop();
          const u = T[p];
          if (!isKw('while')) sint(`expected 'while' ${inainte(u)}`, u);
          p++;
          const lc = code.length;
          nb.con.forEach(k => { code[k].t = lc; });
          emitLinie(u);
          cere('(');
          const E = expresie();
          cere(')');
          const j = salt(E, true);
          code[j].t = cap;
          cere(';');
          nb.brk.forEach(k => { code[k].t = code.length; });
          return;
        }
        case 'for': {
          p++;
          cere('(');
          pune();
          const dom = domenii[domenii.length - 1];
          adancime++;
          inCapFor = true;
          if (isOp(';')) p++;
          else if (incepeTip(T[p]) && !(T[p + 1].k === 'op' && T[p + 1].v === '(')) {
            emitLinie(t);
            decl(specificator(), 'for');
          } else {
            const E = expresieSauTipNecunoscut();
            emitLinie(t);
            if (E && E.supra) sem('statement cannot resolve address of overloaded function', E.tk);
            if (E) { emiteRenunta(E); cere(';'); }
          }
          const cap = code.length;
          let j = null;
          emitLinie(T[p]);
          if (!isOp(';')) { const E = expresie(); j = salt(E, false); }
          cere(';');
          let inc = null, tInc = T[p];
          if (!isOp(')')) inc = expresie();
          if (inc && inc.supra) sem('overloaded function with no contextual type information', inc.tk);
          cere(')');
          inCapFor = false;
          nivelBucle.push({bucla: true, brk: [], con: []});
          inBucla(() => instrBucla(dom));
          const nb = nivelBucle.pop();
          const lc = code.length;
          nb.con.forEach(k => { code[k].t = lc; });
          if (inc) { code.push({k: K_LINE, l: tInc.line, c: tInc.col}); emiteRenunta(inc); }
          emit(K_JMP, null, cap);
          if (j != null) code[j].t = code.length;
          nb.brk.forEach(k => { code[k].t = code.length; });
          adancime--;
          scoate();
          return;
        }
        case 'break': {
          p++;
          const nb = nivelBucle[nivelBucle.length - 1];
          if (!nb) sem('break statement not within loop or switch', t);
          else { emitLinie(t); nb.brk.push(emit(K_JMP)); }
          cere(';');
          return;
        }
        case 'continue': {
          p++;
          let nb = null;
          for (let i = nivelBucle.length - 1; i >= 0; i--) if (nivelBucle[i].bucla) { nb = nivelBucle[i]; break; }
          if (!nb) sem('continue statement not within a loop', t);
          else { emitLinie(t); nb.con.push(emit(K_JMP)); }
          cere(';');
          return;
        }
        case 'return': {
          p++;
          emitLinie(t);
          if (isOp(';')) {
            sem("return-statement with no value, in function returning 'int' [-fpermissive]", t);
            p++; return;
          }
          const E = expresie();
          cere(';');
          if (E.ty !== 'err') {
            if (eFlux(E) || E.cin) refuza(t.line, 'return cu cin sau cout');
            if (E.ty === 'cstr') { sem("invalid conversion from 'const char*' to 'int' [-fpermissive]", E.tk || t); return; }
            if (E.ty === 'arr') { sem(`invalid conversion from '${NUME_TIP[E.v.ty]}*' to 'int' [-fpermissive]`, E.tk || t); return; }
            const f = conv(E, 'int');
            emit(K_EXPR, () => { M.exit = f(); });
          }
          retururi.push(emit(K_JMP));
          return;
        }
        case 'switch': {
          p++; emitLinie(t);
          cere('(');
          const E = conditie();
          cere(')');
          if (E.ty !== 'err' && !INTREG.has(E.ty)) { sem('switch quantity not an integer', t); }
          const hs = sloturi++;
          const fe = E.ty === 'err' || !INTREG.has(E.ty) ? (() => 0) : conv(E, promov(E.ty) === 'll' ? 'll' : 'int');
          emit(K_EXPR, () => { S[hs] = fe(); });
          const s0 = emit(K_JMP);
          const sw = {bucla: false, brk: [], con: [], cazuri: [], implicit: null, ty: promov(E.ty) === 'll' ? 'll' : 'int', dom: domenii.length};
          nivelBucle.push(sw);
          instrBucla();
          nivelBucle.pop();
          const ies = emit(K_JMP);
          code[s0].t = code.length;
          sw.cazuri.forEach(c => { const v = c.v; emit(K_JT, () => (S[hs] === v ? 1 : 0), c.pc); });
          const dd = emit(K_JMP);
          code[dd].t = sw.implicit != null ? sw.implicit : code.length;
          code[ies].t = code.length;
          sw.brk.forEach(k => { code[k].t = code.length; });
          return;
        }
        case 'case': {
          p++;
          const E = conditionala();
          let sw = null;
          for (let i = nivelBucle.length - 1; i >= 0; i--) if (!nivelBucle[i].bucla) { sw = nivelBucle[i]; break; }
          let txt = '';
          if (E.isC) { try { txt = String(E.ev()); } catch (e) { txt = ''; } }
          cere(':');
          if (!sw) { sem(`case label '${txt}' not within a switch statement`, t); return; }
          if (!E.isC) {
            if (E.ty !== 'err' && E.lv && E.lv.kind === 'var') sem(`the value of '${numeAfis(E.lv.v.nume)}' is not usable in a constant expression`, E.tk || t);
            else if (E.ty === 'cstr') sem("conversion from 'const char*' to 'int' in a converted constant expression", E.tk || t);
            else if (E.ty !== 'err') refuza(t.line, 'case cu o valoare care nu e constantă');
            return;
          }
          if (trecePesteInit(sw)) sem('jump to case label', t);
          const c = cvf(E.ty, sw.ty); const v = c ? c(E.ev()) : E.ev();
          if (sw.cazuri.some(x => x.v === v)) { sem(`duplicate case value`, t); return; }
          sw.cazuri.push({v, pc: code.length});
          return;
        }
        case 'default': {
          p++;
          let sw = null;
          for (let i = nivelBucle.length - 1; i >= 0; i--) if (!nivelBucle[i].bucla) { sw = nivelBucle[i]; break; }
          cere(':');
          if (!sw) { sem('case label not within a switch statement', t); return; }
          if (sw.implicit != null) { sem('multiple default labels in one switch', t); return; }
          if (trecePesteInit(sw)) sem('jump to case label', t);
          sw.implicit = code.length;
          return;
        }
        case 'else': { sint("'else' without a previous 'if'", t); return; }
        case 'goto': refuza(t.line, 'goto'); break;
        case 'try': case 'throw': case 'catch': refuza(t.line, 'excepții'); break;
        case 'using': case 'namespace': refuza(t.line, 'using în interiorul lui main'); break;
      }
      if (incepeTip(t) && !(T[p + 1].k === 'op' && T[p + 1].v === '(')) {
        decl(specificator(), 'local');
        return;
      }
    }
    /* expresie */
    const E = expresieSauTipNecunoscut();
    if (!E) return;
    if (E.supra) sem('statement cannot resolve address of overloaded function', E.tk);
    if (E.ty !== 'manip') emitLinie(t);
    emiteRenunta(E);
    if (E.ty === 'err' && !isOp(';')) {         /* g++ a spus deja greșeala: sare până la sfârșitul instrucțiunii */
      if (isOp(')') || isOp(']')) { while (T[p].k !== 'eof' && !isOp(';') && !isOp('{') && !isOp('}')) p++; if (isOp(';')) p++; }
      return;
    }
    cere(';');
  }
  /* Int x = 5; / string s; la început de instrucțiune */
  function expresieSauTipNecunoscut() {
    const t = T[p];
    if (t.k === 'id') {
      if (t.v === 'std' && urm().k === 'op' && urm().v === '::' && T[p + 2].k === 'id' && NEACC_TIP.has(T[p + 2].v)) refuza(t.line, t.v + '::' + T[p + 2].v);
      const u = urm();
      if (!cauta(t.v) && NEACC_TIP.has(t.v) && C.inc.io && (vizibilStd(t.v))) refuza(t.line, t.v === 'string' ? REFUZ.string : t.v === 'ifstream' || t.v === 'ofstream' || t.v === 'fstream' ? REFUZ.fisier : `tipul ${t.v}`);
      if (!cauta(t.v) && !eConstruit(t.v, t, false) && (u.k === 'id' || (u.k === 'kw' && false))) {
        p++;
        nedeclarat(t.v, t);
        /* g++ sare până la sfârșitul instrucțiunii */
        let d = 0;
        while (T[p].k !== 'eof') {
          if (isOp('(') || isOp('[')) d++;
          else if (isOp(')') || isOp(']')) { if (d) d--; }
          else if (isOp(';') && !d) { p++; return null; }
          else if ((isOp('{') || isOp('}')) && !d) return null;
          p++;
        }
        return null;
      }
    }
    return expresie();
  }

  /* ---- ce e în afara lui main ---- */
  let areMain = false, altaFunctie = null, retururi = [];
  function corpFunctie(nume, tk) {
    if (areMain && nume === 'main') { sem("redefinition of 'int main()'", tk); throw ABANDON; }
    if (nume !== 'main') {
      if (altaFunctie || areMain) refuza(tk.line, REFUZ.functie);
      altaFunctie = nume;
    } else {
      if (altaFunctie) refuza(tk.line, REFUZ.functie);
      areMain = true;
    }
    retururi = [];
    nivelBucle = [];
    bloc();
    const fin = code.length;
    retururi.forEach(k => { code[k].t = fin; });
    emit(K_END);
  }
  function deasupra() {
    while (T[p].k !== 'eof') {
      const t = T[p];
      if (t.k === 'op' && t.v === ';') { p++; continue; }
      if (t.k === 'kw' && t.v === 'using') {
        const u = urm();
        if (u.k === 'kw' && u.v === 'namespace') {
          p += 2;
          const n = T[p];
          if (n.k !== 'id') sint(`expected identifier ${inainte(n)}`, n);
          p++;
          if (n.v === 'std') C.usingStd = true;
          else sem(`'${numeAfis(n.v)}' is not a namespace-name`, n);
          cere(';');
          continue;
        }
        if (u.k === 'id' && u.v === 'std' && T[p + 2].k === 'op' && T[p + 2].v === '::' && T[p + 3].k === 'id') {
          const nn = T[p + 3].v;
          p += 4;
          C.vizibil.add(nn);
          cere(';');
          continue;
        }
        if (u.k === 'id') sint(`expected nested-name-specifier before '${numeAfis(u.v)}'`, u);
        sint(`expected unqualified-id ${inainte(u)}`, u);
      }
      if (t.k === 'id' && t.v === 'main' && urm().k === 'op' && urm().v === '(') {
        p += 2;
        if (!isOp(')')) { sem("cannot declare '::main' to be a global variable", t); throw ABANDON; }
        p++;
        if (!isOp('{')) sint(`expected initializer ${inainte(T[p])}`);
        corpFunctie('main', t);
        continue;
      }
      if (t.k === 'kw' && t.v === 'void' && urm().k === 'id' && urm().v === 'main') { sem("'::main' must return 'int'", t); throw ABANDON; }
      if (incepeTip(t)) {
        const sp = specificator();
        const n = T[p], u = urm();
        if (n.k === 'id' && u.k === 'op' && u.v === '(') {
          /* o funcție */
          if (n.v === 'main') {
            if (sp.ty !== 'int') { sem("'::main' must return 'int'", sp.tk); throw ABANDON; }
            const u2 = T[p + 2];
            if (u2.k === 'op' && u2.v === ')') p += 3;
            else if (u2.k === 'kw' && u2.v === 'void' && T[p + 3].k === 'op' && T[p + 3].v === ')') p += 4;
            else if (incepeTip(u2)) refuza(u2.line, 'parametri la main');
            else { sem("cannot declare '::main' to be a global variable", n); throw ABANDON; }
            if (isOp(';')) { p++; continue; }
            if (isOp('(')) { sem('initializer provided for function', T[p]); throw ABANDON; }
            if (!isOp('{')) sint(`expected initializer ${inainte(T[p])}`);
            corpFunctie('main', n);
            continue;
          }
          const u2 = T[p + 2];
          if (u2.k === 'op' && u2.v === ')' && T[p + 3].k === 'op' && T[p + 3].v === '{' && sp.ty === 'int') {
            p += 3;
            corpFunctie(n.v, n);
            continue;
          }
          refuza(n.line, REFUZ.functie);
        }
        if (isOp(';')) { p++; continue; }
        decl(sp, 'global');
        continue;
      }
      if (t.k === 'id') {
        if (NEACC_TIP.has(t.v) && C.inc.io && vizibilStd(t.v)) refuza(t.line, t.v === 'string' ? REFUZ.string : `tipul ${t.v}`);
        const s = sugereaza(t.v, true);
        const mes = `'${numeAfis(t.v)}' does not name a type` + (s ? `; did you mean '${numeAfis(s)}'?` : '');
        eroare(t.line, t.col, mes);     /* R6: textul de aici (al cincilea argument, „șterge acolada în plus”) nu se afișa nicăieri: eroare() îl ignora; scos */
        /* g++ sare peste declarația stricată */
        let d = 0;
        while (T[p].k !== 'eof') {
          if (isOp('{')) d++;
          else if (isOp('}')) { d--; if (d <= 0) { p++; break; } }
          else if (isOp(';') && d === 0) { p++; break; }
          p++;
        }
        continue;
      }
      if (t.k === 'op' && t.v === '}') sint("expected declaration before '}' token", t);
      sint(`expected unqualified-id ${inainte(t)}`, t);
    }
  }

  /* ---- LISTA POZITIVĂ a explicațiilor (R2, D1; R3, S1-S3). O explicație specifică există numai pe o clasă recunoscută sigur din ce stă în jurul
     erorii și vine cu reparația ei, pe text. Rândul reparat din explicație se generează din reparație (randuriReparate); reparația e probată aici
     (reparatiaAjuta): compilează + rulează, altfel se spune EX_NEUTRA. Regula de adevăr: niciodată „lipsește X” dacă nu e sigur. Lista scade, nu crește:
     tabelul din GATA, „Lista de clase”. oracol_explicatii.py aplică TEXTUL și arbitrul e g++. ---- */
  function claseaErorii(e) {
    const m = e.mesaj, l = e.linie, L = [0];
    for (let k = src.indexOf('\n'); k >= 0; k = src.indexOf('\n', k + 1)) L.push(k + 1);
    const off = (ln, c) => L[ln - 1] + c - 1;
    const rand = ln => src.slice(L[ln - 1], ln < L.length ? L[ln] - 1 : src.length);
    const R = (c, t, ...ed) => ({c, t, ed});
    /* doua drumuri sunt spuse in text, deci „randul devine” l-ar arata doar pe unul; ce pune reparatia sta in text */
    const Rd = (c, t, ...ed) => ({c, t, ed, faraRand: true});
    if (l == null) {
      if (!/WinMain/.test(m)) return null;
      const j = T.findIndex((t, k) => t.k === 'id' && distanta(t.v, 'main') <= 3 && T[k + 1] && T[k + 1].k === 'op' && T[k + 1].v === '(');
      if (j >= 0) return R('main_scris_altfel', `Programul nu are funcția main: numele ${T[j].v} e scris altfel. Scrie exact main: int main().`, [off(T[j].line, T[j].col), off(T[j].eline, T[j].ecol), 'main']);
      return R('fara_main', 'Programul nu are funcția main, deci n-are de unde porni. Scrie instrucțiunile în int main() { … }.');
    }
    const lin = rand(l), p0 = off(l, 1), c0 = e.col || 1;
    /* semne lipite din altă parte */
    const s0 = semnDinMesaj(m) || (/^stray '(.)'/.exec(m) || [])[1];
    if (s0 && !/^\w$/.test(s0)) {
      if (s0 === '\\' && /\\[a-z]/.test(lin)) return null;     /* \n în afara ghilimelelor: „șterge-l” ar lăsa litera n */
      const de = inlocSemn(s0), ed = [];
      for (let k = 0; k < lin.length; k++) if (inlocSemn(lin[k]) === de && (lin[k] === s0 || clasaSemn(lin[k]) === clasaSemn(s0))) ed.push([p0 + k, p0 + k + 1, de === '-' && /^\s*[;)]/.test(lin.slice(k + 1)) ? '--' : de]);       /* telefonul face din -- o liniuță lungă: i—; */
      if (ed.length) return R('semn_' + clasaSemn(s0), explicaSemn(s0), ...ed);
    }
    /* preprocesorul */
    let r;
    if ((r = /^(.*): No such file or directory$/.exec(m)) && r[1]) {
      const n = r[1].trim(), k = lin.indexOf(n);
      const bun = ['iostream', 'cmath', 'iomanip'].find(x => distanta(n.toLowerCase().replace(/\.h$/, ''), x) <= 3);
      if (bun && k >= 0) return R('biblioteca_scrisa_gresit', `Numele bibliotecii e scris greșit. Se scrie #include <${bun}>.`, [p0 + k, p0 + k + n.length, bun]);
      return null;
    }
    if (/^missing terminating '>'/.test(m)) return R('include_fara_inchidere', 'Închide numele bibliotecii cu semnul >: #include <iostream>.', [p0 + lin.trimEnd().length, p0 + lin.trimEnd().length, '>']);
    if ((r = /^invalid preprocessing directive #(\w+); did you mean #include\?/.exec(m))) {
      const x = /#\s*\w+/.exec(lin);
      if (x) return R('include_scris_gresit', 'Linia se scrie cu litere mici, întreagă: #include <iostream>.', [p0 + x.index, p0 + x.index + x[0].length, '#include']);
      return null;
    }
    if (/^'#include' expects/.test(m)) {
      const x = /^(\s*#\s*include\s*)([\w.]+)\s*$/.exec(lin);
      if (x) return R('include_fara_semne', `Numele bibliotecii stă între < și >: #include <${x[2]}>.`, [p0 + x[1].length, p0 + x[1].length + x[2].length, `<${x[2]}>`]);
      return null;
    }
    if (/^missing terminating " character/.test(m)) {
      if (!/(<<|\(|=|,)$/.test(lin.slice(0, c0 - 1).trimEnd())) return null;   /* cout<<a"; : ghilimeaua lipsește dinainte, nu de la sfârșit */
      const z = lin.trimEnd(), a = z.endsWith(';') ? z.length - 1 : z.length;
      if (/<<|>>/.test(lin.slice(c0))) return null;
      return R('text_neinchis', 'Textul pornit cu ghilimele nu se închide pe aceeași linie. Pune " și la sfârșitul textului.', [p0 + a, p0 + a, '"']);
    }
    if (/^missing terminating ' character/.test(m)) {
      return null;
    }
    if (!T.length) return null;
    /* cuvintele din jurul erorii */
    const inc = j => off(T[j].line, T[j].col), sf = j => off(T[j].eline, T[j].ecol);
    let i = T.findIndex(t => t.line > l || (t.line === l && t.col >= c0));
    if (i < 0) i = T.length - 1;
    const t = T[i], pr = T[i - 1];
    const op = (j, v) => !!T[j] && T[j].k === 'op' && T[j].v === v, kw = (j, v) => !!T[j] && T[j].k === 'kw' && (v == null || T[j].v === v), idn = (j, v) => !!T[j] && T[j].k === 'id' && (v == null || T[j].v === v);
    const TIPURI = new Set(['int', 'long', 'float', 'double', 'bool', 'char', 'const', 'short', 'unsigned', 'signed', 'void', 'auto']);
    const eTip = j => kw(j) && TIPURI.has(T[j].v);
    const sterge = j => [inc(j), sf(j), ''], inlocuieste = (j, s) => [inc(j), sf(j), s], peLoc = (j, s) => [inc(j), inc(j), s], dupa = (j, s) => [sf(j), sf(j), s];
    const inceput = j => { let d = 0; for (let k = j - 1; k >= 0; k--) { if (T[k].k !== 'op') continue; const v = T[k].v; if (v === ')' || v === ']') d++; else if (v === '(' || v === '[') { if (d > 0) d--; } else if (!d && (v === ';' || v === '{' || v === '}')) return k + 1; } return 0; };
    const sfarsit = j => { let d = 0; for (let k = j; k < T.length; k++) { if (T[k].k === 'eof') return k; if (T[k].k !== 'op') continue; const v = T[k].v; if (v === '(' || v === '[') d++; else if (v === ')' || v === ']') d--; else if (!d && v === ';') return k; } return T.length - 1; };
    const deschisa = j => { let d = 0; for (let k = j - 1; k >= 0; k--) { if (T[k].k !== 'op') continue; const v = T[k].v; if (v === ')') d++; else if (v === '(') { if (!d) return k; d--; } else if (v === '{' || v === '}') return -1; } return -1; };
    const inchisa = o => { let d = 0; for (let k = o; k < T.length; k++) { if (T[k].k === 'eof') return -1; if (T[k].k !== 'op') continue; const v = T[k].v; if (v === '(') d++; else if (v === ')') { if (!--d) return k; } else if (v === '{' || v === '}') return -1; } return -1; };
    const eTablou = n => toateVar.some(v => v.arr && v.nume === n);
    const tablouFaraIndice = (a, b) => { const x = []; for (let k = a; k <= b; k++) if (idn(k) && eTablou(T[k].v) && !op(k + 1, '[')) x.push(k); return x; };
    const peTablou = (a, b) => { const x = tablouFaraIndice(a, b); if (!x.length) return null; const n = T[x[0]].v; return Rd('tablou_fara_indice', `${n} e tot tabloul. Scrie un element: ${n}[0] sau, într-un for, ${n}[i].`, dupa(x[0], '[0]')); };
    const a0 = inceput(i), a1 = sfarsit(i);
    /* semnele din două caractere, scrise cu spațiu: i + +, a < = b, cout < < a */
    for (let k = a0; k < a1; k++) {
      if (!T[k] || !T[k + 1] || T[k].k !== 'op' || T[k + 1].k !== 'op' || T[k].eline !== T[k + 1].line || T[k].ecol >= T[k + 1].col) continue;
      const g = T[k].v + T[k + 1].v;
      if (SEMNE_LIPITE.has(g)) return R('semn_despartit', `Semnul ${g} se scrie lipit, fără spațiu.`, [sf(k), inc(k + 1), '']);
    }
    /* using și bibliotecile */
    if ((r = /^'(\w+)' was not declared.*'std::\1'/.exec(m))) {
      let z = 0; for (let n = 1; n <= L.length; n++) if (/^\s*#\s*include/.test(rand(n))) z = n;
      const a = z ? (z < L.length ? L[z] : src.length) : 0;
      return R('using_lipsa', 'Lipsește linia using namespace std; de sub #include.', [a, a, (z >= L.length ? '\n' : '') + 'using namespace std;\n']);
    }
    if (/^'(cout|cin|endl)' was not declared/.test(m)) return R('iostream_lipsa', 'Lipsește linia #include <iostream> de la începutul programului.', [0, 0, '#include <iostream>\n']);
    if (/^'(sqrt|pow)' was not declared/.test(m)) return R('cmath_lipsa', 'Pentru această funcție trebuie #include <cmath> la începutul programului.', [0, 0, '#include <cmath>\n']);
    if (/^'setprecision' was not declared/.test(m)) return R('iomanip_lipsa', 'Pentru setprecision trebuie #include <iomanip> la începutul programului.', [0, 0, '#include <iomanip>\n']);
    if (/ is not a namespace-name/.test(m) || /^expected nested-name-specifier before/.test(m)) {
      if (/^'std'/.test(m) && !C.inc.io) return R('iostream_lipsa', 'Lipsește linia #include <iostream> de la începutul programului.', [0, 0, '#include <iostream>\n']);
      const u = a0, z = sfarsit(u);
      if (kw(u, 'using') && op(z, ';')) return R('using_scris_gresit', 'Linia se scrie exact așa: using namespace std;', [inc(u), sf(z), 'using namespace std;']);
      return null;
    }
    /* nume */
    if ((r = /^'([^']+)' (?:was not declared|does not name a type)/.exec(m))) {
      const n = r[1], mic = n.toLowerCase();
      const toate = s => T.map((x, k) => (x.k === 'id' && x.v === n ? k : -1)).filter(k => k >= 0).map(k => inlocuieste(k, s));
      if (n !== mic && (CUVINTE.has(mic) || ['cout', 'cin', 'endl', 'main', 'sqrt', 'pow', 'abs', 'fixed', 'setprecision', 'using', 'namespace', 'std'].includes(mic))) return R('litera_mare', `C++ ține cont de literele mari și mici: se scrie ${mic}, nu ${n}.`, ...toate(mic));
      if (n === 'end1') return R('end_cu_cifra', 'Se scrie endl, cu litera l la sfârșit, nu cu cifra 1.', ...toate('endl'));
      if (n === 'then' && idn(i, 'then')) return R('then', 'În C++ nu se scrie then: după if (…) urmează direct instrucțiunea. Șterge cuvântul then.', sterge(i));
      if (n === 'elseif' && idn(i, 'elseif')) return R('elseif', 'Se scrie în două cuvinte: else if.', inlocuieste(i, 'else if'));
      /* R6, familia ACOLADE: instrucțiunea a rămas după corpul lui main; care acoladă e greșită (cea de dinainte, una de mai sus) programul nu spune (B6-4) */
      if (/does not name a type/.test(m) && op(i - 1, '}') && !inBloc(i) && areMain && !corpFaraAcolade(i - 1)) return R('acolade_neutra', EX_ACOLADE(l));
      /* un nume urmat de alt cuvânt nu e o variabilă: citeste a; scrie a; esle cout; retrun 0; real x; */
      if (idn(i, n) && T[i + 1] && T[i + 1].line === t.line && ['id', 'kw', 'num', 'str', 'chr'].includes(T[i + 1].k)) {
        if (/^cite[sș]te$/.test(n) && idn(i + 1) && op(i + 2, ';')) return R('pseudocod', `În C++ se scrie așa: cin >> ${T[i + 1].v};`, inlocuieste(i, 'cin >>'));
        if (n === 'scrie' && idn(i + 1) && op(i + 2, ';')) return R('pseudocod', `În C++ se scrie așa: cout << ${T[i + 1].v};`, inlocuieste(i, 'cout <<'));
        return null;
      }
      /* R6 (decizia dirijorului după poarta 6; familia NUME a căzut a treia oară: B5-2, apoi B6-1, B6-2, B6-3). Orice „numele n nu e cunoscut aici”
         al unui nume din program — declarat în alt bloc, în antetul lui for (oricare declarație de acolo), mai jos, nicăieri; cu sau fără numele
         propus de compilator — primește propoziția neutră a familiei (EX_NUME), fără nicio editare. Au plecat: R4 e31 („declară-l înainte de for” +
         rândul), R5 nume_nevazut („declară-l înainte de …”), nume_propus („Compilatorul propune …” + rândul), nume_nedeclarat („declar-o: int n;”).
         „does not name a type” intră aici numai cu numele propus de compilator (atunci căutarea numelui chiar a eșuat); fără el rămâne neutra generală. */
      if ((/was not declared in this scope/.test(m) || /did you mean '\w+'\?$/.test(m)) && /^[\p{L}_][\p{L}\p{N}_]*$/u.test(n)) return R('nume_neutra', EX_NUME(n, l));
      return null;
    }
    if ((r = /^reference to '(\w+)' is ambiguous/.exec(m))) {
      const n = r[1], nou = n + '1', ed = T.map((x, k) => (x.k === 'id' && x.v === n ? k : -1)).filter(k => k >= 0).map(k => inlocuieste(k, nou));
      return Rd('nume_din_biblioteca', `Numele ${n} există deja în biblioteca lui C++ și, cu using namespace std;, compilatorul nu știe pe care îl vrei. Alege alt nume pentru variabilă, de exemplu ${nou}.`, ...ed);
    }
    /* cin și cout */
    if ((r = /^no match for 'operator(.+?)' \(operand types are (.*) and (.*)\)$/.exec(m)) && t.k === 'op' && t.v === r[1]) {
      const O = r[1], eOut = /ostream/.test(r[2]), eIn = /istream/.test(r[2]), dr = r[3], flux = eIn ? 'cin' : 'cout', sem2 = eIn ? '>>' : '<<';
      const inTot = (de, cu) => { const ed = []; for (let k = i; k <= a1; k++) if (op(k, de)) ed.push(inlocuieste(k, cu)); return ed; };
      if (O === '<<' && eIn) return R('cin_cu_semn_cout', 'La cin se scrie cu >>: cin >> x;. Semnul << merge cu cout.', ...inTot('<<', '>>'));
      if (O === '>>' && eOut) return R('cout_cu_semn_cin', 'La cout se scrie cu <<: cout << x;. Semnul >> merge cu cin.', ...inTot('>>', '<<'));
      if (O === '>>' && eIn) {
        if (/\[\d*\]'?$/.test(dr) && idn(i + 1)) return Rd('cin_tablou', `Un tablou se citește element cu element: cin >> ${T[i + 1].v}[0]; sau, într-un for, cin >> ${T[i + 1].v}[i];.`, dupa(i + 1, '[0]'));
        if ((/const char \[/.test(dr) && T[i + 1].k === 'str') || (/unresolved overloaded/.test(dr) && idn(i + 1, 'endl'))) return R('cin_text', 'Cu cin citești doar în variabile: cin >> x;. Textele și endl merg cu cout: șterge-le de aici.', [inc(i), sf(i + 1), '']);
        return null;
      }
      if ((eIn || eOut) && (O === '<' || O === '>')) {
        if (idn(i - 1, flux)) return R('flux_un_semn', `La ${flux} se scrie cu două semne: ${flux} ${sem2} a;. Aici ai un singur semn.`, inlocuieste(i, sem2));
        if (idn(i + 1, 'endl')) return R('endl_un_semn', 'Înainte de endl se scrie <<.', inlocuieste(i, '<<'));
        if (eOut) return Rd('cout_comparatie', 'După cout, un singur semn < sau > e citit ca o comparație. Dacă voiai să afișezi mai departe, se scrie <<. Dacă voiai comparația, pune-o între paranteze: cout << (a < b);.', inlocuieste(i, '<<'));
        return null;
      }
      if (eOut && ['==', '!=', '<=', '>='].includes(O)) {
        let u = -1, d = 0; for (let k = i - 1; k >= a0; k--) { if (op(k, ')')) d++; else if (op(k, '(')) d--; else if (!d && op(k, '<<')) { u = k; break; } }
        if (u >= 0) return R('cout_comparatie', 'O comparație după cout stă între paranteze: cout << (a == b);.', dupa(u, ' ('), peLoc(a1, ')'));
        return null;
      }
      if ((eIn || eOut) && O === '=' && idn(i - 1, flux)) return R('flux_egal', `${flux} nu primește o valoare cu =. Se scrie cu ${sem2}: ${flux} ${sem2} a;.`, inlocuieste(i, sem2));
      return null;
    }
    if (/^(no context to resolve type of 'std::endl'|statement cannot resolve|left operand of comma operator cannot resolve|overloaded function with no contextual)/.test(m) || /^cannot resolve overloaded function 'endl'/.test(m)) {
      const ed = [], areEndl = T.slice(a0, a1).some(x => x.k === 'id' && x.v === 'endl');
      if (!areEndl) return null;
      if (!idn(a0, 'cout')) return null;
      let d = 0; for (let k = a0; k < a1; k++) { if (op(k, '(')) d++; else if (op(k, ')')) d--; else if (!d && op(k, ',')) ed.push(inlocuieste(k, '<<')); }
      if (ed.length) return R('virgula_la_cout', 'Virgula nu afișează mai departe. Fiecare lucru de afișat are în față semnul <<: cout << a << endl;.', ...ed);
      return null;
    }
    /* semnele ; ) ] } */
    /* R6, familia ACOLADE (a căzut a treia oară: B5-3, apoi B6-4): orice eroare de acoladă — { neînchisă, } înainte de else (cu acolade
       pereche sau nu), } în plus — primește propoziția neutră a familiei (EX_ACOLADE). Nu se mai spune ce acoladă se pune, se mută sau se
       șterge și nici „Rândul N …”: au plecat acolada_neinchisa („Pune } acolo unde…”), else_bloc_neinchis („pune }”, „Mut-o înainte de else”),
       acolada_in_plus („Șterge-o.”). */
    if (/^expected '}' at end of input/.test(m)) return R('acolade_neutra', EX_ACOLADE(l));
    if (/^expected '}' before 'else'/.test(m)) return R('acolade_neutra', EX_ACOLADE(l));
    if (/^expected declaration before '}'/.test(m)) return R('acolade_neutra', EX_ACOLADE(l));
    if (/^expected ';' before/.test(m)) {
      const hf = deschisa(i);
      if (hf > 0 && kw(hf - 1, 'for')) return regulaFor(hf);
      if (hf >= 0) return inchisa(hf) < 0 && (kw(hf - 1) || idn(hf - 1)) ? R('paranteza_neinchisa', pr.eline !== t.line || t.k === 'eof' ? 'Lipsește paranteza de închidere ) la sfârșitul liniei arătate. (Un compilator mai vechi din Code::Blocks arată linia de dedesubt.)' : 'Lipsește paranteza de închidere ): pune-o înainte de semnul arătat.', dupa(i - 1, ')')) : null;
      if (kw(a0, 'else') && op(a0 + 1, '(')) { const zc = inchisa(a0 + 1); if (zc < 0) return null; return {c: 'else_cu_conditie', t: 'După else nu urmează o condiție. Dacă vrei încă o condiție, scrie else if (…). Dacă nu, șterge paranteza cu tot ce e în ea.', ed: [peLoc(a0 + 1, 'if ')], alt: [[[inc(a0 + 1), sf(zc), '']]], faraRand: true}; }     /* R5: ambele drumuri probate */
      if (!pr || t.k === 'eof' || pr.eline !== t.line) return R('pv_la_sfarsit', EX_PV_SFARSIT(comentariuDupa(i - 1)), dupa(i - 1, ';'));
      if (op(i, '}')) return R('pv_inainte_de_acolada', 'Lipsește semnul ; înainte de }.', dupa(i - 1, ';'));
      if (op(i, ')') || op(i, ']')) return perecheNesigura(i) ? null : R('semn_fara_pereche', `Semnul ${t.v} nu are pereche deschisă în instrucțiunea asta. Șterge-l.`, sterge(i));
      if ((kw(i) && t.v !== 'true' && t.v !== 'false') || idn(i, 'cout') || idn(i, 'cin')) return R('pv_inainte_de_cuvant', `Înainte de ${t.v} lipsește semnul ;.`, dupa(i - 1, ';'));
      if ((t.k === 'id' || t.k === 'num' || t.k === 'str' || t.k === 'chr') && !(pr.k === 'str' && pr.ecol === t.col)) {
        /* „pune <<” numai dacă ce urmează chiar e de afișat: o variabilă declarată, un text, un număr, endl (cout << a x b nu e aici) */
        const declarata = t.k === 'id' && toateVar.some(v => v.nume === t.v);
        if (idn(a0, 'cout') && (t.k !== 'id' || declarata || t.v === 'endl')) return R('cout_fara_semn', `La cout, fiecare lucru de afișat are în față semnul <<. Pune << înainte de ${arata(t)}.`, peLoc(i, '<< '));
        if (idn(a0, 'cin') && declarata) return R('cin_fara_semn', `La cin, fiecare variabilă are în față semnul >>. Pune >> înainte de ${arata(t)}.`, peLoc(i, '>> '));
      }
      return null;
    }
    if (/^expected ',' or ';' before/.test(m)) {
      if (!pr || t.k === 'eof' || pr.eline !== t.line) return R('declaratie_fara_pv', exDeclaratie(i - 1), dupa(i - 1, ';'));
      if (op(i, ')') || op(i, ']')) return perecheNesigura(i) ? null : R('semn_fara_pereche', `Semnul ${t.v} nu are pereche deschisă în declarația asta. Șterge-l.`, sterge(i));
      if (t.k === 'id' && (op(i + 1, '=') || op(i + 1, ',') || op(i + 1, ';'))) return Rd('declaratie_fara_virgula', `Între ${arata(pr)} și ${arata(t)} lipsește virgula, dacă declari altă variabilă: int a = 1, b = 2;.`, dupa(i - 1, ','));
      return null;
    }
    if (/^expected initializer before/.test(m)) {
      if (op(i - 1, ')') && op(i - 2, '(') && idn(i - 3, 'main')) {
        if (op(i, ')')) return R('semn_fara_pereche', 'După int main() e o paranteză ) în plus. Șterge-o.', sterge(i));
        /* acolada chiar lipsește numai dacă după int main() începe o instrucțiune */
        return t.k === 'kw' || t.k === 'id' ? R('acolade_neutra', EX_ACOLADE(l)) : null;     /* R6, familia ACOLADE: fără „urmează acolada {” */
      }
      if (!pr || t.k === 'eof' || pr.eline !== t.line) return R('declaratie_fara_pv', exDeclaratie(i - 1), dupa(i - 1, ';'));
      if (idn(i - 1) && idn(i) && (op(i + 1, '=') || op(i + 1, ';') || op(i + 1, ','))) return {c: 'nume_cu_spatiu', t: `Dacă sunt două variabile, pune virgulă între ele: ${T[inceput(i)].k === 'kw' ? T[inceput(i)].v + ' ' : ''}${pr.v}, ${t.v};. Dacă e un singur nume, scrie-l legat: ${pr.v}_${t.v}.`, ed: [dupa(i - 1, ',')], alt: [[[sf(i - 1), inc(i), '_']]], faraRand: true};     /* R5: ambele drumuri probate */
      if (op(i, '==') && idn(i - 1)) return R('declaratie_cu_egal_dublu', 'La declarație, valoarea se dă cu un singur semn =: int x = 5;.', inlocuieste(i, '='));
      if (idn(i - 1) && op(i, '-') && idn(i + 1)) return R('nume_cu_cratima', `Numele unei variabile nu poate avea cratimă. Scrie-l legat: ${pr.v}_${T[i + 1].v}.`, inlocuieste(i, '_'));
      return null;
    }
    if (/^expected unqualified-id before numeric constant/.test(m) || /^expected unqualified-id before/.test(m) || /^expected primary-expression before '(class|struct)'/.test(m)) {
      if (t.k === 'num' && op(i - 1, ',') && T[i - 2] && T[i - 2].k === 'num' && T[i - 1].ecol === t.col && T[i - 2].ecol === T[i - 1].col) return R('virgula_zecimala', `La numere, virgula zecimală se scrie cu punct: ${T[i - 2].txt}.${t.txt}.`, inlocuieste(i - 1, '.'));
      if (t.k === 'num' && eTip(i - 1)) {
        const u = /^(\d+)([A-Za-z_]\w*)/.exec(lin.slice(t.col - 1));
        if (u && t.line === l) return R('nume_cu_cifra_in_fata', `Numele unei variabile nu începe cu o cifră. Pune litera întâi: ${u[2]}${u[1]}.`, [p0 + t.col - 1, p0 + t.col - 1 + u[0].length, u[2] + u[1]]);
        return null;
      }
      if (kw(i) && eTip(i - 1)) { const nou = t.v + '1'; return Rd('nume_rezervat', `${t.v} e un cuvânt rezervat al limbajului: nu poate fi numele unei variabile. Alege alt nume, de exemplu ${nou}.`, inlocuieste(i, nou)); }
      if (kw(i) && op(i - 1, '}') && !inBloc(i) && areMain && !eTip(i) && !corpFaraAcolade(i - 1)) return R('acolade_neutra', EX_ACOLADE(l));     /* R6, familia ACOLADE (B6-4) */
      if (op(i, '{') && op(i - 1, ';') && op(i - 2, ')') && op(i - 3, '(') && idn(i - 4, 'main')) return R('main_cu_pv', 'După int main() nu se pune ;. Șterge-l.', sterge(i - 1));
      return null;
    }
    if (/^expected '\)' before/.test(m)) {
      const o = deschisa(i);
      if (o < 0 || op(i, ']')) return null;
      const z = inchisa(o);
      if ((z < 0 || (op(i, ';') && !kw(o - 1) && z > i && T[z].line !== t.line)) && !(kw(o - 1) || idn(o - 1))) return null;
      if (z < 0 || (op(i, ';') && !kw(o - 1) && z > i && T[z].line !== t.line)) return R('paranteza_neinchisa', pr.eline !== t.line || t.k === 'eof' ? 'Lipsește paranteza de închidere ) la sfârșitul liniei arătate. (Un compilator mai vechi din Code::Blocks arată linia de dedesubt.)' : 'Lipsește paranteza de închidere ): pune-o înainte de semnul arătat.', dupa(i - 1, ')'));
      if (op(i, '!') && T[i + 1] && eValoare(T[i + 1])) return R('diferit_cu_exclamare', 'Diferit se scrie !=.', inlocuieste(i, '!='));
      if (op(i, ';')) {
        if (kw(o - 1, 'for')) return R('for_trei_pv', 'Un for are exact două semne ;. Șterge-l pe cel în plus.', sterge(i));
        if (idn(o - 1) && op(i + 1, ')')) return R('pv_in_functie', 'În paranteza unei funcții nu se pune ;. Șterge-l.', sterge(i));
        return null;
      }
      if (idn(i, 'si') || idn(i, 'SI')) return R('si_sau_romanesc', '„și” se scrie && în C++.', inlocuieste(i, '&&'));
      if (idn(i, 'sau') || idn(i, 'SAU')) return R('si_sau_romanesc', '„sau” se scrie || în C++.', inlocuieste(i, '||'));
      return null;
    }
    if (/^expected '\(' before/.test(m) && kw(i - 1) && ['if', 'while', 'for', 'switch'].includes(T[i - 1].v)) {
      /* R4: condiția se oprește și înaintea unei instrucțiuni pe același rând: else if a > b cout << …; (două valori alăturate: b cout) */
      const val = j => T[j] && (T[j].k === 'id' || T[j].k === 'num' || T[j].k === 'str' || T[j].k === 'chr' || op(j, ')') || op(j, ']'));
      let k = i; while (T[k + 1] && T[k + 1].line === t.line && !op(k + 1, '{') && T[k + 1].k !== 'eof' && !(val(k) && (T[k + 1].k === 'id' || T[k + 1].k === 'kw'))) k++;
      return R('conditie_fara_paranteze', `După ${T[i - 1].v} urmează o paranteză: ${T[i - 1].v} (…). Pune ( înainte și ) după.`, peLoc(i, '('), dupa(k, ')'));
    }
    if (/^expected '\]' before/.test(m)) {
      if (op(i, ')')) return R('indice_cu_paranteza', 'Indicele se închide cu ], nu cu ).', inlocuieste(i, ']'));
      return R('indice_neinchis', 'Lipsește paranteza dreaptă ] după indice.', dupa(i - 1, ']'));
    }
    if (/^expected primary-expression before/.test(m)) {
      if (kw(i) && op(i - 1, '(') && idn(i - 2) && CUVINTE.has(T[i - 2].v.toLowerCase())) { const mic = T[i - 2].v.toLowerCase(); return R('litera_mare', `C++ ține cont de literele mari și mici: se scrie ${mic}, nu ${T[i - 2].v}.`, inlocuieste(i - 2, mic)); }
      if (op(i, '<') && op(i - 1, '=') && T[i - 1].ecol === t.col) return R('semne_pe_dos', 'Semnele sunt pe dos: „mai mic sau egal” se scrie <=.', [inc(i - 1), sf(i), '<=']);
      if (op(i, '>') && op(i - 1, '=') && T[i - 1].ecol === t.col) return R('semne_pe_dos', 'Semnele sunt pe dos: „mai mare sau egal” se scrie >=.', [inc(i - 1), sf(i), '>=']);
      if (op(i, '>') && op(i - 1, '<') && T[i - 1].ecol === t.col) return R('diferit_cu_mai_mic', 'Diferit se scrie !=.', [inc(i - 1), sf(i), '!=']);
      if (op(i, ':') && (kw(i - 1, 'else') || (op(i - 1, ')') && deschisaDe(i - 1) > 0 && kw(deschisaDe(i - 1) - 1, 'if')))) return R('doua_puncte', 'În C++ nu se pune : după if sau else. Șterge-l.', sterge(i));
      if ((op(i, ';') || op(i, ')')) && (op(i - 1, '<<') || op(i - 1, '>>'))) return R('semn_fara_valoare', `După ${pr.v} urmează ceva de afișat sau de citit. Dacă nu mai ai nimic, șterge ${pr.v}.`, sterge(i - 1));
      if ((op(i, ';') || op(i, ')')) && pr && pr.k === 'op' && (
        /* + - * / % numai cu o valoare în stânga, într-o expresie cu = sau la cout: i+ singur e un ++ scris greșit, iar + 1 ar da o buclă */
        (['+', '-', '*', '/', '%'].includes(pr.v) && T[i - 2] && (T[i - 2].k === 'id' || T[i - 2].k === 'num' || op(i - 2, ')') || op(i - 2, ']')) && (idn(a0, 'cout') || T.slice(a0, i - 1).some(x => x.k === 'op' && /^[-+*/%]?=$/.test(x.v))))
        || ['=', '+=', '-=', '*=', '/=', '%=', '<', '>', '<=', '>=', '==', '!=', '&&', '||'].includes(pr.v)
      )) {
        /* R4: la + - * / % exemplul cu 1, copiat, strică programul tipic (n = n / 1 buclă, s + n % 1, s = s + 1 numără). Textul nu dă număr;
           reparația cu 1 rămâne doar PROBĂ pentru S2 (se compilează / eroarea coboară), nu se rulează și nu se arată (e.edit = []). */
        if (['+', '-', '*', '/', '%'].includes(pr.v)) return {c: 'semn_fara_valoare', t: `După semnul ${pr.v} lipsește valoarea. Scrie după semn numărul sau variabila de care ai nevoie.`, ed: [dupa(i - 1, ' 1')], faraRand: true, proba: true};
        /* R5, punctul 1: nici la comparații, = și && || nu se dă o valoare de exemplu (> 1, == 1, = 1 copiate dau alt program): doar proba */
        if (pr.v === '&&' || pr.v === '||') return {c: 'semn_fara_valoare', t: `După semnul ${pr.v} lipsește a doua parte a condiției. Scrie-o după semn.`, ed: [dupa(i - 1, ' 1')], faraRand: true, proba: true};
        return {c: 'semn_fara_valoare', t: `După semnul ${pr.v} lipsește valoarea. Scrie după semn numărul sau variabila de care ai nevoie.`, ed: [dupa(i - 1, ' 1')], faraRand: true, proba: true};
      }
      if ((op(i, '<<') || op(i, '>>')) && op(i - 1, ',')) return R('virgula_la_flux', `Virgula nu are ce căuta înainte de ${t.v}. Șterge virgula.`, sterge(i - 1));
      if (op(i, ')') && op(i - 1, '(') && (kw(i - 2, 'if') || kw(i - 2, 'while'))) return {c: 'conditie_goala', t: `Între parantezele lui ${T[i - 2].v} trebuie să stea condiția (de obicei o comparație). Scrie-o pe a ta.`, ed: [dupa(i - 1, '1')], faraRand: true, proba: true};     /* R5: fără (a > 0) de copiat */
      return null;
    }
    if (/^'else' without a previous 'if'/.test(m)) {
      /* if-ul de la același nivel de acolade, cel mai apropiat */
      let d = 0, f = -1;
      for (let k = i - 1; k >= 0; k--) { if (op(k, '}')) d++; else if (op(k, '{')) { if (!d) break; d--; } else if (!d && kw(k, 'if')) { f = k; break; } }
      if (f < 0 || !op(f + 1, '(')) return null;
      const z = inchisa(f + 1);
      if (z < 0) return null;
      if (op(z + 1, ';')) return R('if_cu_pv', 'După if (…) nu se pune ;. Șterge semnul ; de după paranteză, ca else să aibă de cine să se lege.', sterge(z + 1));
      { let n = 0, dd = 0; for (let k = z + 1; k < i; k++) { if (op(k, '(') || op(k, '{')) dd++; else if (op(k, ')') || op(k, '}')) dd--; else if (!dd && op(k, ';')) n++; }
        if (n < 2) return null; }
      return R('acolade_neutra', EX_ACOLADE(l));     /* R6, familia ACOLADE: fără „if (…) { … } else” (unde se închide corpul lui if alege elevul) */
    }
    /* tablouri și texte */
    if (/^invalid conversion from '[^']*\*' to|^cannot convert '[^']*\*' to|^cannot convert 'const char|^ISO C\+\+ forbids comparison between pointer and integer|^ordered comparison of pointer|^invalid operands of types '[^']*(\[\d*\]|\*)' and|^invalid operands of types '[^']*' and '[^']*(\[\d*\]|\*)'/.test(m)) {
      let s = -1; for (let k = a0; k <= a1; k++) if (T[k] && T[k].k === 'str') { s = k; break; }
      if ((/const char/.test(m) || (/^(ISO|ordered)/.test(m) && s >= 0 && !tablouFaraIndice(a0, a1).length)) && !/\[\d+\]' and '[^']*\[\d*\]'/.test(m)) {
        if (s >= 0) {
          const txt = dinOcteti(T[s].v);
          if (/^-?\d+(\.\d+)?$/.test(txt)) return R('numar_intre_ghilimele', `Numărul se scrie fără ghilimele: ${txt}.`, inlocuieste(s, txt));
          if (/^(ISO|invalid operands)/.test(m) && txt.length === 1) return R('text_in_loc_de_litera', `Un număr nu se compară cu un text între ghilimele. Pentru o singură literă folosești apostrofuri: '${txt}'.`, inlocuieste(s, `'${txt}'`));
          if (/^(invalid conversion|cannot convert)/.test(m)) {
            if (/ to 'char'/.test(m)) return txt.length === 1 ? R('text_in_loc_de_litera', `O literă stă între apostrofuri: '${txt}'.`, inlocuieste(s, `'${txt}'`)) : null;
            return {c: 'text_in_variabila', t: 'Un text între ghilimele nu încape într-o variabilă numerică. Pune în locul lui numărul de care ai nevoie.', ed: [inlocuieste(s, '0')], faraRand: true, proba: true};     /* R5: fără „de exemplu 0” */
          }
        }
        return null;
      }
      const ta = peTablou(a0, a1);
      if (ta) return ta;
      return null;
    }
    if (/^invalid type argument of unary '\*'/.test(m)) {
      if (op(i - 1, '*') && T[i + 1] && T[i + 1].k === 'num' && T[i + 1].txt === '2' && idn(i - 2)) return R('putere_cu_stele', `Puterea se scrie cu înmulțiri: ${T[i - 2].v} * ${T[i - 2].v}. Semnele ** nu înseamnă putere în C++.`, [inc(i), sf(i + 1), `${T[i - 2].v}`]);
      return null;
    }
    if (/^incompatible types in assignment of/.test(m) || /^invalid array assignment/.test(m)) {
      const ta = peTablou(a0, a1);
      if (ta) return Rd('tablou_atribuit', `Un tablou nu primește valori dintr-o dată: scrii în fiecare element, ${T[tablouFaraIndice(a0, a1)[0]].v}[0] = 5;. Pentru copiere folosești for.`, ...tablouFaraIndice(a0, a1).map(k => dupa(k, '[0]')));
      return null;
    }
    if (/^array must be initialized/.test(m)) {
      let u = -1; for (let k = a0; k < a1; k++) if (op(k, '=') && op(k + 1, '(')) { u = k + 1; break; }
      const z = u >= 0 ? inchisa(u) : -1;
      if (z >= 0) return R('tablou_cu_rotunde', 'Valorile unui tablou se scriu între acolade: int a[3] = {1, 2, 3};.', inlocuieste(u, '{'), inlocuieste(z, '}'));
      return null;
    }
    if (/^too many initializers/.test(m)) {
      let b0 = i; while (b0 > 0 && !op(b0 - 1, ';') && !(op(b0 - 1, '{') && !op(b0 - 2, '='))) b0--;
      let u = -1, v0 = -1; for (let k = b0; k < a1; k++) { if (op(k, '[') && T[k + 1].k === 'num' && op(k + 2, ']')) u = k + 1; if (op(k, '{')) { v0 = k; break; } }
      if (u < 0 || v0 < 0) return null;
      let n = 1, d = 0; for (let k = v0 + 1; k < T.length - 1 && !(op(k, '}') && !d); k++) { if (op(k, '(')) d++; else if (op(k, ')')) d--; else if (!d && op(k, ',')) n++; }
      return Rd('prea_multe_valori', `Ai dat ${n} valori, iar tabloul are loc pentru ${T[u].txt}. Scrie mărimea ${n} sau scoate din valori.`, inlocuieste(u, String(n)));
    }
    if (/^storage size of /.test(m)) {
      for (let k = a0; k < a1; k++) if (op(k, '[') && op(k + 1, ']')) return {c: 'tablou_fara_marime', t: 'Un tablou are nevoie de mărime între parantezele drepte: scrie acolo câte elemente pot fi, cel mult.', ed: [dupa(k, '10')], faraRand: true, proba: true};     /* R5: fără „[10]” */
      return null;
    }
    /* const, redeclarare */
    if ((r = /^(?:assignment|increment|decrement) of read-only variable '(\w+)'/.exec(m))) {
      for (let k = 0; k < i; k++) if (idn(k, r[1]) && kw(inceput(k), 'const')) return Rd('constanta_schimbata', `${r[1]} e o constantă (const): valoarea ei nu se poate schimba. Dacă vrei s-o schimbi, șterge cuvântul const de la declarație.`, sterge(inceput(k)));
      return null;
    }
    if ((r = /^uninitialized 'const (\w+)'/.exec(m)) && idn(i, r[1])) return {c: 'constanta_fara_valoare', t: `O constantă primește valoarea chiar la declarație: scrie după ${r[1]} semnul = și valoarea ei.`, ed: [dupa(i, ' = 1')], faraRand: true, proba: true};     /* R5: fără „= 1” */
    if (/^(redeclaration of|conflicting declaration)/.test(m) && idn(i) && eTip(i - 1) && a0 === i - 1) return Rd('redeclarare', `Variabila ${t.v} are deja declarație în acest bloc. Scoate tipul din față dacă vrei doar să-i dai o valoare nouă, sau alege alt nume.`, sterge(i - 1));
    if (/^lvalue required as left operand of assignment/.test(m) && op(i, '=') && !kw(a0) && !T.slice(a0, i).some(x => x.k === 'op' && (x.v === '?' || x.v === ',')) && T.slice(a0, i).filter(x => x.k === 'op' && x.v === '[').length === T.slice(a0, i).filter(x => x.k === 'op' && x.v === ']').length) {
      if (idn(i + 1) && op(i + 2, ';') && i - a0 === 1) return R('stanga_egal', `În stânga semnului = stă o variabilă, nu un număr sau un calcul: ${T[i + 1].v} = 5;.`, [inc(a0), sf(i + 1), `${T[i + 1].v} = ${T[a0].txt}`]);
      return null;
    }
    if (/^invalid operands of types .*'operator%'/.test(m) && op(i, '%') && (idn(i - 1) || (T[i - 1] && T[i - 1].k === 'num'))) {
      const stg = /^invalid operands of types '(const )?(double|float)'/.test(m);
      if (stg) return Rd('rest_la_zecimale', `Restul împărțirii (%) există doar la numere întregi. Schimbă tipul variabilei în int, sau scrie (int)${T[i - 1].k === 'num' ? T[i - 1].txt : T[i - 1].v} % ….`, peLoc(i - 1, '(int)'));
      return null;
    }
    /* main, return, break */
    if (/^cannot declare '::main' to be a global variable/.test(m)) { for (let k = 0; k < T.length; k++) if (idn(k, 'main') && kw(k - 1) && !op(k + 1, '(') && !op(k + 1, '[')) return R('main_fara_paranteze', 'După main urmează paranteze: int main() {.', dupa(k, '()')); return null; }
    if ((r = /^'(\w+)' cannot be used as a function/.exec(m)) && eTablou(r[1])) {
      for (let k = a0; k < a1; k++) if (idn(k, r[1]) && op(k + 1, '(')) { const z = inchisa(k + 1); if (z > 0) return R('tablou_cu_rotunde', `Indicele unui tablou se scrie între paranteze drepte: ${r[1]}[0].`, inlocuieste(k + 1, '['), inlocuieste(z, ']')); }
      return null;
    }
    if (/^'::main' must return 'int'/.test(m)) { for (let k = 0; k < T.length; k++) if (idn(k, 'main') && kw(k - 1)) return R('main_cu_alt_tip', 'Funcția principală se scrie cu int: int main().', inlocuieste(k - 1, 'int')); return null; }
    if (/^return-statement with no value/.test(m) && kw(i, 'return')) return R('return_fara_valoare', 'main întoarce un număr: scrie return 0;.', dupa(i, ' 0'));
    /* numere lipite de litere, înmulțiri scrise ca în matematică */
    if (/^unable to find numeric literal operator/.test(m)) {
      const u = /^(\d+)([A-Za-z_]\w*)/.exec(lin.slice(c0 - 1));
      if (!u) return null;
      if (t.k !== 'eof' && eTip(i - 1)) return R('nume_cu_cifra_in_fata', `Numele unei variabile nu începe cu o cifră. Pune litera întâi: ${u[2]}${u[1]}.`, [p0 + c0 - 1, p0 + c0 - 1 + u[0].length, u[2] + u[1]]);
      const mij = p0 + c0 - 1 + u[1].length;
      return Rd('numar_lipit', `Un număr nu poate fi lipit de litere. Dacă voiai o înmulțire, scrie semnul: ${u[1]} * ${u[2]}.`, [mij, mij, '*']);
    }
    return null;
    /* ce stă pe rând după semnul j e un comentariu: acolo semnul nu s-ar mai citi */
    function comentariuDupa(j) { return /^\s*\/\//.test(rand(T[j].eline).slice(T[j].ecol - 1)); }
    function exDeclaratie(j) { return `Declarația de pe linia DE DINAINTE nu se termină cu ;. ${comentariuDupa(j) ? EX_COMENTARIU : 'Pune semnul ; la sfârșitul ei.'}`; }
    /* a + b) / 2: poate lipsește (, iar fără ) calculul iese altfel. Sigur în plus e doar )) sau o ) după care nu mai urmează calcul și înaintea căreia nu e calcul fără ( */
    function perecheNesigura(j) {
      if (!op(j, ')') || op(j - 1, ')')) return false;
      const ar = k => T[k] && T[k].k === 'op' && ['+', '-', '*', '/', '%'].includes(T[k].v);
      if (ar(j + 1)) return true;
      let calc = false, des = false;
      for (let k = a0; k < j; k++) { if (ar(k)) calc = true; if (op(k, '(')) des = true; }
      return calc && !des;
    }
    function corpFaraAcolade(j) {
      for (let k = 0; k < j; k++) {
        if (kw(k, 'else') && !op(k + 1, '{') && !kw(k + 1, 'if')) return true;
        if ((kw(k, 'for') || kw(k, 'while') || kw(k, 'if')) && op(k + 1, '(')) { const z = inchisa(k + 1); if (z < 0 || !op(z + 1, '{')) return true; }
      }
      return false;
    }
    /* R6: declaratiiDe și primesteValoare (R5, familia NUME) au plecat odată cu textele specifice ale familiei */
    function deschisaDe(z) { let d = 0; for (let k = z; k >= 0; k--) { if (op(k, ')')) d++; else if (op(k, '(')) { if (!--d) return k; } } return -1; }
    function inBloc(j) { let d = 0; for (let k = 0; k < j; k++) { if (op(k, '{')) d++; else if (op(k, '}')) d--; } return d > 0; }
    function regulaFor(o) {
      const z = inchisa(o);
      if (z < 0) return null;
      const pv = [], vg = []; let d = 0;
      for (let k = o + 1; k < z; k++) { if (op(k, '(')) d++; else if (op(k, ')')) d--; else if (!d && op(k, ';')) pv.push(k); else if (!d && op(k, ',')) vg.push(k); }
      if (!pv.length && vg.length === 2) return R('for_cu_virgule', 'Un for are trei părți, despărțite de două semne ;: for (int i = 0; i < n; i++). Nu cu virgule.', ...vg.map(k => inlocuieste(k, ';')));
      /* for (int i=0; i<3, i++): virgula stă în locul lui ;. Un ; pus la capăt s-ar compila, dar condiția ar deveni i++ */
      if (pv.length === 1 && vg.length === 1) return R('for_un_pv', 'Un for are trei părți, despărțite de două semne ;: for (int i = 0; i < n; i++). Aici, în locul unuia e o virgulă.', inlocuieste(vg[0], ';'));
      if (pv.length === 1 && !vg.length) {
        /* R4, B4-1: for (int i = 1; i <= n) cu un singur ;. Rândul „for (…; i <= n;)” numai dacă variabila din condiție se schimbă în corp; altfel
           lipsește a treia parte: exemplul ei e în sensul condiției (i < n: i++, i > 0: i--), pus și în reparație, ca S2 să-l ruleze cu date. */
        const c = T.slice(pv[0] + 1, z), cmp = ['<', '<=', '>', '>=', '!='];
        if (!c.length || c.some(x => x.k === 'op' && /^(\+\+|--|[-+*/%]?=)$/.test(x.v))) return null;
        /* variabila din prima parte (int i = 1 / i = 1), dacă există, trebuie să fie cea din condiție: i * i <= n nu dă un sens sigur */
        let k0 = o + 1; if (eTip(k0)) k0++;
        const vi = k0 < pv[0] ? (idn(k0) && op(k0 + 1, '=') ? T[k0].v : '') : null, L = c.length;
        let v = null, sus = null;
        if (c[0].k === 'id' && (vi == null || c[0].v === vi) && c[1] && c[1].k === 'op' && cmp.includes(c[1].v)) { v = c[0].v; sus = c[1].v !== '>' && c[1].v !== '>='; }
        else if (L >= 3 && c[L - 1].k === 'id' && (vi == null || c[L - 1].v === vi) && c[L - 2].k === 'op' && cmp.includes(c[L - 2].v) && c[L - 2].v !== '!=') { v = c[L - 1].v; sus = c[L - 2].v === '>' || c[L - 2].v === '>='; }
        if (!v) return null;
        if (seSchimba(v, z)) return R('for_un_pv', 'Un for are trei părți, despărțite de două semne ;: for (int i = 0; i < n; i++). Aici e unul singur: pune-l și pe al doilea.', dupa(z - 1, ';'));
        /* R5, punctul 1 (B5-1): cu != sensul nu se vede din condiție, ci din capete; îl dau numai două numere scrise (i = 0; i != 10).
           Cu un capăt citit, ; i++ și ; i-- sunt amândouă plauzibile și programul nu le deosebește: neutra. */
        const ne = c.some(x => x.k === 'op' && x.v === '!=');
        let alt2 = true;
        if (ne) {
          const numar = (a, b) => { const x = T.slice(a, b); if (x.length === 1 && x[0].k === 'num') return Number(x[0].txt); if (x.length === 2 && x[0].k === 'op' && x[0].v === '-' && x[1].k === 'num') return -Number(x[1].txt); return NaN; };
          const p0 = numar(k0 + 2, pv[0]), p1 = c[0].v === v ? numar(pv[0] + 3, z) : NaN;
          if (vi == null || !isFinite(p0) || !isFinite(p1) || p0 === p1) return null;
          sus = p1 > p0;
          alt2 = (p1 - p0) % 2 === 0;
        }
        /* R5, punctul 1: pasul nu e determinat de program (din 1 în 1 sau alt pas): textul dă ambele drumuri, iar S2 le probează pe AMÂNDOUĂ */
        const ex = v + (sus ? '++' : '--'), ex2 = `${v} ${sus ? '+=' : '-='} 2`, cr = sus ? 'crească' : 'scadă', cr1 = sus ? 'crește' : 'scade';
        const t0 = `Un for are trei părți, despărțite de două semne ;: for (int i = 0; i < n; i++). Aici lipsește a treia parte, cea care schimbă variabila; după condiție, ${v} trebuie să ${cr}. Dacă ${cr1} din 1 în 1, înainte de ) scrie ; ${ex}.`;
        if (!alt2) return Rd('for_un_pv', `${t0} Dacă are alt pas, scrie-l tu în locul lui ${ex}.`, dupa(z - 1, `; ${ex}`));
        return {c: 'for_un_pv', t: `${t0} Dacă are alt pas, scrie-l tu, de exemplu ; ${ex2} pentru din 2 în 2.`, ed: [dupa(z - 1, `; ${ex}`)], alt: [[dupa(z - 1, `; ${ex2}`)]], faraRand: true};
      }
      return null;
    }
    /* corpul instrucțiunii care începe după ) de la z (bloc { … } sau o instrucțiune până la ; ) schimbă variabila v? */
    function seSchimba(v, z) {
      let a = z + 1, b;
      if (op(a, '{')) { let d = 0; for (b = a; b < T.length && T[b].k !== 'eof'; b++) { if (op(b, '{')) d++; else if (op(b, '}') && !--d) break; } }
      else b = sfarsit(a);
      for (let k = a; k < b; k++) {
        if (!idn(k, v)) continue;
        if (op(k + 1, '++') || op(k + 1, '--') || op(k - 1, '++') || op(k - 1, '--') || op(k - 1, '>>')) return true;
        if (T[k + 1] && T[k + 1].k === 'op' && /^[-+*/%]?=$/.test(T[k + 1].v)) return true;
      }
      return false;
    }
  }
  /* S1: textul nu poate spune altceva decât face reparația: rândul reparat se GENEREAZĂ din ea. Niciun rând, numai când reparația adaugă rânduri (și atunci ce pune stă în text) sau când textul spune două drumuri. */
  function randuriReparate(c, ed, rep) {
    if (c.faraRand) return '';
    const rIn = o => { let n = 1; for (let k = src.indexOf('\n'); k >= 0 && k < o; k = src.indexOf('\n', k + 1)) n++; return n; };
    const atinse = new Set();
    for (const x of ed) { if (x.pune.includes('\n') || src.slice(x.a, x.b).includes('\n')) return ''; atinse.add(rIn(x.a)); }
    if (atinse.size > 2) return '';
    const RR = rep.split('\n');
    return [...atinse].sort((u, v) => u - v).map(n => (RR[n - 1].trim() ? ` Rândul ${n} devine: ${RR[n - 1].trim()}` : ` Rândul ${n} se șterge.`)).join('');
  }
  /* S2: portița la rulare. Explicația specifică apare numai dacă, după reparație, programul se compilează sau prima eroare s-a mutat pe un rând STRICT mai jos; iar dacă se compilează, rulat cu intrare goală și (R4) cu INTRARE_EXPLICATIE, nu atinge plafonul în niciuna.
     doarCompilare: reparația e doar o probă (textul nu spune valoarea), deci nu se rulează. */
  function reparatiaAjuta(e, ed, rep, doarCompilare) {
    const rIn = o => { let n = 1; for (let k = src.indexOf('\n'); k >= 0 && k < o; k = src.indexOf('\n', k + 1)) n++; return n; };
    const cresc = ed.slice().sort((x, y) => x.a - y.a);
    /* rândul din rep -> rândul din src */
    const inSursa = r => { let d = 0; for (const x of cresc) { const ra = rIn(x.a), nl = x.pune.split('\n').length - src.slice(x.a, x.b).split('\n').length; if (r > ra + d + Math.max(nl, 0)) d += nl; else if (r >= ra + d) return ra; else break; } return r - d; };
    /* R5, punctul 4 (B5-3): o reparație după care acoladele sunt mai puțin pereche decât înainte nu e progres, oricât ar coborî eroarea */
    if (Math.abs(echilibruAcolade(rep)) > Math.abs(echilibruAcolade(src))) return false;
    let P2;
    try { P2 = compileaza(rep, {faraExplicatii: true}); } catch (x) { if (x === ABANDON) throw x; return false; }
    const e2 = P2.erori[0];
    const baza = Math.min(e.linie == null ? Infinity : e.linie, ...ed.map(x => rIn(x.a)).filter(r => e.linie == null || r <= e.linie).slice(-1));
    if (e2) {
      if (e2.mesaj === e.mesaj && e2.linie != null && inSursa(e2.linie) === e.linie) return false;
      return e2.linie != null && inSursa(e2.linie) > baza;
    }
    if (P2.refuz) return P2.refuz.linie != null && inSursa(P2.refuz.linie) > baza;
    if (!P2.ok) return false;
    if (doarCompilare) return true;
    /* fără citire în program, a doua rulare ar fi aceeași */
    const cicleaza = intrare => {
      P2.pregateste({intrare, plafon: PLAFON_EXPLICATIE});
      let z, guard = 0;
      do { z = P2.merge(10000); } while (z.stare === 'felie' && ++guard < 1000);
      /* buclă = plafonul de pași sau, la o buclă care afișează mult, limita ieșirii */
      return z.stare === 'felie' || (z.stare === 'oprit' && z.oprire && (z.oprire.tip === 'plafon' || z.oprire.tip === 'iesire'));
    };
    for (const intrare of /\b(cin|getline|scanf|getchar)\b/.test(rep) ? INTRARI_EXPLICATIE : ['']) {
      if (!cicleaza(intrare)) continue;
      /* R5: o buclă începută după ce datele s-au terminat poate fi programul care își așteaptă semnul de oprire (citire până la 0 cu setul „-1”,
         până la -1 cu celelalte; la capătul datelor, cin nu mai schimbă variabila). Setul se reia cu SEMNE_OPRIRE la capăt: buclă și atunci = neutra. */
      if (!P2.dateTerminate() || cicleaza(intrare + SEMNE_OPRIRE)) return false;
    }
    return true;
  }
  function explicatiaPrimei() {
    const e = C.erori[0];
    let c = null;
    try { c = claseaErorii(e); } catch (x) { if (x === ABANDON) throw x; c = null; }
    if (c && !c.ed.length) { e.explicatie = c.t; e.textClasa = c.t; e.clasaEx = c.c; e.edit = []; e.reparat = null; return; }     /* ce e sigur, fără un loc anume: { neînchisă, fără main, (R5) numele declarat în alt bloc sau mai jos */
    if (c) {
      const pregatit = lista => { const ed = lista.map(([a, b, pune]) => ({a, b, pune})).sort((x, y) => y.a - x.a || y.b - x.b); let rep = src; for (const x of ed) rep = rep.slice(0, x.a) + x.pune + rep.slice(x.b); return {ed, rep}; };
      const {ed, rep} = pregatit(c.ed);
      /* R5, punctul 1: când textul dă două drumuri concrete (c.alt), FIECARE trece prin S2; dacă unul pică, neutra (niciodată unul singur ales la noroc) */
      const alt = (c.alt || []).map(pregatit);
      if (reparatiaAjuta(e, ed, rep, !!c.proba) && alt.every(x => reparatiaAjuta(e, x.ed, x.rep, !!c.proba))) {
        e.explicatie = c.t + randuriReparate(c, ed, rep); e.textClasa = c.t; e.clasaEx = c.c; e.edit = ed; e.reparat = rep;
        if (alt.length) e.variante = alt.map(x => x.rep);
        if (c.proba) { e.edit = []; e.reparat = null; e.proba = true; }     /* R4: reparația a fost doar probă; textul nu dă o valoare de aplicat */
        return;
      }
    }
    e.explicatie = EX_NEUTRA(e.linie);
  }

  /* ---- rezultatul ---- */
  let linkEroare = false;
  try {
    lex();
    deasupra();
    if (!C.erori.length && !areMain) linkEroare = true;
    if (!C.erori.length && etichete.length) refuza(etichete[0].line, 'goto și etichete');
  } catch (e) {
    if (e !== ABANDON) throw e;
  }
  if (linkEroare) {
    C.erori.push({linie: null, col: null, mesaj: "undefined reference to `WinMain'", clasa: 'link', explicatie: ''});
    C.erori.push({linie: null, col: null, mesaj: 'collect2.exe: error: ld returned 1 exit status', clasa: 'link', explicatie: ''});
  }
  if (C.erori.length && !(optCompilare && optCompilare.faraExplicatii)) explicatiaPrimei();
  const ok = !C.erori.length && !C.refuz;
  const liniiCod = new Set();
  code.forEach(I => { if (I.k === K_LINE) liniiCod.add(I.l); });
  const lista = [...liniiCod].sort((a, b) => a - b);

  const P = {
    ok, erori: C.erori, refuz: C.erori.length ? null : C.refuz,
    linieCod(l) { for (const x of lista) if (x >= l) return x; return null; },
    liniiCu: lista,
    pregateste(o) {
      o = o || {};
      S.length = 0;
      M.out = ''; M.inel = o.pastreaza ? new Uint8Array(o.pastreaza) : null; M.total = 0; M.nl = 0; M.limIesire = o.limIesire || 2000000; M.pc = 0; M.linie = 0; M.pasi = 0; M.fixed = false; M.prec = 6; M.exit = 0; M.r = 0; M.sari = false;
      M.ibuf = utf8(o.intrare == null ? '' : o.intrare); M.ip = 0; M.iend = o.iend !== false; M.ifail = false; M.ieof = false;
      if (o.plafon) M.plafon = o.plafon; else M.plafon = 100000000;
      M.oprire = null; M.gata = false; M.dat = M.ibuf.length;
      toateVar.forEach(v => { v.ui = null; v.nViu = undefined; });
      if (stivaMare) { M.oprire = new Oprire('stiva', `Tabloul ${stivaMare.nume} (linia ${stivaMare.linie}) e prea mare pentru a sta în main: compilat cu g++, programul se oprește cu o eroare (depășirea stivei), chiar de la pornire. Pune tabloul înainte de main, ca variabilă globală, sau folosește mai puține elemente.`); M.oprire.linie = stivaMare.linie; return; }
      for (const f of initGlobal) f();
    },
    /* rulează cel mult n instrucțiuni; pas: se oprește la următoarea linie; opriri: Set cu puncte de oprire */
    /* R5: datele s-au terminat (cin a ajuns la capăt): pentru S2, o buclă începută după asta poate fi programul care așteaptă semnul lui de oprire */
    dateTerminate() { return M.ieof; },
    merge(n, o) {
      o = o || {};
      if (M.oprire) return {stare: 'oprit', oprire: M.oprire};
      if (M.gata) return {stare: 'gata'};
      const pas = !!o.pas, opr = o.opriri || null;
      try {
        for (let c = n; c > 0; c--) {
          const I = code[M.pc];
          switch (I.k) {
            case K_EXPR: M.pc++; I.f(); break;
            case K_JF: if (I.f()) M.pc++; else M.pc = I.t; break;
            case K_JT: if (I.f()) M.pc = I.t; else M.pc++; break;
            case K_JMP: M.pc = I.t; break;
            case K_LINE:
              if (M.sari) M.sari = false;
              else if (pas) { M.sari = true; M.linie = I.l; return {stare: 'pas', linie: I.l}; }
              else if (opr && opr.has(I.l)) { M.sari = true; M.linie = I.l; return {stare: 'oprire', linie: I.l}; }
              M.linie = I.l;
              if (++M.pasi > M.plafon) throw new Oprire('plafon', `Rularea s-a oprit după ${M.plafon.toLocaleString('ro-RO')} de pași, fără ca programul să se termine. Nu se știe de ce: fie are o repetiție a cărei condiție nu devine niciodată falsă, fie e doar un calcul lung.`);
              M.pc++;
              break;
            case K_CIN: if (I.f()) M.pc++; else return {stare: 'cere'}; break;
            case K_END: M.gata = true; return {stare: 'gata'};
          }
        }
        return {stare: 'felie'};
      } catch (e) {
        if (e instanceof Oprire) { e.linie = M.linie; M.oprire = e; return {stare: 'oprit', oprire: e}; }
        throw e;
      }
    },
    da(text) { M.ibuf += utf8(text); },
    sfarsitDate() { M.iend = true; },
    iesire() { return M.inel ? dinInel(0) : M.out; },
    /* ieșirea, pe poziții absolute (în pagină, începutul unei ieșiri foarte lungi nu se mai păstrează) */
    iesireTotal() { return M.inel ? M.total : M.out.length; },
    iesireTaiat() { return M.inel ? Math.max(0, M.total - M.inel.length) : 0; },
    iesireDe(a, b) { return M.inel ? dinInel(a, b) : M.out.slice(a, b == null ? undefined : b); },
    randuri() { return M.inel ? M.nl : (M.out.match(/\n/g) || []).length; },
    cod() { return M.exit; },
    pasi() { return M.pasi; },
    linieUrmatoare() { const I = code[M.pc]; return I && I.k === K_LINE ? I.l : M.linie; },
    /* variabilele vizibile acum, în ordinea declarării */
    variabile(laSfarsit) {
      const pc = M.pc, vedem = new Map();
      for (const v of toateVar) {
        if (v.ty === 'err') continue;
        if (laSfarsit ? (v.glob || v.nivel <= 1 || S[v.slot] !== undefined) : (v.glob || (pc >= v.pc0 && pc < (v.pc1 == null ? Infinity : v.pc1)))) vedem.set(v.nume, v);   /* cea mai nouă o ascunde pe cea veche */
      }
      return [...vedem.values()].map(v => {
        const x = S[v.slot];
        return v.arr
          ? {nume: v.nume, tip: `${NUME_TIP[v.ty]}[${x ? x.length : (v.n == null ? '' : v.n)}]`, tablou: true, valori: x ? x : null, ty: v.ty, indice: v.ui}
          : {nume: v.nume, tip: NUME_TIP[v.ty], valoare: x, ty: v.ty};
      });
    },
    /* starea la sfârșit: variabilele din blocul lui main și cele globale (pentru teste) */
    stare() {
      const o = {};
      for (const v of toateVar) {
        if (v.ty === 'err' || (!v.glob && v.nivel > 1)) continue;
        const x = S[v.slot];
        o[v.nume] = v.arr ? (x ? Array.from(x, y => (typeof y === 'bigint' ? Number(y) : y)) : null) : (typeof x === 'bigint' ? Number(x) : x);
      }
      return o;
    },
    stareToate() {
      const o = {};
      for (const v of toateVar) {
        if (v.ty === 'err' || v.arr) continue;
        const x = S[v.slot];
        o[v.nume] = typeof x === 'bigint' ? Number(x) : x;
      }
      return o;
    }
  };
  return P;
}
function putere(a, b) {
  /* rezultatele exacte, exact: Math.pow din JS poate greși ultima cifră binară (10^k), pow din runtime nu pe aceste cazuri */
  if (Number.isInteger(a) && Number.isInteger(b) && Math.abs(a) <= 1e15 && Math.abs(b) <= 400 && a !== 0) {
    const e = BigInt(Math.abs(b));
    const w = BigInt(a) ** e;
    if (b >= 0) { const r = Number(w); if (Number.isFinite(r)) return r; }
    else { const n = Number(w); if (Number.isFinite(n) && Math.abs(n) <= 9007199254740992) return 1 / n; }
  }
  return Math.pow(a, b);
}

/* rulare dintr-o bucată, cu toată intrarea dată dinainte (fără pagină): oracolul și testele atelierului */
function ruleaza(sursa, o) {
  o = o || {};
  const P = typeof sursa === 'string' ? compileaza(sursa) : sursa;
  const r = {compilat: P.ok, erori: P.erori, refuz: P.refuz, iesire: '', octeti: '', cod: null, oprire: null, pasi: 0, stare: null};
  if (!P.ok) return r;
  P.pregateste({intrare: o.intrare, plafon: o.plafon, limIesire: o.limIesire});
  let z;
  do { z = P.merge(1000000); } while (z.stare === 'felie');
  r.octeti = P.iesire(); r.iesire = dinOcteti(r.octeti); r.pasi = P.pasi();
  if (z.stare === 'oprit') r.oprire = {tip: z.oprire.tip, mesaj: z.oprire.mesaj, linie: z.oprire.linie == null ? null : z.oprire.linie};
  else r.cod = P.cod();
  r.stare = P.stare();
  return r;
}

/* ================ testele atelierului (fără pagină, deci se pot proba și în Node) ================ */
const scoateNonCod = s => String(s).replace(/\r\n?/g, '\n').replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/[^\n]*/g, ' ').replace(/"(?:[^"\\\n]|\\.)*"/g, '""').replace(/'(?:[^'\\\n]|\\.)*'/g, "''");
const curataLinii = s => s.replace(/\r\n?/g, '\n').split('\n').map(l => l.replace(/[ \t]+$/, '')).join('\n').replace(/\n+$/, '');
/* numerele din ieșire, cu locul lor: „x1” nu e număr, în „suma-3” minusul e o liniuță, în „a=-3” e semn; fără lookbehind (Safari vechi) */
function numereCuLoc(s) {
  const R = [], re = /\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g, lit = /[\p{L}\p{N}_]/u;
  let m;
  while ((m = re.exec(s))) {
    let a = m.index;
    const pr = s[a - 1];
    if (pr !== undefined && (lit.test(pr) || pr === '.')) continue;
    const dupa = s[a + m[0].length];
    if (dupa !== undefined && lit.test(dupa)) continue;
    if ((pr === '-' || pr === '+') && !(s[a - 2] !== undefined && /[\p{L}\p{N}_)\]]/u.test(s[a - 2]))) a--;
    R.push({t: s.slice(a, m.index + m[0].length), a, b: m.index + m[0].length});
  }
  return R;
}
const numere = s => numereCuLoc(s).map(x => x.t);
const acelasiNumar = (x, y) => x === y || Number(x) === Number(y);
/* numerele cerute trebuie să fie ULTIMELE din ieșire. Un număr dinaintea lor e primit numai dacă e într-un text, adică după el vin litere
   („Suma celor 2 numere: 5”); „1 1 2 3” când se cere „1 2 3” nu e primit. */
function potrivireNumere(iesire, astept) {
  const a = numereCuLoc(iesire), b = numere(String(astept));
  if (a.length < b.length) return false;
  const k = a.length - b.length;
  for (let i = 0; i < b.length; i++) if (!acelasiNumar(a[k + i].t, b[i])) return false;
  if (k === 0) return true;
  const inainte = iesire.slice(a[k - 1].b, b.length ? a[k].a : iesire.length);
  return /\p{L}/u.test(inainte);
}
/* `ultimul` judecă numărul, nu forma: un număr lipit de litere („Suma este5”, „5lei”) tot rezultat e. Liniuța lipită de un cuvânt e și ea nesigură:
   în „Suma-3” poate fi „Suma-” + 3 sau „Suma” + -3, deci alt = celălalt citit. */
function numereUltimul(s) {
  const R = [], re = /\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g, lit = /[\p{L}_]/u;
  let m;
  while ((m = re.exec(s))) {
    const pr = s[m.index - 1], dupa = s[m.index + m[0].length];
    if (pr !== undefined && pr === '.') continue;
    if (pr !== undefined && dupa !== undefined && lit.test(pr) && lit.test(dupa)) continue;   /* a1b: nu e număr */
    let t = m[0], alt = null;
    if (pr === '-' || pr === '+') {
      if (s[m.index - 2] !== undefined && /[\p{L}\p{N}_)\]]/u.test(s[m.index - 2])) alt = pr + m[0];
      else t = pr + m[0];
    }
    R.push({t, alt});
  }
  return R;
}
const ultimulBun = (x, b) => acelasiNumar(x.t, b) || (x.alt != null && acelasiNumar(x.alt, b));
/* subșir: numerele cerute se văd în ieșire, în ordinea lor, dar printre altele */
const eSubsir = (a, b) => { let k = 0; for (const x of a) if (k < b.length && acelasiNumar(x, b[k])) k++; return k === b.length; };
/* D4: ce a căutat testul, spus exact; vizibil = rezultatul se vede în ieșire, deci mesajul autorului („afișează a + b”) i-ar cere ce a făcut deja */
function motivPotrivire(iesire, astept, fel) {
  switch (fel || 'linii') {
    case 'exact': return {m: 'Testul compară ieșirea întreagă, semn cu semn, cu ce cere exercițiul.'};
    case 'cuvinte': return {m: 'Testul compară ieșirea cuvânt cu cuvânt cu ce cere exercițiul (spațiile și rândurile noi nu contează).'};
    case 'contine': return {m: 'Testul caută în ieșire un anumit text și nu l-a găsit.'};
    case 'numere': {
      const a = numere(iesire), b = numere(String(astept));
      if (a.length < b.length) return {m: `Testul caută ${b.length} ${b.length === 1 ? 'număr' : 'numere'} în ce afișează programul și a găsit ${a.length}.`};
      if (eSubsir(a, b)) return {vizibil: true, m: `Testul compară ultimele ${b.length} numere afișate și nu primește alte numere între ele. Afișează doar numerele cerute, fără numărul lor de ordine.`};
      return {m: `Testul compară ultimele ${b.length} numere afișate cu cele cerute. Aici sunt: ${escH(a.slice(-b.length).join(' '))}.`};
    }
    case 'ultimul': {
      const a = numereUltimul(iesire), b = numere(String(astept)), c = b[b.length - 1];
      if (!a.length) return {m: 'Testul caută un număr în ce afișează programul și n-a găsit niciunul.'};
      const u = a[a.length - 1];
      if (c !== undefined && Number(u.t) === -Number(c) && /^-/.test(u.t)) return {vizibil: true, m: `Testul ia ca rezultat ultimul număr afișat, iar liniuța lipită de el e citită ca minus: ${escH(u.t)}. Pune un spațiu după liniuță.`};
      if (c !== undefined && a.some(x => ultimulBun(x, c))) return {vizibil: true, m: `Testul ia ca rezultat ULTIMUL număr afișat, iar aici acesta e ${escH(u.t)}. Rezultatul trebuie să fie ultimul număr afișat.`};
      return {m: `Testul ia ca rezultat ultimul număr afișat, iar aici acesta e ${escH(u.t)}.`};
    }
    default: return {m: 'Testul compară ieșirea rând cu rând cu ce cere exercițiul (spațiile de la sfârșit de rând nu contează).'};
  }
}
function potrivire(iesire, astept, fel) {
  switch (fel || 'linii') {
    case 'exact': return iesire === astept;
    case 'cuvinte': return iesire.trim().split(/\s+/).join(' ') === String(astept).trim().split(/\s+/).join(' ');
    case 'contine': return iesire.includes(astept);
    case 'numere': return potrivireNumere(iesire, astept);
    case 'ultimul': { const a = numereUltimul(iesire), b = numere(String(astept)); return a.length > 0 && b.length > 0 && ultimulBun(a[a.length - 1], b[b.length - 1]); }
    default: return curataLinii(iesire) === curataLinii(String(astept));
  }
}
const escH = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
const scurt = s => { const t = String(s).replace(/\n/g, ' ⏎ ').trim(); return escH(t.length > 90 ? t.slice(0, 87) + '…' : t); };
function egalStare(asteptat, x) {
  if (Array.isArray(asteptat)) return Array.isArray(x) && asteptat.every((v, k) => egalStare(v, x[k]));
  if (typeof asteptat === 'number') return typeof x === 'number' && Math.abs(x - asteptat) < 1e-9;
  return x === asteptat;
}
const PLAFON_TEST = 3000000, LIM_IESIRE_TEST = 200000;
const PLAFON_VERIFICA_MS = 2500;
const mesajPlafon = (cuDate, ce) => `${cuDate}${cuDate ? 'p' : 'P'}rogramul n-a terminat în limita unui test din pagină (${ce}). Asta nu spune singură că programul e greșit: fie are o repetiție care nu se termină, fie datele testului cer prea mult pentru pagină. Apasă Rulează cu aceleași date și urmărește ce face.`;
const cuDateTest = intrare => (intrare != null && intrare !== '' ? `Cu datele „${scurt(intrare)}”, ` : '');
const faceRulari = t => !(t.eroare || t.cod != null || t.codNu != null || t.compileaza || t.pas);
/* judecă un test pe textul de ACUM; ses = ce s-a atins în rularea pas cu pas (pentru testele `pas`).
   rulari: Map intrare → rezultat, ca o rulare să nu se facă de două ori; cu peFelii, testul nu rulează nimic: întoarce {lipsa: intrare}, iar pagina rulează pe felii și revine. */
function judecaTest(t, sursa, ses, compilat, rulari, peFelii) {
  const P0 = compilat || compileaza(sursa);
  if (t.eroare) {
    const e = P0.erori.find(x => (typeof t.eroare === 'string' ? x.mesaj.includes(t.eroare) : (t.eroare.mesaj == null || x.mesaj.includes(t.eroare.mesaj)) && (t.eroare.linie == null || x.linie === t.eroare.linie)));
    return {ok: !!e, m: t.msg || (P0.erori.length ? `Compilatorul arată altă eroare: linia ${P0.erori[0].linie}: ${escH(P0.erori[0].mesaj)}.` : 'Programul se compilează fără eroare: încă n-ai făcut schimbarea cerută.')};
  }
  if (t.cod != null) {
    const ok = new RegExp(t.cod).test(scoateNonCod(sursa));
    if (!ok) return {ok, m: t.msg || `În program nu apare încă ce cere testul „${t.ce}”.`};
    if (t.codNu == null) return {ok};
  }
  if (t.codNu != null) { const ok = !new RegExp(t.codNu).test(scoateNonCod(sursa)); return {ok, m: t.msg || `În program apare ce nu trebuie: „${t.ce}”.`}; }
  if (t.compileaza) {
    if (P0.ok) return {ok: true};
    return {ok: false, m: P0.refuz ? escH(P0.refuz.mesaj) : mesajCompilare(P0)};
  }
  if (P0.refuz && !P0.erori.length) return {ok: false, m: escH(P0.refuz.mesaj)};
  if (!P0.ok) return {ok: false, m: mesajCompilare(P0)};
  if (t.pas) {
    const k = cheiePas(t.pas);
    if (ses && ses[k]) return {ok: true};
    return {ok: false, m: t.msg || (t.pas.oprire != null ? `Pune un punct de oprire pe linia ${t.pas.oprire} (atinge numărul liniei), apasă „Pas cu pas”, apoi „Continuă”, până se oprește acolo.` : t.pas.gata ? 'Apasă „Pas cu pas”, apoi „Pasul următor”, până la sfârșitul programului.' : 'Apasă „Pas cu pas” și mergi cu „Pasul următor” până ajungi la starea cerută.')};
  }
  const cazuri = t.cazuri || [t];
  for (const c of cazuri) {
    const intr = c.intrare == null ? '' : c.intrare;
    let r = rulari && rulari.get(intr);
    if (!r) {
      if (peFelii) return {lipsa: intr};
      r = ruleaza(P0, {intrare: intr, plafon: PLAFON_TEST, limIesire: LIM_IESIRE_TEST});
      if (rulari) rulari.set(intr, r);
    }
    const cuDate = cuDateTest(c.intrare);
    if (r.oprire && (r.oprire.tip === 'plafon' || r.oprire.tip === 'iesire')) return {ok: false, plafon: true, m: mesajPlafon(cuDate, r.oprire.tip === 'plafon' ? PLAFON_TEST.toLocaleString('ro-RO') + ' de pași' : LIM_IESIRE_TEST.toLocaleString('ro-RO') + ' de caractere afișate')};
    if (r.oprire) return {ok: false, m: `${cuDate}${cuDate ? 'p' : 'P'}rogramul s-a oprit: ${escH(r.oprire.mesaj)}`};
    if (c.iese != null && !potrivire(r.iesire, c.iese, c.potrivire || t.potrivire)) {
      const mv = motivPotrivire(r.iesire, c.iese, c.potrivire || t.potrivire);
      return {ok: false, m: (!mv.vizibil && (c.msg || t.msg) ? (c.msg || t.msg) + ' ' : '') + `${cuDate}${cuDate ? 'p' : 'P'}rogramul a afișat: „${scurt(r.iesire)}”. ${mv.m}${t.arataAsteptat ? ` Testul cere: „${scurt(c.iese)}”.` : ''}`};
    }
    if (c.stare) {
      for (const n of Object.keys(c.stare)) {
        if (!(n in r.stare)) return {ok: false, m: t.msg || `În program nu există variabila ${n} în blocul lui main.`};
        if (!egalStare(c.stare[n], r.stare[n])) return {ok: false, m: t.msg || `${cuDate}${cuDate ? 'v' : 'V'}ariabila ${n} ajunge la sfârșit ${r.stare[n] === undefined ? 'fără nicio valoare' : 'la ' + (Array.isArray(r.stare[n]) ? r.stare[n].join(', ') : r.stare[n])}. Nu e valoarea cerută.`};
      }
    }
  }
  return {ok: true};
}
const cheiePas = p => JSON.stringify(p);
function mesajCompilare(P) {
  const e = P.erori[0];
  if (!e) return '';
  return `Programul nu se compilează încă. ${e.linie ? `Linia ${e.linie}: ` : ''}${escH(e.mesaj)}. ${escH(e.explicatie || '')}`;
}
function atinsPas(p, linie, vars, gata, oprireLa) {
  if (p.gata && !gata) return false;
  if (p.linie != null && p.linie !== linie) return false;
  if (p.oprire != null && p.oprire !== oprireLa) return false;
  if (p.vars) for (const n of Object.keys(p.vars)) if (!egalStare(p.vars[n], vars[n])) return false;
  return true;
}
/* rulează pas cu pas, dintr-o bucată: pentru „rezolvă” din poarta motorului */
function atingeTotPas(sursa, intrare, teste) {
  const ses = {}, P = compileaza(sursa);
  if (!P.ok) return ses;
  const pasi = teste.filter(t => t.pas).map(t => t.pas);
  P.pregateste({intrare: intrare || '', plafon: 200000});
  for (let k = 0; k < 200000; k++) {
    const z = P.merge(1000000, {pas: true});
    if (z.stare === 'felie') continue;
    const gata = z.stare === 'gata';
    const vars = P.stareToate(), l = z.linie;
    pasi.forEach(p => { if (atinsPas(p, l, vars, gata, p.oprire != null ? l : null)) ses[cheiePas(p)] = true; });
    if (z.stare !== 'pas') break;
  }
  return ses;
}

/* ================ interfața din pagină ================ */
/* rularea în pagină */
const FELIE_MS = 12, DESEN_MS = 150, PLAFON_MS = 15000, CONTINUARE_MS = 60000, PASTREAZA_IESIRE = 100000;
const CONSOLA_VIU = {oct: 4000, randuri: 100}, CONSOLA_FINAL = {oct: 80000, randuri: 2000};
const MAI_INCET = 'mai încet decât un program compilat cu g++';
const SEMNE = ['{', '}', '(', ')', '[', ']', ';', '<', '>', '<<', '>>', '=', '==', '"', '+', '-', '*', '/', '%', '!', '&&', '||', "'", ',', '#', '_'];
const CSS = `
.cm{display:flex;flex-direction:column;gap:8px;--cm-lh:24px;--cm-ok:var(--ok,#177245);--cm-bad:var(--bad,#C63A33);--cm-marc:#FFE9A8;--cm-marcink:#18202A;--cm-err:#F8D3D0;--cm-opr:#C63A33}
@media (pointer:coarse){.cm{--cm-lh:32px}}
.cm [hidden]{display:none!important}
.cm-bara{position:relative;z-index:6;padding:4px;background:var(--paper2);border:1px solid var(--line);border-radius:8px}
.cm-semne{display:flex;flex-wrap:wrap;gap:4px}
.cm-bara-nota{display:none;margin:2px 0 0;font-size:.78rem;color:var(--ink2)}
@media (pointer:coarse){
  .cm-semne{display:grid;grid-auto-flow:column;grid-template-rows:repeat(2,36px);grid-auto-columns:minmax(40px,max-content);overflow-x:auto;-webkit-overflow-scrolling:touch}
  .cm-bara-nota{display:block}
}
.cm-bara button{min-width:36px;min-height:36px;padding:0 6px;font:600 1rem var(--fm);color:var(--ink);background:var(--paper);border:1px solid var(--line);border-radius:6px;cursor:pointer;touch-action:manipulation}
.cm-bara button:active{background:var(--sel)}
.cm-ed{display:flex;border:1px solid var(--line);border-radius:8px;overflow:hidden;background:var(--paper);min-width:0}
.cm-gut{flex:none;display:flex;flex-direction:column;background:var(--paper2);border-right:1px solid var(--line);padding:6px 0;user-select:none}
.cm-gut button{display:block;width:40px;height:var(--cm-lh);line-height:var(--cm-lh);padding:0 6px 0 0;border:0;background:transparent;color:var(--ink2);font:.85rem var(--fm);text-align:right;cursor:pointer;touch-action:manipulation;position:relative}
.cm-gut button.opr{color:#fff;font-weight:700}
.cm-gut button.opr::before{content:'';position:absolute;left:3px;right:3px;top:50%;height:22px;margin-top:-11px;border-radius:11px;background:var(--cm-opr);z-index:-1}
.cm-gut{isolation:isolate}
.cm-zona{position:relative;flex:1 1 auto;min-width:0}
.cm-fundal{position:absolute;left:0;right:0;top:6px;pointer-events:none}
.cm-fundal div{position:absolute;left:0;right:0;height:var(--cm-lh)}
.cm-fundal .err{background:var(--cm-err)}
.cm-fundal .pas{background:var(--cm-marc)}
.cm-ta{position:relative;display:block;width:100%;margin:0;padding:6px 8px;border:0;outline-offset:-2px;background:transparent;color:var(--ink);font:16px/var(--cm-lh) var(--fm);white-space:pre;overflow-x:auto;overflow-y:hidden;resize:none;tab-size:4;-moz-tab-size:4}
.cm-zona.pasviu .cm-ta,.cm-zona.marcat .cm-ta{color:var(--ink)}
.cm-unelte{display:flex;flex-wrap:wrap;gap:6px}
.cm-unelte .btn{min-height:40px}
.cm-nota{font-size:.88rem;color:var(--ink2);margin:0}
.cm-vars{border:1px solid var(--line);border-radius:8px;padding:6px 8px;background:var(--paper2);overflow-x:auto}
.cm-vars table{border-collapse:collapse;width:100%;font:.92rem var(--fm)}
.cm-vars th,.cm-vars td{border-bottom:1px solid var(--line);padding:3px 6px;text-align:left;vertical-align:top}
.cm-vars th{font-family:var(--fb);font-weight:600;color:var(--ink2)}
.cm-vars .nou{background:var(--cm-marc);color:var(--cm-marcink)}
.cm-vars .gol{color:var(--ink2);font-family:var(--fb);font-style:italic}
.cm-tab{display:flex;flex-wrap:wrap;gap:3px}
.cm-tab span{display:inline-flex;flex-direction:column;align-items:center;min-width:34px;padding:1px 3px;border:1px solid var(--line);border-radius:4px;background:var(--paper)}
.cm-tab span small{font-size:.72rem;color:var(--ink2)}
.cm-tab span.ind{border:2px solid var(--accent);background:var(--sel)}
.cm-stare{margin:0;font-size:.92rem;color:var(--ink)}
.cm-pauza{margin:0;padding:8px 10px;border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:6px;background:var(--paper2);color:var(--ink);font-size:.95rem}
.cm-cons{border:1px solid #30363D;border-radius:8px;background:#11151B;color:#E8EDF3;min-height:92px;display:flex;flex-direction:column}
.cm-cons-tit{font:600 .78rem var(--fb);color:#AEB8C4;padding:4px 8px;border-bottom:1px solid #30363D}
.cm-out{margin:0;padding:6px 8px;font:15px/1.4 var(--fm);white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere;max-height:320px;overflow-y:auto;flex:1 1 auto}
.cm-out .i{color:#8FD694}
.cm-out .s{color:#AEB8C4}
.cm-out .e{color:#FF9D94}
.cm-out .ex{color:#FFD98A;font-family:var(--fb)}
.cm-out .r{color:#BFD7FF;font-family:var(--fb)}
.cm-out .o{color:#FFD98A;font-family:var(--fb)}
.cm-in{display:flex;flex-wrap:wrap;gap:6px;padding:6px 8px;border-top:1px solid #30363D;align-items:center}
.cm-in label{flex:1 1 100%;font:.85rem var(--fb);color:#AEB8C4}
.cm-in input{flex:1 1 120px;min-width:0;min-height:40px;font:16px var(--fm);color:#fff;background:#232A33;border:1px solid #55606E;border-radius:6px;padding:0 8px}
.cm-in .btn{min-height:40px}
.cm-date summary{cursor:pointer;min-height:32px;line-height:32px;font-size:.92rem;color:var(--ink2)}
.cm-date textarea{width:100%;min-height:64px;font:16px/1.3 var(--fm);padding:6px;border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink)}
.cm-lbl{font-weight:600;font-size:.9rem;color:var(--ink2)}
.cm-teste{margin:0;padding-left:1.3em}
.cm-teste li{margin:2px 0}
.cm.verif .cm-teste li.ok{color:var(--cm-ok)}
.cm.verif .cm-teste li.ok::marker{content:'✓ '}
.cm.verif .cm-teste li.no{color:var(--cm-bad)}
.cm.verif .cm-teste li.no::marker{content:'✗ '}
`;
function pregatesteCss() {
  if (typeof document === 'undefined' || document.getElementById('cm-css')) return;
  const s = document.createElement('style'); s.id = 'cm-css'; s.textContent = CSS; document.head.appendChild(s);
}
/* ce păstrează pagina e al elevului de pe scaun ACUM (regula 23): cu un elev înscris, ciorna stă pe profilul lui;
   fără elev înscris, doar în fila deschisă; „Ia-o de la capăt” o șterge. Nimic nu pleacă în afara calculatorului. */
function profil() {
  try {
    if (root.Prezenta && root.Prezenta.stare && root.Prezenta.stare() === 'intreaba') return '';
    const p = localStorage.getItem('learninghub_active_profile');
    return p && p !== '_guest' ? p : '';
  } catch (e) { return ''; }
}
const MEM = {};
function cheieCiorna(Q) {
  let lectie = '';
  try { lectie = (root.JocMotor && root.JocMotor.test && root.JocMotor.test.config && root.JocMotor.test.config().cheie) || location.pathname; } catch (e) { lectie = ''; }
  let h = 0; const s = String(Q.id || ((Q.start || '') + '|' + (Q.q || '')));
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return `cppmic:${lectie}:${Q.id || h}`;
}
const eRecitire = () => { try { return !!(root.JocMotor && root.JocMotor.recitire && root.JocMotor.recitire()); } catch (e) { return false; } };
function citesteCiorna(k) {
  const p = profil();
  try {
    const v = p ? localStorage.getItem(k + '@' + p) : sessionStorage.getItem(k);
    if (typeof v === 'string' && v.length <= 40000) return v;
  } catch (e) { /* fără stocare: rămâne în memorie */ }
  return k in MEM && MEM[k].p === p ? MEM[k].t : null;
}
function scrieCiorna(k, t) {
  const p = profil();
  MEM[k] = {p, t};
  if (eRecitire()) return;
  try { if (p) localStorage.setItem(k + '@' + p, t); else sessionStorage.setItem(k, t); } catch (e) { /* plin sau oprit */ }
}
function stergeCiorna(k) {
  delete MEM[k];
  const p = profil();
  try { if (p) localStorage.removeItem(k + '@' + p); sessionStorage.removeItem(k); } catch (e) { /* nimic */ }
}
const atingere = () => { try { return matchMedia('(pointer: coarse)').matches; } catch (e) { return false; } };

function monteaza(body, Q, api) {
  pregatesteCss();
  const teste = Q.teste || [];
  const k = cheieCiorna(Q);
  const start = String(Q.start == null ? '' : Q.start);
  const salvat = Q.doarCitire ? null : citesteCiorna(k);
  const areDate = Q.intrare != null;
  body.innerHTML = `<div class="cm">
    ${Q.doarCitire ? '' : `<div class="cm-bara"><div class="cm-semne" role="toolbar" aria-label="Semnele greu de găsit pe telefon">${SEMNE.map(s => `<button type="button" data-s="${escH(s)}" aria-label="Scrie ${escH(s)}">${escH(s)}</button>`).join('')}<button type="button" data-tab="1" aria-label="Tab: mută textul spre dreapta cu patru spații">Tab</button></div><p class="cm-bara-nota">Mai sunt semne: trage bara spre stânga.</p></div>`}
    <div class="cm-ed">
      <div class="cm-gut" aria-label="Numerele liniilor. Atinge un număr ca să pui un punct de oprire."></div>
      <div class="cm-zona"><div class="cm-fundal" aria-hidden="true"></div><textarea class="cm-ta" wrap="off" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="Programul tău în C++"${Q.doarCitire ? ' readonly' : ''}></textarea></div>
    </div>
    <div class="cm-unelte">
      <button type="button" class="btn primary" data-x="ruleaza">Rulează</button>
      ${Q.pasCuPas === false ? '' : '<button type="button" class="btn" data-x="pas">Pas cu pas</button>'}
      <button type="button" class="btn" data-x="pasul" hidden>Pasul următor</button>
      <button type="button" class="btn" data-x="continua" hidden>Continuă</button>
      <button type="button" class="btn primary" data-x="inca" hidden>Lasă-l să continue</button>
      <button type="button" class="btn ghost" data-x="stop" hidden>Oprește</button>
      <button type="button" class="btn ghost" data-x="capat">${Q.doarCitire ? 'Ia-o de la capăt' : 'Sunt alt elev / Ia-o de la capăt'}</button>
    </div>
    <p class="cm-nota cm-notap" hidden></p>
    <p class="cm-stare" hidden></p>
    <p class="cm-pauza" role="alert" hidden></p>
    <div class="cm-vars" hidden></div>
    <div class="cm-cons">
      <div class="cm-cons-tit">Consola: aici afișează programul și aici îi scrii date</div>
      <pre class="cm-out" aria-live="polite" tabindex="0"></pre>
      <div class="cm-in" hidden><label for="cm-i-${k.length}">Programul așteaptă date. Scrie-le aici și apasă Trimite.</label><input id="cm-i-${k.length}" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="send"><button type="button" class="btn primary" data-x="trimite">Trimite</button><button type="button" class="btn ghost" data-x="eof">Nu mai am date</button></div>
    </div>
    <details class="cm-date"${areDate ? ' open' : ''}><summary>Date gata pentru rulare (nu e obligatoriu)</summary><textarea spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="Datele pe care le primește programul la rulare, ca și cum le-ai scrie în consolă">${escH(Q.intrare || '')}</textarea></details>
    ${teste.length ? `<div class="cm-lbl">Testele</div><ul class="cm-teste">${teste.map((t, i) => `<li data-t="${i}">${t.ceHtml || escH(t.ce)}</li>`).join('')}</ul>` : ''}
  </div>`;
  const $ = s => body.querySelector(s);
  const rad = $('.cm'), ta = $('.cm-ta'), gut = $('.cm-gut'), fundal = $('.cm-fundal'), out = $('.cm-out'), rIn = $('.cm-in'), inp = rIn.querySelector('input'), vars = $('.cm-vars'), notaP = $('.cm-notap'), date = $('.cm-date textarea'), stareP = $('.cm-stare'), pauzaP = $('.cm-pauza');
  const B = n => $(`[data-x="${n}"]`);
  ta.value = salvat != null ? salvat : start;
  const st = {P: null, mod: null, parti: [], pidOut: 0, opriri: new Set(), ses: {}, marc: {err: new Set(), pas: null}, verificat: false, timer: null, ultima: null, lucrat: 0, ultimTic: 0, prag: PLAFON_MS, ultimDesen: 0, secunde: -1, cache: {src: null, rulari: new Map(), P0: null}, verif: null};
  const stergeInterval = () => { st.timer = null; };
  const canal = typeof MessageChannel !== 'undefined' ? new MessageChannel() : null;
  if (canal) canal.port1.onmessage = () => { if (st.fFelie) { const f = st.fFelie; st.fFelie = null; f(); } if (st.timer) { st.timer = null; lucreaza(); } };
  const laFelie = f => { st.fFelie = f; if (canal) canal.port2.postMessage(0); else setTimeout(() => { if (st.fFelie === f) { st.fFelie = null; f(); } }, 0); };
  const dinNou = () => { st.timer = true; if (canal) canal.port2.postMessage(0); else setTimeout(() => { if (st.timer) { st.timer = null; lucreaza(); } }, 0); };

  /* ---- editorul ---- */
  function linii() { return ta.value.split('\n').length; }
  function deseneazaGut() {
    const n = linii();
    if (gut.childElementCount !== n) {
      let h = '';
      for (let i = 1; i <= n; i++) h += `<button type="button" data-l="${i}" aria-label="Linia ${i}. Atinge ca să pui sau să scoți un punct de oprire.">${i}</button>`;
      gut.innerHTML = h;
    }
    gut.querySelectorAll('button').forEach(b => { const on = st.opriri.has(+b.dataset.l); b.classList.toggle('opr', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    const lh = parseFloat(getComputedStyle(ta).lineHeight) || 24;
    ta.style.height = (Math.max(n, Q.linii || 8) * lh + 12 + 18) + 'px';
    fundal.innerHTML = [...st.marc.err].map(l => `<div class="err" style="top:${(l - 1) * lh}px"></div>`).join('') + (st.marc.pas ? `<div class="pas" style="top:${(st.marc.pas - 1) * lh}px"></div>` : '');
  }
  function marcheazaLinie(l) {
    const b = gut.querySelector(`[data-l="${l}"]`);
    if (b && b.scrollIntoView) { try { b.scrollIntoView({block: 'nearest'}); } catch (e) { /* vechi */ } }
    aduLinia(l);
  }
  /* bara de semne rămâne la vedere: .book{overflow:hidden} din motor anulează position:sticky, așa că o mutăm noi, cu transform, în
     interiorul editorului. Sus = marginea de sus a ecranului vizibil (visualViewport: cu tastatura deschisă, pagina se poate muta sub ea);
     banda motorului (.hud) rămâne deasupra, dacă e loc; pe un ecran mic, cu tastatura deschisă, bara o acoperă. */
  const bara0 = $('.cm-bara'), edEl = $('.cm-ed');
  const vedere = () => { const v = root.visualViewport; return v ? {sus: v.offsetTop, jos: v.offsetTop + v.height, h: v.height} : {sus: 0, jos: innerHeight, h: innerHeight}; };
  function lipesteBara() {
    if (!bara0) return;
    const w = vedere(), z = rad.getBoundingClientRect(), e = edEl.getBoundingClientRect(), h = bara0.offsetHeight;
    let sus = w.sus;
    const hud = document.querySelector('.hud');
    if (hud && w.h >= 560) { const r = hud.getBoundingClientRect(); if (r.height && r.top <= sus + 1 && r.bottom > sus) sus = r.bottom; }
    const dy = Math.min(Math.max(0, sus - z.top), Math.max(0, e.bottom - z.top - h));
    bara0.style.transform = dy > 0 ? `translate3d(0,${Math.round(dy * 100) / 100}px,0)` : '';
    bara0.classList.toggle('lipita', dy > 0);
  }
  /* linia l trebuie să fie între bară și marginea de jos a ecranului vizibil (acolo începe tastatura) */
  function aduLinia(l) {
    const lh = parseFloat(getComputedStyle(ta).lineHeight) || 24, r = ta.getBoundingClientRect();
    const y = r.top + 6 + (l - 1) * lh, w = vedere();
    lipesteBara();
    const sus = bara0 && bara0.classList.contains('lipita') ? bara0.getBoundingClientRect().bottom : w.sus;
    let d = 0;
    if (y + lh > w.jos - 2) d = y + lh + 8 - w.jos;
    else if (y < sus + 2) d = y - sus - 8;
    if (d) { root.scrollBy(0, d); lipesteBara(); }
  }
  let rafBara = 0;
  const planBara = () => {
    if (!rad.isConnected) { scoateAscultatori(); return; }
    if (rafBara) return;
    rafBara = requestAnimationFrame(() => { rafBara = 0; lipesteBara(); });
  };
  function scoateAscultatori() {
    root.removeEventListener('scroll', planBara, true); root.removeEventListener('resize', planBara);
    if (root.visualViewport) { root.visualViewport.removeEventListener('scroll', planBara); root.visualViewport.removeEventListener('resize', planBara); }
  }
  if (bara0) {
    root.addEventListener('scroll', planBara, {capture: true, passive: true}); root.addEventListener('resize', planBara, {passive: true});
    if (root.visualViewport) { root.visualViewport.addEventListener('scroll', planBara, {passive: true}); root.visualViewport.addEventListener('resize', planBara, {passive: true}); }
  }
  const liniaCursor = () => ta.value.slice(0, ta.selectionEnd).split('\n').length;
  const aratCursor = () => { if (bara0 && document.activeElement === ta) requestAnimationFrame(() => { if (document.activeElement === ta) aduLinia(liniaCursor()); }); };
  function insereaza(s) {
    if (ta.readOnly) return;
    ta.focus({preventScroll: true});
    let ok = false;
    try { ok = document.execCommand('insertText', false, s); } catch (e) { ok = false; }
    if (!ok) {
      const a = ta.selectionStart, b = ta.selectionEnd;
      ta.setRangeText(s, a, b, 'end');
      ta.dispatchEvent(new Event('input', {bubbles: true}));
    }
  }
  function cuSelectie(a, b, s) { ta.setSelectionRange(a, b); insereaza(s); }
  const inceputLinie = () => ta.value.lastIndexOf('\n', ta.selectionStart - 1) + 1;
  function laAcolada() {     /* } pe o linie doar cu spații: revine cu patru spații spre stânga */
    const a = inceputLinie(), inainte = ta.value.slice(a, ta.selectionStart);
    if (ta.selectionStart === ta.selectionEnd && /^ +$/.test(inainte)) {
      const nou = inainte.slice(0, Math.max(0, inainte.length - 4));
      cuSelectie(a, ta.selectionStart, nou + '}');
      return true;
    }
    return false;
  }
  function tab(invers) {
    if (invers) {
      const a = inceputLinie(), m = ta.value.slice(a).match(/^ {1,4}/);
      if (m) { const c = ta.selectionStart; cuSelectie(a, a + m[0].length, ''); ta.setSelectionRange(Math.max(a, c - m[0].length), Math.max(a, c - m[0].length)); }
      return;
    }
    insereaza('    ');
  }
  let escApasat = false;
  ta.addEventListener('keydown', ev => {
    if (ev.key === 'F9') { ev.preventDefault(); apasa('ruleaza'); return; }
    if (ev.key === 'Escape') { escApasat = true; return; }
    if (ev.key === 'Tab') {
      if (escApasat || ta.readOnly) { escApasat = false; return; }       /* Esc, apoi Tab: ieși din editor, cu tastatura */
      ev.preventDefault(); tab(ev.shiftKey); return;
    }
    escApasat = false;
    if (ta.readOnly || ev.isComposing) return;
    if (ev.key === 'Enter' && !ev.ctrlKey && !ev.altKey && !ev.metaKey && !ev.shiftKey) {
      const a = inceputLinie(), lin = ta.value.slice(a, ta.selectionStart), ind = lin.match(/^ */)[0];
      ev.preventDefault();
      insereaza('\n' + ind + (/\{\s*$/.test(lin) ? '    ' : ''));
    } else if (ev.key === '}' && !ev.ctrlKey && !ev.metaKey) {
      if (laAcolada()) ev.preventDefault();
    }
  });
  ta.addEventListener('input', () => {
    st.marc.err.clear();
    st.ses = {};
    deseneazaGut();
    if (!Q.doarCitire) scrieCiorna(k, ta.value);
    if (st.verif && !st.verif.deLaButon) anuleazaVerificarea();
    if (st.verificat && teste.length) { rad.querySelectorAll('.cm-teste li').forEach(li => li.classList.remove('ok', 'no')); }
    aratCursor();
  });
  ta.addEventListener('focus', () => { planBara(); aratCursor(); });
  ta.addEventListener('click', aratCursor);
  ta.addEventListener('keyup', ev => { if (ev.key && ev.key.indexOf('Arrow') === 0) aratCursor(); });
  const bara = $('.cm-bara');
  if (bara) {
    /* apăsarea pe bară nu ia focusul din editor (tastatura telefonului rămâne deschisă) */
    bara.addEventListener('pointerdown', ev => { if (ev.target.closest('button')) ev.preventDefault(); });
    bara.addEventListener('mousedown', ev => { ev.preventDefault(); });
    bara.addEventListener('click', ev => {
      const b = ev.target.closest('button'); if (!b) return;
      if (b.dataset.tab) { ta.focus({preventScroll: true}); tab(false); return; }
      const s = b.dataset.s;
      ta.focus({preventScroll: true});
      if (s === '}' && laAcolada()) return;
      insereaza(s);
    });
  }
  gut.addEventListener('mousedown', ev => { ev.preventDefault(); });
  gut.addEventListener('click', ev => {
    const b = ev.target.closest('button'); if (!b) return;
    const l = +b.dataset.l;
    if (st.opriri.has(l)) st.opriri.delete(l); else st.opriri.add(l);
    deseneazaGut();
  });

  /* ---- consola ---- */
  /* Consola desenează doar coada: un rând nou costă așezare în pagină, iar la i++ uitat cu endl vin sute de mii. Ce nu se desenează nu se
     pierde din socoteală: spune câte a afișat programul de fapt. În timpul rulării, coada e scurtă; la sfârșit, mai lungă. */
  function deseneazaConsola(viu) {
    let h = '';
    for (const p of st.parti) h += p.c ? `<span class="${p.c}">${p.h}</span>` : p.h;
    const P = st.P;
    if (!P) { out.innerHTML = h; return; }
    const L = viu ? CONSOLA_VIU : CONSOLA_FINAL, tot = P.iesireTotal();
    let de = Math.max(P.iesireTaiat(), tot - L.oct);
    let bucata = P.iesireDe(de);
    /* cel mult L.randuri rânduri, luate de la coadă */
    let n = 0, k = bucata.length, taiatR = false;
    while (k > 0) { const i = bucata.lastIndexOf('\n', k - 1); if (i < 0) break; if (++n > L.randuri) { k = i + 1; taiatR = true; break; } k = i; }
    if (taiatR) { bucata = bucata.slice(k); de += k; }
    else if (de > P.iesireTaiat() || de > 0) { /* începem pe un caracter întreg (octeții UTF-8 se decodează abia aici) */
      let a = 0; while (a < bucata.length && (bucata.charCodeAt(a) & 0xC0) === 0x80) a++;
      if (a) { bucata = bucata.slice(a); de += a; }
    }
    /* ieșirea programului și ce scrie elevul stau în ordine; octeții se decodează abia la afișare */
    let txt = '', ult = de;
    for (const m of st.intrari || []) {
      if (m.poz < de) continue;
      txt += escH(dinOcteti(P.iesireDe(ult, m.poz))) + `<span class="i">${escH(m.t)}</span>`; ult = m.poz;
    }
    txt += escH(dinOcteti(P.iesireDe(ult)));
    let cap = '';
    if (de > 0) {
      const r = P.randuri();
      cap = `<span class="s">Consola arată doar ultima parte. Până aici, programul a afișat ${tot.toLocaleString('ro-RO')} de caractere${r ? `, pe ${r.toLocaleString('ro-RO')} de rânduri` : ''}.</span>\n`;
    }
    out.innerHTML = cap + txt + h;
    out.scrollTop = out.scrollHeight;
  }
  function adauga(c, html) { st.parti.push({c, h: html}); deseneazaConsola(); }
  function golesteConsola() { st.parti = []; st.intrari = []; out.innerHTML = ''; }
  function arataErori(P) {
    st.P = null; st.intrari = [];
    golesteConsola();
    if (P.refuz && !P.erori.length) { adauga('o', escH(P.refuz.mesaj)); return; }
    const L = P.erori.slice(0, 3);
    let h = '';
    L.forEach((e) => {
      if (e.linie) st.marc.err.add(e.linie);
      h += `<span class="e">${e.linie ? `linia ${e.linie}: ` : ''}${e.clasa === 'link' ? '' : e.clasa + ': '}${escH(e.mesaj)}</span>\n`;
      if (e.explicatie) h += `<span class="ex">${escH(e.explicatie)}</span>\n`;
    });
    if (P.erori.length > L.length) h += `<span class="s">g++ arată și alte erori după acestea. Repară-le pe primele și rulează din nou.</span>\n`;
    out.innerHTML = h;
    deseneazaGut();
    if (L[0] && L[0].linie) marcheazaLinie(L[0].linie);
  }
  function notaDiacritice() {
    /* în pagină, textele cu diacritice se văd corect; într-o consolă Windows cu pagina de cod 852, nu (probat: lectii/_sim/cpp-mic.GATA.md) */
    if (!st.P || !/[\x80-\xFF]/.test(st.P.iesireDe(st.P.iesireTaiat()))) return '';
    return '\nNotă: aici, în pagină, literele cu diacritice se văd corect. Într-o consolă de Windows pot ieși alte semne, de aceea la lecții scriem textul afișat fără diacritice.';
  }
  function arataGata() {
    const c = st.P.cod();
    const u = (c >>> 0).toString(16).toUpperCase();
    adauga('r', `\nProgramul s-a terminat. Codul de ieșire: ${c} (0x${u}).${c === 0 ? '' : ' Un cod diferit de 0 vine din return.'}${notaDiacritice()}`);
  }
  function arataOprire(e) {
    if (e.linie) { st.marc.err.add(e.linie); deseneazaGut(); marcheazaLinie(e.linie); }
    adauga('o', `\nRularea s-a oprit${e.linie ? ` la linia ${e.linie}` : ''}. ${escH(e.mesaj)}`);
  }
  function incheie(mod) {
    stergeInterval();
    st.mod = null;
    rIn.hidden = true;
    const peOprire = document.activeElement === B('stop') || document.activeElement === B('inca');
    stareP.hidden = true; pauzaP.hidden = true; B('inca').hidden = true;
    out.removeAttribute('aria-busy');
    B('ruleaza').hidden = false; if (B('pas')) B('pas').hidden = false;
    B('pasul').hidden = true; B('continua').hidden = true; B('stop').hidden = true;
    if (!Q.doarCitire) ta.readOnly = false;
    st.marc.pas = null;
    notaP.hidden = true;
    vars.hidden = mod !== 'pasFinal';
    deseneazaGut();
    if (peOprire) B('ruleaza').focus({preventScroll: true});
    bifeazaTarziu();
  }
  function cereDate() {
    rIn.hidden = false;
    inp.value = '';
    inp.focus({preventScroll: true});
    try { rIn.scrollIntoView({block: 'nearest'}); } catch (e) { /* vechi */ }
  }
  /* Rularea: programul lucrează câte FELIE_MS, apoi lasă pagina să respire, așa că „Oprește” e mereu viu. Plafonul e pe TIMP: după PLAFON_MS,
     programul stă și întreabă; pagina nu poate ști dacă e o buclă fără sfârșit sau doar un calcul lung, iar elevul îl poate lăsa să continue. */
  const felie = 2000;       /* instrucțiuni între două priviri la ceas */
  const acum = () => (root.performance && performance.now ? performance.now() : Date.now());
  const optiuni = () => (st.mod === 'pas' ? (st.fara ? {opriri: st.opriri} : {pas: true}) : {});
  function pornesteCeas() { st.lucrat = 0; st.prag = PLAFON_MS; st.ultimTic = acum(); st.ultimDesen = 0; st.secunde = -1; stareP.hidden = true; pauzaP.hidden = true; }
  function deseneazaViu() {
    const t = acum();
    if (t - st.ultimDesen >= DESEN_MS) { deseneazaConsola(true); st.ultimDesen = acum(); }
    const sec = Math.floor(st.lucrat / 1000);
    if (sec !== st.secunde && sec >= 1) { st.secunde = sec; stareP.textContent = `Programul rulează de ${sec} s. Poți să-l oprești oricând.`; stareP.hidden = false; }
  }
  function punePauza() {
    const sec = Math.round(st.lucrat / 1000);
    deseneazaConsola(true);
    out.removeAttribute('aria-busy');
    stareP.hidden = true;
    pauzaP.textContent = `Programul rulează de ${sec} s și nu s-a terminat, așa că l-am pus pe pauză. Pagina nu poate ști de ce: fie are o repetiție a cărei condiție nu devine niciodată falsă, fie e doar un calcul lung. Aici, în pagină, rulează ${MAI_INCET}. Dacă programul afișează mereu același lucru sau nu vezi de ce s-ar termina, oprește-l și verifică repetiția. Dacă știi că are mult de lucru, lasă-l să continue.`;
    pauzaP.hidden = false;
    B('inca').hidden = false;
  }
  function lasaSaContinue() {
    if (!st.mod || B('inca').hidden) return;
    if (document.activeElement === B('inca')) B('stop').focus({preventScroll: true});
    B('inca').hidden = true; pauzaP.hidden = true;
    st.prag = st.lucrat + CONTINUARE_MS; st.ultimTic = acum();
    out.setAttribute('aria-busy', 'true');
    lucreaza();
  }
  function lucreaza() {
    stergeInterval();
    if (!st.mod) return;
    const t0 = acum(), o = optiuni();
    st.lucrat += t0 - st.ultimTic;
    let z;
    do { z = st.P.merge(felie, o); } while (z.stare === 'felie' && acum() - t0 < FELIE_MS);
    st.ultimTic = acum();
    st.lucrat += st.ultimTic - t0;
    if (z.stare === 'felie') {
      deseneazaViu();
      if (st.lucrat >= st.prag) { punePauza(); return; }
      dinNou();
      return;
    }
    stareP.hidden = true;
    if (st.mod === 'pas') { dupaPas(z); return; }
    deseneazaConsola();
    if (z.stare === 'cere') { out.removeAttribute('aria-busy'); cereDate(); return; }
    if (z.stare === 'gata') { arataGata(); incheie(); return; }
    if (z.stare === 'oprit') { arataOprire(z.oprire); incheie(); return; }
  }
  const dateGata = () => { const v = date.value; return v && !/\s$/.test(v) ? v + '\n' : v; };   /* ca după Enter în consolă */
  function ruleazaProgram() {
    if (st.mod) return;
    anuleazaVerificarea();
    st.marc.err.clear();
    const P = compileaza(ta.value);
    if (!P.ok) { arataErori(P); bifeaza(); return; }
    golesteConsola();
    deseneazaGut();
    st.P = P;
    P.pregateste({intrare: dateGata(), iend: false, plafon: Infinity, pastreaza: PASTREAZA_IESIRE});
    if (P.merge(0).stare === 'oprit') { const e = P.merge(0).oprire; arataOprire(e); bifeazaTarziu(); return; }
    st.mod = 'ruleaza';
    const peRuleaza = document.activeElement === B('ruleaza');
    B('ruleaza').hidden = true; if (B('pas')) B('pas').hidden = true; B('stop').hidden = false;
    if (peRuleaza) B('stop').focus({preventScroll: true});
    pornesteCeas();
    out.setAttribute('aria-busy', 'true');
    lucreaza();
  }
  /* ---- pas cu pas ---- */
  function deseneazaVars(laSfarsit) {
    const L = st.P.variabile(laSfarsit), vechi = st.ultima || {};
    const nou = {};
    const fmtv = (ty, x) => {
      if (x === undefined) return null;
      if (ty === 'char') return `'${x >= 32 && x < 127 ? String.fromCharCode(x) : '?'}' (${x})`;
      if (ty === 'bool') return x ? '1 (adevărat)' : '0 (fals)';
      if (ty === 'double' || ty === 'float') return fmtGeneral(x, 6);
      return String(x);
    };
    let h = '<table><thead><tr><th scope="col">Variabila</th><th scope="col">Tipul</th><th scope="col">Valoarea</th></tr></thead><tbody>';
    if (!L.length) h += `<tr><td colspan="3" class="gol">${laSfarsit ? 'Programul nu are variabile.' : 'Nicio variabilă declarată încă.'}</td></tr>`;
    for (const v of L) {
      if (v.tablou) {
        const a = v.valori;
        let cel = '';
        if (a) {
          const i0 = v.indice == null ? 0 : Math.max(0, v.indice - 11), i1 = Math.min(a.length, i0 + 24);
          if (i0 > 0) cel += '<span aria-hidden="true">…</span>';
          for (let i = i0; i < i1; i++) {
            const s = fmtv(v.ty, a[i]), id = v.nume + '[' + i + ']';
            nou[id] = s;
            cel += `<span class="${v.indice === i ? 'ind' : ''}${vechi[id] !== s && id in vechi ? ' nou' : ''}"><small>${i}</small>${s == null ? '–' : escH(s)}</span>`;
          }
          if (i1 < a.length) cel += '<span aria-hidden="true">…</span>';
        }
        h += `<tr><th scope="row">${escH(v.nume)}</th><td>${escH(v.tip)}</td><td><div class="cm-tab">${cel || '–'}</div>${v.indice != null ? `<span class="gol">indicele folosit ultima dată: ${v.indice}</span>` : ''}</td></tr>`;
      } else {
        const s = fmtv(v.ty, v.valoare);
        nou[v.nume] = s;
        h += `<tr><th scope="row">${escH(v.nume)}</th><td>${escH(v.tip)}</td><td class="${vechi[v.nume] !== s && v.nume in vechi ? 'nou' : ''}">${s == null ? '<span class="gol">fără valoare încă</span>' : escH(s)}</td></tr>`;
      }
    }
    vars.innerHTML = h + '</tbody></table>' + (laSfarsit && L.length ? '<p class="cm-nota">Programul s-a terminat; acestea sunt ultimele valori.</p>' : '');
    st.ultima = nou;
    vars.hidden = false;
  }
  function atinge(z) {
    const pasi = teste.filter(t => t.pas).map(t => t.pas);
    if (!pasi.length) return;
    const vs = st.P.stareToate();
    pasi.forEach(p => { if (atinsPas(p, z.linie != null ? z.linie : null, vs, z.stare === 'gata', z.stare === 'oprire' ? z.linie : null)) st.ses[cheiePas(p)] = true; });
  }
  function dupaPas(z) {
    deseneazaConsola();
    out.removeAttribute('aria-busy');
    rIn.hidden = true;
    if (z.stare === 'cere') { deseneazaVars(); notaP.textContent = `Linia ${st.P.linieUrmatoare()}: programul citește de la tastatură. Scrie datele în consolă.`; notaP.hidden = false; cereDate(); return; }
    if (z.stare === 'pas' || z.stare === 'oprire') {
      atinge(z);
      st.marc.pas = z.linie; deseneazaGut(); marcheazaLinie(z.linie);
      deseneazaVars();
      notaP.textContent = z.stare === 'oprire'
        ? `Oprit la punctul de pe linia ${z.linie}. Linia e galbenă: urmează să se facă.`
        : `Linia ${z.linie} e galbenă: urmează să se facă. Tabelul arată valorile de acum.`;
      notaP.hidden = false;
      bifeazaDoarPas();
      return;
    }
    if (z.stare === 'gata') { atinge(z); deseneazaVars(true); arataGata(); incheie('pasFinal'); return; }
    if (z.stare === 'oprit') { deseneazaVars(); arataOprire(z.oprire); incheie('pasFinal'); return; }
  }
  function pornestePas() {
    if (st.mod) return;
    anuleazaVerificarea();
    st.marc.err.clear();
    const P = compileaza(ta.value);
    if (!P.ok) { arataErori(P); bifeaza(); return; }
    golesteConsola();
    st.P = P; st.ultima = null; st.fara = false;
    P.pregateste({intrare: dateGata(), iend: false, plafon: Infinity, pastreaza: PASTREAZA_IESIRE});
    if (P.merge(0).stare === 'oprit') { arataOprire(P.merge(0).oprire); bifeazaTarziu(); return; }
    st.mod = 'pas';
    ta.readOnly = true;
    B('ruleaza').hidden = true; B('pas').hidden = true;
    B('pasul').hidden = false; B('continua').hidden = false; B('stop').hidden = false;
    pornesteCeas();
    lucreaza();
    if (st.mod === 'pas') B('pasul').focus({preventScroll: true});
  }
  function trimite() {
    if (!st.P || !st.mod) return;
    const v = inp.value;
    (st.intrari = st.intrari || []).push({poz: st.P.iesireTotal(), t: v + '\n'});
    st.P.da(v + '\n');
    rIn.hidden = true;
    pornesteCeas();
    lucreaza();
  }
  function faraDate() {
    if (!st.P || !st.mod) return;
    (st.intrari = st.intrari || []).push({poz: st.P.iesireTotal(), t: '(nu mai sunt date; în consola adevărată: Ctrl+Z, apoi Enter)\n'});
    st.P.sfarsitDate();
    rIn.hidden = true;
    pornesteCeas();
    lucreaza();
  }
  function apasa(x) {
    switch (x) {
      case 'ruleaza': ruleazaProgram(); break;
      case 'pas': pornestePas(); break;
      case 'pasul': if (st.mod === 'pas' && rIn.hidden) { st.fara = false; pauzaP.hidden = true; B('inca').hidden = true; pornesteCeas(); lucreaza(); if (st.mod === 'pas' && rIn.hidden) B('pasul').focus({preventScroll: true}); } break;
      case 'continua': if (st.mod === 'pas' && rIn.hidden) { st.fara = true; pauzaP.hidden = true; B('inca').hidden = true; pornesteCeas(); lucreaza(); } break;
      case 'inca': lasaSaContinue(); break;
      case 'stop': stergeInterval(); adauga('r', `\nAi oprit programul.${notaDiacritice()}`); incheie(); break;
      case 'trimite': trimite(); break;
      case 'eof': faraDate(); break;
      case 'capat':
        stergeInterval();
        if (st.mod) incheie();
        anuleazaVerificarea();
        st.opriri.clear(); st.marc.err.clear(); st.ses = {}; st.P = null; st.ultima = null; st.verificat = false;
        rad.classList.remove('verif');
        rad.querySelectorAll('.cm-teste li').forEach(li => li.classList.remove('ok', 'no'));
        stergeCiorna(k);
        puneText(start);
        stergeCiorna(k);
        date.value = Q.intrare || '';
        golesteConsola();
        vars.hidden = true;
        deseneazaGut();
        if (!atingere() && !Q.doarCitire) ta.focus({preventScroll: true});
        break;
    }
  }
  body.querySelector('.cm-unelte').addEventListener('click', ev => { const b = ev.target.closest('button[data-x]'); if (b) apasa(b.dataset.x); });
  rIn.addEventListener('click', ev => { const b = ev.target.closest('button[data-x]'); if (b) apasa(b.dataset.x); });
  inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); trimite(); } });
  function puneText(s) {
    if (Q.doarCitire) { ta.value = s; deseneazaGut(); return; }
    const ro = ta.readOnly; ta.readOnly = false;
    ta.focus({preventScroll: true});
    ta.select();
    let ok = false;
    try { ok = document.execCommand('insertText', false, s); } catch (e) { ok = false; }
    if (!ok || ta.value !== s) { ta.value = s; ta.dispatchEvent(new Event('input', {bubbles: true})); }
    ta.readOnly = ro;
    if (atingere()) ta.blur();
    deseneazaGut();
  }
  /* ---- testele ---- */
  function cacheAcum() {
    const src = ta.value;
    if (st.cache.src !== src) st.cache = {src, rulari: new Map(), P0: null};
    if (!st.cache.P0) st.cache.P0 = compileaza(src);
    return st.cache;
  }
  function rezultatTest(i, peFelii) {
    const c = cacheAcum();
    try { return judecaTest(teste[i], c.src, st.ses, c.P0, c.rulari, peFelii); } catch (e) { return {ok: false, m: 'Testul nu s-a putut face.'}; }
  }
  /* D3: primul test oprit de plafon le oprește pe celelalte care rulează programul; ele rămân nebifate și mesajul spune asta */
  const nerulat = () => ({ok: false, nerulat: true});
  function puneBife(r) {
    st.verificat = true;
    rad.classList.add('verif');
    rad.querySelectorAll('.cm-teste li').forEach(li => { const x = r[+li.dataset.t]; if (!x) return; li.classList.toggle('ok', x.ok); li.classList.toggle('no', !x.ok && !x.nerulat); });
  }
  /* dintr-o bucată: „rezolvă” și „greșit” din poarta motorului, „Arată-mi răspunsul”, programele care nu se compilează (nu rulează nimic) */
  function bifeaza() {
    anuleazaVerificarea();
    if (!teste.length) return [];
    let oprit = false;
    const r = teste.map((t, i) => { if (oprit && faceRulari(t)) return nerulat(); const x = rezultatTest(i); if (x.plafon) oprit = true; return x; });
    puneBife(r);
    return r;
  }
  function anuleazaVerificarea() {
    if (st.verif) { st.verif.anulat = true; st.verif = null; }
    st.tBif = null;
    st.fFelie = null;
    if (stareP.dataset.verif) { stareP.hidden = true; delete stareP.dataset.verif; }
  }
  /* testele pe felii: pagina respiră între felii, deci „Verifică” nu ține pagina, iar plafonul e pe ceas (PLAFON_VERIFICA_MS, pe toată verificarea).
     Plafonul de pași rămâne: pe un calculator rapid, un program fără sfârșit se oprește mai repede, la fel de fiecare dată. */
  function verificaPeFelii(gata, cuMesaj) {
    anuleazaVerificarea();
    if (!teste.length) { if (gata) gata([]); return; }
    const c = cacheAcum(), v = {anulat: false}, r = [], t0 = acum(), P0 = c.P0;
    st.verif = v; st.tBif = true;   /* tBif: testele sunt încă pe drum (îl citesc și probele) */
    if (cuMesaj) { stareP.textContent = 'Verific programul…'; stareP.hidden = false; stareP.dataset.verif = '1'; }
    let i = 0, oprit = false;
    const incheie2 = () => {
      st.verif = null; st.tBif = null;
      if (stareP.dataset.verif) { stareP.hidden = true; delete stareP.dataset.verif; }
      if (!rad.isConnected) return;
      puneBife(r);
      if (gata) gata(r);
    };
    const urm = () => {
      if (v.anulat) return;
      while (i < teste.length) {
        if (oprit && faceRulari(teste[i])) { r[i++] = nerulat(); continue; }
        const x = rezultatTest(i, P0.ok);
        if (x.lipsa !== undefined) { porneste(x.lipsa); return; }
        r[i++] = x;
        if (x.plafon) oprit = true;
      }
      incheie2();
    };
    const porneste = intrare => {
      P0.pregateste({intrare, plafon: PLAFON_TEST, limIesire: LIM_IESIRE_TEST});
      const felieT = () => {
        if (v.anulat) return;
        const t1 = acum();
        let z;
        do { z = P0.merge(felie); } while (z.stare === 'felie' && acum() - t1 < FELIE_MS);
        if (z.stare === 'felie') {
          if (acum() - t0 < PLAFON_VERIFICA_MS) { laFelie(felieT); return; }
          /* n-a terminat în timp: rezultatul nu se ține minte, la altă apăsare se încearcă din nou */
          r[i++] = {ok: false, plafon: true, timp: true, m: mesajPlafon(cuDateTest(intrare), `${String(PLAFON_VERIFICA_MS / 1000).replace('.', ',')} s`)};
          oprit = true;
          laFelie(urm);
          return;
        }
        const o = {compilat: true, erori: [], refuz: null, octeti: P0.iesire(), iesire: '', cod: null, oprire: null, pasi: P0.pasi(), stare: null};
        o.iesire = dinOcteti(o.octeti);
        if (z.stare === 'oprit') o.oprire = {tip: z.oprire.tip, mesaj: z.oprire.mesaj, linie: z.oprire.linie == null ? null : z.oprire.linie};
        else o.cod = P0.cod();
        o.stare = P0.stare();
        c.rulari.set(intrare, o);
        laFelie(urm);
      };
      laFelie(felieT);
    };
    urm();
  }
  /* după „Oprește” sau la sfârșitul rulării */
  function bifeazaTarziu() { verificaPeFelii(null, false); }
  /* la fiecare pas: numai testele de pas, care nu rulează programul */
  function bifeazaDoarPas() {
    if (!teste.some(t => t.pas)) return;
    const r = [];
    teste.forEach((t, i) => { if (t.pas) r[i] = rezultatTest(i); });
    puneBife(r);
  }
  body._cm = {Q, st, ta, bifeaza, puneText, apasa, date};
  deseneazaGut();
  lipesteBara();
  if (api && teste.length) {
    const apasaVerifica = () => {
      if (st.mod) apasa('stop');
      if (st.verif && st.verif.deLaButon) return;     /* a doua atingere pe „Verifică”, cât merge prima */
      const src = ta.value;
      verificaPeFelii(r => {
        if (ta.value !== src) { st.verif = null; apasaVerifica(); return; }   /* a schimbat programul între timp */
        const i0 = r.findIndex(x => !x.ok);
        if (i0 < 0) { api.resolve(true); return; }
        const bune = r.filter(x => x.ok).length, nr = r.filter(x => x.nerulat).length;
        api.resolve(false, `${bune} din ${r.length} teste trec. Testul care nu trece încă: <b>${escH(teste[i0].ce)}</b>. ${r[i0].m || ''}${nr ? ` ${nr === 1 ? 'Încă un test nu s-a mai rulat' : `Încă ${nr} teste nu s-au mai rulat`}: programul trebuie întâi să se termine.` : ''}`);
        if (!atingere() && !Q.doarCitire) ta.focus({preventScroll: true});
        if (Q.rezolvare != null) api.revealButton(() => {
          puneText(Q.rezolvare);
          st.ses = atingeTotPas(Q.rezolvare, Q.intrareRezolvare != null ? Q.intrareRezolvare : Q.intrare, teste);
          bifeaza();
          if (api.nav()) api.nav().innerHTML = '';
          api.giveUp(Q.solutieText || 'în editor e acum un program care trece testele. Citește-l și rulează-l.');
        });
      }, true);
      if (st.verif) st.verif.deLaButon = true;
    };
    api.checkButton(apasaVerifica);
  }
  return body._cm;
}
const TIP_CPP = {
  render(Q, body, api) { monteaza(body, Q, api); },
  rezolva(Q, body) {
    const d = body._cm; if (!d || Q.rezolvare == null) return false;
    d.puneText(Q.rezolvare);
    d.st.ses = atingeTotPas(Q.rezolvare, Q.intrareRezolvare != null ? Q.intrareRezolvare : Q.intrare, Q.teste || []);
    d.bifeaza();
    return true;
  },
  gresit(Q, body) {
    const d = body._cm; if (!d || Q.gresit == null) return false;
    d.puneText(Q.gresit);
    d.bifeaza();
    return true;
  }
};
const CppMic = {versiune: VERSIUNE, compileaza, ruleaza, fmtGeneral, fmtFixed, dinOcteti, utf8, judecaTest, monteaza, tip: TIP_CPP, tipuri: {'cpp-mic': TIP_CPP}};
root.CppMic = CppMic;
if (typeof module !== 'undefined' && module.exports) module.exports = CppMic;
})(typeof window !== 'undefined' ? window : globalThis);
