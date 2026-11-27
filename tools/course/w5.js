'use strict';
const { fill, choice, order, sent, write, theory, set, vocab } = require('./lib');

const sets = [];
const vocabSets = [];

// ---------- D29: komparativ a superlativ ----------
sets.push(set({ id: 'kompar', group: 'pokr', title: 'Komparativ a superlativ', tag: 'Stupňování',
  desc: 'schneller als, so schnell wie, am schnellsten, der beste.',
  rule: '2. stupeň: -er (schnell → schneller), 3. stupeň: am …-sten (am schnellsten) nebo der/die/das …-ste. Jednoslabičná často s přehláskou: alt → älter, jung → jünger, groß → größer, warm → wärmer. Nepravidelné: gut – besser – am besten, viel – mehr – am meisten, gern – lieber – am liebsten, hoch – höher, nah – näher – am nächsten. Srovnání: größer ALS (nerovnost), so groß WIE (rovnost). Před podstatným jménem dostane i stupňované adjektivum koncovku: ein größeres Auto.' }, [
  fill('Mein Bruder ist [älter] (alt) als ich.', 'Můj bratr je starší než já.', 'alt → älter (přehláska).', { traps: { alter: 'Jednoslabičná přídavná jména s a/o/u mají v 2. stupni často přehlásku: alt → älter.' } }),
  fill('Prag ist größer [als] Brno.', 'Praha je větší než Brno.', 'Nerovnost (2. stupeň) → als.', { traps: { wie: 'wie se používá pro rovnost (so groß wie). Po 2. stupni (größer) je als.' } }),
  fill('Anna ist so groß [wie] ihre Mutter.', 'Anna je stejně vysoká jako její matka.', 'Rovnost: so … wie.', { traps: { als: 'Po so + základní tvar (so groß) je wie. als jen po 2. stupni.' } }),
  fill('Ich trinke [lieber] (gern) Tee als Kaffee.', 'Radši piju čaj než kávu.', 'gern – lieber – am liebsten.', { traps: { gerner: 'gern je nepravidelné: gern – lieber – am liebsten.' } }),
  fill('Das Wetter ist heute [besser] (gut) als gestern.', 'Počasí je dnes lepší než včera.', 'gut – besser – am besten.'),
  fill('Im Juli ist es [am wärmsten] (warm, 3. st.).', 'V červenci je nejtepleji.', 'Superlativ jako příslovce / v přísudku: am …-sten. warm → am wärmsten.'),
  fill('Das ist das [beste] (gut, 3. st.) Restaurant in der Stadt.', 'To je nejlepší restaurace ve městě.', 'Před podstatným jménem: das beste (koncovka po určitém členu -e).'),
  fill('Wer hat [am meisten] (viel, 3. st.) gegessen?', 'Kdo snědl nejvíc?', 'viel – mehr – am meisten.'),
  fill('Die Zugspitze ist der [höchste] (hoch, 3. st.) Berg Deutschlands.', 'Zugspitze je nejvyšší hora Německa.', 'hoch – höher – der höchste.'),
  fill('Ich suche eine [größere] (groß, 2. st.) Wohnung.', 'Hledám větší byt.', '2. stupeň + koncovka: eine größere Wohnung (po eine, ž. → -e).', { traps: { größer: 'Před podstatným jménem dostane i 2. stupeň koncovku: eine größere Wohnung.' } }),
  fill('Je mehr ich übe, desto [besser] (gut) spreche ich.', 'Čím víc cvičím, tím lépe mluvím.', 'je + 2. stupeň …, desto + 2. stupeň.'),
  fill('Die Prüfung war [schwerer] (schwer) als ich dachte.', 'Zkouška byla těžší, než jsem myslel.', 'schwer → schwerer.'),
  choice('Berlin ist ___ als Wien.', ['größer', 'großer', 'mehr groß'], 0, 'Berlín je větší než Vídeň.', 'groß → größer (přehláska), nikdy mehr groß.'),
  choice('Mein Handy ist ___ teuer wie deins.', ['so', 'als', 'mehr'], 0, 'Můj mobil je stejně drahý jako tvůj.', 'Rovnost: so … wie.'),
  choice('Am Wochenende schlafe ich ___.', ['am längsten', 'am langsten', 'der längste'], 0, 'O víkendu spím nejdéle.', 'lang → am längsten (přehláska).'),
  choice('Welche Form stimmt? Das ist ___ Idee.', ['eine bessere', 'eine besser', 'eine mehr gute'], 0, 'To je lepší nápad.', 'Před podstatným jménem: eine bessere Idee.'),
  sent('Vlak je rychlejší než autobus, ale letadlo je nejrychlejší.', ['Der Zug ist schneller als der Bus, aber das Flugzeug ist am schnellsten.', 'Der Zug ist schneller als der Bus, aber das Flugzeug ist das schnellste.'], 'schneller als; superlativ v přísudku: am schnellsten.', { chips: ['als', 'am schnellsten'] }),
  sent('Moje sestra vaří stejně dobře jako moje máma.', ['Meine Schwester kocht so gut wie meine Mutter.', 'Meine Schwester kocht genauso gut wie meine Mutter.', 'Meine Schwester kocht so gut wie meine Mama.', 'Meine Schwester kocht genauso gut wie meine Mama.'], 'Rovnost → so gut wie.', { chips: ['so … wie'] }),
  sent('Čím dřív začneš, tím víc času budeš mít večer.', ['Je früher du anfängst, desto mehr Zeit hast du am Abend.', 'Je früher du anfängst, desto mehr Zeit hast du abends.', 'Je früher du beginnst, desto mehr Zeit hast du am Abend.', 'Je früher du anfängst, umso mehr Zeit hast du am Abend.', 'Je früher du anfängst, desto mehr Zeit wirst du am Abend haben.'], 'je … (sloveso na konci), desto … (sloveso hned za stupňovaným výrazem).', { chips: ['je … desto', 'anfangen'] })
]));

