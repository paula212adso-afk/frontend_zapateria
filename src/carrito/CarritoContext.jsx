import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../api/servicios';
import { useAuth } from '../auth/AuthContext';

const Ctx = createContext(null);
const VACIO = { items: [], cantidad_total: 0, total: 0 };

// Mantiene el carrito del cliente sincronizado con la API (y el contador del menú)
export function CarritoProvider({ children }) {
  const { sesiones } = useAuth();
  const logueado = !!sesiones.cliente;
  const [carrito, setCarrito] = useState(VACIO);
  const [cargado, setCargado] = useState(false);

  const cargar = useCallback(async () => {
    if (!logueado) { setCarrito(VACIO); setCargado(true); return; }
    try { setCarrito(await api.carrito()); } catch { /* el aviso lo muestra cada pantalla */ }
    setCargado(true);
  }, [logueado]);

  useEffect(() => { setCargado(false); cargar(); }, [cargar]);

  const aplicar = async (peticion) => { const c = await peticion(); setCarrito(c); return c; };

  return (
    <Ctx.Provider value={{
      carrito, cargado, cargar,
      agregar: (d) => aplicar(() => api.agregarAlCarrito(d)),
      cambiar: (id, cantidad) => aplicar(() => api.cambiarCantidad(id, cantidad)),
      quitar: (id) => aplicar(() => api.quitarDelCarrito(id)),
      vaciar: () => aplicar(() => api.vaciarCarrito()),
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useCarrito = () => useContext(Ctx);
