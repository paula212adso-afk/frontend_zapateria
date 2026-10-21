import { useState } from 'react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { api } from '../api/servicios';
import { useCarga } from '../lib/useCarga';
import { dinero } from '../lib/formato';
import { useUi } from '../components/Ui';
import { Cargando, Vacio, ErrorCaja } from '../components/Estados';
import Modal from '../components/Modal';
import Imagen from '../components/Imagen';
import Paginacion from '../components/Paginacion';
import ProductoForm from './ProductoForm';

export default function Productos() {
  const [q, setQ] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [page, setPage] = useState(1);
  const [vez, setVez] = useState(0); // fuerza recarga tras crear/editar/eliminar
  const [form, setForm] = useState(null); // null | {} (nuevo) | producto (editar)
  const { toast, confirmar } = useUi();
  const { datos: categorias } = useCarga(api.categorias);

  const guardar = async (payload, eliminadas) => {
    if (form.id) {
      await api.editarProducto(form.id, payload);
      for (const t of eliminadas) await api.eliminarTalla(form.id, t);
      toast('Producto actualizado.');
    } else {
      await api.crearProducto(payload);
      toast('Producto creado.');
    }
    setForm(null); setVez((n) => n + 1);
  };

  const eliminar = async (p) => {
    const ok = await confirmar({
      titulo: 'Eliminar producto', texto: `Se eliminará "${p.nombre}". Los pedidos anteriores conservarán su historial.`, boton: 'Eliminar', peligro: true,
    });
    if (!ok) return;
    try { await api.eliminarProducto(p.id); toast('Producto eliminado.'); setVez((n) => n + 1); }
    catch (e) { toast(e.message, 'error'); }
  };

  return (
    <>
      <div className="pagina-cab">
        <div><h2>Productos</h2><p className="texto-suave">Registra, modifica y elimina productos del catálogo.</p></div>
        <button className="btn" onClick={() => setForm({})}><Plus size={18} /> Nuevo producto</button>
      </div>

      <form className="buscador" role="search" onSubmit={(e) => { e.preventDefault(); setBusqueda(q.trim()); setPage(1); }}>
        <Search size={18} />
        <input type="search" placeholder="Buscar por nombre o marca…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar productos" />
      </form>

      <Tabla key={`${busqueda}|${page}|${vez}`} q={busqueda} page={page} onPagina={setPage} onEditar={setForm} onEliminar={eliminar} />

      {form && (
        <Modal titulo={form.id ? 'Editar producto' : 'Nuevo producto'} onClose={() => setForm(null)} ancho>
          <ProductoForm producto={form.id ? form : null} categorias={categorias ?? []} onGuardar={guardar} onCancelar={() => setForm(null)} />
        </Modal>
      )}
    </>
  );
}

function Tabla({ q, page, onPagina, onEditar, onEliminar }) {
  const { datos, cargando, error, recargar } = useCarga(() => api.productos({ q, page, limit: 10 }));
  if (cargando) return <Cargando />;
  if (error) return <ErrorCaja mensaje={error} onReintentar={recargar} />;
  if (!datos.data.length) return <Vacio titulo="Sin productos" texto={q ? 'No hay resultados para tu búsqueda.' : 'Crea el primer producto con el botón “Nuevo producto”.'} />;
  return (
    <>
      <div className="tabla-caja">
        <table>
          <thead><tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th /></tr></thead>
          <tbody>
            {datos.data.map((p) => {
              const stock = p.tallas.reduce((s, t) => s + t.stock, 0);
              return (
                <tr key={p.id}>
                  <td>
                    <span className="persona">
                      <span className="thumb"><Imagen url={p.imagen_url} alt="" tam={22} /></span>
                      <span>{p.nombre}<br /><small className="texto-suave">{p.marca}</small></span>
                    </span>
                  </td>
                  <td>{p.categoria ?? <span className="texto-suave">—</span>}</td>
                  <td className="num">{dinero(p.precio)}</td>
                  <td>{stock === 0 ? <span className="etq cancelado">Agotado</span> : <span className="etq">{stock} u. · {p.tallas.length} tallas</span>}</td>
                  <td className="acc">
                    <button className="btn sec chico" onClick={() => onEditar(p)}><Pencil size={15} /> Editar</button>
                    <button className="btn peligro chico" onClick={() => onEliminar(p)}><Trash2 size={15} /> Eliminar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Paginacion paginacion={datos.paginacion} onCambiar={onPagina} />
    </>
  );
}
