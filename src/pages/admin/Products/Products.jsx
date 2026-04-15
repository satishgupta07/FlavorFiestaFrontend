import { useEffect, useState, useCallback } from "react";
import { getAllProducts, deleteProduct, updateProduct } from "../../../services/menu";
import AddProduct from "../AddProduct";
import EditProduct from "../EditProduct/EditProduct";
import { notify } from "../../../services/toast";
import Loader from "../../../components/Loader";

function Products() {
  const [products, setProducts]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingId, setDeletingId]         = useState(null);
  const [togglingId, setTogglingId]         = useState(null);

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

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeletingId(product._id);
    try {
      await deleteProduct(product._id);
      notify(`"${product.name}" deleted`);
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
    } catch (err) {
      notify(err?.response?.data?.message || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStock = async (product) => {
    setTogglingId(product._id);
    try {
      await updateProduct(product._id, { inStock: !product.inStock });
      setProducts((prev) =>
        prev.map((p) => p._id === product._id ? { ...p, inStock: !p.inStock } : p)
      );
    } catch (err) {
      notify("Failed to update stock status");
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <section className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Products</h1>
              <p className="text-sm text-gray-500 mt-0.5">{products.length} items in catalogue</p>
            </div>
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
                      {["Image", "Name", "Category", "Price (₹)", "In Stock", "Actions"].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50 transition">
                        {/* Image */}
                        <td className="px-5 py-4">
                          <div className="w-12 h-12 bg-orange-50 rounded-xl overflow-hidden flex items-center justify-center">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain p-1"
                              loading="lazy"
                            />
                          </div>
                        </td>

                        {/* Name + description */}
                        <td className="px-5 py-4 max-w-xs">
                          <p className="font-medium text-gray-900 truncate">{product.name}</p>
                          {product.description && (
                            <p className="text-xs text-gray-400 truncate mt-0.5">{product.description}</p>
                          )}
                        </td>

                        {/* Category */}
                        <td className="px-5 py-4">
                          <span className="inline-block bg-orange-50 text-orange-500 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {product.category || "—"}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-5 py-4 font-semibold text-gray-900">₹{product.price}</td>

                        {/* In-Stock toggle */}
                        <td className="px-5 py-4">
                          <button
                            onClick={() => handleToggleStock(product)}
                            disabled={togglingId === product._id}
                            title={product.inStock ? "Mark as out of stock" : "Mark as in stock"}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1 disabled:opacity-50 ${
                              product.inStock !== false ? "bg-orange-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                                product.inStock !== false ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingProduct(product)}
                              className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product)}
                              disabled={deletingId === product._id}
                              className="inline-flex items-center gap-1 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                            >
                              {deletingId === product._id ? (
                                <Loader inline />
                              ) : (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                              Delete
                            </button>
                          </div>
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

      {editingProduct && (
        <EditProduct
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onProductSaved={() => {
            setEditingProduct(null);
            fetchProducts();
          }}
        />
      )}
    </>
  );
}

export default Products;
