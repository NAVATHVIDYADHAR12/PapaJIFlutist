/* ============================================================
   REVEAL ENGINE

   Three jobs:
     1. split every section heading into characters so it types itself in
     2. tag the supporting text, boxes and buttons with DIFFERENT entrance
        moves, so a section arrives as a sequence rather than one slide
     3. observe everything and replay it each time it returns to view
   ============================================================ */
(function () {
'use strict';

var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------
   1. SPLIT HEADINGS
   Walks the tree so inline markup (<em>) survives; only text nodes
   are broken up, and words stay whole in a nowrap wrapper.
   ------------------------------------------------------------ */
function splitText(root) {
  if (root.dataset.split === 'done') return;
  var counter = { i: 0 };

  function walk(node) {
    Array.prototype.slice.call(node.childNodes).forEach(function (child) {
      if (child.nodeType === 3) {
        var text = child.nodeValue;
        if (!text.trim()) return;
        var frag = document.createDocumentFragment();

        text.split(/(\s+)/).forEach(function (chunk) {
          if (!chunk) return;
          if (/^\s+$/.test(chunk)) { frag.appendChild(document.createTextNode(' ')); return; }
          var word = document.createElement('span');
          word.className = 't-word';
          chunk.split('').forEach(function (ch) {
            var c = document.createElement('span');
            c.className = 't-char';
            c.style.setProperty('--ci', counter.i++);
            c.textContent = ch;
            word.appendChild(c);
          });
          frag.appendChild(word);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1) {
        walk(child);
      }
    });
  }

  walk(root);
  root.dataset.split = 'done';
  root.classList.add('t-split');
}

/* ------------------------------------------------------------
   2. TAG THE REST
   Done here rather than by hand in the markup so every section stays
   consistent and new content picks it up automatically. The hero is
   left alone — it has its own entrance.
   ------------------------------------------------------------ */
var TAGS = [
  ['.eyebrow, .lede, .script-line, .branches-title, .np-meta', 'rv-text'],
  ['.ticks li',                                                 'rv-text'],
  ['.course-copy > p, .teacher-copy > p, .contact-copy > p',    'rv-text'],
  ['blockquote, .branch',                                       'rv-box'],
  ['.btn, .list-toggle',                                        'rv-btn']
];

function tag(scope) {
  TAGS.forEach(function (pair) {
    scope.querySelectorAll(pair[0]).forEach(function (el) {
      // never override a variant already chosen in the markup
      if (el.classList.contains('rv-box') || el.classList.contains('rv-text') ||
          el.classList.contains('rv-btn') || el.classList.contains('rv-media')) return;
      el.classList.add(pair[1]);
    });
  });
}

if (!reduced) {
  document.querySelectorAll('main .band').forEach(function (band) {
    band.querySelectorAll('h2').forEach(splitText);
    tag(band);
  });
  document.querySelectorAll('.site-footer').forEach(tag);
}

/* ------------------------------------------------------------
   3. STAGGER INDEX + OBSERVE
   --i is the element's position among its same-variant siblings, which
   is what makes a row of boxes land one after another.
   ------------------------------------------------------------ */
var VARIANTS = ['.reveal', '.rv-text', '.rv-box', '.rv-btn', '.rv-media'];

VARIANTS.forEach(function (sel) {
  var groups = new Map();
  document.querySelectorAll(sel).forEach(function (el) {
    var parent = el.parentElement;
    var n = groups.get(parent) || 0;
    el.style.setProperty('--i', n);
    groups.set(parent, n + 1);
  });
});

var watched = document.querySelectorAll(VARIANTS.join(', ') + ', .t-split');

if (watched.length && 'IntersectionObserver' in window && !reduced) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      entry.target.classList.toggle('is-in', entry.isIntersecting);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

  watched.forEach(function (el) { io.observe(el); });
} else {
  watched.forEach(function (el) { el.classList.add('is-in'); });
}

})();
