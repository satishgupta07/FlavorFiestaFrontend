import axios from "axios";
const URL = "https://flavor-fiesta-backend.onrender.com/api/v1";

export const getAllProducts = async () => {
  try {
    return await axios.get(`${URL}/products`);
  } catch (error) {
    console.log("Error while fetching products !!", error);
  }
};

export const createNewProduct = async (data, jwtToken) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };
  try {
    return await axios.post(`${URL}/products`, data, { headers });
  } catch (error) {
    console.log("Error while creating new product !!", error);
  }
};
