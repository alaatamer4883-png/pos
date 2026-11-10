---
name: Crimson Precision Console
colors:
  surface: '#111319'
  surface-dim: '#111319'
  surface-bright: '#373940'
  surface-container-lowest: '#0c0e14'
  surface-container-low: '#191b22'
  surface-container: '#1e1f26'
  surface-container-high: '#282a30'
  surface-container-highest: '#33343b'
  on-surface: '#e2e2eb'
  on-surface-variant: '#e7bdb6'
  inverse-surface: '#e2e2eb'
  inverse-on-surface: '#2e3037'
  outline: '#ae8882'
  outline-variant: '#5d3f3b'
  surface-tint: '#ffb4a8'
  primary: '#ffb4a8'
  on-primary: '#690000'
  primary-container: '#c40000'
  on-primary-container: '#ffd1ca'
  inverse-primary: '#c00000'
  secondary: '#c3c6d1'
  on-secondary: '#2c3039'
  secondary-container: '#454952'
  on-secondary-container: '#b5b8c3'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#67f4b7'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a8'
  on-primary-fixed: '#410000'
  on-primary-fixed-variant: '#930000'
  secondary-fixed: '#dfe2ed'
  secondary-fixed-dim: '#c3c6d1'
  on-secondary-fixed: '#181c24'
  on-secondary-fixed-variant: '#434750'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#111319'
  on-background: '#e2e2eb'
  surface-variant: '#33343b'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
  body-lg:
    fontFamily: Manrope
    fontSize: 1rem
    fontWeight: '500'
    lineHeight: 1.5rem
  body-md:
    fontFamily: Manrope
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
  body-sm:
    fontFamily: Manrope
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1rem
  label-numeric:
    fontFamily: Hanken Grotesk
    fontSize: 1.125rem
    fontWeight: '700'
    lineHeight: 1.25rem
    letterSpacing: 0.02em
  label-code:
    fontFamily: Hanken Grotesk
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-compact: 0.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system drives a mission-critical, high-throughput Point of Sale (POS) and multi-line wallet operations console. Tailored for retail tellers, multi-tier agents, and enterprise floor supervisors, the aesthetic emphasizes speed, unyielding reliability, and monetary accuracy.

The visual style blends dark industrial minimalism with tactile precision engineering:
- **Carbon Architectures:** Dense, low-glare dark surfaces minimize teller eye strain during prolonged retail shifts under fluorescent lights.
- **Surgical Accents:** Vodafone Crimson (`#C40000`) is leveraged strictly as an intentional signal—directing immediate focus to primary actions, wallet thresholds, and operational milestones without creating chromatic fatigue.
- **Bilingual Balance:** Parity between Left-to-Right (English) and Right-to-Left (Arabic) counter experiences is engineered through symmetrical optical weight and uniform tabular metrics.
- **Physical POS Ergonomics:** Touch targets and rapid keyboard shortcuts are given equal visual priority, creating a high-assurance tool where every penny, piastre, and millisecond is accounted for.

## Colors

The palette balances deep carbon base layers with pure optical contrasts and regulated status indicators:

- **Primary (`#C40000` / `#E60000` hover):** The authoritative brand anchor. Reserved for final transaction commitments, active wallet selection highlights, and top-tier critical interactions.
- **Neutral Core (`#0F1117` base, `#181C24` raised panels, `#222734` structural boundaries):** Absorbs high ambient retail glare while grounding data tables and digit entry blocks.
- **Pure Surface Insets (`#FFFFFF`):** High-priority thermal receipt previews, physical barcode scanning viewports, and primary customer verification cards switch sharply to pure white containers with carbon text (`#0F1117`) for unmistakable legibility.
- **Status Metrics:**
  - **Success / Liquid (`#10B981` Emerald):** Denotes finalized disbursements, healthy wallet liquidity, and active SIM lines.
  - **Caution / Threshold (`#F59E0B` Amber):** Warns of daily wallet limits approaching, KYC expiration within 48 hours, or pending batch reconciliations.
  - **Locked / Fault (`#EF4444` Crimson Light / `#C40000`):** Indicates rejected transactions, PIN locks, or depleted float reserves.

## Typography

