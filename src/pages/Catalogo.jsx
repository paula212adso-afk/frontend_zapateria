import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { api } from '../api/servicios';
import { useCarga } from '../lib/useCarga';
import { Cargando, Vacio, ErrorCaja } from '../components/Estados';
import ProductoCard from '../components/ProductoCard';
import Paginacion from '../components/Paginacion';
import { NOMBRE_TIENDA } from '../lib/config';

const TALLAS = Array.from({ length: 14 }, (_, i) => 34 + i);
const ORDENES = [
  ['recientes', 'Más recientes'], ['precio_asc', 'Precio: menor a mayor'],
  ['precio_desc', 'Precio: mayor a menor'], ['nombre', 'Nombre (A–Z)'],
];

export default function Catalogo() {
  const [sp, setSp] = useSearchParams();
  const params = Object.fromEntries(sp.entries());
  const { datos: categorias } = useCarga(api.categorias);

  // Guarda los filtros en la URL (así se pueden compartir y el botón "atrás" funciona)
  const aplicar = (nuevos) => {
    const n = { ...nuevos };
    Object.keys(n).forEach((k) => { if (n[k] === '' || n[k] == null || (k === 'page' && Number(n[k]) <= 1)) delete n[k]; });
    setSp(n);
  };

  return (
    <>
      <section className="hero">
        <h1>Encuentra tu próximo par.</h1>
        <p>Calzado para cada ocasión en {NOMBRE_TIENDA}. Busca, filtra y compra en minutos.</p>
      </section>
      <Filtros key={sp.toString()} params={params} categorias={categorias ?? []} onAplicar={(f) => aplicar(f)} />
      <Lista key={`l-${sp.toString()}`} params={params} onPagina={(page) => aplicar({ ...params, page })} />
    </>
  );
}

function Filtros({ params, categorias, onAplicar }) {
  const [f, setF] = useState({
    q: params.q ?? '', categoria_id: params.categoria_id ?? '', talla: params.talla ?? '',
    precio_min: params.precio_min ?? '', precio_max: params.precio_max ?? '', orden: params.orden ?? 'recientes',
  });
  const poner = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const ponerYAplicar = (k) => (e) => { const n = { ...f, [k]: e.target.value }; setF(n); onAplicar(n); };

  return (
    <form className="filtros" onSubmit={(e) => { e.preventDefault(); onAplicar(f); }} role="search">
      <label className="filtro">Buscar
        <input type="search" placeholder="Nombre, marca…" value={f.q} onChange={poner('q')} />
      </label>
      <label className="filtro">Categoría
        <select value={f.categoria_id} onChange={ponerYAplicar('categoria_id')}>
          <option value="">Todas</option>
          {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
      </label>
      <label className="filtro">Talla
        <select value={f.talla} onChange={ponerYAplicar('talla')}>
          <option value="">Todas</option>
          {TALLAS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </label>
      <label className="filtro">Precio mín.
        <input type="number" min="0" step="1000" inputMode="numeric" value={f.precio_min} onChange={poner('precio_min')} />
      </label>
      <label className="filtro">Precio máx.
        <input type="number" min="0" step="1000" inputMode="numeric" value={f.precio_max} onChange={poner('precio_max')} />
      </label>
      <label className="filtro">Ordenar por
        <select value={f.orden} onChange={ponerYAplicar('orden')}>
          {ORDENES.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
        </select>
      </label>
      <div className="botones">
        <button className="btn"><Search size={16} /> Buscar</button>
        <button type="button" className="btn sec" onClick={() => onAplicar({})}>Limpiar</button>
      </div>
    </form>
  );
}

function Lista({ params, onPagina }) {
  const { datos, cargando, error, recargar } = useCarga(() => api.productos({ ...params, limit: 12 }));
  if (cargando) return <Cargando />;
  if (error) return <ErrorCaja mensaje={error} onReintentar={recargar} />;
  if (!datos.data.length) return <Vacio titulo="No encontramos productos" texto="Prueba con otros filtros o quita alguno." />;
  return (
    <>
      <div className="productos">{datos.data.map((p) => <ProductoCard key={p.id} p={p} />)}</div>
      <Paginacion paginacion={datos.paginacion} onCambiar={onPagina} />
    </>
  );
}
