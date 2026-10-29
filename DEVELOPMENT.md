# 👨‍💻 Guía de Desarrollo

## Arquitectura General

```
┌─────────────────────────────────────────────────────┐
│              APLICACIÓN TAURI                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌────────────────────┐    ┌──────────────────┐   │
│  │  React Frontend    │    │  Rust Backend    │   │
│  │  (TypeScript)      │◄──►│  (Tokio Async)   │   │
│  │  - 8 Componentes   │    │  - 11+ Commands  │   │
│  │  - Dark Mode       │    │  - JWT + Bcrypt  │   │
│  │  - Responsive      │    │  - Validaciones  │   │
│  └────────────────────┘    └──────────────────┘   │
│           │                         │              │
│           │                         │              │
│           └──────────┬──────────────┘              │
│                      ▼                              │
│           ┌──────────────────────┐                 │
│           │   SQLite Database    │                 │
│           │  (7 tablas + índices)│                 │
│           │  - Embedded ACID     │                 │
│           │  - Sin dependencias   │                 │
│           └──────────────────────┘                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📦 Stack Técnico

### Frontend (React)
- **Framework:** React 18.2+
- **Lenguaje:** TypeScript 5.x
- **Compilador:** Vite 5.x
- **IPC:** @tauri-apps/api (invoke)
- **Estilos:** CSS Modules + Dark Mode

### Backend (Rust)
- **Runtime:** Tokio (async)
- **Base de Datos:** SQLx + SQLite
- **Seguridad:** 
  - Bcrypt (10 rounds)
  - JWT (HS256, 8h expiration)
- **Serialización:** Serde (JSON)
- **Framework:** Tauri 2.x

---

## 🔌 Comunicación Frontend ↔ Backend

### Tauri IPC Pattern

**Frontend (React):**
```typescript
const response = await invoke('command_name', {
  param1: value1,
  param2: value2,
});

if (response.success) {
  // Manejar éxito
} else {
  // Manejar error
}
```

**Backend (Rust):**
```rust
#[tauri::command]
async fn command_name(param1: String, param2: i32) -> Result<Response, String> {
    // Lógica aquí
    Ok(Response { success: true, data: ... })
}
```

### Comandos Disponibles

**Autenticación:**
- `login(username, password)` → JWT token
- `validate_token(token)` → User info

**Inventario:**
- `get_inventory_stats()` → Stats
- `get_products(limit)` → Products[]

**Ventas:**
- `create_sale(items, discount, payment_method)` → Sale
- `get_sales(limit)` → Sales[]

**Órdenes:**
- `create_order(type, supplier/customer, items)` → Order
- `get_orders(type, status)` → Orders[]
- `confirm_order(order_id)` → Order

**Clientes:**
- `create_customer(name, email, ...)` → Customer
- `get_customers()` → Customers[]

**Reportes:**
- `get_sales_report(start, end)` → SalesData[]
- `get_product_report(sort, limit)` → ProductData[]
- `get_customer_report(limit)` → CustomerData[]
- `get_inventory_report()` → InventoryData

**Usuarios (Admin):**
- `create_user(username, email, password, role)` → User
- `get_users()` → Users[]
- `delete_user(user_id)` → Success

---

## 🏗️ Agregar Nuevas Características

### Ejemplo: Nuevo Módulo "Proveedores"

#### Step 1: Backend (Rust)

**1.1 Modelo en `src-tauri/src/models.rs`:**
```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Supplier {
    pub id: String,
    pub name: String,
    pub email: String,
    pub phone: String,
    pub payment_terms_days: i32,
}
```

**1.2 Comando en `src-tauri/src/commands/suppliers.rs`:**
```rust
#[tauri::command]
async fn create_supplier(
    name: String,
    email: String,
    phone: String,
    payment_terms_days: i32,
) -> Result<Value, String> {
    let id = Uuid::new_v4().to_string();
    
    // Insert en DB
    sqlx::query(
        "INSERT INTO suppliers (id, name, email, phone, payment_terms_days) 
         VALUES (?, ?, ?, ?, ?)"
    )
    .bind(&id)
    .bind(&name)
    .bind(&email)
    .bind(&phone)
    .bind(payment_terms_days)
    .execute(&pool)
    .await
    .map_err(|e| format!("DB error: {}", e))?;

    Ok(json!({
        "success": true,
        "data": { "id", "name", "email", "phone", "payment_terms_days" }
    }))
}
```

**1.3 Registrar en `src-tauri/src/lib.rs`:**
```rust
pub mod commands {
    pub mod suppliers; // Agregar este módulo
}

