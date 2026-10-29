import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import '../../styles/Customers.css';

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  rut?: string;
  credit_limit: number;
  current_credit: number;
  payment_terms_days: number;
  created_at: string;
}

interface CreateCustomerForm {
  name: string;
  email: string;
  phone: string;
  rut: string;
  credit_limit: number;
  payment_terms_days: number;
}

export const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const [formData, setFormData] = useState<CreateCustomerForm>({
    name: '',
    email: '',
    phone: '',
    rut: '',
    credit_limit: 10000,
    payment_terms_days: 30,
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const response: any = await invoke('get_customers');
      if (response.success) {
        setCustomers(response.data);
      } else {
        setError(response.error || 'Error cargando clientes');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response: any = await invoke('create_customer', formData as any);

      if (response.success) {
        setCustomers([...customers, response.data]);
        setFormData({
          name: '',
          email: '',
          phone: '',
          rut: '',
          credit_limit: 10000,
          payment_terms_days: 30,
        });
        setShowForm(false);
        setError('');
      } else {
        setError(response.error || 'Error creando cliente');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    }
  };

  const creditUtilization = (current: number, limit: number) => {
    if (limit === 0) return 0;
    return Math.round((current / limit) * 100);
  };

  const creditStatus = (utilization: number) => {
    if (utilization === 0) return 'disponible';
    if (utilization < 70) return 'normal';
    if (utilization < 90) return 'advertencia';
    return 'crítico';
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.rut?.includes(searchFilter)
  );

  return (
    <div className="customers-container">
      <div className="customers-header">
        <h2>Clientes</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancelar' : '+ Nuevo Cliente'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form className="customer-form" onSubmit={handleCreateCustomer}>
          <div className="form-row">
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nombre del cliente"
              />
            </div>
            <div className="form-group">
              <label>RUT</label>
              <input
                type="text"
                value={formData.rut}
                onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                placeholder="12345678-9"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="cliente@example.com"
              />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+56 9 1234 5678"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Límite de Crédito</label>
              <input
                type="number"
                min="0"
                step="1000"
                value={formData.credit_limit}
                onChange={(e) => setFormData({ ...formData, credit_limit: parseInt(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>Días de Pago</label>
              <input
                type="number"
                min="0"
                value={formData.payment_terms_days}
                onChange={(e) => setFormData({ ...formData, payment_terms_days: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary">Crear Cliente</button>
        </form>
      )}

      <div className="customers-search">
        <input
          type="text"
          placeholder="Buscar por nombre, email o RUT..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="search-input"
        />
        <button className="btn-secondary" onClick={loadCustomers} disabled={loading}>
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      {loading ? (
        <div className="loading">Cargando clientes...</div>
      ) : filteredCustomers.length === 0 ? (
        <div className="no-data">No hay clientes registrados</div>
      ) : (
        <div className="customers-grid">
          {filteredCustomers.map(customer => {
            const utilization = creditUtilization(customer.current_credit, customer.credit_limit);
            const status = creditStatus(utilization);

            return (
              <div key={customer.id} className={`customer-card status-${status}`}>
                <div className="card-header">
                  <h3>{customer.name}</h3>
                  <span className={`badge status-${status}`}>{status}</span>
                </div>

                <div className="card-body">
                  {customer.email && (
                    <div className="field">
                      <span className="label">Email:</span>
                      <span className="value">{customer.email}</span>
                    </div>
                  )}

                  {customer.phone && (
                    <div className="field">
                      <span className="label">Teléfono:</span>
                      <span className="value">{customer.phone}</span>
                    </div>
                  )}

                  {customer.rut && (
                    <div className="field">
                      <span className="label">RUT:</span>
                      <span className="value">{customer.rut}</span>
                    </div>
                  )}

                  <div className="field">
                    <span className="label">Términos de Pago:</span>
                    <span className="value">{customer.payment_terms_days} días</span>
                  </div>

                  <div className="credit-bar">
                    <div className="label">Crédito: ${customer.current_credit} / ${customer.credit_limit}</div>
                    <div className="progress-bar">
                      <div
                        className={`progress fill status-${status}`}
                        style={{ width: `${Math.min(utilization, 100)}%` }}
                      ></div>
                    </div>
                    <div className="percentage">{utilization}% utilizado</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
