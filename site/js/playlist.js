/* ============================================================
   PLAYLIST + NAVBAR FAVOURITES

   ── ADDING YOUR VIDEOS ──────────────────────────────────────
   Paste the YouTube link into the `url` field below. Both forms
   work:  https://youtu.be/XXXXXXXXXXX
          https://www.youtube.com/watch?v=XXXXXXXXXXX
   Leave url as "" and the player shows a "coming soon" card,
   so the section stays presentable until the links exist.
   Order the list newest first.
   ============================================================ */

var TRACKS = [
  { year: 2026, title: 'Raag Yaman — Alap & Gat',        category: 'Hindustani Classical', language: 'Bansuri',  url: '' },
  { year: 2026, title: 'Vatapi Ganapatim',               category: 'Carnatic Kriti',       language: 'Sanskrit', url: '' },
  { year: 2026, title: 'Krishna Nee Begane Baaro',       category: 'Devotional',           language: 'Kannada',  url: '' },
  { year: 2025, title: 'Raag Bhairavi — Bhajan Ang',     category: 'Hindustani Classical', language: 'Bansuri',  url: '' },
  { year: 2025, title: 'Endaro Mahanubhavulu',           category: 'Carnatic Kriti',       language: 'Telugu',   url: '' },
  { year: 2025, title: 'Bhaje Vasudevam',                category: 'Devotional',           language: 'Sanskrit', url: '' },
  { year: 2024, title: 'Raag Desh — Gat in Teentaal',    category: 'Hindustani Classical', language: 'Bansuri',  url: '' },
  { year: 2024, title: 'Nagumomu Ganaleni',              category: 'Carnatic Kriti',       language: 'Telugu',   url: '' },
  { year: 2024, title: 'Tere Mere Milan Ki Ye Raina',    category: 'Lite Music',           language: 'Hindi',    url: '' },
  { year: 2023, title: 'Raag Kirwani — Alap',            category: 'Hindustani Classical', language: 'Bansuri',  url: '' },
  { year: 2023, title: 'Sri Rama Chandra Kripalu',       category: 'Devotional Bhajan',    language: 'Hindi',    url: '' },
  { year: 2023, title: 'Ye Hariyali Aur Ye Raasta',      category: 'Lite Music',           language: 'Hindi',    url: '' },
  { year: 2022, title: 'Raag Hamsadhwani',               category: 'Hindustani Classical', language: 'Bansuri',  url: '' },
  { year: 2022, title: 'Kurai Onrum Illai',              category: 'Devotional',           language: 'Tamil',    url: '' },
  { year: 2022, title: 'Roop Tera Mastana',              category: 'Lite Music',           language: 'Hindi',    url: '' }
];

