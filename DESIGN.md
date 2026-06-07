---
name: State Shift
description: A 2-minute mental reset for adults catching a bad moment
colors:
  charred-bark: "#292524"
  charred-bark-hover: "#44403c"
  ember-stone: "#57534e"
  warm-flint: "#78716c"
  pebble-dust: "#a8a29e"
  stone-border: "#e7e5e4"
  still-air: "#f5f5f4"
  warm-cream: "#faf8f5"
  lifted-white: "#ffffff"
  settle-green: "#d1fae5"
  settle-green-ink: "#059669"
typography:
  display:
    fontFamily: "Lora, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(1.875rem, 5vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Lora, Georgia, 'Times New Roman', serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'DM Sans', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'DM Sans', system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
  caption:
    fontFamily: "'DM Sans', system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.1em"
rounded:
  sm: "6px"
  xl: "0.75rem"
  "2xl": "1rem"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  "2xl": "40px"
components:
  btn-primary:
    backgroundColor: "{colors.charred-bark}"
    textColor: "{colors.warm-cream}"
    rounded: "{rounded.2xl}"
    padding: "16px 20px"
  btn-primary-hover:
    backgroundColor: "{colors.charred-bark-hover}"
  btn-primary-disabled:
    backgroundColor: "{colors.still-air}"
    textColor: "{colors.pebble-dust}"
  btn-choice:
    backgroundColor: "{colors.lifted-white}"
    textColor: "{colors.ember-stone}"
    rounded: "{rounded.xl}"
    padding: "16px 8px"
  btn-choice-selected:
    backgroundColor: "{colors.charred-bark}"
    textColor: "{colors.warm-cream}"
  btn-choice-muted:
    backgroundColor: "{colors.still-air}"
    textColor: "{colors.ember-stone}"
  input-search:
    backgroundColor: "{colors.lifted-white}"
    textColor: "{colors.ember-stone}"
    rounded: "{rounded.xl}"
    padding: "10px 16px"
---

# Design System: State Shift

## 1. Overview

**Creative North Star: "The Quiet Coach"**

State Shift does not try to make you feel better with words. It hands you one concrete thing to do, waits calmly, and steps back. The design follows the same principle: nothing performs. Type carries the weight; spacing communicates calm; surfaces sit quietly until touched.

The aesthetic is warm editorial — closer to a quality independent magazine than a wellness product. The background is never pure white: it carries a trace of warmth that makes reading feel less clinical. The type stack is deliberate: Lora for the moments that need presence (titles, CTAs), DM Sans for everything that needs to step back (body, labels). The whole system works at the pace of breath, not notification.

This system explicitly rejects: pastel wellness gradients, dark mode with glowing accents, rounded bubbly playfulness, clinical or medical UI, and the full AI slop palette — cyan, purple-to-blue gradients, glassmorphism. If it looks like Headspace or a SaaS onboarding flow, it is wrong.

**Key Characteristics:**
- Typography-first: Lora headings carry authority; DM Sans body disappears into readability
- One primary action at a time, always full-width, always at the bottom
- Tonal elevation over shadows: white surfaces lift naturally against the cream field
- Warm stone neutrals throughout; emerald appears only at the single completion moment
- Motion is functional, not decorative: entrance fades, contextual slides, one celebrate-worthy pop

## 2. Colors: The Warm Stone Palette

A restrained stone palette grounded in a warm cream field. One dark anchor, no accent color in the conventional sense — the depth of Charred Bark is the accent.

