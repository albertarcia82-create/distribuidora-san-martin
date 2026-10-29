# 🧪 Guía de Testing - Distribuidora San Martín

## Niveles de Testing

```
┌──────────────────────────────┐
│   End-to-End Tests (E2E)     │  Cypress
│  (Flujos completos en app)   │
└──────────────────┬───────────┘
                   │
┌──────────────────▼───────────┐
│   Integration Tests          │  Jest + mock Tauri
│  (Componentes + Backend)     │
└──────────────────┬───────────┘
                   │
┌──────────────────▼───────────┐
│   Unit Tests                 │  Jest
│  (Funciones aisladas)        │
└──────────────────────────────┘
```

---

## 🎯 Golden Path Testing

### Flujo 1: Login → Dashboard → Crear Venta

**Pasos:**
1. ✅ Abrir aplicación
2. ✅ Login con usuario válido
3. ✅ Ver Dashboard con estadísticas
4. ✅ Ir a Ventas
5. ✅ Crear venta con 2 items
6. ✅ Aplicar descuento 10%
7. ✅ Ver IVA calculado correctamente (19%)
8. ✅ Guardar venta
9. ✅ Ver en historial

**Criterios de Éxito:**
- Login exitoso → token guardado
- Dashboard carga en <2s
- Venta se crea sin errores
- Total = (subtotal - descuento) * 1.19
- Venta aparece en historial

---

### Flujo 2: Crear Orden de Compra → Confirmar

**Pasos:**
1. ✅ Ir a Órdenes
2. ✅ Crear nueva orden tipo "Compra"
3. ✅ Seleccionar proveedor
4. ✅ Agregar 3 items
5. ✅ Ver total calculado
6. ✅ Guardar (estado = "draft")
7. ✅ Confirmar orden
8. ✅ Verificar estado = "confirmed"
9. ✅ Botón de confirmar desaparece

**Criterios de Éxito:**
- Orden se crea en estado "draft"
- Total es sum(cantidad * precio)
- Confirmación solo disponible en draft
- Después de confirmar, estado es "confirmed"
- Orden aparece en tabla con filtro

---

### Flujo 3: Generar Reporte de Ventas

**Pasos:**
1. ✅ Ir a Reportes
2. ✅ Seleccionar "Ventas por Período"
3. ✅ Filtrar últimos 30 días
4. ✅ Ver totales: ventas, cantidad, transacciones
5. ✅ Cambiar fechas
6. ✅ Exportar a PDF (próxima versión)

**Criterios de Éxito:**
- Reportes cargan en <3s
- Totales son correctos
- Filtros funcionan
- Tabla muestra datos agregados

---

## 🔍 Edge Cases Testing

### Form Validation

```
┌─────────────────────────────────┐
│ Campo Vacío                     │
├─────────────────────────────────┤
│ Expected: Error "requerido"     │
│ Button Submit: Disabled         │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Email Inválido                  │
├─────────────────────────────────┤
│ Input: "notanemail"             │
│ Expected: Error "Email inválido"│
│ Button Submit: Disabled         │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Cantidad Negativa               │
├─────────────────────────────────┤
│ Input: -5                       │
│ Expected: Error "> 0 requerido" │
│ Button Submit: Disabled         │
└─────────────────────────────────┘
```

### Número Handling

```
Descuento = 150% (inválido)
→ Error: "0-100%"

Precio = 0
→ Error: "Precio > 0"

Cantidad = 0.5 (no entero)
→ Redondear a 1 o Error
```

### Stock Management

```
Producto con stock = 0
→ Mostrar "Agotado" en rojo
→ No permitir venta (próxima versión)

Producto con stock < 5
→ Mostrar "Stock Bajo" en amarillo
```

---

## 📱 Mobile Testing (768px breakpoint)

### Checklist

- [ ] Sidebar colapsa automáticamente
- [ ] Tabla se hace horizontal (scroll)
- [ ] Formularios se apilan verticalmente
- [ ] Botones son clickeables (>44px)
- [ ] Dark mode funciona
- [ ] Navegación toca los items
- [ ] Tipografía es legible

### Device Testing

```
✅ iPhone 12 (390px)
✅ iPad (768px)
✅ Desktop (1400px)
```

---

## 🌙 Dark Mode Testing

### Checklist

