import { Minus, Plus } from 'lucide-react';

// Selector de cantidad con límites
export default function Cantidad({ valor, min = 1, max = 99, onChange, deshabilitado = false }) {
  return (
    <div className="cantidad" role="group" aria-label="Cantidad">
      <button type="button" onClick={() => onChange(valor - 1)} disabled={deshabilitado || valor <= min} aria-label="Disminuir"><Minus size={16} /></button>
      <output aria-live="polite">{valor}</output>
      <button type="button" onClick={() => onChange(valor + 1)} disabled={deshabilitado || valor >= max} aria-label="Aumentar"><Plus size={16} /></button>
    </div>
  );
}
