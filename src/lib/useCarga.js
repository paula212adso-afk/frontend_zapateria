import { useCallback, useEffect, useRef, useState } from 'react';

// Ejecuta una función async al montar y permite recargar. Maneja carga y error.
export function useCarga(fn) {
  const [estado, setEstado] = useState({ datos: null, cargando: true, error: '' });
  const ref = useRef(fn);
  ref.current = fn;

  const recargar = useCallback(async () => {
    setEstado((s) => ({ ...s, cargando: true, error: '' }));
    try { setEstado({ datos: await ref.current(), cargando: false, error: '' }); }
    catch (e) { setEstado({ datos: null, cargando: false, error: e.message }); }
  }, []);

  useEffect(() => { recargar(); }, [recargar]);
  return { ...estado, recargar };
}
