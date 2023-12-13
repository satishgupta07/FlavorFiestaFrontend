import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCart } from "../../../services/cart";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../../../store/cartSlice";

const Cart = () => {
  const [cart, setCart] = useState();
  const user = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cart = await getCart();
        console.log(cart.data.data);
        setCart(cart.data.data);
        const items = cart.data.data.items;
        const itemCount = cart.data.data.items.length;
        dispatch(addItemToCart({itemCount, items}))
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  if (cart) {
    return (
      <div className="cart py-16">
        <div className="order container mx-auto xl:w-1/2">
          <div className="flex items-center border-b border-grey-300 pb-4">
            <img src="src\assets\cart-black.png" alt="?" />
            <h1 className="font-bold ml-4 text-2xl">Order summary</h1>
          </div>
          <div className="pizza-list">
            {Object.values(cart.items).map((pizza) => (
              <div className="flex items-center my-8" key={pizza.productId}>
                <img className="w-24" src={pizza.image} alt="" />
                <div className="flex-1 ml-4">
                  <h1>{pizza.name}</h1>
                  <span>{pizza.size}</span>
                </div>
                <span className="flex-1">{`${pizza.quantity} Pcs`}</span>
                <span className="font-bold text-lg">{`₹${pizza.total}`}</span>
              </div>
            ))}
          </div>
          <hr />
          <div className="text-right py-4">
            <div>
              <span className="text-lg font-bold">Total Amount:</span>
              <span className="amount text-2xl font-bold ml-2">{`₹${cart.cartTotal}`}</span>
            </div>
            {user ? (
              <div>
                <form action="/orders" method="POST" className="mt-12">
                  <input
                    name="phone"
                    className="border border-gray-400 p-2 w-1/2 mb-4"
                    type="text"
                    placeholder="Phone number"
                  />
                  <input
                    name="address"
                    className="border border-gray-400 p-2 w-1/2"
                    type="text"
                    placeholder="Address"
                  />
                  <div>
                    <button
                      data-tilt
                      className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-6 mt-6 border-b-4 border-orange-700 hover:border-orange-500 rounded-full hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75"
                      type="submit"
                    >
                      Order Now
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-6 mt-6 border-b-4 border-orange-700 hover:border-orange-500 rounded-full hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75"
              >
                Login to continue
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <section className="cart py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2">Cart Empty</h1>
          <p className="text-gray-500 text-lg mb-12">
            You probably haven't ordered a pizza yet.
            <br />
            To order a pizza, go to the main page.
          </p>
          <img
            data-tilt
            className="w-1/5 mx-auto"
            src="src\assets\empty-cart.png"
            alt="empty-cart"
          />
          <Link
            to="/"
            className="bg-orange-500 inline-block px-6 py-2 rounded-full btn-primary text-white font-bold mt-12"
          >
            Go back
          </Link>
        </div>
      </section>
    );
  }
};

export default Cart;
