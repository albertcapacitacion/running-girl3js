import * as THREE from 'three';
import './style.css';

const CONFIG = { lanes: [-2.5, 0, 2.5], speed: 8, levelSeconds: 30, rewindSeconds: 2.5, laneChangeSeconds: .18, jumpSeconds: .78, jumpHeight: 2.142, slideSeconds: .72, invulnerabilitySeconds: 1.2 };
const COLORS = { grass: 0x70b85b, path: 0xb8a57b, red: 0xe94560, navy: 0x19324b, cream: 0xfff3d6, blonde: 0xf5c86a, strawberry: 0xe94560, leaf: 0x3e8f4e, wood: 0x765135, white: 0xf6f1e8 };

const LEVEL = {
  obstacles: [
    { id: 'bench-1', type: 'bench', lane: 1, distance: 20 }, { id: 'bike-1', type: 'bike', lane: -1, distance: 38 },
    { id: 'sign-1', type: 'sign', lane: 0, distance: 56 }, { id: 'bench-2', type: 'bench', lane: 1, distance: 74 },
    { id: 'bike-2', type: 'bike', lane: 1, distance: 92 }, { id: 'sign-2', type: 'sign', lane: -1, distance: 110 },
    { id: 'bench-3', type: 'bench', lane: 0, distance: 128 }, { id: 'bike-3', type: 'bike', lane: -1, distance: 145 },
    { id: 'sign-3', type: 'sign', lane: 1, distance: 162 }, { id: 'bench-4', type: 'bench', lane: -1, distance: 178 },
    { id: 'bike-4', type: 'bike', lane: 0, distance: 195 }, { id: 'sign-4', type: 'sign', lane: -1, distance: 214 }
  ],
  strawberries: [
    { id: 'berry-1', lane: 0, distance: 12 }, { id: 'berry-2', lane: 1, distance: 30 }, { id: 'berry-3', lane: -1, distance: 47 },
    { id: 'berry-4', lane: 0, distance: 68 }, { id: 'berry-5', lane: 1, distance: 84 }, { id: 'berry-6', lane: -1, distance: 101 },
    { id: 'berry-7', lane: 0, distance: 119 }, { id: 'berry-8', lane: 1, distance: 139 }, { id: 'berry-9', lane: -1, distance: 155 },
    { id: 'berry-10', lane: 0, distance: 173 }, { id: 'berry-11', lane: 1, distance: 188 }, { id: 'berry-12', lane: -1, distance: 205 },
    { id: 'berry-13', lane: 0, distance: 224 }
  ]
};

const canvas = document.querySelector('#game-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true }); renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8)); renderer.shadowMap.enabled = true;
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x9bd5e7); scene.fog = new THREE.Fog(0x9bd5e7, 42, 120);
const camera = new THREE.PerspectiveCamera(52, 1, .1, 180); camera.position.set(0, 7.6, 11.5);
const clock = new THREE.Clock(); const world = new THREE.Group(); scene.add(world);
scene.add(new THREE.HemisphereLight(0xccecff, 0x56713f, 2.1)); const sun = new THREE.DirectionalLight(0xfff1ca, 2.6); sun.position.set(-8, 16, 10); sun.castShadow = true; scene.add(sun);

const ui = {
  menuScreen: document.getElementById('menu-screen'), resultScreen: document.getElementById('result-screen'), hud: document.getElementById('hud'),
  pauseScreen: document.getElementById('pause-screen'), controls: document.getElementById('controls'), hearts: document.getElementById('hearts'), score: document.getElementById('score'),
  timer: document.getElementById('timer'), resultEyebrow: document.getElementById('result-eyebrow'), resultTitle: document.getElementById('result-title'), resultCopy: document.getElementById('result-copy'),
  startButton: document.getElementById('start-button'), resultButton: document.getElementById('result-button'), pauseButton: document.getElementById('pause-button'), resumeButton: document.getElementById('resume-button'), restartButton: document.getElementById('restart-button')
};
let mode = 'menu', elapsed = 0, lives = 3, score = 0, lane = 1, targetLane = 1, action = null, actionTime = 0, invulnerable = 0, lastTime = 0, collected = new Set();
const obstacleMeshes = new Map(), berryMeshes = new Map();