// ---------- D30: pasivum přítomné ----------
sets.push(set({ id: 'passiv-1', group: 'pokr', title: 'Pasivum: wird gemacht', tag: 'Pasivum: přítomný čas',
  desc: 'werden + Partizip II, von + 3. pád.',
  rule: 'Pasivum (trpný rod) = werden + příčestí minulé na konci: Das Haus wird gebaut (Dům se staví / je stavěn). Původce děje: von + 3. pád (von dem Chef). Tvary werden: ich werde, du wirst, er wird, wir werden, ihr werdet, sie werden. Pasivum se v němčině používá mnohem častěji než v češtině – hlavně v popisech postupů, zprávách a úředních textech.' }, [
  fill('Das Auto [wird] heute repariert.', 'Auto se dnes opravuje.', 'Jednotné číslo → wird + Partizip II.'),
  fill('Die Briefe [werden] morgen abgeschickt.', 'Dopisy se odešlou zítra.', 'Množné číslo → werden.'),
  fill('In Österreich wird Deutsch [gesprochen] (sprechen).', 'V Rakousku se mluví německy.', 'Partizip II silného slovesa: gesprochen.'),
  fill('Die Pizza wird in einem Holzofen [gebacken] (backen).', 'Pizza se peče v peci na dřevo.', 'backen → gebacken.'),
  fill('Das Fenster wird [von] dem Hausmeister repariert.', 'Okno opravuje správce domu.', 'Původce → von + 3. pád.', { traps: { durch: 'durch se používá pro prostředek/příčinu; pro osobu, která děj vykonává, je von.' } }),
  fill('Hier [wird] nicht geraucht!', 'Tady se nekouří!', 'Neosobní pasivum (bez podmětu) → wird.'),
  fill('Wann [werden] die Ergebnisse veröffentlicht?', 'Kdy budou zveřejněny výsledky?', 'die Ergebnisse (mn. č.) → werden.'),
  fill('Der Patient wird sofort [operiert] (operieren).', 'Pacient bude okamžitě operován.', 'Slovesa na -ieren nemají ge-: operiert.', { traps: { geoperiert: 'Slovesa na -ieren tvoří příčestí bez ge-: operiert.' } }),
  fill('Zuerst werden die Kartoffeln [geschält] (schälen).', 'Nejdřív se oloupou brambory.', 'Recept: pasivum. schälen → geschält.'),
  fill('Du [wirst] am Bahnhof abgeholt.', 'Vyzvednou tě na nádraží.', 'du → wirst.'),
  choice('Das Museum ___ um 18 Uhr geschlossen.', ['wird', 'ist', 'hat'], 0, 'Muzeum se zavírá v 18 hodin.', 'Děj (zavírání) → wird geschlossen. (ist geschlossen = je zavřeno – stav.)'),
  choice('Die neue Brücke wird ___ der Stadt gebaut.', ['von', 'mit', 'bei'], 0, 'Nový most staví město.', 'Původce → von + 3. pád.'),
  choice('Aktiv → Passiv: „Man repariert die Straße.“', ['Die Straße wird repariert.', 'Die Straße repariert.', 'Die Straße ist reparieren.'], 0, 'Silnice se opravuje.', 'man + aktivum → pasivum bez původce.'),
  order('Die Kinder werden um acht Uhr von der Schule abgeholt.', 'Děti se vyzvedávají ze školy v osm.', 'werden na 2. místě, abgeholt na konci.'),
  order('In dieser Fabrik werden Autos produziert.', 'V téhle továrně se vyrábějí auta.', 'Místní údaj na začátku → werden Autos … produziert.'),
  sent('Ten dům se staví už dva roky.', ['Das Haus wird schon seit zwei Jahren gebaut.', 'Das Haus wird seit zwei Jahren gebaut.', 'An dem Haus wird schon seit zwei Jahren gebaut.'], 'Pasivum: wird … gebaut. seit + 3. pád (seit zwei Jahren).', { chips: ['wird', 'bauen'] }),
  sent('V téhle restauraci se platí jen hotově.', ['In diesem Restaurant wird nur bar bezahlt.', 'In diesem Restaurant wird nur in bar bezahlt.', 'In diesem Restaurant wird nur bar gezahlt.'], 'Neosobní pasivum: wird … bezahlt. Místo na začátku → hned sloveso.', { chips: ['bar', 'bezahlen'] })
]));

