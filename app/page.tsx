"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    void import("../src/main.js");
  }, []);

  return (
    <main id="app">
      <canvas id="game-canvas" />
      <section id="menu-screen" className="screen panel">
        <p className="eyebrow">REACTION RUNNER</p>
        <h1>Running Girl</h1>
        <p>Reach the finish, collect strawberries, and keep your three hearts.</p>
        <button id="start-button" className="primary-button">Start level</button>
        <p className="hint">Landscape recommended · WASD or the on-screen pad</p>
      </section>
      <section id="result-screen" className="screen panel hidden">
        <p id="result-eyebrow" className="eyebrow">LEVEL COMPLETE</p>
        <h2 id="result-title">You made it!</h2>
        <p id="result-copy" />
        <button id="result-button" className="primary-button">Back to menu</button>
      </section>
      <div id="hud" className="hud hidden">
        <div className="hud-card"><span id="hearts">♥ ♥ ♥</span></div>
        <div className="hud-card score">Strawberries <strong id="score">0</strong></div>
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
      <div id="portrait-warning" className="portrait-warning">Rotate your device to landscape</div>
    </main>
  );
}
