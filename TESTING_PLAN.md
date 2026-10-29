# 🧪 Plan de Pruebas - Distribuidora San Martín v0.3.0

## 📋 Resumen Ejecutivo

**Versión:** 0.3.0  
**Fecha:** Octubre 2026  
**Estado:** Listo para QA  
**Tiempo estimado:** 2-3 horas de pruebas completas

---

## 🎯 Alcance de Pruebas

### ✅ Módulos Incluidos
- [x] Autenticación y Login
- [x] Dashboard y Estadísticas
- [x] Gestión de Inventario
- [x] Módulo de Ventas
- [x] CRM de Clientes
- [x] Órdenes de Compra/Venta
- [x] Reportes Avanzados
- [x] Configuración y Usuarios
- [x] Dark Mode
- [x] Responsividad Mobile

### ❌ Fuera de Alcance (FASE 4)
- Integración con pasarelas de pago
- API REST pública
- Mobile app nativa
- Sincronización en la nube

---

## 🏃 Flujo Crítico (Golden Path) - 15 minutos

### Objetivo
Validar que los flujos principales funcionan sin errores críticos.

### Pasos

#### 1️⃣ Login
- [ ] Iniciar aplicación
- [ ] Login con: `admin` / `admin123`
- [ ] ✅ Dashboard aparece
- [ ] ✅ Nombre de usuario visible (arriba a la derecha)

#### 2️⃣ Crear Producto
- [ ] Click: **Inventario** → **Productos**
- [ ] Click: **+ Nuevo Producto**
- [ ] Llenar:
  - Nombre: "Test Product 001"
  - Código: "TEST-001"
  - Categoría: "Pruebas"
  - Precio Costo: "100.00"
  - Precio Venta: "150.00"
  - Stock: "50"
  - Stock Mínimo: "10"
- [ ] Click: **Guardar**
- [ ] ✅ Producto aparece en lista
- [ ] ✅ Sin errores de consola (F12)

#### 3️⃣ Crear Cliente
- [ ] Click: **CRM** → **Clientes**
- [ ] Click: **+ Nuevo Cliente**
- [ ] Llenar:
  - Nombre: "Cliente Test"
  - Email: "cliente@test.com"
  - RUT: "12345678-K"
  - Teléfono: "+56912345678"
  - Dirección: "Calle Test 123"
  - Límite Crédito: "100000"
- [ ] Click: **Guardar**
- [ ] ✅ Cliente aparece en lista

#### 4️⃣ Crear Venta
- [ ] Click: **Ventas**
- [ ] Click: **+ Nueva Venta**
- [ ] Seleccionar Cliente: "Cliente Test"
- [ ] Agregar Producto: "Test Product 001"
  - Cantidad: "2"
  - ✅ Precio se auto-llena
  - ✅ Subtotal se calcula
- [ ] ✅ IVA (19%) se calcula automáticamente
- [ ] ✅ Total visible
- [ ] Click: **Guardar**
- [ ] ✅ Venta creada sin errores

#### 5️⃣ Verificar Reporte
- [ ] Click: **Reportes**
- [ ] Seleccionar: **Ventas por Período**
- [ ] ✅ Tu venta aparece
- [ ] ✅ Monto incluye IVA correcto
- [ ] ✅ Cliente correcto

---

## 🔐 Pruebas de Autenticación - 15 minutos

### Login Correcto
- [ ] Usuario: `admin` / Contraseña: `admin123`
- [ ] ✅ Abre Dashboard
- [ ] ✅ Token se guarda en localStorage
- [ ] ✅ Sesión persiste al refrescar (F5)

### Login Incorrecto
- [ ] Usuario: `admin` / Contraseña: `incorrect`
- [ ] ✅ Muestra error rojo
- [ ] ✅ No abre Dashboard
- [ ] ✅ Sin errores en consola

### Logout
- [ ] Click: Avatar arriba a la derecha
- [ ] Click: **Logout**
- [ ] ✅ Vuelve a Login
- [ ] ✅ localStorage limpio
- [ ] ✅ Al refrescar, pide login nuevamente

### Expiración de Sesión
- [ ] Login normalmente
- [ ] Abrir DevTools (F12) → Application → LocalStorage
- [ ] Modificar token manualmente (cambiar caracteres)
- [ ] Refrescar página
- [ ] ✅ Detecta token inválido
- [ ] ✅ Redirige a Login

---

## 📦 Pruebas de Inventario - 20 minutos

### CRUD de Productos
- [ ] **Create:** Nuevo producto se crea ✅
- [ ] **Read:** Producto aparece en lista ✅
- [ ] **Update:** Editar precio y guardar ✅
- [ ] **Delete:** Eliminar producto ✅

