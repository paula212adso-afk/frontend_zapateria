import { AlertCircle } from 'lucide-react';

export const Cargando = () => (
  <div className="estado" role="status"><span className="spinner" /> Cargando…</div>
);

export const Vacio = ({ titulo, texto, children }) => (
  <div className="estado vacio"><strong>{titulo}</strong><span>{texto}</span>{children}</div>
);

export const ErrorCaja = ({ mensaje, onReintentar }) => (
  <div className="estado error" role="alert">
    <AlertCircle size={22} /><strong>No se pudo cargar</strong><span>{mensaje}</span>
    {onReintentar && <button className="btn sec" onClick={onReintentar}>Reintentar</button>}
  </div>
);
