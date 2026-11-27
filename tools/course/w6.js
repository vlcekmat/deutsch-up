'use strict';
const { fill, choice, order, sent, write, theory, set, vocab } = require('./lib');

const sets = [];
const vocabSets = [];

// ---------- D36: dvojité spojky ----------
sets.push(set({ id: 'doppelkonj', group: 'veta', title: 'sowohl … als auch, weder … noch …', tag: 'Dvojité spojky',
  desc: 'Dvojité spojky typické pro B1.',
  rule: 'sowohl … als auch = jak …, tak i · weder … noch = ani …, ani (bez dalšího záporu!) · entweder … oder = buď …, nebo · nicht nur …, sondern auch = nejen …, ale i · zwar …, aber = sice …, ale · je …, desto = čím …, tím. Když entweder, weder nebo zwar stojí na začátku věty, následuje sloveso.' }, [
  fill('Ich spreche [sowohl] Englisch als auch Deutsch.', 'Mluvím jak anglicky, tak německy.', 'sowohl … als auch = jak …, tak i.'),
  fill('Er trinkt weder Kaffee [noch] Tee.', 'Nepije ani kávu, ani čaj.', 'weder … noch = ani …, ani.', { traps: { oder: 'weder se pojí s noch. entweder se pojí s oder.' } }),
  fill('Wir fahren [entweder] mit dem Zug oder mit dem Auto.', 'Pojedeme buď vlakem, nebo autem.', 'entweder … oder = buď …, nebo.'),
  fill('Sie ist nicht nur klug, [sondern] auch sehr nett.', 'Je nejen chytrá, ale i velmi milá.', 'nicht nur …, sondern auch.', { traps: { aber: 'Po nicht nur následuje vždy sondern auch.' } }),
  fill('Die Wohnung ist [zwar] klein, aber sehr gemütlich.', 'Byt je sice malý, ale velmi útulný.', 'zwar …, aber = sice …, ale.'),
  fill('Ich habe weder Zeit [noch] Geld.', 'Nemám ani čas, ani peníze.', 'weder … noch; pozor – žádné další nicht/kein!', { traps: {} }),
  fill('Sowohl meine Mutter [als auch] mein Vater arbeiten im Krankenhaus.', 'Jak moje matka, tak otec pracují v nemocnici.', 'sowohl … als auch; dva podměty → sloveso v mn. č.'),
  fill('[Entweder] kommst du jetzt, oder ich gehe allein.', 'Buď přijdeš teď, nebo jdu sám.', 'entweder na začátku → hned sloveso (kommst du).'),
  fill('Je älter ich werde, [desto|umso] ruhiger bin ich.', 'Čím jsem starší, tím jsem klidnější.', 'je … desto/umso.'),
  choice('Er kann ___ schwimmen noch Rad fahren.', ['weder', 'entweder', 'nicht'], 0, 'Neumí ani plavat, ani jezdit na kole.', 'Ani … ani → weder … noch.'),
  choice('Weder mein Bruder noch ich ___ Lust auf Fußball.', ['haben', 'haben keine', 'haben nicht'], 0, 'Ani bratr, ani já nemáme chuť na fotbal.', 'weder … noch už je zápor – žádné keine/nicht navíc.'),
  choice('Zwar ___ das Hotel teuer, aber der Service war super.', ['war', 'das Hotel war', 'ist gewesen war'], 0, 'Hotel byl sice drahý, ale servis byl skvělý.', 'zwar na začátku → hned sloveso: Zwar war das Hotel …'),
  choice('Nicht nur die Kinder, ___ auch die Eltern hatten Spaß.', ['aber', 'sondern', 'als'], 1, 'Nejen děti, ale i rodiče se bavili.', 'nicht nur … sondern auch.'),
  order('Wir können entweder heute oder morgen ins Kino gehen.', 'Můžeme jít do kina buď dnes, nebo zítra.', 'entweder … oder uprostřed věty: normální slovosled.'),
  order('Ich habe weder gefrühstückt noch zu Mittag gegessen.', 'Nesnídal jsem ani neobědval.', 'weder … noch spojuje dvě příčestí.'),
  sent('Mluví nejen německy, ale i francouzsky.', ['Er spricht nicht nur Deutsch, sondern auch Französisch.', 'Sie spricht nicht nur Deutsch, sondern auch Französisch.'], 'nicht nur …, sondern auch (čárka před sondern).', { chips: ['nicht nur … sondern auch'] }),
  sent('Buď zavolám, nebo napíšu SMS.', ['Entweder rufe ich an oder ich schreibe eine SMS.', 'Entweder rufe ich an, oder ich schreibe eine SMS.', 'Ich rufe entweder an oder schreibe eine SMS.', 'Entweder rufe ich an oder ich schreibe eine Nachricht.', 'Ich rufe entweder an oder ich schreibe eine SMS.'], 'entweder na začátku → rufe ich; oder na nultém místě → ich schreibe.', { chips: ['entweder … oder'] }),
  sent('Ten film byl sice dlouhý, ale vůbec ne nudný.', ['Der Film war zwar lang, aber überhaupt nicht langweilig.', 'Der Film war zwar lang, aber gar nicht langweilig.', 'Zwar war der Film lang, aber überhaupt nicht langweilig.', 'Zwar war der Film lang, aber gar nicht langweilig.'], 'zwar …, aber; „vůbec ne“ = überhaupt nicht / gar nicht.', { chips: ['zwar … aber'] })
]));

