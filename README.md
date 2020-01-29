## WebAssembly RGB lamp demo

- Wasm Runtime: `Wasm3`
- MCU: `Nordic nRF51822`
- Framework: `Arduino`
- Build System: `PlatformIO`

`./assemblyscript` contains the wasm app, which implements an animation.

`./wasm_vm` contains the host interpreter/VM, contains all the drivers.

To build and run the example:
```sh
make run
```
