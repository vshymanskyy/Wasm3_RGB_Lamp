# WebAssembly RGB lamp demo

- Wasm Runtime: [`Wasm3`](https://github.com/wasm3/wasm3)
- MCU: `Nordic nRF51822`
- Framework: `Arduino`
- Build System: `PlatformIO`

`./assemblyscript` contains the wasm app, which [implements an animation](/assemblyscript/app.ts).

`./wasm_vm` contains the interpreter/VM.

To build and run the example:
```sh
make run
```

## Work In Progress

- [x] Run `AssemblyScript` on `nRF51`
- [x] Simple `Color Wheel` animation working
- [x] Transfer pixels in batches (optimize speed)
- [ ] Try running `Bluetooth LE` stack
- [ ] Upload `wasm` binary to device using BLE (store to RAM)
- [ ] Store `wasm` binary to flash
