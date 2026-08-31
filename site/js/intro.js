/* ============================================================
   INTRO FILM
   Plays assets/intro.mp4 with sound the moment the page loads,
   then dissolves into the hero.

   Browsers block unmuted autoplay unless the user has already
   interacted with the site, so this tries sound first and, if the
   browser refuses, starts muted and unmutes on the first gesture
   without asking the visitor for anything.
   ============================================================ */
(function () {
'use strict';

var intro  = document.getElementById('intro');
var video  = document.getElementById('introVideo');
var skip   = document.getElementById('introSkip');

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
  stopListening();
  signalDone();
  intro.classList.add('is-done');
  document.body.classList.remove('is-locked');
  try { video.pause(); } catch (e) {}
  // remove from the a11y tree and the paint path once faded out
  window.setTimeout(function () {
    intro.setAttribute('hidden', '');
    video.removeAttribute('src');
    try { video.load(); } catch (e) {}
  }, 1000);
}

if (reduced) { finish(); return; }

/* ------------------------------------------------------------
   SOUND

   Browsers refuse unmuted autoplay until the document has user
   activation. That is enforced by the browser and a page cannot opt
   out of it, so the job here is to get sound on at the first possible
   instant without ever asking the visitor to press anything.

   Only real activation events count — `wheel` and `mousemove` do NOT
   grant activation, so listening for them can never unlock audio.
   ------------------------------------------------------------ */
var GESTURES = ['pointerdown', 'pointerup', 'click', 'keydown', 'touchstart', 'touchend'];
var listening = false;

function soundOn() {
  video.muted = false;
  video.volume = 1;
  // Unmuting an autoplaying element can make the browser pause it, so ask
  // for playback again — inside a gesture this is always granted.
  var p = video.play();
  if (p && p.catch) p.catch(function () {});
}

function onGesture() {
  soundOn();
  stopListening();
}

function stopListening() {
  if (!listening) return;
  listening = false;
  GESTURES.forEach(function (e) { window.removeEventListener(e, onGesture, true); });
}

function listenForGesture() {
  if (listening || finished) return;
  listening = true;
  // capture phase on window, so it fires no matter what was clicked
  GESTURES.forEach(function (e) { window.addEventListener(e, onGesture, true); });
}

function start() {
  // Armed up front rather than only after a refusal: a visitor who clicks
  // while the first attempt is still pending gets sound immediately.
  listenForGesture();

  video.muted = false;
  video.volume = 1;

  var p = video.play();
  if (!p || !p.catch) return;

  p.catch(function () {
    // sound was refused — start it silently, the gesture listeners stand by
    video.muted = true;
    var q = video.play();
    if (q && q.catch) q.catch(finish);   // playback refused outright: skip it
    watchForActivation();
  });
}

/* A safety net for activation my listeners did not see — a gesture that
   landed before this script ran, or one the browser counted but did not
   deliver here. Only unmutes once activation actually exists: unmuting
   without it makes Chrome pause the video, which would be worse than
   staying silent. */
function watchForActivation() {
  if (!navigator.userActivation) return;
  var tries = 0;
  var timer = window.setInterval(function () {
    if (finished || !video.muted || tries++ > 60) { window.clearInterval(timer); return; }
    if (navigator.userActivation.hasBeenActive) {
      soundOn();
      stopListening();
      window.clearInterval(timer);
    }
  }, 300);
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
