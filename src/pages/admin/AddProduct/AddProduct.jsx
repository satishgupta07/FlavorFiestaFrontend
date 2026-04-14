import React, { useState } from "react";
import { useForm } from "react-hook-form";
import conf from "../../../config/conf";
import { createNewProduct } from "../../../services/menu";
import { notify } from "../../../services/toast";
import Loader from "../../../components/Loader";

function AddProduct({ onProductAdded }) {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const uploadToCloudinary = async (file) => {
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", conf.cloudinaryUploadPreset);
    form.append("cloud_name", conf.cloudName);
    form.append("folder", "Menu");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${conf.cloudName}/image/upload`,
      { method: "POST", body: form }
    );
    if (!res.ok) throw new Error("Image upload failed");
    const json = await res.json();
    return json.secure_url; // Prefer https
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const imageUrl = await uploadToCloudinary(data.image[0]);
      await createNewProduct({
        name: data.name,
        price: parseInt(data.price, 10),
        size: data.size,
        image: imageUrl,
      });
      notify("Product created successfully!");
      reset();
      setPreview(null);
      setShowModal(false);
      onProductAdded?.(); // Notify parent to refresh product list
    } catch (err) {
      notify(err?.message || "Failed to create product");
      console.error("Error creating product:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImagePreview = (e) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const closeModal = () => {
    setShowModal(false);
    reset();
    setPreview(null);
  };

  // Close on Escape
  const handleKeyDown = (e) => { if (e.key === "Escape") closeModal(); };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-orange-400"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Product
      </button>

      {showModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
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
                <h3 className="font-bold text-gray-900 text-lg">Add New Product</h3>
                <button
                  onClick={closeModal}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="prod-name">
                    Product name
                  </label>
                  <input
                    id="prod-name"
                    type="text"
                    placeholder="e.g. Margherita Pizza"
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                      errors.name ? "border-red-400" : "border-gray-300"
                    }`}
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                </div>

                {/* Price + Size */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="prod-price">
                      Price (₹)
                    </label>
                    <input
                      id="prod-price"
                      type="number"
                      min="1"
                      placeholder="299"
                      className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                        errors.price ? "border-red-400" : "border-gray-300"
                      }`}
                      {...register("price", { required: "Price is required", min: { value: 1, message: "Must be > 0" } })}
                    />
                    {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="prod-size">
                      Size
                    </label>
                    <input
                      id="prod-size"
                      type="text"
                      placeholder="Regular"
                      className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                        errors.size ? "border-red-400" : "border-gray-300"
                      }`}
                      {...register("size", { required: "Size is required" })}
                    />
                    {errors.size && <p className="mt-1 text-xs text-red-500">{errors.size.message}</p>}
                  </div>
                </div>

                {/* Image upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product image
                  </label>
                  <label className="relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition hover:border-orange-400 hover:bg-orange-50 border-gray-200 bg-gray-50 overflow-hidden">
                    {preview ? (
                      <img src={preview} alt="Preview" className="h-full w-full object-contain p-2" />
                    ) : (
                      <div className="text-center">
                        <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-gray-500">Click to upload image</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      {...register("image", { required: "Image is required" })}
                      onChange={(e) => {
                        register("image").onChange(e);
                        handleImagePreview(e);
                      }}
                    />
                  </label>
                  {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image.message}</p>}
                </div>

                {/* Footer */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    {isSubmitting ? "Uploading…" : "Create Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default AddProduct;
