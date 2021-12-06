/// <reference path="node_modules/assemblyscript/std/assembly/index.d.ts" />

export declare function millis(): u32;
export declare function delay(ms: u32): void;

// @ts-ignore: decorator
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
export declare function rgbGetCount(): u32;
export declare function rgbSetBrightness(value: u32): void;
export declare function rgbGamma32(color: u32): u32;

export declare function btnPressed(pin: u32): u32;

// @ts-ignore: decorator
@external("rgbShow")
declare function _rgbShow(ptr: usize, len: usize): void;

export function rgbShow(colors: u32[]): void {
  _rgbShow(changetype<usize>(colors.buffer), colors.length);
}

// @ts-ignore: decorator
@global
@inline
export function Color(r: u32, g: u32, b: u32, w: u32 = 0): u32 {
  return (w << 24) | (r << 16) | (g <<  8) | b;
}
