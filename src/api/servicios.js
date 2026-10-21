import { http } from './http';

const POST = 'POST', PUT = 'PUT', PATCH = 'PATCH', DELETE = 'DELETE';
const cliente = { rol: 'cliente' };
const admin = { rol: 'admin' };

// Arma ?a=1&b=2 ignorando valores vacíos
const qs = (p = {}) => {
  const q = new URLSearchParams();
  Object.entries(p).forEach(([k, v]) => { if (v !== '' && v != null) q.set(k, v); });
  const s = q.toString();
  return s ? `?${s}` : '';
};

export const api = {
  // Sesión
  login: (c) => http('/api/auth/login', { metodo: POST, cuerpo: { email: c.correo, password: c.clave } }),
  loginAdmin: (c) => http('/api/auth/admin/login', { metodo: POST, cuerpo: { email: c.correo, password: c.clave } }),
  registro: (d) => http('/api/auth/registro', { metodo: POST, cuerpo: d }),

  // Catálogo (público)
  categorias: () => http('/api/categorias'),
  productos: (params) => http(`/api/productos${qs(params)}`),
  producto: (id) => http(`/api/productos/${id}`),

  // Carrito (cliente) — todas las respuestas devuelven el carrito actualizado
  carrito: () => http('/api/carrito', cliente),
  agregarAlCarrito: (d) => http('/api/carrito/items', { ...cliente, metodo: POST, cuerpo: d }),
  cambiarCantidad: (id, cantidad) => http(`/api/carrito/items/${id}`, { ...cliente, metodo: PATCH, cuerpo: { cantidad } }),
  quitarDelCarrito: (id) => http(`/api/carrito/items/${id}`, { ...cliente, metodo: DELETE }),
  vaciarCarrito: () => http('/api/carrito', { ...cliente, metodo: DELETE }),

  // Pedidos (cliente)
  crearPedido: (d) => http('/api/pedidos', { ...cliente, metodo: POST, cuerpo: d }),
  misPedidos: (params) => http(`/api/pedidos${qs(params)}`, cliente),
  miPedido: (id) => http(`/api/pedidos/${id}`, cliente),

  // Admin: productos y categorías
  crearProducto: (d) => http('/api/productos', { ...admin, metodo: POST, cuerpo: d }),
  editarProducto: (id, d) => http(`/api/productos/${id}`, { ...admin, metodo: PUT, cuerpo: d }),
  eliminarProducto: (id) => http(`/api/productos/${id}`, { ...admin, metodo: DELETE }),
  eliminarTalla: (id, talla) => http(`/api/productos/${id}/tallas/${talla}`, { ...admin, metodo: DELETE }),
  crearCategoria: (d) => http('/api/categorias', { ...admin, metodo: POST, cuerpo: d }),
  editarCategoria: (id, d) => http(`/api/categorias/${id}`, { ...admin, metodo: PUT, cuerpo: d }),
  eliminarCategoria: (id) => http(`/api/categorias/${id}`, { ...admin, metodo: DELETE }),

  // Admin: pedidos
  pedidosAdmin: (params) => http(`/api/admin/pedidos${qs(params)}`, admin),
  pedidoAdmin: (id) => http(`/api/admin/pedidos/${id}`, admin),
  cambiarEstado: (id, estado) => http(`/api/admin/pedidos/${id}/estado`, { ...admin, metodo: PATCH, cuerpo: { estado } }),
};