// ---------- D37: Konjunktiv II minulý ----------
sets.push(set({ id: 'konj2-past', group: 'pokr', title: 'Konjunktiv II minulý: hätte gemacht', tag: 'Konjunktiv II: minulost',
  desc: 'Kdybych byl věděl… Měl jsi přijít.',
  rule: 'Nereálná minulost (co se nestalo) = hätte / wäre + Partizip II. hätte u sloves, která mají Perfekt s haben, wäre u sloves s sein: Ich hätte dich angerufen. Ich wäre gekommen. S modálním slovesem: hätte + infinitiv + modální v infinitivu (Du hättest mich anrufen sollen).' }, [
  fill('Wenn ich das gewusst [hätte], wäre ich früher gekommen.', 'Kdybych to (byl) věděl, přišel bych dřív.', 'wissen má Perfekt s haben → hätte gewusst.'),
  fill('Wenn ich das gewusst hätte, [wäre] ich früher gekommen.', 'Kdybych to věděl, přišel bych dřív.', 'kommen má Perfekt se sein → wäre gekommen.', { traps: { hätte: 'kommen tvoří Perfekt se sein (ich bin gekommen) → v Konjunktivu wäre gekommen.' } }),
  fill('Ich [hätte] dir gern geholfen, aber ich war nicht da.', 'Rád bych ti byl pomohl, ale nebyl jsem tam.', 'helfen → hat geholfen → hätte geholfen.'),
  fill('Wir [wären] fast zu spät gekommen.', 'Málem jsme přišli pozdě.', 'fast + Konjunktiv II minulý = málem; kommen → wären.'),
  fill('Du hättest mich anrufen [sollen].', 'Měl jsi mi zavolat.', 'Modální: hätte + infinitiv + sollen (ne gesollt).', { traps: { gesollt: 'U modálních sloves v této konstrukci je infinitiv: hättest … anrufen sollen.' } }),
  fill('Wenn der Bus pünktlich gewesen [wäre], hätte ich den Zug nicht verpasst.', 'Kdyby autobus přijel včas, nezmeškal bych vlak.', 'sein → ist gewesen → wäre gewesen.'),
  fill('An deiner Stelle [hätte] ich das nicht gesagt.', 'Na tvém místě bych to neřekl.', 'sagen → hätte gesagt.'),
  fill('Ohne deine Hilfe [hätte] ich es nicht geschafft.', 'Bez tvé pomoci bych to nezvládl.', 'schaffen → hätte geschafft.'),
  fill('Wenn wir früher losgefahren [wären], hätten wir keinen Stau gehabt.', 'Kdybychom vyjeli dřív, nebyli bychom v zácpě.', 'losfahren → ist losgefahren → wären losgefahren.'),
  fill('Hättest du doch etwas [gesagt] (sagen)!', 'Kdybys tak něco řekl!', 'Přání v minulosti: Hättest du doch … gesagt!'),
  choice('Wenn ich mehr gelernt ___, hätte ich die Prüfung bestanden.', ['hätte', 'wäre', 'würde'], 0, 'Kdybych se víc učil, byl bych prošel zkouškou.', 'lernen → hat gelernt → hätte gelernt.'),
  choice('Ich ___ gern mitgefahren, aber ich war krank.', ['hätte', 'wäre', 'würde'], 1, 'Rád bych byl jel s vámi, ale byl jsem nemocný.', 'mitfahren → ist mitgefahren → wäre.'),
  choice('Was stimmt? „Měl jsi to říct dřív.“', ['Du hättest es früher sagen sollen.', 'Du hättest es früher gesagt sollen.', 'Du solltest es früher gesagt.'], 0, 'Měl jsi to říct dřív.', 'hätte + infinitiv + sollen.'),
  order('Wenn ich Zeit gehabt hätte, wäre ich mitgekommen.', 'Kdybych měl čas, byl bych šel s vámi.', 'Obě slovesa na konci svých vět; hlavní věta začíná slovesem wäre.'),
  order('Ich hätte nicht so viel essen sollen.', 'Neměl jsem jíst tolik.', 'hätte … essen sollen.'),
  sent('Kdybych to věděl, zavolal bych ti.', ['Wenn ich das gewusst hätte, hätte ich dich angerufen.', 'Wenn ich es gewusst hätte, hätte ich dich angerufen.', 'Hätte ich das gewusst, hätte ich dich angerufen.', 'Hätte ich das gewusst, hätte ich dich angerufen.'], 'Minulá nereálná podmínka: hätte gewusst, hätte angerufen. anrufen + 4. pád (dich).', { chips: ['gewusst', 'anrufen'] }),
  sent('Kdyby nepršelo, šli bychom na výlet.', ['Wenn es nicht geregnet hätte, wären wir wandern gegangen.', 'Wenn es nicht geregnet hätte, hätten wir einen Ausflug gemacht.', 'Wenn es nicht geregnet hätte, wären wir auf einen Ausflug gegangen.'], 'regnen → hätte geregnet; gehen → wären gegangen / Ausflug machen → hätten gemacht.', { chips: ['regnen', 'der Ausflug'] }),
  sent('Měl jsi mi to říct dřív.', ['Du hättest mir das früher sagen sollen.', 'Du hättest es mir früher sagen sollen.', 'Das hättest du mir früher sagen sollen.'], 'hättest + sagen + sollen; es mir (4. před 3.).', { chips: ['sollen'] })
]));

