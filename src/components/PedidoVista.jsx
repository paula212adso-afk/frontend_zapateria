import EstadoEtiqueta from './EstadoEtiqueta';
import { dinero, fecha } from '../lib/formato';

// Detalle de un pedido (lo usan el cliente y el administrador)
export default function PedidoVista({ pedido, conCliente = false }) {
  return (
    <div>
      <div className="pedido-cab">
        <h2>Pedido #{pedido.id}</h2>
        <EstadoEtiqueta estado={pedido.estado} />
        <span className="texto-suave">{fecha(pedido.created_at)}</span>
      </div>

      <div className="info-grid">
        <div className="tarjeta">
          <h3>Envío</h3>
          <p><b>Dirección:</b> {pedido.direccion_envio}</p>
          <p><b>Teléfono:</b> {pedido.telefono}</p>
          {pedido.notas && <p><b>Notas:</b> {pedido.notas}</p>}
        </div>
        {conCliente && (
          <div className="tarjeta">
            <h3>Cliente</h3>
            <p><b>Nombre:</b> {pedido.cliente_nombre}</p>
            <p><b>Correo:</b> {pedido.cliente_email}</p>
          </div>
        )}
      </div>

      <div className="tabla-caja">
        <table>
          <thead><tr><th>Producto</th><th>Talla</th><th>Precio</th><th>Cant.</th><th>Subtotal</th></tr></thead>
          <tbody>
            {pedido.items.map((i) => (
              <tr key={i.id}>
                <td><strong>{i.nombre_producto}</strong></td>
                <td>{i.talla}</td>
                <td className="num">{dinero(i.precio_unitario)}</td>
                <td>{i.cantidad}</td>
                <td className="num">{dinero(i.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="total-fila"><span>Total</span><span className="num">{dinero(pedido.total)}</span></div>
      </div>
    </div>
  );
}
