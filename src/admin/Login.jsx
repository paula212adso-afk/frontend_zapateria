import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api/servicios';
import { useAuth } from '../auth/AuthContext';
import AuthLayout from '../components/AuthLayout';
import LoginForm from '../components/LoginForm';

export default function LoginAdmin() {
  const { sesiones } = useAuth();
  const ir = useNavigate();
  const desde = useLocation().state?.desde;
  const destino = desde?.startsWith('/admin') ? desde : '/admin/productos';
  if (sesiones.admin) return <Navigate to={destino} replace />;
  return (
    <AuthLayout lado="Tu tienda, bajo control." ladoTexto="Gestiona productos, categorías y pedidos."
      titulo="Acceso de administración" subtitulo="Ingresa con tu correo y contraseña de administrador.">
      <LoginForm rol="admin" servicio={api.loginAdmin} alEntrar={() => ir(destino, { replace: true })} />
    </AuthLayout>
  );
}
