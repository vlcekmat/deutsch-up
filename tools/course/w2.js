'use strict';
const { fill, choice, order, sent, write, theory, set, vocab } = require('./lib');

const sets = [];
const vocabSets = [];

// ---------- D8: sloveso na 2. místě ----------
sets.push(set({ id: 'wo-v2', group: 'veta', title: 'Sloveso na 2. místě', tag: 'Slovosled: sloveso na 2. místě',
  desc: 'Oznamovací věta, inverze, otázky, pořadí čas – způsob – místo.',
  rule: 'V oznamovací větě stojí časované sloveso vždy na 2. místě. Když větu začneš něčím jiným než podmětem (čas, místo, předmět), podmět jde až za sloveso (inverze). Druhá část slovesa (infinitiv, příčestí, odlučitelná předpona) jde na konec.' }, [
  order('Heute gehe ich ins Kino.', 'Dnes jdu do kina.', 'Heute je na 1. místě, sloveso gehe na 2., podmět ich až za ním.'),
  order('Am Wochenende besuchen wir unsere Großeltern.', 'O víkendu navštívíme prarodiče.', 'Am Wochenende zabírá celé 1. místo, proto hned následuje sloveso besuchen.'),
  order('Morgen muss ich früh aufstehen.', 'Zítra musím brzy vstávat.', 'Modální sloveso muss je na 2. místě, infinitiv aufstehen na konci.'),
  order('Gestern habe ich meinen Bruder angerufen.', 'Včera jsem volal bratrovi.', 'Pomocné sloveso habe na 2. místě, příčestí angerufen na konci (větný rámec).'),
  order('Um acht Uhr fängt der Kurs an.', 'V osm hodin začíná kurz.', 'Odlučitelné sloveso: fängt na 2. místě, předpona an na úplném konci.'),
  order('Den Film habe ich schon gesehen.', 'Ten film jsem už viděl.', 'Na 1. místě může být i předmět (den Film). Sloveso pořád na 2. místě.'),
  order('Wann kommst du nach Hause?', 'Kdy přijdeš domů?', 'Otázka s tázacím slovem: tázací slovo na 1. místě, sloveso na 2.'),
  order('Kommst du heute Abend mit?', 'Půjdeš dnes večer s námi?', 'Otázka bez tázacího slova (ano/ne): sloveso na 1. místě.'),
  order('Ich fahre morgen mit dem Zug nach Berlin.', 'Zítra jedu vlakem do Berlína.', 'Pořadí doplňků: kdy (morgen) – jak (mit dem Zug) – kam (nach Berlin). Pomůcka TeKaMoLo: temporal – kausal – modal – lokal.'),
  order('Wir sind gestern wegen des Regens zu Hause geblieben.', 'Včera jsme kvůli dešti zůstali doma.', 'TeKaMoLo: gestern (kdy) – wegen des Regens (proč) – zu Hause (kde). Příčestí geblieben na konci.'),
  choice('Heute ___ ins Büro.', ['ich fahre', 'fahre ich'], 1, 'Dnes jedu do kanceláře.', 'Heute je na 1. místě → sloveso na 2. místě → podmět za slovesem: Heute fahre ich.', { optTr: ['já jedu', 'jedu já'], traps: {} }),
  choice('Am Montag ___ einen Termin beim Arzt.', ['habe ich', 'ich habe', 'ich hatte habe'], 0, 'V pondělí mám termín u lékaře.', 'Časový údaj na začátku → inverze: Am Montag habe ich …'),
  choice('Welche Reihenfolge stimmt?', ['Ich fahre nach Prag morgen mit dem Bus.', 'Ich fahre morgen mit dem Bus nach Prag.', 'Ich fahre mit dem Bus nach Prag morgen.'], 1, 'Zítra jedu autobusem do Prahy.', 'Čas – způsob – místo: morgen – mit dem Bus – nach Prag.'),
  choice('Seit drei Jahren ___ in Brno.', ['er wohnt', 'wohnt er'], 1, 'Tři roky bydlí v Brně.', 'Seit drei Jahren na 1. místě → wohnt er.'),
  fill('Leider [kann] (können) ich heute nicht kommen.', 'Bohužel dnes nemůžu přijít.', 'Leider na 1. místě, časované kann na 2., infinitiv kommen na konci.'),
  fill('Nach dem Kurs [gehen] (gehen) wir oft in ein Café.', 'Po kurzu často chodíme do kavárny.', 'Nach dem Kurs je celé 1. místo, proto gehen wir.'),
  sent('Dnes večer se dívám na film.', ['Heute Abend sehe ich einen Film.', 'Heute Abend schaue ich einen Film.', 'Ich sehe heute Abend einen Film.', 'Ich schaue heute Abend einen Film.', 'Heute Abend schaue ich mir einen Film an.', 'Ich schaue mir heute Abend einen Film an.'], 'Začneš-li časem (Heute Abend), sloveso je na 2. místě a ich až za ním.', { chips: ['heute Abend', 'sehen'] }),
  sent('V sobotu jsme byli s dětmi v zoo.', ['Am Samstag waren wir mit den Kindern im Zoo.', 'Wir waren am Samstag mit den Kindern im Zoo.'], 'Am Samstag (1. místo) – waren (2. místo) – wir. TeKaMoLo: kdy – s kým – kde.', { chips: ['am Samstag', 'der Zoo'] }),
  sent('Zítra ráno musím jet autem do práce.', ['Morgen früh muss ich mit dem Auto zur Arbeit fahren.', 'Ich muss morgen früh mit dem Auto zur Arbeit fahren.', 'Morgen früh muss ich mit dem Auto in die Arbeit fahren.'], 'muss na 2. místě, fahren na konci; mezi tím čas – způsob – místo.', { chips: ['morgen früh', 'zur Arbeit'] })
]));

