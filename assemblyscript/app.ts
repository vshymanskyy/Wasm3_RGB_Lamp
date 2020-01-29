import * as dev from "./arduino";

const led_count:i32 = min(144, dev.rgbGetCount());

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

function clamp1(x: f32) : f32 {
  return min(max(x, 0.0), 1.0) - 1.0;
}

// H [0, 360]; S [0, 100]; V [0, 100]
function HSV(H: i32, S: u8, V: u8) : u32 {
  let h = f32(H) / 60;
  let v = f32(V) * 255 / 100;
  let t = f32(S) * v / 100;
  let r = clamp1(-1 + abs(h - 3)) * t + v;
  let g = clamp1( 2 - abs(h - 2)) * t + v;
  let b = clamp1( 2 - abs(h - 4)) * t + v;
  return Color(u8(r), u8(g), u8(b));
}

function setup(): void {
  dev.println('AssemblyScript is running 😎')
  dev.rgbSetBrightness(24);
}

@inline
function run(): void {
  for (let h = 0; h < 360; h += 1) {
    for (let i = 0; i < led_count; i++) {
      let value = dev.rgbGamma32(HSV(((i*10)+h)%360, 100, 100));
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
