# 📦 Guía de Instalación - Distribuidora San Martín v0.3.0

## 🎯 Requisitos Mínimos

**Sistema Operativo:**
- ✅ Windows 10 o superior
- ✅ Windows 11 (recomendado)

**Recursos:**
- 💾 **Espacio en disco:** 150 MB mínimo
- 🖥️ **RAM:** 2 GB mínimo (4 GB recomendado)
- 📡 **Internet:** Solo requerido para primer login

**NO Necesita:**
- ❌ Node.js
- ❌ Python
- ❌ Java
- ❌ Visual Studio
- ❌ Rust
- ❌ Ninguna otra herramienta de desarrollo

---

## 📥 Instalación Paso a Paso

### 1️⃣ Descargar el Instalador

1. Ve a: https://github.com/albertarcia82-create/distribuidora-san-martin/releases
2. Busca la última versión (v0.3.0 o superior)
3. Descarga: `distribuidora-san-martin_0.3.0_x64-setup.exe`

### 2️⃣ Ejecutar el Instalador

1. Haz **doble clic** en `distribuidora-san-martin_0.3.0_x64-setup.exe`
2. Si Windows pide confirmación → **Sí, ejecutar**
3. El instalador NSIS se abrirá

### 3️⃣ Seguir el Asistente de Instalación

**Pantalla 1: Bienvenida**
- Lee los términos
- Click → **Siguiente**

**Pantalla 2: Ubicación de Instalación**
- Recomendado: `C:\Program Files\Distribuidora San Martín`
- O personalizar según prefieras
- Click → **Siguiente**

**Pantalla 3: Accesos Directos**
- ✅ Crear acceso en Escritorio
- ✅ Crear acceso en Menú Inicio
- Click → **Siguiente**

**Pantalla 4: Confirmación**
- Revisar opciones
- Click → **Instalar**
- Esperar 30-60 segundos

**Pantalla 5: Finalización**
- ✅ "Lanzar Distribuidora San Martín"
- Click → **Finalizar**

### 4️⃣ Primera Ejecución

La aplicación se abre automáticamente después de instalar.

**Pantalla de Login:**
```
Usuario: admin
Contraseña: admin123
```

**IMPORTANTE - Cambiar contraseña:**
1. Ir a ⚙️ **Configuración** (arriba a la derecha)
2. Pestaña **Usuarios**
3. Click en usuario **admin**
4. Cambiar contraseña
5. Guardar

---

## 🔧 Configuración Inicial

### 1️⃣ Datos de la Empresa

1. Ve a ⚙️ **Configuración**
2. Pestaña **Empresa**
3. Completa:
   - 📝 **Nombre:** Distribuidora San Martín
   - 📱 **RUT:** [Tu RUT sin puntos]
   - 📧 **Email:** contacto@sanmartin.cl
   - 📞 **Teléfono:** +56 2 XXXX XXXX
   - 🏢 **Dirección:** [Tu dirección]
   - 💰 **IVA (%):** 19
4. Guardar

### 2️⃣ Crear Usuarios Adicionales

1. ⚙️ **Configuración** → **Usuarios**
2. Click → **+ Nuevo Usuario**
3. Completa datos:
   - 👤 **Nombre:** [Nombre del empleado]
   - 📧 **Email:** [Email único]
   - 🔑 **Contraseña:** [Segura]
   - 👨‍💼 **Rol:**
     - **Admin:** Acceso total
     - **Bodega:** Solo inventario
     - **Ventas:** Solo ventas y clientes
4. Crear

### 3️⃣ Agregar Primeros Productos

1. 📦 **Inventario** → **Productos**
2. Click → **+ Nuevo Producto**
3. Completa:
   - 📝 **Nombre:** [Nombre producto]
   - 🔢 **Código:** [SKU único]
   - 📊 **Categoría:** [Nueva o existente]
   - 💵 **Precio Costo:** [Precio compra]
   - 💰 **Precio Venta:** [Precio venta]
   - ⚠️ **Stock Mínimo:** [Alerta cuando baja]
