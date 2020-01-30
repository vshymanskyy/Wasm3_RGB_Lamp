# [WIP] WebAssembly RGB lamp animation demo

Currently reaching **23.5 FPS** with **144 LEDs**, **110 FPS** with **30 LEDs**.

- MCU: `Nordic nRF51822 QFAA` (**16 MHz** Cortex-M0, **16 Kb** RAM, **256 Kb** Flash)
- Wasm Runtime: [`Wasm3`](https://github.com/wasm3/wasm3)
- Framework: `Arduino`
- Build System: `PlatformIO`

![demo](/extra/photos.jpg)

## Status

- [x] Run `AssemblyScript` on `nRF51`
- [x] Simple `Color Wheel` animation working
- [x] Transfer pixels in batches (optimize speed)
- [x] Add support for **Micro:bit**, **ESP32**, **ESP8266**
- [ ] Try running `Bluetooth LE` stack
- [ ] Upload `wasm` binary to device using BLE (store to RAM)
- [ ] Store `wasm` binary to flash


## Build instructions

`./assemblyscript` contains the wasm app. This [implements an animation](/assemblyscript/app.ts).  
`./wasm_vm` contains the interpreter/VM.  

1. Install `PlatformIO`
2. In `assemblyscript` directory, run `npm install`
3. To build the demo: `make`
4. To upload and run the demo: `make run`
