import * as dev from "./arduino";

const ledCount: u32 = min(144, dev.rgbGetCount());

const leds: u32[] = [
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0                 // 144 max
];

// @ts-ignore: decorator
@inline
function clamp(x: i32): i32 {
  return min(max(x, 0), 255);
}

// hue: [0, 255]
// @ts-ignore: decorator
@inline
function hue2rgb(hue: i32): u32 {
  hue *= 6 << 8;
  let r = -(1 << 16) + abs(hue - (3 << 16));
  let g =  (2 << 16) - abs(hue - (2 << 16));
  let b =  (2 << 16) - abs(hue - (4 << 16));
  r = clamp(r >> 8);
  g = clamp(g >> 8);
  b = clamp(b >> 8);
  return Color(r, g, b);
}

function setAll(rgb: i32): void {
  for (let i: u32 = 0; i < ledCount; i++) {
    unchecked(leds[i] = rgb);
  }
}

function setup(): void {
  dev.println('😎 AssemblyScript is running')
  dev.rgbSetBrightness(128);
}

const animColors: u32[] = [ 0xFF0000, 0x00FF00, 0x0000FF, 0xCCFFFF ];
let   animColIdx: i32;

function animation0(): void {
  setAll(0);
  dev.rgbShow(leds);
  dev.delay(50);
}

let dotPos: i32;
let dotDir: i32 = 1;

function animation1(): void {
  unchecked(leds[dotPos] = 0);
  dotPos += dotDir;
  if (dotPos >= <i32>ledCount) {
    dotPos = ledCount-1;
    dotDir = -1;
  } else if (dotPos <= -1) {
    dotPos = 0;
    dotDir = 1;
  }
  unchecked(leds[dotPos] = 0xCCFFFF);
  dev.rgbShow(leds);
  dev.delay(50);
}


function animation2(): void {
  setAll(animColors[animColIdx]);
  dev.rgbShow(leds);
  dev.delay(500);
  animColIdx = (animColIdx+1) % animColors.length;
}

let huePos: u32;

function animation3(): void {
  for (let i: u32 = 0; i < ledCount; i++) {
    let value = dev.rgbGamma32(hue2rgb((i * 10 + huePos) % 256));
    unchecked(leds[i] = value);
  }
  dev.rgbShow(leds);
  huePos = huePos+1;
}

let anim: i32;

@inline
function run(): void {
  if (dev.btnPressed(0)) {
    dev.print(".");
    anim = (anim+1) % 4;
    setAll(0x000000);
  }
  switch (anim) {
    case 0: animation0(); break;
    case 1: animation1(); break;
    case 2: animation2(); break;
    case 3: animation3(); break;
  }
}

/*
 * Entry point
 */
export function _start(): void {
  setup();
  while (1) {
    run();
  }
}
