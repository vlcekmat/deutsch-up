'use strict';
const { fill, choice, order, sent, write, theory, set, vocab } = require('./lib');

const sets = [];
const vocabSets = [];

// ---------- D15: časové spojky ----------
sets.push(set({ id: 'temporal', group: 'veta', title: 'als, wenn, während, bevor, nachdem', tag: 'Spojky: časové věty',
  desc: 'Kdy se co stalo: časové vedlejší věty.',
  rule: 'als = když (jednou v minulosti), wenn = když (opakovaně, nebo v přítomnosti/budoucnosti), während = zatímco, bevor = než, nachdem = poté co, seit(dem) = od té doby co, bis = dokud ne / až. Všechny uvozují vedlejší větu → sloveso na konci.' }, [
  fill('[Als] (když) ich ein Kind war, wohnten wir in Ostrava.', 'Když jsem byl dítě, bydleli jsme v Ostravě.', 'Jednorázový stav/událost v minulosti → als.', { traps: { wenn: 'wenn se v minulosti používá jen pro opakované děje („pokaždé když“). Dětství je jedno období → als.' } }),
  fill('[Wenn] (vždycky když) ich nach Wien fuhr, besuchte ich meine Tante.', 'Pokaždé, když jsem jel do Vídně, navštívil jsem tetu.', 'Opakovaně v minulosti („pokaždé když“) → wenn.', { traps: { als: 'als je jen pro jednu událost v minulosti. Tady se to opakovalo (pokaždé) → wenn.' } }),
  fill('[Als] (když) ich gestern nach Hause kam, war niemand da.', 'Když jsem včera přišel domů, nikdo tam nebyl.', 'Jedna konkrétní událost v minulosti (gestern) → als.'),
  fill('[Wenn] (až) du in Berlin bist, ruf mich an!', 'Až budeš v Berlíně, zavolej mi!', 'Budoucnost → wenn (česky „až“).'),
  fill('[Während] (zatímco) ich koche, deckst du den Tisch.', 'Zatímco vařím, ty prostřeš stůl.', 'Dva děje současně → während.'),
  fill('[Bevor] (než) du gehst, mach bitte das Licht aus.', 'Než odejdeš, zhasni prosím.', 'bevor = než (předtím než).', { traps: { vor: 'vor je předložka (vor dem Essen). Před vedlejší větou se sloveskem je spojka bevor.' } }),
  fill('[Nachdem] (poté co) wir gegessen hatten, gingen wir spazieren.', 'Poté co jsme se najedli, šli jsme na procházku.', 'nachdem = poté co; děj ve vedlejší větě je dřív, proto Plusquamperfekt (gegessen hatten).', { traps: { nach: 'nach je předložka (nach dem Essen). Spojka je nachdem.' } }),
  fill('[Seit|Seitdem] (od té doby, co) ich in Prag wohne, fahre ich nicht mehr Auto.', 'Od té doby, co bydlím v Praze, už nejezdím autem.', 'seit / seitdem = od té doby, co (děj trvá dodnes, proto přítomný čas).'),
  fill('Warte hier, [bis] (dokud ne / až) ich zurückkomme.', 'Počkej tady, dokud se nevrátím.', 'bis = až / dokud ne. Pozor: česky se zápor, německy ne.', { traps: {} }),
  fill('Nachdem er die E-Mail geschrieben [hatte] (haben), schaltete er den Computer aus.', 'Poté co napsal e-mail, vypnul počítač.', 'Po nachdem v minulosti: Plusquamperfekt = hatte/war + příčestí.', { traps: { hat: 'Hlavní věta je v Präteritu (schaltete aus), děj po nachdem byl ještě dřív → Plusquamperfekt: hatte.' } }),
  choice('___ ich 18 wurde, habe ich den Führerschein gemacht.', ['Als', 'Wenn', 'Während'], 0, 'Když mi bylo 18, udělal jsem si řidičák.', 'Jedna událost v minulosti → als.'),
  choice('Immer ___ es regnet, bleibe ich zu Hause.', ['als', 'wenn', 'bevor'], 1, 'Vždycky když prší, zůstanu doma.', 'Opakovaně (immer) → wenn.'),
  choice('Ich lese oft, ___ ich mit dem Zug fahre.', ['während', 'nachdem', 'bis'], 0, 'Často čtu, když jedu vlakem.', 'Současně → während (zatímco / během toho, co).'),
  choice('Bitte putz dir die Zähne, ___ du ins Bett gehst.', ['nachdem', 'bevor', 'seit'], 1, 'Vyčisti si prosím zuby, než půjdeš do postele.', 'Nejdřív zuby, potom postel → bevor (než).'),
  order('Als ich in Deutschland ankam, sprach ich kaum Deutsch.', 'Když jsem přijel do Německa, skoro jsem nemluvil německy.', 'als + sloveso na konci (ankam dohromady); hlavní věta začíná slovesem sprach.'),
  order('Bevor ich zur Arbeit gehe, trinke ich einen Kaffee.', 'Než jdu do práce, vypiju kávu.', 'bevor … gehe, trinke ich …'),
  sent('Když jsem byl v Mnichově poprvé, všechno mi připadalo drahé.', ['Als ich zum ersten Mal in München war, fand ich alles teuer.', 'Als ich das erste Mal in München war, fand ich alles teuer.', 'Als ich zum ersten Mal in München war, kam mir alles teuer vor.', 'Als ich das erste Mal in München war, kam mir alles teuer vor.'], 'Jednou v minulosti → als. Vedlejší věta první → hlavní začíná slovesem fand.', { chips: ['als', 'zum ersten Mal'] }),
  sent('Poté co jsem dokončil studium, odstěhoval jsem se do Brna.', ['Nachdem ich mein Studium beendet hatte, bin ich nach Brno gezogen.', 'Nachdem ich mein Studium abgeschlossen hatte, bin ich nach Brno gezogen.', 'Nachdem ich mein Studium beendet hatte, zog ich nach Brno.', 'Nachdem ich mein Studium abgeschlossen hatte, zog ich nach Brno.', 'Nachdem ich das Studium abgeschlossen hatte, zog ich nach Brno.', 'Nachdem ich das Studium beendet hatte, zog ich nach Brno.'], 'nachdem + Plusquamperfekt (abgeschlossen hatte); hlavní věta v Perfektu nebo Präteritu.', { chips: ['nachdem', 'das Studium abschließen'] }),
  sent('Zatímco děti spaly, uklidili jsme celý byt.', ['Während die Kinder schliefen, haben wir die ganze Wohnung aufgeräumt.', 'Während die Kinder schliefen, räumten wir die ganze Wohnung auf.', 'Während die Kinder geschlafen haben, haben wir die ganze Wohnung aufgeräumt.'], 'während = zatímco; schlafen → schliefen (silné sloveso).', { chips: ['während', 'aufräumen'] })
]));

