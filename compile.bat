@echo off
REM Activar Visual Studio Build Environment
echo.
echo Activando Visual Studio Build Environment...
call "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Auxiliary\Build\vcvars64.bat"

REM Establecer PATH para Rust
set PATH=%USERPROFILE%\.cargo\bin;%PATH%

REM Compilar
echo.
echo Compilando backend Rust...
cd /d "C:\Users\Usuario\Desktop\Distribuidora-San-Martin-Tauri\src-tauri"
cargo build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅✅✅ COMPILACIÓN EXITOSA ✅✅✅
    echo.
    dir target\debug\*.exe
) else (
    echo.
    echo ❌ Error en compilación
    pause
)
