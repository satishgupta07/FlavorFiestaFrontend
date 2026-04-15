import { useState } from "react";
import { useForm } from "react-hook-form";
import { updateProduct } from "../../../services/menu";
import { uploadToCloudinary } from "../../../services/cloudinary";
import { PRODUCT_CATEGORIES } from "../../../constants/menu";
import { notify } from "../../../services/toast";
import Loader from "../../../components/Loader";

/**
 * EditProduct — Modal form for updating an existing product's fields.
 *
 * Props:
 *  product       — the product object to pre-fill the form with
 *  onClose       — called when the modal is dismissed without saving
 *  onProductSaved — called after a successful save so the parent can refresh
 */
function EditProduct({ product, onClose, onProductSaved }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(product.image || null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name:        product.name        || "",
      price:       product.price       || "",
      category:    product.category    || "Main Course",
      description: product.description || "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let imageUrl = product.image; // keep existing image unless a new one is selected
      if (data.image?.[0]) {
        imageUrl = await uploadToCloudinary(data.image[0]);
      }

      await updateProduct(product._id, {
        name:        data.name,
        price:       parseInt(data.price, 10),
        category:    data.category,
        description: data.description || "",
        image:       imageUrl,
      });

      notify("Product updated successfully!");
      onProductSaved?.();
      onClose();
    } catch (err) {
      notify(err?.response?.data?.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImagePreview = (e) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleKeyDown = (e) => { if (e.key === "Escape") onClose(); };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        onKeyDown={handleKeyDown}
      >
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-lg">Edit Product</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edit-name">
                Product name
              </label>
              <input
                id="edit-name"
                type="text"
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                  errors.name ? "border-red-400" : "border-gray-300"
                }`}
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edit-category">
                Category
              </label>
              <select
                id="edit-category"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                {...register("category", { required: "Category is required" })}
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edit-price">
                Price (₹)
              </label>
              <input
                id="edit-price"
                type="number"
                min="1"
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                  errors.price ? "border-red-400" : "border-gray-300"
                }`}
                {...register("price", { required: "Price is required", min: { value: 1, message: "Must be > 0" } })}
              />
              {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edit-desc">
                Description <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="edit-desc"
                rows={2}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
                {...register("description")}
              />
            </div>

            {/* Image — optional re-upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product image <span className="text-gray-400 font-normal">(leave blank to keep current)</span>
              </label>
              <label className="relative flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition hover:border-orange-400 hover:bg-orange-50 border-gray-200 bg-gray-50 overflow-hidden">
                {preview ? (
                  <img src={preview} alt="Preview" className="h-full w-full object-contain p-2" />
                ) : (
                  <p className="text-sm text-gray-400">Click to upload a new image</p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  {...register("image")}
                  onChange={(e) => {
                    register("image").onChange(e);
                    handleImagePreview(e);
                  }}
                />
              </label>
            </div>

            {/* Footer */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                {isSubmitting && <Loader inline />}
                {isSubmitting ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditProduct;
