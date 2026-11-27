/* Deutsch Up – German text-to-speech with the device's own voices (works offline where the voice is installed).
   DU_SPEAK.say(text, { rate, voice: 'f' | 'm' | 'auto', onend })
     'auto' (default) alternates female / male per text (the same text always gets the same voice);
     lines "A: …" / "B: …" are read as a dialogue with two different voices.
   DU_SPEAK.stop()  DU_SPEAK.supported()  DU_SPEAK.hasGerman()  DU_SPEAK.voices()
   DU_SPEAK.pick('f' | 'm')  DU_SPEAK.setVoice('f' | 'm', voiceURI)  DU_SPEAK.mix() / setMix(bool)
   Browsers don't report a voice's gender, so it is guessed from well-known voice names. */
(function () {
  'use strict';
  var synth = window.speechSynthesis || null;
  var voices = [];
  var alive = []; // keep utterances referenced until they end (Chrome drops unreferenced ones mid-sentence)
  var listeners = [];
  function load() { if (synth) voices = synth.getVoices() || []; }
  function changed() { var n = voices.length; load(); if (voices.length !== n) listeners.forEach(function (f) { try { f(); } catch (e) { /* ignore */ } }); }
  if (synth) {
    load();
    if (synth.addEventListener) synth.addEventListener('voiceschanged', changed);
    else synth.onvoiceschanged = changed;
  }

  var MALE = /\b(markus|yannick|viktor|martin|stefan|conrad|killian|bernd|christoph|kasper|klaus|ralf|florian|jonas|hans|felix|lukas|tobias|daniel|thomas|reed|eddy|grandpa|rocko|male|mann|männlich)\b|de-de-x-(deg|dea)/i;
  var FEMALE = /\b(anna|helena|petra|katja|hedda|amala|elke|gisela|klarissa|louisa|maja|tanja|seraphina|marlene|vicki|sandy|shelley|grandma|flo|ingrid|female|frau|weiblich)\b|de-de-x-(deb|dec|def|nfh)/i;
  function gender(v) {
    var n = (v.name || '') + ' ' + (v.voiceURI || '');
    if (MALE.test(n)) return 'm';
    if (FEMALE.test(n)) return 'f';
    if (/google deutsch/i.test(n)) return 'f';
    return '';
  }
  function german() {
    load();
    var de = voices.filter(function (v) { return /^de([-_]|$)/i.test(v.lang); });
    // prefer Germany, then offline voices, then "enhanced/premium" quality
    function score(v) { return (/de[-_]DE/i.test(v.lang) ? 4 : 0) + (v.localService ? 2 : 0) + (/premium|enhanced|natural|neural/i.test(v.name) ? 1 : 0); }
    return de.sort(function (a, b) { return score(b) - score(a); });
  }

  var LS = 'de-voices-v2';
  var cfg = { f: '', m: '', mix: true };
  try { var saved = JSON.parse(localStorage.getItem(LS) || 'null'); if (saved) cfg = Object.assign(cfg, saved); } catch (e) { /* ignore */ }
  function save() { try { localStorage.setItem(LS, JSON.stringify(cfg)); } catch (e) { /* ignore */ } }

  // { voice, pitch }: the chosen voice for a gender; with no male voice installed, a female voice at a lower pitch
  function pick(g) {
    var de = german();
    if (!de.length) return { voice: null, pitch: g === 'm' ? 0.7 : 1, fake: g === 'm' };
    var byUri = function (u) { return u && de.filter(function (v) { return v.voiceURI === u; })[0]; };
    var v = byUri(cfg[g]) || de.filter(function (x) { return gender(x) === g; })[0];
    if (v) return { voice: v, pitch: 1, fake: false };
    var other = byUri(cfg[g === 'm' ? 'f' : 'm']) || de.filter(function (x) { return gender(x) !== g; })[0] || de[0];
    return { voice: other, pitch: g === 'm' ? 0.7 : 1.2, fake: true };
  }
  function hash(s) { var x = 0; for (var i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) | 0; return Math.abs(x); }

  function stop() { if (synth && (synth.speaking || synth.pending)) synth.cancel(); }

  function speakQueue(items, onend) {
    var left = items.length;
    items.forEach(function (it) {
      var u = new SpeechSynthesisUtterance(it.text);
      u.lang = (it.p.voice && it.p.voice.lang) || 'de-DE';
      if (it.p.voice) u.voice = it.p.voice;
      u.pitch = it.p.pitch;
      u.rate = it.rate;
      alive.push(u);
      u.onend = u.onerror = function () {
        alive.splice(alive.indexOf(u), 1);
        left -= 1;
        if (left === 0 && onend) onend(true);
      };
      synth.speak(u);
    });
    // Chrome / Safari can sit in a paused state after a cancel or a backgrounded tab
    if (synth.paused) synth.resume();
  }

  function say(text, o) {
    o = o || {};
    if (!synth) { if (o.onend) o.onend(false); return false; }
    text = String(text);
    var rate = o.rate || 0.95;
    var lines = text.split(/\n+/).filter(function (l) { return l.trim(); });
    var dialog = lines.some(function (l) { return /^[AB]:\s/.test(l); });
    var first = o.voice === 'f' || o.voice === 'm' ? o.voice : (cfg.mix ? (hash(text) % 2 ? 'm' : 'f') : 'f');
    var items;
    if (dialog) {
      var second = first === 'f' ? 'm' : 'f';
      items = lines.map(function (l) {
        var g = /^B:\s/.test(l) ? second : first;
        return { text: l.replace(/^[AB]:\s*/, ''), p: pick(g), rate: rate };
      });
    } else {
      items = [{ text: text.replace(/\n+/g, ' '), p: pick(first), rate: rate }];
    }
    var busy = synth.speaking || synth.pending;
    stop();
    // iOS Safari drops an utterance queued in the same tick as cancel(); only wait when something was playing
    if (busy) setTimeout(function () { speakQueue(items, o.onend); }, 120);
    else speakQueue(items, o.onend);
    return true;
  }

  window.DU_SPEAK = {
    say: say, stop: stop, pick: pick, gender: gender,
    supported: function () { return !!synth; },
    onVoices: function (f) { listeners.push(f); },
    hasGerman: function () { return german().length > 0; },
    voices: german,
    config: function () { return Object.assign({}, cfg); },
    setVoice: function (g, uri) { cfg[g] = uri; save(); },
    mix: function () { return !!cfg.mix; },
    setMix: function (on) { cfg.mix = !!on; save(); }
  };
})();
