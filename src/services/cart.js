import axios from "axios";
const URL = "http://localhost:8000/api/v1";
const jwtToken = localStorage.getItem("jwtToken");

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${jwtToken}`,
};

export const addToCart = async (productId) => {
  try {
    return await axios.post(`${URL}/cart/item/${productId}`, {}, { headers });
  } catch (error) {
    console.log("Error while adding product to cart !!", error);
  }
};

export const getCart = async () => {
  try {
    return await axios.get(`${URL}/cart`, { headers });
  } catch (error) {
    console.log("Error while fetching cart !!", error);
  }
};