The typographic hierarchy is built on structural exactitude:
- **Headlines & Figures (`Hanken Grotesk`):** Clean, sharp, and geometric. All currency amounts, transaction IDs, phone numbers, and balances must enforce tabular figures (`font-variant-numeric: tabular-nums;`) to prevent layout shifts during live wallet balance calculations.
- **Body & Operational Copy (`Manrope`):** Balanced, open apertures maintain readability across both dense desktop grids and smaller 10-inch counter terminals.
- **Bilingual Typesetting:** English and Arabic share identical vertical rhythmic baselines. System fonts for Arabic automatically harmonize x-height with Manrope and Hanken Grotesk without altering parent container heights.

## Layout & Spacing

A dense, split-pane POS workspace model prioritizes keyboard muscle memory and immediate register scanning:

- **Desktop & Counter Terminals (1024px and above):** A 12-column asymmetric fluid grid. Columns 1–8 manage live transaction pipelines, wallet inventories, and SIM line registries. Columns 9–12 remain fixed as the active register pane, providing an anchored total, denomination tally, and immediate cash-out CTA.
- **Tablets & Handheld POS (under 1024px):** Reflows into a single-column stacked view with a fixed bottom drawer displaying total balance and the primary commitment action.
- **Hairline Boundary Alignment:** Dividers and card frames use ultra-crisp 1px borders aligned strictly to the 4px baseline rhythm (`space-xs` = 4px, `space-sm` = 8px, `space-md` = 16px).

## Elevation & Depth

Visual hierarchy does not use soft or diffused drop shadows. Instead, it relies on physical panel layering and hairline structural boundaries:

- **Layer 0 (Canvas):** `#0F1117`, completely flat.
- **Layer 1 (Panels & Tables):** `#181C24` with a 1px solid border of `#262C38`.
- **Layer 2 (Active Selections & Modals):** `#1F2430` elevated with a 1px solid border of `#363E4F` and an ambient, low-spread dark occlusion shadow (`0 8px 24px rgba(0, 0, 0, 0.45)`).
- **Interactive Focus States:** A deliberate 1px inset glow in Crimson (`rgba(196, 0, 0, 0.6)`) or an outer 2px boundary highlight guarantees fast keyboard-navigation clarity.
- **High-Contrast Surface Contrast:** Pure white inspection sheets (`#FFFFFF`) sit on top of `#0F1117` with sharp edge definition, simulating physical printed bank slips.

## Shapes

In keeping with a high-precision, utilitarian tool, corners are sharp and contained:
- Standard UI modules, inputs, table rows, and keypads use a minimal `0.25rem` (4px) corner radius.
- Modals, popovers, and elevated cash-out drawers scale to `0.5rem` (8px).
- Pills and micro-badges use tight rectangular contours (`0.25rem`) rather than stadium pills, preserving clean tabular lines throughout numeric displays.

## Components

### Buttons & Quick Actions
- **Primary Commitment Button:** Background `#C40000`, text `#FFFFFF`, 4px radius, `font-weight: 700`. Hover state switches to `#E60000`. Active state depresses 1px down. Displays keyboard trigger tags (e.g., `[ENTER]` or `[F12]`) in micro-monospace text.
- **Secondary Action:** Background `#222734`, border `1px solid #363E4F`, text `#E2E8F0`.
- **Destructive / Cancel:** Background `transparent`, border `1px solid #EF4444`, text `#EF4444`.

### Numeric Keypad & Input Fields
- Inputs feature dark slate backgrounds (`#12151D`), razor-thin `#2D3545` boundaries, and high-visibility `#FFFFFF` entry text with `Hanken Grotesk` tabular numerals.
- On error (insufficient float, invalid MSISDN), the boundary flashes `#C40000` with an accompanying inline alert icon.

### Status Badges
- **Active / Verified:** Background `rgba(16, 185, 129, 0.12)`, text `#10B981`, border `1px solid rgba(16, 185, 129, 0.25)`.
- **Near Limit:** Background `rgba(245, 158, 11, 0.12)`, text `#F59E0B`, border `1px solid rgba(245, 158, 11, 0.25)`.
- **Locked / Suspended:** Background `rgba(196, 0, 0, 0.12)`, text `#EF4444`, border `1px solid rgba(196, 0, 0, 0.3)`.

### Multi-Line Wallet & Cashier Cards
- Multi-line account lists use alternating subtle row striping (`#181C24` and `#151820`).
- Selected wallet line items display a 3px vertical left accent bar (right accent bar in Arabic RTL) in `#C40000`.
- Physical receipt panels switch dynamically to `#FFFFFF` background with `#0F1117` monospaced text to preview customer prints accurately.