// ---------- D31: pasivum minulé + modální ----------
sets.push(set({ id: 'passiv-2', group: 'pokr', title: 'Pasivum: wurde, ist … worden, muss … werden', tag: 'Pasivum: minulost a modální',
  desc: 'Pasivum v minulosti a s modálními slovesy.',
  rule: 'Präteritum: wurde + Partizip II (Das Haus wurde 1990 gebaut). Perfekt: ist + Partizip II + worden (Das Haus ist 1990 gebaut worden) – v pasivu je worden, ne geworden. S modálními slovesy: modální sloveso + Partizip II + werden (Das muss repariert werden).' }, [
  fill('Das Rathaus [wurde] im 16. Jahrhundert gebaut.', 'Radnice byla postavena v 16. století.', 'Präteritum pasiva: wurde + Partizip II.'),
  fill('Die Bilder [wurden] gestohlen.', 'Obrazy byly ukradeny.', 'Mn. č. → wurden.'),
  fill('Mein Fahrrad ist gestern repariert [worden].', 'Moje kolo bylo včera opraveno.', 'Perfekt pasiva: ist … repariert worden (ne geworden).', { traps: { geworden: 'V pasivu Perfekt se používá worden (bez ge-). geworden znamená „stal se“.' } }),
  fill('Die Rechnung muss bis Freitag bezahlt [werden].', 'Faktura musí být zaplacena do pátku.', 'Modální sloveso + Partizip II + werden.'),
  fill('Das Paket kann morgen [abgeholt] (abholen) werden.', 'Balík lze vyzvednout zítra.', 'abholen → abgeholt.'),
  fill('Wann [wurde] Amerika entdeckt?', 'Kdy byla objevena Amerika?', 'Historická událost → Präteritum: wurde.'),
  fill('Die Straße darf nicht befahren [werden].', 'Silnice nesmí být používána k jízdě.', 'darf … werden.'),
  fill('Ich bin zum Vorstellungsgespräch [eingeladen] (einladen) worden.', 'Byl jsem pozván na pohovor.', 'einladen → eingeladen; Perfekt pasiva: bin … eingeladen worden.'),
  fill('Der Brief [ist] noch nicht geschrieben worden.', 'Dopis ještě nebyl napsán.', 'Perfekt pasiva vždy se sein: ist … worden.', { traps: { hat: 'Perfekt pasiva se tvoří se sein: ist … geschrieben worden.' } }),
  fill('Die Wohnung muss vor dem Umzug [gestrichen] (streichen) werden.', 'Byt se musí před stěhováním vymalovat.', 'streichen → gestrichen.'),
  choice('Das Spiel ___ wegen Regen abgesagt.', ['wurde', 'würde', 'wird worden'], 0, 'Zápas byl kvůli dešti zrušen.', 'Minulost pasiva → wurde (bez přehlásky).'),
  choice('Das Problem muss sofort ___.', ['gelöst werden', 'werden gelöst', 'gelöst worden'], 0, 'Problém musí být okamžitě vyřešen.', 'modální … Partizip II + werden na konci.'),
  choice('Die Kinder sind vom Arzt untersucht ___.', ['geworden', 'worden', 'werden'], 1, 'Děti byly vyšetřeny lékařem.', 'Perfekt pasiva → worden.'),
  order('Die Fenster müssen jede Woche geputzt werden.', 'Okna se musí mýt každý týden.', 'müssen na 2. místě, geputzt werden na konci.'),
  order('Der Termin ist leider abgesagt worden.', 'Termín byl bohužel zrušen.', 'ist … abgesagt worden.'),
  sent('Ten film byl natočen v roce 2010 v Praze.', ['Der Film wurde 2010 in Prag gedreht.', 'Der Film wurde im Jahr 2010 in Prag gedreht.', 'Der Film ist 2010 in Prag gedreht worden.', 'Der Film ist im Jahr 2010 in Prag gedreht worden.'], 'Präteritum pasiva: wurde … gedreht. Rok se říká bez in (2010) nebo im Jahr 2010.', { chips: ['wurde', 'drehen'] }),
  sent('Formulář musí být podepsán a odeslán do konce měsíce.', ['Das Formular muss bis Ende des Monats unterschrieben und abgeschickt werden.', 'Das Formular muss bis zum Ende des Monats unterschrieben und abgeschickt werden.', 'Das Formular muss bis Monatsende unterschrieben und abgeschickt werden.', 'Das Formular muss bis Ende des Monats unterschrieben und weggeschickt werden.'], 'muss … unterschrieben und abgeschickt werden (werden jen jednou na konci).', { chips: ['unterschreiben', 'abschicken'] })
]));

