// Regenerates the declension sets (art-*, adj-*, compose-*) with sensible
// sentences and Czech translations. Output: dekl.json {sets:{id:[items]}, gloss:{}}
'use strict';
const fs = require('fs');

// ---------- seeded random ----------
let seed = 12345;
function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
function pick(a) { return a[Math.floor(rnd() * a.length)]; }
function shuffle(a) { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }
function hash(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return 'g' + (h >>> 0).toString(36); }

// ---------- Czech adjectives ----------
// [de, cz, cz animate nom pl (hard only)]
const ADJ = {
  gut: ['dobrý', 'dobří'], neu: ['nový', 'noví'], alt: ['starý', 'staří'], groß: ['velký', 'velcí'],
  klein: ['malý', 'malí'], schön: ['hezký', 'hezcí'], nett: ['milý', 'milí'], freundlich: ['přátelský', 'přátelští'],
  jung: ['mladý', 'mladí'], streng: ['přísný', 'přísní'], bekannt: ['známý', 'známí'], interessant: ['zajímavý', 'zajímaví'],
  modern: ['moderní', 'moderní'], ruhig: ['klidný', 'klidní'], billig: ['levný', 'levní'], kalt: ['studený', 'studení'],
  warm: ['teplý', 'teplí'], frisch: ['čerstvý', 'čerství'], lecker: ['chutný', 'chutní'], heiß: ['horký', 'horcí'],
  lang: ['dlouhý', 'dlouzí'], kurz: ['krátký', 'krátcí'], schnell: ['rychlý', 'rychlí'], schlecht: ['špatný', 'špatní'],
  hell: ['světlý', 'světlí'], wichtig: ['důležitý', 'důležití'], laut: ['hlučný', 'hluční'], 'žádný': ['žádný', 'žádní']
};
const HARD = {
  s: { ma: ['ý', 'ého', 'ého', 'ém', 'ým'], mi: ['ý', 'ý', 'ého', 'ém', 'ým'], f: ['á', 'ou', 'é', 'é', 'ou'], n: ['é', 'é', 'ého', 'ém', 'ým'] },
  p: { ma: [null, 'é', 'ých', 'ých', 'ými'], mi: ['é', 'é', 'ých', 'ých', 'ými'], f: ['é', 'é', 'ých', 'ých', 'ými'], n: ['á', 'á', 'ých', 'ých', 'ými'] }
};
const SOFT = {
  s: { ma: ['í', 'ího', 'ího', 'ím', 'ím'], mi: ['í', 'í', 'ího', 'ím', 'ím'], f: ['í', 'í', 'í', 'í', 'í'], n: ['í', 'í', 'ího', 'ím', 'ím'] },
  p: { ma: ['í', 'í', 'ích', 'ích', 'ími'], mi: ['í', 'í', 'ích', 'ích', 'ími'], f: ['í', 'í', 'ích', 'ích', 'ími'], n: ['í', 'í', 'ích', 'ích', 'ími'] }
};
const CI = { nom: 0, acc: 1, gen: 2, loc: 3, ins: 4 };
function czAdj(key, g, num, cs) {
  const [base, anpl] = ADJ[key];
  const soft = base.endsWith('í');
  const stem = base.slice(0, -1);
  if (!soft && num === 'p' && g === 'ma' && cs === 'nom') return anpl;
  return stem + (soft ? SOFT : HARD)[num][g][CI[cs]];
}

// ---------- nouns ----------
// de, g(m/f/n), pl, gen(sg, accepted forms), dpl, cat, mass, adjs, cz:{g, pg?, s:[nom,acc,gen,loc,ins], p:[...]}
const N = [];
function noun(de, g, pl, gen, dpl, cat, adjs, czg, s, p, opt) {
  N.push(Object.assign({ de, g, pl, gen: [].concat(gen), dpl, cat, adjs, cz: { g: czg, s, p } }, opt || {}));
}

noun('Mann', 'm', 'Männer', 'Mannes', 'Männern', 'person', ['nett', 'freundlich', 'jung', 'alt', 'bekannt'], 'ma',
  ['muž', 'muže', 'muže', 'muži', 'mužem'], ['muži', 'muže', 'mužů', 'mužích', 'muži']);
noun('Freund', 'm', 'Freunde', ['Freundes', 'Freunds'], 'Freunden', 'person', ['gut', 'alt', 'neu', 'nett', 'jung'], 'ma',
  ['kamarád', 'kamaráda', 'kamaráda', 'kamarádovi', 'kamarádem'], ['kamarádi', 'kamarády', 'kamarádů', 'kamarádech', 'kamarády']);
noun('Chef', 'm', 'Chefs', 'Chefs', 'Chefs', 'person', ['neu', 'streng', 'freundlich', 'jung', 'nett'], 'ma',
  ['šéf', 'šéfa', 'šéfa', 'šéfovi', 'šéfem'], ['šéfové', 'šéfy', 'šéfů', 'šéfech', 'šéfy']);
noun('Lehrer', 'm', 'Lehrer', 'Lehrers', 'Lehrern', 'person', ['streng', 'nett', 'neu', 'jung', 'gut'], 'ma',
  ['učitel', 'učitele', 'učitele', 'učiteli', 'učitelem'], ['učitelé', 'učitele', 'učitelů', 'učitelích', 'učiteli']);
noun('Frau', 'f', 'Frauen', 'Frau', 'Frauen', 'person', ['nett', 'freundlich', 'jung', 'alt', 'bekannt'], 'f',
  ['žena', 'ženu', 'ženy', 'ženě', 'ženou'], ['ženy', 'ženy', 'žen', 'ženách', 'ženami']);
