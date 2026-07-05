import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import ItemDetail from "./components/products/ItemDetail";
import Carrito from "./pages/Carrito";
import ScrollToTop from "./components/ScrollToTop";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Perfil from "./pages/Perfil";
import AdminProductos from "./pages/AdminProductos";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import GestionCupones from "./pages/GestionCupones";

function App() {
  return (
    <Layout>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/producto/:id" element={<ItemDetail />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/productos"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminProductos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/cupones"
          element={
            <ProtectedRoute adminOnly={true}>
              <GestionCupones />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;