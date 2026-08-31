/* ============================================================
   FILM AUDIO

   The film's own soundtrack is silent, so the music is a separate
   WAV played alongside it. Two media elements can drift, so this
   pairs them: one start, one stop, and a correction whenever they
   slip more than a frame or two apart.

   The video is always muted. Muted video autoplays unconditionally,
   which means the picture never fails to start — only the music has
   to wait for permission, and it joins at the video's position the
   moment it is allowed, so the two stay in step either way.
   ============================================================ */
window.FilmAudio = (function () {
'use strict';

var DRIFT = 0.22;          // seconds out of step before correcting
var GESTURES = ['pointerdown', 'pointerup', 'click', 'keydown', 'touchstart', 'touchend'];

function pair(video, audio, opts) {
  if (!video) return null;
  opts = opts || {};

  var armed = false;
  var stopped = false;
  var poll = null;

  video.muted = true;                         // its own track is silent
  if (audio) audio.volume = 1;

  function tryAudio() {
    if (!audio || stopped) return;
    // setting currentTime before the element has metadata can throw
    try { audio.currentTime = video.currentTime || 0; } catch (e) {}
    var p = audio.play();
    if (p && p.then) {
      p.then(function () {
        if (opts.onSound) opts.onSound();
      }).catch(function () {
        arm();
        if (opts.onBlocked) opts.onBlocked();
      });
    }
  }

  function onGesture() {
    disarm();
    tryAudio();
  }

  function arm() {
    if (armed || stopped) return;
    armed = true;
    GESTURES.forEach(function (e) { window.addEventListener(e, onGesture, true); });
    // also catch activation granted elsewhere, that no listener here saw
    if (navigator.userActivation && !poll) {
      var tries = 0;
      poll = window.setInterval(function () {
        if (stopped || !audio || !audio.paused || tries++ > 60) { clearPoll(); return; }
        if (navigator.userActivation.hasBeenActive) { clearPoll(); disarm(); tryAudio(); }
      }, 300);
    }
  }

  function disarm() {
    if (!armed) return;
    armed = false;
    GESTURES.forEach(function (e) { window.removeEventListener(e, onGesture, true); });
  }

  function clearPoll() {
    if (poll) { window.clearInterval(poll); poll = null; }
  }

  /* The mp4 carries the same soundtrack as the WAV, so if anything ever
     unmutes the picture — the native controls in the replay modal, most
     likely — the music would play twice, very slightly out of phase. Hold
     the video silent, and let its volume slider drive the WAV instead so
     the control still does something useful. */
  video.addEventListener('volumechange', function () {
    if (!audio || stopped) return;
    if (!video.muted) video.muted = true;
    audio.volume = video.volume;
  });

  // keep the two locked together
  function onTime() {
    if (!audio || audio.paused || stopped) return;
    var slip = Math.abs(audio.currentTime - video.currentTime);
    if (slip > DRIFT) audio.currentTime = video.currentTime;
  }
  video.addEventListener('timeupdate', onTime);

  // the music never outlives the picture
  function onEnded() { if (audio) { audio.pause(); } }
  video.addEventListener('ended', onEnded);
  video.addEventListener('pause', function () {
    if (audio && !video.ended && !stopped) audio.pause();
  });
  video.addEventListener('play', function () {
    if (audio && audio.paused && !stopped) tryAudio();
  });

  return {
    start: function () {
      stopped = false;
      try { video.currentTime = 0; } catch (e) {}
      if (audio) { try { audio.currentTime = 0; } catch (e) {} }

      var vp = video.play();                  // muted: always allowed
      if (vp && vp.catch) vp.catch(function () {});
      tryAudio();
    },

    stop: function () {
      stopped = true;
      disarm();
      clearPoll();
      try { video.pause(); } catch (e) {}
      if (audio) { try { audio.pause(); } catch (e) {} }
    },

    // true once the music is actually running
    playing: function () { return !!audio && !audio.paused; }
  };
}

return { pair: pair };

})();
