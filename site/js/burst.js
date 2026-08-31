/* ============================================================
   THE SHOWER

   The ♫ button rains musical symbols, peacock plumes, flowers and
   leaves from the top. Every press starts another fall, and presses
   stack rather than cancelling each other.

   The cursor lives in js/cursor.js.
   ============================================================ */
(function () {
'use strict';

var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function rand(a, b) { return Math.random() * (b - a) + a; }
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

var btn  = document.getElementById('burstBtn');
var rain = document.getElementById('rain');
if (!btn || !rain) return;

var NOTES   = ['♪', '♫', '♬', '\u{1D11E}', '♩', '♭'];
var NOTE_C  = ['#E24B7A', '#8A4BE2', '#0E7FA8', '#1F9A56', '#E8853A', '#D4AF63', '#19B7C5'];
var FLOWERS = [
  { c: '#FFFFFF', accent: '#E8C86A' },   // white
  { c: '#F2A8C4', accent: '#C9527F' },   // pink
  { c: '#F7DA6A', accent: '#D89B24' },   // yellow
  { c: '#8FB6F2', accent: '#3E6FC4' }    // blue
];
var LEAVES  = [
  { c: '#2E9468', accent: '#7FC48F' },   // green
  { c: '#E8B93A', accent: '#F8E39B' },   // yellow
  { c: '#E8853A', accent: '#F6B968' }    // orange
];

// weighted mix, so the fall reads as music first and garden second
var BAG = [];
function fill(kind, n) { for (var i = 0; i < n; i++) BAG.push(kind); }
fill('note', 8);
fill('flower', 6);
fill('leaf', 5);
fill('feather', 3);
fill('spark', 4);

function makeDrop() {
  var kind = pick(BAG);
  var el = document.createElement('span');
  var size;

  if (kind === 'note') {
    el.className = 'drop drop-note';
    el.textContent = pick(NOTES);
    size = rand(18, 38);
    el.style.setProperty('--c', pick(NOTE_C));
  } else if (kind === 'flower') {
    var f = pick(FLOWERS);
    el.className = 'drop drop-flower';
    size = rand(12, 22);
    el.style.setProperty('--c', f.c);
    el.style.setProperty('--accent', f.accent);
  } else if (kind === 'leaf') {
    var l = pick(LEAVES);
    el.className = 'drop drop-leaf';
    size = rand(16, 30);
    el.style.setProperty('--c', l.c);
    el.style.setProperty('--accent', l.accent);
  } else if (kind === 'feather') {
    el.className = 'drop drop-feather';
    size = rand(26, 46);
  } else {
    el.className = 'drop drop-spark';
    size = rand(4, 9);
  }

  el.style.setProperty('--x',     rand(-2, 100).toFixed(1) + 'vw');
  el.style.setProperty('--s',     size.toFixed(0) + 'px');
  el.style.setProperty('--d',     rand(3.4, 6.8).toFixed(2) + 's');
  el.style.setProperty('--dl',    rand(0, 1.5).toFixed(2) + 's');
  el.style.setProperty('--drift', rand(-140, 140).toFixed(0) + 'px');
  el.style.setProperty('--spin',  rand(-720, 720).toFixed(0) + 'deg');
  el.style.setProperty('--rot',   rand(0, 180).toFixed(0) + 'deg');
  el.style.setProperty('--o',     rand(.7, 1).toFixed(2));
  return el;
}

function shower() {
  var frag = document.createDocumentFragment();
  var batch = [];
  for (var i = 0; i < 90; i++) {
    var el = makeDrop();
    batch.push(el);
    frag.appendChild(el);
  }
  rain.appendChild(frag);

  // clear only this batch, so an earlier fall is never cut short by a new press
  window.setTimeout(function () {
    batch.forEach(function (el) { el.remove(); });
  }, 8600);
}

btn.addEventListener('click', function () {
  if (reduced) return;
  shower();
  btn.classList.remove('is-hit');
  void btn.offsetWidth;                     // restart the kick animation
  btn.classList.add('is-hit');
});

})();
