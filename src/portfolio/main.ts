import * as THREE from "three";
import { profile } from "./profile";
import "./style.css";

document.querySelector("#root")!.innerHTML = `
<div id="scene" tabindex="0" aria-label="3D 학생 방. WASD로 이동하고 마우스로 둘러보세요. 컴퓨터 앞으로 다가가면 터미널이 열립니다."></div>
<header id="masthead"><span class="edition">PERSONAL SPACE — 001</span><h1>KIDCALMBOY</h1><a href="https://github.com/kidcalmboy" target="_blank" rel="noopener noreferrer">GITHUB ↗</a></header>
<div id="room-ui"><div class="crosshair" aria-hidden="true">+</div><div class="room-title"><span>THE ROOM</span><p id="proximity">컴퓨터 앞으로 걸어가세요.</p></div><div class="controls"><span>W A S D &nbsp; 이동</span><span>드래그 &nbsp; 둘러보기</span><span>화면 클릭 &nbsp; 마우스 시점 · ESC 해제</span></div><span class="room-index">01 — EXPLORATION</span><div class="touch-pad" aria-label="이동 버튼"><button data-move="KeyW" aria-label="앞으로 이동">↑</button><button data-move="KeyA" aria-label="왼쪽으로 이동">←</button><button data-move="KeyS" aria-label="뒤로 이동">↓</button><button data-move="KeyD" aria-label="오른쪽으로 이동">→</button></div></div>
<button id="fallback-entry" hidden>터미널 열기</button>
<section id="terminal" aria-label="포트폴리오 터미널" hidden><div class="terminal-bar"><span>KIDCALMBOY / TERMINAL</span><button id="exit" aria-label="방으로 돌아가기">ESC &nbsp; EXIT ↗</button></div><div id="terminal-body"><div id="log" role="log" aria-live="polite"></div><form id="command-form"><label for="command">guest@kidcalmboy:~$</label><input id="command" aria-label="터미널 명령어" autocomplete="off" autocapitalize="off" spellcheck="false"></form></div><div class="terminal-bottom"><span>SESSION 001 &nbsp; / &nbsp; CONNECTED</span><span>TAB 자동완성 &nbsp; ↑↓ 기록</span><div class="quick-commands">${["help", "about", "projects", "skills", "contact"].map((c) => '<button data-command="' + c + '">' + c + "</button>").join("")}</div></div></section>`;
const $ = <T extends HTMLElement = HTMLElement>(id: string) =>
  document.getElementById(id) as T;
