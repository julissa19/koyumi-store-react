# Koyumi Store

Koyumi Store es una tienda online desarrollada con React, inspirada en una estética cute y pastel. El proyecto permite visualizar productos, filtrarlos, buscarlos, agregarlos al carrito y finalizar una compra. Además, cuenta con autenticación de usuarios y un panel de administración para gestionar (CRUD) productos, cupones y pedidos.

## Funcionalidades principales

- Visualización de productos desde Firebase Firestore.
- Detalle individual de cada producto.
- Carrito de compras utilizando Context API.
- Agregar, quitar, aumentar y disminuir productos del carrito.
- Cálculo automático del total de la compra.
- Sistema de cupones de descuento.
- Registro e inicio de sesión con Firebase Authentication.
- Perfil de usuario con historial de pedidos.
- Creación de pedidos en Firestore.
- Rutas protegidas para usuarios autenticados.
- Rutas exclusivas para administradores.
- Panel administrador para gestionar productos.
- Alta, edición y eliminación de productos.
- Carga de imágenes mediante ImgBB.
- Panel administrador para gestionar cupones.
- Panel administrador para visualizar y actualizar pedidos.
- Búsqueda de productos.
- Paginación.
- Diseño responsive para desktop, tablet y mobile.
- Uso de React Bootstrap, Styled Components, React Icons y React Helmet.

## Tecnologías utilizadas

- React
- Vite
- React Router DOM
- Context API
- Firebase Authentication
- Firebase Firestore
- ImgBB
- React Bootstrap
- Bootstrap
- Styled Components
- React Icons
- React Helmet
- CSS personalizado

## Rutas principales

| Ruta | Descripción |
|---|---|
| `/` | Página de inicio |
| `/productos` | Catálogo de productos |
| `/producto/:id` | Detalle de producto |
| `/carrito` | Carrito de compras |
| `/login` | Inicio de sesión |
| `/registro` | Registro de usuario |
| `/perfil` | Perfil del usuario y pedidos |
| `/admin/productos` | Gestión de productos |
| `/admin/cupones` | Gestión de cupones |
| `/admin/pedidos` | Gestión de pedidos |

## Rutas protegidas y roles

El proyecto utiliza `ProtectedRoute` para controlar el acceso a determinadas secciones.

- Si el usuario no está autenticado, se lo redirige a `/login`.
- Si una ruta tiene `adminOnly={true}`, solo puede acceder un usuario con rol `"admin"`.
- El rol del usuario se obtiene desde Firestore, en la colección `usuarios`.

Ejemplo de ruta protegida para usuarios logueados:

```jsx
<ProtectedRoute>
  <Perfil />
</ProtectedRoute>
```