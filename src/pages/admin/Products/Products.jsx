import React, { useEffect, useState, useCallback } from "react";
import { getAllProducts } from "../../../services/menu";
import AddProduct from "../AddProduct";
import Loader from "../../../components/Loader";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllProducts();
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) return <Loader />;

  return (
    <section className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Products</h1>
            <p className="text-sm text-gray-500 mt-0.5">{products.length} items in catalogue</p>
          </div>
          {/* Passes fetchProducts so the modal can trigger a list refresh after adding */}
          <AddProduct onProductAdded={fetchProducts} />
        </div>

        {products.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-16 text-center">
            <p className="text-gray-400">No products yet. Add your first product to get started.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Image", "Name", "Size", "Price (₹)", "Action"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-4">
                        <div className="w-14 h-14 bg-orange-50 rounded-xl overflow-hidden flex items-center justify-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain p-1"
                            loading="lazy"
                          />
                        </div>
                      </td>
                      <td className="px-5 py-4 font-medium text-gray-900">{product.name}</td>
                      <td className="px-5 py-4">
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                          {product.size}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-semibold text-gray-900">₹{product.price}</td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-gray-400 italic">Edit coming soon</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Products;