let mode: "room" | "seating" | "terminal" = "room";
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const scene = new THREE.Scene();
scene.background = new THREE.Color("#c6c6c3");
scene.fog = new THREE.Fog("#c6c6c3", 12, 24);
const camera = new THREE.PerspectiveCamera(
  Fifty(),
  innerWidth / innerHeight,
  0.1,
  40,
);
function Fifty() {
  return innerWidth < 700 ? 72 : 64;
}
camera.position.set(0.1, 1.68, 4.6);
camera.lookAt(0.1, 1.68, -3.1);
let renderer: THREE.WebGLRenderer | undefined;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  $("scene").append(renderer.domElement);
} catch {
  $("scene").innerHTML =
    '<p class="fallback">3D 화면을 사용할 수 없습니다. 아래 버튼으로 포트폴리오에 입장하세요.</p>';
  $("fallback-entry").hidden = false;
}
scene.add(new THREE.HemisphereLight("#ffffff", "#9a9a97", 2.8));
const lamp = new THREE.PointLight("#ffffff", 17, 9, 2);
lamp.position.set(1.35, 2.35, -2.4);
lamp.castShadow = true;
lamp.shadow.mapSize.set(1024, 1024);
scene.add(lamp);
const moon = new THREE.DirectionalLight("#ffffff", 3.2);
moon.position.set(-5, 5, -1);
scene.add(moon);
const materials = new Map<string, THREE.MeshStandardMaterial>();
function monochrome(color: string) {
  const c = new THREE.Color(color);
  const value = c.r * 0.2126 + c.g * 0.7152 + c.b * 0.0722;
  return new THREE.Color().setRGB(value, value, value);
}
function mat(color: string) {
  if (!materials.has(color))
    materials.set(
      color,
      new THREE.MeshStandardMaterial({
        color: monochrome(color),
        roughness: 0.65,
      }),
    );
  return materials.get(color)!;
}
function box(
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number,
  color: string,
) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}
function cylinder(
  r: number,
  h: number,
  x: number,
  y: number,
  z: number,
  color: string,
) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 24), mat(color));
  m.position.set(x, y, z);
  m.castShadow = true;
  scene.add(m);
  return m;
}
function sign(
  text: string,
  w: number,
  h: number,
  x: number,
  y: number,
  z: number,
  bg: string,
  fg: string,
  size = 40,
) {
  const c = document.createElement("canvas");
  c.width = 768;
  c.height = 384;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#" + monochrome(bg).getHexString();
  ctx.fillRect(0, 0, 768, 384);
  ctx.fillStyle = "#" + monochrome(fg).getHexString();
  ctx.font = `${size}px monospace`;
  text.split("\n").forEach((line, i) => ctx.fillText(line, 45, 80 + i * 58));
  const tx = new THREE.CanvasTexture(c);
  tx.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: tx }),
  );
  m.position.set(x, y, z);
  scene.add(m);
  return m;
}
// Architectural shell and individually laid wooden floorboards.
box(9, 0.15, 10, 0, -0.1, 0, "#6b5542");
for (let i = 0; i < 18; i++)
  for (let j = 0; j < 5; j++)
    box(
      0.485,
      0.025,
      1.98,
      -4.25 + i * 0.5,
      0,
      -4 + j * 2 + (i % 2) * 0.12,
      ["#77634e", "#806c54", "#705c48"][i % 3],
    );
box(9, 4, 0.16, 0, 2, -4, "#d6d6d3");
box(0.16, 4, 10, -4.5, 2, 1, "#d9d9d6");
box(9, 0.13, 0.12, 0, 0.1, -3.85, "#a5a28c");
box(0.16, 4, 10, 4.5, 2, 1, "#d6d6d3");
box(9, 4, 0.16, 0, 2, 6, "#d9d9d6");
box(9, 0.12, 10, 0, 4.05, 1, "#e4e4e1");
box(9, 0.15, 1, 0, -0.1, 5.5, "#6b5542");
box(0.95, 2.5, 0.07, 2.7, 1.25, 5.88, "#706b55");
box(0.09, 0.09, 0.08, 2.35, 1.2, 5.81, "#b8ad88");
// Blue evening window and mullions.
box(0.07, 2.2, 2.7, -4.39, 2.4, -1.9, "#c5c1a7");
box(0.08, 1.95, 2.45, -4.33, 2.4, -1.9, "#263d55");
box(0.12, 2, 0.06, -4.25, 2.4, -1.9, "#b5b7a7");
box(0.12, 0.07, 2.45, -4.25, 2.4, -1.9, "#b5b7a7");
box(0.5, 0.1, 2.9, -4.2, 1.3, -1.9, "#c2bda5");
// Desk, computer and keyboard.
box(3.5, 0.14, 1.35, 0.3, 1.12, -2.8, "#aaaaaa");
for (const x of [-1.2, 1.8])
  for (const z of [-3.3, -2.3]) box(0.09, 1.1, 0.09, x, 0.55, z, "#292e2b");
box(0.65, 0.06, 0.4, 0.1, 1.23, -3, "#292e30");
box(0.09, 0.38, 0.09, 0.1, 1.43, -3.1, "#333a39");
const monitor = box(1.65, 0.94, 0.1, 0.1, 1.95, -3.1, "#222827");
const display = sign(
  "KIDCALMBOY\n\nterminal ready_",
  1.52,
  0.81,
  0.1,
  1.96,
  -3.039,
  "#111e20",
  "#78a38e",
  32,
);
box(0.95, 0.05, 0.34, 0, 1.23, -2.45, "#d2c9ad");
for (let r = 0; r < 4; r++)
  for (let c = 0; c < 13; c++)
    box(
      0.055,
      0.018,
      0.045,
      -0.43 + c * 0.068,
      1.265,
      -2.57 + r * 0.072,
      "#8e9485",
    );
