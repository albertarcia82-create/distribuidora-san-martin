import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { invoke } from '@tauri-apps/api/core';
import '../../styles/Reports.css';

interface SalesReport {
  period: string;
  total_sales: number;
  quantity_sold: number;
  num_transactions: number;
}

interface ProductReport {
  product_id: string;
  product_name: string;
  quantity_sold: number;
  revenue: number;
  profit: number;
  profit_margin: number;
}

interface CustomerReport {
  customer_id: string;
  customer_name: string;
  total_spent: number;
  num_orders: number;
  credit_used: number;
}

interface InventoryReport {
  total_products: number;
  low_stock: number;
  out_of_stock: number;
  total_value: number;
}

const REPORT_TYPES = [
  { value: 'sales', label: 'Ventas por Período' },
  { value: 'products', label: 'Rentabilidad por Producto' },
  { value: 'customers', label: 'Top Clientes' },
  { value: 'inventory', label: 'Estado de Inventario' },
];

const ReportsPanel: React.FC = () => {
  const [reportType, setReportType] = useState('sales');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sales reports
  const [salesData, setSalesData] = useState<SalesReport[]>([]);
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Product reports
  const [productData, setProductData] = useState<ProductReport[]>([]);
  const [productSort, setProductSort] = useState<'revenue' | 'profit' | 'margin'>('revenue');

  // Customer reports
  const [customerData, setCustomerData] = useState<CustomerReport[]>([]);
  const [customerLimit, setCustomerLimit] = useState(10);

  // Inventory reports
  const [inventoryData, setInventoryData] = useState<InventoryReport | null>(null);

  // Load sales report
  const loadSalesReport = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response: any = await invoke('get_sales_report', {
        start_date: startDate,
        end_date: endDate,
      });
      if (response.success) {
        setSalesData(response.data);
      } else {
        setError(response.error || 'Error cargando reporte de ventas');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  // Load product report
  const loadProductReport = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response: any = await invoke('get_product_report', {
        sort_by: productSort,
        limit: 50,
      });
      if (response.success) {
        setProductData(response.data);
      } else {
        setError(response.error || 'Error cargando reporte de productos');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }, [productSort]);

  // Load customer report
  const loadCustomerReport = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response: any = await invoke('get_customer_report', {
        limit: customerLimit,
      });
      if (response.success) {
        setCustomerData(response.data);
      } else {
        setError(response.error || 'Error cargando reporte de clientes');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }, [customerLimit]);

  // Load inventory report
  const loadInventoryReport = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response: any = await invoke('get_inventory_report', {});
      if (response.success) {
        setInventoryData(response.data);
      } else {
        setError(response.error || 'Error cargando reporte de inventario');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load appropriate report based on type
  useEffect(() => {
    if (reportType === 'sales') loadSalesReport();
    else if (reportType === 'products') loadProductReport();
    else if (reportType === 'customers') loadCustomerReport();
    else if (reportType === 'inventory') loadInventoryReport();
  }, [reportType, loadSalesReport, loadProductReport, loadCustomerReport, loadInventoryReport]);

  // Calculate totals
  const salesTotals = useMemo(() => {
    const totalSales = salesData.reduce((sum, s) => sum + s.total_sales, 0);
    const totalQuantity = salesData.reduce((sum, s) => sum + s.quantity_sold, 0);
    const totalTransactions = salesData.reduce((sum, s) => sum + s.num_transactions, 0);
    const avgTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0;

    return { totalSales, totalQuantity, totalTransactions, avgTransaction };
  }, [salesData]);

  const productTotals = useMemo(() => {
    const totalRevenue = productData.reduce((sum, p) => sum + p.revenue, 0);
    const totalProfit = productData.reduce((sum, p) => sum + p.profit, 0);
    const avgMargin = productData.length > 0
      ? productData.reduce((sum, p) => sum + p.profit_margin, 0) / productData.length
      : 0;

    return { totalRevenue, totalProfit, avgMargin };
  }, [productData]);

  const customerTotals = useMemo(() => {
    const totalSpent = customerData.reduce((sum, c) => sum + c.total_spent, 0);
    const totalOrders = customerData.reduce((sum, c) => sum + c.num_orders, 0);
    const avgOrder = totalOrders > 0 ? totalSpent / totalOrders : 0;

    return { totalSpent, totalOrders, avgOrder };
  }, [customerData]);

  const handleDownloadPDF = useCallback(async () => {
    try {
      // Future PDF export implementation
      alert('Exportar a PDF - próximamente disponible');
    } catch (err) {
      setError('Error descargando PDF');
    }
  }, []);

  return (
    <div className="reports-panel">
      <div className="reports-header">
        <h2>Reportes y Análisis</h2>
        <button className="btn-primary" onClick={handleDownloadPDF}>
          📥 Descargar PDF
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="report-selector">
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="report-select"
        >
          {REPORT_TYPES.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {loading && <div className="loading">Generando reporte...</div>}

      {/* Sales Report */}
      {reportType === 'sales' && !loading && (
        <div className="report-container">
          <div className="report-filters">
            <div className="filter-group">
              <label>Desde:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Hasta:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <button className="btn-secondary" onClick={loadSalesReport}>
              Actualizar
            </button>
          </div>

          <div className="report-summary">
            <div className="summary-card">
              <div className="summary-label">Ventas Totales</div>
              <div className="summary-value">${salesTotals.totalSales.toFixed(2)}</div>
              <div className="summary-detail">{salesData.length} períodos</div>
            </div>
            <div className="summary-card">
              <div className="summary-label">Cantidad Vendida</div>
              <div className="summary-value">{salesTotals.totalQuantity}</div>
              <div className="summary-detail">unidades</div>
            </div>
            <div className="summary-card">
              <div className="summary-label">Transacciones</div>
              <div className="summary-value">{salesTotals.totalTransactions}</div>
              <div className="summary-detail">promedio ${salesTotals.avgTransaction.toFixed(2)}</div>
            </div>
          </div>

          <div className="report-table">
            <table>
              <thead>
                <tr>
                  <th>Período</th>
                  <th>Ventas</th>
                  <th>Cantidad</th>
                  <th>Transacciones</th>
                  <th>Promedio/Trans</th>
                </tr>
              </thead>
              <tbody>
                {salesData.length === 0 ? (
                  <tr><td colSpan={5} className="no-data">No hay datos disponibles</td></tr>
                ) : (
                  salesData.map((sale, idx) => (
                    <tr key={idx}>
                      <td>{sale.period}</td>
                      <td className="price">${sale.total_sales.toFixed(2)}</td>
                      <td className="quantity">{sale.quantity_sold}</td>
                      <td className="center">{sale.num_transactions}</td>
                      <td className="price">${(sale.total_sales / sale.num_transactions).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Report */}
      {reportType === 'products' && !loading && (
        <div className="report-container">
          <div className="report-filters">
            <select
              value={productSort}
              onChange={(e) => setProductSort(e.target.value as 'revenue' | 'profit' | 'margin')}
              className="filter-select"
            >
              <option value="revenue">Ordenar por Ingresos</option>
              <option value="profit">Ordenar por Ganancia</option>
              <option value="margin">Ordenar por Margen %</option>
            </select>
          </div>

          <div className="report-summary">
            <div className="summary-card">
              <div className="summary-label">Ingresos Totales</div>
              <div className="summary-value">${productTotals.totalRevenue.toFixed(2)}</div>
              <div className="summary-detail">{productData.length} productos</div>
            </div>
            <div className="summary-card">
              <div className="summary-label">Ganancia Total</div>
              <div className="summary-value">${productTotals.totalProfit.toFixed(2)}</div>
              <div className="summary-detail">margen promedio {productTotals.avgMargin.toFixed(1)}%</div>
            </div>
          </div>

          <div className="report-table">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Ingresos</th>
                  <th>Ganancia</th>
                  <th>Margen %</th>
                </tr>
              </thead>
              <tbody>
                {productData.length === 0 ? (
                  <tr><td colSpan={5} className="no-data">No hay datos disponibles</td></tr>
                ) : (
                  productData.map((product, idx) => (
                    <tr key={idx}>
                      <td className="product-name">{product.product_name}</td>
                      <td className="quantity">{product.quantity_sold}</td>
                      <td className="price">${product.revenue.toFixed(2)}</td>
                      <td className="profit">${product.profit.toFixed(2)}</td>
                      <td className="margin">
                        <span className={product.profit_margin >= 30 ? 'good' : product.profit_margin >= 15 ? 'normal' : 'low'}>
                          {product.profit_margin.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Report */}
      {reportType === 'customers' && !loading && (
        <div className="report-container">
          <div className="report-filters">
            <div className="filter-group">
              <label>Mostrar top:</label>
              <input
                type="number"
                min="5"
                max="50"
                value={customerLimit}
                onChange={(e) => setCustomerLimit(parseInt(e.target.value))}
              />
            </div>
            <button className="btn-secondary" onClick={loadCustomerReport}>
              Actualizar
            </button>
          </div>

          <div className="report-summary">
            <div className="summary-card">
              <div className="summary-label">Gasto Total</div>
              <div className="summary-value">${customerTotals.totalSpent.toFixed(2)}</div>
              <div className="summary-detail">{customerData.length} clientes</div>
            </div>
            <div className="summary-card">
              <div className="summary-label">Órdenes Totales</div>
              <div className="summary-value">{customerTotals.totalOrders}</div>
              <div className="summary-detail">promedio ${customerTotals.avgOrder.toFixed(2)}</div>
            </div>
          </div>

          <div className="report-table">
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Gasto Total</th>
                  <th>Órdenes</th>
                  <th>Promedio/Orden</th>
                  <th>Crédito Usado</th>
                </tr>
              </thead>
              <tbody>
                {customerData.length === 0 ? (
                  <tr><td colSpan={5} className="no-data">No hay datos disponibles</td></tr>
                ) : (
                  customerData.map((customer, idx) => (
                    <tr key={idx}>
                      <td className="customer-name">{customer.customer_name}</td>
                      <td className="price">${customer.total_spent.toFixed(2)}</td>
                      <td className="quantity">{customer.num_orders}</td>
                      <td className="price">${(customer.total_spent / customer.num_orders).toFixed(2)}</td>
                      <td className="credit">${customer.credit_used.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inventory Report */}
      {reportType === 'inventory' && !loading && inventoryData && (
        <div className="report-container">
          <div className="report-summary">
            <div className="summary-card large">
              <div className="summary-label">Total de Productos</div>
              <div className="summary-value">{inventoryData.total_products}</div>
            </div>
            <div className="summary-card highlight-low">
              <div className="summary-label">Stock Bajo</div>
              <div className="summary-value">{inventoryData.low_stock}</div>
              <div className="summary-detail">necesita reorden</div>
            </div>
            <div className="summary-card highlight-critical">
              <div className="summary-label">Agotados</div>
              <div className="summary-value">{inventoryData.out_of_stock}</div>
              <div className="summary-detail">acción urgente</div>
            </div>
            <div className="summary-card">
              <div className="summary-label">Valor Total</div>
              <div className="summary-value">${inventoryData.total_value.toFixed(2)}</div>
              <div className="summary-detail">inventario en mano</div>
            </div>
          </div>

          <div className="inventory-stats">
            <div className="stat-bar">
              <div className="stat-label">Disponible ({inventoryData.total_products - inventoryData.low_stock - inventoryData.out_of_stock})</div>
              <div className="stat-progress">
                <div className="progress-bar success" style={{width: `${((inventoryData.total_products - inventoryData.low_stock - inventoryData.out_of_stock) / inventoryData.total_products * 100) || 0}%`}}></div>
              </div>
            </div>

            <div className="stat-bar">
              <div className="stat-label">Stock Bajo ({inventoryData.low_stock})</div>
              <div className="stat-progress">
                <div className="progress-bar warning" style={{width: `${(inventoryData.low_stock / inventoryData.total_products * 100) || 0}%`}}></div>
              </div>
            </div>

            <div className="stat-bar">
              <div className="stat-label">Agotados ({inventoryData.out_of_stock})</div>
              <div className="stat-progress">
                <div className="progress-bar danger" style={{width: `${(inventoryData.out_of_stock / inventoryData.total_products * 100) || 0}%`}}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ReportsPanel);
