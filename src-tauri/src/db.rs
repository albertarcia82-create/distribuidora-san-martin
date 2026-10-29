use sqlx::sqlite::{SqliteConnectOptions, SqlitePool, SqlitePoolOptions};
use sqlx::Row;
use std::str::FromStr;
use crate::models::{AppError, User, Product, Category, AuditLog};

/// Inicializar base de datos SQLite
pub async fn init_db(db_path: &str) -> Result<SqlitePool, AppError> {
    let connection_string = format!("sqlite://{}", db_path);

    let connect_options = SqliteConnectOptions::from_str(&connection_string)
        .map_err(|e| AppError::Database(format!("Opción de conexión inválida: {}", e)))?
        .create_if_missing(true);

    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect_with(connect_options)
        .await
        .map_err(|e| AppError::Database(format!("Error conectando a BD: {}", e)))?;

    // Crear tablas si no existen
    create_tables(&pool).await?;

    Ok(pool)
}

/// Crear tablas de la base de datos
async fn create_tables(pool: &SqlitePool) -> Result<(), AppError> {
    // Tabla de usuarios
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL,
            full_name TEXT NOT NULL,
            created_at TEXT NOT NULL,
            last_login TEXT
        )
        "#,
    )
    .execute(pool)
    .await
    .map_err(|e| AppError::Database(format!("Error creando tabla users: {}", e)))?;

    // Tabla de categorías
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS categories (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            "order" INTEGER NOT NULL
        )
        "#,
    )
    .execute(pool)
    .await
    .map_err(|e| AppError::Database(format!("Error creando tabla categories: {}", e)))?;

    // Tabla de productos
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            category_id TEXT NOT NULL,
            stock INTEGER DEFAULT 0,
            price REAL NOT NULL,
            cost REAL NOT NULL,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (category_id) REFERENCES categories(id)
        )
        "#,
    )
    .execute(pool)
    .await
    .map_err(|e| AppError::Database(format!("Error creando tabla products: {}", e)))?;

    // Tabla de clientes
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS customers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            rut TEXT,
            credit_limit REAL DEFAULT 0,
            current_credit REAL DEFAULT 0,
            payment_terms_days INTEGER DEFAULT 0,
            created_at TEXT NOT NULL
        )
        "#,
    )
    .execute(pool)
    .await
    .map_err(|e| AppError::Database(format!("Error creando tabla customers: {}", e)))?;

    // Tabla de órdenes (compras y ventas)
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            order_type TEXT NOT NULL,
            supplier_id TEXT,
            customer_id TEXT,
            status TEXT NOT NULL,
            total REAL NOT NULL,
            items TEXT NOT NULL,
            notes TEXT,
            created_at TEXT NOT NULL,
            created_by TEXT NOT NULL,
            FOREIGN KEY (customer_id) REFERENCES customers(id),
            FOREIGN KEY (created_by) REFERENCES users(id)
        )
        "#,
    )
    .execute(pool)
    .await
    .map_err(|e| AppError::Database(format!("Error creando tabla orders: {}", e)))?;

    // Tabla de ventas (actualizada)
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS sales (
            id TEXT PRIMARY KEY,
            customer_id TEXT,
            user_id TEXT NOT NULL,
            status TEXT NOT NULL,
            subtotal REAL NOT NULL,
            discount_amount REAL DEFAULT 0,
            tax_amount REAL NOT NULL,
            total REAL NOT NULL,
            payment_method TEXT NOT NULL,
            items TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (customer_id) REFERENCES customers(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
        "#,
    )
    .execute(pool)
    .await
    .map_err(|e| AppError::Database(format!("Error creando tabla sales: {}", e)))?;

    // Tabla de auditoría
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            action TEXT NOT NULL,
            details TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
        "#,
    )
    .execute(pool)
    .await
    .map_err(|e| AppError::Database(format!("Error creando tabla audit_logs: {}", e)))?;

    Ok(())
}