// ---------- D16: obwohl / damit / um…zu ----------
sets.push(set({ id: 'final-konz', group: 'veta', title: 'obwohl × trotzdem, damit × um … zu', tag: 'Spojky: přípustka a účel',
  desc: 'I když, přesto, aby.',
  rule: 'obwohl = i když (vedlejší věta, sloveso na konci) × trotzdem = přesto (1. místo, inverze). Účel „aby“: um … zu + infinitiv, když je podmět obou vět stejný; damit + vedlejší věta, když jsou podměty různé.' }, [
  fill('[Obwohl] (i když) es regnet, gehen wir spazieren.', 'I když prší, jdeme na procházku.', 'Sloveso regnet je na konci → vedlejší věta → obwohl.', { traps: { trotzdem: 'trotzdem = přesto a nemění slovosled na konec. „I když + sloveso na konci“ = obwohl.' } }),
  fill('Es regnet, [trotzdem] (přesto) gehen wir spazieren.', 'Prší, přesto jdeme na procházku.', 'Za mezerou je hned sloveso gehen → trotzdem (inverze).', { traps: { obwohl: 'Po obwohl by sloveso bylo na konci (obwohl es regnet). Tady následuje gehen wir → trotzdem.' } }),
  fill('Ich lerne Deutsch, [um] in Deutschland zu arbeiten.', 'Učím se německy, abych pracoval v Německu.', 'Stejný podmět (ich – ich) → um … zu + infinitiv.'),
  fill('Ich spreche langsam, [damit] (aby) du mich verstehst.', 'Mluvím pomalu, abys mi rozuměl.', 'Různé podměty (ich × du) → damit + vedlejší věta.', { traps: { um: 'um … zu jde jen při stejném podmětu. Tady mluvím já, ale rozumět máš ty → damit.' } }),
  fill('Er spart Geld, um ein Auto [zu kaufen] (koupit).', 'Šetří peníze, aby si koupil auto.', 'um … zu + infinitiv na konci: zu kaufen.'),
  fill('Ich stehe früh auf, um den Bus nicht [zu verpassen] (zmeškat).', 'Vstávám brzy, abych nezmeškal autobus.', 'nicht stojí před zu + infinitiv.'),
  fill('Sie ruft an, um sich [anzumelden] (přihlásit se).', 'Volá, aby se přihlásila.', 'Odlučitelné sloveso: zu se vkládá mezi předponu a kmen → anzumelden.', { traps: { 'zu anmelden': 'U odlučitelných sloves je zu uvnitř slova: an-zu-melden.' } }),
  fill('Er arbeitet viel, [obwohl] (i když) er krank ist.', 'Pracuje hodně, i když je nemocný.', 'Sloveso ist na konci → obwohl.'),
  fill('Es war so kalt, [dass] (že) wir zu Hause geblieben sind.', 'Byla taková zima, že jsme zůstali doma.', 'so … , dass = tak …, že (následek).'),
  choice('Ich nehme ein Taxi, ___ pünktlich zu sein.', ['damit', 'um', 'obwohl'], 1, 'Vezmu si taxi, abych byl včas.', 'zu sein na konci → um … zu.'),
  choice('Die Eltern arbeiten viel, ___ die Kinder studieren können.', ['um', 'damit', 'dass'], 1, 'Rodiče hodně pracují, aby děti mohly studovat.', 'Různé podměty (Eltern × Kinder) → damit.'),
  choice('___ er wenig Zeit hatte, hat er mir geholfen.', ['Obwohl', 'Trotzdem', 'Weil'], 0, 'I když měl málo času, pomohl mi.', 'Sloveso hatte na konci → vedlejší věta → obwohl.'),
  choice('Er hatte wenig Zeit. ___ hat er mir geholfen.', ['Obwohl', 'Trotzdem', 'Damit'], 1, 'Měl málo času. Přesto mi pomohl.', 'Za mezerou je hned sloveso hat → trotzdem.'),
  order('Obwohl ich müde bin, gehe ich heute ins Fitnessstudio.', 'I když jsem unavený, jdu dnes do posilovny.', 'obwohl … bin, gehe ich … (vedlejší věta zabírá 1. místo).'),
  order('Ich fahre nach Berlin, um meine Freundin zu besuchen.', 'Jedu do Berlína, abych navštívil kamarádku.', 'um … zu besuchen (zu + infinitiv na konci).'),
  order('Ich erkläre es noch einmal, damit alle es verstehen.', 'Vysvětlím to ještě jednou, aby tomu všichni rozuměli.', 'damit + sloveso na konci (verstehen).'),
  sent('I když bydlím blízko, jezdím do práce autem.', ['Obwohl ich in der Nähe wohne, fahre ich mit dem Auto zur Arbeit.', 'Obwohl ich nah wohne, fahre ich mit dem Auto zur Arbeit.', 'Ich fahre mit dem Auto zur Arbeit, obwohl ich in der Nähe wohne.', 'Obwohl ich in der Nähe wohne, fahre ich mit dem Auto in die Arbeit.'], 'obwohl + sloveso na konci, potom hlavní věta začínající slovesem.', { chips: ['obwohl', 'in der Nähe'] }),
  sent('Učím se každý den slovíčka, abych na konci roku složil zkoušku.', ['Ich lerne jeden Tag Vokabeln, um am Ende des Jahres die Prüfung zu bestehen.', 'Ich lerne jeden Tag Wörter, um am Ende des Jahres die Prüfung zu bestehen.', 'Ich lerne jeden Tag Vokabeln, damit ich am Ende des Jahres die Prüfung bestehe.', 'Ich lerne jeden Tag Vokabeln, um Ende des Jahres die Prüfung zu bestehen.'], 'Stejný podmět → um … zu bestehen. (die Prüfung bestehen = složit zkoušku.)', { chips: ['um … zu', 'bestehen'] }),
  sent('Mluv prosím nahlas, aby tě slyšeli i lidé vzadu.', ['Sprich bitte laut, damit dich auch die Leute hinten hören.', 'Sprich bitte laut, damit auch die Leute hinten dich hören.', 'Sprich bitte lauter, damit dich auch die Leute hinten hören.', 'Bitte sprich laut, damit dich auch die Leute hinten hören.'], 'Různé podměty (ty × lidé) → damit. dich (4. pád) stojí ve vedlejší větě brzy.', { chips: ['damit', 'hinten'] })
]));

