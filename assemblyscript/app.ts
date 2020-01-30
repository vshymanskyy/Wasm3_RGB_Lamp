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

@inline
function clamp(x: i32): i32 {
  return min(max(x, 0), 255);
}

// hue: [0, 255]
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

function setup(): void {
  dev.println('AssemblyScript is running 😎')
  dev.rgbSetBrightness(24);
}

@inline
function run(): void {
  for (let h = 0; h < 256; h += 2) {
    for (let i: u32 = 0; i < ledCount; i++) {
      let value = dev.rgbGamma32(hue2rgb((i * 10 + h) % 256));
      unchecked(leds[i] = value);
    }
    dev.rgbWrite(leds);
    dev.rgbShow();
  }
  dev.println('.');
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
