/*
 * Wasm3 - high performance WebAssembly interpreter written in C.
 * Copyright © 2020 Volodymyr Shymanskyy, Steven Massey.
 * All rights reserved.
 */

#include <wasm3.h>

#include <m3_api_defs.h>
#include <m3_env.h>

#include <Adafruit_NeoPixel.h>

/*
 * Configuration
 */

#define WASM_STACK_SLOTS    1024
#define NATIVE_STACK_SIZE   (32*1024)

// For (most) devices that cannot allocate a 64KiB wasm page
#define WASM_MEMORY_LIMIT   2048

#define STRIP_PIN           3
#define STRIP_COUNT         30

Adafruit_NeoPixel strip(STRIP_COUNT, STRIP_PIN, NEO_GRB + NEO_KHZ800);

/*
 * WebAssembly app
 */

#include "../assemblyscript/app.wasm.h"

/*
 * API bindings
 */

int UTF16toUTF8(unsigned char* out, int* outlen,
          const unsigned char* inb, int* inlenb);

m3ApiRawFunction(m3_arduino_millis) {
    m3ApiReturnType (uint32_t)
    m3ApiReturn(millis());
}

m3ApiRawFunction(m3_arduino_delay) {
    m3ApiGetArg     (uint32_t, ms)
    delay(ms);
    m3ApiSuccess();
}

m3ApiRawFunction(m3_arduino_printUTF16)
{
    m3ApiGetArgMem  (const uint8_t *, buf)
    m3ApiGetArg     (uint32_t,        len)

    int outlen = len*4;
    int inlen = len*2;
    byte out[outlen];
    UTF16toUTF8(out, &outlen, buf, &inlen);

    Serial.write(out, outlen);
    m3ApiSuccess();
}

// RGB strip API

m3ApiRawFunction(m3_arduino_rgbGetCount) {
    m3ApiReturnType (uint32_t)
    m3ApiReturn(strip.numPixels());
}

m3ApiRawFunction(m3_arduino_rgbClear) {
    strip.clear();
    m3ApiSuccess();
}

m3ApiRawFunction(m3_arduino_rgbShow) {
    strip.show();
    m3ApiSuccess();
}

m3ApiRawFunction(m3_arduino_rgbWrite) {
    m3ApiGetArgMem  (const uint32_t *, colors)
    m3ApiGetArg     (uint32_t,         len)
    for (int i=0; i<len; i++) {
        strip.setPixelColor(i, colors[i]);
    }
    m3ApiSuccess();
}

m3ApiRawFunction(m3_arduino_rgbGamma32) {
    m3ApiReturnType (uint32_t)
    m3ApiGetArg     (uint32_t,         color)
    m3ApiReturn(strip.gamma32(color));
}

m3ApiRawFunction(m3_arduino_rgbSetBrightness) {
    m3ApiGetArg     (uint32_t, value)
    strip.setBrightness(value);
    m3ApiSuccess();
}

M3Result  LinkArduino  (IM3Runtime runtime)
{
    IM3Module module = runtime->modules;
    const char* arduino = "arduino";

    m3_LinkRawFunction (module, arduino, "millis",           "i()",    &m3_arduino_millis);
    m3_LinkRawFunction (module, arduino, "delay",            "v(i)",   &m3_arduino_delay);
    m3_LinkRawFunction (module, arduino, "printUTF16",       "v(*i)",  &m3_arduino_printUTF16);

    m3_LinkRawFunction (module, arduino, "rgbGetCount",       "i()",   &m3_arduino_rgbGetCount);
    m3_LinkRawFunction (module, arduino, "rgbShow",           "v()",   &m3_arduino_rgbShow);
    m3_LinkRawFunction (module, arduino, "rgbClear",          "v()",   &m3_arduino_rgbClear);
    m3_LinkRawFunction (module, arduino, "rgbWrite",          "v(*i)", &m3_arduino_rgbWrite);
    m3_LinkRawFunction (module, arduino, "rgbSetBrightness",  "v(i)",  &m3_arduino_rgbSetBrightness);
    m3_LinkRawFunction (module, arduino, "rgbGamma32",        "i(i)",  &m3_arduino_rgbGamma32);

    return m3Err_none;
}

/*
 * Engine start, liftoff!
 */

#define FATAL(func, msg) { Serial.print("Fatal: " func " "); Serial.println(msg); return; }

void wasm_task(void*)
{
    M3Result result = m3Err_none;

    IM3Environment env = m3_NewEnvironment ();
    if (!env) FATAL("NewEnvironment", "failed");

    IM3Runtime runtime = m3_NewRuntime (env, WASM_STACK_SLOTS, NULL);
    if (!runtime) FATAL("NewRuntime", "failed");

#ifdef WASM_MEMORY_LIMIT
    runtime->memoryLimit = WASM_MEMORY_LIMIT;
#endif

    IM3Module module;
    result = m3_ParseModule (env, &module, app_wasm, app_wasm_len-1);
    if (result) FATAL("ParseModule", result);

    result = m3_LoadModule (runtime, module);
    if (result) FATAL("LoadModule", result);

    result = LinkArduino (runtime);
    if (result) FATAL("LinkArduino", result);

    IM3Function f;
    result = m3_FindFunction (&f, runtime, "_start");

    if (result) FATAL("FindFunction", result);

    Serial.println("Running WebAssembly...");

    const char* i_argv[1] = { NULL };
    result = m3_CallWithArgs (f, 0, i_argv);

    // Should not arrive here

    if (result) {
        M3ErrorInfo info;
        m3_GetErrorInfo (runtime, &info);
        Serial.print("Error: ");
        Serial.print(result);
        Serial.print(" (");
        Serial.print(info.message);
        Serial.println(")");
    }
}

void setup()
{
    Serial.begin(115200);

    strip.begin();
    strip.show();

    Serial.println("\nWasm3 v" M3_VERSION ", build " __DATE__ " " __TIME__);

    wasm_task(NULL);
}

void loop()
{
    delay(100);
}
