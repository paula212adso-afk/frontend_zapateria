import { Link } from 'react-router-dom';
import Imagen from './Imagen';
import { dinero, rangoTallas } from '../lib/formato';

export default function ProductoCard({ p }) {
  const tallas = rangoTallas(p.tallas);
  return (
    <Link to={`/producto/${p.id}`} className="p-card">
      <div className="p-img"><Imagen url={p.imagen_url} alt={p.nombre} tam={56} /></div>
      <div className="p-info">
        {p.marca && <span className="p-marca">{p.marca}</span>}
        <span className="p-nombre">{p.nombre}</span>
        <span className={`p-tallas ${tallas ? '' : 'agotado'}`}>{tallas ?? 'Agotado'}</span>
        <span className="p-precio">{dinero(p.precio)}</span>
      </div>
    </Link>
  );
}
