# Design Reference — Simpal Kharel Birthday Landing Page

A complete design + animation spec for this landing page, written so it can be **recreated exactly in another project**.
Everything below is extracted from the live source: [styles.css](styles.css) (~7000 lines), [components/BirthdayExperience.jsx](components/BirthdayExperience.jsx), [app/layout.js](app/layout.js).

There is a ready-to-paste **AI recreation prompt** at the end ([§14](#14-recreation-prompt-copy-paste-into-another-project)).

---

## 1. Stack & file map

| Piece | File | Notes |
|---|---|---|
| Next.js App Router shell | [app/layout.js](app/layout.js) | imports one global `styles.css`, adds `class="js"` on `<html>` |
| Landing page component | [components/BirthdayExperience.jsx](components/BirthdayExperience.jsx) | one big `"use client"` component, all sections + all modals |
| All styling | [styles.css](styles.css) | plain CSS, no Tailwind, no CSS modules |
| Content data | [lib/birthday.js](lib/birthday.js) | `imageSequence`, `journeyItems`, `awardItems`, `calculateBirthdayState()` |
| Chat widget | [components/Chatbot.jsx](components/Chatbot.jsx) | fixed bottom-right |

**Key architectural decision:** no UI framework, no animation library for the ambient layer. Every cloud, leaf, bird, feather, butterfly, petal, cake and gift box is a **pure CSS shape** (`<span>` + gradients + `::before`/`::after` + `@keyframes`). GSAP is used *only* for scroll reveals, and is lazy-imported with an IntersectionObserver fallback.

`html.js` is important: `.reveal` is visible by default, and only hidden when the `js` class is present. Fail-safe for no-JS.

---

## 2. Design tokens (exact values — copy verbatim)

```css
:root {
  /* deep teal / navy family */
  --plum-950: #08243a;
  --plum-850: #0d3b57;
  --plum-700: #0f6b78;
  /* green accent */
  --orchid-500: #1f8c68;
  /* gold / amber accent */
  --rose-500: #d88a18;
  --rose-200: #ffe0a3;
  /* warm browns */
  --mocha-700: #5d3a20;
  --mocha-300: #b78343;
  /* light grounds */
  --cream-100: #f3fbf7;
  --lavender-100: #d7f1e7;

  --ink: #0b2330;
  --muted: #49636a;
  --white: #ffffff;
  --line: rgba(13, 59, 87, 0.16);
  --shadow: 0 22px 60px rgba(8, 36, 58, 0.18);
  --radius: 8px;              /* ONE radius for the entire site */
  --font-display: "Playfair Display", Georgia, serif;
  --font-body: "Plus Jakarta Sans", Arial, sans-serif;
}
```

### Rules that make the look consistent
- **One border-radius everywhere** — `var(--radius)` = `8px`. Exceptions only for circles (`50%`) and pills (`999px`).
- **Glass recipe** (used on nav, panel, hero stats, gift callout, top button):
  `border: 1px solid rgba(255,255,255,0.72)` + `background: rgba(255,255,255,0.68)` (or `rgba(242,251,247,0.78)`) + `backdrop-filter: blur(18px)` + `box-shadow: 0 14px 38px rgba(8,36,58,0.08)`.
- **Shadow scale** — `0 12px 30px / 0 14px 38px / 0 16px 45px / 0 22px 58px` of `rgba(8, 36, 58, α)`, α from `0.08` → `0.28`. Never pure black.
- **Signature gradient** (brand signet, primary button, top button):
  `linear-gradient(135deg, #0d3b57, #0f6b78 62%, #1f8c68)`; hover swaps to `linear-gradient(135deg, #08243a, #0d3b57 54%, #d88a18)`.

### Typography
```
Google Fonts: Playfair Display 600/700/800 + Plus Jakarta Sans 400..800
body: --font-body, line-height 1.6, letter-spacing 0
h1/h2 (hero, section headings, panel title): --font-display, line-height 1.02, margin 0
.eyebrow / .panel-kicker: 0.78rem, weight 800, uppercase, color var(--rose-500)
hero h1: 4.8rem  → 4rem @1060 → 3.1rem @780
section h2: 3.25rem
hero-lede: 1.12rem, weight 800
body copy: color var(--muted)
```

---

## 3. Global background layers (three stacked, behind everything)

```css
body::before {                 /* z-index: -2 — colour wash */
  position: fixed; inset: 0; content: "";
  background:
    radial-gradient(circle at 12% 16%, rgba(86,170,134,0.18), transparent 28%),
    radial-gradient(circle at 84% 18%, rgba(216,138,24,0.18), transparent 24%),
    linear-gradient(120deg, rgba(215,241,231,0.86), rgba(243,251,247,0.94) 46%, rgba(183,131,67,0.16)),
    var(--cream-100);
}

body::after {                  /* z-index: -1 — 36px graph-paper grid at 0.35 opacity */
  position: fixed; inset: 0; content: ""; pointer-events: none; opacity: 0.35;
  background-image:
    linear-gradient(rgba(13,59,87,0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(13,59,87,0.045) 1px, transparent 1px);
  background-size: 36px 36px;
}
```

Plus two **fixed full-viewport motion layers** rendered before `<main>`:

```jsx
<div className="ambient-flower-layer" aria-hidden="true">  {/* 8 spans, .ambient-flower-one … -eight */}
<div className="ambient-leaf-field"   aria-hidden="true">  {/* 8 spans, .leaf-a … .leaf-h */}
```

Each leaf is a `border-radius: 100% 0 100% 0` teardrop with a `::after` centre vein, driven by per-element custom properties:

```css
.leaf-a { --leaf-top: 12%; --leaf-size: 64px; --leaf-speed: 18s; --leaf-delay: -2s;  --leaf-rotate: 18deg; }
.leaf-b { --leaf-top: 24%; --leaf-size: 42px; --leaf-speed: 23s; --leaf-delay: -9s;  --leaf-rotate: -24deg; }
.leaf-c { --leaf-top: 38%; --leaf-size: 72px; --leaf-speed: 21s; --leaf-delay: -14s; --leaf-rotate: 38deg; }
.leaf-d { --leaf-top: 52%; --leaf-size: 50px; --leaf-speed: 26s; --leaf-delay: -4s;  --leaf-rotate: -12deg; }
.leaf-e { --leaf-top: 68%; --leaf-size: 82px; --leaf-speed: 24s; --leaf-delay: -18s; --leaf-rotate: 26deg; }
.leaf-f { --leaf-top: 82%; --leaf-size: 46px; --leaf-speed: 19s; --leaf-delay: -7s;  --leaf-rotate: -32deg; }
.leaf-g { --leaf-top: 6%;  --leaf-size: 36px; --leaf-speed: 28s; --leaf-delay: -20s; --leaf-rotate: 54deg; }
.leaf-h { --leaf-top: 74%; --leaf-size: 58px; --leaf-speed: 22s; --leaf-delay: -12s; --leaf-rotate: 9deg; }
```

**Negative animation-delay is the core trick** used everywhere in this design — every element starts mid-cycle, so the page never looks like it "began" at load.

### Z-index map (memorise this)
```
-2  body::before colour wash
-1  body::after grid
 0  .hero-background / .slide-layer
 1  .slide-overlay · .ambient-leaf-field · .ambient-flower-layer
 2  .hero-photo-meta · main · .site-footer
 3  .sky-motion · .birthday-panel
 4  .slide-dots · .bird-flock
 5  .hero-media · .hero-copy
 6  .tracker-portrait
 8  .surprise-gift-trigger
50  .floating-nav
60  nav dropdown menu
90  .top-up-button
120 .celebration-layer
150 .cursor-glow
```

---

## 4. Nav bar — full spec

### 4.1 Markup

```jsx
<nav className={["floating-nav", isNavOpen && "is-open", isNavHidden && "is-hidden",
                 isNavScrolled && "is-scrolled"].filter(Boolean).join(" ")}
     aria-label="Primary navigation">

  <a className="brand-mark" href="#home" onClick={closeNav}>
    <span className="brand-signet">SK</span>
    <span>Simpal Birthday</span>
  </a>

  <button className="nav-toggle" type="button" aria-label="Toggle navigation menu"
          aria-expanded={isNavOpen} aria-controls="navMenu"
          onClick={() => setIsNavOpen(v => !v)}>
    <span></span><span></span><span></span>
  </button>

  <div className="nav-links" id="navMenu">
    <a href="#home"  onClick={closeNav}>Home</a>
    <a href="#about" onClick={closeNav}>About</a>

    <div className="nav-dropdown">
      <a href="#wishes" onClick={closeNav}>Gifts &amp; Wishes</a>
      <div className="nav-dropdown-menu">
        <a href="#wishes" onClick={closeNav}>Post good things here</a>
        <a href="#wishes" onClick={closeNav}>Wish her</a>
        <a href="#gifts"  onClick={closeNav}>Send gifts if accepted</a>
      </div>
    </div>

    <a href="#gallery" onClick={closeNav}>Gallery</a>
    <a className="nav-login-link" href="/signup" onClick={closeNav}>User Login</a>
  </div>
</nav>
```

### 4.2 Geometry & style

```css
.floating-nav {
  position: fixed;
  top: 28px;                                   /* floats — not flush to the top */
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  display: flex; align-items: center; justify-content: space-between;
  width: min(1120px, calc(100% - 32px));
  min-height: 64px;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: var(--radius);
  background: rgba(242, 251, 247, 0.78);
  box-shadow: 0 16px 45px rgba(8, 36, 58, 0.16);
  backdrop-filter: blur(18px);
  transition:
    top 350ms cubic-bezier(0.32, 0.72, 0, 1),
    transform 350ms cubic-bezier(0.32, 0.72, 0, 1),
    background 500ms ease, border-color 500ms ease, box-shadow 500ms ease;
}

.floating-nav.is-hidden  { top: -92px; transform: translateX(-50%); }   /* slides up out of view */
.floating-nav.is-scrolled{                                             /* denser glass once scrolled */
  border-color: rgba(255, 255, 255, 0.82);
  background: rgba(242, 251, 247, 0.9);
  box-shadow: 0 22px 55px rgba(8, 36, 58, 0.22);
}
```

**Brand:**
```css
.brand-mark   { display:inline-flex; align-items:center; gap:10px;
                color:var(--plum-950); font-weight:800; white-space:nowrap; }
.brand-signet { display:grid; width:38px; height:38px; place-items:center;
                border-radius:var(--radius); color:var(--white);
                background:linear-gradient(135deg,#0d3b57,#0f6b78 58%,#d88a18);
                font-family:var(--font-display); font-weight:800; }
```

**Links & hover pill:**
```css
.nav-links { display:flex; align-items:center; gap:6px; }

.nav-links a, .nav-dropdown > a {
  padding: 10px 13px; border: 0; border-radius: var(--radius);
  color: var(--plum-850); background: transparent;
  font-size: 0.93rem; font-weight: 700;
  transition: background 180ms ease, color 180ms ease, transform 180ms ease;
}
.nav-links a:hover, .nav-links a:focus-visible,
.nav-dropdown:hover > a, .nav-dropdown:focus-within > a {
  color: var(--white); background: var(--plum-700);
  outline: none; transform: translateY(-1px);       /* 1px lift = the signature hover */
}

.nav-login-link {                                    /* CTA link is always filled */
  color: var(--white) !important;
  background: var(--plum-700);
  box-shadow: 0 10px 24px rgba(15, 107, 120, 0.24);
}
```

**Dropdown (hover + focus-within, no JS):**
```css
.nav-dropdown { position: relative; }
.nav-dropdown-menu {
  position: absolute; top: calc(100% + 12px); left: 50%; z-index: 60;
  display: grid; min-width: 230px; max-height: 320px; overflow: auto;
  padding: 8px;
  border: 1px solid rgba(255,255,255,0.78); border-radius: var(--radius);
  background: rgba(242,251,247,0.94);
  box-shadow: 0 18px 45px rgba(8,36,58,0.18);
  backdrop-filter: blur(18px);
  opacity: 0; pointer-events: none;
  transform: translate(-50%, 8px);
  transition: opacity 180ms ease, transform 180ms ease;
}
.nav-dropdown:hover .nav-dropdown-menu,
.nav-dropdown:focus-within .nav-dropdown-menu {
  opacity: 1; pointer-events: auto; transform: translate(-50%, 0);
}
.nav-dropdown-menu a { white-space: nowrap; }
```

**Hamburger** (hidden ≥781px):
```css
.nav-toggle      { display:none; width:42px; height:42px; place-items:center;
                   border:1px solid var(--line); border-radius:var(--radius); background:var(--white); }
.nav-toggle span { display:block; width:18px; height:2px; margin:3px auto; background:var(--plum-850); }
```

### 4.3 Scroll behaviour (the hide/show logic — copy exactly)

```js
useEffect(() => {
  const lastY = { current: window.scrollY };

  function handleScroll() {
    const y = window.scrollY;
    const diff = y - lastY.current;

    if (diff > 3 && y > 70) {          // scrolling DOWN past 70px → hide + close menu
      setIsNavHidden(true);
      setIsNavOpen(false);
    } else if (diff < -3 || y < 24) {  // scrolling UP (3px threshold) or near top → show
      setIsNavHidden(false);
    }

    setIsNavScrolled(y > 20);          // denser glass
    setIsTopButtonVisible(y > 620);    // back-to-top button
    lastY.current = y;
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

The 3px dead-zone stops jitter; `y > 70` stops the nav hiding on tiny scrolls at the top.

### 4.4 Mobile nav (`@media (max-width: 780px)`)

```css
.floating-nav              { align-items: flex-start; padding: 10px; }
.brand-mark span:last-child{ display: none; }        /* signet only */
.nav-toggle                { display: grid; }
.nav-links {
  position: absolute; top: calc(100% + 8px); left: 0; right: 0;
  display: none;                                      /* toggled by .is-open */
  grid-template-columns: 1fr;
  padding: 8px;
  border: 1px solid rgba(255,255,255,0.72); border-radius: var(--radius);
  background: rgba(255,247,243,0.96);
  box-shadow: 0 16px 45px rgba(8,36,58,0.14);
}
.floating-nav.is-open .nav-links { display: grid; }
.nav-links a               { padding: 12px; }
.nav-dropdown, .nav-account{ display: grid; }
.nav-dropdown-menu {                                  /* dropdown becomes an inline indented list */
  position: static; display: grid; min-width: 0; max-height: 240px;
  margin: 4px 0 4px 12px; padding: 6px;
  border-color: var(--line); background: rgba(255,255,255,0.5);
  box-shadow: none; opacity: 1; pointer-events: auto; transform: none;
}
.nav-login-link { width: 100%; text-align: left; }
```

---

## 5. Hero section — full spec

### 5.1 Layout

A **full-bleed, full-viewport 2-column grid** that breaks out of the `.section-band` container:

```css
.section-band { width: min(1180px, calc(100% - 36px)); margin: 0 auto; }

.hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(300px, 0.74fr) minmax(360px, 0.86fr);
  gap: 44px;
  align-items: center;
  width: 100%; max-width: none;          /* overrides .section-band */
  min-height: 100vh;
  margin: 0;
  overflow: hidden;
  padding: 112px max(18px, calc((100vw - 1180px) / 2)) 74px;  /* self-centring gutters */
  background:
    radial-gradient(circle at 18% 18%, rgba(255,255,255,0.9), transparent 24%),
    linear-gradient(180deg, #84d8ff 0%, #b9ecff 42%, #e8f9ff 76%, #fff7f3 100%);
}
.hero.section-band { width: 100%; max-width: none; }
```

`max(18px, calc((100vw - 1180px) / 2))` is reused for `.hero-photo-meta` and `.slide-dots` so overlay elements align to the same 1180px rail as the content.

**Column 1** = `.hero-media` (the live tracker panel), **column 2** = `.hero-copy` (headline + buttons + stats). On mobile the copy is reordered above the panel with `order: -1`.

### 5.2 DOM order inside `.hero` (5 stacked layers)

```jsx
<section className="hero section-band" id="home">
  <div className="sky-motion"      aria-hidden="true"> …clouds/leaves/feathers/birds… </div>
  <div className="hero-background" aria-label="Simpal Kharel image slideshow">
      …slide layers, .slide-overlay, .hero-photo-meta, .slide-dots…
  </div>
  <div className="hero-media"> <article className="birthday-panel"> … </article> </div>
  <div className="hero-copy">  …eyebrow, h1, lede, glass buttons, stats… </div>
</section>
```

### 5.3 Background slideshow

```jsx
{imageSequence.map((src, index) => (
  <div className={`slide-layer${currentImage === index ? " is-active" : ""}`}
       aria-hidden={currentImage !== index} key={src}>
    <Image src={src} alt={`… slide ${index + 1}`} fill priority={index === 0}
           sizes="100vw" className="slide-image" />
  </div>
))}
<div className="slide-overlay"></div>
```

```js
useEffect(() => {                                  // auto-advance every 4s
  const t = setInterval(() =>
    setCurrentImage(p => (p + 1) % imageSequence.length), 4000);
  return () => clearInterval(t);
}, []);
```

```css
.slide-layer, .slide-overlay { position: absolute; inset: 0; }

.slide-layer {
  z-index: 0; opacity: 0;
  background-position: center; background-size: cover;
  filter: saturate(1.05) contrast(0.92);
  transform: scale(1.045);
  transition: opacity 1400ms ease-in-out, transform 5600ms ease;   /* long crossfade */
}
.slide-layer.is-active { opacity: 0.34; transform: scale(1); }     /* NOTE: only 34% */

.slide-image { object-fit: cover; opacity: 0.42; transform: scale(1.045);
               transition: transform 5200ms ease; }                /* slow Ken Burns */
.slide-layer.is-active .slide-image { transform: scale(1); }

.slide-overlay {
  z-index: 1;
  background:
    linear-gradient(180deg, rgba(132,216,255,0.32), rgba(185,236,255,0.22) 35%, rgba(13,59,87,0.34)),
    linear-gradient(90deg, rgba(8,36,58,0.22), rgba(57,169,224,0.04) 48%, rgba(255,255,255,0.28));
}
.slide-overlay::after {                                            /* bottom scrim for the dots */
  position:absolute; left:0; right:0; bottom:0; height:170px; content:"";
  background: linear-gradient(0deg, rgba(36,108,152,0.58), transparent);
}
```

The photos deliberately sit at ~34% opacity behind a blue sky gradient — they are **texture, not subject**.

**Slide counter + dots:**
```css
.hero-photo-meta { position:absolute; top:98px;
  left:max(18px,calc((100vw - 1180px)/2)); right:max(18px,calc((100vw - 1180px)/2));
  z-index:2; display:flex; justify-content:space-between; gap:12px;
  color:var(--white); font-size:0.84rem; font-weight:800; text-transform:uppercase; }

.slide-dots { position:absolute; bottom:30px; z-index:4;
  left:max(18px,calc((100vw - 1180px)/2)); right:max(18px,calc((100vw - 1180px)/2));
  display:flex; justify-content:center; gap:8px; }
.slide-dots button { width:8px; height:8px; border:0; border-radius:999px;
  background:rgba(255,255,255,0.48); box-shadow:0 4px 14px rgba(8,36,58,0.22);
  transition: width 500ms ease, background 240ms ease, transform 180ms ease; }
.slide-dots button.is-active { width:34px; background:var(--rose-200); }  /* dot → gold pill */
```
Counter format: `String(i+1).padStart(2,"0") + " / " + String(total).padStart(2,"0")` → `03 / 12`.

### 5.4 `.sky-motion` — the ambient hero scene

```jsx
<div className="sky-motion" aria-hidden="true">
  <span className="cloud cloud-one" /> … cloud-four
  <span className="spring-leaf leaf-one" /> … leaf-eight
  <span className="peacock-feather feather-one" /> … feather-four
  <span className="bird-flock flock-black"><i/><i/><i/><i/><i/></span>
  <span className="bird-flock flock-blue"><i/><i/><i/><i/></span>
  <span className="bird-flock flock-green"><i/><i/><i/><i/><i/></span>
</div>
```
`.sky-motion { position:absolute; inset:0; z-index:3; overflow:hidden; pointer-events:none; perspective:900px; }`

**Clouds** — a pure-CSS puffy cloud: 4 stacked `radial-gradient` circles + a body gradient + inset shadows, moving L→R with parallax depth via `translate3d(…, var(--cloud-depth))`:
```css
.cloud {
  position:absolute; left:-34vw; display:block;
  width: clamp(150px, 22vw, 340px); height: clamp(48px, 7.4vw, 112px);
  border-radius: 999px; opacity: 0.78;
  background:
    radial-gradient(circle at 22% 54%, rgba(255,255,255,0.98) 0 28%, transparent 29%),
    radial-gradient(circle at 42% 30%, rgba(255,255,255,0.96) 0 34%, transparent 35%),
    radial-gradient(circle at 66% 44%, rgba(255,255,255,0.96) 0 32%, transparent 33%),
    radial-gradient(circle at 82% 61%, rgba(255,255,255,0.9)  0 25%, transparent 26%),
    linear-gradient(180deg, rgba(255,255,255,0.98), rgba(221,244,255,0.9));
  box-shadow: 0 22px 38px rgba(42,131,179,0.14),
              inset -18px -16px 22px rgba(135,201,233,0.26),
              inset  18px  18px 22px rgba(255,255,255,0.9);
  filter: drop-shadow(0 18px 20px rgba(63,148,190,0.16));
  transform: translate3d(0,0,var(--cloud-depth,0)) rotateX(8deg);
  animation: cloudDrift var(--cloud-speed, 34s) linear infinite;
}
.cloud-one   { top:14%; --cloud-speed:38s; --cloud-depth:36px; }
.cloud-two   { top:27%; width:clamp(120px,17vw,260px); height:clamp(42px,6vw,86px);
               opacity:.64; animation-delay:-13s; --cloud-speed:31s; --cloud-depth:-60px; }
.cloud-three { top:43%; width:clamp(180px,26vw,390px); height:clamp(54px,8.2vw,124px);
               opacity:.55; animation-delay:-24s; --cloud-speed:46s; --cloud-depth:-120px; }
.cloud-four  { top:8%;  width:clamp(100px,14vw,210px); height:clamp(38px,5.2vw,72px);
               opacity:.72; animation-delay:-7s;  --cloud-speed:27s; --cloud-depth:90px; }

@keyframes cloudDrift {
  from { transform: translate3d(-8vw, 0, var(--cloud-depth,0)) rotateX(8deg); }
  to   { transform: translate3d(142vw, -10px, var(--cloud-depth,0)) rotateX(8deg); }
}
```

**Spring leaves** — 8 leaves blowing R→L, `border-radius: 100% 0 100% 0`, green gradient, `::after` vein, sizes 13–22px, speeds 8–15s, all with negative delays.

**Peacock feathers** — 4 feathers, `border-radius: 72% 28% 78% 22% / 54% 36% 64% 46%`, the eye built from a layered `radial-gradient` (`#174083` → `#08a6c6` → `#20a747` → `#d9b33f`), two rotated 1px `::before`/`::after` barbs, `transform-origin: 50% 84%`, `featherBlow` 14–18s ease-in-out.

**Bird flocks** — 3 flocks (black/blue/green). Each `<i>` is a bird: two `::before`/`::after` wings shaped `border-radius: 100% 100% 12% 100%`, flapping via `distantWingBeat 680ms`, positioned inside the flock with `--x`/`--y` and depth-scaled with `--bird-depth`. Whole flock crosses R→L on `flockFlyRightToLeft`.

### 5.5 `.birthday-panel` — the live tracker card

```jsx
<div className="hero-media" aria-label="Live birthday tracker">
  <article className="birthday-panel" aria-labelledby="birthdayTitle">
    <span className="perched-butterfly" aria-hidden="true"></span>
    <div className="tracker-portrait" aria-hidden="true"><img src="/the middle.jpeg" alt="" /></div>
    <div className="panel-kicker">Live birthday tracker</div>
    <CakeScene age={birthdayState.age} />
    <h2 id="birthdayTitle">{birthdayState.headline}</h2>
    <p className="age-line"><strong>{age}</strong> years shining, tracked every year from May 20.</p>
    <div className="countdown-grid">
      <span><strong>{days}</strong><small>Days</small></span>
      <span><strong>{hours}</strong><small>Hours</small></span>
      <span><strong>{minutes}</strong><small>Minutes</small></span>
      <span><strong>{seconds}</strong><small>Seconds</small></span>
    </div>
    <p className="calendar-note">{calendarNote}</p>
    <div className="panel-action-row">
      <button className="primary-action celebration-trigger" onClick={runCelebration}>See celebration effect</button>
      <button className="surprise-gift-trigger" onClick={openBirthdayVideo}>
        <span className="gift-box"><span className="gift-lid"/><span className="gift-body"/>
          <span className="gift-ribbon-vertical"/><span className="gift-ribbon-horizontal"/>
          <span className="gift-bow gift-bow-left"/><span className="gift-bow gift-bow-right"/></span>
        <span className="gift-callout">Hey dear, tap here</span>
      </button>
    </div>
  </article>
</div>
```

```css
.hero-media, .hero-copy { position: relative; z-index: 5; }
.hero-media { display:flex; grid-column:1; align-items:flex-end; justify-content:flex-start;
              justify-self:start; width:min(390px,100%); min-height:0; }

.birthday-panel {
  position:relative; z-index:3; width:100%; padding:17px;
  border:1px solid rgba(255,255,255,0.82); border-radius:var(--radius);
  color:var(--plum-950);
  background: linear-gradient(145deg, rgba(255,252,239,0.92), rgba(232,248,242,0.9)),
              rgba(255,255,255,0.84);
  box-shadow: 0 22px 58px rgba(8,36,58,0.28);
  backdrop-filter: blur(18px);
}
```

**Portrait medallion that overhangs the card and shines on hover:**
```css
.tracker-portrait {
  position:absolute; top:18px; right:-62px; z-index:6;   /* deliberately hangs outside */
  width:156px; height:156px; overflow:hidden;
  border:3px solid rgba(255,255,255,0.92); border-radius:50%;
  background: linear-gradient(135deg,#ffe0a3,#d7f1e7);
  box-shadow: 0 16px 32px rgba(8,36,58,0.22);
  transition: border-color 220ms ease, box-shadow 220ms ease, transform 220ms ease;
}
.tracker-portrait::after {                                /* the sweep */
  position:absolute; inset:-45%; z-index:2; content:""; opacity:0;
  background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.78) 48%,
                              rgba(84,196,255,0.58) 58%, transparent 72%);
  transform: translateX(-70%) rotate(12deg);
  transition: opacity 180ms ease;
}
.birthday-panel:hover .tracker-portrait, .tracker-portrait:hover {
  border-color: rgba(255,255,255,0.98);
  box-shadow: 0 18px 42px rgba(47,158,216,0.36), 0 0 34px rgba(255,255,255,0.58);
  transform: translateY(-4px);
}
.birthday-panel:hover .tracker-portrait::after, .tracker-portrait:hover::after {
  opacity: 1; animation: trackerPortraitShine 1200ms linear infinite;
}
@keyframes trackerPortraitShine {
  from { transform: translateX(-78%) rotate(12deg); }
  to   { transform: translateX( 78%) rotate(12deg); }
}
```

**Countdown grid:**
```css
.countdown-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:6px; margin:0 0 10px; }
.countdown-grid span   { display:grid; min-height:56px; place-items:center; padding:8px 6px;
                         border:1px solid var(--line); border-radius:var(--radius);
                         background:rgba(255,255,255,0.72); }
.countdown-grid strong { color:var(--plum-700); font-size:1.02rem; line-height:1; }
.countdown-grid small  { color:var(--muted); font-size:0.72rem; font-weight:800; text-transform:uppercase; }
```
Ticks once per second: `setInterval(() => setBirthdayState(calculateBirthdayState()), 1000)`.

**CSS cake** (`<CakeScene age>` — 220×142px, all divs, no images):
```
.cake-balloon ×2 (balloonFloat, ::after string)
.cake-gift ×2 (giftBounce, ::before/::after ribbon cross)
.cake-age          → the age number sitting on the cake
.cake-candles      → 3 .candle, each with <i> flame on flameFlicker (alternate)
.cherry ×2 · .cake-top (+::after drips) · .cake-layer ×2 · .cake-plate
```

**Surprise gift button** — a CSS gift box (lid, body, vertical + horizontal ribbon, two bows) that floats forever and has a glass "Hey dear, tap here" callout:
```css
.surprise-gift-trigger {
  position:relative; z-index:8; display:grid; justify-items:center; flex:0 0 auto;
  gap:3px; width:92px; padding:0; border:0; color:var(--white); background:transparent;
  filter: drop-shadow(0 14px 22px rgba(8,36,58,0.36));
  animation: giftFloat 2.2s ease-in-out infinite;
}
.gift-callout {
  display:block; width:92px; padding:4px 5px;
  border:1px solid rgba(255,255,255,0.62); border-radius:var(--radius);
  color:var(--white); background:rgba(255,255,255,0.16);
  box-shadow: 0 0 28px rgba(255,255,255,0.56), 0 12px 28px rgba(8,36,58,0.2);
  backdrop-filter: blur(14px);
  font-size:0.56rem; font-weight:800; line-height:1.12; text-align:center;
  text-transform:capitalize; text-shadow:0 2px 10px rgba(8,36,58,0.36);
}
.panel-action-row { display:flex; align-items:center; gap:10px; margin-top:14px; }
.panel-action-row .celebration-trigger { flex:1 1 auto; min-width:0; }
```

### 5.6 `.hero-copy` — headline column

```jsx
<div className="hero-copy">
  <p className="eyebrow hero-enter">Happy Birthday</p>
  <h1 className="hero-enter">Simpal Kharel Birthday Wishes</h1>
  <p className="hero-lede hero-enter">Wish You Many More Happy Returns of the Day.</p>

  <div className="hero-glass-actions" aria-label="Birthday action links">
    {heroActions.map((action, index) => (
      <a className="hero-glass-button hero-enter" href={action.href}
         style={{ "--enter-delay": `${360 + index * 90}ms` }} key={action.label}>
        {action.label}
      </a>
    ))}
  </div>

  <dl className="hero-stats">
    <div className="hero-enter" style={{ "--enter-delay": "960ms"  }}><dt>{currentYear}</dt><dd>Current year</dd></div>
    <div className="hero-enter" style={{ "--enter-delay": "1060ms" }}><dt>{age}</dt><dd>Current age</dd></div>
    <div className="hero-enter" style={{ "--enter-delay": "1160ms" }}><dt>{imageSequence.length}</dt><dd>Gallery moments</dd></div>
  </dl>
</div>
```

**The 8 hero action links** (this is the "options" row — the page's real navigation):
```js
const heroActions = [
  { label: "My dedicated video",                    href: "#dedicated-youtube-video" },
  { label: "Send wishes / do good things & post",   href: "#wishes" },
  { label: "Gallery",                               href: "#gallery" },
  { label: "Songs",                                 href: "#her-song" },
  { label: "Gift send",                             href: "#gifts" },
  { label: "Her personality to me",                 href: "#personality" },
  { label: "Her journey & achievements",            href: "#about" },
  { label: "My voice Note",                         href: "#voice-notes" }
];
```

```css
.hero-copy {
  position:relative; grid-column:2; justify-self:end;
  width:min(620px,100%); padding:18px 0; text-align:left;
  text-shadow: 0 4px 24px rgba(8,36,58,0.68), 0 2px 8px rgba(8,36,58,0.44);  /* legibility over photos */
}
.hero-copy h1        { max-width:720px; color:var(--white); font-size:4.8rem; }
.hero-lede           { max-width:660px; margin:22px 0 28px;
                       color:rgba(255,255,255,0.92); font-size:1.12rem; font-weight:800; }
.hero-copy .eyebrow  { color:#ffe0a3; }

.hero-glass-actions  { display:flex; flex-wrap:wrap; gap:10px; margin:0 0 28px; }
.hero-glass-button {
  display:inline-flex; align-items:center; justify-content:center;
  min-height:44px; padding:11px 14px;
  border:1px solid rgba(255,255,255,0.42); border-radius:var(--radius);
  color:var(--white); background:rgba(8,36,58,0.28);
  box-shadow:0 12px 30px rgba(8,36,58,0.2);
  font-size:0.9rem; font-weight:900;
  text-shadow:0 2px 12px rgba(8,36,58,0.68);
  backdrop-filter: blur(14px);
  transition: transform 180ms ease, background 180ms ease, border-color 180ms ease;
}
.hero-glass-button:hover, .hero-glass-button:focus-visible {
  border-color: rgba(255,255,255,0.72);
  background: rgba(216,138,24,0.32);      /* gold tint on hover */
  outline: none; transform: translateY(-2px);
}

.hero-stats     { display:grid; grid-template-columns:repeat(3,minmax(0,1fr));
                  gap:10px; max-width:560px; margin:0; }
.hero-stats div { padding:16px; border:1px solid rgba(255,255,255,0.42); border-radius:var(--radius);
                  background:rgba(255,255,255,0.14); backdrop-filter:blur(14px);
                  box-shadow:0 14px 38px rgba(8,36,58,0.08); }
.hero-stats dt  { color:var(--white); font-family:var(--font-display);
                  font-size:2rem; font-weight:800; line-height:1; }
.hero-stats dd  { margin:5px 0 0; color:rgba(255,255,255,0.82);
                  font-size:0.82rem; font-weight:800; text-transform:uppercase; }
```

### 5.7 Hero entrance stagger

```css
.hero-enter {
  opacity: 0;
  transform: translateY(24px);
  animation: heroEnter 720ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--enter-delay, 120ms);
}
.hero-copy h1.hero-enter        { --enter-delay: 220ms; }
.hero-copy .hero-lede.hero-enter{ --enter-delay: 320ms; }

@keyframes heroEnter {
  0%   { opacity: 0; transform: translateY(26px) scale(0.98); }
  100% { opacity: 1; transform: translateY(0)    scale(1); }
}
```
Timeline: eyebrow 120ms → h1 220ms → lede 320ms → 8 glass buttons `360 + i*90` (360…990ms) → stats 960/1060/1160ms.

---

## 6. Buttons & section headings (site-wide)

```css
.primary-action, .secondary-action, .glass-action, .text-action {
  display:inline-flex; align-items:center; justify-content:center;
  min-height:46px; border-radius:var(--radius); font-weight:800;
  transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
}
.primary-action {
  border:1px solid var(--plum-700); padding:12px 18px; color:var(--white);
  background: linear-gradient(135deg,#0d3b57,#0f6b78 62%,#1f8c68);
  box-shadow: 0 14px 28px rgba(8,36,58,0.24);
}
.primary-action:hover, .primary-action:focus-visible {
  background: linear-gradient(135deg,#08243a,#0d3b57 54%,#d88a18);
  box-shadow: 0 18px 34px rgba(8,36,58,0.3);
  transform: translateY(-2px); outline:none;
}
.secondary-action { border:1px solid rgba(15,107,120,0.24); padding:12px 18px;
                    color:var(--plum-850); background:rgba(255,255,255,0.64); }
.glass-action     { border:1px solid rgba(255,255,255,0.54); padding:12px 18px;
                    color:var(--white); background:rgba(8,36,58,0.28);
                    box-shadow:0 14px 30px rgba(8,36,58,0.18);
                    text-shadow:0 2px 12px rgba(8,36,58,0.46); backdrop-filter:blur(14px); }
.glass-action:hover { background: rgba(216,138,24,0.34); }
```

**Section heading with a CSS butterfly and flower decoration** — every `h2` gets a dark butterfly top-right and a 5-dot flower bottom-left, both animating forever:

```css
.section-heading { display:grid; gap:12px; max-width:820px; margin-bottom:32px; }
.section-heading h2, .gift-content h2 { position:relative; display:inline-block; font-size:3.25rem; }

.section-heading h2::before {                    /* butterfly */
  position:absolute; top:-20px; right:-34px; content:"";
  width:24px; height:18px; border-radius:999px; background:#2f1e16;
  filter: drop-shadow(0 8px 10px rgba(8,36,58,0.16));
  animation: headingButterflyDrift 2600ms ease-in-out infinite alternate;
}
.section-heading h2::after {                     /* 5-dot flower */
  position:absolute; left:-24px; bottom:-10px; content:"";
  width:15px; height:15px; border-radius:50%; background:#ffd84b;
  box-shadow:
    -8px 0 var(--heading-flower, #1f8c68),  8px 0 var(--heading-flower, #1f8c68),
     0 -8px var(--heading-flower-light, #d7f1e7), 0 8px var(--heading-flower-light, #d7f1e7);
  animation: headingFlowerFloat 1900ms ease-in-out infinite;
}
```
Per-section recolouring is done with local custom properties, e.g.
`.gallery-section .section-heading h2 { --heading-flower:#1f8c68; --heading-flower-light:#d7f1e7; }`

---

## 7. Remaining sections (in page order)

All use `className="… section-band"`, `padding: 84px 0`, `scroll-margin-top: 96px`.

| # | id | Class | Layout |
|---|---|---|---|
| 1 | `#home` | `.hero` | 2-col, 100vh, described above |
| 2 | `#gallery` | `.gallery-section` | `.gallery-grid` = `repeat(5, minmax(0,1fr))`, gap 12px; `.gallery-tile` min-height 220px, `<button className="gallery-zoom-trigger">` fills the tile → opens lightbox; footer link "More Gallery" → `/more-gallery` |
| 3 | — | `.coming-soon-section` | `.planned-grid` = `repeat(3, minmax(0,1fr))`, gap 14px; 3 `.planned-card` (min-height 180px, padding 22px, glass): *Dedicated video* (link), *Her song* (Play/Pause button toggling `<audio src="/her-song.mp3">`), *Her personality to me* (opens image viewer). Below: `.youtube-video-card` with a 16:9 YouTube iframe (`#dedicated-youtube-video`) |
| 4 | `#about` | `.about-section` | `.journey-carousel` → header + Left/Right buttons + `.journey-belt` horizontal scroller |
| 5 | `#wishes` | `.wishes-section` | `.wish-layout` = `minmax(320px,0.78fr) minmax(0,1.22fr)` — form left, wish wall right |
| 6 | `#gifts` | `.gift-section` | 2-col: copy left, `.gift-scroll-stage` sticky image scrubber right |
| 7 | — | `footer.site-footer > .mindset-footer` | dark nature panel |

**Journey belt** (scroll-snap carousel, cards animate in on a stagger):
```css
.journey-belt { display:flex; gap:16px; overflow-x:auto; padding:18px;
                scroll-behavior:smooth; scroll-padding-inline:18px;
                scroll-snap-type: x mandatory;
                scrollbar-color: rgba(15,107,120,0.42) rgba(255,255,255,0.45);
                scrollbar-width: thin; }
.journey-card { position:relative; display:block; text-align:left;
                flex: 0 0 min(330px, 82vw); min-height:270px; padding:20px;
                border:1px solid rgba(255,255,255,0.74); border-radius:var(--radius);
                background:rgba(255,255,255,0.76); background-clip:padding-box;
                box-shadow:0 12px 30px rgba(8,36,58,0.08);
                scroll-snap-align:start;
                animation: journeyCardIn 620ms cubic-bezier(0.22,1,0.36,1) both;
                animation-delay: var(--journey-delay, 0ms); }   /* index * 38ms */
```
Arrow buttons scroll by exactly one card: `card.getBoundingClientRect().width + 16` (fallback 340).
Cards with matching media get `.has-media`, `role="button"`, `tabIndex={0}`, Enter/Space handling → open `.journey-media-preview` inline (image or video), animating with `journeyMediaReveal`.

**Gift scroll scrubber** — a sticky viewport whose visible frame is chosen from the container's own scroll progress, with a weighted spacer track (first image gets 1.5× dwell):
```css
.gift-scroll-stage    { position:sticky; top:112px; min-height:560px; max-height:74vh;
                        overflow-y:auto; overflow-x:hidden;
                        scrollbar-color: transparent transparent; scrollbar-width:thin;
                        scroll-snap-type: y mandatory;
                        transition: scrollbar-color 180ms ease; }
.gift-scroll-stage:hover { scrollbar-color: rgba(15,107,120,0.46) rgba(255,255,255,0.42); }
.gift-scroll-viewport { position:sticky; top:0; min-height:560px; overflow:hidden;
                        border:1px solid rgba(255,255,255,0.72); border-radius:var(--radius);
                        background:
                          radial-gradient(circle at 50% 18%, rgba(216,138,24,0.28), transparent 30%),
                          radial-gradient(circle at 20% 78%, rgba(31,140,104,0.18), transparent 30%),
                          rgba(255,255,255,0.56);
                        box-shadow: 0 18px 48px rgba(8,36,58,0.12); backdrop-filter: blur(12px); }
.gift-scroll-viewport img            { position:absolute; left:50%; top:50%; opacity:0; }
.gift-scroll-viewport img.is-active  { opacity:1; }
.gift-scroll-viewport img.is-double-size { /* 2× */ }
.gift-scroll-viewport img.is-triple-size { /* 3× */ }
```
```js
onScroll={(e) => {
  const t = e.currentTarget;
  const maxScroll = Math.max(1, t.scrollHeight - t.clientHeight);
  const progress  = t.scrollTop / maxScroll;
  const weighted  = progress * totalGiftScrollWeight;
  let cursor = 0, nextIndex = giftScrollImages.length - 1;
  for (let i = 0; i < giftScrollWeights.length; i++) {
    cursor += giftScrollWeights[i];
    if (weighted < cursor) { nextIndex = i; break; }
  }
  setActiveGiftScrollImage(nextIndex);
}}
```

**Footer** — dark gradient panel with a whole CSS nature scene layered inside:
```css
.mindset-footer {
  position:relative; overflow:hidden;
  width:min(1180px, calc(100% - 36px)); margin:0 auto 34px;
  padding:58px 28px 34px;
  border:1px solid rgba(15,107,120,0.28); border-radius:var(--radius);
  color:#f8fffb;
  background:
    radial-gradient(circle at 18% 18%, rgba(216,138,24,0.28), transparent 26%),
    radial-gradient(circle at 78% 10%, rgba(31,140,104,0.34), transparent 28%),
    linear-gradient(145deg, #08243a 0%, #0d3b57 44%, #5d3a20 100%);
  box-shadow: inset 0 0 70px rgba(8,36,58,0.28), 0 18px 44px rgba(8,36,58,0.16);
  isolation: isolate;
}
```
Inside `.mindset-nature`: `.cherry-tree` (swaying), 8 `.petal`, 4 `.white-flower`, 3 `.grass`, 3 `.flower`, 5 `.butterfly` (two plain + red/yellow/blue). Then `.mindset-messages` quotes, `.social-footer` with 3 links (LinkedIn / Instagram / X, each `.social-icon` a coloured square), and `.footer-small`.

---

## 8. Overlays, floating UI & modals

All modals follow the same pattern: conditional render → `role="dialog" aria-modal="true"` → fixed full-screen scrim → shell with an `X` close button.

| Element | Trigger | Notes |
|---|---|---|
| `.birthday-video-overlay` | gift box in panel | locks `body.overflow`, autoplays `/completed-birthday-video.mp4`, "Skip" button, closes on `onEnded` |
| `.gallery-image-overlay` | gallery tile | click scrim to close, `stopPropagation` on the viewer |
| `.personality-image-overlay` | "Click and view" | Small / Big size cycling via `is-${personalitySize}` |
| `.healthy-note-overlay` | letter trigger | paper letter, `healthyLetterIn` + `healthyPageTurn`, Previous / Next page |
| `.journey-media-preview` | journey card | inline (not a modal), `journeyMediaReveal` |
| `.celebration-layer` | "See celebration effect" | z-index 120, 128 falling particles |
| `.top-up-button` | scrollY > 620 | fixed right 18px / bottom 8px |
| `.cursor-glow` | pointermove | z-index 150, follows cursor |
| `<Chatbot />` | always | fixed bottom-right, `chatbotIn` / `chatbotMessageIn` / mic pulse |

**Back-to-top:**
```css
.top-up-button {
  position:fixed; right:18px; bottom:8px; z-index:90;
  min-width:58px; min-height:44px;
  border:1px solid rgba(255,255,255,0.72); border-radius:var(--radius);
  color:var(--white);
  background: linear-gradient(135deg, rgba(8,36,58,0.92), rgba(15,107,120,0.88));
  box-shadow: 0 16px 34px rgba(8,36,58,0.24); backdrop-filter: blur(12px);
  font-weight:900;
  opacity:0; pointer-events:none; transform: translateY(14px);
  transition: opacity 180ms ease, transform 180ms ease, background 180ms ease;
}
.top-up-button.is-visible { opacity:1; pointer-events:auto; transform:translateY(0); }
```

**Cursor glow** — a 18px dot at `--cursor-x/--cursor-y`, faded in on first move:
```css
.cursor-glow { position:fixed; left:var(--cursor-x,-100px); top:var(--cursor-y,-100px);
               z-index:150; width:18px; height:18px; pointer-events:none;
               opacity:0; transform:translate(-50%,-50%); transition:opacity 180ms ease; }
.cursor-glow.is-visible { opacity:1; }
```
```js
window.addEventListener("pointermove", (e) => {
  el.style.setProperty("--cursor-x", `${e.clientX}px`);
  el.style.setProperty("--cursor-y", `${e.clientY}px`);
  el.classList.add("is-visible");
}, { passive: true });
```

**Celebration burst** — 128 particles, 8 types, falling with drift + spin:
```js
const colors  = ["#0d3b57","#0f6b78","#1f8c68","#d88a18","#ffe0a3","#5d3a20","#2f9ed8","#f08bb4","#f27a22"];
const accents = ["#ffe47a","#ffffff","#d7f1e7","#0b2330","#ffc75d"];
const types   = ["sunflower","rose","flower-blue","flower-pink","flower-orange","gift","balloon","sparkle"];

// per particle, as inline CSS custom properties:
"--x": `${rand(0,100)}vw`, "--size": `${size}px`,
"--duration": `${rand(4200,7600)}ms`, "--delay": `${rand(0,1100)}ms`,
"--drift": `${rand(-150,150)}px`, "--spin": `${rand(240,1080)}deg`,
"--rotate": `${rand(0,180)}deg`, "--color": …, "--accent": …
// size: large types (balloon/gift/sunflower/flower-*) 22–34px (balloon up to 48), else 10–20px
// cleared after 9000ms; also nudges the panel:
gsap.fromTo(".birthday-panel", { scale: 0.98 }, { scale: 1, duration: 0.65, ease: "elastic.out(1, 0.45)" });
```
```css
.celebration-layer { position:fixed; inset:0; z-index:120; overflow:hidden; pointer-events:none; }
.particle { position:absolute; top:-12vh; left:var(--x); width:var(--size); height:var(--size);
            opacity:0; animation: celebrationFall var(--duration) linear forwards;
            animation-delay: var(--delay); }
```

---

## 9. Scroll-reveal system (GSAP + fallback)

Add `className="reveal"` to any element. Headings additionally get `slide-heading heading-reveal` — those alternate sliding in from left and right down the page.

```css
.reveal                       { opacity: 1; transform: none; }         /* no-JS safe */
.js .reveal                   { opacity: 0; transform: translateY(26px); }
.js .reveal.slide-heading     { transform: translateX(-76px); }
.js .reveal.slide-heading.from-right { transform: translateX(76px); }
.js .reveal.is-visible        { opacity:1; transform:translateY(0);
                                transition: opacity 640ms ease, transform 640ms ease; }
.js .reveal.slide-heading.is-visible { transform: translateX(0); }
```

```js
function useGsapReveals() {
  useEffect(() => {
    let cleanup = () => {}, cancelled = false;

    async function animate() {
      try {
        const gsapModule = await import("gsap");                      // lazy — not in first bundle
        const scrollTriggerModule = await import("gsap/ScrollTrigger");
        if (cancelled) return;

        const gsap = gsapModule.gsap || gsapModule.default;
        const { ScrollTrigger } = scrollTriggerModule;
        gsap.registerPlugin(ScrollTrigger);
        window.gsap = gsap;                                            // reused by runCelebration

        const context = gsap.context(() => {
          gsap.utils.toArray(".heading-reveal")
              .forEach((item, i) => item.classList.toggle("from-right", i % 2 === 1));

          gsap.utils.toArray(".reveal").forEach((item) => {
            const isHeading = item.classList.contains("heading-reveal");
            const headingX  = item.classList.contains("from-right") ? 76 : -76;
            const fromVars  = isHeading || item.classList.contains("slide-heading")
              ? { x: isHeading ? headingX : -48, y: 0, opacity: 0 }
              : { y: 32, opacity: 0 };

            gsap.fromTo(item, fromVars, {
              x: 0, y: 0, opacity: 1,
              duration: isHeading ? 0.9 : 0.8,
              ease: isHeading ? "expo.out" : "power3.out",
              scrollTrigger: { trigger: item, start: "top 86%", toggleActions: "play none none none" }
            });
          });
        });

        cleanup = () => { context.revert(); ScrollTrigger.getAll().forEach(t => t.kill()); };
      } catch {
        cleanup = runRevealFallback();      // IntersectionObserver, threshold 0.12, adds .is-visible
      }
    }

    animate();
    return () => { cancelled = true; cleanup(); };
  }, []);
}
```

---

## 10. Full animation catalog (52 keyframes)

| Keyframe | Applied to | Timing | Effect |
|---|---|---|---|
| `heroEnter` | `.hero-enter` | 720ms `cubic-bezier(.22,1,.36,1)` forwards, staggered delay | fade + rise 26px + scale .98→1 |
| `cloudDrift` | `.cloud` | 27–46s linear ∞ | `-8vw → 142vw` with `--cloud-depth` parallax + `rotateX(8deg)` |
| `leafBlow` | `.spring-leaf` | 8–15s linear ∞ | R→L, 3D rotate, fade in at 10% |
| `featherBlow` | `.peacock-feather` | 14–18s ease-in-out ∞ | drifting sway, origin `50% 84%` |
| `flockFlyRightToLeft` | `.bird-flock` | ~24s linear ∞ | flock crosses the sky R→L |
| `distantWingBeat` | `.bird-flock i::before/::after` | 680ms ease-in-out ∞ | wing flap |
| `ambientLeafBlow` | `.ambient-leaf` | 18–28s linear ∞ | page-wide drifting leaves |
| `ambientFlowerDrift` | `.ambient-flower` | long, linear ∞ | page-wide drifting flowers |
| `flameFlicker` | `.candle i` | short, alternate ∞ | scale .86→1.08, rotate ±4° |
| `balloonFloat` | `.cake-balloon` | alternate ∞ | +5px→−9px, rotate −3°→4° |
| `giftBounce` | `.cake-gift` | ∞ | 0 → −6px → 0 |
| `giftFloat` | `.surprise-gift-trigger` | 2.2s ease-in-out ∞ | idle bob |
| `giftShake` | gift box (attention) | ∞ | shake |
| `giftButtonShine` | gift button sweep | linear ∞ | `translateX(-72% → 72%) rotate(12deg)` |
| `trackerPortraitShine` | `.tracker-portrait::after` | 1200ms linear ∞ (hover only) | `translateX(-78% → 78%) rotate(12deg)` |
| `journeyCardIn` | `.journey-card` | 620ms `cubic-bezier(.22,1,.36,1)` both, `i*38ms` | staggered card entry |
| `journeyMediaReveal` | `.journey-media-preview` | once | preview opens |
| `rainbowGlow` | accent borders | ∞ | hue cycle |
| `headingButterflyDrift` | `h2::before` | 2600ms ease-in-out ∞ alternate | butterfly hovers by the heading |
| `headingFlowerFloat` | `h2::after` | 1900ms ease-in-out ∞ | flower bobs |
| `butterflyFlight` / `wingFlap` / `perchedWing` | footer + `.perched-butterfly` | ∞ | flight path + wing beats |
| `blossomCanopy` / `petalBlow` / `footerTreeSway` | footer tree & petals | ∞ | canopy sway, falling petals |
| `whiteFlowerFlight` / `grassSway` / `flowerBob` | footer scene | ∞ | drifting flowers, swaying grass |
| `footerFlyRightToLeft` / `letterLeafBlow` | footer & letter leaves | ∞ | leaf crossing with 3D rotation |
| `personalityPop` | personality viewer | once | pop-in |
| `voiceGiftBounce` / `voiceShelfOpen` / `voiceWave` / `micPulse` | voice-note UI | ∞ / once | bounce, shelf open, waveform, mic pulse |
| `healthyLetterIn` / `healthyPageTurn` | letter modal | once per page | open + page turn |
| `chatbotIn` / `chatbotMessageIn` / `chatbotMicVibrate` / `chatbotMicPulse` | chatbot | once / ∞ | panel open, message entry, mic feedback |
| `monalFloat` / `monalHop` / `monalWing` | monal bird mascot | ∞ | float, hop, wing |
| `ziggyFloat` / `ziggyBark` / `ziggyHop` / `ziggyLeftEar` / `ziggyRightEar` | dog mascot | ∞ | idle + reaction |
| `signupFloat` / `signupCardIn` | `/signup` page | ∞ / once | float + card entry |
| `swanWingPulse` | swan decoration | ∞ | wing pulse |
| `celebrationFall` | `.particle` | `var(--duration)` 4.2–7.6s linear forwards | fall + `--drift` X + `--spin` rotation |

### Easing vocabulary
```
cubic-bezier(0.32, 0.72, 0, 1)   → nav slide (fast out, soft settle)
cubic-bezier(0.22, 1, 0.36, 1)   → all entrances (heroEnter, journeyCardIn)
ease                             → all hovers (180ms)
linear                           → all ambient loops (clouds, leaves, birds, particles)
ease-in-out                      → sway/bob loops (feathers, butterflies, gift float)
gsap "expo.out"                  → heading reveals (0.9s)
gsap "power3.out"                → body reveals (0.8s)
gsap "elastic.out(1, 0.45)"      → celebration panel pop (0.65s)
```

### Duration vocabulary
```
180ms  hover / micro-transition
220ms  medium (portrait hover)
350ms  nav show / hide
500ms  slide-dot width, glass state change
620–720ms  entrance animations
640ms  reveal transition (fallback)
1200ms shine loop
1400ms slideshow crossfade
4000ms slideshow interval
5200–5600ms Ken Burns zoom
8–46s  ambient loops
```

---

## 11. Responsive breakpoints

Four queries only: **1060px**, **780px**, **460px**, and `prefers-reduced-motion`.

**≤1060px** — hero becomes single column, copy moves above panel:
```css
.hero        { grid-template-columns: 1fr; min-height: auto; padding-inline: 28px; }
.hero-copy   { grid-column: 1; order: -1; justify-self: stretch; width: 100%; padding: 28px; }
.hero-copy h1{ font-size: 4rem; }
.hero-media  { grid-column: 1; justify-self: start; width: min(430px, 100%); min-height: 0; }
.about-grid  { grid-template-columns: repeat(2, minmax(0,1fr)); }
.wish-layout { grid-template-columns: 1fr; }
.gift-section{ grid-template-columns: 1fr; min-height: auto; }
.gift-scroll-stage { position: relative; top: auto; min-height: 360px; }   /* un-sticks */
```

**≤780px** — mobile nav (see §4.4) plus:
```css
.hero        { width:100%; gap:24px; padding-top:104px; padding-inline:12px; }
.hero-copy h1{ font-size: 3.1rem; }
.birthday-video-overlay { padding: 5vh 5vw; }
.birthday-video-shell   { width: 90vw; height: 90vh; }
```
(also collapses gallery to 2 columns, planned-grid to 1, journey cards to `82vw`)

**≤460px** — tighter padding, smaller type, single-column everything.

**`prefers-reduced-motion: reduce`** — ambient loops and reveals are disabled; content renders in its final state.

---

## 12. Accessibility contract

- Every decorative layer is `aria-hidden="true"` (`.sky-motion`, `.ambient-*`, `.cake-scene`, `.celebration-layer`, `.cursor-glow`, `.mindset-nature`, `.gift-scroll-viewport`).
- Nav: `aria-label="Primary navigation"`, toggle has `aria-expanded` + `aria-controls="navMenu"`.
- Slide dots: `aria-pressed` + `aria-label="Show gallery image N"`; hero background has `aria-label="… image slideshow"`; inactive slides `aria-hidden`.
- Journey cards with media get `role="button"`, `tabIndex={0}` and Enter/Space handlers.
- All modals: `role="dialog" aria-modal="true" aria-label="…"`.
- Dropdowns open on **`:focus-within` as well as `:hover`** — keyboard reachable without JS.
- Minimum touch target: `min-height: 44px` on hero glass buttons and the top button, `46px` on actions.
- Focus is never removed silently — `outline: none` is always paired with a `transform`/`background` change, and the gift button uses `outline: 3px solid rgba(255,255,255,0.9); outline-offset: 8px`.
- `.reveal` is visible by default; hidden only under `html.js`.

---

## 13. Asset checklist for a clean recreation

```
/public
  gallery/1..10.(jpg|jpeg)          hero slideshow + gallery grid
  the middle.jpeg                   tracker portrait
  FINALbaba!!.png                   personality viewer
  the-words-note.jpg                written note page
  completed-birthday-video.mp4      surprise video
  her-song.mp3                      song player
  voice-1..4.mp3                    voice notes
  gift-scroll-01..13.png            gift scrubber frames (13 total, reversed order)
  journey-*.{jpg,jpeg,webp,avif}    journey timeline media
```
Fonts: Playfair Display (600/700/800) + Plus Jakarta Sans (400–800) via Google Fonts with `preconnect`.
Deps: `next`, `react`, `gsap` (lazy-imported only).

---

## 14. Recreation prompt (copy-paste into another project)

> Build a single-page animated birthday/celebration landing page in Next.js App Router (`"use client"` component + one global plain-CSS file, no Tailwind, no UI kit). Match this design exactly:
>
> **Tokens.** `--plum-950:#08243a; --plum-850:#0d3b57; --plum-700:#0f6b78; --orchid-500:#1f8c68; --rose-500:#d88a18; --rose-200:#ffe0a3; --mocha-700:#5d3a20; --mocha-300:#b78343; --cream-100:#f3fbf7; --lavender-100:#d7f1e7; --ink:#0b2330; --muted:#49636a; --line:rgba(13,59,87,0.16); --radius:8px;` Fonts: `--font-display:"Playfair Display",Georgia,serif`, `--font-body:"Plus Jakarta Sans",Arial,sans-serif`. **Use `var(--radius)` (8px) as the only border-radius in the entire design** — circles and pills excepted. Every shadow is `rgba(8,36,58,α)` with α 0.08–0.28, never black.
>
> **Global background.** `body::before` (z −2): teal + gold radial gradients over a 120° cream/mint linear gradient. `body::after` (z −1): 36px×36px graph grid of `rgba(13,59,87,0.045)` 1px lines at 0.35 opacity. Then two fixed full-viewport `pointer-events:none` layers of 8 CSS leaves and 8 CSS flowers, each positioned and timed by per-element custom properties (`--leaf-top/--leaf-size/--leaf-speed/--leaf-delay/--leaf-rotate`) with **negative animation-delays** so nothing starts in sync.
>
> **Nav bar.** A *floating* pill: `position:fixed; top:28px; left:50%; transform:translateX(-50%); width:min(1120px, calc(100% - 32px)); min-height:64px; padding:10px 12px; border:1px solid rgba(255,255,255,0.72); border-radius:8px; background:rgba(242,251,247,0.78); box-shadow:0 16px 45px rgba(8,36,58,0.16); backdrop-filter:blur(18px); z-index:50`. Transition `top` and `transform` over `350ms cubic-bezier(0.32,0.72,0,1)`.
> Three state classes: `.is-hidden` → `top:-92px` (slides up); `.is-scrolled` → denser glass (`background:rgba(242,251,247,0.9)`, `box-shadow:0 22px 55px rgba(8,36,58,0.22)`); `.is-open` → mobile menu shown.
> Left: `.brand-mark` = a 38×38 `.brand-signet` square with initials on `linear-gradient(135deg,#0d3b57,#0f6b78 58%,#d88a18)`, Playfair 800, white — plus a bold wordmark that is hidden below 780px.
> Right: `.nav-links` flex, gap 6px. Each link `padding:10px 13px; border-radius:8px; color:var(--plum-850); font-size:0.93rem; font-weight:700`, hover → white text on `var(--plum-700)` and `translateY(-1px)`. One link is a CTA that is always filled (`background:var(--plum-700)`, white text, `box-shadow:0 10px 24px rgba(15,107,120,0.24)`).
> One `.nav-dropdown` opens on **both `:hover` and `:focus-within`** — the menu is absolutely positioned at `top:calc(100% + 12px); left:50%`, `min-width:230px`, glass, and animates `opacity 0→1` + `transform:translate(-50%,8px)→translate(-50%,0)` over 180ms.
> Scroll logic: track `lastY`; if `delta > 3 && y > 70` hide the nav and close the menu; if `delta < -3 || y < 24` show it; `y > 20` sets `.is-scrolled`; `y > 620` shows the back-to-top button. Listener is `{ passive: true }` and runs once on mount.
> Mobile (≤780px): hamburger `.nav-toggle` (42×42, three 18×2px bars) appears; `.nav-links` becomes an absolutely-positioned full-width panel below the bar, `display:none` until `.is-open`; the dropdown flattens to a static indented list.
>
> **Hero.** `position:relative; display:grid; grid-template-columns:minmax(300px,0.74fr) minmax(360px,0.86fr); gap:44px; align-items:center; min-height:100vh; width:100%; overflow:hidden; padding:112px max(18px,calc((100vw - 1180px)/2)) 74px;` background `radial-gradient(circle at 18% 18%, rgba(255,255,255,0.9), transparent 24%), linear-gradient(180deg,#84d8ff 0%,#b9ecff 42%,#e8f9ff 76%,#fff7f3 100%)`. Reuse that `max(18px, calc((100vw - 1180px)/2))` gutter for absolutely-positioned overlay elements so they align to the same 1180px rail.
> Five stacked layers, in DOM order:
> 1. **`.sky-motion`** (`z:3`, `perspective:900px`, `pointer-events:none`): 4 CSS clouds (each built from four `radial-gradient` puffs + body gradient + inset shadows, drifting `-8vw → 142vw` over 27–46s with `translate3d(..., var(--cloud-depth))` parallax from `-120px` to `+90px` and `rotateX(8deg)`); 8 green `border-radius:100% 0 100% 0` leaves blowing right→left over 8–15s; 4 peacock feathers (`border-radius:72% 28% 78% 22% / 54% 36% 64% 46%`, eye made from a layered radial-gradient `#174083 → #08a6c6 → #20a747 → #d9b33f`, two rotated hairline barbs, `transform-origin:50% 84%`, 14–18s ease-in-out sway); and 3 bird flocks (4–5 `<i>` each, wings as `::before`/`::after` shaped `border-radius:100% 100% 12% 100%` flapping at 680ms, whole flock crossing right→left).
> 2. **`.hero-background`** (`z:0`): a crossfading photo slideshow — one absolutely-positioned layer per image, auto-advancing every 4000ms; inactive `opacity:0` + `scale(1.045)`, active `opacity:0.34` + `scale(1)`, transitions `opacity 1400ms ease-in-out, transform 5600ms ease` (slow Ken Burns), `filter:saturate(1.05) contrast(0.92)`. Over it a `.slide-overlay` with two stacked linear gradients (sky blue → deep navy vertically, navy → white horizontally) plus a `::after` 170px bottom scrim. Photos are texture, not subject — never raise them above 34%.
> 3. **`.hero-photo-meta`** (`top:98px`): zero-padded `NN / NN` slide counter left, a label right, white uppercase 800.
> 4. **`.slide-dots`** (`bottom:30px`, centred): 8px round dots at `rgba(255,255,255,0.48)`; the active one animates to `width:34px` (gold pill `--rose-200`) over `500ms`.
> 5. **`.hero-media` + `.hero-copy`** (`z:5`).
>
> **Hero left — live tracker panel.** `.birthday-panel`: `padding:17px; border:1px solid rgba(255,255,255,0.82); border-radius:8px; background:linear-gradient(145deg,rgba(255,252,239,0.92),rgba(232,248,242,0.9)), rgba(255,255,255,0.84); box-shadow:0 22px 58px rgba(8,36,58,0.28); backdrop-filter:blur(18px)`, inside a `.hero-media` of `width:min(390px,100%)`. It contains, in order: a circular 156px portrait medallion pinned `top:18px; right:-62px` that deliberately overhangs the card and, on card hover, lifts 4px and runs a 1200ms diagonal light sweep across a `::after`; an uppercase gold kicker; a **pure-CSS birthday cake** (220×142: plate, two layers, frosted top with drips, 3 candles with flickering flames, 2 cherries, 2 floating balloons with string, 2 bouncing gift boxes, and the age number); a Playfair `1.48rem` headline; an age line; a **4-column countdown grid** (Days/Hours/Minutes/Seconds, each a 56px-min white-72% tile with a teal number and an uppercase 0.72rem label) ticking every 1000ms; a calendar note; and an action row pairing a full-width primary gradient button with a 92px **CSS gift-box button** (lid, body, cross ribbon, two bows) that floats on a 2.2s loop under a glass "tap here" callout.
> **Hero right — copy column.** `justify-self:end; width:min(620px,100%)`, `text-shadow:0 4px 24px rgba(8,36,58,0.68), 0 2px 8px rgba(8,36,58,0.44)` for legibility over the photos. Gold uppercase eyebrow (`#ffe0a3`) → white Playfair `h1` at **4.8rem** → 1.12rem/800 lede at 92% white → a wrapping row of **8 glass "option" buttons** (`min-height:44px; padding:11px 14px; border:1px solid rgba(255,255,255,0.42); background:rgba(8,36,58,0.28); backdrop-filter:blur(14px); font-weight:900`, hover → `background:rgba(216,138,24,0.32)` + `translateY(-2px)`), each anchor-linking to a section id → a 3-column `<dl>` of glass stat tiles (`background:rgba(255,255,255,0.14)`, Playfair 2rem white `dt`, uppercase 0.82rem `dd`).
> **Entrance stagger:** every hero element gets `.hero-enter` → `opacity:0; transform:translateY(24px); animation: heroEnter 720ms cubic-bezier(0.22,1,0.36,1) forwards; animation-delay: var(--enter-delay,120ms)` where `heroEnter` goes `translateY(26px) scale(0.98) → translateY(0) scale(1)`. Delays: eyebrow 120ms, h1 220ms, lede 320ms, option buttons `360 + index*90`ms, stats 960/1060/1160ms.
>
> **Buttons.** `.primary-action`: `min-height:46px; padding:12px 18px; border-radius:8px; font-weight:800; color:#fff; background:linear-gradient(135deg,#0d3b57,#0f6b78 62%,#1f8c68); box-shadow:0 14px 28px rgba(8,36,58,0.24)`; hover swaps to `linear-gradient(135deg,#08243a,#0d3b57 54%,#d88a18)` and `translateY(-2px)`. `.secondary-action`: white-64% on a `rgba(15,107,120,0.24)` hairline. `.glass-action`: `rgba(8,36,58,0.28)` + `blur(14px)`, hover gold tint. **Every hover on this site is a 180ms ease `translateY(-1px|-2px)` — nothing scales, nothing rotates.**
>
> **Section headings.** `.section-heading` grid, gap 12px, `max-width:820px`, `margin-bottom:32px`; `h2` Playfair **3.25rem**, `display:inline-block`, with a `::before` dark 24×18px butterfly hovering top-right (`headingButterflyDrift 2600ms ease-in-out infinite alternate`) and a `::after` 15px yellow dot bobbing bottom-left, made into a 5-petal flower with four `box-shadow` offsets (`headingFlowerFloat 1900ms ease-in-out infinite`). Recolour per section with `--heading-flower` / `--heading-flower-light`.
>
> **Sections after the hero**, each `.section-band` (`width:min(1180px, calc(100% - 36px)); margin:0 auto`), `padding:84px 0`, `scroll-margin-top:96px`: a 5-column gallery grid (220px tiles, whole tile is a `<button>` opening a lightbox); a 3-card "planned" grid plus a 16:9 YouTube embed; an about section with a horizontal scroll-snap journey carousel (`flex: 0 0 min(330px, 82vw)` cards, `scroll-snap-type:x mandatory`, arrow buttons scrolling by `cardWidth + 16`, cards entering on `journeyCardIn 620ms cubic-bezier(0.22,1,0.36,1)` staggered `index*38ms`, clickable cards opening an inline media preview); a wishes section split `minmax(320px,0.78fr) minmax(0,1.22fr)` (form left, wish wall right); and a gifts section whose right column is a `position:sticky; top:112px` scroll-scrubber that maps its own `scrollTop / (scrollHeight - clientHeight)` onto a weighted list of frames (first frame weighted 1.5×) to cross-fade images.
> **Footer:** a dark rounded panel — `linear-gradient(145deg,#08243a 0%,#0d3b57 44%,#5d3a20 100%)` with two coloured radial overlays and `box-shadow: inset 0 0 70px rgba(8,36,58,0.28), 0 18px 44px rgba(8,36,58,0.16)` — containing a full CSS nature scene (swaying cherry tree, 8 falling petals, 4 white flowers, 3 grass tufts, 3 flowers, 5 butterflies with flapping wings), quote lines, and 3 social links with square coloured icon chips.
>
> **Floating UI.** Back-to-top button fixed `right:18px; bottom:8px` (z 90), hidden by `opacity:0; pointer-events:none; transform:translateY(14px)` until `scrollY > 620`. An 18px cursor-glow dot at z 150 following `pointermove` via `--cursor-x`/`--cursor-y`, fading in on first move. A celebration burst: 128 particles across 8 types (sunflower, rose, three flowers, gift, balloon, sparkle) each with `--x` 0–100vw, `--size` 10–48px, `--duration` 4200–7600ms, `--delay` 0–1100ms, `--drift` ±150px, `--spin` 240–1080deg, falling from `top:-12vh` in a fixed z-120 layer, auto-cleared after 9000ms, with a `gsap.fromTo(".birthday-panel", {scale:0.98}, {scale:1, duration:0.65, ease:"elastic.out(1,0.45)"})` pop. Modals for video / gallery image / personality image / letter, each `role="dialog" aria-modal="true"` with an `X` close button, locking `body.overflow` while open.
>
> **Scroll reveals.** Put `class="reveal"` on content and `reveal slide-heading heading-reveal` on section headings. Set `class="js"` on `<html>`; style `.reveal` as visible by default and only hide it under `.js` (`opacity:0; translateY(26px)`, headings `translateX(∓76px)`). In a `useEffect`, lazily `await import("gsap")` + `gsap/ScrollTrigger`, alternate `.from-right` on every second heading, then `gsap.fromTo` each `.reveal` from `{y:32,opacity:0}` (or `{x:±76,opacity:0}` for headings) with `duration 0.8` / `power3.out` (headings `0.9` / `expo.out`) and `scrollTrigger: { trigger: item, start:"top 86%", toggleActions:"play none none none" }`. Wrap in `gsap.context()` and revert + kill all triggers on cleanup. If the import fails, fall back to an `IntersectionObserver` at `threshold: 0.12` adding `.is-visible` (CSS transition `opacity 640ms ease, transform 640ms ease`).
>
> **Responsive.** Only three breakpoints. **≤1060px**: hero → one column, `.hero-copy { order:-1; width:100%; padding:28px }`, `h1` 4rem, `.hero-media` `min(430px,100%)`, wish/gift layouts to one column, gift scrubber loses `position:sticky`. **≤780px**: mobile nav as described, hero `padding-top:104px; padding-inline:12px`, `h1` 3.1rem, gallery to 2 columns, modals to 90vw/90vh. **≤460px**: tighter padding, smaller type, everything single column. Plus `@media (prefers-reduced-motion: reduce)` disabling ambient loops and reveals.
>
> **Accessibility.** `aria-hidden="true"` on every decorative layer; `aria-expanded`/`aria-controls` on the hamburger; `aria-pressed` + descriptive labels on slide dots; `role="button"` + `tabIndex={0}` + Enter/Space on clickable cards; dropdowns open on `:focus-within` as well as `:hover`; 44px minimum touch targets; `outline:none` always paired with a visible transform or background change.
>
> Do not add a dark mode, do not add a second border-radius, do not swap the palette, and do not replace the CSS-drawn clouds/leaves/birds/cake/gift with images or an animation library — the hand-built CSS scene *is* the design.
