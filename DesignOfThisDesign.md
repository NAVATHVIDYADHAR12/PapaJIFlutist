# DesignOfThisDesign.md

A complete design, copy and motion specification for the **Flute Classes —
Navath Vittaleshwar** landing page, written so the whole thing can be
recreated in another project from this file alone.

Every value below was read out of the shipped source, not remembered. Where a
number looks arbitrary it is usually load-bearing, and §16 explains which ones
and why.

There is a ready-to-paste recreation prompt at the end ([§18](#18-recreation-prompt)).

---

## 1. The concept

**Peacock × Sky × Music × Heritage.** A light, airy, editorial page for a
bamboo-flute teacher. The feeling to aim for is *Apple × Indian classical art ×
luxury editorial* — not a gaming site, not neon, not "AI slop".

Three rules the whole design obeys:

1. **Luxury is hierarchy, whitespace, typography, materiality and motion
   restraint** — never more gradients, more glow, more animation.
2. **The hero carries 60–70% of the visual weight.** Everything after it
   deliberately calms down. If every section shouts, none of them feels
   premium.
3. **Peacock imagery is a design language, not a sticker.** No giant feather
   PNGs. Feather-eye motifs appear at 10–25% opacity, as card corners, as a
   footer silhouette, as the pattern in the body texture.

### The colour ratio

This ratio is what keeps it expensive-looking. Hold to it.

| Share | Role | Colour |
|---|---|---|
| 60% | Pearl / ivory grounds | `#F7F4EC` `#FCFBF7` |
| 20% | Sky blue | `#78CFEA` `#DDF4F8` |
| 10% | Peacock teal | `#087E9E` `#075A68` |
| 7% | Gold | `#D4AF63` `#B88932` |
| 3% | Iridescent accents | `#19B7C5` `#168B72` |

---

## 2. Stack and file map

No framework, no build step, no dependencies. Plain HTML, CSS and JS served
statically. GSAP is **not** used — every animation is CSS or a small
`requestAnimationFrame` loop.

```
index.html                one page, all markup

css/base.css      364 ln  tokens, reset, type, buttons, nav, modal, footer
css/hero.css      652 ln  intro film, frame hero, sky, portrait orb
css/sections.css  338 ln  content sections, reveal vocabulary, playlist
css/scene.css     344 ln  drifting leaves, corner vine, fly-past, shower
css/bot.css       322 ln  chatbot panel and its voice controls
css/extras.css    128 ln  burst button, contact email, footer social
css/cursor.css    155 ln  glass-bubble cursor and its ripples

js/filmaudio.js   147 ln  pairs the muted film with its soundtrack
js/intro.js       123 ln  the film that plays on load
js/hero.js        116 ln  scroll-scrubbed frame sequence
js/ambient.js      90 ln  gold dust, music particles, portrait parallax
js/nav.js          93 ln  floating nav, mobile menu, active section
js/playlist.js    201 ln  playlist data + navbar favourites
js/reveal.js      121 ln  heading letter-reveal, repeating scroll reveals
js/scene.js       153 ln  monsoon leaves + the hero-to-Why fly-past
js/chatbot.js     344 ln  the chat guide, its answers, and voice
js/burst.js       131 ln  the shower of notes, flowers and leaves
js/ui.js           68 ln  video modal, back-to-top
js/cursor.js      217 ln  glass-bubble cursor + water ripples
```

**Script order matters.** `filmaudio.js` must load before `intro.js` and
`ui.js`; `cursor.js` must be last. Everything sits at the end of `<body>`,
none of it deferred.

### Assets

| File | Notes |
|---|---|
| `assets/hero/f001–f090.jpg` | 960×540, JPEG q62, **3.8 MB total** |
| `assets/intro.mp4` | 10.0s film, 4.8 MB, H.264 + AAC |
| `assets/intro-audio.wav` | 10.01s, 48 kHz stereo — the film's soundtrack |
| `assets/portrait.jpg` | square-ish portrait for the orb and teacher section |
| `assets/logo-mark.jpg` | 192×192 peacock + flute badge, 12.7 KB |
| `assets/favicon.png` | 64×64 crop of the same mark |

---

## 3. Design tokens — copy verbatim

```css
:root{
  --pearl:      #F7F4EC;   /* primary ground */
  --cloud:      #FCFBF7;   /* atmosphere */
  --sky:        #78CFEA;
  --sky-mist:   #DDF4F8;
  --peacock:    #087E9E;
  --peacock-dp: #075A68;
  --peacock-ink:#043D49;
  --emerald:    #168B72;
  --gold:       #D4AF63;
  --gold-dp:    #B88932;
  --turq:       #19B7C5;
  --ink:        #17262A;
  --muted:      #55707A;

  --line:       rgba(8,126,158,.16);
  --line-gold:  rgba(212,175,99,.38);
  --glass:      rgba(255,255,255,.62);
  --glass-hi:   rgba(255,255,255,.86);
  --shadow:     0 22px 60px rgba(7,90,104,.13);
  --shadow-sm:  0 12px 30px rgba(7,90,104,.10);
  --radius:     8px;                      /* ONE radius for the whole site */

  --f-display: "Cormorant Garamond", Georgia, serif;
  --f-body:    "Manrope", "Segoe UI", Arial, sans-serif;
  --f-script:  "Italianno", cursive;

  --ease:      cubic-bezier(.22,1,.36,1);  /* the house easing */
  --nav-h:     68px;
}
```

`body` is `16px / 1.65`, `letter-spacing:0`, `color:var(--ink)`,
`background:var(--pearl)`, `overflow-x:hidden`.
`body.is-locked{ overflow:hidden }` is used by the film and both modals.

---

## 4. Typography

Three layers, and only three.

| Layer | Face | Used for |
|---|---|---|
| Display | Cormorant Garamond 300–700 | `h1 h2 h3`, blockquotes, stat numbers, the orb name |
| Interface | Manrope 300–800 | all body copy, buttons, nav, cards, the chat |
| Accent | Italianno | *only* the hero signature line and the footer name |

```css
h1,h2,h3{ font-family:var(--f-display); font-weight:500; line-height:1.08;
          margin:0; letter-spacing:0; }
h2{ font-size:clamp(2rem,4.4vw,3.4rem); color:var(--peacock-dp); }
h2 em{ font-style:italic; color:var(--gold-dp); }   /* the second half of every heading */
h3{ font-size:1.32rem; color:var(--peacock-dp); font-weight:600; }

.eyebrow{ font-size:.72rem; font-weight:700; letter-spacing:.22em;
          text-transform:uppercase; color:var(--peacock); margin:0 0 .7rem; }
.lede{ font-size:1.06rem; color:var(--muted); max-width:56ch; }
.script-line{ font-family:var(--f-script); font-size:2.1rem;
              color:var(--gold-dp); line-height:1; }
```

**Never use negative letter-spacing.** Every heading is built as
`Plain words <em>italic gold words</em>` — that two-tone split is the single
strongest typographic signature of the page.

Hero scale:

```css
.h1-small{ font-size:clamp(1.6rem,3.4vw,2.6rem); font-weight:300;
           font-style:italic; color:var(--peacock); }     /* "Learn the Art" */
.h1-big  { font-size:clamp(2.6rem,6.6vw,5.2rem); font-weight:600;
           color:var(--peacock-dp); line-height:1; }      /* "of Flute Playing" */
.signature{ font-family:var(--f-script);
            font-size:clamp(1.9rem,3.4vw,2.8rem); color:var(--gold-dp); }
```

Google Fonts, one request:

```
Cormorant+Garamond:ital,wght@0,300..700;1,300;1,400
&family=Manrope:wght@300..800
&family=Italianno
&display=swap
```

---

## 5. Global background and the z-index map

Three fixed layers behind everything:

```css
body::before{                 /* z -2 — colour wash */
  content:""; position:fixed; inset:0; z-index:-2; pointer-events:none;
  background:
    radial-gradient(circle at 12% 14%, rgba(120,207,234,.22), transparent 30%),
    radial-gradient(circle at 86% 12%, rgba(212,175,99,.18), transparent 26%),
    radial-gradient(circle at 60% 88%, rgba(22,139,114,.12), transparent 30%),
    linear-gradient(150deg, var(--cloud), var(--pearl) 52%, #EFF6F2);
}
body::after{                  /* z -1 — feather-eye dot texture at .5 */
  content:""; position:fixed; inset:0; z-index:-1; opacity:.5;
  background-image:
    radial-gradient(circle at 50% 50%, rgba(8,126,158,.045) 0 2px, transparent 3px),
    radial-gradient(circle at 50% 50%, rgba(212,175,99,.05) 0 1px, transparent 2px);
  background-size:74px 74px, 37px 37px;
  background-position:0 0, 18px 18px;
}
.page-field{ position:fixed; inset:0; z-index:-1; overflow:hidden; }
/* three blurred colour orbs drifting on pfFloat 34–47s */
```

### Z-index map — memorise this

```
 -2  body::before colour wash
 -1  body::after dot texture · .page-field glows · .teacher-photo::before
  1  .drift (monsoon leaves + music glyphs) · .vine (corner vine)
  2  main .band content
  3  .sky (hero clouds/feathers/dust) · .intro-sound-cue
  4  .copy-scrim (mutes ambient behind the hero copy)
  5  .heroinner
  6  .filmbtn
 40  .flyby (the hero → Why fly-past)
 50  .nav
 90  .topbtn
110  .bot (chatbot)
120  .rain (the ♫ shower)
130  .vmodal (video modal)
200  .intro (the opening film)
8999 .gcur-wave (cursor ripples)
9000 .gcur (cursor bubble)
9001 .gcur-dot (the precise point)
```

---

## 6. The floating nav

```css
.nav{
  position:fixed; z-index:50; left:50%; top:16px;
  width:min(1180px, calc(100% - 28px));
  transform:translateX(-50%);
  display:flex; align-items:center; gap:1rem;
  height:var(--nav-h); padding:0 .7rem 0 .95rem;
  border:1px solid rgba(255,255,255,.72); border-radius:var(--radius);
  background:rgba(252,251,247,.72);
  backdrop-filter:blur(18px);
  box-shadow:0 10px 30px rgba(7,90,104,.10);
  transition:transform .38s var(--ease), background .3s ease, box-shadow .3s ease;
}
.nav.is-solid { background:rgba(252,251,247,.9); box-shadow:0 16px 40px rgba(7,90,104,.16); }
.nav.is-hidden{ transform:translateX(-50%) translateY(-140%); }
```

- **Brand**: 40px rounded logo image + stacked `Flute Classes` / `NAVATH VITTALESHWAR`.
- **Links**: Why Flute · Course · Teacher · Playlist · Contact. Each has a
  `::after` 1px gold→turquoise underline that `scaleX(0→1)` from the left on hover.
- **★ Favourites** dropdown — glass, `max-height:320px`, scrollable, fed live
  from the playlist's starred tracks. Clicking one scrolls to `#playlist` and plays it.
- **Call Now** gold button → `tel:+919440711441`.
- **Behaviour**: adds `.is-solid` past 20px; hides upward past 70px when
  scrolling down; returns on scroll up or near top; never hides while a
  dropdown or the mobile menu is open.
- **≤900px**: links collapse into a glass dropdown under a hamburger; the
  Call Now button and the "Favourites" label are hidden.
- Active section is tracked with an IntersectionObserver at
  `rootMargin:'-45% 0px -50% 0px'`.

---

## 7. The hero — the centrepiece

### 7.1 The opening film

A full-screen `z-index:200` overlay that plays a 10-second film on load and
then dissolves.

```html
<div class="intro" id="intro">
  <div class="intro-frame">
    <video id="introVideo" playsinline muted preload="auto" src="assets/intro.mp4"></video>
    <audio id="introAudio" preload="auto" src="assets/intro-audio.wav"></audio>
    <div class="intro-veil"></div>
  </div>
  <button class="intro-skip" id="introSkip">Skip <i></i></button>
  <p class="intro-sound-cue" id="introSoundCue" hidden>
    <span class="cue-bars"><i></i><i></i><i></i><i></i></span> Tap anywhere for sound
  </p>
</div>
```

The video **is always muted** and the music is a separate `<audio>` of the
same length, paired by `filmaudio.js`. This is deliberate: a muted video
autoplays unconditionally, so the picture never fails to start, and only the
music has to wait for permission.

`FilmAudio.pair(video, audio, opts)` provides:

- one `start()` and one `stop()`
- a drift correction whenever the two slip more than **0.22 s** apart
  (measured drift in practice: 0.07–0.12 s in the intro, 0.001 s in the modal)
- gesture listeners on `pointerdown pointerup click keydown touchstart touchend`
  — note that `wheel` and `mousemove` do **not** grant user activation and can
  never unlock audio
- a `navigator.userActivation.hasBeenActive` poll as a second net
- **restart on permission**: if sound is granted while the film is still in its
  first 60%, both tracks jump back to 0 so the visitor gets the whole thing
  with its music instead of joining halfway and never realising there was a
  soundtrack
- a `volumechange` guard that re-mutes the picture, because the mp4 carries the
  same audio and would otherwise double

`.intro-sound-cue` is rendered **only when the browser actually refused the
music**, and removes itself the instant it starts.

Dismissal: `Skip`, `Escape`, `Enter`, natural end, or a 6 s stall guard. If
the page loads already scrolled past 200px the film is skipped entirely and
the scroll position is kept — the film is an entrance, not a gate.

### 7.2 The scroll-scrubbed frame sequence

```css
.hero{ position:relative; height:340vh; }
.herostage{ position:sticky; top:0; height:100vh; overflow:hidden;
            display:flex; align-items:stretch; justify-content:center; }
.herostage canvas{ position:absolute; inset:0; width:100%; height:100%;
                   object-fit:cover; opacity:.60; filter:saturate(1.05); }
```

90 stills drawn to a `<canvas>`, the frame index chosen by scroll position:

```
progress = clamp(-heroRect.top / (heroRect.height - innerHeight), 0, 1)
index    = round(progress * (FRAME_COUNT - 1))
```

Non-negotiables:

- canvas dimensions set **once** (960×540) — assigning them reallocates and clears
- scroll handler is `{passive:true}` and coalesced through `requestAnimationFrame`
- skip the draw when the index has not changed
- `nearestLoaded(i)` draws the closest frame that exists, so scrubbing never blanks
- `if (rect.height === 0) return` — a hidden hero must compute nothing, or the
  progress becomes `NaN` and poisons the index
- progressive load, 6 concurrent, first frame drawn before the rest
- one retry per frame, because dismissing the film aborts the video request and
  can reset whatever frames share the connection pool
- frames wait for `intro:done` before loading, so the film gets the bandwidth
  to itself (fallback timeout 26 s, which allows for a restart)

Sample the source **evenly**: `sourceIndex = round(k * (total-1) / (want-1))`.
Taking the first N frames gives you the opening moment in slow motion.

### 7.3 The light-key wash

The frames are a backdrop, so two overlays keep the ink readable:

```css
.hero-wash{                     /* z 1 */
  position:absolute; inset:0; pointer-events:none;
  background:
    radial-gradient(120% 92% at 50% 42%, rgba(252,251,247,.34) 0%,
                    rgba(247,244,236,.68) 55%, rgba(247,244,236,.92) 100%),
    linear-gradient(180deg, rgba(252,251,247,.92) 0%, rgba(247,244,236,.34) 20%,
                    rgba(247,244,236,.4) 66%, var(--pearl) 100%);
}
.copy-scrim{                    /* z 4 — ABOVE .sky, below .heroinner */
  position:absolute; inset:0; pointer-events:none;
  background:linear-gradient(90deg,
    rgba(247,244,236,.86) 0%, rgba(247,244,236,.7) 34%,
    rgba(247,244,236,.2) 52%, transparent 64%);
}
```

`.copy-scrim` exists because `.sky` sits at z 3, *above* `.hero-wash`, so the
wash cannot calm the particles drifting over the headline. On ≤980px the
stacked layout needs it to fade downward instead of leftward.

### 7.4 The ambient sky (`.sky`, z 3)

All pure CSS. Every element uses a **negative `animation-delay`** so the page
never looks like it began at load.

- **5 clouds** — four stacked radial-gradient puffs plus a body gradient and
  inset shadows, crossing L→R on `cloudDrift` 33–62s with `translate3d(…, var(--cloud-depth))`
  for parallax (+90px to −150px).
- **5 peacock plumes** — `border-radius:64% 36% 50% 50% / 34% 34% 78% 78%`,
  barbs from two `repeating-linear-gradient`s at 97° and 83°, a gold quill
  `::after`, and an eye `i` built from
  `radial-gradient(ellipse at 50% 46%, #1B3A86, #0E6FA8, #12A2A8, #1F9A56, #7FBF5A, #D9B33F)`.
  `featherBlow` 14–21s. **Keep them in the outer thirds** — 3–9% from the left
  edge, 8–33% from the right — never over the copy.
- **34 gold motes** rising on `moteRise` 13–26s.
- **14 music glyphs** rising on `noteRise` 17–32s, spawned only in the bands
  `2–16vw` and `84–98vw` so they never cross the headline.

### 7.5 The portrait orb

```
.hero-portrait (figure)
  └ .orb-tilt          ← parallax target; carries NO animation of its own
      └ .orb           ← orbBreathe 9s
          ├ svg.orb-wave      two dashed musical waves, counter-rotating
          ├ .orb-halo         haloPulse 7s
          ├ .orb-photo > img + .orb-shine
          ├ .orb-sym ×4       ♪ ♫ 𝄞 ♬ orbiting
          └ .orb-feather ×3   plumes orbiting
  └ figcaption.orb-caption    name + role + the ♫ burst button
```

- `width:clamp(260px,32vw,420px)`, `aspect-ratio:1`.
- Gold rim, inset white ring, deep teal shadow. On hover the rim brightens to
  a 2px gold ring with a 46px gold glow, the photo scales to 1.07 and
  saturates, and `.orb-shine` sweeps a 115° highlight across in 1.1s.
- **Orbiting is done with a full-size spinning wrapper**, with the glyph or
  plume pinned to its top edge by `top:var(--t)`. The obvious approach —
  `transform: rotate() translate(60%) rotate()` — fails, because a percentage
  in `translate` resolves against the *glyph's own* width, which pins
  everything to the centre of the portrait. Symbols counter-rotate on
  `orbitCounter` so they stay upright; plumes do not, so they tumble.
- `.orb-tilt` exists solely because a CSS animation overrides an inline
  `transform`; the parallax target must therefore be a separate element with
  no animation.
- Parallax: ±22px translate and ±7° rotateY from pointer position over the
  stage, plus ±14px on `.sky`. `getBoundingClientRect` is already
  viewport-relative — never add scroll to it.

### 7.6 Hero copy — exact text

```
[Play ▶]  HINDUSTANI · CARNATIC · LITE MUSIC

Learn the Art
of Flute Playing

Where breath becomes melody          ← Italianno, gold

Personal, patient guidance for adults & kids — no prior music experience
needed. Master breath control, finger technique and tone from the very
first note.

[ Come Join Us ]  [ Explore the Course ]

📍 Classes at Tarnaka & Kachiguda · Hyderabad, Telangana

3            2                        All
TRADITIONS   BRANCHES IN HYDERABAD    AGES & LEVELS
TAUGHT

SCROLL TO BEGIN ▏
```

The **Play** button sits *in the copy flow*, sharing the eyebrow's row —
absolutely positioning it caused overlap at some viewport sizes, and being in
the flow makes that impossible.

Entrance: each leaf element gets `heroIn` (18px rise + fade, 0.9s) with
delays 0.10 → 0.58s. **Only leaf elements** carry an entrance — nesting
staggered children inside a fading parent multiplies the opacities and the
stagger does nothing.

### 7.7 Hero responsive

The stage is a fixed `100vh`, so the column must *fit inside it*. This is the
single fiddliest part of the build.

```css
.heroinner{
  padding-top:calc(var(--nav-h) + 46px);
  padding-bottom:30px;
  align-content:center;
  align-content:safe center;   /* never overflows past the TOP edge */
}
```

`safe center` is what stops the copy sliding up under the nav on a short
window. Then four tiers scale the column down:

| Breakpoint | What gives way |
|---|---|
| `≥981px` + `max-height:800px` | type down ~15%, orb to 300px, tighter margins |
| `≥981px` + `max-height:680px` | stats row hidden, orb to 250px |
| `641–980px` | stacked, portrait first; orb ≤278px; hero 300vh |
| `≤640px` | full mobile scale; hero 260vh |
| `≤640px` + `max-height:700px` | stats hidden, orb ≤140px, Play button shrunk |

Verified to fit with nothing clipped and no horizontal overflow at
1440×900, 1536×730, 1366×660, 768×1024, 390×844 and 360×640.

---

## 8. The content sections

All are `<section class="band …">`, `padding:clamp(64px,9vw,110px) 0`,
`scroll-margin-top:96px`. `.wrap` is `min(1180px, calc(100% - 32px))`.

Three environmental grounds create a journey rather than one flat page:

```css
.band-sky { background:linear-gradient(180deg, transparent,
              rgba(221,244,248,.72) 22%, rgba(221,244,248,.72) 78%, transparent); }
.band-teal{ background:linear-gradient(180deg, transparent,
              rgba(226,242,238,.86) 18%, rgba(214,238,236,.9) 82%, transparent); }
.band-deep{ color:#EAF7F5;
            background:linear-gradient(160deg,var(--peacock-dp) 0%,
                       var(--peacock-ink) 62%, #06272F 100%); }
```

### #why — `.band-sky`

> **WHY LEARN**
> More than music — *a discipline for life*

Four glass cards, `repeat(auto-fit,minmax(240px,1fr))`, gap 16px,
`background:rgba(255,255,255,.8)`, blur 16px, with a peacock-eye
`::before` in the top-right corner at 0.26 opacity (0.44 on hover).
Hover lifts 6px.

```
01  Learn the Art of Flute Playing
    Master breath control, finger technique and tone from the very first note.
02  Improve Concentration & Creativity
    Music sharpens focus and unlocks a calmer, more creative mind.
03  Build Confidence Through Music
    Steady progress and small performances build lasting self-belief.
04  Personal Attention for Every Student
    One-on-one guidance tailored to your pace, goals and taste.
```

### #styles

> **STYLES WE TEACH**
> Three traditions, *one flute*

Three cards. The number is `3.2rem` Cormorant with
`-webkit-text-stroke:1px rgba(212,175,99,.6)` and transparent fill. A 150px
peacock-eye disc sits at `z-index:-1` in the bottom-right, 0.18 → 0.22 on hover.

```
01  Hindustani   North Indian classical ragas, alap and gayaki-ang phrasing.
02  Carnatic     South Indian fundamentals, gamakas, varnams and kritis.
03  Lite Music   Film songs, devotional & light melodies you'll love to play.
```

### #course — `.band-teal`

> **COURSE HIGHLIGHTS**
> A structured yet *flexible* curriculum
> Designed to take you from your first breath to confident performance — at
> whatever pace suits your life.

Left: a `.ticks` list where each bullet is an 11px peacock-eye radial
gradient with a `0 0 0 3px rgba(212,175,99,.16)` ring.

```
Basic to Advanced Training · Hindustani Classical Techniques
Carnatic Music Fundamentals · Lite Music & Film Songs
Flexible Learning for All Ages · Individual Guidance
[ Book a trial class ]
```

Right: three glass blockquotes with a 3.4rem gold `"` at 0.6 opacity, each
sliding 5px right on hover.

```
Music is the language of the soul, and the flute gives it wings.
Every great musician was once a beginner. Start your musical journey today.
Let the melody of the flute bring peace, joy and inspiration to your life.
```

### #teacher

Portrait left (square, `object-position:50% 20%`, a blurred sky→gold glow
offset behind it at `inset:18px -12px -12px 18px`), copy right.

> **YOUR TEACHER**
> Navath *Vittaleshwar*
>
> A dedicated flautist devoted to sharing the timeless beauty of the Indian
> bamboo flute. Whether you are a curious child or an adult rediscovering a
> dream, you'll learn at your own pace with warmth, patience and genuine care
> for your growth as a musician.
>
> · Teaches Hindustani, Carnatic & Lite Music
> · Patient, beginner-friendly approach
> · Individual attention for every student
>
> *A lifelong journey through melody*   ← Italianno

### #playlist — `.band-sky`

> **LISTEN**
> The flute *playlist*
> Play recordings inside the site and star the ones you love — your
> favourites live in the navigation bar.

Glass shell, `grid-template-columns:minmax(0,1.12fr) minmax(0,.88fr)`,
blur 22px, with gold and emerald radial glows in opposite corners.

- **Player panel** — "Now playing" eyebrow, title, `year · category · language`,
  then a 16:9 frame. With no link yet it shows a "Recording coming soon" card
  on a dark teal ground with a breathing `𝄞`; with a link it swaps in
  `https://www.youtube.com/embed/{id}?rel=0[&autoplay=1]`.
- **List panel** — a "View the full playlist" toggle over a 520px scroller.
  Each row: star · year · title/meta · "Play" tag. The active row takes a
  gold-tinted gradient, gold border and stronger shadow.
- Favourites persist in `localStorage` under **`flute-navath-favourites`**,
  keyed by title, and the navbar menu updates immediately.
- IDs are extracted from either `youtu.be/ID` or `watch?v=ID`.
- Data lives in a `TRACKS` array at the top of the file, newest first.

### #contact — `.band-deep`

> **START TODAY**
> Every great musician *was once a beginner*
>
> Reach out to book a trial class or ask anything about lessons. We'd love to
> help you begin your journey with the flute.
>
> [ Call 94407 11441 ]   [ ✉ vittaleshwarnavathflutist@gmail.com ]

Right: **OUR BRANCHES** — Tarnaka / Hyderabad · Kachiguda / Hyderabad ·
Cell / 94407 11441 · Email / vittaleshwarnavathflutist@gmail.com.
Each row slides 4px right on hover.

### Footer

A dark panel, `min(1180px, calc(100% - 28px))`, with a single translucent
peacock plume swaying overhead on `footFeather` 12s.

> *"Where Breath Becomes Melody and Passion Becomes Music."*
> **Navath Vittaleshwar**   ← Italianno, gold, 2.6rem
>
> [ Instagram @flute.999999 ]  [ Email vittaleshwarnavathflutist@gmail.com ]
>
> © 2026 Flute Classes · Navath Vittaleshwar

The Instagram icon is a pure-CSS glyph:
`radial-gradient(circle at 30% 107%, #FDCB5C, #E95950 45%, #D62976 60%, #962FBF 80%, #4F5BD5)`
with a white ring and dot.

---

## 9. The reveal system

Four entrance moves, so a section arrives as a *sequence* rather than one
uniform slide. **All of them replay every time the element returns to view** —
the observer toggles rather than unobserving.

| Class | Move | Timing |
|---|---|---|
| `.t-char` | heading types in, letter by letter | 0.5s, `--ci × 26ms` |
| `.rv-text` | sub-text lifts 16px | 0.65s, `180ms + --i × 90ms` |
| `.rv-box` | boxes rise 38px, scale .94→1, tip back from 12° | 0.72s, `--i × 150ms` |
| `.rv-btn` | buttons swing in from −26px with overshoot | 0.6s `cubic-bezier(.34,1.56,.64,1)` |
| `.rv-media` | image unmasks upward, `clip-path:inset(16% 0 0 0)` | 0.9s |

`reveal.js` does three things:

1. **Splits every `h2`** into `.t-word` (nowrap) → `.t-char` spans, walking the
   tree so inline `<em>` survives and only text nodes are broken up.
2. **Tags the rest automatically** — `.eyebrow .lede .script-line` and
   `.ticks li` become `rv-text`, `blockquote` and `.branch` become `rv-box`,
   `.btn` and `.list-toggle` become `rv-btn`. Doing this in JS rather than by
   hand keeps every section consistent.
3. **Assigns `--i`** as each element's index among its same-variant siblings,
   which is what makes a row of cards land one after another.

Observer: `rootMargin:'0px 0px -8% 0px'`, `threshold:0.1`.

> **`.rv-media` must not use `scale`.** Scaling the teacher figure widened it
> past the viewport on a phone once its offset glow was included, putting 4px
> of horizontal overflow on the page. Use `translateY` instead.

---

## 10. The scene systems

### Drifting background (`.drift`, z 1, fixed)

- **16 monsoon leaves** — teardrops `border-radius:100% 0 100% 0` in pink
  `rgba(242,168,196,.85)`, deeper pink, rain-washed green and faded gold,
  crossing right→left on `driftAcross` 26–52s with 120–460° of spin.
- **13 music glyphs** (♪ ♫ ♬ 𝄞 ♩) in peacock, gold, emerald and turquoise,
  crossing on `noteWind` 30–62s — a path that bobs ±2–7vh and tips ±14° as it
  goes, so they read as carried by air rather than sliding on a rail.

### The corner vine (`.vine`, z 1, fixed top-right)

A dark green trailing stem with 8 fluttering leaves
(`linear-gradient(135deg,#0E3B2A,#237A55 60%,#2E9468)`) and 2 perched birds
that bob and flick a gold wing every few seconds. The whole vine sways ±1.6°
on `vineSway` 9s, and is `overflow:hidden` so that rotation can never widen
the page.

### The fly-past (`.flyby`, z 40)

As the hero hands over to *Why Learn*, 26 elements sweep from the top-right to
the bottom-left over 2.6–4.6s: orange and yellow spring leaves, pink and white
five-petal blossom, a peacock plume, and white birds whose wings beat on a
460ms loop. Triggered by an IntersectionObserver on a marker between the two
sections.

> The marker **must have real area** — `display:block; height:2px`.
> IntersectionObserver never reports an intersection for a zero-height inline
> span, and the effect silently never fires.

### The ♫ shower (`.rain`, z 120)

A gold button beside the portrait caption. Each press drops **90** elements
from the top over 3.4–6.8s with ±140px drift and ±720° spin. Presses
**stack** — each batch clears itself after 8.6s, so an earlier fall is never
cut short. Seven kinds, weighted 7 : 6 : 3 : 3 : 5 : 3 : 4:

| Kind | Build | Size |
|---|---|---|
| note | ♪ ♫ ♬ 𝄞 ♩ ♭ in 7 colours | 18–38px |
| flower | five petals at 72°, Design1 palette | 22–34px |
| sunflower | 12 gold petals + seeded brown eye | 24–36px |
| rose | 6 scalloped petals over a tightening spiral | 22–32px |
| leaf | green / yellow / orange teardrops | 16–30px |
| feather | peacock plume | 26–46px |
| spark | gold dust | 4–9px |

> **Petals are `box-shadow` copies and the offsets must be `em`.**
> Percentages are invalid in `box-shadow` offsets, so the whole declaration is
> dropped and every flower falls as a plain circle. Pin `font-size:var(--s)`
> so `1em` is the drop's own size and the geometry scales.

```css
.drop-flower{
  font-size:var(--s); border-radius:50%; background:transparent;
  box-shadow:
    +0.000em -0.460em 0 -0.17em var(--c),
    +0.437em -0.142em 0 -0.17em var(--c),
    +0.270em +0.372em 0 -0.17em var(--c),
    -0.270em +0.372em 0 -0.17em var(--c),
    -0.437em -0.142em 0 -0.17em var(--c);
}
```

---

## 11. The cursor

A glass bubble that follows the pointer, leaving expanding water ripples.

- **26px bubble**, lagging at `EASE 0.19`, **stretching along its direction of
  travel** (`scale(1+s, 1−0.62s)`, `s = min(speed/130, 0.34)`) — the stretch is
  what makes it read as liquid rather than as a circle that lags.
- A **3px dot at the exact pointer position with zero lag**, so precision is
  never lost.
- Border-radius wobbles on `gcur-breathe` 5.2s; a specular glint drifts on
  `gcur-glint` on the same loop. Brightens over clickables — **it does not
  grow**. Pinches to 0.8 while pressed.
- **Ripples**: a ring every 24px of travel, expanding to ~165px over a second,
  two circles per ring (gold at full radius, pale white at 82%) drawn in
  `lighter` blend so crests glow where they overlap. Max 64 rings. A click
  drops two larger ones. The loop stops entirely once everything settles.

> **The one rule everything depends on:** `cursor` is an inherited property.
> Hide the real cursor with a single declaration on the root —
> `.gcur-on{ cursor:none }` — never `.gcur-on *{ cursor:none }`, which forces
> `none` onto the spans inside buttons and logos and leaves them with no arrow.
> Then give the arrow back on the *container* (`a, button, img, .card, .nav`,
> …) and children inherit it for free. `cursor.js` reads the computed value on
> `pointerover` and withdraws the bubble wherever a real cursor survives, so
> the two are never on screen together — one source of truth, in the CSS.

Nothing is injected at all on touch, on pointers that cannot hover, or under
`prefers-reduced-motion`.

---

## 12. The chatbot

A glass panel launched from a peacock-mark button, bottom-right.

- **Local and rule-based.** No network, no key. Answers live in an `ANSWERS`
  array of `{keys:[…], say:'…'}`; the longest keyword match wins; anything
  unmatched gets a `FALLBACK` that points at the phone number.
- Covers: greetings, styles taught, beginners, ages, branches, contact, trial
  classes, the teacher, fees, timings, which flute, online lessons, the
  playlist, thanks.
- **It deliberately refuses to quote fees or timings** and points to the phone
  instead — those change, and a stale price on a website is worse than none.
- Four suggestion chips, a typing indicator (three dots on `botDot` 1.1s), and
  messages that rise 8px on arrival.
- `max-height:calc(100vh - 112px)` with the header pinned `flex:0 0 auto` and
  the log taking the flex — **without the cap the panel grows past the top of
  a short window and takes the × with it, making it impossible to close.**
- Closing it makes the launcher **pipe up once** a moment later: a shiver plus
  two music notes lifting off, three times, then silence.
- The back-to-top button hides while the panel is open, since it sits inside
  the panel's footprint.

### Voice

Both sit on the browser's Web Speech API and are **feature-detected** — with
neither available, the toolbar and the mic never render.

- **Read aloud** — `speechSynthesis` speaks each reply as it arrives, at
  `rate 0.98`. Turning it on mid-conversation reads the reply already on
  screen. Replies carry markup, so the text is stripped through a detached
  `div.textContent` before speaking.
  While speaking, **pause/resume** and **stop** appear beside it, and the
  button pulses on `botTalk`.
- **Voice to text** — `SpeechRecognition` dictates into the field with
  `interimResults`. It appends to whatever was already typed, stops any
  reading first so the recogniser does not hear the page, and turns red and
  pulses while listening. If the microphone is refused, the bot says so *in
  the conversation* rather than failing silently.
- Closing the panel silences speech and stops listening.

---

## 13. Overlays

| Element | Trigger | Notes |
|---|---|---|
| `.intro` | page load | z 200, locks body scroll, skipped if already scrolled |
| `.vmodal` | ▶ Play in the hero | z 130, scrim `rgba(7,90,104,.42)` + `blur(22px) saturate(120%)`, gold circular × that rotates 90° on hover, video `aspect-ratio:16/9` so the shell does not pop as metadata loads |
| `.topbtn` | `scrollY > 620` | z 90, right 18px / bottom 92px |
| `.bot` | always | z 110 |

---

## 14. Full animation catalog

47 keyframes. Durations are chosen so nothing ever syncs up.

**Ambient, always running**
`pfFloat` 34–47s · `cloudDrift` 33–62s · `featherBlow` 14–21s ·
`moteRise` 13–26s · `noteRise` 17–32s · `driftAcross` 26–52s ·
`noteWind` 30–62s · `vineSway` 9s · `leafFlutter` 4.4–6.4s ·
`perchBob` 3.4–4.1s · `perchWing` 4.2s · `footFeather` 12s

**The orb**
`orbBreathe` 9s · `haloPulse` 7s · `waveSpin` 26s · `waveSpinBack` 34s ·
`waveFlow` 5s · `orbitBox` 24–44s · `orbitCounter` (matched) · `orbShine` 1.1s

**Entrances**
`heroIn` 0.9s · `introBreathe` 14s · `introBtnIn` 0.8s · `cueIn` 0.7s ·
`modalIn` 0.46s · `fadeIn` 0.32s · `botPanelIn` 0.42s · `botMsgIn` 0.34s

**Events**
`flyPast` 2.6–4.6s · `flyWing` / `flyWingMirror` 460ms · `dropFall` 3.4–6.8s ·
`burstHit` 0.5s · `micLive` 1.3s · `botTalk` 1.1s · `botShiver` 1.1s ×3 ·
`botNote` 1.7s ×3

**Idle cues**
`filmPulse` 2.6s · `cueDrop` 2s · `cuePulse` 2.6s · `cueBar` 1s ·
`burstSway` 3.4s · `burstHalo` 2.8s · `botRing` 3s · `botDot` 1.1s ·
`gcur-breathe` 5.2s · `gcur-glint` 5.2s

### Easing vocabulary

| Use | Curve |
|---|---|
| Everything, by default | `cubic-bezier(.22,1,.36,1)` |
| Buttons swinging in | `cubic-bezier(.34,1.56,.64,1)` |
| The fly-past | `cubic-bezier(.32,.16,.42,1)` |
| Drifts and falls | `linear` |
| Sways and flutters | `ease-in-out` |

---

## 15. Responsive and accessibility

**Breakpoints**: 980px (hero stacks, nav collapses at 900px), 900px, 768px,
700px height, 680px height, 641px, 640px, 420px.

- Zero horizontal overflow at every size — verified.
- All interactive controls are real `<button>` / `<a>` elements with
  `aria-label`, `aria-pressed` or `aria-expanded` where the state matters.
- The canvas is `aria-hidden`; every decorative layer is `aria-hidden` and
  `pointer-events:none`.
- Modals are `role="dialog"`, lock body scroll, and close on `Escape`.
- **`prefers-reduced-motion`** shortens the hero to 130vh, stops every ambient
  animation, cancels the reveals, hides the drift/fly-past/ripples, injects no
  cursor at all, and dismisses the film immediately.
- Focus is moved into the modal on open and returned to the trigger on close.

---

## 16. The traps

Every one of these cost real time. They are the most valuable part of this file.

1. **Percentages are invalid in `box-shadow` offsets.** The declaration is
   dropped entirely, silently. Every CSS flower rendered as a plain circle
   until this was found. Use `em` with `font-size` pinned to the element size.
2. **A percentage in `translate()` resolves against the element's own box.**
   `rotate() translate(60%) rotate()` pins orbiting glyphs to the centre
   instead of the rim. Spin a full-size wrapper instead.
3. **CSS animations override inline `style.transform`.** A parallax target
   must be an element that carries no animation of its own.
4. **`display:grid` on an element beats the UA stylesheet's
   `[hidden]{display:none}`.** The intro overlay stayed in the layout for the
   life of the page and pushed 4px of horizontal overflow. Add
   `.intro[hidden]{display:none}` explicitly.
5. **IntersectionObserver never fires for a zero-area element.** Give scroll
   markers real height.
6. **`wheel` and `mousemove` do not grant user activation.** They can never
   unlock audio. Only `pointerdown/up`, `click`, `keydown`, `touchstart/end` do.
7. **Unmuting a muted autoplaying video without activation makes Chrome pause
   it.** Check `navigator.userActivation.hasBeenActive` before unmuting.
8. **`inline-flex` is inline-level.** A following inline-flex element flows
   onto the same line — which is how the scroll cue ended up beside the
   location pill. Use `display:flex; width:fit-content`.
9. **`align-content:safe center`** is the difference between a hero that
   compresses gracefully and one that slides up under the nav.
10. **Nested entrance animations multiply opacity.** Only leaf elements should
    animate in.
11. **`cursor` is inherited** — see §11. This is worth re-reading.
12. **Serve `.wav` as `audio/wav`.** Under `application/octet-stream` browsers
    are entitled to refuse to decode it.
13. **Setting `currentTime` before metadata exists can throw**, which will kill
    the gesture handler it sits in. Wrap it.
14. **90 frames at 960×540 q62 is 3.8 MB. 300 frames at full size is 32 MB.**
    That is not a hero, it is a download. Measure the folder.

---

## 17. Asset checklist

- [ ] 90 frames, zero-padded `f001–f090`, evenly sampled, under 5 MB total
- [ ] a 10-second film, H.264 + AAC, under 5 MB
- [ ] its soundtrack as a separate file of exactly the same length
- [ ] a square logo mark ≤ 200px and ≤ 20 KB, plus a 64px favicon
- [ ] a portrait that crops well to a circle at `object-position:50% 22%`
- [ ] the three Google Fonts in one request

---

## 18. Recreation prompt

> Build a single-page site for a bamboo-flute teacher, in plain HTML, CSS and
> JavaScript with no framework and no build step.
>
> **Identity.** "Peacock × Sky × Music × Heritage." Light and editorial. Hold
> the ratio 60% pearl ivory `#F7F4EC`, 20% sky `#78CFEA`, 10% peacock teal
> `#087E9E`/`#075A68`, 7% gold `#D4AF63`/`#B88932`, 3% iridescent
> `#19B7C5`/`#168B72`. Ink `#17262A`, muted `#55707A`. One radius, 8px. One
> easing, `cubic-bezier(.22,1,.36,1)`. Cormorant Garamond for display, Manrope
> for interface, Italianno for two accent lines only. Every heading reads as
> plain words followed by italic gold words.
>
> **The hero carries the page.** On load, a full-screen 10-second film with its
> soundtrack. Then a 340vh section whose sticky 100vh stage draws 90
> pre-extracted stills to a canvas at 0.6 opacity, scrubbed by scroll. Over it:
> drifting CSS clouds, peacock plumes, gold dust and music glyphs, all with
> negative animation delays. Left, the headline; right, a circular portrait in
> a gold rim that shines on hover, with musical symbols and plumes orbiting it
> and a gold ♫ button beside its caption that rains flowers, plumes, leaves and
> notes from the top of the screen, stacking on every press.
>
> **After the hero, calm down.** Why Learn (four glass cards), three
> traditions, a course list, the teacher, a playlist with a YouTube player and
> star favourites saved to localStorage and mirrored in the navbar, and a dark
> teal contact band. Headings type themselves in letter by letter; sub-text
> lifts; boxes rise and tip flat one after another; buttons swing in. All of it
> replays on every pass.
>
> **Throughout.** A floating glass navbar that hides on scroll down. Pink
> monsoon leaves and music glyphs drifting right to left behind everything. A
> swaying vine with perched birds in the top-right corner. A fly-past of
> blossom and white birds as the hero hands over. A glass-bubble cursor that
> stretches along its travel and leaves expanding water ripples. A local
> rule-based chat guide with read-aloud and voice input.
>
> Read §16 of this file before writing any code. It lists fourteen mistakes
> that are individually easy to make and individually hard to find.
