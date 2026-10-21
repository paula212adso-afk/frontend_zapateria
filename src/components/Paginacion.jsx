import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Paginacion({ paginacion, onCambiar }) {
  if (!paginacion || paginacion.paginas <= 1) return null;
  const { page, paginas, total } = paginacion;
  return (
    <nav className="paginacion" aria-label="Paginación">
      <button className="btn sec chico" disabled={page <= 1} onClick={() => onCambiar(page - 1)}><ChevronLeft size={16} /> Anterior</button>
      <span>Página {page} de {paginas} · {total} resultados</span>
      <button className="btn sec chico" disabled={page >= paginas} onClick={() => onCambiar(page + 1)}>Siguiente <ChevronRight size={16} /></button>
    </nav>
  );
}
