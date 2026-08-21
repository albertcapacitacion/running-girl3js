"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [gameReady, setGameReady] = useState(false);
  const [gameError, setGameError] = useState(false);

  useEffect(() => {
    void import("../src/main.js")
      .then(() => setGameReady(true))
      .catch(() => setGameError(true));
  }, []);

  return (
    <main id="app">
      <canvas id="game-canvas" />
      <section id="title-screen" className="screen title-screen">
        <img className="game-logo" src="/running-girl-logo.png" alt="Running Girl" />
        <button id="press-start-button" className="press-start" disabled={!gameReady}>PRESS START</button>
        <p className="hint">{gameError ? "Unable to load the game. Please reload." : gameReady ? "Tap, Enter, or Space" : "Loading..."}</p>
        {gameError && <button className="secondary-button" onClick={() => window.location.reload()}>Reload</button>}
      </section>
      <section id="player-mode-screen" className="screen panel hidden">
        <p className="eyebrow">CHOOSE YOUR GAME</p>
        <h1>Play Mode</h1>
        <div className="mode-options">
          <button id="solo-button" className="mode-button"><strong>Solo Player</strong><span>Run at your own pace</span></button>
          <button id="ai-button" className="mode-button"><strong>VS AI</strong><span>Race a friendly runner</span></button>
        </div>
      </section>
      <section id="character-screen" className="screen panel hidden">
        <p className="eyebrow">CHOOSE YOUR RUNNER</p>
        <h1>Character Select</h1>
        <div id="character-map" className="character-map" aria-label="Choose a character" />
        <button id="character-next-button" className="primary-button">Continue</button>
      </section>
      <section id="menu-screen" className="screen panel hidden">
        <p className="eyebrow">CHOOSE YOUR ROUTE</p>
        <h1>Level Select</h1>
        <div id="level-map" className="level-map" aria-label="Choose a level" />
        <button id="start-button" className="primary-button">Start selected level</button>
      </section>
      <section id="result-screen" className="screen panel hidden">
        <p id="result-eyebrow" className="eyebrow">LEVEL COMPLETE</p>
        <h2 id="result-title">You made it!</h2>
        <p id="result-copy" />
        <button id="next-button" className="primary-button hidden">Next level</button>
        <button id="result-button" className="primary-button">Back to menu</button>
      </section>
      <div id="hud" className="hud hidden">
        <div className="hud-card"><span id="hearts">♥ ♥ ♥</span></div>
        <div className="hud-card race-card" aria-label="Race progress">
          <div className="race-label"><span>YOU</span><span id="race-gap">AI is nearby</span><span>AI</span></div>
          <div className="race-track"><i id="player-progress" /><b id="ai-progress" /></div>
        </div>
        <div className="hud-card score" aria-label="Collectibles collected">
          <svg className="strawberry-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path className="strawberry-leaves" d="M12 7.1C10.2 4.5 7.6 3.8 6 4.5c1.1 1.1 2.2 1.7 3.5 1.9C7.1 6.1 5.2 7 4.3 8.3c1.5.4 2.8.3 4-.2C6.5 10.4 6.2 13.4 7.1 16c.9 2.5 2.7 4.7 4.9 5.7 2.2-1 4-3.2 4.9-5.7.9-2.6.6-5.6-1.2-7.9 1.2.5 2.5.6 4 .2-.9-1.3-2.8-2.2-5.2-1.9 1.3-.2 2.4-.8 3.5-1.9-1.6-.7-4.2 0-6 2.6Z" />
            <path className="strawberry-fruit" d="M12 7.1c-3.8 0-6.4 1.9-6.4 5.2 0 4.3 3.4 9.1 6.4 9.1s6.4-4.8 6.4-9.1c0-3.3-2.6-5.2-6.4-5.2Z" />
            <circle cx="9.2" cy="11.8" r=".65" /><circle cx="13" cy="10.5" r=".65" /><circle cx="15.4" cy="13.2" r=".65" /><circle cx="10.5" cy="15.2" r=".65" /><circle cx="13.6" cy="17" r=".65" />
          </svg>
          <span id="collectible-label">Treats</span> <strong id="score">0</strong>
        </div>
        <div className="hud-card timer"><strong id="timer">30</strong>s</div>
        <button id="pause-button" className="icon-button" aria-label="Pause">Ⅱ</button>
      </div>
      <div id="pause-screen" className="screen panel hidden">
        <p className="eyebrow">PAUSED</p>
        <h2>Take a breath</h2>
        <button id="resume-button" className="primary-button">Resume</button>
        <button id="restart-button" className="secondary-button">Restart level</button>
      </div>
      <div id="controls" className="controls hidden" aria-label="Game controls">
        <button data-action="up" className="control-button up" aria-label="Jump">▲</button>
        <button data-action="left" className="control-button left" aria-label="Move left">◀</button>
        <button data-action="down" className="control-button down" aria-label="Slide">▼</button>
        <button data-action="right" className="control-button right" aria-label="Move right">▶</button>
      </div>
    </main>
  );
}
