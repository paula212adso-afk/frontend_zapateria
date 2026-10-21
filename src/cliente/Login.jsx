import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api/servicios';
import { useAuth } from '../auth/AuthContext';
import AuthLayout from '../components/AuthLayout';
import LoginForm from '../components/LoginForm';

export default function LoginCliente() {
  const { sesiones } = useAuth();
  const ir = useNavigate();
  const desde = useLocation().state?.desde || '/';
  if (sesiones.cliente) return <Navigate to={desde} replace />;
  return (
    <AuthLayout lado="Bienvenido de vuelta." ladoTexto="Inicia sesión para guardar tu carrito y seguir tus pedidos."
      titulo="Iniciar sesión" subtitulo="Ingresa con tu correo y contraseña."
      pie={<>¿Aún no tienes cuenta? <Link to="/cliente/registro" state={{ desde }}>Crear cuenta</Link></>}>
      <LoginForm rol="cliente" servicio={api.login} alEntrar={() => ir(desde, { replace: true })} />
    </AuthLayout>
  );
}
