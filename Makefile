
.PHONY: all clean upload monitor run

all: build

wasm_app:
	cd assemblyscript && npm run build

build: wasm_app
	@pio run -e TinyBLE

upload: wasm_app
	@pio run -e TinyBLE -t upload

clean:
	-@rm -rf ./.pio
	-@rm ./assemblyscript/*.wat
	-@rm ./assemblyscript/*.wasm
	-@rm ./assemblyscript/*.h

monitor:
	@pio device monitor

run: upload monitor
