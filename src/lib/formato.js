const cop = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
export const dinero = (n) => cop.format(Number(n) || 0);

export const fecha = (iso) =>
  new Date(iso).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });

export const iniciales = (nombre = '') =>
  nombre.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('');

export const ESTADOS = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'];
export const NOMBRE_ESTADO = {
  pendiente: 'Pendiente', pagado: 'Pagado', enviado: 'Enviado', entregado: 'Entregado', cancelado: 'Cancelado',
};
// Mismo flujo que valida la API
export const TRANSICIONES = {
  pendiente: ['pagado', 'cancelado'],
  pagado: ['enviado', 'cancelado'],
  enviado: ['entregado'],
  entregado: [],
  cancelado: [],
};

export const rangoTallas = (tallas = []) => {
  const d = tallas.filter((t) => t.stock > 0).map((t) => t.talla);
  if (!d.length) return null;
  const min = Math.min(...d), max = Math.max(...d);
  return min === max ? `Talla ${min}` : `Tallas ${min} – ${max}`;
};
