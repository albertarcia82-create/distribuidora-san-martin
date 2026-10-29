# 🚀 Instrucciones de Compilación - Distribuidora San Martín

**Estado:** Código 100% completado - solo necesita compilación  
**Plataforma:** macOS, Linux, o Windows (con 3 opciones)  
**Tiempo estimado:** 5-15 minutos

---

## 🚀 OPCIÓN MÁS RÁPIDA PARA WINDOWS

**En lugar de compilar localmente, usa GitHub Actions (compilación en servidores Microsoft - GRATIS):**

### Paso 1: Subir código a GitHub
```bash
git init
git add .
git commit -m "[feat] Tauri+Rust backend completado"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/Distribuidora-San-Martin-Tauri.git
git push -u origin main
```

### Paso 2: Descargar .EXE compilado
1. Ve a: https://github.com/TU_USUARIO/Distribuidora-San-Martin-Tauri/actions
2. Espera a que termine "🪟 Build Windows Installer"
3. Descarga: `distribuidora-san-martin-windows` artifact
4. Extraer y ejecutar `.exe`

**¡LISTO! Sin necesidad de instalar dependencias**

---

## ✅ PRE-REQUISITOS (Si quieres compilar localmente)

### Windows (NO Recomendado - 1 hora setup)
```powershell
# Opción A: Instalar Visual Studio 2022 Community (vs Build Tools)
# Descargar de: https://visualstudio.microsoft.com/vs/

# Opción B: Si tienes Docker Desktop
docker build -t san-martin .
docker run -it san-martin
```

### macOS
```bash
# Instalar Homebrew si no lo tienes
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Instalar dependencias Tauri
brew install nodejs
```

### Linux (Ubuntu/Debian)
```bash
# Instalar Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Instalar dependencias de build
sudo apt-get update
sudo apt-get install -y \
  build-essential \
  curl \
  wget \
  libssl-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  pkg-config \
  nodejs \
  npm
```

---

## 🔨 COMPILACIÓN (3 pasos)

### PASO 1: Navegar al proyecto
```bash
cd /ruta/a/Distribuidora-San-Martin-Tauri
```

### PASO 2: Instalar dependencias
```bash
# Instalar módulos npm
npm install

# Descargar dependencias Rust
cd src-tauri && cargo fetch && cd ..
```

### PASO 3: Compilar
```bash
# Compilación de DEBUG (más rápida, para testing)
cargo tauri build

# O compilación RELEASE (optimizada, para producción)
cargo tauri build --release
```

---

## 📦 SALIDA ESPERADA

**macOS:**
```
src-tauri/target/release/bundle/macos/Distribuidora San Martín.app
src-tauri/target/release/bundle/dmg/Distribuidora San Martín_*.dmg
```

**Linux:**
```
src-tauri/target/release/bundle/deb/distribuidora-san-martin_*.deb
src-tauri/target/release/bundle/appimage/distribuidora-san-martin_*.AppImage
```

---

## ✅ VERIFICACIÓN

Después de compilar:

```bash
# Ejecutar aplicación en desarrollo
npm run tauri dev

# O ejecutar binario compilado
./src-tauri/target/release/distribuidora_san_martin
```

Debería ver:
1. ✅ Ventana de login
2. ✅ Formulario de usuario/contraseña
3. ✅ Credenciales por defecto: `admin / 123456789`

---

## 🆘 TROUBLESHOOTING

### Error: "command not found: cargo"
```bash
# Recargar shell
source $HOME/.cargo/env
```

### Error: "libwebkit2gtk-4.0-dev not found" (Linux)
```bash
# Versión alternativa más nueva
sudo apt-get install -y libwebkit2gtk-4.1-dev
```

### Error: "could not compile tauri"
```bash
# Limpiar y reintentar
cargo clean
cargo tauri build
```

---

## 🎯 CREDENCIALES POR DEFECTO

| Campo | Valor |
|-------|-------|
| Usuario | `admin` |
| Contraseña | `123456789` |

⚠️ **CAMBIAR INMEDIATAMENTE EN PRODUCCIÓN**

---

## 📝 NOTAS IMPORTANTES

- **Primera compilación:** Puede tardar 3-5 minutos (descarga dependencias)
- **Compilaciones posteriores:** 30-60 segundos (caché)
- **Espacio requerido:** ~2GB en /target/
- **Base de datos:** Se crea automáticamente al ejecutar
- **Config:** Las variables de entorno se cargan de `.env` si existe

---

## 🚀 PRÓXIMOS PASOS (DESPUÉS DE COMPILAR)

1. ✅ Ejecutar y verificar login funciona
2. ✅ Verificar dashboard muestra estadísticas
3. ✅ Cambiar contraseña default del admin
4. ✅ Crear usuarios adicionales por rol
5. ✅ Guardar instalador generado

---

**Generado:** 2026-09-17  
**Para:** Distribuidora San Martín  
**Estado:** Listo para compilación mañana ✅
