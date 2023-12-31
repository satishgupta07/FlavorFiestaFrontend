import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../services/menu";
import { addToCart } from "../../services/cart";
import { notify } from "../../services/toast";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../../store/cartSlice";

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const items = useSelector((state) => state.cart.items);
  const jwtToken = useSelector((state) => state.auth.jwtToken);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await getAllProducts();
        setMenu(products.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  async function addToCartAndShowToast(pizzaId) {
    try {
      const data = {
        quantity: 1,
      };
      items.forEach((item) => {
        if (item.productId == pizzaId) {
          data.quantity = item.quantity + 1;
        }
      });
      const updatedCart = await addToCart(pizzaId, data, jwtToken);
      dispatch(
        addItemToCart({
          itemCount: updatedCart.data.data.items.length,
          items: updatedCart.data.data.items,
        })
      );
      if (updatedCart) {
        notify("Product added to cart !!");
      }
    } catch (err) {
      console.log(err);
      alert(err.response.data.message);
    }
  }

  return (
    <section className="menu container mx-auto px-8 py-8">
      <h1 className="text-xl font-bold mb-8">Menu</h1>
      <div className="grid grid-cols--1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 col-gap-12 row-gap-16">
        {menu.map((pizza) => (
          <div key={pizza._id} className="w-full md:w-64 p-4">
            <img
              data-tilt
              className="h-40 mb-4 mx-auto"
              src={pizza.image}
              alt=""
            />
            <div className="text-center">
              <h1 className="mb-4 text-lg">{pizza.name}</h1>
              <span className="size py-1 px-4 rounded-full uppercase text-xs ">
                {pizza.size}
              </span>
              <div className="flex items-center justify-around mt-6">
                <span className="font-bold text-lg">₹{pizza.price}</span>
                <button
                  data-pizza={JSON.stringify(pizza)}
                  key={pizza._id}
                  className="add-to-cart py-1 px-6 bg-transparent hover:bg-orange-500 text-orange-700 font-semibold hover:text-white py-2 px-4 border border-orange-500 hover:border-transparent rounded-full"
                  onClick={() => addToCartAndShowToast(pizza._id)}
                >
                  <span>+</span>
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Menu;