- [ ] Texto visible en fondo oscuro
- [ ] Contrastes WCAG AA mínimo (4.5:1)
- [ ] Íconos visibles
- [ ] Inputs/selects legibles
- [ ] Transición suave
- [ ] Todos los componentes incluidos

### Prueba Manual

```bash
# Mac
Cmd + Shift + A → "Apariencia" → Dark

# Windows 11
Settings → Personalization → Dark mode
```

---

## 🔄 Performance Testing

### Métricas Objetivo

| Métrica | Objetivo | Herramienta |
|---------|----------|-------------|
| **Load** | < 2s | Chrome DevTools |
| **FCP** | < 1s | Lighthouse |
| **LCP** | < 2.5s | Lighthouse |
| **CLS** | < 0.1 | Lighthouse |
| **Memory** | < 150MB | Task Manager |

### Test Simple

```bash
# Chrome DevTools
F12 → Performance → Record

# Interacciones a medir:
1. Click "Nueva Venta" → formulario abre
2. Escribir en campos → validación aparece
3. Click "Guardar" → venta se crea
```

---

## 🔐 Security Testing

### Checklist

- [ ] **SQL Injection** — Intentar `'; DROP TABLE--` en búsqueda
  - Expected: Error o búsqueda normal (no crash)

- [ ] **XSS** — Intentar `<script>alert('xss')</script>` en campos
  - Expected: Se muestra como texto, no se ejecuta

- [ ] **CSRF** — Session sigue válida tras cierre
  - Expected: Login nuevamente requerido

- [ ] **Weak Password** — Crear usuario con "123"
  - Expected: Error "Contraseña débil"

- [ ] **JWT Expiration** — Esperar 8h+ con sesión activa
  - Expected: Logout automático, redirigir a login

---

## 🚨 Error Scenarios

### Backend Offline

**Pasos:**
1. Cerrar servidor Tauri
2. Intentar crear venta
3. Esperar error

**Expected:**
```
❌ Error: "Connection refused"
[Reintentar] [Volver]
```

### Database Corruption

**Pasos:**
1. Eliminar archivo `~/.sanmartin/inventory.db`
2. Intentar crear venta

**Expected:**
```
❌ Error: "Database not found"
[Recrear Base de Datos] [Cancelar]
```

### Low Memory

**Pasos:**
1. Abrir múltiples reportes grandes
2. Monitorear memory usage
3. Esperar a que baje memoria

**Expected:**
- App sigue funcionando
- No crash
- Memory se libera

---

## 📊 Automated Testing Setup (Próximo)

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Cypress Configuration

```javascript
// cypress.config.js
module.exports = {
  e2e: {
    baseUrl: 'http://localhost:5173',
    viewportWidth: 1280,
    viewportHeight: 720,
  },
};
```

### GitHub Actions Testing

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:e2e
```

---

## ✅ Pre-Release Checklist

### Funcionalidad
- [ ] Todos los 7 componentes principales funcionan
- [ ] Login/logout funciona
- [ ] CRUD completo en cada módulo
- [ ] Reportes generan datos correctos
- [ ] Exportación de datos (próx)
- [ ] Búsqueda y filtros funcionan

### Performance
- [ ] App abre en < 2s
- [ ] Operaciones CRUD en < 1s
- [ ] Reportes en < 3s
- [ ] Scroll suave en tablas de 100+ rows
- [ ] Memory estable (<150MB)

### UI/UX
- [ ] Dark mode funciona
- [ ] Mobile responsive (768px)
- [ ] Errores claros en rojo
- [ ] Éxitos confirmados
- [ ] Botones accesibles

### Security
- [ ] No SQL injection
- [ ] No XSS
- [ ] JWT funciona
- [ ] Passwords hasheados
- [ ] Roles respetados

### Data
- [ ] Backups automáticos
- [ ] Auditoría de cambios
- [ ] Integridad referencial
- [ ] Sin data corruption

---

## 📈 Bug Reporting Template

```markdown
### Bug Title
[Breve descripción]

### Reproductibilidad
1. Paso 1
2. Paso 2
3. Paso 3

### Resultado Esperado
[Qué debería pasar]

### Resultado Actual
[Qué pasó en realidad]

### Evidencia
- Screenshot/Video
- Error logs
- Ambiente (Windows 11, etc)

### Severidad
[ ] Critical (App crash)
[ ] High (Feature broken)
[ ] Medium (Workaround exists)
[ ] Low (Minor UI issue)
```

---

**Testing exhaustivo = Aplicación confiable** 🎯