// ---------- D9: spojky v hlavních větách ----------
sets.push(set({ id: 'konj-adv', group: 'veta', title: 'und, aber, denn × deshalb, trotzdem', tag: 'Spojky: hlavní věty',
  desc: 'Spojky na „nultém“ místě a spojovací příslovce s inverzí.',
  rule: 'und, aber, oder, denn, sondern stojí na „nultém“ místě: za nimi normální pořadí (podmět – sloveso). deshalb, deswegen, darum, trotzdem, dann, danach, sonst, außerdem zabírají 1. místo: hned za nimi je sloveso (inverze).' }, [
  fill('Ich bin müde, [aber] (ale) ich muss noch arbeiten.', 'Jsem unavený, ale ještě musím pracovat.', 'aber = ale; za ním normální pořadí ich muss.'),
  fill('Ich bleibe zu Hause, [denn] (protože) ich bin krank.', 'Zůstanu doma, protože jsem nemocný.', 'denn = protože, ale nemění slovosled: denn ich bin krank (sloveso NE na konci).', { traps: { weil: 'weil taky znamená protože, ale po weil musí být sloveso na konci (weil ich krank bin). Tady je pořadí ich bin, proto denn.' } }),
  fill('Das ist kein Tee, [sondern] (nýbrž, ale) Kaffee.', 'To není čaj, ale káva.', 'sondern = nýbrž: opravuje předchozí zápor (kein/nicht …, sondern …).', { traps: { aber: 'aber = ale (a přesto). Po záporu, když opravuješ informaci (ne A, ale B), je sondern.' } }),
  fill('Es regnet, [deshalb|deswegen|darum] (proto) nehme ich den Bus.', 'Prší, proto jedu autobusem.', 'deshalb = proto; stojí na 1. místě, takže hned za ním je sloveso: deshalb nehme ich.'),
  fill('Ich war krank, [trotzdem] (přesto) bin ich zur Arbeit gegangen.', 'Byl jsem nemocný, přesto jsem šel do práce.', 'trotzdem = přesto; po něm inverze: trotzdem bin ich …'),
  fill('Zuerst frühstücke ich, [dann|danach] (potom) gehe ich zur Arbeit.', 'Nejdřív posnídám, potom jdu do práce.', 'dann = potom; na 1. místě, za ním sloveso gehe.'),
  fill('Beeil dich, [sonst] (jinak) verpassen wir den Zug.', 'Pospěš si, jinak nám ujede vlak.', 'sonst = jinak; za ním inverze verpassen wir.'),
  choice('Ich habe keine Zeit, deshalb ___ nicht mit.', ['ich komme', 'komme ich'], 1, 'Nemám čas, proto nejdu s vámi.', 'deshalb zabírá 1. místo → sloveso komme hned za ním, podmět ich až potom.'),
  choice('Ich lerne Deutsch, denn ___ in Österreich arbeiten.', ['ich möchte', 'möchte ich'], 0, 'Učím se německy, protože chci pracovat v Rakousku.', 'denn je na nultém místě → normální pořadí ich möchte.'),
  choice('Er spricht nicht nur Englisch, ___ auch Spanisch.', ['aber', 'sondern', 'denn'], 1, 'Mluví nejen anglicky, ale i španělsky.', 'nicht nur …, sondern auch = nejen …, ale i.'),
  choice('Die Wohnung ist schön, ___ sie ist zu teuer.', ['aber', 'sondern', 'deshalb'], 0, 'Byt je hezký, ale je moc drahý.', 'Protiklad bez opravy záporu → aber.'),
  choice('Das Wetter war schlecht, ___ sind wir spazieren gegangen.', ['trotzdem', 'deshalb', 'denn'], 0, 'Počasí bylo špatné, přesto jsme šli na procházku.', 'Proti očekávání = trotzdem (přesto). deshalb by znamenalo „proto“.'),
  order('Ich habe Hunger, deshalb koche ich jetzt.', 'Mám hlad, proto teď vařím.', 'deshalb – sloveso – podmět: deshalb koche ich.'),
  order('Sie ist krank, trotzdem geht sie ins Büro.', 'Je nemocná, přesto jde do kanceláře.', 'trotzdem – geht – sie.'),
  order('Wir gehen nicht ins Kino, sondern wir bleiben zu Hause.', 'Nejdeme do kina, ale zůstaneme doma.', 'sondern na nultém místě: sondern wir bleiben.'),
  sent('Nemám auto, proto jezdím do práce na kole.', ['Ich habe kein Auto, deshalb fahre ich mit dem Fahrrad zur Arbeit.', 'Ich habe kein Auto, deswegen fahre ich mit dem Fahrrad zur Arbeit.', 'Ich habe kein Auto, darum fahre ich mit dem Fahrrad zur Arbeit.', 'Ich habe kein Auto, deshalb fahre ich mit dem Rad zur Arbeit.'], 'deshalb + inverze: deshalb fahre ich. kein Auto (ne nicht ein Auto).', { chips: ['deshalb', 'das Fahrrad'] }),
  sent('Chtěl jsem zavolat, ale neměl jsem tvoje číslo.', ['Ich wollte anrufen, aber ich hatte deine Nummer nicht.', 'Ich wollte dich anrufen, aber ich hatte deine Nummer nicht.', 'Ich wollte anrufen, aber ich hatte deine Telefonnummer nicht.', 'Ich wollte dich anrufen, aber ich hatte deine Telefonnummer nicht.'], 'aber nemění pořadí: aber ich hatte … nicht. Zápor nicht stojí na konci věty.', { chips: ['wollen (Prät.)', 'aber'] }),
  sent('Byl unavený, přesto pracoval až do půlnoci.', ['Er war müde, trotzdem hat er bis Mitternacht gearbeitet.', 'Er war müde, trotzdem arbeitete er bis Mitternacht.'], 'trotzdem zabírá 1. místo → hat er / arbeitete er.', { chips: ['trotzdem', 'die Mitternacht'] })
]));

