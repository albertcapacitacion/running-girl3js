import { test, expect } from '@playwright/test';
import { callApi, openGame } from './helpers/game-harness.js';

test('AI starts beside the player and preserves its transparent presentation', async ({ page }) => {
  await openGame(page);
  const snapshot = await callApi(page, 'startLevel', 0, 'ai');
  expect(snapshot.ai).not.toBeNull();
  expect(snapshot.ai.visible).toBe(true);
  expect(snapshot.ai.opacity).toBeCloseTo(.34, 2);
  expect(snapshot.ai.z).toBeCloseTo(snapshot.player.z, 5);
  expect(Math.abs(snapshot.ai.x - snapshot.player.x)).toBeCloseTo(2.5, 5);
  expect(snapshot.ai.profile.name).toBeTruthy();
});

test('player rewind does not rewind the AI simulation', async ({ page }) => {
  await openGame(page);
  await callApi(page, 'startLevel', 0, 'ai');
  await callApi(page, 'placeInLane', 2);
  await callApi(page, 'seekDistance', 18.5);
  const beforeCollision = await callApi(page, 'snapshot');
  await callApi(page, 'advance', .35);
  const collision = await callApi(page, 'snapshot');
  await callApi(page, 'advance', .8);
  const afterRewind = await callApi(page, 'snapshot');

  expect(collision.events.some(event => event.type === 'collision')).toBe(true);
  expect(afterRewind.elapsed).toBeLessThan(collision.elapsed);
  expect(afterRewind.ai.progress).toBeGreaterThan(beforeCollision.ai.progress);
  expect(afterRewind.lives).toBe(collision.lives);
});

test('AI collisions do not pause or damage the player', async ({ page }) => {
  await openGame(page);
  let aiCollision = null;
  for (let attempt = 0; attempt < 30 && !aiCollision; attempt += 1) {
    await callApi(page, 'startLevel', 2, 'ai');
    await callApi(page, 'placeInLane', 2);
    const snapshot = await callApi(page, 'advance', 5.2);
    aiCollision = snapshot.events.find(event => event.type === 'ai-collision');
    if (aiCollision) {
      expect(snapshot.lives).toBe(3);
      expect(snapshot.rewindTime).toBe(0);
      expect(snapshot.mode).toBe('playing');
    }
  }
  expect(aiCollision).not.toBeNull();
});

test('clean level-one races are player-favored in approximately 70 percent of runs', async ({ page }) => {
  test.setTimeout(120_000);
  await openGame(page);
  const results = await page.evaluate(() => {
    const api = window.__runningGirlTest;
    const level = api.levels[0];
    const outcomes = [];
    for (let run = 0; run < 20; run += 1) {
      api.startLevel(0, 'ai');
      for (const obstacle of level.obstacles) {
        if (api.snapshot().mode !== 'playing' || api.snapshot().lives <= 0) break;
        const speed = api.debug.movement.speed;
        const currentDistance = api.snapshot().elapsed * speed;
        api.advance(Math.max(0, obstacle.distance - 8.5 - currentDistance) / speed);
        const playerLane = obstacle.behavior === 'block' ? (obstacle.lane + 1 === 1 ? 0 : 1) : obstacle.lane + 1;
        api.placeInLane(playerLane);
        api.advance(Math.max(0, obstacle.distance - 1.8 - api.snapshot().elapsed * speed) / speed);
        if (obstacle.behavior === 'jump') api.action('up');
        if (obstacle.behavior === 'slide') api.action('down');
        api.advance(Math.max(0, obstacle.distance + 2 - api.snapshot().elapsed * speed) / speed);
        if (api.snapshot().mode !== 'playing' || api.snapshot().lives <= 0) break;
      }
      if (api.snapshot().mode === 'playing' && api.snapshot().lives > 0) api.advance(Math.max(0, level.finishDistance + 2 - api.snapshot().elapsed * api.debug.movement.speed) / api.debug.movement.speed);
      outcomes.push(api.snapshot().mode === 'success');
    }
    return outcomes;
  });
  const wins = results.filter(Boolean).length;
  expect(wins).toBeGreaterThanOrEqual(12);
  expect(wins).toBeLessThanOrEqual(18);
});

test('AI starts and progresses independently across Levels 2 through 7', async ({ page }) => {
  await openGame(page);
  for (let levelIndex = 1; levelIndex <= 6; levelIndex += 1) {
    const snapshot = await callApi(page, 'startLevel', levelIndex, 'ai');
    expect(snapshot.level).toBe(levelIndex);
    expect(snapshot.ai).not.toBeNull();
    expect(snapshot.ai.visible).toBe(true);
    expect(snapshot.ai.z).toBeCloseTo(snapshot.player.z, 5);
    expect(Math.abs(snapshot.ai.x - snapshot.player.x)).toBeCloseTo(2.5, 5);
    const progressed = await callApi(page, 'advance', 3);
    expect(progressed.ai.progress).toBeGreaterThan(0);
    expect(progressed.level).toBe(levelIndex);
  }
});
