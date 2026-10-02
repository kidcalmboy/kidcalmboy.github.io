import * as THREE from "three";
import { profile } from "./profile";
import "./style.css";

document.querySelector("#root")!.innerHTML = `
<div id="scene" aria-label="컴공 학생의 3D 방"></div>
<div class="grain"></div>
<header><a class="brand" href="#">k<span>.</span></a><div class="site-label">KIDCALMBOY <span>/ PERSONAL SPACE</span></div><button id="skip">터미널 바로가기 <span>↗</span></button></header>
<main id="intro"><div class="eyebrow"><i></i> WELCOME TO MY LITTLE CORNER</div><h1>A room full<br>of <em>possibilities.</em></h1><p>생각하고, 만들고, 가끔은 밤을 새우는 곳.<br>제 방에 오신 걸 환영합니다.</p><button class="primary" id="enter">컴퓨터 앞에 앉기 <span>↗</span></button><div class="intro-note">방을 드래그해 둘러보세요</div></main>
<div id="room-ui"><div class="room-caption"><span>01 / THE ROOM</span><strong>조금 늦은 밤, 새로운 시작.</strong></div><button id="interact" hidden> E &nbsp; 컴퓨터에 앉기</button><div class="controls"><kbd>W A S D</kbd> 이동 <b>·</b> 드래그 시점 <b>·</b> <kbd>E</kbd> 앉기</div></div>
<footer><span>DESIGNED TO BE EXPLORED</span><span><i></i> OPEN TO POSSIBILITIES</span><span>SCROLL LESS. EXPLORE MORE. ↗</span></footer>
<section id="terminal" aria-label="포트폴리오 터미널" hidden><div class="terminal-window"><div class="terminal-bar"><div class="dots"><b></b><b></b><b></b></div><span>guest@kidcalmboy: ~</span><button id="exit" aria-label="방으로 돌아가기">방으로 돌아가기 ↗</button></div><div id="terminal-body"><div id="log" role="log" aria-live="polite"></div><form id="command-form"><label for="command">guest<span>@</span>kidcalmboy <b>~</b> $</label><input id="command" aria-label="터미널 명령어" autocomplete="off" autocapitalize="off" spellcheck="false"></form></div><div class="terminal-bottom"><span><i></i> CONNECTED TO MY WORLD</span><span>Tab 자동완성 · ↑↓ 기록 · Esc 나가기</span></div></div><div class="quick-commands">${["help", "about", "projects", "skills", "contact"].map((c) => `<button data-command="${c}">${c}</button>`).join("")}</div></section>`;
const $ = <T extends HTMLElement = HTMLElement>(id: string) =>
  document.getElementById(id) as T;