(function () {
'use strict';

var STORE = 'flute-navath-favourites';

var listEl   = document.getElementById('tracklist');
var toggle   = document.getElementById('listToggle');
var frameEl  = document.getElementById('playerFrame');
var placeEl  = document.getElementById('playerPlaceholder');
var npTitle  = document.getElementById('npTitle');
var npMeta   = document.getElementById('npMeta');
var favBox   = document.getElementById('fav');
var favList  = document.getElementById('favList');
var favCount = document.getElementById('favCount');
if (!listEl) return;

var active = 0;

/* ---------- favourites persistence ---------- */
function readFavs() {
  try {
    var raw = window.localStorage.getItem(STORE);
    var arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (e) { return []; }          // private mode / blocked storage
}
function writeFavs(arr) {
  try { window.localStorage.setItem(STORE, JSON.stringify(arr)); } catch (e) {}
}
var favs = readFavs();
function isFav(i) { return favs.indexOf(TRACKS[i].title) !== -1; }

/* ---------- youtube ---------- */
function videoId(url) {
  if (!url) return '';
  var m = url.match(/(?:youtu\.be\/|[?&]v=|\/embed\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : '';
}

function metaOf(t) {
  return t.year + ' · ' + t.category + ' · ' + t.language;
}

/* ---------- player ---------- */
function play(i, autoplay) {
  active = i;
  var t = TRACKS[i];
  npTitle.textContent = t.title;
  npMeta.textContent  = metaOf(t);

  var id = videoId(t.url);
  var old = frameEl.querySelector('iframe');
  if (old) old.remove();

  if (!id) {
    if (placeEl) placeEl.hidden = false;
  } else {
    if (placeEl) placeEl.hidden = true;
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube.com/embed/' + id + '?rel=0' + (autoplay ? '&autoplay=1' : '');
    f.title = t.title;
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    f.allowFullscreen = true;
    f.loading = 'lazy';
    frameEl.appendChild(f);
  }

  Array.prototype.forEach.call(listEl.children, function (li, k) {
    li.classList.toggle('is-active', k === i);
  });
}

/* ---------- render ---------- */
function render() {
  listEl.innerHTML = '';
  TRACKS.forEach(function (t, i) {
    var li = document.createElement('li');
    li.className = 'track' + (i === active ? ' is-active' : '');

    var star = document.createElement('button');
    star.type = 'button';
    star.className = 'track-star' + (isFav(i) ? ' is-on' : '');
    star.textContent = '★';
    star.setAttribute('aria-label', (isFav(i) ? 'Remove ' : 'Star ') + t.title);
    star.setAttribute('aria-pressed', String(isFav(i)));
    star.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleFav(i);
    });

    var year = document.createElement('span');
    year.className = 'track-year';
    year.textContent = t.year;

    var body = document.createElement('button');
    body.type = 'button';
    body.className = 'track-body';
    body.innerHTML = '<span class="track-title"></span><span class="track-meta"></span>';
    body.querySelector('.track-title').textContent = t.title;
    body.querySelector('.track-meta').textContent  = t.category + ' · ' + t.language;
    body.addEventListener('click', function () { play(i, true); });

    var tag = document.createElement('span');
    tag.className = 'track-tag';
    tag.textContent = 'Play';

    li.append(star, year, body, tag);
    listEl.appendChild(li);
  });
}

/* ---------- favourites menu in the nav ---------- */
function renderFavs() {
  if (!favList) return;
  favList.innerHTML = '';

  var items = TRACKS.map(function (t, i) { return { t: t, i: i }; })
                    .filter(function (o) { return isFav(o.i); });

  items.forEach(function (o) {
    var li = document.createElement('li');
    var b  = document.createElement('button');
    b.type = 'button';
    b.innerHTML = '<b></b><span></span>';
    b.querySelector('b').textContent    = o.t.title;
    b.querySelector('span').textContent = metaOf(o.t);
    b.addEventListener('click', function () {
      if (favBox) favBox.classList.remove('is-open');
      var section = document.getElementById('playlist');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      play(o.i, true);
    });
    li.appendChild(b);
    favList.appendChild(li);
  });

  if (favCount) favCount.textContent = items.length;
  if (favBox)   favBox.classList.toggle('has-fav', items.length > 0);
}

function toggleFav(i) {
  var title = TRACKS[i].title;
  var at = favs.indexOf(title);
  if (at === -1) favs.push(title); else favs.splice(at, 1);
  writeFavs(favs);

  var li = listEl.children[i];
  if (li) {
    var star = li.querySelector('.track-star');
    star.classList.toggle('is-on', at === -1);
    star.setAttribute('aria-pressed', String(at === -1));
    star.setAttribute('aria-label', (at === -1 ? 'Remove ' : 'Star ') + title);
  }
  renderFavs();
}

/* ---------- collapse ---------- */
if (toggle) {
  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    listEl.classList.toggle('is-collapsed', open);
    toggle.querySelector('span').textContent = open ? 'View the full playlist' : 'Hide the playlist';
  });
}

render();
renderFavs();
play(0, false);          // no autoplay on load — nobody asked for sound yet

})();