// ---------- D38: lassen a modální slovesa v Perfektu ----------
sets.push(set({ id: 'lassen-modal', group: 'slovesa', title: 'lassen a modální slovesa v Perfektu', tag: 'lassen / modální v Perfektu',
  desc: 'Ich lasse das Auto reparieren. Ich habe arbeiten müssen.',
  rule: 'lassen = nechat (udělat, dovolit): Ich lasse mir die Haare schneiden (nechám si ostříhat vlasy). V Perfektu s dalším infinitivem: hat … schneiden lassen (dvojitý infinitiv). Modální slovesa v Perfektu: samostatně gemusst, gekonnt, gewollt; s jiným slovesem dvojitý infinitiv: Ich habe arbeiten müssen. V běžné řeči se ale u modálních sloves dává přednost Präteritu: Ich musste arbeiten.' }, [
  fill('Ich [lasse] mein Auto in der Werkstatt reparieren.', 'Nechám si opravit auto v servisu.', 'lassen + infinitiv = nechat něco udělat.'),
  fill('Sie lässt sich die Haare [schneiden].', 'Nechává si stříhat vlasy.', 'lassen + infinitiv na konci.'),
  fill('[Lass] mich bitte in Ruhe!', 'Nech mě prosím na pokoji!', 'Rozkaz du: lass!'),
  fill('Ich habe meinen Schlüssel zu Hause [gelassen].', 'Nechal jsem klíč doma.', 'lassen samostatně (bez dalšího infinitivu) → gelassen.'),
  fill('Wir haben das Dach reparieren [lassen].', 'Nechali jsme opravit střechu.', 'S dalším infinitivem → lassen (ne gelassen).', { traps: { gelassen: 'Když je ve větě další infinitiv (reparieren), Perfekt má tvar „infinitiv + lassen“: haben … reparieren lassen.' } }),
  fill('Gestern habe ich lange arbeiten [müssen].', 'Včera jsem musel dlouho pracovat.', 'Modální + infinitiv v Perfektu: dvojitý infinitiv.', { traps: { gemusst: 'gemusst je jen bez dalšího slovesa (Ich habe es gemusst). Tady je arbeiten → arbeiten müssen.' } }),
  fill('Das habe ich nicht [gewollt].', 'To jsem nechtěl.', 'Bez dalšího infinitivu → gewollt.'),
  fill('Ich [musste] gestern lange arbeiten.', 'Včera jsem musel dlouho pracovat.', 'Běžnější: Präteritum modálního slovesa.'),
  fill('Lässt du mich mal [fahren]?', 'Necháš mě taky řídit?', 'lassen = dovolit.'),
  fill('Ich weiß nicht, ob ich das Auto reparieren lassen [kann].', 'Nevím, jestli můžu nechat opravit auto.', 'Ve vedlejší větě je časované sloveso úplně na konci, za dvojitým infinitivem.'),
  choice('Ich habe mir einen Anzug machen ___.', ['gelassen', 'lassen', 'lässt'], 1, 'Nechal jsem si ušít oblek.', 'Dvojitý infinitiv: machen lassen.'),
  choice('Er hat das nicht ___ (konnte to).', ['gekonnt', 'können'], 0, 'To nedokázal.', 'Bez dalšího infinitivu → gekonnt.'),
  choice('Wir haben nicht kommen ___.', ['gekonnt', 'können'], 1, 'Nemohli jsme přijít.', 'S infinitivem kommen → können.'),
  order('Ich lasse mir die Haare kurz schneiden.', 'Nechám si ostříhat vlasy nakrátko.', 'lasse na 2. místě, schneiden na konci.'),
  sent('Nechal jsem si poslat balík do práce.', ['Ich habe mir das Paket ins Büro schicken lassen.', 'Ich habe mir das Paket zur Arbeit schicken lassen.', 'Ich habe das Paket ins Büro schicken lassen.', 'Ich habe das Paket zur Arbeit schicken lassen.', 'Ich ließ mir das Paket ins Büro schicken.', 'Ich habe mir das Paket in die Arbeit schicken lassen.'], 'Perfekt: habe … schicken lassen (dvojitý infinitiv).', { chips: ['lassen', 'schicken'] }),
  sent('Včera jsem nemohl spát, protože sousedé dělali hluk.', ['Gestern konnte ich nicht schlafen, weil die Nachbarn Lärm gemacht haben.', 'Ich konnte gestern nicht schlafen, weil die Nachbarn Lärm gemacht haben.', 'Gestern konnte ich nicht schlafen, weil die Nachbarn laut waren.', 'Ich konnte gestern nicht schlafen, weil die Nachbarn laut waren.', 'Gestern habe ich nicht schlafen können, weil die Nachbarn Lärm gemacht haben.', 'Gestern konnte ich nicht schlafen, weil die Nachbarn Lärm machten.'], 'Modální sloveso v minulosti nejčastěji v Präteritu: konnte.', { chips: ['konnte', 'der Lärm'] })
]));

// ---------- D39: zpodstatnělá přídavná jména ----------
sets.push(set({ id: 'adj-nomen', group: 'dekl', title: 'Zpodstatnělá přídavná jména', tag: 'Zpodstatnělá přídavná jména',
  desc: 'der Deutsche, ein Bekannter, etwas Neues.',
  rule: 'Přídavné jméno použité jako podstatné jméno se píše velkým písmenem, ale skloňuje se jako přídavné jméno: der Deutsche – ein Deutscher; die Bekannte – eine Bekannte; die Erwachsenen – Erwachsene. Po etwas, nichts, viel, wenig je koncovka -es: etwas Neues, nichts Besonderes. Po alles je -e: alles Gute.' }, [
  fill('Mein Nachbar ist [Deutscher] (Deutsch-).', 'Můj soused je Němec.', 'Bez členu, m., 1. pád → Deutscher (jako ein guter → guter).', { traps: { deutsche: 'Bez členu v mužském rodě je koncovka -er: Er ist Deutscher. (der Deutsche jen se členem.)' } }),
  fill('Der [Deutsche] (Deutsch-), den ich kenne, heißt Jan.', 'Ten Němec, kterého znám, se jmenuje Jan.', 'Po der → -e.'),
  fill('Ich habe einen [Bekannten] (Bekannt-) in Wien.', 'Mám ve Vídni známého.', 'Po einen (4. pád m.) → -en.'),
  fill('Alles [Gute] (gut) zum Geburtstag!', 'Všechno nejlepší k narozeninám!', 'Po alles → -e, velké písmeno.'),
  fill('Gibt es etwas [Neues] (neu)?', 'Je něco nového?', 'Po etwas → -es, velké písmeno.', { traps: { neues: 'Zpodstatnělé přídavné jméno se píše velkým písmenem: etwas Neues.' } }),
  fill('Heute ist nichts [Besonderes] (besonder-) passiert.', 'Dnes se nestalo nic zvláštního.', 'Po nichts → -es.'),
  fill('Die [Erwachsenen] (erwachsen) zahlen zehn Euro, Kinder fünf.', 'Dospělí platí deset eur, děti pět.', 'Po die (mn. č.) → -en.'),
  fill('Der [Kranke] (krank) muss im Bett bleiben.', 'Nemocný musí zůstat v posteli.', 'Po der → -e.'),
  fill('Wir haben viel [Interessantes] (interessant) gesehen.', 'Viděli jsme mnoho zajímavého.', 'Po viel → -es.'),
  fill('Sie ist mit einem [Deutschen] (Deutsch-) verheiratet.', 'Je vdaná za Němce.', 'mit einem (3. pád) → -en.'),
  choice('Ich wünsche dir alles ___!', ['Liebe', 'Liebes', 'liebe'], 0, 'Přeju ti všechno nejlepší!', 'alles Liebe – po alles -e, velké písmeno.'),
  choice('Er ist ein ___ von mir.', ['Verwandte', 'Verwandter', 'Verwandten'], 1, 'Je to můj příbuzný.', 'ein + m. 1. pád → -er: ein Verwandter.'),
  choice('Hast du schon etwas ___ gegessen?', ['Süßes', 'süßes', 'Süße'], 0, 'Už jsi jedl něco sladkého?', 'etwas → -es + velké písmeno.'),
  sent('Ve vlaku jsem potkal jednoho známého z práce.', ['Im Zug habe ich einen Bekannten von der Arbeit getroffen.', 'Ich habe im Zug einen Bekannten von der Arbeit getroffen.', 'Im Zug traf ich einen Bekannten von der Arbeit.', 'Im Zug habe ich einen Bekannten aus der Arbeit getroffen.'], 'einen Bekannten (4. pád m.).', { chips: ['der Bekannte', 'treffen'] }),
  sent('Na tom večírku nebylo nic zajímavého.', ['Auf der Party gab es nichts Interessantes.', 'Auf der Feier gab es nichts Interessantes.', 'Auf der Party war nichts Interessantes.', 'Bei der Party gab es nichts Interessantes.'], 'nichts Interessantes (-es, velké I).', { chips: ['nichts'] })
]));