4. Guardar

---

## 📊 Primeros Usos

### Dashboard
- 📈 Ve estadísticas en tiempo real
- 🔴 Alerta de productos con bajo stock
- 🎯 Accesos rápidos a funciones principales

### Clientes
- ➕ Agregar nuevos clientes
- 💳 Asignar límite de crédito
- 📋 Historial de compras

### Ventas
- 🛒 Crear boletas con IVA 19%
- 💰 Seguimiento de pagos
- 📊 Reporte de ventas por período

### Órdenes
- 📦 Órdenes de compra (a proveedores)
- 🚚 Órdenes de venta (a clientes)
- ✅ Estado: Borrador → Confirmada → Entregada

### Reportes
- 📉 Ventas por período
- 📊 Productos más rentables
- 👥 Top clientes por gasto
- 📦 Análisis de inventario

---

## 💾 Base de Datos y Backups

### Ubicación de Datos

Los datos se guardan automáticamente en:
```
C:\Users\[TuUsuario]\AppData\Roaming\.sanmartin\inventory.db
```

### Hacer Backup Manual

**Windows:**
```
copy C:\Users\[TuUsuario]\AppData\Roaming\.sanmartin\inventory.db C:\backup\inventory_backup.db
```

### Restaurar Backup

1. ⚙️ **Configuración** → **Avanzado**
2. **Restaurar Base de Datos**
3. Selecciona archivo de backup
4. Confirmar

---

## 🌙 Modo Oscuro

La aplicación automáticamente usa:
- **Modo claro:** Si tu Windows está en claro
- **Modo oscuro:** Si tu Windows está en oscuro

Para cambiar manualmente:
- ⚙️ **Configuración** → Busca "Tema"
- Selecciona: Claro, Oscuro, o Auto

---

## ❌ Desinstalar

1. **Panel de Control** → **Programas** → **Desinstalar un programa**
2. Busca: **Distribuidora San Martín**
3. Click → **Desinstalar**
4. Confirmar

**Tus datos se mantienen en:**
```
C:\Users\[TuUsuario]\AppData\Roaming\.sanmartin\
```

Para borrar todo, elimina esa carpeta después de desinstalar.

---

## 🆘 Solución de Problemas

### ❌ "La aplicación no inicia"
- Reinicia Windows
- Revisa antivirus (podría bloquearla)
- Descarga nuevamente el .exe

### ❌ "Error de conexión a base de datos"
- La BD se crea automáticamente al primer inicio
- Si persiste: elimina carpeta `.sanmartin` y reinicia

### ❌ "Olvidé contraseña de admin"
- No hay recuperación automática
- Solución: reinstalar aplicación
- Tus datos están en backup

### ❌ "La aplicación está lenta"
- Verifica que tengas 4GB RAM disponible
- Cierra otras aplicaciones pesadas
- Revisa que no esté antivirus escaneando

### ❌ "No puedo crear usuarios"
- Solo admin puede crear usuarios
- Ve a ⚙️ Configuración → Usuarios
- Verifica tener rol de administrador

---

## 📞 Soporte

**Documentación completa:**
- 📖 [README.md](README.md) - Visión general
- 👨‍💻 [DEVELOPMENT.md](DEVELOPMENT.md) - Para desarrolladores
- 🧪 [TESTING.md](TESTING.md) - Plan de pruebas
- 🚀 [DEPLOYMENT.md](DEPLOYMENT.md) - Despliegue

**Reportar bugs:**
- GitHub Issues: https://github.com/albertarcia82-create/distribuidora-san-martin/issues

---

## ✅ Checklist de Primera Configuración

- [ ] Instalada la aplicación
- [ ] Login con usuario: admin / admin123
- [ ] Contraseña de admin cambiada
- [ ] Datos de empresa configurados
- [ ] Usuarios adicionales creados
- [ ] Primeros productos agregados
- [ ] Primer cliente registrado
- [ ] Primer backup hecho

---

**¡Listo para usar!** 🎉

Distribuidora San Martín v0.3.0 está completamente funcional y listo para producción.
