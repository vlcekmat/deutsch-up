'use strict';
const { fill, choice, order, sent, write, theory, set, vocab } = require('./lib');

const sets = [];
const vocabSets = [];

// ---------- D22: vztažné věty 1./4. pád ----------
sets.push(set({ id: 'rel-1', group: 'pokr', title: 'Vztažné věty: der, den, das, die', tag: 'Vztažné věty: 1./4. pád',
  desc: 'Der Mann, der … / den …',
  rule: 'Vztažné zájmeno má ROD a ČÍSLO podle podstatného jména, ke kterému patří, ale PÁD podle své role ve vztažné větě. 1. pád (podmět): der, die, das, die. 4. pád (předmět): den, die, das, die. Sloveso je na konci, před vztažnou větou je čárka.' }, [
  fill('Das ist der Mann, [der] neben mir wohnt.', 'To je ten muž, který bydlí vedle mě.', 'der Mann (m.); ve vztažné větě je podmětem (kdo bydlí?) → 1. pád der.'),
  fill('Das ist der Mann, [den] ich gestern gesehen habe.', 'To je ten muž, kterého jsem včera viděl.', 'Podmět je ich; muže jsem viděl (koho?) → 4. pád m. = den.', { traps: { der: 'der by byl podmět. Ve větě už podmět je (ich), muž je předmět (koho jsem viděl?) → 4. pád den.' } }),
  fill('Die Frau, [die] dort steht, ist meine Chefin.', 'Žena, která tam stojí, je moje šéfová.', 'die Frau, 1. pád → die.'),
  fill('Das Buch, [das] ich lese, ist sehr spannend.', 'Kniha, kterou čtu, je velmi napínavá.', 'das Buch (stř.), 4. pád → das (stejné jako 1. pád).', { traps: { dass: 'dass je spojka „že“. Vztažné zájmeno pro das Buch je das (s jedním s).', den: 'den je jen pro mužský rod. das Buch je střední → das.' } }),
  fill('Die Leute, [die] hier arbeiten, sind sehr nett.', 'Lidé, kteří tu pracují, jsou velmi milí.', 'Množné číslo, 1. pád → die.'),
  fill('Wo ist der Schlüssel, [den] du gefunden hast?', 'Kde je ten klíč, který jsi našel?', 'der Schlüssel (m.), 4. pád (co jsi našel?) → den.'),
  fill('Ich suche eine Wohnung, [die] einen Balkon hat.', 'Hledám byt, který má balkon.', 'die Wohnung (ž.), podmět → die. Pozor: česky „který“ (m.), ale Wohnung je ženský rod.', { traps: { der: 'Rod se řídí německým slovem: die Wohnung je ženský rod → die (i když česky „byt, který“).' } }),
  fill('Der Film, [den] wir gestern gesehen haben, war langweilig.', 'Film, který jsme včera viděli, byl nudný.', 'der Film, 4. pád → den.'),
  fill('Das Kind, [das] dort spielt, ist mein Neffe.', 'Dítě, které si tam hraje, je můj synovec.', 'das Kind, 1. pád → das.'),
  fill('Kennst du den Kollegen, [der] gestern angefangen hat?', 'Znáš toho kolegu, který včera začal?', 'Kollege (m.), podmět ve vztažné větě → der (i když v hlavní větě je den Kollegen).', { traps: { den: 'Pád v hlavní větě nerozhoduje. Ve vztažné větě kolega začal (kdo?) → 1. pád der.' } }),
  choice('Das ist die Kollegin, ___ ich sehr mag.', ['der', 'die', 'den'], 1, 'To je kolegyně, kterou mám moc rád.', 'die Kollegin (ž.), 4. pád → die (ž. má v 1. i 4. pádě die).'),
  choice('Der Zug, ___ um 8 Uhr abfährt, ist voll.', ['der', 'den', 'das'], 0, 'Vlak, který odjíždí v 8, je plný.', 'der Zug, podmět → der.'),
  choice('Die Schuhe, ___ ich gekauft habe, sind zu klein.', ['den', 'die', 'das'], 1, 'Boty, které jsem koupil, jsou malé.', 'Množné číslo, 4. pád → die.'),
  order('Das ist das Restaurant, das ich dir empfohlen habe.', 'To je ta restaurace, kterou jsem ti doporučil.', 'Vztažná věta: das … empfohlen habe (sloveso na konci).'),
  order('Der Mann, der dort sitzt, ist mein Vater.', 'Muž, který tam sedí, je můj otec.', 'Vztažná věta může stát uprostřed hlavní věty – mezi dvěma čárkami.'),
  sent('Kde je ta kniha, kterou jsem ti půjčil?', ['Wo ist das Buch, das ich dir geliehen habe?'], 'das Buch → das (4. pád stř.); leihen – lieh – geliehen.', { chips: ['leihen', 'das Buch'] }),
  sent('Znáš tu ženu, která bydlí nad námi?', ['Kennst du die Frau, die über uns wohnt?'], 'die Frau, podmět → die. über uns = nad námi.', { chips: ['über uns'] }),
  sent('Film, který jsme viděli, byl lepší než ta kniha.', ['Der Film, den wir gesehen haben, war besser als das Buch.', 'Der Film, den wir sahen, war besser als das Buch.'], 'der Film, 4. pád → den. Srovnání: besser als.', { chips: ['den', 'besser als'] })
]));