// ---------- D40: Nomen-Verb-Verbindungen ----------
sets.push(set({ id: 'nvv', group: 'slovesa', title: 'Ustálená spojení podstatné jméno + sloveso', tag: 'Spojení podstatné jméno + sloveso',
  desc: 'eine Entscheidung treffen, Rücksicht nehmen …',
  rule: 'V psané a formální němčině (B1 dopisy, e-maily) se místo jednoho slovesa často používá spojení podstatné jméno + sloveso. Sloveso nelze odvodit, je potřeba ho znát: eine Entscheidung treffen (rozhodnout se), eine Frage stellen (položit otázku), Bescheid geben/sagen (dát vědět), Rücksicht nehmen auf (brát ohled na), in Frage kommen (přicházet v úvahu), zur Verfügung stehen (být k dispozici), Kritik üben (kritizovat), einen Antrag stellen (podat žádost), Abschied nehmen (rozloučit se), eine Rolle spielen (hrát roli).' }, [
  fill('Wir müssen bald eine Entscheidung [treffen].', 'Musíme se brzy rozhodnout.', 'eine Entscheidung treffen.', { traps: { machen: 'Česky „udělat rozhodnutí“, ale německy eine Entscheidung treffen.' } }),
  fill('Darf ich Ihnen eine Frage [stellen]?', 'Smím vám položit otázku?', 'eine Frage stellen.', { traps: { geben: 'Otázku se v němčině „staví“: eine Frage stellen.', fragen: 'eine Frage stellen (položit otázku), nebo jen fragen – ne eine Frage fragen.' } }),
  fill('Gib mir bitte [Bescheid], wenn du ankommst.', 'Dej mi prosím vědět, až dorazíš.', 'Bescheid geben / sagen = dát vědět.'),
  fill('Bitte nehmen Sie [Rücksicht] auf die Nachbarn.', 'Berte prosím ohled na sousedy.', 'Rücksicht nehmen auf + 4. pád.'),
  fill('Geld spielt für mich keine große [Rolle].', 'Peníze pro mě nehrají velkou roli.', 'eine Rolle spielen.'),
  fill('Der Raum [steht] Ihnen ab 9 Uhr zur Verfügung.', 'Místnost je vám k dispozici od 9 hodin.', 'zur Verfügung stehen.'),
  fill('Ich habe einen Antrag auf Elterngeld [gestellt].', 'Podal jsem žádost o rodičovský příspěvek.', 'einen Antrag stellen.'),
  fill('Dieser Termin kommt leider nicht in [Frage].', 'Tento termín bohužel nepřichází v úvahu.', 'in Frage kommen.'),
  fill('Kannst du mir einen [Gefallen] tun?', 'Můžeš mi udělat laskavost?', 'jemandem einen Gefallen tun.'),
  fill('Wir müssen jetzt [Abschied] nehmen.', 'Teď se musíme rozloučit.', 'Abschied nehmen.'),
  fill('Die Firma hat ihm ein gutes Angebot [gemacht].', 'Firma mu udělala dobrou nabídku.', 'ein Angebot machen.'),
  fill('Ich möchte einen Termin [vereinbaren|ausmachen].', 'Chtěl bych si domluvit termín.', 'einen Termin vereinbaren (formálně) / ausmachen (hovorově).'),
  choice('Er hat großen Einfluss auf mich ___.', ['gemacht', 'gehabt', 'gestellt'], 1, 'Měl na mě velký vliv.', 'Einfluss haben auf + 4. pád.'),
  choice('Ich muss noch eine wichtige Entscheidung ___.', ['machen', 'treffen', 'stellen'], 1, 'Musím ještě udělat důležité rozhodnutí.', 'eine Entscheidung treffen.'),
  choice('Können Sie mir bitte Auskunft ___?', ['geben', 'machen', 'stellen'], 0, 'Můžete mi prosím podat informaci?', 'Auskunft geben = poskytnout informaci.'),
  sent('Dejte mi prosím vědět, jestli termín přichází v úvahu.', ['Geben Sie mir bitte Bescheid, ob der Termin in Frage kommt.', 'Sagen Sie mir bitte Bescheid, ob der Termin in Frage kommt.', 'Bitte geben Sie mir Bescheid, ob der Termin in Frage kommt.', 'Geben Sie mir bitte Bescheid, ob der Termin infrage kommt.', 'Bitte geben Sie mir Bescheid, ob der Termin infrage kommt.'], 'Bescheid geben + ob … kommt (in Frage kommen, kommt na konci).', { chips: ['Bescheid geben', 'in Frage kommen'] }),
  sent('Musel jsem se rychle rozhodnout.', ['Ich musste schnell eine Entscheidung treffen.', 'Ich musste mich schnell entscheiden.', 'Ich habe schnell eine Entscheidung treffen müssen.'], 'eine Entscheidung treffen (nebo sich entscheiden). Minulost modálního: musste.', { chips: ['die Entscheidung'] })
]));

