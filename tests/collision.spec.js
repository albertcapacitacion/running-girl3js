import { test, expect } from '@playwright/test';
import { advanceToDistance, callApi, collisionEvents, expectHealthy, openGame, setLane, startLevel } from './helpers/game-harness.js';

test.describe('standard collision contracts', () => {
  test.afterEach(async ({ page }) => expectHealthy(page));

  test('a normal jump clears a Level 1 jump obstacle', async ({ page }) => {
    await openGame(page);
    await startLevel(page, 0);
    await setLane(page, 2);
    await advanceToDistance(page, 18.2);
    await callApi(page, 'action', 'up');
    const snapshot = await advanceToDistance(page, 22.5);
    expect(collisionEvents(snapshot)).toEqual([]);
  });

  test('missing the jump produces a collision', async ({ page }) => {
    await openGame(page);
    await startLevel(page, 0);
    await setLane(page, 2);
    const snapshot = await advanceToDistance(page, 21.5);
    expect(collisionEvents(snapshot).some(event => event.behavior === 'jump')).toBe(true);
  });

  test('a normal slide clears a slide obstacle', async ({ page }) => {
    await openGame(page);
    await startLevel(page, 0);
    await setLane(page, 1);
    await advanceToDistance(page, 54.2);
    await callApi(page, 'action', 'down');
    const snapshot = await advanceToDistance(page, 58.5);
    expect(collisionEvents(snapshot)).toEqual([]);
  });

  test('missing the slide produces a collision', async ({ page }) => {
    await openGame(page);
    await startLevel(page, 0);
    await setLane(page, 1);
    const snapshot = await advanceToDistance(page, 57.5);
    expect(collisionEvents(snapshot).some(event => event.behavior === 'slide')).toBe(true);
  });

  test('a neighboring lane safely passes a block obstacle', async ({ page }) => {
    await openGame(page);
    await startLevel(page, 0);
    await setLane(page, 0);
    await callApi(page, 'seekDistance', 192.5);
    const snapshot = await advanceToDistance(page, 197.5);
    expect(collisionEvents(snapshot)).toEqual([]);
  });

  test('staying in a blocked lane produces a collision', async ({ page }) => {
    await openGame(page);
    await startLevel(page, 0);
    await setLane(page, 1);
    await callApi(page, 'seekDistance', 192.5);
    const snapshot = await advanceToDistance(page, 197.5);
    expect(collisionEvents(snapshot).some(event => event.behavior === 'block')).toBe(true);
  });

  test('collision rewind restores an earlier elapsed-time scene state', async ({ page }) => {
    await openGame(page);
    await startLevel(page, 0);
    await setLane(page, 1);
    const before = await callApi(page, 'seekDistance', 192.5);
    const collision = await advanceToDistance(page, 194.5);
    expect(collisionEvents(collision).length).toBeGreaterThan(0);
    const afterRewind = await callApi(page, 'advance', 1);
    expect(afterRewind.rewindTime).toBe(0);
    expect(afterRewind.elapsed).toBeLessThan(collision.elapsed);
    expect(afterRewind.elapsed).toBeLessThan(before.elapsed + .5);
  });

  test('every configured obstacle type has a damaging collision footprint', async ({ page }) => {
    await openGame(page);
    const levels = await page.evaluate(() => window.__runningGirlTest.levels);
    const cases = levels.flatMap((level, levelIndex) => level.obstacles.map((obstacle, obstacleIndex) => ({ levelIndex, obstacleIndex, obstacle })));
    const seenTypes = new Set();

    for (const testCase of cases) {
      const key = `${testCase.obstacle.type}:${testCase.obstacle.behavior}`;
      if (seenTypes.has(key)) continue;
      seenTypes.add(key);
      if (testCase.obstacle.behavior === 'spotlight') {
        let collided = false;
        for (let lane = 0; lane < 3; lane++) {
          await startLevel(page, testCase.levelIndex);
          await callApi(page, 'seekDistance', Math.max(0, testCase.obstacle.distance - 1.8));
          await callApi(page, 'placeInLane', lane);
          const afterSpotlightProbe = await callApi(page, 'advance', .2);
          collided ||= collisionEvents(afterSpotlightProbe).some(event => event.obstacle === testCase.obstacle.type);
        }
        expect(collided, key).toBe(true);
        continue;
      }
      await startLevel(page, testCase.levelIndex);
      await callApi(page, 'seekDistance', Math.max(0, testCase.obstacle.distance - 1.8));
      const positioned = await callApi(page, 'snapshot');
      const obstacle = positioned.obstacles[testCase.obstacleIndex];
      await callApi(page, 'placeInLane', testCase.obstacle.lane + 1);
      const after = await callApi(page, 'advance', .2);
      expect(collisionEvents(after).some(event => event.obstacle === testCase.obstacle.type), key).toBe(true);
    }
  });
});