// ---------- D10: vedlejší věty weil, dass, ob, wenn ----------
sets.push(set({ id: 'nebensatz-1', group: 'veta', title: 'Vedlejší věty: weil, dass, ob, wenn', tag: 'Slovosled: vedlejší věta',
  desc: 'Sloveso na konci vedlejší věty.',
  rule: 'Ve vedlejší větě (po weil, dass, ob, wenn, als, obwohl …) stojí časované sloveso na úplném konci. Odlučitelné sloveso se pak píše dohromady (weil er früh aufsteht). Vedlejší věta se vždy odděluje čárkou. Když vedlejší věta stojí na začátku, celá zabírá 1. místo a hlavní věta začíná slovesem (Weil ich krank bin, bleibe ich zu Hause).' }, [
  order('Ich bleibe zu Hause, weil ich krank bin.', 'Zůstanu doma, protože jsem nemocný.', 'weil → sloveso bin na konec.'),
  order('Ich glaube, dass er morgen kommt.', 'Myslím, že zítra přijde.', 'dass → kommt na konec.'),
  order('Weißt du, ob der Supermarkt heute geöffnet hat?', 'Nevíš, jestli má dnes supermarket otevřeno?', 'ob = jestli; hat na konci.'),
  order('Wenn das Wetter schön ist, gehen wir schwimmen.', 'Když bude hezky, půjdeme plavat.', 'Vedlejší věta na začátku = 1. místo → hlavní věta začíná slovesem gehen.'),
  order('Er sagt, dass er keine Zeit hat.', 'Říká, že nemá čas.', 'dass … hat (sloveso na konci).'),
  order('Ich komme nicht mit, weil ich noch arbeiten muss.', 'Nepůjdu s vámi, protože ještě musím pracovat.', 'Modální sloveso muss stojí ve vedlejší větě úplně na konci, za infinitivem.'),
  order('Weil ich verschlafen habe, bin ich zu spät gekommen.', 'Protože jsem zaspal, přišel jsem pozdě.', 'Perfekt ve vedlejší větě: habe na konci. Hlavní věta pak začíná slovesem bin.'),
  fill('Ich lerne Deutsch, weil ich in Wien [arbeiten möchte] (chtít pracovat).', 'Učím se německy, protože chci pracovat ve Vídni.', 'Ve vedlejší větě: infinitiv a pak časované sloveso na úplném konci: arbeiten möchte.', { traps: { 'möchte arbeiten': 'Pořadí je obrácené: ve vedlejší větě jde časované sloveso (möchte) úplně na konec → arbeiten möchte.' } }),
  fill('Sie fragt, [ob] (jestli) wir morgen Zeit haben.', 'Ptá se, jestli máme zítra čas.', 'ob = jestli (ano/ne otázka v nepřímé řeči).', { traps: { wenn: 'wenn = když / jestliže (podmínka nebo opakovaný čas). „Jestli“ ve smyslu otázky je ob.', dass: 'dass = že. Tady se ptá (jestli), proto ob.' } }),
  fill('Ich hoffe, [dass] (že) du bald gesund wirst.', 'Doufám, že se brzy uzdravíš.', 'dass = že.', { traps: { das: 'das (s jedním s) je člen/zájmeno. Spojka „že“ se píše dass.' } }),
  fill('Ich rufe dich an, wenn ich zu Hause [ankomme] (ankommen).', 'Zavolám ti, až přijedu domů.', 'Odlučitelné sloveso ve vedlejší větě je na konci a píše se dohromady: ankomme.', { traps: { 'komme an': 'Ve vedlejší větě se odlučitelné sloveso nerozděluje: … wenn ich zu Hause ankomme.' } }),
  fill('Weil es so kalt ist, [bleiben] (bleiben) wir heute drinnen.', 'Protože je taková zima, zůstaneme dnes uvnitř.', 'Vedlejší věta na začátku → hlavní věta začíná slovesem: bleiben wir.'),
  choice('Ich weiß nicht, ___.', ['ob er heute kommt', 'ob kommt er heute', 'ob er kommt heute'], 0, 'Nevím, jestli dnes přijde.', 'Ve vedlejší větě je sloveso kommt na konci.'),
  choice('Er kommt nicht, ___ er krank ist.', ['denn', 'weil', 'deshalb'], 1, 'Nepřijde, protože je nemocný.', 'Sloveso ist je na konci → vedlejší věta → weil. Po denn by bylo denn er ist krank.'),
  choice('Wenn ich Zeit habe, ___.', ['ich lese ein Buch', 'lese ich ein Buch', 'ein Buch ich lese'], 1, 'Když mám čas, čtu si knihu.', 'Vedlejší věta zabírá 1. místo, proto hlavní věta začíná slovesem lese.'),
  sent('Nevím, jestli má zítra čas.', ['Ich weiß nicht, ob er morgen Zeit hat.', 'Ich weiß nicht, ob sie morgen Zeit hat.'], 'ob = jestli; sloveso hat na konci vedlejší věty.', { chips: ['ob'] }),
  sent('Myslím, že vlak přijede pozdě.', ['Ich glaube, dass der Zug zu spät kommt.', 'Ich denke, dass der Zug zu spät kommt.', 'Ich glaube, dass der Zug Verspätung hat.', 'Ich glaube, der Zug kommt zu spät.', 'Ich glaube, dass der Zug zu spät ankommt.', 'Ich denke, dass der Zug zu spät ankommt.'], 'dass + sloveso na konci. (Bez dass je možné i Ich glaube, der Zug kommt zu spät.)', { chips: ['dass', 'zu spät'] }),
  sent('Protože jsem včera dlouho pracoval, jsem dnes unavený.', ['Weil ich gestern lange gearbeitet habe, bin ich heute müde.', 'Ich bin heute müde, weil ich gestern lange gearbeitet habe.'], 'Perfekt ve vedlejší větě: gearbeitet habe na konci. Pokud začneš vedlejší větou, hlavní věta začíná slovesem bin.', { chips: ['weil', 'lange'] }),
  sent('Když prší, jezdím do práce autobusem.', ['Wenn es regnet, fahre ich mit dem Bus zur Arbeit.', 'Ich fahre mit dem Bus zur Arbeit, wenn es regnet.', 'Wenn es regnet, fahre ich mit dem Bus in die Arbeit.'], 'wenn (opakovaně / podmínka) + sloveso na konci; hlavní věta pak začíná slovesem.', { chips: ['wenn', 'regnen'] })
]));

// ---------- D11: slovesa s předložkou II + da-/wo- ----------
sets.push(set({ id: 'prep-verb2', group: 'predl', title: 'Slovesa s předložkou II', tag: 'Předložky: slovesné vazby',
  desc: 'Nejčastější vazby k B1 – s pádem.',
  rule: 'Vazbu sloveso + předložka se nedá odvodit z češtiny – uč se ji jako celek i s pádem: warten auf + 4., sich freuen auf + 4. (těšit se na) × sich freuen über + 4. (mít radost z), denken an + 4., sich interessieren für + 4., Angst haben vor + 3., teilnehmen an + 3., sich kümmern um + 4., sprechen mit + 3. / über + 4.' }, [
  fill('Ich denke oft [an] meine Familie.', 'Často myslím na rodinu.', 'denken an + 4. pád (myslet na).', { traps: { auf: 'Česky „myslet NA“, ale německy denken an + 4. pád.' } }),
  fill('Wir freuen uns [auf] den Urlaub.', 'Těšíme se na dovolenou.', 'sich freuen auf + 4. pád = těšit se na (něco v budoucnu).', { traps: { über: 'sich freuen über = mít radost z něčeho, co už je/proběhlo. Na dovolenou se teprve těšíme → auf.' } }),
  fill('Sie freut sich [über] das Geschenk.', 'Má radost z dárku.', 'sich freuen über + 4. pád = mít radost z (už to má).', { traps: { auf: 'auf = těšit se na budoucí věc. Dárek už dostala → über.' } }),
  fill('Kannst du dich [um] die Katze kümmern?', 'Můžeš se postarat o kočku?', 'sich kümmern um + 4. pád = starat se o.'),
  fill('Hast du Angst [vor] Hunden?', 'Bojíš se psů?', 'Angst haben vor + 3. pád.'),
  fill('Ich nehme morgen [an] einem Kurs teil.', 'Zítra se účastním kurzu.', 'teilnehmen an + 3. pád (einem Kurs).'),
  fill('Er bittet mich [um] Hilfe.', 'Prosí mě o pomoc.', 'bitten um + 4. pád = prosit o.', { traps: { für: 'für = pro. Prosit o něco = bitten um + 4. pád.' } }),
  fill('Ich habe mich [bei] der Firma beworben.', 'Ucházel jsem se o místo u té firmy.', 'sich bewerben bei (u firmy) + um (o místo).'),
  fill('Wir sprechen [über] das Problem.', 'Mluvíme o tom problému.', 'sprechen über + 4. pád = mluvit o.', { traps: { von: 'sprechen von je možné (zmínit se), ale „bavit se o tématu“ je běžně sprechen über + 4. pád.' } }),
  fill('Das hängt [von] dem Wetter ab.', 'To záleží na počasí.', 'abhängen von + 3. pád = záviset na.', { traps: { auf: 'Česky „záležet NA“, německy abhängen von + 3. pád.' } }),
  fill('Ich habe mich [über] den Lärm beschwert.', 'Stěžoval jsem si na hluk.', 'sich beschweren über + 4. pád = stěžovat si na.'),
  fill('Sie träumt [von] einer Reise nach Japan.', 'Sní o cestě do Japonska.', 'träumen von + 3. pád.'),
  fill('Ich gratuliere dir [zum] Geburtstag.', 'Gratuluju ti k narozeninám.', 'gratulieren zu + 3. pád; zu dem Geburtstag → zum.', { traps: { zur: 'zur = zu der (ženský rod). der Geburtstag je mužský → zu dem = zum.' } }),
  fill('Er hat sich [für] den Fehler entschuldigt.', 'Omluvil se za chybu.', 'sich entschuldigen für + 4. pád = omluvit se za.'),
  fill('Kann ich mich [auf] dich verlassen?', 'Můžu se na tebe spolehnout?', 'sich verlassen auf + 4. pád.'),
  choice('Ich warte schon seit einer Stunde ___ dich.', ['für', 'auf', 'an'], 1, 'Čekám na tebe už hodinu.', 'warten auf + 4. pád – nejčastější vazba vůbec.'),
  choice('Er interessiert sich sehr ___ Geschichte.', ['für', 'an', 'über'], 0, 'Velmi se zajímá o historii.', 'sich interessieren für + 4. pád.'),
  choice('Ich habe mich ___ den Job beworben.', ['für', 'um', 'auf'], 1, 'Ucházel jsem se o tu práci.', 'sich bewerben um + 4. pád (o místo), bei + 3. pád (u firmy).'),
  sent('Těším se na víkend.', ['Ich freue mich auf das Wochenende.', 'Ich freue mich aufs Wochenende.'], 'sich freuen auf + 4. pád (budoucí věc). auf das = aufs.', { chips: ['sich freuen'] }),
  sent('Musím se postarat o svou babičku.', ['Ich muss mich um meine Oma kümmern.', 'Ich muss mich um meine Großmutter kümmern.'], 'sich kümmern um + 4. pád; zvratné mich hned za muss, infinitiv kümmern na konci.', { chips: ['sich kümmern'] })
]));