sets.push(set({ id: 'veta-w6', group: 'preklad', title: 'Překlad vět: týden 6', tag: 'Překlad vět', n: 6,
  desc: 'B1 souvětí: dvojité spojky, minulý Konjunktiv, lassen.',
  rule: 'Kontroluj: hätte × wäre podle slovesa, dvojitý infinitiv na konci a dvojité spojky (weder … noch bez dalšího záporu).' }, [
  sent('Kdybych byl věděl, že je obchod zavřený, nebyl bych tam jezdil.', ['Wenn ich gewusst hätte, dass das Geschäft geschlossen ist, wäre ich nicht dorthin gefahren.', 'Wenn ich gewusst hätte, dass der Laden geschlossen ist, wäre ich nicht dorthin gefahren.', 'Wenn ich gewusst hätte, dass das Geschäft zu ist, wäre ich nicht hingefahren.', 'Wenn ich gewusst hätte, dass das Geschäft geschlossen war, wäre ich nicht dorthin gefahren.', 'Hätte ich gewusst, dass das Geschäft geschlossen ist, wäre ich nicht dorthin gefahren.', 'Wenn ich gewusst hätte, dass der Laden zu ist, wäre ich nicht hingefahren.'], 'hätte gewusst (wissen – haben), wäre gefahren (fahren – sein); dass … ist uprostřed.', { chips: ['hätte', 'wäre', 'dass'] }),
  sent('Neumím ani vařit, ani péct, ale moje přítelkyně vaří jak česká, tak italská jídla.', ['Ich kann weder kochen noch backen, aber meine Freundin kocht sowohl tschechische als auch italienische Gerichte.', 'Ich kann weder kochen noch backen, aber meine Freundin kocht sowohl tschechisches als auch italienisches Essen.', 'Ich kann weder kochen noch backen, aber meine Freundin kocht sowohl tschechische als auch italienische Speisen.'], 'weder … noch (bez nicht); sowohl … als auch; tschechische Gerichte (bez členu mn. č. → -e).', { chips: ['weder … noch', 'sowohl … als auch'] }),
  sent('Minulý týden jsem si nechal opravit kolo, protože jsem ho sám opravit nemohl.', ['Letzte Woche habe ich mein Fahrrad reparieren lassen, weil ich es selbst nicht reparieren konnte.', 'Letzte Woche habe ich mein Fahrrad reparieren lassen, weil ich es nicht selbst reparieren konnte.', 'Letzte Woche ließ ich mein Fahrrad reparieren, weil ich es selbst nicht reparieren konnte.', 'Letzte Woche habe ich mein Rad reparieren lassen, weil ich es selbst nicht reparieren konnte.', 'Letzte Woche habe ich mein Fahrrad reparieren lassen, weil ich es selbst nicht reparieren kann.'], 'habe … reparieren lassen (dvojitý infinitiv); weil … reparieren konnte.', { chips: ['lassen', 'weil'] }),
  sent('Měl jsi mi dát vědět, že nepřijdeš, abych na tebe nečekal.', ['Du hättest mir Bescheid geben sollen, dass du nicht kommst, damit ich nicht auf dich warte.', 'Du hättest mir Bescheid sagen sollen, dass du nicht kommst, damit ich nicht auf dich warte.', 'Du hättest mir Bescheid geben sollen, dass du nicht kommst, damit ich nicht auf dich gewartet hätte.', 'Du hättest mir Bescheid geben sollen, dass du nicht kommst, dann hätte ich nicht auf dich gewartet.', 'Du hättest mir sagen sollen, dass du nicht kommst, damit ich nicht auf dich warte.'], 'hättest … geben sollen; dass … kommst; damit (různé podměty) … warte.', { chips: ['Bescheid geben', 'damit'] }),
  sent('Je to sice drahé, ale kvalita hraje větší roli než cena.', ['Es ist zwar teuer, aber die Qualität spielt eine größere Rolle als der Preis.', 'Das ist zwar teuer, aber die Qualität spielt eine größere Rolle als der Preis.', 'Zwar ist es teuer, aber die Qualität spielt eine größere Rolle als der Preis.'], 'zwar … aber; eine größere Rolle spielen; als (srovnání).', { chips: ['zwar … aber', 'eine Rolle spielen'] }),
  sent('Na schůzce jsem potkal jednoho Němce, který mi nabídl práci v Mnichově.', ['Bei der Besprechung habe ich einen Deutschen getroffen, der mir eine Stelle in München angeboten hat.', 'Bei dem Treffen habe ich einen Deutschen getroffen, der mir eine Stelle in München angeboten hat.', 'Bei der Besprechung habe ich einen Deutschen getroffen, der mir einen Job in München angeboten hat.', 'Bei dem Treffen habe ich einen Deutschen kennengelernt, der mir eine Arbeit in München angeboten hat.', 'Beim Treffen habe ich einen Deutschen getroffen, der mir eine Stelle in München angeboten hat.', 'Bei dem Meeting habe ich einen Deutschen getroffen, der mir einen Job in München angeboten hat.'], 'einen Deutschen (4. pád zpodstatnělého adj.); der … angeboten hat.', { chips: ['der Deutsche', 'anbieten'] })
]));

