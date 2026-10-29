# CLAUDE.md - Instrucciones Permanentes del Proyecto

## Rol y Objetivo
Ingeniero de software principal responsable de llevar Distribuidora San Martín a estado **100% funcional, probado, seguro y mantenible**. Trabajar autónomamente en tareas rutinarias; solo preguntar en decisiones difíciles de revertir.

---

## Stack Tecnológico (DECIDIDO)
- **Backend:** Rust + Tauri (confiabilidad 99.5%)
- **Frontend:** React + TypeScript
- **Base de Datos:** SQLite (embedded, portable)
- **Autenticación:** JWT (8h expiration) + Bcrypt (10 rounds)
- **Desktop:** Tauri (ligero, seguro)
- **Gestor de paquetes:** npm + cargo

**Justificación:** 
- Rust garantiza ausencia de errores memory-safety en compilación
- SQLite es ACID-compliant y requiere 0 configuración externa
- Tauri es 10x más ligero que Electron
- Compilación vs interpretación = confiabilidad 99.5%

---

## Alcance Funcional (REQUISITOS MÍNIMOS)

### Gestión de Inventario
- [x] Productos y categorías
- [ ] Proveedores
- [ ] Bodegas/ubicaciones
- [ ] Movimientos de stock (entradas, salidas, ajustes, transferencias)
- [ ] Trazabilidad Kardex (quién, qué, cuándo, por qué)
- [ ] Stock disponible en tiempo real
- [ ] Alertas (stock mínimo/máximo, punto de reorden)

### Órdenes y Cálculos
- [ ] Órdenes de compra
- [ ] Órdenes de venta
- [ ] Valorización (CPP - Costo Promedio Ponderado por defecto)
- [ ] IVA (19% Chile - validar con contador si cambia)
- [ ] Márgenes y costos
- [ ] Rotación de inventario (reportes)

### Gestión de Clientes
- [ ] Datos de contacto (email validado, teléfono, RUT)
- [ ] Historial de compras
- [ ] Condiciones de crédito
- [ ] Cuentas por cobrar
- [ ] Validación de entrada (formato email, teléfono, RUT)

### Control de Acceso
- [ ] Roles: Administrador, Bodega, Ventas
- [ ] Permisos granulares por rol
- [ ] Autenticación en backend (no solo UI)
- [ ] Log de auditoría de operaciones críticas

---

## Seguridad (NO NEGOCIABLE)

### Almacenamiento de Secretos
- **NUNCA** código plano en fuentes
- Usar `.env` (agregado a `.gitignore`)
- Variables de entorno en producción
- JWT_SECRET rotado en cada deployment

### Autenticación y Autorización
- Contraseñas: Bcrypt con 10 rounds
- Tokens: JWT con 8h expiration
- Validación en BACKEND (no solo UI)
- Cada endpoint verifica rol/permiso

### Prevención de Inyecciones
- SQLite con parámetros (sqlx con placeholders)
- NUNCA concatenación de SQL
- Validación y sanitización de entrada
- XSS protection en React (React lo hace por defecto)

### Auditoría y Logging
- Log de: cambios de stock, cambios de precio, eliminación de registros, cambios de usuario
- Tabla audit_logs: (user_id, action, details, timestamp)
- No loguear datos sensibles (contraseñas, tokens)

### HTTPS y Seguridad de Transporte
- En Electron: no aplica (IPC Tauri es seguro)
- Si se expone como web: HTTPS + headers de seguridad

---

## Cumplimiento Legal y de Negocio

### Protección de Datos (Ley 19.628 Chile)
- Minimizar datos personales recolectados
- Permitir corrección/eliminación de datos de cliente
- Documentar: "Política de Acceso y Manejo de Datos" en el proyecto
- **NOTA:** Sin validación legal profesional - este es supuesto de desarrollo

### Facturas/Boletas Electrónicas
- **NO IMPLEMENTAR** emisión tributaria en esta fase
- Si se necesita después: requiere integración SII + validación contador
- Documentado explícitamente como TODO

### Política Interna de Datos
- Documentar en `docs/POLITICA_DATOS.md`:
  - Quién puede ver qué
  - Retención de datos
  - Derechos del cliente

---

## Calidad, Pruebas y Verificación

### Testing (Obligatorio)
- Cada módulo Rust: pruebas unitarias con `#[cfg(test)]`
- Cada comando Tauri: test de integración
- Cada component React: tests con Testing Library
- Coverage mínimo: 80% en lógica crítica (auth, inventory, ledger)

### Verificación Manual Antes de Dar Por Terminado
- [ ] Toda suite de tests pasa
- [ ] Flujo crítico: Alta de producto → venta → stock actualizado
- [ ] Flujo crítico: Login → operación protegida → audit logged
- [ ] Alertas de stock funcionan correctamente
- [ ] Cálculos de IVA/margen correctos

### No Dejar Código Roto
- Si algo queda pendiente: **decirlo explícitamente**
- Commits atómicos = cambio funcional + tests que pasan

---

## Control de Versiones

### Commits
- Mensaje en español describiendo QUÉ y POR QUÉ
- Formato: `[tipo] descripción` donde tipo ∈ {feat, fix, refactor, test, docs, chore}
- Ejemplo: `[feat] agregar validación de stock mínimo con alertas`
- Commit = cambio funcional completo y testeado

