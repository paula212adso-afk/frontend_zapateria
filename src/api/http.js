import { leerSesion, borrarSesion } from '../auth/storage';

// URL de la API: se define en VITE_API_URL (archivo .env en local, variable de entorno en el hosting)
const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(mensaje, estado) { super(mensaje); this.estado = estado; }
}

// Convierte el cuerpo de error de la API en un mensaje legible
function mensajeDe(datos) {
  const base = datos.error || datos.mensaje || 'Ocurrió un error inesperado.';
  const d = datos.details;
  if (Array.isArray(d) && d.length) {
    if (d[0].mensaje) return `${base}: ${d.map((x) => (x.campo ? `${x.campo} – ${x.mensaje}` : x.mensaje)).join('; ')}`;
    if (d[0].producto) return `${base}: ${d.map((x) => `${x.producto} (talla ${x.talla}, disponibles ${x.disponible})`).join('; ')}`;
  }
  return base;
}

// `rol` indica con qué sesión se firma la petición (envía el token).
export async function http(ruta, { metodo = 'GET', cuerpo, rol } = {}) {
  const cabeceras = { 'Content-Type': 'application/json' };
  const sesion = rol && leerSesion(rol);
  if (sesion) cabeceras.Authorization = `Bearer ${sesion.token}`;

  let r;
  try {
    r = await fetch(BASE + ruta, { method: metodo, headers: cabeceras, body: cuerpo ? JSON.stringify(cuerpo) : undefined });
  } catch {
    throw new ApiError('No hay conexión con el servidor. Inténtalo de nuevo en unos segundos.', 0);
  }
  const datos = await r.json().catch(() => ({}));

  if (r.status === 401 && sesion) {            // token vencido: cerrar sesión de ese rol
    borrarSesion(rol);
    window.dispatchEvent(new CustomEvent('sesion-expirada', { detail: rol }));
  }
  if (!r.ok) throw new ApiError(mensajeDe(datos), r.status);
  return datos;
}