noun('Kollegin', 'f', 'Kolleginnen', 'Kollegin', 'Kolleginnen', 'person', ['neu', 'nett', 'jung', 'freundlich'], 'f',
  ['kolegyně', 'kolegyni', 'kolegyně', 'kolegyni', 'kolegyní'], ['kolegyně', 'kolegyně', 'kolegyň', 'kolegyních', 'kolegyněmi']);
noun('Ärztin', 'f', 'Ärztinnen', 'Ärztin', 'Ärztinnen', 'person', ['neu', 'jung', 'freundlich', 'gut', 'bekannt'], 'f',
  ['lékařka', 'lékařku', 'lékařky', 'lékařce', 'lékařkou'], ['lékařky', 'lékařky', 'lékařek', 'lékařkách', 'lékařkami']);
noun('Kind', 'n', 'Kinder', ['Kindes', 'Kinds'], 'Kindern', 'person', ['klein', 'jung', 'nett', 'laut'], 'n',
  ['dítě', 'dítě', 'dítěte', 'dítěti', 'dítětem'], ['děti', 'děti', 'dětí', 'dětech', 'dětmi'], { pg: 'f' });
noun('Hund', 'm', 'Hunde', ['Hundes', 'Hunds'], 'Hunden', 'animal', ['klein', 'groß', 'jung', 'alt', 'laut'], 'ma',
  ['pes', 'psa', 'psa', 'psovi', 'psem'], ['psi', 'psy', 'psů', 'psech', 'psy']);

noun('Zug', 'm', 'Züge', ['Zuges', 'Zugs'], 'Zügen', 'vehicle', ['schnell', 'lang', 'alt', 'neu', 'modern'], 'mi',
  ['vlak', 'vlak', 'vlaku', 'vlaku', 'vlakem'], ['vlaky', 'vlaky', 'vlaků', 'vlacích', 'vlaky']);
noun('Auto', 'n', 'Autos', 'Autos', 'Autos', 'vehicle', ['neu', 'alt', 'schnell', 'billig', 'klein'], 'n',
  ['auto', 'auto', 'auta', 'autě', 'autem'], ['auta', 'auta', 'aut', 'autech', 'auty']);
noun('Fahrrad', 'n', 'Fahrräder', ['Fahrrades', 'Fahrrads'], 'Fahrrädern', 'vehicle', ['neu', 'alt', 'billig', 'schnell'], 'n',
  ['kolo', 'kolo', 'kola', 'kole', 'kolem'], ['kola', 'kola', 'kol', 'kolech', 'koly']);
noun('Tisch', 'm', 'Tische', 'Tisches', 'Tischen', 'thing', ['groß', 'klein', 'neu', 'alt', 'schön'], 'mi',
  ['stůl', 'stůl', 'stolu', 'stole', 'stolem'], ['stoly', 'stoly', 'stolů', 'stolech', 'stoly']);
noun('Computer', 'm', 'Computer', 'Computers', 'Computern', 'thing', ['neu', 'alt', 'schnell', 'billig', 'modern'], 'mi',
  ['počítač', 'počítač', 'počítače', 'počítači', 'počítačem'], ['počítače', 'počítače', 'počítačů', 'počítačích', 'počítači']);
noun('Buch', 'n', 'Bücher', ['Buches', 'Buchs'], 'Büchern', 'thing', ['interessant', 'neu', 'alt', 'bekannt', 'gut'], 'f',
  ['kniha', 'knihu', 'knihy', 'knize', 'knihou'], ['knihy', 'knihy', 'knih', 'knihách', 'knihami']);
noun('Handy', 'n', 'Handys', 'Handys', 'Handys', 'thing', ['neu', 'alt', 'billig', 'modern'], 'mi',
  ['mobil', 'mobil', 'mobilu', 'mobilu', 'mobilem'], ['mobily', 'mobily', 'mobilů', 'mobilech', 'mobily']);
noun('Foto', 'n', 'Fotos', 'Fotos', 'Fotos', 'thing', ['schön', 'alt', 'neu', 'bekannt'], 'f',
  ['fotka', 'fotku', 'fotky', 'fotce', 'fotkou'], ['fotky', 'fotky', 'fotek', 'fotkách', 'fotkami']);
noun('Tasche', 'f', 'Taschen', 'Tasche', 'Taschen', 'thing', ['neu', 'alt', 'groß', 'klein', 'schön'], 'f',
  ['taška', 'tašku', 'tašky', 'tašce', 'taškou'], ['tašky', 'tašky', 'tašek', 'taškách', 'taškami']);
noun('Lampe', 'f', 'Lampen', 'Lampe', 'Lampen', 'thing', ['neu', 'alt', 'schön', 'modern', 'billig'], 'f',
  ['lampa', 'lampu', 'lampy', 'lampě', 'lampou'], ['lampy', 'lampy', 'lamp', 'lampách', 'lampami']);

noun('Garten', 'm', 'Gärten', 'Gartens', 'Gärten', 'place', ['groß', 'klein', 'schön', 'ruhig'], 'f',
  ['zahrada', 'zahradu', 'zahrady', 'zahradě', 'zahradou'], ['zahrady', 'zahrady', 'zahrad', 'zahradách', 'zahradami']);
noun('Wohnung', 'f', 'Wohnungen', 'Wohnung', 'Wohnungen', 'place', ['groß', 'klein', 'hell', 'ruhig', 'billig', 'schön'], 'mi',
  ['byt', 'byt', 'bytu', 'bytě', 'bytem'], ['byty', 'byty', 'bytů', 'bytech', 'byty'], { live: true });
noun('Stadt', 'f', 'Städte', 'Stadt', 'Städten', 'place', ['groß', 'klein', 'alt', 'schön', 'ruhig'], 'n',
  ['město', 'město', 'města', 'městě', 'městem'], ['města', 'města', 'měst', 'městech', 'městy'], { live: true });
