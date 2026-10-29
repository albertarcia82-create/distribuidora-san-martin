# 🚀 Guía de Deployment - Distribuidora San Martín

## Versiones de Distribución

### v0.3.0 (Actual - Feature Complete)
- ✅ 8 componentes funcionales
- ✅ Reportes avanzados
- ✅ Dark mode completo
- ✅ Documentación exhaustiva
- 🎯 **Estado: Listo para Release**

---

## 📦 Opciones de Distribución

### Opción 1: GitHub Releases (Recomendado)

**Ventajas:**
- Auto-descarga desde web
- Historial de versiones
- Rollback fácil
- Updates automáticas (próx)

**Pasos:**

1. **Compilar en GitHub Actions**
   ```bash
   git push origin main
   # Espera a que compile (5-10 min)
   # Actions → windows-build → Download artifact
   ```

2. **Crear Release**
   ```bash
   gh release create v0.3.0 \
     src-tauri/target/release/bundle/nsis/distribuidora-san-martin_0.3.0_x64-setup.exe \
     --title "Distribuidora San Martín v0.3.0" \
     --notes "✅ Feature Complete
   - 8 componentes completados
   - Reportes avanzados
   - Dark mode
   - Full documentation"
   ```

3. **Descargar en cliente**
   - URL: `https://github.com/repo/releases`
   - Click en `.exe` más reciente
   - Ejecutar instalador

---

### Opción 2: Share Local

**Para compartir dentro de empresa:**

```bash
# 1. Compilar
npm run tauri build

# 2. Copiar a share
copy src-tauri\target\release\bundle\nsis\*.exe \\servidor\shared\

# 3. Dar permisos
- Lectura: Todo usuario
- Archivo: Notarizado (opcional)
```

---

### Opción 3: Instalador NSIS Custom

**Personalizar instalador:**

```toml
# src-tauri/tauri.conf.json
{
  "bundle": {
    "nsis": {
      "installerIcon": "./assets/icon.ico",
      "dialogIconPath": "./assets/icon.ico",
      "headerImage": "./assets/header.bmp",
      "licenseFile": "LICENSE.txt"
    }
  }
}
```

---

## 🔄 Proceso de Actualización

### Para Usuarios (v0.3.0 → v0.4.0)

**Manual:**
1. Descargar nuevo `.exe`
2. Ejecutar
3. Instalador detecta versión anterior
4. Ofrece "Actualizar" o "Reinstalar"
5. Preserva datos en `~/.sanmartin/`

**Automático (Próxima versión):**
```
Menu → Help → Check Updates
↓
Si hay update disponible → Download
↓
Reiniciar e instalar
↓
Preservar datos automáticamente
```

---

## 📊 Infraestructura de Producción

### Database Backup

**Automático (Próximo):**
```
Cada 24h:
~/.sanmartin/inventory.db → Cloud backup
```

**Manual:**
```bash
# Windows
copy %APPDATA%\.sanmartin\inventory.db C:\backups\

# Mac/Linux
cp ~/.sanmartin/inventory.db ~/backups/

# Date
$(date +%Y%m%d)_inventory.db
```

---

## 🔐 Security Considerations

### Antes de Release

- [ ] **Code Review** — Revisar cambios críticos
- [ ] **Dependency Audit** — `npm audit`, `cargo audit`
- [ ] **Security Testing** — SQL injection, XSS, CSRF
- [ ] **Performance Testing** — <2s load time
- [ ] **Stress Testing** — 1000+ transacciones

### En Producción

- [ ] **HTTPS only** (Tauri maneja)
- [ ] **Database encryption** (Próximo: SQLCipher)
- [ ] **Rate limiting** (Próximo)
- [ ] **Audit logs** (Implementado)
- [ ] **2FA** (Próximo)

---

## 📈 Rollout Strategy

### Phase 1: Beta (1 usurio - Tú)
```
Instalar v0.3.0
↓
Probar todos los flujos
↓
Report bugs si existen
↓
Fix si necesario → v0.3.1
```

