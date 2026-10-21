import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/servicios';
import { useCarga } from '../lib/useCarga';
import { dinero, fecha } from '../lib/formato';
import { Cargando, Vacio, ErrorCaja } from '../components/Estados';
import EstadoEtiqueta from '../components/EstadoEtiqueta';
import Paginacion from '../components/Paginacion';

export default function MisPedidos() {
  const [page, setPage] = useState(1);
  return (
    <>
      <div className="pagina-cab"><div><h2>Mis pedidos</h2><p className="texto-suave">Historial de tus compras.</p></div></div>
      <Lista key={page} page={page} onPagina={setPage} />
    </>
  );
}

function Lista({ page, onPagina }) {
  const { datos, cargando, error, recargar } = useCarga(() => api.misPedidos({ page, limit: 10 }));
  if (cargando) return <Cargando />;
  if (error) return <ErrorCaja mensaje={error} onReintentar={recargar} />;
  if (!datos.data.length) return <Vacio titulo="Aún no tienes pedidos" texto="Cuando compres, aparecerán aquí."><Link to="/" className="btn">Ir al catálogo</Link></Vacio>;
  return (
    <>
      <div className="tabla-caja">
        <table>
          <thead><tr><th>Pedido</th><th>Fecha</th><th>Unidades</th><th>Total</th><th>Estado</th><th /></tr></thead>
          <tbody>
            {datos.data.map((p) => (
              <tr key={p.id}>
                <td><strong>#{p.id}</strong></td>
                <td>{fecha(p.created_at)}</td>
                <td>{p.unidades}</td>
                <td className="num">{dinero(p.total)}</td>
                <td><EstadoEtiqueta estado={p.estado} /></td>
                <td className="acc"><Link to={`/pedidos/${p.id}`} className="btn sec chico">Ver detalle</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Paginacion paginacion={datos.paginacion} onCambiar={onPagina} />
    </>
  );
}