noun('Straße', 'f', 'Straßen', 'Straße', 'Straßen', 'place', ['ruhig', 'lang', 'schön', 'laut', 'alt'], 'f',
  ['ulice', 'ulici', 'ulice', 'ulici', 'ulicí'], ['ulice', 'ulice', 'ulic', 'ulicích', 'ulicemi'], { live: true, end: true });
noun('Haus', 'n', 'Häuser', 'Hauses', 'Häusern', 'place', ['groß', 'klein', 'alt', 'neu', 'schön'], 'mi',
  ['dům', 'dům', 'domu', 'domě', 'domem'], ['domy', 'domy', 'domů', 'domech', 'domy'], { live: true });
noun('Hotel', 'n', 'Hotels', 'Hotels', 'Hotels', 'place', ['groß', 'klein', 'ruhig', 'modern', 'billig'], 'mi',
  ['hotel', 'hotel', 'hotelu', 'hotelu', 'hotelem'], ['hotely', 'hotely', 'hotelů', 'hotelech', 'hotely']);
noun('Büro', 'n', 'Büros', 'Büros', 'Büros', 'place', ['hell', 'modern', 'klein', 'groß', 'ruhig'], 'f',
  ['kancelář', 'kancelář', 'kanceláře', 'kanceláři', 'kanceláří'], ['kanceláře', 'kanceláře', 'kanceláří', 'kancelářích', 'kancelářemi']);
noun('Café', 'n', 'Cafés', 'Cafés', 'Cafés', 'place', ['klein', 'gut', 'ruhig', 'bekannt', 'modern'], 'f',
  ['kavárna', 'kavárnu', 'kavárny', 'kavárně', 'kavárnou'], ['kavárny', 'kavárny', 'kaváren', 'kavárnách', 'kavárnami']);
noun('Zimmer', 'n', 'Zimmer', 'Zimmers', 'Zimmern', 'place', ['hell', 'klein', 'groß', 'ruhig', 'schön'], 'mi',
  ['pokoj', 'pokoj', 'pokoje', 'pokoji', 'pokojem'], ['pokoje', 'pokoje', 'pokojů', 'pokojích', 'pokoji']);
noun('Firma', 'f', 'Firmen', 'Firma', 'Firmen', 'place', ['groß', 'klein', 'modern', 'bekannt', 'neu'], 'f',
  ['firma', 'firmu', 'firmy', 'firmě', 'firmou'], ['firmy', 'firmy', 'firem', 'firmách', 'firmami']);

noun('Kaffee', 'm', null, 'Kaffees', null, 'food', ['heiß', 'kalt', 'gut', 'frisch', 'lecker'], 'f',
  ['káva', 'kávu', 'kávy', 'kávě', 'kávou'], null, { mass: true });
noun('Tee', 'm', null, 'Tees', null, 'food', ['heiß', 'warm', 'kalt', 'gut'], 'mi',
  ['čaj', 'čaj', 'čaje', 'čaji', 'čajem'], null, { mass: true });
noun('Saft', 'm', 'Säfte', ['Saftes', 'Safts'], 'Säften', 'food', ['frisch', 'kalt', 'lecker', 'gut'], 'mi',
  ['džus', 'džus', 'džusu', 'džusu', 'džusem'], ['džusy', 'džusy', 'džusů', 'džusech', 'džusy']);
noun('Kuchen', 'm', 'Kuchen', 'Kuchens', 'Kuchen', 'food', ['frisch', 'lecker', 'warm', 'groß', 'klein'], 'mi',
  ['koláč', 'koláč', 'koláče', 'koláči', 'koláčem'], ['koláče', 'koláče', 'koláčů', 'koláčích', 'koláči']);
noun('Milch', 'f', null, 'Milch', null, 'food', ['frisch', 'kalt', 'warm', 'gut'], 'n',
  ['mléko', 'mléko', 'mléka', 'mléce', 'mlékem'], null, { mass: true });
noun('Suppe', 'f', 'Suppen', 'Suppe', 'Suppen', 'food', ['warm', 'heiß', 'lecker', 'frisch'], 'f',
  ['polévka', 'polévku', 'polévky', 'polévce', 'polévkou'], ['polévky', 'polévky', 'polévek', 'polévkách', 'polévkami']);
noun('Wasser', 'n', null, 'Wassers', null, 'food', ['kalt', 'frisch', 'warm', 'gut'], 'f',
  ['voda', 'vodu', 'vody', 'vodě', 'vodou'], null, { mass: true });
noun('Brot', 'n', null, ['Brotes', 'Brots'], null, 'food', ['frisch', 'warm', 'gut', 'lecker'], 'mi',
  ['chleba', 'chleba', 'chleba', 'chlebu', 'chlebem'], null, { mass: true });
noun('Getränk', 'n', 'Getränke', ['Getränks', 'Getränkes'], 'Getränken', 'food', ['kalt', 'warm', 'lecker', 'frisch'], 'mi',
  ['nápoj', 'nápoj', 'nápoje', 'nápoji', 'nápojem'], ['nápoje', 'nápoje', 'nápojů', 'nápojích', 'nápoji']);

noun('Film', 'm', 'Filme', ['Films', 'Filmes'], 'Filmen', 'event', ['interessant', 'lang', 'kurz', 'gut', 'neu', 'bekannt'], 'mi',
  ['film', 'film', 'filmu', 'filmu', 'filmem'], ['filmy', 'filmy', 'filmů', 'filmech', 'filmy'], { after: true, end: true });
noun('Tag', 'm', 'Tage', ['Tages', 'Tags'], 'Tagen', 'event', ['lang', 'kurz', 'schön', 'schlecht'], 'mi',
  ['den', 'den', 'dne', 'dni', 'dnem'], ['dny', 'dny', 'dnů', 'dnech', 'dny'], { after: true, end: true, noLike: true });