sets.push(set({ id: 'ctest-11', group: 'cteni', title: 'C-Test: Ein verpasster Zug', n: 1, all: true, kindLabel: 'C-Test', tag: 'C-Test' }, [{
  id: 'ct-w6', kind: 'ctest', title: 'C-Test: Ein verpasster Zug', tag: 'C-Test', gaps: 20,
  short: 'Správně doplněné slovo je celé v textu výše.',
  text: 'Letzten Montag hatte ich einen wichtigen Termin in Wien. Ich wollte {{entw|eder|Dvojitá spojka|entweder … oder}} den Zug um sieben oder {{d|en||}} um acht nehmen. Leider habe {{i|ch||}} verschlafen, weil ich {{wed|er|Dvojitá spojka|weder … noch}} den Wecker noch mein {{Han|dy||}} gehört habe. Als ich am {{Bahn|hof||}} ankam, war der {{Zu|g||}} schon weg. Wenn ich {{frü|her|Stupňování|2. stupeň}} aufgestanden wäre, {{hät|te|Konjunktiv II|minulost}} ich ihn erreicht. Ich musste {{mein|en|Člen|4. pád m.}} Chef anrufen und {{i|hm|Zájmeno|3. pád}} Bescheid geben. Zum {{Glü|ck||}} war er sehr {{verstän|dnisvoll||}}. Er sagte, dass der {{Ter|min||}} zwar wichtig sei, {{ab|er|Dvojitá spojka|zwar … aber}} auch verschoben werden {{kön|ne||}}. Seitdem lasse ich {{mi|ch|Zvratné|4. pád}} jeden Morgen von zwei {{Wec|kern||}} wecken.',
  tr: 'Minulé pondělí jsem měl důležitou schůzku ve Vídni. Chtěl jsem jet buď vlakem v sedm, nebo tím v osm. Bohužel jsem zaspal, protože jsem neslyšel ani budík, ani mobil. Když jsem přišel na nádraží, vlak už byl pryč. Kdybych vstal dřív, stihl bych ho. Musel jsem zavolat šéfovi a dát mu vědět. Naštěstí byl velmi chápavý. Řekl, že schůzka je sice důležitá, ale dá se i přesunout. Od té doby se nechávám každé ráno budit dvěma budíky.'
}]));

const p11 = { title: 'Leserbrief: Mehr Grün in der Stadt', text: 'Seit Jahren wird in unserer Stadt viel gebaut, aber neue Parks entstehen kaum. Zwar gibt es den großen Stadtpark, aber für Familien im Norden ist er zu weit weg. Ich hätte mir gewünscht, dass auf dem alten Fabrikgelände ein Park entsteht und nicht ein weiteres Einkaufszentrum. Die Stadt sagt, dass das Geld weder für den Park noch für die Pflege reiche. Das glaube ich nicht: Für die neue Tiefgarage war ja auch Geld da. Ich schlage vor, dass die Bürger selbst mitentscheiden dürfen, was mit freien Flächen passiert.\n\nKarin Vogel, Nordviertel', tr: 'Čtenářský dopis: Víc zeleně ve městě\n\nV našem městě se už roky hodně staví, ale nové parky skoro nevznikají. Sice máme velký městský park, ale pro rodiny na severu je moc daleko. Přála bych si, aby na starém areálu továrny vznikl park, a ne další nákupní centrum. Město říká, že peníze nestačí ani na park, ani na údržbu. Tomu nevěřím: na nové podzemní garáže peníze byly. Navrhuji, aby o tom, co se stane s volnými plochami, mohli spolurozhodovat sami občané.\n\nKarin Vogel, Severní čtvrť' };
sets.push(set({ id: 'read-11', group: 'cteni', title: 'Čtení: Leserbrief', n: 3, all: true, kindLabel: 'Čtení', tag: 'Čtení' }, [
  choice('Was ist auf dem alten Fabrikgelände geplant?', ['Ein Park', 'Ein Einkaufszentrum', 'Eine Tiefgarage'], 1, 'Co je plánované na starém areálu továrny?', 'Park by si autorka jen přála (hätte mir gewünscht). Ve skutečnosti: „und nicht ein weiteres Einkaufszentrum“.', { passage: p11, evidence: '„Ich hätte mir gewünscht, dass … ein Park entsteht und nicht ein weiteres Einkaufszentrum.“', optTr: ['Park', 'Nákupní centrum', 'Podzemní garáže'], tag: 'Čtení: Konjunktiv = nereálné' }),
  choice('Warum ist der Stadtpark für Familien im Norden nicht ideal?', ['Er ist zu klein.', 'Er ist zu weit weg.', 'Er wird nicht gepflegt.'], 1, 'Proč městský park není pro rodiny na severu ideální?', '„zu weit weg“ = příliš daleko.', { passage: p11, evidence: '„für Familien im Norden ist er zu weit weg“', optTr: ['Je moc malý.', 'Je moc daleko.', 'Není udržovaný.'], tag: 'Čtení: záměna slov' }),
  choice('Was schlägt Frau Vogel vor?', ['Die Bürger sollen mitentscheiden.', 'Die Stadt soll eine Tiefgarage bauen.', 'Der Stadtpark soll größer werden.'], 0, 'Co paní Vogelová navrhuje?', '„Ich schlage vor, dass die Bürger selbst mitentscheiden dürfen“.', { passage: p11, evidence: '„Ich schlage vor, dass die Bürger selbst mitentscheiden dürfen“', optTr: ['Občané mají spolurozhodovat.', 'Město má postavit garáže.', 'Městský park se má zvětšit.'], tag: 'Čtení: hlavní myšlenka' })
]));

