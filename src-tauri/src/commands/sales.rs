use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use tauri::State;
use uuid::Uuid;
use chrono::Utc;
use crate::db;
use super::ApiResponse;

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateSaleRequest {
    pub customer_id: Option<String>,
    pub items: Vec<SaleItemRequest>,
    pub discount_percent: Option<f64>,
    pub payment_method: String, // "cash", "credit_card", "transfer"
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SaleItemRequest {
    pub product_id: String,
    pub quantity: i32,
    pub unit_price: f64,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Sale {
    pub id: String,
    pub customer_id: Option<String>,
    pub user_id: String,
    pub status: String, // "completed", "pending", "cancelled"
    pub subtotal: f64,
    pub discount_amount: f64,
    pub tax_amount: f64,
    pub total: f64,
    pub payment_method: String,
    pub items: String, // JSON
    pub created_at: String,
}

#[tauri::command]
pub async fn create_sale(
    pool: State<'_, SqlitePool>,
    user_id: String,
    request: CreateSaleRequest,
) -> Result<ApiResponse<Sale>, String> {
    // Validar items
    if request.items.is_empty() {
        return Ok(ApiResponse::err("Venta debe tener al menos un item".to_string()));
    }

    let discount_percent = request.discount_percent.unwrap_or(0.0);

    // Calcular totales
    let subtotal: f64 = request.items.iter()
        .map(|item| item.quantity as f64 * item.unit_price)
        .sum();

    let discount_amount = subtotal * (discount_percent / 100.0);
    let taxable_amount = subtotal - discount_amount;
    let tax_amount = taxable_amount * 0.19; // IVA 19%
    let total = taxable_amount + tax_amount;

    // Crear venta
    let sale_id = Uuid::new_v4().to_string();
    let now = Utc::now().to_rfc3339();
    let items_json = serde_json::to_string(&request.items)
        .map_err(|e| format!("Error serializando items: {}", e))?;

    let sale = Sale {
        id: sale_id,
        customer_id: request.customer_id,
        user_id: user_id.clone(),
        status: "completed".to_string(),
        subtotal,
        discount_amount,
        tax_amount,
        total,
        payment_method: request.payment_method,
        items: items_json,
        created_at: now,
    };

    // Insertar venta
    sqlx::query(
        r#"
        INSERT INTO sales (id, customer_id, user_id, status, subtotal, discount_amount, tax_amount, total, payment_method, items, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        "#
    )
    .bind(&sale.id)
    .bind(&sale.customer_id)
    .bind(&sale.user_id)
    .bind(&sale.status)
    .bind(sale.subtotal)
    .bind(sale.discount_amount)
    .bind(sale.tax_amount)
    .bind(sale.total)
    .bind(&sale.payment_method)
    .bind(&sale.items)
    .bind(&sale.created_at)
    .execute(pool.as_ref())
    .await
    .map_err(|e| format!("Error creando venta: {}", e))?;

    // Log auditoría
    db::log_audit(pool.as_ref(), &user_id, "create_sale", &format!("Venta {} por ${:.2}", sale.id, sale.total))
        .await
        .ok();

    Ok(ApiResponse::ok(sale))
}

#[tauri::command]
pub async fn get_sales(
    pool: State<'_, SqlitePool>,
    limit: Option<i32>,
) -> Result<ApiResponse<Vec<Sale>>, String> {
    let limit = limit.unwrap_or(50);

    let sales = sqlx::query_as::<_, Sale>(
        "SELECT * FROM sales ORDER BY created_at DESC LIMIT ?"
    )
    .bind(limit)
    .fetch_all(pool.as_ref())
    .await
    .map_err(|e| format!("Error obteniendo ventas: {}", e))?;

    Ok(ApiResponse::ok(sales))
}
