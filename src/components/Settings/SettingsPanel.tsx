import React, { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import '../../styles/Settings.css';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const ROLES = [
  { value: 'admin', label: 'Administrador' },
  { value: 'bodega', label: 'Bodega' },
  { value: 'ventas', label: 'Ventas' },
];

const SettingsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Users management
  const [users, setUsers] = useState<User[]>([]);
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('ventas');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Company settings
  const [companyName, setCompanyName] = useState('Distribuidora San Martín');
  const [companyRUT, setCompanyRUT] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [taxRate, setTaxRate] = useState(19);

  // Load users
  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response: any = await invoke('get_users', {});
      if (response.success) {
        setUsers(response.data);
      } else {
        setError(response.error || 'Error cargando usuarios');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    }
  }, [activeTab, loadUsers]);

  // Validate new user form
  const validateUserForm = useCallback((): boolean => {
    const errors: ValidationErrors = {};

    if (!newUsername || newUsername.trim().length < 3) {
      errors.username = 'Usuario debe tener al menos 3 caracteres';
    }

    if (!newEmail || !newEmail.includes('@')) {
      errors.email = 'Email válido requerido';
    }

    if (!newPassword || newPassword.length < 6) {
      errors.password = 'Contraseña debe tener al menos 6 caracteres';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [newUsername, newEmail, newPassword]);

  // Create user
  const handleCreateUser = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateUserForm()) {
      return;
    }

    try {
      const response: any = await invoke('create_user', {
        username: newUsername,
        email: newEmail,
        password: newPassword,
        role: newRole,
      });

      if (response.success) {
        setUsers([response.data, ...users]);
        setNewUsername('');
        setNewEmail('');
        setNewPassword('');
        setNewRole('ventas');
        setShowNewUserForm(false);
        setValidationErrors({});
        setError('');
      } else {
        setError(response.error || 'Error creando usuario');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    }
  }, [newUsername, newEmail, newPassword, newRole, validateUserForm, users]);

  // Delete user
  const handleDeleteUser = useCallback(async (userId: string) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      try {
        const response: any = await invoke('delete_user', { user_id: userId });

        if (response.success) {
          setUsers(users.filter(u => u.id !== userId));
        } else {
          setError(response.error || 'Error eliminando usuario');
        }
      } catch (err: any) {
        setError(err.message || 'Error de conexión');
      }
    }
  }, [users]);

  // Save company settings
  const handleSaveCompanySettings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response: any = await invoke('update_company_settings', {
        company_name: companyName,
        company_rut: companyRUT,
        phone: companyPhone,
        email: companyEmail,
        address: companyAddress,
        tax_rate: taxRate,
      });

      if (response.success) {
        setError('');
        alert('Configuración de empresa guardada correctamente');
      } else {
        setError(response.error || 'Error guardando configuración');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }, [companyName, companyRUT, companyPhone, companyEmail, companyAddress, taxRate]);

  const hasFormErrors = Object.keys(validationErrors).length > 0;

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h2>Configuración</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="settings-tabs">
        <button
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Usuarios
        </button>
        <button
          className={`tab-button ${activeTab === 'company' ? 'active' : ''}`}
          onClick={() => setActiveTab('company')}
        >
          🏢 Empresa
        </button>
        <button
          className={`tab-button ${activeTab === 'advanced' ? 'active' : ''}`}
          onClick={() => setActiveTab('advanced')}
        >
          ⚙️ Avanzado
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="settings-content">
          <div className="content-header">
            <h3>Gestión de Usuarios</h3>
            <button
              className="btn-primary"
              onClick={() => setShowNewUserForm(!showNewUserForm)}
            >
              {showNewUserForm ? '✕ Cancelar' : '+ Nuevo Usuario'}
            </button>
          </div>

          {showNewUserForm && (
            <form className="user-form" onSubmit={handleCreateUser}>
              <div className="form-row">
                <div className="form-group">
                  <label>Usuario *</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Nombre de usuario"
                  />
                  {validationErrors.username && (
                    <div className="error">{validationErrors.username}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="usuario@ejemplo.com"
                  />
                  {validationErrors.email && (
                    <div className="error">{validationErrors.email}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Contraseña *</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                  />
                  {validationErrors.password && (
                    <div className="error">{validationErrors.password}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Rol *</label>
                  <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                    {ROLES.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={hasFormErrors}>
                  Crear Usuario
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowNewUserForm(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          <div className="users-table">
            {loading ? (
              <div className="loading">Cargando usuarios...</div>
            ) : users.length === 0 ? (
              <div className="no-data">No hay usuarios registrados</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Creado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td className="username"><strong>{user.username}</strong></td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {ROLES.find(r => r.value === user.role)?.label || user.role}
                        </span>
                      </td>
                      <td className="date">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          className="btn-danger-small"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Company Tab */}
      {activeTab === 'company' && (
        <div className="settings-content">
          <h3>Información de Empresa</h3>

          <div className="settings-form">
            <div className="form-row">
              <div className="form-group">
                <label>Nombre de Empresa *</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Distribuidora San Martín"
                />
              </div>

              <div className="form-group">
                <label>RUT Empresa</label>
                <input
                  type="text"
                  value={companyRUT}
                  onChange={(e) => setCompanyRUT(e.target.value)}
                  placeholder="XX.XXX.XXX-X"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  placeholder="+56 9 XXXX XXXX"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  placeholder="info@empresa.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Dirección</label>
              <textarea
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                placeholder="Calle, número, ciudad, región"
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tasa de Impuesto (IVA %) *</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value))}
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                className="btn-primary"
                onClick={handleSaveCompanySettings}
                disabled={loading}
              >
                {loading ? 'Guardando...' : '💾 Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Tab */}
      {activeTab === 'advanced' && (
        <div className="settings-content">
          <h3>Configuración Avanzada</h3>

          <div className="advanced-section">
            <div className="section-header">
              <h4>Backup y Restauración</h4>
              <p>Descarga o restaura una copia de seguridad de tu base de datos</p>
            </div>
            <div className="section-actions">
              <button className="btn-secondary">
                📥 Descargar Backup
              </button>
              <button className="btn-secondary">
                📤 Restaurar desde Backup
              </button>
            </div>
          </div>

          <div className="advanced-section">
            <div className="section-header">
              <h4>Auditoría y Logs</h4>
              <p>Ver registro de todas las acciones realizadas en el sistema</p>
            </div>
            <div className="section-actions">
              <button className="btn-secondary">
                📋 Ver Logs de Auditoría
              </button>
            </div>
          </div>

          <div className="advanced-section">
            <div className="section-header">
              <h4>Base de Datos</h4>
              <p>Información sobre la base de datos y herramientas de mantenimiento</p>
            </div>
            <div className="section-actions">
              <button className="btn-secondary">
                🔧 Optimizar Base de Datos
              </button>
              <button className="btn-secondary">
                🗑️ Limpiar Datos Antiguos
              </button>
            </div>
          </div>

          <div className="advanced-section danger">
            <div className="section-header">
              <h4>Zona de Peligro</h4>
              <p>Acciones irreversibles que afectarán toda la aplicación</p>
            </div>
            <div className="section-actions">
              <button className="btn-danger">
                ⚠️ Resetear Toda la Base de Datos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(SettingsPanel);
