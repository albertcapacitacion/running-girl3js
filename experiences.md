# Experiences

## 2026-08-16 — First prototype setup

- The workspace was empty, so the prototype is intentionally self-contained and data-driven rather than introducing a larger game framework.
- The first level stores obstacle and strawberry placement as plain records. This keeps the fixed tutorial pattern easy to edit and gives future levels a small, stable extension point.
- Placeholder geometry is used for the character, park, bicycles, benches, signs, finish line, and strawberries so gameplay timing can be tuned before investing in final art.

## 2026-08-16 — Obstacle collision and teaching snapshot

- Replaced lane-index-only obstacle checks with horizontal overlap checks using the girl’s actual position and obstacle widths. This prevents wide benches and signs from colliding across adjacent lanes.
- Made bench jumping depend on vertical clearance instead of a fixed jump-time window. The clearance was tuned down progressively to make successful jumps more forgiving.
- Increased jump height first by 5%, then by a further 2%, ending at 2.142 units.
- Changed signs from a single center post to two side legs with a central opening. Signs remain slide-only, and their total height was raised to approximately the girl’s standing height so the slide action is visually clear.
- Increased the two-wheeled bike obstacle’s central structure so it is visibly too tall to jump or slide, while keeping its collision behavior unchanged.
- The latest teaching snapshot should be stored separately by commit version so future prompting exercises can compare versions without changing the main project.

## 2026-08-16 — Increased tree scale

- Raised and lengthened the park trees so their full silhouette is more than twice the protagonist’s standing height, restoring the intended environmental proportion.

## 2026-08-16 — Slightly easier bench jumps

- Reduced the bench jump clearance threshold by 3%, making successful jumps marginally more forgiving without changing obstacle placement or collision timing.

## 2026-08-16 — Longer crouch window

- Extended the crouch/slide duration by 5%, giving the protagonist a slightly wider timing window to avoid signposts in the side lanes.

## 2026-08-16 — Additional bench jump tolerance

- Reduced the bench jump clearance threshold by a further 3%, adding another small forgiveness adjustment to bench jumps.

## 2026-08-16 — Further bench jump tolerance

- Reduced the bench jump clearance threshold by another 3% to make the obstacle slightly more forgiving.

## 2026-08-17 — Five-level theme and map pass

- Replaced the single level entry point with five compact plain level records so new content can be added by editing data rather than gameplay flow.
- Added an always-unlocked level map, replay support, and next-level progression while keeping the existing movement and collision rules.
- Added night, snow, rain, and festival environments with lightweight procedural weather and decoration; no external assets or runtime services were introduced.
- Added cakes, ice creams, cupcakes, mixed treats, and single-lane cars/trucks using the existing collectible and obstacle interaction categories.
- Kept the speed increase multiplicative at 10% per level (`1.1 ^ levelIndex`) so the progression remains explicit and easy to tune.
- Added explicit geometry/material disposal when rebuilding a level so repeated map selection and replay do not accumulate GPU resources.
- Versioned the service-worker cache after browser QA exposed stale UI being served from the previous cache.

## 2026-08-17 — Detailed character selection pass

- Added two front-facing character portraits to the menu while keeping gameplay characters as Three.js geometry.
- Increased character detail independently from the environment with layered hair volumes, facial features, sweater/collar/tie, skirt pleats and crest, tall socks, and shoes.

## 2026-08-17 — Character selection pass

- Kept character selection separate from level data: a small appearance registry controls skin, hair, and shared clothing while the existing movement and collision model remains unchanged.
- Used lightweight procedural previews and procedural hair geometry, avoiding new assets or dependencies so the game remains Sites-compatible and mobile-friendly.

## 2026-08-17 — Arcade title and progression flow

- Split the entry flow into title, character select, and level select screens so each decision has a single clear action.
- Added the supplied neon logo as a local asset and used the existing theme data to create lightweight level thumbnails without introducing external image dependencies.
- Kept unselected levels visibly dimmed while preserving the selected thumbnail at full brightness for quick recognition on small screens.

## 2026-08-17 — Character 1 portrait balance

- Character 1’s supplied portrait had an opaque dark backdrop and more canvas padding than Character 2, making it appear smaller in the selector.
- Applied a selector-only blend treatment and independent scale so the backdrop visually disappears against the panel while the figure occupies comparable space; gameplay assets remain unchanged.
- Replaced the blend-only workaround with a dedicated transparent cutout asset after desktop and mobile review showed the original red studio backdrop was still visible.