noun('Reise', 'f', 'Reisen', 'Reise', 'Reisen', 'event', ['lang', 'kurz', 'interessant', 'schön'], 'f',
  ['cesta', 'cestu', 'cesty', 'cestě', 'cestou'], ['cesty', 'cesty', 'cest', 'cestách', 'cestami'], { after: true, end: true });
noun('Idee', 'f', 'Ideen', 'Idee', 'Ideen', 'event', ['gut', 'interessant', 'neu', 'schlecht'], 'mi',
  ['nápad', 'nápad', 'nápadu', 'nápadu', 'nápadem'], ['nápady', 'nápady', 'nápadů', 'nápadech', 'nápady']);
noun('Arbeit', 'f', 'Arbeiten', 'Arbeit', 'Arbeiten', 'event', ['neu', 'interessant', 'wichtig', 'gut'], 'f',
  ['práce', 'práci', 'práce', 'práci', 'prací'], ['práce', 'práce', 'prací', 'pracích', 'pracemi'], { after: true });
noun('Prüfung', 'f', 'Prüfungen', 'Prüfung', 'Prüfungen', 'event', ['wichtig', 'lang', 'kurz', 'schwer'.length ? 'schlecht' : 'x'], 'f',
  ['zkouška', 'zkoušku', 'zkoušky', 'zkoušce', 'zkouškou'], ['zkoušky', 'zkoušky', 'zkoušek', 'zkouškách', 'zkouškami'], { after: true, end: true, noLike: true });
noun('Projekt', 'n', 'Projekte', ['Projekts', 'Projektes'], 'Projekten', 'event', ['neu', 'interessant', 'wichtig', 'groß'], 'mi',
  ['projekt', 'projekt', 'projektu', 'projektu', 'projektem'], ['projekty', 'projekty', 'projektů', 'projektech', 'projekty'], { end: true });
const OPT = {
  Wohnung: { inFrame: ['Wir wohnen', 'Bydlíme'] }, Stadt: { inFrame: ['Wir wohnen', 'Bydlíme'], genFrame: ['Das ist das Zentrum', 'To je centrum'] },
  Straße: { inFrame: ['Wir wohnen', 'Bydlíme'] }, Haus: { inFrame: ['Wir wohnen', 'Bydlíme'] },
  Hotel: { inFrame: ['Wir schlafen', 'Spíme'] }, Zimmer: { inFrame: ['Wir schlafen', 'Spíme'], genFrame: ['Das ist das Fenster', 'To je okno'] },
  Café: { inFrame: ['Wir sitzen', 'Sedíme'] }, Büro: { inFrame: ['Sie arbeitet', 'Pracuje'] }, Firma: { inFrame: ['Sie arbeitet', 'Pracuje'] },
  Garten: { inFrame: ['Die Kinder spielen', 'Děti si hrají'], genFrame: ['Das ist das Tor', 'To je branka'] },
  Kind: { genFrame: ['Das ist das Spielzeug', 'To je hračka'] }
};
N.forEach(n => Object.assign(n, OPT[n.de] || {}));
// Prüfung: "schlechte Prüfung" is odd -> use wichtig, lang, kurz only
N.find(n => n.de === 'Prüfung').adjs = ['wichtig', 'lang', 'kurz'];

const GN = { m: 'mužský rod', f: 'ženský rod', n: 'střední rod', pl: 'množné číslo' };
const GS = { m: 'm.', f: 'ž.', n: 'stř.', pl: 'mn. č.' };
const ART = { m: 'der', f: 'die', n: 'das' };

// ---------- German articles and endings ----------
const DEF = { m: { nom: 'der', akk: 'den', dat: 'dem', gen: 'des' }, f: { nom: 'die', akk: 'die', dat: 'der', gen: 'der' },
  n: { nom: 'das', akk: 'das', dat: 'dem', gen: 'des' }, pl: { nom: 'die', akk: 'die', dat: 'den', gen: 'der' } };
const IND = { m: { nom: 'ein', akk: 'einen', dat: 'einem', gen: 'eines' }, f: { nom: 'eine', akk: 'eine', dat: 'einer', gen: 'einer' },
  n: { nom: 'ein', akk: 'ein', dat: 'einem', gen: 'eines' }, pl: { nom: 'keine', akk: 'keine', dat: 'keinen', gen: 'keiner' } };
function art(det, g, c) {
  if (det === 'def') return DEF[g][c];
  if (det === 'indef') return IND[g][c];
  if (det === 'kein') return g === 'pl' ? IND.pl[c] : 'k' + IND[g][c];
  return '';
}
const WEAK = { m: { nom: 'e', akk: 'en', dat: 'en', gen: 'en' }, f: { nom: 'e', akk: 'e', dat: 'en', gen: 'en' }, n: { nom: 'e', akk: 'e', dat: 'en', gen: 'en' }, pl: { nom: 'en', akk: 'en', dat: 'en', gen: 'en' } };
const MIXED = { m: { nom: 'er', akk: 'en', dat: 'en', gen: 'en' }, f: { nom: 'e', akk: 'e', dat: 'en', gen: 'en' }, n: { nom: 'es', akk: 'es', dat: 'en', gen: 'en' }, pl: { nom: 'en', akk: 'en', dat: 'en', gen: 'en' } };
const STRONG = { m: { nom: 'er', akk: 'en', dat: 'em', gen: 'en' }, f: { nom: 'e', akk: 'e', dat: 'er', gen: 'er' }, n: { nom: 'es', akk: 'es', dat: 'em', gen: 'en' }, pl: { nom: 'e', akk: 'e', dat: 'en', gen: 'er' } };
function ending(det, g, c) { return (det === 'def' ? WEAK : det === 'none' ? STRONG : MIXED)[g][c]; }
function nounForm(n, num, c) {
  if (num === 'p') return [c === 'dat' ? n.dpl : n.pl];
  return c === 'gen' ? n.gen : [n.de];
}
const CASE_N = { nom: 1, gen: 2, dat: 3, akk: 4 };

