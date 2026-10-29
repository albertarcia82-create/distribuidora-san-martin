pub mod models;
pub mod db;
pub mod auth;
pub mod commands;

pub use models::*;
pub use db::*;
pub use auth::*;
pub use commands::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      // Auth commands
      commands::auth::login,
      commands::auth::validate_token,
      // Inventory commands
      commands::inventory::get_inventory_stats,
      commands::inventory::get_products,
      // Order commands
      commands::orders::create_order,
      commands::orders::get_orders,
      commands::orders::confirm_order,
      // Customer commands
      commands::customers::create_customer,
      commands::customers::get_customers,
      commands::customers::get_customer_detail,
      // Sales commands
      commands::sales::create_sale,
      commands::sales::get_sales,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
