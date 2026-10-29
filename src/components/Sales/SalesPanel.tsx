import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { invoke } from '@tauri-apps/api/core';
import '../../styles/Sales.css';

interface SaleItem {
  product_id: string;
  product_name?: string;
  quantity: number;
  unit_price: number;
  subtotal?: number;
}

interface Sale {
  id: string;
  customer_id?: string;
  user_id: string;
  status: string;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total: number;
  payment_method: string;
  items: string;
  created_at: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const TAX_RATE = 0.19; // IVA Chile 19%
const PAYMENT_METHODS = ['cash', 'credit_card', 'transfer', 'check'];

const SalesPanel: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNewSaleForm, setShowNewSaleForm] = useState(false);

  // Nueva venta
  const [items, setItems] = useState<SaleItem[]>([]);
  const [customerId, setCustomerId] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Cargar ventas
  const loadSales = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response: any = await invoke('get_sales', { limit: 50 });
      if (response.success) {
        setSales(response.data);
      } else {
        setError(response.error || 'Error cargando ventas');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  // Validación de items
  const validateItems = useCallback((itemsList: SaleItem[]): boolean => {
    const errors: ValidationErrors = {};

    if (itemsList.length === 0) {
      errors.items = 'Debe agregar al menos 1 item';
    }

    itemsList.forEach((item, idx) => {
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
  }, []);

  // Validación de descuento
  const validateDiscount = useCallback((discount: number): boolean => {
    const errors: ValidationErrors = {};

    if (discount < 0 || discount > 100) {
      errors.discount = 'Descuento debe estar entre 0-100%';
    }

    setValidationErrors(prev => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  }, []);

  // Cálculos
  const calculations = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const discountAmount = subtotal * (discountPercent / 100);
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * TAX_RATE;
    const total = taxableAmount + taxAmount;

    return { subtotal, discountAmount, taxableAmount, taxAmount, total };
  }, [items, discountPercent]);

  // Agregar item
  const addItem = useCallback(() => {
    setItems([...items, { product_id: '', quantity: 1, unit_price: 0 }]);
    setValidationErrors({});
  }, [items]);

  // Actualizar item
  const updateItem = useCallback((idx: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    setItems(newItems);
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`item_${idx}_${field}`];
      return newErrors;
    });
  }, [items]);

  // Eliminar item
  const removeItem = useCallback((idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  }, [items]);

  // Crear venta
  const handleCreateSale = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateItems(items) || !validateDiscount(discountPercent)) {
      return;
    }

    try {
      const response: any = await invoke('create_sale', {
        customer_id: customerId || null,
        items,
        discount_percent: discountPercent,
        payment_method: paymentMethod,
      });

      if (response.success) {
        setSales([response.data, ...sales]);
        // Reset form
        setItems([]);
        setCustomerId('');
        setDiscountPercent(0);
        setPaymentMethod('cash');
        setShowNewSaleForm(false);
        setValidationErrors({});
        setError('');
      } else {
        setError(response.error || 'Error creando venta');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    }
  }, [items, customerId, discountPercent, paymentMethod, validateItems, validateDiscount, sales]);

  const hasErrors = Object.keys(validationErrors).length > 0;

  return (
    <div className="sales-panel">
      <div className="sales-header">
        <h2>Ventas</h2>
        <button
          className="btn-primary"
          onClick={() => setShowNewSaleForm(!showNewSaleForm)}
        >
          {showNewSaleForm ? '✕ Cancelar' : '+ Nueva Venta'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showNewSaleForm && (
        <form className="sale-form" onSubmit={handleCreateSale}>
          <div className="form-section">
            <h3>Información de Venta</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Cliente (Opcional)</label>
                <input
                  type="text"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder="ID del cliente"
                />
              </div>

              <div className="form-group">
                <label>Método de Pago *</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  {PAYMENT_METHODS.map(method => (
                    <option key={method} value={method}>
                      {method === 'cash' && 'Efectivo'}
                      {method === 'credit_card' && 'Tarjeta Crédito'}
                      {method === 'transfer' && 'Transferencia'}
                      {method === 'check' && 'Cheque'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Items de Venta</h3>

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
                        placeholder="ID o nombre del producto"
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
            <h3>Cálculos</h3>

            <div className="calculations">
              <div className="calc-row">
                <span className="label">Subtotal:</span>
                <span className="value">${calculations.subtotal.toFixed(2)}</span>
              </div>

              <div className="calc-row">
                <div className="discount-input">
                  <label>Descuento (%):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(parseFloat(e.target.value))}
                  />
                </div>
                <span className="value">-${calculations.discountAmount.toFixed(2)}</span>
              </div>

              {validationErrors.discount && (
                <div className="field-error">{validationErrors.discount}</div>
              )}

              <div className="calc-row">
                <span className="label">Base Imponible:</span>
                <span className="value">${calculations.taxableAmount.toFixed(2)}</span>
              </div>

              <div className="calc-row highlight">
                <span className="label">IVA 19%:</span>
                <span className="value">${calculations.taxAmount.toFixed(2)}</span>
              </div>

              <div className="calc-row total">
                <span className="label">TOTAL:</span>
                <span className="value">${calculations.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={hasErrors || items.length === 0}>
              Crear Venta
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowNewSaleForm(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="sales-list">
        <h3>Últimas Ventas</h3>

        {loading ? (
          <div className="loading">Cargando ventas...</div>
        ) : sales.length === 0 ? (
          <div className="no-data">No hay ventas registradas</div>
        ) : (
          <div className="sales-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Método de Pago</th>
                  <th>Subtotal</th>
                  <th>Descuento</th>
                  <th>IVA</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {sales.map(sale => (
                  <tr key={sale.id}>
                    <td className="sale-id">{sale.id.slice(0, 8)}</td>
                    <td>{sale.payment_method}</td>
                    <td className="price">${sale.subtotal.toFixed(2)}</td>
                    <td className="price discount">-${sale.discount_amount.toFixed(2)}</td>
                    <td className="price tax">${sale.tax_amount.toFixed(2)}</td>
                    <td className="price total"><strong>${sale.total.toFixed(2)}</strong></td>
                    <td><span className="badge">{sale.status}</span></td>
                    <td className="date">{new Date(sale.created_at).toLocaleDateString()}</td>
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

export default React.memo(SalesPanel);