sets.push(set({ id: 'da-wo', group: 'predl', title: 'darauf, worauf …: da- a wo-', tag: 'Předložky: da-/wo- složeniny',
  desc: 'Na co čekáš? – Čekám na to.',
  rule: 'U věcí se předložka spojuje s da- (na to) a wo- (na co): auf → darauf / worauf, für → dafür / wofür, über → darüber / worüber, an → daran / woran, mit → damit / womit. Začíná-li předložka samohláskou, vkládá se -r-. U osob se da-/wo- nepoužívá: auf wen? – auf ihn.' }, [
  fill('[Worauf] (na co) wartest du?', 'Na co čekáš?', 'warten auf + věc → wo + r + auf = worauf.', { traps: { 'auf was': 'Hovorově se říká auf was, ale spisovně worauf.' } }),
  fill('Ich warte [darauf], dass der Regen aufhört.', 'Čekám na to, až přestane pršet.', 'darauf odkazuje dopředu na celou vedlejší větu.'),
  fill('[Wofür] (o co) interessierst du dich?', 'O co se zajímáš?', 'sich interessieren für → wofür (bez -r-, protože für začíná souhláskou).'),
  fill('Ich interessiere mich nicht [dafür].', 'To mě nezajímá.', 'für + to = dafür.'),
  fill('[Worüber] (o čem) habt ihr gesprochen?', 'O čem jste mluvili?', 'sprechen über → worüber (über začíná samohláskou → -r-).'),
  fill('Wir haben lange [darüber] gesprochen.', 'Dlouho jsme o tom mluvili.', 'über + to = darüber.'),
  fill('[Woran] (na co) denkst du?', 'Na co myslíš?', 'denken an → woran.'),
  fill('Denk bitte [daran], die Tür abzuschließen!', 'Mysli prosím na to, abys zamkl dveře!', 'denken an + to = daran.'),
  fill('[Womit] (čím) fährst du zur Arbeit?', 'Čím jezdíš do práce?', 'mit → womit.'),
  fill('Ich freue mich sehr [darüber], dass du kommst.', 'Moc mě těší, že přijdeš.', 'sich freuen über → darüber (radost z toho, že …).'),
  choice('Auf ___ wartest du? – Auf meine Schwester.', ['was', 'wen', 'worauf'], 1, 'Na koho čekáš? – Na sestru.', 'U osob: předložka + wen/wem (auf wen), ne worauf.'),
  choice('Erinnerst du dich an deinen Lehrer? – Ja, ich erinnere mich gut ___.', ['daran', 'an ihn', 'woran'], 1, 'Pamatuješ si na svého učitele? – Ano, dobře si na něj pamatuju.', 'Osoba → předložka + zájmeno: an ihn. daran by bylo „na to“.'),
  choice('Erinnerst du dich an den Urlaub? – Ja, ich erinnere mich gut ___.', ['daran', 'an ihn', 'an es'], 0, 'Pamatuješ si na dovolenou? – Ano, dobře si na ni pamatuju.', 'Věc → da- složenina: daran.'),
  sent('O čem přemýšlíš?', ['Worüber denkst du nach?'], 'nachdenken über + 4. pád → worüber; odlučitelná předpona nach na konci.', { chips: ['nachdenken über'] }),
  sent('Na to jsem úplně zapomněl.', ['Das habe ich ganz vergessen.', 'Ich habe das ganz vergessen.', 'Das habe ich völlig vergessen.', 'Ich habe das völlig vergessen.', 'Ich habe es ganz vergessen.'], 'vergessen má přímý předmět ve 4. pádě (etwas vergessen), takže žádné daran: Das habe ich ganz vergessen. (Daran habe ich nicht gedacht = na to jsem nemyslel.)', {})
]));

