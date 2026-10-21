import { useEffect, useRef } from 'react';

// Ventana modal con <dialog> nativo: cierra con Esc o al hacer clic fuera.
export default function Modal({ titulo, onClose, ancho = false, children }) {
  const ref = useRef(null);
  useEffect(() => { ref.current?.showModal(); }, []);
  return (
    <dialog ref={ref} className={`modal ${ancho ? 'ancho' : ''}`} onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }} aria-labelledby="modal-titulo">
      <div className="modal-cuerpo">
        <h3 id="modal-titulo">{titulo}</h3>
        {children}
      </div>
    </dialog>
  );
}
