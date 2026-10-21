import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import Campo from './Campo';

// Formulario de inicio de sesión compartido por cliente y admin
export default function LoginForm({ rol, servicio, alEntrar }) {
  const { entrar } = useAuth();
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [ver, setVer] = useState(false);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    if (!correo.trim() || !clave) { setError('Escribe tu correo y tu contraseña.'); return; }
    setEnviando(true); setError('');
    try {
      const d = await servicio({ correo: correo.trim(), clave });
      entrar(rol, { token: d.token, usuario: d.usuario });
      alEntrar();
    } catch (x) { setError(x.message); setEnviando(false); }
  };

  return (
    <form onSubmit={enviar} noValidate>
      <Campo etiqueta="Correo">
        {(p) => <input {...p} type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} autoComplete="username" autoFocus />}
      </Campo>
      <Campo etiqueta="Contraseña">
        {(p) => (
          <div className="con-icono">
            <input {...p} type={ver ? 'text' : 'password'} value={clave} onChange={(e) => setClave(e.target.value)} autoComplete="current-password" />
            <button type="button" className="icono-btn" onClick={() => setVer(!ver)} aria-label={ver ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
              {ver ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        )}
      </Campo>
      {error && <div className="aviso error" role="alert">{error}</div>}
      <button className="btn ancho" disabled={enviando}>{enviando ? 'Entrando…' : 'Iniciar sesión'}</button>
    </form>
  );
}