// ---------- D17: zu + infinitiv ----------
sets.push(set({ id: 'zu-inf', group: 'slovesa', title: 'zu + infinitiv', tag: 'Infinitiv se zu',
  desc: 'Ich habe keine Zeit zu …, es ist wichtig zu …, ohne … zu.',
  rule: 'Infinitiv se zu stojí na konci po mnoha slovesech (versuchen, vergessen, anfangen, aufhören, vorhaben, Lust/Zeit haben), po výrazech es ist wichtig/schwer/schön … a po ohne … zu (aniž), statt … zu (místo aby). Bez zu je infinitiv po modálních slovesech a po werden, lassen, gehen, sehen, hören. Odlučitelná slovesa: aufzustehen, anzurufen.' }, [
  fill('Ich habe heute keine Lust, [zu kochen].', 'Dnes se mi nechce vařit.', 'Lust haben + zu + infinitiv.'),
  fill('Vergiss nicht, die Tür [abzuschließen] (zamknout)!', 'Nezapomeň zamknout dveře!', 'abschließen je odlučitelné → ab-zu-schließen.'),
  fill('Es ist wichtig, jeden Tag [zu üben] (cvičit).', 'Je důležité cvičit každý den.', 'es ist wichtig + zu + infinitiv.'),
  fill('Ich versuche, weniger Zucker [zu essen] (jíst).', 'Snažím se jíst méně cukru.', 'versuchen + zu.'),
  fill('Er hat aufgehört, [zu rauchen] (kouřit).', 'Přestal kouřit.', 'aufhören + zu + infinitiv.'),
  fill('Ich muss morgen früh [aufstehen].', 'Zítra musím brzy vstávat.', 'Po modálním slovese (muss) je infinitiv bez zu.', { traps: { aufzustehen: 'Po modálních slovesech (müssen, können, wollen …) se zu nepíše: ich muss aufstehen.', 'zu aufstehen': 'Po modálních slovesech se zu nepíše vůbec: ich muss aufstehen.' } }),
  fill('Er ist gegangen, ohne sich [zu verabschieden] (rozloučit se).', 'Odešel, aniž by se rozloučil.', 'ohne … zu + infinitiv = aniž by.'),
  fill('Statt [zu lernen] (učit se), spielt er Computerspiele.', 'Místo aby se učil, hraje počítačové hry.', 'statt … zu = místo aby.'),
  fill('Hast du vor, im Sommer nach Italien [zu fahren] (jet)?', 'Plánuješ v létě jet do Itálie?', 'vorhaben + zu.'),
  fill('Es fängt an [zu regnen] (pršet).', 'Začíná pršet.', 'anfangen + zu.'),
  fill('Ich gehe heute Abend [schwimmen].', 'Dnes večer jdu plavat.', 'Po gehen je infinitiv bez zu.', { traps: { 'zu schwimmen': 'Po gehen (jít něco dělat) se zu nepíše: ich gehe schwimmen.' } }),
  fill('Es ist schwer, eine günstige Wohnung [zu finden] (najít).', 'Je těžké najít levný byt.', 'es ist schwer + zu.'),
  fill('Ich habe keine Zeit, dich morgen [anzurufen] (zavolat).', 'Zítra nemám čas ti zavolat.', 'anrufen je odlučitelné → anzurufen.'),
  choice('Ich kann heute nicht ___.', ['zu kommen', 'kommen', 'kommen zu'], 1, 'Dnes nemůžu přijít.', 'Modální sloveso → infinitiv bez zu.'),
  choice('Ich habe vergessen, dir ___.', ['zu antworten', 'antworten', 'antworten zu'], 0, 'Zapomněl jsem ti odpovědět.', 'vergessen + zu + infinitiv.'),
  choice('Er ging nach Hause, ___ etwas zu sagen.', ['ohne', 'statt', 'um'], 0, 'Šel domů, aniž by něco řekl.', 'ohne … zu = aniž by.'),
  sent('Je těžké najít práci bez znalosti němčiny.', ['Es ist schwer, ohne Deutschkenntnisse Arbeit zu finden.', 'Es ist schwer, ohne Deutschkenntnisse eine Arbeit zu finden.', 'Ohne Deutschkenntnisse ist es schwer, Arbeit zu finden.', 'Ohne Deutschkenntnisse ist es schwer, eine Arbeit zu finden.', 'Es ist schwierig, ohne Deutschkenntnisse Arbeit zu finden.', 'Es ist schwer, ohne Deutsch Arbeit zu finden.', 'Es ist schwer, ohne Deutschkenntnisse einen Job zu finden.'], 'es ist schwer + zu finden (infinitiv na konci).', { chips: ['es ist schwer', 'die Deutschkenntnisse'] }),
  sent('Zapomněl jsem si vzít deštník.', ['Ich habe vergessen, einen Regenschirm mitzunehmen.', 'Ich habe vergessen, den Regenschirm mitzunehmen.', 'Ich habe vergessen, meinen Regenschirm mitzunehmen.', 'Ich habe vergessen, einen Schirm mitzunehmen.', 'Ich habe vergessen, den Schirm mitzunehmen.'], 'vergessen + zu; mitnehmen je odlučitelné → mitzunehmen.', { chips: ['mitnehmen', 'der Regenschirm'] }),
  sent('Místo aby šel k lékaři, zůstal doma v posteli.', ['Statt zum Arzt zu gehen, ist er zu Hause im Bett geblieben.', 'Anstatt zum Arzt zu gehen, ist er zu Hause im Bett geblieben.', 'Statt zum Arzt zu gehen, blieb er zu Hause im Bett.', 'Anstatt zum Arzt zu gehen, blieb er zu Hause im Bett.'], '(An)statt … zu gehen zabírá 1. místo → ist er / blieb er.', { chips: ['statt … zu', 'bleiben'] })
]));

