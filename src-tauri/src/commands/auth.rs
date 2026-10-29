use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use tauri::State;
use crate::db;
use crate::auth;
use crate::models::{LoginResponse, UserResponse, AppError};

#[derive(Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct RegisterRequest {
    pub username: String,
    pub password: String,
    pub full_name: String,
}

#[derive(Serialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<String>,
}

impl<T> ApiResponse<T> {
    pub fn ok(data: T) -> Self {
        ApiResponse {
            success: true,
            data: Some(data),
            error: None,
        }
    }

    pub fn err(error: String) -> Self {
        ApiResponse {
            success: false,
            data: None,
            error: Some(error),
        }
    }
}

#[tauri::command]
pub async fn login(
    pool: State<'_, SqlitePool>,
    request: LoginRequest,
) -> Result<ApiResponse<LoginResponse>, String> {
    // Buscar usuario
    let user = db::get_user_by_username(&pool, &request.username)
        .await
        .map_err(|e| e.to_string())?
        .ok_or("Usuario no encontrado")?;

    // Verificar contraseña
    let password_valid = auth::verify_password(&request.password, &user.password_hash)
        .map_err(|e| e.to_string())?;

    if !password_valid {
        return Ok(ApiResponse::err("Contraseña incorrecta".to_string()));
    }

    // Actualizar last_login
    let timestamp = chrono::Utc::now().to_rfc3339();
    db::update_last_login(&pool, &user.id, &timestamp)
        .await
        .map_err(|e| e.to_string())?;

    // Generar token
    let token = auth::generate_token(&user.id, &user.username, &user.role)
        .map_err(|e| e.to_string())?;

    // Registrar en auditoría
    db::log_audit(&pool, &user.id, "login", "Usuario inició sesión")
        .await
        .map_err(|e| e.to_string())?;

    Ok(ApiResponse::ok(LoginResponse {
        token,
        user: UserResponse {
            id: user.id,
            username: user.username,
            role: user.role,
            full_name: user.full_name,
        },
    }))
}

#[tauri::command]
pub fn validate_token(token: &str) -> Result<ApiResponse<UserResponse>, String> {
    let claims = auth::validate_token(token)
        .map_err(|e| e.to_string())?;

    Ok(ApiResponse::ok(UserResponse {
        id: claims.sub,
        username: claims.username,
        role: claims.role,
        full_name: "".to_string(), // Se obtendría de BD en una implementación completa
    }))
}
