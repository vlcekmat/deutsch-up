# Deutsch Up

Cvičebnice němčiny A2 → B1 jako offline webová aplikace (PWA). Běží na GitHub Pages:
**https://vlcekmat.github.io/deutsch-up/**

```
site/      vše, co se nasazuje: index.html, bank.js, sw.js, manifest, ikony, fonty
tools/     generátory bank.js a pomocné skripty (nenasazují se)
assets/    zdrojové SVG ikony
tests/     Playwright testy
```

## Instalace do telefonu

**iPhone (Safari):** otevři adresu výše v Safari → tlačítko Sdílet → **Přidat na plochu** → Přidat.
Aplikace se pak spouští z plochy na celou obrazovku.

**Android (Chrome):** otevři adresu v Chrome → nabídka ⋮ → **Instalovat aplikaci**
(nebo „Přidat na plochu“). Chrome často nabídne instalaci sám dole na obrazovce.

Po prvním otevření funguje aplikace i bez internetu. Postup se ukládá v zařízení (localStorage).

### Synchronizace mezi zařízeními
V přehledu dole: **Nastavení → Synchronizace mezi zařízeními**. Vytvoř si na GitHubu token
jen s oprávněním `gist` (odkaz „vytvořit token“ v aplikaci), vlož ho na každém zařízení a klepni na
**Připojit**. Postup se uloží do tajného gistu `deutsch-up-progress.json` a slučuje se (nic se nepřepisuje)
při spuštění, po každém bloku a při zavření aplikace. Token zůstává jen v daném prohlížeči.

**Exportovat / Importovat postup** v tomtéž místě funguje i bez tokenu – stáhne JSON zálohu a umí ji
zase načíst a sloučit.

## Co aplikace umí

- **Kurz na 7 týdnů (49 dní)**: týden 1 = pády, předložky, minulé časy; týdny 2–7 = slovosled a spojky, vedlejší věty
  a Konjunktiv II, vztažné věty a zájmena, stupňování a pasivum, struktury B1, závěrečné opakování. Každá lekce má výklad,
  cvičení, slovíčka a poslech; 6. den týdne je opakování, 7. den test s delšími větami, C-testem a psaním.
- **Typy úkolů**: doplňování, výběr, skládání slov do věty, překlad celých (i dlouhých) vět z češtiny, diktát,
  poslech s otázkami (čte hlas zařízení), C-test, čtení, psaní s kontrolou zadání a vzorovým textem.
- **Vysvětlení chyb** (`site/js/diagnose.js`): pozná špatný pád členu, koncovku přídavného jména, slabý tvar silného
  slovesa, ge- u příčestí, předložku podle češtiny, množné číslo, rod, přehlásku, překlep i sloveso na špatném místě.
  Volitelně podrobné vysvětlení od Claude s vlastním API klíčem (Nastavení → Oprava textů pomocí AI).
- **Opakování v rozestupech**: každý úkol se vrací po 1, 2, 4, 8, 16, 35, 70 dnech; „Dnešní opakování“ na přehledu.
- **Slovník** (tlačítko Slovník nebo klepnutí na slovo): 168 000 německých hesel z Wiktionary, hledání i podle tvaru
  (ging → gehen) a česky (pes → der Hund). Bez českého překladu ukáže anglický překlad a německý výklad.
  Slova jde přidat do **Mých slovíček**, která se procvičují s opakováním.
- **Karta postavy**: 13 dovedností s úrovní, XP, úspěšností a slabým místem; odhad úrovně A2–B1.
- **Vzhled**: světlý / tmavý / podle systému a barva zvýraznění (Nastavení → Vzhled).

## Přegenerování bank.js

```sh
node tools/gen_dekl.js && node tools/build.js     # nebo: npm run bank
```

`build.js` zapisuje rovnou do `site/bank.js`; obsah týdnů 2–7 je v `tools/course/w*.js` (pomocné funkce v
`tools/course/lib.js`, poslech v `tools/course/listen.js`) a do banky ho přidává `tools/build_course.js`.
`build_dict.js` pak sestaví slovník do `site/dict/<hash>/` (jen když existuje `tools/dict_src/`, jinak nechá stávající).

Zdroj slovníku (3,2 GB, není v gitu):

```sh
mkdir -p tools/dict_src
curl -L https://kaikki.org/dewiktionary/Deutsch/kaikki.org-dictionary-Deutsch.jsonl -o tools/dict_src/de.jsonl
curl -L https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/de/de_50k.txt -o tools/dict_src/de_50k.txt
npm run dict:extract && npm run bank
```

Slovníková data se cachují zvlášť (`du-dict-v1`) a přežijí aktualizace aplikace; precachuje se jen `dict/version.json`.

Další jednorázové skripty: `npm run icons` (PNG ikony z `assets/*.svg`), `npm run fonts`
(stáhne fonty do `site/fonts/`).

## Nasazení a aktualizace

- Každý push do `main` spustí `.github/workflows/deploy.yml`: `tools/stamp.js` vepíše do `site/sw.js`
  hash commitu a seznam všech souborů ke cache, složka `site/` se nahraje a nasadí na Pages.
- Díky hashi má každé nasazení novou cache; stará se při aktivaci smaže. Verzi není potřeba zvyšovat ručně.
- Otevřená aplikace si novou verzi stáhne na pozadí (i při návratu do aplikace) a ukáže lištu
  **„Je k dispozici nová verze“** – po klepnutí na **Obnovit** se přepne na novou verzi.

## Lokální vývoj a testy

```sh
npm install && npx playwright install chromium
npm run serve        # http://localhost:4173/deutsch-up/ (stejná podcesta jako na Pages)
npm test             # offline, fonty/ikony z cache, postup, export/import, sync, instalovatelnost, aktualizace
LIVE_URL=https://vlcekmat.github.io/deutsch-up/ npx playwright test live   # kontrola nasazené verze
```
