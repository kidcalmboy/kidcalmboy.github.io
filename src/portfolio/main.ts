import * as THREE from "three";
import { profile } from "./profile";
import { buildRoom, ROOM } from "./room";
import "./style.css";

document.querySelector("#root")!.innerHTML = `
<div id="scene" tabindex="0" aria-label="3D 학생 방. WASD로 이동하고 마우스로 둘러보세요. 컴퓨터 앞으로 다가가면 터미널이 열립니다."></div>
<header id="masthead"><nav><span>Room</span><span>Portfolio / 2026</span></nav><h1>Kidcalmboy</h1><nav><a href="https://github.com/kidcalmboy" target="_blank" rel="noopener noreferrer">GitHub ↗</a><button id="settings-button" aria-label="설정 열기">Settings [Esc]</button></nav></header>
<div id="room-ui"><div class="crosshair" aria-hidden="true">+</div><div class="room-title"><span>A room of my own</span><p id="proximity">컴퓨터 앞으로 걸어가세요.</p></div><div class="controls"><span>W A S D &nbsp; 이동</span><span>드래그 &nbsp; 둘러보기</span><span>화면 클릭 &nbsp; 마우스 시점 · ESC 설정</span></div><span class="room-index">PERSONAL SPACE / 001</span><div class="touch-pad" aria-label="이동 버튼"><button data-move="KeyW" aria-label="앞으로 이동">↑</button><button data-move="KeyA" aria-label="왼쪽으로 이동">←</button><button data-move="KeyS" aria-label="뒤로 이동">↓</button><button data-move="KeyD" aria-label="오른쪽으로 이동">→</button></div></div>
<button id="fallback-entry" hidden>터미널 열기</button>
<section id="terminal" aria-label="포트폴리오 터미널" hidden><div class="terminal-bar"><span>KIDCALMBOY / TERMINAL</span><button id="terminal-settings" aria-label="터미널 설정 열기">Settings [Esc]</button><button id="exit" aria-label="방으로 돌아가기">방으로 돌아가기 ↗</button></div><div id="terminal-body"><div id="log" role="log" aria-live="polite"></div><form id="command-form"><label for="command">guest@kidcalmboy:~$</label><input id="command" aria-label="터미널 명령어" autocomplete="off" autocapitalize="off" spellcheck="false"></form></div><div class="terminal-bottom"><span>SESSION 001 &nbsp; / &nbsp; CONNECTED</span><span>TAB 자동완성 &nbsp; ↑↓ 기록</span><div class="quick-commands">${["help", "about", "projects", "skills", "contact"].map((c) => '<button data-command="' + c + '">' + c + "</button>").join("")}</div></div></section>
<dialog id="settings" aria-labelledby="settings-title"><div class="settings-top"><span>Personal preferences</span><button id="settings-close" aria-label="설정 닫기">Close ×</button></div><h2 id="settings-title">Settings</h2><div class="setting-row"><label for="sensitivity">마우스 감도</label><output id="sensitivity-value" for="sensitivity">1.00×</output></div><input id="sensitivity" type="range" min="0.2" max="2.5" step="0.05" value="1" aria-describedby="sensitivity-help"><div class="range-labels"><span>느리게</span><span>빠르게</span></div><p id="sensitivity-help">마우스와 드래그 시점 이동에 적용됩니다.</p><p id="settings-save" role="status">이 브라우저에 자동 저장됩니다.</p><div class="settings-actions"><button id="reset-sensitivity">기본값으로</button><button id="resume">계속하기 ↗</button></div><button id="settings-room" hidden>방으로 돌아가기</button><div class="settings-foot">ESC — CLOSE &nbsp; / &nbsp; 이동은 잠시 멈춥니다.</div></dialog>`;
const $ = <T extends HTMLElement = HTMLElement>(id: string) =>
  document.getElementById(id) as T;
let mode: "room" | "seating" | "terminal" = "room";
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  Fifty(),
  innerWidth / $("scene").clientHeight,
  0.1,
  40,
);
function Fifty() {
  return innerWidth < 700 ? 68 : 60;
}
camera.position.copy(ROOM.spawn);
camera.lookAt(0.2, 1.35, -2.3);
let renderer: THREE.WebGLRenderer | undefined;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, $("scene").clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  $("scene").append(renderer.domElement);
} catch {
  $("scene").innerHTML =
    '<p class="fallback">3D 화면을 사용할 수 없습니다. 아래 버튼으로 포트폴리오에 입장하세요.</p>';
  $("fallback-entry").hidden = false;
}
buildRoom(scene);

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
const seatPos = ROOM.seat;
const screenPos = ROOM.screen;
const targetCamera = camera.clone();
targetCamera.position.copy(seatPos);
targetCamera.lookAt(ROOM.screenTarget);
const screenQuat = new THREE.Quaternion();
const settings = $<HTMLDialogElement>("settings");
const sensitivityInput = $<HTMLInputElement>("sensitivity");
let sensitivity = 1,
  settingsOpenedAt = 0,
  lastEscape = 0;