function mat(color, roughness = .8) { return new THREE.MeshStandardMaterial({ color, roughness }); }
function box(name, size, color, position) { const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), mat(color)); mesh.name = name; mesh.position.set(...position); mesh.castShadow = true; mesh.receiveShadow = true; return mesh; }
function makePark() {
  const ground = box('grass', [100, .3, 280], COLORS.grass, [0, -.55, -105]); world.add(ground);
  const path = box('running path', [9, .08, 280], COLORS.path, [0, -.38, -105]); world.add(path);
  [-1, 1].forEach(side => { const curb = box('path edge', [.18, .18, 280], COLORS.cream, [side * 4.6, -.29, -105]); world.add(curb); });
  for (let z = -8; z > -270; z -= 18) { [-1, 1].forEach(side => { const trunk = box('tree trunk', [.7, 2.6, .7], COLORS.wood, [side * 10, 1, z]); const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(2.4, 0), mat(COLORS.leaf)); crown.position.set(side * 10, 3.5, z); crown.castShadow = true; world.add(trunk, crown); }); }
  const finish = box('finish line', [9, .05, 1.2], COLORS.white, [0, -.3, -235]); world.add(finish);
  for (let i = -4; i < 5; i++) { const tile = box('finish tile', [1, .06, 1.2], i % 2 ? COLORS.navy : COLORS.white, [i, -.25, -235]); world.add(tile); }
}
function makeGirl() {
  const girl = new THREE.Group(); girl.position.set(0, 0, 0); girl.name = 'protagonist';
  const skirt = box('long school skirt', [1.05, 1.15, .65], COLORS.navy, [0, 1.45, 0]); skirt.rotation.z = .02; girl.add(skirt);
  const blazer = box('red detail blazer', [.78, .75, .54], COLORS.red, [0, 2.25, 0]); girl.add(blazer);
  const shirt = box('shirt collar', [.42, .13, .58], COLORS.cream, [0, 2.62, 0]); girl.add(shirt);
  const head = new THREE.Mesh(new THREE.SphereGeometry(.43, 16, 12), mat(0xffd5b5)); head.position.set(0, 3.25, 0); head.castShadow = true; girl.add(head);
  const hair = new THREE.Mesh(new THREE.SphereGeometry(.47, 16, 12, 0, Math.PI * 2, 0, Math.PI * .62), mat(COLORS.blonde)); hair.position.set(0, 3.35, -.04); hair.castShadow = true; girl.add(hair);
  const pony = new THREE.Mesh(new THREE.SphereGeometry(.25, 12, 8), mat(COLORS.blonde)); pony.position.set(0, 3.25, .42); girl.add(pony);
  const eyeMat = mat(0x263449); [-.14, .14].forEach(x => { const eye = new THREE.Mesh(new THREE.SphereGeometry(.04, 8, 8), eyeMat); eye.position.set(x, 3.28, -.4); girl.add(eye); });
  [-.25, .25].forEach(x => { const leg = box('leg', [.17, .65, .18], 0xffd5b5, [x, .55, 0]); const shoe = box('shoe', [.3, .14, .48], COLORS.red, [x, .18, -.12]); girl.add(leg, shoe); });
  const armL = box('arm', [.16, .72, .16], COLORS.red, [-.52, 2.2, 0]); const armR = armL.clone(); armR.position.x = .52; girl.add(armL, armR); world.add(girl); return girl;
}
function makeObstacle(spec) {
  const g = new THREE.Group(); g.position.x = laneX(spec.lane); g.name = spec.id;
  if (spec.type === 'bench') { g.add(box('bench seat', [2.2, .28, .65], COLORS.wood, [0, .5, 0])); [-.7, .7].forEach(x => g.add(box('bench leg', [.18, .55, .5], COLORS.wood, [x, .15, 0]))); }
  if (spec.type === 'sign') { [-.72, .72].forEach(x => g.add(box('sign leg', [.18, 3.0, .18], COLORS.wood, [x, 1.5, 0]))); g.add(box('sign board', [2.1, .85, .16], COLORS.red, [0, 3.4, 0])); }
  if (spec.type === 'bike') { g.add(box('bike body', [1.2, .2, .2], COLORS.red, [0, .75, 0]), box('bike rider', [.42, 2.1, .42], COLORS.navy, [0, 1.75, 0])); [-.45, .45].forEach(x => { const wheel = new THREE.Mesh(new THREE.TorusGeometry(.4, .07, 8, 16), mat(COLORS.navy)); wheel.rotation.y = Math.PI / 2; wheel.position.set(x, .45, 0); g.add(wheel); }); }
  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); world.add(g); obstacleMeshes.set(spec.id, g);
}
function makeBerry(spec) { const g = new THREE.Group(); g.position.x = laneX(spec.lane); const berry = new THREE.Mesh(new THREE.SphereGeometry(.25, 12, 8), mat(COLORS.strawberry)); berry.position.y = .8; const leaf = box('leaf', [.08, .18, .08], COLORS.leaf, [0, 1.05, 0]); leaf.rotation.z = -.4; g.add(berry, leaf); world.add(g); berryMeshes.set(spec.id, g); }
function laneX(value) { return CONFIG.lanes[value + 1]; }

