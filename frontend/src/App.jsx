import { Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ConsultPeoplePage from './pages/ConsultPeoplePage';
import PersonProfilePage from './pages/PersonProfilePage';
import UsersPage from './pages/UsersPage';
import ClientsPage from './pages/ClientsPage';
import ProductsPage from './pages/ProductsPage';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute roles={['super', 'user', 'adm']}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/consultar-pessoas"
          element={
            <ProtectedRoute roles={['super', 'adm', 'user']}>
              <ConsultPeoplePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/consultar-pessoas/:personCpf"
          element={
            <ProtectedRoute roles={['super', 'adm', 'user']}>
              <PersonProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute roles={['super', 'adm', 'user']}>
              <UsersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clients"
          element={
            <ProtectedRoute roles={['super', 'user', 'adm']}>
              <ClientsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute roles={['super', 'user', 'adm']}>
              <ProductsPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
