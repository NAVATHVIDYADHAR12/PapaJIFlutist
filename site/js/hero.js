/* ============================================================
   HERO FRAME SEQUENCE
   90 stills drawn to a canvas, scrubbed by scroll position.
   Built to HeroSectionGuide.txt sections 6 and 7.
   ============================================================ */
(function () {
'use strict';

var FRAME_COUNT = 90;
var FRAME_W = 960;
var FRAME_H = 540;

function framePath(i) {
  return 'assets/hero/f' + String(i).padStart(3, '0') + '.jpg';
}

var hero   = document.getElementById('home');
var canvas = document.getElementById('heroframes');
if (!hero || !canvas) return;

var images    = new Array(FRAME_COUNT).fill(null);
var lastDrawn = -1;
var ticking   = false;

canvas.width  = FRAME_W;          // set ONCE — assigning clears the canvas
canvas.height = FRAME_H;
var ctx = canvas.getContext('2d', { alpha: false });
ctx.fillStyle = '#EAF3F6';
ctx.fillRect(0, 0, FRAME_W, FRAME_H);

// Dismissing the intro aborts the video request, which can reset whatever
// frames share the connection pool at that moment. One retry recovers them;
// a failure after that resolves null so a bad frame never stalls the rest.
function load(i, isRetry) {
  return new Promise(function (resolve) {
    var img = new Image();
    img.onload  = function () { images[i] = img; resolve(img); };
    img.onerror = function () {
      if (isRetry) { resolve(null); return; }
      window.setTimeout(function () { resolve(load(i, true)); }, 400);
    };
    img.src = framePath(i + 1);
  });
}

function nearestLoaded(i) {
  if (images[i]) return images[i];
  for (var d = 1; d < FRAME_COUNT; d++) {
    if (images[i - d]) return images[i - d];
    if (images[i + d]) return images[i + d];
  }
  return null;
}

function draw(i) {
  var img = nearestLoaded(i);
  if (!img) return;
  ctx.drawImage(img, 0, 0, FRAME_W, FRAME_H);
}

function update() {
  ticking = false;
  var rect = hero.getBoundingClientRect();
  if (rect.height === 0) return;                    // hidden hero computes nothing
  var total = rect.height - window.innerHeight;
  var progress = total <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / total));
  var i = Math.min(FRAME_COUNT - 1, Math.round(progress * (FRAME_COUNT - 1)));
  if (i !== lastDrawn) { lastDrawn = i; draw(i); }
  document.documentElement.style.setProperty('--hero-progress', progress.toFixed(4));
}

function onScroll() {
  if (!ticking) { ticking = true; requestAnimationFrame(update); }
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', function () { lastDrawn = -1; update(); }, { passive: true });

// The intro film and 90 frames would otherwise fight over Chrome's six
// connections per host, and the film loses — measured queueing of up to 34s
// on a frame. Frames aren't needed until the reader can scroll, which cannot
// happen until the film is done, so wait for it.
function introDone() {
  if (window.__introDone) return Promise.resolve();
  return new Promise(function (resolve) {
    var done = false;
    function go() { if (!done) { done = true; resolve(); } }
    document.addEventListener('intro:done', go, { once: true });
    // The film can restart itself once sound is permitted, so it may run to
    // roughly twice its length. Long enough to cover that, and still a bound.
    window.setTimeout(go, 26000);                   // never wait forever
  });
}

(async function preload() {
  await load(0);
  draw(0);                                          // something on screen immediately

  await introDone();

  var CONCURRENCY = 6;                              // keeps the pipe full without starving fonts/CSS
  var next = 1;
  await Promise.all(new Array(CONCURRENCY).fill(0).map(async function () {
    while (next < FRAME_COUNT) {
      var i = next++;
      await load(i);
      if (i === lastDrawn) draw(i);                 // repaint if the reader is sitting here
    }
  }));
  lastDrawn = -1;
  update();
})();

onScroll();

})();
