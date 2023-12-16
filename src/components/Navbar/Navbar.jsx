import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";
import { addItemToCart } from "../../store/cartSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userData);
  const itemCount = useSelector((state) => state.cart.itemCount);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(addItemToCart({ itemCount: 0, items: [] }));
    localStorage.removeItem("reduxState");
    navigate("/login");
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
              <span id="cartCounter" className="text-white font-bold pr-2">
                {itemCount}
              </span>
              <img src="src\assets\cart.png" alt="cart" />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
