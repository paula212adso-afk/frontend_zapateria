import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Package, Tags, ClipboardList } from 'lucide-react';
import { AuthProvider } from './auth/AuthContext';
import { CarritoProvider } from './carrito/CarritoContext';
import { UiProvider } from './components/Ui';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './components/AppShell';
import TiendaLayout from './components/TiendaLayout';
import Catalogo from './pages/Catalogo';
import Producto from './pages/Producto';
import Carrito from './pages/Carrito';
import MisPedidos from './pages/MisPedidos';
import PedidoCliente from './pages/PedidoCliente';
import LoginCliente from './cliente/Login';
import RegistroCliente from './cliente/Registro';
import LoginAdmin from './admin/Login';
import Productos from './admin/Productos';
import Categorias from './admin/Categorias';
import Pedidos from './admin/Pedidos';

const NAV_ADMIN = [
  { to: '/admin/productos', texto: 'Productos', Icono: Package },
  { to: '/admin/categorias', texto: 'Categorías', Icono: Tags },
  { to: '/admin/pedidos', texto: 'Pedidos', Icono: ClipboardList },
];

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <CarritoProvider>
          <UiProvider>
            <Routes>
              {/* Tienda */}
              <Route element={<TiendaLayout />}>
                <Route path="/" element={<Catalogo />} />
                <Route path="/producto/:id" element={<Producto />} />
                <Route path="/carrito" element={<ProtectedRoute rol="cliente"><Carrito /></ProtectedRoute>} />
                <Route path="/pedidos" element={<ProtectedRoute rol="cliente"><MisPedidos /></ProtectedRoute>} />
                <Route path="/pedidos/:id" element={<ProtectedRoute rol="cliente"><PedidoCliente /></ProtectedRoute>} />
              </Route>
              <Route path="/cliente/login" element={<LoginCliente />} />
              <Route path="/cliente/registro" element={<RegistroCliente />} />

              {/* Administración */}
              <Route path="/admin/login" element={<LoginAdmin />} />
              <Route path="/admin" element={<ProtectedRoute rol="admin"><AppShell rol="admin" etiqueta="Administración" nav={NAV_ADMIN} /></ProtectedRoute>}>
                <Route index element={<Navigate to="productos" replace />} />
                <Route path="productos" element={<Productos />} />
                <Route path="categorias" element={<Categorias />} />
                <Route path="pedidos" element={<Pedidos />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </UiProvider>
        </CarritoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
