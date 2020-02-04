# [WIP] WebAssembly RGB lamp animation demo

- MCU: `Nordic nRF51822 QFAA` (**16 MHz** Cortex-M0, **16 Kb** RAM, **256 Kb** Flash)
- Wasm Runtime: [`Wasm3`](https://github.com/wasm3/wasm3)
- Framework: `Arduino`
- Build System: `PlatformIO`

## Demo

- Video with [30 LEDs](https://twitter.com/wasm3_engine/status/1222864284218163200), lamp produces **110 FPS**
- Video with [144 LEDs](https://twitter.com/wasm3_engine/status/1222872374363770882), lamp produces **23.5 FPS**

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
