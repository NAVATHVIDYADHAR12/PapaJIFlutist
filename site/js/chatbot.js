/* ============================================================
   CHATBOT

   A local, rule-based guide — it answers from the information already
   on the page (timings, styles, fees, branches, contact). No network
   calls, so it works offline and cannot say anything invented.
   ============================================================ */
(function () {
'use strict';

var bot    = document.getElementById('bot');
var fab    = document.getElementById('botFab');
var panel  = document.getElementById('botPanel');
var close  = document.getElementById('botClose');
var log    = document.getElementById('botLog');
var form   = document.getElementById('botForm');
var input  = document.getElementById('botInput');
var chips  = document.getElementById('botChips');
var tools  = document.getElementById('botTools');
var readBt = document.getElementById('botRead');
var transp = document.getElementById('botTransport');
var pauseB = document.getElementById('botPause');
var stopB  = document.getElementById('botStop');
var micBt  = document.getElementById('botMic');
if (!bot || !fab || !panel || !log) return;

var PHONE = '94407 11441';

/* ---------- what it knows ---------- */
var ANSWERS = [
  {
    keys: ['hello', 'hi ', 'hey', 'namaste', 'good morning', 'good evening'],
    say:  'Namaste! 🙏 I can tell you about the classes, the styles taught, our branches or how to book a trial. What would you like to know?'
  },
  {
    keys: ['style', 'hindustani', 'carnatic', 'lite', 'film', 'what do you teach', 'tradition'],
    say:  'Three traditions are taught on the bamboo flute — <b>Hindustani</b> (North Indian ragas, alap, gayaki-ang), <b>Carnatic</b> (gamakas, varnams, kritis) and <b>Lite Music</b> (film songs, devotional and light melodies).'
  },
  {
    keys: ['beginner', 'no experience', 'never played', 'start', 'new to music', 'basic'],
    say:  'No prior music experience is needed at all. Teaching starts from breath control and the very first note, at whatever pace suits you.'
  },
  {
    keys: ['age', 'kid', 'child', 'adult', 'old', 'how young'],
    say:  'Both adults and kids are welcome, at any level. Lessons are shaped around each student individually.'
  },
  {
    keys: ['where', 'location', 'branch', 'address', 'tarnaka', 'kachiguda', 'hyderabad', 'telangana'],
    say:  'Classes run at <b>Tarnaka</b> and <b>Kachiguda</b> in Hyderabad, Telangana. Call ' + PHONE + ' and we will point you to whichever is closer.'
  },
  {
    keys: ['contact', 'phone', 'call', 'number', 'reach', 'whatsapp'],
    say:  'You can reach us on <a href="tel:+919440711441">' + PHONE + '</a>. A call is the quickest way to book a trial class.'
  },
  {
    keys: ['trial', 'book', 'join', 'admission', 'enroll', 'enrol', 'sign up'],
    say:  'To book a trial class, call <a href="tel:+919440711441">' + PHONE + '</a> — or use the <b>Come Join Us</b> button up in the hero.'
  },
  {
    keys: ['teacher', 'who teaches', 'guru', 'navath', 'vittaleshwar', 'about'],
    say:  '<b>Navath Vittaleshwar</b> teaches — a flautist devoted to the Indian bamboo flute, known for a patient, beginner-friendly approach and individual attention for every student.'
  },
  {
    keys: ['fee', 'cost', 'price', 'charge', 'how much', 'payment'],
    say:  'Fees depend on the branch, the schedule and how often you would like to meet. Please call <a href="tel:+919440711441">' + PHONE + '</a> for current rates — I would rather you get exact numbers than a guess from me.'
  },
  {
    keys: ['time', 'timing', 'schedule', 'when', 'day', 'weekend', 'batch'],
    say:  'Learning is kept flexible for all ages, so timings are arranged to fit your week. Call <a href="tel:+919440711441">' + PHONE + '</a> to find a slot that works.'
  },
  {
    keys: ['flute', 'instrument', 'bansuri', 'buy', 'bring', 'which flute'],
    say:  'Lessons are on the Indian bamboo flute (bansuri). If you do not own one yet, ask on your first call and you will be guided to a suitable beginner flute.'
  },
  {
    keys: ['online', 'remote', 'zoom', 'video class'],
    say:  'Please ask about online lessons directly on <a href="tel:+919440711441">' + PHONE + '</a> — arrangements vary by batch.'
  },
  {
    keys: ['playlist', 'song', 'listen', 'music', 'recording', 'youtube'],
    say:  'Have a look at the <b>Playlist</b> section on this page — you can play recordings right here and star your favourites, and they will appear in the ★ menu in the navigation bar.'
  },
  {
    keys: ['thank', 'thanks', 'bye', 'great', 'nice'],
    say:  'Happy to help! 🎶 Call ' + PHONE + ' whenever you are ready to begin.'
  }
];

var FALLBACK = 'I am a small guide, so I only know the basics — styles taught, ages, branches, trial classes and contact. For anything else, calling <a href="tel:+919440711441">' + PHONE + '</a> will get you a proper answer.';

var CHIPS = [
  'What styles do you teach?',
  'Where are the branches?',
  'I am a complete beginner',
  'Book a trial class'
];

function answerFor(text) {
  var q = ' ' + text.toLowerCase().trim() + ' ';
  var best = null, bestScore = 0;

  ANSWERS.forEach(function (entry) {
    var score = 0;
    entry.keys.forEach(function (k) {
      if (q.indexOf(k) !== -1) score += k.length;      // longer match wins
    });
    if (score > bestScore) { bestScore = score; best = entry; }
  });

  return best ? best.say : FALLBACK;
}

/* ---------- rendering ---------- */
function addMsg(html, who) {
  var el = document.createElement('div');
  el.className = 'bot-msg is-' + who;
  el.innerHTML = html;
  log.appendChild(el);
  log.scrollTop = log.scrollHeight;
  return el;
}

function addTyping() {
  var el = document.createElement('div');
  el.className = 'bot-msg is-bot';
  el.innerHTML = '<span class="bot-typing"><span></span><span></span><span></span></span>';
  log.appendChild(el);
  log.scrollTop = log.scrollHeight;
  return el;
}

function respond(text) {
  var typing = addTyping();
  window.setTimeout(function () {
    typing.remove();
    var reply = answerFor(text);
    addMsg(reply, 'bot');
    speak(plainText(reply));
  }, 520 + Math.random() * 420);
}

function buildChips() {
  if (!chips) return;
  chips.innerHTML = '';
  CHIPS.forEach(function (label) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'bot-chip';
    b.textContent = label;
    b.addEventListener('click', function () {
      addMsg(label, 'me');
      respond(label);
    });
    chips.appendChild(b);
  });
}

/* ============================================================
   VOICE

   Read aloud  — speechSynthesis speaks each reply as it arrives,
                 with pause/resume and stop.
   Voice input — SpeechRecognition dictates into the field.

   Both are feature-detected: if the browser has neither, the
   controls are never shown, so nothing offers what it cannot do.
   ============================================================ */
var synth = window.speechSynthesis || null;
var SR    = window.SpeechRecognition || window.webkitSpeechRecognition || null;

var readAloud = false;
var speaking  = false;
var paused    = false;

/* the replies carry markup and links; speak the words only */
function plainText(html) {
  var d = document.createElement('div');
  d.innerHTML = html;
  return (d.textContent || '').replace(/\s+/g, ' ').trim();
}

function setSpeakingUI(on) {
  speaking = on;
  if (tools) tools.classList.toggle('is-speaking', on);
  if (transp) transp.hidden = !on;
  if (!on) { paused = false; setPauseIcon(false); }
}

function setPauseIcon(isPaused) {
  if (!pauseB) return;
  var ico = pauseB.firstElementChild;
  if (ico) ico.className = isPaused ? 'ico-play-sm' : 'ico-pause';
  pauseB.setAttribute('aria-label', isPaused ? 'Resume reading' : 'Pause reading');
}

function speak(text) {
  if (!synth || !readAloud || !text) return;
  synth.cancel();                       // never let two replies overlap
  var u = new SpeechSynthesisUtterance(text);
  u.rate = 0.98;
  u.pitch = 1;
  u.lang = document.documentElement.lang || 'en-US';
  u.onstart = function () { setSpeakingUI(true); };
  u.onend   = function () { setSpeakingUI(false); };
  u.onerror = function () { setSpeakingUI(false); };
  synth.speak(u);
}

function stopSpeaking() {
  if (synth) synth.cancel();
  setSpeakingUI(false);
}

if (synth && readBt) {
  readBt.addEventListener('click', function () {
    readAloud = !readAloud;
    readBt.setAttribute('aria-pressed', String(readAloud));
    if (!readAloud) stopSpeaking();
    else {
      // read the reply already on screen, so the button does something now
      var last = log.querySelector('.bot-msg.is-bot:last-child');
      if (last) speak(plainText(last.innerHTML));
    }
  });

  if (pauseB) pauseB.addEventListener('click', function () {
    if (!synth) return;
    if (paused) { synth.resume(); paused = false; }
    else        { synth.pause();  paused = true;  }
    setPauseIcon(paused);
  });

  if (stopB) stopB.addEventListener('click', stopSpeaking);
} else if (readBt) {
  readBt.hidden = true;                 // no synthesis here
}

/* ---------- voice to text ---------- */
var rec = null;
var listening = false;

if (SR && micBt) {
  rec = new SR();
  rec.lang = document.documentElement.lang || 'en-US';
  rec.interimResults = true;
  rec.continuous = false;
  rec.maxAlternatives = 1;

  var baseText = '';

  rec.onstart = function () {
    listening = true;
    micBt.setAttribute('aria-pressed', 'true');
    if (input) input.classList.add('is-listening');
  };

  rec.onresult = function (e) {
    var said = '';
    for (var i = e.resultIndex; i < e.results.length; i++) said += e.results[i][0].transcript;
    if (input) input.value = (baseText ? baseText + ' ' : '') + said.trim();
  };

  rec.onerror = function (e) {
    endListening();
    if (e && (e.error === 'not-allowed' || e.error === 'service-not-allowed')) {
      addMsg('I could not reach the microphone — the browser blocked it. You can allow it from the padlock in the address bar, or just type instead.', 'bot');
    }
  };

  rec.onend = endListening;

  micBt.hidden = false;
  micBt.addEventListener('click', function () {
    if (listening) { try { rec.stop(); } catch (e) {} return; }
    baseText = (input && input.value ? input.value.trim() : '');
    stopSpeaking();                     // do not listen to our own voice
    try { rec.start(); } catch (e) { endListening(); }
  });
}

function endListening() {
  listening = false;
  if (micBt) micBt.setAttribute('aria-pressed', 'false');
  if (input) input.classList.remove('is-listening');
}

/* show the toolbar only if at least one of the two is available */
if (tools && (synth || SR)) tools.hidden = false;

/* ---------- open / close ---------- */
var greeted = false;
var callTimer = null;

function open() {
  panel.hidden = false;
  bot.classList.add('is-open');
  fab.setAttribute('aria-expanded', 'true');
  bot.classList.remove('is-calling');
  window.clearTimeout(callTimer);

  if (!greeted) {
    greeted = true;
    addMsg('Namaste 🙏 I am the flute guide. Ask me about the classes, the branches, or booking a trial.', 'bot');
    buildChips();
  }
  if (input) input.focus();
}

function shut() {
  stopSpeaking();
  if (listening && rec) { try { rec.stop(); } catch (e) {} }
  panel.hidden = true;
  bot.classList.remove('is-open');
  fab.setAttribute('aria-expanded', 'false');

  // pipe up once, a moment after being dismissed
  window.clearTimeout(callTimer);
  callTimer = window.setTimeout(function () {
    bot.classList.add('is-calling');
    window.setTimeout(function () { bot.classList.remove('is-calling'); }, 5600);
  }, 900);
}

fab.addEventListener('click', function () {
  if (panel.hidden) open(); else shut();
});
if (close) close.addEventListener('click', shut);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !panel.hidden) shut();
});

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = (input.value || '').trim();
    if (!text) return;
    addMsg(text.replace(/[<>]/g, ''), 'me');
    input.value = '';
    respond(text);
  });
}

})();
