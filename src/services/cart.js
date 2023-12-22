import axios from "axios";
const URL = "http://localhost:8000/api/v1";

export const addToCart = async (productId, data, jwtToken) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };
  try {
    return await axios.post(`${URL}/cart/item/${productId}`, data, { headers });
  } catch (error) {
    console.log("Error while adding product to cart !!", error);
  }
};

export const getCart = async (jwtToken) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };
  try {
    return await axios.get(`${URL}/cart`, { headers });
  } catch (error) {
    console.log("Error while fetching cart !!", error);
  }
};

export const removeFromCart = async (productId, jwtToken) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };
  try {
    return await axios.delete(`${URL}/cart/item/${productId}`, { headers });
  } catch (error) {
    console.log("Error while removing product from cart !!", error);
  }
};

export const clearCart = async (jwtToken) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };

  try {
    await axios.delete(`${URL}/cart/clear`, { headers });
  } catch (error) {
    console.error("Error while clearing the cart:", error);
  }
};