sets.push(set({ id: 'write-w6', group: 'cteni', title: 'Psaní: Co bych udělal jinak', n: 1, all: true, kindLabel: 'Psaní', tag: 'Psaní' }, [
  write({ prompt: 'Eine Situation, in der etwas schiefgegangen ist. Was ist passiert, und was hättest du anders gemacht? Schreib 80–110 Wörter. Benutze mindestens drei Sätze mit hätte/wäre + Partizip II und zwei Doppelkonjunktionen (zwar … aber, weder … noch, entweder … oder, nicht nur … sondern auch).',
    tr: 'Situace, kdy se něco pokazilo. Co se stalo a co bys udělal jinak? Napiš 80–110 slov. Použij aspoň tři věty s hätte/wäre + Partizip II a dvě dvojité spojky (zwar … aber, weder … noch, entweder … oder, nicht nur … sondern auch).',
    minWords: 80, words: ['hätte … gemacht, wäre … gegangen', 'zwar … aber, weder … noch'],
    check: [{ re: '\\b(hätte|hättest|hätten|wäre|wärst|wären)\\b[^.]*\\b(ge\\w+|\\w+iert|\\w+en)\\b', min: 3, label: '3× hätte/wäre + Partizip II' }, { re: '\\b(zwar|weder|entweder|sowohl|nicht nur)\\b', min: 2, label: '2 dvojité spojky' }],
    model: 'Letzten Sommer wollte ich mit Freunden in die Berge fahren. Wir hatten zwar ein Auto, aber keine Reservierung für die Hütte. Als wir ankamen, war die Hütte voll, und wir hatten weder ein Zelt noch Schlafsäcke dabei. Wenn wir früher reserviert hätten, hätten wir dort übernachten können. Wir sind dann spät in der Nacht zurückgefahren. Heute weiß ich: Ich hätte mich besser informieren sollen. Ich wäre auch lieber mit dem Zug gefahren, weil der Fahrer sehr müde war. Nächstes Mal plane ich nicht nur die Fahrt, sondern auch die Übernachtung.' })
]));

vocabSets.push(vocab({ id: 'vocab-schule', topic: 'škola a vzdělání', title: 'Škola a vzdělání' }, [
  'die Bildung = vzdělání', 'das Fach, Fächer = předmět (ve škole)', 'die Note, -n = známka', 'das Abitur = maturita', 'die Hochschule, -n = vysoká škola',
  'das Semester, - = semestr', 'die Vorlesung, -en = přednáška', 'der Abschluss, Abschlüsse = ukončení studia, diplom', 'die Weiterbildung, -en = další vzdělávání', 'das Stipendium, Stipendien = stipendium',
  'die Hausaufgabe, -n = domácí úkol', 'der Unterricht = výuka', 'die Kenntnisse (Pl.) = znalosti', 'bestehen (bestand, hat bestanden) = složit (zkoušku)', 'durchfallen (fiel durch, ist durchgefallen) = propadnout',
  'wiederholen (wiederholte, hat wiederholt) = opakovat', 'sich vorbereiten auf + Akk. (bereitete vor, hat vorbereitet) = připravovat se na', 'unterrichten (unterrichtete, hat unterrichtet) = vyučovat', 'mündlich = ústní', 'schriftlich = písemný'
]));
vocabSets.push(vocab({ id: 'vocab-bank', topic: 'banka a peníze', title: 'Banka a peníze' }, [
  'das Konto, Konten = účet', 'die Überweisung, -en = převod', 'der Geldautomat, -en = bankomat', 'die Karte, -n = karta', 'das Bargeld = hotovost',
  'die Gebühr, -en = poplatek', 'der Kredit, -e = úvěr', 'die Zinsen (Pl.) = úroky', 'die Rechnung, -en = faktura, účet', 'der Betrag, Beträge = částka',
  'die Ausgaben (Pl.) = výdaje', 'die Einnahmen (Pl.) = příjmy', 'die Steuer, -n = daň', 'abheben (hob ab, hat abgehoben) = vybrat (peníze)', 'überweisen (überwies, hat überwiesen) = převést',
  'eröffnen (eröffnete, hat eröffnet) = založit (účet)', 'leihen (lieh, hat geliehen) = půjčit', 'ausgeben (gab aus, hat ausgegeben) = utratit', 'pleite = na mizině', 'sparsam = šetrný'
]));
vocabSets.push(vocab({ id: 'vocab-restaurant', topic: 'restaurace a jídlo', title: 'Restaurace a jídlo' }, [
  'die Speisekarte, -n = jídelní lístek', 'die Vorspeise, -n = předkrm', 'die Hauptspeise, -n = hlavní chod', 'die Nachspeise, -n = dezert', 'das Gericht, -e = jídlo, pokrm',
  'die Beilage, -n = příloha', 'die Bedienung = obsluha', 'das Trinkgeld = spropitné', 'die Reservierung, -en = rezervace', 'der Geschmack, Geschmäcker = chuť',
  'das Gewürz, -e = koření', 'bestellen (bestellte, hat bestellt) = objednat', 'empfehlen (empfahl, hat empfohlen) = doporučit', 'probieren (probierte, hat probiert) = ochutnat', 'zahlen (zahlte, hat gezahlt) = platit',
  'scharf = pálivý, ostrý', 'satt = sytý, najedený', 'vegetarisch = vegetariánský', 'getrennt = zvlášť (platit)', 'zusammen = dohromady'
]));