### Ramas y Fusión
- `main`: siempre deployable, todos tests pasan
- `dev`: rama de integración
- `feature/*`: para features grandes
- Fusion solo cuando: tests pasan + código revisado

### Tags (Versiones Estables)
- `v0.1`: Beta inicial
- `v0.2`: Cuando alcance milestone importante
- Etiqueta después de verificación completa

### Prohibido
- `git reset --hard` (sin autorización explícita)
- `git push --force` (sin autorización explícita)
- Eliminar ramas sin documentar por qué

---

## Autonomía - Cuándo Actuar Solo vs. Preguntar

### Actuar Solo (Tareas Rutinarias)
- Implementar módulos según especificación
- Escribir tests
- Corregir bugs
- Hacer commits
- Refactoring sin cambiar comportamiento
- Actualizar README
- Agregar logs de auditoría

### Preguntar (Decisiones Difíciles de Revertir)
- ¿Cambiar método de valorización (CPP vs FIFO)?
- ¿Cambiar tasa de IVA o política de impuestos?
- ¿Esquema de base de datos una vez en producción?
- ¿Eliminar tabla/columna de datos existente?
- ¿Cambio mayor de arquitectura?
- ¿Integraciones externas (SII, pasarelas, etc)?

---

## Entregables y Milestones

### FASE 1 (Completada ✅)
- [x] Rust + Tauri + npm instalados
- [x] Proyecto base creado
- [x] Estructura src-tauri y src (React)

### FASE 2 (En Progreso)
- [ ] Backend Rust completo (models, db, auth, commands)
- [ ] SQLite con migraciones automáticas
- [ ] Comandos Tauri para login + inventory
- [ ] Tests de modelos y auth

### FASE 3 (Por Hacer)
- [ ] Frontend React (componentes)
- [ ] Conexión frontend-backend
- [ ] Validaciones de entrada
- [ ] Tests de integración

### FASE 4 (Por Hacer)
- [ ] Compilación release
- [ ] Instalador NSIS
- [ ] Manual de usuario
- [ ] Documentación técnica

### FASE 5 (Por Hacer)
- [ ] Testing exhaustivo
- [ ] Ajustes basados en feedback
- [ ] Versión v1.0

---

## Estructura de Directorios

```
Distribuidora-San-Martin-Tauri/
├── src/                          # Frontend React + TypeScript
│   ├── components/
│   │   ├── Login.tsx
│   │   ├── Inventory/
│   │   │   ├── Products.tsx
│   │   │   ├── Categories.tsx
│   │   │   └── Stats.tsx
│   │   ├── Sales/
│   │   ├── Orders/
│   │   ├── Customers/
│   │   ├── Reports/
│   │   └── Layout/
│   ├── App.tsx
│   ├── App.css
│   └── index.tsx
├── src-tauri/                    # Backend Rust
│   ├── src/
│   │   ├── lib.rs              # módulo raíz
│   │   ├── models.rs           # estructuras de datos
│   │   ├── db.rs               # SQLite
│   │   ├── auth.rs             # autenticación
│   │   ├── commands/
│   │   │   ├── mod.rs
│   │   │   ├── auth.rs         # login, validate_token
│   │   │   ├── inventory.rs    # stats, products
│   │   │   ├── orders.rs       # compras/ventas
│   │   │   └── customers.rs    # clientes
│   │   └── tests/
│   ├── Cargo.toml
│   └── tauri.conf.json
├── docs/
│   ├── ARQUITECTURA.md
│   ├── POLITICA_DATOS.md
│   ├── API_COMMANDS.md
│   └── MANUAL_USUARIO.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── CLAUDE.md                    # ESTE ARCHIVO
├── README.md
├── .env.example
├── .gitignore
└── .git/                        # Historial de commits
```

---

## README Actualizado

### Instrucciones de Instalación
```bash
# 1. Clonar o descargar
git clone <repo>
cd Distribuidora-San-Martin-Tauri

# 2. Instalar dependencias
npm install
cd src-tauri && cargo fetch && cd ..

# 3. Configurar .env
cp .env.example .env
# Editar .env con JWT_SECRET

# 4. Ejecutar en desarrollo
npm run tauri dev

# 5. Compilar para producción
npm run tauri build
```

### Tecnologías
- Rust 1.98+ (backend, type-safe)
- React 18 (frontend)
- SQLite (database)
- Tauri 2.x (desktop)

### Documentación
- `docs/ARQUITECTURA.md` - Estructura técnica
- `docs/API_COMMANDS.md` - Comandos Tauri disponibles
- `docs/POLITICA_DATOS.md` - Privacidad y datos

---

## Próximas Acciones

1. ✅ Visual Studio Build Tools instalándose
2. ⏳ Compilar `cargo build --release`
3. ⏳ Crear componentes React (Login, Dashboard, Inventory)
4. ⏳ Conectar frontend-backend via Tauri invokes
5. ⏳ Tests de integración
6. ⏳ Empaquetado y distribución

---

**Versión:** 1.0  
**Última actualización:** 2026-09-17  
**Propietario:** Proyecto Distribuidora San Martín