box(0.48, 0.018, 0.43, 0.88, 1.205, -2.43, "#3c4945");
box(0.12, 0.06, 0.19, 0.88, 1.245, -2.43, "#d2c9ad");
box(0.42, 0.82, 0.7, 1.42, 0.48, -2.9, "#313a37");
for (let i = 0; i < 8; i++)
  box(0.3, 0.015, 0.01, 1.42, 0.5 + i * 0.035, -2.544, "#58635a");
box(0.035, 0.035, 0.015, 1.54, 0.81, -2.538, "#b8dd93");
// Desk lamp, mug, notebook and pencils.
cylinder(0.18, 0.04, 1.55, 1.22, -3, "#283c33");
cylinder(0.025, 0.75, 1.55, 1.6, -3, "#334439");
const shade = new THREE.Mesh(
  new THREE.ConeGeometry(0.26, 0.28, 32, 1, true),
  mat("#d1c09a"),
);
shade.position.set(1.55, 2.04, -3);
scene.add(shade);
cylinder(0.095, 0.18, -0.85, 1.29, -2.55, "#e1d6be");
cylinder(0.078, 0.006, -0.85, 1.383, -2.55, "#48352a");
box(0.43, 0.045, 0.55, -1, 1.23, -3.02, "#a6ad8c");
// Chair.
box(0.7, 0.12, 0.65, 0.1, 0.68, -1.5, "#3e5148");
box(0.7, 0.68, 0.12, 0.1, 1.03, -1.18, "#3e5148");
cylinder(0.055, 0.58, 0.1, 0.32, -1.5, "#333a34");
box(0.8, 0.07, 0.08, 0.1, 0.09, -1.5, "#333a34");
box(0.08, 0.07, 0.8, 0.1, 0.09, -1.5, "#333a34");
// Student bed and soft folded blanket.
box(1.65, 0.36, 2.8, -3.2, 0.25, 1.4, "#8a7359");
box(1.63, 0.25, 2.75, -3.2, 0.54, 1.4, "#d5d0b9");
box(1.65, 0.12, 1.6, -3.2, 0.71, 1.95, "#7e978a");
box(1.23, 0.17, 0.57, -3.2, 0.76, 0.46, "#e5ddc7");
box(1.75, 0.85, 0.12, -3.2, 0.6, -0.05, "#8b765d");
// Wall shelves with books and notes.
for (const y of [2.45, 3.18]) {
  box(1.65, 0.09, 0.32, 2.75, y, -3.65, "#ae9270");
  for (let i = 0; i < 8; i++) {
    const h = 0.3 + (i % 3) * 0.08;
    box(
      0.1,
      h,
      0.23,
      2.08 + i * 0.16,
      y + h / 2 + 0.05,
      -3.64,
      ["#c9c3a0", "#455e58", "#aa795c", "#737e8d"][i % 4],
    );
  }
}
sign(
  "BUILD.\nBREAK.\nLEARN.",
  0.7,
  0.9,
  -1.8,
  2.7,
  -3.905,
  "#d7d1b8",
  "#394b40",
  64,
);
sign(
  "while (curious) {\n  keepBuilding();\n}",
  1.1,
  0.58,
  0.1,
  3.1,
  -3.903,
  "#283e36",
  "#b4c6a3",
  40,
);
sign(
  "TODO\nmake something\nthat matters.",
  0.37,
  0.32,
  0.99,
  2.42,
  -3.905,
  "#cab779",
  "#544f3d",
  40,
);
// Rug, side cabinet and plant.
box(2.8, 0.025, 2.6, 0.35, 0.035, 0.5, "#555f50");
for (let i = 0; i < 8; i++)
  box(2.65, 0.005, 0.014, 0.35, 0.052, -0.65 + i * 0.32, "#8a8c6b");