// ---------- D32: Futur I a werden ----------
sets.push(set({ id: 'futur', group: 'slovesa', title: 'Futur I a tři role werden', tag: 'werden: futur / pasivum / stát se',
  desc: 'Ich werde kommen. Es wird kalt. Das wird gemacht.',
  rule: 'werden má tři role: 1) samo = stát se, začít být (Er wird Arzt. Es wird kalt.), 2) werden + infinitiv = budoucí čas / předpoklad (Ich werde dich anrufen. Er wird krank sein.), 3) werden + Partizip II = pasivum (Das Auto wird repariert). V běžné řeči se budoucnost často vyjadřuje přítomným časem + časový údaj (Morgen fahre ich nach Wien).' }, [
  fill('Ich [werde] dich morgen anrufen.', 'Zítra ti zavolám.', 'Futur: werden + infinitiv na konci.'),
  fill('Es [wird] langsam dunkel.', 'Pomalu se stmívá.', 'werden samo = stávat se: es wird dunkel.'),
  fill('Mein Sohn will Arzt [werden].', 'Můj syn chce být lékařem.', 'werden = stát se; po modálním slovese infinitiv na konci.'),
  fill('Wir [werden] nächstes Jahr heiraten.', 'Příští rok se vezmeme.', 'wir → werden.'),
  fill('Du [wirst] sehen, das klappt!', 'Uvidíš, to vyjde!', 'du → wirst.'),
  fill('Er ist nicht da. Er wird wohl krank [sein].', 'Není tu. Asi bude nemocný.', 'werden + infinitiv = předpoklad (asi, nejspíš).'),
  fill('Nach dem Studium ist sie Lehrerin [geworden].', 'Po studiu se stala učitelkou.', 'Perfekt od werden (stát se) → ist … geworden.', { traps: { worden: 'worden je jen v pasivu. „Stala se učitelkou“ = ist Lehrerin geworden.' } }),
  fill('Ihr [werdet] euch wundern.', 'Budete se divit.', 'ihr → werdet.'),
  fill('Die Tage [werden] im Herbst kürzer.', 'Na podzim se dny zkracují.', 'werden + přídavné jméno = stávat se.'),
  choice('„Das Haus wird renoviert.“ – Co je to?', ['budoucí čas', 'pasivum', 'stát se'], 1, 'Dům se renovuje.', 'werden + Partizip II = pasivum.'),
  choice('„Ich werde dir helfen.“ – Co je to?', ['budoucí čas', 'pasivum', 'stát se'], 0, 'Pomůžu ti.', 'werden + infinitiv = budoucí čas.'),
  choice('„Mir wird schlecht.“ – Co je to?', ['budoucí čas', 'pasivum', 'stát se'], 2, 'Je mi špatně (dělá se mi špatně).', 'werden + přídavné jméno = stávat se.'),
  choice('Morgen ___ es regnen.', ['wird', 'würde', 'wurde'], 0, 'Zítra bude pršet.', 'Futur: wird + infinitiv.'),
  sent('Zítra bude pršet, takže zůstaneme doma.', ['Morgen wird es regnen, deshalb bleiben wir zu Hause.', 'Morgen wird es regnen, also bleiben wir zu Hause.', 'Morgen regnet es, deshalb bleiben wir zu Hause.', 'Morgen regnet es, also bleiben wir zu Hause.', 'Morgen wird es regnen, darum bleiben wir zu Hause.'], 'Futur: wird es regnen (nebo prostě regnet es). also/deshalb → inverze.', { chips: ['werden', 'also'] }),
  sent('Chtěl bych se stát programátorem, protože mě baví počítače.', ['Ich möchte Programmierer werden, weil mir Computer Spaß machen.', 'Ich möchte Programmierer werden, weil ich mich für Computer interessiere.', 'Ich möchte Programmierer werden, weil Computer mir Spaß machen.', 'Ich würde gern Programmierer werden, weil mir Computer Spaß machen.'], 'werden = stát se (bez členu u povolání). Spaß machen + 3. pád.', { chips: ['werden', 'Spaß machen'] })
]));

// ---------- D33: příčestí jako přídavné jméno ----------
sets.push(set({ id: 'partizip-adj', group: 'pokr', title: 'Příčestí jako přídavné jméno', tag: 'Příčestí jako přídavné jméno',
  desc: 'die geschlossene Tür, das schlafende Kind.',
  rule: 'Partizip I (infinitiv + -d) = probíhající, činný děj: das schlafende Kind (spící dítě), kochendes Wasser (vroucí voda). Partizip II = dokončený / trpný děj: die geschlossene Tür (zavřené dveře), das gekochte Ei (vařené vejce). Před podstatným jménem dostávají normální koncovky přídavných jmen.' }, [
  fill('Vorsicht, [kochendes] (kochen, P. I) Wasser!', 'Pozor, vroucí voda!', 'Probíhá teď → Partizip I: kochend + koncovka -es (bez členu, stř.).'),
  fill('Ich esse gern [gekochte] (kochen, P. II) Eier.', 'Rád jím vařená vejce.', 'Hotový výsledek → Partizip II: gekocht + koncovka -e (mn. č. bez členu).'),
  fill('Das [schlafende] (schlafen) Kind ist mein Neffe.', 'To spící dítě je můj synovec.', 'Partizip I: schlafend + -e (po das).'),
  fill('Die Tür ist [geschlossen] (schließen).', 'Dveře jsou zavřené.', 'V přísudku (po sein) bez koncovky: geschlossen.'),
  fill('Bitte schließen Sie die [geöffneten] (öffnen) Fenster.', 'Zavřete prosím otevřená okna.', 'Partizip II + koncovka -en (mn. č. po die).'),
  fill('Wir suchen eine [möblierte] (möblieren) Wohnung.', 'Hledáme zařízený byt.', 'möbliert + -e (po eine).'),
  fill('Der [reparierte] (reparieren) Computer funktioniert wieder.', 'Opravený počítač zase funguje.', 'repariert + -e (po der, 1. pád).'),
  fill('Ich habe ein [spannendes] (napínavý) Buch gelesen.', 'Četl jsem napínavou knihu.', 'spannend (napínavý) je Partizip I; po ein, stř. → -es.'),
  fill('Die [steigenden] (steigen) Preise sind ein Problem.', 'Rostoucí ceny jsou problém.', 'steigend + -en (mn. č. po die).'),
  fill('Das ist ein [gut bezahlter] (gut bezahlen) Job.', 'To je dobře placená práce.', 'der Job, po ein → -er.'),
  choice('Das Wasser ist noch zu heiß, es ist gerade ___.', ['gekocht', 'kochend', 'kochen'], 0, 'Voda je ještě moc horká, právě se uvařila.', 'Děj skončil → Partizip II gekocht. (kochend = právě vře.)'),
  choice('Wir haben im Park ___ Kinder gesehen.', ['spielende', 'gespielte', 'spielenden'], 0, 'V parku jsme viděli hrající si děti.', 'Probíhá → Partizip I; bez členu mn. č. → -e.'),
  choice('Das ___ Auto steht vor der Tür.', ['verkaufte', 'verkaufende', 'verkauft'], 0, 'Prodané auto stojí přede dveřmi.', 'Auto bylo prodáno (trpný, hotový děj) → Partizip II verkauft + -e.'),
  sent('Na stole leží otevřený dopis.', ['Auf dem Tisch liegt ein geöffneter Brief.', 'Auf dem Tisch liegt ein offener Brief.'], 'ein + der Brief (1. pád) → geöffneter.', { chips: ['öffnen'] }),
  sent('Ztracené klíče jsem našel v kapse kabátu.', ['Die verlorenen Schlüssel habe ich in der Manteltasche gefunden.', 'Ich habe die verlorenen Schlüssel in der Manteltasche gefunden.', 'Die verlorenen Schlüssel habe ich in der Tasche des Mantels gefunden.', 'Ich habe die verlorenen Schlüssel in der Tasche meines Mantels gefunden.', 'Ich habe die verlorenen Schlüssel in der Manteltasche wiedergefunden.'], 'verlieren → verloren; po die mn. č. → -en.', { chips: ['verlieren', 'die Manteltasche'] })
]));

