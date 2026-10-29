import React, { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import '../../styles/DashboardHome.css';

interface Stats {
  total_products: number;
  total_categories: number;
  low_stock: number;
  out_of_stock: number;
  total_value: number;
}

const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response: any = await invoke('get_inventory_stats');
      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.error || 'Error al cargar estadísticas');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <div className="dashboard-home">
      <section className="welcome-section">
        <h1>Dashboard</h1>
        <p>Bienvenido a Distribuidora San Martín</p>
      </section>

      <section className="stats-section">
        <h2>Estadísticas de Inventario</h2>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Cargando estadísticas...</div>
        ) : stats ? (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-label">Total Productos</div>
              <div className="stat-value">{stats.total_products}</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🏷️</div>
              <div className="stat-label">Categorías</div>
              <div className="stat-value">{stats.total_categories}</div>
            </div>

            <div className="stat-card warning">
              <div className="stat-icon">⚠️</div>
              <div className="stat-label">Stock Bajo</div>
              <div className="stat-value">{stats.low_stock}</div>
            </div>

            <div className="stat-card critical">
              <div className="stat-icon">❌</div>
              <div className="stat-label">Agotados</div>
              <div className="stat-value">{stats.out_of_stock}</div>
            </div>

            <div className="stat-card highlight">
              <div className="stat-icon">💰</div>
              <div className="stat-label">Valor Total</div>
              <div className="stat-value">${stats.total_value?.toFixed(2)}</div>
            </div>
          </div>
        ) : null}

        <button className="refresh-button" onClick={loadStats} disabled={loading}>
          {loading ? 'Actualizando...' : '🔄 Actualizar'}
        </button>
      </section>

      <section className="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div className="actions-grid">
          <div className="action-card">
            <div className="action-icon">➕</div>
            <div className="action-label">Nuevo Producto</div>
          </div>
          <div className="action-card">
            <div className="action-icon">🛒</div>
            <div className="action-label">Nueva Venta</div>
          </div>
          <div className="action-card">
            <div className="action-icon">📋</div>
            <div className="action-label">Nueva Orden</div>
          </div>
          <div className="action-card">
            <div className="action-icon">👥</div>
            <div className="action-label">Nuevo Cliente</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default React.memo(DashboardHome);
