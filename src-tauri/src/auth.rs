use bcrypt::{hash, verify, DEFAULT_COST};
use chrono::Utc;
use jsonwebtoken::{encode, decode, Header, Validation, EncodingKey, DecodingKey};
use uuid::Uuid;
use crate::models::{AppError, Claims, User};

const JWT_SECRET: &[u8] = b"your-secret-key-change-this-in-production";
const JWT_EXPIRATION_HOURS: i64 = 8;

/// Hashear contraseña con bcrypt
pub fn hash_password(password: &str) -> Result<String, AppError> {
    hash(password, DEFAULT_COST)
        .map_err(|e| AppError::Internal(format!("Error hasheando contraseña: {}", e)))
}

/// Verificar contraseña
pub fn verify_password(password: &str, hash: &str) -> Result<bool, AppError> {
    verify(password, hash)
        .map_err(|e| AppError::Internal(format!("Error verificando contraseña: {}", e)))
}

/// Generar token JWT
pub fn generate_token(user_id: &str, username: &str, role: &str) -> Result<String, AppError> {
    let now = Utc::now().timestamp();
    let expiration = now + (JWT_EXPIRATION_HOURS * 3600);

    let claims = Claims {
        sub: user_id.to_string(),
        username: username.to_string(),
        role: role.to_string(),
        exp: expiration,
        iat: now,
    };

    encode(&Header::default(), &claims, &EncodingKey::from_secret(JWT_SECRET))
        .map_err(|e| AppError::Authentication(format!("Error generando token: {}", e)))
}

/// Validar y decodificar token JWT
pub fn validate_token(token: &str) -> Result<Claims, AppError> {
    decode::<Claims>(token, &DecodingKey::from_secret(JWT_SECRET), &Validation::default())
        .map(|data| data.claims)
        .map_err(|e| AppError::Authentication(format!("Token inválido: {}", e)))
}

/// Crear nuevo usuario con ID único
pub fn create_new_user(
    username: &str,
    password: &str,
    role: &str,
    full_name: &str,
) -> Result<User, AppError> {
    // Validar contraseña
    if password.len() < 6 {
        return Err(AppError::Validation("Contraseña debe tener al menos 6 caracteres".to_string()));
    }

    let password_hash = hash_password(password)?;
    let user_id = Uuid::new_v4().to_string();
    let now = Utc::now().to_rfc3339();

    Ok(User {
        id: user_id,
        username: username.to_string(),
        password_hash,
        role: role.to_string(),
        full_name: full_name.to_string(),
        created_at: now,
        last_login: None,
    })
}

/// Inicializar contraseña por defecto para desarrollo
pub fn get_default_admin_user() -> Result<User, AppError> {
    create_new_user(
        "admin",
        "123456789",
        "admin",
        "Administrador",
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_hash_and_verify_password() {
        let password = "test_password_123";
        let hash = hash_password(password).unwrap();
        let is_valid = verify_password(password, &hash).unwrap();
        assert!(is_valid);
    }

    #[test]
    fn test_wrong_password() {
        let password = "test_password_123";
        let hash = hash_password(password).unwrap();
        let is_valid = verify_password("wrong_password", &hash).unwrap();
        assert!(!is_valid);
    }

    #[test]
    fn test_token_generation_and_validation() {
        let token = generate_token("user123", "testuser", "admin").unwrap();
        let claims = validate_token(&token).unwrap();
        assert_eq!(claims.sub, "user123");
        assert_eq!(claims.username, "testuser");
        assert_eq!(claims.role, "admin");
    }
}
