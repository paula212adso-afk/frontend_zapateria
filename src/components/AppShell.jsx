import { NavLink, Outlet, Link } from 'react-router-dom';
import { Footprints, LogOut, Store } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { iniciales } from '../lib/formato';
import { NOMBRE_TIENDA } from '../lib/config';

// Estructura del panel de administración: barra superior y menú lateral
export default function AppShell({ rol, etiqueta, nav = [], children }) {
  const { sesiones, salir } = useAuth();
  const usuario = sesiones[rol].usuario;
  return (
    <div className={`shell ${nav.length ? 'con-menu' : ''}`}>
      <header className="shell-top">
        <Link to="/admin" className="marca"><Footprints size={20} /> {NOMBRE_TIENDA} <span className="etiqueta-rol">{etiqueta}</span></Link>
        <div className="usuario">
          <Link to="/" className="btn sec chico"><Store size={16} /> Ver tienda</Link>
          <span className="avatar" aria-hidden="true">{iniciales(usuario.nombre)}</span>
          <span className="usuario-nombre">{usuario.nombre}</span>
          <button className="btn sec chico" onClick={() => salir(rol)}><LogOut size={16} /> Salir</button>
        </div>
      </header>
      {nav.length > 0 && (
        <nav className="shell-menu" aria-label="Secciones">
          {nav.map(({ to, texto, Icono }) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'activo' : '')}><Icono size={18} /> {texto}</NavLink>
          ))}
        </nav>
      )}
      <main className="shell-main">{children ?? <Outlet />}</main>
    </div>
  );
}