// Czech-order tables (1.–4. pád)
const ORDER = ['nom', 'gen', 'dat', 'akk'];
function artLine(det, g) {
  const name = det === 'def' ? 'Určitý člen' : det === 'kein' && g === 'pl' ? 'Záporný člen' : det === 'kein' ? 'Záporný člen' : 'Neurčitý člen';
  return name + ', ' + GN[g] + ': ' + ORDER.map(c => CASE_N[c] + '. ' + art(det, g, c)).join(' · ') + '.';
}

// ---------- frames ----------
// Each frame: case, cats, nums allowed, dets allowed, de(np, num) -> sentence with {NP}, cz(npcz, num, neg) ,czCase, reason
const V = {
  brauchen: ['Ich brauche', 'Potřebuju', 'Nepotřebuju', 'brauchen'],
  suchen: ['Wir suchen', 'Hledáme', 'Nehledáme', 'suchen'],
  kaufen: ['Wir kaufen', 'Kupujeme', 'Nekupujeme', 'kaufen'],
  kennen: ['Ich kenne', 'Znám', 'Neznám', 'kennen'],
  mögen: ['Sie mag', 'Má ráda', 'Nemá ráda', 'mögen'],
  haben: ['Wir haben', 'Máme', 'Nemáme', 'haben'],
  sehen: ['Ich sehe', 'Vidím', 'Nevidím', 'sehen'],
  sehenFilm: ['Ich sehe', 'Dívám se na', 'Nedívám se na', 'sehen'],
  planen: ['Wir planen', 'Plánujeme', 'Neplánujeme', 'planen'],
  verpassen: ['Wir verpassen', 'Zmeškáme', 'Nezmeškáme', 'verpassen'],
  habenE: ['Wir haben', 'Máme', 'Nemáme', 'haben']
};
const AKK_OVR = { Zug: ['sehen', 'verpassen'], Film: ['mögen', 'sehenFilm'], Tag: ['habenE'], Prüfung: ['habenE'], Reise: ['mögen', 'planen'],
  Projekt: ['mögen', 'planen'], Arbeit: ['mögen', 'suchen'], Idee: ['brauchen', 'habenE'], Firma: ['suchen', 'kennen'], Straße: ['suchen', 'kennen'] };
const AKKV = { person: ['kennen', 'suchen', 'sehen'], animal: ['suchen', 'haben', 'sehen'], vehicle: ['brauchen', 'kaufen', 'haben'],
  thing: ['brauchen', 'kaufen', 'suchen'], place: ['suchen', 'mögen'], food: ['mögen', 'kaufen', 'brauchen'], event: ['mögen', 'brauchen'] };

function sAfter(w) { return /^[szšž]/i.test(w) || /^(psem|psy|mnou)$/.test(w) ? 'se' : 's'; }
function vAfter(w) { return /^[vf]/i.test(w) || /^(městě|městech)$/.test(w) ? 've' : 'v'; }

