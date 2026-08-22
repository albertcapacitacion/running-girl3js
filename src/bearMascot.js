// Procedural low-poly bear mascot for Three.js.
// No external model files. The approved proportions and banzai pose are kept intact.

export function createLowPolyBearMascot(THREE) {
  const root = new THREE.Group();
  root.name = 'bearMascot';

  const black = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.88, metalness: 0 });
  const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.82, metalness: 0 });
  const red = new THREE.MeshStandardMaterial({ color: 0xff1832, roughness: 0.84, metalness: 0 });

  const ico = (radius, detail, material, name) => {
    const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(radius, detail), material);
    mesh.name = name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };

  const body = ico(1, 2, black, 'body');
  body.scale.set(1.72, 2.12, 1.03);
  body.position.set(0, 2.55, 0);
  root.add(body);

  const lowerBodyVolume = ico(1, 1, black, 'lowerBodyVolume');
  lowerBodyVolume.scale.set(1.62, 1.42, 1.02);
  lowerBodyVolume.position.set(0, 1.72, 0);
  root.add(lowerBodyVolume);

  const head = ico(1, 2, black, 'head');
  head.scale.set(1.42, 1.18, 1.04);
  head.position.set(0, 4.68, 0.03);
  root.add(head);

  const makeLeg = (x, name) => {
    const leg = ico(1, 1, black, name);
    leg.scale.set(0.48, 0.95, 0.56);
    leg.position.set(x, 0.73, 0);
    root.add(leg);
  };
  makeLeg(-0.70, 'leg_L');
  makeLeg(0.70, 'leg_R');

  const makeRaisedArm = side => {
    const pivot = new THREE.Group();
    pivot.name = side < 0 ? 'armPivot_L' : 'armPivot_R';
    pivot.position.set(side * 1.30, 3.72, 0.02);
    pivot.rotation.z = side * -0.82;
    root.add(pivot);

    const arm = ico(1, 1, black, side < 0 ? 'arm_L' : 'arm_R');
    arm.scale.set(0.34, 1.18, 0.42);
    arm.position.set(0, 0.82, 0);
    pivot.add(arm);

    const paw = ico(1, 1, black, side < 0 ? 'paw_L' : 'paw_R');
    paw.scale.set(0.42, 0.48, 0.46);
    paw.position.set(0, 1.72, 0);
    pivot.add(paw);
  };
  makeRaisedArm(-1);
  makeRaisedArm(1);

  const makeEar = (x, name) => {
    const outer = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.16, 10), black);
    outer.name = name;
    outer.rotation.x = Math.PI / 2;
    outer.position.set(x, 5.56, 0.03);
    outer.castShadow = true;
    outer.receiveShadow = true;
    root.add(outer);

    const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.18, 10), white);
    inner.name = `${name}_inner`;
    inner.rotation.x = Math.PI / 2;
    inner.position.set(x, 5.56, 0.07);
    inner.castShadow = true;
    inner.receiveShadow = true;
    root.add(inner);
  };
  makeEar(-0.98, 'ear_L');
  makeEar(0.98, 'ear_R');

  const faceBlob = (name, x, y, sx, sy, sz, material, z = 1.00, detail = 1) => {
    const mesh = ico(1, detail, material, name);
    mesh.scale.set(sx, sy, sz);
    mesh.position.set(x, y, z);
    root.add(mesh);
    return mesh;
  };

  faceBlob('eyeWhite_L', -0.53, 4.98, 0.29, 0.40, 0.11, white, 0.94);
  faceBlob('eyeWhite_R', 0.53, 4.98, 0.29, 0.40, 0.11, white, 0.94);
  faceBlob('pupil_L', -0.53, 5.00, 0.095, 0.15, 0.055, black, 1.055);
  faceBlob('pupil_R', 0.53, 5.00, 0.095, 0.15, 0.055, black, 1.055);
  faceBlob('cheek_L', -1.08, 4.47, 0.38, 0.38, 0.10, red, 0.91);
  faceBlob('cheek_R', 1.08, 4.47, 0.38, 0.38, 0.10, red, 0.91);
  faceBlob('muzzle', 0, 4.43, 0.70, 0.55, 0.14, white, 0.96);
  faceBlob('nose', 0, 4.68, 0.23, 0.145, 0.075, black, 1.105);
  faceBlob('mouth', 0, 4.29, 0.50, 0.20, 0.055, black, 1.105);
  faceBlob('mouthWhite', 0, 4.20, 0.34, 0.075, 0.035, white, 1.16);

  root.position.y = -0.05;
  return root;
}