let mode: "room" | "seating" | "terminal" = "room";
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const scene = new THREE.Scene();
scene.background = new THREE.Color("#202a29");
scene.fog = new THREE.Fog("#202a29", 12, 24);
const camera = new THREE.PerspectiveCamera(
  Fifty(),
  innerWidth / innerHeight,
  0.1,
  40,
);
function Fifty() {
  return innerWidth < 700 ? 65 : 53;
}
camera.position.set(3.3, 2.15, 5.6);
camera.lookAt(-0.25, 1.35, -1.8);
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
    '<p class="fallback">3D 화면을 사용할 수 없습니다. 터미널 바로가기로 포트폴리오를 볼 수 있어요.</p>';
}
scene.add(new THREE.HemisphereLight("#b1cbd3", "#403127", 1.6));
const lamp = new THREE.PointLight("#ffd294", 34, 9, 2);
lamp.position.set(1.35, 2.35, -2.4);
lamp.castShadow = true;
lamp.shadow.mapSize.set(1024, 1024);
scene.add(lamp);
const moon = new THREE.DirectionalLight("#9ac6d8", 2.4);
moon.position.set(-5, 5, -1);
scene.add(moon);
const materials = new Map<string, THREE.MeshStandardMaterial>();
function mat(color: string) {
  if (!materials.has(color))
    materials.set(
      color,
      new THREE.MeshStandardMaterial({ color, roughness: 0.8 }),
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
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 768, 384);
  ctx.fillStyle = fg;
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
box(9, 4, 0.16, 0, 2, -4, "#657069");
box(0.16, 4, 10, -4.5, 2, 1, "#747c70");
box(9, 0.13, 0.12, 0, 0.1, -3.85, "#a5a28c");
box(0.16, 4, 10, 4.5, 2, 1, "#657069");
box(9, 4, 0.16, 0, 2, 6, "#747c70");
box(9, 0.12, 10, 0, 4.05, 1, "#8c9180");
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
box(3.5, 0.14, 1.35, 0.3, 1.12, -2.8, "#ae8e63");
for (const x of [-1.2, 1.8])
  for (const z of [-3.3, -2.3]) box(0.09, 1.1, 0.09, x, 0.55, z, "#292e2b");
box(0.65, 0.06, 0.4, 0.1, 1.23, -3, "#292e30");
box(0.09, 0.38, 0.09, 0.1, 1.43, -3.1, "#333a39");
const monitor = box(1.65, 0.94, 0.1, 0.1, 1.95, -3.1, "#222827");
const display = sign(
  "SYSTEM OFF\n\n[ press E to power on ]",
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
let dragging = false,
  lastX = 0,
  lastY = 0;
const euler = new THREE.Euler(0, 0, 0, "YXZ");
euler.setFromQuaternion(camera.quaternion);
let seatStart = 0;
const startPos = new THREE.Vector3(),
  startQuat = new THREE.Quaternion();
const seatPos = new THREE.Vector3(0.1, 1.85, -1.65);
const targetCamera = camera.clone();
targetCamera.position.copy(seatPos);
targetCamera.lookAt(0.1, 1.94, -3.1);
function sit() {
  if (mode !== "room") return;
  keys.clear();
  mode = "seating";
  $("intro").hidden = true;
  $("interact").hidden = true;
  startPos.copy(camera.position);
  startQuat.copy(camera.quaternion);
  seatStart = performance.now();
}
function openTerminal() {
  mode = "terminal";
  $("terminal").hidden = false;
  $("room-ui").hidden = true;
  document.body.classList.add("terminal-open");
  if (!$("log").children.length) {
    line("KIDCALM OS  /  PERSONAL TERMINAL", "muted");
    line(`Hello, world.\n저는 ${profile.name}입니다.`, "welcome");
    line(
      "작은 호기심에서 시작하는 개발의 기록.\n명령어를 입력해 저의 이야기를 살펴보세요.",
    );
    run("help", false);
  }
  setTimeout(() => $<HTMLInputElement>("command").focus(), 50);
}
function leave() {
  mode = "room";
  $("terminal").hidden = true;
  $("room-ui").hidden = false;
  document.body.classList.remove("terminal-open");
  camera.position.set(3.3, 2.15, 5.6);
  camera.lookAt(-0.25, 1.35, -1.8);
  euler.setFromQuaternion(camera.quaternion);
  $("intro").hidden = false;
}
$("enter").onclick = sit;
$("skip").onclick = openTerminal;
$("exit").onclick = leave;
$("interact").onclick = sit;
const surface = $("scene");
surface.onpointerdown = (e) => {
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
  surface.setPointerCapture(e.pointerId);
};
surface.onpointerup = () => (dragging = false);
surface.onpointercancel = () => (dragging = false);
surface.onpointermove = (e) => {
  if (!dragging || mode !== "room") return;
  $("intro").hidden = true;
  euler.y -= (e.clientX - lastX) * 0.004;
  euler.x = THREE.MathUtils.clamp(
    euler.x - (e.clientY - lastY) * 0.003,
    -0.7,
    0.7,
  );
  camera.quaternion.setFromEuler(euler);
  lastX = e.clientX;
  lastY = e.clientY;
};
const raycaster = new THREE.Raycaster();
surface.ondblclick = (e) => {
  raycaster.setFromCamera(
    new THREE.Vector2(
      (e.clientX / innerWidth) * 2 - 1,
      (-e.clientY / innerHeight) * 2 + 1,
    ),
    camera,
  );
  if (raycaster.intersectObjects([monitor, display]).length) sit();
};
window.addEventListener("keydown", (e) => {
  if (mode === "terminal") {
    if (e.key === "Escape") leave();
    return;
  }
  if ((e.target as HTMLElement).closest("button,a,input")) return;
  if (
    [
      "w",
      "a",
      "s",
      "d",
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
    ].includes(e.key)
  ) {
    e.preventDefault();
    keys.add(e.key.toLowerCase());
    $("intro").hidden = true;
  }
  if (e.key.toLowerCase() === "e") sit();
});
window.addEventListener("keyup", (e) => keys.delete(e.key.toLowerCase()));
window.addEventListener("blur", () => {
  keys.clear();
  dragging = false;
});
let previous = performance.now();
function animate(now: number) {
  requestAnimationFrame(animate);
  const dt = Math.min((now - previous) / 1000, 0.05);
  previous = now;
  if (mode === "seating") {
    const t = reduced ? 1 : Math.min((now - seatStart) / 1300, 1),
      s = t * t * (3 - 2 * t);
    camera.position.lerpVectors(startPos, seatPos, s);
    camera.quaternion.slerpQuaternions(startQuat, targetCamera.quaternion, s);
    if (t === 1) openTerminal();
  }
  if (mode === "room") {
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const side = new THREE.Vector3().crossVectors(forward, camera.up);
    const move = new THREE.Vector3();
    if (keys.has("w") || keys.has("arrowup")) move.add(forward);
    if (keys.has("s") || keys.has("arrowdown")) move.sub(forward);
    if (keys.has("d") || keys.has("arrowright")) move.add(side);
    if (keys.has("a") || keys.has("arrowleft")) move.sub(side);
    move.normalize().multiplyScalar(dt * 2.2);
    const next = camera.position.clone().add(move);
    next.x = THREE.MathUtils.clamp(next.x, -3.95, 3.95);
    next.z = THREE.MathUtils.clamp(next.z, -1.85, 5.8);
    if (!(next.x < -2.18 && next.z < 3 && next.z > -0.5))
      camera.position.copy(next);
    $("interact").hidden = !$("intro").hidden;
  }
  renderer?.render(scene, camera);
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
