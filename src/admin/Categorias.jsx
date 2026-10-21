import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { api } from '../api/servicios';
import { useCarga } from '../lib/useCarga';
import { useUi } from '../components/Ui';
import { Cargando, Vacio, ErrorCaja } from '../components/Estados';
import Modal from '../components/Modal';
import Campo from '../components/Campo';

export default function Categorias() {
  const { datos, cargando, error, recargar } = useCarga(api.categorias);
  const { toast, confirmar } = useUi();
  const [form, setForm] = useState(null);

  const eliminar = async (c) => {
    const ok = await confirmar({
      titulo: 'Eliminar categoría', texto: `Se eliminará "${c.nombre}". Sus productos quedarán sin categoría.`, boton: 'Eliminar', peligro: true,
    });
    if (!ok) return;
    try { await api.eliminarCategoria(c.id); toast('Categoría eliminada.'); recargar(); }
    catch (e) { toast(e.message, 'error'); }
  };

  return (
    <>
      <div className="pagina-cab">
        <div><h2>Categorías</h2><p className="texto-suave">Organiza el catálogo por tipo de calzado.</p></div>
        <button className="btn" onClick={() => setForm({})}><Plus size={18} /> Nueva categoría</button>
      </div>

      {cargando ? <Cargando /> : error ? <ErrorCaja mensaje={error} onReintentar={recargar} /> : !datos.length ? (
        <Vacio titulo="Sin categorías" texto="Crea la primera para poder clasificar tus productos." />
      ) : (
        <div className="tabla-caja">
          <table>
            <thead><tr><th>Nombre</th><th>Descripción</th><th>Productos</th><th /></tr></thead>
            <tbody>
              {datos.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.nombre}</strong></td>
                  <td>{c.descripcion || <span className="texto-suave">—</span>}</td>
                  <td>{c.total_productos}</td>
                  <td className="acc">
                    <button className="btn sec chico" onClick={() => setForm(c)}><Pencil size={15} /> Editar</button>
                    <button className="btn peligro chico" onClick={() => eliminar(c)}><Trash2 size={15} /> Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {form && (
        <Modal titulo={form.id ? 'Editar categoría' : 'Nueva categoría'} onClose={() => setForm(null)}>
          <CategoriaForm categoria={form.id ? form : null} onCancelar={() => setForm(null)}
            onGuardado={() => { setForm(null); toast('Categoría guardada.'); recargar(); }} />
        </Modal>
      )}
    </>
  );
}

function CategoriaForm({ categoria, onGuardado, onCancelar }) {
  const [v, setV] = useState({ nombre: categoria?.nombre ?? '', descripcion: categoria?.descripcion ?? '' });
  const [err, setErr] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    if (v.nombre.trim().length < 2) { setErr('Escribe el nombre de la categoría.'); return; }
    setErr(''); setEnviando(true); setError('');
    const cuerpo = { nombre: v.nombre.trim(), descripcion: v.descripcion.trim() || null };
    try {
      if (categoria) await api.editarCategoria(categoria.id, cuerpo); else await api.crearCategoria(cuerpo);
      onGuardado();
    } catch (ex) { setError(ex.message); setEnviando(false); }
  };

  return (
    <form onSubmit={enviar} noValidate>
      <Campo etiqueta="Nombre" error={err}>
        {(p) => <input {...p} value={v.nombre} onChange={(e) => setV({ ...v, nombre: e.target.value })} autoFocus />}
      </Campo>
      <Campo etiqueta="Descripción (opcional)">
        {(p) => <input {...p} value={v.descripcion} onChange={(e) => setV({ ...v, descripcion: e.target.value })} maxLength={255} />}
      </Campo>
      {error && <div className="aviso error" role="alert">{error}</div>}
      <div className="botones">
        <button type="button" className="btn sec" onClick={onCancelar}>Cancelar</button>
        <button className="btn" disabled={enviando}>{enviando ? 'Guardando…' : 'Guardar'}</button>
      </div>
    </form>
  );
}