// ---------- D23: vztažné věty 3./2. pád + předložky ----------
sets.push(set({ id: 'rel-2', group: 'pokr', title: 'Vztažné věty: dem, der, denen, dessen', tag: 'Vztažné věty: 3./2. pád',
  desc: 'mit dem, der Freund, dessen …, alles, was …',
  rule: 'Vztažné zájmeno ve 3. pádě: dem (m./stř.), der (ž.), denen (mn. č.). Ve 2. pádě: dessen (m./stř.), deren (ž., mn. č.). Předložka jde před zájmeno: die Frau, mit der ich spreche. Po alles, etwas, nichts, das (Beste) je vztažné was; po místě často wo.' }, [
  fill('Das ist der Freund, [dem] ich mein Auto geliehen habe.', 'To je kamarád, kterému jsem půjčil auto.', 'leihen + komu → 3. pád, m. → dem.'),
  fill('Die Frau, [der] ich geholfen habe, war sehr dankbar.', 'Žena, které jsem pomohl, byla velmi vděčná.', 'helfen + 3. pád; ž. → der.', { traps: { die: 'helfen vyžaduje 3. pád (komu?). Ženský rod ve 3. pádě = der.' } }),
  fill('Die Kinder, [denen] ich Deutsch unterrichte, sind sehr fleißig.', 'Děti, kterým učím němčinu, jsou velmi pilné.', 'Množné číslo, 3. pád → denen.', { traps: { den: 'den je 3. pád mn. č. jen u členu (den Kindern). Vztažné zájmeno má denen.' } }),
  fill('Der Kollege, mit [dem] ich arbeite, kommt aus Graz.', 'Kolega, se kterým pracuju, je z Grazu.', 'mit + 3. pád, m. → mit dem.'),
  fill('Die Stadt, in [der] ich geboren bin, ist klein.', 'Město, ve kterém jsem se narodil, je malé.', 'in + 3. pád (kde?), ž. → in der.'),
  fill('Das ist die Firma, für [die] ich arbeite.', 'To je firma, pro kterou pracuju.', 'für + 4. pád, ž. → für die.'),
  fill('Der Mann, [dessen] Auto vor dem Haus steht, ist Arzt.', 'Muž, jehož auto stojí před domem, je lékař.', '2. pád (čí?), m. → dessen.'),
  fill('Die Frau, [deren] Sohn in meiner Klasse ist, ist Lehrerin.', 'Žena, jejíž syn je v mé třídě, je učitelka.', '2. pád, ž. → deren.'),
  fill('Alles, [was] du sagst, ist richtig.', 'Všechno, co říkáš, je správně.', 'Po alles → was.', { traps: { das: 'Po alles, etwas, nichts, vieles se používá was, ne das.' } }),
  fill('Es gibt nichts, [was] ich lieber esse.', 'Není nic, co bych jedl raději.', 'Po nichts → was.'),
  fill('Das ist das Café, [wo|in dem] wir uns kennengelernt haben.', 'To je ta kavárna, kde jsme se seznámili.', 'U místa můžeš použít wo nebo in dem.'),
  fill('Das Thema, über [das] wir gesprochen haben, ist wichtig.', 'Téma, o kterém jsme mluvili, je důležité.', 'sprechen über + 4. pád, stř. → über das.'),
  choice('Die Freunde, mit ___ ich in den Urlaub fahre, kommen aus Brno.', ['denen', 'den', 'die'], 0, 'Přátelé, se kterými jedu na dovolenou, jsou z Brna.', 'mit + 3. pád mn. č. → denen.'),
  choice('Das ist der Nachbar, ___ Hund immer bellt.', ['der', 'dessen', 'dem'], 1, 'To je soused, jehož pes pořád štěká.', 'Čí pes? → 2. pád → dessen.'),
  choice('Das Beste, ___ du machen kannst, ist schlafen.', ['das', 'was', 'dass'], 1, 'To nejlepší, co můžeš udělat, je spát.', 'Po zpodstatnělém superlativu (das Beste) → was.'),
  order('Das ist die Kollegin, mit der ich oft Mittag esse.', 'To je kolegyně, se kterou často obědvám.', 'Předložka mit stojí před vztažným zájmenem der.'),
  sent('Firma, pro kterou pracuju, má kanceláře v pěti zemích.', ['Die Firma, für die ich arbeite, hat Büros in fünf Ländern.'], 'für + 4. pád ž. → für die; vztažná věta mezi čárkami uprostřed.', { chips: ['für die'] }),
  sent('To je kamarád, se kterým jsem byl loni v Itálii.', ['Das ist der Freund, mit dem ich letztes Jahr in Italien war.', 'Das ist der Freund, mit dem ich im letzten Jahr in Italien war.'], 'mit + 3. pád m. → mit dem; war na konci.', { chips: ['mit dem'] }),
  sent('Všechno, co potřebuješ, najdeš v kuchyni.', ['Alles, was du brauchst, findest du in der Küche.'], 'alles → was; vztažná věta na začátku spolu s alles = 1. místo → findest du.', { chips: ['alles, was'] })
]));

