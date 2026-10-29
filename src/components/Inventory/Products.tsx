import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import '../../styles/Inventory.css';

interface Product {
  id: string;
  name: string;
  category_id: string;
  stock: number;
  price: number;
  cost: number;
  status: string;
  created_at: string;
}

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response: any = await invoke('get_products');
      if (response.success) {
        setProducts(response.data);
      } else {
        setError(response.error || 'Error cargando productos');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.id.toLowerCase().includes(filter.toLowerCase())
  );

  const stockStatus = (stock: number, minStock: number = 5) => {
    if (stock === 0) return 'agotado';
    if (stock <= minStock) return 'bajo';
    return 'normal';
  };

  const margin = (price: number, cost: number) => {
    if (cost === 0) return 0;
    return Math.round(((price - cost) / cost) * 100);
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <h2>Productos</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancelar' : '+ Nuevo Producto'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="products-search">
        <input
          type="text"
          placeholder="Buscar por nombre o código..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="search-input"
        />
        <button className="btn-secondary" onClick={loadProducts} disabled={loading}>
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      {loading ? (
        <div className="loading">Cargando productos...</div>
      ) : (
        <>
          <div className="products-stats">
            <div className="stat">
              <span className="label">Total Productos</span>
              <span className="value">{products.length}</span>
            </div>
            <div className="stat warning">
              <span className="label">Stock Bajo</span>
              <span className="value">
                {products.filter(p => p.stock > 0 && p.stock <= 5).length}
              </span>
            </div>
            <div className="stat critical">
              <span className="label">Agotados</span>
              <span className="value">
                {products.filter(p => p.stock === 0).length}
              </span>
            </div>
            <div className="stat">
              <span className="label">Valor Total</span>
              <span className="value">
                ${products.reduce((sum, p) => sum + (p.cost * p.stock), 0).toFixed(0)}
              </span>
            </div>
          </div>

          <div className="products-table">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Stock</th>
                  <th>Costo</th>
                  <th>Precio</th>
                  <th>Margen</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="no-data">
                      No hay productos que coincidan
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(product => (
                    <tr key={product.id} className={`status-${stockStatus(product.stock)}`}>
                      <td className="code">{product.id.slice(0, 8)}</td>
                      <td className="name">{product.name}</td>
                      <td className="stock">
                        <span className={`badge status-${stockStatus(product.stock)}`}>
                          {product.stock} un
                        </span>
                      </td>
                      <td className="price">${product.cost.toFixed(2)}</td>
                      <td className="price">${product.price.toFixed(2)}</td>
                      <td className="margin">
                        <span className={margin(product.price, product.cost) > 30 ? 'positive' : 'warning'}>
                          {margin(product.price, product.cost)}%
                        </span>
                      </td>
                      <td className="status">{product.status}</td>
                      <td className="actions">
                        <button className="btn-sm" onClick={() => setSelectedProduct(product)}>
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedProduct.name}</h3>
            <div className="modal-body">
              <p><strong>ID:</strong> {selectedProduct.id}</p>
              <p><strong>Stock:</strong> {selectedProduct.stock} unidades</p>
              <p><strong>Costo:</strong> ${selectedProduct.cost.toFixed(2)}</p>
              <p><strong>Precio:</strong> ${selectedProduct.price.toFixed(2)}</p>
              <p><strong>Margen:</strong> {margin(selectedProduct.price, selectedProduct.cost)}%</p>
              <p><strong>Valor Total:</strong> ${(selectedProduct.cost * selectedProduct.stock).toFixed(2)}</p>
            </div>
            <button className="btn-primary" onClick={() => setSelectedProduct(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
