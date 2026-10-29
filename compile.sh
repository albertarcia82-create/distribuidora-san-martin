#!/bin/bash

cd /mnt/c/Users/Usuario/Desktop/Distribuidora-San-Martin-Tauri/src-tauri

echo "🔨 Compilando Rust backend en WSL..."
echo ""

source $HOME/.cargo/env
cargo build --release 2>&1 | tail -100

echo ""
if [ -f target/release/distribuidora_san_martin ]; then
  echo "✅✅✅ ¡COMPILACIÓN EXITOSA! ✅✅✅"
  echo ""
  echo "Binario disponible en:"
  ls -lh target/release/distribuidora_san_martin 2>/dev/null || ls -lh target/release/ | grep distribuidora
else
  echo "⚠️ Revisar errores arriba"
fi