// En tauri builder:
.invoke_handler(tauri::generate_handler![
    commands::suppliers::create_supplier,
    // ... otros
])
```

#### Step 2: Frontend (React)

**2.1 Componente en `src/components/Suppliers/SupplierList.tsx`:**
```typescript
import React, { useState, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import '../../styles/Suppliers.css';

export const SupplierList: React.FC = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    payment_terms_days: 30,
  });

  const handleCreate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response: any = await invoke('create_supplier', formData as any);
      
      if (response.success) {
        setSuppliers([...suppliers, response.data]);
        // Reset form
      }
    } catch (err: any) {
      // Handle error
    }
  }, [formData, suppliers]);

  return (
    <div className="suppliers-panel">
      {/* Formulario y tabla */}
    </div>
  );
};
```

**2.2 Estilos en `src/styles/Suppliers.css`:**
```css
.suppliers-panel {
  padding: 20px;
  max-width: 1400px;
}

/* ... resto de estilos (copiar patrón de Customers.css) */
```

**2.3 Integrar en `src/components/Dashboard.tsx`:**
```typescript
import { SupplierList } from './Suppliers/SupplierList';

// En renderPage():
case 'suppliers':
  return <SupplierList />;

// En AppLayout menu items (agregar):
{ id: 'suppliers', label: 'Proveedores', icon: '🚚' }
```

---

## 📊 Patrones de Optimización

### React Performance

```typescript
// ✅ BIEN: Memoización + useCallback
import React, { useCallback, useMemo, memo } from 'react';

const MyComponent = memo(({ items }) => {
  const handleClick = useCallback((id) => {
    // Lógica aquí
  }, [items]);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price, 0);
  }, [items]);

  return <div>{total}</div>;
});
```

```typescript
// ❌ MAL: Sin memoización (re-renders innecesarios)
const MyComponent = ({ items }) => {
  const handleClick = (id) => { /* ... */ };
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return <div>{total}</div>;
};
```

### Validación

```typescript
// ✅ BIEN: Validación por campo
const [errors, setErrors] = useState({});

const validateField = (name: string, value: any) => {
  const newErrors = { ...errors };
  
  if (name === 'email') {
    if (!value.includes('@')) {
      newErrors.email = 'Email inválido';
    } else {
      delete newErrors.email;
    }
  }
  
  setErrors(newErrors);
};
```

---

## 🧪 Testing

### Test de Componente (Jest)

```typescript
// src/components/Suppliers/__tests__/SupplierList.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { SupplierList } from '../SupplierList';

describe('SupplierList', () => {
  it('should render supplier form', () => {
    render(<SupplierList />);
    expect(screen.getByText('Nuevo Proveedor')).toBeInTheDocument();
  });

  it('should validate email field', () => {
    render(<SupplierList />);
    const input = screen.getByPlaceholderText('email@ejemplo.com');
    fireEvent.change(input, { target: { value: 'invalid' } });
    expect(screen.getByText('Email inválido')).toBeInTheDocument();
  });
});
```

### Test de Comando Rust

```rust
// src-tauri/src/commands/suppliers.rs (tests)
#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_create_supplier() {
        let result = create_supplier(
            "Test Supplier".to_string(),
            "test@example.com".to_string(),
            "+56912345678".to_string(),
            30,
        ).await;

        assert!(result.is_ok());
    }
}
```

---

## 🔐 Seguridad

### Principios

1. **Validación siempre en backend** — Frontend es solo UX
2. **Parametrized queries** — Contra SQL injection
3. **Hashing de passwords** — Bcrypt 10 rounds mínimo
4. **JWT con expiración** — 8 horas máximo
5. **HTTPS en producción** — Tauri lo maneja

### Checklist antes de merge

- [ ] Validaciones en backend (no confíar en frontend)
- [ ] SQL parametrizado (sin string concat)
- [ ] Usuarios/datos sensibles hasheados
- [ ] Rate limiting en auth (próxima versión)
- [ ] Error messages genéricos (no exponer detalles)

---

## 🚀 CI/CD

### GitHub Actions

El archivo `.github/workflows/windows-build.yml` compila automáticamente:

1. Al hacer push a `main` o `develop`
2. Al disparar manualmente (`workflow_dispatch`)
3. Genera `.exe` y lo sube como artifact

### Deploy Manual

```bash
# Build local
npm run tauri build

# El .exe está en:
# src-tauri/target/release/bundle/nsis/

# Subir como release
gh release create v0.3.0 src-tauri/target/release/bundle/nsis/*.exe
```

---

## 📚 Recursos

- [Tauri Docs](https://tauri.app)
- [React Docs](https://react.dev)
- [Rust Book](https://doc.rust-lang.org/book/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**¡Feliz desarrollo!** 🚀
