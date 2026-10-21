import { useId } from 'react';

// Etiqueta + control + ayuda/error, conectados para lectores de pantalla
export default function Campo({ etiqueta, error, ayuda, children }) {
  const id = useId();
  const hijo = children({ id, 'aria-invalid': !!error, 'aria-describedby': `${id}-m` });
  return (
    <div className="campo">
      <label htmlFor={id}>{etiqueta}</label>
      {hijo}
      <div id={`${id}-m`} className={error ? 'campo-error' : 'campo-ayuda'}>{error || ayuda}</div>
    </div>
  );
}
