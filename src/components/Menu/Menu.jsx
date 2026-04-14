import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../services/menu";
import { addToCart } from "../../services/cart";
import { notify } from "../../services/toast";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../../store/cartSlice";
import Loader from "../Loader";

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null); // tracks which item is being added
  const items = useSelector((state) => state.cart.items);
  const isLoggedIn = useSelector((state) => state.auth.status);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts();
        setMenu(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    if (!isLoggedIn) {
      notify("Please sign in to add items to your cart");
      return;
    }
    setAddingId(product._id);
    try {
      // Calculate the new quantity — increment if already in cart, else start at 1
      const existing = items.find((i) => i.productId === product._id);
      const quantity = existing ? existing.quantity + 1 : 1;

      const res = await addToCart(product._id, { quantity });
      dispatch(
        addItemToCart({
          itemCount: res.data.data.items.length,
          items: res.data.data.items,
        })
      );
      notify(`${product.name} added to cart!`);
    } catch (err) {
      notify(err?.response?.data?.message || "Could not add to cart");
    } finally {
      setAddingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <section id="menu-section" className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900">Our Menu</h2>
          <span className="text-sm text-gray-500">{menu.length} items</span>
        </div>

        {menu.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No products available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menu.map((product) => (
              <div
                key={product._id}
                className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
              >
                {/* Product image */}
                <div className="relative bg-orange-50 flex items-center justify-center h-44 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-36 object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {/* Size badge */}
                  <span className="absolute top-2 right-2 bg-white text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full border border-gray-200 uppercase tracking-wide">
                    {product.size}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center justify-between mt-auto pt-3">
                    <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={addingId === product._id}
                      className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                      {addingId === product._id ? (
                        <Loader inline />
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      )}
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Menu;