sets.push(set({ id: 'veta-w5', group: 'preklad', title: 'Překlad vět: týden 5', tag: 'Překlad vět', n: 6,
  desc: 'Delší věty se stupňováním a pasivem.',
  rule: 'Kontroluj: als × wie, tvar werden podle osoby, worden × geworden a Partizip II na konci.' }, [
  sent('Starý most byl zbořen, protože nový je širší a bezpečnější.', ['Die alte Brücke wurde abgerissen, weil die neue breiter und sicherer ist.', 'Die alte Brücke ist abgerissen worden, weil die neue breiter und sicherer ist.'], 'Pasivum minulé: wurde abgerissen / ist abgerissen worden; breiter, sicherer (2. stupeň).', { chips: ['abreißen', 'breiter'] }),
  sent('Čím déle bydlím v Německu, tím lépe rozumím místním lidem.', ['Je länger ich in Deutschland wohne, desto besser verstehe ich die Leute hier.', 'Je länger ich in Deutschland lebe, desto besser verstehe ich die Menschen hier.', 'Je länger ich in Deutschland wohne, desto besser verstehe ich die Einheimischen.', 'Je länger ich in Deutschland lebe, desto besser verstehe ich die Leute hier.', 'Je länger ich in Deutschland wohne, umso besser verstehe ich die Leute hier.'], 'je + 2. stupeň + sloveso na konci; desto + 2. stupeň + sloveso + podmět.', { chips: ['je … desto'] }),
  sent('Výsledky budou zveřejněny příští týden na internetu.', ['Die Ergebnisse werden nächste Woche im Internet veröffentlicht.', 'Die Ergebnisse werden in der nächsten Woche im Internet veröffentlicht.', 'Die Ergebnisse werden nächste Woche im Internet veröffentlicht werden.'], 'Pasivum přítomné s časovým údajem (budoucnost): werden … veröffentlicht.', { chips: ['veröffentlichen'] }),
  sent('Tohle je nejzajímavější kniha, jakou jsem letos četl.', ['Das ist das interessanteste Buch, das ich dieses Jahr gelesen habe.', 'Das ist das interessanteste Buch, das ich in diesem Jahr gelesen habe.'], 'das interessanteste (superlativ s koncovkou -e); vztažná věta das … gelesen habe.', { chips: ['das interessanteste'] }),
  sent('Moje auto se musí opravit, ale v dílně mi řekli, že to bude trvat týden.', ['Mein Auto muss repariert werden, aber in der Werkstatt hat man mir gesagt, dass es eine Woche dauern wird.', 'Mein Auto muss repariert werden, aber in der Werkstatt hat man mir gesagt, dass es eine Woche dauert.', 'Mein Auto muss repariert werden, aber in der Werkstatt haben sie mir gesagt, dass es eine Woche dauern wird.', 'Mein Auto muss repariert werden, aber in der Werkstatt haben sie mir gesagt, dass es eine Woche dauert.'], 'muss repariert werden; dass … dauern wird (werden úplně na konci).', { chips: ['repariert werden', 'die Werkstatt'] }),
  sent('Až dokončím školu, stanu se zdravotní sestrou a budu pracovat v nemocnici.', ['Wenn ich die Schule beendet habe, werde ich Krankenschwester und arbeite im Krankenhaus.', 'Wenn ich mit der Schule fertig bin, werde ich Krankenschwester und werde im Krankenhaus arbeiten.', 'Nach der Schule werde ich Krankenschwester und arbeite im Krankenhaus.', 'Wenn ich mit der Schule fertig bin, werde ich Krankenpflegerin und arbeite im Krankenhaus.', 'Wenn ich die Schule abgeschlossen habe, werde ich Krankenschwester und arbeite im Krankenhaus.', 'Wenn ich die Schule beendet habe, werde ich Krankenschwester und werde im Krankenhaus arbeiten.'], 'werden = stát se (bez členu); wenn (až) + sloveso na konci.', { chips: ['wenn', 'werden'] })
]));

