# The shrinking nav, kept for reinstating

Built and removed on 9 September 2026 (ledger item 32 in
[design-deviations-2026-09-07.md](../design-deviations-2026-09-07.md)).
The bar started a step larger and eased to the tuned size over the first
200px of scroll, as contentious.ltd's does, and after a page transition
eased from where the old page left it to where the new page starts.
Julius dropped it: it buys back 23px on a phone and 28px on a desktop
once you are reading, and cost a fixed header, a registered property, a
settle script, JS-measured page padding and a moment on every navigation
that never quite read as smooth. The larger bar is kept throughout.

Everything below is the code exactly as it stood when removed, so it can
be pasted back. The findings at the end are the part that took the day.

## CSS (`src/styles/overrides.css`)

Top-level, before the Chrome `@layer components` block:

```css
/* ledger 32: --scroll registered as a number so it can transition. On a
   page transition the header script lands the new page with the old
   value, then eases it to the new page's over --motion-overlay under
   .is-settling, so a click from halfway down one page opens the bar up
   smoothly on the next rather than snapping it in the crossfade. Normal
   scrolling never carries the class, so it stays instant. @property is
   top-level and unlayered because it is not a style rule. Browsers
   without it (Safari before 16.4) snap, as before.

   Two Chrome quirks shape the form. A transition of --scroll on html
   eases the value (the burger script reads it back each frame) but does
   not re-style descendants, so the bar snapped; and transitioning
   --scroll on the bar's descendants had them chase the bar's inherited
   value frame by frame, lagging it by a whole transition. So the bar,
   the brand and the mark transition their real properties instead, in
   step, from the one jump --scroll makes on the root. */
@property --scroll {
  syntax: '<number>';
  inherits: true;
  initial-value: 0;
}

html.is-settling {
  transition: --scroll var(--motion-overlay);
}

html.is-settling .c-topbar {
  transition: padding var(--motion-overlay);
}

html.is-settling .c-topbar__brand {
  transition: font-size var(--motion-overlay);
}

html.is-settling .c-topbar__brand img {
  transition: height var(--motion-overlay), width var(--motion-overlay);
}
```

In the Chrome block, the bar is fixed rather than sticky (ledger 12's
rule takes `position: fixed; top: 0; inset-inline: 0;`) and the page is
padded by its rest height:

```css
  /* ledger 32: fixed rather than sticky, with the page padded by the bar's
     rest height (1u padding each side plus the 2.5u mark), so the bar's
     size changes as it shrinks, and above all its 350ms ease after a page
     transition, relayout the bar alone and not every page beneath it:
     animating a sticky bar's padding reflowed the whole document each
     frame. Identical at rest and scrolled to what sticky gave.
     scroll-padding keeps anchor targets clear of the scrolled bar
     (0.78u padding each side plus the 1.67u mark, and half a unit of
     air). */
  body {
    padding-top: calc(var(--u) * 4.5);
  }

  html {
    scroll-padding-top: calc(var(--u) * 3.73);
  }
```

And the sizes themselves, replacing the static large-bar rules:

```css
  /* ledger 32: the bar shrinks as you scroll, as contentious.ltd's. The
     script writes --scroll (0 at the top, 1 after 200px) and each size is
     a calc() between its rest and scrolled value on it. ltd drives the
     same thing through a paused animation's negative delay, which was
     tried here first; Chrome does not re-seek a paused animation when the
     delay changes through a transition, so the eased landing after a page
     transition (above) needs the calc form, and --scroll being registered
     makes calc() on it re-evaluate every frame. The scrolled state is the
     bar as tuned above (0.78u padding, 1.67u mark, --t-ui wordmark); the
     rest state is a step larger: 1u padding, a 2.5u mark (ltd's 60px
     monogram, and its 0.65 shrink is 1.67u to the pixel), the wordmark at
     --t-lede. The wordmark holds at --t-ui below 48rem so it never
     re-wraps beside the mark mid-scroll. */
  .c-topbar {
    padding-block: calc(var(--u) * (1 - 0.22 * var(--scroll)));
  }

  .c-topbar__brand img {
    height: calc(var(--u) * (2.5 - 0.83 * var(--scroll)));
    width: calc(var(--u) * (2.5 - 0.83 * var(--scroll)));
  }

  @media (width >= 48rem) {
    .c-topbar__brand {
      font-size: calc(var(--t-lede) * (1 - var(--scroll)) + var(--t-ui) * var(--scroll));
    }
  }
```

## Script (`src/components/Header.astro`)

The burger's `draw()` scaled the icon with the bar (ltd scales its toggle
to 0.85) and corrected the page padding where the wordmark wraps taller
than the mark. The parts that differ from the static version:

