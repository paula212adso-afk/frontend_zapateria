import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api/servicios';
import { useAuth } from '../auth/AuthContext';
import { useUi } from '../components/Ui';
import AuthLayout from '../components/AuthLayout';
import Campo from '../components/Campo';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegistroCliente() {
  const { sesiones, entrar } = useAuth();
  const { toast } = useUi();
  const ir = useNavigate();
  const desde = useLocation().state?.desde || '/';
  const [v, setV] = useState({ nombre: '', email: '', telefono: '', password: '', repetir: '' });
  const [err, setErr] = useState({});
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const poner = (k) => (e) => setV((x) => ({ ...x, [k]: e.target.value }));

  if (sesiones.cliente && !enviando) return <Navigate to={desde} replace />;

  const enviar = async (e) => {
    e.preventDefault();
    const x = {};
    if (v.nombre.trim().length < 2) x.nombre = 'Escribe tu nombre.';
    if (!EMAIL.test(v.email.trim())) x.email = 'Escribe un correo válido.';
    if (v.password.length < 8) x.password = 'Mínimo 8 caracteres.';
    if (v.repetir !== v.password) x.repetir = 'Las contraseñas no coinciden.';
    setErr(x);
    if (Object.keys(x).length) return;
    setEnviando(true); setError('');
    try {
      const cuerpo = { nombre: v.nombre.trim(), email: v.email.trim(), password: v.password };
      if (v.telefono.trim()) cuerpo.telefono = v.telefono.trim();
      const d = await api.registro(cuerpo);
      entrar('cliente', { token: d.token, usuario: d.usuario });   // la API ya devuelve la sesión iniciada
      toast('¡Cuenta creada! Bienvenido.');
      ir(desde, { replace: true });
    } catch (ex) { setError(ex.message); setEnviando(false); }
  };

  return (
    <AuthLayout lado="Crea tu cuenta." ladoTexto="Compra más rápido y sigue el estado de tus pedidos."
      titulo="Crear cuenta" subtitulo="Completa tus datos."
      pie={<>¿Ya tienes cuenta? <Link to="/cliente/login" state={{ desde }}>Iniciar sesión</Link></>}>
      <form onSubmit={enviar} noValidate>
        <Campo etiqueta="Nombre completo" error={err.nombre}>
          {(p) => <input {...p} value={v.nombre} onChange={poner('nombre')} autoComplete="name" autoFocus />}
        </Campo>
        <Campo etiqueta="Correo" error={err.email}>
          {(p) => <input {...p} type="email" value={v.email} onChange={poner('email')} autoComplete="email" />}
        </Campo>
        <Campo etiqueta="Teléfono (opcional)">
          {(p) => <input {...p} type="tel" value={v.telefono} onChange={poner('telefono')} autoComplete="tel" />}
        </Campo>
        <div className="fila-2">
          <Campo etiqueta="Contraseña" error={err.password} ayuda="Mínimo 8 caracteres.">
            {(p) => <input {...p} type="password" value={v.password} onChange={poner('password')} autoComplete="new-password" />}
          </Campo>
          <Campo etiqueta="Repite la contraseña" error={err.repetir}>
            {(p) => <input {...p} type="password" value={v.repetir} onChange={poner('repetir')} autoComplete="new-password" />}
          </Campo>
        </div>
        {error && <div className="aviso error" role="alert">{error}</div>}
        <button className="btn ancho" disabled={enviando}>{enviando ? 'Creando…' : 'Crear cuenta'}</button>
      </form>
    </AuthLayout>
  );
}