### Validaciones
- [ ] Campo vacío → Error rojo ✅
- [ ] Precio negativo → Rechaza ✅
- [ ] Código duplicado → Error "ya existe" ✅
- [ ] Stock no numérico → Error ✅

### Alertas de Stock
- [ ] Crear producto con Stock Mínimo = 10
- [ ] Poner stock actual a 5
- [ ] ✅ Dashboard muestra alerta
- [ ] ✅ Badge rojo en Inventario
- [ ] ✅ Incluido en reporte de bajo stock

### Categorías
- [ ] Crear nueva categoría ✅
- [ ] Usar en producto ✅
- [ ] Filtrar por categoría ✅
- [ ] Eliminar categoría sin productos ✅

---

## 👥 Pruebas de CRM - 20 minutos

### CRUD de Clientes
- [ ] Crear cliente ✅
- [ ] Editar cliente ✅
- [ ] Ver detalles ✅
- [ ] Eliminar cliente ✅

### Límite de Crédito
- [ ] Crear cliente con límite: 50000
- [ ] Crear venta por: 40000
- [ ] ✅ Acepta (40000 < 50000)
- [ ] Crear otra venta por: 20000
- [ ] ✅ Rechaza o advierte (60000 > 50000)

### Historial de Compras
- [ ] Click en cliente
- [ ] ✅ Muestra todas sus ventas
- [ ] ✅ Total gastado correcto
- [ ] ✅ Última compra visible

---

## 💰 Pruebas de Ventas - 25 minutos

### Crear Venta Completa
- [ ] Nuevo cliente: "Juan Pérez"
- [ ] Nueva venta para Juan
- [ ] Agregar 2-3 productos
  - Producto A: 2 unidades @ $100 = $200
  - Producto B: 1 unidad @ $500 = $500
  - Subtotal: $700
  - IVA (19%): $133
  - **Total: $833** ✅
- [ ] ✅ Cálculos correctos

### Métodos de Pago
- [ ] Crear venta con Pago: Efectivo ✅
- [ ] Crear venta con Pago: Tarjeta ✅
- [ ] Crear venta con Pago: Crédito ✅
- [ ] ✅ Se guarda el método

### Formas de Documento
- [ ] Crear como Boleta ✅
- [ ] Crear como Factura (si usuario es admin) ✅
- [ ] Tipo se guarda correctamente ✅

### Edición de Venta
- [ ] Editar venta en estado: Borrador ✅
- [ ] No permitir editar: Confirmada ❌
- [ ] ✅ Validación funciona

---

## 📊 Pruebas de Reportes - 20 minutos

### Reporte: Ventas por Período
- [ ] Crear 3-4 ventas
- [ ] Filtrar por mes actual
- [ ] ✅ Muestra todas las ventas
- [ ] ✅ Total correcto
- [ ] ✅ Promedio por transacción
- [ ] Exportar (si aplica) ✅

### Reporte: Productos Rentables
- [ ] ✅ Muestra margen de cada producto
- [ ] ✅ Ordena por rentabilidad
- [ ] ✅ Color coding: Bueno (verde), Normal (azul), Bajo (rojo)

### Reporte: Top Clientes
- [ ] ✅ Ordena por dinero gastado
- [ ] ✅ Muestra top 10
- [ ] ✅ Último cliente tiene menos que primero

### Reporte: Análisis de Inventario
- [ ] ✅ Stock actual visible
- [ ] ✅ Barra de progreso visual
- [ ] ✅ Productos bajo stock en rojo
- [ ] ✅ Valor total de inventario

---

## 📋 Pruebas de Órdenes - 20 minutos

### Órdenes de Compra
- [ ] Crear orden a proveedor ✅
- [ ] Estados: Borrador → Confirmada → Entregada ✅
- [ ] Agregar ítems y cantidades ✅
- [ ] Total se calcula ✅

### Órdenes de Venta
- [ ] Crear orden de venta ✅
- [ ] Seleccionar cliente ✅
- [ ] Cambiar de estado correctamente ✅
- [ ] No permite saltar estados ✅

### Validaciones
- [ ] Campo requerido vacío → Error ✅
- [ ] Cantidad no numérica → Error ✅
- [ ] Proveedor/Cliente no seleccionado → Error ✅

---

## ⚙️ Pruebas de Configuración - 15 minutos

### Datos de Empresa
- [ ] Editar información ✅
- [ ] Cambiar IVA (probar: 0%, 19%, 27%) ✅
- [ ] Guardar sin errores ✅
- [ ] IVA afecta cálculos de ventas ✅

### Gestión de Usuarios
- [ ] Crear usuario: Bodega ✅
- [ ] Crear usuario: Ventas ✅
- [ ] Crear usuario: Admin ✅
- [ ] Editar rol de usuario ✅
- [ ] Eliminar usuario ✅

