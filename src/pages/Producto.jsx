import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { api } from '../api/servicios';
import { useAuth } from '../auth/AuthContext';
import { useCarrito } from '../carrito/CarritoContext';
import { useUi } from '../components/Ui';
import { useCarga } from '../lib/useCarga';
import { dinero } from '../lib/formato';
import { Cargando, ErrorCaja } from '../components/Estados';
import Imagen from '../components/Imagen';
import Cantidad from '../components/Cantidad';

export default function Producto() {
  const { id } = useParams();
  return <Detalle key={id} id={id} />;
}

function Detalle({ id }) {
  const { datos: p, cargando, error, recargar } = useCarga(() => api.producto(id));
  const { sesiones } = useAuth();
  const { agregar } = useCarrito();
  const { toast } = useUi();
  const ir = useNavigate();
  const loc = useLocation();
  const [talla, setTalla] = useState(null);
  const [cant, setCant] = useState(1);
  const [enviando, setEnviando] = useState(false);

  if (cargando) return <Cargando />;
  if (error) return <ErrorCaja mensaje={error} onReintentar={recargar} />;

  const sel = p.tallas.find((t) => t.talla === talla);
  const hayStock = p.tallas.some((t) => t.stock > 0);

  const elegirTalla = (t) => { setTalla(t.talla); setCant(1); };

  const alCarrito = async () => {
    if (!sesiones.cliente) {
      toast('Inicia sesión para agregar productos al carrito.', 'error');
      ir('/cliente/login', { state: { desde: loc.pathname } });
      return;
    }
    if (!sel) { toast('Elige una talla.', 'error'); return; }
    setEnviando(true);
    try {
      await agregar({ producto_id: p.id, talla: sel.talla, cantidad: cant });
      toast('Producto agregado al carrito.');
    } catch (e) { toast(e.message, 'error'); }
    setEnviando(false);
  };

  return (
    <>
      <Link to="/" className="migas"><ArrowLeft size={16} /> Volver al catálogo</Link>
      <div className="detalle">
        <div className="p-img"><Imagen url={p.imagen_url} alt={p.nombre} tam={96} /></div>
        <div>
          {p.marca && <span className="p-marca">{p.marca}{p.categoria ? ` · ${p.categoria}` : ''}</span>}
          <h2>{p.nombre}</h2>
          <div className="p-precio">{dinero(p.precio)}</div>
          {p.descripcion && <p className="desc">{p.descripcion}</p>}

          {hayStock ? (
            <>
              <div className="bloque">
                <strong>Talla</strong>
                <div className="tallas" role="group" aria-label="Elige tu talla">
                  {p.tallas.map((t) => (
                    <button key={t.talla} type="button" className="talla" aria-pressed={t.talla === talla}
                      disabled={t.stock === 0} onClick={() => elegirTalla(t)}>{t.talla}</button>
                  ))}
                </div>
                {sel && sel.stock <= 5 && <p className="texto-suave" style={{ marginTop: 8 }}>¡Quedan solo {sel.stock}!</p>}
              </div>
              <div className="fila-acciones">
                <Cantidad valor={cant} max={sel?.stock ?? 1} onChange={setCant} deshabilitado={!sel} />
                <button className="btn" onClick={alCarrito} disabled={enviando}>
                  <ShoppingCart size={18} /> {enviando ? 'Agregando…' : 'Agregar al carrito'}
                </button>
              </div>
            </>
          ) : (
            <div className="aviso error">Este producto está agotado por ahora.</div>
          )}
        </div>
      </div>
    </>
  );
}
