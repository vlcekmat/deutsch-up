/* Deutsch Up – explains mistakes. Pure functions, no DOM.
   DU_DIAG.word(given, expected, item)        -> [notes]      single-word / short answers
   DU_DIAG.sentence(given, answers, item)     -> { ok, typo, best, marks, notes, tips }
   DU_DIAG.charDiff(given, expected)          -> [{ t, s: 'same' | 'del' | 'ins' }]
   DU_DIAG.norm(s)                            -> comparison form (case, ß, umlaut spelling, punctuation) */
(function () {
  'use strict';

  function norm(s) {
    return String(s == null ? '' : s).trim().toLowerCase()
      .replace(/ß/g, 'ss').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue')
      .replace(/[„“"»«]/g, '').replace(/\s+/g, ' ').replace(/[.,;:!?]+$/, '');
  }
  function bare(s) { // umlauts dropped entirely: Bahnhofe == Bahnhöfe
    return String(s).toLowerCase().replace(/ß/g, 'ss').replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u');
  }
  function lev(a, b) {
    if (a === b) return 0;
    var m = a.length, n = b.length, prev = [], cur = [], i, j;
    for (j = 0; j <= n; j++) prev[j] = j;
    for (i = 1; i <= m; i++) {
      cur = [i];
      for (j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  }
  function q(s) { return '„' + s + '“'; }

  /* ---------- determiners ---------- */
  var EIN_STEMS = ['ein', 'kein', 'mein', 'dein', 'sein', 'ihr', 'unser', 'euer', 'eur'];
  var DER_STEMS = ['dies', 'jed', 'welch', 'jen', 'manch'];
  var EIN_END = { '': ['1. pád m.', '1./4. pád stř.'], e: ['1./4. pád ž.', '1./4. pád mn. č. (keine, meine …)'], en: ['4. pád m.', '3. pád mn. č.'], em: ['3. pád m./stř.'], er: ['2./3. pád ž.', '2. pád mn. č.'], es: ['2. pád m./stř.'] };
  var DER_END = { er: ['1. pád m.', '2./3. pád ž.', '2. pád mn. č.'], e: ['1./4. pád ž.', '1./4. pád mn. č.'], es: ['1./4. pád stř.', '2. pád m./stř.'], en: ['4. pád m.', '3. pád mn. č.'], em: ['3. pád m./stř.'] };
  var ART = {
    der: ['1. pád m.', '2./3. pád ž.', '2. pád mn. č.'], die: ['1./4. pád ž.', '1./4. pád mn. č.'], das: ['1./4. pád stř.'],
    den: ['4. pád m.', '3. pád mn. č.'], dem: ['3. pád m./stř.'], des: ['2. pád m./stř.'],
    denen: ['vztažné zájmeno 3. pád mn. č.'], dessen: ['vztažné zájmeno 2. pád m./stř.'], deren: ['vztažné zájmeno 2. pád ž./mn. č.']
  };
  function detInfo(w) {
    w = String(w).toLowerCase();
    if (ART[w]) return ART[w];
    var i, s;
    for (i = 0; i < EIN_STEMS.length; i++) {
      s = EIN_STEMS[i];
      if (w.indexOf(s) === 0 && EIN_END[w.slice(s.length)]) return EIN_END[w.slice(s.length)];
    }
    for (i = 0; i < DER_STEMS.length; i++) {
      s = DER_STEMS[i];
      if (w.indexOf(s) === 0 && DER_END[w.slice(s.length)]) return DER_END[w.slice(s.length)];
    }
    return null;
  }

  /* ---------- prepositions ---------- */
  var PREP = {
    an: 'na, u, k (+ 3./4. pád)', auf: 'na (+ 3./4. pád)', aus: 'z (+ 3. pád)', bei: 'u, při (+ 3. pád)', durch: 'skrz (+ 4. pád)',
    'für': 'pro, za (+ 4. pád)', gegen: 'proti (+ 4. pád)', in: 'v, do (+ 3./4. pád)', mit: 's (+ 3. pád)', nach: 'po, do, podle (+ 3. pád)',
    ohne: 'bez (+ 4. pád)', seit: 'od (doby) (+ 3. pád)', 'über': 'o, přes, nad (+ 3./4. pád)', um: 'o, kolem, v (+ 4. pád)', unter: 'pod, mezi (+ 3./4. pád)',
    von: 'od, z, o (+ 3. pád)', vor: 'před (+ 3./4. pád)', zu: 'k, na (+ 3. pád)', zwischen: 'mezi', neben: 'vedle', hinter: 'za',
    wegen: 'kvůli (+ 2. pád)', trotz: 'navzdory (+ 2. pád)', 'während': 'během (+ 2. pád)', statt: 'místo (+ 2. pád)', 'gegenüber': 'naproti (+ 3. pád)',
    'außer': 'kromě (+ 3. pád)', bis: 'do', ab: 'od'
  };
  var CONTR = { zum: 'zu dem (m./stř.)', zur: 'zu der (ž.)', im: 'in dem – kde? (3. pád)', ins: 'in das – kam? (4. pád)', am: 'an dem – kde? (3. pád)', ans: 'an das – kam? (4. pád)', vom: 'von dem', beim: 'bei dem', aufs: 'auf das' };

  /* ---------- noun gender hints ---------- */
  function genderHint(noun) {
    var n = String(noun).toLowerCase();
    var rules = [
      [/(ung|heit|keit|schaft|ion|tät|ik|ei|enz|anz|ur)$/, 'die', 'slova na -ung, -heit, -keit, -schaft, -ion, -tät, -ei, -ik jsou ženského rodu'],
      [/(chen|lein)$/, 'das', 'zdrobněliny na -chen a -lein jsou vždy středního rodu'],
      [/(ment|um|tum)$/, 'das', 'slova na -ment a -um bývají středního rodu'],
      [/(ling|ismus|or|ant|ent|ist)$/, 'der', 'slova na -ling, -ismus, -or, -ant, -ent, -ist jsou mužského rodu'],
      [/^ge.+e$/, 'das', 'slova Ge-…-e bývají středního rodu (das Gebäude, das Gemüse)']
    ];
    for (var i = 0; i < rules.length; i++) if (rules[i][0].test(n)) return { art: rules[i][1], text: rules[i][2] };
    return null;
  }
  var GENDER = { der: 'mužský', die: 'ženský', das: 'střední' };

  /* ---------- plural hints ---------- */
  function pluralNote(sg, exp, given, art) {
    var e = exp.toLowerCase(), g = given.toLowerCase(), s = (sg || '').toLowerCase();
    if (bare(e) === bare(g)) return 'V množném čísle tu přibývá přehláska: ' + sg + ' → ' + exp + '.';
    if (s && e === s && g !== e) return 'Podstatná jména mužského a středního rodu na -er, -el, -en mají v množném čísle stejný tvar (der Drucker → die Drucker, das Fenster → die Fenster).';
    if (/innen$/.test(e)) return 'Ženské tvary na -in mají v množném čísle -innen (die Kollegin → die Kolleginnen).';
    if (/s$/.test(e) && !/s$/.test(s)) return 'Cizí slova (hlavně na -o, -a, -i, -y) a zkratky mají množné číslo -s (das Büro → die Büros, das Handy → die Handys).';
    if (art === 'die' && /n$/.test(e) && !/n$/.test(g)) return 'Chybí -n: ženská podstatná jména mají v množném čísle skoro vždy -(e)n (die Universität → die Universitäten, die Lampe → die Lampen).';
    if (/er$/.test(e) && !/er$/.test(g)) return 'Tohle slovo má množné číslo -er (často s přehláskou): das Kind → die Kinder, das Haus → die Häuser.';
    if (/e$/.test(e) && !/e$/.test(g)) return 'Tohle slovo má množné číslo -e (u mužského rodu často s přehláskou): der Tisch → die Tische, der Zug → die Züge.';
    return 'Množné číslo se nedá spolehlivě odvodit – uč se ho vždy spolu se slovem a členem.';
  }

  /* ---------- verbs ---------- */
  function verbNotes(g, e, it) {
    var notes = [];
    var hint = String(it && (it.hint || it.tag) || '');
    var forms = (hint.match(/([a-zäöüß]+) – ([a-zäöüß ]+) – ([a-zäöüß]+)/) || []);
    var formTxt = forms[0] ? ' (' + forms[0] + ')' : '';
    // weak Präteritum on a strong verb: fängte, gingte
    if (/(te|ten|test|tet)$/.test(g) && !/(te|ten|test|tet)$/.test(e) && !/^ge/.test(e)) {
      notes.push('Tvar na -te je slabý (pravidelný). Tohle sloveso je silné: v Präteritu mění kmenovou samohlásku a -te nepřidává' + formTxt + '.');
    }
    // strong participle with -t: getrinkt
    if (/^ge/.test(e) && /en$/.test(e) && /t$/.test(g) && /^ge/.test(g)) {
      notes.push('Silná slovesa mají příčestí na -en, často se změnou samohlásky: ' + e + formTxt + '.');
    }
    // strong participle without -en: getrank, gegang
    if (/^ge/.test(e) && /en$/.test(e) && /^ge/.test(g) && !/en$/.test(g) && !/t$/.test(g) && g + 'en' !== e && g + 'n' !== e) {
      notes.push('Silná slovesa mají příčestí na -en a často mění kmenovou samohlásku: ' + e + formTxt + '.');
    }
    // Konjunktiv form where a past form is needed: könnten -> kannten
    if (/^(könnt|hätt|wär|würd|müsst|dürft|wüsst)/.test(g) && !/[äöü]/.test(e)) {
      notes.push('Tvar s přehláskou (' + g + ') je Konjunktiv II („by“). Tady je potřeba obyčejný minulý čas: ' + e + formTxt + '.');
    }
    // weak participle written with -en
    if (/t$/.test(e) && /en$/.test(g) && (/^ge/.test(e) || /iert$/.test(e))) {
      notes.push('Tohle sloveso je slabé: příčestí končí na -t (' + e + ').');
    }
    // missing -en: gelauf
    if (/en$/.test(e) && (g + 'en' === e || g + 'n' === e)) notes.push('Chybí koncovka ' + (g + 'en' === e ? '-en' : '-n') + '.');
    // ge- where none belongs: gebesucht, geoperiert
    if (g === 'ge' + e) notes.push('Bez ge-: slovesa s nedělitelnou předponou (be-, ver-, er-, ent-, emp-, ge-, zer-, miss-) a slovesa na -ieren tvoří příčestí bez ge- (besucht, verstanden, telefoniert).');
    // separable: geanruft / angeruft vs angerufen
    var sep = e.match(/^(ab|an|auf|aus|bei|ein|mit|nach|vor|weg|zu|zurück|fern|los|her|hin|um|teil)(ge|zu)(.+)$/);
    if (sep && g.indexOf('ge' + sep[1]) === 0) notes.push('U odlučitelných sloves jde ' + sep[2] + ' mezi předponu a základ: ' + sep[1] + '-' + sep[2] + '-' + sep[3] + '.');
    if (sep && sep[2] === 'zu' && g === 'zu ' + sep[1] + sep[3]) notes.push('U odlučitelných sloves se zu píše dovnitř slova: ' + sep[1] + '-zu-' + sep[3] + '.');
    // Konjunktiv II umlaut: hatte/hätte, war/wäre, konnte/könnte, wurde/würde
    if (bare(g) === bare(e) && g !== e && /(ä|ö|ü)/.test(e)) {
      if (/^(hätt|wär|könnt|würd|müsst|dürft|wüsst)/.test(e)) notes.push('Bez přehlásky je to minulý čas (' + g + ' = Präteritum). Konjunktiv II („by“) má přehlásku: ' + e + '.');
    }
    if (/^(wurde|wurden|wurdest)$/.test(g) && /^würd/.test(e)) notes.push('wurde = byl/stal se (minulost, pasivum). würde = by (Konjunktiv II).');
    if (/^würd/.test(g) && /^wurd/.test(e)) notes.push('würde = by (Konjunktiv II). Tady je minulý čas (pasivum v minulosti): wurde.');
    if (g === 'geworden' && e === 'worden') notes.push('V pasivu (Perfekt) je worden bez ge-. geworden znamená „stal se“.');
    if (g === 'worden' && e === 'geworden') notes.push('„Stát se“ má příčestí geworden. worden je jen v pasivu (ist gemacht worden).');
    // person ending: ich -e, du -st …
    var st = Math.min(g.length, e.length) - 3;
    if (!notes.length && st >= 2 && g.slice(0, st) === e.slice(0, st) && /(e|st|t|en|et)$/.test(g) && /(e|st|t|en|et)$/.test(e) && /^[a-zäöüß]+$/.test(g + e) && !detInfo(e)) {
      notes.push('Kmen sedí, liší se koncovka osoby: ich -e, du -(e)st, er/sie/es -(e)t, wir/sie/Sie -en, ihr -(e)t.');
    }
    return notes;
  }

  /* ---------- adjectives ---------- */
  var ADJ_END = /(e|en|er|es|em)$/;
  function adjNote(g, e, it) {
    var ge = g.match(ADJ_END), ee = e.match(ADJ_END);
    var gs = ge ? g.slice(0, -ge[1].length) : g, es = ee ? e.slice(0, -ee[1].length) : e;
    if (!ee || es.length < 2) return null;
    if (gs !== es && g !== es) return null;
    var tag = String(it && it.tag || '');
    var head = gs === es
      ? 'Kmen ' + q(es + '-') + ' je správně, jen koncovka ne: napsal jsi ' + (ge ? '-' + ge[1] : 'bez koncovky') + ', správně je -' + ee[1] + '.'
      : 'Chybí koncovka: před podstatným jménem má přídavné jméno vždy koncovku (-' + ee[1] + ').';
    var rule = '';
    if (/určitý člen|po určitém|adj-def/.test(tag)) rule = 'Po určitém členu (der, die, das, dieser …) jsou jen dvě koncovky: -e v 1. pádě j. č. a ve 4. pádě ž./stř. rodu, všude jinde -en.';
    else if (/ein-|kein/.test(tag)) rule = 'Po ein/kein/mein: kde člen nemá koncovku (ein, kein, mein), převezme ji přídavné jméno – ein kleiner Tisch (m.), ein kleines Haus (stř.). Jinde je to jako po určitém členu.';
    else if (/bez členu/.test(tag)) rule = 'Bez členu nese koncovku přídavné jméno samo – tu, kterou by měl člen: dem → -em (mit kaltem Wasser), der → -er, das → -es. Výjimka: 2. pád m./stř. má -en.';
    else if (/Stupňování|Komparativ/.test(tag)) rule = 'I 2. a 3. stupeň dostává před podstatným jménem normální koncovku: ein größeres Auto, das schnellste Auto.';
    if (/mn\. č\./.test(tag) && /určitý|ein-|kein/.test(tag)) rule += ' V množném čísle je po členu vždy -en.';
    return head + (rule ? ' ' + rule : '');
  }

  /* ---------- main: one word / short phrase ---------- */
  function word(givenRaw, expectedRaw, it) {
    var notes = [];
    var given = String(givenRaw || '').trim(), expected = String(expectedRaw || '').trim();
    if (!given) return notes;
    var g = given.toLowerCase(), e = expected.toLowerCase();
    if (norm(g) === norm(e)) return notes;

    // curated trap for this item
    var traps = it && it.traps;
    if (traps) {
      for (var k in traps) if (norm(k) === norm(g) && traps[k]) { notes.push(traps[k]); return notes; }
    }

    // umlaut only
    if (bare(g) === bare(e)) {
      var vn = verbNotes(g, e, it);
      if (vn.length) return vn;
      notes.push(/[äöü]/.test(e) ? 'Chybí přehláska: ' + q(expected) + '. Přehláska mění výslovnost i význam (schon × schön, Bruder × Brüder). Na mobilu podrž a / o / u a vyber ä / ö / ü.'
        : 'Tady přehláska není: ' + q(expected) + '.');
      return notes;
    }

    var gw = g.split(/\s+/), ew = e.split(/\s+/);

    // article + noun (vocabulary): der Paket -> das Paket
    if (ew.length === 2 && GENDER[ew[0]]) {
      var noun = ew[1];
      if (gw.length === 2 && GENDER[gw[0]] && norm(gw[1]) === norm(noun)) {
        notes.push('Slovo máš správně, jen člen ne: ' + expected.split(' ')[1] + ' je ' + GENDER[ew[0]] + ' rod → ' + ew[0] + '.');
        var gh = genderHint(noun); if (gh && gh.art === ew[0]) notes.push('Pomůcka: ' + gh.text + '.');
        return notes;
      }
      if (gw.length === 1 && norm(gw[0]) === norm(noun)) {
        notes.push('Chybí člen. Podstatné jméno se učí vždy se členem: ' + expected + ' (' + GENDER[ew[0]] + ' rod).');
        return notes;
      }
      if (gw.length === 2 && gw[0] === ew[0] && lev(norm(gw[1]), norm(noun)) <= 2) {
        notes.push('Člen sedí, slovo má překlep: ' + q(given.split(/\s+/)[1]) + ' → ' + q(expected.split(' ')[1]) + '.');
        return notes;
      }
    }

    // plural form
    if (it && (it.plural || /množné číslo/.test(String(it.prompt || '')))) {
      var m = String(it.prompt || '').match(/^(der|die|das) (\S+) →/);
      notes.push(pluralNote(m ? m[2] : '', expected, given, m ? m[1] : ''));
      return notes;
    }

    // contracted prepositions
    if (CONTR[g] && CONTR[e]) { notes.push(q(given) + ' = ' + CONTR[g] + ', ' + q(expected) + ' = ' + CONTR[e] + '.'); return notes; }

    // determiners: den vs dem
    var gi = detInfo(g), ei = detInfo(e);
    if (gi && ei) {
      notes.push(q(given) + ' je ' + gi.join(' nebo ') + '. Tady je potřeba ' + q(expected) + ' = ' + ei.join(' nebo ') + '.');
      notes[notes.length - 1] = notes[notes.length - 1].replace(/\.\./g, '.');
      if (it && it.hint) notes.push('Nápověda k větě: ' + it.hint + '.');
      return notes;
    }

    // prepositions
    if (PREP[g] && (PREP[e] || CONTR[e])) {
      notes.push(q(given) + ' znamená ' + PREP[g].replace(/ \(\+.*\)$/, '') + '.');
      if (/vazb|Slovesa s předložkou/i.test(String(it && it.tag || ''))) notes.push('U sloves s předložkou rozhoduje sloveso, ne čeština: vazbu se uč celou – sloveso + předložka + pád' + (it.hint ? ' (' + it.hint + ')' : '') + '.');
      else if (PREP[e]) notes.push(q(expected) + ' = ' + PREP[e] + '.');
      return notes;
    }

    // dass / das
    if (g === 'das' && e === 'dass') { notes.push('Spojka „že“ se píše dass (dvě s). das je člen nebo zájmeno („to“, „který“).'); return notes; }
    if (g === 'dass' && e === 'das') { notes.push('Tady nejde o spojku „že“, ale o člen / vztažné zájmeno das (jedno s).'); return notes; }

    var verbish = /^ge/.test(e) || /Präteritum|Perfekt|Partizip|sloves|Konjunktiv|Pasivum|werden/i.test(String(it && it.tag || '') + ' ' + String(it && it.hint || ''));
    if (verbish) { var v1 = verbNotes(g, e, it); if (v1.length) return v1; }

    // adjectives
    var an = adjNote(g, e, it);
    if (an && gw.length === 1) { notes.push(an); return notes; }

    // verbs
    var vns = verbNotes(g, e, it);
    if (vns.length) return vns;

    // reflexive / personal pronouns
    var PRON = { mich: '4. pád (mě)', mir: '3. pád (mi)', dich: '4. pád (tě)', dir: '3. pád (ti)', ihn: '4. pád (jeho, ho)', ihm: '3. pád (jemu, mu)', sie: '4. pád (ji / je)', ihr: '3. pád (jí)', ihnen: '3. pád (jim / Vám)', uns: '3./4. pád (nám / nás)', euch: '3./4. pád (vám / vás)', sich: '3./4. pád (se / si)' };
    if (PRON[g] && PRON[e]) { notes.push(q(given) + ' je ' + PRON[g] + ', ' + q(expected) + ' je ' + PRON[e] + '. Rozhoduje sloveso a to, jestli je ve větě ještě jiný předmět ve 4. pádě.'); return notes; }

    // word order of two verbs: möchte arbeiten vs arbeiten möchte
    if (gw.length > 1 && gw.slice().sort().join(' ') === ew.slice().sort().join(' ')) {
      notes.push('Slova máš správně, jen v jiném pořadí. Ve vedlejší větě stojí časované sloveso úplně na konci: ' + expected + '.');
      return notes;
    }

    // spelling
    var d = lev(norm(g), norm(e));
    if (d > 0 && ((d === 1 && e.length >= 4) || (d === 2 && e.length >= 8))) {
      notes.push('Skoro! Je to jen ' + (d === 1 ? 'jedno písmeno' : 'pár písmen') + ' – zkontroluj pravopis.');
      return notes;
    }
    return notes;
  }

  /* ---------- sentences ---------- */
  var SUB = ['weil', 'dass', 'ob', 'wenn', 'als', 'obwohl', 'damit', 'bevor', 'nachdem', 'während', 'bis', 'seit', 'seitdem', 'sobald', 'falls', 'da', 'sodass', 'wo', 'wann', 'wie', 'warum', 'was', 'wer', 'wen', 'wem', 'wohin', 'woher', 'worauf', 'wofür', 'worüber', 'woran', 'womit',
    'der', 'die', 'das', 'den', 'dem', 'denen', 'dessen', 'deren'];
  function tokens(s) {
    var raw = String(s).replace(/[„“"»«]/g, '').split(/\s+/).filter(Boolean);
    return raw.map(function (t) { return { raw: t, w: t.replace(/[.,;:!?]+$/, ''), comma: /,$/.test(t) }; }).filter(function (t) { return t.w; });
  }
  function nt(t) { return norm(t.w); }

  // token-level alignment (Levenshtein with backtrace); similar tokens substitute cheaply
  function align(gt, et) {
    var m = gt.length, n = et.length, D = [], i, j;
    for (i = 0; i <= m; i++) { D[i] = []; for (j = 0; j <= n; j++) D[i][j] = 0; }
    for (i = 0; i <= m; i++) D[i][0] = i;
    for (j = 0; j <= n; j++) D[0][j] = j;
    function sub(a, b) { var x = nt(a), y = nt(b); if (x === y) return 0; var d = lev(x, y); return d <= Math.max(2, Math.floor(y.length / 3)) ? 0.8 : 2.1; }
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++) D[i][j] = Math.min(D[i - 1][j] + 1, D[i][j - 1] + 1, D[i - 1][j - 1] + sub(gt[i - 1], et[j - 1]));
    var ops = []; i = m; j = n;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && Math.abs(D[i][j] - (D[i - 1][j - 1] + sub(gt[i - 1], et[j - 1]))) < 1e-9) {
        ops.unshift({ op: nt(gt[i - 1]) === nt(et[j - 1]) ? 'ok' : 'sub', g: gt[i - 1], e: et[j - 1], ei: j - 1 }); i--; j--;
      } else if (i > 0 && Math.abs(D[i][j] - (D[i - 1][j] + 1)) < 1e-9) { ops.unshift({ op: 'extra', g: gt[i - 1] }); i--; }
      else { ops.unshift({ op: 'miss', e: et[j - 1], ei: j - 1 }); j--; }
    }
    return { cost: D[m][n], ops: ops };
  }

  function clauses(et) {
    // [{start, end, sub: bool}] boundaries at commas
    var out = [], s = 0;
    et.forEach(function (t, i) {
      if (t.comma || i === et.length - 1) {
        out.push({ start: s, end: i, sub: SUB.indexOf(nt(et[s])) >= 0 && (s > 0 || /^(weil|dass|ob|wenn|als|obwohl|damit|bevor|nachdem|während|seit|seitdem|sobald|falls)$/.test(nt(et[s]))) });
        s = i + 1;
      }
    });
    return out;
  }
  function placeNote(et, ei) {
    var cl = clauses(et), c = null, k;
    for (k = 0; k < cl.length; k++) if (ei >= cl[k].start && ei <= cl[k].end) { c = cl[k]; break; }
    var w = q(et[ei].w);
    if (c && c.sub && ei === c.end) return w + ' patří na konec vedlejší věty – po ' + q(et[c.start].w) + ' stojí časované sloveso na konci.';
    if (c && !c.sub && ei === c.start && k > 0 && cl[k - 1].sub) return w + ' patří hned za čárku: když věta začíná vedlejší větou, hlavní věta pokračuje slovesem.';
    if (c && !c.sub && ei === c.start + 1) return w + ' patří na 2. místo – v oznamovací větě stojí časované sloveso vždy na 2. místě (i po časovém údaji: Heute gehe ich …).';
    if (c && !c.sub && ei === c.end && c.end - c.start >= 3) return w + ' patří na konec věty – infinitiv, příčestí nebo odlučitelná předpona uzavírá větný rámec.';
    if (ei > 0) return w + ' patří za ' + q(et[ei - 1].w) + '.';
    return w + ' patří na začátek.';
  }

  var PRIO = [/konec vedlejší/, /hned za čárku/, /2\. místo/, /konec věty/];
  function singleMove(gt, et) {
    // the given tokens are a permutation of the expected ones: which single token, moved, fixes the sentence?
    var exp = et.map(nt).join(' '), best = null;
    for (var i = 0; i < gt.length; i++) {
      var rest = gt.slice(0, i).concat(gt.slice(i + 1));
      for (var j = 0; j <= rest.length; j++) {
        var cand = rest.slice(0, j).concat([gt[i]]).concat(rest.slice(j));
        if (cand.map(nt).join(' ') !== exp || j === i) continue;
        var note = placeNote(et, j), p = PRIO.length;
        for (var k = 0; k < PRIO.length; k++) if (PRIO[k].test(note)) { p = k; break; }
        if (!best || p < best.p) best = { i: i, j: j, note: note, p: p };
      }
    }
    return best;
  }

  // tokens of the expected sentence that are out of place (not in a longest common subsequence)
  function lcsMoved(gt, et, preferSkipGiven) {
    var m = gt.length, n = et.length, L = [], i, j;
    for (i = 0; i <= m; i++) { L[i] = []; for (j = 0; j <= n; j++) L[i][j] = 0; }
    for (i = m - 1; i >= 0; i--) for (j = n - 1; j >= 0; j--) L[i][j] = nt(gt[i]) === nt(et[j]) ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    var keptE = {}, keptG = {}; i = 0; j = 0;
    while (i < m && j < n) {
      if (nt(gt[i]) === nt(et[j]) && L[i][j] === L[i + 1][j + 1] + 1) { keptE[j] = 1; keptG[i] = 1; i++; j++; }
      else if (preferSkipGiven ? L[i + 1][j] >= L[i][j + 1] : L[i + 1][j] > L[i][j + 1]) i++;
      else j++;
    }
    var ei = [], gi = [];
    for (j = 0; j < n; j++) if (!keptE[j]) ei.push(j);
    for (i = 0; i < m; i++) if (!keptG[i]) gi.push(i);
    return { ei: ei, gi: gi };
  }
  function prio(note) { for (var k = 0; k < PRIO.length; k++) if (PRIO[k].test(note)) return k; return PRIO.length; }

  function sentence(givenRaw, answers, it) {
    var gt = tokens(givenRaw);
    var best = null;
    [].concat(answers).forEach(function (a) {
      var et = tokens(a);
      var al = align(gt, et);
      if (!best || al.cost < best.al.cost) best = { a: a, et: et, al: al };
    });
    var res = { ok: false, typo: false, best: best.a, marks: [], notes: [], tips: [] };
    var et = best.et, ops = best.al.ops;
    if (best.al.cost === 0) res.ok = true;

    // moves: same token missing in one place and extra in another
    var extras = ops.filter(function (o) { return o.op === 'extra'; });
    var misses = ops.filter(function (o) { return o.op === 'miss'; });
    misses.forEach(function (mo) {
      var ex = extras.filter(function (x) { return !x.moved && nt(x.g) === nt(mo.e); })[0];
      if (ex) { ex.moved = true; mo.moved = true; mo.from = ex; }
    });

    var typoOnly = !res.ok;
    ops.forEach(function (o) {
      if (o.op === 'ok') { res.marks.push({ t: o.g.w, s: 'ok' }); return; }
      if (o.op === 'extra') { res.marks.push({ t: o.g.w, s: o.moved ? 'moved' : 'extra' }); if (!o.moved) typoOnly = false; return; }
      if (o.op === 'miss') { res.marks.push({ t: o.e.w, s: o.moved ? 'place' : 'miss' }); typoOnly = false; return; }
      // substitution
      var x = nt(o.g), y = nt(o.e), d = lev(x, y);
      var isTypo = d === 1 && y.length >= 6 && bare(o.g.w) !== bare(o.e.w) && x.slice(-2) === y.slice(-2) && !detInfo(x) && !detInfo(y);
      res.marks.push({ t: o.g.w, s: isTypo ? 'typo' : 'bad', exp: o.e.w });
      if (!isTypo) typoOnly = false;
    });
    if (typoOnly && !res.ok) { res.ok = true; res.typo = true; }

    // notes
    var subs = ops.filter(function (o) { return o.op === 'sub'; });
    subs.forEach(function (o) {
      var wn = word(o.g.w, o.e.w, { tag: it && it.tag, traps: it && it.traps });
      var head = q(o.g.w) + ' → ' + q(o.e.w);
      if (wn.length) res.notes.push(head + ': ' + wn.join(' '));
      else res.notes.push(head + '.');
    });
    var sameBag = gt.map(nt).sort().join(' ') === et.map(nt).sort().join(' ');
    var mv = sameBag && !res.ok ? singleMove(gt, et) : null;
    if (mv) {
      res.marks = gt.map(function (t, i) { return { t: t.w, s: i === mv.i ? 'moved' : 'ok' }; });
      res.notes.push(mv.note);
    } else if (sameBag && !res.ok) {
      var cands = [lcsMoved(gt, et, true), lcsMoved(gt, et, false)].map(function (c) {
        c.notes = c.ei.map(function (j) { return placeNote(et, j); });
        c.score = c.notes.reduce(function (a, x) { return a + prio(x); }, 0) + c.ei.length * 10;
        return c;
      }).sort(function (a, b) { return a.score - b.score; });
      var c0 = cands[0];
      res.marks = gt.map(function (t, i) { return { t: t.w, s: c0.gi.indexOf(i) >= 0 ? 'moved' : 'ok' }; });
      res.notes = res.notes.filter(function (x) { return !/ → /.test(x); }).concat(c0.notes);
    } else {
      misses.forEach(function (o) { if (o.moved) res.notes.push(placeNote(et, o.ei)); else res.notes.push('Chybí ' + q(o.e.w) + '.'); });
    }
    extras.forEach(function (o) {
      if (o.moved) return;
      var w = nt(o.g);
      if ((w === 'nicht' || /^kein/.test(w)) && /weder/.test(norm(best.a))) res.notes.push(q(o.g.w) + ' je tu navíc: weder … noch už samo je zápor.');
      else if (w === 'zu' && /\b(muss|kann|will|darf|soll|möchte|mag|müssen|können|wollen)\b/.test(String(best.a))) res.notes.push(q('zu') + ' je tu navíc: po modálních slovesech je infinitiv bez zu.');
      else res.notes.push(q(o.g.w) + ' je tu navíc.');
    });
    if (sameBag && !res.ok) res.notes = res.notes.filter(function (x) { return !/ je tu navíc\.$/.test(x); });
    if (sameBag && !res.ok || (!subs.length && !extras.filter(function (o) { return !o.moved; }).length && misses.length && misses.every(function (o) { return o.moved; }))) {
      res.notes.unshift('Všechna slova máš správně – liší se jen pořadí.');
    }
    if (res.typo) res.notes.unshift('Správně, jen drobný překlep.');

    // tips that don't change the verdict
    var gl = String(givenRaw);
    et.forEach(function (t, i) {
      if (t.comma && et[i + 1] && SUB.indexOf(nt(et[i + 1])) >= 0) {
        var re = new RegExp(',\\s*' + et[i + 1].w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
        if (new RegExp('\\b' + et[i + 1].w + '\\b', 'i').test(gl) && !re.test(gl)) res.tips.push('Před ' + q(et[i + 1].w) + ' patří čárka – vedlejší věta se v němčině vždy odděluje čárkou.');
      }
    });
    var gtw = gt.map(function (t) { return t.w; });
    et.forEach(function (t, i) {
      if (i === 0 || !/^[A-ZÄÖÜ]/.test(t.w) || /^(Ich|Sie|Ihnen|Ihr|Ihre\w*)$/.test(t.w)) return;
      var low = t.w.toLowerCase();
      if (gtw.indexOf(low) >= 0 && gtw.indexOf(t.w) < 0) res.tips.push('Podstatná jména se píšou s velkým písmenem: ' + q(t.w) + '.');
    });
    res.tips = res.tips.filter(function (x, i, a) { return a.indexOf(x) === i; }).slice(0, 3);
    return res;
  }

  /* ---------- character diff for display ---------- */
  function charDiff(a, b) {
    a = String(a); b = String(b);
    var m = a.length, n = b.length, L = [], i, j;
    for (i = 0; i <= m; i++) { L[i] = []; for (j = 0; j <= n; j++) L[i][j] = 0; }
    for (i = m - 1; i >= 0; i--) for (j = n - 1; j >= 0; j--) L[i][j] = a[i].toLowerCase() === b[j].toLowerCase() ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    var out = [];
    function push(t, s) { if (out.length && out[out.length - 1].s === s) out[out.length - 1].t += t; else out.push({ t: t, s: s }); }
    i = 0; j = 0;
    while (i < m && j < n) {
      if (a[i].toLowerCase() === b[j].toLowerCase()) { push(b[j], 'same'); i++; j++; }
      else if (L[i + 1][j] >= L[i][j + 1]) { push(a[i], 'del'); i++; }
      else { push(b[j], 'ins'); j++; }
    }
    while (i < m) { push(a[i], 'del'); i++; }
    while (j < n) { push(b[j], 'ins'); j++; }
    return out;
  }

  window.DU_DIAG = { word: word, sentence: sentence, charDiff: charDiff, norm: norm, lev: lev, genderHint: genderHint };
})();
