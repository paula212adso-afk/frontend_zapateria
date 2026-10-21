import { Link, NavLink, Outlet } from 'react-router-dom';
import { Footprints, ShoppingCart, LogOut } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useCarrito } from '../carrito/CarritoContext';
import { iniciales } from '../lib/formato';
import { NOMBRE_TIENDA } from '../lib/config';

// Estructura de la tienda: cabecera con menú, carrito y sesión del cliente
export default function TiendaLayout() {
  const { sesiones, salir } = useAuth();
  const { carrito } = useCarrito();
  const cliente = sesiones.cliente?.usuario;
  const activo = ({ isActive }) => (isActive ? 'activo' : '');

  return (
    <div className="tienda">
      <header className="tienda-top">
        <div className="tienda-top-in">
          <Link to="/" className="marca"><Footprints size={22} /> {NOMBRE_TIENDA}</Link>
          <nav className="tienda-nav" aria-label="Principal">
            <NavLink to="/" end className={activo}>Catálogo</NavLink>
            {cliente && <NavLink to="/pedidos" className={activo}>Mis pedidos</NavLink>}
          </nav>
          <div className="tienda-acciones">
            <NavLink to="/carrito" className={({ isActive }) => `carrito-link ${isActive ? 'activo' : ''}`} aria-label={`Carrito, ${carrito.cantidad_total} productos`}>
              <ShoppingCart size={22} />
              {carrito.cantidad_total > 0 && <span className="badge">{carrito.cantidad_total}</span>}
            </NavLink>
            {cliente ? (
              <div className="usuario">
                <span className="avatar" aria-hidden="true">{iniciales(cliente.nombre)}</span>
                <span className="usuario-nombre">{cliente.nombre}</span>
                <button className="btn sec chico" onClick={() => salir('cliente')}><LogOut size={16} /> Salir</button>
              </div>
            ) : (
              <>
                <Link to="/cliente/login" className="btn sec chico">Iniciar sesión</Link>
                <Link to="/cliente/registro" className="btn chico">Crear cuenta</Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="tienda-main"><Outlet /></main>
      <footer className="tienda-pie">© {new Date().getFullYear()} {NOMBRE_TIENDA} · <Link to="/admin/login">Administración</Link></footer>
    </div>
  );
}
