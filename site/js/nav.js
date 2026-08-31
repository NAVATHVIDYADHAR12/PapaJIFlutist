/* ============================================================
   FLOATING NAV — hide on scroll down, reveal on scroll up,
   mobile dropdown, active-section highlighting.
   ============================================================ */
(function () {
'use strict';

var nav    = document.getElementById('nav');
var links  = document.getElementById('navLinks');
var burger = document.getElementById('navBurger');
if (!nav) return;

var lastY  = window.scrollY;
var ticking = false;

function onFrame() {
  ticking = false;
  var y = window.scrollY;

  nav.classList.toggle('is-solid', y > 20);

  var goingDown = y > lastY;
  if (goingDown && y > 70 && !nav.classList.contains('has-open-menu')) {
    nav.classList.add('is-hidden');
  } else if (!goingDown || y <= 70) {
    nav.classList.remove('is-hidden');
  }
  lastY = y;
}

window.addEventListener('scroll', function () {
  if (!ticking) { ticking = true; requestAnimationFrame(onFrame); }
}, { passive: true });

/* ---------- mobile menu ---------- */
if (burger && links) {
  burger.addEventListener('click', function () {
    var open = links.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('has-open-menu', open);
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      links.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      nav.classList.remove('has-open-menu');
    }
  });
}

/* ---------- active section ---------- */
var anchors = links ? Array.prototype.slice.call(links.querySelectorAll('a[href^="#"]')) : [];
var targets = anchors
  .map(function (a) { return document.querySelector(a.getAttribute('href')); })
  .filter(Boolean);

if (targets.length && 'IntersectionObserver' in window) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      anchors.forEach(function (a) {
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  targets.forEach(function (t) { io.observe(t); });
}

/* ---------- favourites dropdown open/close ---------- */
var fav     = document.getElementById('fav');
var trigger = document.getElementById('favTrigger');
if (fav && trigger) {
  trigger.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = fav.classList.toggle('is-open');
    trigger.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('has-open-menu', open);
  });
  document.addEventListener('click', function (e) {
    if (!fav.contains(e.target)) {
      fav.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      fav.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });
}

})();
