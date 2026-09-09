# Local design fixes, 7 September 2026

A running ledger of everything changed on this site that the design system
should have supplied, so it can be fed back to Claude Design in one go rather
than one export round per finding. The proper loop is report → Claude Design
fixes → export → release → re-pin. It took the day and got nowhere near a
usable front door, so from the topbar onward the fixes are local and recorded
here. Each entry says what the system does, what this site does instead, and
what Claude Design needs to decide.

Where a fix lives: `src/styles/overrides.css` unless stated, in a block
tagged with the item's number (`ledger 12`). `npm run check:ledger` fails the
build if a block has no number or a number has no entry here, so this list
and the CSS cannot drift (docs/optimisations-2026-09-07.md §4.4). Everything
here is scoped to this product and goes when the system answers it.

Roadmap: the work is ROAD-1367 (Done); taking this ledger to Claude Design
and closing its items is ROAD-1368 (Next). The policy is
[ADR-COM-0005](adr/adr-com-0005-design-deviations-are-ledgered.md).

## Fixed upstream, not deviations

1. **`@contentious/ui` never shipped the marketing kit.** The door import in
   `src/styles/components.css` came after the file's own rules, which is
   invalid CSS, so the whole skill component layer was dropped silently in
   every consumer. Released as v0.14.1. Package bug, Claude Code's side.
2. **This site's markup was off-contract.** `.c-marketing` missing from
   header and footer; an invented `.c-hero__heading` instead of `.c-hero` +
   `.c-hero__title`; a footer built on guessed class names. Brought to
   `guidelines/pattern-com-page.html`. Not a deviation, a correction.
3. **Round 2026-09-07c applied locally** (`npm run design:apply`, stamp
   `1310bf6e38de`): whole-object links opt out of the `a:hover` underline;
   `.c-topbar`/`.c-strip` gain a chrome column. Applied to the working copy of
   `contentious-ui` and copied into this site's `node_modules` by hand.
   **Not yet committed, released or re-pinned.** v0.14.2 changelog and version
   bump are staged in the working copy.

## Deviations on this site

4. **Every container re-pointed to the family's column and contentious.ltd's
   convention.** Two container conventions coexist in the system. The
   library's `.c-section__inner` (80rem), `.c-page` and `.c-footer__in`
   (1080px) put their padding *inside* a max-width box, so the text edge is
   `(100% − box)/2 + padding`. contentious.ltd's `.header-container` and the
   design system's new chrome column put the gutter *outside* the column:
   edge = `max(gutter, (100% − column)/2)`. The two never coincide at any
   width; measured brand 456px vs text 488px at 2192px on the scaffold's
   1280px column. `site.css` now gives `.c-section__inner`, `.c-footer__in`
   and `.c-footer__legal` the ltd convention on `--container-max-width` with
   the topbar's gutter (`--u × 2.22`), and the chrome column then aligns with
   no override on the band. Verified header, body and footer on one edge at
   400, 900, 1280, 1600, 2192 and 5120px; at 2192px the numbers are
   contentious.ltd's own (556 / 1636). This also moves the site from a
   1280px column to the family's 1080px, which the reference page, the footer
   and contentious.ltd already used.
   **Decision needed:** one container convention. The library's three
   inside-padded boxes are Claude Code's to change (`src/`, not the skill),
   but only once the system says which convention is the rule.
   Reported in `contentious-ui/docs/design-system-sync.md` item 6.

5. **Brand in the topbar: Bely Display, 400, `--t-body`.** The system's
   `.c-topbar__brand` is Bely (text) 700 at 1.17u, drawn for the app. This
   site's header carries `.display-heading`, so the display face was
   rendering at 700, synthesised, at 33.7px on a wide monitor beside 17.6px
   nav links. Now the display face at 400, at the body role.
   **Rule to state in the system, prominently:** Bely Display is never bold.
   It has inherent display weight; 700 is always a synthesis. Same rule this
   repo's `CLAUDE.md` already carries for headings.
   **Decision needed:** the front-door brand's face and size, as a rule rather
   than a local override. Size went `--t-body` → `--t-ui` on Julius's call
   (25px on a wide monitor, 21px on a laptop; contentious.ltd's nav links are
   21px and it has no wordmark at all, only a 60px monogram).

