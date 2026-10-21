import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Campo from '../components/Campo';

// Formulario de producto (crear y editar) con editor de tallas y stock
export default function ProductoForm({ producto, categorias, onGuardar, onCancelar }) {
  const editando = !!producto;
  const [v, setV] = useState({
    nombre: producto?.nombre ?? '', marca: producto?.marca ?? '', precio: producto?.precio ?? '',
    categoria_id: producto?.categoria_id ?? '', imagen_url: producto?.imagen_url ?? '', descripcion: producto?.descripcion ?? '',
  });
  const [tallas, setTallas] = useState(() =>
    producto?.tallas?.length ? producto.tallas.map((t) => ({ talla: String(t.talla), stock: String(t.stock) })) : [{ talla: '', stock: '' }]);
  const [err, setErr] = useState({});
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const poner = (k) => (e) => setV((x) => ({ ...x, [k]: e.target.value }));
  const ponerTalla = (i, k) => (e) => setTallas((ts) => ts.map((t, j) => (j === i ? { ...t, [k]: e.target.value } : t)));
  const quitarTalla = (i) => setTallas((ts) => (ts.length === 1 ? [{ talla: '', stock: '' }] : ts.filter((_, j) => j !== i)));

  const enviar = async (e) => {
    e.preventDefault();
    const x = {};
    if (v.nombre.trim().length < 2) x.nombre = 'Escribe el nombre del producto.';
    if (v.precio === '' || Number(v.precio) < 0 || Number.isNaN(Number(v.precio))) x.precio = 'Escribe un precio válido.';
    if (v.imagen_url.trim() && !/^https?:\/\/\S+$/i.test(v.imagen_url.trim())) x.imagen_url = 'Debe empezar por http:// o https://';

    const filas = tallas.filter((t) => t.talla.trim() !== '' || t.stock.trim() !== '');
    const xt = {};
    const vistas = new Set();
    filas.forEach((t, i) => {
      const n = Number(t.talla), s = Number(t.stock);
      if (t.talla.trim() === '' || Number.isNaN(n) || n < 15 || n > 55) xt[i] = { ...xt[i], talla: 'Talla entre 15 y 55' };
      else if (vistas.has(n)) xt[i] = { ...xt[i], talla: 'Talla repetida' };
      vistas.add(n);
      if (t.stock.trim() === '' || !Number.isInteger(s) || s < 0) xt[i] = { ...xt[i], stock: 'Entero ≥ 0' };
    });
    if (!editando && filas.length === 0) x.tallas = 'Agrega al menos una talla con su stock.';
    setErr({ ...x, filas: xt });
    if (Object.keys(x).length || Object.keys(xt).length) return;

    const payload = {
      nombre: v.nombre.trim(),
      marca: v.marca.trim() || null,
      precio: Number(v.precio),
      categoria_id: v.categoria_id === '' ? null : Number(v.categoria_id),
      imagen_url: v.imagen_url.trim() || null,
      descripcion: v.descripcion.trim() || null,
      tallas: filas.map((t) => ({ talla: Number(t.talla), stock: Number(t.stock) })),
    };
    // Tallas que existían y el admin quitó del formulario (la API las elimina aparte)
    const eliminadas = (producto?.tallas ?? []).filter((o) => !payload.tallas.some((t) => t.talla === o.talla)).map((o) => o.talla);

    setEnviando(true); setError('');
    try { await onGuardar(payload, eliminadas); }
    catch (ex) { setError(ex.message); setEnviando(false); }
  };

  return (
    <form onSubmit={enviar} noValidate>
      <Campo etiqueta="Nombre" error={err.nombre}>
        {(p) => <input {...p} value={v.nombre} onChange={poner('nombre')} autoFocus />}
      </Campo>
      <div className="fila-2">
        <Campo etiqueta="Marca">{(p) => <input {...p} value={v.marca} onChange={poner('marca')} />}</Campo>
        <Campo etiqueta="Precio (COP)" error={err.precio}>
          {(p) => <input {...p} type="number" min="0" step="100" inputMode="numeric" value={v.precio} onChange={poner('precio')} />}
        </Campo>
      </div>
      <Campo etiqueta="Categoría">
        {(p) => (
          <select {...p} value={v.categoria_id} onChange={poner('categoria_id')}>
            <option value="">Sin categoría</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        )}
      </Campo>
      <Campo etiqueta="URL de la imagen (opcional)" error={err.imagen_url} ayuda="Enlace público a la foto del producto.">
        {(p) => <input {...p} type="url" value={v.imagen_url} onChange={poner('imagen_url')} placeholder="https://…" />}
      </Campo>
      <Campo etiqueta="Descripción (opcional)">
        {(p) => <textarea {...p} value={v.descripcion} onChange={poner('descripcion')} maxLength={5000} />}
      </Campo>

      <div className="campo">
        <label>Tallas y stock</label>
        {tallas.map((t, i) => (
          <div className="talla-fila" key={i}>
            <Campo etiqueta="Talla" error={err.filas?.[i]?.talla}>
              {(p) => <input {...p} type="number" step="0.5" inputMode="decimal" value={t.talla} onChange={ponerTalla(i, 'talla')} />}
            </Campo>
            <Campo etiqueta="Stock" error={err.filas?.[i]?.stock}>
              {(p) => <input {...p} type="number" min="0" step="1" inputMode="numeric" value={t.stock} onChange={ponerTalla(i, 'stock')} />}
            </Campo>
            <button type="button" className="icono-btn" onClick={() => quitarTalla(i)} aria-label="Quitar talla"><Trash2 size={18} /></button>
          </div>
        ))}
        {err.tallas && <div className="campo-error">{err.tallas}</div>}
        <button type="button" className="btn sec chico" style={{ marginTop: 10 }}
          onClick={() => setTallas((ts) => [...ts, { talla: '', stock: '' }])}><Plus size={16} /> Agregar talla</button>
      </div>

      {error && <div className="aviso error" role="alert">{error}</div>}
      <div className="botones">
        <button type="button" className="btn sec" onClick={onCancelar}>Cancelar</button>
        <button className="btn" disabled={enviando}>{enviando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Crear producto'}</button>
      </div>
    </form>
  );
}
