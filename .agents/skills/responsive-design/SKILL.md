---
description: Build, refactor, and review responsive web interfaces
  across many viewport sizes, breakpoints, devices, input modes, and
  accessibility settings. Use when implementing CSS layouts, responsive
  components, mobile-first interfaces, design systems, or fixing
  cross-device UI issues.
name: responsive-web-development
---

# Responsive Web Development Skill

## Purpose

Build robust, accessible, maintainable web interfaces that work across a
continuous range of viewport sizes---not just a few named devices.
Prefer fluid layouts and content-driven breakpoints over device-specific
hacks.

## Core principles

1. Mobile-first by default. Start with the narrowest usable layout,
  then enhance it as space becomes available.
2. Content determines breakpoints. Add a breakpoint when the
  current layout no longer works---not because a device is called
  "tablet" or "desktop."
3. Fluid before fixed. Prefer flexible tracks, intrinsic sizing,
  `min()`, `max()`, `clamp()`, percentages, and viewport/container
  units over hard-coded dimensions.
4. No horizontal overflow. Prevent accidental page-level horizontal
  scrolling at all supported widths.
5. Progressive enhancement. The base layout should remain usable
  when advanced CSS features are unavailable.
6. Accessibility is part of responsiveness. Support zoom, larger
  text, keyboard navigation, reduced motion, touch, and different
  input capabilities.
7. Reuse design tokens. Centralize breakpoints, spacing,
  typography, colors, radii, and container widths.
8. Avoid brittle overrides. Organize CSS by component and intent;
  do not accumulate contradictory media queries.

## 1. Responsive design workflow

Before implementation:

- Inspect the existing framework, CSS strategy, design tokens, and
  component conventions.
- Identify the page's content hierarchy and the components that need
  to reflow.
- Identify minimum supported viewport width and any special embedded
  contexts.
- Determine which elements should stack, wrap, scroll, hide, or change
  interaction pattern.
- Check whether the project uses CSS Modules, Sass, Tailwind, vanilla
  CSS, styled-components, or another system. Follow the existing
  approach unless asked to migrate.
- Do not introduce a new CSS framework or reset without a clear
  reason.

During implementation:

- Build semantic HTML and a functional base layout first.
- Use Grid and Flexbox for layout; use positioning only for overlays
  and intentional layering.
- Add fluid sizing before adding breakpoints.
- Introduce the smallest number of breakpoints that solve real layout
  transitions.
- Test intermediate widths, not only common device presets.
- Check long text, translated content, empty states, loading states,
  and unusually large data.

After implementation:

- Test keyboard, touch, zoom, and reduced-motion behavior.
- Inspect overflow and content clipping.
- Verify images, tables, forms, menus, dialogs, and navigation at
  narrow widths.
- Remove obsolete CSS and consolidate duplicate media queries.

## 2. Breakpoint strategy

There is no universal breakpoint set. Use the project's existing design
system where one exists. Otherwise, treat the following as starting
points, not device definitions:

```css
/* Base: narrow layouts, below 36rem (576px) */

/* Larger phones / compact landscape */
@media (min-width: 36rem) {}

/* Tablet portrait / small two-column layouts */
@media (min-width: 48rem) {}

/* Laptop / desktop layouts */
@media (min-width: 64rem) {}

/* Wide desktop layouts */
@media (min-width: 80rem) {}
```

Guidelines:

- Prefer `rem` breakpoints so user font-size preferences are
  respected.
- Use `min-width` queries for a mobile-first cascade.
- Do not create a breakpoint for every device model.
- Add a breakpoint only when content starts to look cramped, overflow,
  or become inefficient.
- Test just below, exactly at, and just above every breakpoint.
- Avoid overlapping ranges unless the distinction is intentional.
- For a one-off component whose layout depends on its own available
  width, consider container queries instead of viewport queries.

Example:

```css
.page-container {
  width: min(100% - 2rem, 80rem);
  margin-inline: auto;
}

.product-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.5rem;
}

@media (min-width: 48rem) {
  .product-layout {
    grid-template-columns: minmax(0, 2fr) minmax(16rem, 1fr);
  }
}
```

## 3. Fluid sizing and typography

Use fluid values when a property should scale gradually instead of
jumping at breakpoints.

```css
:root {
  --space-page: clamp(1rem, 3vw, 2.5rem);
  --text-body: clamp(1rem, 0.95rem + 0.2vw, 1.125rem);
  --text-heading: clamp(2rem, 1.25rem + 3vw, 4rem);
}

main {
  padding-inline: var(--space-page);
}

h1 {
  font-size: var(--text-heading);
  line-height: 1.1;
}
```

Rules:

- Use `clamp(min, preferred, max)` to prevent text or spacing from
  becoming too small or too large.
- Set sensible `min-width: 0` on Grid/Flex children that contain long
  or shrinkable content.
- Use `minmax(0, 1fr)` for flexible Grid tracks to avoid
  intrinsic-content overflow.
- Use `max-width` on long-form text for readable line lengths.
- Do not use `vw` alone for body text; it can become too small or too
  large.
