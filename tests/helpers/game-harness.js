import { expect } from '@playwright/test';

export async function openGame(page) {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/?test=1');
  await page.waitForFunction(() => Boolean(window.__runningGirlTest));
  page.__runningGirlErrors = errors;
  return { api: 'window.__runningGirlTest', errors };
}

export async function callApi(page, method, ...args) {
  return page.evaluate(({ method, args }) => window.__runningGirlTest[method](...args), { method, args });
}

export async function startLevel(page, index) {
  return callApi(page, 'startLevel', index, 'solo');
}

export async function advanceToDistance(page, distance) {
  const snapshot = await callApi(page, 'snapshot');
  const speed = await page.evaluate(() => {
    const api = window.__runningGirlTest;
    const snapshot = api.snapshot();
    return api.debug.movement.speed * (api.levels[snapshot.level].speedMultiplier ?? 1);
  });
  const currentDistance = snapshot.elapsed * speed;
  await callApi(page, 'advance', Math.max(0, (distance - currentDistance) / speed));
  return callApi(page, 'snapshot');
}

export async function setLane(page, targetLane) {
  let snapshot = await callApi(page, 'snapshot');
  for (let attempts = 0; snapshot.targetLane !== targetLane && attempts < 4; attempts++) {
    if (snapshot.mode !== 'playing') throw new Error(`Cannot change lane while game is ${snapshot.mode}`);
    await callApi(page, 'action', targetLane < snapshot.targetLane ? 'left' : 'right');
    await callApi(page, 'advance', .25);
    snapshot = await callApi(page, 'snapshot');
  }
  if (snapshot.targetLane !== targetLane) throw new Error(`Lane change did not reach ${targetLane}`);
  return snapshot;
}

export function collisionEvents(snapshot) {
  return snapshot.events.filter(event => event.type === 'collision');
}

export async function expectHealthy(page) {
  expect(page.__runningGirlErrors ?? [], 'The game reported a page error').toEqual([]);
}
