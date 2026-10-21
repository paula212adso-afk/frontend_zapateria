import { Footprints } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NOMBRE_TIENDA } from '../lib/config';

// Pantalla dividida para login y registro
export default function AuthLayout({ lado, ladoTexto, titulo, subtitulo, pie, children }) {
  return (
    <div className="auth">
      <aside className="auth-lado">
        <Link to="/" className="marca"><Footprints size={22} /> {NOMBRE_TIENDA}</Link>
        <div>
          <h1>{lado}</h1>
          <p>{ladoTexto}</p>
        </div>
      </aside>
      <main className="auth-form">
        <div className="auth-caja">
          <h2>{titulo}</h2>
          <p className="texto-suave">{subtitulo}</p>
          {children}
          {pie && <p className="auth-pie">{pie}</p>}
        </div>
      </main>
    </div>
  );
}
