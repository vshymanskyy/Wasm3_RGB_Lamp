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
function hue2Rgb(hue: i32): u32 {
  hue *= 6 << 8;
	let r = abs(hue - (3 << 16)) - (1 << 16);
	let g = (2 << 16) - abs(hue - (2 << 16));
	let b = (2 << 16) - abs(hue - (4 << 16));
	r = clamp(r >> 8);
	g = clamp(g >> 8);
	b = clamp(b >> 8);
  return r << 16 | g << 8 | b;
}

function setup(): void {
  dev.println('AssemblyScript is running 😎')
  dev.rgbSetBrightness(24);
}

@inline
function run(tick: u32): void {
  for (let i: u32 = 0; i < ledCount; i++) {
    let value = dev.rgbGamma32(hue2Rgb((i * 10 + tick) & 255));
    unchecked(leds[i] = value);
  }
  dev.rgbWrite(leds);
  dev.rgbShow();
}

/*
 * Entry point
 */
export function _start(): void {
  setup();
  let tick: u32 = 0;
  while (1) {
    run(tick++);
  }
}
