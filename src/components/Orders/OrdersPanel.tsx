import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { invoke } from '@tauri-apps/api/core';
import '../../styles/Orders.css';

interface OrderItem {
  product_id: string;
  product_name?: string;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: string;
  order_type: string; // 'purchase' | 'sale'
  supplier_id?: string;
  customer_id?: string;
  status: string; // 'draft' | 'confirmed' | 'delivered' | 'cancelled'
  total: number;
  items: string; // JSON
  notes?: string;
  created_at: string;
  created_by: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const ORDER_TYPES = [
  { value: 'purchase', label: 'Orden de Compra' },
  { value: 'sale', label: 'Orden de Venta' },
];

const ORDER_STATUSES = [
  { value: 'draft', label: 'Borrador', color: '#999' },
  { value: 'confirmed', label: 'Confirmada', color: '#3498db' },
  { value: 'delivered', label: 'Entregada', color: '#27ae60' },
  { value: 'cancelled', label: 'Cancelada', color: '#e74c3c' },
];

const OrdersPanel: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Nueva orden
  const [orderType, setOrderType] = useState('purchase');
  const [supplierId, setSupplierId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [notes, setNotes] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Cargar órdenes
  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response: any = await invoke('get_orders', {
        order_type: typeFilter || undefined,
        status: statusFilter || undefined,
      });
      if (response.success) {
        setOrders(response.data);
      } else {
        setError(response.error || 'Error cargando órdenes');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Validación
  const validateForm = useCallback((): boolean => {
    const errors: ValidationErrors = {};

    if (orderType === 'purchase' && !supplierId) {
      errors.supplier = 'Proveedor requerido para orden de compra';
    }

    if (orderType === 'sale' && !customerId) {
      errors.customer = 'Cliente requerido para orden de venta';
    }

    if (items.length === 0) {
      errors.items = 'Debe agregar al menos 1 item';
    }

    items.forEach((item, idx) => {
      if (!item.product_id) {
        errors[`item_${idx}_product`] = 'Producto requerido';
      }
      if (item.quantity <= 0) {
        errors[`item_${idx}_quantity`] = 'Cantidad debe ser > 0';
      }
      if (item.unit_price <= 0) {
        errors[`item_${idx}_price`] = 'Precio debe ser > 0';
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [orderType, supplierId, customerId, items]);

  // Cálculos
  const orderTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  }, [items]);

  // Agregar item
  const addItem = useCallback(() => {
    setItems([...items, { product_id: '', quantity: 1, unit_price: 0 }]);
  }, [items]);

  // Actualizar item
  const updateItem = useCallback((idx: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    setItems(newItems);
  }, [items]);

  // Eliminar item
  const removeItem = useCallback((idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  }, [items]);

  // Crear orden
  const handleCreateOrder = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response: any = await invoke('create_order', {
        order_type: orderType,
        supplier_id: orderType === 'purchase' ? supplierId : null,
        customer_id: orderType === 'sale' ? customerId : null,
        items,
        notes: notes || null,
      });

      if (response.success) {
        setOrders([response.data, ...orders]);
        // Reset form
        setOrderType('purchase');
        setSupplierId('');
        setCustomerId('');
        setItems([]);
        setNotes('');
        setShowNewOrderForm(false);
        setValidationErrors({});
        setError('');
      } else {
        setError(response.error || 'Error creando orden');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    }
  }, [orderType, supplierId, customerId, items, notes, validateForm, orders]);

  // Confirmar orden
  const handleConfirmOrder = useCallback(async (orderId: string) => {
    try {
      const response: any = await invoke('confirm_order', { order_id: orderId });

      if (response.success) {
        setOrders(orders.map(o =>
          o.id === orderId ? { ...o, status: 'confirmed' } : o
        ));
      } else {
        setError(response.error || 'Error confirmando orden');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    }
  }, [orders]);

  const getStatusColor = useCallback((status: string) => {
    const statusObj = ORDER_STATUSES.find(s => s.value === status);
    return statusObj?.color || '#999';
  }, []);

  const getStatusLabel = useCallback((status: string) => {
    const statusObj = ORDER_STATUSES.find(s => s.value === status);
    return statusObj?.label || status;
  }, []);

  const hasErrors = Object.keys(validationErrors).length > 0;

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (typeFilter && order.order_type !== typeFilter) return false;
      if (statusFilter && order.status !== statusFilter) return false;
      return true;
    });
  }, [orders, typeFilter, statusFilter]);

  return (
    <div className="orders-panel">
      <div className="orders-header">
        <h2>Órdenes de Compra/Venta</h2>
        <button
          className="btn-primary"
          onClick={() => setShowNewOrderForm(!showNewOrderForm)}
        >
          {showNewOrderForm ? '✕ Cancelar' : '+ Nueva Orden'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showNewOrderForm && (
        <form className="order-form" onSubmit={handleCreateOrder}>
          <div className="form-section">
            <h3>Información de la Orden</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Tipo de Orden *</label>
                <select
                  value={orderType}
                  onChange={(e) => {
                    setOrderType(e.target.value);
                    setSupplierId('');
                    setCustomerId('');
                  }}
                >
                  {ORDER_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {orderType === 'purchase' ? (
                <div className="form-group">
                  <label>Proveedor *</label>
                  <input
                    type="text"
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    placeholder="ID o nombre del proveedor"
                  />
                  {validationErrors.supplier && (
                    <div className="error">{validationErrors.supplier}</div>
                  )}
                </div>
              ) : (
                <div className="form-group">
                  <label>Cliente *</label>
                  <input
                    type="text"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    placeholder="ID o nombre del cliente"
                  />
                  {validationErrors.customer && (
                    <div className="error">{validationErrors.customer}</div>
                  )}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Notas (Opcional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Agregar notas sobre esta orden..."
                rows={3}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Items de la Orden</h3>

            {validationErrors.items && (
              <div className="field-error">{validationErrors.items}</div>
            )}

            <div className="items-table">
              <div className="items-header">
                <div className="col-product">Producto</div>
                <div className="col-quantity">Cantidad</div>
                <div className="col-price">Precio Unitario</div>
                <div className="col-subtotal">Subtotal</div>
                <div className="col-action"></div>
              </div>

              {items.length === 0 ? (
                <div className="no-items">No hay items agregados</div>
              ) : (
                items.map((item, idx) => (
                  <div key={idx} className="item-row">
                    <div className="col-product">
                      <input
                        type="text"
                        value={item.product_id}
                        onChange={(e) => updateItem(idx, 'product_id', e.target.value)}
                        placeholder="Producto"
                      />
                      {validationErrors[`item_${idx}_product`] && (
                        <div className="error">{validationErrors[`item_${idx}_product`]}</div>
                      )}
                    </div>

                    <div className="col-quantity">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(idx, 'quantity', parseInt(e.target.value))}
                      />
                      {validationErrors[`item_${idx}_quantity`] && (
                        <div className="error">{validationErrors[`item_${idx}_quantity`]}</div>
                      )}
                    </div>

                    <div className="col-price">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => updateItem(idx, 'unit_price', parseFloat(e.target.value))}
                      />
                      {validationErrors[`item_${idx}_price`] && (
                        <div className="error">{validationErrors[`item_${idx}_price`]}</div>
                      )}
                    </div>

                    <div className="col-subtotal">
                      ${(item.quantity * item.unit_price).toFixed(2)}
                    </div>

                    <div className="col-action">
                      <button
                        type="button"
                        className="btn-danger"
                        onClick={() => removeItem(idx)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button type="button" className="btn-secondary" onClick={addItem}>
              + Agregar Item
            </button>
          </div>

          <div className="form-section">
            <div className="order-total">
              <span className="label">Total de la Orden:</span>
              <span className="value">${orderTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={hasErrors || items.length === 0}>
              Crear Orden
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowNewOrderForm(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="filters-section">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Todos los tipos</option>
          {ORDER_TYPES.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Todos los estados</option>
          {ORDER_STATUSES.map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>

        <button className="btn-secondary" onClick={loadOrders} disabled={loading}>
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      <div className="orders-list">
        {loading ? (
          <div className="loading">Cargando órdenes...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="no-data">No hay órdenes que coincidan con los filtros</div>
        ) : (
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Parte Relacionada</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td className="order-id">{order.id.slice(0, 8)}</td>
                    <td>
                      {order.order_type === 'purchase' ? '📥 Compra' : '📤 Venta'}
                    </td>
                    <td>
                      {order.order_type === 'purchase'
                        ? order.supplier_id || 'N/A'
                        : order.customer_id || 'N/A'}
                    </td>
                    <td className="price"><strong>${order.total.toFixed(2)}</strong></td>
                    <td>
                      <span
                        className="badge"
                        style={{ background: `${getStatusColor(order.status)}20`, color: getStatusColor(order.status) }}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="date">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      {order.status === 'draft' && (
                        <button
                          className="btn-confirm"
                          onClick={() => handleConfirmOrder(order.id)}
                        >
                          Confirmar
                        </button>
                      )}
                      {order.status !== 'draft' && (
                        <span className="status-locked">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(OrdersPanel);