/// Obtener usuario por ID
pub async fn get_user(pool: &SqlitePool, user_id: &str) -> Result<Option<User>, AppError> {
    sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = ?")
        .bind(user_id)
        .fetch_optional(pool)
        .await
        .map_err(|e| AppError::Database(format!("Error buscando usuario: {}", e)))
}

/// Obtener usuario por username
pub async fn get_user_by_username(pool: &SqlitePool, username: &str) -> Result<Option<User>, AppError> {
    sqlx::query_as::<_, User>("SELECT * FROM users WHERE username = ?")
        .bind(username)
        .fetch_optional(pool)
        .await
        .map_err(|e| AppError::Database(format!("Error buscando usuario: {}", e)))
}

/// Crear usuario
pub async fn create_user(pool: &SqlitePool, user: &User) -> Result<(), AppError> {
    sqlx::query(
        "INSERT INTO users (id, username, password_hash, role, full_name, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(&user.id)
    .bind(&user.username)
    .bind(&user.password_hash)
    .bind(&user.role)
    .bind(&user.full_name)
    .bind(&user.created_at)
    .execute(pool)
    .await
    .map_err(|e| AppError::Database(format!("Error creando usuario: {}", e)))?;

    Ok(())
}

/// Actualizar last_login del usuario
pub async fn update_last_login(pool: &SqlitePool, user_id: &str, timestamp: &str) -> Result<(), AppError> {
    sqlx::query("UPDATE users SET last_login = ? WHERE id = ?")
        .bind(timestamp)
        .bind(user_id)
        .execute(pool)
        .await
        .map_err(|e| AppError::Database(format!("Error actualizando last_login: {}", e)))?;

    Ok(())
}

/// Obtener todos los productos
pub async fn get_products(pool: &SqlitePool) -> Result<Vec<Product>, AppError> {
    sqlx::query_as::<_, Product>("SELECT * FROM products")
        .fetch_all(pool)
        .await
        .map_err(|e| AppError::Database(format!("Error obteniendo productos: {}", e)))
}

/// Obtener estadísticas de inventario
pub async fn get_inventory_stats(pool: &SqlitePool) -> Result<(i64, i64, i64, i64, f64), AppError> {
    let total_products = sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM products")
        .fetch_one(pool)
        .await
        .map_err(|e| AppError::Database(format!("Error contando productos: {}", e)))?;

    let total_categories = sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM categories")
        .fetch_one(pool)
        .await
        .map_err(|e| AppError::Database(format!("Error contando categorías: {}", e)))?;

    let low_stock = sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM products WHERE stock > 0 AND stock <= 5")
        .fetch_one(pool)
        .await
        .map_err(|e| AppError::Database(format!("Error contando bajo stock: {}", e)))?;

    let out_of_stock = sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM products WHERE stock = 0")
        .fetch_one(pool)
        .await
        .map_err(|e| AppError::Database(format!("Error contando agotados: {}", e)))?;

    let total_value = sqlx::query_scalar::<_, f64>("SELECT SUM(stock * cost) FROM products")
        .fetch_one(pool)
        .await
        .map_err(|e| AppError::Database(format!("Error calculando valor total: {}", e)))?
        .unwrap_or(0.0);

    Ok((total_products, total_categories, low_stock, out_of_stock, total_value))
}

/// Registrar acción en auditoría
pub async fn log_audit(pool: &SqlitePool, user_id: &str, action: &str, details: &str) -> Result<(), AppError> {
    let timestamp = chrono::Utc::now().to_rfc3339();

    sqlx::query(
        "INSERT INTO audit_logs (user_id, action, details, timestamp) VALUES (?, ?, ?, ?)"
    )
    .bind(user_id)
    .bind(action)
    .bind(details)
    .bind(timestamp)
    .execute(pool)
    .await
    .map_err(|e| AppError::Database(format!("Error registrando auditoría: {}", e)))?;

    Ok(())
}
