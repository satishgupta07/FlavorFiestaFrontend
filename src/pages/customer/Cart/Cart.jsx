import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addToCart, getCart, removeFromCart } from "../../../services/cart";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../../../store/cartSlice";
import { notify } from "../../../services/toast";
import { createOrder } from "../../../services/order";
import { loadStripe } from "@stripe/stripe-js";
import Loader from "../../../components/Loader";

const Cart = () => {
  const [cart, setCart] = useState();
  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState({
    show: false,
    itemId: "",
  });
  const user = useSelector((state) => state.auth.userData);
  const items = useSelector((state) => state.cart.items);
  const [deliveryData, setDeliveryData] = useState({
    phone: "",
    address: "",
  });
  const dispatch = useDispatch();
  const jwtToken = useSelector((state) => state.auth.jwtToken);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const cart = await getCart(jwtToken);
        setCart(cart.data.data);
        dispatch(
          addItemToCart({
            itemCount: cart.data.data.items.length,
            items: cart.data.data.items,
          })
        );
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  async function removeFromCartAndShowToast(pizzaId) {
    setLoader({
      show: true,
      itemId: pizzaId,
    });
    try {
      const updatedCart = await removeFromCart(pizzaId, jwtToken);
      if (updatedCart) {
        setLoader({
          show: false,
          itemId: "",
        });
        notify("Product removed from cart !!");
        setCart(updatedCart.data.data);
        dispatch(
          addItemToCart({
            itemCount: updatedCart.data.data.items.length,
            items: updatedCart.data.data.items,
          })
        );
      }
    } catch (err) {
      console.log(err);
      alert(err.response.data.message);
    }
  }

  async function increaseQuantity(pizzaId) {
    setLoader({
      show: true,
      itemId: pizzaId,
    });
    try {
      const data = {
        quantity: 1,
      };
      for (const item of items) {
        if (item.productId == pizzaId) {
          data.quantity = item.quantity + 1;
          break;
        }
      }
      const updatedCart = await addToCart(pizzaId, data, jwtToken);
      if (updatedCart) {
        setLoader({
          show: false,
          itemId: "",
        });
        setCart(updatedCart.data.data);
        dispatch(
          addItemToCart({
            itemCount: updatedCart.data.data.items.length,
            items: updatedCart.data.data.items,
          })
        );
      }
    } catch (err) {
      console.log(err);
      alert(err.response.data.message);
    }
  }

  async function decreaseQuantity(pizzaId) {
    setLoader({
      show: true,
      itemId: pizzaId,
    });
    try {
      const data = {
        quantity: 1,
      };
      for (const item of items) {
        if (item.productId == pizzaId) {
          data.quantity = item.quantity - 1;
          break;
        }
      }
      if (data.quantity == 0) {
        await removeFromCartAndShowToast(pizzaId);
      } else {
        const updatedCart = await addToCart(pizzaId, data, jwtToken);
        if (updatedCart) {
          setLoader({
            show: false,
            itemId: "",
          });
          setCart(updatedCart.data.data);
          dispatch(
            addItemToCart({
              itemCount: updatedCart.data.data.items.length,
              items: updatedCart.data.data.items,
            })
          );
        }
      }
    } catch (err) {
      console.log(err);
      alert(err.response.data.message);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function placeOrder() {
    try {
      const data = {
        items,
        totalAmount: cart.cartTotal,
        phone: deliveryData.phone,
        address: deliveryData.address,
      };

      const stripe = await loadStripe(
        import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
      );

      const response = await createOrder(data, jwtToken);

      const result = await stripe.redirectToCheckout({
        sessionId: response.data.data.sessionId,
      });

      if (result.error) {
        console.error("Error redirecting to checkout:", result.error);
      }
    } catch (error) {
      console.error("Error during payment:", error);
    }
  }

  if (loading) {
    return <Loader />;
  } else if (cart && items.length) {
    return (
      <div className="cart py-8">
        <div className="order container mx-auto xl:w-1/2">
          <div className="flex items-center border-b border-grey-300 pb-4">
            <img
              src="https://res.cloudinary.com/satish07/image/upload/v1703332421/syoxokpgrvyq7gxenjfx.png"
              alt="cart"
            />
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
                <div className="flex items-center flex-1">
                  <button
                    type="button"
                    className="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    data-hs-input-number-decrement
                    onClick={() => decreaseQuantity(pizza.productId)}
                  >
                    <svg
                      className="flex-shrink-0 w-3.5 h-3.5"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                    </svg>
                  </button>
                  <span className="mx-2">{pizza.quantity} Pcs</span>
                  <button
                    type="button"
                    className="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    data-hs-input-number-increment
                    onClick={() => increaseQuantity(pizza.productId)}
                  >
                    <svg
                      className="flex-shrink-0 w-3.5 h-3.5"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </button>
                </div>
                {loader.itemId == pizza.productId && loader.show && <Loader />}
                <span className="font-bold text-lg ml-4">{`₹${pizza.total}`}</span>
                <button
                  className="btn"
                  onClick={() => removeFromCartAndShowToast(pizza.productId)}
                >
                  <img
                    className="w-6 h-6 mx-10"
                    src="https://res.cloudinary.com/satish07/image/upload/v1702536967/fgbkqcfa6bqlcrzcnojl.png"
                    alt=""
                  />
                </button>
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
              <div className="mt-6">
                <div>
                  <input
                    name="phone"
                    className="border border-gray-400 p-2 w-1/2 mb-4"
                    type="text"
                    placeholder="Phone number"
                    value={deliveryData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <input
                    name="address"
                    className="border border-gray-400 p-2 w-1/2"
                    type="text"
                    placeholder="Address"
                    value={deliveryData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <button
                    data-tilt
                    className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-6 mt-6 border-b-4 border-orange-700 hover:border-orange-500 rounded-full hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75"
                    type="submit"
                    onClick={() => placeOrder()}
                  >
                    Order Now
                  </button>
                </div>
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
            src="https://res.cloudinary.com/satish07/image/upload/v1703332487/rornwqygdert3etuoqhj.png"
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