- Avoid fixed heights for content containers. Prefer `min-height` when
  necessary.
- Use `aspect-ratio` for media and cards when a stable proportion is
  useful.

## 4. CSS layout techniques

### Grid

Use CSS Grid for two-dimensional layouts and aligned columns.

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: 1rem;
}
```

Prefer `auto-fit`/`auto-fill` for naturally adapting card collections.
Choose deliberately: - `auto-fit` collapses empty tracks so existing
items can expand. - `auto-fill` preserves empty tracks.

### Flexbox

Use Flexbox for one-dimensional alignment, toolbars, navigation groups,
and wrapping controls.

```css
.toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.toolbar__actions {
  margin-inline-start: auto;
}
```

Always consider what happens when items wrap or when labels become
longer.

### Container queries

Use container queries when a component's layout should respond to its
parent width rather than the browser viewport.

```css
.card-region {
  container-type: inline-size;
}

.profile-card {
  display: grid;
  gap: 1rem;
}

@container (min-width: 32rem) {
  .profile-card {
    grid-template-columns: 8rem minmax(0, 1fr);
    align-items: center;
  }
}
```

Do not add container queries just for novelty. Use them when components
are reused in different-sized regions.

### Positioning and stacking

- Avoid absolute positioning for primary page layout.
- Establish intentional stacking contexts and document `z-index`
  layers with tokens.
- Account for sticky headers and safe-area insets.
- Ensure fixed bottom actions do not cover page content or form
  controls.

## 5. Images, video, and media

- Use responsive image sources (`srcset` and `sizes`) when multiple
  image sizes are available.
- Set `max-width: 100%; height: auto` for intrinsic images.
- Use `object-fit` and `object-position` intentionally for cropped
  media.
- Reserve space with `aspect-ratio` or explicit dimensions to reduce
  layout shift.
- Do not stretch low-resolution images to large display sizes.
- Ensure video and embedded content fit their containers.
- Provide meaningful alternative text for informative images; use
  empty `alt=""` for decorative images.

```css
img,
video,
iframe {
  max-width: 100%;
}

