import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

// Solo deja pasar si hay sesión de ese rol; si no, manda a su login y recuerda a dónde volver
export default function ProtectedRoute({ rol, children }) {
  const { sesiones } = useAuth();
  const loc = useLocation();
  return sesiones[rol] ? children : <Navigate to={`/${rol}/login`} replace state={{ desde: loc.pathname }} />;
}
