/**
 * Cart.jsx — Shopping cart page and checkout entry point.
 *
 * Renders three states:
 *  1. Loading spinner while fetching the cart
 *  2. Empty cart with a CTA to the menu
 *  3. Populated cart with quantity controls, delivery form, and Stripe checkout
 */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addToCart, getCart, removeFromCart } from "../../../services/cart";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../../../store/cartSlice";
import { notify } from "../../../services/toast";
import { createOrder } from "../../../services/order";
import { loadStripe } from "@stripe/stripe-js";
import Loader from "../../../components/Loader";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [deliveryData, setDeliveryData] = useState({ phone: "", address: "" });

  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  // Sync cart from API on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getCart();
        const cartData = res.data.data;
        setCart(cartData);
        dispatch(addItemToCart({ itemCount: cartData.items.length, items: cartData.items }));
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [dispatch]);

  const syncCart = (updatedData) => {
    setCart(updatedData);
    dispatch(addItemToCart({ itemCount: updatedData.items.length, items: updatedData.items }));
  };

  const handleQuantityChange = async (productId, delta) => {
    const current = items.find((i) => i.productId === productId);
    if (!current) return;
    const newQty = current.quantity + delta;

    setAddingId(productId);
    try {
      if (newQty <= 0) {
        const res = await removeFromCart(productId);
        syncCart(res.data.data);
        notify("Item removed from cart");
      } else {
        const res = await addToCart(productId, { quantity: newQty });
        syncCart(res.data.data);
      }
    } catch (err) {
      notify(err?.response?.data?.message || "Failed to update cart");
    } finally {
      setAddingId(null);
    }
  };

  const handleRemove = async (productId) => {
    setAddingId(productId);
    try {
      const res = await removeFromCart(productId);
      syncCart(res.data.data);
      notify("Item removed from cart");
    } catch (err) {
      notify("Failed to remove item");
    } finally {
      setAddingId(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryData((prev) => ({ ...prev, [name]: value }));
  };

  const placeOrder = async () => {
    if (!deliveryData.phone || !deliveryData.address) {
      notify("Please enter phone and address");
      return;
    }
    setPlacingOrder(true);
    try {
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      const res = await createOrder({
        items,
        totalAmount: cart.cartTotal,
        phone: deliveryData.phone,
        address: deliveryData.address,
      });
      await stripe.redirectToCheckout({ sessionId: res.data.data.sessionId });
    } catch (err) {
      notify(err?.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <Loader />;

  if (!cart || cart.items.length === 0) {
    return (
      <section className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-20 px-4">
        <img
          className="w-36 mb-6 opacity-60"
          src="https://res.cloudinary.com/satish07/image/upload/v1703332487/rornwqygdert3etuoqhj.png"
          alt="Empty cart"
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-xs">
          Looks like you haven't added anything yet. Browse the menu and find something you love!
        </p>
        <Link
          to="/"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition"
        >
          Browse Menu
        </Link>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-8">Your Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart items */}
          <div className="flex-1 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.productId}
                className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm"
              >
                <img src={item.image} alt={item.name} className="w-20 h-20 object-contain rounded-xl bg-orange-50 p-1" />

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">{item.size}</p>
                  <p className="text-sm font-bold text-orange-500 mt-1">₹{item.price}</p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleQuantityChange(item.productId, -1)}
                    disabled={addingId === item.productId}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:border-orange-400 hover:text-orange-500 disabled:opacity-40 transition"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm font-semibold">
                    {addingId === item.productId ? <Loader inline /> : item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.productId, 1)}
                    disabled={addingId === item.productId}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:border-orange-400 hover:text-orange-500 disabled:opacity-40 transition"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <span className="font-bold text-gray-900 w-16 text-right shrink-0">
                  ₹{item.total}
                </span>

                <button
                  onClick={() => handleRemove(item.productId)}
                  disabled={addingId === item.productId}
                  className="text-gray-300 hover:text-red-400 disabled:opacity-40 transition shrink-0"
                  aria-label="Remove item"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="font-bold text-gray-900 text-lg mb-4">Order Summary</h2>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                {cart.items.map((item) => (
                  <div key={item.productId} className="flex justify-between">
                    <span className="truncate pr-2">{item.name} × {item.quantity}</span>
                    <span className="shrink-0">₹{item.total}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 mb-6 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span>₹{cart.cartTotal}</span>
              </div>

              {/* Delivery details */}
              <div className="space-y-3 mb-5">
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone number"
                  value={deliveryData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
                <input
                  name="address"
                  type="text"
                  placeholder="Delivery address"
                  value={deliveryData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>

              <button
                onClick={placeOrder}
                disabled={placingOrder}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
              >
                {placingOrder ? "Redirecting to payment…" : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
