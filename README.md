<p align="center">
  <img src="public/running-girl-logo.png" alt="Running Girl logo" width="420">
</p>

# Running Girl

Running Girl is a browser-based 3D running game made in Codex as a practice project to entertain the young girls in my family. It is designed for children under six, with simple controls and short runs: choose a character and route, avoid obstacles, collect treats, and race a computer-controlled runner.

## Features

- Solo play or a race against an AI runner
- Two characters and seven playable routes
- Obstacles to jump over, slide under, or avoid by changing lanes
- Treats to collect
- Keyboard and touch controls

This is a personal practice project and is still a prototype.

## How it was made

The game uses JavaScript and Three.js to render its 3D scenes. Many characters, obstacles, and environments are built procedurally in code. The interface uses React, with Vinext and Vite for development and builds.

## Run locally

You’ll need Node.js **22.13.0 or newer** and npm.

1. Clone or download this repository and open a terminal in the project folder.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the local URL printed in the terminal.

To create and run a production build:

```bash
npm run build
npm run start
```

## Controls

| Action | Keyboard | Touch |
| --- | --- | --- |
| Change lanes | Left/right arrows or **A/D** | On-screen arrows or swipe left/right |
| Jump | Up arrow or **W** | Jump button or swipe up |
| Slide | Down arrow or **S** | Slide button or swipe down |
| Pause | **Escape** | Pause button |

## Project structure

- `app/` — React app entry point
- `src/` — game logic, styles, and procedural 3D assets
- `public/` — images and other static assets
- `worker/` — server entry point used by the app tooling

## License

Original project material is dedicated to the public domain under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). This does not change the licenses or rights for third-party software and assets included in or used by the project. See [LICENSE](LICENSE).
