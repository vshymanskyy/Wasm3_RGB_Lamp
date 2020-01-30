/// <reference path="node_modules/assemblyscript/std/assembly/index.d.ts" />

export declare function millis(): u32;
export declare function delay(ms: u32): void;

@external("printUTF16")
declare function printUTF16(ptr: usize, len: usize): void;

export function print(str: string): void {
  printUTF16(changetype<usize>(str), str.length);
}

export function println(str: string): void {
  print(str);
  print('\n');
}

export declare function rgbClear(): void;
export declare function rgbShow(): void;
export declare function rgbGetCount(): u32;
export declare function rgbSetBrightness(value: u32): void;
export declare function rgbGamma32(color: u32): u32;

@external("rgbWrite")
declare function _rgbWrite(ptr: usize, len: usize): void;

export function rgbWrite(colors: u32[]): void {
  _rgbWrite(changetype<usize>(colors.buffer), colors.length);
}

/*
const _gammaTable: u8[] = [
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  1,  1,  1,
  1,  1,  1,  1,  2,  2,  2,  2,  2,  2,  2,  2,  3,  3,  3,  3,
  3,  3,  4,  4,  4,  4,  5,  5,  5,  5,  5,  6,  6,  6,  6,  7,
  7,  7,  8,  8,  8,  9,  9,  9, 10, 10, 10, 11, 11, 11, 12, 12,
 13, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20,
 20, 21, 21, 22, 22, 23, 24, 24, 25, 25, 26, 27, 27, 28, 29, 29,
 30, 31, 31, 32, 33, 34, 34, 35, 36, 37, 38, 38, 39, 40, 41, 42,
 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
 58, 59, 60, 61, 62, 63, 64, 65, 66, 68, 69, 70, 71, 72, 73, 75,
 76, 77, 78, 80, 81, 82, 84, 85, 86, 88, 89, 90, 92, 93, 94, 96,
 97, 99,100,102,103,105,106,108,109,111,112,114,115,117,119,120,
122,124,125,127,129,130,132,134,136,137,139,141,143,145,146,148,
150,152,154,156,158,160,162,164,166,168,170,172,174,176,178,180,
182,184,186,188,191,193,195,197,199,202,204,206,209,211,213,215,
218,220,223,225,227,230,232,235,237,240,242,245,247,250,252,255
];

@inline
export function gamma8(x: u8): u8 {
  return unchecked(_gammaTable[x]);
}

export function Gamma(x: u32): u32 {
  let b = gamma8(u8((x >>  0) & 0xFF));
  let g = gamma8(u8((x >>  8) & 0xFF));
  let r = gamma8(u8((x >> 16) & 0xFF));
  let w = gamma8(u8((x >> 24) & 0xFF));
  return ColorRGBW(r,g,b,w);
}

@global
@inline
export function Color(r: u8, g: u8, b: u8): u32 {
  return (u32(r) << 16) | (u32(g) <<  8) | b;
}

@global
@inline
export function ColorRGBW(r: u8, g: u8, b: u8, w: u8): u32 {
  return (u32(w) << 24) | (u32(r) << 16) | (u32(g) <<  8) | b;
}
*/
