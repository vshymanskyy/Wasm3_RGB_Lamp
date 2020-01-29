# WebAssembly RGB lamp demo

- MCU: `Nordic nRF51822 QFAA` (**16 Kb** RAM, **256 Kb** Flash)
- Wasm Runtime: [`Wasm3`](https://github.com/wasm3/wasm3)
- Framework: `Arduino`
- Build System: `PlatformIO`

![demo](/extra/photos.jpg)

`./assemblyscript` contains the wasm app. This [implements an animation](/assemblyscript/app.ts).

`./wasm_vm` contains the interpreter/VM.

## Build instructions

1. Install `PlatformIO`
2. In `assemblyscript` directory, run `npm install`
3. To build the demo: `make`
4. To upload and run the demo: `make run`

## Work In Progress

- [x] Run `AssemblyScript` on `nRF51`
- [x] Simple `Color Wheel` animation working
- [x] Transfer pixels in batches (optimize speed)
- [ ] Try running `Bluetooth LE` stack
- [ ] Upload `wasm` binary to device using BLE (store to RAM)
- [ ] Store `wasm` binary to flash
