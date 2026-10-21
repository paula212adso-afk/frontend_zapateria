import { NOMBRE_ESTADO } from '../lib/formato';

export default function EstadoEtiqueta({ estado }) {
  return <span className={`etq ${estado}`}>{NOMBRE_ESTADO[estado] ?? estado}</span>;
}
