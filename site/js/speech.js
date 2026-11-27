/* Deutsch Up – German text-to-speech with the device's own voices (works offline where the voice is installed).
   DU_SPEAK.say(text, { rate, onend })   lines "A: …" / "B: …" are read as a dialogue with two voices
   DU_SPEAK.stop()  DU_SPEAK.supported()  DU_SPEAK.hasGerman() */
(function () {
  'use strict';
  var synth = window.speechSynthesis || null;
  var voices = [];
  function load() { if (synth) voices = synth.getVoices() || []; }
  if (synth) { load(); if (synth.addEventListener) synth.addEventListener('voiceschanged', load); else synth.onvoiceschanged = load; }

  function german() {
    var de = voices.filter(function (v) { return /^de([-_]|$)/i.test(v.lang); });
    // prefer Germany, then local (offline) voices
    de.sort(function (a, b) {
      return (/de[-_]DE/i.test(b.lang) - /de[-_]DE/i.test(a.lang)) || ((b.localService ? 1 : 0) - (a.localService ? 1 : 0));
    });
    return de;
  }
  var pref = null;
  try { pref = localStorage.getItem('de-voice-v1'); } catch (e) { /* ignore */ }

  function pick(i) {
    var de = german();
    if (!de.length) return null;
    if (i === 0 && pref) { var p = de.filter(function (v) { return v.voiceURI === pref; })[0]; if (p) return p; }
    return de[i % de.length];
  }

  function stop() { if (synth) synth.cancel(); }

  function say(text, o) {
    o = o || {};
    if (!synth) { if (o.onend) o.onend(false); return false; }
    stop();
    var lines = String(text).split(/\n+/).filter(function (l) { return l.trim(); });
    var dialog = lines.some(function (l) { return /^[AB]:\s/.test(l); });
    var queue = dialog ? lines : [String(text).replace(/\n+/g, ' ')];
    var left = queue.length;
    queue.forEach(function (line) {
      var who = /^B:\s/.test(line) ? 1 : 0;
      var u = new SpeechSynthesisUtterance(line.replace(/^[AB]:\s*/, ''));
      u.lang = 'de-DE';
      var v = pick(dialog ? who : 0);
      if (v) u.voice = v;
      u.rate = o.rate || 0.95;
      // a second voice may not exist: vary the pitch so the two speakers still sound different
      if (dialog && who === 1 && german().length < 2) u.pitch = 0.75;
      u.onend = u.onerror = function () { left -= 1; if (left === 0 && o.onend) o.onend(true); };
      synth.speak(u);
    });
    return true;
  }

  window.DU_SPEAK = {
    say: say, stop: stop,
    supported: function () { return !!synth; },
    hasGerman: function () { load(); return german().length > 0; },
    voices: function () { load(); return german(); },
    setVoice: function (uri) { pref = uri; try { localStorage.setItem('de-voice-v1', uri); } catch (e) { /* ignore */ } }
  };
})();
