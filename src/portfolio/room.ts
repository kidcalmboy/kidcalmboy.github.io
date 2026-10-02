import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

// All dimensions are metres. Furniture is modelled at ordinary residential scale.
export const ROOM = {
  eye: 1.72,
  spawn: new THREE.Vector3(0.2, 1.72, 2.15),
  seat: new THREE.Vector3(0.2, 1.18, -1.35),
  screen: new THREE.Vector3(0.2, 1.115, -2.05),
  screenTarget: new THREE.Vector3(0.2, 1.115, -2.31),
};

export function buildRoom(scene: THREE.Scene) {
  scene.background = new THREE.Color("#c7d2d7");
  const ambient = new THREE.HemisphereLight("#ecf2ff", "#b8a28a", 1.35);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight("#fff0d7", 3.3);
  sun.position.set(-4, 4.5, -0.8);
  sun.target.position.set(1, 0, 1.2);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, {
    left: -4,
    right: 4,
    top: 4,
    bottom: -4,
    near: 0.1,
    far: 14,
  });
  sun.shadow.normalBias = 0.025;
  sun.shadow.bias = -0.00015;
  sun.shadow.radius = 3;
  scene.add(sun, sun.target);
  const fill = new THREE.PointLight("#efc7bb", 3, 6, 2);
  fill.position.set(1.7, 2.3, 1);
  scene.add(fill);

  let seed = 74;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  function texture(kind: "wood" | "fabric" | "plaster", color: string) {
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 512, 512);
    if (kind === "wood") {
      for (let i = 0; i < 800; i++) {
        const y = random() * 512;
        ctx.strokeStyle = `rgba(65,34,13,${random() * 0.12})`;
        ctx.lineWidth = random() * 1.8 + 0.2;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(
          150,
          y + random() * 14,
          350,
          y - random() * 14,
          512,
          y + random() * 5,
        );
        ctx.stroke();
      }
    } else {
      for (let i = 0; i < 15000; i++) {
        ctx.fillStyle = `rgba(${random() > 0.5 ? "255,255,255" : "30,20,15"},${random() * 0.07})`;
        ctx.fillRect(
          random() * 512,
          random() * 512,
          kind === "fabric" ? 5 : 2,
          1,
        );
      }
      if (kind === "fabric") {
        ctx.strokeStyle = "#ffffff10";
        for (let i = 0; i < 512; i += 3) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, 512);
          ctx.stroke();
        }
      }
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 4;
    return t;
  }
  const oak = new THREE.MeshStandardMaterial({
    map: texture("wood", "#b89169"),
    roughness: 0.62,
  });
  const floorMat = new THREE.MeshStandardMaterial({
    map: texture("wood", "#c8a981"),
    roughness: 0.77,
  });
  const plaster = new THREE.MeshStandardMaterial({
    map: texture("plaster", "#e8e1d6"),
    roughness: 1,
  });
  const linen = new THREE.MeshStandardMaterial({
    map: texture("fabric", "#6e819a"),
    roughness: 1,
  });
  const pink = new THREE.MeshStandardMaterial({
    map: texture("fabric", "#d3a2a0"),
    roughness: 1,
  });
  const cream = new THREE.MeshStandardMaterial({
    map: texture("fabric", "#f0e6d6"),
    roughness: 1,
  });
  const chrome = new THREE.MeshStandardMaterial({
    color: "#a8acb0",
    metalness: 0.83,
    roughness: 0.24,
  });
  const cache = new Map<string, THREE.MeshStandardMaterial>();
  const mat = (value: string | THREE.Material) => {
    if (typeof value !== "string") return value;
    if (!cache.has(value))
      cache.set(
        value,
        new THREE.MeshStandardMaterial({ color: value, roughness: 0.65 }),
      );
    return cache.get(value)!;
  };
  function box(
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    m: string | THREE.Material,
    r = 0,
  ) {
    const mesh = new THREE.Mesh(
      r
        ? new RoundedBoxGeometry(w, h, d, 3, r)
        : new THREE.BoxGeometry(w, h, d),
      mat(m),
    );
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
  }
  function cyl(
    rt: number,
    rb: number,
    h: number,
    x: number,
    y: number,
    z: number,
    m: string | THREE.Material,
  ) {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(rt, rb, h, 32),
      mat(m),
    );
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
  }
  function rod(
    a: THREE.Vector3,
    b: THREE.Vector3,
    r: number,
    m: string | THREE.Material,
  ) {
    const mesh = cyl(r, r, a.distanceTo(b), 0, 0, 0, m);
    mesh.position.copy(a).add(b).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      b.clone().sub(a).normalize(),
    );
    return mesh;
  }
  function label(
    text: string,
    w: number,
    h: number,
    x: number,
    y: number,
    z: number,
    bg: string,
    fg: string,
    font = 30,
  ) {
    const c = document.createElement("canvas");
    c.width = 768;
    c.height = Math.round((768 * h) / w);
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = fg;
    ctx.font = `${font}px monospace`;
    text
      .split("\n")
      .forEach((line, i) => ctx.fillText(line, 40, 60 + i * font * 1.55));
    const map = new THREE.CanvasTexture(c);
    map.colorSpace = THREE.SRGBColorSpace;
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ map }),
    );
    mesh.position.set(x, y, z);
    scene.add(mesh);
    return mesh;
  }
  // 4.6 x 5.4 m room, 2.65 m ceiling; a real opening admits the window light.
  box(4.6, 0.1, 5.4, 0, -0.055, 0, oak);
  for (let row = 0; row < 27; row++)
    for (let col = 0; col < 4; col++) {
      const plank = box(
        1.147,
        0.014,
        0.198,
        -1.725 + col * 1.15,
        0.002,
        -2.6 + row * 0.2,
        floorMat,
      );
      if ((row + col) % 3 === 0) plank.rotation.y = Math.PI;
    }
  box(4.6, 2.65, 0.12, 0, 1.325, -2.75, plaster);
  box(4.6, 2.65, 0.12, 0, 1.325, 2.75, plaster);
  box(0.12, 2.65, 5.4, 2.35, 1.325, 0, plaster);
  box(4.6, 0.1, 5.4, 0, 2.7, 0, "#f4eee5");
  box(0.12, 2.65, 1, -2.35, 1.325, -2.2, plaster);
  box(0.12, 2.65, 2.4, -2.35, 1.325, 1.5, plaster);
  box(0.12, 0.9, 2, -2.35, 0.45, -0.7, plaster);
  box(0.12, 0.3, 2, -2.35, 2.5, -0.7, plaster);
  for (const z of [-2.675, 2.675])
    box(4.6, 0.09, 0.035, 0, 0.045, z, "#eee5d9");
  for (const x of [-2.275, 2.275])
    box(0.035, 0.09, 5.4, x, 0.045, 0, "#eee5d9");
  // Window, sky and distant city silhouettes, sill and pleated curtains.
  const sky = new THREE.MeshBasicMaterial({ color: "#b9d0de" });
  const view = box(0.03, 1.44, 1.98, -2.44, 1.625, -0.7, sky);
  view.castShadow = false;
  for (let i = 0; i < 7; i++) {
    const city = box(
      0.025,
      0.15 + (i % 3) * 0.12,
      0.18,
      -2.42,
      1.0 + (i % 3) * 0.06,
      -1.5 + i * 0.25,
      "#93a6ae",
    );
    city.castShadow = false;
  }
  for (const z of [-1.7, -0.7, 0.3])
    box(0.1, 1.48, 0.045, -2.29, 1.625, z, "#eee7db");
  for (const y of [0.9, 1.625, 2.35])
    box(0.1, 0.045, 2.04, -2.29, y, -0.7, "#eee7db");
  box(0.24, 0.045, 2.16, -2.22, 0.88, -0.7, oak, 0.009);
  rod(
    new THREE.Vector3(-2.1, 2.43, -1.94),
    new THREE.Vector3(-2.1, 2.43, 0.54),
    0.017,
    chrome,
  );
  for (const z of [-1.76, 0.4])
    for (let i = 0; i < 5; i++) {
      const curtain = box(
        0.07,
        1.94,
        0.055,
        -2.12 + Math.sin(i) * 0.035,
        1.37,
        z + i * 0.045,
        cream,
        0.02,
      );
      curtain.castShadow = false;
    }
  // Desk: 75 cm top, 165 cm wide. All devices now have life-sized proportions.
  box(1.65, 0.045, 0.7, 0.2, 0.75, -2.2, oak, 0.015);
  for (const x of [-0.56, 0.96])
    for (const z of [-2.48, -1.92]) cyl(0.022, 0.018, 0.72, x, 0.36, z, chrome);
  box(0.38, 0.59, 0.52, -0.4, 0.315, -2.18, "#e4dbcb", 0.016);
  for (const y of [0.2, 0.39, 0.56]) {
    box(0.34, 0.008, 0.006, -0.4, y, -1.916, "#b3a896");
    box(0.07, 0.012, 0.018, -0.4, y + 0.055, -1.903, chrome, 0.004);
  }
  box(0.22, 0.016, 0.17, 0.2, 0.784, -2.32, chrome, 0.008);
  box(0.035, 0.16, 0.035, 0.2, 0.87, -2.35, chrome, 0.005);
  box(0.645, 0.39, 0.025, 0.2, 1.115, -2.33, "#20242a", 0.012);
  label(
    "kidcalmboy@studio:~\n\nPortfolio / 2026\n\n> welcome_",
    0.605,
    0.342,
    0.2,
    1.115,
    -2.314,
    "#17242c",
    "#cfdfdf",
    35,
  );
  box(0.38, 0.013, 0.13, 0.12, 0.785, -2.005, "#d6d2c7", 0.004);
  for (let row = 0; row < 5; row++)
    for (let col = 0; col < 14; col++)
      box(
        0.022,
        0.007,
        0.019,
        -0.049 + col * 0.0255,
        0.796,
        -2.055 + row * 0.023,
        "#ebe6db",
        0.002,
      );
  box(0.22, 0.003, 0.23, 0.61, 0.775, -2.015, "#725249", 0.008);
  const mouse = box(0.056, 0.024, 0.093, 0.61, 0.789, -2.015, "#d9d2c7", 0.018);
  mouse.rotation.y = -0.08;
  box(0.22, 0.46, 0.44, 1.29, 0.25, -2.22, "#34414a", 0.014);
  for (let i = 0; i < 12; i++)
    box(0.17, 0.006, 0.005, 1.29, 0.14 + i * 0.02, -1.997, "#19232b");
  cyl(
    0.008,
    0.008,
    0.008,
    1.36,
    0.44,
    -1.99,
    new THREE.MeshStandardMaterial({
      color: "#cce6dc",
      emissive: "#9dc7b5",
      emissiveIntensity: 1,
    }),
  ).rotation.x = Math.PI / 2;
  // Task lamp with visible bulb, articulated neck, mug, pen cup, notebook.
  cyl(0.075, 0.08, 0.015, 0.83, 0.787, -2.38, "#933e30");
  rod(
    new THREE.Vector3(0.83, 0.79, -2.38),
    new THREE.Vector3(0.83, 1.11, -2.38),
    0.009,
    chrome,
  );
  rod(
    new THREE.Vector3(0.83, 1.11, -2.38),
    new THREE.Vector3(0.68, 1.22, -2.34),
    0.011,
    chrome,
  );
  const shade = cyl(0.055, 0.105, 0.075, 0.67, 1.22, -2.34, "#a54f3c");
  shade.rotation.z = 0.15;
  cyl(
    0.078,
    0.078,
    0.004,
    0.67,
    1.182,
    -2.34,
    new THREE.MeshStandardMaterial({
      color: "#fff0c8",
      emissive: "#ffd59d",
      emissiveIntensity: 1.5,
    }),
  );
  const lamp = new THREE.PointLight("#ffdaa3", 1.8, 2.5, 2);
  lamp.position.set(0.67, 1.14, -2.34);
  scene.add(lamp);
  cyl(0.037, 0.034, 0.085, -0.39, 0.816, -1.99, "#ece4d6");
  cyl(0.029, 0.029, 0.002, -0.39, 0.86, -1.99, "#584331");
  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.025, 0.006, 10, 24),
    mat("#ece4d6"),
  );
  handle.position.set(-0.344, 0.82, -1.99);
  scene.add(handle);
  box(0.17, 0.017, 0.23, -0.45, 0.788, -2.29, "#83957a", 0.003);
  box(0.15, 0.01, 0.22, -0.45, 0.798, -2.29, "#ddd2b9");
  cyl(0.035, 0.03, 0.095, -0.52, 0.82, -2.43, "#748989");
  for (let i = 0; i < 5; i++)
    cyl(
      0.003,
      0.003,
      0.14,
      -0.54 + i * 0.009,
      0.88,
      -2.43,
      ["#c89558", "#3d4345", "#b97166"][i % 3],
    );
  // Ergonomic chair: 46 cm seat, rounded blue upholstery and five-star base.
  box(0.48, 0.085, 0.46, 0.2, 0.46, -1.35, linen, 0.035);
  const back = box(0.46, 0.43, 0.07, 0.2, 0.77, -1.115, linen, 0.045);
  back.rotation.x = -0.1;
  rod(
    new THREE.Vector3(0.2, 0.28, -1.35),
    new THREE.Vector3(0.2, 0.49, -1.35),
    0.028,
    chrome,
  );
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    const tip = new THREE.Vector3(
      0.2 + Math.sin(angle) * 0.29,
      0.065,
      -1.35 + Math.cos(angle) * 0.29,
    );
    rod(new THREE.Vector3(0.2, 0.16, -1.35), tip, 0.018, chrome);
    const wheel = cyl(0.035, 0.035, 0.035, tip.x, 0.036, tip.z, "#242931");
    wheel.rotation.z = Math.PI / 2;
  }
  for (const x of [-0.075, 0.475]) {
    rod(
      new THREE.Vector3(x, 0.46, -1.23),
      new THREE.Vector3(x, 0.66, -1.23),
      0.012,
      chrome,
    );
    box(0.045, 0.035, 0.27, x, 0.67, -1.31, "#333c45", 0.015);
  }
  // Bed, softly deformed duvet and pillows; fabric weave instead of flat blocks.
  box(1.16, 0.2, 2.08, -1.58, 0.19, 0.35, oak, 0.018);
  box(1.16, 0.78, 0.06, -1.58, 0.42, -0.71, oak, 0.018);
  for (const x of [-2.05, -1.11])
    for (const z of [-0.48, 1.15]) box(0.045, 0.12, 0.045, x, 0.06, z, oak);
  box(1.13, 0.17, 2, -1.58, 0.37, 0.35, cream, 0.06);
  const duvet = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, 1.48, 44, 50),
    linen,
  );
  const pos = duvet.geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i),
      y = pos.getY(i);
    pos.setZ(
      i,
      0.018 * Math.sin(x * 29 + y * 8) +
        0.009 * Math.cos(y * 31) +
        0.022 * Math.sin(y * 5),
    );
  }
  duvet.geometry.computeVertexNormals();
  duvet.rotation.x = -Math.PI / 2;
  duvet.position.set(-1.58, 0.482, 0.64);
  duvet.receiveShadow = true;
  duvet.castShadow = true;
  duvet.material.side = THREE.DoubleSide;
  scene.add(duvet);
  box(0.065, 0.18, 1.46, -2.14, 0.41, 0.64, linen, 0.025);
  box(0.065, 0.18, 1.46, -1.02, 0.41, 0.64, linen, 0.025);
  const pillow = box(0.72, 0.14, 0.42, -1.57, 0.51, -0.38, cream, 0.065);
  pillow.rotation.y = -0.04;
  box(1.14, 0.035, 0.37, -1.58, 0.52, 0.99, pink, 0.017);
  // Bedside table, paperback and warm lamp.
  box(0.36, 0.43, 0.38, -1.85, 0.23, -1.12, "#947459", 0.015);
  box(0.3, 0.025, 0.23, -1.84, 0.46, -1.1, "#b87763");
  cyl(0.055, 0.07, 0.013, -1.86, 0.484, -1.13, chrome);
  cyl(0.006, 0.006, 0.16, -1.86, 0.56, -1.13, chrome);
  cyl(0.055, 0.11, 0.13, -1.86, 0.68, -1.13, "#e4c8b3");
  // Wall shelf with varied books; bulletin board and printed study material.
  box(1.1, 0.03, 0.22, 0.65, 1.74, -2.53, oak, 0.005);
  for (let i = 0; i < 12; i++) {
    const h = 0.18 + (i % 3) * 0.024;
    box(
      0.045,
      h,
      0.15,
      0.17 + i * 0.062,
      1.755 + h / 2,
      -2.52,
      ["#a76853", "#c5bd9b", "#455c7c", "#869385", "#e6c0b3"][i % 5],
      0.002,
    );
  }
  box(0.55, 0.43, 0.025, -0.62, 1.37, -2.67, "#a08361", 0.005);
  label(
    "COMPUTER\nSCIENCE\n\nnotes / ideas",
    0.19,
    0.27,
    -0.73,
    1.38,
    -2.651,
    "#eee6d5",
    "#363c44",
    55,
  );
  label(
    "01\nBUILD\nLEARN",
    0.17,
    0.22,
    -0.48,
    1.4,
    -2.65,
    "#dcb8b1",
    "#634e4a",
    65,
  );
  box(0.008, 0.008, 0.006, -0.48, 1.49, -2.643, "#9b302c");
  label(
    "MAKE\nSOMETHING\nREAL.",
    0.44,
    0.56,
    1.69,
    1.64,
    -2.676,
    "#b3c1d1",
    "#273f53",
    90,
  );
  // Rug, storage, leafy plant, wall clock and everyday objects.
  box(1.55, 0.009, 1.6, 0.14, 0.015, 0.05, pink, 0.004);
  for (let i = 0; i < 7; i++)
    box(1.51, 0.002, 0.012, 0.14, 0.021, -0.68 + i * 0.23, "#bd908f");
  box(0.49, 0.67, 0.43, 1.97, 0.34, -2.12, "#c8c5b4", 0.012);
  for (const y of [0.24, 0.47]) {
    box(0.45, 0.005, 0.003, 1.97, y, -1.9, "#94988a");
    box(0.085, 0.014, 0.02, 1.97, y + 0.08, -1.883, chrome, 0.005);
  }
  cyl(0.09, 0.065, 0.16, 1.95, 0.76, -2.12, "#b37d62");
  for (let i = 0; i < 9; i++) {
    const a = i * 2.4;
    const base = new THREE.Vector3(1.95, 0.81, -2.12),
      tip = new THREE.Vector3(
        1.95 + Math.cos(a) * 0.16,
        0.99 + (i % 3) * 0.08,
        -2.12 + Math.sin(a) * 0.13,
      );
    rod(base, tip, 0.004, "#556c3d");
    const leaf = new THREE.Mesh(
      new THREE.SphereGeometry(1, 16, 12),
      mat(i % 2 ? "#637f48" : "#809158"),
    );
    leaf.scale.set(0.045, 0.11, 0.018);
    leaf.position.copy(tip);
    leaf.rotation.set(0.2, a, Math.cos(a) * 0.7);
    leaf.castShadow = true;
    scene.add(leaf);
  }
  const clock = cyl(0.13, 0.13, 0.025, -1.56, 1.93, -2.67, "#e2d7bf");
  clock.rotation.x = Math.PI / 2;
  box(0.008, 0.092, 0.006, -1.56, 1.975, -2.65, "#393d3c");
  const hand = box(0.075, 0.008, 0.006, -1.53, 1.93, -2.648, "#393d3c");
  hand.rotation.z = 0.4;
  // Door and handle establish an immediately recognisable human scale.
  box(0.83, 2.05, 0.045, 1.45, 1.025, 2.665, oak, 0.008);
  box(0.9, 0.05, 0.075, 1.45, 2.07, 2.63, "#e6dbc9");
  for (const x of [0.995, 1.905])
    box(0.05, 2.09, 0.075, x, 1.045, 2.63, "#e6dbc9");
  box(0.085, 0.015, 0.045, 1.12, 1.02, 2.62, chrome, 0.006);
  box(0.085, 0.085, 0.01, 2.03, 1.15, 2.68, "#f4eee3", 0.005);
}
