---
name: Warm Editorial Executive
colors:
  surface: '#f9f9f8'
  surface-dim: '#dadad9'
  surface-bright: '#f9f9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f3'
  surface-container: '#eeeeed'
  surface-container-high: '#e8e8e7'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#3d4947'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1f0'
  outline: '#6d7a77'
  outline-variant: '#bcc9c6'
  surface-tint: '#006a61'
  primary: '#00685f'
  on-primary: '#ffffff'
  primary-container: '#008378'
  on-primary-container: '#f4fffc'
  inverse-primary: '#6bd8cb'
  secondary: '#ac3400'
  on-secondary: '#ffffff'
  secondary-container: '#fd6b36'
  on-secondary-container: '#5d1900'
  tertiary: '#545c72'
  on-tertiary: '#ffffff'
  tertiary-container: '#6c748b'
  on-tertiary-container: '#fefcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#ffdbd0'
  secondary-fixed-dim: '#ffb59d'
  on-secondary-fixed: '#390c00'
  on-secondary-fixed-variant: '#832600'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f9f9f8'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 34px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 26px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.25rem
  margin-mobile: 1rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system is tailored for personal networking cards and digital bio microsites within Mexico and Latin America. It merges high-level corporate credibility with warm, authentic personal identity. The visual tone departs from cold, generic silicon-valley software, adopting a grounded editorial polish reminiscent of tactile business stationery, high-end hotel concierge directories, and contemporary Mexican architectural elegance.

### Emotional Target
The user experience must evoke:
- **Trust & Closeness:** Approachable professionalism that balances authority with personal warmth.
- **Prestige without Arrogance:** Tactile sophistication, deliberate typographic hierarchy, and generous breathing room.
- **Immediate Utility:** Frictionless contact exchange, rapid action completion (Save Contact / vCard, WhatsApp direct connect, schedule meetings), and responsive tactile feedback.

### Aesthetic Movement
**Warm Editorial Minimalism** infused with **Subtle Tactility**. Interfaces favor soft ivory/cream backdrops over clinical harsh white, deep slate navy text for maximum contrast without visual fatigue, deep emerald jade accents signaling prosperity and stability, and earthen terracotta sparks highlighting high-priority personal actions. Surfaces rely on hairline warm borders, muted surface stacking, and diffused ambient shadows that suggest physical, premium cardstock.

## Colors

The palette balances formal corporate depth with natural warmth. The system defaults to a light ivory mode (`#FAFAF9`) to replicate weighted textured paper, though components seamlessly adapt into deep-slate evening configurations.

### Key Tokens & Functional Mapping
- **Primary (`#0D9488` - Jade Esmeralda):** Represents credibility, growth, and decisive interactions. Used for primary vCard downloads, active network states, and key verification badges. Secondary shade `#059669` functions as hover/active depth.
- **Secondary (`#C2410C` - Terracota Cálido):** Adds regional warmth and emotional energy. Reserved for personal highlights, direct call-to-actions (e.g., "Agendar Cita", WhatsApp direct link), and status notification badges. Accent vibrant shade: `#EA580C`.
- **Tertiary (`#0F172A` - Slate Navy):** The anchor tone. Supplies structural weight for top navigation frames, heavy hero headlines, and authoritative identity tags.
- **Neutral Surface (`#FAFAF9` / `#F5F5F4` - Crema Marfil):** The primary canvas layer. Prevents glare while sustaining high contrast.
- **Neutral Foreground (`#1E293B` - Deep Charcoal):** Body typography, subtle icons, and secondary card titles. Contrast ratio strictly exceeds 7:1 against ivory backgrounds.
- **Subtle Stroke (`#E2E8F0` / `#E7E5E4`):** Soft hairline borders defining card boundaries and interactive targets without visual clutter.

### Semantic Theming Archetypes
1. **Ejecutivo:** Slate Navy dominant, crisp Jade Esmeralda highlights, minimal Terracotta, highly restrained card layouts.
2. **Marca Personal:** Balanced Crema Marfil canvas, strong Jade presence, prominent Terracotta badges and story highlight rings.
3. **Negocio Visual:** Heavy use of media canvases, emerald accent washes, bold action buttons, and product/portfolio grids.

## Typography

Typography centers on **Plus Jakarta Sans**, chosen for its modern humanist geometry, generous counter spaces, and exceptional legibility across dense mobile screens. It delivers authoritative polish at heavy display weights while remaining warm, open, and approachable in standard reading grades.

### Application Rules
- **Name & Title Headers (`headline-xl`, `headline-lg`):** Tight negative letter-spacing ensures solid presence and avoids sprawling onto multiple lines on compact 360px–390px mobile viewports.
- **Bio & Summary Paragraphs (`body-lg`, `body-md`):** Keep line lengths capped between 45 and 65 characters to maximize mobile parsing speed.
- **Action Buttons & Link Badges (`label-lg`, `label-md`):** Bold, deliberate letterform with subtle positive tracking to anchor tactile affordance.
- **Category Overlines & Badges (`label-sm`):** Rendered in uppercase with `0.04em` tracking to introduce editorial structure before content sections.

## Layout & Spacing

The interface is architected around a **Centric Smartphone Container Pattern** (`max-width: 480px`). On mobile devices, the canvas occupies 100% of viewport width with safe-area padding. On desktop and tablet viewports, the card is suspended at the center of an expansive neutral backdrop (`#F1F5F9`), mimicking an interactive premium physical card or live device preview.

