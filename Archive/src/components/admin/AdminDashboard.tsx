import React from 'react';
import { useAdminStore } from '../../store/adminStore';
import { AdminSetup } from './AdminSetup';
import { AdminLogin } from './AdminLogin';
import { AdminPanel } from './AdminPanel';
import { useAuthStore } from '../../store/authStore';
import { Toaster } from 'sonner';

export const AdminDashboard: React.FC = () => {
  const { isSetup, credentials } = useAdminStore();
  const { user } = useAuthStore();

  // Reset admin store to force new account creation
  React.useEffect(() => {
    if (!credentials) {
      useAdminStore.getState().reset();
    }
  }, [credentials]);

  if (!isSetup || !credentials) {
    return <AdminSetup />;
  }

  if (!user) {
    return <AdminLogin />;
  }

  return (
    <>
      <Toaster position="top-center" />
      <AdminPanel />
    </>
  );
};