// ---------- D18: nepřímé otázky ----------
sets.push(set({ id: 'indir-frage', group: 'veta', title: 'Nepřímé otázky', tag: 'Slovosled: nepřímá otázka',
  desc: 'Können Sie mir sagen, wo …? Ich weiß nicht, ob …',
  rule: 'Nepřímá otázka je vedlejší věta: tázací slovo (wo, wann, wie, warum, was, wer, wie viel …) nebo ob (u otázek ano/ne) a sloveso na konci. Je to zdvořilejší způsob, jak se ptát: Wo ist der Bahnhof? → Können Sie mir sagen, wo der Bahnhof ist?' }, [
  order('Können Sie mir sagen, wo der Bahnhof ist?', 'Můžete mi říct, kde je nádraží?', 'wo … ist: sloveso na konci.'),
  order('Wissen Sie, wann der nächste Zug fährt?', 'Nevíte, kdy jede další vlak?', 'wann … fährt.'),
  order('Ich möchte wissen, wie viel das Ticket kostet.', 'Chtěl bych vědět, kolik stojí lístek.', 'wie viel … kostet.'),
  order('Weißt du, ob Peter heute kommt?', 'Víš, jestli Petr dnes přijde?', 'Otázka ano/ne → ob; kommt na konci.', { alts: ['Weißt du, ob heute Peter kommt?'] }),
  order('Kannst du mir erklären, warum du so spät gekommen bist?', 'Můžeš mi vysvětlit, proč jsi přišel tak pozdě?', 'warum … gekommen bist: pomocné sloveso úplně na konci.'),
  fill('Ich weiß nicht, wo meine Schlüssel [sind] (sein).', 'Nevím, kde jsou moje klíče.', 'V nepřímé otázce je sloveso na konci.'),
  fill('Können Sie mir sagen, [wann|um wie viel Uhr] (kdy) das Geschäft öffnet?', 'Můžete mi říct, kdy otevírá obchod?', 'Tázací slovo zůstává (wann), jen sloveso jde na konec.'),
  fill('Ich frage mich, [ob] (jestli) das eine gute Idee ist.', 'Ptám se sám sebe, jestli je to dobrý nápad.', 'Otázka ano/ne → ob.', { traps: { wenn: 'wenn = když / jestliže (podmínka). Nepřímá otázka „jestli“ = ob.' } }),
  fill('Weißt du, wer das [gesagt hat] (řekl)?', 'Víš, kdo to řekl?', 'Perfekt na konci: příčestí + hat.', { traps: { 'hat gesagt': 'Ve vedlejší větě je časované sloveso úplně na konci: gesagt hat.' } }),
  fill('Er hat gefragt, was wir am Wochenende [machen] (dělat).', 'Ptal se, co děláme o víkendu.', 'was … machen.'),
  choice('Können Sie mir sagen, ___?', ['wo ist die Post', 'wo die Post ist', 'ob die Post ist wo'], 1, 'Můžete mi říct, kde je pošta?', 'Nepřímá otázka → sloveso ist na konci.'),
  choice('Ich weiß nicht, ___ ich das schaffe.', ['ob', 'wenn', 'dass'], 0, 'Nevím, jestli to zvládnu.', 'Nejistota, otázka ano/ne → ob.'),
  choice('Weißt du, ___ das Konzert anfängt?', ['wann', 'ob wann', 'als'], 0, 'Víš, kdy začíná koncert?', 'Otázka na čas → wann.'),
  sent('Můžete mi říct, kde je tady nejbližší lékárna?', ['Können Sie mir sagen, wo hier die nächste Apotheke ist?', 'Können Sie mir sagen, wo die nächste Apotheke hier ist?', 'Können Sie mir sagen, wo die nächste Apotheke ist?', 'Könnten Sie mir sagen, wo hier die nächste Apotheke ist?', 'Könnten Sie mir sagen, wo die nächste Apotheke ist?'], 'wo … ist (sloveso na konci). die nächste Apotheke = nejbližší lékárna.', { chips: ['die Apotheke', 'nächste'] }),
  sent('Nevím, jestli mám zítra čas.', ['Ich weiß nicht, ob ich morgen Zeit habe.'], 'ob + sloveso na konci.', { chips: ['ob'] }),
  sent('Zeptej se ho, proč nepřišel na schůzku.', ['Frag ihn, warum er nicht zur Besprechung gekommen ist.', 'Frag ihn, warum er nicht zum Termin gekommen ist.', 'Frag ihn, warum er nicht zum Treffen gekommen ist.', 'Frag ihn, warum er nicht zu der Besprechung gekommen ist.', 'Frag ihn, warum er nicht zur Sitzung gekommen ist.', 'Frag ihn, warum er nicht zum Meeting gekommen ist.', 'Frag ihn, warum er nicht zur Besprechung kam.'], 'Rozkaz frag + ihn (4. pád), pak warum … gekommen ist.', { chips: ['fragen', 'warum'] })
]));

// ---------- D19: Konjunktiv II ----------
sets.push(set({ id: 'konj2', group: 'pokr', title: 'Konjunktiv II: würde, hätte, wäre', tag: 'Konjunktiv II',
  desc: 'Zdvořilost, přání, rady a nereálné podmínky.',
  rule: 'Konjunktiv II = české „by“. Většina sloves: würde + infinitiv (ich würde kommen). Vlastní tvary mají hlavně: sein → wäre, haben → hätte, können → könnte, müssen → müsste, dürfen → dürfte, sollen → sollte, wollen → wollte, werden → würde, wissen → wüsste, geben (es gäbe). Nereálná podmínka: Wenn ich Zeit hätte, würde ich kommen.' }, [
  fill('Wenn ich mehr Geld [hätte] (haben), würde ich reisen.', 'Kdybych měl víc peněz, cestoval bych.', 'haben → hätte (s přehláskou).', { traps: { hatte: 'hatte (bez přehlásky) je Präteritum = měl jsem. „Kdybych měl“ = hätte.', 'würde haben': 'U haben se používá vlastní tvar: hätte.' } }),
  fill('Wenn ich du [wäre] (sein), würde ich das nicht machen.', 'Být tebou, neudělal bych to.', 'sein → wäre.', { traps: { war: 'war = byl jsem (Präteritum). Konjunktiv II = wäre.' } }),
  fill('[Könnten] (mohl byste) Sie mir bitte helfen?', 'Mohl byste mi prosím pomoct?', 'Zdvořilá prosba: können → könnten.', { traps: { konnten: 'konnten bez přehlásky = mohli (minulost). Zdvořile „mohl byste“ = könnten.' } }),
  fill('Ich [hätte] gern einen Kaffee.', 'Dal bych si kávu.', 'Zdvořile v kavárně: Ich hätte gern …'),
  fill('Du [solltest] (měl bys) mehr schlafen.', 'Měl bys víc spát.', 'Rada = sollen → solltest.'),
  fill('An deiner Stelle [würde] ich den Arzt anrufen.', 'Na tvém místě bych zavolal lékaři.', 'Ostatní slovesa: würde + infinitiv na konci.'),
  fill('Wenn das Wetter besser [wäre] (sein), könnten wir grillen.', 'Kdyby bylo lepší počasí, mohli bychom grilovat.', 'sein → wäre.'),
  fill('Ich [würde] gern in Wien wohnen.', 'Rád bych bydlel ve Vídni.', 'Přání: würde gern + infinitiv.'),
  fill('[Wäre] (bylo by) es möglich, den Termin zu verschieben?', 'Bylo by možné termín posunout?', 'Zdvořilá otázka: Wäre es möglich …?'),
  fill('Wenn ich Zeit hätte, [würde] ich dir helfen.', 'Kdybych měl čas, pomohl bych ti.', 'Hlavní věta po wenn-větě začíná slovesem: würde ich … helfen.'),
  fill('Ich [müsste] (musel bych) eigentlich noch arbeiten.', 'Vlastně bych ještě měl pracovat.', 'müssen → müsste.'),
  fill('Wenn ich das [wüsste] (vědět), würde ich es dir sagen.', 'Kdybych to věděl, řekl bych ti to.', 'wissen → wüsste.'),
  choice('Wenn ich nicht krank ___, würde ich mitkommen.', ['war', 'wäre', 'würde'], 1, 'Kdybych nebyl nemocný, šel bych s vámi.', 'Nereálná podmínka v přítomnosti → wäre.'),
  choice('___ du mir das Salz geben?', ['Würdest', 'Wurdest', 'Wirst'], 0, 'Podal bys mi sůl?', 'Zdvořilá prosba → würdest (s přehláskou). wurdest = Präteritum od werden.'),
  choice('Was ___ du an meiner Stelle machen?', ['würdest', 'hättest', 'wärst'], 0, 'Co bys dělal na mém místě?', 'machen nemá vlastní tvar → würdest … machen.'),
  order('Wenn ich mehr Zeit hätte, würde ich Gitarre lernen.', 'Kdybych měl víc času, učil bych se na kytaru.', 'wenn … hätte, würde ich … lernen.'),
  order('Könnten Sie das bitte noch einmal wiederholen?', 'Mohl byste to prosím ještě jednou zopakovat?', 'Könnten na začátku (otázka), infinitiv wiederholen na konci.'),
  sent('Kdybych bydlel blíž, chodil bych do práce pěšky.', ['Wenn ich näher wohnen würde, würde ich zu Fuß zur Arbeit gehen.', 'Wenn ich näher wohnen würde, ginge ich zu Fuß zur Arbeit.', 'Wenn ich näher wohnte, würde ich zu Fuß zur Arbeit gehen.', 'Wenn ich näher wohnen würde, würde ich zu Fuß in die Arbeit gehen.', 'Wenn ich näher wohnen würde, würde ich zur Arbeit zu Fuß gehen.'], 'wenn … wohnen würde (würde na konci), hlavní věta: würde ich … gehen.', { chips: ['wenn', 'würde', 'zu Fuß'] }),
  sent('Měl bys víc pít, hlavně když je takové horko.', ['Du solltest mehr trinken, vor allem wenn es so heiß ist.', 'Du solltest mehr trinken, besonders wenn es so heiß ist.', 'Du solltest mehr trinken, vor allem, wenn es so heiß ist.', 'Du solltest mehr trinken, besonders, wenn es so heiß ist.'], 'Rada → solltest + infinitiv. wenn … ist na konci.', { chips: ['solltest', 'vor allem'] }),
  sent('Bylo by hezké, kdybys přišel na mou oslavu.', ['Es wäre schön, wenn du zu meiner Party kommen würdest.', 'Es wäre schön, wenn du zu meiner Feier kommen würdest.', 'Es wäre schön, wenn du zu meiner Party kämest.', 'Es wäre schön, wenn du auf meine Party kommen würdest.', 'Es wäre schön, wenn du zu meiner Party kommst.', 'Es wäre schön, wenn du zu meiner Feier kommst.'], 'es wäre schön + wenn … kommen würdest.', { chips: ['es wäre schön', 'die Feier'] })
]));

