import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";
import { removeItemsFromCart } from "../../store/cartSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userData);
  const itemCount = useSelector((state) => state.cart.itemCount);
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(removeItemsFromCart());
    localStorage.removeItem("reduxState");
    navigate("/login");
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);

  const ordersPath = user?.role === "admin" ? "/admin/orders" : "/customer/orders";
  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors ${
        isActive(to)
          ? "text-orange-500"
          : "text-gray-700 hover:text-orange-500"
      }`}
    >
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              className="h-10 w-auto"
              src="https://res.cloudinary.com/satish07/image/upload/v1703265169/zu9dwg52tjgfcha1u2ki.png"
              alt="FlavorFiesta"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/">Menu</NavLink>

            {user && (
              <>
                {user.role === "admin" && (
                  <NavLink to="/admin/products">Products</NavLink>
                )}
                <NavLink to={ordersPath}>Orders</NavLink>
              </>
            )}

            {!user && (
              <>
                <NavLink to="/register">Register</NavLink>
                <Link
                  to="/login"
                  className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                >
                  Sign in
                </Link>
              </>
            )}

            {user && (
              <>
                {/* Cart */}
                <Link
                  to="/cart"
                  className="relative flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-3 py-2 rounded-lg transition"
                  aria-label={`Cart — ${itemCount} items`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  <span>{itemCount}</span>
                </Link>

                {/* User avatar */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen((v) => !v)}
                    className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 text-sm font-bold flex items-center justify-center hover:bg-orange-200 transition focus:outline-none focus:ring-2 focus:ring-orange-400"
                    aria-haspopup="true"
                    aria-expanded={isUserMenuOpen}
                  >
                    {getInitials(user.name)}
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            onClick={() => setIsMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {isMobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            <MobileNavLink to="/">Menu</MobileNavLink>
            {user ? (
              <>
                {user.role === "admin" && (
                  <MobileNavLink to="/admin/products">Products</MobileNavLink>
                )}
                <MobileNavLink to={ordersPath}>Orders</MobileNavLink>
                <MobileNavLink to="/cart">
                  Cart ({itemCount})
                </MobileNavLink>
                <div className="px-3 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">{user.name}</p>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-500 font-medium hover:text-red-600"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <>
                <MobileNavLink to="/register">Register</MobileNavLink>
                <MobileNavLink to="/login">Sign in</MobileNavLink>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

const MobileNavLink = ({ to, children }) => (
  <Link
    to={to}
    className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition"
  >
    {children}
  </Link>
);

export default Navbar;
