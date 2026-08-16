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
