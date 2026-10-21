import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../api/servicios';
import { useCarga } from '../lib/useCarga';
import { Cargando, ErrorCaja } from '../components/Estados';
import PedidoVista from '../components/PedidoVista';

export default function PedidoCliente() {
  const { id } = useParams();
  return <Detalle key={id} id={id} />;
}

function Detalle({ id }) {
  const { datos, cargando, error, recargar } = useCarga(() => api.miPedido(id));
  return (
    <>
      <Link to="/pedidos" className="migas"><ArrowLeft size={16} /> Mis pedidos</Link>
      {cargando ? <Cargando /> : error ? <ErrorCaja mensaje={error} onReintentar={recargar} /> : <PedidoVista pedido={datos} />}
    </>
  );
}
