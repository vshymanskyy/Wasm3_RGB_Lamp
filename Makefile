
.PHONY: all clean upload monitor run

DEVICE ?= "MicroBit"

all: build

wasm_app:
	@cd assemblyscript && npm run build
	@cd assemblyscript && xxd -i app.wasm > app.wasm.h

build: wasm_app
	@pio run -e $(DEVICE)

upload: wasm_app
	@echo "Uploading..."
	@pio run -e $(DEVICE) -t upload > /dev/null 2>&1

clean:
	-@rm -rf ./.pio
	-@rm ./assemblyscript/*.wat
	-@rm ./assemblyscript/*.wasm
	-@rm ./assemblyscript/*.h

monitor:
	@pio device monitor --quiet

run: upload monitor