sets.push(set({ id: 'veta-w3', group: 'preklad', title: 'Překlad vět: týden 3', tag: 'Překlad vět', n: 6,
  desc: 'Delší souvětí s časovými spojkami a Konjunktivem II.',
  rule: 'Kontroluj: sloveso na konci každé vedlejší věty, správnou spojku (als × wenn, um … zu × damit) a tvary hätte / wäre / würde.' }, [
  sent('Když jsem minulý rok byl v Berlíně, navštívil jsem kamaráda, kterého jsem neviděl deset let.', ['Als ich letztes Jahr in Berlin war, habe ich einen Freund besucht, den ich zehn Jahre nicht gesehen hatte.', 'Als ich letztes Jahr in Berlin war, besuchte ich einen Freund, den ich zehn Jahre nicht gesehen hatte.', 'Als ich letztes Jahr in Berlin war, habe ich einen Freund besucht, den ich seit zehn Jahren nicht gesehen hatte.', 'Als ich letztes Jahr in Berlin war, besuchte ich einen Freund, den ich seit zehn Jahren nicht gesehen hatte.', 'Als ich letztes Jahr in Berlin war, habe ich einen Freund besucht, den ich zehn Jahre lang nicht gesehen hatte.'], 'als (jednou v minulosti); den = vztažné zájmeno ve 4. pádě (koho jsem neviděl). Vztažným větám se budeš věnovat příští týden.', { chips: ['als', 'den …'] }),
  sent('Kdybych měl víc času, učil bych se ještě španělsky, ale teď musím hodně pracovat.', ['Wenn ich mehr Zeit hätte, würde ich noch Spanisch lernen, aber jetzt muss ich viel arbeiten.', 'Wenn ich mehr Zeit hätte, würde ich auch noch Spanisch lernen, aber jetzt muss ich viel arbeiten.', 'Wenn ich mehr Zeit hätte, würde ich noch Spanisch lernen, aber im Moment muss ich viel arbeiten.'], 'wenn … hätte, würde ich … lernen; aber nemění pořadí.', { chips: ['hätte', 'würde'] }),
  sent('Než se odstěhuješ, musíš se odhlásit na úřadě, jinak budeš muset zaplatit pokutu.', ['Bevor du umziehst, musst du dich beim Amt abmelden, sonst musst du eine Strafe zahlen.', 'Bevor du umziehst, musst du dich beim Amt abmelden, sonst musst du eine Strafe bezahlen.', 'Bevor du umziehst, musst du dich beim Amt abmelden, sonst wirst du eine Strafe zahlen müssen.', 'Bevor du umziehst, musst du dich beim Amt abmelden, sonst musst du ein Bußgeld zahlen.'], 'bevor … umziehst (dohromady na konci) → musst du; sonst → inverze musst du.', { chips: ['bevor', 'sich abmelden', 'sonst'] }),
  sent('I když byl vlak plný, našel jsem místo, abych si mohl během cesty číst.', ['Obwohl der Zug voll war, habe ich einen Platz gefunden, damit ich während der Fahrt lesen konnte.', 'Obwohl der Zug voll war, fand ich einen Platz, um während der Fahrt lesen zu können.', 'Obwohl der Zug voll war, habe ich einen Platz gefunden, um während der Fahrt zu lesen.', 'Obwohl der Zug voll war, fand ich einen Platz, um während der Fahrt zu lesen.', 'Obwohl der Zug voll war, habe ich einen Sitzplatz gefunden, um während der Fahrt zu lesen.'], 'obwohl … war; stejný podmět → um … zu; während + 2. pád (der Fahrt).', { chips: ['obwohl', 'um … zu', 'während der Fahrt'] }),
  sent('Můžete mi prosím říct, jestli je možné změnit termín, protože v pondělí nemůžu?', ['Können Sie mir bitte sagen, ob es möglich ist, den Termin zu ändern, weil ich am Montag nicht kann?', 'Könnten Sie mir bitte sagen, ob es möglich ist, den Termin zu ändern, weil ich am Montag nicht kann?', 'Können Sie mir bitte sagen, ob es möglich ist, den Termin zu verschieben, weil ich am Montag nicht kann?', 'Könnten Sie mir bitte sagen, ob es möglich ist, den Termin zu verschieben, weil ich am Montag nicht kann?', 'Können Sie mir bitte sagen, ob man den Termin ändern kann, weil ich am Montag nicht kann?', 'Könnten Sie mir bitte sagen, ob man den Termin ändern kann, weil ich am Montag nicht kann?'], 'Tři patra: ob … ist, zu ändern, weil … kann. Každá vedlejší věta má sloveso na konci.', { chips: ['ob', 'den Termin ändern'] }),
  sent('Poté co jsme se navečeřeli, dívali jsme se na film, i když jsme byli dost unavení.', ['Nachdem wir zu Abend gegessen hatten, haben wir einen Film gesehen, obwohl wir ziemlich müde waren.', 'Nachdem wir zu Abend gegessen hatten, sahen wir einen Film, obwohl wir ziemlich müde waren.', 'Nachdem wir zu Abend gegessen hatten, haben wir einen Film geschaut, obwohl wir ziemlich müde waren.', 'Nachdem wir zu Abend gegessen hatten, haben wir einen Film angeschaut, obwohl wir ziemlich müde waren.', 'Nachdem wir zu Abend gegessen hatten, schauten wir einen Film, obwohl wir ziemlich müde waren.'], 'nachdem + Plusquamperfekt (gegessen hatten); obwohl … waren.', { chips: ['nachdem', 'obwohl', 'zu Abend essen'] }),
  sent('Nezapomeň mi zavolat, až dorazíš do hotelu.', ['Vergiss nicht, mich anzurufen, wenn du im Hotel ankommst.', 'Vergiss nicht, mich anzurufen, wenn du am Hotel ankommst.', 'Vergiss nicht, mich anzurufen, wenn du ins Hotel kommst.', 'Vergiss nicht, mich anzurufen, sobald du im Hotel ankommst.'], 'vergessen + zu → anzurufen; budoucnost → wenn (až) + ankommst na konci.', { chips: ['anrufen', 'wenn', 'ankommen'] })
]));

