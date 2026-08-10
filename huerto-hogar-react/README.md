# HuertoHogar — Frontend

SPA en React 18 + Vite para la tienda online HuertoHogar. Ver el [README principal](../README.md) para una visión general del proyecto completo (incluye el backend).

## Ejecutar en desarrollo

```bash
npm install
npm run dev
```

Queda disponible en `http://localhost:5173` y espera que la API del backend esté corriendo en `http://localhost:8080` (URL definida en `src/services/http.js`).

## Scripts disponibles

```bash
npm run dev       # servidor de desarrollo con HMR
npm run build     # build de producción en dist/
npm run preview   # sirve el build de producción localmente
npm test          # tests con Vitest (25 tests)
npm run lint      # ESLint
```

## Estructura

```
src/
  pages/        Una página por ruta (incluye pages/admin para el panel)
  components/   Componentes reutilizables (ProductCard, Header, modales, etc.)
  context/      Estado global: AuthContext (sesión) y CartContext (carrito)
  services/     Llamadas a la API (axios)
  tests/        Pruebas con Vitest + React Testing Library
```

## Stack

React 18, React Router 6, Bootstrap 5, Axios, react-toastify, Leaflet / react-leaflet (mapa de sucursales), Vitest + React Testing Library.