function frames(n, c, num, det) {
  // returns list of {de: 'text with ___NP___', cz: fn(npcz) , czc, reason}
  const out = [];
  const pl = num === 'p';
  const neg = det === 'kein';
  if (c === 'nom') {
    if (det === 'indef' || (det === 'kein' && !pl)) {
      out.push({ de: 'Das ist {NP}.', cz: np => (neg ? 'To není ' : 'To je ') + np + '.', czc: 'nom', zadny: false, reason: 'podmět (kdo? co?)' });
    } else {
      out.push({ de: (pl ? 'Hier sind ' : 'Hier ist ') + '{NP}.', cz: np => (neg ? 'Tady nejsou ' : pl ? 'Tady jsou ' : 'Tady je ') + np + '.', czc: 'nom', zadny: neg, reason: 'podmět (kdo? co?)' });
    }
  } else if (c === 'akk') {
    let vs = (AKK_OVR[n.de] || AKKV[n.cat]).slice();
    if (n.noLike || neg) vs = vs.filter(v => v !== 'mögen');
    if (!vs.length) vs = ['brauchen'];
    vs.forEach(v => {
      const [de, cp, cn, inf] = V[v];
      out.push({ de: de + ' {NP}.', cz: np => (neg ? cn : cp) + ' ' + np + '.', czc: 'acc', zadny: neg, reason: inf + ' + 4. pád (koho? co?)' });
    });
  } else if (c === 'dat') {
    const contracts = det === 'def' && !pl && n.g !== 'f'; // in dem -> im
    if (n.cat === 'person') {
      out.push({ de: 'Er spricht mit {NP}.', cz: np => (neg ? 'Nemluví ' : 'Mluví ') + sAfter(np) + ' ' + np + '.', czc: 'ins', zadny: neg, reason: 'mit → vždy 3. pád' });
      out.push({ de: 'Wir gehen mit {NP} ins Kino.', cz: np => 'Jdeme ' + sAfter(np) + ' ' + np + ' do kina.', czc: 'ins', zadny: false, noNeg: true, reason: 'mit → vždy 3. pád' });
    } else if (n.cat === 'animal') {
      out.push({ de: 'Er spielt mit {NP}.', cz: np => (neg ? 'Nehraje si ' : 'Hraje si ') + sAfter(np) + ' ' + np + '.', czc: 'ins', zadny: neg, reason: 'mit → vždy 3. pád' });
    } else if (n.cat === 'vehicle') {
      out.push({ de: 'Wir fahren mit {NP}.', cz: np => 'Jedeme ' + np + '.', czc: 'ins', zadny: false, noNeg: true, reason: 'fahren mit → vždy 3. pád' });
    } else if (n.cat === 'thing') {
      out.push({ de: 'Er kommt mit {NP}.', cz: np => 'Přichází ' + sAfter(np) + ' ' + np + '.', czc: 'ins', zadny: false, noNeg: true, reason: 'mit → vždy 3. pád' });
    }
    if (n.cat !== 'person' && n.cat !== 'animal' && det !== 'indef' && n.de !== 'Tag') {
      out.push({ de: 'Ich bin mit {NP} zufrieden.', cz: np => (neg ? 'Nejsem spokojený ' : 'Jsem spokojený ') + sAfter(np) + ' ' + np + '.', czc: 'ins', zadny: neg, reason: 'zufrieden mit → vždy 3. pád' });
    }
    if ((n.after || (n.cat === 'food' && n.de !== 'Wasser' && n.de !== 'Milch' && n.de !== 'Brot')) && !pl) {
      if (n.cat === 'food') out.push({ de: 'Nach {NP} geht es mir besser.', cz: np => 'Po ' + np + ' je mi líp.', czc: 'loc', zadny: false, noNeg: true, reason: 'nach (po) → vždy 3. pád' });
      else out.push({ de: 'Nach {NP} gehen wir nach Hause.', cz: np => 'Po ' + np + ' jdeme domů.', czc: 'loc', zadny: false, noNeg: true, reason: 'nach (po) → vždy 3. pád' });
    }
    if (n.inFrame && !pl && !contracts && !neg) {
      const [deV, czV] = n.inFrame;
      out.push({ de: deV + ' in {NP}.', cz: np => czV + ' ' + vAfter(np) + ' ' + np + '.', czc: 'loc', zadny: false, noNeg: true, reason: 'in + wo? (kde?) → 3. pád' });
    }
  } else if (c === 'gen') {
    if (neg) return out;
    if (det === 'none') {
      if (n.cat === 'thing' || n.cat === 'food') out.push({ de: 'Der Preis {NP} ist hoch.', cz: np => 'Cena ' + np + ' je vysoká.', czc: 'gen', reason: 'čeho? → 2. pád (přívlastek)' });
      return out;
    }
    if (n.genFrame) { const [d0, c0] = n.genFrame; out.push({ de: d0 + ' {NP}.', cz: np => c0 + ' ' + np + '.', czc: 'gen', reason: 'čeho? → 2. pád (přívlastek)' }); return out; }
    if (n.cat === 'person') out.push({ de: 'Das ist das Auto {NP}.', cz: np => 'To je auto ' + np + '.', czc: 'gen', reason: 'čí? koho? → 2. pád (přívlastek)' });
    else if (n.cat === 'animal') out.push({ de: 'Das ist der Ball {NP}.', cz: np => 'To je míček ' + np + '.', czc: 'gen', reason: 'čí? → 2. pád (přívlastek)' });
    else if (n.cat === 'place' && !n.end) out.push({ de: 'Das ist die Adresse {NP}.', cz: np => 'To je adresa ' + np + '.', czc: 'gen', reason: 'čeho? → 2. pád (přívlastek)' });
    else if (n.cat === 'thing' || n.cat === 'vehicle' || n.cat === 'food') out.push({ de: 'Der Preis {NP} ist hoch.', cz: np => 'Cena ' + np + ' je vysoká.', czc: 'gen', reason: 'čeho? → 2. pád (přívlastek)' });
    if (n.end) out.push({ de: 'Das ist das Ende {NP}.', cz: np => 'To je konec ' + np + '.', czc: 'gen', reason: 'čeho? → 2. pád (přívlastek)' });
    if (n.cat === 'event' && !n.end) out.push({ de: 'Das ist das Thema {NP}.', cz: np => 'To je téma ' + np + '.', czc: 'gen', reason: 'čeho? → 2. pád (přívlastek)' });
  }
  return out.filter(f => !(neg && f.noNeg));
}

function czNP(n, num, czc, adj, zadny) {
  const g = num === 'p' ? (n.pg || n.cz.g) : n.cz.g;
  const noun = n.cz[num === 'p' ? 'p' : 's'][CI[czc]];
  const parts = [];
  if (zadny) parts.push(czAdj('žádný', g, num, czc));
  if (adj) parts.push(czAdj(adj, g, num, czc));
  parts.push(noun);
  return parts.join(' ');
}
function czBase(n, num, adj) { return czNP(n, num, 'nom', adj, false); }

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

// ---------- item builders ----------
const sets = {};
const used = new Set();
function add(set, it) {
  const key = set + '|' + it.prompt;
  if (used.has(key)) return false;
  used.add(key);
  it.id = hash(key);
  (sets[set] = sets[set] || []).push(it);
  return true;
}
function gKey(n, num) { return num === 'p' ? 'pl' : n.g; }
function lemmaLabel(n, num) { return num === 'p' ? 'die ' + n.pl : ART[n.g] + ' ' + n.de; }
const DETCUE = { def: 'určitý', indef: 'neurčitý', kein: 'kein-' };

function candidates(c, num, det) {
  const out = [];
  N.forEach(n => {
    if (num === 'p' && !n.pl) return;
    if (num === 's' && n.mass && (det === 'indef' || det === 'kein')) return;
    if (num === 's' && det === 'none' && !n.mass) return;
    frames(n, c, num, det).forEach(f => out.push({ n, f }));
  });
  return out;
}