sets.push(set({ id: 'ctest-8', group: 'cteni', title: 'C-Test: Der Umzug nach Wien', n: 1, all: true, kindLabel: 'C-Test', tag: 'C-Test' }, [{
  id: 'ct-w3', kind: 'ctest', title: 'C-Test: Der Umzug nach Wien', tag: 'C-Test', gaps: 20,
  short: 'Správně doplněné slovo je celé v textu výše.',
  text: 'Als ich vor zwei Jahren nach Wien gezogen bin, war {{al|les||}} neu für mich. Bevor {{i|ch||}} eine Wohnung fand, wohnte {{i|ch|Slovosled|inverze po vedlejší větě}} bei einer Freundin. Das {{wa|r|Präteritum|Präteritum}} nicht leicht, weil ihre {{Woh|nung||}} sehr klein ist. Nachdem {{i|ch||}} drei Wochen gesucht hatte, {{fa|nd|Präteritum|silné sloveso finden}} ich endlich ein Zimmer {{i|n||}} der Nähe der Universität. {{Obw|ohl|Spojka|i když}} die Miete hoch war, {{ha|be|Perfekt|pomocné sloveso}} ich den Vertrag sofort unterschrieben. {{Heu|te||}} weiß ich, dass {{da|s||}} eine gute Entscheidung war. {{We|nn|Spojka|opakovaně}} ich heute Freunde aus Prag {{tre|ffe||}}, sagen sie oft: Wenn {{i|ch||}} so eine Wohnung hätte, {{wü|rde|Konjunktiv II|würde + infinitiv}} ich auch nach Wien {{zie|hen||}}. Natürlich vermisse ich {{manch|mal||}} meine Familie, aber ich {{bes|uche|Sloveso|navštěvovat}} sie jeden Monat.',
  tr: 'Když jsem se před dvěma lety přestěhoval do Vídně, bylo pro mě všechno nové. Než jsem našel byt, bydlel jsem u kamarádky. Nebylo to snadné, protože její byt je velmi malý. Poté co jsem tři týdny hledal, našel jsem konečně pokoj blízko univerzity. I když byl nájem vysoký, hned jsem podepsal smlouvu. Dnes vím, že to bylo dobré rozhodnutí. Když dnes potkám přátele z Prahy, často říkají: Kdybych měl takový byt, taky bych se přestěhoval do Vídně. Samozřejmě mi občas chybí rodina, ale navštěvuju ji každý měsíc.'
}]));

const p8 = { title: 'E-Mail: Bewerbung als Praktikant', text: 'Sehr geehrte Frau Berger,\n\nvielen Dank für Ihre Bewerbung. Wir würden Sie gern zu einem Gespräch einladen. Leider ist der vorgeschlagene Termin am Dienstag schon vergeben. Wäre es Ihnen am Mittwoch um 10 Uhr oder am Freitag um 14 Uhr möglich? Bitte bringen Sie Ihre Zeugnisse mit, aber nicht im Original, sondern als Kopie. Das Gespräch dauert etwa 45 Minuten. Falls Sie keinen der Termine wahrnehmen können, rufen Sie mich bitte an, statt eine E-Mail zu schreiben, damit wir schneller eine Lösung finden.\n\nMit freundlichen Grüßen\nThomas Keller, Personalabteilung', tr: 'Vážená paní Bergerová,\n\nděkujeme za Vaši žádost. Rádi bychom Vás pozvali na pohovor. Navržený termín v úterý je bohužel už obsazený. Bylo by Vám možné ve středu v 10 hodin nebo v pátek ve 14 hodin? Přineste prosím svá vysvědčení, ale ne v originále, nýbrž jako kopii. Pohovor trvá asi 45 minut. Pokud nemůžete přijít v žádném z termínů, prosím zavolejte mi, místo abyste psala e-mail, abychom rychleji našli řešení.\n\nS přátelským pozdravem\nThomas Keller, personální oddělení' };
sets.push(set({ id: 'read-8', group: 'cteni', title: 'Čtení: Einladung zum Gespräch', n: 3, all: true, kindLabel: 'Čtení', tag: 'Čtení' }, [
  choice('Welcher Termin ist NICHT möglich?', ['Dienstag', 'Mittwoch um 10 Uhr', 'Freitag um 14 Uhr'], 0, 'Který termín NENÍ možný?', 'vergeben = obsazený. Úterý už je obsazené.', { passage: p8, evidence: '„Leider ist der vorgeschlagene Termin am Dienstag schon vergeben.“', optTr: ['Úterý', 'Středa v 10', 'Pátek ve 14'], tag: 'Čtení: výjimka / negace' }),
  choice('Was soll Frau Berger mitbringen?', ['Ihre Originalzeugnisse', 'Kopien ihrer Zeugnisse', 'Nichts'], 1, 'Co má paní Bergerová přinést?', 'nicht im Original, sondern als Kopie – rozhoduje část po sondern.', { passage: p8, evidence: '„nicht im Original, sondern als Kopie“', optTr: ['Originály vysvědčení', 'Kopie vysvědčení', 'Nic'], tag: 'Čtení: výjimka / negace' }),
  choice('Was soll sie tun, wenn kein Termin passt?', ['Eine E-Mail schreiben', 'Anrufen', 'Am Dienstag kommen'], 1, 'Co má udělat, když žádný termín nevyhovuje?', 'statt eine E-Mail zu schreiben = místo psaní e-mailu → má zavolat.', { passage: p8, evidence: '„rufen Sie mich bitte an, statt eine E-Mail zu schreiben“', optTr: ['Napsat e-mail', 'Zavolat', 'Přijít v úterý'], tag: 'Čtení: záměna slov' })
]));

