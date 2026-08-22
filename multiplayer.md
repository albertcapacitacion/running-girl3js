# Multiplayer Competitive Mode

An eventual two-player online mode where both runners play simultaneously on the same course.

## Core concept

- Both players start together after a short countdown.
- Players do not collide with or obstruct one another.
- Each player sees the opponent as a transparent, colored silhouette.
- The silhouette provides pressure and orientation without becoming a gameplay obstacle.
- The race ends when both players finish, or after a short post-finish timer.

## Player feedback

- A top-center progress bar shows both runners' positions on the course.
- A distance marker displays the gap, for example `+120 m` when the opponent is ahead.
- The opponent silhouette can become slightly more visible when nearby.
- Optional subtle audio or visual feedback can indicate that the opponent is closing in.
- Checkpoint updates can show the current gap at important sections of the course.

## Victory options

### Pure race

The first player across the finish line wins. This is the clearest and fastest version.

### Race plus rewards

The final result combines finishing position with rewards collected. This gives slower players a possible recovery path, but may reduce the importance of the finish line.

### Weighted race score

Finishing position remains the dominant factor while rewards add strategic value. A possible starting balance is:

- 80% finishing result
- 20% rewards collected

### Hybrid win condition

The first player to finish wins unless the opponent has collected enough bonus objectives to overcome the time disadvantage. This keeps racing primary while allowing meaningful route choices.

## Course and route ideas

- Shared pickups disappear when claimed by one player.
- Fast, dangerous routes can contain fewer rewards.
- Slower side routes can contain valuable rewards.
- Optional objectives can pull players away from the optimal racing line.
- Shortcuts can be available to both players and create moments of decision-making.
- Environmental events can affect both runners equally.

## Design direction

The initial version should focus on pace, routing, resource choices, and recovery rather than attacks or heavy interference. The opponent should create competitive tension without griefing or disrupting movement.

## Suggested first version

- Simultaneous two-player race
- Non-colliding transparent silhouettes
- Top progress bar and distance gap marker
- Finish position worth 80% of the result
- Collected rewards worth 20%
- Shared collectibles and optional shortcuts
- Both players remain active until they finish or disconnect

The network stack and synchronization model will be decided separately during implementation planning.