6. **`.c-footer__legal` was left-stuck and 46ch wide.** This site had it as a
   `<p>`; `.c-footer p { margin: 0; max-width: 46ch }` outranks
   `.c-footer__legal { margin: … auto; max-width }` on specificity. The
   reference page uses a `<div>`. Markup corrected here.
   **Worth stating in the system:** `.c-footer__legal` is not a `<p>`, or
   the rule should survive one.

7. **Font preloads pointed at files the CSS never used.** `base.css` declares
   `@font-face` against the package's own `fonts/`, which the build hashes
   into `/_astro/`; the scaffold preloaded copies in `public/fonts/`. Two
   unused downloads per page load and no preload of the real files. Now
   preloads the package's URLs via `?url` imports, so dev and build resolve
   to the asset the CSS uses. The flash of fallback on resize was dev-only:
   Vite serves font files `no-cache`, so Chrome revalidated on each
   re-resolution and `font-display: swap` painted the fallback meanwhile;
   the production build makes no font request on resize. Fixed in dev too,
   with a Vite plugin in `astro.config.mjs` that serves `.woff2` immutable;
   the resize probe then records no requests. `public/fonts/` removed.

8. **Density 24px → 20px.** Body copy at 28.8px on a 5K monitor (24px base ×
   1.2 at the top step) read as too big to Julius. CD's position was that the
   conversation is about the base, not the multiplier, and this is that
   conversation: `--base-font-size` and `--marketing-font-size` both 20px on
   `:root` in `site.css`, unlayered so it beats the theme. Body 24px wide /
   22px laptop / 20px phone; hero title 58px; brand and nav 21px. For scale,
   contentious.ltd renders body copy at 36px and its h1 at 115px on the same
   monitor. This repo's `CLAUDE.md` now says 20px. Later the same day, a
   phone step: the package's `--text-multiplier` runs 1 / 1.1 / 1.2 from
   32rem up (`src/styles/typography.css`, library side), so phone and
   laptop text differ by 10% at most; contentious.ltd carries `×0.9` below
   32rem and the package's copy does not. `site.css` adds the same step,
   unlayered. Body copy is then 18 / 20 / 22 / 24px from phone to wide.
   **For the system:** the 0.9 step exists on ltd and not in the package;
   one of them is wrong.
   **Decision needed:** COM's density, in `tokens/products.css` where the
   signature block records it, not in a product override.

9. **Nav links given a type role.** Bare `<a>`s in `.c-topbar__right` sat at
   the body's 17.6px at every width. Now `--t-ui`, the brand's size, so the
   header is one size. The system's `.c-topbar__sections` is 0.94u; the
   reference specimen uses sections plus a `.c-button`, not bare links.

10. **The hero's spacing and heading size follow maturitytool.com.** Measured
    at 2192px: MT's hero sits in the library's `.c-section` (5rem top and
    bottom); eyebrow → heading 24px, heading → lede 24px, lede → button 32px;
    heading 74px at line-height 1.2 (`.type-h1`); artwork fills its grid
    column. The system's `.c-hero` gave 32/48px section padding, 8 / 10 / 18px
    gaps, a 2.4u heading at 1.02 and a fixed 440px image, which read as
    cramped. Now 5rem `padding-block` on the hero band, the three gaps as
    `1.5u / 1u / 1.33u`, the heading at `3.08u` (MT's 74px at u = 24, 67.8px
    at u = 22, so the same responsive step), the image at its intrinsic
    1200px capped by `.c-hero__art img { max-width: 100% }`. Not via the
    library's `.c-section` class, which MT uses: the design system's
    `.c-section` is the app spacer with a 2.33u margin-top, and the two
    definitions collide — the library's pads, the skill's pushes. Worth
    noting as a name clash in its own right. At phone width the system's
    `.c-hero { grid-template-columns: 1fr }` let the title's longest word
    ("organisations," at 61.6px, 431px) widen the page to 476px; `site.css`
    makes the track `minmax(0, 1fr)` below 52rem and hyphenates the title.
    And the title's 3.08u held at every width put the phone heading at 62px
    over eight lines; below 48rem it is now `--t-title` (2.4u).
    **For the system:** `.c-hero`'s single-column track should be
    `minmax(0, 1fr)`; a 1fr track floors at the longest word; and the hero
    title wants a phone size, not one ratio.
    **Decision needed:** whether `.c-hero`'s own rhythm and title size are
    right, given a sibling front door already departs from them this far.
    Later the same day: the art column went from `1.1fr 1fr` to `1fr 1.25fr`
    from 52rem, so the apparatus sits at MT's 576px rather than 491px.