### Phase 2: Pilot (5-10 usuarios - Equipo)
```
Distribuir v0.3.0 a bodega/ventas
↓
Feedback durante 1 semana
↓
Entrenar en uso
↓
Monitorear performance
```

### Phase 3: Full Rollout (Todos)
```
Instalador en share corporativo
↓
Email con guía GETTING_STARTED.md
↓
Soporte técnico disponible
↓
Monitorear estabilidad
```

---

## 🛠️ Troubleshooting Deployment

### .exe no funciona

**Problema:** "The application failed to initialize"

**Soluciones:**
1. Reinstalar completamente
   ```bash
   Add/Remove Programs → Uninstall
   Reiniciar
   Instalar nuevamente
   ```

2. Verificar Windows 10/11
   - Mínimo: Windows 10 Build 19041

3. Actualizar Visual C++ Redistributable
   - [Download](https://support.microsoft.com/en-us/help/2977003)

### Database not found

**Problema:** "Database not found on startup"

**Solución:**
- App crea automáticamente en primer uso
- Si no: `%APPDATA%\.sanmartin\`
- Crear folder manualmente si no existe

### Performance lento

**Check:**
- Número de productos en inventario
- CPU/Memory en Task Manager
- Antivirus ralentizando I/O

**Optimizar:**
- Cerrar otras apps
- Actualizar drivers GPU
- Limpiar cache temporal

---

## 📞 Release Notes Template

```markdown
# Distribuidora San Martín v0.3.0

## ✨ Nuevo
- 🆕 Órdenes de compra/venta con dual type
- 🆕 Reportes avanzados (4 tipos)
- 🆕 Gestión de usuarios y configuración
- 🆕 Dark mode automático

## 🐛 Fixes
- Validación de formularios mejorada
- Performance optimization en reportes
- Dark mode en todos los componentes

## 📚 Documentación
- GETTING_STARTED.md — Guía de instalación
- DEVELOPMENT.md — Para developers
- TESTING.md — Plan de testing

## 🔒 Seguridad
- JWT authentication
- Bcrypt password hashing
- ACID database compliance
- Audit logging

## 📊 Especificaciones
- Versión: 0.3.0
- Build: Windows 64-bit NSIS
- Tamaño: ~100MB (instalador)
- Requisitos: Windows 10/11

## 🙏 Agradecimientos
Desarrollado con Tauri + Rust + React
```

---

## ✅ Pre-Release Checklist

### 1 Semana Antes
- [ ] Código final revisado
- [ ] Tests completados
- [ ] Documentación actualizada
- [ ] Dependencias auditadas
- [ ] Performance baseline medido

### 1 Día Antes
- [ ] Compilación final exitosa
- [ ] Artifact download verificado
- [ ] Release notes preparado
- [ ] Users notificados

### Release Day
- [ ] Create GitHub Release
- [ ] Verify download works
- [ ] Test instalación limpia
- [ ] Soporte técnico on-call

### 1 Semana Después
- [ ] Monitor user feedback
- [ ] Collect error reports
- [ ] Performance metrics
- [ ] Plan hotfixes si necesario

---

## 🎓 Lessons Learned

### Lo que Funcionó Bien
- ✅ Tauri + Rust + React stack
- ✅ GitHub Actions automation
- ✅ Modular architecture
- ✅ Dark mode support
- ✅ Responsive design

### Próximas Mejoras
- 🔜 Auto-updates
- 🔜 Database encryption
- 🔜 Cloud sync
- 🔜 Mobile app
- 🔜 Advanced analytics

---

## 📋 Support Process

### User Reports Bug

```
Email → support@sanmartin.com
↓
Assessment: Critical / High / Medium / Low
↓
Critical (Crash) → Fix in 24h (Hotfix)
High (Feature broken) → Fix in 1 week (v0.3.1)
Medium → Fix in sprint (v0.4.0)
Low → Backlog
```

---

**Deployment readiness: ✅ 100% Complete**

*Next step: Release v0.3.0 to production*
