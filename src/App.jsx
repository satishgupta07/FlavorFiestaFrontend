import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Navbar from "./components/Navbar";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Cart from "./pages/customer/Cart";
import Products from "./pages/admin/Products";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/cart" element={<Cart />} />
          <Route exact path="/admin/products" element={<Products />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