11. **The hero on the chrome's ground.** The page keeps the block's
    limestone-600. Julius wanted the hero paler, and only the hero: Maturity
    Tool's header and hero share one near-white ground with the body darker
    beneath, which is the same shape. First tried on `--surface-chrome`
    (limestone-300): too pale. Now on the block's own `--wash-section`, the
    limestone-400 → 550 gradient, which sits between chrome and page. A
    page-level class, `.hero-band`, in `site.css`. The eyebrow-to-heading
    gap also went from MT's 24px to 1.5u (36px) under the 74px heading.
    **Decision needed:** whether `--wash-section` is the front door's hero
    ground as a rule, and a flat pale band token to pair with the tint if
    the gradient is not wanted everywhere.

12. **Topbar: no hairline, a shadow, sticky.** The system's `.c-topbar` has a
    1px `--rule-field` bottom border, no shadow, and scrolls away. Against
    the paler page the hairline read as a gap. contentious.ltd's header has
    `border-bottom: none`, `box-shadow: rgba(0,0,0,.08) 0 0 7px` and
    `position: sticky`; Maturity Tool's has neither border nor shadow. Now
    `border-bottom: 0; box-shadow: var(--shadow-sm); position: sticky;
    z-index: var(--z-sticky)`.
    **Decision needed:** a chrome shadow token (there is none; `--shadow-sm`
    is the quietest on offer and ltd's 7px/8% sits between sm and md), and
    whether the band is sticky as a rule.

13. **Prose headings in Bely Display.** The library's `.prose h2` and
    `.prose h3` set `--font-heading` (Bely, the text face), unlayered. This
    repo's rule is that every heading is Bely Display at 400, and the
    framework page's generated h2/h3s already were. `site.css` overrides,
    unlayered, for h2 and h3 inside `.prose`. h2 size moved from the
    library's `--font-size-h2` (2.8em × step, 67px on a wide monitor, 0.91 of
    the 74px h1) to `--t-title` (2.4u, 57.6px, 0.78). For reference,
    contentious.ltd's h2 is 0.71 of its h1 and 2.5× body; Maturity Tool's is
    0.8 and 2.95× body, using the system's `.type-h2`. Later (optimisation
    audit §1.2): h3 moved from the library's `--font-size-h3` (1.5em × step,
    36px on a wide monitor) to `--t-section` (30px), so every prose heading
    is on a role.
    **Decision needed:** which face and size `.prose` headings take across
    the suite; `--font-size-h2` and `.type-h2` and `--t-title` are three
    answers to one question.

14. **`.c-button` text vanishes on hover.** Measured: rest `--text-on-accent`
    (limestone-100) on sapling-700; hover `rgb(52,66,48)` (sapling-750, the
    bare `a:hover` colour) on sapling-700, ~1.26:1. The design system's
    `a:hover { color: var(--accent-link-hover) }` is (0,1,1); `.c-button`
    sets `color` only at rest at (0,1,0), and `.c-button:hover` sets only
    `background`. Round 07c's Links-block opt-out fixed `text-decoration` on
    this path and missed `color`. The variants are unaffected because they
    set colour on hover at (0,2,0). `site.css` restates
    `a.c-button:hover, a.c-button:focus-visible { color: var(--text-on-accent) }`.
    **Fix in the system:** `.c-button:hover` declares `color` as well as
    `background`, or the Links-block opt-out covers colour too. The pattern
    page's comment about 1.26:1 was describing this and it is still live.