// ---------- D12: zvratná slovesa ----------
sets.push(set({ id: 'reflexiv', group: 'slovesa', title: 'Zvratná slovesa: mich, mir, sich', tag: 'Zvratná slovesa',
  desc: 'sich waschen, sich die Hände waschen, sich etwas kaufen.',
  rule: 'Zvratné zájmeno má 4. pád (mich, dich, sich, uns, euch, sich) a 3. pád (mir, dir, sich, uns, euch, sich). Když je ve větě ještě jiný předmět ve 4. pádě, zvratné zájmeno je ve 3. pádě: Ich wasche mich. × Ich wasche mir die Hände. Pozor: některá česká zvratná slovesa nejsou v němčině zvratná (učit se = lernen), a naopak (sich beeilen = pospíšit si).' }, [
  fill('Ich ziehe [mich] schnell an.', 'Rychle se obléknu.', 'sich anziehen; bez dalšího předmětu → 4. pád mich.'),
  fill('Ich ziehe [mir] eine Jacke an.', 'Obléknu si bundu.', 'Je tu předmět eine Jacke (4. pád) → zvratné zájmeno ve 3. pádě: mir.', { traps: { mich: 'Když je ve větě jiný předmět ve 4. pádě (eine Jacke), zvratné zájmeno přechází do 3. pádu: mir.' } }),
  fill('Wasch [dir] bitte die Hände!', 'Umyj si prosím ruce!', 'die Hände = předmět ve 4. pádě → dir (3. pád).'),
  fill('Du musst [dich] beeilen.', 'Musíš si pospíšit.', 'sich beeilen: v němčině 4. pád (dich), i když česky „si“.', { traps: { dir: 'Česky „pospíšit SI“, ale sich beeilen má 4. pád: ich beeile mich, du beeilst dich.' } }),
  fill('Wir treffen [uns] um sieben vor dem Kino.', 'Sejdeme se v sedm před kinem.', 'wir → uns (3. i 4. pád stejně).'),
  fill('Habt ihr [euch] gut erholt?', 'Dobře jste si odpočinuli?', 'ihr → euch.'),
  fill('Er hat [sich] ein neues Handy gekauft.', 'Koupil si nový mobil.', 'er/sie/es/Sie → vždy sich.'),
  fill('Ich kann [mir] seinen Namen nicht merken.', 'Nedokážu si zapamatovat jeho jméno.', 'sich etwas merken: věc (seinen Namen) je 4. pád → mir.'),
  fill('Ich stelle [mir] das schwierig vor.', 'Představuju si to těžké.', 'sich etwas vorstellen (představit si) → mir.', { traps: { mich: 'Ich stelle mich vor = představím se (komu). „Představit si něco“ = ich stelle mir etwas vor.' } }),
  fill('Darf ich [mich] vorstellen? Ich heiße Jana.', 'Smím se představit? Jmenuji se Jana.', 'sich vorstellen = představit se → mich.'),
  fill('Ich fühle [mich] heute nicht gut.', 'Dnes se necítím dobře.', 'sich fühlen → mich.'),
  choice('Česky „učím se“ = ?', ['Ich lerne.', 'Ich lerne mich.', 'Ich lerne mir.'], 0, 'Učím se.', 'lernen není zvratné. Pozor na doslovný překlad.'),
  choice('Kannst du ___ an meinen Geburtstag erinnern?', ['dich', 'dir'], 0, 'Pamatuješ si na moje narozeniny?', 'sich erinnern an + 4. pád: zvratné zájmeno ve 4. pádě (dich).'),
  choice('Ich putze ___ die Zähne.', ['mich', 'mir'], 1, 'Čistím si zuby.', 'die Zähne = 4. pád → mir.'),
  choice('Er ärgert ___ über den Stau.', ['sich', 'ihn', 'ihm'], 0, 'Zlobí se kvůli zácpě.', 'U er/sie/es je zvratné zájmeno vždy sich.'),
  sent('Musím si koupit nové boty.', ['Ich muss mir neue Schuhe kaufen.'], 'sich etwas kaufen: věc (neue Schuhe) ve 4. pádě → mir.', { chips: ['sich kaufen'] }),
  sent('Moc se těším, že se zase uvidíme.', ['Ich freue mich sehr, dass wir uns wieder sehen.', 'Ich freue mich sehr, dass wir uns wiedersehen.', 'Ich freue mich sehr darauf, dass wir uns wiedersehen.', 'Ich freue mich sehr darauf, dass wir uns wieder sehen.'], 'sich freuen + dass; uns = se (navzájem); sloveso na konci vedlejší věty.', { chips: ['sich freuen', 'dass'] })
]));

// ---------- weekly sentences (longer) ----------
sets.push(set({ id: 'veta-w2', group: 'preklad', title: 'Překlad vět: týden 2', tag: 'Překlad vět', n: 6,
  desc: 'Delší věty se slovosledem a spojkami.',
  rule: 'Kontroluj: 1) časované sloveso na 2. místě v hlavní větě, 2) sloveso na konci ve vedlejší větě, 3) čárku před vedlejší větou.' }, [
  sent('Protože jsem ráno zaspal, přišel jsem do práce o půl hodiny později.', ['Weil ich am Morgen verschlafen habe, bin ich eine halbe Stunde später zur Arbeit gekommen.', 'Weil ich heute Morgen verschlafen habe, bin ich eine halbe Stunde später zur Arbeit gekommen.', 'Ich bin eine halbe Stunde später zur Arbeit gekommen, weil ich am Morgen verschlafen habe.', 'Weil ich morgens verschlafen habe, bin ich eine halbe Stunde später zur Arbeit gekommen.', 'Weil ich am Morgen verschlafen habe, kam ich eine halbe Stunde später zur Arbeit.'], 'Vedlejší věta na začátku (weil … habe) → hlavní věta začíná slovesem bin. Perfekt od kommen se tvoří se sein.', { chips: ['verschlafen', 'eine halbe Stunde'] }),
  sent('Nevím, jestli můžu v sobotu přijít, protože možná budu muset pracovat.', ['Ich weiß nicht, ob ich am Samstag kommen kann, weil ich vielleicht arbeiten muss.', 'Ich weiß nicht, ob ich am Samstag kommen kann, denn ich muss vielleicht arbeiten.'], 'Dvě vedlejší věty za sebou: ob … kommen kann, weil … arbeiten muss. Modální sloveso vždy úplně na konci.', { chips: ['ob', 'vielleicht'] }),
  sent('Myslím, že bys měl víc spát, jinak budeš pořád unavený.', ['Ich denke, dass du mehr schlafen solltest, sonst bist du immer müde.', 'Ich glaube, dass du mehr schlafen solltest, sonst bist du immer müde.', 'Ich finde, dass du mehr schlafen solltest, sonst bist du immer müde.', 'Ich denke, du solltest mehr schlafen, sonst bist du immer müde.', 'Ich glaube, du solltest mehr schlafen, sonst bist du immer müde.', 'Ich denke, dass du mehr schlafen solltest, sonst wirst du immer müde sein.'], 'dass … schlafen solltest (sloveso na konci); sonst zabírá 1. místo → sonst bist du.', { chips: ['solltest', 'sonst'] }),
  sent('Venku byla zima, přesto jsme šli s dětmi na dlouhou procházku.', ['Draußen war es kalt, trotzdem sind wir mit den Kindern lange spazieren gegangen.', 'Es war draußen kalt, trotzdem sind wir mit den Kindern lange spazieren gegangen.', 'Draußen war es kalt, trotzdem haben wir mit den Kindern einen langen Spaziergang gemacht.', 'Es war draußen kalt, trotzdem haben wir mit den Kindern einen langen Spaziergang gemacht.', 'Draußen war es kalt, trotzdem machten wir mit den Kindern einen langen Spaziergang.'], 'Draußen na 1. místě → war es. trotzdem → inverze sind wir. spazieren gehen má Perfekt se sein.', { chips: ['trotzdem', 'spazieren gehen'] }),
  sent('Když budu mít příští týden čas, zavolám ti a zajdeme na kávu.', ['Wenn ich nächste Woche Zeit habe, rufe ich dich an und wir gehen einen Kaffee trinken.', 'Wenn ich nächste Woche Zeit habe, rufe ich dich an und wir trinken einen Kaffee.', 'Wenn ich nächste Woche Zeit habe, rufe ich dich an und wir gehen Kaffee trinken.'], 'wenn … habe → hlavní věta začíná slovesem rufe. und na nultém místě → normální pořadí wir gehen.', { chips: ['wenn', 'anrufen'] }),
  sent('Nemám rád dlouhé porady, ale tahle byla zajímavá, protože jsme mluvili o novém projektu.', ['Ich mag keine langen Besprechungen, aber diese war interessant, weil wir über das neue Projekt gesprochen haben.', 'Ich mag lange Besprechungen nicht, aber diese war interessant, weil wir über das neue Projekt gesprochen haben.', 'Ich mag keine langen Meetings, aber dieses war interessant, weil wir über das neue Projekt gesprochen haben.'], 'keine langen Besprechungen (bez členu v mn. č. po keine → -en). aber nemění pořadí. sprechen über + 4. pád.', { chips: ['die Besprechung', 'sprechen über'] }),
  sent('Moje sestra se zajímá o umění, a proto chce studovat ve Vídni.', ['Meine Schwester interessiert sich für Kunst, deshalb will sie in Wien studieren.', 'Meine Schwester interessiert sich für Kunst, und deshalb will sie in Wien studieren.', 'Meine Schwester interessiert sich für Kunst, deshalb möchte sie in Wien studieren.', 'Meine Schwester interessiert sich für Kunst, und deshalb möchte sie in Wien studieren.', 'Meine Schwester interessiert sich für Kunst, darum will sie in Wien studieren.'], 'sich interessieren für + 4. pád. deshalb → inverze will sie.', { chips: ['sich interessieren für', 'deshalb'] }),
  sent('Ptal se mě, jestli vím, kdy jede poslední autobus.', ['Er hat mich gefragt, ob ich weiß, wann der letzte Bus fährt.', 'Er fragte mich, ob ich weiß, wann der letzte Bus fährt.', 'Er hat mich gefragt, ob ich weiß, wann der letzte Bus abfährt.', 'Er fragte mich, ob ich wüsste, wann der letzte Bus fährt.'], 'Vedlejší věta ve vedlejší větě: ob ich weiß, wann … fährt – sloveso pokaždé na konci své věty.', { chips: ['ob', 'wann'] })
]));