### Permisos por Rol
**Admin:**
- [ ] Ver Dashboard ✅
- [ ] Ver Inventario ✅
- [ ] Ver CRM ✅
- [ ] Ver Ventas ✅
- [ ] Ver Órdenes ✅
- [ ] Ver Reportes ✅
- [ ] Acceder Configuración ✅

**Bodega (si implementado):**
- [ ] Ver Inventario ✅
- [ ] ❌ No ver Ventas
- [ ] ❌ No ver CRM
- [ ] ❌ No acceder Configuración

**Ventas (si implementado):**
- [ ] Ver CRM ✅
- [ ] Ver Ventas ✅
- [ ] ❌ No ver Inventario
- [ ] ❌ No acceder Configuración

### Backup y Restore
- [ ] ⚙️ Configuración → Avanzado → Hacer Backup ✅
- [ ] Archivo se descarga ✅
- [ ] ⚙️ Configuración → Avanzado → Restaurar ✅
- [ ] Datos se restauran correctamente ✅

---

## 🌙 Pruebas de Interfaz - 10 minutos

### Dark Mode
- [ ] Sistema en claro → Tema claro ✅
- [ ] Sistema en oscuro → Tema oscuro ✅
- [ ] Colores legibles en ambos ✅
- [ ] Iconos visibles en ambos ✅

### Responsividad
**Desktop (1920x1080):**
- [ ] Layout correcto ✅
- [ ] Sin scroll horizontal ✅
- [ ] Todos los botones accesibles ✅

**Tablet (768px):**
- [ ] Menú colapsable ✅
- [ ] Tablas scrolleables ✅
- [ ] Botones clickeables ✅

**Mobile (375px):**
- [ ] Menú hamburguesa ✅
- [ ] Formularios en una columna ✅
- [ ] Botones grandes ✅

### Navegación
- [ ] Click en logo → Dashboard ✅
- [ ] Botones de navegación funcionan ✅
- [ ] Breadcrumbs muestran ubicación ✅
- [ ] Volver atrás funciona ✅

---

## 🔧 Pruebas de Rendimiento - 10 minutos

### Carga
- [ ] App inicia en < 5 segundos ✅
- [ ] Dashboard carga en < 2 segundos ✅
- [ ] Lista de 100 productos carga sin lag ✅

### Memoria
- [ ] Abrir DevTools → Memory
- [ ] Navegar entre módulos
- [ ] ✅ No hay memory leaks
- [ ] ✅ RAM se estabiliza

### Console (F12)
- [ ] ✅ Sin errores rojos (errors)
- [ ] ⚠️ Warnings son aceptables
- [ ] ✅ Sin errores de CORS

---

## 🐛 Pruebas de Casos Extremos - 15 minutos

### Datos Grandes
- [ ] Crear 50 productos ✅
- [ ] Crear 30 clientes ✅
- [ ] Crear 20 ventas ✅
- [ ] ✅ Reportes aún cargan rápido

### Datos Especiales
- [ ] Nombre con acentos: "José María" ✅
- [ ] Número con comas: "1,000.50" ✅
- [ ] Email inválido: rechaza ✅
- [ ] Caracteres especiales en notas ✅

### Errores Inesperados
- [ ] Cerrar navegador sin guardar → Datos permanecen ✅
- [ ] Refrescar durante operación → Sin corrupción ✅
- [ ] Llenar campo, tabular, volver atrás → Datos se pierden ❌ (aceptable)

---

## 📋 Checklist Final de QA

- [ ] Flujo crítico completado sin errores
- [ ] Login/Logout funciona correctamente
- [ ] CRUD completo para: Productos, Clientes, Ventas
- [ ] Cálculos de IVA (19%) correctos
- [ ] Límite de crédito se respeta
- [ ] Reportes muestran datos correctos
- [ ] Dark mode funciona
- [ ] Responsive en mobile
- [ ] Sin errores en consola
- [ ] Permisos por rol funcionan (si aplica)
- [ ] Backup/Restore funciona
- [ ] Base de datos se persiste
- [ ] Rendimiento aceptable (< 5s carga)

---

## ✅ Criterio de Aprobación

**APROBADO** si:
- ✅ 90% o más de pruebas pasan
- ✅ Sin errores críticos (rojo en consola)
- ✅ Flujo principal funciona
- ✅ Datos se guardan correctamente

**RECHAZADO** si:
- ❌ Flujo principal falla
- ❌ Datos no se guardan
- ❌ Errores críticos en consola
- ❌ IVA se calcula incorrectamente

---

## 📝 Notas

**Tester:** [Tu nombre]  
**Fecha:** [Fecha de prueba]  
**Observaciones:**

```
[Espacio para observaciones y bugs encontrados]
```

---

**¡A Probar!** 🚀