function buildArticle(set, c, gWant, num, det, count) {
  let cands = candidates(c, num, det).filter(x => num === 'p' || x.n.g === gWant);
  cands = shuffle(cands);
  let made = 0;
  for (const { n, f } of cands) {
    if (made >= count) break;
    const g = gKey(n, num);
    const a = art(det, g, c);
    const nf = nounForm(n, num, c)[0];
    const sentDe = f.de.replace('{NP}', a + ' ' + nf);
    const prompt = cap(f.de.replace('{NP}', '___ (' + DETCUE[det] + ') ' + nf));
    const npcz = czNP(n, num, f.czc, null, f.zadny);
    const tr = cap(f.cz(npcz));
    const label = lemmaLabel(n, num);
    const ok = add(set, {
      kind: 'fill', prompt, answer: [a],
      hint: label + ' · ' + f.reason,
      short: CASE_N[c] + '. pád, ' + GS[g] + ' → ' + a + '.',
      explain: label + ' (' + GN[g] + ') = ' + czBase(n, num) + '. ' + cap(f.reason) + '.\n' + artLine(det === 'kein' && g !== 'pl' ? 'kein' : det, g),
      tag: 'Člen: ' + CASE_N[c] + '. pád · ' + GS[g] + ' · ' + (det === 'def' ? 'určitý' : 'ein-/kein-'),
      tr, de: sentDe
    });
    if (ok) made++;
  }
}

const ADJ_RULE = {
  def: 'Po určitém členu (der, die, das …) má přídavné jméno jen dvě koncovky: -e v 1. pádě j. č. (všechny rody) a ve 4. pádě ž. a stř. rodu, všude jinde -en.',
  indef: 'Po ein-/kein- je to skoro stejné jako po určitém členu. Jen tam, kde člen nemá koncovku (ein, kein), ji převezme přídavné jméno: m. 1. pád -er (ein kleiner), stř. 1. a 4. pád -es (ein kleines). Množné číslo po keine: -en.',
  none: 'Bez členu nese koncovku přídavné jméno samo – stejnou, jakou by měl určitý člen: der → -er, die → -e, das → -es, dem → -em, den → -en, množné č. die → -e. Výjimka: 2. pád m. a stř. rodu má -en (wegen schlechten Wetters).'
};
const DETNAME = { def: 'určitý člen', indef: 'ein-/kein-', kein: 'ein-/kein-', none: 'bez členu' };

function adjPhrase(n, num, c, det, adj) {
  const g = gKey(n, num);
  const a = art(det, g, c);
  const end = ending(det, g, c);
  const forms = nounForm(n, num, c);
  return { a, form: adj + end, end, forms, g };
}

function buildAdj(set, c, gWant, num, det, count) {
  let cands = candidates(c, num, det).filter(x => num === 'p' || x.n.g === gWant);
  cands = shuffle(cands);
  let made = 0;
  for (const { n, f } of cands) {
    if (made >= count) break;
    const adj = pick(n.adjs);
    const { a, form, end, forms, g } = adjPhrase(n, num, c, det, adj);
    const nf = forms[0];
    const prompt = cap(f.de.replace('{NP}', (a ? a + ' ' : '') + '___ (' + adj + ') ' + nf));
    const sentDe = f.de.replace('{NP}', (a ? a + ' ' : '') + form + ' ' + nf);
    const tr = cap(f.cz(czNP(n, num, f.czc, adj, f.zadny)));
    const label = lemmaLabel(n, num);
    const ex = pick(N.filter(x => x !== n && (num === 'p' ? x.pl : x.g === n.g && (det === 'none' ? x.mass : !x.mass))));
    let exTxt = null;
    if (ex) {
      const exAdj = pick(ex.adjs);
      const ep = adjPhrase(ex, num, c, det, exAdj);
      exTxt = 'např. ' + (ep.a ? ep.a + ' ' : '') + ep.form + ' ' + ep.forms[0];
    }
    const detLabel = det === 'def' ? 'Určitý člen ' + a : det === 'none' ? 'Bez členu' : (det === 'kein' ? 'Člen ' : 'Neurčitý člen ') + a;
    const ok = add(set, {
      kind: 'fill', prompt, answer: [form],
      hint: label + ' · ' + f.reason,
      short: CASE_N[c] + '. pád, ' + GS[g] + ', ' + DETNAME[det] + ' → -' + end + '.',
      explain: label + ' (' + GN[g] + '), ' + f.reason + '. ' + detLabel + ' → koncovka -' + end + '.\n' + ADJ_RULE[det === 'kein' ? 'indef' : det],
      example: exTxt || undefined,
      tag: 'Adj.: ' + CASE_N[c] + '. pád · ' + GS[g] + ' · ' + DETNAME[det],
      tr, de: sentDe
    });
    if (ok) made++;
  }
}

function buildCompose(set, c, count) {
  const combos = [];
  ['s', 'p'].forEach(num => ['def', 'indef', 'kein', 'none'].forEach(det => {
    if (num === 'p' && det === 'indef') return;
    if (c === 'gen' && det === 'kein') return;
    N.forEach(n => {
      if (num === 'p' && !n.pl) return;
      if (num === 's' && n.mass && (det === 'indef' || det === 'kein')) return;
      if (num === 's' && det === 'none' && !n.mass) return;
      if (det === 'none' && c === 'gen' && num === 's') return; // rare, keep for special items
      combos.push({ n, num, det });
    });
  }));
  const weights = shuffle(combos);
  // prefer balance of dets
  const byDet = {};
  weights.forEach(x => (byDet[x.det + x.num] = byDet[x.det + x.num] || []).push(x));
  const keys = Object.keys(byDet);
  let made = 0, i = 0;
  while (made < count && keys.some(k => byDet[k].length)) {
    const k = keys[i++ % keys.length];
    const x = byDet[k].shift();
    if (!x) continue;
    const { n, num, det } = x;
    const adj = pick(n.adjs);
    const { a, form, end, forms, g } = adjPhrase(n, num, c, det, adj);
    const lemma = num === 'p' ? 'die ' + n.pl : ART[n.g] + ' ' + n.de;
    const detTxt = det === 'def' ? 'určitý člen' : det === 'indef' ? 'neurčitý člen' : det === 'kein' ? 'kein-' : 'bez členu';
    const prompt = CASE_N[c] + '. pád, ' + detTxt + ': ___ (' + adj + ', ' + lemma + ')';
    const answers = forms.map(f => (a ? a + ' ' : '') + form + ' ' + f);
    const czc = { nom: 'nom', akk: 'acc', dat: 'ins', gen: 'gen' }[c];
    const czCaseNote = { nom: '1. pád', akk: '4. pád', dat: '3. pád', gen: '2. pád' }[c];
    let ex2 = '';
    if (c === 'gen' && num === 's' && n.g !== 'f') ex2 = '\nPodstatné jméno: m. a stř. rod má ve 2. pádě -s/-es (' + n.de + ' → ' + forms[0] + ').';
    if (c === 'dat' && num === 'p') ex2 = '\nPodstatné jméno: 3. pád mn. č. končí na -n (' + n.pl + ' → ' + n.dpl + '), pokud už nekončí na -n nebo -s.';
    const ok = add(set, {
      kind: 'fill', prompt, answer: answers,
      short: answers[0] + '.',
      explain: lemma + ' (' + GN[g] + '), ' + CASE_N[c] + '. pád, ' + detTxt + ' → ' + (a ? a + ' + ' : '') + adj + '-' + end + '.\n' + ADJ_RULE[det === 'kein' ? 'indef' : det] + ex2,
      tag: 'Adj.: ' + CASE_N[c] + '. pád · ' + GS[g] + ' · ' + DETNAME[det],
      tr: czNP(n, num, 'nom', adj, det === 'kein'),
      de: answers[0]
    });
    if (ok) made++;
  }
}

