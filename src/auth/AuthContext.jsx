import { createContext, useContext, useEffect, useState } from 'react';
import { leerSesion, guardarSesion, borrarSesion } from './storage';

const AuthCtx = createContext(null);
const ROLES = ['cliente', 'admin'];

export function AuthProvider({ children }) {
  const [sesiones, setSesiones] = useState(() => Object.fromEntries(ROLES.map((r) => [r, leerSesion(r)])));

  const entrar = (rol, datos) => { guardarSesion(rol, datos); setSesiones((s) => ({ ...s, [rol]: datos })); };
  const salir = (rol) => { borrarSesion(rol); setSesiones((s) => ({ ...s, [rol]: null })); };

  useEffect(() => {
    const alExpirar = (e) => setSesiones((s) => ({ ...s, [e.detail]: null }));
    window.addEventListener('sesion-expirada', alExpirar);
    return () => window.removeEventListener('sesion-expirada', alExpirar);
  }, []);

  return <AuthCtx.Provider value={{ sesiones, entrar, salir }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
