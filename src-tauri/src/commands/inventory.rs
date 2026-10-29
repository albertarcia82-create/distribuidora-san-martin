use serde::Serialize;
use sqlx::SqlitePool;
use tauri::State;
use crate::db;
use crate::models::InventoryStats;
use super::ApiResponse;

#[derive(Serialize)]
pub struct StatsResponse {
    pub total_products: i64,
    pub total_categories: i64,
    pub low_stock: i64,
    pub out_of_stock: i64,
    pub total_value: f64,
}

#[tauri::command]
pub async fn get_inventory_stats(
    pool: State<'_, SqlitePool>,
) -> Result<ApiResponse<StatsResponse>, String> {
    let (total_products, total_categories, low_stock, out_of_stock, total_value) =
        db::get_inventory_stats(&pool)
            .await
            .map_err(|e| e.to_string())?;

    Ok(ApiResponse::ok(StatsResponse {
        total_products,
        total_categories,
        low_stock,
        out_of_stock,
        total_value,
    }))
}

#[tauri::command]
pub async fn get_products(
    pool: State<'_, SqlitePool>,
) -> Result<ApiResponse<Vec<crate::models::Product>>, String> {
    let products = db::get_products(&pool)
        .await
        .map_err(|e| e.to_string())?;

    Ok(ApiResponse::ok(products))
}