sets.push(set({ id: 'ctest-10', group: 'cteni', title: 'C-Test: Wie wird Schokolade gemacht?', n: 1, all: true, kindLabel: 'C-Test', tag: 'C-Test' }, [{
  id: 'ct-w5', kind: 'ctest', title: 'C-Test: Wie wird Schokolade gemacht?', tag: 'C-Test', gaps: 20,
  short: 'Správně doplněné slovo je celé v textu výše.',
  text: 'Schokolade wird aus Kakaobohnen hergestellt. Die Bohnen {{wer|den|Pasivum|mn. č.}} zuerst in tropischen Ländern geerntet und {{getr|ocknet|Partizip II|trocknen}}. Danach werden sie {{n|ach||}} Europa transportiert. In der Fabrik {{wer|den|Pasivum|mn. č.}} die Bohnen geröstet, {{da|mit|Spojka|aby}} sie ihr typisches Aroma bekommen. Je {{län|ger|Stupňování|2. stupeň}} man sie röstet, {{des|to||}} dunkler wird der Geschmack. Dann {{wi|rd|Pasivum|j. č.}} die Masse mit Zucker und {{Mil|ch||}} gemischt. Früher wurde {{al|les||}} von Hand gemacht, heute {{arbe|iten|Sloveso|mn. č.}} Maschinen viel schneller als Menschen. Die {{fert|ige|Adj. koncovka|po die, 1. pád ž.}} Schokolade muss langsam gekühlt {{wer|den|Pasivum|modální + werden}}. Die bekannteste {{Sor|te||}} in Deutschland ist Vollmilch, aber {{dun|kle|Adj. koncovka|bez členu, ž. 1. pád}} Schokolade wird immer {{belie|bter|Stupňování|2. stupeň}}. Sie soll sogar {{gesü|nder|Stupňování|2. stupeň}} sein als Milchschokolade.',
  tr: 'Čokoláda se vyrábí z kakaových bobů. Boby se nejdřív sklízejí v tropických zemích a suší se. Potom se převážejí do Evropy. V továrně se boby praží, aby získaly typické aroma. Čím déle se praží, tím tmavší je chuť. Pak se hmota míchá s cukrem a mlékem. Dřív se všechno dělalo ručně, dnes pracují stroje mnohem rychleji než lidé. Hotová čokoláda se musí pomalu chladit. Nejznámější druh v Německu je mléčná, ale hořká čokoláda je stále oblíbenější. Prý je dokonce zdravější než mléčná.'
}]));

const p10 = { title: 'Mitteilung der Hausverwaltung', text: 'Liebe Mieterinnen und Mieter,\n\nab Montag, dem 12. März, wird das Treppenhaus renoviert. Die Arbeiten dauern voraussichtlich zwei Wochen. In dieser Zeit kann der Aufzug nur vormittags benutzt werden, nachmittags ist er gesperrt. Fahrräder dürfen nicht mehr im Flur abgestellt werden; bitte bringen Sie sie bis Freitag in den Keller. Die Haustür wird nicht abgeschlossen, solange die Handwerker im Haus sind. Lärm lässt sich leider nicht vermeiden, am Wochenende wird aber nicht gearbeitet.\n\nIhre Hausverwaltung Schmidt & Partner', tr: 'Milé nájemnice a milí nájemníci,\n\nod pondělí 12. března se bude renovovat schodiště. Práce potrvají předpokládaně dva týdny. V této době lze výtah používat jen dopoledne, odpoledne je uzavřený. Kola se už nesmí odkládat na chodbě; prosím odneste je do pátku do sklepa. Domovní dveře se nebudou zamykat, dokud jsou v domě řemeslníci. Hluku se bohužel nelze vyhnout, o víkendu se ale pracovat nebude.\n\nVaše správa domu Schmidt & Partner' };
sets.push(set({ id: 'read-10', group: 'cteni', title: 'Čtení: Mitteilung der Hausverwaltung', n: 3, all: true, kindLabel: 'Čtení', tag: 'Čtení' }, [
  choice('Wann kann man den Aufzug benutzen?', ['Den ganzen Tag', 'Nur vormittags', 'Nur nachmittags'], 1, 'Kdy lze použít výtah?', '„nur vormittags benutzt werden, nachmittags ist er gesperrt“.', { passage: p10, evidence: '„kann der Aufzug nur vormittags benutzt werden“', optTr: ['Celý den', 'Jen dopoledne', 'Jen odpoledne'], tag: 'Čtení: číslo / čas' }),
  choice('Wohin sollen die Fahrräder?', ['In den Flur', 'In den Keller', 'Vor die Haustür'], 1, 'Kam mají jít kola?', 'Ne do chodby (Flur) – do sklepa (Keller).', { passage: p10, evidence: '„bitte bringen Sie sie bis Freitag in den Keller“', optTr: ['Na chodbu', 'Do sklepa', 'Před domovní dveře'], tag: 'Čtení: výjimka / negace' }),
  choice('Was stimmt?', ['Am Wochenende wird auch gearbeitet.', 'Die Haustür bleibt während der Arbeiten offen.', 'Die Arbeiten dauern genau einen Monat.'], 1, 'Co platí?', '„Die Haustür wird nicht abgeschlossen, solange die Handwerker im Haus sind.“', { passage: p10, evidence: '„Die Haustür wird nicht abgeschlossen, solange die Handwerker im Haus sind.“', optTr: ['O víkendu se taky pracuje.', 'Domovní dveře zůstávají během prací otevřené.', 'Práce trvají přesně měsíc.'], tag: 'Čtení: výjimka / negace' })
]));

sets.push(set({ id: 'write-w5', group: 'cteni', title: 'Psaní: Moje město', n: 1, all: true, kindLabel: 'Psaní', tag: 'Psaní' }, [
  write({ prompt: 'Vergleiche deine Stadt mit einer anderen Stadt, die du kennst. Schreib 80–110 Wörter. Benutze mindestens vier Vergleiche (als, so … wie, am …sten) und zwei Passivsätze (wird / wurde + Partizip II).',
    tr: 'Porovnej své město s jiným městem, které znáš. Napiš 80–110 slov. Použij aspoň čtyři srovnání (als, so … wie, am …sten) a dvě věty v pasivu (wird / wurde + Partizip II).',
    minWords: 80, words: ['größer als, so schön wie, am interessantesten', 'wird gebaut, wurde gegründet'],
    check: [{ re: '\\b(als|wie|am \\w+sten|\\w+ste[nrs]?)\\b', min: 4, label: '4 srovnání' }, { re: '\\b(wird|werden|wurde|wurden)\\b[^.]*\\b(ge\\w+t|ge\\w+en|\\w+iert)\\b', min: 2, label: '2× pasivum' }],
    model: 'Ich wohne in Olomouc, aber ich kenne auch Brno sehr gut. Brno ist größer als Olomouc und das Nachtleben ist lebendiger. Trotzdem finde ich Olomouc schöner, weil die Altstadt ruhiger ist. Die Mieten sind in Brno fast so hoch wie in Prag. Olomouc wurde im Mittelalter gegründet und hat die zweitgrößte historische Altstadt in Tschechien. Am schönsten ist es im Frühling, wenn die Parks grün werden. Zurzeit wird in Olomouc ein neues Schwimmbad gebaut. Für Studenten ist Brno vielleicht interessanter, aber für Familien ist Olomouc am besten.' })
]));