// ---------- C-test + reading + writing ----------
sets.push(set({ id: 'ctest-7', group: 'cteni', title: 'C-Test: Mein neuer Job', n: 1, all: true, kindLabel: 'C-Test', tag: 'C-Test' }, [{
  id: 'ct-w2', kind: 'ctest', title: 'C-Test: Mein neuer Job', tag: 'C-Test', gaps: 20,
  short: 'Správně doplněné slovo je celé v textu výše.',
  text: 'Seit einem Monat arbeite ich bei einer kleinen Firma in Brno. Am Anfang {{wa|r|Präteritum|Präteritum}} ich sehr nervös, {{we|il|Spojka|spojka weil}} ich niemanden {{kann|te|Präteritum|smíšené sloveso}}. Aber meine Kollegen {{si|nd||}} sehr nett und {{hel|fen|Sloveso|sloveso v přítomném čase}} mir oft. Jeden {{Mor|gen||}} trinken wir zusammen {{Kaf|fee||}} und sprechen über {{d|ie|Člen|4. pád}} Arbeit. Mein Chef {{sa|gt||}}, dass ich {{schn|ell|Přísl.|příslovce bez koncovky}} lerne. Deshalb {{be|komme|Slovosled|sloveso na 2. místě po deshalb}} ich bald ein {{eige|nes|Adj. koncovka|po ein, stř. rod → -es}} Projekt. Ich {{fre|ue|Sloveso|sich freuen}} mich darauf, {{we|il||}} ich dann mehr {{Verantw|ortung||}} habe. Natürlich gibt {{e|s||}} auch Probleme: Der {{W|eg||}} zur Arbeit ist {{la|ng||}}, und ich muss {{jed|en|Adj. koncovka|jeden Tag (4. pád m.)}} Tag um sechs Uhr {{aufst|ehen|Sloveso|infinitiv na konci}}. Trotzdem bin {{i|ch|Slovosled|inverze po trotzdem}} zufrieden.',
  tr: 'Už měsíc pracuju v jedné malé firmě v Brně. Na začátku jsem byl hodně nervózní, protože jsem nikoho neznal. Ale kolegové jsou moc milí a často mi pomáhají. Každé ráno spolu pijeme kávu a mluvíme o práci. Můj šéf říká, že se rychle učím. Proto brzy dostanu vlastní projekt. Těším se na to, protože pak budu mít větší odpovědnost. Samozřejmě jsou i problémy: cesta do práce je dlouhá a každý den musím vstávat v šest. Přesto jsem spokojený.'
}]));

const p7 = { title: 'Aushang: Sprachcafé', text: 'Sprachcafé im Stadtteilzentrum\n\nJeden Donnerstag von 18 bis 20 Uhr treffen sich Menschen aus vielen Ländern, um Deutsch zu sprechen. Die Teilnahme ist kostenlos, aber wir bitten um eine kleine Spende für Getränke. Anfänger sind herzlich willkommen, denn unsere ehrenamtlichen Helfer sprechen langsam und erklären gern. Im Dezember findet das Sprachcafé nicht am Donnerstag statt, sondern am Mittwoch, weil der Raum für eine Weihnachtsfeier gebraucht wird. Eine Anmeldung ist nicht nötig. Wer Fragen hat, schreibt an sprachcafe@zentrum-sued.de.', tr: 'Vývěska: Jazyková kavárna\n\nKaždý čtvrtek od 18 do 20 hodin se scházejí lidé z mnoha zemí, aby mluvili německy. Účast je zdarma, ale prosíme o malý příspěvek na nápoje. Začátečníci jsou srdečně vítáni, protože naši dobrovolní pomocníci mluví pomalu a rádi vysvětlují. V prosinci se jazyková kavárna nekoná ve čtvrtek, ale ve středu, protože místnost je potřeba pro vánoční večírek. Přihlášení není nutné. Kdo má otázky, napíše na sprachcafe@zentrum-sued.de.' };
sets.push(set({ id: 'read-7', group: 'cteni', title: 'Čtení: Aushang: Sprachcafé', n: 3, all: true, kindLabel: 'Čtení', tag: 'Čtení' }, [
  choice('Wann ist das Sprachcafé im Dezember?', ['Am Donnerstag von 18 bis 20 Uhr', 'Am Mittwoch', 'Es fällt im Dezember aus.'], 1, 'Kdy je jazyková kavárna v prosinci?', 'Past: výjimka. Běžně je čtvrtek, ale v prosinci „nicht am Donnerstag, sondern am Mittwoch“.', { passage: p7, evidence: '„Im Dezember findet das Sprachcafé nicht am Donnerstag statt, sondern am Mittwoch“', optTr: ['Ve čtvrtek od 18 do 20', 'Ve středu', 'V prosinci odpadá.'], tag: 'Čtení: výjimka / negace' }),
  choice('Was kostet die Teilnahme?', ['Nichts, aber man kann für Getränke spenden.', 'Man muss die Getränke bezahlen.', 'Eine kleine Gebühr für Anfänger.'], 0, 'Kolik stojí účast?', 'kostenlos = zdarma; Spende = dobrovolný příspěvek, ne povinná platba.', { passage: p7, evidence: '„Die Teilnahme ist kostenlos, aber wir bitten um eine kleine Spende für Getränke.“', optTr: ['Nic, ale dá se přispět na nápoje.', 'Nápoje se musí zaplatit.', 'Malý poplatek pro začátečníky.'], tag: 'Čtení: záměna slov' }),
  choice('Was muss man vorher machen?', ['Sich per E-Mail anmelden.', 'Nichts, eine Anmeldung ist nicht nötig.', 'Einen Deutschkurs besuchen.'], 1, 'Co je potřeba udělat předem?', 'E-mail je jen pro otázky. „Eine Anmeldung ist nicht nötig.“', { passage: p7, evidence: '„Eine Anmeldung ist nicht nötig.“', optTr: ['Přihlásit se e-mailem.', 'Nic, přihláška není nutná.', 'Navštěvovat kurz němčiny.'], tag: 'Čtení: výjimka / negace' })
]));