// ---------- D24: zájmena 3./4. pád ----------
sets.push(set({ id: 'pron-dat-akk', group: 'pokr', title: 'Zájmena: mir, mich, ihm, ihn …', tag: 'Zájmena: 3./4. pád',
  desc: 'Osobní zájmena v pádech a jejich pořadí.',
  rule: '3. pád: mir, dir, ihm, ihr, ihm, uns, euch, ihnen, Ihnen. 4. pád: mich, dich, ihn, sie, es, uns, euch, sie, Sie. Pořadí: dvě podstatná jména → 3. pád před 4.; zájmeno + podstatné jméno → zájmeno první; dvě zájmena → 4. pád před 3. (Ich gebe es ihm.)' }, [
  fill('Kannst du [mir] (mně) helfen?', 'Můžeš mi pomoct?', 'helfen + 3. pád → mir.', { traps: { mich: 'helfen vyžaduje 3. pád (komu?) → mir.' } }),
  fill('Ich rufe [dich] (tě) morgen an.', 'Zítra ti zavolám.', 'anrufen + 4. pád → dich. Pozor: česky „zavolat KOMU“, německy 4. pád.', { traps: { dir: 'anrufen má 4. pád: jemanden anrufen → dich (i když česky „ti zavolám“).' } }),
  fill('Ich sehe [ihn] (ho) jeden Tag im Bus.', 'Vidím ho každý den v autobuse.', 'sehen + 4. pád, m. → ihn.', { traps: { ihm: 'ihm je 3. pád (jemu). Vidím ho (koho?) → 4. pád ihn.' } }),
  fill('Ich gebe [ihm] (mu) das Buch.', 'Dám mu tu knihu.', 'geben + komu (3. pád) → ihm.'),
  fill('Das Kleid gefällt [ihr] (jí) sehr.', 'Ty šaty se jí moc líbí.', 'gefallen + 3. pád; sie → ihr.'),
  fill('Ich danke [Ihnen] (Vám) für Ihre Hilfe.', 'Děkuji Vám za pomoc.', 'danken + 3. pád; vykání → Ihnen.'),
  fill('Kennst du meine Eltern? – Ja, ich kenne [sie] (je).', 'Znáš moje rodiče? – Ano, znám je.', '4. pád mn. č. → sie.'),
  fill('Wir haben [euch] (vás) gestern gesehen.', 'Včera jsme vás viděli.', 'ihr → euch (3. i 4. pád stejně).'),
  fill('Hast du das Paket? – Ja, ich gebe [es ihm] (ho jemu) morgen.', 'Máš ten balík? – Ano, dám mu ho zítra.', 'Dvě zájmena: 4. pád (es) před 3. pádem (ihm).', { traps: { 'ihm es': 'Dvě zájmena → nejdřív 4. pád, pak 3.: es ihm.' } }),
  fill('Ich schenke [meiner Mutter] (mamince) Blumen.', 'Daruju mamince květiny.', 'Dvě podstatná jména: 3. pád (meiner Mutter) před 4. (Blumen).'),
  choice('Ich zeige ___.', ['ihm die Wohnung', 'die Wohnung ihm'], 0, 'Ukážu mu byt.', 'Zájmeno (ihm) před podstatným jménem.'),
  choice('Die Wohnung? Ich zeige ___ morgen.', ['ihm sie', 'sie ihm'], 1, 'Ten byt? Ukážu mu ho zítra.', 'Dvě zájmena → 4. pád (sie) před 3. pádem (ihm).'),
  choice('Wie geht es ___? – Danke, gut.', ['dich', 'dir', 'du'], 1, 'Jak se máš? – Díky, dobře.', 'es geht + 3. pád → dir.'),
  choice('Ich habe ___ eine E-Mail geschrieben.', ['ihn', 'ihm', 'er'], 1, 'Napsal jsem mu e-mail.', 'Komu? → 3. pád ihm.'),
  sent('Můžeš mi to vysvětlit?', ['Kannst du mir das erklären?', 'Kannst du es mir erklären?', 'Könntest du mir das erklären?', 'Könntest du es mir erklären?'], 'mir (3. pád) + das; s es: es mir (dvě zájmena → 4. před 3.).', { chips: ['erklären'] }),
  sent('Zavolám mu hned, jak budu doma.', ['Ich rufe ihn an, sobald ich zu Hause bin.', 'Ich rufe ihn an, wenn ich zu Hause bin.', 'Ich werde ihn anrufen, sobald ich zu Hause bin.', 'Ich rufe ihn sofort an, wenn ich zu Hause bin.', 'Ich rufe ihn gleich an, wenn ich zu Hause bin.'], 'anrufen + 4. pád → ihn (ne ihm!). sobald = jakmile.', { chips: ['anrufen', 'sobald'] }),
  sent('Ty boty jsou moc drahé, nekoupím si je.', ['Die Schuhe sind zu teuer, ich kaufe sie mir nicht.', 'Die Schuhe sind sehr teuer, ich kaufe sie mir nicht.', 'Die Schuhe sind zu teuer, ich kaufe sie nicht.', 'Die Schuhe sind sehr teuer, ich kaufe sie nicht.'], 'sie (4. pád mn. č.) před mir (3. pád).', { chips: ['sich kaufen'] })
]));

