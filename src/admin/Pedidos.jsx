import { useState } from 'react';
import { api } from '../api/servicios';
import { useCarga } from '../lib/useCarga';
import { ESTADOS, NOMBRE_ESTADO, TRANSICIONES, dinero, fecha } from '../lib/formato';
import { useUi } from '../components/Ui';
import { Cargando, Vacio, ErrorCaja } from '../components/Estados';
import EstadoEtiqueta from '../components/EstadoEtiqueta';
import Paginacion from '../components/Paginacion';
import Modal from '../components/Modal';
import PedidoVista from '../components/PedidoVista';

const ACCION = { pagado: 'Marcar como pagado', enviado: 'Marcar como enviado', entregado: 'Marcar como entregado', cancelado: 'Cancelar pedido' };

export default function Pedidos() {
  const [estado, setEstado] = useState('');
  const [page, setPage] = useState(1);
  const [vez, setVez] = useState(0);
  const [abierto, setAbierto] = useState(null);

  return (
    <>
      <div className="pagina-cab">
        <div><h2>Pedidos</h2><p className="texto-suave">Revisa los pedidos de los clientes y actualiza su estado.</p></div>
        <label className="filtro">Estado
          <select value={estado} onChange={(e) => { setEstado(e.target.value); setPage(1); }}>
            <option value="">Todos</option>
            {ESTADOS.map((s) => <option key={s} value={s}>{NOMBRE_ESTADO[s]}</option>)}
          </select>
        </label>
      </div>

      <Lista key={`${estado}|${page}|${vez}`} estado={estado} page={page} onPagina={setPage} onVer={setAbierto} />

      {abierto && <PedidoModal id={abierto} onClose={() => setAbierto(null)} onCambio={() => setVez((n) => n + 1)} />}
    </>
  );
}

function Lista({ estado, page, onPagina, onVer }) {
  const { datos, cargando, error, recargar } = useCarga(() => api.pedidosAdmin({ estado, page, limit: 10 }));
  if (cargando) return <Cargando />;
  if (error) return <ErrorCaja mensaje={error} onReintentar={recargar} />;
  if (!datos.data.length) return <Vacio titulo="Sin pedidos" texto={estado ? 'No hay pedidos con ese estado.' : 'Aún no se han realizado pedidos.'} />;
  return (
    <>
      <div className="tabla-caja">
        <table>
          <thead><tr><th>Pedido</th><th>Cliente</th><th>Fecha</th><th>Unid.</th><th>Total</th><th>Estado</th><th /></tr></thead>
          <tbody>
            {datos.data.map((p) => (
              <tr key={p.id}>
                <td><strong>#{p.id}</strong></td>
                <td>{p.cliente_nombre}</td>
                <td>{fecha(p.created_at)}</td>
                <td>{p.unidades}</td>
                <td className="num">{dinero(p.total)}</td>
                <td><EstadoEtiqueta estado={p.estado} /></td>
                <td className="acc"><button className="btn sec chico" onClick={() => onVer(p.id)}>Ver / actualizar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Paginacion paginacion={datos.paginacion} onCambiar={onPagina} />
    </>
  );
}

function PedidoModal({ id, onClose, onCambio }) {
  const { datos, cargando, error, recargar } = useCarga(() => api.pedidoAdmin(id));
  const { toast, confirmar } = useUi();
  const [pedido, setPedido] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const actual = pedido ?? datos;

  const cambiar = async (nuevo) => {
    if (nuevo === 'cancelado') {
      const ok = await confirmar({ titulo: 'Cancelar pedido', texto: 'El stock de los productos volverá al inventario. Esta acción no se puede deshacer.', boton: 'Cancelar pedido', peligro: true });
      if (!ok) return;
    }
    setGuardando(true);
    try {
      setPedido(await api.cambiarEstado(id, nuevo));
      toast(`Pedido #${id}: ${NOMBRE_ESTADO[nuevo].toLowerCase()}.`);
      onCambio();
    } catch (e) { toast(e.message, 'error'); }
    setGuardando(false);
  };

  return (
    <Modal titulo="Detalle del pedido" onClose={onClose} ancho>
      {cargando ? <Cargando /> : error ? <ErrorCaja mensaje={error} onReintentar={recargar} /> : (
        <>
          <PedidoVista pedido={actual} conCliente />
          <div className="estado-botones">
            {TRANSICIONES[actual.estado].length === 0
              ? <span className="texto-suave">Este pedido ya está {NOMBRE_ESTADO[actual.estado].toLowerCase()} y no admite más cambios.</span>
              : TRANSICIONES[actual.estado].map((s) => (
                <button key={s} className={`btn ${s === 'cancelado' ? 'peligro' : ''}`} disabled={guardando} onClick={() => cambiar(s)}>{ACCION[s]}</button>
              ))}
            <button className="btn sec" style={{ marginLeft: 'auto' }} onClick={onClose}>Cerrar</button>
          </div>
        </>
      )}
    </Modal>
  );
}
