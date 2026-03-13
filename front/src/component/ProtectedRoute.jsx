import { Navigate } from 'react-router-dom';
import { useAuth } from '../Clients/components/Auth/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, token, loading } = useAuth();

  // Attendre que le contexte soit hydraté (restauration depuis localStorage)
  if (loading) return null;

  // Pas connecté → login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Rôle non autorisé
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}