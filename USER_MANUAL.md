# 👤 Manual del Usuario - Distribuidora San Martín v0.3.0

## 📖 Índice
1. [Dashboard](#dashboard)
2. [Gestión de Inventario](#gestión-de-inventario)
3. [Módulo de Clientes](#módulo-de-clientes)
4. [Módulo de Ventas](#módulo-de-ventas)
5. [Órdenes de Compra/Venta](#órdenes)
6. [Reportes](#reportes)
7. [Configuración](#configuración)
8. [Atajos Útiles](#atajos-útiles)

---

## 🏠 Dashboard

### ¿Qué es?
La pantalla principal con resumen visual de tu negocio en tiempo real.

### Información que ves

**📊 Tarjetas de Estadísticas:**
- **Productos:** Total en inventario
- **Categorías:** Tipos de productos
- **Bajo Stock:** Productos cercanos a agotar
- **Sin Stock:** Productos agotados
- **Valor Total:** Dinero invertido en inventario

**⚡ Tarjetas de Acciones Rápidas:**
- ➕ Nuevo Producto
- 🛒 Nueva Venta
- 📦 Nueva Orden
- 👥 Nuevo Cliente

**🎯 Cómo usarla:**
1. Abre la app
2. Revisa números en la parte superior
3. Si hay rojo → Hay bajo stock
4. Usa los botones para acciones rápidas

---

## 📦 Gestión de Inventario

### Acceder
Click en **Inventario** en menú lateral

### 🏷️ Productos

#### Crear Nuevo Producto
1. Click → **+ Nuevo Producto**
2. Completa campos:
   - **Nombre:** "Arroz Integral 5kg"
   - **Código:** "ARR-001" (único para cada producto)
   - **Categoría:** "Granos" (crear nueva si no existe)
   - **Precio Costo:** Cuánto te cuesta ($)
   - **Precio Venta:** Cuánto vendes (incluye ganancia)
   - **Stock Actual:** Cantidad en bodega ahora
   - **Stock Mínimo:** Cantidad para advertencia
3. Click → **Guardar**
4. ✅ Producto aparece en lista

#### Editar Producto
1. Click en producto en lista
2. Modifica los campos que necesites
3. Click → **Guardar**
4. ✅ Cambios guardados

#### Eliminar Producto
1. Click en producto
2. Click → **Eliminar** (botón rojo)
3. Confirmar
4. ⚠️ No se puede deshacer

#### Ver Detalles
1. Click en producto
2. Ve:
   - Historial de ventas
   - Movimientos de stock
   - Margen de ganancia

### 🔑 Categorías

#### Crear Categoría
1. Click en **Categorías**
2. Click → **+ Nueva Categoría**
3. Nombre: "Bebidas"
4. Guardar

#### Usar en Producto
1. Al crear/editar producto
2. Selecciona categoría del dropdown
3. O crea una nueva al momento

#### Filtrar por Categoría
1. En lista de productos
2. Dropdown superior: selecciona categoría
3. Muestra solo productos de esa categoría

### ⚠️ Alertas de Stock

**¿Cuándo aparecen?**
- Cuando stock actual ≤ stock mínimo

**¿Dónde las ves?**
- 🔴 Badge rojo en Inventario
- 📊 Tarjeta en Dashboard
- 📉 Reporte de bajo stock

**¿Qué hacer?**
1. Comprar más al proveedor
2. Crear Orden de Compra
3. Cuando llega, actualizar stock

---

## 👥 Módulo de Clientes

### Acceder
Click en **CRM** en menú lateral

### ➕ Crear Cliente

1. Click → **+ Nuevo Cliente**
2. Completa:
   - **Nombre:** "Supermercado Central"
   - **Email:** "contacto@supercentral.cl"
   - **RUT:** "11222333-4" (con guion)
   - **Teléfono:** "+56 9 1234 5678"
   - **Dirección:** "Av. Principal 500, Comuna"
   - **Límite Crédito:** Máximo que puede deber ($)
3. Click → **Guardar**
4. ✅ Cliente creado

### 📋 Ver Cliente

Click en cliente para ver:
- Información de contacto
- Límite de crédito
- Crédito usado (dinero pendiente)
- Historial de compras
- Última compra

### ✏️ Editar Cliente

1. Click en cliente
2. Edita los campos necesarios
3. Click → **Guardar**

### 💳 Límite de Crédito

**¿Qué es?**
Máximo dinero que el cliente puede deber.

**Ejemplo:**
- Cliente: "Juan's Almacén"
- Límite: $100,000
- Ya debe: $80,000
- Puede comprar: $20,000 más
- Si intenta $30,000 → ⚠️ Alerta

**Cómo cambiar:**
1. Click en cliente
2. Edita "Límite de Crédito"
3. Guardar

### 👁️ Historial de Compras

En cliente:
- Ve todas sus ventas
- Fecha, monto, documento
- Método de pago
- Total gastado

---

## 💰 Módulo de Ventas

### Acceder
Click en **Ventas** en menú lateral

### 🛒 Crear Nueva Venta

1. Click → **+ Nueva Venta**
2. **Selecciona Cliente:**
   - Dropdown: elige de lista
   - O agrega nuevo cliente
3. **Agregar Productos:**
   - Click → **+ Agregar Producto**
   - Selecciona producto
   - Ingresa cantidad
   - ✅ Precio se auto-llena
   - ✅ Subtotal se calcula
4. **Revisar Totales:**
   - Subtotal: suma de productos
   - IVA (19%): impuesto automático
   - **Total: subtotal + IVA**
5. **Método de Pago:**
   - Efectivo
   - Tarjeta
   - Crédito
6. **Tipo de Documento:**
   - Boleta
   - Factura (si eres admin)
7. Click → **Guardar**
8. ✅ Venta creada

### 📊 Entender Cálculos

**Ejemplo:**
```
Producto A: 2 × $500 = $1,000
Producto B: 1 × $300 = $  300
────────────────────────────
Subtotal:            $1,300
IVA (19%):           $  247
────────────────────────────
TOTAL:               $1,547
```

**Nota:** En Chile, IVA es 19% y es obligatorio.

### ✏️ Editar Venta

**Si está en BORRADOR:**
1. Click en venta
2. Modifica productos/cliente
3. Guardar

**Si está CONFIRMADA:**
- ❌ No se puede editar
- ✅ Se puede ver
- 💬 Se puede agregar nota

### ✅ Confirmar Venta

1. Venta en estado Borrador
2. Click → **Confirmar**
3. Venta pasa a CONFIRMADA
4. Ya no se puede editar
5. ✅ Se registra en reportes

### ❌ Cancelar Venta

1. Click en venta
2. Click → **Cancelar**
3. Motivo (opcional)
4. Confirmar
5. Venta se anula
6. Stock se devuelve

### 🔍 Filtros de Ventas

- **Por fecha:** Rango de fechas
- **Por cliente:** Selecciona cliente
- **Por estado:** Borrador, Confirmada, Cancelada
- **Por monto:** Rango de precio

---

## 📦 Órdenes

### Acceder
Click en **Órdenes** en menú lateral

### 🛍️ Orden de Compra

**¿Qué es?**
Solicitud de productos A UN PROVEEDOR.

#### Crear Orden de Compra
1. Click → **+ Nueva Orden** → **Compra**
2. Selecciona **Proveedor**
3. Agrega **Productos:**
   - Producto
   - Cantidad a comprar
   - Precio unitario (negociado)
4. ✅ Total se calcula
5. **Fecha Entrega Esperada**
6. Click → **Guardar**

#### Estados de Orden Compra
- 📝 **Borrador:** Aún no enviada
- ✅ **Confirmada:** Proveedor confirmó
- 🚚 **Entregada:** Llegó la mercadería
- ❌ **Cancelada:** No se hizo

#### Proceso Orden Compra
1. Crear en **Borrador**
2. Enviar a proveedor
3. Cambiar a **Confirmada**
4. Cuando llega → **Entregada**
5. ✅ Stock se actualiza automáticamente

### 🚀 Orden de Venta

**¿Qué es?**
Solicitud de compra DE UN CLIENTE.

#### Crear Orden de Venta
1. Click → **+ Nueva Orden** → **Venta**
2. Selecciona **Cliente**
3. Agrega **Productos:**
   - Cantidad solicitada
4. **Fecha Entrega Esperada**
5. Click → **Guardar**

#### Estados de Orden Venta
- 📝 **Borrador:** Cliente está viendo
- ✅ **Confirmada:** Cliente confirmó
- 🚚 **Entregada:** Recibió su pedido
- ❌ **Cancelada:** Cliente canceló

---

## 📊 Reportes

### Acceder
Click en **Reportes** en menú lateral

### 📉 Ventas por Período

**¿Qué ves?**
Todas las ventas en un rango de fechas.

**Información:**
- Número de ventas
- Monto total (con IVA)
- Promedio por venta
- Desglose por cliente

**Cómo usar:**
1. Selecciona fechas
2. Agrega límite de resultados (top 10, 20, 50)
3. Click → **Ver Reporte**
4. Tabla con todas las ventas

**Exportar (si aplica):**
- Botón 📥 Descargar CSV
- Para análisis en Excel

### 📈 Productos Más Rentables

**¿Qué ves?**
Ganancias por producto.

**Información:**
- Producto
- Cantidad vendida
- Margen de ganancia (%)
- Margen total ($)

**Color Coding:**
- 🟢 **Verde:** Margen > 40% (excelente)
- 🔵 **Azul:** Margen 20-40% (bueno)
- 🔴 **Rojo:** Margen < 20% (bajo)

**Cómo interpretar:**
- Verde = Mantén precio
- Rojo = Aumenta precio o reduce costo

### 👥 Top Clientes

**¿Qué ves?**
Clientes que más gastaron.

**Información:**
- Nombre cliente
- Total gastado
- Número de compras
- Promedio por compra
- Última compra

**Usa para:**
- Identificar clientes VIP
- Ofrecer descuentos a los mejores
- Prevenir pérdida de clientes importantes

### 📦 Análisis de Inventario

**¿Qué ves?**
Situación actual del stock.

**Información:**
- Producto
- Stock actual
- Barra de progreso
- Valor total

**Color en Barra:**
- 🟢 **Verde:** Stock normal
- 🟡 **Amarillo:** Bajo stock
- 🔴 **Rojo:** Muy bajo stock

**Usa para:**
- Planear compras
- Ver valor invertido
- Identificar qué comprar

---

## ⚙️ Configuración

### Acceder
Click en ⚙️ (arriba a la derecha)

### 🏢 Datos de Empresa

**Cambiar información de tu empresa:**
- Nombre: "Distribuidora San Martín"
- RUT: Sin puntos (11222333-4)
- Email: contacto@sanmartin.cl
- Teléfono: +56 2 XXXX XXXX
- Dirección: Domicilio
- **IVA (%):** Importante - cambia cálculos
  - Chile: 19%
  - Otros: 0%, 5%, 8%, etc.

**Guardar sin errores** → Los cambios afectan nuevas ventas

### 👨‍💼 Gestión de Usuarios

**Solo Admin puede hacer esto.**

#### Crear Usuario
1. Click → **+ Nuevo Usuario**
2. Datos:
   - Nombre completo
   - Email (único)
   - Contraseña segura
   - **Rol:**
     - **Admin:** Todo
     - **Bodega:** Solo inventario
     - **Ventas:** Solo CRM + Ventas
3. Guardar
4. Nuevo usuario puede login

#### Editar Usuario
1. Click en usuario
2. Cambia nombre, email, rol
3. Guardar

#### Cambiar Contraseña
1. Click en usuario
2. Click → **Cambiar Contraseña**
3. Nueva contraseña
4. Guardar

#### Eliminar Usuario
1. Click en usuario
2. Click → **Eliminar** (rojo)
3. Confirmar
4. ⚠️ Usuario ya no puede entrar

### 🆘 Avanzado

#### Hacer Backup
1. Click → **Hacer Backup**
2. Archivo `.db` se descarga
3. **Guarda en lugar seguro:**
   - Google Drive
   - Dropbox
   - Pen drive
   - Disco externo

**¿Cuándo hacer backup?**
- Diariamente antes de cerrar
- Antes de cambios importantes
- Semanalmente como mínimo

#### Restaurar Backup
1. Click → **Restaurar Base de Datos**
2. Selecciona archivo `.db`
3. Confirmar
4. ⚠️ Datos actuales se pierden
5. Datos de backup se restauran

---

## ⌨️ Atajos Útiles

**Navegación:**
- `Ctrl + H` → Dashboard (si existe)
- `Ctrl + Q` → Logout (si existe)
- `Alt + ←` → Atrás
- `Alt + →` → Adelante

**Formularios:**
- `Tab` → Siguiente campo
- `Shift + Tab` → Campo anterior
- `Enter` → Guardar
- `Esc` → Cancelar

**Otros:**
- `F5` → Refrescar página
- `F12` → Developer Tools
- `Ctrl + P` → Imprimir

---

## 🌙 Tema Oscuro

**Activar automáticamente:**
- Cambia tu Windows a tema oscuro
- App se adapta automáticamente

**Cambiar manualmente:**
- ⚙️ Configuración
- Busca "Tema"
- Opciones: Claro / Oscuro / Automático

---

## 📱 Usar en Mobile

La app funciona en teléfono/tablet:
- Menú se convierte en "hamburguesa" (☰)
- Formularios se adaptan al ancho
- Botones se hacen más grandes
- Tablas scrollean horizontalmente

---

## 💡 Tips & Tricks

✅ **Productividad:**
1. Agrega stocks mínimos realistas
2. Revisa Dashboard cada mañana
3. Confirma órdenes antes de cerrar día
4. Haz backup diarios

✅ **Finanzas:**
1. Monitorea margen de productos
2. Entiende límite de crédito de clientes
3. Revisa reportes semanales
4. Mantén IVA actualizado

✅ **Seguridad:**
1. Contraseña fuerte (8+ caracteres)
2. Cambia contraseña cada 3 meses
3. No compartas login
4. Backup diarios

---

## 🆘 Necesitas Ayuda?

**Si algo no funciona:**
1. Intenta refrescar (F5)
2. Cierra y reabre app
3. Lee esta guía nuevamente
4. Consulta con admin

**Bugs o sugerencias:**
- GitHub: https://github.com/albertarcia82-create/distribuidora-san-martin/issues

---

**¡Éxito con tu Distribuidora!** 🚀