sets.push(set({ id: 'write-w2', group: 'cteni', title: 'Psaní: Můj týden', n: 1, all: true, kindLabel: 'Psaní', tag: 'Psaní' }, [
  write({ prompt: 'Mein typischer Tag. Schreib 60–90 Wörter. Benutze mindestens zweimal weil oder dass, einmal deshalb und einmal trotzdem. Beginne mindestens zwei Sätze nicht mit dem Subjekt (z. B. Am Morgen …, Danach …).',
    tr: 'Můj typický den. Napiš 60–90 slov. Použij aspoň dvakrát weil nebo dass, jednou deshalb a jednou trotzdem. Aspoň dvě věty nezačínej podmětem (např. Am Morgen …, Danach …).',
    minWords: 60, words: ['aufstehen – stand auf – ist aufgestanden', 'deshalb + Verb', 'trotzdem + Verb', 'weil … Verb am Ende'],
    check: [{ re: '\\b(weil|dass)\\b', min: 2, label: 'aspoň 2× weil / dass' }, { re: '\\bdeshalb\\b', min: 1, label: 'deshalb' }, { re: '\\btrotzdem\\b', min: 1, label: 'trotzdem' }],
    model: 'Am Morgen stehe ich um sechs Uhr auf, weil ich um sieben im Büro sein muss. Zuerst trinke ich einen Kaffee, danach fahre ich mit dem Bus zur Arbeit. Der Bus ist oft voll, deshalb lese ich nicht. Im Büro arbeite ich viel am Computer. Mittags essen wir zusammen, und ich finde, dass das sehr wichtig ist. Am Abend bin ich oft müde. Trotzdem gehe ich zweimal pro Woche ins Fitnessstudio, weil ich gesund bleiben will.' })
]));

// ---------- vocabulary ----------
vocabSets.push(vocab({ id: 'vocab-freizeit', topic: 'volný čas a koníčky', title: 'Volný čas a koníčky' }, [
  'die Freizeit = volný čas', 'das Hobby, -s = koníček', 'der Verein, -e = spolek, klub', 'das Mitglied, -er = člen', 'die Ausstellung, -en = výstava',
  'das Konzert, -e = koncert', 'der Ausflug, Ausflüge = výlet', 'das Spiel, -e = hra, zápas', 'die Mannschaft, -en = tým, mužstvo', 'das Training, -s = trénink',
  'der Eintritt = vstupné', 'die Veranstaltung, -en = akce', 'wandern (wanderte, ist gewandert) = chodit na túry', 'sich verabreden (verabredete, hat verabredet) = domluvit si schůzku',
  'teilnehmen an + Dat. (nahm teil, hat teilgenommen) = zúčastnit se', 'sich entspannen (entspannte, hat entspannt) = odpočinout si', 'die Lust = chuť (Lust haben = mít chuť)', 'gemeinsam = společně', 'regelmäßig = pravidelně', 'spannend = napínavý'
]));
vocabSets.push(vocab({ id: 'vocab-koerper', topic: 'tělo a zdraví', title: 'Tělo a zdraví' }, [
  'der Kopf, Köpfe = hlava', 'der Hals, Hälse = krk', 'der Rücken, - = záda', 'der Bauch, Bäuche = břicho', 'das Bein, -e = noha',
  'der Arm, -e = paže', 'das Auge, -n = oko', 'der Zahn, Zähne = zub', 'der Schmerz, -en = bolest', 'das Fieber = horečka',
  'die Erkältung, -en = nachlazení', 'das Rezept, -e = recept', 'die Tablette, -n = tableta', 'die Apotheke, -n = lékárna', 'die Versicherung, -en = pojištění, pojišťovna',
  'sich verletzen (verletzte, hat verletzt) = zranit se', 'husten (hustete, hat gehustet) = kašlat', 'weh tun (tat weh, hat wehgetan) = bolet', 'krankgeschrieben = v pracovní neschopnosti', 'schwanger = těhotná'
]));
vocabSets.push(vocab({ id: 'vocab-gefuehle', topic: 'pocity a vztahy', title: 'Pocity a vztahy' }, [
  'das Gefühl, -e = pocit', 'die Freude = radost', 'die Angst, Ängste = strach', 'die Sorge, -n = starost', 'der Ärger = zlost, mrzutost',
  'die Beziehung, -en = vztah', 'der Streit, -e = hádka', 'die Hochzeit, -en = svatba', 'die Freundschaft, -en = přátelství', 'das Vertrauen = důvěra',
  'sich streiten (stritt, hat gestritten) = hádat se', 'sich verlieben in + Akk. (verliebte, hat verliebt) = zamilovat se do', 'vermissen (vermisste, hat vermisst) = chybět (někdo mi chybí)', 'sich ärgern über + Akk. (ärgerte, hat geärgert) = zlobit se na/kvůli',
  'enttäuscht = zklamaný', 'stolz auf + Akk. = hrdý na', 'eifersüchtig = žárlivý', 'zufrieden = spokojený', 'traurig = smutný', 'überrascht = překvapený'
]));

