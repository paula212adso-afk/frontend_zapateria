import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { api } from '../api/servicios';
import { useAuth } from '../auth/AuthContext';
import { useCarrito } from '../carrito/CarritoContext';
import { useUi } from '../components/Ui';
import { dinero } from '../lib/formato';
import { Cargando, Vacio } from '../components/Estados';
import Imagen from '../components/Imagen';
import Cantidad from '../components/Cantidad';
import Modal from '../components/Modal';
import Campo from '../components/Campo';

export default function Carrito() {
  const { carrito, cargado, cambiar, quitar, vaciar } = useCarrito();
  const { toast, confirmar } = useUi();
  const [pidiendo, setPidiendo] = useState(false);

  const intentar = async (fn) => { try { await fn(); } catch (e) { toast(e.message, 'error'); } };

  const alVaciar = async () => {
    const ok = await confirmar({ titulo: 'Vaciar carrito', texto: 'Se quitarán todos los productos del carrito.', boton: 'Vaciar', peligro: true });
    if (ok) intentar(vaciar);
  };

  if (!cargado) return <Cargando />;
  if (!carrito.items.length) {
    return (
      <Vacio titulo="Tu carrito está vacío" texto="Agrega productos desde el catálogo.">
        <Link to="/" className="btn">Ver productos</Link>
      </Vacio>
    );
  }

  return (
    <>
      <div className="pagina-cab">
        <div><h2>Tu carrito</h2><p className="texto-suave">{carrito.cantidad_total} {carrito.cantidad_total === 1 ? 'producto' : 'productos'}</p></div>
        <button className="btn peligro chico" onClick={alVaciar}><Trash2 size={16} /> Vaciar carrito</button>
      </div>

      <div className="carrito-grid">
        <div className="carrito-lista">
          {carrito.items.map((i) => (
            <div className="c-fila" key={i.id}>
              <div className="p-img"><Imagen url={i.imagen_url} alt={i.nombre} tam={32} /></div>
              <div>
                <Link to={`/producto/${i.producto_id}`} className="c-nombre">{i.nombre}</Link>
                <div className="c-sub">Talla {i.talla} · {dinero(i.precio)} c/u</div>
                {i.cantidad > i.stock_disponible && <div className="campo-error">Solo hay {i.stock_disponible} disponibles</div>}
              </div>
              <Cantidad valor={i.cantidad} max={i.stock_disponible} onChange={(c) => intentar(() => cambiar(i.id, c))} />
              <div className="c-precio">{dinero(i.subtotal)}</div>
              <button className="icono-btn" aria-label={`Quitar ${i.nombre}`} onClick={() => intentar(() => quitar(i.id))}><Trash2 size={18} /></button>
            </div>
          ))}
        </div>

        <aside className="resumen" aria-label="Resumen del pedido">
          <h3>Resumen</h3>
          <div className="linea" style={{ marginTop: 10 }}><span>Productos</span><span>{carrito.cantidad_total}</span></div>
          <div className="linea total"><span>Total</span><span>{dinero(carrito.total)}</span></div>
          <button className="btn ancho" onClick={() => setPidiendo(true)}>Realizar pedido</button>
        </aside>
      </div>

      {pidiendo && <PedidoModal onClose={() => setPidiendo(false)} />}
    </>
  );
}

function PedidoModal({ onClose }) {
  const { sesiones } = useAuth();
  const { cargar } = useCarrito();
  const { toast } = useUi();
  const ir = useNavigate();
  const [v, setV] = useState({ direccion_envio: '', telefono: sesiones.cliente.usuario.telefono ?? '', notas: '' });
  const [err, setErr] = useState({});
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const poner = (k) => (e) => setV((x) => ({ ...x, [k]: e.target.value }));

  const enviar = async (e) => {
    e.preventDefault();
    const x = {};
    if (v.direccion_envio.trim().length < 5) x.direccion_envio = 'Escribe una dirección completa.';
    if (v.telefono.trim().length < 5) x.telefono = 'Escribe un teléfono de contacto.';
    setErr(x);
    if (Object.keys(x).length) return;
    setEnviando(true); setError('');
    try {
      const pedido = await api.crearPedido({
        direccion_envio: v.direccion_envio.trim(), telefono: v.telefono.trim(), notas: v.notas.trim() || null,
      });
      await cargar();
      toast(`Pedido #${pedido.id} realizado con éxito.`);
      ir(`/pedidos/${pedido.id}`);
    } catch (ex) { setError(ex.message); setEnviando(false); }
  };

  return (
    <Modal titulo="Datos de envío" onClose={onClose}>
      <p className="texto-suave">Confirma a dónde enviamos tu pedido.</p>
      <form onSubmit={enviar} noValidate>
        <Campo etiqueta="Dirección de envío" error={err.direccion_envio}>
          {(p) => <input {...p} value={v.direccion_envio} onChange={poner('direccion_envio')} autoComplete="street-address" autoFocus />}
        </Campo>
        <Campo etiqueta="Teléfono" error={err.telefono}>
          {(p) => <input {...p} type="tel" value={v.telefono} onChange={poner('telefono')} autoComplete="tel" />}
        </Campo>
        <Campo etiqueta="Notas (opcional)" ayuda="Indicaciones para la entrega.">
          {(p) => <textarea {...p} value={v.notas} onChange={poner('notas')} maxLength={500} />}
        </Campo>
        {error && <div className="aviso error" role="alert">{error}</div>}
        <div className="botones">
          <button type="button" className="btn sec" onClick={onClose}>Cancelar</button>
          <button className="btn" disabled={enviando}>{enviando ? 'Procesando…' : 'Confirmar pedido'}</button>
        </div>
      </form>
    </Modal>
  );
}