15. **Text links fade in and thicken on hover.** The system's `a:hover`
    snaps a 2px sunshine underline on with no transition. contentious.ltd's
    link is `text-decoration: none` with a `border-bottom` that grows 0 → 6px
    over `1.5s ease-in-out` (its own `--marketing-transition-slow`; the
    system's slowest token is `--duration-glacial`, 800ms). `site.css` gives
    text links in `.c-marketing-section` and the footer paragraph a 1px
    transparent border-bottom at rest whose colour fades to sunshine and
    whose width grows to 0.2u, both over `--duration-glacial`
    `--ease-in-out` (a border growing from 0 snapped on as a hairline before
    it grew, so the colour fade was added); whole-object links keep the
    system's opt-out. Measured: colour 2% → 9% → 56% → 100% and width
    1 → 2 → 4px over 800ms, unaffected by `prefers-reduced-motion`.
    Then moved off the border: a border changes the box, so on the nav
    links, which are flex items, the text rose as the line grew, and border
    widths step in whole pixels. `text-decoration` was tried next and Chrome
    does not animate `text-decoration-thickness`. Settled on a `box-shadow`
    offset downward, `0 0.2u 0 0`: a bar growing down from under the box,
    colour and thickness both interpolated, nothing moves. Duration doubled
    to `calc(--duration-glacial × 2)` (1.6s, ltd's 1.5s) on Julius's call,
    `--ease-in-out` both ways. Nav links included on his call too; the
    system underlines them on hover anyway. Colour: sapling, not the
    system's sunshine `--link-underline`, on Julius's call: `--sapling-500`
    on the page (a palette stop; no COM semantic token sits at 500) and
    `--accent-link` on the inverse footer, where it resolves to sapling-400.
    **Decision needed:** the brand rule says the sunshine underline is the
    text link's; COM wants the product accent. One or the other, per
    product or for the suite, and a semantic token for the underline if
    it is the accent (the current `--accent-link` is 750, too dark for it).
    Timing made asymmetric on Julius's call: in over `--duration-slow`
    (500ms), out over 1.6s, the in-transition declared on the hover rule.
    Text colour, also his call: body links in the accent itself, `--accent`
    (sapling-700, 5.15:1 on the page ground), hover `--accent-hover`; the
    system's `--accent-link` is sapling-750. On tinted sections sapling-700
    measures 4.11:1 against limestone-750, so there links keep the system's
    `--accent-link` (5.20:1) with `--accent-link-hover` on hover.
    **For the system:** whether a product's text links take its accent
    stop or the darker link stop, and the tint ground's contrast budget.
    **Decision needed:** the link hover as a system rule (motion, thickness,
    and whether ltd's 1.5s wants a token above glacial), and one mechanism —
    border or text-decoration — across the suite.

16. **Body text read heavier than contentious.ltd.** Same face and weight
    (Bely 400). Two differences: COM's `--text-body` resolves to
    `rgb(44,42,41)` (gloaming-700) where ltd's body is `rgb(61,60,58)`
    (gloaming-600); and ltd sets `-webkit-font-smoothing: antialiased`, as
    does the COM reference page's own `body` rule, while the package's
    `base.css` does not, so macOS renders subpixel and heavier. `site.css`
    adds the smoothing. The colour is left at the block's token.
    **This one mattered most.** Julius: "these font settings made a HUGE
    difference", the largest single improvement of the day, from one line
    that every specimen page already had and no consumer did.
    **Decision needed:** font smoothing in `base.css` for the suite, since
    the reference pages are drawn with it and products are not; and COM's
    `--text-body` stop.

17. **Footer on three sizes.** The system's `.c-footer` mixes five: brand
    `--t-section`, group headings `--t-row`, description `--t-hint`, links
    `--t-ui`, legal `0.7u`; and since the brand is a `<p>` (in the reference
    markup too), `.c-footer p` (0,1,1) outranks `.c-footer__brand` (0,1,0),
    so the brand actually renders at `--t-hint`. `site.css`: headings
    `--t-ui`, text and links `--t-hint`, legal the system's own `0.7u`
    (first tried a step larger throughout; the headings read as too big).
    **Decision needed:** the footer's type ladder as a rule, and
    `.c-footer__brand` not being a `<p>` (or `.c-footer p` not setting size).

18. **Footer mark as a block, VTS-style.** CD's note sets the footer mark at
    1.22u (29px) inline with the wordmark and says plainly that at that size
    the apparatus reads as texture. Julius pointed at voicetoneandstyle.com,
    whose footer mark is a 116px block beside the name and description
    (ltd and MT have no footer mark). Now the same shape: a `.footer-brand`
    flex row in the markup, mark at 4.8u (VTS's 116px at u = 24) with the
    name and description stacked to its right. Tried 2.5u inline first.
    **Decision needed:** whether `.c-footer__brand` grows a block variant
    for front doors, given a sibling already ships one.

19. **Favicon cut from Julius's `com-mark`, not the cog.** The package's
    `brand/content-operating-model/` set is cut from `com-cog.png`, on CD's
    argument that the cog is what survives 16px. Julius supplied a new mark
    (`public/images/com-mark.png`) and the site's `favicon.ico` (16/32/48),
    `favicon-32.png` and `apple-touch-icon.png` are now cut from it, plus an
    `icon-512.png` for later. Transparent margins trimmed, padded square.
    **Decision needed:** the brand set in the package follows, or records
    that COM's favicon is the product's own.

20. **Mobile nav: full-screen, limestone on sapling-700, against the
    system's rule.** The system's MobileNav is an app sheet (project
    context, sections, account) whose CSS ships in the package, with no
    trigger class and no stated breakpoint value ("the chrome breakpoint"),
    and whose rule says "never a full-bleed menu page". contentious.ltd and
    contentmaturity.com both have full-screen menus (CM: lucide burger, a
    `sunshine-500/90` overlay, links stacked, pre-design-system on ui
    v0.9.3). Built first as the system's sheet, then rebuilt full-screen on
    Julius's call: fixed overlay on `--accent` with `--text-on-accent`,
    links centred in Bely Display at `--t-section`, the system's own row
    stagger (14px rise, 110ms + 26ms per row), ✕ top-right where the burger
    sits, close on link, ✕ and Escape, body scroll locked, reduced motion to
    opacity at 120ms, `48rem` breakpoint. A `.c-topbar__menu` trigger in
    `site.css` mirrors `.c-msheet__x`. The current page carries the sunshine
    bar. Below 48rem the topbar is forced back to one row and the wordmark
    allowed to wrap beside its mark: the `flex-wrap` patch put the burger
    on a second row under the brand at 400px.
    **Decision needed:** whether the front door's menu is full-screen as a
    rule, given two sibling sites already are and the rule says otherwise;
    a trigger class and a breakpoint token either way.

21. **The footer overflows a phone.** `.c-footer__in` is `grid-template-
    columns: 1fr 1fr` and `.c-footer__groups` is `grid-auto-flow: column`,
    with no media query in the system, so at 400px the link groups ran to
    541px and the document scrolled sideways on every page (found by the
    mobile-nav probe: the overlay measured 541 wide). `site.css` collapses
    both to one column below 48rem, and lets the `nowrap` brand name wrap
    beside the mark, which at 360px was the next 21px of overflow.
    **Fix in the system:** `.c-footer` needs its narrow-width layout; the
    specimen pages are drawn at 1180px and never met it.

22. **Images through `astro:assets`, as contentious.ltd.** The scaffold
    served one 304KB 1200² PNG from `public/` three times (40px header mark,
    115px footer mark, ~575px hero) with no `srcset` and no WebP. ltd uses
    Astro's `<Image>` with `widths` and `sizes`: hashed WebP, lazy, async.
    Same here: the apparatus in `src/assets/`, 1×/2×/3× for the marks, a
    400-1200 range for the hero (eager, `fetchpriority="high"`, it is the
    LCP element), the footer lazy. Not a design deviation; recorded so the
    package's brand assets can note which pipeline products should use.

23. **The social preview image did not exist.** `BaseLayout` sets
    `og:image` and `twitter:image` to `/images/og-default.png` on every page
    and the scaffold never made the file, so shares went out with no image.
    A 1200 × 630 is now in `public/images/`: the apparatus at 520px centred
    on the page ground (limestone-600). Composed mechanically from existing
    assets, not designed.
    **Decision needed:** the product's share card, from Claude Design; this
    is a placeholder that stops the 404.

24. **The hero art breaks out of the column at wide widths.** contentious.ltd
    lets images run past the content column: a `.breakout` utility
    (`width: 160%; margin-left: -30%`, reset below 768px) for centred
    figures, and on its COM resource page a right-hand image overhanging the
    column by a constant 275px from 1600px up. Julius asked for the same on
    the hero. `site.css`: from 52rem, `.c-hero__art` takes a negative right
    margin equal to the room between column and viewport minus the gutter,
    capped at `0.2 × --container-max-width` (216px; an earlier draft of this
    entry said 0.25, the CSS never did), so the art grows past the column as
    the viewport allows and never causes a horizontal scroll. The prose
    figure on the homepage takes the same breakout.
    **Decision needed:** a breakout rule in the system (ltd has one, the
    kit has none), and whether the front-door hero art overhangs as a rule.

25. **The topbar wraps.** `.c-topbar` is `nowrap` because it was drawn at the
    app's 19px; at the front door's size the brand plus links plus a button
    overflow a narrow viewport. `flex-wrap: wrap` with a half-unit row gap,
    the same patch the COM reference page's own stylesheet carries. Was
    listed under "Seen, not changed" without a number; numbered so the CSS
    can cite it.
    **Decision needed:** the marketing nav variant the design round already
    records as a requirement, and what collapses first at narrow widths.

26. **Body text was 17.6px everywhere `.prose` and the roles did not
    reach.** The package's `base.css` sets `body { font-size: 1.1rem }`,
    which is 17.6px of the browser's 16px whatever `--base-font-size` says.
    Measured on `/framework` before the fix: prose paragraphs 22 / 24px,
    every paragraph, `dd` and `td` in the data sections 17.6px, the layer
    stack's `h3` 17.6px (the same as body copy), all of `/toolkit` 17.6px.
    Every "17.6px" in items 9, 10 and 17 is this one cause. Fixed here with
    `.c-marketing-section { font-size: var(--t-body) }`, and, because the
    package's `.prose` sets the unscaled base on the block and scales only
    `p` and `li`, unlayered restatements of `.prose`, `.prose p`, `.prose li`
    and `.prose .c-eyebrow` on the roles, and `.prose .c-eyebrow + h2` with
    no top margin (the package's `.prose h2` 1.5em opened an 86px gap between
    an eyebrow and the heading it labels). After: 24 / 22 / 18px body copy on
    every page and element at wide / laptop / phone.
    **Fix in the system:** `body` derives from the density tokens
    (`--t-body`, or `--u`), and `.prose` stops needing its own anchor.
    Optimisation audit §1.2 and §7.1.

27. **One type scale.** The package ships two: the em-based `type-h1 / h2 /
    h3 / intro / sm` and `--font-size-h*`, anchored to whatever the element
    inherits (17.6px, item 26), and the role scale `--u` / `--t-*`, anchored
    to density. This site used both and they disagreed on one page (prose h2
    52.8px beside `type-h2` 54.2px at 1440). Now the roles only: `.page-title`
    is every page's h1 at the hero title's size (item 10) so the front doors
    match, `.page-lede` is `--t-lede` where `.type-intro` was 1.3em, `.meta`
    is `--t-hint` where `.type-sm` was a fixed 14px, and no `type-*` class
    remains in the markup. Breakpoints are written in range syntax
    (`(width < 48rem)`); 48rem and 52rem are the system's chrome and hero
    breakpoints and have no published token.
    **Decision needed:** retire the `type-*` classes or redefine them on
    `--t-*`; publish the breakpoints as named values. Optimisation audit
    §4.1, §4.2 and §7.2, §7.7.

28. **The eyebrow is sapling-650.** `.c-eyebrow` takes `--accent-link`,
    which COM's signature sets to sapling-750 (6.50:1 on the page): at that
    depth the label reads as near black and the green is lost. Julius asked
    for sapling-650 so the eyebrow is noticeably green. Measured 4.05:1 on
    limestone-600, which is under AA's 4.5:1 for small text; sapling-700 is
    the nearest stop that passes (5.15:1). The deep-surface eyebrow in the
    layer stack is unchanged (`--accent-link-on-deep`, 8 September).
    **Decision needed:** whether the eyebrow gets its own token (an
    `--accent-label`, say) lighter than the link colour, and at which stop,
    given the contrast floor.

29. **Footer text is limestone-750, and the mark gets more right-hand
    space.** `[data-surface="inverse"]` sets `--text-body` to
    limestone-400 (13.03:1 on the footer's gloaming-700 ground); Julius
    asked for it dimmer, at limestone-750 (8.84:1, still well past AA's
    4.5:1). `.footer-brand img` also takes a right margin of `1u`, on top
    of the row's existing `1u` gap, so the mark sits further from the name
    and description beside it. Originally a right padding: the base
    reset's `box-sizing: border-box` let that padding eat into the mark's
    own declared width, narrowing its square into a rectangle that
    `object-fit: cover` then cropped left and right against. Margin
    doesn't touch the content box, so it was the fix as well as the
    intended spacing (item 31 below is the same defect in the header).
    **Decision needed:** none; both are presentational calls with no
    system gap behind them.

30. **The mobile nav (item 20) is now a port of contentious.ltd's, value
    for value, in COM's colours.** Julius asked for ltd's: the burger that
    morphs, larger links, the hover fade, the tinted fill, text further
    from white, and a fade rather than a flash on open. A first pass that
    swapped in system tokens instead (`--accent-hover` as a hover pill,
    `--text-inverse`, a 94% tint, a separate close button) was rejected as
    ugly, and rightly: the brief was to copy what works. So every number is
    ltd's bar the burger's. The fill at 97%; links fading to 0.8 on
    `--marketing-transition-fast`; no current-page mark, because ltd has
    none. The burger is a tenth under ltd's. ltd's, measured on the live
    site, is 28 x 3px lines 6px apart at the top of the page, scaled to
    0.85 on scroll; copied exactly it still read larger to Julius beside
    ltd's, so COM's is 25 x 2.5px lines 5.5px apart, scaled the same way
    (item 32).
    The burger is drawn on the device-pixel grid, which ltd's is not.
    Julius saw the three lines at three thicknesses in Chrome. Measured:
    Chrome snaps every CSS box to whole CSS pixels before scaling, so
    three identical 2.5px spans at fractional positions rendered 6, 4 and
    4 device rows at 2x, and at any fractional scale (page zoom, a scaled
    display) whole-pixel boxes land on different fractions of a device
    pixel and anti-alias unevenly. SVG rects at fractional CSS coordinates
    do the same. What does not: an inline SVG whose coordinate unit is one
    device pixel, with the rects on integer coordinates. Crisp and
    identical at 1x, 1.6x, 2x, 2.2x and 3.2x in headless Chrome. The
    script in `Header.astro` sets the viewBox and rects from
    `devicePixelRatio` (again on resize, which zoom fires); the markup
    carries the 2x values for the frame before it runs. ltd's is even on
    Julius's display by luck of its numbers, which is not a property worth
    copying. The same script places the button: ink centred in the bar
    with its 44px box 32px from the right edge, which puts the ink about
    42px in, on the gutter. Julius set the 32 in devtools by eye once the
    bar started at 81px (item 32); with the 58px bar, ink at 18px (equal
    on three sides) sat too close, the gutter too far and 24px right. The whole control, burger and X alike, is at
    opacity 0.7 on Julius's call so it reads quieter than the wordmark.
    **For the system:** a burger/close control drawn this way, so no
    product has to rediscover it. Colour is the only thing
    mapped by role rather than copied: the fill is `--accent` where ltd's
    is its band colour, and the text is `--surface-page` (limestone-600,
    5.15:1 on sapling-700) where ltd's is its own page cream on sunshine.
    Links are `--t-metric`, a size up from `--t-section` and still a named
    role.
    Two things in ltd's construction turned out to be load-bearing. The
    toggle sits *outside* the sticky header as a fixed element, because the
    header is a stacking context and nothing inside it can rise above the
    overlay; the morph was invisible until the button moved. And the fade
    is a class toggled a frame after opening. The old `<dialog>` used
    `showModal()` and `@starting-style`: the top layer would cover the
    button, and `@starting-style` never parsed as a rule in this cascade
    (confirmed with CDP; the identical block worked on an isolated page),
    which is why it flashed. Now `show()`, with Escape and focus handled in
    the script. A bug fix, not a design question.
    **Decision needed:** the system has no tinted-accent token for a
    full-bleed overlay, so the fill is `color-mix(in srgb, var(--accent)
    97%, transparent)`, ltd's percentage against the token rather than a
    third number. Logged in `contentious-ui`'s `GAPS.md`, 9 September
    2026. Separately, and not a deviation: three products (contentious.ltd,
    contentmaturity.com, COM) now each carry their own copy of this same
    nav with no shared component behind any of them, which item 25 already
    flagged as open. Worth deciding whether it becomes one marketing
    `MobileNav` in `@contentious/ui` before a fourth copy happens.

31. **The header mark cropped top and bottom.** `.c-topbar__brand img` in
    the package sets `height: 1.67u` and nothing else, so width fell back
    to the `<Image>` component's fixed `width="40"` HTML attribute. `--u`
    is not always 24px (the phone step is ×0.9, and the marketing base
    itself is 20px here, ledger 8), so the box went wider or narrower than
    tall while the source mark is square, and `object-fit: cover` cropped
    the top and bottom to fill it. Set both axes off `--u` here, square at
    every width, the same fix as the footer mark's (item 29).
    **Decision needed:** the package's own rule should set both axes, or
    neither and let the `<Image>` component's own width/height attributes
    (which do track a real pixel size, just not `--u`) carry it alone.
    Raised in `contentious-ui`'s `GAPS.md`.

32. **The larger bar, kept throughout; the shrink on scroll tried and
    dropped.** Julius asked for contentious.ltd's shrinking nav and chose
    to start larger and settle on the bar as already tuned. It was built
    on 9 September 2026 (a `--scroll` value from the header script, the
    sizes as `calc()` on it, the burger scaling with it, and an eased
    landing after a page transition, which needed a fixed bar, a
    registered property and two Chrome quirks worked around) and then
    dropped the same day: it buys back 23px on a phone and 28px on a
    desktop once you are reading, and the eased landing never quite read
    as smooth. The rest state is kept as the bar's one size: `1u` padding
    over the system's `0.78u`, a `2.5u` mark over `1.67u` (ltd's 60px
    monogram at the marketing base), the wordmark at `--t-lede` over
    `--t-ui` from 48rem (it holds at `--t-ui` below, where it would wrap
    beside the mark). The `<Image>` is requested at 64px so the 2x source
    covers the mark, and it takes half a unit of right margin on top of
    the brand's gap, on Julius's call (the footer mark takes a whole unit,
    item 29). `scroll-padding-top` keeps anchor targets clear of the
    sticky bar. The code and every measurement, ltd's included, are in
    [docs/plans/shrinking-nav-2026-09-09.md](plans/shrinking-nav-2026-09-09.md)
    for reinstating.
    **Decision needed:** whether the marketing topbar variant (item 25)
    is this size as a rule.

33. **The desktop nav marks the current page with the underline and
    hovers in colour, as contentious.ltd's does.** The nav carried no
    current-page mark. A step in tone was tried first (links at
    `--text-secondary`, the current page at `--text-strong`, hover lifting
    to strong with the underline) and Julius judged it too quiet and
    preferred ltd's pattern, which also keeps the family consistent. So
    the sapling-500 underline the text links share (item 15) now denotes
    the current page, persistent. The links rest on `--text-body` rather
    than the package's link colour (sapling-750, near black, item 28), and
    hover and focus fade them to sapling-650, the eyebrow's stop and the one
    COM green that reads as green; at 21px large text it is well past
    AA's 3:1. The
    underline fades in and out over `--duration-glacial` (800ms; 350ms
    read as too quick to Julius), one duration both ways rather than the
    text links' slow in / glacial out, because it also travels: the nav
    carries `transition:persist` (it is identical on every page) and the
    header script re-marks the current link on `astro:after-swap`, after
    reading a computed style so the re-inserted links have something to
    transition from, so on a page transition the old underline fades out
    as the new one fades in.
    **Decision needed:** the marketing nav variant's current-page mark
    (item 25): ltd's underline, now here too, or something else.

## Removed, on Julius's call

- The tinted "The shape of it" section on the homepage (three layers, seven
  questions, framework version). The framework page carries all of it.
- `public/fonts/`: byte-identical copies of the package's fonts that nothing
  referenced once the preloads pointed at the package (item 7).

## Seen, not changed

- **Marketing nav variant.** Still open in the system; now item 25.
- **Astro dev toolbar.** Switched off in `astro.config.mjs` (optimisation
  audit §3.4).
