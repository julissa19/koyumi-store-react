import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import ItemDetail from "./components/products/ItemDetail";
import Carrito from "./pages/Carrito";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <Layout>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/producto/:id" element={<ItemDetail />} />
        <Route path="/carrito" element={<Carrito />} />
      </Routes>
    </Layout>
  );
}

export default App;