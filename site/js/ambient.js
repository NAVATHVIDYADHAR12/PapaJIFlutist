/* ============================================================
   AMBIENT LAYER
   Gold dust, floating music particles, and the
   gentle parallax that makes the portrait feel like it is
   suspended in air.
   ============================================================ */
(function () {
'use strict';

var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function rand(min, max) { return Math.random() * (max - min) + min; }

/* ---------- gold dust rising from the flute ---------- */
var dust = document.getElementById('dust');
if (dust && !reduced) {
  var frag = document.createDocumentFragment();
  for (var i = 0; i < 34; i++) {
    var m = document.createElement('span');
    m.className = 'mote';
    var s = rand(2, 6);
    m.style.setProperty('--x',  rand(2, 98).toFixed(2) + 'vw');
    m.style.setProperty('--s',  s.toFixed(1) + 'px');
    m.style.setProperty('--d',  rand(13, 26).toFixed(1) + 's');
    m.style.setProperty('--dl', (-rand(0, 26)).toFixed(1) + 's');
    m.style.setProperty('--dx', rand(-70, 70).toFixed(0) + 'px');
    m.style.setProperty('--o',  rand(.35, .9).toFixed(2));
    frag.appendChild(m);
  }
  dust.appendChild(frag);
}

/* ---------- music particles drifting upward ---------- */
var notes = document.getElementById('notes');
if (notes && !reduced) {
  var glyphs = ['♪', '♫', '♬', '\u{1D11E}', '♪', '♫'];
  var colors = ['rgba(8,126,158,.5)', 'rgba(212,175,99,.62)', 'rgba(22,139,114,.48)', 'rgba(25,183,197,.52)'];
  var nfrag = document.createDocumentFragment();
  for (var n = 0; n < 14; n++) {
    var el = document.createElement('span');
    el.className = 'note';
    el.textContent = glyphs[n % glyphs.length];
    // Keep the glyphs in the outer margins. Drifting them through the middle
    // puts them straight over the headline and the film button.
    var band = n % 2 ? rand(84, 98) : rand(2, 16);
    el.style.setProperty('--x',  band.toFixed(2) + 'vw');
    el.style.setProperty('--s',  rand(13, 27).toFixed(0) + 'px');
    el.style.setProperty('--d',  rand(17, 32).toFixed(1) + 's');
    el.style.setProperty('--dl', (-rand(0, 32)).toFixed(1) + 's');
    el.style.setProperty('--dx', (band > 50 ? rand(10, 80) : rand(-80, -10)).toFixed(0) + 'px');
    el.style.setProperty('--o',  rand(.3, .72).toFixed(2));
    el.style.setProperty('--c',  colors[n % colors.length]);
    nfrag.appendChild(el);
  }
  notes.appendChild(nfrag);
}

/* ---------- portrait parallax: the sky reacts to the cursor ---------- */
var stage = document.querySelector('.herostage');
var tilt  = document.getElementById('orbTilt');
var sky   = document.querySelector('.sky');
if (stage && tilt && !reduced && window.matchMedia('(pointer: fine)').matches) {
  var px = 0, py = 0, pQueued = false;

  stage.addEventListener('pointermove', function (e) {
    // getBoundingClientRect is already viewport-relative — never add scroll to it
    var r = stage.getBoundingClientRect();
    px = (e.clientX - r.left) / r.width  - 0.5;
    py = (e.clientY - r.top)  / r.height - 0.5;
    if (!pQueued) {
      pQueued = true;
      requestAnimationFrame(function () {
        pQueued = false;
        tilt.style.transform = 'translate3d(' + (px * -22).toFixed(1) + 'px,' +
                                                (py * -18).toFixed(1) + 'px,0) ' +
                               'rotateY(' + (px * 7).toFixed(2) + 'deg) ' +
                               'rotateX(' + (py * -5).toFixed(2) + 'deg)';
        if (sky) sky.style.transform = 'translate3d(' + (px * 14).toFixed(1) + 'px,' +
                                                        (py * 10).toFixed(1) + 'px,0)';
      });
    }
  }, { passive: true });

  stage.addEventListener('pointerleave', function () {
    tilt.style.transform = '';
    if (sky) sky.style.transform = '';
  }, { passive: true });
}

})();