// ---------- D25: slovesa s 3. pádem ----------
sets.push(set({ id: 'verb-dat', group: 'slovesa', title: 'Slovesa s 3. pádem', tag: 'Slovesa s 3. pádem',
  desc: 'helfen, danken, gefallen, gehören, passen, schmecken …',
  rule: 'Některá slovesa mají předmět ve 3. pádě, i když česky ne: helfen (pomoct komu), danken (děkovat komu), gratulieren, antworten, glauben (věřit komu), folgen, zuhören, gefallen (líbit se), gehören (patřit), passen (hodit se, padnout), schmecken, stehen (slušet), fehlen (chybět), weh tun, es geht mir … Pozor: fragen, anrufen, bitten, besuchen mají 4. pád!' }, [
  fill('Ich helfe [dem] Kollegen.', 'Pomáhám kolegovi.', 'helfen + 3. pád: dem Kollegen.', { traps: { den: 'helfen vyžaduje 3. pád → dem Kollegen.' } }),
  fill('Das Auto gehört [meinem] (můj) Bruder.', 'To auto patří mému bratrovi.', 'gehören + 3. pád: meinem Bruder.'),
  fill('Die Jacke passt [mir] nicht.', 'Ta bunda mi nepadne.', 'passen + 3. pád.'),
  fill('Hat [dir] das Essen geschmeckt?', 'Chutnalo ti jídlo?', 'schmecken + 3. pád.'),
  fill('Ich danke [dir] für das Geschenk.', 'Děkuju ti za dárek.', 'danken + 3. pád + für.'),
  fill('Wir gratulieren [unserer] (naší) Lehrerin.', 'Blahopřejeme naší učitelce.', 'gratulieren + 3. pád, ž. → unserer.'),
  fill('Ich frage [den] Lehrer.', 'Ptám se učitele.', 'fragen má 4. pád → den Lehrer.', { traps: { dem: 'fragen je výjimka: 4. pád (jemanden fragen) → den Lehrer.' } }),
  fill('Ich glaube [dir] kein Wort.', 'Nevěřím ti ani slovo.', 'glauben + komu → 3. pád dir.'),
  fill('Die rote Farbe steht [dir] gut.', 'Červená ti sluší.', 'stehen = slušet + 3. pád.'),
  fill('Mein Rücken tut [mir] weh.', 'Bolí mě záda.', 'weh tun + 3. pád: mir tut … weh. Česky „bolí MĚ“, německy mir.', { traps: { mich: 'weh tun má 3. pád: Der Kopf tut mir weh.' } }),
  fill('Kannst du [mir] bitte zuhören?', 'Můžeš mě prosím poslouchat?', 'zuhören + 3. pád (česky „poslouchat KOHO“).'),
  fill('Ich besuche [meine] (moji) Oma.', 'Navštěvuju babičku.', 'besuchen má 4. pád → meine Oma.'),
  choice('Wem gehört dieser Schlüssel? – ___.', ['Mich', 'Mir', 'Ich'], 1, 'Komu patří tenhle klíč? – Mně.', 'gehören + 3. pád → mir.'),
  choice('Der Film hat ___ nicht gefallen.', ['uns', 'wir'], 0, 'Film se nám nelíbil.', 'gefallen + 3. pád → uns.'),
  choice('Ich rufe ___ heute Abend an.', ['dir', 'dich'], 1, 'Zavolám ti dnes večer.', 'anrufen + 4. pád → dich.'),
  choice('Kannst du ___ bitte antworten?', ['ihn', 'ihm'], 1, 'Můžeš mu prosím odpovědět?', 'antworten + 3. pád → ihm.'),
  sent('Ta polévka mi vůbec nechutná.', ['Die Suppe schmeckt mir gar nicht.', 'Die Suppe schmeckt mir überhaupt nicht.'], 'schmecken + 3. pád (mir).', { chips: ['schmecken'] }),
  sent('Můžu vám nějak pomoct?', ['Kann ich Ihnen irgendwie helfen?', 'Kann ich Ihnen helfen?', 'Kann ich euch irgendwie helfen?', 'Kann ich euch helfen?'], 'helfen + 3. pád → Ihnen (vykání) / euch.', { chips: ['helfen'] }),
  sent('Patří ta taška tvé sestře?', ['Gehört die Tasche deiner Schwester?', 'Gehört diese Tasche deiner Schwester?'], 'gehören + 3. pád ž. → deiner Schwester.', { chips: ['gehören'] })
]));

// ---------- D26: n-deklinace ----------
sets.push(set({ id: 'n-dekl', group: 'dekl', title: 'n-deklinace: der Kollege → den Kollegen', tag: 'n-deklinace',
  desc: 'Slabá podstatná jména s -n ve všech pádech kromě 1.',
  rule: 'Slabá podstatná jména (n-deklinace) jsou mužského rodu a mají koncovku -n / -en ve všech pádech kromě 1. pádu jednotného čísla: der Kollege – den/dem/des Kollegen. Patří sem: na -e pro osoby a zvířata (Kollege, Kunde, Junge, Neffe, Löwe), cizí slova na -ent, -ant, -ist, -at, -oge (Student, Praktikant, Polizist, Kandidat, Biologe) a několik dalších: Herr (den Herrn), Mensch, Nachbar, Bauer, Bär, Name (des Namens).' }, [
  fill('Ich frage den [Kollegen] (Kollege).', 'Zeptám se kolegy.', '4. pád n-deklinace → Kollegen.', { traps: { kollege: 'Kollege je slabé podstatné jméno: mimo 1. pád vždy -n → den Kollegen.' } }),
  fill('Ich helfe dem [Studenten] (Student).', 'Pomáhám studentovi.', '3. pád → Studenten.', { traps: { student: 'Student patří do n-deklinace: dem Studenten.' } }),
  fill('Kennst du den neuen [Praktikanten] (Praktikant)?', 'Znáš nového praktikanta?', '4. pád → Praktikanten.'),
  fill('Sehr geehrter [Herr] Novák, …', 'Vážený pane Nováku, …', '1. pád (oslovení) → Herr bez koncovky.'),
  fill('Ich habe [Herrn] (Herr) Novák eine E-Mail geschrieben.', 'Napsal jsem panu Novákovi e-mail.', 'Herr má v ostatních pádech -n: Herrn.'),
  fill('Der Hund des [Nachbarn] (Nachbar) bellt.', 'Sousedův pes štěká.', '2. pád n-deklinace → des Nachbarn (bez -s!).', { traps: { nachbars: 'Slabá podstatná jména nemají ve 2. pádě -s, jen -n: des Nachbarn.' } }),
  fill('Die Polizei hat mit dem [Zeugen] (Zeuge) gesprochen.', 'Policie mluvila se svědkem.', 'Zeuge → dem Zeugen.'),
  fill('Wir brauchen einen [Fotografen] (Fotograf) für die Hochzeit.', 'Na svatbu potřebujeme fotografa.', 'Fotograf → einen Fotografen.'),
  fill('Der Kunde ist König, also frag den [Kunden] (Kunde)!', 'Zákazník je král, tak se zeptej zákazníka!', '1. pád der Kunde × 4. pád den Kunden.'),
  fill('Jeder [Mensch] braucht Freunde.', 'Každý člověk potřebuje přátele.', '1. pád → Mensch bez koncovky.', { traps: { menschen: 'V 1. pádě (podmět) je Mensch bez koncovky.' } }),
  fill('Ich vertraue diesem [Menschen] (Mensch).', 'Tomu člověku věřím.', '3. pád → Menschen.'),
  fill('Wie ist der Name des [Patienten] (Patient)?', 'Jak se jmenuje pacient?', '2. pád → Patienten.'),
  choice('Ich habe gestern mit ___ gesprochen.', ['dem Polizist', 'dem Polizisten', 'den Polizist'], 1, 'Včera jsem mluvil s policistou.', 'mit + 3. pád; n-deklinace → dem Polizisten.'),
  choice('Das ist das Auto ___.', ['des Kollegen', 'des Kolleges', 'dem Kollege'], 0, 'To je kolegovo auto.', '2. pád n-deklinace: -n, ne -s.'),
  choice('Wie heißt ___ Junge dort?', ['der', 'den'], 0, 'Jak se jmenuje ten kluk tamhle?', 'Podmět → 1. pád der Junge.'),
  sent('Musím zavolat zákazníkovi a pak napsat panu Müllerovi.', ['Ich muss den Kunden anrufen und dann Herrn Müller schreiben.', 'Ich muss den Kunden anrufen und danach Herrn Müller schreiben.', 'Ich muss den Kunden anrufen und dann Herrn Müller eine E-Mail schreiben.'], 'anrufen + 4. pád → den Kunden; schreiben + 3. pád → Herrn Müller.', { chips: ['der Kunde', 'der Herr'] }),
  sent('Zeptej se toho studenta, jestli zná cestu.', ['Frag den Studenten, ob er den Weg kennt.'], 'fragen + 4. pád → den Studenten; ob + sloveso na konci.', { chips: ['der Student', 'ob'] })
]));

