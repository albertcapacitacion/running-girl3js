# Experiences

## 2026-08-16 — First prototype setup

- The workspace was empty, so the prototype is intentionally self-contained and data-driven rather than introducing a larger game framework.
- The first level stores obstacle and strawberry placement as plain records. This keeps the fixed tutorial pattern easy to edit and gives future levels a small, stable extension point.
- Placeholder geometry is used for the character, park, rocks, benches, signs, finish line, and strawberries so gameplay timing can be tuned before investing in final art.

## 2026-08-16 — Obstacle collision and teaching snapshot

- Replaced lane-index-only obstacle checks with horizontal overlap checks using the girl’s actual position and obstacle widths. This prevents wide benches and signs from colliding across adjacent lanes.
- Made bench jumping depend on vertical clearance instead of a fixed jump-time window. The clearance was tuned down progressively to make successful jumps more forgiving.
- Increased jump height first by 5%, then by a further 2%, ending at 2.142 units.
- Changed signs from a single center post to two side legs with a central opening. Signs remain slide-only, and their total height was raised to approximately the girl’s standing height so the slide action is visually clear.
- Increased the rock obstacle’s central structure so it is visibly too tall to jump or slide, while keeping its collision behavior unchanged.
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

## 2026-08-17 — Level thumbnail differentiation

- The first thumbnail pass varied mostly by palette, which made the five routes look too similar at a glance.
- Added distinct lightweight visual cues tied to each environment: trees and sun, moon and stars, snow and snowman, rain and buildings, and festival poles with bunting.

## 2026-08-22 — Levels 6–8 course scaling and special hazards

- Kept the first five levels on their existing 30-second and 235-unit completion behavior while giving the new levels explicit 35-second durations and finish distances derived from their configured speed multipliers.
- Added reusable procedural obstacle and collectible families for the beach, Tokyo, and concert themes, with centralized action-class collision profiles and special bridge/spotlight handling.
- The Tokyo bridge uses one opening lane that requires the existing slide action; the concert spotlight moves predictably between lanes and uses its active lane for collision rather than relying on the visible mesh bounds.
- Japanese storefront signs use a small local canvas texture with contextual labels such as 本, 花, 服, カフェ, and 東京, avoiding external assets and runtime services.

## 2026-08-22 — Beach Boardwalk readability pass

- Enlarged and restaged the beach slide hazard so the seagulls read as an obvious overhead flock from the gameplay camera.
- Reworked the beach lounger silhouette with a raised back, pillow, and visible legs, and raised the umbrella to maintain a clearer relationship with the player.
- Added visible water-wave highlights plus procedurally built boats and a small ship inside the camera-readable water margins.
- Added stronger colored donut glazing and sprinkles for chocolate and strawberry variants while keeping all donuts worth one point.
- Replaced the low beach flock presentation with a light-blue airplane silhouette while preserving the established slide collision profile and timing.
- Registered the boats as looping beach decor so they continue moving through the visible water margins instead of remaining too distant or disappearing after one pass.

## 2026-08-22 — Level 6 moving ships

- Replaced the three recycled beach craft with six deterministic decorative ships, three on each water side, positioned at `x = ±15.5` after Playwright camera review.
- Rotated every ship to face the finish direction (`-Z`) and gave each side a staggered departure schedule at 0, 7, and 14 seconds with speeds above the Level 6 auto-run speed.
- Ships now stop at the finish line rather than looping, and their positions are derived from elapsed time so rewind restores the same motion state.

## 2026-08-22 — Level 6 ship visibility and separation

- Removed the Level 6 beach trees so the watercraft remain readable from the gameplay camera across the route.
- Changed all six ships to depart together at the start, with independent deterministic speed sets on the left and right so three ships separate and sail concurrently on each side.

## 2026-08-22 — Level 6 ship convoy visibility correction

- Playwright showed that same-line departures made ships merge within seconds and then disappear into the camera fog.
- Converted the ships to a deterministic three-wave convoy per side: departures at 0, 10, and 20 seconds, starting from a camera-visible approach position, with speeds just above the Level 6 runner speed.
- Extended only the beach fog range so the later convoy members remain readable, while keeping ship positions derived from elapsed time for rewind consistency.

## 2026-08-22 — Level 6 convoy desynchronization and scale pass

- Playwright confirmed that shared departure times and nearly identical speeds made left/right ships appear as synchronized pairs.
- Increased the current ship sizes by another 20% and assigned independent left/right departure schedules and wider speed differences while keeping every speed above the runner speed.

## 2026-08-22 — Level 6 rainbow horizon

- Added a procedural seven-band rainbow with rounded white cloud banks beside the sun, tuned from the supplied reference image.
- Widened and lowered the rainbow so it occupies most of the visible horizon while remaining behind the course and ships.
- Increased all current ship scales by an additional 25% without changing their convoy timing or movement behavior.

## 2026-08-22 — Rainbow horizon depth adjustment

- Moved the rainbow farther back from `z = -92` to `z = -135`, placing it closer to the true horizon so moving ships remain visually separated from the rainbow and course polygons before fading from view.
