import { test, expect } from '@playwright/test';
import { advanceToDistance, callApi, collisionEvents, expectHealthy, openGame, setLane, startLevel } from './helpers/game-harness.js';

test.afterEach(async ({ page }) => expectHealthy(page));

function laneIndex(specLane) {
  return specLane + 1;
}

async function playObstacle(page, obstacle, obstacleIndex) {
  await advanceToDistance(page, Math.max(0, obstacle.distance - 8.5));
  let snapshot;

  if (obstacle.behavior === 'jump' || obstacle.behavior === 'slide' || obstacle.behavior === 'bridge') {
    await setLane(page, laneIndex(obstacle.lane));
  } else if (obstacle.behavior === 'block') {
    const blockedLane = laneIndex(obstacle.lane);
    const current = await callApi(page, 'snapshot');
    const safeLane = current.lane === blockedLane ? (blockedLane === 1 ? 0 : 1) : current.lane;
    await setLane(page, safeLane);
  } else if (obstacle.behavior === 'spotlight') {
    snapshot = await callApi(page, 'snapshot');
    const activeLane = snapshot.obstacles[obstacleIndex].activeLane ?? laneIndex(obstacle.lane);
    await setLane(page, activeLane === 0 ? 2 : 0);
  }

  await advanceToDistance(page, Math.max(0, obstacle.distance - 1.8));
  snapshot = await callApi(page, 'snapshot');
  const collisionsBeforeAction = collisionEvents(snapshot).length;
  if (obstacle.behavior === 'jump') await callApi(page, 'action', 'up');
  if (obstacle.behavior === 'slide' || obstacle.behavior === 'bridge') await callApi(page, 'action', 'down');
  const after = await advanceToDistance(page, obstacle.distance + 2);
  expect(collisionEvents(after).length, `${obstacle.type} caused an unexpected collision`).toBe(collisionsBeforeAction);
}

test('scripted playthrough reaches the finish on every level', async ({ page }) => {
  test.setTimeout(120_000);
  await openGame(page);
  const levels = await page.evaluate(() => window.__runningGirlTest.levels);

  for (let levelIndex = 0; levelIndex < levels.length; levelIndex++) {
    await startLevel(page, levelIndex);
    for (const [obstacleIndex, obstacle] of levels[levelIndex].obstacles.entries()) {
      await playObstacle(page, obstacle, obstacleIndex);
    }
    const finalSnapshot = await advanceToDistance(page, levels[levelIndex].finishDistance + 2);
    expect(finalSnapshot.mode, levels[levelIndex].name).toBe('success');
    expect(finalSnapshot.lives, levels[levelIndex].name).toBeGreaterThan(0);
  }
});

test('scripted playthrough reaches the finish on Levels 2 through 7', async ({ page }) => {
  test.setTimeout(300_000);
  await openGame(page);
  const levels = await page.evaluate(() => window.__runningGirlTest.levels);

  for (let levelIndex = 1; levelIndex <= 6; levelIndex += 1) {
    await startLevel(page, levelIndex);
    for (const [obstacleIndex, obstacle] of levels[levelIndex].obstacles.entries()) {
      await playObstacle(page, obstacle, obstacleIndex);
    }
    const finalSnapshot = await advanceToDistance(page, levels[levelIndex].finishDistance + 2);
    expect(finalSnapshot.mode, levels[levelIndex].name).toBe('success');
    expect(finalSnapshot.lives, levels[levelIndex].name).toBeGreaterThan(0);
  }
});
