import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";
import { removeItemsFromCart } from "../../store/cartSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userData);
  const itemCount = useSelector((state) => state.cart.itemCount);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getInitials = (name) => {
    const initials = name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
    return initials;
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(removeItemsFromCart());
    localStorage.removeItem("reduxState");
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);

    // Close the menu automatically after 2 seconds
    if (!isMenuOpen) {
      setTimeout(() => {
        setIsMenuOpen(false);
      }, 2000);
    }
  };

  return (
    <nav className="container mx-auto flex items-center justify-between py-4 px-4">
      <div>
        <Link to="/">
          <img
            className="h-20"
            src="https://res.cloudinary.com/satish07/image/upload/v1703265169/zu9dwg52tjgfcha1u2ki.png"
            alt="logo"
            id="logo"
          />
        </Link>
      </div>
      <div className="justify-items-end">
        <ul className="flex items-center">
          <li className="ml-6">
            <Link to="/">Menu</Link>
          </li>
          {user ? (
            <>
              {user.role === "admin" ? (
                <li className="ml-6">
                  <Link to="/admin/products">Products</Link>
                </li>
              ) : (
                <></>
              )}
              <li className="ml-6">
                <Link
                  to={
                    user.role === "admin" ? "/admin/orders" : "/customer/orders"
                  }
                >
                  Orders
                </Link>
              </li>
              <li className="ml-6">
                <Link
                  to="/cart"
                  className="inline-block px-4 py-2 rounded-full flex items-center bg-orange-500"
                >
                  <span id="cartCounter" className="text-white font-bold pr-2">
                    {itemCount}
                  </span>
                  <img
                    src="https://res.cloudinary.com/satish07/image/upload/v1703265468/cp1w9bcbmr0bnfm4xma8.png"
                    alt="cart"
                  />
                </Link>
              </li>
              <li className="ml-6 relative">
                {/* Circular icon with initials */}
                <button
                  className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg"
                  onClick={toggleMenu}
                >
                  {getInitials(user.name)}
                </button>
                {/* Menu */}
                {isMenuOpen && (
                  <div className="absolute top-12 right-0 bg-white border border-gray-300 shadow-lg rounded p-4 w-60 flex flex-col items-center">
                    <p className="mb-2">{user.name}</p>
                    <button
                      className="mt-2 inline-block px-4 py-2 rounded-full flex items-center bg-orange-500 text-white"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </li>
            </>
          ) : (
            <>
              <li className="ml-6">
                <Link to="/register">Register</Link>
              </li>
              <li className="ml-6">
                <Link to="/login">Login</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
