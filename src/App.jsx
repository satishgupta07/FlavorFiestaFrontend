import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import Navbar from "./components/Navbar";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Cart from "./pages/customer/Cart";
import Products from "./pages/admin/Products";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Orders from "./pages/customer/Orders";
import OrderDetail from "./pages/customer/OrderDetail";
import AllOrders from "./pages/admin/AllOrders";
import { useSelector } from "react-redux";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/orders/:orderId"
            element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            exact
            path="/admin/products"
            element={
              <AdminRoute>
                <Products />
              </AdminRoute>
            }
          />
          <Route
            exact
            path="/admin/orders"
            element={
              <AdminRoute>
                <AllOrders />
              </AdminRoute>
            }
          />

          {/* Wildcard route for undefined paths. Shows a 404 error */}
          <Route path="*" element={<p>404 Not found</p>} />
        </Routes>

        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

const ProtectedRoute = ({ children }) => {
  const isAuth = useSelector((state) => state.auth.status);

  const location = useLocation();
  return !isAuth ? (
    <Navigate to="/login" state={{ from: location }} />
  ) : (
    children
  );
};

const AdminRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.userData);
  const location = useLocation();

  if (!user) {
    // Redirect to login if user is not logged in
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (user.role !== "admin") {
    // Redirect to home page if user is not an admin
    return <Navigate to="/" />;
  }
  return children;
};

export default App;
