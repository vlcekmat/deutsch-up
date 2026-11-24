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

## Přegenerování bank.js

```sh
node tools/gen_dekl.js && node tools/build.js     # nebo: npm run bank
```

`build.js` zapisuje rovnou do `site/bank.js`. Pak změnu commitni a pushni.

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