box(0.95, 0.95, 0.75, 3.25, 0.48, -2.7, "#9a805f");
for (const y of [0.25, 0.57, 0.84]) {
  box(0.85, 0.02, 0.02, 3.25, y, -2.319, "#655944");
  box(0.18, 0.035, 0.03, 3.25, y + 0.08, -2.3, "#3d4437");
}
cylinder(0.18, 0.3, 3.25, 1.13, -2.7, "#b0a58a");
for (let i = 0; i < 7; i++) {
  const leaf = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 12, 8),
    mat("#526e47"),
  );
  leaf.scale.set(0.45, 2, 1);
  leaf.position.set(
    3.25 + Math.sin(i * 2) * 0.17,
    1.48 + (i % 2) * 0.16,
    -2.7 + Math.cos(i * 2) * 0.15,
  );
  leaf.rotation.z = Math.sin(i) * 0.6;
  scene.add(leaf);
}

const keys = new Set<string>();
const euler = new THREE.Euler(0, 0, 0, "YXZ");
euler.setFromQuaternion(camera.quaternion);
const surface = $("scene");
let dragging = false,
  lastX = 0,
  lastY = 0,
  seatStart = 0;
const startPos = new THREE.Vector3(),
  startQuat = new THREE.Quaternion();
const seatPos = new THREE.Vector3(0.1, 1.75, -1.65);
const screenPos = new THREE.Vector3(0.1, 1.96, -2.67);
const targetCamera = camera.clone();
targetCamera.position.copy(seatPos);
targetCamera.lookAt(0.1, 1.96, -3.1);
const screenQuat = new THREE.Quaternion();
function sit() {
  if (mode !== "room") return;
  keys.clear();
  dragging = false;
  if (document.pointerLockElement) document.exitPointerLock();
  mode = "seating";
  $("room-ui").hidden = true;
  document.body.classList.add("seating");
  startPos.copy(camera.position);
  startQuat.copy(camera.quaternion);
  seatStart = performance.now();
}
function openTerminal() {
  keys.clear();
  dragging = false;
  mode = "terminal";
  $("terminal").hidden = false;
  $("room-ui").hidden = true;
  $("masthead").hidden = true;
  surface.inert = true;
  document.body.classList.remove("seating");
  document.body.classList.add("terminal-open");
  if (!$("log").children.length) {
    line("KIDCALM OS [Version 1.0]", "muted");
    line("Welcome to " + profile.name + ".", "welcome");
    line(
      "명령어를 입력해 포트폴리오를 탐색하세요. help로 명령어를 확인할 수 있습니다.",
    );
    run("help", false);
  }
  $<HTMLInputElement>("command").focus({ preventScroll: true });
}
function leave() {
  keys.clear();
  mode = "room";
  $("terminal").hidden = true;
  $("room-ui").hidden = false;
  $("masthead").hidden = false;
  surface.inert = false;
  document.body.classList.remove("terminal-open");
  camera.position.set(0.1, 1.68, -0.1);
  camera.quaternion.identity();
  euler.setFromQuaternion(camera.quaternion);
  surface.focus({ preventScroll: true });
}
$("exit").onclick = leave;
$("fallback-entry").onclick = openTerminal;
function look(dx: number, dy: number) {
  euler.y -= dx * 0.003;
  euler.x = THREE.MathUtils.clamp(euler.x - dy * 0.003, -1.1, 1.1);
  camera.quaternion.setFromEuler(euler);
}
surface.onpointerdown = (e) => {
  if (mode !== "room") return;
  surface.focus({ preventScroll: true });
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
  surface.setPointerCapture(e.pointerId);
};
surface.onpointerup = (e) => {
  dragging = false;
  if (
    e.pointerType === "mouse" &&
    mode === "room" &&
    !document.pointerLockElement
  ) {
    // Pointer lock is optional; drag remains usable if the browser refuses it.
    surface.requestPointerLock?.()?.catch(() => {});
  }
};
surface.onpointercancel = () => (dragging = false);
surface.onpointermove = (e) => {
  if (mode !== "room" || document.pointerLockElement) return;
  if (dragging) look(e.clientX - lastX, e.clientY - lastY);
  lastX = e.clientX;
  lastY = e.clientY;
};
document.addEventListener("mousemove", (e) => {
  if (mode === "room" && document.pointerLockElement === surface)
    look(e.movementX, e.movementY);
});
const movementCodes = [
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
];
window.addEventListener("keydown", (e) => {
  if (mode === "terminal") {
    if (e.code === "Escape") {
      e.preventDefault();
      leave();
    }
    return;
  }
  if (mode !== "room" || (e.target as HTMLElement).closest("input,textarea"))
    return;
  if (movementCodes.includes(e.code)) {
    e.preventDefault();
    keys.add(e.code);
  }
});
window.addEventListener("keyup", (e) => keys.delete(e.code));
window.addEventListener("blur", () => {
  keys.clear();
  dragging = false;
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) keys.clear();
});
document
  .querySelectorAll<HTMLButtonElement>("[data-move]")
  .forEach((button) => {
    button.onpointerdown = (e) => {
      e.preventDefault();
      if (mode === "room") keys.add(button.dataset.move!);
      button.setPointerCapture(e.pointerId);
    };
    button.onpointerup = button.onpointercancel = () =>
      keys.delete(button.dataset.move!);
    button.onlostpointercapture = () => keys.delete(button.dataset.move!);
  });
