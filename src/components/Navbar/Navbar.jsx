import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Navbar = () => {
  const user = useSelector((state) => state.auth.userData);
  const handleLogout = () => {
    // Add your logout logic here
    document.getElementById("logout").submit();
  };

  return (
    <nav className="container mx-auto flex items-center justify-between py-4 px-4">
      <div>
        <Link to="/">
          <img src="src\assets\logo.png" alt="logo" id="logo" />
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
                  <Link
                    to="/admin/products"
                  >
                    Products
                  </Link>
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
                <p>{user.name}</p>
                <button onClick={handleLogout}>Logout</button>
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
          <li className="ml-6">
            <Link
              to="/cart"
              className="inline-block px-4 py-2 rounded-full flex items-center bg-orange-500"
            >
              {/* <span id="cartCounter" className="text-white font-bold pr-2">
                {session.cart ? session.cart.totalQty : ""}
              </span> */}
              <img src="src\assets\cart.png" alt="cart" />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
