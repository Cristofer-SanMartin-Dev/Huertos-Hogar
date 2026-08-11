# HuertoHogar — Frontend

SPA en React 18 + Vite para la tienda online HuertoHogar. Ver el [README principal](../README.md) para una visión general del proyecto completo (incluye el backend).

## Tabla de contenidos

- [Arquitectura y manejo de estado](#arquitectura-y-manejo-de-estado)
- [Rutas](#rutas)
- [Ejecutar en desarrollo](#ejecutar-en-desarrollo)
- [Scripts disponibles](#scripts-disponibles)
- [Configuración de la API](#configuración-de-la-api)
- [Tests](#tests)
- [Estructura](#estructura)
- [Stack](#stack)

## Arquitectura y manejo de estado

No hay Redux ni librerías externas de estado: el proyecto usa la Context API de React porque el estado global que necesita es acotado (sesión y carrito) y no justifica una dependencia extra.

- **`AuthContext`** — guarda el usuario y el JWT. Persiste en `localStorage` para sobrevivir a un recargo de página, expone `login`/`logout`/`updateUser`, y es lo que consulta `ProtectedRoute` para decidir si deja pasar a una ruta (y, con `role="ADMIN"`, si además exige ese rol).
- **`CartContext`** — estado del carrito, con validación de stock antes de agregar o incrementar una cantidad (si el producto no tiene stock suficiente, avisa con un toast en vez de agregarlo silenciosamente).

Cada llamada a la API pasa por `services/` (un archivo por recurso: `productService`, `orderService`, etc.), que usa una instancia de Axios (`services/http.js`) configurada para adjuntar el token JWT automáticamente. Las páginas y componentes no llaman a Axios directamente.

## Rutas

**Públicas**

| Ruta | Página |
|---|---|
| `/` | Home |
| `/productos` | Catálogo con búsqueda y filtro por categoría |
| `/categorias` | Categorías (tarjetas con flip al hover) |
| `/ofertas` | Productos con descuento |
| `/nosotros` | Misión, visión y mapa de sucursales |
| `/contacto` | Formulario de contacto |
| `/blog`, `/blog/:articleId` | Listado y detalle de artículos |
| `/carrito` | Carrito de compras |
| `/pago-exitoso`, `/pago-error` | Resultado del checkout |
| `/login`, `/register` | Autenticación |

**Protegidas** (requieren sesión — `ProtectedRoute`)

| Ruta | Página |
|---|---|
| `/checkout` | Confirmación de compra |
| `/pedidos/:id` | Detalle de un pedido / boleta |
| `/perfil` | Datos personales e historial de compras |

**Panel de administración** (requieren sesión + rol `ADMIN` — `ProtectedRoute role="ADMIN"`, layout propio en `AdminLayout`)

| Ruta | Página |
|---|---|
| `/admin` | Dashboard con estadísticas |
| `/admin/productos`, `/nuevo`, `/editar/:id` | CRUD de productos |
| `/admin/categorias` | Gestión de categorías |
| `/admin/ordenes` | Pedidos: ver todos y cambiar estado |
| `/admin/mensajes` | Mensajes de contacto recibidos |
| `/admin/usuarios` | Listado de usuarios |
| `/admin/reportes` | Reportes agregados |

## Ejecutar en desarrollo

```bash
npm install
npm run dev
```

Queda disponible en `http://localhost:5173` y espera que la API del backend esté corriendo en `http://localhost:8080`.

## Scripts disponibles

```bash
npm run dev       # servidor de desarrollo con HMR
npm run build     # build de producción en dist/
npm run preview   # sirve el build de producción localmente
npm test          # tests con Vitest (25 tests)
npm run lint      # ESLint
```

## Configuración de la API

La URL base de la API está definida en `src/services/http.js` (`API_BASE_URL`), actualmente fija a `http://localhost:8080`. No hay un sistema de variables de entorno (`.env`) todavía: para apuntar a otro backend hay que editar ese archivo directamente.

## Tests

```bash
npm test
```

25 pruebas con Vitest + React Testing Library sobre componentes y páginas clave: login, checkout (creación de pedido y qué pasa si falla por stock insuficiente), carrito, header, reseñas, ofertas, calificación por estrellas y el cliente HTTP.

## Estructura

```
src/
  pages/        Una página por ruta (pages/admin/ para el panel)
  components/   Componentes reutilizables (ProductCard, Header, modales, ProtectedRoute, etc.)
  context/      Estado global: AuthContext (sesión) y CartContext (carrito)
  services/     Llamadas a la API (Axios) — un archivo por recurso
  data/         Datos estáticos (p. ej. sucursales para el mapa)
  utils/        Helpers puntuales (p. ej. compartir producto)
  tests/        Pruebas con Vitest + React Testing Library
```

## Stack

React 18, React Router 6, Bootstrap 5, Axios, react-toastify, Leaflet / react-leaflet (mapa de sucursales), Vitest + React Testing Library.
