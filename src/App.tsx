import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import About from "./pages/About";
import Store from "./pages/Store";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { ShoppingCartProvider } from "./context/ShoppingCartContext";
import Product from "./pages/Product";

function App() {
  return (
    <ShoppingCartProvider>
      <Navbar />
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<Store />} />
          <Route path="/about" element={<About />} />
          <Route path="/product" element={<Product />} />
        </Routes>
      </Container>
    </ShoppingCartProvider>
  );
}

export default App;
