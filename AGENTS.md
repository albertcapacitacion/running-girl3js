# Project Rules

## Releases

- Releases are append-only. Never overwrite, delete, or refresh an existing release folder.
- Every new release must use a new versioned or dated folder under `releases/`.
- Each release must remain standalone, including its own launcher/server file and all runtime assets or dependencies it needs.
- Before creating a release, verify that the destination folder does not already exist. If it does, choose a new release folder instead.


---

# Procedural Three.js Asset & Collision Quality Standard

When creating or modifying procedural Three.js assets for this game, treat both **human visual recognizability** and **predictable collision behavior** as hard acceptance criteria.

An obstacle is not complete merely because:

* its component geometry is technically correct, or
* collision detection technically fires.

Every obstacle must visually communicate what it is and what action the player should perform, and its collision volume must consistently honor that expectation.

The target audience is approximately **4–6 years old**, so clarity, predictability and fairness are more important than realism.

## 1. Priority order

For every obstacle, optimize in this order:

1. **Recognizability from the gameplay camera**
2. **Clear communication of the required player action**
3. **Collision fairness and consistency**
4. **Consistency with the game's procedural visual style**
5. **Realism**

A stylized or exaggerated asset that immediately communicates its gameplay purpose is preferable to a realistic asset that is visually ambiguous.

## 2. Human recognizability is mandatory

Do not consider an asset complete merely because its procedural geometry contains technically correct components.

A typical human viewer should be able to immediately identify the object from the **actual gameplay camera and at normal gameplay scale**.

Evaluate:

* overall silhouette
* proportions
* defining features
* negative space
* color separation
* scale relative to the player
* readability from the gameplay camera
* readability while moving

Prefer a slightly exaggerated recognizable shape over geometrically realistic but ambiguous geometry.

## 3. Example — bicycle

A bicycle should not simply contain two wheels and some bars.

It should visibly read as a bicycle from the gameplay camera.

Required defining features should include:

* two clearly separated wheels of similar size
* recognizable front and rear wheel positions
* triangular or step-through frame
* handlebar
* seat
* front fork
* rear frame connection
* visible relationship between frame and wheels
* optional oversized basket when appropriate for the Tokyo theme

Avoid configurations where:

* wheels visually overlap
* frame geometry becomes an unreadable cluster
* bicycle is viewed almost perfectly end-on
* handlebars or seat are too small to read
* colors blend into the environment
* the asset resembles a cart, fence, scooter or random mechanical object

Exaggerate important features when needed:

* slightly larger wheels
* thicker frame tubes
* larger basket
* wider handlebars
* more visible seat

The bicycle should be optimized for the gameplay camera, not for inspection from an arbitrary 3D editor viewpoint.

## 4. Build assets for the actual gameplay camera

Do not judge procedural assets only from a free 3D perspective.

Evaluate them using approximately the same:

* camera position
* field of view
* viewing angle
* object distance
* lighting
* fog
* scale

used during gameplay.

Check each obstacle at:

* medium approach distance
* near-collision distance
* center lane
* adjacent lane

Important features must remain readable before the player reaches the obstacle.

If an asset only becomes recognizable immediately before collision, revise it.

It is acceptable to rotate or stage an obstacle slightly for better readability.

For example, a bicycle may sit at a slight diagonal if this makes both wheels, frame, seat and handlebars easier to recognize.

Gameplay readability takes priority over physically perfect orientation.

## 5. Visual design must communicate gameplay behavior

The silhouette should help communicate the required action.

### JUMP obstacles

Jumpable obstacles should visually appear:

* low
* grounded
* clearly passable above
* narrow enough longitudinally to make jumping believable

Examples:

* surfboard
* suitcase
* cable bundle
* stage monitor

The player should visually think:

**“Go over it.”**

### SLIDE obstacles

Slide obstacles should visibly create:

* a clear overhead obstruction
* obvious open space underneath
* enough horizontal structure to communicate that standing upright is unsafe