### Responsive Rhythms & Grid
- **Mobile Viewport (< 640px):** Single column fluid flow. Internal canvas margin is `1rem` (16px), keeping touch surfaces wide and comfortable.
- **Tablet / Desktop Viewport (≥ 640px):** Floating central phone frame constrained strictly between `420px` and `480px`. Column layouts within modular cards use a 4-column sub-grid with `1rem` gutters for multi-action links and contact tiles.
- **Touch Target Enforcements:** Interactive elements (buttons, link items, icon anchors) must sustain an absolute minimum touch zone of `48px` vertically to accommodate one-handed thumb interaction during in-person networking situations.

## Elevation & Depth

Visual depth is achieved through an authentic stationery hierarchy: soft multi-stop diffusion, warm ambient tinting, and micro hairline strokes that prevent elements from bleeding into the ivory background.

### Elevation Levels
- **Level 0 (Flat Canvas - `#FAFAF9`):** Foundational surface.
- **Level 1 (Resting Action Cards - `#FFFFFF`):** Base layer for contact items, social links, and bio blocks. Defined by a soft perimeter shadow: `0 2px 8px -2px rgba(15, 23, 42, 0.05), 0 1px 3px -1px rgba(15, 23, 42, 0.03)` with a hairline border of `1px solid rgba(226, 232, 240, 0.85)`.
- **Level 2 (Hover / Elevated Links):** Used when the user hovers or taps a link card: `0 8px 20px -4px rgba(15, 23, 42, 0.08), 0 3px 6px -2px rgba(15, 23, 42, 0.04)`. Accompanied by a `-1px` subtle vertical translation.
- **Level 3 (Floating Direct Contact Bars & Bottom Action Sheets):** Permanent floating bottom bar (e.g., "Guardar Contacto" / "Compartir QR") uses backdrop blur: `background: rgba(255, 255, 255, 0.88)`, `backdrop-filter: blur(12px)`, backed by `0 12px 32px -4px rgba(15, 23, 42, 0.12)`.
- **Level 4 (Modals & Full QR Overlay):** Deep presentation layer with an ambient scrim: `rgba(15, 23, 42, 0.65)` blur `4px`, and a card shadow: `0 24px 48px -12px rgba(15, 23, 42, 0.25)`.

## Shapes

The interface embraces organic, friendly roundedness to reflect human approachability and ergonomic handheld comfort without descending into juvenile exaggeration.

### Curvature Guidelines
- **Outer Shell / Card Wrappers:** Styled with `rounded-3xl` (24px) to echo contemporary smartphone corners.
- **Action Buttons & Main Interactive Links:** Use `rounded-2xl` (16px) for generous pill-box balance that fits thumb geometry.
- **Avatar & Media Frames:** Profile avatars default to circular (`rounded-full`) with a `3px` solid `#FFFFFF` ring and a `1px` outer halo. Portfolio previews and company logos utilize `rounded-2xl` (16px).
- **Chips, Category Tags & Status Indicators:** Use `rounded-full` for compact pill badges.
- **Input Fields & QR Containers:** Set to `rounded-xl` (12px) to preserve crisp legibility of QR matrices and clean form alignment.

## Components

### 1. Hero Identity Header
- **Layout:** Vertical stack centered or editorial left-aligned. Contains profile photo (88px to 104px), full name, corporate title, company pill, and short bio (max 160 characters).
- **Badges:** Pronouns and availability status (e.g., "Disponible para proyectos") styled as compact pill chips using subtle emerald backgrounds (`#ECFDF5`) and jade text (`#047857`).

### 2. Primary Action Buttons
- **Primary ("Guardar Contacto" / vCard):** Solid Jade Esmeralda (`#0D9488`), white text, weight 700, min-height 52px. Micro-interaction: scale down to 0.98 on active tap.
- **Secondary ("WhatsApp Directo" / "Agendar"):** High-contrast Terracotta (`#C2410C`) background or solid Slate Navy (`#0F172A`) with tactile icon slot on the left.
- **Tertiary / Outline ("Compartir Perfil"):** 1.5px border of `#0F172A`, transparent background, dark slate text.

### 3. Contact & Social Link Cards
- **Structure:** Full-width mobile row card, min-height 58px. Left slot contains brand or channel icon inside a 40x40px rounded container (`#F1F5F9`). Center slot contains title and optional subtitle (e.g., "LinkedIn" / "12k seguidores"). Right slot displays a subtle chevron or link-out icon (`#94A3B8`).
- **Surface:** White cardstock over ivory background, subtle border, smooth transition to jade border highlight upon touch.

### 4. Direct Quick-Action Grid (Icon Tiles)
- 4-column layout directly beneath the bio for instant access: Call, Email, WhatsApp, Location.
- Circular or squircle icons (48x48px touch targets) with monochrome charcoal styling and micro-labels underneath.

### 5. Floating Bottom Navigation / Action Dock
- Fixed to the bottom of the smartphone viewport. Houses dual actions: "Guardar vCard" (full primary button) and a compact QR toggle button (52x52px icon button).
- Utilizes the frosted glass treatment (`backdrop-filter: blur(12px)`) with top border separation.

### 6. Modal QR Code Exchange
- Centered overlay exhibiting the dynamic vCard QR code. Designed for fast in-person scanning with high screen brightness, high-contrast black matrix on pure white card, and one-tap "Añadir a Apple/Google Wallet" link below.