function blocked(x: number, z: number) {
  return (
    (x < -2.12 && z > -0.4 && z < 3.15) ||
    (x > -1.7 && x < 2.3 && z < -1.98) ||
    (x > 2.48 && z < -2.05)
  );
}
let previous = performance.now();
function animate(now: number) {
  requestAnimationFrame(animate);
  const dt = Math.min((now - previous) / 1000, 0.05);
  previous = now;
  if (mode === "seating") {
    const t = reduced ? 1 : Math.min((now - seatStart) / 1400, 1);
    const ease = (n: number) => n * n * (3 - 2 * n);
    if (t < 0.55) {
      camera.position.lerpVectors(startPos, seatPos, ease(t / 0.55));
      camera.quaternion.slerpQuaternions(
        startQuat,
        targetCamera.quaternion,
        ease(t / 0.55),
      );
    } else {
      camera.position.lerpVectors(seatPos, screenPos, ease((t - 0.55) / 0.45));
      camera.quaternion.slerpQuaternions(
        targetCamera.quaternion,
        screenQuat,
        ease((t - 0.55) / 0.45),
      );
    }
    if (t === 1) openTerminal();
  }
  if (mode === "room") {
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const side = new THREE.Vector3().crossVectors(forward, camera.up);
    const move = new THREE.Vector3();
    if (keys.has("KeyW") || keys.has("ArrowUp")) move.add(forward);
    if (keys.has("KeyS") || keys.has("ArrowDown")) move.sub(forward);
    if (keys.has("KeyD") || keys.has("ArrowRight")) move.add(side);
    if (keys.has("KeyA") || keys.has("ArrowLeft")) move.sub(side);
    move.normalize().multiplyScalar(dt * 2.5);
    const x = THREE.MathUtils.clamp(camera.position.x + move.x, -4.1, 4.1);
    const z = THREE.MathUtils.clamp(camera.position.z + move.z, -3.5, 5.65);
    if (!blocked(x, camera.position.z)) camera.position.x = x;
    if (!blocked(camera.position.x, z)) camera.position.z = z;
    const atDesk =
      Math.abs(camera.position.x - 0.1) < 0.65 &&
      camera.position.z < -0.93 &&
      camera.position.z > -1.98;
    const facingScreen = forward.z < -0.65;
    const near =
      Math.abs(camera.position.x - 0.1) < 1.1 && camera.position.z < 1;
    $("proximity").textContent = near
      ? "앞으로 다가가면 컴퓨터를 사용합니다."
      : "컴퓨터 앞으로 걸어가세요.";
    if (atDesk && facingScreen && move.lengthSq() > 0) sit();
  }
  if (mode !== "terminal") renderer?.render(scene, camera);
}
requestAnimationFrame(animate);
addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.fov = Fifty();
  camera.updateProjectionMatrix();
  renderer?.setSize(innerWidth, innerHeight);
});
const commands = [
  "help",
  "about",
  "projects",
  "skills",
  "contact",
  "github",
  "whoami",
  "clear",
  "exit",
];
const history: string[] = [];
let cursor = 0;
function line(value: string, cls = "") {
  const div = document.createElement("div");
  div.className = `output ${cls}`;
  div.textContent = value;
  $("log").append(div);
}
function link(text: string, url: string) {
  const a = document.createElement("a");
  a.textContent = text + " ↗";
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.className = "output terminal-link";
  $("log").append(a);
}
function run(raw: string, echo = true) {
  const command = raw.trim().toLowerCase();
  if (echo) line(`guest@kidcalmboy ~ $ ${raw}`, "echo");
  switch (command) {
    case "help":
      line("AVAILABLE COMMANDS", "muted");
      line(
        "about       저에 대해\nprojects    프로젝트 목록\nskills      사용 기술\ncontact     연락처\ngithub      GitHub 프로필\nwhoami      현재 사용자\nclear       화면 지우기\nexit        방으로 돌아가기",
      );
      line("TIP  Tab 자동완성 · ↑↓ 이전 명령어", "muted");
      break;
    case "about":
      line(profile.name + " / " + profile.role, "heading");
      line(profile.about);
      break;
    case "projects":
      line("PROJECTS / 작업의 기록", "heading");
      if (!profile.projects.length)
        line(
          "프로젝트 목록을 준비 중입니다.\n공개 저장소는 GitHub에서 확인할 수 있습니다.",
        );
      profile.projects.forEach((p, i) => {
        line(`${String(i + 1).padStart(2, "0")}  ${p.name}\n${p.description}`);
        link("프로젝트 보기", p.url);
      });
      link("GitHub 저장소 보기", profile.github + "?tab=repositories");
      break;
    case "skills":
      line("SKILLS", "heading");
      line(profile.skills);
      break;
    case "contact":
      line("LET’S CONNECT", "heading");
      line("GitHub에서 저의 작업과 활동을 만나보세요.");
      link("github.com/kidcalmboy", profile.github);
      break;
    case "github":
      link("github.com/kidcalmboy", profile.github);
      break;
    case "whoami":
      line("guest — 제 작은 방에 방문한 당신. 환영합니다.");
      break;
    case "clear":
      $("log").replaceChildren();
      break;
    case "exit":
      leave();
      break;
    case "":
      break;
    default:
      line(
        `명령어를 찾을 수 없습니다: ${raw}\nhelp를 입력하면 사용 가능한 명령어가 나옵니다.`,
        "error",
      );
  }
  requestAnimationFrame(
    () => ($("terminal-body").scrollTop = $("terminal-body").scrollHeight),
  );
}
$("command-form").onsubmit = (e) => {
  e.preventDefault();
  const input = $<HTMLInputElement>("command");
  if (input.value.trim()) {
    history.push(input.value);
    cursor = history.length;
    run(input.value);
  }
  input.value = "";
};
$("command").onkeydown = (e) => {
  const input = e.target as HTMLInputElement;
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    e.preventDefault();
    cursor = Math.max(
      0,
      Math.min(history.length, cursor + (e.key === "ArrowUp" ? -1 : 1)),
    );
    input.value = history[cursor] ?? "";
  }
  if (e.key === "Tab") {
    e.preventDefault();
    const found = commands.filter((c) =>
      c.startsWith(input.value.trim().toLowerCase()),
    );
    if (found.length === 1) input.value = found[0];
    else if (found.length) {
      line(found.join("  "), "muted");
      $("terminal-body").scrollTop = $("terminal-body").scrollHeight;
    }
  }
};
document.querySelectorAll<HTMLButtonElement>("[data-command]").forEach(
  (button) =>
    (button.onclick = () => {
      run(button.dataset.command!);
      $<HTMLInputElement>("command").focus();
    }),
);
