/* ============================================================
   UI — scroll reveals, video modal, back-to-top
   ============================================================ */
(function () {
'use strict';

/* scroll reveals now live in js/reveal.js, which replays them */

/* ---------- video modal ---------- */
var modal  = document.getElementById('vmodal');
var video  = document.getElementById('vmodalVideo');
var audio  = document.getElementById('vmodalAudio');
var open   = document.getElementById('filmBtn');
var close  = document.getElementById('vmodalClose');
var scrim  = document.getElementById('vmodalScrim');

// the film's own track is silent; the music is the paired WAV
var film = (window.FilmAudio && video) ? window.FilmAudio.pair(video, audio) : null;

function openModal() {
  if (!modal) return;
  modal.hidden = false;
  document.body.classList.add('is-locked');
  // opened by a click, so the music is always permitted here
  if (film) film.start();
  else if (video) {
    video.currentTime = 0;
    var p = video.play();
    if (p && p.catch) p.catch(function () {});     // controls are there if autoplay is refused
  }
  if (close) close.focus();
}

function closeModal() {
  if (!modal || modal.hidden) return;
  if (film) film.stop();
  else if (video) video.pause();
  modal.hidden = true;
  document.body.classList.remove('is-locked');
  if (open) open.focus();
}

if (open)  open.addEventListener('click', openModal);
if (close) close.addEventListener('click', closeModal);
if (scrim) scrim.addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeModal();
});

/* ---------- back to top ---------- */
var topBtn = document.getElementById('topBtn');
if (topBtn) {
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      topBtn.classList.toggle('is-visible', window.scrollY > 620);
    });
  }, { passive: true });

  topBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

})();
