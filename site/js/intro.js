/* ============================================================
   INTRO FILM
   Plays assets/intro.mp4 with sound the moment the page loads,
   then dissolves into the hero.

   The film's own track is silent, so the music is a separate WAV of
   the same length played alongside it, paired by js/filmaudio.js so
   the two start, stay and stop together.

   Browsers block unmuted autoplay until the page has user activation.
   The video is muted, so the picture always plays; the music joins at
   the video's position the instant it is permitted — on the visitor's
   first click, tap or key press, with nothing to press.
   ============================================================ */
(function () {
'use strict';

var intro  = document.getElementById('intro');
var video  = document.getElementById('introVideo');
var audio  = document.getElementById('introAudio');
var skip   = document.getElementById('introSkip');
var cue    = document.getElementById('introSoundCue');
var film   = null;

if (!intro || !video) return;

var finished = false;
var reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// The film is an entrance, not a gate. If the page comes back already
// scrolled — a refresh partway down, or a deep link — skip it and leave the
// reader where they were. Locking the body here would discard that position.
var DEEP = 200;
function loadedScrolled() { return window.scrollY > DEEP; }

if (loadedScrolled()) {
  intro.classList.add('is-done');
  intro.setAttribute('hidden', '');
  video.removeAttribute('src');            // don't pull 4.8 MB nobody will see
  try { video.load(); } catch (e) {}
  if (audio) { audio.removeAttribute('src'); try { audio.load(); } catch (e) {} }
  finished = true;
  signalDone();
  return;
}

document.body.classList.add('is-locked');

// scroll restoration can land after this script parses, so re-check on load
window.addEventListener('load', function () {
  if (!finished && loadedScrolled()) finish();
}, { once: true });

function signalDone() {
  // hero.js waits for this before pulling 90 frames, so the film gets the
  // bandwidth to itself. The flag covers the case where this fires before
  // hero.js has had a chance to subscribe.
  window.__introDone = true;
  document.dispatchEvent(new CustomEvent('intro:done'));
}

function finish() {
  if (finished) return;
  finished = true;
  signalDone();
  intro.classList.add('is-done');
  document.body.classList.remove('is-locked');
  showCue(false);
  if (film) film.stop(); else { try { video.pause(); } catch (e) {} }
  // remove from the a11y tree and the paint path once faded out
  window.setTimeout(function () {
    intro.setAttribute('hidden', '');
    video.removeAttribute('src');
    try { video.load(); } catch (e) {}
    if (audio) { audio.removeAttribute('src'); try { audio.load(); } catch (e) {} }
  }, 1000);
}

if (reduced) { finish(); return; }

/* ------------------------------------------------------------
   PLAYBACK
   filmaudio.js keeps the muted picture and the WAV in step, and takes
   care of asking for the music again the moment the browser allows it.
   ------------------------------------------------------------ */
function showCue(on) {
  if (cue) cue.hidden = !on;
}

function start() {
  film = window.FilmAudio ? window.FilmAudio.pair(video, audio, {
    onBlocked: function () { showCue(true); },
    onSound:   function () { showCue(false); }
  }) : null;

  if (film) {
    film.start();
    return;
  }

  // helper missing for some reason: at least show the picture
  video.muted = true;
  var p = video.play();
  if (p && p.catch) p.catch(finish);
}

if (skip) skip.addEventListener('click', finish);
video.addEventListener('ended', finish);
video.addEventListener('error', finish);

document.addEventListener('keydown', function (e) {
  if (!finished && (e.key === 'Escape' || e.key === 'Enter')) finish();
});

if (video.readyState >= 2) start();
else video.addEventListener('loadeddata', start, { once: true });

// safety net: never trap the visitor behind a stalled video
window.setTimeout(function () {
  if (!finished && video.readyState < 2) finish();
}, 6000);

})();