// ---------- plan ----------
const T = {};
T.v2 = theory(
  'V německé oznamovací větě platí jedno pevné pravidlo: časované sloveso (to, které se mění podle osoby) stojí na 2. místě. „Místo“ nejsou slova, ale větné členy: am nächsten Montag je jedno místo.',
  ['tbl', ['1. místo', '2. místo', 'zbytek', 'konec'], [['Ich', 'fahre', 'morgen nach Wien.', ''], ['Morgen', 'fahre', 'ich nach Wien.', ''], ['Morgen', 'muss', 'ich nach Wien', 'fahren.'], ['Gestern', 'bin', 'ich nach Wien', 'gefahren.'], ['Morgen', 'fährt', 'der Zug um acht', 'ab.']]],
  ['tip', 'Nejčastější chyba Čechů: Heute ich gehe … Po čemkoli na začátku (čas, místo, předmět) musí hned přijít sloveso: Heute gehe ich.'],
  ['h', 'Větný rámec'],
  'Druhá část slovesa (infinitiv po modálním slovese, příčestí v Perfektu, předpona odlučitelného slovesa) jde na úplný konec věty. Mezi 2. místem a koncem je „rámec“.',
  ['h', 'Otázky'],
  ['ex', ['Wann kommst du?', 'Kdy přijdeš? (tázací slovo + sloveso)'], ['Kommst du heute?', 'Přijdeš dnes? (ano/ne: sloveso na začátku)']],
  ['h', 'Pořadí doplňků: TeKaMoLo'],
  'Když je ve větě víc údajů, obvyklé pořadí je: temporal (kdy) – kausal (proč) – modal (jak) – lokal (kde/kam).',
  ['ex', ['Ich fahre morgen wegen der Arbeit mit dem Zug nach Wien.', 'Zítra jedu kvůli práci vlakem do Vídně.']]
);
T.konj = theory(
  'Spojky v hlavních větách se dělí na dvě skupiny podle toho, jestli „zabírají místo“.',
  ['tbl', ['skupina', 'slova', 'pořadí za nimi'], [['nulté místo', 'und, aber, oder, denn, sondern', 'normální: … , aber ich bin müde.'], ['1. místo (inverze)', 'deshalb, deswegen, darum, trotzdem, dann, danach, sonst, außerdem, also', 'sloveso hned: … , deshalb bin ich müde.'], ['vedlejší věta', 'weil, dass, ob, wenn, obwohl …', 'sloveso na konci: … , weil ich müde bin.']]],
  ['h', 'Tři způsoby, jak říct „protože / proto“'],
  ['ex', ['Ich bleibe zu Hause, denn ich bin krank.', 'denn + normální pořadí'], ['Ich bleibe zu Hause, weil ich krank bin.', 'weil + sloveso na konci'], ['Ich bin krank, deshalb bleibe ich zu Hause.', 'deshalb + inverze']],
  ['tip', 'aber × sondern: sondern použij jen po záporu, když opravuješ: nicht heute, sondern morgen. Jinak aber.']
);
T.ns = theory(
  'Vedlejší věta začíná spojkou (weil, dass, ob, wenn, als, obwohl, damit …) nebo tázacím slovem (wann, wo, warum …). Časované sloveso jde na úplný konec.',
  ['tbl', ['spojka', 'význam', 'příklad'], [['weil', 'protože', '…, weil ich keine Zeit habe.'], ['dass', 'že', '…, dass du kommst.'], ['ob', 'jestli (otázka)', '…, ob er kommt.'], ['wenn', 'když, jestliže; až', '…, wenn es regnet.']]],
  ['h', 'Více sloves na konci'],
  ['ex', ['…, weil ich arbeiten muss.', 'infinitiv + modální sloveso'], ['…, weil ich gearbeitet habe.', 'příčestí + pomocné sloveso'], ['…, weil der Kurs um acht anfängt.', 'odlučitelné sloveso dohromady']],
  ['h', 'Vedlejší věta na začátku'],
  'Celá vedlejší věta zabírá 1. místo, takže hlavní věta pokračuje slovesem: Wenn ich Zeit habe, komme ich. (sloveso – čárka – sloveso).',
  ['tip', 'Čárka před vedlejší větou je v němčině povinná. dass (spojka „že“) se píše se dvěma s, das (člen, „to“) s jedním.']
);
T.pv = theory(
  'Minulý týden byla slovesa s předložkou tvoje nejslabší téma (70 % chyb). Fungují jako celek: sloveso + předložka + pád. Česká předložka často napoví špatně.',
  ['tbl', ['sloveso', 'pád', 'česky'], [['warten auf', '4.', 'čekat na'], ['sich freuen auf / über', '4.', 'těšit se na / mít radost z'], ['denken an', '4.', 'myslet na'], ['sich interessieren für', '4.', 'zajímat se o'], ['sich kümmern um', '4.', 'starat se o'], ['bitten um', '4.', 'prosit o'], ['sprechen über', '4.', 'mluvit o'], ['Angst haben vor', '3.', 'bát se'], ['teilnehmen an', '3.', 'účastnit se'], ['abhängen von', '3.', 'záviset na'], ['träumen von', '3.', 'snít o'], ['gratulieren zu', '3.', 'blahopřát k']]],
  ['h', 'da- a wo-'],
  'Když místo věci chceš říct „na to / na co“, použij da- / wo- + předložka. Před samohláskou se vkládá -r-: darauf, worauf, daran, woran, darüber, worüber. Pro osoby to nefunguje: Auf wen wartest du? – Auf ihn.',
  ['ex', ['Worauf wartest du? – Auf den Bus. Ich warte schon lange darauf.', 'Na co čekáš? – Na autobus. Čekám na něj už dlouho.']]
);
T.refl = theory(
  'Zvratná slovesa mají zájmeno podle osoby. Ve 3. osobě a u Sie je vždy sich.',
  ['tbl', ['osoba', '4. pád (se)', '3. pád (si)'], [['ich', 'mich', 'mir'], ['du', 'dich', 'dir'], ['er/sie/es/Sie', 'sich', 'sich'], ['wir', 'uns', 'uns'], ['ihr', 'euch', 'euch'], ['sie', 'sich', 'sich']]],
  ['h', 'mich, nebo mir?'],
  'Pravidlo: je-li ve větě ještě jiný předmět ve 4. pádě, zvratné zájmeno je ve 3. pádě.',
  ['ex', ['Ich wasche mich.', 'Myju se.'], ['Ich wasche mir die Haare.', 'Myju si vlasy. (die Haare = 4. pád)'], ['Ich kaufe mir ein Buch.', 'Koupím si knihu.']],
  ['tip', 'Česky zvratné, německy ne: lernen (učit se), lachen (smát se), bleiben (zůstat). Německy zvratné, česky ne: sich beeilen (pospíšit si), sich erholen (zotavit se, odpočinout si), sich bedanken (poděkovat).']
);

const days = [
  { title: 'Sloveso na 2. místě', theory: T.v2, blocks: [['wo-v2', 12, 'Sloveso na 2. místě'], ['vocab-freizeit', 10, 'Slovíčka: volný čas'], ['prep-verb', 8, 'Opakování: slovesa s předložkou']] },
  { title: 'Spojky: aber, denn, deshalb, trotzdem', theory: T.konj, blocks: [['konj-adv', 12, 'Spojky v hlavních větách'], ['vocab-koerper', 10, 'Slovíčka: tělo a zdraví'], ['__due', 12, 'Dnešní opakování']] },
  { title: 'Vedlejší věty: sloveso na konec', theory: T.ns, blocks: [['nebensatz-1', 12, 'weil, dass, ob, wenn'], ['wo-v2', 6, 'Opakování: sloveso na 2. místě'], ['noun-forms', 8, 'Opakování: množné číslo']] },
  { title: 'Slovesa s předložkou a darauf / worauf', theory: T.pv, blocks: [['prep-verb2', 12, 'Slovesa s předložkou II'], ['da-wo', 10, 'da- a wo-'], ['vocab-gefuehle', 10, 'Slovíčka: pocity a vztahy']] },
  { title: 'Zvratná slovesa', theory: T.refl, blocks: [['reflexiv', 12, 'mich, mir, sich'], ['prep-gen', 8, 'Opakování: předložky s 2. pádem'], ['__due', 12, 'Dnešní opakování']] },
  { title: 'Opakování týdne', blocks: [['w2-mix', 14, 'Mix týdne 2'], ['__weak', 12, 'Tvoje slabá místa'], ['vocab-w2', 12, 'Slovíčka týdne'], ['read-7', 3, 'Čtení: Sprachcafé']] },
  { title: 'Test týdne a delší věty', blocks: [['veta-w2', 6, 'Překlad delších vět'], ['ctest-7', 1, 'C-Test: Mein neuer Job'], ['write-w2', 1, 'Psaní: můj den'], ['__wrong', 15, 'Opakování chyb']] }
];

sets.push(set({ id: 'w2-mix', group: 'veta', title: 'Mix: týden 2', n: 14, refs: ['wo-v2', 'konj-adv', 'nebensatz-1', 'prep-verb2', 'da-wo', 'reflexiv'] }));
sets.push(set({ id: 'vocab-w2', group: 'slov', title: 'Slovíčka: týden 2', n: 12, refs: ['vocab-freizeit', 'vocab-koerper', 'vocab-gefuehle'] }));

module.exports = { week: 2, title: 'Slovosled a spojky', desc: 'Kde stojí sloveso: hlavní věta, inverze, vedlejší věta. Slovesa s předložkou podruhé.', sets, vocabSets, days };
