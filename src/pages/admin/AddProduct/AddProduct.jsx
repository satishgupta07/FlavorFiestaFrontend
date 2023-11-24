import React, { useState } from "react";
import { useForm } from "react-hook-form";
import conf from "../../../config/conf";
import { createNewProduct } from "../../../services/menu";

function AddProduct() {
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const imageUrl = await postDetails(data.image[0]);
      await createNewProduct({
        name: data.name,
        price: parseInt(data.price),
        size: data.size,
        image: imageUrl,
      });
    } catch (error) {
      console.error("Error while creating product:", error);
    }
  };

  const postDetails = async (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", conf.cloudinaryUploadPreset);
    data.append("cloud_name", conf.cloudName);
    data.append("folder", "Menu");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${conf.cloudName}/image/upload`,
        {
          method: "post",
          body: data,
        }
      );
      const responseData = await response.json();
      return responseData.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  return (
    <>
      {/* Modal toggle */}
      <button
        className="inline-block px-4 py-2 rounded-full bg-sky-500"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Add Product
      </button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative p-4 w-full max-w-md max-h-full">
              {/*content*/}
              <div className="relative bg-white rounded-lg shadow">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Create New Product
                  </h3>
                  <button
                    className="text-3xl"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="">×</span>
                  </button>
                </div>
                {/* Modal body */}
                {/* {error && (
                  <p className="text-red-600 mt-8 text-center">{error}</p>
                )} */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-5">
                  <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Type product name"
                        {...register("name", {
                          required: true,
                        })}
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="price"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Price
                      </label>
                      <input
                        type="text"
                        name="price"
                        id="price"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="$2999"
                        {...register("price", {
                          required: true,
                        })}
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="size"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Size
                      </label>
                      <input
                        type="text"
                        name="size"
                        id="size"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Enter Size"
                        {...register("size", {
                          required: true,
                        })}
                      />
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="image"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Product Image
                      </label>
                      <div className="mt-4 relative flex w-full h-[200px] p-2 rounded-md border dark:border-white/20 group ">
                        <div className="w-full h-full rounded-md flex flex-col items-center justify-center dark:group-hover:bg-[#47494A] relative bg-[#EAEBED]/60 group-hover:bg-[#d9dadc]/60 dark:bg-inherit ">
                          <div>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth="0"
                              viewBox="0 0 24 24"
                              className="w-10 h-10 rounded-full dark:bg-[#5A5C5C] p-1.5 text-black/60 bg-[#D8DADF] "
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path fill="none" d="M0 0h24v24H0z"></path>
                              <path d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z"></path>
                            </svg>
                          </div>
                          <div className="font-semibold text-[18px] leading-5 text-black/60 dark:text-white/60 ">
                            Add photos
                          </div>
                          <span className="text-[12px] text-[#949698] dark:text-[#b0b3b8] ">
                            or drag and drop
                          </span>
                        </div>
                        <input
                          type="file"
                          name="image"
                          accept="image/*"
                          className="absolute w-full h-full top-0 left-0 z-[201] cursor-pointer opacity-0 "
                          {...register("image", {
                            required: true,
                          })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                      <svg
                        className="me-1 -ms-1 w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      Add product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}

export default AddProduct;