.media-frame {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.media-frame img,
.media-frame video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

## 6. Navigation and interaction patterns

Responsive behavior should preserve access to all functionality.

- Do not hide important navigation without providing an accessible
  alternative.
- If navigation collapses into a menu, implement a real button with an
  accessible name and correct expanded state.
- Support Escape to close dialogs/menus where appropriate, and restore
  focus when overlays close.
- Ensure dropdowns and popovers fit within the viewport.
- Avoid hover-only interactions; touch and keyboard users must have
  equivalent access.
- Make controls comfortably targetable. Aim for approximately 44 × 44
  CSS pixels for primary touch targets where practical.
- Avoid changing interaction patterns solely based on viewport width
  when input capability is the actual distinction.

Use capability queries when appropriate:

```css
@media (hover: hover) and (pointer: fine) {
  .card-link:hover {
    text-decoration: underline;
  }
}

@media (pointer: coarse) {
  .icon-button {
    min-width: 2.75rem;
    min-height: 2.75rem;
  }
}
```

## 7. Forms, tables, and dense content

### Forms

- Use labels that remain visible; do not rely only on placeholders.
- Stack fields on narrow screens and use columns only when they
  improve scanning.
- Keep validation messages close to their fields and allow them to
  wrap.
- Ensure focused controls are not hidden by sticky headers or mobile
  keyboards.
- Use appropriate input types and autocomplete attributes.

### Tables

- Preserve semantic table markup.
- On narrow screens, first consider reducing nonessential columns or
  presenting a clearly labeled alternative view.
- If horizontal scrolling is necessary, constrain it to a wrapper
  rather than the entire page.
- Make the scrollable region discoverable and keyboard accessible.
- Do not convert tables into visually unrelated cards if row/column
  relationships are important.

```css
.table-scroll {
  max-width: 100%;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
}

.table-scroll table {
  min-width: 40rem;
  border-collapse: collapse;
}
```

### Long and untrusted content

```css
.content {
  overflow-wrap: anywhere;
}

.flex-child,
.grid-child {
  min-width: 0;
}
```

Use `overflow-wrap: anywhere` selectively for URLs, identifiers, and
untrusted strings. Do not break ordinary text unnecessarily.

## 8. CSS architecture and maintainability

- Follow the repository's existing naming convention and component
  boundaries.
- Prefer component-scoped styles and predictable class names.
- Keep selectors shallow; avoid deeply nested selectors and
  unnecessary specificity.
- Avoid `!important` except for narrowly justified utility or
  third-party overrides.
- Define design tokens with CSS custom properties.
- Group related media queries near the component or use a consistent
  breakpoint organization.
- Avoid duplicating the same breakpoint logic across many files when a
  shared token or component abstraction is appropriate.
- Do not use CSS hacks based on browser sniffing.
- Remove unused declarations and obsolete breakpoints after
  refactoring.

Example tokens:

```css
:root {
  --container-sm: 40rem;
  --container-md: 48rem;
  --container-lg: 80rem;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;

  --layer-dropdown: 100;
  --layer-sticky: 200;
  --layer-overlay: 300;
  --layer-modal: 400;
}
```

## 9. Accessibility and user preferences

- Use semantic landmarks, headings, buttons, links, and form controls.
- Maintain visible focus indicators; never remove outlines without a
  replacement.
- Ensure text and controls have sufficient contrast.
- Do not communicate state through color alone.
- Support browser zoom up to 200% without loss of content or
  functionality; test reflow at narrow effective widths.
- Respect reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- Consider `prefers-color-scheme` only when the product supports
  automatic theme selection.
- Use `env(safe-area-inset-*)` for edge-to-edge layouts on devices
  with display cutouts.
- Ensure focus is not obscured by sticky or fixed UI.

## 10. Viewport and mobile browser details

Use the standard viewport declaration:

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

Do not disable user scaling with `user-scalable=no` or restrictive
`maximum-scale`.

For edge-to-edge layouts:

```css
.bottom-bar {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
```

Avoid assuming `100vh` always equals the visible mobile viewport. Where
appropriate, use modern dynamic viewport units with a fallback:

```css
.full-screen-panel {
  min-height: 100vh;
  min-height: 100dvh;
}
```

Be cautious with `100vw`, which can include scrollbar width in some
environments and create horizontal overflow. Prefer `width: 100%` for
ordinary containers.

## 11. Browser support and progressive enhancement

- Check the project's supported browser matrix before using newer CSS
  features.
- Use feature queries for optional enhancements when needed:

```css
@supports (container-type: inline-size) {
  /* Optional container-query enhancement */
}
```

- Prefer stable platform features over JavaScript resize listeners for
  layout.
- Use JavaScript only when behavior---not presentation---must change.
- Avoid reading viewport width in JavaScript to duplicate CSS media
  queries.
- If JavaScript must observe element size, use `ResizeObserver` and
  clean up observers correctly.

## 12. Testing and review checklist

Test representative widths, including intermediate values:

- 320-360px: narrow phones
- 375-430px: common phones
- 600-800px: compact tablets and large phones in landscape
- 768-1024px: tablets
- 1280-above: laptops and desktops

These are test samples, not mandatory breakpoint values.

For every page or component, verify:

- No unintended horizontal page scrolling.
- No clipped text, controls, menus, or dialogs.
- Layout works just below and above each breakpoint.
- Long labels, URLs, translations, and large numbers wrap safely.
- Grid and Flex children can shrink (`min-width: 0` where needed).
- Images preserve intended aspect ratio and do not overflow.
- Navigation and all actions work with keyboard and touch.
- Focus indicators are visible and focus is not obscured.
- Forms remain usable with the mobile keyboard open.
- Tables and code blocks have an intentional narrow-screen
  strategy.
- Zoom and larger text do not break the layout.
- Reduced-motion preference is respected.
- Fixed and sticky elements do not cover content.
- No unnecessary breakpoint-specific duplication remains.

Recommended tools: - Browser DevTools responsive mode for viewport and
device emulation. - Playwright or Cypress for viewport-based regression
tests. - Visual regression screenshots at representative widths. -
Automated accessibility checks, supplemented by keyboard and
screen-reader testing. - Real devices for touch, virtual keyboard,
safe-area, and browser-chrome behavior.

Example Playwright viewport test:

```ts
import { test, expect } from "@playwright/test";

const viewports = [
  { width: 320, height: 740 },
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
];

for (const viewport of viewports) {
  test(`page has no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
  });
}
```

## 13. Common anti-patterns

Avoid:

- Designing only for iPhone, iPad, and desktop presets.
- Adding many arbitrary breakpoints without a content-based reason.
- Using fixed pixel widths for major page regions.
- Setting fixed heights on text-heavy cards and panels.
- Using `position: absolute` to arrange the main page.
- Hiding overflow to conceal a broken layout.
- Applying `overflow-x: hidden` to the body as a universal fix.
- Using hover as the only way to reveal actions.
- Using `100vw` for every full-width element.
- Scaling typography with `vw` alone.
- Using JavaScript to detect device names or user agents for layout.
- Making mobile users pinch-zoom because text or controls are too
  small.
- Duplicating desktop markup solely to create a mobile layout, unless
  there is a measured and justified need.

## 14. Expected implementation response

When asked to implement or fix a responsive UI:

1. Briefly identify the layout problem and the intended responsive
  behavior.
2. Inspect existing code and follow the project's conventions.
3. Implement the smallest maintainable change.
4. Explain the breakpoints and why each is needed.
5. State which viewport sizes and interaction modes were tested.
6. Mention any remaining assumptions or limitations.
7. Do not claim tests passed unless they were actually run.

## Definition of done

A responsive implementation is complete when content remains readable,
controls remain usable, and functionality remains available across the
supported viewport range and input modes---with no accidental overflow,
clipping, or inaccessible interactions. The result should use the fewest
practical breakpoints and remain easy to extend.