sets.push(set({ id: 'veta-w4', group: 'preklad', title: 'Překlad vět: týden 4', tag: 'Překlad vět', n: 6,
  desc: 'Souvětí se vztažnými větami a zájmeny.',
  rule: 'Kontroluj u vztažného zájmena rod (podle podstatného jména) a pád (podle role ve vztažné větě). U sloves helfen, danken, gefallen, gehören, schmecken je 3. pád.' }, [
  sent('Žena, se kterou jsem mluvil na nádraží, mi pomohla najít správné nástupiště.', ['Die Frau, mit der ich am Bahnhof gesprochen habe, hat mir geholfen, das richtige Gleis zu finden.', 'Die Frau, mit der ich am Bahnhof gesprochen habe, half mir, das richtige Gleis zu finden.', 'Die Frau, mit der ich am Bahnhof sprach, hat mir geholfen, das richtige Gleis zu finden.', 'Die Frau, mit der ich am Bahnhof gesprochen habe, hat mir geholfen, den richtigen Bahnsteig zu finden.'], 'mit der (3. pád ž.); helfen + mir; zu finden na konci.', { chips: ['mit der', 'das Gleis'] }),
  sent('Byt, který jsme si prohlédli včera, se mi líbil víc než ten první.', ['Die Wohnung, die wir gestern besichtigt haben, hat mir besser gefallen als die erste.', 'Die Wohnung, die wir uns gestern angesehen haben, hat mir besser gefallen als die erste.', 'Die Wohnung, die wir gestern angeschaut haben, hat mir besser gefallen als die erste.', 'Die Wohnung, die wir uns gestern angeschaut haben, hat mir besser gefallen als die erste.', 'Die Wohnung, die wir gestern besichtigt haben, gefiel mir besser als die erste.'], 'die Wohnung (ž.) → die; gefallen + mir; besser als.', { chips: ['besichtigen', 'gefallen'] }),
  sent('Děkuju ti za všechno, co jsi pro mě udělal, když jsem byl nemocný.', ['Ich danke dir für alles, was du für mich getan hast, als ich krank war.', 'Danke für alles, was du für mich getan hast, als ich krank war.', 'Ich danke dir für alles, was du für mich gemacht hast, als ich krank war.', 'Danke für alles, was du für mich gemacht hast, als ich krank war.'], 'danken + 3. pád; alles, was …; als (jednou v minulosti).', { chips: ['danken', 'alles, was', 'als'] }),
  sent('Kolega, jehož žena pracuje v nemocnici, mi doporučil dobrého zubaře.', ['Der Kollege, dessen Frau im Krankenhaus arbeitet, hat mir einen guten Zahnarzt empfohlen.', 'Der Kollege, dessen Frau im Krankenhaus arbeitet, empfahl mir einen guten Zahnarzt.'], 'dessen (2. pád m.); empfehlen + 3. pád + 4. pád.', { chips: ['dessen', 'empfehlen'] }),
  sent('Ten dort je soused, kterému patří to červené auto před naším domem.', ['Das dort ist der Nachbar, dem das rote Auto vor unserem Haus gehört.', 'Der dort ist der Nachbar, dem das rote Auto vor unserem Haus gehört.', 'Das ist der Nachbar, dem das rote Auto vor unserem Haus gehört.'], 'gehören + 3. pád → dem; vor + 3. pád (kde?) → vor unserem Haus.', { chips: ['dem', 'gehören'] }),
  sent('Lidé, kterým jsem ukázal fotky, nevěřili, že jsem byl na vrcholu.', ['Die Leute, denen ich die Fotos gezeigt habe, haben nicht geglaubt, dass ich auf dem Gipfel war.', 'Die Leute, denen ich die Fotos gezeigt habe, glaubten nicht, dass ich auf dem Gipfel war.', 'Die Leute, denen ich die Fotos gezeigt habe, haben mir nicht geglaubt, dass ich auf dem Gipfel war.', 'Die Leute, denen ich die Bilder gezeigt habe, haben nicht geglaubt, dass ich auf dem Gipfel war.'], 'denen (3. pád mn. č.); dass … war.', { chips: ['denen', 'der Gipfel'] })
]));

