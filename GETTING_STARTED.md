# 🚀 Guía de Inicio - Distribuidora San Martín

## Instalación Rápida

### Opción 1: Descargar Ejecutable (Más Fácil) 🎯

1. Ve a **[GitHub Releases](https://github.com/tu-repo/releases)**
2. Descarga el archivo `.exe` más reciente
3. Ejecuta el instalador (NSIS)
4. ¡Listo! Abre la aplicación

**Requisitos:** Windows 10 / 11 (nada más necesario)

---

### Opción 2: Compilar Localmente (Desarrolladores)

#### 📋 Requisitos Previos

```bash
# Node.js 18+
node --version

# Rust (1.98+)
rustc --version
cargo --version

# Tauri CLI
npm install -g @tauri-apps/cli@latest
```

#### 🔨 Compilar

```bash
# En el directorio raíz del proyecto
npm install

# Compilar frontend + backend
npm run tauri build

# El ejecutable está en: src-tauri/target/release/bundle/nsis/
```

#### ⚠️ Si Falla en Windows

El linker MSVC puede dar problemas. Soluciones:

**A) Usar GitHub Actions (Recomendado)**
```bash
# Push a main branch, GitHub compila automáticamente
git push origin main

# Descarga el .exe de Actions
```

**B) Compilar en Mac/Linux**
```bash
# En Mac (M1/Intel)
npm run tauri build

# En Linux (cualquier distro)
npm run tauri build
```

---

## 🎮 Uso de la Aplicación

### Login Inicial

**Usuario de prueba:**
```
Usuario: admin
Contraseña: admin123
```

### Navegación Principal

| Sección | Descripción | Acceso |
|---------|-------------|--------|
| **Dashboard** | Estadísticas en tiempo real | Todos |
| **Productos** | Inventario con márgenes | Todos |
| **Clientes** | CRM con límite de crédito | Todos |
| **Ventas** | Crear ventas con IVA 19% | Todos |
| **Órdenes** | Compras y ventas | Todos |
| **Reportes** | Análisis avanzado (4 tipos) | Todos |
| **Configuración** | Usuarios y empresa | Admin |

---

## 🌙 Dark Mode

Presiona automáticamente según tu preferencia de sistema. O ve a **Configuración** → **Preferencias** (próxima versión).

---

## 🗄️ Base de Datos

La aplicación crea automáticamente:
```
~/.sanmartin/inventory.db     (SQLite)
~/.sanmartin/logs.db          (Auditoría)
```

### Backup Manual

```bash
# Windows
copy %APPDATA%\.sanmartin\inventory.db C:\backup\

# Mac/Linux
cp ~/.sanmartin/inventory.db ~/backup/
```

---

## 🔧 Desarrollo

### Estructura del Proyecto

```
.
├── src/                          # React Frontend
│   ├── components/
│   │   ├── Layout/              # Sidebar + topbar
│   │   ├── Dashboard/           # Home page
│   │   ├── Inventory/           # Productos
│   │   ├── Customers/           # Clientes
│   │   ├── Sales/               # Ventas
│   │   ├── Orders/              # Órdenes
│   │   ├── Reports/             # Reportes
│   │   └── Settings/            # Configuración
│   └── styles/                  # CSS (dark mode + responsive)
│
├── src-tauri/                   # Rust Backend
│   └── src/
│       ├── main.rs              # Tauri app
│       ├── lib.rs               # Handlers
│       ├── models.rs            # Data structures
│       ├── db.rs                # Database setup
│       ├── auth.rs              # JWT + Bcrypt
│       └── commands/            # Tauri commands
│           ├── auth.rs
│           ├── inventory.rs
│           ├── sales.rs
│           ├── orders.rs
│           └── customers.rs
│
└── .github/workflows/           # GitHub Actions
    └── windows-build.yml        # Auto-build Windows .exe
```

### Hot Reload (Desarrollo)

```bash
# Terminal 1: Tauri en modo desarrollo
npm run tauri dev

# Los cambios en React se actualizan automáticamente
```

### Build Optimizado

```bash
# Produce: src-tauri/target/release/
npm run tauri build --release
```

---

## 🧪 Testing

### Tests Unitarios (React)

```bash
npm run test          # Jest
npm run test:watch    # Con hot reload
```

### Tests E2E (Próximo)

```bash
npm run test:e2e      # Cypress (próxima versión)
```

---

## 🐛 Troubleshooting

### "Cannot find Tauri CLI"
```bash
npm install -g @tauri-apps/cli@latest
```

### "link.exe not found"
→ Usa GitHub Actions (opción recomendada)

### "Module not found: @tauri-apps/api"
```bash
npm install @tauri-apps/api --save
```

### Base de datos corrupta
```bash
# Elimina y deja que se recree:
rm ~/.sanmartin/inventory.db
# Reinicia la app
```

---

## 📞 Soporte

- 📖 **Documentación:** Ver `DEVELOPMENT.md`
- 🐛 **Reportar bugs:** GitHub Issues
- 💬 **Preguntas:** GitHub Discussions

---

## 📈 Roadmap

- [ ] PDF export para reportes
- [ ] Notificaciones push
- [ ] Bodegas múltiples
- [ ] Sistema de alertas automáticas
- [ ] Integración con proveedores
- [ ] App móvil (React Native)

---

**¡Listo para empezar!** 🎉

Si tuviste problemas, revisa la sección **Troubleshooting** o crea un issue.