const T = {};
T.dk = theory(
  ['tbl', ['spojka', 'česky', 'příklad'], [['sowohl … als auch', 'jak …, tak i', 'sowohl Tee als auch Kaffee'], ['weder … noch', 'ani …, ani', 'weder Zeit noch Geld'], ['entweder … oder', 'buď …, nebo', 'entweder heute oder morgen'], ['nicht nur …, sondern auch', 'nejen …, ale i', 'nicht nur schön, sondern auch billig'], ['zwar …, aber', 'sice …, ale', 'zwar teuer, aber gut'], ['je …, desto', 'čím …, tím', 'je mehr, desto besser']]],
  ['tip', 'weder … noch už samo je zápor. Česky „nemám ani čas, ani peníze“, německy Ich habe weder Zeit noch Geld – žádné kein navíc.'],
  'Když dvojitá spojka (entweder, weder, zwar) stojí na začátku věty, zabírá 1. místo: Zwar ist es teuer, aber …'
);
T.k2p = theory(
  'Minulý Konjunktiv II popisuje, co se NEstalo, ale mohlo se stát (česky „byl bych udělal“, „kdybych byl věděl“).',
  ['tbl', ['Perfekt', 'Konjunktiv II minulý'], [['ich habe gemacht', 'ich hätte gemacht'], ['ich bin gekommen', 'ich wäre gekommen'], ['ich habe arbeiten müssen', 'ich hätte arbeiten müssen']]],
  ['ex', ['Wenn ich Zeit gehabt hätte, wäre ich gekommen.', 'Kdybych měl čas, byl bych přišel.'], ['Du hättest früher losfahren sollen.', 'Měl jsi vyjet dřív.'], ['Fast wäre ich gefallen.', 'Málem jsem upadl.']],
  ['tip', 'hätte nebo wäre? Stejně jako v Perfektu: pohyb a změna stavu → wäre, ostatní → hätte.']
);
T.lm = theory(
  ['h', 'lassen'],
  ['ex', ['Ich lasse das Auto reparieren.', 'Nechám (si) opravit auto. (někdo jiný to udělá)'], ['Lass mich schlafen!', 'Nech mě spát! (dovol)'], ['Ich habe das Handy zu Hause gelassen.', 'Nechal jsem mobil doma. (samostatně → gelassen)'], ['Ich habe das Auto reparieren lassen.', 'Nechal jsem opravit auto. (s infinitivem → lassen)']],
  ['h', 'Modální slovesa v minulosti'],
  ['tbl', ['typ', 'příklad'], [['Präteritum (nejběžnější)', 'Ich musste arbeiten.'], ['Perfekt s infinitivem', 'Ich habe arbeiten müssen.'], ['Perfekt samostatně', 'Ich habe es gemusst. / Das habe ich nicht gewollt.']]],
  ['tip', 'Dvojitý infinitiv ve vedlejší větě: …, weil ich habe arbeiten müssen (haben stojí PŘED oběma infinitivy). To je výjimka z pravidla „sloveso na konci“ – v mluvené řeči se jí vyhneš Präteritem: …, weil ich arbeiten musste.']
);
T.an = theory(
  'Z přídavného jména se dá udělat podstatné jméno – píše se velkým písmenem, ale koncovky zůstávají „přídavné“.',
  ['tbl', ['', 'm.', 'ž.', 'mn. č.'], [['se členem', 'der Deutsche', 'die Deutsche', 'die Deutschen'], ['s ein / bez členu', 'ein Deutscher', 'eine Deutsche', 'Deutsche'], ['3. pád', 'dem Deutschen', 'der Deutschen', 'den Deutschen']]],
  'Takto fungují: der/die Bekannte (známý/á), Verwandte (příbuzný/á), Erwachsene (dospělý/á), Kranke, Arbeitslose, Jugendliche, Angestellte (zaměstnanec).',
  ['ex', ['etwas Neues, nichts Besonderes, viel Gutes', 'po etwas / nichts / viel / wenig → -es'], ['alles Gute, alles Liebe', 'po alles → -e']]
);
T.nvv = theory(
  'V úředních dopisech a e-mailech (část Schreiben v B1) se hodí ustálená spojení. Sloveso se musíš naučit spolu s podstatným jménem.',
  ['tbl', ['spojení', 'česky', 'jednoduše'], [['eine Entscheidung treffen', 'rozhodnout se', 'sich entscheiden'], ['eine Frage stellen', 'položit otázku', 'fragen'], ['Bescheid geben / sagen', 'dát vědět', 'informieren'], ['einen Antrag stellen', 'podat žádost', 'beantragen'], ['Rücksicht nehmen auf', 'brát ohled na', ''], ['zur Verfügung stehen', 'být k dispozici', ''], ['in Frage kommen', 'přicházet v úvahu', ''], ['eine Rolle spielen', 'hrát roli', ''], ['einen Termin vereinbaren', 'domluvit termín', ''], ['Abschied nehmen', 'rozloučit se', 'sich verabschieden']]],
  ['tip', 'Nejčastější chyba: doslovné „machen“ – eine Entscheidung machen ✗, eine Frage machen ✗.']
);

const days = [
  { title: 'Dvojité spojky', theory: T.dk, blocks: [['doppelkonj', 12, 'sowohl … als auch, weder … noch'], ['vocab-schule', 10, 'Slovíčka: škola'], ['__due', 12, 'Dnešní opakování']] },
  { title: 'Konjunktiv II minulý', theory: T.k2p, blocks: [['konj2-past', 12, 'hätte gemacht, wäre gekommen'], ['konj2', 6, 'Opakování: Konjunktiv II'], ['temporal', 6, 'Opakování: als / wenn']] },
  { title: 'lassen a modální slovesa v minulosti', theory: T.lm, blocks: [['lassen-modal', 12, 'lassen, habe … müssen'], ['vocab-bank', 10, 'Slovíčka: banka'], ['__due', 12, 'Dnešní opakování']] },
  { title: 'Zpodstatnělá přídavná jména', theory: T.an, blocks: [['adj-nomen', 12, 'der Deutsche, etwas Neues'], ['adj-mix', 8, 'Opakování: koncovky'], ['passiv-2', 6, 'Opakování: pasivum']] },
  { title: 'Spojení podstatné jméno + sloveso', theory: T.nvv, blocks: [['nvv', 12, 'eine Entscheidung treffen …'], ['vocab-restaurant', 10, 'Slovíčka: restaurace'], ['__due', 12, 'Dnešní opakování']] },
  { title: 'Opakování týdne', blocks: [['w6-mix', 14, 'Mix týdne 6'], ['__weak', 12, 'Tvoje slabá místa'], ['vocab-w6', 12, 'Slovíčka týdne'], ['read-11', 3, 'Čtení: čtenářský dopis']] },
  { title: 'Test týdne a delší věty', blocks: [['veta-w6', 6, 'Překlad delších vět'], ['ctest-11', 1, 'C-Test: zmeškaný vlak'], ['write-w6', 1, 'Psaní: co bych udělal jinak'], ['__wrong', 15, 'Opakování chyb']] }
];
sets.push(set({ id: 'w6-mix', group: 'pokr', title: 'Mix: týden 6', n: 14, refs: ['doppelkonj', 'konj2-past', 'lassen-modal', 'adj-nomen', 'nvv'] }));
sets.push(set({ id: 'vocab-w6', group: 'slov', title: 'Slovíčka: týden 6', n: 12, refs: ['vocab-schule', 'vocab-bank', 'vocab-restaurant'] }));

module.exports = { week: 6, title: 'Struktury B1', desc: 'Dvojité spojky, minulý Konjunktiv, lassen, ustálená spojení.', sets, vocabSets, days };