sets.push(set({ id: 'ctest-9', group: 'cteni', title: 'C-Test: Ein Abend mit Freunden', n: 1, all: true, kindLabel: 'C-Test', tag: 'C-Test' }, [{
  id: 'ct-w4', kind: 'ctest', title: 'C-Test: Ein Abend mit Freunden', tag: 'C-Test', gaps: 20,
  short: 'Správně doplněné slovo je celé v textu výše.',
  text: 'Letzten Freitag habe ich Freunde eingeladen, {{d|ie|Vztažné zájmeno|mn. č., 4. pád}} ich seit der Schule kenne. Mein {{Freu|nd||}} Tomáš, dessen {{Fr|au||}} aus Österreich kommt, hat einen {{Kuc|hen||}} mitgebracht. Der Kuchen hat {{al|len|Člen|3. pád mn. č.}} sehr gut geschmeckt. Später {{ka|m|Präteritum|kommen}} auch Petra, mit {{d|er|Vztažné zájmeno|3. pád ž.}} ich früher Tennis gespielt {{ha|be||}}. Sie hat uns von {{ih|rer|Přivlastňovací|3. pád ž.}} Reise nach Kanada erzählt. {{All|es||}}, was sie gesehen hat, {{kl|ang||}} sehr spannend. Ich habe {{i|hr|Zájmeno|3. pád}} geglaubt, obwohl manche {{Gesch|ichten||}} unglaublich waren. Um Mitternacht {{wo|llten|Präteritum|modální sloveso}} die ersten Gäste nach {{Hau|se||}} gehen. Ich habe {{ih|nen|Zájmeno|3. pád mn. č.}} für den schönen {{Ab|end||}} gedankt. Es war ein Abend, {{d|en|Vztažné zájmeno|4. pád m.}} ich nicht vergessen werde.',
  tr: 'Minulý pátek jsem pozval přátele, které znám od školy. Můj kamarád Tomáš, jehož žena je z Rakouska, přinesl koláč. Koláč všem moc chutnal. Později přišla i Petra, se kterou jsem dřív hrál tenis. Vyprávěla nám o své cestě do Kanady. Všechno, co viděla, znělo velmi napínavě. Věřil jsem jí, i když některé historky byly neuvěřitelné. O půlnoci chtěli první hosté jít domů. Poděkoval jsem jim za krásný večer. Byl to večer, na který nezapomenu.'
}]));

const p9 = { title: 'Forum: Wer kann mir helfen?', text: 'Hallo zusammen,\n\nich bin vor einem Monat nach Graz gezogen und suche jemanden, der mir beim Deutschlernen hilft. Ich spreche Tschechisch und Englisch und könnte dafür Tschechisch unterrichten. Am liebsten würde ich mich zweimal pro Woche treffen, aber nicht am Wochenende, weil ich da in einem Café arbeite. Ein Kollege, dem ich davon erzählt habe, meinte, dass die Stadtbibliothek einen Raum hat, den man kostenlos nutzen kann. Das wäre ideal, denn in meiner Wohnung ist es zu laut.\n\nLiebe Grüße\nMarek', tr: 'Ahoj všichni,\n\npřed měsícem jsem se přestěhoval do Grazu a hledám někoho, kdo mi pomůže s učením němčiny. Mluvím česky a anglicky a mohl bych za to učit češtinu. Nejradši bych se scházel dvakrát týdně, ale ne o víkendu, protože tehdy pracuju v kavárně. Kolega, kterému jsem o tom vyprávěl, říkal, že městská knihovna má místnost, kterou lze používat zdarma. To by bylo ideální, protože v mém bytě je moc hluku.\n\nS pozdravem\nMarek' };
sets.push(set({ id: 'read-9', group: 'cteni', title: 'Čtení: Forum', n: 3, all: true, kindLabel: 'Čtení', tag: 'Čtení' }, [
  choice('Was bietet Marek an?', ['Er zahlt für den Unterricht.', 'Er unterrichtet dafür Tschechisch.', 'Er unterrichtet Englisch.'], 1, 'Co Marek nabízí?', 'könnte dafür Tschechisch unterrichten = výměnou učit češtinu. Angličtinou jen mluví.', { passage: p9, evidence: '„und könnte dafür Tschechisch unterrichten“', optTr: ['Platí za výuku.', 'Výměnou učí češtinu.', 'Učí angličtinu.'], tag: 'Čtení: záměna slov' }),
  choice('Wann kann Marek NICHT?', ['Unter der Woche', 'Am Wochenende', 'Abends'], 1, 'Kdy Marek NEMŮŽE?', '„aber nicht am Wochenende, weil ich da in einem Café arbeite“.', { passage: p9, evidence: '„aber nicht am Wochenende, weil ich da in einem Café arbeite“', optTr: ['Ve všední dny', 'O víkendu', 'Večer'], tag: 'Čtení: výjimka / negace' }),
  choice('Wo möchte er sich am liebsten treffen?', ['In seiner Wohnung', 'Im Café', 'In der Stadtbibliothek'], 2, 'Kde by se nejradši scházel?', 'Knihovna by byla ideální; byt je moc hlučný.', { passage: p9, evidence: '„die Stadtbibliothek einen Raum hat … Das wäre ideal“', optTr: ['Ve svém bytě', 'V kavárně', 'V městské knihovně'], tag: 'Čtení: výjimka / negace' })
]));

sets.push(set({ id: 'write-w4', group: 'cteni', title: 'Psaní: Lidé v mém životě', n: 1, all: true, kindLabel: 'Psaní', tag: 'Psaní' }, [
  write({ prompt: 'Beschreib drei Menschen, die für dich wichtig sind. Schreib 70–100 Wörter. Benutze mindestens vier Relativsätze (der/die/das, den, dem, denen, mit dem …) und zwei Verben mit Dativ (helfen, gefallen, danken …).',
    tr: 'Popiš tři lidi, kteří jsou pro tebe důležití. Napiš 70–100 slov. Použij aspoň čtyři vztažné věty (der/die/das, den, dem, denen, mit dem …) a dvě slovesa se 3. pádem (helfen, gefallen, danken …).',
    minWords: 70, words: ['der/die/das …, den …, dem …, mit dem …', 'helfen, gefallen, danken + Dativ'],
    check: [{ re: ',\\s*(mit |bei |von |für |an |auf |über |zu |in )?(der|die|das|den|dem|denen|dessen|deren)\\b', min: 4, label: '4 vztažné věty' }, { re: '\\b(helfe|hilft|geholfen|gefällt|gefallen|danke|dankt|gedankt|gehört|schmeckt|passt)\\b', min: 2, label: '2 slovesa se 3. pádem' }],
    model: 'Meine Schwester Klára ist ein Mensch, der immer Zeit für mich hat. Sie hilft mir, wenn ich Probleme habe. Mein bester Freund heißt Pavel. Er ist der Freund, mit dem ich jeden Sommer wandern gehe, und die Berge gefallen ihm genauso wie mir. Die dritte Person ist meine Oma, die in einem kleinen Dorf wohnt. Sie kocht Gerichte, die man nirgendwo sonst bekommt. Ich danke ihr für alles, was sie für mich getan hat. Das sind die Menschen, denen ich am meisten vertraue.' })
]));

