import React, { useState } from 'react';
import { AppLayout } from './Layout/AppLayout';
import DashboardHome from './Dashboard/DashboardHome';
import { Products } from './Inventory/Products';
import { CustomerList } from './Customers/CustomerList';
import SalesPanel from './Sales/SalesPanel';
import OrdersPanel from './Orders/OrdersPanel';
import ReportsPanel from './Reports/ReportsPanel';
import SettingsPanel from './Settings/SettingsPanel';
import '../styles/Dashboard.css';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardHome />;
      case 'products':
        return <Products />;
      case 'customers':
        return <CustomerList />;
      case 'sales':
        return <SalesPanel />;
      case 'orders':
        return <OrdersPanel />;
      case 'reports':
        return <ReportsPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <AppLayout
      currentPage={currentPage as any}
      onPageChange={setCurrentPage}
      userName={user?.full_name || user?.username || 'Usuario'}
      userRole={user?.role || 'ventas'}
      onLogout={onLogout}
    >
      {renderPage()}
    </AppLayout>
  );
};