vocabSets.push(vocab({ id: 'vocab-charakter', topic: 'povaha a vzhled', title: 'Povaha a vzhled' }, [
  'der Charakter, -e = povaha', 'die Eigenschaft, -en = vlastnost', 'das Aussehen = vzhled', 'die Figur = postava', 'die Haare (Pl.) = vlasy',
  'der Bart, Bärte = vousy', 'die Brille, -n = brýle', 'ehrlich = upřímný, poctivý', 'geduldig = trpělivý', 'ungeduldig = netrpělivý',
  'fleißig = pilný', 'faul = líný', 'neugierig = zvědavý', 'schüchtern = stydlivý', 'lustig = vtipný, veselý',
  'höflich = zdvořilý', 'großzügig = štědrý', 'ordentlich = pořádný', 'hilfsbereit = ochotný (pomoci)', 'selbstbewusst = sebevědomý'
]));
vocabSets.push(vocab({ id: 'vocab-arzt', topic: 'u lékaře', title: 'U lékaře' }, [
  'die Praxis, Praxen = ordinace', 'der Termin, -e = termín, objednání', 'die Sprechstunde, -n = ordinační hodiny', 'die Untersuchung, -en = vyšetření', 'die Krankmeldung, -en = neschopenka',
  'die Überweisung, -en = doporučení (k odborníkovi); převod (peněz)', 'die Spritze, -n = injekce', 'die Nebenwirkung, -en = vedlejší účinek', 'die Allergie, -n = alergie', 'die Verletzung, -en = zranění',
  'der Notfall, Notfälle = nouzový případ', 'die Krankenkasse, -n = zdravotní pojišťovna', 'die Versichertenkarte, -n = kartička pojištěnce', 'untersuchen (untersuchte, hat untersucht) = vyšetřit', 'verschreiben (verschrieb, hat verschrieben) = předepsat',
  'sich erkälten (erkältete, hat erkältet) = nachladit se', 'einnehmen (nahm ein, hat eingenommen) = užívat (lék)', 'sich erholen (erholte, hat erholt) = zotavit se', 'schwindlig = mající závrať', 'ansteckend = nakažlivý'
]));
vocabSets.push(vocab({ id: 'vocab-feste', topic: 'svátky a oslavy', title: 'Svátky a oslavy' }, [
  'das Fest, -e = slavnost, svátek', 'die Feier, -n = oslava', 'der Feiertag, -e = státní svátek', 'das Weihnachten = Vánoce', 'das Ostern = Velikonoce',
  'das Silvester = Silvestr', 'der Gast, Gäste = host', 'die Einladung, -en = pozvání, pozvánka', 'das Geschenk, -e = dárek', 'die Kerze, -n = svíčka',
  'die Torte, -n = dort', 'der Glückwunsch, Glückwünsche = blahopřání', 'die Tradition, -en = tradice', 'feiern (feierte, hat gefeiert) = slavit', 'einladen (lud ein, hat eingeladen) = pozvat',
  'schenken (schenkte, hat geschenkt) = darovat', 'anstoßen (stieß an, hat angestoßen) = připít si', 'sich bedanken (bedankte, hat bedankt) = poděkovat', 'festlich = slavnostní', 'herzlich = srdečný'
]));

