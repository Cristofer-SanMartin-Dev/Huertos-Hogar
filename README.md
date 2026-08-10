# HuertoHogar

Tienda online de productos frescos del campo, desarrollada como proyecto full-stack: API REST con Spring Boot y una SPA en React que la consume.

## Funcionalidades principales

- Registro e inicio de sesión con JWT, y edición de perfil con validación de datos (servidor + cliente).
- Catálogo de productos con búsqueda, filtro por categoría, unidad de medida por producto y descuentos.
- Carrito de compras persistente por sesión, checkout y boleta imprimible.
- Reseñas y calificación por estrellas en cada producto.
- Blog de contenido educativo y sección de impacto ambiental.
- Mapa interactivo con las 7 sucursales en Chile.
- Panel de administración: CRUD de productos, categorías, pedidos, mensajes de contacto y reportes.
- Roles `CUSTOMER` / `ADMIN` con rutas protegidas en ambos extremos (frontend y backend).

## Stack tecnológico

**Backend** — `huerto-hogar-backend/`
- Java 21, Spring Boot 3.5.7
- Spring Security + JWT (jjwt) para autenticación stateless
- Spring Data JPA / Hibernate, MySQL
- springdoc-openapi (Swagger UI)
- JUnit 5 + MockMvc para pruebas de integración

**Frontend** — `huerto-hogar-react/`
- React 18 + Vite 5, React Router 6
- Bootstrap 5, Axios
- Context API para sesión (`AuthContext`) y carrito (`CartContext`)
- Leaflet / react-leaflet para el mapa de sucursales
- Vitest + React Testing Library

## Cómo levantar el proyecto

### Requisitos

- Java 21 y Maven (o usar el wrapper `./mvnw` incluido)
- Node.js 18+
- MySQL 8

### Backend

```bash
cd huerto-hogar-backend
./mvnw spring-boot:run
```

Por defecto se conecta a `jdbc:mysql://localhost:3307/huertohogar_db` con usuario `root`. Todos los valores sensibles (credenciales de BD, clave JWT, email del admin) se leen de variables de entorno — ver el detalle en [huerto-hogar-backend/README.md](huerto-hogar-backend/README.md).

La API queda en `http://localhost:8080`, con documentación interactiva en `http://localhost:8080/swagger-ui/index.html`.

### Frontend

```bash
cd huerto-hogar-react
npm install
npm run dev
```

Queda disponible en `http://localhost:5173` y espera la API en `http://localhost:8080`.

## Tests

```bash
# Backend (40 tests)
cd huerto-hogar-backend && ./mvnw test

# Frontend (25 tests)
cd huerto-hogar-react && npm test
```

## Estructura del repositorio

```
huerto-hogar-backend/   API REST (controller / service / repository / model / dto / security)
huerto-hogar-react/     SPA (pages / components / context / services)
```