const storageKey = "kidcalmboy.mouseSensitivity";
try {
  const saved = localStorage.getItem(storageKey);
  const value = Number(saved);
  if (saved !== null && Number.isFinite(value) && value >= 0.2 && value <= 2.5)
    sensitivity = value;
} catch {}
function displaySensitivity() {
  sensitivityInput.value = String(sensitivity);
  $("sensitivity-value").textContent = sensitivity.toFixed(2) + "×";
}
displaySensitivity();
function saveSensitivity(value: number) {
  sensitivity = Math.max(0.2, Math.min(2.5, value));
  displaySensitivity();
  try {
    localStorage.setItem(storageKey, String(sensitivity));
    $("settings-save").textContent =
      "저장되었습니다. 다음 방문에도 적용됩니다.";
  } catch {
    $("settings-save").textContent =
      "현재 방문에 적용되었습니다. 브라우저 저장은 사용할 수 없습니다.";
  }
}
sensitivityInput.oninput = () =>
  saveSensitivity(Number(sensitivityInput.value));
$("reset-sensitivity").onclick = () => saveSensitivity(1);
function openSettings() {
  if (settings.open) return;
  keys.clear();
  dragging = false;
  settingsOpenedAt = performance.now();
  $("settings-room").hidden = mode !== "terminal";
  settings.showModal();
  if (document.pointerLockElement) document.exitPointerLock();
  sensitivityInput.focus();
}
function closeSettings() {
  if (!settings.open) return;
  if (mode === "seating") seatStart += performance.now() - settingsOpenedAt;
  settings.close();
  keys.clear();
  if (mode === "terminal") $("command").focus();
  else surface.focus();
}
$("settings-button").onclick = $("terminal-settings").onclick = openSettings;
$("settings-close").onclick = $("resume").onclick = closeSettings;
$("settings-room").onclick = () => {
  closeSettings();
  leave();
};
settings.oncancel = (e) => {
  e.preventDefault();
  if (performance.now() - settingsOpenedAt > 200) closeSettings();
};
let wasLocked = false;
document.addEventListener("pointerlockchange", () => {
  const locked = document.pointerLockElement === surface;
  if (
    wasLocked &&
    !locked &&
    mode === "room" &&
    !settings.open &&
    performance.now() - lastEscape > 200
  )
    openSettings();
  wasLocked = locked;
});
function sit() {
  if (mode !== "room" || settings.open) return;
  keys.clear();
  dragging = false;
  mode = "seating";
  if (document.pointerLockElement) document.exitPointerLock();
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
  camera.position.set(0.2, ROOM.eye, 0.1);
  camera.quaternion.identity();
  euler.setFromQuaternion(camera.quaternion);
  surface.focus({ preventScroll: true });
}
$("exit").onclick = leave;
$("fallback-entry").onclick = openTerminal;
function look(dx: number, dy: number) {
  if (settings.open) return;
  euler.y -= dx * 0.002 * sensitivity;
  euler.x = THREE.MathUtils.clamp(
    euler.x - dy * 0.002 * sensitivity,
    -1.1,
    1.1,
  );
  camera.quaternion.setFromEuler(euler);
}
surface.onpointerdown = (e) => {
  if (mode !== "room" || settings.open) return;
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
    !settings.open &&
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
  if (e.code === "Escape") {
    e.preventDefault();
    if (e.repeat) return;
    lastEscape = performance.now();
    if (settings.open) {
      if (lastEscape - settingsOpenedAt > 200) closeSettings();
    } else openSettings();
    return;
  }
  if (
    settings.open ||
    mode !== "room" ||
    (e.target as HTMLElement).closest("input,textarea")
  )
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
      if (mode === "room" && !settings.open) keys.add(button.dataset.move!);
      button.setPointerCapture(e.pointerId);
    };
    button.onpointerup = button.onpointercancel = () =>
      keys.delete(button.dataset.move!);
    button.onlostpointercapture = () => keys.delete(button.dataset.move!);
  });
function blocked(x: number, z: number) {
  return (
    (x < -0.82 && z > -0.88 && z < 1.6) ||
    (x > -0.83 && x < 1.53 && z < -1.65) ||
    (x > 1.6 && z < -1.6)
  );
}
let previous = performance.now();
function animate(now: number) {
  requestAnimationFrame(animate);
  const dt = Math.min((now - previous) / 1000, 0.05);
  previous = now;
  if (mode === "seating" && !settings.open) {
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
  if (mode === "room" && !settings.open) {
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
    move.normalize().multiplyScalar(dt * 1.7);
    const x = THREE.MathUtils.clamp(camera.position.x + move.x, -2.06, 2.06);
    const z = THREE.MathUtils.clamp(camera.position.z + move.z, -2.45, 2.45);
    if (!blocked(x, camera.position.z)) camera.position.x = x;
    if (!blocked(camera.position.x, z)) camera.position.z = z;
    const atDesk =
      Math.abs(camera.position.x - 0.2) < 0.43 &&
      camera.position.z < -0.87 &&
      camera.position.z > -1.65;
    const facingScreen = forward.z < -0.65;
    const near =
      Math.abs(camera.position.x - 0.2) < 1.1 && camera.position.z < 1;
    $("proximity").textContent = near
      ? "앞으로 다가가면 컴퓨터를 사용합니다."
      : "컴퓨터 앞으로 걸어가세요.";
    if (atDesk && facingScreen && move.lengthSq() > 0) sit();
  }
  if (mode !== "terminal") renderer?.render(scene, camera);
}
requestAnimationFrame(animate);
addEventListener("resize", () => {
  camera.aspect = innerWidth / $("scene").clientHeight;
  camera.fov = Fifty();
  camera.updateProjectionMatrix();
  renderer?.setSize(innerWidth, $("scene").clientHeight);
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