sets.push(set({ id: 'write-w3', group: 'cteni', title: 'Psaní: Kdybych…', n: 1, all: true, kindLabel: 'Psaní', tag: 'Psaní' }, [
  write({ prompt: 'Was würdest du machen, wenn du ein Jahr frei hättest? Schreib 70–100 Wörter. Benutze mindestens dreimal Konjunktiv II (würde, hätte, wäre, könnte), einmal um … zu und einmal als oder nachdem.',
    tr: 'Co bys dělal, kdybys měl rok volna? Napiš 70–100 slov. Použij aspoň třikrát Konjunktiv II (würde, hätte, wäre, könnte), jednou um … zu a jednou als nebo nachdem.',
    minWords: 70, words: ['wenn ich … hätte, würde ich …', 'um … zu + Infinitiv', 'als ich klein war, …'],
    check: [{ re: '\\b(würde|würdest|würden|hätte|hättest|hätten|wäre|wärst|wären|könnte|könntest|könnten)\\b', min: 3, label: '3× Konjunktiv II' }, { re: '\\bum\\b[^.]*\\bzu\\b', min: 1, label: 'um … zu' }, { re: '\\b(als|nachdem)\\b', min: 1, label: 'als / nachdem' }],
    model: 'Wenn ich ein Jahr frei hätte, würde ich zuerst nach Südamerika fliegen, um Spanisch zu lernen. Als ich klein war, wollte ich immer Peru sehen. Ich würde ein paar Monate in Lima wohnen und einen Sprachkurs machen. Danach wäre ich gern in Argentinien, weil ich dort tanzen lernen könnte. Natürlich hätte ich nicht viel Geld, deshalb würde ich in Hostels schlafen. Am Ende des Jahres würde ich nach Hause kommen und meiner Familie alles erzählen.' })
]));

vocabSets.push(vocab({ id: 'vocab-beruf', topic: 'práce a pohovor', title: 'Práce a pohovor' }, [
  'die Bewerbung, -en = žádost o místo', 'der Lebenslauf, Lebensläufe = životopis', 'das Vorstellungsgespräch, -e = pracovní pohovor', 'die Stelle, -n = pracovní místo', 'die Erfahrung, -en = zkušenost',
  'das Gehalt, Gehälter = plat', 'der Vertrag, Verträge = smlouva', 'die Ausbildung, -en = vzdělání, učení (odborné)', 'das Zeugnis, -se = vysvědčení, posudek', 'die Kenntnis, -se = znalost',
  'die Überstunde, -n = přesčas', 'der Arbeitgeber, - = zaměstnavatel', 'der Arbeitnehmer, - = zaměstnanec', 'kündigen (kündigte, hat gekündigt) = dát výpověď', 'einstellen (stellte ein, hat eingestellt) = zaměstnat, přijmout',
  'verdienen (verdiente, hat verdient) = vydělávat', 'sich bewerben um + Akk. (bewarb, hat beworben) = ucházet se o', 'selbstständig = samostatný; podnikající', 'flexibel = flexibilní', 'zuverlässig = spolehlivý'
]));
vocabSets.push(vocab({ id: 'vocab-amt', topic: 'stěhování a úřady', title: 'Stěhování a úřady' }, [
  'der Umzug, Umzüge = stěhování', 'die Miete, -n = nájem', 'der Vermieter, - = pronajímatel', 'die Kaution, -en = kauce', 'die Nebenkosten (Pl.) = poplatky za služby',
  'das Amt, Ämter = úřad', 'das Formular, -e = formulář', 'der Antrag, Anträge = žádost (úřední)', 'die Unterschrift, -en = podpis', 'der Ausweis, -e = průkaz',
  'die Anmeldung, -en = přihlášení (k pobytu)', 'die Frist, -en = lhůta', 'die Gebühr, -en = poplatek', 'der Nachbar, -n = soused', 'umziehen (zog um, ist umgezogen) = stěhovat se',
  'ausfüllen (füllte aus, hat ausgefüllt) = vyplnit', 'unterschreiben (unterschrieb, hat unterschrieben) = podepsat', 'beantragen (beantragte, hat beantragt) = požádat o (úředně)', 'gültig = platný', 'möbliert = zařízený (nábytkem)'
]));
vocabSets.push(vocab({ id: 'vocab-einkaufen', topic: 'nakupování a oblečení', title: 'Nakupování a oblečení' }, [
  'die Kleidung = oblečení', 'die Hose, -n = kalhoty', 'das Hemd, -en = košile', 'der Mantel, Mäntel = kabát', 'der Schuh, -e = bota',
  'die Größe, -n = velikost', 'die Kasse, -n = pokladna', 'die Quittung, -en = účtenka', 'der Umtausch = výměna (zboží)', 'das Angebot, -e = nabídka, akce',
  'der Rabatt, -e = sleva', 'die Umkleidekabine, -n = kabinka', 'anprobieren (probierte an, hat anprobiert) = zkusit si (oblečení)', 'umtauschen (tauschte um, hat umgetauscht) = vyměnit', 'zurückgeben (gab zurück, hat zurückgegeben) = vrátit',
  'passen (passte, hat gepasst) = padnout, hodit se', 'stehen + Dat. (stand, hat gestanden) = slušet (někomu)', 'reduziert = zlevněný', 'eng = těsný, úzký', 'bequem = pohodlný'
]));

