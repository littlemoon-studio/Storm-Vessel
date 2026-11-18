# Storm Vessel 3.0: notes for Claude Code

This repo is the Shopify theme for Storm Surf Shop (stormcanada.ca). It's the Vessel theme with Storm customisations.
Shopify is connected to this repo (branch `main`): every push syncs to the "Storm-Vessel/main" theme within about a minute.
Shopify also commits theme-editor changes back to `main`, so **always `git pull` before editing**.

## Workflow
1. `git pull`
2. Make the change and keep it small.
3. `git add -A && git commit -m "<what changed>" && git push`
4. Tell Christina to refresh the theme editor.

Never rename or delete Vessel core files. Prefer adding settings to Storm's own sections over hard-coding values.
JSON templates (`templates/*.json`, `sections/*-group.json`, `config/settings_data.json`) hold merchant content. Only edit them when asked, and keep their structure valid.

## Design system
- **Fonts:** IBM Plex Mono for body and headings, loaded from Google Fonts in `layout/theme.liquid` and set in `assets/storm.css`. Big type is weight 600–700, uppercase, letter-spacing −0.03em. PT Mono (the theme's *accent* font, `var(--font-accent--family)`) is used **only** for product titles, prices and the marquee.
- **Colours (CSS variables in `assets/storm.css`):**
  - `--storm-red` #A90707: main text, lines and links on cream
  - `--storm-deep` #640403: primary buttons, gift card section, section dividers
  - `--storm-cream` #F4F0E7: page background
  - `--storm-paper` #F9F5EE: card background
  - `--storm-sand` #F6E7D2: text on dark backgrounds
  - `--storm-flame` #E62E09: announcement bar
  - `--storm-ember` #E3441D: footer
  - `--storm-night` #1E1E1E: dark panels and tiles
  - `--storm-forest` #08341C: green tile
- **Colour schemes in settings_data:** `scheme-storm-cream`, `-deep`, `-night`, `-flame`, `-ember`.
- **Buttons:** square corners, 49px tall, 14px bold uppercase.
- **Section dividers:** top and bottom borders only, **never left or right** (no lines against the screen edges).
- **Product cards:**
  - 1px #A90707 border, with a 1px line between image and info. Image ratio 303:379.
  - Title is PT Mono 15px. Vendor is 10px uppercase. Price is bottom-left, with colour swatches bottom-right.
  - Swatches show **only when a product has 2 or more colour values**. The "More colours" label is removed.
- **Product page:** only the Colour option renders as swatches. Size and other options stay as dropdowns (patched in `snippets/variant-main-picker.liquid`; the 2+ rule is in `blocks/swatches.liquid`).

## Storm custom files
- **`sections/quick-tiles.liquid`:** row of colour tiles. Each tile has its own caption, title, link and three colours. The row sticks under the header, hides when scrolling down and comes back when scrolling up (setting `sticky`). Used on home and in `templates/collection.holiday|storm|travel.json`.
- **`sections/split-collection.liquid`:**
  - **Desktop:** a dark panel on the left (star with an image or colour fallback, heading, button) and a collection on the right in a 2-column grid that scrolls inside the panel height.
  - **Mobile:** the panel sticks in the top half of the screen while the products scroll underneath.
  - **Heading shape controls** stack the heading like a Christmas tree: word spacing, line height, and tracking and size for each of up to 4 lines.
  - Cards inside use `flush` mode: no outer border, only centre grid lines, but still the image/info line.
- **`snippets/storm-product-card.liquid`:** the card used by the split section.
- **`assets/storm.css`:** global Storm layer (fonts, colours, dividers, card styles).
- **`assets/storm-snap.js`:** soft "magnetic" scroll snap on the home page only. It's tuned in Theme settings → Scroll snap (zone % and duration ms) and turned off when the visitor has asked their device to reduce motion.

## Home page order (`templates/index.json`)
1. Quick tiles
2. Slideshow (1 slide)
3. Featured collection (4-column grid; one swipeable row on mobile)
4. Marquee
5. Split collection
6. Full-width banner with button
7. Gift card (media with content, deep red)

## Pending update (do this first)
The `assets/storm.css` and `sections/split-collection.liquid` that come with this file are newer than the ones in the repo. They add:
- star size and "gap below star" settings
- the heading shape controls (word spacing, line height, tracking and size per line)
- the image/info divider line back on split-section cards

Copy both into the repo, replacing the old ones, then commit `"Split section: tree heading controls, star gap, card divider"` and push.

## Added Nov 2026 (audit fixes)
- **Surfboards are pickup-only** (sold online, never shipped). `snippets/storm-is-pickup-product.liquid` decides what counts (tag `pickup-only` or the collection handles in Theme settings → Storm board pickup). `storm-pickup-notice` is the product/collection banner, `storm-pickup-gate` is the cart panel (terms tick + pickup date saved as cart attributes, blocks Check out; accelerated checkout is hidden on boards and when the gate is active). Pickup window, phone and hours are theme settings.
- **Delivery lines:** `storm-delivery-note` (Canada-only Christmas cutoff + free shipping), `storm-shipping-progress` (cart progress bar). Settings: Storm holiday messaging. Canada only: the shop does not ship to the US.
- **`storm-sticky-atc`:** mobile bar on product pages. Products with options say "Choose options" and scroll to the picker.
- **`storm-snow`:** optional snow canvas, off by default, honours reduced motion.
- **Quick tiles on collection pages:** `templates/collection.json` shows the tiles only on the collections listed in the section setting "Show only on these collections". The current collection's tile is marked.
- **Product variant picker:** `variant_style` in product templates must be `buttons` or `dropdowns` (the snippet now falls back to buttons for anything else). A wrong value hid the size picker in Nov 2026.
- **Colours:** there is one orange now (`--storm-flame` #E62E09; `--storm-ember` is an alias). Text on flame is black for AA contrast. No blue anywhere except Shop Pay.
- Pushing from a non-interactive shell needs: `git -c credential.helper='!gh auth git-credential' push`.
- A local site audit with a progress tracker lives in `audits/` (kept out of git on purpose: it contains sales numbers).
- **Fonts (Nov 2026):** IBM Plex Mono and PT Mono are self-hosted woff2 files in `assets/` and declared in `layout/theme.liquid` (no Google Fonts request). `--font-accent--family` is set to PT Mono in `assets/storm.css`; the Shopify font picker can't supply PT Mono (the `pt_mono_n4` handle is invalid and silently falls back), so don't set it there. Vessel product-card titles and prices are forced to PT Mono 15px with `!important` in storm.css because Vessel's text blocks set their own font at higher priority.
- **Polish layer:** `assets/storm-polish.js` (lazy image fade, loading bar, home section reveals) plus the "Storm polish layer" section at the end of `assets/storm.css` (motion tokens, touch and focus details, parallax). All motion is behind `prefers-reduced-motion`.
- **Magnetic scroll snap is off on purpose.** Don't re-enable it.
- **Cart page ("bag" page):** `sections/main-cart.liquid` adds a delivery-note sub-line, `storm-cart-line-note` per item (via `cart-products.liquid`), `storm-cart-trust` (returns note comes from the `storm_returns_blurb` setting), `storm-cart-empty` (links are hard-coded to the home tile collections) and `storm-cart-sticky` (phone checkout bar that clicks the real button so the board pickup rules still apply). Styles are the last section of `assets/storm.css`. The drawer reuses `cart-products` but keeps its footer compact: shipping progress and the pickup panel are rendered in the scroll area (`in_drawer` param on `cart-summary`).
- **Wetsuit sizing (for refine chips):** thickness is named by the first number (4/3 is a 4mm suit, the second number is the limbs). A 4/3 and a 5/4 of the same suit are separate products.
- **Quick view drawer:** Vessel's quick-add dialog (`snippets/quick-add-modal.liquid`, `assets/quick-add.js`) is restyled in `assets/storm.css` as a right-hand drawer on desktop and a bottom sheet on phones. `snippets/quick-add.liquid` only adds with one tap when the product has a single variant and is not pickup-only; everything else opens the drawer (Vessel's original rule added the first size for any single-option product). The "View full details" link is set in `quick-add.js` when the drawer opens.
- **Refine chips:** `snippets/storm-refine.liquid` (rendered from `variant-main-picker.liquid`) shows sibling versions of a wetsuit, boot or glove as chips (thickness, entry, hood, boot/glove style). It needs the product metafields `collection` (the line), `category`, `thickness` and optionally `fitt`, `entry`, `wetsuit_type`, `boot_style`, `glove_style`; with no line, category or thickness it shows nothing. Siblings come from `templates/collection.storm-json.liquid` (`/collections/all?view=storm-json&filter.p.m.custom...`), and `collection.storm-json-debug.liquid` lists the real metafield keys. Same brand + line + category + fit.
- **Theme editor can revert files:** a Shopify editor save (Nov 2026, by another staff member) once rewrote `assets/storm.css` and the JSON view with stale copies. After any "Update from Shopify" commit, `git diff` it against the previous commit and restore anything that went backwards.
- **Add-ons:** `snippets/storm-addons.liquid` shows 2–3 small extras (in stock, single variant, not boards, not already in the cart) on the cart page, in the drawer scroll area (2 items) and under Add to cart on product pages (`blocks/buy-buttons.liquid`). Server-rendered from the collection handles in Theme settings → Storm add-ons; the Add button posts to `/cart/add.js` and fires Vessel's `cart:update` event so the cart re-renders itself.
- **Two-colour swatches:** `snippets/storm-swatch-split.liquid` turns a colour value like "Black/Red" into a half-and-half swatch when both words are in Theme settings → Storm swatch colours (`name = #hex` per line, or `black/red = #111111 #A90707`). Image swatches are never changed. It only runs where a swatch is linked to the option value (swatch.liquid, filters, storm-product-card).
