# Tienda de Zapatos · Frontend

Aplicación web (React + Vite) de la tienda de zapatos. Consume la API REST del repositorio **tienda-zapatos-api**.

**Clientes:** crear cuenta, iniciar sesión, ver/buscar/filtrar productos, ver detalle y tallas, carrito, realizar pedido y consultar sus pedidos.
**Administración** (`/admin/login`): CRUD de productos (con tallas y stock), categorías y gestión de pedidos (ver todos y actualizar estado).

## ¿Cómo se conecta con la API?

Todo se controla con **una sola variable**: `VITE_API_URL` (la dirección de tu API). El código que hace las llamadas está en `src/api/http.js` y `src/api/servicios.js`.

| Dónde | Valor de `VITE_API_URL` |
|---|---|
| Tu computador | `http://localhost:3000` |
| Producción | la URL pública de tu API, por ejemplo `https://tu-api.onrender.com` (**sin `/` al final**) |

Además, la API debe permitir la dirección del frontend (CORS): en la API, la variable `CORS_ORIGIN` debe contener la URL de este frontend. Ver la guía de despliegue más abajo.

## Ejecutarlo en tu computador

1. Ten la API encendida (en su carpeta: `npm start`, puerto 3000).
2. En esta carpeta:
   ```bash
   cp .env.example .env      # en Windows: copy .env.example .env
   npm install
   npm run dev
   ```
3. Abre http://localhost:5173
   - Catálogo público: `/`
   - Administración: `/admin/login` (usuario creado con `npm run seed` en la API; por defecto `admin@tienda.com` / `Admin12345`)

## Variables de entorno

| Variable | Obligatoria | Descripción |
|---|---|---|
| `VITE_API_URL` | Sí | URL de la API, sin `/` final |
| `VITE_NOMBRE_TIENDA` | No | Nombre que se muestra en cabecera y pantallas de acceso |

> El archivo `.env` está en `.gitignore` y **no se sube al repositorio**; solo se sube `.env.example`.
> Las variables de Vite se incorporan al compilar: si cambias `VITE_API_URL` en el hosting, debes **volver a desplegar**.
> Todo lo que empieza por `VITE_` queda visible en el navegador: nunca pongas claves secretas aquí.

## Subir a GitHub

```bash
git init
git add .
git commit -m "Frontend tienda de zapatos"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/tienda-zapatos-frontend.git
git push -u origin main
```

Si subes los archivos arrastrándolos en la web de GitHub, **no subas** `node_modules`, `dist` ni `.env` (la web no respeta `.gitignore`).

## Desplegar en Vercel

1. En https://vercel.com → **Add New… → Project** → importa el repositorio del frontend.
2. Framework: **Vite** (lo detecta solo). Build: `npm run build`. Output: `dist`.
3. En **Environment Variables** agrega `VITE_API_URL` = la URL de tu API (por ejemplo `https://tu-api.onrender.com`).
4. **Deploy**. Vercel te da una URL como `https://tu-tienda.vercel.app`.
5. **Último paso (importante):** ve al servicio de la API y pon esa URL en `CORS_ORIGIN` (sin `/` final); reinicia/redespliega la API. Sin esto el navegador bloqueará las peticiones.

`vercel.json` ya incluye la regla para que las rutas (`/carrito`, `/admin/...`) funcionen al recargar la página. Para Netlify se incluye `public/_redirects`.

## Estructura (`src/`)

```
api/          http.js (conexión, token, errores) y servicios.js (todas las llamadas a la API)
auth/         sesiones separadas para cliente y admin (localStorage)
carrito/      estado del carrito sincronizado con la API
pages/        Catálogo, detalle de producto, carrito, mis pedidos
cliente/      Login y registro de clientes
admin/        Login, Productos (+ formulario de tallas), Categorías, Pedidos
components/   piezas compartidas (menús, modales, formularios, tablas)
```