Use visual guidance such as a downward arrow when appropriate.

The player should visually think:

**“Go under it.”**

### BLOCK / CHANGE-LANE obstacles

Lane-blocking obstacles should:

* clearly occupy the lane
* look too large or tall to jump
* not imply that sliding underneath is possible
* leave neighboring lanes visually open

Examples:

* giant teddy bear
* bicycle
* beach umbrella
* speaker stack

The player should visually think:

**“Go around it.”**

## 6. Collision volumes are gameplay contracts

Do NOT automatically use the complete visual bounding box of the procedural model as its gameplay collision volume.

Visual geometry and gameplay collision geometry have different purposes.

Decorative geometry such as:

* bicycle handlebars
* teddy bear arms
* umbrella edges
* surfboard tips
* clothing sleeves
* banner decorations
* speaker details
* light fixtures

must not create unfair collisions simply because they extend beyond the object's intended gameplay footprint.

Create or tune logical collision volumes based on the **required player action**.

Collision volumes may be simpler and slightly more forgiving than the visible mesh.

## 7. Standardize obstacle collision classes

Treat obstacles as belonging to gameplay collision classes rather than giving every model arbitrary collision dimensions.

At minimum maintain standardized behavior for:

* `jump`
* `slide`
* `block/change-lane`

Obstacle visuals may differ, but obstacles belonging to the same action class should require substantially the same player timing.

## 8. JUMP consistency

All normal jumpable obstacles should be consistently jumpable using the same existing jump action.

A child who learns when to jump over one standard jump obstacle should be able to apply approximately the same timing to another.

Tune jump-obstacle hitboxes so that:

* required approach distance is consistent
* required vertical clearance is consistent
* collision depth along the running direction is consistent
* normal jump height reliably clears them
* decorative geometry does not unexpectedly extend the collision
* visual obstacle height reasonably corresponds to the collision requirement

Do not create one jump obstacle that requires jumping substantially earlier or later than another unless explicitly designed as a special mechanic.

For example:

surfboard, suitcase, cable bundle and stage monitor may have different visual shapes, but their gameplay collision volumes should belong to the same predictable **jump family**.

A successful jump at the learned timing should consistently work.

## 9. SLIDE consistency

All standard slide obstacles should use a consistent timing model.

A child who learns when to slide under one overhead obstacle should be able to apply approximately the same timing to another.

Tune slide-obstacle hitboxes so that:

* longitudinal collision depth is consistent
* the required start time for sliding is consistent
* the player can safely exit the slide at approximately the same relative point
* the visible clearance under the obstacle corresponds to the gameplay clearance
* decorative supports do not unexpectedly collide with a correctly sliding player

Examples include:

* wave banner
* lighting truss
* other normal overhead hazards

The Tokyo bridge is a special compound obstacle because it additionally requires choosing the correct lane, but once the player reaches the valid opening, the **slide timing itself should match the normal slide timing used elsewhere in the game**.

## 10. CHANGE-LANE consistency

Block obstacles should occupy their intended lane without unfairly extending into neighboring lanes.

A player correctly centered in an adjacent lane should pass safely.

Tune lateral hitboxes so that:

* an obstacle blocks its own lane reliably
* adjacent lanes remain reliably safe
* decorative geometry does not cause lateral collisions
* oversized visual elements do not silently enlarge the gameplay collision area
* ordinary lane-changing timing remains sufficient

This is especially important for:

* bicycles
* giant teddy bears
* umbrellas
* clothing racks
* speaker stacks
* confetti cannons

For example, a teddy bear's arm may visually extend toward another lane, but unless intentionally designed otherwise, that arm should **not** make the neighboring lane unsafe.

Similarly, bicycle handlebars should not collide with a player correctly running past in the adjacent lane.

## 11. Hitbox dimensions should reflect gameplay, not mesh dimensions

When necessary, separate:

**visual dimensions**

from:

**collision dimensions**

Each obstacle may therefore have explicit gameplay collision parameters such as:

* collision half-width
* collision half-depth
* collision height or clearance
* required action
* optional special behavior

Prefer a reusable data-driven collision configuration over long chains of obstacle-name-specific conditions.

Conceptually, an obstacle definition may contain information equivalent to:

* type
* required action
* lane
* distance
* collision width
* collision depth
* collision clearance

The exact implementation should fit the existing architecture.

Do not over-engineer if a simpler reusable approach works.

## 12. Preserve learned timing across the entire game

This is a critical design requirement.

Once the child learns:

**when to jump**

that timing should remain useful throughout the game.

Once the child learns:

**when to slide**

that timing should remain useful throughout the game.

Once the child learns:

**one lane over is safe**

that expectation should remain reliable.

Visual variety should NOT create arbitrary mechanical inconsistency.

Difficulty should primarily increase through:

* level speed
* obstacle sequencing
* lane choices
* environment
* gentle combinations

rather than hidden differences in collision timing.

## 13. Validate collision against player movement

Do not tune obstacle hitboxes in isolation.

Validate them against the actual existing:

* player dimensions
* lane width
* lane-change speed
* jump duration
* jump height
* slide duration
* running speed
* level speed multipliers

Use the existing movement mechanics as the reference.

Do not silently change jump height, jump duration, slide duration or lane-change speed merely to make one badly sized obstacle work.

Fix the obstacle/hitbox instead.

## 14. Visual mesh and hitbox should still agree

Although collision volumes may be simplified and forgiving, they must not become visibly nonsensical.

Avoid cases where:

* the player visibly passes through the center of a solid obstacle
* a jump visibly clips deeply through an obstacle
* the player appears clearly underneath something but still collides
* the player is visibly far from an obstacle but takes damage
* an adjacent-lane player appears clear but collides

The goal is:

**visual expectation ≈ gameplay result**

with a small forgiveness margin in favor of the player.

## 15. Child-friendly collision forgiveness

Because the target audience is 4–6 years old, use modest forgiving margins.

Do not make collisions pixel-perfect or geometrically exact if that produces frustrating results.

Where reasonable:

* slightly shrink lateral obstacle collision width
* slightly shrink longitudinal collision depth
* allow comfortable vertical clearance on jumps
* allow comfortable clearance during slides

The player should feel that a move that **looked correct** was accepted.

However, do not make hitboxes so small that obviously incorrect actions succeed.

## 16. Special hazards

Special hazards such as the Level 8 moving spotlight may use different collision logic, but must follow the same fairness principle.

The spotlight should:

* clearly indicate the dangerous area
* provide generous warning
* use a collision area slightly smaller than the visible illuminated area if appropriate
* never produce unavoidable collisions
* move predictably
* remain readable from the gameplay camera

Its visual footprint should be slightly more conservative than its actual damaging footprint so the player receives the benefit of uncertainty.

## 17. Consistent procedural art direction

All procedural assets should appear to belong to the same game.

Match existing conventions for:

* geometry complexity
* primitive choice
* material roughness
* saturation
* proportions
* scale
* level of detail
* stylization

Avoid making one obstacle highly realistic while surrounding objects remain simplified.

Prefer:

* large simple forms
* strong silhouettes
* clear negative space
* limited but distinct colors
* exaggerated identifying details

Avoid tiny decorative geometry that adds rendering complexity without improving recognition.

## 18. Asset-specific recognition examples

Use obvious defining features.

### Teddy bear

Use:

* oversized head
* round ears
* clear muzzle
* visible arms and legs
* strongly readable bear silhouette

### Surfboard

Use:

* long narrow board
* rounded/pointed ends
* recognizable colorful stripe or surf design
* clearly horizontal ground placement

### Suitcase

Use:

* rectangular luggage body
* obvious extended handle
* small wheels if readable
* strong luggage proportions

### Speaker

Use:

* visible large speaker cones
* stacked cabinet structure
* dark concert-equipment appearance

### Popcorn

Use:

* striped container
* exaggerated popcorn pieces visible above it

### Hot dog

Use:

* obvious bun
* contrasting sausage
* simple readable shape

### Clothing rack

Use:

* obvious horizontal rack
* multiple clearly hanging garments
* enough negative space to distinguish it from a wall or fence

### Bicycle

Use:

* two large separated wheels
* recognizable frame
* handlebars
* seat
* optional oversized basket

## 19. Self-review every new asset

Before considering an asset finished, explicitly review:

### Visual recognition

* What features make this object immediately recognizable?
* Is its silhouette clear?
* Is it recognizable from the actual gameplay camera?
* Is it recognizable at normal gameplay distance?
* Is it visually distinct from other obstacles?

### Gameplay communication

* Does its shape clearly suggest jump, slide or lane change?
* Would a young child have a reasonable chance of understanding the intended response?

### Collision

* Is its hitbox based on gameplay behavior rather than arbitrary mesh bounds?
* Does it match the standard timing of its obstacle class?
* Can adjacent lanes pass safely when appropriate?
* Do decorative features create accidental collisions?
* Does the collision result agree with what the player sees?

If any answer is unsatisfactory, revise the asset or hitbox before considering the implementation complete.

## 20. Cross-game collision QA

After adding a batch of new obstacles, perform a consistency review across both existing and new levels.

Test representative obstacles from every action class.

### Jump test

Perform the same normal jump timing against multiple jump obstacles.

They should all be cleared consistently.

### Slide test

Perform the same normal slide timing against multiple slide obstacles.

They should all be cleared consistently.

### Lane-pass test

Run centered in the lane immediately beside multiple block obstacles.

The player should pass without collision.

### Visual test

Observe each obstacle from the normal gameplay camera while approaching at normal game speed.

The required action should be visually understandable before reaching collision distance.

If inconsistencies are found, prefer tuning obstacle collision volumes rather than changing global player movement mechanics.

## Final principle

The procedural mesh tells the child:

**“This is what you should do.”**

The collision system must then honor that promise.

A visually successful jump should register as a successful jump.

A visually successful slide should register as a successful slide.

A player who clearly moved into the neighboring lane should not be hit by decorative geometry.

Maintain that relationship consistently across the entire game.

---

# Confirmed Implementation Constraints for Future Asset Work

These constraints are approved project direction and must be followed when implementing future obstacle or asset changes.

## Gameplay compatibility baseline

The existing Level 1 jump obstacles define the baseline for jump gameplay. Their current action parameters and effective hitbox behavior are the compatibility standard for future normal jump obstacles.

Future improvements must preserve the current gameplay feel, timing, responsiveness and learned jump behavior. Do not change global jump parameters or make new jump obstacles require a different learned timing without explicit approval.

The same principle applies when standardizing slide and block/change-lane behavior: improve consistency without changing the established gameplay feel unexpectedly.

## Collision configuration separation

Visual asset construction and gameplay collision configuration must remain clearly separated inside the project.

Collision settings should be centralized, reusable and data-driven enough to support:

* future obstacle types
* standard action-class profiles
* per-asset visual-to-gameplay adjustments when justified
* a future debug mode that can adjust collision parameters in real time

Do not bury collision dimensions in scattered obstacle-name-specific conditionals or inside procedural mesh construction when a shared configuration is appropriate.

## Asset-first corrections

When an obstacle’s visual footprint conflicts with its intended gameplay behavior, prefer adjusting the asset’s model, proportions, staging or decorative geometry before changing established action timing or collision behavior.

This is especially important for slide and block obstacles: visual changes should make the intended action clearer without making the current controls feel different.

## Vehicle asset quality

The car and bus models require a complete visual redesign before being considered finished.

They must be immediately recognizable as a car and a bus from the actual gameplay camera and at normal gameplay scale, including clear silhouettes and defining features that a child can read while moving.

Their gameplay behavior must remain consistent with the existing block/change-lane behavior unless explicitly approved otherwise.
