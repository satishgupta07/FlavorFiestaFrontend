import React from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
  return (
    <section className="cart py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2">Cart Empty</h1>
          <p className="text-gray-500 text-lg mb-12">
            You probably haven't ordered a pizza yet.<br />To order a pizza, go to the main page.
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
};

export default Cart;