const T = {};
T.komp = theory(
  ['tbl', ['základ', '2. stupeň', '3. stupeň'], [['schnell', 'schneller', 'am schnellsten'], ['alt', 'älter', 'am ältesten'], ['groß', 'größer', 'am größten'], ['gut', 'besser', 'am besten'], ['viel', 'mehr', 'am meisten'], ['gern', 'lieber', 'am liebsten'], ['hoch', 'höher', 'am höchsten'], ['nah', 'näher', 'am nächsten']]],
  'Přehlásku mají hlavně krátká přídavná jména s a, o, u: alt, arm, groß, jung, kalt, krank, kurz, lang, oft, stark, warm. Po -t, -d, -s, -ß, -z se v superlativu vkládá -e-: am ältesten, am kürzesten.',
  ['h', 'als × wie'],
  ['ex', ['Er ist größer als ich.', 'nerovnost → als'], ['Er ist so groß wie ich.', 'rovnost → so … wie']],
  ['h', 'Před podstatným jménem'],
  ['ex', ['ein schnelleres Auto', 'normální koncovka po 2. stupni'], ['das schnellste Auto', 'superlativ se členem']],
  ['tip', 'je … desto: Je mehr ich lerne, desto mehr weiß ich. Po je je sloveso na konci, po desto hned za stupňovaným výrazem.']
);
T.p1 = theory(
  'Pasivum říká, CO se děje, ne KDO to dělá. V němčině je velmi časté – v receptech, návodech, zprávách, úředních dopisech.',
  ['tbl', ['aktivum', 'pasivum'], [['Der Mechaniker repariert das Auto.', 'Das Auto wird (vom Mechaniker) repariert.'], ['Man spricht hier Deutsch.', 'Hier wird Deutsch gesprochen.'], ['Man raucht hier nicht.', 'Hier wird nicht geraucht.']]],
  ['tbl', ['osoba', 'werden'], [['ich', 'werde'], ['du', 'wirst'], ['er/sie/es', 'wird'], ['wir', 'werden'], ['ihr', 'werdet'], ['sie/Sie', 'werden']]],
  ['tip', 'Kdo děj dělá: von + 3. pád (vom Arzt). Pasivum bez podmětu je normální: Hier wird gearbeitet. (Tady se pracuje.)']
);
T.p2 = theory(
  ['tbl', ['čas', 'tvar', 'příklad'], [['přítomný', 'wird + P. II', 'Das Haus wird gebaut.'], ['Präteritum', 'wurde + P. II', 'Das Haus wurde gebaut.'], ['Perfekt', 'ist + P. II + worden', 'Das Haus ist gebaut worden.'], ['s modálním', 'muss + P. II + werden', 'Das Haus muss gebaut werden.']]],
  ['tip', 'worden × geworden: v pasivu vždy worden (Es ist gemacht worden). geworden jen když werden znamená „stát se“ (Er ist Arzt geworden).'],
  ['tip', 'wurde (byl/a – minulost) × würde (by – Konjunktiv II). Jedna tečka nad u mění význam.']
);
T.fut = theory(
  ['tbl', ['konstrukce', 'význam', 'příklad'], [['werden + přídavné/podstatné jméno', 'stát se, stávat se', 'Es wird kalt. Er wird Arzt.'], ['werden + infinitiv', 'budoucnost / předpoklad', 'Ich werde kommen. Er wird krank sein.'], ['werden + Partizip II', 'pasivum', 'Das Auto wird repariert.']]],
  'Pro budoucnost Němci často stačí přítomný čas s časovým údajem: Morgen fahre ich nach Wien. Futur s werden zní důrazněji (slib, předpověď) nebo vyjadřuje odhad.',
  ['ex', ['Ich werde dich nie vergessen.', 'slib'], ['Es wird morgen schneien.', 'předpověď'], ['Sie wird wohl im Büro sein.', 'odhad: asi bude v kanceláři']]
);
T.pa = theory(
  ['tbl', ['typ', 'tvar', 'význam', 'příklad'], [['Partizip I', 'infinitiv + d', 'probíhá, činný', 'das weinende Kind (plačící dítě)'], ['Partizip II', 'ge…t / ge…en', 'dokončené, trpné', 'das gekochte Essen (uvařené jídlo)']]],
  'Před podstatným jménem dostávají normální koncovky přídavných jmen (stejná pravidla jako v týdnu 1): der lachende Mann, ein lachender Mann, mit lachenden Kindern.',
  ['ex', ['kochendes Wasser × gekochtes Wasser', 'vroucí voda × převařená voda'], ['die steigenden Preise', 'rostoucí ceny'], ['eine gut bezahlte Stelle', 'dobře placené místo']]
);

const days = [
  { title: 'Komparativ a superlativ', theory: T.komp, blocks: [['kompar', 12, 'Stupňování'], ['vocab-charakter', 10, 'Slovíčka: povaha a vzhled'], ['__due', 12, 'Dnešní opakování']] },
  { title: 'Pasivum: wird gemacht', theory: T.p1, blocks: [['passiv-1', 12, 'Pasivum přítomné'], ['perf-part', 8, 'Opakování: Partizip II'], ['rel-2', 6, 'Opakování: vztažné věty']] },
  { title: 'Pasivum v minulosti a s modálními', theory: T.p2, blocks: [['passiv-2', 12, 'wurde, ist … worden'], ['vocab-arzt', 10, 'Slovíčka: u lékaře'], ['__due', 12, 'Dnešní opakování']] },
  { title: 'Futur a tři role werden', theory: T.fut, blocks: [['futur', 12, 'werden: futur, pasivum, stát se'], ['verb-dat', 6, 'Opakování: slovesa s 3. pádem'], ['past-mix', 8, 'Opakování: minulé časy']] },
  { title: 'Příčestí jako přídavné jméno', theory: T.pa, blocks: [['partizip-adj', 12, 'die geschlossene Tür'], ['vocab-feste', 10, 'Slovíčka: svátky a oslavy'], ['__due', 12, 'Dnešní opakování']] },
  { title: 'Opakování týdne', blocks: [['w5-mix', 14, 'Mix týdne 5'], ['__weak', 12, 'Tvoje slabá místa'], ['vocab-w5', 12, 'Slovíčka týdne'], ['read-10', 3, 'Čtení: oznámení správy domu']] },
  { title: 'Test týdne a delší věty', blocks: [['veta-w5', 6, 'Překlad delších vět'], ['ctest-10', 1, 'C-Test: čokoláda'], ['write-w5', 1, 'Psaní: moje město'], ['__wrong', 15, 'Opakování chyb']] }
];
sets.push(set({ id: 'w5-mix', group: 'pokr', title: 'Mix: týden 5', n: 14, refs: ['kompar', 'passiv-1', 'passiv-2', 'futur', 'partizip-adj'] }));
sets.push(set({ id: 'vocab-w5', group: 'slov', title: 'Slovíčka: týden 5', n: 12, refs: ['vocab-charakter', 'vocab-arzt', 'vocab-feste'] }));

module.exports = { week: 5, title: 'Stupňování, pasivum, budoucnost', desc: 'větší než, se dělá, bylo uděláno, bude.', sets, vocabSets, days };
