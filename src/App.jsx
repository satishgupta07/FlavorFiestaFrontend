import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Navbar from "./components/Navbar";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Cart from "./pages/customer/Cart";
import Products from "./pages/admin/Products";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Orders from "./pages/customer/Orders";
import OrderDetail from "./pages/customer/OrderDetail";
import AllOrders from "./pages/admin/AllOrders";

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
          <Route exact path="/admin/orders" element={<AllOrders />} />
          <Route exact path="/customer/orders" element={<Orders />} />
          <Route exact path="/customer/orders/:orderId" element={<OrderDetail />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App;
