use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// Usuario del sistema
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct User {
    pub id: String,
    pub username: String,
    pub password_hash: String,
    pub role: String, // "admin" o "vendedor"
    pub full_name: String,
    pub created_at: String,
    pub last_login: Option<String>,
}

/// Producto en inventario
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Product {
    pub id: String,
    pub name: String,
    pub category_id: String,
    pub stock: i32,
    pub price: f64,
    pub cost: f64,
    pub status: String, // "activo", "agotado", "descontinuado"
    pub created_at: String,
}

/// Venta registrada
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Sale {
    pub id: String,
    pub user_id: String,
    pub total: f64,
    pub discount: f64,
    pub items: String, // JSON string de items
    pub created_at: String,
}

/// Item dentro de una venta
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SaleItem {
    pub product_id: String,
    pub product_name: String,
    pub quantity: i32,
    pub unit_price: f64,
    pub subtotal: f64,
}

/// Categoría de producto
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Category {
    pub id: String,
    pub name: String,
    pub order: i32,
}

/// Log de auditoría
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct AuditLog {
    pub id: i64,
    pub user_id: String,
    pub action: String,
    pub details: String,
    pub timestamp: String,
}

/// Respuesta de login
#[derive(Debug, Serialize, Deserialize)]
pub struct LoginResponse {
    pub token: String,
    pub user: UserResponse,
}

/// Usuario en respuesta (sin password)
#[derive(Debug, Serialize, Deserialize)]
pub struct UserResponse {
    pub id: String,
    pub username: String,
    pub role: String,
    pub full_name: String,
}

/// Estadísticas de inventario
#[derive(Debug, Serialize, Deserialize)]
pub struct InventoryStats {
    pub total_products: i64,
    pub total_categories: i64,
    pub low_stock: i64,
    pub out_of_stock: i64,
    pub total_value: f64,
}

/// Error de aplicación
#[derive(Debug)]
pub enum AppError {
    Database(String),
    Authentication(String),
    Validation(String),
    NotFound(String),
    Internal(String),
}

impl AppError {
    pub fn to_string(&self) -> String {
        match self {
            AppError::Database(msg) => format!("Error de base de datos: {}", msg),
            AppError::Authentication(msg) => format!("Error de autenticación: {}", msg),
            AppError::Validation(msg) => format!("Error de validación: {}", msg),
            AppError::NotFound(msg) => format!("No encontrado: {}", msg),
            AppError::Internal(msg) => format!("Error interno: {}", msg),
        }
    }
}

/// JWT Claims
#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String, // user_id
    pub username: String,
    pub role: String,
    pub exp: i64, // expiration timestamp
    pub iat: i64, // issued at timestamp
}
