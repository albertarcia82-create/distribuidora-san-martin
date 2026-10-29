use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use tauri::State;
use uuid::Uuid;
use chrono::Utc;
use crate::db;
use super::ApiResponse;

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateCustomerRequest {
    pub name: String,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub rut: Option<String>,
    pub credit_limit: f64,
    pub payment_terms_days: i32,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Customer {
    pub id: String,
    pub name: String,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub rut: Option<String>,
    pub credit_limit: f64,
    pub current_credit: f64,
    pub payment_terms_days: i32,
    pub created_at: String,
}

#[tauri::command]
pub async fn create_customer(
    pool: State<'_, SqlitePool>,
    user_id: String,
    request: CreateCustomerRequest,
) -> Result<ApiResponse<Customer>, String> {
    // Validar nombre
    if request.name.is_empty() {
        return Ok(ApiResponse::err("Nombre del cliente requerido".to_string()));
    }

    let customer_id = Uuid::new_v4().to_string();
    let now = Utc::now().to_rfc3339();

    let customer = Customer {
        id: customer_id,
        name: request.name,
        email: request.email,
        phone: request.phone,
        rut: request.rut,
        credit_limit: request.credit_limit,
        current_credit: 0.0,
        payment_terms_days: request.payment_terms_days,
        created_at: now,
    };

    sqlx::query(
        r#"
        INSERT INTO customers (id, name, email, phone, rut, credit_limit, current_credit, payment_terms_days, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        "#
    )
    .bind(&customer.id)
    .bind(&customer.name)
    .bind(&customer.email)
    .bind(&customer.phone)
    .bind(&customer.rut)
    .bind(customer.credit_limit)
    .bind(customer.current_credit)
    .bind(customer.payment_terms_days)
    .bind(&customer.created_at)
    .execute(pool.as_ref())
    .await
    .map_err(|e| format!("Error creando cliente: {}", e))?;

    db::log_audit(pool.as_ref(), &user_id, "create_customer", &format!("Cliente {} creado", customer.id))
        .await
        .ok();

    Ok(ApiResponse::ok(customer))
}

#[tauri::command]
pub async fn get_customers(
    pool: State<'_, SqlitePool>,
) -> Result<ApiResponse<Vec<Customer>>, String> {
    let customers = sqlx::query_as::<_, Customer>(
        "SELECT * FROM customers ORDER BY created_at DESC"
    )
    .fetch_all(pool.as_ref())
    .await
    .map_err(|e| format!("Error obteniendo clientes: {}", e))?;

    Ok(ApiResponse::ok(customers))
}

#[tauri::command]
pub async fn get_customer_detail(
    pool: State<'_, SqlitePool>,
    customer_id: String,
) -> Result<ApiResponse<Customer>, String> {
    let customer = sqlx::query_as::<_, Customer>(
        "SELECT * FROM customers WHERE id = ?"
    )
    .bind(&customer_id)
    .fetch_optional(pool.as_ref())
    .await
    .map_err(|e| format!("Error obteniendo cliente: {}", e))?
    .ok_or_else(|| "Cliente no encontrado".to_string())?;

    Ok(ApiResponse::ok(customer))
}