const T = {};
T.temp = theory(
  'Časové spojky uvozují vedlejší větu, takže sloveso jde na konec. Největší past pro Čechy: české „když“ má v němčině dva překlady.',
  ['tbl', ['spojka', 'kdy', 'příklad'], [['als', 'jednou v minulosti', 'Als ich 18 war, …'], ['wenn', 'opakovaně (i v minulosti) / přítomnost / budoucnost', 'Wenn ich Zeit habe, … · Immer wenn es regnete, …'], ['während', 'zatímco (současně)', 'Während ich koche, …'], ['bevor', 'než', 'Bevor ich gehe, …'], ['nachdem', 'poté co (+ Plusquamperfekt v minulosti)', 'Nachdem ich gegessen hatte, …'], ['seit(dem)', 'od té doby, co', 'Seit ich hier wohne, …'], ['bis', 'až, dokud ne', 'Warte, bis ich komme.']]],
  ['tip', 'Otázka „Stalo se to jednou v minulosti?“ → ano = als. Ve všech ostatních případech wenn.'],
  ['h', 'Předložka, nebo spojka?'],
  ['ex', ['vor dem Essen × bevor wir essen', 'před jídlem × než budeme jíst'], ['nach der Arbeit × nachdem ich gearbeitet hatte', 'po práci × poté co jsem pracoval'], ['während der Fahrt × während ich fahre', 'během jízdy × zatímco jedu']]
);
T.fk = theory(
  ['h', 'i když × přesto'],
  ['ex', ['Obwohl es regnet, gehen wir raus.', 'obwohl = vedlejší věta, sloveso na konci'], ['Es regnet. Trotzdem gehen wir raus.', 'trotzdem = 1. místo, hned sloveso']],
  ['h', 'aby: um … zu, nebo damit?'],
  ['tbl', ['situace', 'konstrukce', 'příklad'], [['stejný podmět', 'um … zu + infinitiv', 'Ich lerne, um die Prüfung zu bestehen.'], ['různé podměty', 'damit + vedlejší věta', 'Ich erkläre es, damit du es verstehst.']]],
  ['tip', 'um … zu nikdy nemá vlastní podmět. Pokud potřebuješ říct, KDO má něco udělat, musí být damit.'],
  ['h', 'so …, dass'],
  ['ex', ['Ich war so müde, dass ich sofort eingeschlafen bin.', 'Byl jsem tak unavený, že jsem hned usnul.']]
);
T.zu = theory(
  'Infinitiv se zu je jako české „…, (abych) něco udělal“ po určitých slovesech a výrazech. Stojí na konci věty, často za čárkou.',
  ['tbl', ['se zu', 'bez zu'], [['versuchen, vergessen, anfangen, aufhören, vorhaben, beginnen, hoffen, planen', 'modální slovesa: können, müssen, wollen, dürfen, sollen, möchten'], ['Lust / Zeit / Angst haben', 'werden (Futur), lassen'], ['es ist wichtig / schwer / schön / verboten', 'gehen (schwimmen gehen), sehen, hören'], ['ohne … zu, statt … zu, um … zu', '']]],
  ['h', 'Odlučitelná slovesa'],
  ['ex', ['aufstehen → aufzustehen', 'Ich habe keine Lust, früh aufzustehen.'], ['anrufen → anzurufen', 'Vergiss nicht, mich anzurufen.']],
  ['tip', 'ohne … zu = aniž by, statt … zu = místo aby. Er ging, ohne etwas zu sagen.']
);
T.ind = theory(
  'Nepřímá otázka je otázka „zabalená“ do vedlejší věty. Je zdvořilejší a v B1 zkoušce ji budeš potřebovat v dopisech a rozhovorech.',
  ['tbl', ['přímá otázka', 'nepřímá otázka'], [['Wo ist der Bahnhof?', 'Können Sie mir sagen, wo der Bahnhof ist?'], ['Wann beginnt der Kurs?', 'Ich möchte wissen, wann der Kurs beginnt.'], ['Kommt er heute?', 'Weißt du, ob er heute kommt?'], ['Was hast du gemacht?', 'Erzähl mir, was du gemacht hast.']]],
  ['tip', 'Otázka bez tázacího slova (ano/ne) dostane ob. Nikdy wenn, nikdy dass.']
);
T.k2 = theory(
  'Konjunktiv II je německé „by“. Používá se na: zdvořilé prosby, přání, rady a nereálné podmínky.',
  ['tbl', ['sloveso', 'ich', 'du', 'er/sie', 'wir/sie'], [['sein', 'wäre', 'wärst', 'wäre', 'wären'], ['haben', 'hätte', 'hättest', 'hätte', 'hätten'], ['können', 'könnte', 'könntest', 'könnte', 'könnten'], ['müssen', 'müsste', 'müsstest', 'müsste', 'müssten'], ['sollen', 'sollte', 'solltest', 'sollte', 'sollten'], ['werden', 'würde', 'würdest', 'würde', 'würden']]],
  'Ostatní slovesa: würde + infinitiv na konci (Ich würde gern reisen).',
  ['h', 'Použití'],
  ['ex', ['Könnten Sie mir helfen?', 'zdvořilá prosba'], ['Ich hätte gern ein Bier.', 'objednávka'], ['Du solltest zum Arzt gehen.', 'rada'], ['Wenn ich Zeit hätte, würde ich kommen.', 'nereálná podmínka']],
  ['tip', 'Přehláska dělá rozdíl: hatte (měl jsem) × hätte (měl bych), war × wäre, konnte × könnte, wurde × würde.']
);

const days = [
  { title: 'als, wenn, während, bevor, nachdem', theory: T.temp, blocks: [['temporal', 12, 'Časové spojky'], ['vocab-beruf', 10, 'Slovíčka: práce a pohovor'], ['__due', 12, 'Dnešní opakování']] },
  { title: 'obwohl, trotzdem, damit, um … zu', theory: T.fk, blocks: [['final-konz', 12, 'I když, přesto, aby'], ['nebensatz-1', 6, 'Opakování: vedlejší věty'], ['past-strong', 8, 'Opakování: silná slovesa']] },
  { title: 'zu + infinitiv', theory: T.zu, blocks: [['zu-inf', 12, 'zu + infinitiv'], ['vocab-amt', 10, 'Slovíčka: stěhování a úřady'], ['__due', 12, 'Dnešní opakování']] },
  { title: 'Nepřímé otázky', theory: T.ind, blocks: [['indir-frage', 12, 'Nepřímé otázky'], ['perf-part', 8, 'Opakování: Partizip II'], ['prep-verb2', 8, 'Opakování: slovesa s předložkou']] },
  { title: 'Konjunktiv II: würde, hätte, wäre', theory: T.k2, blocks: [['konj2', 12, 'Konjunktiv II'], ['vocab-einkaufen', 10, 'Slovíčka: nakupování'], ['__due', 12, 'Dnešní opakování']] },
  { title: 'Opakování týdne', blocks: [['w3-mix', 14, 'Mix týdne 3'], ['__weak', 12, 'Tvoje slabá místa'], ['vocab-w3', 12, 'Slovíčka týdne'], ['read-8', 3, 'Čtení: pozvánka na pohovor']] },
  { title: 'Test týdne a delší věty', blocks: [['veta-w3', 6, 'Překlad delších vět'], ['ctest-8', 1, 'C-Test: Der Umzug nach Wien'], ['write-w3', 1, 'Psaní: Kdybych …'], ['__wrong', 15, 'Opakování chyb']] }
];
sets.push(set({ id: 'w3-mix', group: 'veta', title: 'Mix: týden 3', n: 14, refs: ['temporal', 'final-konz', 'zu-inf', 'indir-frage', 'konj2'] }));
sets.push(set({ id: 'vocab-w3', group: 'slov', title: 'Slovíčka: týden 3', n: 12, refs: ['vocab-beruf', 'vocab-amt', 'vocab-einkaufen'] }));

module.exports = { week: 3, title: 'Vedlejší věty a Konjunktiv II', desc: 'Kdy, proč, aby, i když – a jak říct „bych“.', sets, vocabSets, days };