vocabSets.push(vocab({ id: 'vocab-medien', topic: 'média a internet', title: 'Média a internet' }, [
  'die Nachricht, -en = zpráva', 'die Zeitung, -en = noviny', 'die Zeitschrift, -en = časopis', 'die Sendung, -en = pořad', 'der Bildschirm, -e = obrazovka',
  'das Netz, -e = síť', 'das Passwort, Passwörter = heslo', 'der Nutzer, - = uživatel', 'die Werbung = reklama', 'der Beitrag, Beiträge = příspěvek',
  'die Datei, -en = soubor', 'herunterladen (lud herunter, hat heruntergeladen) = stáhnout', 'hochladen (lud hoch, hat hochgeladen) = nahrát', 'speichern (speicherte, hat gespeichert) = uložit', 'löschen (löschte, hat gelöscht) = smazat',
  'teilen (teilte, hat geteilt) = sdílet', 'sich anmelden (meldete an, hat angemeldet) = přihlásit se', 'aktuell = aktuální', 'kostenlos = zdarma', 'online = online'
]));
vocabSets.push(vocab({ id: 'vocab-verkehr', topic: 'doprava a cestování', title: 'Doprava' }, [
  'der Verkehr = doprava, provoz', 'der Stau, -s = zácpa', 'die Ampel, -n = semafor', 'die Kreuzung, -en = křižovatka', 'die Haltestelle, -n = zastávka',
  'das Gleis, -e = kolej, nástupiště', 'die Verspätung, -en = zpoždění', 'die Fahrkarte, -n = jízdenka', 'der Anschluss, Anschlüsse = přípoj', 'der Führerschein, -e = řidičský průkaz',
  'die Tankstelle, -n = benzínka', 'der Parkplatz, Parkplätze = parkoviště', 'der Unfall, Unfälle = nehoda', 'umsteigen (stieg um, ist umgestiegen) = přestoupit', 'abbiegen (bog ab, ist abgebogen) = odbočit',
  'verpassen (verpasste, hat verpasst) = zmeškat', 'überholen (überholte, hat überholt) = předjet', 'pünktlich = včas', 'gesperrt = uzavřený', 'einfach = jednosměrný (jízdenka); jednoduchý'
]));
vocabSets.push(vocab({ id: 'vocab-umwelt', topic: 'příroda a životní prostředí', title: 'Příroda a životní prostředí' }, [
  'die Umwelt = životní prostředí', 'die Natur = příroda', 'das Klima = klima', 'die Energie, -n = energie', 'der Müll = odpad',
  'die Mülltrennung = třídění odpadu', 'die Verpackung, -en = obal', 'die Luft = vzduch', 'der Wald, Wälder = les', 'die Landschaft, -en = krajina',
  'das Gewitter, - = bouřka', 'die Hitze = vedro', 'die Temperatur, -en = teplota', 'schützen (schützte, hat geschützt) = chránit', 'sparen (sparte, hat gespart) = šetřit',
  'verschwenden (verschwendete, hat verschwendet) = plýtvat', 'wegwerfen (warf weg, hat weggeworfen) = vyhodit', 'umweltfreundlich = ekologický', 'nachhaltig = udržitelný', 'schädlich = škodlivý'
]));