### Primary
- **Charred Bark** (#292524): The single dark anchor. Used exclusively for: primary CTA background, selected feeling tiles, selected feedback/intensity buttons, heading text. Its rarity is the point; nothing else on screen approaches this depth.

### Neutral
- **Ember Stone** (#57534e): Body text, form labels, secondary copy. The workhorse. Always readable against cream and white; never quite black.
- **Warm Flint** (#78716c): Muted contexts: timer progress fill, focus ring, progress-dot active state, disabled hint text hover. Also the color of unselected button text in muted contexts.
- **Pebble Dust** (#a8a29e): Disabled text. Communicates unavailability without harshness.
- **Stone Border** (#e7e5e4): Input borders, unselected chip outlines, timer track ring. The system's only border color.
- **Still Air** (#f5f5f4): Inactive choice button backgrounds (intensity, muted variants), disabled CTA background. One step lighter than Stone Border.
- **Warm Cream** (#faf8f5): Page background. The foundational warmth of the system. Never pure white; always carries the trace of warmth.
- **Lifted White** (#ffffff): Input fields, unselected feeling tiles, search field. Sits on Warm Cream to create tonal lift without shadows.

### Secondary (completion only)
- **Settle Green** (#d1fae5): Success state background for the completion checkmark. Appears exactly once per session.
- **Settle Green Ink** (#059669): Completion checkmark stroke. Paired only with Settle Green.

### Named Rules
**The Charred Bark Rule.** Charred Bark appears on at most one CTA and one set of selected states per screen. It is the only value that approaches true dark. Do not introduce a second dark color or a competing accent.

**The No-White-Background Rule.** The page background is #faf8f5, not #ffffff. Lifted White (#ffffff) is a surface color reserved for interactive components (inputs, unselected tiles). Never use it as a page background.

## 3. Typography

**Display / Headline Font:** Lora (Google Fonts), Georgia fallback, weights 400/500/600
**Body / UI Font:** DM Sans (Google Fonts), system-ui fallback, weights 400/500

**Character:** Lora brings editorial gravity — it is a contemporary serif with bracketed serifs and moderate contrast, warm but not nostalgic. DM Sans is a low-contrast geometric humanist that reads quickly at small sizes without feeling tech-forward. The combination is a quiet contrast: serif for presence, sans for utility.

### Hierarchy
- **Display** (Lora, 600, clamp(1.875rem, 5vw, 2.25rem), line-height 1.3, tracking -0.02em): Intervention titles, onboarding headings. The dominant voice on each screen.
- **Headline** (Lora, 600, 1.5rem, line-height 1.3, tracking -0.02em): Feeling picker primary heading ("How are you feeling right now?").
- **Body** (DM Sans, 400, 1rem, line-height 1.6): Intervention instructions, onboarding copy. Max line length 65ch enforced by single-column layout.
- **Label** (DM Sans, 500, 0.875rem, line-height 1.4): Form section labels ("How did that feel?", "How intense?"), button text, search placeholder.
- **Caption** (DM Sans, 500, 0.75rem, tracking 0.1em, uppercase): Intervention type badge ("PHYSIOLOGICAL", "GROUNDING"). This is the only uppercase context in the system.

### Named Rules
**The Serif Gate Rule.** Lora is used only for content headings (h1, h2) and never for button text, labels, or body copy. DM Sans handles all UI chrome. The contrast between the two is load-bearing.

**The Uppercase Scarcity Rule.** Uppercase appears in exactly one context: the intervention type caption. Do not introduce uppercase in buttons, nav, labels, or headings.

## 4. Elevation

This system is flat by design. There are no box-shadows anywhere in the codebase, and none should be introduced. Depth is communicated entirely through tonal layering: Lifted White (#ffffff) components sit on the Warm Cream (#faf8f5) field, creating a perceptible but subtle lift without any shadow artifact.

The absence of shadows is intentional and carries meaning: the interface does not dramatize itself. Shadows would imply urgency or hierarchy that this product explicitly rejects.

### Named Rules
**The Flat-By-Default Rule.** No surface in this system casts a shadow at rest. Do not introduce box-shadow for depth, hover lift, or card definition. Use tonal contrast (Lifted White on Warm Cream) if separation is needed.

**The One-Layer Rule.** There is one level of surface lift: Warm Cream (ground) and Lifted White (surface). Do not nest Lifted White on Lifted White. Nested surfaces are always wrong here.

## 5. Components

### Buttons (Primary CTA)
Tactile and deliberate. Full-width, centered at the bottom of each screen. One visible at a time.

- **Shape:** Generously rounded (1rem / rounded-2xl). Confident without being bubbly.
- **Primary:** Charred Bark (#292524) background, Warm Cream (#faf8f5) text, 16px vertical padding, DM Sans 500.
- **Hover:** Charred Bark Hover (#44403c). Subtle lightening, no scale change.
- **Active:** scale(0.98) transform, 100ms. Confirms the tap without drama.
- **Disabled:** Still Air (#f5f5f4) background, Pebble Dust (#a8a29e) text, cursor not-allowed. No opacity trick.
- **Focus visible:** 2px solid Warm Flint (#78716c), 3px offset, 6px radius.

### Choice Buttons (Feelings / Feedback / Intensity)
The system's secondary interactive surface. Used in grids and rows for discrete selections.

- **Shape:** Slightly tighter radius (0.75rem / rounded-xl).
- **Unselected (bordered variant, feeling tiles):** Lifted White (#ffffff) bg, Stone Border (#e7e5e4) border, Ember Stone (#57534e) text. Hover: Still Air (#f5f5f4) bg.
- **Unselected (muted variant, intensity):** Still Air (#f5f5f4) bg, no border, Ember Stone text. Hover: slightly darker Still Air.
- **Selected (both variants):** Charred Bark (#292524) bg, Warm Cream (#faf8f5) text. Selection state matches the primary CTA exactly, reinforcing the single dark anchor rule.
- **Active:** scale(0.95), faster than the CTA.

### Search Input
- **Shape:** Rounded-xl (0.75rem), full-width.
- **Style:** Lifted White (#ffffff) bg, Stone Border (#e7e5e4) border (1px), Ember Stone (#57534e) text, Pebble Dust placeholder.
- **Focus:** 2px Warm Flint (#78716c) ring, 3px offset, radius 6px. Border remains; ring adds on top.

### Timer (Signature Component)
A circular SVG countdown ring — the only non-text visual element in the system.

- **Track:** Stone Border (#e7e5e4) ring, 4px stroke, 28px radius on 64x64 viewBox.
- **Fill:** Warm Flint (#78716c) ring, same stroke. Animates with `transition-all duration-1000` for a smooth second-by-second crawl.
- **Numeral:** Lora or DM Sans 500 (centrally positioned), Ember Stone (#57534e) color.
- **Start state:** Pill button, Still Air (#f5f5f4) bg, rounded-full, with an inline SVG play icon (no icon font).
- **Completion state:** Emerald check icon in a Settle Green (#d1fae5) circle, `animate-pop-in` entrance, animated SVG path draw.

### Progress Indicator (Onboarding)
- **Style:** Horizontal pill row, centered. Active: 24px wide (w-6), Warm Flint (#78716c). Inactive: 6px wide (w-1.5), Stone Border (#e7e5e4). Both 6px tall (h-1.5), rounded-full.
- **Transition:** Width and color via CSS transition, 150ms.

## 6. Do's and Don'ts

### Do:
- **Do** use Warm Cream (#faf8f5) as the page background. Never pure white (#ffffff) for the root surface.
- **Do** keep one full-width primary CTA pinned to the bottom of each screen. Never two primary actions visible simultaneously.
- **Do** use Lora exclusively for h1/h2 content headings. DM Sans for all UI chrome.
- **Do** use the uppercase caption style (DM Sans 500, tracking-widest) only for the intervention type label. Nowhere else.
- **Do** communicate selection state using the Charred Bark fill (matching the primary CTA). Selection and action use the same visual language.
- **Do** use expo easing (`cubic-bezier(0.16, 1, 0.3, 1)`) for all entrance animations. No bounce, no elastic.
- **Do** respect `prefers-reduced-motion`: all entrance animations must have a `@media (prefers-reduced-motion: reduce)` no-op fallback.
- **Do** keep focus rings: 2px solid #78716c, 3px offset, 6px radius. Never remove `:focus-visible` styles.

### Don't:
- **Don't** use pastel gradient wellness aesthetics (Calm, Headspace palette). No gradient backgrounds, no soft blob shapes, no pastel pinks or lavenders.
- **Don't** use dark mode or dark surfaces with glowing or neon accents. This is a light-mode-only system.
- **Don't** use rounded-bubbly playfulness: no bouncing animations, no elastic easing, no oversized emoji-as-illustration approach.
- **Don't** use clinical or medical UI patterns: no alert banners styled like hospital warnings, no red-dominant error states, no sans-serif-only cold layouts.
- **Don't** use the AI slop palette: no cyan accents, no purple-to-blue gradients, no glassmorphism (backdrop-filter blur used decoratively).
- **Don't** use box-shadows for depth or card lift. The system is flat. Tonal contrast only.
- **Don't** introduce a second dark color or competing accent alongside Charred Bark. It is the only deep value.
- **Don't** nest Lifted White surfaces on Lifted White. One layer of lift above Warm Cream is the limit.
- **Don't** use uppercase for anything other than the intervention type caption.
- **Don't** use `border-left` greater than 1px as a colored accent stripe on cards, callouts, or list items. Use full borders, background tints, or nothing.
