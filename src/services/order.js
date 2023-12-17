import axios from "axios";
const URL = "http://localhost:8000/api/v1";
const jwtToken = localStorage.getItem("jwtToken");

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${jwtToken}`,
};

export const createOrder = async (data) => {
  try {
    return await axios.post(`${URL}/orders/place-order`, data, { headers });
  } catch (error) {
    console.log("Error while placing the order !!", error);
  }
};

export const getAllOrdersOfUser = async () => {
  try {
    return await axios.get(`${URL}/orders`, { headers });
  } catch (error) {
    console.log("Error while placing the order !!", error);
  }
};

export const getOrderById = async (orderId) => {
  try {
    return await axios.get(`${URL}/orders/${orderId}`, { headers });
  } catch (error) {
    console.log("Error while fetching the order !!", error);
  }
};

export const getAllOrders = async () => {
  try {
    return await axios.get(`${URL}/orders/all-orders`, { headers });
  } catch (error) {
    console.log("Error while placing the order !!", error);
  }
};

export const updateStatus = async (data) => {
  try {
    console.log(data);
    return await axios.post(`${URL}/orders/order/status`, data, { headers });
  } catch (error) {
    console.log("Error while updatind the order status !!", error);
  }
}