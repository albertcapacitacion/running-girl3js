import fs from 'node:fs';
import { test, expect } from '@playwright/test';
import { callApi, expectHealthy, openGame, startLevel } from './helpers/game-harness.js';

test.afterEach(async ({ page }) => expectHealthy(page));

test('captures every obstacle from the gameplay camera for manual recognition QA', async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  await openGame(page);
  const outputDirectory = testInfo.outputPath('visual-qa');
  fs.mkdirSync(outputDirectory, { recursive: true });
  const levels = await page.evaluate(() => window.__runningGirlTest.levels);

  for (let levelIndex = 0; levelIndex < levels.length; levelIndex++) {
    await startLevel(page, levelIndex);
    for (const [obstacleIndex, obstacle] of levels[levelIndex].obstacles.entries()) {
      const approachDistance = Math.max(0, obstacle.distance - 8);
      const snapshot = await callApi(page, 'seekDistance', approachDistance);
      const visible = snapshot.obstacles[obstacleIndex].visible;
      expect(visible, `${levels[levelIndex].name}: ${obstacle.type} is not visible`).toBe(true);
      expect(snapshot.obstacles[obstacleIndex].inCamera, `${levels[levelIndex].name}: ${obstacle.type} is outside the gameplay camera`).toBe(true);
      await page.screenshot({
        path: `${outputDirectory}/level-${String(levelIndex + 1).padStart(2, '0')}-${String(obstacleIndex + 1).padStart(2, '0')}-${obstacle.type}.png`,
        animations: 'disabled'
      });
    }
  }
});

test('all configured obstacles have a scene mesh and a collision behavior', async ({ page }) => {
  await openGame(page);
  const levels = await page.evaluate(() => window.__runningGirlTest.levels);
  for (let levelIndex = 0; levelIndex < levels.length; levelIndex++) {
    const snapshot = await startLevel(page, levelIndex);
    expect(snapshot.obstacles.length).toBe(levels[levelIndex].obstacles.length);
    for (const obstacle of snapshot.obstacles) {
      expect(obstacle.visible).toBe(true);
      expect(['jump', 'slide', 'block', 'bridge', 'spotlight']).toContain(obstacle.behavior);
      expect(Number.isFinite(obstacle.x)).toBe(true);
      expect(Number.isFinite(obstacle.z)).toBe(true);
    }
  }
});
