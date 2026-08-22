// Procedural low-poly Japanese arched bridge. No external assets.

export function createScaledJapaneseBridge(THREE, options = {}) {
  const root = new THREE.Group();
  root.name = 'japaneseBridge';
  const red = new THREE.MeshStandardMaterial({ color: options.red ?? 0xd91d2b, roughness: .78 });
  const deckMat = new THREE.MeshStandardMaterial({ color: options.deckColor ?? 0xd9c48d, roughness: .95 });
  const dark = new THREE.MeshStandardMaterial({ color: options.capColor ?? 0x25292d, roughness: .9 });
  const stone = new THREE.MeshStandardMaterial({ color: options.stoneColor ?? 0x525b61, roughness: 1 });
  const kumamonWidth = options.kumamonWidth ?? 3.4;
  const kumamonHeight = options.kumamonHeight ?? 5.9;
  const deckWidth = options.deckWidth ?? kumamonWidth * 3.15;
  const width = options.width ?? 16.5;
  const centerClearance = options.centerClearance ?? kumamonHeight * 1.18;
  const deckThickness = options.deckThickness ?? .38;
  const segments = options.segments ?? 14;
  const archHeight = centerClearance + deckThickness * .5;
  const archY = x => archHeight * (1 - (x / (width * .5)) ** 2);
  const mark = mesh => { mesh.castShadow = true; mesh.receiveShadow = true; return mesh; };

  const deck = new THREE.Group();
  deck.name = 'deck';
  root.add(deck);
  const dx = width / segments;
  for (let i = 0; i < segments; i += 1) {
    const x0 = -width / 2 + i * dx;
    const x1 = x0 + dx;
    const y0 = archY(x0);
    const y1 = archY(x1);
    const slab = mark(new THREE.Mesh(new THREE.BoxGeometry(dx * 1.05, deckThickness, deckWidth), deckMat));
    slab.name = `deckSlab_${i}`;
    slab.position.set((x0 + x1) * .5, (y0 + y1) * .5, 0);
    slab.rotation.z = Math.atan2(y1 - y0, x1 - x0);
    deck.add(slab);
  }

  const makeArchBeam = (name, z, yOffset, radius = .25) => {
    const points = [];
    for (let i = 0; i <= segments * 2; i += 1) {
      const x = -width / 2 + width * i / (segments * 2);
      points.push(new THREE.Vector3(x, archY(x) + yOffset, z));
    }
    const beam = mark(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), segments * 2, radius, 6, false), red));
    beam.name = name;
    root.add(beam);
  };
  makeArchBeam('supportArch_front', -deckWidth * .47, -.5, .26);
  makeArchBeam('supportArch_back', deckWidth * .47, -.5, .26);

  const railZ = deckWidth * .52;
  const makeSideRail = side => {
    const group = new THREE.Group();
    group.name = side < 0 ? 'rail_front' : 'rail_back';
    root.add(group);
    [.82, 1.52].forEach((offset, idx) => {
      const points = [];
      for (let i = 0; i <= segments * 2; i += 1) {
        const x = -width / 2 + width * i / (segments * 2);
        points.push(new THREE.Vector3(x, archY(x) + offset, side * railZ));
      }
      const rail = mark(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), segments * 2, .15, 6, false), red));
      rail.name = `${group.name}_rail_${idx}`;
      group.add(rail);
    });
    for (let i = 0; i < 13; i += 1) {
      const x = -width / 2 + .72 + i * ((width - 1.44) / 12);
      const yBase = archY(x) + .2;
      const h = 1.28;
      const post = mark(new THREE.Mesh(new THREE.BoxGeometry(.2, h, .2), red));
      post.name = `${group.name}_baluster_${i}`;
      post.position.set(x, yBase + h / 2, side * railZ);
      group.add(post);
    }
    [-width / 2, -width * .24, width * .24, width / 2].forEach((x, i) => {
      const baseY = archY(x);
      const h = (options.railHeight ?? 1.8) + .45;
      const post = mark(new THREE.Mesh(new THREE.BoxGeometry(.434, h, .434), red));
      post.name = `${group.name}_mainPost_${i}`;
      post.position.set(x, baseY + h / 2 + .05, side * railZ);
      group.add(post);
      const cap = mark(new THREE.Mesh(new THREE.CylinderGeometry(.23, .29, .24, 6), dark));
      cap.name = `${group.name}_cap_${i}`;
      cap.position.set(x, baseY + h + .19, side * railZ);
      group.add(cap);
      const knob = mark(new THREE.Mesh(new THREE.IcosahedronGeometry(.17, 1), dark));
      knob.name = `${group.name}_knob_${i}`;
      knob.position.set(x, baseY + h + .36, side * railZ);
      group.add(knob);
    });
  };
  makeSideRail(-1);
  makeSideRail(1);

  const makeStoneBase = (x, name) => {
    const base = mark(new THREE.Mesh(new THREE.BoxGeometry(2.1, .48, deckWidth + 1), stone));
    base.name = name;
    base.position.set(x, -.16, 0);
    root.add(base);
  };
  makeStoneBase(-width / 2 + .45, 'stoneBase_L');
  makeStoneBase(width / 2 - .45, 'stoneBase_R');
  root.userData.kumamonScaleReference = { kumamonWidth, kumamonHeight, deckWidth, centerClearance };
  return root;
}
