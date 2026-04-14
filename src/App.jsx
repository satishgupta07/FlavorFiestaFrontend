/**
 * App.jsx — Root component: routing configuration and route guards.
 *
 * Route hierarchy:
 *  Public      /             Home page (hero + menu)
 *              /login        Login form
 *              /register     Registration form
 *
 *  Protected   /cart                       Shopping cart & checkout (auth required)
 *  (customer)  /customer/orders            Order history (auth required)
 *              /customer/orders/:orderId   Order detail & tracking (auth required)
 *
 *  Admin       /admin/products   Product management (admin role required)
 *              /admin/orders     Order management with status updates (admin role required)
 *
 *  Fallback    *               404 page
 *
 * Route guards:
 *  <ProtectedRoute> — checks Redux auth.status; redirects to /login if not authenticated.
 *  <AdminRoute>     — checks user.role === "admin"; redirects non-admins to /.
 *
 * The <ToastContainer> renders toast notifications globally (used by services/toast.js).
 */
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
        {/* Navbar is rendered on every page */}
        <Navbar />
        <Routes>
          {/* --- Public routes --- */}
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />

          {/* --- Protected routes (logged-in customers) --- */}
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

          {/* --- Admin routes (admin role only) --- */}
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

        {/* Global toast notification container — position defaults to top-right */}
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

/**
 * ProtectedRoute — Redirects unauthenticated users to the login page.
 *
 * Passes the current location via `state.from` so the login page can
 * redirect back after a successful login.
 */
const ProtectedRoute = ({ children }) => {
  const isAuth = useSelector((state) => state.auth.status);

  const location = useLocation();
  return !isAuth ? (
    <Navigate to="/login" state={{ from: location }} />
  ) : (
    children
  );
};

/**
 * AdminRoute — Restricts access to admin users only.
 *
 * Two-stage check:
 *  1. If no user is logged in → redirect to /login
 *  2. If the user is logged in but not an admin → redirect to /
 */
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