const girl = makeGirl(); makePark(); LEVEL.obstacles.forEach(makeObstacle); LEVEL.strawberries.forEach(makeBerry);
function resetLevel() { elapsed = 0; lives = 3; score = 0; lane = 1; targetLane = 1; action = null; actionTime = 0; invulnerable = 0; collected.clear(); girl.position.x = 0; updateHUD(); }
function setMode(next) { mode = next; ui.menuScreen.classList.toggle('hidden', next !== 'menu'); ui.resultScreen.classList.toggle('hidden', !['success','gameover'].includes(next)); ui.hud.classList.toggle('hidden', next !== 'playing'); ui.controls.classList.toggle('hidden', next !== 'playing'); ui.pauseScreen.classList.toggle('hidden', next !== 'paused'); }
function startGame() { resetLevel(); setMode('playing'); }
function showResult(success) { setMode(success ? 'success' : 'gameover'); ui.resultEyebrow.textContent = success ? 'LEVEL COMPLETE' : 'RUN OVER'; ui.resultTitle.textContent = success ? 'You made it!' : 'Keep practicing'; ui.resultCopy.textContent = `Strawberries collected: ${score}`; ui.resultButton.textContent = 'Back to menu'; }
function updateHUD() { ui.hearts.textContent = `${'♥ '.repeat(lives)}${'♡ '.repeat(3 - lives)}`.trim(); ui.score.textContent = score; ui.timer.textContent = Math.max(0, Math.ceil(CONFIG.levelSeconds - elapsed)); }
function doAction(input) { if (mode !== 'playing') return; if (input === 'left' || input === 'right') { if (action) return; const next = targetLane + (input === 'left' ? -1 : 1); if (next >= 0 && next <= 2) targetLane = next; return; } if (action) return; if (input === 'up') { action = 'jump'; actionTime = 0; } if (input === 'down') { action = 'slide'; actionTime = 0; } }
function currentZ(distance) { return -(distance - elapsed * CONFIG.speed); }
function obstacleHalfWidth(spec) { return spec.type === 'bench' || spec.type === 'sign' ? 1.05 : .6; }
function obstacleClearance(spec) { return spec.type === 'bench' ? .33 : Infinity; }
function isSafe(spec) {
  const playerHalfWidth = .525;
  const overlapsHorizontally = Math.abs(girl.position.x - laneX(spec.lane)) < playerHalfWidth + obstacleHalfWidth(spec);
  if (!overlapsHorizontally) return true;
  if (spec.type === 'bench') return action === 'jump' && girl.position.y > obstacleClearance(spec);
  if (spec.type === 'sign') return action === 'slide';
  return false;
}
function handleCollision(spec) { if (invulnerable > 0 || isSafe(spec)) return; lives -= 1; invulnerable = CONFIG.invulnerabilitySeconds; elapsed = Math.max(0, elapsed - CONFIG.rewindSeconds); updateHUD(); if (lives <= 0) showResult(false); }
function updateGame(dt) {
  elapsed += dt; invulnerable = Math.max(0, invulnerable - dt); if (targetLane !== lane) { const direction = Math.sign(targetLane - lane); const targetX = CONFIG.lanes[targetLane]; const laneSpeed = Math.abs(CONFIG.lanes[1] - CONFIG.lanes[0]) / CONFIG.laneChangeSeconds; girl.position.x += direction * laneSpeed * dt; if ((direction > 0 && girl.position.x >= targetX) || (direction < 0 && girl.position.x <= targetX)) { girl.position.x = targetX; lane = targetLane; } }
  if (action) { actionTime += dt; const duration = action === 'jump' ? CONFIG.jumpSeconds : CONFIG.slideSeconds; const progress = actionTime / duration; if (action === 'jump') girl.position.y = Math.sin(Math.min(progress, 1) * Math.PI) * CONFIG.jumpHeight; else girl.position.y = .02; if (actionTime >= duration) { action = null; actionTime = 0; girl.position.y = 0; } }
  girl.scale.y = action === 'slide' ? .62 : 1; girl.rotation.z = Math.sin(elapsed * 18) * .025; if (!action) girl.position.y = Math.abs(Math.sin(elapsed * 16)) * .05;
  LEVEL.obstacles.forEach(spec => { const z = currentZ(spec.distance); obstacleMeshes.get(spec.id).position.z = z; if (Math.abs(z) < 1.0) handleCollision(spec); });
  LEVEL.strawberries.forEach(spec => { const berry = berryMeshes.get(spec.id); berry.position.z = currentZ(spec.distance); berry.visible = !collected.has(spec.id); if (!collected.has(spec.id) && Math.abs(berry.position.z) < .9 && Math.abs(girl.position.x - laneX(spec.lane)) < .8) { collected.add(spec.id); score += 1; updateHUD(); } });
  if (elapsed >= CONFIG.levelSeconds) showResult(true); updateHUD();
}
function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
function animate() { requestAnimationFrame(animate); const now = clock.getElapsedTime(); const dt = Math.min(.05, now - lastTime || 0); lastTime = now; if (mode === 'playing') updateGame(dt); camera.lookAt(0, 1.7, -10); renderer.render(scene, camera); }
document.addEventListener('keydown', event => { const map = { a: 'left', ArrowLeft: 'left', d: 'right', ArrowRight: 'right', w: 'up', ArrowUp: 'up', s: 'down', ArrowDown: 'down' }; if (map[event.key]) { event.preventDefault(); doAction(map[event.key]); } if (event.key === 'Escape' && mode === 'playing') setMode('paused'); });
document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('pointerdown', event => { event.preventDefault(); doAction(button.dataset.action); }));
ui.startButton.addEventListener('click', startGame); ui.resultButton.addEventListener('click', () => setMode('menu')); ui.pauseButton.addEventListener('click', () => setMode('paused')); ui.resumeButton.addEventListener('click', () => setMode('playing')); ui.restartButton.addEventListener('click', startGame); addEventListener('resize', resize);
if ('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {})); resize(); setMode('menu'); animate();
