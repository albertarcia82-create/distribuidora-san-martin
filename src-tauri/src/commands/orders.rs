use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use tauri::State;
use uuid::Uuid;
use chrono::Utc;
use crate::db;
use crate::models::AppError;
use super::ApiResponse;

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateOrderRequest {
    pub order_type: String, // "purchase" o "sale"
    pub supplier_id: Option<String>, // para órdenes de compra
    pub customer_id: Option<String>, // para órdenes de venta
    pub items: Vec<OrderItem>,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct OrderItem {
    pub product_id: String,
    pub quantity: i32,
    pub unit_price: f64,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Order {
    pub id: String,
    pub order_type: String,
    pub supplier_id: Option<String>,
    pub customer_id: Option<String>,
    pub status: String, // "draft", "confirmed", "delivered", "cancelled"
    pub total: f64,
    pub items: String, // JSON
    pub notes: Option<String>,
    pub created_at: String,
    pub created_by: String,
}

#[tauri::command]
pub async fn create_order(
    pool: State<'_, SqlitePool>,
    user_id: String,
    request: CreateOrderRequest,
) -> Result<ApiResponse<Order>, String> {
    // Validar orden_type
    if request.order_type != "purchase" && request.order_type != "sale" {
        return Ok(ApiResponse::err("Tipo de orden inválido".to_string()));
    }

    // Validar que haya items
    if request.items.is_empty() {
        return Ok(ApiResponse::err("Orden debe tener al menos un item".to_string()));
    }

    // Calcular total
    let total: f64 = request.items.iter()
        .map(|item| item.quantity as f64 * item.unit_price)
        .sum();

    // Crear orden
    let order_id = Uuid::new_v4().to_string();
    let now = Utc::now().to_rfc3339();
    let items_json = serde_json::to_string(&request.items)
        .map_err(|e| format!("Error serializando items: {}", e))?;

    let order = Order {
        id: order_id,
        order_type: request.order_type,
        supplier_id: request.supplier_id,
        customer_id: request.customer_id,
        status: "draft".to_string(),
        total,
        items: items_json,
        notes: request.notes,
        created_at: now,
        created_by: user_id.clone(),
    };

    // Guardar en base de datos
    sqlx::query(
        r#"
        INSERT INTO orders (id, order_type, supplier_id, customer_id, status, total, items, notes, created_at, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        "#
    )
    .bind(&order.id)
    .bind(&order.order_type)
    .bind(&order.supplier_id)
    .bind(&order.customer_id)
    .bind(&order.status)
    .bind(order.total)
    .bind(&order.items)
    .bind(&order.notes)
    .bind(&order.created_at)
    .bind(&order.created_by)
    .execute(pool.as_ref())
    .await
    .map_err(|e| format!("Error creando orden: {}", e))?;

    // Log auditoría
    db::log_audit(pool.as_ref(), &user_id, "create_order", &format!("Orden {} de tipo {}", order.id, order.order_type))
        .await
        .ok(); // Ignorar error en auditoría

    Ok(ApiResponse::ok(order))
}

#[tauri::command]
pub async fn get_orders(
    pool: State<'_, SqlitePool>,
    order_type: Option<String>,
    status: Option<String>,
) -> Result<ApiResponse<Vec<Order>>, String> {
    let mut query = "SELECT * FROM orders WHERE 1=1".to_string();

    if let Some(ot) = order_type {
        query.push_str(&format!(" AND order_type = '{}'", ot));
    }

    if let Some(s) = status {
        query.push_str(&format!(" AND status = '{}'", s));
    }

    query.push_str(" ORDER BY created_at DESC");

    let orders = sqlx::query_as::<_, Order>(&query)
        .fetch_all(pool.as_ref())
        .await
        .map_err(|e| format!("Error obteniendo órdenes: {}", e))?;

    Ok(ApiResponse::ok(orders))
}

#[tauri::command]
pub async fn confirm_order(
    pool: State<'_, SqlitePool>,
    user_id: String,
    order_id: String,
) -> Result<ApiResponse<String>, String> {
    sqlx::query("UPDATE orders SET status = ? WHERE id = ?")
        .bind("confirmed")
        .bind(&order_id)
        .execute(pool.as_ref())
        .await
        .map_err(|e| format!("Error confirmando orden: {}", e))?;

    db::log_audit(pool.as_ref(), &user_id, "confirm_order", &format!("Orden {} confirmada", order_id))
        .await
        .ok();

    Ok(ApiResponse::ok(format!("Orden {} confirmada", order_id)))
}