const T = {};
T.r1 = theory(
  'Vztažná věta blíže popisuje podstatné jméno (česky „který“). Vztažné zájmeno vypadá skoro jako určitý člen.',
  ['tbl', ['pád', 'm.', 'ž.', 'stř.', 'mn. č.'], [['1.', 'der', 'die', 'das', 'die'], ['4.', 'den', 'die', 'das', 'die']]],
  ['h', 'Dva kroky'],
  '1) ROD a ČÍSLO: podle německého podstatného jména (die Wohnung → die, i když česky „byt, který“). 2) PÁD: podle role ve vztažné větě – je zájmeno podmět (kdo/co dělá?) → 1. pád; je předmět (koho/co?) → 4. pád.',
  ['ex', ['Der Mann, der dort steht, …', 'muž stojí → podmět → der'], ['Der Mann, den ich kenne, …', 'já znám muže → předmět → den']],
  ['tip', 'Sloveso jde na konec a před vztažnou větou je vždy čárka. Když je vztažná věta uprostřed, je ohraničená dvěma čárkami.']
);
T.r2 = theory(
  ['tbl', ['pád', 'm.', 'ž.', 'stř.', 'mn. č.'], [['1.', 'der', 'die', 'das', 'die'], ['2.', 'dessen', 'deren', 'dessen', 'deren'], ['3.', 'dem', 'der', 'dem', 'denen'], ['4.', 'den', 'die', 'das', 'die']]],
  'Pozor na tvary, které se od členu liší: dessen, deren, denen.',
  ['h', 'S předložkou'],
  'Předložka stojí před zájmenem a určuje jeho pád: die Freundin, mit der ich wohne (mit + 3.) · das Projekt, für das ich arbeite (für + 4.).',
  ['h', 'was a wo'],
  ['ex', ['Alles, was du willst.', 'po alles, etwas, nichts, vieles, das Beste → was'], ['Die Stadt, wo ich wohne.', 'místo → wo (nebo in der)']]
);
T.pr = theory(
  ['tbl', ['1. pád', '3. pád (komu)', '4. pád (koho)'], [['ich', 'mir', 'mich'], ['du', 'dir', 'dich'], ['er', 'ihm', 'ihn'], ['sie', 'ihr', 'sie'], ['es', 'ihm', 'es'], ['wir', 'uns', 'uns'], ['ihr', 'euch', 'euch'], ['sie / Sie', 'ihnen / Ihnen', 'sie / Sie']]],
  ['h', 'Pořadí předmětů'],
  ['ex', ['Ich gebe dem Kind den Ball.', 'dvě podstatná jména: 3. před 4.'], ['Ich gebe ihm den Ball.', 'zájmeno před podstatným jménem'], ['Ich gebe ihn dem Kind.', 'zájmeno před podstatným jménem'], ['Ich gebe ihn ihm.', 'dvě zájmena: 4. před 3.']],
  ['tip', 'ihm (jemu) × ihn (jeho/ho) × ihr (jí / vy). Nejčastější chyba: Ich rufe ihm an. Správně Ich rufe ihn an – anrufen má 4. pád.']
);
T.vd = theory(
  'Tyto slovesa mají předmět ve 3. pádě. Česky se často pojí s jiným pádem, proto je potřeba je umět nazpaměť.',
  ['tbl', ['sloveso', 'příklad', 'česky'], [['helfen', 'Ich helfe dir.', 'pomáhám ti'], ['danken', 'Ich danke Ihnen.', 'děkuji vám'], ['gefallen', 'Das gefällt mir.', 'to se mi líbí'], ['gehören', 'Das gehört mir.', 'to patří mně'], ['passen', 'Die Hose passt mir.', 'kalhoty mi padnou'], ['schmecken', 'Es schmeckt mir.', 'chutná mi to'], ['glauben', 'Ich glaube dir.', 'věřím ti'], ['antworten', 'Antworte mir!', 'odpověz mi'], ['zuhören', 'Hör mir zu!', 'poslouchej mě'], ['weh tun', 'Der Kopf tut mir weh.', 'bolí mě hlava'], ['gratulieren', 'Ich gratuliere dir.', 'blahopřeju ti']]],
  ['tip', 'Opačná past – 4. pád, i když česky jinak: fragen (ptát se KOHO), anrufen (zavolat KOMU), bitten (prosit KOHO), besuchen.']
);
T.nd = theory(
  'Malá skupina mužských podstatných jmen má ve všech pádech kromě 1. pádu j. č. koncovku -n / -en (a v mn. č. taky).',
  ['tbl', ['pád', 'der Kollege', 'der Student', 'der Herr'], [['1.', 'der Kollege', 'der Student', 'der Herr'], ['2.', 'des Kollegen', 'des Studenten', 'des Herrn'], ['3.', 'dem Kollegen', 'dem Studenten', 'dem Herrn'], ['4.', 'den Kollegen', 'den Studenten', 'den Herrn']]],
  ['h', 'Jak je poznat'],
  ['ex', ['-e (osoby a zvířata)', 'der Kollege, Kunde, Junge, Neffe, Zeuge, Löwe, Affe'], ['-ent, -ant, -ist, -at, -oge, -graf', 'der Student, Praktikant, Polizist, Kandidat, Biologe, Fotograf'], ['výjimky', 'der Herr, Mensch, Nachbar, Bauer, Bär, Held']],
  ['tip', 'Ve 2. pádě nemají -s: des Kollegen (ne des Kolleges). Výjimka: der Name → des Namens.']
);

const days = [
  { title: 'Vztažné věty: der, den, das, die', theory: T.r1, blocks: [['rel-1', 12, 'Vztažné věty 1./4. pád'], ['vocab-medien', 10, 'Slovíčka: média a internet'], ['__due', 12, 'Dnešní opakování']] },
  { title: 'Vztažné věty: dem, denen, dessen, mit dem', theory: T.r2, blocks: [['rel-2', 12, 'Vztažné věty 3./2. pád'], ['rel-1', 6, 'Opakování: der, den, das'], ['adj-mix', 8, 'Opakování: koncovky přídavných jmen']] },
  { title: 'Zájmena ve 3. a 4. pádě', theory: T.pr, blocks: [['pron-dat-akk', 12, 'mir, mich, ihm, ihn'], ['vocab-verkehr', 10, 'Slovíčka: doprava'], ['__due', 12, 'Dnešní opakování']] },
  { title: 'Slovesa s 3. pádem', theory: T.vd, blocks: [['verb-dat', 12, 'helfen, gefallen, gehören …'], ['konj2', 6, 'Opakování: Konjunktiv II'], ['compose-mix', 8, 'Opakování: celé fráze']] },
  { title: 'n-deklinace', theory: T.nd, blocks: [['n-dekl', 12, 'der Kollege → den Kollegen'], ['vocab-umwelt', 10, 'Slovíčka: příroda'], ['__due', 12, 'Dnešní opakování']] },
  { title: 'Opakování týdne', blocks: [['w4-mix', 14, 'Mix týdne 4'], ['__weak', 12, 'Tvoje slabá místa'], ['vocab-w4', 12, 'Slovíčka týdne'], ['read-9', 3, 'Čtení: fórum']] },
  { title: 'Test týdne a delší věty', blocks: [['veta-w4', 6, 'Překlad delších vět'], ['ctest-9', 1, 'C-Test: Ein Abend mit Freunden'], ['write-w4', 1, 'Psaní: lidé v mém životě'], ['__wrong', 15, 'Opakování chyb']] }
];
sets.push(set({ id: 'w4-mix', group: 'pokr', title: 'Mix: týden 4', n: 14, refs: ['rel-1', 'rel-2', 'pron-dat-akk', 'verb-dat', 'n-dekl'] }));
sets.push(set({ id: 'vocab-w4', group: 'slov', title: 'Slovíčka: týden 4', n: 12, refs: ['vocab-medien', 'vocab-verkehr', 'vocab-umwelt'] }));

module.exports = { week: 4, title: 'Vztažné věty a zájmena', desc: 'který, kterému, jehož – a kdy je 3. pád.', sets, vocabSets, days };