```ts
  let settling = false;
  const draw = () => {
    const { trigger, icon, bar } = find();
    const d = devicePixelRatio;
    document.documentElement.style.setProperty('--dpx', `${1 / d}px`);
    if (!icon || !trigger) return;
    // Read --scroll back rather than scrollY so the burger follows the bar
    // while --scroll is easing on the root after a page transition.
    const scroll = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--scroll')) || 0;
    const s = 1 - 0.15 * scroll;
    // On the grid at rest; fractional while easing after a page
    // transition, so the icon glides rather than stepping a device pixel
    // at a time, and snaps back when the ease ends.
    const snap = settling ? (n: number) => n : Math.round;
    const box = Math.round(44 * d);
    const line = snap(2.5 * s * d);
    const gap = snap(5.5 * s * d);
    const width = snap(25 * s * d);
    const pitch = line + gap;
    const inset = snap((box - width) / 2);
    const top = box / 2 - line / 2;
    // ... viewBox, rects and the button's top/right as in the static version ...
    if (bar) {
      // The page is padded by the bar's rest height (ledger 32). The CSS
      // value assumes the mark sets that height; on a very narrow screen
      // the wordmark wraps taller than the mark, so measure: rest padding
      // is 1u each side, recovered from the current padding and --scroll.
      const u = parseFloat(getComputedStyle(bar).paddingTop) / (1 - 0.22 * scroll);
      const text = bar.querySelector<HTMLElement>('.c-topbar__brand span')?.offsetHeight ?? 0;
      const rest = `${Math.round(2 * u + Math.max(2.5 * u, text))}px`;
      if (document.body.style.paddingTop !== rest) document.body.style.paddingTop = rest;
    }
  };
  // --scroll drives the bar's shrink (ledger 32): 0 at the top, 1 after
  // 200px, as contentious.ltd. The burger re-centres in the shrinking bar.
  let current = 0;
  const progress = () => {
    current = Math.min(scrollY / 200, 1);
    document.documentElement.style.setProperty('--scroll', String(current));
    draw();
  };
  // After a page transition the bar eases from where the old page left it
  // to where the new page starts, instead of snapping in the crossfade
  // (ledger 32). The old value is set first and a style read commits the
  // bar's old sizes, so the jump to the new value transitions the bar's
  // padding, the mark and the wordmark under .is-settling, and --scroll
  // itself on the root for the burger, which is redrawn each frame until
  // the transition ends.
  const settle = () => {
    const root = document.documentElement;
    const from = current;
    root.style.setProperty('--dpx', `${1 / devicePixelRatio}px`);
    root.style.setProperty('--scroll', String(from));
    getComputedStyle(find().bar ?? root).paddingTop;
    root.classList.add('is-settling');
    settling = true;
    progress();
    const tick = () => { draw(); if (settling) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
    const done = () => { settling = false; root.classList.remove('is-settling'); draw(); };
    // Only --scroll's own end counts: the menu's fade bubbles here too.
    const ended = (e: TransitionEvent) => {
      if (e.target !== root || e.propertyName !== '--scroll') return;
      root.removeEventListener('transitionend', ended);
      done();
    };
    root.addEventListener('transitionend', ended);
    setTimeout(() => { root.removeEventListener('transitionend', ended); done(); }, 500);
  };
```

Wiring: `init()` called `progress()` instead of `draw()`;
`document.addEventListener('astro:after-swap', settle)` replaced the
static version's restore; and
`addEventListener('scroll', progress, { passive: true })` was registered
alongside `resize`.

## What was measured, so it need not be measured again

- ltd's live values: `--scroll = min(scrollY / 200, 1)`; header 92px
  resting to 76px scrolled; toggle 28 x 3px lines on a 9px pitch, scaled
  to 0.85 (23.8 x 2.55, 7.65 pitch); ink 40px from the right edge at
  390px wide.
- COM as built: bar 81 → 58px on a phone (mark 45 → 30), 99 → 71 on a
  desktop (mark 55 → 37, wordmark 24.2 → 19.4px). Burger 25 x 2.5 on an
  8px pitch, scaled to 0.85, centred in the bar at every step.
- The settle eased bar, mark, wordmark and burger together and finished
  at about 350ms. With the bar sticky, frames dropped (the whole document
  reflowed each frame); fixed, frame gaps held at 15–19ms on the
  framework page with none over 25ms.
- Chrome quirks, all confirmed by per-frame sampling: a paused animation
  is not re-sought when its `animation-delay` changes through a
  transition; descendants are not re-styled while an inherited registered
  property animates on an ancestor; descendants transitioning the
  inherited value themselves chase it a frame behind, a whole transition
  late. Hence real-property transitions from one `--scroll` jump.
- At 320px the wordmark wraps to three lines and the bar is 107px, so a
  CSS-only `4.5u` page padding overlaps by 26px; the script's measured
  padding covers it.

## To reinstate

1. Paste the three CSS blocks back where the comments say, and make
   ledger 12's bar `position: fixed; top: 0; inset-inline: 0;`.
2. Restore the script parts above and the wiring.
3. Reinstate ledger item 32's fuller text from git history (this file's
   commit) and re-run `npm run lint`, then the measurements above.
