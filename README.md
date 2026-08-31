# Flute Classes — Navath Vittaleshwar

A premium, animated single-page site built around **Peacock × Sky × Music × Heritage**.

## Run it

```bash
node serve.js          # → http://localhost:8765
```

Any static server works — the site is plain HTML/CSS/JS with no build step.
To deploy, upload the contents of `site/` to any static host.

## What's where

```
site/
  index.html            all markup
  css/base.css          palette tokens, nav, buttons, modal, footer
  css/hero.css          intro film, frame-sequence hero, sky, portrait orb
  css/sections.css      content sections + playlist
  css/scene.css         drifting leaves, corner vine, the fly-past
  css/bot.css           the chatbot
  css/extras.css        the burst button, contact email, footer social
  css/cursor.css        the glass-bubble cursor and its ripples
  js/filmaudio.js       pairs the muted film with its soundtrack
  js/intro.js           the film that plays on load
  js/hero.js            scroll-scrubbed frame sequence
  js/ambient.js         gold dust, music particles, cursor spark, parallax
  js/nav.js             floating nav, mobile menu, active section
  js/playlist.js        playlist data + navbar favourites   ← edit this
  js/reveal.js          heading letter-reveal + repeating scroll reveals
  js/scene.js           monsoon leaves + the hero-to-Why fly-past
  js/chatbot.js         the chat guide's answers                ← edit this
  js/burst.js           the ♫ shower of notes, flowers and leaves
  js/cursor.js          glass-bubble cursor + water ripples (CURSOR-PROMPT.md)
  js/ui.js              video modal, back-to-top
  assets/hero/          f001–f090.jpg, the hero frame sequence (3.8 MB)
  assets/portrait.jpg   the circular portrait
  assets/logo-mark.jpg  the peacock mark (nav, tab, chatbot)
  assets/favicon.png    browser-tab icon
  assets/intro.mp4      the opening film
  assets/intro-audio.wav  the film's soundtrack, played alongside it
```

## Adding your YouTube videos

Open [site/js/playlist.js](site/js/playlist.js). The `TRACKS` array is the first
thing in the file — paste the link into each `url`:

```js
{ year: 2026, title: 'Raag Yaman — Alap & Gat', category: 'Hindustani Classical',
  language: 'Bansuri', url: 'https://youtu.be/XXXXXXXXXXX' },
```

Both `https://youtu.be/ID` and `https://www.youtube.com/watch?v=ID` work — the id
is extracted for you. A track with an empty `url` shows a tasteful
"recording coming soon" card instead of a broken player, so the section stays
presentable while you fill it in. Keep the list newest-first.

Starred tracks are saved to `localStorage` under `flute-navath-favourites` and
appear in the navbar's ★ Favourites menu; clicking one scrolls to the playlist
and plays it.

## Regenerating the hero frames

The sequence is sampled evenly from `timeline_export (3)_frames/` (300 source
frames → 90 at 960×540, quality 62, 3.8 MB total). Even sampling matters: taking
the first 90 would give you the opening three seconds in slow motion.

```python
src_i = round(k * (total - 1) / (want - 1))
```

Keep the folder under ~5 MB. 300 full-size frames would be 32 MB — a download,
not a hero.

## Editing the chatbot

The chat guide is entirely local — no network, no API key, nothing to invent.
Its answers live in the `ANSWERS` array at the top of
[site/js/chatbot.js](site/js/chatbot.js): each entry is a list of `keys` to
match against what the visitor typed, and the `say` reply (HTML allowed).
Longest keyword match wins; anything unmatched gets the `FALLBACK` reply,
which points at the phone number. `CHIPS` sets the suggested questions.

It deliberately declines to state fees or timings and points to the phone
instead — those change, and a wrong number quoted by a website is worse than
no number.

## Notes on behaviour

- **The opening film plays with sound.** The picture is a muted `<video>`
  (muted video always autoplays, so it never fails to start) and the music is
  `assets/intro-audio.wav` on a separate `<audio>`, paired by
  [js/filmaudio.js](site/js/filmaudio.js): one start, one stop, and a
  correction whenever they slip more than 0.22s apart.

  A browser only permits unmuted audio once the page has *user activation*, so:
  a returning visitor (or anyone whose browser has built media engagement for
  the site) hears it immediately on load; on a brand-new profile the music
  joins **at the video's current position** on the first click, tap or key
  press anywhere — nothing to find, and the two stay in step. This is a browser
  rule no website can opt out of. Verified both paths in Chrome.

  Note that `assets/intro.mp4` carries this same soundtrack already. The
  picture is therefore held muted at all times — including against the replay
  modal's native controls — so the music can never play twice. That video's
  volume slider drives the WAV instead, so it still does something useful.
  If you would rather drop the extra 1.9 MB, delete the two `<audio>` tags and
  the `filmaudio.js` include, and let the mp4 play unmuted.

  Skip, Escape and Enter all dismiss the film.
- **Headings type themselves in** letter by letter, and cards arrive one after
  another. Both replay every time you scroll back to them.
- **A fly-past** of spring leaves, blossom, a peacock plume and white birds
  sweeps from the top-right to the bottom-left as the hero hands over to
  "Why Learn".
- **The chat guide** pipes up once — a shiver and two music notes — a moment
  after you close it.
- **Musical symbols and pink monsoon leaves** drift across the whole page on
  the same wind, right to left, behind the content.
- **The ♫ button** beside the portrait rains musical symbols, peacock plumes and
  white/pink/yellow/blue flowers with green/yellow/orange leaves from the top.
  Every press starts another fall and they stack, so repeat presses build up.
- **The cursor** is a glass bubble that lags and stretches along its direction of
  travel, leaving expanding water ripples behind it — built to
  [CURSOR-PROMPT.md](CURSOR-PROMPT.md). Over anything you point at (a button, a
  link, an image, a bordered card) the ordinary arrow returns; over prose it
  keeps the bubble. Nothing is injected at all on touch devices.
- **Headings, sub-text, boxes and buttons each enter differently** — the heading
  types itself in, sub-text lifts, boxes rise and tip flat one after another,
  buttons swing in. All replay on every pass.
- **Refreshing partway down the page skips the film** and keeps your scroll
  position — the film is an entrance, not a gate.
- **▶ Play** (top of the hero copy) reopens it any time in a modal over
  a gaussian-blurred backdrop.
- **`prefers-reduced-motion`** shortens the hero, stops every ambient animation
  and dismisses the film immediately.
