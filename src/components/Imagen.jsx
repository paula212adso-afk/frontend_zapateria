import { useState } from 'react';
import { Footprints } from 'lucide-react';

// Foto del producto; si no hay URL o falla la carga, muestra un ícono
export default function Imagen({ url, alt, tam = 44 }) {
  const [falla, setFalla] = useState(false);
  if (!url || falla) return <Footprints size={tam} aria-hidden="true" />;
  return <img src={url} alt={alt} loading="lazy" onError={() => setFalla(true)} />;
}