// art-nom-akk
['nom', 'akk'].forEach(c => {
  ['m', 'f', 'n'].forEach(g => { buildArticle('art-nom-akk', c, g, 's', 'def', 4); buildArticle('art-nom-akk', c, g, 's', 'indef', 3); buildArticle('art-nom-akk', c, g, 's', 'kein', 2); });
  buildArticle('art-nom-akk', c, null, 'p', 'def', 4); buildArticle('art-nom-akk', c, null, 'p', 'kein', 3);
});
['m', 'f', 'n'].forEach(g => { buildArticle('art-dat', 'dat', g, 's', 'def', 5); buildArticle('art-dat', 'dat', g, 's', 'indef', 4); buildArticle('art-dat', 'dat', g, 's', 'kein', 1); });
buildArticle('art-dat', 'dat', null, 'p', 'def', 5); buildArticle('art-dat', 'dat', null, 'p', 'kein', 2);
['m', 'f', 'n'].forEach(g => { buildArticle('art-gen', 'gen', g, 's', 'def', 5); buildArticle('art-gen', 'gen', g, 's', 'indef', 4); });
buildArticle('art-gen', 'gen', null, 'p', 'def', 6);

['nom', 'akk', 'dat', 'gen'].forEach(c => {
  ['m', 'f', 'n'].forEach(g => buildAdj('adj-def', c, g, 's', 'def', c === 'gen' ? 3 : 4));
  buildAdj('adj-def', c, null, 'p', 'def', 4);
  ['m', 'f', 'n'].forEach(g => { buildAdj('adj-indef', c, g, 's', 'indef', c === 'gen' ? 3 : 3); if (c !== 'gen') buildAdj('adj-indef', c, g, 's', 'kein', 1); });
  if (c !== 'gen') buildAdj('adj-indef', c, null, 'p', 'kein', 3);
});
['nom', 'akk', 'dat'].forEach(c => {
  ['m', 'f', 'n'].forEach(g => buildAdj('adj-none', c, g, 's', 'none', 3));
  buildAdj('adj-none', c, null, 'p', 'none', 5);
});
buildAdj('adj-none', 'gen', null, 'p', 'none', 3);

buildCompose('compose-nom', 'nom', 40);
buildCompose('compose-akk', 'akk', 40);
buildCompose('compose-dat', 'dat', 40);
buildCompose('compose-gen', 'gen', 32);

// noun-forms: 3. pád mn. č.
const nounDat = [];
N.forEach(n => {
  if (!n.pl) return;
  let de, cz;
  const ins = n.cz.p[4];
  if (n.cat === 'person') { de = 'Er spricht mit den ___ (' + n.de + ').'; cz = 'Mluví ' + sAfter(ins) + ' ' + ins + '.'; }
  else if (n.cat === 'animal') { de = 'Er spielt mit den ___ (' + n.de + ').'; cz = 'Hraje si ' + sAfter(ins) + ' ' + ins + '.'; }
  else { de = 'Ich bin mit den ___ (' + n.de + ') zufrieden.'; cz = 'Jsem spokojený ' + sAfter(ins) + ' ' + ins + '.'; }
  nounDat.push({ de: n.de, prompt: de, answer: n.dpl, pl: n.pl, tr: cz });
});

// ---------- glossary from this data ----------
const gloss = {};
function addG(k, v) { k = k.toLowerCase(); if (!gloss[k]) gloss[k] = v; }
N.forEach(n => {
  const cz = n.cz.s[0];
  const head = ART[n.g] + ' ' + n.de;
  addG(n.de, head + ' = ' + cz);
  n.gen.forEach(f => addG(f, head + ' = ' + cz + ' (2. pád)'));
  if (n.pl) { addG(n.pl, head + ' = ' + n.cz.p[0] + ' (mn. č. die ' + n.pl + ')'); addG(n.dpl, head + ' = ' + n.cz.p[0] + ' (3. pád mn. č.)'); }
});
const ADJS_DE = Object.keys(ADJ).filter(k => k !== 'žádný');
const adjGloss = {};
ADJS_DE.forEach(a => { adjGloss[a] = ADJ[a][0]; });

fs.writeFileSync(__dirname + '/dekl.json', JSON.stringify({ sets, gloss, adjGloss, nounDat }, null, 1));
Object.keys(sets).forEach(k => console.log(k, sets[k].length));
