import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import Modal from './Modal';

const UiCtx = createContext(null);

// Avisos (toast) y cuadro de confirmación para toda la app
export function UiProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [conf, setConf] = useState(null);

  const toast = useCallback((texto, tipo = 'ok') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, texto, tipo }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);

  const confirmar = useCallback((opciones) => new Promise((res) => setConf({ ...opciones, res })), []);
  const cerrar = (valor) => { conf.res(valor); setConf(null); };

  return (
    <UiCtx.Provider value={{ toast, confirmar }}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.tipo}`}>
            {t.tipo === 'ok' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />} {t.texto}
          </div>
        ))}
      </div>
      {conf && (
        <Modal titulo={conf.titulo} onClose={() => cerrar(false)}>
          <p className="texto-suave">{conf.texto}</p>
          <div className="botones">
            <button className="btn sec" onClick={() => cerrar(false)}>Cancelar</button>
            <button className={`btn ${conf.peligro ? 'peligro-lleno' : ''}`} onClick={() => cerrar(true)}>{conf.boton || 'Aceptar'}</button>
          </div>
        </Modal>
      )}
    </UiCtx.Provider>
  );
}

export const useUi = () => useContext(UiCtx);
