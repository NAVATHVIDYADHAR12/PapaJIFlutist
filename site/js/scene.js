/* ============================================================
   SCENE

   1. Monsoon leaves drifting right-to-left behind the whole page.
   2. The fly-past: as the hero hands over to "Why Learn", a flight of
      spring leaves, blossoms, a peacock plume and white birds sweeps
      across from the top-right to the bottom-left.
   ============================================================ */
(function () {
'use strict';

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

function rand(min, max) { return Math.random() * (max - min) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/* ------------------------------------------------------------
   1. BACKGROUND DRIFT — pink monsoon leaves, right to left
   ------------------------------------------------------------ */
var drift = document.getElementById('drift');
if (drift) {
  var PALETTE = [
    ['rgba(242,168,196,.85)', 'rgba(250,214,228,.7)'],   // pink
    ['rgba(236,150,183,.75)', 'rgba(248,201,220,.6)'],   // deeper pink
    ['rgba(196,215,190,.6)',  'rgba(232,244,228,.5)'],   // rain-washed green
    ['rgba(212,175,99,.5)',   'rgba(243,226,182,.45)']   // faded gold
  ];

  var frag = document.createDocumentFragment();
  for (var i = 0; i < 16; i++) {
    var leaf = document.createElement('span');
    leaf.className = 'dleaf';
    var pair = PALETTE[i % PALETTE.length];
    leaf.style.setProperty('--y',    rand(-4, 96).toFixed(1) + 'vh');
    leaf.style.setProperty('--w',    rand(16, 40).toFixed(0) + 'px');
    leaf.style.setProperty('--d',    rand(26, 52).toFixed(1) + 's');
    leaf.style.setProperty('--dl',   (-rand(0, 52)).toFixed(1) + 's');
    leaf.style.setProperty('--o',    rand(.18, .42).toFixed(2));
    leaf.style.setProperty('--fall', rand(30, 190).toFixed(0) + 'px');
    leaf.style.setProperty('--spin', rand(120, 460).toFixed(0) + 'deg');
    leaf.style.setProperty('--c1',   pair[0]);
    leaf.style.setProperty('--c2',   pair[1]);
    frag.appendChild(leaf);
  }
  // musical symbols riding the same wind, right to left, across the page
  var GLYPHS = ['♪', '♫', '♬', '\u{1D11E}', '♩', '♪', '♫'];
  var INK = [
    'rgba(8,126,158,.5)',    // peacock
    'rgba(184,137,50,.55)',  // antique gold
    'rgba(22,139,114,.45)',  // emerald
    'rgba(25,183,197,.48)'   // turquoise
  ];

  for (var n = 0; n < 13; n++) {
    var note = document.createElement('span');
    note.className = 'dnote';
    note.textContent = GLYPHS[n % GLYPHS.length];
    note.style.setProperty('--y',    rand(-2, 94).toFixed(1) + 'vh');
    note.style.setProperty('--s',    rand(15, 34).toFixed(0) + 'px');
    note.style.setProperty('--d',    rand(30, 62).toFixed(1) + 's');
    note.style.setProperty('--dl',   (-rand(0, 62)).toFixed(1) + 's');
    note.style.setProperty('--o',    rand(.22, .5).toFixed(2));
    note.style.setProperty('--sway', rand(2, 7).toFixed(1) + 'vh');
    note.style.setProperty('--c',    INK[n % INK.length]);
    frag.appendChild(note);
  }

  drift.appendChild(frag);
}

/* ------------------------------------------------------------
   2. THE FLY-PAST
   ------------------------------------------------------------ */
var stage   = document.getElementById('flyby');
var trigger = document.getElementById('flybyTrigger');
if (!stage || !trigger) return;

var KINDS = [
  { cls: 'fly-leaf is-orange', size: [16, 30], weight: 5 },
  { cls: 'fly-leaf is-yellow', size: [15, 28], weight: 5 },
  { cls: 'fly-flower is-pink', size: [11, 20], weight: 4 },
  { cls: 'fly-flower is-white',size: [10, 18], weight: 3 },
  { cls: 'fly-feather',        size: [26, 46], weight: 2 },
  { cls: 'fly-bird',           size: [20, 34], weight: 3 }
];

// expand by weight so the mix reads naturally
var BAG = [];
KINDS.forEach(function (k) {
  for (var i = 0; i < k.weight; i++) BAG.push(k);
});

var running = false;

function release() {
  if (running) return;
  running = true;

  var count = 26;
  var frag  = document.createDocumentFragment();

  for (var i = 0; i < count; i++) {
    var kind = pick(BAG);
    var el = document.createElement('span');
    el.className = 'fly ' + kind.cls;

    // start off the top-right edge, spread along that corner
    var startX = rand(58, 126);
    var startY = rand(-26, 34);
    var size   = rand(kind.size[0], kind.size[1]);

    // travel down and to the left, far enough to clear the screen
    var dx = -rand(95, 165);
    var dy =  rand(75, 135);

    el.style.setProperty('--x',   startX.toFixed(1) + 'vw');
    el.style.setProperty('--y',   startY.toFixed(1) + 'vh');
    el.style.setProperty('--s',   size.toFixed(0) + 'px');
    el.style.setProperty('--dx',  dx.toFixed(1) + 'vw');
    el.style.setProperty('--dy',  dy.toFixed(1) + 'vh');
    el.style.setProperty('--rot', rand(-540, 540).toFixed(0) + 'deg');
    el.style.setProperty('--d',   rand(2.6, 4.6).toFixed(2) + 's');
    el.style.setProperty('--dl',  rand(0, 1.5).toFixed(2) + 's');
    el.style.setProperty('--o',   rand(.6, .95).toFixed(2));

    // birds hold their heading rather than tumbling
    if (kind.cls === 'fly-bird') {
      el.style.setProperty('--rot', rand(-14, 14).toFixed(0) + 'deg');
      el.style.setProperty('--d', rand(2.2, 3.4).toFixed(2) + 's');
    }

    frag.appendChild(el);
  }

  stage.appendChild(frag);

  window.setTimeout(function () {
    stage.innerHTML = '';
    running = false;
  }, 6800);
}

// Fire when the hero/why boundary scrolls into view. Kept observed rather
// than unobserved, so it plays again on every pass.
var io = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) release();
  });
}, { rootMargin: '0px 0px -12% 0px', threshold: 0 });

io.observe(trigger);

})();
